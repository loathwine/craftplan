// cyclops-4x-haiku — prompt:
// a cyclops...

// CYCLOPS - menacing one-eyed giant facing north

// HEAD - large stone sphere
sphere(0, 14, 0, 7, STONE);

// Face front carved detail
cube(-5, 10, -8, 5, 18, -2, STONE);

// Eye socket carved
cube(-4, 11, -8, 4, 16, -4, AIR);

// Large eyeball - glass
sphere(0, 13, -6, 3.5, GLASS);

// Iris - brick colored center
sphere(0, 13, -7, 2, BRICK);

// Pupil - dark
sphere(0, 13, -7.5, 1, COBBLE);

// Sclera - white of eye
cube(-3, 12, -7, 3, 14, -5, SNOW);

// Eyebrow ridge - menacing
cube(-6, 16, -7, 6, 17, -3, BRICK);
cube(-5, 17, -5, 5, 18, -4, BRICK);
cube(-4, 18, -4, 4, 19, -3, BRICK);

// Nose ridge
cube(-1, 10, -8, 1, 13, -4, STONE);

// Nostrils
block(-1, 11, -9, AIR);
block(1, 11, -9, AIR);

// Mouth - angry line
line(-4, 8, -8, 4, 8, -8, AIR);
line(-3, 7, -8, 3, 7, -8, AIR);

// Cheekbones
cube(-5, 11, -8, -4, 13, -6, COBBLE);
cube(4, 11, -8, 5, 13, -6, COBBLE);

// Jaw structure
cube(-4, 8, -8, 4, 10, -6, COBBLE);

// BODY - muscular torso
cube(-5, 1, -3, 5, 12, 4, COBBLE);

// Pectoral muscles
cube(-4, 7, -3, -1, 11, 4, BRICK);
cube(1, 7, -3, 4, 11, 4, BRICK);

// Sternum detail
cube(-1, 6, -3, 1, 10, 4, STONE);

// Rib cage texture
cube(-4, 5, -2, -2, 7, 3, COBBLE);
cube(2, 5, -2, 4, 7, 3, COBBLE);

// Abdominal definition
cube(-3, 2, -2, -1, 5, 3, BRICK);
cube(1, 2, -2, 3, 5, 3, BRICK);
cube(-3, 5, -2, 3, 7, 3, COBBLE);

// Spine ridge
line(-1, 2, 0, -1, 9, 0, COBBLE);

// Hip/waist
cube(-5, 0, -3, 5, 2, 4, BRICK);

// SHOULDERS
cube(-6, 8, -2, -5, 11, 3, STONE);
cube(5, 8, -2, 6, 11, 3, STONE);

// LEFT ARM - muscular
cube(-9, 5, -2, -6, 10, 3, COBBLE);
cube(-11, 4, -1, -9, 8, 2, BRICK);
cube(-11, 5, 0, -10, 7, 1, STONE);

// RIGHT ARM - muscular
cube(6, 5, -2, 9, 10, 3, COBBLE);
cube(9, 4, -1, 11, 8, 2, BRICK);
cube(10, 5, 0, 11, 7, 1, STONE);

// ARMBAND details
cube(-10, 6, -1, -9, 7, 2, STONE);
cube(9, 6, -1, 10, 7, 2, STONE);

// LEFT LEG
cube(-4, -1, 0, -2, 1, 2, STONE);
cube(-4, -3, 0, -2, 0, 2, COBBLE);
cube(-4, -4, -1, -2, -3, 3, BRICK);

// RIGHT LEG
cube(2, -1, 0, 4, 1, 2, STONE);
cube(2, -3, 0, 4, 0, 2, COBBLE);
cube(2, -4, -1, 4, -3, 3, BRICK);

// HAIR - wild mane
sphere(-4, 19, 1, 3.5, LEAVES);
sphere(4, 19, 1, 3.5, LEAVES);
sphere(-1, 20, 2, 3, LEAVES);
sphere(1, 20, 2, 3, LEAVES);
sphere(0, 21, 3, 3, LEAVES);
sphere(-2, 18, -2, 2.5, LEAVES);
sphere(2, 18, -2, 2.5, LEAVES);

// BEARD - dark and threatening
cube(-3, 7, -8, 3, 9, -5, LEAVES);
cube(-2, 6, -9, 2, 8, -7, LEAVES);

// BACK of head detail
sphere(-1, 16, 4, 2.5, LEAVES);
sphere(1, 16, 4, 2.5, LEAVES);