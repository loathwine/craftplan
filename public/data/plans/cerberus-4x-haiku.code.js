// cerberus-4x-haiku — prompt:
// Cerberus, the three-headed dog...

// Cerberus - Three-headed Hellhound Guardian
// Faces north (-Z) toward camera
// Designed for visual impact on YouTube Shorts

// === MASSIVE BODY ===
// Core torso - huge and intimidating
cube(-6, 1, 5, 6, 10, 13, STONE);

// Expanded chest - powerful forecastle
cube(-7, 3, 2, 7, 10, 5, STONE);

// Thick neck supporting three heads
cube(-4, 10, -1, 4, 13, 2, STONE);

// === THREE HEADS FORMATION ===

// CENTER HEAD - Dominant, most fearsome
sphere(0, 15, -7, 3, STONE);
// Large aggressive snout
cube(-2, 12, -9, 2, 13, -7, COBBLE);
cube(-1, 11, -10, 1, 12, -9, COBBLE);
// Fearsome glowing eyes
block(-1, 16, -9, BRICK);
block(1, 16, -9, BRICK);
// Ridge between eyes
cube(-2, 17, -8, 2, 18, -7, BRICK);
// Nostril opening
block(0, 14, -10, AIR);
// Bared teeth
line(-2, 12, -10, 2, 12, -10, BRICK);

// LEFT HEAD - Snarling
sphere(-6, 13, -5, 2, STONE);
cube(-7, 11, -7, -5, 12, -5, COBBLE);
block(-6, 14, -7, BRICK);
cube(-7, 11, -6, -5, 12, -5, BRICK);

// RIGHT HEAD - Snarling (mirror)
sphere(6, 13, -5, 2, STONE);
cube(5, 11, -7, 7, 12, -5, COBBLE);
block(6, 14, -7, BRICK);
cube(5, 11, -6, 7, 12, -5, BRICK);

// === FOUR STOCKY LEGS ===

// Front-left leg
cylinder(-5, 2, 0, 1, 5, STONE);
cube(-6, -2, -1, -4, 0, 1, COBBLE);
block(-6, -3, 0, BRICK);
block(-5, -3, 0, BRICK);
block(-4, -3, 0, BRICK);

// Front-right leg
cylinder(5, 2, 0, 1, 5, STONE);
cube(4, -2, -1, 6, 0, 1, COBBLE);
block(4, -3, 0, BRICK);
block(5, -3, 0, BRICK);
block(6, -3, 0, BRICK);

// Back-left leg
cylinder(-5, 2, 11, 1, 5, STONE);
cube(-6, -2, 10, -4, 0, 12, COBBLE);
block(-6, -3, 11, BRICK);
block(-5, -3, 11, BRICK);
block(-4, -3, 11, BRICK);

// Back-right leg
cylinder(5, 2, 11, 1, 5, STONE);
cube(4, -2, 10, 6, 0, 12, COBBLE);
block(4, -3, 11, BRICK);
block(5, -3, 11, BRICK);
block(6, -3, 11, BRICK);

// === SERPENTINE TAIL ===
// Tail emerges from rear, coils menacingly
line(0, 9, 13, 2, 12, 18, STONE);
line(2, 12, 18, 1, 14, 21, STONE);
line(1, 14, 21, -1, 13, 22, STONE);
// Tail tip barbed
cube(-1, 12, 21, 1, 14, 22, BRICK);
sphere(0, 13, 22, 1, BRICK);

// === SPINAL RIDGE - Demonic spikes ===
for (let z = 3; z < 12; z += 1) {
  let h = 11;
  if (z > 5) h = 12;
  if (z > 8) h = 13;
  block(0, h, z, BRICK);
  block(0, h + 1, z, BRICK);
}

// === SHOULDER ARMOR ===
cube(-7, 9, 2, -6, 11, 5, COBBLE);
cube(6, 9, 2, 7, 11, 5, COBBLE);

// === SIDE PLATES ===
cube(-7, 4, 5, -6, 9, 11, COBBLE);
cube(6, 4, 5, 7, 9, 11, COBBLE);

// === CHEST PLATING ===
cube(-2, 9, 2, 2, 11, 4, COBBLE);

// === UNDERBELLY ===
cube(-5, 1, 6, 5, 2, 12, COBBLE);

// === RIBS ===
for (let z = 5; z < 13; z += 2) {
  cube(-6, 4, z, -5, 7, z + 1, BRICK);
  cube(5, 4, z, 6, 7, z + 1, BRICK);
}

// === NECK DETAIL ===
cube(-3, 11, 0, 3, 13, 1, COBBLE);

// === BROW RIDGES ===
cube(-2, 18, -8, 2, 19, -7, BRICK);

// === ADDITIONAL MUSCULATURE ===
cube(-4, 8, 7, 4, 9, 10, BRICK);

// === BELLY SCALES/ARMOR ===
for (let z = 6; z < 12; z += 3) {
  cube(-3, 2, z, 3, 3, z + 1, BRICK);
}

// === FLANK MUSCLES ===
cube(-7, 6, 7, -6, 8, 10, BRICK);
cube(6, 6, 7, 7, 8, 10, BRICK);