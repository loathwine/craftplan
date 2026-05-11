// Cache a build plan to disk so the demo recorder can replay it
// deterministically without an LLM call.
//
// Usage:
//   nix develop --command node scripts/cache-plan.mjs --prompt "dragon coiled around a tower" --slug dragon-tower
//   nix develop --command node scripts/cache-plan.mjs --prompt "..." --slug ... --origin 128,15,128
//   nix develop --command node scripts/cache-plan.mjs --builder house --slug test-cottage
//
// Plans are written to public/data/plans/<slug>.json with coordinates relative
// to the build origin. The manuscript references them by slug and adds the
// world-space origin at composition time.

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { planWithAI, SANDBOX_API_DOC } from './ai.mjs';
import { PLANNERS } from './builders.mjs';
import { terrainHeight } from '../public/js/terrain.js';
import { describeLocalGeometry } from './geometry.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');
const PLANS_DIR = resolve(REPO, 'public/data/plans');

// --- Args -------------------------------------------------------------------
const argv = (() => {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = process.argv[i + 1];
      if (next && !next.startsWith('--')) { a[key] = next; i++; } else { a[key] = true; }
    }
  }
  return a;
})();

const SLUG = argv.slug;
if (!SLUG) { console.error('--slug required'); process.exit(1); }

const PROMPT = argv.prompt;
const BUILDER = argv.builder;
if (!PROMPT && !BUILDER) { console.error('--prompt or --builder required'); process.exit(1); }

const [ox, , oz] = (argv.origin || '128,0,128').split(',').map(Number);
const oy = terrainHeight(ox, oz) + 1;
const ORIGIN = [ox, oy, oz];

const FORCE = !!argv.force;
const MODEL = argv.model || 'claude-opus-4-7';

const outPath = resolve(PLANS_DIR, `${SLUG}.json`);
mkdirSync(PLANS_DIR, { recursive: true });
if (existsSync(outPath) && !FORCE) {
  console.error(`${outPath} exists. Use --force to overwrite.`);
  process.exit(1);
}

// --- Get the plan -----------------------------------------------------------
const startT = Date.now();
let plan, sourceLabel;

if (BUILDER) {
  const planner = PLANNERS[BUILDER];
  if (!planner) {
    console.error(`Unknown builder "${BUILDER}". Available: ${Object.keys(PLANNERS).join(', ')}`);
    process.exit(1);
  }
  // Builders return absolute world coords given an origin. Translate to relative.
  const absolute = planner(ORIGIN[0], ORIGIN[1], ORIGIN[2]);
  plan = absolute.map(b => ({ x: b.x - ORIGIN[0], y: b.y - ORIGIN[1], z: b.z - ORIGIN[2], block: b.block }));
  sourceLabel = `builder:${BUILDER}`;
  console.log(`[plan] builder=${BUILDER}: ${plan.length} blocks`);
} else {
  const RADIUS = 22, VRADIUS = 14;
  const geomCtx = describeLocalGeometry({ origin: ORIGIN, radius: RADIUS, vradius: VRADIUS });
  const prompt = `You are a voxel architect. Design: "${PROMPT}".

You write JavaScript that calls builder functions. Your code runs in a sandbox that collects block placements. Your output OVERRIDES whatever was at those coordinates.

${SANDBOX_API_DOC}

COORDS: Relative - origin (0,0,0) is the player's feet at the build location, on top of the ground. +X east, +Y up, +Z south.
Limits: X,Z in [-${RADIUS},${RADIUS}], Y in [-8,${VRADIUS * 2 + 5}]. Negative Y allowed for foundations / digging in. Total <= 4000 blocks.

${geomCtx}

If terrain rises into your footprint: carve in (AIR) or step the build up. If it drops: foundation blocks at negative Y, or raise the build.

Output ONLY JavaScript. No markdown fences, no prose. Just code:`;

  console.log(`[plan] calling Claude (${MODEL}) for "${PROMPT}"...`);
  const { code, plan: relPlan } = await planWithAI(prompt, {
    model: MODEL, maxX: RADIUS, maxZ: RADIUS, maxY: VRADIUS * 2 + 5, minY: -8,
  });
  plan = relPlan;
  sourceLabel = `ai:${MODEL}`;
  console.log(`[plan] AI returned ${plan.length} blocks; code ${code.length} chars`);
}

// --- Save -------------------------------------------------------------------
const payload = {
  slug: SLUG,
  prompt: PROMPT || null,
  source: sourceLabel,
  origin: { x: ORIGIN[0], y: ORIGIN[1], z: ORIGIN[2] },
  plan,
  createdAt: new Date().toISOString(),
  elapsedMs: Date.now() - startT,
};

writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`[plan] wrote ${outPath} (${plan.length} blocks, ${((Date.now() - startT) / 1000).toFixed(1)}s)`);
