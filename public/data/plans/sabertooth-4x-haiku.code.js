// sabertooth-4x-haiku — prompt:
// a sabertooth tiger...

// Sabertooth Tiger - apex predator

// === CORE BODY ===
cube(-7, 0, 2, 7, 6, 13, STONE);      // Main torso

// === HEAD - LARGE AND INTIMIDATING ===
cube(-6, 3, -11, 6, 8, -3, STONE);    // Main head structure
cube(-5, 5, -12, 5, 9, -10, STONE);   // Upper skull

// Snout/muzzle
cube(-4, 2, -13, 4, 5, -11, BRICK);   // Muzzle block

// === ICONIC SABER FANGS ===
// Left fang - long curved canine
cube(-4, 5, -14, -2, 10, -11, STONE);
cube(-4, 9, -15, -2, 11, -12, STONE); // Fang tip

// Right fang - symmetrical
cube(2, 5, -14, 4, 10, -11, STONE);
cube(2, 9, -15, 4, 11, -12, STONE);   // Fang tip

// Fang enamel/highlights
cube(-3, 7, -14, -2, 9, -12, COBBLE);
cube(2, 7, -14, 3, 9, -12, COBBLE);

// Upper jaw structure
cube(-5, 6, -11, 5, 7, -9, COBBLE);

// Lower jaw
cube(-4, 2, -10, 4, 3, -8, BRICK);

// === FACIAL FEATURES ===
// Eyes - fierce gaze
block(-2, 7, -10, GLASS);
block(2, 7, -10, GLASS);

// Eye sockets - shadow
block(-2, 6, -10, COBBLE);
block(2, 6, -10, COBBLE);

// Ears - pointed and alert
cube(-7, 8, -8, -5, 11, -5, STONE);
cube(5, 8, -8, 7, 11, -5, STONE);

// Ear inner detail
cube(-6, 9, -7, -5, 10, -6, COBBLE);
cube(5, 9, -7, 6, 10, -6, COBBLE);

// Nose
cube(-2, 4, -13, 2, 5, -12, COBBLE);

// === FRONT LEGS ===
// Left front
cube(-8, -2, 0, -6, 1, 4, STONE);
cube(-8, 0, 1, -7, 2, 3, BRICK);
cube(-8, -2, 0, -7, 0, 1, COBBLE);

// Right front
cube(6, -2, 0, 8, 1, 4, STONE);
cube(7, 0, 1, 8, 2, 3, BRICK);
cube(7, -2, 0, 8, 0, 1, COBBLE);

// === BACK LEGS ===
// Left back
cube(-8, -2, 10, -6, 1, 14, STONE);
cube(-8, 0, 11, -7, 2, 13, BRICK);
cube(-8, -2, 10, -7, 0, 11, COBBLE);

// Right back
cube(6, -2, 10, 8, 1, 14, STONE);
cube(7, 0, 11, 8, 2, 13, BRICK);
cube(7, -2, 10, 8, 0, 11, COBBLE);

// === TAIL ===
cube(-3, 1, 13, 3, 5, 16, STONE);     // Tail base
cube(-2, 1, 16, 2, 5, 19, STONE);     // Tail middle
cube(-1, 2, 19, 1, 5, 22, STONE);     // Tail tip

// Tail detail
cube(-3, 4, 14, 3, 5, 17, BRICK);

// === MUSCLE DEFINITION ===
// Neck musculature
cube(-6, 5, -2, 6, 7, 1, BRICK);

// Shoulder muscles
cube(-7, 4, 1, -6, 6, 3, BRICK);
cube(6, 4, 1, 7, 6, 3, BRICK);

// Chest
cube(-6, 3, 0, 6, 5, 3, COBBLE);

// Back/spine ridge
cube(-5, 6, 3, 5, 7, 12, BRICK);

// Side muscles - ribs
cube(-7, 2, 4, -6, 4, 9, COBBLE);
cube(6, 2, 4, 7, 4, 9, COBBLE);

// Haunch muscles
cube(-7, 2, 10, -6, 4, 13, BRICK);
cube(6, 2, 10, 7, 4, 13, BRICK);

// === DETAIL FEATURES ===
// Belly coloring
cube(-6, 0, 4, 6, 1, 12, COBBLE);

// Facial ridge/brow
cube(-5, 8, -9, 5, 9, -7, COBBLE);

// Striping on body
cube(-6, 3, 6, -5, 5, 8, BRICK);
cube(5, 3, 6, 6, 5, 8, BRICK);

// Paw detail - claws
block(-8, -2, 0, BRICK);
block(-8, -2, 3, BRICK);
block(8, -2, 0, BRICK);
block(8, -2, 3, BRICK);
block(-8, -2, 10, BRICK);
block(-8, -2, 13, BRICK);
block(8, -2, 10, BRICK);
block(8, -2, 13, BRICK);

// Nostril detail
block(-1, 4, -13, COBBLE);
block(1, 4, -13, COBBLE);

// Whiskers suggestion
line(-6, 5, -10, -8, 5, -10, COBBLE);
line(6, 5, -10, 8, 5, -10, COBBLE);