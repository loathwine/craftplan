// giant-4x-haiku — prompt:
// an axe-wielding giant...

// AXEWIELDING GIANT - Carved from stone, gripping a massive battle-axe

// === HEAD ===
sphere(0, 27, 0, 6, STONE);

// Face definition
block(-1, 27, -1, GLASS);
block(1, 27, -1, GLASS);
cube(-3, 24, -2, 3, 25, 2, BRICK);

// === NECK ===
cube(-2, 23, -2, 2, 26, 2, STONE);

// === TORSO ===
cube(-6, 12, -5, 6, 23, 5, STONE);

// Pectoral muscles
cube(-5, 17, -6, -1, 21, 6, BRICK);
cube(1, 17, -6, 5, 21, 6, BRICK);

// Abdominal definition
cube(-4, 13, -5, 4, 16, 5, COBBLE);

// Center chest slab
cube(-2, 16, -6, 2, 20, 6, BRICK);

// === LEFT ARM (RAISED & FLEXED) ===
// Upper arm
cube(-18, 15, -3, -6, 20, 3, OAK_LOG);

// Shoulder joint
cube(-8, 19, -4, -6, 23, 4, BRICK);

// Forearm extending upward
cube(-20, 17, -2, -18, 21, 2, OAK_LOG);

// Fist
cube(-22, 16, -2, -20, 20, 2, BRICK);

// === RIGHT ARM (WEAPON ARM) ===
// Upper arm
cube(6, 10, -3, 16, 18, 3, OAK_LOG);

// Shoulder joint
cube(6, 19, -4, 8, 23, 4, BRICK);

// Forearm gripping haft
cube(15, 5, -2, 18, 15, 2, OAK_LOG);

// Hand on handle
cube(17, 3, -2, 19, 7, 2, BRICK);

// === LEGS ===
// Left leg
cube(-4, 0, -3, -1, 11, 0, COBBLE);

// Right leg
cube(1, 0, -3, 4, 11, 0, COBBLE);

// Left foot
cube(-5, 0, -4, 0, 0, 1, STONE);

// Right foot
cube(0, 0, -4, 5, 0, 1, STONE);

// === WAIST CLOTH ===
cube(-6, 10, -6, 6, 12, 6, PLANKS);

// === MASSIVE AXE ===
// Wooden haft
cylinder(18, 4, 0, 1.2, 13, OAK_LOG);

// Blade body - double-bladed menace
cube(14, -2, -8, 21, 7, 8, COBBLE);

// Blade reinforcement
cube(13, 1, -7, 22, 5, 7, STONE);

// Blade edge - sharp and dark
cube(15, -4, -8, 20, -2, 8, BRICK);

// Socket reinforcement at head
cube(16, 5, -1, 19, 8, 1, COBBLE);