// big-ben-4x-opus — prompt:
// Big Ben...

const meta = null; // (ignored – this is a builder sandbox)

// ============================================================
//  BIG BEN — the Elizabeth Tower
//  Front (clock face) points NORTH (-Z) toward the camera.
//  Tower centered on x=0, z=4.  Footprint 9x9 (x -4..4, z 0..8).
// ============================================================

const X0 = -4, X1 = 4, Z0 = 0, Z1 = 8;      // tower outer walls
const CXX = 0, CZZ = 4;                       // horizontal centre

// ---- helper: four vertical wall faces (hollow shell, 1 thick) ----
function walls(x0, x1, z0, z1, y0, y1, id) {
  cube(x0, y0, z0, x1, y1, z0, id);           // north (-Z, front)
  cube(x0, y0, z1, x1, y1, z1, id);           // south (+Z)
  cube(x0, y0, z0, x0, y1, z1, id);           // west  (-X)
  cube(x1, y0, z0, x1, y1, z1, id);           // east  (+X)
}

// ---- helper: overhanging cornice ring (one layer, wider frame) ----
function cornice(y, id) {
  cube(-5, y, -1, 5, y, -1, id);              // north edge
  cube(-5, y,  9, 5, y,  9, id);              // south edge
  cube(-5, y, -1, -5, y, 9, id);              // west edge
  cube( 5, y, -1,  5, y, 9, id);              // east edge
}

// ============================================================
// 0.  GROUND PLAZA + foreground lamp posts
// ============================================================
cube(-7, 0, -4, 7, 0, 12, COBBLE);            // stone plaza slab
// darker paving border
cube(-7, 0, -4, 7, 0, -4, STONE);
cube(-7, 0, 12, 7, 0, 12, STONE);
cube(-7, 0, -4, -7, 0, 12, STONE);
cube( 7, 0, -4,  7, 0, 12, STONE);

// two Victorian lamp posts flanking the front approach
function lamp(lx, lz) {
  cube(lx, 0, lz, lx, 4, lz, OAK_LOG);        // pole
  block(lx, 5, lz, STONE);                    // cap
  block(lx, 4, lz - 1, GLASS);                // lantern glass
  block(lx, 4, lz + 1, GLASS);
  block(lx - 1, 4, lz, GLASS);
  block(lx + 1, 4, lz, GLASS);
  block(lx, 4, lz, SAND);                     // glowing core
}
lamp(-7, -2);
lamp( 7, -2);

// ============================================================
// 1.  FOUNDATION + SOLID BASE PEDESTAL
// ============================================================
cube(-5, -2, -1, 5, 0, 9, STONE);             // buried footing
cube(X0, 1, Z0, X1, 3, Z1, SAND);             // solid sandstone pedestal
cornice(3, STONE);                            // base string-course

// arched doorway (front, -Z)
cube(-1, 1, Z0, 1, 3, Z0, AIR);
cube(-1, 1, Z0, -1, 3, Z0, OAK_LOG);          // door frame
cube( 1, 1, Z0,  1, 3, Z0, OAK_LOG);
block(0, 4, Z0, STONE);                       // keystone
block(-1, 4, Z0, STONE);
block(1, 4, Z0, STONE);
cube(-1, 1, Z0 - 1, 1, 3, Z0 - 1, OAK_LOG);   // recessed doors

// ============================================================
// 2.  MAIN SHAFT  (SAND walls, hollow)  y = 3 .. 18
// ============================================================
walls(X0, X1, Z0, Z1, 3, 18, SAND);

// horizontal string courses breaking up the shaft
cornice(10, STONE);
cornice(17, STONE);                           // gilt band under clocks
cube(X0, 17, Z0, X1, 17, Z1, SAND);           // gold ring accent (front-lit)

// tall Gothic windows carved into the shaft ------------------
function windowN(wx, y0, y1) {                 // front / back faces
  for (let v = y0; v <= y1; v++) { block(wx, v, Z0, GLASS); block(wx, v, Z1, GLASS); }
  block(wx, y1 + 1, Z0, STONE); block(wx, y1 + 1, Z1, STONE);   // arch cap
  block(wx, y0 - 1, Z0, STONE); block(wx, y0 - 1, Z1, STONE);   // sill
}
function windowE(wz, y0, y1) {                 // east / west faces
  for (let v = y0; v <= y1; v++) { block(X0, v, wz, GLASS); block(X1, v, wz, GLASS); }
  block(X0, y1 + 1, wz, STONE); block(X1, y1 + 1, wz, STONE);
  block(X0, y0 - 1, wz, STONE); block(X1, y0 - 1, wz, STONE);
}
for (const wx of [-2, 2]) { windowN(wx, 5, 8); windowN(wx, 12, 15); }
for (const wz of [2, 6]) { windowE(wz, 5, 8); windowE(wz, 12, 15); }
// central slim lancet windows
windowN(0, 12, 15);

// vertical pilaster ribs on the front for Gothic emphasis
for (const wx of [-4, -3, 3, 4]) cube(wx, 3, Z0, wx, 17, Z0, SAND);

// ============================================================
// 3.  CORNER BUTTRESSES (full-height STONE columns, protruding)
// ============================================================
const corners = [
  [-5, -1], [ 4, -1], [-5, 8], [ 4, 8],       // 2x2 blocks at each corner
];
for (const [px, pz] of corners) cube(px, 1, pz, px + 1, 27, pz + 1, STONE);

// ============================================================
// 4.  CLOCK STAGE  (STONE housing)  y = 18 .. 24 ; clocks centred y=21
// ============================================================
walls(X0, X1, Z0, Z1, 18, 24, STONE);
cornice(24, STONE);

function clock(axis, plane, cu, cyc) {
  // gilt rim + white face
  for (let du = -3; du <= 3; du++) for (let dv = -3; dv <= 3; dv++) {
    const d2 = du * du + dv * dv;
    let id = null;
    if (d2 <= 9 && d2 >= 6.25) id = SAND;      // golden rim
    else if (d2 < 6.25) id = SNOW;             // pale dial
    if (id !== null) {
      if (axis === 'z') block(cu + du, cyc + dv, plane, id);
      else              block(plane, cyc + dv, cu + du, id);
    }
  }
  // hands (STONE) — minute to XII, hour toward IV
  const put = (u, v) => {
    if (axis === 'z') block(cu + u, cyc + v, plane, STONE);
    else              block(plane, cyc + v, cu + u, STONE);
  };
  put(0, 0); put(0, 1); put(0, 2);            // minute hand up
  put(1, -1); put(1, 0);                       // hour hand lower-right
  // four cardinal numeral ticks
  put(0, 2); put(0, -2); put(2, 0); put(-2, 0);
}
clock('z', Z0 - 1,  CXX, 21);                  // NORTH  (front — the money shot)
clock('z', Z1 + 1,  CXX, 21);                  // SOUTH
clock('x', X0 - 1,  CZZ, 21);                  // WEST
clock('x', X1 + 1,  CZZ, 21);                  // EAST

// ============================================================
// 5.  BELFRY (bell chamber)  y = 24 .. 27  — louvered arches
// ============================================================
walls(X0, X1, Z0, Z1, 24, 27, STONE);
// carve tall louvre openings, front & back
for (const wx of [-2, 0, 2]) {
  cube(wx, 24, Z0, wx, 26, Z0, AIR); cube(wx, 24, Z1, wx, 26, Z1, AIR);
}
for (const wz of [2, 4, 6]) {
  cube(X0, 24, wz, X0, 26, wz, AIR); cube(X1, 24, wz, X1, 26, wz, AIR);
}
cornice(27, STONE);                            // roof cornice

// ============================================================
// 6.  SPIRE  (steep pyramidal cast-iron roof)  y = 27 .. 33
// ============================================================
for (let i = 0; i <= 6; i++) {
  const y = 27 + i;
  const hw = Math.max(0, 4 - Math.round(i * 4 / 6));
  cube(CXX - hw, y, CZZ - hw, CXX + hw, y, CZZ + hw, STONE);
  if (i >= 2 && hw >= 1) {                      // hollow the fat lower rings a touch
    // leave solid — reads better as a roof
  }
}
// gilded finial + orb
block(CXX, 33, CZZ, SAND);
block(CXX, 32, CZZ, SAND);

// small gold dormer spikes on each spire face at its base
block(CXX, 28, CZZ - 4, SAND);
block(CXX, 28, CZZ + 4, SAND);
block(CXX - 4, 28, CZZ, SAND);
block(CXX + 4, 28, CZZ, SAND);

// ============================================================
// 7.  CORNER PINNACLES atop the buttresses
// ============================================================
function pinnacle(px, pz) {
  cube(px, 27, pz, px + 1, 29, pz + 1, STONE); // 2x2 shaft
  block(px, 30, pz, STONE);                    // taper
  block(px, 31, pz, SAND);                     // gold tip
}
for (const [px, pz] of corners) pinnacle(px, pz);