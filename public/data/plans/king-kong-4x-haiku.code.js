// king-kong-4x-haiku — prompt:
// King Kong...

// King Kong - Massive aggressive ape, climbing stance

// TORSO - Core muscular body
cube(-5, 2, -3, 5, 14, 5, COBBLE);

// SHOULDERS - Broad and powerful
cube(-8, 11, -2, 8, 16, 3, COBBLE);
cube(-7, 10, -3, 7, 12, 4, STONE);

// CHEST - Muscle definition with ribs
cube(-4, 7, 0, 4, 13, 2, BRICK);
for (let i = 0; i < 5; i++) {
  const y = 8 + i;
  cube(-3, y, 1, -1, y + 1, 2, STONE);
  cube(1, y, 1, 3, y + 1, 2, STONE);
}

// BACK - Muscle texture
cube(-4, 8, -4, 4, 13, -3, STONE);
for (let y = 9; y < 12; y++) {
  block(-5, y, -2, STONE);
  block(5, y, -2, STONE);
}

// LEFT ARM - Extended and muscular
cube(-10, 8, -3, -6, 22, 2, COBBLE);
cube(-11, 11, -2, -8, 24, 3, COBBLE);
cube(-13, 14, -1, -10, 26, 2, COBBLE);
cylinder(-9, 13, 0, 1.5, 11, STONE);
for (let y = 9; y < 21; y += 2) {
  block(-11, y, -1, STONE);
}

// RIGHT ARM - Extended and muscular
cube(6, 8, -3, 10, 22, 2, COBBLE);
cube(8, 11, -2, 11, 24, 3, COBBLE);
cube(10, 14, -1, 13, 26, 2, COBBLE);
cylinder(9, 13, 0, 1.5, 11, STONE);
for (let y = 9; y < 21; y += 2) {
  block(11, y, -1, STONE);
}

// LEFT FIST - Clenched and menacing
cube(-15, 17, 0, -11, 21, 3, STONE);
cube(-16, 16, 1, -12, 20, 4, STONE);
for (let i = 0; i < 3; i++) {
  block(-15 - i, 19 + i, 3, STONE);
  block(-12 - i, 19 + i, 4, STONE);
}

// RIGHT FIST - Clenched and menacing
cube(11, 17, 0, 15, 21, 3, STONE);
cube(12, 16, 1, 16, 20, 4, STONE);
for (let i = 0; i < 3; i++) {
  block(15 + i, 19 + i, 3, STONE);
  block(12 + i, 19 + i, 4, STONE);
}

// MASSIVE HEAD - Dominant and threatening
cube(-7, 15, -4, 7, 32, 8, COBBLE);
sphere(0, 24, 2, 7, COBBLE);

// FACE - Pronounced features
cube(-6, 14, 2, 6, 22, 10, COBBLE);

// EYES - Angry, piercing
cube(-4, 26, 4, -2, 28, 6, GLASS);
cube(-3, 26, 5, -2, 27, 6, GLASS);
cube(2, 26, 4, 4, 28, 6, GLASS);
cube(2, 26, 5, 3, 27, 6, GLASS);

// HEAVY BROW - Aggressive ridge
cube(-6, 29, 2, 6, 30, 5, STONE);

// SNOUT - Protruding muzzle
cube(-5, 16, 8, 5, 21, 12, COBBLE);
cube(-4, 15, 9, 4, 20, 11, STONE);

// MOUTH - Open and roaring
cube(-3, 18, 11, 3, 23, 14, BRICK);
cube(-2, 19, 12, 2, 22, 14, BRICK);

// TEETH - Upper and lower
cube(-3, 22, 13, 3, 23, 15, SNOW);
cube(-3, 18, 13, 3, 19, 15, SNOW);

// NOSE - Large and prominent
cube(-2, 20, 12, 2, 22, 13, COBBLE);
block(-1, 21, 13, AIR);
block(1, 21, 13, AIR);

// JAW - Strong and powerful
cube(-6, 15, 8, 6, 18, 10, STONE);

// NECK - Thick connection
cube(-4, 12, 2, 4, 15, 8, COBBLE);

// LEFT LEG - Powerful stance
cube(-4, -3, -2, -1, 9, 2, COBBLE);
cube(-5, -4, 0, -2, 4, 2, COBBLE);
for (let y = 2; y < 8; y += 2) {
  block(-4, y, -1, STONE);
}

// RIGHT LEG - Powerful stance
cube(1, -3, -2, 4, 9, 2, COBBLE);
cube(2, -4, 0, 5, 4, 2, COBBLE);
for (let y = 2; y < 8; y += 2) {
  block(4, y, -1, STONE);
}

// LEFT FOOT - Large and clawed
cube(-7, -6, 0, -1, -1, 5, STONE);
cube(-8, -7, 2, -2, -4, 4, STONE);
block(-8, -8, 3, STONE);
block(-7, -8, 4, STONE);

// RIGHT FOOT - Large and clawed
cube(1, -6, 0, 7, -1, 5, STONE);
cube(2, -7, 2, 8, -4, 4, STONE);
block(8, -8, 3, STONE);
block(7, -8, 4, STONE);

// SHOULDER DEFINITION - Muscle peaks
cube(-8, 14, 2, -7, 17, 4, STONE);
cube(7, 14, 2, 8, 17, 4, STONE);

// HEAD CROWN - Hair/mane spikes
cube(-6, 30, -3, 6, 33, 2, STONE);
for (let x = -5; x <= 5; x += 2) {
  block(x, 34, 0, STONE);
}

// BACK OF HEAD - Muscle texture
for (let y = 20; y < 28; y += 2) {
  block(-7, y, -3, STONE);
  block(7, y, -3, STONE);
}

// ARM DETAIL - Veins/muscle
for (let y = 11; y < 20; y += 3) {
  line(-10, y, -2, -7, y, -2, STONE);
  line(7, y, -2, 10, y, -2, STONE);
}

// KNUCKLE DEFINITION
for (let x = -16; x <= -12; x++) {
  block(x, 20, 3, STONE);
  block(x, 20, 2, STONE);
}
for (let x = 12; x <= 16; x++) {
  block(x, 20, 3, STONE);
  block(x, 20, 2, STONE);
}

// HAIR/FUR TEXTURE on chest
for (let y = 8; y < 12; y += 2) {
  for (let x = -2; x <= 2; x += 2) {
    block(x, y, 4, STONE);
    block(x, y, -2, STONE);
  }
}

// FOREARM THICKNESS
for (let z = -1; z <= 1; z++) {
  cylinder(-9, 16, z, 1.5, 8, STONE);
  cylinder(9, 16, z, 1.5, 8, STONE);
}

// BODY ASYMMETRY - Left shoulder higher
cube(-8, 16, 0, -6, 18, 2, STONE);

// ABDOMEN - Defined serratus
for (let i = 0; i < 3; i++) {
  const y = 9 + i * 2;
  block(-5, y, 2, BRICK);
  block(5, y, 2, BRICK);
}