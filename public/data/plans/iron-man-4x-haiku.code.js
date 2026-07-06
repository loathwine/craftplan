// iron-man-4x-haiku — prompt:
// Iron Man...

// Iron Man - Detailed Armor Suit

const RED = 10;    // BRICK
const GOLD = 6;    // SAND
const GREY = 3;    // STONE
const DARK = 8;    // COBBLE
const GLOW = 11;   // GLASS

// === TORSO ===
// Main chest plate
cube(-2, 2, -1, 2, 8, 2, RED);

// Chest side panels
cube(-4, 3, -1, -2, 7, 2, GREY);
cube(2, 3, -1, 4, 7, 2, GREY);

// Back torso plating
cube(-2, 3, 1, 2, 7, 2, RED);
cube(-3, 4, 1, 3, 6, 2, DARK);

// Center chest detail
cube(-1, 4, -1, 1, 6, 2, GOLD);

// Upper torso armor ridge
cube(-2, 7, -1, 2, 8, 2, GOLD);

// === ARC REACTOR - CENTRAL GLOW ===
// Triangular glowing core
cube(-1, 3, 2, 1, 5, 3, GLOW);
block(0, 2, 3, GLOW);
block(-1, 5, 2, GLOW);
block(1, 5, 2, GLOW);

// Reactor casing
cube(-2, 2, 1, 2, 6, 1, DARK);
line(-1, 2, 0, 1, 2, 0, GOLD);

// Reactor ring detail
block(-1, 3, 1, DARK);
block(1, 3, 1, DARK);
block(0, 4, 1, DARK);

// === HEAD/HELMET ===
// Helmet shell
cube(-2, 8, -1, 2, 11, 2, RED);

// Faceplate - glowing visor
cube(-1, 8, 2, 1, 10, 3, GLOW);

// Helmet crest
cube(-2, 10, -1, 2, 11, 2, GOLD);

// Visor trim
cube(-2, 8, 1, 2, 9, 1, DARK);

// Jaw guard
cube(-1, 7, -1, 1, 8, 2, DARK);

// === SHOULDERS/PAULDRONS ===
// Left shoulder armor
cube(-6, 5, -1, -2, 9, 2, RED);
cube(-7, 6, -1, -6, 8, 2, GOLD);
cube(-6, 6, 1, -2, 8, 2, DARK);

// Right shoulder armor
cube(2, 5, -1, 6, 9, 2, RED);
cube(6, 6, -1, 7, 8, 2, GOLD);
cube(2, 6, 1, 6, 8, 2, DARK);

// Shoulder joints
block(-6, 5, -1, DARK);
block(6, 5, -1, DARK);

// === LEFT ARM ===
// Upper arm
cube(-8, 4, -1, -6, 8, 2, RED);

// Forearm
cube(-10, 2, -1, -8, 7, 2, RED);

// Elbow plate
cube(-8, 3, -1, -7, 5, 2, GOLD);
cube(-9, 4, -1, -8, 5, 2, DARK);

// Wrist/hand area
cube(-11, 1, -1, -10, 5, 2, GREY);
cube(-12, 2, -1, -11, 4, 2, DARK);

// Fist detail
block(-12, 2, 0, GOLD);
block(-11, 1, 0, GOLD);

// === RIGHT ARM ===
// Upper arm
cube(6, 4, -1, 8, 8, 2, RED);

// Forearm
cube(8, 2, -1, 10, 7, 2, RED);

// Elbow plate
cube(7, 3, -1, 8, 5, 2, GOLD);
cube(8, 4, -1, 9, 5, 2, DARK);

// Wrist/hand area
cube(10, 1, -1, 11, 5, 2, GREY);
cube(11, 2, -1, 12, 4, 2, DARK);

// Fist detail
block(12, 2, 0, GOLD);
block(11, 1, 0, GOLD);

// === WAIST/HIP ===
cube(-3, 1, -1, 3, 3, 2, GOLD);
cube(-4, 2, -1, 4, 2, 2, GREY);

// === LEFT LEG ===
// Thigh
cube(-4, -2, -1, -2, 2, 2, RED);

// Shin
cube(-4, -5, -1, -2, -2, 2, RED);

// Leg side plating
cube(-5, -1, -1, -4, 1, 2, GREY);
cube(-5, -4, -1, -4, -2, 2, DARK);

// === RIGHT LEG ===
// Thigh
cube(2, -2, -1, 4, 2, 2, RED);

// Shin
cube(2, -5, -1, 4, -2, 2, RED);

// Leg side plating
cube(4, -1, -1, 5, 1, 2, GREY);
cube(4, -4, -1, 5, -2, 2, DARK);

// === BOOTS ===
// Left boot
cube(-4, -6, -1, -2, -5, 2, DARK);
cube(-4, -6, 1, -2, -5, 2, GOLD);

// Right boot
cube(2, -6, -1, 4, -5, 2, DARK);
cube(2, -6, 1, 4, -5, 2, GOLD);

// Boot tabs
block(-3, -6, 0, GREY);
block(3, -6, 0, GREY);

// === CHEST DETAILING ===
// Ventilation lines
block(0, 5, 0, DARK);
block(-1, 5, 1, DARK);
block(1, 5, 1, DARK);

// Armor seams on upper torso
block(-2, 6, 0, DARK);
block(2, 6, 0, DARK);

// === ARM SEGMENT MARKERS ===
block(-9, 5, 0, GOLD);
block(9, 5, 0, GOLD);

// === LEG SEGMENT DEFINITION ===
block(-3, -1, 0, DARK);
block(3, -1, 0, DARK);
block(-3, -4, 0, GOLD);
block(3, -4, 0, GOLD);

// === CHEST GRATING ===
block(0, 3, 0, DARK);
block(-1, 4, 0, DARK);
block(1, 4, 0, DARK);