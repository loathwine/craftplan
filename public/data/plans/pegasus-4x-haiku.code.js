// pegasus-4x-haiku — prompt:
// Pegasus...

// Pegasus - Winged Horse

const centerX = 0, centerY = 7, centerZ = 0;

// Main body - robust torso
cube(-4, centerY, centerZ - 3, 4, centerY + 7, centerZ + 10, 3);

// Neck - angled toward camera
cube(-2, centerY + 4, centerZ - 10, 2, centerY + 13, centerZ - 2, 3);

// Head - noble and forward-facing
cube(-3, centerY + 10, centerZ - 18, 3, centerY + 18, centerZ - 10, 3);

// Muzzle - pointed at camera
cube(-2, centerY + 10, centerZ - 21, 2, centerY + 15, centerZ - 18, 3);

// Eyes - glass shine
block(-1, centerY + 16, centerZ - 14, 11);
block(1, centerY + 16, centerZ - 14, 11);

// Nostrils
block(-1, centerY + 12, centerZ - 22, 10);
block(1, centerY + 12, centerZ - 22, 10);

// Ears - pointed and alert
cube(-3, centerY + 18, centerZ - 13, -1, centerY + 23, centerZ - 10, 3);
cube(1, centerY + 18, centerZ - 13, 3, centerY + 23, centerZ - 10, 3);

// Mane - flowing cascade
for (let i = 0; i < 9; i++) {
  const y = centerY + 13 + i;
  const z = centerZ - 7 - Math.floor(i * 0.8);
  block(-3, y, z, 4);
  block(3, y, z, 4);
  if (i % 2 === 0) {
    block(-2, y, z, 4);
    block(2, y, z, 4);
  }
}

// Front legs - left and right
cube(-5, 0, centerZ - 2, -3, centerY, centerZ + 1, 3);
cube(3, 0, centerZ - 2, 5, centerY, centerZ + 1, 3);

// Back legs - left and right
cube(-5, 0, centerZ + 8, -3, centerY, centerZ + 11, 3);
cube(3, 0, centerZ + 8, 5, centerY, centerZ + 11, 3);

// Hooves - darker accents
cube(-5, -1, centerZ - 2, -3, 0, centerZ + 1, 10);
cube(3, -1, centerZ - 2, 5, 0, centerZ + 1, 10);
cube(-5, -1, centerZ + 8, -3, 0, centerZ + 11, 10);
cube(3, -1, centerZ + 8, 5, 0, centerZ + 11, 10);

// Tail - long and flowing
for (let z = 2; z <= 22; z++) {
  const tapering = Math.max(1, 3 - Math.floor(z / 7));
  for (let x = -tapering; x <= tapering; x++) {
    const dropY = centerY + 5 - Math.floor(z * 0.15);
    block(x, dropY, centerZ + z, 4);
  }
}

// LEFT WING - Grand sweeping wing
for (let segment = 0; segment < 11; segment++) {
  const wingX = -7 - segment * 1.8;
  const wingY = centerY + 10 + segment * 0.4;
  const wingSpan = 8 - segment * 0.5;
  
  // Primary feathers
  cube(wingX - 1, wingY - wingSpan, centerZ - 2, wingX, wingY + 2, centerZ + 4, 7);
  
  // Feather tips - accent layer
  if (segment % 2 === 0) {
    cube(wingX - 1, wingY + 2, centerZ - 3, wingX, wingY + 3, centerZ + 5, 10);
  }
  
  // Secondary feathers underneath
  cube(wingX - 1, wingY - wingSpan + 1, centerZ, wingX, wingY, centerZ + 2, 10);
}

// RIGHT WING - Mirror of left
for (let segment = 0; segment < 11; segment++) {
  const wingX = 7 + segment * 1.8;
  const wingY = centerY + 10 + segment * 0.4;
  const wingSpan = 8 - segment * 0.5;
  
  // Primary feathers
  cube(wingX, wingY - wingSpan, centerZ - 2, wingX + 1, wingY + 2, centerZ + 4, 7);
  
  // Feather tips - accent layer
  if (segment % 2 === 0) {
    cube(wingX, wingY + 2, centerZ - 3, wingX + 1, wingY + 3, centerZ + 5, 10);
  }
  
  // Secondary feathers underneath
  cube(wingX, wingY - wingSpan + 1, centerZ, wingX + 1, wingY, centerZ + 2, 10);
}

// Wing roots - shoulder attachment
cube(-7, centerY + 8, centerZ - 1, -4, centerY + 12, centerZ + 3, 3);
cube(4, centerY + 8, centerZ - 1, 7, centerY + 12, centerZ + 3, 3);

// Body definition - chest stripe
cube(-3, centerY + 4, centerZ - 1, 3, centerY + 6, centerZ + 2, 10);

// Flank definition
cube(-4, centerY + 3, centerZ + 4, -3, centerY + 5, centerZ + 7, 10);
cube(3, centerY + 3, centerZ + 4, 4, centerY + 5, centerZ + 7, 10);

// Neck muscle
cube(-2, centerY + 8, centerZ - 5, 2, centerY + 10, centerZ - 2, 10);

// Head detail - noble brow
cube(-2, centerY + 17, centerZ - 15, 2, centerY + 18, centerZ - 13, 10);

// Leg definition
for (let i = 0; i < 4; i++) {
  const leg_x = i < 2 ? -4 : 4;
  const leg_z = i % 2 === 0 ? centerZ - 1 : centerZ + 9;
  block(leg_x - (i < 2 ? -1 : 1), centerY - 2, leg_z, 10);
}

// Optional - add final decorative touches
block(0, centerY + 20, centerZ - 14, 10);