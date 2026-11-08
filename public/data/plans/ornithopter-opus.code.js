// ornithopter-opus — prompt:
// Da Vinci's flying machine...

// Da Vinci's Ornithopter — on its launch trestle in a Florentine workshop piazza
const M = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, id);
}
function fill(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function ln(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1));
  const steps = Math.max(1, Math.ceil(n * 1.5));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    put(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id);
  }
}
function inPoly(px, pz, P) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const xi = P[i][0], zi = P[i][1], xj = P[j][0], zj = P[j][1];
    if (((zi > pz) !== (zj > pz)) && (px < (xj - xi) * (pz - zi) / (zj - zi) + xi)) c = !c;
  }
  return c;
}

// ---------------- site prep (AIR is free) ----------------
cube(-22, 1, -22, 22, 9, 16, AIR);
cube(6, 1, 13, 22, 9, 22, AIR);
cube(-22, 1, 14, -14, 9, 22, AIR);
cube(-6, 1, 17, 6, 12, 18, AIR);

// ---------------- piazza ----------------
for (let x = -13; x <= 13; x++) for (let z = -12; z <= 14; z++) {
  const d = Math.hypot(x, z - 1);
  if (d > 12.5) continue;
  block(x, 0, z, AIR);
  let id = BRICK;
  if (d > 11.5) id = STONE;
  else if (d < 2.5) id = MARBLE;
  else if (Math.abs(d - 6.5) < 0.5) id = MARBLE;
  else if ((x === 0 || z === 1 || Math.abs(x) === Math.abs(z - 1)) && d < 11) id = SAND;
  put(x, -1, z, id);
}

// ---------------- launch trestle ----------------
for (const [x, z] of [[-3, -4], [3, -4], [-3, 5], [3, 5]]) fill(x, 0, z, x, 5, z, OAK_LOG);
ln(-4, 0, -4, 4, 0, -4, OAK_LOG); ln(-4, 0, 5, 4, 0, 5, OAK_LOG);
ln(-3, 0, -5, -3, 0, 6, OAK_LOG); ln(3, 0, -5, 3, 0, 6, OAK_LOG);
ln(-3, 5, -4, 3, 5, -4, OAK_LOG); ln(-3, 5, 5, 3, 5, 5, OAK_LOG);
ln(-3, 5, -4, -3, 5, 5, PLANKS); ln(3, 5, -4, 3, 5, 5, PLANKS);
ln(-3, 5, 0, 3, 5, 0, PLANKS);
for (const sx of [-3, 3]) { ln(sx, 1, -3, sx, 4, 4, BROWN); ln(sx, 4, -3, sx, 1, 4, BROWN); }
for (const sz of [-4, 5]) { ln(-2, 1, sz, 2, 4, sz, BROWN); ln(-2, 4, sz, 2, 1, sz, BROWN); }
ln(-1, 0, 8, -1, 5, 6, OAK_LOG); ln(1, 0, 8, 1, 5, 6, OAK_LOG);
for (let y = 1; y <= 4; y += 1) put(0, y, Math.round(8 - (y / 5) * 2), PLANKS);

// ---------------- fuselage (open boat-shaped cradle) ----------------
ln(0, 6, -8, 0, 6, 8, OAK_LOG);
fill(-1, 7, -5, 1, 7, 5, PLANKS);
for (const s of [-1, 1]) {
  ln(2 * s, 9, -5, 2 * s, 9, 6, OAK_LOG);
  ln(2 * s, 9, -5, 0, 9, -9, OAK_LOG);
  ln(2 * s, 9, 6, 0, 9, 9, OAK_LOG);
  ln(2 * s, 7, -4, 2 * s, 7, 5, BROWN);
  ln(s, 7, -6, 0, 7, -8, BROWN);
  ln(s, 7, 6, 0, 7, 8, BROWN);
  for (const z of [-4, -1, 2, 5]) { put(s, 6, z, BROWN); put(2 * s, 8, z, BROWN); }
  put(s, 8, -7, BROWN); put(s, 8, 7, BROWN);
}
put(0, 9, -10, GOLD); put(0, 10, -10, GOLD); put(0, 10, -11, GOLD);
put(0, 8, -9, OAK_LOG);

// pilot lying prone, head to the north
fill(-1, 8, -5, 1, 8, -1, RED);
put(0, 8, -2, BROWN);
for (const s of [-1, 1]) {
  ln(s, 8, 0, s, 8, 4, BLUE);
  put(s, 8, 5, BLACK);
  put(s, 8, 6, IRON);
  put(s, 8, -6, SAND);
}
put(0, 9, -5, SAND); put(0, 9, -4, BROWN); put(0, 10, -5, RED); put(0, 10, -4, RED);
ln(-2, 8, -7, 2, 8, -7, IRON);
put(-2, 9, -7, IRON); put(2, 9, -7, IRON);

// mast, yard, pulleys
ln(0, 8, 2, 0, 21, 2, OAK_LOG);
ln(-4, 19, 2, 4, 19, 2, OAK_LOG);
put(-4, 19, 2, IRON); put(4, 19, 2, IRON);
put(0, 22, 2, IRON); put(0, 23, 2, GOLD);
put(-1, 21, 2, IRON); put(1, 21, 2, IRON);

// ---------------- bat wings ----------------
const yf = u => Math.round(9 + (u - 3) * 0.5);
const WP = [[3, -3], [7, -5], [12, -6], [16, -4.5], [21, -1], [19, 2.5], [20, 6], [16.5, 6.8],
            [16, 10], [12.8, 9.3], [10, 12], [6.5, 9.3], [3, 10]];
const BOUNDS = [29, 56.3, 76, 96.3, 119.4];
function wline(s, u1, z1, u2, z2, id, under) {
  const n = Math.ceil(Math.hypot(u2 - u1, z2 - z1) * 2);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = Math.round(u1 + (u2 - u1) * t), z = Math.round(z1 + (z2 - z1) * t);
    put(s * u, yf(u), z, id);
    if (under) put(s * u, yf(u) - 1, z, under);
  }
}
function wpoly(s, pts, id, under) {
  for (let i = 0; i + 1 < pts.length; i++) wline(s, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], id, under);
}
for (const s of [-1, 1]) {
  ln(2 * s, 7, -1, 12 * s, 13, -6, BROWN);
  ln(2 * s, 7, 3, 14 * s, 14, 2, BROWN);
  for (let u = 3; u <= 21; u++) for (let z = -7; z <= 12; z++) {
    if (!inPoly(u + 0.01, z + 0.01, WP)) continue;
    const a = Math.atan2(z + 6, u - 12) * 180 / Math.PI;
    let k = 0; for (const b of BOUNDS) if (a > b) k++;
    put(s * u, yf(u), z, k % 2 ? WHITE : SAND);
  }
  for (const f of [[20, 6], [16, 10], [10, 12], [3, 10]]) wline(s, 12, -6, f[0], f[1], BROWN);
  wline(s, 3, -3, 3, 10, BROWN);
  wpoly(s, [[3, 4], [7, 2.8], [10.9, 3.9], [14.2, 2.8], [16.4, 0.6], [18.5, -2.75]], BROWN);
  wpoly(s, [[3, 8], [6, 7], [8.5, 8]], BROWN);
  wpoly(s, [[14.5, 7], [17.5, 4], [19.5, 1]], BROWN);
  wpoly(s, [[3, -3], [7, -5], [12, -6], [16, -4.5], [21, -1]], OAK_LOG, OAK_LOG);
  put(3 * s, 10, -3, IRON); put(3 * s, 10, 4, IRON);
  put(12 * s, yf(12) + 1, -6, IRON);
  put(21 * s, yf(21) + 1, -1, GOLD);
  put(20 * s, yf(20) + 1, 6, IRON); put(16 * s, yf(16) + 1, 10, IRON); put(10 * s, yf(10) + 1, 12, IRON);
  ln(0, 21, 2, 12 * s, 15, -6, GRAY);
  ln(0, 21, 2, 20 * s, 19, 6, GRAY);
  ln(4 * s, 19, 2, 16 * s, 17, 10, GRAY);
  ln(4 * s, 19, 2, 10 * s, 14, 12, GRAY);
  ln(0, 20, 2, 7 * s, 12, -5, GRAY);
}

// ---------------- fan tail ----------------
ln(0, 8, 9, 0, 9, 11, OAK_LOG);
const tY = z => 9 + Math.floor((z - 10) / 3);
for (let z = 10; z <= 17; z++) {
  const w = Math.floor(1 + (z - 10) * 0.65);
  for (let x = -w; x <= w; x++) {
    if (z === 17 && Math.abs(x) % 2 === 1) continue;
    put(x, tY(z), z, Math.abs(x) % 2 ? WHITE : SAND);
  }
}
for (const xe of [-5, -2.5, 0, 2.5, 5]) for (let z = 10; z <= 17; z++)
  put(Math.round(xe * (z - 10) / 7), tY(z), z, BROWN);
put(0, tY(17) + 1, 17, GOLD);

// ---------------- Leonardo, presenting his machine ----------------
fill(-8, 0, -8, -6, 3, -7, PURPLE);
fill(-8, 0, -8, -6, 0, -8, BLACK);
fill(-8, 2, -8, -6, 2, -7, BROWN);
put(-7, 2, -8, GOLD);
fill(-8, 4, -8, -6, 5, -7, SAND);
fill(-8, 4, -7, -6, 5, -7, WHITE);
put(-8, 5, -8, BLACK); put(-6, 5, -8, BLACK);
fill(-8, 4, -8, -6, 4, -8, WHITE);
put(-7, 3, -8, WHITE); put(-7, 2, -8, WHITE);
fill(-9, 6, -9, -5, 6, -6, BLACK);
fill(-8, 7, -8, -6, 7, -7, BLACK);
fill(-9, 1, -8, -9, 3, -8, PURPLE); put(-9, 0, -8, SAND); put(-9, 0, -9, WHITE);
put(-5, 3, -8, PURPLE); put(-4, 4, -8, PURPLE); put(-3, 5, -8, SAND);
for (const [x, z] of [[-12, -8], [-10, -8], [-12, -6], [-10, -6]]) fill(x, 0, z, x, 1, z, OAK_LOG);
fill(-12, 2, -8, -10, 2, -6, PLANKS);
put(-12, 3, -7, WHITE); put(-11, 3, -7, WHITE); put(-12, 3, -6, WHITE);
put(-11, 3, -8, BROWN); put(-12, 3, -8, WHITE); put(-10, 3, -8, WHITE);
put(-10, 3, -6, BLACK); put(-10, 4, -6, WHITE);
put(-11, 3, -6, GLOWSTONE);

// ---------------- apprentice holding the tether ----------------
fill(3, 0, -8, 3, 1, -8, BLUE); fill(4, 0, -8, 4, 1, -8, BLUE);
fill(3, 2, -8, 4, 3, -8, GREEN);
fill(3, 4, -8, 4, 5, -8, SAND);
fill(3, 6, -8, 4, 6, -8, BROWN); fill(3, 4, -7, 4, 6, -7, BROWN);
put(2, 3, -8, GREEN); put(2, 4, -8, GREEN); put(2, 5, -8, SAND);
ln(2, 6, -8, 0, 9, -10, GRAY);

// lamp posts
fill(-3, 0, -11, -3, 3, -11, IRON); put(-3, 4, -11, GLOWSTONE); put(-3, 5, -11, BLACK);
fill(10, 0, 9, 10, 3, 9, IRON); put(10, 4, 9, GLOWSTONE); put(10, 5, 9, BLACK);

// ---------------- wooden gear train ----------------
function gear(cx, cy, cz, r, teeth, rimId) {
  for (let a = 0; a < 360; a += 3) {
    const t = a * Math.PI / 180;
    put(cx + r * Math.cos(t), cy + r * Math.sin(t), cz, rimId);
  }
  for (let i = 0; i < teeth; i++) {
    const t = i * 2 * Math.PI / teeth;
    put(cx + (r + 1) * Math.cos(t), cy + (r + 1) * Math.sin(t), cz, BROWN);
  }
  ln(cx - r, cy, cz, cx + r, cy, cz, OAK_LOG); ln(cx, cy - r, cz, cx, cy + r, cz, OAK_LOG);
  put(cx, cy, cz, IRON);
}
gear(9, 5, -11, 3, 12, PLANKS);
gear(15, 4, -11, 2, 8, PLANKS);
fill(9, 1, -12, 9, 5, -12, OAK_LOG); fill(9, 1, -10, 9, 5, -10, OAK_LOG);
fill(15, 1, -12, 15, 4, -12, OAK_LOG); fill(15, 1, -10, 15, 4, -10, OAK_LOG);

// ---------------- aerial screw model ----------------
const sx = 16, sz = -17;
for (let x = -4; x <= 4; x++) for (let z = -4; z <= 4; z++) {
  const d = Math.hypot(x, z);
  if (d <= 4.3) put(sx + x, 1, sz + z, d > 3.4 ? BROWN : PLANKS);
}
ln(sx, 2, sz, sx, 10, sz, OAK_LOG);
for (let th = 0; th <= Math.PI * 2 * 1.2; th += 0.04) {
  const y = 4 + th / (Math.PI * 2) * 4;
  for (let r = 1; r <= 4.6; r += 0.5) put(sx + r * Math.cos(th), y, sz + r * Math.sin(th), r > 4.1 ? BROWN : WHITE);
}
for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ln(sx, 2, sz, sx + 5 * dx, 2, sz + 5 * dz, BROWN);
put(sx, 11, sz, GOLD);

// ---------------- props ----------------
fill(7, 0, 7, 8, 1, 8, PLANKS); put(7, 0, 7, BROWN); put(8, 1, 8, BROWN); ln(7, 2, 7, 8, 2, 7, WHITE);
fill(-9, 0, 5, -9, 1, 5, BROWN); fill(-8, 0, 6, -8, 1, 6, BROWN); put(-9, 2, 5, OAK_LOG);
put(-9, 1, 5, COPPER); put(-8, 1, 6, COPPER);

// ---------------- Leonardo's bottega (back right) ----------------
for (let y = -1; y <= 9; y++) for (let x = 7; x <= 21; x++) for (let z = 15; z <= 21; z++) {
  if (x > 7 && x < 21 && z > 15 && z < 21) continue;
  const corner = (x === 7 || x === 21) && (z === 15 || z === 21);
  let id = y <= 0 ? STONE : BRICK;
  if (corner && y > 0) id = y % 2 ? MARBLE : STONE;
  if (y === 5 && (z === 15 || x === 21)) id = MARBLE;
  put(x, y, z, id);
}
fill(12, -1, 15, 14, 2, 15, BROWN); fill(11, 3, 15, 15, 3, 15, MARBLE); put(13, 4, 15, MARBLE);
for (const x of [9, 17, 19]) { fill(x, 1, 15, x, 3, 15, GLASS); fill(x - 1, 4, 15, x + 1, 4, 15, MARBLE); }
for (const x of [9, 11, 13, 15, 17, 19]) { fill(x, 6, 15, x, 7, 15, GLASS); put(x, 8, 15, MARBLE); }
put(11, 6, 16, GLOWSTONE); put(15, 6, 16, GLOWSTONE);
for (const z of [17, 19]) { fill(21, 1, z, 21, 3, z, GLASS); fill(21, 6, z, 21, 7, z, GLASS); }
put(20, 6, 18, GLOWSTONE);
fill(11, 5, 13, 15, 5, 14, PLANKS); ln(11, 6, 13, 15, 6, 13, BROWN); put(11, 6, 14, BROWN); put(15, 6, 14, BROWN);
put(11, 4, 14, BROWN); put(15, 4, 14, BROWN);
for (const gx of [7, 21]) for (let z = 16; z <= 20; z++) for (let y = 10; y < 9 + (4 - Math.abs(z - 18)); y++) put(gx, y, z, BRICK);
for (let x = 6; x <= 22; x++) for (let z = 14; z <= 22; z++) {
  const y = 9 + (4 - Math.abs(z - 18));
  put(x, y, z, (x === 6 || x === 22) ? BROWN : z === 18 ? BRICK : (x % 2 ? ORANGE : BRICK));
}
fill(18, 12, 19, 19, 15, 20, COBBLE); put(18, 16, 19, STEAM); put(19, 16, 20, STEAM);

// ---------------- campanile (back left) ----------------
for (let y = -1; y <= 18; y++) for (let x = -20; x <= -16; x++) for (let z = 16; z <= 20; z++) {
  if (x > -20 && x < -16 && z > 16 && z < 20) continue;
  const corner = (x === -20 || x === -16) && (z === 16 || z === 20);
  const mid = (x === -18 || z === 18);
  if (y >= 14 && y <= 16 && mid && !corner) continue;
  if (mid && !corner && (y === 3 || y === 4)) continue;
  if (z === 16 && x === -18 && y >= -1 && y <= 1) continue;
  let id = corner ? MARBLE : STONE;
  if (y === 6 || y === 13 || y === 17 || y === 18) id = MARBLE;
  put(x, y, z, id);
}
fill(-19, 9, 16, -17, 11, 16, WHITE); put(-18, 10, 16, GOLD); put(-18, 11, 16, BLACK); put(-17, 10, 16, BLACK);
fill(-18, 15, 18, -18, 16, 18, GOLD); put(-18, 17, 18, OAK_LOG);
fill(-21, 19, 15, -15, 19, 21, BRICK);
fill(-20, 20, 16, -16, 20, 20, ORANGE);
fill(-19, 21, 17, -17, 21, 19, ORANGE);
put(-18, 22, 18, ORANGE); put(-18, 23, 18, GOLD); put(-18, 24, 18, GOLD);

// ---------------- flush ----------------
for (const [k, id] of M) {
  const p = k.split(',');
  block(+p[0], +p[1], +p[2], id);
}