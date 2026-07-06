// shrek-4x-haiku — prompt:
// Shrek...

// Shrek the Ogre

// Body - main torso
cube(-3, 0, -2, 3, 6, 2, GRASS);
cube(-4, 1, -2, 4, 5, 2, GRASS);
cube(-4, 2, -3, 4, 4, 3, GRASS);

// Head - round ogre head
sphere(0, 8, 0, 3.5, GRASS);
sphere(-3, 7.5, 0, 1.8, GRASS);
sphere(3, 7.5, 0, 1.8, GRASS);

// Ears
sphere(-5, 8.5, 0, 1.3, DIRT);
sphere(5, 8.5, 0, 1.3, DIRT);

// Eyes
sphere(-1.2, 8.5, -4.5, 1, GLASS);
sphere(1.2, 8.5, -4.5, 1, GLASS);
sphere(-1.2, 8.5, -5.2, 0.6, STONE);
sphere(1.2, 8.5, -5.2, 0.6, STONE);

// Eyebrows
line(-2.2, 9.5, -4, -0.2, 9.5, -4, DIRT);
line(0.2, 9.5, -4, 2.2, 9.5, -4, DIRT);

// Nose
cube(-0.8, 7, -4.5, 0.8, 8, -3.5, DIRT);
block(-0.3, 7.4, -4.7, STONE);
block(0.3, 7.4, -4.7, STONE);

// Mouth - wide grin
cube(-2, 6, -4, 2, 6.8, -3.2, DIRT);
cube(-1.8, 5.4, -3.8, 1.8, 6, -3.2, GRASS);

// Hair - messy topknot
sphere(-2, 11.5, 1, 1.8, LEAVES);
sphere(0, 12.2, 0, 1.8, LEAVES);
sphere(2, 11.5, 1, 1.8, LEAVES);
sphere(-0.5, 11, -1, 1.2, LEAVES);
sphere(0.5, 11, -1, 1.2, LEAVES);

// Left arm
cube(-5.5, 2.5, -1, -3.5, 4.5, 1, GRASS);
cube(-7.5, 2.5, -1, -5.5, 4.5, 1, GRASS);
sphere(-8.5, 3, 0, 1.2, GRASS);

// Right arm
cube(3.5, 2.5, -1, 5.5, 4.5, 1, GRASS);
cube(5.5, 2.5, -1, 7.5, 4.5, 1, GRASS);
sphere(8.5, 3, 0, 1.2, GRASS);

// Left leg
cube(-2.5, -2, -0.5, -0.5, 1, 0.5, GRASS);
cube(-2.5, -4, -0.5, -0.5, -2, 0.5, GRASS);
sphere(-1.5, -4.5, 0, 1, PLANKS);

// Right leg
cube(0.5, -2, -0.5, 2.5, 1, 0.5, GRASS);
cube(0.5, -4, -0.5, 2.5, -2, 0.5, GRASS);
sphere(1.5, -4.5, 0, 1, PLANKS);

// Waist belt
cube(-4.5, 0.5, -2.5, 4.5, 1.5, 2.5, COBBLE);
block(-1, 1, -2.5, BRICK);
block(0, 1, -2.5, BRICK);
block(1, 1, -2.5, BRICK);

// Tunic/shirt
cube(-3.5, 1.5, -3, 3.5, 3.2, 3, PLANKS);
cube(-3, 2, -3.2, 3, 2.8, 3.2, DIRT);

// Chest muscle detail
cube(-3, 3.5, -2.5, -1, 5, -1.5, GRASS);
cube(1, 3.5, -2.5, 3, 5, -1.5, GRASS);

// Pecs
cube(-3.5, 3, -2, -2, 4.2, 1.8, GRASS);
cube(2, 3, -2, 3.5, 4.2, 1.8, GRASS);

// Belly button
block(0, 2.5, -3, STONE);

// Shoulders
cube(-4.2, 4.5, -1.5, -3.5, 5.5, 0.5, GRASS);
cube(3.5, 4.5, -1.5, 4.2, 5.5, 0.5, GRASS);

// Swamp background detail - reeds/posts
line(-12, -2, -8, -12, 4, -8, OAK_LOG);
line(12, -2, -8, 12, 3, -8, OAK_LOG);
cube(-12, 4, -8, -11, 5, -7, LEAVES);
cube(11, 3, -8, 12, 4, -7, LEAVES);

// Additional facial detail
sphere(-0.5, 10.5, -3.5, 0.8, LEAVES);
sphere(0.5, 10.5, -3.5, 0.8, LEAVES);