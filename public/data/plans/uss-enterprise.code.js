// uss-enterprise — prompt:
// The USS Enterprise starship from Star Trek. SHAPE IS KEY (three parts): (1) a big flat round SAUCER section at the front - a circular disc like a plate, 24+ blocks across; (2) a cigar-shaped engineeri...

// ===== USS ENTERPRISE — hovering, saucer facing -Z =====
const ceil = Math.ceil, rnd = Math.round, cos = Math.cos, sin = Math.sin, PI = Math.PI;

// vertical filled disk (faces ±Z), in the XY plane at fixed z
function diskXY(cx, cy, z, r, id){
  const rr=(r+0.45)*(r+0.45), R=ceil(r);
  for(let dx=-R;dx<=R;dx++)for(let dy=-R;dy<=R;dy++)
    if(dx*dx+dy*dy<=rr) block(cx+dx,cy+dy,z,id);
}
// solid cylinder running along Z
function cylZ(cx,cy,z1,z2,r,id){ for(let z=z1;z<=z2;z++) diskXY(cx,cy,z,r,id); }
// vertical ring outline (XY plane)
function ringXY(cx,cy,z,r,id){
  const steps=Math.max(12,ceil(2*PI*r));
  for(let i=0;i<steps;i++){const a=i/steps*2*PI;
    block(cx+rnd(r*cos(a)),cy+rnd(r*sin(a)),z,id);}
}
// horizontal ring outline (XZ plane)
function ringXZ(cx,y,cz,r,id){
  const steps=Math.max(12,ceil(2*PI*r));
  for(let i=0;i<steps;i++){const a=i/steps*2*PI;
    block(cx+rnd(r*cos(a)),y,cz+rnd(r*sin(a)),id);}
}
// alternating horizontal ring (window band)
function altRingXZ(cx,y,cz,r,aId,bId,every){
  const steps=Math.max(12,ceil(2*PI*r));
  for(let i=0;i<steps;i++){const a=i/steps*2*PI;
    block(cx+rnd(r*cos(a)),y,cz+rnd(r*sin(a)), (i%every===0)?aId:bId);}
}

const SX=0, SY=25, SZ=-4, SR=13;

// ---- 1. SAUCER (core, mostly SNOW) ----
const prof=[[-3,6],[-2,10],[-1,12],[0,13],[1,13],[2,11],[3,8],[4,4]];
for(const seg of prof) disk(SX, SY+seg[0], SZ, seg[1], SNOW);

// ---- 2. ENGINEERING HULL (cigar, below & behind) ----
const HX=0, HY=16, HZ1=-3, HZ2=19, HR=4;
diskXY(HX,HY,HZ1,1.6,SNOW);
diskXY(HX,HY,HZ1+1,2.6,SNOW);
diskXY(HX,HY,HZ1+2,3.4,SNOW);
cylZ(HX,HY,HZ1+3,HZ2-3,HR,SNOW);
diskXY(HX,HY,HZ2-2,3.4,SNOW);
diskXY(HX,HY,HZ2-1,2.6,SNOW);
diskXY(HX,HY,HZ2,1.8,STONE);

// ---- 3. NACELLES (twin cylinders on sides, glowing GLASS front caps) ----
function nacelle(sgn){
  const nx=sgn*16, NY=28, NZ1=2, NZ2=21, NR=2.6;
  diskXY(nx,NY,NZ1-1,1.3,GLASS);
  diskXY(nx,NY,NZ1,2.1,GLASS);
  diskXY(nx,NY,NZ1+1,NR,GLASS);
  ringXY(nx,NY,NZ1+1,NR,BRICK);          // red collector rim
  cylZ(nx,NY,NZ1+2,NZ2-1,NR,SNOW);       // white body
  diskXY(nx,NY,NZ2,2.0,STONE);           // rear cap
  diskXY(nx,NY,NZ2-1,NR,STONE);
  for(let z=NZ1+3; z<=NZ2-2; z++){       // glowing warp grilles
    block(nx+3,NY,z,GLASS);
    block(nx-3,NY,z,GLASS);
    block(nx,NY+3,z,GLASS);
  }
}
nacelle(1); nacelle(-1);

// ---- 4. PYLONS (thin swept struts hull -> nacelles) ----
function pylon(sgn){
  const xi=3, xo=15, yi=18, yo=27, thick=3;
  for(let ax=xi; ax<=xo; ax++){
    const t=(ax-xi)/(xo-xi);
    const yT=rnd(yi+(yo-yi)*t), yB=yT-thick;
    for(let y=yB;y<=yT;y++)
      for(let z=11;z<=13;z++)
        block(sgn*ax,y,z,STONE);
  }
}
pylon(1); pylon(-1);

// ---- 5. NECK (short connector) ----
cube(-2,20,4,2,24,7,SNOW);
block(-2,22,4,GLASS); block(2,22,4,GLASS);
block(-2,23,4,GLASS); block(2,23,4,GLASS); block(0,22,4,GLASS);

// ---- 6. DEFLECTOR DISH (BRICK, front of hull) ----
diskXY(HX,HY,HZ1-1,2.6,BRICK);
diskXY(HX,HY,HZ1-2,2.0,BRICK);
block(HX,HY,HZ1-3,GLASS);
ringXY(HX,HY,HZ1-1,2.6,STONE);

// ---- 7. DETAIL PASS ----
// saucer rim: grey edge + window band (two rows)
altRingXZ(SX,SY,SZ,SR,GLASS,STONE,3);
altRingXZ(SX,SY+1,SZ,SR,STONE,GLASS,3);
altRingXZ(SX,SY-1,SZ,12,GLASS,SNOW,4);     // underside windows
// concentric panel lines on top
ringXZ(SX,SY+2,SZ,9,STONE);
ringXZ(SX,SY+3,SZ,5,STONE);
altRingXZ(SX,SY+2,SZ,11,GLASS,SNOW,4);
// radial panel spokes on upper hull
for(let k=0;k<8;k++){
  const a=k/8*2*PI;
  for(let rr=5; rr<=9; rr++)
    block(SX+rnd(rr*cos(a)), SY+2, SZ+rnd(rr*sin(a)), STONE);
}
// bridge tower (forward of center)
const bz=SZ-3;
disk(SX,SY+4,bz,3,SNOW);
disk(SX,SY+5,bz,2,STONE);
block(SX,SY+6,bz,GLASS);
// lower sensor dome
disk(SX,SY-4,SZ,2,STONE);
block(SX,SY-5,SZ,STONE);
// impulse engines (red glow) at saucer rear
cube(-2,SY,8,2,SY+1,9,BRICK);
// engineering hull windows + grey bands
for(let z=HZ1+4; z<=HZ2-4; z+=2){
  block(HX+4,HY,z,GLASS); block(HX-4,HY,z,GLASS);
  block(HX,HY+4,z,GLASS);
}
ringXY(HX,HY,HZ1+5,HR,STONE);
ringXY(HX,HY,HZ2-5,HR,STONE);