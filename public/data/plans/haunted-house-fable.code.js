// haunted-house-fable — prompt:
// a haunted house on Halloween night...

const H = GRAY, T = BLACK, R = OBSIDIAN;
function ring(x1, y, z1, x2, z2, id) {
  cube(x1, y, z1, x2, y, z1, id); cube(x1, y, z2, x2, y, z2, id);
  cube(x1, y, z1, x1, y, z2, id); cube(x2, y, z1, x2, y, z2, id);
}

// ---- clear the site (trees/leaves) above ground ----
cube(-16, 1, -13, 16, 9, 14, AIR);

// ---- foundations ----
cube(-9, 0, -3, 9, 0, 13, COBBLE);
cube(-15, 0, 0, -8, 0, 10, COBBLE);

// ---- main house body (front = north wall at z=-2) ----
cube(-8, 1, -2, 8, 10, -2, H);
cube(-8, 1, 12, 8, 10, 12, H);
cube(-8, 1, -1, -8, 10, 11, H);
cube(8, 1, -1, 8, 10, 11, H);
for (const [x, z] of [[-8, -2], [8, -2], [-8, 12], [8, 12]]) cube(x, 1, z, x, 10, z, T);
ring(-8, 1, -2, 8, 12, T);
ring(-8, 6, -2, 8, 12, T);

// ---- stepped roof (glossy black shingles) ----
for (let i = 0; i < 8; i++) ring(-9 + i, 11 + i, -3 + i, 9 - i, 13 - i, (i % 2) ? T : R);
cube(-1, 19, 5, 1, 19, 5, R);

// ---- front gable with attic window ----
for (let i = 0; i < 7; i++) {
  const w = 6 - i;
  cube(-w, 11 + i, -4, w, 11 + i, 1, H);
  block(-w, 11 + i, -4, T); block(w, 11 + i, -4, T);
}
block(0, 18, -4, T);
cube(-1, 12, -4, 0, 13, -4, GLOWSTONE);

// ---- windows: front (lit) ----
cube(-6, 3, -2, -5, 4, -2, YELLOW); cube(5, 3, -2, 6, 4, -2, YELLOW);
cube(-6, 8, -2, -5, 9, -2, YELLOW); cube(5, 8, -2, 6, 9, -2, YELLOW);
cube(-1, 8, -2, 0, 9, -2, YELLOW); block(0, 9, -2, GLOWSTONE);
// shutters
for (const y of [3, 8]) {
  cube(-7, y, -2, -7, y + 1, -2, T); cube(-4, y, -2, -4, y + 1, -2, T);
  cube(4, y, -2, 4, y + 1, -2, T); cube(7, y, -2, 7, y + 1, -2, T);
}
cube(-2, 8, -2, -2, 9, -2, T); cube(1, 8, -2, 1, 9, -2, T);
// side windows
cube(8, 3, 3, 8, 4, 4, YELLOW); cube(8, 3, 8, 8, 4, 9, YELLOW);
cube(8, 8, 3, 8, 9, 4, YELLOW); cube(8, 8, 8, 8, 9, 9, YELLOW);
cube(-8, 8, 3, -8, 9, 4, YELLOW); cube(-8, 8, 8, -8, 9, 9, YELLOW);
block(-8, 9, 8, BLACK); // one broken pane

// ---- front door (open, dark, glowing eyes inside) ----
cube(-1, 2, -2, 0, 4, -2, AIR);
cube(-2, 2, -2, -2, 5, -2, T); cube(1, 2, -2, 1, 5, -2, T); cube(-2, 5, -2, 1, 5, -2, T);
block(-1, 3, 1, NEON_RED); block(0, 3, 1, NEON_RED);

// ---- porch ----
cube(-8, 1, -7, 8, 1, -3, PLANKS);
cube(-2, 0, -9, 1, 0, -8, COBBLE);
for (const x of [-8, -4, 4, 8]) cube(x, 2, -7, x, 5, -7, OAK_LOG);
cube(-9, 6, -8, 9, 6, -3, R);
cube(-8, 2, -7, -3, 2, -7, PLANKS); cube(3, 2, -7, 8, 2, -7, PLANKS);
cube(-8, 2, -6, -8, 2, -3, PLANKS); cube(8, 2, -6, 8, 2, -3, PLANKS);
// balcony railing on porch roof
cube(-9, 7, -8, 9, 7, -8, IRON); cube(-9, 7, -7, -9, 7, -3, IRON); cube(9, 7, -7, 9, 7, -3, IRON);
block(0, 5, -5, GLOWSTONE); // hanging porch lantern

// jack-o-lanterns on the porch
cube(-5, 2, -6, -3, 3, -5, ORANGE);
block(-5, 3, -6, GLOWSTONE); block(-3, 3, -6, GLOWSTONE); block(-4, 2, -6, BLACK);
cube(3, 2, -6, 5, 3, -5, ORANGE);
block(3, 3, -6, GLOWSTONE); block(5, 3, -6, GLOWSTONE); block(4, 2, -6, BLACK);

// ---- west wing ----
cube(-14, 1, 1, -9, 6, 1, H); cube(-14, 1, 9, -9, 6, 9, H); cube(-14, 1, 2, -14, 6, 8, H);
cube(-14, 1, 1, -14, 6, 1, T); cube(-14, 1, 9, -14, 6, 9, T);
cube(-15, 7, 0, -8, 7, 10, R); cube(-14, 8, 1, -9, 8, 9, T);
cube(-13, 9, 2, -9, 9, 8, R); cube(-12, 10, 3, -9, 10, 7, T);
cube(-12, 3, 1, -11, 4, 1, YELLOW); cube(-14, 3, 4, -14, 4, 5, YELLOW);
cube(-13, 3, 1, -13, 4, 1, T); cube(-10, 3, 1, -10, 4, 1, T);

// ---- east tower with witch-hat spire ----
hollowCylinder(10, 1, -1, 3, 16, H);
hollowCylinder(10, 1, -1, 3, 1, T);
hollowCylinder(10, 6, -1, 3, 1, T);
hollowCylinder(10, 12, -1, 3, 1, T);
for (const y of [3, 4, 9, 10, 14, 15]) block(10, y, -4, YELLOW);
for (const y of [3, 4, 9, 10]) block(13, y, -1, YELLOW);
block(10, 15, -4, GLOWSTONE);
cylinder(10, 17, -1, 4, 1, T);
cylinder(10, 18, -1, 3, 2, R);
cylinder(10, 20, -1, 2, 2, R);
cylinder(10, 22, -1, 1, 2, R);
block(10, 24, -1, T);
cube(10, 25, -1, 10, 28, -1, IRON);
block(10, 29, -1, ELECTRIC); block(9, 31, -2, ELECTRIC); block(11, 31, 0, ELECTRIC);

// ---- chimney ----
cube(5, 9, 8, 6, 15, 9, BRICK);
block(6, 16, 9, FIRE);

// ---- path & front fence with torches ----
cube(-2, -1, -13, 1, -1, -9, COBBLE);
cube(-18, 1, -14, -4, 2, -14, IRON); cube(3, 1, -14, 18, 2, -14, IRON);
for (const x of [-18, -14, -10, -6, 6, 10, 14, 18]) cube(x, -1, -14, x, 2, -14, COBBLE);
cube(-3, -1, -14, -3, 3, -14, COBBLE); cube(2, -1, -14, 2, 3, -14, COBBLE);
block(-3, 4, -14, FIRE); block(2, 4, -14, FIRE);
block(-18, 3, -14, BLACK); block(14, 3, -14, BLACK); // crows

// ---- graveyard (west front) ----
cube(-15, 1, -12, -8, 2, -12, IRON); cube(-15, 1, -11, -15, 2, -5, IRON); cube(-15, 1, -4, -8, 2, -4, IRON);
for (const [x, z] of [[-15, -12], [-8, -12], [-15, -4], [-8, -4]]) cube(x, 0, z, x, 3, z, COBBLE);
function grave(x, z, cross) {
  cube(x - 1, 0, z - 1, x + 1, 0, z + 1, DIRT);
  cube(x, 1, z, x, 2, z, LIGHT_GRAY);
  block(x, 3, z, LIGHT_GRAY);
  if (cross) { block(x - 1, 2, z, LIGHT_GRAY); block(x + 1, 2, z, LIGHT_GRAY); }
  else { block(x, 3, z, GRAY); }
}
grave(-13, -10, true); grave(-10, -10, false); grave(-13, -7, false); grave(-10, -7, true); grave(-12, -5, false);
block(-12, 3, -9, NEON_BLUE); block(-10, 2, -5, NEON_BLUE); // will-o-wisps

// ghost drifting over the graves
cube(-12, 5, -10, -11, 7, -9, WHITE);
block(-12, 8, -10, WHITE); block(-11, 8, -10, WHITE);
block(-12, 7, -10, BLACK); block(-11, 7, -10, BLACK);
block(-12, 4, -10, WHITE); block(-11, 4, -9, WHITE);

// ---- pumpkin patch (east front) ----
sphere(10, 2, -9, 2, ORANGE);
block(9, 3, -10, GLOWSTONE); block(11, 3, -10, GLOWSTONE); block(10, 2, -11, BLACK);
sphere(14, 1, -7, 1, ORANGE);
block(13, 1, -8, GLOWSTONE);
line(8, 1, -8, 15, 1, -10, LEAVES);

// ---- dead trees ----
function deadTree(x, z, b) {
  cube(x - 1, b, z - 1, x + 1, b + 1, z + 1, OAK_LOG);
  cube(x, b, z, x, b + 7, z, OAK_LOG);
  line(x, b + 5, z, x - 3, b + 8, z - 1, OAK_LOG);
  line(x, b + 6, z, x + 3, b + 9, z + 1, OAK_LOG);
  line(x, b + 7, z, x - 1, b + 11, z + 2, OAK_LOG);
  line(x, b + 7, z, x + 1, b + 10, z - 2, OAK_LOG);
  line(x - 3, b + 8, z - 1, x - 5, b + 10, z - 2, OAK_LOG);
  line(x + 3, b + 9, z + 1, x + 4, b + 12, z, OAK_LOG);
  line(x - 1, b + 11, z + 2, x - 2, b + 13, z + 1, OAK_LOG);
}
deadTree(-16, -9, -1);
deadTree(16, -8, 0);
deadTree(-18, 6, -1);

// ---- bats ----
function bat(x, y, z) {
  block(x, y, z, BLACK); block(x - 1, y + 1, z, BLACK); block(x + 1, y + 1, z, BLACK);
  block(x - 2, y, z, BLACK); block(x + 2, y, z, BLACK);
}
bat(-6, 16, -9); bat(3, 19, -11); bat(13, 22, -6); bat(-14, 14, -6); bat(7, 14, -12); bat(-2, 23, -7);