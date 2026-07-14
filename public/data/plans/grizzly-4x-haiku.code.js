// grizzly-4x-haiku — prompt:
// a grizzly bear standing on its hind legs...

// Grizzly bear standing on hind legs, facing north (-Z)

const BROWN = 4;      // OAK_LOG - main fur
const DARK = 2;       // DIRT - shadows and darker areas  
const TAN = 6;        // SAND - lighter fur highlights
const STONE = 3;      // Stone - claws and nose
const WHITE = 12;     // SNOW - bright fur details

// RIGHT HIND LEG (camera left, -X direction)
cube(-6, 0, -1, -2, 12, 4, BROWN);   // main leg mass
cube(-5, 1, 0, -3, 11, 3, DARK);     // inner shading
cube(-6, 2, 3, -2, 10, 5, TAN);      // lighter rear fur

// LEFT HIND LEG (camera right, +X direction)
cube(2, 0, -1, 6, 12, 4, BROWN);
cube(3, 1, 0, 5, 11, 3, DARK);
cube(2, 2, 3, 6, 10, 5, TAN);

// Foot pads - dark undersides
cube(-6, 0, -2, -1, 1, -1, DARK);
cube(1, 0, -2, 6, 1, -1, DARK);

// Foot claws
block(-6, 0, -2, STONE);
block(-1, 0, -2, STONE);
block(-4, 0, -3, STONE);
block(1, 0, -2, STONE);
block(6, 0, -2, STONE);
block(4, 0, -3, STONE);

// LOWER TORSO / BELLY
cube(-6, 11, -2, 6, 18, 5, BROWN);   // main lower body
cube(-5, 12, -1, 5, 17, 4, DARK);    // belly shadow
cube(-4, 13, 3, 4, 16, 6, TAN);      // lighter belly fur

// UPPER TORSO / CHEST - main volume
cube(-7, 18, -3, 7, 27, 4, BROWN);   // broad chest
cube(-6, 19, -2, 6, 26, 3, DARK);    // chest definition
cube(-5, 20, 2, 5, 25, 5, TAN);      // lighter side fur

// SHOULDERS - connection to arms
cube(-7, 25, -1, -5, 28, 3, BROWN);  // right shoulder
cube(5, 25, -1, 7, 28, 3, BROWN);    // left shoulder
cube(-6, 26, 0, 6, 27, 2, DARK);     // shoulder definition

// NECK
cube(-4, 27, -2, 4, 31, 2, BROWN);
cube(-3, 28, -1, 3, 30, 1, DARK);

// HEAD - main cranium
sphere(0, 33, -1, 5, BROWN);         // rounded head shape
cube(-5, 31, -5, 5, 36, 1, BROWN);   // head front/back
cube(-4, 32, -4, 4, 35, 0, DARK);    // head definition

// SNOUT - extends forward toward camera (north, -Z)
cube(-3, 31, -7, 3, 34, -4, BROWN);  // snout main block
cube(-2, 32, -8, 2, 33, -6, DARK);   // snout shadow
cube(-1, 32, -9, 1, 33, -8, BROWN);  // nose block

// NOSE - prominent at tip
block(0, 32, -9, STONE);
block(-1, 32, -9, STONE);
block(1, 32, -9, STONE);

// MOUTH LINE
line(-2, 32, -7, 2, 32, -7, DARK);

// EYES - positioned on sides of head
// Right eye (camera right, +X side)
block(3, 34, -2, DARK);
block(4, 34, -1, DARK);
block(3, 33, -2, STONE);
block(4, 33, -1, STONE);

// Left eye (camera left, -X side)
block(-3, 34, -2, DARK);
block(-4, 34, -1, DARK);
block(-3, 33, -2, STONE);
block(-4, 33, -1, STONE);

// EARS - on top of head
// Right ear
cube(-5, 36, -2, -2, 39, 1, BROWN);
cube(-5, 37, -1, -2, 38, 2, DARK);

// Left ear
cube(2, 36, -2, 5, 39, 1, BROWN);
cube(2, 37, -1, 5, 38, 2, DARK);

// LEFT ARM - reaching upward (camera right, +X)
cube(6, 18, -2, 10, 26, 3, BROWN);   // upper arm
cube(7, 19, -1, 9, 25, 2, DARK);     // arm shading
cube(7, 20, 2, 9, 24, 4, TAN);       // lighter arm fur
cube(9, 16, -2, 12, 22, 3, BROWN);   // forearm
cube(10, 17, -1, 11, 21, 2, DARK);
cube(11, 14, -1, 13, 18, 3, BROWN);  // paw/hand
cube(12, 13, 0, 13, 16, 2, DARK);

// Left arm claws
block(13, 13, -1, STONE);
block(13, 13, 1, STONE);
block(12, 13, 2, STONE);

// RIGHT ARM - reaching upward (camera left, -X)
cube(-10, 18, -2, -6, 26, 3, BROWN);
cube(-9, 19, -1, -7, 25, 2, DARK);
cube(-9, 20, 2, -7, 24, 4, TAN);
cube(-12, 16, -2, -9, 22, 3, BROWN);
cube(-11, 17, -1, -10, 21, 2, DARK);
cube(-13, 14, -1, -11, 18, 3, BROWN);
cube(-13, 13, 0, -12, 16, 2, DARK);

// Right arm claws
block(-13, 13, -1, STONE);
block(-13, 13, 1, STONE);
block(-12, 13, 2, STONE);

// BACK DETAIL - visible from angle
cube(-5, 18, 5, 5, 24, 8, BROWN);    // upper back
cube(-4, 15, 6, 4, 20, 9, TAN);      // lighter back fur

// TEXTURE & FUR DETAIL - adds realism and uses budget
cube(-3, 22, 3, 3, 25, 6, WHITE);    // chest fur highlights
cube(-4, 14, 4, 4, 16, 7, WHITE);    // belly texture
cube(-4, 6, 4, -2, 9, 7, WHITE);     // right leg texture
cube(2, 6, 4, 4, 9, 7, WHITE);       // left leg texture
cube(-3, 35, -1, 3, 37, 1, WHITE);   // head highlights
cube(8, 20, 3, 10, 24, 5, WHITE);    // left arm fur detail
cube(-10, 20, 3, -8, 24, 5, WHITE);  // right arm fur detail