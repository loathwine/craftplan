// knight-4x-opus — prompt:
// knight...

// KNIGHT — a towering armored warrior statue, sword raised, shield ready,
// flanked by banners and backed by a crenellated castle wall.

const METAL = STONE;   // dark steel plate
const PLATE = COBBLE;  // lighter fittings / trim
const RED   = BRICK;   // heraldry, plume, cape
const STEEL = SNOW;    // bright polished blade

// ---------- BACKGROUND: castle wall + towers + banners ----------
cube(-20,-1,-9, 20,10,-9, METAL);            // curtain wall
for (let x=-20; x<=19; x+=3) cube(x,11,-9, x+1,12,-9, PLATE); // merlons
cube(-19,3,-9, -18,7,-9, AIR);               // arrow slit
cube(18,3,-9, 19,7,-9, AIR);

// corner towers
function tower(cx){
  cube(cx-2,-1,-12, cx+2,17,-8, METAL);
  for (let a=-2; a<=1; a+=2) cube(cx+a,18,-11, cx+a+1,19,-9, PLATE);
  cube(cx-1,10,-8, cx+1,13,-8, AIR);         // window opening
  cube(cx-1,10,-8, cx+1,13,-8, GLASS);
  cube(cx-3,-1,-12, cx+3,0,-8, PLATE);       // footing
}
tower(-20); tower(20);

// banner poles + hanging cloth
function banner(px, dir){
  cube(px,1,-8, px,23,-8, OAK_LOG);
  cube(px,23,-8, px+3*dir,23,-8, OAK_LOG);   // crossbar
  const x1 = Math.min(px, px+4*dir), x2 = Math.max(px, px+4*dir);
  cube(x1,9,-8, x2,22,-8, RED);
  cube(x1+1,17,-7, x2-1,18,-7, STEEL);       // white stripe emblem
  cube((x1+x2)>>1,11,-7, (x1+x2)>>1,20,-7, STEEL);
  for (let x=x1; x<=x2; x++) if ((x^px)&1) block(x,8,-8, RED); // frayed hem
}
banner(-15,-1); banner(15,1);

// ---------- PEDESTAL ----------
cube(-9,-2,-9, 9,-2,9, PLATE);
cube(-8,-1,-8, 8,-1,8, METAL);
cube(-7, 0,-7, 7, 0,7, PLATE);
for (let s=-7; s<=7; s+=7){ cube(s-1,1,s>0?6:-7, s+1,3,s>0?7:-6, METAL); } // corner nubs
cube(-6,0,-6, 6,0,6, METAL);                 // dark stage top

// ---------- CAPE (flowing behind) ----------
for (let y=2; y<=19; y++){
  const half = 5 + Math.floor((19-y)/4);
  cube(-half,y,-4, half,y,-4, RED);
  if (y < 12) cube(-half+1,y,-5, half-1,y,-5, RED); // deeper fold at hem
}

// ---------- LEGS ----------
function leg(sx){                              // sx = ±1 side sign
  const x1 = sx>0 ? 1 : -4, x2 = sx>0 ? 4 : -1;
  cube(x1,1,-2, x2,9,2, METAL);               // greave
  cube(x1,5,3, x2,6,3, PLATE);                // knee cop
  cube(x1,1,3, x2,2,5, PLATE);                // sabaton (foot)
  cube(x1,1,-2, x2,1,2, PLATE);               // ankle trim
}
leg(-1); leg(1);
cube(-4,8,-2, 4,10,2, PLATE);                  // tasset skirt over hips

// ---------- TORSO / BREASTPLATE ----------
cube(-5,10,-3, 5,17,3, METAL);
cube(-5,9,-3, 5,10,4, PLATE);                  // belt
block(0,9,4, RED); block(0,9,5, RED);          // buckle jewel
cube(0,10,3, 0,17,3, PLATE);                   // sternum ridge
// heraldic cross on chest (proud, Z=4)
cube(0,11,4, 0,16,4, RED);
cube(-2,14,4, 2,14,4, RED);
// rivets
for (let y=11; y<=16; y+=2){ block(-4,y,3, PLATE); block(4,y,3, PLATE); }

// neck + gorget
cube(-2,18,-2, 2,19,2, METAL);

// ---------- SHOULDERS / PAULDRONS ----------
cube(-8,16,-3, -5,19,3, PLATE);                // left pauldron
cube(5,16,-3, 8,19,3, PLATE);                  // right pauldron
block(-8,20,0, PLATE); block(8,20,0, PLATE);   // shoulder studs
cube(-8,16,4, -6,18,4, STEEL);                 // pauldron edge highlight
cube(6,16,4, 8,18,4, STEEL);

// ---------- LEFT ARM + SHIELD ----------
cube(-8,10,-1, -6,17,1, METAL);                // arm hanging at side
// heater shield, center X=-9, tapering to a point
for (let y=8; y<=18; y++){
  const half = y>=12 ? 3 : (y-8);
  cube(-9-half,y,4, -9+half,y,4, PLATE);
  block(-9-half,y,4, STEEL); block(-9+half,y,4, STEEL); // steel rim
}
cube(-9,10,5, -9,17,5, RED);                   // shield cross vertical
cube(-11,14,5, -7,14,5, RED);                  // shield cross horizontal
block(-9,15,6, STEEL);                         // central boss

// ---------- RIGHT ARM RAISED + SWORD ----------
cube(6,15,-1, 8,19,1, METAL);                  // upper arm
cube(6,18,-1, 8,24,1, METAL);                  // forearm raised skyward
cube(6,22,0, 8,25,1, PLATE);                   // gauntlet grip
// sword
cube(4,25,0, 10,25,1, PLATE);                  // crossguard
block(7,23,0, PLATE); block(7,23,1, PLATE);    // pommel
for (let y=26; y<=32; y++) cube(6,y,0, 8,y,1, STEEL); // blade body
cube(7,33,0, 7,34,1, STEEL);                   // blade tip (point)
cube(7,26,1, 7,32,1, PLATE);                   // fuller down the blade

// ---------- HEAD / GREAT HELM ----------
cube(-3,19,-3, 3,24,3, METAL);
cube(-2,24,-2, 2,25,2, METAL);                 // domed top
cube(-2,21,2, 2,21,3, AIR);                    // eye slit
block(-1,20,3, AIR); block(1,20,3, AIR);       // breathing holes
cube(-3,19,3, 3,19,3, PLATE);                  // brow band
block(0,23,3, PLATE);                          // nasal ridge

// ---------- PLUME / CREST ----------
cube(0,25,-3, 0,28,3, RED);                    // tall fin along the crown
cube(0,28,-2, 0,29,2, RED);
cube(0,29,-1, 0,30,1, RED);
cube(-1,25,-4, 0,27,-6, RED);                  // trailing tail
block(0,31,0, RED);