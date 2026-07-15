// trebuchet-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
function thickArm(x1, y1, z1, x2, y2, z2, id) {
  line(x1, y1, z1, x2, y2, z2, id);
  line(x1, y1, z1 + 1, x2, y2, z2 + 1, id);
}

function aFrame(zA, zB) {
  cube(-5, 0, zA, 5, 1, zB, OAK_LOG);
  line(-5, 1, zA, 0, 11, zA, OAK_LOG);
  line(-5, 1, zB, 0, 11, zB, OAK_LOG);
  line(5, 1, zA, 0, 11, zA, OAK_LOG);
  line(5, 1, zB, 0, 11, zB, OAK_LOG);
  cube(0, 0, zA, 0, 9, zB, OAK_LOG);
  cube(-3, 4, zA, 3, 4, zB, OAK_LOG);
  cube(-2, 7, zA, 2, 7, zB, OAK_LOG);
  cube(-1, 11, zA, 1, 12, zB, OAK_LOG);
}

cube(-7, -1, -5, 7, 0, 5, PLANKS);
hollowCube(-7, 0, -5, 7, 0, 5, BRICK);

aFrame(-4, -3);
aFrame(3, 4);

cube(0, 11, -3, 1, 12, 3, STONE);

thickArm(0, 11, -1, -8, 20, -1, OAK_LOG);
thickArm(0, 11, -1, 5, 2, -1, OAK_LOG);

line(-8, 20, -1, -14, 15, 0, STONE);
sphere(-15, 14, 0, 1, STONE);
sphere(-9, 19, -1, 1, STONE);

line(5, 2, -1, 5, -1, -1, STONE);
line(5, 2, 0, 5, -1, 0, STONE);
cube(3, -4, -2, 7, -1, 2, COBBLE);
hollowCube(3, -4, -2, 7, -1, 2, STONE);

cube(0, 12, 4, 0, 16, 4, OAK_LOG);
cube(1, 14, 4, 3, 15, 4, BRICK);

sphere(9, 0, -2, 1, STONE);
sphere(11, 0, -2, 1, STONE);
sphere(9, 0, 0, 1, STONE);
sphere(11, 0, 0, 1, STONE);
sphere(10, 1, -1, 1, STONE);

cube(8, 0, 3, 9, 1, 4, PLANKS);
cylinder(9, 0, 2, 1, 2, OAK_LOG);

hollowCylinder(0, 0, -9, 2, 1, STONE);
line(-1, 0, -10, 1, 0, -8, OAK_LOG);
line(-1, 0, -8, 1, 0, -10, OAK_LOG);

cube(-10, 0, -8, -10, 2, -8, OAK_LOG);
cube(-2, 0, -9, -2, 2, -9, OAK_LOG);
cube(6, 0, -9, 6, 2, -9, OAK_LOG);
cube(10, 0, -8, 10, 2, -8, OAK_LOG);

cube(-16, 0, -6, -10, 0, -2, PLANKS);
cube(-15, 1, -6, -11, 1, -2, PLANKS);
cube(-14, 2, -6, -12, 2, -2, PLANKS);
cube(-13, 3, -6, -13, 3, -2, PLANKS);
block(-13, 1, -6, AIR);
block(-13, 2, -6, AIR);
