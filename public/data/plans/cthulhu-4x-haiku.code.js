// cthulhu-4x-haiku — prompt:
// Cthulhu...

// Cthulhu - The Great Old One

// ===== HEAD STRUCTURE =====
sphere(0, 12, -1, 9, STONE);
sphere(-1, 11, -1, 8, STONE);
sphere(1, 11, -1, 8, STONE);
sphere(0, 10, -2, 7, STONE);
sphere(-2, 12, 0, 7, STONE);
sphere(2, 12, 0, 7, STONE);

// Head crown - cosmic ridges
cube(-5, 18, -2, 5, 22, 3, STONE);
cube(-4, 20, -1, 4, 24, 2, LEAVES);
cube(-2, 21, -2, 2, 25, 3, LEAVES);

// Head detail - spikes/ridges
cube(-6, 15, -3, -4, 17, 2, COBBLE);
cube(4, 15, -3, 6, 17, 2, COBBLE);
cube(-3, 16, 3, 3, 18, 5, COBBLE);

// ===== FACE & EYES =====
cube(-5, 10, -6, 5, 16, -2, STONE);

cube(-4, 12, -7, -2, 15, -5, BRICK);
sphere(-3, 13, -6, 1, GLASS);

cube(2, 12, -7, 4, 15, -5, BRICK);
sphere(3, 13, -6, 1, GLASS);

// Eye stalks
cylinder(-3, 14, -5, 1, 2, COBBLE);
cylinder(3, 14, -5, 1, 2, COBBLE);

// Mouth area - void
cube(-1, 9, -7, 1, 11, -6, COBBLE);
cube(-2, 8, -7, 2, 10, -6, AIR);

// Brow ridges
cube(-5, 15, -6, -2, 16, -4, STONE);
cube(2, 15, -6, 5, 16, -4, STONE);

// ===== MAIN BODY =====
cube(-5, 4, -1, 5, 11, 7, STONE);
cube(-4, 2, 0, 4, 10, 6, COBBLE);
cube(-3, 3, 1, 3, 9, 5, STONE);
cube(-4, -2, 1, 4, 5, 7, COBBLE);
cube(-3, -1, 2, 3, 4, 6, STONE);
cube(-3, 5, 3, 3, 9, 5, LEAVES);
cube(-2, 4, 4, 2, 8, 6, LEAVES);

// ===== PRIMARY TENTACLES =====
// Left-front major
cube(-6, 7, 2, -4, 13, 6, OAK_LOG);
cube(-7, 5, 6, -5, 11, 10, OAK_LOG);
cube(-8, 3, 10, -6, 9, 14, OAK_LOG);
cube(-9, 1, 14, -7, 7, 18, OAK_LOG);
sphere(-8, -1, 18, 2, LEAVES);

// Right-front major
cube(4, 7, 2, 6, 13, 6, OAK_LOG);
cube(5, 5, 6, 7, 11, 10, OAK_LOG);
cube(6, 3, 10, 8, 9, 14, OAK_LOG);
cube(7, 1, 14, 9, 7, 18, OAK_LOG);
sphere(8, -1, 18, 2, LEAVES);

// Left-mid
cube(-8, 6, 0, -6, 12, 4, OAK_LOG);
cube(-10, 4, 3, -8, 10, 8, OAK_LOG);
cube(-12, 2, 7, -10, 8, 11, OAK_LOG);
sphere(-12, 0, 11, 2, LEAVES);

// Right-mid
cube(6, 6, 0, 8, 12, 4, OAK_LOG);
cube(8, 4, 3, 10, 10, 8, OAK_LOG);
cube(10, 2, 7, 12, 8, 11, OAK_LOG);
sphere(12, 0, 11, 2, LEAVES);

// Lower back left
cube(-5, 2, 8, -3, 8, 12, OAK_LOG);
cube(-6, 1, 12, -4, 6, 15, OAK_LOG);

// Lower back right
cube(3, 2, 8, 5, 8, 12, OAK_LOG);
cube(4, 1, 12, 6, 6, 15, OAK_LOG);

// Back tentacles
cube(-7, 5, 10, -5, 10, 14, OAK_LOG);
cube(5, 5, 10, 7, 10, 14, OAK_LOG);

// ===== SIDE APPENDAGES =====
cube(-10, 7, -2, -8, 12, 2, OAK_LOG);
cube(-12, 5, -1, -10, 10, 3, OAK_LOG);

cube(8, 7, -2, 10, 12, 2, OAK_LOG);
cube(10, 5, -1, 12, 10, 3, OAK_LOG);

// ===== ARMS =====
cube(-7, 6, -3, -5, 11, 1, STONE);
cube(-8, 4, -4, -6, 9, 1, COBBLE);
cube(-9, 2, -5, -7, 7, 0, BRICK);

cube(5, 6, -3, 7, 11, 1, STONE);
cube(6, 4, -4, 8, 9, 1, COBBLE);
cube(7, 2, -5, 9, 7, 0, BRICK);

// ===== LEGS =====
cube(-3, -4, 2, -1, 2, 6, COBBLE);
cube(-4, -6, 3, -2, 0, 5, STONE);

cube(1, -4, 2, 3, 2, 6, COBBLE);
cube(2, -6, 3, 4, 0, 5, STONE);

// ===== COSMIC WINGS =====
cube(-9, 8, 3, -7, 13, 7, GLASS);
cube(-10, 6, 4, -8, 11, 8, GLASS);

cube(7, 8, 3, 9, 13, 7, GLASS);
cube(8, 6, 4, 10, 11, 8, GLASS);

// ===== COSMIC DETAIL & TEXTURE =====
// Scales
cube(-4, 14, 1, -2, 16, 3, LEAVES);
cube(2, 14, 1, 4, 16, 3, LEAVES);

// Suction details
cube(-6, 9, 4, -5, 10, 5, GLASS);
cube(-7, 7, 8, -6, 8, 9, GLASS);
cube(5, 9, 4, 6, 10, 5, GLASS);
cube(6, 7, 8, 7, 8, 9, GLASS);

// Bioluminescent spots
cube(-4, 11, 2, -3, 12, 3, GLASS);
cube(3, 11, 2, 4, 12, 3, GLASS);

// Body ridges
cube(-4, 8, 4, -3, 10, 5, LEAVES);
cube(3, 8, 4, 4, 10, 5, LEAVES);
cube(-2, 6, 5, 2, 8, 6, LEAVES);

// Asymmetric head detail
cube(-5, 13, 2, -3, 15, 4, COBBLE);
cube(3, 13, 2, 5, 15, 4, COBBLE);

// Foreground tentacle complexity
cube(-2, 4, 8, 2, 7, 10, OAK_LOG);
sphere(0, 3, 11, 2, LEAVES);

// Additional layering
cube(-3, 6, -3, 3, 8, 0, STONE);
cube(-2, 5, -4, 2, 7, -2, COBBLE);

// Tentacle hooks at tips
line(-8, 0, 18, -9, -2, 19, LEAVES);
line(8, 0, 18, 9, -2, 19, LEAVES);
line(-12, -1, 11, -13, -3, 12, LEAVES);
line(12, -1, 11, 13, -3, 12, LEAVES);