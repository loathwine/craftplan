// golem-4x-haiku — prompt:
// a stone golem...

const STONE = 3;
const COBBLE = 8;

// ===== FEET =====
// Left foot - wide sturdy base
cube(-5, 0, -4, -1, 2, 5, STONE);
cube(-6, 0, -3, -5, 1, 4, COBBLE);
cube(-4, 1, -5, -2, 2, -3, COBBLE);

// Right foot - wide sturdy base  
cube(1, 0, -4, 5, 2, 5, STONE);
cube(5, 0, -3, 6, 1, 4, COBBLE);
cube(2, 1, -5, 4, 2, -3, COBBLE);

// ===== ANKLES & CALVES =====
// Left calf
cube(-4, 2, -1, -2, 14, 2, STONE);
cube(-5, 3, -3, -4, 11, 0, COBBLE);
cube(-3, 5, -2, -2, 10, 1, COBBLE);

// Right calf
cube(2, 2, -1, 4, 14, 2, STONE);
cube(4, 3, -3, 5, 11, 0, COBBLE);
cube(2, 5, -2, 3, 10, 1, COBBLE);

// ===== THIGHS & HIPS =====
// Hip girdle
cube(-5, 14, -2, 5, 16, 3, STONE);
cube(-6, 15, -1, 6, 16, 2, COBBLE);

// Left thigh
cube(-5, 16, -1, -3, 14, 2, STONE);
cube(-6, 14, -3, -5, 15, 0, COBBLE);

// Right thigh
cube(3, 16, -1, 5, 14, 2, STONE);
cube(5, 14, -3, 6, 15, 0, COBBLE);

// ===== TORSO =====
// Core body mass
cube(-6, 16, -3, 6, 25, 3, STONE);
cube(-7, 17, -2, 7, 24, 2, COBBLE);

// Chest ridges
cube(-4, 18, -4, 4, 23, -2, COBBLE);

// Torso seams
cube(-7, 19, 0, -6, 22, 1, COBBLE);
cube(6, 19, 0, 7, 22, 1, COBBLE);

// ===== SHOULDERS =====
// Left shoulder mass
cube(-9, 24, -1, -6, 27, 2, STONE);
cube(-10, 23, -2, -8, 26, 0, COBBLE);

// Right shoulder mass
cube(6, 24, -1, 9, 27, 2, STONE);
cube(8, 23, -2, 10, 26, 0, COBBLE);

// ===== NECK =====
cube(-2, 25, -1, 2, 28, 2, STONE);
cube(-3, 26, -2, 3, 27, 1, COBBLE);

// ===== LEFT ARM =====
// Upper arm
cube(-10, 21, -1, -8, 26, 1, STONE);
cube(-11, 22, -2, -9, 25, 0, COBBLE);

// Elbow
cube(-11, 19, 0, -9, 21, 1, COBBLE);
cube(-12, 20, -1, -10, 22, 0, STONE);

// Forearm
cube(-12, 16, -1, -10, 20, 1, STONE);
cube(-13, 17, -2, -11, 19, 0, COBBLE);

// Wrist
cube(-13, 15, 0, -11, 17, 1, COBBLE);

// Open hand
cube(-14, 13, -1, -12, 16, 1, STONE);
cube(-15, 14, -2, -13, 15, 0, COBBLE);
block(-15, 12, 1, STONE);
block(-14, 11, 1, STONE);

// ===== RIGHT ARM =====
// Upper arm
cube(8, 21, -1, 10, 26, 1, STONE);
cube(9, 22, -2, 11, 25, 0, COBBLE);

// Elbow
cube(9, 19, 0, 11, 21, 1, COBBLE);
cube(10, 20, -1, 12, 22, 0, STONE);

// Forearm
cube(10, 16, -1, 12, 20, 1, STONE);
cube(11, 17, -2, 13, 19, 0, COBBLE);

// Wrist
cube(11, 15, 0, 13, 17, 1, COBBLE);

// Clenched fist
cube(12, 13, -1, 14, 16, 1, STONE);
cube(13, 14, -2, 15, 15, 0, COBBLE);
cube(15, 12, 0, 16, 14, 1, STONE);

// ===== HEAD =====
// Back skull
cube(-5, 28, -2, 5, 35, 3, STONE);
cube(-6, 29, -1, 6, 34, 2, COBBLE);

// Front face
cube(-5, 28, -7, 5, 34, -3, COBBLE);
cube(-4, 29, -8, 4, 33, -5, STONE);

// Top of head
cube(-6, 34, -1, 6, 36, 2, STONE);
cube(-5, 35, -2, 5, 36, 1, COBBLE);

// ===== FACIAL FEATURES =====
// Left eye socket
cube(-4, 30, -8, -1, 32, -7, STONE);

// Right eye socket
cube(1, 30, -8, 4, 32, -7, STONE);

// Eyes (stone pupils)
block(-2, 31, -8, COBBLE);
block(2, 31, -8, COBBLE);

// Left eyebrow ridge
line(-4, 33, -8, -1, 33, -8, COBBLE);
block(-3, 32, -8, STONE);

// Right eyebrow ridge
line(1, 33, -8, 4, 33, -8, COBBLE);
block(2, 32, -8, STONE);

// Nose bridge
line(-1, 30, -8, 1, 30, -8, STONE);
line(0, 29, -8, 0, 28, -8, COBBLE);

// Mouth - grim expression
line(-3, 27, -8, 3, 27, -8, STONE);
block(-3, 26, -8, COBBLE);
block(3, 26, -8, COBBLE);
block(-2, 25, -8, STONE);
block(2, 25, -8, STONE);

// ===== WEATHERING & TEXTURE =====
// Cracks on torso
block(-6, 20, -4, COBBLE);
block(6, 21, -3, COBBLE);
block(-7, 23, -2, COBBLE);
block(7, 23, -1, COBBLE);

// Erosion on arms
block(-11, 23, -2, COBBLE);
block(11, 23, -1, COBBLE);
block(-12, 18, 1, COBBLE);
block(12, 18, 1, COBBLE);

// Worn edges on legs
block(-6, 8, -3, COBBLE);
block(6, 9, -3, COBBLE);
block(-5, 12, -4, COBBLE);
block(5, 12, -4, COBBLE);

// Ground weathering
block(-6, 0, 3, COBBLE);
block(6, 0, 3, COBBLE);
block(-5, 1, 6, COBBLE);
block(5, 1, 6, COBBLE);

// Face detail wear
block(-5, 31, -7, COBBLE);
block(5, 31, -7, COBBLE);
block(-4, 28, -8, STONE);
block(4, 28, -8, STONE);

// Scattered chips on shoulders
block(-9, 25, -3, COBBLE);
block(9, 25, -3, COBBLE);
block(-10, 24, -1, STONE);
block(10, 24, -1, STONE);