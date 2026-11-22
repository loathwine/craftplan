// monastery-sonnet55 — prompt:
// a Tibetan monastery on a snowy peak...

// ===== infra: S = structures (top priority), T = terrain skin, D = ground dust =====
const S = new Map(), T = new Map(), D = new Map();
function inb(x,y,z){return !(x<-22||x>22||z<-22||z>22||y<-8||y>33);}
function P(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(!inb(x,y,z))return;S.set(x+','+y+','+z,id);}
function TP(x,y,z,id){if(!inb(x,y,z))return;T.set(x+','+y+','+z,id);}
function F(x1,y1,z1,x2,y2,z2,id){for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)for(let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++)P(x,y,z,id);}
function Ring(x1,z1,x2,z2,y,id){for(let x=x1;x<=x2;x++){P(x,y,z1,id);P(x,y,z2,id);}for(let z=z1;z<=z2;z++){P(x1,y,z,id);P(x2,y,z,id);}}
function Walls(x1,z1,x2,z2,y1,y2,id){for(let y=y1;y<=y2;y++)Ring(x1,z1,x2,z2,y,id);}
function Pyr(x1,z1,x2,z2,y0,id){let k=0;while(true){const a=x1+k,b=x2-k,c=z1+k,d=z2-k;if(a>b||c>d)break;if(b-a<=1||d-c<=1){F(a,y0+k,c,b,y0+k,d,id);break;}Ring(a,c,b,d,y0+k,id);k++;}
  P(x1-1,y0,z1-1,id);P(x2+1,y0,z1-1,id);P(x1-1,y0,z2+1,id);P(x2+1,y0,z2+1,id);
  P(x1-1,y0+1,z1-1,id);P(x2+1,y0+1,z1-1,id);}
function Sph(cx,cy,cz,r,id,ymin){for(let x=-r;x<=r;x++)for(let y=-r;y<=r;y++)for(let z=-r;z<=r;z++)if(x*x+y*y+z*z<=r*r+0.5&&cy+y>=(ymin===undefined?0:ymin))P(cx+x,cy+y,cz+z,id);}
function hash(x,z){const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);}

// ===== clear trees in the footprint (AIR is free) =====
cube(-22,0,-22,22,8,-11,AIR);
cube(-18,0,-10,18,8,14,AIR);

// ===== ground snow dusting (lowest priority) =====
for(let x=-22;x<=22;x++)for(let z=-22;z<=-11;z++){
  const e=Math.abs(x)/22;
  if(hash(x*1.3,z*0.7)<0.3+0.4*e) D.set(x+',-1,'+z,SNOW);
}

// ===== heightfield: mountain + terraces =====
const PEAKS=[[1,15,11,8,29],[-10,17,6,5,16],[11,16,6,5,14]];
function Mh(x,z){let best=-99;for(const [px,pz,ax,az,hp] of PEAKS){const u=(x-px)/ax,v=(z-pz)/az,d=Math.sqrt(u*u+v*v);if(d<1){const h=hp*Math.pow(1-d,0.85)+(hash(x,z)-0.5)*2.2*(1-d);if(h>best)best=h;}}return best<0.5?-99:Math.round(best);}
function band(z){if(z>=-9&&z<=-4)return [3,14];if(z>=-3&&z<=3)return [8,12];if(z>=4&&z<=9)return [14,9];return null;}
function Hf(x,z){const m=Mh(x,z);const b=band(z);if(b){const base=b[0],w=b[1],ax=Math.abs(x);if(ax<=w)return base;return Math.max(Math.round(base-(ax-w)*2.5),m);}return m;}
function HN(x,z){if(x<-22||x>22||z<-22||z>22)return -1;const h=Hf(x,z);return h<0?-1:h;}
for(let x=-22;x<=22;x++)for(let z=-22;z<=22;z++){
  const h=Hf(x,z);if(h<0)continue;
  const nb=Math.min(HN(x+1,z),HN(x-1,z),HN(x,z+1),HN(x,z-1));
  const lo=Math.max(h-6,Math.min(h,nb+1));
  const b=band(z);const isT=b&&Math.abs(x)<=b[1];
  for(let y=lo;y<=h;y++){
    const r=hash(x*1.7+y*3.1,z*2.3+y*1.3);let id;
    if(isT){ if(y===h) id=r<0.4?SNOW:(r<0.7?LIGHT_GRAY:COBBLE); else id=r<0.5?COBBLE:STONE; }
    else if(y>=24) id=r<0.07?STONE:(r>0.985?ICE:SNOW);
    else if(y>=12) id=r<0.28?STONE:SNOW;
    else id=r<0.5?STONE:(r<0.6?COBBLE:SNOW);
    TP(x,y,z,id);
  }
}

// ===== foothill mounds, rocks, frozen pond =====
Sph(-19,-1,-16,3,SNOW);Sph(19,-1,-15,3,SNOW);
Sph(-14,-1,-22,2,STONE);Sph(10,-1,-22,2,STONE);Sph(20,-1,-20,2,STONE);
for(let x=-19;x<=-11;x++)for(let z=-18;z<=-10;z++){const dx=x+15,dz=z+14;if(dx*dx+dz*dz<=10)P(x,-1,z,ICE);}

// ===== path, courtyard paving and stairs =====
for(let x=-2;x<=2;x++)for(let z=-18;z<=-14;z++)P(x,-1,z,(x+z)%2?COBBLE:LIGHT_GRAY);
for(let i=0;i<4;i++){const z=-13+i;for(let x=-1;x<=1;x++){F(x,0,z,x,i,z,COBBLE);P(x,i,z,LIGHT_GRAY);}for(const sx of [-2,2])F(sx,0,z,sx,i+1,z,WHITE);}
for(let i=0;i<5;i++){const z=-8+i;for(let x=-1;x<=1;x++){F(x,4,z,x,4+i,z,COBBLE);P(x,4+i,z,LIGHT_GRAY);}for(const sx of [-2,2])F(sx,4,z,sx,5+i,z,WHITE);}

// ===== gate and wall stubs =====
for(const s of [-1,1]){for(let i=5;i<=8;i++){const x=s*i;F(x,0,-20,x,2,-20,WHITE);P(x,3,-20,(i%2)?BRICK:WHITE);}}
F(-4,0,-20,-3,5,-19,WHITE);F(3,0,-20,4,5,-19,WHITE);
F(-4,5,-20,4,6,-19,BRICK);
for(let x=-4;x<=4;x+=2)P(x,6,-20,GOLD);
Pyr(-5,-21,5,-18,7,GOLD);
P(0,9,-20,GOLD);P(0,10,-20,GOLD);P(0,11,-20,GLOWSTONE);
P(-2,4,-20,GLOWSTONE);P(2,4,-20,GLOWSTONE);
P(-4,7,-21,FIRE);P(4,7,-21,FIRE);
F(-1,0,-20,1,0,-20,COBBLE);

// ===== chortens =====
function chorten(cx,cz){
  F(cx-2,0,cz-2,cx+2,0,cz+2,WHITE);
  F(cx-1,1,cz-1,cx+1,1,cz+1,WHITE);
  Sph(cx,4,cz,2,WHITE,2);
  P(cx+2,4,cz,BRICK);P(cx-2,4,cz,BRICK);P(cx,4,cz-2,BRICK);P(cx,4,cz+2,BRICK);
  F(cx-1,7,cz-1,cx+1,7,cz+1,GOLD);
  P(cx-1,7,cz-1,BLUE);P(cx+1,7,cz-1,BLUE);
  for(let i=0;i<2;i++){P(cx,8+i,cz,GOLD);P(cx-1,8+i,cz,GOLD);P(cx+1,8+i,cz,GOLD);P(cx,8+i,cz-1,GOLD);P(cx,8+i,cz+1,GOLD);}
  F(cx,10,cz,cx,12,cz,GOLD);
  P(cx,13,cz,GLOWSTONE);
}
chorten(-9,-16);chorten(10,-17);

// prayer wheel walls
for(const s of [-1,1]){for(let i=4;i<=10;i++){const x=s*i;P(x,0,-12,WHITE);if(i%2===0){P(x,1,-12,GOLD);P(x,2,-12,GOLD);}else{P(x,1,-12,BRICK);}}}

// ===== T1 monks' quarters =====
function quarters(x1,x2){
  Walls(x1,-9,x2,-6,4,6,WHITE);Walls(x1,-9,x2,-6,7,8,BRICK);
  F(x1+1,7,-8,x2-1,7,-7,SNOW);
  for(let x=x1+1;x<=x2-1;x+=2){P(x,5,-9,BLACK);P(x,6,-9,(x%4===0)?GLOWSTONE:BLACK);}
  const m=Math.round((x1+x2)/2);
  P(m,4,-9,BROWN);P(m,5,-9,BROWN);
  P(m+1,8,-9,GOLD);P(m-1,8,-9,GOLD);
  Pyr(m-2,-9,m+2,-6,9,GOLD);
  P(m,11,-8,GOLD);
}
quarters(-13,-6);quarters(6,13);
for(const sx of [-4,4]){F(sx-1,4,-6,sx+1,4,-4,STONE);F(sx,5,-5,sx,6,-5,BRICK);P(sx,7,-5,FIRE);}

// ===== T2 assembly hall =====
Walls(-7,-2,7,3,9,11,WHITE);Walls(-7,-2,7,3,12,14,BRICK);
F(-6,13,-1,6,13,2,SNOW);
for(const x of [-6,-4,4,6]){P(x,10,-2,BLACK);P(x,11,-2,(Math.abs(x)===6)?GLOWSTONE:BLACK);}
F(-1,9,-2,1,11,-2,RED);
F(-2,9,-2,-2,11,-2,BRICK);F(2,9,-2,2,11,-2,BRICK);
F(-3,12,-2,3,12,-2,GOLD);
for(const x of [-6,-4,-1,0,1,4,6])P(x,13,-2,GOLD);
P(0,10,-3,GOLD);
Pyr(-4,-3,4,3,15,GOLD);
F(0,19,0,0,21,0,GOLD);P(0,22,0,GLOWSTONE);
P(-5,14,-3,GLOWSTONE);P(5,14,-3,GLOWSTONE);
for(const sx of [-7,7]){F(sx,15,-2,sx,17,-2,GOLD);}
function wing(x1,x2){
  Walls(x1,-2,x2,3,9,11,WHITE);Walls(x1,-2,x2,3,12,13,BRICK);
  F(x1+1,12,-1,x2-1,12,2,SNOW);
  for(let x=x1+1;x<=x2-1;x+=2){P(x,10,-2,BLACK);P(x,11,-2,BLACK);}
  Pyr(x1,-2,x2,3,14,GOLD);
}
wing(-12,-8);wing(8,12);

// ===== T3 Red Palace =====
Walls(-5,4,5,9,15,18,BRICK);F(-4,18,5,4,18,8,SNOW);
for(let x=-5;x<=5;x++)if(x%2===0)P(x,18,4,GOLD);
for(const x of [-4,-2,2,4]){P(x,16,4,BLACK);P(x,17,4,BLACK);}
P(0,16,4,GLOWSTONE);P(0,17,4,GLOWSTONE);P(-1,16,4,GOLD);P(1,16,4,GOLD);P(-1,17,4,GOLD);P(1,17,4,GOLD);
Walls(-4,5,4,9,19,22,BRICK);F(-3,22,6,3,22,8,SNOW);
for(const x of [-3,-1,1,3]){P(x,20,5,BLACK);P(x,21,5,(Math.abs(x)===1)?GLOWSTONE:BLACK);}
Walls(-3,6,3,9,23,24,BRICK);F(-2,24,7,2,24,8,SNOW);
for(let x=-3;x<=3;x++)P(x,24,6,GOLD);
for(const x of [-2,0,2])P(x,23,6,GOLD);
Pyr(-5,4,5,10,25,GOLD);
P(-5,24,3,GLOWSTONE);P(5,24,3,GLOWSTONE);
P(0,29,7,GOLD);
for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++){const r=Math.round(Math.sqrt(dx*dx+dy*dy));if(r===2)P(dx,31+dy,7,GOLD);}
P(0,31,7,GOLD);P(0,30,7,GOLD);P(0,32,7,GOLD);P(1,31,7,GOLD);P(-1,31,7,GOLD);
for(const s of [-1,1]){P(s*3,28,7,GOLD);P(s*3,29,7,GOLD);P(s*2,29,7,GOLD);}
function wing3(x1,x2){
  Walls(x1,4,x2,9,15,17,WHITE);Walls(x1,4,x2,9,18,19,BRICK);
  F(x1+1,18,5,x2-1,18,8,SNOW);
  for(let x=x1+1;x<=x2-1;x+=2){P(x,16,4,BLACK);P(x,17,4,(x===x1+1)?GLOWSTONE:BLACK);}
  Pyr(x1-1,3,x2+1,10,20,GOLD);
}
wing3(-9,-6);wing3(6,9);

// ===== prayer flags =====
const FC=[BLUE,WHITE,RED,GREEN,YELLOW];
function flags(x1,y1,z1,x2,y2,z2,sag){const n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1)));let c=0;for(let i=2;i<n;i+=2){const t=i/n;const x=x1+(x2-x1)*t,y=y1+(y2-y1)*t-sag*4*t*(1-t),z=z1+(z2-z1)*t;const col=FC[c++%5];P(x,y,z,col);P(x,y-1,z,col);}}
for(const sx of [-17,17]){F(sx,0,-14,sx,10,-14,OAK_LOG);P(sx,11,-14,GOLD);}
flags(-17,10,-14,17,10,-14,3);
flags(0,33,7,-17,10,-14,2);
flags(0,33,7,17,10,-14,2);

// ===== life: yaks and monks =====
function yak(x,z){F(x,1,z,x+1,2,z+2,BLACK);P(x,0,z,BLACK);P(x+1,0,z,BLACK);P(x,0,z+2,BLACK);P(x+1,0,z+2,BLACK);P(x,2,z-1,BLACK);P(x+1,2,z-1,BROWN);P(x-1,3,z-1,WHITE);P(x+2,3,z-1,WHITE);P(x,1,z+1,BROWN);}
yak(-6,-18);yak(12,-15);
function monk(x,y,z){P(x,y,z,BRICK);P(x,y+1,z,BRICK);P(x,y+2,z,PINK);P(x,y+1,z-1,ORANGE);}
monk(2,0,-16);monk(-5,0,-14);monk(5,0,-18);monk(13,0,-13);monk(-1,4,-9);

// ===== emit within budget: structures first, then terrain (front first), then dust =====
const CAP=3990;
let out=[];
for(const [k,id] of S)out.push([k,id]);
if(out.length>CAP)out=out.slice(0,CAP);
let room=CAP-out.length;
if(room>0){
  const tl=[];
  for(const [k,id] of T){if(!S.has(k)){const a=k.split(',');tl.push([+a[0],+a[1],+a[2],id]);}}
  tl.sort((p,q)=>(p[2]-q[2])||(p[1]-q[1]));
  for(let i=0;i<tl.length&&room>0;i++,room--){out.push([tl[i][0]+','+tl[i][1]+','+tl[i][2],tl[i][3]]);}
}
if(room>0){
  const have=new Set(out.map(o=>o[0]));
  for(const [k,id] of D){if(room<=0)break;if(!have.has(k)&&!T.has(k)){out.push([k,id]);room--;}}
}
for(const [k,id] of out){const a=k.split(',');block(+a[0],+a[1],+a[2],id);}