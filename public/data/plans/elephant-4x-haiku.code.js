// elephant-4x-haiku — prompt:
// an African elephant...

// African Elephant

// BODY - large barrel shape
cube(-7, 2, 4, 7, 9, 14, STONE);
cube(-8, 3, 5, 8, 8, 13, STONE);
cube(-8, 4, 6, 8, 7, 12, STONE);
cube(-7, 5, 5, 7, 6, 13, STONE);

// HEAD - prominent, facing north (-Z)
cube(-4, 8, -1, 4, 13, 3, STONE);
cube(-5, 9, 0, 5, 12, 2, STONE);
cube(-5, 10, 1, 5, 11, 1, STONE);

// EARS - massive fan-like structures on sides
cube(-11, 5, 1, -7, 14, 9, STONE);
cube(7, 5, 1, 11, 14, 9, STONE);
cube(-12, 6, 3, -10, 13, 7, STONE);
cube(10, 6, 3, 12, 13, 7, STONE);

// TRUNK - extends downward and forward
cube(-3, 6, 0, 3, 8, 1, STONE);
cube(-2, 4, -1, 2, 7, 1, STONE);
cube(-2, 2, -2, 2, 5, 0, STONE);
cube(-1, 0, -3, 1, 3, -1, STONE);

// TUSKS - curved ivory tusks
line(-3, 6, 0, -5, 4, -2, SNOW);
line(-3, 6, 0, -6, 3, -3, SNOW);
line(-2, 5, 0, -4, 3, -2, SNOW);
line(3, 6, 0, 5, 4, -2, SNOW);
line(3, 6, 0, 6, 3, -3, SNOW);
line(2, 5, 0, 4, 3, -2, SNOW);

// LEGS - sturdy support columns
cube(-7, 0, 5, -5, 4, 7, STONE);
cube(-8, 1, 4, -9, 3, 8, STONE);
cube(5, 0, 5, 7, 4, 7, STONE);
cube(8, 1, 4, 9, 3, 8, STONE);
cube(-7, 0, 11, -5, 4, 13, STONE);
cube(-8, 1, 10, -9, 3, 14, STONE);
cube(5, 0, 11, 7, 4, 13, STONE);
cube(8, 1, 10, 9, 3, 14, STONE);

// TAIL - thin tapered tail at rear
line(0, 6, 14, 0, 5, 18, STONE);
line(1, 6, 14, 1, 5, 18, STONE);
line(-1, 6, 14, -1, 5, 18, STONE);
line(0, 7, 14, 0, 6, 17, STONE);
line(1, 7, 14, 1, 6, 17, STONE);
line(-1, 7, 14, -1, 6, 17, STONE);

// FACE DETAILS - eyes
block(-3, 10, 1, BRICK);
block(3, 10, 1, BRICK);
block(-3, 9, 1, BRICK);
block(3, 9, 1, BRICK);
block(-2, 10, 1, STONE);
block(2, 10, 1, STONE);

// Forehead wrinkles and texture
block(0, 11, 1, COBBLE);
block(-1, 11, 2, COBBLE);
block(1, 11, 2, COBBLE);
block(0, 12, 2, COBBLE);
block(-1, 12, 1, COBBLE);
block(1, 12, 1, COBBLE);

// Nostril details on trunk
block(-1, 5, 0, AIR);
block(1, 5, 0, AIR);

// Body texture variation
cube(-6, 6, 7, -5, 7, 11, COBBLE);
cube(5, 6, 7, 6, 7, 11, COBBLE);
cube(-5, 7, 8, -4, 8, 10, COBBLE);
cube(4, 7, 8, 5, 8, 10, COBBLE);