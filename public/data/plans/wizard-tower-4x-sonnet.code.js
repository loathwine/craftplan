// wizard-tower-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
const CX = 0, CZ = 2, R = 5;
const deg = d => d * Math.PI / 180;

// ---------- Ground plinth ----------
cylinder(CX, -1, CZ, 6, 1, STONE);
hollowCylinder(CX, -1, CZ, 7, 1, COBBLE);

// ---------- Main tower shaft ----------
hollowCylinder(CX, 0, CZ, R, 21, COBBLE);          // y0..20
hollowCylinder(CX, 5, CZ, R, 1, STONE);            // trim bands
hollowCylinder(CX, 10, CZ, R, 1, STONE);
hollowCylinder(CX, 15, CZ, R, 1, STONE);

// buttress ribs (offset from window angles so they don't plug windows)
for (let a = 22.5; a < 360; a += 45) {
  const dx = Math.round(R * Math.sin(deg(a)));
  const dz = Math.round(-R * Math.cos(deg(a)));
  line(CX + dx, 0, CZ + dz, CX + dx, 19, CZ + dz, STONE);
}

// ---------- Windows (carved through the shell) ----------
const windowAngles = [0, 45, 90, 135, 180, 225, 270, 315];
for (const a of windowAngles) {
  const dx = Math.round(R * Math.sin(deg(a)));
  const dz = Math.round(-R * Math.cos(deg(a)));
  if (a !== 0) { // skip north band that overlaps the door
    cube(CX + dx - 1, 3, CZ + dz - 1, CX + dx + 1, 4, CZ + dz + 1, AIR);
  }
  cube(CX + dx - 1, 13, CZ + dz - 1, CX + dx + 1, 14, CZ + dz + 1, AIR);
  // small glass pane in each window
  block(CX + dx, 3, CZ + dz, GLASS);
  block(CX + dx, 13, CZ + dz, GLASS);
}

// ---------- Door (north face, faces the camera) ----------
cube(-1, 0, -4, 1, 3, -1, AIR);
cube(-1, 0, -3, 1, 2, -3, PLANKS);
cube(-1, 3, -3, 1, 3, -3, STONE);      // lintel
block(-2, 3, -3, STONE); block(2, 3, -3, STONE); // corner caps
block(-2, 2, -4, OAK_LOG); block(2, 2, -4, OAK_LOG); // door frame posts

// steps / path to the door
cube(-1, -1, -14, 1, -1, -4, COBBLE);
cube(-2, -1, -14, -2, -1, -4, STONE);
cube(2, -1, -14, 2, -1, -4, STONE);

// braziers flanking the door
cube(-3, 0, -4, -3, 2, -4, STONE);
block(-3, 3, -4, BRICK);
cube(3, 0, -4, 3, 2, -4, STONE);
block(3, 3, -4, BRICK);

// ---------- Balconies ----------
hollowCylinder(CX, 10, CZ, 6, 1, PLANKS);
hollowCylinder(CX, 17, CZ, 6, 1, PLANKS);
for (let a = 0; a < 360; a += 45) {
  const dx = Math.round(6 * Math.sin(deg(a)));
  const dz = Math.round(-6 * Math.cos(deg(a)));
  block(CX + dx, 11, CZ + dz, STONE);
  block(CX + dx, 18, CZ + dz, STONE);
  // support brackets
  const dx5 = Math.round(5 * Math.sin(deg(a)));
  const dz5 = Math.round(-5 * Math.cos(deg(a)));
  block(CX + dx5, 9, CZ + dz5, OAK_LOG);
  block(CX + dx5, 16, CZ + dz5, OAK_LOG);
}

// ---------- Floating arcane rings ----------
hollowCylinder(CX, 15, CZ, 8, 1, GLASS);
hollowCylinder(CX, 19, CZ, 7, 1, GLASS);

// ---------- Cap / crenellations ----------
disk(CX, 21, CZ, 5, STONE);
for (let a = 0; a < 360; a += 30) {
  const dx = Math.round(5 * Math.sin(deg(a)));
  const dz = Math.round(-5 * Math.cos(deg(a)));
  block(CX + dx, 22, CZ + dz, STONE);
}
// gargoyles on the diagonal corners
for (const a of [45, 135, 225, 315]) {
  const dx = Math.round(6 * Math.sin(deg(a)));
  const dz = Math.round(-6 * Math.cos(deg(a)));
  block(CX + dx, 20, CZ + dz, STONE);
  block(CX + dx, 19, CZ + dz, COBBLE);
}

// ---------- Conical roof ----------
disk(CX, 22, CZ, 5, BRICK);
disk(CX, 23, CZ, 4, BRICK);
disk(CX, 24, CZ, 3, BRICK);
disk(CX, 25, CZ, 2, BRICK);
disk(CX, 26, CZ, 1, BRICK);
disk(CX, 27, CZ, 0, BRICK);

// ---------- Spire + magic orb ----------
cylinder(CX, 28, CZ, 0, 4, OAK_LOG);
hollowCylinder(CX, 31, CZ, 1, 1, STONE);
sphere(CX, 33, CZ, 1, GLASS);

// ================= Side turret (asymmetric second structure) =================
const TX = 7, TZ = 7, TR = 2;
hollowCylinder(TX, 0, TZ, TR, 15, COBBLE);
hollowCylinder(TX, 5, TZ, TR, 1, STONE);
hollowCylinder(TX, 10, TZ, TR, 1, STONE);
// windows
for (const a of [0, 90, 180, 270]) {
  const dx = Math.round(TR * Math.sin(deg(a)));
  const dz = Math.round(-TR * Math.cos(deg(a)));
  cube(TX + dx - 1, 4, TZ + dz - 1, TX + dx + 1, 5, TZ + dz + 1, AIR);
  cube(TX + dx - 1, 9, TZ + dz - 1, TX + dx + 1, 10, TZ + dz + 1, AIR);
}
disk(TX, 15, TZ, TR, STONE);
disk(TX, 16, TZ, TR, BRICK);
disk(TX, 17, TZ, 1, BRICK);
disk(TX, 18, TZ, 0, BRICK);
cylinder(TX, 19, TZ, 0, 2, OAK_LOG);
sphere(TX, 21, TZ, 1, GLASS);

// connecting garden wall segment between the two towers
line(3, 0, 5, 6, 0, 6, STONE);
line(3, 1, 5, 6, 1, 6, STONE);

// ================= Courtyard perimeter wall (south half only, keeps north view open) =================
for (let a = 95; a <= 265; a += 10) {
  const dx = Math.round(12 * Math.sin(deg(a)));
  const dz = Math.round(-12 * Math.cos(deg(a)));
  cube(CX + dx, 0, CZ + dz, CX + dx, 1, CZ + dz, STONE);
}
for (let a = 95; a <= 265; a += 30) {
  const dx = Math.round(12 * Math.sin(deg(a)));
  const dz = Math.round(-12 * Math.cos(deg(a)));
  block(CX + dx, 2, CZ + dz, STONE);
}

// ================= Flanking trees =================
function tree(x, z) {
  cylinder(x, 0, z, 0, 4, OAK_LOG);
  sphere(x, 5, z, 2, LEAVES);
}
tree(-9, -8);
tree(9, -8);
tree(-14, 4);
tree(13, 3);

// ================= Small fountain feature =================
hollowCylinder(-8, -1, -10, 2, 1, STONE);
disk(-8, -1, -10, 1, GLASS);
block(-8, 0, -10, STONE);
block(-8, 1, -10, GLASS);
```
