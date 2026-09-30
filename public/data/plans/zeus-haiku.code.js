// zeus-haiku — prompt:
// Zeus throwing a lightning bolt...

// ZEUS THROWING LIGHTNING BOLT

// Platform base
cube(-7, -3, -7, 7, -2, 8, STONE);
cube(-6, -2, -6, 6, -1, 7, MARBLE);

// LEFT LEG - planted back
cube(-2, -1, -8, 0, 6, -6, GOLD);
cube(-2.5, 4, -10, -0.5, 8, -8, GOLD);
cube(-2, 5, -9, -0.5, 7, -8, YELLOW);

// RIGHT LEG - forward lunge
cube(1, -1, 3, 3, 6, 5, GOLD);
cube(1.5, 4, 5, 3.5, 8, 7, GOLD);
cube(1.5, 5, 4, 3.5, 7, 6, YELLOW);

// TORSO - arching back
cube(-2, 6, -2, 2, 12, 1.5, GOLD);
cube(-1.5, 8, -1, 1.5, 10, 0.5, YELLOW);
cube(-1, 10, -0.5, 1, 11, 0.2, YELLOW);

// ROBES - flowing purple toga
cube(-5, 5, -1, 5, 10, 3, PURPLE);
cube(-6, 4, 0, -2, 9, 3, BLUE);
cube(2, 4, 0, 6, 9, 3, BLUE);
cube(-5, 9.5, 2.5, 5, 10.5, 3, GOLD);

// LEFT ARM - throwing arm extended back-up
cube(-3.5, 9, -7, -0.5, 12, -5, GOLD);
cube(-4.5, 10, -9, -2, 13, -11, GOLD);
cube(-5, 11.5, -10.5, -1.5, 13, -12, YELLOW);

// RIGHT ARM - balance arm
cube(2, 6, -0.5, 4, 10, 1.5, GOLD);
cube(4, 7, 0, 5, 9, 1, YELLOW);

// HEAD - classical
cube(-2, 11, -2.5, 2, 15.5, 1.5, GOLD);
cube(-2.5, 11.5, -3, 2.5, 15, 0.5, GOLD);

// BEARD - long flowing
cube(-3, 10.5, -1.5, 3, 13, 1, GRAY);
cube(-3.5, 9.5, -0.5, 3.5, 11.5, 1.5, GRAY);

// HAIR
cube(-3.5, 12.5, -3, 3.5, 15, 1, GRAY);

// CROWN - glowing halo
disk(0, 15.5, 0, 4, GLOWSTONE);
cube(-2, 15, -2, 2, 16, 1, GLOWSTONE);

// EYES - piercing gaze
block(-0.7, 13, -2.5, NEON_BLUE);
block(0.7, 13, -2.5, NEON_BLUE);

// LIGHTNING BOLT - shaped structure
// Main bolt trunk from hand upward-backward
cube(-3.5, 11, -10, -3, 13, -9.5, NEON_BLUE);
cube(-3, 13, -9, -2.5, 16, -8.5, NEON_BLUE);
cube(-2.5, 16, -8.5, -2, 20, -8, NEON_BLUE);
cube(-2, 20, -8, -1.5, 24, -7.5, NEON_BLUE);
cube(-1.5, 24, -7.5, -1, 28, -7, NEON_BLUE);
cube(-1, 28, -7, -0.5, 32, -6.5, NEON_BLUE);
cube(-0.5, 32, -6.5, 0, 36, -6, NEON_BLUE);

// Right branch
cube(-2, 16, -9, -0.5, 19, -8, NEON_BLUE);
cube(-0.5, 19, -8.5, 1, 23, -7.5, NEON_BLUE);
cube(1, 23, -8, 2.5, 27, -7, NEON_BLUE);
cube(2.5, 27, -7.5, 3.5, 31, -6, NEON_BLUE);

// Left branch
cube(-3.5, 19, -8.5, -2.5, 22, -7.5, NEON_BLUE);
cube(-4, 22, -8.5, -2.5, 26, -7, NEON_BLUE);
cube(-4.5, 26, -8, -3, 30, -6.5, NEON_BLUE);

// ELECTRIC crackling - sparse
block(-2.5, 15, -8.5, ELECTRIC);
block(-1, 27, -7, ELECTRIC);
block(2, 25, -7.5, ELECTRIC);
block(-3.5, 28, -7.5, ELECTRIC);

// Glow auras around bolt
sphere(-1.5, 20, -8, 2, NEON_BLUE);
sphere(1, 27, -7, 2, NEON_BLUE);
sphere(-3, 26, -7.5, 2, NEON_BLUE);

// Ground impact zone
cube(-1, -1, -38, 1, 0, -36, NEON_BLUE);
block(0, 0, -36, ELECTRIC);
sphere(0, 0.5, -36, 2, NEON_BLUE);

// Impact sparks
cube(-2, -0.5, -37, 2, 1, -35, NEON_BLUE);