// pikachu-4x-haiku — prompt:
// Pikachu...

// Pikachu - Detailed Voxel Sculpture

// Body - main rounded torso
sphere(0, 7, 0, 9, SAND);

// Head - round and cheerful
sphere(0, 18, 0, 7, SAND);

// Left ear - tall and pointed
cylinder(-5, 23, -1, 2.5, 10, SAND);

// Right ear - tall and pointed
cylinder(5, 23, -1, 2.5, 10, SAND);

// Ear black inner detail
cylinder(-5, 23, -1, 1.5, 10, COBBLE);
cylinder(5, 23, -1, 1.5, 10, COBBLE);

// Left cheek - large red
sphere(-11, 15, -1, 3.5, BRICK);

// Right cheek - large red
sphere(11, 15, -1, 3.5, BRICK);

// Cheek shading for dimension
sphere(-11, 15, 1, 3, BRICK);
sphere(11, 15, 1, 3, BRICK);

// Left eye - black pupil
sphere(-3, 20, -7, 1.5, STONE);

// Right eye - black pupil
sphere(3, 20, -7, 1.5, STONE);

// Left eye highlight - white shine
sphere(-2, 20, -8, 0.7, SNOW);

// Right eye highlight - white shine
sphere(2, 20, -8, 0.7, SNOW);

// Nose - red accent
sphere(0, 17, -8, 0.9, BRICK);

// Mouth - happy smile
block(-1, 14, -8, COBBLE);
block(0, 14, -8, COBBLE);
block(1, 14, -8, COBBLE);

// Front left paw
cylinder(-7, 6, 0, 1.7, 5, SAND);

// Front right paw
cylinder(7, 6, 0, 1.7, 5, SAND);

// Paw pads - dark toe beans
sphere(-7, 5, 0, 0.9, COBBLE);
sphere(7, 5, 0, 0.9, COBBLE);

// Back left leg
cylinder(-7, 2, 8, 1.7, 4, SAND);

// Back right leg
cylinder(7, 2, 8, 1.7, 4, SAND);

// Back leg pads
sphere(-7, 1, 8, 1, COBBLE);
sphere(7, 1, 8, 1, COBBLE);

// Tail base - zigzag lightning bolt
cylinder(5, 9, 9, 2.2, 3, SAND);

// Tail middle section
cylinder(8, 13, 13, 2, 4, SAND);

// Tail upper endpoint
sphere(9, 18, 16, 1.8, SAND);

// Tail black stripe
line(5, 9, 9, 8, 13, 13, COBBLE);
line(8, 13, 13, 9, 18, 16, COBBLE);

// Belly patch - cream/tan underside
sphere(0, 6, -1, 6, PLANKS);

// Back body contour
sphere(0, 10, 8, 4, SAND);

// Ear tips - pointed ends
block(-5, 33, -1, BRICK);
block(5, 33, -1, BRICK);

// Whisker details left
line(-11, 16, -2, -15, 16, -2, COBBLE);

// Whisker details right
line(11, 16, -2, 15, 16, -2, COBBLE);

// Cheek contour detail
sphere(-11, 14, -2, 2.8, BRICK);
sphere(11, 14, -2, 2.8, BRICK);

// Tail joint connection
sphere(8, 13, 13, 2.3, SAND);

// Brow ridge
cube(-2, 21, -6, 2, 21, -5, SAND);