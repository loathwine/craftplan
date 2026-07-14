// monster-truck-4x-haiku — prompt:
// a monster truck...

const AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, OAK_LOG = 4, LEAVES = 5;
const SAND = 6, PLANKS = 7, COBBLE = 8, BRICK = 10, GLASS = 11, SNOW = 12;

// Main chassis frame
cube(-7, 0, -9, 7, 3, 8, COBBLE);

// Cabin structure
cube(-4, 3, -8, 4, 8, -2, COBBLE);

// Windshield
cube(-4, 4, -9, 4, 8, -8, GLASS);

// Side cabin windows
cube(-5, 4, -6, -4, 8, -2, GLASS);
cube(4, 4, -6, 5, 8, -2, GLASS);

// Cargo bed
cube(-6, 3, 2, 6, 5, 8, COBBLE);

// Cargo sides
cube(-7, 3, 2, -6, 7, 8, COBBLE);
cube(6, 3, 2, 7, 7, 8, COBBLE);

// Cargo partition
cube(-6, 3, 1, 6, 5, 1, COBBLE);

// Front grille
cube(-7, 0, -10, 7, 2, -10, BRICK);

// Lower front bumper
cube(-6, 0, -11, 6, 1, -11, STONE);

// Grille pattern
cube(-4, 1, -10, 4, 2, -10, BRICK);

// Hood
cube(-6, 3, -9, 6, 4, -7, COBBLE);

// Roof
cube(-5, 8, -8, 5, 9, -1, COBBLE);

// Headlights
block(-5, 2, -10, GLASS);
block(5, 2, -10, GLASS);
block(-5, 3, -10, BRICK);
block(5, 3, -10, BRICK);

// Side fenders
cube(-7, 1, -5, -6, 3, 4, COBBLE);
cube(6, 1, -5, 7, 3, 4, COBBLE);

// Large monster truck wheels
sphere(-7, 2, -6, 2, STONE);
sphere(7, 2, -6, 2, STONE);
sphere(-7, 2, 5, 2, STONE);
sphere(7, 2, 5, 2, STONE);

// Wheel hubs
sphere(-7, 2, -6, 1, BRICK);
sphere(7, 2, -6, 1, BRICK);
sphere(-7, 2, 5, 1, BRICK);
sphere(7, 2, 5, 1, BRICK);

// Axles
line(-7, 0, -6, 7, 0, -6, OAK_LOG);
line(-7, 0, 5, 7, 0, 5, OAK_LOG);

// Running boards
cube(-8, 1, -2, -7, 2, 6, STONE);
cube(7, 1, -2, 8, 2, 6, STONE);

// Door panels
cube(-4, 4, -8, -3, 7, -8, BRICK);
cube(3, 4, -8, 4, 7, -8, BRICK);

// Door handles
block(-3, 5, -8, OAK_LOG);
block(3, 5, -8, OAK_LOG);

// Roof spoiler
cube(-4, 9, -7, 4, 10, -5, STONE);

// Side mirrors
cube(-8, 5, -4, -7, 7, -3, STONE);
cube(7, 5, -4, 8, 7, -3, STONE);

// Tailgate
cube(-6, 3, 9, 6, 6, 9, COBBLE);
cube(-6, 4, 9, -5, 6, 9, BRICK);
cube(5, 4, 9, 6, 6, 9, BRICK);

// Suspension struts
line(-7, 1, -6, -7, 2, -6, STONE);
line(7, 1, -6, 7, 2, -6, STONE);
line(-7, 1, 5, -7, 2, 5, STONE);
line(7, 1, 5, 7, 2, 5, STONE);

// Frame rails
cube(-6, -1, -5, -5, 0, 4, OAK_LOG);
cube(5, -1, -5, 6, 0, 4, OAK_LOG);

// Front bumper reinforcement
cube(-5, 0, -12, 5, 1, -12, OAK_LOG);

// Engine blocks
cube(-5, 4, -9, -4, 5, -8, STONE);
cube(4, 4, -9, 5, 5, -8, STONE);

// Racing stripe
cube(-2, 6, -8, 2, 7, 1, BRICK);

// Cabin accents
cube(-4, 6, -7, -3, 8, -2, STONE);
cube(3, 6, -7, 4, 8, -2, STONE);

// Cargo crossbars
cube(-5, 5, 2, 5, 6, 2, STONE);
cube(-5, 5, 5, 5, 6, 5, STONE);

// Mudflaps
cube(-7, 0, -5, -7, 3, 5, BRICK);
cube(7, 0, -5, 7, 3, 5, BRICK);

// Cabin base
cube(-4, 3, -1, 4, 4, 0, STONE);

// Antenna
line(3, 8, -7, 3, 11, -7, OAK_LOG);

// Extra cargo details
cube(-5, 4, 3, 5, 5, 3, STONE);
cube(-5, 4, 6, 5, 5, 6, STONE);

// Grille vertical bars
block(-3, 1, -10, BRICK);
block(0, 1, -10, BRICK);
block(3, 1, -10, BRICK);

// Side skirt detailing
cube(-7, 1, -4, -6, 2, 3, STONE);
cube(6, 1, -4, 7, 2, 3, STONE);