// cyber-samurai-haiku — prompt:
// a cyberpunk samurai with a neon katana...

// Cyberpunk Samurai with Neon Katana

// TORSO - Main armored body
cube(-2, 0, -2, 2, 5, 2, BLACK);

// CHEST PLATE - Frontal armor
cube(-3, 2, -3, 3, 5, -3, IRON);

// SHOULDERS - Angular side armor
cube(-4, 3, -1, -2, 6, 1, BLACK);
cube(2, 3, -1, 4, 6, 1, BLACK);

// SHOULDER SPIKES - Tech armor protrusions
cube(-5, 4, -1, -4, 6, 1, GRAY);
cube(4, 4, -1, 5, 6, 1, GRAY);

// NECK
cube(-1, 5, -1, 1, 6, 1, GRAY);

// HEAD - Sleek futuristic helmet
cube(-2, 6, -2, 2, 9, 1, BLACK);

// VISOR - Neon blue tech display
cube(-2, 7, -3, 2, 8, -3, NEON_BLUE);

// HELMET TOP RIDGE
cube(-1, 8, -1, 1, 10, 1, IRON);

// LEFT ARM - Extended, holding katana
cube(-5, 3, -1, -3, 7, 1, BLACK);

// RIGHT ARM - At side
cube(3, 3, -1, 5, 7, 1, BLACK);

// WRIST GUARDS
cube(-6, 5, -1, -5, 7, 1, IRON);
cube(5, 5, -1, 6, 7, 1, IRON);

// LEGS
cube(-2, -6, -1, -1, -1, 1, BLACK);
cube(1, -6, -1, 2, -1, 1, BLACK);

// BOOTS
cube(-3, -7, -2, 3, -6, 2, IRON);

// SHIN GUARDS
cube(-2, -5, -2, -1, -3, -1, GRAY);
cube(1, -5, -2, 2, -3, -1, GRAY);

// WAIST BELT - Cyberpunk accent
cube(-3, 0, -2, 3, 2, 2, PURPLE);
cube(-2, 1, -3, 2, 2, -3, NEON_BLUE);

// BACK PLATING - Depth structure
cube(-3, 2, 2, 3, 5, 3, BLACK);
cube(-2, 3, 4, 2, 4, 4, PURPLE);

// CHEST TECH GLOW - Glowing panel
cube(-2, 4, -4, 2, 5, -4, NEON_BLUE);

// ARM CIRCUIT DETAILS - Neon accents
block(-4, 4, 0, NEON_RED);
block(4, 4, 0, NEON_RED);

// KNEE LIGHTS
block(-1, -4, -1, NEON_BLUE);
block(1, -4, -1, NEON_RED);

// ===== KATANA WEAPON =====
// HILT - Handle in left hand
cube(-7, 6, 0, -6, 8, 1, IRON);
cube(-8, 7, 0, -7, 7, 1, GOLD);

// BLADE CORE - Long angled iron blade extending northward and upward
line(-6, 8, 0, -6, 14, -12, IRON);
line(-5, 8, 0, -5, 14, -12, IRON);

// NEON GLOW EDGES - Bright red cyberpunk energy
line(-7, 8, -1, -7, 14, -13, NEON_RED);
line(-4, 8, -1, -4, 14, -13, NEON_RED);

// BLADE TIP - Glowing point
cube(-6, 13, -13, -5, 15, -12, NEON_RED);

// ENERGY CRACKLE - Electric arcs along blade
block(-6, 11, -6, ELECTRIC);
block(-5, 13, -10, ELECTRIC);

// GROUND BASE PLATFORM - Stance
cube(-4, -8, -3, 4, -8, 3, COBBLE);
cube(-3, -7, -2, 3, -7, 2, COBBLE);