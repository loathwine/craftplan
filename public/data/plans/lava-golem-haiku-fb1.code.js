// lava-golem-haiku-fb1 — feedback pass 1
// FOUNDATION & FEET (wide base)
cube(-9, -1, -3, 9, 0, 4, STONE);
cube(-8, 0, -2, 8, 1, 3, OBSIDIAN);
line(-8, 1, 0, 8, 1, 0, LAVA);

// LEGS (sturdy, wide stance)
cube(-7, 1, -1, -3, 4, 4, OBSIDIAN);
cube(3, 1, -1, 7, 4, 4, OBSIDIAN);
cube(-2, 2, 0, 2, 4, 2, OBSIDIAN);
line(-7, 3, 1, 7, 3, 1, LAVA);

// LOWER TORSO
cube(-7, 4, -2, 7, 7, 4, OBSIDIAN);
cube(-6, 5, -1, 6, 6, 3, GLOWSTONE);

// MID TORSO
cube(-8, 7, -3, 8, 10, 5, OBSIDIAN);
line(-8, 8, -3, 8, 8, -3, LAVA);

// LEFT ARM (reaching out)
cube(-11, 8, -1, -8, 10, 3, STONE);
cube(-13, 9, -2, -11, 14, 4, OBSIDIAN);
cube(-14, 13, -1, -12, 15, 3, LAVA);
line(-12, 11, 1, -10, 11, 1, GLOWSTONE);

// RIGHT ARM (reaching out)
cube(8, 8, -1, 11, 10, 3, STONE);
cube(11, 9, -2, 13, 14, 4, OBSIDIAN);
cube(12, 13, -1, 14, 15, 3, LAVA);
line(10, 11, 1, 12, 11, 1, GLOWSTONE);

// UPPER TORSO / CHEST (lava glow)
cube(-7, 10, -2, 7, 13, 4, OBSIDIAN);
cube(-6, 11, -1, 6, 12, 3, LAVA);
line(-7, 13, -2, 7, 13, -2, GLOWSTONE);

// NECK
cube(-4, 13, -1, 4, 15, 3, OBSIDIAN);

// HEAD (solid, imposing)
cube(-6, 15, -2, 6, 17, 4, OBSIDIAN);
cube(-7, 17, -3, 7, 20, 5, OBSIDIAN);
cube(-6, 20, -2, 6, 22, 4, LAVA);

// LARGE GLOWING EYES (front-facing, toward camera)
sphere(-3, 18, -4, 1.5, NEON_RED);
sphere(3, 18, -4, 1.5, NEON_RED);
block(-3, 18, -5, GLOWSTONE);
block(3, 18, -5, GLOWSTONE);
block(-4, 17, -4, GLOWSTONE);
block(4, 17, -4, GLOWSTONE);

// MOUTH (lava visible inside, facing north)
cube(-2, 16, -4, 2, 17, -2, LAVA);
block(-2, 15, -4, GLOWSTONE);
block(2, 15, -4, GLOWSTONE);
block(-1, 16, -5, GLOWSTONE);
block(1, 16, -5, GLOWSTONE);

// FIRE emerging from cracks
block(-9, 10, 4, FIRE);
block(9, 10, 4, FIRE);
block(-8, 17, -3, FIRE);
block(8, 17, -3, FIRE);
block(-12, 14, 3, FIRE);
block(12, 14, 3, FIRE);
block(0, 23, 4, FIRE);
block(-5, 22, -2, FIRE);
block(5, 22, -2, FIRE);

// Additional lava seams for internal glow effect
block(-8, 9, -3, LAVA);
block(8, 9, -3, LAVA);
block(-7, 15, -2, LAVA);
block(7, 15, -2, LAVA);
block(-6, 19, -2, LAVA);
block(6, 19, -2, LAVA);

// Ridge details
line(-5, 20, -2, 5, 20, -2, GLOWSTONE);