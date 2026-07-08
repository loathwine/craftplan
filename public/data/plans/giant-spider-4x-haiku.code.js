// giant-spider-4x-haiku — prompt:
// a giant spider...

// Giant Spider - facing north, detailed voxel sculpture

// Cephalothorax (head + thorax) - front section
cube(-3, 5, -2, 3, 10, 4, 3);  // STONE body
cube(-2, 6, -1, 2, 9, 2, 8);   // COBBLE detail
cube(-1, 7, 0, 1, 8, 1, 10);   // BRICK center

// Eyes - main pair
sphere(-1.2, 8, -1, 1.2, 11);  // GLASS left
sphere(1.2, 8, -1, 1.2, 11);   // GLASS right
sphere(-1.2, 8, -1, 0.6, 10);  // BRICK pupil left
sphere(1.2, 8, -1, 0.6, 10);   // BRICK pupil right

// Pedipalps (front appendages)
line(-4.5, 7, 0, -6, 8.5, -0.5, 10);
line(4.5, 7, 0, 6, 8.5, -0.5, 10);

// Fangs
line(-2.2, 6, -0.5, -2.8, 4.5, -2, 3);
line(2.2, 6, -0.5, 2.8, 4.5, -2, 3);

// Main Abdomen - bulbous rear section
sphere(0, 3, 9, 5, 3);           // STONE core
sphere(0, 3, 9, 4.2, 8);         // COBBLE outer
cube(-4, 0, 5, 4, 8, 14, 3);     // STONE base
cube(-3, 1, 6, 3, 7, 13, 8);     // COBBLE inner

// Abdominal segments
cube(-3, 2, 8, 3, 4, 10, 10);    // BRICK segment
cube(-2, 3, 11, 2, 5, 12, 10);   // BRICK segment

// Spinnerets (rear tip)
cube(-1, 0, 12, 1, 2, 14, 10);
cylinder(-1.5, 0, 13, 0.5, 1.5, 8);
cylinder(1.5, 0, 13, 0.5, 1.5, 8);

// LEGS - 8 total, jointed

// Leg 1 - Front Left
cube(-4, 5, 0, -4, 5, 0, 10);
line(-4, 5, 0, -8, 4, -2, 4);
cube(-8, 4, -2, -8, 4, -2, 10);
line(-8, 4, -2, -11, 3, -4, 4);
cube(-11, 3, -4, -11, 3, -4, 10);
line(-11, 3, -4, -14, 3, -5, 4);

// Leg 2 - Front Right
cube(4, 5, 0, 4, 5, 0, 10);
line(4, 5, 0, 8, 4, -2, 4);
cube(8, 4, -2, 8, 4, -2, 10);
line(8, 4, -2, 11, 3, -4, 4);
cube(11, 3, -4, 11, 3, -4, 10);
line(11, 3, -4, 14, 3, -5, 4);

// Leg 3 - Middle Front Left
cube(-4, 4, 3, -4, 4, 3, 10);
line(-4, 4, 3, -9, 3, 5, 4);
cube(-9, 3, 5, -9, 3, 5, 10);
line(-9, 3, 5, -13, 2, 7, 4);
cube(-13, 2, 7, -13, 2, 7, 10);
line(-13, 2, 7, -16, 2, 9, 4);

// Leg 4 - Middle Front Right
cube(4, 4, 3, 4, 4, 3, 10);
line(4, 4, 3, 9, 3, 5, 4);
cube(9, 3, 5, 9, 3, 5, 10);
line(9, 3, 5, 13, 2, 7, 4);
cube(13, 2, 7, 13, 2, 7, 10);
line(13, 2, 7, 16, 2, 9, 4);

// Leg 5 - Middle Rear Left
cube(-4, 4, 10, -4, 4, 10, 10);
line(-4, 4, 10, -9, 3, 12, 4);
cube(-9, 3, 12, -9, 3, 12, 10);
line(-9, 3, 12, -13, 2, 14, 4);
cube(-13, 2, 14, -13, 2, 14, 10);
line(-13, 2, 14, -16, 2, 16, 4);

// Leg 6 - Middle Rear Right
cube(4, 4, 10, 4, 4, 10, 10);
line(4, 4, 10, 9, 3, 12, 4);
cube(9, 3, 12, 9, 3, 12, 10);
line(9, 3, 12, 13, 2, 14, 4);
cube(13, 2, 14, 13, 2, 14, 10);
line(13, 2, 14, 16, 2, 16, 4);

// Leg 7 - Rear Left
cube(-3, 4, 12, -3, 4, 12, 10);
line(-3, 4, 12, -8, 3, 15, 4);
cube(-8, 3, 15, -8, 3, 15, 10);
line(-8, 3, 15, -12, 2, 18, 4);
cube(-12, 2, 18, -12, 2, 18, 10);
line(-12, 2, 18, -15, 2, 20, 4);

// Leg 8 - Rear Right
cube(3, 4, 12, 3, 4, 12, 10);
line(3, 4, 12, 8, 3, 15, 4);
cube(8, 3, 15, 8, 3, 15, 10);
line(8, 3, 15, 12, 2, 18, 4);
cube(12, 2, 18, 12, 2, 18, 10);
line(12, 2, 18, 15, 2, 20, 4);

// Web silk strands - atmospheric detail
line(-7, 5, 4, -3, 6, 6, 11);
line(7, 5, 4, 3, 6, 6, 11);
line(-10, 4, 11, -5, 5, 8, 11);
line(10, 4, 11, 5, 5, 8, 11);
line(-6, 4, 2, -2, 5, 10, 11);
line(6, 4, 2, 2, 5, 10, 11);
line(-11, 2, 6, -5, 3, 12, 11);
line(11, 2, 6, 5, 3, 12, 11);