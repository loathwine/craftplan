// kraken-4x-haiku — prompt:
// a kraken...

// KRAKEN - Giant menacing squid

// Core body - central mass
sphere(0, 13, 0, 9, COBBLE);
sphere(0, 18, 0, 5, STONE);
cube(-7, 8, -5, 7, 12, 5, COBBLE);

// Eyes - threatening and clear
sphere(-5, 16, -11, 2, GLASS);
sphere(5, 16, -11, 2, GLASS);
block(-5, 16, -9, BRICK);
block(5, 16, -9, BRICK);

// Beak - menacing center mouth
cube(-1, 9, -9, 1, 11, -5, BRICK);
line(-2, 10, -7, 2, 10, -7, STONE);

// Tentacle 1 - front left, curves down-left
line(-3, 8, -2, -10, 2, -5, COBBLE);
line(-10, 2, -5, -14, -3, -8, COBBLE);
line(-14, -3, -8, -16, -6, -10, COBBLE);
disk(-6, 6, -3, 1, BRICK);
disk(-12, 0, -6, 1, BRICK);
disk(-15, -4, -9, 1, BRICK);

// Tentacle 2 - front right (mirror)
line(3, 8, -2, 10, 2, -5, COBBLE);
line(10, 2, -5, 14, -3, -8, COBBLE);
line(14, -3, -8, 16, -6, -10, COBBLE);
disk(6, 6, -3, 1, BRICK);
disk(12, 0, -6, 1, BRICK);
disk(15, -4, -9, 1, BRICK);

// Tentacle 3 - back-left, curves outward
line(-2, 9, 3, -7, 4, 11, COBBLE);
line(-7, 4, 11, -11, 0, 16, COBBLE);
line(-11, 0, 16, -14, -4, 20, COBBLE);
disk(-4, 8, 6, 1, BRICK);
disk(-9, 2, 13, 1, BRICK);
disk(-13, -2, 18, 1, BRICK);

// Tentacle 4 - back-right (mirror)
line(2, 9, 3, 7, 4, 11, COBBLE);
line(7, 4, 11, 11, 0, 16, COBBLE);
line(11, 0, 16, 14, -4, 20, COBBLE);
disk(4, 8, 6, 1, BRICK);
disk(9, 2, 13, 1, BRICK);
disk(13, -2, 18, 1, BRICK);

// Tentacle 5 - left side, horizontal sweep
line(-7, 11, 0, -14, 8, -1, COBBLE);
line(-14, 8, -1, -18, 4, -2, COBBLE);
line(-18, 4, -2, -21, 1, -3, COBBLE);
disk(-10, 10, 0, 1, BRICK);
disk(-16, 6, -1, 1, BRICK);
disk(-20, 2, -2, 1, BRICK);

// Tentacle 6 - right side (mirror)
line(7, 11, 0, 14, 8, -1, COBBLE);
line(14, 8, -1, 18, 4, -2, COBBLE);
line(18, 4, -2, 21, 1, -3, COBBLE);
disk(10, 10, 0, 1, BRICK);
disk(16, 6, -1, 1, BRICK);
disk(20, 2, -2, 1, BRICK);

// Tentacle 7 - lower-left, curves down
line(-4, 5, 0, -9, -1, 1, STONE);
line(-9, -1, 1, -13, -5, 2, COBBLE);
line(-13, -5, 2, -16, -7, 3, COBBLE);
disk(-6, 3, 0, 1, BRICK);
disk(-11, -3, 1, 1, BRICK);
disk(-15, -6, 2, 1, BRICK);

// Tentacle 8 - lower-right (mirror)
line(4, 5, 0, 9, -1, 1, STONE);
line(9, -1, 1, 13, -5, 2, COBBLE);
line(13, -5, 2, 16, -7, 3, COBBLE);
disk(6, 3, 0, 1, BRICK);
disk(11, -3, 1, 1, BRICK);
disk(15, -6, 2, 1, BRICK);

// Body ridges and texture detail
line(-6, 16, -2, -6, 11, -2, STONE);
line(6, 16, -2, 6, 11, -2, STONE);
line(-4, 18, 2, 4, 18, 2, STONE);
line(-3, 17, 4, 3, 17, 4, STONE);

// Top crown detail
sphere(0, 21, 0, 2, BRICK);
cube(-2, 20, -1, 2, 22, 1, STONE);

// Lower jaw texture
cube(-4, 6, -6, 4, 8, -4, STONE);