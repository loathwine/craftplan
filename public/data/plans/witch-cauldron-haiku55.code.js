// witch-cauldron-haiku55 — prompt:
// a witch brewing a glowing potion in her cauldron...

function disc(cx, y, cz, r, id) {
  for (let x = cx - r; x <= cx + r; x++)
    for (let z = cz - r; z <= cz + r; z++)
      if ((x - cx) ** 2 + (z - cz) ** 2 <= r * r + 0.5) block(x, y, z, id);
}
function ring(cx, y, cz, ro, ri, id) {
  for (let x = cx - ro; x <= cx + ro; x++)
    for (let z = cz - ro; z <= cz + ro; z++) {
      const d = (x - cx) ** 2 + (z - cz) ** 2;
      if (d <= ro * ro + 0.5 && d > ri * ri + 0.5) block(x, y, z, id);
    }
}

cube(-7, 0, -8, 11, 20, 6, AIR);

for (let x = -7; x <= 11; x++)
  for (let z = -8; z <= 6; z++)
    block(x, -1, z, (x * 3 + z * 5) % 4 === 0 ? STONE : COBBLE);

for (let x = -7; x <= 11; x++)
  for (let y = 0; y <= 12; y++)
    block(x, y, 6, (x * 7 + y * 13) % 5 === 0 ? STONE : COBBLE);

for (let x = -4; x <= 0; x++)
  for (let y = 7; y <= 11; y++) {
    const edge = x === -4 || x === 0 || y === 7 || y === 11;
    block(x, y, 6, edge || x === -2 || y === 9 ? PLANKS : GLASS);
  }

block(9, 11, 5, IRON); block(9, 10, 5, GLOWSTONE);
block(-6, 11, 5, IRON); block(-6, 10, 5, GLOWSTONE);

const BOOKS = [RED, BLUE, GREEN, YELLOW, PURPLE, BROWN, ORANGE, CYAN, LIGHT_BLUE, MAGENTA];
for (let y = 0; y <= 8; y++)
  for (let z = -8; z <= -2; z++) {
    block(-7, y, z, PLANKS);
    block(-6, y, z, y % 2 === 0 ? PLANKS : BOOKS[(z + 8 + y) % BOOKS.length]);
  }

for (const x of [8, 10]) for (const z of [-5, -1]) cube(x, 0, z, x, 2, z, OAK_LOG);
cube(8, 3, -5, 10, 3, -1, PLANKS);
block(8, 4, -4, RED); block(9, 4, -4, LIGHT_BLUE); block(10, 4, -4, YELLOW);
block(8, 4, -2, PINK); block(9, 4, -2, BROWN); block(10, 4, -2, GLOWSTONE);

cube(7, 0, 2, 9, 0, 2, BLACK);
cube(9, 1, 1, 10, 2, 2, BLACK);
block(9, 3, 1, BLACK); block(10, 3, 1, BLACK);
block(9, 2, 1, YELLOW); block(10, 2, 1, YELLOW);

const CX = -2, CZ = -3;
ring(CX, 0, CZ, 3, 2, COBBLE);
disc(CX, 0, CZ, 2, BLACK);
line(-4, 0, -3, 0, 0, -3, OAK_LOG);
line(-2, 0, -5, -2, 0, -1, OAK_LOG);
for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]])
  block(CX + dx, 1, CZ + dz, FIRE);
disc(CX, 2, CZ, 3, BLACK);
for (let y = 2; y <= 5; y++) ring(CX, y, CZ, 3, 2, BLACK);
ring(CX, 6, CZ, 3, 2, GOLD);
for (let y = 3; y <= 6; y++) disc(CX, y, CZ, 2, LIME);
block(CX, 6, CZ, GLOWSTONE);
block(CX - 1, 6, CZ + 1, GLOWSTONE);
block(CX, 7, CZ, LIME);
block(CX, 8, CZ, GLOWSTONE);

cube(2, 0, 1, 6, 1, 3, PURPLE);
cube(2, 0, 1, 6, 0, 1, GOLD);
cube(3, 2, 1, 5, 5, 3, PURPLE);
for (let y = 2; y <= 5; y++) { block(3, y, 1, MAGENTA); block(5, y, 1, MAGENTA); }
cube(3, 6, 1, 5, 6, 3, BLACK);
block(4, 6, 1, GOLD);
cube(3, 7, 1, 5, 9, 3, PURPLE);
block(4, 7, 1, GOLD); block(4, 8, 1, GOLD);
cube(6, 7, 1, 6, 9, 2, PURPLE);
block(6, 6, 1, PINK);
line(2, 9, 1, 0, 8, 0, PURPLE);
line(0, 8, 0, -1, 7, -2, OAK_LOG);

cube(3, 10, 1, 5, 12, 3, PINK);
cube(3, 10, 3, 5, 12, 3, BLACK);
block(3, 12, 2, BLACK); block(5, 12, 2, BLACK);
block(3, 11, 1, BLACK); block(5, 11, 1, BLACK);
block(4, 10, 1, RED);

disc(4, 13, 2, 4, BLACK);
disc(4, 14, 2, 3, BLACK);
ring(4, 14, 2, 3, 2, PURPLE);
block(4, 14, -1, GOLD);
disc(4, 15, 2, 2, BLACK);
disc(4, 16, 2, 1, BLACK);
line(4, 17, 2, 6, 19, 4, BLACK);

block(-3, 10, -4, GLOWSTONE);
block(1, 11, -4, GLOWSTONE);
block(-4, 12, -1, GLOWSTONE);

sphere(-14, 26, 12, 3, WHITE);
block(-6, 31, 14, WHITE); block(4, 30, 16, WHITE); block(10, 28, 12, WHITE);
block(-20, 27, 8, WHITE); block(12, 31, 18, WHITE);