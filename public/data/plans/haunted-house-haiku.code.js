// haunted-house-haiku — prompt:
// a haunted house on Halloween night...

// HAUNTED HOUSE - HALLOWEEN NIGHT

const w = 11;
const d = 9;
const h = 15;

// Main structure - brick walls
cube(-w, 0, 2, w, h, 2 + d, BRICK);

// Clear interior
cube(-w + 1, 1, 3, w - 1, h - 1, 2 + d - 1, AIR);

// Wall texture layers - weathered look
cube(-w, h - 3, 2, w, h - 2, 2 + d, GRAY);
cube(-w, 6, 2, w, 7, 2 + d, GRAY);
cube(-w, 2, 2, w, 3, 2 + d, STONE);
cube(-w, -2, 2, w, 0, 2 + d, STONE);

// === FRONT FACADE ===

// Main entrance door
cube(-2, 0, 2, 2, 6, 2, AIR);
cube(-3, 0, 0, 3, 3, 1, BROWN);
cube(-1, 4, 1, 1, 6, 1, BROWN);

// Front windows (4 large)
cube(-8, 5, 2, -6, 8, 2, AIR);
cube(-4, 5, 2, -2, 8, 2, AIR);
cube(2, 5, 2, 4, 8, 2, AIR);
cube(6, 5, 2, 8, 8, 2, AIR);

// Window frames visible from outside
cube(-8, 5, 1, -6, 8, 1, IRON);
cube(-4, 5, 1, -2, 8, 1, IRON);
cube(2, 5, 1, 4, 8, 1, IRON);
cube(6, 5, 1, 8, 8, 1, IRON);

// Upper floor windows
cube(-6, 10, 2, -4, 12, 2, AIR);
cube(4, 10, 2, 6, 12, 2, AIR);
cube(-6, 10, 1, -4, 12, 1, IRON);
cube(4, 10, 1, 6, 12, 1, IRON);

// === PEAKED ROOF ===
for (let i = 0; i < 5; i++) {
  cube(-w + i, h + i, 2 + i, w - i, h + i, 2 + d - i, BRICK);
}

cube(-w, h, 2, w, h, 2 + d, OBSIDIAN);
cube(-w, h + 4, 2, w, h + 4, 2 + d, GRAY);

// === LEFT TURRET ===
cube(-w - 3, 0, 2, -w, h + 2, 6, BRICK);
cube(-w - 2, 1, 3, -w - 1, h + 1, 5, AIR);
cube(-w - 2, 7, 3, -w - 1, 9, 5, AIR);
cube(-w - 2, 7, 2, -w - 1, 9, 2, IRON);
cube(-w - 3, h + 2, 2, -w, h + 3, 6, BRICK);

// === RIGHT TURRET ===
cube(w, 0, 2, w + 3, h + 2, 6, BRICK);
cube(w + 1, 1, 3, w + 2, h + 1, 5, AIR);
cube(w + 1, 7, 3, w + 2, 9, 5, AIR);
cube(w + 1, 7, 2, w + 2, 9, 2, IRON);
cube(w, h + 2, 2, w + 3, h + 3, 6, BRICK);

// === BACK EXTENSION ===
cube(-7, 0, 11, 7, h - 3, 12, BRICK);
cube(-6, 1, 11, 6, h - 4, 11, AIR);

cube(-4, 6, 11, -2, 8, 11, AIR);
cube(-4, 6, 10, -2, 8, 10, IRON);
cube(2, 6, 11, 4, 8, 11, AIR);
cube(2, 6, 10, 4, 8, 10, IRON);

// === BACK TOWER (asymmetrical) ===
cube(8, 0, 10, 11, h - 4, 13, BRICK);
cube(9, 1, 11, 10, h - 5, 12, AIR);
cube(9, 6, 11, 10, 8, 12, AIR);
cube(9, 6, 10, 10, 8, 10, IRON);
cube(8, h - 3, 10, 11, h - 2, 13, STONE);

// === CHIMNEYS ===
cube(6, h + 1, 7, 8, h + 6, 9, BRICK);
cube(7, h + 2, 8, 8, h + 5, 9, AIR);
cube(-8, h, 8, -6, h + 4, 10, BRICK);
cube(-7, h + 1, 9, -7, h + 3, 9, AIR);

// === GRAVEYARD - LEFT (9 tombstones) ===
for (let i = 0; i < 9; i++) {
  const x = -14 - i * 3;
  const z = 2 + i * 2;
  
  cube(x, 0, z, x, 3, z, STONE);
  cube(x - 1, 0, z - 1, x + 1, 0, z + 1, DIRT);
  
  if (i % 4 === 0) {
    cube(x - 1, 2, z, x + 1, 2, z, COBBLE);
    line(x, 3, z, x, 4, z, GRAY);
  } else if (i % 4 === 1) {
    cube(x, 2, z - 1, x, 2, z + 1, COBBLE);
    line(x - 1, 3, z, x + 1, 3, z, GRAY);
  } else if (i % 4 === 2) {
    cube(x - 1, 2, z - 1, x + 1, 2, z + 1, COBBLE);
  } else {
    line(x, 1, z, x, 4, z, IRON);
  }
  
  line(x - 1, 3, z, x + 1, 3, z, IRON);
  line(x, 2, z - 1, x, 4, z + 1, IRON);
}

// === GRAVEYARD - RIGHT (9 tombstones) ===
for (let i = 0; i < 9; i++) {
  const x = 14 + i * 3;
  const z = 2 + i * 2;
  
  cube(x, 0, z, x, 3, z, STONE);
  cube(x - 1, 0, z - 1, x + 1, 0, z + 1, DIRT);
  
  if (i % 4 === 0) {
    cube(x - 1, 2, z, x + 1, 2, z, COBBLE);
    line(x, 3, z, x, 4, z, GRAY);
  } else if (i % 4 === 1) {
    cube(x, 2, z - 1, x, 2, z + 1, COBBLE);
    line(x - 1, 3, z, x + 1, 3, z, GRAY);
  } else if (i % 4 === 2) {
    cube(x - 1, 2, z - 1, x + 1, 2, z + 1, COBBLE);
  } else {
    line(x, 1, z, x, 4, z, IRON);
  }
  
  line(x - 1, 3, z, x + 1, 3, z, IRON);
  line(x, 2, z - 1, x, 4, z + 1, IRON);
}

// === DEAD GNARLED TREES ===

// Left tree - twisted trunk
cylinder(-19, 0, 7, 1, 16, OAK_LOG);

line(-19, 11, 7, -15, 13, 5, OAK_LOG);
line(-19, 11, 7, -23, 13, 9, OAK_LOG);
line(-19, 12, 7, -17, 14, 3, OAK_LOG);
line(-19, 13, 7, -21, 15, 5, OAK_LOG);
line(-19, 14, 7, -19, 17, 3, OAK_LOG);

line(-15, 13, 5, -13, 15, 3, OAK_LOG);
line(-23, 13, 9, -22, 15, 11, OAK_LOG);
line(-17, 14, 3, -15, 16, 1, OAK_LOG);

// Right tree
cylinder(19, 0, 7, 1, 15, OAK_LOG);

line(19, 10, 7, 15, 12, 5, OAK_LOG);
line(19, 10, 7, 23, 12, 9, OAK_LOG);
line(19, 11, 7, 17, 13, 3, OAK_LOG);
line(19, 12, 7, 21, 14, 5, OAK_LOG);
line(19, 13, 7, 19, 16, 3, OAK_LOG);

line(15, 12, 5, 13, 14, 3, OAK_LOG);
line(23, 12, 9, 22, 14, 11, OAK_LOG);
line(17, 13, 3, 15, 15, 1, OAK_LOG);

// === WROUGHT IRON FENCE ===
for (let z = -2; z <= 18; z++) {
  line(-22, 0, z, -22, 2, z, IRON);
  line(22, 0, z, 22, 2, z, IRON);
}

for (let x = -20; x <= 20; x += 2) {
  line(x, 2, -2, x, 2, 18, IRON);
}

for (let y = 0; y <= 2; y++) {
  line(-1, y, 0, 1, y, 0, IRON);
}

// === STONE PATH ===
for (let z = -1; z <= 12; z++) {
  cube(-1, 0, z, 1, 0, z, COBBLE);
}

cube(-4, 0, 0, 4, 0, 1, COBBLE);
cube(-5, 0, 1, 5, 0, 1, STONE);

cube(-3, -1, -1, 3, -1, 0, STONE);
cube(-2, -2, -2, 2, -2, -1, STONE);

// === SPOOKY FIRE LIGHTING ===

// Porch lanterns
block(-4, h, 2, FIRE);
block(4, h, 2, FIRE);

// Front window glow
block(-8, 6, 3, FIRE);
block(-4, 6, 3, FIRE);
block(3, 6, 3, FIRE);
block(7, 6, 3, FIRE);

block(-5, 11, 3, FIRE);
block(5, 11, 3, FIRE);

// Turrets
block(-w - 1, 8, 4, FIRE);
block(w + 1, 8, 4, FIRE);

// Back windows
block(-3, 7, 11, FIRE);
block(3, 7, 11, FIRE);
block(9, 7, 11, FIRE);

// Chimney smoke
block(7, h + 6, 8, FIRE);
block(-7, h + 4, 9, FIRE);

// Haunted trees
block(-19, 15, 7, FIRE);
block(19, 14, 7, FIRE);

// Graveyard glows
block(-14, 3, 2, FIRE);
block(14, 3, 2, FIRE);
block(-17, 4, 10, FIRE);
block(17, 4, 10, FIRE);

// === GHOSTLY BLUE ETHEREAL LIGHTS ===
block(-19, 16, 7, NEON_BLUE);
block(19, 15, 7, NEON_BLUE);
block(-10, 10, 2, NEON_BLUE);
block(10, 10, 2, NEON_BLUE);
block(-20, 2, 9, NEON_BLUE);
block(20, 2, 9, NEON_BLUE);
block(0, 9, 8, NEON_BLUE);