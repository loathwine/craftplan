// time-machine-opus — prompt:
// H.G. Wells' time machine...

cube(-15,1,-13,15,13,15,AIR);
cube(-12,0,-10,12,0,12,AIR);

// ---------- Parquet floor ----------
for(let x=-12;x<=12;x++)for(let z=-10;z<=12;z++){
  const edge=(x===-12||x===12||z===-10||z===12);
  let b=((Math.floor((x+20)/2)+Math.floor((z+20)/2))%2)?PLANKS:BROWN;
  if(edge)b=OAK_LOG;
  block(x,-1,z,b);
}
// ---------- Persian rug ----------
for(let x=-7;x<=7;x++)for(let z=-9;z<=10;z++){
  const d=Math.min(x+7,7-x,z+9,10-z);
  let b=RED;
  if(d===0)b=GOLD;
  else if(d===1)b=BLACK;
  else if(d>2&&((Math.abs(x)+Math.abs(z))%4===0))b=ORANGE;
  block(x,-1,z,b);
}

// ---------- Sled runners ----------
for(const sx of [-4,4]){
  line(sx,0,-5,sx,0,9,GOLD);
  block(sx,0,-6,GOLD);block(sx,1,-7,GOLD);block(sx,2,-7,GOLD);block(sx,3,-6,GOLD);
  block(sx,0,10,GOLD);block(sx,1,11,GOLD);
}
for(const sx of [-2,2]){block(sx,0,-3,IRON);block(sx,0,5,IRON);}

// ---------- Deck ----------
for(let x=-4;x<=4;x++)for(let z=-5;z<=9;z++){
  let b=BROWN;
  if(x===-4||x===4||z===-5||z===9)b=GOLD;
  else if(x===-2||x===2)b=COPPER;
  block(x,1,z,b);
}

// ---------- Engine box under the disc ----------
cube(-3,2,7,3,4,9,BROWN);
line(-3,4,7,3,4,7,GOLD);line(-3,2,7,3,2,7,GOLD);
block(-2,3,7,COPPER);block(2,3,7,COPPER);
for(let z=7;z<=9;z++){block(-4,2,z,COPPER);block(4,2,z,COPPER);block(-4,3,z,GOLD);block(4,3,z,GOLD);}

// ---------- The great rotating disc ----------
const CY=15;
for(let dx=-11;dx<=11;dx++)for(let dy=-11;dy<=11;dy++){
  const r=Math.hypot(dx,dy);if(r>10.4)continue;
  const a=Math.atan2(dy,dx);const s=(a+Math.PI)/(2*Math.PI)*16;
  let b;
  if(r>9.5)b=GOLD;
  else if(r>8.4)b=(s-Math.floor(s)<0.2)?GOLD:COPPER;
  else if(r>5.8)b=(Math.floor(s)%2===0)?RED:OBSIDIAN;
  else if(r>4.6)b=GOLD;
  else if(r>1.6)b=(Math.abs(Math.sin(4*a))*r<0.75)?GOLD:BLACK;
  else b=GOLD;
  block(dx,CY+dy,7,b);
  block(dx,CY+dy,8,r>9.5?GOLD:BROWN);
  if(r>9.6)block(dx,CY+dy,6,GOLD);
}
// hub + crystal
block(0,CY,6,GOLD);block(-1,CY,6,GOLD);block(1,CY,6,GOLD);block(0,CY-1,6,GOLD);block(0,CY+1,6,GOLD);
block(0,CY,5,NEON_BLUE);
line(0,CY,9,0,CY,10,IRON);
// brass struts from deck to the disc
line(-4,2,5,-6,8,6,GOLD);
line(4,2,5,6,8,6,GOLD);

// ---------- Velvet chair ----------
cube(-2,2,0,2,2,3,BROWN);
line(-2,2,0,2,2,0,GOLD);
cube(-2,3,0,2,3,3,RED);
cube(-2,2,4,2,3,5,BROWN);
cube(-2,4,4,2,11,5,RED);
for(const y of [5,7,9])for(const x of [-1,1])block(x,y,4,BROWN);
for(const y of [6,8,10])block(0,y,4,BROWN);
for(const sx of [-3,3]){
  line(sx,2,4,sx,12,4,GOLD);
  line(sx,2,0,sx,2,3,BROWN);
  cube(sx,3,0,sx,4,3,RED);
  line(sx,5,-1,sx,5,3,BROWN);
  line(sx,2,-1,sx,4,-1,GOLD);
}
line(-3,12,4,3,12,4,GOLD);
line(-2,12,5,2,12,5,BROWN);
block(0,13,4,GOLD);block(-2,13,4,GOLD);block(2,13,4,GOLD);

// ---------- Control console + date indicator ----------
cube(-1,2,-3,1,3,-3,BROWN);
cube(-2,4,-4,2,4,-2,BROWN);
block(-1,4,-4,WHITE);block(0,4,-4,WHITE);block(1,4,-4,WHITE);
block(-2,4,-4,GOLD);block(2,4,-4,GOLD);
line(-2,5,-4,1,5,-4,GOLD);
block(-1,5,-3,COPPER);block(0,5,-3,IRON);
line(2,5,-3,2,8,-1,IRON);
block(2,9,-1,NEON_BLUE);

// ---------- Crystal rods + brass rails ----------
for(const sx of [-4,4]){
  line(sx,2,-5,sx,4,-5,GOLD);
  block(sx,5,-5,ICE);block(sx,6,-5,ICE);block(sx,7,-5,GOLD);
  line(sx,4,-4,sx,4,3,GOLD);
  line(sx,2,-1,sx,3,-1,GOLD);
  line(sx,2,3,sx,3,3,GOLD);
}

// ---------- Temporal crackle ----------
block(-11,CY,6,ELECTRIC);
block(11,CY,6,ELECTRIC);
block(0,CY+12,7,ELECTRIC);
block(-8,CY+8,6,ELECTRIC);
block(8,CY-7,5,ELECTRIC);

// ---------- Grandfather clock (west) ----------
cube(-12,0,4,-8,1,6,BROWN);
cube(-11,2,4,-9,7,6,BROWN);
line(-10,3,4,-10,6,4,GLASS);
block(-10,3,5,GOLD);line(-10,4,5,-10,6,5,IRON);
cube(-12,8,4,-8,12,6,BROWN);
for(let x=-12;x<=-8;x++)for(let y=8;y<=12;y++){
  const border=(x===-12||x===-8||y===8||y===12);
  block(x,y,4,border?GOLD:WHITE);
}
block(-10,10,4,BLACK);block(-10,11,4,BLACK);block(-9,10,4,BLACK);
cube(-11,13,4,-9,13,6,BROWN);
block(-12,13,5,GOLD);block(-8,13,5,GOLD);block(-10,14,5,GOLD);

// ---------- Bookshelf (east, back) ----------
cube(8,0,8,12,9,9,BROWN);
const BOOKS=[RED,BLUE,GREEN,BROWN,PURPLE,BLACK,ORANGE,CYAN];
for(const y of [1,2,4,5,7,8])for(let x=9;x<=11;x++){
  const h=Math.abs((x*73+y*151)%17);
  if(h<2)continue;
  block(x,y,8,BOOKS[h%BOOKS.length]);
}
line(8,10,8,12,10,8,GOLD);
block(10,10,9,MARBLE);block(10,11,9,MARBLE);

// ---------- Workbench with model time machine ----------
cube(7,3,1,12,3,4,PLANKS);
for(const [x,z] of [[7,1],[12,1],[7,4],[12,4]])line(x,0,z,x,2,z,OAK_LOG);
line(7,1,1,12,1,1,OAK_LOG);line(7,1,4,12,1,4,OAK_LOG);
// tiny model
line(8,4,1,8,4,2,GOLD);line(10,4,1,10,4,2,GOLD);
block(9,4,1,RED);block(9,5,2,RED);block(9,4,3,GOLD);
block(9,5,3,COPPER);block(8,6,3,COPPER);block(9,6,3,GOLD);block(10,6,3,COPPER);block(9,7,3,COPPER);
// lamp
block(12,4,4,GOLD);block(12,5,4,GOLD);block(12,6,4,GLOWSTONE);
// copper kettle + steam
block(11,4,2,COPPER);block(11,5,2,COPPER);block(12,4,1,GLASS);
block(11,6,2,STEAM);
// books and papers
block(7,4,3,RED);block(7,5,3,BLUE);block(7,6,3,GREEN);
block(8,4,4,WHITE);block(9,4,4,WHITE);

// ---------- Brass telescope on tripod (west front) ----------
line(-10,0,-7,-9,3,-6,BROWN);
line(-8,0,-7,-9,3,-6,BROWN);
line(-9,0,-4,-9,3,-6,BROWN);
block(-9,4,-6,GOLD);
line(-11,3,-4,-7,7,-8,GOLD);
line(-10,3,-4,-7,6,-8,COPPER);
block(-11,3,-4,BLACK);block(-7,7,-8,GLASS);

// ---------- Globe on stand (east front) ----------
disk(10,0,-7,1,BROWN);
line(10,1,-7,10,1,-7,BROWN);
sphere(10,4,-7,2,BLUE);
for(const p of [[9,5,-9],[10,5,-9],[10,4,-9],[11,3,-9],[8,4,-8],[12,5,-7],[9,6,-7],[11,2,-8],[8,3,-6]])block(p[0],p[1],p[2],GREEN);
block(10,7,-7,GOLD);block(10,1,-7,GOLD);

// ---------- Side table with candle + pocket watch ----------
line(6,0,-7,6,2,-7,BROWN);
cube(5,3,-8,7,3,-6,BROWN);
block(5,4,-8,WHITE);block(5,5,-8,FIRE);
block(7,4,-6,GLASS);block(7,5,-6,GLASS);
block(6,4,-7,GOLD);

// ---------- Gas lamp posts ----------
for(const sx of [-11,11]){
  block(sx,0,11,BLACK);
  line(sx,1,11,sx,8,11,BLACK);
  block(sx,9,11,GLOWSTONE);
  block(sx-1,9,11,GLASS);block(sx+1,9,11,GLASS);block(sx,9,10,GLASS);
  block(sx,10,11,BLACK);block(sx,11,11,GOLD);
}

// ---------- Back balustrade ----------
for(let x=-12;x<=12;x++){block(x,0,12,BRICK);block(x,1,12,MARBLE);}
line(-12,2,12,12,2,12,MARBLE);
for(let x=-12;x<=12;x+=4){line(x,0,12,x,3,12,BRICK);block(x,4,12,GOLD);}