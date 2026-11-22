// viking-winter-sonnet55 — prompt:
// a Viking warrior in a snowstorm...

const H=(a,b,c)=>{const s=Math.sin(a*12.9898+b*78.233+c*37.719)*43758.5453;return s-Math.floor(s);};
let seed=777;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;};

// ---------- clear site ----------
cube(-16,1,-10,19,9,8,AIR);
cube(-13,1,8,-5,24,16,AIR);
cube(8,1,10,16,24,18,AIR);

// ---------- snowy ground ----------
for(let x=-16;x<=18;x++)for(let z=-10;z<=10;z++){
  const nx=(x-1)/17,nz=z/9.5;
  const d=nx*nx+nz*nz+(H(x,3,z)-0.5)*0.35;
  if(d<1)block(x,0,z,SNOW);
}
function mound(cx,cz,r,h){
  for(let x=cx-r;x<=cx+r;x++)for(let z=cz-r;z<=cz+r;z++){
    const d=Math.hypot(x-cx,z-cz)/r;
    if(d<1){const hh=Math.round(h*(1-d*d));for(let y=1;y<=hh;y++)block(x,y,z,SNOW);}
  }
}
mound(-12,6,4,3);mound(12,-4,3,2);mound(-4,-9,3,2);mound(8,9,3,2);

// ---------- background spruces ----------
function spruce(cx,cz,h){
  disk(cx,0,cz,4,SNOW);
  line(cx,1,cz,cx,h,cz,OAK_LOG);
  for(let t=0;t<4;t++){
    const yb=4+t*4,r=4.4-t;
    disk(cx,yb,cz,r,LEAVES);
    disk(cx,yb+1,cz,r-1,LEAVES);
    disk(cx,yb+2,cz,Math.max(0.5,r-1.8),SNOW);
  }
  line(cx,17,cz,cx,h+1,cz,LEAVES);
  block(cx,h+2,cz,SNOW);
}
spruce(-9,12,21);
spruce(12,14,21);

// ---------- rune stone ----------
cube(13,1,-8,15,6,-7,STONE);
cube(14,7,-8,14,7,-7,STONE);
block(13,7,-7,SNOW);block(15,7,-7,SNOW);cube(13,7,-8,13,7,-8,SNOW);cube(15,7,-8,15,7,-8,SNOW);block(14,8,-7,SNOW);
block(14,5,-8,NEON_BLUE);block(14,4,-8,NEON_BLUE);block(13,3,-8,NEON_BLUE);block(15,3,-8,NEON_BLUE);block(14,2,-8,NEON_BLUE);

// ---------- torches ----------
line(-17,1,-7,-17,4,-7,PLANKS);block(-17,5,-7,FIRE);
line(18,1,-6,18,4,-6,PLANKS);block(18,5,-6,FIRE);

// ---------- blizzard streaks (before body so body overrides) ----------
function streak(x,y,z){
  const pts=[[x,y,z],[x+1,y,z],[x+2,y-1,z+1]];
  for(const [a,b,c] of pts){if(b>=1&&b<=33&&a<=22&&a>=-22)block(a,b,c,SNOW);}
}
for(let i=0;i<90;i++){
  streak(Math.floor(-21+rnd()*38),Math.floor(8+rnd()*25),Math.floor(-3+rnd()*17));
}
for(let i=0;i<18;i++){
  streak(Math.floor(-20+rnd()*38),1+Math.floor(rnd()*4),Math.floor(-14+rnd()*8));
}

// ---------- LEGS ----------
cube(1,1,-3,3,3,0,BROWN);          // right boot (forward)
cube(-3,1,-1,-1,3,2,BROWN);        // left boot (back)
block(1,3,-3,SNOW);block(2,3,-3,SNOW);block(-3,3,-1,SNOW);block(-2,3,-1,SNOW);
cube(1,4,-3,4,4,1,WHITE);          // fur cuffs
cube(-4,4,-1,-1,4,3,WHITE);
cube(1,5,-2,3,9,0,GRAY);
cube(-3,5,0,-1,9,2,GRAY);
for(const y of [6,8]){cube(1,y,-2,3,y,0,BROWN);cube(-3,y,0,-1,y,2,BROWN);}

// ---------- TUNIC + BELT ----------
cube(-5,10,-3,5,10,3,BLUE);
cube(-4,11,-2,4,12,2,BLUE);
for(let x=-5;x<=5;x++)if(x%2===0)block(x,10,-3,GOLD);
cube(-4,13,-2,4,13,2,BROWN);
cube(-1,13,-3,1,13,-3,GOLD);
cube(5,11,-2,5,12,-1,BROWN);       // pouch

// ---------- TORSO (chainmail) ----------
cube(-4,14,-2,4,19,2,IRON);
for(let x=-4;x<=4;x++)for(let y=14;y<=19;y++)if((x+y)&1)block(x,y,-2,GRAY);
for(let y=14;y<=19;y++)for(let z=-2;z<=2;z++)if((y+z)&1){block(4,y,z,GRAY);block(-4,y,z,GRAY);}
line(-4,19,-2,3,14,-2,BROWN);
line(-3,19,-2,4,14,-2,BROWN);

// ---------- CLOAK (wind-blown to the east) ----------
for(let y=19;y>=6;y--){
  const t=(19-y)/13;
  const sx=Math.round(t*t*6),sz=Math.round(t*3);
  const x1=-5-Math.round(t)+sx,x2=5+Math.round(t*3)+sx;
  for(let x=x1;x<=x2;x++)for(let k=0;k<2;k++){
    const z=3+sz+k;
    if(y<=10&&H(x,y,z)>0.75)continue;
    let c=RED;
    if(x===x1||x===x2)c=WHITE;
    else if(y===6||y===7)c=BLACK;
    block(x,y,z,c);
  }
}

// ---------- FUR MANTLE ----------
for(let x=-6;x<=6;x++)for(let z=-3;z<=3;z++){
  if(Math.abs(x)===6&&Math.abs(z)>=2)continue;
  for(let y=19;y<=20;y++)block(x,y,z,H(x,y,z)>0.45?WHITE:LIGHT_GRAY);
}
for(let x=-6;x<=6;x++)for(let z=-3;z<=3;z++){
  if(Math.abs(x)===6&&Math.abs(z)>=2)continue;
  if(H(x,1,z)>0.6)block(x,21,z,SNOW);
}
cube(-4,21,-4,4,21,4,WHITE);       // fur collar
block(-5,19,-3,GOLD);block(5,19,-3,GOLD);   // clasps

// ---------- ARMS ----------
// left (west) arm holds shield
cube(-7,15,-1,-5,18,1,BLUE);
cube(-8,14,-3,-6,16,-1,IRON);
// right (east) arm holds axe
cube(5,15,-1,7,18,1,BLUE);
cube(7,15,-3,7,17,-1,BLUE);
cube(8,15,-3,8,17,-1,IRON);
cube(9,15,-3,11,17,-1,BROWN);

// ---------- ROUND SHIELD ----------
for(let x=-15;x<=-5;x++)for(let y=10;y<=20;y++){
  const dx=x+10,dy=y-15,d=Math.hypot(dx,dy);
  if(d>4.7)continue;
  block(x,y,-4,d>3.7?IRON:BROWN);
  let c;
  if(d>3.7)c=IRON;
  else{const a=Math.atan2(dy,dx);const s=Math.floor((a+Math.PI)/(Math.PI/4));c=(s%2)?RED:WHITE;}
  if(d<1.7)c=GOLD;
  block(x,y,-5,c);
}
block(-10,15,-6,GOLD);block(-11,15,-6,GOLD);block(-9,15,-6,GOLD);block(-10,16,-6,GOLD);block(-10,14,-6,GOLD);block(-10,15,-7,GOLD);
for(let x=-12;x<=-8;x++){block(x,20,-5,SNOW);block(x,20,-4,SNOW);}
// arrows stuck in the shield
line(-9,17,-6,-14,19,-11,OAK_LOG);
block(-14,19,-11,WHITE);block(-14,20,-11,WHITE);block(-15,19,-11,WHITE);block(-15,20,-11,WHITE);
line(-8,13,-6,-12,14,-10,OAK_LOG);
block(-12,14,-10,WHITE);block(-12,15,-10,WHITE);block(-13,14,-10,WHITE);

// ---------- HEAD ----------
cube(-3,21,-3,3,25,3,SAND);
cube(-3,21,3,3,25,3,ORANGE);                       // back hair
cube(4,21,1,4,25,3,ORANGE);cube(-4,21,1,-4,25,3,ORANGE);
cube(4,21,-3,4,25,0,ORANGE);cube(-4,21,-3,-4,25,0,ORANGE);
// face
block(-2,24,-3,NEON_BLUE);block(2,24,-3,NEON_BLUE);
block(-3,25,-3,BROWN);block(-2,25,-3,BROWN);block(-1,24,-3,BROWN);
block(3,25,-3,BROWN);block(2,25,-3,BROWN);block(1,24,-3,BROWN);
block(-3,23,-3,PINK);block(3,23,-3,PINK);
block(0,23,-4,SAND);
block(0,24,-4,IRON);block(0,25,-4,IRON);           // nose guard
// helmet
const hr=[4.6,4.6,3.7,2.5];
for(let y=26;y<=29;y++){
  for(let x=-5;x<=5;x++)for(let z=-5;z<=5;z++){
    const d=Math.hypot(x,z);
    if(d<=hr[y-26])block(x,y,z,(y<=27&&d>3.6)?COPPER:IRON);
  }
}
line(0,30,-2,0,30,2,COPPER);block(0,31,0,SNOW);
block(-2,30,0,SNOW);block(2,30,0,SNOW);
// beard
cube(-3,21,-4,3,22,-3,ORANGE);
cube(-1,21,-4,1,21,-4,RED);                        // roaring mouth
cube(-2,19,-4,2,20,-3,ORANGE);
cube(-1,18,-4,1,18,-3,ORANGE);
block(-1,17,-4,ORANGE);block(1,17,-4,ORANGE);block(0,17,-3,GOLD);
// braids
for(const sx of [-4,4]){
  for(let y=14;y<=20;y++)block(sx,y,-3,(y%2)?ORANGE:BROWN);
  block(sx,17,-3,GOLD);block(sx,14,-3,GOLD);
}
// hammer pendant
cube(-1,16,-3,1,16,-3,GOLD);block(0,15,-3,BROWN);block(0,14,-3,BROWN);
// cold breath
block(0,20,-6,STEAM);block(-1,20,-6,STEAM);

// ---------- HORNS ----------
const horn=[[4,27],[5,27],[6,27],[7,28],[8,29],[8,30],[8,31],[7,32],[7,33]];
for(const sgn of [-1,1]){
  horn.forEach(([dx,y],i)=>{
    const c=i<1?GOLD:(i>=7?LIGHT_GRAY:WHITE);
    block(sgn*dx,y,0,c);
    if(i<7)block(sgn*dx,y,-1,c);
  });
}

// ---------- BEARDED AXE ----------
for(let y=6;y<=31;y++)block(10,y,-2,(y%4===0)?OAK_LOG:PLANKS);
block(10,5,-2,IRON);
line(10,32,-2,10,33,-2,IRON);
block(9,27,-2,IRON);block(9,28,-2,IRON);block(9,26,-2,IRON);
for(let y=24;y<=31;y++){
  const dy=y-27.5,f=1-(dy/4.3)*(dy/4.3);
  if(f<=0)continue;
  const ext=Math.max(1,Math.round(1+5.5*Math.sqrt(f)));
  for(let i=1;i<=ext;i++){
    const x=10+i,c=(i===ext)?MARBLE:IRON;
    block(x,y,-2,c);
    if(i<=3){block(x,y,-3,c);block(x,y,-1,c);}
  }
}
block(12,26,-3,GOLD);block(12,27,-3,GOLD);block(12,28,-3,GOLD);block(11,27,-3,GOLD);block(13,27,-3,GOLD);
block(11,32,-2,SNOW);block(12,32,-2,SNOW);block(13,32,-2,SNOW);
// leather grip wraps
for(let y=14;y<=18;y++)if(y%2)block(10,y,-2,BROWN);