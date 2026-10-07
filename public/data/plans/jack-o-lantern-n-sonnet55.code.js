// jack-o-lantern-n-sonnet55 — prompt:
// a glowing jack-o'-lantern...

function inMouth(x,y){const yc=3.8+0.04*x*x;if(Math.abs(x)>8.2)return false;if(Math.abs(y-yc)>2.2)return false;if(x>=2&&x<=3)return true;const top=((x+9)%6+6)%6<2&&y>yc;const bot=((x+6)%6+6)%6<2&&y<yc-0.5;return !(top||bot);}

const cy=9, rx=11, ry=9, rz=10;
cylinder(0,0,0,14,26,AIR);
cube(-17,0,12,17,6,16,AIR);

// ---- main pumpkin ----
function inEye(x,y,side){
  const ex = side*4.6;
  const b = side<0 ? 10 : 9.7;
  const j = y - b;
  if (j < 0 || j > 5.5) return false;
  const hw = (side<0?3.4:3.7) - j*0.6;
  return Math.abs(x-ex) <= hw;
}
function inNose(x,y){
  const j = 9.4 - y;
  if (j < 0 || j > 2.5) return false;
  return Math.abs(x+0.3) <= 1.8 - j*0.7;
}
for (let x=-12;x<=12;x++) for (let y=0;y<=19;y++) for (let z=-11;z<=11;z++){
  const rho=Math.hypot(x,z), th=Math.atan2(z,x), yy=y-cy;
  const dim = yy>0 ? 2.8*Math.exp(-Math.pow(rho/3.6,2)) : 0;
  const w = Math.max(0,1-Math.pow(yy/ry,4));
  const m = 1+0.055*Math.cos(14*th)*w;
  const q = Math.sqrt(Math.pow(x/rx,2)+Math.pow((yy+dim)/ry,2)+Math.pow(z/rz,2))/m;
  if (q>1) continue;
  if (q>0.80){
    if (z<=-1 && (inEye(x,y,-1)||inEye(x,y,1)||inNose(x,y)||inMouth(x,y))) continue;
    block(x,y,z,ORANGE);
  } else if (q>0.70 && z>=0) block(x,y,z,LAVA);
}
// interior glow
sphere(0,7,2,2,GLOWSTONE);
disk(0,3,0,3,LAVA);
block(0,4,-1,FIRE); block(-3,4,2,FIRE); block(3,4,2,FIRE); block(0,10,3,FIRE);

// stem
cylinder(0,13,0,2,5,BROWN);
cylinder(0,18,0,1,4,BROWN);
line(0,21,0,1,23,0,BROWN); line(1,23,0,3,24,0,BROWN); line(3,24,0,4,23,0,GREEN);
cube(-1,22,-1,1,22,1,BROWN);
// vines
function vine(x,y,z,dx,dz,n){
  for(let i=0;i<n;i++){
    const px=Math.round(x+dx*i), pz=Math.round(z+dz*i+Math.sin(i*0.7)*1.5);
    block(px,y,pz,GREEN);
    if(i%3==1){ sphere(px,y,pz+1,1,LEAVES); block(px,y+1,pz-1,LIME);}
  }
}
vine(2,18,-1,0.5,0,4);
vine(-11,0,-4,-1,-0.6,9);
vine(11,0,-5,1,-0.5,9);
vine(-8,0,-10,-0.8,-1,6);
vine(9,0,-9,0.8,-1,6);
sphere(-2,19,2,2,LEAVES); sphere(2,19,-2,1,LEAVES);

// ---- small pumpkins ----
function smallPumpkin(px,py,pz,r){
  cube(px-r-1,py-r,pz-r-1,px+r+1,py+r+2,pz+r+1,AIR);
  sphere(px,py,pz,r,ORANGE);
  const zf = pz-r;
  cube(px-1,py+1,zf,px-1,py+1,zf+1,GLOWSTONE);
  cube(px+1,py+1,zf,px+1,py+1,zf+1,GLOWSTONE);
  cube(px-1,py-1,zf,px+1,py-1,zf+1,GLOWSTONE);
  if(r>=4){ block(px-2,py-1,zf+1,GLOWSTONE); block(px+2,py-1,zf+1,GLOWSTONE); }
  block(px,py+r,pz,BROWN); block(px,py+r+1,pz,BROWN); block(px+1,py+r+1,pz,GREEN);
}
smallPumpkin(15,2,-6,3);
smallPumpkin(-16,3,-8,4);
smallPumpkin(7,1,-14,2);
smallPumpkin(-7,1,-14,2);
smallPumpkin(18,1,3,2);

// ---- fence ----
for(let x=-16;x<=16;x++){
  block(x,1,14,PLANKS); block(x,3,14,PLANKS);
  if((x+16)%4==0) cube(x,0,14,x,4,14,OAK_LOG);
}
block(-8,5,14,BLACK); block(-8,6,14,BLACK); block(-9,6,14,BLACK); block(-7,6,14,BLACK);

// ---- bats ----
function bat(x,y,z){
  block(x,y,z,BLACK); block(x,y+1,z,BLACK);
  block(x-1,y+1,z,BLACK); block(x-2,y+2,z,BLACK); block(x-3,y+1,z,BLACK);
  block(x+1,y+1,z,BLACK); block(x+2,y+2,z,BLACK); block(x+3,y+1,z,BLACK);
  block(x,y,z-1,NEON_RED);
}
bat(-12,27,-5); bat(10,29,2); bat(14,24,-8);

// ---- fallen leaves ----
const leafCols=[ORANGE,RED,YELLOW,BROWN];
for(let i=0;i<70;i++){
  const a=i*2.399, r=12+((i*37)%9);
  const px=Math.round(Math.cos(a)*r), pz=Math.round(Math.sin(a)*r)-3;
  if(Math.abs(px)>21||Math.abs(pz)>21) continue;
  block(px,0,pz,leafCols[i%4]);
}