// Combined QA-rotation + truncation re-render orchestrator (NO mux).
// Run inside the record devshell so chromium/ffmpeg are on PATH:
//   nix develop .#record --command node marathon/rerender-run.mjs
//
// Reads marathon/rerender-work.json (produced by rerender-plan.mjs --bake).
// - Renders each changed quadrant via scripts/record-demo.mjs (pool of CONC).
// - Rotated quadrants render the baked <slug>-rot<deg> plan; trunc-only render
//   the base <slug> (whose plan JSON already holds the full re-derived build).
// - Then re-stitches each affected subject's SILENT grid master (overwrite
//   <subject>-4x-grid-10s.mp4). Audio is intentionally NOT muxed.
// Crash-safe: completed render slugs are recorded in rerender-done.json and
// skipped on restart. No LLM calls, no uploads.

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, readdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SH = resolve(ROOT, 'recordings/shorts-mode');
const LOGDIR = resolve(__dirname, 'rr-logs');
const DONE_FILE = resolve(__dirname, 'rerender-done.json');
const MAIN_LOG = resolve(__dirname, 'rerender-batch.log');
const CONC = parseInt(process.env.CONC || '3');
mkdirSync(LOGDIR, { recursive: true });

const work = JSON.parse(readFileSync(resolve(__dirname, 'rerender-work.json'), 'utf8'));
const queue = work.renderQueue;
const subjects = work.subjects;

const ts = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z').replace('T', ' ').slice(11);
const say = (m) => { const line = `${ts()} ${m}`; console.log(line); try { writeFileSync(MAIN_LOG, line + '\n', { flag: 'a' }); } catch {} };

let done = new Set();
try { done = new Set(JSON.parse(readFileSync(DONE_FILE, 'utf8'))); } catch {}
const persistDone = () => writeFileSync(DONE_FILE, JSON.stringify([...done], null, 0));

// header per subject from prompts/<subject>-4x.prompt.txt  Design: "..."
const headerFor = (s) => {
  try {
    const t = readFileSync(resolve(ROOT, `prompts/${s}-4x.prompt.txt`), 'utf8');
    const m = t.match(/Design:\s*"([^"]+)"/);
    if (m) return m[1];
  } catch {}
  return s;
};

function render(slug, out) {
  return new Promise((res) => {
    const outPath = resolve(SH, out);
    const log = resolve(LOGDIR, `${slug}.log`);
    const fd = spawn('node', [
      resolve(ROOT, 'scripts/record-demo.mjs'),
      '--single', slug, '--order', 'flood-fill', '--promptText', 'none',
      '--duration', '10', '--width', '1080', '--height', '1920', '--fps', '30',
      '--out', outPath,
    ], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    const ws = [];
    fd.stdout.on('data', d => ws.push(d));
    fd.stderr.on('data', d => ws.push(d));
    fd.on('close', (code) => {
      try { writeFileSync(log, Buffer.concat(ws)); } catch {}
      const ok = code === 0 && existsSync(outPath) && statSync(outPath).size > 100_000;
      res(ok);
    });
    fd.on('error', () => res(false));
  });
}

async function pool(items, n, worker) {
  const q = [...items];
  let active = 0;
  return new Promise((resolve) => {
    const next = () => {
      if (!q.length && active === 0) return resolve();
      while (active < n && q.length) {
        const item = q.shift();
        active++;
        worker(item).finally(() => { active--; next(); });
      }
    };
    next();
  });
}

// ---- Render phase ----------------------------------------------------------
const todo = queue.filter(w => !done.has(w.renderSlug));
say(`rerender start: ${queue.length} quadrants (${queue.length - todo.length} already done), CONC=${CONC}`);
let ok = 0, fail = [];
let n = 0;
await pool(todo, CONC, async (w) => {
  const i = ++n;
  say(`  [${i}/${todo.length}] render ${w.renderSlug}  (${w.reason})`);
  let good = await render(w.renderSlug, w.out);
  if (!good) { say(`     retry ${w.renderSlug}`); good = await render(w.renderSlug, w.out); }
  if (good) { done.add(w.renderSlug); persistDone(); ok++; say(`     done ${w.renderSlug}`); }
  else { fail.push(w.renderSlug); say(`     FAIL ${w.renderSlug}`); }
});
say(`render phase complete: ok ${ok + (queue.length - todo.length)}/${queue.length}, failed ${fail.length}${fail.length ? ' -> ' + fail.join(', ') : ''}`);

// ---- Stitch phase (NO mux) -------------------------------------------------
const LABELS = { haiku: 'HAIKU 4.5', sonnet: 'SONNET 5', opus: 'OPUS 4.8', fable: 'FABLE 5' };
const ORDER = ['haiku', 'sonnet', 'opus', 'fable'];

function stitch(subject, clips, header) {
  return new Promise((res) => {
    const clipArgs = ORDER.flatMap(m => ['--clip', `${LABELS[m]}|${resolve(SH, clips[m])}`]);
    const out = resolve(SH, `${subject}-4x-grid-10s.mp4`);
    const fd = spawn('node', [
      resolve(ROOT, 'scripts/stitch-grid.mjs'),
      ...clipArgs, '--duration', '10', '--header', `"${header}"`, '--out', out,
    ], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    const ws = [];
    fd.stdout.on('data', d => ws.push(d)); fd.stderr.on('data', d => ws.push(d));
    fd.on('close', (code) => {
      try { writeFileSync(resolve(LOGDIR, `stitch-${subject}.log`), Buffer.concat(ws)); } catch {}
      res(code === 0 && existsSync(out) && statSync(out).size > 100_000);
    });
    fd.on('error', () => res(false));
  });
}

say(`stitch phase: ${subjects.length} subjects`);
let stitched = 0, skipped = [];
for (const { subject, clips } of subjects) {
  const missing = ORDER.filter(m => !existsSync(resolve(SH, clips[m])) || statSync(resolve(SH, clips[m])).size < 100_000);
  if (missing.length) { skipped.push(`${subject} (missing/small: ${missing.map(m => clips[m]).join(', ')})`); say(`  SKIP ${subject}: missing ${missing.join(',')}`); continue; }
  const good = await stitch(subject, clips, headerFor(subject));
  if (good) { stitched++; say(`  GRID DONE (silent): ${subject}-4x-grid-10s.mp4`); }
  else { skipped.push(`${subject} (stitch failed)`); say(`  STITCH FAIL ${subject}`); }
}

say(`\n=== rerender-run complete ===`);
say(`renders: ok ${ok + (queue.length - todo.length)}/${queue.length}, failed ${fail.length}`);
say(`grids stitched (silent): ${stitched}/${subjects.length}`);
if (skipped.length) say(`skipped subjects:\n  ${skipped.join('\n  ')}`);
say(`NOTE: audio not muxed (per instruction). Masters: recordings/shorts-mode/<subject>-4x-grid-10s.mp4`);
writeFileSync(resolve(__dirname, 'rerender-summary.json'), JSON.stringify({
  finishedAt: new Date().toISOString(), rendersOk: ok + (queue.length - todo.length), rendersTotal: queue.length,
  rendersFailed: fail, gridsStitched: stitched, gridsTotal: subjects.length, skipped,
}, null, 2));
