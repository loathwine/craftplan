// forge-sonnet55 — prompt:
// a blacksmith's forge...

// A blacksmith's forge: open-fronted timber-and-stone smithy, giant brick hearth + chimney, kiln, well, cart, lean-to
const H=(x,y,z)=>{let n=Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(z,1274126177);n=Math.imul(n^(n>>>13),1274126177);return (n^(n>>>16))>>>0;};
const stone=(x,y,z)=>{const r=H(x,y,z)%10;return r<5?COBBLE:r<8?STONE:r<9?GRAY:LIGHT_GRAY;};

// ---------- clear site ----------
cube(-21,0,-14,20,10,12,AIR);

// ---------- foundation, floor, apron ----------
cube(-10,-2,-5,10,-2,-5,COBBLE); cube(-10,-2,8,10,-2,8,COBBLE);
cube(-10,-2,-5,-10,-2,8,COBBLE); cube(10,-2,-5,10,-2,8,COBBLE);
for(let x=-10;x<=10;x++) for(let z=-5;z<=8;z++){
  const d=(x+1)*(x+1)+z*z;
  let b=((x+z)&1)?GRAY:COBBLE;
  if(d<=8) b=((x+z)&1)?BLACK:GRAY;
  block(x,-1,z,b);
}
for(let x=-9;x<=9;x++) for(let z=-12;z<=-6;z++){
  let b=stone(x,-1,z);
  if(Math.abs(x)<=1) b=((x+z)&1)?BRICK:COBBLE;
  block(x,-1,z,b);
}

// ---------- walls ----------
for(let x=-10;x<=10;x++) for(let y=0;y<=7;y++){
  block(x,y,8,y<=4?stone(x,y,8):PLANKS);
}
for(let z=-3;z<=7;z++) for(let y=0;y<=7;y++){
  // west wall
  let b=y<=3?stone(-10,y,z):PLANKS;
  if(y>=4&&y<=5&&(z===-2||z===-1||z===3||z===4)) b=GLASS;
  block(-10,y,z,b);
  // east wall with door gap
  if(z>=0&&z<=2&&y<=3) continue;
  b=y<=3?stone(10,y,z):PLANKS;
  if(y>=4&&y<=5&&(z===5||z===6)) b=GLASS;
  block(10,y,z,b);
}
// east door frame
cube(10,0,-1,10,3,-1,OAK_LOG); cube(10,0,3,10,3,3,OAK_LOG); cube(10,4,-1,10,4,3,OAK_LOG);
// front half-walls in end bays
for(let y=0;y<=1;y++) for(let x=-9;x<=-6;x++){ block(x,y,-4,stone(x,y,-4)); block(x+15,y,-4,stone(x+15,y,-4)); }
// posts + beams
for(const x of [-10,-5,5,10]) cube(x,0,-4,x,7,-4,OAK_LOG);
for(const x of [-10,-5,0,5,10]) cube(x,0,8,x,7,8,OAK_LOG);
cube(-10,0,2,-10,7,2,OAK_LOG); cube(10,0,2,10,7,2,OAK_LOG);
cube(-10,7,-4,10,7,-4,OAK_LOG); cube(-10,7,8,10,7,8,OAK_LOG);
cube(-10,7,-4,-10,7,8,OAK_LOG); cube(10,7,-4,10,7,8,OAK_LOG);

// ---------- roof ----------
for(let k=0;k<=7;k++){
  const y=8+k;
  for(let x=-11;x<=11;x++){
    let c=(((x+k)%3)+3)%3===0?BLACK:GRAY;
    if(x===-11||x===11) c=OAK_LOG;
    const cf=(k===0)?OAK_LOG:c;
    block(x,y,-5+k,cf); block(x,y,-4+k,c);
    block(x,y,9-k,cf); block(x,y,8-k,c);
  }
}
cube(-11,16,2,11,16,2,BRICK);
// gable ends
for(const x of [-10,10]){
  for(let k=0;k<=5;k++) cube(x,8+k,-3+k,x,8+k,7-k,PLANKS);
  cube(x,10,1,x,11,3,GLASS);
}
// trusses
for(const x of [-10,-5,0,5,10]){
  cube(x,8,-3,x,8,7,OAK_LOG);
  cube(x,9,2,x,14,2,OAK_LOG);
  line(x,13,2,x,9,-2,OAK_LOG);
  line(x,13,2,x,9,6,OAK_LOG);
}
// weathervane
cube(-6,17,2,-6,20,2,IRON); line(-8,19,2,-4,19,2,IRON); block(-4,19,2,GOLD); block(-6,21,2,GOLD);

// ---------- great hearth ----------
cube(-5,0,4,5,2,7,BRICK);
for(let x=-5;x<=5;x++) for(let y=0;y<=2;y++) if(H(x,y,4)%4===0) block(x,y,4,COBBLE);
cube(-5,3,4,5,3,7,BRICK);
cube(-4,3,5,4,3,6,AIR);
cube(-3,2,5,3,2,6,LAVA);
cube(-5,4,4,-5,5,7,BRICK); cube(5,4,4,5,5,7,BRICK); cube(-5,4,7,5,5,7,BRICK);
cube(-5,6,4,5,6,8,BRICK); cube(-5,6,4,5,6,4,IRON);
cube(-4,7,5,4,7,8,BRICK);
cube(-3,8,6,3,8,8,BRICK);
cube(-2,9,6,2,9,8,BRICK);
for(let y=10;y<=22;y++) cube(-2,y,6,2,y,8,(y%5===0)?COBBLE:BRICK);
cube(-1,10,7,1,22,7,AIR);
cube(-3,23,5,3,23,9,COBBLE); cube(-1,23,7,1,23,7,AIR);
block(-2,3,5,FIRE); block(0,3,5,FIRE); block(2,3,5,FIRE);
block(-1,4,6,FIRE); block(1,4,6,FIRE); block(0,5,6,FIRE);
block(0,24,7,FIRE);
block(-5,1,6,IRON);
// tools on hearth pillars
line(-5,5,3,-5,3,3,IRON); line(5,5,3,5,3,3,IRON);
block(-4,3,3,IRON); block(4,3,3,IRON);

// ---------- bellows ----------
for(const x of [-9,-6]) for(const z of [5,7]) block(x,0,z,OAK_LOG);
cube(-9,1,5,-6,1,7,PLANKS);
for(let i=0;i<4;i++){ const x=-6-i; cube(x,2+i,5,x,2+i,7,PLANKS); }
for(const z of [5,7]) for(let i=0;i<3;i++){ const x=-7-i; cube(x,2,z,x,2+i,z,BROWN); }
block(-9,6,6,OAK_LOG); block(-9,7,6,OAK_LOG); block(-8,7,6,OAK_LOG);

// ---------- anvil on stump ----------
const AX=-1;
cube(AX-1,0,-1,AX+1,2,0,OAK_LOG);
cube(AX-1,3,-1,AX+1,3,0,GRAY);
block(AX,4,-1,IRON); block(AX,4,0,IRON);
cube(AX-2,5,-1,AX+1,5,0,IRON);
block(AX+2,5,-1,IRON); block(AX+2,5,0,IRON); block(AX+3,5,-1,IRON);
line(AX-1,6,-1,AX+1,6,-1,ORANGE); block(AX+1,6,-1,LAVA);

// ---------- quench trough ----------
cube(4,0,-3,9,1,0,OAK_LOG);
cube(5,1,-2,8,1,-1,WATER);

// ---------- workbench, rack, ingots ----------
cube(6,2,3,9,2,4,PLANKS);
for(const x of [6,9]) for(const z of [3,4]) cube(x,0,z,x,1,z,OAK_LOG);
block(9,3,3,IRON); block(9,3,4,IRON);
block(7,3,4,OAK_LOG); block(8,3,4,OAK_LOG); block(6,3,4,IRON);
line(7,3,3,8,3,3,IRON);
cube(8,0,5,9,0,6,IRON); cube(8,1,5,8,1,6,IRON); block(9,1,5,GOLD);
const sword=(x,y0)=>{block(x,y0,7,BROWN);block(x,y0+1,7,GOLD);line(x,y0+2,7,x,y0+5,7,IRON);};
sword(6,1); sword(8,1);
line(7,1,7,7,5,7,OAK_LOG); block(7,5,6,IRON); block(7,4,6,IRON);
line(9,1,7,9,6,7,OAK_LOG); block(9,7,7,IRON);

// ---------- grindstone ----------
for(let y=0;y<=4;y++) for(let z=0;z<=4;z++){
  const d=(y-2)*(y-2)+(z-2)*(z-2);
  if(d<=4.2) for(const x of [-9,-8]) block(x,y,z,d>=3?GRAY:LIGHT_GRAY);
}
block(-7,2,2,IRON); block(-7,3,2,OAK_LOG);
cube(-7,0,0,-7,1,0,OAK_LOG); cube(-7,0,4,-7,1,4,OAK_LOG);
// horseshoes
for(const p of [[1,6],[2,6],[3,6],[1,5],[3,5]]) block(-9,p[1],p[0],IRON);

// ---------- coal pile ----------
for(let x=-9;x<=-6;x++) for(let z=-3;z<=-1;z++){
  const d=Math.hypot(x+7.5,z+2); const h=Math.round(3.2-1.1*d);
  for(let y=0;y<h;y++) block(x,y,z,(H(x,y,z)%6===0)?OBSIDIAN:BLACK);
}

// ---------- hanging lamps ----------
for(const p of [[-5,1],[5,1],[0,3]]){
  block(p[0],7,p[1],IRON); block(p[0],6,p[1],IRON); block(p[0],5,p[1],GLOWSTONE);
}

// ---------- sign + front torches ----------
cube(-10,1,-5,-6,5,-5,PLANKS);
cube(-10,1,-5,-6,1,-5,OAK_LOG); cube(-10,5,-5,-6,5,-5,OAK_LOG);
cube(-10,1,-5,-10,5,-5,OAK_LOG); cube(-6,1,-5,-6,5,-5,OAK_LOG);
cube(-9,4,-6,-7,4,-6,BLACK); block(-8,3,-6,BLACK); cube(-9,2,-6,-7,2,-6,BLACK);
for(const x of [-10,-6]){ block(x,7,-5,OAK_LOG); block(x,6,-5,IRON); }
for(const x of [-5,5,10]){ block(x,4,-5,IRON); block(x,5,-5,FIRE); }

// ---------- kiln / bloomery ----------
const KX=16,KZ=2;
cube(11,-1,0,12,-1,2,COBBLE);
for(let dx=-5;dx<=5;dx++) for(let dz=-5;dz<=5;dz++) if(dx*dx+dz*dz<=20) block(KX+dx,-1,KZ+dz,stone(KX+dx,-1,KZ+dz));
for(let y=0;y<=11;y++){
  const r=3.4-y*0.18;
  for(let dx=-4;dx<=4;dx++) for(let dz=-4;dz<=4;dz++){
    const d2=dx*dx+dz*dz;
    if(d2<=r*r){
      let b=(y%4===3||H(KX+dx,y,KZ+dz)%5===0)?COBBLE:BRICK;
      if((y===4||y===9)&&d2>(r-1)*(r-1)) b=IRON;
      block(KX+dx,y,KZ+dz,b);
    }
  }
}
cube(15,0,-1,17,1,0,AIR);
cube(15,0,0,17,0,0,LAVA); block(16,1,0,FIRE);
cube(15,2,-1,17,2,-1,IRON);
block(16,-1,-1,LAVA); block(16,-1,-2,ORANGE);
for(const x of [14,15,17,18]) block(x,0,-3,IRON);
block(16,12,KZ,OBSIDIAN);

// ---------- well ----------
cube(13,-1,-9,15,1,-7,COBBLE);
cube(14,0,-8,14,1,-8,AIR); block(14,0,-8,WATER);
for(const x of [13,15]) for(const z of [-9,-7]) cube(x,2,z,x,4,z,OAK_LOG);
cube(13,4,-8,15,4,-8,OAK_LOG);
cube(12,5,-10,16,5,-6,PLANKS); cube(13,6,-9,15,6,-7,PLANKS); cube(14,7,-8,14,7,-8,PLANKS);
block(14,3,-8,IRON); block(14,2,-8,BROWN);

// ---------- ore cart ----------
cube(5,1,-12,9,1,-9,PLANKS);
for(let x=5;x<=9;x++) for(let z=-12;z<=-9;z++) if(x===5||x===9||z===-12||z===-9) block(x,2,z,OAK_LOG);
for(let x=6;x<=8;x++) for(let z=-11;z<=-10;z++) for(let y=2;y<=3;y++){
  const r=H(x,y,z)%4;
  block(x,y,z,r===0?ORANGE:r===1?BROWN:r===2?BLACK:IRON);
}
for(const x of [4,10]) for(let dy=-1;dy<=1;dy++) for(let dz=-1;dz<=1;dz++){
  block(x,1+dy,-10+dz,(dy===0&&dz===0)?IRON:OAK_LOG);
}

// ---------- barrels ----------
for(const p of [[-7,-11],[-5,-12],[-7,-8]]){
  cube(p[0],0,p[1],p[0]+1,0,p[1]+1,PLANKS);
  cube(p[0],1,p[1],p[0]+1,1,p[1]+1,OAK_LOG);
  block(p[0],2,p[1],IRON);
}

// ---------- yard fence ----------
for(const x of [-9,-7,-5,-3,3,5,7,9]) cube(x,0,-13,x,1,-13,OAK_LOG);
cube(-3,2,-13,-3,2,-13,OAK_LOG); cube(3,2,-13,3,2,-13,OAK_LOG);
cube(-9,1,-13,-3,1,-13,PLANKS); cube(3,1,-13,9,1,-13,PLANKS);
cube(-9,1,-12,-9,1,-6,PLANKS);
for(const z of [-12,-10,-8,-6]) block(-9,0,z,OAK_LOG);

// ---------- lean-to woodshed ----------
for(let x=-17;x<=-11;x++){
  const y=7-Math.floor((-11-x)/2);
  for(let z=-3;z<=7;z++) block(x,y,z,(z%3===0)?OAK_LOG:BROWN);
  cube(x,0,8,x,y-1,8,PLANKS);
}
for(const z of [-3,2,7]) cube(-17,0,z,-17,3,z,OAK_LOG);
for(const z of [-3,7]) cube(-14,0,z,-14,5,z,OAK_LOG);
for(let x=-16;x<=-12;x++) for(let z=3;z<=6;z++) for(let y=0;y<=2;y++){
  block(x,y,z,H(x,y,z)%5===0?PLANKS:OAK_LOG);
}
cube(-15,0,-2,-14,1,-1,OAK_LOG);
block(-15,2,-2,OAK_LOG); block(-15,2,-1,IRON);