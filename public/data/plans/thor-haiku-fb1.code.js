// thor-haiku-fb1 — feedback pass 1
// BASE & FOUNDATION
cube(-8, -2, -3, 8, -1, 5, STONE);
disk(0, -1, 0, 10, BLACK);
disk(0, 0, 0, 8, COBBLE);
cube(-2, 0, -2, 2, 0, 0, COBBLE);

// LEGS
cube(-2, 0, 0, -1, 8, 2, IRON);
cube(1, 0, 0, 2, 8, 2, IRON);
cube(-1, 0, 1, 1, 6, 2, IRON);

// FEET
cube(-3, 0, -1, -2, 1, 1, IRON);
cube(2, 0, -1, 3, 1, 1, IRON);

// TORSO
cube(-4, 8, -2, 4, 14, 2, IRON);

// CHEST PLATE
cube(-3, 10, -3, 3, 13, -1, GOLD);

// ABDOMINAL PLATING
cube(-2, 13, -2, 2, 14, -1, GOLD);

// SHOULDERS
cube(-5, 13, -1, 5, 15, 2, IRON);
cube(-6, 14, 0, -4, 15, 1, IRON);
cube(4, 14, 0, 6, 15, 1, IRON);

// NECK
cube(-1, 15, -1, 1, 15, 1, IRON);

// HEAD
cube(-2, 15, -1, 2, 17, 1, IRON);
cube(-2, 16, -1, 2, 17, 0, IRON);

// HELMET
cube(-3, 17, -2, 3, 19, 0, GOLD);
cube(-2, 18, -1, 2, 19, 0, GOLD);

// LEFT ARM
cube(-6, 12, 0, -4, 15, 2, IRON);
cube(-7, 13, 1, -6, 14, 2, IRON);

// RIGHT ARM
cube(4, 12, -1, 6, 15, 1, IRON);
cube(6, 13, -2, 7, 14, 1, IRON);

// MJOLNIR - HAMMER HEAD
cube(6, 14, -4, 9, 17, 0, GOLD);
cube(5, 14, -3, 10, 17, -1, GOLD);
cube(6, 15, -5, 9, 16, 1, GOLD);

// HAMMER HANDLE
cube(6, 11, -2, 7, 14, -1, IRON);
cube(5, 12, -2, 8, 13, -1, IRON);

// CAPE
cube(-5, 9, 3, 5, 16, 6, RED);
cube(-6, 10, 4, 6, 15, 7, RED);
cube(-4, 12, 7, 4, 15, 8, RED);

// GLOWING AURA
cube(-3, 18, -2, 3, 20, 1, GLOWSTONE);
cube(5, 16, -5, 10, 19, 1, GLOWSTONE);
cube(6, 18, -3, 9, 20, -1, GLOWSTONE);

// MAIN LIGHTNING BOLT
line(7, 17, -2, 7, 28, -2, ELECTRIC);

// LIGHTNING BRANCHES
line(7, 22, -2, 1, 28, -5, ELECTRIC);
line(7, 22, -2, 13, 28, 1, ELECTRIC);
line(7, 19, -3, 0, 25, -7, ELECTRIC);
line(7, 19, -1, 14, 25, 3, ELECTRIC);
line(7, 20, -2, 2, 23, -4, ELECTRIC);
line(7, 20, -2, 12, 23, 2, ELECTRIC);

// GROUND LIGHTNING
line(0, 0, 0, -5, 4, -3, ELECTRIC);
line(0, 0, 0, 5, 4, 3, ELECTRIC);
line(0, 0, 0, 0, 4, -4, ELECTRIC);
line(-1, 1, 0, -4, 3, -2, ELECTRIC);
line(1, 1, 0, 4, 3, 2, ELECTRIC);
block(-2, 1, -1, ELECTRIC);
block(2, 1, 1, ELECTRIC);
block(0, 1, 2, ELECTRIC);
block(-3, 2, -2, ELECTRIC);
block(3, 2, 2, ELECTRIC);

// SKY SPARKS
block(7, 30, -2, ELECTRIC);
block(2, 29, -6, ELECTRIC);
block(12, 29, 2, ELECTRIC);
block(0, 28, -7, ELECTRIC);
block(14, 28, 4, ELECTRIC);
block(1, 27, -5, ELECTRIC);
block(13, 27, 3, ELECTRIC);