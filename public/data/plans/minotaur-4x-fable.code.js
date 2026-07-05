// minotaur-4x-fable — prompt:
// a minotaur...

// MINOTAUR — guardian of a ruined labyrinth gate.
// Facing -Z. Fur = OAK_LOG with DIRT mane/shading, muzzle/muscle = PLANKS,
// horns/bones = SNOW, loincloth = BRICK, ruins = COBBLE/STONE, eyes = glowing BRICK.

function mcube(x1,y1,z1,x2,y2,z2,id){ cube(x1,y1,z1,x2,y2,z2,id); cube(-x2,y1,z1,-x1,y2,z2,id); }
function mblock(x,y,z,id){ block(x,y,z,id); block(-x,y,z,id); }

// ---- clear vegetation in the build zone (trees top out ~y8 here) ----
cube(-12,1,-9,12,9,9,AIR);
cube(-17,1,9,17,9,14,AIR);

// ---- ruined plaza floor ----
cube(-9,0,-9,9,0,9,STONE);
cube(-6,-1,-6,6,-1,6,STONE);           // underfill so center never floats
cube(-9,0,-9,9,0,-9,COBBLE);           // border
cube(-9,0,9,9,0,9,COBBLE);
cube(-9,0,-8,-9,0,8,COBBLE);
cube(9,0,-8,9,0,8,COBBLE);
for(let x=-9;x<=9;x++)for(let z=-9;z<=9;z++){
  if(((x*11+z*7+x*z+1000)%6)===0) block(x,0,z,COBBLE);   // worn patches
}
block(-7,0,4,DIRT); block(-6,0,5,DIRT); block(5,0,6,DIRT); block(7,0,-2,DIRT); // cracks

// ---- legs (staggered stance, cloven hooves) ----
cube(3,1,-3,5,2,0,STONE);  block(4,1,-3,AIR); block(4,2,-3,AIR);   // right hoof forward
cube(-5,1,-1,-3,2,2,STONE); block(-4,1,-1,AIR); block(-4,2,-1,AIR); // left hoof back
cube(3,3,-2,5,7,0,OAK_LOG);
cube(-5,3,0,-3,7,2,OAK_LOG);
cube(3,3,-2,5,3,0,DIRT);   cube(-5,3,0,-3,3,2,DIRT);               // fetlock fur
cube(3,8,-1,6,12,2,OAK_LOG);
cube(-6,8,-1,-3,12,2,OAK_LOG);

// ---- pelvis + loincloth + belt ----
cube(-5,12,-1,5,14,2,OAK_LOG);
cube(-3,9,-2,3,13,-2,BRICK);           // front cloth
cube(-3,9,3,3,13,3,BRICK);             // back cloth
mcube(6,10,-1,6,13,2,BRICK);           // side tassets
cube(-5,14,-2,5,14,-2,COBBLE);         // belt
cube(-5,14,3,5,14,3,COBBLE);
block(0,14,-2,SNOW);                   // buckle

// ---- torso ----
cube(-4,15,-1,4,17,2,OAK_LOG);                       // waist
cube(-2,14,-2,2,17,-2,PLANKS);                       // abs plate
cube(0,14,-2,0,17,-2,OAK_LOG); cube(-2,16,-2,2,16,-2,OAK_LOG); // ab definition
cube(-6,18,-2,6,22,3,OAK_LOG);                       // massive chest
cube(-5,18,-3,-1,21,-3,PLANKS); cube(1,18,-3,5,21,-3,PLANKS);  // pecs
cube(0,18,-2,0,21,-2,DIRT);                          // chest cleft shadow
cube(-8,22,-2,8,22,2,OAK_LOG);                       // shoulder slab
cube(-8,23,-2,8,23,2,DIRT);                          // dark mane across shoulders
sphere(8,23,0,2,OAK_LOG); sphere(-8,23,0,2,OAK_LOG); // deltoids
cube(-2,15,3,2,17,3,DIRT);                           // mane anchor
cube(-2,15,4,2,24,4,DIRT);                           // mane ridge down the back

// ---- left arm: hanging, clenched fist ----
cube(-10,17,-1,-8,22,1,OAK_LOG);
cube(-10,14,-2,-8,17,0,COBBLE);        // bracer
cube(-10,11,-3,-8,13,-1,PLANKS);       // fist
block(-9,12,-4,STONE);                 // knuckle spike

// ---- right arm: raised, gripping the great labrys ----
cube(8,21,-1,10,24,1,OAK_LOG);         // upper arm
cube(11,24,-1,13,27,1,OAK_LOG);        // forearm up
cube(11,24,-1,13,25,1,COBBLE);         // bracer
cube(12,27,-1,14,29,1,PLANKS);         // fist
cube(13,19,0,13,32,0,OAK_LOG);         // haft
cube(9,30,-1,12,32,0,STONE);           // left blade
cube(8,30,-1,8,32,0,SNOW);             // honed edge
cube(14,30,-1,17,32,0,STONE);          // right blade
cube(18,30,-1,18,32,0,SNOW);
block(8,32,-1,AIR); block(8,32,0,AIR); // taper the edges
block(18,32,-1,AIR); block(18,32,0,AIR);

// ---- bull head ----
cube(-2,23,-2,2,24,1,OAK_LOG);         // neck
cube(-3,25,-3,3,30,2,OAK_LOG);         // skull
cube(-2,25,-6,2,27,-4,PLANKS);         // muzzle
mblock(1,25,-6,DIRT);                  // nostrils
block(0,24,-5,COBBLE);                 // nose ring
mblock(2,28,-4,BRICK);                 // glowing red eyes
cube(-3,29,-4,3,29,-4,DIRT);           // heavy brow
cube(-3,30,-3,3,30,-1,DIRT);           // forelock tuft
mcube(4,27,1,5,27,1,OAK_LOG);          // ears
cube(-1,25,2,1,30,2,DIRT);             // mane up the back of the skull
mcube(4,28,-1,5,29,0,SNOW);            // horns: base
mcube(6,29,-1,6,31,0,SNOW);            //   sweep up
mblock(6,32,0,SNOW);                   //   tips

// ---- tail ----
block(0,13,4,OAK_LOG); block(0,12,5,OAK_LOG); block(0,11,5,OAK_LOG);
block(0,10,6,OAK_LOG); block(0,9,6,OAK_LOG);
block(0,8,6,DIRT); block(0,7,6,DIRT);  // tuft

// ---- fur speckling ----
block(6,19,0,DIRT); block(6,21,-2,DIRT); block(-6,18,1,DIRT); block(-6,20,-1,DIRT);
block(6,9,0,DIRT); block(-6,11,1,DIRT); block(4,16,0,DIRT); block(-4,15,1,DIRT);
block(5,12,2,DIRT); block(-5,10,-1,DIRT);

// ---- broken labyrinth gate behind ----
mcube(6,0,10,8,12,12,COBBLE);          // columns
mcube(5,12,9,9,13,13,STONE);           // capitals
cube(-9,14,10,-1,15,12,STONE);         // lintel, left half intact
cube(3,14,10,9,14,12,STONE);           // right half sagging
block(4,14,11,STONE);
cube(0,0,10,2,1,11,STONE); block(1,2,10,STONE); block(3,0,11,COBBLE); // collapsed rubble
mblock(7,7,9,OAK_LOG); mblock(7,8,9,BRICK);   // torches on the columns
block(-7,6,10,AIR); block(7,9,10,AIR); block(-6,10,10,AIR);           // weathering

// ---- crumbling maze walls running off both sides ----
cube(-16,0,11,-9,4,11,COBBLE);
block(-15,4,11,AIR); block(-14,4,11,AIR); block(-12,4,11,AIR);
block(-12,3,11,AIR); block(-10,4,11,AIR);
cube(9,0,11,16,2,11,COBBLE);
cube(15,3,11,16,4,11,COBBLE);
block(10,2,11,AIR); block(12,2,11,AIR);

// ---- toppled columns in the foreground ----
cylinder(-9,1,-7,1,3,STONE); block(-9,4,-7,STONE);
cube(-6,1,-7,-3,2,-6,STONE);           // fallen drum
cylinder(9,1,-7,1,2,COBBLE);
cube(10,1,-5,12,2,-4,COBBLE);

// ---- bones of the fallen ----
block(-4,1,-6,SNOW); block(-3,1,-6,SNOW); block(-3,1,-7,SNOW);
block(2,1,-7,SNOW); block(3,1,-7,SNOW);
block(5,1,-4,SNOW); block(5,1,-3,SNOW);
block(-6,1,-2,SNOW); block(-6,1,-1,SNOW);
cube(6,1,-6,7,1,-5,SNOW); block(6,2,-6,SNOW);  // a victim's skull