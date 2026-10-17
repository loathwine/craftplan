// grim-reaper-haiku55 — prompt:
// the Grim Reaper with his scythe...

cube(-10,0,-4,10,33,6,AIR);
cube(-6,-2,-3,6,-1,6,COBBLE);

cube(-4,0,0,4,3,5,BLACK);
cube(-3,4,0,3,8,5,BLACK);
cube(-3,9,1,3,15,4,BLACK);
block(-4,0,0,AIR); block(3,0,0,AIR); block(-4,0,4,AIR); block(4,0,5,AIR); block(-1,0,0,AIR); block(1,0,5,AIR);
line(-4,3,0,4,3,0,GRAY);
line(-3,4,0,3,4,0,GRAY); block(0,4,0,GOLD);
line(-2,5,0,-2,8,0,GRAY); line(2,5,0,2,8,0,GRAY);
line(-2,9,1,-2,15,1,GRAY); line(2,9,1,2,15,1,GRAY);

cube(-1,10,1,1,14,1,AIR);
line(-1,10,1,1,10,1,WHITE); line(-1,12,1,1,12,1,WHITE); line(-1,14,1,1,14,1,WHITE);
line(0,10,2,0,14,2,WHITE);

cube(-4,14,1,-3,15,4,BLACK);
cube(3,14,1,4,15,4,BLACK);
cube(-6,8,1,-5,13,3,BLACK);
cube(-5,13,1,-4,14,3,BLACK);
cube(-6,6,1,-5,7,2,WHITE);
line(-6,5,1,-5,5,1,WHITE);
cube(5,12,1,6,14,3,BLACK);

cube(-2,16,0,2,21,4,BLACK);
cube(0,22,1,0,22,3,BLACK);
cube(-1,17,1,1,20,3,MARBLE);
cube(-1,17,0,1,20,0,AIR);
block(-1,19,1,NEON_RED); block(1,19,1,NEON_RED);
line(-1,20,1,1,20,1,BLACK);
block(0,18,1,BLACK);
line(-1,17,1,1,17,1,BLACK);

const arc = (cx, cy, z, r, a0, a1, id) => {
  for (let d = a0; d <= a1; d += 0.5) {
    const t = d * Math.PI / 180;
    block(Math.round(cx + r * Math.cos(t)), Math.round(cy + r * Math.sin(t)), z, id);
  }
};
line(9,0,2,7,26,2,OAK_LOG);
arc(1,24,2,7,10,200,IRON);
arc(1,24,2,6,10,200,IRON);
cube(7,12,1,8,13,2,WHITE);

block(-3,0,-2,WHITE); block(4,0,-2,WHITE); block(-1,0,-3,WHITE);
line(5,0,-1,6,0,-1,WHITE);
block(-5,1,-2,FIRE); block(5,1,-2,FIRE);

const tomb = (x, z) => {
  cube(x, -2, z, x + 1, -1, z, STONE);
  cube(x, 0, z, x + 1, 3, z, COBBLE);
  block(x, 4, z, COBBLE);
};
tomb(-14,6); tomb(-9,9); tomb(10,8); tomb(14,2);
block(-9,5,9,FIRE); block(10,5,8,FIRE);

line(-12,0,11,-12,12,11,OAK_LOG);
line(-12,9,11,-16,14,11,OAK_LOG);
line(-12,11,11,-8,15,11,OAK_LOG);
line(-16,14,11,-18,17,11,OAK_LOG);
line(-8,15,11,-6,18,11,OAK_LOG);
line(13,0,12,13,11,12,OAK_LOG);
line(13,8,12,18,13,12,OAK_LOG);
line(13,10,12,9,14,12,OAK_LOG);
line(9,14,12,8,17,12,OAK_LOG);
line(18,13,12,20,16,12,OAK_LOG);

for (let x = -20; x <= -8; x++) {
  for (let y = 22; y <= 33; y++) {
    const d = Math.hypot(x + 14, y - 28);
    const e = Math.hypot(x + 12, y - 29.5);
    if (d <= 3.2 && e > 2.8) block(x, y, 20, MARBLE);
  }
}
const stars = [[-18,30],[-4,32],[6,30],[16,28],[20,33],[-20,24],[-2,27],[12,33],[18,24],[-9,33]];
for (const [sx, sy] of stars) block(sx, sy, 21, WHITE);