// darth-vader-4x-haiku — prompt:
// Darth Vader...

// Darth Vader - Epic Voxel Build

// HELMET - Main imposing dome
const helmCx = 0, helmCy = 12, helmCz = -1;
sphere(helmCx, helmCy, helmCz, 8, COBBLE);
hollowSphere(helmCx, helmCy, helmCz, 6, AIR);

// Helmet crest - iconic peaked design
cube(-2, 20, -2, 2, 26, 2, STONE);
cube(-1, 26, -1, 1, 30, 1, COBBLE);

// BREATHING APPARATUS - Left and right units
// Left
cube(-7, 8, 3, -3, 16, 5, STONE);
cylinder(-6, 10, 3, 1, 0, COBBLE);
cylinder(-4, 12, 3, 1, 0, COBBLE);
cylinder(-6, 14, 3, 1, 0, COBBLE);
// Right
cube(3, 8, 3, 7, 16, 5, STONE);
cylinder(4, 10, 3, 1, 0, COBBLE);
cylinder(6, 12, 3, 1, 0, COBBLE);
cylinder(4, 14, 3, 1, 0, COBBLE);

// Central breath area - GLASS visor
cube(-3, 10, 4, 3, 15, 5, GLASS);

// Eye visor - glowing blue
cube(-1, 14, 2, 1, 18, 4, GLASS);

// Neck connector
cube(-3, 6, -1, 3, 9, 1, STONE);

// MAIN CHEST ARMOR
cube(-8, -2, -3, 8, 10, 2, COBBLE);

// Central chest panel - layered detail
cube(-6, -1, -4, 6, 9, -3, STONE);
cube(-7, 1, -5, -5, 8, -4, COBBLE);
cube(5, 1, -5, 7, 8, -4, COBBLE);

// Chest ribbed detail - vertical panels
for (let x = -5; x <= 5; x += 2) {
  cube(x, 1, -4, x + 1, 8, -3, STONE);
}

// Waist belt
cube(-7, 1, -2, 7, 3, 0, STONE);

// SHOULDERS - Large powerful pauldrons
cube(-10, 7, -2, -7, 11, 2, STONE);
cube(7, 7, -2, 10, 11, 2, STONE);
cube(-11, 8, -1, -10, 10, 1, COBBLE);
cube(10, 8, -1, 11, 10, 1, COBBLE);

// CAPE - Flowing right side (major detail)
// Base structure
cube(8, 1, -10, 15, 10, 13, STONE);
// Outer layers for flow/depth
cube(10, 2, -8, 18, 8, 11, COBBLE);
cube(12, 1, -6, 20, 6, 9, STONE);
// Cape detail - irregular edge
cube(9, 3, -9, 14, 7, 12, STONE);
cube(11, 2, -7, 17, 6, 10, COBBLE);

// ARMS
// Left
cube(-13, 3, -2, -9, 10, 1, STONE);
cube(-14, 5, -1, -13, 8, 0, COBBLE);
// Right
cube(9, 3, -2, 13, 10, 1, STONE);
cube(13, 5, -1, 14, 8, 0, COBBLE);

// LEGS - boots
// Left leg
cube(-4, -7, -2, -1, 1, 1, STONE);
cube(-6, -10, -1, -2, -7, 0, COBBLE);
// Right leg
cube(1, -7, -2, 4, 1, 1, STONE);
cube(2, -10, -1, 6, -7, 0, COBBLE);

// LIGHTSABER - Red blade in right hand
// Hilt - metallic
cube(13, 3, -1, 16, 9, 1, COBBLE);
cube(14, 4, 0, 15, 8, 1, STONE);
// Red blade - made with multiple lines for breadth
line(16, 4, -1, 16, 18, -1, BRICK);
line(16, 4, 1, 16, 18, 1, BRICK);
line(17, 4, 0, 17, 18, 0, BRICK);
line(15, 4, 0, 15, 18, 0, BRICK);