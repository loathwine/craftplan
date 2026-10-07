// dragon-fire-sonnet55 — prompt:
// a dragon breathing fire...

const ZO = 6;
const M = new Map();
const hsh = (x, y, z) => { const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return n - Math.floor(n); };
function P(x, y, z, id, pri) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z) + ZO;
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, { x, y, z, id, pri: pri === undefined ? 1 : pri });
}
function has(x, y, z) { return M.has(Math.round(x) + ',' + Math.round(y) + ',' + (Math.round(z) + ZO)); }
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
function boxP(x1, y1, z1, x2, y2, z2, id, pri) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) P(x, y, z, id, pri);
}
function lineP(a, b, id, pri) {
  const n = Math.max(1, Math.ceil(dist(a, b) * 2));
  for (let i = 0; i <= n; i++) { const p = lerp3(a, b, i / n); P(p[0], p[1], p[2], id, pri); }
}
function ball(c, r, fn, pri) {
  for (let x = Math.floor(c[0] - r); x <= Math.ceil(c[0] + r); x++)
    for (let y = Math.floor(c[1] - r); y <= Math.ceil(c[1] + r); y++)
      for (let z = Math.floor(c[2] - r); z <= Math.ceil(c[2] + r); z++) {
        const dx = x - c[0], dy = y - c[1], dz = z - c[2];
        if (dx * dx + dy * dy + dz * dz <= r * r + 0.3) P(x, y, z, fn(x, y, z, c, r), pri);
      }
}
function capsule(p0, p1, r0, r1, fn, pri) {
  const n = Math.max(1, Math.ceil(dist(p0, p1) * 2));
  for (let i = 0; i <= n; i++) { const t = i / n; ball(lerp3(p0, p1, t), r0 + (r1 - r0) * t, fn, pri); }
}
function tri(a, b, c, fn, pri) {
  const N = Math.ceil(Math.max(dist(a, b), dist(b, c), dist(a, c)) * 2);
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N - i; j++) {
    const u = i / N, v = j / N;
    const x = a[0] + (b[0] - a[0]) * u + (c[0] - a[0]) * v;
    const y = a[1] + (b[1] - a[1]) * u + (c[1] - a[1]) * v;
    const z = a[2] + (b[2] - a[2]) * u + (c[2] - a[2]) * v;
    P(x, y, z, fn(x, y, z), pri);
  }
}

// clear trees from the site (above ground level)
cube(-13, 1, -22, 15, 8, 20, AIR);

// color functions
const scaleFn = (x, y, z) => hsh(x, y, z) < 0.13 ? LIME : GREEN;
const bellyFn = (x, y, z, c, r) => (y < c[1] - r * 0.5) ? ((((Math.round(z) % 3) + 3) % 3 === 0) ? ORANGE : YELLOW) : scaleFn(x, y, z);
const throatFn = (x, y, z, c, r) => (z < c[2] - r * 0.45) ? ((((Math.round(y) % 3) + 3) % 3 === 0) ? ORANGE : YELLOW) : scaleFn(x, y, z);

// ---------- rocky mound ----------
for (let x = -9; x <= 9; x++) for (let z = -9; z <= 15; z++) {
  const rr = (x / 8.8) ** 2 + ((z - 3) / 12) ** 2;
  if (rr >= 1) continue;
  const top = Math.floor(-1 + 2.9 * Math.sqrt(1 - rr) + 0.4);
  for (let y = (rr < 0.5 ? Math.max(-1, top - 1) : top); y <= top; y++) {
    const hv = hsh(x, y, z);
    P(x, y, z, hv < 0.4 ? STONE : hv < 0.75 ? COBBLE : GRAY, 0);
  }
}

// ---------- gold hoards ----------
function hoard(cx, cy, cz, r) {
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
    const d = Math.hypot(dx, dz); if (d > r) continue;
    const hgt = Math.floor((r - d) * 0.9 + hsh(cx + dx, 3, cz + dz) * 1.2);
    for (let y = 0; y <= hgt; y++) {
      const hv = hsh(cx + dx, y, cz + dz);
      let id = hv < 0.6 ? GOLD : YELLOW;
      if (y === hgt && hv > 0.9) id = [NEON_RED, NEON_BLUE, CYAN, GLOWSTONE][Math.floor(hv * 100) % 4];
      P(cx + dx, cy + y, cz + dz, id, 2);
    }
  }
}
hoard(-8, 0, -3, 3);
hoard(9, 0, -2, 2);
lineP([-8, 3, -5], [-8, 7, -5], IRON, 2); boxP(-9, 6, -5, -7, 6, -5, GOLD, 2); P(-8, 8, -5, GOLD, 2);

// ---------- tail ----------
const tailPts = [[0, 7.5, 9, 2.8], [1, 6, 12, 2.2], [4, 4, 13.5, 1.8], [8, 2.5, 14, 1.4], [12, 1.2, 12.5, 1.1], [15, 1.2, 9.5, 0.8], [16.5, 1.2, 6, 0.5]];
for (let i = 0; i < tailPts.length - 1; i++) {
  const a = tailPts[i], b = tailPts[i + 1];
  capsule([a[0], a[1], a[2]], [b[0], b[1], b[2]], a[3], b[3], bellyFn);
}
for (let i = 1; i < tailPts.length - 1; i++) { const a = tailPts[i]; P(a[0], a[1] + a[3] + 0.6, a[2], GOLD, 2); if (i < 4) P(a[0], a[1] + a[3] + 1.6, a[2], GOLD, 2); }
// spade tail tip
P(16.5, 1.5, 5, GOLD); P(16.5, 1.5, 4, GOLD); P(15.5, 1.5, 4, GOLD); P(17.5, 1.5, 4, GOLD); P(16.5, 1.5, 3, GOLD); P(16.5, 2.5, 4, GOLD);

// ---------- legs ----------
for (const s of [-1, 1]) {
  // hind
  capsule([s * 3.8, 8, 9], [s * 4.4, 5.6, 10.5], 2.6, 1.9, scaleFn);
  capsule([s * 4.4, 5.6, 10.5], [s * 4, 3.8, 8.8], 1.5, 1.2, scaleFn);
  boxP(s * 4 - 1, 3, 6, s * 4 + 1, 3, 10, GREEN);
  for (const dx of [-1, 0, 1]) { P(s * 4 + dx, 3, 5, GREEN); P(s * 4 + dx, 3, 4, WHITE); }
  // fore
  capsule([s * 3.3, 8.8, -1.2], [s * 3.6, 6, -3.2], 2.0, 1.5, scaleFn);
  capsule([s * 3.6, 6, -3.2], [s * 3.8, 3.8, -4.4], 1.4, 1.2, scaleFn);
  boxP(s * 3.8 - 1, 3, -7, s * 3.8 + 1, 3, -4, GREEN);
  for (const dx of [-1, 0, 1]) { P(s * 4 + dx - (s > 0 ? 0 : 0), 3, -8, WHITE); }
}

// ---------- torso, neck ----------
capsule([0, 8, 9], [0, 9.5, 0], 3.4, 4.2, bellyFn);
const neck = [[0, 10.5, -1.5, 3.2], [0.5, 13, -4, 2.7], [1, 16, -6, 2.4], [1.5, 18.5, -8, 2.5]];
for (let i = 0; i < neck.length - 1; i++) {
  const a = neck[i], b = neck[i + 1];
  capsule([a[0], a[1], a[2]], [b[0], b[1], b[2]], a[3], b[3], throatFn);
}
// back spines
for (let i = 0; i < 5; i++) {
  const t = i / 4, c = lerp3([0, 8, 9], [0, 9.5, 0], t), r = 3.4 + 0.8 * t;
  const y = Math.floor(c[1] + r) + 1;
  P(0, y, c[2], GOLD, 2); if (i % 2 === 0) P(0, y + 1, c[2], GOLD, 2);
}
P(1, 14.5, -2, GOLD, 2); P(1, 14.5, -1, GOLD, 2);
P(1, 16, -3, GOLD, 2); P(1, 16, -2, GOLD, 2);
P(1.5, 17.5, -4, GOLD, 2); P(1.5, 17.5, -3, GOLD, 2);

// ---------- head ----------
capsule([1.5, 19, -8], [2, 18.3, -13], 2.7, 1.9, bellyFn);
capsule([2, 18.3, -13], [2, 17.7, -17.5], 1.9, 1.3, scaleFn);
capsule([2, 15.5, -10.5], [2, 13.3, -16.5], 1.4, 1.0, bellyFn);
// tongue + teeth
for (let z = -11; z >= -16; z--) {
  const i = (-10.5 - z) / 6, cy = 15.5 - 2.3 * i, r = 1.4 - 0.4 * i;
  P(2, Math.floor(cy + r), z, RED, 3);
  if (z <= -12 && r >= 1.0) {
    const ty = Math.floor(cy + Math.sqrt(Math.max(0, r * r - 1))) + 1;
    P(1, ty, z, WHITE, 3); P(3, ty, z, WHITE, 3);
  }
}
for (let z = -14; z >= -17; z--) {
  const t = (-13 - z) / 4.5, cy = 18.3 - 0.6 * t, r = 1.9 - 0.6 * t;
  const by = Math.ceil(cy - Math.sqrt(Math.max(0, r * r - 1))) - 1;
  if (z % 2 === 0) { P(1, by, z, WHITE, 3); P(1, by - 1, z, WHITE, 3); P(3, by, z, WHITE, 3); P(3, by - 1, z, WHITE, 3); }
  else { P(1, by, z, WHITE, 3); P(3, by, z, WHITE, 3); }
}
// eyes, nostrils, brow
P(0, 19, -11, NEON_RED, 3); P(4, 19, -11, NEON_RED, 3);
P(0, 19, -12, YELLOW, 3); P(4, 19, -12, YELLOW, 3);
P(1.3, 18, -18, BLACK, 3); P(2.7, 18, -18, BLACK, 3);
// horns
for (const s of [-1, 1]) {
  const bx = 2 + s * 1.7;
  capsule([bx, 20.5, -8], [2 + s * 2.8, 23, -6.5], 1.1, 0.8, () => MARBLE, 2);
  capsule([2 + s * 2.8, 23, -6.5], [2 + s * 3.4, 25.5, -3.5], 0.8, 0.4, () => MARBLE, 2);
  P(2 + s * 3.6, 26.5, -2.5, MARBLE, 2);
  // cheek spikes
  lineP([2 + s * 2.5, 18.5, -7], [2 + s * 4.5, 18, -4.5], GOLD, 2);
}
// head crest
for (const z of [-8, -9, -10, -11]) P(1.8, 22.2, z, GOLD, 2);
P(1.8, 23, -8, GOLD, 2); P(1.8, 23, -10, GOLD, 2);

// ---------- wings ----------
function wing(s) {
  const lift = s < 0 ? 1 : 0;
  const S = [s * 3.2, 11.5, 1.5];
  const E = [s * 10, 22 + lift, -1];
  const W = [s * 19, 27 + lift * 2, -3 - lift];
  const T1 = [s * 21.5, 20 + lift * 1.5, 1];
  const T2 = [s * 17, 13 + lift * 1.5, 8];
  const T3 = [s * 11.5, 10 + lift, 12.5];
  const B = [s * 3.5, 8, 11];
  const sc = (a, b, w, k) => lerp3(lerp3(a, b, 0.5), w, k);
  const M12 = sc(T1, T2, W, 0.22), M23 = sc(T2, T3, W, 0.22), M3B = sc(T3, B, E, 0.18);
  const mem = (x, y, z) => hsh(x, y, z) < 0.12 ? MAGENTA : PURPLE;
  tri(W, T1, M12, mem); tri(W, M12, T2, mem); tri(W, T2, M23, mem); tri(W, M23, T3, mem);
  tri(E, W, T3, mem); tri(E, T3, M3B, mem); tri(E, M3B, B, mem); tri(S, E, B, mem);
  lineP(W, T1, BLACK, 2); lineP(W, T2, BLACK, 2); lineP(W, T3, BLACK, 2); lineP(E, T3, BLACK, 2);
  ball(S, 2.2, scaleFn);
  capsule(S, E, 1.5, 1.1, scaleFn, 2);
  capsule(E, W, 1.1, 0.8, scaleFn, 2);
  P(W[0] + s, W[1] + 1, W[2] - 1, WHITE, 3); P(W[0] + s * 2, W[1] + 2, W[2] - 2, WHITE, 3);
  P(E[0], E[1] + 2, E[2], GOLD, 3); P(E[0], E[1] + 3, E[2], GOLD, 3);
  P(T1[0], T1[1] - 1, T1[2], WHITE, 3); P(T2[0], T2[1] - 1, T2[2], WHITE, 3);
}
wing(1); wing(-1);

// ---------- fire breath ----------
{
  const m = [2, 15.4, -17.6];
  let d = [0.6, -0.3, -0.75]; const dl = Math.hypot(d[0], d[1], d[2]); d = d.map(v => v / dl);
  const L = 13;
  const Rf = t => 0.9 + 3.6 * Math.pow(t / L, 0.85) + 0.4 * Math.sin(t * 1.3);
  const end = [m[0] + d[0] * L, m[1] + d[1] * L, m[2] + d[2] * L];
  for (let x = Math.floor(Math.min(m[0], end[0]) - 5); x <= Math.ceil(Math.max(m[0], end[0]) + 5); x++)
    for (let y = Math.floor(Math.min(m[1], end[1]) - 5); y <= Math.ceil(Math.max(m[1], end[1]) + 5); y++)
      for (let z = Math.floor(Math.min(m[2], end[2]) - 5); z <= Math.ceil(Math.max(m[2], end[2]) + 5); z++) {
        const v = [x - m[0], y - m[1], z - m[2]];
        const t = v[0] * d[0] + v[1] * d[1] + v[2] * d[2];
        if (t < 0 || t > L) continue;
        const rad = Math.sqrt(Math.max(0, v[0] * v[0] + v[1] * v[1] + v[2] * v[2] - t * t));
        const R = Rf(t);
        if (rad > R) continue;
        const frac = rad / R, hv = hsh(x, y, z);
        if (frac > 0.7 && hv < 0.4) continue;
        if (t < 2.5 && has(x, y, z)) continue;
        let id;
        if (frac < 0.35) id = hv < 0.2 ? GLOWSTONE : YELLOW;
        else if (frac < 0.7) id = hv < 0.25 ? LAVA : ORANGE;
        else id = hv < 0.55 ? RED : ORANGE;
        P(x, y, z, id, 3);
      }
  for (let i = 0; i < 22; i++) {
    const t = L * (0.2 + 0.8 * i / 21), R = Rf(t);
    const c = [m[0] + d[0] * t, m[1] + d[1] * t, m[2] + d[2] * t];
    P(c[0] + (hsh(i, 1, 7) - 0.5) * R * 1.3, c[1] + (hsh(i, 2, 9) - 0.5) * R * 1.3, c[2] + (hsh(i, 3, 5) - 0.5) * R * 0.6, FIRE, 4);
  }
  P(m[0], m[1], m[2], FIRE, 4); P(m[0] + d[0] * 1.5, m[1] + d[1] * 1.5, m[2] + d[2] * 1.5, FIRE, 4);
  // stray sparks beyond the tip
  for (let i = 0; i < 8; i++) {
    const t = L + 0.5 + i * 0.4;
    P(m[0] + d[0] * t + (hsh(i, 4, 1) - 0.5) * 5, m[1] + d[1] * t + (hsh(i, 5, 2) - 0.5) * 5, Math.max(-28, m[2] + d[2] * t), i % 2 ? ORANGE : RED, 3);
  }
}

// ---------- burning watchtower ----------
for (let y = -1; y <= 9; y++) for (let x = 9; x <= 11; x++) for (let z = -27; z <= -25; z++) {
  const hv = hsh(x, y, z);
  let id = hv < 0.5 ? STONE : COBBLE;
  if (y >= 6 && hv > 0.88) id = BLACK;
  P(x, y, z, id, 2);
}
boxP(8, 10, -28, 12, 10, -24, COBBLE, 2);
for (const [x, z] of [[8, -28], [12, -28], [8, -24], [12, -24], [10, -28], [8, -26], [12, -26], [10, -24]]) { P(x, 11, z, STONE, 2); }
for (const [x, z] of [[8, -28], [12, -28], [8, -24], [12, -24]]) P(x, 12, z, STONE, 2);
P(10, 4, -28, GLOWSTONE, 2); P(10, 7, -28, GLOWSTONE, 2);
P(10, 0, -28, PLANKS, 2); P(10, 1, -28, PLANKS, 2);
P(10, 11, -26, FIRE, 4); P(9, 11, -25, FIRE, 4); P(11, 11, -27, FIRE, 4); P(10, 12, -26, FIRE, 4); P(9, 8, -28, FIRE, 4);
P(11, 11, -25, ORANGE, 3); P(9, 11, -27, RED, 3);
// embers on ground
P(7, 0, -25, LAVA, 2); P(8, 0, -23, ORANGE, 2); P(13, 0, -26, RED, 2); P(6, 0, -27, ORANGE, 2);

// ---------- brave knight ----------
{
  const kx = 4, kz = -22;
  boxP(kx - 1, -1, kz - 1, kx + 1, -1, kz + 1, STONE, 2);
  P(kx - 1, 0, kz, IRON, 2); P(kx - 1, 1, kz, IRON, 2); P(kx + 1, 0, kz, IRON, 2); P(kx + 1, 1, kz, IRON, 2);
  boxP(kx - 1, 2, kz, kx + 1, 4, kz, IRON, 2);
  boxP(kx - 1, 5, kz, kx, 6, kz, IRON, 2);
  P(kx - 1, 7, kz, RED, 2); P(kx - 1, 8, kz, RED, 2);
  P(kx - 1, 6, kz - 1, BLACK, 2);
  // shield facing the fire
  boxP(kx + 1, 3, kz - 1, kx + 2, 6, kz - 1, BLUE, 2);
  P(kx + 1, 5, kz - 1, GOLD, 2); P(kx + 2, 4, kz - 1, GOLD, 2); P(kx + 1, 4, kz - 1, GOLD, 2); P(kx + 2, 5, kz - 1, GOLD, 2);
  P(kx + 1, 7, kz - 1, BLUE, 2);
  // sword raised
  lineP([kx - 2, 4, kz - 1], [kx - 2, 10, kz - 1], IRON, 2);
  boxP(kx - 3, 4, kz - 1, kx - 1, 4, kz - 1, GOLD, 2);
}

// ---------- emit ----------
let all = [...M.values()];
const over = all.length - 3950;
if (over > 0) {
  all.sort((a, b) => (a.pri - b.pri) || (hsh(a.x, a.y, a.z) - hsh(b.x, b.y, b.z)));
  all = all.slice(over);
}
for (const b of all) block(b.x, b.y, b.z, b.id);