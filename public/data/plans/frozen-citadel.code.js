// frozen-citadel — prompt:
// A FROZEN CITADEL rising from an icy mountain spur - a massive fortress of ICE and SNOW with STONE foundations. Tall central keep crowned by a pointed ICE spire, thick crenellated curtain walls connect...

// FROZEN CITADEL — ice fortress on a stone spur, gate facing -Z
// Palette: STONE/COBBLE foundations, SNOW upper masonry, ICE caps/spires, GLASS windows

// ---------- SITE PREP (AIR is free — clear trees where the fortress stands) ----------
cube(-13,1,-11,13,9,11,AIR);          // courtyard volume
cube(-15,1,-17,15,9,-12,AIR);         // south wall zone + apron
cube(-6,1,-22,6,8,-17,AIR);           // gate approach corridor
cube(-15,1,12,15,9,16,AIR);           // north wall zone
cube(-19,1,-10,-17,8,10,AIR);         // west fringe
cube(17,1,-10,19,8,10,AIR);           // east fringe
cube(11,1,-16,19,9,-8,AIR);           // SE tower site
cube(-19,1,-16,-11,9,-8,AIR);         // SW tower site
cube(11,1,8,19,9,16,AIR);             // NE tower site
cube(-19,1,8,-11,9,16,AIR);           // NW tower site

// ---------- ROCK SPUR FOUNDATIONS ----------
cube(-12,-2,-14,12,0,-11,STONE);      // under south wall
cube(-12,-2,11,12,0,14,STONE);        // under north wall
cube(-17,-2,-9,-14,0,9,STONE);        // under west wall
cube(14,-2,-9,17,0,9,STONE);          // under east wall
cube(-6,-1,-4,6,0,8,STONE);           // keep plinth

// rocky crags breaking out of the snow at the corners
const CRAGS = [[18,-15],[-18,-15],[18,14],[-18,14]];
for (const [cx,cz] of CRAGS) {
  disk(cx,-1,cz,3,STONE);
  disk(cx,0,cz,2,STONE);
  block(cx,1,cz,SNOW);
}

// ---------- COURTYARD SNOW ----------
cube(-11,1,-11,11,1,-4,SNOW);
cube(-11,1,-3,-6,1,8,SNOW);
cube(6,1,-3,11,1,8,SNOW);
cube(-11,1,9,11,1,11,SNOW);

// ---------- CURTAIN WALLS (stone base, snow masonry, ice cap) ----------
function bandWall(x1,z1,x2,z2){
  cube(x1,1,z1,x2,4,z2,STONE);
  cube(x1,5,z1,x2,8,z2,SNOW);
  cube(x1,9,z1,x2,9,z2,ICE);
}
bandWall(5,-13,12,-12);               // south right
bandWall(-12,-13,-5,-12);             // south left
bandWall(-12,12,12,13);               // north
bandWall(-16,-9,-15,9);               // west
bandWall(15,-9,16,9);                 // east

// gate section between the gatehouse towers
cube(-1,1,-13,1,4,-12,STONE);
cube(-1,5,-13,1,8,-12,SNOW);
cube(-1,9,-13,1,9,-12,ICE);
cube(0,1,-13,0,4,-12,AIR);            // carve the arch
cube(-1,1,-13,-1,3,-12,AIR);
cube(1,1,-13,1,3,-12,AIR);
line(-2,1,-14,-2,4,-14,COBBLE);       // arch jambs proud of the face
line(2,1,-14,2,4,-14,COBBLE);
block(-1,5,-14,COBBLE); block(1,5,-14,COBBLE); block(0,5,-14,COBBLE);

// crenellations (snow merlons on the ice cap)
for (let x=5; x<=11; x+=2){ cube(x,10,-13,x,11,-13,SNOW); cube(-x,10,-13,-x,11,-13,SNOW); }
for (let x=-11; x<=11; x+=2){ cube(x,10,13,x,11,13,SNOW); }
for (let z=-8; z<=8; z+=2){ cube(-16,10,z,-16,11,z,SNOW); cube(16,10,z,16,11,z,SNOW); }
cube(-1,10,-13,-1,11,-13,SNOW); cube(1,10,-13,1,11,-13,SNOW);

// cobble buttresses
for (const x of [-9,9]){ cube(x,1,-14,x,5,-14,COBBLE); cube(x,1,-15,x,2,-15,COBBLE); }
for (const x of [-6,6]){ cube(x,1,14,x,5,14,COBBLE); cube(x,1,15,x,2,15,COBBLE); }
for (const z of [-4,4]){
  cube(-17,1,z,-17,5,z,COBBLE); cube(-18,1,z,-18,2,z,COBBLE);
  cube(17,1,z,17,5,z,COBBLE);  cube(18,1,z,18,2,z,COBBLE);
}

// icicles hanging from the battlements
for (const x of [-11,-8,8,11]) line(x,8,-14,x,7,-14,ICE);
for (const x of [-10,-5,0,5,10]) line(x,8,14,x,7,14,ICE);
for (const z of [-7,-3,1,5]){ line(-17,8,z,-17,7,z,ICE); line(17,8,z,17,7,z,ICE); }

// ---------- GATEHOUSE TOWERS (flanking the gate) ----------
for (const gx of [-4,4]){
  disk(gx,-1,-13,3,STONE);
  disk(gx,0,-13,3,COBBLE);
  cylinder(gx,1,-13,2,4,STONE);
  cylinder(gx,5,-13,2,7,SNOW);
  disk(gx,12,-13,3,SNOW);             // machicolated platform
  hollowCylinder(gx,13,-13,3,2,SNOW); // parapet
  block(gx+3,15,-13,ICE); block(gx-3,15,-13,ICE);
  block(gx,15,-10,ICE);  block(gx,15,-16,ICE);
  block(gx+3,12,-13,ICE); block(gx-3,12,-13,ICE);
  line(gx,12,-16,gx,11,-16,ICE);      // icicle off the front rim
  block(gx,8,-15,GLASS); block(gx,9,-15,GLASS);
}

// ---------- CORNER TOWERS ----------
const TOWERS = [[15,-12],[-15,-12],[15,12],[-15,12]];
for (const [cx,cz] of TOWERS){
  disk(cx,-2,cz,4,STONE);
  disk(cx,-1,cz,4,STONE);
  disk(cx,0,cz,4,COBBLE);
  hollowCylinder(cx,1,cz,3,5,STONE);
  hollowCylinder(cx,6,cz,3,8,SNOW);
  disk(cx,14,cz,4,SNOW);              // overhanging machicolation
  disk(cx,15,cz,3,ICE);               // conical ice roof
  disk(cx,16,cz,2,ICE);
  disk(cx,17,cz,1,ICE);
  block(cx,18,cz,ICE);
  block(cx+4,13,cz,ICE); block(cx-4,13,cz,ICE);  // icicles under the rim
  block(cx,13,cz+4,ICE);
  line(cx,13,cz-4,cx,12,cz-4,ICE);
}
// glinting windows on the gate-facing towers
block(15,9,-15,GLASS); block(15,10,-15,GLASS);
block(-15,9,-15,GLASS); block(-15,10,-15,GLASS);

// ---------- BARTIZANS (small turrets on east/west wall tops) ----------
for (const bx of [-16,16]){
  hollowCylinder(bx,9,0,2,5,SNOW);
  disk(bx,14,0,2,ICE);
  block(bx,15,0,ICE);
  block(bx>0?17:-17,8,0,COBBLE);      // corbel
}

// ---------- CENTRAL KEEP (towers above everything) ----------
// main tier walls: stone below, snow above
cube(-5,1,-3,5,8,-3,STONE);  cube(-5,9,-3,5,18,-3,SNOW);   // front (-Z)
cube(-5,1,7,5,8,7,STONE);    cube(-5,9,7,5,18,7,SNOW);     // rear
cube(-5,1,-2,-5,8,6,STONE);  cube(-5,9,-2,-5,18,6,SNOW);   // west
cube(5,1,-2,5,8,6,STONE);    cube(5,9,-2,5,18,6,SNOW);     // east
// cobble corner pilasters
for (const px of [-6,6]) for (const pz of [-4,8]) cube(px,1,pz,px,16,pz,COBBLE);
// roof deck + parapet
cube(-4,18,-2,4,18,6,SNOW);
cube(-5,19,-3,5,20,-3,SNOW); cube(-5,19,7,5,20,7,SNOW);
cube(-5,19,-2,-5,20,6,SNOW); cube(5,19,-2,5,20,6,SNOW);
for (let x=-5; x<=5; x+=2){ block(x,21,-3,ICE); block(x,21,7,ICE); }
for (let z=-1; z<=5; z+=2){ block(-5,21,z,ICE); block(5,21,z,ICE); }
// upper tier
cube(-3,19,-1,3,26,-1,SNOW); cube(-3,19,5,3,26,5,SNOW);
cube(-3,19,0,-3,26,4,SNOW);  cube(3,19,0,3,26,4,SNOW);
line(-3,19,-1,-3,26,-1,ICE); line(3,19,-1,3,26,-1,ICE);    // ice quoins
line(-3,19,5,-3,26,5,ICE);   line(3,19,5,3,26,5,ICE);
cube(-3,27,-1,3,27,5,ICE);                                  // ice cap slab
line(-3,28,-1,-3,29,-1,ICE); line(3,28,-1,3,29,-1,ICE);    // corner spikes
line(-3,28,5,-3,29,5,ICE);   line(3,28,5,3,29,5,ICE);
// pointed ice spire to the sky limit
disk(0,28,2,2,ICE);
disk(0,29,2,2,ICE);
disk(0,30,2,1,ICE);
disk(0,31,2,1,ICE);
line(0,32,2,0,33,2,ICE);
// glinting glass windows
cube(-3,5,-3,-3,6,-3,GLASS); cube(3,5,-3,3,6,-3,GLASS);    // arrow slits
cube(-3,10,-3,-2,14,-3,GLASS); cube(2,10,-3,3,14,-3,GLASS);
cube(0,10,-3,0,14,-3,GLASS);                                // tall gothic lights
for (const wz of [0,4]){ cube(-5,10,wz,-5,13,wz,GLASS); cube(5,10,wz,5,13,wz,GLASS); }
for (const wx of [-3,0,3]) cube(wx,10,7,wx,13,7,GLASS);
cube(0,21,-1,0,23,-1,GLASS); cube(0,21,5,0,23,5,GLASS);
cube(-3,21,2,-3,23,2,GLASS); cube(3,21,2,3,23,2,GLASS);
// grand door facing the gate
cube(-1,2,-3,1,4,-3,AIR); block(0,5,-3,AIR);
line(-2,1,-4,-2,5,-4,COBBLE); line(2,1,-4,2,5,-4,COBBLE);
cube(-2,6,-4,2,6,-4,COBBLE);
cube(-2,1,-5,2,1,-4,COBBLE);                                // entry steps
// icicles off the keep parapet front lip
for (const x of [-4,-2,0,2,4]) line(x,18,-4,x,17,-4,ICE);

// ---------- COURTYARD HALL (west side) ----------
cube(-11,2,0,-7,2,6,STONE);                                 // plinth
cube(-11,3,0,-7,6,0,SNOW);  cube(-11,3,6,-7,6,6,SNOW);
cube(-11,3,1,-11,6,5,SNOW); cube(-7,3,1,-7,6,5,SNOW);
cube(-11,7,0,-7,7,6,SNOW);                                  // gabled snow roof
cube(-10,8,0,-8,8,6,SNOW);
cube(-9,9,0,-9,9,6,ICE);                                    // ice ridge
cube(-7,3,2,-7,4,3,AIR);                                    // door toward courtyard
block(-11,4,2,GLASS); block(-11,4,4,GLASS);
block(-10,4,0,GLASS); block(-8,4,0,GLASS);

// frozen well
hollowCylinder(-8,1,-7,2,2,COBBLE);
disk(-8,1,-7,1,ICE);

// ---------- GATE APPROACH ----------
cube(-1,0,-22,1,0,-14,COBBLE);                              // cobble causeway
cube(-2,0,-22,-2,0,-14,SNOW); cube(2,0,-22,2,0,-14,SNOW);
for (const lx of [-3,3]){ line(lx,1,-18,lx,3,-18,COBBLE); block(lx,4,-18,ICE); }
cube(-1,0,-13,1,0,-11,COBBLE);                              // floor through the gate

// ---------- SNOW DRIFTS BANKED AGAINST THE WALLS ----------
cube(-12,1,-14,12,1,-14,SNOW);
cube(-12,1,14,12,1,14,SNOW);
cube(-17,1,-8,-17,1,8,SNOW);
cube(17,1,-8,17,1,8,SNOW);
for (let x=-12; x<=12; x+=5){ if (x<-3||x>3){ block(x,2,-14,SNOW); block(x,2,14,SNOW); } }
for (let z=-6; z<=6; z+=6){ block(-17,2,z,SNOW); block(17,2,z,SNOW); }

// ---------- ICE CRYSTAL SPIKES rising from the spur ----------
function spike(x,z,h){ cylinder(x,-1,z,1,h+1,ICE); line(x,h,z,x,h+1,z,ICE); }
spike(-10,-16,2); spike(10,-16,3);
spike(20,-4,2);   spike(20,5,3);
spike(-20,-4,3);  spike(-20,5,2);
spike(12,16,2);   spike(-12,16,3);