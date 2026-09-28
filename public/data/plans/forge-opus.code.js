// forge-opus — prompt:
// a blacksmith's forge...

cube(-20, 1, -12, 15, 7, -2, AIR);      // clear bushes/trees from the front yard
cube(-13, 1, -4, 9, 8, 11, AIR);       // clear the smithy volume
cube(10, 1, -2, 15, 6, 11, AIR);       // clear the lean-to
cube(-11, 0, -4, 9, 0, 11, AIR);       // level smithy footprint
cube(10, 0, -1, 15, 0, 11, AIR);       // level lean-to
cube(-3, 0, -13, 1, 0, -5, AIR);       // sunken path
block(3, 0, -10, AIR); block(-7, 0, -5, AIR); block(-6, 0, -8, AIR);

// ===== helpers =====
function H(x, y, z) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function pick(x, y, z, list) {
  const r = H(x, y, z); let acc = 0;
  for (const [id, w] of list) { acc += w; if (r < acc) return id; }
  return list[list.length - 1][0];
}
function mixBox(x1, y1, z1, x2, y2, z2, list) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++)
    block(x, y, z, pick(x, y, z, list));
}
const cobMix = [[COBBLE, .6], [STONE, .3], [GRAY, .1]];
const brickMix = [[BRICK, .86], [BROWN, .08], [COBBLE, .06]];
const shingle = [[GRAY, .62], [STONE, .25], [COBBLE, .08], [BLACK, .05]];
const woodRoof = [[PLANKS, .6], [BROWN, .3], [OAK_LOG, .1]];

// ===== ground =====
cube(-2, -1, -9, 7, -1, -5, GRASS);      // fill the hollow in front
cube(5, -1, 11, 8, -1, 13, GRASS);
cube(9, -1, 12, 15, -1, 13, GRASS);
mixBox(-3, -1, -13, 1, -1, -5, [[COBBLE, .45], [GRAY, .25], [STONE, .2], [DIRT, .1]]);   // cobbled path
// shop floor: flagstones, sooty near the hearth
for (let x = -10; x <= 8; x++) for (let z = -4; z <= 10; z++) {
  const d = Math.hypot(x + 1, z - 8), r = H(x, -1, z);
  block(x, -1, z, (d < 4 && r < 0.45) ? BLACK : r < 0.5 ? COBBLE : r < 0.8 ? STONE : GRAY);
}
mixBox(9, -1, -1, 15, -1, 11, [[DIRT, .5], [COBBLE, .3], [GRAY, .2]]);   // lean-to floor

// ===== smithy shell =====
const X0 = -10, X1 = 8, Z0 = -2, Z1 = 10;
mixBox(X0, 0, Z1, X1, 2, Z1, cobMix);
mixBox(X0, 0, Z0, X0, 2, Z1 - 1, cobMix);
mixBox(X1, 0, Z0, X1, 2, Z1 - 1, cobMix);
cube(X0, 3, Z1, X1, 7, Z1, PLANKS);
cube(X0, 3, Z0, X0, 7, Z1 - 1, PLANKS);
cube(X1, 3, Z0, X1, 7, Z1 - 1, PLANKS);
// timber frame
for (const [x, z] of [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1], [X0, 4], [X1, 4], [-4, Z1], [2, Z1]])
  cube(x, 0, z, x, 7, z, OAK_LOG);
for (const y of [3, 7]) {
  line(X0, y, Z0, X0, y, Z1, OAK_LOG);
  line(X1, y, Z0, X1, y, Z1, OAK_LOG);
  line(X0, y, Z1, X1, y, Z1, OAK_LOG);
}
line(X0, 4, -1, X0, 6, 1, OAK_LOG); line(X0, 4, 3, X0, 6, 1, OAK_LOG);
line(X1, 4, 5, X1, 6, 7, OAK_LOG); line(X1, 4, 9, X1, 6, 7, OAK_LOG);
line(X0, 4, 9, X0, 6, 7, OAK_LOG);
line(3, 6, Z1, 7, 4, Z1, OAK_LOG);
// windows
cube(X0, 4, 5, X0, 5, 6, AIR);
cube(X1, 4, 1, X1, 5, 2, AIR);
cube(-8, 4, Z1, -7, 5, Z1, AIR);
// open front: posts, tie beam, knee braces
for (const x of [-4, 2]) cube(x, 0, Z0, x, 6, Z0, OAK_LOG);
line(X0, 7, Z0, X1, 7, Z0, OAK_LOG);
for (const x of [X0 + 1, -5, -3, 1, 3, X1 - 1]) block(x, 6, Z0, OAK_LOG);
line(X0, 7, 6, X1, 7, 6, OAK_LOG);           // interior tie beam
block(-7, 6, 6, GLOWSTONE);                  // hanging lamp
for (const x of [-4, 2]) { block(x, 6, -3, OAK_LOG); block(x, 5, -3, GLOWSTONE); }   // front lanterns

// ===== gable roof (gable faces the viewer) =====
for (let k = 0; k <= 9; k++) {
  const y = 8 + k;
  for (let z = -4; z <= 12; z++) {
    const edge = (z === -4 || z === 12);
    for (const x of [-11 + k, 9 - k]) block(x, y, z, edge ? OAK_LOG : pick(x, y, z, shingle));
  }
  for (let x = -10 + k; x <= 8 - k; x++) { block(x, y, Z0, PLANKS); block(x, y, Z1, PLANKS); }
}
for (let z = -4; z <= 12; z++) block(-1, 18, z, (z === -4 || z === 12) ? OAK_LOG : COBBLE);
line(-1, 8, Z0, -1, 17, Z0, OAK_LOG);
line(-9, 8, Z0, -5, 12, Z0, OAK_LOG); line(7, 8, Z0, 3, 12, Z0, OAK_LOG);
// weathervane
line(-1, 19, -3, -1, 20, -3, IRON);
cube(-3, 21, -3, 1, 21, -3, COPPER); block(-3, 22, -3, COPPER); block(1, 22, -3, COPPER); block(1, 20, -3, COPPER);
// shop sign with anvil emblem + lucky horseshoe
cube(-4, 9, -3, 2, 13, -3, BROWN);
cube(-3, 12, -3, 1, 12, -3, IRON); block(-1, 11, -3, IRON); cube(-2, 10, -3, 0, 10, -3, IRON);
block(-1, 14, -3, GOLD); line(-2, 15, -3, -2, 16, -3, GOLD); line(0, 15, -3, 0, 16, -3, GOLD);

// ===== forge hearth, hood, chimney =====
mixBox(-4, 0, 7, 2, 2, 9, brickMix);
cube(-4, 2, 7, 2, 2, 7, COBBLE);
cube(-3, 2, 8, 1, 2, 8, LAVA);                   // glowing coal bed
cube(-2, 1, 7, 0, 1, 7, AIR);                    // ash pit mouth
block(-2, 1, 8, BLACK); block(-1, 1, 8, LAVA); block(0, 1, 8, BLACK);
block(-2, 3, 8, FIRE); block(0, 3, 8, FIRE);
cube(-4, 3, 7, -4, 4, 8, COBBLE); cube(2, 3, 7, 2, 4, 8, COBBLE);
mixBox(-4, 3, 9, 2, 4, 9, brickMix);
mixBox(-4, 5, 7, 2, 5, 9, brickMix);
cube(-4, 5, 7, 2, 5, 7, COBBLE);
mixBox(-3, 6, 8, 1, 6, 9, brickMix);
for (let y = 7; y <= 23; y++) {
  for (let x = -2; x <= 0; x++) for (let z = 8; z <= 10; z++) {
    if (x === -1 && z === 9) { block(x, y, z, AIR); continue; }
    block(x, y, z, (y === 13 || y === 20) ? COBBLE : pick(x, y, z, brickMix));
  }
}
cube(-3, 24, 7, 1, 24, 11, COBBLE); block(-1, 24, 9, AIR);
block(-1, 23, 9, FIRE);                           // smoke from the stack

// bellows
cube(3, 0, 8, 4, 0, 8, OAK_LOG);
cube(3, 1, 7, 4, 1, 9, PLANKS);
cube(3, 2, 7, 4, 2, 9, BROWN);
cube(3, 3, 8, 4, 3, 9, PLANKS);
block(2, 1, 8, IRON);
line(4, 4, 9, 4, 6, 9, OAK_LOG);
// workbench + tools on the back wall
cube(6, 2, 7, 7, 2, 9, PLANKS);
for (const x of [6, 7]) for (const z of [7, 9]) cube(x, 0, z, x, 1, z, OAK_LOG);
block(6, 3, 8, GOLD); block(7, 3, 7, IRON); block(7, 3, 9, COPPER);
line(5, 4, 9, 5, 6, 9, IRON);
line(6, 4, 9, 6, 5, 9, OAK_LOG); block(6, 6, 9, IRON);
line(7, 4, 9, 7, 6, 9, GRAY);

// ===== the blacksmith at his anvil =====
cube(3, 0, 1, 6, 0, 2, OBSIDIAN);
cube(4, 1, 1, 5, 1, 2, IRON);
cube(3, 2, 1, 6, 2, 2, IRON); block(7, 2, 1, IRON);
block(5, 3, 2, NEON_RED); block(6, 3, 2, ORANGE);  // glowing bar
block(3, 3, 2, IRON); block(4, 3, 2, IRON);        // tongs
cube(4, 0, 4, 4, 0, 5, BLACK); cube(6, 0, 4, 6, 0, 5, BLACK);
cube(4, 1, 4, 4, 2, 5, GRAY); cube(6, 1, 4, 6, 2, 5, GRAY); cube(5, 2, 4, 5, 2, 5, GRAY);
cube(4, 3, 4, 6, 5, 5, WHITE);
cube(4, 1, 3, 6, 4, 3, BROWN); block(4, 5, 3, BROWN); block(6, 5, 3, BROWN);   // leather apron
block(3, 5, 4, WHITE); block(3, 4, 4, PINK); block(3, 4, 3, PINK);            // tongs arm
block(7, 5, 4, WHITE); block(7, 6, 4, PINK); block(7, 7, 4, PINK);            // hammer arm raised
block(7, 8, 4, OAK_LOG); cube(7, 9, 3, 7, 9, 5, IRON);
cube(4, 6, 4, 6, 8, 5, PINK);
block(4, 7, 4, BLACK); block(6, 7, 4, BLACK); block(5, 7, 3, PINK);
cube(4, 6, 4, 6, 6, 4, BLACK); block(5, 5, 3, BLACK);                          // beard
cube(4, 8, 4, 6, 8, 5, BLACK); cube(4, 7, 5, 6, 7, 5, BLACK);                  // hair

// ===== west side of the shop =====
// weapon rack
cube(-9, 0, 0, -9, 4, 0, OAK_LOG); cube(-5, 0, 0, -5, 4, 0, OAK_LOG); line(-9, 4, 0, -5, 4, 0, OAK_LOG);
for (const x of [-8, -6]) {
  line(x, 1, 0, x, 3, 0, IRON);
  block(x, 4, -1, GOLD); block(x, 4, 1, GOLD);
  block(x, 5, 0, BROWN); block(x, 6, 0, GOLD);
}
line(-7, 1, 0, -7, 6, 0, OAK_LOG); block(-7, 7, 0, IRON);
// quench trough + apprentice quenching a blade
cube(-8, 0, 2, -5, 1, 4, PLANKS); cube(-7, 1, 3, -6, 1, 3, WATER);
block(-7, 2, 3, ORANGE); block(-7, 2, 4, IRON);
cube(-7, 0, 5, -7, 1, 5, BROWN); cube(-6, 0, 5, -6, 1, 5, BROWN);
cube(-7, 2, 5, -6, 3, 6, BLUE);
block(-8, 3, 5, BLUE); block(-8, 2, 4, PINK); block(-5, 3, 5, BLUE); block(-5, 2, 5, PINK);
cube(-7, 4, 5, -6, 5, 6, PINK);
block(-7, 5, 5, BLACK); block(-6, 5, 5, BLACK);
cube(-7, 6, 5, -6, 6, 6, ORANGE); cube(-7, 5, 6, -6, 5, 6, ORANGE);
// coal heap + shovel
cube(-8, 0, 7, -5, 0, 9, BLACK); cube(-7, 1, 8, -6, 1, 9, BLACK); block(-7, 2, 9, BLACK);
block(-5, 1, 7, IRON); line(-5, 2, 7, -5, 4, 7, OAK_LOG);
// water barrel out front
cube(-9, 0, -4, -8, 2, -3, PLANKS); cube(-9, 1, -4, -8, 1, -3, OAK_LOG); cube(-9, 2, -4, -8, 2, -3, WATER);
// firewood under the west eave + chopping block
mixBox(-12, 0, 1, -11, 3, 8, [[OAK_LOG, .7], [PLANKS, .3]]);
block(-13, 1, -2, OAK_LOG); block(-13, 2, -2, IRON); block(-13, 3, -2, OAK_LOG);

// ===== east lean-to storehouse =====
for (const z of [-1, 5, 11]) cube(14, 0, z, 14, 3, z, OAK_LOG);
for (let x = 9; x <= 15; x++) {
  const y = x <= 9 ? 7 : x <= 11 ? 6 : x <= 13 ? 5 : 4;
  for (let z = -1; z <= 11; z++) block(x, y, z, (z === -1 || z === 11) ? OAK_LOG : pick(x, y, z, woodRoof));
}
cube(9, 0, 0, 11, 1, 2, PLANKS); mixBox(9, 2, 0, 11, 2, 2, [[STONE, .55], [IRON, .3], [GRAY, .15]]);
cube(9, 0, 4, 10, 1, 5, PLANKS); mixBox(9, 2, 4, 10, 2, 5, [[COPPER, .6], [STONE, .4]]);
cube(9, 0, 7, 12, 0, 10, BLACK); cube(9, 1, 8, 11, 1, 10, BLACK); cube(9, 2, 9, 10, 2, 10, BLACK);
cube(12, 0, 1, 13, 0, 2, IRON); cube(12, 1, 1, 13, 1, 1, GOLD); block(12, 1, 2, COPPER);
cube(12, 0, 4, 13, 2, 5, PLANKS); cube(12, 1, 4, 13, 1, 5, OAK_LOG);   // barrel

// ===== yard: grindstone =====
mixBox(10, 0, -8, 14, 0, -2, cobMix);
for (let dy = -2; dy <= 2; dy++) for (let dz = -2; dz <= 2; dz++) {
  const d = dy * dy + dz * dz;
  if (d <= 4.5) block(12, 3 + dy, -5 + dz, d > 2 ? GRAY : STONE);
}
cube(11, 1, -5, 11, 2, -5, OAK_LOG); cube(13, 1, -5, 13, 2, -5, OAK_LOG);
cube(11, 1, -7, 13, 1, -7, OAK_LOG); cube(11, 1, -3, 13, 1, -3, OAK_LOG);
block(11, 3, -5, IRON); block(13, 3, -5, IRON); block(10, 3, -5, IRON); block(10, 4, -5, OAK_LOG);

// ore cart
for (const z of [-12, -8]) {
  cube(11, 1, z, 11, 3, z, OAK_LOG); block(10, 2, z, OAK_LOG); block(12, 2, z, OAK_LOG); block(11, 2, z, IRON);
}
cube(9, 3, -11, 13, 3, -9, PLANKS);
for (let x = 9; x <= 13; x++) { block(x, 4, -11, PLANKS); block(x, 4, -9, PLANKS); }
block(9, 4, -10, PLANKS); block(13, 4, -10, PLANKS);
mixBox(10, 4, -10, 12, 4, -10, [[IRON, .4], [STONE, .4], [COPPER, .2]]);
block(11, 5, -10, GOLD);
line(8, 3, -11, 6, 1, -11, OAK_LOG); line(8, 3, -9, 6, 1, -9, OAK_LOG);

// suit of armor on a stand
cube(4, 0, -7, 6, 0, -5, PLANKS);
cube(4, 1, -6, 4, 2, -6, IRON); cube(6, 1, -6, 6, 2, -6, IRON);
cube(4, 3, -7, 6, 5, -5, IRON); cube(4, 3, -7, 6, 3, -7, BROWN); block(5, 4, -7, GOLD);
block(3, 5, -6, IRON); block(7, 5, -6, IRON); cube(3, 3, -6, 3, 4, -6, IRON); cube(7, 3, -6, 7, 4, -6, IRON);
cube(4, 6, -7, 6, 8, -5, IRON); cube(4, 7, -7, 6, 7, -7, BLACK);
block(5, 9, -6, RED); block(5, 9, -5, RED); block(5, 10, -6, RED);
// sword stuck in the ground
line(8, 0, -6, 8, 2, -6, IRON); cube(8, 3, -7, 8, 3, -5, GOLD); block(8, 4, -6, BROWN); block(8, 5, -6, GOLD);

// ===== horse waiting to be shod, tied to a post =====
mixBox(-19, 0, -9, -7, 0, -5, [[GRASS, .55], [DIRT, .45]]);
for (const x of [-18, -14]) for (const z of [-8, -6]) { block(x, 1, z, BLACK); cube(x, 2, z, x, 3, z, BROWN); }
block(-14, 2, -8, WHITE); block(-14, 2, -6, WHITE);
cube(-18, 4, -8, -13, 6, -6, BROWN);
cube(-13, 7, -8, -12, 9, -6, BROWN);
cube(-12, 9, -8, -9, 10, -6, BROWN);
block(-9, 10, -7, WHITE); block(-9, 9, -7, WHITE);
block(-11, 10, -8, BLACK); block(-11, 10, -6, BLACK);
block(-12, 11, -8, BROWN); block(-12, 11, -6, BROWN); block(-12, 11, -7, BLACK);
cube(-14, 7, -7, -14, 8, -7, BLACK); block(-13, 10, -7, BLACK);
line(-19, 6, -7, -19, 5, -7, BLACK); line(-20, 4, -7, -20, 2, -7, BLACK);
cube(-17, 7, -8, -15, 7, -6, RED); block(-16, 8, -7, BROWN);
cube(-17, 5, -9, -15, 6, -9, RED); cube(-17, 5, -9, -15, 5, -9, GOLD);
cube(-17, 5, -5, -15, 6, -5, RED); cube(-17, 5, -5, -15, 5, -5, GOLD);
cube(-8, 1, -7, -8, 4, -7, OAK_LOG); line(-9, 8, -7, -8, 5, -7, BROWN);
cube(-20, 0, -4, -19, 1, -3, YELLOW);    // hay bale