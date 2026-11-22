// snow-monkey-fable — prompt:
// a Japanese snow monkey in a hot spring...

const M=new Map(),WAT=new Map(),LOW=new Map(),AIRS=new Set();
const K=(x,y,z)=>x+','+y+','+z;
function put(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;M.set(K(x,y,z),[x,y,z,id]);}
function hash(x,y,z){const h=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return h-Math.floor(h);}
function ell(cx,cy,cz,rx,ry,rz,col,o){
  o=o||{};const ymin=o.ymin===undefined?-8:o.ymin;
  const ins=(x,y,z)=>{const a=(x-cx)/rx,b=(y-cy)/ry,c=(z-cz)/rz;return a*a+b*b+c*c<=1;};
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)
  for(let y=Math.max(ymin,Math.floor(cy-ry));y<=Math.ceil(cy+ry);y++)
  for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    if(!ins(x,y,z))continue;
    if(!o.solid&&ins(x+1,y,z)&&ins(x-1,y,z)&&ins(x,y+1,z)&&ins(x,y-1,z)&&ins(x,y,z+1)&&ins(x,y,z-1))continue;
    if(o.skip&&o.skip(x,y,z))continue;
    if(o.free&&M.has(K(x,y,z)))continue;
    put(x,y,z,typeof col==='function'?col(x,y,z):col);
    if(o.track)o.track.push([x,y,z]);
  }
}
function tube(x1,y1,z1,x2,y2,z2,r,col,ymin){
  const n=Math.ceil(Math.hypot(x2-x1,y2-y1,z2-z1)*1.5);
  for(let i=0;i<=n;i++){const t=n?i/n:0;ell(x1+(x2-x1)*t,y1+(y2-y1)*t,z1+(z2-z1)*t,r,r,r,col,{solid:true,ymin:ymin});}
}
function seg(x1,y1,z1,x2,y2,z2,id){
  const n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1)));
  for(let i=0;i<=n;i++){const t=n?i/n:0;put(x1+(x2-x1)*t,y1+(y2-y1)*t,z1+(z2-z1)*t,id);}
}
function fur(x,y,z){const h=hash(x,y,z);if(y<=0)return h<0.6?GRAY:BROWN;return h<0.5?LIGHT_GRAY:h<0.74?SAND:GRAY;}
function bodyFur(x,y,z){const h=hash(x+9,y,z);if(y>=10&&z>=3&&h<0.8)return SNOW;if(y>0&&y<=9&&z<=-2&&Math.abs(x)<=3)return h<0.6?SAND:LIGHT_GRAY;return fur(x,y,z);}
function babyFur(x,y,z){if(y<=0)return BROWN;return hash(x,y+5,z)<0.75?BROWN:GRAY;}
const inPool=(x,z)=>(x/12)*(x/12)+((z+1)/9)*((z+1)/9)<=1;

// ===== MOTHER MONKEY (in the pool, facing north) =====
const inHeadCore=(x,y,z)=>(x/4.5)**2+((y-15)/4)**2+((z+1)/4)**2<1;
const inBodyCore=(x,y,z)=>(x/5.5)**2+((y-4)/6.5)**2+((z-2)/5)**2<1;
ell(0,4,2,6.5,7.5,6,bodyFur,{ymin:0,skip:inHeadCore});
ell(0,15,-1,5.5,5,5,fur,{skip:inBodyCore});
// face plate + fur ruff
for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++){
  const f=(dx/3.5)**2+(dy/3.4)**2<=1,g=(dx/4.7)**2+(dy/4.6)**2<=1;
  const x=dx,y=15+dy;
  if(f){put(x,y,-5,fur(x,y,-5));if(!(dy<=-1&&Math.abs(dx)<=2))put(x,y,-6,PINK);}
  else if(g){for(let z=-7;z<=-5;z++)put(x,y,z,fur(x,y,z));}
}
for(const s of [-1,1]){
  put(s,16,-6,BLACK);put(2*s,16,-6,BLACK);
  put(3*s,15,-6,RED);put(3*s,14,-6,RED);
}
// muzzle
for(let y=12;y<=14;y++)for(let x=-2;x<=2;x++){if(y===12&&Math.abs(x)>1)continue;put(x,y,-7,PINK);}
put(-1,14,-7,BLACK);put(1,14,-7,BLACK);
for(let x=-1;x<=1;x++)put(x,12,-7,BROWN);
// ears
for(const s of [-1,1]){put(6*s,15,-2,PINK);put(6*s,16,-2,PINK);put(6*s,15,-1,PINK);put(6*s,16,-1,PINK);}
// snow cap on head + brow dusting
ell(0,15.6,-1,5.2,5.9,4.8,SNOW,{ymin:19});
for(let x=-2;x<=2;x++){put(x,20,-6,SNOW);put(x,20,-5,SNOW);}
// knees poking out of the water
ell(-4,1,-5,2.5,2.5,2.5,fur,{ymin:0,solid:true});
ell(4,1,-5,2.5,2.5,2.5,fur,{ymin:0,solid:true});
// west arm resting on knee
tube(-6,9,1,-7,4.5,-2,1.3,fur,0);
tube(-7,4.5,-2,-4.5,4.2,-5.5,1.3,fur,0);
for(let x=-5;x<=-3;x++){put(x,4,-6,PINK);put(x,4,-7,PINK);}
// east arm reaching down to the baby
tube(6,9,1,7.2,4,-0.5,1.3,fur,0);
tube(7.2,4,-0.5,7.5,0,-2,1.3,fur,0);
// shoulder snow
for(const s of [-1,1]){put(6*s,11,1,SNOW);put(6*s,11,0,SNOW);put(5*s,11,1,SNOW);}

// ===== BABY MONKEY (snuggled by mother's knee) =====
ell(9,1,-3.5,2.3,2.6,2.3,babyFur,{ymin:0,solid:true});
ell(9,5,-4,2.5,2.5,2.5,babyFur,{solid:true});
for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)put(9+dx,5+dy,-6,PINK);
put(8,5,-6,BLACK);put(10,5,-6,BLACK);put(9,4,-7,PINK);
put(6,6,-4,PINK);put(12,6,-4,PINK);
put(9,8,-4,SNOW);put(8,8,-4,SNOW);put(9,8,-3,SNOW);

// ===== SECOND MONKEY (sitting on a boulder behind the pool) =====
ell(-9,7.5,10.5,3.3,3.8,3.2,fur,{});
ell(-9,13,9,3,3,3,fur,{});
for(let x=-11;x<=-7;x++){put(x,14,6,PINK);put(x,13,6,PINK);}
for(let x=-10;x<=-8;x++){put(x,12,6,PINK);put(x,12,5,PINK);put(x,13,5,PINK);}
put(-10,14,6,BLACK);put(-8,14,6,BLACK);put(-9,12,5,BROWN);
put(-13,13,9,PINK);put(-5,13,9,PINK);
for(let x=-10;x<=-8;x++)for(let z=8;z<=10;z++)put(x,16,z,SNOW);
put(-9,17,9,SNOW);
ell(-11,5,7.5,1.6,1.6,1.6,fur,{solid:true});
ell(-7,5,7.5,1.6,1.6,1.6,fur,{solid:true});
tube(-11,5,7.5,-11,2,6.5,1,fur,1);
tube(-7,5,7.5,-7,2,6.5,1,fur,1);
tube(-12,10.5,10,-11.5,6.5,8,1.1,fur,1);
tube(-6,10.5,10,-6.5,6.5,8,1.1,fur,1);

// ===== STEAM rising off the water =====
[[-10,1,1],[-8,1,4],[-9,1,-3],[-6,1,-7],[-3,1,-9],[2,1,-9],[6,1,-8],[10,1,1],[8,1,4],[-1,1,-10],[11,1,-1]].forEach(p=>put(p[0],p[1],p[2],STEAM));

// ===== floating yuzu =====
put(-7,0,-5,YELLOW);put(-2,0,-8,YELLOW);put(6,0,-8,ORANGE);put(-9,0,0,ORANGE);put(3,0,-9,YELLOW);

// ===== STONE LANTERN =====
const LX=-15,LZ=-5;
for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){put(LX+dx,1,LZ+dz,STONE);put(LX+dx,5,LZ+dz,STONE);put(LX+dx,8,LZ+dz,SNOW);}
for(let y=2;y<=4;y++)put(LX,y,LZ,COBBLE);
put(LX,6,LZ,GLOWSTONE);
for(const a of [-1,1])for(const b of [-1,1])put(LX+a,6,LZ+b,STONE);
for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)put(LX+dx,7,LZ+dz,STONE);
put(LX,9,LZ,SNOW);

// ===== BAMBOO SPOUT =====
for(let y=1;y<=5;y++)put(15,y,2,y%2?GREEN:LIME);
seg(15,5,2,10,3,2,LIME);
put(9,2,2,WATER);put(9,1,2,WATER);

// ===== SNOW-LADEN PINE =====
function pad(cx,cy,cz,r){
  for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
    const d=Math.hypot(dx,dz);
    if(d<=r)put(cx+dx,cy,cz+dz,hash(cx+dx,cy,cz+dz)<0.6?LEAVES:GREEN);
    if(d<=r-0.7)put(cx+dx,cy+1,cz+dz,SNOW);
    if(d<=r-1.6)put(cx+dx,cy-1,cz+dz,LEAVES);
  }
}
pad(8,7,9,3.2);pad(14,9,12,3);pad(10,11,12,2.8);pad(13,13,9,2.6);pad(11,16,10,2.4);pad(11,18,10,1.3);
seg(11,-1,10,11,4,10,OAK_LOG);seg(11,4,10,12,9,11,OAK_LOG);seg(12,9,11,12,12,10,OAK_LOG);seg(12,12,10,11,15,10,OAK_LOG);
put(12,-1,10,OAK_LOG);put(12,0,10,OAK_LOG);put(11,-1,11,OAK_LOG);put(11,0,11,OAK_LOG);
seg(11,5,10,9,6,9,OAK_LOG);seg(12,8,11,14,8,12,OAK_LOG);seg(12,10,11,10,10,12,OAK_LOG);seg(12,12,10,13,12,9,OAK_LOG);

// ===== ROCKS: boulders, pool curb, rim blobs =====
const ROCKS=[];
const rockCol=(x,y,z)=>{const h=hash(x*3,y*5,z*7);return h<0.5?STONE:h<0.8?COBBLE:GRAY;};
function rock(cx,cy,cz,rx,ry,rz){ell(cx,cy,cz,rx,ry,rz,rockCol,{ymin:0,free:true,track:ROCKS});}
rock(-9,1,10,4.5,3,3.5);
rock(3,1.5,12.5,4,3.4,2.8);
for(let x=-14;x<=14;x++)for(let z=-12;z<=10;z++){
  if(inPool(x,z))continue;
  if((x/13.3)**2+((z+1)/10.3)**2>1)continue;
  if(M.has(K(x,0,z)))continue;
  put(x,0,z,rockCol(x,0,z));ROCKS.push([x,0,z]);
}
const NR=30;
for(let i=0;i<NR;i++){
  const t=i/NR*Math.PI*2+0.1,h=hash(i,7,3),h2=hash(i,1,9);
  const b=(Math.sin(t)+1)/2;
  const r=1.2+0.9*b+0.6*h;
  rock(Math.cos(t)*(12+0.8*r),r*0.3,-1+Math.sin(t)*(9+0.8*r),r,r*(0.8+0.4*h2),r);
}
// snow caps on rocks (heavier toward the back)
for(const p of ROCKS){
  const x=p[0],y=p[1],z=p[2];
  if(M.has(K(x,y+1,z)))continue;
  const pr=0.3+0.6*Math.max(0,Math.min(1,(z+11)/22));
  if(hash(x,y,z+50)<pr)put(x,y+1,z,SNOW);
}

// ===== WATER =====
const inMom=(x,z)=>x*x/42.25+(z-2)*(z-2)/36<=0.716;
for(let x=-12;x<=12;x++)for(let z=-10;z<=8;z++){
  if(!inPool(x,z)||inMom(x,z))continue;
  WAT.set(K(x,0,z),[x,0,z,WATER]);
}

// ===== LOW PRIORITY: snow ground, then pool floor (front first) =====
for(let x=-16;x<=16;x++)for(let z=-14;z<=14;z++){
  if((x/15.5)**2+(z/13.5)**2>1||inPool(x,z))continue;
  LOW.set(K(x,0,z),[x,0,z,SNOW]);
}
for(let x=4;x<=16;x++)for(let z=4;z<=14;z++){
  const e=(x/15.5)**2+(z/13.5)**2;
  if(e>1||e<0.72||inPool(x,z))continue;
  LOW.set(K(x,-1,z),[x,-1,z,SNOW]);
}
const floor=[];
for(let x=-12;x<=12;x++)for(let z=-10;z<=8;z++){
  if(!inPool(x,z)||inMom(x,z))continue;
  floor.push([x,-1,z,hash(x,2,z)<0.6?STONE:COBBLE]);
}
floor.sort((a,b)=>a[2]-b[2]);
for(const f of floor)LOW.set(K(f[0],f[1],f[2]),f);

// ===== AIR: clear trees over the scene =====
for(let y=1;y<=7;y++)for(let x=-17;x<=17;x++)for(let z=-15;z<=15;z++){
  if((x/17)**2+(z/15)**2<=1)AIRS.add(K(x,y,z));
}
function airBox(x1,y1,z1,x2,y2,z2){for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)AIRS.add(K(x,y,z));}
airBox(6,1,6,17,7,16);
airBox(-14,1,6,-4,7,15);
airBox(-19,1,-9,-12,9,-1);

// ===== EMIT (solids first, budget-guarded; then AIR) =====
let count=0;const used=new Set();
function emit(map){
  for(const [k,v] of map){
    if(used.has(k))continue;
    if(count>=3990)return;
    used.add(k);block(v[0],v[1],v[2],v[3]);count++;
  }
}
emit(M);emit(WAT);emit(LOW);
for(const k of AIRS){
  if(used.has(k))continue;
  const p=k.split(',').map(Number);
  block(p[0],p[1],p[2],AIR);
}