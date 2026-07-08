// minion-4x-haiku — prompt:
// a Minion...

const YELLOW = 6;
const BLUE = 11;
const DARK = 3;
const BROWN = 4;
const WHITE = 12;
const BLACK = 8;

// Main body - tall yellow cylinder
cylinder(0, 2, 0, 4, 11, YELLOW);

// Head - rounded top
sphere(0, 13, 0, 3.5, YELLOW);

// Overalls - blue section 
cylinder(0, 5, 0, 4.1, 3, BLUE);

// Left shoulder strap
cube(-4.5, 5.5, -0.8, -3.7, 9.5, 0.8, BROWN);

// Right shoulder strap
cube(3.7, 5.5, -0.8, 4.5, 9.5, 0.8, BROWN);

// Overalls front panel detail
hollowCube(-2.2, 4.7, -1.8, 2.2, 7.2, -0.2, BLUE);

// Three overalls buttons
block(-1.4, 5.8, -1.8, DARK);
block(0, 5.8, -1.8, DARK);
block(1.4, 5.8, -1.8, DARK);

// Left eye - white
sphere(-2, 12.2, -2.3, 1.05, WHITE);

// Left pupil/iris
sphere(-2, 11.7, -1.4, 0.45, BLACK);

// Right eye - white
sphere(2, 12.2, -2.3, 1.05, WHITE);

// Right pupil/iris
sphere(2, 11.7, -1.4, 0.45, BLACK);

// Mouth - smile line
line(-1.4, 10.2, -2.3, 1.4, 10.2, -2.3, BLACK);

// Mouth details
block(-0.8, 9.9, -2.3, YELLOW);
block(-0.3, 9.8, -2.3, YELLOW);
block(0.3, 9.8, -2.3, YELLOW);
block(0.8, 9.9, -2.3, YELLOW);

// Body outline/definition
hollowCylinder(0, 2, 0, 4.05, 11, DARK);

// Shoes/feet
cube(-3, 0, -1.6, 3, 1.5, 2.2, BROWN);

// Sole details
block(-1.8, 1.5, 0.2, DARK);
block(0, 1.5, 0.2, DARK);
block(1.8, 1.5, 0.2, DARK);

// Neck/shoulder transition
cylinder(0, 10.8, 0, 3.6, 1.3, BLUE);

// Body side shading
line(-4.05, 4.5, -0.3, -4.05, 8.5, -0.3, DARK);
line(4.05, 4.5, -0.3, 4.05, 8.5, -0.3, DARK);

// Arm stumps (sides)
cube(-4.8, 6, -0.3, -4.1, 7.5, 1.2, YELLOW);
cube(4.1, 6, -0.3, 4.8, 7.5, 1.2, YELLOW);

// Hands/glove ends
sphere(-5.3, 6.5, 0.3, 0.5, WHITE);
sphere(5.3, 6.5, 0.3, 0.5, WHITE);

// Overalls waistband
disk(0, 7.8, 0, 4.1, BROWN);

// Overalls side pockets
cube(-2.8, 5.2, -1.8, -1.5, 6.8, -0.5, DARK);
cube(1.5, 5.2, -1.8, 2.8, 6.8, -0.5, DARK);

// Body texture - horizontal bands
line(-3.8, 3.5, -1, -3.8, 3.5, 1, YELLOW);
line(3.8, 3.5, -1, 3.8, 3.5, 1, YELLOW);

// Forehead highlight
sphere(0, 13.5, -2, 1.5, YELLOW);