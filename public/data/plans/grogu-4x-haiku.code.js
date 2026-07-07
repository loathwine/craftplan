// grogu-4x-haiku — prompt:
// Grogu (Baby Yoda)...

// Grogu (Baby Yoda) - voxel build

// Head and face (primary feature)
sphere(0, 14, 0, 6, 5);
sphere(-2, 13, 1, 2, 5);
sphere(2, 13, 1, 2, 5);
sphere(0, 10, 0, 3, 5);
sphere(0, 16, 0, 2, 5);

// Large droopy ears (character signature)
sphere(-8, 17, -1, 4, 5);
sphere(-9, 13, 0, 2, 5);
sphere(-8, 10, 1, 1, 5);

sphere(8, 17, -1, 4, 5);
sphere(9, 13, 0, 2, 5);
sphere(8, 10, 1, 1, 5);

// Very large eyes (main expressive feature)
sphere(-3, 14, -6, 2, 11);
sphere(-3, 14, -7, 1, 3);
block(-2, 15, -7, 11);

sphere(3, 14, -6, 2, 11);
sphere(3, 14, -7, 1, 3);
block(4, 15, -7, 11);

// Facial features
cube(-1, 12, -6, 1, 13, -5, 10);
line(-1, 11, -6, 1, 11, -6, 10);

// Wrinkles for character detail
line(-5, 13, -1, -5, 11, -1, 5);
line(5, 13, -1, 5, 11, -1, 5);
line(-2, 15, -1, -2, 13, -1, 5);
line(2, 15, -1, 2, 13, -1, 5);

// Neck
cylinder(0, 10, 0, 2, 2, 5);

// Body in robes
cube(-3, 3, -2, 3, 9, 2, 8);
cube(-4, 6, -3, 4, 9, 3, 7);
cube(-4, 1, -3, 4, 5, 3, 8);

// Robe folds
cylinder(-3, 2, -3, 1, 3, 10);
cylinder(3, 2, -3, 1, 3, 10);

// Arms
cube(-5, 5, -1, -3, 8, 1, 7);
cube(3, 5, -1, 5, 8, 1, 7);

// Sleeves
cube(-6, 6, -2, -4, 8, 2, 8);
cube(4, 6, -2, 6, 8, 2, 8);

// Hands
sphere(-6, 6, 0, 1, 5);
sphere(6, 6, 0, 1, 5);

// Base
cube(-1, -2, -1, 1, 0, 1, 2);
cube(-3, -3, -2, 3, -2, 2, 2);