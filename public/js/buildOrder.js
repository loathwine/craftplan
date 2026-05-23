// Build-order strategies. The default "bottom-up" sort that the recorder
// uses gives a 3D-printer feel — the build crawls upward layer by layer.
// These alternatives give the build a more cinematic appearance arc:
//   - structural: foundations + main mass first, then ornamentation
//   - outline-first: per-Y silhouette before interior fill
//   - painterly: from centroid outward in expanding shells
//   - sparse-then-dense: stride-N skeleton first, then fill the gaps
//
// Each takes a list of {x, y, z, block} (already rotated, in build-local
// coords) and returns the same blocks in a new order. The recorder then
// allocates each block a placement time proportional to its index.

const isAir = 0;
const isSolid = (b) => b !== isAir && b !== undefined;

function bottomUp(plan) {
  return [...plan].sort((a, b) => a.y - b.y || a.z - b.z || a.x - b.x);
}

function structural(plan) {
  // Phase 1 (40%): bottom half by Y — the "foundation + body".
  // Phase 2 (40%): outer-shell blocks of the top half — "silhouette".
  // Phase 3 (20%): everything left — fills, antennae, details.
  //
  // Cheap shell detection: a block is on the shell if at least one of its
  // six axis-aligned neighbours is absent from the plan.
  const set = new Set(plan.map(b => `${b.x},${b.y},${b.z}`));
  const yMin = Math.min(...plan.map(b => b.y));
  const yMax = Math.max(...plan.map(b => b.y));
  const yMid = yMin + (yMax - yMin) * 0.45;

  const onShell = (b) =>
    !set.has(`${b.x+1},${b.y},${b.z}`) || !set.has(`${b.x-1},${b.y},${b.z}`) ||
    !set.has(`${b.x},${b.y+1},${b.z}`) || !set.has(`${b.x},${b.y-1},${b.z}`) ||
    !set.has(`${b.x},${b.y},${b.z+1}`) || !set.has(`${b.x},${b.y},${b.z-1}`);

  const foundation = plan.filter(b => b.y < yMid).sort((a, b) => a.y - b.y || a.z - b.z || a.x - b.x);
  const upper = plan.filter(b => b.y >= yMid);
  const shell = upper.filter(onShell).sort((a, b) => a.y - b.y || a.z - b.z || a.x - b.x);
  const details = upper.filter(b => !onShell(b)).sort((a, b) => a.y - b.y);

  return [...foundation, ...shell, ...details];
}

function outlineFirst(plan) {
  const set = new Set(plan.map(b => `${b.x},${b.y},${b.z}`));
  const layers = new Map();
  for (const b of plan) {
    if (!layers.has(b.y)) layers.set(b.y, []);
    layers.get(b.y).push(b);
  }
  const out = [];
  for (const y of [...layers.keys()].sort((a, b) => a - b)) {
    const layer = layers.get(y);
    const edge = [], inner = [];
    for (const b of layer) {
      // "Edge" within the Y plane: any of 4 horizontal neighbours absent.
      const isEdge =
        !set.has(`${b.x+1},${b.y},${b.z}`) || !set.has(`${b.x-1},${b.y},${b.z}`) ||
        !set.has(`${b.x},${b.y},${b.z+1}`) || !set.has(`${b.x},${b.y},${b.z-1}`);
      (isEdge ? edge : inner).push(b);
    }
    out.push(...edge.sort((a, b) => a.z - b.z || a.x - b.x));
    out.push(...inner.sort((a, b) => a.z - b.z || a.x - b.x));
  }
  return out;
}

function painterly(plan) {
  // Distance from centroid, then within a distance band sort by Y so the
  // structure grows outward in expanding shells while bottom-favouring
  // each ring (gravity still reads).
  let cx = 0, cy = 0, cz = 0;
  for (const b of plan) { cx += b.x; cy += b.y; cz += b.z; }
  const n = Math.max(1, plan.length);
  cx /= n; cy /= n; cz /= n;
  return [...plan].sort((a, b) => {
    const da = (a.x-cx)**2 + (a.y-cy)**2 + (a.z-cz)**2;
    const db = (b.x-cx)**2 + (b.y-cy)**2 + (b.z-cz)**2;
    return da - db || a.y - b.y;
  });
}

function sparseThenDense(plan, stride = 4) {
  // Hash each cell to a deterministic order class — every (stride^3)-th
  // block placed first, gives a "scaffold materialises then fills".
  const tagged = plan.map((b, i) => ({
    b, i,
    // Lehmer-style mix; just needs to be reasonably uniform across coords.
    cls: (((b.x % stride) + stride) % stride) * stride * stride +
         (((b.y % stride) + stride) % stride) * stride +
         (((b.z % stride) + stride) % stride),
  }));
  tagged.sort((a, b) => a.cls - b.cls || a.b.y - b.b.y || a.i - b.i);
  return tagged.map(t => t.b);
}

// BFS from one chosen corner of the build's bounding box. The first block
// placed is the corner-closest, then 6-connected neighbours, expanding in
// roughly-spherical shells from that seed. Visually: the build washes
// outward from a corner like water rising, very different from layer-by-
// layer 3D-printing.
function bfsFromCorner(plan, opts = {}) {
  if (plan.length === 0) return [];
  const corner = opts.corner || 'low-x-low-z';
  const set = new Set(plan.map(b => `${b.x},${b.y},${b.z}`));
  const lookup = new Map(plan.map(b => [`${b.x},${b.y},${b.z}`, b]));
  const score = (b) => {
    let s = 0;
    s += corner.includes('low-x') ? b.x : -b.x;
    s += corner.includes('low-y') ? b.y : (corner.includes('high-y') ? -b.y : b.y * 0.5);
    s += corner.includes('low-z') ? b.z : -b.z;
    return s;
  };
  const seed = plan.reduce((best, b) => score(b) < score(best) ? b : best);
  const queue = [seed];
  const visited = new Set([`${seed.x},${seed.y},${seed.z}`]);
  const out = [];
  while (queue.length) {
    const cur = queue.shift();
    out.push(cur);
    for (const [dx, dy, dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]) {
      const k = `${cur.x+dx},${cur.y+dy},${cur.z+dz}`;
      if (!visited.has(k) && set.has(k)) {
        visited.add(k);
        queue.push(lookup.get(k));
      }
    }
  }
  for (const b of plan) {
    if (!visited.has(`${b.x},${b.y},${b.z}`)) out.push(b);
  }
  return out;
}

// DFS from the same corner. Uses a stack so the build grows as a tendril
// that snakes through the structure rather than expanding shells. More
// chaotic, good for organic shapes (dragons).
function dfsFromCorner(plan, opts = {}) {
  if (plan.length === 0) return [];
  const corner = opts.corner || 'low-x-low-z';
  const set = new Set(plan.map(b => `${b.x},${b.y},${b.z}`));
  const lookup = new Map(plan.map(b => [`${b.x},${b.y},${b.z}`, b]));
  const score = (b) => {
    let s = 0;
    s += corner.includes('low-x') ? b.x : -b.x;
    s += corner.includes('low-y') ? b.y : (corner.includes('high-y') ? -b.y : b.y * 0.5);
    s += corner.includes('low-z') ? b.z : -b.z;
    return s;
  };
  const seed = plan.reduce((best, b) => score(b) < score(best) ? b : best);
  const stack = [seed];
  const visited = new Set([`${seed.x},${seed.y},${seed.z}`]);
  const out = [];
  while (stack.length) {
    const cur = stack.pop();
    out.push(cur);
    for (const [dx, dy, dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]) {
      const k = `${cur.x+dx},${cur.y+dy},${cur.z+dz}`;
      if (!visited.has(k) && set.has(k)) {
        visited.add(k);
        stack.push(lookup.get(k));
      }
    }
  }
  for (const b of plan) {
    if (!visited.has(`${b.x},${b.y},${b.z}`)) out.push(b);
  }
  return out;
}

// Flood-fill: DFS picks the "direction of travel" through the structure,
// but at each DFS step we also place a small BFS-ball of nearby blocks.
// The net effect: a thick wave snakes through the structure, eating
// adjacent blocks as it passes — wider than pure DFS, more directional
// than pure BFS. Reads like a river of placement.
function floodFill(plan, opts = {}) {
  if (plan.length === 0) return [];
  const corner = opts.corner || 'low-x-low-z';
  const radius = opts.floodRadius ?? 2;  // BFS radius around each DFS node
  const set = new Set(plan.map(b => `${b.x},${b.y},${b.z}`));
  const lookup = new Map(plan.map(b => [`${b.x},${b.y},${b.z}`, b]));
  const score = (b) => {
    let s = 0;
    s += corner.includes('low-x') ? b.x : -b.x;
    s += corner.includes('low-y') ? b.y : (corner.includes('high-y') ? -b.y : b.y * 0.5);
    s += corner.includes('low-z') ? b.z : -b.z;
    return s;
  };
  const seed = plan.reduce((best, b) => score(b) < score(best) ? b : best);
  const stack = [seed];
  const visited = new Set();
  const out = [];

  // For each DFS node, expand a small BFS ball around it within 'radius'.
  const localBFS = (node) => {
    const q = [{ b: node, d: 0 }];
    const seen = new Set([`${node.x},${node.y},${node.z}`]);
    const localOut = [];
    while (q.length) {
      const { b, d } = q.shift();
      const key = `${b.x},${b.y},${b.z}`;
      if (visited.has(key)) continue;
      visited.add(key);
      localOut.push(b);
      if (d < radius) {
        for (const [dx, dy, dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]) {
          const k = `${b.x+dx},${b.y+dy},${b.z+dz}`;
          if (!seen.has(k) && set.has(k) && !visited.has(k)) {
            seen.add(k);
            q.push({ b: lookup.get(k), d: d + 1 });
          }
        }
      }
    }
    return localOut;
  };

  while (stack.length) {
    const cur = stack.pop();
    if (visited.has(`${cur.x},${cur.y},${cur.z}`)) continue;
    // Place a flood ball around the current DFS node
    out.push(...localBFS(cur));
    // Pick next DFS step from unvisited neighbours
    for (const [dx, dy, dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]) {
      const k = `${cur.x+dx},${cur.y+dy},${cur.z+dz}`;
      if (set.has(k) && !visited.has(k)) stack.push(lookup.get(k));
    }
  }
  for (const b of plan) {
    if (!visited.has(`${b.x},${b.y},${b.z}`)) out.push(b);
  }
  return out;
}

const STRATEGIES = {
  'bottom-up':        bottomUp,
  'structural':       structural,
  'outline-first':    outlineFirst,
  'painterly':        painterly,
  'sparse-then-dense': sparseThenDense,
  'bfs-corner':       bfsFromCorner,
  'dfs-corner':       dfsFromCorner,
  'flood-fill':       floodFill,
};

export function reorderPlan(plan, mode = 'bottom-up') {
  const fn = STRATEGIES[mode];
  if (!fn) {
    console.warn(`[buildOrder] unknown mode "${mode}"; using bottom-up`);
    return bottomUp(plan);
  }
  return fn(plan);
}

export const BUILD_ORDER_MODES = Object.keys(STRATEGIES);
