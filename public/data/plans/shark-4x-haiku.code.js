// shark-4x-haiku — prompt:
// a great white shark...

// Great White Shark - Detailed Voxel Build

// === HEAD & SNOUT ===
sphere(-17, 1, 0, 2, STONE);
cube(-14, 0, -2, -12, 3, 2, STONE);
cube(-12, 0, -3, -9, 4, 3, STONE);

// === NECK ===
cube(-9, 0, -3, -5, 4, 3, STONE);

// === FORWARD BODY ===
cube(-5, 0, -4, 0, 5, 4, STONE);

// === MAIN BODY (Widest) ===
cube(0, 0, -4, 8, 5, 4, STONE);

// === MID-REAR BODY ===
cube(8, 0, -3, 13, 4, 3, STONE);

// === TAIL REGION ===
cube(13, 0, -2, 17, 3, 2, STONE);

// === DORSAL FIN ===
// Main spine - tall triangular fin
cube(-3, 5, -1, -2, 9, 1, STONE);
cube(-4, 6, -1, -1, 9, 1, STONE);
cube(-5, 7, -1, 0, 9, 1, STONE);
cube(-4, 8, -1, -1, 9, 1, STONE);
// Front shading
cube(-4, 5, 0, -3, 9, 1, COBBLE);
cube(-5, 6, 0, -2, 9, 1, COBBLE);
// Back shading
cube(-3, 5, 1, -2, 9, 2, COBBLE);
cube(-4, 6, 1, -1, 9, 2, COBBLE);

// === LEFT PECTORAL FIN ===
cube(-8, 1, -6, -1, 4, -3, COBBLE);
cube(-9, 2, -7, 0, 4, -4, COBBLE);
cube(-7, 0, -7, -2, 3, -5, COBBLE);
cube(-7, 2, -6, -2, 3, -4, STONE);

// === RIGHT PECTORAL FIN ===
cube(-8, 1, 3, -1, 4, 6, COBBLE);
cube(-9, 2, 4, 0, 4, 7, COBBLE);
cube(-7, 0, 5, -2, 3, 7, COBBLE);
cube(-7, 2, 4, -2, 3, 6, STONE);

// === ANAL FIN ===
cube(3, 0, -1, 6, 2, 1, COBBLE);

// === TAIL FLUKES ===
// Lower fluke
cube(17, -2, -6, 21, 0, -2, STONE);
cube(18, -3, -7, 20, -1, -3, STONE);
// Upper fluke
cube(17, 5, 2, 21, 7, 6, STONE);
cube(18, 6, 3, 20, 8, 7, STONE);
// Center tail
cube(17, 1, -1, 21, 3, 1, COBBLE);
// Tail upper edge
cube(17, 4, 0, 21, 5, 2, COBBLE);

// === EYES ===
block(-12, 3, -5, GLASS);
block(-12, 3, 5, GLASS);

// === GILL SLITS ===
line(-10, 1, -4, -10, 3, -4, AIR);
line(-8, 1, -4, -8, 3, -4, AIR);
line(-6, 1, -4, -6, 3, -4, AIR);
line(-4, 1, -4, -4, 3, -4, AIR);

// === GILL RIDGE MARKINGS ===
cube(-9, 3, -4, -7, 4, -4, COBBLE);
cube(-7, 3, -4, -5, 4, -4, COBBLE);
cube(-6, 3, -4, -4, 4, -4, COBBLE);

// === MOUTH ===
line(-15, 1, -1, -14, 1, 1, BRICK);
block(-14, 1, -2, BRICK);
block(-14, 1, 2, BRICK);
block(-13, 2, -3, BRICK);
block(-13, 2, 3, BRICK);

// === NOSTRIL DETAIL ===
block(-17, 1, -1, AIR);
block(-17, 1, 1, AIR);

// === BODY COLORING - Upper dark gray ===
cube(-10, 3, -2, 6, 4, 2, COBBLE);
cube(6, 3, -2, 12, 4, 2, COBBLE);

// === BODY COLORING - Lower white belly ===
cube(-13, 0, -1, 14, 1, 1, SNOW);

// === BODY DETAIL & LAYERING ===
cube(-8, 4, -3, -3, 5, 3, COBBLE);
cube(-1, 4, -4, 4, 5, 4, COBBLE);
cube(5, 4, -3, 11, 5, 3, COBBLE);
cube(-4, 2, -3, 7, 3, 3, STONE);

// === JAW RIDGE ===
cube(-12, 0, -3, -9, 1, 3, COBBLE);

// === LATERAL LINE TEXTURE ===
cube(-8, 2, -4, 11, 3, -4, COBBLE);
cube(-8, 2, 4, 11, 3, 4, COBBLE);

// === DORSAL FIN ROOT ===
cube(-3, 4, -1, -2, 5, 1, STONE);
cube(-4, 5, -1, -1, 6, 1, STONE);

// === PECTORAL FIN VARIATION ===
cube(-6, 1, -5, -3, 3, -4, STONE);
cube(-6, 1, 4, -3, 3, 5, STONE);