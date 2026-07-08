// sonic-4x-opus — prompt:
// Sonic the Hedgehog...

const meta = { name: 'sonic' };

// ---- helpers ----
function spike(bx,by,bz, tx,ty,tz, r0){
  const steps = 12;
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    const x=Math.round(bx+(tx-bx)*t);
    const y=Math.round(by+(ty-by)*t);
    const z=Math.round(bz+(tz-bz)*t);
    const r=Math.max(0, Math.round(r0*(1-t)));
    sphere(x,y,z, r, GLASS);
  }
}
function ring(cx,cy,cz,rOuter,thick){
  for(let dx=-rOuter;dx<=rOuter;dx++)
    for(let dy=-rOuter;dy<=rOuter;dy++){
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<=rOuter+0.3 && d>=rOuter-thick){
        block(cx+dx,cy+dy,cz,SAND);
        block(cx+dx,cy+dy,cz+1,SAND);
      }
    }
}

// ---- clear the immediate area (trees/foliage) so silhouette reads ----
cube(-11,0,-14,11,33,22,AIR);

// ---- background/foreground gold rings (classic Sonic rings) ----
ring(-15,12,13,4,2);
ring(15,13,11,4,2);
ring(-12,6,-9,3,2);

// ---- back head spikes (drawn first, behind head) ----
spike(0,26,11, 0,32,19, 3);
spike(-3,25,11, -7,30,20, 3);
spike(3,25,11, 7,30,20, 3);
spike(-5,23,12, -10,26,20, 2.5);
spike(5,23,12, 10,26,20, 2.5);
spike(0,23,12, 0,28,21, 2.5);

// ---- head (blue) ----
sphere(0,22,6,7,GLASS);
// small ears on top
spike(-4,28,4,-5,32,3,2);
spike(4,28,4,5,32,3,2);

// ---- muzzle (peach) lower front ----
sphere(0,19,-1,4,SAND);
// cheeks fuller
sphere(-3,19,0,2,SAND);
sphere(3,19,0,2,SAND);

// ---- nose ----
sphere(0,21,-5,1,COBBLE);
block(0,21,-6,COBBLE);
// ---- mouth (smile) ----
block(-2,19,-4,COBBLE);
block(-1,18,-4,COBBLE);
block(0,18,-4,COBBLE);
block(1,18,-4,COBBLE);
block(2,19,-4,COBBLE);

// ---- eyes (white, protruding), fused with thin blue line at x=0 ----
// left eye
cube(-4,23,-2,-1,28,1,SNOW);
block(-4,28,-2,GLASS); // round outer-top corner via blue brow
cube(-3,24,-2,-1,27,-2,LEAVES);  // green iris front
block(-2,25,-2,COBBLE);          // pupil
block(-2,27,-2,SNOW);            // shine
// right eye
cube(1,23,-2,4,28,1,SNOW);
block(4,28,-2,GLASS);
cube(1,24,-2,3,27,-2,LEAVES);
block(2,25,-2,COBBLE);
block(2,27,-2,SNOW);
// blue eyelids/brows to give the determined look
cube(-4,29,-1,-1,30,2,GLASS);
cube(1,29,-1,4,30,2,GLASS);

// ---- neck ----
cube(-2,14,4,2,15,8,GLASS);

// ---- torso (blue back, peach belly front) ----
cube(-4,6,3,4,14,9,GLASS);
// round torso lower corners
block(-4,6,3,AIR); block(4,6,3,AIR);
// peach belly
sphere(0,10,2,3,SAND);
cube(-3,8,3,3,13,3,SAND);

// ---- arms (peach) + white gloves ----
cube(-8,6,5,-5,13,8,SAND);
cube(5,6,5,8,13,8,SAND);
sphere(-8,6,6,2,SNOW);
sphere(8,6,6,2,SNOW);
// arm cuffs (white)
cube(-8,8,5,-5,9,8,SNOW);
cube(5,8,5,8,9,8,SNOW);

// ---- legs (peach) ----
cube(-3,2,4,-1,6,7,SAND);
cube(1,2,4,3,6,7,SAND);

// ---- white sock cuffs above shoes ----
cube(-4,3,4,-1,4,7,SNOW);
cube(1,3,4,4,4,7,SNOW);

// ---- big red shoes pointing forward (-Z) ----
cube(-4,0,-5,-1,3,5,BRICK);
cube(1,0,-5,4,3,5,BRICK);
// round toe tops
block(-4,3,-5,AIR); block(-1,3,-5,AIR);
block(1,3,-5,AIR); block(4,3,-5,AIR);
// white soles
cube(-4,0,-5,-1,0,5,SNOW);
cube(1,0,-5,4,0,5,SNOW);
// white straps across shoes
cube(-4,0,0,-1,3,1,SNOW);
cube(1,0,0,4,3,1,SNOW);
// gold buckles
block(-2,2,-1,SAND);
block(-3,2,-1,SAND);
block(2,2,-1,SAND);
block(3,2,-1,SAND);