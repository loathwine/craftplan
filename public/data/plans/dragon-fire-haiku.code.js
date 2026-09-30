// dragon-fire-haiku — prompt:
// a dragon breathing fire...

// Dragon breathing fire

const fireX = 0, fireY = 13, fireZ = -15;

// BODY - Main torso
cube(-7, 3, 1, 7, 10, 15, STONE);
cube(-5, 1, 5, 5, 12, 11, GRAY);

// Spine ridge
for (let i = 0; i < 12; i++) {
  const z = 1 + i;
  cube(-1, 12 + i * 0.2, z, 1, 14 + i * 0.2, z + 1, IRON);
}

// NECK
cube(-4, 8, -2, 4, 12, 1, GRAY);
cube(-3, 9, -4, 3, 13, -1, GRAY);

// HEAD - Forward facing (north)
cube(-5, 10, -12, 5, 16, -4, GRAY);
cube(-4, 12, -14, 4, 17, -10, BLACK);
cube(-2, 12, -16, 2, 15, -13, BROWN);

// Snout/muzzle
cube(-2, 11, -15, 2, 14, -12, BLACK);

// Mouth opening
cube(-1, 11, -14, 1, 13, -11, AIR);

// Eyes - glowing red
cube(-3, 14, -8, -1, 16, -6, BLACK);
block(-2, 15, -7, NEON_RED);
block(-2, 14, -7, RED);
cube(1, 14, -8, 3, 16, -6, BLACK);
block(2, 15, -7, NEON_RED);
block(2, 14, -7, RED);

// Horns
line(-3, 19, -8, -5, 23, -10, IRON);
line(3, 19, -8, 5, 23, -10, IRON);

// Jaw muscles
cube(-4, 9, -10, -2, 11, -7, STONE);
cube(2, 9, -10, 4, 11, -7, STONE);

// LEGS - Powerful
// Front left
cube(-8, -2, 2, -6, 5, 5, STONE);
// Front right
cube(6, -2, 2, 8, 5, 5, STONE);
// Back left
cube(-8, -2, 10, -6, 5, 13, STONE);
// Back right
cube(6, -2, 10, 8, 5, 13, STONE);

// Claws on feet
for (let leg of [[-9, 1, 1], [9, 1, 1], [-9, 1, 14], [9, 1, 14]]) {
  block(leg[0], leg[1], leg[2], BLACK);
  block(leg[0], leg[1]-1, leg[2], BLACK);
}

// TAIL - Curved spine
cube(-2, 7, 15, 2, 10, 17, GRAY);
cube(-2, 5, 17, 2, 9, 19, GRAY);
cube(-1, 3, 19, 1, 8, 21, GRAY);

// Tail spikes
cube(-1, 9, 16, 1, 11, 17, IRON);
cube(-1, 7, 18, 1, 9, 19, IRON);

// LEFT WING - Spread position
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 9; j++) {
    if ((i + j) % 2 === 0) {
      block(-9 - i, 8 + i, 4 + j, BLACK);
    }
  }
}

// Wing support ribs
for (let j = 2; j < 8; j += 2) {
  line(-9, 8, 4 + j, -14, 13, 4 + j, IRON);
}

// RIGHT WING - Spread position
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 9; j++) {
    if ((i + j) % 2 === 0) {
      block(9 + i, 8 + i, 4 + j, BLACK);
    }
  }
}

// Wing support ribs
for (let j = 2; j < 8; j += 2) {
  line(9, 8, 4 + j, 14, 13, 4 + j, IRON);
}

// CHEST PLATE
cube(-3, 6, 1, 3, 8, 3, BRICK);
cube(-2, 7, 0, 2, 9, 4, RED);

// FIRE BREATH - Cone of flames
// Dense core
for (let layer = 0; layer < 2; layer++) {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      block(fireX + x, fireY + y, fireZ - layer, FIRE);
    }
  }
}

// Expanding cone
for (let layer = 2; layer < 10; layer++) {
  const radius = 2 + layer * 0.35;
  for (let x = -Math.floor(radius); x <= Math.floor(radius); x++) {
    for (let y = -Math.floor(radius * 0.7); y <= Math.floor(radius * 0.7); y++) {
      const dist = Math.sqrt(x * x + y * y);
      if (dist <= radius && Math.random() > 0.3) {
        block(fireX + x, fireY + y, fireZ - layer, FIRE);
      }
    }
  }
}

// Turbulent secondary flames
for (let i = 1; i <= 4; i++) {
  for (let offset = -1; offset <= 1; offset++) {
    if (Math.random() > 0.4) {
      block(fireX + offset, fireY - 1, fireZ - i, FIRE);
    }
  }
}

// Heat glow - orange beneath and around fire
for (let i = 1; i <= 7; i++) {
  for (let x = -2; x <= 2; x++) {
    block(fireX + x, fireY - 3 - i * 0.3, fireZ - i, ORANGE);
  }
}

// Belly scales and detail
for (let z = 6; z <= 10; z += 2) {
  line(-2, 4, z, 2, 4, z, BRICK);
}

// Nostril vents
block(-1, 14, -15, COBBLE);
block(1, 14, -15, COBBLE);

// Mouth interior darkness
cube(-1, 12, -13, 1, 12, -12, BLACK);