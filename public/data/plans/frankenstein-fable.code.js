// frankenstein-fable — prompt:
// Frankenstein's monster coming to life in the lab...

// Frankenstein's monster coming to life — cutaway lab, open to the north
// ---- clear foreground trees & interior ----
cube(-14, 0, -16, 14, 9, -7, AIR);
cube(-11, 0, -6, 11, 13, 13, AIR);

// ---- lab shell ----
cube(-12, -1, -6, 12, -1, 14, COBBLE);                 // floor
cube(-12, -1, -6, 12, -1, -6, STONE);                  // threshold
cube(-12, 0, 14, 12, 13, 14, STONE);                   // back wall
cube(-12, 0, -6, -12, 13, 14, STONE);                  // west wall
cube(12, 0, -6, 12, 13, 14, STONE);                    // east wall
// brick bands
cube(-12, 6, -6, -12, 6, 14, BRICK); cube(12, 6, -6, 12, 6, 14, BRICK); cube(-12, 6, 14, 12, 6, 14, BRICK);
cube(-12, 13, -6, -12, 13, 14, BRICK); cube(12, 13, -6, 12, 13, 14, BRICK); cube(-12, 13, 14, 12, 13, 14, BRICK);
// arched windows in side walls
for (const x of [-12, 12]) {
  for (const z of [-3, 3, 9]) {
    cube(x, 2, z - 1, x, 9, z + 1, AIR);
    block(x, 10, z, AIR);
    cube(x, 2, z - 1, x, 9, z + 1, GLASS);
    block(x, 10, z, GLASS);
    line(x, 2, z, x, 10, z, IRON);
  }
}
// big round window in back wall above the slab (moonlight)
hollowCube(-4, 7, 14, 4, 12, 14, AIR);
cube(-3, 8, 14, 3, 11, 14, GLASS);
line(0, 8, 14, 0, 11, 14, IRON);
line(-3, 10, 14, 3, 10, 14, IRON);
// roof beams + rafters
for (const z of [-6, -2, 2, 6, 10, 14]) cube(-12, 14, z, 12, 14, z, OAK_LOG);
cube(-12, 14, -6, -12, 14, 14, OAK_LOG); cube(12, 14, -6, 12, 14, 14, OAK_LOG);
cube(-12, 15, -6, 12, 15, 14, PLANKS);
cube(-5, 15, 5, 5, 15, 12, AIR);                        // skylight hatch open to the storm
hollowCube(-6, 15, 4, 6, 16, 13, IRON);
cube(-5, 16, 5, 5, 16, 12, AIR);
// pillars / buttresses in front
cube(-12, 0, -8, -11, 12, -7, STONE); cube(11, 0, -8, 12, 12, -7, STONE);
cube(-12, 12, -8, 12, 12, -7, OAK_LOG);

// ---- the slab (raised upright behind the monster) ----
cube(-6, 0, 10, 6, 19, 10, IRON);
hollowCube(-7, -1, 10, 7, 20, 10, BLACK);
cube(-7, 0, 11, 7, 0, 13, IRON);                        // slab carriage
cube(-2, 0, 11, 2, 1, 13, GRAY);
// hoist chains to the skylight
line(-6, 20, 10, -6, 16, 10, IRON);
line(6, 20, 10, 6, 16, 10, IRON);
line(0, 20, 10, 0, 16, 10, IRON);
// straps across the body
for (const x of [-6, 6]) { cube(x, 4, 9, x, 4, 9, IRON); cube(x, 8, 9, x, 8, 9, IRON); }

// ---- the monster ----
cube(-3, 0, 7, -2, 1, 9, BLACK); cube(2, 0, 7, 3, 1, 9, BLACK);      // boots
cube(-3, 2, 7, -2, 5, 9, GRAY);  cube(2, 2, 7, 3, 5, 9, GRAY);       // trousers
cube(-1, 4, 7, 1, 5, 9, GRAY);
cube(-4, 6, 7, 4, 10, 9, BLACK);                                     // jacket
cube(-5, 10, 7, 5, 10, 9, BLACK);                                    // broad shoulders
cube(-6, 5, 7, -5, 9, 9, BLACK); cube(5, 5, 7, 6, 9, 9, BLACK);      // arms
cube(-6, 3, 7, -5, 4, 9, GREEN); cube(5, 3, 7, 6, 4, 9, GREEN);      // hands
line(-6, 2, 7, -6, 2, 7, GREEN); line(6, 2, 7, 6, 2, 7, GREEN);      // fingers
cube(-1, 8, 6, 1, 9, 6, GREEN);                                      // chest exposed under jacket
cube(-1, 11, 7, 1, 11, 9, GREEN);                                    // neck
cube(-2, 12, 7, 2, 16, 9, GREEN);                                    // head
cube(-2, 17, 7, 2, 17, 9, BLACK); cube(-2, 16, 6, 2, 16, 6, BLACK);  // flat-top hair + fringe
cube(-3, 17, 7, 3, 17, 9, BLACK);
// face (north side z=6)
cube(-2, 15, 6, 2, 15, 6, BLACK);                                    // heavy brow
block(-1, 14, 6, GLOWSTONE); block(1, 14, 6, GLOWSTONE);             // eyes flickering on
block(0, 13, 6, GREEN);
cube(-1, 12, 6, 1, 12, 6, BLACK);                                    // mouth
block(-2, 14, 6, GREEN); block(2, 14, 6, GREEN); block(-2, 13, 6, GREEN); block(2, 13, 6, GREEN);
// stitches
block(2, 15, 6, BLACK); block(-2, 13, 7, BLACK);
line(0, 8, 6, 0, 9, 6, BLACK);
// neck bolts
block(-3, 12, 8, IRON); block(3, 12, 8, IRON);
block(-4, 12, 8, IRON); block(4, 12, 8, IRON);
// straps over him
cube(-4, 8, 6, 4, 8, 6, IRON); cube(-3, 4, 6, 3, 4, 6, IRON);

// ---- tesla coils ----
for (const x of [-9, 9]) {
  cylinder(x, 0, 3, 2, 3, IRON);
  cylinder(x, 3, 3, 1, 8, COPPER);
  for (let y = 4; y < 11; y += 2) hollowCylinder(x, y, 3, 2, 1, COPPER);
  sphere(x, 12, 3, 2, COPPER);
  block(x, 14, 3, IRON);
  block(x, 15, 3, ELECTRIC);
}
block(-5, 17, 8, ELECTRIC); block(5, 17, 8, ELECTRIC);
block(0, 19, 9, ELECTRIC);

// ---- lightning rod through the skylight ----
line(0, 16, 10, 0, 31, 10, IRON);
sphere(0, 30, 10, 1, GOLD);
block(0, 32, 10, ELECTRIC);
block(2, 24, 10, ELECTRIC);
cube(-1, 16, 10, 1, 17, 10, IRON);

// ---- control console (west) ----
cube(-10, 0, -3, -8, 2, 0, IRON);
cube(-10, 3, -2, -8, 3, 0, GRAY);
for (let z = -2; z <= 0; z++) block(-10, 3, z, z % 2 ? NEON_RED : NEON_BLUE);
block(-8, 3, -1, GLOWSTONE);
cube(-11, 0, -3, -11, 5, 0, BLACK);                                   // tall cabinet
block(-11, 4, -2, NEON_RED); block(-11, 4, 0, NEON_BLUE); block(-11, 2, -1, GLOWSTONE);
line(-9, 3, 0, -9, 6, -2, IRON); block(-9, 7, -2, RED);               // the lever, thrown
// cables from console to slab
line(-8, 1, 1, -7, 1, 9, BLACK);
line(-10, 2, 1, -9, 1, 9, BLACK);
line(8, 1, 1, 7, 1, 9, BLACK);

// ---- generator (east) ----
cube(7, 0, -3, 10, 3, 0, IRON);
cube(7, 4, -3, 10, 4, 0, GRAY);
hollowCylinder(8, 5, -1, 1, 3, COPPER);
block(8, 8, -1, NEON_BLUE);
block(10, 2, -3, NEON_RED); block(7, 2, -3, NEON_RED);
block(9, 5, 0, GLOWSTONE);
line(8, 4, 1, 8, 2, 8, BLACK);

// ---- the doctor, arm raised, at the lever ----
cube(-7, 0, -1, -6, 1, 0, BLACK);                                     // shoes
cube(-7, 2, -1, -6, 3, 0, BLACK);                                     // trousers
cube(-7, 4, -1, -6, 6, 0, WHITE);                                     // lab coat
cube(-6, 4, -2, -6, 5, -2, WHITE);
cube(-8, 4, -1, -8, 6, 0, WHITE);                                     // arm on lever
block(-8, 7, -1, PINK);
line(-5, 5, -1, -5, 8, -1, WHITE); block(-5, 9, -1, PINK);            // other arm thrown up
cube(-7, 7, -1, -6, 8, 0, PINK);                                      // head
cube(-7, 9, -1, -6, 9, 0, WHITE); block(-6, 9, -2, WHITE); block(-8, 9, 0, WHITE);  // wild white hair
block(-7, 8, -2, BLACK);                                              // goggles

// ---- shelves, jars, specimens, clutter ----
cube(-11, 1, 12, -8, 1, 13, PLANKS); cube(-11, 4, 12, -8, 4, 13, PLANKS); cube(-11, 7, 12, -8, 7, 13, PLANKS);
for (let x = -11; x <= -8; x++) {
  block(x, 2, 13, x % 2 ? GLASS : LIME); block(x, 5, 13, x % 2 ? CYAN : GLASS); block(x, 8, 13, BROWN);
}
block(-9, 3, 13, LIME); block(-10, 6, 13, MAGENTA);
cube(8, 1, 12, 11, 1, 13, PLANKS); cube(8, 4, 12, 11, 4, 13, PLANKS); cube(8, 7, 12, 11, 7, 13, PLANKS);
for (let x = 8; x <= 11; x++) {
  block(x, 2, 13, x % 2 ? BROWN : RED); block(x, 5, 13, x % 2 ? GLASS : LIME); block(x, 8, 13, PLANKS);
}
block(9, 2, 12, GLASS); block(10, 5, 12, GLOWSTONE);
// coiled bulb vats either side of the slab base
hollowCylinder(-9, 0, 9, 1, 4, GLASS); cylinder(-9, 0, 9, 0, 4, LIME); block(-9, 4, 9, IRON);
hollowCylinder(9, 0, 9, 1, 4, GLASS); cylinder(9, 0, 9, 0, 4, NEON_BLUE); block(9, 4, 9, IRON);
// wall sconces
for (const x of [-11, 11]) { block(x, 9, -4, IRON); block(x, 10, -4, FIRE); block(x, 9, 6, IRON); block(x, 10, 6, FIRE); }
// stone steps up to the entrance + flagstone apron
cube(-12, -1, -9, 12, -1, -7, STONE);
cube(-6, -1, -11, 6, -1, -10, COBBLE);
// scattered tools / spilled bits
block(4, 0, 2, IRON); block(5, 0, 2, IRON); block(-3, 0, 3, BROWN); block(2, 0, -5, GRAY);
// crows on the roof beam
block(-10, 13, -8, BLACK); block(-9, 13, -8, BLACK); block(9, 13, -8, BLACK);