// automaton-sonnet55 — prompt:
// a steampunk automaton robot...

const M=new Map();
const put=(x,y,z,id)=>{x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;M.set(x+','+y+','+z,[x,y,z,id]);};
const del=(x,y,z)=>M.delete(Math.round(x)+','+Math.round(y)+','+Math.round(z));
const rg=(a,b)=>{const o=[];for(let i=Math.min(a,b);i<=Math.max(a,b);i++)o.push(i);return o;};
const box=(x1,y1,z1,x2,y2,z2,id)=>{for(const x of rg(x1,x2))for(const y of rg(y1,y2))for(const z of rg(z1,z2))put(x,y,z,id);};
const shellBox=(x1,y1,z1,x2,y2,z2,id)=>{const X=[Math.min(x1,x2),Math.max(x1,x2)],Y=[Math.min(y1,y2),Math.max(y1,y2)],Z=[Math.min(z1,z2),Math.max(z1,z2)];
  for(const x of rg(x1,x2))for(const y of rg(y1,y2))for(const z of rg(z1,z2))if(x==X[0]||x==X[1]||y==Y[0]||y==Y[1]||z==Z[0]||z==Z[1])put(x,y,z,id);};
const R2=r=>r*r+0.5;
const sph=(cx,cy,cz,r,id,hollow)=>{for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)for(let dz=-r;dz<=r;dz++){const d=dx*dx+dy*dy+dz*dz;if(d<=R2(r)&&(!hollow||d>R2(r-1)))put(cx+dx,cy+dy,cz+dz,id);}};
const circ=(r,hollow,f)=>{for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const d=a*a+b*b;if(d<=R2(r)&&(!hollow||d>R2(r-1)))f(a,b);}};
const cylY=(cx,y1,cz,r,h,id,hollow)=>{for(let y=y1;y<y1+h;y++)circ(r,hollow,(a,b)=>put(cx+a,y,cz+b,id));};
const cylZ=(cx,cy,z1,z2,r,id,hollow)=>{for(const z of rg(z1,z2))circ(r,hollow,(a,b)=>put(cx+a,cy+b,z,id));};
const cylX=(cy,cz,x1,x2,r,id,hollow)=>{for(const x of rg(x1,x2))circ(r,hollow,(a,b)=>put(x,cy+a,cz+b,id));};
const discXY=(cx,cy,z,r,id)=>circ(r,false,(a,b)=>put(cx+a,cy+b,z,id));
const ringXY=(cx,cy,z,r,id)=>circ(r,true,(a,b)=>put(cx+a,cy+b,z,id));
const discYZ=(x,cy,cz,r,id)=>circ(r,false,(a,b)=>put(x,cy+a,cz+b,id));
const discXZ=(cx,y,cz,r,id)=>circ(r,false,(a,b)=>put(cx+a,y,cz+b,id));
const ringXZ=(cx,y,cz,r,id)=>circ(r,true,(a,b)=>put(cx+a,y,cz+b,id));
const tline=(x1,y1,z1,x2,y2,z2,r,id)=>{const n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1))*2)||1;
  for(let i=0;i<=n;i++){const t=i/n;const x=x1+(x2-x1)*t,y=y1+(y2-y1)*t,z=z1+(z2-z1)*t;if(r==0)put(x,y,z,id);else sph(Math.round(x),Math.round(y),Math.round(z),r,id);}};
const gearXY=(cx,cy,z0,ro,ri,teeth,thick,id,spokes,hubR,hubId)=>{
  const step=2*Math.PI/spokes;
  for(let dx=-ro-2;dx<=ro+2;dx++)for(let dy=-ro-2;dy<=ro+2;dy++){
    const d=Math.hypot(dx,dy);let a=Math.atan2(dy,dx);if(a<0)a+=2*Math.PI;
    let c=null;
    if(d<=hubR)c=hubId;
    else if(d>=ri&&d<=ro+0.3)c=id;
    else if(d>ro+0.3&&d<=ro+1.4&&Math.sin(teeth*a)>0.15)c=id;
    else if(d<ri){const m=a%step;const da=Math.min(m,step-m);if(da<step/4&&d*Math.sin(da)<0.8)c=id;}
    if(c)for(let t=0;t<thick;t++)put(cx+dx,cy+dy,z0+t,c);
  }
};

// clear site (AIR is free)
cube(-12,1,-12,12,9,12,AIR);

// ---- platform: giant flat cog ----
for(let x=-11;x<=11;x++)for(let z=-11;z<=11;z++){
  const d=Math.sqrt(x*x+z*z),a=Math.atan2(z,x);
  if(d<=9.3)put(x,0,z,d>8.2?COPPER:(((x+z)&1)?COBBLE:STONE));
  else if(d<=10.6&&Math.sin(12*a)>0.05)put(x,0,z,IRON);
}

// ---- legs ----
const leg=s=>{
  const lx=4*s;
  box(lx-2,1,-6,lx+2,1,2,IRON);
  box(lx-2,2,-4,lx+2,2,2,COPPER);
  box(lx-1,2,-6,lx+1,2,-5,GOLD);
  box(lx-2,3,-2,lx+2,6,1,COPPER);
  box(lx-1,3,-3,lx+1,6,-3,IRON);
  box(lx-2,3,-3,lx+2,3,-3,GOLD);
  box(lx-2,6,-3,lx+2,6,-3,GOLD);
  put(lx-1,5,-4,GOLD);put(lx+1,5,-4,GOLD);
  cylX(8,-1,lx-3,lx+3,2,GOLD);
  discYZ(lx-4,8,-1,1,IRON);discYZ(lx+4,8,-1,1,IRON);
  box(lx-2,11,-3,lx+2,11,1,COPPER);
  tline(lx-1,3,2,lx-1,11,2,0,IRON);tline(lx+1,3,2,lx+1,11,2,0,IRON);
  put(lx,9,3,STEAM);
  discYZ(lx+3*s,4,-1,2,GOLD);put(lx+3*s,4,-1,IRON);put(lx+4*s,4,-1,IRON);
};
leg(1);leg(-1);

// ---- pelvis ----
box(-7,12,-3,7,13,2,IRON);
box(-7,13,-3,7,13,-3,GOLD);
discXY(0,12,-4,1,GOLD);put(0,12,-4,NEON_BLUE);

// ---- boiler torso ----
cylY(0,14,0,5,10,COPPER,true);
[14,19,23].forEach(y=>cylY(0,y,0,5,1,GOLD,true));
cylY(0,24,0,5,1,IRON);
cylY(0,24,0,5,1,GOLD,true);
cylY(0,25,0,1,1,GRAY);
// front plate + furnace porthole
box(-3,15,-6,3,23,-5,IRON);
ringXY(0,18,-6,3,GOLD);
discXY(0,18,-6,2,GLASS);
discXY(0,18,-5,2,LAVA);
[[-3,15],[3,15],[-3,23],[3,23]].forEach(p=>put(p[0],p[1],-6,GOLD));
discXY(-2,22,-6,1,MARBLE);discXY(2,22,-6,1,MARBLE);
put(-2,22,-6,RED);put(2,22,-6,ORANGE);
for(const s of [-1,1]){
  tline(5*s,14,-3,5*s,23,-3,0,COPPER);
  put(5*s,15,-3,GOLD);put(5*s,21,-3,GOLD);put(5*s,19,-3,GOLD);
  tline(4*s,23,-3,6*s,23,-3,0,GOLD);
}

// ---- shoulders ----
for(const s of [-1,1]){
  sph(7*s,21,0,3,s>0?IRON:COPPER,true);
  ringXZ(7*s,21,0,3,GOLD);
  put(7*s,24,0,GOLD);
}

// ---- east arm with giant wrench ----
cylY(8,13,0,1,6,COPPER);
sph(8,12,0,2,GOLD);
cylZ(8,12,-8,-2,1,IRON);
tline(10,12,-3,10,12,-7,0,GOLD);
box(7,0,-10,8,20,-9,IRON);
box(5,21,-10,10,25,-9,IRON);
for(const x of [7,8])for(const y of [23,24,25])for(const z of [-10,-9])del(x,y,z);
box(5,21,-10,10,21,-10,GOLD);
box(6,11,-11,9,13,-8,GOLD);
put(7,16,-11,IRON);put(8,16,-11,IRON);

// ---- west arm with lantern ----
cylY(-8,13,0,1,6,COPPER);
sph(-8,12,0,2,GOLD);
tline(-8,12,0,-8,19,-7,1,IRON);
box(-10,20,-9,-6,20,-5,IRON);
for(const x of [-10,-6])for(const z of [-9,-5])box(x,21,z,x,25,z,GOLD);
sph(-8,23,-7,2,GLASS);
sph(-8,23,-7,1,GLOWSTONE);
box(-10,26,-9,-6,26,-5,GOLD);
put(-8,27,-7,GOLD);put(-8,28,-7,GOLD);

// ---- head ----
shellBox(-3,26,-3,3,30,2,COPPER);
box(-3,26,-3,3,27,-3,IRON);
for(const ex of [-2,2]){
  box(ex-1,28,-4,ex+1,30,-4,GOLD);
  put(ex,29,-4,GLOWSTONE);put(ex,29,-5,GLOWSTONE);
}
put(0,29,-4,GOLD);
for(let x=-2;x<=2;x++){put(x,26,-4,(x&1)?BLACK:IRON);put(x,27,-4,(x&1)?IRON:BLACK);}
for(const s of [-1,1]){
  discYZ(4*s,28,-1,2,GOLD);put(4*s,28,-1,IRON);discYZ(5*s,28,-1,1,IRON);
}
// hat
discXZ(0,31,0,3,BLACK);
discXZ(0,32,0,2,BLACK);ringXZ(0,32,0,2,GOLD);
discXZ(0,33,0,2,BLACK);

// ---- stacks ----
cylY(7,25,0,1,6,IRON);
discXZ(7,31,0,2,GOLD);
put(7,32,0,STEAM);
cylY(-7,25,0,1,5,COPPER);
discXZ(-7,26,0,1,GOLD);discXZ(-7,28,0,1,GOLD);
sph(-7,31,0,2,GOLD);
put(-7,33,0,ELECTRIC);put(-9,31,0,ELECTRIC);put(-5,31,0,ELECTRIC);put(-7,31,-2,ELECTRIC);

// ---- back gear halo, axle ----
gearXY(0,21,9,8,6.5,14,2,GOLD,6,2.3,IRON);
cylZ(0,21,6,8,1,GOLD);

// ---- platform props ----
for(const vx of [-5,3]){box(vx,1,-8,vx,2,-8,IRON);put(vx,3,-8,STEAM);put(vx,2,-9,GOLD);put(vx,2,-7,GOLD);}
// pressure gauge on pole
tline(8,0,-5,8,5,-5,0,IRON);
ringXY(8,6,-6,3,GOLD);discXY(8,6,-6,2,MARBLE);
put(8,6,-7,RED);put(9,7,-7,RED);put(8,7,-7,RED);
// mini bot
box(-10,0,-4,-8,0,-2,IRON);
box(-10,1,-4,-8,2,-2,COPPER);
box(-10,3,-4,-8,4,-2,IRON);
put(-10,4,-5,NEON_BLUE);put(-8,4,-5,NEON_BLUE);put(-9,2,-5,GOLD);
put(-11,1,-3,IRON);put(-11,2,-3,IRON);put(-7,1,-3,IRON);
tline(-9,5,-3,-9,6,-3,0,GRAY);put(-9,7,-3,ELECTRIC);
// crates + barrel
box(6,1,3,8,2,4,PLANKS);put(7,3,3,PLANKS);put(6,3,4,OAK_LOG);
cylY(-7,1,4,1,2,OAK_LOG);

// ---- background smokestacks ----
const chim=(cx,cz,h)=>{
  cylY(cx,0,cz,2,h,BRICK,true);
  for(const y of [6,13,20])if(y<h-2)cylY(cx,y,cz,2,1,IRON,true);
  cylY(cx,h,cz,3,1,IRON,true);
  put(cx,h+1,cz,STEAM);
};
chim(-15,15,22);chim(14,16,16);

for(const v of M.values())block(v[0],v[1],v[2],v[3]);