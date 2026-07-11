// taj-mahal-4x-haiku — prompt:
// the Taj Mahal...

const STONE = 3;
const COBBLE = 8;
const BRICK = 10;
const GLASS = 11;
const SAND = 6;
const AIR = 0;

// Outer terrace - largest base
cube(-16, -1, -16, 16, -1, 16, STONE);
cube(-14, 0, -14, 14, 0, 14, BRICK);

// Middle terrace
cube(-12, 1, -12, 12, 1, 12, STONE);

// Inner platform
cube(-10, 2, -10, 10, 2, 10, COBBLE);

// Reflecting pools on sides
cube(-11, 3, -8, -8, 3, 8, GLASS);
cube(8, 3, -8, 11, 3, 8, GLASS);

// Main base platform
cube(-8, 3, -8, 8, 3, 8, STONE);
cube(-7, 4, -7, 7, 4, 7, BRICK);

// Four corner minarets
cylinder(-8, 5, -8, 1.2, 14, BRICK);
cylinder(8, 5, -8, 1.2, 14, BRICK);
cylinder(-8, 5, 8, 1.2, 14, BRICK);
cylinder(8, 5, 8, 1.2, 14, BRICK);

// Minaret cupola tops
for (let angle = 0; angle < 8; angle++) {
  const theta = (Math.PI * 2 * angle) / 8;
  const dx = Math.round(2 * Math.cos(theta));
  const dz = Math.round(2 * Math.sin(theta));
  block(-8 + dx, 19, -8 + dz, COBBLE);
  block(8 + dx, 19, -8 + dz, COBBLE);
  block(-8 + dx, 19, 8 + dz, COBBLE);
  block(8 + dx, 19, 8 + dz, COBBLE);
}

// Main mausoleum walls - hollow rectangular structure
for (let y = 5; y <= 13; y++) {
  hollowCube(-6, y, -6, 6, y, 6, STONE);
}

// Main mausoleum corner reinforcements
cube(-6, 5, -6, -5, 13, -5, COBBLE);
cube(5, 5, -6, 6, 13, -5, COBBLE);
cube(-6, 5, 5, -5, 13, 6, COBBLE);
cube(5, 5, 5, 6, 13, 6, COBBLE);

// Front entrance facing north
cube(-5, 5, -7, 5, 5, -7, BRICK);
hollowCube(-4, 6, -7, 4, 11, -7, BRICK);
cube(-5, 11, -8, 5, 11, -8, STONE);
cube(-4, 12, -8, 4, 12, -8, COBBLE);

// Entrance doorway opening
for (let y = 6; y < 10; y++) {
  block(0, y, -6, AIR);
  block(-1, y, -6, AIR);
  block(1, y, -6, AIR);
}

// Side porticos
cube(-7, 5, -2, -7, 9, 2, STONE);
cube(7, 5, -2, 7, 9, 2, STONE);

// Side chamber openings
for (let y = 6; y <= 8; y++) {
  block(-7, y, -1, GLASS);
  block(-7, y, 1, GLASS);
  block(7, y, -1, GLASS);
  block(7, y, 1, GLASS);
}

// Interior main chamber
cube(-4, 5, -4, 4, 5, 4, AIR);
cube(-3, 6, -3, 3, 6, 3, AIR);

// Central tomb platform
cube(-2, 5, -2, 2, 6, 2, COBBLE);
cube(-1, 7, -1, 1, 7, 1, BRICK);

// Interior side chambers
cube(-5, 5, -4, -4, 7, -3, AIR);
cube(4, 5, -4, 5, 7, -3, AIR);
cube(-5, 5, 3, -4, 7, 4, AIR);
cube(4, 5, 3, 5, 7, 4, AIR);

// Decorative interior arches
for (let x = -3; x <= 3; x++) {
  block(x, 10, -4, BRICK);
  block(x, 10, 4, BRICK);
}

// Main dome - central sphere structure
sphere(0, 14, 0, 7, STONE);
sphere(0, 12, 0, 6, COBBLE);
sphere(0, 11, 0, 5, BRICK);

// Dome finial
cylinder(0, 21, 0, 0.6, 2, STONE);
block(0, 23, 0, BRICK);

// Structural connecting walls
cube(-7, 4, -7, -6, 7, -6, STONE);
cube(6, 4, -7, 7, 7, -6, STONE);
cube(-7, 4, 6, -6, 7, 7, STONE);
cube(6, 4, 6, 7, 7, 7, STONE);

// Decorative crenellations
for (let x = -5; x <= 5; x += 2) {
  block(x, 14, -6, BRICK);
  block(x, 14, 6, BRICK);
}
for (let z = -5; z <= 5; z += 2) {
  block(-6, 14, z, BRICK);
  block(6, 14, z, BRICK);
}

// Terraced garden areas
cube(-14, 2, 10, 14, 2, 13, SAND);
cube(-14, 2, -13, 14, 2, -10, SAND);
cube(-13, 2, -8, -10, 2, 8, SAND);
cube(10, 2, -8, 13, 2, 8, SAND);

// Pathways connecting structures
cube(-9, 3, 7, 9, 3, 9, COBBLE);
cube(-9, 3, -9, 9, 3, -7, COBBLE);

// Minaret terraces
for (let angle = 0; angle < 4; angle++) {
  const th = (Math.PI * 2 * angle) / 4;
  const dx = Math.round(2.5 * Math.cos(th));
  const dz = Math.round(2.5 * Math.sin(th));
  
  cube(-9 + dx, 9, -9 + dz, -7 + dx, 10, -7 + dz, COBBLE);
  cube(7 + dx, 9, -9 + dz, 9 + dx, 10, -7 + dz, COBBLE);
  cube(-9 + dx, 9, 7 + dz, -7 + dx, 10, 9 + dz, COBBLE);
  cube(7 + dx, 9, 7 + dz, 9 + dx, 10, 9 + dz, COBBLE);
}

// Architectural richness - intermediate levels
cube(-5, 7, -5, 5, 8, 5, COBBLE);
cube(-4, 9, -4, 4, 9, 4, BRICK);

// Additional dome rings for detail
sphere(0, 10, 0, 4, STONE);

// Garden embankments
cube(-16, 1, 13, 16, 2, 16, STONE);
cube(-16, 1, -16, 16, 2, -13, STONE);