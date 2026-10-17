// scarecrow-haiku55 — prompt:
// a creepy scarecrow in a pumpkin patch...

cube(-12, 0, -10, 12, 14, 10, AIR);
cube(-12, -1, -10, 12, -1, 10, GRASS);

let seed = 7;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

for (let i = 0; i < 8; i++) {
  const x = -10 + Math.floor(rnd() * 18);
  const z = -8 + Math.floor(rnd() * 12);
  cube(x, -1, z, x + 1 + Math.floor(rnd() * 2), -1, z + 1, DIRT);
}

function deadTree(x, z, h) {
  line(x, 0, z, x, h, z, OAK_LOG);
  for (const [y, dx] of [[h - 2, 2], [h - 4, -2], [h - 1, -1], [h - 3, 1]]) {
    line(x, y, z, x + dx, y + 1, z, OAK_LOG);
  }
}
deadTree(-9, 9, 11);
deadTree(7, 9, 13);
deadTree(-2, 8, 8);

for (let x = -12; x <= 12; x += 3) line(x, 0, 6, x, 4, 6, OAK_LOG);
line(-12, 1, 6, 12, 1, 6, PLANKS);
line(-12, 3, 6, 12, 3, 6, PLANKS);

for (let x = -11; x <= 11; x += 2) {
  const h = 4 + Math.floor(rnd() * 3);
  line(x, 0, 4, x, h, 4, GREEN);
  block(x + 1, h - 2, 4, LIME);
  if (h > 5) block(x - 1, h - 4, 4, LIME);
  block(x, h + 1, 4, YELLOW);
}

function pumpkin(cx, cz, r, carved) {
  sphere(cx, r, cz, r, ORANGE);
  block(cx, 2 * r + 1, cz, GREEN);
  if (carved) {
    const zf = cz - r + 1;
    block(cx - 1, r, zf, GLOWSTONE);
    block(cx + 1, r, zf, GLOWSTONE);
    line(cx - 1, r - 1, zf, cx + 1, r - 1, zf, BLACK);
  }
}

const placed = [];
for (let i = 0; i < 90 && placed.length < 55; i++) {
  const x = -10 + rnd() * 20;
  const z = -8 + rnd() * 6;
  if (Math.abs(x) < 5 && z > -6) continue;
  const r = rnd() < 0.2 ? 3 : rnd() < 0.55 ? 2 : 1;
  if (placed.some((p) => Math.hypot(p.x - x, p.z - z) < p.r + r - 1)) continue;
  placed.push({ x, z, r });
  pumpkin(Math.round(x), Math.round(z), r, r >= 2 && rnd() < 0.4);
}

cube(-9, 0, -3, -6, 1, -1, YELLOW);
cube(-8, 2, -2, -7, 2, -2, YELLOW);
cube(6, 0, -4, 9, 1, -2, YELLOW);

line(0, 0, 1, 0, 15, 1, OAK_LOG);
cube(-2, 1, 0, -1, 8, 2, BLUE);
cube(1, 1, 0, 2, 8, 2, BLUE);
cube(-2, 0, 0, -1, 0, 2, BLACK);
cube(1, 0, 0, 2, 0, 2, BLACK);
cube(-2, 9, 0, 2, 14, 2, BROWN);
line(-2, 11, 0, 2, 11, 0, ORANGE);
block(-2, 14, 0, AIR);
block(2, 9, 0, AIR);
cube(-1, 15, 0, 1, 15, 2, BROWN);

line(-9, 12, 1, 9, 12, 1, OAK_LOG);
cube(-6, 11, 0, -3, 13, 2, BROWN);
cube(3, 11, 0, 6, 13, 2, BROWN);
cube(-9, 10, 0, -7, 11, 2, YELLOW);
cube(7, 10, 0, 9, 11, 2, YELLOW);
block(-6, 10, 0, YELLOW);
block(5, 10, 2, YELLOW);

cube(-2, 16, -2, 2, 19, 2, ORANGE);
block(-1, 18, -2, NEON_RED);
block(1, 18, -2, NEON_RED);
block(0, 17, -2, BLACK);
line(-1, 16, -2, 1, 16, -2, BLACK);

disk(0, 20, 0, 4, BLACK);
cube(-2, 21, -2, 2, 23, 2, BLACK);
line(-2, 21, -2, 2, 21, -2, RED);
line(-2, 21, 2, 2, 21, 2, RED);
line(-2, 21, -2, -2, 21, 2, RED);
line(2, 21, -2, 2, 21, 2, RED);

block(-3, 19, 0, YELLOW);
block(3, 19, 1, YELLOW);
block(-3, 18, 1, YELLOW);
block(3, 17, -1, YELLOW);
block(-2, 16, 3, YELLOW);

block(-9, 13, 1, BLACK);
block(9, 13, 1, BLACK);
block(3, 21, -2, BLACK);
block(-6, 5, 6, BLACK);
block(9, 5, 6, BLACK);
block(7, 2, -3, BLACK);
block(-5, 0, -6, BLACK);
block(4, 0, -8, BLACK);