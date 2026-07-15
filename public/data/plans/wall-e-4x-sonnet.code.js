// wall-e-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
function diskZ(cx, cy, cz, r, id) {
  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      if (dx * dx + dy * dy <= r * r + 0.4) {
        block(cx + dx, cy + dy, cz, id);
      }
    }
  }
}

// --- clear build footprint of trees/leaves ---
cube(-9, 0, -8, 9, 21, 6, AIR);

// ================= TRACKS (treads) =================
cube(-7, 0, -5, -4, 4, 5, STONE);
cube(4, 0, -5, 7, 4, 5, STONE);

// chamfer top corners for a rounded tread look
for (const cx of [-7, -4, 4, 7]) {
  for (const cz of [-5, 5]) {
    block(cx, 4, cz, AIR);
  }
}

// tread lug ridges
for (let z = -5; z <= 5; z += 2) {
  cube(-7, 4, z, -4, 4, z, COBBLE);
  cube(4, 4, z, 7, 4, z, COBBLE);
}

// wheel hub bumps (side detail)
for (const z of [-3, 0, 3]) {
  sphere(-7, 2, z, 1, COBBLE);
  sphere(7, 2, z, 1, COBBLE);
}

// ================= CHASSIS BASE =================
cube(-4, 4, -5, 4, 5, 5, COBBLE);
hollowCube(-4, 4, -5, 4, 5, 5, STONE);

// ================= TORSO =================
cube(-4, 5, -3, 4, 11, 3, COBBLE);

// rust streaks / worn texture
line(-3, 6, -3, -3, 9, -3, DIRT);
line(3, 6, 3, 3, 9, 3, DIRT);
block(2, 6, -3, DIRT);
block(-2, 9, 3, DIRT);
block(1, 5, -3, DIRT);

// recessed front compartment door
cube(-1, 7, -3, 1, 9, -3, AIR);
cube(-1, 7, -2, 1, 9, -2, PLANKS);
hollowCube(-1, 7, -2, 1, 9, -2, STONE);

// horizontal groove / vent line
line(-4, 10, -3, -4, 10, 3, STONE);
line(4, 10, -3, 4, 10, 3, STONE);

// side vents
line(-4, 6, -1, -4, 8, -1, STONE);
line(4, 6, -1, 4, 8, -1, STONE);

// ================= COLLAR / SHOULDERS =================
cube(-3, 11, -2, 3, 13, 2, COBBLE);
hollowCube(-3, 13, -2, 3, 13, 2, STONE);

// ================= SOLAR PANEL =================
cube(-4, 13, -2, 4, 13, 3, PLANKS);
hollowCube(-4, 13, -2, 4, 13, 3, COBBLE);
cube(-4, 14, 2, 4, 14, 3, PLANKS);
line(-4, 14, 3, -4, 13, 3, COBBLE);
line(4, 14, 3, 4, 13, 3, COBBLE);

// ================= NECK (accordion) =================
cylinder(0, 14, -1, 2, 1, STONE);
cylinder(0, 15, -1, 1, 1, COBBLE);
cylinder(0, 16, -1, 2, 1, STONE);

// ================= HEAD BAR =================
cube(-3, 17, -2, 3, 17, 0, COBBLE);
hollowCube(-3, 17, -2, 3, 17, 0, STONE);

// ================= BINOCULAR EYES =================
for (const cx of [-2, 2]) {
  diskZ(cx, 18, -2, 2, COBBLE);
  diskZ(cx, 18, -3, 2, COBBLE);
  diskZ(cx, 18, -4, 2, COBBLE);
  diskZ(cx, 18, -5, 1, STONE);
  block(cx, 18, -6, STONE);
}

// ================= ARMS =================
// left arm
sphere(-5, 9, -1, 1, COBBLE);
line(-5, 9, -1, -6, 7, -1, STONE);
line(-6, 7, -1, -6, 5, -1, STONE);
block(-6, 4, -2, STONE);
block(-6, 4, -1, STONE);
block(-6, 4, 0, STONE);

// right arm
sphere(5, 9, -1, 1, COBBLE);
line(5, 9, -1, 6, 7, -1, STONE);
line(6, 7, -1, 6, 5, -1, STONE);
block(6, 4, -2, STONE);
block(6, 4, -1, STONE);
block(6, 4, 0, STONE);

// ================= FOREGROUND PROP: boot with plant sprout =================
cube(5, 0, -6, 6, 0, -5, OAK_LOG);
cube(5, 1, -6, 5, 2, -6, OAK_LOG);
block(6, 1, -5, OAK_LOG);
block(5, 3, -6, OAK_LOG);
block(5, 4, -6, LEAVES);
block(4, 4, -6, LEAVES);
block(6, 4, -6, LEAVES);
block(5, 5, -6, LEAVES);
```
