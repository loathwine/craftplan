import * as THREE from 'three';
import { Block, BLOCK_COLORS, colorVariation } from './Textures.js';
import { hash2, biomeAt, terrainHeight, surfaceBlock, shouldHaveTree } from './terrain.js';

export const CHUNK_SIZE = 16;
export const WORLD_HEIGHT = 128;
const CHUNKS = 16; // 16x16 chunks = 256x256 world
export const WORLD_SIZE = CHUNKS * CHUNK_SIZE;

// --- Face definitions (CCW winding, normal points outward) ---
const FACES = [
  { dir: [0, 1, 0], corners: [[0,1,1],[1,1,1],[1,1,0],[0,1,0]], type: 'top' },
  { dir: [0,-1, 0], corners: [[0,0,0],[1,0,0],[1,0,1],[0,0,1]], type: 'bottom' },
  { dir: [1, 0, 0], corners: [[1,0,0],[1,1,0],[1,1,1],[1,0,1]], type: 'side' },
  { dir: [-1,0, 0], corners: [[0,0,1],[0,1,1],[0,1,0],[0,0,0]], type: 'side' },
  { dir: [0, 0, 1], corners: [[1,0,1],[1,1,1],[0,1,1],[0,0,1]], type: 'side' },
  { dir: [0, 0,-1], corners: [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], type: 'side' },
];

export class World {
  constructor(scene) {
    this.scene = scene;
    this.chunks = new Map();
    this.meshes = new Map();
    this.blockChanges = new Map();
    this.material = new THREE.MeshLambertMaterial({ vertexColors: true });
    this.chunkGroup = new THREE.Group();
    scene.add(this.chunkGroup);
    this._generate();
  }

  _generate() {
    // Pass 1: terrain
    for (let cx = 0; cx < CHUNKS; cx++)
      for (let cz = 0; cz < CHUNKS; cz++)
        this._genTerrain(cx, cz);

    // Pass 2: trees (can write to any chunk)
    for (let cx = 0; cx < CHUNKS; cx++)
      for (let cz = 0; cz < CHUNKS; cz++)
        this._genTrees(cx, cz);

    // Pass 3: meshes
    for (let cx = 0; cx < CHUNKS; cx++)
      for (let cz = 0; cz < CHUNKS; cz++)
        this._buildMesh(cx, cz);
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
    this.chunks.set(`${cx},${cz}`, data);
  }

  _writeBlock(x, y, z, block) {
    if (y < 0 || y >= WORLD_HEIGHT) return;
    const cx = Math.floor(x / CHUNK_SIZE), cz = Math.floor(z / CHUNK_SIZE);
    const chunk = this.chunks.get(`${cx},${cz}`);
    if (!chunk) return;
    const lx = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const idx = lx + lz * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE;
    if (chunk[idx] === Block.AIR) chunk[idx] = block;
  }

  _genTrees(cx, cz) {
    const x0 = cx * CHUNK_SIZE, z0 = cz * CHUNK_SIZE;
    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const wx = x0 + lx, wz = z0 + lz;
        if (!shouldHaveTree(wx, wz)) continue;
        const h = terrainHeight(wx, wz);
        const trunkH = 4 + Math.floor(hash2(wx * 7, wz * 11) * 2);

        for (let y = h + 1; y <= h + trunkH; y++)
          this._writeBlock(wx, y, wz, Block.OAK_LOG);

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
    const key = `${x},${y},${z}`;
    if (this.blockChanges.has(key)) return this.blockChanges.get(key);
    if (y < 0 || y >= WORLD_HEIGHT) return Block.AIR;
    const cx = Math.floor(x / CHUNK_SIZE), cz = Math.floor(z / CHUNK_SIZE);
    const chunk = this.chunks.get(`${cx},${cz}`);
    if (!chunk) return Block.AIR;
    const lx = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    return chunk[lx + lz * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE];
  }

  setBlock(x, y, z, block) {
    this.blockChanges.set(`${x},${y},${z}`, block);
    const cx = Math.floor(x / CHUNK_SIZE), cz = Math.floor(z / CHUNK_SIZE);
    this._buildMesh(cx, cz);
    const lx = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    if (lx === 0 && cx > 0) this._buildMesh(cx - 1, cz);
    if (lx === CHUNK_SIZE - 1 && cx < CHUNKS - 1) this._buildMesh(cx + 1, cz);
    if (lz === 0 && cz > 0) this._buildMesh(cx, cz - 1);
    if (lz === CHUNK_SIZE - 1 && cz < CHUNKS - 1) this._buildMesh(cx, cz + 1);
  }

  getTerrainHeight(x, z) {
    return terrainHeight(Math.floor(x), Math.floor(z));
  }

  getHighestBlock(x, z) {
    const bx = Math.floor(x), bz = Math.floor(z);
    for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
      if (this.getBlock(bx, y, bz) !== Block.AIR) return y;
    }
    return 0;
  }

  applyBlockChanges(changes) {
    const rebuild = new Set();
    for (const [key, block] of Object.entries(changes)) {
      this.blockChanges.set(key, block);
      const [x,, z] = key.split(',').map(Number);
      const cx = Math.floor(x / CHUNK_SIZE), cz = Math.floor(z / CHUNK_SIZE);
      rebuild.add(`${cx},${cz}`);
    }
    for (const k of rebuild) {
      const [cx, cz] = k.split(',').map(Number);
      this._buildMesh(cx, cz);
    }
  }

  getChunkMeshes() {
    return [...this.meshes.values()];
  }

  // --- Mesh builder ---
  _buildMesh(cx, cz) {
    const key = `${cx},${cz}`;
    const old = this.meshes.get(key);
    if (old) { this.chunkGroup.remove(old); old.geometry.dispose(); }

    const positions = [];
    const normals = [];
    const colors = [];
    const indices = [];
    let vtx = 0;
    const x0 = cx * CHUNK_SIZE, z0 = cz * CHUNK_SIZE;

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        for (let lx = 0; lx < CHUNK_SIZE; lx++) {
          const wx = x0 + lx, wz = z0 + lz;
          const block = this.getBlock(wx, y, wz);
          if (block === Block.AIR) continue;
          const bc = BLOCK_COLORS[block];
          if (!bc) continue;
          const cv = colorVariation(wx, y, wz);

          for (const face of FACES) {
            const nx = wx + face.dir[0], ny = y + face.dir[1], nz = wz + face.dir[2];
            if (this.getBlock(nx, ny, nz) !== Block.AIR) continue;

            const fc = bc[face.type];
            for (let i = 0; i < 4; i++) {
              const c = face.corners[i];
              positions.push(wx + c[0], y + c[1], wz + c[2]);
              normals.push(face.dir[0], face.dir[1], face.dir[2]);

              let r = fc[0] * cv, g = fc[1] * cv, b = fc[2] * cv;
              // Grass side gradient: blend top vertices toward green
              if (block === Block.GRASS && face.type === 'side' && (i === 1 || i === 2)) {
                const gt = bc.top;
                r = r * 0.45 + gt[0] * cv * 0.55;
                g = g * 0.45 + gt[1] * cv * 0.55;
                b = b * 0.45 + gt[2] * cv * 0.55;
              }
              colors.push(Math.min(1, r), Math.min(1, g), Math.min(1, b));
            }

            indices.push(vtx, vtx + 1, vtx + 2, vtx, vtx + 2, vtx + 3);
            vtx += 4;
          }
        }
      }
    }

    if (positions.length === 0) return;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeBoundingSphere();

    const mesh = new THREE.Mesh(geo, this.material);
    this.meshes.set(key, mesh);
    this.chunkGroup.add(mesh);
  }
}
