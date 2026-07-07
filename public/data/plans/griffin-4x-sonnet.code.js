// griffin-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// Nest ring (thematic base)
hollowCylinder(0, 0, 1, 6, 1, OAK_LOG);
block(-6, 0, 4, OAK_LOG);
block(6, 0, -3, OAK_LOG);
block(-4, 0, 6, OAK_LOG);
block(4, 0, -6, OAK_LOG);

sphere(-9, 0, 4, 1, COBBLE);
sphere(9, 0, -3, 1, STONE);
sphere(-7, 0, -7, 1, STONE);
sphere(8, 0, 6, 1, COBBLE);

// Lion torso (rounded barrel, layered)
cube(-2, 2, -3, 2, 2, 3, OAK_LOG);
cube(-2, 3, -3, 2, 3, 4, OAK_LOG);
cube(-3, 4, -3, 3, 4, 4, OAK_LOG);
cube(-3, 5, -3, 3, 5, 4, OAK_LOG);
cube(-3, 6, -3, 3, 6, 4, OAK_LOG);
cube(-2, 7, -2, 2, 7, 3, OAK_LOG);
cube(-1, 8, -1, 1, 8, 2, OAK_LOG);

line(0, 8, -1, 0, 6, 4, COBBLE);
line(-1, 4, -3, -1, 6, -3, COBBLE);
line(1, 4, -3, 1, 6, -3, COBBLE);

cube(-1, 4, -3, 1, 6, -2, SNOW);
cube(-1, 3, -3, 1, 3, -2, SNOW);

// Front legs (eagle talons)
cube(-2, 0, -3, -1, 2, -2, STONE);
cube(1, 0, -3, 2, 2, -2, STONE);
line(-2, 0, -2, -2, 0, -4, SAND);
line(-1, 0, -2, -1, 0, -4, SAND);
line(1, 0, -2, 1, 0, -4, SAND);
line(2, 0, -2, 2, 0, -4, SAND);
block(-3, 0, -3, SAND);
block(3, 0, -3, SAND);

// Rear legs (lion legs + paws)
cube(-2, 0, 3, -1, 2, 4, OAK_LOG);
cube(1, 0, 3, 2, 2, 4, OAK_LOG);
cube(-2, 0, 4, -1, 0, 5, OAK_LOG);
cube(1, 0, 4, 2, 0, 5, OAK_LOG);
block(-2, 0, 6, SAND);
block(-1, 0, 6, SAND);
block(1, 0, 6, SAND);
block(2, 0, 6, SAND);

// Tail (curling up with tuft)
cube(-1, 4, 4, 0, 5, 6, OAK_LOG);
cube(-1, 5, 6, 0, 6, 8, OAK_LOG);
cube(-1, 6, 8, 0, 7, 9, OAK_LOG);
sphere(0, 8, 10, 1, OAK_LOG);
block(0, 9, 10, STONE);

// Mane ruff at neck/chest join
hollowCylinder(0, 6, -3, 2, 2, OAK_LOG);

// Neck (brown -> white feather transition)
cube(-1, 6, -4, 1, 7, -3, STONE);
cube(-1, 7, -5, 1, 9, -4, STONE);
cube(-1, 9, -6, 1, 11, -5, SNOW);

// Head (eagle)
cube(-2, 10, -8, 2, 13, -6, SNOW);
cube(-1, 10, -10, 1, 11, -8, SAND);
block(0, 11, -11, SAND);
block(-2, 12, -7, COBBLE);
block(2, 12, -7, COBBLE);
cube(-1, 13, -7, 1, 14, -6, STONE);
block(-3, 13, -7, STONE);
block(3, 13, -7, STONE);

// Right wing (+X), upswept layered feather rows
cube(3, 7, -2, 7, 9, 2, STONE);
cube(7, 8, -2, 11, 11, 1, COBBLE);
cube(11, 9, -1, 15, 13, 1, STONE);
cube(15, 11, -1, 20, 16, 1, SNOW);
cube(4, 5, -1, 10, 6, 1, COBBLE);
cube(10, 5, -1, 14, 6, 1, COBBLE);
line(20, 16, 0, 22, 17, 0, SNOW);
line(20, 15, -1, 22, 16, -1, SNOW);
line(19, 14, 1, 21, 14, 1, SNOW);
block(19, 16, 0, AIR);
block(21, 15, -1, AIR);

// Left wing (-X), mirrored
cube(-7, 7, -2, -3, 9, 2, STONE);
cube(-11, 8, -2, -7, 11, 1, COBBLE);
cube(-15, 9, -1, -11, 13, 1, STONE);
cube(-20, 11, -1, -15, 16, 1, SNOW);
cube(-10, 5, -1, -4, 6, 1, COBBLE);
cube(-14, 5, -1, -10, 6, 1, COBBLE);
line(-22, 16, 0, -20, 17, 0, SNOW);
line(-22, 15, -1, -20, 16, -1, SNOW);
line(-21, 14, 1, -19, 14, 1, SNOW);
block(-19, 16, 0, AIR);
block(-21, 15, -1, AIR);
