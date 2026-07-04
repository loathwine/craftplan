// iron-man-4x-fable — prompt:
// Iron Man...

const RED=BRICK, GOLD=SAND, DARK=COBBLE, GLOW=ICE, HOT=SNOW;

function mcube(x1,y1,z1,x2,y2,z2,id){cube(x1,y1,z1,x2,y2,z2,id);cube(-x2,y1,z1,-x1,y2,z2,id);}
function mblock(x,y,z,id){block(x,y,z,id);block(-x,y,z,id);}
function ringY(y,x1,z1,x2,z2,id){
  cube(x1,y,z1,x2,y,z1,id);
  cube(x1,y,z2,x2,y,z2,id);
  cube(x1,y,z1,x1,y,z2,id);
  cube(x2,y,z1,x2,y,z2,id);
}

// clear vegetation in the takeoff zone (trees/canopy up to ~y8)
cube(-16,0,-12,16,10,12,AIR);

// ---- scorched launch ground ----
disk(0,-1,0,10,STONE);          // foundation over uneven grass
disk(0,0,0,8,COBBLE);           // blast scorch
// radial cracks
for(let i=0;i<9;i++){
  const a=i*0.72;
  const x1=Math.round(Math.cos(a)*6), z1=Math.round(Math.sin(a)*6);
  const r2=10+(i%3);
  const x2=Math.round(Math.cos(a)*r2), z2=Math.round(Math.sin(a)*r2);
  line(x1,0,z1,x2,0,z2,COBBLE);
}
// molten patches directly under the boot thrusters
mcube(1,0,-2,6,0,3,RED);
mcube(2,0,-1,5,0,2,GOLD);
// embers scattered on the scorch ring
for(let i=0;i<12;i++){
  const a=i*0.53+0.3;
  const r=5+(i%4);
  block(Math.round(Math.cos(a)*r),0,Math.round(Math.sin(a)*r),(i%2)?RED:GOLD);
}

// ---- IRON MAN, hovering takeoff pose (faces -Z), feet y12 head y33 ----

// legs
mcube(2,12,-3,5,13,2,RED);        // boots with toe
mcube(2,12,-1,5,12,2,DARK);       // dark soles
mcube(2,13,-3,5,13,-3,GOLD);      // gold toe trim
mcube(2,14,-1,5,14,2,DARK);       // ankle joint
mcube(2,15,-1,5,16,2,RED);        // shin
mcube(3,15,-2,4,16,-2,GOLD);      // gold shin plate
mcube(2,17,-1,5,17,2,RED);        // knee
mcube(3,17,-2,4,17,-2,GOLD);      // gold kneecap
mcube(2,18,-1,5,19,2,RED);        // thigh
mcube(5,18,0,5,19,1,GOLD);        // outer thigh stripe
cube(-1,18,-1,1,19,1,DARK);       // undersuit between thighs

// pelvis + belt
cube(-5,20,-1,5,21,2,RED);
cube(-5,20,-1,5,20,-1,DARK);
block(0,20,-1,GOLD);              // buckle

// waist
cube(-4,22,-1,4,22,1,RED);
cube(-2,22,-1,2,22,-1,GOLD);      // abs plate

// chest
cube(-5,23,-2,5,23,2,RED);
cube(-6,24,-2,6,27,2,RED);
cube(-2,23,-2,2,26,-2,GOLD);      // gold sternum panel
cube(-6,24,-2,-3,24,-2,DARK);     // pec seam lines
cube(3,24,-2,6,24,-2,DARK);
cube(6,25,0,6,26,1,DARK);         // side vents
cube(-6,25,0,-6,26,1,DARK);
// arc reactor (protruding, glowing)
cube(-1,24,-3,1,26,-3,HOT);
block(-1,24,-3,AIR); block(1,24,-3,AIR);
block(-1,26,-3,AIR); block(1,26,-3,AIR);
block(0,25,-3,GLOW);
// flight pack on the back
cube(-4,24,3,4,26,3,DARK);
block(-2,24,3,GLOW); block(2,24,3,GLOW);

// shoulders
mcube(6,25,-2,9,27,2,RED);
mcube(6,27,-2,9,27,2,GOLD);       // gold pauldron caps

// arms, angled down and out, palms firing
mcube(7,21,-1,9,24,1,RED);        // upper arm
mcube(7,20,-1,9,20,1,DARK);       // elbow
mcube(8,17,-1,10,19,1,RED);       // forearm (offset outward)
mcube(8,16,-1,10,16,1,GOLD);      // gauntlet band
mcube(8,14,-1,10,15,1,DARK);      // hand
mcube(8,13,-1,10,13,1,GLOW);      // palm repulsor flare
mblock(9,12,0,HOT);               // repulsor jet
mblock(9,11,0,GLASS);

// neck + helmet
cube(-1,28,-1,1,28,1,DARK);
cube(-2,29,-2,2,33,2,RED);
cube(-2,30,-2,2,32,-2,GOLD);      // faceplate
cube(-1,29,-2,1,29,-2,GOLD);      // chin
cube(-1,30,-2,1,30,-2,DARK);      // mouth slit
block(-1,31,-2,GLOW); block(1,31,-2,GLOW);  // eyes
mblock(2,31,0,DARK);              // side vents

// ---- boot thruster flames (cones widening downward) ----
function flame(xa){ // core columns xa..xa+1, z 0..1
  cube(xa,11,0,xa+1,11,1,HOT);            // white-hot core
  cube(xa,10,0,xa+1,10,1,GOLD);
  cube(xa-1,9,-1,xa+2,9,2,GOLD);
  cube(xa-1,8,-1,xa+2,8,2,GOLD);
  block(xa-1,8,-1,RED); block(xa+2,8,-1,RED);
  block(xa-1,8,2,RED);  block(xa+2,8,2,RED);
  ringY(7,xa-1,-1,xa+2,2,RED);
  cube(xa,7,0,xa+1,7,1,GOLD);
  ringY(6,xa-2,-2,xa+3,3,RED);
  block(xa-2,5,-2,DARK); block(xa+3,5,3,DARK);
  block(xa-2,5,3,HOT);   block(xa+3,5,-2,HOT);
  block(xa,5,3,RED);     block(xa+1,5,-2,RED);
  block(xa-3,4,1,HOT);   block(xa+4,4,0,HOT);
  block(xa,3,-3,HOT);    block(xa+1,3,4,HOT);
}
flame(3);
flame(-4);

// ---- dust ring kicked up by the blast ----
const puffs=[[9,1,3,2],[-8,1,5,2],[7,1,-5,2],[-7,1,-6,1],[1,1,9,2],
             [-2,1,-9,2],[-10,1,0,1],[10,1,-1,1],[4,2,8,1],[-5,2,7,1],
             [11,1,5,1],[-9,2,-4,1]];
for(const p of puffs) sphere(p[0],p[1],p[2],p[3],HOT);

// blast-lifted debris hanging in the air
const debris=[[8,4,6],[-9,3,4],[6,5,-7],[-6,4,-8],[11,3,-3],[-11,4,2],
              [3,6,7],[-4,5,-6],[9,6,1],[-8,6,-2]];
for(const d of debris) block(d[0],d[1],d[2],(d[0]+d[2])%2?STONE:DARK);

// ---- battle-damage background pieces ----
// ruined wall fragment (west)
cube(-15,0,6,-10,2,7,DARK);
cube(-15,3,6,-13,3,7,STONE);
block(-14,4,6,STONE); block(-15,4,7,STONE); block(-11,3,7,STONE);
block(-12,3,6,GOLD);  block(-12,4,6,RED);   // small fire on top
// smoldering rubble pile (east)
sphere(13,1,7,3,DARK);
block(11,2,5,RED); block(14,3,9,STONE);
block(13,4,7,GOLD); block(13,5,7,RED); block(14,3,5,GOLD);
// second small pile (northwest)
sphere(-11,0,-9,2,DARK);
block(-11,2,-9,GOLD); block(-10,1,-7,RED); block(-12,2,-8,STONE);