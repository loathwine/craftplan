// r2d2-4x-fable — prompt:
// R2-D2...

const W=SNOW, B=GLASS, S=STONE, C=COBBLE, R2=BRICK, I=ICE;

function box(x1,y1,z1,x2,y2,z2,id){
  cube(Math.min(x1,x2),Math.min(y1,y2),Math.min(z1,z2),
       Math.max(x1,x2),Math.max(y1,y2),Math.max(z1,z2),id);
}
function deg(x,z){ return Math.abs(Math.atan2(x,-z)*180/Math.PI); } // 0 = front(-Z), 180 = back
function inC(x,z,r2){ return x*x+z*z<=r2; }

// --- clear droid footprint + sidekick area (trees/leaves) ---
cube(-11,1,-11,11,27,11,AIR);
cube(10,1,6,15,9,12,AIR);

// --- sandy landing pad (Tatooine vibes) ---
disk(0,0,0,11,SAND);

// ================= BODY: white cylinder r=6, y=4..18 =================
const BR=36;
for(let y=4;y<=18;y++){
  for(let x=-6;x<=6;x++)for(let z=-6;z<=6;z++){
    if(!inC(x,z,BR)) continue;
    const shell = !inC(x+1,z,BR)||!inC(x-1,z,BR)||!inC(x,z+1,BR)||!inC(x,z-1,BR);
    let id=W;
    if(shell){
      const d=deg(x,z);
      if(y===4) id=C;                                    // bottom skirt rim
      else if(y===18) id=S;                              // seam under dome
      else if(y>=14&&y<=16&&d>=6&&d<=32) id=B;           // upper blue door panels
      else if(y>=9&&y<=11&&d<=22) id=(d<4)?C:S;          // recessed vents / grilles
      else if(y>=5&&y<=8&&d<3) id=S;                     // center vent strip
      else if(y>=5&&y<=7&&d>=8&&d<=28) id=B;             // lower blue doors
      else if(y===8&&d>=34&&d<=40) id=I;                 // charge port lights
      else if(y>=10&&y<=13&&d>=58&&d<=80) id=B;          // side utility-arm panels
      else if(y>=6&&y<=9&&d>=100&&d<=122) id=B;          // rear-side panels
      else if(y>=13&&y<=15&&d>=152) id=B;                // back blue panel
      else if(y>=6&&y<=10&&d>=158) id=S;                 // power coupling port
    }
    block(x,y,z,id);
  }
}

// ================= DOME: y=19..25 =================
const prof=[[19,6],[20,6],[21,5],[22,5],[23,4],[24,3],[25,1]];
for(const p of prof){
  const y=p[0], r=p[1], r2=r*r;
  for(let x=-r;x<=r;x++)for(let z=-r;z<=r;z++){
    if(!inC(x,z,r2)) continue;
    const shell = !inC(x+1,z,r2)||!inC(x-1,z,r2)||!inC(x,z+1,r2)||!inC(x,z-1,r2);
    let id=W;
    if(shell){
      const d=deg(x,z);
      if(y===19) id=(Math.floor(d/26)%2===0)?S:B;        // alternating base band
      else if(y===20){
        if(d<=5) id=R2;                                  // red status light
        else if(d>=40&&d<=70) id=B;
        else if(d>=150) id=B;
      } else if(y===21){
        if(d<=12) id=B;                                  // radar eye lens
        else if(d<=22) id=C;                             // eye housing
        else if(d>=40&&d<=70) id=B;
        else if(d>=150) id=B;
      } else if(y===22){
        if(d<=22) id=C;                                  // eye housing top
        else if(d>=45&&d<=75) id=S;
      } else if(y===23){
        if(d<=10) id=S;                                  // upper holoprojector
        else if(d>=80&&d<=100) id=S;
      } else if(y===25) id=S;                            // silver cap
    }
    block(x,y,z,id);
  }
}
block(4,21,-4,S);  // protruding holoprojectors
block(-4,21,-4,S);

// ================= LEGS (mirrored) =================
for(let s=-1;s<=1;s+=2){
  // shoulder disc, x=|6..8|, centered (y15,z0), r~3.3
  for(let i=6;i<=8;i++){
    const X=s*i;
    for(let dy=-3;dy<=3;dy++)for(let dz=-3;dz<=3;dz++){
      const d2=dy*dy+dz*dz;
      if(d2>11) continue;
      let id=W;
      if(i===8) id = d2<=1 ? B : (d2>=8 ? C : W);        // blue hub + dark rim
      else if(d2>=8) id=S;
      block(X,15+dy,dz,id);
    }
  }
  // leg column
  for(let y=4;y<=12;y++)for(let i=7;i<=8;i++)for(let z=-1;z<=1;z++){
    block(s*i,y,z,(i===8&&z===0)?S:W);                   // gray cable stripe outside
  }
  box(s*7,3,-2,s*8,3,2,W);                               // ankle
  box(s*6,2,-3,s*9,2,3,W);                               // foot body
  box(s*7,2,-3,s*8,2,-3,B);                              // blue toe detail
  box(s*6,1,-3,s*9,1,3,C);                               // tread
  box(s*6,1,-4,s*9,1,-4,C);                              // toe tread
  box(s*6,1,4,s*9,1,4,C);                                // heel tread
}

// ================= CENTER THIRD LEG (front) =================
box(-1,3,-3,1,4,-2,W);    // strut from body bottom
box(-1,2,-4,1,3,-2,W);    // shin
box(-1,2,-5,1,2,-2,W);    // foot top
box(-1,1,-5,1,1,-2,C);    // tread
block(0,3,-4,S);          // hydraulic detail

// ================= GONK POWER DROID sidekick =================
disk(12,0,9,4,SAND);
box(11,3,7,14,6,10,C);    // boxy body
box(11,6,7,14,6,10,S);    // top plate
box(11,1,8,12,2,9,S);     // leg
box(13,1,8,14,2,9,S);     // leg
block(12,5,7,B);          // eye
block(13,5,7,B);          // eye
box(11,4,8,11,5,9,S);     // side vent
box(14,4,8,14,5,9,S);     // side vent

// ================= scattered desert rocks / dunes =================
disk(-13,0,-8,3,SAND);
sphere(-13,0,-8,2,S);
disk(-15,0,4,2,SAND);
sphere(-15,0,11,2,C);
disk(15,0,-6,3,SAND);
block(15,1,-6,S);