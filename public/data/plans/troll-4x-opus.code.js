// troll-4x-opus — prompt:
// a troll under a bridge...

// ===== A TROLL UNDER A BRIDGE =====
// Camera looks SOUTH (+Z), so -Z is the lit FRONT. A massive stone arch bridge
// spans east-west (X); the archway tunnel runs north-south (Z). A hunched,
// warty troll crouches in the north mouth of the arch, leaning out into the
// light, one fist on the ground, the other gripping a planted knobby club.

const SKIN   = COBBLE;   // mottled gray-green troll hide
const BX1=-14, BX2=14;   // bridge span (X)
const BZ1=-3,  BZ2=3;    // bridge depth (Z)  -> tunnel walls
const DECKTOP=13;        // top of bridge mass
const SPRING=5;          // arch springline
const ARCH_R=6;          // arch radius
const OPEN=6;            // opening half-width

function archHalf(y){
  if (y<=SPRING) return OPEN;
  const dy=y-SPRING;
  const v=ARCH_R*ARCH_R-dy*dy;
  if (v<0) return -1;
  return Math.max(1, Math.round(Math.sqrt(v)));
}

// ---------------------------------------------------------------------------
// 0) Clear stray forest canopy over the footprint so the scene reads cleanly
// ---------------------------------------------------------------------------
cube(-20, 1, -13, 20, 24, 9, AIR);

// ---------------------------------------------------------------------------
// 1) River / stream approaching the bridge from the north (foreground)
// ---------------------------------------------------------------------------
cube(-6, 0, -12, 6, 0, -5, AIR);          // dig the channel
cube(-6,-1, -12, 6,-1, -5, GLASS);        // sunken water
cube(-6,-1,  4, 6,-1,  9, GLASS);         // stream continues south
cube(-6, 0,  4, 6, 0,  9, AIR);
// muddy banks framing the stream
cube(-9,0,-12,-7,0,-4, DIRT);
cube( 7,0,-12, 9,0,-4, DIRT);
line(-7,0,-12,-7,0,-4, GRASS);
line( 7,0,-12, 7,0,-4, GRASS);

// ---------------------------------------------------------------------------
// 2) Bridge solid mass + arch tunnel
// ---------------------------------------------------------------------------
cube(BX1,-3,BZ1, BX2,-1,BZ2, STONE);          // footings dug in
cube(BX1, 0,BZ1, BX2,DECKTOP,BZ2, STONE);     // the mass

// carve the tunnel (slab per Y level, straight through both mouths)
for (let y=0; y<=11; y++){
  const hw=archHalf(y);
  if (hw<0) continue;
  cube(-hw, y, BZ1-1, hw, y, BZ2+1, AIR);
}
// hollow the hidden abutment cores to lighten the mass
cube(BX1+2,1,BZ1+1,-OPEN-2,10,BZ2-1, AIR);
cube(OPEN+2,1,BZ1+1,BX2-2,10,BZ2-1, AIR);

// ---------------------------------------------------------------------------
// 3) Arch ring (cobble voussoirs) + keystone on the front face
// ---------------------------------------------------------------------------
let prev=OPEN;
for (let y=0; y<=11; y++){
  const hw=archHalf(y);
  if (hw<0) break;
  const lo=Math.min(hw,prev), hi=Math.max(hw,prev);
  // bridge the diagonal steps so the ring is continuous
  for (let x=lo; x<=hi+1; x++){
    block( x+1, y, BZ1, COBBLE);
    block(-x-1, y, BZ1, COBBLE);
  }
  prev=hw;
}
block(0,11,BZ1,BRICK); block(0,12,BZ1,BRICK);   // keystone
block(1,11,BZ1,COBBLE); block(-1,11,BZ1,COBBLE);

// ---------------------------------------------------------------------------
// 4) Front relief — pilasters flanking the arch and end piers, mossy patches
// ---------------------------------------------------------------------------
function pier(x){
  cube(x,0,BZ1-1, x+1,DECKTOP-1,BZ1-1, STONE);   // proud one block
  cube(x-0,DECKTOP-1,BZ1-1, x+1,DECKTOP,BZ1-1, COBBLE); // cap
}
pier(7); pier(-8); pier(12); pier(-13);
// scattered moss + hanging vines for age
[[-11,3],[10,2],[-4,9],[5,8],[9,6],[-10,7],[3,2],[-6,1]].forEach(([x,y])=>block(x,y,BZ1,COBBLE));
line(0,10,BZ1-1, 0,7,BZ1-1, LEAVES);      // vine dangling from crown
line(-3,10,BZ1-1,-3,8,BZ1-1, LEAVES);
line(3,10,BZ1-1,3,8,BZ1-1, LEAVES);

// ---------------------------------------------------------------------------
// 5) Deck: plank road + log railings (visible silhouette on top)
// ---------------------------------------------------------------------------
cube(BX1,DECKTOP,BZ1, BX2,DECKTOP,BZ2, PLANKS);
for (let x=-14; x<=14; x+=4){
  block(x,14,BZ1,OAK_LOG); block(x,15,BZ1,OAK_LOG);
  block(x,14,BZ2,OAK_LOG); block(x,15,BZ2,OAK_LOG);
}
line(BX1,15,BZ1, BX2,15,BZ1, OAK_LOG);
line(BX1,15,BZ2, BX2,15,BZ2, OAK_LOG);

// ===========================================================================
// 6) THE TROLL — hunched in the north mouth, leaning out into the light
// ===========================================================================

// haunches / crouched legs (gap in the middle)
cube(-4,0,-2,-1,3,2, SKIN);
cube( 1,0,-2, 4,3,2, SKIN);
// big flat feet jutting forward, three stubby toes each
cube(-4,0,-4,-1,1,-2, SKIN);
cube( 1,0,-4, 4,1,-2, SKIN);
[-4,-3,-1].forEach(x=>block(x,1,-4,STONE));   // toenails
[1,3,4].forEach(x=>block(x,1,-4,STONE));

// ragged hide loincloth around the waist
cube(-4,2,-3,4,3,3, DIRT);
block(-1,1,-3,DIRT); block(0,1,-3,DIRT); block(1,1,-3,DIRT);

// torso + sagging belly bulging forward
cube(-4,3,-1,4,7,3, SKIN);
sphere(0,4,-2,3, SKIN);
// hunched shoulders rising higher than the sunken neck
cube(-5,7,0,5,8,3, SKIN);

// head, sunk into the shoulders and thrust forward out of the arch
sphere(0,7,-2,3, SKIN);
// heavy brow ridge
cube(-3,8,-5,3,8,-4, COBBLE);
// deep-set glaring eyes with pupils
block(-2,7,-5,SNOW); block(-2,8,-5,SNOW);
block( 2,7,-5,SNOW); block( 2,8,-5,SNOW);
block(-2,7,-6,STONE); block(2,7,-6,STONE);
// big red bulbous nose
block(0,6,-6,BRICK); block(0,6,-7,BRICK); block(0,5,-6,BRICK); block(0,7,-6,BRICK);
// jutting jaw with an underbite of tusks
cube(-3,3,-5,3,4,-4, SKIN);
[-2,2].forEach(x=>{ block(x,4,-5,SNOW); block(x,5,-5,SNOW); }); // up-tusks
[-1,0,1].forEach(x=>block(x,5,-5,SNOW));                        // upper teeth
// floppy pointed ears
cube(-5,7,-2,-4,8,0, SKIN); block(-5,9,-1,SKIN);
cube( 4,7,-2, 5,8,0, SKIN); block( 5,9,-1,SKIN);
// warts
[[-3,5,-3],[3,4,-2],[-2,3,-4],[2,6,-4],[0,3,-4]].forEach(([x,y,z])=>block(x,y,z,STONE));

// LEFT arm — knuckle-dragging fist planted on the ground (troll's -X side)
cube(-6,4,-1,-4,6,2, SKIN);      // upper arm from shoulder
cube(-7,1,-4,-5,4,-1, SKIN);     // forearm reaching down-forward
sphere(-6,1,-3,1, SKIN);         // big fist
[-7,-6,-5].forEach(x=>block(x,2,-4,SKIN)); // knuckles

// RIGHT arm — gripping a planted knobby club (troll's +X side)
cube(4,4,-1,6,6,2, SKIN);        // upper arm
cube(5,3,-3,6,5,-2, SKIN);       // forearm down to grip
// the club: gnarled trunk planted in the ground, knobby head up top
cube(6,0,-3,6,7,-3, OAK_LOG);
cube(6,0,-2,6,6,-2, OAK_LOG);
sphere(6,8,-3,2, OAK_LOG);       // knobby head
block(7,6,-3,OAK_LOG); block(5,4,-3,OAK_LOG);
sphere(6,5,-3,1, SKIN);          // fist wrapped around the club

// ---------------------------------------------------------------------------
// 7) Grisly trophies + streamside detail (foreground)
// ---------------------------------------------------------------------------
// bone/skull pile beside the troll
block(-6,0,-5,SNOW); block(-6,1,-5,SNOW); block(-5,0,-6,SNOW);
block(-7,0,-6,SNOW); block(-6,0,-7,SNOW);
// rocks and bushes on the banks
sphere(-9,0,-8,2, COBBLE);
sphere( 9,0,-9,2, COBBLE);
sphere(-10,1,-6,2, LEAVES);
sphere( 10,1,-7,2, LEAVES);
sphere( 8,1,-11,1, LEAVES);
sphere(-8,1,-11,1, LEAVES);
// a couple of cattails at the water's edge
line(-5,0,-11,-5,2,-11, OAK_LOG); block(-5,3,-11,LEAVES);
line( 5,0,-10, 5,2,-10, OAK_LOG); block( 5,3,-10,LEAVES);