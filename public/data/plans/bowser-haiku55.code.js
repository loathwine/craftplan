// bowser-haiku55 — prompt:
// Bowser...

const SHELL = { c: [0, 14, 5], r: [8.5, 6.5, 5.5] };
const HEAD = { c: [0, 22, -1], r: [6, 5, 5] };

function nd(x, y, z, e) {
  return ((x - e.c[0]) / e.r[0]) ** 2 + ((y - e.c[1]) / e.r[1]) ** 2 + ((z - e.c[2]) / e.r[2]) ** 2;
}
function inShell(x, y, z) {
  const d = nd(x, y, z, SHELL);
  return d <= 1 && d > 0.5;
}
function headFaceZ(x, y) {
  const s = 1 - (x / 6) ** 2 - ((y - 22) / 5) ** 2;
  return Math.round(-1 - 5 * Math.sqrt(Math.max(0, s)));
}
function limbs(x1, x2) {
  cube(x1, 9, -3, x2, 13, -1, ORANGE);
  cube(x1, 6, -6, x2, 8, -3, ORANGE);
  cube(x1, 7, -6, x2, 7, -3, IRON);
  cube(x1, 4, -7, x2, 5, -4, ORANGE);
  for (let x = x1; x <= x2; x++) block(x, 4, -8, WHITE);
}
function legs(x1, x2) {
  cube(x1, 0, -3, x2, 5, 1, ORANGE);
  cube(x1, 0, -5, x2, 1, -3, ORANGE);
  block(x1, 0, -6, WHITE);
  block(x2, 0, -6, WHITE);
  block((x1 + x2) / 2, 0, -6, WHITE);
}

cube(-9, -1, -7, 9, -1, 7, COBBLE);

for (let x = -9; x <= 9; x++)
  for (let y = 7; y <= 21; y++)
    for (let z = -1; z <= 11; z++)
      if (inShell(x, y, z)) block(x, y, z, y <= 10 ? YELLOW : GREEN);

for (const x of [-6, -3, 0, 3, 6])
  for (const z of [2, 5, 8]) {
    let top = 0;
    for (let y = 21; y >= 8; y--) if (inShell(x, y, z)) { top = y; break; }
    if (top) { block(x, top + 1, z, YELLOW); block(x, top + 2, z, YELLOW); }
  }

for (const z of [2, 5, 8])
  for (const y of [12, 16]) {
    let out = 0;
    for (let x = 9; x >= 0; x--) if (inShell(x, y, z)) { out = x; break; }
    if (out) {
      block(out + 1, y, z, YELLOW);
      block(out + 2, y, z, YELLOW);
      block(-out - 1, y, z, YELLOW);
      block(-out - 2, y, z, YELLOW);
    }
  }

cube(-6, 6, -3, 6, 14, 2, ORANGE);
cube(-4, 7, -3, 4, 13, -3, YELLOW);

for (let x = -6; x <= 6; x++)
  for (let z = -3; z <= 2; z++)
    if (x === -6 || x === 6 || z === -3 || z === 2) block(x, 15, z, IRON);
for (const x of [-6, -3, 0, 3, 6]) block(x, 16, -3, IRON);
block(-6, 16, 0, IRON);
block(6, 16, 0, IRON);
cube(-4, 15, -2, 4, 17, 1, ORANGE);

for (let x = -6; x <= 6; x++)
  for (let y = 17; y <= 27; y++)
    for (let z = -6; z <= 4; z++)
      if (nd(x, y, z, HEAD) <= 1) block(x, y, z, ORANGE);

for (const x of [-4, -3, -2, 2, 3, 4])
  for (const y of [22, 23])
    block(x, y, headFaceZ(x, y), WHITE);
block(-3, 22, headFaceZ(-3, 22), NEON_RED);
block(3, 22, headFaceZ(3, 22), NEON_RED);
for (const [x, y] of [[-4, 25], [-3, 24], [-2, 24], [4, 25], [3, 24], [2, 24]])
  block(x, y, headFaceZ(x, y), BLACK);

cube(-3, 18, -7, 3, 21, -5, YELLOW);
cube(-2, 18, -7, 2, 19, -7, BLACK);
for (const x of [-2, 0, 2]) block(x, 19, -7, WHITE);
for (const x of [-1, 1]) block(x, 18, -7, WHITE);
block(-1, 20, -7, BLACK);
block(1, 20, -7, BLACK);

for (const s of [-1, 1]) {
  block(s * 4, 25, -1, WHITE);
  block(s * 4, 25, -2, WHITE);
  block(s * 5, 26, -1, WHITE);
  block(s * 5, 26, -2, WHITE);
  block(s * 5, 27, -1, WHITE);
  block(s * 6, 28, -1, WHITE);
  block(s * 6, 29, -1, WHITE);
  block(s * 7, 30, -1, WHITE);
}

cube(-2, 27, -2, 2, 27, 2, RED);
block(-1, 28, 0, RED);
block(1, 28, -1, RED);
block(0, 29, 1, RED);
block(-2, 28, 2, RED);
block(2, 28, -2, RED);
cube(-2, 24, 3, 2, 26, 4, RED);

limbs(7, 9);
limbs(-9, -7);
legs(-7, -3);
legs(3, 7);

cube(2, 6, 10, 4, 8, 13, ORANGE);
cube(3, 5, 13, 5, 7, 15, ORANGE);
cube(4, 4, 15, 6, 6, 18, ORANGE);
block(3, 9, 11, YELLOW);
block(5, 8, 13, YELLOW);
block(4, 7, 16, YELLOW);
block(5, 7, 18, YELLOW);

block(-1, 18, -9, FIRE);
block(1, 18, -9, FIRE);
block(0, 19, -10, FIRE);
block(-2, 18, -11, FIRE);
block(2, 18, -11, FIRE);