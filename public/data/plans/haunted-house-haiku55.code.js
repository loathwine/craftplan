// haunted-house-haiku55 — prompt:
// a haunted house on Halloween night...

const rnd = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };

function winZ(x1, y1, x2, y2, z, fill) {
  line(x1, y1, z, x2, y1, z, OAK_LOG);
  line(x1, y2, z, x2, y2, z, OAK_LOG);
  line(x1, y1, z, x1, y2, z, OAK_LOG);
  line(x2, y1, z, x2, y2, z, OAK_LOG);
  cube(x1 + 1, y1 + 1, z, x2 - 1, y2 - 1, z, fill);
}

function winX(x, y1, z1, y2, z2, fill) {
  line(x, y1, z1, x, y1, z2, OAK_LOG);
  line(x, y2, z1, x, y2, z2, OAK_LOG);
  line(x, y1, z1, x, y2, z1, OAK_LOG);
  line(x, y1, z2, x, y2, z2, OAK_LOG);
  cube(x, y1 + 1, z1 + 1, x, y2 - 1, z2 - 1, fill);
}

function pumpkin(cx, cz) {
  cube(cx - 1, 0, cz - 1, cx + 1, 2, cz + 1, ORANGE);
  block(cx, 3, cz, OAK_LOG);
  block(cx - 1, 2, cz - 1, GLOWSTONE);
  block(cx + 1, 2, cz - 1, GLOWSTONE);
  line(cx - 1, 1, cz - 1, cx + 1, 1, cz - 1, BLACK);
}

function tomb(x, z) {
  cube(x, 0, z, x, 1, z, COBBLE);
  block(x, 2, z, LIGHT_GRAY);
}

function deadTree(x, z, h) {
  line(x, 0, z, x, h, z, OAK_LOG);
  line(x, h - 2, z, x + 2, h, z, OAK_LOG);
  line(x, h - 3, z, x - 2, h - 1, z, OAK_LOG);
}

function ghost(cx, cy, cz, r) {
  hollowSphere(cx, cy, cz, r, GLASS);
  block(cx - 1, cy + 1, cz - r, GLOWSTONE);
  block(cx + 1, cy + 1, cz - r, GLOWSTONE);
}

// clear site
cube(-10, 0, -10, 10, 20, 8, AIR);
cube(8, 0, -2, 16, 20, 6, AIR);

// foundation and floor
cube(-8, -2, -6, 8, -1, 6, COBBLE);
cube(-8, 0, -6, 8, 0, 6, PLANKS);

// walls
for (let y = 1; y <= 6; y++)
  for (let x = -8; x <= 8; x++)
    for (let z = -6; z <= 6; z++) {
      if (x !== -8 && x !== 8 && z !== -6 && z !== 6) continue;
      const r = rnd(x, y, z);
      block(x, y, z, r > 0.92 ? BRICK : r > 0.6 ? STONE : COBBLE);
    }

// stepped gable roof
for (let k = 0; k < 8; k++) {
  const y = 7 + k;
  for (let x = -8 + k; x <= 8 - k; x++)
    for (let z = -7; z <= 7; z++) block(x, y, z, rnd(x, y, z) > 0.8 ? GRAY : BLACK);
}
cube(0, 15, -7, 0, 15, 7, OBSIDIAN);
line(-8, 7, -7, 8, 7, -7, PURPLE);
line(-8, 7, 7, 8, 7, 7, PURPLE);

// chimney with a smoke wisp
cube(4, 7, 2, 5, 14, 3, COBBLE);
block(4, 15, 2, FIRE);

// attic eye above the front gable
cube(-1, 10, -6, 1, 12, -6, AIR);
cube(-1, 10, -7, 1, 12, -7, OAK_LOG);
block(0, 11, -7, GLASS);
block(0, 11, -6, NEON_RED);

// porch
cube(-3, -2, -9, 3, -1, -7, COBBLE);
cube(-3, 0, -9, 3, 0, -7, PLANKS);
for (const [px, pz] of [[-3, -9], [3, -9], [-3, -7], [3, -7]]) line(px, 1, pz, px, 3, pz, OAK_LOG);
cube(-4, 4, -10, 4, 4, -7, BLACK);
block(0, 3, -8, GLOWSTONE);

// door
cube(-1, 1, -6, 1, 3, -6, AIR);
cube(-2, 1, -6, -2, 4, -6, OAK_LOG);
cube(2, 1, -6, 2, 4, -6, OAK_LOG);
cube(-2, 4, -6, 2, 4, -6, OAK_LOG);

// windows (one boarded up)
winZ(-7, 2, -3, 5, -6, GLASS);
winZ(3, 2, 7, 5, -6, GLASS);
winZ(-2, 2, 2, 5, 6, GLASS);
winX(-8, 2, -4, 5, 0, GLASS);
winX(8, 2, 0, 5, 4, PLANKS);

// interior: candles, table, coffin, cobwebs
block(-5, 3, -5, FIRE);
block(5, 3, -5, FIRE);
block(-7, 3, -2, FIRE);
block(0, 3, 5, FIRE);
cube(-1, 3, -1, 1, 3, 1, PLANKS);
for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) line(x, 1, z, x, 2, z, OAK_LOG);
block(0, 4, 0, FIRE);
cube(-6, 1, 3, -4, 1, 5, BLACK);
line(-5, 1, 3, -5, 1, 5, PURPLE);
line(-7, 6, 5, -7, 4, 5, LIGHT_GRAY);
line(7, 6, -5, 7, 5, -5, LIGHT_GRAY);

// path, fence gate
cube(-1, 0, -19, 1, 0, -10, COBBLE);
for (let x = -14; x <= 14; x += 2) if (Math.abs(x) >= 2) line(x, 0, -19, x, 1, -19, OAK_LOG);
line(-14, 1, -19, -2, 1, -19, PLANKS);
line(2, 1, -19, 14, 1, -19, PLANKS);

// graveyard, pumpkins, dead trees
for (const [x, z] of [[-10, -12], [-7, -14], [-11, -16], [-8, -17], [-3, -15], [7, -13], [10, -16], [4, -17], [13, -12], [-14, -13]]) tomb(x, z);
pumpkin(-4, -11);
pumpkin(5, -11);
deadTree(-15, -9, 7);
deadTree(-17, -14, 6);
deadTree(16, -7, 7);
deadTree(18, -13, 6);

// ghosts and moon
ghost(-11, 12, -8, 2);
ghost(12, 13, -10, 2);
ghost(2, 20, -15, 3);
sphere(8, 27, 20, 3, GLOWSTONE);

// crooked-free bell tower on the east side
cylinder(12, -2, 2, 3, 3, COBBLE);
hollowCylinder(12, 1, 2, 3, 13, STONE);
hollowCylinder(12, 7, 2, 3, 1, BRICK);
block(12, 4, -1, GLASS);
block(12, 9, -1, NEON_RED);
block(12, 10, -1, GLASS);
block(15, 6, 2, GLASS);
disk(12, 14, 2, 3, BLACK);
disk(12, 15, 2, 2, BLACK);
disk(12, 16, 2, 1, BLACK);
block(12, 17, 2, OBSIDIAN);