// spider-man-4x-haiku — prompt:
// Spider-Man...

const RED = 10;    // BRICK - red suit
const BLUE = 11;   // GLASS - eye lenses, accents
const WHITE = 12;  // SNOW - eyes, spider symbol
const GRAY = 3;    // STONE - web pattern, details

// LEGS (crouched action pose)
cube(-3, -12, -2, -1, -7, 2, RED);   // Left thigh
cube(-3, -16, -2, -1, -12, 2, RED);  // Left calf
cube(-3, -17, -1, -1, -16, 1, RED);  // Left foot

cube(1, -12, -2, 3, -7, 2, RED);     // Right thigh
cube(1, -16, -2, 3, -12, 2, RED);    // Right calf
cube(1, -17, -1, 3, -16, 1, RED);    // Right foot

// LEG DETAIL - muscle definition
cube(-3, -10, -3, -1, -7, -2, GRAY);
cube(1, -10, -3, 3, -7, -2, GRAY);

// MAIN TORSO
cube(-3, -5, -3, 3, 8, 3, RED);

// CHEST PANEL - spider symbol area
cube(-2, 1, -4, 2, 7, -3, WHITE);

// SPIDER SYMBOL - detailed
block(0, 4, -4, GRAY);
block(0, 3, -4, GRAY);
block(0, 5, -4, GRAY);
line(-1, 3, -4, -3, 1, -4, GRAY);
line(1, 3, -4, 3, 1, -4, GRAY);
line(-1, 5, -4, -3, 7, -4, GRAY);
line(1, 5, -4, 3, 7, -4, GRAY);

// SUIT WEB PATTERN - vertical lines
line(-3, -4, -4, -3, 8, -4, GRAY);
line(-1, -4, -4, -1, 8, -4, GRAY);
line(1, -4, -4, 1, 8, -4, GRAY);
line(3, -4, -4, 3, 8, -4, GRAY);

// SUIT WEB PATTERN - horizontal lines
for (let y = -3; y <= 8; y += 2) {
  line(-3, y, -4, 3, y, -4, GRAY);
}

// MUSCLE DEFINITION - sides
cube(-4, -2, -2, -3, 7, 1, GRAY);
cube(3, -2, -2, 4, 7, 1, GRAY);

// NECK
cube(-2, 8, -2, 2, 9, 2, RED);

// HEAD
cube(-3, 9, -3, 3, 14, 3, RED);

// MASK FRONT - white eye area
cube(-2, 10, -4, 2, 13, -3, WHITE);

// EYES - blue lenses
cube(-2, 10, -4, -1, 12, -3, BLUE);
cube(1, 10, -4, 2, 12, -3, BLUE);

// EYE DETAIL - web pattern
line(-3, 10, -4, 3, 10, -4, GRAY);
line(-3, 13, -4, 3, 13, -4, GRAY);
line(-3, 9, -4, -3, 14, -4, GRAY);
line(3, 9, -4, 3, 14, -4, GRAY);

// LEFT ARM (reaching forward-down)
cube(-5, 2, -4, -4, 8, 1, RED);    // Shoulder/bicep
cube(-6, -1, -5, -5, 7, 2, RED);   // Forearm
cube(-7, -3, -6, -6, 4, 3, RED);   // Hand

// Left arm web detail
line(-5, 2, -5, -7, 2, -6, GRAY);
line(-5, 4, -5, -7, 4, -6, GRAY);
line(-5, 6, -5, -7, 6, -6, GRAY);

// RIGHT ARM (reaching up-back)
cube(4, 2, -4, 5, 8, 1, RED);      // Shoulder/bicep
cube(5, -1, -5, 6, 7, 2, RED);     // Forearm
cube(6, -3, -6, 7, 4, 3, RED);     // Hand

// Right arm web detail
line(4, 2, -5, 6, 2, -6, GRAY);
line(4, 4, -5, 6, 4, -6, GRAY);
line(4, 6, -5, 6, 6, -6, GRAY);

// TORSO SIDE PANELS
cube(-3, -3, 4, 3, 8, 4, RED);

// BACK WEB
line(-3, 0, 4, -3, 8, 4, GRAY);
line(-1, 0, 4, -1, 8, 4, GRAY);
line(1, 0, 4, 1, 8, 4, GRAY);
line(3, 0, 4, 3, 8, 4, GRAY);

// SHOULDER/ARM CONNECTION
cube(-3, 7, -3, 3, 9, 2, RED);

// HAND DETAIL
cube(-8, -2, -6, -6, 2, 2, GRAY);
cube(6, -2, -6, 8, 2, 2, GRAY);

// BICEP DETAIL
cube(-5, 4, -4, -4, 7, 0, GRAY);
cube(4, 4, -4, 5, 7, 0, GRAY);

// ABDOMINAL DETAIL
cube(-1, -1, -4, 1, 3, -3, GRAY);

// LOWER TORSO DETAIL
cube(-2, -4, -4, 2, -2, -3, GRAY);