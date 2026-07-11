// statue-liberty-4x-fable — prompt:
// the Statue of Liberty...

// Statue of Liberty — facing north (-Z), torch arm raised to the east
const cu = ICE; // weathered-copper patina

// ---------- clear forest around footprint + camera corridor ----------
cube(-14, 1, -14, 14, 8, 14, AIR);
cube(-12, 1, -22, 12, 8, -15, AIR);

// ---------- Liberty Island: water ring + star-fort platform ----------
function diamond(y, r, id, hollow) {
  for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) {
    const d = Math.abs(x) + Math.abs(z);
    if (hollow ? (d === r || d === r - 1) : d <= r) block(x, y, z, id);
  }
}
for (let x = -18; x <= 18; x++) for (let z = -18; z <= 18; z++) {
  const d = Math.abs(x) + Math.abs(z);
  if (d >= 15 && d <= 17) block(x, 0, z, GLASS);
}
diamond(-1, 14, STONE, false);      // foundation
diamond(0, 14, STONE, false);       // platform
diamond(1, 14, COBBLE, true);       // fort rampart
diamond(2, 14, COBBLE, true);
// bastion posts on east/west/south star points (north point becomes the gate)
for (const [bx, bz] of [[14, 0], [-14, 0], [0, 14]]) {
  cube(bx, 1, bz, bx, 3, bz, COBBLE);
  block(bx, 4, bz, SNOW);
}
// north gate through the rampart + approach path
cube(-1, 1, -15, 1, 3, -11, AIR);
cube(-1, 0, -14, 1, 0, -7, PLANKS);
// island trees
for (const [tx, tz] of [[9, -3], [-9, -3], [4, 8], [-4, 8]]) {
  cube(tx, 1, tz, tx, 3, tz, OAK_LOG);
  sphere(tx, 4, tz, 1, LEAVES);
}

// ---------- pedestal ----------
// tier 1
cube(-6, 1, -6, 6, 4, 6, STONE);
for (const [cx, cz] of [[-6, -6], [6, -6], [-6, 6], [6, 6]]) cube(cx, 1, cz, cx, 4, cz, COBBLE);
// arched north entrance with brick surround
cube(-1, 1, -6, 1, 3, -5, AIR);
block(0, 4, -6, AIR);
cube(-2, 1, -6, -2, 4, -6, BRICK);
cube(2, 1, -6, 2, 4, -6, BRICK);
cube(-1, 4, -6, 1, 4, -6, BRICK);
// side windows
cube(-6, 2, -1, -5, 3, 1, AIR);
cube(5, 2, -1, 6, 3, 1, AIR);
// tier 2
cube(-5, 5, -5, 5, 8, 5, COBBLE);
for (const [cx, cz] of [[-5, -5], [5, -5], [-5, 5], [5, 5]]) cube(cx, 5, cz, cx, 8, cz, BRICK);
for (const wx of [-3, 0, 3]) {
  cube(wx, 6, -5, wx, 7, -5, AIR);              // north slits
  cube(-5, 6, wx, -5, 7, wx, AIR);              // west
  cube(5, 6, wx, 5, 7, wx, AIR);                // east
}
// cornice with brick rim
cube(-6, 9, -6, 6, 9, 6, STONE);
hollowCube(-6, 9, -6, 6, 9, 6, BRICK);
// open colonnade gallery
cube(-2, 10, -2, 2, 11, 2, STONE);
for (const i of [-4, -2, 0, 2, 4]) {
  cube(i, 10, -4, i, 11, -4, COBBLE);
  cube(i, 10, 4, i, 11, 4, COBBLE);
  cube(-4, 10, i, -4, 11, i, COBBLE);
  cube(4, 10, i, 4, 11, i, COBBLE);
}
// top slab
cube(-5, 12, -5, 5, 12, 5, STONE);
hollowCube(-5, 12, -5, 5, 12, 5, BRICK);

// ---------- the statue ----------
// robe: flared hem tapering upward
disk(0, 13, 0, 4, cu);
cylinder(0, 14, 0, 3, 4, cu);
cylinder(0, 18, 0, 2, 4, cu);
// drape folds bulging past the cylinder
for (const [fx, fz] of [[3, -2], [-3, -2], [3, 2], [-3, 2]]) cube(fx, 14, fz, fx, 17, fz, cu);
cube(0, 14, -4, 0, 16, -4, cu);   // front drape
cube(0, 14, 4, 0, 16, 4, cu);     // back drape
// broken chain at her feet
block(1, 14, -3, COBBLE); block(2, 14, -3, COBBLE); block(3, 14, -1, COBBLE);
// torso + chest robe
cube(-2, 22, -1, 2, 24, 1, cu);
cube(-1, 18, -2, 1, 21, -2, cu);
cube(-1, 18, 2, 1, 21, 2, cu);
cube(-3, 24, -1, 3, 24, 1, cu);   // shoulders
// head with face toward north
sphere(0, 27, 0, 2, cu);
cube(-1, 26, -2, 1, 28, -2, cu);  // flat face plate
block(-1, 27, -2, GLASS);         // eyes
block(1, 27, -2, GLASS);
block(0, 26, -3, cu);             // nose
// crown band + 7 rays fanned toward the camera
hollowCylinder(0, 28, 0, 2, 1, cu);
for (let k = 0; k < 7; k++) {
  const a = (-90 + 30 * k) * Math.PI / 180;
  const dx = Math.sin(a), dz = -Math.cos(a);
  line(Math.round(2 * dx), 29, Math.round(2 * dz),
       Math.round(4 * dx), 32, Math.round(4 * dz), cu);
}
// right arm (east) raised with the torch
line(2, 24, 0, 5, 27, 0, cu);
line(2, 25, 0, 5, 28, 0, cu);
cube(5, 27, -1, 6, 30, 0, cu);    // vertical forearm + hand
block(6, 31, 0, OAK_LOG);         // handle... replaced below center by balcony
disk(6, 31, 0, 1, SAND);          // torch balcony
disk(6, 32, 0, 1, SAND);          // flame body
block(6, 33, 0, SAND);            // flame tip
// left arm (west) cradling the tablet
line(-2, 24, 0, -5, 21, -1, cu);
line(-2, 23, 0, -4, 20, -1, cu);
// tablet: brick-framed stone slab
hollowCube(-6, 18, -2, -4, 23, -2, BRICK);
cube(-5, 19, -2, -5, 22, -2, STONE);