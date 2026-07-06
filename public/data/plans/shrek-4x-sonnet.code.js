// shrek-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// Clear footprint of existing trees/foliage before building
cube(-11, 0, -11, 11, 27, 8, AIR);

// ---- Swamp ground platform ----
cube(-10, -1, -9, 10, -1, 7, DIRT);
cube(-10, 0, -9, 10, 0, 7, GRASS);

// Small swamp pond
cube(6, 0, -8, 9, 0, -5, GLASS);
block(7, 1, -6, LEAVES);
block(8, 1, -7, LEAVES);
block(6, 1, -5, LEAVES);
sphere(8, 1, -9, 1, LEAVES);
block(8, 2, -9, OAK_LOG);

// Outhouse shack (background prop)
hollowCube(-9, 1, -9, -6, 4, -6, PLANKS);
cube(-9, 1, -7, -9, 2, -7, AIR);
block(-9, 3, -7, AIR);
cube(-10, 5, -10, -5, 5, -5, OAK_LOG);

// Small background trees
cube(9, 1, 6, 9, 3, 6, OAK_LOG);
sphere(9, 4, 6, 2, LEAVES);
cube(-9, 1, 6, -9, 3, 6, OAK_LOG);
sphere(-9, 4, 6, 2, LEAVES);

// Unlit campfire prop
cylinder(-7, 1, -3, 1, 1, STONE);
block(-7, 2, -3, OAK_LOG);

// =========================================================
// SHREK
// =========================================================

// Feet (big, bare, forward-pointing)
cylinder(-3, 1, 0, 3, 1, GRASS);
cylinder(3, 1, 0, 3, 1, GRASS);

// Legs (tan trousers)
cylinder(-3, 2, -2, 2, 6, PLANKS);
cylinder(3, 2, -2, 2, 6, PLANKS);

// Belt
cylinder(0, 8, -2, 4, 1, OAK_LOG);
block(0, 8, 2, COBBLE);

// Torso / big belly (green skin)
sphere(0, 13, -2, 5, GRASS);

// Vest patch over front of belly
cube(-3, 9, 2, 3, 16, 3, PLANKS);
block(0, 11, 3, COBBLE);
block(0, 13, 3, COBBLE);
block(0, 15, 3, COBBLE);

// Vest shoulder straps
line(-2, 16, 2, -3, 18, 0, OAK_LOG);
line(2, 16, 2, 3, 18, 0, OAK_LOG);

// Neck
cylinder(0, 18, -2, 2, 1, GRASS);

// Arms akimbo - left
cylinder(-6, 14, -2, 1, 4, GRASS);
cube(-6, 10, -2, -4, 13, 0, GRASS);
cube(-6, 13, -2, -4, 13, 0, OAK_LOG);
cube(-5, 9, -1, -4, 10, 1, GRASS);

// Arms akimbo - right
cylinder(6, 14, -2, 1, 4, GRASS);
cube(4, 10, -2, 6, 13, 0, GRASS);
cube(4, 13, -2, 6, 13, 0, OAK_LOG);
cube(4, 9, -1, 5, 10, 1, GRASS);

// Head (big and round)
sphere(0, 22, -2, 4, GRASS);

// Ears
sphere(-7, 22, -2, 2, GRASS);
sphere(7, 22, -2, 2, GRASS);

// Eyebrows (dark green ridge)
line(-3, 24, 2, -1, 24, 2, LEAVES);
line(1, 24, 2, 3, 24, 2, LEAVES);

// Eyes
block(-2, 23, 2, SNOW);
block(2, 23, 2, SNOW);
block(-2, 23, 3, STONE);
block(2, 23, 3, STONE);

// Nose
block(0, 21, 2, GRASS);
block(0, 21, 3, GRASS);

// Underbite mouth with teeth
line(-2, 19, 1, 2, 19, 1, STONE);
block(-2, 18, 1, GRASS);
block(2, 18, 1, GRASS);
