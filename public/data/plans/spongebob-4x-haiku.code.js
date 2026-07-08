// spongebob-4x-haiku — prompt:
// SpongeBob SquarePants...

const SAND = 6;
const BRICK = 10;
const GLASS = 11;
const SNOW = 12;
const STONE = 3;
const OAK_LOG = 4;
const AIR = 0;

// Main body - iconic square sponge
cube(-7, 1, -8, 7, 15, 0, SAND);

// Mouth opening - big friendly smile
cube(-3, 6, -9, 3, 9, -8, AIR);

// Teeth
cube(-2.5, 6.2, -8.5, 2.5, 6.7, -8, SNOW);
line(-2, 6.7, -8.5, -2, 6.7, -8, STONE);
line(-1, 6.7, -8.5, -1, 6.7, -8, STONE);
line(0, 6.7, -8.5, 0, 6.7, -8, STONE);
line(1, 6.7, -8.5, 1, 6.7, -8, STONE);
line(2, 6.7, -8.5, 2, 6.7, -8, STONE);

// Tongue - pink
cube(-1.5, 5.5, -9, 1.5, 6.2, -8.5, BRICK);

// Large expressive eyes - white
sphere(-3.5, 12, -9, 2, SNOW);
sphere(3.5, 12, -9, 2, SNOW);

// Pupils - black
sphere(-3.5, 12, -10, 1.1, STONE);
sphere(3.5, 12, -10, 1.1, STONE);

// Eye shine highlights
sphere(-2.3, 13, -10.5, 0.5, SNOW);
sphere(4.3, 13, -10.5, 0.5, SNOW);

// Eyebrows
line(-5, 14.5, -9, -1.5, 14.5, -9, STONE);
line(1.5, 14.5, -9, 5, 14.5, -9, STONE);

// Smile curves
line(-3, 6, -8.2, -0.5, 4, -8.2, STONE);
line(3, 6, -8.2, 0.5, 4, -8.2, STONE);

// Mouth corners
line(-3, 6, -8.5, -3, 8.5, -8.5, STONE);
line(3, 6, -8.5, 3, 8.5, -8.5, STONE);

// Red tie - very iconic
cube(-1, 10, -9, 1, 6, -8, BRICK);
cube(-1.2, 9.5, -8.5, 1.2, 10.5, -8, STONE);

// Blue shirt
cube(-6, 5, -9, 6, 11, 1, GLASS);

// White belly/chest
cube(-5, 2, -8, 5, 6, -0.5, SNOW);

// Brown pants
cube(-6, 1, -9, 6, 5, 1, OAK_LOG);

// Pants pockets
cube(-4, 2, -8.5, -2, 4, -8, AIR);
cube(2, 2, -8.5, 4, 4, -8, AIR);

line(-4, 2, -8.3, -2, 2, -8.3, STONE);
line(-4, 4, -8.3, -2, 4, -8.3, STONE);
line(-4, 2, -8.3, -4, 4, -8.3, STONE);
line(-2, 2, -8.3, -2, 4, -8.3, STONE);

line(2, 2, -8.3, 4, 2, -8.3, STONE);
line(2, 4, -8.3, 4, 4, -8.3, STONE);
line(2, 2, -8.3, 2, 4, -8.3, STONE);
line(4, 2, -8.3, 4, 4, -8.3, STONE);

// Rosy cheeks
sphere(-8.5, 10, -4, 1.2, BRICK);
sphere(8.5, 10, -4, 1.2, BRICK);

// Shoes
cube(-6.5, -0.5, -8, -3.5, 0.5, -0.5, OAK_LOG);
cube(3.5, -0.5, -8, 6.5, 0.5, -0.5, OAK_LOG);

// Shoe soles
cube(-6.5, -1, -8, -3.5, -0.5, -0.5, STONE);
cube(3.5, -1, -8, 6.5, -0.5, -0.5, STONE);

// White socks
cube(-6, 0, -8, -3.5, 0.5, -0.5, SNOW);
cube(3.5, 0, -8, 6, 0.5, -0.5, SNOW);

// Nose
block(0, 11, -9, BRICK);
block(0, 10.5, -9, BRICK);