// zeus-opus — prompt:
// Zeus throwing a lightning bolt...

cube(-16, 1, -15, 16, 11, 17, AIR);
cube(-22, 0, -21, -12, 12, -9, AIR);

const M = new Map();
let TAG = '';
function S(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id, TAG]);
}
function H(x, y, z) { const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return s - Math.floor(s); }
function V(id, x, y, z, d) { return typeof id === 'function' ? id(x, y, z, d) : id; }
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) S(x, y, z, V(id, x, y, z));
}
function ball(cx, cy, cz, r, id, shell) {
  const R = Math.ceil(r) + 1, bx = Math.round(cx), by = Math.round(cy), bz = Math.round(cz);
  for (let x = bx - R; x <= bx + R; x++) for (let y = by - R; y <= by + R; y++) for (let z = bz - R; z <= bz + R; z++) {
    const d = Math.hypot(x - cx, y - cy, z - cz);
    if (d <= r && (!shell || d > r - shell)) S(x, y, z, V(id, x, y, z, d));
  }
}
function tube(x1, y1, z1, x2, y2, z2, r, id) {
  const L = Math.hypot(x2 - x1, y2 - y1, z2 - z1), n = Math.max(1, Math.ceil(L * 3)), R = Math.ceil(r);
  for (let i = 0; i <= n; i++) {
    const t = i / n, px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t, pz = z1 + (z2 - z1) * t;
    const bx = Math.round(px), by = Math.round(py), bz = Math.round(pz);
    S(bx, by, bz, V(id, bx, by, bz));
    for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
      const x = bx + dx, y = by + dy, z = bz + dz;
      if (Math.hypot(x - px, y - py, z - pz) <= r) S(x, y, z, V(id, x, y, z));
    }
  }
}
function poly(pts, r, id) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    tube(a[0], a[1], a[2], b[0], b[1], b[2], Array.isArray(r) ? r[i] : r, id);
  }
}
const hairC = (x, y, z) => H(x, y, z) < 0.35 ? LIGHT_GRAY : WHITE;
const fold = (x, y, z) => H(x, y, z) < 0.3 ? MARBLE : WHITE;

// ===== OLYMPUS CRAG =====
TAG = 'low';
for (let x = -12; x <= 12; x++) for (let z = -12; z <= 12; z++) {
  const d = Math.hypot(x, z) + (H(x, 3, z) - 0.5) * 1.8;
  if (d <= 10.5 && d > 7.9) S(x, -1, z, H(x, -1, z) < 0.3 ? COBBLE : STONE);
}
TAG = '';
const RR = [9.5, 7.5, 5.5];
for (let y = 0; y <= 2; y++) for (let x = -11; x <= 11; x++) for (let z = -11; z <= 11; z++) {
  const d = Math.hypot(x, z) + (H(x, y, z) - 0.5) * 1.8, rn = y < 2 ? RR[y + 1] : -9;
  if (d <= RR[y] && d > rn - 1.6) {
    const h = H(z, x, y);
    let id = h < 0.22 ? COBBLE : h < 0.34 ? GRAY : STONE;
    if (y == 2) { const dd = Math.hypot(x, z); if (dd < 3.4) id = MARBLE; else if (dd < 4.2) id = GOLD; }
    S(x, y, z, id);
  }
}
box(-3, 2, -5, -1, 2, -2, MARBLE);
box(2, 2, 3, 4, 2, 5, MARBLE);

// ===== CLOUDS around the summit =====
function cloud(cx, cy, cz, r, top, bot) { ball(cx, cy, cz, r, (x, y, z) => y < cy - 0.5 ? bot : top, 1.2); }
TAG = 'cloud';
[[-9, 2, -3, 2.5], [-10, 3, 2, 2.7], [-8, 2, 7, 2.4], [10, 2, -1, 2.5], [10, 3, 4, 2.6], [7, 2, 8, 2.3],
 [-4, 1, -9, 2.2], [2, 1, -9.5, 2.0], [0, 2, 9, 2.2], [-6, 4, -7, 1.7]]
  .forEach(c => cloud(c[0], c[1], c[2], c[3], WHITE, LIGHT_GRAY));
TAG = '';

// ===== EAGLE of Zeus (front-east, on a rock) =====
box(5, 1, -6, 7, 3, -3, (x, y, z) => H(x, y, z) < 0.35 ? COBBLE : STONE);
S(5, 4, -6, YELLOW); S(7, 4, -6, YELLOW); S(5, 4, -5, YELLOW); S(7, 4, -5, YELLOW);
box(5, 5, -6, 7, 8, -3, BROWN);
box(5, 8, -6, 7, 8, -6, WHITE);
box(5, 9, -6, 7, 10, -4, WHITE);
S(6, 9, -7, YELLOW); S(6, 8, -7, YELLOW);
S(5, 10, -6, BLACK); S(7, 10, -6, BLACK);
box(5, 4, -2, 7, 6, -2, WHITE); box(6, 4, -1, 6, 5, -1, WHITE);
box(4, 6, -5, 4, 8, -3, BROWN);
for (let i = 0; i <= 5; i++) {
  const x = 8 + i, y0 = 7 + Math.round(i * 0.7), zz = -4 + (i > 2 ? 1 : 0);
  for (let k = 0; k < (i > 3 ? 2 : 3); k++) S(x, y0 - k, zz, i >= 4 ? BLACK : BROWN);
}

// ===== ZEUS: LEGS (lunge, left leg forward) =====
tube(-1.5, 11, 0.5, -2, 7, -2.5, 1.3, SAND);
tube(-2, 7, -2.5, -2, 4, -3, 1.1, SAND);
box(-3, 3, -5, -1, 3, -2, BROWN);
box(-3, 4, -5, -1, 4, -4, SAND);
box(-3, 5, -4, -1, 5, -2, GOLD);
tube(1.5, 11, 0.5, 2.5, 7, 1.5, 1.3, SAND);
tube(2.5, 7, 1.5, 3, 4, 3.5, 1.1, SAND);
box(2, 3, 3, 4, 3, 5, BROWN);
box(2, 5, 2, 4, 5, 4, GOLD);

// ===== TOGA SKIRT =====
for (let y = 6; y <= 14; y++) {
  const t = (y - 8) / 6, rx = 4.4 - t * 1.1, rz = 3.4 - t * 0.9, cz = 0.5;
  for (let x = -6; x <= 6; x++) for (let z = -5; z <= 6; z++) {
    const flap = x <= -2 && z >= -1;
    if (y < 8 && !flap) continue;
    const e = (x / rx) ** 2 + ((z - cz) / rz) ** 2, ei = (x / (rx - 1.1)) ** 2 + ((z - cz) / (rz - 1.1)) ** 2;
    if (e <= 1 && ei > 1) {
      const a = Math.atan2(z - cz, x);
      let id = (Math.floor((a + Math.PI) * 7 / Math.PI) % 2) ? MARBLE : WHITE;
      if (y == 14 || y == 6 || (y == 8 && !flap)) id = GOLD;
      else if (y == 9) id = PURPLE;
      S(x, y, z, id);
    }
  }
}

// ===== TORSO: toga over left shoulder, right chest bare =====
for (let y = 15; y <= 22; y++) {
  const t = (y - 15) / 7, rx = 3.0 + t * 0.9, rz = y < 19 ? 2.0 : 2.3, cz = 0.5, cut = 1.2 - (y - 15) * 0.55;
  for (let x = -5; x <= 5; x++) for (let z = -3; z <= 4; z++) {
    const e = (x / rx) ** 2 + ((z - cz) / rz) ** 2, ei = (x / (rx - 1.2)) ** 2 + ((z - cz) / (rz - 1.2)) ** 2;
    if (e <= 1 && (ei > 1 || y == 22)) {
      let id = SAND;
      if (x <= cut - 1.3) id = fold(x, y, z);
      else if (x <= cut) id = PURPLE;
      S(x, y, z, id);
    }
  }
}
ball(2, 19.7, -1, 1.2, SAND);
ball(3.9, 21.5, 0.5, 1.7, SAND);

// ===== CAPE (royal purple, billowing back and west) =====
for (let y = 5; y <= 22; y++) {
  const t = (22 - y) / 17, xl = Math.round(-3.5 - t * 4.5), xr = Math.round(3.5 + t * 1.2);
  for (let x = xl; x <= xr; x++) {
    if (y <= 6 && H(x, y, 7) < 0.4) continue;
    const z = 3 + t * 4.2 + Math.sin(x * 0.7 + y * 0.35) * 0.8;
    const edge = x == xl || x == xr || y == 5 || y == 22 || (y == 6 && H(x, 5, 7) < 0.4);
    const id = edge ? GOLD : PURPLE;
    S(x, y, z, id); S(x, y, z + 0.5, id);
  }
}

// ===== LEFT ARM: pointing at the target =====
tube(-3.9, 21.5, 0.5, -7, 21.2, -2.2, 1.3, SAND);
tube(-7, 21.2, -2.2, -9.6, 21.6, -5, 1.1, SAND);
ball(-3.9, 21.5, 0.5, 1.8, WHITE);
S(-4, 22, -2, GOLD);
for (let i = 0; i <= 10; i++) {
  const t = i / 10, px = -3.9 + (-7 + 3.9) * t, py = 21.5 - 0.3 * t, pz = 0.5 + (-2.2 - 0.5) * t;
  const L = Math.round(5 - t * 3);
  for (let k = 2; k <= L + 1; k++) S(px, py - k, pz, k == L + 1 ? PURPLE : (H(i, k, 0) < 0.3 ? MARBLE : WHITE));
}
tube(-8.2, 21.4, -3.5, -9, 21.5, -4.3, 1.3, GOLD);
ball(-10, 21.6, -5.4, 1.0, SAND);
tube(-10.3, 21.6, -5.8, -12, 21.2, -7.6, 0.5, SAND);
S(-10, 23, -5, SAND);

// ===== NECK + HEAD =====
box(-1, 23, 0, 1, 23, 1, SAND);
box(-2, 24, -2, 2, 29, 2, SAND);
box(-2, 29, -1, 2, 29, 2, hairC);
box(-2, 30, -2, 2, 30, 2, hairC);
box(-1, 31, -1, 1, 31, 2, hairC);
box(-2, 22, 3, 2, 30, 3, hairC);
box(-1, 20, 4, 1, 23, 4, hairC);
box(-3, 25, -1, -3, 29, 2, hairC);
box(3, 25, -1, 3, 29, 2, hairC);
S(-1, 27, -2, NEON_BLUE); S(1, 27, -2, NEON_BLUE);
S(-2, 28, -3, LIGHT_GRAY); S(-1, 28, -3, LIGHT_GRAY); S(1, 28, -3, LIGHT_GRAY); S(2, 28, -3, LIGHT_GRAY);
S(0, 27, -3, SAND); S(0, 26, -3, SAND);
box(-2, 25, -3, 2, 25, -3, WHITE);
box(-2, 24, -3, 2, 24, -3, hairC); S(0, 24, -3, BLACK);
box(-2, 23, -3, 2, 23, -1, hairC);
box(-2, 22, -3, 2, 22, -2, hairC);
box(-1, 21, -3, 1, 21, -2, hairC);
box(-1, 20, -3, 1, 20, -3, hairC);
S(0, 19, -3, WHITE);
box(-3, 24, -2, -3, 26, 0, hairC);
box(3, 24, -2, 3, 26, 0, hairC);
for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++)
  if (Math.abs(x) == 3 || Math.abs(z) == 3) S(x, 29, z, GOLD);
[[-2, -3], [2, -3], [-3, -1], [3, -1], [-3, 1], [3, 1], [0, 3]].forEach(p => S(p[0], 30, p[1], GOLD));

// ===== RIGHT ARM raised, hurling the bolt =====
tube(3.9, 21.5, 0.5, 6.8, 25.2, 1.8, 1.35, SAND);
tube(6.8, 25.2, 1.8, 8.2, 29, 2.5, 1.15, SAND);
tube(5.1, 23, 1, 5.6, 23.7, 1.3, 1.5, GOLD);
tube(7.7, 27.5, 2.3, 8.1, 28.6, 2.5, 1.3, GOLD);
const BOLT = [[10, 33, 3], [12.5, 31, 3], [8.4, 30, 2.6], [12, 27, 2], [10.6, 25, 1.2], [14.5, 21, 0.5]];
poly(BOLT, [0.6, 1.0, 1.0, 1.0, 0.6], YELLOW);
poly(BOLT, 0.3, GLOWSTONE);
ball(8.3, 30, 2.6, 1.35, SAND);
S(10, 33, 3, ELECTRIC);
S(15, 20, 0, ELECTRIC);
S(13, 29, 0, ELECTRIC);

// ===== RUINED TEMPLE (background, south) =====
TAG = 'temple';
for (let x = -12; x <= 12; x++) for (let z = 11; z <= 16; z++) {
  S(x, 1, z, H(x, 1, z) < 0.1 ? COBBLE : MARBLE);
  if (x == -12 || x == 12 || z == 11 || z == 16) S(x, 0, z, MARBLE);
}
for (let x = -12; x <= 12; x++) S(x, 0, 10, H(x, 0, 10) < 0.15 ? COBBLE : MARBLE);
function column(cx, cz, h, cap) {
  box(cx - 1, 2, cz - 1, cx + 1, 2, cz + 1, MARBLE);
  for (let y = 3; y < 3 + h; y++) {
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(o => S(cx + o[0], y, cz + o[1], (y % 2) ? WHITE : MARBLE));
    if (!cap && y == 2 + h) S(cx, y, cz, MARBLE);
  }
  if (cap) {
    box(cx - 1, 3 + h, cz - 1, cx + 1, 3 + h, cz + 1, MARBLE);
    box(cx - 2, 4 + h, cz - 1, cx + 2, 4 + h, cz + 1, MARBLE);
  } else { S(cx + 1, 3 + h, cz, MARBLE); S(cx, 3 + h, cz - 1, WHITE); }
}
column(-11, 12, 11, true); column(-6, 12, 11, true);
column(-11, 16, 11, true); column(-6, 16, 11, true);
column(6, 12, 5, false); column(11, 12, 11, true); column(11, 16, 8, false);
box(-13, 16, 11, -4, 16, 13, MARBLE);
box(-13, 17, 11, -4, 17, 12, (x, y, z) => (z == 11 && x % 2 == 0) ? GOLD : MARBLE);
box(-13, 16, 15, -4, 16, 17, MARBLE);
box(-13, 16, 14, -12, 16, 14, MARBLE);
box(-13, 18, 11, -5, 18, 12, MARBLE);
box(-11, 19, 11, -5, 19, 12, MARBLE);
box(-9, 20, 11, -6, 20, 12, WHITE);
box(-7, 21, 11, -6, 21, 11, MARBLE);
box(9, 16, 11, 13, 16, 12, MARBLE);
tube(1, 2.5, 14, 5, 2.5, 14.6, 1.0, (x, y, z) => (x % 2) ? WHITE : MARBLE);
tube(6.5, 2.5, 15, 9.5, 2.8, 15.6, 1.0, (x, y, z) => (x % 2) ? WHITE : MARBLE);
[[-3, 2, 13], [-2, 2, 15], [8, 2, 13], [9, 2, 11], [3, 2, 12]].forEach(p => S(p[0], p[1], p[2], H(p[0], 0, p[2]) < 0.5 ? COBBLE : MARBLE));
TAG = '';

// braziers flanking the temple
[[-14, 12], [14, 12]].forEach(b => {
  box(b[0], -1, b[1], b[0], 2, b[1], GOLD);
  box(b[0] - 1, 3, b[1] - 1, b[0] + 1, 3, b[1] + 1, GOLD);
  S(b[0], 4, b[1], FIRE); S(b[0] + 1, 4, b[1], FIRE);
});

// ===== LIGHTNING STRIKE (foreground, west) =====
const SX = -17, SZ = -15;
for (let x = SX - 5; x <= SX + 5; x++) for (let z = SZ - 5; z <= SZ + 5; z++) {
  const d = Math.hypot(x - SX, z - SZ) + (H(x, 9, z) - 0.5) * 1.2;
  if (d <= 2.8) S(x, -1, z, H(x, -1, z) < 0.3 ? BLACK : OBSIDIAN);
  else if (d <= 4.6) {
    const h = H(x, 0, z);
    S(x, 0, z, h < 0.4 ? COBBLE : h < 0.7 ? GRAY : BLACK);
    if (H(z, 1, x) < 0.3) S(x, 1, z, h < 0.5 ? COBBLE : OBSIDIAN);
  }
}
S(SX + 1, -1, SZ, LAVA); S(SX - 1, -1, SZ + 1, LAVA); S(SX, -1, SZ - 1, LAVA);
[[2, -1], [-2, 1], [1, 2], [-1, -2]].forEach(o => S(SX + o[0], 0, SZ + o[1], FIRE));
box(-21, 0, -12, -21, 2, -12, (x, y, z) => y == 2 ? BLACK : BROWN);
S(-21, 3, -12, FIRE);
const STRIKE = [[-17, 15, -14], [-19, 10.5, -14.5], [-15.8, 7, -15], [-18.2, 3.5, -15], [-17, 0, -15]];
poly(STRIKE, 0.6, YELLOW);
STRIKE.forEach(p => S(p[0], p[1], p[2], GLOWSTONE));
S(-16, 0, -14, ELECTRIC);
S(-20, 11, -14, ELECTRIC);
S(-15, 14, -14, ELECTRIC);
TAG = 'cloud';
[[-17.5, 17, -14, 2.5], [-20, 16.5, -13, 2], [-14.5, 16.5, -13.5, 2], [-17, 19, -13, 2], [-19.5, 18.5, -15.5, 1.6]]
  .forEach(c => cloud(c[0], c[1], c[2], c[3], GRAY, BLACK));
TAG = '';

// ===== FLUSH with budget guard =====
let arr = [...M.values()];
const LIMIT = 3980;
let cnt = arr.filter(a => a[3] !== AIR).length;
['low', 'cloud', 'temple'].forEach(tag => {
  if (cnt <= LIMIT) return;
  arr = arr.filter((a, i) => {
    if (cnt > LIMIT && a[4] === tag && i % 2 === 0) { cnt--; return false; }
    return true;
  });
});
arr.forEach(a => block(a[0], a[1], a[2], a[3]));