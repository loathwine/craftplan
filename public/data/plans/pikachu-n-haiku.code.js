// pikachu-n-haiku — prompt:
// Pikachu...

// Pikachu - Voxel Builder
// Front faces north (-Z) for optimal camera view

// ===== BODY =====
// Main torso - round and bulbous
sphere(0, 4, 0, 2.8, YELLOW);
cube(-2, 1, -2, 2, 8, 2, YELLOW);
cube(-3, 0, -1, 3, 5, 2, YELLOW);

// ===== HEAD =====
sphere(0, 11, -1, 3.3, YELLOW);
cube(-2, 9, -2, 2, 13, 1, YELLOW);

// ===== EARS - Large pointed =====
// Left ear
cube(-2, 14, -2, -1, 20, -1, YELLOW);
cube(-3, 17, -2, -2, 21, -1, YELLOW);
cube(-3, 18, -2, -2, 22, -1, YELLOW);
// Left ear interior - brown
cube(-2, 15, -2, -1, 19, -1, BROWN);
cube(-2, 16, -2, -2, 20, -1, BROWN);

// Right ear
cube(1, 14, -2, 2, 20, -1, YELLOW);
cube(2, 17, -2, 3, 21, -1, YELLOW);
cube(2, 18, -2, 3, 22, -1, YELLOW);
// Right ear interior - brown
cube(1, 15, -2, 2, 19, -1, BROWN);
cube(1, 16, -2, 2, 20, -1, BROWN);

// ===== FACE DETAILS =====
// Large red cheeks
sphere(-3.5, 10, -2, 1.6, RED);
sphere(3.5, 10, -2, 1.6, RED);

// Eyes - big black
sphere(-1, 12, -4, 1.1, BLACK);
sphere(1, 12, -4, 1.1, BLACK);

// Eye shine - white sparkles
cube(-1, 13, -4, -1, 13, -4, WHITE);
cube(-2, 12, -4, -2, 12, -4, WHITE);
cube(-1, 12, -4, -1, 12, -4, WHITE);
cube(1, 13, -4, 1, 13, -4, WHITE);
cube(2, 12, -4, 2, 12, -4, WHITE);
cube(1, 12, -4, 1, 12, -4, WHITE);

// Snout - light cream
cube(-1, 9, -4, 1, 10, -3, LIGHT_GRAY);
cube(-2, 8, -4, 2, 9, -3, LIGHT_GRAY);

// Nose - black
cube(0, 10, -4, 0, 10, -3, BLACK);

// Mouth - smile
line(-1, 7, -3, 1, 7, -3, BLACK);
block(0, 8, -4, BLACK);

// ===== MARKINGS =====
// White belly - front stripe
cube(-1, 2, -2, 1, 7, -2, WHITE);
cube(-2, 3, -3, 2, 6, -3, WHITE);

// Black back lines
line(0, 7, 1, 0, 12, 1, BLACK);
line(-1, 7, 2, -1, 11, 2, BLACK);
line(1, 7, 2, 1, 11, 2, BLACK);

// ===== TAIL - Lightning Bolt =====
// Main diagonal segment
cube(3, 4, -1, 6, 8, 1, YELLOW);
// Middle bend upward
cube(6, 6, 0, 8, 9, 2, YELLOW);
// Lower fork point
cube(7, 0, 1, 10, 4, 3, YELLOW);

// Tail stripes - black zigzag
line(4, 5, 0, 8, 2, 2, BLACK);
line(5, 7, 1, 9, 3, 2, BLACK);

// Tail highlights
cube(6, 8, 1, 7, 9, 2, RED);

// ===== LEGS & FEET =====
// Front left
cube(-2, -1, -1, -1, 3, 0, YELLOW);
cube(-3, 0, -1, -2, 2, 0, YELLOW);
cube(-2, -2, -1, -1, -1, 0, BLACK);
cube(-3, -1, -1, -2, 0, 0, BLACK);

// Front right
cube(1, -1, -1, 2, 3, 0, YELLOW);
cube(2, 0, -1, 3, 2, 0, YELLOW);
cube(1, -2, -1, 2, -1, 0, BLACK);
cube(2, -1, -1, 3, 0, 0, BLACK);

// Back left
cube(-2, -1, 1, -1, 3, 2, YELLOW);
cube(-3, 0, 1, -2, 2, 2, YELLOW);
cube(-2, -2, 1, -1, -1, 2, BLACK);
cube(-3, -1, 1, -2, 0, 2, BLACK);

// Back right
cube(1, -1, 1, 2, 3, 2, YELLOW);
cube(2, 0, 1, 3, 2, 2, YELLOW);
cube(1, -2, 1, 2, -1, 2, BLACK);
cube(2, -1, 1, 3, 0, 2, BLACK);

// ===== ARMS/HANDS =====
// Left arm
cube(-4, 4, -1, -3, 7, 0, YELLOW);
cube(-4, 3, -1, -3, 4, 0, BLACK);

// Right arm
cube(3, 4, -1, 4, 7, 0, YELLOW);
cube(3, 3, -1, 4, 4, 0, BLACK);

// ===== DETAIL LAYERS =====
// Ear accent tips
cube(-2, 20, -2, -1, 21, -1, BLACK);
cube(2, 20, -2, 3, 21, -1, BLACK);

// Chin contour
cube(-1, 7, -3, 1, 8, -2, LIGHT_GRAY);

// More belly definition
cube(0, 4, -4, 0, 5, -3, WHITE);
cube(-1, 5, -3, 1, 6, -2, WHITE);

// Leg joint shadow
cube(-1, 2, 0, -1, 3, 1, ORANGE);
cube(1, 2, 0, 1, 3, 1, ORANGE);
cube(-2, 1, -1, -1, 2, 0, ORANGE);
cube(2, 1, -1, 3, 2, 0, ORANGE);

// Head contour lines
cube(0, 13, 1, 0, 13, 2, BLACK);
cube(0, 12, 2, 0, 12, 3, BLACK);

// Foreground grounding - shadow base
cube(-4, -3, -2, 4, -2, 3, GRAY);