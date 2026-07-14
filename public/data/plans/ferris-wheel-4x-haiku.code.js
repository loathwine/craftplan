// ferris-wheel-4x-haiku — prompt:
// a Ferris wheel...

const centerX = 0;
const centerY = 8;
const centerZ = 0;
const wheelRadius = 18;
const numGondolas = 16;
const numSpokes = 16;

// Central hub - stone core
cylinder(centerX, centerY, centerZ, 3, 6, STONE);

// Main wheel rim in X-Y plane (facing camera)
for (let angle = 0; angle < Math.PI * 2; angle += Math.PI * 2 / 72) {
  const x = Math.round(centerX + Math.cos(angle) * wheelRadius);
  const y = Math.round(centerY + Math.sin(angle) * wheelRadius);
  
  // Outer rim
  for (let z = centerZ - 2; z <= centerZ + 2; z++) {
    block(x, y, z, OAK_LOG);
  }
  
  // Inner support ring
  const innerR = wheelRadius - 2;
  const ix = Math.round(centerX + Math.cos(angle) * innerR);
  const iy = Math.round(centerY + Math.sin(angle) * innerR);
  for (let z = centerZ - 1; z <= centerZ + 1; z++) {
    block(ix, iy, z, OAK_LOG);
  }
}

// Spokes - radial supports
for (let i = 0; i < numSpokes; i++) {
  const angle = (i / numSpokes) * Math.PI * 2;
  
  for (let r = 5; r < wheelRadius - 1; r += 2) {
    const x = Math.round(centerX + Math.cos(angle) * r);
    const y = Math.round(centerY + Math.sin(angle) * r);
    
    for (let z = centerZ - 1; z <= centerZ + 1; z++) {
      block(x, y, z, OAK_LOG);
    }
  }
}

// Cross-spokes at 45 degree offsets for extra detail
for (let i = 0; i < numSpokes; i++) {
  const angle = (i / numSpokes) * Math.PI * 2 + Math.PI / 32;
  
  for (let r = 7; r < wheelRadius - 2; r += 3) {
    const x = Math.round(centerX + Math.cos(angle) * r);
    const y = Math.round(centerY + Math.sin(angle) * r);
    
    block(x, y, centerZ, PLANKS);
  }
}

// Gondolas
for (let i = 0; i < numGondolas; i++) {
  const angle = (i / numGondolas) * Math.PI * 2;
  const gondolaX = Math.round(centerX + Math.cos(angle) * wheelRadius);
  const gondolaY = Math.round(centerY + Math.sin(angle) * wheelRadius);
  const gondolaZ = centerZ;
  
  // Suspension arms inward
  for (let step = 0; step <= 2; step++) {
    const sx = Math.round(gondolaX - Math.cos(angle) * step);
    const sy = Math.round(gondolaY - Math.sin(angle) * step);
    block(sx, sy, gondolaZ, STONE);
  }
  
  // Gondola body - brick
  cube(gondolaX - 2, gondolaY - 2, gondolaZ - 2,
       gondolaX + 2, gondolaY + 2, gondolaZ + 2, BRICK);
  
  // Interior hollow
  cube(gondolaX - 1, gondolaY - 1, gondolaZ - 1,
       gondolaX + 1, gondolaY + 1, gondolaZ + 1, AIR);
  
  // Window
  cube(gondolaX - 1, gondolaY, gondolaZ - 2,
       gondolaX + 1, gondolaY + 1, gondolaZ - 2, GLASS);
  
  // Roof
  cube(gondolaX - 2, gondolaY - 3, gondolaZ - 2,
       gondolaX + 2, gondolaY - 3, gondolaZ + 2, PLANKS);
}

// Four support legs at corners
const legDist = 24;
const legs = [
  {x: legDist, z: legDist},
  {x: -legDist, z: legDist},
  {x: -legDist, z: -legDist},
  {x: legDist, z: -legDist}
];

for (const leg of legs) {
  // Main column
  cylinder(leg.x, centerY - 11, leg.z, 2, 14, COBBLE);
  
  // Base pad
  cylinder(leg.x, centerY - 12, leg.z, 4, 1, STONE);
  
  // Diagonal bracing to center
  for (let step = 0; step <= 18; step++) {
    const bx = Math.round(centerX + (leg.x - centerX) * (step / 18));
    const bz = Math.round(centerZ + (leg.z - centerZ) * (step / 18));
    const by = centerY - 3 - (8 * Math.abs(step - 9) / 9);
    
    block(bx, by, bz, COBBLE);
    if (step % 3 === 0) {
      block(bx, by - 1, bz, COBBLE);
    }
  }
}

// Horizontal bracing between legs
for (let i = 0; i < 4; i++) {
  const leg1 = legs[i];
  const leg2 = legs[(i + 1) % 4];
  
  for (let step = 0; step <= 16; step++) {
    const bx = Math.round(leg1.x + (leg2.x - leg1.x) * (step / 16));
    const bz = Math.round(leg1.z + (leg2.z - leg1.z) * (step / 16));
    
    block(bx, centerY - 8, bz, COBBLE);
    block(bx, centerY - 7, bz, COBBLE);
  }
}

// Base platform
cube(centerX - 28, centerY - 13, centerZ - 28,
     centerX + 28, centerY - 12, centerZ + 28, PLANKS);

// Platform decorative edge
for (let x = -28; x <= 28; x += 2) {
  block(x, centerY - 11, -28, BRICK);
  block(x, centerY - 11, 28, BRICK);
}
for (let z = -28; z <= 28; z += 2) {
  block(-28, centerY - 11, z, BRICK);
  block(28, centerY - 11, z, BRICK);
}

// Ticket booth structure
cube(-18, centerY - 11, -20, -14, centerY - 4, -16, BRICK);
cube(-17, centerY - 4, -19, -15, centerY - 2, -17, PLANKS);
for (let x = -17; x <= -15; x++) {
  block(x, centerY - 3, -20, GLASS);
  block(x, centerY - 3, -16, GLASS);
}

// Staircase base
for (let step = 0; step < 6; step++) {
  cube(-10, centerY - 11 + step, centerZ - 8 - step,
       -6, centerY - 11 + step, centerZ - 4, STONE);
}