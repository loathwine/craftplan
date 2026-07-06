// hulk-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
function thickLine(x1, y1, z1, x2, y2, z2, r, id) {
  const dist = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  const steps = Math.max(2, Math.ceil(dist / (r * 0.6)));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x1 + (x2 - x1) * t);
    const y = Math.round(y1 + (y2 - y1) * t);
    const z = Math.round(z1 + (z2 - z1) * t);
    sphere(x, y, z, r, id);
  }
}

// ---------- CRATERED GROUND ----------
disk(-6, 0, 1, 5, AIR);
disk(6, 0, -1, 5, AIR);
disk(-6, -1, 1, 4, DIRT);
disk(6, -1, -1, 4, DIRT);
cube(-9, -1, -3, -3, -1, 4, DIRT);
cube(3, -1, -5, 9, -1, 2, DIRT);
line(-12, 0, -2, -8, 0, 3, AIR);
line(9, 0, -8, 13, 0, -3, AIR);
line(-3, 0, 8, 2, 0, 12, AIR);
line(-15, 0, 5, -10, 0, 9, AIR);
cube(-13, 0, -4, -11, 1, -2, STONE);
cube(-14, 0, 2, -12, 0, 4, COBBLE);
cube(10, 0, 3, 12, 1, 5, STONE);
cube(13, 0, -6, 15, 0, -4, COBBLE);
cube(-2, 0, 9, 0, 1, 11, STONE);
cube(2, 0, -10, 4, 1, -8, COBBLE);
cylinder(-18, 0, 9, 1, 2, OAK_LOG);
cube(-19, 1, 8, -17, 2, 10, OAK_LOG);
cylinder(17, 0, -12, 1, 3, OAK_LOG);
cube(16, 2, -13, 18, 2, -11, LEAVES);

// ---------- LEGS ----------
const legs = [
  { x: -6, z: 1 },
  { x: 6, z: -1 },
];
for (const leg of legs) {
  cube(leg.x - 2, 0, leg.z - 2, leg.x + 2, 1, leg.z + 2, LEAVES);
  cylinder(leg.x, 1, leg.z, 2.3, 4, LEAVES);
  cylinder(leg.x, 5, leg.z, 2.8, 4, LEAVES);
  line(leg.x, 2, leg.z + 2, leg.x, 4, leg.z + 2, AIR);
  cylinder(leg.x, 6, leg.z, 3.1, 4, STONE);
  block(leg.x - 3, 6, leg.z, AIR);
  block(leg.x + 3, 7, leg.z + 1, AIR);
  block(leg.x + 2, 6, leg.z - 2, AIR);
}
cube(-8, 9, -3, 8, 11, 3, STONE);
block(-8, 9, 0, AIR);
block(8, 9, -1, AIR);
block(-5, 11, 2, AIR);
block(5, 11, -2, AIR);

// ---------- TORSO ----------
cylinder(0, 11, 0, 4.2, 2, LEAVES);
cylinder(0, 13, 0, 5.2, 2, LEAVES);
cylinder(0, 15, 0, 6.5, 2, LEAVES);
cylinder(0, 17, 0, 7.5, 3, LEAVES);
cube(-13, 20, -4, 13, 21, 4, LEAVES);
sphere(-11, 20, 2, 3, LEAVES);
sphere(11, 20, 2, 3, LEAVES);

sphere(-4, 18, 5, 2.6, LEAVES);
sphere(4, 18, 5, 2.6, LEAVES);
line(0, 16, 6, 0, 20, 6, AIR);

for (let y = 13; y <= 17; y += 1.5) {
  line(-3, Math.round(y), 6, 3, Math.round(y), 6, AIR);
}
line(0, 12, 5, 0, 18, 5, AIR);

line(0, 11, -6, 0, 20, -8, AIR);
line(-2, 14, -6, -2, 19, -7, AIR);
line(2, 14, -6, 2, 19, -7, AIR);

sphere(-8, 15, 3, 2, LEAVES);
sphere(8, 15, 3, 2, LEAVES);

// ---------- HEAD ----------
sphere(0, 24, 1, 4, LEAVES);
cube(-3, 21, -2, 3, 23, 4, LEAVES);
cube(-4, 24, 3, 4, 25, 5, LEAVES);
line(-4, 25, 5, -1, 25, 6, AIR);
line(1, 25, 5, 4, 25, 6, AIR);
block(-2, 24, 5, AIR);
block(2, 24, 5, AIR);
block(-2, 24, 6, STONE);
block(2, 24, 6, STONE);
cube(-3, 21, 3, 3, 22, 5, LEAVES);
cube(-2, 20, 4, 2, 21, 6, AIR);
cube(-2, 20, 5, 2, 20, 5, BRICK);
block(-2, 21, 5, SNOW);
block(0, 21, 5, SNOW);
block(2, 21, 5, SNOW);
cube(-1, 23, 5, 1, 23, 6, LEAVES);
cube(-3, 26, -2, 3, 27, 1, COBBLE);
cube(-2, 27, -1, 2, 27, 0, COBBLE);
line(-3, 26, -2, -4, 25, -3, COBBLE);
line(3, 26, -2, 4, 25, -3, COBBLE);
block(-4, 23, 1, LEAVES);
block(4, 23, 1, LEAVES);

// ---------- ARMS (raised, roaring V) ----------
function buildArm(sign) {
  const shoulder = { x: sign * 11, y: 21, z: 0 };
  const elbow = { x: sign * 15, y: 25, z: -2 };
  const fist = { x: sign * 18, y: 30, z: -4 };
  thickLine(shoulder.x, shoulder.y, shoulder.z, elbow.x, elbow.y, elbow.z, 2.6, LEAVES);
  thickLine(elbow.x, elbow.y, elbow.z, fist.x, fist.y, fist.z, 2.1, LEAVES);
  sphere(fist.x, fist.y, fist.z, 2.8, LEAVES);
  block(fist.x + sign, fist.y + 1, fist.z - 1, LEAVES);
  block(fist.x + sign, fist.y + 1, fist.z + 1, LEAVES);
  block(fist.x + sign * 2, fist.y, fist.z, LEAVES);
  sphere(sign * 13, 23, -1, 2.2, LEAVES);
  line(sign * 12, 22, -2, sign * 14, 24, -3, AIR);
  line(elbow.x, elbow.y, elbow.z + 1, fist.x, fist.y - 1, fist.z + 1, AIR);
}
buildArm(-1);
buildArm(1);

sphere(-6, 21, -1, 2.4, LEAVES);
sphere(6, 21, -1, 2.4, LEAVES);
sphere(0, 22, -2, 3, LEAVES);
```
