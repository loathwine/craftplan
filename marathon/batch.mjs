// Fable-5 cache marathon batch runner. Processes up to BATCH queued subjects
// from marathon/queue.json: dump prompt -> cache-plan (fable, effort high)
// -> smoke screenshot. Stops the chain on first generation failure (assumed
// five-hour-window drain), probes the window resetsAt, and exits 1 so the
// supervising loop knows to sleep until reset. Run under `nix develop
// .#record` (needs node + chromium + ffmpeg + claude on PATH).
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE = resolve(REPO, 'marathon/queue.json');
const LOG = resolve(REPO, 'marathon/log.txt');
const WINDOW = resolve(REPO, 'marathon/window.json');
const BATCH = parseInt(process.env.MARATHON_BATCH || '5');

const log = (m) => { const line = `${new Date().toISOString()} ${m}`; console.log(line); appendFileSync(LOG, line + '\n'); };
const loadQ = () => JSON.parse(readFileSync(QUEUE, 'utf8'));
const saveQ = (q) => writeFileSync(QUEUE, JSON.stringify(q, null, 2));

function probeWindow() {
  // Tiny stream-json call: completes even when throttled, and its
  // rate_limit_event carries the authoritative resetsAt.
  const r = spawnSync('bash', ['-c',
    `echo "Reply with just OK" | timeout 90 claude -p --model claude-fable-5 --output-format stream-json --verbose 2>&1 | grep rate_limit_event | tail -1`],
    { encoding: 'utf8', cwd: REPO });
  try {
    const e = JSON.parse(r.stdout.trim());
    const info = { probedAt: Math.floor(Date.now() / 1000), ...e.rate_limit_info };
    writeFileSync(WINDOW, JSON.stringify(info, null, 2));
    log(`window probe: resetsAt=${info.resetsAt} (${new Date(info.resetsAt * 1000).toISOString()}) overage=${info.overageStatus}`);
    return info;
  } catch {
    log('window probe: no rate_limit_event parsed');
    return null;
  }
}

const q = loadQ();
const todo = q.subjects.filter(s => s.status === 'queued').slice(0, BATCH);
if (!todo.length) { log('queue empty — nothing to do'); process.exit(0); }
log(`batch start: ${todo.map(s => s.key).join(', ')}`);

let failed = false;
for (const s of todo) {
  const slug = `${s.key}-4x-fable`;
  const promptDump = resolve(REPO, `prompts/${s.key}-4x.prompt.txt`);
  if (!existsSync(promptDump)) {
    const d = spawnSync('node', ['scripts/cache-plan.mjs', '--slug', slug, '--prompt', s.prompt, '--dump-prompt', promptDump], { encoding: 'utf8', cwd: REPO });
    if (!existsSync(promptDump)) { log(`${s.key}: PROMPT DUMP FAILED: ${(d.stdout || '') + (d.stderr || '')}`.slice(0, 500)); }
    else log(`${s.key}: prompt dumped`);
  }
  const t0 = Date.now();
  const r = spawnSync('node', ['scripts/cache-plan.mjs', '--slug', slug, '--prompt', s.prompt, '--model', 'claude-fable-5', '--effort', 'high'],
    { encoding: 'utf8', cwd: REPO, timeout: 1200_000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const wrote = out.match(/wrote .*\.json \((\d+) blocks/);
  const solid = out.match(/-> (\d+) solid \+ (\d+) carve/);
  if (r.status === 0 && wrote) {
    s.status = 'cached';
    s.solid = solid ? parseInt(solid[1]) : null;
    s.carveAir = solid ? parseInt(solid[2]) : null;
    s.genSeconds = Math.round((Date.now() - t0) / 1000);
    log(`${s.key}: cached (${s.solid} solid + ${s.carveAir} air, ${s.genSeconds}s)`);
    saveQ(q);
    const sm = spawnSync('node', ['scripts/smoke-record.mjs', '5', `marathon/smokes/${s.key}.png`,
      `single=${slug}&order=flood-fill&promptText=none`], { encoding: 'utf8', cwd: REPO, timeout: 300_000 });
    if (existsSync(resolve(REPO, `marathon/smokes/${s.key}.png`))) { s.status = 'smoked'; log(`${s.key}: smoked`); }
    else log(`${s.key}: SMOKE FAILED (plan cached fine): ${(sm.stdout || '').slice(-300)}`);
    saveQ(q);
  } else {
    s.attempts = (s.attempts || 0) + 1;
    log(`${s.key}: GENERATION FAILED (attempt ${s.attempts}, exit=${r.status}): ${out.slice(-400).replace(/\n/g, ' | ')}`);
    saveQ(q);
    probeWindow();
    failed = true;
    break; // window likely drained — do not crawl-burn the rest
  }
}
log(`batch end (${failed ? 'stopped on failure' : 'completed'})`);
process.exit(failed ? 1 : 0);
