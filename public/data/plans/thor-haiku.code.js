// thor-haiku — prompt:
// Thor summoning lightning...

// Thor Summoning Lightning

// === BASE PLATFORM ===
cube(-7, -2, -6, 7, -1, 8, STONE);
cube(-6, -1, -5, 6, 0, 7, COBBLE);
cube(-5, 0, -4, 5, 1, 6, STONE);
disk(0, 0, 0, 7, BLACK);
disk(0, 1, 0, 5, COBBLE);

// === LEGS ===
// Left leg
cube(-3, 1, 0, -1, 7, 2, IRON);
cube(-4, 2, -1, -2, 6, 0, IRON);
cube(-3, 4, 1, -1, 6, 3, IRON);
// Right leg
cube(1, 1, 0, 3, 7, 2, IRON);
cube(2, 2, -1, 4, 6, 0, IRON);
cube(1, 4, 1, 3, 6, 3, IRON);
// Hips
cube(-3, 6, -1, 3, 8, 2, IRON);

// === TORSO - MUSCULAR ===
// Main chest
cube(-5, 8, -1, 5, 13, 2, IRON);
cube(-6, 9, 0, 6, 12, 3, IRON);
// Muscle definition
cube(-4, 10, 1, 4, 12, 3, IRON);
// Back
cube(-5, 10, 3, 5, 12, 4, IRON);
// Armor plating
cube(-6, 11, 1, 6, 13, 2, IRON);

// === ARMS - RAISED POWERFULLY ===
// Left arm
cube(-7, 10, -2, -5, 15, 1, IRON);
cube(-8, 13, -1, -7, 15, 0, IRON);
cube(-9, 14, 0, -8, 15, 1, IRON);
// Forearm detail
cube(-8, 12, 1, -7, 14, 2, IRON);
// Right arm
cube(5, 10, -2, 7, 15, 1, IRON);
cube(7, 13, -1, 8, 15, 0, IRON);
cube(8, 14, 0, 9, 15, 1, IRON);
// Forearm detail
cube(7, 12, 1, 8, 14, 2, IRON);

// === SHOULDERS & NECK ===
cube(-6, 13, 0, 6, 15, 2, IRON);
cube(-3, 14, -1, 3, 15, 1, IRON);
cube(-2, 14, 0, 2, 15, 1, IRON);

// === HEAD ===
cube(-4, 15, -1, 4, 18, 1, IRON);
// Helmet
cube(-5, 16, 0, 5, 19, 2, IRON);
cube(-5, 17, -2, 5, 20, 0, IRON);
// Face
cube(-3, 16, 0, 3, 18, 1, IRON);

// === EYES - GLOWING ===
block(-1, 17, 0, NEON_BLUE);
block(1, 17, 0, NEON_BLUE);
block(-1, 17, 1, GLOWSTONE);
block(1, 17, 1, GLOWSTONE);

// === CAPE - FLOWING ===
cube(-7, 10, 2, 7, 15, 6, RED);
cube(-8, 11, 3, 8, 14, 7, RED);
cube(-6, 12, 4, 6, 13, 8, RED);
cube(-7, 13, 5, 7, 14, 6, ORANGE);

// === MJOLNIR HAMMER ===
// Handle
cube(-1, 15, -6, 1, 21, -5, IRON);
cube(-1, 20, -7, 1, 22, -4, IRON);
// Hammer head
cube(-5, 21, -8, 5, 24, -2, GOLD);
cube(-6, 20, -7, 6, 25, -3, GOLD);
cube(-4, 22, -9, 4, 26, -1, GOLD);
cube(-7, 21, -5, 7, 23, -3, GOLD);

// === LIGHTNING BOLTS ===
line(-7, 26, -6, -11, 15, -10, ELECTRIC);
line(7, 26, -6, 11, 15, -10, ELECTRIC);
line(-4, 27, -5, -6, 17, -7, ELECTRIC);
line(4, 27, -5, 6, 17, -7, ELECTRIC);
line(0, 28, -4, 0, 21, -6, ELECTRIC);
line(-3, 27, -3, -5, 16, -5, ELECTRIC);
line(3, 27, -3, 5, 16, -5, ELECTRIC);
line(-2, 27, -1, -2, 18, -3, ELECTRIC);
line(2, 27, -1, 2, 18, -3, ELECTRIC);

// === GROUND STRIKES ===
block(-5, 1, 0, ELECTRIC);
block(5, 1, 0, ELECTRIC);
block(-3, 1, -2, ELECTRIC);
block(3, 1, -2, ELECTRIC);
block(0, 1, 3, ELECTRIC);
block(-2, 1, 2, ELECTRIC);
block(2, 1, 2, ELECTRIC);
block(-4, 1, 1, ELECTRIC);
block(4, 1, 1, ELECTRIC);

// === ARMOR DETAILS ===
cube(-9, 13, -2, -8, 15, 1, IRON);
cube(8, 13, -2, 9, 15, 1, IRON);
cube(-4, 7, 2, -1, 9, 3, IRON);
cube(1, 7, 2, 4, 9, 3, IRON);
cube(-4, 1, 3, -1, 3, 4, IRON);
cube(1, 1, 3, 4, 3, 4, IRON);
cube(-7, 8, 0, 7, 9, 2, GOLD);
cube(-8, 14, 0, -7, 16, 2, IRON);
cube(7, 14, 0, 8, 16, 2, IRON);

// === AURA & MAGIC ===
block(-9, 17, 0, ELECTRIC);
block(9, 17, 0, ELECTRIC);
block(-6, 19, 1, ELECTRIC);
block(6, 19, 1, ELECTRIC);
block(-5, 20, -5, ELECTRIC);
block(5, 20, -5, ELECTRIC);
disk(0, 2, 0, 3, NEON_BLUE);

// === ADDITIONAL CAPE LAYERS ===
cube(-8, 14, 6, 8, 15, 7, RED);
cube(-6, 13, 7, 6, 14, 8, ORANGE);

// === SCORCHED GROUND DETAIL ===
cube(-6, 1, -1, 6, 1, 4, BLACK);
cube(-5, 1, -2, 5, 1, 5, COBBLE);