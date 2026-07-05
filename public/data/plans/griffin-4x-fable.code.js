// griffin-4x-fable — prompt:
// a griffin...

const box=(x1,y1,z1,x2,y2,z2,id)=>cube(Math.min(x1,x2),Math.min(y1,y2),Math.min(z1,z2),Math.max(x1,x2),Math.max(y1,y2),Math.max(z1,z2),id);
function ell(cx,cy,cz,rx,ry,rz,id){
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)
    for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)
      for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
        const dx=(x-cx)/rx,dy=(y-cy)/ry,dz=(z-cz)/rz;
        if(dx*dx+dy*dy+dz*dz<=1) block(x,y,z,id);
      }
}

// Clear tree canopy / trunks from the build volume (AIR is free)
box(-13,0,-14,13,9,16,AIR);
// Patch stray ground-level log stumps left at y=-1
block(1,-1,-7,GRASS); block(4,-1,-3,GRASS); block(12,-1,11,GRASS);

// Rocky perch base
disk(0,-1,4,9,COBBLE);
disk(0,-1,4,5,STONE);
// Boulders
sphere(-8,0,13,2,STONE);
sphere(12,-1,12,2,COBBLE);

// ---- LION BODY (tawny) ----
ell(0,9,5,4,3.5,6.5,PLANKS);
ell(0,7.5,5,3.5,2,5.5,SAND);        // lighter underbelly

// ---- EAGLE CHEST / NECK / HEAD (white) ----
ell(0,10,-1,3.5,3.5,3.5,SNOW);      // feathered chest
ell(0,12,-3,3,2.5,2.5,SNOW);        // neck ruff
box(-1,12,-5,1,15,-3,SNOW);         // neck
ell(0,16,-5,2.5,2.5,3,SNOW);        // head

// Beak (yellow, hooked)
box(-1,15,-9,1,16,-8,SAND);
box(-1,14,-8,1,14,-8,SAND);         // lower mandible
block(0,16,-10,SAND); block(0,15,-10,SAND);
block(0,14,-10,SAND);               // downward hook

// Eyes + brow
block(-2,16,-6,BRICK); block(2,16,-6,BRICK);
box(-2,17,-7,2,17,-7,SNOW);

// Ear tufts
box(-1,18,-3,-1,20,-3,SNOW);
box(1,18,-3,1,20,-3,SNOW);

// ---- WINGS (raised, layered feathers) ----
for(const s of [1,-1]){
  for(let i=0;i<=18;i++){
    const x=s*(3+i);
    const zo=2+Math.floor(i/5);                 // rake back toward tip
    const top=13+Math.round(i*0.85)+(s>0?1:0);  // slight asymmetry
    const len=7+Math.floor(i*0.45);             // primaries longest
    let bottom=top-len;
    if(i>=8&&i%2===1) bottom-=2;                // serrated feather tips
    for(let y=bottom;y<=top;y++){
      let id=SNOW;
      if(y>=top-1) id=OAK_LOG;                  // brown coverts on top edge
      else if(y<=bottom+1) id=STONE;            // dark feather tips
      box(x,y,zo,x,y,zo+1,id);
    }
    if(len>7)                                    // second feather layer for depth
      for(let y=bottom+3;y<=top-3;y++) block(x,y,zo+2,SNOW);
  }
  ell(s*4,12,2,1.6,1.6,2.6,OAK_LOG);            // shoulder coverts
}

// ---- FRONT EAGLE LEGS + TALONS ----
for(const s of [1,-1]){
  ell(s*2.5,9,-2,1.8,2.2,2.2,SNOW);             // shoulder muscle
  box(s*2,3,-4,s*3,9,-2,SNOW);                  // feathered upper leg
  box(s*2,0,-4,s*3,3,-3,SAND);                  // scaled lower leg
  block(s*2,0,-5,SAND); block(s*3,0,-5,SAND);   // toes
  block(s*2,0,-6,STONE); block(s*3,0,-6,STONE); // front claws
  block(s*2,0,-2,STONE);                        // rear claw
}

// ---- LION HINDQUARTERS ----
for(const s of [1,-1]){
  ell(s*3.5,8,9,2.5,3,3.5,PLANKS);              // haunch
  box(s*3,0,9,s*4,7,11,PLANKS);                 // leg
  box(s*3,0,7,s*4,0,8,PLANKS);                  // paw
  block(s*3,0,6,STONE); block(s*4,0,6,STONE);   // claws
}

// ---- LION TAIL (curled up) ----
line(0,11,11,0,14,15,PLANKS);
line(0,14,15,0,18,14,PLANKS);
ell(0,19,14,1.4,1.8,1.4,OAK_LOG);               // tail tuft

// ---- NEST WITH EGGS (side scene) ----
disk(9,0,-6,4,COBBLE);
hollowCylinder(9,1,-6,3,2,OAK_LOG);
disk(9,1,-6,2,OAK_LOG);
block(9,2,-6,SNOW); block(8,2,-7,SNOW); block(10,2,-6,SNOW);

// Shed feathers on the ground
block(5,0,-1,SNOW); block(-6,0,8,SNOW); block(3,0,10,SNOW);