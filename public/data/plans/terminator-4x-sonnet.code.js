// terminator-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===================== GROUND / CRATER =====================
disk(0, -1, 0, 11, COBBLE);
hollowCylinder(0, -1, 0, 11, 1, STONE);
hollowCylinder(0, -2, 0, 9, 1, AIR);   // shallow blast trench
hollowCylinder(0, -2, 0, 6, 1, AIR);

// scorch embers near feet
block(-2, 0, 3, BRICK);
block(2, 0, 3, BRICK);
block(0, 0, 5, BRICK);
block(-4, 0, 1, BRICK);
block(4, 0, 1, BRICK);
block(-1, 0, 4, BRICK);
block(1, 0, 6, BRICK);

// ===================== LEGS =====================
const legX = [-3, 3];
for (const hx of legX) {
  cube(hx - 1, 0, -1, hx + 1, 0, 4, COBBLE);   // foot plate
  block(hx, 1, 4, STONE);                      // toe tip
  cylinder(hx, 1, 1, 1, 6, STONE);             // shin
  line(hx - 2, 2, 1, hx - 2, 5, 1, COBBLE);    // hydraulic piston (outer)
  sphere(hx, 7, 1, 1.2, COBBLE);               // knee joint
  cylinder(hx, 8, 1, 1.4, 5, STONE);           // thigh
  line(hx + 2, 8, 1, hx + 2, 12, 1, COBBLE);   // hydraulic piston (outer)
  sphere(hx, 13, 1, 1.6, COBBLE);              // hip joint
}

// ===================== PELVIS =====================
cube(-4, 12, -2, 4, 15, 3, STONE);
cube(-3, 13, -1, 3, 14, 2, AIR);               // hollow interior
hollowCube(-4, 12, -2, 4, 15, 3, COBBLE);

// ===================== RIBCAGE / TORSO CAGE =====================
let halfXs = [], halfZs = [];
for (let y = 16; y <= 23; y++) {
  const t = (y - 16) / 7;
  const halfX = Math.round(3 + t * 2);
  const halfZ = Math.round(2 + t * 1);
  halfXs.push(halfX); halfZs.push(halfZ);
  hollowCube(-halfX, y, -halfZ, halfX, y, halfZ, STONE);
  if (y % 2 === 0) {
    block(-halfX, y, 0, BRICK);   // status LED accents
    block(halfX, y, 0, BRICK);
  }
}
// spine + side struts (cage rigidity)
line(0, 15, 2, 0, 24, 3, COBBLE);
line(-3, 15, -2, -5, 24, 0, COBBLE);
line(3, 15, -2, 5, 24, 0, COBBLE);
// hanging cables
line(-4, 20, 1, -3, 16, 2, OAK_LOG);
line(4, 19, 1, 5, 15, 2, OAK_LOG);

// ===================== SHOULDERS / NECK / HEAD =====================
sphere(-5, 24, 0, 1.6, COBBLE);
sphere(5, 24, 0, 1.6, COBBLE);
cylinder(0, 24, 0, 1.3, 2, STONE);    // neck
sphere(0, 27, 0, 2.4, COBBLE);        // skull
hollowSphere(0, 27, 0, 2.5, STONE);   // cranium plating seam
cube(-1, 25, -2, 1, 26, 0, STONE);    // jaw
block(-1, 25, -2, SNOW);              // exposed metal teeth
block(0, 25, -2, SNOW);
block(1, 25, -2, SNOW);
cube(-2, 27, -3, -1, 27, -2, STONE);  // brow ridge
cube(1, 27, -3, 2, 27, -2, STONE);
block(-1, 27, -3, BRICK);             // left eye glow
block(1, 27, -3, BRICK);              // right eye glow
block(-1, 27, -4, BRICK);             // eye beam glint
block(1, 27, -4, BRICK);

// ===================== LEFT ARM (relaxed, hanging) =====================
cylinder(-5, 18, 0, 1, 6, STONE);     // upper arm
sphere(-5, 18, 0, 1.2, COBBLE);       // elbow
cylinder(-5, 13, 0, 0.9, 5, STONE);   // forearm
sphere(-5, 13, 0, 1.0, COBBLE);       // wrist
line(-5, 13, 0, -6, 10, 1, STONE);    // fingers
line(-5, 13, 0, -5, 10, 1, STONE);
line(-5, 13, 0, -4, 10, 1, STONE);

// ===================== RIGHT ARM (raised, aiming shotgun) =====================
cube(4, 21, -3, 6, 23, -1, STONE);    // upper arm bent forward
sphere(5, 21, -2, 1.2, COBBLE);       // elbow
cube(4, 19, -6, 6, 21, -3, STONE);    // forearm forward
cube(4, 19, -7, 6, 20, -6, COBBLE);   // hand/grip
block(4, 20, -7, COBBLE);             // knuckle detail
block(6, 20, -7, COBBLE);

// Shotgun
cube(4, 19, -8, 5, 20, -6, OAK_LOG);    // stock
cube(4, 19, -14, 5, 20, -8, COBBLE);    // barrel
block(4, 19, -14, STONE);               // muzzle
block(5, 19, -14, STONE);

// ===================== BROKEN WALL BACKDROP =====================
const wallHeights = [];
for (let x = -10; x <= 10; x++) {
  wallHeights.push(3 + Math.abs(Math.round(3 * Math.sin(x * 0.7))));
}
for (let i = 0; i < wallHeights.length; i++) {
  const x = -10 + i;
  const h = wallHeights[i];
  cube(x, -1, -16, x, h, -14, BRICK);
  if (i % 3 === 0) {
    line(x, h, -15, x, h + 2, -15, STONE);   // bent rebar
  }
  if (i % 4 === 1 && h > 4) {
    cube(x, 1, -16, x, 2, -14, AIR);         // window hole
  }
}

// ===================== SIDE DEBRIS PILE (wrecked vehicle) =====================
cube(12, 0, -4, 16, 1, -1, STONE);
cube(13, 1, -3, 15, 2, -2, COBBLE);
hollowCylinder(17, 0, 3, 2, 1, STONE);   // wrecked wheel rim
block(17, 1, 3, COBBLE);
cube(16, 0, 0, 18, 1, 4, COBBLE);
block(17, 1, 2, BRICK);
block(14, 1, -3, BRICK);

// ===================== FALLEN SECOND ENDOSKELETON (half-buried) =====================
sphere(15, 0, 9, 1.1, COBBLE);          // skull, lying at ground level
block(15, 0, 8, BRICK);                 // single glowing eye
cylinder(15, 0, 10, 0.8, 4, STONE);     // fallen torso, lying flat (spine axis)
line(14, 0, 10, 13, 0, 9, STONE);       // outstretched arm
line(16, 0, 10, 17, 0, 9, STONE);
sphere(15, 0, 13, 1.0, COBBLE);         // pelvis remnant
line(14, 0, 14, 13, 0, 16, STONE);      // broken leg
line(16, 0, 14, 17, 0, 16, STONE);
cube(13, 0, 7, 18, 1, 15, COBBLE);      // rubble mound partially covering it
cube(14, 1, 9, 17, 1, 13, STONE);

// scattered small rubble across crater floor
const rubble = [
  [-8, 0, 6, 1], [7, 0, -6, 1], [-6, 0, -8, 1], [9, 0, 8, 1],
  [-9, 0, -3, 1], [3, 0, 9, 1], [-3, 0, 8, 1], [8, 0, 3, 1]
];
for (const [rx, ry, rz, s] of rubble) {
  cube(rx, ry, rz, rx + s, ry, rz + s, COBBLE);
}
```
