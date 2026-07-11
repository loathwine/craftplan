// taj-mahal-4x-fable — prompt:
// the Taj Mahal...

// The Taj Mahal — white marble mausoleum on a plinth, onion dome, four minarets,
// flanking red sandstone pavilions, and a long reflecting pool running north toward the camera.

// ---- site clearing (targeted: platform footprint + pool axis) ----
cube(-15, 2, -4, 15, 18, 20, AIR);        // vegetation above the platform area
cube(-9, 1, -22, 9, 14, -4, AIR);         // tree canopy over the garden / pool axis
// leftover trunk stumps at ground level in the garden
[[8,-20],[1,-13],[-1,-10],[3,-10],[-6,-8],[-7,-5],[1,-7]].forEach(([x,z]) => block(x, 0, z, AIR));

// ---- plinth: white marble top, red sandstone skirt ----
cube(-14, 1, -3, 14, 1, 19, SNOW);
cube(-14, -1, -3, 14, 0, -3, BRICK);      // front skirt
cube(-14, -1, 19, 14, 0, 19, BRICK);      // back skirt
cube(-14, -1, -2, -14, 0, 18, BRICK);     // west skirt
cube(14, -1, -2, 14, 0, 18, BRICK);       // east skirt
// entry steps + red inlay path to the door
cube(-3, 0, -5, 3, 0, -4, SNOW);
cube(-3, 1, -4, 3, 1, -4, SNOW);
cube(-1, 1, -3, 1, 1, 0, BRICK);

// ---- main mausoleum body (15x15, walls only — interior stays dark) ----
cube(-7, 2, 1, 7, 10, 1, SNOW);           // north (front)
cube(-7, 2, 15, 7, 10, 15, SNOW);         // south
cube(-7, 2, 2, -7, 10, 14, SNOW);         // west
cube(7, 2, 2, 7, 10, 14, SNOW);           // east
cube(-7, 11, 1, 7, 11, 15, SNOW);         // roof slab
// gray base band
line(-7, 2, 1, 7, 2, 1, STONE);
line(-7, 2, 15, 7, 2, 15, STONE);
line(-7, 2, 2, -7, 2, 14, STONE);
line(7, 2, 2, 7, 2, 14, STONE);
// parapet crenellation
for (let x = -7; x <= 7; x += 2) { block(x, 12, 1, SNOW); block(x, 12, 15, SNOW); }
for (let z = 3; z <= 13; z += 2) { block(-7, 12, z, SNOW); block(7, 12, z, SNOW); }
// corner pinnacles with gilt tips
[[-7,1],[7,1],[-7,15],[7,15]].forEach(([x,z]) => {
  block(x, 12, z, SNOW); block(x, 13, z, SNOW); block(x, 14, z, SAND);
});

// ---- great iwan (front arch frame, taller than the walls) ----
cube(-3, 2, 0, 3, 12, 0, SNOW);
line(-3, 13, 0, 3, 13, 0, SNOW);
block(-3, 14, 0, SAND); block(3, 14, 0, SAND);
// dark calligraphy band around the arch
line(-2, 2, 0, -2, 8, 0, STONE);
line(2, 2, 0, 2, 8, 0, STONE);
line(-2, 9, 0, 2, 9, 0, STONE);
// carve the pointed arch opening through frame + wall
cube(-1, 2, 0, 1, 7, 1, AIR);
cube(0, 8, 0, 0, 8, 1, AIR);

// ---- facade niches / windows (AIR reads as shadowed recesses) ----
for (const x of [-5, 5]) {                 // front flanks, two stories
  cube(x, 3, 1, x, 5, 1, AIR);
  cube(x, 7, 1, x, 9, 1, AIR);
}
for (const z of [4, 8, 12]) for (const x of [-7, 7]) {   // side walls
  cube(x, 3, z, x, 5, z, AIR);
  cube(x, 7, z, x, 9, z, AIR);
}
for (const x of [-5, -2, 2, 5]) cube(x, 3, 15, x, 6, 15, AIR);  // rear niches

// ---- drum + great onion dome + gilt finial ----
cylinder(0, 12, 8, 4, 2, SNOW);
hollowCylinder(0, 12, 8, 4, 1, STONE);    // dark ring at the drum base
sphere(0, 17, 8, 5, SNOW);
disk(0, 22, 8, 2, SNOW);
disk(0, 23, 8, 1, SNOW);
block(0, 24, 8, SNOW);
line(0, 25, 8, 0, 27, 8, SAND);           // golden spire

// ---- four rooftop chhatris ----
function chhatri(cx, cz) {
  for (const dx of [-1, 1]) for (const dz of [-1, 1])
    cube(cx + dx, 12, cz + dz, cx + dx, 14, cz + dz, SNOW);
  disk(cx, 15, cz, 2, SNOW);
  disk(cx, 16, cz, 1, SNOW);
  block(cx, 17, cz, SAND);
}
chhatri(-5, 4); chhatri(5, 4); chhatri(-5, 12); chhatri(5, 12);

// ---- four minarets at the plinth corners ----
function minaret(mx, mz) {
  cube(mx - 1, 2, mz - 1, mx + 1, 3, mz + 1, SNOW);   // pedestal
  cylinder(mx, 4, mz, 1, 11, SNOW);                    // shaft y4..14
  disk(mx, 7, mz, 2, STONE);                           // balcony rings
  disk(mx, 11, mz, 2, STONE);
  disk(mx, 15, mz, 2, SNOW);                           // top gallery
  cylinder(mx, 16, mz, 1, 1, SNOW);
  disk(mx, 17, mz, 1, SNOW);                           // cupola
  block(mx, 18, mz, SAND);
}
minaret(-12, -1); minaret(12, -1); minaret(-12, 17); minaret(12, 17);

// ---- flanking red sandstone pavilions (mosque + jawab) ----
function pavilion(x1, x2) {
  const z1 = 4, z2 = 12, cx = (x1 + x2) / 2;
  cube(x1, 2, z1, x2, 6, z1, BRICK);
  cube(x1, 2, z2, x2, 6, z2, BRICK);
  cube(x1, 2, z1 + 1, x1, 6, z2 - 1, BRICK);
  cube(x2, 2, z1 + 1, x2, 6, z2 - 1, BRICK);
  cube(x1, 7, z1, x2, 7, z2, BRICK);                   // roof
  disk(cx, 8, 8, 2, SNOW);                             // white marble dome
  disk(cx, 9, 8, 1, SNOW);
  block(cx, 10, 8, SAND);
  [[x1, z1], [x2, z1], [x1, z2], [x2, z2]].forEach(([x, z]) => block(x, 8, z, SNOW));
  cube(cx, 2, z1, cx, 4, z1, AIR);                     // north-facing arch door
  cube(cx - 2, 3, z1, cx - 2, 4, z1, AIR);             // side niches
  cube(cx + 2, 3, z1, cx + 2, 4, z1, AIR);
}
pavilion(-14, -10); pavilion(10, 14);

// ---- reflecting pool running north toward the camera ----
cube(-2, -1, -21, 2, 0, -6, SAND);        // raised sandstone basin (fills terrain dips)
cube(-1, 0, -20, 1, 0, -7, GLASS);        // water
// cypress rows flanking the pool
for (const x of [-5, 5]) for (const z of [-18, -14, -10, -6]) {
  cube(x, -1, z, x, 3, z, LEAVES);
  block(x, 4, z, LEAVES);
}