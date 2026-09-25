import * as THREE from 'three';
import { Block, BLOCK_COLORS, BLOCK_MATERIALS, colorVariation, isTransparent, isOpaque, isEmissive } from './Textures.js';
import { hash2, biomeAt, terrainHeight, surfaceBlock, shouldHaveTree } from './terrain.js';
import { makeSkyEnvMap } from './sky.js';

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
const OPAQUE = new Uint8Array(256), TRANS = new Uint8Array(256), EMIT = new Uint8Array(256);
for (let b = 1; b < 256; b++) {
  if (!BLOCK_COLORS[b]) continue;
  OPAQUE[b] = isOpaque(b) ? 1 : 0;
  TRANS[b] = isTransparent(b) ? 1 : 0;
  EMIT[b] = isEmissive(b) ? 1 : 0;
}

// Growable typed-array mesh buffer, reused across builds (no per-face allocs).
class MeshBuf {
  constructor() { this.v = 0; this.i = 0; this._alloc(4096); }
  _alloc(nv) {
    const grow = (old, n) => { const a = new old.constructor(n); a.set(old.subarray(0, Math.min(old.length, n))); return a; };
    this.pos = this.pos ? grow(this.pos, nv * 3) : new Float32Array(nv * 3);
    this.nrm = this.nrm ? grow(this.nrm, nv * 3) : new Float32Array(nv * 3);
    this.col = this.col ? grow(this.col, nv * 3) : new Float32Array(nv * 3);
    this.mat = this.mat ? grow(this.mat, nv * 3) : new Float32Array(nv * 3);
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
    this.material = new THREE.MeshLambertMaterial({ vertexColors: true });
    this.transparentMaterial = new THREE.MeshLambertMaterial({
      vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide,
    });
    // Special-material passes (metal / glossy / emissive / water). Per-vertex
    // `matProps` = (roughness, metalness, emissive) drives MeshStandardMaterial
    // so one material + one draw call covers every special block in a section.
    this.specialMaterial = makeSpecialMaterial({});
    this.specialTransparentMaterial = makeSpecialMaterial({
      transparent: true, opacity: 0.62, depthWrite: false, side: THREE.DoubleSide,
    });
    this._envReady = false;
    this.chunkGroup = new THREE.Group();
    scene.add(this.chunkGroup);
    this._generate();
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

  _rebuildDirty(dirty) {
    const C = this.chunkCount;
    for (const k of dirty) {
      const sy = k % SECTIONS, col = (k - sy) / SECTIONS;
      this._buildSection(col % C, (col / C) | 0, sy);
    }
  }

  setBlock(x, y, z, block) {
    if (!this._inWorld(x, y, z)) return;
    this._col(x, z)[this._idx(x, y, z)] = block;
    const dirty = new Set();
    this._markDirty(x, y, z, dirty);
    this._rebuildDirty(dirty);
  }

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
    for (const key in changes) {
      const c1 = key.indexOf(','), c2 = key.indexOf(',', c1 + 1);
      const x = +key.slice(0, c1), y = +key.slice(c1 + 1, c2), z = +key.slice(c2 + 1);
      if (!this._inWorld(x, y, z)) continue;
      this._col(x, z)[this._idx(x, y, z)] = changes[key];
      this._markDirty(x, y, z, dirty);
    }
    this._rebuildDirty(dirty);
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

  // --- Mesh builder (one 16³ section) ---
  _buildSection(cx, cz, sy) {
    const key = this._secKey(cx, cz, sy);
    const old = this.meshes.get(key);
    if (old) { for (const m of old) { this.chunkGroup.remove(m); m.geometry.dispose(); } this.meshes.delete(key); }

    const col = this.data[cz * this.chunkCount + cx];
    const y0 = sy * SECTION_H, y1 = y0 + SECTION_H;
    // Fast reject: empty section (common above the terrain).
    let any = false;
    for (let i = y0 << 8, e = y1 << 8; i < e; i++) if (col[i] !== 0) { any = true; break; }
    if (!any) return;

    for (const k in SCRATCH) SCRATCH[k].reset();
    const x0 = cx * CHUNK_SIZE, z0 = cz * CHUNK_SIZE;

    for (let y = y0; y < y1; y++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        for (let lx = 0; lx < CHUNK_SIZE; lx++) {
          const block = col[lx + (lz << 4) + (y << 8)];
          if (block === 0) continue;
          const bc = BLOCK_COLORS[block];
          if (!bc) continue;
          const wx = x0 + lx, wz = z0 + lz;
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
              if (mp) { target.mat[p] = mp.roughness; target.mat[p + 1] = mp.metalness; target.mat[p + 2] = mp.emissive; }
            }
            const ii = target.i;
            target.idx[ii] = vb; target.idx[ii + 1] = vb + 1; target.idx[ii + 2] = vb + 2;
            target.idx[ii + 3] = vb; target.idx[ii + 4] = vb + 2; target.idx[ii + 5] = vb + 3;
            target.i += 6; target.v += 4;
          }
        }
      }
    }

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
      if (special) geo.setAttribute('matProps', new THREE.BufferAttribute(buf.mat.slice(0, buf.v * 3), 3));
      geo.setIndex(new THREE.BufferAttribute(buf.idx.slice(0, buf.i), 1));
      geo.computeBoundingSphere();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = trans ? 1 : 0;
      // Opaque sections cast + receive shadows; transparent (glass, water)
      // only receive so we don't get black silhouettes through glass.
      mesh.castShadow = !trans;
      mesh.receiveShadow = true;
      if (special) mesh.onBeforeRender = (renderer, scene) => this._ensureEnvironment(renderer, scene);
      built.push(mesh);
      this.chunkGroup.add(mesh);
    }
    if (built.length) this.meshes.set(key, built);
  }
}

// MeshStandardMaterial whose roughness / metalness / emissive come from the
// per-vertex `matProps` attribute instead of uniforms. Emissive glow is the
// vertex colour scaled by matProps.z, so glow tints match the block colour.
function makeSpecialMaterial(extra) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, ...extra });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 matProps;\nvarying vec3 vMatProps;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMatProps = matProps;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vMatProps;')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = vMatProps.x;')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = vMatProps.y;')
      // Emissive blocks: damp the lit diffuse term so the colour comes from the
      // glow (otherwise sunlit diffuse + glow tonemaps toward white/pastel).
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= 1.0 - 0.85 * clamp(vMatProps.z, 0.0, 1.0);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance = vColor.rgb * vMatProps.z;');
  };
  m.customProgramCacheKey = () => 'voxel-special' + (extra.transparent ? '-t' : '');
  return m;
}
