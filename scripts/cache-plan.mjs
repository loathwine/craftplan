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
let plan, sourceLabel, llmCode = null;

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
  const RADIUS  = parseInt(argv.radius  || '22');
  const VRADIUS = parseInt(argv.vradius || '14');
  const BUDGET  = parseInt(argv.budget  || '4000');
  const geomCtx = describeLocalGeometry({ origin: ORIGIN, radius: RADIUS, vradius: VRADIUS });
  const detailHint = argv['detail-hint'] || '';
  const prompt = `You are a voxel architect. Design: "${PROMPT}".

You write JavaScript that calls builder functions. Your code runs in a sandbox that collects block placements. Your output OVERRIDES whatever was at those coordinates.

${SANDBOX_API_DOC}

COORDS: Relative - origin (0,0,0) is the player's feet at the build location, on top of the ground. +X east, +Y up, +Z south.
Limits: X,Z in [-${RADIUS},${RADIUS}], Y in [-8,${VRADIUS * 2 + 5}]. Negative Y allowed for foundations / digging in.
Budget: up to ${BUDGET} SOLID blocks. AIR is free and does NOT count against the budget — use it to carve window openings, dig craters, or remove terrain. Do NOT blanket-clear the whole site with a giant AIR box; it is unnecessary.

${geomCtx}

If terrain rises into your footprint: carve in (AIR) or step the build up. If it drops: foundation blocks at negative Y, or raise the build.

${detailHint ? `STYLE GUIDANCE: ${detailHint}\n` : ''}DETAIL EXPECTATION: Use most of your ${BUDGET}-block budget. Add layered detail — ornamentation, asymmetry, multiple structures or characters, foreground/background separation. Avoid simple geometric shells.

Output ONLY JavaScript. No markdown fences, no prose. Just code:`;

  const TIMEOUT_MS = parseInt(argv.timeout || '900000');
  // --effort default = 'max'. A/B tested 2026-06-02 (demogorgon, frieren):
  //   max:    3.0-3.1K solid blocks, dense and recognisable
  //   medium: spammed 8000 AIR blocks (rendered to empty terrain) OR shrank further
  //   low:    ~2K blocks, less detailed
  // Lower effort tempts the model to emit short code that compiles but
  // produces little / nothing visible. Block count alone is misleading —
  // count AIR separately. Don't flip this without re-running the A/B.
  const EFFORT = argv.effort || 'max';
  console.log(`[plan] calling Claude (${MODEL}, effort=${EFFORT}) for "${PROMPT}" (budget ${BUDGET}, radius ${RADIUS}, timeout ${TIMEOUT_MS}ms)...`);
  let aiResult;
  try {
    aiResult = await planWithAI(prompt, {
      model: MODEL, maxX: RADIUS, maxZ: RADIUS, maxY: VRADIUS * 2 + 5, minY: -8, maxBlocks: BUDGET, timeoutMs: TIMEOUT_MS, effort: EFFORT,
    });
  } catch (e) {
    if (e.llmCode || e.llmStdout) {
      const failPath = resolve(PLANS_DIR, `${SLUG}.failed.code.js`);
      writeFileSync(failPath, `// ${SLUG} — sandbox error: ${e.message}\n// --- extracted code ---\n${e.llmCode || ''}\n\n// --- raw stdout ---\n/*\n${(e.llmStdout || '').replace(/\*\//g, '*\\/')}\n*/\n`);
      console.error(`[plan] sandbox failed; dumped LLM output to ${failPath}`);
    }
    throw e;
  }
  const { code, plan: relPlan } = aiResult;
  // AIR ops aimed at empty sky delete nothing — drop them so a defensive
  // site-clearing pass can't bloat the cache. Keep AIR at/below terrain
  // (+7 for tree height): those are real carves the recorder applies.
  plan = relPlan.filter(b => b.block !== 0
    || ORIGIN[1] + b.y <= terrainHeight(ORIGIN[0] + b.x, ORIGIN[2] + b.z) + 7);
  llmCode = code;
  sourceLabel = `ai:${MODEL}`;
  const nSolid = plan.filter(b => b.block !== 0).length;
  console.log(`[plan] AI returned ${relPlan.length} ops -> ${nSolid} solid + ${plan.length - nSolid} carve AIR (${relPlan.length - plan.length} no-op AIR dropped); code ${code.length} chars`);
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
// Persist the LLM's raw code next to the cache so we can diagnose
// AIR-only / sparse runs without re-paying for the call.
if (llmCode) {
  const codePath = outPath.replace(/\.json$/, '.code.js');
  writeFileSync(codePath, `// ${SLUG} — prompt:\n// ${PROMPT?.slice(0, 200)}...\n\n${llmCode}`);
}
console.log(`[plan] wrote ${outPath} (${plan.length} blocks, ${((Date.now() - startT) / 1000).toFixed(1)}s)`);
