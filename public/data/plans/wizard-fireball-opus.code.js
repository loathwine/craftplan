// wizard-fireball-opus — prompt:
// a wizard casting a fireball...

cube(-13,1,-20,17,12,10,AIR);
cube(-22,1,9,-7,12,22,AIR);

const M=new Map();
function put(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;M.set(x+','+y+','+z,[x,y,z,id]);}
function has(x,y,z){return M.has(Math.round(x)+','+Math.round(y)+','+Math.round(z));}
function hs(x,y,z){let n=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(z|0,1274126177))|0;n=Math.imul(n^(n>>>13),1274126177);n=n^(n>>>16);return (n>>>0)/4294967296;}
let seed=90210;function rnd(){seed=(Math.imul(seed,1103515245)+12345)&0x7fffffff;return seed/2147483648;}
function pick(id,x,y,z){return typeof id==='function'?id(x,y,z):id;}
function box(x1,y1,z1,x2,y2,z2,id){for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)for(let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++)put(x,y,z,pick(id,x,y,z));}
function ball(cx,cy,cz,r,id){for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++){const dx=x-cx,dy=y-cy,dz=z-cz;if(dx*dx+dy*dy+dz*dz<=r*r+0.15)put(x,y,z,pick(id,x,y,z));}}
function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function norm(v){const l=Math.hypot(v[0],v[1],v[2]);return [v[0]/l,v[1]/l,v[2]/l];}
function lerp(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function tube(A,B,r0,r1,id){const L=Math.hypot(B[0]-A[0],B[1]-A[1],B[2]-A[2]);const n=Math.max(2,Math.ceil(L*3));for(let i=0;i<=n;i++){const t=i/n;const p=lerp(A,B,t);ball(p[0],p[1],p[2],r0+(r1-r0)*t,id);}}
function ring(C,U,rIn,rOut,half,id){const R=Math.ceil(rOut+1);for(let x=Math.floor(C[0])-R;x<=Math.ceil(C[0])+R;x++)for(let y=Math.floor(C[1])-R;y<=Math.ceil(C[1])+R;y++)for(let z=Math.floor(C[2])-R;z<=Math.ceil(C[2])+R;z++){const vx=x-C[0],vy=y-C[1],vz=z-C[2];const a=vx*U[0]+vy*U[1]+vz*U[2];const rad=Math.sqrt(Math.max(0,vx*vx+vy*vy+vz*vz-a*a));if(Math.abs(a)<=half&&rad>=rIn&&rad<=rOut)put(x,y,z,id);}}
function line2(x1,z1,x2,z2,y,id){const n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(z2-z1))*1.5)+1;for(let i=0;i<=n;i++){const t=i/n;put(x1+(x2-x1)*t,y,z1+(z2-z1)*t,id);}}

const X0=-3,Z0=3;

// ---- stone dais with fire-rune magic circle ----
for(let dx=-9;dx<=9;dx++)for(let dz=-9;dz<=9;dz++){const d=Math.hypot(dx,dz);if(d>8.3)continue;const x=X0+dx,z=Z0+dz;const n=hs(x,0,z);
  let id=n<0.3?COBBLE:STONE;if(d>7.4)id=n<0.55?COBBLE:STONE;
  if(Math.abs(d-6.3)<0.5)id=GOLD;else if(Math.abs(d-4.9)<0.45)id=OBSIDIAN;
  put(x,0,z,id);
  if(d>6.8){put(x,-1,z,hs(x,-1,z)<0.5?COBBLE:STONE);put(x,-2,z,hs(x,-2,z)<0.5?COBBLE:STONE);}
}
const pts=[];for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5;pts.push([X0+6.1*Math.cos(a),Z0+6.1*Math.sin(a)]);}
for(let i=0;i<5;i++){const p=pts[i],q=pts[(i+2)%5];line2(p[0],p[1],q[0],q[1],0,GOLD);}
for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8;put(X0+5.6*Math.cos(a),0,Z0+5.6*Math.sin(a),NEON_RED);}

// standing stones behind, two torch-lit
[[20,3,true],[70,4,false],[110,5,false],[160,3,true]].forEach(([a,h,f])=>{const r=a*Math.PI/180;const x=Math.round(X0+7.4*Math.cos(r)),z=Math.round(Z0+7.4*Math.sin(r));
  box(x,1,z,x+1,h,z+1,(X,Y,Z)=>hs(X,Y,Z)<0.4?COBBLE:STONE);if(f){put(x,h+1,z,FIRE);}else{put(x+1,h+1,z,STONE);}});

// ---- wizard's tower (background) ----
const TX=-16,TZ=16;
for(let y=-2;y<=18;y++)for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const d=Math.hypot(dx,dz);const x=TX+dx,z=TZ+dz;const n=hs(x,y,z);
  const rr=y<=0?5.3:4.4;
  if(d<=rr&&d>3.2){let id=n<0.22?COBBLE:(y<7&&n<0.32?GREEN:STONE);if(y===9||y===15)id=COBBLE;put(x,y,z,id);}
  else if(y>=1&&y<=9&&d>4.4&&d<=5.4&&dz<0&&n<0.18&&hs(x,0,z)<0.6)put(x,y,z,LEAVES);
}
for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const d=Math.hypot(dx,dz);const x=TX+dx,z=TZ+dz;const seg=Math.floor((Math.atan2(dz,dx)+Math.PI)/(Math.PI/8));
  if(d>4.2&&d<=5.3&&seg%2===0)put(x,18,z,COBBLE);
  if(d<=5.3&&d>3.2)put(x,19,z,hs(x,19,z)<0.4?COBBLE:STONE);
  if(d>4.3&&d<=5.3&&seg%2===0)put(x,20,z,STONE);
}
for(let y=20;y<=28;y++){const r=4.3*(1-(y-20)/9)+0.3;for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){const d=Math.hypot(dx,dz);if(d<=r&&d>r-1.2)put(TX+dx,y,TZ+dz,hs(dx,y,dz)<0.12?MAGENTA:PURPLE);}}
put(TX,28,TZ,PURPLE);put(TX,29,TZ,GOLD);put(TX,30,TZ,GOLD);
box(TX,6,TZ-4,TX,7,TZ-4,GLOWSTONE);box(TX,12,TZ-4,TX,13,TZ-4,GLOWSTONE);
box(TX+4,9,TZ,TX+4,10,TZ,GLOWSTONE);box(TX-4,9,TZ,TX-4,10,TZ,GLOWSTONE);
put(TX,5,TZ-5,STONE);put(TX,11,TZ-5,STONE);
box(TX-1,1,TZ-4,TX,3,TZ-4,BROWN);box(TX-1,1,TZ-5,TX,1,TZ-5,COBBLE);put(TX,2,TZ-5,GOLD);
[[-9,9],[-10,10],[-13,10],[-14,11],[-15,11]].forEach(([x,z])=>put(x,0,z,COBBLE));

// ---- cauldron over campfire ----
{const cx=-11,cz=12;
 put(cx-1,0,cz,OAK_LOG);put(cx+1,0,cz,OAK_LOG);put(cx,0,cz-1,OAK_LOG);put(cx,0,cz+1,OAK_LOG);put(cx,0,cz,FIRE);
 for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const d=Math.hypot(dx,dz);if(d>2.1)continue;
   if(d>1.2)put(cx+dx,1,cz+dz,BLACK);
   put(cx+dx,2,cz+dz,d>1.2?BLACK:LIME);
   if(d>1.5)put(cx+dx,3,cz+dz,IRON);}
 put(cx,3,cz,LIME);put(cx+1,4,cz,LIME);
}

// ---- black cat familiar ----
box(0,1,-2,2,2,0,BLACK);put(0,1,-3,BLACK);put(2,1,-3,BLACK);
box(0,2,-4,2,4,-3,BLACK);put(0,5,-3,BLACK);put(2,5,-3,BLACK);
put(0,3,-4,YELLOW);put(2,3,-4,YELLOW);put(1,2,-4,PINK);
put(1,2,1,BLACK);put(1,3,1,BLACK);put(1,4,2,BLACK);put(1,5,2,BLACK);put(2,6,2,BLACK);

// ---- red cape billowing east in the spell's wind ----
for(let y=1;y<=13;y++){const t=(13-y)/12;const w=3.3+t*3.3;const cz=Z0+2+t*t*4;const cx=X0+t*2.5;
  for(let x=Math.floor(cx-w);x<=Math.ceil(cx+w);x++){const u=(x-cx)/w;if(Math.abs(u)>1)continue;const z=cz-1.8*u*u+0.5*Math.sin(x*0.9+y*0.5)*t;
    const id=(y===1||Math.abs(u)>0.9)?GOLD:RED;put(x,y,Math.floor(z),id);put(x,y,Math.ceil(z),id);}}

// ---- robe ----
for(let y=1;y<=13;y++){const r=4.3-(y-1)*0.17,rz=r*0.85,ri=r-1.25,rzi=rz-1.25;
  for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){const q=(dx/r)**2+(dz/rz)**2;if(q>1)continue;const qi=ri>0.3?(dx/ri)**2+(dz/rzi)**2:2;if(qi<=1&&y!==13)continue;
    const x=X0+dx,z=Z0+dz;let id=BLUE;const n=hs(x,y,z);
    if(y===1)id=GOLD;else if(y===8)id=(dx===0&&dz<0)?GOLD:BROWN;else if(dx===0&&dz<0&&y<8)id=GOLD;else if(y===2)id=PURPLE;else if(n<0.07)id=YELLOW;
    put(x,y,z,id);}}
put(X0-2,1,Z0-4,BROWN);put(X0-1,1,Z0-4,BROWN);put(X0+1,1,Z0-4,BROWN);put(X0+2,1,Z0-4,BROWN);
// shoulders + mantle
box(X0-3,11,Z0-1,X0+3,11,Z0+1,BLUE);box(X0-4,12,Z0-1,X0+4,12,Z0+1,BLUE);
box(X0-4,13,Z0-2,X0+4,13,Z0+2,PURPLE);box(X0-4,13,Z0-2,X0+4,13,Z0-2,GOLD);

// ---- head ----
box(X0-2,14,Z0-2,X0+2,18,Z0+2,SAND);
box(X0-2,14,Z0,X0-2,18,Z0+2,WHITE);box(X0+2,14,Z0,X0+2,18,Z0+2,WHITE);box(X0-2,14,Z0+2,X0+2,18,Z0+2,WHITE);
box(X0-3,16,Z0,X0-3,18,Z0+2,WHITE);box(X0+3,16,Z0,X0+3,18,Z0+2,WHITE);
const FZ=Z0-2;
put(X0-1,17,FZ,NEON_BLUE);put(X0+1,17,FZ,NEON_BLUE);put(X0,17,FZ,SAND);
put(X0-2,17,FZ,SAND);put(X0+2,17,FZ,SAND);
[X0-2,X0-1,X0+1,X0+2].forEach(x=>put(x,18,FZ,WHITE));put(X0-2,18,FZ-1,WHITE);put(X0+2,18,FZ-1,WHITE);
put(X0,16,FZ-1,SAND);
box(X0-2,14,FZ,X0+2,15,FZ,WHITE);box(X0-2,14,FZ,X0-2,16,FZ+1,WHITE);box(X0+2,14,FZ,X0+2,16,FZ+1,WHITE);put(X0-2,16,FZ,PINK);put(X0+2,16,FZ,PINK);
// moustache + beard
box(X0-2,15,FZ-1,X0+2,15,FZ-1,WHITE);put(X0-3,14,FZ-1,WHITE);put(X0+3,14,FZ-1,WHITE);put(X0-3,13,FZ-1,WHITE);put(X0+3,13,FZ-1,WHITE);
const bw={14:2,13:2,12:2,11:1,10:1,9:1,8:0,7:0};
for(const k in bw){const y=+k,w=bw[k];box(X0-w,y,FZ-1,X0+w,y,FZ-1,WHITE);}
box(X0-1,10,FZ-2,X0+1,13,FZ-2,WHITE);box(X0,8,FZ-2,X0,9,FZ-2,WHITE);put(X0,6,FZ-1,WHITE);
box(X0-2,9,FZ,X0+2,13,FZ,WHITE);

// ---- hat ----
for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){if((dx/4.8)**2+(dz/4.4)**2<=1){const x=X0+dx,z=Z0+dz;put(x,19,z,hs(x,19,z)<0.08?YELLOW:BLUE);}}
for(let y=20;y<=31;y++){const t=(y-20)/11;const r=3.0*(1-t)+0.35;const cx=X0-1.2*t*t,cz=Z0+3.8*t*t;
  for(let x=Math.floor(cx-r-1);x<=Math.ceil(cx+r+1);x++)for(let z=Math.floor(cz-r-1);z<=Math.ceil(cz+r+1);z++){const d=Math.hypot(x-cx,z-cz);if(d>r+0.2)continue;if(d<r-1.1&&y>20)continue;
    let id=BLUE;if(y===20||y===21)id=GOLD;else if(hs(x,y,z)<0.1)id=YELLOW;put(x,y,z,id);}}
put(X0,20,Z0-3,NEON_RED);put(-4,31,8,BLUE);put(-4,30,9,BLUE);put(-4,29,9,GOLD);

// ---- fireball ----
const H=[5,15,-4.5];
const F=[8.5,17,-12.5],R=4.3;
const v=norm(sub(F,H));const ax=norm([v[2],0,-v[0]]);const bx=cross(v,ax);
for(let x=Math.floor(F[0]-R);x<=Math.ceil(F[0]+R);x++)for(let y=Math.floor(F[1]-R);y<=Math.ceil(F[1]+R);y++)for(let z=Math.floor(F[2]-R);z<=Math.ceil(F[2]+R);z++){
  const p=[x-F[0],y-F[1],z-F[2]];const d=Math.hypot(p[0],p[1],p[2]);if(d>R||d<R-1.4)continue;
  const s=(p[0]*v[0]+p[1]*v[1]+p[2]*v[2])/d;const n=hs(x,y,z);let id;
  if(s>0.55)id=n<0.5?GLOWSTONE:YELLOW;else if(s>-0.2)id=n<0.68?LAVA:(n<0.85?ORANGE:YELLOW);else id=n<0.45?ORANGE:(n<0.8?LAVA:RED);
  put(x,y,z,id);}
ball(F[0],F[1],F[2],R-1.4,GLOWSTONE);
// flame licks curling backward
for(let k=0;k<30;k++){let dir=norm([rnd()*2-1,rnd()*2-1,rnd()*2-1]);let p=[F[0]+dir[0]*R,F[1]+dir[1]*R,F[2]+dir[2]*R];const L=1+Math.floor(rnd()*3);
  for(let s=0;s<L;s++){p=[p[0]+dir[0]*0.8-v[0]*0.6,p[1]+dir[1]*0.8-v[1]*0.6+0.25,p[2]+dir[2]*0.8-v[2]*0.6];put(p[0],p[1],p[2],s===0?(rnd()<0.5?LAVA:YELLOW):(rnd()<0.6?ORANGE:RED));}}
// comet tail streaming back toward the caster's hand
for(let k=0;k<20;k++){const ang=rnd()*Math.PI*2,spread=0.3+rnd()*0.8;const lat=[ax[0]*Math.cos(ang)+bx[0]*Math.sin(ang),ax[1]*Math.cos(ang)+bx[1]*Math.sin(ang),ax[2]*Math.cos(ang)+bx[2]*Math.sin(ang)];
  const dir=norm([-v[0]+lat[0]*spread,-v[1]+lat[1]*spread,-v[2]+lat[2]*spread]);let p=[F[0]+dir[0]*(R-0.6),F[1]+dir[1]*(R-0.6),F[2]+dir[2]*(R-0.6)];const L=2+rnd()*4.5;
  for(let s=0;s<=L;s+=0.5){const f=s/L;p=[p[0]+dir[0]*0.5+lat[0]*0.12,p[1]+dir[1]*0.5+0.1,p[2]+dir[2]*0.5+lat[2]*0.12];if(rnd()<f*0.55)continue;put(p[0],p[1],p[2],f<0.3?LAVA:(f<0.65?ORANGE:RED));}}

// ---- right arm thrust toward the fireball ----
const S=[X0+3.6,12,Z0];
tube(S,lerp(S,H,0.5),1.3,1.7,BLUE);
ring(lerp(S,H,0.62),norm(sub(H,S)),0,2.0,0.6,GOLD);
tube(lerp(S,H,0.62),H,0.8,0.8,SAND);
ball(H[0],H[1],H[2],1.05,SAND);
for(let k=0;k<4;k++){const dir=norm([v[0]+ax[0]*(k-1.5)*0.5+bx[0]*0.3,v[1]+ax[1]*(k-1.5)*0.5+bx[1]*0.3,v[2]+ax[2]*(k-1.5)*0.5+bx[2]*0.3]);
  for(let s=0.9;s<=2.4;s+=0.5)put(H[0]+dir[0]*s,H[1]+dir[1]*s,H[2]+dir[2]*s,SAND);}
{const dir=norm([v[0]*0.4-bx[0],v[1]*0.4-bx[1],v[2]*0.4-bx[2]]);for(let s=0.9;s<=2;s+=0.5)put(H[0]+dir[0]*s,H[1]+dir[1]*s,H[2]+dir[2]*s,SAND);}

// ---- left arm + staff ----
for(let y=1;y<=22;y++)put(-10,y,0,OAK_LOG);
put(-11,21,0,OAK_LOG);put(-9,22,1,OAK_LOG);put(-11,16,0,OAK_LOG);put(-12,17,0,OAK_LOG);put(-12,18,0,LEAVES);put(-13,18,0,LEAVES);put(-9,6,0,OAK_LOG);
[[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dz])=>put(-10+dx,23,dz,GOLD));
[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([dx,dz])=>{put(-10+dx,24,dz,GOLD);put(-10+dx,25,dz,GOLD);});
put(-10,23,0,NEON_BLUE);put(-10,24,0,NEON_BLUE);put(-10,25,0,NEON_BLUE);put(-10,26,0,NEON_BLUE);
put(-10,28,0,ELECTRIC);
const S2=[X0-3.6,12,Z0],E2=[-8.5,10,2],H2=[-10,10,0];
tube(S2,E2,1.3,1.6,BLUE);
ring(lerp(E2,H2,0.35),norm(sub(H2,E2)),0,1.8,0.5,GOLD);
ball(H2[0],H2[1],H2[2],1.0,SAND);

// ---- floating spellbook ----
box(-9,14,-3,-6,14,-2,BROWN);box(-9,15,-3,-8,15,-2,WHITE);box(-7,15,-3,-6,15,-2,WHITE);put(-9,16,-3,WHITE);put(-9,16,-2,WHITE);put(-6,16,-3,WHITE);put(-6,16,-2,WHITE);
put(-8,15,-3,RED);

// ---- fire, sparks, embers in open air ----
for(let k=0;k<18;k++){const dir=norm([rnd()*2-1,rnd()*1.6-0.4,rnd()*2-1]);const d=R+1+rnd()*1.5;const p=[F[0]+dir[0]*d,F[1]+dir[1]*d,F[2]+dir[2]*d];if(!has(p[0],p[1],p[2]))put(p[0],p[1],p[2],FIRE);}
for(const s of [1.8,2.8]){const p=[H[0]+v[0]*s,H[1]+v[1]*s+0.5,H[2]+v[2]*s];if(!has(p[0],p[1],p[2]))put(p[0],p[1],p[2],FIRE);}
for(let k=0;k<3;k++){const dir=norm([rnd()*2-1,rnd()*2-1,rnd()*2-1]);const p=[F[0]+dir[0]*(R+3),F[1]+dir[1]*(R+3),F[2]+dir[2]*(R+3)];if(!has(p[0],p[1],p[2]))put(p[0],p[1],p[2],ELECTRIC);}
for(let k=0;k<16;k++){const dir=norm([rnd()*2-1,rnd()*1.5,rnd()*2-1]);const d=R+2+rnd()*4;const p=[F[0]+dir[0]*d,F[1]+dir[1]*d,F[2]+dir[2]*d];if(!has(p[0],p[1],p[2])){const n=rnd();put(p[0],p[1],p[2],n<0.4?ORANGE:(n<0.7?YELLOW:LAVA));}}

let count=0;for(const [x,y,z,id] of M.values()){if(count>=3990)break;block(x,y,z,id);count++;}