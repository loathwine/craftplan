// monster-truck-4x-opus — prompt:
// a monster truck...

cube(-12, 0, -12, 12, 19, 11, AIR); // clear canopy/leaves from the truck volume (AIR is free)

// ---- helpers ---------------------------------------------------------
function wheel(cx, cy, cz, r) {
  const x0 = cx - 2, x1 = cx + 2;            // 5 blocks wide
  for (let x = x0; x <= x1; x++) {
    const outer = (x === x0 || x === x1);
    for (let y = cy - r; y <= cy + r; y++) {
      for (let z = cz - r; z <= cz + r; z++) {
        const d = Math.hypot(y - cy, z - cz);
        if (d > r + 0.4) continue;
        let id;
        if (d >= r - 1.3) id = COBBLE;          // chunky tread ring
        else if (outer) {
          if (d >= r - 2.6) id = STONE;         // rim
          else if (d >= 1.7) id = SNOW;         // bright hubcap
          else id = STONE;                      // center bolt
        } else id = COBBLE;                      // solid dark interior
        block(x, y, z, id);
      }
    }
  }
  // deep tread lugs poking beyond the tire
  for (let a = 0; a < 360; a += 30) {
    const yy = Math.round(cy + (r + 0.9) * Math.sin(a * Math.PI / 180));
    const zz = Math.round(cz + (r + 0.9) * Math.cos(a * Math.PI / 180));
    for (let x = x0; x <= x1; x++) block(x, yy, zz, COBBLE);
  }
}

// ---- four giant wheels ----------------------------------------------
const CY = 5, R = 5;
wheel(-9, CY, -6, R);   // front-left
wheel( 9, CY, -6, R);   // front-right
wheel(-9, CY,  7, R);   // rear-left
wheel( 9, CY,  7, R);   // rear-right

// axles (east-west) and coil shocks up to the chassis
cube(-9, CY, -6, 9, CY, -6, STONE);
cube(-9, CY,  7, 9, CY,  7, STONE);
for (const [sx, sz] of [[-6,-6],[6,-6],[-6,7],[6,7]]) {
  for (let y = CY; y <= 8; y++) block(sx, y, sz, (y % 2 ? OAK_LOG : STONE)); // coil look
}

// ---- chassis / frame -------------------------------------------------
cube(-7, 6, -6, 7, 7, 8, STONE);        // frame slab spanning the axles

// ---- hood (front, lower) --------------------------------------------
cube(-7, 7, -6, 7, 10, -1, BRICK);
cube(-6, 8, -5, 6, 9, -2, AIR);         // hollow it
cube(-7, 10, -6, 7, 10, -1, BRICK);     // solid hood lid
// yellow flame licks along the hood flanks
for (const fx of [-7, 7]) {
  block(fx, 8, -5, SAND); block(fx, 9, -5, SAND);
  block(fx, 8, -3, SAND); block(fx, 9, -2, SAND);
  block(fx, 8, -1, SAND);
}

// ---- cab (rear, taller) ---------------------------------------------
cube(-7, 7, 0, 7, 13, 8, BRICK);
cube(-6, 8, 1, 6, 12, 7, AIR);          // hollow cabin
// windshield (faces north/-Z toward the camera) and side glass
cube(-5, 9, 0, 5, 12, 0, GLASS);
cube(-7, 9, 1, -7, 12, 6, GLASS);
cube( 7, 9, 1,  7, 12, 6, GLASS);
cube(-5, 9, 8, 5, 12, 8, GLASS);        // rear window

// ---- roof roll-cage + light bar -------------------------------------
hollowCube(-7, 13, 0, 7, 15, 8, STONE);
cube(-6, 16, 0, 6, 16, 1, STONE);       // light bar mount
for (let x = -5; x <= 5; x += 2) block(x, 16, 0, SNOW); // bright lights

// ---- grille, bumper, headlights (front face) ------------------------
cube(-8, 4, -8, 8, 7, -7, STONE);       // heavy front bumper
for (let x = -6; x <= 6; x++) block(x, 8, -6, (x % 2 ? STONE : COBBLE)); // grille slats
cube(-6, 9, -6, 6, 9, -6, STONE);
block(-5, 8, -6, SNOW); block(-4, 8, -6, SNOW);   // headlights
block( 4, 8, -6, SNOW); block( 5, 8, -6, SNOW);
block(-5, 8, -7, SNOW); block( 5, 8, -7, SNOW);

// ---- twin exhaust stacks --------------------------------------------
for (const ex of [-5, 5]) {
  for (let y = 8; y <= 18; y++) block(ex, y, 6, STONE);
  block(ex, 18, 6, COBBLE);             // flared tip
  block(ex, 17, 7, COBBLE);
}

// ---- rear mud flaps --------------------------------------------------
cube(-11, 0, 10, -7, 4, 10, BRICK);
cube( 7, 0, 10, 11, 4, 10, BRICK);

// ---- foreground: a crushed car under the front bumper ---------------
cube(-3, 0, -13, 3, 2, -9, ICE);        // squashed body
cube(-2, 2, -12, 2, 2, -10, GLASS);     // flattened roof glass
block(-3, 0, -13, BRICK); block(3, 0, -9, BRICK); // dented panels
for (const [wx, wz] of [[-3,-13],[3,-13],[-3,-9],[3,-9]]) {
  block(wx, 0, wz, COBBLE);             // little tires
}
block(0, 3, -11, STONE);                // buckled hood peak