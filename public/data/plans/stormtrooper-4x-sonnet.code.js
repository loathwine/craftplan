// stormtrooper-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// Clear our build footprint first to remove any tree debris in the way
cube(-11, -1, -9, 13, 26, 6, AIR);

// ===== PEDESTAL =====
disk(0, -2, 0, 9, COBBLE);
disk(0, -1, 0, 7, STONE);
block(-9, -1, 4, STONE);
block(-8, -1, 5, STONE);
block(10, -1, 3, STONE);

// ===== LEGS =====
// boots
cube(-4, 0, -2, -2, 2, 2, COBBLE);
cube(2, 0, -2, 4, 2, 2, COBBLE);
// leg armor
cube(-4, 3, -2, -2, 9, 2, SNOW);
cube(2, 3, -2, 4, 9, 2, SNOW);
// shin trim (bottom of armor, front)
cube(-4, 3, -2, -2, 3, -2, STONE);
cube(2, 3, -2, 4, 3, -2, STONE);
// knee pads (front)
cube(-4, 6, -2, -2, 6, -2, STONE);
cube(2, 6, -2, 4, 6, -2, STONE);

// ===== BELT / HIPS =====
cube(-5, 10, -2, 5, 10, 2, COBBLE);
// left pouch (small)
cube(-6, 9, -3, -5, 9, -2, COBBLE);
// right pouch (bigger - asymmetric detail, thermal detonator pouch)
cube(5, 9, -3, 6, 10, -2, COBBLE);
block(5, 9, -4, STONE);

// ===== TORSO =====
cube(-5, 11, -2, 5, 16, 2, SNOW);
// ab plate trim
cube(-5, 11, -2, 5, 11, -2, STONE);
// center chest divider strip
cube(0, 11, -2, 0, 16, -2, COBBLE);
// chest control box (asymmetric, right side as viewed)
cube(2, 14, -2, 3, 15, -2, COBBLE);
block(2, 13, -3, STONE);
block(3, 13, -3, STONE);
// left chest greeble (smaller, asymmetric)
block(-3, 15, -2, STONE);
// shoulder trim
cube(-5, 16, -2, 5, 16, -2, STONE);

// ===== ARMS =====
cube(-8, 9, -2, -6, 16, 2, SNOW);
cube(6, 9, -2, 8, 16, 2, SNOW);
// elbow trim
cube(-8, 12, -2, -6, 12, -2, STONE);
cube(6, 12, -2, 8, 12, -2, STONE);
// gloves
cube(-8, 6, -2, -6, 8, 2, COBBLE);
cube(6, 6, -2, 8, 8, 2, COBBLE);

// ===== HEAD =====
cube(-1, 17, -2, 1, 17, 2, COBBLE); // neck seal
cube(-3, 18, -2, 3, 19, 2, SNOW);   // jaw / lower helmet
cube(-1, 18, -2, 1, 18, -2, COBBLE); // mouth grille
cube(-3, 20, -2, 3, 21, 2, SNOW);   // helmet mid
cube(-3, 20, -2, 3, 21, -2, COBBLE); // visor band
block(-3, 20, 0, STONE); // left ear vent
block(3, 20, 0, STONE);  // right ear vent
cube(-3, 22, -2, 3, 22, 2, SNOW);   // forehead
cube(0, 22, -2, 0, 24, -2, STONE);  // center ridge trim
cube(-2, 23, -2, 2, 23, 2, SNOW);   // dome cap
cube(-1, 24, -2, 1, 24, 2, SNOW);   // upper dome
block(0, 25, 0, SNOW);              // apex

// ===== BLASTER RIFLE (right hand) =====
cube(6, 7, -7, 7, 7, -2, STONE);   // barrel
cube(7, 6, -3, 8, 6, 0, COBBLE);   // grip/stock
block(6, 8, -6, STONE);            // front sight
block(7, 8, -6, STONE);

// ===== FOREGROUND CRATE PROP =====
cube(9, 0, 2, 11, 1, 4, PLANKS);
hollowCube(9, 0, 2, 11, 1, 4, COBBLE);
