// Self-critique loop (proof of concept): render a cached plan from 4 angles,
// show the model its own code + the contact sheet, get an improved version.
//
//   node marathon/feedback.mjs --base thor-n-opus --model claude-opus-5-5 \
//        --passes 2 [--effort high] [--night 1]
// Writes <base>-fb1.json, <base>-fb2.json (+ .code.js) and contact sheets
// recordings/feedback/<base>-v<N>.png (v1 = the base).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractCode, runSandbox } from '../scripts/ai.mjs';
import { terrainHeight } from '../public/js/terrain.js';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PLANS = resolve(REPO, 'public/data/plans');
const OUT = resolve(REPO, 'recordings/feedback');
mkdirSync(OUT, { recursive: true });
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('base'), MODEL = arg('model'), PASSES = +arg('passes', 2), EFFORT = arg('effort', 'high');
const NIGHT = arg('night', '1') === '1';
if (!BASE || !MODEL) { console.error('--base and --model required'); process.exit(1); }

const ANGLES = [[-90, 'FRONT (camera side, north)'], [0, 'EAST side'], [90, 'BACK (south)'], [180, 'WEST side']];

function sheet(slug, out) {
  const tiles = [];
  for (const [a] of ANGLES) {
    const f = `${out}.a${a}.png`;
    const r = spawnSync('node', ['scripts/smoke-record.mjs', '5', f,
      `single=${slug}&promptText=none&buildFrac=0.02&sweep=0.0001&faceAngleDeg=${a}${NIGHT ? '&moonlight=1' : ''}`],
      { cwd: REPO, encoding: 'utf8', timeout: 300000 });
    if (!existsSync(f)) throw new Error(`smoke failed for ${slug} @${a}: ${(r.stdout || '') + (r.stderr || '')}`.slice(0, 400));
    tiles.push(f);
  }
  const labels = ANGLES.map(([, l], i) => `[${i}]scale=960:540,drawtext=text='${l}':x=16:y=12:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.6[t${i}]`).join(';');
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...tiles.flatMap(t => ['-i', t]),
    '-filter_complex', `${labels};[t0][t1]hstack[r0];[t2][t3]hstack[r1];[r0][r1]vstack`, out], { encoding: 'utf8' });
  if (!existsSync(out)) throw new Error('montage failed');
  return out;
}

function claude(prompt) {
  return new Promise((res, rej) => {
    const args = ['-p', '--model', MODEL, '--output-format', 'json', '--allowedTools', 'Read'];
    if (EFFORT) args.push('--effort', EFFORT);
    const p = spawn('claude', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let so = '', se = '';
    const t = setTimeout(() => { p.kill('SIGTERM'); rej(new Error('timeout')); }, 1200000);
    p.stdout.on('data', d => so += d); p.stderr.on('data', d => se += d);
    p.on('close', c => { clearTimeout(t); if (c) return rej(new Error(`claude exit ${c}: ${se.slice(0, 200)}`));
      try { res(JSON.parse(so).result); } catch { res(so); } });
    p.stdin.end(prompt);
  });
}

const base = JSON.parse(readFileSync(resolve(PLANS, `${BASE}.json`), 'utf8'));
const designPrompt = readFileSync(resolve(REPO, 'prompts', `${BASE.replace(/-(haiku|sonnet|opus|fable)$/, '')}.prompt.txt`), 'utf8');
let prevSlug = BASE;
let prevCode = readFileSync(resolve(PLANS, `${BASE}.code.js`), 'utf8');
const log = [];
for (let pass = 1; pass <= PASSES; pass++) {
  const png = sheet(prevSlug, resolve(OUT, `${BASE}-v${pass}.png`));
  console.log(`[fb] ${BASE} pass ${pass}: rendered ${png}`);
  const prompt = `${designPrompt}

---
REVISION ROUND ${pass} of ${PASSES}. You already wrote code for this design. It was executed and rendered in the game.
Look at the render with the Read tool: ${png}
(2x2 contact sheet: top-left = FRONT as the final video sees it, top-right = east, bottom-left = back, bottom-right = west.${NIGHT ? ' Night lighting; glowing blocks light their surroundings.' : ''})

Your previous code:
\`\`\`js
${prevCode.replace(/^\/\/.*\n/gm, '').slice(0, 60000)}
\`\`\`

First, silently critique the render against the design: is the subject instantly recognizable from the FRONT view? Proportions, silhouette, missing signature features, colours, facing (front must face north/-Z toward the camera), floating or broken parts, wasted blocks.
Then output the COMPLETE improved program (not a diff). Output ONLY JavaScript — no prose, no markdown fences.`;
  const t0 = Date.now();
  const raw = await claude(prompt);
  const code = extractCode(raw);
  const rel = runSandbox(code, { maxX: 40, maxZ: 40, maxY: 64, minY: -24, maxBlocks: 120000 });
  const o = base.origin;
  const plan = rel.filter(b => b.block !== 0 || o.y + b.y <= terrainHeight(o.x + b.x, o.z + b.z) + 7);
  const slug = `${BASE}-fb${pass}`;
  writeFileSync(resolve(PLANS, `${slug}.json`), JSON.stringify({ slug, prompt: base.prompt, source: `ai:${MODEL}:feedback${pass}`, origin: o, plan }, null, 2));
  writeFileSync(resolve(PLANS, `${slug}.code.js`), `// ${slug} — feedback pass ${pass}\n${code}`);
  const solid = plan.filter(b => b.block !== 0).length;
  console.log(`[fb] ${slug}: ${solid} solid, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  log.push({ pass, slug, solid });
  prevSlug = slug; prevCode = code;
}
sheet(prevSlug, resolve(OUT, `${BASE}-v${PASSES + 1}.png`));
console.log(`[fb] done ${BASE}: ${JSON.stringify(log)}`);
