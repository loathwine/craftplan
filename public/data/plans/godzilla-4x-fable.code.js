// godzilla-4x-fable — prompt:
// Godzilla...

function box(x1,y1,z1,x2,y2,z2,id){
  cube(Math.min(x1,x2),Math.min(y1,y2),Math.min(z1,z2),
       Math.max(x1,x2),Math.max(y1,y2),Math.max(z1,z2),id);
}
function ell(cx,cy,cz,rx,ry,rz,id){
  for(let x=Math.ceil(cx-rx);x<=Math.floor(cx+rx);x++)
    for(let y=Math.ceil(cy-ry);y<=Math.floor(cy+ry);y++)
      for(let z=Math.ceil(cz-rz);z<=Math.floor(cz+rz);z++){
        const dx=(x-cx)/rx,dy=(y-cy)/ry,dz=(z-cz)/rz;
        if(dx*dx+dy*dy+dz*dz<=1) block(x,y,z,id);
      }
}
// dorsal fin: right-triangle plate, base row length s shrinking upward
function plate(x,y,z,s){
  for(let i=0;i<s;i++) box(x,y+i,z,x,y+i,z+(s-1-i),ICE);
}

// ---- clear trees from the street / beam corridor (AIR is free) ----
box(-6,0,-15,6,9,-1,AIR);
box(-9,0,0,9,10,9,AIR);

// ================= TARGET BUILDING (being blasted) =================
box(-5,0,-14,1,12,-14,COBBLE);   // south wall (faces Godzilla)
box(-5,0,-20,1,12,-20,COBBLE);   // north wall
box(-5,0,-19,-5,12,-15,COBBLE);  // west wall
box(1,0,-19,1,12,-15,COBBLE);    // east wall
box(-5,12,-20,1,12,-14,STONE);   // roof
for(let y=2;y<=10;y+=3)
  for(let x=-4;x<=0;x+=2){ block(x,y,-14,GLASS); block(x,y+1,-14,GLASS); }
for(let y=2;y<=10;y+=3){ block(-5,y,-16,GLASS); block(-5,y,-18,GLASS); }
// collapsed east-top corner + blast hole
box(-2,10,-20,1,12,-14,AIR);
sphere(0,10,-14,3,AIR);
// rubble spilling into the street
block(3,0,-14,COBBLE); block(4,0,-13,COBBLE); block(2,0,-12,COBBLE);
block(3,1,-14,COBBLE); block(2,0,-14,BRICK); block(4,0,-15,COBBLE);
// fires on remaining roof
block(-4,13,-16,BRICK); block(-5,13,-18,BRICK); block(-3,13,-15,BRICK);

// ================= BACKGROUND BUILDING (intact) =================
box(11,0,-14,16,7,-14,BRICK);
box(11,0,-19,16,7,-19,BRICK);
box(11,0,-18,11,7,-15,BRICK);
box(16,0,-18,16,7,-15,BRICK);
box(11,8,-19,16,8,-14,PLANKS);
for(let y=2;y<=6;y+=3) for(let x=12;x<=15;x+=2){ block(x,y,-14,GLASS); block(x,y+1,-14,GLASS); }

// ================= TANK firing from the street =================
box(6,0,-10,10,0,-6,COBBLE);           // treads
box(7,1,-9,9,1,-7,STONE);              // hull
box(8,2,-9,9,2,-8,STONE);              // turret
line(8,2,-10,8,2,-13,STONE);           // barrel aimed at Godzilla
block(8,2,-14,BRICK);                  // muzzle flash

// ================= CRUSHED HOUSE by his foot =================
box(8,0,3,13,2,3,PLANKS);
box(8,0,4,8,2,7,PLANKS);
box(13,0,4,13,1,7,PLANKS);
box(8,0,8,11,1,8,PLANKS);
block(10,2,3,AIR); block(12,1,3,AIR); block(8,2,6,AIR);   // broken gaps
line(9,0,4,12,2,7,OAK_LOG);            // fallen roof beam
block(10,0,5,BRICK); block(11,0,6,BRICK); block(11,1,6,BRICK); // fire inside

// ================= GODZILLA =================
// legs + clawed feet
for(const s of [-1,1]){
  box(s*2,-1,1,s*7,-1,7,COBBLE);                 // foundation
  box(s*2,0,1,s*7,1,7,COBBLE);                   // foot
  block(s*3,0,0,SNOW); block(s*5,0,0,SNOW); block(s*7,0,0,SNOW); // toe claws
  ell(s*4.5,4,4.5,2.4,4.5,2.6,STONE);            // shin
  ell(s*4.5,10,4.5,3.2,4.5,3.5,STONE);           // thigh
}
// hips / belly / chest (leaning forward)
ell(0,13,5,5.5,3.5,3.5,STONE);
ell(0,17,4,5,4.5,3.2,STONE);
ell(0,20.5,3,4.5,3.5,3,STONE);
// belly scutes + glowing charge line up the front
box(-2,12,1,2,21,1,COBBLE);
box(0,13,1,0,20,1,ICE);
// neck
ell(0,24,2,2.5,2.5,2.5,STONE);
// arms with claws
for(const s of [-1,1]){
  ell(s*5.5,20,3,2,2,2,STONE);
  box(s*5,16,0,s*7,19,3,STONE);
  box(s*5,13,-2,s*7,15,1,STONE);
  box(s*5,12,-4,s*7,12,-2,STONE);
  block(s*5,11,-4,SNOW); block(s*6,11,-4,SNOW); block(s*7,11,-4,SNOW);
}
// head: skull, snout, brow, open jaw
ell(0,28,0,3,2.6,3.5,STONE);
box(-2,27,-5,2,29,-2,STONE);           // upper snout
box(-3,29,-2,3,29,0,STONE);            // brow ridge
box(-2,25,0,2,25,2,STONE);             // jaw hinge
box(-2,24,-3,2,24,0,STONE);            // lower jaw
box(-2,23,-5,2,23,-3,STONE);           // jaw tip
box(-1,26,-4,1,26,-1,BRICK);           // atomic glow inside mouth
block(-2,26,-5,SNOW); block(0,26,-5,SNOW); block(2,26,-5,SNOW);  // upper fangs
block(-2,26,-3,SNOW); block(2,26,-3,SNOW);
block(-1,24,-4,SNOW); block(1,24,-4,SNOW);                       // lower fangs
block(-2,28,-4,BRICK); block(2,28,-4,BRICK);                     // burning eyes

// tail: curving west then back, drooping to the ground
for(let i=0;i<=20;i+=2){
  const t=i/20;
  const tx=Math.round(-7*Math.sin(Math.PI*t));
  const ty=Math.round(12-9*t);
  const tz=7+Math.round(14*t);
  const r=3.0-2.2*t;
  ell(tx,ty,tz,r,r*0.9,r+0.3,STONE);
  if(i>0 && i%4===0) plate(tx,ty+Math.ceil(r),tz,Math.max(1,Math.round(r-0.5)));
}
line(0,3,21,0,2,22,STONE);             // tail tip
plate(0,4,21,1);

// dorsal plates — big center row + smaller side rows
plate(0,26,3,2);
plate(0,22,5,3);
plate(0,18,6,4);
plate(0,14,7,4);
for(const s of [-1,1]){ plate(s*2,20,5,2); plate(s*2,16,7,2); }

// ================= ATOMIC BREATH =================
line(0,26,-5,0,10,-15,ICE);            // core beam
line(-1,26,-4,-1,11,-15,GLASS);
line(1,26,-4,1,11,-15,GLASS);
line(0,27,-5,0,12,-15,GLASS);
block(2,20,-9,ICE); block(-2,17,-11,ICE); block(1,14,-13,ICE); block(-1,23,-7,ICE); // crackle
// impact fireball + debris rays
sphere(0,10,-14,2,BRICK);
line(0,10,-14,3,13,-11,BRICK);
line(0,10,-14,-3,13,-12,BRICK);
line(0,10,-14,2,7,-12,BRICK);
line(0,10,-14,-2,7,-13,BRICK);

// street fires
box(-8,0,-6,-7,0,-5,BRICK); block(-8,1,-6,BRICK);
box(4,0,-16,5,0,-15,BRICK); block(5,1,-16,BRICK);