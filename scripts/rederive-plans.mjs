// Re-derive cached plan JSONs from their saved .code.js WITHOUT re-calling any
// model. The old sandbox limits (maxBlocks=4000, Y<=33) truncated big builds by
// emit order — a head built last simply vanished (king-kong / thanos-opus lost
// their upper bodies). We save the full generating program (.code.js), so we can
// re-run it with the limits lifted and recover the complete build for free.
//
// Usage:
//   nix develop --command node scripts/rederive-plans.mjs --dry-run
//   nix develop --command node scripts/rederive-plans.mjs                 # apply
//   nix develop --command node scripts/rederive-plans.mjs --only king-kong,thanos
//
// Writes <slug>.json only when the plan actually changed. Rebuilds any
// <slug>-rot180.json from the freshly re-derived base (same (x,z)->(-x,-z) turn).

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractCode, runSandbox } from './ai.mjs';
import { terrainHeight } from '../public/js/terrain.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLANS = resolve(__dirname, '..', 'public/data/plans');

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const onlyIx = argv.indexOf('--only');
const ONLY = onlyIx >= 0 ? (argv[onlyIx + 1] || '').split(',').filter(Boolean) : null;

// Generous safety ceiling (matches cache-plan.mjs ENF); RAW_OP_CAP in ai.mjs
// (400k) remains the true runaway guard.
const ENF = { maxX: 40, maxZ: 40, maxY: 64, minY: -24, maxBlocks: 120000 };

function loadCode(file) {
  let s = readFileSync(file, 'utf8');
  const m = s.indexOf('// --- extracted code ---');
  if (m >= 0) s = s.slice(m + '// --- extracted code ---'.length);
  const r = s.indexOf('// --- raw stdout ---');
  if (r >= 0) s = s.slice(0, r);
  return extractCode(s);
}
const solid = (plan) => plan.filter(b => b.block !== 0).length;
const wanted = (slug) => !ONLY || ONLY.some(o => slug.includes(o));

// Same no-op-AIR filter cache-plan applies: keep AIR only at/below terrain (+7
// for tree height) — those are real carves; AIR aimed at empty sky deletes
// nothing and would bloat the cache.
function airFilter(relPlan, origin) {
  return relPlan.filter(b => b.block !== 0
    || origin.y + b.y <= terrainHeight(origin.x + b.x, origin.z + b.z) + 7);
}

const codeFiles = readdirSync(PLANS).filter(f => f.endsWith('.code.js'));
let changed = 0, unchanged = 0, failed = 0;
const rederived = new Map(); // baseSlug -> new plan (for rot180 rebuild)

for (const cf of codeFiles) {
  const slug = cf.replace(/\.code\.js$/, '');
  if (!wanted(slug)) continue;
  const jsonPath = resolve(PLANS, `${slug}.json`);
  if (!existsSync(jsonPath)) continue;
  let meta;
  try { meta = JSON.parse(readFileSync(jsonPath, 'utf8')); } catch { continue; }
  const origin = meta.origin || { x: 128, y: 18, z: 128 };
  let plan;
  try {
    plan = airFilter(runSandbox(loadCode(resolve(PLANS, cf)), ENF), origin);
  } catch (e) {
    console.log(`  ✗ ${slug}: ${e.message.slice(0, 80)}`); failed++; continue;
  }
  rederived.set(slug, plan);
  const before = solid(meta.plan || []), after = solid(plan);
  if (JSON.stringify(meta.plan) === JSON.stringify(plan)) { unchanged++; continue; }
  changed++;
  console.log(`  ${DRY ? '[dry] ' : ''}${slug.padEnd(30)} solid ${before} -> ${after}  (+${after - before})`);
  if (!DRY) {
    writeFileSync(jsonPath, JSON.stringify({ ...meta, plan, rederivedAt: '2026-07-08', rederiveNote: 'full build recovered from saved code with lifted limits' }, null, 2));
  }
}

// Rebuild any -rot180 variants from the re-derived base (180° turn).
const rotFiles = readdirSync(PLANS).filter(f => f.endsWith('-rot180.json'));
for (const rf of rotFiles) {
  const rotSlug = rf.replace(/\.json$/, '');
  const baseSlug = rotSlug.replace(/-rot180$/, '');
  if (!wanted(baseSlug) || !rederived.has(baseSlug)) continue;
  const basePlan = rederived.get(baseSlug);
  const rotPath = resolve(PLANS, rf);
  const meta = JSON.parse(readFileSync(rotPath, 'utf8'));
  const rotPlan = basePlan.map(b => ({ x: -b.x, y: b.y, z: -b.z, block: b.block }));
  if (JSON.stringify(meta.plan) === JSON.stringify(rotPlan)) { unchanged++; continue; }
  changed++;
  console.log(`  ${DRY ? '[dry] ' : ''}${rotSlug.padEnd(30)} (rot180) solid ${solid(meta.plan || [])} -> ${solid(rotPlan)}`);
  if (!DRY) {
    writeFileSync(rotPath, JSON.stringify({ ...meta, plan: rotPlan, rederivedAt: '2026-07-08', rederiveNote: 'rot180 rebuilt from re-derived base' }, null, 2));
  }
}

console.log(`\n[rederive] ${DRY ? '(dry-run) ' : ''}changed ${changed}, unchanged ${unchanged}, failed ${failed}`);
