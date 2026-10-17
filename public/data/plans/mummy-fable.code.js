// mummy-fable — prompt:
// a mummy bursting out of its sarcophagus...

// Mummy bursting out of its sarcophagus — front faces NORTH (-Z)
// Sarcophagus is tilted back (lid flung off), mummy lunges forward/north.

// ---------- Site prep ----------
// Clear a few nearby trees/leaves in the lunge zone and level a sandy tomb floor
cube(-12, 0, -12, 12, 9, 10, AIR);
cube(-12, -1, -12, 12, -1, 10, SAND);
// sunken tomb pit edge (cracked stone)
hollowCube(-11, -1, -11, 11, -1, 9, COBBLE);
hollowCube(-10, -1, -10, 10, -1, 8, LIGHT_GRAY);

// ---------- Stone plinth ----------
cube(-7, 0, -4, 7, 0, 8, STONE);
cube(-6, 1, -3, 6, 1, 7, LIGHT_GRAY);
// hieroglyph band on plinth front
for (let x = -6; x <= 6; x += 2) block(x, 1, -3, YELLOW);
for (let x = -5; x <= 5; x += 2) block(x, 0, -4, GOLD);

// ---------- Sarcophagus body (open, tilted upright at back) ----------
// Lower coffin base (horizontal part), gold with blue bands
cube(-4, 2, -2, 4, 4, 7, GOLD);
cube(-3, 3, -1, 3, 5, 6, AIR);              // hollow interior
cube(-3, 3, -1, 3, 3, 6, BLACK);            // dark inside
// blue lapis stripes along the sides
for (let z = -2; z <= 7; z += 3) {
  cube(-4, 2, z, -4, 4, z, BLUE);
  cube(4, 2, z, 4, 4, z, BLUE);
}
// upright back half (foot end rising behind the mummy toward +Z)
cube(-4, 5, 5, 4, 14, 7, GOLD);
cube(-3, 5, 5, 3, 14, 5, BLACK);            // open dark interior face
// decoration on back slab
for (let y = 6; y <= 13; y += 2) { block(-4, y, 6, BLUE); block(4, y, 6, BLUE); }
cube(-3, 14, 6, 3, 15, 6, GOLD);
cube(-2, 15, 6, 2, 16, 6, BLUE);
block(0, 17, 6, GOLD);
// sarcophagus pharaoh face at top of back slab (half-hidden, viewer sees above the mummy)
cube(-2, 11, 4, 2, 13, 4, GOLD);
block(-1, 12, 4, BLACK); block(1, 12, 4, BLACK);
cube(-1, 11, 4, 1, 11, 4, BLUE);
// nemes headdress stripes
cube(-3, 13, 4, 3, 14, 4, GOLD);
cube(-3, 12, 5, 3, 12, 5, BLUE);
// side rims
cube(-5, 2, -2, -5, 5, 7, GOLD);
cube(5, 2, -2, 5, 5, 7, GOLD);
cube(-5, 5, 5, -5, 14, 7, GOLD);
cube(5, 5, 5, 5, 14, 7, GOLD);

// ---------- Lid: flung off, lying cracked to the east (+X) ----------
cube(7, 1, -1, 11, 2, 9, GOLD);
cube(8, 3, 0, 10, 3, 8, GOLD);
for (let z = 0; z <= 8; z += 2) { block(7, 2, z, BLUE); block(11, 2, z, BLUE); }
// lid face
cube(8, 4, 1, 10, 4, 3, GOLD);
block(8, 4, 2, BLACK); block(10, 4, 2, BLACK);
// crack (missing chunk) in lid
cube(9, 1, 5, 10, 3, 6, AIR);
// broken lid fragments scattered west
cube(-9, 1, 0, -7, 1, 2, GOLD);
block(-8, 2, 1, BLUE);
cube(-10, 1, 4, -9, 2, 5, GOLD);
block(-11, 1, 6, GOLD);
block(-7, 1, 7, BLUE);

// ---------- Mummy ----------
// Palette helper: wrap bandages = WHITE with LIGHT_GRAY / SAND aged wraps
function wrapped(x1, y1, z1, x2, y2, z2) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) {
    const h = (x * 7 + y * 13 + z * 5) % 5;
    block(x, y, z, h === 0 ? LIGHT_GRAY : h === 1 ? SAND : WHITE);
  }
}

// Legs: still inside the coffin, rising from the base toward the back slab
wrapped(-3, 4, 1, -1, 7, 4);   // left leg
wrapped(1, 4, 1, 3, 7, 4);     // right leg
// hips / pelvis (leaning forward, so shifting toward -Z as it goes up)
wrapped(-3, 8, 0, 3, 9, 3);
// torso, leaning north (-Z)
wrapped(-4, 10, -1, 4, 12, 2);
wrapped(-4, 13, -2, 4, 14, 1);
wrapped(-4, 15, -3, 4, 16, 0);
// chest cage shadows / loose bandage gaps
block(-2, 11, -1, BLACK); block(2, 12, -1, BLACK);
block(0, 14, -2, BLACK); block(-3, 15, -3, BLACK);
block(1, 10, -1, BROWN); block(-1, 16, -3, BROWN);

// Shoulders
wrapped(-6, 16, -3, -4, 17, 0);
wrapped(4, 16, -3, 6, 17, 0);

// Arms reaching forward (north) and up — bursting pose
// Left arm (west) thrust straight north
wrapped(-7, 15, -4, -5, 17, -4);
wrapped(-7, 14, -6, -5, 16, -5);
wrapped(-8, 13, -9, -6, 15, -7);
// left hand with splayed fingers
wrapped(-9, 12, -11, -6, 13, -10);
block(-10, 12, -12, LIGHT_GRAY); block(-8, 12, -12, WHITE); block(-6, 12, -12, LIGHT_GRAY); block(-7, 11, -12, WHITE);
// Right arm (east) raised high and forward
wrapped(5, 17, -4, 7, 19, -4);
wrapped(6, 19, -6, 8, 21, -5);
wrapped(7, 21, -8, 9, 23, -7);
// right hand clawing upward
wrapped(7, 23, -9, 10, 24, -9);
block(7, 25, -10, WHITE); block(9, 25, -10, LIGHT_GRAY); block(11, 24, -10, WHITE); block(10, 23, -10, LIGHT_GRAY);

// Neck
wrapped(-1, 17, -3, 1, 18, -1);

// Head (forward-tilted, facing north)
wrapped(-3, 19, -4, 3, 24, 1);
// face hollow + glowing eyes
cube(-2, 21, -4, -1, 22, -4, BLACK);
cube(1, 21, -4, 2, 22, -4, BLACK);
block(-1, 21, -4, NEON_RED);
block(1, 21, -4, NEON_RED);
// open screaming mouth
cube(-1, 19, -4, 1, 19, -4, BLACK);
block(0, 20, -4, BLACK);
// bandage gap across brow
block(-3, 23, -3, BROWN); block(3, 22, -3, BROWN);
// trailing loose bandages from head and arms
line(3, 24, 1, 6, 27, 3, WHITE);
line(-3, 23, 1, -6, 26, 2, LIGHT_GRAY);
line(-6, 13, -7, -6, 9, -6, WHITE);
line(8, 20, -5, 10, 17, -3, WHITE);
line(-4, 10, 2, -6, 7, 3, LIGHT_GRAY);
line(4, 11, 2, 7, 8, 1, WHITE);
block(-6, 6, 3, WHITE); block(7, 7, 1, LIGHT_GRAY);

// ---------- Burst debris: sand and stone flying forward ----------
const debris = [
  [-3,6,-5],[2,7,-6],[0,5,-7],[-5,4,-6],[4,3,-8],[-1,9,-8],[3,10,-9],[-7,3,-5],[6,5,-6],[-2,2,-9],
  [1,4,-10],[5,8,-10],[-4,11,-10],[0,12,-11],[-6,7,-9],[7,2,-7],[-8,8,-8],[2,14,-8],[-3,13,-7],
  [8,10,-11],[-9,5,-10],[4,6,-12],[-1,7,-13]
];
for (const [x, y, z] of debris) block(x, y, z, (x + z) % 2 ? SAND : COBBLE);
// slabs of broken coffin front flung north
cube(-2, 1, -5, 1, 1, -4, GOLD);
cube(2, 1, -7, 3, 1, -6, GOLD);
block(-5, 1, -7, BLUE); block(0, 2, -6, GOLD);
// sand mound spilling from the coffin toward the viewer
cube(-5, 1, -4, 5, 1, -3, SAND);
cube(-4, 1, -7, 4, 1, -5, SAND);
cube(-3, 2, -4, 3, 2, -2, SAND);
cube(-2, 3, -3, 2, 3, -1, SAND);

// ---------- Tomb pillars (background, +Z) and torches ----------
function pillar(x, z) {
  cylinder(x, 0, z, 1, 16, SAND);
  cube(x - 2, 16, z - 2, x + 2, 17, z + 2, SAND);
  cube(x - 1, 0, z - 1, x + 1, 0, z + 1, LIGHT_GRAY);
  for (let y = 2; y <= 14; y += 3) { block(x - 1, y, z - 1, YELLOW); block(x + 1, y, z - 1, BLUE); }
}
pillar(-10, 8);
pillar(10, 8);
// lintel between pillars
cube(-12, 18, 6, 12, 19, 10, SAND);
for (let x = -11; x <= 11; x += 2) block(x, 19, 6, GOLD);
cube(-12, 20, 7, 12, 20, 9, LIGHT_GRAY);
// torches on pillar fronts
block(-10, 11, 5, OAK_LOG); block(-10, 12, 5, FIRE);
block(10, 11, 5, OAK_LOG); block(10, 12, 5, FIRE);
// braziers at plinth corners
block(-8, 1, -3, COBBLE); block(-8, 2, -3, FIRE);
block(8, 1, -3, COBBLE); block(8, 2, -3, FIRE);

// ---------- Canopic jars & treasure around the tomb ----------
function jar(x, z, cap) {
  cube(x, 1, z, x, 2, z, SAND);
  block(x, 3, z, cap);
}
jar(-9, -1, GOLD); jar(-9, 2, COPPER); jar(-9, 5, GOLD); jar(-11, 3, COPPER);
jar(12, 4, GOLD); jar(12, 7, COPPER);
// scattered gold coins
for (const [x, z] of [[-6,-6],[7,-5],[-8,6],[12,0],[-3,-9],[6,-9],[9,2],[-12,-2]]) block(x, 1, z, GOLD);
// a scarab (green)
block(5, 2, -8, GREEN); block(5, 2, -9, GREEN); block(4, 2, -8, LIME);

// ---------- Cracked floor around the burst ----------
for (const [x, z] of [[-4,-8],[-5,-9],[-6,-10],[3,-9],[4,-10],[0,-9],[-1,-10],[-2,-11],[2,-11],[6,-8]]) block(x, 0, z, BLACK);