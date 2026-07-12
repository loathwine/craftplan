// lighthouse-4x-haiku — prompt:
// a lighthouse on a cliff...

// Lighthouse on a cliff

// Cliff base - layered stone foundation
cube(-16, -2, 10, 16, 2, 20, STONE);
cube(-14, 2, 12, 14, 5, 19, STONE);
cube(-12, 5, 14, 12, 8, 18, COBBLE);

// Cliff weathering detail
for (let i = 0; i < 5; i++) {
  const x = -12 + i * 5;
  const y = 3 + i;
  line(x - 1, y, 15, x + 1, y + 4, 18, AIR);
}

// Crumbling cliff rocks at base
cube(-3, 0, 19, 0, 2, 22, STONE);
cube(2, 0, 20, 5, 1, 22, STONE);
cube(-8, -1, 21, -5, 0, 22, STONE);

// Lighthouse tower - BRICK construction
cylinder(0, 3, 0, 4, 21, BRICK);

// Tower interior hollow
cylinder(0, 4, 0, 2.5, 19, AIR);

// Windows - spiral pattern around tower, 4 per level
for (let y = 6; y < 20; y += 3) {
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI / 2) + (y / 22) * Math.PI * 0.4;
    const x = Math.cos(angle) * 4.2;
    const z = Math.sin(angle) * 4.2;
    cube(x - 0.5, y, z - 0.5, x + 0.5, y + 1.5, z + 0.5, AIR);
  }
}

// Tower door
cube(-1, 3, -5, 1, 5, -4, AIR);

// Spiral staircase inside tower
for (let y = 4; y < 21; y++) {
  const angle = (y - 4) / 17 * Math.PI * 2;
  const sx = Math.cos(angle) * 2;
  const sz = Math.sin(angle) * 2;
  block(Math.round(sx), y, Math.round(sz), PLANKS);
  block(Math.round(sx) - 1, y, Math.round(sz), PLANKS);
}

// Lantern room - wide platform
cylinder(0, 24, 0, 5.5, 2, BRICK);
cylinder(0, 24, 0, 3.8, 2, AIR);

// Lantern windows - 8 openings
for (let i = 0; i < 8; i++) {
  const angle = i / 8 * Math.PI * 2;
  const x = Math.cos(angle) * 5.5;
  const z = Math.sin(angle) * 5.5;
  const bx = Math.round(x);
  const bz = Math.round(z);
  block(bx, 24, bz, AIR);
  block(bx, 25, bz, AIR);
}

// Light beacon - glass sphere
sphere(0, 27, 0, 2.8, GLASS);

// Beacon roof - cone shape
for (let yy = 27; yy <= 29; yy++) {
  const r = 3.2 - (yy - 27) * 0.6;
  cylinder(0, yy, 0, r, 1, BRICK);
}

// Top railing - decorative posts
for (let i = 0; i < 16; i++) {
  const angle = i / 16 * Math.PI * 2;
  const x = Math.cos(angle) * 5.8;
  const z = Math.sin(angle) * 5.8;
  block(Math.round(x), 26, Math.round(z), BRICK);
  block(Math.round(x), 27, Math.round(z), COBBLE);
}

// Base platform - tiered stone
cube(-8, 2, -5, 8, 2, 3, STONE);
cube(-10, 1.5, -4, 10, 1.5, 4, STONE);
cube(-9, 2, -6, 9, 2, -5, COBBLE);

// Keeper's cottage - south of tower
cube(-14, 3, 8, -9, 6, 12, BRICK);

// Cottage door
cube(-13, 3, 7, -11, 5, 7, AIR);

// Cottage windows
cube(-10, 4, 12, -10, 5, 12, AIR);
cube(-13, 4, 12, -13, 5, 12, AIR);

// Cottage roof
cube(-15, 6, 7, -8, 6, 13, PLANKS);

// Cottage chimney
cube(-14, 6, 11, -14, 9, 11, BRICK);
cube(-14, 9, 11, -14, 10, 11, AIR);

// Cottage porch
cube(-15, 2.5, 7, -14, 3, 8, STONE);
cube(-14.5, 3, 7.5, -14.5, 3.5, 7.5, OAK_LOG);

// Stone path from cottage to tower
for (let z = 3; z < 8; z++) {
  cube(-5, 2.5, z, -5, 2.5, z, STONE);
  cube(-6, 2.5, z, -4, 2.5, z, STONE);
}

// Guard post - small tower on cliff edge
cube(10, 4, 14, 12, 7, 16, COBBLE);
cube(10, 4, 14, 12, 4, 16, AIR);
block(10, 7, 14, BRICK);
block(12, 7, 14, BRICK);
block(10, 7, 16, BRICK);
block(12, 7, 16, BRICK);

// Lookout railing
line(9, 7, 15, 13, 7, 15, COBBLE);
line(9, 7, 15, 9, 8, 15, COBBLE);
line(13, 7, 15, 13, 8, 15, COBBLE);

// Flag pole
line(11, 7, 13, 11, 14, 13, OAK_LOG);
cube(11, 14, 12, 11, 14, 13, PLANKS);

// Stone reinforcement walls
cube(-7, 2, 4, -6, 5, 6, STONE);
cube(6, 2, 4, 7, 5, 6, STONE);

// Cliff base cave entrance detail
cube(8, -1, 17, 12, 1, 19, AIR);
cube(7, 0, 18, 13, 0, 20, STONE);

// Decorative stonework - base rings
for (let i = 0; i < 12; i++) {
  const angle = i / 12 * Math.PI * 2;
  const x = Math.cos(angle) * 9;
  const z = Math.sin(angle) * 9;
  block(Math.round(x), 2, Math.round(z), COBBLE);
}

// Stairs up cliff face
for (let i = 0; i < 6; i++) {
  const y = 2 + i * 1.5;
  const z = 10 + i;
  cube(-2 + i, y, z, 2 + i, y, z, STONE);
  cube(-1 + i, y, z - 1, 1 + i, y, z - 1, OAK_LOG);
}