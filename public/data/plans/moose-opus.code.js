// moose-opus — prompt:
// a moose...

const H=(x,y,z)=>{const s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s);};
function ell(cx,cy,cz,rx,ry,rz,fn){
  const ins=(x,y,z)=>((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2<=1;
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)
  for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    if(!ins(x,y,z))continue;
    if(ins(x+1,y,z)&&ins(x-1,y,z)&&ins(x,y+1,z)&&ins(x,y-1,z)&&ins(x,y,z+1)&&ins(x,y,z-1))continue;
    block(x,y,z,typeof fn==='function'?fn(x,y,z):fn);
  }
}

// ---------- SITE PREP ----------
cube(-10,0,-22,10,33,14,AIR);
cube(-22,0,-22,-11,10,-8,AIR);
cube(-10,-1,-22,10,-1,14,GRASS);
cube(-22,-1,-22,-11,-1,-8,GRASS);

// ---------- POND (front-west) ----------
for(let x=-22;x<=-9;x++)for(let z=-22;z<=-8;z++){
  const d=((x+15.5)/5.5)**2+((z+15)/4.5)**2;
  if(d<=1)block(x,-1,z,WATER);
  else if(d<=1.45)block(x,-1,z,H(x,1,z)<0.6?SAND:GRASS);
}
block(-14,-1,-16,LIME);block(-17,-1,-14,LIME);block(-13,-1,-13,LIME);
const reeds=[[-20,-13,3],[-19,-18,2],[-11,-12,3],[-12,-18,2],[-16,-10,3],[-10,-15,2],[-21,-15,2],[-15,-20,3]];
for(const [x,z,h] of reeds){cube(x,0,z,x,h-1,z,GREEN);block(x,h,z,BROWN);}

// ---------- ROCKS, BUSHES, LOG ----------
ell(7,0,-16,1.8,1.2,1.5,(x,y,z)=>H(x,y,z)<0.5?STONE:COBBLE);
ell(-7,0,9,1.5,1,1.5,(x,y,z)=>H(x,y,z)<0.5?STONE:COBBLE);
ell(-6,0,-18,1.8,1.4,1.8,LEAVES);
ell(8,1,3,1.6,1.6,1.6,LEAVES);
ell(-8,0,2,1.4,1.2,1.4,LEAVES);
cube(5,0,-12,9,0,-12,OAK_LOG);
block(6,1,-12,LEAVES);block(8,1,-12,GREEN);block(4,0,-13,RED);

// ---------- SPRUCES (background) ----------
function spruce(x0,z0,h){
  cube(x0,0,z0,x0,h-2,z0,OAK_LOG);
  for(let y=3;y<=h;y++){
    const t=(h-y)/(h-3);
    let r=Math.round(0.6+t*4-((y%2)?0.9:0));
    if(r<=0){block(x0,y,z0,GREEN);continue;}
    disk(x0,y,z0,r,GREEN);
  }
  block(x0,h+1,z0,GREEN);
}
spruce(10,13,16);
spruce(-10,13,14);

// ---------- MOOSE ----------
const fur=(x,y,z)=>{const r=H(x,y,z);
  if(y>=19&&Math.abs(x)<=1&&z>=-11&&z<=3)return r<0.7?BLACK:OAK_LOG;
  if(y<=10)return r<0.55?OAK_LOG:BROWN;
  return r<0.2?OAK_LOG:(r<0.26?BLACK:BROWN);
};
const mz=(x,y,z)=>{const r=H(x,y,z);return r<0.45?OAK_LOG:(r<0.55?GRAY:BROWN);};
const legCol=(x,y,z)=>y<=4?(H(x,y,z)<0.3?GRAY:LIGHT_GRAY):(H(x,y,z)<0.4?OAK_LOG:BROWN);
function seg(x1,y,z1){for(let dx=0;dx<2;dx++)for(let dz=0;dz<2;dz++)block(x1+dx,y,z1+dz,legCol(x1+dx,y,z1+dz));}

// front-left leg (planted)
for(let y=1;y<=9;y++)seg(-3,y,-6);
cube(-3,0,-7,-2,0,-6,BLACK);
// front-right leg (striding forward)
for(let y=1;y<=9;y++){const zo=Math.round((9-y)*2/8);seg(2,y,-6-zo);}
cube(2,0,-9,3,0,-7,BLACK);
// rear-left leg (pushing back)
for(let y=6;y<=9;y++)seg(-3,y,y<=7?8:7);
for(let y=1;y<=5;y++)seg(-3,y,8+Math.round((5-y)/4));
cube(-3,0,8,-2,0,10,BLACK);
// rear-right leg
for(let y=6;y<=9;y++)seg(2,y,y<=7?8:7);
for(let y=1;y<=5;y++)seg(2,y,8);
cube(2,0,7,3,0,9,BLACK);

// shoulders & haunches
ell(-3,11,-5,2,3,2.5,fur);
ell(3,11,-5.5,2,3,2.5,fur);
ell(-3,12,7.5,2.5,3.5,3,fur);
ell(3,12,7.5,2.5,3.5,3,fur);

// body, chest, hump, rump
ell(0,14,1,5.5,5,9.5,fur);
ell(0,13,-6.5,4.5,4.5,3.5,fur);
ell(0,17.5,-3.5,4.5,3.8,5.5,fur);
ell(0,15,7.5,5,4.5,3.5,fur);
block(0,16,11,OAK_LOG);block(0,15,12,OAK_LOG);

// neck
for(const t of [0,0.25,0.5,0.75,1])ell(0,16.5+2*t,-8-4.5*t,3,3.2,2.5,fur);

// head + bulbous muzzle
ell(0,18.5,-15.5,2.5,2.6,3.2,fur);
ell(0,17,-19,2.6,2.5,2.2,mz);
ell(0,16,-20,2.2,2,1.8,mz);
block(-1,17,-21,BLACK);block(1,17,-21,BLACK);
line(-1,15,-21,1,15,-21,BLACK);
// eyes + brows
for(const s of [-1,1]){
  block(2*s,19,-16,OBSIDIAN);block(2*s,19,-17,BLACK);
  block(2*s,20,-16,OAK_LOG);block(2*s,20,-17,OAK_LOG);
}
// ears
for(const s of [-1,1]){
  line(2*s,20,-13,4*s,22,-12,BROWN);
  block(3*s,22,-12,BROWN);block(4*s,23,-12,OAK_LOG);block(3*s,21,-12,OAK_LOG);
}
// dewlap (bell)
line(0,14,-13,0,10,-13,OAK_LOG);
line(0,13,-12,0,11,-12,OAK_LOG);
block(0,9,-13,BLACK);
// cold breath
block(-1,16,-22,STEAM);block(1,16,-22,STEAM);

// ---------- PALMATE ANTLERS ----------
const zf=(y)=>-14+Math.round((y-23)*0.35);
const ant=(x,y,z)=>H(x,y,z)<0.25?PLANKS:SAND;
for(const s of [-1,1]){
  block(1*s,20,-14,SAND);
  line(1*s,21,-14,6*s,23,-14,SAND);
  line(1*s,21,-13,6*s,23,-13,SAND);
  line(5*s,23,-14,9*s,25,-14,SAND);
  line(5*s,24,-13,9*s,26,-13,SAND);
  // palm
  for(let ax=5;ax<=16;ax++)for(let y=21;y<=31;y++){
    const d=((ax-10)/5)**2+((y-26)/4)**2;
    if(d>1)continue;
    const z=zf(y)-(Math.abs(ax-10)>3?1:0);
    const x=ax*s;
    block(x,y,z,d>0.75?PLANKS:ant(x,y,z));
    block(x,y,z+1,ant(x,y,z+1));
  }
  // tines along upper/outer rim
  const tines=[[-15,2.5],[15,3],[45,3],[75,2.5],[105,3],[140,2.5]];
  for(const [deg,len] of tines){
    const a=deg*Math.PI/180;
    const sx=Math.round(10+5*Math.cos(a)), sy=Math.round(26+4*Math.sin(a));
    const ex=Math.round(10+(5+len)*Math.cos(a)), ey=Math.min(33,Math.round(26+(4+len)*Math.sin(a)+0.6));
    line(sx*s,sy,zf(sy),ex*s,ey,zf(ey),SAND);
    block(ex*s,ey,zf(ey),WHITE);
  }
  // brow tine pointing forward
  line(5*s,23,-14,7*s,24,-18,SAND);
  block(7*s,24,-18,WHITE);
  line(4*s,22,-14,4*s,22,-16,SAND);
  block(4*s,22,-17,WHITE);
}