// frost-giant-opus — prompt:
// a frost giant wielding an ice axe...

const GX = -3;
const P = new Map();
const LIM = 3990;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (id == null || x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (!P.has(k) && P.size >= LIM) return;
  P.set(k, [x, y, z, id]);
}
function putE(x, y, z, id) {
  const k = Math.round(x) + ',' + Math.round(y) + ',' + Math.round(z);
  if (!P.has(k)) put(x, y, z, id);
}
function H(x, y, z) {
  let h = Math.imul(x | 0, 73856093) ^ Math.imul(y | 0, 19349663) ^ Math.imul(z | 0, 83492791);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) % 1000;
}
function shape(x1, y1, z1, x2, y2, z2, t, col) {
  for (let x = Math.floor(x1); x <= Math.ceil(x2); x++)
    for (let y = Math.floor(y1); y <= Math.ceil(y2); y++)
      for (let z = Math.floor(z1); z <= Math.ceil(z2); z++) {
        if (!t(x, y, z)) continue;
        if (t(x + 1, y, z) && t(x - 1, y, z) && t(x, y + 1, z) && t(x, y - 1, z) && t(x, y, z + 1) && t(x, y, z - 1)) continue;
        put(x, y, z, typeof col === 'function' ? col(x, y, z) : col);
      }
}
function ell(cx, cy, cz, rx, ry, rz, col, clip) {
  const t = (x, y, z) => {
    const a = (x - cx) / rx, b = (y - cy) / ry, c = (z - cz) / rz;
    return a * a + b * b + c * c <= 1 && (!clip || clip(x, y, z));
  };
  shape(cx - rx, cy - ry, cz - rz, cx + rx, cy + ry, cz + rz, t, col);
}
function cap(a, b, r1, r2, col) {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const L2 = dx * dx + dy * dy + dz * dz || 1;
  const U = (x, y, z) => Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy + (z - a[2]) * dz) / L2));
  const t = (x, y, z) => {
    const u = U(x, y, z);
    const px = a[0] + dx * u - x, py = a[1] + dy * u - y, pz = a[2] + dz * u - z;
    const r = r1 + (r2 - r1) * u;
    return px * px + py * py + pz * pz <= r * r;
  };
  const R = Math.max(r1, r2) + 1;
  shape(Math.min(a[0], b[0]) - R, Math.min(a[1], b[1]) - R, Math.min(a[2], b[2]) - R,
        Math.max(a[0], b[0]) + R, Math.max(a[1], b[1]) + R, Math.max(a[2], b[2]) + R,
        t, typeof col === 'function' ? (x, y, z) => col(x, y, z, U(x, y, z)) : col);
}
function ring(cx, cz, y1, y2, rxf, rzf, th, col) {
  for (let y = y1; y <= y2; y++) {
    const rx = rxf(y), rz = rzf(y);
    for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++)
      for (let z = Math.floor(cz - rz - 1); z <= Math.ceil(cz + rz + 1); z++) {
        const a = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
        const b = ((x - cx) / (rx - th)) ** 2 + ((z - cz) / (rz - th)) ** 2;
        if (a <= 1 && b > 1) put(x, y, z, typeof col === 'function' ? col(x, y, z) : col);
      }
  }
}
const SK = (x, y, z) => H(x, y, z) < 45 ? WHITE : LIGHT_BLUE;
const HAIR = (x, y, z) => H(x, y, z) < 280 ? LIGHT_GRAY : WHITE;
const PELT = (x, y, z) => { const h = H(x, y, z); return h < 220 ? BROWN : h < 600 ? GRAY : LIGHT_GRAY; };

// clear trees around the giant and in front of the camera
cube(-19, 1, -12, 15, 12, 12, AIR);
cube(-19, 2, -22, 15, 12, -13, AIR);

// ===== LEGS & BOOTS =====
for (const lx of [GX - 5, GX + 5]) {
  cap([lx, 10, 3], [lx, 4, 2.5], 2.6, 2.3, (x, y, z) => y % 3 === 0 ? LIGHT_GRAY : BROWN);
  ell(lx, 7, 0.2, 1.7, 1.5, 1.1, (x, y, z) => (y === 7 && x === lx) ? GOLD : IRON);
  shape(lx - 3, 1, -3, lx + 3, 3, 4,
    (x, y, z) => Math.abs(x - lx) <= 3 && y >= 1 && y <= 3 && z >= -3 && z <= 4 &&
      !(Math.abs(x - lx) === 3 && (z === -3 || z === 4)) && !(y === 3 && z <= -2 && Math.abs(x - lx) >= 2),
    (x, y, z) => y === 1 ? GRAY : z <= -2 ? GRAY : (z === 0 && y >= 2) ? IRON : BROWN);
  ell(lx, 4.2, 2, 3.3, 1.3, 3.3, (x, y, z) => H(x, y, z) < 350 ? WHITE : LIGHT_GRAY);
}

// ===== PELT SKIRT =====
const skRx = y => 7.6 + (13 - y) * 0.35, skRz = y => 5.1 + (13 - y) * 0.25;
ring(GX, 3, 9, 13, skRx, skRz, 1.2, PELT);
{
  const rx = skRx(9), rz = skRz(9);
  for (let x = Math.floor(GX - rx - 1); x <= Math.ceil(GX + rx + 1); x++)
    for (let z = -4; z <= 10; z++) {
      const a = ((x - GX) / rx) ** 2 + ((z - 3) / rz) ** 2;
      const b = ((x - GX) / (rx - 1.2)) ** 2 + ((z - 3) / (rz - 1.2)) ** 2;
      if (a <= 1 && b > 1 && H(x, 8, z) < 420) put(x, 8, z, H(x, 7, z) < 500 ? WHITE : LIGHT_GRAY);
    }
}
// loincloth panel
shape(GX - 2, 7, -4, GX + 2, 12, -4, (x, y, z) => x >= GX - 2 && x <= GX + 2 && y >= 7 && y <= 12 && z === -4 && !(y === 7 && Math.abs(x - GX) === 2),
  (x, y, z) => y === 7 ? WHITE : (y === 10 && Math.abs(x - GX) <= 1) ? IRON : (H(x, y, z) < 300 ? GRAY : BROWN));

// ===== BELT =====
ring(GX, 3, 13, 15, () => 7.8, () => 5.2, 1.2, (x, y, z) => (y === 14 && H(x, y, z) < 160) ? IRON : BROWN);
for (let x = GX - 2; x <= GX + 2; x++) for (let y = 13; y <= 15; y++) put(x, y, -3, GOLD);
put(GX, 14, -4, NEON_BLUE);

// ===== TORSO =====
const trx = y => y <= 17 ? 7 : y <= 19 ? 7.6 : y <= 24 ? 8.2 : y === 25 ? 7.2 : 5.5;
const trz = y => y <= 17 ? 4.6 : y <= 24 ? 4.9 : 4.3;
const torsoCol = (x, y, z) => {
  const a = Math.abs(x - GX);
  if (z <= 1) {
    if ((a === 5 && y >= 15 && y <= 18) || (y === 18 && a >= 4 && a <= 6) || (y === 16 && (a === 4 || a === 6))) return BLUE;
  }
  return SK(x, y, z);
};
shape(GX - 9, 13, -3, GX + 9, 26, 9,
  (x, y, z) => y >= 13 && y <= 26 && ((x - GX) / trx(y)) ** 2 + ((z - 3) / trz(y)) ** 2 <= 1, torsoCol);
ell(GX - 3.3, 21.5, -0.5, 3, 2.3, 1.5, torsoCol);
ell(GX + 3.3, 21.5, -0.5, 3, 2.3, 1.5, torsoCol);
ell(GX, 16.5, -0.6, 3.5, 2.8, 1.4, torsoCol);

// ===== FUR MANTLE =====
const mRx = [9.3, 9, 8.5, 7.6, 6.2], mRz = [6.1, 5.9, 5.6, 5, 4.4];
ring(GX, 3.3, 22, 26, y => mRx[y - 22], y => mRz[y - 22], 1.8, (x, y, z) => H(x, y, z) < 300 ? GRAY : LIGHT_GRAY);

// ===== HEAD =====
ell(GX, 28.5, 2.5, 3.8, 3.8, 3.6, SK);
shape(GX - 3, 25, -1, GX + 3, 31, 1, (x, y, z) => x >= GX - 3 && x <= GX + 3 && y >= 25 && y <= 31 && z >= -1 && z <= 1, SK);
for (const s of [-1, 1]) { put(GX + 4 * s, 28, 2, LIGHT_BLUE); put(GX + 5 * s, 29, 2, LIGHT_BLUE); put(GX + 4 * s, 29, 2, LIGHT_BLUE); }
// hair
ell(GX, 28, 5, 4.5, 5, 3.2, HAIR, (x, y, z) => z >= 4);
for (const s of [-1, 1]) cap([GX + 2.5 * s, 24, 7], [GX + 3 * s, 14, 8.5], 1, 0.8, HAIR);
// helmet
ell(GX, 29.5, 2.5, 4.4, 3.6, 4.2, (x, y, z) => (y === 30 || x === GX) ? GOLD : IRON, (x, y, z) => y >= 30);
put(GX, 30, -2, IRON); put(GX, 29, -2, IRON);
// horns
for (const s of [-1, 1]) {
  cap([GX + 4 * s, 30.5, 2.5], [GX + 7.5 * s, 31, 1.5], 1.1, 0.8, WHITE);
  cap([GX + 7.5 * s, 31, 1.5], [GX + 8.5 * s, 33, 0.5], 0.8, 0.6, ICE);
}
// front braids
for (const s of [-1, 1]) {
  cap([GX + 4.3 * s, 27, 0.5], [GX + 5 * s, 20, -1.8], 0.9, 0.8, HAIR);
  put(GX + 5 * s, 20, -2, IRON); put(GX + 5 * s, 19, -2, IRON);
  put(GX + 5 * s, 18, -2, WHITE);
}

// ===== BEARD =====
for (let y = 16; y <= 26; y++) {
  const hw = y < 18 ? (y - 15) * 0.6 : 1 + (y - 17) * 0.35;
  const zf = y >= 22 ? -2 : -3;
  for (let lx = -5; lx <= 5; lx++) {
    if (Math.abs(lx) > hw) continue;
    const c = H(GX + lx, y, zf) < 300 ? LIGHT_GRAY : WHITE;
    put(GX + lx, y, zf, c);
    if (Math.abs(lx) <= hw - 1 && y <= 25) put(GX + lx, y, zf - 1, H(GX + lx, y, zf - 1) < 250 ? LIGHT_GRAY : WHITE);
    if (y < 22) put(GX + lx, y, -2, c);
  }
  if (y >= 23) for (const s of [-1, 1]) { put(GX + 4 * s, y, -1, HAIR(GX + 4 * s, y, -1)); put(GX + 4 * s, y, 0, WHITE); }
}
put(GX, 15, -3, ICE); put(GX, 14, -3, ICE); put(GX - 1, 16, -3, ICE); put(GX + 1, 17, -4, IRON);

// ===== FACE =====
put(GX - 2, 28, -1, NEON_BLUE); put(GX + 2, 28, -1, NEON_BLUE);
put(GX - 2, 28, -2, AIR); put(GX + 2, 28, -2, AIR);
for (const s of [-1, 1]) {
  put(GX + 3 * s, 30, -2, WHITE); put(GX + 2 * s, 29, -2, WHITE); put(GX + 1 * s, 29, -2, WHITE);
}
put(GX, 28, -2, LIGHT_BLUE); put(GX, 27, -2, LIGHT_BLUE); put(GX, 27, -3, LIGHT_BLUE);
for (let lx = -3; lx <= 3; lx++) put(GX + lx, 26, -2, WHITE);
for (const s of [-1, 1]) { put(GX + 3 * s, 25, -3, WHITE); put(GX + 4 * s, 24, -3, WHITE); put(GX + 4 * s, 23, -3, LIGHT_GRAY); }
put(GX - 1, 25, -3, BLACK); put(GX, 25, -3, BLACK); put(GX + 1, 25, -3, BLACK);
put(GX - 1, 24, -4, WHITE); put(GX + 1, 24, -4, WHITE);

// ===== RIGHT ARM (+X) holding the ice axe =====
cap([GX + 9, 22.5, 3], [9.5, 16.5, 2], 2.6, 2.2, SK);
cap([9.5, 16.5, 2], [12, 21, -0.5], 2.2, 1.9, (x, y, z, u) => u > 0.45 ? (u < 0.58 ? GOLD : IRON) : SK(x, y, z));
// haft
cap([9, 11.5, -1], [14.8, 32, -1], 0.75, 0.75, (x, y, z) => y % 4 === 0 ? IRON : (H(x, y, z) < 300 ? BROWN : OAK_LOG));
ell(8.8, 11, -1, 1.3, 1.3, 1.3, IRON);
put(8.6, 9.5, -1, ICE);
// fist
ell(12.3, 22, -1, 2.1, 2, 2, SK);
for (let y = 21; y <= 23; y++) put(12, y, -3, LIGHT_BLUE);
// axe head
shape(13, 28, -2, 16, 32, 0, (x, y, z) => x >= 13 && x <= 16 && y >= 28 && y <= 32 && z >= -2 && z <= 0,
  (x, y, z) => y === 30 ? GOLD : IRON);
for (let x = 17; x <= 22; x++) {
  const h = 1.5 + (x - 16) * 0.7;
  const lo = Math.ceil(29.5 - h), hi = Math.floor(29.5 + h);
  for (let y = lo; y <= hi; y++) {
    const edgeTB = y <= lo || y >= hi;
    const zs = x <= 18 ? [-2, -1, 0] : [-1];
    for (const z of zs) {
      let id;
      if (x === 22) id = (y >= 26 && y <= 32 && y % 2 === 0) ? NEON_BLUE : CYAN;
      else if (edgeTB) id = LIGHT_BLUE;
      else id = H(x, y, z) < 170 ? WHITE : ICE;
      put(x, y, z, id);
    }
  }
}
put(19, 29, -2, WHITE); put(20, 29, -2, WHITE); put(20, 30, -2, WHITE); put(20, 28, -2, WHITE); put(21, 29, -2, WHITE);
for (let x = 10; x <= 12; x++) {
  const half = (x - 10) * 0.6;
  for (let y = Math.round(30 - half); y <= Math.round(30 + half); y++) {
    put(x, y, -1, IRON);
    if (x === 12) { put(x, y, -2, IRON); put(x, y, 0, IRON); }
  }
}
cap([14.6, 32, -1], [15, 33, -1], 0.8, 0.6, ICE);
put(19, 25, -1, ICE); put(19, 24, -1, ICE);
put(21, 24, -1, ICE); put(21, 23, -1, ICE); put(21, 22, -1, ICE);
put(17, 27, -1, ICE); put(17, 26, -1, ICE);
put(20, 25, -1, ICE);

// ===== LEFT ARM (-X) with frost shard =====
cap([GX - 9, 22.5, 3], [-14.5, 16, 3.5], 2.6, 2.2, (x, y, z, u) =>
  (u > 0.15 && u < 0.28) ? GOLD : (u > 0.4 && u < 0.8 && y % 2 === 0 && z <= 3) ? BLUE : SK(x, y, z));
cap([-14.5, 16, 3.5], [-14, 11, 1.5], 2.2, 1.9, (x, y, z, u) => u > 0.4 ? (u < 0.52 ? GOLD : IRON) : SK(x, y, z));
ell(-14, 10, 1, 2.2, 2.2, 2.2, SK);
cap([-14, 8, 0], [-15, 4, -1.5], 0.9, 0.6, ICE);
cap([-15.5, 9, 0], [-18.5, 7, -1.5], 0.8, 0.6, ICE);
cap([-13, 8.5, -1], [-12, 5.5, -3], 0.7, 0.6, LIGHT_BLUE);
put(-15, 6, -1, NEON_BLUE);

// ===== PAULDRONS =====
for (const s of [-1, 1]) {
  const px = GX + 9 * s;
  ell(px, 23.5, 3, 3.3, 2.8, 3.3, (x, y, z) => y === 22 ? GOLD : IRON, (x, y, z) => y >= 22);
  cap([px, 26, 3], [px + 0.5 * s, 29, 3], 0.9, 0.6, ICE);
  cap([px + 2 * s, 25, 2], [px + 4 * s, 27, 1.5], 0.8, 0.6, ICE);
  put(px - 1 * s, 26, 1, ICE);
}

// ===== FROST MIST =====
put(-14, 1, -5, STEAM); put(6, 1, -5, STEAM); put(-3, 1, -7, STEAM); put(19, 22, -2, STEAM);

// ===== GROUND CRYSTALS =====
function crystal(x, z, h, lx, lz) {
  cap([x, 0, z], [x + lx, h, z + lz], 1.0, 0.6, (X, Y, Z) => Y <= 1 ? LIGHT_BLUE : ICE);
}
crystal(8, -7, 5, 1, -1); crystal(10, -6, 3, 2, 0); crystal(7, -9, 2, 0, -1);
crystal(-15, -6, 4, -1, -1); crystal(-13, -8, 2, 0, -1);
crystal(-17, 6, 3, -1, 0); crystal(12, 7, 3, 1, 1); crystal(-6, -10, 2, -1, -1);

// ===== SNOW GROUND =====
for (let x = GX + 1 - 10; x <= GX + 1 + 10; x++)
  for (let z = 2 - 10; z <= 2 + 10; z++) {
    const d = (x - GX - 1) ** 2 + (z - 2) ** 2;
    if (d <= 100) putE(x, 0, z, H(x, 0, z) < 130 ? ICE : SNOW);
  }
for (let x = GX + 1 - 9; x <= GX + 1 + 9; x++)
  for (let z = 2 - 9; z <= 2 + 9; z++) {
    const d = (x - GX - 1) ** 2 + (z - 2) ** 2;
    if (d <= 81) putE(x, -1, z, SNOW);
  }

for (const [x, y, z, id] of P.values()) block(x, y, z, id);