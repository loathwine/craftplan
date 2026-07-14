// blue-whale-4x-haiku — prompt:
// a blue whale...

const GLASS = 11;
const ICE = 13;
const STONE = 3;
const BRICK = 10;
const COBBLE = 8;

// Head section - streamlined rostrum
sphere(0, 9, -20, 4, GLASS);      // Snout point
sphere(0, 9, -15, 7, GLASS);      // Upper head
sphere(0, 8, -9, 9, GLASS);       // Head/neck transition

// Shoulder and front body
sphere(0, 9, -2, 10, GLASS);      // Chest/shoulder
sphere(0, 9, 6, 10, GLASS);       // Front main body

// Mid and rear body sections
sphere(0, 8, 14, 9, GLASS);       // Mid-body
sphere(0, 8, 21, 7, GLASS);       // Rear taper

// Pectoral fins - large paddle-like fins
cube(-12, 3, -1, -8, 15, 7, GLASS);    // Left pectoral
cube(8, 3, -1, 12, 15, 7, GLASS);      // Right pectoral

// Dorsal fin - small ridge on back
cube(-1, 18, 8, 1, 23, 10, ICE);

// Massive tail flukes
sphere(-9, 1, 21, 7, GLASS);     // Left fluke
sphere(9, 1, 21, 7, GLASS);      // Right fluke

// Eyes
block(-7, 13, -12, STONE);
block(7, 13, -12, STONE);

// Baleen plates in mouth interior
block(-2, 8, -19, BRICK);
block(-1, 8, -19, BRICK);
block(0, 8, -19, BRICK);
block(1, 8, -19, BRICK);
block(2, 8, -19, BRICK);

// Ventral grooves - characteristic baleen whale throat pleats
line(-4, 5, -10, 4, 5, -10, 0);   // Front groove
line(-4, 5, 1, 4, 5, 1, 0);       // Mid-front groove
line(-4, 5, 12, 4, 5, 12, 0);     // Mid-rear groove
line(-4, 5, 20, 4, 5, 20, 0);     // Rear groove

// Flank coloring - lighter blue side patches
cube(-11, 11, 3, -9, 13, 21, ICE);    // Left flank
cube(9, 11, 3, 11, 13, 21, ICE);      // Right flank

// Back ridge detail - subtle dorsal line
cube(-2, 16, 6, 2, 17, 18, COBBLE);   // Dorsal ridge tone