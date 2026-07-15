// scorpion-4x-opus — prompt:
// a giant scorpion...

const meta = undefined;
// (ignore) — plain builder script below

// ---- helpers ----
function thickSeg(x1,y1,z1,x2,y2,z2,id,r){
  const dx=x2-x1, dy=y2-y1, dz=z2-z1;
  const steps=Math.max(1, Math.round(Math.max(Math.abs(dx),Math.abs(dy),Math.abs(dz))*2));
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    const x=Math.round(x1+dx*t), y=Math.round(y1+dy*t), z=Math.round(z1+dz*t);
    cube(x-r,y-r,z-r,x+r,y+r,z+r,id);
  }
}

const BODY=COBBLE, PLATE=STONE, ACCENT=BRICK;

// ---- clear the surrounding forest so the silhouette reads clean ----
// (targeted volume around the scorpion, ground preserved)
cube(-17,1,-19, 17,25,15, AIR);

// ---- main body: overlapping segmented spheres along the spine (x=0) ----
// front (head/cephalothorax) faces NORTH (-Z)
const spine=[
  [0,6,-6,4],   // head
  [0,6,-2,5],   // thorax (widest)
  [0,6, 2,5],
  [0,6, 6,4],   // abdomen
  [0,5,10,3],   // rear
  [0,5,13,2],   // tail base
];
for(const [cx,cy,cz,r] of spine) sphere(cx,cy,cz,r,BODY);

// ---- dorsal armor plating: raised STONE bands with BRICK grooves ----
for(let s=0;s<spine.length-1;s++){
  const [ , cy, cz, r]=spine[s];
  const top=cy+r-1;
  cube(-(r-1),top,cz-1, (r-1),top+1,cz+1, PLATE);   // plate
  cube(-(r-1),top+1,cz+2, (r-1),top+1,cz+2, ACCENT); // groove line
}

// ---- head detail: eyes + chelicerae (mouth pincers) ----
block(-2,8,-9,ACCENT); block(2,8,-9,ACCENT);          // main eyes
block(-1,9,-7,ACCENT); block(1,9,-7,ACCENT);          // median eyes
cube(-1,4,-11, -1,5,-9, PLATE);                        // left chelicera
cube( 1,4,-11,  1,5,-9, PLATE);                        // right chelicera
block(-1,4,-11,ACCENT); block(1,4,-11,ACCENT);

// ---- eight walking legs (4 pairs), bent knees, feet on ground ----
function leg(side){ // side = +1 right, -1 left
  const anchors=[
    // [hipZ, kneeX, kneeY, kneeZ, footX, footZ]
    [-3, 12, 9, -8, 16, -12],
    [ 0, 13, 9, -2, 17, -4],
    [ 3, 13, 9,  5, 17,  7],
    [ 6, 12, 9, 10, 16, 13],
  ];
  for(const [hz,kx,ky,kz,fx,fz] of anchors){
    const hx=4*side, sx=side;
    thickSeg(hx,6,hz, kx*sx,ky,kz, BODY,0);   // femur (up to knee)
    thickSeg(kx*sx,ky,kz, fx*sx,0,fz, BODY,0);// tibia (down to foot)
    block(kx*sx,ky,kz,ACCENT);                // knee joint
    block(fx*sx,0,fz,PLATE);                  // foot
  }
}
leg(1); leg(-1);

// ---- big front claws (pedipalps) reaching NORTH ----
function claw(side){
  const s=side;
  const shoulder=[5*s,6,-6];
  const elbow=[11*s,6,-11];
  const wrist=[10*s,5,-15];
  thickSeg(...shoulder, ...elbow, BODY,1);   // upper arm (beefy)
  thickSeg(...elbow, ...wrist, BODY,1);      // forearm
  block(elbow[0],elbow[1]+1,elbow[2],ACCENT);// elbow spike
  // pincer hand base
  cube(8*s,4,-16, 12*s,6,-14, BODY);
  // fixed finger (upper) + moving finger (lower), gap between = the grip
  thickSeg(11*s,6,-16, 12*s,6,-20, PLATE,0);
  thickSeg(9*s,4,-16, 10*s,4,-20, PLATE,0);
  block(12*s,6,-20,ACCENT); block(10*s,4,-20,ACCENT); // sharp tips
}
claw(1); claw(-1);

// ---- segmented tail (metasoma) arcing up then curling forward over the back ----
const tail=[
  [0, 8,13,3],
  [0,11,14,3],
  [0,14,14,3],
  [0,17,13,2],
  [0,19,10,2],
  [0,21, 7,2],
];
for(let i=0;i<tail.length;i++){
  const [cx,cy,cz,r]=tail[i];
  sphere(cx,cy,cz,r, i%2? PLATE : BODY);   // alternating banded segments
}
// telson (venom bulb) + downward-forward stinger
sphere(0,22,4,2,ACCENT);
thickSeg(0,22,4, 0,17,1, ACCENT,0);   // curving stinger
block(0,17,1,ACCENT); block(0,16,1,ACCENT); // needle point