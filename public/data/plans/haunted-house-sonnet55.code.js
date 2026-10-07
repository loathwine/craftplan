// haunted-house-sonnet55 — prompt:
// a haunted house on Halloween night...

const hash=(x,y,z)=>{const n=Math.sin(x*127.1+y*311.7+z*74.7+13.3)*43758.5453;return n-Math.floor(n);};
const pick=(x,y,z,a)=>a[Math.floor(hash(x,y,z)*a.length)%a.length];
const siding=(x,y,z)=>y<=1?pick(x,y,z,[COBBLE,COBBLE,STONE,GRAY]):pick(x,y,z,[GRAY,GRAY,GRAY,LIGHT_GRAY,BROWN,GRAY,LIGHT_GRAY,BROWN]);
const roofing=(x,y,z)=>pick(x,y,z,[BLACK,OBSIDIAN,BLACK,OBSIDIAN,BLACK,GRAY,OBSIDIAN,PURPLE]);
function shell(x1,z1,x2,z2,y1,y2,fn){
  for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)for(let z=z1;z<=z2;z++)
    if(x===x1||x===x2||z===z1||z===z2)block(x,y,z,fn(x,y,z));
}
function ring(cx,cz,r,y,fn,solid){
  const R=Math.ceil(r)+1;
  for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++){
    const d=Math.hypot(dx,dz);
    if(d<=r+0.5&&(solid||d>r-0.7))block(cx+dx,y,cz+dz,fn(cx+dx,y,cz+dz));
  }
}

// clear the site (trees, bumps)
cube(-22,0,-14,14,9,13,AIR);

// ---------- MAIN HOUSE ----------
shell(-8,0,8,10,-2,10,siding);
// roof ridge along X
for(let z=-1;z<=11;z++){
  const y=10+Math.min(z+1,11-z);
  for(let x=-9;x<=9;x++){block(x,y,z,roofing(x,y,z));block(x,y-1,z,roofing(x,y-1,z));}
}
for(const gx of [-8,8])for(let z=0;z<=10;z++){
  const top=10+Math.min(z+1,11-z)-2;
  for(let y=11;y<=top;y++)block(gx,y,z,siding(gx,y,z));
}

// ---------- FRONT BAY (the face) ----------
shell(-3,-4,3,0,-2,10,siding);
for(let z=-5;z<=4;z++)for(let x=-4;x<=4;x++){
  const y=11+(4-Math.abs(x));
  block(x,y,z,roofing(x,y,z));
}
for(let x=-3;x<=3;x++)for(let y=11;y<=11+(4-Math.abs(x))-2;y++)block(x,y,-4,siding(x,y,-4));
block(0,12,-4,GLOWSTONE);
// mouth/door
cube(-2,0,-4,2,4,-4,AIR);
cube(-2,5,-4,2,5,-4,BLACK);block(0,6,-4,BLACK);
for(const x of [-1,1])for(const y of [3,4])block(x,y,-4,WHITE);
for(const x of [-2,2])for(const y of [0,1])block(x,y,-4,WHITE);
cube(-1,1,0,1,3,0,GLOWSTONE);
// tongue steps
cube(-1,0,-5,1,0,-5,RED);cube(-1,-1,-6,1,-1,-6,RED);
// angry eyes
for(const s of [-1,1]){
  block(s*2,8,-4,GLOWSTONE);block(s*2,9,-4,GLOWSTONE);
  block(s*1,7,-4,NEON_RED);block(s*1,8,-4,GLOWSTONE);
}

// ---------- WEST WING (decrepit) ----------
shell(-16,2,-8,8,-2,7,siding);
for(let z=1;z<=9;z++)for(let x=-16;x<=-8;x++){
  const y=8+(4-Math.abs(x+12));
  block(x,y,z,roofing(x,y,z));
}
for(const gz of [2,8])for(let x=-15;x<=-9;x++)for(let y=8;y<=8+(4-Math.abs(x+12))-2;y++)block(x,y,gz,siding(x,y,gz));
block(-12,9,2,GLOWSTONE);
cube(-14,9,4,-13,12,6,AIR);
line(-15,9,4,-12,12,4,OAK_LOG);line(-15,9,6,-12,12,6,OAK_LOG);
// boarded door
cube(-11,0,2,-10,3,2,BROWN);line(-11,0,1,-10,3,1,PLANKS);line(-11,3,1,-10,0,1,PLANKS);

// ruined hole in the main front roof slope + beams
cube(-7,12,2,-5,15,4,AIR);
line(-7,12,2,-7,15,5,OAK_LOG);line(-5,12,2,-5,15,5,OAK_LOG);

// ---------- TOWER ----------
const TX=9,TZ=3;
for(let y=-2;y<=13;y++)ring(TX,TZ,3,y,siding);
ring(TX,TZ,3,14,(x,y,z)=>PLANKS,true);
for(let k=0;k<=8;k++){
  const r=4.6-0.5*k;
  ring(TX,TZ,r,15+k,(x,y,z)=>pick(x,y,z,[PURPLE,PURPLE,OBSIDIAN]),r<2.2);
}
line(TX,24,TZ,TX,28,TZ,BLACK);
block(TX-1,28,TZ,BLACK);block(TX+1,28,TZ,BLACK);block(TX,29,TZ,NEON_RED);
for(const [a,b] of [[3,5],[8,10]])cube(TX,a,0,TX,b,0,GLOWSTONE);
cube(11,6,1,11,8,1,GLOWSTONE);cube(11,10,1,11,11,1,GLOWSTONE);
cube(7,6,1,7,7,1,AIR);cube(7,11,1,7,12,1,AIR);

// ---------- WINDOWS & SHUTTERS ----------
cube(-7,2,0,-6,4,0,GLOWSTONE);cube(-5,2,0,-5,4,0,BLACK);cube(-8,2,-1,-8,4,-1,BLACK);
cube(-7,7,0,-6,9,0,AIR);cube(-5,7,0,-5,9,0,BLACK);
block(-7,8,-1,PLANKS);block(-6,9,-1,PLANKS);block(-7,7,-1,PLANKS);
cube(4,2,0,5,4,0,GLOWSTONE);cube(6,2,0,6,4,0,BLACK);
cube(4,7,0,5,9,0,GLOWSTONE);cube(6,7,0,6,9,0,BLACK);cube(3,7,0,3,9,0,BLACK);
cube(8,2,8,8,4,9,GLOWSTONE);cube(8,7,8,8,9,9,AIR);
cube(-14,2,2,-13,4,2,GLOWSTONE);cube(-15,2,2,-15,4,2,BLACK);cube(-12,2,2,-12,4,2,BLACK);
cube(-16,2,4,-16,4,5,AIR);cube(-16,2,7,-16,4,7,GLOWSTONE);
cube(-4,2,10,-3,4,10,GLOWSTONE);cube(2,7,10,3,9,10,AIR);

// ---------- CHIMNEYS ----------
cube(3,13,7,4,21,8,BRICK);cube(4,22,7,5,23,8,BRICK);block(5,24,8,BRICK);cube(3,22,7,3,22,8,AIR);
block(4,24,7,FIRE);
cube(-14,9,6,-13,16,7,BRICK);cube(-13,17,6,-12,18,7,BRICK);block(-12,19,7,BRICK);block(-13,19,6,FIRE);

// ---------- DEAD TREES ----------
function deadTree(x,z,h,lean,branches){
  cube(x,-1,z,x+1,2,z+1,OAK_LOG);
  const tx=y=>x+Math.round(lean*(y-2)/h);
  for(let y=3;y<=h;y++)block(tx(y),y,z,OAK_LOG);
  for(const [by,dx,dz,dy] of branches){
    const sx=tx(by),ex=sx+dx,ey=by+dy,ez=z+dz;
    line(sx,by,z,ex,ey,ez,OAK_LOG);
    line(ex,ey,ez,ex+Math.sign(dx||1)*2,ey+2,ez+(dz?Math.sign(dz):1),OAK_LOG);
    line(ex,ey,ez,ex+Math.sign(dx||1)*2,ey-1,ez-(dz?Math.sign(dz):1),OAK_LOG);
  }
}
deadTree(-14,-6,13,-2,[[6,-4,0,3],[9,3,-2,3],[11,-3,2,2],[8,-2,3,2],[12,2,0,2]]);
deadTree(13,-7,12,2,[[6,4,0,3],[9,-3,-2,3],[11,3,2,2],[7,2,3,2]]);
deadTree(-19,-1,9,1,[[5,-3,1,2],[7,3,0,3]]);
// hanging spider on the left tree
line(-18,13,-4,-18,9,-4,WHITE);
sphere(-18,8,-4,1,BLACK);block(-18,8,-5,NEON_RED);block(-17,8,-5,NEON_RED);
for(const s of [-1,1]){
  line(-18+s,8,-4,-18+3*s,9,-4,BLACK);line(-18+s,8,-4,-18+3*s,6,-4,BLACK);
  line(-18+s,8,-3,-18+3*s,7,-2,BLACK);line(-18+s,8,-5,-18+3*s,7,-6,BLACK);
}

// ---------- FENCE & GATE ----------
for(let x=-16;x<=14;x+=2){
  if(x>=-4&&x<=4)continue;
  if(hash(x,1,2)<0.18)continue;
  cube(x,-1,-10,x,3,-10,BLACK);block(x,4,-10,IRON);
}
for(const [a,b] of [[-16,-5],[5,14]])for(const y of [1,2])line(a,y,-10,b,y,-10,BLACK);
for(const s of [-1,1]){
  const px=s<0?-4:3;
  for(let y=-1;y<=5;y++)for(let dx=0;dx<2;dx++)for(let dz=0;dz<2;dz++)block(px+dx,y,-11+dz,siding(px+dx,y,dz));
  cube(px,6,-11,px+1,6,-10,GLOWSTONE);
  block(px,7,-11,FIRE);
}
// path
for(let z=-9;z<=-7;z++)for(let x=-2;x<=2;x++)if(hash(x,z,5)>0.2)block(x,-1,z,pick(x,5,z,[COBBLE,GRAY,LIGHT_GRAY]));
for(const [x,z] of [[-1,-11],[1,-12],[0,-13],[2,-14],[-1,-14]])block(x,-1,z,COBBLE);
// torches by the steps
for(const s of [-1,1]){cube(s*3,-1,-6,s*3,2,-6,BLACK);block(s*3,3,-6,FIRE);block(s*3,2,-6,GLOWSTONE);}

// ---------- PUMPKINS ----------
function pumpkin(cx,cz,r,glow){
  sphere(cx,-1+r,cz,r,ORANGE);
  block(cx,-1+2*r+1,cz,GREEN);
  if(r===1){block(cx,-1+r,cz-1,glow?GLOWSTONE:BLACK);return;}
  const y=-1+r;
  for(const dz of [r,r-1]){
    block(cx-1,y+1,cz-dz,GLOWSTONE);block(cx+1,y+1,cz-dz,GLOWSTONE);
    block(cx,y,cz-dz,GLOWSTONE);
    block(cx-1,y-1,cz-dz,GLOWSTONE);block(cx+1,y-1,cz-dz,GLOWSTONE);
  }
}
pumpkin(-6,-7,2);pumpkin(6,-7,2);pumpkin(-9,-4,2);
pumpkin(-4,-5,1,true);pumpkin(4,-5,1,true);pumpkin(8,-9,1,true);pumpkin(-12,-9,1,true);pumpkin(10,-5,1,true);

// ---------- GRAVEYARD ----------
function grave(x,z,k){
  if(k===0){cube(x-1,-1,z,x+1,1,z,STONE);block(x,2,z,STONE);block(x,1,z-1,GRAY);}
  else if(k===1){cube(x,-1,z,x,3,z,OAK_LOG);cube(x-1,2,z,x+1,2,z,OAK_LOG);}
  else {cube(x-1,-1,z,x,2,z,LIGHT_GRAY);block(x-1,3,z,LIGHT_GRAY);}
  cube(x-1,-1,z+1,x+1,-1,z+3,BROWN);
}
for(const [x,z,k] of [[-19,-9,0],[-16,-10,1],[-12,-7,2],[-18,-3,2],[-15,-1,0],[-11,2,1]])grave(x,z,k);
for(const [x,z] of [[-17,-5],[-13,-2],[-9,4]]){
  line(x,-1,z,x,2,z,WHITE);
  line(x,2,z,x-1,3,z,WHITE);line(x,2,z,x+1,3,z,WHITE);line(x,2,z,x,3,z-1,WHITE);
}
// fallen leaves
for(let i=0;i<25;i++){
  const x=Math.round(-20+hash(i,1,1)*34),z=Math.round(-12+hash(i,2,2)*12);
  if(Math.abs(x)<3&&z<-6)continue;
  block(x,-1,z,pick(i,3,3,[ORANGE,BROWN,BROWN,RED]));
}

// ---------- GHOSTS ----------
function ghost(cx,cy,cz,r){
  sphere(cx,cy,cz,r,WHITE);
  cylinder(cx,cy-r-1,cz,r,r+1,WHITE);
  for(const dx of [-r,0,r])block(cx+dx,cy-r-1,cz-r,AIR);
  block(cx-1,cy,cz-r,BLACK);block(cx+1,cy,cz-r,BLACK);
  block(cx-1,cy+1,cz-r,BLACK);block(cx+1,cy+1,cz-r,BLACK);
  block(cx,cy-1,cz-r,BLACK);
  line(cx-r,cy-1,cz-1,cx-r-3,cy+1,cz-2,WHITE);
  line(cx+r,cy-1,cz-1,cx+r+3,cy+2,cz-2,WHITE);
}
ghost(-11,9,-12,2);ghost(10,13,-14,2);ghost(-3,22,-6,1);

// ---------- BATS ----------
function bat(x,y,z){
  block(x,y,z,BLACK);block(x,y+1,z,BLACK);
  block(x-1,y+1,z,BLACK);block(x-2,y,z,BLACK);block(x+1,y+1,z,BLACK);block(x+2,y,z,BLACK);
}
for(const [x,y,z] of [[-18,20,-5],[-14,25,4],[-2,29,0],[3,26,3],[15,29,8],[18,21,-8],[-20,17,12],[6,32,12],[13,18,-6],[-6,19,-10],[-4,31,6],[1,22,-9]])bat(x,y,z);
// crows on the ridge
for(const x of [-6,1,7]){block(x,17,5,BLACK);block(x+1,17,5,BLACK);block(x-1,18,5,BLACK);}

// ---------- MOON & WITCH ----------
const MX=-8,MY=25,MZ=18;
hollowSphere(MX,MY,MZ,4,GLOWSTONE);
for(const [dx,dy] of [[-2,1],[1,2],[1,-1],[-1,-2],[2,0]]){
  const z=MZ-Math.round(Math.sqrt(16-dx*dx-dy*dy));
  block(MX+dx,MY+dy,z,LIGHT_GRAY);block(MX+dx,MY+dy,z+1,LIGHT_GRAY);
}
line(-13,23,12,-3,25,12,BROWN);
block(-14,22,12,BLACK);block(-14,23,12,BLACK);block(-14,24,12,BLACK);block(-15,23,12,BLACK);block(-15,22,12,BLACK);
cube(-9,25,12,-8,27,12,BLACK);block(-7,24,12,BLACK);block(-7,23,12,BLACK);
block(-8,28,12,GREEN);cube(-10,29,12,-6,29,12,BLACK);cube(-9,30,12,-7,30,12,BLACK);block(-8,31,12,BLACK);block(-7,32,12,BLACK);
line(-10,27,12,-12,25,12,BLACK);