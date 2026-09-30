// eye-of-sauron-opus — prompt:
// the Eye of Sauron on the tower of Barad-dur...

const cz = 2;
const M = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, id);
}
function hs(x, y, z) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function dark(x, y, z) { const r = hs(x, y, z); return r < 0.5 ? OBSIDIAN : r < 0.86 ? BLACK : GRAY; }
function ash(x, y, z) { const r = hs(x + 99, y, z); return r < 0.35 ? BLACK : r < 0.62 ? GRAY : r < 0.85 ? COBBLE : STONE; }
function pick(f, x, y, z) { return typeof f === 'function' ? f(x, y, z) : f; }
function box(x1, y1, z1, x2, y2, z2, f) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, pick(f, x, y, z));
}
function ln(x1, y1, z1, x2, y2, z2, f) {
  const n = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)));
  for (let i = 0; i <= n; i++) {
    const t = n ? i / n : 0;
    const x = Math.round(x1 + (x2 - x1) * t), y = Math.round(y1 + (y2 - y1) * t), z = Math.round(z1 + (z2 - z1) * t);
    put(x, y, z, pick(f, x, y, z));
  }
}
function tri(A, B, C, f) {
  const n = Math.max(1, Math.ceil(Math.hypot(C[0] - B[0], C[1] - B[1], C[2] - B[2]) * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    ln(A[0], A[1], A[2], B[0] + (C[0] - B[0]) * t, B[1] + (C[1] - B[1]) * t, B[2] + (C[2] - B[2]) * t, f);
  }
}
const D = (x, z) => Math.max(Math.abs(x), Math.abs(z - cz));

// ---- clear trees / grass bumps from the site (AIR is free) ----
for (let x = -14; x <= 14; x++) for (let z = -14; z <= 14; z++)
  if (x * x + z * z <= 196) for (let y = 0; y <= 7; y++) put(x, y, z, AIR);
for (let x = -21; x <= -9; x++) for (let z = 8; z <= 20; z++)
  if ((x + 15) * (x + 15) + (z - 14) * (z - 14) <= 49) for (let y = 0; y <= 7; y++) put(x, y, z, AIR);

// ---- scorched ash plain of Gorgoroth ----
for (let x = -14; x <= 14; x++) for (let z = -14; z <= 14; z++)
  if (x * x + z * z <= 13.5 * 13.5) put(x, -1, z, ash(x, -1, z));

// lava fissures
const cracks = [
  [[-3, -6], [-5, -8], [-9, -9], [-11, -7]],
  [[-7, -8], [-7, -11]],
  [[3, -6], [6, -9], [10, -9], [11, -7]],
  [[6, -9], [7, -11]],
  [[-11, 4], [-12, 7]],
  [[11, 2], [12, 5]],
];
for (const c of cracks) for (let i = 0; i < c.length - 1; i++)
  ln(c[i][0], -1, c[i][1], c[i + 1][0], -1, c[i + 1][1], LAVA);

// black road to the gate
box(-1, -1, -14, 1, -1, cz - 8, (x, y, z) => (hs(x, y, z) < 0.5 ? BLACK : COBBLE));

// ---- plinth ----
for (let x = -8; x <= 8; x++) for (let z = cz - 8; z <= cz + 8; z++)
  if (D(x, z) >= 7) put(x, 0, z, dark(x, 0, z));

// ---- tiered tower of Barad-dur ----
function walls(hw, y1, y2) {
  for (let y = y1; y <= y2; y++) for (let x = -hw; x <= hw; x++) for (let z = cz - hw; z <= cz + hw; z++)
    if (D(x, z) === hw) put(x, y, z, dark(x, y, z));
}
function ring(dmin, dmax, y) {
  for (let x = -dmax; x <= dmax; x++) for (let z = cz - dmax; z <= cz + dmax; z++) {
    const d = D(x, z);
    if (d >= dmin && d <= dmax) put(x, y, z, dark(x, y, z));
  }
}
function crenel(dd, y) {
  for (let x = -dd; x <= dd; x++) for (let z = cz - dd; z <= cz + dd; z++)
    if (D(x, z) === dd && (((x + z) % 2) + 2) % 2 === 0) put(x, y, z, dark(x, y, z));
}
walls(6, 0, 8); ring(6, 7, 9); crenel(7, 10);
walls(5, 9, 16); ring(5, 6, 17); crenel(6, 18);
walls(4, 17, 22); ring(4, 5, 23); crenel(5, 24);
walls(3, 23, 25); box(-2, 25, cz - 2, 2, 25, cz + 2, dark);

// buttress ribs
for (const x of [-3, 3]) box(x, 0, cz - 7, x, 8, cz - 7, dark);
for (const s of [-1, 1]) box(7 * s, 0, cz, 7 * s, 8, cz, dark);
box(0, 0, cz + 7, 0, 8, cz + 7, dark);
for (const x of [-2, 2]) box(x, 10, cz - 6, x, 16, cz - 6, dark);
for (const s of [-1, 1]) box(6 * s, 10, cz, 6 * s, 16, cz, dark);
for (const x of [-3, 3]) box(x, 18, cz - 5, x, 22, cz - 5, dark);

// corner turrets on the base tier
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  const cx = 6 * sx, cc = cz + 6 * sz;
  box(cx - 1, 0, cc - 1, cx + 1, 11, cc + 1, dark);
  for (const a of [-1, 1]) for (const b of [-1, 1]) put(cx + a, 12, cc + b, dark(cx + a, 12, cc + b));
  ln(cx, 12, cc, cx + 2 * sx, 16, cc + 2 * sz, BLACK);
  put(cx + 2 * sx, 17, cc + 2 * sz, IRON);
  if (sz < 0) { put(cx, 7, cc - 1, NEON_RED); put(cx, 8, cc - 1, NEON_RED); }
}
// jagged spires on the upper ledges
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  box(6 * sx, 17, cz + 6 * sz, 6 * sx, 21, cz + 6 * sz, dark);
  ln(6 * sx, 21, cz + 6 * sz, 8 * sx, 24, cz + 8 * sz, BLACK);
  put(8 * sx, 25, cz + 8 * sz, IRON);
  box(5 * sx, 23, cz + 5 * sz, 5 * sx, 26, cz + 5 * sz, dark);
  ln(5 * sx, 26, cz + 5 * sz, 7 * sx, 29, cz + 7 * sz, BLACK);
  put(7 * sx, 30, cz + 7 * sz, IRON);
}

// gatehouse porch with raised portcullis
box(-2, 0, cz - 8, 2, 5, cz - 7, dark);
box(-1, 0, cz - 8, 1, 3, cz - 6, AIR);
box(0, 4, cz - 8, 0, 4, cz - 6, AIR);
for (const x of [-2, 0, 2]) put(x, 6, cz - 8, dark(x, 6, cz - 8));
box(-1, 3, cz - 8, 1, 3, cz - 8, IRON);
put(-1, 2, cz - 8, IRON); put(1, 2, cz - 8, IRON);
box(-1, -1, cz - 5, 1, -1, cz - 4, LAVA);
for (const s of [-1, 1]) ln(2 * s, 6, cz - 8, 3 * s, 8, cz - 10, BLACK);

// glowing window slits
const W = [
  [0, 6, cz - 6], [0, 7, cz - 6], [-4, 4, cz - 6], [-4, 5, cz - 6], [4, 4, cz - 6], [4, 5, cz - 6],
  [0, 12, cz - 5], [0, 13, cz - 5], [0, 14, cz - 5], [-3, 11, cz - 5], [-3, 12, cz - 5], [3, 11, cz - 5], [3, 12, cz - 5],
  [0, 19, cz - 4], [0, 20, cz - 4], [-2, 20, cz - 4], [2, 20, cz - 4],
  [-1, 24, cz - 3], [1, 24, cz - 3],
  [-6, 5, cz - 2], [6, 5, cz - 2], [-6, 5, cz + 3], [6, 5, cz + 3],
  [-5, 13, cz - 1], [5, 13, cz - 1], [-4, 20, cz + 1], [4, 20, cz + 1],
];
for (const w of W) put(w[0], w[1], w[2], NEON_RED);

// ---- the claw horns cradling the Eye ----
const inner = { 26: 3, 27: 4, 28: 5, 29: 5, 30: 5, 31: 5, 32: 4, 33: 3 };
const wid = { 26: 3, 27: 3, 28: 2, 29: 2, 30: 2, 31: 2, 32: 1, 33: 1 };
for (const s of [-1, 1]) {
  for (let y = 26; y <= 33; y++) {
    const z2 = y <= 30 ? cz + 1 : y <= 32 ? cz : cz - 1;
    for (let k = 0; k < wid[y]; k++) for (let z = cz - 1; z <= z2; z++) {
      const x = s * (inner[y] + k);
      put(x, y, z, hs(x, y, z) < 0.7 ? OBSIDIAN : BLACK);
    }
  }
  put(s * 7, 28, cz, IRON); put(s * 8, 29, cz, IRON);
  put(s * 7, 31, cz, BLACK); put(s * 8, 32, cz, IRON);
  put(s * 6, 26, cz + 1, BLACK); put(s * 7, 25, cz + 1, IRON);
}

// ---- the Eye of Sauron: fiery almond, slit pupil, facing north ----
const ey = 29, ez = cz - 1, EA = 4.6, EB = 3.4;
for (let x = -5; x <= 5; x++) for (let y = 26; y <= 32; y++) {
  const dx = x / EA, dy = (y - ey) / EB, r = Math.sqrt(dx * dx + dy * dy);
  if (r > 1) continue;
  const pupil = x === 0 && Math.abs(y - ey) <= 2;
  put(x, y, ez, pupil ? BLACK : r < 0.42 ? GLOWSTONE : r < 0.75 ? LAVA : NEON_RED);
  put(x, y, ez + 1, pupil ? BLACK : r < 0.8 ? LAVA : NEON_RED);
}
// flame halo around the upper rim
for (let k = 0; k <= 8; k++) {
  const a = (k * Math.PI) / 8;
  put(Math.cos(a) * EA * 1.25, ey + Math.sin(a) * EB * 1.2, ez - 1, FIRE);
}

// ---- outer curtain wall + gate towers ----
const seen = new Set();
for (let a = 0; a < Math.PI * 2; a += 0.02) {
  const x = Math.round(11 * Math.cos(a)), z = Math.round(cz + 11 * Math.sin(a));
  if (z - cz < -8 || seen.has(x + ',' + z)) continue;
  seen.add(x + ',' + z);
  box(x, 0, z, x, 2, z, dark);
  if ((((x + z) % 2) + 2) % 2 === 0) put(x, 3, z, dark(x, 3, z));
}
for (const s of [-1, 1]) {
  const cx = 8 * s, cc = cz - 8;
  box(cx - 1, 0, cc - 1, cx + 1, 9, cc + 1, dark);
  for (const a of [-1, 1]) for (const b of [-1, 1]) put(cx + a, 10, cc + b, dark(cx + a, 10, cc + b));
  ln(cx + s, 10, cc - 1, cx + 3 * s, 13, cc - 2, BLACK);
  put(cx, 10, cc, FIRE);
  put(cx, 6, cc - 2, NEON_RED);
}

// ---- orc column marching on the gate ----
for (const x of [-1, 1]) for (const z of [-13, -11, -9]) {
  put(x, 0, z, BLACK);
  put(x, 1, z, hs(x, 1, z) < 0.5 ? BROWN : BLACK);
  put(x, 2, z, GRAY);
  const sx = x * 2;
  box(sx, 0, z, sx, 2, z, BROWN);
  put(sx, 3, z, IRON);
}
// torch posts along the road
for (const x of [-3, 3]) for (const z of [-9, -13]) { box(x, 0, z, x, 1, z, BLACK); put(x, 2, z, FIRE); }

// ---- Nazgul on fell beasts, wings raised, flying toward the viewer ----
function fell(ox, oy, oz, sp) {
  ln(ox, oy, oz - 2, ox, oy, oz + 3, BLACK);
  put(ox, oy - 1, oz, BLACK); put(ox, oy - 1, oz + 1, BLACK);
  ln(ox, oy, oz - 2, ox, oy + 2, oz - 4, BLACK);
  put(ox, oy + 2, oz - 5, GRAY); put(ox, oy + 1, oz - 6, GRAY); put(ox, oy + 3, oz - 4, BLACK);
  ln(ox, oy, oz + 3, ox, oy - 2, oz + 7, BLACK);
  put(ox, oy + 1, oz - 1, BLACK); put(ox, oy + 2, oz - 1, BLACK); put(ox, oy + 3, oz - 1, IRON);
  put(ox - 1, oy - 2, oz, GRAY); put(ox + 1, oy - 2, oz, GRAY);
  for (const s of [-1, 1]) {
    const A = [ox + s, oy, oz], T = [ox + s * sp, oy + Math.round(sp * 0.7), oz + 1];
    const L = [ox + s * Math.round(sp * 0.75), oy - 1, oz + 1], H = [ox + s, oy - 1, oz + 2];
    tri(A, T, L, BLACK); tri(A, L, H, BLACK);
    ln(A[0], A[1] + 1, A[2], T[0], T[1], T[2], GRAY);
  }
}
fell(16, 23, -6, 5);
fell(-15, 19, 5, 4);

// ---- Mount Doom smouldering in the back ----
const mx = -15, mz = 14;
for (let y = -1; y <= 10; y++) {
  const ro = 6.2 - y * 0.45, ri = ro - 1.5;
  for (let x = mx - 7; x <= mx + 7; x++) for (let z = mz - 7; z <= mz + 7; z++) {
    const r = Math.hypot(x - mx, z - mz);
    if (r <= ro && r > ri) put(x, y, z, hs(x, y, z) < 0.6 ? BLACK : hs(z, y, x) < 0.5 ? GRAY : BROWN);
  }
}
for (let x = mx - 1; x <= mx + 1; x++) for (let z = mz - 1; z <= mz + 1; z++) put(x, 9, z, LAVA);
ln(mx + 1, 9, mz - 1, mx + 4, 2, mz - 4, LAVA);
ln(mx + 4, 2, mz - 4, mx + 6, -1, mz - 6, LAVA);
put(mx, 10, mz, FIRE);

// ---- flush (deduplicated, last write wins) ----
for (const [k, id] of M) {
  const p = k.split(',');
  block(+p[0], +p[1], +p[2], id);
}