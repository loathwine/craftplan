// aurora-cabin-sonnet55 — prompt:
// a log cabin under the northern lights...

const H=(a,b)=>{const s=Math.sin(a*127.1+b*311.7)*43758.5453;return s-Math.floor(s);};

// ---------- clear site ----------
cube(-14,0,-11,14,13,9,AIR);

// ---------- snowy ground ----------
for(let x=-17;x<=17;x++)for(let z=-12;z<=15;z++){
  const d=Math.hypot(x/17,(z-2)/14);
  if(d<0.88+0.12*(H(x,z)-0.5)) block(x,0,z,SNOW);
}

// frozen pond
disk(13,0,-10,3,ICE);
block(10,0,-10,ICE);

// stepping stones
block(-1,0,-8,COBBLE);block(0,0,-10,COBBLE);block(-1,0,-12,COBBLE);block(0,0,-9,GRAY);block(-1,0,-11,GRAY);

// ---------- campfire ----------
for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){ if(dx||dz) block(4+dx,0,-9+dz,COBBLE); }
block(4,0,-9,OAK_LOG);
block(4,1,-9,FIRE);
cube(1,1,-10,1,1,-8,OAK_LOG);
cube(7,1,-10,7,1,-8,OAK_LOG);

// ---------- cabin ----------
// foundation
cube(-6,-1,-3,4,0,-3,COBBLE);cube(-6,-1,6,4,0,6,COBBLE);
cube(-6,-1,-3,-6,0,6,COBBLE);cube(4,-1,-3,4,0,6,COBBLE);
cube(-5,0,-2,3,0,5,PLANKS);

// log walls
for(let y=1;y<=4;y++){
  const m=(y%2)?OAK_LOG:BROWN;
  cube(-6,y,-3,4,y,-3,m);cube(-6,y,6,4,y,6,m);
  cube(-6,y,-3,-6,y,6,m);cube(4,y,-3,4,y,6,m);
  if(y%2){
    block(-7,y,-3,OAK_LOG);block(5,y,-3,OAK_LOG);block(-7,y,6,OAK_LOG);block(5,y,6,OAK_LOG);
  } else {
    block(-6,y,-4,OAK_LOG);block(4,y,-4,OAK_LOG);block(-6,y,7,OAK_LOG);block(4,y,7,OAK_LOG);
  }
}

// front door
cube(-2,1,-3,-2,4,-3,PLANKS);cube(0,1,-3,0,4,-3,PLANKS);
cube(-1,1,-3,-1,2,-3,BROWN);
block(-1,3,-3,GLASS);block(-1,4,-3,PLANKS);
block(0,2,-3,GOLD);
block(-1,3,-2,GLOWSTONE);

// front windows
cube(-4,2,-3,-3,3,-3,GLASS);cube(1,2,-3,2,3,-3,GLASS);
cube(-5,2,-3,-5,3,-3,PLANKS);cube(3,2,-3,3,3,-3,PLANKS);
cube(-5,1,-3,-3,1,-3,PLANKS);cube(1,1,-3,3,1,-3,PLANKS);
cube(-5,4,-3,-3,4,-3,PLANKS);cube(1,4,-3,3,4,-3,PLANKS);
cube(-4,2,-2,-3,2,-2,GLOWSTONE);cube(1,2,-2,2,2,-2,GLOWSTONE);

// west windows
cube(-6,2,1,-6,3,2,GLASS);
cube(-6,1,0,-6,4,0,PLANKS);cube(-6,1,3,-6,4,3,PLANKS);
cube(-6,1,1,-6,1,2,PLANKS);cube(-6,4,1,-6,4,2,PLANKS);
cube(-5,2,1,-5,2,2,GLOWSTONE);

// east windows
cube(4,2,4,4,3,5,GLASS);
cube(4,1,3,4,4,3,PLANKS);
cube(4,1,4,4,1,5,PLANKS);cube(4,4,4,4,4,5,PLANKS);
cube(3,2,4,3,2,5,GLOWSTONE);

// gable walls
for(let i=0;i<=5;i++){
  cube(-6+i,5+i,-3,4-i,5+i,-3,PLANKS);
  cube(-6+i,5+i,6,4-i,5+i,6,PLANKS);
}
// attic window
cube(-2,7,-3,0,7,-3,GLASS);block(-1,8,-3,GLASS);
block(-1,7,-2,GLOWSTONE);

// roof along Z
for(let i=0;i<=6;i++){
  const y=5+i,a=-7+i,b=5-i;
  for(let z=-4;z<=7;z++){
    const end=(z===-4||z===7);
    const top=(x)=> i===0?BROWN : (end?BROWN : (H(x+i*7,z)>0.25?SNOW:BROWN));
    if(i<6){
      block(a,y,z,top(a));block(b,y,z,top(b));
      block(a+1,y,z,PLANKS);block(b-1,y,z,PLANKS);
    } else {
      block(-1,y,z,SNOW);
    }
  }
}
block(-1,12,-4,OAK_LOG);block(-1,13,-4,SNOW);
// icicles
for(let z=-4;z<=7;z++){
  if(H(z,9)>0.5) block(-7,4,z,ICE);
  if(H(z,13)>0.5) block(5,4,z,ICE);
}

// chimney
cube(5,0,0,7,11,2,COBBLE);
cube(5,12,0,7,12,2,COBBLE);
block(6,12,1,AIR);
for(let y=1;y<=10;y++){ if(H(y,3)>0.6) block(5,y,0,GRAY); if(H(y,4)>0.6) block(7,y,2,GRAY); }
block(6,12,1,STEAM);block(6,14,1,STEAM);
block(5,13,0,SNOW);block(7,13,2,SNOW);

// porch
cube(-4,0,-7,2,0,-4,PLANKS);
cube(-5,5,-7,3,5,-4,BROWN);
cube(-5,6,-7,3,6,-5,SNOW);
cube(-4,1,-7,-4,4,-7,OAK_LOG);cube(2,1,-7,2,4,-7,OAK_LOG);
cube(-5,4,-7,3,4,-7,OAK_LOG);
block(-1,3,-7,GLOWSTONE);
cube(-3,1,-7,-2,1,-7,PLANKS);cube(0,1,-7,1,1,-7,PLANKS);
cube(-4,1,-6,-4,1,-5,PLANKS);cube(2,1,-6,2,1,-5,PLANKS);
// chair + barrel
cube(1,1,-6,1,1,-5,PLANKS);block(1,2,-5,PLANKS);block(1,2,-4,PLANKS);
cube(-3,1,-5,-3,2,-5,BROWN);block(-3,3,-5,SNOW);
// icicles on porch
for(let x=-5;x<=3;x++){ if(H(x,21)>0.55) block(x,4,-8,ICE); }

// snow drifts at base
for(let z=0;z<=5;z++){ if(H(z,31)>0.3) block(-7,1,z,SNOW); }
for(let z=3;z<=7;z++){ if(H(z,32)>0.3) block(5,1,z,SNOW); }
for(let x=-6;x<=4;x++){ if(H(x,33)>0.35) block(x,1,7,SNOW); }

// ---------- woodpile + stump ----------
cube(-10,1,-3,-8,2,-2,OAK_LOG);
for(let x=-10;x<=-8;x++)for(let y=1;y<=2;y++){ if((x+y)%2===0) block(x,y,-3,PLANKS); }
cube(-10,3,-3,-8,3,-2,SNOW);
block(-9,1,-5,OAK_LOG);block(-9,2,-5,BROWN);block(-10,2,-5,IRON);

// ---------- tool shed ----------
cube(10,1,-5,13,3,-5,PLANKS);cube(10,1,-1,13,3,-1,PLANKS);
cube(10,1,-5,10,3,-1,PLANKS);cube(13,1,-5,13,3,-1,PLANKS);
cube(11,1,-5,11,2,-5,BROWN);
cube(12,2,-5,12,2,-5,GLASS);
block(12,2,-4,GLOWSTONE);
cube(9,4,-6,14,4,0,BROWN);
cube(9,5,-6,14,5,0,SNOW);
block(10,3,-6,GLOWSTONE);
cube(14,1,-4,14,2,-3,PLANKS);

// ---------- snowman ----------
sphere(-13,2,-7,2,SNOW);
sphere(-13,5,-7,1,SNOW);
disk(-13,4,-7,1,RED);
block(-14,5,-8,BLACK);block(-12,5,-8,BLACK);block(-13,5,-9,ORANGE);
block(-13,3,-9,BLACK);block(-13,2,-9,BLACK);
disk(-13,7,-7,1,BLACK);cube(-13,8,-7,-13,9,-7,BLACK);
line(-15,3,-7,-17,5,-7,OAK_LOG);line(-11,3,-7,-9,5,-7,OAK_LOG);

// ---------- spruces ----------
function spruce(cx,cz,n){
  const top=3+2*n;
  cube(cx,-1,cz,cx,top,cz,OAK_LOG);
  for(let i=0;i<n;i++){
    const y=3+2*i,r=n-i;
    disk(cx,y,cz,r,LEAVES);
    if(r>1) disk(cx,y+1,cz,r-1,LEAVES);
    for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){
      const d=Math.hypot(dx,dz);
      if(d<=r+0.01&&d>r-1.1&&H(cx+dx+i*5,cz+dz)>0.4) block(cx+dx,y+1,cz+dz,SNOW);
    }
  }
  block(cx,top+1,cz,LEAVES);block(cx,top+2,cz,SNOW);
}
spruce(-12,9,5);
spruce(-7,12,4);
spruce(-17,3,4);
spruce(7,11,4);
spruce(13,9,4);
spruce(-18,-9,3);
spruce(18,-5,3);
spruce(19,3,3);

// ---------- aurora borealis ----------
for(let x=-22;x<=22;x++){
  const base=Math.round(18+3*Math.sin(x*0.22+0.5)+1.5*Math.sin(x*0.5));
  const z=15+Math.round(3*Math.sin(x*0.13));
  let hh=Math.round(7+3*Math.sin(x*0.35+1)+2*H(x,7));
  if(H(x,3)<0.18) hh=Math.round(hh*0.4);
  for(let k=0;k<=hh;k++){
    const y=base+k; if(y>33) break;
    const f=k/hh;
    const c=f<0.15?LIME:f<0.5?GREEN:f<0.75?CYAN:f<0.93?PURPLE:MAGENTA;
    block(x,y,z,c);
    if(x%2===0) block(x,y,z+1,c);
  }
}
// distant fainter ribbon
for(let x=-22;x<=22;x++){
  if(H(x,11)<0.3) continue;
  const base=Math.round(24+3*Math.sin(x*0.17+2));
  const z=20+Math.round(2*Math.sin(x*0.2));
  const hh=4+Math.round(2*H(x,12));
  for(let k=0;k<=hh;k++){
    const y=base+k; if(y>33) break;
    const f=k/hh;
    block(x,y,z,f<0.3?CYAN:f<0.6?LIGHT_BLUE:f<0.85?BLUE:PURPLE);
  }
}
// stars
for(let i=0;i<22;i++){
  block(-21+Math.floor(H(i,5)*43),28+Math.floor(H(i,6)*6),22,WHITE);
}