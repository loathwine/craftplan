// dragon-4x-sonnet — sandbox error: none (recovered from stream-json transport)
// --- extracted code ---
function wingPanel(ax,ay,az,bx,by,bz,cx,cy,cz,id,n){
  for(let i=0;i<=n;i++){
    const t=i/n;
    line(ax,ay,az,
      Math.round(bx+(cx-bx)*t),
      Math.round(by+(cy-by)*t),
      Math.round(bz+(cz-bz)*t),id);
  }
}

// ── TAIL ──────────────────────────────────────────────────
sphere(1,6,13,4,COBBLE);
sphere(4,4,17,3,COBBLE);
sphere(7,3,20,2,COBBLE);
sphere(9,2,22,1,COBBLE);
for(let i=0;i<8;i++){
  const t=i/7;
  block(Math.round(9*t),Math.round(11-7*t),Math.round(13+9*t),STONE);
}
line(9,2,22,11,5,22,STONE);

// ── BODY ──────────────────────────────────────────────────
sphere(0,9,7,6,COBBLE);
cube(-3,3,3,3,7,13,STONE);
block(0,15,7,STONE); block(0,16,6,STONE); block(0,15,5,STONE); block(0,14,4,STONE);
for(let z=3;z<=12;z+=2){ block(-6,9,z,STONE); block(6,9,z,STONE); }

// ── NECK ──────────────────────────────────────────────────
sphere(0,13,3,3,COBBLE);
sphere(0,17,-1,3,COBBLE);
sphere(0,20,-5,2,COBBLE);
cube(-1,11,1,1,14,4,STONE);
cube(-1,15,-3,1,18,0,STONE);
block(0,16,3,STONE); block(0,20,1,STONE); block(0,22,-1,STONE); block(0,23,-3,STONE);

// ── HEAD ──────────────────────────────────────────────────
cube(-4,21,-11,4,26,-7,COBBLE);
cube(-5,25,-11,5,27,-8,COBBLE);
cube(-3,20,-18,3,24,-10,COBBLE);
cube(-5,22,-11,5,24,-9,COBBLE);
cube(-3,17,-17,3,20,-10,COBBLE);
cube(-2,19,-17,2,20,-13,AIR);
block(-2,19,-17,STONE); block(0,19,-17,STONE); block(2,19,-17,STONE);
block(-2,20,-17,STONE); block(0,20,-17,STONE); block(2,20,-17,STONE);
block(-1,19,-14,STONE); block(1,19,-14,STONE);
block(-1,20,-14,STONE); block(1,20,-14,STONE);
block(-5,24,-10,GLASS); block(5,24,-10,GLASS);
block(-5,24,-9,GLASS);  block(5,24,-9,GLASS);
block(-5,23,-9,BRICK);  block(5,23,-9,BRICK);
block(-2,21,-18,AIR);   block(2,21,-18,AIR);
line(-2,26,-9,-4,31,-5,STONE); line(-1,26,-9,-2,30,-5,STONE);
line(2,26,-9,4,31,-5,STONE);   line(1,26,-9,2,30,-5,STONE);
cube(-2,17,-15,2,18,-13,STONE);

// ── FIRE BREATH ───────────────────────────────────────────
cube(-1,19,-16,1,20,-14,BRICK);
cube(-2,18,-20,2,21,-18,BRICK);
cube(-1,17,-22,1,22,-20,BRICK);
cylinder(0,17,-22,1,5,ICE);
cube(-2,16,-22,2,22,-22,SAND);
cube(-3,14,-22,3,22,-22,SAND);
cube(-4,13,-22,4,21,-22,SAND);
for(let i=0;i<5;i++){
  const wx=Math.round((i-2)*2);
  block(wx,23,-22,SAND); block(wx,24,-22,SAND);
}
cube(-3,0,-22,3,0,-20,BRICK);
cube(-4,0,-22,4,0,-22,SAND);

// ── RIGHT WING ────────────────────────────────────────────
line(5,12,4, 21,28,-8, COBBLE);
line(5,12,4, 22,22,3,  COBBLE);
line(5,12,4, 19,16,12, COBBLE);
line(5,12,4, 14,11,16, COBBLE);
wingPanel(5,12,4, 21,28,-8, 22,22,3,  PLANKS,16);
wingPanel(5,12,4, 22,22,3,  19,16,12, PLANKS,14);
wingPanel(5,12,4, 19,16,12, 14,11,16, PLANKS,10);
line(21,28,-8, 22,22,3,  COBBLE);
line(22,22,3,  19,16,12, COBBLE);
line(19,16,12, 14,11,16, COBBLE);

// ── LEFT WING ─────────────────────────────────────────────
line(-5,12,4, -21,28,-8, COBBLE);
line(-5,12,4, -22,22,3,  COBBLE);
line(-5,12,4, -19,16,12, COBBLE);
line(-5,12,4, -14,11,16, COBBLE);
wingPanel(-5,12,4, -21,28,-8, -22,22,3,  PLANKS,16);
wingPanel(-5,12,4, -22,22,3,  -19,16,12, PLANKS,14);
wingPanel(-5,12,4, -19,16,12, -14,11,16, PLANKS,10);
line(-21,28,-8, -22,22,3,  COBBLE);
line(-22,22,3,  -19,16,12, COBBLE);
line(-19,16,12, -14,11,16, COBBLE);

// ── FRONT LEGS (rearing) ──────────────────────────────────
line(4,7,4, 8,13,0, COBBLE); line(5,7,4, 9,13,0, COBBLE);
line(8,13,0, 10,8,-4, COBBLE); line(9,13,0, 11,8,-4, COBBLE);
block(10,7,-4,STONE); block(11,6,-5,STONE); block(12,5,-6,STONE);
block(9,7,-5,STONE);  block(10,6,-6,STONE);
block(11,7,-3,STONE); block(12,6,-4,STONE);
line(-4,7,4, -8,13,0, COBBLE); line(-5,7,4, -9,13,0, COBBLE);
line(-8,13,0, -10,8,-4, COBBLE); line(-9,13,0, -11,8,-4, COBBLE);
block(-10,7,-4,STONE); block(-11,6,-5,STONE); block(-12,5,-6,STONE);
block(-9,7,-5,STONE);  block(-10,6,-6,STONE);
block(-11,7,-3,STONE); block(-12,6,-4,STONE);

// ── BACK LEGS ─────────────────────────────────────────────
line(4,5,10, 6,0,15, COBBLE); line(5,5,10, 7,0,15, COBBLE); line(6,5,10, 8,0,15, COBBLE);
cube(5,0,14, 9,0,16, COBBLE);
block(5,0,17,STONE); block(6,0,17,STONE); block(7,0,17,STONE);
block(8,0,16,STONE); block(9,0,15,STONE);
line(-4,5,10, -6,0,15, COBBLE); line(-5,5,10, -7,0,15, COBBLE); line(-6,5,10, -8,0,15, COBBLE);
cube(-9,0,14, -5,0,16, COBBLE);
block(-5,0,17,STONE); block(-6,0,17,STONE); block(-7,0,17,STONE);
block(-8,0,16,STONE); block(-9,0,15,STONE);

// --- raw stdout ---
/*
*/
