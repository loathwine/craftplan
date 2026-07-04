// mario-4x-fable — prompt:
// Super Mario...

// Super Mario — classic pose with raised fist, plus pipe, piranha plant,
// ? blocks, coins, goomba and super mushroom.

// --- clear tree canopies around the build (AIR is free) ---
cube(-11,1,-8,11,31,9,AIR);      // around Mario
cube(8,1,6,19,12,18,AIR);        // around pipe + mushroom
cube(-12,1,10,-4,9,18,AIR);      // around goomba
// remove visible trunk stubs near the figure
block(0,0,1,AIR); block(8,0,3,AIR); block(4,0,-3,AIR);
block(7,0,-2,AIR); block(8,0,-1,AIR);

// ================= MARIO =================
// shoes (brown)
cube(-7,0,0,-2,1,5,OAK_LOG);
cube(2,0,0,7,1,5,OAK_LOG);

// legs — blue overalls
cube(-5,2,-1,-2,7,3,GLASS);
cube(2,2,-1,5,7,3,GLASS);

// lower torso — overalls
cube(-6,8,-2,6,12,3,GLASS);

// upper torso — red shirt
cube(-6,13,-2,6,16,3,BRICK);
// overall bib + straps on the front
cube(-3,13,3,3,15,3,GLASS);
block(-3,16,3,GLASS); block(3,16,3,GLASS);
// gold buttons
block(-2,15,4,SAND); block(2,15,4,SAND);

// left arm raised in a fist pump (red sleeve, white glove)
cube(-9,14,-1,-7,17,1,BRICK);
cube(-9,18,-1,-7,21,1,BRICK);
cube(-10,22,-1,-7,24,2,SNOW);
// right arm down at side
cube(7,10,-1,9,16,1,BRICK);
cube(7,7,-1,9,9,1,SNOW);

// head (skin)
cube(-5,17,-3,5,26,3,SAND);
// hair at the back
cube(-5,18,-4,5,22,-4,OAK_LOG);
// sideburns
cube(-5,19,-2,-5,22,0,OAK_LOG);
cube(5,19,-2,5,22,0,OAK_LOG);
// ears
block(-6,20,0,SAND); block(-6,21,0,SAND);
block(6,20,0,SAND);  block(6,21,0,SAND);
// eyes (white with blue pupils) + brows
cube(-3,22,3,-2,23,3,SNOW);
cube(2,22,3,3,23,3,SNOW);
block(-2,22,3,GLASS); block(2,22,3,GLASS);
cube(-4,24,3,-2,24,3,OAK_LOG);
cube(2,24,3,4,24,3,OAK_LOG);
// big nose
cube(-1,20,4,1,21,5,SAND);
// mustache
cube(-3,19,4,3,19,4,OAK_LOG);
block(-4,20,4,OAK_LOG); block(4,20,4,OAK_LOG);

// red cap
cube(-5,25,-4,5,27,3,BRICK);
cube(-4,28,-3,4,28,2,BRICK);
cube(-4,25,4,4,25,7,BRICK);      // brim
cube(-1,26,3,1,27,3,SNOW);       // white emblem patch

// ================= WARP PIPE + PIRANHA PLANT =================
cylinder(15,0,8,3,6,LEAVES);     // pipe body
cylinder(15,6,8,4,2,LEAVES);     // rim
cylinder(15,7,8,2,3,AIR);        // dark opening
line(15,7,8,15,11,8,LEAVES);     // stem
block(14,9,8,LEAVES); block(16,9,8,LEAVES);   // stem leaves
sphere(15,13,8,2,BRICK);         // piranha head
block(14,14,9,SNOW); block(16,14,9,SNOW);     // spots
block(15,14,10,SNOW);
disk(15,11,8,2,SNOW);            // white lips

// ================= FLOATING BLOCKS =================
// ? block (gold)
cube(-16,12,2,-12,16,6,SAND);
cube(-15,15,6,-13,15,6,SNOW);    // ? glyph
block(-13,14,6,SNOW); block(-14,13,6,SNOW); block(-14,12,6,SNOW);
block(-16,12,6,OAK_LOG); block(-12,12,6,OAK_LOG);
block(-16,16,6,OAK_LOG); block(-12,16,6,OAK_LOG);
// brick block
cube(-10,12,2,-6,16,6,BRICK);
// second ? block, higher
cube(-18,19,2,-14,22,6,SAND);
cube(-17,21,6,-15,21,6,SNOW);
block(-15,20,6,SNOW); block(-16,19,6,SNOW);
block(-18,19,6,OAK_LOG); block(-14,19,6,OAK_LOG);
block(-18,22,6,OAK_LOG); block(-14,22,6,OAK_LOG);
// coins popping out
cube(-15,18,4,-14,19,4,SAND);
cube(-9,18,4,-8,19,4,SAND);
cube(-17,24,4,-16,25,4,SAND);

// ================= GOOMBA =================
sphere(-8,3,14,3,OAK_LOG);       // head
cube(-10,0,13,-9,0,15,STONE);    // feet
cube(-7,0,13,-6,0,15,STONE);
block(-9,4,17,SNOW); block(-7,4,17,SNOW);     // angry eyes
block(-9,3,17,STONE); block(-7,3,17,STONE);

// ================= SUPER MUSHROOM =================
sphere(10,4,14,3,BRICK);         // red cap
block(10,7,14,SNOW); block(8,5,13,SNOW); block(12,5,13,SNOW);
block(10,5,16,SNOW); block(10,5,12,SNOW);     // white spots
cylinder(10,-1,14,2,3,SNOW);     // stalk
block(9,0,16,STONE); block(11,0,16,STONE);    // eyes