// batman-4x-haiku — prompt:
// Batman...

const STONE = 3;
const COBBLE = 8;
const BRICK = 10;
const GLASS = 11;
const PLANKS = 7;
const AIR = 0;

// Main fortress base
cube(-14, -2, -12, 14, -1, 12, STONE);

// Central tower - hollow
hollowCube(-11, 0, -9, 11, 24, 9, COBBLE);

// Interior chamber
cube(-9, 1, -7, 9, 23, 7, AIR);

// Floor levels every 4 blocks
for (let y = 2; y < 24; y += 4) {
  cube(-9, y, -7, 9, y, 7, PLANKS);
}

// Windows - symmetric pattern
for (let y = 4; y < 20; y += 5) {
  cube(-11, y, -9, -11, y+1, -9, GLASS);
  cube(11, y, -9, 11, y+1, -9, GLASS);
  cube(-5, y, -9, 5, y+1, -9, GLASS);
}

// Left bat wing
cube(-20, 1, -5, -12, 12, 5, COBBLE);
cube(-22, 3, -3, -19, 10, 3, BRICK);

// Right bat wing
cube(12, 1, -5, 20, 12, 5, COBBLE);
cube(19, 3, -3, 22, 10, 3, BRICK);

// Wing ribbing (detail)
for (let i = 0; i < 5; i++) {
  line(-22 + i*2, 6, -5, -22 + i*2, 6, 5, BRICK);
  line(20 + i*2, 6, -5, 20 + i*2, 6, 5, BRICK);
}

// Upper towers (ears)
cube(-11, 20, -5, -8, 28, -2, STONE);
cube(8, 20, -5, 11, 28, -2, STONE);

// Central spire
cube(-2, 25, -2, 2, 32, 2, COBBLE);

// Ramparts around top
for (let x = -11; x <= 11; x += 3) {
  cube(x, 24, -9, x+2, 26, -9, BRICK);
  cube(x, 24, 9, x+2, 26, 9, BRICK);
}
for (let z = -9; z <= 9; z += 3) {
  cube(-11, 24, z, -11, 26, z+2, BRICK);
  cube(11, 24, z, 11, 26, z+2, BRICK);
}

// Turrets at wing ends
cylinder(-22, 8, 0, 2, 7, COBBLE);
cylinder(22, 8, 0, 2, 7, COBBLE);

// Lower rampart walls
cube(-14, 1, -12, -13, 3, -12, BRICK);
cube(13, 1, -12, 14, 3, -12, BRICK);

// Bat symbol carved into front (negative space)
// Outer outline
hollowCube(-6, 10, -10, 6, 18, -10, AIR);
// Central body cutout
cube(-3, 12, -10, 3, 16, -10, AIR);
// Wing cutouts
cube(-8, 13, -10, -5, 15, -10, AIR);
cube(5, 13, -10, 8, 15, -10, AIR);

// Torches/accent lights on wings
cube(-21, 7, -4, -21, 8, -4, BRICK);
cube(21, 7, -4, 21, 8, -4, BRICK);

// Additional interior detail - throne chamber base
cube(-7, 3, -5, 7, 4, 5, BRICK);
cube(-6, 4, -4, 6, 5, 4, STONE);

// Pillars for structural look
for (let z = -6; z <= 6; z += 6) {
  cube(-9, 1, z, -8, 8, z+1, STONE);
  cube(8, 1, z, 9, 8, z+1, STONE);
}

// Crenellations on tower sides
for (let z = -7; z < 9; z += 4) {
  cube(-11, 23, z, -10, 25, z+2, BRICK);
  cube(10, 23, z, 11, 25, z+2, BRICK);
}