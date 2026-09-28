// forge-haiku — prompt:
// a blacksmith's forge...

// BLACKSMITH'S FORGE - Medieval Workshop

// === MAIN BUILDING ===
cube(-12, 0, -8, 12, 11, 14, BRICK);
cube(-11, 1, -7, 11, 10, 13, AIR);
cube(-12, -2, -8, 12, 0, 14, STONE);
cube(-11, 0, -7, 11, 0, 13, COBBLE);

// Peaked roof
for (let z = -7; z <= 13; z++) {
  for (let x = -11; x <= 11; x++) {
    let d = Math.abs(x);
    let h = 11 - Math.floor(d / 2.5);
    if (h > 0) block(x, h, z, BRICK);
  }
}

// === MAIN FORGE (center-right) ===
cube(-4, 0, 4, 6, 9, 12, BRICK);
cube(-3, 1, 5, 5, 8, 11, AIR);
cube(-1, 2, 5, 3, 7, 5, AIR);

// Lava interior - heart of the forge
cube(-1, 1, 7, 2, 5, 10, LAVA);

// Flames rising from forge
block(0, 6, 8, FIRE);
block(1, 6, 8, FIRE);
block(-1, 6, 9, FIRE);
block(0, 5, 7, FIRE);

// Tall chimney
cube(1, 9, 7, 3, 21, 9, BRICK);
block(2, 14, 8, FIRE);
block(2, 18, 8, FIRE);

// Forge grating details
line(0, 4, 6, 2, 4, 6, IRON);
line(0, 3, 6, 2, 3, 6, IRON);
line(-1, 4, 7, 1, 4, 9, IRON);

// === ANVIL STATION (left) ===
cube(-11, 0, 1, -8, 1, 4, STONE);
cube(-10, 1, 1, -9, 2, 4, IRON);
cube(-11, 2, 2, -11, 4, 3, IRON);
cube(-10, 2, 1, -9, 2, 4, COPPER);

// Working floor
cube(-12, 0, 0, -7, 0, 5, COBBLE);

// === SECONDARY FORGE (back-left) ===
cube(-12, 0, 10, -8, 6, 13, BRICK);
cube(-11, 1, 11, -9, 5, 12, AIR);
block(-10, 3, 11, FIRE);
block(-10, 2, 11, LAVA);

// === WORKBENCH (right) ===
cube(7, 0, 2, 11, 1, 7, OAK_LOG);
cube(7, 1, 2, 11, 2, 7, PLANKS);

// Leg supports
block(7, 0, 2, STONE);
block(7, 0, 7, STONE);
block(11, 0, 2, STONE);
block(11, 0, 7, STONE);

// Tools on bench
block(8, 2, 3, IRON);
block(10, 2, 4, IRON);
block(9, 2, 5, COPPER);
block(8, 2, 6, IRON);

// === STORAGE SHELVES ===
for (let y = 2; y <= 8; y += 2) {
  cube(-11, y, 12, -12, y, 13, PLANKS);
  cube(11, y, 12, 12, y, 13, PLANKS);
}

// Storage bins
cube(-11, 1, 11, -10, 3, 11, PLANKS);
cube(10, 1, 11, 11, 3, 11, PLANKS);

// === BARRELS & VESSELS ===
cylinder(-10, 0, -6, 1, 2, PLANKS);
cylinder(10, 0, -6, 1, 2, PLANKS);
cylinder(-6, 0, -5, 2, 3, GRAY);

// === WINDOWS ===
cube(-9, 3, -8, -6, 7, -8, GLASS);
cube(6, 3, -8, 9, 7, -8, GLASS);
cube(-11, 4, 2, -11, 8, 5, GLASS);
cube(11, 4, 6, 11, 8, 9, GLASS);

// === ENTRANCE ===
cube(-2, 0, -8, 2, 7, -8, AIR);
block(-3, 0, -8, BRICK);
block(-3, 1, -8, BRICK);
block(3, 0, -8, BRICK);
block(3, 1, -8, BRICK);

// === TOOL RACKS ===
for (let y = 3; y <= 7; y++) {
  line(-11, y, 6, -11, y, 8, IRON);
}

for (let y = 3; y <= 7; y++) {
  line(11, y, 4, 11, y, 6, IRON);
}

// === HANGING LIGHTS ===
block(0, 9, 6, GLOWSTONE);
block(-5, 8, 3, GLOWSTONE);
block(5, 8, 3, GLOWSTONE);
block(-1, 5, 4, GLOWSTONE);
block(2, 5, 4, GLOWSTONE);

// === METAL ACCENTS ===
block(-12, 7, 5, IRON);
block(12, 7, 5, IRON);
cube(8, 0, -4, 10, 2, -2, COPPER);

// Work counter
cube(-7, 0, -2, -5, 1, 1, STONE);

// Detail work - hammer marks in stone
block(-10, 0, 0, IRON);
block(-9, 0, 5, IRON);
block(-8, 0, 2, IRON);

// Wooden stool
cube(-4, 0, 0, -3, 2, 1, OAK_LOG);

// Weapon/armor stands
line(-2, 1, 11, -2, 5, 11, IRON);
line(2, 1, 11, 2, 5, 11, IRON);

// Scattered metal pieces
block(-6, 1, 3, IRON);
block(-3, 1, 1, COPPER);
block(3, 1, 8, IRON);

// Wall details - anchor points
block(-11, 2, 1, IRON);
block(11, 2, 7, IRON);
block(-11, 6, 10, IRON);
block(11, 6, 12, IRON);