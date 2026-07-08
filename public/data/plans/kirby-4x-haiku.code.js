// kirby-4x-haiku — prompt:
// Kirby...

// Kirby - Pink Puffball Character

// Main body - large central sphere
sphere(0, 7, 0, 5, 10);

// Head - forward-facing with overlap
sphere(0, 11, -2, 4, 10);

// Large expressive eyes
sphere(-1.5, 12, -5, 1.3, 11);
sphere(1.5, 12, -5, 1.3, 11);

// Pupils - dark centers with shine
block(-1.5, 12, -6, 8);
block(1.5, 12, -6, 8);
block(-0.5, 13, -6, 12);
block(1, 13, -6, 12);

// Eyebrows - expressive arch
line(-3, 14, -5, -0.3, 14, -5, 8);
line(0.3, 14, -5, 3, 14, -5, 8);

// Mouth - happy curved smile
line(-0.5, 9.5, -5, 0.5, 9.5, -5, 8);
line(-0.5, 8.5, -6, 0, 8, -6.5, 8);
line(0.5, 8.5, -6, 0, 8, -6.5, 8);

// Rosy puffy cheeks
sphere(-4, 10, -1, 2, 12);
sphere(4, 10, -1, 2, 12);

// Belly - light cream-colored center
sphere(0, 6, -0.5, 2.8, 12);

// Left arm - stubby rounded
cube(-8, 7, -1, -5, 9, 2, 10);
sphere(-8.5, 8, 0, 1.2, 10);

// Right arm - stubby rounded
cube(5, 7, -1, 8, 9, 2, 10);
sphere(8.5, 8, 0, 1.2, 10);

// Left foot - stocky
cube(-3, 1, 2, -0.5, 3.5, 3, 8);
cube(-3, 0, 2, -0.5, 1, 3, 10);

// Right foot - stocky
cube(0.5, 1, 2, 3, 3.5, 3, 8);
cube(0.5, 0, 2, 3, 1, 3, 10);

// Back body - dimensional depth
sphere(0, 8, 3.5, 3.5, 10);

// Side body panels - asymmetry
cube(-3, 5, 1, -2, 10, 3, 7);
cube(2, 5, 1, 3, 10, 3, 7);

// Top spikes/tufts - personality
sphere(-2.5, 14.5, -1, 1.1, 10);
sphere(0, 15.5, 0, 1, 10);
sphere(2.5, 14.5, -1, 1.1, 10);

// Back of head detail
sphere(-1.2, 12, 2.5, 1.2, 7);
sphere(1.2, 12, 2.5, 1.2, 7);

// Cheek blush lines
line(-5, 9, -2, -4, 9, -2, 12);
line(4, 9, -2, 5, 9, -2, 12);

// Body outline accents
sphere(-3.5, 7, -1, 0.9, 7);
sphere(3.5, 7, -1, 0.9, 7);

// Hand/glove details
sphere(-8.5, 8, -0.5, 0.7, 7);
sphere(8.5, 8, -0.5, 0.7, 7);

// Feet toe details
block(-3, 1, 4, 10);
block(-2, 1, 4, 10);
block(-1, 1, 4, 10);
block(1, 1, 4, 10);
block(2, 1, 4, 10);
block(3, 1, 4, 10);

// Arm thickness variation
sphere(-6.5, 8, -1.5, 0.8, 7);
sphere(6.5, 8, -1.5, 0.8, 7);

// Neck/shoulder transition
sphere(-2, 11, 0, 1.3, 7);
sphere(2, 11, 0, 1.3, 7);

// Center mouth detail - tongue
block(0, 8, -6, 10);