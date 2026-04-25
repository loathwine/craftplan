// BFS-sample local geometry around an origin and emit it as a compact
// list of filled boxes — same format the AI will use in its output:
//   [x1, y1, z1, x2, y2, z2, blockId]
//
// The BFS walks through air cells, stopping at solid blocks, so caves and
// overhangs are handled naturally and we don't enumerate buried boulders we
// can't see.
import { naturalBlockAt } from '../public/js/terrain.js';
import { Block } from '../public/js/Textures.js';

const AIR = 0;

// BFS sampler. Returns Map of "x,y,z" -> blockId for every solid block touching
// the air pocket reachable from origin, plus the origin's own cell.
//   getBlock(x,y,z) - resolver. If null, uses naturalBlockAt directly.
//   radius / vradius - cap exploration extent
export function bfsSample({ origin, radius = 14, vradius = 10, getBlock = null }) {
  const get = getBlock || ((x, y, z) => naturalBlockAt(x, y, z));
  const [ox, oy, oz] = origin;

  const visited = new Set();
  const solid = new Map(); // key -> block id
  const queue = [[ox, oy, oz]];

  // Cap to keep BFS bounded. 22-radius x 14-vradius ≈ 80k cells worst-case (mostly air).
  const MAX_VISITED = 100000;

  while (queue.length > 0 && visited.size < MAX_VISITED) {
    const [x, y, z] = queue.shift();
    const key = `${x},${y},${z}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (Math.abs(x - ox) > radius || Math.abs(z - oz) > radius || Math.abs(y - oy) > vradius) continue;

    const blk = get(x, y, z);
    if (blk !== AIR) {
      solid.set(key, blk);
      continue; // don't expand through solid
    }
    // Air: keep exploring
    queue.push([x+1, y, z], [x-1, y, z], [x, y+1, z], [x, y-1, z], [x, y, z+1], [x, y, z-1]);
  }

  return solid;
}

// 3D greedy mesh: collapse runs of identical adjacent blocks into [x1,y1,z1,x2,y2,z2,block] boxes.
// Input: Map "x,y,z" -> blockId (absolute coords).
// Output: array of {x1,y1,z1,x2,y2,z2,block} (absolute coords).
export function greedyMesh(solid) {
  if (solid.size === 0) return [];
  const cells = [...solid.entries()].map(([k, b]) => {
    const [x, y, z] = k.split(',').map(Number);
    return { x, y, z, b, key: k };
  });

  // Bounding box (used only to early-out lookups)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const c of cells) {
    if (c.x < minX) minX = c.x; if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y; if (c.y > maxY) maxY = c.y;
    if (c.z < minZ) minZ = c.z; if (c.z > maxZ) maxZ = c.z;
  }
  const has = (x, y, z, b) => solid.get(`${x},${y},${z}`) === b;

  const visited = new Set();
  const boxes = [];

  // Sort for deterministic order: y, z, x
  cells.sort((a, b) => a.y - b.y || a.z - b.z || a.x - b.x);

  for (const c of cells) {
    if (visited.has(c.key)) continue;
    const b = c.b;

    // Expand X
    let x2 = c.x;
    while (x2 + 1 <= maxX && has(x2 + 1, c.y, c.z, b) && !visited.has(`${x2+1},${c.y},${c.z}`)) x2++;

    // Expand Z
    let z2 = c.z;
    outerZ: while (z2 + 1 <= maxZ) {
      for (let xi = c.x; xi <= x2; xi++) {
        const k = `${xi},${c.y},${z2+1}`;
        if (!has(xi, c.y, z2+1, b) || visited.has(k)) break outerZ;
      }
      z2++;
    }

    // Expand Y
    let y2 = c.y;
    outerY: while (y2 + 1 <= maxY) {
      for (let xi = c.x; xi <= x2; xi++) {
        for (let zi = c.z; zi <= z2; zi++) {
          const k = `${xi},${y2+1},${zi}`;
          if (!has(xi, y2+1, zi, b) || visited.has(k)) break outerY;
        }
      }
      y2++;
    }

    // Mark visited
    for (let xi = c.x; xi <= x2; xi++)
      for (let yi = c.y; yi <= y2; yi++)
        for (let zi = c.z; zi <= z2; zi++)
          visited.add(`${xi},${yi},${zi}`);

    boxes.push({ x1: c.x, y1: c.y, z1: c.z, x2, y2, z2, block: b });
  }

  return boxes;
}

// Format boxes as a compact JSON array, with coords made relative to origin.
export function formatBoxes(boxes, [ox, oy, oz]) {
  return '[' + boxes.map(b =>
    `[${b.x1 - ox},${b.y1 - oy},${b.z1 - oz},${b.x2 - ox},${b.y2 - oy},${b.z2 - oz},${b.block}]`
  ).join(',') + ']';
}

// Convenience: BFS + mesh + format. Returns multi-line text suitable for prompts.
export function describeLocalGeometry({ origin, radius = 14, vradius = 10, getBlock = null }) {
  const solid = bfsSample({ origin, radius, vradius, getBlock });
  const boxes = greedyMesh(solid);
  const lines = [];
  lines.push(`LOCAL GEOMETRY (what's already in the world; ${boxes.length} boxes covering ${solid.size} blocks):`);
  lines.push(`Format: array of [x1,y1,z1,x2,y2,z2,blockId] filled boxes (inclusive). Coords RELATIVE to your origin.`);
  lines.push(`Block IDs: 1=GRASS 2=DIRT 3=STONE 4=OAK_LOG 5=LEAVES 6=SAND 7=PLANKS 8=COBBLE 9=BEDROCK 10=BRICK 11=GLASS 12=SNOW 13=ICE`);
  lines.push(formatBoxes(boxes, origin));
  return lines.join('\n');
}
