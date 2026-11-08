// flying-city-opus — prompt:
// a steampunk flying city...

const DY = 15, CX = 0, CZ = 2, RX = 15, RZ = 12;
function ell(x, z, s) { const a = (x - CX) / (RX * s), b = (z - CZ) / (RZ * s); return a * a + b * b; }
function walls(x1, y1, z1, x2, y2, z2, id) {
  for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) for (let z = z1; z <= z2; z++)
    if (x === x1 || x === x2 || z === z1 || z === z2) block(x, y, z, id);
}
function corners(x1, z1, x2, z2, y1, y2, id) {
  for (const [x, z] of [[x1, z1], [x2, z1], [x1, z2], [x2, z2]]) line(x, y1, z, x, y2, z, id);
}

// ===== DECK =====
for (let x = -RX; x <= RX; x++) for (let z = CZ - RZ; z <= CZ + RZ; z++) {
  const e = ell(x, z, 1);
  if (e > 1) continue;
  let id = PLANKS;
  if (e > 0.8) id = COPPER;
  else if (Math.abs(x) <= 4 && z >= -3 && z <= 7) id = STONE;
  else if (Math.abs(x) <= 1 || Math.abs(z - CZ) <= 1) id = COBBLE;
  else if (((x + 40) * 3 + (z + 40)) % 7 === 0) id = BROWN;
  block(x, DY, z, id);
}

// ===== HULL (riveted inverted dome) =====
for (let k = 1; k <= 7; k++) {
  const s = 1 - k * 0.12, si = s - 0.17, y = DY - k;
  for (let x = -RX; x <= RX; x++) for (let z = CZ - RZ; z <= CZ + RZ; z++) {
    if (ell(x, z, s) > 1) continue;
    if (si > 0.02 && ell(x, z, si) <= 1) continue;
    let id;
    if (k === 1) id = COPPER;
    else if (k === 2) id = (z <= CZ - 5 && (x + 30) % 3 === 0) ? GLOWSTONE : IRON;
    else if (k === 3 || k === 4) id = ((x + z + 40) % 4 === 0) ? IRON : BROWN;
    else if (k === 5) id = COPPER;
    else if (k === 6) id = IRON;
    else id = BROWN;
    block(x, y, z, id);
  }
}
block(0, 7, 2, COPPER);
block(0, 6, 2, GLOWSTONE);

// ===== RAILING =====
for (let x = -RX; x <= RX; x++) for (let z = CZ - RZ; z <= CZ + RZ; z++) {
  const e = ell(x, z, 1);
  if (e <= 1 && e > 0.86) {
    if (z < CZ - 8 && Math.abs(x) <= 1) continue;
    block(x, DY + 1, z, ((x + z + 40) % 5 === 0) ? GOLD : IRON);
  }
}

// ===== FRONT PIER =====
cube(-1, DY, -15, 1, DY, -10, PLANKS);
line(0, DY - 1, -14, 0, DY - 4, -7, IRON);
for (const px of [-1, 1]) {
  line(px, DY + 1, -15, px, DY + 3, -15, IRON);
  block(px, DY + 4, -15, GLOWSTONE);
}

// ===== CLOCK TOWER =====
walls(-3, DY + 1, -1, 3, DY + 2, 5, COBBLE);
block(0, 16, -1, BROWN); block(0, 17, -1, BROWN);
walls(-2, 18, 0, 2, 28, 4, BRICK);
corners(-2, 0, 2, 4, 18, 28, COPPER);
walls(-2, 22, 0, 2, 22, 4, COPPER);
for (const y of [19, 20]) {
  block(0, y, 0, GLOWSTONE);
  block(-2, y, 2, GLOWSTONE);
  block(2, y, 2, GLOWSTONE);
}
function clock(cx, cy, cz, onX) {
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) {
    const d = Math.hypot(a, b);
    if (d > 2.6) continue;
    let id = d > 1.5 ? GOLD : WHITE;
    if ((a === 0 && b === 1) || (a === 1 && b === 0) || (a === 0 && b === 0)) id = BLACK;
    if (onX) block(cx, cy + b, cz + a, id); else block(cx + a, cy + b, cz, id);
  }
}
clock(0, 25, -1, false);
clock(3, 25, 2, true);
walls(-3, 29, -1, 3, 29, 5, COPPER);
corners(-2, 0, 2, 4, 30, 30, IRON);
block(0, 30, 2, GLOWSTONE);
cube(-2, 31, 0, 2, 31, 4, COPPER);
cube(-1, 32, 1, 1, 32, 3, COPPER);
block(0, 33, 2, GOLD);

// ===== FACTORY (front-west) =====
walls(-11, 16, -5, -6, 20, 0, BRICK);
corners(-11, -5, -6, 0, 16, 20, IRON);
for (const x of [-10, -7]) { block(x, 17, -5, GLOWSTONE); block(x, 18, -5, GLOWSTONE); }
cube(-9, 16, -5, -8, 17, -5, BROWN);
line(-10, 20, -5, -7, 20, -5, GOLD);
cube(-11, 21, -5, -6, 21, 0, GRAY);
line(-11, 22, -4, -6, 22, -4, GLASS);
line(-11, 22, -3, -6, 22, -3, GRAY);
line(-11, 22, -1, -6, 22, -1, GLASS);
line(-11, 22, 0, -6, 22, 0, GRAY);
cylinder(-10, 22, -2, 1, 6, BRICK);
cylinder(-10, 26, -2, 1, 1, IRON);
cylinder(-7, 22, -2, 1, 4, BRICK);
cylinder(-7, 24, -2, 1, 1, IRON);
block(-10, 28, -2, STEAM);
block(-7, 26, -2, STEAM);
line(-5, 19, -1, -3, 19, -1, COPPER);
block(-3, 19, 0, COPPER);
block(-4, 20, -1, GOLD);

// ===== OBSERVATORY (front-east) =====
const OX = 9, OZ = -3;
for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) {
  const d = Math.hypot(dx, dz);
  if (d <= 2.7 && d > 1.7) for (let y = 16; y <= 19; y++) block(OX + dx, y, OZ + dz, y === 19 ? GOLD : MARBLE);
}
block(OX, 17, OZ - 2, GLOWSTONE); block(OX, 18, OZ - 2, GLOWSTONE);
block(OX + 2, 17, OZ, GLOWSTONE);
for (let dx = -3; dx <= 3; dx++) for (let dy = 0; dy <= 3; dy++) for (let dz = -3; dz <= 3; dz++) {
  const d = Math.hypot(dx, dy, dz);
  if (d <= 3.2 && d > 2.2) block(OX + dx, 20 + dy, OZ + dz, (dx + dz === 0 && dx >= 0) ? BLACK : COPPER);
}
line(OX, 21, OZ, OX + 4, 25, OZ - 4, IRON);
line(OX + 1, 22, OZ - 1, OX + 3, 24, OZ - 3, GOLD);
block(OX + 4, 25, OZ - 4, GLASS);

// ===== TESLA COIL =====
cube(12, 16, 0, 14, 16, 2, IRON);
line(13, 17, 1, 13, 21, 1, COPPER);
for (const y of [18, 20]) { block(12, y, 1, GOLD); block(14, y, 1, GOLD); block(13, y, 0, GOLD); block(13, y, 2, GOLD); }
sphere(13, 23, 1, 1, IRON);
block(13, 25, 1, ELECTRIC);
block(15, 23, 1, ELECTRIC);
block(11, 24, 0, ELECTRIC);

// ===== TOWNHOUSE A (back-west, brick, gable) =====
walls(-11, 16, 4, -8, 21, 8, BRICK);
corners(-11, 4, -8, 8, 16, 21, BROWN);
block(-10, 17, 4, GLOWSTONE); block(-10, 19, 4, GLOWSTONE); block(-9, 19, 4, GLOWSTONE); block(-10, 20, 4, GLOWSTONE);
block(-9, 16, 4, BROWN); block(-9, 17, 4, BROWN);
cube(-12, 22, 4, -7, 22, 8, GRAY);
cube(-11, 23, 4, -8, 23, 8, GRAY);
cube(-10, 24, 4, -9, 24, 8, OBSIDIAN);
line(-8, 24, 5, -8, 25, 5, BRICK);
block(-8, 26, 5, STEAM);

// ===== TOWNHOUSE B (timber frame, tall) =====
walls(-7, 16, 5, -4, 24, 9, PLANKS);
corners(-7, 5, -4, 9, 16, 24, BROWN);
walls(-7, 20, 5, -4, 20, 9, BROWN);
for (const x of [-6, -5]) {
  block(x, 17, 5, GLASS); block(x, 18, 5, GLASS);
  block(x, 22, 5, GLOWSTONE); block(x, 23, 5, GLOWSTONE);
}
cube(-8, 25, 5, -3, 25, 9, COPPER);
cube(-7, 26, 5, -4, 26, 9, COPPER);

// ===== WORKSHOP + GIANT GEAR (back-east) =====
walls(6, 16, 4, 11, 21, 9, GRAY);
corners(6, 4, 11, 9, 16, 21, COPPER);
for (const x of [7, 10]) { block(x, 18, 4, GLOWSTONE); block(x, 19, 4, GLOWSTONE); }
cube(8, 16, 4, 9, 17, 4, BROWN);
cube(6, 22, 4, 11, 22, 9, IRON);
cube(7, 23, 4, 10, 23, 9, IRON);
cube(8, 24, 4, 9, 24, 9, COPPER);
line(7, 24, 7, 7, 24, 7, IRON);
block(7, 25, 7, STEAM);
line(9, 25, 4, 9, 27, 4, IRON);
const GX = 9, GY = 27, GZ = 3;
for (let dx = -5; dx <= 5; dx++) for (let dy = -5; dy <= 5; dy++) {
  const d = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
  let id = null;
  if (d <= 1.2) id = COPPER;
  else if (d >= 2.6 && d <= 3.6) id = GOLD;
  else if (d > 3.6 && d <= 4.8 && Math.cos(ang * 8) > 0.3) id = GOLD;
  else if (d < 2.6 && (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))) id = IRON;
  if (id !== null) block(GX + dx, GY + dy, GZ, id);
}

// ===== PLAZA DETAILS =====
line(4, 16, -6, 4, 18, -6, IRON); block(4, 19, -6, GLOWSTONE);
line(-4, 16, -6, -4, 18, -6, OAK_LOG);
sphere(-4, 20, -6, 1.6, LEAVES);
cube(-1, 16, 10, 0, 17, 11, PLANKS);
block(1, 16, 11, BROWN); block(2, 16, 10, BROWN); block(1, 17, 11, BROWN);
block(-6, 16, -7, BROWN); block(-5, 16, -7, BROWN);

// ===== PROPELLER PODS =====
for (const sx of [-1, 1]) {
  const px = 13 * sx, py = 12;
  for (let z = -8; z <= 3; z++) {
    const id = ((z + 30) % 3 === 0) ? COPPER : IRON;
    block(px, py, z, id); block(px + 1, py, z, id); block(px - 1, py, z, id);
    block(px, py + 1, z, id); block(px, py - 1, z, id);
  }
  block(px, py, -9, COPPER);
  block(px, py, -10, GOLD);
  for (let a = 0; a < 4; a++) {
    const ang = a * Math.PI / 2 + 0.35 * sx;
    const cx = Math.cos(ang), cy = Math.sin(ang);
    for (let t = 1; t <= 4; t++) {
      block(Math.round(px + cx * t), Math.round(py + cy * t), -10, t === 4 ? GOLD : PLANKS);
      if (t >= 2 && t <= 3) block(Math.round(px + cx * t - cy * 0.7), Math.round(py + cy * t + cx * 0.7), -10, PLANKS);
    }
  }
}

// ===== MAIN ENVELOPE (dirigible balloon) =====
const EY = 29.5, EZ = 11, EL = 13.5, ER = 3.6;
for (let x = -13; x <= 13; x++) {
  const r = ER * Math.sqrt(Math.max(0, 1 - (x / EL) * (x / EL)));
  if (r < 0.6) continue;
  for (let y = Math.floor(EY - r); y <= Math.ceil(EY + r); y++) for (let z = Math.floor(EZ - r) - 1; z <= Math.ceil(EZ + r) + 1; z++) {
    const d = Math.hypot(y - EY, z - EZ);
    if (d > r) continue;
    const cap = Math.abs(x) >= 12;
    if (!cap && d < r - 1.2) continue;
    let id = (Math.abs(x) % 4 === 1) ? BROWN : RED;
    if (cap) id = GOLD;
    block(x, y, z, id);
  }
}
for (let i = 0; i < 4; i++) {
  line(13 + i, 30, EZ, 13 + i, 33 - i, EZ, BROWN);
  line(13 + i, 29, EZ - 3 + i, 13 + i, 29, EZ + 3 - i, BROWN);
}
for (const x of [-9, -3, 3, 9]) {
  const top = Math.abs(x) > 6 ? 26 : 25;
  line(x, 16, EZ, x, top, EZ, BROWN);
  block(x, 16, EZ, IRON);
}

// ===== MINI AIRSHIP (foreground, moored to pier) =====
const MX = -17, MY = 26, MZ = -13;
for (let x = MX - 4; x <= MX + 4; x++) {
  const dx = x - MX;
  const r = 2.6 * Math.sqrt(Math.max(0, 1 - (dx / 4.7) * (dx / 4.7)));
  for (let y = MY - 3; y <= MY + 3; y++) for (let z = MZ - 3; z <= MZ + 3; z++) {
    const d = Math.hypot(y - MY, z - MZ);
    if (d > r) continue;
    if (Math.abs(dx) < 4 && d < r - 1.2) continue;
    block(x, y, z, Math.abs(dx) === 2 ? BROWN : (Math.abs(dx) === 4 ? GOLD : ORANGE));
  }
}
cube(-19, 21, -14, -15, 21, -12, BROWN);
line(-19, 22, -14, -15, 22, -14, PLANKS);
line(-19, 22, -12, -15, 22, -12, PLANKS);
block(-17, 22, -13, GLOWSTONE);
line(-19, 22, -13, -19, 23, -13, BROWN);
line(-15, 22, -13, -15, 23, -13, BROWN);
block(-12, 26, -13, GOLD);
block(-12, 27, -13, PLANKS); block(-12, 28, -13, PLANKS);
block(-12, 25, -13, PLANKS); block(-12, 24, -13, PLANKS);
block(-12, 26, -12, PLANKS); block(-12, 26, -14, PLANKS);
line(-15, 21, -13, -2, 17, -15, BROWN);