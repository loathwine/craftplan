// ferris-wheel-4x-opus — prompt:
// a Ferris wheel...

const meta = null; // (ignore) — plain build script below
// NOTE: the sandbox executes the body; helper defs + calls follow.

// ---------- Ferris wheel ----------
const cx = 0, cy = 19, cz = 6, R = 13;   // axle centre, wheel radius
const TAU = Math.PI * 2;

// thick line helper (chunky steel members) — 2 wide in X, 3 deep in Z
function beam(x1,y1,z1,x2,y2,z2,id){
  for(let ox=0;ox<=1;ox++) for(let oz=-1;oz<=1;oz++)
    line(x1+ox,y1,z1+oz, x2+ox,y2,z2+oz, id);
}

// ---- 1. rim (double band, white outer / steel inner, 3 deep) ----
for(let i=0;i<900;i++){
  const t = i/900*TAU;
  const c = Math.cos(t), s = Math.sin(t);
  const xo = Math.round(cx + R*c),     yo = Math.round(cy + R*s);
  const xi = Math.round(cx + (R-1)*c), yi = Math.round(cy + (R-1)*s);
  for(let z=cz-1; z<=cz+1; z++){
    block(xo, yo, z, SNOW);
    block(xi, yi, z, STONE);
  }
}

// ---- 2. rim lights (alternating dots just outside the rim) ----
for(let k=0;k<24;k++){
  const t = k/24*TAU;
  const x = Math.round(cx + (R+1)*Math.cos(t));
  const y = Math.round(cy + (R+1)*Math.sin(t));
  const col = (k%2)? BRICK : ICE;
  block(x, y, cz-1, col);
  block(x, y, cz+1, col);
}

// ---- 3. inner structural ring (radius 7) ----
for(let i=0;i<500;i++){
  const t = i/500*TAU;
  const x = Math.round(cx + 7*Math.cos(t));
  const y = Math.round(cy + 7*Math.sin(t));
  block(x, y, cz, STONE);
}

// ---- 4. spokes: hub -> inner ring -> rim, 12 of them ----
for(let k=0;k<12;k++){
  const t = k/12*TAU;
  const rx = Math.round(cx + (R-1)*Math.cos(t));
  const ry = Math.round(cy + (R-1)*Math.sin(t));
  const hx = Math.round(cx + 2*Math.cos(t));
  const hy = Math.round(cy + 2*Math.sin(t));
  for(let z=cz-1; z<=cz+1; z++) line(hx,hy,z, rx,ry,z, STONE);
}

// ---- 5. hub / axle (runs along Z, through both support frames) ----
for(let z=2; z<=10; z++)
  for(let dx=-2; dx<=2; dx++)
    for(let dy=-2; dy<=2; dy++)
      if(dx*dx+dy*dy <= 5) block(cx+dx, cy+dy, z, COBBLE);
// axle end caps
block(cx, cy, 1, STONE); block(cx, cy, 11, STONE);

// ---- 6. support A-frames (front zf, back zb) ----
function frame(zf){
  // two splayed legs
  beam(-12,0,zf, 0,18,zf, COBBLE);
  beam( 12,0,zf, 0,18,zf, COBBLE);
  // central king post
  beam(0,1,zf, 0,18,zf, COBBLE);
  // horizontal rungs
  beam(-9,6,zf, 9,6,zf, STONE);
  beam(-5,11,zf, 5,11,zf, STONE);
  // diagonal cross braces
  beam(-9,6,zf, 0,11,zf, STONE);
  beam( 9,6,zf, 0,11,zf, STONE);
  // wide feet
  cube(-13,-1,zf-1, -11,0,zf+1, STONE);
  cube( 11,-1,zf-1,  13,0,zf+1, STONE);
  cube(-1,-1,zf-1,   1,0,zf+1, STONE);
}
frame(2);
frame(10);

// struts tying the two frames together
beam(-12,0,2, -12,0,10, STONE);
beam( 12,0,2,  12,0,10, STONE);
beam(-5,11,2, -5,11,10, STONE);
beam( 5,11,2,  5,11,10, STONE);

// ---- 7. boarding platform + foundation ----
cube(-6,-1,3, 6,-1,11, COBBLE);          // foundation pad
cube(-6,0,3, 6,0,11, PLANKS);            // deck
cube(-6,1,3, -6,2,11, PLANKS);           // deck side rails
cube( 6,1,3,  6,2,11, PLANKS);
// little station roof at the back edge
cube(-6,4,9, 6,4,12, BRICK);
for(let z=9; z<=12; z++){ block(-6,3,z,OAK_LOG); block(6,3,z,OAK_LOG); }
block(-6,3,9,OAK_LOG); block(6,3,9,OAK_LOG);

// ---- 8. gondolas / cabins hanging from the rim ----
const cabColors = [BRICK, GLASS, PLANKS, ICE, SNOW, BRICK, GLASS, ICE];
for(let k=0;k<8;k++){
  const t = k/8*TAU + Math.PI/8;         // offset off the spokes
  const px = Math.round(cx + (R-1)*Math.cos(t));
  const py = Math.round(cy + (R-1)*Math.sin(t));
  const col = cabColors[k];
  // hanger link from rim down to cabin
  block(px, py, cz, STONE);
  block(px, py-1, cz, STONE);
  // cabin body (hangs below the pivot), open-ish car
  cube(px-1, py-4, cz-2, px+1, py-2, cz+2, col);
  // roof + floor accents
  cube(px-1, py-2, cz-2, px+1, py-2, cz+2, SNOW);
  cube(px-1, py-4, cz-2, px+1, py-4, cz+2, STONE);
  // window band (glass) on the front face
  block(px, py-3, cz-2, GLASS);
}

// ---- 9. crowning ornament ----
block(cx, cy+R+1, cz, BRICK);
block(cx, cy+R+2, cz, SNOW);