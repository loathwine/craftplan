// ski-jumper-opus — prompt:
// a ski jumper flying off a ski jump...

cube(-22,1,-22,22,9,-7,AIR);
cube(-22,1,-6,22,12,7,AIR);
cube(-12,1,8,22,10,12,AIR);

const M = new Map();
function put(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);
  if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return; M.set(x+','+y+','+z,[x,y,z,id]);}
function soft(x,y,z,id){const k=Math.round(x)+','+Math.round(y)+','+Math.round(z); if(!M.has(k))put(x,y,z,id);}
function fill(x1,y1,z1,x2,y2,z2,id){for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)for(let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++)put(x,y,z,id);}
function ln(x1,y1,z1,x2,y2,z2,id){const n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1),1));for(let i=0;i<=n;i++){const t=i/n;put(x1+(x2-x1)*t,y1+(y2-y1)*t,z1+(z2-z1)*t,id);}}
function hash(a,b){let h=(a*374761393+b*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;}
function capsule(a,b,r,col,zs){zs=zs||1;const d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];const dd=d[0]*d[0]+d[1]*d[1]+d[2]*d[2];
  const rz=r*zs;
  for(let x=Math.floor(Math.min(a[0],b[0])-r);x<=Math.ceil(Math.max(a[0],b[0])+r);x++)
  for(let y=Math.floor(Math.min(a[1],b[1])-r);y<=Math.ceil(Math.max(a[1],b[1])+r);y++)
  for(let z=Math.floor(Math.min(a[2],b[2])-rz);z<=Math.ceil(Math.max(a[2],b[2])+rz);z++){
    let t=((x-a[0])*d[0]+(y-a[1])*d[1]+(z-a[2])*d[2])/dd;t=Math.max(0,Math.min(1,t));
    const qx=x-(a[0]+d[0]*t),qy=y-(a[1]+d[1]*t),qz=(z-(a[2]+d[2]*t))/zs;
    if(qx*qx+qy*qy+qz*qz<=r*r)put(x,y,z,col(t,x,y,z));}}

// ================= IN-RUN (descends west -> east, profile faces camera) =================
function hIn(x){return x<=-8?13.5+(-8-x)*1.25:0.06875*x*x-0.15*x+7.9;}
function topIn(x){return Math.round(hIn(x));}
function botIn(x){return x<0?Math.min(topIn(x),topIn(x+1)):topIn(x);}
for(let x=-18;x<=0;x++){
  const top=topIn(x),bot=botIn(x);
  for(let z=-2;z<=2;z++){
    for(let y=bot;y<=top;y++)put(x,y,z,(y===top&&Math.abs(z)===1)?ICE:SNOW);
    put(x,bot-1,z,GRAY);
  }
  const band=Math.floor((x+18)/3)%2?BLUE:WHITE;
  for(const z of [-3,3]){for(let y=bot-1;y<=top;y++)put(x,y,z,band);put(x,top+1,z,RED);}
}
ln(-18,27,-2,-18,27,2,IRON);
[[1,9,0],[2,9,-1],[1,10,1],[2,10,0],[3,10,-1],[3,11,1],[1,9,-2],[2,8,2]].forEach(p=>put(p[0],p[1],p[2],SNOW));

// supports
const SX=[-16,-12,-8,-4];
const colTop=x=>botIn(x)-2;
for(const x of SX)for(const z of [-3,3])fill(x,-1,z,x,colTop(x),z,IRON);
for(let i=0;i<SX.length;i++){
  const x=SX[i];
  for(let L=4;L<=colTop(x);L+=5)ln(x,L,-3,x,L,3,GRAY);
  if(i<SX.length-1){const xb=SX[i+1];const hb=colTop(xb);
    for(const z of [-3,3]){let k=0;
      for(let L=-1;L+5<=hb;L+=5){ if(k%2===0)ln(x,L,z,xb,L+5,z,GRAY);else ln(x,L+5,z,xb,L,z,GRAY); if(L>-1)ln(x,L,z,xb,L,z,GRAY);k++;}}}
}
// takeoff pedestal
for(let x=-3;x<=0;x++)fill(x,-1,-3,x,botIn(x)-2,3,LIGHT_GRAY);
for(let z=-3;z<=3;z++){put(0,3,z,RED);put(0,4,z,WHITE);}

// ================= START TOWER + HUT =================
for(const x of [-22,-19])for(const z of [-3,3])fill(x,-1,z,x,25,z,IRON);
let kk=0;
for(let L=-1;L<=20;L+=5){
  if(L>-1){ln(-22,L,-3,-19,L,-3,GRAY);ln(-22,L,3,-19,L,3,GRAY);ln(-22,L,-3,-22,L,3,GRAY);ln(-19,L,-3,-19,L,3,GRAY);}
  const a=kk%2?L:L+5,b=kk%2?L+5:L;
  ln(-22,a,-3,-19,b,-3,GRAY);ln(-22,b,3,-19,a,3,GRAY);
  ln(-22,a,-3,-22,b,3,GRAY);ln(-19,b,-3,-19,a,3,GRAY);kk++;
}
ln(-19,20,-3,-16,20,-3,GRAY);ln(-19,20,3,-16,20,3,GRAY);
fill(-22,26,-3,-19,26,3,PLANKS);
for(let y=27;y<=30;y++)for(let x=-22;x<=-20;x++)for(let z=-3;z<=3;z++){
  const edge=(x===-22||x===-20||z===-3||z===3);if(!edge)continue;
  let id=WHITE;
  if(z===-3&&x===-21&&(y===28||y===29))id=GLASS;
  if(x===-20&&Math.abs(z)<=1&&y<=29)continue;
  if(x===-20&&Math.abs(z)===2&&(y===28||y===29))id=GLASS;
  if(y===30)id=RED;
  put(x,y,z,id);
}
fill(-23,31,-4,-19,31,4,RED);fill(-22,32,-4,-20,32,4,RED);fill(-21,33,-4,-21,33,4,WHITE);
put(-19,30,0,GLOWSTONE);
for(const z of [-3,3])put(-19,27,z,IRON);

// ================= LANDING HILL =================
function yL(x){const t=Math.min(1,Math.max(0,(x-1)/17));const s=t*t*(3-2*t);return Math.round(6-6*s);}
for(let x=1;x<=22;x++){
  const top=yL(x),nxt=x<22?yL(x+1):top,bot=x===1?-2:Math.min(top,nxt);
  for(let z=-5;z<=5;z++)for(let y=bot;y<=top;y++){
    let id=SNOW;
    if(y===top){
      if(Math.abs(z)===5)id=LEAVES;
      if(x===7)id=BLUE;
      if(x===12)id=RED;
      if(x===15)id=GREEN;
      if((x===4||x===10)&&Math.abs(z)===4)id=LEAVES;
    }
    put(x,y,z,id);
  }
  const ban=[RED,WHITE,BLUE][Math.floor((x-1)/3)%3];
  for(const z of [-6,6]){fill(x,-2,z,x,top,z,SNOW);put(x,top+1,z,ban);}
}
for(const x of [5,9,13,17]){const t=yL(x);put(x,t+2,-6,BLACK);put(x,t+3,-6,YELLOW);}
for(let z=-5;z<=5;z++){put(22,1,z,z%2?RED:WHITE);put(22,2,z,z%2?WHITE:RED);}

// ================= THE JUMPER (V-style, flying east) =================
for(const s of [-1,1]){
  ln(2,11,s*1,18,17,s*4,YELLOW);
  put(18,17,s*4,RED);put(19,18,s*4,RED);put(17,17,s*4,RED);
}
for(const s of [-1,1])capsule([7.8,14,s*2.2],[9.4,14.4,s*2.2],0.75,()=>BLACK);
for(const s of [-1,1])capsule([9,14.8,s*2.0],[11.8,16.7,s*1.0],0.95,(t)=>(t>0.35&&t<0.5)?WHITE:RED);
{const a=[11.8,16.7,0],b=[15.1,18.7,0];const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);const nx=-dy/L,ny=dx/L;
 capsule(a,b,1.3,(t,x,y,z)=>{const off=(x-a[0])*nx+(y-a[1])*ny;
   if(off>0.6&&t>0.2&&t<0.85){ if(z===0&&t>0.4&&t<0.7)return BLACK; return WHITE;}
   if(t<0.12)return BLUE; return RED;},1.3);}
for(const s of [-1,1]){
  capsule([14.6,18.4,s*2.1],[10.6,16.5,s*2.7],0.7,(t)=>t>0.85?BLACK:(t>0.4&&t<0.55?WHITE:RED));
  put(10,16,s*3,BLACK);
}
{const c=[16.7,19.6,0];
 for(let x=14;x<=19;x++)for(let y=17;y<=22;y++)for(let z=-2;z<=2;z++){
   const d=Math.hypot(x-c[0],y-c[1],(z-c[2])*0.9);if(d>1.75)continue;
   let id=WHITE;
   if(z===0&&y>=20)id=RED;
   if(x>=18&&y>=19&&y<=20)id=GOLD;
   put(x,y,z,id);}
 put(15,19,-2,BLACK);put(15,19,2,BLACK);
}

// ================= SPECTATORS (north foreground) =================
const COATS=[RED,BLUE,YELLOW,ORANGE,GREEN,PURPLE,CYAN,MAGENTA,WHITE,LIME];
const HATS=[RED,WHITE,BLUE,YELLOW,PINK,ORANGE,LIGHT_BLUE];
function person(x,y,z,seed,flag){
  put(x,y,z,[BLACK,BLUE,GRAY,BROWN][Math.floor(hash(seed,1)*4)]);
  put(x,y+1,z,COATS[Math.floor(hash(seed,2)*COATS.length)]);
  put(x,y+2,z,SAND);
  put(x,y+3,z,HATS[Math.floor(hash(seed,3)*HATS.length)]);
  if(flag){put(x,y+4,z,BLACK);put(x,y+5,z,BLACK);
    const f=[[RED,WHITE],[BLUE,YELLOW],[WHITE,RED],[RED,BLUE]][Math.floor(hash(seed,5)*4)];
    put(x+1,y+5,z,f[0]);put(x+2,y+5,z,f[0]);put(x+1,y+4,z,f[1]);put(x+2,y+4,z,f[1]);}
}
fill(12,0,-10,22,0,-8,SNOW);
for(let x=12;x<=22;x++)put(x,1,-7,x%2?BLUE:WHITE);
for(let x=12;x<=21;x++)for(const z of [-8,-10]){const h=hash(x,z);if(h<0.3)continue;person(x,1,z,x*31+z,h>0.86);}

// ================= GRANDSTAND (south) =================
for(let x=12;x<=22;x++){
  for(let i=0;i<3;i++){const z=8+i,h=1+i;fill(x,-1,z,x,h-1,z,GRAY);put(x,h,z,LIGHT_GRAY);
    const r=hash(x+100,z);if(r>0.35)person(x,h+1,z,x*17+z*5,r>0.9&&x<20);}
  for(let y=-1;y<=6;y++)put(x,y,11,y>=4?(Math.floor(x/2)%2?RED:WHITE):GRAY);
}

// ================= JUDGES TOWER =================
for(const x of [3,7])for(const z of [8,12])fill(x,-1,z,x,9,z,IRON);
ln(3,4,8,7,4,8,GRAY);ln(3,4,12,7,4,12,GRAY);ln(3,0,8,7,8,8,GRAY);
fill(2,10,8,8,10,12,PLANKS);
for(let y=11;y<=14;y++)for(let x=2;x<=8;x++)for(let z=8;z<=12;z++){
  if(!(x===2||x===8||z===8||z===12))continue;
  let id=WHITE; if(z===8&&x>=3&&x<=7&&y>=11&&y<=13)id=GLASS; if(y===14)id=BLUE;
  put(x,y,z,id);}
fill(1,15,7,9,15,13,GRAY);fill(2,16,8,8,16,12,LIGHT_GRAY);
for(const x of [4,6]){put(x,11,10,BLACK);put(x,12,10,SAND);}
put(5,11,10,BLUE);put(5,12,10,SAND);
put(5,16,10,IRON);put(5,17,10,IRON);put(5,18,10,RED);

// ================= FLOODLIGHTS =================
function flood(x,z){fill(x,-1,z,x,23,z,IRON);fill(x-1,24,z,x+1,24,z,IRON);put(x-1,25,z,GLOWSTONE);put(x+1,25,z,GLOWSTONE);put(x,25,z,IRON);fill(x-1,26,z,x+1,26,z,IRON);}
flood(-9,9);flood(10,10);

// ================= SCOREBOARD =================
fill(-11,0,12,-11,5,12,IRON);fill(-3,0,12,-3,5,12,IRON);
fill(-11,6,12,-3,10,12,BLACK);
[[-10,9],[-9,9],[-8,9],[-6,9],[-5,9],[-10,7],[-9,7],[-7,7],[-6,7],[-5,7],[-4,7]].forEach(p=>put(p[0],p[1],11,YELLOW));
[[-10,8],[-8,8],[-6,8],[-4,8],[-4,9]].forEach(p=>put(p[0],p[1],11,LIME));

// ================= SNOWY FIRS (framing) =================
function fir(cx,by,cz,h,R){
  fill(cx,by-2,cz,cx,by,cz,OAK_LOG);
  for(let i=0;i<h;i++){const y=by+1+i;const r=R*(1-i/h)+0.4,rn=R*(1-(i+1)/h)+0.4;
    for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++){const d=Math.hypot(dx,dz);if(d>r)continue;
      put(cx+dx,y,cz+dz,(d>rn-0.3&&hash(cx+dx+y*7,cz+dz)<0.75)?SNOW:LEAVES);}}
  put(cx,by+h+1,cz,SNOW);
}
fir(-19,0,-15,8,3);fir(-13,1,-19,6,2);fir(19,1,-16,7,3);fir(-19,0,9,7,3);fir(-15,0,13,6,2);

// ================= SNOW APRON under the in-run =================
for(let x=-22;x<=0;x++)for(let z=-7;z<=7;z++)soft(x,0,z,SNOW);

// ---- flush with budget cap ----
let n=0;
for(const [x,y,z,id] of M.values()){if(id!==AIR){if(n>=3990)continue;n++;}block(x,y,z,id);}