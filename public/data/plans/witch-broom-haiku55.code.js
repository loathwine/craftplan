// witch-broom-haiku55 — prompt:
// a witch flying on a broomstick...

function ring(cx, y, cz, r, id) {
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    block(Math.round(cx + r * Math.cos(a)), y, Math.round(cz + r * Math.sin(a)), id);
  }
}

function bat(x, y, z) {
  [[-4,2],[-3,1],[-2,1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[2,1],[3,1],[4,2],[-1,-1],[0,-1],[1,-1]]
    .forEach(([dx, dy]) => block(x + dx, y + dy, z, BLACK));
}

function tomb(x, z) {
  cube(x, 0, z, x + 1, 1, z, COBBLE);
  cube(x, 2, z, x, 3, z, COBBLE);
}

const rnd = (n) => {
  const s = Math.sin(n * 91.345) * 43758.5453;
  return s - Math.floor(s);
};

// Night sky
for (let i = 0; i < 40; i++) {
  const x = Math.round(rnd(i) * 40 - 20);
  const z = Math.round(rnd(i + 100) * 40 - 20);
  const y = 25 + Math.floor(rnd(i + 200) * 8);
  if (Math.hypot(x + 6, y - 27, z - 16) < 7) continue;
  if (Math.hypot(x, y - 22, z) < 8) continue;
  block(x, y, z, WHITE);
}

// Moon (far background, south)
sphere(-6, 27, 16, 4, YELLOW);
block(-7, 28, 13, LIGHT_GRAY);
block(-4, 25, 13, LIGHT_GRAY);
block(-5, 30, 13, LIGHT_GRAY);

// Witch body
cube(-2, 11, -2, 2, 12, 2, PURPLE);
line(-2, 11, -2, 2, 11, -2, GOLD);
cube(-1, 13, -1, 1, 13, 1, PURPLE);
line(-1, 13, -2, 1, 13, -2, BLACK);
block(0, 13, -2, GOLD);
cube(-1, 14, -1, 1, 16, 1, PURPLE);
cube(-1, 14, -2, 1, 16, -2, BLACK);
block(0, 15, -2, GOLD);
block(0, 16, -2, GOLD);

// Arms
cube(-2, 14, -1, -2, 16, -1, PURPLE);
cube(2, 14, -1, 2, 16, -1, PURPLE);
block(-2, 13, -1, LIME);
block(2, 13, -1, LIME);

// Head and hair
block(0, 17, 0, LIME);
cube(-1, 18, -1, 1, 20, 1, LIME);
block(-1, 19, -1, NEON_RED);
block(1, 19, -1, NEON_RED);
block(0, 18, -2, BLACK);
cube(-2, 18, 0, -2, 19, 1, BLACK);
cube(2, 18, 0, 2, 19, 1, BLACK);
cube(-1, 17, 2, 1, 19, 2, BLACK);

// Hat
disk(0, 21, 0, 3, BLACK);
ring(0, 21, 0, 3, ORANGE);
cylinder(0, 22, 0, 2, 2, BLACK);
ring(0, 22, 0, 2, GOLD);
cylinder(-1, 24, -1, 1, 2, BLACK);
block(-2, 26, -2, BLACK);
block(-3, 27, -3, BLACK);

// Broom
line(-1, 10, 0, 6, 8, 10, OAK_LOG);
cube(5, 6, 11, 8, 9, 13, SAND);
cube(5, 7, 10, 7, 9, 10, BROWN);
block(8, 8, 10, GOLD);
block(8, 6, 14, MAGENTA);
block(10, 7, 17, PINK);
block(12, 8, 19, MAGENTA);
block(14, 9, 21, PINK);

// Black cat familiar on the handle
cube(2, 10, 4, 3, 11, 5, BLACK);
cube(2, 12, 2, 3, 13, 3, BLACK);
block(2, 14, 2, BLACK);
block(3, 14, 2, BLACK);
block(2, 13, 1, LIME);
block(3, 13, 1, LIME);
line(2, 11, 6, 1, 13, 8, BLACK);

// Ghost (foreground, west of witch)
sphere(-9, 12, -4, 2, WHITE);
cube(-11, 8, -4, -7, 8, -4, WHITE);
block(-10, 7, -4, WHITE);
block(-8, 7, -4, WHITE);
block(-10, 12, -5, BLACK);
block(-8, 12, -5, BLACK);
block(-9, 11, -5, BLACK);

// Bats
bat(-11, 17, -8);
bat(9, 21, -12);
bat(-16, 24, 2);
bat(14, 15, -3);

// Magic sparks
block(-4, 16, -3, NEON_BLUE);
block(4, 19, -2, NEON_BLUE);
block(-3, 23, -1, GLOWSTONE);

// Graveyard and pumpkin (ground, foreground)
tomb(-5, -6);
tomb(-1, -8);
tomb(4, -6);
tomb(8, -9);
cube(10, 0, -4, 11, 1, -3, ORANGE);
block(10, 1, -4, BLACK);
block(11, 1, -4, BLACK);