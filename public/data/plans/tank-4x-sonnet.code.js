// tank-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== Helpers =====
// Tube extending along Z (barrel, exhausts) — circular cross-section faces the camera
function tubeZ(cx, cy, z1, z2, radius, id) {
  const zlo = Math.min(z1, z2), zhi = Math.max(z1, z2);
  const r2 = radius * radius;
  for (let z = zlo; z <= zhi; z++) {
    for (let dx = -Math.ceil(radius); dx <= Math.ceil(radius); dx++) {
      for (let dy = -Math.ceil(radius); dy <= Math.ceil(radius); dy++) {
        if (dx * dx + dy * dy <= r2) block(cx + dx, cy + dy, z, id);
      }
    }
  }
}
// Flat disk facing the camera (circle in the X/Y plane at fixed z)
function diskXY(cx, cy, z, radius, id) {
  const r2 = radius * radius;
  for (let dx = -Math.ceil(radius); dx <= Math.ceil(radius); dx++) {
    for (let dy = -Math.ceil(radius); dy <= Math.ceil(radius); dy++) {
      if (dx * dx + dy * dy <= r2) block(cx + dx, cy + dy, z, id);
    }
  }
}
// Flat disk on a side face (circle in the Y/Z plane at fixed x) — catches light on +X side
function diskYZ(x, cy, cz, radius, id) {
  const r2 = radius * radius;
  for (let dy = -Math.ceil(radius); dy <= Math.ceil(radius); dy++) {
    for (let dz = -Math.ceil(radius); dz <= Math.ceil(radius); dz++) {
      if (dy * dy + dz * dz <= r2) block(x, cy + dy, cz + dz, id);
    }
  }
}

// ===== Tracks (treads run the length of the hull, tank faces north/-Z) =====
cube(-6, 0, -9, -5, 2, 9, 8);   // left track
cube(5, 0, -9, 6, 2, 9, 8);    // right track
// track top fenders flush with hull sides
cube(-6, 3, -9, -5, 3, 9, 3);
cube(5, 3, -9, 6, 3, 9, 3);
// front/rear sprocket + idler wheels (visible from the lit east/+X side and front)
diskYZ(6, 1, -9, 1.5, 3);
diskYZ(6, 1, 9, 1.5, 3);
diskYZ(-6, 1, -9, 1.5, 3);
diskYZ(-6, 1, 9, 1.5, 3);
// road wheels along both sides
for (let z = -6; z <= 6; z += 3) {
  diskYZ(6, 1, z, 1, 3);
  diskYZ(-6, 1, z, 1, 3);
}

// ===== Hull =====
cube(-4, 3, -7, 4, 6, 7, 3); // main armored hull box
// slope the front glacis plate down toward the viewer
cube(-4, 5, -7, 4, 6, -7, 0); // carve top layer at frontmost row
cube(-4, 6, -6, 4, 6, -6, 0); // carve top layer one row back
// rear engine deck grille texture
cube(-4, 6, 4, 4, 6, 6, 8);

// headlights on the remaining front face
block(-3, 3, -7, 11);
block(3, 3, -7, 11);
// driver periscope on the sloped glacis
block(0, 5, -6, 11);
block(-1, 5, -6, 11);
block(1, 5, -6, 11);

// storage crates on rear deck
cube(-3, 7, 4, -1, 7, 6, 7);
cube(1, 7, 4, 3, 7, 6, 7);

// exhaust pipes at the rear
cylinder(-3, 7, 6, 1, 2, 8);
cylinder(3, 7, 6, 1, 2, 8);

// tow hooks (front bumper detail)
block(-4, 3, -7, 3);
block(4, 3, -7, 3);
line(-4, 3, -8, -3, 3, -9, 3);
line(4, 3, -8, 3, 3, -9, 3);

// camo netting patches (scattered leaves for texture)
block(-3, 7, -2, 5); block(-2, 7, -2, 5); block(2, 7, 1, 5);
block(3, 7, 3, 5); block(-1, 7, 5, 5); block(1, 7, -4, 5);
block(-3, 7, 2, 5); block(2, 7, -1, 5);

// ===== Turret =====
cylinder(0, 7, -1, 4, 4, 3); // main turret drum, slightly forward on the hull
// commander cupola
cylinder(0, 11, -1, 2, 1, 3);
cube(-1, 12, -2, 1, 12, 0, 7); // hatch cover
block(-1, 12, -1, 11);
block(1, 12, -1, 11);
// periscopes around cupola
block(-2, 11, -1, 11);
block(2, 11, -1, 11);
block(0, 11, -3, 11);

// insignia cross on the turret's left cheek
block(-2, 9, -5, 12);
block(-3, 9, -5, 12);
block(-1, 9, -5, 12);
block(-2, 10, -5, 12);
block(-2, 8, -5, 12);

// antenna
line(2, 11, -1, 2, 17, -1, 3);

// secondary machine gun (turret front-right)
tubeZ(2, 8, -5, -9, 1, 8);
diskXY(2, 8, -9, 1, 8);

// ===== Main gun barrel (points north at the camera) =====
tubeZ(0, 8, -5, -7, 2, 3);   // mantlet / breech, thicker
tubeZ(0, 8, -7, -17, 1, 3);  // barrel
diskXY(0, 8, -18, 2, 3);     // muzzle brake flare
