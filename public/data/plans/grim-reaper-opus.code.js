// grim-reaper-opus — prompt:
// the Grim Reaper with his scythe...

function H(x,y,z){let h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(z|0,1274126177);h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;}
const B=new Map();
function P(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;B.set(x+','+y+','+z,id);}
function C(x1,y1,z1,x2,y2,z2,id){for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)for(let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++)P(x,y,z,id);}
function L(x1,y1,z1,x2,y2,z2,id){const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1))*2||1;for(let i=0;i<=n;i++){const t=i/n;P(x1+(x2-x1)*t,y1+(y2-y1)*t,z1+(z2-z1)*t,id);}}
function S(cx,cy,cz,r,id){for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++)if((x-cx)**2+(y-cy)**2+(z-cz)**2<=r*r)P(x,y,z,id);}
const cloth=(x,y,z)=>H(x,y,z)<0.22?OBSIDIAN:BLACK;
function tube(a,b,r1,r2,mat){const len=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const n=Math.ceil(len*2);
  for(let i=0;i<=n;i++){const t=i/n,px=a[0]+(b[0]-a[0])*t,py=a[1]+(b[1]-a[1])*t,pz=a[2]+(b[2]-a[2])*t,r=r1+(r2-r1)*t;
    for(let x=Math.floor(px-r);x<=Math.ceil(px+r);x++)for(let y=Math.floor(py-r);y<=Math.ceil(py+r);y++)for(let z=Math.floor(pz-r);z<=Math.ceil(pz+r);z++)
      if((x-px)**2+(y-py)**2+(z-pz)**2<=r*r)P(x,y,z,mat(x,y,z));}}
function drape(a,b,r1,r2,seed){for(let i=0;i<=8;i++){const t=i/8,px=a[0]+(b[0]-a[0])*t,py=a[1]+(b[1]-a[1])*t,pz=a[2]+(b[2]-a[2])*t,r=r1+(r2-r1)*t;
  const len=1+Math.floor(H(i,seed,7)*3)+Math.round(t*2);for(let k=0;k<len;k++)P(px,py-r-k,pz,cloth(i,k,seed));}}

// ---- clear dead canopy in front & site, dig open grave ----
cube(-22,2,-22,22,10,12,AIR);
cylinder(0,0,0,10,10,AIR);
cube(-3,-3,-15,-1,0,-12,AIR);

// ---- stone dais ----
for(let x=-10;x<=10;x++)for(let z=-10;z<=10;z++){const d=Math.hypot(x,z);if(d>9.5)continue;P(x,-2,z,DIRT);const h=H(x,1,z);
  P(x,-1,z,d>8.4?(h<0.5?GRAY:STONE):(h>0.95?GREEN:h<0.45?COBBLE:h<0.8?STONE:GRAY));}

// ---- robe (flared, folded, tattered hem, trailing train) ----
function robe(y){const t=Math.min(1,y/19),k=Math.pow(1-t,1.3);return{rx:3.6+2.9*k,rz:2.9+2.6*k,cz:1.2-0.08*y};}
for(let y=0;y<=18;y++){const {rx,rz,cz}=robe(y);
  for(let x=-8;x<=8;x++)for(let z=-8;z<=12;z++){
    const dz=z-cz,th=Math.atan2(dz,x),w=Math.sin(th*8+y*0.18),f=1+0.07*w;
    const rzz=(dz>0?rz+Math.max(0,5-y)*0.7:rz)*f,rxx=rx*f;
    const d=(x/rxx)**2+(dz/rzz)**2,di=(x/(rxx-1.25))**2+(dz/(rzz-1.25))**2;
    if(d>1||di<=1)continue;
    if(y===0&&H(x,0,z)<0.28)continue;
    if(y===1&&H(x,1,z)<0.1)continue;
    P(x,y,z,w>0.6?OBSIDIAN:BLACK);
  }}
// shoulders
[[19,4.6,3.0],[20,4.7,3.0],[21,4.3,2.8],[22,3.4,2.4]].forEach(([y,rx,rz])=>{const cz=1.2-0.08*y;
  for(let x=-6;x<=6;x++)for(let z=-6;z<=5;z++){const dz=z-cz,d=(x/rx)**2+(dz/rz)**2,di=(x/(rx-1.25))**2+(dz/(rz-1.25))**2;
    if(d>1)continue;if(y<22&&di<=1)continue;P(x,y,z,cloth(x,y,z));}});

// ---- hood (cowl, leaning peak, face opening) ----
const HY=25.6,HZ=-0.6;
for(let x=-4;x<=4;x++)for(let y=21;y<=31;y++)for(let z=-6;z<=5;z++){
  const dy=y-HY,dz=z-HZ-Math.max(0,dy)*0.3;
  const d=(x/3.4)**2+(dy/4.3)**2+(dz/3.7)**2,di=(x/2.2)**2+(dy/3.1)**2+(dz/2.5)**2;
  if(d>1||di<=1)continue;
  const op=(x/2.5)**2+((y-25.4)/3)**2;
  if(z<HZ-1&&op<=1)continue;
  P(x,y,z,H(x,y,z)<0.15?OBSIDIAN:BLACK);
}
P(0,30,1,BLACK);P(0,30,2,BLACK);P(0,31,2,BLACK);
// cowl lip
for(let x=-3;x<=3;x++)for(let y=23;y<=29;y++){
  const op=(x/2.5)**2+((y-25.4)/3)**2;if(op<=1||op>2.0)continue;
  const dy=y-HY,q=1-(x/3.4)**2-(dy/4.3)**2;if(q<=0)continue;
  const zf=Math.floor(HZ+Math.max(0,dy)*0.3-3.7*Math.sqrt(q));
  P(x,y,zf,OBSIDIAN);if(y>=27)P(x,y,zf-1,BLACK);
}
// skull
S(0,25.6,-1.2,2.2,WHITE);
const face=["_WWW_","WWWWW","WEWEW","WWNWW","_WWW_","_TKT_"];
face.forEach((row,i)=>{const y=28-i;for(let j=0;j<5;j++){const c=row[j];P(j-2,y,-3,c==='_'||c==='N'||c==='K'?BLACK:c==='E'?NEON_RED:WHITE);}});

// ---- sleeves ----
tube([4.2,20.5,-0.5],[6.8,16.5,-1.5],1.8,1.6,cloth);
tube([6.8,16.5,-1.5],[7.2,15.2,-3.4],1.6,2.3,cloth);
tube([-4.2,20.5,-0.5],[-6.6,17.5,-2],1.8,1.6,cloth);
tube([-6.6,17.5,-2],[-5.6,17,-6.2],1.6,2.3,cloth);
drape([-6.6,17.5,-2],[-5.6,17,-6.2],1.6,2.3,11);
drape([6.8,16.5,-1.5],[7.2,15.2,-3.4],1.6,2.0,5);

// ---- rope belt, hanging cord, hourglass ----
{const {rx,rz,cz}=robe(12);const ax=rx*1.08+0.5,az=rz*1.08+0.5;
  for(let x=-7;x<=7;x++)for(let z=-7;z<=7;z++){const dz=z-cz,d=(x/ax)**2+(dz/az)**2,di=(x/(ax-1.1))**2+(dz/(az-1.1))**2;if(d<=1&&di>1)P(x,12,z,BROWN);}}
for(const [xx,y0] of [[1,8],[2,9]])for(let y=11;y>=y0;y--){const r=robe(y);const zf=r.cz-r.rz*1.07*Math.sqrt(Math.max(0,1-(xx/r.rx)**2));P(xx,y,Math.floor(zf),BROWN);}
C(-3,11,-4,-1,11,-4,GOLD);P(-3,10,-4,GLASS);P(-2,10,-4,SAND);P(-1,10,-4,GLASS);
P(-2,9,-4,SAND);P(-3,8,-4,GLASS);P(-2,8,-4,SAND);P(-1,8,-4,GLASS);C(-3,7,-4,-1,7,-4,GOLD);

// ---- scythe ----
for(let y=-1;y<=31;y++){const xs=Math.round(9-3*y/31);let id=BROWN;if(y>=12&&y<=17)id=BLACK;if(y===0)id=IRON;if(y===6||y===22)id=GOLD;
  for(let dx=0;dx<=1;dx++)for(let z=-5;z<=-4;z++)P(xs+dx,y,z,id);}
C(6,32,-5,7,32,-4,GOLD);
for(let x=7;x<=20;x++){const u=(x-7)/13,sp=31.6-8.5*Math.pow(u,1.7),w=3.3*Math.pow(1-u,0.8)+0.6;
  const top=Math.round(sp),bot=Math.round(sp-w);
  for(let y=bot;y<=top;y++){const id=y===bot?LIGHT_GRAY:IRON;P(x,y,-5,id);P(x,y,-4,id);}}
P(21,22,-5,IRON);P(21,22,-4,IRON);
P(5,31,-5,IRON);P(4,31,-5,IRON);P(5,31,-4,IRON);P(4,31,-4,IRON);
for(let x=5;x<=8;x++)for(let z=-6;z<=-3;z++)if(x===5||x===8||z===-6||z===-3)P(x,29,z,GOLD);
// crow perched on the blade
P(11,31,-5,BLACK);P(12,31,-5,BLACK);P(11,31,-4,BLACK);P(12,31,-4,BLACK);P(11,32,-5,BLACK);P(10,32,-5,GRAY);P(13,31,-5,BLACK);

// ---- bony hands ----
for(const y of [14,15]){P(8,y,-6,y===14?WHITE:LIGHT_GRAY);P(9,y,-6,WHITE);P(7,y,-5,WHITE);P(7,y,-4,LIGHT_GRAY);P(10,y,-5,LIGHT_GRAY);}
P(8,16,-6,WHITE);
C(-6,16,-9,-4,17,-9,WHITE);
P(-5,17,-10,LIGHT_GRAY);P(-5,17,-11,WHITE);P(-5,17,-12,LIGHT_GRAY);
P(-6,16,-10,WHITE);P(-6,15,-10,LIGHT_GRAY);P(-4,16,-10,WHITE);P(-4,15,-10,LIGHT_GRAY);P(-3,17,-10,WHITE);

// ---- graveyard ----
function tombA(x,z,fire,mound){C(x-1,-1,z,x+1,-1,z,COBBLE);
  for(let y=0;y<=2;y++)for(let dx=-1;dx<=1;dx++)P(x+dx,y,z,H(x+dx,y,z)<0.3?GRAY:STONE);
  P(x,3,z,STONE);P(x,2,z,GRAY);
  if(mound!==false){P(x,0,z+1,DIRT);P(x,0,z+2,DIRT);P(x,0,z+3,DIRT);}
  if(fire)P(x,4,z,FIRE);}
function tombB(x,z,m){P(x,-1,z,COBBLE);C(x,0,z,x,4,z,m);P(x-1,3,z,m);P(x+1,3,z,m);}
function tombC(x,z){C(x-1,-1,z-1,x+1,0,z+1,COBBLE);C(x,1,z,x,5,z,MARBLE);P(x,6,z,GRAY);}
tombA(-13,-10,true);tombB(-18,-5,MARBLE);tombC(-11,-16);
tombA(13,-12,true);tombB(18,-7,STONE);tombC(16,-16);
tombA(-2,-11,true,false);
tombB(-16,1,STONE);tombA(17,2,false);tombA(-19,10,true);tombB(11,10,MARBLE);tombC(-9,10);

// open grave with coffin & bones, leaning lid, dirt pile and shovel
C(-3,-4,-15,-1,-4,-12,BROWN);
for(let x=-3;x<=-1;x++)for(let z=-15;z<=-12;z++)if(x!==-2||z===-15||z===-12)P(x,-3,z,BROWN);
P(-2,-3,-14,WHITE);P(-2,-3,-13,LIGHT_GRAY);
C(-5,0,-15,-5,1,-12,BROWN);P(-5,1,-14,GOLD);P(-5,1,-13,GOLD);
C(0,-1,-15,1,-1,-12,DIRT);P(0,0,-14,DIRT);P(0,0,-13,DIRT);P(1,0,-13,DIRT);
P(1,0,-14,IRON);C(1,1,-14,1,3,-14,BROWN);P(1,4,-14,BLACK);

// braziers lighting the reaper's front
function brazier(x,z){P(x,-1,z,COBBLE);C(x,0,z,x,1,z,IRON);
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)P(x+dx,2,z+dz,dx===0&&dz===0?LAVA:IRON);P(x,3,z,FIRE);}
brazier(-8,-8);brazier(8,-9);

// scattered bones
P(-7,0,-6,WHITE);P(-6,0,-7,WHITE);P(5,0,-8,WHITE);P(6,0,-8,LIGHT_GRAY);P(-4,0,7,WHITE);

// dead trees
C(-15,-1,7,-15,10,7,OAK_LOG);P(-14,-1,7,OAK_LOG);P(-16,-1,8,OAK_LOG);P(-15,-1,6,OAK_LOG);P(-16,0,7,OAK_LOG);
L(-15,5,7,-19,9,5,OAK_LOG);L(-19,9,5,-21,10,4,BROWN);L(-19,9,5,-20,12,6,BROWN);
L(-15,7,7,-11,10,8,OAK_LOG);L(-11,10,8,-10,13,7,BROWN);L(-11,10,8,-9,10,10,BROWN);
L(-15,10,7,-17,14,9,OAK_LOG);L(-15,10,7,-13,14,6,BROWN);
P(-18,7,5,IRON);P(-18,6,5,GLOWSTONE);P(-18,5,5,IRON);
P(-10,14,7,BLACK);P(-10,15,7,BLACK);P(-11,15,7,GRAY);
C(16,-1,8,16,8,8,OAK_LOG);P(17,-1,8,OAK_LOG);P(16,-1,9,OAK_LOG);
L(16,4,8,19,7,9,OAK_LOG);L(19,7,9,21,9,8,BROWN);L(16,6,8,13,9,7,OAK_LOG);L(13,9,7,12,11,6,BROWN);L(16,8,8,17,11,9,BROWN);

// wrought iron fence behind
for(let x=-20;x<=20;x++){if(x%2===0){C(x,-1,12,x,2,12,BLACK);P(x,3,12,IRON);}else{P(x,0,12,BLACK);P(x,2,12,BLACK);}}

// lost souls drifting over graves
P(-14,6,-7,NEON_BLUE);P(-17,5,2,NEON_BLUE);P(14,7,-9,NEON_BLUE);

// ---- emit ----
let keys=[...B.keys()];
if(keys.length>3990){for(const k of keys){if(B.size<=3990)break;const p=k.split(',');if(p[1]==='-2')B.delete(k);}}
for(const [k,id] of B){const p=k.split(',').map(Number);block(p[0],p[1],p[2],id);}