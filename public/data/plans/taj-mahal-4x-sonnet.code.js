// taj-mahal-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// clear the build footprint
cube(-13, -3, -18, 13, 27, 19, AIR);

// ===== PLINTH =====
cube(-11, -1, -3, 11, -1, 17, SNOW);

// ===== MAIN MAUSOLEUM BOX =====
cube(-7, 0, 1, 7, 12, 1, SNOW);   // front wall
cube(-7, 0, 15, 7, 12, 15, SNOW); // back wall
cube(-7, 0, 1, -7, 12, 15, SNOW); // left wall
cube(7, 0, 1, 7, 12, 15, SNOW);   // right wall
cube(-7, 12, 1, 7, 12, 15, SNOW); // roof cap

// corner pilasters
line(-7, 0, 1, -7, 12, 1, STONE);
line(7, 0, 1, 7, 12, 1, STONE);
line(-7, 0, 15, -7, 12, 15, STONE);
line(7, 0, 15, 7, 12, 15, STONE);

// roofline trim band
line(-7, 11, 1, 7, 11, 1, STONE);
line(-7, 11, 15, 7, 11, 15, STONE);
line(-7, 11, 1, -7, 11, 15, STONE);
line(7, 11, 1, 7, 11, 15, STONE);

// windows / blind niches (free carving, adds detail)
cube(-6, 3, 1, -5, 7, 1, AIR);
cube(5, 3, 1, 6, 7, 1, AIR);
cube(-6, 3, 15, -5, 7, 15, AIR);
cube(5, 3, 15, 6, 7, 15, AIR);
cube(-7, 3, 5, -7, 7, 6, AIR);
cube(-7, 3, 10, -7, 7, 11, AIR);
cube(7, 3, 5, 7, 7, 6, AIR);
cube(7, 3, 10, 7, 7, 11, AIR);

// ===== GRAND IWAN (front entrance frontispiece) =====
cube(-4, 0, -1, 4, 10, -1, SNOW);  // front face
cube(-4, 0, -1, -4, 10, 1, SNOW);  // left return
cube(4, 0, -1, 4, 10, 1, SNOW);    // right return
cube(-4, 10, -1, 4, 10, 1, SNOW);  // top lintel

// pointed arch opening punched through frame + wall
cube(-2, 0, -2, 2, 2, 2, AIR);
cube(-2, 3, -2, 2, 4, 2, AIR);
cube(-1, 5, -2, 1, 6, 2, AIR);
cube(0, 7, -2, 0, 7, 2, AIR);
// dark recessed doorway accent at back of niche
cube(-1, 0, 2, 1, 4, 2, COBBLE);
line(-2, 7, -1, 2, 7, -1, STONE);

// small blind arch niches flanking the iwan
cube(-6, 2, 0, -5, 8, 0, AIR);
cube(5, 2, 0, 6, 8, 0, AIR);
line(-6, 8, -1, -5, 8, -1, STONE);
line(5, 8, -1, 6, 8, -1, STONE);

// ===== DOME =====
cylinder(0, 13, 8, 5, 3, SNOW);   // drum
sphere(0, 20, 8, 5, SNOW);        // main dome
line(0, 25, 8, 0, 28, 8, STONE);  // finial spire
sphere(0, 29, 8, 1, STONE);       // finial ball

// ===== ROOF CHATTRIS (corner kiosks) =====
function chattri(cx, baseY, cz, r) {
  cylinder(cx, baseY, cz, r, 2, SNOW);
  sphere(cx, baseY + 3, cz, r, SNOW);
}
chattri(-5, 13, 4, 2);
chattri(5, 13, 4, 2);
chattri(-5, 13, 12, 2);
chattri(5, 13, 12, 2);

// ===== MINARETS =====
function minaret(cx, cz, h) {
  cylinder(cx, 0, cz, 2, h, SNOW);
  disk(cx, Math.floor(h * 0.4), cz, 3, SNOW);
  disk(cx, Math.floor(h * 0.75), cz, 3, SNOW);
  cylinder(cx, h, cz, 2, 2, SNOW);
  sphere(cx, h + 3, cz, 2, SNOW);
  line(cx, h + 5, cz, cx, h + 7, cz, STONE);
  sphere(cx, h + 8, cz, 1, STONE);
}
minaret(-9, -1, 16);
minaret(9, -1, 16);
minaret(-9, 15, 16);
minaret(9, 15, 16);

// ===== REFLECTING POOL =====
cube(-5, -1, -13, 5, -1, -5, GLASS);
line(-6, -1, -13, -6, -1, -5, STONE);
line(6, -1, -13, 6, -1, -5, STONE);
line(-6, -1, -13, 6, -1, -13, STONE);
line(-6, -1, -5, 6, -1, -5, STONE);

// path from pool to iwan
cube(-2, -1, -4, 2, -1, -2, SAND);

// garden cypress accents at pool corners
function cypress(x, z, h) {
  line(x, 0, z, x, h, z, OAK_LOG);
  sphere(x, h + 1, z, 2, LEAVES);
}
cypress(-6, -12, 4);
cypress(6, -12, 4);
cypress(-6, -6, 4);
cypress(6, -6, 4);
