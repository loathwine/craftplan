// sphinx-giza-4x-haiku — prompt:
// the Great Sphinx of Giza...

// Great Sphinx of Giza

// Main body - massive recumbent lion
cube(-7, 0, -6, 7, 5, 14, 3);

// Body surface detail with cobble striping
cube(-8, 1, -4, -7, 4, 12, 8);
cube(7, 1, -4, 8, 4, 12, 8);

// Underbelly in planks
cube(-6, 0, -4, 6, 2, 12, 7);

// FRONT LEGS (north side)
cube(-8, -3, -7, -6, 3, -4, 3);
cube(6, -3, -7, 8, 3, -4, 3);
cube(-8, 0, -7, -7, 2, -4, 8);
cube(7, 0, -7, 8, 2, -4, 8);

// BACK LEGS (south side)
cube(-8, -3, 12, -6, 3, 15, 3);
cube(6, -3, 12, 8, 3, 15, 3);
cube(-8, 0, 12, -7, 2, 15, 8);
cube(7, 0, 12, 8, 2, 15, 8);

// EXTENDED FRONT PAWS - iconic feature
cube(-9, -1, -10, -7, 2, -7, 3);
cube(7, -1, -10, 9, 2, -7, 3);
cube(-10, 0, -9, -8, 1, -8, 8);
cube(8, 0, -9, 10, 1, -8, 8);

// HEAD - human head on lion's body
cube(-5, 5, -13, 5, 13, -5, 8);
cube(-4, 6, -14, 4, 12, -13, 3);

// LEFT EYE
cube(-3, 9, -14, -1, 11, -13, 10);
block(-2, 10, -14, 11);

// RIGHT EYE
cube(1, 9, -14, 3, 11, -13, 10);
block(2, 10, -14, 11);

// NOSE - prominent ridge
cube(-1, 7, -14, 1, 10, -13, 3);
block(0, 9, -14, 10);

// MOUTH/CHIN
cube(-3, 5, -14, 3, 7, -13, 3);
line(-2, 5, -14, 2, 5, -14, 10);

// EARS
cube(-6, 9, -10, -5, 13, -7, 3);
cube(5, 9, -10, 6, 13, -7, 3);
cube(-6, 10, -9, -5, 12, -8, 8);
cube(5, 10, -9, 6, 12, -8, 8);

// NEMES HEADDRESS - iconic striped royal headdress
cube(-5, 12, -12, 5, 15, -5, 5);
cube(-5, 13, -11, 5, 14, -5, 3);
cube(-4, 14, -11, 4, 15, -5, 3);

// NECK
cube(-4, 4, -4, 4, 6, 1, 3);
cube(-3, 4, -2, 3, 5, 0, 8);

// MANE - behind head
cube(-5, 9, -3, 5, 13, 2, 5);
cube(-4, 10, -1, 4, 12, 1, 3);

// TAIL
cube(-2, 3, 13, 2, 5, 16, 3);
cube(-1, 4, 17, 1, 7, 20, 3);

// GROUND/FOUNDATION
cube(-12, -4, -16, 12, -1, 17, 2);
cube(-12, -3, -16, -8, -1, 17, 3);
cube(8, -3, -16, 12, -1, 17, 3);

// Surface weathering texture
cube(-6, 3, 1, 6, 4, 11, 8);
cube(-7, 2, 5, 7, 3, 9, 8);
cube(-7, 3, -4, 7, 4, 4, 8);

// Ground markers
cube(-11, -2, -12, -10, 1, -11, 10);
cube(10, -2, -12, 11, 1, -11, 10);

// Additional body surface detail
cube(-5, 4, 2, 5, 5, 8, 8);
cube(-5, 4, 10, 5, 5, 14, 8);

// Paw detail cracks
line(-9, 1, -9, -8, 1, -8, 3);
line(8, 1, -9, 9, 1, -8, 3);