// cyber-samurai-opus — prompt:
// a cyberpunk samurai with a neon katana...

const M = new Map();
function S(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, id);
}
function B(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) S(x, y, z, id);
}
function ball(cx, cy, cz, r, id, keep) {
  const r2 = r * r + 0.3;
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) {
        const dx = x - cx, dy = y - cy, dz = z - cz;
        if (dx * dx + dy * dy + dz * dz <= r2) {
          if (keep) { const c = keep(x, y, z, dx, dy, dz); if (c) S(x, y, z, c); }
          else S(x, y, z, id);
        }
      }
}
function tube(a, b, r, id) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(d * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    ball(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, id);
  }
}
function L(a, b, id) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(d * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    S(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, id);
  }
}

// clear trees around the site
cube(-13, 1, -15, 13, 8, 12, AIR);

const ARM = OBSIDIAN, LACE = RED, TRIM = GOLD, CLOTH = GRAY;

// ===== SAMURAI =====
// feet
B(-6, 1, -3, -3, 2, 0, BLACK); B(3, 1, -3, 6, 2, 0, BLACK);
B(-6, 1, -4, -3, 1, -4, IRON); B(3, 1, -4, 6, 1, -4, IRON);

// hakama (wide split trousers, pleated)
for (let y = 3; y <= 11; y++) {
  const t = (y - 3) / 8;
  const hw = Math.round(6 - 2 * t);
  const zf = y <= 6 ? -3 : -2;
  for (let x = -hw; x <= hw; x++) {
    if (y <= 7 && x === 0) continue;
    for (let z = zf; z <= 2; z++) {
      let c = CLOTH;
      if (z === zf && Math.abs(x) % 2 === 1 && y <= 8) c = BLACK;
      S(x, y, z, c);
    }
  }
}
B(-5, 12, -2, 5, 12, 2, BLACK);

// kusazuri (armored skirt plates)
for (let y = 7; y <= 12; y++) {
  const c = y === 7 ? TRIM : ((12 - y) % 2 === 0 ? ARM : LACE);
  const f = y <= 8 ? 1 : 0;
  B(-5, y, -3 - f, -1, y, -3 - f, c);
  B(1, y, -3 - f, 5, y, -3 - f, c);
  B(-6 - f, y, -2, -6 - f, y, 2, c);
  B(6 + f, y, -2, 6 + f, y, 2, c);
  B(-5, y, 3 + f, 5, y, 3 + f, c);
}

// belt
B(-5, 13, -3, 5, 13, 3, LACE);
B(-1, 13, -4, 1, 13, -4, TRIM);

// do (cuirass)
for (let y = 14; y <= 20; y++) {
  const w = y <= 16 ? 4 : 5;
  const c = (y === 14 || y === 16) ? LACE : ARM;
  B(-w, y, -3, w, y, 2, c);
}
B(-4, 17, -4, 4, 19, -4, ARM);
B(-3, 20, -4, 3, 20, -4, ARM);
for (let y = 17; y <= 19; y++) { S(-4, y, -4, NEON_RED); S(4, y, -4, NEON_RED); }
[[-1, 17], [0, 17], [1, 17], [-1, 18], [1, 18], [-1, 19], [0, 19], [1, 19]].forEach(([x, y]) => S(x, y, -4, TRIM));
S(0, 18, -4, NEON_RED);
// agemaki knot on back
[[0, 17], [-1, 16], [1, 16], [-1, 18], [1, 18]].forEach(([x, y]) => S(x, y, 3, LACE));

// upper arms
const RS = [6, 19, 0], LS = [-6, 19, 0];
const RE = [7, 13, -4], LE = [-6, 12, -4];
tube(RS, RE, 1.2, BLACK);
tube(LS, LE, 1.2, BLACK);

// collar + shoulder tops
B(-3, 21, -3, 3, 21, 2, BLACK);
B(-6, 21, -2, -4, 21, 2, ARM); B(4, 21, -2, 6, 21, 2, ARM);

// head
B(-2, 22, -2, 2, 25, 2, BLACK);
B(-2, 22, -3, 2, 23, -3, IRON);          // mempo mask
S(-1, 22, -3, BLACK); S(1, 22, -3, BLACK);
S(0, 23, -4, IRON);
S(-2, 24, -3, NEON_RED); S(-1, 24, -3, NEON_RED); S(0, 24, -3, BLACK);
S(1, 24, -3, NEON_RED); S(2, 24, -3, NEON_RED);
B(-2, 21, -4, 2, 21, -4, LACE);           // throat guard
S(-2, 21, -4, TRIM); S(2, 21, -4, TRIM);

// kabuto bowl
for (let x = -4; x <= 4; x++)
  for (let y = 25; y <= 29; y++)
    for (let z = -4; z <= 4; z++) {
      const dx = x / 3.6, dy = (y - 25) / 3.4, dz = (z - 0.3) / 3.6;
      if (dx * dx + dy * dy + dz * dz <= 1) S(x, y, z, x === 0 ? IRON : ARM);
    }
S(0, 29, 0, TRIM);
B(-3, 25, -4, 3, 25, -4, TRIM);           // brim

// shikoro (flared neck guard)
for (let y = 20; y <= 24; y++) {
  const r = 3.6 + (24 - y) * 0.6;
  const c = y === 20 ? TRIM : ((24 - y) % 2 === 0 ? ARM : LACE);
  for (let x = -7; x <= 7; x++)
    for (let z = -2; z <= 7; z++) {
      const d = Math.hypot(x, z - 0.3);
      if (d <= r && d > r - 1.3) S(x, y, z, c);
    }
}
// fukigaeshi (wing flaps)
for (const s of [-1, 1]) {
  B(3 * s, 23, -3, 4 * s, 25, -3, ARM);
  B(5 * s, 23, -3, 5 * s, 25, -3, TRIM);
}
// kuwagata crest
B(-1, 26, -4, 1, 26, -4, TRIM);
S(0, 27, -4, NEON_RED);
for (const s of [-1, 1]) {
  L([1 * s, 26, -4], [3 * s, 28, -4], TRIM);
  L([3 * s, 28, -4], [4 * s, 30, -4], TRIM);
  L([4 * s, 30, -4], [4 * s, 32, -4], TRIM);
  L([4 * s, 32, -4], [3 * s, 33, -4], TRIM);
}
// cyber antenna
L([3, 26, 1], [6, 29, 2], IRON);
S(6, 30, 2, NEON_RED);

// sode (big shoulder plates)
for (let y = 14; y <= 21; y++) {
  const xo = y >= 18 ? 6 : 7;
  const c = (y === 21 || y === 14) ? TRIM : ((21 - y) % 3 === 0 ? LACE : ARM);
  B(xo, y, -3, xo + 1, y, 2, c);
  B(-xo - 1, y, -3, -xo, y, 2, c);
}

// katana geometry
const P0 = [-1, 10, -6];
const U = [0.5145, 0.8575, 0];
const N = [-0.8575, 0.5145, 0];
const at = (s, off) => [P0[0] + U[0] * s + N[0] * off, P0[1] + U[1] * s + N[1] * off, -6];
const LH = at(1.6, 0), RH = at(3.8, 0);

// forearms: right = cybernetic steel, left = black kote
tube(RE, RH, 1.0, IRON);
tube(LE, LH, 1.0, BLACK);
S(4, 14, -5, NEON_BLUE); S(5, 14, -5, NEON_BLUE);
S(-3, 13, -5, TRIM);

// tsuka (wrapped grip)
for (let s = 0; s <= 5; s += 0.5) { const p = at(s, 0); S(p[0], p[1], p[2], Math.floor(s) % 2 ? LACE : BLACK); }
ball(LH[0], LH[1], LH[2], 1.1, BLACK);
ball(RH[0], RH[1], RH[2], 1.1, BLACK);
{ const p = at(0, 0); S(p[0], p[1], p[2], TRIM); }
// tsuba
{
  const c = at(5.3, 0);
  for (let a = -2; a <= 2; a++)
    for (let b = -2; b <= 2; b++)
      if (a * a + b * b <= 4.5) S(c[0] + N[0] * a, c[1] + N[1] * a, -6 + b, TRIM);
}
// neon blade
const BL0 = 5.8, BLEN = 19;
const curve = t => -1.3 * t * t;
for (let i = 0; i <= BLEN * 3; i++) {
  const t = i / (BLEN * 3), s = BL0 + BLEN * t;
  const c = s < 6.4 ? TRIM : NEON_BLUE;
  const p = at(s, curve(t));
  S(p[0], p[1], p[2], c);
  if (t < 0.88) { const q = at(s, curve(t) + 1); S(q[0], q[1], q[2], c); }
}

// empty saya on left hip
L([-7, 11, -2], [-9, 9, 7], BLACK);
S(-7, 11, -2, TRIM); S(-9, 9, 7, TRIM);

// sashimono banner on back
B(-3, 16, 3, -3, 16, 5, BLACK);
L([-3, 14, 6], [-3, 31, 6], BLACK);
L([-3, 31, 6], [-10, 31, 6], BLACK);
for (let x = -9; x <= -4; x++) {
  const bottom = 20 + (((x * 7) % 3 === 0) ? 1 : 0);
  for (let y = bottom; y <= 30; y++) {
    const d = Math.hypot(x + 6.5, y - 26);
    let c = BLACK;
    if (d > 1.2 && d < 2.4) c = NEON_RED;
    else if (d <= 1.2) c = LACE;
    S(x, y, 6, c);
  }
}
S(-7, 22, 6, LACE); S(-6, 22, 6, LACE); S(-6, 21, 6, LACE); S(-7, 23, 6, TRIM);
S(-10, 30, 6, LACE); S(-10, 29, 6, TRIM);

// electric crackle on the blade
{
  const e1 = at(12, curve((12 - BL0) / BLEN) + 2.8);
  const e2 = at(18, curve((18 - BL0) / BLEN) - 1.8);
  const e3 = at(23, curve((23 - BL0) / BLEN) + 2.8);
  const e4 = at(26.2, -1.3);
  [e1, e2, e3, e4].forEach(p => S(p[0], p[1], p[2], ELECTRIC));
}

// ===== NEON TORII =====
B(-12, -2, 9, -11, 25, 10, RED);
B(11, -2, 9, 12, 25, 10, RED);
B(-13, 0, 8, -10, 1, 11, BLACK);
B(10, 0, 8, 13, 1, 11, BLACK);
B(-14, 21, 9, 14, 21, 10, BLACK);
B(-10, 21, 9, 10, 21, 9, NEON_RED);
B(-14, 25, 9, 14, 25, 10, RED);
B(-15, 26, 9, 15, 26, 10, BLACK);
B(-17, 27, 8, 17, 27, 10, BLACK);
B(-17, 28, 8, -16, 28, 10, BLACK);
B(16, 28, 8, 17, 28, 10, BLACK);

// ===== SLICED DRONE (foreground story) =====
ball(-8.5, 2, -6, 1.8, null, (x, y, z, dx, dy) => {
  const dot = dx + dy;
  if (dot > 0.01) return 0;
  if (dot > -0.99) return LAVA;
  return (y === 2) ? BLACK : IRON;
});
S(-9, 2, -7, NEON_RED);
ball(-4.5, 1.8, -6.5, 1.8, null, (x, y, z, dx, dy) => {
  if (y < 1) return 0;
  const dot = dx + dy;
  if (dot < -0.01) return 0;
  if (dot < 0.99) return LAVA;
  return (y === 2) ? BLACK : IRON;
});
L([-9, 1, -7], [-10, 1, -8], IRON);
L([-4, 3, -7], [-3, 4, -8], BLACK);
S(-6, 3, -6, ELECTRIC);

// ===== STONE LANTERNS =====
function lantern(x, z) {
  B(x - 1, 1, z - 1, x + 1, 1, z + 1, STONE);
  B(x, 2, z, x, 3, z, STONE);
  S(x - 1, 4, z - 1, STONE); S(x + 1, 4, z - 1, STONE);
  S(x - 1, 4, z + 1, STONE); S(x + 1, 4, z + 1, STONE);
  S(x, 4, z, GLOWSTONE);
  B(x - 2, 5, z - 2, x + 2, 5, z + 2, GRAY);
  B(x - 1, 6, z - 1, x + 1, 6, z + 1, STONE);
  S(x, 7, z, STONE);
}
lantern(-8, 5);
lantern(8, 5);

// ===== PLAZA =====
for (let x = -10; x <= 10; x++)
  for (let z = -8; z <= 8; z++) {
    const edge = x === -10 || x === 10 || z === -8 || z === 8;
    const key = x + ',0,' + z;
    if (M.has(key)) continue;
    let c = edge ? GRAY : ((x % 5 === 0 || z % 5 === 0) ? GRAY : OBSIDIAN);
    if (!edge && ((x + 31) * 7919 + (z + 47) * 104729) % 23 === 0) c = PINK;
    if (z === -8 && Math.abs(x) >= 6 && Math.abs(x) <= 9) c = NEON_BLUE;
    S(x, 0, z, c);
    if (edge) S(x, -1, z, STONE);
    if (z === -8) S(x, -2, z, STONE);
  }
B(-3, -1, -9, 3, -1, -9, GRAY);

// ===== strip hidden interior voxels =====
const SEE = new Set([GLASS, ICE, WATER, ELECTRIC, FIRE, AIR]);
const dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const rm = [];
for (const [k, id] of M) {
  if (SEE.has(id)) continue;
  const [x, y, z] = k.split(',').map(Number);
  let enclosed = true;
  for (const [dx, dy, dz] of dirs) {
    const nb = M.get((x + dx) + ',' + (y + dy) + ',' + (z + dz));
    if (nb === undefined || SEE.has(nb)) { enclosed = false; break; }
  }
  if (enclosed) rm.push(k);
}
rm.forEach(k => M.delete(k));

// ===== emit =====
let count = 0;
for (const [k, id] of M) {
  if (count >= 3990) break;
  const p = k.split(',').map(Number);
  block(p[0], p[1], p[2], id);
  count++;
}