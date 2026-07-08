// Compute the combined re-render work list (QA rotations + truncation fixes) and
// bake any rotated plan variants from the FULL re-derived base plans.
//
// Inputs:
//   qa-decisions.json                     (repo root; per-quadrant ok/rotate)
//   <TRUNC json passed as --trunc>        (subject -> [models] truncated)
// Output:
//   marathon/rerender-work.json           work list + per-subject stitch clips
//   public/data/plans/<slug>-rot<deg>.json  baked rotated variants (90/180/270)
//
// Rotation transform === the QA tool's REMAP (the orientation the user approved):
//   90:(x,z)->[z,-x]  180:(x,z)->[-x,-z]  270:(x,z)->[-z,x]
// Baked into plan coords + rendered at the default hero camera (faceAngleDeg=-90)
// reproduces exactly the QA-approved view.
//
// Usage: node marathon/rerender-plan.mjs --trunc <path> [--bake]

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PLANS = resolve(ROOT, 'public/data/plans');

const argv = process.argv.slice(2);
const BAKE = argv.includes('--bake');
const truncIx = argv.indexOf('--trunc');
const TRUNC_PATH = truncIx >= 0 ? argv[truncIx + 1] : null;

const EXCLUDE = new Set(['dragon', 'giant', 'king-kong', 'pokeball']); // uploaded/scheduled
const MODELS = ['haiku', 'sonnet', 'opus', 'fable'];

const REMAP = {
  90:  (x, z) => [z, -x],
  180: (x, z) => [-x, -z],
  270: (x, z) => [-z, x],
};

const decisions = JSON.parse(readFileSync(resolve(ROOT, 'qa-decisions.json'), 'utf8')).decisions;
const trunc = TRUNC_PATH ? JSON.parse(readFileSync(TRUNC_PATH, 'utf8')) : {};

// subject -> model -> {rotate:bool, deg:int, truncated:bool}
const subjects = new Map();
const ensure = (s) => { if (!subjects.has(s)) subjects.set(s, new Map()); return subjects.get(s); };

for (const [key, d] of Object.entries(decisions)) {
  const s = d.subject, m = d.model;
  const rec = ensure(s).get(m) || { rotate: false, deg: 0, truncated: false };
  if (d.status === 'rotate' && d.rotationDeg) { rec.rotate = true; rec.deg = d.rotationDeg; }
  ensure(s).set(m, rec);
}
for (const [s, models] of Object.entries(trunc)) {
  for (const m of models) {
    const rec = ensure(s).get(m) || { rotate: false, deg: 0, truncated: false };
    rec.truncated = true;
    ensure(s).set(m, rec);
  }
}

const work = [];        // quadrants to render
const stitch = [];      // per-subject stitch definitions
const bakeList = [];
let excluded = [];

for (const [s, models] of [...subjects.entries()].sort()) {
  if (EXCLUDE.has(s)) { excluded.push(s); continue; }
  const changed = [];
  const clips = {}; // model -> mp4 basename to use in stitch
  for (const m of MODELS) {
    const rec = models.get(m) || { rotate: false, deg: 0, truncated: false };
    const base = `${s}-4x-${m}`;
    if (rec.rotate) {
      const rotSlug = `${base}-rot${rec.deg}`;
      clips[m] = `${rotSlug}-10s.mp4`;
      work.push({ subject: s, model: m, deg: rec.deg, renderSlug: rotSlug, out: `${rotSlug}-10s.mp4`,
                  reason: rec.truncated ? 'rotate+trunc' : 'rotate' });
      bakeList.push({ base, rotSlug, deg: rec.deg });
      changed.push(`${m}:rot${rec.deg}${rec.truncated ? '+t' : ''}`);
    } else if (rec.truncated) {
      clips[m] = `${base}-10s.mp4`;
      work.push({ subject: s, model: m, deg: 0, renderSlug: base, out: `${base}-10s.mp4`, reason: 'trunc' });
      changed.push(`${m}:trunc`);
    } else {
      clips[m] = `${base}-10s.mp4`; // reuse existing (OK + untruncated)
    }
  }
  if (changed.length) stitch.push({ subject: s, clips, changed });
}

// Bake rotated plan variants from the full re-derived base.
let baked = 0, bakeFail = [];
if (BAKE) {
  for (const { base, rotSlug, deg } of bakeList) {
    const basePath = resolve(PLANS, `${base}.json`);
    if (!existsSync(basePath)) { bakeFail.push(`${base} (no base json)`); continue; }
    const meta = JSON.parse(readFileSync(basePath, 'utf8'));
    const fn = REMAP[deg];
    if (!fn) { bakeFail.push(`${rotSlug} (bad deg ${deg})`); continue; }
    const rotPlan = meta.plan.map(b => { const [x, z] = fn(b.x, b.z); return { x, y: b.y, z, block: b.block }; });
    writeFileSync(resolve(PLANS, `${rotSlug}.json`),
      JSON.stringify({ ...meta, plan: rotPlan, rotatedFrom: base, rotationDeg: deg,
                       rotateNote: `baked ${deg}deg (QA-approved) from full re-derived base` }, null, 2));
    baked++;
  }
}

writeFileSync(resolve(__dirname, 'rerender-work.json'),
  JSON.stringify({ generatedFor: 'combined QA-rotation + truncation re-render',
                   excluded, subjects: stitch, renderQueue: work }, null, 2));

// Summary
const rotN = work.filter(w => w.deg !== 0).length;
const truncOnlyN = work.filter(w => w.deg === 0).length;
console.log(`subjects affected: ${stitch.length}  (excluded uploaded: ${excluded.join(', ')})`);
console.log(`quadrants to render: ${work.length}  = ${rotN} rotated + ${truncOnlyN} trunc-only`);
console.log(`rotated plans ${BAKE ? 'baked' : 'to bake'}: ${bakeList.length}${BAKE ? ` (ok ${baked})` : ''}`);
if (bakeFail.length) console.log(`BAKE FAILURES:\n  ${bakeFail.join('\n  ')}`);
const byDeg = {};
for (const w of work) if (w.deg) byDeg[w.deg] = (byDeg[w.deg] || 0) + 1;
console.log(`rotation breakdown: ${Object.entries(byDeg).map(([d, n]) => `${d}°×${n}`).join('  ')}`);
console.log(`\nper-subject changed quadrants:`);
for (const st of stitch) console.log(`  ${st.subject.padEnd(16)} ${st.changed.join(', ')}`);
console.log(`\nest. render time @ ~9min/quadrant: ~${(work.length * 9 / 60).toFixed(1)}h`);
