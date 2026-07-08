// sea-serpent-4x-haiku — prompt:
// a sea serpent...

// SEA SERPENT - sinuous aquatic creature with detailed head and coiled body

// HEAD - main focal point, faces north (-Z) toward camera
sphere(0, 3, -14, 3.5, GLASS);

// Head crest - top ridge
cube(-1, 6, -15, 1, 7, -10, GLASS);

// Left eye - large and expressive
sphere(-1.3, 4, -17, 1.1, ICE);
block(-1, 4, -18, COBBLE);

// Right eye
sphere(1.3, 4, -17, 1.1, ICE);
block(1, 4, -18, COBBLE);

// Snout protrusion
cube(-0.6, 2, -17, 0.6, 3, -16, GLASS);

// Mouth cavity - carved detail
cube(-1.5, 0.5, -15, 1.5, 1.5, -11, AIR);

// Lower jaw
cube(-2, -0.5, -15, 2, 0.5, -11, GLASS);

// NECK - transitions from head
cylinder(0, 0.5, -7, 2.5, 5, GLASS);

// Dorsal spines (back ridge along entire body)
block(0, 6, -9, STONE);
block(0, 6, -5, STONE);
block(0, 6, 0, STONE);
block(0, 6, 4, STONE);
block(0, 5, 8, STONE);
block(0, 4, 12, STONE);
block(0, 5, 16, STONE);
block(0, 5, 20, STONE);

// FIRST BODY COIL - sinuous curve to the right (+X direction)
// Main cylinder body
cylinder(4, -0.5, 2, 2.3, 8, GLASS);

// Add body volume/thickness
cube(3, -1.5, -0.5, 6.5, 2, 5, GLASS);

// Coil spines
block(4, 5, 0, STONE);
block(4, 5, 3, STONE);

// SECOND BODY COIL - curves left and dips down (-X, -Y)
cylinder(-3, -2, 10, 2.3, 8, GLASS);

// Add thickness
cube(-5.5, -3, 8, -0.5, 1, 12, GLASS);

// Coil spines
block(-3, 3, 8, STONE);
block(-3, 3, 11, STONE);

// THIRD BODY SEGMENT - curves upward and right (+Y, +X)
cylinder(2, 1.5, 18, 2, 5, ICE);

// TAIL - narrows toward tip
cylinder(1, 4, 23, 1.3, 5, ICE);
cylinder(0, 5.5, 27, 0.8, 3, GLASS);
block(0, 6, 30, ICE);

// SCALE DETAIL - textured bumps for serpent scales
sphere(0, 0.5, -5, 1, ICE);
sphere(4, -1.2, 3, 1.2, ICE);
sphere(-3, -2.5, 10, 1.1, ICE);
sphere(2, 0.8, 18, 0.9, ICE);

// PECTORAL FINS - side fins
cube(-4.5, -0.5, 0, -2, 2.5, 10, GLASS);
cube(4.5, -0.5, 0, 2, 2.5, 10, GLASS);

// VENTRAL FIN - bottom fin
cube(-1, -2, 8, 1, -1, 13, GLASS);

// UNDERBELLY STRIPE - lighter coloring for contrast
cube(-1, -1.5, -8, 1, -1, 25, SAND);

// WATER BUBBLE DETAILS - scattered for atmosphere
block(-5, 2, 0, GLASS);
block(6, 1, 5, GLASS);
block(-4, -0.5, 12, GLASS);
block(3, 2, 20, GLASS);

// Additional scale ridges along body
for (let i = 0; i < 4; i++) {
  const x = i % 2 === 0 ? 1.5 : -1.5;
  const z = 5 + i * 4;
  block(x, 0.5, z, ICE);
}