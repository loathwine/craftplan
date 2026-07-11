// big-ben-4x-haiku — prompt:
// Big Ben...

// Big Ben / Elizabeth Tower

const STONE = 3;
const COBBLE = 8;
const GLASS = 11;
const BRICK = 10;

// Foundation and base platform
cube(-6, -8, -6, 6, -3, 6, STONE);
cube(-7, -3, -7, 7, 0, 7, COBBLE);

// Main tower walls - square, 13×13 outer, 25 blocks high
cube(-6, 0, -7, 6, 25, -6, STONE);   // North wall
cube(-6, 0, 6, 6, 25, 7, STONE);     // South wall
cube(7, 0, -6, 7, 25, 6, STONE);     // East wall
cube(-7, 0, -6, -6, 25, 6, STONE);   // West wall

// Interior floor levels - structural chambers
cube(-5, 2, -5, 5, 3, 5, STONE);
cube(-5, 8, -5, 5, 9, 5, STONE);
cube(-5, 14, -5, 5, 15, 5, STONE);
cube(-5, 20, -5, 5, 21, 5, STONE);

// Hollow out interior spaces
cube(-5, 3, -5, 5, 8, 5, AIR);
cube(-5, 9, -5, 5, 14, 5, AIR);
cube(-5, 15, -5, 5, 20, 5, AIR);

// Clock chamber - bulged stone section
cube(-6, 15, -7, 6, 23, 7, STONE);
cube(-5, 16, -6, 5, 22, 6, AIR);

// Large clock faces - GLASS on all four sides
cube(-3, 17, -7, 3, 21, -7, GLASS);  // North
cube(-3, 17, 7, 3, 21, 7, GLASS);    // South
cube(7, 17, -3, 7, 21, 3, GLASS);    // East
cube(-7, 17, -3, -7, 21, 3, GLASS);  // West

// Ornamental frames around clock faces
cube(-4, 16, -7, 4, 16, 7, BRICK);
cube(-4, 22, -7, 4, 22, 7, BRICK);
cube(-7, 16, -4, 7, 16, 4, BRICK);
cube(-7, 22, -4, 7, 22, 4, BRICK);

// Upper tower section narrowing
cube(-5, 23, -5, 5, 25, 5, STONE);

// Crenellated parapet
cube(-5, 25, -5, -4, 26, 5, COBBLE);
cube(4, 25, -5, 5, 26, 5, COBBLE);
cube(-5, 25, -5, 5, 26, -4, COBBLE);
cube(-5, 25, 4, 5, 26, 5, COBBLE);

// Spire - tapered point
cube(-3, 25, -3, 3, 26, 3, COBBLE);
cube(-2, 26, -2, 2, 27, 2, COBBLE);
cube(-1, 27, -1, 1, 28, 1, BRICK);
block(0, 28, 0, BRICK);
block(0, 29, 0, BRICK);

// Corner buttresses - Gothic architecture
cube(-7, 0, -7, -6, 23, -6, COBBLE);
cube(6, 0, -7, 7, 23, -6, COBBLE);
cube(-7, 0, 6, -6, 23, 7, COBBLE);
cube(6, 0, 6, 7, 23, 7, COBBLE);

// Window openings - regular pattern on main tower
for (let y = 4; y <= 12; y += 2) {
  block(-6, y, -7, AIR);
  block(0, y, -7, AIR);
  block(6, y, -7, AIR);
  block(-7, y, -6, AIR);
  block(-7, y, 0, AIR);
  block(-7, y, 6, AIR);
  block(7, y, -6, AIR);
  block(7, y, 0, AIR);
  block(7, y, 6, AIR);
  block(-6, y, 7, AIR);
  block(0, y, 7, AIR);
  block(6, y, 7, AIR);
}

// Great Bell chamber interior
cube(-2, 10, -2, 2, 13, 2, BRICK);

// Decorative corbels below clock chamber
for (let x = -6; x <= 6; x += 3) {
  cube(x, 15, -7, x, 16, -7, BRICK);
  cube(x, 15, 7, x, 16, 7, BRICK);
}
for (let z = -6; z <= 6; z += 3) {
  cube(-7, 15, z, -7, 16, z, BRICK);
  cube(7, 15, z, 7, 16, z, BRICK);
}