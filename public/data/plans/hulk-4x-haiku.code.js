// hulk-4x-haiku — prompt:
// the Incredible Hulk...

// Incredible Hulk - massive green muscular voxel figure

const legY = 0;
const torsoBase = 8;
const shoulderY = 18;
const headY = 23;

// LEGS - thick powerful stance
// Left leg (wider base)
cube(-6, legY, -3, -2, torsoBase, 3, LEAVES);
cube(-7, legY, -1, -5, torsoBase - 2, 2, LEAVES);

// Right leg (wider base)
cube(2, legY, -3, 6, torsoBase, 3, LEAVES);
cube(5, legY, -1, 7, torsoBase - 2, 2, LEAVES);

// Leg depth extension
cube(-6, legY, 0, -2, torsoBase, 4, LEAVES);
cube(2, legY, 0, 6, torsoBase, 4, LEAVES);

// Quadriceps definition
cube(-5, 3, 3, -3, 7, 4, GRASS);
cube(3, 3, 3, 5, 7, 4, GRASS);

// Shin definition
cube(-5, 1, 4, -3, 5, 5, STONE);
cube(3, 1, 4, 5, 5, 5, STONE);

// Boots - red fists metaphor extended down
cube(-6, 0, -3, -2, 2, -2, BRICK);
cube(2, 0, -3, 6, 2, -2, BRICK);

// MASSIVE TORSO - the Hulk's power core
// Main body volume
cube(-7, torsoBase, -3, 7, shoulderY, 4, LEAVES);

// Pectoral muscles - huge and defined
cube(-6, torsoBase + 2, 4, -2, shoulderY - 2, 5, GRASS);
cube(2, torsoBase + 2, 4, 6, shoulderY - 2, 5, GRASS);

// Abdominal blocks - 8-pack detail
cube(-5, torsoBase + 1, 4, -3, torsoBase + 3, 5, STONE);
cube(3, torsoBase + 1, 4, 5, torsoBase + 3, 5, STONE);
cube(-5, torsoBase + 4, 4, -3, torsoBase + 6, 5, STONE);
cube(3, torsoBase + 4, 4, 5, torsoBase + 6, 5, STONE);
cube(-5, torsoBase + 7, 4, -3, torsoBase + 9, 5, STONE);
cube(3, torsoBase + 7, 4, 5, torsoBase + 9, 5, STONE);

// Oblique muscles (sides)
cube(-7, torsoBase + 3, 0, -6, shoulderY - 1, 3, GRASS);
cube(6, torsoBase + 3, 0, 7, shoulderY - 1, 3, GRASS);

// Back muscles visible from side
cube(-6, torsoBase + 4, -4, 6, shoulderY - 2, -3, STONE);

// Torso depth
cube(-7, torsoBase + 1, -4, 7, shoulderY, -3, LEAVES);

// MASSIVE SHOULDERS - incredibly broad
cube(-10, shoulderY - 2, -2, 10, shoulderY + 2, 3, LEAVES);
cube(-11, shoulderY - 1, 0, 11, shoulderY + 1, 2, LEAVES);

// Deltoid muscles (shoulders)
cube(-9, shoulderY, 2, -7, shoulderY + 3, 4, GRASS);
cube(7, shoulderY, 2, 9, shoulderY + 3, 4, GRASS);

// ARMS - enormous and powerful
// Left upper arm
cube(-13, shoulderY - 1, -2, -10, shoulderY + 5, 2, LEAVES);
cube(-14, shoulderY, -1, -12, shoulderY + 4, 1, LEAVES);

// Right upper arm
cube(10, shoulderY - 1, -2, 13, shoulderY + 5, 2, LEAVES);
cube(12, shoulderY, -1, 14, shoulderY + 4, 1, LEAVES);

// Bicep definition (huge)
cube(-12, shoulderY + 1, 2, -10, shoulderY + 5, 4, GRASS);
cube(10, shoulderY + 1, 2, 12, shoulderY + 5, 4, GRASS);

// Left forearm - massive
cube(-14, shoulderY + 4, -2, -11, shoulderY + 9, 2, LEAVES);
cube(-15, shoulderY + 5, -1, -13, shoulderY + 8, 1, LEAVES);

// Right forearm - massive
cube(11, shoulderY + 4, -2, 14, shoulderY + 9, 2, LEAVES);
cube(13, shoulderY + 5, -1, 15, shoulderY + 8, 1, LEAVES);

// Forearm detail
cube(-14, shoulderY + 6, 2, -11, shoulderY + 8, 4, GRASS);
cube(11, shoulderY + 6, 2, 14, shoulderY + 8, 4, GRASS);

// Wrist/hand transition
cube(-14, shoulderY + 8, -1, -12, shoulderY + 10, 1, STONE);
cube(12, shoulderY + 8, -1, 14, shoulderY + 10, 1, STONE);

// MASSIVE FISTS - iconic Hulk smash
// Left fist
cube(-16, shoulderY + 8, -2, -13, shoulderY + 12, 2, BRICK);
cube(-17, shoulderY + 9, -1, -14, shoulderY + 11, 1, BRICK);

// Right fist
cube(13, shoulderY + 8, -2, 16, shoulderY + 12, 2, BRICK);
cube(14, shoulderY + 9, -1, 17, shoulderY + 11, 1, BRICK);

// Knuckles detail
cube(-16, shoulderY + 11, -2, -13, shoulderY + 13, 2, STONE);
cube(13, shoulderY + 11, -2, 16, shoulderY + 13, 2, STONE);

// NECK - thick and muscular
cube(-3, shoulderY - 1, -1, 3, headY - 1, 2, LEAVES);

// Neck muscle/trapezius
cube(-4, shoulderY, 2, 4, headY - 2, 3, GRASS);

// HEAD - powerful and angry
// Main head structure
cube(-4, headY, -2, 4, headY + 5, 2, LEAVES);
cube(-5, headY + 1, -1, 5, headY + 4, 1, LEAVES);

// Forehead ridge - heavy brow
cube(-4, headY + 2, 2, 4, headY + 4, 3, STONE);

// Eye sockets - dark and intense
cube(-3, headY + 2, 3, -1, headY + 4, 4, STONE);
cube(1, headY + 2, 3, 3, headY + 4, 4, STONE);

// Nose - wide and powerful
cube(-1, headY + 1, 3, 1, headY + 3, 4, GRASS);
cube(-2, headY + 1, 4, 2, headY + 2, 5, STONE);

// Jaw line - strong
cube(-4, headY, 2, 4, headY + 2, 3, GRASS);

// Chin definition
cube(-3, headY, 2, 3, headY + 1, 3, STONE);

// Mouth snarl
line(-2, headY + 1, 3, 2, headY + 1, 3, STONE);

// Ears (side detail)
cube(-5, headY + 2, 1, -4, headY + 4, 2, GRASS);
cube(4, headY + 2, 1, 5, headY + 4, 2, GRASS);

// Hair spikes - crown
cube(-3, headY + 5, 2, -1, headY + 7, 3, STONE);
cube(1, headY + 5, 2, 3, headY + 7, 3, STONE);
cube(-1, headY + 5, 3, 1, headY + 8, 4, STONE);

// BATTLE DAMAGE - torn pants and scars
// Torn fabric
cube(-5, torsoBase - 1, -4, -3, torsoBase + 2, -3, PLANKS);
cube(3, torsoBase - 1, -4, 5, torsoBase + 2, -3, PLANKS);

// Scars/damage marks on torso
line(-1, torsoBase + 5, 5, -1, shoulderY - 2, 5, STONE);
line(1, torsoBase + 5, 5, 1, shoulderY - 2, 5, STONE);

// Chest scar
cube(-1, torsoBase + 6, 5, 1, torsoBase + 9, 6, STONE);