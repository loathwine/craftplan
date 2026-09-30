// bowser-sonnet — prompt:
// Bowser...

// ===== BOWSER =====
// Facing north (-Z). Center X=0. Plaza foundation, then feet -> legs -> torso/shell -> arms -> tail -> head -> details.

// --- Foundation plaza (flat footing regardless of terrain) ---
cube(-12,-1,-8,12,-1,14, STONE);
cube(-12,0,-8,12,29,14, AIR); // clear any trees/foliage in the build footprint

// --- Ground detail: scorch marks from breath, rubble, coins ---
block(-1,-1,-8, BLACK); block(0,-1,-9, BLACK); block(1,-1,-8, BLACK);
block(-2,-1,-9, BLACK); block(2,-1,-9, BLACK);
block(-9,-1,-3, COBBLE); block(-10,-1,-2, COBBLE); block(9,-1,-3, COBBLE); block(10,-1,-2, COBBLE);
block(-8,-1,10, BRICK); block(-8,-1,11, BRICK); block(-9,-1,11, BRICK);
block(6,-1,9, GOLD); block(7,-1,10, GOLD); block(5,-1,10, GOLD);

// --- Feet (cream/tan) ---
cube(-8,0,-3,-4,2,2, SAND);
cube(4,0,-3,8,2,2, SAND);
// toe claws
block(-7,0,-4, WHITE); block(-6,0,-4, WHITE); block(-5,0,-4, WHITE);
block(5,0,-4, WHITE); block(6,0,-4, WHITE); block(7,0,-4, WHITE);

// --- Legs (green) ---
cube(-7,2,-1,-5,8,2, GREEN);
cube(5,2,-1,7,8,2, GREEN);
// ankle spike cuffs
block(-8,3,0, WHITE); block(-4,3,0, WHITE); block(-6,3,-2, WHITE); block(-6,3,3, WHITE);
block(8,3,0, WHITE); block(4,3,0, WHITE); block(6,3,-2, WHITE); block(6,3,3, WHITE);

// --- Torso: cream belly front, green shell back ---
cube(-7,8,-2,7,15,1, SAND);          // belly
cube(-9,7,2,9,17,6, GREEN);          // back/shell base
// belly-shell seam trim
line(-7,15,-1,7,15,-1, WHITE);
line(-7,8,-1,-7,15,-1, WHITE);
line(7,8,-1,7,15,-1, WHITE);
// shell segment dividers (dark plate lines)
line(-9,7,3,9,7,3, BLACK);
line(-9,12,3,9,12,3, BLACK);
line(-9,17,3,9,17,3, BLACK);
line(-9,7,6,9,17,6, BLACK);

// --- Shell spikes (ridge down the back, tallest near shoulders, tapering toward tail) ---
function spike(x,y,z,h){ cube(x,y,z,x,y+h,z, WHITE); }
spike(-8,17,3,2); spike(-4,17,4,3); spike(0,17,5,3); spike(4,17,4,3); spike(8,17,3,2);
spike(-6,17,2,2); spike(6,17,2,2);

// --- Arms (green), attached at torso sides ---
cube(-12,10,-1,-9,15,2, GREEN);
cube(9,10,-1,12,15,2, GREEN);
// wristband spike cuffs
block(-12,11,0, WHITE); block(-12,11,2, WHITE); block(-13,11,1, WHITE);
block(12,11,0, WHITE); block(12,11,2, WHITE); block(13,11,1, WHITE);
// hands + claws
cube(-14,9,-1,-13,11,1, SAND);
cube(13,9,-1,14,11,1, SAND);
block(-15,10,-2, WHITE); block(-15,9,-1, WHITE); block(-15,11,0, WHITE);
block(15,10,-2, WHITE); block(15,9,-1, WHITE); block(15,11,0, WHITE);

// --- Tail (tapering, spiked tip) ---
cube(-2,9,6,2,11,9, GREEN);
cube(-1,9,9,1,10,12, GREEN);
cube(0,9,12,0,10,14, GREEN);
sphere(0,10,15,2, WHITE);
block(0,10,17, WHITE);

// --- Head ---
cube(-6,17,-2,6,23,3, GREEN);        // skull
cube(-5,17,-6,5,19,-1, SAND);        // snout/jaw
line(-5,19,-6,5,19,-1, WHITE);       // jaw trim

// horns
cube(-5,23,0,-4,25,0, WHITE); block(-5,26,0, WHITE);
cube(4,23,0,5,25,0, WHITE); block(4,26,0, WHITE);

// eyebrows (red, spiky)
cube(-5,21,-3,-2,21,-3, RED); block(-5,22,-3, RED); block(-2,22,-3, RED);
cube(2,21,-3,5,21,-3, RED); block(5,22,-3, RED); block(2,22,-3, RED);

// eyes
cube(-4,19,-3,-3,20,-3, WHITE); block(-4,19,-4, NEON_RED);
cube(3,19,-3,4,20,-3, WHITE); block(3,19,-4, NEON_RED);

// nostrils
block(-2,18,-7, BLACK); block(2,18,-7, BLACK);

// hair tuft between horns
block(-1,26,1, RED); block(0,27,1, RED); block(1,26,1, RED);

// mouth: carve opening, add teeth + interior
cube(-4,17,-6,4,18,-6, AIR);
line(-4,18,-6,4,18,-6, WHITE);   // upper teeth
line(-4,17,-6,4,17,-6, WHITE);   // lower teeth
block(-4,18,-6, WHITE); block(4,18,-6, WHITE); // fangs poke down/up bigger
cube(-3,17,-5,3,18,-5, RED);     // mouth interior

// breath fire (sparse, arcing forward from mouth)
block(-1,18,-8, FIRE); block(1,18,-8, FIRE); block(0,18,-9, FIRE);
block(-2,17,-9, FIRE); block(2,17,-9, FIRE); block(0,17,-10, FIRE);
block(-1,19,-9, FIRE); block(1,19,-9, FIRE);