// loch-ness-4x-haiku — prompt:
// the Loch Ness Monster...

// The Loch Ness Monster - Serpent of the Depths

// HEAD SECTION
sphere(0, 7.5, -12, 2.5, STONE);
cube(-1, 5.5, -14, 1, 6.5, -10, COBBLE);

// Eyes - distinctive and bright
sphere(-1.5, 8, -11.5, 0.8, ICE);
sphere(1.5, 8, -11.5, 0.8, ICE);

// Brow ridges
cube(-2, 8.5, -13, -1, 9, -11, STONE);
cube(1, 8.5, -13, 2, 9, -11, STONE);

// Nostril detail
block(-0.5, 7, -14, COBBLE);
block(0.5, 7, -14, COBBLE);

// NECK TRANSITION
cylinder(0, 6.5, -7, 2.1, 4, STONE);

// FIRST MAJOR HUMP (z = -3 to 4)
cube(-3, 2, -3, 3, 7, 4, STONE);
cube(-3, 7, -1, 3, 8, 2, STONE);
cube(-2, 8, 0, 2, 9, 1, STONE);

// Darker texture patches on hump 1
cube(-2, 4, -2, -1, 6, 1, COBBLE);
cube(1, 4, -2, 2, 6, 1, COBBLE);
cube(-3, 5, -1, -2.5, 6, 0, COBBLE);
cube(2.5, 5, -1, 3, 6, 0, COBBLE);

// SECOND HUMP (z = 6 to 12)
cube(-3, 1.5, 6, 3, 6, 12, STONE);
cube(-3, 6, 8, 3, 7, 10, STONE);
cube(-2, 7, 8, 2, 8, 9, STONE);

// Texture on hump 2
cube(-1.5, 3, 7, 1.5, 5, 11, COBBLE);
cube(-2.5, 4, 8, -1.5, 5, 9, COBBLE);
cube(1.5, 4, 8, 2.5, 5, 9, COBBLE);
cube(-0.5, 5, 9, 0.5, 6, 11, COBBLE);

// THIRD HUMP (z = 14 to 20)
cube(-2.5, 1.5, 14, 2.5, 6, 20, STONE);
cube(-2.5, 6, 16, 2.5, 7, 18, STONE);
cube(-1.5, 7, 16, 1.5, 8, 17, STONE);

// Texture on hump 3
cube(-1, 3, 15, 1, 5, 19, COBBLE);
cube(-2, 4, 16, -1, 5, 17, COBBLE);
cube(1, 4, 16, 2, 5, 17, COBBLE);

// TAIL (z = 21-22)
cube(-1, 2.5, 21, 1, 5, 22, COBBLE);

// FLIPPERS - dark wood
// Front pair
cube(-4.5, 3.5, -6, -3.5, 5.5, -2, OAK_LOG);
cube(3.5, 3.5, -6, 4.5, 5.5, -2, OAK_LOG);

// Mid pair
cube(-4.5, 2.5, 7, -3.5, 4.5, 11, OAK_LOG);
cube(3.5, 2.5, 7, 4.5, 4.5, 11, OAK_LOG);

// Rear pair
cube(-3.5, 2, 15, -2.5, 4, 19, OAK_LOG);
cube(2.5, 2, 15, 3.5, 4, 19, OAK_LOG);

// DORSAL SPINE - ridge down the back
for (let z = -8; z <= 20; z++) {
  const y = 6.5 + 0.4 * Math.sin(z / 2.2);
  block(0, Math.round(y), z, ICE);
}

// GLOSSY WET PATCHES (scales)
block(-1, 7.5, -2, ICE);
block(1, 7.5, 1, ICE);
block(-2, 6, 8, ICE);
block(2, 6, 10, ICE);
block(-1, 5, 16, ICE);
block(1, 5, 18, ICE);
block(0, 8, -1, ICE);
block(-2.5, 6, 4, ICE);
block(2.5, 6, 4, ICE);
block(-1.5, 5.5, 13, ICE);
block(1.5, 5.5, 13, ICE);

// Additional underbelly detail
cube(-0.5, 1, -1, 0.5, 1.8, 3, SAND);
cube(-0.5, 0.5, 8, 0.5, 1.2, 11, SAND);
cube(-0.5, 0.5, 16, 0.5, 1.2, 19, SAND);

// Side flange detail for organic look
cube(-3.5, 3.5, -1, -3, 5, 2, STONE);
cube(3, 3.5, -1, 3.5, 5, 2, STONE);
cube(-3.5, 3, 8, -3, 4.5, 11, STONE);
cube(3, 3, 8, 3.5, 4.5, 11, STONE);