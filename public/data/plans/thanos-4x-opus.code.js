// thanos-4x-opus — prompt:
// Thanos...

const SKIN  = COBBLE;   // grayish-purple Titan flesh
const SHADE = STONE;    // grooves, sockets, shadow
const ARMOR = GLASS;    // blue battle armor
const GOLD  = SAND;     // gold trim / Infinity Gauntlet
const CAPE  = STONE;    // dark flowing cape

function cubeSym(x1,y1,z1,x2,y2,z2,id){
  cube(x1,y1,z1,x2,y2,z2,id);
  cube(-x2,y1,z1,-x1,y2,z2,id);
}
function blockSym(x,y,z,id){ block(x,y,z,id); block(-x,y,z,id); }

// ---------- clear stray forest inside the build volume (leave ground) ----------
cube(-15,1,-9,15,34,9,AIR);

// ---------- deep foundation + rocky dais (feet stand at y=1) ----------
cube(-12,-6,-10,12,-1,10,STONE);
cube(-11,-1,-9,11,-1,9,COBBLE);
cube(-9,0,-7,9,0,7,STONE);
hollowCube(-10,-1,-8,10,0,8,COBBLE);
// scattered rubble on the dais for foreground detail / asymmetry
block(-8,1,-6,COBBLE); block(-7,1,-5,STONE); block(7,1,-6,COBBLE);
block(8,1,4,STONE); block(-8,1,5,COBBLE); block(6,1,6,STONE);
block(-6,1,7,COBBLE); block(9,2,-7,STONE); block(-9,1,-3,STONE);

// ================= LEGS =================
// heavy boots (gold)
cubeSym(2,1,-3,5,3,4,GOLD);
blockSym(3,1,-4,SHADE);            // boot toe shadow
// blue greaves
cubeSym(2,3,-3,5,9,3,ARMOR);
// gold knee guards
cubeSym(2,6,-4,5,6,3,GOLD);
// thigh shading between plates
cubeSym(2,7,-3,2,9,-3,SHADE);

// ================= PELVIS / BELT =================
cube(-5,9,-3,5,12,3,ARMOR);
cube(-6,11,-4,6,12,4,GOLD);        // wide gold belt
cube(-1,9,-4,1,11,-3,GOLD);        // groin guard
block(0,11,-5,SHADE);              // belt buckle recess

// ================= TORSO =================
cube(-6,12,-3,6,19,3,ARMOR);       // core
cube(-5,15,-4,5,18,-4,ARMOR);      // chest bulge
cube(-1,12,-4,1,18,-4,GOLD);       // central gold sternum stripe
cube(-6,18,-4,6,19,-3,GOLD);       // gold collar
// armored ab / pectoral seams
line(-5,17,-4,5,17,-4,SHADE);
line(-5,14,-4,5,14,-4,SHADE);
blockSym(3,15,-5,GOLD);            // pectoral studs
// broad shoulders
cube(-8,19,-3,8,21,3,ARMOR);
line(-8,20,-4,8,20,-4,GOLD);       // gold shoulder band

// ================= PAULDRONS (big gold shoulder guards) =================
sphere(-8,20,0,3,GOLD);
sphere(8,20,0,3,GOLD);
// menacing spikes on top
blockSym(8,23,-1,SHADE); blockSym(8,24,-1,SHADE);
blockSym(9,22,0,GOLD);   blockSym(6,22,0,GOLD);

// ================= CAPE (dark, behind, flaring) =================
cube(-7,3,4,7,20,5,CAPE);
cube(-9,3,5,9,10,6,CAPE);          // lower flare
line(-7,3,6,-9,3,6,COBBLE);        // torn hem
line(7,3,6,9,3,6,COBBLE);
line(0,3,7,0,8,7,SHADE);           // center fold
hollowCube(-7,4,4,7,19,5,COBBLE);  // cloth edge trim

// ================= NECK =================
cube(-2,21,-1,2,22,2,SKIN);
blockSym(2,21,0,SHADE);            // neck cord shadow

// ================= HEAD =================
cube(-4,22,-2,4,29,3,SKIN);        // skull core
cube(-3,29,-1,3,30,2,SKIN);        // crown
// round off top corners
block(-4,29,-2,AIR); block(4,29,-2,AIR);
block(-4,29,3,AIR);  block(4,29,3,AIR);
// heavy square jaw + jutting chin
cube(-3,21,-4,3,23,-3,SKIN);
// vertical chin ridges (Thanos's clefted chin) on the front face
for (let x=-3;x<=3;x++){
  block(x,21,-4,(x%2===0)?SHADE:SKIN);
  block(x,22,-4,(x%2===0)?SHADE:SKIN);
}
block(-1,21,-5,SKIN); block(1,21,-5,SKIN);   // ridge tips forward
// grim mouth
line(-2,24,-3,2,24,-3,SHADE);
blockSym(2,23,-3,SHADE);           // frown corners down
// flat wide nose
block(0,25,-4,SKIN); block(0,26,-4,SKIN);
blockSym(1,25,-4,SHADE);           // nostrils
// deep-set glowing eyes under a heavy brow
block(-2,26,-3,ICE); block(2,26,-3,ICE);
block(-3,26,-3,SHADE); block(-1,26,-3,SHADE);
block(1,26,-3,SHADE);  block(3,26,-3,SHADE);
cube(-4,27,-3,4,27,-2,SKIN);       // protruding brow ridge
line(-4,27,-4,4,27,-4,SHADE);      // brow edge shadow
// cheekbones
blockSym(4,25,-1,SKIN); blockSym(4,24,-2,SHADE);
// ears
cubeSym(4,25,0,4,26,1,SKIN);

// ================= RIGHT ARM (his right, at side, clenched) =================
cube(8,13,-3,11,19,3,ARMOR);       // armored upper arm
line(8,16,-4,11,16,-4,GOLD);       // vambrace band
cube(9,7,-4,12,14,3,SKIN);         // forearm
cube(9,4,-4,12,7,3,SKIN);          // clenched fist
line(9,7,-4,12,7,-4,SHADE);        // knuckles
blockSym(0,0,0,AIR);               // (noop guard)
block(10,6,-5,SHADE); block(11,6,-5,SHADE);

// ================= LEFT ARM RAISED — THE INFINITY GAUNTLET =================
cube(-11,19,-3,-8,24,3,ARMOR);     // upper arm, angled up/out
line(-11,22,-4,-8,22,-4,GOLD);     // arm band
cube(-12,24,-3,-9,30,3,SKIN);      // forearm rising
line(-12,27,-4,-9,27,-4,SHADE);    // wrist wrinkle
// the great gauntlet fist (gold)
cube(-13,30,-4,-8,33,4,GOLD);
hollowCube(-13,30,-4,-8,33,4,SHADE); // seam definition
cube(-13,30,-4,-8,33,-4,GOLD);       // solid front knuckle face
// curled gold fingers over the top
for (let x=-13;x<=-8;x++){ block(x,33,-4,GOLD); block(x,33,-3,SHADE); }
// the six Infinity Stones, blazing on the knuckles
block(-12,32,-5,GLASS);   // Space
block(-11,32,-5,BRICK);   // Reality
block(-10,32,-5,LEAVES);  // Time
block(-9,32,-5,ICE);      // (power)
block(-11,33,-4,SNOW);    // Mind
block(-10,33,-4,COBBLE);  // Soul
// gauntlet glow spilling up
block(-11,34,-4,SNOW); block(-10,34,-4,SNOW);