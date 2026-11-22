// ice-dragon-opus — prompt:
// an ice dragon...

const M = new Map(), D = new Map(), G = new Map(), A = new Map();
let cur = M;
function key(x, y, z) { return x + ',' + y + ',' + z; }
function S(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = key(x, y, z);
  if (id === AIR) { cur.delete(k); A.set(k, 1); return; }
  cur.set(k, id);
}
function K(x, y, z, id) { S(x, y, z, id); }
function L(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) { const t = i / n; S(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id); }
}
function C(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) S(x, y, z, id);
}
function H(x, y, z) { const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return s - Math.floor(s); }
function lerp(a, b, t) { return a + (b - a) * t; }
function pick(idf, x, y, z, a, b, c, d) { return typeof idf === 'function' ? idf(x, y, z, a, b, c, d) : idf; }

function ell(cx, cy, cz, rx, ry, rz, idf, shell) {
  const inE = (x, y, z) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1;
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        if (!inE(x, y, z)) continue;
        if (shell && inE(x + 1, y, z) && inE(x - 1, y, z) && inE(x, y + 1, z) && inE(x, y - 1, z) && inE(x, y, z + 1) && inE(x, y, z - 1)) continue;
        S(x, y, z, pick(idf, x, y, z));
      }
}
function ball(cx, cy, cz, r, idf) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++)
        if ((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= r * r)
          S(x, y, z, pick(idf, x, y, z, cx, cy, cz, r));
}
function seg(a, b, r0, r1, idf) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(d * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n, p = [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)], r = lerp(r0, r1, t);
    if (r < 0.7) S(p[0], p[1], p[2], pick(idf, Math.round(p[0]), Math.round(p[1]), Math.round(p[2]), p[0], p[1], p[2], r));
    else ball(p[0], p[1], p[2], r, idf);
  }
}
function path(pts, r0, r1, idf, onSample) {
  let total = 0; const Ls = [0];
  for (let i = 1; i < pts.length; i++) { total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]); Ls.push(total); }
  const n = Math.ceil(total * 2);
  for (let k = 0; k <= n; k++) {
    const d = (k / n) * total;
    let i = 1; while (i < Ls.length - 1 && Ls[i] < d) i++;
    const t = (d - Ls[i - 1]) / (Ls[i] - Ls[i - 1] || 1);
    const p = [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t), lerp(pts[i - 1][2], pts[i][2], t)];
    const r = lerp(r0, r1, d / total);
    if (r < 0.7) S(p[0], p[1], p[2], pick(idf, Math.round(p[0]), Math.round(p[1]), Math.round(p[2]), p[0], p[1], p[2], r));
    else ball(p[0], p[1], p[2], r, idf);
    if (onSample) onSample(p, r, k, n);
  }
}
function tri(P, Q, R, idf, skip) {
  const e = Math.max(Math.hypot(Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]), Math.hypot(R[0] - P[0], R[1] - P[1], R[2] - P[2]), Math.hypot(R[0] - Q[0], R[1] - Q[1], R[2] - Q[2]));
  const n = Math.ceil(e * 1.8);
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
    const u = i / n, v = j / n, w = 1 - u - v;
    if (skip && skip(w, u, v)) continue;
    const x = P[0] * w + Q[0] * u + R[0] * v, y = P[1] * w + Q[1] * u + R[1] * v, z = P[2] * w + Q[2] * u + R[2] * v;
    S(x, y, z, pick(idf, Math.round(x), Math.round(y), Math.round(z), w, u, v));
  }
}

// ---------- palettes ----------
function scales(cy, ry) {
  return (x, y, z) => {
    const rel = (y - cy) / ry;
    if (rel < -0.45) return (z % 2 === 0) ? WHITE : MARBLE;
    if (rel > 0.75 && Math.abs(x) <= 1) return BLUE;
    const h = H(x, y, z);
    if (h < 0.13) return CYAN;
    if (h < 0.22) return WHITE;
    if (rel > 0.4 && h < 0.35) return BLUE;
    return LIGHT_BLUE;
  };
}
const neckCol = (x, y, z, cx, cy, cz) => {
  if (z < cz - 1.2 && y < cy + 0.5) return (y % 2 === 0) ? WHITE : MARBLE;
  const h = H(x, y, z);
  if (h < 0.15) return CYAN;
  if (h < 0.22) return WHITE;
  return LIGHT_BLUE;
};
const limbCol = (x, y, z) => { const h = H(x, y, z); return h < 0.2 ? CYAN : (h < 0.3 ? BLUE : LIGHT_BLUE); };

// ---------- site prep: clear trees around the dragon ----------
for (let x = -14; x <= 14; x++) for (let z = -20; z <= 20; z++) {
  if (x * x + 0.6 * (z - 1) * (z - 1) > 200) continue;
  for (let y = 0; y <= 8; y++) S(x, y, z, AIR);
}

// ---------- body ----------
ell(0, 9, 7, 5, 5, 8, scales(9, 5), true);
ell(0, 10, 0.5, 4.6, 4.8, 4.2, scales(10, 4.8), true);
ell(0, 8, 13, 4, 3.8, 3.5, scales(8, 3.8), true);

// ---------- neck ----------
path([[0, 12, 0], [0, 15, -2.5], [0, 18.5, -4.5], [0, 21.5, -6], [0, 23.5, -7.5]], 3.0, 2.2, neckCol, (p, r, k) => {
  if (k % 3 === 0 && k > 0) {
    const bx = Math.round(p[0]), by = Math.round(p[1] + r * 0.6), bz = Math.round(p[2] + r * 0.85);
    L(bx, by, bz, bx, by + 2, bz + 2, ICE);
  }
});

// ---------- head (facing north) ----------
ell(0, 25, -9.5, 3, 2.6, 3.4, (x, y, z) => (H(x, y, z) < 0.2 ? CYAN : LIGHT_BLUE));
ell(0, 25, -13.5, 2.1, 1.4, 3.2, (x, y, z) => (y >= 26 ? LIGHT_BLUE : (H(x, y, z) < 0.3 ? WHITE : LIGHT_BLUE)));
ell(0, 20.8, -12.3, 1.8, 1.1, 3.2, (x, y, z) => (y <= 20 ? WHITE : LIGHT_BLUE));
for (const s of [-1, 1]) {
  L(s * 2, 23, -8, s * 2, 21, -10, LIGHT_BLUE);
  L(s * 2, 24, -8, s * 2, 22, -9, LIGHT_BLUE);
}
C(-1, 22, -16, 1, 23, -12, AIR);
C(-1, 22, -11, 1, 23, -10, BLACK);
K(0, 22, -12, NEON_BLUE);
K(0, 23, -11, NEON_BLUE);
for (const s of [-1, 1]) {
  K(s, 23, -13, WHITE); K(s, 23, -15, WHITE);
  K(s, 22, -12, WHITE); K(s, 22, -14, WHITE);
  K(s * 2, 26, -12, NEON_BLUE);
  K(s * 3, 26, -11, NEON_BLUE);
  L(s, 27, -13, s * 3, 27, -11, WHITE);
  K(s * 3, 27, -10, WHITE);
  K(s, 25, -17, BLACK);
  K(s, 26, -16, LIGHT_BLUE);
}
K(0, 23, -16, WHITE);

// ---------- horns & frills ----------
for (const s of [-1, 1]) {
  seg([s * 1.6, 27, -9], [s * 2.8, 29.5, -6], 1.0, 0.8, WHITE);
  seg([s * 2.8, 29.5, -6], [s * 3.6, 31.5, -2.5], 0.8, 0.5, WHITE);
  L(s * 4, 32, -2, s * 4, 33, -1, ICE);
  seg([s * 2.8, 25, -8], [s * 5.5, 26, -6], 0.7, 0.5, MARBLE);
  L(s * 6, 26, -5, s * 7, 27, -4, ICE);
  L(s * 3, 23, -8, s * 6, 22, -6, ICE);
  L(s * 3, 24, -7, s * 5, 24, -5, ICE);
  K(s, 19, -12, ICE);
}
L(0, 27, -9, 0, 28, -7, ICE);
L(0, 19, -11, 0, 18, -11, ICE);

// ---------- dorsal spikes ----------
for (let z = -2; z <= 15; z += 2) {
  let topY = 9 + 5 * Math.sqrt(Math.max(0, 1 - ((z - 7) / 8) ** 2));
  if (z < 3) topY = Math.max(topY, 10 + 4.8 * Math.sqrt(Math.max(0, 1 - ((z - 0.5) / 4.2) ** 2)));
  const len = (z >= 2 && z <= 10) ? 4 : 3, ty = Math.round(topY);
  L(0, ty, z, 0, ty + len - 1, z + 1, ICE);
  K(0, ty, z, WHITE);
}

// ---------- legs ----------
for (const s of [-1, 1]) {
  seg([s * 4, 9, 0], [s * 6, 6, -2.5], 1.6, 1.3, limbCol);
  seg([s * 6, 6, -2.5], [s * 6, 1.5, -4], 1.3, 1.1, limbCol);
  ell(s * 6, 0.6, -5, 1.6, 0.8, 2, LIGHT_BLUE);
  for (const dx of [-1, 0, 1]) { K(s * 6 + dx, 0, -7, WHITE); K(s * 6 + dx, -1, -8, ICE); }
  ell(s * 5.2, 7, 11, 2.4, 3.6, 3.6, limbCol, true);
  seg([s * 5.6, 5, 12.5], [s * 6.3, 2.5, 14], 1.6, 1.3, limbCol);
  seg([s * 6.3, 2.5, 14], [s * 6.3, 1, 10.5], 1.2, 1.1, limbCol);
  ell(s * 6.3, 0.6, 9.5, 1.6, 0.8, 2, LIGHT_BLUE);
  for (const dx of [-1, 0, 1]) { K(s * 6 + dx, 0, 7, WHITE); K(s * 6 + dx, -1, 6, ICE); }
  K(s * 6, 1, 15, ICE);
}

// ---------- tail curling east ----------
path([[0, 8, 15], [0, 6, 18], [2, 4, 20.5], [7, 2.5, 21], [12, 2, 19.5], [16, 1.5, 16], [18, 1.5, 12], [18.5, 2.5, 8], [17, 3.5, 5]], 2.6, 0.8,
  (x, y, z, cx, cy) => {
    if (y < cy - 0.6) return WHITE;
    const h = H(x, y, z);
    return h < 0.15 ? CYAN : (h < 0.3 ? BLUE : LIGHT_BLUE);
  },
  (p, r, k, n) => {
    if (k % 3 === 0 && k > 1 && k < n - 2) {
      const ty = Math.round(p[1] + r), len = r > 1.6 ? 3 : 2;
      L(Math.round(p[0]), ty, Math.round(p[2]), Math.round(p[0]), ty + len - 1, Math.round(p[2]), ICE);
    }
  });
tri([17, 3, 5], [15, 7, 2], [19, 6, 3], ICE);
tri([17, 3, 5], [19, 6, 3], [18, 2, 3], ICE);
L(17, 3, 5, 15, 8, 1, WHITE);

// ---------- wings ----------
for (const s of [-1, 1]) {
  const P = [s * 4, 14, 3], Bp = [s * 11, 22, 4], Cw = [s * 16, 28.5, 5];
  const F1 = [s * 22, 31, 7], F2 = [s * 22, 21, 9], F3 = [s * 20, 13, 10], F4 = [s * 13, 10, 10], T = [s * 5, 11, 9];
  const memb = (x, y, z) => { const h = H(x, y, z); return h < 0.07 ? WHITE : (h < 0.22 ? CYAN : LIGHT_BLUE); };
  const scallop = (w, u, v) => w < 0.2 - 0.25 * Math.abs(u - v);
  tri(Cw, F1, F2, memb, scallop);
  tri(Cw, F2, F3, memb, scallop);
  tri(Cw, F3, F4, memb, scallop);
  tri(Cw, F4, Bp, memb);
  tri(Bp, F4, P, memb);
  tri(P, F4, T, memb, (w, u, v) => u > 0.55 && u > v * 2 && w < 0.3);
  seg(P, Bp, 1.3, 1.0, MARBLE);
  seg(Bp, Cw, 1.0, 0.8, MARBLE);
  for (const F of [F1, F2, F3, F4]) seg(Cw, F, 0.6, 0.4, WHITE);
  L(Cw[0], Cw[1] + 1, Cw[2], Cw[0] - s, Cw[1] + 3, Cw[2] - 1, ICE);
  L(F1[0], F1[1], F1[2], F1[0], F1[1] + 2, F1[2] + 1, ICE);
  L(F2[0], F2[1], F2[2], F2[0], F2[1] - 1, F2[2] + 1, ICE);
  L(F3[0], F3[1], F3[2], F3[0], F3[1] - 2, F3[2] + 1, ICE);
  K(Bp[0], Bp[1] + 2, Bp[2], ICE);
}

// ---------- frost breath aimed at a knight ----------
const mouth = [0, 22.5, -16], target = [-5, 3, -19];
for (let i = 2; i <= 40; i++) {
  const t = i / 40;
  const cx = lerp(mouth[0], target[0], t), cy = lerp(mouth[1], target[1], t), cz = lerp(mouth[2], target[2], t);
  const spread = 0.5 + t * 2.2;
  for (let k = 0; k < 3; k++) {
    const h3 = H(i, k, 3);
    if (h3 > 0.8) continue;
    S(cx + (H(i, k, 1) - 0.5) * 2 * spread, cy + (H(i, k, 2) - 0.5) * 1.2 * spread, cz + (H(i, k, 4) - 0.5) * spread,
      h3 < 0.25 ? WHITE : (h3 < 0.55 ? ICE : GLASS));
  }
}
K(0, 21, -17, STEAM); K(-1, 18, -17, STEAM); K(-2, 14, -18, STEAM);
K(-3, 10, -18, STEAM); K(-4, 7, -19, STEAM); K(-3, 1, -21, STEAM);
K(-7, 1, -21, STEAM); K(-6, 1, -16, STEAM);

// ---------- decor layer: frozen knight, crystals, drifts ----------
cur = D;
const kx = -5, kz = -19;
for (let y = 0; y <= 5; y++) for (let x = kx - 2; x <= kx + 2; x++) for (let z = kz - 2; z <= kz + 1; z++) {
  const edge = (x === kx - 2 || x === kx + 2 || z === kz - 2 || z === kz + 1 || y === 5);
  if (edge && H(x, y, z) < 0.85) S(x, y, z, ICE);
}
L(kx - 1, 0, kz, kx - 1, 1, kz, IRON); L(kx + 1, 0, kz, kx + 1, 1, kz, IRON);
C(kx - 1, 2, kz, kx + 1, 3, kz, IRON);
K(kx, 2, kz - 1, BLUE);
K(kx, 4, kz, IRON); K(kx, 4, kz - 1, BLACK);
K(kx, 5, kz, RED);
L(kx + 2, 2, kz - 1, kx + 2, 5, kz - 1, IRON);
K(kx + 1, 3, kz - 1, GOLD);
C(kx - 2, 1, kz - 1, kx - 2, 3, kz - 1, RED);
K(kx - 2, 2, kz - 2, GOLD);

function crystal(x0, z0, h, lean) {
  for (let y = 0; y < h; y++) {
    const r = (1 - y / h) * 1.6, ox = lean[0] * y, oz = lean[1] * y;
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++)
      if (dx * dx + dz * dz <= r * r + 0.3) S(x0 + dx + ox, y, z0 + dz + oz, (y < 2 && dx === 0 && dz === 0) ? LIGHT_BLUE : ICE);
  }
  S(x0 + lean[0] * h, h, z0 + lean[1] * h, WHITE);
}
crystal(-14, -12, 9, [-0.15, -0.1]);
crystal(-12, -15, 5, [0.1, -0.2]);
crystal(13, -16, 7, [0.15, -0.1]);
crystal(15, -12, 4, [0.2, 0.1]);
crystal(-15, 9, 8, [-0.15, 0.1]);
crystal(-16, -3, 6, [-0.2, 0]);
for (const [x, z] of [[-9, -6], [9, -7], [-10, 6], [3, -8], [-3, 17], [11, 9]]) ell(x, -0.5, z, 2, 0.8, 1.6, SNOW);

// ---------- ground layer: frozen snowfield + ice pool ----------
cur = G;
for (let x = -13; x <= 13; x++) for (let z = -18; z <= 20; z++) {
  if (Math.abs(x) <= 4 && z >= 0 && z <= 14) continue;
  if (x * x + 0.6 * (z - 2) * (z - 2) > 125 + H(x, 0, z) * 35) continue;
  const h = H(x, 1, z);
  S(x, -1, z, h < 0.18 ? ICE : (h < 0.26 ? LIGHT_BLUE : SNOW));
}
for (let x = 5; x <= 12; x++) for (let z = -18; z <= -10; z++)
  if (((x - 8.5) / 3.8) ** 2 + ((z + 14) / 4.5) ** 2 <= 1) S(x, -1, z, ICE);

// ---------- flush: dragon first, then decor, then ground (nearest first), then AIR ----------
const CAP = 3990;
let solid = 0;
const emitted = new Set();
function emit(k, id) {
  if (emitted.has(k)) return;
  if (solid >= CAP) return;
  const p = k.split(',').map(Number);
  block(p[0], p[1], p[2], id);
  emitted.add(k);
  solid++;
}
for (const [k, id] of M) emit(k, id);
for (const [k, id] of D) emit(k, id);
const ground = [...G.entries()].map(([k, id]) => { const p = k.split(',').map(Number); return [p[0] * p[0] + 0.6 * (p[2] - 2) * (p[2] - 2), k, id]; });
ground.sort((a, b) => a[0] - b[0]);
for (const g of ground) emit(g[1], g[2]);
for (const k of A.keys()) {
  if (M.has(k) || D.has(k) || G.has(k)) continue;
  const p = k.split(',').map(Number);
  block(p[0], p[1], p[2], AIR);
}