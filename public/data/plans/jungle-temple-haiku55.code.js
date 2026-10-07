// jungle-temple-haiku55 — prompt:
// a jungle temple with a waterfall...

const rnd = (() => { let s = 20240611; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const cliffTop = z => (z >= -3 && z <= -1 ? 17 : 15 + Math.round(2 * Math.sin(z * 0.6)));

const trees = [[-20, -9, 9, 2], [-20, 5, 8, 2], [-8, -14, 10, 3], [6, -14, 9, 3], [15, -12, 11, 3], [18, -3, 10, 3], [18, 9, 12, 3], [-4, 13, 9, 3], [12, 12, 10, 3]];
for (const [x, z, h, r] of trees) {
  cube(x, 0, z, x, h, z, OAK_LOG);
  sphere(x, h + 2, z, r, LEAVES);
}

for (let i = 0; i < 40; i++) {
  const x = Math.round(-21 + rnd() * 42);
  const z = Math.round(-13 + rnd() * 26);
  if (x >= -19 && x <= 12 && z >= -11 && z <= 8) continue;
  block(x, 0, z, rnd() < 0.2 ? LIME : LEAVES);
}

for (let z = -9; z <= 9; z++) {
  const h = cliffTop(z);
  cube(-18, 0, z, -16, h - 1, z, STONE);
  cube(-18, h, z, -16, h, z, GRASS);
  cube(-18, h + 1, z, -16, h + 3, z, AIR);
  if (z < -3 || z > -1) {
    const len = 3 + Math.floor(rnd() * 6);
    for (let y = Math.max(1, h - len); y < h; y++) block(-15, y, z, LEAVES);
  }
}
cube(-18, 17, -3, -16, 17, -1, WATER);
cube(-15, 0, -3, -15, 17, -1, WATER);

cube(-15, -1, -4, -10, -1, 0, COBBLE);
cube(-14, 0, -4, -10, 0, -4, COBBLE);
cube(-14, 0, 0, -10, 0, 0, COBBLE);
cube(-10, 0, -3, -10, 0, -1, COBBLE);
cube(-14, 0, -3, -11, 0, -1, WATER);

cube(-9, 0, -6, 9, 13, 6, AIR);
cube(-2, 4, -10, 2, 8, -7, AIR);
cube(-9, -1, -6, 9, -1, 6, COBBLE);

cube(-9, 0, -6, 9, 0, 6, COBBLE);
cube(-9, 3, -6, 9, 3, 6, COBBLE);
for (const y of [1, 2]) {
  cube(-9, y, -6, 9, y, -5, COBBLE);
  cube(-9, y, 5, 9, y, 6, COBBLE);
  cube(-9, y, -4, -8, y, 4, COBBLE);
  cube(8, y, -4, 9, y, 4, COBBLE);
}
cube(-1, 1, -7, 1, 2, -5, AIR);
block(0, 2, 2, GLOWSTONE);

for (let z = -10; z <= -7; z++) cube(-2, 0, z, 2, z + 10, z, COBBLE);

for (const x of [-7, -4, 4, 7]) {
  cube(x, 0, -8, x, 4, -8, OAK_LOG);
  block(x, 5, -8, BRICK);
}
block(-7, 6, -8, FIRE);
block(7, 6, -8, FIRE);

cube(-6, 4, -4, 6, 4, 4, STONE);
for (const y of [5, 6]) {
  cube(-6, y, -4, 6, y, -3, STONE);
  cube(-6, y, 3, 6, y, 4, STONE);
  cube(-6, y, -2, -5, y, 2, STONE);
  cube(5, y, -2, 6, y, 2, STONE);
}
cube(-1, 5, -4, 1, 6, -3, AIR);
cube(-6, 7, -4, 6, 7, 4, STONE);

cube(-3, 8, -2, 3, 8, 2, BRICK);
for (const y of [9, 10]) {
  cube(-3, y, -2, 3, y, -2, BRICK);
  cube(-3, y, 2, 3, y, 2, BRICK);
  cube(-3, y, -1, -3, y, 1, BRICK);
  cube(3, y, -1, 3, y, 1, BRICK);
}
cube(-3, 11, -2, 3, 11, 2, BRICK);
block(0, 9, 0, GOLD);
block(0, 10, 0, GOLD);
block(0, 12, 0, GOLD);

for (let i = 0; i < 14; i++) {
  const x = -9 + Math.floor(rnd() * 19);
  const z = -6 + Math.floor(rnd() * 13);
  if (Math.abs(x) <= 6 && Math.abs(z) <= 4) continue;
  block(x, 4, z, LEAVES);
}
for (let i = 0; i < 8; i++) {
  const x = -6 + Math.floor(rnd() * 13);
  const z = -4 + Math.floor(rnd() * 9);
  if (Math.abs(x) <= 3 && Math.abs(z) <= 2) continue;
  block(x, 8, z, LEAVES);
}
block(-5, 8, -3, FIRE);
block(5, 8, -3, FIRE);

for (let i = 0; i < 12; i++) {
  const x = -12 + Math.floor(rnd() * 25);
  const z = -11 - Math.floor(rnd() * 3);
  block(x, 0, z, rnd() < 0.5 ? COBBLE : STONE);
}