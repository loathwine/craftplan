// viking-funeral-sonnet — prompt:
// a burning Viking funeral ship...

cube(-10, -3, -21, 10, 14, 16, AIR);

cube(-18, 0, -21, 18, 0, 19, WATER);

function hullHalfWidth(z) {
  const z0 = -1, halfLen = 13, maxHW = 3.6;
  const t = (z - z0) / halfLen;
  const val = 1 - t * t;
  if (val <= 0) return 0;
  return Math.max(0, Math.round(maxHW * Math.sqrt(val)));
}

for (let z = -13; z <= 11; z++) {
  const hw = hullHalfWidth(z);
  if (hw <= 0) continue;
  const kw = Math.max(hw - 2, 1);
  line(-kw, -2, z, kw, -2, z, OAK_LOG);
  line(-hw, -1, z, hw, -1, z, PLANKS);
  line(-hw, 0, z, hw, 0, z, PLANKS);
  line(-hw, 1, z, hw, 1, z, PLANKS);
  block(-hw, 2, z, OAK_LOG);
  block(hw, 2, z, OAK_LOG);
}

const sideZs = [-8, -6, -4, -2, 0, 2, 4, 6];
const shieldColors = [RED, WHITE, YELLOW];
sideZs.forEach((z, i) => {
  const hw = hullHalfWidth(z);
  const c = shieldColors[i % shieldColors.length];
  block(hw + 1, 2, z, c);
  block(hw + 1, 3, z, c);
  block(-(hw + 1), 2, z, c);
  block(-(hw + 1), 3, z, c);
});
const oarZs = [-8, -5, -2, 1, 4];
oarZs.forEach((z) => {
  const hw = hullHalfWidth(z);
  line(hw + 1, 1, z, hw + 5, -1, z, PLANKS);
  line(-(hw + 1), 1, z, -(hw + 5), -1, z, PLANKS);
});

line(0, 1, -13, 0, 2, -14, OAK_LOG);
line(0, 2, -14, 0, 4, -15, OAK_LOG);
line(0, 4, -15, 0, 6, -16, OAK_LOG);
line(0, 6, -16, 0, 8, -17, OAK_LOG);
line(0, 8, -17, 0, 10, -18, OAK_LOG);
block(-1, 3, -14, OAK_LOG);
block(1, 3, -14, OAK_LOG);
block(-1, 5, -15, OAK_LOG);
block(1, 5, -15, OAK_LOG);
cube(-1, 9, -19, 1, 11, -17, OAK_LOG);
cube(-1, 9, -21, 1, 10, -19, OAK_LOG);
line(-1, 9, -21, 1, 9, -21, WHITE);
block(-1, 10, -20, NEON_RED);
block(1, 10, -20, NEON_RED);
line(0, 11, -18, 0, 13, -17, BLACK);
block(-1, 12, -18, BLACK);
block(1, 12, -18, BLACK);

line(0, 1, 11, 0, 2, 12, OAK_LOG);
line(0, 2, 12, 0, 4, 13, OAK_LOG);
line(0, 4, 13, 0, 6, 14, OAK_LOG);
sphere(0, 6, 15, 1, OAK_LOG);

line(0, 2, -1, 0, 13, -1, OAK_LOG);
line(-5, 10, -1, 5, 10, -1, OAK_LOG);
for (let y = 4; y <= 9; y++) {
  for (let x = -4; x <= 4; x++) {
    if ((x + y) % 3 === 0 && y <= 6) continue;
    const edge = Math.abs(x) / 4;
    let c;
    if (y <= 5 || edge > 0.75) c = BLACK;
    else if (y <= 7) c = ORANGE;
    else c = PLANKS;
    block(x, y, -1, c);
  }
}

cube(-2, 2, 2, 2, 2, 6, OAK_LOG);
cube(-1, 3, 3, 1, 3, 5, OAK_LOG);
block(0, 4, 2, WHITE);
cube(-1, 4, 3, 1, 4, 4, IRON);
cube(-1, 4, 5, 1, 4, 6, GRAY);
line(1, 4, 2, 1, 4, 5, GOLD);
block(1, 4, 6, BROWN);

[-2, 2].forEach((x) => {
  cube(x, 2, 9, x, 3, 9, BROWN);
  block(x, 4, 9, IRON);
  block(x, 5, 9, WHITE);
});

[
  [-2, 3, 1], [2, 3, 1], [0, 5, 3], [-1, 2, 6], [1, 2, 6],
  [-4, 6, -1], [4, 6, -1], [-3, 8, -1], [3, 8, -1],
  [-4, 2, -8], [4, 2, -6], [-4, 2, -2], [4, 2, 2], [-4, 2, 6],
  [0, 3, -14], [1, 11, -18], [-1, 11, -18],
  [-1, 2, -1], [1, 2, -1], [0, 14, -18],
].forEach(([x, y, z]) => block(x, y, z, FIRE));