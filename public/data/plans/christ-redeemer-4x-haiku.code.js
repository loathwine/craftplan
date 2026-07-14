// christ-redeemer-4x-haiku — prompt:
// Christ the Redeemer...

// Christ the Redeemer - monumental voxel statue
// Oriented facing north (-Z) for optimal camera view

// === PEDESTAL / MOUNTAIN BASE ===
// Large stone foundation - dramatic base
cube(-16, -3, -20, 16, 1, 20, STONE);
cube(-14, 1, -18, 14, 4, 18, COBBLE);
cube(-12, 4, -15, 12, 7, 15, STONE);
cube(-10, 7, -12, 10, 10, 12, COBBLE);

// === MAIN TORSO / ROBES ===
// Wide robed body - characteristic drapery
cube(-6, 10, -8, 6, 19, 8, BRICK);

// Chest/shoulders section
cube(-7, 18, -7, 7, 23, 7, BRICK);

// Center torso detail - robe folds
cube(-5, 12, -6, 5, 18, 6, BRICK);
cube(-6, 14, -5, 6, 17, 5, BRICK);

// Side robe draping
cube(-8, 10, -5, -6, 16, 5, BRICK);
cube(6, 10, -5, 8, 16, 5, BRICK);

// === LEFT ARM (raised, characteristic pose) ===
// Upper arm
cube(-11, 19, -4, -7, 23, 4, COBBLE);
// Mid-arm section
cube(-15, 16, -3, -11, 20, 3, STONE);
// Forearm
cube(-18, 13, -2, -15, 17, 2, COBBLE);
// Hand/wrist
cube(-20, 11, -1, -18, 14, 1, STONE);

// === RIGHT ARM (raised, characteristic pose) ===
// Upper arm
cube(7, 19, -4, 11, 23, 4, COBBLE);
// Mid-arm section
cube(11, 16, -3, 15, 20, 3, STONE);
// Forearm
cube(15, 13, -2, 18, 17, 2, COBBLE);
// Hand/wrist
cube(18, 11, -1, 20, 14, 1, STONE);

// === NECK ===
cube(-2, 22, -4, 2, 25, 4, STONE);

// === HEAD ===
// Main head sphere
sphere(0, 28, 0, 4, STONE);

// Crown/halo ring - top detail
cylinder(0, 32, 0, 4, 1, COBBLE);

// === FACE FEATURES ===
// Eyes - blue glass gaze looking south
block(-2, 28, -3, GLASS);
block(2, 28, -3, GLASS);

// Center face detail
block(0, 27, -4, COBBLE);
block(0, 26, -4, COBBLE);

// === ROBE ORNAMENT / HEM ===
// Robe hem at base
cube(-7, 10, -7, 7, 12, 7, BRICK);

// Decorative belt/sash
cube(-6, 17, -7, 6, 18, 7, COBBLE);

// Side panels
cube(-9, 12, -4, -7, 15, 4, BRICK);
cube(7, 12, -4, 9, 15, 4, BRICK);

// === ADDITIONAL DETAILING ===
// Central axis detail (tunic seam)
line(0, 12, -7, 0, 18, 7, STONE);

// Arm segmentation - joints
cube(-13, 18, -3, -12, 19, 3, STONE);
cube(-10, 16, -3, -9, 17, 3, STONE);
cube(12, 18, -3, 13, 19, 3, STONE);
cube(9, 16, -3, 10, 17, 3, STONE);

// Shoulder definition
cube(-7, 22, -5, -6, 24, 5, COBBLE);
cube(6, 22, -5, 7, 24, 5, COBBLE);

// Pedestal cross detail (bottom accent)
line(-2, 8, -10, 2, 8, 10, COBBLE);
line(-10, 8, -2, 10, 8, 2, COBBLE);