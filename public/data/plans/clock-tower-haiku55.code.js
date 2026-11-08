// clock-tower-haiku55 — prompt:
// a steampunk clock tower...

// ---------- helpers ----------
function box(x1,y1,z1,x2,y2,z2,id){
  cube(Math.min(x1,x2),Math.min(y1,y2),Math.min(z1,z2),
       Math.max(x1,x2),Math.max(y1,y2),Math.max(z1,z2),id);
}
function walls(x1,y1,z1,x2,y2,z2,id){
  box(x1,y1,z1,x2,y2,z1,id);
  box(x1,y1,z2,x2,y2,z2,id);
  box(x1,y1,z1,x1,y2,z2,id);
  box(x2,y1,z1,x2,y2,z2,id);
}
function seg(x1,y1,z1,x2,y2,z2,id){
  const n=Math.max(1,Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1));
  for(let i=0;i<=n;i++){
    block(Math.round(x1+(x2-x1)*i/n),Math.round(y1+(y2-y1)*i/n),Math.round(z1+(z2-z1)*i/n),id);
  }
}
function discXY(cx,cy,z,r,id,inner=-1){
  const R=Math.ceil(r);
  for(let dx=-R;dx<=R;dx++)for(let dy=-R;dy<=R;dy++){
    const d=Math.hypot(dx,dy);
    if(d<=r+1e-9 && d>inner) block(cx+dx,cy+dy,z,id);
  }
}
function discXZ(cx,y,cz,r,id,inner=-1){
  const R=Math.ceil(r);
  for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++){
    const d=Math.hypot(dx,dz);
    if(d<=r+1e-9 && d>inner) block(cx+dx,y,cz+dz,id);
  }
}
function gear(cx,cy,z,r,id,teeth){
  const R=Math.ceil(r)+1;
  for(let dx=-R;dx<=R;dx++)for(let dy=-R;dy<=R;dy++){
    const d=Math.hypot(dx,dy);
    if(d<=r && d>r-1.2) block(cx+dx,cy+dy,z,id);
    else if(d>r && d<=r+1 && Math.floor((Math.atan2(dy,dx)+Math.PI)/(2*Math.PI)*teeth)%2===0)
      block(cx+dx,cy+dy,z,id);
  }
  block(cx,cy,z,GOLD);
}

const CX=0, CY=20, CZ=-5;

// ---------- 0. clear the site (AIR is free) ----------
box(-17,0,-9,17,12,9,AIR);

// ---------- 1. foundations ----------
box(-6,-2,-6,6,-1,6,STONE);      // main plaza
box(-16,-2,-5,-7,-1,7,STONE);    // west workshop
box(7,-2,-4,7,-1,4,STONE);       // bridge stone
box(8,-2,-4,14,-1,4,STONE);      // boiler plinth
for(let x=-6;x<=6;x++)for(let z=-6;z<=6;z++){
  block(x,-1,z,(x+z)%2===0?STONE:COBBLE);   // checker paving
}

// ---------- 2. main tower: base (11x11) ----------
box(-5,0,-5,5,1,5,STONE);
walls(-5,2,-5,5,8,5,BRICK);
box(-1,2,-5,1,4,-5,AIR);                 // entrance
box(-2,2,-5,-2,4,-5,IRON);               // door frame
box(2,2,-5,2,4,-5,IRON);
box(-2,5,-5,2,5,-5,GOLD);                // lintel
box(-4,9,-4,4,9,4,PLANKS);               // ledge floor
walls(-5,9,-5,5,9,5,GOLD);               // gold ledge rim
box(-1,2,-1,1,8,1,COPPER);               // central boiler core

for (const [x,z] of [[-5,-5],[5,-5],[-5,5],[5,5]]) {
  seg(x,10,z,x,13,z,COPPER);             // corner pinnacles
  block(x,14,z,GOLD);
}

// ---------- 3. mid tower (9x9) ----------
walls(-4,10,-4,4,23,4,BRICK);
walls(-4,10,-4,4,10,4,COPPER);           // copper belt
box(-4,17,-4,4,17,4,PLANKS);             // interior floor
box(-4,24,-4,4,24,4,STONE);              // roof slab
for (const x of [-4,4]) seg(x,11,-5,x,23,-5,COPPER);   // front pilasters

// windows
box(-1,12,-4,1,14,-4,GLASS);
box(4,12,-1,4,14,1,GLASS);  box(-4,12,-1,-4,14,1,GLASS);
box(4,18,-1,4,20,1,GLASS);  box(-4,18,-1,-4,20,1,GLASS);
box(-1,12,4,1,14,4,GLASS);  box(-1,18,4,1,20,4,GLASS);

// pendulum visible through the glass
seg(0,10,0,0,22,0,IRON);
discXZ(0,13,0,1.1,GOLD);

// ---------- 4. clock face on the north (front) side ----------
discXY(CX,CY,CZ,2.6,MARBLE);             // face
discXY(CX,CY,CZ,3.5,GOLD,2.6);           // brass rim
for (let h=0;h<12;h++){
  const a=h*Math.PI/6;
  block(Math.round(CX+2.2*Math.sin(a)), Math.round(CY+2.2*Math.cos(a)), CZ, h%3===0?GOLD:BLACK);
}
seg(0,CY,-6,2,CY+2,-6,BLACK);            // minute hand
seg(0,CY,-6,-2,CY,-6,GOLD);              // hour hand
block(0,CY,-6,GOLD);                     // hub

// ---------- 5. gears and brackets ----------
gear(-3,5,-6,2,IRON,10);                 // front base gears
gear(3,5,-6,2,COPPER,10);
gear(-7,15,-5,2,IRON,10);                // gear train flanking the clock
seg(-4,15,-5,-5,15,-5,IRON);
gear(7,15,-5,2,COPPER,10);
seg(4,15,-5,5,15,-5,COPPER);

// ---------- 6. belfry (7x7) ----------
walls(-3,25,-3,3,28,3,BRICK);
walls(-3,28,-3,3,28,3,COPPER);
box(-1,25,-3,1,27,-3,AIR);               // arches
box(-1,25,3,1,27,3,AIR);
box(-3,25,-1,-3,27,1,AIR);
box(3,25,-1,3,27,1,AIR);
for (const [x,z] of [[-3,-3],[3,-3],[-3,3],[3,3]]) seg(x,25,z,x,27,z,GOLD);
discXZ(0,26,0,1.5,GOLD);                 // bell
discXZ(0,25,0,1,GOLD);
block(0,27,0,IRON);                      // yoke

// ---------- 7. copper roof, gold finial, lantern ----------
box(-3,29,-3,3,29,3,COPPER);
box(-2,30,-2,2,30,2,COPPER);
box(-1,31,-1,1,31,1,COPPER);
for (const [x,z] of [[-3,-3],[3,-3],[-3,3],[3,3]]) block(x,29,z,GOLD);
block(0,32,0,GOLD);
block(0,33,0,GLOWSTONE);

// ---------- 8. boiler house on the east ----------
for (let y=0;y<=8;y++) discXZ(11,y,0,3,IRON);
discXZ(11,9,0,3,COPPER);                 // boiler cap
discXZ(11,2,0,3,GOLD,2);                 // brass bands
discXZ(11,6,0,3,GOLD,2);
box(10,0,-3,12,1,-3,BLACK);              // firebox door
block(11,0,-4,FIRE);                     // firebox flame
gear(11,6,-4,2,GOLD,10);                 // gear on boiler front
seg(5,5,0,8,5,0,COPPER);                 // steam pipe to tower

walls(10,10,-1,12,21,1,BRICK);           // smokestack
walls(10,15,-1,12,15,1,GOLD);            // stack band
box(10,22,-1,12,22,1,IRON);              // stack cap
block(11,23,0,STEAM);
block(11,24,0,STEAM);

// ---------- 9. west workshop wing ----------
box(-15,0,-4,-8,0,4,PLANKS);
walls(-15,1,-4,-8,5,4,BRICK);
box(-15,2,-2,-15,3,2,GLASS);
box(-8,2,-2,-8,3,2,GLASS);
box(-12,2,-4,-10,3,-4,GLASS);
box(-16,6,-5,-7,6,5,COPPER);             // stepped roof
box(-15,7,-4,-8,7,4,COPPER);
box(-14,8,-3,-9,8,3,COPPER);
box(-13,1,-2,-12,2,-1,IRON);             // interior machinery
discXZ(-10,1,1,1,COPPER);
discXZ(-10,2,1,1,COPPER);
gear(-11,9,-5,2,IRON,10);                // gear on wing front
seg(-8,4,0,-5,4,0,IRON);                 // pipe to main tower

walls(-13,0,5,-11,17,7,BRICK);           // west chimney
box(-13,18,5,-11,18,7,IRON);
block(-12,19,6,STEAM);

// ---------- 10. front plaza lamps ----------
for (const x of [-6,6]) {
  seg(x,0,-6,x,3,-6,IRON);
  block(x,4,-6,GLOWSTONE);
}