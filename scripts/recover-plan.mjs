// Recover a plan cache from a <slug>.failed.code.js dump WITHOUT re-calling
// the LLM. cache-plan.mjs writes that dump when the sandbox throws; once the
// underlying cause is fixed (e.g. a stray `export` the sandbox now strips),
// re-run the saved code through the sandbox here instead of paying for the
// model again.
//
// Usage:
//   nix develop --command node scripts/recover-plan.mjs --slug asgard-bifrost
//   ... --radius 22 --vradius 14 --budget 9000   (must match the original run)

import { writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractCode, runSandbox } from './ai.mjs';
import { terrainHeight } from '../public/js/terrain.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLANS_DIR = resolve(__dirname, '..', 'public/data/plans');

const argv = (() => {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const k = arg.slice(2), n = process.argv[i + 1];
      if (n && !n.startsWith('--')) { a[k] = n; i++; } else { a[k] = true; }
    }
  }
  return a;
})();

const SLUG = argv.slug;
if (!SLUG) { console.error('--slug required'); process.exit(1); }
const RADIUS = parseInt(argv.radius || '22');
const VRADIUS = parseInt(argv.vradius || '14');
const BUDGET = parseInt(argv.budget || '9000');
const [ox, , oz] = (argv.origin || '128,0,128').split(',').map(Number);
const ORIGIN = [ox, terrainHeight(ox, oz) + 1, oz];

const dumpPath = resolve(PLANS_DIR, `${SLUG}.failed.code.js`);
const dump = readFileSync(dumpPath, 'utf-8');
const start = dump.indexOf('// --- extracted code ---') + '// --- extracted code ---'.length;
const end = dump.indexOf('// --- raw stdout ---');
const raw = dump.slice(start, end > start ? end : undefined).trim();
const code = extractCode(raw);

// "Limits are suggestions" — enforce a generous safety ceiling, not the tight
// prompt budget, so we never drop blocks the model placed (a head built last
// used to be truncated by the old maxBlocks=BUDGET cap). RADIUS/VRADIUS/BUDGET
// args are kept for the AIR-carve filter below, not for clipping the build.
const relPlan = runSandbox(code, {
  maxX: 40, maxZ: 40, maxY: 64, minY: -24, maxBlocks: 120000,
});
// Same no-op-sky-AIR filter as cache-plan.mjs.
const plan = relPlan.filter(b => b.block !== 0
  || ORIGIN[1] + b.y <= terrainHeight(ORIGIN[0] + b.x, ORIGIN[2] + b.z) + 7);
const nSolid = plan.filter(b => b.block !== 0).length;

const payload = {
  slug: SLUG,
  prompt: null,
  source: 'recovered-from-failed-dump',
  origin: { x: ORIGIN[0], y: ORIGIN[1], z: ORIGIN[2] },
  plan,
  createdAt: new Date().toISOString(),
};
const outPath = resolve(PLANS_DIR, `${SLUG}.json`);
writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`[recover] ${SLUG}: ${nSolid} solid + ${plan.length - nSolid} carve AIR -> ${outPath}`);
