// frankenstein-haiku55 — prompt:
// Frankenstein's monster coming to life in the lab...

cube(-12, 1, -3, 12, 12, 10, AIR);

for (let x = -11; x <= 11; x++)
  for (let z = -3; z <= 9; z++)
    block(x, 0, z, (x + z) & 1 ? LIGHT_GRAY : WHITE);

for (let a = 0; a < 360; a += 4) {
  const r = (a * Math.PI) / 180;
  block(Math.round(8 * Math.cos(r)), 0, Math.round(2 + 5 * Math.sin(r)), YELLOW);
}

cube(-12, 0, 10, 12, 0, 10, BRICK);
cube(-12, 1, 10, 12, 10, 10, STONE);
cube(-12, 11, 10, 12, 11, 10, COBBLE);
for (const x of [-12, 12]) {
  cube(x, 0, -3, x, 0, 9, BRICK);
  cube(x, 1, -3, x, 10, 9, STONE);
  cube(x, 11, -3, x, 11, 9, COBBLE);
}

for (const [x0, x1] of [[-7, -3], [3, 7]]) {
  cube(x0, 4, 10, x1, 4, 10, IRON);
  cube(x0, 9, 10, x1, 9, 10, IRON);
  cube(x0, 5, 10, x0, 8, 10, IRON);
  cube(x1, 5, 10, x1, 8, 10, IRON);
  cube(x0 + 1, 5, 10, x1 - 1, 8, 10, GLASS);
}

cube(-5, 1, -1, 5, 1, 7, COBBLE);
cube(-5, 1, -1, 5, 1, -1, IRON);
cube(-5, 1, 7, 5, 1, 7, IRON);
cube(-5, 1, 0, -5, 1, 6, IRON);
cube(5, 1, 0, 5, 1, 6, IRON);
for (const [x, z] of [[-5, -1], [5, -1], [-5, 7], [5, 7]]) line(x, 2, z, x, 4, z, COPPER);

cube(-3, 2, 0, -1, 2, 1, BLACK);
cube(1, 2, 0, 3, 2, 1, BLACK);
cube(-3, 3, 0, -1, 8, 4, GRAY);
cube(1, 3, 0, 3, 8, 4, GRAY);
line(-2, 4, 0, -2, 7, 0, BLACK);
line(2, 4, 0, 2, 7, 0, BLACK);

cube(-4, 9, 0, 4, 16, 5, BLACK);
block(0, 9, -1, IRON);
cube(-1, 11, 0, 1, 15, 0, LIGHT_GRAY);
block(0, 12, -1, IRON);
block(0, 14, -1, IRON);
cube(-3, 13, 0, -2, 14, 0, LIME);

cube(-7, 13, 0, -5, 14, 1, BLACK);
cube(5, 13, 0, 7, 14, 1, BLACK);
block(-8, 13, 0, GREEN);
block(-8, 14, 0, IRON);
block(8, 13, 0, GREEN);
block(8, 14, 0, IRON);

cube(-2, 17, 1, 2, 17, 4, GREEN);
block(-3, 17, 2, IRON);
block(3, 17, 2, IRON);
block(-4, 17, 2, ELECTRIC);
block(4, 17, 2, ELECTRIC);

cube(-3, 18, 0, 3, 24, 6, GREEN);
cube(-3, 25, 0, 3, 25, 6, BLACK);
cube(-4, 22, 1, -4, 24, 5, BLACK);
cube(4, 22, 1, 4, 24, 5, BLACK);
block(-4, 20, 3, IRON);
block(4, 20, 3, IRON);

cube(-3, 22, 0, -1, 22, 0, BLACK);
cube(1, 22, 0, 3, 22, 0, BLACK);
block(-2, 21, 0, NEON_BLUE);
block(2, 21, 0, NEON_BLUE);
block(0, 20, -1, GREEN);
line(-2, 19, 0, 2, 19, 0, BLACK);
cube(1, 23, 0, 2, 23, 0, LIME);
block(-2, 23, 0, GRAY);

block(-2, 27, 3, ELECTRIC);
block(2, 27, 3, ELECTRIC);

line(0, 1, 9, 0, 26, 9, COPPER);
block(0, 27, 9, GLOWSTONE);
block(0, 28, 9, ELECTRIC);

for (const c of [-7, 7]) {
  cube(c - 1, 1, 6, c + 1, 2, 8, COPPER);
  line(c, 3, 7, c, 20, 7, IRON);
  for (const y of [6, 12, 18]) disk(c, y, 7, 1, COPPER);
  sphere(c, 22, 7, 2, GLOWSTONE);
  block(c, 26, 7, ELECTRIC);
}

for (const s of [-1, 1]) {
  const x0 = s < 0 ? -11 : 9;
  const x1 = s < 0 ? -9 : 11;
  cube(x0, 1, 6, x1, 3, 9, IRON);
  cube(x0, 1, 5, x1, 3, 5, BLACK);
  block(x0, 2, 5, NEON_RED);
  block(x1, 2, 5, NEON_BLUE);
  hollowCube(x0, 4, 6, x1, 6, 9, COPPER);
  cube(x0 + 1, 4, 7, x1 - 1, 5, 8, LIME);
}

const BOOKS = [RED, BLUE, GREEN, YELLOW, PURPLE, ORANGE, BROWN, CYAN];
cube(-11, 1, -2, -11, 4, 4, PLANKS);
cube(-10, 2, -2, -10, 2, 4, PLANKS);
cube(-10, 4, -2, -10, 4, 4, PLANKS);
for (let z = -2; z <= 4; z++) {
  block(-10, 1, z, BOOKS[(z + 2) % BOOKS.length]);
  block(-10, 3, z, BOOKS[(z + 5) % BOOKS.length]);
}

cube(10, 1, -2, 11, 1, 4, GRAY);
block(10, 2, 2, WATER);
block(11, 2, 3, LIME);
block(10, 2, 4, RED);
block(10, 2, -2, GLASS);
block(11, 2, -1, FIRE);
block(11, 2, 0, FIRE);

for (const [cx, fill] of [[-7, WATER], [7, LIME]]) {
  cube(cx - 1, 1, -2, cx + 1, 1, 0, IRON);
  hollowSphere(cx, 4, -1, 2, GLASS);
  sphere(cx, 4, -1, 1, fill);
}