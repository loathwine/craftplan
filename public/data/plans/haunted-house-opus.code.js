// haunted-house-opus — prompt:
// a haunted house on Halloween night...

const R=(a,b,c)=>{const h=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return h-Math.floor(h);};
const vdisk=(cx,cy,z,r,id)=>{for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)if(dx*dx+dy*dy<=r*r+r*0.8)block(cx+dx,cy+dy,z,id);};

// clear trees and bumps across the site (AIR is free)
cube(-18,1,-21,18,16,12,AIR);
cube(-1,0,-14,1,0,-13,AIR);

// ---------- HOUSE ----------
const X0=-10,X1=10,Z0=-6,Z1=7,TX=10,TZ=-6;
const inTower=(x,z)=>Math.hypot(x-TX,z-TZ)<3.7;
const sid=(x,y,z)=>{const r=R(x,y,z);return r<0.12?BROWN:r<0.22?LIGHT_GRAY:GRAY;};
const ring=(y,f)=>{for(let x=X0;x<=X1;x++){block(x,y,Z0,f(x,y,Z0));block(x,y,Z1,f(x,y,Z1));}for(let z=Z0+1;z<Z1;z++){block(X0,y,z,f(X0,y,z));block(X1,y,z,f(X1,y,z));}};
for(let y=-1;y<=1;y++)ring(y,(x,y,z)=>R(x,y,z)<0.3?STONE:COBBLE);
for(let y=2;y<=13;y++)ring(y,(x,y,z)=>(y==8||y==13)?BLACK:sid(x,y,z));
for(const[x,z]of[[X0,Z0],[X1,Z0],[X0,Z1],[X1,Z1]])cube(x,2,z,x,13,z,BLACK);

// gables
for(let k=0;k<=9;k++){const y=14+k;for(let x=-9+k;x<=9-k;x++){if(!inTower(x,Z0))block(x,y,Z0,sid(x,y,Z0));block(x,y,Z1,sid(x,y,Z1));}}
// steep roof, obsidian shingles with dark patches
for(let k=0;k<=10;k++){const y=14+k;for(let z=Z0-1;z<=Z1+1;z++){const m=R(k,y,z)<0.15?BLACK:OBSIDIAN;for(const x of[-11+k,-10+k,10-k,11-k])if(!inTower(x,z))block(x,y,z,m);}}
cube(0,25,Z0-1,0,25,Z1+1,OBSIDIAN);
// bargeboard fringe under the front eave
for(let k=0;k<=9;k+=2){block(-10+k,13+k,Z0-1,BLACK);if(!inTower(10-k,Z0-1))block(10-k,13+k,Z0-1,BLACK);}
// lightning rod on ridge
line(0,26,-4,0,28,-4,IRON);block(0,29,-4,ELECTRIC);
// crumbling chimney
cube(-6,16,3,-5,23,4,BRICK);block(-5,23,4,AIR);block(-6,24,3,BRICK);

// windows
const winZ=(x1,x2,y1,y2,z,d,fill)=>{cube(x1-1,y2+1,z,x2+1,y2+1,z,BLACK);cube(x1,y1,z,x2,y2,z,fill);cube(x1-1,y1-1,z+d,x2+1,y1-1,z+d,BLACK);cube(x1-1,y1,z+d,x1-1,y2,z+d,BROWN);cube(x2+1,y1,z+d,x2+1,y2,z+d,BROWN);};
const winX=(z1,z2,y1,y2,x,d,fill)=>{cube(x,y2+1,z1-1,x,y2+1,z2+1,BLACK);cube(x,y1,z1,x,y2,z2,fill);cube(x+d,y1-1,z1-1,x+d,y1-1,z2+1,BLACK);cube(x+d,y1,z1-1,x+d,y2,z1-1,BROWN);cube(x+d,y1,z2+1,x+d,y2,z2+1,BROWN);};
// front ground-left: lit, cross mullions
winZ(-8,-6,3,5,Z0,-1,GLOWSTONE);cube(-7,3,Z0,-7,5,Z0,BLACK);cube(-8,4,Z0,-6,4,Z0,BLACK);
// front ground-right: boarded up
winZ(3,5,3,5,Z0,-1,BLACK);for(const[a,b]of[[3,3],[4,4],[5,5],[3,5],[5,3]])block(a,b,Z0-1,BROWN);
// front upper-left: lit with a figure silhouette, one shutter hanging loose
winZ(-8,-6,10,12,Z0,-1,GLOWSTONE);block(-7,11,Z0,BLACK);cube(-8,10,Z0,-6,10,Z0,BLACK);
cube(-9,10,Z0-1,-9,12,Z0-1,AIR);block(-9,12,Z0-1,BROWN);block(-10,11,Z0-1,BROWN);block(-11,10,Z0-1,BROWN);
// front upper-center: dark, cobwebbed
winZ(-1,1,10,12,Z0,-1,BLACK);block(-1,12,Z0,WHITE);block(0,12,Z0,WHITE);block(-1,11,Z0,WHITE);
// front upper-right: dark with red eyes peering out
winZ(3,5,10,12,Z0,-1,BLACK);block(3,11,Z0,NEON_RED);block(5,11,Z0,NEON_RED);
// round attic window
vdisk(0,18,Z0,2,BLACK);for(const[a,b]of[[-1,1],[1,1],[-1,-1],[1,-1]])block(a,18+b,Z0,GLOWSTONE);
// side windows
winX(-3,-1,3,5,X0,-1,BLACK);
winX(3,5,3,5,X0,-1,GLOWSTONE);cube(X0,3,4,X0,5,4,BLACK);cube(X0,4,3,X0,4,5,BLACK);
winX(-3,-1,10,12,X0,-1,BLACK);
winX(1,3,3,5,X1,1,BLACK);
winX(1,3,10,12,X1,1,GLOWSTONE);cube(X1,10,2,X1,12,2,BLACK);cube(X1,11,1,X1,11,3,BLACK);

// front door, left ajar with a red eye in the crack
cube(-2,2,Z0,2,7,Z0,BLACK);cube(-1,2,Z0,0,6,Z0,BROWN);block(-1,6,Z0,BLACK);
cube(1,2,Z0,1,5,Z0,AIR);block(1,6,Z0,BROWN);block(1,5,Z0+3,NEON_RED);block(0,4,Z0-1,GOLD);
cube(-1,1,-5,3,1,-3,PLANKS);

// ---------- PORCH ----------
cube(-6,1,-10,6,1,-7,PLANKS);
for(const x of[-6,-2,2,6])cube(x,2,-10,x,6,-10,OAK_LOG);
cube(-7,7,-11,6,7,-7,OBSIDIAN);
for(const x of[-6,-2,2,6])for(const d of[-1,1])if(Math.abs(x+d)<=6)block(x+d,6,-10,BLACK);
for(let x=-7;x<=6;x+=2)block(x,6,-11,BLACK);
line(-5,3,-10,-3,3,-10,BLACK);line(3,3,-10,5,3,-10,BLACK);
for(const x of[-5,-3,3,5])block(x,2,-10,BLACK);
line(-6,3,-9,-6,3,-7,BLACK);line(6,3,-9,6,3,-7,BLACK);
block(-4,6,-8,IRON);block(-4,5,-8,GLOWSTONE);
// wall sconces by the door
block(-3,4,-7,IRON);block(-3,5,-7,FIRE);block(3,4,-7,IRON);block(3,5,-7,FIRE);
// dangling spider
line(4,6,-9,4,5,-9,WHITE);block(4,4,-9,BLACK);block(3,4,-9,BLACK);block(5,4,-9,BLACK);block(4,3,-9,BLACK);
// steps
cube(-2,0,-11,2,0,-11,COBBLE);cube(-2,-1,-12,2,-1,-12,COBBLE);

// ---------- TOWER (witch-hat turret) ----------
const tring=(y,r,f)=>{const n=Math.ceil(r)+1;for(let dx=-n;dx<=n;dx++)for(let dz=-n;dz<=n;dz++){const d=Math.hypot(dx,dz);if(d>r-0.55&&d<=r+0.62)block(TX+dx,y,TZ+dz,f(TX+dx,y,TZ+dz));}};
for(let y=-1;y<=20;y++)tring(y,3,(x,y,z)=>y<=1?COBBLE:(y==8||y==14||y==20)?BLACK:sid(x,y,z));
tring(21,4,()=>BLACK);
for(let k=0;k<9;k++)disk(TX,22+k,TZ,3.8-k*0.45,R(k,3,7)<0.25?BLACK:OBSIDIAN);
block(TX,31,TZ,IRON);block(TX,32,TZ,ELECTRIC);block(TX,33,TZ,ELECTRIC);
cube(TX,3,TZ-3,TX,5,TZ-3,BLACK);
cube(TX,10,TZ-3,TX,12,TZ-3,GLOWSTONE);
cube(TX,16,TZ-3,TX,18,TZ-3,BLACK);block(TX+3,17,TZ,BLACK);block(TX+3,16,TZ,BLACK);

// ---------- YARD ----------
// cracked path
for(let z=-21;z<=-13;z++)for(let x=-1;x<=1;x++){const r=R(x,z,5);block(x,z<=-15?0:-1,z,r<0.15?GRASS:r<0.5?STONE:COBBLE);}
// wrought iron fence with open gate, two bent posts
for(let x=-18;x<=18;x+=2){if(Math.abs(x)<=3)continue;if(x==-12||x==14){block(x,-1,-21,IRON);block(x+1,0,-20,IRON);block(x+2,1,-19,IRON);continue;}cube(x,-1,-21,x,2,-21,IRON);block(x,3,-21,IRON);}
for(const[a,b]of[[-17,-4],[4,17]])for(let x=a;x<=b;x++)if(x!=-12&&x!=-11&&x!=14&&x!=15)block(x,1,-21,IRON);
for(const x of[-3,3]){cube(x,-1,-21,x,3,-21,COBBLE);block(x,4,-21,STONE);block(x,5,-21,FIRE);}
hollowCube(-2,0,-20,-2,2,-18,IRON);hollowCube(2,0,-20,2,2,-18,IRON);

// tombstones: headstone faces north at z, grave mound north of it
const tomb=(x,z,t,m)=>{cube(x-1,0,z-3,x+1,0,z-1,DIRT);
  if(t==0){cube(x-1,-1,z,x+1,2,z,m);block(x,3,z,m);block(x,1,z,BLACK);}
  else if(t==1){line(x,-1,z,x,4,z,m);line(x-1,3,z,x+1,3,z,m);}
  else if(t==2){cube(x-1,-1,z,x+1,1,z,m);cube(x,2,z,x+2,2,z,m);block(x+1,3,z,m);}
  else{cube(x-1,-1,z,x+1,0,z+1,COBBLE);cube(x,1,z,x,5,z,m);block(x,6,z,GOLD);}};
tomb(-16,-17,0,STONE);tomb(-12,-17,1,LIGHT_GRAY);tomb(-7,-17,2,COBBLE);tomb(-15,-12,3,MARBLE);
tomb(10,-17,1,STONE);tomb(14,-17,0,LIGHT_GRAY);tomb(18,-17,2,COBBLE);tomb(13,-12,0,GRAY);tomb(17,-12,1,COBBLE);
// open grave with a zombie hand clawing out
cube(-9,-1,-12,-9,2,-12,GRAY);block(-8,3,-12,GRAY);
cube(-10,-2,-15,-8,0,-13,AIR);cube(-7,0,-15,-6,1,-14,DIRT);block(-6,2,-14,DIRT);
line(-9,-2,-14,-9,-1,-14,BROWN);block(-9,0,-14,GREEN);block(-9,1,-14,GREEN);block(-10,2,-14,GREEN);block(-8,2,-14,GREEN);block(-9,3,-14,GREEN);
line(-6,2,-15,-5,4,-16,OAK_LOG);block(-6,1,-15,IRON);

// jack-o-lanterns
const jack=(x,y,z)=>{cube(x-1,y,z-1,x+1,y+1,z+1,ORANGE);block(x,y+2,z,GREEN);block(x-1,y+1,z-1,LAVA);block(x+1,y+1,z-1,LAVA);block(x,y,z-1,LAVA);};
jack(4,0,-12);jack(-4,1,-12);jack(5,0,-19);jack(-13,1,-8);

// witch's cauldron over a fire
for(const[a,b]of[[6,-17],[8,-17],[6,-15],[8,-15]])block(a,0,b,BLACK);
block(7,0,-16,FIRE);block(7,0,-17,FIRE);
cube(6,1,-17,8,3,-15,BLACK);block(7,3,-16,LIME);block(7,4,-16,LIME);block(6,4,-17,GREEN);

// gnarled dead tree with a hanging lantern
for(const[a,b]of[[-17,-9],[-14,-8],[-16,-10],[-15,-7]])block(a,0,b,OAK_LOG);
cube(-16,0,-9,-15,6,-8,OAK_LOG);line(-16,7,-9,-16,12,-9,OAK_LOG);
line(-15,6,-8,-11,9,-9,OAK_LOG);line(-11,9,-9,-9,12,-10,OAK_LOG);line(-11,9,-9,-10,10,-6,BROWN);
line(-16,8,-9,-20,11,-8,OAK_LOG);line(-20,11,-8,-21,14,-8,BROWN);line(-19,10,-8,-21,10,-11,BROWN);
line(-16,12,-9,-14,15,-11,BROWN);line(-16,12,-9,-18,15,-10,BROWN);line(-15,7,-9,-14,9,-13,BROWN);
line(-11,8,-9,-11,7,-9,IRON);block(-11,6,-9,FIRE);
block(-9,13,-10,BLACK);block(-8,13,-10,BLACK);block(-21,15,-8,BLACK);

// ghosts
const ghost=(x,y,z,eye)=>{cube(x-2,y+1,z,x+2,y+6,z+1,WHITE);cube(x-1,y+7,z,x+1,y+7,z+1,WHITE);
  for(const d of[-2,0,2])block(x+d,y,z,WHITE);block(x-1,y-1,z+1,WHITE);block(x+1,y-1,z+1,WHITE);
  block(x-3,y+4,z,WHITE);block(x-4,y+5,z,WHITE);block(x+3,y+4,z,WHITE);block(x+4,y+5,z,WHITE);
  block(x-1,y+5,z,eye);block(x+1,y+5,z,eye);block(x,y+3,z,BLACK);block(x,y+2,z,BLACK);};
ghost(-12,6,-19,NEON_BLUE);ghost(17,12,-8,NEON_BLUE);

// full moon behind the house, with bats across it
vdisk(-12,27,15,5,GLOWSTONE);
for(const[a,b]of[[-14,29],[-10,26],[-11,25],[-13,24],[-9,29]])block(a,b,15,LIGHT_GRAY);
const bat=(x,y,z)=>{block(x,y,z,BLACK);for(const d of[-1,1]){block(x+d,y+1,z,BLACK);block(x+2*d,y,z,BLACK);block(x+3*d,y+1,z,BLACK);}};
bat(-13,29,13);bat(-9,25,13);bat(-16,24,13);bat(5,27,-6);bat(16,24,-10);bat(2,31,-3);