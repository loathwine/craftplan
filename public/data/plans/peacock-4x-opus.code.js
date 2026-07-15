// peacock-4x-opus — prompt:
// a peacock with its tail fanned out...

const meta = null; // (ignored – plain build script)

// ---------- helpers ----------
const P = (x,y,z,id)=>{
  x=Math.round(x); y=Math.round(y); z=Math.round(z);
  if(x<-22||x>22||z<-22||z>22||y<-8||y>33) return;
  block(x,y,z,id);
};
const hyp=(a,b)=>Math.sqrt(a*a+b*b);
const D2R=Math.PI/180;

// ---------- clear the forest slab this bird occupies (AIR is free) ----------
cube(-21,0,-6, 21,24,8, AIR);

// fresh grass pad to stand on
disk(0,0,1,9,GRASS);
disk(0,-1,1,9,DIRT);

// ============================================================
//  THE FANNED TAIL  (great vertical display behind the bird)
// ============================================================
const fx=0, fy=3, fz=4, rOuter=20, thetaMax=96;
const fanZ=(r)=> fz + Math.round((r*r)/(rOuter*rOuter)*2);   // gentle cup

// --- dense feather base near the tail root ---
for(let x=-21;x<=21;x++){
  for(let y=1;y<=24;y++){
    const dx=x-fx, dy=y-fy;
    const r=hyp(dx,dy);
    const th=Math.atan2(dx,dy)/D2R;
    if(r>=4 && r<=11 && Math.abs(th)<=thetaMax && y>=1){
      const z=fanZ(r);
      P(x,y,z,LEAVES);
      P(x,y,z+1,LEAVES);
    }
  }
}
// lush root cluster where all feathers converge
for(let ox=-3;ox<=3;ox++)for(let oy=-3;oy<=3;oy++)for(let oz=-1;oz<=3;oz++){
  if(hyp(ox,oy)+Math.abs(oz)*0.6<=3.4) P(fx+ox,fy+1+oy,fz+oz,LEAVES);
}

// --- eye-spot (ocellus) painters ---
function bigEye(cx,cy,cz){
  for(let ox=-2;ox<=2;ox++)for(let oy=-2;oy<=2;oy++){
    const d=hyp(ox,oy);
    let id=null;
    if(d<0.8) id=GLASS;          // deep-blue pupil
    else if(d<1.8) id=ICE;       // teal iris
    else if(d<2.6) id=SAND;      // gold rim
    if(id!==null) P(cx+ox,cy+oy,cz,id);
  }
}
function smallEye(cx,cy,cz){
  P(cx,cy,cz,GLASS);
  P(cx+1,cy,cz,ICE); P(cx-1,cy,cz,ICE);
  P(cx,cy+1,cz,ICE); P(cx,cy-1,cz,ICE);
  P(cx+1,cy+1,cz,SAND); P(cx-1,cy-1,cz,SAND);
  P(cx+1,cy-1,cz,SAND); P(cx-1,cy+1,cz,SAND);
}

// --- radiating train feathers, each tipped with an eye ---
const N=38;
for(let i=0;i<N;i++){
  const th=(-thetaMax + i*(2*thetaMax/(N-1)));
  const rad=th*D2R;
  const dirx=Math.sin(rad), diry=Math.cos(rad);
  const perpx=Math.cos(rad), perpy=-Math.sin(rad);
  const isEye=(i%2===0);
  const rTip=isEye?17:19;
  for(let r=11;r<=rTip;r++){
    const bx=fx+dirx*r, by=fy+diry*r;
    if(by<1) continue;
    const z=fanZ(r);
    P(bx,by,z,LEAVES);
    P(bx,by,z+1,LEAVES);
    if(r>13){                                   // widen toward the tip
      P(bx+perpx*0.9,by+perpy*0.9,z,LEAVES);
    }
    if(!isEye && r>=15 && r<=16){               // teal shimmer streak
      P(bx,by,z,ICE);
    }
  }
  if(isEye){
    const r=15;
    bigEye(Math.round(fx+dirx*r), Math.round(fy+diry*r), fanZ(r));
    // little teal streak leading into the eye
    P(fx+dirx*12,fy+diry*12,fanZ(12),ICE);
  }else{
    const r=rTip-1;
    P(Math.round(fx+dirx*r),Math.round(fy+diry*r),fanZ(r),ICE);
  }
}

// --- inner ring of smaller eyes on the dense base ---
for(let j=0;j<9;j++){
  const th=-80 + j*(160/8);
  const rad=th*D2R;
  const cx=Math.round(fx+Math.sin(rad)*8);
  const cy=Math.round(fy+Math.cos(rad)*8);
  if(cy<2) continue;
  smallEye(cx,cy,fanZ(8));
}

// ============================================================
//  THE PEACOCK  (front / face toward NORTH = -Z)
// ============================================================

// --- body: plump blue ovoid ---
const bcx=0, bcy=6, bcz=1;
for(let x=-3;x<=3;x++)for(let y=-4;y<=4;y++)for(let z=-3;z<=4;z++){
  const n=(x/3)**2 + (y/4)**2 + ((z-0.4)/3.6)**2;
  if(n<=1) P(bcx+x,bcy+y,bcz+z,GLASS);
}
// iridescent breast highlights (front, -Z side)
for(let y=4;y<=8;y++)for(let x=-1;x<=1;x++){
  P(bcx+x,y,bcz-2,ICE);
}
P(0,5,-3,ICE); P(0,7,-3,ICE);

// folded wings on each flank, gold-edged
for(const s of [-1,1]){
  for(let y=4;y<=8;y++)for(let z=0;z<=3;z++){
    if(y-4 <= z+1){ P(bcx+s*3,y,bcz+z,GLASS); }
  }
  P(bcx+s*3,4,bcz+3,SAND); P(bcx+s*3,5,bcz+3,SAND);
}

// --- neck: slender curve up and slightly forward ---
for(let t=0;t<=14;t++){
  const f=t/14;
  const nx=0;
  const ny=9 + f*5;                 // 9 -> 14
  const nz=1 - f*3 - Math.sin(f*Math.PI)*0.6;   // curve forward (-Z)
  const rr=1.9 - f*0.7;
  for(let ox=-2;ox<=2;ox++)for(let oy=-2;oy<=2;oy++)for(let oz=-2;oz<=2;oz++){
    if(hyp(hyp(ox,oy),oz)<=rr) P(nx+ox,ny+oy,nz+oz,GLASS);
  }
}
// neck front sheen
for(let y=10;y<=14;y++) P(0,y,-1,ICE);

// --- head ---
const hx=0,hy=15,hz=-2;
for(let ox=-2;ox<=2;ox++)for(let oy=-2;oy<=2;oy++)for(let oz=-2;oz<=2;oz++){
  if(hyp(hyp(ox,oy),oz)<=2) P(hx+ox,hy+oy,hz+oz,GLASS);
}
// beak (points north / -Z)
P(0,15,-4,SAND); P(0,14,-4,SAND); P(0,14,-5,SAND); P(0,15,-3,SAND);
// eyes
for(const s of [-1,1]){ P(s*2,16,-3,SNOW); P(s*2,16,-4,STONE); }

// --- crest: little fan of feathers on the head ---
const crestTips=[[0,20,-2],[-1,20,-3],[1,20,-3],[-2,19,-2],[2,19,-2]];
for(const [tx,ty,tz] of crestTips){
  line(0,17,-2, tx,ty,tz, GLASS);
  P(tx,ty,tz,ICE);          // round teal crest tip
  P(tx,ty+1,tz,ICE);
}

// --- legs & feet ---
for(const s of [-1,1]){
  P(s,1,1,STONE); P(s,2,1,STONE);
  P(s,1,0,SAND);  P(s,1,-1,SAND);   // toes forward
  P(s,1,1.7? 2:2,STONE);
}

// ============================================================
//  FOREGROUND FRAMING  (depth in front of / beside the bird)
// ============================================================
const shrubs=[[-9,-5],[10,-5],[-14,-4],[14,-4],[-6,-6],[7,-6]];
for(const [sx,sz] of shrubs){
  for(let ox=-2;ox<=2;ox++)for(let oy=0;oy<=2;oy++)for(let oz=-2;oz<=2;oz++){
    if(hyp(hyp(ox,oy),oz)<=2) P(sx+ox,oy,sz+oz,LEAVES);
  }
  P(sx,3,sz,LEAVES);
  P(sx+1,2,sz,BRICK);      // little red blossom
  P(sx-1,2,sz+1,SAND);     // yellow blossom
}
// a couple of tall grass blades
for(const [gx,gz] of [[-4,-6],[5,-6],[-11,-3],[12,-3]]){
  P(gx,0,gz,LEAVES); P(gx,1,gz,LEAVES);
}