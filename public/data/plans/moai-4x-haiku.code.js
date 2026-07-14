// moai-4x-haiku — prompt:
// the Moai statues of Easter Island...

function createMoai(cx, cy, cz, scale) {
  const s = scale;
  
  // Main head body - proportions characteristic of Moai
  const headW = Math.round(5 * s);
  const headH = Math.round(8 * s);
  const headD = Math.round(4 * s);
  
  // Lower head (wider base)
  cube(cx, cy, cz, cx + headW, cy + Math.round(4 * s), cz + headD, STONE);
  
  // Upper head with slight taper
  const taper = Math.round(0.4 * s);
  cube(cx - taper, cy + Math.round(4 * s), cz - Math.round(0.5 * s), cx + headW + taper, cy + headH, cz + headD, STONE);
  
  // Massive protruding chin (most distinctive Moai feature)
  const chinProtrude = Math.round(3.5 * s);
  const chinH = Math.round(3 * s);
  cube(cx + Math.round(0.5 * s), cy, cz - chinProtrude, cx + Math.round(4.5 * s), cy + chinH, cz - 1, STONE);
  
  // Nasal ridge dividing the face
  const noseX = cx + Math.round(2 * s);
  cube(noseX, cy + Math.round(1.5 * s), cz - 1, noseX + Math.round(1 * s), cy + Math.round(5.5 * s), cz + 1, STONE);
  
  // Long ears (stretched downward, characteristic of Moai)
  const earW = Math.round(2 * s);
  const earH = Math.round(5 * s);
  const earY = cy + Math.round(0.5 * s);
  const earZ = cz + Math.round(0.5 * s);
  
  cube(cx - earW, earY, earZ, cx, earY + earH, earZ + Math.round(2 * s), STONE);
  cube(cx + headW, earY, earZ, cx + headW + earW, earY + earH, earZ + Math.round(2 * s), STONE);
  
  // Heavy brow ridge above eyes
  const browY = cy + Math.round(5 * s);
  cube(cx - Math.round(0.5 * s), browY, cz - 1, cx + headW + Math.round(0.5 * s), browY + Math.round(1.5 * s), cz + Math.round(1.5 * s), STONE);
  
  // Deep eye sockets (carved out)
  const eyeSize = Math.round(1.2 * s);
  const eyeDepth = Math.round(2.5 * s);
  const eyeY = cy + Math.round(3.8 * s);
  
  const leftEyeX = cx + Math.round(1.3 * s);
  const rightEyeX = cx + Math.round(3.7 * s);
  
  cube(leftEyeX - Math.round(0.3 * s), eyeY, cz - eyeDepth, leftEyeX + eyeSize, eyeY + eyeSize + Math.round(0.5 * s), cz - Math.round(0.3 * s), AIR);
  cube(rightEyeX - Math.round(0.3 * s), eyeY, cz - eyeDepth, rightEyeX + eyeSize, eyeY + eyeSize + Math.round(0.5 * s), cz - Math.round(0.3 * s), AIR);
  
  // Mouth cavity
  const mouthY = cy + Math.round(1.2 * s);
  cube(cx + Math.round(1.2 * s), mouthY, cz - Math.round(2 * s), cx + Math.round(3.8 * s), mouthY + Math.round(1 * s), cz - Math.round(0.3 * s), AIR);
  
  // Cheekbone definition
  const cheekY = cy + Math.round(2.5 * s);
  cube(cx - Math.round(2 * s), cheekY, cz + Math.round(1 * s), cx - Math.round(0.3 * s), cheekY + Math.round(2 * s), cz + Math.round(2.5 * s), STONE);
  cube(cx + headW + Math.round(0.3 * s), cheekY, cz + Math.round(1 * s), cx + headW + Math.round(2 * s), cheekY + Math.round(2 * s), cz + Math.round(2.5 * s), STONE);
  
  // Neck/shoulders below head
  const neckW = Math.round(3.5 * s);
  const neckX = cx + Math.round(0.75 * s);
  const neckZ = cz + Math.round(2 * s);
  const neckH = Math.round(4 * s);
  
  cube(neckX, cy - neckH, neckZ, neckX + neckW, cy, neckZ + Math.round(2 * s), STONE);
}

// Multi-tiered stone platform
cube(-22, 0, -8, 22, 1, 5, COBBLE);
cube(-20, 1, -7, 20, 2, 4, STONE);
cube(-18, 2, -6, 18, 3, 3, COBBLE);

// Create five Moai statues in a line facing the viewer (toward -Z)
// Varying scales to show distance and create depth
createMoai(-18, 3, -3, 1.4);
createMoai(-10, 3, -5, 1.0);
createMoai(-2, 3, -3, 0.85);
createMoai(8, 3, -5, 0.75);
createMoai(16, 3, -3, 0.65);