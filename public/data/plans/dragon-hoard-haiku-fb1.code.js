// dragon-hoard-haiku-fb1 — feedback pass 1
// Large gold hoard base
cube(-11, -1, -8, 11, 4, 12, GOLD);
cube(-10, 3, -7, 10, 5, 11, GOLD);
cube(-8, 5, -6, 8, 6, 10, GOLD);

// Gold detail scattered
for(let x = -10; x <= 10; x += 3) {
  for(let z = -5; z <= 10; z += 4) {
    block(x, 6, z, GOLD);
  }
}

// Dragon body - main bulk, coiled on hoard
cube(-7, 6, -5, 7, 10, 6, BROWN);
cube(-8, 7, 0, 8, 11, 8, BROWN);
cube(-6, 8, 6, 6, 12, 10, BROWN);

// Dragon head - front-facing, prominent
cube(-5, 10, -12, 5, 14, -8, BROWN);
cube(-4, 12, -13, 4, 15, -9, BROWN);

// Head snout detail
cube(-3, 11, -14, 3, 13, -12, ORANGE);

// Dragon horns
cube(-6, 15, -10, -5, 17, -8, BROWN);
cube(5, 15, -10, 6, 17, -8, BROWN);

// Eyes glowing
block(-2, 13, -14, NEON_RED);
block(2, 13, -14, NEON_RED);

// Nostril ridge
cube(-2, 12, -15, 2, 13, -14, GRAY);

// Dragon wings - draped over sides, visible from front
cube(-12, 8, -2, -8, 13, 4, ORANGE);
cube(-11, 9, 0, -9, 12, 6, RED);
cube(-10, 10, 2, -10, 11, 5, ORANGE);

cube(8, 8, -2, 12, 13, 4, ORANGE);
cube(9, 9, 0, 11, 12, 6, RED);
cube(10, 10, 2, 10, 11, 5, ORANGE);

// Wing membrane texture
for(let y = 9; y <= 11; y++) {
  for(let z = 0; z <= 5; z += 2) {
    block(-11, y, z, ORANGE);
    block(11, y, z, ORANGE);
  }
}

// Tail coiling around treasure
cube(7, 7, 8, 10, 10, 13, BROWN);
cube(8, 6, 12, 12, 9, 16, BROWN);
cube(9, 5, 15, 13, 8, 19, BROWN);
cube(10, 4, 18, 14, 7, 21, BROWN);

// Tail underside detail
cube(8, 4, 10, 11, 6, 15, ORANGE);
cube(9, 3, 14, 12, 5, 18, ORANGE);

// Spine ridge running along body
for(let z = -4; z <= 9; z += 2) {
  block(-7, 11, z, STONE);
  block(7, 11, z, STONE);
}

// Back leg (visible on body side)
cube(-9, 6, 4, -7, 9, 6, BROWN);
cube(7, 6, 4, 9, 9, 6, BROWN);

// Front leg (closer to camera, visible)
cube(-8, 8, -4, -6, 11, -2, BROWN);
cube(6, 8, -4, 8, 11, -2, BROWN);

// Belly scales under head
cube(-4, 9, -7, 4, 10, -6, ORANGE);

// Jaw detail
cube(-5, 10, -13, -3, 11, -12, GRAY);
cube(3, 10, -13, 5, 11, -12, GRAY);

// Cheek/face ridges
cube(-6, 12, -12, -5, 13, -10, STONE);
cube(5, 12, -12, 6, 13, -10, STONE);

// Scattered gold glints on dragon
block(-3, 11, -6, GOLD);
block(3, 11, -6, GOLD);
block(-5, 8, 3, GOLD);
block(5, 8, 3, GOLD);

// Foreleg talons
for(let dy = 0; dy < 3; dy++) {
  block(-8, 8 + dy, -3, BLACK);
  block(-7, 8 + dy, -3, BLACK);
  block(7, 8 + dy, -3, BLACK);
  block(8, 8 + dy, -3, BLACK);
}

// Horned head crown
cube(-5, 14, -11, -3, 16, -9, STONE);
cube(3, 14, -11, 5, 16, -9, STONE);

// Additional treasure glint blocks
for(let x = -8; x <= 8; x += 4) {
  block(x, 7, 3, GOLD);
}