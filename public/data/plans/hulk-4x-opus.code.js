// hulk-4x-opus — prompt:
// the Incredible Hulk...

// ===== THE INCREDIBLE HULK — smashing through a wall, roaring, double-flex =====
const GREEN = LEAVES;   // green skin
const PANTS = COBBLE;   // torn ragged shorts
const HAIR  = OAK_LOG;  // dark hair
const DEBRIS= STONE;    // rubble
const EYE   = SNOW;     // white eyes / teeth
const WALL  = BRICK;    // smashed wall behind

// helper: chain of spheres between two points
function limb(x1,y1,z1,x2,y2,z2,r,id){
  const steps = Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1));
  for(let i=0;i<=steps;i++){
    const t=steps===0?0:i/steps;
    sphere(Math.round(x1+(x2-x1)*t),Math.round(y1+(y2-y1)*t),Math.round(z1+(z2-z1)*t),r,id);
  }
}

// -------------------------------------------------------------------------
// BACKGROUND: brick wall he burst through (foreground/background separation)
// -------------------------------------------------------------------------
cube(-16,0,7,16,9,8,WALL);
// jagged, crumbled top edge
for(let x=-16;x<=16;x++){
  const h = 6 + ((x*7)%5+5)%5;      // pseudo-random 6..10 top
  cube(x,h,7,x,9,8,AIR);
}
// the big body-shaped hole he smashed through
cube(-7,0,7,7,8,8,AIR);
// extra shrapnel holes
cube(-13,3,7,-11,6,8,AIR);
cube(10,2,7,13,5,8,AIR);
cube(-15,1,7,-14,3,8,AIR);
// loose bricks flying / scattered near the breach
for(const [x,y,z] of [[-9,4,6],[9,3,6],[-11,1,5],[12,0,5],[8,6,6],[-8,7,5],[6,2,6],[-6,8,6]])
  block(x,y,z,WALL);

// -------------------------------------------------------------------------
// LEGS + FEET (huge, planted wide)
// -------------------------------------------------------------------------
for(const s of [-1,1]){
  const cx = s*4;
  // big flat feet, toes forward (-Z)
  cube(cx-3,0,-5,cx+3,1,2,GREEN);
  block(cx-3,0,-6,GREEN); block(cx+3,0,-6,GREEN); // outer toes
  // calves / shins
  cube(cx-3,1,-2,cx+3,6,3,GREEN);
  sphere(cx,4,3,3,GREEN);        // bulging calf (back)
  sphere(cx,3,-2,2,GREEN);       // shin front
  // knee
  sphere(cx,6,-2,2,GREEN);
  // thighs (thick)
  cube(cx-3,7,-3,cx+3,12,3,GREEN);
  sphere(cx,9,0,3,GREEN);
  sphere(s*6,10,0,2,GREEN);      // outer thigh sweep
}

// -------------------------------------------------------------------------
// PELVIS + TORN SHORTS
// -------------------------------------------------------------------------
cube(-7,9,-3,7,14,3,GREEN);          // hips base
cube(-7,8,-4,7,13,4,PANTS);          // shorts wrap
sphere(0,11,-4,3,PANTS);             // front bulge of shorts
// carve crotch gap between legs
cube(-1,8,-4,1,11,4,GREEN);
block(0,8,-4,PANTS);
// ragged torn hem
for(const x of [-7,-5,-2,3,5,7]) block(x,8,-4,AIR);
for(const x of [-6,-3,0,4,6])   block(x,8,4,AIR);

// -------------------------------------------------------------------------
// TORSO — massive V-taper
// -------------------------------------------------------------------------
cube(-5,14,-3,5,16,3,GREEN);         // waist
cube(-7,16,-3,7,21,3,GREEN);         // ribcage / chest
cube(-8,17,-2,8,20,2,GREEN);         // lats widen
cube(-6,21,-2,6,22,2,GREEN);         // upper chest shelf
// pecs
for(const s of [-1,1]) sphere(s*3,20,-3,3,GREEN);
// pec cleavage + ab grooves (shallow carve on front z=-3)
line(0,19,-3,0,22,-3,AIR);
line(0,14,-3,0,20,-3,AIR);
for(const y of [15,17,19]) line(-4,y,-3,4,y,-3,AIR);
// obliques
for(const s of [-1,1]) sphere(s*6,17,-2,2,GREEN);

// -------------------------------------------------------------------------
// SHOULDERS / NECK / TRAPS
// -------------------------------------------------------------------------
for(const s of [-1,1]) sphere(s*9,21,0,4,GREEN);   // boulder delts
cube(-3,22,-2,3,23,2,GREEN);         // traps
cube(-2,22,-1,2,24,2,GREEN);         // thick neck

// -------------------------------------------------------------------------
// ARMS — double-biceps flex, clenched fists up
// -------------------------------------------------------------------------
for(const s of [-1,1]){
  // upper arm out to the elbow
  limb(s*9,20,0, s*13,19,0, 3, GREEN);
  sphere(s*11,21,-1,3,GREEN);        // bicep peak
  sphere(s*13,19,0,3,GREEN);         // elbow
  // forearm rising up to the fist
  limb(s*13,19,0, s*12,26,0, 3, GREEN);
  // clenched fist
  sphere(s*12,27,0,3,GREEN);
  // knuckles
  for(const dz of [-2,0,2]) block(s*12,29,dz,GREEN);
  block(s*13,28,0,GREEN);            // thumb
}

// -------------------------------------------------------------------------
// HEAD — square jaw, heavy brow, roaring
// -------------------------------------------------------------------------
sphere(0,27,0,4,GREEN);
cube(-3,24,-3,3,26,2,GREEN);         // square jaw
sphere(0,25,-3,2,GREEN);             // chin
for(const s of [-1,1]) sphere(s*4,27,0,1,GREEN);  // ears

// hair (dark), top + back + sides
cube(-4,30,-3,4,31,4,HAIR);
cube(-4,26,2,4,30,4,HAIR);
for(const s of [-1,1]) cube(s*4,27,-2,s*4,30,3,HAIR);
block(0,32,0,HAIR);

// angry slanted brow (inner low, outer high = furious)
for(const s of [-1,1]){
  block(s*1,28,-4,HAIR);
  block(s*2,28,-4,HAIR);
  block(s*3,29,-4,HAIR);
}
// white glaring eyes recessed under brow
for(const s of [-1,1]){ block(s*2,27,-3,AIR); block(s*2,27,-4,EYE); }
// nose
block(0,26,-4,GREEN); block(0,26,-5,GREEN);
// roaring open mouth
cube(-2,23,-5,2,25,-4,AIR);
// teeth
block(-2,25,-4,EYE); block(2,25,-4,EYE);
block(-2,23,-4,EYE); block(2,23,-4,EYE);

// -------------------------------------------------------------------------
// GROUND DEBRIS / CRATER around his feet (foreground detail)
// -------------------------------------------------------------------------
// cracked crater ring
for(let a=0;a<360;a+=25){
  const r=11;
  const x=Math.round(Math.cos(a*Math.PI/180)*r);
  const z=Math.round(Math.sin(a*Math.PI/180)*r*0.7);
  if(z<6){ block(x,0,z,DEBRIS); if((x*z)%2===0) block(x,1,z,DEBRIS); }
}
// scattered rubble chunks
for(const [x,y,z,r] of [[-10,0,-3,2],[10,0,-2,2],[-8,0,3,1],[9,0,4,1],[-12,0,1,1],[12,0,0,1],[7,0,-5,1],[-7,0,-6,1]])
  sphere(x,y,z,r,DEBRIS);
// dust pebbles
for(const [x,z] of [[-6,-4],[6,-3],[-9,2],[8,2],[-4,5],[5,5],[0,-7],[3,-6]])
  block(x,0,z,COBBLE);