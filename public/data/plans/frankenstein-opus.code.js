// frankenstein-opus — prompt:
// Frankenstein's monster coming to life in the lab...

const H=(x,y,z)=>{let h=(x*73856093)^(y*19349663)^(z*83492791);h=(h^(h>>>13))*1274126177;return (h^(h>>>16))>>>0;};
const wallBlock=(x,y,z)=>{const r=H(x,y,z)%10;return r<5?COBBLE:(r<8?STONE:GRAY);};
function cable(a,b,sag,id){const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])*1.5);for(let i=0;i<=n;i++){const t=i/n;block(Math.round(a[0]+(b[0]-a[0])*t),Math.round(a[1]+(b[1]-a[1])*t-sag*Math.sin(Math.PI*t)),Math.round(a[2]+(b[2]-a[2])*t),id);}}

// ---------- site clearing ----------
cube(-14,1,-7,14,16,16,AIR);
cube(-17,1,-17,17,9,-8,AIR);
block(-6,0,-8,AIR);block(-1,0,-10,AIR);block(3,0,-10,AIR);block(1,0,-13,AIR);
block(1,0,-7,AIR);block(1,-1,-7,GRASS);

// ---------- floor + foundation ----------
for(let x=-12;x<=12;x++)for(let z=-6;z<=12;z++){
  const r=H(x,0,z)%8;
  block(x,0,z,((x+z)&1)?(r<6?STONE:COBBLE):(r<6?GRAY:COBBLE));
}
cube(-12,-2,-6,12,-1,-6,STONE);
cube(-12,-2,-5,-12,-1,12,STONE);
cube(12,-2,-5,12,-1,12,STONE);
cube(-4,0,-7,4,0,-7,COBBLE);

// ---------- back wall with arched barred windows ----------
for(let x=-12;x<=12;x++)for(let y=1;y<=14;y++){
  let open=false,bar=false;
  for(const wx of [-8,8]){
    if(Math.abs(x-wx)<=1&&y>=7&&y<=11){open=true;if(x===wx)bar=true;}
    if(x===wx&&y===12)open=true;
  }
  if(bar)block(x,y,12,IRON);
  else if(!open)block(x,y,12,wallBlock(x,y,12));
}
for(let x=-12;x<=12;x+=2)block(x,15,12,wallBlock(x,15,12));
line(-9,6,11,-7,6,11,MARBLE);line(7,6,11,9,6,11,MARBLE);

// ---------- side walls (cutaway, rising toward back) ----------
const sideH=z=>5+Math.round((z+6)*7/17)+(H(0,0,z)%2);
for(const sx of [-12,12])for(let z=-6;z<=11;z++){
  const h=sideH(z);
  for(let y=1;y<=h;y++){
    const win=z>=5&&z<=7&&((y>=5&&y<=7)||(y===8&&z===6));
    if(win){if(z===6&&y<=7)block(sx,y,z,IRON);}
    else block(sx,y,z,wallBlock(sx,y,z));
  }
}

// ---------- front corner pillars with braziers ----------
for(const px of [-13,12]){
  cube(px,-1,-7,px+1,8,-6,STONE);
  cube(px,9,-7,px+1,9,-6,IRON);
  block(px,10,-7,FIRE);block(px+1,10,-6,FIRE);
}
// wall sconces
block(-11,6,3,IRON);block(-11,7,3,FIRE);
block(11,6,-3,IRON);block(11,7,-3,FIRE);

// ---------- lightning tower (back-left, outside) ----------
for(let y=-1;y<=22;y++)for(let x=-16;x<=-13;x++)for(let z=10;z<=13;z++){
  if(x===-16||x===-13||z===10||z===13)block(x,y,z,wallBlock(x,y,z));
}
cube(-16,23,10,-13,23,13,STONE);
for(let x=-17;x<=-12;x++)for(let z=9;z<=14;z++){
  if(x===-17||x===-12||z===9||z===14){block(x,23,z,COBBLE);if((x+z)&1)block(x,24,z,COBBLE);}
}
block(-14,15,10,GLOWSTONE);block(-14,16,10,GLOWSTONE);block(-15,7,10,GLOWSTONE);
line(-14,24,11,-14,31,11,IRON);
line(-15,29,11,-13,29,11,IRON);
block(-14,32,11,ELECTRIC);
cable([-12,22,10],[-3,27,9],2,BLACK);

// ---------- platform, upright slab, copper ring ----------
cube(-5,1,2,5,1,10,OBSIDIAN);
cube(-4,2,3,4,2,9,IRON);
cube(-3,3,8,3,21,8,BROWN);
line(-4,3,8,-4,22,8,IRON);line(4,3,8,4,22,8,IRON);line(-4,22,8,4,22,8,IRON);
line(-7,1,9,-7,20,9,IRON);line(7,1,9,7,20,9,IRON);
for(let a=0;a<360;a+=4){
  const r=a*Math.PI/180,x=Math.round(7*Math.cos(r)),y=Math.round(21+7*Math.sin(r));
  if(y>=15)block(x,y,9,COPPER);
}
block(-5,26,9,GOLD);block(5,26,9,GOLD);block(0,28,9,GOLD);
block(0,29,9,ELECTRIC);

// ---------- THE MONSTER ----------
// boots
cube(-3,3,3,-1,4,6,BLACK);cube(1,3,3,3,4,6,BLACK);
// legs
cube(-3,5,4,-1,10,6,GRAY);cube(1,5,4,3,10,6,GRAY);
// leg strap
line(-4,7,3,4,7,3,BROWN);block(0,7,3,IRON);
// jacket torso
cube(-4,11,4,4,17,7,BLACK);
cube(-1,14,4,1,17,4,LIGHT_GRAY);block(0,13,4,LIGHT_GRAY);
line(-4,11,4,4,11,4,BROWN);
// broken chest strap
line(-4,13,3,-2,13,3,BROWN);block(-2,12,3,BROWN);
line(2,13,3,4,13,3,BROWN);block(2,12,3,BROWN);block(2,11,3,BROWN);
// right arm reaching forward (torn free)
cube(-6,15,1,-5,16,7,BLACK);
cube(-6,15,-1,-5,16,0,LIME);
cube(-7,14,-3,-5,16,-2,LIME);
block(-7,16,-4,LIME);block(-6,16,-4,LIME);block(-5,16,-4,LIME);block(-7,14,-4,GREEN);
block(-4,15,-2,LIME);
line(-6,17,-1,-5,17,-1,GREEN);
// left arm still at side, fist clenched
cube(5,10,5,6,17,6,BLACK);
cube(5,7,4,6,9,6,LIME);
line(5,9,4,6,9,4,GREEN);
block(5,12,7,IRON);block(6,12,7,IRON);
// neck + bolts
cube(-1,18,4,1,18,6,LIME);
line(-3,18,5,-2,18,5,IRON);line(2,18,5,3,18,5,IRON);
block(-4,18,5,ELECTRIC);block(4,18,5,ELECTRIC);
// head
cube(-3,19,4,3,25,7,LIME);
cube(-3,26,3,3,26,7,BLACK);
line(-3,25,3,3,25,3,BLACK);
block(-3,24,3,BLACK);block(-1,24,3,BLACK);block(2,24,3,BLACK);
cube(-3,25,7,3,25,7,BLACK);
line(-3,23,3,3,23,3,GREEN);
block(-2,22,4,WHITE);block(-1,22,4,BLACK);block(1,22,4,BLACK);block(2,22,4,WHITE);
line(0,21,3,0,22,3,GREEN);
line(-3,19,3,3,19,3,LIME);
line(-2,20,4,2,20,4,BLACK);
line(4,20,6,4,24,6,BLACK);block(4,21,5,BLACK);block(4,23,5,BLACK);
line(-4,21,5,-4,22,5,GREEN);line(4,21,4,4,22,4,GREEN);
block(-2,24,4,BLACK);block(0,24,4,GREEN);block(1,24,4,BLACK);

// ---------- Tesla coils ----------
for(const cx of [-9,9]){
  const cz=6;
  cube(cx-1,1,cz-1,cx+1,2,cz+1,IRON);
  for(let y=3;y<=10;y++)cylinder(cx,y,cz,1,1,(y%2)?COPPER:BROWN);
  disk(cx,11,cz,2,IRON);
  sphere(cx,12,cz,1.5,IRON);
  block(cx,14,cz,ELECTRIC);
}
cable([-8,9,6],[-4,13,8],1,BLACK);
cable([8,9,6],[4,13,8],1,BLACK);
line(-7,1,6,-6,1,6,BLACK);line(6,1,6,7,1,6,BLACK);
line(-10,1,0,-6,1,3,BLACK);

// ---------- Dr. Frankenstein: "IT'S ALIVE!" ----------
block(6,1,0,BLACK);block(8,1,0,BLACK);block(6,1,1,BLACK);block(8,1,1,BLACK);
cube(6,2,0,6,3,1,GRAY);cube(8,2,0,8,3,1,GRAY);
cube(5,4,0,9,8,1,WHITE);
block(7,4,0,GRAY);block(7,5,0,LIGHT_GRAY);
line(7,6,0,7,7,0,BLACK);block(7,8,0,LIGHT_GRAY);
cube(4,8,0,4,12,1,WHITE);cube(10,8,0,10,12,1,WHITE);
cube(4,13,0,4,14,1,SAND);cube(10,13,0,10,14,1,SAND);
cube(6,9,0,8,11,2,SAND);
block(6,10,0,BLACK);block(8,10,0,BLACK);block(7,9,0,BLACK);
block(6,11,0,COPPER);block(7,11,0,BROWN);block(8,11,0,COPPER);
cube(5,12,0,9,12,2,LIGHT_GRAY);
block(6,13,1,LIGHT_GRAY);block(8,13,2,LIGHT_GRAY);block(7,13,0,LIGHT_GRAY);
cube(5,10,1,5,11,2,LIGHT_GRAY);cube(9,10,1,9,11,2,LIGHT_GRAY);
cube(6,10,2,8,11,2,LIGHT_GRAY);

// ---------- control panel + lever ----------
cube(-11,1,-4,-11,6,0,IRON);
block(-11,5,-3,NEON_RED);block(-11,5,-1,LIME);
block(-11,3,-3,GOLD);block(-11,3,-1,GOLD);
block(-11,6,-2,GLOWSTONE);block(-11,4,-4,WHITE);block(-11,2,-4,BLACK);
block(-10,3,-2,BLACK);
line(-10,4,-2,-10,6,-2,IRON);
block(-10,7,-2,RED);

// ---------- Igor, hunched, pulling the lever ----------
cube(-7,1,-1,-6,2,-1,GRAY);cube(-7,1,1,-6,2,1,GRAY);
block(-8,1,-1,BLACK);block(-8,1,1,BLACK);
cube(-8,3,-1,-6,5,1,BROWN);
cube(-6,6,-1,-5,7,1,BROWN);
cube(-10,5,-1,-9,6,0,SAND);
cube(-10,7,-1,-9,7,0,BLACK);block(-8,6,0,BLACK);
block(-10,6,-1,BLACK);
line(-9,5,-2,-9,6,-2,SAND);block(-9,7,-2,SAND);
line(-8,4,1,-9,3,1,SAND);

// ---------- right bench: chemistry ----------
cube(6,3,10,11,3,11,PLANKS);
for(const [lx,lz] of [[6,10],[11,10],[6,11],[11,11]])cube(lx,1,lz,lx,2,lz,OAK_LOG);
block(7,4,10,LIME);block(7,5,10,GLASS);
block(9,4,10,MAGENTA);block(9,5,10,GLASS);block(9,6,10,GLASS);
block(10,4,11,CYAN);block(10,5,11,GLASS);
block(8,4,11,GLASS);
block(11,4,10,RED);block(11,5,10,BROWN);block(11,4,11,BLUE);
block(6,4,11,WHITE);block(6,5,11,GLOWSTONE);

// ---------- left bench: brain in a jar ----------
cube(-11,3,9,-8,3,11,PLANKS);
for(const [lx,lz] of [[-11,9],[-8,9],[-11,11],[-8,11]])cube(lx,1,lz,lx,2,lz,OAK_LOG);
for(let y=4;y<=7;y++)for(let x=-11;x<=-9;x++)for(let z=9;z<=11;z++){
  if(x===-10&&z===10)block(x,y,z,(y===5||y===6)?PINK:LIME);
  else block(x,y,z,GLASS);
}
cube(-11,8,9,-9,8,11,IRON);block(-10,9,10,COPPER);
block(-8,4,10,GREEN);block(-8,5,10,GLASS);

// ---------- foreground clutter ----------
cube(-9,1,-5,-8,2,-4,PLANKS);
line(-9,2,-5,-8,2,-5,BROWN);line(-9,1,-5,-9,2,-5,BROWN);
cylinder(10,1,-5,1,3,OAK_LOG);
block(10,3,-5,LIME);
line(1,1,-4,3,1,-3,WHITE);block(1,1,-3,WHITE);block(3,1,-4,WHITE);
block(-2,1,-4,WHITE);block(-2,2,-4,WHITE);block(-2,2,-5,BLACK);