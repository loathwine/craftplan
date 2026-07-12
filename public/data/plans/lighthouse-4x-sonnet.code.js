// lighthouse-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ==== Lighthouse on a Cliff ====
// Front (north / -Z) = ocean. Cliff rises south (+Z) to a grassy plateau
// carrying the lighthouse and keeper's cottage.

// ---- Ocean ----
cube(-22, -3, -22, 22, -3, -10, GLASS);
// scattered sea rocks for foreground interest
sphere(-15, -3, -15, 2, STONE);
sphere(16, -3, -17, 2, STONE);
sphere(6, -3, -20, 1, STONE);
sphere(-6, -3, -19, 1, STONE);
// foam / whitecaps along the shoreline
for (let i = 0; i < 40; i++) {
  const x = Math.round(-21 + Math.random() * 42);
  const z = -11 - Math.round(Math.random() * 2);
  block(x, -3, z, SNOW);
}

// ---- Cliff terraces (front face north, receding south as it rises) ----
cube(-10, -4, -9, 10, -2, 3, STONE);   // T1 base
cube(-9, -1, -7, 9, 1, 3, COBBLE);     // T2
cube(-8, 2, -5, 8, 4, 3, STONE);       // T3
cube(-7, 5, -3, 7, 6, 5, COBBLE);      // T4 (plateau core)
cube(-7, 7, -3, 7, 7, 5, GRASS);       // grassy plateau top

// jagged rock protrusions on the exposed north cliff face
for (let i = 0; i < 18; i++) {
  const x = Math.round(-9 + Math.random() * 18);
  const y = Math.round(-3 + Math.random() * 8);
  cube(x, y, -10, x + 1, y + 1, -9, COBBLE);
}

// stairway carved into the east flank of the cliff, plateau down to shore
for (let i = 0; i < 9; i++) {
  const z = -3 - i;
  const y = 7 - i;
  cube(8, y, z, 9, y, z, COBBLE);
}

// low fence posts along the plateau's north edge
for (let x = -7; x <= 7; x += 2) {
  block(x, 8, -3, OAK_LOG);
}

// bushes for greenery
sphere(-6, 8, 4, 1, LEAVES);
sphere(6, 8, -1, 1, LEAVES);
sphere(-2, 8, 5, 1, LEAVES);

// ---- Keeper's cottage ----
hollowCube(-7, 8, 1, -3, 11, 5, COBBLE);
cube(-7, 12, 1, -3, 12, 5, PLANKS);      // roof base
cube(-6, 13, 2, -4, 13, 4, PLANKS);      // roof inset
line(-5, 14, 3, -5, 14, 3, OAK_LOG);     // ridge
block(-5, 14, 2, OAK_LOG);
block(-5, 14, 4, OAK_LOG);
// door
block(-5, 8, 1, AIR);
block(-5, 9, 1, AIR);
// windows
block(-7, 9, 3, GLASS);
block(-3, 9, 3, GLASS);
block(-5, 9, 5, GLASS);
// path from cottage to lighthouse
cube(-3, 8, 3, 1, 8, 3, COBBLE);

// ---- Lighthouse tower ----
const LX = 2, LZ = 1;
hollowCylinder(LX, 8, LZ, 4, 1, COBBLE);   // foundation ring

// section A - wide base, radius 4
hollowCylinder(LX, 9, LZ, 4, 2, SNOW);
hollowCylinder(LX, 11, LZ, 4, 2, BRICK);
hollowCylinder(LX, 13, LZ, 4, 2, SNOW);

// section B - tapered middle, radius 3
hollowCylinder(LX, 15, LZ, 3, 2, BRICK);
hollowCylinder(LX, 17, LZ, 3, 2, SNOW);
hollowCylinder(LX, 19, LZ, 3, 2, BRICK);
hollowCylinder(LX, 21, LZ, 3, 2, SNOW);

// section C - narrow top, warning stripe, radius 2
hollowCylinder(LX, 23, LZ, 2, 2, SNOW);
hollowCylinder(LX, 25, LZ, 2, 2, BRICK);

// gallery deck + railing
disk(LX, 27, LZ, 3, COBBLE);
hollowCylinder(LX, 28, LZ, 3, 1, STONE);

// lantern room
hollowCylinder(LX, 29, LZ, 2, 3, GLASS);

// domed roof + apex
disk(LX, 32, LZ, 2, BRICK);
disk(LX, 33, LZ, 1, BRICK);

// light beam sweeping out over the sea
for (let i = 0; i < 16; i++) {
  const t = i / 15;
  const x = Math.round(LX - t * 14);
  const y = Math.round(30 - t * 16);
  const z = Math.round(LZ - t * 22);
  block(x, y, z, GLASS);
  block(x + 1, y, z, GLASS);
}
```
