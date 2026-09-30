// eye-of-sauron-sonnet — prompt:
// the Eye of Sauron on the tower of Barad-dur...

const CX = 0, CZ = 6;

// ---- Clear the site of forest ----
cylinder(CX, -1, CZ, 13, 22, AIR);

// ---- Courtyard / plinth ----
disk(CX, -1, CZ, 13, OBSIDIAN);
disk(CX, -1, CZ, 11, BLACK);
disk(CX, -1, CZ, 8, OBSIDIAN);
hollowCylinder(CX, -1, CZ, 13, 1, BLACK);
hollowCylinder(CX, -1, CZ, 10, 1, GRAY);
hollowCylinder(CX, -1, CZ, 6, 1, GRAY);

// lava moat ringing the base
hollowCylinder(CX, -1, CZ, 12, 1, LAVA);

// braziers at courtyard corners
function brazier(x, z) {
  cylinder(x, -1, z, 1, 2, IRON);
  block(x, 1, z, FIRE);
}
brazier(CX - 9, CZ - 9);
brazier(CX + 9, CZ - 9);
brazier(CX - 9, CZ + 9);
brazier(CX + 9, CZ + 9);

// scattered rubble / boulders
sphere(CX - 11, -1, CZ - 3, 1, COBBLE);
sphere(CX + 11, -1, CZ + 4, 1, STONE);
sphere(CX - 10, -1, CZ + 10, 1, COBBLE);
sphere(CX + 9, -1, CZ - 12, 1, STONE);

// ---- Entrance stairway, north approach ----
for (let i = 0; i < 8; i++) {
  const z = CZ - 13 + i;
  const y = -2 + Math.floor(i / 2);
  cube(CX - 3, -3, z, CX + 3, y, z, STONE);
}

// flanking gate towers
function gateTower(x, z) {
  cylinder(x, -1, z, 2, 6, OBSIDIAN);
  hollowCylinder(x, 5, z, 2, 1, BLACK);
  block(x, 6, z, NEON_RED);
}
gateTower(CX - 6, CZ - 11);
gateTower(CX + 6, CZ - 11);

// helper: place a block at each angular slot around a circle
function ringBlocks(cx, y, cz, r, count, id, step = 1) {
  for (let i = 0; i < count; i++) {
    if (i % step !== 0) continue;
    const a = i * ((2 * Math.PI) / count);
    const x = Math.round(cx + r * Math.cos(a));
    const z = Math.round(cz + r * Math.sin(a));
    block(x, y, z, id);
  }
}

// helper: punch a small window through a shell at radius r
function windowRing(cx, y, cz, r, count) {
  for (let i = 0; i < count; i++) {
    const a = i * ((2 * Math.PI) / count);
    const x = Math.round(cx + r * Math.cos(a));
    const z = Math.round(cz + r * Math.sin(a));
    block(x, y, z, AIR);
    block(x, y + 1, z, AIR);
  }
}

// ---- Base bastion ----
hollowCylinder(CX, 0, CZ, 10, 4, OBSIDIAN);
cylinder(CX, 0, CZ, 10, 1, STONE);
windowRing(CX, 1, CZ, 10, 8);
ringBlocks(CX, 4, CZ, 10, 32, BLACK, 2);

// north doorway with iron frame
cube(CX - 1, 0, CZ - 11, CX + 1, 2, CZ - 9, AIR);
cube(CX - 2, -1, CZ - 10, CX - 2, 2, CZ - 10, IRON);
cube(CX + 2, -1, CZ - 10, CX + 2, 2, CZ - 10, IRON);
cube(CX - 2, 2, CZ - 10, CX + 2, 2, CZ - 10, IRON);

// vertical buttress columns, base to crown
for (let i = 0; i < 8; i++) {
  const a = i * (Math.PI / 4);
  const x = Math.round(CX + 10 * Math.cos(a));
  const z = Math.round(CZ + 10 * Math.sin(a));
  line(x, 0, z, x, 24, z, BLACK);
}

// ---- Tier 1 shaft ----
hollowCylinder(CX, 4, CZ, 8, 9, OBSIDIAN);
windowRing(CX, 6, CZ, 8, 8);
windowRing(CX, 9, CZ, 8, 8);
hollowCylinder(CX, 12, CZ, 8, 1, BLACK);
ringBlocks(CX, 13, CZ, 8, 16, BLACK, 2);

// hanging banners
for (let i = 0; i < 4; i++) {
  const a = i * (Math.PI / 2) + 0.4;
  const x = Math.round(CX + 8 * Math.cos(a));
  const z = Math.round(CZ + 8 * Math.sin(a));
  line(x, 9, z, x, 12, z, RED);
}

// ---- Tier 2 shaft ----
hollowCylinder(CX, 13, CZ, 6, 7, OBSIDIAN);
windowRing(CX, 15, CZ, 6, 6);
windowRing(CX, 18, CZ, 6, 6);
hollowCylinder(CX, 20, CZ, 6, 1, BLACK);
ringBlocks(CX, 21, CZ, 6, 12, BLACK, 2);

// ---- Tier 3 shaft ----
hollowCylinder(CX, 21, CZ, 4, 5, OBSIDIAN);
hollowCylinder(CX, 23, CZ, 4, 1, BLACK);
windowRing(CX, 24, CZ, 4, 4);
hollowCylinder(CX, 26, CZ, 4, 1, BLACK);
ringBlocks(CX, 27, CZ, 4, 10, BLACK, 2);

// ---- Crown of spikes ----
const spikeTips = [];
for (let i = 0; i < 10; i++) {
  const a = i * ((2 * Math.PI) / 10);
  const x0 = Math.round(CX + 3.5 * Math.cos(a));
  const z0 = Math.round(CZ + 3.5 * Math.sin(a));
  const x1 = Math.round(CX + 1.5 * Math.cos(a));
  const z1 = Math.round(CZ + 1.5 * Math.sin(a));
  line(x0, 27, z0, x1, 32, z1, BLACK);
  spikeTips.push([x1, z1]);
}

// crackling storm around the crown
for (let i = 0; i < 6; i++) {
  const [x, z] = spikeTips[i * 1.6 | 0];
  block(x, 32, z, ELECTRIC);
}

// ---- The Eye of Sauron, atop the crown, facing north ----
const EY = 29;
sphere(CX, EY, CZ, 3, ORANGE);
sphere(CX, EY, CZ, 2, RED);
sphere(CX, EY, CZ, 1, NEON_RED);

// vertical cat-slit pupil on the north (viewer-facing) side
line(CX, EY - 3, CZ - 3, CX, EY + 3, CZ - 3, BLACK);
line(CX, EY - 2, CZ - 2, CX, EY + 2, CZ - 2, BLACK);
block(CX, EY, CZ - 4, BLACK);

// wisps of flame rising off the eye
block(CX - 2, EY + 4, CZ - 1, FIRE);
block(CX + 2, EY + 4, CZ - 1, FIRE);
block(CX, EY + 5, CZ - 2, FIRE);
block(CX - 3, EY + 2, CZ - 2, FIRE);
block(CX + 3, EY + 2, CZ - 2, FIRE);
block(CX, EY + 2, CZ - 4, FIRE);