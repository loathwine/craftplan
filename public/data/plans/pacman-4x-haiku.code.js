// pacman-4x-haiku — prompt:
// Pac-Man chased by a ghost...

// PAC-MAN - left side, fleeing toward camera
const pacX = -7;
const pacY = 4;
const pacZ = -2;

// Head - yellow sphere
sphere(pacX, pacY, pacZ, 3.2, SAND);

// Mouth carving - wedge opens toward camera (negative Z)
for (let dx = -2.5; dx <= 2.5; dx += 0.5) {
  for (let dy = -2; dy <= 2; dy += 0.5) {
    const angle = Math.atan2(dy, dx);
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (angle > -Math.PI/7 && angle < Math.PI/7 && dist < 2.8) {
      line(pacX + dx, pacY + dy, pacZ - 3.5, pacX + dx, pacY + dy, pacZ + 0.5, AIR);
    }
  }
}

// Eyes - panicked expression
block(pacX - 1.3, pacY + 1.8, pacZ - 1, BRICK);
block(pacX + 1.3, pacY + 1.8, pacZ - 1, BRICK);

// Body - yellow rectangle below head
cube(pacX - 1.8, pacY - 4, pacZ - 2, pacX + 1.8, pacY - 1.2, pacZ + 2.2, SAND);

// Feet - small blocks
cube(pacX - 1.5, pacY - 4.5, pacZ - 1.5, pacX - 0.3, pacY - 4, pacZ - 0.5, SAND);
cube(pacX + 0.3, pacY - 4.5, pacZ - 1.5, pacX + 1.5, pacY - 4, pacZ - 0.5, SAND);

// GHOST - right side, chasing menacingly
const gX = 11;
const gY = 4.8;
const gZ = 7;

// Head/body - white rounded form
sphere(gX, gY, gZ, 3.8, SNOW);

// Eyes - menacing red orbs
block(gX - 1.6, gY + 1.6, gZ - 3, BRICK);
block(gX + 1.6, gY + 1.6, gZ - 3, BRICK);

// Mouth - evil grin
block(gX - 1.2, gY - 0.5, gZ - 3, BRICK);
block(gX, gY - 0.5, gZ - 3, BRICK);
block(gX + 1.2, gY - 0.5, gZ - 3, BRICK);

// Ghost skirt - wavy undulating bottom
const skirtBase = gY - 3.5;
for (let zi = gZ - 4.5; zi <= gZ + 4.5; zi += 1.3) {
  const wave = Math.sin((zi - gZ) * 0.3) * 0.7;
  const y = skirtBase + wave;
  
  // Left bump
  cube(gX - 3.5, y, zi - 0.7, gX - 1.3, y + 2, zi + 0.7, SNOW);
  
  // Center bump
  cube(gX - 0.8, y - 0.4, zi - 0.8, gX + 0.8, y + 2.1, zi + 0.8, SNOW);
  
  // Right bump
  cube(gX + 1.3, y, zi - 0.7, gX + 3.5, y + 2, zi + 0.7, SNOW);
}

// Ground - grass platform
cube(-13, -1, -3, 16, 0, 12, GRASS);

// Scene depth - brick walls
cube(-13, 0, -3, -12, 4, -1, BRICK);
cube(15, 0, 10, 16, 3, 12, BRICK);

// Back wall
cube(-10, 0, 11, 14, 2, 12, COBBLE);

// Scattered blocks for visual interest
cube(-4, 0, -1, -3, 1, 0, COBBLE);
cube(6, 0, 9, 7, 2, 10, COBBLE);
cube(-2, 0, 11, 2, 1, 12, COBBLE);

// Shadow/depth indicators on ground
line(-7, 0.05, -2, -7, 0.05, 2, STONE);
line(11, 0.05, 7, 11, 0.05, 10, STONE);