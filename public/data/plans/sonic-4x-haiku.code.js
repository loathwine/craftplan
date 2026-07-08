// sonic-4x-haiku — prompt:
// Sonic the Hedgehog...

// Sonic the Hedgehog - Voxel Architect

// Main body - large blue egg shape
sphere(0, 4, 0, 5, GLASS);
sphere(0, 5, 0, 4.5, GLASS);
sphere(0, 6, 0, 4, GLASS);
cube(-4, 3, -2, 4, 7, 2, GLASS);

// Head - round blue head on top
sphere(0, 10, -3, 3.8, GLASS);
sphere(0, 11, -3, 3.3, GLASS);

// White chest/belly
cube(-3, 3, -2.5, 3, 6, -0.5, SNOW);
sphere(0, 5, -2, 2.8, SNOW);

// Left shoe - red
cube(-5, 0, -1, -3, 3, 1, BRICK);
cube(-5, -1, -1, -3, 0, 1, COBBLE);

// Left shoe white stripe
cube(-5, 1.5, -1, -3, 1.5, 1, SNOW);

// Right shoe - red
cube(3, 0, -1, 5, 3, 1, BRICK);
cube(3, -1, -1, 5, 0, 1, COBBLE);

// Right shoe white stripe
cube(3, 1.5, -1, 5, 1.5, 1, SNOW);

// Top head spikes/quills
sphere(0, 13.5, -2.5, 1.6, GLASS);
sphere(-2.2, 12.5, -2, 1.2, GLASS);
sphere(2.2, 12.5, -2, 1.2, GLASS);

// Back quills
sphere(-2.5, 10.5, 2.5, 1.4, GLASS);
sphere(2.5, 10.5, 2.5, 1.4, GLASS);
sphere(0, 11.5, 3.5, 1.3, GLASS);
sphere(-3.5, 9, 2, 1, GLASS);
sphere(3.5, 9, 2, 1, GLASS);

// Side head spikes
sphere(-3.2, 11.5, -2.5, 1, GLASS);
sphere(3.2, 11.5, -2.5, 1, GLASS);

// Eyes - white
sphere(-1.3, 10.5, -5, 0.75, SNOW);
sphere(1.3, 10.5, -5, 0.75, SNOW);

// Pupils - black
block(-1.3, 10.5, -5.8, STONE);
block(1.3, 10.5, -5.8, STONE);

// Eye shine detail
block(-1.3, 11, -5.8, AIR);
block(1.3, 11, -5.8, AIR);

// Nose - black
block(0, 9.5, -5.5, STONE);
block(0, 9, -5.5, STONE);
block(0, 8.5, -5, BRICK);

// Mouth line
line(-0.8, 8.5, -5, 0.8, 8.5, -5, STONE);

// Gloves/arms - red bands
cube(-5.5, 5, -1, -5, 7, 0, BRICK);
cube(5, 5, -1, 5.5, 7, 0, BRICK);

// Glove detail - lighter
cube(-5.5, 6, -1, -5, 6, 0, SNOW);
cube(5, 6, -1, 5.5, 6, 0, SNOW);

// Additional body detail - sides for roundness
cube(-5, 4, 0, -4.5, 6, 1, GLASS);
cube(4.5, 4, 0, 5, 6, 1, GLASS);
cube(-4, 4, 1.5, 4, 5, 2, GLASS);

// Lower body detail
cube(-3, 2, -1, 3, 3, 1, GLASS);

// Shoe platform detailing
cube(-5, 2, -1, -3, 2.5, 1, GLASS);
cube(3, 2, -1, 5, 2.5, 1, GLASS);

// Back quill detail
sphere(-1.5, 11.5, 3.5, 0.9, GLASS);
sphere(1.5, 11.5, 3.5, 0.9, GLASS);

// Ears/head spikes forward
sphere(-2, 13, -4, 0.8, GLASS);
sphere(2, 13, -4, 0.8, GLASS);