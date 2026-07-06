// trex-4x-haiku — prompt:
// trex...

const STONE = 3;
const BRICK = 10;
const COBBLE = 8;

// HIND LEGS - massive muscular thighs
cube(-5, -1, -6, -2, 5, -2, STONE);
cube(2, -1, -6, 5, 5, -2, STONE);

// Calf muscles
cube(-5, -2, -5, -3, 2, -3, STONE);
cube(3, -2, -5, 5, 2, -3, STONE);

// Feet
cube(-5, -3, -7, -2, -2, -1, COBBLE);
cube(2, -3, -7, 5, -2, -1, COBBLE);

// Toe claws
block(-5, -4, -8, BRICK);
block(-3, -4, -8, BRICK);
block(2, -4, -8, BRICK);
block(4, -4, -8, BRICK);

// BODY - barrel torso
cube(-4, 4, -4, 4, 10, 2, STONE);
cube(-5, 5, -5, 5, 9, 1, STONE);

// Ribcage detail
cube(-2, 6, -6, 2, 9, -5, COBBLE);
block(-4, 7, -5, BRICK);
block(4, 7, -5, BRICK);

// Hip girdle
cube(-3, 2, -3, 3, 5, 1, STONE);

// NECK - muscular transition
cube(-1, 10, -1, 1, 13, 1, STONE);
cube(-2, 11, -2, 2, 12, 0, STONE);

// HEAD - aggressive stance
cube(-3, 13, -2, 3, 17, 3, STONE);

// Extended snout
cube(-2, 13, 3, 2, 15, 6, BRICK);

// Upper jaw ridge
cube(-2, 16, 4, 2, 17, 5, STONE);

// Teeth - upper
block(-2, 17, 6, BRICK);
block(-1, 17, 6, BRICK);
block(0, 17, 6, BRICK);
block(1, 17, 6, BRICK);

// Teeth - lower
block(-2, 13, 6, BRICK);
block(-1, 13, 6, BRICK);
block(0, 13, 6, BRICK);
block(1, 13, 6, BRICK);

// Eye sockets - deep set
block(-2, 15, -1, COBBLE);
block(2, 15, -1, COBBLE);

// Nostril hole
block(0, 14, 6, STONE);

// TAIL - powerful sweeping tail
cube(4, 6, -3, 7, 10, 0, STONE);
cube(8, 5, -2, 11, 9, 0, STONE);
cube(12, 4, -1, 15, 8, 0, STONE);
cube(16, 2, 0, 19, 6, 1, COBBLE);
cube(20, 1, 0, 22, 4, 1, BRICK);

// Tail sail ridge
cube(5, 10, -3, 6, 11, -2, COBBLE);
cube(9, 9, -2, 10, 10, -1, COBBLE);
cube(13, 8, -1, 14, 9, 0, COBBLE);

// TINY RIGHT ARM
cube(-6, 5, 0, -4, 7, 2, STONE);
cube(-8, 4, -1, -7, 6, 3, COBBLE);

// Right claw
block(-8, 4, 4, BRICK);
block(-7, 4, 4, BRICK);

// TINY LEFT ARM
cube(4, 5, 0, 6, 7, 2, STONE);
cube(7, 4, -1, 8, 6, 3, COBBLE);

// Left claw
block(7, 4, 4, BRICK);
block(8, 4, 4, BRICK);

// Dorsal spikes
block(-3, 11, -2, BRICK);
block(0, 11, -2, BRICK);
block(3, 11, -2, BRICK);
block(-2, 10, -3, BRICK);
block(2, 10, -3, BRICK);