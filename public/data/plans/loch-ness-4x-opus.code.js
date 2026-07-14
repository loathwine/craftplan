// loch-ness-4x-opus — prompt:
// the Loch Ness Monster...

function ell(cx,cy,cz,rx,ry,rz,id,half){
  const y0 = half ? 0 : -ry;
  for(let x=-rx;x<=rx;x++){
    for(let y=y0;y<=ry;y++){
      for(let z=-rz;z<=rz;z++){
        const v=(x*x)/(rx*rx+0.001)+(y*y)/(ry*ry+0.001)+(z*z)/(rz*rz+0.001);
        if(v<=1.0) block(cx+x,cy+y,cz+z,id);
      }
    }
  }
}
function ring(cx,cy,cz,R,id){
  for(let a=0;a<360;a+=5){
    const x=Math.round(cx+R*Math.cos(a*Math.PI/180));
    const z=Math.round(cz+R*Math.sin(a*Math.PI/180));
    block(x,cy,z,id);
  }
}

// ---- LOCH ----
// clear trees/terrain that would poke through the water surface
cube(-22,2,-4,22,14,20,AIR);
// water: full surface layer + a central deeper layer so it never reads see-through
cube(-22,1,-2,22,1,18,GLASS);
cube(-22,0,3,22,0,15,GLASS);

// ---- NESSIE BODY (humps break the surface, distinct like the classic photo) ----
// humps run west->east along X at z=8; head/neck at the east end curling toward the camera (north)
const humps = [
  [-17,1,8, 3,2,3],   // low tail-side bump
  [-11,1,8, 5,3,3],   // hump 1
  [-4,1,8, 5,3,3],    // hump 2
  [3,1,8, 6,4,4],     // big hump, base of neck
];
for(const h of humps){ ell(h[0],h[1],h[2],h[3],h[4],h[5],LEAVES,true); }

// spine ridge (stone plates) cresting each hump
for(const h of humps){
  const cx=h[0], rx=h[3], ry=h[4];
  for(let i=-rx+2;i<=rx-2;i+=2){
    const hh=Math.round(ry*Math.sqrt(Math.max(0,1-(i*i)/(rx*rx))));
    block(cx+i,1+hh,8,STONE);
    if(Math.abs(i)<rx-3) block(cx+i,1+hh+1,8,STONE);
  }
}

// darker scale speckles for texture (deterministic scatter)
for(const h of humps){
  const cx=h[0], rx=h[3], ry=h[4];
  for(let s=0;s<8;s++){
    const i=((s*37)%(2*rx))-rx;
    const hh=Math.round(ry*Math.sqrt(Math.max(0,1-(i*i)/(rx*rx))));
    const zoff=((s*13)%5)-2;
    block(cx+i,1+Math.max(1,hh-1),8+zoff,COBBLE);
  }
}

// raised curling tail tip out of the water at the far west
sphere(-19,2,8,2,LEAVES);
sphere(-20,4,8,2,LEAVES);
sphere(-20,6,8,1,LEAVES);
block(-20,7,8,STONE);
sphere(-20,6,9,1,LEAVES);

// ---- NECK (S-curve rising and bowing toward the viewer) ----
const neck=[];
for(let t=0;t<=1.0001;t+=0.035){
  const x=5+7*t;
  const y=3+16*t;
  const z=9-4.5*t-1.4*Math.sin(t*Math.PI); // bow forward (north) toward camera
  const r=3.2-1.6*t;
  neck.push([Math.round(x),Math.round(y),Math.round(z),Math.max(1,Math.round(r))]);
}
for(const p of neck){ sphere(p[0],p[1],p[2],p[3],LEAVES); }
// dorsal fin plates down the back of the neck
for(let k=1;k<neck.length;k+=2){
  const p=neck[k];
  block(p[0],p[1]+p[3],p[2]+1,STONE);
}

// ---- HEAD (faces north, toward the camera) ----
const HX=12, HY=19, HZ=4;
ell(HX,HY,HZ,3,3,4,LEAVES,false);           // head bulb, snout runs toward -Z (front)
ell(HX,HY-1,0,2,1,1,LEAVES,false);           // snout tip
// eyes on the front face
block(HX-2,HY+1,1,SNOW); block(HX+2,HY+1,1,SNOW);
block(HX-2,HY+1,0,STONE); block(HX+2,HY+1,0,STONE); // pupils toward camera
// brow ridge
line(HX-3,HY+2,1,HX+3,HY+2,1,STONE);
// nostrils at snout tip
block(HX-1,HY,-1,STONE); block(HX+1,HY,-1,STONE);
// mouth line
line(HX-2,HY-1,0,HX+2,HY-1,0,STONE);
// little horns / antennae
block(HX-2,HY+3,4,LEAVES); block(HX-2,HY+4,4,STONE);
block(HX+2,HY+3,4,LEAVES); block(HX+2,HY+4,4,STONE);

// ---- FOAM where the body meets the water ----
for(const h of humps){ ring(h[0],2,8,h[3]+1,SNOW); }
ring(5,2,8,4,SNOW);          // spray at the neck base
ring(-19,2,8,3,SNOW);        // tail splash

// ---- FOREGROUND: a little fisherman's boat, north of the monster ----
cube(-1,1,-3,3,1,0,PLANKS);                 // hull floor
cube(-1,2,-3,-1,2,0,PLANKS);                // west gunwale
cube(3,2,-3,3,2,0,PLANKS);                  // east gunwale
cube(-1,2,-3,3,2,-3,PLANKS);                // prow
cube(-1,2,0,3,2,0,PLANKS);                  // stern
block(1,2,-1,OAK_LOG); block(1,3,-1,OAK_LOG); // fisherman body
block(1,4,-1,SNOW);                          // head
line(1,4,-1,3,6,-4,OAK_LOG);                 // fishing rod
ring(1,2,-1,3,SNOW);                         // ripples around the boat

// ---- SHORELINE REEDS + LILY PADS for depth ----
const reeds=[[-21,15],[-18,17],[21,4],[20,16],[16,-2],[-16,-2],[8,18]];
for(const rd of reeds){
  const x=rd[0], z=rd[1];
  cube(x,2,z,x,4,z,OAK_LOG);
  block(x,5,z,LEAVES);
  if(x+1<=22) block(x+1,4,z,LEAVES);
}
const pads=[[-8,3],[10,12],[-13,13],[6,4],[-2,15],[15,10],[-15,6],[17,14]];
for(const pd of pads){ block(pd[0],2,pd[1],LEAVES); }