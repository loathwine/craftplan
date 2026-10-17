// witch-broom-opus — prompt:
// a witch flying on a broomstick...

const R = Math.round;
function P(x, y, z, id) {
  x = R(x); y = R(y); z = R(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  block(x, y, z, id);
}
function hs(x, y, z) {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}

// ================= HARVEST MOON (background, south) =================
const MX = 2, MY = 21, MR = 11;
const craters = [[-4, 26, 2.3], [6, 15, 1.9], [7, 26, 1.6], [-5, 15, 1.5], [1, 19, 1.3], [-1, 30, 1.1], [10, 21, 1.2]];
for (let x = MX - MR; x <= MX + MR; x++) {
  for (let y = MY - MR; y <= MY + MR; y++) {
    const dx = x - MX, dy = y - MY, d2 = dx * dx + dy * dy;
    if (d2 > MR * MR + 1) continue;
    let c = YELLOW;
    for (const [cx, cy, cr] of craters) {
      const e = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (e <= cr * cr) c = SAND;
      else if (e <= (cr + 0.9) * (cr + 0.9) && y < cy) c = ORANGE;
    }
    if (d2 > (MR - 1.2) * (MR - 1.2)) c = hs(x, y, 3) < 0.6 ? ORANGE : YELLOW;
    P(x, y, 19, c);
    P(x, y, 20, YELLOW);
  }
}

// ================= WISPY CLOUDS across the moon =================
function puff(cx, cy, cz, rx, ry, rz) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const a = (x - cx) / rx, b = (y - cy) / ry, c = (z - cz) / rz;
        if (a * a + b * b + c * c <= 1) P(x, y, z, (y - cy) >= ry * 0.2 ? WHITE : LIGHT_GRAY);
      }
}
puff(-8, 13, 16, 7, 1.6, 1.3);
puff(-2, 14, 16, 4, 1.8, 1.3);
puff(-14, 12.5, 16, 4, 1.3, 1.2);
puff(13, 29, 16, 6, 1.4, 1.2);
puff(18, 30, 16, 3.5, 1.6, 1.2);
puff(9, 28.5, 16, 3, 1.1, 1);

// ================= BROOMSTICK =================
const by = x => 12 + x * 0.1;
for (let x = -11; x <= 13; x++) P(x, by(x), 0, hs(x, 1, 1) < 0.18 ? BROWN : OAK_LOG);
// gnarled hooked tip
P(14, 13, 0, OAK_LOG); P(15, 14, 0, OAK_LOG); P(15, 15, 0, OAK_LOG); P(14, 16, 0, OAK_LOG);
// red cord binding
for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) P(-11, by(-11) + dy, dz, RED);
// bristles: flaring cone of straw
for (let x = -12; x >= -19; x--) {
  const t = (-12 - x) / 7;
  const r = 1.4 + t * 2.6;
  const cy = by(-11) - t * 0.8;
  for (let dy = -4; dy <= 4; dy++) for (let dz = -4; dz <= 4; dz++) {
    if (dy * dy + dz * dz > r * r) continue;
    const hv = hs(x, dy, dz);
    if (t > 0.8 && hv > 0.55) continue;
    const c = hv < 0.45 ? YELLOW : hv < 0.7 ? SAND : hv < 0.87 ? ORANGE : BROWN;
    P(x, R(cy) + dy, dz, c);
  }
}
// stray straws
[[-20, 10, 1], [-20, 12, -2], [-20, 9, -1], [-21, 11, 0], [-20, 13, 2], [-20, 8, 2]].forEach(p => P(p[0], p[1], p[2], YELLOW));

// ================= WITCH: LEGS (striped stockings) =================
for (const zs of [-2, 2]) {
  for (let x = 0; x <= 3; x++) P(x, 12, zs, ORANGE); // thigh/knee
  for (let y = 9; y <= 11; y++) for (let x = 2; x <= 3; x++) P(x, y, zs, y % 2 === 0 ? ORANGE : BLACK);
  cube(2, 7, zs, 3, 8, zs, BLACK); // boot
  P(4, 7, zs, BLACK); P(5, 8, zs, BLACK); // curled pointy toe
  P(3, 8, zs, GOLD); // buckle
}

// ================= SKIRT (billowing back in the wind) =================
for (let k = 0; k <= 4; k++) {
  const y = 13 - k, cx = -k * 0.6, r = 2.4 + k * 0.35;
  for (let x = -7; x <= 4; x++) for (let z = -5; z <= 5; z++) {
    if ((x - cx) * (x - cx) + z * z > r * r + 0.3) continue;
    const hv = hs(x, y, z);
    if (k === 4 && hv > 0.6) continue;
    let c = PURPLE;
    if (k >= 3) c = hv < 0.5 ? BLACK : PURPLE;
    if (k < 3 && hv < 0.06) c = MAGENTA; // patches
    P(x, y, z, c);
  }
}

// ================= TORSO (leaning forward) =================
const rzT = { 14: 1.6, 15: 1.8, 16: 2.0, 17: 2.2, 18: 2.5 };
for (let y = 14; y <= 18; y++) {
  const cx = 0.2 + (y - 14) * 0.35, rx = 1.6, rz = rzT[y];
  for (let x = -3; x <= 4; x++) for (let z = -3; z <= 3; z++) {
    const a = (x - cx) / rx, b = z / rz;
    if (a * a + b * b > 1.05) continue;
    let c = y === 14 ? BLACK : PURPLE;
    if (y > 14 && z < 0 && hs(x, y, z) < 0.12) c = MAGENTA;
    P(x, y, z, c);
  }
  if (y > 14) P(Math.floor(cx + rx), y, 0, BLACK); // lacing
}
P(2, 14, 0, GOLD); // belt buckle
cube(1, 19, -2, 3, 19, 2, BLACK); // high collar
// potion vial + pouch on the belt
P(1, 12, -3, LIME); P(1, 13, -3, GLASS);
P(-1, 13, -3, BROWN); P(-1, 12, -3, BROWN);

// ================= HEAD (turned to face the viewer) =================
cube(0, 20, -2, 4, 24, 2, LIME);
cube(0, 20, 2, 4, 24, 2, ORANGE);     // back of head hair
cube(-1, 19, -2, -1, 24, 2, ORANGE);  // hair mass behind
cube(0, 21, -1, 0, 24, 2, ORANGE);    // west side hair
// face (z = -2)
for (let x = 0; x <= 4; x++) P(x, 24, -2, ORANGE); // fringe
P(0, 23, -2, ORANGE); P(4, 23, -2, ORANGE); P(0, 22, -2, ORANGE);
P(1, 23, -2, BLACK); P(3, 23, -2, BLACK);          // brows
P(1, 22, -2, NEON_RED); P(3, 22, -2, NEON_RED);    // glowing eyes
P(3, 21, -2, GREEN);                                // wart
P(1, 20, -2, BLACK); P(2, 20, -2, WHITE); P(3, 20, -2, BLACK); // cackle
// long hooked nose
P(2, 22, -3, LIME); P(2, 21, -3, LIME); P(2, 21, -4, LIME); P(2, 20, -5, LIME);
// pointy chin
P(2, 19, -2, LIME); P(2, 19, -3, LIME);
// ear + earring
P(5, 22, 0, LIME); P(5, 21, 0, GOLD);

// streaming hair
for (const z0 of [-2, -1, 0, 1, 2]) {
  for (const y0 of [20, 22, 24]) {
    const L = 6 + Math.floor(hs(z0, y0, 9) * 4);
    for (let i = 0; i <= L; i++) {
      const x = -2 - i;
      const y = y0 - i * 0.35 + Math.sin(i * 0.7 + z0 * 1.3 + y0) * 0.9;
      const z = z0 * (1 + i * 0.06);
      P(x, y, z, hs(x, R(y), R(z)) < 0.2 ? RED : ORANGE);
    }
  }
}

// ================= HAT (crooked, wind-bent) =================
for (let x = -3; x <= 7; x++) for (let z = -5; z <= 5; z++) {
  const d = Math.sqrt((x - 2) * (x - 2) + z * z);
  if (d > 4.2) continue;
  P(x, (d > 3.3 && hs(x, 25, z) < 0.3) ? 24 : 25, z, BLACK);
}
for (let i = 0; i <= 7; i++) {
  const y = 26 + i, r = 2.7 - i * 0.32, cx = 2 - 0.09 * i * i;
  for (let x = -6; x <= 6; x++) for (let z = -3; z <= 3; z++) {
    if ((x - cx) * (x - cx) + z * z <= r * r + 0.2) P(x, y, z, i <= 1 ? PURPLE : BLACK);
  }
  if (r < 0.9) P(cx, y, 0, BLACK);
}
cube(1, 26, -3, 3, 27, -3, GOLD); // buckle
P(-3, 33, 0, BLACK); P(-4, 32, 0, BLACK); P(-4, 31, 0, BLACK);
P(-4, 30, 0, GOLD); // star charm

// ================= CAPE (fluttering behind) =================
for (let u = 0; u <= 9; u++) {
  const x = -1 - u, w = 2.6 + u * 0.2;
  for (let z = -Math.ceil(w); z <= Math.ceil(w); z++) {
    if (Math.abs(z) > w) continue;
    if (u === 9 && hs(x, 5, z) > 0.5) continue;
    const yc = 18 - u * 0.55 + Math.sin(u * 0.9 - z * 0.5) * 0.8 - (z / w) * (z / w) * 2.4;
    P(x, yc, z, BLACK);
    P(x, yc - 1, z, PURPLE);
    if (Math.abs(z) >= w - 1) P(x, yc - 2, z, BLACK);
  }
}

// ================= ARMS =================
// south arm grips the broom
line(1, 18, 3, 4, 15, 2, PURPLE);
line(1, 17, 3, 4, 14, 2, PURPLE);
P(4, 14, 2, BLACK); P(4, 15, 2, BLACK);
P(5, 13, 1, LIME); P(5, 14, 1, LIME); P(5, 14, 0, LIME);
// north arm raised, casting with a wand
line(1, 18, -3, 4, 18, -4, PURPLE);
line(1, 17, -3, 4, 17, -4, PURPLE);
[[5, 19], [6, 20], [5, 18], [6, 19], [5, 17], [6, 17], [6, 18]].forEach(p => P(p[0], p[1], -4, PURPLE));
P(7, 19, -4, BLACK); P(7, 20, -4, BLACK); P(7, 18, -4, BLACK); // flared cuff
P(7, 21, -4, LIME); P(8, 21, -4, LIME);
line(8, 22, -4, 11, 25, -5, BROWN);
P(12, 26, -5, GLOWSTONE);

// magic spiral from the wand
const sparkCols = [MAGENTA, PINK, GLOWSTONE, NEON_BLUE, PINK, MAGENTA];
for (let i = 2; i <= 18; i++) {
  const a = i * 0.55, rad = 0.8 + i * 0.18;
  const x = 13 + i * 0.45, y = 27 + i * 0.15 + Math.sin(a) * rad, z = -5 + Math.cos(a) * rad;
  if (y > 33) continue;
  P(x, y, z, sparkCols[i % sparkCols.length]);
}
P(13, 27, -6, ELECTRIC); P(12, 28, -5, ELECTRIC); P(13, 26, -4, ELECTRIC);

// ================= BLACK CAT riding up front =================
cube(9, 14, -1, 11, 16, 0, BLACK);
cube(9, 17, -1, 11, 18, 0, BLACK);
P(9, 19, -1, BLACK); P(11, 19, -1, BLACK);
P(9, 18, -1, YELLOW); P(11, 18, -1, YELLOW);
P(10, 17, -1, PINK);
P(9, 14, -2, BLACK); P(11, 14, -2, BLACK);
P(10, 14, 1, BLACK); P(10, 15, 2, BLACK); P(10, 16, 2, BLACK); P(10, 17, 2, BLACK); P(11, 18, 2, BLACK);

// ================= JACK-O'-LANTERN hanging under the broom =================
cube(11, 9, -1, 13, 11, 1, ORANGE);
P(12, 12, 0, GREEN);
P(11, 11, -1, GLOWSTONE); P(13, 11, -1, GLOWSTONE);
P(11, 9, -1, GLOWSTONE); P(12, 9, -1, GLOWSTONE); P(13, 9, -1, GLOWSTONE);

// ================= BRISTLE MAGIC EXHAUST =================
const trail = [[-20, 12, -3], [-21, 9, 2], [-20, 16, 1], [-22, 14, 0], [-21, 15, -3], [-20, 6, 2],
  [-22, 10, -2], [-21, 11, 4], [-20, 14, 4], [-22, 16, 2], [-19, 16, -3], [-18, 15, 4], [-22, 7, 1], [-21, 17, -1]];
trail.forEach((p, i) => P(p[0], p[1], p[2], sparkCols[i % sparkCols.length]));
P(-22, 12, 1, ELECTRIC); P(-21, 8, -1, ELECTRIC);

// ================= BATS =================
const wingUp = [[1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [4, 3], [4, 2], [5, 3], [5, 2], [3, 1]];
const wingDown = [[1, 1], [2, 1], [3, 1], [3, 0], [4, 0], [4, -1], [5, 0], [2, 0], [5, -1]];
function bat(cx, cy, cz, up) {
  P(cx, cy, cz, BLACK); P(cx, cy + 1, cz, BLACK); P(cx, cy + 2, cz, BLACK);
  P(cx - 1, cy + 3, cz, BLACK); P(cx + 1, cy + 3, cz, BLACK);
  P(cx, cy + 2, cz - 1, NEON_RED);
  for (const s of [-1, 1]) for (const [dx, dy] of (up ? wingUp : wingDown)) P(cx + s * dx, cy + dy, cz, BLACK);
}
bat(17, 25, 8, true);
bat(-14, 27, 12, false);
bat(17, 17, 4, false);
bat(-17, 21, 2, true);
bat(-8, 29, 6, false);
bat(-16, 15, -6, false);

// ================= TWINKLING STARS =================
[[-19, 31, 21], [-15, 26, 22], [-21, 19, 21], [17, 32, 21], [20, 25, 22], [21, 31, 20],
 [-10, 33, 21], [12, 33, 22], [-20, 28, 21], [19, 13, 22], [-16, 17, 22], [15, 22, 21]]
  .forEach(p => P(p[0], p[1], p[2], GLOWSTONE));