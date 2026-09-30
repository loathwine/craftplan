// bowser-haiku — prompt:
// Bowser...

// BOWSER - Menacing turtle villain from Mario
// Faces north (-Z), photographed from the north

// SHELL - Main body structure
cube(-8, 5, 0, 8, 8, 12, RED);
sphere(0, 8, 6, 7, RED);

// Belly underside
cube(-7, 5, 1, 7, 6, 11, ORANGE);

// Shell detail ridges
cube(-6, 5, 2, -4, 8, 4, BROWN);
cube(4, 5, 6, 6, 8, 8, BROWN);
cube(-2, 5, 3, 2, 8, 5, BROWN);
cube(-4, 7, 8, -2, 8, 10, BROWN);
cube(2, 7, 8, 4, 8, 10, BROWN);

// LEGS - Four sturdy pillars
cylinder(-6, 1, 2, 1.3, 4, BROWN);
cylinder(6, 1, 2, 1.3, 4, BROWN);
cylinder(-6, 1, 9, 1.3, 4, BROWN);
cylinder(6, 1, 9, 1.3, 4, BROWN);

// Feet
cube(-7, 0, 1, -5, 1, 3, BROWN);
cube(5, 0, 1, 7, 1, 3, BROWN);
cube(-7, 0, 8, -5, 1, 10, BROWN);
cube(5, 0, 8, 7, 1, 10, BROWN);

// NECK bridge
cube(-3, 8, -2, 3, 9, 1, RED);

// HEAD
cube(-5, 9, -10, 5, 12, -1, RED);
sphere(0, 11, -5, 5, RED);

// Snout protrusion
cube(-3, 8, -12, 3, 10, -10, RED);

// HORNS - menacing spikes
cube(-5, 12, -4, -3, 15, -2, BLACK);
cube(3, 12, -2, 5, 15, -4, BLACK);

// EYES - red glowing menace
block(-2, 11, -1, NEON_RED);
block(2, 11, -1, NEON_RED);

// Eye sockets
cube(-3, 10, 0, -1, 12, 0, BLACK);
cube(1, 10, 0, 3, 12, 0, BLACK);

// MOUTH - angry expression
cube(-2, 8, -3, 2, 9, -1, BLACK);

// TEETH
block(-1, 7, -2, WHITE);
block(1, 7, -2, WHITE);

// SHELL SPIKES - iconic Bowser feature
cube(-6, 9, 2, -4, 13, 4, BLACK);
cube(-1, 10, 3, 1, 15, 5, BLACK);
cube(4, 9, 5, 6, 13, 7, BLACK);
cube(-5, 9, 7, -3, 12, 9, BLACK);
cube(-3, 10, 9, -1, 13, 11, BLACK);
cube(3, 10, 7, 5, 13, 9, BLACK);
cube(1, 10, 10, 3, 13, 12, BLACK);

// Secondary spike detail
cube(-6, 12, 2, -4, 14, 4, BLACK);
cube(-2, 13, 3, 2, 16, 5, BLACK);
cube(4, 12, 5, 6, 14, 7, BLACK);

// CLAWS - Large iron hands on all four corners
cube(-10, 5, 1, -8, 8, 3, IRON);
cube(-11, 6, 0, -9, 8, 2, IRON);
block(-11, 7, 1, GRAY);
block(-11, 7, 3, GRAY);
block(-12, 6, 1, GRAY);

cube(8, 5, 1, 10, 8, 3, IRON);
cube(9, 6, 0, 11, 8, 2, IRON);
block(11, 7, 1, GRAY);
block(11, 7, 3, GRAY);
block(12, 6, 1, GRAY);

cube(-10, 5, 9, -8, 8, 11, IRON);
cube(-11, 6, 8, -9, 8, 10, IRON);
block(-11, 7, 9, GRAY);
block(-11, 7, 11, GRAY);
block(-12, 6, 10, GRAY);

cube(8, 5, 9, 10, 8, 11, IRON);
cube(9, 6, 8, 11, 8, 10, IRON);
block(11, 7, 9, GRAY);
block(11, 7, 11, GRAY);
block(12, 6, 10, GRAY);

// TAIL
cube(-1, 6, 12, 1, 8, 15, RED);
cube(-1, 8, 14, 1, 9, 16, ORANGE);

// Shell ridge lines
line(-7, 9, 2, -7, 9, 10, BROWN);
line(7, 9, 2, 7, 9, 10, BROWN);
line(0, 10, 2, 0, 10, 10, BROWN);