// deadpool-4x-fable — prompt:
// Deadpool...

// DEADPOOL — 28-block statue, front facing NORTH (-Z), on a stone plinth.
// Right arm thrusts a katana up-east, left arm thrusts one forward-west.
// Crossed sheaths on the back, belt logo, and a broken "fourth wall" behind him.

// ---- clear trees/brush around the build (AIR is free) ----
cube(-20, 1, -15, 20, 12, 13, AIR);

// ---- plinth ----
disk(0, -2, 1, 12, COBBLE);
disk(0, -1, 1, 11, COBBLE);
disk(0,  0, 1, 10, STONE);

// Deadpool logo inlaid on the plinth in front of his feet
disk(0, 1, -5, 3, STONE);
disk(0, 1, -5, 2, BRICK);
block(-1, 1, -6, SNOW);
block( 1, 1, -6, SNOW);

// ---- broken fourth wall behind him (he burst through it) ----
cube(-12, -1, 6, -4, 5, 7, BRICK);
cube(  5, -1, 6, 12, 4, 7, BRICK);
// jagged break edges
cube(-6, 4, 6, -4, 5, 7, AIR);
cube(-9, 5, 6, -8, 5, 7, AIR);
cube(-10, 2, 6, -9, 3, 7, AIR);
cube( 5, 3, 6,  6, 4, 7, AIR);
cube( 9, 4, 6, 10, 4, 7, AIR);
cube( 8, 1, 6,  9, 2, 7, AIR);
// scattered rubble
block(-1, 1, 4, BRICK);
block( 2, 1, 4, BRICK);
block( 0, 1, 5, BRICK);
block( 6, 1, 2, BRICK);
block(-6, 1, 3, BRICK);
sphere(11, 0, 4, 2, COBBLE);
sphere(-11, 0, 7, 2, STONE);

// ---- boots (black) ----
cube(-5, 1, -2, -3, 3, 2, STONE);
cube( 3, 1, -2,  5, 3, 2, STONE);

// ---- legs (red) ----
cube(-5, 4, 0, -3, 13, 2, BRICK);
cube( 3, 4, 0,  5, 13, 2, BRICK);
// knee pads
cube(-5, 8, -1, -3, 9, -1, STONE);
cube( 3, 8, -1,  5, 9, -1, STONE);
// thigh pouches
cube(-6, 11, 0, -6, 12, 1, COBBLE);
cube( 6, 11, 0,  6, 12, 1, COBBLE);

// ---- hips ----
cube(-5, 14, 0, 5, 15, 2, BRICK);

// ---- utility belt with logo buckle + pouches ----
cube(-6, 16, -1, 6, 16, 3, STONE);
cube(-1, 15, -1, 1, 17, -1, STONE);
cube(-1, 15, -2, 1, 17, -2, STONE);
block(0, 16, -2, BRICK);
block(-5, 15, -1, COBBLE);
block(-4, 15, -1, COBBLE);
block( 4, 15, -1, COBBLE);
block( 5, 15, -1, COBBLE);

// ---- torso (red, tapered) ----
cube(-5, 17, 0, 5, 19, 3, BRICK);
cube(-6, 20, 0, 6, 24, 3, BRICK);
// black chest/shoulder wrap
cube(-6, 22, 0, -3, 24, 0, STONE);
cube( 3, 22, 0,  6, 24, 0, STONE);
cube(-6, 22, 0, -6, 24, 3, STONE);
cube( 6, 22, 0,  6, 24, 3, STONE);

// ---- shoulder pads (black) ----
cube(-9, 22, 0, -7, 24, 3, STONE);
cube( 7, 22, 0,  9, 24, 3, STONE);

// ---- neck + head ----
cube(-2, 25, 1, 2, 25, 3, BRICK);
cube(-3, 26, 0, 3, 32, 4, BRICK);
// round off chin and crown
cube(-3, 32, 0, -3, 32, 4, AIR);
cube( 3, 32, 0,  3, 32, 4, AIR);
cube(-3, 26, 0, -3, 26, 4, AIR);
cube( 3, 26, 0,  3, 26, 4, AIR);

// ---- mask: slanted black eye patches, white eyes ----
cube(-3, 30, 0, -2, 30, 0, STONE);
cube( 2, 30, 0,  3, 30, 0, STONE);
cube(-3, 29, 0, -1, 29, 0, STONE);
cube( 1, 29, 0,  3, 29, 0, STONE);
cube(-2, 28, 0, -1, 28, 0, STONE);
cube( 1, 28, 0,  2, 28, 0, STONE);
block(-2, 29, 0, SNOW);
block( 2, 29, 0, SNOW);
block(-2, 29, -1, SNOW);   // eyes pop out one block
block( 2, 29, -1, SNOW);

// ---- right arm: raised diagonally, katana held high ----
cube( 8, 25, 1,  9, 26, 2, BRICK);
cube( 9, 26, 1, 10, 27, 2, BRICK);
cube(10, 27, 1, 11, 28, 2, STONE);   // glove
cube(11, 28, 1, 12, 29, 2, STONE);   // fist
cube(12, 29, 1, 13, 30, 2, STONE);   // guard
line(13, 30, 1, 20, 33, 1, SNOW);    // blade
line(13, 30, 2, 20, 33, 2, SNOW);
line(14, 29, 1, 20, 32, 1, STONE);   // blade underside
line(14, 29, 2, 20, 32, 2, STONE);

// ---- left arm: thrusting katana forward-west ----
cube(-9, 18, 1, -8, 21, 2, BRICK);   // upper arm
cube(-9, 17, 0, -8, 18, 2, BRICK);   // elbow
cube(-9, 17, -4, -8, 18, -1, BRICK); // forearm
cube(-9, 17, -4, -8, 18, -3, STONE); // glove
cube(-9, 17, -5, -8, 18, -5, STONE); // fist
cube(-10, 16, -6, -7, 19, -6, STONE); // guard
line(-9, 18, -7, -16, 21, -14, SNOW); // blade
line(-8, 18, -7, -15, 21, -14, SNOW);
line(-9, 17, -7, -16, 20, -14, STONE);
line(-8, 17, -7, -15, 20, -14, STONE);

// ---- crossed sheaths on the back, handles above shoulders ----
line(-5, 15, 4,  5, 29, 4, STONE);
line( 5, 15, 4, -5, 29, 4, STONE);
line( 5, 29, 4,  7, 31, 4, OAK_LOG);
line(-5, 29, 4, -7, 31, 4, OAK_LOG);