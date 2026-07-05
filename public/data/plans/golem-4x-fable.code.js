// golem-4x-fable — prompt:
// a stone golem...

function h(x,y,z){const n=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return n-Math.floor(n);}
function rock(x,y,z){block(x,y,z,h(x,y,z)<0.33?COBBLE:STONE);}
function rockCube(x1,y1,z1,x2,y2,z2){for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)rock(x,y,z);}
function rockSphere(cx,cy,cz,r){for(let x=cx-r;x<=cx+r;x++)for(let y=cy-r;y<=cy+r;y++)for(let z=cz-r;z<=cz+r;z++){const dx=x-cx,dy=y-cy,dz=z-cz;if(dx*dx+dy*dy+dz*dz<=r*r+0.5)rock(x,y,z);}}
function mossOn(x1,y1,z1,x2,y2,z2,p){for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)if(h(x+7,y+3,z+11)<p)block(x,y,z,LEAVES);}

// clear trees out of the golem's body volume
cube(-7,0,-5,7,8,5,AIR);

// ---------- FEET & LEGS (golem faces -Z) ----------
rockCube(-5,-1,-3,-2,1,2);   // left foot
rockCube(2,-1,-3,5,1,2);     // right foot
block(-5,-1,-4,STONE);block(-3,-1,-4,COBBLE);block(-2,-1,-4,STONE); // toes
block(2,-1,-4,STONE);block(4,-1,-4,COBBLE);block(5,-1,-4,STONE);
rockCube(-4,2,-2,-2,9,1);    // left leg
rockCube(2,2,-2,4,9,1);      // right leg
rockCube(-4,5,-3,-2,6,-3);   // knee plates
rockCube(2,5,-3,4,6,-3);

// ---------- PELVIS & TORSO ----------
rockCube(-5,10,-2,5,12,2);
for(let x=-5;x<=5;x++)block(x,12,-2,COBBLE);        // belt
rockCube(-5,13,-2,5,16,2);   // lower torso
rockCube(-6,17,-3,6,20,3);   // massive chest

// glowing rune heart: recessed carve + ICE core
cube(-1,17,-3,1,18,-3,AIR);
cube(-1,17,-2,1,18,-2,ICE);
// crack veins radiating from the heart
block(2,16,-3,ICE);block(3,15,-3,ICE);block(-2,16,-3,ICE);
block(-3,19,-3,ICE);block(0,19,-3,ICE);block(2,19,-3,ICE);
// dark stress fractures
block(-4,14,-3,DIRT);block(-4,13,-3,DIRT);block(4,15,-3,DIRT);
block(3,11,-3,DIRT);block(-3,4,-3,DIRT);block(3,7,-3,DIRT);

// spine ridge
block(0,13,3,STONE);block(0,15,3,STONE);block(0,17,4,STONE);block(0,19,4,STONE);block(0,21,3,STONE);

// ---------- SHOULDERS ----------
rockSphere(-7,20,0,3);
rockSphere(7,20,0,3);
block(-7,24,0,STONE);block(-8,23,1,COBBLE);          // shoulder spikes
block(7,24,0,STONE);block(8,23,-1,COBBLE);

// ---------- HEAD ----------
rockCube(-1,21,-1,1,21,1);   // neck
rockCube(-2,22,-2,2,25,1);   // head
line(-2,25,-3,2,25,-3,STONE);                        // brow overhang
for(let x=-2;x<=2;x++)block(x,22,-2,COBBLE);         // jaw
block(0,22,-2,AIR);                                  // mouth slit
block(-1,24,-2,ICE);block(1,24,-2,ICE);              // glowing eyes
block(-2,26,0,STONE);block(2,26,0,STONE);block(0,26,1,STONE); // crown nubs

// ---------- LEFT ARM (hanging, huge fist) ----------
rockCube(-9,13,-1,-7,18,1);
rockSphere(-8,12,0,2);       // elbow
rockCube(-9,6,-1,-7,11,1);
rockSphere(-8,3,0,2);        // fist
block(-9,3,-2,STONE);block(-8,3,-2,COBBLE);block(-7,3,-2,STONE); // knuckles

// ---------- RIGHT ARM (raised, hoisting a ripped-out boulder) ----------
rockCube(7,19,-1,9,23,1);
rockSphere(8,24,0,2);        // elbow
rockCube(7,25,-1,9,28,1);
rockSphere(8,30,0,3);        // boulder overhead (tops out at y=33)
block(6,28,0,STONE);block(10,28,0,STONE);block(8,28,-2,STONE);block(8,28,2,STONE); // gripping fingers
// boulder is torn earth: dirt band + grass tuft on top
block(7,32,0,DIRT);block(9,32,-1,DIRT);block(8,32,1,DIRT);
block(8,33,0,GRASS);block(7,33,-1,GRASS);block(9,33,1,GRASS);

// ---------- MOSS: the golem is ancient ----------
mossOn(-9,21,-2,-5,23,2,0.28);   // left shoulder top
mossOn(5,21,-2,9,22,2,0.2);
mossOn(-6,17,3,6,20,3,0.22);     // mossy back
mossOn(-5,13,2,5,16,2,0.18);
mossOn(-5,-1,-3,-2,1,2,0.2);     // feet
mossOn(2,-1,-3,5,1,2,0.2);
mossOn(-9,6,1,-7,11,1,0.18);     // left forearm back

// ---------- IMPACT CRATER RING ----------
for(let x=-10;x<=10;x++)for(let z=-10;z<=10;z++){
  const d=Math.hypot(x,z);
  if(d>6&&d<9.5&&h(x,0,z)<0.6)block(x,-1,z,h(x,1,z)<0.3?STONE:COBBLE);
}
// radial ground cracks (carved dark)
for(let a=0;a<8;a++){
  const ang=a*Math.PI/4+0.3;
  for(let r=5;r<12;r++){
    const x=Math.round(Math.cos(ang)*r+(h(a,r,0)-0.5)*2);
    const z=Math.round(Math.sin(ang)*r+(h(a,0,r)-0.5)*2);
    if(h(x,5,z)<0.7)block(x,-1,z,AIR);
  }
}

// ---------- RUINED STONE CIRCLE the golem once guarded ----------
function pillar(px,pz,hh){
  rockCube(px,-1,pz,px+1,hh,pz+1);
  block(px,hh+1,pz,COBBLE);
  mossOn(px,hh-1,pz,px+1,hh+1,pz+1,0.35);
}
pillar(-15,-9,7);
pillar(-15,-3,7);
rockCube(-15,8,-10,-14,8,-2);                 // lintel spanning the two = broken arch
cube(-15,8,-7,-14,8,-6,AIR);                  // collapsed middle
pillar(-16,3,4);
pillar(-13,9,6);
pillar(12,-9,5);
pillar(15,-2,3);
pillar(13,7,6);
// fallen column sections
rockCube(-12,-1,-13,-7,0,-12);
rockCube(9,-1,11,13,0,12);
mossOn(-12,0,-13,-7,0,-12,0.3);
mossOn(9,0,11,13,0,12,0.3);

// ---------- shattered head of an older golem, half-buried ----------
rockSphere(15,0,15,3);
block(14,1,12,AIR);block(16,1,12,AIR);        // dead eye sockets
block(14,1,13,ICE);                            // one faintly glowing eye
mossOn(13,1,13,17,3,17,0.3);

// ---------- rubble ----------
rockSphere(-9,0,7,1);
rockSphere(8,-1,-7,1);
rockSphere(5,0,9,1);
rockSphere(-6,-1,-10,1);
rockSphere(11,0,3,1);
rockSphere(-11,-1,-2,1);