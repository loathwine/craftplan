// wizard-tower-4x-haiku — prompt:
// a wizard's tower...

// Wizard's Tower - Multi-tiered masterwork

// Foundation platform
cube(-8, -2, -8, 8, -1, 8, STONE);
cube(-7, -1, -7, 7, -1, 7, COBBLE);

// Main tower base - hollow cylinder
hollowCylinder(0, 0, 0, 7, 10, STONE);
cube(-6, 0, -6, 6, 9, 6, AIR); // Interior space

// Front (north) windows on base tower
cube(-3, 2, -8, -1, 4, -7, AIR);
cube(1, 2, -8, 3, 4, -7, AIR);
cube(-3, 6, -8, -1, 8, -7, AIR);
cube(1, 6, -8, 3, 8, -7, AIR);

// East windows
cube(7, 2, -3, 8, 4, -1, AIR);
cube(7, 2, 1, 8, 4, 3, AIR);
cube(7, 6, -3, 8, 8, -1, AIR);
cube(7, 6, 1, 8, 8, 3, AIR);

// South windows
cube(-3, 2, 7, -1, 4, 8, AIR);
cube(1, 2, 7, 3, 4, 8, AIR);
cube(-3, 6, 7, -1, 8, 8, AIR);
cube(1, 6, 7, 3, 8, 8, AIR);

// West windows
cube(-8, 2, -3, -7, 4, -1, AIR);
cube(-8, 2, 1, -7, 4, 3, AIR);
cube(-8, 6, -3, -7, 8, -1, AIR);
cube(-8, 6, 1, -7, 8, 3, AIR);

// Balcony platform at base transition
disk(0, 10, 0, 8, PLANKS);
cube(-5, 10, -3, 5, 11, 3, AIR);

// Second tower - medium height
hollowCylinder(0, 11, 0, 5.5, 10, BRICK);
cube(-4, 11, -4, 4, 20, 4, AIR);

// Windows on second tower - north side
for (let y = 12; y < 20; y += 4) {
  cube(-3, y, -6, -1, y + 2, -5, AIR);
  cube(1, y, -6, 3, y + 2, -5, AIR);
}

// Windows on second tower - east side
for (let y = 12; y < 20; y += 4) {
  cube(5, y, -2, 6, y + 2, 0, AIR);
  cube(5, y, 0, 6, y + 2, 2, AIR);
}

// Windows on second tower - south side
for (let y = 12; y < 20; y += 4) {
  cube(-3, y, 5, -1, y + 2, 6, AIR);
  cube(1, y, 5, 3, y + 2, 6, AIR);
}

// Windows on second tower - west side
for (let y = 12; y < 20; y += 4) {
  cube(-6, y, -2, -5, y + 2, 0, AIR);
  cube(-6, y, 0, -5, y + 2, 2, AIR);
}

// Third tower - upper section
hollowCylinder(0, 21, 0, 3.5, 11, STONE);
cube(-2, 21, -2, 2, 31, 2, AIR);

// Windows third tower
for (let y = 23; y < 31; y += 4) {
  cube(-2, y, -4, 0, y + 2, -3, AIR);
  cube(0, y, -4, 2, y + 2, -3, AIR);
  cube(3, y, -1, 4, y + 2, 1, AIR);
  cube(-4, y, -1, -3, y + 2, 1, AIR);
  cube(-2, y, 3, 0, y + 2, 4, AIR);
  cube(0, y, 3, 2, y + 2, 4, AIR);
}

// Crenellations
cube(-3, 31, -3, -1, 33, -1, BRICK);
cube(1, 31, -3, 3, 33, -1, BRICK);
cube(1, 31, 1, 3, 33, 3, BRICK);
cube(-3, 31, 1, -1, 33, 3, BRICK);

// Spire - tapered cone
cylinder(0, 31, 0, 3, 1, BRICK);
cylinder(0, 32, 0, 2.7, 1, BRICK);
cylinder(0, 33, 0, 2.4, 1, BRICK);
cylinder(0, 34, 0, 2.1, 1, BRICK);
cylinder(0, 35, 0, 1.8, 1, BRICK);
cylinder(0, 36, 0, 1.5, 1, BRICK);
cylinder(0, 37, 0, 1.2, 1, BRICK);
cylinder(0, 38, 0, 0.9, 1, GLASS);
cylinder(0, 39, 0, 0.6, 1, GLASS);

// Top crystal ornament
sphere(0, 40, 0, 0.8, GLASS);

// Corner towers for asymmetry and depth
hollowCylinder(9, 0, -9, 2, 12, COBBLE);
cube(8, 0, -10, 10, 11, -8, AIR);

hollowCylinder(-9, 0, 9, 2, 11, COBBLE);
cube(-10, 0, 8, -8, 10, 10, AIR);

hollowCylinder(9, 0, 9, 2, 10, COBBLE);
cube(8, 0, 8, 10, 9, 10, AIR);

// Connecting walls and flying buttresses
cube(7, 1, -8, 9, 5, -6, STONE);
cube(-8, 1, 7, -6, 4, 9, STONE);
cube(8, 1, 7, 10, 4, 9, STONE);

line(7, 11, -7, 9, 13, -9, COBBLE);
line(-7, 11, 7, -9, 13, 9, COBBLE);
line(7, 11, 7, 9, 13, 9, COBBLE);

// Interior structural pillars
cube(-1, 1, -1, 1, 10, 1, STONE);
cube(-3, 12, -3, 3, 20, 3, STONE);
cube(-2, 22, -2, 2, 30, 2, STONE);

// Decorative archways at transitions
hollowCylinder(0, 10, -8, 2, 2, COBBLE);
hollowCylinder(8, 10, 0, 2, 2, COBBLE);
hollowCylinder(0, 10, 8, 2, 2, COBBLE);
hollowCylinder(-8, 10, 0, 2, 2, COBBLE);

// Detail: foundation stones
for (let x = -6; x <= 6; x += 3) {
  for (let z = -6; z <= 6; z += 3) {
    cube(x, 0, z, x, 1, z, STONE);
  }
}

// Decorative columns at base
cube(-7, 0, -7, -6, 3, -6, COBBLE);
cube(6, 0, -7, 7, 3, -6, COBBLE);
cube(6, 0, 6, 7, 3, 7, COBBLE);
cube(-7, 0, 6, -6, 3, 7, COBBLE);