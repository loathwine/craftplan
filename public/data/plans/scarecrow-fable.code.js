// scarecrow-fable — prompt:
// a creepy scarecrow in a pumpkin patch...

// Creepy scarecrow in a pumpkin patch — faces north (-Z)

// ---------- helpers ----------
function pumpkin(cx, cy, cz, r, face) {
  // r=1 small, r=2 medium
  if (r === 1) {
    cube(cx - 1, cy, cz - 1, cx + 1, cy + 1, cz + 1, ORANGE);
    block(cx - 1, cy, cz - 1, AIR); block(cx + 1, cy, cz - 1, AIR);
    block(cx - 1, cy, cz + 1, AIR); block(cx + 1, cy, cz + 1, AIR);
    block(cx - 1, cy + 1, cz - 1, AIR); block(cx + 1, cy + 1, cz - 1, AIR);
    block(cx - 1, cy + 1, cz + 1, AIR); block(cx + 1, cy + 1, cz + 1, AIR);
    block(cx, cy + 2, cz, GREEN);
    if (face) { block(cx, cy + 1, cz - 1, GLOWSTONE); }
  } else {
    sphere(cx, cy + 1, cz, 2, ORANGE);
    cube(cx - 2, cy - 1, cz - 2, cx + 2, cy - 1, cz + 2, AIR);
    block(cx, cy + 3, cz, GREEN); block(cx, cy + 4, cz, GREEN);
    if (face) {
      block(cx - 1, cy + 2, cz - 2, GLOWSTONE); block(cx + 1, cy + 2, cz - 2, GLOWSTONE);
      block(cx, cy + 1, cz - 2, BLACK); block(cx - 1, cy, cz - 2, GLOWSTONE); block(cx + 1, cy, cz - 2, GLOWSTONE);
      block(cx, cy, cz - 2, BLACK);
    }
  }
}
function vine(x1, z1, x2, z2) { line(x1, 0, z1, x2, 0, z2, GREEN); }

// ---------- ground: tilled patch, dark earth ----------
cube(-20, -1, -16, 20, -1, 16, DIRT);
cube(-20, 0, -16, 20, 0, 16, AIR);
cube(-20, 1, -16, 20, 6, 16, AIR); // clear nearby leaves/trunks
for (let z = -14; z <= 14; z += 3) cube(-19, -1, z, 19, -1, z, BROWN); // furrows
cube(-22, 0, -22, 22, 0, -17, AIR); // low strip clear to north for the camera

// ---------- pumpkins scattered ----------
const spots = [
  [-14, -12, 2, 0], [-7, -13, 1, 0], [3, -12, 2, 1], [11, -13, 1, 0], [16, -11, 2, 0],
  [-17, -6, 1, 0], [-10, -7, 2, 1], [-3, -8, 1, 0], [7, -7, 1, 0], [14, -5, 2, 0],
  [-15, 0, 2, 0], [-8, -1, 1, 0], [8, 0, 2, 1], [16, 2, 1, 0], [-18, 6, 1, 0],
  [-11, 6, 2, 0], [-4, 7, 1, 0], [5, 6, 1, 0], [12, 7, 2, 0], [18, 9, 1, 0],
  [-14, 12, 1, 0], [-6, 13, 2, 0], [2, 12, 1, 0], [10, 13, 2, 0], [17, 14, 1, 0],
  [-19, -14, 1, 0], [19, -15, 1, 0], [-1, -14, 1, 0], [-20, 11, 2, 0], [20, 5, 2, 0]
];
for (const [x, z, r, f] of spots) pumpkin(x, 0, z, r, f);
// vines
vine(-14, -12, -7, -13); vine(3, -12, 11, -13); vine(-17, -6, -10, -7); vine(-3, -8, 7, -7);
vine(-15, 0, -8, -1); vine(8, 0, 16, 2); vine(-11, 6, -4, 7); vine(5, 6, 12, 7);
vine(-14, 12, -6, 13); vine(2, 12, 10, 13); vine(14, -5, 16, 2); vine(-18, 6, -15, 0);
for (let i = 0; i < 40; i++) {
  const x = Math.floor(Math.sin(i * 12.9898) * 43758.5453 % 1 * 19);
  const z = Math.floor(Math.cos(i * 78.233) * 43758.5453 % 1 * 15);
  block(x, 0, z, LEAVES);
}

// ---------- rickety fence posts (background, south & sides) ----------
for (let x = -20; x <= 20; x += 5) { cube(x, 0, 16, x, 2, 16, OAK_LOG); }
line(-20, 2, 16, 20, 2, 16, PLANKS); line(-20, 1, 16, 20, 1, 16, PLANKS);
for (let z = -14; z <= 16; z += 5) { cube(-21, 0, z, -21, 2, z, OAK_LOG); cube(21, 0, z, 21, 2, z, OAK_LOG); }
line(-21, 1, -14, -21, 1, 16, PLANKS); line(21, 1, -14, 21, 1, 16, PLANKS);
// broken bit
cube(4, 1, 16, 7, 2, 16, AIR); block(6, 0, 16, PLANKS);

// ---------- dead tree, west background ----------
cube(-16, 0, 10, -15, 9, 11, OAK_LOG);
line(-15, 9, 10, -11, 14, 8, OAK_LOG); line(-16, 8, 11, -20, 13, 13, OAK_LOG);
line(-15, 10, 11, -14, 15, 14, OAK_LOG); line(-13, 12, 9, -12, 15, 6, OAK_LOG);
line(-18, 11, 12, -19, 15, 10, OAK_LOG);
// crow on branch
block(-12, 16, 6, BLACK); block(-12, 17, 6, BLACK); block(-12, 17, 5, BLACK);

// ---------- scarecrow ----------
// post
cube(0, 0, 2, 0, 15, 2, OAK_LOG);
cube(-1, 0, 2, 1, 1, 3, COBBLE);
// crossbar
cube(-7, 11, 2, 7, 11, 2, OAK_LOG);
// legs: ragged trousers (brown) with straw bottoms
cube(-1, 2, 1, 0, 7, 3, BROWN);
cube(1, 2, 1, 2, 7, 3, BROWN);
cube(-1, 1, 1, 0, 1, 3, YELLOW); cube(1, 1, 1, 2, 1, 3, YELLOW);
block(-1, 0, 1, YELLOW); block(2, 0, 3, YELLOW); block(2, 1, 0, YELLOW);
// patches
block(-1, 5, 1, GRAY); block(2, 4, 1, LIGHT_GRAY);
// torso: tattered coat
cube(-3, 8, 0, 3, 13, 3, BLACK);
cube(-2, 8, 4, 2, 13, 4, BLACK); // back bulk
// torn hem
block(-3, 8, 0, AIR); block(3, 8, 0, AIR); block(-3, 8, 3, AIR); block(0, 8, 0, AIR);
block(-2, 7, 1, BLACK); block(2, 7, 2, BLACK); block(-3, 7, 2, BLACK);
// shirt showing + buttons
cube(0, 9, 0, 0, 12, 0, GRAY);
block(0, 12, -1, IRON); block(0, 10, -1, IRON);
// straw poking out at waist & neck
cube(-4, 8, 1, -4, 8, 2, YELLOW); cube(4, 8, 1, 4, 8, 2, YELLOW);
cube(-3, 13, 0, 3, 13, 3, YELLOW); cube(-2, 13, 0, 2, 13, 3, BLACK);
// arms along crossbar, drooping hands
cube(-7, 10, 1, -4, 12, 3, BLACK); cube(4, 10, 1, 7, 12, 3, BLACK);
cube(-8, 9, 1, -8, 12, 2, YELLOW); cube(8, 9, 1, 8, 12, 2, YELLOW); // straw hands
line(-8, 8, 1, -9, 6, 1, YELLOW); line(8, 8, 2, 9, 6, 2, YELLOW); // dangling straw
// crows on arms
block(-6, 13, 2, BLACK); block(-6, 14, 2, BLACK); block(-6, 14, 1, BLACK);
block(6, 13, 2, BLACK); block(6, 14, 2, BLACK); block(6, 14, 1, BLACK); block(7, 14, 1, ORANGE);
// neck (burlap sack tied with rope)
cube(0, 14, 2, 0, 14, 2, BROWN);
// head: burlap sack, slightly tilted east
cube(-2, 15, 0, 3, 19, 4, SAND);
cube(-2, 15, 0, 3, 15, 0, AIR); cube(-2, 19, 4, 3, 19, 4, AIR); // round corners
block(-2, 15, 4, AIR); block(3, 15, 4, AIR); block(-2, 19, 0, AIR); block(3, 19, 0, AIR);
cube(-1, 15, 1, 2, 15, 3, BROWN); // rope tie at neck
// face (north side z=0): stitched mouth, hollow glowing eyes
cube(-1, 17, 0, 2, 17, 0, SAND);
block(-1, 18, 0, AIR); block(2, 18, 0, AIR); // eye sockets
block(-1, 18, 1, NEON_RED); block(2, 18, 1, NEON_RED); // glowing eyes deep in sockets
block(0, 18, 0, SAND); block(1, 18, 0, SAND);
block(0, 17, 0, BLACK); // stitched nose
line(-1, 16, 0, 2, 16, 0, BLACK); // crooked grin
block(-1, 16, 0, BLACK); block(3, 16, 0, BLACK);
block(-2, 17, 0, GRAY); block(0, 15, 0, GRAY); // stitches
// sack top gathered
cube(0, 20, 1, 1, 20, 3, SAND); block(1, 21, 2, BROWN);
// hat: wide-brim battered black hat
cube(-4, 20, -1, 5, 20, 5, BLACK);
block(-4, 20, -1, AIR); block(5, 20, -1, AIR); block(-4, 20, 5, AIR); block(5, 20, 5, AIR);
block(-5, 19, 2, BLACK); block(6, 20, 2, BLACK); block(6, 21, 3, BLACK); // bent brim
cube(-2, 21, 0, 3, 24, 4, BLACK);
cube(-2, 25, 1, 2, 25, 3, BLACK); block(3, 25, 4, BLACK); block(-1, 26, 2, BLACK);
line(-3, 21, 0, 4, 21, 0, BROWN); // hatband
block(0, 22, 0, AIR); block(-2, 23, 1, AIR); // torn hat
// crow on hat
block(2, 26, 2, BLACK); block(2, 27, 2, BLACK); block(2, 27, 1, BLACK); block(2, 27, 0, ORANGE);

// ---------- foreground jack-o-lanterns with candles ----------
pumpkin(-5, 0, -4, 2, 1); pumpkin(6, 0, -3, 2, 1);
block(-5, 1, -4, FIRE); block(6, 1, -3, FIRE);
// carved big pumpkin ahead of post, lit
pumpkin(0, 0, -10, 2, 1); block(0, 1, -10, FIRE);

// ---------- gravestones & bones ----------
cube(-9, 0, 4, -8, 2, 4, STONE); block(-8, 3, 4, STONE); block(-9, 1, 3, GRAY);
cube(10, 0, 5, 10, 1, 6, STONE); block(10, 2, 5, COBBLE);
line(-12, 0, -3, -11, 0, -3, WHITE); block(-10, 0, -3, WHITE); block(-13, 0, -2, WHITE);
// skull at scarecrow base
block(-2, 0, 0, WHITE); block(-2, 1, 0, WHITE); block(-2, 1, -1, BLACK);

// ---------- scattered dry straw on ground & mist stones ----------
for (let i = 0; i < 25; i++) {
  const a = i * 2.399, r = 3 + (i % 7);
  const x = Math.round(Math.cos(a) * r), z = Math.round(Math.sin(a) * r) + 1;
  block(x, 0, z, YELLOW);
}
// lantern on fence post (east)
block(21, 3, -4, OAK_LOG); block(21, 4, -4, GLOWSTONE);
// electric crackle: single storm spark on hat tip
block(2, 28, 2, ELECTRIC);