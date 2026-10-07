// ghost-rider-sonnet55 — prompt:
// Ghost Rider on his flaming motorcycle...

const M=new Map();let N=0;const CAP=3990;let MINY=-1;
function put(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);
 if(x<-22||x>22||z<-22||z>22||y<MINY||y>33)return;
 const k=x+','+y+','+z;const o=M.get(k);
 if(id===AIR){if(o!==undefined&&o!==AIR)N--;M.set(k,AIR);return;}
 if(o===undefined||o===AIR){if(N>=CAP)return;N++;}
 M.set(k,id);}
function c3(x1,y1,z1,x2,y2,z2,id){for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)for(let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++)put(x,y,z,id);}
function sp(cx,cy,cz,r,id){const q=r*r+0.3;for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++){const a=x-cx,b=y-cy,c=z-cz;if(a*a+b*b+c*c<=q)put(x,y,z,id);}}
function ln(x1,y1,z1,x2,y2,z2,r,id){const n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1))*2)+1;for(let i=0;i<=n;i++){const t=i/n;const x=x1+(x2-x1)*t,y=y1+(y2-y1)*t,z=z1+(z2-z1)*t;if(r<=0.6)put(x,y,z,id);else sp(x,y,z,r,id);}}
function ell(cx,cy,cz,rx,ry,rz,fn){for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){const a=(x-cx)/rx,b=(y-cy)/ry,c=(z-cz)/rz;if(a*a+b*b+c*c<=1){const id=fn(x,y,z);if(id!==null)put(x,y,z,id);}}}
let sd=987654;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
function tongue(x,y,z,dx,dy,dz,len,w,curl){curl=curl||0;const l=Math.hypot(dx,dy,dz);const ux=dx/l,uy=dy/l,uz=dz/l;const n=Math.ceil(len*1.5);
 for(let pass=0;pass<3;pass++)for(let i=0;i<=n;i++){const t=i/n;const px=x+ux*len*t,py=y+uy*len*t+curl*t*t*len,pz=z+uz*len*t;const r=w*Math.pow(1-t,0.85)*(pass===0?1:pass===1?0.68:0.38);if(r<0.35)continue;sp(px,py,pz,r,pass===0?(t>0.7?ORANGE:LAVA):pass===1?ORANGE:YELLOW);}}
function chain(a,b,sag){const n=Math.ceil(Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]),Math.abs(b[2]-a[2])))+1;for(let i=0;i<=n;i++){const t=i/n;put(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t-sag*Math.sin(Math.PI*t),a[2]+(b[2]-a[2])*t,i%2?IRON:GRAY);}}

c3(-20,0,-9,20,4,5,AIR);

function wheel(cx,cy,cz){
 for(let dx=-6;dx<=6;dx++)for(let dy=-6;dy<=6;dy++){const d=Math.hypot(dx,dy);const x=cx+dx,y=cy+dy;
  const ang=Math.atan2(dy,dx);const sec=((Math.floor((ang+Math.PI)/(Math.PI/6)))%2);
  if(d>=4.3&&d<=5.5){for(let z=-1;z<=1;z++)put(x,y,cz+z,BLACK);
    if(Math.floor((ang+Math.PI)/(Math.PI/10))%2===0){put(x,y,cz-1,GRAY);}}
  else if(d>=3.2&&d<4.3){put(x,y,cz-1,sec?LAVA:ORANGE);put(x,y,cz,ORANGE);put(x,y,cz+1,sec?ORANGE:LAVA);}
 }
 for(let k=0;k<8;k++){const a=k*Math.PI/4+0.2;ln(cx,cy,cz-1,cx+Math.cos(a)*3.3,cy+Math.sin(a)*3.3,cz-1,0.5,IRON);}
 sp(cx,cy,cz,1.4,GOLD);c3(cx,cy,cz-2,cx,cy,cz+2,IRON);
 for(let k=0;k<9;k++){const a=k*Math.PI*2/9+rnd()*0.4;const bx=cx+Math.cos(a)*5.3,by=cy+Math.sin(a)*5.3;
  tongue(bx,by,cz+(rnd()-0.5)*2,Math.cos(a)*0.7-0.9,Math.sin(a)*0.7+0.1,(rnd()-0.5)*0.5,4+rnd()*3,1.5,0.15);}
}
wheel(-10,5,0);wheel(12,5,0);
[[-10,10.5],[-15,5],[-6,1],[12,10.5],[17,5],[8,1]].forEach(p=>put(p[0],p[1],-2,FIRE));
for(let a=2.1;a<=3.05;a+=0.04){for(const r of [6.2,6.8]){const x=-10+Math.cos(a)*r,y=5+Math.sin(a)*r;c3(Math.round(x),Math.round(y),-1,Math.round(x),Math.round(y),1,BLACK);put(x,y,-2,IRON);}}
for(let a=0.95;a<=1.9;a+=0.04){const x=12+Math.cos(a)*6.4,y=5+Math.sin(a)*6.4;c3(Math.round(x),Math.round(y),-1,Math.round(x),Math.round(y),1,IRON);}
put(-17,9,0,NEON_RED);put(-17,8,0,NEON_RED);

for(const zs of [-3,3]){ln(3,5,zs*0.7,4,3,zs,1,COPPER);ln(4,3,zs,-4,2.5,zs,1,IRON);ln(-4,2.5,zs,-14,4,zs,1,IRON);sp(-14.5,4.2,zs,1.5,GRAY);
 for(const x of [-2,-6,-10])put(x,4.6,zs,GOLD);}
tongue(-15,4,-3,-1,0.2,0,7,1.5,0.1);tongue(-15,4,3,-1,0.2,0,7,1.5,0.1);
put(-16,4,-3,FIRE);put(-16,4,3,FIRE);

ln(5,12.5,-1.6,-9,10.5,-1.6,0.5,IRON);ln(5,12.5,1.6,-9,10.5,1.6,0.5,IRON);
ln(6,13,-1.6,3,4,-1.6,0.5,IRON);ln(6,13,1.6,3,4,1.6,0.5,IRON);
ln(-9,10.5,-1.6,-10,5,-1.6,0.5,IRON);ln(-9,10.5,1.6,-10,5,1.6,0.5,IRON);
ln(-4,4,-1.6,-10,5,-1.6,0.5,IRON);ln(-4,4,1.6,-10,5,1.6,0.5,IRON);
c3(-4,3,-2,3,6,2,IRON);c3(-4,3,-2,-3,6,-2,BLACK);c3(-1,4,-3,1,5,-3,LAVA);c3(-3,5,-3,2,5,-3,COPPER);
for(const sgn of [-1,1]){const x0=sgn*0.6,x1=sgn*3.4;ln(x0,6,0,x1,10.5,0,1.6,GRAY);
 for(const t of [0.3,0.5,0.7]){sp(x0+(x1-x0)*t,6+4.5*t,0,2.1,IRON);}
 sp(x1,10.8,0,1.8,BLACK);}
sp(0,3,0,1.6,GRAY);
for(const zs of [-1.7,1.7]){ln(12,5,zs,6.5,14.5,zs,0.5,IRON);}
ln(6.5,14.5,-2.4,6.5,14.5,2.4,1,IRON);sp(6,13.5,0,1.5,IRON);
sp(9.5,13,0,1.7,GLOWSTONE);ln(8,14,0,9.5,13,0,1,IRON);
ln(6,15,0,5.5,16.5,0,1,IRON);ln(5.5,16.5,-3.8,5.5,16.5,3.8,0.5,IRON);
for(const zs of [-1,1]){ln(5.5,16.5,zs*3.8,3.8,18.5,zs*4,0.5,IRON);}
chain([5.5,16.5,-3.9],[8,12,-3.4],1.5);chain([5.5,16.5,3.9],[8,12,3.4],1.5);

ell(-6.5,11.6,0,4.2,1.2,2.6,()=>BROWN);
c3(-11,12,-2,-10,13,2,BROWN);
ell(0.5,13,0,4.8,2.4,2.6,(x,y,z)=>{
 const f=12.2+1.3*Math.sin((x+3)*1.3)+((x*7)%3)*0.4;
 if(z<=-2){return y<=f-1?YELLOW:y<=f?ORANGE:y<=f+1.2?RED:BLACK;}
 return BLACK;});
c3(-4,15,-1,4,15,1,BLACK);
put(2,16,0,GOLD);put(-1,16,0,GOLD);

const jacket=BLACK;
for(const zs of [1,-1]){
 ln(-6,13,zs*2,-0.5,13.2,zs*3.6,1.5,jacket);
 ln(-0.5,13.2,zs*3.6,4.2,7,zs*3.6,1.4,jacket);
 c3(3,5,zs*3.6-1,7,6,zs*3.6+1,BLACK);c3(8,5,zs*3.6,8,5,zs*3.6,IRON);c3(3,7,zs*3.6-1,4,7,zs*3.6+1,BLACK);
 ln(-0.3,13.5,zs*4.8,0.8,15,zs*6,0.5,IRON);sp(0.8,15,zs*6,0.7,IRON);
 c3(5,4,zs*5,5,4,zs*2,IRON);put(4,6,zs*5,GOLD);
 for(const q of [[1,11.5],[3.5,9.5]])put(q[0],q[1],zs*5.1,IRON);
}
ln(-6.5,13.3,0,-5,15.5,0,2.7,jacket);ln(-5,15.5,0,-2.2,18.5,0,3,jacket);ln(-2.2,18.5,0,-0.6,20.5,0,2.9,jacket);
for(const zs of [1,-1])sp(-0.5,20.3,zs*3,2.2,jacket);
ln(-6,14,-2.7,-3.2,17.5,-3,0.5,GRAY);
c3(-6,13,-3,-5,13,-3,GOLD);put(-6,14,-3,GOLD);
for(let i=0;i<7;i++){put(-6+i*0.9,14.2+i*0.9,-3.2,IRON);}
chain([-2.5,21.5,-3.5],[-7,14,-3.7],0.8);chain([-1,21,-3.6],[-5,13.5,-3.8],-0.8);
for(const zs of [1,-1]){
 for(const s of [[-1.5,2.5,2],[0.3,2.2,2.6],[1.3,1.2,2.8],[-2.5,1.2,2.4]]){const bx=-0.5,by=20.3,bz=zs*3.3;ln(bx+s[0]*0.4,by+s[1]*0.5,bz+zs*s[2]*0.2,bx+s[0],by+s[1]+1.5,bz+zs*s[2],0.5,IRON);put(bx+s[0],by+s[1]+2,bz+zs*s[2],GOLD);}
}
for(const zs of [1,-1]){
 ln(-0.5,20.3,zs*3.2,1.8,18,zs*4.7,1.4,jacket);ln(1.8,18,zs*4.7,3.8,18.5,zs*4,1.3,jacket);
 sp(3.8,18.5,zs*4,1.5,BLACK);ln(4.5,19.2,zs*4.6,6,20,zs*5.2,0.5,IRON);ln(4.8,18.8,zs*4.8,6.2,19,zs*5.5,0.5,IRON);
 put(2,19.2,zs*5.3,IRON);put(1,19,zs*5.5,IRON);
}
sp(0.8,22.2,0,1.5,WHITE);
for(let i=0;i<6;i++){const a=i*Math.PI/3;ln(0.8+Math.cos(a)*2,21,Math.sin(a)*2.2,0.8+Math.cos(a)*3,23.5,Math.sin(a)*3.2,0.5,IRON);}
chain([-1,21.8,-2.4],[3,21.8,-2.4],0.9);

const HX=2,HY=26;
ell(HX,HY,0,3.3,3.5,3.4,(x,y,z)=>(y>=HY+2||z>=2)?MARBLE:WHITE);
c3(HX-2,HY-4,-3,HX+2,HY-3,0,WHITE);
for(const o of [-1,1])c3(HX+o,HY-4,-3,HX+o,HY-3,-3,BLACK);
c3(HX-2,HY,-4,HX-1,HY+2,-2,BLACK);c3(HX+1,HY,-4,HX+2,HY+2,-2,BLACK);
put(HX-1,HY+1,-3,NEON_RED);put(HX+1,HY+1,-3,NEON_RED);put(HX-1,HY+1,-4,NEON_RED);put(HX+1,HY+1,-4,NEON_RED);
c3(HX,HY-2,-4,HX,HY-1,-3,BLACK);
c3(HX-3,HY-1,-3,HX-3,HY-1,-2,BLACK);c3(HX+3,HY-1,-3,HX+3,HY-1,-2,BLACK);
const T=[[0,3,0,-1,0.35,0,12,2.6],[0,2,-2,-1,0.15,-0.45,10,2.1],[0,2,2,-1,0.15,0.45,10,2.1],[1,3,-1,-0.5,1,-0.2,6,2],[-1,3,1,-0.7,1,0.3,7,2],[-2,1,-2.5,-1,-0.1,-0.6,9,1.8],[-2,1,2.5,-1,-0.1,0.6,9,1.8],[1,3.4,0,0,1,0,5,1.8],[2,2,-2,0.4,1,-0.3,5,1.5],[-1,3.2,-1.5,-1,0.6,-0.2,10,1.7],[-3,0,0,-1,-0.2,0,10,1.9]];
T.forEach(t=>tongue(HX+t[0],HY+t[1],t[2],t[3],t[4],t[5],t[6],t[7],0.1));
[[-7,31,0],[-4,32,-1],[1,33,0],[-9,29,-2],[-6,27,2],[3,32,-2]].forEach(p=>put(p[0],p[1],p[2],FIRE));

for(let i=0;i<6;i++)tongue(-14-rnd()*2,1+rnd()*2,(rnd()-0.5)*4,-1,0.15,(rnd()-0.5)*0.4,6+rnd()*2,1.5,0.1);
put(-18,1,0,FIRE);put(-21,1,1,FIRE);

for(let x=-22;x<=22;x++)for(let z=-3;z<=3;z++){let id=rnd()<0.2?GRAY:BLACK;
 if(z===0&&((x+24)%8)<4)id=YELLOW;if(Math.abs(z)===3&&(x%3!==0))id=LIGHT_GRAY;
 if(x<-11&&z===0)id=LAVA;else if(x<-9&&Math.abs(z)===1&&rnd()<0.4)id=ORANGE;
 put(x,-1,z,id);}
function tomb(x,z,h){c3(x,0,z,x+2,h,z,STONE);put(x+1,h+1,z,COBBLE);put(x,h,z,COBBLE);put(x+2,h,z,COBBLE);put(x+1,h-1,z,COBBLE);}
tomb(-19,-7,3);tomb(-14,-9,2);tomb(15,-8,3);tomb(19,-10,2);
function spire(cx,cz,h,r0){for(let y=0;y<=h;y++){const r=r0*Math.pow(1-y/h,0.8)+0.4;for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++){if((x-cx)**2+(z-cz)**2<=r*r){put(x,y,z,((x*7+y*3+z*5)%13===0)?LAVA:OBSIDIAN);}}}}
spire(-17,12,20,2.6);spire(-9,16,26,2.4);spire(-2,19,14,2.4);spire(6,15,22,2.6);spire(14,12,17,2.4);spire(19,17,24,2.6);spire(-20,20,14,2);spire(11,20,12,2);spire(1,10,9,2);

for(const [k,id] of M){const p=k.split(',');block(+p[0],+p[1],+p[2],id);}