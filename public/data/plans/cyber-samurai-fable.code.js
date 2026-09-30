// cyber-samurai-fable — prompt:
// a cyberpunk samurai with a neon katana...

cube(-14,0,-9,14,9,12,AIR);

// platform
disk(0,-1,0,10,CYAN);
disk(0,-1,0,9,OBSIDIAN);
disk(0,-1,0,2,IRON);
for (let i = 0; i < 8; i++) {
  const a = i * Math.PI / 4;
  block(Math.round(Math.cos(a) * 6), -1, Math.round(Math.sin(a) * 6), NEON_BLUE);
}
block(-7,-1,-6,WATER); block(-8,-1,-5,WATER); block(6,-1,-7,WATER); block(7,-1,-6,WATER); block(7,-1,-7,WATER);

// legs (wide stance)
cube(-6,0,-1,-4,2,1,BLACK);
cube(2,0,-1,4,2,1,BLACK);
cube(-6,3,-1,-4,8,1,GRAY);
cube(2,3,-1,4,8,1,GRAY);
cube(-6,5,-2,-4,6,-2,IRON);
cube(2,5,-2,4,6,-2,IRON);
line(-7,3,0,-7,8,0,BLACK);
line(5,3,0,5,8,0,BLACK);
block(-7,4,0,NEON_BLUE); block(-7,7,0,NEON_BLUE);
block(5,4,0,NEON_BLUE); block(5,7,0,NEON_BLUE);
block(-5,1,-2,CYAN); block(3,1,-2,CYAN);

// faulds / hip armor
cube(-7,9,-2,5,11,2,RED);
cube(-7,10,-3,5,10,-3,BLACK);
cube(-7,9,-3,5,9,-3,RED);
cube(-7,11,-3,5,11,-3,BLACK);
line(-7,9,-3,-7,11,-3,GOLD); line(5,9,-3,5,11,-3,GOLD); line(-1,9,-3,-1,11,-3,GOLD);
cube(-3,12,-1,1,12,1,GOLD); // obi belt

// torso
cube(-4,12,-2,3,19,2,BLACK);
cube(-3,13,-3,2,18,-3,IRON);
line(-3,13,-3,-3,18,-3,CYAN);
line(2,13,-3,2,18,-3,CYAN);
block(-1,15,-3,NEON_BLUE); block(0,15,-3,NEON_BLUE);
line(-1,13,-4,0,13,-4,GRAY);
cube(-3,13,3,2,18,3,GRAY);
line(-1,13,3,0,18,3,RED);

// sheath (saya) on left hip
line(-8,10,-3,-8,10,6,BLACK);
line(-8,9,3,-8,9,6,BLACK);
block(-8,10,-3,GOLD);

// shoulders (sode)
cube(-9,17,-3,-5,20,3,RED);
cube(4,17,-3,8,20,3,RED);
cube(-9,21,-2,-5,21,2,BLACK);
cube(4,21,-2,8,21,2,BLACK);
line(-9,17,-4,-5,17,-4,GOLD);
line(4,17,-4,8,17,-4,GOLD);
line(-9,19,-4,-5,19,-4,GOLD);
line(4,19,-4,8,19,-4,GOLD);
block(-9,22,0,IRON); block(-10,22,0,IRON); block(-10,23,0,IRON);
block(8,22,0,IRON); block(9,22,0,IRON); block(9,23,0,IRON);

// left arm hanging
cube(-9,10,-1,-7,16,1,BLACK);
cube(-9,12,-2,-7,12,-2,IRON);
cube(-9,9,-1,-7,9,1,GRAY);
block(-9,9,-2,GRAY);

// right arm raised east with katana
cube(4,16,-1,10,18,1,BLACK);
cube(9,17,-1,11,23,1,BLACK);
line(9,19,-2,11,19,-2,IRON); line(9,21,-2,11,21,-2,IRON);
cube(9,24,-1,11,26,1,GRAY);
block(12,25,0,GRAY);

// katana
cube(9,27,-1,11,27,1,GOLD); // tsuba
cube(10,23,0,10,26,0,PURPLE);
line(10,28,0,10,33,-12,NEON_BLUE);
line(10,28,-1,10,33,-13,NEON_BLUE);
line(11,28,0,11,33,-12,IRON);
line(9,28,0,9,33,-12,IRON);
line(10,29,1,10,33,-10,IRON);

// neck + head
cube(-2,20,-1,1,20,1,GRAY);
cube(-3,21,-2,2,26,2,BLACK);
cube(-3,21,-3,2,23,-3,IRON);
line(-3,22,-3,2,22,-3,GRAY);
block(-2,24,-3,NEON_RED); block(1,24,-3,NEON_RED);
block(-1,24,-3,BLACK); block(0,24,-3,BLACK);
cube(-3,21,3,2,26,3,GRAY);

// kabuto helmet
cube(-4,25,-3,3,27,3,BLACK);
cube(-5,25,-4,4,25,4,GRAY);
cube(-3,28,-2,2,28,2,BLACK);
cube(-2,29,-1,1,29,1,IRON);
cube(-5,23,1,4,24,4,RED);
line(-5,23,-1,-5,24,0,RED); line(4,23,-1,4,24,0,RED);
line(-4,26,-4,3,26,-4,GOLD);
block(-1,26,-4,NEON_BLUE); block(0,26,-4,NEON_BLUE);
block(-2,27,-4,NEON_BLUE); block(1,27,-4,NEON_BLUE);
line(-1,28,-3,-6,33,-3,GOLD);
line(0,28,-3,5,33,-3,GOLD);
line(-1,29,-4,-5,33,-4,GOLD);
line(0,29,-4,4,33,-4,GOLD);
line(-3,27,3,-3,33,6,RED); // back banner pole
line(-4,29,4,-4,33,6,WHITE);

// background: neon pillars + signs
cube(-12,0,8,-10,21,9,GRAY);
cube(7,0,8,9,21,9,GRAY);
cube(-11,22,7,-11,22,10,IRON);
cube(8,22,7,8,22,10,IRON);
cube(-15,10,9,-9,18,9,BLACK);
cube(-15,12,8,-9,12,8,NEON_RED);
cube(-14,15,8,-10,16,8,MAGENTA);
block(-15,11,8,NEON_RED); block(-9,11,8,NEON_RED);
block(-12,17,8,NEON_RED);
cube(6,9,9,13,17,9,BLACK);
cube(6,11,8,13,11,8,NEON_BLUE);
cube(7,13,8,12,14,8,CYAN);
block(9,16,8,NEON_BLUE); block(10,16,8,NEON_BLUE);
line(-10,21,8,7,21,8,BLACK);
line(-10,20,9,7,20,9,GRAY);
for (let x = -9; x <= 6; x += 3) block(x,19,9,GLOWSTONE);
cube(-13,-1,10,13,4,11,GRAY);
cube(-13,5,10,13,5,11,COBBLE);
for (let x = -12; x <= 12; x += 4) { block(x,2,10,NEON_RED); block(x+2,2,10,NEON_BLUE); }
for (let x = -13; x <= 13; x += 2) block(x,3,10,BLACK);

// burning barrel + steam vent
cylinder(-11,0,-4,1,3,IRON);
block(-11,3,-4,ORANGE);
block(-11,4,-4,FIRE);
cube(11,0,-5,12,1,-4,COBBLE);
block(11,2,-5,FIRE);
block(12,2,-4,FIRE);
block(-9,0,-8,IRON); block(-10,0,-8,IRON); block(-9,1,-8,IRON);

// cables to samurai stage
line(-10,21,8,-6,17,3,GRAY);
line(7,21,8,5,17,3,GRAY);