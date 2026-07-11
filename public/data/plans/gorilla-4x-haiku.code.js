// gorilla-4x-haiku — prompt:
// a silverback gorilla...

// Silverback Gorilla - Muscular knuckle-walker facing north (-Z)

const STONE = 3;
const COBBLE = 8;
const BRICK = 10;
const GLASS = 11;

// TORSO
cube(-4, 5, -3, 4, 13, 5, STONE);        // Main body
cube(-5, 7, -6, 5, 12, -4, STONE);       // Chest bulge (forward)
cube(-6, 10, -3, 6, 13, 3, STONE);       // Shoulders
cube(-4, 6, 4, 4, 12, 7, STONE);         // Back

// HEAD
sphere(0, 15, -1, 3, STONE);

// FACE - forward-facing features
cube(-2, 13, -7, 2, 15, -5, COBBLE);     // Muzzle
cube(-1, 12, -8, 1, 14, -7, BRICK);      // Snout
cube(-2, 11, -6, 2, 13, -4, COBBLE);     // Jaw
block(-1, 15, -8, GLASS);                // Left eye
block(1, 15, -8, GLASS);                 // Right eye
block(0, 12, -8, COBBLE);                // Nose
cube(-2, 15, -4, 2, 16, -2, COBBLE);     // Brow ridge
block(-3, 15, -1, COBBLE);               // Left ear
block(3, 15, -1, COBBLE);                // Right ear

// NECK
cube(-2, 12, -2, 2, 14, 2, STONE);

// LEFT ARM
cube(-8, 8, -2, -5, 12, 1, STONE);       // Upper arm
cube(-9, 9, -1, -7, 12, 0, COBBLE);      // Shoulder
cube(-8, 9, -1, -6, 11, 0, BRICK);       // Bicep
cube(-11, 3, -4, -8, 9, 0, STONE);       // Forearm
cube(-12, 4, -3, -10, 8, -1, COBBLE);    // Forearm detail
cube(-12, 0, -5, -10, 2, -2, COBBLE);    // Knuckles

// RIGHT ARM
cube(5, 8, -2, 8, 12, 1, STONE);         // Upper arm
cube(7, 9, -1, 9, 12, 0, COBBLE);        // Shoulder
cube(6, 9, -1, 8, 11, 0, BRICK);         // Bicep
cube(8, 3, -4, 11, 9, 0, STONE);         // Forearm
cube(10, 4, -3, 12, 8, -1, COBBLE);      // Forearm detail
cube(10, 0, -5, 12, 2, -2, COBBLE);      // Knuckles

// LEGS
cube(-4, 0, -1, -2, 5, 2, STONE);        // Left leg
cube(-5, 2, 0, -3, 4, 1, COBBLE);        // Left thigh muscle
cube(2, 0, -1, 4, 5, 2, STONE);          // Right leg
cube(3, 2, 0, 5, 4, 1, COBBLE);          // Right thigh muscle

// FEET
cube(-4, 2, 0, -2, 4, 2, COBBLE);
cube(2, 2, 0, 4, 4, 2, COBBLE);

// MUSCULAR DETAIL
cube(-5, 8, -5, -2, 11, -3, COBBLE);     // Left pectoral
cube(2, 8, -5, 5, 11, -3, COBBLE);       // Right pectoral
cube(-1, 8, -5, 1, 11, -3, BRICK);       // Pectoral center
cube(-3, 5, -1, 3, 9, 1, COBBLE);        // Abs
cube(-2, 7, 5, 2, 11, 6, COBBLE);        // Back ridge
cube(-4, 8, 5, -2, 10, 6, BRICK);        // Back left
cube(2, 8, 5, 4, 10, 6, BRICK);          // Back right
cube(-6, 11, 2, -5, 12, 3, COBBLE);      // Left rear shoulder
cube(5, 11, 2, 6, 12, 3, COBBLE);        // Right rear shoulder
cube(-8, 10, -1, -7, 11, 0, BRICK);      // Left arm striations
cube(7, 10, -1, 8, 11, 0, BRICK);        // Right arm striations
cube(-3, 13, -1, -2, 13, 1, COBBLE);     // Left neck muscle
cube(2, 13, -1, 3, 13, 1, COBBLE);       // Right neck muscle
cube(-2, 15, 1, 2, 17, 3, COBBLE);       // Back of head
cube(-5, 9, -4, -4, 10, -3, BRICK);      // Chest left line
cube(4, 9, -4, 5, 10, -3, BRICK);        // Chest right line