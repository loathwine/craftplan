// mario-4x-opus — prompt:
// Super Mario...

block(0,0,0,0); // no-op anchor

// ---------- SUPER MARIO — big blocky statue + level props ----------
// Palette: PLANKS=skin, BRICK=red cap/shirt, GLASS=blue overalls,
// OAK_LOG=brown mustache/hair/shoes, SNOW=white gloves/eyes, LEAVES=green pipe

// Clear just the figure/prop volumes (not the whole site) so trees don't poke through
cube(-9, 0, -7, 9, 32, 9, AIR);      // Mario
cube(11, 0, -4, 19, 14, 6, AIR);     // pipe
cube(-15, 13, -4, -8, 21, 6, AIR);   // ? block
cube(-20, -1, -4, -10, 10, 6, AIR);  // mushroom

// ============================================================
// MARIO  (faces +Z / south)
// ============================================================

// ---- Shoes (brown) ----
cube(-6, 0, -2, -1, 2, 4, OAK_LOG);   // left shoe
cube( 1, 0, -2,  6, 2, 4, OAK_LOG);   // right shoe
// sole lift at toes
cube(-6, 0, 4, -1, 1, 5, OAK_LOG);
cube( 1, 0, 4,  6, 1, 5, OAK_LOG);

// ---- Legs / lower overalls (blue) ----
cube(-5, 3, -2, -1, 9, 2, GLASS);     // left leg
cube( 1, 3, -2,  5, 9, 2, GLASS);     // right leg

// ---- Torso: blue overalls ----
cube(-5, 10, -3, 5, 15, 3, GLASS);
// red shirt shoulders (wider)
cube(-6, 16, -3, 6, 18, 3, BRICK);
// overall bib front + straps (blue over red)
cube(-3, 16, 3, 3, 18, 3, GLASS);     // bib front
line(-3, 16, 3, -3, 18, 3, GLASS);    // left strap
line( 3, 16, 3,  3, 18, 3, GLASS);    // right strap
// gold-ish buttons (white) on straps
block(-3, 15, 4, SNOW);
block( 3, 15, 4, SNOW);

// ---- Arms (red) with white gloves ----
cube(-9, 10, -2, -7, 17, 2, BRICK);   // left arm
cube( 7, 10, -2,  9, 17, 2, BRICK);   // right arm
cube(-9, 7, -2, -7, 9, 2, SNOW);      // left glove
cube( 7, 7, -2,  9, 9, 2, SNOW);      // right glove

// ============================================================
// HEAD (skin) — y 18..25
// ============================================================
cube(-5, 18, -3, 5, 25, 3, PLANKS);
block(-6, 20, 0, PLANKS);  block(-6, 21, 0, PLANKS);  // ears
block( 6, 20, 0, PLANKS);  block( 6, 21, 0, PLANKS);

// ---- Big nose (skin) sticking out front ----
cube(-1, 21, 4, 1, 23, 5, PLANKS);

// ---- Eyes: white sclera + blue pupils ----
cube(-3, 23, 4, -2, 25, 4, SNOW);
cube( 2, 23, 4,  3, 25, 4, SNOW);
block(-2, 24, 5, GLASS);
block( 2, 24, 5, GLASS);

// ---- Mustache (brown) under nose, curling up at ends ----
cube(-4, 19, 4, 4, 20, 5, OAK_LOG);
block(-4, 21, 5, OAK_LOG);  block(4, 21, 5, OAK_LOG);   // curls
block(-4, 18, 5, OAK_LOG);  block(4, 18, 5, OAK_LOG);   // hangs

// ---- Sideburns / hair (brown) ----
cube(-6, 19, 2, -5, 24, 4, OAK_LOG);
cube( 5, 19, 2,  6, 24, 4, OAK_LOG);
// back hair
cube(-5, 19, -4, 5, 24, -4, OAK_LOG);

// ============================================================
// CAP (red) — y 26..30
// ============================================================
cube(-6, 26, -4, 6, 29, 4, BRICK);    // dome
cube(-5, 30, -3, 5, 30, 3, BRICK);    // rounded top
// brim jutting forward over eyes
cube(-6, 25, 5, 6, 26, 7, BRICK);
block(-6, 26, 5, BRICK); block(6, 26, 5, BRICK);
// white emblem circle on cap front
cube(-2, 27, 5, 2, 29, 5, SNOW);
block(-3, 28, 5, SNOW); block(3, 28, 5, SNOW);
// red "M" on the emblem (z=6 plane)
line(-2, 27, 6, -2, 29, 6, BRICK);
line( 2, 27, 6,  2, 29, 6, BRICK);
block(-1, 28, 6, BRICK);
block( 0, 27, 6, BRICK);
block( 1, 28, 6, BRICK);

// ============================================================
// PROP 1 — GREEN WARP PIPE (right side)
// ============================================================
cube(12, 0, -2, 17, 10, 3, LEAVES);   // shaft
cube(11, 10, -3, 18, 12, 4, LEAVES);  // wide rim
cube(13, 3, -1, 16, 12, 2, AIR);      // hollow mouth
cube(12, 12, -2, 17, 12, 3, LEAVES);  // rim top edge back
// dark inner lip
cube(13, 12, -1, 16, 12, 2, AIR);

// ============================================================
// PROP 2 — "?" QUESTION BLOCK (floating, left)
// ============================================================
cube(-14, 14, -2, -9, 19, 3, SAND);
// corner rivets (brown)
block(-14,14,4,OAK_LOG); block(-9,14,4,OAK_LOG);
block(-14,19,4,OAK_LOG); block(-9,19,4,OAK_LOG);
// "?" mark in brown on front (z=4)
line(-13, 18, 4, -10, 18, 4, OAK_LOG);   // top bar
block(-10, 17, 4, OAK_LOG);              // right hook
block(-11, 16, 4, OAK_LOG);              // curve in
block(-11, 15, 4, OAK_LOG);              // stem
block(-11, 13, 4, OAK_LOG);              // dot (below)

// ============================================================
// PROP 3 — SUPER MUSHROOM (far left, on ground)
// ============================================================
cube(-17, 0, 0, -13, 6, 2, PLANKS);      // stem
block(-16, 4, 3, OAK_LOG);               // eyes
block(-14, 4, 3, OAK_LOG);
sphere(-15, 7, 1, 4, BRICK);             // red cap
cube(-20, -1, -4, -11, 6, 6, AIR);       // flatten cap bottom
// white spots on cap
block(-15, 9, 1, SNOW); block(-15, 9, 2, SNOW);
block(-18, 7, 1, SNOW); block(-12, 7, 1, SNOW);
block(-16, 8, 4, SNOW); block(-14, 8, 4, SNOW);

// ============================================================
// FLOATING COINS (yellow) — small arc above
// ============================================================
cube(-6, 31, 0, -5, 32, 0, SAND);
cube(-1, 33, 0,  0, 33, 0, SAND);
cube( 5, 31, 0,  6, 32, 0, SAND);

// ---- Classic brick ground strip behind the scene ----
cube(-20, -1, -6, 20, 0, -5, BRICK);