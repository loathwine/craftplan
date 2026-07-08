// octopus-4x-haiku — prompt:
// a giant octopus...

// Giant Octopus

// Main body - large rounded head
sphere(0, 6, 0, 10, COBBLE);
sphere(0, 6, 0, 8, STONE);

// Front bulge for face
sphere(0, 7, -3, 5, COBBLE);

// Eyes (front-facing, north-looking)
sphere(-5, 11, -8, 2, GLASS);
sphere(5, 11, -8, 2, GLASS);
block(-5, 11, -8, BRICK);
block(5, 11, -8, BRICK);

// Mouth area - carve and detail
cube(-3, 3, -6, 3, 5, -4, AIR);
sphere(0, 4, -7, 2, BRICK);

// Tentacle 1: Lower-left-front
sphere(-6, 1, -1, 1.5, OAK_LOG);
sphere(-8, -1, -4, 1.3, OAK_LOG);
sphere(-10, -3, -7, 1.2, OAK_LOG);
line(-6, 1, -1, -10, -3, -7, OAK_LOG);
disk(-7, 1, -2, 1, BRICK);
disk(-9, -2, -5, 0.8, BRICK);

// Tentacle 2: Lower-right-front
sphere(6, 1, -1, 1.5, OAK_LOG);
sphere(8, -1, -4, 1.3, OAK_LOG);
sphere(10, -3, -7, 1.2, OAK_LOG);
line(6, 1, -1, 10, -3, -7, OAK_LOG);
disk(7, 1, -2, 1, BRICK);
disk(9, -2, -5, 0.8, BRICK);

// Tentacle 3: Left side
sphere(-13, 5, 0, 2, OAK_LOG);
sphere(-16, 6, -1, 1.5, OAK_LOG);
sphere(-19, 5, 1, 1.4, OAK_LOG);
line(-13, 5, 0, -19, 5, 1, OAK_LOG);
disk(-15, 6, 0, 1, BRICK);
disk(-17, 4, 0, 0.8, BRICK);

// Tentacle 4: Right side
sphere(13, 5, 0, 2, OAK_LOG);
sphere(16, 6, -1, 1.5, OAK_LOG);
sphere(19, 5, 1, 1.4, OAK_LOG);
line(13, 5, 0, 19, 5, 1, OAK_LOG);
disk(15, 6, 0, 1, BRICK);
disk(17, 4, 0, 0.8, BRICK);

// Tentacle 5: Back-left
sphere(-7, 5, 11, 1.5, OAK_LOG);
sphere(-8, 4, 14, 1.3, OAK_LOG);
sphere(-8, 3, 17, 1.2, OAK_LOG);
line(-7, 5, 11, -8, 3, 17, OAK_LOG);
disk(-8, 6, 12, 0.9, BRICK);
disk(-8, 4, 15, 0.8, BRICK);

// Tentacle 6: Back-right
sphere(7, 5, 11, 1.5, OAK_LOG);
sphere(8, 4, 14, 1.3, OAK_LOG);
sphere(8, 3, 17, 1.2, OAK_LOG);
line(7, 5, 11, 8, 3, 17, OAK_LOG);
disk(8, 6, 12, 0.9, BRICK);
disk(8, 4, 15, 0.8, BRICK);

// Tentacle 7: Upper-left
sphere(-5, 14, 1, 1.5, OAK_LOG);
sphere(-6, 17, -1, 1.3, OAK_LOG);
sphere(-6, 20, -2, 1.2, OAK_LOG);
line(-5, 14, 1, -6, 20, -2, OAK_LOG);
disk(-6, 16, 0, 0.9, BRICK);
disk(-7, 18, -1, 0.8, BRICK);

// Tentacle 8: Upper-right
sphere(5, 14, 1, 1.5, OAK_LOG);
sphere(6, 17, -1, 1.3, OAK_LOG);
sphere(6, 20, -2, 1.2, OAK_LOG);
line(5, 14, 1, 6, 20, -2, OAK_LOG);
disk(6, 16, 0, 0.9, BRICK);
disk(7, 18, -1, 0.8, BRICK);

// Body detail - sucker texture spots
sphere(-4, 8, 2, 1, BRICK);
sphere(4, 8, 2, 1, BRICK);
sphere(0, 10, 4, 0.9, BRICK);
sphere(-3, 5, -2, 0.9, BRICK);
sphere(3, 5, -2, 0.9, BRICK);
sphere(-2, 3, 2, 0.9, BRICK);
sphere(2, 3, 2, 0.9, BRICK);
sphere(-1, 12, 2, 0.8, BRICK);
sphere(1, 12, 2, 0.8, BRICK);

// Side bulges for form dimension
sphere(-4, 4, 6, 1.4, COBBLE);
sphere(4, 4, 6, 1.4, COBBLE);

// Lower jaw detail
cube(-3, 2, -4, 3, 3, -2, BRICK);

// Extra texture accents
sphere(-3, 9, -1, 0.7, BRICK);
sphere(3, 9, -1, 0.7, BRICK);
sphere(0, 9, 3, 0.7, BRICK);