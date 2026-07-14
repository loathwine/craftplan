// groot-4x-haiku — prompt:
// Groot...

const AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, OAK_LOG = 4, LEAVES = 5, SAND = 6, PLANKS = 7, COBBLE = 8, BRICK = 10, GLASS = 11, SNOW = 12, ICE = 13;

// LEGS - thick tree-stump pillars
cube(-6, 0, -4, -2, 7, 2, OAK_LOG);
cube(2, 0, -4, 6, 7, 2, OAK_LOG);

// Leg roots
cube(-7, -2, -5, -5, 0, -3, DIRT);
cube(4, -2, -5, 6, 0, -3, DIRT);

// TORSO - main barrel body, slightly wider than legs
cube(-8, 7, -7, 8, 17, 4, OAK_LOG);

// Torso bark texture - asymmetrical planks for organic feel
cube(-8, 8, -7, -6, 11, -6, PLANKS);
cube(6, 9, -7, 8, 12, -6, PLANKS);
cube(-7, 13, -7, -5, 16, -6, PLANKS);
cube(5, 12, -7, 7, 15, -5, COBBLE);

// Shoulder/side foliage
sphere(-7, 14, -6, 4, LEAVES);
sphere(7, 13, -6, 4, LEAVES);

// LEFT ARM - thick, reaching forward-left
cube(-11, 10, -8, -8, 14, 1, OAK_LOG);
cube(-12, 11, -8, -10, 13, -7, PLANKS);

// Left hand with finger leaves
cube(-12, 12, -9, -11, 15, -8, LEAVES);
line(-13, 13, -8, -13, 16, -8, LEAVES);
line(-10, 12, -9, -9, 15, -9, LEAVES);

// RIGHT ARM - thick, reaching forward-right
cube(8, 9, -8, 11, 13, 0, OAK_LOG);
cube(10, 10, -8, 12, 12, -7, PLANKS);

// Right hand with fingers
cube(11, 11, -9, 12, 14, -8, LEAVES);
line(13, 12, -7, 14, 15, -7, LEAVES);
line(10, 12, -9, 9, 15, -9, LEAVES);

// HEAD - smaller, on top of torso
cube(-4, 17, -6, 4, 22, 1, OAK_LOG);

// Head bark detail
cube(-4, 18, -6, -3, 20, -5, PLANKS);
cube(3, 18, -6, 4, 20, -5, PLANKS);

// FOLIAGE CROWN - leaves cluster for hair
sphere(0, 24, -2, 9, LEAVES);
sphere(-5, 21, -4, 7, LEAVES);
sphere(5, 21, -4, 7, LEAVES);
sphere(-2, 19, -8, 5, LEAVES);
sphere(2, 20, -8, 5, LEAVES);
sphere(0, 22, -8, 4, LEAVES);

// Chest foliage for organic layering
sphere(-1, 11, -8, 3, LEAVES);
sphere(1, 10, -8, 3, LEAVES);

// Aged bark cracks and texture
cube(-5, 9, -7, -4, 11, -7, COBBLE);
cube(4, 10, -7, 5, 12, -7, COBBLE);
cube(-6, 15, 3, -5, 17, 4, COBBLE);
cube(5, 14, 3, 6, 16, 4, COBBLE);

// Moss/growth on legs
cube(-5, 3, -5, -4, 5, -4, LEAVES);
cube(4, 4, -5, 5, 6, -4, LEAVES);