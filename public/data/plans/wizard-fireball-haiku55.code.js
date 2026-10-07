// wizard-fireball-haiku55 — prompt:
// a wizard casting a fireball...

cube(-7, 0, -13, 7, 30, 7, AIR);

for (let x = -7; x <= 7; x++)
  for (let z = -6; z <= 8; z++) {
    const d = Math.hypot(x, z - 1);
    if (d >= 6.2 && d <= 7.2) block(x, 0, z, LIGHT_BLUE);
  }
for (let i = 0; i < 8; i++) {
  const a = (i * Math.PI) / 4;
  block(Math.round(Math.cos(a) * 5.5), 0, 1 + Math.round(Math.sin(a) * 5.5), GLOWSTONE);
}

cube(-15, 0, 13, -10, 22, 18, COBBLE);
cube(-14, 1, 14, -11, 21, 17, AIR);
cube(-15, 22, 13, -10, 22, 18, BRICK);
for (let x = -15; x <= -10; x += 2) {
  block(x, 23, 13, BRICK);
  block(x, 23, 18, BRICK);
}
block(-13, 12, 13, GLOWSTONE);
block(-12, 17, 13, GLOWSTONE);

cube(9, 0, 14, 14, 30, 19, BRICK);
cube(10, 1, 15, 13, 29, 18, AIR);
cube(9, 31, 14, 14, 31, 19, STONE);
for (let x = 9; x <= 14; x += 2) {
  block(x, 32, 14, STONE);
  block(x, 32, 19, STONE);
}
block(11, 20, 14, GLOWSTONE);
block(12, 26, 14, GLOWSTONE);

sphere(-4, 28, 18, 3, WHITE);

cube(-2, 0, -1, -1, 0, 0, BLACK);
cube(1, 0, -1, 2, 0, 0, BLACK);
cube(-3, 1, -1, 3, 4, 3, PURPLE);
cube(-2, 5, -1, 2, 12, 2, PURPLE);
cube(-3, 1, -1, 3, 1, -1, GOLD);
cube(-2, 8, -1, 2, 8, -1, GOLD);
block(0, 8, -2, GOLD);
line(0, 2, -1, 0, 7, -1, GOLD);
block(-2, 3, -1, YELLOW);
block(2, 4, -1, YELLOW);
block(-1, 6, -1, YELLOW);
block(1, 10, -1, YELLOW);

line(-3, 12, 0, -4, 11, -3, PURPLE);
line(-3, 11, 0, -4, 10, -3, PURPLE);
line(3, 12, 0, 2, 11, -5, PURPLE);
line(3, 11, 0, 2, 10, -5, PURPLE);
block(-4, 11, -3, GOLD);
block(2, 11, -5, GOLD);
block(-4, 10, -3, SAND);
block(2, 10, -5, SAND);

cube(-5, 0, -3, -5, 25, -3, OAK_LOG);
sphere(-5, 27, -3, 2, LIGHT_BLUE);
hollowSphere(-5, 27, -3, 2, GOLD);
block(-5, 27, -3, GLOWSTONE);

cube(-2, 14, -1, 2, 18, 1, SAND);
cube(-2, 15, 0, -2, 18, 1, LIGHT_GRAY);
cube(2, 15, 0, 2, 18, 1, LIGHT_GRAY);
cube(-2, 18, 0, 2, 18, 1, LIGHT_GRAY);
block(-1, 16, -1, BLACK);
block(1, 16, -1, BLACK);
block(0, 15, -2, SAND);
cube(-2, 11, -2, 2, 13, -2, WHITE);
cube(-1, 10, -2, 1, 10, -2, WHITE);

disk(0, 19, 1, 4, PURPLE);
hollowCylinder(0, 19, 1, 4, 1, GOLD);
cylinder(0, 20, 1, 3, 3, PURPLE);
hollowCylinder(0, 20, 1, 3, 1, GOLD);
cylinder(0, 23, 1, 2, 2, PURPLE);
cylinder(0, 25, 1, 1, 1, PURPLE);
block(0, 26, 1, PURPLE);
block(1, 27, 2, PURPLE);
block(2, 28, 3, PURPLE);
block(0, 21, -2, YELLOW);
block(-2, 20, 0, YELLOW);

const FX = 1, FY = 11, FZ = -9;
sphere(FX, FY, FZ, 3, ORANGE);
sphere(FX, FY, FZ, 2, LAVA);
sphere(FX, FY, FZ, 1, GLOWSTONE);
for (let x = FX - 4; x <= FX + 4; x++)
  for (let y = FY - 4; y <= FY + 4; y++)
    for (let z = FZ - 4; z <= FZ + 4; z++) {
      const d = Math.hypot(x - FX, y - FY, z - FZ);
      const h = Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453) % 1;
      if (d > 2.5 && d <= 3.3 && h > 0.7) block(x, y, z, YELLOW);
    }
block(FX, FY + 4, FZ, FIRE);
block(FX - 3, FY + 2, FZ, FIRE);
block(FX + 3, FY + 2, FZ, FIRE);
block(FX - 2, FY - 3, FZ, FIRE);
block(FX + 2, FY - 3, FZ, FIRE);
block(FX + 1, FY, FZ + 4, FIRE);