// thor-haiku-fb2 — feedback pass 2
cube(-8, -2, -3, 8, -1, 5, STONE);
disk(0, -1, 0, 10, BLACK);
disk(0, 0, 0, 8, COBBLE);

// Legs
cube(-1, 0, -1, 1, 3, 1, IRON);
cube(-2, 0, 0, 2, 2, 2, IRON);

// Torso and body
cube(-3, 3, -1, 3, 9, 2, IRON);
cube(-4, 4, 0, 4, 8, 1, IRON);

// Left arm raised
cube(-4, 7, -2, -3, 12, 0, IRON);
cube(-5, 9, -3, -2, 13, -1, IRON);
cube(-6, 11, -4, -1, 14, 0, IRON);

// Right arm raised
cube(3, 7, -2, 4, 12, 0, IRON);
cube(2, 9, -3, 5, 13, -1, IRON);
cube(1, 11, -4, 6, 14, 0, IRON);

// Head
cube(-2, 9, -2, 2, 12, 1, GOLD);
cube(-3, 10, -1, 3, 11, 0, GOLD);

// Left hand with hammer handle
cube(-7, 12, -5, -5, 15, 1, IRON);
cube(-8, 13, -6, -4, 16, 2, IRON);

// Right hand with hammer handle
cube(5, 12, -5, 7, 15, 1, IRON);
cube(4, 13, -6, 8, 16, 2, IRON);

// Mjolnir head (hammer) - positioned above and between hands
cube(-8, 14, -4, -4, 17, 2, GOLD);
cube(-7, 15, -3, -5, 18, 1, GOLD);
cube(4, 14, -4, 8, 17, 2, GOLD);
cube(5, 15, -3, 7, 18, 1, GOLD);
cube(-4, 16, -3, 4, 18, 1, GOLD);

// Lightning radiating from hands and hammer
line(-7, 14, -5, -10, 22, -8, ELECTRIC);
line(-7, 14, -5, -12, 25, -3, ELECTRIC);
line(-7, 14, -5, -8, 26, -9, ELECTRIC);

line(7, 14, -5, 10, 22, -8, ELECTRIC);
line(7, 14, -5, 12, 25, -3, ELECTRIC);
line(7, 14, -5, 8, 26, -9, ELECTRIC);

line(0, 16, -2, -3, 24, -6, ELECTRIC);
line(0, 16, -2, 3, 24, -6, ELECTRIC);
line(0, 16, -2, 0, 28, -10, ELECTRIC);
line(0, 16, -2, -5, 27, 2, ELECTRIC);
line(0, 16, -2, 5, 27, 2, ELECTRIC);

// Lightning around body
line(0, 8, 0, -2, 14, -4, ELECTRIC);
line(0, 8, 0, 2, 14, -4, ELECTRIC);
line(0, 8, 0, -4, 11, -3, ELECTRIC);
line(0, 8, 0, 4, 11, -3, ELECTRIC);

// Terminal lightning bolts
block(-12, 27, -6, ELECTRIC);
block(-9, 28, -10, ELECTRIC);
block(12, 27, -6, ELECTRIC);
block(9, 28, -10, ELECTRIC);
block(0, 30, -11, ELECTRIC);
block(-5, 29, 3, ELECTRIC);
block(5, 29, 3, ELECTRIC);

// Glow around hammer
cube(-3, 16, -2, 3, 17, 1, GLOWSTONE);
cube(-8, 15, -4, 8, 16, 2, GLOWSTONE);

// Aura of power around Thor
cube(-5, 6, -3, 5, 13, 3, AIR);