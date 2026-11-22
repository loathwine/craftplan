// moose-fable — prompt:
// a moose...

const TH = 18 * Math.PI / 180, CS = Math.cos(TH), SN = Math.sin(TH), OX = -2, OZ = 3;
const W = p => [p[0] * CS - p[2] * SN + OX, p[1], p[0] * SN + p[2] * CS + OZ];
const K = (x, y, z) => ((x + 64) * 256 + (y + 64)) * 256 + (z + 64);
const inB = (x, y, z) => x >= -22 && x <= 22 && z >= -22 && z <= 22 && y >= -8 && y <= 33;
const H = (x, y, z) => { const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return n - Math.floor(n); };
const V = new Map();
const put = (x, y, z, id) => { if (inB(x, y, z)) V.set(K(x, y, z), [x, y, z, id]); };

// tapered capsule in world coords, optional vertical stretch
function capW(A, B, r1, r2, id, ys, sink) {
  ys = ys || 1;
  const rm = Math.max(r1, r2), ry = rm * Math.max(1, ys);
  const x0 = Math.floor(Math.min(A[0], B[0]) - rm), x1 = Math.ceil(Math.max(A[0], B[0]) + rm);
  const y0 = Math.floor(Math.min(A[1], B[1]) - ry), y1 = Math.ceil(Math.max(A[1], B[1]) + ry);
  const z0 = Math.floor(Math.min(A[2], B[2]) - rm), z1 = Math.ceil(Math.max(A[2], B[2]) + rm);
  const dx = B[0] - A[0], dy = (B[1] - A[1]) / ys, dz = B[2] - A[2];
  const L2 = dx * dx + dy * dy + dz * dz;
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
    const px = x - A[0], py = (y - A[1]) / ys, pz = z - A[2];
    let t = L2 > 1e-9 ? (px * dx + py * dy + pz * dz) / L2 : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    const r = r1 + (r2 - r1) * t;
    const ex = px - dx * t, ey = py - dy * t, ez = pz - dz * t;
    if (ex * ex + ey * ey + ez * ez <= r * r) sink(x, y, z, typeof id === 'function' ? id(x, y, z) : id);
  }
}
const cap = (a, b, r1, r2, id, ys) => capW(W(a), W(b), r1, r2, id, ys, put);

function ray(p, d, maxT) {
  const P = W(p);
  const D = [d[0] * CS - d[2] * SN, d[1], d[0] * SN + d[2] * CS];
  const len = Math.hypot(D[0], D[1], D[2]) || 1;
  for (let t = 0; t <= (maxT || 30); t += 0.2) {
    const x = Math.round(P[0] + D[0] / len * t), y = Math.round(P[1] + D[1] / len * t), z = Math.round(P[2] + D[2] / len * t);
    const v = V.get(K(x, y, z));
    if (v) return v;
  }
  return null;
}
function stamp(p, d, id, only) {
  const v = ray(p, d);
  if (v && (only === undefined || v[3] === only)) { v[3] = id; return v; }
  return null;
}

// ---------------- MOOSE (local coords: forward = -Z, rotated 18° toward east) ----------------
function hoof(foot) {
  const F = W(foot), T = W([foot[0], 0, foot[2] - 1.2]);
  for (let x = Math.floor(F[0]) - 4; x <= Math.ceil(F[0]) + 4; x++) for (let z = Math.floor(F[2]) - 4; z <= Math.ceil(F[2]) + 4; z++) {
    const d1 = (x - F[0]) ** 2 + (z - F[2]) ** 2, d2 = (x - T[0]) ** 2 + (z - T[2]) ** 2;
    if (d1 <= 1.7 * 1.7 || d2 <= 1.25 * 1.25) { put(x, -1, z, BLACK); put(x, 0, z, BLACK); }
  }
}
function leg(top, mid, foot, rTop) {
  cap(top, mid, rTop, 1.5, BROWN);
  cap(mid, foot, 1.4, 1.2, LIGHT_GRAY);
  cap(mid, mid, 1.65, 1.65, BROWN);
  hoof(foot);
}
// walking pose
leg([3.3, 14.5, -6.5], [3.3, 7.8, -6.2], [3.3, 1.2, -6.5], 2.1);
leg([-3.3, 14.5, -6.5], [-3.3, 8, -9.2], [-3.3, 1.2, -11], 2.1);
leg([3.3, 14.5, 8.4], [3.3, 7.8, 9.2], [3.3, 1.2, 6.6], 2.4);
leg([-3.3, 14.5, 8.4], [-3.3, 8, 11.3], [-3.3, 1.2, 12.6], 2.4);
for (const s of [-1, 1]) {
  cap([2.9 * s, 16.5, 7.5], [3.2 * s, 13.2, 8.6], 2.8, 2.4, BROWN);   // haunch
  cap([3.0 * s, 17, -6.5], [3.3 * s, 14, -6.5], 2.6, 2.1, BROWN);     // shoulder muscle
}

const fur = (x, y, z) => (y <= 12 ? OAK_LOG : BROWN);
cap([0, 17.6, -5], [0, 16.6, 8], 5.0, 4.8, fur, 1.15);        // barrel
cap([0, 17, 8], [0, 16.7, 9.2], 4.9, 4.6, fur, 1.12);         // rump
cap([0, 16.2, -8], [0, 16.6, -6], 3.8, 4.6, fur, 1.1);        // brisket
cap([0, 19.4, -6.6], [0, 19.0, -5], 5.3, 5.2, BROWN, 1.25);   // shoulder hump
cap([0, 20.5, -8.5], [0, 21.6, -14], 3.6, 2.9, BROWN, 1.25);  // neck
cap([0, 22.3, -14.5], [0, 21.8, -16.5], 2.9, 2.7, BROWN);     // skull
cap([0, 21.5, -16.5], [0, 19.3, -21], 2.6, 2.25, BROWN);      // long snout
cap([0, 19.3, -21], [0, 18.6, -22.2], 2.3, 2.2, LIGHT_GRAY);  // bulbous muzzle
cap([0, 19, -16.5], [0, 15, -16.2], 1.4, 0.9, OAK_LOG);       // dewlap / bell
cap([0, 26.3, -5.5], [0, 25.3, -13], 1.2, 1.1, OAK_LOG);      // neck mane
cap([0, 26.3, -5.5], [0, 22.9, 3], 1.2, 1.0, OAK_LOG);        // dorsal stripe
cap([0, 18.6, 12.6], [0, 16.6, 14.2], 1.1, 0.8, OAK_LOG);     // tail
for (const s of [-1, 1]) cap([2.3 * s, 23.2, -13.5], [5.2 * s, 24.8, -12.6], 1.15, 0.8, BROWN); // ears

function antler(s, tips) {
  const P0 = [1.5 * s, 24.0, -15.8], P1 = [5.5 * s, 27, -16];
  cap(P0, P1, 1.1, 0.95, SAND);
  const T = tips.map(t => [t[0] * s, t[1], t[2]]);
  const E = T.map(t => [P1[0] + (t[0] - P1[0]) * 0.7, P1[1] + (t[1] - P1[1]) * 0.7, P1[2] + (t[2] - P1[2]) * 0.7]);
  for (let i = 0; i < E.length - 1; i++) {
    for (let j = 0; j <= 5; j++) {
      const u = j / 5;
      const q = [E[i][0] + (E[i + 1][0] - E[i][0]) * u, E[i][1] + (E[i + 1][1] - E[i][1]) * u, E[i][2] + (E[i + 1][2] - E[i][2]) * u];
      cap(P1, q, 0.9, 0.85, SAND);
    }
  }
  for (let i = 0; i < T.length; i++) cap(E[i], T[i], 0.95, 0.7, SAND);
  const B0 = [3.5 * s, 25.7, -16], B1 = [6 * s, 26.2, -19.3];
  cap(B0, B1, 0.95, 0.9, SAND);
  cap(B1, [8.2 * s, 27.6, -21.3], 0.9, 0.7, SAND);
  cap(B1, [4.6 * s, 27.9, -21.4], 0.9, 0.7, SAND);
}
antler(1, [[10.5, 28.3, -20], [13.6, 29.8, -18], [15.5, 31.2, -15.2], [15.2, 32.2, -12], [13, 32.2, -9.6], [10, 31, -8.4]]);
antler(-1, [[10, 28.6, -19.6], [13.8, 29.4, -17.6], [15.2, 31.6, -14.8], [14.6, 32.2, -11.5], [12, 31.6, -9.2], [9.4, 30.2, -8.8]]);

// face details
for (const s of [-1, 1]) {
  stamp([5 * s, 22.8, -18.5], [-5 * s, -0.8, 3], BLACK, BROWN);   // eyes
  stamp([1.1 * s, 18.9, -27], [0, 0, 1], BLACK);                  // nostrils
  stamp([4 * s, 24.2, -18], [0, 0, 1], PINK, BROWN);              // inner ears
}
// pond weed dangling from the mouth
{
  const p = W([0.2, 0, -22]); const mx = Math.round(p[0]), mz = Math.round(p[2]);
  for (let y = 13; y <= 22; y++) {
    if (V.has(K(mx, y, mz))) { put(mx, y - 1, mz, GREEN); put(mx, y - 2, mz, LIME); put(mx, y - 3, mz, GREEN); break; }
  }
}
// cardinal riding on the back
{
  const bt = ray([0.6, 32, 6.5], [0, -1, 0]);
  if (bt) {
    const bx = bt[0], by = bt[1], bz = bt[2];
    put(bx, by + 1, bz, RED); put(bx, by + 1, bz + 1, RED); put(bx, by + 2, bz + 2, BLACK);
    put(bx, by + 2, bz, RED); put(bx, by + 2, bz - 1, ORANGE);
  }
}

// hollow out: keep only surface voxels
const shell = [];
for (const v of V.values()) {
  const x = v[0], y = v[1], z = v[2];
  if (!(V.has(K(x + 1, y, z)) && V.has(K(x - 1, y, z)) && V.has(K(x, y + 1, z)) && V.has(K(x, y - 1, z)) && V.has(K(x, y, z + 1)) && V.has(K(x, y, z - 1)))) shell.push(v);
}
shell.sort((a, b) => a[1] - b[1] || a[2] - b[2] || a[0] - b[0]);

// ---------------- SCENERY (world coords, added in priority order while budget lasts) ----------------
const LIMIT = 3960;
const F = new Map();
for (const v of shell) F.set(K(v[0], v[1], v[2]), v);
let count = shell.length;
const accepted = [];
function accept(g) {
  const m = new Map();
  for (const v of g) {
    if (!inB(v[0], v[1], v[2])) continue;
    const k = K(v[0], v[1], v[2]);
    if (V.has(k) || F.has(k)) continue;
    m.set(k, v);
  }
  if (count + m.size > LIMIT) return false;
  for (const [k, v] of m) { F.set(k, v); accepted.push(v); }
  count += m.size;
  return true;
}
const G = (x, z) => ((x <= -8 && z >= -16 && z <= 4) ? 0 : (x >= 10 && z <= 0) ? 0 : (x <= -3 && z <= -12) ? 0 : -1);

// frosty breath
{
  const g = [];
  for (const s of [-1, 1]) { const p = W([1.1 * s, 18.7, -25.8]); g.push([Math.round(p[0]), Math.round(p[1]), Math.round(p[2]), STEAM]); }
  accept(g);
}
// pond the moose is wading in
const inPond = (x, z) => { const dx = (x - 4) / 5.3, dz = (z + 4) / 5.7; return dx * dx + dz * dz + 0.1 * Math.sin(x * 1.3 + z * 2.1) <= 1; };
accept([[2, -1, -6, LIME], [6, -1, -2, LIME], [5, -1, -7, LIME], [1, -1, -2, LIME], [7, -1, -5, LIME], [5, 0, -7, PINK], [1, 0, -2, WHITE]]);
{
  const pond = [], shore = [], reeds = [];
  for (let x = -4; x <= 12; x++) for (let z = -12; z <= 4; z++) {
    if (inPond(x, z)) { pond.push([x, -1, z, WATER]); continue; }
    let near = false;
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) if (inPond(x + dx, z + dz)) near = true;
    if (!near) continue;
    shore.push([x, -1, z, H(x, 3, z) < 0.22 ? COBBLE : SAND]);
    if (H(x, 7, z) < 0.36 && (x >= 7 || z >= 0 || x <= -1)) {
      const h = 2 + Math.floor(H(x, 9, z) * 2.2);
      for (let y = 0; y < h; y++) reeds.push([x, y, z, GREEN]);
      if (H(x, 11, z) < 0.6) reeds.push([x, h, z, BROWN]);
    }
  }
  accept(pond); accept(shore); accept(reeds);
}
// mossy boulders
function rock(cx, cy, cz, r) {
  const g = [], R = Math.ceil(r) + 1;
  for (let x = cx - R; x <= cx + R; x++) for (let y = cy - 1; y <= cy + R; y++) for (let z = cz - R; z <= cz + R; z++) {
    const dx = x - cx, dy = (y - cy) / 0.8, dz = z - cz;
    const rr = r * (0.88 + 0.24 * H(x, y, z));
    if (dx * dx + dy * dy + dz * dz <= rr * rr) {
      const top = y >= cy + r * 0.8 - 1.3;
      g.push([x, y, z, (top && H(z, x, y) < 0.55) ? GREEN : (H(x, z, y) < 0.4 ? COBBLE : STONE)]);
    }
  }
  return g;
}
accept(rock(-9, 1, -7, 2.5));
accept(rock(8, 0, 8, 2.8));
accept(rock(10, 1, -8, 1.9));
accept(rock(-5, 1, -15, 1.7));
// fallen log
{
  const g = [];
  capW([-11, 1, -1], [-6, 1, 3.5], 1.1, 1.0, OAK_LOG, 1, (x, y, z, id) => g.push([x, y, z, id]));
  g.push([-9, 2, -2, OAK_LOG], [-9, 3, -3, OAK_LOG]);
  accept(g);
}
// mushrooms
{
  const g = [];
  for (const [x, z] of [[-10, 3], [-7, 0], [-5, 5]]) { const b = G(x, z); g.push([x, b, z, WHITE], [x, b + 1, z, WHITE], [x, b + 2, z, RED]); }
  const bx = -8, bz = 6, b = G(bx, bz);
  for (let y = 0; y <= 2; y++) g.push([bx, b + y, bz, WHITE]);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) g.push([bx + dx, b + 3, bz + dz, (dx === 1 && dz === -1) || (dx === -1 && dz === 1) ? WHITE : RED]);
  g.push([bx, b + 4, bz, RED]);
  accept(g);
}
// wildflowers
{
  const g = [];
  const fl = [[-5, -4, YELLOW], [-7, -2, WHITE], [-4, 2, MAGENTA], [-6, 7, YELLOW], [-3, -11, PINK], [0, -14, YELLOW], [6, -13, WHITE],
    [-9, -11, MAGENTA], [3, 5, YELLOW], [5, 9, PINK], [1, 13, WHITE], [-3, 13, YELLOW], [7, 12, MAGENTA], [-10, 9, ORANGE],
    [9, 4, YELLOW], [-6, -12, WHITE], [4, 12, ORANGE], [-11, -3, PINK], [-1, 4, WHITE], [2, -12, MAGENTA], [-5, 10, LIGHT_BLUE], [8, -12, LIGHT_BLUE],
    [-4, -7, ORANGE], [2, 8, LIGHT_BLUE]];
  for (const [x, z, c] of fl) { const b = G(x, z); g.push([x, b, z, GREEN], [x, b + 1, z, c]); }
  accept(g);
}
// backdrop spruces
function spruce(cx, cz, base, radii) {
  const g = [];
  for (let y = 0; y <= radii.length; y++) g.push([cx, base + y, cz, OAK_LOG]);
  radii.forEach((r, i) => {
    const y = base + 3 + i;
    for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
      if (dx * dx + dz * dz > r * r + (r > 0 ? 1 : 0)) continue;
      if (dx === 0 && dz === 0 && i < radii.length - 2) continue;
      g.push([cx + dx, y, cz + dz, H(cx + dx, y, cz + dz) < 0.25 ? LEAVES : GREEN]);
    }
  });
  return g;
}
accept(spruce(-17, 11, 0, [3, 4, 3, 2, 3, 2, 2, 1, 2, 1, 1, 0, 0]));
accept(spruce(16, 12, 0, [3, 3, 2, 3, 2, 1, 2, 1, 1, 0]));
accept(spruce(-17, -12, 0, [3, 2, 3, 2, 1, 2, 1, 1, 0]));
accept(spruce(18, -13, 0, [2, 3, 2, 1, 2, 1, 1, 0]));

// ---------------- EMIT ----------------
// clearing: remove the small trees around the legs (ellipse only, not the whole site)
const inClear = (x, z) => { const dx = (x + 1) / 11, dz = (z + 1) / 16; return dx * dx + dz * dz <= 1; };
for (let x = -12; x <= 10; x++) for (let z = -17; z <= 15; z++) {
  if (!inClear(x, z)) continue;
  for (let y = 1; y <= 7; y++) {
    const k = K(x, y, z);
    if (!F.has(k) && !V.has(k)) block(x, y, z, AIR);
  }
}
// trunk bases sitting at / below y=0
for (const [x, y, z] of [[1, -1, -7], [1, 0, -7], [4, -1, -3], [4, 0, -3], [-1, 0, -10], [3, 0, -10], [-6, 0, -8], [-7, 0, -5], [7, 0, -2],
  [8, 0, -1], [-6, 0, -1], [-6, 0, 1], [0, 0, 1], [8, 0, 3], [-7, 0, 4], [-7, 0, 5], [-2, 0, 7], [-7, 0, 8], [-6, 0, 9], [-5, 0, 13], [1, 0, -13]]) {
  if (!inClear(x, z)) continue;
  const k = K(x, y, z);
  if (!F.has(k) && !V.has(k)) block(x, y, z, AIR);
}
for (const v of accepted) block(v[0], v[1], v[2], v[3]);
for (const v of shell) block(v[0], v[1], v[2], v[3]);