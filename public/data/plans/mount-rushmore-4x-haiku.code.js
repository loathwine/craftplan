// mount-rushmore-4x-haiku — prompt:
// Mount Rushmore...

// Mount Rushmore - Four presidential heads carved into a mountain
// Camera views from north (-Z), faces point toward viewer

// Create massive stone cliff face foundation
cube(-22, -2, -22, 22, 12, 15, STONE);
cube(-22, 11, -22, 22, 26, -3, STONE);

// Build 4 large spherical head volumes, evenly spaced
// Head 1 - Washington (leftmost)
sphere(-16, 20, -8, 6.5, STONE);
// Head 2 - Jefferson
sphere(-4, 19, -8, 6.5, STONE);
// Head 3 - Theodore Roosevelt
sphere(8, 19, -8, 6.5, STONE);
// Head 4 - Lincoln (rightmost)
sphere(20, 20, -8, 6.5, STONE);

// Create prominent hair/crown masses
cube(-20, 25, -15, -12, 31, -1, STONE);
cube(-8, 24, -15, 0, 30, -1, STONE);
cube(4, 24, -15, 12, 30, -1, STONE);
cube(16, 25, -15, 24, 31, -1, STONE);

// Carve eye sockets - two per face
sphere(-18, 21, -14, 1.3, AIR);
sphere(-14, 21, -14, 1.3, AIR);
sphere(-6, 20, -14, 1.3, AIR);
sphere(-2, 20, -14, 1.3, AIR);
sphere(6, 20, -14, 1.3, AIR);
sphere(10, 20, -14, 1.3, AIR);
sphere(18, 21, -14, 1.3, AIR);
sphere(22, 21, -14, 1.3, AIR);

// Deepen eye sockets for shadow detail
sphere(-18, 21, -16, 0.9, AIR);
sphere(-14, 21, -16, 0.9, AIR);
sphere(-6, 20, -16, 0.9, AIR);
sphere(-2, 20, -16, 0.9, AIR);
sphere(6, 20, -16, 0.9, AIR);
sphere(10, 20, -16, 0.9, AIR);
sphere(18, 21, -16, 0.9, AIR);
sphere(22, 21, -16, 0.9, AIR);

// Carve prominent noses
sphere(-16, 18, -15, 0.8, AIR);
sphere(-4, 17, -15, 0.8, AIR);
sphere(8, 17, -15, 0.8, AIR);
sphere(20, 18, -15, 0.8, AIR);

// Add nostril details
sphere(-17, 17, -16, 0.4, AIR);
sphere(-15, 17, -16, 0.4, AIR);
sphere(-5, 16, -16, 0.4, AIR);
sphere(-3, 16, -16, 0.4, AIR);
sphere(7, 16, -16, 0.4, AIR);
sphere(9, 16, -16, 0.4, AIR);
sphere(19, 17, -16, 0.4, AIR);
sphere(21, 17, -16, 0.4, AIR);

// Carve mouths
line(-18, 14, -14, -14, 14, -14, AIR);
line(-6, 13, -14, -2, 13, -14, AIR);
line(6, 13, -14, 10, 13, -14, AIR);
line(18, 14, -14, 22, 14, -14, AIR);

// Deepen mouth carvings
cube(-18, 13, -16, -14, 13, -16, AIR);
cube(-6, 12, -16, -2, 12, -16, AIR);
cube(6, 12, -16, 10, 12, -16, AIR);
cube(18, 13, -16, 22, 13, -16, AIR);

// Add cheek contours with stone
cube(-20, 16, -12, -18, 18, -5, STONE);
cube(-8, 15, -12, -6, 17, -5, STONE);
cube(6, 15, -12, 8, 17, -5, STONE);
cube(18, 16, -12, 20, 18, -5, STONE);

// Rock texture with cobblestone striations
cube(-22, 23, -20, 22, 24, -10, COBBLE);
cube(-22, 15, -20, 22, 16, -10, COBBLE);
cube(-22, 7, -20, 22, 8, 12, COBBLE);

// Build neck/shoulder structures
cube(-19, 10, -12, -13, 14, -2, STONE);
cube(-7, 9, -12, -1, 13, -2, STONE);
cube(5, 9, -12, 11, 13, -2, STONE);
cube(17, 10, -12, 23, 14, -2, STONE);

// Lincoln's distinctive beard
cube(17, 12, -10, 23, 15, -4, COBBLE);
cube(18, 13, -11, 22, 14, -11, AIR);

// Connecting cliff bridges between heads
cube(-13, 22, -13, -7, 24, -10, STONE);
cube(1, 22, -13, 7, 24, -10, STONE);
cube(13, 22, -13, 19, 24, -10, STONE);

// Foreground boulders for depth and context
cube(-20, 2, 10, -16, 5, 14, STONE);
cube(16, 2, 10, 20, 5, 14, STONE);
cube(-18, 1, -22, -14, 4, -19, STONE);
cube(14, 1, -22, 18, 4, -19, STONE);

// Brick accent bands for color and visual interest
cube(-22, 20, -19, 22, 21, -16, BRICK);
cube(-22, 10, -20, -18, 11, 10, BRICK);
cube(18, 10, -20, 22, 11, 10, BRICK);

// Additional facial contour shadows
cube(-19, 17, -12, -17, 18, -10, AIR);
cube(-7, 16, -12, -5, 17, -10, AIR);
cube(7, 16, -12, 9, 17, -10, AIR);
cube(19, 17, -12, 21, 18, -10, AIR);

// Side mountain slopes
cube(-22, 6, 12, -18, 10, 22, STONE);
cube(18, 6, 12, 22, 10, 22, STONE);

// Ground foundation terrace
cube(-22, 2, -22, 22, 5, -18, COBBLE);

// Beard/facial hair details
cube(-19, 12, -10, -17, 13, -7, COBBLE);
cube(-7, 12, -10, -5, 13, -8, COBBLE);
cube(7, 12, -10, 9, 13, -8, COBBLE);

// Texture variation on cliff face
cube(-22, 18, -20, -15, 19, -14, COBBLE);
cube(15, 18, -20, 22, 19, -14, COBBLE);

// Additional eye depth layers
sphere(-18, 21, -17, 0.6, AIR);
sphere(-14, 21, -17, 0.6, AIR);
sphere(-6, 20, -17, 0.6, AIR);
sphere(-2, 20, -17, 0.6, AIR);
sphere(6, 20, -17, 0.6, AIR);
sphere(10, 20, -17, 0.6, AIR);
sphere(18, 21, -17, 0.6, AIR);
sphere(22, 21, -17, 0.6, AIR);