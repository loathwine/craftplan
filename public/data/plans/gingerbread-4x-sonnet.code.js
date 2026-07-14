// gingerbread-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== Gingerbread House =====
// Front (door/windows) faces north (-Z), toward the camera.

// ---------- helpers ----------
function windowNS(cx, cy, z, glassId, frameId) {
  block(cx, cy, z, glassId);
  block(cx - 1, cy, z, glassId);
  block(cx + 1, cy, z, glassId);
  block(cx, cy - 1, z, glassId);
  block(cx, cy + 1, z, glassId);
  block(cx - 1, cy - 1, z, frameId);
  block(cx + 1, cy - 1, z, frameId);
  block(cx - 1, cy + 1, z, frameId);
  block(cx + 1, cy + 1, z, frameId);
}
function windowEW(x, cy, cz, glassId, frameId) {
  block(x, cy, cz, glassId);
  block(x, cy, cz - 1, glassId);
  block(x, cy, cz + 1, glassId);
  block(x, cy - 1, cz, glassId);
  block(x, cy + 1, cz, glassId);
  block(x, cy - 1, cz - 1, frameId);
  block(x, cy - 1, cz + 1, frameId);
  block(x, cy + 1, cz - 1, frameId);
  block(x, cy + 1, cz + 1, frameId);
}
function gingerbreadMan(cx, z, y0) {
  block(cx, y0 + 4, z, PLANKS);
  block(cx - 1, y0 + 3, z, PLANKS);
  block(cx, y0 + 3, z, PLANKS);
  block(cx + 1, y0 + 3, z, PLANKS);
  block(cx - 1, y0 + 2, z, PLANKS);
  block(cx, y0 + 2, z, BRICK);
  block(cx + 1, y0 + 2, z, PLANKS);
  block(cx - 1, y0 + 1, z, PLANKS);
  block(cx + 1, y0 + 1, z, PLANKS);
  block(cx - 1, y0, z, SNOW);
  block(cx + 1, y0, z, SNOW);
  block(cx - 1, y0 + 4, z, ICE);
  block(cx + 1, y0 + 4, z, ICE);
}
function lollipopTree(cx, cz, groundY, topId) {
  cylinder(cx, groundY, cz, 0, 3, OAK_LOG);
  sphere(cx, groundY + 4, cz, 2, topId);
}

// ---------- ground dusting ----------
disk(-7, -2, -6, 3, SNOW);
disk(7, -2, -6, 3, SNOW);
disk(-7, -2, 12, 3, SNOW);
disk(7, -2, 12, 3, SNOW);
disk(0, -2, 0, 2, SNOW);

// ---------- floor ----------
cube(-4, 0, 0, 4, 0, 8, PLANKS);

// ---------- walls (gingerbread shell) ----------
hollowCube(-4, 1, 0, 4, 5, 8, PLANKS);

// carve interior air so it's hollow inside
cube(-3, 1, 1, 3, 4, 7, AIR);

// ---------- door ----------
cube(0, 1, 0, 0, 3, 0, AIR);
line(-1, 1, 0, -1, 4, 0, BRICK);
line(1, 1, 0, 1, 4, 0, BRICK);
line(-1, 4, 0, 1, 4, 0, BRICK);
block(0, 5, 0, BRICK);

// ---------- front windows ----------
windowNS(-2, 3, 0, GLASS, BRICK);
windowNS(2, 3, 0, GLASS, BRICK);

// ---------- side windows ----------
windowEW(-4, 3, 4, GLASS, BRICK);
windowEW(4, 3, 4, GLASS, BRICK);

// ---------- back window ----------
windowNS(0, 3, 8, GLASS, BRICK);

// ---------- roof (tapering gable, icing white) ----------
cube(-5, 6, -1, 5, 6, 9, SNOW);
cube(-4, 7, -1, 4, 7, 9, SNOW);
cube(-3, 8, -1, 3, 8, 9, SNOW);
cube(-2, 9, -1, 2, 9, 9, SNOW);
cube(-1, 10, -1, 1, 10, 9, SNOW);
cube(0, 11, -1, 0, 11, 9, SNOW);

// icing drips along eaves
for (let z = -1; z <= 9; z += 2) {
  block(-5, 5, z, SNOW);
  block(5, 5, z, SNOW);
}
for (let x = -5; x <= 5; x += 2) {
  block(x, 5, -1, SNOW);
  block(x, 5, 9, SNOW);
}

// candy gumdrops along ridge and eave corners
sphere(0, 12, -1, 1, BRICK);
sphere(0, 12, 3, 1, ICE);
sphere(0, 12, 9, 1, BRICK);
sphere(-5, 7, -1, 1, ICE);
sphere(5, 7, -1, 1, BRICK);
sphere(-5, 7, 9, 1, BRICK);
sphere(5, 7, 9, 1, ICE);

// candy dot trim along eave edges
for (let z = 0; z <= 8; z += 2) {
  block(-5, 6, z, z % 4 === 0 ? BRICK : ICE);
  block(5, 6, z, z % 4 === 0 ? ICE : BRICK);
}

// ---------- chimney ----------
cube(2, 5, 2, 3, 13, 3, BRICK);
cube(2, 13, 2, 3, 13, 3, AIR);
line(2, 14, 2, 3, 14, 2, SNOW);
line(2, 14, 3, 3, 14, 3, SNOW);
block(2, 14, 2, SNOW);
block(3, 14, 3, SNOW);

// ---------- candy button trim on front wall ----------
block(-3, 2, 0, BRICK);
block(3, 2, 0, BRICK);
block(-3, 4, 0, ICE);
block(3, 4, 0, ICE);

// ---------- path ----------
cube(-1, 0, -8, 1, 0, -1, SAND);

// ---------- candy cane lamp posts flanking path ----------
for (let i = 0; i < 5; i++) {
  block(-2, i, -4, i % 2 === 0 ? BRICK : SNOW);
  block(2, i, -4, i % 2 === 0 ? BRICK : SNOW);
}
sphere(-2, 5, -4, 1, ICE);
sphere(2, 5, -4, 1, ICE);

// ---------- gingerbread man guards ----------
gingerbreadMan(-5, -2, 0);
gingerbreadMan(5, -2, 0);

// ---------- lollipop trees in the yard corners ----------
lollipopTree(-7, -6, -1, LEAVES);
lollipopTree(7, -6, -1, ICE);
lollipopTree(-7, 12, -1, ICE);
lollipopTree(7, 12, -1, LEAVES);

// ---------- candy cane picket fence around the yard ----------
for (let x = -9; x <= 9; x += 2) {
  if (x >= -2 && x <= 2) continue;
  for (let y = 0; y < 3; y++) {
    block(x, y, -9, y % 2 === 0 ? BRICK : SNOW);
    block(x, y, 15, y % 2 === 0 ? SNOW : BRICK);
  }
}
for (let z = -9; z <= 15; z += 2) {
  for (let y = 0; y < 3; y++) {
    block(-9, y, z, y % 2 === 0 ? BRICK : SNOW);
    block(9, y, z, y % 2 === 0 ? SNOW : BRICK);
  }
}
