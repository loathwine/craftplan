// cyber-samurai-haiku55 — prompt:
// a cyberpunk samurai with a neon katana...

cube(-5,0,-5,5,14,5,AIR);
cube(-5,-3,-5,5,-2,5,STONE);
cube(-5,-1,-5,5,-1,5,OBSIDIAN);
line(-5,-1,-5,5,-1,-5,NEON_BLUE);
line(-5,-1,5,5,-1,5,NEON_BLUE);
line(-5,-1,-5,-5,-1,5,NEON_BLUE);
line(5,-1,-5,5,-1,5,NEON_BLUE);
for (const [x,z] of [[-5,-5],[5,-5],[-5,5],[5,5]]) {
  line(x,0,z,x,4,z,OBSIDIAN);
  block(x,5,z,GLOWSTONE);
}

function tower(x1,z1,x2,z2,top,stripe){
  cube(x1,-2,z1,x2,top,z2,GRAY);
  for (let y=4;y<top;y+=4) line(x1,y,z1,x2,y,z1,stripe);
  const cx=Math.floor((x1+x2)/2), cz=Math.floor((z1+z2)/2);
  line(cx,top+1,cz,cx,top+2,cz,stripe);
}
tower(-18,12,-16,14,14,CYAN);
tower(-13,10,-11,12,20,CYAN);
tower(-10,18,-8,20,26,MAGENTA);
tower(-7,13,-5,15,28,MAGENTA);
tower(0,17,2,19,28,CYAN);
tower(4,11,6,13,24,CYAN);
tower(10,9,12,11,16,MAGENTA);
tower(13,18,15,20,26,CYAN);
tower(16,13,18,15,22,MAGENTA);

cube(-2,0,-1,-1,5,0,BLACK);
cube(1,0,-1,2,5,0,BLACK);
cube(-4,6,-2,4,9,1,BLACK);
line(-4,6,-2,4,6,-2,PURPLE);
line(-2,7,-2,-2,9,-2,PURPLE);
line(0,7,-2,0,9,-2,PURPLE);
line(2,7,-2,2,9,-2,PURPLE);
cube(-3,10,-2,3,17,1,BLACK);
cube(-3,10,-2,3,10,1,GOLD);
cube(-2,11,-3,2,16,-3,IRON);
line(-2,11,-3,-2,16,-3,GOLD);
line(2,11,-3,2,16,-3,GOLD);
block(0,13,-3,NEON_BLUE);
block(0,14,-3,NEON_BLUE);
cube(4,15,-2,6,17,1,PURPLE);
cube(-6,15,-2,-4,17,1,PURPLE);
line(4,17,-2,6,17,-2,NEON_BLUE);
line(-6,17,-2,-4,17,-2,NEON_BLUE);
cube(-5,11,-1,-4,14,0,BLACK);
cube(-5,9,-1,-4,10,0,IRON);
cube(4,13,-1,5,14,0,BLACK);
block(5,12,-1,BLACK);
block(5,12,-2,IRON);
block(5,11,-2,BLACK);
cube(4,13,-2,6,13,-2,GOLD);
line(-4,9,-3,-1,2,-3,PURPLE);
block(-4,9,-3,GOLD);
line(6,14,-2,11,27,-2,NEON_BLUE);
line(7,14,-2,12,27,-2,NEON_BLUE);
block(11,28,-2,NEON_BLUE);
cube(-2,18,-2,2,21,1,BLACK);
cube(-2,22,-2,2,22,1,PURPLE);
cube(-2,18,-3,2,21,-3,IRON);
line(-2,20,-3,2,20,-3,NEON_RED);
line(0,23,-1,-4,28,-1,GOLD);
line(0,23,-1,4,28,-1,GOLD);
block(-4,28,-1,NEON_BLUE);
block(4,28,-1,NEON_BLUE);
cube(-1,14,2,0,21,3,BLACK);
cube(-1,12,2,0,13,3,MAGENTA);
block(13,27,-2,ELECTRIC);
block(12,23,-4,ELECTRIC);
block(8,20,-4,ELECTRIC);