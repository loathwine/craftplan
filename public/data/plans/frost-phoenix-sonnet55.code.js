// frost-phoenix-sonnet55 — prompt:
// a frost phoenix...

const M=new Map();
function P(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;M.set(x+','+y+','+z,[x,y,z,id]);}
const rnd=(a,b,c)=>{const n=Math.sin(a*127.1+b*311.7+c*74.7+1.3)*43758.5453;return n-Math.floor(n);};
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function ell(cx,cy,cz,rx,ry,rz,cf,inner){inner=inner||0;
 for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
  const d=((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2;
  if(d<=1&&d>=inner)P(x,y,z,typeof cf==='function'?cf(x,y,z,d):cf);}}
function dot(x,y,z,id,r){P(x,y,z,id);if(r>0){P(x+1,y,z,id);P(x-1,y,z,id);P(x,y+1,z,id);P(x,y-1,z,id);P(x,y,z+1,id);P(x,y,z-1,id);}}
function ln(a,b,cf,r){r=r||0;const n=Math.max(1,Math.ceil(Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]),Math.abs(b[2]-a[2]))));
 for(let i=0;i<=n;i++){const t=i/n;const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t,z=a[2]+(b[2]-a[2])*t;
  const id=typeof cf==='function'?cf(t,x,y,z):cf;const rr=typeof r==='function'?r(t):r;dot(Math.round(x),Math.round(y),Math.round(z),id,rr);}}
const bez=(p0,p1,p2,t)=>{const u=1-t;return [0,1,2].map(k=>u*u*p0[k]+2*u*t*p1[k]+t*t*p2[k]);};

cube(-9,0,-9,9,12,9,AIR);

const rad=[8.5,8,7.5,6.5,5.5];
for(let y=-3;y<=2;y++){
 const R=y===-3?7:rad[y+2];
 for(let x=-10;x<=10;x++)for(let z=-10;z<=10;z++){
  const r=Math.sqrt(x*x+z*z)+(rnd(x,y,z)-0.5)*1.4;
  if(r>R)continue;
  const inner=(y>-3&&y<2)?R-2.6:-1;
  if(r<inner)continue;
  const h=rnd(x+7,y,z-3);
  let id;
  if(y<=-2)id=SNOW;
  else if(y===2)id=h<0.75?SNOW:ICE;
  else id=h<0.4?ICE:(h<0.75?SNOW:LIGHT_GRAY);
  P(x,y,z,id);}
}

const bodyCol=(x,y,z)=>{const h=rnd(x,y,z);if(h<0.1)return LIGHT_BLUE;if(z>2&&h<0.35)return LIGHT_BLUE;const k=(Math.abs(x)+y)%3;return k===0?WHITE:MARBLE;};
ell(0,11,1.5,3.3,3.5,4.2,bodyCol,0.45);
ell(0,15,-1,3.7,4.5,3.7,bodyCol,0.45);
ell(0,10,5,2,1.8,3,(x,y,z)=>rnd(x,y,z)<0.5?LIGHT_BLUE:WHITE,0.3);
ell(0,20,-2.4,2.2,3,2.2,bodyCol,0.3);
ell(0,17.8,-2.6,3.6,1.5,3.2,(x,y,z)=>rnd(x,y,z)<0.3?SNOW:WHITE);
ell(0,24,-3.6,2.4,2.4,2.4,(x,y,z)=>{const h=rnd(x,y,z);if(Math.abs(x)>=2&&y<24&&h<0.6)return LIGHT_BLUE;return h<0.3?MARBLE:WHITE;});

for(let x=-1;x<=1;x++){for(let y=22;y<=24;y++)P(x,y,-6,GOLD);for(let y=22;y<=23;y++)P(x,y,-7,GOLD);}
P(0,22,-8,GOLD);P(0,23,-8,GOLD);P(0,22,-9,ORANGE);P(0,21,-9,ORANGE);P(0,24,-7,GOLD);P(0,22,-7,ORANGE);

for(const s of [-1,1]){P(2*s,24,-5,NEON_BLUE);P(2*s,25,-5,OBSIDIAN);P(1*s,25,-5,OBSIDIAN);P(2*s,25,-4,OBSIDIAN);P(3*s,24,-4,OBSIDIAN);}

const crestCol=t=>t>0.97?NEON_BLUE:(t>0.8?CYAN:(t>0.5?LIGHT_BLUE:WHITE));
function crest(p0,p1,p2,w){for(let i=0;i<=18;i++){const t=i/18;const q=bez(p0,p1,p2,t);const id=crestCol(t);P(q[0],q[1],q[2],id);if(t<0.85)P(q[0]+w,q[1],q[2],id);if(t<0.5)P(q[0],q[1]+1,q[2],id);}}
crest([0,26,-3],[0,32,-4],[0,31,5],1);
for(const s of [-1,1]){
 crest([1.5*s,25.5,-3],[4*s,30,-3],[6*s,28,4],s);
 crest([2.5*s,24.5,-2],[6*s,27,-1],[8*s,24,5],s);
}

P(0,16,-5,NEON_BLUE);P(1,16,-5,GOLD);P(-1,16,-5,GOLD);P(0,17,-5,GOLD);P(0,15,-5,GOLD);

for(const s of [-1,1]){
 ell(2.5*s,8.6,0.5,1.9,2.4,2.3,(x,y,z)=>rnd(x,y,z)<0.3?SNOW:WHITE);
 ln([2*s,8,0],[2.2*s,4,-1.5],GOLD,1);
 ln([2.2*s,3,-1.5],[2.2*s,3,-4],GOLD,0);
 ln([2.2*s,3,-1.5],[4.2*s,3,-4],GOLD,0);
 ln([2.2*s,3,-1.5],[0.6*s,3,-4],GOLD,0);
 ln([2.2*s,3,-1.5],[2.2*s,3,1],GOLD,0);
 P(2.2*s,2,-4,ORANGE);
}

function wing(s){
 const S=[3*s,17,0],E=[9.5*s,23,-1],W=[15*s,28,-2];
 const arm=t=>t<0.5?lerp(S,E,t*2):lerp(E,W,(t-0.5)*2);
 const feather=(b,T,i,thick)=>ln(b,T,t=>{if(t>=1&&i%2===0)return NEON_BLUE;if(t>0.86)return ICE;if(t>0.6)return CYAN;return i%3===0?WHITE:LIGHT_BLUE;},thick?(t=>t<0.5?1:0):0);
 for(let i=0;i<=15;i++){
  const u=i/15,b=arm(0.75-u*0.7);
  const tip=[s*(13-u*9),11-u*3-(i%2)*1.5,b[2]+2+(i%2)];
  feather(b,tip,i,false);
 }
 const tp=[[21,32],[22,29],[22,25],[21,21],[19,17],[17,14],[15,12]];
 const tips=[];
 tp.forEach((p,j)=>{const b=arm(0.82+0.03*j);const tip=[s*p[0],p[1],b[2]+2+j*0.3];tips.push(tip);feather(b,tip,j,true);});
 for(let j=0;j<tp.length-1;j++){
  const b=arm(0.9+0.02*j);const tip=lerp(lerp(tips[j],tips[j+1],0.5),b,0.22);
  feather(b,tip,j+1,false);
 }
 for(let k=0;k<=18;k++){
  const t=0.03+k*0.05,b=arm(t);
  const z=Math.round(b[2])-1;
  ln([b[0],b[1],z-1],[b[0]+s*0.6,b[1]-4.5,z-1],u=>u>0.78?LIGHT_BLUE:((k%2)?WHITE:MARBLE),0);
  ln([b[0],b[1],z],[b[0]+s*0.8,b[1]-8.5,z],u=>u>0.85?ICE:(u>0.7?LIGHT_BLUE:(k%2?SNOW:WHITE)),0);
 }
 ln(S,E,t=>t%0.2<0.1?WHITE:SNOW,1);
 ln(E,W,t=>t%0.2<0.1?SNOW:WHITE,1);
 for(let t=0.18;t<=0.95;t+=0.11){const b=arm(t);ln([b[0],b[1]+1,b[2]],[b[0]+s*0.8,b[1]+3.5,b[2]-0.5],t2=>t2>0.8?CYAN:ICE,0);}
 ln(W,[16*s,29,-5],GOLD,0);
 ell(4*s,17.5,0,2.3,2.5,2.6,(x,y,z)=>rnd(x,y,z)<0.3?SNOW:WHITE);
}
wing(-1);wing(1);

function plume(a,sc,idx){
 const Q0=[0,10,3];
 const E=lerp(Q0,[a*3,12-Math.abs(a)*0.6,20-Math.abs(a)*0.8],sc);
 const C=[a*1.1*sc,3.5,10];
 const N=26;
 for(let i=0;i<=N;i++){
  const t=i/N;const q=bez(Q0,C,E,t);
  const id=(t>=0.99&&Math.round(idx)%2===0)?NEON_BLUE:(t>0.88?ICE:(t>0.6?CYAN:(Math.round(idx)%3===0?WHITE:LIGHT_BLUE)));
  const x=Math.round(q[0]),y=Math.round(q[1]),z=Math.round(q[2]);
  if(t<0.4)dot(x,y,z,id,1);else{P(x,y,z,id);P(x+1,y,z,id);if(t<0.75)P(x,y+1,z,id);}
  if(Math.abs(t-0.8)<0.02)P(x,y+1,z,NEON_BLUE);
 }
}
for(let a=-4;a<=4;a++)plume(a,1,a+4);
for(let a=-3.5;a<=3.5;a+=1)plume(a,0.65,a+5);

function crystal(cx,cz,h,lx,lz){
 for(let k=0;k<=h;k++){
  const t=k/h;const x=Math.round(cx+lx*t),z=Math.round(cz+lz*t),y=2+k;
  const id=t>0.85?LIGHT_BLUE:ICE;
  if(t<0.6){for(let dx=0;dx<=1;dx++)for(let dz=0;dz<=1;dz++)P(x+dx,y,z+dz,id);}else P(x,y,z,id);
 }
}
const cr=[[-7,-3,5,-1,-1],[7,-3,6,1,-1],[-8,2,8,-2,0],[8,3,9,2,0],[-5,7,10,-1,2],[5,7,11,1,2],[0,8,9,0,3],[-6,-6,3,-1,-1],[6,-6,4,1,-1],[-3,-7,3,0,-1],[3,-6,3,0,-1]];
cr.forEach(c=>crystal(c[0],c[1],c[2],c[3],c[4]));

for(let i=0;i<45;i++){
 const x=Math.round((rnd(i,1,2)-0.5)*40),y=Math.round(8+rnd(i,3,4)*24),z=Math.round(-8+rnd(i,5,6)*14);
 const id=rnd(i,7,8)<0.5?ICE:(rnd(i,9,1)<0.5?SNOW:LIGHT_BLUE);
 const k=x+','+y+','+z;if(!M.has(k))P(x,y,z,id);
}

[[-6,-5],[6,-5],[-8,0],[8,0],[-4,-8],[4,-8],[-7,5],[7,5],[0,-9]].forEach(m=>P(m[0],3,m[1],STEAM));

let cnt=0;
for(const v of M.values()){if(cnt++>=3980)break;block(v[0],v[1],v[2],v[3]);}