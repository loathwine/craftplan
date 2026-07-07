// yeti-4x-haiku — prompt:
// a yeti...

const SNOW = 12;
const STONE = 3;
const OAK_LOG = 4;

// YETI - Large white ape-like creature facing north

// === MAIN BODY ===
// Core torso - bulky and rounded
cube(-5, 1, -3, 5, 11, 4, SNOW);
sphere(0, 6, 0, 4.5, SNOW);

// Upper torso/chest
cube(-4, 9, -2, 4, 13, 2, SNOW);
sphere(0, 10, -1, 3.5, SNOW);

// Chest protrusion
cube(-2, 11, -3, 2, 14, -1, SNOW);

// === NECK ===
cube(-2, 12, -1, 2, 15, 1, SNOW);

// === HEAD ===
// Main head sphere
sphere(0, 17, -1, 4.2, SNOW);

// Head top/crown
cube(-4, 17, -2, 4, 20, 1, SNOW);

// === FACE/SNOUT ===
// Muzzle projection
sphere(0, 15, -6, 2.5, SNOW);
cube(-2, 13, -7, 2, 16, -5, SNOW);

// Eyes
block(-2, 17, -6, STONE);
block(2, 17, -6, STONE);

// Eyebrows
block(-3, 18, -5, OAK_LOG);
block(3, 18, -5, OAK_LOG);

// Nose
block(0, 15, -7, STONE);
block(0, 16, -7, STONE);

// Mouth line
line(-2, 13, -6, 2, 13, -6, STONE);

// Chin area
cube(-3, 12, -6, 3, 14, -5, SNOW);

// === LEFT ARM ===
// Shoulder area
sphere(-8, 10, -1, 3, SNOW);

// Upper arm
cube(-12, 6, -1, -6, 12, 2, SNOW);
sphere(-10, 7, 0, 2.2, SNOW);

// Lower arm/forearm
sphere(-14, 4, 0, 2, SNOW);
cube(-17, 1, -1, -11, 7, 1, SNOW);

// Hand/fist with claws
cube(-18, 0, -2, -16, 5, 1, SNOW);
line(-19, 2, -1, -20, -1, -1, STONE);
line(-18, 2, -1, -19, -1, -1, STONE);
line(-17, 2, -1, -18, -1, -1, STONE);
line(-16, 2, -1, -17, -1, -1, STONE);

// === RIGHT ARM ===
// Shoulder area
sphere(8, 10, -1, 3, SNOW);

// Upper arm
cube(6, 6, -1, 12, 12, 2, SNOW);
sphere(10, 7, 0, 2.2, SNOW);

// Lower arm/forearm
sphere(14, 4, 0, 2, SNOW);
cube(11, 1, -1, 17, 7, 1, SNOW);

// Hand/fist with claws
cube(16, 0, -2, 18, 5, 1, SNOW);
line(19, 2, -1, 20, -1, -1, STONE);
line(18, 2, -1, 19, -1, -1, STONE);
line(17, 2, -1, 18, -1, -1, STONE);
line(16, 2, -1, 17, -1, -1, STONE);

// === LEFT LEG ===
sphere(-4, 3, 0, 2.5, SNOW);
cube(-7, -1, -2, -1, 6, 2, SNOW);

// Left foot
cube(-8, -3, -3, -2, 1, 2, SNOW);
line(-9, -1, -2, -10, -3, -2, STONE);
line(-7, -1, -2, -8, -3, -2, STONE);
line(-5, -1, -2, -6, -3, -2, STONE);

// === RIGHT LEG ===
sphere(4, 3, 0, 2.5, SNOW);
cube(1, -1, -2, 7, 6, 2, SNOW);

// Right foot
cube(2, -3, -3, 8, 1, 2, SNOW);
line(9, -1, -2, 10, -3, -2, STONE);
line(7, -1, -2, 8, -3, -2, STONE);
line(5, -1, -2, 6, -3, -2, STONE);

// === BACK/REAR MASS ===
// Back torso bulk
cube(-4, 2, 1, 4, 10, 5, SNOW);
sphere(0, 6, 4, 3.5, SNOW);

// Back shoulders
sphere(-3, 11, 3, 1.8, SNOW);
sphere(3, 11, 3, 1.8, SNOW);

// === FUR & TEXTURE DETAILS ===
// Chest fur protrusion
cube(-1, 13, -3, 1, 16, -2, SNOW);

// Side fur tufts
cube(-6, 7, -1, -5, 11, 1, SNOW);
cube(5, 7, -1, 6, 11, 1, SNOW);

// Hip muscle detail
cube(-5, 4, 0, -4, 8, 2, SNOW);
cube(4, 4, 0, 5, 8, 2, SNOW);

// Back neck ridge
cube(-2, 13, 1, 2, 16, 3, SNOW);

// Head side fur
cube(-5, 15, -2, -4, 19, 0, SNOW);
cube(4, 15, -2, 5, 19, 0, SNOW);

// Shoulder blade area
cube(-5, 9, 2, -3, 12, 4, SNOW);
cube(3, 9, 2, 5, 12, 4, SNOW);

// Back hip area
cube(-4, 3, 3, -2, 7, 4, SNOW);
cube(2, 3, 3, 4, 7, 4, SNOW);

// Belly/lower chest
cube(-3, 7, -1, 3, 10, 1, SNOW);

// Arm shoulder blades - back side
cube(-7, 9, 2, -6, 12, 3, SNOW);
cube(6, 9, 2, 7, 12, 3, SNOW);