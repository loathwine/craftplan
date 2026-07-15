// venom-4x-haiku — prompt:
// Venom...

// VENOM - Dark alien symbiote creature
// Facing north (-Z) with menacing organic form

const BK = COBBLE;    // black/dark gray body
const DK = STONE;     // darker shading
const WH = SNOW;      // white eyes and teeth
const RD = BRICK;     // red mouth

// ===== LEGS & FEET =====
// Left leg
cube(-5, -7, 3, -1, -6, 4, BK);
cube(-6, -6, 1, -1, -4, 6, BK);
cube(-7, -4, 0, -2, -2, 7, BK);
cube(-8, -2, 0, -2, 0, 8, BK);
cube(-8, 1, 1, -6, 1, 6, BK);

// Right leg  
cube(1, -7, 3, 5, -6, 4, BK);
cube(1, -6, 1, 6, -4, 6, BK);
cube(2, -4, 0, 7, -2, 7, BK);
cube(2, -2, 0, 8, 0, 8, BK);
cube(6, 1, 1, 8, 1, 6, BK);

// ===== MASSIVE TORSO =====
// Lower torso - very wide base
cube(-9, -1, -1, 9, -1, 8, BK);
cube(-10, 0, -2, 10, 0, 8, BK);

// Mid torso
cube(-10, 2, -1, 10, 2, 8, BK);
cube(-9, 3, 0, 9, 3, 7, BK);

// Upper chest
cube(-8, 4, 0, 8, 4, 7, BK);
cube(-7, 5, 1, 7, 5, 6, BK);

// Chest muscle definition
cube(-8, 1, 1, -6, 1, 7, DK);
cube(6, 1, 1, 8, 1, 7, DK);
cube(-7, 3, 1, -4, 3, 7, DK);
cube(4, 3, 1, 7, 3, 7, DK);
cube(-5, 4, 2, 5, 4, 6, DK);

// ===== ARMS - Long and Menacing =====
// Left arm shoulder
cube(-8, 4, 2, -6, 4, 5, BK);
cube(-10, 3, 1, -6, 3, 6, BK);

// Left arm extended
cube(-12, 2, 0, -8, 2, 7, BK);
cube(-13, 1, -1, -9, 1, 8, BK);
cube(-14, 0, -1, -10, 0, 8, BK);
cube(-14, -1, 0, -11, -1, 7, BK);

// Right arm shoulder
cube(6, 4, 2, 8, 4, 5, BK);
cube(6, 3, 1, 10, 3, 6, BK);

// Right arm extended
cube(8, 2, 0, 12, 2, 7, BK);
cube(9, 1, -1, 13, 1, 8, BK);
cube(10, 0, -1, 14, 0, 8, BK);
cube(11, -1, 0, 14, -1, 7, BK);

// ===== NECK =====
cube(-5, 6, 1, 5, 6, 6, BK);
cube(-4, 7, 2, 4, 7, 5, BK);

// ===== HEAD - Distinctive and Threatening =====
// Main head block
cube(-5, 8, -1, 5, 8, 7, BK);
cube(-6, 9, -1, 6, 9, 6, BK);
cube(-7, 10, 0, 7, 10, 5, BK);
cube(-7, 11, 0, 7, 11, 5, BK);
cube(-6, 12, 1, 6, 12, 4, BK);
cube(-4, 13, 2, 4, 13, 3, BK);

// Head shading/detail
cube(-5, 9, 0, -2, 9, 6, DK);
cube(2, 9, 0, 5, 9, 6, DK);
cube(-6, 10, 0, -3, 10, 5, DK);
cube(3, 10, 0, 6, 10, 5, DK);
cube(-4, 11, 1, -2, 11, 4, DK);
cube(2, 11, 1, 4, 11, 4, DK);

// ===== EYES - Large and Menacing =====
// Left eye
cube(-4, 11, -2, -2, 11, -2, WH);
cube(-4, 12, -2, -2, 12, -2, WH);
cube(-5, 11, -2, -1, 11, -2, WH);

// Right eye
cube(2, 11, -2, 4, 11, -2, WH);
cube(2, 12, -2, 4, 12, -2, WH);
cube(1, 11, -2, 5, 11, -2, WH);

// Pupils
cube(-4, 11, -2, -3, 11, -2, RD);
cube(-3, 12, -2, -2, 12, -2, RD);
cube(3, 11, -2, 4, 11, -2, RD);
cube(2, 12, -2, 3, 12, -2, RD);

// ===== MOUTH - Terrifying Grin =====
// Main mouth opening
cube(-7, 8, -2, 7, 8, -1, RD);
cube(-8, 7, -2, 8, 7, 0, RD);

// Upper teeth
cube(-7, 9, -2, 7, 9, -1, WH);
cube(-8, 8, -3, 8, 8, -2, WH);

// Lower jaw
cube(-7, 7, -3, 7, 7, -1, RD);
cube(-8, 6, -2, 8, 6, -1, WH);

// ===== HEAD SPIKES - Organic Protrusions =====
// Back spikes
cube(-8, 11, 2, -6, 11, 4, BK);
cube(6, 11, 2, 8, 11, 4, BK);
cube(-6, 12, 4, -3, 12, 5, BK);
cube(3, 12, 4, 6, 12, 5, BK);

// Side bulges
cube(-8, 9, 3, -6, 9, 5, BK);
cube(6, 9, 3, 8, 9, 5, BK);
cube(-9, 10, 2, -7, 10, 4, BK);
cube(7, 10, 2, 9, 10, 4, BK);

// ===== BODY SPIKES & DETAIL =====
// Back ridge
cube(-3, 3, 7, 3, 3, 9, BK);

// Side protrusions
cube(-10, 2, 4, -9, 2, 6, BK);
cube(9, 2, 4, 10, 2, 6, BK);

// Symbiote tendrils at base
cube(-3, 0, 8, 3, 0, 9, BK);
cube(-5, 1, 7, 5, 1, 9, BK);

// Arm claw detail
cube(-14, 0, 5, -13, 0, 7, DK);
cube(13, 0, 5, 14, 0, 7, DK);

// Additional torso contours
cube(-6, 2, 7, 6, 2, 8, BK);
cube(-4, 4, 6, 4, 4, 7, BK);