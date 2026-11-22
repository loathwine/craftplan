// frost-giant-fable — prompt:
// a frost giant wielding an ice axe...

const SKIN = LIGHT_BLUE, PAINT = BLUE, FUR = WHITE, HIDE = BROWN, METAL = IRON;
const M = new Map();
const LP = new Map();
let tag = 0;
const K = (x, y, z) => x + '|' + y + '|' + z;
function put(x, y, z, id) {
  x = Math.round(x) + 0; y = Math.round(y) + 0; z = Math.round(z) + 0;
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = K(x, y, z);
  M.set(k, [x, y, z, id]);
  if (tag > 0) LP.set(k, tag); else LP.delete(k);
}
function has(x, y, z) { return M.has(K(x, y, z)); }
function idAt(x, y, z) { const v = M.get(K(x, y, z)); return v ? v[3] : null; }
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) put(x, y, z, id);
}
function ell(cx, cy, cz, rx, ry, rz, id, pred) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const a = (x - cx) / rx, b = (y - cy) / ry, c = (z - cz) / rz;
        if (a * a + b * b + c * c <= 1 && (!pred || pred(x, y, z))) put(x, y, z, id);
      }
}
function cap(ax, ay, az, bx, by, bz, ra, rb, id, minY) {
  const R = Math.max(ra, rb);
  const dx = bx - ax, dy = by - ay, dz = bz - az, L2 = dx * dx + dy * dy + dz * dz || 1;
  for (let x = Math.floor(Math.min(ax, bx) - R); x <= Math.ceil(Math.max(ax, bx) + R); x++)
    for (let y = Math.floor(Math.min(ay, by) - R); y <= Math.ceil(Math.max(ay, by) + R); y++) {
      if (minY !== undefined && y < minY) continue;
      for (let z = Math.floor(Math.min(az, bz) - R); z <= Math.ceil(Math.max(az, bz) + R); z++) {
        let t = ((x - ax) * dx + (y - ay) * dy + (z - az) * dz) / L2;
        t = Math.max(0, Math.min(1, t));
        const px = ax + dx * t, py = ay + dy * t, pz = az + dz * t;
        const d2 = (x - px) * (x - px) + (y - py) * (y - py) + (z - pz) * (z - pz);
        const r = ra + (rb - ra) * t;
        if (d2 <= r * r) put(x, y, z, id);
      }
    }
}
function frontZ(x, y) { for (let z = -9; z <= 3; z++) if (has(x, y, z)) return z; return null; }
function paintFront(x, y, id, onlySkin) {
  const f = frontZ(x, y);
  if (f === null) return;
  if (onlySkin && idAt(x, y, f) !== SKIN) return;
  put(x, y, f, id);
}
function rnd(x, z) { return (((x * 73856093) ^ (z * 19349663)) >>> 0) % 1000 / 1000; }
function spike(ax, ay, az, bx, by, bz, id1, id2) {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(bx - ax), Math.abs(by - ay), Math.abs(bz - az))));
  for (let i = 0; i <= n; i++) { const t = i / n; put(ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t, t > 0.45 ? id2 : id1); }
}

// approximate terrain top height, read off the surveyed local geometry
function gh(x, z) {
  if (x <= -10 && z <= 5) return 0;
  if (x >= -9 && x <= -8 && z <= -6) return 0;
  if (x === -9 && z <= 5) return 0;
  if (x === -8 && z >= 0 && z <= 4) return 0;
  if (x === -7 && (z === 2 || z === 3)) return 0;
  if ((x === -7 || x === -6) && z <= -10) return 0;
  if (x === -5 && z <= -11) return 0;
  if (x === -4 && z <= -12) return 0;
  if (x === -3 && z <= -13) return 0;
  if (x === -2 && z <= -14) return 0;
  if ((x === -1 || x === 0) && z <= -15) return 0;
  if (x === 8 && z <= -12) return 0;
  if (x >= 9 && x <= 11 && z <= -10) return 0;
  if (x === 10 && z <= -6) return 0;
  if (x === 11 && z <= -3) return 0;
  if (x === 12 && z <= -1) return 0;
  if (x >= 13 && z <= 0) return 0;
  if ((x >= 5 && x <= 9 && z >= 6) || (x >= 10 && z >= 7)) return -2;
  return -1;
}

// ================= LEGS =================
function leg(c, zc) {
  cap(c * 0.8, 12.5, 0, c, 8.5, zc, 3.0, 2.6, SKIN);       // thigh
  cap(c, 8.5, zc, c, 4, zc, 2.6, 2.3, SKIN);               // shin
  ell(c, 8.5, zc - 2.6, 1.9, 1.9, 1.1, METAL);             // knee guard
  put(c, 9, zc - 4, METAL);
  put(c, 8, zc - 4, GOLD);
  box(c - 2, 0, zc - 4, c + 2, 1, zc + 2, HIDE);           // boot foot
  box(c - 2, 2, zc - 2, c + 2, 4, zc + 2, HIDE);           // boot shaft
  box(c - 2, 0, zc - 4, c + 2, 0, zc - 4, METAL);          // toe cap
  box(c - 1, 1, zc - 4, c + 1, 1, zc - 4, METAL);
  for (let x = c - 2; x <= c + 2; x++) for (let z = zc - 2; z <= zc + 2; z++) {
    if (x === c - 2 || x === c + 2 || z === zc - 2 || z === zc + 2) put(x, 3, z, OAK_LOG); // strap
  }
  put(c, 3, zc - 2, GOLD);
  ell(c, 5, zc, 3.4, 0.7, 3.4, FUR);                       // fur cuff
  for (let x = c - 3; x <= c + 3; x++) for (let z = zc - 3; z <= zc + 3; z++) {
    const d = Math.hypot(x - c, z - zc);
    if (d > 2.5 && d <= 3.4 && rnd(x + 50, z + 9) > 0.5) put(x, 6, z, FUR);
  }
}
leg(-5, 1);
leg(5, -1);

// ================= PELVIS / TORSO =================
ell(0, 12.5, 0, 6.6, 2.4, 3.8, SKIN);
ell(0, 12, 0, 7.4, 1.6, 4.6, FUR);                          // fur kilt
for (let x = -7; x <= 7; x++) for (let z = -4; z <= 4; z++) {
  const v = (x / 7.4) * (x / 7.4) + (z / 4.6) * (z / 4.6);
  if (v <= 1 && v > 0.5 && rnd(x + 31, z + 17) > 0.45) put(x, 10, z, FUR);
}
const PROF = [[14, 5.6, 3.6], [16, 5.5, 3.5], [18, 6.4, 3.9], [20, 7.6, 4.4], [21, 8.0, 4.5], [22, 7.8, 4.3], [23, 6.6, 3.9], [24, 4.5, 3.3]];
function prof(y) {
  for (let i = 0; i < PROF.length - 1; i++) {
    const a = PROF[i], b = PROF[i + 1];
    if (y >= a[0] && y <= b[0]) { const t = (y - a[0]) / (b[0] - a[0]); return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  }
  return [PROF[0][1], PROF[0][2]];
}
for (let y = 14; y <= 24; y++) {
  const pr = prof(y), rx = pr[0], rz = pr[1];
  for (let x = -9; x <= 9; x++) for (let z = -5; z <= 5; z++)
    if ((x / rx) * (x / rx) + (z / rz) * (z / rz) <= 1) put(x, y, z, SKIN);
}
// belt
for (let x = -7; x <= 7; x++) for (let z = -5; z <= 5; z++)
  if ((x / 6.5) * (x / 6.5) + (z / 4.5) * (z / 4.5) <= 1) put(x, 14, z, HIDE);
for (const bx of [-5, -3, 3, 5]) paintFront(bx, 14, GOLD, false);
// chest strap (left shoulder -> right hip) + war paint
for (let i = 0; i <= 28; i++) {
  const t = i / 28, x = Math.round(-6 + 11 * t), y = Math.round(22 - 7 * t);
  paintFront(x, y, HIDE, true); paintFront(x + 1, y, HIDE, true);
}
paintFront(3, 16, GOLD, false);
paintFront(-4, 21, GOLD, false);
for (let ax = 2; ax <= 5; ax++) { paintFront(ax, 19, PAINT, true); paintFront(-ax, 19, PAINT, true); }
for (const sx of [-1, 1]) { paintFront(sx * 4, 17, PAINT, true); paintFront(sx * 4, 16, PAINT, true); paintFront(sx * 3, 15, PAINT, true); }
// loincloth flap
box(-3, 8, -5, 3, 13, -5, HIDE);
for (let x = -3; x <= 3; x++) { put(x, 7, -5, FUR); if (x % 2 === 0) put(x, 6, -5, FUR); }
put(0, 11, -5, PAINT); put(-1, 10, -5, PAINT); put(1, 10, -5, PAINT); put(0, 9, -5, PAINT); put(0, 10, -5, GOLD);
// skull buckle
box(-1, 13, -5, 1, 15, -5, MARBLE);
put(-1, 14, -5, BLACK); put(1, 14, -5, BLACK); put(0, 13, -5, BLACK);

// fur collar across the shoulders
ell(0, 23.8, 0.3, 7.2, 1.3, 4.4, FUR);

// ================= ARMS =================
// left arm (west) hanging, clenched fist
ell(-9, 21.5, 0, 3.2, 3.2, 3.2, SKIN);
cap(-9.5, 21, 0, -11.5, 15, 1, 2.6, 2.2, SKIN);
cap(-11.5, 15, 1, -11.5, 10, -2, 2.2, 2.0, SKIN);
for (let y = 11; y <= 14; y++) {                              // iron bracer, gold rims
  const zc = 1 - 3 * (15 - y) / 5;
  for (let x = -15; x <= -8; x++) for (let z = -5; z <= 5; z++)
    if (Math.hypot(x + 11.5, z - zc) <= 2.6) put(x, y, z, (y === 14 || y === 11) ? GOLD : METAL);
}
ell(-11.5, 8.2, -2.7, 2.4, 2.3, 2.4, SKIN);                   // fist
// right arm (east) reaching forward to grip the axe
ell(9, 21.5, 0, 3.2, 3.2, 3.2, SKIN);
cap(9.5, 21, 0, 13, 16, 0.5, 2.6, 2.2, SKIN);
cap(13, 16, 0.5, 13.5, 17.6, -4.6, 2.2, 2.0, SKIN);
for (const v of Array.from(M.values())) {                     // leather forearm wrap
  if (v[3] === SKIN && v[0] >= 11 && v[1] >= 14 && v[2] <= -1 && v[2] >= -3) put(v[0], v[1], v[2], HIDE);
}
// war paint bands on upper arms
for (const v of Array.from(M.values())) {
  if (v[3] !== SKIN) continue;
  if (v[0] <= -8 && (v[1] === 19 || v[1] === 17)) put(v[0], v[1], v[2], PAINT);
  const s = v[0] + 1.43 * (21 - v[1]);
  if (v[0] >= 9 && s >= 14 && s < 15.6 && v[1] >= 15 && v[1] <= 23 && v[2] > -2) put(v[0], v[1], v[2], PAINT);
}
// left pauldron: iron dome with gold rim and ice spikes
ell(-9.5, 23, 0, 4.2, 3.2, 4.2, METAL, (x, y, z) => y >= 23);
ell(-9.5, 23, 0, 4.6, 0.5, 4.6, GOLD, (x, y, z) => x < -6);
ell(-9.5, 23, 0, 3.6, 0.5, 3.6, METAL, (x, y, z) => x < -6);
spike(-11, 26, 0, -14, 30, 0, LIGHT_BLUE, ICE);
spike(-10, 26, 0, -13, 30, 0, LIGHT_BLUE, ICE);
spike(-12, 25, -2, -15, 27, -4, LIGHT_BLUE, ICE);
spike(-12, 25, 2, -15, 27, 4, LIGHT_BLUE, ICE);
spike(-9, 26, -2, -9, 28, -3, LIGHT_BLUE, ICE);
// right shoulder: fur mantle
ell(9.2, 23.4, 0, 3.8, 1.9, 4.0, FUR, (x, y, z) => y >= 23);

// ================= CAPE =================
tag = 50;
for (let y = 9; y <= 23; y++) {
  const w = Math.round(5.5 + (23 - y) * 0.08);
  for (let x = -w; x <= w; x++) {
    const bottom = 9 + (Math.abs(x * 7 + 3) % 4);
    if (y < bottom) continue;
    const z = Math.round(5.2 + (23 - y) * 0.09 + 0.45 * Math.sin(x * 0.9 + y * 0.15));
    let id = BLUE;
    if (y >= 22) id = FUR;
    else if (y <= bottom + 1) id = SNOW;
    else if ((x + 100) % 4 === 0 && y % 3 !== 0) id = PURPLE;
    put(x, y, z, id);
  }
}
tag = 0;

// ================= HEAD =================
cap(0, 23, 0, 0, 25, -0.3, 2.6, 2.5, SKIN);
ell(0, 27.5, -0.5, 3.7, 3.7, 3.7, SKIN);
// long white hair
ell(0, 26.5, 1.2, 4.4, 4.6, 3.6, FUR, (x, y, z) => z >= 1 && y <= 28 && !has(x, y, z));
for (let y = 18; y <= 22; y++) for (let x = -2; x <= 2; x++) {
  if (y === 18 && x % 2 !== 0) continue;
  for (let z = 4; z <= 7; z++) if (has(x, y, z) && !has(x, y, z + 1)) { put(x, y, z, FUR); break; }
}
// iron helm with gold band
for (const v of Array.from(M.values())) {
  if (v[3] === SKIN && v[1] >= 29 && Math.abs(v[0]) <= 4) put(v[0], v[1], v[2], v[1] === 29 ? GOLD : METAL);
}
for (let x = -3; x <= 3; x++) { const f = frontZ(x, 29); if (f !== null) put(x, 29, f - 1, METAL); }
for (let x = -1; x <= 1; x++) put(x, 29, -5, METAL);
put(0, 28, -5, METAL); put(0, 27, -5, METAL); put(0, 30, -4, GOLD); put(0, 31, -3, GOLD);
put(0, 32, -2, METAL); put(0, 32, -1, METAL); put(0, 32, 0, METAL);
// glowing eyes
for (const sx of [-1, 1]) for (const ex of [1, 2]) paintFront(sx * ex, 28, NEON_BLUE, false);
paintFront(-3, 27, PAINT, true); paintFront(3, 27, PAINT, true);
paintFront(-2, 27, PAINT, true); paintFront(2, 27, PAINT, true);
// mouth, mustache, beard
for (let x = -1; x <= 1; x++) paintFront(x, 25, BLACK, false);
for (let x = -3; x <= 3; x++) {
  const f = frontZ(x, 26); if (f !== null) put(x, 26, f - 1, FUR);
  if (Math.abs(x) <= 2 && Math.abs(x) >= 1) put(x, 26, -5, FUR);
  if (Math.abs(x) >= 2) { const g = frontZ(x, 25); if (g !== null) put(x, 25, g - 1, FUR); }
}
for (let x = -3; x <= 3; x++) for (let z = -5; z <= -2; z++) if (!has(x, 24, z)) put(x, 24, z, FUR);
const BW = { 23: 3, 22: 3, 21: 3, 20: 2, 19: 2, 18: 1 };
for (let y = 23; y >= 18; y--) for (let x = -BW[y]; x <= BW[y]; x++) {
  for (let z = -5; z < 0; z++) {
    if (has(x, y, z)) break;
    put(x, y, z, (Math.abs(x) === 2 && y % 2 === 0) ? LIGHT_GRAY : FUR);
  }
}
put(-1, 17, -4, FUR); put(1, 17, -4, FUR); put(-1, 16, -4, GOLD); put(1, 16, -4, GOLD); put(0, 17, -5, FUR);
// horns
for (const s of [-1, 1]) {
  cap(s * 3.5, 29.6, 0, s * 6.5, 29.8, 0, 1.4, 1.2, MARBLE);
  cap(s * 6.5, 29.8, 0, s * 8.2, 31.6, -0.6, 1.2, 0.9, MARBLE);
  cap(s * 8.2, 31.6, -0.6, s * 7.6, 33, -1.2, 0.8, 0.5, ICE);
  put(s * 4, 29, -1, GOLD); put(s * 4, 30, -1, GOLD); put(s * 4, 31, 0, GOLD);
}

// ================= ICE AXE =================
const SX = 13, SZ = -7;
box(SX, 1, SZ, SX + 1, 31, SZ + 1, OAK_LOG);
for (const by of [1, 2, 9, 13, 23]) box(SX, by, SZ, SX + 1, by, SZ + 1, METAL);
box(SX, 24, SZ, SX + 1, 30, SZ + 1, METAL);
box(SX, 24, SZ, SX + 1, 24, SZ + 1, GOLD); box(SX, 30, SZ, SX + 1, 30, SZ + 1, GOLD);
box(SX, 32, SZ, SX + 1, 32, SZ + 1, LIGHT_BLUE);
box(SX, 33, SZ, SX + 1, 33, SZ + 1, ICE);
const CY = 27;
for (let dx = 1; dx <= 8; dx++) {
  const x = SX + 1 + dx;
  for (let dy = -8; dy <= 6; dy++) {
    if (dy > 1.2 + dx * 0.7 || -dy > 1.2 + dx * 1.0) continue;
    const rr = Math.sqrt((dx + 1) * (dx + 1) + dy * dy);
    if (rr > 9.3) continue;
    const e = 9.3 - rr, y = CY + dy;
    if (y > 33) continue;
    const id = e < 1.3 ? ICE : e < 2.6 ? WHITE : e < 4.6 ? LIGHT_BLUE : CYAN;
    put(x, y, SZ, id);
    if (e >= 1.3) put(x, y, SZ + 1, id);
  }
}
// glowing frost veins
for (let dx = 2; dx <= 6; dx++) put(SX + 1 + dx, CY, SZ, NEON_BLUE);
for (let dx = 3; dx <= 5; dx++) { put(SX + 1 + dx, CY + Math.round(dx * 0.55), SZ, NEON_BLUE); put(SX + 1 + dx, CY - Math.round(dx * 0.75), SZ, NEON_BLUE); }
// icicles under the blade
for (const dx of [2, 4, 6]) {
  const x = SX + 1 + dx;
  let y = CY; while (has(x, y - 1, SZ)) y--;
  put(x, y - 1, SZ, ICE); if (dx === 4) put(x, y - 2, SZ, ICE);
}
// back pick
const PH = [2, 1, 1, 0];
for (let d = 1; d <= 4; d++) for (let dy = -PH[d - 1]; dy <= PH[d - 1]; dy++) {
  const id = d >= 3 ? ICE : (d === 2 ? LIGHT_BLUE : CYAN);
  put(SX - d, CY + dy, SZ, id); if (d <= 2) put(SX - d, CY + dy, SZ + 1, id);
}
// gripping fist
ell(13.5, 18, -6.5, 2.4, 2.3, 2.4, SKIN);

// ================= ENVIRONMENT =================
// snow field under the giant (also levels the dip under his right foot)
for (let x = -12; x <= 12; x++) for (let z = -14; z <= 10; z++) {
  const d = Math.hypot(x, z + 2);
  if (d <= 8.5 + 1.5 * rnd(x + 7, z + 3)) {
    const g = gh(x, z);
    if (!has(x, g, z)) { tag = 200 + d; put(x, g, z, SNOW); tag = 0; }
  }
}
let ci = 0;
function crystal(bx, bz, tx, ty, tz, r) {
  const by = gh(bx, bz);
  ci++;
  if (r > 1.3) { tag = 300; ell(bx, by + 1, bz, r + 0.7, 0.6, r + 0.7, SNOW, (x, y, z) => !has(x, y, z)); }
  tag = 100 + ci;
  cap(bx, by, bz, tx, ty, tz, r, 0.35, ICE, by);
  spike(bx, by, bz, tx, ty, tz, ICE, ICE);
  if (r > 1.3) cap(bx, by, bz, bx + (tx - bx) * 0.7, by + (ty - by) * 0.7, bz + (tz - bz) * 0.7, r - 0.9, 0.3, LIGHT_BLUE, by);
  else spike(bx, by, bz, bx + (tx - bx) * 0.5, by + (ty - by) * 0.5, bz + (tz - bz) * 0.5, LIGHT_BLUE, LIGHT_BLUE);
  tag = 0;
}
// A: front-left cluster
crystal(-9, -9, -11, 8, -11, 1.8); crystal(-8, -10, -6, 4, -12, 1.2); crystal(-10, -8, -13, 4, -7, 1.2);
// B: front-right cluster, near the axe butt
crystal(10, -11, 12, 7, -13, 1.7); crystal(9, -11, 7, 3, -13, 1.1); crystal(11, -10, 15, 4, -11, 1.2);
// C: behind-left
crystal(-9, 5, -12, 9, 8, 1.8); crystal(-8, 6, -6, 5, 9, 1.2);
// D: behind-right
crystal(8, 7, 10, 7, 9, 1.7); crystal(9, 6, 12, 3, 6, 1.2);
// small shards by the axe butt and in front of the feet
crystal(15, -8, 17, 4, -9, 1.1); crystal(4, -9, 5, 3, -10, 1.0); crystal(-1, -8, -2, 2, -9, 1.0);

// tiny warriors for scale
function warrior(x, z, tunic, torch) {
  const g = gh(x, z) + 1;
  put(x, g, z, BROWN); put(x, g + 1, z, BROWN);
  put(x, g + 2, z, tunic); put(x, g + 3, z, tunic); put(x - 1, g + 3, z, tunic); put(x + 1, g + 3, z, tunic);
  put(x, g + 4, z, SAND); put(x, g + 5, z, IRON);
  if (torch) { put(x + 1, g + 4, z, OAK_LOG); put(x + 1, g + 5, z, FIRE); put(x - 1, g + 2, z, tunic); }
  else { put(x + 1, g + 4, z, IRON); put(x + 1, g + 5, z, IRON); put(x + 1, g + 6, z, IRON); put(x - 1, g + 2, z + 1, COPPER); put(x - 1, g + 3, z + 1, COPPER); }
}
warrior(-2, -14, RED, false);
warrior(4, -14, YELLOW, true);

// effects: a little crackle of frost magic on the axe, cold mist off the ice
for (const p of [[22, 30, -7], [22, 23, -7], [8, 27, -7]]) if (!has(p[0], p[1], p[2])) put(p[0], p[1], p[2], ELECTRIC);
for (const p of [[17, 29, -5], [20, 26, -5], [-11, 9, -11], [12, 8, -13], [-12, 10, 8], [10, 8, 9]]) if (!has(p[0], p[1], p[2])) put(p[0], p[1], p[2], STEAM);

// ================= EMIT =================
// clear trees around the giant and in front of him (camera side)
for (let x = -13; x <= 18; x++) for (let z = -16; z <= 10; z++) {
  const a = (x - 1) / 13, b = (z + 3) / 12.5;
  const inAxe = x >= 12 && x <= 18 && z >= -10 && z <= -3;
  if (a * a + b * b > 1 && !inAxe) continue;
  for (let y = gh(x, z) + 1; y <= 7; y++) if (!has(x, y, z)) block(x, y, z, AIR);
}
// drop fully enclosed interior blocks (never visible) to stay inside the budget
const TRANS = new Set([ICE, GLASS, WATER, FIRE, ELECTRIC, STEAM]);
function opaque(x, y, z) { const v = M.get(K(x, y, z)); return !!v && !TRANS.has(v[3]); }
let out = [];
for (const v of M.values()) {
  const x = v[0], y = v[1], z = v[2];
  const t = LP.get(K(x, y, z)) || 0;
  const belowSolid = opaque(x, y - 1, z) || (t >= 200 && t < 300);
  if (belowSolid && opaque(x + 1, y, z) && opaque(x - 1, y, z) && opaque(x, y + 1, z) && opaque(x, y, z + 1) && opaque(x, y, z - 1)) continue;
  out.push(v);
}
// budget guard: shed low-priority scenery first (mounds, far snow, extra crystals, cape)
const LIMIT = 3960;
if (out.length > LIMIT) {
  const score = (v) => LP.get(K(v[0], v[1], v[2])) || 0;
  const cand = out.filter((v) => score(v) > 0).sort((a, b) => score(b) - score(a));
  const drop = new Set();
  for (let i = 0; i < cand.length && out.length - drop.size > LIMIT; i++) drop.add(cand[i]);
  out = out.filter((v) => !drop.has(v));
}
if (out.length > LIMIT) out.length = LIMIT;
out.sort((a, b) => a[1] - b[1] || a[2] - b[2] || a[0] - b[0]);
for (const v of out) block(v[0], v[1], v[2], v[3]);