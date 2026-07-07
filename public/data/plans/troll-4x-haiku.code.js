// troll-4x-haiku — prompt:
// a troll under a bridge...

// Troll under Bridge - Menacing creature

// === BRIDGE STRUCTURE ===
// Left support pillar - STONE
cube(-14, 1, -8, -11, 13, -6, 3);

// Right support pillar - STONE
cube(11, 1, -8, 14, 13, -6, 3);

// Bridge deck - PLANKS
cube(-10, 13, -5, 10, 13, 5, 7);

// Stone arch underneath - COBBLE
for (let z = -4; z <= 4; z += 3) {
  hollowCube(-8, 8, z, 8, 11, z, 8);
}

// Rail supports - OAK_LOG
for (let x = -10; x <= 10; x += 5) {
  cube(x, 14, -5, x, 16, -5, 4);
  cube(x, 14, 5, x, 16, 5, 4);
}

// === TROLL BODY ===

// Feet - wide stance - STONE
cube(-2, -1, -4, 0, 0, -2, 3);
cube(0, -1, -4, 2, 0, -2, 3);

// Legs - STONE
cube(-2, 0, -3, 0, 5, -1, 3);
cube(0, 0, -3, 2, 5, -1, 3);

// Lower torso - COBBLE
cube(-4, 5, -2, 4, 8, 2, 8);

// Upper chest - COBBLE
cube(-3, 8, -1, 3, 12, 1, 8);

// Neck - STONE
cylinder(0, 12, 0, 1, 1, 3);

// Head - STONE
sphere(0, 15, -1, 2.5, 3);

// Brow ridge - STONE
cube(-2, 17, -3, 2, 17, -1, 3);

// Eyes - GLASS
block(-1, 16, -4, 10);
block(1, 16, -4, 10);

// Nose - STONE
cube(-1, 14, -5, 1, 14, -3, 3);

// Jaw - COBBLE
cube(-2, 11, -4, 2, 11, -1, 8);

// Tusks - STONE
block(-1, 10, -4, 3);
block(1, 10, -4, 3);

// Ears - STONE
cube(-4, 15, 0, -4, 17, 1, 3);
cube(4, 15, 0, 4, 17, 1, 3);

// === ARMS ===

// Left arm - STONE
cube(-4, 6, -2, -6, 10, 0, 3);
sphere(-8, 8, -1, 1.5, 3);

// Right arm - STONE
cube(4, 6, -2, 6, 10, 0, 3);
sphere(8, 8, -1, 1.5, 3);

// === WEAPON ===

// Club handle - OAK_LOG
cube(7, 10, -1, 8, 15, 1, 4);

// Club head - STONE
cube(7, 15, -3, 9, 18, 2, 3);
cube(8, 18, -2, 8, 19, 1, 3);

// === DETAILS ===

// Chest texture - AIR carves
for (let y = 9; y <= 11; y++) {
  block(-3, y, 0, 0);
  block(3, y, 0, 0);
}

// Back ridge spikes - STONE
for (let y = 7; y <= 11; y += 1) {
  block(0, y, 3, 3);
}

// Rib cage definition - STONE
for (let y = 7; y <= 9; y++) {
  block(-4, y, 0, 3);
  block(4, y, 0, 3);
}

// Footprints impressed in earth - DIRT
cube(-2, -2, -4, 0, -1, -2, 2);
cube(0, -2, -4, 2, -1, -2, 2);

// Ground cracks radiating - AIR
for (let z = 1; z <= 3; z++) {
  line(-2, -1, z, 2, -1, z, 0);
}

// Compressed earth under troll - DIRT
cube(-3, 0, -5, 3, 0, -3, 2);

// Bridge stones on lower arch - COBBLE
for (let x = -7; x <= 7; x += 3) {
  cube(x, 11, -4, x, 12, 4, 8);
}