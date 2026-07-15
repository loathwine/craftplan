// superman-4x-haiku — prompt:
// Superman...

// Superman - iconic superhero voxel sculpture
// Facing north toward camera (-Z direction)

// Head with black hair
cube(-4, 22, -3, 4, 27, 3, COBBLE);

// Face - skin tone
cube(-3, 23, -2, 3, 26, 2, PLANKS);

// Eyes - bright blue
block(-1, 25, -3, GLASS);
block(1, 25, -3, GLASS);

// Strong jaw
cube(-4, 20, -2, 4, 22, 3, BRICK);

// Neck
cube(-2, 19, -2, 2, 21, 2, PLANKS);

// Broad shoulders and chest - blue suit
cube(-8, 12, -4, 8, 20, 3, GLASS);

// The iconic red cape - signature element
cube(-10, 13, 0, 10, 21, 9, BRICK);

// Cape wrinkles for depth
cube(-9, 14, 3, -7, 19, 6, AIR);
cube(7, 14, 3, 9, 19, 6, AIR);

// Chest emblem - red S symbol
cube(-1, 15, -5, 1, 17, -4, BRICK);
cube(-2, 14, -5, 0, 15, -4, BRICK);
cube(0, 14, -5, 2, 15, -4, BRICK);

// Powerful pectoral muscles
cube(-7, 16, -5, -3, 19, -2, BRICK);
cube(3, 16, -5, 7, 19, -2, BRICK);

// Abdominal definition
cube(-6, 12, -5, 6, 13, -2, BRICK);

// Left arm - muscular
cube(-10, 13, -2, -8, 17, 2, GLASS);
cube(-12, 11, -1, -10, 14, 1, GLASS);
cube(-13, 10, 0, -12, 12, 1, PLANKS);

// Right arm (mirrored)
cube(8, 13, -2, 10, 17, 2, GLASS);
cube(10, 11, -1, 12, 14, 1, GLASS);
cube(12, 10, 0, 13, 12, 1, PLANKS);

// Left leg - muscular blue
cube(-4, 2, -3, -1, 12, 2, GLASS);

// Right leg - muscular blue
cube(1, 2, -3, 4, 12, 2, GLASS);

// Red boots
cube(-4, 0, -3, -1, 2, 2, BRICK);
cube(1, 0, -3, 4, 2, 2, BRICK);

// Feet - dark cobble
cube(-4, -1, -3, -1, 0, 2, COBBLE);
cube(1, -1, -3, 4, 0, 2, COBBLE);

// Cape pooling on ground - adds drama
cube(-10, 0, 7, -8, 3, 10, BRICK);
cube(8, 0, 7, 10, 3, 10, BRICK);

// Cape center flow
cube(-7, 1, 9, 7, 4, 11, BRICK);