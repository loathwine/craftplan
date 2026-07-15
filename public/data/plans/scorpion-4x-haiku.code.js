// scorpion-4x-haiku — prompt:
// a giant scorpion...

const STONE = 3;
const LOG = 4;
const COBBLE = 8;
const BRICK = 10;

// HEAD/CEPHALOTHORAX - tapered forward
cube(-4, 0, -14, 4, 2, -10, STONE);
cube(-3, 2, -14, 3, 4, -11, STONE);
cube(-2, 4, -13, 2, 5, -11, STONE);
cube(-1, 5, -12, 1, 6, -11, STONE);

// Eyes
sphere(-2, 5, -10, 1, BRICK);
sphere(2, 5, -10, 1, BRICK);

// Mouth fangs (chelicerae)
line(-1, 3, -10, -2, 1, -9, COBBLE);
line(1, 3, -10, 2, 1, -9, COBBLE);

// THORAX - attachment point for legs
cube(-7, 0, -10, 7, 2, -5, STONE);
cube(-8, 1, -9, 8, 3, -4, STONE);

// ABDOMEN - 5 segments
// Segment 1 - widest
cube(-9, 0, -5, 9, 2, 1, STONE);
cube(-9, 1, -4, 9, 3, 0, STONE);
line(-8, 0, -2, 8, 0, -2, BRICK);

// Segment 2
cube(-9, 0, 1, 9, 2, 5, STONE);
cube(-8, 1, 2, 8, 3, 4, STONE);
line(-8, 0, 4, 8, 0, 4, BRICK);

// Segment 3
cube(-8, 0, 5, 8, 2, 9, STONE);
cube(-7, 1, 6, 7, 3, 8, STONE);
line(-7, 0, 8, 7, 0, 8, BRICK);

// Segment 4
cube(-7, 0, 9, 7, 2, 12, STONE);
cube(-6, 1, 10, 6, 3, 11, STONE);
line(-6, 0, 11, 6, 0, 11, BRICK);

// Segment 5 - pre-stinger
cube(-5, 0, 12, 5, 2, 14, STONE);
cube(-4, 1, 13, 4, 2, 13, STONE);

// STINGER - dramatic upward curve
cube(-3, 2, 14, 3, 3, 15, BRICK);
cube(-2, 3, 15, 2, 5, 16, BRICK);
cube(-1, 5, 16, 1, 7, 17, BRICK);
cube(0, 7, 17, 1, 9, 18, BRICK);
line(0, 8, 18, -1, 11, 21, BRICK);
line(0, 8, 18, 1, 12, 22, BRICK);

// LEFT PEDIPALPS/PINCERS - large and detailed
cube(-11, 0, -12, -7, 2, -10, COBBLE);
cube(-12, 1, -13, -10, 3, -11, COBBLE);
cube(-11, 2, -12, -10, 4, -11, COBBLE);
line(-13, 2, -12, -16, 2, -14, COBBLE);
line(-13, 3, -11, -16, 3, -13, COBBLE);

// RIGHT PEDIPALPS/PINCERS
cube(7, 0, -12, 11, 2, -10, COBBLE);
cube(10, 1, -13, 12, 3, -11, COBBLE);
cube(10, 2, -12, 11, 4, -11, COBBLE);
line(13, 2, -12, 16, 2, -14, COBBLE);
line(13, 3, -11, 16, 3, -13, COBBLE);

// WALKING LEGS - 8 total (4 pairs)
// Pair 1 - Front
line(-9, 0, -8, -15, 0, -10, LOG);
line(-9, 0, -6, -16, 0, -5, LOG);
line(9, 0, -8, 15, 0, -10, LOG);
line(9, 0, -6, 16, 0, -5, LOG);

// Pair 2 - Front-middle
line(-10, 0, -1, -16, 0, 0, LOG);
line(-10, 0, 2, -17, 0, 4, LOG);
line(10, 0, -1, 16, 0, 0, LOG);
line(10, 0, 2, 17, 0, 4, LOG);

// Pair 3 - Back-middle
line(-9, 0, 6, -15, 0, 7, LOG);
line(-9, 0, 9, -16, 0, 11, LOG);
line(9, 0, 6, 15, 0, 7, LOG);
line(9, 0, 9, 16, 0, 11, LOG);

// Pair 4 - Back
line(-7, 0, 11, -13, 0, 13, LOG);
line(-7, 0, 14, -13, 0, 16, LOG);
line(7, 0, 11, 13, 0, 13, LOG);
line(7, 0, 14, 13, 0, 16, LOG);

// Leg joint details - small blocks at leg attachment
block(-9, 0, -8, BRICK);
block(9, 0, -8, BRICK);
block(-10, 0, -1, BRICK);
block(10, 0, -1, BRICK);
block(-9, 0, 6, BRICK);
block(9, 0, 6, BRICK);
block(-7, 0, 11, BRICK);
block(7, 0, 11, BRICK);

// Ventral surface texture - belly plates
for (let z = -8; z <= 12; z += 3) {
  line(-6, 0, z, 6, 0, z, BRICK);
}

// Body ridges/segmentation detail
for (let z = -9; z <= 11; z += 2) {
  line(-7, 2, z, 7, 2, z, COBBLE);
}

// Stinger base ornament
cube(-1, 3, 12, 1, 4, 13, COBBLE);
block(-2, 3, 13, COBBLE);
block(2, 3, 13, COBBLE);