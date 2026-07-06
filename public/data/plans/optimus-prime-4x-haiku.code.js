// optimus-prime-4x-haiku — prompt:
// Optimus Prime...

// Optimus Prime - Large armored robot

// BASE/FEET
cube(-5, -2, -2, -2, 0, 2, STONE);   // Left foot
cube(2, -2, -2, 5, 0, 2, STONE);     // Right foot

// LEGS
// Left leg assembly
cube(-4, 0, -1, -2, 4, 1, COBBLE);   // Upper leg
cube(-4, 4, -2, -2, 6, 2, STONE);    // Knee armor
cube(-4, 6, -1, -2, 9, 1, COBBLE);   // Lower leg

// Right leg assembly
cube(2, 0, -1, 4, 4, 1, COBBLE);     // Upper leg
cube(2, 4, -2, 4, 6, 2, STONE);      // Knee armor
cube(2, 6, -1, 4, 9, 1, COBBLE);     // Lower leg

// HIP SECTION
cube(-5, 9, -2, 5, 12, 2, COBBLE);   // Hip plate
cube(-1, 8, -3, 1, 10, 3, BRICK);    // Center stripe

// TORSO/BODY
cube(-6, 12, -3, 6, 18, 3, COBBLE);  // Main body

// Torso red accent panels
cube(-6, 13, -3, -5, 17, -3, BRICK); // Left panel
cube(5, 13, -3, 6, 17, -3, BRICK);   // Right panel
line(-1, 14, -3, 1, 14, -3, BRICK);  // Center line

// CHEST - iconic glowing center
cube(-3, 14, -3, 3, 17, -3, COBBLE); // Chest plate
cube(-2, 15, -3, 2, 16, -3, GLASS);  // Glowing window

// BACK DETAILS
cube(-5, 13, 3, -4, 17, 4, BRICK);   // Left back armor
cube(4, 13, 3, 5, 17, 4, BRICK);     // Right back armor

// SHOULDERS
cube(-8, 16, -3, -6, 20, 3, STONE);  // Left shoulder
cube(6, 16, -3, 8, 20, 3, STONE);    // Right shoulder

// Shoulder joints
cube(-8, 17, -2, -7, 19, 2, BRICK);  // Left joint
cube(7, 17, -2, 8, 19, 2, BRICK);    // Right joint

// NECK
cube(-2, 19, -2, 2, 21, 2, COBBLE);

// HEAD - distinctive Optimus silhouette
cube(-4, 21, -3, 4, 26, 3, COBBLE);  // Main head

// Face - forward facing
cube(-3, 22, -3, 3, 25, -3, STONE);
cube(-2, 23, -3, 2, 24, -3, GLASS);  // Eyes/visor

// Crown/crest - red
cube(-5, 25, -2, 5, 27, 2, BRICK);
cube(-2, 26, -1, 2, 28, 1, BRICK);   // Center spike

// LEFT ARM
cube(-9, 16, -2, -8, 21, 2, COBBLE); // Upper arm
cube(-11, 14, -2, -9, 19, 2, COBBLE);// Mid arm
cube(-13, 12, -3, -11, 17, 3, STONE);// Forearm
cube(-14, 10, -4, -12, 15, 4, STONE);// Hand/fist

// Left arm stripe
line(-8, 17, -2, -13, 12, -2, BRICK);

// RIGHT ARM
cube(8, 16, -2, 9, 21, 2, COBBLE);   // Upper arm
cube(9, 14, -2, 11, 19, 2, COBBLE);  // Mid arm
cube(11, 12, -3, 13, 17, 3, STONE);  // Forearm
cube(12, 10, -4, 14, 15, 4, STONE);  // Hand/fist

// Right arm stripe
line(8, 17, -2, 13, 12, -2, BRICK);

// ARMOR DETAIL PLATING
// Leg panels
cube(-5, 2, 2, -2, 5, 3, BRICK);     // Left leg back
cube(2, 2, 2, 5, 5, 3, BRICK);       // Right leg back

// Torso side ribs
cube(-7, 13, -1, -6, 16, 1, BRICK);
cube(6, 13, -1, 7, 16, 1, BRICK);

// Waist detail
cube(-5, 11, 2, 5, 12, 3, STONE);

// Back thrusters
cube(-2, 10, 4, 2, 13, 5, BRICK);
cube(-1, 10, 5, 1, 13, 6, GLASS);