// dragon-4x-haiku — prompt:
// a fire-breathing dragon...

// Fire-breathing Dragon

// BODY - main torso sphere
sphere(0, 5, 5, 6.5, STONE);

// NECK - connection to head
sphere(0, 8, 10, 4, STONE);

// HEAD - large spherical head
sphere(0, 11, 13, 4, STONE);

// SNOUT - protruding forward
cube(-2, 10, 15, 2, 13, 19, STONE);
cube(-1, 10.5, 19, 1, 12, 21, STONE);

// MOUTH CAVITY - hollow
cube(-0.5, 10.5, 17, 0.5, 11, 18, AIR);

// ===== FIRE BREATH =====
// Main flame burst from mouth
cube(-4, 10, 20, 4, 17, 22, BRICK);
cube(-5, 9, 21, 5, 16, 22, BRICK);
cube(-3, 8, 19, 3, 15, 20, BRICK);
cube(-2, 13, 21, 2, 19, 22, BRICK);

// EYES - glass spheres
sphere(-1, 12, 12, 0.8, GLASS);
sphere(1, 12, 12, 0.8, GLASS);

// HORNS - pointed backward-up
line(-2, 14, 11, -4, 16, 9, STONE);
line(2, 14, 11, 4, 16, 9, STONE);
block(-4, 16, 9, STONE);
block(4, 16, 9, STONE);

// BACK SPIKES - ridge along body
cylinder(-0.5, 11.5, 4, 0.7, 2, BRICK);
cylinder(-0.5, 11.5, 6, 0.7, 2, BRICK);
cylinder(-0.5, 11.5, 8, 0.7, 2, BRICK);

// FRONT LEFT LEG
cylinder(-4, 1.5, 3, 1.3, 4, STONE);
cube(-5, -2, 2, -3, 1.5, 4, STONE);

// FRONT RIGHT LEG
cylinder(4, 1.5, 3, 1.3, 4, STONE);
cube(3, -2, 2, 5, 1.5, 4, STONE);

// BACK LEFT LEG
cylinder(-4, 1.5, 7, 1.3, 4, STONE);
cube(-5, -2, 6, -3, 1.5, 8, STONE);

// BACK RIGHT LEG
cylinder(4, 1.5, 7, 1.3, 4, STONE);
cube(3, -2, 6, 5, 1.5, 8, STONE);

// LEFT WING - bat-like
cube(-12, 4, 4, -5, 13, 8, LEAVES);
cube(-14, 5, 2, -4, 12, 10, LEAVES);
cube(-13, 7, 3, -6, 11, 9, LEAVES);

// RIGHT WING - bat-like
cube(5, 4, 4, 12, 13, 8, LEAVES);
cube(4, 5, 2, 14, 12, 10, LEAVES);
cube(6, 7, 3, 13, 11, 9, LEAVES);

// TAIL - curved behind
line(0, 5, -2, 0, 5.5, -8, STONE);
sphere(0, 5, -10, 3, STONE);

// TAIL SPIKES
block(0, 8.5, -8, BRICK);
block(-1, 8, -10, BRICK);
block(1, 8, -10, BRICK);
block(0, 8, -12, BRICK);

// CHEST ARMOR PLATING
cube(-2, 5, 2, 2, 9, 4, COBBLE);
cube(-3, 6, 1, 3, 8, 3, COBBLE);

// UNDERBELLY SCALES - detail
cube(-5, 3, 5, 5, 4, 6, COBBLE);
cube(-5, 3, 7, 5, 4, 8, COBBLE);

// NOSTRIL HOLES
block(-1, 11, 20, AIR);
block(1, 11, 20, AIR);

// FLAME WISPS - smaller secondary flames
cube(-1, 14, 21, 1, 17, 22, BRICK);
cube(-2, 16, 22, 2, 19, 22, BRICK);
cube(-3, 12, 22, 3, 15, 22, BRICK);

// JAW LINE DETAIL
cube(-2, 10, 20, 2, 10.8, 22, STONE);

// WING MEMBRANE VEINS
line(-12, 9, 5, -6, 9, 6, STONE);
line(-10, 9, 4, -7, 9, 8, STONE);
line(6, 9, 5, 12, 9, 6, STONE);
line(7, 9, 4, 10, 9, 8, STONE);

// SCALE TEXTURE ON BODY
cube(-6, 4, 4, -5, 6, 6, COBBLE);
cube(5, 4, 4, 6, 6, 6, COBBLE);
cube(-6, 4, 6, -5, 6, 8, COBBLE);
cube(5, 4, 6, 6, 6, 8, COBBLE);