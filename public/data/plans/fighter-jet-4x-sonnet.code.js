// fighter-jet-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
function lerp(a,b,t){ return a + (b-a)*t; }
function clamp01(t){ return Math.max(0, Math.min(1,t)); }

const bodyPts = [
  [-18, 0.2, 0.2],
  [-16, 1.0, 0.8],
  [-13, 1.8, 1.3],
  [-10, 2.3, 1.7],
  [-6,  2.9, 2.0],
  [-2,  3.2, 2.2],
  [3,   3.2, 2.2],
  [7,   2.9, 2.0],
  [10,  2.4, 1.7],
  [13,  1.8, 1.4],
];

function bodyRadiusAt(z){
  if (z <= bodyPts[0][0]) return [bodyPts[0][1], bodyPts[0][2]];
  if (z >= bodyPts[bodyPts.length-1][0]) return [bodyPts[bodyPts.length-1][1], bodyPts[bodyPts.length-1][2]];
  for (let i=0;i<bodyPts.length-1;i++){
    const a=bodyPts[i], b=bodyPts[i+1];
    if (z>=a[0] && z<=b[0]){
      const t=(z-a[0])/(b[0]-a[0]);
      return [lerp(a[1],b[1],t), lerp(a[2],b[2],t)];
    }
  }
  return [1,1];
}

function centerYAt(z){
  return Math.round(16 - 0.16*(z+18));
}

// ---- Fuselage ----
for (let z=-18; z<=13; z++){
  const [rx, ry] = bodyRadiusAt(z);
  const irx = Math.round(rx);
  const iry = Math.round(ry);
  const cy = centerYAt(z);
  if (irx<=0 && iry<=0){
    block(0, cy, z, STONE);
  } else {
    cube(-irx, cy-iry, z, irx, cy+iry, z, STONE);
  }
}

// belly stripe accent
for (let z=-9; z<=8; z++){
  const [, ry] = bodyRadiusAt(z);
  const iry = Math.round(ry);
  const cy = centerYAt(z);
  block(0, cy-iry, z, BRICK);
}

// side air intakes
for (let z=-7; z<=-4; z++){
  const [rx, ] = bodyRadiusAt(z);
  const irx = Math.round(rx);
  const cy = centerYAt(z);
  block(irx, cy, z, COBBLE);
  block(-irx, cy, z, COBBLE);
}

// canopy (cockpit glass bubble)
{
  const z0=-11, z1=-4;
  for (let z=z0; z<=z1; z++){
    const [, ry] = bodyRadiusAt(z);
    const iry = Math.round(ry);
    const cy = centerYAt(z);
    const t = clamp01((z-z0)/(z1-z0));
    const bubble = Math.round(lerp(0.5, 1.6, Math.sin(Math.PI*t)));
    if (bubble>0){
      cube(-1, cy+iry, z, 1, cy+iry+bubble, z, GLASS);
    }
  }
  const cyMid = centerYAt(-7);
  const [, ryMid] = bodyRadiusAt(-7);
  line(0, cyMid+Math.round(ryMid)+2, -11, 0, cyMid+Math.round(ryMid)+2, -4, STONE);
}

// nose pitot boom
line(0, 16, -18, 0, 16, -21, STONE);

// ---- Wings (swept delta) ----
const wingRootLE=-3, wingRootTE=11, wingTipLE=6, wingTipTE=9.5;
const wingInnerX=3, wingOuterX=17;
for (let x=wingInnerX; x<=wingOuterX; x++){
  const t = clamp01((x-wingInnerX)/(wingOuterX-wingInnerX));
  const zLE = Math.round(lerp(wingRootLE, wingTipLE, t));
  const zTE = Math.round(lerp(wingRootTE, wingTipTE, t));
  if (zTE < zLE) continue;
  const cy = centerYAt(Math.round(lerp(wingRootLE, wingTipLE, t*0.3)));
  const thick = t<0.6 ? 1 : 0;
  const yTop = cy + thick;
  cube(x, cy, zLE, x, yTop, zTE, STONE);
  cube(-x, cy, zLE, -x, yTop, zTE, STONE);
}

// wingtip / mid-wing missile pylons
function missile(mx, mz){
  const my = centerYAt(mz) - 2;
  cube(mx-1, my, mz-2, mx+1, my, mz+2, COBBLE);
  block(mx, my, mz-3, BRICK);
  block(mx, my+1, mz, STONE);
}
missile(17, 3);
missile(-17, 3);
missile(10, 3);
missile(-10, 3);

// ---- Horizontal stabilizers ----
const stabInnerX=2, stabOuterX=8;
const stabRootLE=12, stabRootTE=18, stabTipLE=15, stabTipTE=17;
for (let x=stabInnerX; x<=stabOuterX; x++){
  const t = clamp01((x-stabInnerX)/(stabOuterX-stabInnerX));
  const zLE = Math.round(lerp(stabRootLE, stabTipLE, t));
  const zTE = Math.round(lerp(stabRootTE, stabTipTE, t));
  if (zTE < zLE) continue;
  const cy = centerYAt(Math.round(lerp(stabRootLE, stabTipLE, t)));
  cube(x, cy, zLE, x, cy, zTE, STONE);
  cube(-x, cy, zLE, -x, cy, zTE, STONE);
}

// ---- Vertical tail fin ----
{
  const finBaseZLE=11, finBaseZTE=18;
  const finTopZLE=14, finTopZTE=16;
  const finHeight=7;
  for (let h=0; h<=finHeight; h++){
    const t = clamp01(h/finHeight);
    const zLE = Math.round(lerp(finBaseZLE, finTopZLE, t));
    const zTE = Math.round(lerp(finBaseZTE, finTopZTE, t));
    if (zTE < zLE) continue;
    const zForRy = Math.round(lerp(finBaseZLE, finTopZLE, t));
    const cy = centerYAt(zForRy);
    const y = cy + Math.round(bodyRadiusAt(zForRy)[1]) + h;
    cube(0, y, zLE, 0, y, zTE, STONE);
  }
  line(0, centerYAt(14)+3, 14, 0, centerYAt(14)+9, 17, BRICK);
}

// ---- Twin engine nozzles ----
function nozzle(nx){
  for (let z=13; z<=19; z++){
    const t = clamp01((z-13)/6);
    const r = Math.round(lerp(1.3, 0.8, t));
    const cy = centerYAt(z) - 1;
    if (r<=0){ block(nx, cy, z, COBBLE); continue; }
    cube(nx-r, cy-r, z, nx+r, cy+r, z, COBBLE);
  }
  block(nx, centerYAt(19)-1, 20, BRICK);
}
nozzle(-2);
nozzle(2);

// ---- Contrail puffs ----
function puff(px,py,pz,r){ sphere(px,py,pz,r,SNOW); }
puff(-2, 9, 18, 2);
puff(2, 9, 18, 2);
puff(-3, 8, 19, 1);
puff(3, 8, 19, 1);
puff(0, 7, 20, 1);
