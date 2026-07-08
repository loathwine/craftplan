// thanos-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== THANOS, THE MAD TITAN =====
// Facing north (-Z) toward camera. Purple-gray stone skin, gold armor,
// dark collar/cape, Infinity Gauntlet raised mid-snap with dust motes.

// ---- LEGS ----
cube(-4, 0, -2, -2, 9, 2, STONE);   // left leg
cube(2, 0, -2, 4, 9, 2, STONE);     // right leg
cube(-4, 0, -2, -2, 2, 2, COBBLE);  // left boot
cube(2, 0, -2, 4, 2, 2, COBBLE);    // right boot
cube(-4, 5, -2, -2, 5, 2, SAND);    // left knee band (gold)
cube(2, 5, -2, 4, 5, 2, SAND);      // right knee band (gold)
cube(-4, 3, -2, -2, 4, 2, COBBLE);  // left shin greave
cube(2, 3, -2, 4, 4, 2, COBBLE);    // right shin greave

// ---- BELT / HIPS ----
cube(-5, 9, -3, 5, 10, 3, SAND);
cube(-1, 9, -4, 1, 10, -4, GLASS);  // belt gem stud (front)

// ---- TORSO ----
cube(-5, 10, -2, 5, 18, 2, STONE);
cube(-4, 11, -2, 4, 11, -2, COBBLE); // waist definition line
// diamond chest emblem (gold, popped out one block toward camera)
cube(-1, 12, -3, 1, 12, -3, SAND);
cube(-2, 13, -3, 2, 13, -3, SAND);
cube(-2, 14, -3, 2, 14, -3, SAND);
cube(-2, 15, -3, 2, 15, -3, SAND);
cube(-1, 16, -3, 1, 16, -3, SAND);

// ---- COLLAR (iconic segmented neck ring) ----
block(-1, 18, -1, STONE);
block(0, 18, -1, STONE);
block(1, 18, -1, STONE);
block(-1, 18, 1, STONE);
block(0, 18, 1, STONE);
block(1, 18, 1, STONE);
cube(-1, 19, -1, 1, 19, 1, STONE); // neck
hollowCube(-4, 18, -3, 4, 19, 3, COBBLE); // collar ring

// ---- PAULDRONS ----
cube(-8, 16, -3, -6, 19, 3, SAND);
cube(6, 16, -3, 8, 19, 3, SAND);
cube(-7, 19, -3, -7, 19, 3, COBBLE); // left pauldron ridge
cube(7, 19, -3, 7, 19, 3, COBBLE);   // right pauldron ridge

// ---- LEFT ARM (relaxed, hanging) ----
cube(-8, 10, -1, -6, 16, 1, STONE);   // upper arm
cube(-8, 4, -1, -6, 9, 1, STONE);     // forearm
cube(-8, 7, -1, -6, 7, 1, SAND);      // vambrace band
cube(-9, 1, -2, -6, 3, 1, STONE);     // fist

// ---- RIGHT ARM (raised, mid-snap) ----
cube(6, 17, -1, 8, 22, 1, STONE);     // upper arm
cube(5, 22, -3, 8, 25, -1, STONE);    // forearm angled up/forward
cube(5, 23, -2, 8, 23, -1, SAND);     // vambrace band
cube(3, 25, -5, 7, 28, -2, SAND);     // Infinity Gauntlet fist

// Infinity Stones on gauntlet knuckles (front face)
block(3, 27, -5, GLASS);    // Space
block(4, 27, -5, OAK_LOG);  // Mind
block(5, 27, -5, BRICK);    // Reality
block(6, 27, -5, ICE);      // Power
block(7, 27, -5, LEAVES);   // Time
block(5, 26, -5, SNOW);     // Soul

// ---- HEAD ----
cube(-3, 19, -3, 3, 25, 2, STONE);
cube(-3, 23, -4, 3, 23, -4, STONE);  // heavy brow ridge
block(-2, 22, -3, COBBLE);           // left eye socket
block(2, 22, -3, COBBLE);            // right eye socket
cube(-2, 20, -3, 2, 20, -3, COBBLE); // grim mouth line
block(0, 21, -4, STONE);             // nose bump
cube(-1, 19, -4, 1, 19, -4, STONE);  // chin protrusion
block(0, 19, -4, AIR);               // signature cleft dimple
block(-4, 22, 0, COBBLE);            // left ear nub
block(4, 22, 0, COBBLE);             // right ear nub

// ---- CAPE (dark, flowing behind) ----
cube(-5, 15, 3, 5, 19, 4, COBBLE);
cube(-6, 8, 4, 6, 15, 5, COBBLE);
cube(-7, 1, 5, 7, 8, 6, COBBLE);
// tattered bottom edge notches
block(-7, 1, 6, AIR);
block(-4, 1, 6, AIR);
block(0, 1, 6, AIR);
block(4, 1, 6, AIR);
block(7, 1, 6, AIR);

// ---- GROUND RUBBLE at his feet (conqueror's wake) ----
cube(-10, 0, -6, -8, 0, -5, STONE);
cube(7, 0, -7, 9, 0, -6, STONE);
cube(-6, 0, -7, -5, 0, -6, COBBLE);
block(9, 0, -4, STONE);
block(-9, 0, -3, COBBLE);

// ---- SNAP DUST MOTES swirling off the gauntlet ----
(function () {
  var cx = 5, cy = 26, cz = -3;
  var dustBlocks = [SAND, SNOW, GLASS];
  for (var i = 0; i < 45; i++) {
    var r = 2 + (i % 6) + Math.random() * 3;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.random() * Math.PI;
    var dx = Math.round(cx + r * Math.sin(phi) * Math.cos(theta));
    var dy = Math.round(cy + r * Math.cos(phi) * 0.6);
    var dz = Math.round(cz + r * Math.sin(phi) * Math.sin(theta) - r * 0.4);
    var id = dustBlocks[i % dustBlocks.length];
    block(dx, dy, dz, id);
  }
})();
