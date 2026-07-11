// sydney-opera-4x-haiku — prompt:
// the Sydney Opera House...

// Sydney Opera House - Iconic Shell Architecture

// Tiered podium base
cube(-18, -2, -14, 18, 0, 12, STONE);
cube(-16, 0, -12, 16, 1, 10, STONE);
cube(-14, 1, -10, 14, 2, 8, STONE);
cube(-12, 2, -8, 12, 3, 6, STONE);

// Main iconic shells - front trio
sphere(-9, 9, 1, 5, STONE);     // Left front
sphere(0, 10, 2, 5, STONE);     // Center (raised)
sphere(9, 9, 1, 5, STONE);      // Right front

// Back shells - complementary pair
sphere(-5, 8, 9, 4, STONE);
sphere(5, 8, 9, 4, STONE);

// Accent shells at podium corners
sphere(-14, 6, -5, 3, STONE);
sphere(14, 6, -5, 3, STONE);
sphere(-2, 7, 12, 3, STONE);
sphere(2, 7, 12, 3, STONE);

// Support rib columns
cylinder(-9, 3, 1, 1, 6, COBBLE);
cylinder(0, 3, 2, 1, 7, COBBLE);
cylinder(9, 3, 1, 1, 6, COBBLE);
cylinder(-5, 3, 9, 1, 5, COBBLE);
cylinder(5, 3, 9, 1, 5, COBBLE);

// Connecting terraces
cube(-12, 3, -6, -9, 4, 0, STONE);
cube(9, 3, -6, 12, 4, 0, STONE);
cube(-2, 3, 5, 2, 4, 8, STONE);

// Front plaza with steps
cube(-6, 3, -10, 6, 4, -7, STONE);
cube(-4, 4, -10, 4, 5, -7, STONE);
cube(-2, 5, -10, 2, 6, -7, STONE);

// Side pavilion structures
cube(-16, 4, 7, -13, 6, 10, STONE);
cube(13, 4, 7, 16, 6, 10, STONE);

// Entrance portico detail
cube(-8, 3, -8, -6, 6, -5, COBBLE);
cube(6, 3, -8, 8, 6, -5, COBBLE);

// Back platform extension
cube(-6, 3, 10, 6, 4, 12, STONE);

// Harbor water
cube(-20, -2, 13, 20, 0, 22, GLASS);

// Surrounding water features
cube(-22, -2, -16, -18, 0, 8, GLASS);
cube(18, -2, -16, 22, 0, 8, GLASS);