// reindeer-sonnet55 — prompt:
// a reindeer with giant antlers...

const G = new Map();
const BG = new Map();
let T = G;
const key = (x, y, z) => x + ',' + y + ',' + z;
const hsh = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  T.set(key(x, y, z), id);
}
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function ball(cx, cy, cz, r, id, tag) {
  const R = Math.ceil(r);
  put(cx, cy, cz, id);
  if (tag) tag.add(key(Math.round(cx), Math.round(cy), Math.round(cz)));
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
    const x = Math.round(cx) + dx, y = Math.round(cy) + dy, z = Math.round(cz) + dz;
    const ex = x - cx, ey = y - cy, ez = z - cz;
    if (ex * ex + ey * ey + ez * ez <= r * r + 0.01) {
      put(x, y, z, id);
      if (tag) tag.add(key(x, y, z));
    }
  }
}
function cr(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [0, 1, 2].map(i => 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
}
function tube(pts, r0, r1, colorFn, tag) {
  const P = [pts[0], ...pts, pts[pts.length - 1]];
  const samples = [];
  for (let i = 1; i < P.length - 2; i++) {
    const d = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1], P[i + 1][2] - P[i][2]);
    const n = Math.max(2, Math.ceil(d * 2));
    for (let k = 0; k < n; k++) samples.push(cr(P[i - 1], P[i], P[i + 1], P[i + 2], k / n));
  }
  samples.push(pts[pts.length - 1]);
  samples.forEach((p, i) => {
    const s = i / (samples.length - 1);
    ball(p[0], p[1], p[2], r0 + (r1 - r0) * s, colorFn(s), tag);
  });
  return pts[pts.length - 1];
}

// ---------- clear tree clutter around the footprint ----------
cube(-12, 0, -12, 12, 9, 17, AIR);

// ---------- snowy ground (low priority) ----------
T = BG;
for (let x = -11; x <= 11; x++) for (let z = -12; z <= 13; z++) {
  const d = Math.hypot(x / 11, (z - 0.5) / 12.5);
  if (d <= 1 + (hsh(x, 0, z) - 0.5) * 0.15) {
    put(x, -1, z, SNOW);
    if (d > 0.5 && hsh(x, 1, z) < 0.22) put(x, 0, z, SNOW);
    if (d > 0.8 && hsh(x, 2, z) < 0.12) put(x, 1, z, SNOW);
  }
}
T = G;

// ---------- body ----------
const torso = new Set(), neck = new Set();
function tbox(x1, y1, z1, x2, y2, z2, id) {
  box(x1, y1, z1, x2, y2, z2, id);
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) torso.add(key(x, y, z));
}
tbox(-3, 9, 3, 3, 14, 13, BROWN);
tbox(-2, 15, 4, 2, 15, 12, BROWN);
tbox(-2, 8, 4, 2, 8, 12, WHITE);
tbox(-2, 9, 2, 2, 13, 2, WHITE);
tbox(-2, 10, 14, 2, 13, 14, BROWN);
tbox(-1, 15, 3, 1, 16, 5, BROWN);
torso.forEach(k => {
  const [x, y, z] = k.split(',').map(Number);
  if (G.get(k) !== BROWN) return;
  if (Math.abs(x) === 3 && y <= 10 && hsh(x, y, z) < 0.45) put(x, y, z, SAND);
  else if (Math.abs(x) === 3 && hsh(x * 3, y, z) < 0.12) put(x, y, z, GRAY);
  else if (y >= 15 && hsh(x, y * 2, z) < 0.25) put(x, y, z, BLACK);
});
// white tail
box(-1, 13, 15, 1, 15, 15, WHITE); put(0, 16, 15, WHITE); box(-1, 14, 16, 0, 15, 16, WHITE);

// hind legs
for (const s of [-1, 1]) {
  const x1 = s * 2, x2 = s * 3;
  box(s * 2, 5, 11, s * 4, 9, 14, BROWN);
  box(x1, 3, 12, x2, 4, 13, BROWN);
  box(x1, 1, 12, x2, 2, 13, SAND);
  box(x1, 0, 12, x2, 0, 13, BLACK);
  box(s * 4, 6, 11, s * 4, 7, 14, SAND);
}
// front left: planted
box(-3, 2, 4, -2, 8, 5, BROWN);
box(-3, 1, 4, -2, 3, 5, SAND);
box(-4, 0, 3, -2, 0, 5, BLACK);
// front right: raised, prancing
box(2, 5, 4, 3, 8, 5, BROWN);
box(2, 5, 2, 3, 6, 5, BROWN);
box(2, 3, 1, 3, 5, 2, SAND);
box(2, 2, 0, 3, 2, 2, BLACK);

// ---------- neck ----------
tube([[0, 13, 5], [0, 15, 3], [0, 17.5, 1], [0, 19.5, -0.5]], 2.9, 2.1, s => BROWN, neck);
neck.forEach(k => {
  const [x, y, z] = k.split(',').map(Number);
  const cz = 5 - (y - 13) * 0.85;
  if (z < cz - 0.8 && y >= 12 && y <= 19) put(x, y, z, hsh(x, y, z) < 0.8 ? WHITE : LIGHT_GRAY);
  if (y === 16) put(x, y, z, RED);
});
put(0, 15, 0, GOLD); put(0, 14, 1, GOLD);

// ---------- harness / blanket ----------
torso.forEach(k => {
  const [x, y, z] = k.split(',').map(Number);
  if (y >= 10 && z >= 7 && z <= 9) put(x, y, z, RED);
  else if (y >= 10 && (z === 6 || z === 10)) put(x, y, z, GOLD);
});
for (const s of [-1, 1]) { put(s * 4, 10, 8, GOLD); put(s * 4, 9, 8, GOLD); put(s * 4, 11, 8, RED); }
put(0, 16, 8, GOLD);

// ---------- head ----------
box(-2, 18, -3, 2, 22, 0, BROWN);
box(-3, 19, -2, -3, 21, 0, BROWN); box(3, 19, -2, 3, 21, 0, BROWN);
box(-1, 18, -7, 1, 20, -4, BROWN);
box(-1, 18, -7, 1, 20, -6, WHITE);
box(-1, 19, -8, 1, 20, -8, BLACK);
box(-2, 18, -3, 2, 18, -3, SAND);
for (const s of [-1, 1]) {
  put(s * 2, 21, -3, BLACK); put(s * 2, 20, -3, BLACK);
  put(s * 2, 22, -3, BLACK);
  put(s * 3, 21, -2, BLACK);
  box(s * 3, 22, -2, s * 4, 22, -1, BROWN);
  box(s * 4, 23, -2, s * 5, 23, -1, BROWN);
  put(s * 5, 24, -2, BROWN); put(s * 5, 24, -1, BROWN);
  put(s * 4, 23, -2, PINK); put(s * 5, 23, -2, PINK);
}
box(-1, 23, -1, 1, 23, 0, WHITE);

// ---------- giant antlers ----------
const antlerCells = new Set();
const tips = [];
const ac = s => (s < 0.22 ? PLANKS : (s < 0.82 ? SAND : WHITE));
function A(sg, pts, r0, r1, bulb) {
  const P = pts.map(p => [p[0] * sg, p[1], p[2]]);
  const end = tube(P, r0, r1, ac, antlerCells);
  if (bulb) tips.push(end);
}
function antler(sg, v) {
  A(sg, [[2, 23, 1], [4, 24, 1.5], [7, 25, 2], [10, 25.5, 3], [13, 26, 3], [16, 26.5, 2], [19, 27.5, 1], [21, 29, -1]], 2.1, 0.9, false);
  A(sg, [[7, 25, 2], [7.5, 28, 1.5], [7, 31, 0.5], [6, 33, 0]], 1.5, 0.6, true);
  A(sg, [[7.5, 28, 1.5], [5, 30, 1], [3, 32.5, 0.5]], 1.0, 0.5, false);
  A(sg, [[10, 25.5, 3], [11, 28, 3], [12, 31, 2.5], [12 + v, 33, 2]], 1.4, 0.6, false);
  A(sg, [[13, 26, 3], [14, 29, 3.5], [15, 32, 3], [15, 33, 3]], 1.3, 0.6, true);
  A(sg, [[16, 26.5, 2], [17, 29, 1.5], [18, 32, 0.5], [18, 33, 0]], 1.2, 0.5, false);
  A(sg, [[19, 27.5, 1], [20.5, 30, 0], [21, 32, -1]], 1.0, 0.5, true);
  // brow + bez tines curling forward over the face
  A(sg, [[3, 24, -1], [4, 25, -4], [4.5, 28, -7], [4, 31, -8.5]], 1.6, 0.6, true);
  A(sg, [[4.5, 28, -7], [7, 30, -7], [9, 32, -6.5]], 1.0, 0.5, false);
  A(sg, [[5, 24.5, 0.5], [7, 26, -3], [9, 28.5, -5], [10, 31.5, -5.5]], 1.2, 0.6, false);
  // rear-sweeping tines for depth
  A(sg, [[10, 25.5, 3], [11, 27, 7], [12, 29.5, 10]], 1.1, 0.5, false);
  A(sg, [[16, 26.5, 2], [17, 27, 5], [18, 29, 7]], 1.0, 0.5, false);
}
antler(-1, 0);
antler(1, 1);
A(1, [[18, 32, 0.5], [20, 33, -1]], 0.8, 0.5, false);
// snow dusting on upward-facing antler cells
antlerCells.forEach(k => {
  const [x, y, z] = k.split(',').map(Number);
  if (!antlerCells.has(key(x, y + 1, z)) && hsh(x, y, z * 1.3) < 0.28 && G.get(k) !== WHITE) put(x, y, z, SNOW);
});
// a few festive glowing bulbs on tine tips
tips.forEach(p => put(p[0], Math.min(p[1], 33), p[2], GLOWSTONE));

// ---------- background pines (low priority) ----------
T = BG;
function pine(cx, cz, h) {
  for (let y = -1; y < 3; y++) put(cx, y, cz, OAK_LOG);
  for (let y = 2; y <= h; y++) {
    const r = Math.max(0, Math.round((h - y) * 0.27 + 0.3));
    const lay = ((y - 2) % 2 === 0) ? r + 1 : r;
    for (let dx = -lay; dx <= lay; dx++) for (let dz = -lay; dz <= lay; dz++)
      if (dx * dx + dz * dz <= lay * lay + 0.5) put(cx + dx, y, cz + dz, LEAVES);
    if ((y - 2) % 2 === 0 && lay > 1) {
      for (let dx = -lay + 1; dx <= lay - 1; dx++) for (let dz = -lay + 1; dz <= lay - 1; dz++)
        if (dx * dx + dz * dz <= (lay - 1) * (lay - 1) + 0.5 && hsh(cx + dx, y, cz + dz) < 0.5) put(cx + dx, y + 1, cz + dz, SNOW);
    }
  }
  put(cx, h + 1, cz, SNOW);
}
pine(-14, 17, 12); pine(-8, 19, 9); pine(12, 18, 11); pine(16, 12, 8); pine(-18, 8, 10);
T = G;

// ---------- emit (subject first, background fills remaining budget) ----------
let count = 0;
G.forEach((id, k) => {
  const [x, y, z] = k.split(',').map(Number);
  block(x, y, z, id);
  count++;
});
BG.forEach((id, k) => {
  if (G.has(k) || count >= 3980) return;
  const [x, y, z] = k.split(',').map(Number);
  block(x, y, z, id);
  count++;
});