// jungle-temple-sonnet — prompt:
// a jungle temple with a waterfall...

// ============================================================
// JUNGLE TEMPLE WITH WATERFALL
// Stepped stone pyramid facing north, central staircase,
// shrine hut + idol on top, waterfall cliff + pool to the east,
// jungle canopy, vines, moss, torches.
// ============================================================

// Clear canopy space over the build footprint (free, doesn't touch budget)
cube(-13, 1, -6, 16, 20, 16, AIR);

// ---------- Stepped pyramid tiers ----------
const tiers = [
  { x: 9, z0: -3, z1: 13, y0: -1, y1: 1 },
  { x: 7, z0: -1, z1: 11, y0: 2,  y1: 4 },
  { x: 5, z0: 1,  z1: 9,  y0: 5,  y1: 7 },
  { x: 3, z0: 2,  z1: 8,  y0: 8,  y1: 10 },
];

for (const t of tiers) {
  cube(-t.x, t.y0, t.z0, t.x, t.y1, t.z1, STONE);
  hollowCube(-t.x, t.y1, t.z0, t.x, t.y1, t.z1, COBBLE); // rim trim
}

// top platform
cube(-1, 11, 3, 1, 11, 7, STONE);
hollowCube(-1, 11, 3, 1, 11, 7, COBBLE);

// ---------- Central staircase (climbs north face) ----------
const stairBands = [
  { z0: -4, z1: -3, topY: -1 }, // ground apron
  { z0: -3, z1: -2, topY: 1 },
  { z0: -1, z1: 0,  topY: 4 },
  { z0: 1,  z1: 1,  topY: 7 },
  { z0: 2,  z1: 2,  topY: 10 },
  { z0: 3,  z1: 3,  topY: 11 },
];
for (const b of stairBands) {
  cube(-2, -1, b.z0, 2, b.topY, b.z1, COBBLE);
}

// ---------- Relief glyph carvings on exposed north faces ----------
for (let x = -9; x <= 9; x++) {
  if (x >= -2 && x <= 2) continue;
  for (let y = -1; y <= 1; y++) {
    if ((x + y) % 2 === 0) block(x, y, -3, BRICK);
  }
}
for (let x = -6; x <= 6; x++) {
  if (x >= -2 && x <= 2) continue;
  for (let y = 2; y <= 4; y++) {
    if ((x + y) % 2 === 0) block(x, y, -1, BRICK);
  }
}

// ---------- Guardian pedestals + torches flanking the stair base ----------
cube(-4, -1, -4, -3, 0, -3, COBBLE);
cube(3, -1, -4, 4, 0, -3, COBBLE);
block(-3, 1, -3, FIRE);
block(4, 1, -3, FIRE);
block(-3, 2, -3, NEON_RED);
block(4, 2, -3, NEON_RED);

// ---------- Vines hanging off tier edges ----------
function vine(x, z, topY, length, id) {
  for (let i = 0; i < length; i++) block(x, topY - i, z, id);
}
const vineSpotsTier1 = [-8, -6, 6, 8, -9, 9];
for (const vx of vineSpotsTier1) vine(vx, -4, 1, 3 + Math.floor(Math.random() * 2), LEAVES);
const vineSpotsTier2 = [-6, -4, 4, 6];
for (const vx of vineSpotsTier2) vine(vx, -2, 4, 3, LEAVES);
const vineSpotsTier3 = [-4, 4];
for (const vx of vineSpotsTier3) vine(vx, 0, 7, 2, LEAVES);

// ---------- Moss speckle on tier tops ----------
function mossPatch(xr, z0, z1, y) {
  for (let i = 0; i < 14; i++) {
    const x = Math.round(-xr + Math.random() * xr * 2);
    const z = Math.round(z0 + Math.random() * (z1 - z0));
    if (x >= -2 && x <= 2 && z >= -4 && z <= 3) continue; // keep stairs clear
    block(x, y + 1, z, LEAVES);
  }
}
mossPatch(9, -3, 13, 1);
mossPatch(7, -1, 11, 4);
mossPatch(5, 1, 9, 7);

// ---------- Shrine hut on top platform ----------
for (const px of [-1, 1]) {
  for (const pz of [4, 6]) {
    cube(px, 12, pz, px, 15, pz, OAK_LOG);
  }
}
cube(-2, 16, 3, 2, 16, 7, COBBLE);   // eave
cube(-1, 17, 4, 1, 17, 6, STONE);   // upper roof
block(0, 18, 5, STONE);             // ridge cap
cube(-1, 12, 3, 1, 12, 7, PLANKS);  // floor (overwrites platform top locally)
// reopen entrance (north side) and walk path
cube(-1, 12, 3, 1, 15, 3, AIR);

// Golden idol facing north inside the hut
cube(0, 12, 5, 0, 14, 5, GOLD);
block(-1, 13, 5, GOLD);
block(1, 13, 5, GOLD);
block(0, 15, 5, GOLD);
block(0, 16, 5, NEON_RED); // glowing crown gem

// ---------- Waterfall cliff (east side, catches extra light) ----------
const cliffX0 = 11, cliffX1 = 14, cliffZ0 = 0, cliffZ1 = 6, cliffY0 = -1, cliffY1 = 9;
cube(cliffX0, cliffY0, cliffZ0, cliffX1, cliffY1, cliffZ1, STONE);
// mossy speckle on cliff face
for (let i = 0; i < 20; i++) {
  const y = cliffY0 + Math.floor(Math.random() * (cliffY1 - cliffY0));
  const z = cliffZ0 + Math.floor(Math.random() * (cliffZ1 - cliffZ0));
  block(cliffX1, y, z, LEAVES);
}
// water sheet cascading down the west (temple-facing) face
cube(cliffX0, cliffY0, cliffZ0 + 2, cliffX0, cliffY1 - 2, cliffZ0 + 4, WATER);
// jungle cap on top of the cliff
sphere(12, 10, 3, 3, LEAVES);
cube(12, 8, 3, 12, 10, 3, OAK_LOG);

// pool at the base + shoreline
disk(12, -1, 3, 4, SAND);
disk(12, -1, 3, 3, WATER);
// small creek running toward the viewer
cube(11, -1, -3, 12, -1, 3, WATER);
cube(10, -1, -4, 13, -1, -3, SAND);

// ---------- Jungle canopy trees around the site ----------
function tree(x, z, trunkH, leafR) {
  cylinder(x, -1, z, 1, trunkH, OAK_LOG);
  sphere(x, -1 + trunkH, z, leafR, LEAVES);
}
tree(-14, -2, 6, 3);
tree(-13, 6, 7, 3);
tree(-11, 14, 6, 3);
tree(11, -5, 5, 2);
tree(15, 8, 6, 3);
tree(13, 13, 5, 2);
tree(-6, 15, 6, 3);
tree(6, 15, 6, 3);
tree(-16, 10, 6, 3);
tree(2, -6, 5, 2);

// stray vines from canopy trees
vine(-14, -2, 5, 3, LEAVES);
vine(15, 8, 8, 3, LEAVES);
vine(-6, 15, 6, 2, LEAVES);