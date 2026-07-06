// shark-4x-opus — prompt:
// a great white shark...

cy = 12;
cz = 0;
const GX = [20,18,16,13,9,4,-1,-6,-10,-14,-16];
const GG = [0.05,0.14,0.5,0.8,0.95,1.0,0.9,0.65,0.4,0.18,0.1];

function girth(x){
  if(x>=GX[0]) return GG[0];
  if(x<=GX[GX.length-1]) return GG[GG.length-1];
  for(let i=0;i<GX.length-1;i++){
    if(x<=GX[i] && x>=GX[i+1]){
      const t=(GX[i]-x)/(GX[i]-GX[i+1]);
      return GG[i]+(GG[i+1]-GG[i])*t;
    }
  }
  return 0.1;
}
function ryAt(x){ return Math.max(1, Math.round(1+girth(x)*5)); }
function rzAt(x){ return Math.max(1, Math.round(1+girth(x)*4)); }
function topY(x){ return cy+ryAt(x); }
function botY(x){ return cy-ryAt(x); }

// ---- main body: elliptical cross sections, countershaded ----
for(let x=-16;x<=20;x++){
  const ry=ryAt(x), rz=rzAt(x);
  for(let dy=-ry;dy<=ry;dy++){
    for(let dz=-rz;dz<=rz;dz++){
      const e=(dy*dy)/(ry*ry)+(dz*dz)/(rz*rz);
      if(e<=1.02){
        let id;
        if(dy >= 0.2*ry) id=COBBLE;        // dark gray back
        else if(dy <= -0.4*ry) id=SNOW;    // white belly
        else id=STONE;                      // gray flank + lateral line
        block(x, cy+dy, cz+dz, id);
      }
    }
  }
}

// ---- triangle fill helper (in XY plane, thickness across Z) ----
function sgn(x1,y1,x2,y2,x3,y3){return (x1-x3)*(y2-y3)-(x2-x3)*(y1-y3);}
function inTri(px,py,ax,ay,bx,by,cx,cyy){
  const d1=sgn(px,py,ax,ay,bx,by);
  const d2=sgn(px,py,bx,by,cx,cyy);
  const d3=sgn(px,py,cx,cyy,ax,ay);
  const neg=(d1<0)||(d2<0)||(d3<0);
  const pos=(d1>0)||(d2>0)||(d3>0);
  return !(neg&&pos);
}
function triXY(ax,ay,bx,by,cx,cyy,z0,z1,id){
  const minx=Math.min(ax,bx,cx),maxx=Math.max(ax,bx,cx);
  const miny=Math.min(ay,by,cyy),maxy=Math.max(ay,by,cyy);
  for(let X=minx;X<=maxx;X++)for(let Y=miny;Y<=maxy;Y++){
    if(inTri(X,Y,ax,ay,bx,by,cx,cyy)) for(let Z=z0;Z<=z1;Z++) block(X,Y,Z,id);
  }
}

// ---- first dorsal fin (the iconic one, swept back) ----
triXY(7,topY(7), 1,cy+16, -2,topY(-2), -1,1, COBBLE);
triXY(6,topY(6), 1,cy+16, 2,topY(2), 0,0, STONE); // leading-edge highlight

// ---- second dorsal + anal (small, near tail) ----
triXY(-9,topY(-9), -11,topY(-11)+4, -13,topY(-13), 0,0, COBBLE);
triXY(-9,botY(-9), -12,botY(-12)-4, -13,botY(-13), 0,0, COBBLE);

// ---- caudal (tail) fin: heterocercal, big upper lobe ----
triXY(-14,cy, -22,cy+12, -18,cy+1, -1,1, COBBLE);   // upper lobe
triXY(-14,cy, -21,cy-6, -17,cy-1, -1,1, COBBLE);    // lower lobe
triXY(-15,cy, -21,cy+11, -19,cy+3, 0,0, STONE);     // upper lobe inner shade

// ---- pectoral fins (large, swept, drooping) ----
function pectoral(side){
  const base=rzAt(9);
  for(let zi=0; zi<=11; zi++){
    const frac=zi/11;
    const cxf=Math.round(9-frac*6);
    const chord=Math.round(5*(1-frac))+1;
    const yf=Math.round(cy-2-frac*3);
    const Z=side*(base+zi);
    for(let k=0;k<=chord;k++){
      block(cxf-k, yf, Z, COBBLE);
      if(frac<0.55) block(cxf-k, yf-1, Z, SNOW); // white underside
    }
  }
}
pectoral(1); pectoral(-1);

// ---- pelvic fins (small, ventral, paired) ----
function pelvic(side){
  const base=rzAt(-5);
  for(let zi=0; zi<=4; zi++){
    const frac=zi/4;
    const cxf=Math.round(-4-frac*3);
    const chord=Math.round(2*(1-frac))+1;
    const yf=Math.round(cy-3-frac*2);
    const Z=side*(base+zi);
    for(let k=0;k<=chord;k++) block(cxf-k, yf, Z, COBBLE);
  }
}
pelvic(1); pelvic(-1);

// ---- 5 gill slits behind the head ----
for(let gi=0; gi<5; gi++){
  const gx=12-gi;
  const rz=rzAt(gx);
  for(let yy=-2; yy<=2; yy++){
    block(gx, cy+yy, rz, COBBLE);
    block(gx, cy+yy, -rz, COBBLE);
  }
}

// ---- eyes (dark, on the gray flank of the head) ----
const erz=rzAt(15);
block(15, cy, erz, COBBLE);
block(15, cy, -erz, COBBLE);
block(15, cy+1, erz, STONE);
block(15, cy+1, -erz, STONE);

// ---- gaping toothy mouth on the underside of the snout ----
for(let mx=13; mx<=18; mx++){
  const w=Math.max(1, Math.round(((18-mx)/5)*4)+1);
  for(let mz=-w; mz<=w; mz++){
    block(mx, cy-2, mz, BRICK);                 // red mouth interior
    if(((mx+mz)&1)===0) block(mx, cy-1, mz, SNOW); // upper teeth row
    else block(mx, cy-3, mz, SNOW);             // lower teeth row
  }
}
// carve the mouth open a touch for depth
cube(15, cy-2, -2, 17, cy-2, 2, BRICK);

// ---- rising bubbles (background depth) ----
const bub=[[19,cy+3,2],[20,cy+6,1],[18,cy+7,-1],[21,cy+4,3],[19,cy+9,0],[20,cy+2,-2],[17,cy+10,2],[22,cy+7,-1]];
for(const b of bub) block(b[0],b[1],b[2],GLASS);

// ---- fleeing prey fish in the foreground, near the jaws ----
cube(20,cy+4,-6, 21,cy+5,-5, SAND);
block(22,cy+4,-5,SAND);            // nose
block(19,cy+4,-6,SAND);            // tail base
block(19,cy+5,-7,SAND);            // tail fin
block(19,cy+3,-7,SAND);
block(21,cy+5,-5,SNOW);            // eye
block(20,cy+3,-5,SAND);           // little belly