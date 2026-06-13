// world-tree — prompt:
// A colossal mythic World Tree (Yggdrasil). One ENORMOUS central trunk of OAK_LOG, 6-8 blocks thick at the base and tapering as it rises, splitting into several massive boughs near the top. A vast billo...

cube(0, 0, 0, 0, 0, 0, 5) // touch builder API; real work below via block()

// ===== Yggdrasil — colossal mythic World Tree =====
const AIR=0, GRASS=1, OAK_LOG=4, LEAVES=5, PLANKS=7, GLASS=11;

const solids = new Map();
const airs   = new Set();
const K=(x,y,z)=>x+','+y+','+z;

function sset(x,y,z,id){ const k=K(x,y,z); airs.delete(k); solids.set(k,id); }
function setEmpty(x,y,z,id){ const k=K(x,y,z); if(!solids.has(k)){ airs.delete(k); solids.set(k,id);} }
function sair(x,y,z){ const k=K(x,y,z); solids.delete(k); airs.add(k); }
function carveT(x,y,z){ x=Math.round(x);y=Math.round(y);z=Math.round(z);
  if(x<-22||x>22||y<-8||y>33||z<-22||z>22) return;
  const k=K(x,y,z); if(!solids.has(k)) airs.add(k); }

function hn(x,y,z){ let n=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453; return n-Math.floor(n); }
function place(x,y,z,id){ x=Math.round(x);y=Math.round(y);z=Math.round(z);
  if(x>=-22&&x<=22&&y>=-8&&y<=33&&z>=-22&&z<=22) sset(x,y,z,id); }

// thick tapering capsule of blocks (boughs, roots)
function limb(x1,y1,z1,x2,y2,z2,r1,r2,id){
  const dx=x2-x1,dy=y2-y1,dz=z2-z1;
  const len=Math.max(Math.abs(dx),Math.abs(dy),Math.abs(dz),1);
  const steps=Math.ceil(len*2);
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    const cx=x1+dx*t, cy=y1+dy*t, cz=z1+dz*t;
    const r=r1+(r2-r1)*t, ri=Math.ceil(r);
    for(let a=-ri;a<=ri;a++)for(let b=-ri;b<=ri;b++)for(let c=-ri;c<=ri;c++){
      if(a*a+b*b+c*c<=r*r) place(cx+a,cy+b,cz+c,id);
    }
  }
}

// ---------- A. clear immediate clutter so the trunk reads clean ----------
for(let y=1;y<=13;y++)for(let x=-6;x<=6;x++)for(let z=-6;z<=6;z++){ if(x*x+z*z<=36) sair(x,y,z); }
for(let y=1;y<=3;y++)for(let x=-9;x<=9;x++)for(let z=-9;z<=9;z++){ if(x*x+z*z<=81) sair(x,y,z); }

// ---------- B. trunk: 6-8 thick base, tapering, fluted, flared foot ----------
function trunkR(y){
  if(y<=0) return 3.7 + (-y)*0.35;
  if(y>=18) return 1.35;
  return 3.7 - (y/18)*(3.7-1.35);
}
for(let y=-4;y<=20;y++){
  const R=trunkR(y), Ri=Math.ceil(R)+1;
  for(let x=-Ri;x<=Ri;x++)for(let z=-Ri;z<=Ri;z++){
    const ang=Math.atan2(z,x);
    const flute=(y<6)?0.55*Math.cos(ang*6):0;          // ancient buttress flutes near base
    const rr=R+flute;
    if(x*x+z*z<=rr*rr) place(x,y,z,OAK_LOG);
  }
}

// ---------- C. boughs splitting near the top + central leader ----------
const boughs=[];
const NB=6;
for(let i=0;i<NB;i++){
  const ang=(i/NB)*Math.PI*2+0.3;
  const reach=9+(i%2)*2;
  const ca=Math.cos(ang), sa=Math.sin(ang);
  const ex=ca*reach, ez=sa*reach, ey=24-(i%2)*2;
  limb(ca*1.5,14,sa*1.5, ex,ey,ez, 2.2,1.0, OAK_LOG);
  // secondary fork for branching richness
  limb(ex*0.6,19,ez*0.6, ex*1.12,ey+2,ez*1.12, 1.0,0.5, OAK_LOG);
  boughs.push({ex,ey,ez});
}
limb(0,16,0, 0,27,0, 1.7,0.8, OAK_LOG);                // central leader into crown
// lower, more horizontal bough that will carry the treehouse
limb(2,12,-1, 11,14,-6, 2.0,1.1, OAK_LOG);

// ---------- D. flared roots gripping ground, some diving under ----------
const RN=7;
for(let i=0;i<RN;i++){
  const ang=(i/RN)*Math.PI*2+0.15;
  const reach=9+(i%3)*2, tipY=-3-(i%3);
  const ca=Math.cos(ang), sa=Math.sin(ang);
  const kx=ca*5.5, kz=sa*5.5, tx=ca*reach, tz=sa*reach;
  limb(ca*3,0.5,sa*3, kx,0,kz, 2.6,1.8, OAK_LOG);      // surface flare
  limb(kx,0,kz, tx,tipY,tz, 1.8,0.8, OAK_LOG);          // dive into earth
  // carve a slot in the soil above the diving root so it shows
  const steps=Math.ceil(reach*2);
  for(let s=0;s<=steps;s++){
    const t=s/steps;
    const px=kx+(tx-kx)*t, py=tipY*t, pz=kz+(tz-kz)*t;
    for(let yy=Math.round(py)+1; yy<=0; yy++){ carveT(px,yy,pz); carveT(px+ca,yy,pz); }
  }
}

// ---------- E. a little grass at the root base ----------
for(let x=-8;x<=8;x++)for(let z=-8;z<=8;z++){
  const d=Math.sqrt(x*x+z*z);
  if(d>=2.5&&d<=7.5&&hn(x,7,z)<0.5) setEmpty(x,0,z,GRASS);
}

// ---------- F. canopy: layered billowing crown 30+ across ----------
const balls=[];
const B=(cx,cy,cz,rx,ry,rz)=>balls.push({cx,cy,cz,rx,ry,rz});
B(0,26,0, 8,7,8);                                       // central mass
B(0,29,0, 5,4,5); B(5,28,2, 5,4,5); B(-4,28,-3, 5,4,5);
B(2,28,-5, 5,4,4); B(-5,28,4, 4,4,5);                   // upper crown lobes
const MID=7;
for(let i=0;i<MID;i++){ const a=(i/MID)*Math.PI*2+0.2; B(Math.cos(a)*10,24,Math.sin(a)*10, 6,5,6); }
const LOW=6;
for(let i=0;i<LOW;i++){ const a=(i/LOW)*Math.PI*2+0.5; B(Math.cos(a)*9,20,Math.sin(a)*9, 5,4,5); }

const leafCands=[];
for(let x=-18;x<=18;x++)for(let z=-18;z<=18;z++)for(let y=14;y<=33;y++){
  let m=Infinity;
  for(const b of balls){
    const nd=Math.sqrt(((x-b.cx)/b.rx)**2+((y-b.cy)/b.ry)**2+((z-b.cz)/b.rz)**2);
    if(nd<m) m=nd;
  }
  if(m>1) continue;
  if(solids.has(K(x,y,z))) continue;                    // logs win
  if(hn(x*1.3,y*1.7,z*1.3)<0.08) continue;              // scattered sky gaps
  if(m<0.5 && hn(x+50,y,z)>0.45) continue;              // lighten dense interior
  leafCands.push({x,y,z,p:m});
}
const TARGET=8600;
let avail=TARGET-solids.size;
if(leafCands.length>avail){ leafCands.sort((a,b)=>b.p-a.p); leafCands.length=avail; } // keep outer silhouette
for(const c of leafCands) sset(c.x,c.y,c.z,LEAVES);

// ---------- G. a few clear gaps of sky through the crown ----------
for(const g of [[6,27,-2,2],[-5,25,5,2],[3,29,3,2],[-7,24,-6,2],[8,23,3,2],[0,22,8,2],[-3,30,-2,2]]){
  const [gx,gy,gz,gr]=g;
  for(let x=-gr;x<=gr;x++)for(let y=-gr;y<=gr;y++)for(let z=-gr;z<=gr;z++){
    if(x*x+y*y+z*z<=gr*gr && solids.get(K(gx+x,gy+y,gz+z))===LEAVES) sair(gx+x,gy+y,gz+z);
  }
}

// ---------- H. tiny PLANKS treehouse on the lower bough ----------
const PX=11, PZ=-6, FY=15;
for(let x=PX-4;x<=PX+4;x++)for(let z=PZ-4;z<=PZ+4;z++)for(let y=FY-1;y<=FY+5;y++){
  if(solids.get(K(x,y,z))===LEAVES) sair(x,y,z);        // open a leafy alcove
}
for(let x=PX-2;x<=PX+2;x++)for(let z=PZ-2;z<=PZ+2;z++) place(x,FY,z,PLANKS);          // floor
for(const p of [[-2,-2],[2,-2],[-2,2],[2,2]]) for(let y=1;y<=3;y++) place(PX+p[0],FY+y,PZ+p[1],PLANKS); // posts
for(let x=PX-2;x<=PX+2;x++){ place(x,FY+1,PZ-2,PLANKS); place(x,FY+1,PZ+2,PLANKS); }  // railing
for(let z=PZ-1;z<=PZ+2;z++){ place(PX-2,FY+1,z,PLANKS); place(PX+2,FY+1,z,PLANKS); }
for(let x=PX-2;x<=PX+2;x++)for(let z=PZ-2;z<=PZ+2;z++) place(x,FY+4,z,PLANKS);        // roof
for(let y=FY-1;y>=12;y--) place(PX,y,PZ,OAK_LOG);                                      // support strut

// ---------- I. glowing GLASS orbs nestled in the canopy (<60) ----------
let orbs=0; const placed=[];
for(const c of leafCands){
  if(orbs>=38) break;
  if(c.p>0.72 && c.p<0.99 && hn(c.x*3.1,c.y*1.1,c.z*2.7)>0.9){
    let ok=true;
    for(const q of placed){ if(Math.abs(q[0]-c.x)+Math.abs(q[1]-c.y)+Math.abs(q[2]-c.z)<3){ok=false;break;} }
    if(ok && solids.get(K(c.x,c.y,c.z))===LEAVES){ sset(c.x,c.y,c.z,GLASS); placed.push([c.x,c.y,c.z]); orbs++; }
  }
}

// ---------- J. emit (air first so solids always win on overlap) ----------
for(const k of airs){ const p=k.split(',').map(Number); block(p[0],p[1],p[2],AIR); }
for(const e of solids){ const p=e[0].split(',').map(Number); block(p[0],p[1],p[2],e[1]); }