// scarecrow-opus — prompt:
// a creepy scarecrow in a pumpkin patch...

let seed = 4242;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

// ---------- clear the site: surrounding trees become stumps, patch fully cleared ----------
cylinder(0, 2, 0, 19, 9, AIR);
cube(-18, 2, -22, 18, 10, -15, AIR);
cube(-15, 0, -14, 15, 10, 13, AIR);

// ---------- ground: tilled rows running north-south ----------
for (let x = -15; x <= 15; x++) for (let z = -14; z <= 13; z++) {
  const row = ((x + 16) % 4) < 2;
  block(x, -1, z, row ? DIRT : GRASS);
}
// trodden path from gate to scarecrow
for (let z = -14; z <= -3; z++) for (let x = -1; x <= 1; x++) {
  block(x, -1, z, rnd() < 0.35 ? COBBLE : DIRT);
}
// vines along tilled rows
for (let x = -15; x <= 15; x++) for (let z = -13; z <= 7; z++) {
  if (((x + 16) % 4) >= 2) continue;
  if (x >= -2 && x <= 2) continue;
  const r = rnd();
  if (r < 0.22) block(x, 0, z, GREEN);
  else if (r < 0.30) block(x, 0, z, LEAVES);
}

// ---------- pumpkins ----------
function inside(dx, dy, dz, rx, ry, rz) {
  const a = dx / (rx + 0.5), b = dy / (ry + 0.5), c = dz / (rz + 0.5);
  return a * a + b * b + c * c <= 1;
}
function faceCell(dx, dy, rx, ry) {
  const ax = Math.abs(dx);
  if (rx >= 4) {
    if (dy === 1 && ax >= 1 && ax <= 3) return true;
    if (dy === 2 && ax === 2) return true;
    if (dy === 0 && dx === 0) return true;
    if (dy === -1 && ax <= 3 && ax !== 2) return true;
    if (dy === -2 && ax <= 2 && ax !== 0) return true;
    return false;
  }
  if (rx === 3) {
    if (dy === 1 && (ax === 1 || ax === 2)) return true;
    if (dy === -1 && ax <= 2 && ax !== 1) return true;
    return false;
  }
  if (dy === 1 && ax === 1) return true;
  if (dy === -1 && ax <= 1) return true;
  return false;
}
function pumpkin(cx, cz, rx, ry, rz, type) {
  const cy = ry;
  for (let dx = -rx; dx <= rx; dx++) for (let dy = -ry; dy <= ry; dy++) for (let dz = -rz; dz <= rz; dz++) {
    if (!inside(dx, dy, dz, rx, ry, rz)) continue;
    const shell = !inside(dx + 1, dy, dz, rx, ry, rz) || !inside(dx - 1, dy, dz, rx, ry, rz) ||
      !inside(dx, dy + 1, dz, rx, ry, rz) || !inside(dx, dy - 1, dz, rx, ry, rz) ||
      !inside(dx, dy, dz + 1, rx, ry, rz) || !inside(dx, dy, dz - 1, rx, ry, rz);
    if (!shell) {
      if (type === 'lit' && dx === 0 && dy === 0 && dz === 0) block(cx, cy, cz, GLOWSTONE);
      continue;
    }
    let id = ORANGE;
    if (type === 'rot') {
      const r = rnd();
      id = r < 0.35 ? BROWN : r < 0.45 ? GREEN : r < 0.55 ? BLACK : ORANGE;
    } else if (dy === -ry && rnd() < 0.5) id = BROWN;
    const front = dz < 0 && !inside(dx, dy, dz - 1, rx, ry, rz);
    if (type === 'lit' && front && faceCell(dx, dy, rx, ry)) id = GLOWSTONE;
    block(cx + dx, cy + dy, cz + dz, id);
  }
  const top = cy + ry + 1;
  block(cx, top, cz, type === 'rot' ? BLACK : OAK_LOG);
  if (rx >= 2) block(cx + 1, top + 1, cz, type === 'rot' ? BROWN : GREEN);
  if (type !== 'rot') {
    block(cx - rx - 1, 0, cz + 1, LEAVES);
    block(cx + rx + 1, 0, cz - 1, GREEN);
  }
}
const P = [
  [-8, -9, 4, 3, 3, 'lit'],
  [8, -10, 3, 2, 3, 'lit'],
  [-12, -1, 2, 2, 2, 'plain'],
  [12, -2, 2, 2, 2, 'plain'],
  [-5, -4, 1, 1, 1, 'plain'],
  [12, -7, 2, 1, 1, 'plain'],
  [-13, -12, 2, 1, 1, 'rot'],
  [13, -12, 1, 1, 1, 'plain'],
  [-10, 5, 3, 2, 2, 'lit'],
  [10, 4, 2, 2, 2, 'lit'],
  [-4, 5, 2, 1, 2, 'plain'],
  [5, 6, 1, 1, 1, 'rot'],
  [-4, -12, 1, 1, 1, 'plain'],
  [3, -8, 1, 1, 1, 'plain'],
  [-13, -6, 1, 1, 1, 'plain'],
  [13, 2, 1, 1, 1, 'rot'],
];
for (const p of P) pumpkin(p[0], p[1], p[2], p[3], p[4], p[5]);
// smashed pumpkin in the path
block(-1, 0, -6, ORANGE); block(0, 0, -7, ORANGE); block(1, 0, -6, YELLOW); block(0, 0, -5, ORANGE);

// ---------- scarecrow ----------
cube(-1, 0, 1, 1, 0, 3, BROWN); // packed earth mound
line(0, -3, 2, 0, 12, 2, OAK_LOG);
line(-10, 10, 0, 10, 10, 0, OAK_LOG);

// dangling, uneven legs
cube(-2, 1, -1, -1, 4, 0, BLUE);
cube(1, 2, -1, 2, 4, 0, BLUE);
block(-2, 3, -1, PLANKS); block(-1, 2, -1, PLANKS); // knee patch
block(2, 3, -1, BLACK); // tear
// straw spilling from the cuffs
block(-2, 0, -1, YELLOW); block(-1, 0, 0, YELLOW); block(-1, 0, -2, YELLOW);
block(1, 1, -1, YELLOW); block(2, 1, 0, YELLOW); block(2, 0, -1, YELLOW); block(3, 1, -1, YELLOW);
// waistband
cube(-3, 5, -2, 3, 5, 1, BLUE);
// flannel shirt (shell)
for (let x = -3; x <= 3; x++) for (let y = 6; y <= 11; y++) for (let z = -2; z <= 1; z++) {
  const edge = x === -3 || x === 3 || z === -2 || z === 1 || y === 11;
  if (!edge) continue;
  const stripe = ((x + 30) % 3 === 0) || ((y + 30) % 3 === 0);
  block(x, y, z, stripe ? BLACK : RED);
}
// overall bib + straps
cube(-2, 5, -3, 2, 8, -3, BLUE);
line(-2, 9, -3, -2, 11, -3, BLUE);
line(2, 9, -3, 2, 11, -3, BLUE);
block(-2, 8, -3, GOLD); block(2, 8, -3, GOLD);
block(1, 6, -3, PURPLE); block(-1, 7, -3, LIGHT_BLUE);
block(0, 6, -3, BLACK);

// sagging sleeves
for (const s of [-1, 1]) {
  for (let ax = 4; ax <= 8; ax++) {
    const x = s * ax;
    const yTop = ax <= 6 ? 11 : 10;
    for (let y = 9; y <= yTop; y++) for (let z = -1; z <= 1; z++) {
      if (ax === 8 && rnd() < 0.3) continue;
      const stripe = ((ax + 30) % 3 === 0) || ((y + 30) % 3 === 0);
      block(x, y, z, stripe ? BLACK : RED);
    }
    if (rnd() < 0.5) block(x, 8, ax % 2 ? -1 : 0, rnd() < 0.5 ? RED : BLACK);
    if (rnd() < 0.25) block(x, 7, ax % 2 ? -1 : 0, BLACK);
  }
  // straw hands, limp fingers
  const hx = s * 9;
  cube(hx, 9, -1, hx, 10, 0, YELLOW);
  block(hx, 8, -1, YELLOW); block(hx, 7, -1, YELLOW);
  block(hx + s, 8, 0, YELLOW); block(hx, 8, 1, YELLOW);
  block(hx, 6, -1, SAND);
  block(hx + s, 7, 0, SAND);
}

// neck rope + straw tufts
cube(-1, 12, -1, 1, 12, 1, BROWN);
for (const c of [[-2, 0], [2, -1], [0, -2], [-2, -2], [2, 1], [1, -2]]) block(c[0], 12, c[1], YELLOW);
block(-1, 11, -3, YELLOW); block(1, 11, -3, YELLOW);

// burlap sack head (solid, rounded edges, cinched at the neck)
for (let x = -3; x <= 3; x++) for (let y = 13; y <= 18; y++) for (let z = -3; z <= 3; z++) {
  const lim = y === 13 ? 2 : 3;
  if (Math.abs(x) > lim || Math.abs(z) > lim) continue;
  const ex = Math.abs(x) === lim, ez = Math.abs(z) === lim, ey = y === 18;
  if ((ex && ez) || (ex && ey) || (ez && ey)) continue;
  block(x, y, z, PLANKS);
}
// face (front = -Z)
block(-2, 16, -3, NEON_RED); block(-1, 16, -3, NEON_RED); block(-2, 17, -3, NEON_RED);
block(1, 16, -3, NEON_RED); block(2, 16, -3, NEON_RED);
block(-1, 17, -3, BLACK); block(1, 17, -3, BLACK); block(2, 17, -3, BLACK);
block(-2, 15, -3, BLACK); block(2, 15, -3, BLACK);
for (let x = -2; x <= 2; x++) block(x, 14, -3, BLACK);
block(-1, 13, -2, BLACK); block(1, 13, -2, BLACK);
block(0, 15, -4, BROWN);
// stitched burlap patch on the cheek
cube(3, 14, -1, 3, 15, 0, BROWN); block(3, 16, 0, BLACK); block(3, 13, -1, BLACK);

// floppy witch hat
for (let x = -5; x <= 5; x++) for (let z = -5; z <= 5; z++) {
  const r = Math.hypot(x, z);
  if (r > 5.3) continue;
  let y = 19;
  if (r > 4.2) y = 18;
  if (r > 4.2 && z < -3) y = 17;
  block(x, y, z, BLACK);
}
for (let y = 20; y <= 28; y++) {
  const t = (y - 20) / 8;
  const rad = 3.2 * (1 - t);
  const ox = Math.round(t * t * 4);
  const oz = Math.round(t * 1.5);
  for (let x = -4; x <= 4; x++) for (let z = -4; z <= 4; z++) {
    if (Math.hypot(x, z) > rad + 0.3) continue;
    block(x + ox, y, z + oz, y === 20 ? PURPLE : BLACK);
  }
}
block(5, 28, 2, BLACK); block(6, 27, 2, BLACK); block(6, 26, 2, BLACK);
block(-2, 22, -2, GRAY); block(-1, 23, -2, GRAY);
block(3, 20, -2, GOLD);

// ---------- crows ----------
function perched(x, y, z) {
  block(x, y, z, OBSIDIAN); block(x, y, z + 1, OBSIDIAN);
  block(x, y + 1, z, BLACK); block(x, y + 1, z - 1, BLACK);
  block(x, y + 1, z - 2, GRAY);
  block(x, y, z + 2, BLACK); block(x, y + 1, z + 2, BLACK);
}
function flying(x, y, z) {
  block(x, y, z, OBSIDIAN); block(x, y, z + 1, OBSIDIAN); block(x, y, z - 1, BLACK);
  block(x, y, z - 2, GRAY); block(x, y, z + 2, BLACK);
  for (let i = 1; i <= 3; i++) {
    const wy = y + (i === 3 ? 1 : 0);
    block(x - i, wy, z, BLACK); block(x + i, wy, z, BLACK);
    if (i < 3) { block(x - i, wy, z + 1, BLACK); block(x + i, wy, z + 1, BLACK); }
  }
  block(x - 4, y + 2, z, BLACK); block(x + 4, y + 2, z, BLACK);
}
perched(-10, 11, 0);
perched(10, 11, -1);
perched(-4, 19, -2);
flying(-9, 23, -5);
flying(9, 26, 4);
flying(-3, 30, 6);

// ---------- dead tree with hanging lantern (back-left) ----------
cube(-14, 0, 9, -13, 11, 10, OAK_LOG);
block(-15, 0, 9, OAK_LOG); block(-12, 0, 10, OAK_LOG); block(-14, 0, 11, OAK_LOG);
line(-13, 10, 9, -8, 15, 6, OAK_LOG);
line(-8, 15, 6, -6, 15, 5, OAK_LOG);
line(-14, 11, 10, -19, 17, 8, OAK_LOG);
line(-19, 17, 8, -21, 20, 8, OAK_LOG);
line(-13, 11, 10, -11, 19, 13, OAK_LOG);
line(-11, 19, 13, -9, 22, 14, OAK_LOG);
line(-14, 8, 10, -18, 11, 13, OAK_LOG);
line(-16, 14, 9, -17, 16, 4, OAK_LOG);
line(-10, 17, 12, -8, 18, 15, OAK_LOG);
line(-19, 17, 8, -19, 19, 5, OAK_LOG);
line(-7, 14, 6, -7, 12, 6, IRON);
block(-7, 11, 6, IRON); block(-7, 10, 6, GLOWSTONE); block(-7, 9, 6, IRON);
perched(-11, 20, 13);
perched(-19, 18, 6);

// ---------- dried corn behind ----------
for (const z of [8, 10, 12]) for (let x = -10; x <= 13; x += 2) {
  if (rnd() < 0.2) continue;
  const xx = x + (z === 10 ? 1 : 0);
  if (xx >= -1 && xx <= 1 && z === 8) continue;
  const h = 3 + Math.floor(rnd() * 3);
  for (let y = 0; y < h; y++) block(xx, y, z, SAND);
  block(xx, h, z, YELLOW);
  const ly = 1 + Math.floor(rnd() * (h - 1));
  block(xx + (rnd() < 0.5 ? 1 : -1), ly, z, BROWN);
  if (rnd() < 0.5) block(xx, ly + 1, z - 1, YELLOW);
}

// ---------- rickety fence with torch-lit gate ----------
function fenceSeg(x, z, post) {
  if (post) { block(x, 0, z, OAK_LOG); block(x, 1, z, OAK_LOG); if (rnd() < 0.6) block(x, 2, z, OAK_LOG); }
  else {
    if (rnd() > 0.15) block(x, 1, z, PLANKS);
    if (rnd() < 0.4) block(x, 0, z, PLANKS);
  }
}
for (let x = -15; x <= 15; x++) {
  if (x < -1 || x > 1) fenceSeg(x, -14, (x + 15) % 3 === 0);
  fenceSeg(x, 13, (x + 15) % 3 === 0);
}
for (let z = -13; z <= 12; z++) {
  fenceSeg(-15, z, (z + 14) % 3 === 0);
  fenceSeg(15, z, (z + 14) % 3 === 0);
}
for (const gx of [-2, 2]) {
  cube(gx, 0, -14, gx, 3, -14, OAK_LOG);
  block(gx, 4, -14, FIRE);
}
line(-1, 1, -16, 1, 1, -16, PLANKS);

// ---------- pitchfork stuck in the ground ----------
for (const tx of [5, 6, 7]) block(tx, 0, -5, IRON);
line(5, 1, -5, 7, 1, -5, IRON);
line(6, 2, -5, 6, 8, -5, OAK_LOG);