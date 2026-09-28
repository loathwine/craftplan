// lava-golem-haiku — prompt:
// a lava golem...

// Lava Golem

// Foundation - obsidian base
cube(-7, -1, -4, 7, 0, 4, OBSIDIAN);
cube(-9, -2, -5, 9, -1, 6, STONE);

// Heat shimmer ground
disk(0, 0, 0, 11, ORANGE);

// Left leg - muscular
cylinder(-3, 3, 0, 2.8, 8, LAVA);
cube(-5, 1, -2, -1, 5, 2, ORANGE);
cube(-5, 4, -1, -4, 7, 1, GLOWSTONE);

// Right leg - muscular
cylinder(3, 3, 0, 2.8, 8, LAVA);
cube(1, 1, -2, 5, 5, 2, ORANGE);
cube(4, 4, -1, 5, 7, 1, GLOWSTONE);

// Feet
cube(-6, -1, -5, -1, 1, -1, OBSIDIAN);
cube(-5, -1, -4, -1, 0, 0, STONE);
cube(1, -1, -5, 6, 1, -1, OBSIDIAN);
cube(1, -1, -4, 5, 0, 0, STONE);

// Lower torso
cube(-6, 8, -4, 6, 13, 4, LAVA);
cube(-7, 9, -3, 7, 12, 3, ORANGE);

// Mid torso - tapered
cube(-5, 13, -3, 5, 17, 3, LAVA);
cube(-4, 14, -2, 4, 16, 2, GLOWSTONE);

// Upper torso / chest
cube(-5, 17, -3, 5, 20, 3, ORANGE);
cube(-5, 18, -4, 5, 19, 4, LAVA);

// Left shoulder
cube(-7, 15, -2, -5, 18, 2, LAVA);

// Left arm - thick
cylinder(-10, 14, 0, 2.8, 5, ORANGE);
cube(-13, 12, -2, -8, 16, 2, LAVA);
cube(-14, 11, -1, -12, 14, 1, STONE);

// Right shoulder
cube(5, 15, -2, 7, 18, 2, LAVA);

// Right arm - thick
cylinder(10, 14, 0, 2.8, 5, ORANGE);
cube(8, 12, -2, 13, 16, 2, LAVA);
cube(12, 11, -1, 14, 14, 1, STONE);

// Neck
cube(-3, 19, -2, 3, 21, 2, LAVA);

// Head - main mass
cube(-5, 21, -4, 5, 28, 4, LAVA);
cube(-4, 22, -3, 4, 27, 3, ORANGE);

// Head - glowing interior
cube(-3, 23, -3, 3, 26, 2, GLOWSTONE);

// Eyes - intense glow facing north
sphere(-2, 24, -4, 1.3, NEON_RED);
sphere(2, 24, -4, 1.3, NEON_RED);
block(-2, 24, -5, GLOWSTONE);
block(2, 24, -5, GLOWSTONE);

// Cracks and glows on face
line(-3, 22, -4, 3, 22, -4, GLOWSTONE);
line(-2, 25, -4, 2, 25, -4, GLOWSTONE);
line(-1, 23, -5, 1, 23, -5, NEON_RED);

// Mouth glow
cube(-2, 20, -5, 2, 21, -4, GLOWSTONE);

// Lava drips cascading down
block(-4, 18, 5, LAVA);
block(-2, 17, 5, LAVA);
block(0, 16, 5, LAVA);
block(2, 17, 5, LAVA);
block(4, 18, 5, LAVA);
block(-3, 14, 5, LAVA);
block(0, 13, 5, LAVA);
block(3, 14, 5, LAVA);
block(-2, 11, 5, LAVA);
block(2, 11, 5, LAVA);

// Fire effects - dramatic intensity
block(-8, 18, 4, FIRE);
block(8, 18, 4, FIRE);
block(-6, 20, 5, FIRE);
block(6, 20, 5, FIRE);
block(0, 28, 3, FIRE);
block(-4, 27, 5, FIRE);
block(4, 27, 5, FIRE);

// Arm details - cracks
block(-10, 15, 1, GLOWSTONE);
block(10, 15, 1, GLOWSTONE);
block(-11, 13, 1, GLOWSTONE);
block(11, 13, 1, GLOWSTONE);

// Fist definition
cube(-14, 11, -1, -12, 13, 1, STONE);
cube(12, 11, -1, 14, 13, 1, STONE);

// Lava pools at base
cube(-10, 0, 2, -6, 1, 5, LAVA);
cube(6, 0, 2, 10, 1, 5, LAVA);
cube(-3, 0, 5, 3, 1, 6, LAVA);

// Scattered embers/rocks
block(-7, 1, 6, ORANGE);
block(-9, 2, 4, ORANGE);
block(7, 1, 6, ORANGE);
block(9, 2, 4, ORANGE);
block(0, 2, 7, STONE);