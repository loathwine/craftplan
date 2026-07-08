// r2d2-4x-haiku — prompt:
// R2-D2...

const SNOW = 12;
const GLASS = 11;
const COBBLE = 8;
const STONE = 3;

// R2-D2 Astromech Droid

// Main cylindrical body - white primary structure
cylinder(0, 0, 0, 2, 3, SNOW);

// Central band detail - darker stone for visual break
cylinder(0, 1, 0, 2, 1, STONE);

// Front access panel - blue (facing north/camera)
cube(-1, 0, -2, 1, 3, -2, GLASS);

// Right side blue panel
cube(2, 0, 0, 2, 3, 2, GLASS);

// Left side blue panel - asymmetric height
cube(-2, 0, 0, -2, 2.5, 2, GLASS);

// Back section - darker texture
cube(-1, 0, 2, 1, 3, 2, COBBLE);

// Dome/head - white rounded top
sphere(0, 4, 0, 2, SNOW);

// Blue dome accent (upper right)
sphere(1, 4, -1, 1.2, GLASS);

// Top sensor light - blue
sphere(0, 6, 0, 0.8, GLASS);

// Sensor surround ring
sphere(0, 6, 0, 1.2, STONE);

// Platform base - dark stable foundation
cube(-3, -1, -3, 3, -1, 3, COBBLE);

// Three tripod feet (R2-D2's characteristic stance)
cube(-1, -1, 2, -1, 0, 2, STONE);
cube(1, -1, 2, 1, 0, 2, STONE);
cube(0, -1, -2, 0, 0, -2, STONE);

// Front panel vents - stacked asymmetry
cube(-1, 0.5, -2, 0, 1.5, -2, COBBLE);
cube(0, 2, -2, 1, 2.8, -2, COBBLE);

// Right side vent detail
cube(2, 1.2, 1, 2, 2.2, 2, COBBLE);

// Left side vent - lower placement
cube(-2, 0.3, 1, -2, 1.2, 2, COBBLE);

// Horizontal panel definition grooves
line(-2, 1.5, -0.5, 2, 1.5, -0.5, GLASS);
line(-2, 2.5, 0.5, 2, 2.5, 0.5, GLASS);

// Small left-side protrusion for asymmetry
cube(-3, 2, 0, -3, 2.5, 1, STONE);

// Dome side details
cube(-1, 3.2, -1, 0, 3.2, 0, GLASS);
cube(1, 3.2, -1, 1, 3.2, 0, GLASS);

// Lower dome accent panels
cube(-0.5, 3, 1, 0.5, 3, 2, GLASS);