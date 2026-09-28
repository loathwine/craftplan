// forge-sonnet — prompt:
// a blacksmith's forge...

// ===== Blacksmith's Forge =====
// Footprint X:-6..6 (13 wide), Z:-3..11 (path + shed, 14 deep). Front (open bay) faces -Z (north/camera).

function post(x, z, y1, y2, id) { line(x, y1, z, x, y2, z, id); }

// ---- Clear site (AIR is free) ----
cube(-8, 0, -4, 8, 13, 12, AIR);

// ---- Ground prep: cobblestone yard + grass border kept as-is outside ----
cube(-6, 0, -3, 6, 0, 11, COBBLE);
// floor tile variation (checkerboard stone/cobble inside shed)
for (let x = -6; x <= 6; x++) {
  for (let z = 0; z <= 11; z++) {
    if ((x + z) % 3 === 0) block(x, 0, z, STONE);
  }
}
// entrance path leading toward camera
cube(-1, 0, -3, 1, 0, -1, COBBLE);
line(-1, 0, -3, -1, 0, -3, COBBLE);

// low yard fence flanking the path (open gate at center)
for (const z of [-3, -2]) {
  post(-3, z, 1, 2, OAK_LOG);
  post(3, z, 1, 2, OAK_LOG);
}
line(-3, 2, -3, -3, 2, -2, PLANKS);
line(3, 2, -3, 3, 2, -2, PLANKS);

// ---- Foundation rim ----
hollowCube(-6, 0, 0, 6, 0, 11, STONE);

// ---- Back wall (solid, houses chimney) ----
cube(-6, 1, 11, 6, 4, 11, STONE);
cube(-6, 5, 11, 6, 5, 11, COBBLE);
// window slits
block(-4, 3, 11, AIR); block(4, 3, 11, AIR);

// ---- Low side walls (open-air shed, waist height) ----
cube(-6, 1, 0, -6, 2, 11, STONE);
cube(6, 1, 0, 6, 2, 11, STONE);
// coping
line(-6, 3, 0, -6, 3, 11, COBBLE);
line(6, 3, 0, 6, 3, 11, COBBLE);

// ---- Corner / bay posts + sloped shed roof ----
for (const z of [0, 3, 6, 9, 11]) {
  const topY = 6 + Math.floor(z / 3);
  post(-6, z, 1, topY, OAK_LOG);
  post(6, z, 1, topY, OAK_LOG);
}
post(-2, 0, 1, 6, OAK_LOG);
post(2, 0, 1, 6, OAK_LOG);

for (let z = 0; z <= 11; z++) {
  const y = 6 + Math.floor(z / 3);
  for (let x = -7; x <= 7; x++) {
    const shingle = (x + z) % 5 === 0 ? BROWN : PLANKS;
    block(x, y, z, shingle);
  }
  // riser fascia between roof steps
  if (z > 0) {
    const yPrev = 6 + Math.floor((z - 1) / 3);
    if (y !== yPrev) line(-7, yPrev, z, 7, yPrev, z, OAK_LOG);
  }
}
line(-7, 6, 0, 7, 6, 0, OAK_LOG); // front fascia beam
line(-7, 9, 11, 7, 9, 11, OAK_LOG); // rear ridge beam

// hanging lantern near entrance
block(0, 6, 1, IRON);
block(0, 5, 1, GLOWSTONE);

// ---- Chimney (brick, corbelled cap) ----
cube(-1, 1, 9, 1, 9, 11, BRICK);
for (let z = 9; z <= 11; z++) block(0, 1, z, STONE); // flue base
hollowCube(-1, 10, 9, 1, 10, 11, BRICK);
cube(-2, 11, 9, 2, 11, 11, BRICK);
// smoke / embers
block(0, 12, 10, FIRE);
block(0, 13, 10, FIRE);

// ---- Furnace / hearth (front of chimney, visible from camera) ----
cube(-2, 1, 8, 2, 3, 10, STONE);
cube(-2, 4, 8, 2, 4, 10, COBBLE);
// carve the mouth facing the viewer
cube(-1, 1, 8, 1, 2, 8, AIR);
// glowing coals + flame
block(0, 1, 8, LAVA);
block(-1, 1, 8, FIRE);
block(1, 1, 8, FIRE);
block(0, 2, 9, GLOWSTONE);

// bellows beside the furnace
cube(3, 1, 8, 3, 2, 9, BROWN);
cube(4, 1, 8, 4, 1, 9, PLANKS);
line(3, 2, 9, 4, 2, 9, PLANKS);

// ---- Anvil (center workspace) ----
cube(-1, 1, 4, 1, 1, 5, COBBLE);
block(0, 1, 4, OAK_LOG);
cube(-2, 2, 4, 2, 2, 4, IRON);
block(-3, 2, 4, IRON); // horn
block(2, 2, 4, IRON); // heel
block(0, 3, 4, IRON); // hammer resting on top

// ---- Workbench + ingots ----
cube(-4, 1, 5, -4, 1, 6, PLANKS);
block(-4, 2, 5, IRON);
block(-4, 2, 6, GOLD);
block(-3, 2, 5, COPPER);

// ---- Quench barrel ----
hollowCylinder(-4, 1, 3, 1, 2, OAK_LOG);
disk(-4, 3, 3, 1, WATER);

// second storage barrel near entrance
hollowCylinder(4, 1, 2, 1, 2, BROWN);
disk(4, 3, 2, 1, PLANKS);

// ---- Tool rack (left interior wall) ----
line(-5, 4, 4, -5, 4, 8, PLANKS);
block(-5, 3, 4, IRON);
block(-5, 3, 5, IRON);
block(-5, 3, 6, IRON);
block(-5, 3, 7, GOLD);
block(-5, 3, 8, IRON);

// ---- Wood pile (right side, near entrance) ----
cube(4, 1, 4, 5, 1, 6, OAK_LOG);
cube(4, 2, 4, 5, 2, 5, OAK_LOG);
line(4, 3, 4, 5, 3, 4, OAK_LOG);

// ---- Crates near entrance (left) ----
cube(-5, 1, 1, -4, 1, 2, PLANKS);
block(-5, 2, 1, PLANKS);
cube(4, 1, 1, 5, 1, 1, BRICK);

// ---- Ore crate outside near woodpile ----
cube(5, 1, 7, 5, 1, 8, STONE);
block(5, 2, 7, IRON);