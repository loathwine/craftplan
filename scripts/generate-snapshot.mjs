// Generate a static world snapshot from the manuscript: every block change
// produced by setup ops + each shot's build / events / placements, baked
// into a single { "x,y,z": block } map. The explore-mode page loads this
// to show the finished demo world in the browser, no server required.
//
// Run: nix develop --command node scripts/generate-snapshot.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { terrainHeight, naturalBlockAt } from '../public/js/terrain.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '..');
const PLANS_DIR = resolve(REPO, 'public/data/plans');

const { MANUSCRIPT } = await import(`${REPO}/public/js/manuscript.mjs`);

const loadPlan = (slug) => JSON.parse(readFileSync(resolve(PLANS_DIR, `${slug}.json`), 'utf-8'));

const rotateXZ = (x, z, rotN) => {
  switch (rotN) {
    case 1: return [-z, x];
    case 2: return [-x, -z];
    case 3: return [z, -x];
    default: return [x, z];
  }
};

const changes = {};
const setBlock = (x, y, z, block) => { changes[`${x},${y},${z}`] = block; };

// 1) Setup ops (clearAboveGround, clear, block)
for (const op of MANUSCRIPT.setup || []) {
  if (op.type === 'clear') {
    const [x0, y0, z0] = op.min, [x1, y1, z1] = op.max;
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        for (let z = z0; z <= z1; z++) setBlock(x, y, z, 0);
  } else if (op.type === 'clearAboveGround') {
    const [x0, z0] = op.min, [x1, z1] = op.max, topY = op.topY;
    for (let x = x0; x <= x1; x++) {
      for (let z = z0; z <= z1; z++) {
        const h = terrainHeight(x, z);
        for (let y = h + 1; y <= topY; y++) setBlock(x, y, z, 0);
      }
    }
  } else if (op.type === 'block') {
    setBlock(op.x, op.y, op.z, op.block);
  }
}

// 2) Each shot: build expansion + events + placements (final state only;
//    timing is irrelevant for a static snapshot).
for (const shot of MANUSCRIPT.shots) {
  if (shot.build) {
    const plan = loadPlan(shot.build.plan);
    const origin = shot.build.origin
      ? { x: shot.build.origin[0], y: shot.build.origin[1], z: shot.build.origin[2] }
      : plan.origin;
    const rotN = shot.build.rotateY ? Math.round(shot.build.rotateY / (Math.PI / 2)) & 3 : 0;
    for (const b of plan.plan) {
      const [rx, rz] = rotateXZ(b.x, b.z, rotN);
      setBlock(origin.x + rx, origin.y + b.y, origin.z + rz, b.block);
    }
  }
  if (shot.events) {
    for (const e of shot.events) setBlock(e.x, e.y, e.z, e.block);
  }
  if (shot.placements) {
    for (const p of shot.placements) {
      const plan = loadPlan(p.slug);
      const rotN = p.rotateY ? Math.round(p.rotateY / (Math.PI / 2)) & 3 : 0;
      for (const b of plan.plan) {
        const [rx, rz] = rotateXZ(b.x, b.z, rotN);
        setBlock(p.origin[0] + rx, p.origin[1] + b.y, p.origin[2] + rz, b.block);
      }
    }
  }
}

// 3) Filter: only keep entries that actually differ from the natural
//    deterministic terrain. The clearAboveGround pass touches every cell
//    above terrain in a huge volume, but for cells that were already AIR
//    naturally there's nothing to apply. This collapses ~2M entries down
//    to ~50K.
const filtered = {};
let raw = 0;
for (const [key, block] of Object.entries(changes)) {
  raw++;
  const [x, y, z] = key.split(',').map(Number);
  if (naturalBlockAt(x, y, z) !== block) filtered[key] = block;
}

const outPath = resolve(REPO, 'public/data/world-snapshot.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  blockCount: Object.keys(filtered).length,
  changes: filtered,
}));
console.log(`[snapshot] ${raw} raw → ${Object.keys(filtered).length} real deltas`);
console.log(`[snapshot] wrote ${outPath} (${(readFileSync(outPath).length / 1024).toFixed(1)} KB)`);
