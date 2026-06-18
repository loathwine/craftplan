// greek-parthenon — prompt:
// The Parthenon, an ancient Greek temple, on a stone hilltop. A grand rectangular temple of SNOW and STONE (white marble): a colonnade of many tall fluted columns (STONE pillars evenly spaced with AIR b...

// ============ THE PARTHENON ============
// White-marble (SNOW + STONE) temple on a cobble/stone hilltop.
// The wide colonnade + triangular pediment face the viewer at -Z.

// ---------- helpers ----------
function ringBox(x1,y1,z1,x2,y2,z2,t,id){
  cube(x1,y1,z1,        x2,y2,z1+t-1, id);   // -Z wall
  cube(x1,y1,z2-t+1,    x2,y2,z2,     id);   // +Z wall
  cube(x1,y1,z1,        x1+t-1,y2,z2, id);   // -X wall
  cube(x2-t+1,y1,z1,    x2,y2,z2,     id);   // +X wall
}
function rnd(a,b,c){
  let n=Math.abs(Math.sin(a*12.9898+b*4.1414+c*78.233))*43758.5453;
  return n-Math.floor(n);
}
const topLine = x => 29 - Math.round(Math.abs(x)*7/16);   // shared roof/gable slope

// ---------- clear vegetation inside the build envelope ----------
cube(-21,2,-17, 21,9,15, AIR);
cube(-17,10,-13, 17,31,11, AIR);

// ---------- stepped platform : three big SNOW steps (stylobate) ----------
ringBox(-21,0,-17, 21,1,15, 2, SNOW);    // step 1 (widest)
ringBox(-19,2,-15, 19,3,13, 2, SNOW);    // step 2
ringBox(-17,4,-13, 17,5,11, 2, SNOW);    // step 3
cube(-17,5,-13, 17,5,11, SNOW);          // stylobate top floor

// ---------- colonnade : tall fluted marble columns ----------
const COL_TOP=16;
const broken={ "10,-11":14, "15,-1":9, "-15,4":11, "5,9":13 };  // weathered / snapped
function placeColumn(cx,cz){
  const key=cx+","+cz, isB=key in broken, top=isB?broken[key]:COL_TOP;
  cube(cx-1,6,cz-1, cx+1,6,cz+1, SNOW);                 // base
  for(let y=7;y<=top;y++){                              // fluted shaft
    for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++){
      let id=(dx!==0&&dz!==0)?STONE:SNOW;               // STONE corners = flute shadows
      if(rnd(cx+dx,y,cz+dz)<0.12) id=COBBLE;            // weathering
      block(cx+dx,y,cz+dz,id);
    }
  }
  if(isB){
    block(cx+1,top,cz+1,AIR); block(cx-1,top,cz-1,COBBLE);
    if(rnd(cx,top,cz)<0.5) block(cx-1,top,cz+1,AIR);    // jagged break
  } else {
    cube(cx-1,17,cz-1, cx+1,17,cz+1, SNOW);             // capital
    cube(cx-1,18,cz-1, cx+1,18,cz+1, SNOW);             // abacus
  }
}
for(const cx of [-15,-10,-5,0,5,10,15]){ placeColumn(cx,-11); placeColumn(cx,9); }
for(const cz of [-6,-1,4]){ placeColumn(-15,cz); placeColumn(15,cz); }

// ---------- entablature : architrave / frieze / cornice ----------
ringBox(-16,19,-12, 16,19,10, 3, SNOW);    // architrave
ringBox(-16,20,-12, 16,20,10, 3, STONE);   // frieze
ringBox(-16,21,-12, 16,21,10, 3, SNOW);    // cornice

// ---------- pediments : triangular STONE gables, front & back ----------
for(let x=-16;x<=16;x++){
  let t=topLine(x)-1;
  if(t>=22){
    cube(x,22,-12, x,t,-11, STONE);   // front gable (2 thick)
    cube(x,22, 9,  x,t,10,  STONE);   // back gable
  }
}

// ---------- roof : low-pitched COBBLE, with marble ridge & acroteria ----------
for(let x=-16;x<=16;x++){
  let t=topLine(x);
  cube(x,t-1,-12, x,t,10, COBBLE);
}
cube(0,29,-12, 0,29,10, SNOW);                                   // ridge sima
block(0,30,-12,SNOW); block(0,30,10,SNOW);                       // apex acroteria
block(-14,22,-12,SNOW); block(14,22,-12,SNOW);                   // front corner
block(-14,22,10,SNOW);  block(14,22,10,SNOW);                    // back corner

// ---------- stone hilltop : cobble apron + boulders ----------
ringBox(-22,-1,-18, 22,-1,16, 2, COBBLE);
ringBox(-22, 0,-18, 22, 0,16, 1, COBBLE);
const rocks=[[-21,-15],[20,-16],[-22,3],[21,2],[-20,13],[19,14],[0,-19]];
for(const [rx,rz] of rocks){
  let r=1+Math.round(rnd(rx,0,rz));
  sphere(rx,0,rz,r,(rnd(rx,1,rz)<0.5?STONE:COBBLE));
}

// ---------- cella : inner marble chamber (depth behind the colonnade) ----------
ringBox(-11,6,-7, 11,13,5, 1, SNOW);            // walls
cube(-3,6,-7, 3,12,-7, AIR);                    // doorway
ringBox(-11,14,-7, 11,14,5, 1, STONE);          // cella cornice
for(const px of [-4,4]) cube(px,6,-9, px,14,-9, SNOW);   // porch columns in antis
cube(-2,6,1, 2,7,3, STONE); cube(-2,8,1, 2,8,3, SNOW);   // altar within the naos

// ---------- fallen drums & toppled column (ancient ruin) ----------
function drum(x,z){ cube(x,6,z, x+1,7,z+1, (rnd(x,6,z)<0.5?STONE:COBBLE)); }
drum(6,-9); drum(-7,-8); drum(8,3); drum(-9,2);
cube(-8,4,-15, -7,4,-14, COBBLE);
cube(9,4,-15, 10,4,-14, STONE);
cube(-14,2,-16, -11,2,-16, COBBLE);             // a column drum lying on the steps

// ---------- olive shrubs (LEAVES) at the base ----------
const shrubs=[[-21,1,-16],[21,1,-15],[-20,0,13],[20,0,14],
              [-22,0,2],[22,0,-3],[-15,1,-17],[13,1,-17]];
for(const [sx,sy,sz] of shrubs){
  let r=(rnd(sx,sy,sz)<0.5)?1:2;
  sphere(sx,sy+r,sz,r,LEAVES);
}