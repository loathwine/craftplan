// snowmobile-fable — prompt:
// a snowmobile jumping over a snowdrift...

const W=new Map();let n=0;const A=[];
let sd=12345;function r(){sd=(sd*1103515245+12345)&0x7fffffff;return sd/0x7fffffff;}
function put(x,y,z,id,force){x=Math.round(x);y=Math.round(y);z=Math.round(z);
  if(Math.abs(x)>22||Math.abs(z)>22||y<-8||y>33)return;
  const k=x+','+y+','+z;
  if(W.has(k)){if(force)W.get(k)[3]=id;return;}
  if(n>=3950)return;W.set(k,[x,y,z,id]);n++;}

// ---------- SNOWMOBILE (local coords: u length, v up, w width) ----------
const L=[];
function lb(u1,v1,w1,u2,v2,w2,id){
  const ua=Math.min(u1,u2),ub=Math.max(u1,u2),va=Math.min(v1,v2),vb=Math.max(v1,v2),wa=Math.min(w1,w2),wb=Math.max(w1,w2);
  for(let u=ua;u<=ub;u+=0.5)for(let v=va;v<=vb;v+=0.5)for(let w=wa;w<=wb;w+=0.5)L.push([u,v,w,id]);}
function seg(u1,v1,w1,u2,v2,w2,id){
  const d=Math.hypot(u2-u1,v2-v1,w2-w1),m=Math.max(1,Math.ceil(d*2));
  for(let i=0;i<=m;i++){const t=i/m,u=u1+(u2-u1)*t,v=v1+(v2-v1)*t,w=w1+(w2-w1)*t;
    lb(u-0.25,v-0.25,w-0.25,u+0.25,v+0.25,w+0.25,id);}}
const PI=Math.PI,C=Math.cos(22*PI/180),S=Math.sin(22*PI/180),CY=Math.cos(15*PI/180),SY=Math.sin(15*PI/180);
const OX=3,OY=19,OZ=0;
function T(u,v,w){const du=u-11,dv=v-4,xp=du*C-dv*S,yp=du*S+dv*C;
  return [OX+xp*CY+w*SY,OY+yp,OZ-xp*SY+w*CY];}

// track
lb(0,0,-2,11,2,2,BLACK);
for(let u=0;u<=11;u+=2)lb(u,0,-2,u,0,2,GRAY);
for(const u of [1,4,7,10]){lb(u,1,-2,u,1,-2,IRON);lb(u,1,2,u,1,2,IRON);}
lb(-1,1,-2,-1,2,2,BLACK);
// tunnel + running boards
lb(-1,3,-3,12,3,3,RED);
lb(-2,3,-3,-2,3,3,IRON);
// seat, rack, bag, taillight
lb(1,4,-1,9.5,5,1,BLACK);
lb(-1,4,-2,0.5,5,2,GRAY);
lb(-0.5,5.5,-1.5,0.5,6,1.5,BROWN);
lb(-1.5,4,-1,-1.5,4.5,1,NEON_RED);
// hood / body
for(let u=10;u<=20.5;u+=0.5){
  const top=u<=13?6:6-(u-13)*0.45,hw=u<=17?3:Math.max(1,3-(u-17)*0.65);
  for(let v=2;v<=top;v+=0.5)for(let w=-hw;w<=hw;w+=0.5){
    let id=RED;
    if(v<2.5)id=BLACK;
    else if(Math.abs(w)>hw-0.6&&v>=3.5&&v<=4.2&&u>=11&&u<=18)id=WHITE;
    else if(Math.abs(w)<0.6&&v>top-0.6)id=WHITE;
    else if(Math.abs(w)>hw-0.6&&v>=2.5&&v<=3&&u>=13&&u<=14.5)id=BLACK;
    L.push([u,v,w,id]);}}
lb(19.5,3,-1,20.5,3.5,1,GLOWSTONE);
lb(21,2,-1.5,21,2.5,1.5,IRON);
// console + windshield
lb(11,7,-2,11.5,7,2,BLACK);
for(let k=0;k<=3;k++)lb(12-k*0.5,7+k,-2,12-k*0.5,7.5+k,2,ICE);
// handlebars
seg(10,6,0,9.5,8,0,IRON);
lb(9.5,8,-3,9.5,8,3,IRON);
lb(9.5,8,-3,9.5,8,-2.5,BLACK);lb(9.5,8,2.5,9.5,8,3,BLACK);
// skis + suspension
for(const s of [-1,1]){
  lb(13,-1,s*4,22,-1,s*4,YELLOW);
  lb(22.5,-0.5,s*4,23,0,s*4,YELLOW);lb(23.5,0.5,s*4,24,1,s*4,YELLOW);
  lb(15,-1.5,s*4,20,-1.5,s*4,IRON);
  seg(17,-1,s*4,16,2,s*3,IRON);
  seg(19,-1,s*4,17.5,3,s*3,YELLOW);
  seg(15,-1,s*4,13,2,s*3,IRON);
}
// rider: legs
lb(3.5,6,-1.5,5.5,7.5,1.5,BLACK);
for(const s of [-1,1]){
  lb(4.5,6,s*1.5,8,6.5,s*2.5,BLACK);
  lb(7.5,4,s*2,8,6,s*2.5,BLACK);
  lb(7.5,4,s*2,9.5,4,s*3,GRAY);
}
// torso leaning forward
for(let k=0;k<=4.5;k+=0.5){const cu=4.5+k*0.45,v=7.5+k;
  lb(cu-1,v,-2,cu+1,v,2,(k>=2&&k<=2.5)?WHITE:BLUE);}
// arms + gloves
for(const s of [-1,1]){
  seg(6.5,11.5,s*2.5,9,9,s*3,BLUE);
  seg(9,9,s*3,9.5,8.5,s*3,BLACK);
}
// helmet
for(let du=-2;du<=2;du+=0.5)for(let dv=-2;dv<=2;dv+=0.5)for(let dw=-2;dw<=2;dw+=0.5){
  if(du*du+dv*dv+dw*dw>4.4)continue;
  let id=YELLOW;
  if(du>=1&&dv>=-0.5&&dv<=1&&Math.abs(dw)<=1.5)id=BLACK;
  else if(Math.abs(dw)<0.6&&du<1)id=RED;
  L.push([7.5+du,14.5+dv,dw,id]);}
// scarf streaming back
seg(6,12.5,0,3,13.5,-0.5,ORANGE);
seg(3,13.5,-0.5,0.5,13,-1,ORANGE);
seg(0.5,13,-1,-1.5,13.8,-1.5,ORANGE);

for(const p of L){const q=T(p[0],p[1],p[2]);put(q[0],q[1],q[2],p[3],true);}

// ---------- SNOWDRIFT ----------
function crest(z){return 1-z*z/24;}
function h1(x,z){const az=Math.abs(z)/11.5;if(az>=1)return 0;
  const fz=Math.pow(Math.cos(az*PI/2),0.7),xp=crest(z);let p;
  if(x<=xp){const t=(x+23)/(xp+23);p=t<=0?0:Math.pow(t,1.5);}
  else{const t=1-(x-xp)/3.5;p=t<=0?0:t*t;}
  const b=10.4*p*fz;return b+(b>0.6?0.5*Math.sin(x*0.8+z*0.6):0);}
function h2(x,z){return 3.6*Math.exp(-((x-16)*(x-16)+(z-3)*(z-3))/20);}
function H(x,z){if(Math.abs(x)>22)return 0;
  let h=Math.round(Math.max(h1(x,z),h2(x,z)));
  if(Math.abs(z)===3&&x<=crest(z)-1&&h>=2)h-=1;
  return h;}
for(let x=-22;x<=22;x++)for(let z=-12;z<=12;z++){
  const h=H(x,z);if(h<1)continue;
  let lo=Math.min(H(x-1,z),H(x+1,z),H(x,z-1),H(x,z+1))-1;
  lo=Math.min(lo,h-1);if(h<=2)lo=-1;lo=Math.max(lo,-1);
  for(let y=lo;y<=h;y++){
    let id=SNOW;
    if(y===h&&Math.abs(z)<=1&&x<crest(z)&&((x%2)+2)%2===0&&h>=2)id=LIGHT_GRAY;
    put(x,y,z,id,false);}
  for(let y=h+1;y<=9;y++)A.push([x,y,z]);
}
// cornice lip + icicles
for(let z=-7;z<=7;z++){const cx=Math.round(crest(z)),hc=H(cx,z);if(hc<5)continue;
  put(cx+1,hc,z,SNOW,false);
  if(((z%2)+2)%2===0)put(cx+2,hc,z,SNOW,false);
  if(((z%3)+3)%3===0){put(cx+2,hc-1,z,ICE,false);put(cx+1,hc-1,z,ICE,false);}
  if(z===-4||z===5)put(cx+2,hc-2,z,ICE,false);}

// ---------- SNOW SPRAY (rooster tail) ----------
const R=T(-1.5,1,0);
for(let i=0;i<190;i++){
  const t=Math.pow(r(),1.4);
  const x=R[0]-0.5-t*9+(r()-0.5)*1.5,
        y=R[1]+2.5*t-7.5*t*t+(r()-0.5)*(1+3*t),
        z=R[2]+(r()-0.5)*(2+7*t);
  if(y<=H(Math.round(x),Math.round(z))+0.5)continue;
  put(x,y,z,r()<0.75?SNOW:WHITE,false);}
// clumps kicked off the lip
for(let i=0;i<45;i++){
  const z=Math.round((r()-0.5)*10),cx=crest(z);
  put(cx+1+r()*5,6+r()*7,z+(r()-0.5)*2,r()<0.8?SNOW:WHITE,false);}
// snow falling off track and skis
for(let i=0;i<30;i++){
  const q=T(r()*23,-1.5,(r()-0.5)*8);
  put(q[0],q[1]-1-r()*4,q[2],SNOW,false);}
// exhaust vapor
{const a=T(-3.5,3.5,0),b=T(-5,5,1);put(a[0],a[1],a[2],STEAM,false);put(b[0],b[1],b[2],STEAM,false);}

// ---------- TRAIL MARKERS ----------
for(const p of [[-17,-7],[-9,-8],[-17,7],[-9,8],[10,-9]]){
  const b=Math.max(0,H(p[0],p[1]));
  for(let y=b+1;y<=b+5;y++)put(p[0],y,p[1],(y-b)%2?ORANGE:BLACK,false);
  put(p[0]+1,b+5,p[1],RED,false);put(p[0]+2,b+5,p[1],RED,false);put(p[0]+1,b+4,p[1],RED,false);}

// ---------- SNOW-LADEN PINES (background) ----------
function pine(px,pz,base,radii){
  for(let y=base;y<=base+2;y++)put(px,y,pz,OAK_LOG,false);
  let y0=base+3;
  for(let i=0;i<radii.length;i++){const rad=radii[i];
    for(let dx=-rad;dx<=rad;dx++)for(let dz=-rad;dz<=rad;dz++){
      const d=dx*dx+dz*dz;
      if(d<=rad*rad+1){put(px+dx,y0,pz+dz,GREEN,false);
        if(d<=(rad-1)*(rad-1)+1&&rad>1)put(px+dx,y0+1,pz+dz,GREEN,false);
        else if(r()<0.75)put(px+dx,y0+1,pz+dz,SNOW,false);}}
    put(px,y0+1,pz,OAK_LOG,true);
    y0+=2;}
  put(px,y0,pz,GREEN,false);put(px,y0+1,pz,SNOW,false);}
pine(-15,17,0,[3,3,2,2,1]);
pine(3,19,1,[3,2,2,1]);
pine(18,16,0,[3,3,2,1]);
pine(-21,-17,0,[2,2,1]);

// ---------- EMIT ----------
for(const a of A)block(a[0],a[1],a[2],AIR);
const out=[...W.values()].sort((a,b)=>a[1]-b[1]);
for(const b of out)block(b[0],b[1],b[2],b[3]);