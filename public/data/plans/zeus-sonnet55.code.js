// zeus-sonnet55 — prompt:
// Zeus throwing a lightning bolt...

const H=(x,y,z)=>{const s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s);};
const put=(x,y,z,id)=>block(Math.round(x),Math.round(y),Math.round(z),id);
function thick(x1,y1,z1,x2,y2,z2,h,id){
  const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1),1);
  for(let i=0;i<=n;i++){const t=i/n;
    const x=Math.round(x1+(x2-x1)*t),y=Math.round(y1+(y2-y1)*t),z=Math.round(z1+(z2-z1)*t);
    cube(x-h,y-h,z-h,x+h,y+h,z+h,id);}
}
function blob(cx,cy,cz,rx,ry,rz,pick){
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)
  for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    const d=((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2;
    if(d<=1&&H(x,y,z)>d*0.6) put(x,y,z,pick(x,y,z));
  }
}
function rockDisk(y,r,pick){
  for(let x=-r-2;x<=r+2;x++)for(let z=-r-2;z<=r+2;z++){
    const a=Math.atan2(z,x);const rr=r+1.2*Math.sin(a*3+1)+0.7*Math.sin(a*5+2);
    if(Math.hypot(x,z)<=rr) put(x,y,z,pick(x,y,z));
  }
}

// clear trees around the site
cylinder(0,0,0,14,10,AIR);
cylinder(-13,0,11,4,10,AIR);
cylinder(13,0,11,4,10,AIR);

// plinth: rocky crag topped with marble
rockDisk(-1,9,(x,y,z)=>H(x,y,z)<0.5?STONE:COBBLE);
rockDisk(0,8,(x,y,z)=>H(x,y,z)<0.4?COBBLE:(H(x,y,z)<0.8?STONE:GRAY));
rockDisk(1,7,(x,y,z)=>((x+z)&1)?MARBLE:LIGHT_GRAY);
for(let k=0;k<24;k++){const a=k/24*Math.PI*2;const rr=7+1.2*Math.sin(a*3+1)+0.7*Math.sin(a*5+2)-0.5;
  put(Math.cos(a)*rr,1,Math.sin(a)*rr,k%2?GOLD:MARBLE);}

// legs (left forward, right back)
cube(-4,2,-5,-2,2,-1,BROWN);
cube(2,2,-1,4,2,2,BROWN);
cube(-4,3,-3,-2,8,-1,PLANKS);
cube(2,3,0,4,8,2,PLANKS);
cube(-4,5,-3,-2,5,-1,GOLD);
cube(2,5,0,4,5,2,GOLD);
cube(-4,3,-4,-2,3,-4,BROWN);cube(2,3,-1,4,3,-1,BROWN);
cube(-3,6,-4,-3,7,-4,PLANKS);
cube(3,6,-1,3,7,-1,PLANKS);

// chiton skirt
cube(-5,9,-3,5,10,3,MARBLE);
cube(-4,11,-2,4,13,2,MARBLE);
for(let x=-5;x<=5;x++){put(x,9,-3,GOLD);put(x,9,3,GOLD);}
for(let z=-3;z<=3;z++){put(-5,9,z,GOLD);put(5,9,z,GOLD);}
for(let x=-4;x<=4;x+=2){cube(x,10,-4,x,13,-4,x%4===0?LIGHT_GRAY:MARBLE);}
cube(-4,13,-3,4,13,-3,MARBLE);
// belt
cube(-4,14,-2,4,14,2,GOLD);
cube(-1,14,-3,1,14,-3,GOLD);
put(0,14,-3,LIGHT_BLUE);
cube(-3,13,-3,3,13,-3,MARBLE);

// torso
cube(-4,15,-2,4,21,2,PLANKS);
cube(-3,19,-3,-1,20,-3,PLANKS);cube(1,19,-3,3,20,-3,PLANKS);
cube(-1,16,-3,-1,18,-3,PLANKS);cube(1,16,-3,1,18,-3,PLANKS);cube(0,16,-3,0,18,-3,BROWN);
cube(-3,17,-3,-3,18,-3,PLANKS);cube(3,17,-3,3,18,-3,PLANKS);
cube(-1,19,-3,1,19,-3,BROWN);
// shoulders
cube(5,19,-2,6,21,2,PLANKS);
cube(-6,19,-2,-5,21,2,MARBLE);
cube(-5,21,-3,-3,22,2,MARBLE);
// diagonal drape across chest
for(let y=21;y>=14;y--){
  const x0=Math.round(-4+(21-y)*0.9);
  for(let x=x0;x<=x0+2;x++){ if(x<=4) put(x,y,-3,(y+x)%3===0?LIGHT_GRAY:MARBLE); }
}
for(let y=14;y<=21;y++) put(-4,y,-3,MARBLE);
cube(-4,13,-3,-3,15,-3,MARBLE);
// brooch
put(-4,21,-4,GOLD);put(-4,20,-4,LIGHT_BLUE);put(-3,21,-4,GOLD);
// neck
cube(-1,22,-1,1,22,1,PLANKS);

// head
cube(-2,23,-2,2,28,2,PLANKS);
put(-1,26,-2,NEON_BLUE);put(1,26,-2,NEON_BLUE);
put(-1,26,-3,WHITE);put(1,26,-3,WHITE);
cube(-2,27,-3,-1,27,-3,LIGHT_GRAY);cube(1,27,-3,2,27,-3,LIGHT_GRAY);
put(0,25,-3,PLANKS);put(0,26,-3,PLANKS);
cube(-2,25,-3,-2,25,-3,PLANKS);cube(2,25,-3,2,25,-3,PLANKS);
// moustache + beard
cube(-2,24,-3,2,24,-3,WHITE);put(0,24,-3,PLANKS);
cube(-2,23,-3,2,23,-3,WHITE);
cube(-2,22,-4,2,22,-3,WHITE);
cube(-1,21,-4,1,21,-4,WHITE);cube(-2,21,-3,2,21,-3,WHITE);
cube(-1,20,-4,1,20,-4,LIGHT_GRAY);cube(0,19,-4,0,19,-4,LIGHT_GRAY);
cube(-2,23,-2,-2,24,-2,WHITE);cube(2,23,-2,2,24,-2,WHITE);
cube(-1,22,-5,1,22,-5,LIGHT_GRAY);
// hair
cube(-3,29,-3,3,29,3,WHITE);
cube(-2,30,-2,2,30,2,WHITE);
cube(-1,31,-1,1,31,0,LIGHT_GRAY);
cube(-3,23,-3,-3,28,3,WHITE);cube(3,23,-3,3,28,3,WHITE);
cube(-3,23,3,3,28,3,WHITE);
cube(-3,18,4,3,28,4,LIGHT_GRAY);cube(-3,16,4,3,17,4,WHITE);
cube(-2,15,4,2,15,4,WHITE);cube(-1,14,4,1,14,4,LIGHT_GRAY);
// golden laurel crown
cube(-3,28,-3,3,28,-3,GOLD);cube(-3,28,3,3,28,3,GOLD);
cube(-3,28,-3,-3,28,3,GOLD);cube(3,28,-3,3,28,3,GOLD);
put(-3,29,-4,LIME);put(3,29,-4,LIME);put(0,29,-4,GOLD);put(0,28,-4,LIGHT_BLUE);
put(-2,28,-4,GOLD);put(2,28,-4,GOLD);

// right arm (raised, throwing)
thick(6,20,0,9,24,0,1,PLANKS);
thick(9,24,0,11,27,-1,1,PLANKS);
cube(8,22,-1,10,22,1,GOLD);
cube(10,26,-2,12,26,0,GOLD);

// lightning bolt
const A=[5,33,-1],B=[12,27,-2],C=[9,26,-3],D=[16,18,-6];
thick(A[0],A[1],A[2],B[0],B[1],B[2],1,YELLOW);
thick(B[0],B[1],B[2],C[0],C[1],C[2],1,YELLOW);
thick(C[0],C[1],C[2],D[0],D[1],D[2],1,YELLOW);
line(A[0],A[1],A[2],B[0],B[1],B[2],GLOWSTONE);
line(B[0],B[1],B[2],C[0],C[1],C[2],GLOWSTONE);
line(C[0],C[1],C[2],D[0],D[1],D[2],GLOWSTONE);
put(D[0],D[1]-1,D[2]-1,YELLOW);put(D[0]+1,D[1]-2,D[2]-1,YELLOW);
cube(11,26,-3,13,28,-1,PLANKS);
put(12,27,-4,GLOWSTONE);
put(A[0],A[1],A[2],ELECTRIC);
put(8,30,-1,ELECTRIC);
put(C[0],C[1],C[2],ELECTRIC);
put(D[0],D[1],D[2],ELECTRIC);
put(13,22,-4,ELECTRIC);

// left arm (forward, open palm)
thick(-6,19,0,-9,17,-1,1,PLANKS);
thick(-9,17,-1,-13,19,-5,1,PLANKS);
cube(-10,16,-2,-8,16,0,GOLD);
cube(-14,18,-6,-12,18,-4,GOLD);
cube(-14,19,-7,-12,20,-6,PLANKS);
cube(-14,21,-7,-14,22,-7,PLANKS);cube(-13,21,-7,-13,23,-7,PLANKS);cube(-12,21,-7,-12,22,-7,PLANKS);
cube(-15,20,-6,-15,21,-6,PLANKS);

// cloak blown by the storm wind
for(let y=21;y>=7;y--){
  const k=21-y;
  const xL=Math.round(-6-k*0.7), xR=Math.round(6+k*0.2);
  for(let x=xL;x<=xR;x++){
    const z=Math.round(3+k*0.45+1.6*Math.sin(x*0.5+y*0.35));
    const edge=(x===xL||x===xR||y===7);
    put(x,y,z,edge?GOLD:BLUE);
    put(x,y,z+1,edge?GOLD:PURPLE);
  }
}
cube(-5,20,3,5,21,3,PURPLE);

// eagle
{
  const ex=-17,ey=27,ez=-3;
  cube(ex-1,ey-1,ez-1,ex+1,ey,ez+3,BROWN);
  cube(ex-1,ey+1,ez-3,ex+1,ey+2,ez-2,WHITE);
  put(ex,ey+1,ez-4,YELLOW);put(ex,ey,ez-4,YELLOW);
  put(ex-1,ey+2,ez-4,BLACK);put(ex+1,ey+2,ez-4,BLACK);
  cube(ex-1,ey,ez+4,ex+1,ey,ez+6,WHITE);
  for(let i=1;i<=6;i++){
    for(const s of [-1,1]){
      const x=ex+s*(1+i),y=ey+Math.round(i*0.6)-(i>4?1:0);
      cube(x,y,ez-1,x,y,ez+2+Math.floor(i/2),i>=5?BLACK:BROWN);
    }
  }
}

// background temple columns
function column(cx,cz,h,broken){
  cylinder(cx,-1,cz,2,2,STONE);
  cylinder(cx,1,cz,2,h,MARBLE);
  cylinder(cx,1,cz,1,h+1,MARBLE);
  for(let y=3;y<h;y+=4) cylinder(cx,y,cz,2,1,LIGHT_GRAY);
  if(!broken){cylinder(cx,h+1,cz,3,2,MARBLE);cube(cx-3,h+3,cz-3,cx+3,h+3,cz+3,GOLD);}
  else {cube(cx+1,h,cz-2,cx+2,h+2,cz,MARBLE);cube(cx-2,h,cz-1,cx-2,h+1,cz,MARBLE);}
}
column(-14,12,14,false);
column(14,12,10,true);

// storm clouds + cloud puffs
const dark=(x,y,z)=>{const r=H(x,y,z);return r<0.3?BLACK:(r<0.7?GRAY:LIGHT_GRAY);};
blob(-6,31,9,9,2.4,6,dark);
blob(9,31,8,8,2.2,5,dark);
blob(-16,30,2,5,1.8,4,dark);
put(-4,30,8,ELECTRIC);put(7,29,9,ELECTRIC);put(-15,29,0,ELECTRIC);
for(let k=0;k<6;k++){const a=k*1.05+0.4;
  blob(Math.cos(a)*10.5,0,Math.sin(a)*10.5,3,1.4,3,(x,y,z)=>H(x,y,z)<0.5?WHITE:SNOW);}