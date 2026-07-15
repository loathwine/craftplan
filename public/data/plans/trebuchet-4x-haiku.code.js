// trebuchet-4x-haiku — prompt:
// a medieval trebuchet...

// Medieval Trebuchet

// ===== WHEELS =====
// Left wheel
sphere(-10, 1, 0, 1.8, COBBLE);
cylinder(-10, 1, -2, 0.3, 4, STONE);
// Right wheel
sphere(10, 1, 0, 1.8, COBBLE);
cylinder(10, 1, -2, 0.3, 4, STONE);
// Axle
line(-10, 1, 0, 10, 1, 0, STONE);

// ===== BASE PLATFORM =====
cube(-8, 0, -7, 8, 1, 8, PLANKS);
cube(-8, 1, -7, -7, 4, -6, COBBLE);
cube(7, 1, -7, 8, 4, -6, COBBLE);
cube(-8, 1, 7, -7, 4, 8, COBBLE);
cube(7, 1, 7, 8, 4, 8, COBBLE);

// ===== FRAME STRUCTURE =====
// Main vertical posts
cube(-9, 1, -7, -8, 10, -6, OAK_LOG);
cube(8, 1, -7, 9, 10, -6, OAK_LOG);
cube(-9, 1, 7, -8, 10, 8, OAK_LOG);
cube(8, 1, 7, 9, 10, 8, OAK_LOG);

// Top cross beam
cube(-7, 10, -6, 7, 11, 7, PLANKS);

// Internal diagonal bracing
line(-6, 3, -5, 6, 9, 5, STONE);
line(6, 3, -5, -6, 9, 5, STONE);
line(-5, 4, -6, 5, 8, 7, COBBLE);
line(5, 4, -6, -5, 8, 7, COBBLE);

// ===== PIVOT POINT ASSEMBLY =====
cube(-4, 10, -2, 4, 13, 2, STONE);
cube(-5, 9, -3, 5, 12, 3, COBBLE);
cube(-3, 11, -1, 3, 12, 1, BRICK);

// ===== MAIN THROWING ARM (angled upward) =====
// Long beam running forward and up
line(-4, 13, 0, -4, 19, 16, OAK_LOG);
line(-2, 13, 0, -2, 19, 16, OAK_LOG);
line(0, 13, 0, 0, 19, 16, OAK_LOG);
line(2, 13, 0, 2, 19, 16, OAK_LOG);
line(4, 13, 0, 4, 19, 16, OAK_LOG);
cube(-3, 13, 2, 3, 14, 14, PLANKS);

// Arm strapping / reinforcement bands
cube(-6, 12, 5, 6, 13, 6, BRICK);
cube(-6, 12, 10, 6, 13, 11, BRICK);
cube(-6, 12, 15, 6, 13, 16, BRICK);

// ===== COUNTERWEIGHT (back side) =====
cube(-6, 3, -16, 6, 11, -12, STONE);
cube(-7, 5, -18, 7, 10, -11, COBBLE);
cube(-5, 6, -16, 5, 10, -13, BRICK);
cube(-3, 7, -15, 3, 10, -14, STONE);

// Chains/beams from weight to arm
line(-4, 10, -12, -4, 13, -1, STONE);
line(4, 10, -12, 4, 13, -1, STONE);

// ===== SLING TIP AND ROPES =====
cube(-4, 19, 15, 4, 21, 17, PLANKS);
cube(-5, 18, 14, 5, 20, 18, BRICK);

// Sling rope lines (represents the launch sling)
line(-2, 20, 17, -7, 5, 9, GLASS);
line(0, 20, 17, 0, 4, 9, GLASS);
line(2, 20, 17, 7, 5, 9, GLASS);

// ===== SUPPORT BRACING =====
// Heavy X-bracing under arm
line(-6, 5, 0, 6, 9, 0, COBBLE);
line(6, 5, 0, -6, 9, 0, COBBLE);
line(-5, 5, -2, 5, 8, 2, STONE);
line(5, 5, -2, -5, 8, 2, STONE);

// ===== WINCH MECHANISM (right side) =====
cube(8, 3, -1, 10, 5, 2, PLANKS);
cube(8, 4, -1, 10, 5, 2, OAK_LOG);
cylinder(9, 4, 0.5, 0.6, 2, OAK_LOG);
cube(8.5, 5, 0, 9.5, 6, 1, BRICK);

// ===== ROPE STORAGE =====
cube(-8, 2, 2, -7, 5, 6, PLANKS);
cube(7, 2, 2, 8, 5, 6, PLANKS);
cube(-8, 2, -5, -7, 4, -2, PLANKS);
cube(7, 2, -5, 8, 4, -2, PLANKS);

// ===== FIRING PLATFORM =====
cube(-6, 2, 2, 6, 3, 4, BRICK);

// ===== DECORATIVE DETAILS =====
// Reinforcement plates on arm
cube(-1, 14, 8, 1, 15, 9, BRICK);
cube(-2, 15, 12, 2, 16, 13, BRICK);

// Structural corner brackets
cube(-7, 9, -6, -6, 10, -5, BRICK);
cube(6, 9, -6, 7, 10, -5, BRICK);
cube(-7, 9, 6, -6, 10, 7, BRICK);
cube(6, 9, 6, 7, 10, 7, BRICK);

// Additional beam details
line(-4, 11, -3, 4, 11, 3, PLANKS);
line(-3, 11, -4, 3, 11, 4, PLANKS);