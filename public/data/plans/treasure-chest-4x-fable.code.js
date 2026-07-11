// treasure-chest-4x-fable — prompt:
// a treasure chest overflowing with gold...

cube(-14, 0, -17, 14, 15, 12, AIR);

disk(0, -1, -6, 10, SAND);

disk(0, 0, -7, 9, SAND);
disk(0, 1, -7, 8, SAND);
disk(-1, 2, -6, 7, SAND);
disk(1, 3, -6, 5, SAND);
disk(0, 4, -5, 4, SAND);
disk(0, 5, -5, 2, SAND);

cube(-8, -1, -3, 8, -1, 6, PLANKS);
cube(-8, 0, -3, 8, 0, 6, PLANKS);
cube(-8, 1, -3, 8, 6, -3, PLANKS);
cube(-8, 1, 6, 8, 6, 6, PLANKS);
cube(-8, 1, -3, -8, 6, 6, PLANKS);
cube(8, 1, -3, 8, 6, 6, PLANKS);

cube(-8, 6, -3, 8, 6, -3, OAK_LOG);
cube(-8, 6, 6, 8, 6, 6, OAK_LOG);
cube(-8, 6, -3, -8, 6, 6, OAK_LOG);
cube(8, 6, -3, 8, 6, 6, OAK_LOG);
cube(-8, 0, -3, 8, 0, -3, OAK_LOG);
cube(-8, 0, 6, 8, 0, 6, OAK_LOG);
cube(-8, 0, -3, -8, 0, 6, OAK_LOG);
cube(8, 0, -3, 8, 0, 6, OAK_LOG);
for (const x of [-8, 8]) for (const z of [-3, 6]) cube(x, 0, z, x, 7, z, OAK_LOG);

for (const x of [-4, 4]) {
  cube(x, 0, -3, x, 6, -3, COBBLE);
  cube(x, 0, 6, x, 6, 6, COBBLE);
}

for (let i = 0; i <= 7; i++) {
  const y = 7 + i;
  const z1 = 6 + Math.round(i * 0.55);
  const z2 = z1 + 1;
  cube(-8, y, z1, 8, y, z2, PLANKS);
  cube(-8, y, z1, -8, y, z2, OAK_LOG);
  cube(8, y, z1, 8, y, z2, OAK_LOG);
  cube(-4, y, z1, -4, y, z2, COBBLE);
  cube(4, y, z1, 4, y, z2, COBBLE);
}
cube(-8, 15, 10, 8, 15, 11, OAK_LOG);
block(0, 7, 6, COBBLE);
block(0, 8, 7, COBBLE);

cube(-7, 1, -2, 7, 5, 5, SAND);
cube(-6, 6, -2, 6, 6, 4, SAND);
cube(-5, 7, -2, 5, 7, 3, SAND);
cube(-3, 8, -1, 3, 8, 2, SAND);
cube(-1, 9, -1, 1, 9, 1, SAND);
block(0, 10, 0, SAND);

block(-4, 8, 0, BRICK);
block(3, 8, 3, BRICK);
block(-2, 9, 0, LEAVES);
block(2, 9, 2, LEAVES);
block(1, 10, 0, GLASS);
block(0, 10, 1, SNOW);

cube(-5, 6, -3, 5, 7, -3, SAND);
cube(-5, 2, -4, -2, 7, -4, SAND);
cube(2, 3, -4, 5, 7, -4, SAND);
cube(-4, 1, -5, 4, 2, -5, SAND);
block(0, 6, -4, SAND);

cube(-1, 2, -4, 1, 5, -4, COBBLE);
block(0, 5, -4, STONE);
block(0, 3, -4, AIR);

block(-7, 7, -3, SNOW);
block(-7, 6, -4, SNOW);
block(-7, 5, -4, SNOW);
block(-7, 4, -4, SNOW);
block(7, 7, -3, SNOW);
block(7, 6, -4, SNOW);
block(7, 5, -4, SNOW);

block(-8, 6, 0, SAND);
block(-8, 6, 1, SAND);
block(-8, 7, 1, SAND);
cube(-9, 2, 0, -9, 6, 1, SAND);
disk(-10, 0, 1, 3, SAND);
disk(-10, 1, 1, 2, SAND);

for (const [dx, dz] of [[-2,0],[2,0],[0,-2],[0,2],[-1,-1],[1,-1],[-1,1],[1,1]]) block(dx, 4, -9 + dz, SAND);
for (const [dx, dz] of [[-2,0],[2,0],[0,2]]) block(dx, 5, -9 + dz, SAND);
block(0, 4, -11, BRICK);
block(0, 5, -11, SAND);

cube(5, 2, -9, 5, 6, -9, STONE);
cube(4, 7, -9, 6, 7, -9, OAK_LOG);
block(5, 8, -9, OAK_LOG);
block(5, 9, -9, SAND);

cube(-8, 1, -12, -6, 3, -10, SNOW);
block(-8, 2, -12, AIR);
block(-6, 2, -12, AIR);
block(-8, 3, -12, AIR);
block(-6, 3, -12, AIR);
block(-8, 3, -10, AIR);
block(-6, 3, -10, AIR);

block(-11, 0, -7, SAND);
cube(-11, 1, -7, -11, 2, -7, SAND);
for (const [dx, dz] of [[-1,0],[1,0],[0,-1],[0,1]]) block(-11 + dx, 3, -7 + dz, SAND);
block(-11, 3, -7, BRICK);

cube(10, 0, -5, 13, 0, -2, SAND);
cube(10, 1, -4, 12, 1, -2, SAND);
cube(11, 2, -4, 12, 2, -3, SAND);
block(11, 3, -3, BRICK);

cylinder(13, 0, 4, 2, 5, PLANKS);
hollowCylinder(13, 0, 4, 2, 1, OAK_LOG);
hollowCylinder(13, 2, 4, 2, 1, OAK_LOG);
hollowCylinder(13, 4, 4, 2, 1, OAK_LOG);
block(13, 5, 4, SAND);
block(12, 5, 3, SAND);

cube(-8, 0, -11, -7, 0, -10, SAND);
cube(7, 0, -9, 8, 0, -8, SAND);
cube(-3, 0, -16, -2, 0, -15, SAND);

const coins = [
  [-11,1,-4],[-13,1,-1],[-9,1,-8],[-12,1,-10],[10,0,-8],[12,0,-6],[13,1,-9],
  [8,0,-11],[-6,0,-13],[-2,1,-15],[3,0,-14],[6,0,-13],[-14,1,-3],[11,0,-11],
  [-8,1,-14],[1,1,-17],[-4,1,-16],[9,0,-14],[5,0,-12],[-5,0,-12]
];
for (const [x, y, z] of coins) block(x, y, z, SAND);