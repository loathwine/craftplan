// werewolf-4x-haiku — prompt:
// a werewolf howling at the moon...

// Werewolf Howling at the Moon - detailed voxel sculpture

// LEGS & FEET - powerful stance
cube(-2, -2, 0, 0, 4, 1, STONE);
cube(1, -2, 0, 3, 4, 1, STONE);
cube(-2, -2, -1, 0, -1, 0, COBBLE);
cube(1, -2, -1, 3, -1, 0, COBBLE);

// PAWS - define toes
line(-2, -1, -2, -2, -1, -3, BRICK);
line(-1, -1, -2, -1, -1, -3, BRICK);
line(1, -1, -2, 1, -1, -3, BRICK);
line(2, -1, -2, 2, -1, -3, BRICK);

// HIPS & LOWER BODY
cube(-2, 3, -1, 2, 6, 1, STONE);

// TORSO - muscular core
cube(-3, 5, -2, 3, 9, 2, STONE);

// CHEST - defined pectorals
cube(-2, 8, -3, 2, 11, 3, COBBLE);
cube(-2, 8, -2, 0, 10, 2, BRICK);
cube(0, 8, -2, 2, 10, 2, BRICK);

// ABDOMINALS
for (let y = 5; y < 8; y++) {
  cube(-1, y, -1, 1, y + 1, 1, COBBLE);
}

// BROAD SHOULDERS
cube(-5, 9, -1, 5, 12, 1, STONE);

// MUSCULAR NECK
cube(-1, 11, -1, 1, 13, 0, STONE);

// HEAD - large, wolfish, tilted back
sphere(0, 15, 0, 3.5, STONE);

// SNOUT - aggressive protrusion
cube(-2, 12, -5, 2, 14, -2, COBBLE);
cube(-1, 11, -6, 1, 13, -5, BRICK);
block(0, 12, -7, BRICK);

// MOUTH - gaping howl
cube(-1, 12, -4, 1, 13, -3, AIR);

// EYES - fierce gaze
block(-1, 16, 1, GLASS);
block(1, 16, 1, GLASS);

// NOSE
block(0, 12, -6, BRICK);

// EARS - pointed wolf ears
cube(-3, 17, -1, -1, 19, 1, STONE);
cube(1, 17, -1, 3, 19, 1, STONE);

// SPINE RIDGE - detail along back
for (let y = 7; y < 12; y++) {
  block(0, y, -3, STONE);
}

// LEFT ARM - raised powerfully
cube(-6, 7, -1, -4, 13, 0, STONE);
cube(-7, 11, -1, -5, 14, 0, COBBLE);

// LEFT HAND & CLAWS
cube(-8, 10, -1, -6, 12, 0, BRICK);
line(-9, 12, -2, -11, 10, -2, BRICK);
line(-9, 13, -1, -11, 11, -1, BRICK);
line(-9, 14, 0, -11, 12, 0, BRICK);

// RIGHT ARM - raised powerfully
cube(4, 7, -1, 6, 13, 0, STONE);
cube(5, 11, -1, 7, 14, 0, COBBLE);

// RIGHT HAND & CLAWS
cube(6, 10, -1, 8, 12, 0, BRICK);
line(9, 12, -2, 11, 10, -2, BRICK);
line(9, 13, -1, 11, 11, -1, BRICK);
line(9, 14, 0, 11, 12, 0, BRICK);

// MOON - massive glowing orb in night sky
sphere(0, 26, -28, 9, SNOW);
sphere(0, 26, -27, 11, GLASS);

// MOON CRATERS - detail surface
cube(-2, 26, -36, 0, 27, -35, COBBLE);
cube(2, 25, -37, 4, 26, -36, COBBLE);
cube(-4, 25, -37, -2, 26, -36, COBBLE);

// STARS - scattered points of light
block(-12, 32, -35, SNOW);
block(10, 30, -38, SNOW);
block(-8, 33, -32, SNOW);
block(14, 31, -40, SNOW);
block(-15, 29, -30, SNOW);
block(16, 28, -35, SNOW);

// CLOUDS - wispy atmospheric layer
cube(-15, 20, -20, -8, 22, -18, GLASS);
cube(8, 21, -22, 18, 23, -20, GLASS);
cube(-10, 23, -30, 5, 24, -28, GLASS);

// GROUND VARIATION - rocky terrain accent
cube(-6, -2, 2, -4, 0, 4, COBBLE);
cube(5, -2, 2, 7, 0, 4, COBBLE);