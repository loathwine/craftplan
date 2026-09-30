// rocket-launch-haiku — prompt:
// a rocket launching into space...

// Rocket Launching Into Space

// ROCKET BODY
cylinder(0, 3, 0, 3, 20, IRON);
cylinder(0, 21, 0, 2, 4, IRON);

// NOSE CONE
sphere(0, 27, 0, 2, RED);
cube(-1, 25, -1, 1, 26, 1, RED);
cube(-1, 26, -1, 1, 27, 1, RED);

// ROCKET FINS - 3 large stabilizing fins
cube(2, 3, 2, 6, 13, 6, ORANGE);
cube(6, 11, 6, 8, 13, 8, ORANGE);
cube(-6, 3, -6, -2, 13, -2, ORANGE);
cube(-8, 11, -8, -6, 13, -6, ORANGE);
cube(-6, 3, 2, -2, 13, 6, ORANGE);
cube(-8, 11, 4, -6, 13, 8, ORANGE);

// BANDING DETAILS
cube(-3, 8, -3, 3, 9, 3, GOLD);
cube(-3, 14, -3, 3, 15, 3, GOLD);
cube(-3, 20, -3, 3, 21, 3, GOLD);

// ENGINE PORTS
cube(-4, 4, -4, -3, 6, -3, LAVA);
cube(3, 4, -4, 4, 6, -3, LAVA);
cube(-4, 4, 3, -3, 6, 4, LAVA);
cube(3, 4, 3, 4, 6, 4, LAVA);

// WINDOWS
block(0, 11, -3, GLASS);
block(0, 13, -3, GLASS);
block(0, 17, -3, GLASS);
block(0, 23, -3, GLASS);

// LAUNCH PAD
cube(-16, -1, -16, 16, 0, 16, BRICK);
cube(-14, 0, -14, 14, 1, 14, COBBLE);

// SUPPORT PYLONS
cube(-18, -4, -18, -16, -1, -16, STONE);
cube(16, -4, -18, 18, -1, -16, STONE);
cube(-18, -4, 16, -16, -1, 18, STONE);
cube(16, -4, 16, 18, -1, 18, STONE);

// LAUNCH TOWER
cube(13, 0, -15, 15, 5, -13, IRON);
cube(13, 0, 13, 15, 5, 15, IRON);

// GANTRY ARMS
cube(-1, 3, -17, 1, 4, -15, COPPER);
cube(-1, 3, 15, 1, 4, 17, COPPER);

// LAUNCH FLAMES - Intense thrust
block(0, 1, 0, FIRE);
block(-1, 0, 0, FIRE);
block(1, 0, 0, FIRE);
block(0, 0, -1, FIRE);
block(0, 0, 1, FIRE);
block(-2, 0, 0, FIRE);
block(2, 0, 0, FIRE);
block(0, 0, -2, FIRE);
block(0, 0, 2, FIRE);
block(-1, 1, 0, FIRE);
block(1, 1, 0, FIRE);
block(0, 1, -1, FIRE);
block(0, 1, 1, FIRE);
block(-1, 1, -1, FIRE);
block(1, 1, -1, FIRE);
block(-1, 1, 1, FIRE);
block(1, 1, 1, FIRE);
block(-2, 0, -1, FIRE);
block(-2, 0, 1, FIRE);
block(2, 0, -1, FIRE);
block(2, 0, 1, FIRE);
block(0, 0, -3, FIRE);
block(-3, 0, 0, FIRE);
block(3, 0, 0, FIRE);

// ELECTRIC ENERGY BURST
block(-2, 2, 0, ELECTRIC);
block(2, 2, 0, ELECTRIC);
block(0, 2, -2, ELECTRIC);
block(0, 2, 2, ELECTRIC);