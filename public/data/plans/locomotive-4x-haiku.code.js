// locomotive-4x-haiku — prompt:
// a steam locomotive...

// Steam Locomotive - Detailed Build

// Main boiler (large central cylinder)
cylinder(0, 4, 0, 5, 6, STONE);

// Steam dome on boiler
sphere(0, 10, -1, 2.5, STONE);

// Smokestack at front (north)
cylinder(0, 11, -12, 2, 8, STONE);
disk(0, 19, -12, 3, BRICK);

// Smokebox between stack and boiler
cube(-3, 5, -6, 3, 9, -2, STONE);

// Pipes connecting stack to boiler
line(0, 10, -11, 0, 8, -5, OAK_LOG);
line(1, 10, -11, 1, 8, -5, OAK_LOG);
line(-1, 10, -11, -1, 8, -5, OAK_LOG);

// Cab (driver's compartment) at rear
cube(-3, 1, 8, 3, 8, 15, PLANKS);
cube(-4, 8, 7, 4, 10, 16, OAK_LOG);

// Cab windows and openings
cube(-4, 4, 9, -4, 7, 11, AIR);
cube(4, 4, 9, 4, 7, 11, AIR);
cube(-2, 4, 16, 2, 7, 16, AIR);

// Running boards (platforms)
cube(-5, 3, -8, 5, 3, 5, PLANKS);
cube(-5, 3, 8, 5, 3, 15, PLANKS);

// Front coupler and buffer
cube(-1, 1, -18, 1, 3, -16, STONE);
line(-2, 2, -19, 2, 2, -19, COBBLE);

// Pilot (cowcatcher)
cube(-4, 0, -17, 4, 2, -14, COBBLE);

// Six driving wheels (3 axles on each side)
// Front axle
cylinder(-5, 1, -9, 3.5, 2, COBBLE);
cylinder(5, 1, -9, 3.5, 2, COBBLE);

// Middle axle
cylinder(-5, 1, -1, 3.5, 2, COBBLE);
cylinder(5, 1, -1, 3.5, 2, COBBLE);

// Rear axle
cylinder(-5, 1, 9, 3.5, 2, COBBLE);
cylinder(5, 1, 9, 3.5, 2, COBBLE);

// Wheel hubs
disk(-5, 2, -9, 1.5, BRICK);
disk(5, 2, -9, 1.5, BRICK);
disk(-5, 2, -1, 1.5, BRICK);
disk(5, 2, -1, 1.5, BRICK);
disk(-5, 2, 9, 1.5, BRICK);
disk(5, 2, 9, 1.5, BRICK);

// Connecting side rods (mechanical detail between wheels)
line(-5, 4, -9, -5, 4, -1, OAK_LOG);
line(5, 4, -9, 5, 4, -1, OAK_LOG);
line(-5, 4, -1, -5, 4, 9, OAK_LOG);
line(5, 4, -1, 5, 4, 9, OAK_LOG);

// Piston rods
line(-5, 6, -8, -5, 6, -2, OAK_LOG);
line(5, 6, -8, 5, 6, -2, OAK_LOG);

// Boiler bands (decorative metal rings)
hollowCylinder(0, 4, 0, 5.5, 1, BRICK);
hollowCylinder(0, 6, 0, 5.5, 1, BRICK);
hollowCylinder(0, 8, 0, 5.5, 1, BRICK);

// Side water tanks
cube(-7, 3, -6, -7, 7, 8, STONE);
cube(7, 3, -6, 7, 7, 8, STONE);

// Safety valve stacks on boiler
cube(-2, 10, -2, -1, 11, -1, BRICK);
cube(1, 10, 1, 2, 11, 2, BRICK);

// Pressure gauge assembly
cube(3, 8, 2, 4, 9, 3, BRICK);
line(3.5, 8.5, 2.5, 3.5, 9.5, 2.5, COBBLE);

// Auxiliary piping detail
line(-4, 7, -4, -4, 8, -4, OAK_LOG);
line(4, 7, -4, 4, 8, -4, OAK_LOG);
line(0, 7, 3, 0, 8, 5, OAK_LOG);

// Running board steps
cube(-4, 2, 6, -3, 3, 7, STONE);
cube(3, 2, 6, 4, 3, 7, STONE);

// Boiler cladding accent lines
line(-5.5, 4, -3, -5.5, 9, -3, BRICK);
line(-5.5, 4, 2, -5.5, 9, 2, BRICK);
line(5.5, 4, -3, 5.5, 9, -3, BRICK);
line(5.5, 4, 2, 5.5, 9, 2, BRICK);

// Sand dome
sphere(-2, 9, -3, 1.5, SAND);

// Fire box (darker section below cab)
cube(-2, 2, 6, 2, 5, 8, BRICK);

// Rear tender coupler
cube(-1, 1, 15, 1, 3, 16, STONE);
line(0, 2, 16, 0, 2, 18, COBBLE);

// Axle support frame
line(-6, 2, -9, 6, 2, -9, STONE);
line(-6, 2, -1, 6, 2, -1, STONE);
line(-6, 2, 9, 6, 2, 9, STONE);