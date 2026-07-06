// knight-4x-haiku — prompt:
// knight...

// Knight Fortress & Armored Figure

// Foundation
cube(-16, -2, -16, 16, -1, 16, STONE);

// Outer fortress walls
cube(-14, 0, -14, 14, 8, 14, STONE);
hollowCube(-13, 1, -13, 13, 7, 13, AIR);

// Gate entrance
hollowCube(-3, 0, -14, 3, 6, -13, AIR);

// Corner towers
cylinder(-11, 0, -11, 2.5, 10, COBBLE);
cylinder(11, 0, -11, 2.5, 10, COBBLE);
cylinder(-11, 0, 11, 2.5, 10, COBBLE);
cylinder(11, 0, 11, 2.5, 10, COBBLE);

// Central keep tower
cube(-7, 0, -7, 7, 14, 7, STONE);
hollowCube(-6, 1, -6, 6, 13, 6, AIR);

// Rampart crenellations on keep
cube(-7, 13, -7, -6, 14, -6, STONE);
cube(6, 13, -7, 7, 14, -6, STONE);
cube(-7, 13, 6, -6, 14, 7, STONE);
cube(6, 13, 6, 7, 14, 7, STONE);

// Knight armor - main body (cuirass)
cube(-2, 2, -1.5, 2, 6, 1.5, STONE);

// Knight legs
cube(-1, 0, -1, 1, 3, 1, COBBLE);

// Greaves (leg plates)
cube(-1.5, 1, -1.5, 1.5, 3, 1.5, STONE);

// Knight left arm with gauntlet
cube(-3, 3, -1, -2, 7, 1, STONE);
cube(-3.5, 5, -1, -3, 7, 1, COBBLE);

// Knight right arm with gauntlet
cube(2, 3, -1, 3, 7, 1, STONE);
cube(3, 5, -1, 3.5, 7, 1, COBBLE);

// Pauldrons (shoulder armor)
sphere(-2.5, 6, -0.5, 0.9, COBBLE);
sphere(2.5, 6, -0.5, 0.9, COBBLE);

// Knight neck
cube(-0.5, 6.5, -0.5, 0.5, 7, 0.5, STONE);

// Knight helmet - closed visor
sphere(0, 7.5, 0, 1.3, STONE);
cube(-1.2, 7.2, -0.2, 1.2, 8, 0.8, COBBLE);

// Knight shield (left arm)
hollowCube(-4.5, 2, -2.5, -2.5, 7, 2.5, BRICK);
cube(-4, 2.5, -2, -3, 6.5, 2, BRICK);

// Knight sword (right hand)
line(3.5, 6, 0.5, 3.5, 12, 0.5, COBBLE);
cube(3, 5, 0, 4, 6, 1, BRICK);

// Torch sconces on outer walls
block(-13, 5, 0, BRICK);
block(13, 5, 0, BRICK);
block(0, 5, -13, BRICK);
block(0, 5, 13, BRICK);

// Banner pole on keep
cylinder(6.5, 0, 6.5, 0.5, 11, OAK_LOG);

// Banner
cube(6.5, 9, 4.5, 8.5, 11, 6.5, BRICK);

// Wooden training grounds
cube(-12, 0, 10, -8, 0, 14, PLANKS);
cube(8, 0, 10, 12, 0, 14, PLANKS);

// Training post
cylinder(-10, 0, 12, 0.6, 5, OAK_LOG);

// Barracks building
cube(-12, 0, -12, -8, 5, -8, STONE);
hollowCube(-11, 1, -11, -9, 4, -9, AIR);
cube(-10, 4, -10, -10, 5, -10, STONE);

// Storage tower
cylinder(10, 0, -10, 2, 7, COBBLE);

// Wooden platform walkway
cube(-5, 8, -5, 5, 8, 5, PLANKS);

// Courtyard floor pattern
disk(0, 0.5, 0, 12, COBBLE);

// Guard post outcrops
cube(-13, 5, -2, -12, 9, 2, STONE);
cube(12, 5, -2, 13, 9, 2, STONE);

// Weapon rack details near knight
cube(-6, 0, 5, -5, 4, 6, OAK_LOG);
line(-6, 1, 5.5, -5, 1, 5.5, COBBLE);
line(-6, 2, 5.5, -5, 2, 5.5, COBBLE);