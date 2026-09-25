// sonic-pal-opus — prompt:
// Sonic the Hedgehog...

block(0,0,0,AIR); // no-op anchor

// ---- helpers ----
function leg(sx){
  const cx = sx*4;
  // sole + main shoe body (red)
  cube(cx-3,0,-6, cx+2,0,2, WHITE);   // white sole
  cube(cx-3,1,-6, cx+2,3,2, RED);     // red shoe
  cube(cx-2,1,-7, cx+1,2,-7, RED);    // rounded toe tip
  cube(cx-3,3,0,  cx+2,3,2, RED);     // heel top
  // iconic white stripe band across the shoe
  cube(cx-3,1,-2, cx+2,3,-1, WHITE);
  // gold buckle on the stripe
  cube(cx-1,1,-3, cx+1,3,-3, GOLD);
  // tan leg
  cube(cx-1,4,-1, cx+1,10,1, SAND);
  // sock cuff
  cube(cx-1,4,-1, cx+1,4,1, WHITE);
}

function arm(sx){
  const cx = sx*5;
  // tan upper arm out to the side, angling down
  cube(cx-1,11,-1, cx+1,15,1, SAND);
  cube(cx, 9,-1,  cx+sx, 12,1, SAND);
  // white gloved fist
  sphere(cx+sx*1, 8, 0, 2, WHITE);
}

function ear(sx){
  const cx = sx*4;
  cube(cx-1,28,-1, cx+1,28,1, BLUE);
  cube(cx-1,29,-1, cx,   29,1, BLUE);
  block(cx,30,0, BLUE);
  block(cx,28,-2, SAND); // inner ear
}

function quill(bx,by,bz, dx,dy,dz, len, r0){
  for(let i=0;i<len;i++){
    const x=Math.round(bx+dx*i), y=Math.round(by+dy*i), z=Math.round(bz+dz*i);
    const r=Math.max(0, Math.round(r0*(1 - i/(len+1))));
    cube(x-r,y-r,z-r, x+r,y+r,z+r, BLUE);
  }
}

function ring(cx,cy,cz){
  for(let a=0;a<360;a+=12){
    const rad=a*Math.PI/180;
    for(let rr=3;rr<=4;rr++){
      block(Math.round(cx+rr*Math.cos(rad)), Math.round(cy+rr*Math.sin(rad)), cz, GOLD);
    }
  }
}

// ---- legs + shoes ----
leg(1); leg(-1);

// ---- torso ----
cube(-4,11,-2, 4,16,3, BLUE);        // blue torso
cube(-2,12,-3, 2,15,-2, SAND);       // tan belly patch
cube(-4,16,-1, 4,16,1, BLUE);        // neck/shoulders

// ---- arms ----
arm(1); arm(-1);

// ---- head (big blue ball) ----
sphere(0,22,0, 7, BLUE);

// ---- back quills (swept back + up) ----
quill(0,27,3,  0,   0.45,1.3, 10, 2);
quill(-3,26,3,-0.35,0.4, 1.3, 9,  2);
quill(3,26,3,  0.35,0.4, 1.3, 9,  2);
quill(-4,23,4,-0.30,0.15,1.4, 9,  2);
quill(4,23,4,  0.30,0.15,1.4, 9,  2);
quill(0,20,5,  0,  -0.05,1.5, 8,  2);

// ---- tan face / muzzle (front, -Z) ----
sphere(0,20,-3, 4, SAND);            // lower face tan
sphere(0,20,-6, 3, SAND);            // protruding muzzle

// ---- eyes (big connected Sonic eyes) ----
cube(-4,23,-7, 4,27,-6, WHITE);      // white sclera plate
block(-4,27,-6, BLUE); block(4,27,-6, BLUE); // soften top corners
// green irises
cube(1,23,-8, 3,26,-7, GREEN);
cube(-3,23,-8, -1,26,-7, GREEN);
// black pupils
cube(1,23,-9, 2,25,-8, BLACK);
cube(-2,23,-9, -1,25,-8, BLACK);
// white shine
block(2,25,-9, WHITE); block(-1,25,-9, WHITE);
// blue brow ridge over the eyes
cube(-4,27,-7, 4,27,-6, BLUE);

// ---- nose + smile on the muzzle ----
cube(-1,21,-10, 0,22,-9, BLACK);     // nose
block(-2,18,-9,BLACK); block(-1,17,-9,BLACK);
block(0,17,-9,BLACK);  block(1,17,-9,BLACK); block(2,18,-9,BLACK);

// ---- ears ----
ear(1); ear(-1);

// ---- floating gold rings (iconic collectibles) ----
ring(14, 9, -4);
ring(-15, 7, -2);