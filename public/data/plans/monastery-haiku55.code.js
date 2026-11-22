// monastery-haiku55 — prompt:
// a Tibetan monastery on a snowy peak...

// Tibetan monastery on a snowy peak. Front (door, gate, stupas) faces north (-Z).

const ring = (x1, y1, z1, x2, y2, z2, id) => {
  for (let y = y1; y <= y2; y++) {
    cube(x1, y, z1, x2, y, z1, id);
    cube(x1, y, z2, x2, y, z2, id);
    cube(x1, y, z1, x1, y, z2, id);
    cube(x2, y, z1, x2, y, z2, id);
  }
};
const flagColor = (i) => [BLUE, WHITE, RED, GREEN, YELLOW][((i % 5) + 5) % 5];
const winN = (x, y, z) => {
  cube(x, y, z, x, y + 1, z, AIR);
  line(x - 1, y + 2, z, x + 1, y + 2, z, BLACK);
  block(x, y - 1, z, BLACK);
};
const winX = (x, y, z) => {
  cube(x, y, z, x, y + 1, z, AIR);
  line(x, y + 2, z - 1, x, y + 2, z + 1, BLACK);
  block(x, y - 1, z, BLACK);
};
const stupa = (x, z) => {
  cube(x - 1, 3, z - 1, x + 1, 3, z + 1, RED);
  sphere(x, 5, z, 2, WHITE);
  line(x, 8, z, x, 10, z, GOLD);
  block(x, 11, z, GOLD);
};

// 1. Plinth terrace and the snowy massif behind it
cube(-9, 0, -8, 9, 1, 8, STONE);
cube(-9, 2, -8, 9, 2, 8, COBBLE);
cube(-6, 0, 9, 6, 8, 15, STONE);      // lower massif
cube(-4, 9, 10, 4, 13, 14, STONE);    // middle tier
cube(-2, 14, 11, 2, 24, 14, STONE);   // spire
cube(-6, 8, 9, 6, 8, 15, SNOW);       // snowfield on massif shoulder
cube(-4, 13, 10, 4, 13, 14, SNOW);    // middle tier cap
cube(-2, 22, 11, 2, 24, 14, SNOW);    // summit snow

// 2. Main gompa hall
const HX1 = -6, HX2 = 6, HZ1 = -3, HZ2 = 6;
cube(HX1, 3, HZ1, HX2, 3, HZ2, COBBLE);     // floor
ring(HX1, 3, HZ1, HX2, 4, HZ2, STONE);      // battered stone plinth
ring(HX1, 5, HZ1, HX2, 13, HZ2, WHITE);     // whitewashed walls
ring(HX1, 6, HZ1, HX2, 6, HZ2, RED);        // maroon bands
ring(HX1, 11, HZ1, HX2, 11, HZ2, RED);

// door and north windows
cube(-1, 4, -3, 1, 6, -3, AIR);
line(-2, 4, -3, -2, 7, -3, BLACK);
line(2, 4, -3, 2, 7, -3, BLACK);
line(-2, 7, -3, 2, 7, -3, BLACK);
winN(-4, 8, -3);
winN(4, 8, -3);

// roof: eaves, slab, gilded trim, snow drift
cube(-7, 14, -4, 7, 14, 7, GRAY);
line(-7, 14, -4, 7, 14, -4, GOLD);
cube(-6, 15, -3, 6, 15, 6, GRAY);
line(-6, 15, -3, 6, 15, -3, GOLD);
cube(-5, 16, -2, 5, 16, 5, SNOW);

// clerestory tower
ring(-3, 17, -2, 3, 19, 2, WHITE);
ring(-3, 17, -2, 3, 17, 2, GOLD);
cube(-2, 18, -2, -2, 18, -2, AIR);
cube(2, 18, -2, 2, 18, -2, AIR);
cube(-4, 20, -3, 4, 20, 3, GRAY);
line(-4, 20, -3, 4, 20, -3, GOLD);
line(0, 21, 0, 0, 23, 0, GOLD);
block(0, 24, 0, GOLD);

// 3. Side annexes (monks' cells)
ring(7, 3, -3, 9, 8, 6, WHITE);
ring(7, 6, -3, 9, 6, 6, RED);
cube(7, 9, -3, 9, 9, 6, GRAY);
cube(7, 10, -3, 9, 10, 6, SNOW);
ring(-9, 3, -3, -7, 8, 6, WHITE);
ring(-9, 6, -3, -7, 6, 6, RED);
cube(-9, 9, -3, -7, 9, 6, GRAY);
cube(-9, 10, -3, -7, 10, 6, SNOW);
winX(9, 5, 1);
winX(-9, 5, 1);

// 4. Courtyard wall with gate, steps and lamps
cube(-9, 3, -8, -3, 5, -8, WHITE);
cube(3, 3, -8, 9, 5, -8, WHITE);
cube(-9, 6, -8, 9, 6, -8, RED);
line(-2, 6, -8, 2, 6, -8, GOLD);
block(-2, 5, -8, GLOWSTONE);
block(2, 5, -8, GLOWSTONE);
cube(-2, 0, -10, 2, 0, -10, COBBLE);
cube(-2, 0, -9, 2, 1, -9, COBBLE);

// 5. Stupas and prayer flags
stupa(-5, -6);
stupa(5, -6);
line(-9, 3, -7, -9, 9, -7, BROWN);
line(9, 3, -7, 9, 9, -7, BROWN);
for (let x = -8; x <= 8; x++) block(x, 8, -7, flagColor(x + 9));