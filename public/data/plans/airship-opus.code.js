// airship-opus — prompt:
// a steampunk airship...

const M = new Map();
function P(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, id);
}
function L(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1));
  const s = Math.max(1, Math.ceil(n * 1.2));
  for (let i = 0; i <= s; i++) { const t = i / s; P(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id); }
}
function C(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) P(x, y, z, id);
}

// ---- clear trees near tower and anchor ----
C(15, 0, 8, 21, 8, 14, AIR);
C(8, 1, -3, 14, 7, 1, AIR);

// ================= ENVELOPE (gas bag) =================
const EY = 25.5, ER = 6.5;
function er(x) { const a = x >= 0 ? 19.5 : 21.5; const t = 1 - (x / a) * (x / a); return t <= 0 ? 0 : ER * Math.sqrt(t); }
function eIn(x, y, z) { const r = er(x); return r > 0 && Math.hypot(y - EY, z) <= r; }
for (let x = -21; x <= 19; x++) for (let y = 18; y <= 33; y++) for (let z = -8; z <= 8; z++) {
  if (!eIn(x, y, z)) continue;
  if (eIn(x + 1, y, z) && eIn(x - 1, y, z) && eIn(x, y + 1, z) && eIn(x, y - 1, z) && eIn(x, y, z + 1) && eIn(x, y, z - 1)) continue;
  let id;
  if (x >= 16) id = GOLD;
  else if (x <= -18) id = COPPER;
  else if ((x + 24) % 6 === 0) id = COPPER;
  else { const a = Math.atan2(y - EY, z); const b = Math.floor((a + Math.PI) / (Math.PI / 6)); id = (b % 2 === 0) ? SAND : BROWN; }
  P(x, y, z, id);
}
// nose spike
P(20, 25, 0, GOLD); P(20, 26, 0, GOLD); P(21, 25, 0, IRON); P(21, 26, 0, IRON); P(22, 26, 0, IRON);

// ---- tail fins (cross pattern) ----
for (let x = -22; x <= -14; x++) {
  const r = er(x);
  const ext = 9.5 - Math.max(0, x + 18) * 0.75;
  const fr = (d) => (d + 1 > ext || x === -22 || x === -14) ? COPPER : BRICK;
  for (let y = 26; y <= 33; y++) { const d = y - EY; if (d > r && d <= ext) P(x, y, 0, fr(d)); }
  for (let y = 25; y >= 16; y--) { const d = EY - y; if (d > r && d <= ext) P(x, y, 0, fr(d)); }
  for (let k = 1; k <= 10; k++) { const d = Math.hypot(0.5, k); if (d > r && k <= ext) { P(x, 25, k, fr(k)); P(x, 25, -k, fr(k)); } }
}

// ================= HULL (wooden gondola ship) =================
function hIn(x, y, z) {
  if (y < 8 || y > 13) return false;
  const t = (y - 8) / 5; const w = 1 + 3.3 * Math.sqrt(t);
  const xs = -10 - 2 * t, xb = 10 + 4.5 * t;
  if (x < xs - 0.01 || x > xb + 0.01) return false;
  let f = 1;
  if (x > xb - 7) f = Math.sqrt(Math.max(0, (xb - x + 0.4) / 7.4));
  if (x < xs + 1.5) f *= 0.85;
  return Math.abs(z) <= w * f + 0.35;
}
for (let x = -13; x <= 15; x++) for (let y = 8; y <= 13; y++) for (let z = -6; z <= 6; z++) {
  if (!hIn(x, y, z)) continue;
  const side = !hIn(x + 1, y, z) || !hIn(x - 1, y, z) || !hIn(x, y, z + 1) || !hIn(x, y, z - 1);
  const bot = !hIn(x, y - 1, z);
  if (y < 13 && !side && !bot) continue;
  let id;
  if (y === 13) id = side ? OAK_LOG : PLANKS;
  else if (y <= 9) id = COPPER;
  else if (y === 12) id = GOLD;
  else if (y === 11) id = BROWN;
  else id = OAK_LOG;
  P(x, y, z, id);
}
// portholes
for (const px of [-8, -4, 0, 4, 8]) {
  for (let z = -7; z <= 0; z++) if (hIn(px, 11, z)) { P(px, 11, z, GLASS); P(px, 11, z + 1, GLOWSTONE); break; }
  for (let z = 7; z >= 0; z--) if (hIn(px, 11, z)) { P(px, 11, z, GLASS); break; }
}
// rails
for (let x = -13; x <= 15; x++) for (let z = -6; z <= 6; z++) {
  if (!hIn(x, 13, z)) continue;
  if (hIn(x + 1, 13, z) && hIn(x - 1, 13, z) && hIn(x, 13, z + 1) && hIn(x, 13, z - 1)) continue;
  if (x % 2 === 0) P(x, 14, z, OAK_LOG);
  P(x, 15, z, COPPER);
}

// ================= CABIN =================
for (let x = -7; x <= 4; x++) for (let y = 14; y <= 17; y++) for (let z = -3; z <= 3; z++) {
  if (x === -7 || x === 4 || z === -3 || z === 3) {
    const corner = (x === -7 || x === 4) && (z === -3 || z === 3);
    P(x, y, z, corner ? OAK_LOG : (y === 17 ? PLANKS : BROWN));
  }
}
for (const wx of [-5, -2, 1]) {
  P(wx, 15, -3, GLASS); P(wx, 16, -3, GLASS); P(wx, 15, -2, GLOWSTONE);
  P(wx, 15, 3, GLASS); P(wx, 16, 3, GLASS);
}
P(-7, 15, 0, GLASS); P(-7, 16, 0, GLASS);
P(4, 14, 0, AIR); P(4, 15, 0, AIR);
for (let x = -8; x <= 5; x++) for (let z = -4; z <= 4; z++) {
  const edge = x === -8 || x === 5 || Math.abs(z) === 4;
  P(x, 18, z, edge ? GOLD : COPPER);
}
L(-7, 17, -4, 4, 17, -4, COPPER);
P(-4, 16, -4, GOLD); P(3, 16, -4, GOLD);

// ================= PADDLE WHEELS =================
function paddle(zc, s) {
  const cx = -2, cy = 11, R = 3.5;
  for (let a = 0; a < Math.PI * 2; a += 0.08) P(cx + R * Math.cos(a), cy + R * Math.sin(a), zc, GOLD);
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4 + 0.2;
    L(cx, cy, zc, cx + 3 * Math.cos(a), cy + 3 * Math.sin(a), zc, OAK_LOG);
    for (let rr = 3.5; rr <= 4.6; rr += 0.5) {
      P(cx + rr * Math.cos(a), cy + rr * Math.sin(a), zc, PLANKS);
      P(cx + rr * Math.cos(a), cy + rr * Math.sin(a), zc - s, PLANKS);
    }
  }
  L(cx, cy, zc, cx, cy, 0, IRON);
  P(cx, cy, zc, IRON); P(cx, cy, zc + s, GOLD);
  for (let a = 0.25; a < Math.PI - 0.25; a += 0.06)
    for (const dz of [s, 0, -s]) P(cx + 5.3 * Math.cos(a), cy + 5.3 * Math.sin(a), zc + dz, COPPER);
}
paddle(-7, -1);
paddle(7, 1);

// ================= ENGINE NACELLES =================
function nacelle(zc, s, light) {
  const cy = 21;
  for (let x = -4; x <= 3; x++) {
    const r = (x === -4 || x === 3) ? 1.5 : 2.3;
    for (let dy = -2; dy <= 2; dy++) for (let dz = -2; dz <= 2; dz++) {
      if (dy * dy + dz * dz > r * r + 0.01) continue;
      let id = (x === -2 || x === 1) ? COPPER : IRON;
      if (x === 3 || x === -4) id = COPPER;
      P(x, cy + dy, zc + dz, id);
    }
  }
  P(4, cy, zc, light);
  // pusher propeller
  P(-5, cy, zc, GOLD);
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + k * Math.PI / 2;
    for (let rr = 1; rr <= 3.3; rr += 0.5) P(-5, cy + rr * Math.sin(a), zc + rr * Math.cos(a), rr > 2.7 ? GOLD : PLANKS);
  }
  // pylons to envelope
  for (const px of [-2, 1]) L(px, 22, zc - 2.5 * s, px, 23, 6 * s, IRON);
  // cable to hull rail
  L(0, 19, zc - s, 0, 15, 4 * s, BLACK);
  // exhaust stacks
  P(-3, 24, zc, COPPER); P(-3, 25, zc, COPPER); P(-3, 26, zc, STEAM); P(-3, 27, zc, STEAM);
  P(1, 24, zc, IRON); P(1, 25, zc, STEAM);
}
nacelle(-11, -1, NEON_RED);
nacelle(11, 1, NEON_BLUE);

// ================= BOW DETAILS =================
L(14, 13, 0, 19, 16, 0, OAK_LOG);
P(19, 15, 0, GLOWSTONE);
L(13, 10, 0, 15, 13, 0, GOLD);
P(14, 12, -1, GOLD); P(14, 12, 1, GOLD);
// tesla coil
P(9, 14, 0, IRON); P(9, 15, 0, IRON); P(9, 16, 0, IRON);
P(8, 15, 0, COPPER); P(10, 15, 0, COPPER); P(9, 15, -1, COPPER); P(9, 15, 1, COPPER);
P(9, 17, 0, GOLD);
P(9, 18, 0, ELECTRIC); P(10, 18, -1, ELECTRIC); P(8, 18, 1, ELECTRIC);
// helm wheel
P(6, 14, 0, OAK_LOG); P(6, 15, 0, OAK_LOG);
for (let a = 0; a < Math.PI * 2; a += 0.3) P(6, 16 + 1.5 * Math.sin(a), 1.5 * Math.cos(a), GOLD);
P(6, 16, 0, IRON);

// ================= STERN =================
L(-10, 10, 0, -14, 10, 0, IRON);
P(-14, 10, 0, GOLD);
for (let k = 0; k < 3; k++) {
  const a = Math.PI / 2 + k * 2 * Math.PI / 3;
  for (let rr = 1; rr <= 3.2; rr += 0.5) P(-14, 10 + rr * Math.sin(a), rr * Math.cos(a), COPPER);
}
// flag
L(-11, 14, 0, -11, 19, 0, OAK_LOG);
for (let x = -15; x <= -12; x++) { P(x, 18, 0, RED); P(x, 17, 0, YELLOW); P(x, 16, 0, RED); }
// stern exhausts
for (const sz of [-2, 2]) { P(-11, 14, sz, IRON); P(-11, 15, sz, IRON); P(-11, 16, sz, STEAM); }
// lanterns
P(-10, 16, -4, GLOWSTONE); P(10, 16, -3, GLOWSTONE);

// ================= RIGGING =================
for (const x of [-10, -9, 7, 11]) {
  for (const s of [-1, 1]) {
    let zE = 0;
    for (let z = 0; Math.abs(z) <= 7; z += s) { if (hIn(x, 13, z)) zE = z; else break; }
    const r = er(x); const ze = zE + s;
    const ye = EY - Math.sqrt(Math.max(0, r * r - ze * ze));
    L(x, 15, zE, x, ye - 0.6, ze, BLACK);
  }
}

// ================= ANCHOR =================
for (let y = 7; y <= 9; y++) P(11, y, -1, y % 2 ? IRON : GRAY);
P(11, 6, -1, GOLD);
for (let y = 2; y <= 5; y++) P(11, y, -1, IRON);
P(11, 5, -2, OAK_LOG); P(11, 5, 0, OAK_LOG);
P(11, 1, -1, IRON);
P(10, 2, -1, IRON); P(12, 2, -1, IRON);
P(9, 3, -1, IRON); P(13, 3, -1, IRON);
P(9, 4, -1, GOLD); P(13, 4, -1, GOLD);

// ================= MOORING TOWER (background) =================
C(15, -1, 8, 21, -1, 14, COBBLE);
for (const [lx, lz] of [[16, 9], [20, 9], [16, 13], [20, 13]]) L(lx, 0, lz, lx, 23, lz, IRON);
for (const ry of [5, 11, 17, 23]) {
  for (let x = 16; x <= 20; x++) { P(x, ry, 9, COPPER); P(x, ry, 13, COPPER); }
  for (let z = 9; z <= 13; z++) { P(16, ry, z, COPPER); P(20, ry, z, COPPER); }
}
const segs = [[0, 5], [5, 11], [11, 17], [17, 23]];
for (const [y0, y1] of segs) {
  L(16, y0, 9, 20, y1, 9, IRON); L(20, y0, 9, 16, y1, 9, IRON);
  L(16, y0, 9, 16, y1, 13, IRON); L(16, y0, 13, 16, y1, 9, IRON);
}
C(15, 24, 8, 21, 24, 14, PLANKS);
for (const [px, pz] of [[15, 8], [21, 8], [15, 14], [21, 14]]) P(px, 25, pz, GOLD);
P(18, 25, 11, GLOWSTONE); P(18, 26, 11, COPPER);
L(18, 25, 8, 18, 25, 3, IRON);
P(18, 26, 3, GOLD); P(17, 25, 3, GOLD);

// ================= EMIT (budget-capped) =================
let count = 0;
for (const [k, id] of M) {
  if (id !== AIR) { if (count >= 3990) continue; count++; }
  const p = k.split(',').map(Number);
  block(p[0], p[1], p[2], id);
}