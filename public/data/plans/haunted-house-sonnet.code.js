// haunted-house-sonnet — prompt:
// a haunted house on Halloween night...

function tombstone(x, z, style) {
  const lean = style === 2 ? 1 : 0;
  cube(x, -1, z, x, 0, z, GRAY);
  if (style === 1) {
    block(x, 1, z, GRAY);
    block(x - 1, 1, z, GRAY);
    block(x + 1, 1, z, GRAY);
  } else if (style === 2) {
    block(x + lean, 1, z, LIGHT_GRAY);
    block(x + lean, 2, z, LIGHT_GRAY);
  } else {
    block(x, 1, z, LIGHT_GRAY);
  }
}

function pumpkin(x, y, z, lit) {
  sphere(x, y, z, 1, ORANGE);
  block(x, y, z - 1, lit ? NEON_RED : BLACK);
  block(x - 1, y, z, BLACK);
  block(x + 1, y, z, BLACK);
}

function bat(x, y, z) {
  block(x, y, z, BLACK);
  block(x - 1, y, z + 1, BLACK);
  block(x + 1, y, z + 1, BLACK);
}

function deadTree(x, z) {
  line(x, -1, z, x, 4, z, OAK_LOG);
  line(x, 3, z, x - 2, 5, z - 1, OAK_LOG);
  line(x, 3, z, x + 2, 5, z + 1, OAK_LOG);
  line(x, 4, z, x, 6, z, OAK_LOG);
  line(x - 2, 5, z - 1, x - 3, 6, z - 1, OAK_LOG);
}

function fencePost(x, z) {
  line(x, -1, z, x, 1, z, BLACK);
}

// --- site prep ---
cube(-10, -2, -12, 10, 24, 13, AIR);
cube(-10, -2, -12, 10, -2, 13, GRASS);

// --- foundation & floor ---
cube(-7, -1, -2, 7, -1, 10, COBBLE);
cube(-6, 0, -1, 6, 0, 10, PLANKS);

// --- main walls ---
cube(-6, 0, 0, 6, 8, 0, STONE);
cube(-6, 0, 10, 6, 8, 10, STONE);
cube(-6, 0, 0, -6, 8, 10, STONE);
cube(6, 0, 0, 6, 8, 10, STONE);

// weathering: scattered cobble patches on walls
for (let i = 0; i < 14; i++) {
  const wx = Math.floor(Math.random() * 11) - 5;
  const wy = Math.floor(Math.random() * 7) + 1;
  block(wx, wy, 0, COBBLE);
  block(wx, wy, 10, COBBLE);
}

// ivy climbing left-front corner
for (let y = 0; y <= 6; y += 2) block(-6, y, 0, LEAVES);
for (let y = 1; y <= 5; y += 2) block(-6, y, 1, LEAVES);

// --- front gable pediment ---
cube(-6, 9, 0, 6, 9, 0, STONE);
cube(-6, 10, 0, 6, 10, 0, STONE);
cube(-5, 11, 0, 5, 11, 0, STONE);
cube(-4, 12, 0, 4, 12, 0, STONE);
cube(-3, 13, 0, 3, 13, 0, STONE);
cube(-2, 14, 0, 2, 14, 0, STONE);
block(-1, 15, 0, STONE);
block(0, 15, 0, STONE);
block(1, 15, 0, STONE);
block(0, 16, 0, STONE);

// round attic window in gable
cube(-1, 12, 0, 1, 13, 0, AIR);
cylinder(0, 12, 0, 1, 2, GLASS);
block(0, 12, 0, OAK_LOG);
block(-1, 12, 0, OAK_LOG);
block(1, 12, 0, OAK_LOG);

// --- roof (stepped gable, ridge along X) ---
cube(-7, 9, -1, 7, 9, 11, BLACK);
cube(-6, 10, 0, 6, 10, 10, BLACK);
cube(-6, 11, 1, 6, 11, 9, BLACK);
cube(-5, 12, 2, 5, 12, 8, BLACK);
cube(-4, 13, 3, 4, 13, 7, BLACK);
cube(-3, 14, 4, 3, 14, 6, BLACK);

// broken/missing shingles + brown patches for decrepit look
for (let i = 0; i < 10; i++) {
  const rx = Math.floor(Math.random() * 13) - 6;
  const rz = Math.floor(Math.random() * 11);
  block(rx, 9, rz, Math.random() > 0.5 ? AIR : BROWN);
}

// --- door ---
cube(-1, 1, 0, 1, 3, 0, AIR);
cube(-1, 1, 0, 1, 3, 0, BROWN);
line(0, 1, 0, 0, 3, 0, BLACK);
block(0, 4, 0, IRON);

// --- windows front, first floor ---
cube(-4, 2, 0, -3, 3, 0, AIR);
cube(-4, 2, 0, -3, 3, 0, GLASS);
line(-4, 2, 0, -3, 3, 0, OAK_LOG);
cube(3, 2, 0, 4, 3, 0, AIR);
cube(3, 2, 0, 4, 3, 0, GLASS);
line(3, 2, 0, 4, 3, 0, OAK_LOG);

// --- windows front, second floor (one lit, eerie) ---
cube(-3, 5, 0, -2, 6, 0, AIR);
cube(-3, 5, 0, -2, 6, 0, NEON_RED);
line(-3, 5, 0, -2, 6, 0, BLACK);
cube(2, 5, 0, 3, 6, 0, AIR);
cube(2, 5, 0, 3, 6, 0, GLASS);
line(2, 5, 0, 3, 6, 0, OAK_LOG);

// --- side windows ---
cube(-6, 2, 4, -6, 3, 5, AIR);
cube(-6, 2, 4, -6, 3, 5, GLASS);
cube(6, 2, 4, 6, 3, 5, AIR);
cube(6, 2, 4, 6, 3, 5, GLASS);
cube(6, 5, 6, 6, 6, 7, AIR);
cube(6, 5, 6, 6, 6, 7, GLASS);

// --- chimney ---
cube(-4, 8, 6, -3, 13, 7, COBBLE);
block(-4, 13, 6, LAVA);
block(-3, 14, 7, FIRE);

// --- porch ---
line(-2, 0, -2, -2, 4, -2, OAK_LOG);
line(2, 0, -2, 2, 4, -2, OAK_LOG);
cube(-3, 4, -3, 3, 4, -1, BLACK);
cube(-3, 0, -3, 3, 0, -1, PLANKS);
cube(-1, -1, -3, 1, -1, -3, STONE);
pumpkin(-2, 1, -2, true);
pumpkin(2, 1, -2, true);

// --- path ---
cube(-1, -2, -9, 1, -2, -3, COBBLE);

// --- tower (back-right) ---
hollowCylinder(6, 0, 9, 2, 16, COBBLE);
cube(6, 0, 9, 6, 0, 9, PLANKS);
cube(4, 8, 7, 8, 8, 11, PLANKS);
cube(5, 3, 7, 5, 4, 7, AIR);
cube(5, 3, 7, 5, 4, 7, GLASS);
cube(7, 9, 9, 7, 10, 9, AIR);
cube(7, 9, 9, 7, 10, 9, GLASS);
disk(6, 17, 9, 2, BLACK);
disk(6, 18, 9, 1, BLACK);
cylinder(6, 17, 9, 1, 2, BLACK);
line(6, 19, 9, 6, 23, 9, IRON);
block(6, 20, 9, NEON_RED);
block(5, 23, 9, BLACK);
block(7, 23, 9, BLACK);
block(6, 24, 9, BLACK);

// --- graveyard (foreground, north of house) ---
const graves = [
  [-5, -7, 0], [-3, -8, 1], [-1, -6, 2], [1, -8, 0],
  [3, -7, 1], [5, -8, 2], [-6, -5, 0], [4, -5, 1],
  [-2, -9, 2], [2, -9, 0]
];
for (const [gx, gz, st] of graves) tombstone(gx, gz, st);

// --- mausoleum ---
cube(-7, -1, -8, -5, 2, -6, STONE);
cube(-6, -1, -8, -6, 1, -8, AIR);
line(-6, -1, -8, -6, 1, -8, BLACK);
cube(-7, 3, -8, -5, 3, -6, COBBLE);
block(-6, 4, -7, COBBLE);

// --- dead trees ---
deadTree(-8, -4);
deadTree(6, -6);

// --- fence around front yard ---
for (let x = -8; x <= 8; x += 2) {
  if (x >= -1 && x <= 1) continue;
  fencePost(x, -10);
}
line(-8, 1, -10, -2, 1, -10, BLACK);
line(2, 1, -10, 8, 1, -10, BLACK);
for (let z = -10; z <= -1; z += 2) {
  fencePost(-8, z);
  fencePost(8, z);
}
line(-8, 1, -10, -8, 1, -1, BLACK);
line(8, 1, -10, 8, 1, -1, BLACK);

// crows on fence
block(-8, 2, -10, BLACK);
block(8, 2, -6, BLACK);

// --- bats near tower/roof ---
bat(3, 15, 3);
bat(-4, 12, 8);
bat(7, 20, 6);

// --- moon ---
sphere(12, 28, 6, 3, NEON_BLUE);