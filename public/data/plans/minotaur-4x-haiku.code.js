// minotaur-4x-haiku — prompt:
// a minotaur...

// Minotaur - bull-headed warrior

// === HORNS ===
// Left horn
cylinder(-1.5, 12, 0.5, 0.75, 6, OAK_LOG);
line(-1.5, 12, 0.5, -2.5, 19, -1, OAK_LOG);

// Right horn - mirrored
cylinder(1.5, 12, 0.5, 0.75, 6, OAK_LOG);
line(1.5, 12, 0.5, 2.5, 19, -1, OAK_LOG);

// === HEAD ===
// Main skull - blocky bull head
cube(-2, 8, -2, 2, 11, 3, STONE);
cube(-2.5, 9, -1, 2.5, 12, 2, COBBLE);

// Snout - prominent muzzle
cube(-1.5, 7, 2, 1.5, 9, 4, BRICK);
cube(-1, 6.5, 3, 1, 8, 4, COBBLE);

// Nostrils
block(-0.5, 7, 4, AIR);
block(0.5, 7, 4, AIR);

// Ears - pointed bovine
cube(-3.5, 10, -0.5, -2, 13, 1, STONE);
cube(2, 10, -0.5, 3.5, 13, 1, STONE);

// Eyes - menacing
block(-1, 10, -2, GLASS);
block(1, 10, -2, GLASS);

// === NECK ===
cube(-2.5, 6, -1, 2.5, 8, 2, COBBLE);

// === TORSO ===
// Main chest - broad muscular
cube(-4, 1, -2, 4, 8, 2, BRICK);

// Pectoral definition
cube(-4, 3, -3, -2, 7, -2, COBBLE);
cube(2, 3, -3, 4, 7, -2, COBBLE);

// Ribcage striations
line(-3.5, 4, -1.5, -3.5, 6, -1.5, STONE);
line(3.5, 4, -1.5, 3.5, 6, -1.5, STONE);

// Abdomen sculpting
cube(-3, 0, -2, 3, 3, 2, COBBLE);

// === ARMS ===
// Left arm - upper
cube(-5, 3, -1, -4, 7, 1, STONE);
cube(-5.5, 2, -1.5, -4, 5, 0.5, COBBLE);

// Left forearm/fist
cube(-6.5, 1, -1, -5.5, 4, 0, BRICK);

// Right arm - upper
cube(4, 3, -1, 5, 7, 1, STONE);
cube(4, 2, -1.5, 5.5, 5, 0.5, COBBLE);

// Right forearm/fist
cube(5.5, 1, -1, 6.5, 4, 0, BRICK);

// === LEGS ===
// Left leg - thick muscular
cube(-2, -4, -1, -0.5, 1, 1, COBBLE);

// Left calf detail
cube(-2.2, -3, -1.5, -0.8, 0, 0.5, STONE);

// Left foot
cube(-2.5, -6, -1, -0.5, -4.5, 1, STONE);

// Right leg
cube(0.5, -4, -1, 2, 1, 1, COBBLE);

// Right calf detail
cube(0.8, -3, -1.5, 2.2, 0, 0.5, STONE);

// Right foot
cube(0.5, -6, -1, 2.5, -4.5, 1, STONE);

// === ORNAMENTS ===
// Chest medallion
cube(-1, 5, -3, 1, 6, -3, BRICK);
block(0, 5.5, -3, GLASS);

// Ornamental belt
cube(-4, 0, -3, 4, 1, -3, BRICK);
block(-2, 0.5, -3, COBBLE);
block(0, 0.5, -3, COBBLE);
block(2, 0.5, -3, COBBLE);

// Wrist guards
cube(-6.5, 3, -2, -5.5, 5, -0.5, COBBLE);
cube(5.5, 3, -2, 6.5, 5, -0.5, COBBLE);

// Leg armor - greaves
cube(-2.2, 0, -2.5, -0.8, 3, -2, COBBLE);
cube(0.8, 0, -2.5, 2.2, 3, -2, COBBLE);

// Shoulder spikes
cube(-4.5, 7.5, -2.5, -3.5, 8.5, -1.5, BRICK);
cube(3.5, 7.5, -2.5, 4.5, 8.5, -1.5, BRICK);