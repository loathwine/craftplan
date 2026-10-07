// viking-funeral-haiku55 — prompt:
// a burning Viking funeral ship...

cube(-17, 0, -8, 17, 18, 10, AIR);

cube(-16, -1, -8, 16, -1, 1, SAND);
cube(-16, -1, 2, 16, -1, 9, WATER);

const noise = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
const plank = (x, y) => { const n = noise(x, y); return n > 0.82 ? BLACK : n < 0.18 ? OAK_LOG : PLANKS; };
const hw = (x) => Math.max(1, Math.round(3.4 * Math.sqrt(Math.max(0, 1 - (x / 13) ** 2))));
const hullTop = (x) => { const ax = Math.abs(x); return 3 + (ax > 8 ? Math.floor((ax - 8) * 0.9) : 0); };

line(0, 3, 0, 0, 17, 0, OAK_LOG);
block(0, 18, 0, GOLD);

for (let x = -12; x <= 12; x++) {
  const h = hw(x);
  const top = hullTop(x);
  for (let z = -h; z <= h; z++) {
    block(x, 0, z, z === 0 ? OAK_LOG : plank(x, 0));
    block(x, 1, z, plank(x, 1));
    block(x, 2, z, plank(x, 2));
  }
  for (let y = 3; y <= top; y++) {
    block(x, y, -h, plank(x, y));
    block(x, y, h, plank(x, y));
  }
  if (Math.abs(x) >= 6 && Math.abs(x) % 2 === 0) {
    line(x, 3, -h + 1, x, 3, h - 1, PLANKS);
  }
}

for (let i = -10; i <= 6; i += 4) {
  const z = -(Math.min(hw(i), hw(i + 1), hw(i + 2)) + 1);
  const color = (i + 10) / 4 % 2 === 0 ? RED : BLUE;
  cube(i, 3, z, i + 2, 4, z, color);
  block(i + 1, 3, z, GOLD);
}

line(-7, 16, 0, -12, 6, 0, BROWN);
line(7, 16, 0, 12, 6, 0, BROWN);
line(-7, 16, 0, 7, 16, 0, OAK_LOG);

for (let x = -6; x <= 6; x++) {
  const z = -Math.round(1.2 * (1 - (x / 6) ** 2));
  for (let y = 8; y <= 15; y++) {
    const n = noise(x, y);
    const holeChance = y <= 9 ? 0.25 : 0.1;
    if (n < holeChance) continue;
    block(x, y, z, n > 0.9 ? BLACK : (y % 3 === 0 ? RED : WHITE));
  }
}

cube(-5, 3, -1, 5, 3, 1, OAK_LOG);
cube(-4, 4, -1, 4, 4, 1, OAK_LOG);
line(-3, 5, 0, 3, 5, 0, OAK_LOG);

cube(-3, 5, -1, 2, 5, 1, BLUE);
block(-4, 5, 0, SAND);
block(-4, 6, 0, IRON);
block(-4, 5, -1, IRON);

block(-5, 3, 0, LAVA);
block(5, 3, 0, LAVA);
block(4, 4, 1, LAVA);

for (const [x, y, z] of [[-3, 6, -1], [-1, 6, 1], [1, 6, -1], [2, 6, 1], [-2, 6, 0], [-9, 4, 1], [-6, 4, -1], [6, 4, 1], [9, 4, -1], [-4, 6, 1]]) {
  block(x, y, z, FIRE);
}

line(12, 6, 0, 13, 9, 0, OAK_LOG);
cube(13, 9, -1, 15, 10, 1, GOLD);
block(16, 9, 0, GOLD);
block(17, 9, 0, GOLD);
block(16, 8, -1, WHITE);
block(14, 10, -2, NEON_RED);
block(13, 11, -1, IRON);
block(13, 11, 1, IRON);

line(-12, 6, 0, -14, 10, 0, OAK_LOG);
block(-14, 11, 0, OAK_LOG);
block(-15, 11, 0, OAK_LOG);

for (const x of [-14, -8, 8, 14]) {
  cube(x, -2, 13, x + 1, 7, 14, COBBLE);
  block(x, 3, 12, NEON_BLUE);
}