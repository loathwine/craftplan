// peacock-4x-haiku — prompt:
// a peacock with its tail fanned out...

// Peacock with elaborate fanned tail

// === BODY ===
cube(-2, 1, -1, 2, 6, 2, 8); // COBBLE torso
cube(-3, 2, -2, 3, 5, -1, 7); // PLANKS breast

// === LEGS ===
line(-1.5, 0, -0.5, -1.5, 4, -0.5, 4); // OAK_LOG back left
line(1.5, 0, -0.5, 1.5, 4, -0.5, 4); // OAK_LOG back right

// === NECK ===
cube(-0.8, 6, -3, 0.8, 9, -1, 7); // PLANKS

// === HEAD ===
sphere(0, 10, -4, 1.2, 3); // STONE
cube(-0.3, 11, -4, 0.3, 14, -3.5, 10); // BRICK crest
block(-0.5, 10, -5, 11); // GLASS eye left
block(0.5, 10, -5, 11); // GLASS eye right

// === TAIL BASE ===
cube(-9, 2, 1, 9, 8, 5, 5); // LEAVES main base
cube(-11, 1, 3, 11, 6, 7, 5); // LEAVES lower platform

// === INNER FEATHER LAYER ===
cube(-11, 4, 7, -7, 10, 10, 11); // GLASS left inner
cube(7, 4, 7, 11, 10, 10, 11); // GLASS right inner
cube(-4, 3, 8, 4, 11, 11, 5); // LEAVES center

// === MIDDLE FEATHER LAYER ===
cube(-14, 5, 11, -10, 11, 14, 10); // BRICK left mid
cube(10, 5, 11, 14, 11, 14, 10); // BRICK right mid
cube(-3, 4, 12, 3, 12, 15, 5); // LEAVES center tall

// === OUTER FEATHER LAYER ===
cube(-16, 6, 14, -12, 12, 17, 11); // GLASS left outer
cube(12, 6, 14, 16, 12, 17, 11); // GLASS right outer
cube(-2, 5, 16, 2, 13, 19, 6); // SAND center far

// === EXTENDED POINTS ===
cube(-18, 7, 16, -14, 13, 19, 10); // BRICK left far
cube(14, 7, 16, 18, 13, 19, 10); // BRICK right far

// === TAIL CROWN ===
sphere(0, 13, 12, 7, 5); // LEAVES crown sphere
cube(-1, 14, 11, 1, 16, 13, 10); // BRICK peak

// === ORNAMENTAL ACCENTS ===
cube(-13, 8, 12, -11, 10, 14, 6); // SAND left accent
cube(11, 8, 12, 13, 10, 14, 6); // SAND right accent
cube(-3, 10, 13, 3, 12, 15, 7); // PLANKS gold detail

// === FEATHER TEXTURE DETAILS ===
cube(-14, 7, 14, -12, 10, 16, 7); // PLANKS left detail
cube(12, 7, 14, 14, 10, 16, 7); // PLANKS right detail
cube(-8, 3, 16, 8, 8, 18, 5); // LEAVES rear volume
cube(-10, 2, 11, 10, 7, 14, 5); // LEAVES lower rear spread

// === FEATHER TIPS & FLOURISH ===
line(-17, 12, 19, -15, 13, 21, 6); // SAND left tip
line(15, 13, 21, 17, 12, 19, 6); // SAND right tip
cube(-1, 13, 17, 1, 15, 20, 10); // BRICK center flourish