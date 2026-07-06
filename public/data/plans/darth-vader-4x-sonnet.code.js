// darth-vader-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Clear tree clutter in the footprint (AIR is free) =====
cube(-9, 1, -9, 9, 30, 11, AIR);

// ===== LEGS / BOOTS =====
cube(-4, 0, -3, -1, 8, 0, COBBLE); // left leg
cube(1, 0, -3, 4, 8, 0, COBBLE);   // right leg
cube(-4, 4, -3, -1, 4, -3, STONE); // left knee plate
cube(1, 4, -3, 4, 4, -3, STONE);   // right knee plate
cube(-4, 0, -3, -1, 1, 1, COBBLE); // left boot toe
cube(1, 0, -3, 4, 1, 1, COBBLE);   // right boot toe

// ===== HIP / PELVIS =====
cube(-4, 9, -2, 4, 12, 2, COBBLE);

// ===== BELT =====
cube(-4, 13, -2, 4, 13, 2, STONE);
block(0, 13, -2, BRICK); // buckle

// ===== TORSO =====
cube(-4, 14, -2, 4, 20, 2, COBBLE);

// chest control panel
cube(-2, 16, -3, 2, 18, -3, STONE);
block(-1, 17, -3, BRICK);
block(0, 17, -3, BRICK);
block(1, 17, -3, BRICK);
cube(2, 15, -3, 3, 17, -3, STONE); // side box
block(2, 16, -3, BRICK);

// ===== SHOULDERS =====
cube(-6, 19, -2, -4, 21, 2, COBBLE);
cube(4, 19, -2, 6, 21, 2, COBBLE);
block(-4, 20, 1, STONE); // cape clasp
block(4, 20, 1, STONE);  // cape clasp

// ===== NECK =====
cube(-1, 21, -1, 1, 21, 1, COBBLE);

// ===== HEAD / HELMET =====
cube(-3, 22, -2, 3, 23, 2, COBBLE);   // jaw / cheek flare
cube(-2, 22, -4, 2, 22, -2, COBBLE);  // chin guard
cube(-1, 22, -4, 1, 22, -4, STONE);   // mouth grille bar
block(-1, 23, -3, STONE);             // left eye lens
block(1, 23, -3, STONE);              // right eye lens

cube(-4, 23, -1, -4, 24, 1, COBBLE);  // left ear vent
cube(4, 23, -1, 4, 24, 1, COBBLE);    // right ear vent
block(-4, 23, 0, STONE);
block(4, 23, 0, STONE);

cube(-3, 24, -2, 3, 25, 1, COBBLE);   // helmet mid dome
cube(-2, 26, -1, 2, 27, 1, COBBLE);   // upper dome
cube(-1, 28, 0, 1, 28, 0, COBBLE);    // apex ring
block(0, 29, 0, COBBLE);              // apex cap

// ===== LEFT ARM (hanging at side) =====
cube(-6, 10, -1, -5, 19, 1, COBBLE);
cube(-6, 8, -1, -5, 10, 1, STONE); // glove

// ===== RIGHT ARM (raised, holding lightsaber) =====
cube(5, 15, -1, 6, 19, 1, COBBLE);   // upper arm
cube(5, 15, -5, 6, 16, -1, COBBLE);  // forearm bent forward
cube(5, 16, -7, 6, 17, -6, STONE);   // hand/glove
cube(5, 17, -8, 6, 18, -7, STONE);   // saber hilt
block(5, 17, -8, BRICK);             // activation button
cube(5, 19, -8, 6, 27, -7, BRICK);   // saber blade

// ===== CAPE (flowing behind, tapering upward) =====
cube(-7, 0, 2, 7, 2, 9, COBBLE);
cube(-6, 3, 2, 6, 5, 8, COBBLE);
cube(-6, 6, 2, 6, 8, 7, COBBLE);
cube(-5, 9, 2, 5, 11, 6, COBBLE);
cube(-5, 12, 1, 5, 14, 5, COBBLE);
cube(-4, 15, 1, 4, 17, 4, COBBLE);
cube(-4, 18, 0, 4, 20, 3, COBBLE);
// cape trim
cube(-7, 0, 9, 7, 0, 9, BRICK);
```
