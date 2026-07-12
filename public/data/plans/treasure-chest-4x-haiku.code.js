// treasure-chest-4x-haiku — prompt:
// a treasure chest overflowing with gold...

// Treasure chest overflowing with gold coins

// CHEST STRUCTURE
// Foundation platform
cube(-4, -2, -1, 4, -1, 3, 8); // COBBLE base

// Main chest box
cube(-3, 0, 0, 3, 4, 3, 7); // PLANKS body

// Reinforcement bands
cube(-4, 1, -1, 4, 1, 4, 3); // STONE band
cube(-4, 3, -1, 4, 3, 4, 3); // STONE band upper

// Metal corner braces
cube(-4, 0, -1, -3, 2, 0, 8); // COBBLE corners
cube(3, 0, -1, 4, 2, 0, 8);
cube(-4, 0, 3, -3, 2, 4, 8);
cube(3, 0, 3, 4, 2, 4, 8);

// OPEN LID - tilted forward toward camera
for (let x = -3; x <= 3; x++) {
  for (let z = 0; z <= 3; z++) {
    const lidH = 5 + (3 - z); // higher at back, lower at front
    block(x, lidH, z, 7); // PLANKS
  }
}

// Hinge hardware
cube(-1, 4, 4, 1, 5, 4, 8); // COBBLE hinge
block(0, 6, 4, 10); // BRICK pin

// GOLD COINS CASCADE - SAND blocks form massive overflow
// Tier 1 - wide base spread
for (let x = -7; x <= 7; x++) {
  for (let z = 4; z <= 9; z++) {
    block(x, 0, z, 6);
  }
}

// Tier 2 - stepped pyramid
for (let x = -6; x <= 6; x++) {
  for (let z = 4; z <= 8; z++) {
    block(x, 1, z, 6);
  }
}

// Tier 3
for (let x = -5; x <= 5; x++) {
  for (let z = 5; z <= 7; z++) {
    block(x, 2, z, 6);
  }
}

// Tier 4
for (let x = -4; x <= 4; x++) {
  for (let z = 5; z <= 6; z++) {
    block(x, 3, z, 6);
  }
}

// Peak ridge
for (let x = -3; x <= 3; x++) {
  block(x, 4, 5, 6);
}

// Coins pouring from open chest mouth
for (let x = -2; x <= 2; x++) {
  block(x, 3, -1, 6);
  if (x !== 0) block(x, 2, -1, 6);
}

block(-1, 2, -2, 6);
block(0, 2, -2, 6);
block(1, 2, -2, 6);

// Coins sloshing against chest sides
for (let y = 1; y <= 2; y++) {
  block(-4, y, 1, 6);
  block(4, y, 1, 6);
}

// Dramatic side cascades spreading outward
for (let x = -8; x <= -6; x++) {
  for (let z = 3; z <= 7; z++) {
    block(x, 0, z, 6);
  }
}

for (let x = 6; x <= 8; x++) {
  for (let z = 3; z <= 7; z++) {
    block(x, 0, z, 6);
  }
}

// Secondary spills
for (let x = -9; x <= -8; x++) {
  block(x, 0, 5, 6);
  block(x, 0, 6, 6);
}

for (let x = 8; x <= 9; x++) {
  block(x, 0, 5, 6);
  block(x, 0, 6, 6);
}

// Scattered loose coins
for (let z = -1; z <= 0; z++) {
  block(-2, 0, z, 6);
  block(0, 0, z, 6);
  block(2, 0, z, 6);
}

// DECORATIVE ACCENTS

// Jeweled inlays - GLASS shimmer
block(-2, 6, 1, 11);
block(0, 6, 0, 11);
block(2, 6, 1, 11);

// Ornamental metalwork on chest front
cube(-1, 2, -1, 1, 3, -1, 10); // BRICK lock plate
block(0, 2, -1, 8); // COBBLE keyhole

// Decorative trim
cube(-4, 2, 0, -4, 3, 3, 10); // BRICK left edge
cube(4, 2, 0, 4, 3, 3, 10);   // BRICK right edge

// Magical aura - ICE crystals floating above
block(-5, 5, 6, 13);
block(5, 5, 6, 13);
block(-7, 3, 5, 13);
block(7, 3, 5, 13);
block(0, 7, 6, 13);

// Chest top ornaments
block(-3, 5, 3, 10);
block(3, 5, 3, 10);