// dragon-hoard-haiku — prompt:
// a dragon sleeping on a pile of gold...

// Dragon sleeping on pile of gold

// GOLD PILE - nest foundation
cube(-10, -2, 0, 10, 0, 10, GOLD);
cube(-8, 0, 1, 8, 2, 9, GOLD);
cube(-6, 2, 2, 6, 3, 8, GOLD);
cube(-4, 3, 3, 4, 4, 7, GOLD);
cube(-7, 0, 0, -5, 1, 1, GOLD);
cube(5, 0, 0, 7, 1, 1, GOLD);
cube(-8, 1, 2, -6, 2, 4, GOLD);
cube(6, 1, 2, 8, 2, 4, GOLD);

// Stone bedrock beneath
cube(-10, -1, 0, 10, 0, 1, STONE);

// DRAGON BODY - main sleeping mass
cube(-7, 4, 1, 7, 9, 11, BROWN);
cube(-6, 4, 2, 6, 7, 10, ORANGE);

// NECK - curves toward camera
cube(-5, 8, -2, 5, 11, 1, BROWN);
cube(-4, 10, -4, 4, 13, 0, BROWN);

// HEAD - resting posture
cube(-6, 9, -9, 6, 16, -2, BROWN);
cube(-5, 9, -10, 5, 11, -5, ORANGE);

// Snout/jaw prominent
cube(-4, 11, -12, 4, 14, -8, BROWN);

// EYES - sleepy glow
block(-3, 13, -8, NEON_RED);
block(3, 13, -8, NEON_RED);

// HEAD HORNS - curved back
cube(-6, 16, -7, -5, 17, -5, STONE);
cube(5, 16, -7, 6, 17, -5, STONE);
cube(-7, 15, -5, -6, 16, -4, STONE);
cube(6, 15, -5, 7, 16, -4, STONE);

// Ear ridges
block(-7, 14, -6, STONE);
block(7, 14, -6, STONE);

// Nostril holes
block(-2, 11, -12, STONE);
block(2, 11, -12, STONE);

// WINGS - folded along body
// Left wing
cube(-10, 6, 2, -8, 12, 10, ORANGE);
cube(-11, 7, 3, -9, 11, 9, RED);
cube(-12, 8, 4, -10, 10, 8, ORANGE);

// Right wing
cube(8, 6, 2, 10, 12, 10, ORANGE);
cube(9, 7, 3, 11, 11, 9, RED);
cube(10, 8, 4, 12, 10, 8, ORANGE);

// Wing membrane veins
for(let y = 7; y <= 11; y += 2) {
  block(-10, y, 5, RED);
  block(10, y, 5, RED);
  block(-11, y, 6, RED);
  block(11, y, 6, RED);
}

// TAIL - coiled around nest
cube(6, 5, 10, 9, 8, 15, BROWN);
cube(8, 4, 14, 12, 8, 19, BROWN);
cube(9, 3, 18, 13, 7, 22, BROWN);
cube(10, 2, 20, 14, 6, 23, BROWN);

// SPINAL RIDGE - prominent back spikes
for(let z = 2; z <= 10; z += 2) {
  block(0, 9, z, STONE);
  block(-1, 10, z, STONE);
  block(1, 10, z, STONE);
}
block(0, 11, -3, STONE);
block(0, 13, -2, STONE);

// LEGS - sleeping posture
// Front legs tucked
cube(-9, 2, 3, -7, 5, 5, BROWN);
cube(7, 2, 3, 9, 5, 5, BROWN);

// Back legs extended
cube(-10, 2, 13, -8, 5, 17, BROWN);
cube(8, 2, 13, 10, 5, 17, BROWN);

// Claws on feet
for(let x = -9; x <= -7; x++) {
  block(x, 2, 3, ORANGE);
  block(x, 2, 5, ORANGE);
}
for(let x = 7; x <= 9; x++) {
  block(x, 2, 3, ORANGE);
  block(x, 2, 5, ORANGE);
}
for(let x = -10; x <= -8; x++) {
  block(x, 2, 16, ORANGE);
}
for(let x = 8; x <= 10; x++) {
  block(x, 2, 16, ORANGE);
}

// SCALE TEXTURE - body plating
cube(-5, 7, 3, 5, 8, 5, RED);
cube(-4, 8, 6, 4, 9, 8, RED);
cube(-3, 9, 9, 3, 10, 11, RED);

// Belly plates
cube(-4, 6, 4, 4, 7, 5, ORANGE);
cube(-3, 6, 8, 3, 7, 9, ORANGE);

// SCATTERED GOLD - richness detail
cube(-9, 2, 5, -8, 3, 6, GOLD);
cube(8, 2, 5, 9, 3, 6, GOLD);
cube(-5, 4, 1, -4, 5, 2, GOLD);
cube(4, 4, 1, 5, 5, 2, GOLD);
cube(-3, 3, 10, -1, 4, 12, GOLD);
cube(1, 3, 10, 3, 4, 12, GOLD);

// Wing spike details
block(-11, 8, 2, STONE);
block(-11, 10, 8, STONE);
block(11, 8, 2, STONE);
block(11, 10, 8, STONE);

// Neck ridge continuation
for(let z = -1; z <= 2; z++) {
  block(0, 12, z, STONE);
}

// Tail spikes
block(8, 7, 15, STONE);
block(10, 6, 19, STONE);
block(11, 5, 22, STONE);