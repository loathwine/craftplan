// cyber-samurai-sonnet55 — prompt:
// a cyberpunk samurai with a neon katana...

// Cyberpunk samurai with a neon katana
const R = Math.round;
const box = (x1,y1,z1,x2,y2,z2,id) => cube(Math.min(x1,x2),Math.min(y1,y2),Math.min(z1,z2),Math.max(x1,x2),Math.max(y1,y2),Math.max(z1,z2),id);
const tube = (x1,y1,z1,x2,y2,z2,r,id) => {
  const n = Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1))/2) || 1;
  for (let i=0;i<=n;i++){
    const t=i/n;
    const x=R(x1+(x2-x1)*t), y=R(y1+(y2-y1)*t), z=R(z1+(z2-z1)*t);
    cube(x-r,y-r,z-r,x+r,y+r,z+r,id);
  }
};

// clear trees from the footprint
cube(-12,0,-7,17,9,10,AIR);

// ---------- platform ----------
disk(0,0,0,10,OBSIDIAN);
for (let a=0;a<360;a+=6){
  const rad=a*Math.PI/180;
  block(R(Math.cos(rad)*9.5),0,R(Math.sin(rad)*9.5),NEON_BLUE);
}

// stone lanterns at the front
for (const s of [-1,1]){
  box(7*s,1,-6,7*s,2,-6,GRAY);
  block(7*s,3,-6,GLOWSTONE);
  box(7*s-1,4,-7,7*s+1,4,-5,GRAY);
  block(7*s,5,-6,GRAY);
}

// ---------- background: sun ring ----------
for (let a=0;a<360;a+=5){
  const rad=a*Math.PI/180;
  block(R(Math.cos(rad)*10),R(21+Math.sin(rad)*10),9,MAGENTA);
  block(R(Math.cos(rad)*9),R(21+Math.sin(rad)*9),9,MAGENTA);
}
for (let k=0;k<8;k++){
  const rad=k*45*Math.PI/180;
  block(R(Math.cos(rad)*9.5),R(21+Math.sin(rad)*9.5),8,NEON_RED);
}

// ---------- background: torii gate ----------
for (const s of [-1,1]){
  box(7*s,1,5,8*s,17,6,OBSIDIAN);
  box(6*s,1,4,9*s,2,7,GRAY);
  box(7*s,12,5,8*s,12,6,MAGENTA);
  // hanging lantern
  block(6*s,12,5,IRON);
  block(6*s,11,5,GLOWSTONE);
}
box(-8,13,5,8,14,6,OBSIDIAN);
box(-11,17,5,11,18,6,OBSIDIAN);
box(-12,19,5,12,19,6,OBSIDIAN);
box(-13,20,5,-12,20,6,OBSIDIAN);
box(12,20,5,13,20,6,OBSIDIAN);
box(-6,16,5,6,16,5,NEON_RED);
box(-1,15,5,1,15,5,GOLD);

// ---------- background: city towers ----------
box(-18,0,14,-16,23,16,GRAY);
box(16,0,14,18,17,16,OBSIDIAN);
line(-17,24,15,-17,28,15,IRON);
block(-17,29,15,NEON_RED);
line(17,18,15,17,22,15,IRON);
block(17,23,15,NEON_BLUE);
for (let y=3;y<=21;y+=3){
  for (const x of [-18,-16]) block(x,y,14,((x+y)%2===0)?NEON_BLUE:MAGENTA);
}
for (let y=3;y<=15;y+=3){
  for (const x of [16,18]) block(x,y,14,((x+y)%2===0)?CYAN:MAGENTA);
}

// ---------- legs ----------
for (const s of [-1,1]){
  box(2*s,7,-2,4*s,10,0,BLACK);                 // thigh
  box(1*s,4,-3,5*s,6,1,OBSIDIAN);               // hakama flare
  box(2*s,7,-3,4*s,8,-3,IRON);                  // knee guard
  box(1*s,1,-4,5*s,3,1,BLACK);                  // boot
  box(1*s,3,-4,5*s,3,-4,NEON_BLUE);             // ankle light strip
  box(2*s,1,-5,4*s,2,-5,IRON);                  // toe cap
}
block(-3,5,-4,NEON_BLUE);
block(-3,4,-4,NEON_BLUE);

// ---------- skirt ----------
box(-5,8,-3,5,11,-3,OBSIDIAN);
box(-5,8,3,5,11,3,OBSIDIAN);
box(-5,8,-2,-5,11,2,OBSIDIAN);
box(5,8,-2,5,11,2,OBSIDIAN);
box(-4,11,-2,4,11,2,BLACK);
for (let x=-5;x<=5;x++) block(x,9,-3,(x%2===0)?PURPLE:OBSIDIAN);
box(-5,8,-3,5,8,-3,MAGENTA);

// ---------- torso ----------
box(-4,12,-2,4,20,2,BLACK);
box(-4,12,-3,4,12,3,MAGENTA);                   // obi
box(-1,12,-4,1,12,-4,GOLD);                     // buckle
box(-4,14,-3,4,19,-3,OBSIDIAN);                 // chest plate
line(-4,19,-4,-1,17,-4,NEON_BLUE);
line(4,19,-4,1,17,-4,NEON_BLUE);
block(0,16,-4,GLOWSTONE);
block(0,17,-4,NEON_BLUE);
block(0,15,-4,NEON_BLUE);
block(-1,16,-4,NEON_BLUE);
block(1,16,-4,NEON_BLUE);
line(0,14,-4,0,13,-4,NEON_BLUE);
box(-4,14,-4,-2,14,-4,MAGENTA);
box(2,14,-4,4,14,-4,MAGENTA);
box(-3,20,-2,3,21,2,OBSIDIAN);                  // collar

// ---------- pauldrons ----------
for (const s of [-1,1]){
  box(5*s,21,-3,9*s,21,3,OBSIDIAN);
  box(5*s,20,-3,9*s,20,3,PURPLE);
  box(5*s,19,-3,8*s,19,3,OBSIDIAN);
  box(5*s,18,-2,7*s,18,2,PURPLE);
  box(5*s,20,-4,9*s,20,-4,NEON_BLUE);
  block(7*s,22,0,IRON);
  block(7*s,23,0,IRON);
  block(7*s,24,0,s>0?GOLD:NEON_BLUE);
}

// ---------- left arm (cybernetic) + sheathed blade ----------
tube(-6,19,0,-8,16,-1,1,BLACK);
tube(-8,16,-1,-6,13,-3,1,IRON);
line(-9,15,-1,-7,12,-3,NEON_BLUE);
line(-6,12,-3,-6,9,6,OBSIDIAN);
line(-6,13,-3,-6,10,6,OBSIDIAN);
block(-6,9,6,NEON_BLUE);
block(-6,10,6,NEON_BLUE);
line(-6,13,-4,-6,15,-7,MAGENTA);
block(-6,13,-4,GOLD);

// ---------- neon katana (right hand) ----------
line(3,12,-4,5,16,-4,MAGENTA);
line(4,12,-4,6,16,-4,MAGENTA);
block(3,11,-4,GOLD);
box(5,17,-5,7,17,-3,GOLD);                      // tsuba
line(6,18,-4,15,32,-4,NEON_BLUE);
line(7,18,-4,16,32,-4,NEON_BLUE);
line(6,18,-3,15,32,-3,IRON);                    // spine
block(16,33,-4,NEON_BLUE);
tube(6,19,0,8,17,-2,1,BLACK);
tube(8,17,-2,5,14,-4,1,OBSIDIAN);
box(4,13,-5,5,15,-4,IRON);                      // gauntlet
block(12,24,-5,ELECTRIC);
block(14,29,-5,ELECTRIC);
block(10,21,-5,ELECTRIC);
block(16,31,-5,ELECTRIC);
block(-9,14,-5,ELECTRIC);

// ---------- head ----------
sphere(0,24,0,3.5,OBSIDIAN);
box(-4,21,1,4,23,3,OBSIDIAN);                   // neck guard
box(-2,21,-4,2,23,-4,IRON);                     // mask
for (let x=-2;x<=2;x+=2) block(x,22,-4,BLACK);
box(-3,24,-4,3,24,-4,BLACK);
block(-2,24,-4,NEON_RED);
block(-1,24,-4,NEON_RED);
block(1,24,-4,NEON_RED);
block(2,24,-4,NEON_RED);
box(-3,25,-4,3,25,-4,GOLD);                     // brow
box(-4,26,-4,4,26,-3,PURPLE);                   // brim
for (const s of [-1,1]){
  box(4*s,23,-1,5*s,25,1,IRON);                 // ear modules
  block(5*s,24,0,NEON_BLUE);
  line(1*s,27,-3,5*s,32,-4,GOLD);               // crescent horns
  line(1*s,28,-3,5*s,33,-4,GOLD);
  block(5*s,33,-4,NEON_BLUE);
}
box(0,27,-4,0,29,-4,GOLD);
block(0,30,-4,NEON_RED);
line(-3,27,2,-5,32,3,IRON);                     // antenna
block(-5,33,3,NEON_RED);

// ---------- cape ----------
for (let y=20;y>=5;y--){
  const hw=3+Math.floor((20-y)/6);
  const z=3+Math.floor((20-y)/6);
  for (let x=-hw;x<=hw;x++){
    if (y<8 && (x*7+y*3)%5===0) continue;
    block(x,y,z,(Math.abs(x)===hw||y===5)?MAGENTA:PURPLE);
  }
}