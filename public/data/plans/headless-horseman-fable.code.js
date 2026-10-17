// headless-horseman-fable — prompt:
// the Headless Horseman holding a flaming pumpkin...

// Headless Horseman on a rearing black steed, brandishing a flaming jack-o'-lantern.
// Front faces NORTH (-Z). Scene: cobbled lane, pumpkin patch, graveyard, ruined chapel.

const DARK = OBSIDIAN;

// ---------- clearing + lane ----------
cube(-9, 0, -16, 9, 9, 16, AIR);            // clear brush/trees over the stage
cube(-4, -1, -20, 4, -1, 20, COBBLE);        // cobbled lane
for (let z = -20; z <= 20; z++) for (let x = -4; x <= 4; x++) {
  const h = Math.abs(Math.sin(x * 12.9 + z * 78.2) * 43758.5) % 1;
  if (h < 0.18) block(x, -1, z, GRAY);
  else if (h < 0.26) block(x, -1, z, STONE);
}
// mud edges
for (let z = -20; z <= 20; z++) { block(-5, -1, z, DIRT); block(5, -1, z, DIRT); }

// ---------- horse ----------
// body (rearing: low at rear, high at chest)
for (let i = 0; i <= 6; i++) {
  const t = i / 6;
  sphere(0, Math.round(6 + 4 * t), Math.round(6 - 9 * t), 3, BLACK);
}
// belly shading
for (let i = 0; i <= 6; i++) {
  const t = i / 6;
  sphere(0, Math.round(5 + 4 * t), Math.round(6 - 9 * t), 1, DARK);
}
// hind legs (planted)
cube(-3, 0, 5, -2, 6, 6, BLACK); cube(1, 0, 5, 2, 6, 6, BLACK);
cube(-3, 0, 5, -2, 0, 6, GRAY);  cube(1, 0, 5, 2, 0, 6, GRAY);     // hooves
// front legs (tucked up, pawing)
line(-3, 9, -3, -3, 7, -7, BLACK); line(-2, 9, -3, -2, 7, -7, BLACK);
line(-3, 7, -7, -3, 4, -6, BLACK); line(-2, 7, -7, -2, 4, -6, BLACK);
block(-3, 3, -6, GRAY); block(-2, 3, -6, GRAY);
line(3, 9, -3, 3, 8, -7, BLACK);  line(2, 9, -3, 2, 8, -7, BLACK);
line(3, 8, -7, 3, 5, -7, BLACK);  line(2, 8, -7, 2, 5, -7, BLACK);
block(3, 4, -7, GRAY); block(2, 4, -7, GRAY);
// neck
for (let i = 0; i <= 3; i++) {
  const t = i / 3;
  sphere(0, Math.round(11 + 4 * t), Math.round(-4 - 3 * t), 2, BLACK);
}
// head + muzzle
cube(-1, 15, -11, 1, 18, -8, BLACK);
cube(-1, 15, -13, 1, 16, -11, BLACK);
block(0, 15, -14, DARK);
block(-1, 19, -8, BLACK); block(1, 19, -8, BLACK);                   // ears
block(-2, 17, -10, NEON_RED); block(2, 17, -10, NEON_RED);           // burning eyes
block(-1, 15, -14, FIRE); block(1, 15, -14, FIRE);                   // snorting flame
// mane (ragged)
for (let i = 0; i <= 5; i++) {
  const y = 13 + i, z = -3 - i;
  block(0, y + 2, z, DARK); block(0, y + 3, z, DARK);
  if (i % 2) { block(1, y + 2, z, DARK); } else { block(-1, y + 2, z, DARK); }
}
// tail (whipping back)
line(0, 8, 8, 0, 4, 12, BLACK); line(1, 8, 8, 1, 3, 12, DARK);
line(-1, 7, 8, -1, 2, 11, BLACK); line(0, 7, 9, 0, 1, 13, DARK);
line(1, 6, 9, 2, 1, 12, BLACK);
// tack: saddle, girth, reins
cube(-3, 11, -1, 3, 11, 3, BROWN);
cube(-2, 12, -1, 2, 12, 3, BROWN);
block(0, 13, 3, BROWN); block(0, 13, -1, BROWN);
line(-3, 10, 1, -3, 6, 1, BROWN); line(3, 10, 1, 3, 6, 1, BROWN);
line(-3, 13, -3, -1, 15, -10, IRON); line(3, 13, -3, 1, 15, -10, IRON); // reins
hollowCube(-2, 15, -11, 2, 16, -11, IRON);                            // bridle band

// ---------- the headless rider ----------
// legs
line(-3, 12, 1, -3, 7, -1, BROWN); line(-4, 12, 1, -4, 8, -1, BLACK);
line(3, 12, 1, 3, 7, -1, BROWN);   line(4, 12, 1, 4, 8, -1, BLACK);
block(-3, 6, -1, GRAY); block(3, 6, -1, GRAY);                        // boot toes
block(-4, 7, -1, IRON); block(4, 7, -1, IRON);                        // spurs
// torso
cube(-2, 13, 0, 2, 17, 2, BLACK);
cube(-3, 16, 0, 3, 17, 2, BLACK);                                     // shoulders
cube(-2, 14, 0, 2, 15, 0, DARK);                                      // chest shadow
block(0, 15, 0, GOLD); block(0, 13, 0, GOLD);                         // buttons
cube(-2, 13, 0, 2, 13, 2, BROWN);                                     // belt
block(0, 13, 0, GOLD);
// high collar + severed neck
cube(-2, 18, 0, 2, 18, 2, DARK);
block(-1, 19, 1, DARK); block(1, 19, 1, DARK); block(0, 19, 2, DARK);
block(0, 18, 1, RED);
block(0, 19, 1, RED);
// cape, billowing back and up
for (let i = 0; i < 8; i++) {
  const w = 3 + Math.floor(i * 0.8);
  const y0 = 17 - i, z = 3 + i;
  cube(-w, y0, z, w, y0 + 3 + (i > 4 ? 1 : 0), z, BLACK);
  if (i > 1) cube(-w + 1, y0 + 1, z, w - 1, y0 + 2, z, PURPLE);     // lining shows
  block(-w, y0 + 4, z, BLACK); block(w, y0 + 4, z, BLACK);
}
// ragged hem
for (let x = -9; x <= 9; x += 2) { block(x, 8, 11, BLACK); if (x % 4 === 1) block(x, 7, 11, BLACK); }
// left arm holding reins
line(-3, 16, 1, -5, 14, -2, BLACK); line(-4, 16, 1, -6, 14, -2, BLACK);
line(-5, 14, -2, -3, 13, -3, BLACK);
cube(-4, 13, -4, -3, 13, -3, GRAY);                                   // gloved hand
// right arm raised with the pumpkin
line(3, 16, 1, 6, 19, -1, BLACK); line(4, 16, 1, 7, 19, -1, BLACK);
line(3, 17, 1, 6, 20, -1, BLACK);
line(6, 19, -1, 7, 21, -1, BLACK); line(7, 19, -1, 8, 21, -1, BLACK);
cube(6, 21, -2, 8, 21, 0, GRAY);                                      // gloved hand

// ---------- flaming jack-o'-lantern ----------
sphere(7, 24, -1, 2, ORANGE);
cube(6, 24, -2, 8, 24, 0, ORANGE);
block(7, 26, -1, GREEN); block(7, 27, -1, GREEN);                     // stem
block(6, 25, -3, LAVA); block(8, 25, -3, LAVA);                       // eyes
block(7, 24, -3, LAVA);                                               // nose
line(5, 23, -3, 9, 23, -3, LAVA);                                     // grin
block(6, 22, -3, LAVA); block(8, 22, -3, LAVA);
block(7, 24, -1, GLOWSTONE);                                          // inner glow
block(6, 27, -2, FIRE); block(8, 27, 0, FIRE); block(7, 28, -1, FIRE);
block(9, 26, -1, FIRE); block(5, 26, -1, FIRE);

// ---------- pumpkin patch (east) ----------
function pumpkin(x, y, z, big) {
  if (big) { sphere(x, y + 1, z, 1, ORANGE); block(x, y + 1, z, ORANGE); block(x, y + 3, z, GREEN); }
  else { block(x, y, z, ORANGE); block(x + 1, y, z, ORANGE); block(x, y, z + 1, ORANGE); block(x + 1, y, z + 1, ORANGE); block(x, y + 1, z, GREEN); }
}
cube(6, 0, -4, 17, 6, 12, AIR);
cube(6, -1, -4, 17, -1, 12, DIRT);
for (let x = 7; x <= 16; x += 3) for (let z = -3; z <= 11; z += 3) {
  const h = Math.abs(Math.sin(x * 7.3 + z * 3.1) * 1000) % 1;
  pumpkin(x, 0, z, h > 0.6);
  line(x - 1, 0, z + 1, x + 1, 0, z - 1, GREEN);
}
block(10, 0, 5, ORANGE); block(10, 1, 5, LAVA); block(11, 0, 5, ORANGE); block(11, 1, 5, LAVA);
block(10, 2, 5, ORANGE); block(11, 2, 5, ORANGE);                     // one carved pumpkin lit
// rail fence
for (let z = -5; z <= 13; z += 3) { block(18, 0, z, OAK_LOG); block(18, 1, z, OAK_LOG); block(18, 2, z, OAK_LOG); }
line(18, 1, -5, 18, 1, 13, PLANKS); line(18, 2, -5, 18, 2, 13, PLANKS);
for (let x = 6; x <= 18; x += 3) { block(x, 0, 13, OAK_LOG); block(x, 1, 13, OAK_LOG); block(x, 2, 13, OAK_LOG); }
line(6, 1, 13, 18, 1, 13, PLANKS); line(6, 2, 13, 18, 2, 13, PLANKS);
// scarecrow
cube(13, 0, 2, 13, 5, 2, OAK_LOG); line(11, 4, 2, 15, 4, 2, OAK_LOG);
cube(12, 2, 2, 14, 4, 2, BROWN); sphere(13, 6, 2, 1, SAND); block(13, 7, 2, BROWN);
block(13, 6, 1, BLACK);

// ---------- graveyard (west) ----------
cube(-18, 0, -8, -6, 7, 8, AIR);
cube(-18, -1, -8, -6, -1, 8, GRASS);
function grave(x, z, tall) {
  cube(x, 0, z, x, tall, z, STONE);
  block(x, tall + 1, z, COBBLE);
  if (tall > 1) { block(x - 1, tall, z, STONE); block(x + 1, tall, z, STONE); }
  block(x, 0, z - 1, DIRT); block(x, 0, z - 2, DIRT);
}
grave(-8, -6, 1); grave(-11, -5, 2); grave(-14, -6, 1); grave(-17, -4, 2);
grave(-8, 0, 2); grave(-11, 1, 1); grave(-14, 0, 1); grave(-17, 2, 1);
grave(-9, 5, 1); grave(-12, 6, 2); grave(-15, 5, 1);
// open grave with a lantern
cube(-13, -3, 2, -12, -1, 4, AIR); cube(-13, -3, 2, -12, -3, 4, DIRT);
block(-11, 0, 3, OAK_LOG); block(-11, 1, 3, OAK_LOG); block(-11, 2, 3, GLOWSTONE);
// iron fence + gate
for (let z = -8; z <= 8; z += 2) { block(-6, 0, z, IRON); block(-6, 1, z, IRON); block(-6, 2, z, IRON); }
line(-6, 1, -8, -6, 1, 8, IRON);
cube(-6, 0, -1, -6, 3, 1, AIR); block(-6, 3, -1, IRON); block(-6, 3, 1, IRON); block(-6, 4, 0, IRON);
for (let x = -18; x <= -6; x += 2) { block(x, 0, -8, IRON); block(x, 1, -8, IRON); block(x, 0, 8, IRON); block(x, 1, 8, IRON); }
line(-18, 1, -8, -6, 1, -8, IRON); line(-18, 1, 8, -6, 1, 8, IRON);

// ---------- dead trees ----------
function deadTree(x, z, h) {
  cube(x, 0, z, x, h, z, OAK_LOG);
  cube(x - 1, 0, z, x + 1, 1, z, OAK_LOG);
  cube(x, 0, z - 1, x, 1, z + 1, OAK_LOG);
  line(x, h - 2, z, x + 3, h + 2, z - 1, OAK_LOG);
  line(x, h - 1, z, x - 3, h + 3, z + 1, OAK_LOG);
  line(x, h, z, x + 1, h + 4, z + 2, OAK_LOG);
  line(x, h - 3, z, x - 2, h - 1, z - 3, OAK_LOG);
  line(x + 3, h + 2, z - 1, x + 5, h + 4, z - 2, OAK_LOG);
  line(x - 3, h + 3, z + 1, x - 4, h + 6, z, OAK_LOG);
  // crows
  block(x + 2, h + 3, z - 1, BLACK); block(x - 3, h + 4, z + 1, BLACK);
}
deadTree(-15, -13, 8);
deadTree(14, -13, 9);
deadTree(-20, 12, 7);
deadTree(20, 16, 8);

// ---------- ruined chapel (south backdrop) ----------
cube(-7, 0, 14, 7, 12, 21, AIR);
cube(-7, -1, 14, 7, -1, 21, COBBLE);
hollowCube(-7, 0, 14, 7, 6, 21, COBBLE);
cube(-7, 7, 14, 7, 8, 21, AIR);
// crumbling top edges
for (let x = -7; x <= 7; x++) {
  const h = Math.abs(Math.sin(x * 5.7) * 100) % 1;
  if (h > 0.5) { block(x, 7, 14, COBBLE); block(x, 7, 21, STONE); }
  if (h > 0.8) block(x, 8, 14, STONE);
}
for (let z = 14; z <= 21; z++) { if (z % 2) { block(-7, 7, z, STONE); block(7, 7, z, COBBLE); } }
// arched doorway facing north + pointed windows
cube(-1, 0, 14, 1, 3, 14, AIR); block(0, 4, 14, AIR);
cube(-5, 2, 14, -5, 4, 14, AIR); cube(5, 2, 14, 5, 4, 14, AIR);
cube(-7, 2, 16, -7, 4, 16, AIR); cube(-7, 2, 19, -7, 4, 19, AIR);
cube(7, 2, 16, 7, 4, 16, AIR); cube(7, 2, 19, 7, 4, 19, AIR);
// bell tower on the SE corner
cube(4, 7, 18, 7, 13, 21, COBBLE);
cube(5, 9, 18, 6, 11, 18, AIR); cube(5, 9, 21, 6, 11, 21, AIR);
cube(4, 9, 19, 4, 11, 20, AIR); cube(7, 9, 19, 7, 11, 20, AIR);
cube(5, 9, 19, 6, 11, 20, AIR);
block(5, 11, 19, GOLD); block(6, 11, 20, GOLD); block(5, 10, 19, GOLD); block(6, 10, 20, GOLD);
block(5, 14, 19, IRON); block(5, 15, 19, IRON); block(4, 15, 19, IRON); block(6, 15, 19, IRON); // cross
// eerie glow inside
block(0, 1, 18, GLOWSTONE); block(-3, 1, 19, FIRE); block(3, 1, 19, FIRE);
// ivy on the walls
line(-7, 0, 15, -7, 5, 15, GREEN); line(-6, 0, 14, -6, 4, 14, LEAVES);
line(6, 0, 14, 6, 3, 14, GREEN); line(7, 0, 17, 7, 6, 17, LEAVES);

// ---------- stray embers trailing the pumpkin ----------
block(9, 22, 1, FIRE); block(4, 20, -4, FIRE); block(10, 24, 3, FIRE);