// statue-liberty-4x-opus — prompt:
// the Statue of Liberty...

// ===== The Statue of Liberty =====
// Front faces NORTH (-Z): her face, tablet and torch read toward the camera.
// Copper-patina body  -> LEAVES (green)
// Granite pedestal/fort -> STONE / COBBLE
// Golden flame          -> SAND (+ BRICK embers)

// ---------- clear the forest canopy that would clip the statue ----------
cube(-13, 1, -13, 13, 12, 13, AIR);
cube(-13, 13, -6, 13, 33, 6, AIR); // clear column for the tall figure

// ---------- island + reflecting pool (foreground) ----------
cube(-11, -2, -11, 11, -1, 11, STONE);      // island top / footing
cube(-11, -1, -14, 11, -1, -12, GLASS);     // reflecting pool to the north
cube(-12, -2, -12, 12, -2, 12, COBBLE);     // buried footing course

// ---------- star-fort rampart (Fort Wood) around the base ----------
function rampart(y) {
  cube(-11, y, -11, 11, y, -11, COBBLE); // north
  cube(-11, y,  11, 11, y,  11, COBBLE); // south
  cube(-11, y, -10,-11, y,  10, COBBLE); // west
  cube( 11, y, -10, 11, y,  10, COBBLE); // east
}
rampart(0);
rampart(1);
// corner bastions
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  const bx = 10 * sx, bz = 10 * sz;
  cube(bx - 1, 0, bz - 1, bx + 1, 2, bz + 1, STONE);
  block(bx, 3, bz, COBBLE);
}
// entrance stair on the north (front)
cube(-2, 0, -12, 2, 0, -11, STONE);
cube(-2, 1, -11, 2, 1, -9, STONE);

// ---------- grand pedestal (11x11, y = 2..11) ----------
cube(-5, 2, -5, 5, 11, 5, STONE);
// cobble base plinth
cube(-6, 2, -6, 6, 3, 6, COBBLE);
// projecting cornice near the top
cube(-6, 10, -6, 6, 11, 6, COBBLE);
// crowning platform the statue stands on
cube(-5, 12, -5, 5, 12, 5, STONE);
cube(-6, 12, -6, 6, 12, 6, COBBLE); // balcony rim / observation deck

// pilasters on every vertical edge + face centre
function pilaster(x, z) { cube(x, 3, z, x, 10, z, COBBLE); }
for (const x of [-5, 0, 5]) { pilaster(x, -5); pilaster(x, 5); }
for (const z of [-5, 0, 5]) { pilaster(-5, z); pilaster(5, z); }

// tall arched doorway + windows carved into the north face
cube(-1, 3, -5, 1, 7, -5, AIR);
block(0, 8, -5, AIR);
for (const wy of [5, 8]) for (const wx of [-3, 3]) {
  block(wx, wy, -5, AIR);
  block(wx, wy + 1, -5, AIR);
}
// balustrade posts around the deck rim
for (let a = -6; a <= 6; a += 2) {
  block(a, 13, -6, STONE); block(a, 13, 6, STONE);
  block(-6, 13, a, STONE); block(6, 13, a, STONE);
}

// ================= THE STATUE (LEAVES = weathered copper) =================
// robe: tapering, flowing folds, standing on the deck
for (let y = 13; y <= 24; y++) {
  const t = (y - 13) / 11;               // 0 at hem, 1 at shoulders
  const r = Math.round(5 - 2.2 * t);     // 5 -> ~3
  // slight forward stride: body leans a touch south/east
  disk(0, y, Math.round(0.6 * t), r, LEAVES);
}
// robe hem flares out at the bottom (drapery pooling on the deck)
disk(0, 13, 0, 6, LEAVES);
disk(0, 14, 0, 5, LEAVES);

// carve vertical folds into the front of the robe for texture
for (const fx of [-3, -1, 1, 3]) {
  for (let y = 14; y <= 22; y++) {
    if ((y + fx) % 2 === 0) block(fx, y, -Math.round(5 - 2.2 * (y - 13) / 11), AIR);
  }
}
// a diagonal sash / fold sweeping across the chest
line(-3, 22, -3, 3, 19, -2, LEAVES);

// ---------- shoulders / neck / head ----------
disk(0, 24, 0, 4, LEAVES);      // shoulders
cube(-1, 25, -1, 1, 25, 1, LEAVES); // neck
sphere(0, 27, 0, 2, LEAVES);    // head

// face: carved eye sockets + brow, gazing north
block(-1, 27, -2, AIR);
block(1, 27, -2, AIR);
block(0, 26, -2, LEAVES);       // nose ridge
block(0, 25, -1, AIR);          // mouth shadow

// ---------- the seven-ray crown ----------
for (let y = 28; y <= 29; y++) hollowCylinder(0, y, 0, 3, 1, LEAVES); // crown band
const rays = 7;
for (let i = 0; i < rays; i++) {
  const ang = -Math.PI / 2 + (Math.PI * i) / (rays - 1); // -90deg..+90deg (front arc)
  const tx = Math.round(Math.cos(ang) * 4);
  const tz = Math.round(Math.sin(ang) * 4);
  line(tx > 0 ? 1 : (tx < 0 ? -1 : 0), 29, 0, tx, 31, tz, LEAVES);
  block(tx, 32, tz, LEAVES); // ray tip
}

// ---------- right arm RAISED holding the torch (east / +X, catches light) ----------
line(3, 24, 0, 4, 26, 0, LEAVES);   // shoulder -> elbow
line(4, 26, 0, 6, 30, 0, LEAVES);   // elbow -> hand (thrust skyward)
line(4, 26, 1, 6, 30, 1, LEAVES);   // arm thickness
block(4, 25, 0, LEAVES);
sphere(6, 30, 0, 1, LEAVES);        // hand / fist
// torch
cylinder(6, 31, 0, 1, 2, LEAVES);   // handle
disk(6, 33, 0, 2, SAND);            // the golden flame, splayed
sphere(6, 33, 0, 1, SAND);
block(6, 34, 0, SAND);
block(5, 33, 0, BRICK); block(7, 33, 0, BRICK); // ember glow
block(6, 33, -1, BRICK); block(6, 33, 1, BRICK);

// ---------- left arm holding the TABLET against the body (west / -X) ----------
line(-3, 24, 0, -4, 21, -1, LEAVES); // shoulder -> elbow
line(-4, 21, -1, -3, 18, -3, LEAVES);// forearm forward, cradling tablet
sphere(-3, 18, -3, 1, LEAVES);       // hand
// the tablet (July IV MDCCLXXVI) — kept as a distinct tan slab, tilted
cube(-6, 16, -4, -1, 23, -3, PLANKS);
// engraved lines on the tablet face
for (let ey = 17; ey <= 22; ey += 1) line(-6, ey, -5, -2, ey, -5, PLANKS);
for (let ey = 17; ey <= 22; ey += 2) line(-5, ey, -5, -3, ey, -5, STONE);

// ---------- robe folds cascading to the feet, front detail ----------
for (const fz of [-4, -3, 4]) line(-4, 13, fz, 4, 13, fz, LEAVES);
block(0, 12, -6, COBBLE); // small plaque on the deck rim facing the camera
block(-1, 12, -6, COBBLE);
block(1, 12, -6, COBBLE);