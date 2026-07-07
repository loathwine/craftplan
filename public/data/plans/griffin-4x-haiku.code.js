// griffin-4x-haiku — prompt:
// a griffin...

const STONE = 3;
const COBBLE = 8;
const BRICK = 10;
const OAK_LOG = 4;
const LEAVES = 5;
const AIR = 0;

// === REAR BODY (LEONINE) ===
cube(-8, 0, 14, 8, 7, 20, STONE);
cube(-7, -1, 15, 7, 2, 19, COBBLE);

// === MID-BODY ===
cube(-6, 3, 10, 6, 8, 14, COBBLE);
cube(-7, 4, 10, -6, 7, 14, OAK_LOG);
cube(6, 4, 10, 7, 7, 14, OAK_LOG);

// === FRONT TORSO ===
cube(-5, 1, 3, 5, 10, 10, STONE);
cube(-4, 4, 3, 4, 9, 6, COBBLE);

// === FRONT LEGS (EAGLE TALONS) ===
cube(-9, -2, 1, -6, 2, 4, COBBLE);
cube(-10, -3, 1, -9, -1, 4, BRICK);
cube(-9, -3, 0, -8, -2, 1, BRICK);
cube(-9, -3, 4, -8, -2, 5, BRICK);

cube(6, -2, 1, 9, 2, 4, COBBLE);
cube(9, -3, 1, 10, -1, 4, BRICK);
cube(8, -3, 0, 9, -2, 1, BRICK);
cube(8, -3, 4, 9, -2, 5, BRICK);

// === BACK LEGS (LION PAWS) ===
cube(-9, -2, 16, -6, 1, 20, STONE);
cube(-10, -2, 18, -6, 1, 21, OAK_LOG);

cube(6, -2, 16, 9, 1, 20, STONE);
cube(6, -2, 18, 10, 1, 21, OAK_LOG);

// === NECK ===
cube(-4, 9, 0, 4, 12, 3, STONE);

// === HEAD (EAGLE) ===
cube(-6, 12, -8, 6, 17, 0, COBBLE);
cube(-4, 13, -10, 4, 15, -7, BRICK);
cube(-2, 14, -12, 2, 15, -10, BRICK);
block(0, 14, -12, BRICK);

// Eye sockets
block(-4, 15, -6, AIR);
block(4, 15, -6, AIR);
block(-4, 15, -5, OAK_LOG);
block(4, 15, -5, OAK_LOG);

// Nostril
block(0, 14, -8, AIR);

// === MANE (FEATHERED CROWN) ===
cube(-8, 15, -4, -6, 19, 2, LEAVES);
cube(6, 15, -4, 8, 19, 2, LEAVES);
cube(-9, 13, -2, -7, 17, 4, LEAVES);
cube(7, 13, -2, 9, 17, 4, LEAVES);
cube(-6, 11, 2, -5, 17, 6, LEAVES);
cube(5, 11, 2, 6, 17, 6, LEAVES);

// === WINGS (LARGE SPREAD) ===
cube(-18, 5, 0, -7, 14, 13, COBBLE);
cube(-20, 8, 3, -18, 12, 11, STONE);

cube(7, 5, 0, 18, 14, 13, COBBLE);
cube(18, 8, 3, 20, 12, 11, STONE);

// Wing feather carving - left
for (let x = -19; x < -7; x++) {
  for (let z = 2; z < 13; z++) {
    if ((x * 2 + z) % 4 < 2) {
      block(x, 12, z, AIR);
      block(x, 9, z, AIR);
    }
  }
}

// Wing feather carving - right
for (let x = 8; x < 19; x++) {
  for (let z = 2; z < 13; z++) {
    if ((x * 2 + z) % 4 < 2) {
      block(x, 12, z, AIR);
      block(x, 9, z, AIR);
    }
  }
}

// === TAIL (LION-LIKE) ===
cube(-2, 3, 20, 2, 7, 24, OAK_LOG);
cube(-1, 2, 22, 1, 6, 25, OAK_LOG);
sphere(0, 5, 25, 3, LEAVES);

// === MUSCLE & DETAIL ===
// Wing edge highlight
line(-18, 14, 0, -7, 14, 13, BRICK);
line(7, 14, 0, 18, 14, 13, BRICK);

// Shoulder armor plates
cube(-6, 10, 6, -5, 13, 9, BRICK);
cube(5, 10, 6, 6, 13, 9, BRICK);

// Body muscle striations
for (let z = 5; z < 15; z++) {
  if (z % 5 === 0) {
    block(-5, 6, z, OAK_LOG);
    block(5, 6, z, OAK_LOG);
  }
}

// Belly definition
for (let z = 4; z < 18; z++) {
  block(0, 2, z, OAK_LOG);
}