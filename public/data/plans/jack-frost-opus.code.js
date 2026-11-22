// jack-frost-opus — prompt:
// Jack Frost...

function P(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;M.set(x+','+y+','+z,[x,y,z,id]);}
const M=new Map();
function K(x,y,z){return Math.round(x)+','+Math.round(y)+','+Math.round(z);}
function D(x1,y1,z1,x2,y2,z2){for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)M.delete(x+','+y+','+z);}
function C(x1,y1,z1,x2,y2,z2,id){for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)for(let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++)P(x,y,z,id);}
function L(x1,y1,z1,x2,y2,z2,id){const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1),1);for(let i=0;i<=n;i++){const t=i/n;P(x1+(x2-x1)*t,y1+(y2-y1)*t,z1+(z2-z1)*t,id);}}
function S(cx,cy,cz,r,id){for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++){const dx=x-cx,dy=y-cy,dz=z-cz;if(dx*dx+dy*dy+dz*dz<=r*r)P(x,y,z,id);}}
function TL(x1,y1,z1,x2,y2,z2,r,id){const n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1))*2)||1;for(let i=0;i<=n;i++){const t=i/n;S(x1+(x2-x1)*t,y1+(y2-y1)*t,z1+(z2-z1)*t,r,id);}}
const frac=v=>v-Math.floor(v);
const h2=(x,z)=>frac(Math.sin(x*12.9898+z*78.233)*43758.5453);
const h3=(x,y,z)=>frac(Math.sin(x*12.9898+y*39.346+z*78.233)*43758.5453);
function Pn(x,y,z,id){if(!M.has(K(x,y,z)))P(x,y,z,id);}

// ================= JACK FROST =================
// Bare feet
C(-3,1,-3,-1,1,1,SAND);C(-3,2,-1,-1,2,1,SAND);
C(1,1,-3,3,1,1,SAND);C(1,2,-1,3,2,1,SAND);
// Legs (brown trousers) with frosted rolled cuffs
C(-3,3,-1,-1,11,1,BROWN);C(1,3,-1,3,11,1,BROWN);C(-3,10,-1,3,11,1,BROWN);
C(-4,3,-2,0,3,2,WHITE);C(0,3,-2,4,3,2,WHITE);
P(0,3,-2,AIR);M.delete(K(0,3,-2));M.delete(K(0,3,2));
P(-2,7,-1,LIGHT_GRAY);P(-3,8,-1,WHITE);P(-1,6,-1,WHITE);P(2,6,-1,WHITE);P(1,7,-1,LIGHT_GRAY);P(3,8,-1,WHITE);
// Tunic hem flare with icicle trim
for(let x=-5;x<=5;x++)for(let z=-3;z<=3;z++){const ring=Math.abs(x)===5||Math.abs(z)===3;P(x,11,z,LIGHT_BLUE);if(ring){P(x,10,z,LIGHT_BLUE);if(((x+z)&1)===0)P(x,9,z,WHITE);if(((x+z+8)%4)===0)P(x,8,z,ICE);}}
// Torso
C(-4,12,-2,4,19,2,LIGHT_BLUE);
C(-5,18,-2,-5,19,2,LIGHT_BLUE);C(5,18,-2,5,19,2,LIGHT_BLUE);
for(let x=-4;x<=4;x++)for(let y=12;y<=19;y++)for(let z=-2;z<=2;z++){if((Math.abs(x)===4||z===2)&&h3(x,y,z)>0.88)P(x,y,z,WHITE);}
// Belt + buckle + pouch
C(-4,13,-2,4,13,2,BROWN);P(0,13,-3,IRON);C(-5,12,-1,-5,13,0,BROWN);P(-5,13,-1,IRON);
// Frost fern pattern on chest
L(-4,14,-2,-2,17,-2,WHITE);L(-3,15,-2,-4,16,-2,WHITE);L(-2,16,-2,-3,18,-2,WHITE);
L(4,14,-2,2,17,-2,WHITE);L(3,15,-2,4,16,-2,WHITE);L(2,16,-2,3,18,-2,WHITE);
// V neckline + lacing
P(0,19,-2,SAND);P(0,18,-2,SAND);P(-1,19,-2,SAND);P(1,19,-2,SAND);P(0,17,-2,BROWN);P(0,15,-2,BROWN);
// Ice brooches
P(-4,19,-3,ICE);P(4,19,-3,ICE);
// Frost fur collar + hood
C(-5,20,-3,5,20,3,WHITE);P(-5,21,-3,ICE);P(5,21,-3,ICE);P(-5,21,3,ICE);P(5,21,3,ICE);
C(-3,20,3,3,22,4,LIGHT_BLUE);C(-2,21,5,2,21,5,LIGHT_BLUE);

// Head
C(-3,21,-3,3,26,2,SAND);
// Face (front z=-3)
P(-2,24,-3,NEON_BLUE);P(2,24,-3,NEON_BLUE);
P(-3,25,-3,WHITE);P(-2,25,-3,WHITE);P(2,25,-3,WHITE);P(3,25,-3,WHITE);
P(0,23,-4,SAND);
P(-3,23,-3,PINK);P(3,23,-3,PINK);
P(-1,22,-3,BROWN);P(0,22,-3,BROWN);P(1,22,-3,BROWN);P(2,23,-3,BROWN);
// Hair: cap, fringe, sides, back
for(let x=-4;x<=4;x++)for(let y=27;y<=28;y++)for(let z=-4;z<=3;z++)P(x,y,z,h3(x,y,z)>0.9?LIGHT_BLUE:WHITE);
L(-4,26,-4,4,26,-4,WHITE);P(-4,25,-4,WHITE);P(0,25,-4,WHITE);P(4,25,-4,WHITE);P(-3,25,-4,LIGHT_BLUE);
C(-4,23,-3,-4,26,3,WHITE);C(4,23,-3,4,26,3,WHITE);
for(let x=-4;x<=4;x++)for(let y=23;y<=27;y++)for(let z=3;z<=4;z++)P(x,y,z,h3(x,y,z)>0.88?LIGHT_BLUE:WHITE);
P(-2,22,4,WHITE);P(1,22,4,WHITE);P(3,22,4,WHITE);
function spike(bx,by,bz,tx,ty,tz){const n=Math.max(Math.abs(tx-bx),Math.abs(ty-by),Math.abs(tz-bz),1);for(let i=0;i<=n;i++){const t=i/n;const x=bx+(tx-bx)*t,y=by+(ty-by)*t,z=bz+(tz-bz)*t;P(x,y,z,t>0.75?ICE:(t>0.5?LIGHT_BLUE:WHITE));if(t<0.45){P(x+1,y,z,WHITE);P(x,y,z+1,WHITE);}}}
[[-3,28,-3,-5,31,-6],[0,28,-4,1,31,-7],[2,28,-3,4,30,-6],[-1,28,0,-2,32,0],[1,28,0,2,33,1],[3,28,0,6,30,1],
 [-4,28,0,-8,30,1],[4,27,2,7,29,4],[0,28,2,0,31,6],[-3,27,3,-5,30,7],[2,27,3,4,29,7],[-2,28,-2,-3,32,-3]].forEach(s=>spike(...s));
// Pointed elf ears
for(const s of [-1,1]){P(4*s,24,0,SAND);P(4*s,25,0,SAND);P(5*s,24,0,SAND);P(5*s,25,0,SAND);P(6*s,25,0,SAND);P(6*s,26,0,SAND);P(7*s,27,0,SAND);}

// Right arm gripping staff
TL(5,18,0,6,14,0,1.5,LIGHT_BLUE);
TL(6,14,0,8,15.5,-2,1.2,LIGHT_BLUE);
C(6,14,-2,6,16,-1,WHITE);
// Staff with frost spiral
C(8,1,-2,8,27,-2,OAK_LOG);
const sp=[[1,0],[0,-1],[-1,0],[0,1]];
for(let y=3,i=0;y<=26;y+=2,i++){if(y>=13&&y<=18)continue;const [dx,dz]=sp[i%4];P(8+dx,y,-2+dz,ICE);}
C(7,15,-3,9,16,-1,SAND);P(9,14,-2,SAND);
// Staff crown prongs + ice crystal
L(8,27,-2,10,29,-2,LIGHT_BLUE);L(8,27,-2,6,29,-2,LIGHT_BLUE);L(8,27,-2,8,29,0,LIGHT_BLUE);L(8,27,-2,8,29,-4,LIGHT_BLUE);
P(10,30,-2,ICE);P(6,30,-2,ICE);P(8,30,0,ICE);P(8,30,-4,ICE);
for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)for(let dz=-2;dz<=2;dz++)if(Math.abs(dx)+Math.abs(dy)+Math.abs(dz)<=2)P(8+dx,30+dy,-2+dz,ICE);
P(8,30,-2,NEON_BLUE);P(8,31,-2,NEON_BLUE);P(8,33,-2,LIGHT_BLUE);
P(10,32,-3,ELECTRIC);

// Left arm raised, casting frost
TL(-5,18,0,-8,19,-2,1.5,LIGHT_BLUE);
TL(-8,19,-2,-10,21,-5,1.2,LIGHT_BLUE);
S(-10,21,-5,1.2,WHITE);
S(-11,22,-6,1.0,SAND);
L(-11,23,-7,-11,25,-8,SAND);L(-12,23,-7,-13,25,-8,SAND);L(-10,23,-7,-9,24,-8,SAND);L(-12,21,-7,-13,21,-8,SAND);
P(-14,23,-7,ELECTRIC);

// Giant snowflake conjured in front
const fx=-15,fy=26,fz=-9;
for(let a=0;a<6;a++){const ang=Math.PI/2+a*Math.PI/3,ca=Math.cos(ang),sa=Math.sin(ang);
  for(let t=1;t<=6;t++)P(fx+ca*t,fy+sa*t,fz,t===6?WHITE:LIGHT_BLUE);
  for(const s of [-1,1]){const b=ang+s*Math.PI/3;
    for(let t=1;t<=2;t++)P(fx+ca*3+Math.cos(b)*t,fy+sa*3+Math.sin(b)*t,fz,WHITE);
    P(fx+ca*5+Math.cos(b),fy+sa*5+Math.sin(b),fz,ICE);}
  P(fx+Math.cos(ang+Math.PI/6)*1.6,fy+Math.sin(ang+Math.PI/6)*1.6,fz,ICE);}
P(fx,fy,fz,NEON_BLUE);P(fx,fy,fz-1,ELECTRIC);
function mini(cx,cy,cz){P(cx,cy,cz,WHITE);for(let a=0;a<6;a++){const ang=Math.PI/2+a*Math.PI/3;for(let t=1;t<=2;t++)P(cx+Math.cos(ang)*t,cy+Math.sin(ang)*t,cz,t===2?ICE:LIGHT_BLUE);}}
mini(-6,31,-7);mini(-19,16,-6);mini(14,23,-5);
P(-16,21,-7,ICE);P(-18,24,-7,ICE);P(-12,29,-7,ICE);P(-17,30,-8,WHITE);P(-9,27,-6,WHITE);P(-20,28,-8,ICE);

// Billowing frost cape
for(let y=19;y>=3;y--){const k=19-y;const zc=3+Math.floor(k*0.42);const hw=5+Math.floor(k*0.28);const sw=Math.round(k*0.3+Math.sin(k*0.5)*0.8);let pz=null;
  for(let x=-hw;x<=hw;x++){const u=x/hw;const z=zc-Math.round(u*u*2)+Math.round(Math.sin(x*0.7+k*0.4)*0.6);
    const edge=Math.abs(x)===hw;const id=edge||y===3?WHITE:(h3(x,y,z)>0.9?LIGHT_BLUE:BLUE);
    P(x+sw,y,z,id);
    if(pz!==null&&Math.abs(z-pz)>1){const st=z>pz?1:-1;for(let zz=pz+st;zz!==z;zz+=st)P(x+sw,y,zz,id);}
    pz=z;
    if(y===3&&((x+20)%2===0))P(x+sw,2,z,ICE);}}

// Hollow hidden interiors
D(-3,14,-1,3,18,1);D(-2,22,-2,2,25,1);D(-3,27,-3,3,27,2);D(-2,4,0,-2,9,0);D(2,4,0,2,9,0);

// ================= GROUND: snowfield, frozen pond, frost cracks =================
for(let x=-16;x<=16;x++)for(let z=-16;z<=16;z++){const d=Math.sqrt(x*x+z*z);const edge=12.3+h2(x,z)*1.2+Math.sin(Math.atan2(z,x)*3)*0.8;
  if(d<=edge)P(x,0,z,SNOW);else if(d<=edge+2.5&&h2(z,x)>0.45)P(x,0,z,SNOW);}
const pond=(x,z)=>((x+7)*(x+7))/16+((z+8)*(z+8))/9;
for(let x=-12;x<=-2;x++)for(let z=-12;z<=-4;z++){const v=pond(x,z);if(v<=1){P(x,0,z,ICE);P(x,-1,z,BLUE);}else if(v<=1.7&&h2(x,z)>0.5)P(x,1,z,SNOW);}
for(let k=0;k<9;k++){const a=k*2*Math.PI/9+0.4;
  for(let r=3;r<=12;r++){const aa=a+Math.sin(r*0.8+k*1.7)*0.18;const x=Math.round(Math.cos(aa)*r),z=Math.round(-1+Math.sin(aa)*r);
    const g=M.get(K(x,0,z));if(g&&g[3]===SNOW)P(x,0,z,LIGHT_BLUE);
    if(r===6||r===9){for(const s of [-0.7,0.7])for(let t=1;t<=2;t++){const bx=Math.round(x+Math.cos(aa+s)*t),bz=Math.round(z+Math.sin(aa+s)*t);const q=M.get(K(bx,0,bz));if(q&&q[3]===SNOW)P(bx,0,bz,LIGHT_BLUE);}}}}

// Ice spike clusters
function cluster(cx,cz,list){for(const [ox,oz,h,tx,tz] of list){const x=cx+ox,z=cz+oz;L(x,1,z,x+tx,h,z+tz,ICE);if(h>=5)L(x+1,1,z,x+tx,h-2,z+tz,ICE);P(x,1,z,LIGHT_BLUE);}}
cluster(-9,5,[[0,0,7,-1,0],[1,0,5,1,-1],[-1,1,4,-1,1],[0,-1,3,0,-1]]);
cluster(11,3,[[0,0,6,1,0],[1,1,4,1,1],[-1,0,3,0,-1]]);
cluster(4,-10,[[0,0,4,0,-1],[1,0,3,1,0],[-1,1,2,0,0]]);
cluster(-13,-3,[[0,0,5,-1,0],[1,1,3,0,1],[0,-1,2,0,0]]);

// Snowman companion
S(12,2,-7,2.2,SNOW);S(12,5.5,-7,1.6,SNOW);S(12,8.3,-7,1.3,SNOW);
P(11,9,-8,BLACK);P(13,9,-8,BLACK);P(12,8,-9,ORANGE);P(12,8,-10,ORANGE);
P(12,5,-8,BLACK);P(12,2,-9,BLACK);P(12,3,-9,BLACK);
C(11,7,-8,13,7,-6,RED);L(13,6,-9,13,4,-9,RED);
L(11,6,-7,9,8,-8,OAK_LOG);L(13,6,-7,15,8,-6,OAK_LOG);P(16,9,-6,OAK_LOG);P(8,9,-8,OAK_LOG);
C(11,10,-8,13,10,-6,BLACK);C(12,11,-7,12,12,-7,BLACK);P(12,11,-8,RED);

// Frosted pines in the background
function pine(cx,cz,top){C(cx,-1,cz,cx,3,cz,OAK_LOG);
  const rAt=y=>{if(y>top)return -1;const k=top-y;const t=Math.floor(k/3),p=k%3;return Math.round(t+p*0.8);};
  for(let y=3;y<=top;y++){const r=rAt(y),ru=rAt(y+1);
    for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){const d=Math.sqrt(dx*dx+dz*dz);if(d>r+0.3)continue;
      const exposed=d>ru+0.3;const shell=d>r-1.3;
      if(exposed)P(cx+dx,y,cz+dz,SNOW);else if(shell)P(cx+dx,y,cz+dz,LEAVES);}}
  P(cx,top+1,cz,SNOW);P(cx,top+2,cz,ICE);}
const trees=[[-16,3,14],[14,13,13],[-6,15,11]];
for(const [tx,tz,tt] of trees){if(M.size<3600)pine(tx,tz,tt);}

// Snow drifts (optional, budget permitting)
for(let x=-14;x<=14;x++)for(let z=-14;z<=14;z++){if(M.size>=3960)break;const d=Math.sqrt(x*x+z*z);if(d<7||d>12)continue;if(pond(x,z)<=1.8)continue;
  const v=h2(x*3+1,z*3-2);if(v>0.8)Pn(x,1,z,SNOW);if(v>0.95)Pn(x,2,z,SNOW);}

// ================= EMIT =================
let count=0;
for(const [x,y,z,id] of M.values()){if(count>=3995)break;block(x,y,z,id);count++;}
// Clear existing deciduous trees only where needed (never over our own blocks)
const zones=[[0,0,14,8],[12,-7,4,12],[-16,3,6,16],[14,13,6,15],[-6,15,6,13]];
const cleared=new Set();
for(const [cx,cz,r,ym] of zones){for(let x=cx-r;x<=cx+r;x++)for(let z=cz-r;z<=cz+r;z++){if((x-cx)*(x-cx)+(z-cz)*(z-cz)>r*r)continue;if(x<-22||x>22||z<-22||z>22)continue;
  for(let y=1;y<=ym;y++){const k=x+','+y+','+z;if(M.has(k)||cleared.has(k))continue;cleared.add(k);block(x,y,z,AIR);}}}