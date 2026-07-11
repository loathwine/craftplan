// statue-liberty-4x-haiku — prompt:
// the Statue of Liberty...

// Statue of Liberty voxel sculpture

// ===== MASSIVE PEDESTAL BASE =====
// Foundation layers
cube(-12, -2, -12, 12, -1, 12, STONE);
cube(-11, -1, -11, 11, 0, 11, STONE);
cube(-10, 0, -10, 10, 1, 10, BRICK);
cube(-9, 1, -9, 9, 2, 9, BRICK);
cube(-8, 2, -8, 8, 4, 8, BRICK);
cube(-7, 4, -7, 7, 6, 7, BRICK);

// Pedestal corner pillars for grandeur
cube(-8, 6, -8, -7, 9, -7, COBBLE);
cube(7, 6, -8, 8, 9, -7, COBBLE);
cube(-8, 6, 7, -7, 9, 8, COBBLE);
cube(7, 6, 7, 8, 9, 8, COBBLE);

// Upper pedestal platform
cube(-6, 9, -6, 6, 10, 6, BRICK);

// ===== STATUE BODY =====
// Feet and robe base
cube(-2, 10, -2, 2, 11, 2, STONE);
cube(-3, 11, -2, 3, 15, 2, STONE);

// Robe drapery folds - left side
cube(-4, 12, -1, -3, 14, 1, STONE);
cube(-5, 13, 1, -4, 15, 3, STONE);

// Robe drapery folds - right side  
cube(3, 12, -1, 4, 14, 1, STONE);
cube(4, 13, 1, 5, 15, 3, STONE);

// Main torso
cube(-2, 15, -1, 2, 17, 1, STONE);

// Chest/shoulders
cube(-3, 17, -1, 3, 19, 1, BRICK);

// Neck
cube(-1, 19, 0, 1, 20, 0, STONE);

// ===== HEAD & CROWN =====
cube(-2, 20, -1, 2, 22, 1, BRICK);

// Crown band
cube(-3, 22, -2, 3, 23, 0, BRICK);

// Crown spikes
cube(-3, 23, -2, -2, 25, -1, BRICK);
cube(-1, 23, -2, 1, 26, -1, BRICK);
cube(2, 23, -2, 3, 25, -1, BRICK);

// ===== RIGHT ARM & TORCH =====
// Upper arm raised
cube(3, 15, -1, 5, 18, 1, STONE);

// Forearm extended
cube(5, 17, 0, 7, 19, 1, STONE);

// Hand/wrist
cube(7, 18, -1, 8, 20, 0, BRICK);

// Torch structure
cube(7, 19, -2, 9, 21, 1, BRICK);
cylinder(8, 21, -1, 2, 5, BRICK);

// Torch flame - primary
sphere(8, 26, -1, 3, BRICK);
sphere(8, 24, -1, 2, GLASS);

// Torch glow/light detail
cube(6, 23, -1, 10, 25, -1, GLASS);

// ===== LEFT ARM & TABLET =====
// Upper arm
cube(-5, 15, -1, -3, 18, 1, STONE);

// Forearm
cube(-7, 17, 0, -5, 19, 1, STONE);

// Hand
cube(-8, 18, -1, -7, 20, 0, BRICK);

// Tablet/Declaration (book shape)
cube(-10, 13, -2, -7, 16, 0, COBBLE);

// Tablet detail lines
line(-9, 13, -1, -8, 13, -1, GLASS);
line(-9, 14, -1, -8, 14, -1, GLASS);
line(-9, 15, -1, -8, 15, -1, GLASS);

// ===== BROKEN CHAINS AT FEET =====
// Chain links on ground (symbol of freedom)
line(-4, 11, 2, -5, 10, 4, OAK_LOG);
line(-3, 11, 2, -4, 10, 4, OAK_LOG);
line(3, 11, 2, 4, 10, 4, OAK_LOG);
line(4, 11, 2, 5, 10, 4, OAK_LOG);
line(-5, 10, 4, -6, 9, 5, OAK_LOG);
line(5, 10, 4, 6, 9, 5, OAK_LOG);

// ===== PEDESTAL ARCHITECTURAL DETAILS =====
// Window openings on pedestal
cube(-6, 5, -6, -5, 7, -5, AIR);
cube(5, 5, -6, 6, 7, -5, AIR);
cube(-6, 5, 5, -5, 7, 6, AIR);
cube(5, 5, 5, 6, 7, 6, AIR);

// Stair steps for base access
cube(-7, 7, -7, -6, 8, -6, COBBLE);
cube(6, 7, -7, 7, 8, -6, COBBLE);
cube(-7, 7, 6, -6, 8, 7, COBBLE);
cube(6, 7, 6, 7, 8, 7, COBBLE);

// Mid-pedestal bands for detail
cube(-8, 3, -6, 8, 4, 6, STONE);
cube(-6, 8, -6, 6, 9, 6, COBBLE);

// ===== ADDITIONAL DETAIL & ASYMMETRY =====
// Lower robe asymmetry
cube(-3, 14, 2, -1, 16, 4, STONE);
cube(1, 14, 2, 3, 16, 4, STONE);

// Raised pedestal edges for platform
cube(-6, 9, -6, -5, 10, -5, COBBLE);
cube(5, 9, -6, 6, 10, -5, COBBLE);
cube(-6, 9, 5, -5, 10, 6, COBBLE);
cube(5, 9, 5, 6, 10, 6, COBBLE);

// Crown details - internal structure
cube(-2, 22, -1, 2, 23, 0, BRICK);

// Torch reflection detail
disk(8, 22, -1, 3, GLASS);

// Foreground detail on pedestal south face
cube(-7, 2, 7, 7, 4, 8, COBBLE);