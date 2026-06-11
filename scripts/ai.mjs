// Shared AI sandbox: builder primitives + Claude CLI wrapper.
// Used by both the bot (chat builds) and the server (per-task structures).
import vm from 'vm';
import { spawn } from 'child_process';

const VALID_BLOCKS = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13]);
const DEFAULT_MAX_BLOCKS = 5000;
// Raw collection cap: runaway-loop protection only. The *budget* (maxBlocks)
// is applied to SOLID blocks after dedup in runSandbox — if it were applied
// to raw ops in collection order, a site-clearing AIR pass would eat the
// whole cap before the build started (cathedral June 2026: three runs in a
// row returned exactly budget×AIR, 0 solid, because the model opened with
// cube(...AIR) over the footprint and everything after was truncated).
const RAW_OP_CAP = 400000;

export const SANDBOX_API_DOC = `AVAILABLE FUNCTIONS:
  block(x, y, z, id)                           single block
  cube(x1, y1, z1, x2, y2, z2, id)             filled box (inclusive both ends)
  hollowCube(x1, y1, z1, x2, y2, z2, id)       box shell (edges) only
  sphere(cx, cy, cz, radius, id)               filled sphere
  hollowSphere(cx, cy, cz, radius, id)         sphere shell
  cylinder(cx, cy, cz, radius, height, id)     vertical cylinder (grows +Y)
  hollowCylinder(cx, cy, cz, radius, height, id)
  line(x1, y1, z1, x2, y2, z2, id)             line of blocks
  disk(cx, cy, cz, radius, id)                 filled flat disk at Y=cy

BLOCK CONSTANTS:
  AIR (0) — placing AIR DELETES the block at that position. Use to clear trees, dig caves, carve windows.
  GRASS (1), DIRT (2), STONE (3 gray), OAK_LOG (4 brown)
  LEAVES (5 green), SAND (6 yellow), PLANKS (7 tan)
  COBBLE (8), BRICK (10 red), GLASS (11 blue), SNOW (12 white), ICE (13 cyan)

Color guide: metal/blade → STONE or COBBLE, wood → OAK_LOG or PLANKS,
foliage → LEAVES, red/fire → BRICK, water/sky → GLASS, white/snow → SNOW.

Math is available. You can define local helper functions.`;

export function makeSandbox(opts = {}) {
  const maxBlocks = opts.maxBlocks ?? DEFAULT_MAX_BLOCKS;
  const ops = [];
  let hitLimit = false;

  const addBlock = (x, y, z, id) => {
    if (hitLimit) return;
    if (ops.length >= maxBlocks) { hitLimit = true; return; }
    x = Math.round(x); y = Math.round(y); z = Math.round(z);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return;
    if (typeof id !== 'number') return;
    ops.push({ x, y, z, block: id });
  };

  const api = {
    AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, OAK_LOG: 4, LEAVES: 5,
    SAND: 6, PLANKS: 7, COBBLE: 8, BRICK: 10, GLASS: 11, SNOW: 12, ICE: 13,

    block: addBlock,

    cube(x1, y1, z1, x2, y2, z2, id) {
      const xa = Math.min(x1, x2), xb = Math.max(x1, x2);
      const ya = Math.min(y1, y2), yb = Math.max(y1, y2);
      const za = Math.min(z1, z2), zb = Math.max(z1, z2);
      for (let x = xa; x <= xb; x++)
        for (let y = ya; y <= yb; y++)
          for (let z = za; z <= zb; z++) {
            if (hitLimit) return;
            addBlock(x, y, z, id);
          }
    },

    hollowCube(x1, y1, z1, x2, y2, z2, id) {
      const xa = Math.min(x1, x2), xb = Math.max(x1, x2);
      const ya = Math.min(y1, y2), yb = Math.max(y1, y2);
      const za = Math.min(z1, z2), zb = Math.max(z1, z2);
      for (let x = xa; x <= xb; x++)
        for (let y = ya; y <= yb; y++)
          for (let z = za; z <= zb; z++)
            if (x === xa || x === xb || y === ya || y === yb || z === za || z === zb)
              addBlock(x, y, z, id);
    },

    sphere(cx, cy, cz, r, id) {
      const ri = Math.ceil(r);
      for (let dx = -ri; dx <= ri; dx++)
        for (let dy = -ri; dy <= ri; dy++)
          for (let dz = -ri; dz <= ri; dz++)
            if (Math.sqrt(dx*dx + dy*dy + dz*dz) <= r + 0.25)
              addBlock(cx + dx, cy + dy, cz + dz, id);
    },

    hollowSphere(cx, cy, cz, r, id) {
      const ri = Math.ceil(r);
      for (let dx = -ri; dx <= ri; dx++)
        for (let dy = -ri; dy <= ri; dy++)
          for (let dz = -ri; dz <= ri; dz++) {
            const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
            if (d >= r - 0.75 && d <= r + 0.25)
              addBlock(cx + dx, cy + dy, cz + dz, id);
          }
    },

    cylinder(cx, cy, cz, r, h, id) {
      const ri = Math.ceil(r);
      for (let dy = 0; dy < h; dy++)
        for (let dx = -ri; dx <= ri; dx++)
          for (let dz = -ri; dz <= ri; dz++)
            if (Math.sqrt(dx*dx + dz*dz) <= r + 0.25)
              addBlock(cx + dx, cy + dy, cz + dz, id);
    },

    hollowCylinder(cx, cy, cz, r, h, id) {
      const ri = Math.ceil(r);
      for (let dy = 0; dy < h; dy++)
        for (let dx = -ri; dx <= ri; dx++)
          for (let dz = -ri; dz <= ri; dz++) {
            const d = Math.sqrt(dx*dx + dz*dz);
            if (d >= r - 0.75 && d <= r + 0.25)
              addBlock(cx + dx, cy + dy, cz + dz, id);
          }
    },

    disk(cx, cy, cz, r, id) {
      const ri = Math.ceil(r);
      for (let dx = -ri; dx <= ri; dx++)
        for (let dz = -ri; dz <= ri; dz++)
          if (Math.sqrt(dx*dx + dz*dz) <= r + 0.25)
            addBlock(cx + dx, cy, cz + dz, id);
    },

    line(x1, y1, z1, x2, y2, z2, id) {
      const steps = Math.max(Math.abs(x2-x1), Math.abs(y2-y1), Math.abs(z2-z1), 1);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        addBlock(x1 + (x2-x1)*t, y1 + (y2-y1)*t, z1 + (z2-z1)*t, id);
      }
    },

    Math,
  };

  return { api, ops: () => ops };
}

export function extractCode(stdout) {
  const fence = stdout.match(/```(?:javascript|js)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  return stdout.trim();
}

export function runSandbox(code, opts = {}) {
  const { maxX = 22, maxZ = 22, maxY = 40, minY = 0, maxBlocks = DEFAULT_MAX_BLOCKS } = opts;
  const { api, ops } = makeSandbox({ maxBlocks: RAW_OP_CAP });
  const ctx = vm.createContext(api);
  vm.runInContext(code, ctx, { timeout: 10000, displayErrors: true });
  const inBounds = ops()
    .filter(op => VALID_BLOCKS.has(op.block))
    .filter(op => Math.abs(op.x) <= maxX && Math.abs(op.z) <= maxZ && op.y >= minY && op.y <= maxY);
  // Last write per coordinate wins, same as placing the ops in a world.
  // Keeps op order (the survivor stays at its final write's position in
  // the stream) so throttled/animated replay still builds sensibly.
  const lastWrite = new Map();
  inBounds.forEach((op, i) => lastWrite.set(`${op.x},${op.y},${op.z}`, i));
  const result = [];
  let solids = 0;
  for (let i = 0; i < inBounds.length; i++) {
    const op = inBounds[i];
    if (lastWrite.get(`${op.x},${op.y},${op.z}`) !== i) continue;
    if (op.block !== 0) {
      if (solids >= maxBlocks) continue; // budget counts solids only; AIR is free
      solids++;
    }
    result.push(op);
  }
  return result;
}

// effort='max' is the right default — see the A/B note in scripts/cache-plan.mjs
// (lower levels produce shorter code that often emits AIR-only or sparse builds).
export function callClaude(prompt, model = 'claude-opus-4-7', timeoutMs = 360000, effort = 'max') {
  return new Promise((resolve, reject) => {
    const args = ['-p', '--model', model];
    if (effort) args.push('--effort', effort);
    const proc = spawn('claude', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    let timer = null;
    if (timeoutMs > 0) {
      timer = setTimeout(() => { proc.kill('SIGTERM'); reject(new Error(`claude timed out after ${timeoutMs}ms`)); }, timeoutMs);
    }
    proc.stdout.on('data', d => stdout += d);
    proc.stderr.on('data', d => stderr += d);
    proc.on('error', (e) => { if (timer) clearTimeout(timer); reject(e); });
    proc.on('close', (code) => {
      if (timer) clearTimeout(timer);
      if (code !== 0) return reject(new Error(`claude exit ${code}: ${stderr.slice(0, 150)}`));
      resolve(stdout);
    });
    proc.stdin.write(prompt);
    proc.stdin.end();
  });
}

export async function planWithAI(prompt, opts = {}) {
  const stdout = await callClaude(prompt, opts.model, opts.timeoutMs, opts.effort);
  const code = extractCode(stdout);
  if (!code) throw new Error('Empty AI response');
  return { code, plan: runSandbox(code, opts) };
}
