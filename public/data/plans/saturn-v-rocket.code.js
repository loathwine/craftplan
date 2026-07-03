// saturn-v-rocket — prompt:
// A giant Saturn V moon rocket on its launch pad at night, about to launch. THE ROCKET IS THE STAR and must be VERY TALL and slender: a white SNOW cylinder at least 30 blocks tall and only 5-6 wide, bui...

cube(-3,0,-3, 3,33,3, AIR);
cube(-11,1,-11, 11,8,11, AIR);

const OAK = OAK_LOG;

function speckSphere(cx,cy,cz,r,baseId,accId,mod,rem){
  const r2=r*r, R=Math.ceil(r);
  for(let dx=-R;dx<=R;dx++)for(let dy=-R;dy<=R;dy++)for(let dz=-R;dz<=R;dz++){
    if(dx*dx+dy*dy+dz*dz<=r2){
      const x=cx+dx,y=cy+dy,z=cz+dz;
      if(y<-8||y>33)continue;
      const h=((x*73856093)^(y*19349663)^(z*83492791))>>>0;
      block(x,y,z,(h%mod===rem)?accId:baseId);
    }
  }
}

// ---- blast apron (dark, scorched) ----
disk(0,0,0,12,COBBLE);
for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++){
  const d=x*x+z*z;
  if(d<=144&&d>=49){
    const h=((x*92837)^(z*47963))>>>0;
    if(h%5===0) block(x,0,z,(h%2?SAND:BRICK));
  }
}

// ---- launch pad + flame trench ----
cube(-7,-1,-7, 9,0,7, COBBLE);
cube(-2,-4,-2, 2,0,2, AIR);
for(let x=-7;x<=9;x+=2){ block(x,1,-7,STONE); block(x,1,7,STONE); }
for(let z=-7;z<=7;z+=2){ block(-7,1,z,STONE); block(9,1,z,STONE); }

// ---- ROCKET BODY (3 stages, snow + cobble bands, tapering nose) ----
function bodyAt(y){
  if(y===0)  return [2.5,COBBLE];   // engine ring
  if(y<=9)   return [2.5,SNOW];     // stage 1
  if(y<=11)  return [2.5,COBBLE];   // band A
  if(y<=19)  return [2.5,SNOW];     // stage 2
  if(y<=21)  return [2.5,COBBLE];   // band B
  if(y<=25)  return [2.4,SNOW];     // stage 3
  if(y===26) return [2.4,COBBLE];   // instrument-unit band
  if(y===27) return [2.0,SNOW];     // cone
  if(y===28) return [1.6,SNOW];
  if(y===29) return [1.3,SNOW];
  if(y===30) return [1.0,SNOW];
  return [0.6,SNOW];                // y=31 tip
}
for(let y=0;y<=31;y++){ const a=bodyAt(y); disk(0,y,0,a[0],a[1]); }
block(0,32,0,COBBLE); block(0,33,0,COBBLE);   // escape-tower spike

// systems conduit line (-Z face)
for(let y=1;y<=25;y++){ if(y<10||(y>11&&y<20)||y>21) block(0,y,-2,COBBLE); }

// flag patch (BRICK + SNOW) on +Z face
for(let y=13;y<=16;y++)for(let x=-1;x<=1;x++){
  let id=(y%2===0)?BRICK:SNOW;
  if(y>=15&&x===-1) id=BRICK;
  block(x,y,2,id);
}

// ---- GANTRY (slim, +X side, shorter than rocket) ----
const gx1=7,gx2=9,gz1=-1,gz2=1,gTop=24;
for(const L of [[gx1,gz1],[gx2,gz1],[gx1,gz2],[gx2,gz2]])
  for(let y=0;y<=gTop;y++) block(L[0],y,L[1],COBBLE);
const rings=[2,5,8,11,14,17,20,23];
for(const ry of rings){
  for(let x=gx1;x<=gx2;x++){ block(x,ry,gz1,OAK); block(x,ry,gz2,OAK); }
  for(let z=gz1;z<=gz2;z++){ block(gx1,ry,z,OAK); block(gx2,ry,z,OAK); }
}
for(let i=0;i<rings.length-1;i++){
  const y0=rings[i],y1=rings[i+1];
  line(gx1,y0,gz1, gx2,y1,gz1, OAK);
  line(gx1,y0,gz2, gx2,y1,gz2, OAK);
  if(i%2===0){ line(gx2,y0,gz1, gx1,y1,gz1, OAK); line(gx2,y0,gz2, gx1,y1,gz2, OAK); }
  line(gx2,y0,gz1, gx2,y1,gz2, OAK);
}
cube(gx1,gTop,gz1, gx2,gTop,gz2, COBBLE);
for(let x=4;x<=gx1;x++) block(x,gTop,0,OAK);   // hammerhead jib
block(4,gTop-1,0,OAK);
for(let y=gTop+1;y<=gTop+4;y++) block(8,y,0,COBBLE);  // lightning mast
function walkway(wy){
  for(let x=3;x<=gx1;x++)for(let z=-1;z<=1;z++) block(x,wy,z,PLANKS);
  for(let x=3;x<=gx1;x++){ block(x,wy+1,-1,OAK); block(x,wy+1,1,OAK); }
}
walkway(12); walkway(19);

// ---- lightning towers (frame the rocket, -X side) ----
function lightTower(tx,tz,h){
  for(let y=0;y<=h;y++) block(tx,y,tz,COBBLE);
  for(let ry=6;ry<h;ry+=6){ block(tx-1,ry,tz,OAK); block(tx+1,ry,tz,OAK); block(tx,ry,tz-1,OAK); block(tx,ry,tz+1,OAK); }
  block(tx,h+1,tz,STONE);
}
lightTower(-7,-7,18); lightTower(-7,7,18);

// ---- SMOKE CLOUDS (billowing, spreading sideways) ----
const clouds=[
  [0,-3,0,4],
  [5,-3,0,4],[-5,-3,0,4],[0,-3,5,4],[0,-3,-5,4],
  [8,-1,5,4],[8,-1,-4,4],[-8,-1,5,4],[-8,-1,-5,4],
  [0,-1,9,4],[0,-1,-9,4],
  [12,1,6,4],[12,1,-5,3],[-12,1,5,3],[-11,1,-6,4],
  [6,2,11,3],[-6,2,-11,3],[13,3,0,3],[-13,3,1,3]
];
for(const c of clouds) speckSphere(c[0],c[1],c[2],c[3],SNOW,GLASS,6,0);

// ---- FINS (4 triangular, flaring at the very bottom) drawn over base smoke ----
function finX(dir){
  for(let y=0;y<=6;y++){
    const outer=2+Math.round((6-y)*4/6);
    for(let xx=2;xx<=outer;xx++)for(let z=-1;z<=1;z++)
      block(dir*xx,y,z,(xx===outer&&y<=4)?COBBLE:SNOW);
  }
}
function finZ(dir){
  for(let y=0;y<=6;y++){
    const outer=2+Math.round((6-y)*4/6);
    for(let zz=2;zz<=outer;zz++)for(let x=-1;x<=1;x++)
      block(x,y,dir*zz,(zz===outer&&y<=4)?COBBLE:SNOW);
  }
}
finX(1); finX(-1); finZ(1); finZ(-1);

// ---- warm fire glow on inner cloud undersides ----
for(const c of clouds){
  if(Math.abs(c[0])<=9&&Math.abs(c[2])<=9)
    speckSphere(c[0],c[1]-c[3]+1,c[2],Math.max(1,c[3]-2),BRICK,SAND,2,0);
}

// ---- bright exhaust core (brightest, last) ----
cube(-1,-6,-1, 1,1,1, SAND);
speckSphere(0,-1,0,3,BRICK,SAND,2,0);
speckSphere(0,1,0,2,SAND,BRICK,2,0);