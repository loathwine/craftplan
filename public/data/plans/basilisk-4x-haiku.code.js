// basilisk-4x-haiku — prompt:
// a basilisk...

const STONE = 3;
const BRICK = 10;
const GLASS = 11;
const COBBLE = 8;
const AIR = 0;

// === HEAD ===
sphere(0, 2, -12, 2, STONE);
cube(-3, 0, -15, 3, 3, -10, STONE);

// === CROWN - multi-peaked crest ===
// Central spike
cube(-1, 5, -15, 0, 11, -11, BRICK);
// Left peaks
cube(-4, 5, -15, -3, 8, -11, BRICK);
cube(-3, 6, -15, -2, 9, -13, BRICK);
cube(-2, 7, -15, -1, 9, -14, BRICK);
// Right peaks
cube(2, 6, -15, 3, 9, -13, BRICK);
cube(3, 5, -15, 4, 8, -11, BRICK);
cube(1, 7, -15, 2, 9, -14, BRICK);
// Crown base ring
cube(-4, 4, -15, 4, 5, -10, BRICK);

// === EYES ===
sphere(-1, 3, -16, 1, GLASS);
sphere(1, 3, -16, 1, GLASS);
// Eye ridges
cube(-2, 4, -16, -1, 5, -14, BRICK);
cube(1, 4, -16, 2, 5, -14, BRICK);

// === FANGS ===
cube(-1, 1, -17, 0, 3, -14, BRICK);
cube(0, 1, -17, 1, 3, -14, BRICK);
cube(-2, -1, -17, -1, 1, -15, BRICK);
cube(1, -1, -17, 2, 1, -15, BRICK);
cube(-3, 0, -17, 3, 2, -14, STONE);

// === VENOM SACS ===
sphere(-4, 1, -10, 1, STONE);
sphere(4, 1, -10, 1, STONE);
block(-4, 2, -10, BRICK);
block(4, 2, -10, BRICK);

// === NECK ===
cube(-2, 1, -8, 2, 3, -2, STONE);
for (let z = -8; z < -2; z += 2) {
  block(-2, 3, z, BRICK);
  block(2, 3, z, BRICK);
}

// === BODY 1 - FORWARD ===
cube(-4, 0, -2, 4, 3, 8, STONE);

// Dorsal scale ridge
for (let z = -2; z < 8; z++) {
  if (z % 2 === 0) {
    block(-4, 3, z, COBBLE);
    block(-2, 4, z, COBBLE);
    block(0, 4, z, COBBLE);
    block(2, 4, z, COBBLE);
    block(4, 3, z, COBBLE);
  }
}

// Ventral detail
for (let z = -2; z < 8; z++) {
  if (z % 3 === 0) {
    cube(-2, -1, z, 2, 0, z, COBBLE);
  }
}

// === BODY 2 - RIGHT COIL ===
cube(4, 0, 8, 9, 3, 15, STONE);

for (let z = 8; z < 15; z++) {
  if (z % 2 === 1) {
    block(4, 3, z, COBBLE);
    block(6, 4, z, COBBLE);
    block(8, 4, z, COBBLE);
    block(9, 3, z, COBBLE);
  }
}

for (let z = 8; z < 15; z += 3) {
  block(10, 1, z, COBBLE);
}

// === BODY 3 - LEFT CURVE ===
cube(-7, 0, 15, 5, 3, 21, STONE);

for (let z = 15; z < 21; z++) {
  if (z % 2 === 0) {
    block(-7, 3, z, COBBLE);
    block(-3, 4, z, COBBLE);
    block(1, 4, z, COBBLE);
    block(5, 3, z, COBBLE);
  }
}

for (let z = 15; z < 21; z += 3) {
  block(-8, 1, z, COBBLE);
}

// === TAIL - TAPERING ===
cube(-5, 0, 21, 3, 2, 23, STONE);
block(-5, 2, 21, BRICK);
block(3, 2, 21, BRICK);

cube(-3, 0, 23, 2, 2, 24, STONE);
block(-3, 2, 23, BRICK);
block(2, 2, 23, BRICK);

cube(-1, 1, 24, 1, 2, 25, STONE);
block(-1, 2, 24, BRICK);
block(1, 2, 24, BRICK);

cube(0, 1, 25, 0, 2, 26, STONE);

// === BASE DETAIL ===
for (let x = -6; x <= 6; x++) {
  for (let z = -17; z <= -14; z++) {
    block(x, -1, z, COBBLE);
  }
}

// === SCALE PATTERN ON BODY ===
for (let x = -3; x <= 3; x++) {
  for (let z = 0; z < 8; z += 2) {
    if ((x + z) % 4 === 0) {
      block(x, 2, z, BRICK);
    }
  }
}

for (let x = 5; x <= 8; x++) {
  for (let z = 8; z < 15; z += 2) {
    if ((x + z) % 4 === 1) {
      block(x, 2, z, BRICK);
    }
  }
}

for (let x = -6; x <= 4; x++) {
  for (let z = 15; z < 21; z += 2) {
    if ((x + z) % 4 === 2) {
      block(x, 2, z, BRICK);
    }
  }
}