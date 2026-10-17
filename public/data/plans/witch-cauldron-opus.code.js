// witch-cauldron-opus — prompt:
// a witch brewing a glowing potion in her cauldron...

const hs=(x,y,z)=>{let h=Math.imul(x|0,73856093)^Math.imul(y|0,19349663)^Math.imul(z|0,83492791);h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;};
const hairC=(x,y,z)=>{const r=hs(x,y,z);return r<0.45?GRAY:(r<0.85?LIGHT_GRAY:WHITE);};

// ---------- clear the clearing (trees/leaves) ----------
cube(-20,1,-12,16,14,17,AIR);
cylinder(0,0,1,11,1,AIR);

// ---------- ritual floor ----------
for(let x=-11;x<=11;x++)for(let z=-10;z<=12;z++){
  const d=Math.hypot(x,z-1); if(d>10.5) continue;
  const r=hs(x,-1,z); let id;
  if(d>=8.4&&d<=9.4) id=OBSIDIAN;
  else if(d>9.4) id=r<0.5?GRASS:(r<0.8?COBBLE:STONE);
  else id=r<0.45?COBBLE:(r<0.78?STONE:GRAY);
  block(x,-1,z,id);
}
// pentagram + candles
const pts=[];
for(let k=0;k<5;k++){const a=k*2*Math.PI/5;pts.push([Math.round(9*Math.sin(a)),Math.round(1-9*Math.cos(a))]);}
for(let k=0;k<5;k++){const p=pts[k],q=pts[(k+2)%5];line(p[0],-1,p[1],q[0],-1,q[1],MAGENTA);}
pts.forEach(([x,z],k)=>{const h=2+(k%2);for(let y=0;y<h;y++)block(x,y,z,WHITE);block(x,h,z,FIRE);});

// ---------- cauldron ----------
const CX=-3,CZ=-2;
for(const [dx,dz] of [[-2,-2],[2,-2],[-2,2],[2,2]]){block(CX+dx,0,CZ+dz,BLACK);block(CX+dx,1,CZ+dz,BLACK);}
for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){const d=Math.hypot(dx,dz);
  if(d>3.6&&d<=4.6&&hs(dx,0,dz)<0.75) block(CX+dx,0,CZ+dz,hs(dz,1,dx)<0.5?COBBLE:STONE);}
line(CX-2,0,CZ,CX+2,0,CZ,OAK_LOG); line(CX,0,CZ-2,CX,0,CZ+2,OAK_LOG);
[[-1,-1],[1,1],[1,-1],[-1,1]].forEach(([dx,dz])=>block(CX+dx,0,CZ+dz,LAVA));
const shells=[[3,2.4,3.6],[4,3.0,4.1],[5,3.1,4.2],[6,2.9,4.0]];
for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){
  const d=Math.hypot(dx,dz),x=CX+dx,z=CZ+dz;
  if(d<=2.9) block(x,2,z,OBSIDIAN);
  for(const [y,ri,ro] of shells){ if(d>ri&&d<=ro){ block(x,y,z,(y>=4&&y<=5&&dz<0&&hs(x,y,z)<0.12)?GOLD:OBSIDIAN); } }
  if(d<=2.9){ const r=hs(x,7,z); block(x,7,z, d<1.6?NEON_BLUE:(r<0.35?NEON_BLUE:(r<0.7?CYAN:LIGHT_BLUE))); }
  else if(d<=4.4) block(x,7,z,IRON);
}
// overflow drips down the front
block(CX-1,7,CZ-4,CYAN);block(CX-1,7,CZ-3,CYAN);block(CX-1,6,CZ-4,LIGHT_BLUE);block(CX-1,5,CZ-4,LIGHT_BLUE);block(CX-1,4,CZ-4,CYAN);
block(CX+2,7,CZ-3,CYAN);block(CX+2,6,CZ-3,LIGHT_BLUE);
// bubbles
block(CX+1,8,CZ,NEON_BLUE);block(CX-1,8,CZ+1,LIGHT_BLUE);block(CX,8,CZ-1,LIGHT_BLUE);block(CX+1,9,CZ,LIGHT_BLUE);block(CX-2,8,CZ-1,CYAN);
// magic swirl rising from the brew
for(let s=0;s<2;s++)for(let i=0;i<=32;i++){
  const y=Math.round(9+i*0.5),a=i*0.45+s*Math.PI,r=1.2+i*0.085;
  const x=Math.round(CX+r*Math.cos(a)),z=Math.round(CZ+r*Math.sin(a));
  block(x,y,z, i%7===0?NEON_BLUE:(s===0?LIGHT_BLUE:MAGENTA));
}
// fire under the cauldron
[[0,0],[-1,0],[1,-1],[0,1],[-1,-2],[1,-2]].forEach(([dx,dz])=>block(CX+dx,1,CZ+dz,FIRE));

// ---------- the witch ----------
const WX=5,WZ=3;
for(let y=0;y<=8;y++){const rx=3.8-y*0.2,rz=rx*0.85;
  for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
    const e=Math.hypot(dx/rx,dz/rz); if(e>1) continue;
    const x=WX+dx,z=WZ+dz,r=hs(x,y,z); let id=PURPLE;
    if(y===0){ if(r<0.18) continue; id=BLACK; }
    else if(y===1&&e>0.7&&((dx+dz)&1)) id=BLACK;
    else if(y===8) id=BROWN;
    else if(r<0.05) id=MAGENTA;
    block(x,y,z,id);
  }}
block(WX,8,WZ-2,GOLD);
// pointy curled boots
block(WX-1,0,WZ-4,BLACK);block(WX+1,0,WZ-4,BLACK);block(WX-1,1,WZ-5,BLACK);block(WX+1,1,WZ-5,BLACK);
// torso
cube(WX-2,9,WZ-1,WX+2,11,WZ+1,PURPLE);
cube(WX-3,11,WZ-1,WX+3,11,WZ+1,PURPLE);
block(WX-1,10,WZ-2,GOLD);block(WX+1,10,WZ-2,GOLD);block(WX,9,WZ-2,NEON_BLUE);
// head
cube(WX-3,12,WZ-2,WX+3,18,WZ+2,GREEN);
for(let y=12;y<=18;y++)for(let z=WZ-2;z<=WZ+2;z++){block(WX-3,y,z,hairC(WX-3,y,z));block(WX+3,y,z,hairC(WX+3,y,z));}
for(let y=12;y<=18;y++)for(let x=WX-3;x<=WX+3;x++)block(x,y,WZ+2,hairC(x,y,WZ+2));
for(let x=WX-3;x<=WX+3;x++)for(let z=WZ-1;z<=WZ+2;z++)block(x,18,z,hairC(x,18,z));
for(let x=WX-2;x<=WX+2;x++)if(hs(x,18,1)<0.5)block(x,18,WZ-2,hairC(x,18,WZ-2));
// long hair down the back and frizz at the sides
for(let x=WX-3;x<=WX+3;x++){const b=7+Math.floor(hs(x,7,9)*3);for(let y=b;y<=18;y++)block(x,y,WZ+3,hairC(x,y,WZ+3));}
for(const x of [WX-4,WX+4])for(let z=WZ-1;z<=WZ+3;z++){const b=10+Math.floor(hs(x,3,z)*3);for(let y=b;y<=18;y++)block(x,y,z,hairC(x,y,z));}
// face (front plane z0)
const z0=WZ-2;
block(WX-2,17,z0,BLACK);block(WX-1,17,z0,BLACK);block(WX+1,17,z0,BLACK);block(WX+2,17,z0,BLACK);
block(WX-2,16,z0,BLACK);block(WX-1,16,z0,YELLOW);block(WX+1,16,z0,BLACK);block(WX+2,16,z0,YELLOW);
block(WX,15,z0-1,GREEN);block(WX,14,z0-1,GREEN);block(WX,14,z0-2,GREEN);block(WX,13,z0-2,GREEN);
block(WX-2,15,z0-1,BROWN);
block(WX-2,13,z0,BLACK);block(WX-1,13,z0,WHITE);block(WX,13,z0,BLACK);block(WX+1,13,z0,BLACK);block(WX+2,14,z0,BLACK);
block(WX,12,z0-1,GREEN);block(WX+1,12,z0-1,GREEN);block(WX,11,z0-1,GREEN);

// stirring arm + paddle
[[0,13,1],[0,12,1],[-1,11,0],[-1,10,0],[-2,9,-1],[-2,8,-1]].forEach(([x,y,z])=>block(x,y,z,OAK_LOG));
line(2,11,3,0,11,1,PURPLE);line(2,10,3,0,10,1,PURPLE);line(2,11,2,1,11,1,PURPLE);
block(0,10,1,BLACK);block(0,11,1,BLACK);
block(-1,11,0,GREEN);block(-1,11,1,GREEN);block(0,11,0,GREEN);
// raised arm holding a flask
line(8,11,3,10,13,2,PURPLE);line(8,10,3,10,12,2,PURPLE);line(9,11,3,11,13,2,PURPLE);
block(10,13,1,BLACK);block(11,13,2,BLACK);
block(11,14,1,GREEN);block(11,14,2,GREEN);
cube(10,15,0,12,16,2,MAGENTA);block(10,16,0,PINK);
block(11,17,1,GLASS);block(11,18,1,BROWN);

// ---------- bats around the plume ----------
for(const [x,y,z] of [[-9,21,-3],[12,26,-1],[-1,29,6],[-12,16,2]]){
  block(x,y,z,BLACK);block(x-1,y,z,BLACK);block(x+1,y,z,BLACK);block(x-2,y+1,z,BLACK);block(x+2,y+1,z,BLACK);
}

// ---------- witch hat ----------
for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const d=Math.hypot(dx,dz);
  if(d<=4.8) block(WX+dx,19,WZ+dz,BLACK);
  else if(d<=5.9) block(WX+dx,hs(dx,19,dz)<0.45?18:19,WZ+dz,BLACK);}
let tipX=WX,tipZ=WZ;
for(let y=20;y<=31;y++){const t=(y-20)/11,r=3.4*(1-t)+0.35,ox=WX+3.2*t*t*t,oz=WZ+1.8*t*t;
  for(let dx=-5;dx<=8;dx++)for(let dz=-5;dz<=6;dz++){
    if(Math.hypot(WX+dx-ox,WZ+dz-oz)<=r) block(WX+dx,y,WZ+dz,y<=21?PURPLE:BLACK);}
  tipX=Math.round(ox);tipZ=Math.round(oz);
  block(tipX,y,tipZ,y<=21?PURPLE:BLACK);
  if(y<=21){block(WX,y,Math.ceil(WZ-r),GOLD);}
}
block(tipX,32,tipZ,GLOWSTONE);

// ---------- black cat ----------
cube(-8,0,-4,-6,2,-3,BLACK);
cube(-8,3,-5,-6,4,-3,BLACK);
block(-8,5,-5,BLACK);block(-6,5,-5,BLACK);
block(-8,0,-5,BLACK);block(-6,0,-5,BLACK);
block(-8,4,-5,LIME);block(-6,4,-5,LIME);block(-7,3,-5,PINK);
block(-5,0,-2,BLACK);block(-4,0,-2,BLACK);block(-4,1,-2,BLACK);block(-4,2,-3,BLACK);block(-4,3,-3,BLACK);

// ---------- crate of potions + skull ----------
cube(-10,0,1,-9,1,2,PLANKS);
block(-10,2,1,LIME);block(-10,3,1,GLASS);
block(-9,2,2,MAGENTA);block(-9,3,2,GLASS);
block(-9,2,1,RED);
block(-10,2,2,WHITE);

// ---------- jack-o-lanterns ----------
function pumpkin(px,py,pz,big){
  const w=big?2:1,h=big?4:2;
  for(let dx=-w;dx<=w;dx++)for(let dz=-w;dz<=w;dz++){
    block(px+dx,py-1,pz+dz,GRASS);
    for(let dy=0;dy<h;dy++){
      if(big&&Math.abs(dx)===w&&Math.abs(dz)===w&&(dy===0||dy===h-1)) continue;
      block(px+dx,py+dy,pz+dz,ORANGE);
    }}
  block(px,py+h,pz,GREEN);block(px+1,py+h,pz,LIME);
  const fz=pz-w;
  if(big){
    block(px-1,py+2,fz,GLOWSTONE);block(px+1,py+2,fz,GLOWSTONE);
    for(const dx of [-2,-1,1,2]) block(px+dx,py+1,fz,GLOWSTONE);
  } else {
    block(px-1,py+1,fz,GLOWSTONE);block(px+1,py+1,fz,GLOWSTONE);block(px,py,fz,GLOWSTONE);
  }
}
pumpkin(8,0,-7,true);
pumpkin(11,0,2,false);
pumpkin(-9,1,-9,false);

// ---------- toadstools ----------
block(-12,1,-5,WHITE);block(-12,2,-5,WHITE);
cube(-13,3,-6,-11,3,-4,RED);block(-12,4,-5,RED);block(-13,3,-4,WHITE);block(-11,3,-6,WHITE);block(-12,4,-5,RED);
block(-13,1,-3,WHITE);
[[0,0],[-1,0],[1,0],[0,1],[0,-1]].forEach(([dx,dz])=>block(-13+dx,2,-3+dz,RED));
block(12,0,7,WHITE);block(12,1,7,MAGENTA);block(11,1,7,MAGENTA);block(13,1,7,MAGENTA);block(12,1,6,MAGENTA);block(12,2,7,MAGENTA);block(12,1,8,WHITE);

// ---------- gnarled dead tree with lantern + crow ----------
for(let y=0;y<=6;y++)block(14,y,9,OAK_LOG);
block(13,0,9,OAK_LOG);block(15,0,9,OAK_LOG);block(14,0,10,OAK_LOG);block(14,0,8,OAK_LOG);block(12,0,9,BROWN);
line(14,6,9,13,10,10,OAK_LOG);
line(14,5,9,18,8,8,OAK_LOG);line(18,8,8,19,9,8,BROWN);
line(13,9,10,10,12,9,OAK_LOG);line(10,12,9,9,14,9,BROWN);
line(13,10,10,15,13,11,OAK_LOG);line(15,13,11,16,15,10,BROWN);
line(14,7,9,11,8,7,BROWN);
block(18,7,8,IRON);block(18,6,8,GLOWSTONE);block(18,5,8,IRON);
block(10,13,9,BLACK);block(11,13,9,BLACK);block(10,14,9,BLACK);block(9,14,9,YELLOW);

// ---------- crooked witch hut (back left) ----------
const HX1=-19,HX2=-9,HZ1=8,HZ2=15;
cube(HX1,-1,HZ1,HX2,-1,HZ2,COBBLE);
for(let y=0;y<=5;y++)for(let x=HX1;x<=HX2;x++)for(let z=HZ1;z<=HZ2;z++){
  const ex=x===HX1||x===HX2,ez=z===HZ1||z===HZ2; if(!ex&&!ez) continue;
  block(x,y,z,((ex&&ez)||y===5)?OAK_LOG:(hs(x,y,z)<0.22?BROWN:PLANKS));
}
cube(-13,0,HZ1,-12,2,HZ1,BROWN);block(-12,1,HZ1-1,GOLD);
cube(-17,2,HZ1,-16,3,HZ1,GLOWSTONE);line(-17,1,HZ1-1,-16,1,HZ1-1,OAK_LOG);
block(-18,2,HZ1-1,BROWN);block(-18,3,HZ1-1,BROWN);block(-15,2,HZ1-1,BROWN);block(-15,3,HZ1-1,BROWN);
cube(HX2,2,11,HX2,3,12,GLOWSTONE);
for(let i=0;i<=4;i++){const y=6+i;
  for(let x=HX1-1;x<=HX2+1;x++)for(const z of [HZ1-1+i,HZ2+1-i])block(x,y,z,hs(x,y,z)<0.25?GRAY:BROWN);}
for(let i=0;i<=3;i++)for(let z=HZ1+i;z<=HZ2-i;z++){block(HX1,6+i,z,PLANKS);block(HX2,6+i,z,PLANKS);}
cube(-12,6,13,-11,12,14,COBBLE);
block(-12,13,13,FIRE);
// broom leaning on the hut
line(-10,5,7,-10,2,6,BROWN);
block(-10,1,6,YELLOW);block(-10,0,6,YELLOW);block(-10,0,5,YELLOW);block(-11,0,6,ORANGE);block(-9,0,6,ORANGE);block(-10,1,5,YELLOW);

// ---------- crackling magic over the brew ----------
block(CX+1,10,CZ-1,ELECTRIC);
block(CX-2,11,CZ+1,ELECTRIC);
block(CX,25,CZ,ELECTRIC);
block(CX+2,22,CZ-2,ELECTRIC);