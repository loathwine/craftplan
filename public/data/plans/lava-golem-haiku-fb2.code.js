// lava-golem-haiku-fb2 — feedback pass 2
// Lava Golem - improved with more detail, cracking, and distinct limbs
// Foundation
cube(-12, -1, -4, 12, 0, 5, STONE);

// Left leg
cube(-8, 0, -1, -4, 6, 3, OBSIDIAN);
cube(-7, 1, 0, -5, 5, 2, LAVA);

// Right leg
cube(4, 0, -1, 8, 6, 3, OBSIDIAN);
cube(5, 1, 0, 7, 5, 2, LAVA);

// Lower torso
cube(-10, 6, -3, 10, 10, 4, OBSIDIAN);
cube(-9, 7, -2, 9, 9, 3, LAVA);
line(-10, 8, -3, 10, 8, -3, LAVA);
line(-9, 9, -1, 9, 9, -1, GLOWSTONE);

// Middle torso
cube(-11, 10, -3, 11, 13, 4, OBSIDIAN);
cube(-10, 11, -2, 10, 12, 3, LAVA);
line(-10, 12, -3, 10, 12, -3, LAVA);

// Upper torso with chest detail
cube(-9, 13, -2, 9, 15, 3, OBSIDIAN);
cube(-8, 14, -1, 8, 14, 2, LAVA);

// Left arm
cube(-12, 9, -1, -9, 12, 3, OBSIDIAN);
cube(-11, 10, 0, -10, 11, 2, LAVA);
cube(-13, 10, 0, -12, 11, 2, OBSIDIAN);
block(-14, 10, 0, OBSIDIAN);
block(-14, 10, 1, OBSIDIAN);

// Right arm
cube(9, 9, -1, 12, 12, 3, OBSIDIAN);
cube(10, 10, 0, 11, 11, 2, LAVA);
cube(12, 10, 0, 13, 11, 2, OBSIDIAN);
block(14, 10, 0, OBSIDIAN);
block(14, 10, 1, OBSIDIAN);

// Neck
cube(-6, 15, -1, 6, 16, 2, OBSIDIAN);

// Head
cube(-8, 16, -3, 8, 20, 4, OBSIDIAN);
cube(-7, 17, -2, 7, 19, 3, LAVA);
line(-7, 18, -3, 7, 18, -3, LAVA);
line(-6, 19, -2, 6, 19, -2, GLOWSTONE);

// Left eye
sphere(-4, 18, -4, 1.5, NEON_RED);
block(-4, 18, -5, GLOWSTONE);
block(-5, 17, -4, GLOWSTONE);

// Right eye
sphere(4, 18, -4, 1.5, NEON_RED);
block(4, 18, -5, GLOWSTONE);
block(5, 17, -4, GLOWSTONE);

// Mouth (lava grin)
cube(-3, 16, -4, 3, 17, -3, LAVA);
block(-2, 15, -4, GLOWSTONE);
block(2, 15, -4, GLOWSTONE);
block(-1, 17, -5, GLOWSTONE);
block(1, 17, -5, GLOWSTONE);

// Cracks and fire vents
block(-9, 11, 4, FIRE);
block(9, 11, 4, FIRE);
block(-7, 15, -2, FIRE);
block(7, 15, -2, FIRE);
block(-8, 7, -3, LAVA);
block(8, 7, -3, LAVA);
block(-10, 13, 4, FIRE);
block(10, 13, 4, FIRE);
block(-6, 20, -2, FIRE);
block(6, 20, -2, FIRE);
block(0, 21, 4, FIRE);

// Additional detail and asymmetry
cube(-7, 8, -3, -5, 10, -2, OBSIDIAN);
cube(5, 8, -3, 7, 10, -2, OBSIDIAN);
line(-6, 9, -4, 6, 9, -4, GLOWSTONE);

// Belly cracks
cube(-3, 11, -3, 3, 13, -2, LAVA);
line(-2, 12, -3, 2, 12, -3, GLOWSTONE);

// Shoulder definition
cube(-11, 12, -2, -9, 14, 2, OBSIDIAN);
cube(9, 12, -2, 11, 14, 2, OBSIDIAN);