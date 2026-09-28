// dragon-hoard-haiku-fb2 — feedback pass 2
// GOLD HOARD BASE
cube(-16, -1, -10, 16, 0, 14, GOLD);
cube(-14, 0, -8, 14, 1, 12, GOLD);
cube(-12, 1, -6, 12, 2, 10, GOLD);
cube(-10, 2, -4, 10, 3, 8, GOLD);
cube(-8, 3, -2, 8, 4, 6, GOLD);

// DRAGON BODY - sleeping on hoard
cube(-8, 4, 5, 8, 7, 11, BROWN);
cube(-7, 5, 0, 7, 8, 5, BROWN);
cube(-6, 6, -5, 6, 9, 0, BROWN);

// NECK TO HEAD
cube(-5, 7, -10, 5, 10, -5, BROWN);

// HEAD - PROMINENT & FACING CAMERA
cube(-8, 9, -18, 8, 13, -10, BROWN);
cube(-6, 10, -22, 6, 12, -18, ORANGE);
cube(-6, 9, -22, 6, 10, -18, RED);

// HORNS
block(-7, 13, -16, STONE);
block(0, 13, -16, STONE);
block(7, 13, -16, STONE);

// GLOWING EYES - HUGE
block(-5, 12, -17, NEON_RED);
block(5, 12, -17, NEON_RED);

// NOSTRILS
block(-3, 10, -22, AIR);
block(3, 10, -22, AIR);

// FRONT LEFT CLAW
cube(-10, 3, -5, -7, 6, -1, BROWN);
cube(-12, 2, -7, -10, 4, -2, BROWN);
block(-13, 2, -4, ORANGE);

// FRONT RIGHT CLAW
cube(7, 3, -5, 10, 6, -1, BROWN);
cube(10, 2, -7, 12, 4, -2, BROWN);
block(13, 2, -4, ORANGE);

// BACK LEFT LEG
cube(-10, 2, 7, -7, 5, 11, BROWN);
block(-11, 2, 9, ORANGE);

// BACK RIGHT LEG
cube(7, 2, 7, 10, 5, 11, BROWN);
block(11, 2, 9, ORANGE);

// LEFT WING - LARGE & FOLDED
cube(-12, 6, -2, -10, 11, 4, BROWN);
cube(-13, 7, -6, -11, 10, 0, BROWN);

// RIGHT WING - LARGE & FOLDED
cube(10, 6, -2, 12, 11, 4, BROWN);
cube(11, 7, -6, 13, 10, 0, BROWN);

// TAIL
cube(-4, 5, 10, 4, 7, 15, BROWN);
cube(-3, 4, 15, 3, 6, 19, BROWN);
cube(-2, 3, 19, 2, 5, 22, BROWN);

// BELLY SCALES
for(let x = -5; x <= 5; x += 3) {
  cube(x, 5, -2, x+2, 6, 2, ORANGE);
}

// SPINE RIDGES
for(let z = -10; z <= 8; z += 4) {
  block(-1, 9, z, STONE);
  block(1, 9, z, STONE);
}

// SCATTERED COINS
block(-5, 4, 0, GOLD);
block(5, 4, 0, GOLD);
block(-7, 3, 5, GOLD);
block(7, 3, 5, GOLD);
block(-6, 5, -4, GOLD);
block(6, 5, -4, GOLD);