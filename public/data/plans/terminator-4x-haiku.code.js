// terminator-4x-haiku — prompt:
// the Terminator...

// The Terminator T-800
// Iconic cyborg assassin in voxel form
// Metallic construction (STONE/COBBLE) with glowing red optical sensors (BRICK/GLASS)

// ===== FOUNDATION & STANCE =====
cube(-5, -2, -3, 5, -1, 3, STONE);

// Left foot
cube(-6, -1, -2, -3, 0, 2, COBBLE);
cube(-5, 0, -2, -3, 1, 1, STONE);
cube(-6, 0, 1, -3, 1, 2, COBBLE);

// Right foot
cube(3, -1, -2, 6, 0, 2, COBBLE);
cube(3, 0, -2, 5, 1, 1, STONE);
cube(3, 0, 1, 6, 1, 2, COBBLE);

// ===== LOWER BODY: LEGS =====
// Left leg structure
cube(-3, 1, -1, -1, 9, 1, STONE);
cube(-4, 1, 0, -1, 8, 0, COBBLE);
cube(-3, 1, -2, -1, 7, -2, COBBLE);
cube(-4, 3, -1, -3, 6, 0, COBBLE);
cube(-3, 5, -2, -2, 8, -1, COBBLE);

// Left leg armor
cube(-4, 6, -3, -1, 8, -2, COBBLE);
cube(-5, 2, -1, -4, 5, 0, COBBLE);

// Right leg structure
cube(1, 1, -1, 3, 9, 1, STONE);
cube(1, 1, 0, 4, 8, 0, COBBLE);
cube(1, 1, -2, 3, 7, -2, COBBLE);
cube(3, 3, -1, 4, 6, 0, COBBLE);
cube(2, 5, -2, 3, 8, -1, COBBLE);

// Right leg armor
cube(1, 6, -3, 4, 8, -2, COBBLE);
cube(4, 2, -1, 5, 5, 0, COBBLE);

// ===== MIDDLE BODY: TORSO =====
// Main body core
cube(-4, 9, -2, 4, 15, 2, STONE);

// Front torso detail
cube(-3, 10, -3, 3, 14, -2, COBBLE);

// Chest armor plating
cube(-4, 12, -2, 4, 15, -2, COBBLE);

// Chest muscle definition
cube(-2, 11, 2, 2, 13, 2, COBBLE);
cube(-3, 13, 2, 3, 14, 2, COBBLE);

// Side panels
cube(-5, 10, -1, -4, 13, 1, COBBLE);
cube(4, 10, -1, 5, 13, 1, COBBLE);

// Reinforced midsection
cube(-3, 11, -3, 3, 12, -2, COBBLE);

// Back armor ridge
cube(-4, 11, -3, 4, 14, -2, COBBLE);

// Center spine detail
line(0, 9, -3, 0, 15, -3, COBBLE);

// ===== UPPER BODY: ARMS =====
// Left shoulder joint
cube(-5, 13, -1, -4, 16, 1, STONE);
cube(-6, 12, -1, -4, 15, 1, COBBLE);

// Left arm
cube(-8, 12, -1, -6, 15, 1, STONE);
cube(-9, 13, -1, -7, 14, 1, COBBLE);
cube(-8, 11, -2, -6, 14, 0, COBBLE);
cube(-8, 10, -2, -6, 12, -1, COBBLE);

// Left hand/claw
cube(-10, 12, -1, -9, 14, 1, STONE);
cube(-11, 13, -1, -10, 14, 0, COBBLE);

// Right shoulder joint
cube(4, 13, -1, 5, 16, 1, STONE);
cube(4, 12, -1, 6, 15, 1, COBBLE);

// Right arm
cube(6, 12, -1, 8, 15, 1, STONE);
cube(7, 13, -1, 9, 14, 1, COBBLE);
cube(6, 11, -2, 8, 14, 0, COBBLE);
cube(6, 10, -2, 8, 12, -1, COBBLE);

// Right hand/claw
cube(9, 12, -1, 10, 14, 1, STONE);
cube(10, 13, -1, 11, 14, 0, COBBLE);

// Shoulder armor plates
cube(-6, 14, -2, -4, 16, -1, COBBLE);
cube(4, 14, -2, 6, 16, -1, COBBLE);

// ===== HEAD & FACE =====
// Neck
cube(-2, 15, -1, 2, 17, 1, STONE);
cube(-1, 15, -2, 1, 16, 0, COBBLE);

// Main head
cube(-4, 17, -2, 4, 22, 2, STONE);

// Head front plate
cube(-3, 17, -3, 3, 21, -2, COBBLE);

// Head sides
cube(-5, 18, -1, -4, 21, 1, COBBLE);
cube(4, 18, -1, 5, 21, 1, COBBLE);

// Top of head
cube(-3, 21, -1, 3, 22, 1, STONE);
cube(-4, 21, 0, 4, 23, 0, COBBLE);

// Skull crest
cube(-2, 22, -1, 2, 23, 1, COBBLE);

// ===== ICONIC RED EYES - T-800 SIGNATURE =====
// Left optical sensor (glowing red)
cube(-2, 18, 2, -1, 20, 3, BRICK);
block(-1, 18, 2, GLASS);
block(-1, 19, 2, GLASS);

// Right optical sensor (glowing red)
cube(1, 18, 2, 2, 20, 3, BRICK);
block(0, 18, 2, GLASS);
block(0, 19, 2, GLASS);

// ===== FACIAL DETAILS =====
// Skeletal mouth cavity
cube(-1, 16, 2, 1, 17, 2, AIR);

// Jaw structure
cube(-2, 15, 1, 2, 16, 2, COBBLE);
cube(-3, 16, 1, 3, 17, 2, COBBLE);

// Nasal cavities
block(0, 17, 2, AIR);
block(0, 20, 2, AIR);

// ===== MECHANICAL DETAILS =====
// Leg-torso junction
cube(-4, 8, -3, 4, 9, -2, COBBLE);

// Chest panel accent
cube(-1, 12, 2, 1, 13, 2, GLASS);

// Arm joint details
cube(-6, 13, -2, -5, 15, 0, COBBLE);
cube(5, 13, -2, 6, 15, 0, COBBLE);