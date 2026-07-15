// wendigo-4x-haiku — prompt:
// a wendigo...

// Wendigo - skeletal emaciated horror
// Face north (-Z), body extends south (+Z)

// === SPINE & SKELETON ===
for (let y = 0; y <= 13; y++) {
  block(0, y, 0, STONE);
  if (y % 2 === 1) block(0, y, 1, COBBLE);
}

// === PELVIS ===
cube(-3, 0, -2, 3, 0, 2, STONE);
cube(-4, 0, -1, 4, 0, 1, COBBLE);
cube(-3, 1, -1, 3, 1, 1, STONE);
block(-5, 0, 0, COBBLE);
block(5, 0, 0, COBBLE);

// === RIBS - ASYMMETRIC ===
// Left ribs, expanding downward
cube(-2, 3, -1, -1, 3, 1, STONE);
cube(-4, 4, -1, -1, 4, 1, STONE);
cube(-5, 5, -1, -1, 5, 1, STONE);
cube(-6, 6, -1, -1, 6, 1, STONE);
cube(-5, 7, -1, -1, 7, 1, STONE);
cube(-4, 8, -1, -1, 8, 1, STONE);
cube(-3, 9, -1, -1, 9, 1, STONE);

// Right ribs
cube(1, 3, -1, 2, 3, 1, STONE);
cube(1, 4, -1, 4, 4, 1, STONE);
cube(1, 5, -1, 5, 5, 1, STONE);
cube(1, 6, -1, 6, 6, 1, STONE);
cube(1, 7, -1, 5, 7, 1, STONE);
cube(1, 8, -1, 4, 8, 1, STONE);
cube(1, 9, -1, 3, 9, 1, STONE);

// Rib detail - COBBLE highlights
for (let y = 3; y <= 9; y += 2) {
  block(-6, y, -1, COBBLE);
  block(6, y, -1, COBBLE);
}

// === CHEST ===
cube(-1, 6, -2, 1, 9, 1, STONE);

// Sternum
for (let y = 5; y <= 8; y++) {
  block(0, y, -1, COBBLE);
}

// Exposed cavity (hollow look)
cube(-1, 6, 0, 1, 8, 1, AIR);

// === SHOULDERS ===
cube(-5, 10, -1, -3, 12, 1, STONE);
cube(3, 10, -1, 5, 12, 1, STONE);

// Shoulder blade detail
block(-6, 11, 0, COBBLE);
block(6, 11, 0, COBBLE);

// === LEFT ARM - REACHING ===
// Upper arm
cube(-7, 11, -1, -5, 13, 1, STONE);

// Elbow joint
block(-6, 11, 0, COBBLE);

// Forearm angled forward-down
cube(-9, 9, -3, -6, 11, -1, STONE);
block(-9, 9, -3, COBBLE);

// Wrist
cube(-10, 8, -4, -8, 9, -2, COBBLE);

// Hand - clawed, spread
cube(-11, 7, -6, -8, 10, -2, COBBLE);
cube(-12, 6, -7, -7, 9, -4, COBBLE);

// Fingers extending
line(-11, 9, -7, -14, 3, -10, COBBLE);
line(-10, 8, -5, -13, 2, -2, COBBLE);
line(-9, 8, -6, -12, 1, -8, COBBLE);

// === RIGHT ARM - MIRROR ===
cube(5, 11, -1, 7, 13, 1, STONE);
block(6, 11, 0, COBBLE);
cube(6, 9, -3, 9, 11, -1, STONE);
block(9, 9, -3, COBBLE);
cube(8, 8, -4, 10, 9, -2, COBBLE);
cube(8, 7, -6, 11, 10, -2, COBBLE);
cube(7, 6, -7, 12, 9, -4, COBBLE);

line(11, 9, -7, 14, 3, -10, COBBLE);
line(10, 8, -5, 13, 2, -2, COBBLE);
line(9, 8, -6, 12, 1, -8, COBBLE);

// === LEGS ===
// Left thigh
cube(-2, 0, -1, -1, -4, 1, STONE);
block(-2, -4, 0, COBBLE);

// Left shin
cube(-2, -4, -1, -1, -9, 1, STONE);

// Left foot
cube(-3, -9, -2, 0, -10, 2, COBBLE);
line(-3, -9, -3, -1, -12, -5, COBBLE);

// Right thigh
cube(1, 0, -1, 2, -4, 1, STONE);
block(2, -4, 0, COBBLE);

// Right shin
cube(1, -4, -1, 2, -9, 1, STONE);

// Right foot
cube(0, -9, -2, 3, -10, 2, COBBLE);
line(3, -9, -3, 1, -12, -5, COBBLE);

// === NECK ===
cube(-1, 13, -1, 1, 15, 0, STONE);

// === SKULL - GAUNT ===
// Main cranium
cube(-2, 15, -3, 2, 17, 0, STONE);

// Upper skull
cube(-1, 17, -2, 1, 18, 0, STONE);

// Eye sockets - hollow and dark
block(-1, 16, -3, GLASS);
block(1, 16, -3, GLASS);

// Nasal passage
block(0, 15, -3, GLASS);

// Cheekbones
block(-2, 16, -2, COBBLE);
block(2, 16, -2, COBBLE);

// Teeth - jagged
for (let x = -2; x <= 2; x++) {
  if (x % 2 === 1) block(x, 14, -3, BRICK);
}

// Lower jaw
cube(-2, 13, -3, 2, 14, -1, COBBLE);

// === ANTLERS - MAJOR FOCAL POINT ===
// Left antler base
cube(-3, 18, -1, -1, 19, 1, STONE);

// Main left antler - tall backward
line(-3, 19, -1, -6, 28, -6, STONE);
for (let i = 0; i < 3; i++) {
  block(-6 + i, 25 - i, -5 - i, COBBLE);
}

// Left forward branch
line(-2, 19, 0, -2, 27, 6, STONE);

// Right antler base
cube(1, 18, -1, 3, 19, 1, STONE);

// Main right antler
line(3, 19, -1, 6, 28, -6, STONE);
for (let i = 0; i < 3; i++) {
  block(6 - i, 25 - i, -5 - i, COBBLE);
}

// Right forward branch
line(2, 19, 0, 2, 27, 6, STONE);

// === EMACIATION DETAILS ===
// Exposed vertebrae sides
for (let y = 5; y <= 10; y++) {
  block(-1, y, -2, COBBLE);
  block(1, y, -2, COBBLE);
}

// Wounds/blood
for (let i = 0; i < 4; i++) {
  block(-7, 6 + i, 0, BRICK);
  block(7, 6 + i, 0, BRICK);
}

// Ribs with texture
for (let y = 4; y <= 7; y++) {
  block(-6, y, 0, BRICK);
  block(6, y, 0, BRICK);
}

// Clavicle detail
cube(-5, 11, 0, -3, 11, 1, COBBLE);
cube(3, 11, 0, 5, 11, 1, COBBLE);