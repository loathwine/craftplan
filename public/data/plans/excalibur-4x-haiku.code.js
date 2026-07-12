// excalibur-4x-haiku — prompt:
// Excalibur in the stone...

// Clear working area
for (let x = -16; x <= 16; x++) {
  for (let z = -22; z <= 10; z++) {
    block(x, -1, z, AIR);
  }
}

// THE STONE ANVIL - tiered, weathered, ancient
cube(-11, 0, -8, 11, 8, 10, STONE);
cube(-9, 8, -6, 9, 14, 8, STONE);
cube(-7, 14, -4, 7, 18, 6, STONE);

// Weathering detail - cobblestone patches
cube(-10, 3, -7, 10, 9, 9, COBBLE);
cube(-8, 10, -5, 8, 15, 7, COBBLE);

// Cracks and shadows in the stone
cube(-6, 11, -3, 6, 13, 5, COBBLE);

// THE BLADE - long, tapering, magnificent glass
// Lower section - full width
for (let y = 8; y <= 14; y++) {
  for (let z = -1; z >= -10; z--) {
    cube(-1, y, z, 1, y, z, GLASS);
  }
}

// Middle section - narrowing
for (let y = 14; y <= 22; y++) {
  for (let z = -2; z >= -14; z -= 2) {
    block(0, y, z, GLASS);
  }
  block(0, y, -3, GLASS);
  block(0, y, -11, GLASS);
}

// Upper section - point approaching
for (let y = 22; y <= 30; y++) {
  block(0, y, -16, GLASS);
  block(0, y, -18, GLASS);
  block(0, y, -20, GLASS);
}

// Blade tip
block(0, 31, -21, GLASS);
block(0, 32, -22, GLASS);

// CROSSGUARD - ornate, golden
cube(-5, 7, -1, 5, 9, 1, BRICK);
cube(-4, 9, -1, 4, 10, 0, BRICK);

// HILT - wrapped grip with bands
for (let y = 3; y <= 6; y++) {
  cube(-1, y, -2, 1, y + 1, 0, OAK_LOG);
}

// Decorative grip bands
for (let y = 4; y <= 5; y++) {
  cube(-2, y, -3, 2, y + 1, 1, BRICK);
}

// POMMEL - golden cap
sphere(0, 2, -1, 1.5, BRICK);

// Base of pommel
cube(-1, 2, -2, 1, 2, 0, BRICK);