// eagle-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
sphere(0, 13, 2, 6, OAK_LOG);              // main body mass
sphere(0, 11, -1, 3, DIRT);                // breast shading, slightly darker underside

// feather banding on torso (three thin belts)
hollowCube(-5, 9, -2, 5, 9, 6, DIRT);
hollowCube(-6, 13, -3, 6, 13, 7, DIRT);
hollowCube(-4, 17, -1, 4, 17, 5, DIRT);

// ---------- NECK / HEAD (white, bald eagle signature) ----------
cube(-2, 14, -5, 2, 21, -2, SNOW);         // neck, connects torso to head
sphere(0, 20, -7, 4, SNOW);                // head
block(-3, 21, -9, COBBLE);
block(3, 21, -9, COBBLE);
line(-3, 22, -10, -3, 22, -8, STONE);
line(3, 22, -10, 3, 22, -8, STONE);

// ---------- BEAK (yellow, hooked) ----------
cube(-2, 19, -14, 2, 21, -11, SAND);
cube(-1, 19, -16, 1, 20, -13, SAND);
block(-1, 18, -16, SAND);
block(0, 18, -16, SAND);
block(1, 18, -16, SAND);
block(0, 17, -16, STONE);

// ---------- TAIL (white fan, spreads south) ----------
for (let zz = 8; zz <= 20; zz++) {
  const t = (zz - 8) / 12;
  const half = Math.round(2 + t * 6);
  cube(-half, 11, zz, half, 12, zz, SNOW);
}
for (let x = -6; x <= 6; x += 3) {
  if (x !== 0) {
    block(x, 11, 16, AIR);
    block(x, 11, 18, AIR);
    block(x, 11, 20, AIR);
  }
}

// ---------- WINGS ----------
function buildWing(sign, liftBoost) {
  sphere(sign * 7, 17, 1, 3, OAK_LOG);     // shoulder blend into torso

  const span = 15;
  for (let dx = 0; dx <= span; dx++) {
    const t = dx / span;
    const worldX = sign * (6 + dx);
    const y = Math.round(17 + (9 + liftBoost) * Math.sin(t * Math.PI));
    const zFront = Math.round(0 - t * 7);
    const depth = Math.max(1, Math.round(6 * (1 - t)));
    let height;
    if (t < 0.55) height = 3;
    else if (t < 0.85) height = 2;
    else height = 1;

    let color;
    if (t > 0.82) color = COBBLE;                 // dark primary tips
    else color = (dx % 4 < 2) ? OAK_LOG : DIRT;    // feather-row banding

    cube(worldX, y, zFront - depth, worldX, y + height - 1, zFront, color);
  }

  const tipX = sign * (6 + span);
  const tipY = Math.round(17 + (9 + liftBoost) * Math.sin(Math.PI));
  const tipZ = -7;
  line(tipX, tipY, tipZ, tipX + sign * 3, tipY - 2, tipZ - 3, COBBLE);
  line(tipX, tipY + 1, tipZ, tipX + sign * 3, tipY, tipZ - 4, COBBLE);
  line(tipX, tipY - 1, tipZ, tipX + sign * 2, tipY - 3, tipZ - 2, COBBLE);
}

buildWing(1, 0);
buildWing(-1, 1);

// ---------- LEGS / TALONS (reaching forward, diving pose) ----------
function buildLeg(sign) {
  const x = sign * 2;
  const z = 1;
  cylinder(x, 2, z, 1, 6, SAND);
  line(x, 2, z, x - sign * 2, 1, z - 2, COBBLE);
  line(x, 2, z, x, 1, z - 3, COBBLE);
  line(x, 2, z, x + sign * 2, 1, z - 2, COBBLE);
  line(x, 2, z, x, 1, z + 2, COBBLE);
}
buildLeg(1);
buildLeg(-1);
```
