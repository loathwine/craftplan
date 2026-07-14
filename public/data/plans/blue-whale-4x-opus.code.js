// blue-whale-4x-opus — prompt:
// a blue whale...

// ============================================================
// BLUE WHALE — swimming at the ocean surface, broadside to camera
// Body long axis along X (head east/+X, well lit), flukes west/-X.
// The near flank faces NORTH (-Z) toward the camera.
// ============================================================

// ---- helpers ----
function lerp(a,b,t){ return a+(b-a)*t; }

function hash(x,y,z){
  const n = Math.sin(x*127.1 + y*311.7 + z*74.7) * 43758.5453;
  return n - Math.floor(n);
}

// body length range
const xH = 18;    // head tip (east / +X)
const xT = -15;   // tail stock (west / -X)
const H  = 5.6;   // max vertical half-height
const W  = 4.8;   // max horizontal half-width

// thickness profile: [u, heightFactor, widthFactor]  (u:0 tail .. 1 head)
const PTS = [
  [0.00, 0.16, 0.14],
  [0.08, 0.30, 0.24],
  [0.20, 0.55, 0.50],
  [0.35, 0.82, 0.78],
  [0.50, 1.00, 1.00],
  [0.62, 1.00, 0.98],
  [0.75, 0.90, 0.90],
  [0.87, 0.74, 0.78],
  [1.00, 0.55, 0.60],
];

function profile(u){
  if(u <= PTS[0][0]) return [PTS[0][1], PTS[0][2]];
  for(let i=1;i<PTS.length;i++){
    if(u <= PTS[i][0]){
      const t = (u-PTS[i-1][0])/(PTS[i][0]-PTS[i-1][0]);
      return [ lerp(PTS[i-1][1],PTS[i][1],t), lerp(PTS[i-1][2],PTS[i][2],t) ];
    }
  }
  return [PTS[PTS.length-1][1], PTS[PTS.length-1][2]];
}

function bodyParams(x){
  const u = (x - xT)/(xH - xT);
  const pr = profile(u);
  return {
    ry: Math.max(1, H*pr[0]),
    rz: Math.max(1, W*pr[1]),
    yc: 7 + 0.8*Math.sin(Math.PI*u),   // gentle back arc
  };
}

// outer -Z (north) surface block at a given (x,y) — where the camera sees it
function surfZ(x,y){
  const p = bodyParams(x);
  const dy = y - p.yc;
  const k = 1 - (dy*dy)/(p.ry*p.ry);
  if(k <= 0) return null;
  return -Math.round(p.rz*Math.sqrt(k));
}

// lowest body block at a given (x,dz) — for belly grooves
function bottomY(x,dz){
  const p = bodyParams(x);
  const k = 1 - (dz*dz)/(p.rz*p.rz);
  if(k <= 0) return null;
  return Math.round(p.yc - p.ry*Math.sqrt(k));
}

// ============================================================
// 1) MAIN BODY — blue back (GLASS), white belly (SNOW),
//    mottled cyan speckle (ICE) like real blue-whale skin
// ============================================================
for(let x=xT; x<=xH; x++){
  const p = bodyParams(x);
  for(let yy=Math.floor(p.yc-p.ry); yy<=Math.ceil(p.yc+p.ry); yy++){
    for(let zz=-Math.ceil(p.rz); zz<=Math.ceil(p.rz); zz++){
      const dy = yy - p.yc;
      const e = (dy*dy)/(p.ry*p.ry) + (zz*zz)/(p.rz*p.rz);
      if(e <= 1.0){
        let id = GLASS;
        if(dy < -0.30*p.ry) id = SNOW;               // pale underside
        else if(hash(x,yy,zz) > 0.82) id = ICE;      // mottling on the back
        block(x, yy, zz, id);
      }
    }
  }
}

// ============================================================
// 2) VENTRAL GROOVES — longitudinal throat pleats on the belly
// ============================================================
for(let x=6; x<=xH; x++){
  for(let dz=-3; dz<=3; dz++){
    if(((dz%2)+2)%2 === 0){
      const by = bottomY(x,dz);
      if(by !== null) block(x, by, dz, ICE);
    }
  }
}

// ============================================================
// 3) MOUTH LINE — long curving jawline on the near flank
// ============================================================
for(let x=8; x<=xH; x++){
  const p = bodyParams(x);
  const my = Math.round(p.yc - p.ry*0.45);
  const z = surfZ(x, my);
  if(z !== null){
    block(x, my, z, COBBLE);
    block(x, my, z+1, COBBLE);
  }
}

// ============================================================
// 4) EYE — small dark spot behind the mouth corner (near flank)
// ============================================================
{
  const ey = 5;
  for(let ex=13; ex<=14; ex++){
    const z = surfZ(ex, ey);
    if(z !== null){
      block(ex, ey,   z, STONE);
      block(ex, ey+1, z, SNOW);   // small highlight above the eye
    }
  }
}

// ============================================================
// 5) BLOWHOLE + SPOUT — iconic column of spray fanning upward
// ============================================================
{
  const bx = 12;
  const p = bodyParams(bx);
  const topY = Math.round(p.yc + p.ry);
  block(bx, topY, 0, STONE);           // blowhole
  block(bx-1, topY, 0, STONE);
  for(let h=1; h<=10; h++){
    const spread = Math.floor(h/3) + 1;
    for(let dx=-spread; dx<=spread; dx++){
      for(let dz=-spread; dz<=spread; dz++){
        if(dx*dx + dz*dz > spread*spread) continue;
        if(hash(bx+dx*3, topY+h, dz*3+7) > 0.45){
          block(bx+dx, topY+h, dz, (h>6 ? SNOW : ICE));
        }
      }
    }
  }
}

// ============================================================
// 6) PECTORAL FLIPPER — long slender flipper on the near (-Z) side,
//    sweeping outward, down and back
// ============================================================
{
  const sx = 7;
  const p = bodyParams(sx);
  const sy = Math.round(p.yc - 1);
  let sz = surfZ(sx, sy);
  if(sz === null) sz = -Math.round(p.rz);
  for(let t=0; t<=9; t++){
    const fx = sx - Math.round(t*0.7);
    const fy = sy - Math.round(t*0.75);
    const fz = sz - t;
    const wx = t<4 ? 1 : 0;
    const wy = t<3 ? 1 : 0;
    cube(fx-1, fy, fz, fx+wx, fy+wy, fz, GLASS);
    if(t>=6) block(fx-1, fy, fz, SNOW);   // pale trailing tip
  }
}

// ============================================================
// 7) DORSAL FIN — small falcate fin about three-quarters back
// ============================================================
{
  const dxc = -5;
  const p = bodyParams(dxc);
  const baseY = Math.round(p.yc + p.ry);
  for(let h=0; h<=3; h++){
    const half = Math.max(0, 2 - h);
    for(let ddx=-half; ddx<=half; ddx++){
      block(dxc + ddx - Math.round(h*0.4), baseY + h, 0, GLASS);
    }
  }
}

// ============================================================
// 8) TAIL FLUKES — wide horizontal boomerang with a central notch,
//    tips swept back
// ============================================================
function fluke(sign){
  const cy = 8;
  for(let s=1; s<=11; s++){
    const z = sign*s;
    const lead = xT - 1 - Math.round(0.55*s);              // leading edge sweeps back
    const chord = Math.max(1, Math.round(5 - Math.abs(s-5)*0.45));
    for(let c=0; c<chord; c++){
      const x = lead - c;
      block(x, cy, z, GLASS);
      if(c === chord-1) block(x, cy, z, SNOW);             // pale trailing edge
    }
    if(s <= 5) block(lead, cy-1, z, GLASS);                // slight thickness near root
  }
}
fluke(1);
fluke(-1);

// ============================================================
// 9) OCEAN SURFACE — blue water plane the whale rides through,
//    skipping cells occupied by the body
// ============================================================
const WY = 2;
for(let x=-22; x<=22; x++){
  for(let z=-22; z<=22; z++){
    let inside = false;
    if(x>=xT && x<=xH){
      const p = bodyParams(x);
      const dy = WY - p.yc;
      const e = (dy*dy)/(p.ry*p.ry) + (z*z)/(p.rz*p.rz);
      if(e <= 1) inside = true;
    }
    if(!inside){
      // faint wave mottle so the sea isn't dead flat
      block(x, WY, z, (hash(x*2, 5, z*2) > 0.90) ? ICE : GLASS);
    }
  }
}

// ============================================================
// 10) FOAM — white splash where the body cuts the waterline
// ============================================================
for(let x=xT; x<=xH; x++){
  const p = bodyParams(x);
  const dy = WY - p.yc;
  const k = 1 - (dy*dy)/(p.ry*p.ry);
  if(k > 0){
    const zE = Math.round(p.rz*Math.sqrt(k));
    for(const zz of [zE, -zE, zE+1, -zE-1]){
      if(hash(x, 9, zz) > 0.25) block(x, WY, zz, SNOW);
    }
  }
}