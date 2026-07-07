// stormtrooper-4x-haiku — prompt:
// a Stormtrooper...

const WHITE = 12;   // SNOW - main armor
const DARK = 8;     // COBBLE - black accents
const VISOR = 11;   // GLASS - helmet visor

// FEET
cube(-2, -1, -1, -1, -1, 0, DARK);
cube(1, -1, -1, 2, -1, 0, DARK);

// LEGS
cube(-2, 0, -1, -1, 3, 0, WHITE);
cube(1, 0, -1, 2, 3, 0, WHITE);

// Leg seams
line(-2, 1, -2, -2, 1, 1, DARK);
line(2, 1, -2, 2, 1, 1, DARK);

// LOWER TORSO / WAIST
cube(-2, 3, -1, 2, 4, 1, WHITE);
line(-2, 3, -1, 2, 3, 1, DARK);

// MAIN TORSO
cube(-2, 4, -1, 2, 7, 1, WHITE);

// Chest armor - center raised
cube(-1, 4, -1, 1, 6, -1, WHITE);
cube(-1, 5, -1, 1, 6, -1, DARK);

// Torso side seams
line(-2, 5, -1, -2, 6, 1, DARK);
line(2, 5, -1, 2, 6, 1, DARK);

// LEFT ARM
cube(-3, 4, -1, -3, 7, 0, WHITE);
cube(-4, 5, -1, -4, 6, 0, DARK);

// RIGHT ARM
cube(3, 4, -1, 3, 7, 0, WHITE);
cube(4, 5, -1, 4, 6, 0, DARK);

// SHOULDERS / PAULDRONS
cube(-3, 6, -1, -2, 8, 1, WHITE);
cube(2, 6, -1, 3, 8, 1, WHITE);
line(-3, 7, 0, -2, 7, 0, DARK);
line(2, 7, 0, 3, 7, 0, DARK);

// NECK
cube(-1, 7, -1, 1, 8, 0, DARK);

// HELMET LOWER
cube(-2, 8, -2, 2, 10, 1, WHITE);

// HELMET DOME
cube(-2, 10, -1, 2, 11, 0, WHITE);
cube(-1, 11, -1, 1, 12, 0, WHITE);

// VISOR FRAME
line(-2, 8, -2, 2, 8, -2, DARK);
line(-2, 9, -2, 2, 9, -2, DARK);

// VISOR OPENING
cube(-1, 8, -2, 1, 9, -2, DARK);
block(0, 8, -2, VISOR);
block(0, 9, -2, VISOR);

// HELMET VENTS
block(-2, 8, -1, DARK);
block(2, 8, -1, DARK);
block(-2, 9, -1, DARK);
block(2, 9, -1, DARK);

// HELMET RIDGE
line(-1, 10, 0, 1, 10, 0, DARK);