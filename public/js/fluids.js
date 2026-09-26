// Cellular fluid flow (Minecraft-style) for WATER and LAVA.
//
// A fluid cell carries a level in World's per-column `fluid` array:
//   0 = source (anything placed by a build), 1..MAX = flowing (distance from
//   source), FALLING = fed from above (renders full height).
// Each fixed tick (DT) re-evaluates the queued "active" cells in a stable order:
//   - fluid spreads down into AIR (as FALLING), else sideways into AIR at level+1
//   - a flowing cell keeps the lowest level offered by a feeding neighbour, or
//     drains to AIR when nothing feeds it
//   - lava touching water hardens (source -> OBSIDIAN, flowing -> COBBLE)
// Driven by World.setTime(t) -> advanceTo(t), so recorder frames are
// deterministic. Only cells near a change are ever looked at.
import { Block } from './Textures.js';

export const FALLING = 15;
const DT = 0.2;
const RULES = {
  [Block.WATER]: { max: 7, every: 1 },
  [Block.LAVA]:  { max: 3, every: 3 },      // lava is slower + shorter
};
const H4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export class FluidSim {
  constructor(world) {
    this.w = world;
    this.active = new Set();       // packed cell keys x | z<<10 | y<<20
    this.simT = null;
    this.tickN = 0;
  }

  pack(x, y, z) { return x | (z << 10) | (y << 20); }

  // Queue a cell and its neighbours for re-evaluation.
  touch(x, y, z) {
    const W = this.w.worldSize;
    const add = (a, b, c) => { if (a >= 0 && c >= 0 && a < W && c < W && b >= 0 && b < 128) this.active.add(this.pack(a, b, c)); };
    add(x, y, z); add(x, y + 1, z); add(x, y - 1, z);
    for (const [dx, dz] of H4) add(x + dx, y, z + dz);
  }

  // start: sim clock origin. The recorder's manuscript time starts at 0; live
  // callers pass their current clock on first use.
  advanceTo(t, { start = 0 } = {}) {
    if (this.simT === null) this.simT = start;
    let n = 0;
    while (this.simT + DT <= t && n < 200) { this.simT += DT; this._tick(); n++; }
    if (t < this.simT - 1) this.simT = t;   // time went backwards (restart): resync
  }

  _isFluid(b) { return b === Block.WATER || b === Block.LAVA; }

  // Resting on something: solid ground or a source of the same fluid (a fluid
  // standing on flowing/falling fluid is still "in the air").
  _supported(x, y, z, b) {
    if (y === 0) return true;
    const below = this.w.getBlock(x, y - 1, z);
    if (below === 0) return false;
    if (below === b) return this.w.getFluidLevel(x, y - 1, z) === 0;
    return true;
  }

  _tick() {
    this.tickN++;
    if (!this.active.size) return;
    const w = this.w;
    const cells = [...this.active].sort((a, b) => a - b);
    this.active = new Set();
    const writes = [];               // [x,y,z,block,level] applied after evaluation
    const planned = new Map();       // key -> write index (first writer wins)
    const plan = (x, y, z, block, level) => {
      const k = this.pack(x, y, z);
      if (planned.has(k)) return;
      planned.set(k, writes.length); writes.push([x, y, z, block, level]);
    };

    for (const k of cells) {
      const x = k & 1023, z = (k >> 10) & 1023, y = k >> 20;
      const b = w.getBlock(x, y, z);
      if (this._isFluid(b)) {
        const r = RULES[b];
        if (this.tickN % r.every !== 0) { this.active.add(k); continue; }
        const lvl = w.getFluidLevel(x, y, z);
        const other = b === Block.WATER ? Block.LAVA : Block.WATER;
        // lava hardening
        if (b === Block.LAVA) {
          let touchesWater = w.getBlock(x, y + 1, z) === Block.WATER;
          for (const [dx, dz] of H4) if (w.getBlock(x + dx, y, z + dz) === Block.WATER) touchesWater = true;
          if (touchesWater) { plan(x, y, z, lvl === 0 ? Block.OBSIDIAN : Block.COBBLE, 0); continue; }
        }
        // flowing cells: recompute supported level (or drain)
        if (lvl !== 0) {
          let best = 99;
          if (w.getBlock(x, y + 1, z) === b) best = FALLING;
          else for (const [dx, dz] of H4) {
            if (w.getBlock(x + dx, y, z + dz) !== b) continue;
            const nl = w.getFluidLevel(x + dx, y, z + dz);
            // sources always feed; flowing/falling cells only once they rest on something
            if (nl !== 0 && !this._supported(x + dx, y, z + dz, b)) continue;
            const cand = (nl === FALLING ? 0 : nl) + 1;
            if (cand < best) best = cand;
          }
          if (best === 99 || (best !== FALLING && best > r.max)) { plan(x, y, z, 0, 0); continue; }
          if (best !== lvl) { plan(x, y, z, b, best); continue; }
        }
        // spread
        const below = w.getBlock(x, y - 1, z);
        if (y > 0 && below === 0) { plan(x, y - 1, z, b, FALLING); this.active.add(k); continue; }
        if (below === other) continue;       // hardening handled from the lava side
        if (!this._supported(x, y, z, b)) continue;
        const next = (lvl === FALLING ? 0 : lvl) + 1;
        if (next > r.max) continue;
        for (const [dx, dz] of H4) {
          const nx = x + dx, nz = z + dz;
          const nb = w.getBlock(nx, y, nz);
          if (nb === 0) plan(nx, y, nz, b, next);
          else if (nb === b) {
            const nl = w.getFluidLevel(nx, y, nz);
            if (nl !== 0 && nl !== FALLING && nl > next) plan(nx, y, nz, b, next);
          }
        }
      }
      // non-fluid cells need no work of their own (neighbours were queued)
    }
    if (writes.length) w._applyFluidWrites(writes);
  }
}
