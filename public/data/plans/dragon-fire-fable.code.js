// dragon-fire-fable — prompt:
// a dragon breathing fire...

const M = new Map();
const R = Math.round;
function put(x, y, z, id) {
  x = R(x); y = R(y); z = R(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  if (typeof id === 'function') id = id(x, y, z);
  M.set(x + ',' + y + ',' + z, id);
}
function h(x, y, z) { const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return n - Math.floor(n); }
function dist(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); }
function ell(cx, cy, cz, rx, ry, rz, id, opt) {
  opt = opt || {};
  const p = opt.p || 2, shell = opt.shell, ymin = opt.ymin == null ? -8 : opt.ymin;
  const ins = (x, y, z, s) => Math.pow(Math.abs(x - cx) / (rx - s), p) + Math.pow(Math.abs(y - cy) / (ry - s), p) + Math.pow(Math.abs(z - cz) / (rz - s), p) <= 1;
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.max(ymin, Math.floor(cy - ry)); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        if (!ins(x, y, z, 0)) continue;
        if (shell && rx > 1.5 && ry > 1.5 && rz > 1.5 && ins(x, y, z, 1)) continue;
        put(x, y, z, id);
      }
}
function ball(cx, cy, cz, r, id, opt) { ell(cx, cy, cz, r, r, r, id, opt); }
function tube(a, b, ra, rb, id) {
  const n = Math.max(1, Math.ceil(dist(a, b) * 1.5));
  for (let i = 0; i <= n; i++) { const t = i / n; ball(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, ra + (rb - ra) * t, id); }
}
function bone(a, b, id) { tube(a, b, 0.7, 0.7, id); }
function tri(a, b, c, id) {
  const n = Math.ceil(Math.max(dist(a, b), dist(b, c), dist(a, c)) * 2);
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
    const s = i / n, t = j / n;
    put(a[0] + (b[0] - a[0]) * s + (c[0] - a[0]) * t, a[1] + (b[1] - a[1]) * s + (c[1] - a[1]) * t, a[2] + (b[2] - a[2]) * s + (c[2] - a[2]) * t, id);
  }
}
function spikes(a, b, r, step, id) {
  const n = Math.max(1, Math.floor(dist(a, b) / step));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t, cz = a[2] + (b[2] - a[2]) * t;
    const top = Math.floor(cy + r) + 1;
    put(cx, top, cz, id);
    if (i % 2 === 0) put(cx, top + 1, cz, YELLOW);
  }
}

// ---- clear trees where the dragon, wings and burning ruin go
cube(-9, 1, -11, 9, 10, 15, AIR);
cube(-21, 3, -5, 21, 9, 12, AIR);
cube(-3, 8, -19, 7, 20, -8, AIR);
cube(4, 1, -22, 16, 10, -13, AIR);

// ---- rocky crag the dragon perches on
const ROCK = (x, y, z) => h(x, y, z) < 0.3 ? COBBLE : (h(x + 3, y, z) < 0.08 ? GRAY : STONE);
ell(0, -2, 3, 8, 6, 9, ROCK, { p: 4, shell: true, ymin: -1 });
ell(-9, -1, -4, 4, 3, 4, ROCK, { p: 3, shell: true, ymin: -1 });
ell(8, -1, 11, 4, 3, 4, ROCK, { p: 3, shell: true, ymin: -1 });
// gold hoard + old bones scattered on the rock
ball(-5, 3.5, -4, 1.5, GOLD);
put(-4, 5, -4, GOLD); put(-6, 4, -2, GOLD); put(-3, 4, -6, GOLD);
put(-7, 4, -1, WHITE); put(-7, 4, 0, WHITE); put(-6, 4, 1, WHITE); put(-8, 4, 2, WHITE); put(6, 4, 3, WHITE); put(7, 4, 4, WHITE);

// ---- dragon body
const GRN = (x, y, z) => (y <= 6 && Math.abs(x) <= 2 && z > -4 && z < 13) ? LIME : (h(x, y, z) < 0.22 ? LEAVES : GREEN);
ell(0, 8, 4, 4, 3.5, 7, GRN, { shell: true });        // torso
ell(0, 8.5, -1, 4, 4, 4, GRN, { shell: true });       // chest
ell(0, 8, 9, 3.5, 3, 4, GRN, { shell: true });        // hips
// neck rises and angles slightly east
tube([0, 9, -3], [1, 13, -8], 2.5, 2, GRN);
tube([1, 13, -8], [2, 15, -11], 2, 2, GRN);
// head
ell(2, 15.5, -12.5, 2.5, 2, 3, GRN);                  // skull
ell(2, 15, -15.5, 2, 1.5, 2.5, GRN);                  // snout
ell(2, 11.5, -14.5, 2, 1, 3.5, GRN);                  // lower jaw, wide open
cube(1, 12, -12, 3, 13, -10, GRN);                    // throat
cube(1, 13, -16, 3, 13, -13, LAVA);                   // glowing mouth
for (let z = -17; z <= -13; z += 2) { put(0, 13, z, WHITE); put(4, 13, z, WHITE); put(1, 13, z + 1, WHITE); put(3, 13, z + 1, WHITE); }
put(1, 12, -18, WHITE); put(3, 12, -18, WHITE);
put(0, 16, -13, NEON_RED); put(4, 16, -13, NEON_RED);
put(0, 17, -13, BLACK); put(4, 17, -13, BLACK);       // brow ridges
put(1, 15, -17, BLACK); put(3, 15, -17, BLACK);       // nostrils
bone([0, 17, -11], [-2, 20, -8], BLACK);
bone([4, 17, -11], [6, 20, -8], BLACK);
bone([1, 17, -10], [0, 19, -7], BLACK);
bone([3, 17, -10], [4, 19, -7], BLACK);
// tail sweeps south and curls east, drooping off the crag
tube([0, 8, 12], [0, 7, 16], 2.5, 1.8, GRN);
tube([0, 7, 16], [4, 5, 19], 1.8, 1.2, GRN);
tube([4, 5, 19], [9, 3, 21], 1.2, 0.8, GRN);
tri([9, 3, 21], [11, 6, 22], [12, 2, 22], ORANGE);
// dorsal spikes
spikes([0, 8.5, -2], [0, 8, 11], 3.5, 2, ORANGE);
spikes([0, 9, -3], [1, 13, -8], 2.3, 2, ORANGE);
spikes([0, 8, 12], [0, 7, 16], 2.2, 2, ORANGE);
spikes([0, 7, 16], [4, 5, 19], 1.5, 2, ORANGE);
// legs
for (const s of [-1, 1]) {
  tube([3 * s, 6, -1], [4.5 * s, 4.5, -3], 1.6, 1.3, GRN);
  cube(Math.min(3 * s, 6 * s), 4, -5, Math.max(3 * s, 6 * s), 4, -2, GRN);
  put(3 * s, 4, -6, WHITE); put(4.5 * s, 4, -6, WHITE); put(6 * s, 4, -6, WHITE);
  tube([3.5 * s, 6, 8], [5 * s, 4.5, 9], 1.6, 1.3, GRN);
  cube(Math.min(3 * s, 6 * s), 4, 8, Math.max(3 * s, 6 * s), 4, 11, GRN);
  put(3 * s, 4, 12, WHITE); put(4.5 * s, 4, 12, WHITE); put(6 * s, 4, 12, WHITE);
}
// wings
const MEM = (x, y, z) => h(x, y, z) < 0.25 ? BROWN : RED;
for (const s of [-1, 1]) {
  const S = [3 * s, 10, 1], E = [11 * s, 17, 3], T1 = [20 * s, 15, -4], T2 = [21 * s, 11, 4], T3 = [18 * s, 7, 11], H = [3 * s, 9, 10];
  tri(E, T1, T2, MEM); tri(E, T2, T3, MEM); tri(E, T3, H, MEM); tri(E, H, S, MEM);
  bone(S, E, BLACK); bone(E, T1, BLACK); bone(E, T2, BLACK); bone(E, T3, BLACK);
  put(T1[0], T1[1] + 1, T1[2], WHITE); put(T2[0], T2[1] + 1, T2[2], WHITE);
  put(E[0], E[1] + 1, E[2], WHITE); put(E[0], E[1] + 2, E[2], WHITE);
}

// ---- fire breath: cone from the mouth down onto the ruin to the north-east
const m = [2, 13, -17], tg = [11, 2, -20];
const dv = [tg[0] - m[0], tg[1] - m[1], tg[2] - m[2]];
const L = Math.hypot(dv[0], dv[1], dv[2]);
const u = dv.map(v => v / L);
for (let x = -2; x <= 16; x++) for (let y = 0; y <= 15; y++) for (let z = -22; z <= -13; z++) {
  const px = x - m[0], py = y - m[1], pz = z - m[2];
  const t = (px * u[0] + py * u[1] + pz * u[2]) / L;
  if (t < 0 || t > 1) continue;
  const cx = m[0] + u[0] * t * L, cy = m[1] + u[1] * t * L, cz = m[2] + u[2] * t * L;
  const perp = Math.hypot(x - cx, y - cy, z - cz);
  const r = 0.8 + 2.8 * t;
  if (perp > r) continue;
  const q = perp / r;
  const dens = 1 - 0.45 * t - 0.5 * q * q;
  if (h(x, y, z) > dens) continue;
  const col = (q < 0.45 && t < 0.5) ? YELLOW : (h(x + 7, y, z) < 0.3 ? LAVA : (q > 0.8 ? RED : ORANGE));
  put(x, y, z, col);
}
// animated flames: a few cells riding above the cone, plus the impact zone
for (const t of [0.15, 0.35, 0.55, 0.75]) {
  const r = 0.8 + 2.8 * t;
  put(m[0] + u[0] * t * L, m[1] + u[1] * t * L + r + 1, m[2] + u[2] * t * L, FIRE);
}
for (const t of [0.3, 0.5, 0.7]) {
  const r = 0.8 + 2.8 * t;
  put(m[0] + u[0] * t * L - r - 1, m[1] + u[1] * t * L, m[2] + u[2] * t * L, FIRE);
}
put(2, 13, -18, FIRE); put(2, 14, -19, FIRE);
put(11, 9, -19, FIRE); put(10, 7, -19, FIRE); put(12, 5, -20, FIRE);
put(7, 1, -17, FIRE); put(15, 1, -18, FIRE); put(4, 1, -20, FIRE);

// ---- burning watchtower ruin being torched
const gy = (x, z) => ((x >= 8 && z >= -17) || x >= 14) ? 0 : -1;
for (let y = -1; y <= 9; y++) for (let x = 8; x <= 14; x++) for (let z = -22; z <= -16; z++) {
  const d = Math.hypot(x - 11, z - 19 + 38);
  if (d < 2.6 || d > 3.5) continue;
  if (h(x, y, z) < y / 11) continue;                    // crumbling toward the top
  if (y <= 1 && z === -16 && x === 11) continue;        // doorway
  put(x, y, z, h(x, y + 5, z) < 0.35 ? STONE : (y > 4 && h(x, y, z + 9) < 0.3 ? BLACK : COBBLE));
}
for (let x = 5; x <= 8; x++) for (let y = 0; y <= 2; y++) if (h(x, y, 9) < 0.7 - y * 0.2) put(x, gy(x, -16) + 1 + y, -16, COBBLE);
for (let z = -22; z <= -19; z++) for (let y = 0; y <= 2; y++) if (h(z, y, 4) < 0.65 - y * 0.2) put(15, gy(15, z) + 1 + y, z, COBBLE);
// scorched earth around the impact
for (let x = 3; x <= 17; x++) for (let z = -22; z <= -13; z++) {
  const d = Math.hypot(x - 11, z + 19);
  if (d > 7) continue;
  const v = h(x, 1, z);
  if (v < 0.9 - d / 8) put(x, gy(x, z), z, v < 0.25 ? GRAY : BLACK);
}

// ---- emit
for (const [k, id] of M) { const [x, y, z] = k.split(',').map(Number); block(x, y, z, id); }