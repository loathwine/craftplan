// optimus-prime-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Optimus Prime — heroic standing pose, Energon axe raised =====
function mCube(x1,y1,z1,x2,y2,z2,id){
  cube(x1,y1,z1,x2,y2,z2,id);
  cube(-x2,y1,z1,-x1,y2,z2,id);
}
function mSphere(cx,cy,cz,r,id){
  sphere(cx,cy,cz,r,id);
  sphere(-cx,cy,cz,r,id);
}
function mCyl(cx,cy,cz,r,h,id){
  cylinder(cx,cy,cz,r,h,id);
  cylinder(-cx,cy,cz,r,h,id);
}

// clear a footprint for the statue so it reads clean against the village
cube(-12,0,-7,12,32,6,AIR);

// plaza pedestal
disk(0,0,0,10,COBBLE);
hollowCylinder(0,0,0,10,1,STONE);

// ---- FEET ----
mCube(2,1,-3,4,3,1,COBBLE);
mCube(2,1,-4,4,3,-3,BRICK);           // toe caps
mCube(2,1,1,4,1,1,STONE);             // heel trim

// ---- ANKLES ----
mSphere(3,4,-1,1,STONE);

// ---- SHINS ----
mCube(2,5,-1,4,8,1,GLASS);
mCube(2,5,-1,4,5,1,BRICK);            // ankle guard stripe

// ---- KNEES ----
mSphere(3,9,0,1,STONE);
mCube(2,9,-2,4,9,-1,COBBLE);          // kneecap plate

// ---- THIGHS ----
mCube(2,10,-1,4,14,1,GLASS);

// ---- HIP / BELT ----
cube(-4,15,-1,4,15,1,STONE);
cube(-5,16,-2,5,17,2,BRICK);
cube(-1,16,-3,1,17,-3,STONE);         // belt buckle emblem block
mCube(4,15,-2,5,17,2,COBBLE);         // hip skirt plates

// ---- TORSO CORE ----
cube(-5,18,-2,5,25,2,STONE);
mCube(4,19,-2,5,24,2,BRICK);          // side chest red plates

// windshield chest (classic G1 truck windshield)
cube(-2,19,-3,2,22,-2,ICE);
cube(-2,19,-3,-2,22,-3,STONE);
cube(2,19,-3,2,22,-3,STONE);

// chest vents / greebles
cube(-1,23,-3,1,24,-3,STONE);
mCube(2,23,-2,3,24,-2,BRICK);

// ---- SHOULDERS ----
mCube(6,22,-2,8,25,2,STONE);
mCube(6,25,-2,8,26,2,BRICK);
mSphere(7,21,0,1,STONE);

// exhaust smoke stacks
mCyl(7,26,1,1,5,STONE);
mCyl(7,31,1,1,1,SNOW);
mCyl(7,26,1,1,1,BRICK);

// ---- HEAD ----
cube(-2,26,-2,2,30,2,STONE);
cube(-1,27,-3,1,27,-3,STONE);         // mouthplate
block(-1,28,-3,GLASS);
block(1,28,-3,GLASS);                 // eyes
mCube(3,28,-1,4,28,1,STONE);          // antennae/audio receptors
cube(-1,30,-1,1,31,1,BRICK);          // crest ridge
cube(0,31,0,0,32,0,STONE);            // crest spike

// ---- LEFT ARM (hanging, relaxed fist) ----
cube(-10,19,-1,-8,22,1,GLASS);
sphere(-9,18,0,1,STONE);
cube(-10,13,-1,-8,18,1,STONE);
cube(-11,10,-2,-8,13,2,COBBLE);
cube(-11,10,-3,-8,13,-3,BRICK);       // knuckle guard

// ---- RIGHT ARM (raised, holding axe) ----
cube(8,22,-1,10,26,1,GLASS);
sphere(9,26,0,1,STONE);
cube(8,26,-1,10,30,1,STONE);
cube(7,30,-2,11,32,2,COBBLE);
cube(7,30,-3,11,32,-3,BRICK);         // knuckle guard

// Energon axe
cylinder(9,32,0,1,2,STONE);           // handle grip
cube(7,33,-2,12,33,3,BRICK);          // axe blade base
cube(6,33,-1,6,33,2,ICE);             // glowing energon edge
cube(13,33,-1,13,33,2,ICE);
```
