// ice-dragon-sonnet55 — prompt:
// an ice dragon...

cube(-15,0,-17,15,9,14,AIR);
cube(-2,0,10,22,9,22,AIR);

const hash=(x,y,z)=>{const s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s);};
const kk=(x,y,z)=>((x+64)*256+(y+64))*256+(z+64);
const G=new Map();
let PR=1;
function put(x,y,z,id){
  x=Math.round(x);y=Math.round(y);z=Math.round(z);
  if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;
  G.set(kk(x,y,z),[x,y,z,id,PR]);
}
function caps(S,pts){
  if(pts.length===1)pts=[pts[0],pts[0]];
  for(let i=0;i<pts.length-1;i++){
    const a=pts[i],b=pts[i+1];
    const R=Math.max(a[3],b[3])+1;
    const x0=Math.floor(Math.min(a[0],b[0])-R),x1=Math.ceil(Math.max(a[0],b[0])+R);
    const y0=Math.floor(Math.min(a[1],b[1])-R),y1=Math.ceil(Math.max(a[1],b[1])+R);
    const z0=Math.floor(Math.min(a[2],b[2])-R),z1=Math.ceil(Math.max(a[2],b[2])+R);
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],L2=dx*dx+dy*dy+dz*dz||1;
    for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++){
      let t=((x-a[0])*dx+(y-a[1])*dy+(z-a[2])*dz)/L2;
      t=t<0?0:t>1?1:t;
      const px=a[0]+dx*t-x,py=a[1]+dy*t-y,pz=a[2]+dz*t-z;
      const r=a[3]+(b[3]-a[3])*t;
      if(px*px+py*py+pz*pz<=r*r)S.add(kk(x,y,z));
    }
  }
}
function paint(S,fn,hollow=true){
  for(const k of S){
    const z=k%256-64,y=Math.floor(k/256)%256-64,x=Math.floor(k/65536)-64;
    const e={
      px:!S.has(kk(x+1,y,z)),nx:!S.has(kk(x-1,y,z)),
      py:!S.has(kk(x,y+1,z)),ny:!S.has(kk(x,y-1,z)),
      pz:!S.has(kk(x,y,z+1)),nz:!S.has(kk(x,y,z-1))
    };
    if(!hollow||e.px||e.nx||e.py||e.ny||e.pz||e.nz)put(x,y,z,fn(x,y,z,e));
  }
}
function tri(a,b,c,id){
  const d=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2]);
  const n=Math.ceil(Math.max(d(a,b),d(b,c),d(a,c))*2.4);
  for(let i=0;i<=n;i++)for(let j=0;j<=n-i;j++){
    const u=i/n,v=j/n,w=1-u-v;
    put(a[0]*u+b[0]*v+c[0]*w,a[1]*u+b[1]*v+c[1]*w,a[2]*u+b[2]*v+c[2]*w,id);
  }
}
function spike(x,y,z,dx,dy,dz,L,id,id2){
  const n=Math.hypot(dx,dy,dz);dx/=n;dy/=n;dz/=n;
  for(let i=0;i<=L;i++){
    const px=x+dx*i,py=y+dy*i,pz=z+dz*i;
    put(px,py,pz,i>=L-1?id2:id);
    if(i===0){put(px+1,py,pz,id);put(px-1,py,pz,id);}
  }
}

// ---------- ICE MOUND ----------
PR=1;
{
  const cz=-1.5;
  const lay=(y,A,B,inner,fn)=>{
    for(let x=-15;x<=15;x++)for(let z=-19;z<=15;z++){
      const dx=x,dz=z-cz,th=Math.atan2(dz,dx);
      const nf=1+0.07*Math.sin(3*th+1)+0.05*Math.sin(7*th+2);
      const rho=Math.sqrt((dx/A)**2+(dz/B)**2)/nf;
      if(rho<=1&&rho>=inner)put(x,y,z,fn(x,y,z,rho));
    }
  };
  lay(2,9.5,11,0,(x,y,z,r)=>r>0.86?ICE:(hash(x,y,z)<0.15?WHITE:SNOW));
  lay(1,11.3,12.8,0.82,(x,y,z)=>{const h=hash(x,y,z);return h<0.45?ICE:h<0.75?SNOW:LIGHT_BLUE;});
  lay(0,13,14.6,0.8,(x,y,z)=>{const h=hash(x,y,z);return h<0.4?ICE:h<0.7?SNOW:LIGHT_BLUE;});
  lay(-1,13,14.6,0.92,(x,y,z)=>ICE);
  // crystal shards
  PR=2;
  const shards=[[-150,8,-1,1],[-122,5,1,-1],[-58,6,-1,-1],[-28,10,1,1],[12,7,1,0],[165,11,-1,0],[132,5,0,1],[78,7,0,1],[-90,4,0,0]];
  for(const [deg,h,lx,lz] of shards){
    const a=deg*Math.PI/180;
    const cx=Math.round(13*0.86*Math.cos(a)),cz2=Math.round(cz+14.6*0.86*Math.sin(a));
    for(let k=0;k<=h;k++){
      const w=k<h*0.55?2:1;
      const ox=Math.round(lx*k/h),oz=Math.round(lz*k/h);
      for(let i=0;i<w;i++)for(let j=0;j<w;j++)
        put(cx+i+ox,1+k,cz2+j+oz,k>=h-1?WHITE:(hash(cx+i,k,cz2+j)<0.2?CYAN:ICE));
    }
  }
}

// ---------- DRAGON BODY ----------
PR=5;
const B=new Set();
const tailPts=[[0,8.5,6.5,4.3],[0,6.5,10,3.4],[1,4,13,2.9],[3.5,2.4,16,2.4],[7.5,1.7,18.5,2.0],[12,1.5,19.5,1.7],[16,2.4,18,1.3],[19,4.5,15,1.0],[20,6.5,11.5,0.8]];
caps(B,[[0,8.5,6.5,4.3],[0,11,3.5,4.5],[0,14.5,0,4.6],[0,17.5,-2,4.0],[0,20,-3,3.3],[0,22.5,-4.5,2.9],[0,24.5,-7,2.7]]);
caps(B,[[0,25.5,-10.5,3.4]]);
caps(B,[[0,25.2,-12.5,2.6],[0,24.8,-17,1.7]]);
caps(B,[[0,23.2,-9.5,1.7],[0,18.8,-16,1.2]]);
caps(B,tailPts);
// hind legs
for(const s of [1,-1]){
  caps(B,[[s*5,9,6.5,3.7],[s*6.2,6.5,3.5,2.5],[s*6,5.5,6.8,1.9],[s*5.8,4.4,6,1.6],[s*5.8,4.2,2,1.4]]);
  caps(B,[[s*5.8,4.2,2,0.9],[s*3.8,3.7,-0.8,0.7]]);
  caps(B,[[s*5.8,4.2,2,0.9],[s*5.8,3.7,-1.2,0.7]]);
  caps(B,[[s*5.8,4.2,2,0.9],[s*7.8,3.7,-0.8,0.7]]);
}
// planted right foreleg
caps(B,[[4.6,16,-1.5,2.7],[6.5,11.5,-0.5,2.0],[6,7.2,-3.8,1.7],[5.8,4.4,-5.6,1.7]]);
caps(B,[[5.8,4.2,-6,0.9],[4.2,3.7,-8.5,0.7]]);
caps(B,[[5.8,4.2,-6,0.9],[5.8,3.7,-9,0.7]]);
caps(B,[[5.8,4.2,-6,0.9],[7.4,3.7,-8.5,0.7]]);
// raised left foreleg
caps(B,[[-4.6,16,-1.5,2.7],[-8,14.5,-4,2.0],[-8.5,16,-9.5,1.7],[-8.3,16.5,-12,1.7]]);
caps(B,[[-8.3,16.5,-12,0.9],[-10,16,-15,0.6]]);
caps(B,[[-8.3,16.5,-12,0.9],[-8.3,17.2,-15,0.6]]);
caps(B,[[-8.3,16.5,-12,0.9],[-6.6,16,-15,0.6]]);

function bodyColor(x,y,z,e){
  const h=hash(x,y,z);
  const head=z<-8.5&&y>=18&&Math.abs(x)<5;
  if(e.ny&&y>3)return h<0.2?SNOW:WHITE;
  if(head){
    if(e.py)return h<0.3?CYAN:(h<0.45?ICE:LIGHT_BLUE);
    return h<0.15?CYAN:LIGHT_BLUE;
  }
  if(e.nz&&y>=9&&y<=24&&Math.abs(x)<4.6)return (y%2===0)?WHITE:LIGHT_BLUE;
  if(e.py)return h<0.28?CYAN:(h<0.42?ICE:LIGHT_BLUE);
  return h<0.1?BLUE:(h<0.2?WHITE:(h<0.28?ICE:LIGHT_BLUE));
}
paint(B,bodyColor);

// ---------- WINGS ----------
function wing(S_,E_,W_,tips,s){
  PR=4;
  for(let i=0;i<tips.length-1;i++){
    const a=tips[i],b=tips[i+1];
    const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,mz=(a[2]+b[2])/2;
    const m=[mx+(W_[0]-mx)*0.2,my+(W_[1]-my)*0.2,mz+(W_[2]-mz)*0.2];
    tri(W_,a,m,ICE);tri(W_,m,b,ICE);
  }
  const Bp=tips[tips.length-1];
  tri(W_,Bp,E_,ICE);tri(E_,Bp,S_,ICE);
  PR=5;
  const arm=new Set();
  caps(arm,[[S_[0],S_[1],S_[2],1.7],[E_[0],E_[1],E_[2],1.4],[W_[0],W_[1],W_[2],1.1]]);
  paint(arm,(x,y,z)=>hash(x,y,z)<0.25?LIGHT_BLUE:WHITE);
  const fin=new Set();
  for(let i=0;i<tips.length-1;i++)caps(fin,[[W_[0],W_[1],W_[2],0.8],[tips[i][0],tips[i][1],tips[i][2],0.4]]);
  paint(fin,()=>MARBLE,false);
  spike(W_[0],W_[1],W_[2],-s*0.2,0.2,-1,4,MARBLE,MARBLE);
  const t1=tips[0];
  spike(t1[0],t1[1],t1[2],s*0.6,0.8,0,2,MARBLE,MARBLE);
}
wing([3.3,17.5,-0.5],[10,24.5,4],[16,29,0],[[21,32,2],[21,24,6.5],[18.5,16,9.5],[13,11,10.5],[3.8,9.5,7.5]],1);
wing([-3.3,17.5,-0.5],[-10,24,4],[-16,28,-1],[[-21,31,1],[-21,22.5,6],[-18,15,9],[-12.5,10.5,10.5],[-3.8,9.5,7.5]],-1);

// ---------- DETAILS ----------
PR=6;
for(const s of [1,-1]){
  const H=new Set();
  caps(H,[[s*2,28.5,-9.5,1.1],[s*4,31,-7.5,0.9],[s*5.5,32.3,-4,0.7],[s*6,31.5,-1.5,0.4]]);
  paint(H,()=>MARBLE,false);
  tri([s*3.2,26,-8.5],[s*8,28.5,-5.5],[s*7,23.5,-5.5],ICE);
  tri([s*3.2,26,-8.5],[s*7,23.5,-5.5],[s*3,23,-8],ICE);
  spike(s*2,28.5,-12,s*0.5,0.8,-0.3,3,ICE,CYAN);
  spike(s*1,28.8,-13.5,s*0.2,0.8,-0.4,2,ICE,CYAN);
  for(const z of [-13,-15.5,-17]){put(s*1,23,z,MARBLE);put(s*1,22,z,MARBLE);}
  put(s*1,21,-15.5,MARBLE);put(s*1,21,-17,MARBLE);
  put(s*1,21,-13,MARBLE);put(s*1,22,-14.5,MARBLE);
  PR=9;
  put(s*3,27,-11,NEON_BLUE);put(s*3,27,-12,NEON_BLUE);put(s*2,27,-12,NEON_BLUE);
  PR=6;
}
spike(0,29,-12.5,0,1,-0.4,4,ICE,CYAN);
spike(0,26.8,-14.5,0,1,-0.2,2,ICE,CYAN);
put(0,21,-12,NEON_BLUE);put(0,22,-13,NEON_BLUE);
// chin icicles
spike(0,18,-15.5,0,-1,-0.2,3,ICE,CYAN);
spike(1,18.4,-14,0,-1,-0.1,2,ICE,CYAN);
spike(-1,18.4,-14,0,-1,-0.1,2,ICE,CYAN);
// chest gem
{
  let zf=-6;
  for(let z=-3;z>=-9;z--){if(!B.has(kk(0,15,z))){zf=z;break;}}
  PR=8;
  put(0,15,zf,NEON_BLUE);
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])put(dx,15+dy,zf,ICE);
  put(0,17,zf+1,ICE);put(0,13,zf+1,ICE);put(2,15,zf+1,ICE);put(-2,15,zf+1,ICE);
  PR=6;
}
// claws
for(const [x,y,z] of [[4,3,-9.5],[5.8,3,-10.5],[7.8,3,-9.5],
  [-10.3,16,-16],[-8.3,17.3,-16.2],[-6.4,16,-16],
  [3.6,3,-1.8],[5.8,3,-2.3],[8,3,-1.8],[-3.6,3,-1.8],[-5.8,3,-2.3],[-8,3,-1.8]])put(x,y,z,MARBLE);
// dorsal spines
for(const [cx,cy,cz,dy,dz,L] of [[0,8.5,6.5,.5,.85,4],[0,11,3.5,.55,.83,5],[0,14.5,0,.55,.83,5],[0,17.5,-2,.6,.8,5],[0,20,-3,.6,.8,4],[0,22.5,-4.5,.7,.7,4],[0,24.5,-7,.8,.6,3],[0,25.5,-10.5,1,.25,3]]){
  let bx=cx,by=cy,bz=cz;
  for(let t=0;t<9;t+=0.5){
    const px=cx,py=cy+dy*t,pz=cz+dz*t;
    if(B.has(kk(Math.round(px),Math.round(py),Math.round(pz)))){bx=px;by=py;bz=pz;}
  }
  spike(bx,by,bz,0,dy+0.3,dz,L,ICE,CYAN);
}
// tail spines
for(let i=1;i<tailPts.length-1;i++){
  const p=tailPts[i];
  let bx=p[0],by=p[1],bz=p[2];
  for(let t=0;t<5;t+=0.5){
    const py=p[1]+t;
    if(B.has(kk(Math.round(p[0]),Math.round(py),Math.round(p[2]))))by=py;
  }
  spike(bx,by,bz,0,1,0.2,Math.max(1,3.2-i*0.35),ICE,CYAN);
}
// tail blade
tri([20,7,13],[20,13,10],[20,7,8],ICE);
tri([18,8,10.5],[22,8,10.5],[20,13,10],ICE);
// frost breath
PR=7;
for(const [x,y,z] of [[0,22,-20],[-1,21,-20],[1,23,-21],[0,20,-21],[-2,22,-22],[2,21,-22],[0,24,-22],[-1,19,-19]])put(x,y,z,STEAM);

// ---------- FLUSH ----------
const all=[...G.values()].sort((a,b)=>b[4]-a[4]).slice(0,3990);
for(const [x,y,z,id] of all)block(x,y,z,id);