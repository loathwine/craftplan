// clockwork-dragon-opus — prompt:
// a clockwork dragon made of brass gears...

const BUF = new Map();
let COUNT = 0;
const MAXB = 3990;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (!BUF.has(k)) { if (COUNT >= MAXB) return; COUNT++; }
  BUF.set(k, id);
}
function hsh(x, y, z) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function tube(a, b, r, id) {
  const L = dist(a, b);
  const n = Math.max(1, Math.ceil(L * 2));
  const R = Math.ceil(r);
  for (let s = 0; s <= n; s++) {
    const p = lerp3(a, b, s / n);
    if (r < 0.6) { put(p[0], p[1], p[2], id); continue; }
    const X0 = Math.round(p[0]), Y0 = Math.round(p[1]), Z0 = Math.round(p[2]);
    for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
      const X = X0 + dx, Y = Y0 + dy, Z = Z0 + dz;
      if ((X - p[0]) ** 2 + (Y - p[1]) ** 2 + (Z - p[2]) ** 2 <= r * r) put(X, Y, Z, id);
    }
  }
}

function gear(cx, cy, cz, r, axis, rim, tooth, spoke, hub, o) {
  o = o || {};
  const nT = Math.max(6, Math.round(r * 2.2));
  const nS = r >= 3 ? 6 : (r >= 2.5 ? 4 : 0);
  const rot = o.rot || 0;
  const R = Math.ceil(r + 1.6);
  for (let u = -R; u <= R; u++) for (let v = -R; v <= R; v++) {
    const d = Math.hypot(u, v);
    let id = null;
    const a = Math.atan2(v, u) - rot;
    if (d <= 0.6 || (d <= 1.25 && r >= 2.5)) id = hub;
    else if (d >= r - 0.7 && d <= r + 0.5) id = rim;
    else if (d > r + 0.5 && d <= r + 1.5) {
      const f = ((((a / (2 * Math.PI)) * nT) % 1) + 1) % 1;
      if (f < 0.5) id = tooth;
    } else if (d < r - 0.7) {
      if (o.inner && d >= o.inner[0] && d <= o.inner[1]) id = o.inner[2];
      for (let s = 0; s < nS && id == null; s++) {
        const sa = s * 2 * Math.PI / nS + rot;
        const along = u * Math.cos(sa) + v * Math.sin(sa);
        const perp = Math.abs(-u * Math.sin(sa) + v * Math.cos(sa));
        if (along > 0 && perp < 0.65) id = spoke;
      }
      if (id == null && o.solid) id = o.solid;
      if (id == null && nS === 0) id = spoke;
    }
    if (id == null) continue;
    if (axis === 'x') put(cx, cy + v, cz + u, id);
    else if (axis === 'y') put(cx + u, cy, cz + v, id);
    else put(cx + u, cy + v, cz, id);
  }
}

function ring(cx, cy, cz, r, axis, id) {
  const R = Math.ceil(r + 1);
  for (let u = -R; u <= R; u++) for (let v = -R; v <= R; v++) {
    const d = Math.hypot(u, v);
    if (d < r - 0.5 || d > r + 0.5) continue;
    if (axis === 'x') put(cx, cy + v, cz + u, id);
    else if (axis === 'y') put(cx + u, cy, cz + v, id);
    else put(cx + u, cy + v, cz, id);
  }
}

// ---------- clear trees from the build site
cube(-18, 1, -22, 18, 8, 14, AIR);
cube(-6, 1, 14, 16, 9, 22, AIR);

// ---------- body as a hollow union of spheres
const U = new Map();
function uAdd(x, y, z, info) {
  const k = x + ',' + y + ',' + z;
  if (!U.has(k)) U.set(k, Object.assign({ x, y, z }, info));
}
// head cranium
(function () {
  const cx = 2, cy = 22, cz = -12, rx = 2.8, ry = 2.4, rz = 3;
  for (let x = -1; x <= 5; x++) for (let y = 19; y <= 25; y++) for (let z = -15; z <= -9; z++) {
    if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1)
      uAdd(x, y, z, { px: cx, py: cy, pz: cz, r: 2.6, seg: -1, part: 'head' });
  }
  for (let z = -18; z <= -13; z++) {
    const top = z <= -17 ? 22 : 23;
    for (let x = 1; x <= 3; x++) for (let y = 21; y <= top; y++)
      uAdd(x, y, z, { px: 2, py: 22, pz: z, r: 1.5, seg: -1, part: 'snout' });
  }
})();

const spine = [
  [2, 20.5, -10.5, 2.3], [1.5, 18.5, -9.5, 2.5], [1, 16.5, -8.3, 2.8], [0.5, 14, -6.5, 3.4],
  [0, 12, -3.5, 4.5], [0, 11.5, 0, 5], [0, 11.5, 4, 5], [0, 11, 8, 4.6], [0, 10, 11, 3.8],
  [0, 8.5, 14, 3], [1, 7, 17, 2.4], [3, 6, 19.3, 2], [6, 5.5, 20.3, 1.6], [9, 5.8, 19.5, 1.3],
  [11, 6.8, 17.3, 1.1], [11.6, 8, 15, 1]
];
const SP = [];
for (let i = 0; i < spine.length - 1; i++) {
  const a = spine[i], b = spine[i + 1];
  const n = Math.max(2, Math.ceil(dist(a, b) * 2));
  for (let s = 0; s < n; s++) {
    const t = s / n;
    SP.push({ x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, z: a[2] + (b[2] - a[2]) * t, r: a[3] + (b[3] - a[3]) * t, seg: i + t });
  }
}
{ const l = spine[spine.length - 1]; SP.push({ x: l[0], y: l[1], z: l[2], r: l[3], seg: spine.length - 1 }); }
for (const p of SP) {
  const R = Math.ceil(p.r) + 1;
  const X0 = Math.round(p.x), Y0 = Math.round(p.y), Z0 = Math.round(p.z);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
    const X = X0 + dx, Y = Y0 + dy, Z = Z0 + dz;
    if ((X - p.x) ** 2 + (Y - p.y) ** 2 + (Z - p.z) ** 2 <= p.r * p.r)
      uAdd(X, Y, Z, { px: p.x, py: p.y, pz: p.z, r: p.r, seg: p.seg, part: 'body' });
  }
}
function matFor(c) {
  const h = hsh(c.x, c.y, c.z);
  if (c.part === 'head') return (h % 10 === 0) ? COPPER : GOLD;
  if (c.part === 'snout') return (c.x === 2 && c.y >= 22) ? IRON : ((c.z % 2 === 0) ? COPPER : GOLD);
  const ny = (c.y - c.py) / c.r, nz = (c.z - c.pz) / c.r;
  const neck = c.seg < 4;
  const under = neck ? (-0.45 * ny - 0.9 * nz > 0.5) : (ny < -0.4);
  const key = neck ? c.y : c.z;
  const m4 = ((key % 4) + 4) % 4, m2 = ((key % 2) + 2) % 2;
  if (under) return m2 === 0 ? COPPER : BROWN;
  if (ny > 0.85) return IRON;
  if (h % 14 === 0) return IRON;
  if (m4 === 0) return COPPER;
  return GOLD;
}
const N6 = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
for (const c of U.values()) {
  let surf = false;
  for (const d of N6) if (!U.has((c.x + d[0]) + ',' + (c.y + d[1]) + ',' + (c.z + d[2]))) { surf = true; break; }
  if (surf) put(c.x, c.y, c.z, matFor(c));
}
function putM(x, y, z, id) {
  const k = Math.round(x) + ',' + Math.round(y) + ',' + Math.round(z);
  if (U.has(k)) return;
  put(x, y, z, id);
}

// ---------- head details
put(0, 23, -13, NEON_RED); put(4, 23, -13, NEON_RED);
put(0, 24, -14, IRON); put(1, 24, -14, IRON); put(3, 24, -14, IRON); put(4, 24, -14, IRON);
put(1, 22, -18, BLACK); put(3, 22, -18, BLACK);
put(1, 22, -19, STEAM); put(3, 22, -19, STEAM);
// open lower jaw
tube([2, 19.3, -11.5], [2, 17.2, -17], 1.0, COPPER);
const jawTop = z => 19.3 + ((z + 11.5) / -5.5) * -2.1 + 1.2;
for (const z of [-14, -16]) { put(1, Math.round(jawTop(z)) + 1, z, IRON); put(3, Math.round(jawTop(z)) + 1, z, IRON); }
put(2, 18, -18, IRON);
for (const z of [-14, -16, -18]) { put(1, 20, z, IRON); put(3, 20, z, IRON); }
put(1, 19, -18, IRON); put(3, 19, -18, IRON);
// furnace glow in the throat
put(1, 20, -13, LAVA); put(2, 20, -13, LAVA); put(3, 20, -13, LAVA); put(2, 20, -12, LAVA);
// horns
for (const sx of [1, -1]) {
  const mx = p => [2 + (p[0] - 2) * sx, p[1], p[2]];
  tube(mx([0.5, 24, -11]), mx([-1, 26, -8]), 0.6, IRON);
  tube(mx([-1, 26, -8]), mx([-1.5, 28.5, -5]), 0.4, IRON);
  put(...mx([-1.5, 29, -4.5]), GOLD);
  tube(mx([0, 23, -10]), mx([-2, 23.5, -7]), 0.4, GOLD);
}
gear(-1, 22, -10, 1.5, 'x', COPPER, COPPER, IRON, GOLD);
gear(5, 22, -10, 1.5, 'x', COPPER, COPPER, IRON, GOLD);

// ---------- spine spikes
SP.forEach((p, idx) => {
  if (idx % 4 !== 0) return;
  if (p.seg > 0.3 && p.seg < 3.9) tube([p.x, p.y + p.r - 0.4, p.z], [p.x, p.y + p.r + 1.6, p.z + 1.2], 0.4, IRON);
  else if (p.seg >= 8.6 && p.seg < 14.5) tube([p.x, p.y + p.r - 0.4, p.z], [p.x, p.y + p.r + 1.1, p.z + 0.8], 0.4, idx % 8 === 0 ? GOLD : IRON);
});

// dorsal gears
gear(0, 16, -1, 2, 'x', IRON, IRON, COPPER, GOLD, { rot: 0.2 });
gear(0, 13, 11, 2, 'x', IRON, IRON, COPPER, GOLD, { rot: 0.5 });

// wind-up key on the back
for (let x = -1; x <= 1; x++) for (let z = 4; z <= 6; z++) put(x, 17, z, COPPER);
tube([0, 16, 5], [0, 19.5, 5], 0.4, IRON);
ring(-2, 21, 5, 1.6, 'z', GOLD); ring(2, 21, 5, 1.6, 'z', GOLD);
for (let y = 20; y <= 22; y++) put(0, y, 5, GOLD);
put(-1, 21, 5, GOLD); put(1, 21, 5, GOLD);

// exhaust stacks
for (const sx of [-2, 2]) {
  tube([sx, 12, 12], [sx, 15, 12], 0.4, IRON);
  put(sx, 15, 12, GOLD);
  put(sx, 16, 12, STEAM);
}

// glowing heart gear on the chest
tube([0, 12, -10], [0, 12, -5], 0.4, IRON);
gear(0, 12, -10, 2.5, 'z', GOLD, GOLD, IRON, GLOWSTONE, { rot: 0.3 });

// ---------- flank gears
for (const sx of [-1, 1]) {
  tube([0, 12, 3], [5 * sx, 12, 3], 0.4, IRON);
  gear(5 * sx, 12, 3, 4, 'x', GOLD, GOLD, COPPER, IRON, { rot: sx > 0 ? 0 : 0.35 });
  tube([0, 10, 10], [4 * sx, 10, 10], 0.4, IRON);
  gear(4 * sx, 10, 10, 2.5, 'x', COPPER, COPPER, IRON, GOLD, { rot: 0.4 });
  gear(4 * sx, 15, -4, 2, 'x', COPPER, COPPER, IRON, GOLD);
}

// ---------- legs
for (const sx of [-1, 1]) {
  // front
  const P0 = [4 * sx, 9, -2], P1 = [6 * sx, 6, 1], P2 = [6 * sx, 2, -2];
  tube(P0, P1, 1.3, GOLD);
  tube(P1, P2, 0.9, IRON);
  gear(8 * sx, 6, 1, 1.5, 'x', COPPER, COPPER, IRON, GOLD);
  for (let x = 5; x <= 7; x++) {
    for (let z = -4; z <= -1; z++) put(sx * x, 1, z, COPPER);
    put(sx * x, 1, -5, IRON);
  }
  put(sx * 6, 2, -3, GOLD);
  tube([5 * sx, 11, -4], [7 * sx, 3, -3], 0.4, IRON);
  // hind
  const H = [4 * sx, 9.5, 9], K = [7 * sx, 5, 6], Hk = [7 * sx, 2.5, 10], A = [6 * sx, 1.5, 8];
  tube(H, K, 1.6, GOLD);
  tube(K, Hk, 1.0, IRON);
  tube(Hk, A, 0.8, IRON);
  gear(9 * sx, 5, 6, 1.5, 'x', COPPER, COPPER, IRON, GOLD);
  put(10 * sx, 5, 6, STEAM);
  for (let x = 5; x <= 7; x++) {
    for (let z = 4; z <= 8; z++) put(sx * x, 1, z, COPPER);
    put(sx * x, 1, 3, IRON);
  }
  tube([5 * sx, 12, 12], [7.5 * sx, 3, 11], 0.4, IRON);
}

// ---------- wings
function tri(A, B, C, id) {
  const L = Math.max(dist(A, B), dist(A, C), dist(B, C));
  const n = Math.ceil(L * 2);
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
    const s = i / n, t = j / n;
    putM(A[0] + (B[0] - A[0]) * s + (C[0] - A[0]) * t,
         A[1] + (B[1] - A[1]) * s + (C[1] - A[1]) * t,
         A[2] + (B[2] - A[2]) * s + (C[2] - A[2]) * t, id);
  }
}
function wing(sx) {
  const m = p => [p[0] * sx, p[1], p[2]];
  const Sh = m([3, 15, -1]), E = m([9, 19, 1]), W = m([13, 25, 2]);
  const T = [m([16, 32, 4]), m([21, 28.5, 5]), m([22, 21, 7]), m([19, 14.5, 9])];
  const B = m([4.5, 12, 10]);
  tri(Sh, E, B, COPPER);
  tri(E, W, B, COPPER);
  tri(W, T[3], B, BROWN);
  const pc = [COPPER, BROWN, COPPER];
  for (let i = 0; i < 3; i++) tri(W, T[i], T[i + 1], pc[i]);
  for (const f of [0.5, 0.8]) {
    for (let i = 0; i < 3; i++) tube(lerp3(W, T[i], f), lerp3(W, T[i + 1], f), 0.4, IRON);
    tube(lerp3(W, T[3], f), lerp3(W, B, f), 0.4, IRON);
  }
  tube(Sh, E, 0.9, IRON);
  tube(E, W, 0.75, GOLD);
  for (let i = 0; i < 4; i++) {
    tube(W, T[i], 0.4, GOLD);
    const d = dist(W, T[i]);
    const dir = [(T[i][0] - W[0]) / d, (T[i][1] - W[1]) / d, (T[i][2] - W[2]) / d];
    tube(T[i], [T[i][0] + dir[0] * 1.6, T[i][1] + dir[1] * 1.6, T[i][2] + dir[2] * 1.6], 0.4, IRON);
  }
  tube(W, [W[0] + sx, W[1] + 2, W[2] - 2.5], 0.4, IRON);
  gear(E[0], E[1], E[2], 2, 'z', COPPER, COPPER, IRON, GOLD);
  gear(W[0], W[1], W[2], 2.5, 'z', GOLD, GOLD, IRON, COPPER, { rot: 0.2 });
}
wing(1);
wing(-1);

// ---------- tail spade
tri([11.6, 8.5, 15], [9.5, 11, 13], [14, 11, 13.5], IRON);
tri([9.5, 11, 13], [14, 11, 13.5], [12, 13.5, 11.5], IRON);
tube([9.5, 11, 13], [12, 13.5, 11.5], 0.4, GOLD);
tube([14, 11, 13.5], [12, 13.5, 11.5], 0.4, GOLD);

// ---------- clockwork plinth
gear(0, 0, 2, 10, 'y', GOLD, GOLD, IRON, COPPER, { solid: OBSIDIAN, inner: [3.6, 4.4, GOLD], rot: 0.1 });
for (let u = -11; u <= 11; u++) for (let v = -11; v <= 11; v++) {
  const d = Math.hypot(u, v);
  if (d >= 9.5 && d <= 10.5) { put(u, -1, 2 + v, COBBLE); put(u, -2, 2 + v, STONE); }
}

// ---------- foreground loose gears
gear(-17, 3, -8, 3, 'z', GOLD, GOLD, IRON, COPPER, { rot: 0.4 });
gear(15, 3, -6, 3, 'z', COPPER, COPPER, IRON, GOLD, { rot: 0.1 });
gear(10, 1, -11, 2, 'y', IRON, IRON, GOLD, GOLD);
gear(-8, 1, -18, 1.5, 'y', GOLD, GOLD, COPPER, IRON);

// ---------- little tinkerer with a wrench, for scale
for (let x = -14; x <= -10; x++) for (let z = -16; z <= -12; z++) put(x, 0, z, GRASS);
put(-13, 1, -14, BLACK); put(-11, 1, -14, BLACK);
put(-13, 2, -14, BLUE); put(-11, 2, -14, BLUE);
for (let x = -13; x <= -11; x++) for (let y = 3; y <= 5; y++) put(x, y, -14, BLUE);
put(-12, 3, -15, BROWN); put(-12, 4, -15, BROWN); put(-13, 3, -15, BROWN); put(-11, 3, -15, BROWN);
put(-14, 3, -14, PINK); put(-14, 4, -14, BLUE); put(-14, 5, -14, BLUE);
put(-10, 5, -14, BLUE); put(-10, 6, -14, BLUE); put(-10, 7, -14, PINK);
put(-10, 8, -14, IRON); put(-10, 9, -14, IRON); put(-11, 9, -14, IRON); put(-9, 9, -14, IRON);
for (let x = -13; x <= -11; x++) for (let y = 6; y <= 8; y++) for (let z = -15; z <= -13; z++) put(x, y, z, PINK);
for (let x = -13; x <= -11; x++) for (let z = -15; z <= -13; z++) put(x, 9, z, BROWN);
put(-13, 7, -15, CYAN); put(-11, 7, -15, CYAN); put(-12, 7, -15, GOLD);
put(-12, 6, -15, BROWN);
// toolbox
put(-9, 1, -16, RED); put(-8, 1, -16, RED); put(-9, 1, -15, RED); put(-8, 1, -15, RED);
put(-9, 2, -16, IRON); put(-8, 2, -16, IRON);

// ---------- flush
for (const [k, id] of BUF) {
  const p = k.split(',');
  block(+p[0], +p[1], +p[2], id);
}