// graveyard-zombie-haiku55 — prompt:
// a zombie rising from a graveyard...

const rnd = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };

cube(-10, -2, -8, 10, -2, 8, DIRT);
cube(-10, -1, -8, 10, -1, 8, GRASS);
cube(-10, 0, -8, 10, 16, 8, AIR);

for (let x = -10; x <= 10; x++) {
  for (let z = -8; z <= 8; z++) {
    const r = rnd(x, z);
    if (r < 0.10) block(x, -1, z, DIRT);
    else if (r < 0.22) block(x, 0, z, LIME);
    else if (r > 0.95) block(x, 0, z, PINK);
  }
}
for (let x = -7; x <= 7; x++) {
  for (let z = -4; z <= 7; z++) {
    if (rnd(z, x + 40) < 0.2) block(x, 0, z, DIRT);
  }
}

cube(-10, 0, 8, 10, 1, 8, COBBLE);
cube(-10, 0, -8, -10, 1, 7, COBBLE);
cube(10, 0, -8, 10, 1, 7, COBBLE);
for (let x = -9; x <= 9; x++) {
  if (rnd(x, 77) < 0.25) block(x, 1, 8, AIR);
}

cube(-7, -1, -8, -6, -1, 2, COBBLE);

cube(-9, 0, 3, -4, 6, 7, STONE);
cube(-8, 1, 4, -5, 5, 6, AIR);
cube(-7, 0, 3, -6, 2, 3, AIR);
block(-8, 3, 3, GLASS);
block(-5, 3, 3, GLASS);
block(-9, 3, 5, GLASS);
block(-4, 3, 5, GLASS);
block(-6, 3, 7, GLASS);
cube(-10, 7, 2, -3, 7, 8, BRICK);
cube(-9, 8, 2, -4, 8, 8, BRICK);
cube(-8, 9, 2, -5, 9, 8, BRICK);
cube(-9, 7, 3, -8, 12, 4, STONE);
cube(-9, 13, 3, -8, 13, 4, COBBLE);
line(-8, 14, 3, -8, 17, 3, GOLD);
block(-9, 16, 3, GOLD);
block(-7, 16, 3, GOLD);

function tomb(x, z, h, id) {
  cube(x - 1, 0, z, x + 1, h - 1, z, id);
  block(x, h, z, id);
}
function deadTree(x, z, h) {
  line(x, 0, z, x, h, z, OAK_LOG);
  block(x + 1, h - 2, z, OAK_LOG);
  block(x + 2, h - 1, z, OAK_LOG);
  block(x - 1, h - 3, z, OAK_LOG);
  block(x - 2, h, z, OAK_LOG);
}
tomb(-7, -5, 4, STONE);
tomb(-4, -7, 2, COBBLE);
tomb(0, -6, 2, COBBLE);
tomb(2, -8, 3, STONE);
tomb(7, -6, 3, COBBLE);
tomb(7, -3, 3, STONE);
tomb(-8, 1, 5, STONE);
tomb(4, 6, 4, COBBLE);
tomb(9, 4, 3, STONE);
deadTree(-9, -6, 8);
deadTree(9, -7, 7);

cube(-4, 0, -2, 4, 0, 5, DIRT);
cube(-4, 1, -1, 4, 1, 5, DIRT);
cube(-3, 2, 0, 3, 2, 4, DIRT);
cube(-3, 3, 0, -3, 3, 4, DIRT);
cube(3, 3, 0, 3, 3, 4, DIRT);

cube(-2, 3, 1, 2, 5, 3, BLUE);
cube(-2, 6, 1, 2, 6, 3, BROWN);
cube(-2, 7, 1, 2, 10, 3, CYAN);
cube(1, 8, 1, 2, 9, 1, GREEN);
cube(-4, 9, 1, -3, 10, 3, CYAN);
cube(3, 9, 1, 4, 10, 3, CYAN);

function arm(x0, x1) {
  const ys = [9, 8, 6, 5, 4, 2, 1];
  for (let k = 0; k < ys.length; k++) {
    const z = 2 - k;
    const y = ys[k];
    cube(x0, y - 1, z, x1, y, z, k < 2 ? CYAN : GREEN);
  }
  cube(x0, 0, -5, x1, 0, -4, GREEN);
}
arm(-4, -3);
arm(3, 4);

cube(-1, 11, 1, 1, 11, 3, GREEN);
cube(-2, 12, 0, 2, 16, 4, GREEN);
block(-1, 14, 0, NEON_RED);
block(1, 14, 0, NEON_RED);
line(-2, 15, 0, -1, 15, 0, BLACK);
line(1, 15, 0, 2, 15, 0, BLACK);
cube(-1, 12, 0, 1, 12, 0, BLACK);
block(-1, 13, 0, WHITE);
block(1, 13, 0, WHITE);
block(2, 13, 2, BLACK);
block(-2, 13, 3, BLACK);
block(-2, 16, 0, BLACK);
block(0, 16, 1, BLACK);
block(2, 16, 3, BLACK);
block(-1, 17, 2, BLACK);
block(1, 17, 1, GRAY);

block(-5, 5, -2, DIRT);
block(5, 7, -4, DIRT);
block(-6, 2, -3, DIRT);
block(4, 11, -6, DIRT);

line(6, 0, 0, 6, 0, 2, WHITE);
block(6, 0, -1, WHITE);

block(-5, 0, -6, FIRE);
block(8, 0, -1, FIRE);

sphere(6, 25, 18, 3, MARBLE);