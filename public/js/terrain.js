// Pure terrain generation. Used by both the client (World.js, browser) and the
// bot/server (Node, via dynamic import). No DOM/Three.js dependencies.

import { Block } from './Textures.js';

// --- Deterministic noise ---
export function hash2(x, z) {
  let n = Math.imul(x + 131, 374761393) + Math.imul(z + 97, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

export function smoothNoise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z);
  const fx = x - ix, fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sz = fz * fz * (3 - 2 * fz);
  const n00 = hash2(ix, iz), n10 = hash2(ix + 1, iz);
  const n01 = hash2(ix, iz + 1), n11 = hash2(ix + 1, iz + 1);
  return (n00 * (1 - sx) + n10 * sx) * (1 - sz) +
         (n01 * (1 - sx) + n11 * sx) * sz;
}

// --- Biome ---
export function biomeAt(x, z) {
  const b = smoothNoise(x * 0.008 + 50, z * 0.008 + 50);
  const m = smoothNoise(x * 0.015 + 99, z * 0.015 + 99);
  if (b < 0.32) return 'desert';
  if (b > 0.72) return m > 0.5 ? 'taiga' : 'forest';
  return m > 0.55 ? 'forest' : 'plains';
}

// --- Terrain height ---
export function terrainHeight(x, z) {
  const biome = biomeAt(x, z);
  const base =
    10 +
    6 * smoothNoise(x * 0.025, z * 0.025) +
    3 * smoothNoise(x * 0.06, z * 0.06) +
    1.5 * smoothNoise(x * 0.13, z * 0.13);
  if (biome === 'desert') return Math.floor(base - 1 + 2 * smoothNoise(x * 0.05, z * 0.05));
  if (biome === 'taiga')  return Math.floor(base + 2 + 5 * smoothNoise(x * 0.04, z * 0.04));
  if (biome === 'forest') return Math.floor(base + 1 + 2 * smoothNoise(x * 0.04, z * 0.04));
  return Math.floor(base);
}

// --- Surface block at a column ---
export function surfaceBlock(x, z, h) {
  if (h >= 22) return Block.SNOW;
  if (h >= 19) return Block.STONE;
  const biome = biomeAt(x, z);
  if (biome === 'desert') return Block.SAND;
  if (biome === 'taiga')  return Block.SNOW;
  return Block.GRASS;
}

// --- Trees ---
export function shouldHaveTree(x, z) {
  const biome = biomeAt(x, z);
  const density =
    biome === 'desert' ? 0.0005 :
    biome === 'forest' ? 0.04 :
    biome === 'taiga'  ? 0.015 :
                         0.006;
  if (hash2(x * 13 + 37, z * 17 + 59) > density) return false;
  const h = terrainHeight(x, z);
  if (h >= 20) return false;
  return Math.abs(h - terrainHeight(x + 1, z)) <= 1 &&
         Math.abs(h - terrainHeight(x - 1, z)) <= 1 &&
         Math.abs(h - terrainHeight(x, z + 1)) <= 1 &&
         Math.abs(h - terrainHeight(x, z - 1)) <= 1;
}

// Returns { trunkH, leavesTopRel } if a tree is at this column, else null.
// trunkH: height of the trunk (4-5 blocks). Leaves extend ~2 blocks above the trunk top.
export function treeAt(x, z) {
  if (!shouldHaveTree(x, z)) return null;
  const trunkH = 4 + Math.floor(hash2(x * 7, z * 11) * 2);
  return { trunkH, leavesTop: trunkH + 2, leavesRadius: 2 };
}

// What would be at (x, y, z) if no player edits had ever happened?
// Pure deterministic; mirrors the chunk-gen + tree-placement in World.js.
export function naturalBlockAt(x, y, z) {
  if (y < 0) return Block.AIR;
  if (y === 0) return Block.BEDROCK;

  const h = terrainHeight(x, z);

  // At or below terrain surface
  if (y <= h) {
    if (y === h) return surfaceBlock(x, z, h);
    if (y >= h - 3) return biomeAt(x, z) === 'desert' ? Block.SAND : Block.DIRT;
    return Block.STONE;
  }

  // Above terrain: trunk in own column?
  const own = treeAt(x, z);
  if (own && y > h && y <= h + own.trunkH) return Block.OAK_LOG;

  // Above terrain: leaves from this or any neighbor tree?
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      const t = treeAt(x + dx, z + dz);
      if (!t) continue;
      const nh = terrainHeight(x + dx, z + dz);
      const topY = nh + t.trunkH;
      const dy = y - topY;
      if (dy < -1 || dy > 2) continue;
      const r = dy <= 0 ? 2 : 1;
      // (-dx, -dz) is offset within the *neighbor's* leaf cluster
      const ldx = -dx, ldz = -dz;
      if (Math.abs(ldx) > r || Math.abs(ldz) > r) continue;
      if (ldx === 0 && ldz === 0 && dy <= 0) continue; // skip trunk cell
      if (Math.abs(ldx) === r && Math.abs(ldz) === r && dy < 1 && hash2(x, z) > 0.6) continue;
      return Block.LEAVES;
    }
  }

  return Block.AIR;
}

// --- Build context: terrain description in a radius around an origin ---
// originX, originZ: world coords. originY: the absolute Y of the bot's relative-Y=0
// (i.e., one above ground at originX/originZ). radius: cells in each direction.
// Returns text suitable for a system/user prompt.
export function describeLocalTerrain(originX, originZ, originY, radius = 8) {
  const baseH = terrainHeight(originX, originZ);
  const heights = [];
  const trees = [];
  const biomes = new Map();
  let allFlat = true;

  for (let dz = -radius; dz <= radius; dz++) {
    const row = [];
    for (let dx = -radius; dx <= radius; dx++) {
      const wx = originX + dx, wz = originZ + dz;
      const h = terrainHeight(wx, wz);
      const delta = h - baseH;
      row.push(delta);
      if (delta !== 0) allFlat = false;
      const t = treeAt(wx, wz);
      if (t) trees.push({ x: dx, z: dz, trunkH: t.trunkH, ground: delta });
      const b = biomeAt(wx, wz);
      biomes.set(b, (biomes.get(b) || 0) + 1);
    }
    heights.push(row);
  }

  let s = '';
  const dominantBiome = [...biomes.entries()].sort((a, b) => b[1] - a[1])[0][0];
  s += `Biome here: ${dominantBiome}.\n`;
  if (allFlat) {
    s += 'Local terrain: completely flat at ground level (Y=0).\n';
  } else {
    s += 'Local terrain heights (relative to your origin Y=0; dot=flat, +N=terrain rises N blocks, -N=terrain drops):\n';
    // Header
    const xs = Array.from({ length: radius * 2 + 1 }, (_, i) => i - radius);
    s += '       ' + xs.map(x => `${x >= 0 ? '+' : ''}${x}`.padStart(3)).join(' ') + '\n';
    for (let i = 0; i < heights.length; i++) {
      const z = i - radius;
      const cells = heights[i].map(h => h === 0 ? '  .' : (h > 0 ? `+${h}` : `${h}`).padStart(3));
      s += `  z=${(z >= 0 ? '+' : '') + z}: `.padEnd(8) + cells.join(' ') + '\n';
    }
  }
  if (trees.length) {
    s += `Trees in range (clear with AIR if in the way; trunk is ${trees[0].trunkH}-block OAK_LOG, leaves ~5-block radius dome above):\n`;
    for (const t of trees.slice(0, 12)) {
      const baseY = t.ground; // ground rises/drops at this cell
      s += `  - tree at (${t.x}, ${t.z}), trunk Y=${baseY}..${baseY + t.trunkH}\n`;
    }
    if (trees.length > 12) s += `  ... and ${trees.length - 12} more\n`;
  }
  return s;
}
