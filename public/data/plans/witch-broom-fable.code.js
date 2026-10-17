// witch-broom-fable — prompt:
// a witch flying on a broomstick...

// Witch flying on a broomstick — airborne over a dark forest clearing, facing NORTH (-Z).
// Broom runs along Z (handle forward/north, bristles south). Witch rides it, cat behind, moon + flying bats.

// ---- helpers ----
function fillXZ(y, x1, z1, x2, z2, id) { cube(x1, y, z1, x2, y, z2, id); }
function ellipsoid(cx, cy, cz, rx, ry, rz, id) {
  for (let x = -rx; x <= rx; x++) for (let y = -ry; y <= ry; y++) for (let z = -rz; z <= rz; z++) {
    if ((x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz) <= 1.0) block(cx+x, cy+y, cz+z, id);
  }
}

// ---- clear a flight corridor through tree canopy (trees around y 2-8 near center) ----
cube(-9, 1, -14, 9, 12, 10, AIR);

// ---- cauldron + campfire on the ground beneath (foreground, north side) ----
hollowCylinder(0, 0, -11, 2, 3, BLACK);
disk(0, 0, -11, 2, BLACK);
cube(-1, 3, -12, 1, 3, -10, LIME);          // bubbling brew
block(0, 4, -11, LIME);
block(0, 5, -11, LIME);
block(-1, 4, -12, LIME);
for (let i = 0; i < 3; i++) { block(-2 + i*2, 0, -13 + (i%2), BLACK); }
block(0, 1, -13, FIRE); block(-1, 1, -12, FIRE); block(1, 1, -12, FIRE);
cube(-3, 0, -13, 3, 0, -9, COBBLE); // fire ring
block(0, 0, -11, LAVA);
// stray tombstones
cube(4, 0, -9, 4, 2, -9, STONE); block(4, 3, -9, STONE);
cube(-5, 0, -8, -5, 1, -8, STONE); block(-5, 2, -8, GRAY);

// ---- BROOM : handle along Z at height ~14, slight upward tilt toward north ----
// handle from z=-9 (tip, north) to z=5, y rises 13 -> 15 going north
for (let z = -9; z <= 5; z++) {
  const y = Math.round(15 - (z + 9) * (2/14));   // 15 at z=-9 → 13 at z=5
  block(0, y, z, OAK_LOG);
  block(0, y - 1, z, OAK_LOG);                   // 1x2 thick handle
}
// gold ferrule binding at z=5..6
cube(-1, 12, 5, 1, 14, 6, GOLD);
// bristles: fanned bundle z=7..13, widening and drooping
for (let z = 7; z <= 13; z++) {
  const r = 1 + Math.floor((z - 7) * 0.5);  // 1 → 4
  const droop = Math.floor((z - 7) * 0.5);
  for (let x = -r; x <= r; x++) for (let dy = -r; dy <= r; dy++) {
    if (x*x + dy*dy <= r*r + 1 && Math.random() < 0.8) block(x, 13 - droop + dy, z, YELLOW);
  }
}
// wisps of straw trailing
block(-5, 9, 14, YELLOW); block(4, 9, 14, YELLOW); block(2, 8, 15, YELLOW); block(-3, 8, 15, YELLOW);
block(0, 7, 15, BROWN);

// ---- WITCH: seated side-saddle-ish, facing north, hunched forward ----
// legs: hanging below broom at z=0..2
cube(-2, 12, 1, -2, 14, 2, PURPLE);   // left thigh (west)
cube(2, 12, 1, 2, 14, 2, PURPLE);     // right thigh
cube(-2, 9, 1, -2, 11, 1, BLACK);     // left shin (stockings)
cube(2, 9, 1, 2, 11, 1, BLACK);
cube(-3, 8, 0, -2, 8, 1, BLACK);      // boots pointing north
cube(2, 8, 0, 3, 8, 1, BLACK);
block(-3, 9, 0, GOLD); block(3, 9, 0, GOLD);   // buckles

// torso/dress (purple), bell shape over broom
cube(-2, 15, 0, 2, 16, 3, PURPLE);
cube(-2, 17, 0, 2, 19, 2, PURPLE);
cube(-1, 20, 0, 1, 21, 2, PURPLE);
// dress hem flaring to the south (wind)
cube(-3, 14, 3, 3, 15, 4, PURPLE);
cube(-3, 13, 4, 3, 13, 5, BLACK);
cube(-2, 12, 5, 2, 12, 6, PURPLE);
// belt + buckle
cube(-2, 17, -1, 2, 17, -1, BLACK); block(0, 17, -1, GOLD);
// corset lacing front
block(0, 18, -1, BLACK); block(0, 19, -1, BLACK);

// arms reaching forward to grip handle
cube(-3, 18, -1, -3, 19, -1, PURPLE);  // shoulders
cube(3, 18, -1, 3, 19, -1, PURPLE);
line(-3, 18, -2, -2, 16, -5, PURPLE); // left arm forward/down
line(3, 18, -2, 2, 16, -5, PURPLE);
line(-3, 17, -2, -2, 15, -5, PURPLE);
line(3, 17, -2, 2, 15, -5, PURPLE);
// hands (green skin) gripping handle at z=-6
cube(-2, 15, -6, -1, 16, -6, LIME);
cube(1, 15, -6, 2, 16, -6, LIME);

// head (green witch skin) at y 22-25
cube(-2, 22, -1, 2, 25, 2, LIME);
cube(-1, 22, -2, 1, 25, -2, LIME);        // face front
block(0, 23, -3, GREEN);                   // long warty nose
block(0, 22, -3, GREEN);
block(0, 23, -4, GREEN);
block(-2, 24, 0, PINK); // wart... (hidden-ish)
// eyes (glowing)
block(-1, 24, -3, NEON_RED); block(1, 24, -3, NEON_RED);
// crooked grin
block(-1, 22, -3, BLACK); block(0, 21, -2, BLACK); block(1, 22, -3, BLACK);
block(-1, 21, -2, WHITE); // tooth
// hair streaming back (gray/white)
cube(-3, 22, 1, 3, 25, 3, GRAY);
cube(-3, 21, 3, 3, 24, 5, LIGHT_GRAY);
cube(-2, 20, 5, 2, 22, 7, GRAY);
line(-2, 20, 7, -1, 18, 9, LIGHT_GRAY);
line(2, 20, 7, 1, 18, 9, LIGHT_GRAY);
line(0, 21, 7, 0, 19, 10, GRAY);

// ---- HAT: wide brim + tall bent cone ----
disk(0, 26, 0, 5, BLACK);
hollowCylinder(0, 26, 0, 5, 1, PURPLE);     // brim edge trim
// hat band
cube(-3, 27, -3, 3, 27, 3, PURPLE);
block(0, 27, -4, GOLD); // buckle on band
// cone: shrinks and bends toward +X/+Z as it rises
const tip = [[3, 28, 0], [2, 30, 1], [1, 31, 1], [1, 32, 2], [1, 33, 3]];
cylinder(0, 27, 0, 3, 2, BLACK);
cylinder(0, 29, 0, 2, 2, BLACK);
cylinder(1, 31, 1, 1, 2, BLACK);
block(1, 33, 2, BLACK); block(2, 33, 3, BLACK);
block(2, 33, 3, BLACK); block(3, 33, 3, BLACK);
// patch on hat
cube(-3, 28, -1, -3, 29, 0, BROWN);

// ---- BLACK CAT perched on bristles behind the witch ----
cube(-1, 15, 7, 1, 16, 9, BLACK);        // body
cube(-1, 17, 7, 1, 18, 7, BLACK);        // head (north face)
block(-1, 19, 7, BLACK); block(1, 19, 7, BLACK);  // ears
block(-1, 18, 6, NEON_BLUE); block(1, 18, 6, NEON_BLUE);  // eyes glowing
block(0, 17, 6, PINK);                    // nose
line(0, 16, 10, 2, 19, 12, BLACK);        // tail curling up

// ---- magic sparkle trail behind the broom (south) ----
block(0, 11, 16, ELECTRIC);
block(-2, 10, 17, ELECTRIC);
block(2, 9, 18, ELECTRIC);
block(0, 8, 20, ELECTRIC);
const trail = [[-3,11,16],[3,11,16],[0,12,17],[-1,9,18],[1,10,19],[-2,8,19],[2,7,20],[0,7,21],[-1,6,22]];
for (const [x,y,z] of trail) block(x, y, z, MAGENTA);
const dust = [[-4,10,15],[4,12,15],[-1,13,16],[1,13,17],[-3,9,19],[3,8,19],[0,9,20],[-2,7,21],[2,6,21]];
for (const [x,y,z] of dust) block(x, y, z, PURPLE);

// ---- MOON: big glowing disc behind/above, south-east backdrop ----
disk(14, 28, 10, 5, GLOWSTONE);          // placeholder flat
ellipsoid(14, 28, 11, 5, 5, 1, WHITE);
ellipsoid(14, 28, 11, 4, 4, 1, GLOWSTONE);
cube(13, 27, 10, 15, 29, 10, GLOWSTONE);
cube(13, 27, 12, 15, 29, 12, GLOWSTONE);
// crater dots
block(12, 30, 10, LIGHT_GRAY); block(16, 26, 10, LIGHT_GRAY); block(15, 29, 10, LIGHT_GRAY);

// ---- BATS: small V shapes scattered in sky ----
function bat(x, y, z) {
  block(x, y, z, BLACK);
  block(x-1, y+1, z, BLACK); block(x+1, y+1, z, BLACK);
  block(x-2, y, z, BLACK); block(x+2, y, z, BLACK);
  block(x, y, z-1, NEON_RED);
}
bat(-10, 22, -3); bat(-14, 26, 4); bat(9, 20, -6); bat(-8, 30, 8); bat(12, 24, -2); bat(-12, 18, 12);

// ---- dead tree on the west, gnarled, reaching up (foreground silhouette) ----
cube(-14, 0, -4, -13, 9, -3, OAK_LOG);
line(-14, 9, -3, -18, 14, -5, OAK_LOG);
line(-13, 9, -3, -10, 14, -1, OAK_LOG);
line(-13, 7, -3, -16, 10, 0, OAK_LOG);
line(-17, 13, -5, -19, 17, -7, OAK_LOG);
line(-10, 13, -1, -8, 17, -1, OAK_LOG);
line(-14, 11, -4, -14, 16, -3, OAK_LOG);
block(-14, 10, -3, BROWN); block(-14, 10, -4, BROWN);
// owl in the tree
cube(-12, 10, -1, -11, 11, -1, BROWN);
block(-12, 11, -2, GLOWSTONE); block(-11, 11, -2, GLOWSTONE);

// ---- jack-o-lanterns on ground, east ----
sphere(8, 1, -6, 1, ORANGE);
block(8, 3, -6, GREEN);
block(8, 1, -8, NEON_RED);
sphere(11, 1, -3, 1, ORANGE);
block(11, 3, -3, GREEN);
block(11, 1, -5, NEON_RED);
cube(6, 0, -4, 7, 0, -3, ORANGE); block(6, 1, -4, GREEN);

// ---- ground mist / fog patches (translucent) ----
cube(-6, 1, -7, 6, 1, -6, GLASS);
cube(-8, 1, -2, -4, 1, 3, GLASS);
cube(5, 1, 0, 8, 1, 4, GLASS);