// neuschwanstein-4x-haiku — prompt:
// Neuschwanstein Castle...

// Neuschwanstein Castle - Gothic Revival fortress

const baseY = 0;

// Outer curtain walls - main perimeter
cube(-12, baseY, -15, 12, baseY + 7, -14, COBBLE); // North wall
cube(-12, baseY, 14, 12, baseY + 6, 15, COBBLE);   // South wall
cube(-13, baseY, -14, -11, baseY + 7, 14, COBBLE); // West wall
cube(11, baseY, -14, 13, baseY + 7, 14, COBBLE);   // East wall

// Crenellations on walls
for (let x = -12; x <= 12; x += 3) {
  cube(x, baseY + 8, -15, x + 1, baseY + 9, -14, BRICK);
  cube(x, baseY + 8, 14, x + 1, baseY + 9, 15, BRICK);
}
for (let z = -14; z <= 14; z += 3) {
  cube(-13, baseY + 8, z, -12, baseY + 9, z + 1, BRICK);
  cube(12, baseY + 8, z, 13, baseY + 9, z + 1, BRICK);
}

// Main Keep - tallest central tower
const keepSize = 8;
cube(-keepSize/2, baseY, -2, keepSize/2, baseY + 22, 4, STONE);

// Keep interior hollow
cube(-keepSize/2 + 1, baseY + 1, -1, keepSize/2 - 1, baseY + 21, 3, AIR);

// Keep window patterns - large Gothic-style windows
for (let y = baseY + 3; y <= baseY + 19; y += 5) {
  cube(-keepSize/2 - 1, y, 0, -keepSize/2 - 1, y + 2, 2, GLASS);
  cube(keepSize/2, y, 0, keepSize/2, y + 2, 2, GLASS);
  cube(-1, y, -keepSize/2 - 1, 1, y + 2, -keepSize/2 - 1, GLASS);
  cube(-1, y, keepSize/2, 1, y + 2, keepSize/2, GLASS);
}

// Keep spire - multi-tiered roof
for (let i = 0; i < 5; i++) {
  const roofY = baseY + 22 + i;
  const sz = keepSize/2 - i * 0.7;
  if (sz > 0.5) {
    cube(-sz, roofY, -sz + 1, sz, roofY + 1, sz + 3, BRICK);
  }
}
cylinder(0, baseY + 27, 1, 1.5, 5, STONE);

// Corner towers - defensive positions
const corners = [
  {x: -10, z: -12, r: 3.5, h: 16},
  {x: 10, z: -12, r: 3.5, h: 16},
  {x: -10, z: 12, r: 3.5, h: 14},
  {x: 10, z: 12, r: 3.5, h: 14}
];

corners.forEach(c => {
  cube(c.x - c.r, baseY, c.z - c.r, c.x + c.r, baseY + c.h, c.z + c.r, COBBLE);
  cube(c.x - c.r + 1, baseY + 1, c.z - c.r + 1, c.x + c.r - 1, baseY + c.h - 1, c.z + c.r - 1, AIR);
  
  for (let y = baseY + 2; y < baseY + c.h - 1; y += 4) {
    block(c.x - c.r - 1, y, c.z, GLASS);
    block(c.x + c.r, y, c.z, GLASS);
  }
  
  for (let i = 0; i < 3; i++) {
    const roofY = baseY + c.h + i;
    cube(c.x - c.r + i, roofY, c.z - c.r + i, c.x + c.r - i, roofY + 1, c.z + c.r - i, BRICK);
  }
});

// Intermediate towers on walls
const wallTowers = [
  {x: -5, z: -14, w: 2.5, h: 11},
  {x: 5, z: -14, w: 2.5, h: 11},
  {x: -13, z: -5, w: 2, h: 9},
  {x: 13, z: -5, w: 2, h: 9},
  {x: -13, z: 5, w: 2, h: 9},
  {x: 13, z: 5, w: 2, h: 9},
  {x: -5, z: 15, w: 2.5, h: 10},
  {x: 5, z: 15, w: 2.5, h: 10}
];

wallTowers.forEach(t => {
  cube(t.x - t.w/2, baseY, t.z - t.w/2, t.x + t.w/2, baseY + t.h, t.z + t.w/2, COBBLE);
  cube(t.x - t.w/2 + 0.5, baseY + 1, t.z - t.w/2 + 0.5, t.x + t.w/2 - 0.5, baseY + t.h - 1, t.z + t.w/2 - 0.5, AIR);
  for (let y = baseY + 2; y < baseY + t.h - 1; y += 3) {
    block(t.x - t.w/2 - 1, y, t.z, GLASS);
  }
});

// Grand gatehouse - North entrance
cube(-5, baseY + 1, -16, 5, baseY + 9, -15, AIR);
cube(-6, baseY, -17, -4, baseY + 10, -15, COBBLE);
cube(4, baseY, -17, 6, baseY + 10, -15, COBBLE);

// Gateway arch detail
for (let x = -5; x <= 5; x++) {
  block(x, baseY + 9, -15, BRICK);
}

// Bridge to gate
cube(-3, baseY, -18, 3, baseY + 1, -16, COBBLE);

// Interior courtyard foundation
cube(-10, baseY, -12, 10, baseY + 1, 12, DIRT);

// Dividing inner walls - create defensive courtyards
cube(-8, baseY, -1, 8, baseY + 5, 1, STONE);
cube(-1, baseY, -11, 1, baseY + 5, 11, STONE);

// Secondary buildings in courtyard
// West garrison
cube(-9, baseY, -8, -5, baseY + 5, -2, COBBLE);
cube(-8, baseY + 1, -7, -6, baseY + 4, -3, AIR);

// East quarters
cube(5, baseY, -8, 9, baseY + 5, -2, COBBLE);
cube(6, baseY + 1, -7, 8, baseY + 4, -3, AIR);

// South structures
cube(3, baseY, 2, 8, baseY + 5, 8, STONE);
cube(4, baseY + 1, 3, 7, baseY + 4, 7, AIR);

cube(-8, baseY, 2, -3, baseY + 4, 7, COBBLE);
cube(-7, baseY + 1, 3, -4, baseY + 3, 6, AIR);

// Rampart walkways on outer walls
cube(-13, baseY + 7, -13, -11, baseY + 8, 13, STONE);
cube(11, baseY + 7, -13, 13, baseY + 8, 13, STONE);
cube(-11, baseY + 7, -15, 11, baseY + 8, -13, STONE);
cube(-11, baseY + 7, 13, 11, baseY + 8, 15, STONE);

// Buttresses for visual interest
for (let z = -12; z <= 12; z += 5) {
  cube(-keepSize/2 - 1, baseY + 1, z, -keepSize/2 - 1, baseY + 6, z + 1, BRICK);
  cube(keepSize/2, baseY + 1, z, keepSize/2, baseY + 6, z + 1, BRICK);
}

// Foundation basement level
cube(-13, baseY - 2, -16, 13, baseY - 1, 16, DIRT);

// Decorative striping on walls
for (let y = baseY + 4; y <= baseY + 6; y++) {
  line(-12, y, -14, 12, y, -14, BRICK);
  line(-12, y, 14, 12, y, 14, BRICK);
}

// Pinnacles on corner towers
block(-10, baseY + 19, -12, STONE);
block(10, baseY + 19, -12, STONE);
block(-10, baseY + 17, 12, STONE);
block(10, baseY + 17, 12, STONE);