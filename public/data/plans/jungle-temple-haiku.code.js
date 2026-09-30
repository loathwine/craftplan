// jungle-temple-haiku — prompt:
// a jungle temple with a waterfall...

// Jungle Temple with Waterfall

// === TIER 1: BASE PYRAMID LEVEL ===
cube(-10, 0, -8, 10, 0, 12, STONE);
cube(-10, 1, -8, -9, 4, 12, BRICK);
cube(9, 1, -8, 10, 4, 12, BRICK);
cube(-10, 1, -8, 10, 4, -8, BRICK);
cube(-10, 1, 12, 10, 4, 12, BRICK);

// Tier 1 interior courtyard
cube(-8, 1, -6, 8, 1, 10, COBBLE);

// Main entrance (double doors)
cube(-3, 1, -8, -1, 3, -8, AIR);
cube(1, 1, -8, 3, 3, -8, AIR);
block(0, 2, -8, STONE);

// === TIER 2: MIDDLE LEVEL ===
cube(-7, 5, -5, 7, 5, 9, STONE);
cube(-7, 6, -5, -6, 8, 9, BRICK);
cube(6, 6, -5, 7, 8, 9, BRICK);
cube(-7, 6, -5, 7, 8, -5, BRICK);
cube(-7, 6, 9, 7, 8, 9, BRICK);

// Tier 2 interior
cube(-5, 6, -3, 5, 6, 7, COBBLE);

// Secondary entrance
cube(-1, 6, -5, 1, 7, -5, AIR);

// === TIER 3: TOP LEVEL ===
cube(-5, 9, -3, 5, 9, 7, STONE);
cube(-5, 10, -3, -4, 12, 7, BRICK);
cube(4, 10, -3, 5, 12, 7, BRICK);
cube(-5, 10, -3, 5, 12, -3, BRICK);
cube(-5, 10, 7, 5, 12, 7, BRICK);

// Tier 3 interior
cube(-3, 10, -1, 3, 10, 5, COBBLE);

// === SPIRE ===
cube(-2, 13, 1, 2, 14, 5, STONE);
sphere(0, 16, 3, 1, GOLD);

// === PILLARS AT TIER CORNERS ===
cylinder(-9, 1, -7, 0.6, 3, COBBLE);
cylinder(9, 1, -7, 0.6, 3, COBBLE);
cylinder(-9, 1, 11, 0.6, 3, COBBLE);
cylinder(9, 1, 11, 0.6, 3, COBBLE);

cylinder(-6, 6, -4, 0.5, 2, COBBLE);
cylinder(6, 6, -4, 0.5, 2, COBBLE);
cylinder(-6, 6, 8, 0.5, 2, COBBLE);
cylinder(6, 6, 8, 0.5, 2, COBBLE);

// === WATERFALL (Eastern side) ===
// Cascading water source
line(12, 13, 2, 12, 1, 2, WATER);
line(13, 12, 2, 13, 2, 2, WATER);
line(14, 11, 3, 14, 3, 3, WATER);
line(15, 10, 3, 15, 4, 3, WATER);

// Waterfall pool and basin
cube(11, -2, 0, 16, 0, 5, WATER);
cube(12, -3, 1, 15, -2, 4, STONE);

// Stone spillway structure
line(10, 3, 0, 10, 3, 5, COBBLE);
cube(11, 3, 5, 15, 3, 6, STONE);

// === JUNGLE OVERGROWTH ===
// Vines and foliage hanging from temple
cube(-16, 2, -10, -11, 9, -8, LEAVES);
cube(-16, 2, 11, -11, 9, 14, LEAVES);
cube(11, 2, -10, 16, 9, -8, LEAVES);
cube(11, 2, 11, 16, 9, 14, LEAVES);

// Scattered moss-covered stones
cube(-15, -1, 3, -14, 1, 5, COBBLE);
cube(14, -1, 3, 15, 1, 5, COBBLE);
cube(-12, -1, 14, -11, 0, 15, COBBLE);
cube(11, -1, 14, 12, 0, 15, COBBLE);

// === STEPPED APPROACH ===
cube(-5, 0, -9, -3, 0, -8, STONE);
cube(-5, 1, -9, -4, 1, -8, STONE);
cube(-5, 2, -9, -4, 2, -8, STONE);

cube(3, 0, -9, 5, 0, -8, STONE);
cube(4, 1, -9, 5, 1, -8, STONE);
cube(4, 2, -9, 5, 2, -8, STONE);

// === CARVED STONE DETAILS ===
cube(-6, 3, -8, -4, 4, -8, COBBLE);
cube(4, 3, -8, 6, 4, -8, COBBLE);
cube(-4, 7, -5, -2, 8, -5, COBBLE);
cube(2, 7, -5, 4, 8, -5, COBBLE);

// === WATER CHANNEL ===
line(-2, -1, 7, -2, -1, 12, WATER);
line(-1, -1, 7, -1, -1, 12, WATER);
line(0, -1, 7, 0, -1, 12, WATER);
line(1, -1, 7, 1, -1, 12, WATER);

// === STONE TERRACING ===
cube(-11, 0, 6, -10, 1, 8, STONE);
cube(10, 0, 6, 11, 1, 8, STONE);
cube(-10, 1, 13, -9, 1, 14, STONE);
cube(9, 1, 13, 10, 1, 14, STONE);

// === DECORATIVE ARCHES ===
cube(-4, 5, -8, 4, 6, -8, BRICK);
line(-4, 7, -8, 4, 7, -8, BRICK);

// === ADDITIONAL FOLIAGE ===
cube(-2, 8, 7, 2, 10, 8, LEAVES);
cube(-8, 5, 8, -7, 7, 9, LEAVES);
cube(7, 5, 8, 8, 7, 9, LEAVES);