// locomotive-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
function circleXY(cx, cy, z, r, id) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++) {
    for (let dy = -R; dy <= R; dy++) {
      if (dx * dx + dy * dy <= r * r + r * 0.7) block(cx + dx, cy + dy, z, id);
    }
  }
}
function circleYZ(x, cy, cz, r, id) {
  const R = Math.ceil(r);
  for (let dy = -R; dy <= R; dy++) {
    for (let dz = -R; dz <= R; dz++) {
      if (dy * dy + dz * dz <= r * r + r * 0.7) block(x, cy + dy, cz + dz, id);
    }
  }
}

for (let z = -15; z <= 20; z += 3) {
  cube(-5, 0, z, 5, 0, z, PLANKS);
}
line(-4, 0, -16, -4, 0, 20, STONE);
line(4, 0, -16, 4, 0, 20, STONE);

for (let x = -3; x <= 3; x++) {
  line(x, 4, -11, 0, 1, -15, PLANKS);
}
cube(-3, 4, -12, 3, 5, -12, BRICK);
block(-3, 5, -12, SAND);
block(3, 5, -12, SAND);

cube(-3, 2, -11, 3, 4, 19, COBBLE);

circleYZ(-4, 1, -10, 1, BRICK); circleYZ(4, 1, -10, 1, BRICK);
const driverZ = [-5, -1, 3];
for (const z of driverZ) {
  circleYZ(-4, 2, z, 2, BRICK);
  circleYZ(4, 2, z, 2, BRICK);
  circleYZ(-4, 2, z, 0.8, STONE);
  circleYZ(4, 2, z, 0.8, STONE);
}
circleYZ(-4, 1.5, 7, 1.5, BRICK); circleYZ(4, 1.5, 7, 1.5, BRICK);
circleYZ(-4, 1.5, 12, 1.5, BRICK); circleYZ(4, 1.5, 12, 1.5, BRICK);
circleYZ(-4, 1.5, 17, 1.5, BRICK); circleYZ(4, 1.5, 17, 1.5, BRICK);

line(-4, 2, -5, -4, 2, 3, STONE);
line(4, 2, -5, 4, 2, 3, STONE);

for (let z = -8; z <= 4; z++) {
  circleXY(0, 6, z, 3, STONE);
}
circleXY(0, 6, -8, 2.4, COBBLE);
block(0, 6, -9, SAND);

cube(-4, 4, -8, -4, 4, 4, PLANKS);
cube(4, 4, -8, 4, 4, 4, PLANKS);

line(-3, 8, -7, -3, 8, 3, STONE);
line(3, 8, -7, 3, 8, 3, STONE);

cylinder(0, 9, -4, 1, 2, COBBLE);
disk(0, 11, -4, 1, COBBLE);
cylinder(0, 9, 0, 1, 2, COBBLE);
disk(0, 11, 0, 1, COBBLE);

sphere(0, 10, 2, 1, SAND);

line(2, 9, -1, 2, 11, -1, STONE);
block(2, 11, -1, COBBLE);

cylinder(0, 9, -7, 1, 4, STONE);
disk(0, 13, -7, 1.4, COBBLE);
disk(0, 14, -7, 1, COBBLE);

sphere(0, 10, -8, 1, SNOW);
block(0, 10, -9, GLASS);

cube(-3, 2, 4, 3, 11, 10, OAK_LOG);
cube(-2, 3, 5, 2, 10, 9, AIR);
cube(-4, 11, 3, 4, 12, 11, PLANKS);
cube(-3, 5, 6, -3, 7, 8, GLASS);
cube(3, 5, 6, 3, 7, 8, GLASS);
block(-3, 9, 7, SAND);
block(3, 9, 7, SAND);

cube(-3, 2, 11, 3, 5, 19, BRICK);
cube(-2, 3, 12, 2, 5, 18, AIR);
cube(-2, 5, 12, 2, 6, 18, STONE);
cube(-1, 6, 13, 1, 7, 17, STONE);
line(-3, 3, 19, -3, 6, 19, STONE);

sphere(0, 15, -8, 1, SNOW);
sphere(1, 16, -7, 1.3, SNOW);
sphere(-1, 17.5, -6, 1.6, SNOW);
```
