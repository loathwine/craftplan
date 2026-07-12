// mammoth-4x-haiku — prompt:
// a woolly mammoth...

// Woolly Mammoth - Ice Age Giant
// Faces north (-Z), body mass extends south (+Z)

// Main body - large rounded torso
sphere(0, 2, 1, 11, SNOW);
sphere(0, 4, 5, 8, SNOW);

// Pronounced back hump - key mammoth trait
sphere(0, 8, 3, 6, SNOW);
cube(-4, 7, 0, 4, 11, 7, SNOW);

// Neck and shoulder
sphere(0, 5, -2, 5, SNOW);

// Large head with domed forehead facing viewer
sphere(0, 9, -7, 5, SNOW);
cube(-3, 8, -10, 3, 13, -5, SNOW);

// Face contours
cube(-2, 7, -8, 2, 11, -6, STONE);

// Four sturdy support legs
cylinder(-7, -1, 0, 3, 9, STONE);
cylinder(7, -1, 0, 3, 9, STONE);
cylinder(-7, -1, 8, 3, 9, STONE);
cylinder(7, -1, 8, 3, 9, STONE);

// Woolly leg coverings
cylinder(-7, -1, 0, 3.5, 9, SNOW);
cylinder(7, -1, 0, 3.5, 9, SNOW);
cylinder(-7, -1, 8, 3.5, 9, SNOW);
cylinder(7, -1, 8, 3.5, 9, SNOW);

// Long curved ivory tusks pointing forward-down
// Left tusk
cube(-9, 5, -1, -6, 7, 0, OAK_LOG);
cube(-11, 4, -4, -9, 6, -1, OAK_LOG);
cube(-13, 2, -7, -11, 5, -4, OAK_LOG);
cube(-14, 1, -9, -12, 3, -6, OAK_LOG);

// Right tusk
cube(6, 5, -1, 9, 7, 0, OAK_LOG);
cube(9, 4, -4, 11, 6, -1, OAK_LOG);
cube(11, 2, -7, 13, 5, -4, OAK_LOG);
cube(12, 1, -9, 14, 3, -6, OAK_LOG);

// Ears - large side flaps
cube(-5, 9, -7, -2, 13, -4, LEAVES);
cube(2, 9, -7, 5, 13, -4, LEAVES);

// Fur texture layers for woolly appearance
sphere(0, 1, 2, 10, LEAVES);
sphere(-4, 3, -1, 4, LEAVES);
sphere(4, 3, -1, 4, LEAVES);
sphere(-4, 5, 4, 4, LEAVES);
sphere(4, 5, 4, 4, LEAVES);

// Chest and neck fur detail
cube(-3, 0, -4, 3, 6, 1, LEAVES);
cube(-2, 2, -6, 2, 8, -2, LEAVES);

// Shaggy back detail
cube(-3, 7, 1, 3, 12, 6, LEAVES);

// Underbelly texture
cube(-6, 0, 2, 6, 2, 7, LEAVES);

// Hump ridge detail
cube(-1, 9, 2, 1, 12, 5, LEAVES);

// Tail stub
cube(-1, 0, 11, 1, 3, 13, STONE);
cube(-2, 1, 13, 2, 4, 15, OAK_LOG);