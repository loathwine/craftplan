import * as THREE from 'three';
import { Block, BLOCK_COLORS, BLOCK_MATERIALS, BLOCK_EMITTERS, INVISIBLE_BLOCKS, colorVariation, isTransparent, isOpaque, isEmissive } from './Textures.js';
import { VoxelParticles } from './particles.js';
import { hash2, biomeAt, terrainHeight, surfaceBlock, shouldHaveTree } from './terrain.js';
import { makeSkyEnvMap } from './sky.js';
import { WaterReflection } from './waterReflection.js';

export const CHUNK_SIZE = 16;
export const WORLD_HEIGHT = 128;
const DEFAULT_CHUNKS = 16; // 16x16 chunks = 256x256 world
export const WORLD_SIZE = DEFAULT_CHUNKS * CHUNK_SIZE;

// --- Face definitions (CCW winding, normal points outward) ---
// For each corner we precompute AO neighbour offsets: the two tangent-plane
// blocks and the diagonal, all sampled in the cell *outside* the face. If
// either tangent neighbour is solid the corner gets darkened; both solid →
// fully occluded regardless of the diagonal (classic 0fps recipe).
const RAW_FACES = [
  { dir: [0, 1, 0], corners: [[0,1,1],[1,1,1],[1,1,0],[0,1,0]], type: 'top' },
  { dir: [0,-1, 0], corners: [[0,0,0],[1,0,0],[1,0,1],[0,0,1]], type: 'bottom' },
  { dir: [1, 0, 0], corners: [[1,0,0],[1,1,0],[1,1,1],[1,0,1]], type: 'side' },
  { dir: [-1,0, 0], corners: [[0,0,1],[0,1,1],[0,1,0],[0,0,0]], type: 'side' },
  { dir: [0, 0, 1], corners: [[1,0,1],[1,1,1],[0,1,1],[0,0,1]], type: 'side' },
  { dir: [0, 0,-1], corners: [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], type: 'side' },
];

const FACES = RAW_FACES.map(f => {
  // Identify the two tangent axes (the non-normal ones).
  const tangentAxes = [0, 1, 2].filter(i => f.dir[i] === 0);
  const aoOffsets = f.corners.map(corner => {
    // Each corner sits at a tangent offset {-1, +1} from the block centre.
    const sides = tangentAxes.map(ax => corner[ax] === 0 ? -1 : +1);
    const s1Off = [...f.dir]; s1Off[tangentAxes[0]] += sides[0];
    const s2Off = [...f.dir]; s2Off[tangentAxes[1]] += sides[1];
    const cOff  = [...f.dir]; cOff[tangentAxes[0]] += sides[0]; cOff[tangentAxes[1]] += sides[1];
    return [s1Off, s2Off, cOff];
  });
  return { ...f, aoOffsets };
});

// Multipliers per AO bucket (0 = no occlusion, 3 = fully boxed in).
const AO_LEVELS = [1.0, 0.82, 0.65, 0.48];

// Section = 16×16×16 slice of a chunk column. Meshes are per section so a block
// edit rebuilds ~4k cells instead of a 32k-cell column.
const SECTION_H = 16;
const SECTIONS = WORLD_HEIGHT / SECTION_H;

// Per-block-id lookup tables (hot path: avoid Set/object lookups per face).
const OPAQUE = new Uint8Array(256), TRANS = new Uint8Array(256), EMIT = new Uint8Array(256), NOMESH = new Uint8Array(256), EMITTER = new Uint8Array(256);
for (let b = 1; b < 256; b++) {
  if (!BLOCK_COLORS[b]) continue;
  OPAQUE[b] = isOpaque(b) ? 1 : 0;
  TRANS[b] = isTransparent(b) ? 1 : 0;
  EMIT[b] = isEmissive(b) ? 1 : 0;
  NOMESH[b] = INVISIBLE_BLOCKS.has(b) ? 1 : 0;
  EMITTER[b] = BLOCK_EMITTERS[b] ? 1 : 0;
}

// Block light (Minecraft-style, coloured): emissive blocks seed per-channel
// levels 0..LMAX that drop by 1 per step through non-opaque cells. Baked per
// vertex; the material adds diffuse * blockLight, so glow lights its
// surroundings. No emissive blocks nearby -> zero light, zero cost.
const LMAX = 14;
const LIGHT_GAIN = 0.6;
const LIGHT_SRC = new Array(256).fill(null);
for (let b = 1; b < 256; b++) if (EMIT[b]) {
  const c = BLOCK_COLORS[b].side;
  const k = b === Block.LAVA ? 0.8 : 1;   // lava pools are big: dim each cell a bit
  LIGHT_SRC[b] = c.map(v => Math.round(LMAX * k * Math.min(1, Math.sqrt(v))));
}
// Material animation id carried in matProps.w (1 = molten lava surface).
const ANIM = new Float32Array(256); ANIM[Block.LAVA] = 1;
const LIGHT_CURVE = new Float32Array(LMAX + 1).map((_, l) => (l / LMAX) ** 2);

// Growable typed-array mesh buffer, reused across builds (no per-face allocs).
class MeshBuf {
  constructor() { this.v = 0; this.i = 0; this._alloc(4096); }
  _alloc(nv) {
    const grow = (old, n) => { const a = new old.constructor(n); a.set(old.subarray(0, Math.min(old.length, n))); return a; };
    this.pos = this.pos ? grow(this.pos, nv * 3) : new Float32Array(nv * 3);
    this.nrm = this.nrm ? grow(this.nrm, nv * 3) : new Float32Array(nv * 3);
    this.col = this.col ? grow(this.col, nv * 3) : new Float32Array(nv * 3);
    this.mat = this.mat ? grow(this.mat, nv * 4) : new Float32Array(nv * 4);
    this.lit = this.lit ? grow(this.lit, nv * 3) : new Uint8Array(nv * 3);
    this.idx = this.idx ? grow(this.idx, nv * 3 / 2) : new Uint32Array(nv * 3 / 2);
    this.cap = nv;
  }
  reset() { this.v = 0; this.i = 0; }
  ensureQuad() { if (this.v + 4 > this.cap) this._alloc(this.cap * 2); }
}
const SCRATCH = { opaque: new MeshBuf(), transparent: new MeshBuf(), special: new MeshBuf(), specialTransparent: new MeshBuf() };

export class World {
  constructor(scene, opts = {}) {
    this.scene = scene;
    this.chunkCount = opts.chunks ?? DEFAULT_CHUNKS;
    this.worldSize = this.chunkCount * CHUNK_SIZE;
    // Flat array of chunk columns, index cz*C + cx. Each is 16×16×WORLD_HEIGHT
    // blocks, index lx + lz*16 + y*256. Edits write straight into these.
    this.data = new Array(this.chunkCount * this.chunkCount);
    this.meshes = new Map();          // section key (int) -> [Mesh]
    // Block light, 3 bytes (r,g,b level) per cell; allocated per column only
    // once light reaches it. _anyLight gates the per-vertex sampling.
    this.light = new Array(this.chunkCount * this.chunkCount).fill(null);
    this._anyLight = false;
    this.material = makeLitLambert({ vertexColors: true });
    this.transparentMaterial = makeLitLambert({
      vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide,
    });
    // Special-material passes (metal / glossy / emissive / water). Per-vertex
    // `matProps` = (roughness, metalness, emissive) drives MeshStandardMaterial
    // so one material + one draw call covers every special block in a section.
    this.specialMaterial = makeSpecialMaterial({});
    // Planar reflection across the dominant water level (see waterReflection.js).
    this._refl = new WaterReflection({ scale: opts.reflectionScale ?? 0.5 });
    this._secWater = new Map();   // section key -> Map(surfaceY -> top-face count)
    this._waterDirty = false;
    this._waterMeshes = new Set();
    this._version = 0;            // bumps on every section rebuild (reflection cache key)
    this._secEmit = new Map();    // section key -> [x,y,z,block,...] emitter cells
    this._emitDirty = false;
    this.specialTransparentMaterial = makeSpecialMaterial({
      transparent: true, opacity: 0.62, depthWrite: false, side: THREE.DoubleSide,
    }, { water: true, refl: this._refl });
    // Animation clock for water ripples. The recorder sets it from manuscript
    // time (deterministic frames); otherwise it follows the wall clock.
    this._time = null;
    this.specialTransparentMaterial.userData.world = this;
    this._envReady = false;
    this.chunkGroup = new THREE.Group();
    scene.add(this.chunkGroup);
    this.particles = new VoxelParticles(scene);
    const prevTick = this.particles.glow.onBeforeRender;
    this._flushEmitters();
    this.particles.glow.onBeforeRender = (renderer, ...rest) => {
      this.particles.time = this._time ?? performance.now() / 1000;
      prevTick(renderer, ...rest);
    };
    this._generate();
    this._flushEmitters();
  }

  _generate() {
    const C = this.chunkCount;
    for (let cx = 0; cx < C; cx++) for (let cz = 0; cz < C; cz++) this._genTerrain(cx, cz);
    for (let cx = 0; cx < C; cx++) for (let cz = 0; cz < C; cz++) this._genTrees(cx, cz);
    for (let cx = 0; cx < C; cx++) for (let cz = 0; cz < C; cz++)
      for (let sy = 0; sy < SECTIONS; sy++) this._buildSection(cx, cz, sy);
  }

  _genTerrain(cx, cz) {
    const data = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE * WORLD_HEIGHT);
    const x0 = cx * CHUNK_SIZE, z0 = cz * CHUNK_SIZE;
    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const wx = x0 + lx, wz = z0 + lz;
        const h = terrainHeight(wx, wz);
        const biome = biomeAt(wx, wz);
        const surface = surfaceBlock(wx, wz, h);
        for (let y = 0; y <= h && y < WORLD_HEIGHT; y++) {
          let b;
          if (y === 0) b = Block.BEDROCK;
          else if (y === h) b = surface;
          else if (y >= h - 3) b = biome === 'desert' ? Block.SAND : Block.DIRT;
          else b = Block.STONE;
          data[lx + lz * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE] = b;
        }
      }
    }
    this.data[cz * this.chunkCount + cx] = data;
  }

  _inWorld(x, y, z) {
    return x >= 0 && z >= 0 && x < this.worldSize && z < this.worldSize && y >= 0 && y < WORLD_HEIGHT;
  }
  _idx(x, y, z) { return (x & 15) + ((z & 15) << 4) + (y << 8); }
  _col(x, z) { return this.data[(z >> 4) * this.chunkCount + (x >> 4)]; }

  // Terrain decoration: only fills AIR (trees never overwrite ground).
  _writeBlock(x, y, z, block) {
    if (!this._inWorld(x, y, z)) return;
    const col = this._col(x, z), i = this._idx(x, y, z);
    if (col[i] === Block.AIR) col[i] = block;
  }

  _genTrees(cx, cz) {
    const x0 = cx * CHUNK_SIZE, z0 = cz * CHUNK_SIZE;
    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const wx = x0 + lx, wz = z0 + lz;
        if (!shouldHaveTree(wx, wz)) continue;
        const h = terrainHeight(wx, wz);
        const trunkH = 4 + Math.floor(hash2(wx * 7, wz * 11) * 2);
        for (let y = h + 1; y <= h + trunkH; y++) this._writeBlock(wx, y, wz, Block.OAK_LOG);
        const topY = h + trunkH;
        for (let dy = -1; dy <= 2; dy++) {
          const r = dy <= 0 ? 2 : 1;
          for (let dx = -r; dx <= r; dx++) {
            for (let dz = -r; dz <= r; dz++) {
              if (dx === 0 && dz === 0 && dy <= 0) continue;
              if (Math.abs(dx) === r && Math.abs(dz) === r && dy < 1 && hash2(wx + dx, wz + dz) > 0.6) continue;
              this._writeBlock(wx + dx, topY + dy, wz + dz, Block.LEAVES);
            }
          }
        }
      }
    }
  }

  getBlock(x, y, z) {
    if (x < 0 || z < 0 || x >= this.worldSize || z >= this.worldSize || y < 0 || y >= WORLD_HEIGHT) return Block.AIR;
    return this.data[(z >> 4) * this.chunkCount + (x >> 4)][(x & 15) + ((z & 15) << 4) + (y << 8)];
  }

  // Occlusion query for meshing: below the world counts as solid, so the
  // bedrock underside (never visible) isn't meshed. Everything else = getBlock.
  _solidAt(x, y, z) {
    if (y < 0) return 1;
    return OPAQUE[this.getBlock(x, y, z)];
  }

  _secKey(cx, cz, sy) { return (cz * this.chunkCount + cx) * SECTIONS + sy; }

  // Mark every section whose faces/AO can change when (x,y,z) changes: the
  // block's own section plus any section within 1 block (face + AO reach).
  _markDirty(x, y, z, dirty) {
    const C = this.chunkCount;
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx, ny = y + dy, nz = z + dz;
      if (nx < 0 || nz < 0 || nx >= this.worldSize || nz >= this.worldSize || ny < 0 || ny >= WORLD_HEIGHT) continue;
      dirty.add(this._secKey(nx >> 4, nz >> 4, (ny / SECTION_H) | 0));
    }
  }

  // Push emitter changes to the particle system (once per edit batch, before
  // the next render — uploading from inside onBeforeRender is a frame late).
  _flushEmitters() {
    if (!this._emitDirty || !this.particles) return;
    this._emitDirty = false;
    const all = [];
    for (const a of this._secEmit.values()) for (let i = 0; i < a.length; i++) all.push(a[i]);
    this.particles.setEmitters(all);
  }

  _rebuildDirty(dirty) {
    const C = this.chunkCount;
    for (const k of dirty) {
      const sy = k % SECTIONS, col = (k - sy) / SECTIONS;
      this._buildSection(col % C, (col / C) | 0, sy);
    }
    this._flushEmitters();
  }

  setBlock(x, y, z, block) {
    if (!this._inWorld(x, y, z)) return;
    const col = this._col(x, z), i = this._idx(x, y, z);
    const emissiveTouched = EMIT[col[i]] === 1 || EMIT[block] === 1;
    col[i] = block;
    const dirty = new Set();
    this._markDirty(x, y, z, dirty);
    this._maybeRelight(x, y, z, x, y, z, emissiveTouched, dirty);
    this._rebuildDirty(dirty);
  }

  // Deterministic animation time (seconds) for water ripples etc.
  setTime(t) { this._time = t; this.particles?.update(t); }

  getTerrainHeight(x, z) {
    return terrainHeight(Math.floor(x), Math.floor(z));
  }

  getHighestBlock(x, z) {
    const bx = Math.floor(x), bz = Math.floor(z);
    for (let y = WORLD_HEIGHT - 1; y >= 0; y--) if (this.getBlock(bx, y, bz) !== Block.AIR) return y;
    return 0;
  }

  applyBlockChanges(changes) {
    const dirty = new Set();
    let emissiveTouched = false, n = 0;
    let bx0 = Infinity, by0 = Infinity, bz0 = Infinity, bx1 = -Infinity, by1 = -Infinity, bz1 = -Infinity;
    for (const key in changes) {
      const c1 = key.indexOf(','), c2 = key.indexOf(',', c1 + 1);
      const x = +key.slice(0, c1), y = +key.slice(c1 + 1, c2), z = +key.slice(c2 + 1);
      if (!this._inWorld(x, y, z)) continue;
      const col = this._col(x, z), i = this._idx(x, y, z), b = changes[key];
      if (EMIT[col[i]] === 1 || EMIT[b] === 1) emissiveTouched = true;
      col[i] = b;
      this._markDirty(x, y, z, dirty);
      if (x < bx0) bx0 = x; if (y < by0) by0 = y; if (z < bz0) bz0 = z;
      if (x > bx1) bx1 = x; if (y > by1) by1 = y; if (z > bz1) bz1 = z;
      n++;
    }
    if (n) this._maybeRelight(bx0, by0, bz0, bx1, by1, bz1, emissiveTouched, dirty);
    this._rebuildDirty(dirty);
  }

  // --- Block light ---------------------------------------------------------
  _lightCol(cx, cz, create) {
    const k = cz * this.chunkCount + cx;
    let a = this.light[k];
    if (!a && create) { a = this.light[k] = new Uint8Array(3 * CHUNK_SIZE * CHUNK_SIZE * WORLD_HEIGHT); this._anyLight = true; }
    return a;
  }

  _lightAt(x, y, z, ch) {
    if (x < 0 || z < 0 || x >= this.worldSize || z >= this.worldSize || y < 0 || y >= WORLD_HEIGHT) return 0;
    const a = this.light[(z >> 4) * this.chunkCount + (x >> 4)];
    return a ? a[((x & 15) + ((z & 15) << 4) + (y << 8)) * 3 + ch] : 0;
  }

  // A light change at a cell affects faces sampling it: its section, plus the
  // neighbouring section when the cell sits on a section boundary.
  _markLightDirty(x, y, z, dirty) {
    const xs = [x >> 4], zs = [z >> 4], ys = [(y / SECTION_H) | 0];
    const C = this.chunkCount;
    if ((x & 15) === 0 && xs[0] > 0) xs.push(xs[0] - 1); else if ((x & 15) === 15 && xs[0] < C - 1) xs.push(xs[0] + 1);
    if ((z & 15) === 0 && zs[0] > 0) zs.push(zs[0] - 1); else if ((z & 15) === 15 && zs[0] < C - 1) zs.push(zs[0] + 1);
    const ly = y % SECTION_H;
    if (ly === 0 && ys[0] > 0) ys.push(ys[0] - 1); else if (ly === SECTION_H - 1 && ys[0] < SECTIONS - 1) ys.push(ys[0] + 1);
    for (const a of xs) for (const b of zs) for (const c of ys) dirty.add(this._secKey(a, b, c));
  }

  _maybeRelight(x0, y0, z0, x1, y1, z1, emissiveTouched, dirty) {
    if (!emissiveTouched && !this._anyLight) return;          // common case: no light anywhere
    const W = this.worldSize, L = LMAX;
    // Region whose light can change: changed bbox + light reach.
    const rx0 = Math.max(0, x0 - L), rx1 = Math.min(W - 1, x1 + L);
    const ry0 = Math.max(0, y0 - L), ry1 = Math.min(WORLD_HEIGHT - 1, y1 + L);
    const rz0 = Math.max(0, z0 - L), rz1 = Math.min(W - 1, z1 + L);
    if (!emissiveTouched) {
      // Non-emissive edit: only matters if light exists in the region (a wall
      // placed/removed changes where light can travel).
      let lit = false;
      for (let cz = rz0 >> 4; cz <= rz1 >> 4 && !lit; cz++) for (let cx = rx0 >> 4; cx <= rx1 >> 4; cx++) if (this.light[cz * this.chunkCount + cx]) { lit = true; break; }
      if (!lit) return;
    }
    this._relight(rx0, ry0, rz0, rx1, ry1, rz1, dirty);
  }

  _relight(rx0, ry0, rz0, rx1, ry1, rz1, dirty) {
    const W = this.worldSize, L = LMAX, C = this.chunkCount;
    // 1) clear the region (marking sections that had light)
    for (let cz = rz0 >> 4; cz <= rz1 >> 4; cz++) for (let cx = rx0 >> 4; cx <= rx1 >> 4; cx++) {
      const a = this.light[cz * C + cx]; if (!a) continue;
      const xa = Math.max(rx0, cx * 16), xb = Math.min(rx1, cx * 16 + 15);
      const za = Math.max(rz0, cz * 16), zb = Math.min(rz1, cz * 16 + 15);
      for (let y = ry0; y <= ry1; y++) for (let z = za; z <= zb; z++) for (let x = xa; x <= xb; x++) {
        const o = ((x & 15) + ((z & 15) << 4) + (y << 8)) * 3;
        if (a[o] | a[o + 1] | a[o + 2]) { a[o] = a[o + 1] = a[o + 2] = 0; this._markLightDirty(x, y, z, dirty); }
      }
    }
    // 2) seed from every source that can reach the region
    const sx0 = Math.max(0, rx0 - L), sx1 = Math.min(W - 1, rx1 + L);
    const sy0 = Math.max(0, ry0 - L), sy1 = Math.min(WORLD_HEIGHT - 1, ry1 + L);
    const sz0 = Math.max(0, rz0 - L), sz1 = Math.min(W - 1, rz1 + L);
    const seeds = [];
    for (let cz = sz0 >> 4; cz <= sz1 >> 4; cz++) for (let cx = sx0 >> 4; cx <= sx1 >> 4; cx++) {
      const col = this.data[cz * C + cx];
      const xa = Math.max(sx0, cx * 16), xb = Math.min(sx1, cx * 16 + 15);
      const za = Math.max(sz0, cz * 16), zb = Math.min(sz1, cz * 16 + 15);
      for (let y = sy0; y <= sy1; y++) for (let z = za; z <= zb; z++) for (let x = xa; x <= xb; x++) {
        const b = col[(x & 15) + ((z & 15) << 4) + (y << 8)];
        if (LIGHT_SRC[b]) seeds.push(x, y, z, b);
      }
    }
    if (!seeds.length) return;
    // 3) BFS per channel (max-propagation). Queue packs x|z<<10|y<<20.
    const DIRS = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    let q = new Int32Array(4096), ql = new Uint8Array(4096);
    for (let ch = 0; ch < 3; ch++) {
      let head = 0, tail = 0;
      const push = (x, y, z, l) => {
        if (tail >= q.length) { const nq = new Int32Array(q.length * 2); nq.set(q); q = nq; const nl = new Uint8Array(ql.length * 2); nl.set(ql); ql = nl; }
        q[tail] = x | (z << 10) | (y << 20); ql[tail] = l; tail++;
      };
      for (let s = 0; s < seeds.length; s += 4) {
        const lvl = LIGHT_SRC[seeds[s + 3]][ch];
        if (lvl <= 0) continue;
        const x = seeds[s], y = seeds[s + 1], z = seeds[s + 2];
        const a = this._lightCol(x >> 4, z >> 4, true), o = ((x & 15) + ((z & 15) << 4) + (y << 8)) * 3 + ch;
        if (a[o] < lvl) { a[o] = lvl; this._markLightDirty(x, y, z, dirty); }
        push(x, y, z, lvl);
      }
      while (head < tail) {
        const pk = q[head], l = ql[head]; head++;
        if (l <= 1) continue;
        const x = pk & 1023, z = (pk >> 10) & 1023, y = pk >> 20;
        for (let d = 0; d < 6; d++) {
          const nx = x + DIRS[d][0], ny = y + DIRS[d][1], nz = z + DIRS[d][2];
          if (nx < 0 || nz < 0 || nx >= W || nz >= W || ny < 0 || ny >= WORLD_HEIGHT) continue;
          if (OPAQUE[this.data[(nz >> 4) * C + (nx >> 4)][(nx & 15) + ((nz & 15) << 4) + (ny << 8)]]) continue;
          const a = this._lightCol(nx >> 4, nz >> 4, true), o = ((nx & 15) + ((nz & 15) << 4) + (ny << 8)) * 3 + ch;
          if (a[o] >= l - 1) continue;
          a[o] = l - 1; this._markLightDirty(nx, ny, nz, dirty);
          push(nx, ny, nz, l - 1);
        }
      }
    }
  }

  getChunkMeshes() {
    const out = [];
    for (const arr of this.meshes.values()) for (const m of arr) out.push(m);
    return out;
  }

  // Reflection environment for metals/gloss, built once (lazily, on the first
  // frame a special-material mesh is drawn — the first moment we have a
  // renderer). PMREM of the scene's own sky, so gold reflects *this* sky.
  _ensureEnvironment(renderer, scene) {
    if (this._envReady) return;
    this._envReady = true;
    const tex = makeSkyEnvMap(renderer, scene);
    for (const m of [this.specialMaterial, this.specialTransparentMaterial]) { m.envMap = tex; m.needsUpdate = true; }
  }

  // Reflection plane = the water surface height with the most top faces.
  _updateWaterPlane() {
    this._waterDirty = false;
    const tot = new Map();
    for (const m of this._secWater.values()) for (const [y, n] of m) tot.set(y, (tot.get(y) || 0) + n);
    let best = null, bn = 0;
    for (const [y, n] of tot) if (n > bn) { bn = n; best = y; }
    this._refl.height = best;
  }

  // --- Mesh builder (one 16³ section) ---
  _buildSection(cx, cz, sy) {
    const key = this._secKey(cx, cz, sy);
    const old = this.meshes.get(key);
    if (old) { for (const m of old) { this.chunkGroup.remove(m); m.geometry.dispose(); this._waterMeshes.delete(m); } this.meshes.delete(key); }
    this._version++;
    if (this._secWater.delete(key)) this._waterDirty = true;
    if (this._secEmit.delete(key)) this._emitDirty = true;

    const col = this.data[cz * this.chunkCount + cx];
    const y0 = sy * SECTION_H, y1 = y0 + SECTION_H;
    // Fast reject: empty section (common above the terrain).
    let any = false;
    for (let i = y0 << 8, e = y1 << 8; i < e; i++) if (col[i] !== 0) { any = true; break; }
    if (!any) return;

    for (const k in SCRATCH) SCRATCH[k].reset();
    const litOn = this._anyLight;
    let waterTops = null;          // surfaceY -> count, for the reflection plane
    let emitters = null;           // particle emitter cells in this section
    const x0 = cx * CHUNK_SIZE, z0 = cz * CHUNK_SIZE;

    for (let y = y0; y < y1; y++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        for (let lx = 0; lx < CHUNK_SIZE; lx++) {
          const block = col[lx + (lz << 4) + (y << 8)];
          if (block === 0) continue;
          const bc = BLOCK_COLORS[block];
          if (!bc) continue;
          const wx = x0 + lx, wz = z0 + lz;
          if (EMITTER[block] && (block !== Block.LAVA || !OPAQUE[this.getBlock(wx, y + 1, wz)]))
            (emitters ||= []).push(wx, y, wz, block);
          if (NOMESH[block]) continue;
          const cv = colorVariation(wx, y, wz);
          const isTrans = TRANS[block] === 1, isOpq = OPAQUE[block] === 1;
          const mp = BLOCK_MATERIALS[block];
          const target = mp
            ? (isTrans ? SCRATCH.specialTransparent : SCRATCH.special)
            : (isTrans ? SCRATCH.transparent : SCRATCH.opaque);
          // Transparent blocks skip AO (no dark patches where glass meets
          // solids); emissive blocks skip it (AO would dim the glow).
          const skipAO = isTrans || EMIT[block] === 1;

          for (let f = 0; f < 6; f++) {
            const face = FACES[f], d = face.dir;
            const ny = y + d[1];
            // Culling (same rules as before): same-block merge; opaque hides
            // opaque; opaque neighbour hides a transparent block's face.
            // Below the world counts as opaque (bedrock underside never shows).
            let neighbor, nOpq;
            if (ny < 0) { neighbor = -1; nOpq = 1; }
            else { neighbor = this.getBlock(wx + d[0], ny, wz + d[2]); nOpq = OPAQUE[neighbor]; }
            if (neighbor === block) continue;
            if (nOpq && (isOpq || isTrans)) continue;

            if (block === Block.WATER && f === 0) (waterTops ||= new Map()).set(y + 1, (waterTops.get(y + 1) || 0) + 1);
            target.ensureQuad();
            const fc = bc[face.type];
            const vb = target.v;
            for (let i = 0; i < 4; i++) {
              const c = face.corners[i];
              const p = (vb + i) * 3;
              target.pos[p] = wx + c[0]; target.pos[p + 1] = y + c[1]; target.pos[p + 2] = wz + c[2];
              target.nrm[p] = d[0]; target.nrm[p + 1] = d[1]; target.nrm[p + 2] = d[2];

              let r = fc[0] * cv, g = fc[1] * cv, b = fc[2] * cv;
              if (block === Block.GRASS && face.type === 'side' && (i === 1 || i === 2)) {
                const gt = bc.top;
                r = r * 0.45 + gt[0] * cv * 0.55;
                g = g * 0.45 + gt[1] * cv * 0.55;
                b = b * 0.45 + gt[2] * cv * 0.55;
              }
              if (!skipAO) {
                const ao4 = face.aoOffsets[i], s1 = ao4[0], s2 = ao4[1], cd = ao4[2];
                const s1Solid = this._solidAt(wx + s1[0], y + s1[1], wz + s1[2]);
                const s2Solid = this._solidAt(wx + s2[0], y + s2[1], wz + s2[2]);
                const occ = (s1Solid && s2Solid) ? 3
                  : s1Solid + s2Solid + this._solidAt(wx + cd[0], y + cd[1], wz + cd[2]);
                const ao = AO_LEVELS[occ];
                r *= ao; g *= ao; b *= ao;
              }
              target.col[p] = r < 1 ? r : 1; target.col[p + 1] = g < 1 ? g : 1; target.col[p + 2] = b < 1 ? b : 1;
              if (litOn) {
                // Smooth block light: average the non-opaque cells in front of
                // this corner (face cell + the AO tangent/diagonal cells).
                const ao4 = face.aoOffsets[i];
                let lr = 0, lg = 0, lb = 0, nc = 0;
                for (let k = -1; k < 3; k++) {
                  const o = k < 0 ? d : ao4[k];
                  const qx = wx + o[0], qy = y + o[1], qz = wz + o[2];
                  if (k >= 0 && this._solidAt(qx, qy, qz)) continue;
                  lr += LIGHT_CURVE[this._lightAt(qx, qy, qz, 0)];
                  lg += LIGHT_CURVE[this._lightAt(qx, qy, qz, 1)];
                  lb += LIGHT_CURVE[this._lightAt(qx, qy, qz, 2)];
                  nc++;
                }
                const inv = nc ? 255 / nc : 0;
                target.lit[p] = lr * inv; target.lit[p + 1] = lg * inv; target.lit[p + 2] = lb * inv;
              } else { target.lit[p] = 0; target.lit[p + 1] = 0; target.lit[p + 2] = 0; }
              if (mp) { const q = (vb + i) * 4; target.mat[q] = mp.roughness; target.mat[q + 1] = mp.metalness; target.mat[q + 2] = mp.emissive; target.mat[q + 3] = ANIM[block]; }
            }
            const ii = target.i;
            target.idx[ii] = vb; target.idx[ii + 1] = vb + 1; target.idx[ii + 2] = vb + 2;
            target.idx[ii + 3] = vb; target.idx[ii + 4] = vb + 2; target.idx[ii + 5] = vb + 3;
            target.i += 6; target.v += 4;
          }
        }
      }
    }

    if (waterTops) { this._secWater.set(key, waterTops); this._waterDirty = true; }
    if (emitters) { this._secEmit.set(key, emitters); this._emitDirty = true; }

    const built = [];
    const PASSES = [
      ['opaque',             this.material,                   false, false],
      ['transparent',        this.transparentMaterial,        true,  false],
      ['special',            this.specialMaterial,            false, true ],
      ['specialTransparent', this.specialTransparentMaterial, true,  true ],
    ];
    for (const [pass, mat, trans, special] of PASSES) {
      const buf = SCRATCH[pass];
      if (buf.v === 0) continue;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(buf.pos.slice(0, buf.v * 3), 3));
      geo.setAttribute('normal', new THREE.BufferAttribute(buf.nrm.slice(0, buf.v * 3), 3));
      geo.setAttribute('color', new THREE.BufferAttribute(buf.col.slice(0, buf.v * 3), 3));
      geo.setAttribute('blockLight', new THREE.BufferAttribute(buf.lit.slice(0, buf.v * 3), 3, true));
      if (special) geo.setAttribute('matProps', new THREE.BufferAttribute(buf.mat.slice(0, buf.v * 4), 4));
      geo.setIndex(new THREE.BufferAttribute(buf.idx.slice(0, buf.i), 1));
      geo.computeBoundingSphere();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = trans ? 1 : 0;
      // Opaque sections cast + receive shadows; transparent (glass, water)
      // only receive so we don't get black silhouettes through glass.
      mesh.castShadow = !trans;
      mesh.receiveShadow = true;
      if (special) mesh.onBeforeRender = (renderer, scene, camera) => {
        this._ensureEnvironment(renderer, scene);
        const ut = mat.userData.uTime;
        if (ut) ut.value = this._time ?? performance.now() / 1000;
        if (mat === this.specialTransparentMaterial) {
          if (this._waterDirty) this._updateWaterPlane();
          this._refl.update(renderer, scene, camera, this._version, this._waterMeshes);
        }
      };
      if (mat === this.specialTransparentMaterial) this._waterMeshes.add(mesh);
      built.push(mesh);
      this.chunkGroup.add(mesh);
    }
    if (built.length) this.meshes.set(key, built);
  }
}

// MeshStandardMaterial whose roughness / metalness / emissive come from the
// per-vertex `matProps` attribute instead of uniforms. Emissive glow is the
// vertex colour scaled by matProps.z, so glow tints match the block colour.
// Shader patch shared by every chunk material: per-vertex `blockLight` (baked
// voxel light) added as extra diffuse illumination. Zero where there's no
// emissive block nearby, so unlit scenes render exactly as before.
const BLOCK_LIGHT_VS = [
  '#include <common>', '#include <common>\nattribute vec3 blockLight;\nvarying vec3 vBlockLight;',
  '#include <begin_vertex>', '#include <begin_vertex>\nvBlockLight = blockLight;',
];
function patchBlockLight(sh, diffuseExpr) {
  sh.vertexShader = sh.vertexShader
    .replace(BLOCK_LIGHT_VS[0], BLOCK_LIGHT_VS[1]).replace(BLOCK_LIGHT_VS[2], BLOCK_LIGHT_VS[3]);
  sh.fragmentShader = sh.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vBlockLight;')
    .replace('#include <opaque_fragment>', `outgoingLight += ${diffuseExpr} * vBlockLight * ${LIGHT_GAIN.toFixed(2)};\n#include <opaque_fragment>`);
}

function makeLitLambert(opts) {
  const m = new THREE.MeshLambertMaterial(opts);
  m.onBeforeCompile = (sh) => patchBlockLight(sh, 'diffuseColor.rgb');
  m.customProgramCacheKey = () => 'voxel-lambert' + (opts.transparent ? '-t' : '');
  return m;
}

function makeSpecialMaterial(extra, { water = false, refl = null } = {}) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, ...extra });
  const uTime = { value: 0 };
  // Animation clock (water ripples, molten lava): World keeps it current from
  // manuscript time when set, else wall clock.
  m.userData.uTime = uTime;
  m.onBeforeCompile = (sh) => {
    if (water) {
      sh.uniforms.uTime = uTime;
      Object.assign(sh.uniforms, refl.uniforms);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;\nvarying vec3 vWNrm;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWNrm = normalize(mat3(modelMatrix) * objectNormal);');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
uniform float uTime;
uniform sampler2D tReflection;
uniform mat4 uReflMat;
uniform float uWaterY;
uniform float uReflOn;
varying vec3 vWPos;
varying vec3 vWNrm;
// Sum of directional sine waves -> analytic slope (dh/dx, dh/dz).
vec2 waterSlope(vec2 p, float t) {
  vec2 s = vec2(0.0);
  const vec4 W[4] = vec4[4](
    vec4( 0.80,  0.60, 0.90, 1.10),   // dir.x, dir.y, frequency, speed
    vec4(-0.55,  0.83, 1.70, 1.60),
    vec4( 0.20, -0.98, 2.90, 2.10),
    vec4(-0.93, -0.36, 4.30, 2.70));
  for (int i = 0; i < 4; i++) {
    vec2 d = W[i].xy; float f = W[i].z, sp = W[i].w;
    float a = 0.06 / f;
    s += d * (a * f * cos(dot(d, p) * f + t * sp));
  }
  return s;
}`)
        // Water top faces only (glossy + facing up): perturb the view-space normal.
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
if (vMatProps.x < 0.1 && vWNrm.y > 0.5) {
  vec2 sl = waterSlope(vWPos.xz, uTime);
  vec3 wn = normalize(vec3(-sl.x, 1.0, -sl.y));
  normal = normalize((viewMatrix * vec4(wn, 0.0)).xyz);
}`)
        // Planar reflection on the dominant water surface, fresnel-blended.
        .replace('#include <opaque_fragment>', `if (uReflOn > 0.5 && vWNrm.y > 0.5 && abs(vWPos.y - uWaterY) < 0.05) {
  vec2 sl = waterSlope(vWPos.xz, uTime);
  vec4 rc = uReflMat * vec4(vWPos, 1.0);
  vec3 refl = texture2D(tReflection, rc.xy / rc.w + sl * 0.045).rgb;
  float cosT = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
  float F = clamp(0.35 + 0.65 * pow(1.0 - cosT, 5.0), 0.0, 1.0);
  outgoingLight = mix(outgoingLight, refl, F);
  diffuseColor.a = mix(diffuseColor.a, 1.0, F);
}
#include <opaque_fragment>`);
    }
    // metals have no diffuse -> they only pick up block light via (1-metalness)
    patchBlockLight(sh, 'diffuseColor.rgb * (1.0 - metalnessFactor)');
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 matProps;\nvarying vec4 vMatProps;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMatProps = matProps;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec4 vMatProps;')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = vMatProps.x;')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = vMatProps.y;')
      // Emissive blocks: damp the lit diffuse term so the colour comes from the
      // glow (otherwise sunlit diffuse + glow tonemaps toward white/pastel).
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= 1.0 - 0.85 * clamp(vMatProps.z, 0.0, 1.0);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance = vColor.rgb * vMatProps.z;');
    if (!water) {
      sh.uniforms.uTime = uTime;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vLPos;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvLPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
uniform float uTime;
varying vec3 vLPos;
float lh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float lnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(lh(i), lh(i + vec2(1, 0)), f.x), mix(lh(i + vec2(0, 1)), lh(i + 1.0), f.x), f.y); }
float lfbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * lnoise(p); p = p * 2.03 + 17.0; a *= 0.5; } return v; }`)
        // Molten lava: slowly drifting crust (dark rock) over bright flowing
        // cracks; texture is quantised to 8 px/block so it stays voxel-y.
        .replace('#include <lights_physical_fragment>', `if (vMatProps.w > 0.5) {
  vec3 q = floor(vLPos * 8.0) / 8.0;
  vec2 uv = q.xz + vec2(q.y * 0.37, q.y * 0.61);
  vec2 flow = vec2(uTime * 0.12, uTime * 0.07);
  float n = lfbm(uv * 0.9 + flow + lfbm(uv * 0.45 - flow * 0.5) * 1.6);
  n = clamp((n - 0.28) / 0.42, 0.0, 1.0);            // stretch fbm's narrow range
  float crust = smoothstep(0.52, 0.72, n);
  float pulse = 0.85 + 0.15 * sin(uTime * 2.1 + n * 9.0);
  vec3 hot = mix(vec3(1.0, 0.42, 0.07) * 1.45, vec3(0.95, 0.10, 0.01) * 1.05, smoothstep(0.08, 0.5, n)) * pulse;
  totalEmissiveRadiance = mix(hot, vec3(0.06, 0.012, 0.004), crust);
  diffuseColor.rgb = mix(diffuseColor.rgb * 0.2, vec3(0.05, 0.035, 0.03), crust);
}
#include <lights_physical_fragment>`);
    }
  };
  m.customProgramCacheKey = () => 'voxel-special' + (extra.transparent ? '-t' : '') + (water ? '-w' : '');
  return m;
}
