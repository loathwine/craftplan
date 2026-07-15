// trex-jeep-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Palette =====
const SKIN  = LEAVES;   // scaly green hide
const BELLY = DIRT;     // tan underbelly
const DARK  = COBBLE;   // dark ridge/stripes
const TOOTH = SNOW;     // teeth
const CLAW  = STONE;    // claws/eyes/horns

// ===================== JEEP (fleeing, north side) =====================
// wheels
cylinder(-18,0,-18,1,2,STONE);
cylinder(-10,0,-18,1,2,STONE);
cylinder(-18,0,-10,1,2,STONE);
cylinder(-10,0,-10,1,2,STONE);
block(-18,2,-18,COBBLE); block(-10,2,-18,COBBLE);
block(-18,2,-10,COBBLE); block(-10,2,-10,COBBLE);

cube(-18,1,-19,-10,1,-10,COBBLE);           // chassis floor
cube(-17,2,-19,-11,2,-16,COBBLE);           // hood
cube(-17,1,-20,-11,3,-20,STONE);            // grille
block(-16,2,-20,BRICK); block(-12,2,-20,BRICK); // headlights
cube(-18,0,-20,-10,0,-20,STONE);            // front bumper

cube(-17,2,-15,-11,4,-15,GLASS);            // windshield

cube(-17,2,-14,-11,2,-11,PLANKS);           // cab floor
block(-16,3,-13,OAK_LOG); block(-12,3,-13,OAK_LOG);       // seats
block(-16,4,-12,OAK_LOG); block(-12,4,-12,OAK_LOG);       // seat backs

cube(-18,1,-16,-18,3,-11,COBBLE);           // left side skirt
cube(-10,1,-16,-10,3,-11,COBBLE);           // right side skirt

cube(-17,3,-13,-17,6,-13,OAK_LOG);          // roll bar posts
cube(-11,3,-13,-11,6,-13,OAK_LOG);
cube(-17,3,-11,-17,6,-11,OAK_LOG);
cube(-11,3,-11,-11,6,-11,OAK_LOG);
line(-17,6,-13,-11,6,-13,OAK_LOG);
line(-17,6,-11,-11,6,-11,OAK_LOG);
line(-17,6,-13,-17,6,-11,OAK_LOG);
line(-11,6,-13,-11,6,-11,OAK_LOG);

cube(-18,1,-10,-18,3,-9,COBBLE);            // rear bed left
cube(-10,1,-10,-10,3,-9,COBBLE);            // rear bed right
cube(-18,1,-9,-10,3,-9,COBBLE);             // rear bed back wall
cube(-18,0,-9,-10,0,-9,STONE);              // rear bumper
block(-17,1,-9,BRICK); block(-11,1,-9,BRICK); // taillights
cylinder(-14,1,-9,1,2,STONE);               // spare tire

sphere(-14,0,-9,1,SAND);                    // dust kicked up by tires

// ===================== T-REX (chasing, south/east) =====================
// torso chain: chest -> mid torso -> hip
cube(2,7,-5,9,13,1,SKIN);      cube(3,7,-4,8,8,0,BELLY);     // chest + belly
cube(3,6,1,9,11,7,SKIN);       cube(4,6,2,8,7,6,BELLY);      // mid torso + belly
cube(3,5,7,9,10,13,SKIN);      cube(4,5,8,8,6,12,BELLY);     // hip + belly
cube(5,11,-5,7,12,13,DARK);                                  // dorsal ridge stripe
block(6,12,-3,DARK); block(6,13,2,DARK); block(6,13,7,DARK); // ridge spikes

// neck
cube(0,10,-9,5,15,-5,SKIN); cube(1,10,-8,4,11,-6,BELLY);
cube(-4,13,-13,2,17,-8,SKIN);

// head
cube(-8,14,-17,-2,19,-12,SKIN);          // skull
cube(-11,14,-21,-4,17,-16,SKIN);         // upper jaw / snout
cube(-11,10,-21,-4,12,-15,SKIN);         // lower jaw
cube(-10,13,-20,-5,13,-16,BRICK);        // palate / mouth interior
block(-10,13,-17,TOOTH); block(-8,13,-18,TOOTH); block(-6,13,-17,TOOTH);
block(-9,12,-17,TOOTH);  block(-7,12,-18,TOOTH); block(-5,12,-17,TOOTH);
block(-8,17,-14,CLAW); block(-2,17,-14,CLAW);    // eyes
block(-8,19,-15,CLAW); block(-2,19,-15,CLAW);    // brow horns

// tiny arms
cube(1,7,-3,2,9,-2,SKIN); block(1,6,-4,CLAW); block(2,6,-4,CLAW);
cube(9,7,-3,10,9,-2,SKIN); block(9,6,-4,CLAW); block(10,6,-4,CLAW);

// back leg (planted, stance/push-off), toes point north
cube(6,3,9,10,8,13,SKIN);
cube(7,0,9,10,4,13,SKIN);
cube(6,0,6,11,1,12,SKIN);
block(7,0,5,CLAW); block(9,0,5,CLAW); block(11,0,5,CLAW);
cube(6,2,10,10,2,12,DARK);

// front leg (striding forward toward the jeep)
cube(1,7,2,5,12,6,SKIN);
cube(0,2,-2,4,7,3,SKIN);
cube(-1,0,-5,4,1,1,SKIN);
block(-1,0,-6,CLAW); block(1,0,-6,CLAW); block(3,0,-6,CLAW);
cube(1,5,3,4,5,5,DARK);

// tail sweeping up and out for balance
cube(6,5,13,11,9,17,SKIN);
cube(9,5,17,14,8,20,SKIN);
cube(12,4,20,16,7,22,SKIN);
cube(14,4,22,17,6,22,SKIN);
cube(8,8,14,12,9,19,DARK);
cube(7,5,13,10,6,17,BELLY);

// dust at running feet
sphere(9,0,4,1,SAND);
sphere(9,0,14,1,SAND);
```
