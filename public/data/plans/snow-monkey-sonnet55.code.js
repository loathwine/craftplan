// snow-monkey-sonnet55 — prompt:
// a Japanese snow monkey in a hot spring...

// Japanese snow monkey in an onsen
const H=(x,y,z)=>{const s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s);};
const fur=(x,y,z)=>{const r=H(x,y,z);return r<0.3?LIGHT_GRAY:(r<0.38?BROWN:GRAY);};
const furL=(x,y,z)=>H(x,y,z)<0.65?LIGHT_GRAY:GRAY;
const rock=(x,y,z)=>{const r=H(x,y,z);return r<0.5?STONE:(r<0.8?COBBLE:GRAY);};

function ell(cx,cy,cz,rx,ry,rz,id,shell){
  if(shell===undefined) shell=true;
  const inn=(x,y,z)=>{const a=(x-cx)/rx,b=(y-cy)/ry,c=(z-cz)/rz;return a*a+b*b+c*c<=1;};
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)
  for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    if(!inn(x,y,z)) continue;
    if(shell && inn(x+1,y,z)&&inn(x-1,y,z)&&inn(x,y+1,z)&&inn(x,y-1,z)&&inn(x,y,z+1)&&inn(x,y,z-1)) continue;
    block(x,y,z,typeof id==='function'?id(x,y,z):id);
  }
}
function capsule(x1,y1,z1,x2,y2,z2,r1,r2,id){
  const d=Math.sqrt((x2-x1)**2+(y2-y1)**2+(z2-z1)**2);
  const n=Math.max(1,Math.ceil(d*1.5));
  for(let i=0;i<=n;i++){
    const t=i/n,r=r1+(r2-r1)*t;
    ell(x1+(x2-x1)*t,y1+(y2-y1)*t,z1+(z2-z1)*t,r,r,r,id,false);
  }
}
function pine(x,z,h,R){
  line(x,0,z,x,h-1,z,OAK_LOG);
  const n=Math.floor((h-3)/2);
  for(let i=0;i<=n;i++){
    const y=3+2*i, rad=R*(1-i/(n+1))+0.9;
    disk(x,y,z,rad,LEAVES);
    if(rad>1.8) disk(x,y+1,z,rad-1.1,SNOW);
  }
  block(x,h,z,SNOW);block(x,h+1,z,SNOW);
}

// ---------- clear site ----------
cylinder(0,0,0,14,14,AIR);

// ---------- ground ----------
for(let x=-13;x<=13;x++)for(let z=-13;z<=13;z++){
  const d2=x*x+z*z;
  if(d2>=72&&d2<=169) block(x,-1,z,SNOW);
  if(d2>=67&&d2<=144&&H(x,7,z)<0.75) block(x,0,z,SNOW);
  if(d2<72) block(x,-1,z,H(x,2,z)<0.5?STONE:(H(x,2,z)<0.8?COBBLE:GRAY));
}
disk(0,0,0,8,WATER);

// ---------- rim boulders ----------
for(let i=0;i<14;i++){
  const th=i*2*Math.PI/14+(H(i,1,2)-0.5)*0.3;
  const north=Math.sin(th)<-0.45;
  const h=H(i,5,9);
  const rr=9.3+h*0.8;
  const cx=Math.round(rr*Math.cos(th)),cz=Math.round(rr*Math.sin(th));
  const rx=north?1.4+h*0.5:2+h*1.2;
  const ry=north?1+h*0.4:1.6+H(i,3,3)*1.6;
  const rz=rx*0.9;
  const cy=-1+ry*0.6;
  ell(cx,cy,cz,rx,ry,rz,rock);
  ell(cx,cy+ry*0.8,cz,rx*0.75,Math.max(0.6,ry*0.35),rz*0.75,SNOW,false);
}

// ---------- adult snow monkey ----------
ell(0,3,2.5,4.3,4.6,3.6,fur);                 // torso
ell(0,5.5,2.2,4.4,2.6,3,fur);                 // shoulder hump
ell(0,3.5,-0.6,2.6,3,1.5,furL);               // pale belly
ell(0,9.3,-0.2,3.5,3.1,3.1,fur);              // head
ell(-2.9,8.3,-0.4,1.5,1.7,2.1,furL);          // cheek ruffs
ell(2.9,8.3,-0.4,1.5,1.7,2.1,furL);
ell(0,9,-2.3,2.5,2.4,1.3,RED);                // red face
ell(0,7.7,-3.2,1.6,1.2,1.1,PINK);             // muzzle
// ears
ell(-3.9,9.6,-0.3,0.9,1.5,1.3,fur);ell(3.9,9.6,-0.3,0.9,1.5,1.3,fur);
ell(-3.6,9.6,-0.9,0.6,1,0.8,PINK);ell(3.6,9.6,-0.9,0.6,1,0.8,PINK);
// facial features
block(-2,9,-3,BLACK);block(2,9,-3,BLACK);
block(-2,9,-4,BLACK);block(2,9,-4,BLACK);
cube(-2,10,-3,-1,10,-3,BROWN);cube(1,10,-3,2,10,-3,BROWN);
block(-1,8,-4,BLACK);block(1,8,-4,BLACK);
cube(-1,7,-3,1,7,-3,BROWN);block(0,7,-4,BROWN);
// brow tuft + snow cap
ell(0,11.8,-1,2,0.8,1.2,BROWN,false);
ell(0,12.4,0.4,2.4,0.9,2.4,SNOW,false);
ell(-1.5,13.2,0,1,0.5,1,SNOW,false);
// shoulder snow
ell(-3.2,7.1,1.8,1.7,0.7,1.8,SNOW,false);
ell(3.2,7.1,1.8,1.7,0.7,1.8,SNOW,false);
// right arm holding a yuzu
capsule(4,5,1,5.9,3,-0.5,1.6,1.5,fur);
capsule(5.9,3,-0.5,3.8,6.2,-4,1.4,1.2,fur);
ell(3.8,6.2,-4.2,1.2,1.1,1.2,fur,false);
ell(3.8,6.9,-5,1.1,0.6,0.7,PINK,false);
sphere(3.8,7.9,-5.3,1.4,YELLOW);
block(3,8.5,-6,ORANGE);
block(4,9,-5,GREEN);block(4,10,-5,LIME);
// left arm cradling the baby
capsule(-4,5,1,-6.2,3,0.8,1.6,1.5,fur);
capsule(-6.2,3,0.8,-5.4,1.2,-1.4,1.4,1.2,fur);
ell(-5.4,0.9,-1.8,1.1,0.9,1.1,PINK,false);
// knees and feet
ell(-2.6,1.2,-3.4,1.6,1.4,1.8,fur);ell(2.6,1.2,-3.4,1.6,1.4,1.8,fur);
ell(-2.8,-0.3,-5.5,1.3,0.7,1.5,PINK,false);ell(2.8,-0.3,-5.5,1.3,0.7,1.5,PINK,false);

// ---------- baby monkey ----------
ell(-5,0.4,-2.8,1.7,1.6,1.5,fur);
ell(-5,2.9,-3.2,1.5,1.4,1.4,fur);
ell(-5,2.8,-4.3,1.4,1,0.6,RED);
ell(-5,2.1,-4.5,0.9,0.6,0.5,PINK,false);
block(-6,3,-4,BLACK);block(-4,3,-4,BLACK);
ell(-6.8,3.2,-3.2,0.6,0.9,0.8,PINK,false);ell(-3.2,3.2,-3.2,0.6,0.9,0.8,PINK,false);
ell(-5,4.3,-3.2,1.3,0.5,1.3,SNOW,false);

// ---------- water details ----------
sphere(0,1,-6,1,YELLOW);
sphere(6,1,3,1,ORANGE);
sphere(-6,1,5,1,YELLOW);
sphere(2,1,6,1,YELLOW);
[[-7,1],[7,0],[-6,5],[6,5],[0,7],[-3,6],[3,6],[-7,-1],[7,-3],[6,-5],[-4,7],[4,7],[0,4]].forEach(p=>block(p[0],1,p[1],STEAM));

// ---------- stone lantern ----------
cube(11,0,1,13,0,3,STONE);
cube(12,1,2,12,3,2,COBBLE);
cube(11,4,1,13,4,3,STONE);
cube(11,5,1,11,6,1,GRAY);cube(13,5,1,13,6,1,GRAY);cube(11,5,3,11,6,3,GRAY);cube(13,5,3,13,6,3,GRAY);
cube(12,5,2,12,6,2,GLOWSTONE);
cube(10,7,0,14,7,4,STONE);
cube(11,8,1,13,8,3,GRAY);
block(12,9,2,STONE);
cube(10,8,0,14,8,4,SNOW);
block(12,10,2,SNOW);

// ---------- wooden bucket with yuzu ----------
hollowCylinder(9,0,-9,2,2,PLANKS);
block(9,1,-9,YELLOW);block(10,0,-9,ORANGE);
cube(6,0,-6,7,0,-6,WHITE);

// ---------- fence ----------
for(let x=-13;x<=13;x++){
  if(Math.abs(x)<3) continue;
  const h=3+(x&1);
  cube(x,0,12,x,h,12,PLANKS);
  block(x,h+1,12,SNOW);
}
cube(-13,1,13,-4,1,13,OAK_LOG);cube(4,1,13,13,1,13,OAK_LOG);
cube(-13,3,13,-4,3,13,OAK_LOG);cube(4,3,13,13,3,13,OAK_LOG);
[-12,-8,-4,4,8,12].forEach(x=>cube(x,0,13,x,5,13,OAK_LOG));

// ---------- bamboo ----------
[[-14,6,12],[-15,8,13],[-13,9,11],[-16,6,10],[-14,10,14]].forEach(b=>{
  line(b[0],0,b[1],b[0],b[2],b[1],GREEN);
  for(let y=2;y<=b[2];y+=3) block(b[0],y,b[1],LIME);
  cube(b[0]-1,b[2],b[1],b[0]+1,b[2],b[1],LEAVES);
});

// ---------- pines ----------
pine(-9,16,17,3);
pine(10,16,15,3);