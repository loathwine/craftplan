// gingerbread-4x-haiku — prompt:
// a gingerbread house...

const GINGERBREAD = 7;   // PLANKS - tan/brown
const ICING = 12;        // SNOW - white frosting
const TRIM = 10;         // BRICK - red/dark candy
const GLASS = 11;

// Foundation platform
cube(-11, -2, -9, 11, -1, 11, 2); // DIRT

// Icing foundation trim
cube(-12, -1, -10, 12, -1, 12, ICING);

// Main house body
cube(-9, 0, -7, 9, 10, 9, GINGERBREAD);

// Peaked roof - stepped pyramid
for (let y = 10; y <= 15; y++) {
  const margin = 15 - y;
  if (margin >= 0) {
    cube(-9 + margin, y, -7, 9 - margin, y, 9, GINGERBREAD);
  }
}

// Roof peak cap
cube(-1, 15, -1, 1, 16, 1, GINGERBREAD);

// ICING DETAILS - white frosting
// Base icing line all around
cube(-10, 0, -8, 10, 0, 10, ICING);
cube(-10, 10, -8, 10, 10, 10, ICING);

// Icing swags below eaves
for (let x = -8; x <= 8; x += 2) {
  block(x, 0, -8, ICING);
  block(x, 0, 10, ICING);
  block(-9, 0, x + 1, ICING);
  block(9, 0, x + 1, ICING);
}

// Vertical icing piping on walls
for (let x = -8; x <= 8; x += 3) {
  line(x, 0, -8, x, 9, -8, ICING);
  line(x, 0, 10, x, 9, 10, ICING);
}
for (let z = -6; z <= 8; z += 3) {
  line(-9, 2, z, -9, 8, z, ICING);
  line(9, 2, z, 9, 8, z, ICING);
}

// DOOR - front center
hollowCube(-2, 0, -7, 1, 7, -7, 0); // Carve door
cube(-2, 0, -6, 1, 7, -6, GLASS);  // Door window
cube(-2, 7, -7, 1, 7, -6, ICING);  // Door top icing

// WINDOWS - 4 total
cube(-7, 3, -7, -4, 7, -7, GLASS); // Left front
cube(4, 3, -7, 7, 7, -7, GLASS);   // Right front
cube(-7, 3, 9, -4, 7, 9, GLASS);   // Left back
cube(4, 3, 9, 7, 7, 9, GLASS);     // Right back

// Window icing trim
cube(-8, 2, -7, 8, 2, -6, ICING);
cube(-8, 8, -7, 8, 8, -6, ICING);
cube(-8, 2, 9, 8, 2, 10, ICING);
cube(-8, 8, 9, 8, 8, 10, ICING);

// CANDY CANE DECORATIONS - corners
for (let y = 0; y < 10; y++) {
  block(-10, y, -8, TRIM);  // Front left
  block(10, y, -8, TRIM);   // Front right
  block(-10, y, 10, TRIM);  // Back left
  block(10, y, 10, TRIM);   // Back right
}

// CHIMNEY - center back
cube(-2, 10, 7, 2, 15, 9, TRIM);
cube(-2, 15, 7, 2, 16, 9, ICING); // Chimney cap icing

// GUMDROPS on roof
sphere(-7, 11, -4, 0.9, TRIM);
sphere(0, 12, 0, 1.1, TRIM);
sphere(7, 11, 4, 0.9, TRIM);
sphere(-5, 10, 3, 0.8, TRIM);
sphere(5, 10, 3, 0.8, TRIM);

// Decorative icing drips below gumdrops
block(0, 11, 0, ICING);
block(0, 10, 0, ICING);
block(-7, 10, -4, ICING);
block(7, 10, 4, ICING);

// Side porch/platform detail - left
cube(-11, -1, 0, -10, 1, 4, GINGERBREAD);
cube(-11, 1, 0, -10, 1, 4, ICING);

// Side porch - right
cube(10, -1, 0, 11, 1, 4, GINGERBREAD);
cube(10, 1, 0, 11, 1, 4, ICING);

// Candy striping on front walls (vertical segments)
for (let x = -7; x <= 7; x += 4) {
  for (let y = 2; y < 9; y += 2) {
    block(x, y, -8, TRIM);
  }
}

// Icing zig-zag pattern on sides
for (let z = -5; z < 8; z += 3) {
  block(-10, 5, z, ICING);
  block(10, 5, z, ICING);
}

// Decorative candy balls around base
sphere(-11, 1, -9, 0.7, TRIM);
sphere(11, 1, -9, 0.7, TRIM);
sphere(-11, 1, 11, 0.7, TRIM);
sphere(11, 1, 11, 0.7, TRIM);

// Path/foundation detail
cube(-2, -2, 10, 2, -1, 13, 2); // DIRT path
cube(-2, -1, 10, 2, -1, 13, ICING); // Icing on path