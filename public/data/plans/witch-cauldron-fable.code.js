// witch-cauldron-fable — prompt:
// a witch brewing a glowing potion in her cauldron...

// Witch brewing a glowing potion — scene faces NORTH (-Z)
// Ground around origin is ~y=-1 grass with trees nearby; clear a working area.

// ---------- SITE PREP ----------
// Clear trees/leaves in the central area (AIR is free)
cube(-12, 0, -12, 12, 12, 10, AIR);
// Level a stone-flag courtyard
cube(-11, -1, -11, 11, -1, 9, COBBLE);
for (let i = 0; i < 140; i++) {
  const x = -11 + Math.floor(Math.random() * 23);
  const z = -11 + Math.floor(Math.random() * 21);
  block(x, -1, z, (i % 3 === 0) ? STONE : (i % 3 === 1) ? GRAY : DIRT);
}
// Mossy edge
for (let x = -11; x <= 11; x++) { if (x % 2) { block(x, -1, -11, GRASS); block(x, -1, 9, GRASS); } }

// ---------- BACKDROP: crooked witch hut (south, +Z) ----------
// Walls
cube(-9, 0, 4, 9, 7, 9, OAK_LOG);
cube(-8, 0, 5, 8, 7, 8, AIR);           // hollow interior
cube(-8, 0, 5, 8, 1, 8, PLANKS);        // floor
// Dark planks band
cube(-9, 3, 4, 9, 3, 4, BROWN);
cube(-9, 6, 4, 9, 6, 4, BROWN);
// Front door (north wall), arched
cube(-1, 0, 4, 1, 3, 4, AIR);
block(0, 4, 4, AIR);
cube(-1, 0, 4, 1, 3, 4, AIR);
// Door frame
line(-2, 0, 4, -2, 4, 4, BROWN);
line(2, 0, 4, 2, 4, 4, BROWN);
line(-1, 5, 4, 1, 5, 4, BROWN);
// Interior glow seen through door
block(0, 2, 7, GLOWSTONE);
// Windows with warm light
cube(-6, 3, 4, -5, 4, 4, GLASS);
cube(5, 3, 4, 6, 4, 4, GLASS);
block(-6, 3, 5, GLOWSTONE); block(5, 3, 5, GLOWSTONE);
// Window shutters
line(-7, 2, 4, -7, 5, 4, BROWN); line(-4, 2, 4, -4, 5, 4, BROWN);
line(4, 2, 4, 4, 5, 4, BROWN); line(7, 2, 4, 7, 5, 4, BROWN);
// Crooked pointed roof (steps, leaning east)
for (let i = 0; i < 7; i++) {
  const inset = i;
  const lean = Math.floor(i / 2);
  cube(-10 + inset + lean, 8 + i, 3 + Math.floor(i / 3), 10 - inset + lean, 8 + i, 10 - Math.floor(i / 3), (i % 2) ? PURPLE : BLACK);
}
// Roof peak + crooked chimney
cube(2, 15, 6, 4, 16, 7, BLACK);
cube(6, 8, 7, 7, 13, 8, BRICK);
block(6, 12, 7, AIR); block(7, 13, 8, COBBLE);
block(6, 14, 7, FIRE);
// Eaves overhang
cube(-11, 8, 3, 11, 8, 3, BLACK);
cube(-11, 8, 10, 11, 8, 10, BLACK);
// Hanging bone/skull decor on eave
block(-8, 7, 3, WHITE); block(-8, 6, 3, LIGHT_GRAY);
block(8, 7, 3, WHITE);

// ---------- CAULDRON (center-front, slightly north of origin) ----------
const CX = 0, CZ = -3;
// Fire pit stones
disk(CX, -1, CZ, 4, STONE);
hollowCylinder(CX, 0, CZ, 4, 1, COBBLE);
// Burning logs
line(CX - 2, 0, CZ - 2, CX + 2, 0, CZ + 2, OAK_LOG);
line(CX - 2, 0, CZ + 2, CX + 2, 0, CZ - 2, OAK_LOG);
// Fire cells (sparingly)
block(CX, 1, CZ, FIRE);
block(CX - 1, 1, CZ + 1, FIRE);
block(CX + 1, 1, CZ - 1, FIRE);
block(CX, 1, CZ + 2, LAVA);
block(CX - 2, 1, CZ, LAVA);
block(CX + 2, 1, CZ + 1, LAVA);
// Cauldron tripod legs (iron)
line(CX - 3, 1, CZ - 3, CX - 1, 3, CZ - 1, IRON);
line(CX + 3, 1, CZ - 3, CX + 1, 3, CZ - 1, IRON);
line(CX, 1, CZ + 4, CX, 3, CZ + 2, IRON);
// Cauldron body: rounded black pot
disk(CX, 2, CZ, 2, BLACK);
hollowCylinder(CX, 3, CZ, 3, 1, OBSIDIAN);
hollowCylinder(CX, 4, CZ, 4, 3, BLACK);
disk(CX, 3, CZ, 2, BLACK);
// Rim band
hollowCylinder(CX, 7, CZ, 4, 1, IRON);
// Rivets
for (let a = 0; a < 8; a++) {
  const x = CX + Math.round(4 * Math.cos(a * Math.PI / 4));
  const z = CZ + Math.round(4 * Math.sin(a * Math.PI / 4));
  block(x, 5, z, GRAY);
}
// Handles
block(CX - 5, 6, CZ, IRON); block(CX + 5, 6, CZ, IRON);
block(CX - 5, 7, CZ, IRON); block(CX + 5, 7, CZ, IRON);
// GLOWING POTION surface
disk(CX, 7, CZ, 3, LIME);
disk(CX, 7, CZ, 2, NEON_BLUE);
block(CX, 7, CZ, GLOWSTONE);
block(CX - 1, 7, CZ + 1, GLOWSTONE);
block(CX + 1, 7, CZ - 1, LIME);
// Bubbles rising
block(CX - 1, 8, CZ - 1, LIME); block(CX + 2, 8, CZ, LIME);
block(CX, 9, CZ + 1, LIME); block(CX + 1, 10, CZ - 1, NEON_BLUE);
block(CX - 2, 10, CZ + 1, LIME); block(CX, 12, CZ, NEON_BLUE);
block(CX + 1, 13, CZ + 1, LIME);
// Magic crackle above potion
block(CX, 9, CZ, ELECTRIC);
block(CX - 1, 11, CZ + 1, ELECTRIC);
block(CX + 1, 12, CZ - 1, ELECTRIC);
// Green vapour wisps drifting up
for (let y = 8; y <= 15; y++) {
  const r = 1 + Math.floor((y - 8) / 3);
  const ang = y * 1.1;
  block(CX + Math.round(r * Math.cos(ang)), y, CZ + Math.round(r * Math.sin(ang)), (y % 2) ? LIME : GREEN);
  block(CX + Math.round(r * Math.cos(ang + 2.2)), y + 1, CZ + Math.round(r * Math.sin(ang + 2.2)), CYAN);
}

// Hook & chain from a wooden tripod gantry
line(-6, 0, CZ - 1, -6, 11, CZ - 1, OAK_LOG);
line(6, 0, CZ - 1, 6, 11, CZ - 1, OAK_LOG);
line(-6, 11, CZ - 1, 6, 11, CZ - 1, OAK_LOG);
line(CX, 8, CZ - 1, CX, 10, CZ - 1, IRON);  // chain down to pot (visually)
// Braces
line(-6, 11, CZ - 1, -4, 9, CZ - 1, OAK_LOG);
line(6, 11, CZ - 1, 4, 9, CZ - 1, OAK_LOG);
// Hanging herbs/ingredients on the gantry
for (let x = -5; x <= 5; x += 2) {
  if (x === -1 || x === 1) continue;
  block(x, 10, CZ - 1, (x % 4 === 1) ? GREEN : (x % 4 === 3 || x % 4 === -1) ? ORANGE : LEAVES);
  if (x % 4 === 1) block(x, 9, CZ - 1, GREEN);
}

// ---------- THE WITCH (stands east of cauldron, facing north-ish, stirring) ----------
const WX = 6, WZ = -1;
// Feet / boots
cube(WX - 1, 0, WZ, WX - 1, 0, WZ + 1, BLACK);
cube(WX + 1, 0, WZ, WX + 1, 0, WZ + 1, BLACK);
// Robe (long purple gown flaring at bottom)
cube(WX - 2, 1, WZ - 1, WX + 2, 1, WZ + 2, PURPLE);
cube(WX - 2, 2, WZ - 1, WX + 2, 3, WZ + 1, PURPLE);
cube(WX - 1, 4, WZ - 1, WX + 1, 6, WZ + 1, PURPLE);
// Robe trim / belt
cube(WX - 1, 4, WZ - 1, WX + 1, 4, WZ - 1, BLACK);
block(WX, 4, WZ - 1, GOLD);
// Robe hem pattern
for (let x = WX - 2; x <= WX + 2; x++) if ((x + WX) % 2) block(x, 1, WZ - 1, MAGENTA);
// Torso top / shoulders
cube(WX - 2, 7, WZ - 1, WX + 2, 7, WZ + 1, BLACK);   // cape shoulders
cube(WX - 1, 7, WZ, WX + 1, 7, WZ, PURPLE);
// Cape trailing back (+Z)
cube(WX - 2, 2, WZ + 2, WX + 2, 6, WZ + 2, BLACK);
cube(WX - 1, 1, WZ + 3, WX + 1, 4, WZ + 3, BLACK);
// Neck
block(WX, 8, WZ, GREEN);
// Head (green skin, witchy)
cube(WX - 1, 9, WZ - 1, WX + 1, 11, WZ + 1, GREEN);
// Face on north side (z = WZ-1)
block(WX - 1, 10, WZ - 1, LIME); // cheek highlights
block(WX + 1, 10, WZ - 1, LIME);
block(WX - 1, 11, WZ - 2, NEON_RED); // eyes, protruding slightly north
block(WX + 1, 11, WZ - 2, NEON_RED);
block(WX, 10, WZ - 2, GREEN);        // long nose
block(WX, 9, WZ - 2, LIME);          // nose tip (wart)
block(WX, 9, WZ - 1, BLACK);         // mouth
// Hair (gray straggly, hanging down sides and back)
cube(WX - 2, 8, WZ - 1, WX - 2, 11, WZ + 1, LIGHT_GRAY);
cube(WX + 2, 8, WZ - 1, WX + 2, 11, WZ + 1, LIGHT_GRAY);
cube(WX - 1, 7, WZ + 2, WX + 1, 11, WZ + 2, LIGHT_GRAY);
block(WX - 2, 7, WZ + 1, LIGHT_GRAY); block(WX + 2, 7, WZ + 1, LIGHT_GRAY);
// Hat brim
cube(WX - 3, 12, WZ - 3, WX + 3, 12, WZ + 3, BLACK);
// Hat band
cube(WX - 2, 13, WZ - 2, WX + 2, 13, WZ + 2, PURPLE);
block(WX, 13, WZ - 2, GOLD);  // buckle front
// Hat cone, bending toward east/back for character
cube(WX - 2, 14, WZ - 2, WX + 2, 14, WZ + 2, BLACK);
cube(WX - 1, 15, WZ - 1, WX + 1, 16, WZ + 1, BLACK);
cube(WX - 1, 17, WZ - 1, WX + 1, 17, WZ + 1, BLACK);
cube(WX, 18, WZ, WX + 1, 19, WZ, BLACK);
block(WX + 1, 20, WZ, BLACK);
block(WX + 2, 21, WZ, BLACK);
block(WX + 2, 22, WZ + 1, BLACK);
block(WX + 3, 22, WZ + 1, BLACK);   // drooping tip
// Hat star
block(WX - 1, 15, WZ - 2, GOLD);
// Arms: left arm (west) reaches toward cauldron holding ladle; right arm raised with wand
// Left arm (toward -X, toward cauldron)
line(WX - 2, 7, WZ - 1, WX - 4, 6, WZ - 2, PURPLE);
block(WX - 5, 6, WZ - 2, GREEN);         // hand
// Ladle: handle from hand down into potion
line(WX - 5, 6, WZ - 2, CX + 2, 8, CZ, OAK_LOG);
block(CX + 2, 8, CZ, IRON);               // ladle head
// Right arm raised, holding wand
line(WX + 2, 7, WZ - 1, WX + 4, 10, WZ - 1, PURPLE);
block(WX + 4, 11, WZ - 1, GREEN);         // hand
line(WX + 4, 12, WZ - 1, WX + 5, 15, WZ - 1, OAK_LOG);  // wand
block(WX + 5, 16, WZ - 1, GLOWSTONE);     // wand tip
block(WX + 5, 17, WZ - 1, ELECTRIC);      // sparkle

// ---------- BLACK CAT (west of cauldron, in front) ----------
const KX = -6, KZ = -5;
cube(KX, 0, KZ, KX + 1, 1, KZ + 3, BLACK);      // body
cube(KX, 2, KZ - 1, KX + 1, 3, KZ, BLACK);      // head
block(KX, 4, KZ, BLACK); block(KX + 1, 4, KZ, BLACK);  // ears
block(KX, 3, KZ - 2, NEON_BLUE); block(KX + 1, 3, KZ - 2, NEON_BLUE);  // eyes
line(KX, 1, KZ + 4, KX - 1, 3, KZ + 5, BLACK);  // tail curling up

// ---------- FOREGROUND PROPS ----------
// Spellbook on a stump (north-west)
cube(-10, 0, -8, -9, 1, -7, OAK_LOG);
cube(-10, 2, -8, -9, 2, -7, BROWN);
block(-10, 2, -8, WHITE); block(-9, 2, -7, WHITE);
// Candles
block(-11, 2, -8, WHITE); block(-11, 3, -8, FIRE);
// Potion shelf / crate with bottles (north-east)
cube(9, 0, -8, 11, 1, -6, PLANKS);
block(9, 2, -8, LIME); block(10, 2, -7, MAGENTA); block(11, 2, -6, CYAN); block(10, 2, -8, RED);
block(9, 2, -6, NEON_BLUE);
// Pumpkins scattered
block(-9, 0, 1, ORANGE); block(-8, 0, 1, ORANGE); block(-9, 1, 1, ORANGE); block(-9, 2, 1, GREEN);
block(10, 0, 2, ORANGE); block(10, 1, 2, GREEN);
block(-10, 0, -3, ORANGE);
// Jack-o'-lantern
cube(10, 0, -3, 11, 1, -2, ORANGE);
block(10, 1, -4, YELLOW); block(11, 1, -4, YELLOW); block(10, 0, -4, YELLOW);
block(10, 2, -3, GREEN);
// Broom leaning against hut
line(-8, 0, 3, -8, 6, 3, OAK_LOG);
cube(-9, 0, 2, -7, 1, 3, YELLOW);
// Lantern posts flanking the scene
line(-12, 0, -10, -12, 5, -10, OAK_LOG);
block(-12, 6, -10, IRON); block(-12, 5, -11, GLOWSTONE);
line(12, 0, -10, 12, 5, -10, OAK_LOG);
block(12, 6, -10, IRON); block(12, 5, -11, GLOWSTONE);
// Bats in the sky
for (const [bx, by, bz] of [[-4, 18, -6], [-3, 18, -6], [-5, 19, -6], [3, 20, -4], [4, 20, -4], [2, 21, -4], [-9, 17, 0], [-10, 18, 0], [-8, 18, 0]]) block(bx, by, bz, BLACK);
// Crescent moon (far back, high)
for (let a = -1.2; a <= 1.2; a += 0.15) {
  const mx = Math.round(-14 + 4 * Math.cos(a + Math.PI / 2));
  const my = Math.round(26 + 4 * Math.sin(a + Math.PI / 2));
  block(mx, my, 8, GLOWSTONE);
  block(mx, my - 1, 8, GLOWSTONE);
}

// Dead tree west side for silhouette
line(-14, 0, -2, -14, 9, -1, OAK_LOG);
line(-14, 6, -1, -17, 10, -2, OAK_LOG);
line(-14, 8, -1, -12, 12, -3, OAK_LOG);
line(-17, 10, -2, -18, 12, -1, BROWN);
line(-12, 12, -3, -11, 14, -4, BROWN);
// Spiderweb in dead tree
for (let i = 0; i < 4; i++) block(-15 + i, 9 - i, -2, WHITE);
// Mushrooms near the cat
block(-8, 0, -6, WHITE); block(-8, 1, -6, RED); block(-7, 0, -3, WHITE); block(-7, 1, -3, RED);