// graveyard-zombie-fable — prompt:
// a zombie rising from a graveyard...

// Zombie rising from a graveyard — front faces NORTH (-Z)
// Terrain: ground ~y=0 (grass at y=-1..0). Several oak trees around; clear a few.

// ---------- helpers ----------
function clearTree(x, z) { cube(x - 3, 0, z - 3, x + 3, 9, z + 3, AIR); }
function rnd(seed) { let t = seed * 9301 + 49297; return ((t % 233280) / 233280); }

// Clear nearby trees that collide with the scene
clearTree(1, -7); clearTree(4, -3); clearTree(0, 1); clearTree(-6, -1); clearTree(-7, -5);
clearTree(-6, -8); clearTree(-7, 4); clearTree(-2, 7); clearTree(7, -2); clearTree(8, -1);
clearTree(8, 3); clearTree(3, -10); clearTree(-1, -10); clearTree(1, -13); clearTree(-10, 8);
clearTree(-6, 9); clearTree(-7, 8); clearTree(-5, 13);

// ---------- graveyard ground: dark dirt patch with cobble path ----------
for (let x = -16; x <= 16; x++) for (let z = -14; z <= 14; z++) {
  const d = Math.sqrt(x * x * 0.6 + z * z);
  if (d < 15) {
    const r = rnd(x * 73 + z * 131);
    block(x, 0, z, r < 0.55 ? DIRT : (r < 0.8 ? GRASS : COBBLE));
  }
}
// winding cobble path from the north toward the zombie
for (let z = -20; z <= -4; z++) {
  const cx = Math.round(Math.sin(z * 0.35) * 2);
  cube(cx - 1, 0, z, cx + 1, 0, z, COBBLE);
  if (z % 3 === 0) block(cx + 2, 0, z, STONE);
}

// ---------- the open grave (crater) ----------
cube(-3, -3, -2, 3, 0, 4, AIR);          // dug out hole
cube(-4, -4, -3, 4, -4, 5, DIRT);        // floor of grave
hollowCube(-4, -3, -3, 4, 0, 5, DIRT);   // walls
// scattered dirt mounds thrown out of the grave
cube(-6, 1, 0, -4, 1, 3, DIRT); block(-6, 2, 1, DIRT); block(-5, 2, 2, DIRT);
cube(4, 1, -1, 6, 1, 2, DIRT); block(5, 2, 0, DIRT); block(6, 2, 1, DIRT);
block(-3, 1, 5, DIRT); block(0, 1, 6, DIRT); block(2, 1, 5, DIRT);
// broken coffin planks at the grave edge
cube(-2, 1, 5, 2, 1, 6, PLANKS); block(3, 1, 6, PLANKS); block(-3, 2, 6, PLANKS);
block(4, 1, 4, PLANKS); block(-4, 1, -1, PLANKS);

// ---------- the ZOMBIE (waist-up, climbing out, facing north) ----------
const Z_SKIN = GREEN, Z_DARK = LIME, Z_SHIRT = CYAN, Z_PANTS = BLUE;
// torso (emerging from grave, 6 wide, 4 deep) — leaning forward toward north
cube(-3, -1, 0, 2, 7, 3, Z_SHIRT);           // body y=-1..7
cube(-3, -1, 0, 2, 1, 3, Z_PANTS);           // hint of pants at bottom
// torn shirt patches / exposed rotting skin
block(-3, 4, 0, Z_SKIN); block(1, 3, 0, Z_SKIN); block(-1, 5, 0, Z_DARK); block(2, 6, 0, Z_SKIN);
block(-2, 2, 0, Z_DARK); block(0, 6, 0, Z_SKIN); block(-3, 6, 3, Z_SKIN);
// exposed ribs on the chest
line(-2, 4, -1, 1, 4, -1, LIGHT_GRAY); // sticks out a bit at the front (z=-1)
block(-1, 3, -1, LIGHT_GRAY); block(0, 2, -1, LIGHT_GRAY);
// neck
cube(-1, 8, 1, 0, 8, 2, Z_SKIN);
// head (4x4x4), slightly tilted forward
cube(-2, 9, 0, 1, 12, 3, Z_SKIN);
cube(-2, 13, 0, 1, 13, 3, Z_DARK);           // rotten top of scalp
block(-2, 13, 0, BLACK); block(1, 13, 3, BLACK); block(0, 13, 1, BLACK); // patchy hair
// face on north side (z=-1 protrusions / z=0 recesses)
block(-2, 11, 0, NEON_RED); block(1, 11, 0, NEON_RED); // glowing eyes
block(-1, 11, 0, BLACK); block(0, 11, 0, BLACK);       // sunken eye sockets between
block(-1, 10, 0, Z_DARK); block(0, 10, 0, Z_DARK);     // nose cavity
cube(-2, 9, 0, 1, 9, 0, BLACK);                        // open mouth
block(-2, 9, 0, WHITE); block(0, 9, 0, WHITE);         // teeth
block(-1, 8, 0, Z_DARK);                               // drooping jaw
// jaw hanging below
cube(-2, 8, 0, 1, 8, 0, Z_DARK);
// LEFT arm (viewer's right, +X) — reaching up and forward, hand clawing the grave edge
cube(3, 5, 0, 4, 7, 2, Z_SHIRT);            // shoulder
cube(4, 6, -1, 5, 8, 0, Z_SKIN);            // upper arm forward
cube(5, 2, -3, 6, 7, -2, Z_SKIN);           // forearm down to ground north of the grave
cube(5, 1, -5, 7, 1, -3, Z_SKIN);           // hand on ground
block(5, 1, -6, Z_DARK); block(6, 1, -6, Z_DARK); block(7, 1, -6, Z_DARK); // fingers
block(8, 1, -4, Z_DARK);                    // thumb
// RIGHT arm (viewer's left, -X) — raised high, grasping at the sky
cube(-5, 5, 0, -4, 7, 2, Z_SHIRT);          // shoulder
cube(-6, 7, 0, -5, 11, 1, Z_SKIN);          // upper arm up
cube(-7, 11, -1, -6, 14, 0, Z_SKIN);        // forearm leaning forward
cube(-8, 14, -2, -6, 15, -1, Z_SKIN);       // hand
block(-8, 16, -2, Z_DARK); block(-7, 16, -3, Z_DARK); block(-6, 16, -2, Z_DARK); block(-5, 15, -2, Z_DARK);
// torn sleeve bits
block(-4, 8, 0, Z_SHIRT); block(-4, 8, 2, Z_SHIRT); block(3, 8, 1, Z_SHIRT);

// ---------- the zombie's own headstone (behind it, south) ----------
cube(-2, 1, 7, 2, 5, 8, STONE);
cube(-1, 6, 7, 1, 6, 8, STONE);
cube(-1, 1, 6, 1, 1, 6, COBBLE); // base step
block(0, 4, 6, BLACK); block(-1, 3, 6, BLACK); block(1, 3, 6, BLACK); // carved inscription
line(-2, 5, 6, 2, 5, 6, LIGHT_GRAY);
cube(-2, 1, 9, 2, 1, 9, DIRT);

// ---------- graveyard: rows of gravestones ----------
function headstone(x, z, kind, tilt) {
  const s = (kind % 3 === 0) ? STONE : (kind % 3 === 1 ? COBBLE : LIGHT_GRAY);
  if (kind % 4 === 0) {
    // cross
    cube(x, 1, z, x, 4, z, s);
    cube(x - 1, 3, z, x + 1, 3, z, s);
  } else if (kind % 4 === 1) {
    // rounded tall stone
    cube(x - 1, 1, z, x + 1, 3, z, s);
    block(x, 4, z, s);
    block(x, 2, z - 1, BLACK); // inscription nub
  } else if (kind % 4 === 2) {
    // broken / leaning slab
    cube(x - 1, 1, z, x + 1, 2, z, s);
    block(x + tilt, 3, z, s);
    block(x - tilt, 1, z - 1, COBBLE);
  } else {
    // square tomb block
    cube(x - 1, 1, z, x + 1, 2, z + 1, s);
    block(x, 3, z, s);
  }
  cube(x - 1, 1, z + 1, x + 1, 1, z + 3, DIRT); // mound behind
  if (kind % 5 === 0) cube(x - 1, 0, z + 1, x + 1, 0, z + 3, AIR); // sunken grave
}
const stones = [
  [-10, -8, 0, 1], [-6, -10, 1, -1], [7, -9, 2, 1], [11, -7, 3, 1],
  [-13, -3, 4, -1], [-10, 2, 5, 1], [-13, 6, 6, -1], [-9, 9, 7, 1],
  [9, -3, 8, 1], [13, 0, 9, -1], [10, 5, 10, 1], [13, 9, 11, -1],
  [-6, 12, 12, 1], [6, 11, 13, -1], [-15, -9, 14, 1], [14, -11, 15, -1],
  [-3, -10, 1, 1], [3, -12, 2, -1], [-14, 11, 3, 1], [8, 14, 0, 1],
];
for (const [x, z, k, t] of stones) headstone(x, z, k, t);

// ---------- second rising zombie hand (background, east) ----------
cube(10, -1, 1, 12, 0, 3, AIR);
cube(11, 0, 1, 11, 2, 2, Z_SKIN);
block(10, 3, 1, Z_DARK); block(11, 3, 0, Z_DARK); block(12, 3, 1, Z_DARK); block(12, 2, 3, Z_DARK);
cube(9, 1, 2, 10, 1, 4, DIRT); block(13, 1, 2, DIRT);
// and a skull peeking out in the west
cube(-10, -1, -1, -8, 0, 1, AIR);
cube(-10, 0, -1, -8, 1, 1, WHITE);
block(-10, 1, -1, BLACK); block(-8, 1, -1, BLACK); // eye sockets north face
block(-9, 0, -2, BLACK);
cube(-11, 1, 0, -11, 1, 2, DIRT); block(-7, 1, 1, DIRT);

// ---------- crypt / mausoleum in the background (south) ----------
cube(-6, 1, 14, 6, 7, 20, STONE);
cube(-5, 2, 14, 5, 5, 14, AIR);        // doorway cavity on the north face
cube(-5, 1, 15, 5, 6, 19, AIR);        // hollow interior
cube(-7, 8, 13, 7, 8, 21, COBBLE);     // roof slab
cube(-5, 9, 14, 5, 9, 20, COBBLE);
cube(-3, 10, 15, 3, 10, 19, COBBLE);
cube(-1, 11, 16, 1, 11, 18, STONE);
block(0, 12, 17, STONE); block(0, 13, 17, STONE); // spire
cube(-1, 14, 17, 1, 14, 17, STONE); block(0, 15, 17, STONE); // cross on top
// doorway details
cube(-2, 1, 14, 2, 4, 14, AIR);        // open door
cube(-2, 1, 14, 2, 4, 14, BLACK);      // dark interior visible
cube(-3, 1, 14, -3, 5, 14, COBBLE); cube(3, 1, 14, 3, 5, 14, COBBLE); // door frame
cube(-3, 5, 14, 3, 5, 14, COBBLE);
cube(-6, 1, 13, 6, 1, 13, COBBLE);     // front step
cube(-7, 0, 12, 7, 0, 12, STONE);
// pillars on front corners
cube(-7, 1, 13, -7, 7, 13, STONE); cube(7, 1, 13, 7, 7, 13, STONE);
// ivy / moss creeping on the crypt
block(-6, 3, 13, LEAVES); block(-6, 4, 13, LEAVES); block(-5, 5, 13, LEAVES); block(6, 2, 13, LEAVES);
block(6, 3, 13, LEAVES); block(5, 6, 13, LEAVES); block(-6, 6, 13, LEAVES); block(7, 4, 14, LEAVES);
// two lanterns flanking the door
block(-4, 4, 13, GLOWSTONE); block(4, 4, 13, GLOWSTONE);
cube(-4, 3, 13, -4, 3, 13, IRON); cube(4, 3, 13, 4, 3, 13, IRON);
// green glow from inside the crypt
block(0, 2, 16, NEON_BLUE);

// ---------- wrought-iron fence around the yard ----------
function fenceLine(x1, z1, x2, z2) {
  const dx = Math.sign(x2 - x1), dz = Math.sign(z2 - z1);
  let x = x1, z = z1, i = 0;
  while (true) {
    const post = (i % 4 === 0);
    cube(x, 1, z, x, post ? 3 : 2, z, IRON);
    if (post) block(x, 4, z, BLACK); // spearhead cap
    if (x === x2 && z === z2) break;
    x += dx; z += dz; i++;
  }
}
// west fence
fenceLine(-17, -13, -17, 13);
// east fence
fenceLine(17, -13, 17, 13);
// north fence with gate opening at x in [-3..3]
fenceLine(-17, -13, -4, -13);
fenceLine(4, -13, 17, -13);
// gate posts (stone pillars) at the path entrance
cube(-5, 1, -14, -4, 5, -13, STONE); cube(4, 1, -14, 5, 5, -13, STONE);
block(-4, 6, -13, COBBLE); block(5, 6, -13, COBBLE);
// arch over gate
line(-3, 6, -13, 3, 6, -13, IRON);
block(0, 7, -13, IRON); block(-1, 7, -13, IRON); block(1, 7, -13, IRON);
// lanterns on gate posts
block(-4, 5, -14, GLOWSTONE); block(5, 5, -14, GLOWSTONE);
block(-4, 6, -14, IRON); block(5, 6, -14, IRON);
// a fallen section of fence (broken)
cube(10, 1, -13, 12, 1, -13, AIR);
line(10, 1, -12, 12, 1, -11, IRON);

// ---------- dead trees ----------
function deadTree(x, z, h) {
  cube(x, 1, z, x, h, z, OAK_LOG);
  cube(x, 0, z, x, 0, z, DIRT);
  line(x, h - 2, z, x + 2, h + 1, z - 1, OAK_LOG);
  line(x, h - 1, z, x - 2, h + 2, z + 1, OAK_LOG);
  line(x, h, z, x + 1, h + 3, z + 1, OAK_LOG);
  line(x, h - 3, z, x - 1, h - 1, z - 1, OAK_LOG);
  block(x + 3, h + 2, z - 1, OAK_LOG); block(x - 3, h + 3, z + 1, OAK_LOG); block(x + 2, h + 4, z + 1, OAK_LOG);
  // roots
  block(x + 1, 1, z, OAK_LOG); block(x - 1, 1, z + 1, OAK_LOG); block(x, 1, z - 1, OAK_LOG);
}
deadTree(-14, 12, 9);
deadTree(13, 12, 8);
deadTree(-15, -10, 7);
// a crow on the dead tree
block(-12, 12, 11, BLACK); block(-12, 13, 11, BLACK); block(-11, 13, 11, BLACK);
block(-13, 11, 11, ORANGE);

// ---------- wisps / ghost light + ground fog hints ----------
block(-4, 3, -7, FIRE);    // ghostly flame on path (will-o-wisp)
block(6, 2, 8, FIRE);
block(-9, 3, 7, FIRE);
block(12, 4, -3, FIRE);
// candles / embers on a couple of graves
block(-10, 2, -9, GLOWSTONE);
block(11, 2, -8, GLOWSTONE);
// scattered bones on the ground
block(-2, 1, -4, WHITE); block(-1, 1, -4, WHITE); block(3, 1, -6, WHITE);
block(-7, 1, -3, WHITE); block(-6, 1, -4, LIGHT_GRAY); block(8, 1, 4, WHITE);
// loose grave soil & rocks around the yard
for (let i = 0; i < 40; i++) {
  const r1 = rnd(i * 17 + 3), r2 = rnd(i * 29 + 11);
  const x = Math.round(-15 + r1 * 30), z = Math.round(-12 + r2 * 24);
  if (Math.abs(x) > 8 || Math.abs(z) > 8) block(x, 1, z, i % 3 === 0 ? COBBLE : (i % 3 === 1 ? DIRT : STONE));
}
// moon-cold sky accent: a flock of bats over the crypt
for (const [bx, by, bz] of [[-3, 16, 10], [1, 18, 9], [4, 15, 11], [-6, 19, 12], [2, 21, 13]]) {
  block(bx, by, bz, BLACK); block(bx - 1, by + 1, bz, BLACK); block(bx + 1, by + 1, bz, BLACK);
}