// ghost-ship-haiku55 — prompt:
// a ghost pirate ship...

const H = BLACK, TRIM = IRON, DECK = PLANKS, SPAR = GRAY, GLOW = NEON_BLUE;
const SAIL = WHITE, SAIL_DIM = LIGHT_GRAY;
const mainZ = -5, foreZ = -12;

function rnd(x, y, z, s) {
  const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + s * 19.19) * 43758.5453;
  return v - Math.floor(v);
}

function hw(z) {
  if (z > 1) return 3;
  if (z >= -13) return 4;
  return Math.max(0, Math.round(4 - (-13 - z) * 0.6));
}

function ghost(x, y, z) {
  block(x, y, z, H);
  block(x, y + 1, z, SAIL_DIM);
  block(x, y + 2, z, SAIL_DIM);
  block(x, y + 3, z, H);
  block(x, y + 2, z - 1, GLOW);
}

function yard(z, y, half) {
  line(-half, y, z - 1, half, y, z - 1, SPAR);
}

function sail(z, y0, y1, half) {
  for (let y = y0 + 1; y < y1; y++) {
    for (let x = -half + 1; x <= half - 1; x++) {
      const r = rnd(x, y, z, 2);
      if (r < 0.12) continue;
      block(x, y, z - 1, r < 0.4 ? SAIL_DIM : SAIL);
    }
  }
}

cube(-8, 0, -21, 8, 30, 4, AIR);
cube(-7, -1, -20, 7, -1, 3, COBBLE);

for (let x = -10; x <= 10; x++)
  for (let y = 12; y <= 30; y++)
    for (let z = -21; z <= 0; z++)
      if (rnd(x, y, z, 9) < 0.012) block(x, y, z, LIGHT_BLUE);

for (let z = -18; z <= 2; z++) {
  const w = hw(z);
  for (let x = -w; x <= w; x++) {
    for (let y = 0; y <= 2; y++) block(x, y, z, rnd(x, y, z, 1) < 0.12 ? SPAR : H);
    block(x, 3, z, Math.abs(x) === w ? TRIM : DECK);
  }
}

for (const z of [-13, -10, -7, -4]) {
  const w = hw(z);
  block(w, 2, z, GLOW);
  block(-w, 2, z, GLOW);
}
for (const z of [-15, -11, -8]) {
  const w = hw(z);
  block(w + 1, 1, z, IRON);
  block(-w - 1, 1, z, IRON);
}

line(0, 0, -19, 0, 2, -19, H);
cube(-1, 3, -20, 1, 6, -19, LIGHT_GRAY);
block(-1, 5, -20, GLOW);
block(1, 5, -20, GLOW);
block(-1, 4, -20, H);
block(1, 4, -20, H);
block(-1, 7, -19, SPAR);
block(1, 7, -19, SPAR);
line(0, 2, -22, 0, 2, -20, DECK);

for (let x = -3; x <= 3; x++) {
  for (let z = -3; z <= 2; z++) {
    for (let y = 4; y <= 6; y++) {
      const wall = Math.abs(x) === 3 || z === -3 || z === 2;
      const window = y === 5 && ((z === -3 && Math.abs(x) === 2) || (z === 2 && x === 0));
      if (wall && !window) block(x, y, z, H);
    }
    block(x, 7, z, H);
  }
}
block(-2, 5, -2, GLOW);
block(2, 5, -2, GLOW);
block(0, 5, 1, GLOWSTONE);
ghost(0, 8, 0);

line(0, 4, mainZ, 0, 27, mainZ, H);
line(0, 4, foreZ, 0, 21, foreZ, H);

yard(mainZ, 9, 6);
yard(mainZ, 17, 6);
yard(mainZ, 24, 5);
sail(mainZ, 9, 17, 6);
sail(mainZ, 17, 24, 6);

yard(foreZ, 8, 5);
yard(foreZ, 15, 5);
yard(foreZ, 20, 4);
sail(foreZ, 8, 15, 5);
sail(foreZ, 15, 20, 4);

for (const [x, y, z] of [[6, 8, mainZ - 1], [-6, 8, mainZ - 1], [6, 16, mainZ - 1], [-6, 16, mainZ - 1],
                         [5, 7, foreZ - 1], [-5, 7, foreZ - 1], [5, 14, foreZ - 1], [-5, 14, foreZ - 1]]) {
  block(x, y, z, GLOWSTONE);
}

line(0, 25, mainZ - 2, -4, 3, mainZ - 2, SPAR);
line(0, 25, mainZ - 2, 4, 3, mainZ - 2, SPAR);
line(0, 20, foreZ - 2, -3, 3, foreZ - 2, SPAR);
line(0, 20, foreZ - 2, 3, 3, foreZ - 2, SPAR);

cube(1, 25, mainZ, 4, 27, mainZ, H);
cube(2, 26, mainZ, 3, 27, mainZ, WHITE);
block(2, 26, mainZ, GLOW);
block(3, 26, mainZ, GLOW);

block(0, 28, mainZ, ELECTRIC);
block(0, 22, foreZ, ELECTRIC);

block(-3, 4, -11, BROWN);
block(-3, 4, -7, BROWN);
block(3, 4, -12, BROWN);

for (const [x, z] of [[-2, -14], [2, -14], [-2, -9], [2, -9], [-1, -7], [1, -16]]) {
  ghost(x, 4, z);
}