// godzilla-4x-haiku — prompt:
// Godzilla...

// GODZILLA - King of the Monsters

// ===== TORSO =====
cube(-4, 1, -12, 4, 8, 14, STONE);
cube(-3, 6, -8, 3, 11, 10, STONE);

// ===== NECK & HEAD =====
cube(-2, 10, 10, 2, 13, 16, STONE);
cube(-5, 12, 14, 5, 20, 26, STONE);
cube(-4, 11, 24, 4, 14, 28, BRICK);

// Head details
cube(-5, 19, 16, 5, 21, 24, COBBLE);
cube(-5, 16, 20, -2, 19, 23, AIR);
cube(2, 16, 20, 5, 19, 23, AIR);

// Teeth
for (let i = 0; i < 9; i++) {
  block(-4 + i, 14, 27, BRICK);
  block(-4 + i, 11, 27, BRICK);
}
block(-2, 13, 27, AIR);
block(2, 13, 27, AIR);

// Jaw muscle
cube(-3, 13, 22, 3, 16, 26, COBBLE);
cube(-6, 14, 18, 6, 18, 22, COBBLE);

// ===== ICONIC DORSAL PLATES =====
const spikes = [
  {z: -10, h: 3}, {z: -6, h: 4}, {z: -2, h: 5},
  {z: 2, h: 6}, {z: 6, h: 6}, {z: 10, h: 5},
  {z: 14, h: 4}, {z: 18, h: 3}
];

for (let s of spikes) {
  cube(-1, 9, s.z, 1, 10, s.z + 1, BRICK);
  for (let h = 1; h < s.h; h++) {
    let w = (s.h - h > 1) ? 1 : 0;
    if (w === 1) cube(-w, 10 + h, s.z, w, 10 + h, s.z + 1, BRICK);
    else block(0, 10 + h, s.z, BRICK);
  }
}

// ===== FRONT LEGS =====
cube(-7, -2, -4, -4, 8, 2, STONE);
cube(4, -2, -4, 7, 8, 2, STONE);

// Leg muscle definition
cube(-8, 2, -2, -6, 6, 1, COBBLE);
cube(6, 2, -2, 8, 6, 1, COBBLE);

// Front claws
cube(-9, -2, -4, -8, 2, -2, BRICK);
cube(8, -2, -4, 9, 2, -2, BRICK);

for (let c = 0; c < 3; c++) {
  block(-9, 1 - c, -3 + c * 2, BRICK);
  block(9, 1 - c, -3 + c * 2, BRICK);
}

// ===== BACK LEGS =====
cube(-7, -2, 12, -4, 8, 18, STONE);
cube(4, -2, 12, 7, 8, 18, STONE);

cube(-8, 2, 14, -6, 6, 16, COBBLE);
cube(6, 2, 14, 8, 6, 16, COBBLE);

// Back claws
cube(-9, -2, 18, -8, 2, 20, BRICK);
cube(8, -2, 18, 9, 2, 20, BRICK);

for (let c = 0; c < 3; c++) {
  block(-9, 1 - c, 18 + c * 2, BRICK);
  block(9, 1 - c, 18 + c * 2, BRICK);
}

// ===== MASSIVE TAIL =====
cube(-3, 2, 16, 3, 7, 32, STONE);
cube(-2, 3, 24, 2, 7, 35, STONE);

// Tail spikes
for (let i = 0; i < 9; i++) {
  let z = 16 + i * 2;
  let h = 7 - i * 0.6;
  for (let j = 0; j < h; j++) {
    block(0, 8 + j, z, BRICK);
  }
}

// ===== BODY TEXTURE =====
// Abdomen plate
cube(-2, 1, -4, 2, 3, 12, COBBLE);

// Ribcage definition
cube(-4, 5, -2, -2, 7, 4, COBBLE);
cube(2, 5, -2, 4, 7, 4, COBBLE);

// Back plates
cube(-5, 4, 6, -3, 6, 10, COBBLE);
cube(3, 4, 6, 5, 6, 10, COBBLE);

// Neck muscle
cube(-2, 11, 14, 2, 12, 16, COBBLE);

// Brow ridges
cube(-5, 20, 17, -2, 21, 20, COBBLE);
cube(2, 20, 17, 5, 21, 20, COBBLE);

// Cheeks
cube(-6, 15, 21, -4, 17, 24, COBBLE);
cube(4, 15, 21, 6, 17, 24, COBBLE);

// ===== SHOULDER/ARM MASS =====
cube(-6, 4, -2, -4, 7, 4, COBBLE);
cube(4, 4, -2, 6, 7, 4, COBBLE);

// ===== ADDITIONAL BULK =====
// Chest
cube(-3, 7, 0, 3, 10, 8, COBBLE);

// Hip/flank definition  
cube(-5, 3, 8, -3, 6, 14, COBBLE);
cube(3, 3, 8, 5, 6, 14, COBBLE);

// Tail base reinforcement
cube(-2, 4, 18, 2, 6, 24, COBBLE);

// ===== FINAL DETAILS =====
// Under-jaw definition
cube(-3, 10, 26, 3, 11, 28, OAK_LOG);

// Eye ridge enhancement
cube(-4, 21, 18, 4, 22, 22, BRICK);

// Nostril depth
block(-2, 12, 28, AIR);
block(2, 12, 28, AIR);