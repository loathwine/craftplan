// king-kong-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// TOWER — Empire-State-style skyscraper, west side
// Tier 1
cube(-16,0,-6,-4,11,-6,10); cube(-16,0,6,-4,11,6,10);
cube(-16,0,-5,-16,11,5,10); cube(-4,0,-5,-4,11,5,10);
cube(-16,11,-6,-4,11,6,8);
// Tier 2
cube(-14,11,-4,-6,18,-4,10); cube(-14,11,4,-6,18,4,10);
cube(-14,11,-3,-14,18,3,10); cube(-6,11,-3,-6,18,3,10);
cube(-14,18,-4,-6,18,4,8);
// Antenna spire
cube(-11,18,-1,-9,24,1,3);
block(-10,25,0,3);

// windows tier1
for (let x=-15;x<=-5;x+=3){ for (let y=2;y<=9;y+=3){ block(x,y,-6,11); block(x,y,6,11); } }
for (let z=-5;z<=5;z+=3){ for (let y=2;y<=9;y+=3){ block(-16,y,z,11); block(-4,y,z,11); } }
// windows tier2
for (let x=-13;x<=-7;x+=3){ for (let y=13;y<=17;y+=2){ block(x,y,-4,11); block(x,y,4,11); } }
// entrance
cube(-11,1,-6,-9,3,-6,0);
cube(-11,1,-6,-9,3,-6,8);
cube(-11,1,-6,-11,3,-6,8);
cube(-9,1,-6,-9,3,-6,8);

// rubble at tower base
block(-3,0,-3,8); block(-2,0,-4,8); block(-1,0,-3,3); block(-3,0,4,8); block(-2,0,5,3);

// KING KONG — legs
cylinder(2,0,0,2,12,4);
cylinder(8,0,0,2,12,4);
cube(0,0,-2,4,0,2,8);   // left foot
cube(6,0,-2,10,0,2,8);  // right foot

// hips
cube(0,11,-3,10,16,3,4);

// torso (tapers slightly wider at chest)
cube(-1,16,-3,11,20,3,4);
cube(-2,20,-4,12,25,4,4);

// shoulders
cube(-3,25,-4,13,28,4,4);

// fur shading patches (darker back side)
cube(-2,17,-4,-1,24,-3,8);
cube(11,17,-4,12,24,-3,8);

// left arm reaching down to grip tower corner
(function(){
  const steps=7;
  const sx=-2, sy=27, sz=1;
  const hx=-8, hy=15, hz=4;
  for (let i=0;i<=steps;i++){
    const t=i/steps;
    const x=Math.round(sx+(hx-sx)*t);
    const y=Math.round(sy+(hy-sy)*t);
    const z=Math.round(sz+(hz-sz)*t);
    cube(x-1,y-1,z-1,x+1,y+1,z+1,4);
  }
  cube(hx-1,hy-1,hz-1,hx+1,hy+1,hz+1,8); // gripping hand
})();

// right arm raised straight up
cylinder(12,28,0,2,4,4);
cube(10,31,-2,14,33,2,8); // fist

// head
cube(2,28,-3,8,32,3,4);
cube(2,29,-1,1,30,1,8);   // left ear
cube(9,29,-1,10,30,1,8);  // right ear
block(4,30,3,8); block(6,30,3,8);   // eyes
cube(3,31,3,7,31,3,3);               // brow ridge
line(3,28,3,7,28,3,8);               // mouth
block(5,29,4,8);                     // nose

// small biplanes for scale/drama
(function(){
  function biplane(x,y,z){
    cube(x-3,y,z,x+3,y,z,7);
    cube(x,y-1,z-2,x,y-1,z+2,7);
    cube(x,y+1,z-2,x,y+1,z+2,7);
    block(x,y,z,11);
    block(x-3,y,z,3); block(x+3,y,z,3);
  }
  biplane(19,30,-2);
  biplane(-20,26,6);
})();
