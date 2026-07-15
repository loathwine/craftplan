// neuschwanstein-4x-opus — prompt:
// Neuschwanstein Castle...

const meta = null; // (ignored — this file is plain builder JS)

// ============================================================
//  NEUSCHWANSTEIN CASTLE  — white Bavarian fairy-tale castle
//  White SNOW walls · ICE (blue) spires & cones · STONE slate
//  gables · GLASS windows · BRICK gatehouse accents
//  Front (facade) faces NORTH / -Z toward the camera.
// ============================================================

// ---------- helpers ----------
function wallsRect(x0, z0, x1, z1, y0, y1, b) {
  cube(x0, y0, z0, x1, y1, z0, b); // north face (-Z)  <-- facade
  cube(x0, y0, z1, x1, y1, z1, b); // south face (+Z)
  cube(x0, y0, z0, x0, y1, z1, b); // west face  (-X)
  cube(x1, y0, z0, x1, y1, z1, b); // east face  (+X)
}

function merlons(x0, z0, x1, z1, y, b) {
  for (let x = x0; x <= x1; x += 2) { block(x, y, z0, b); block(x, y, z1, b); }
  for (let z = z0; z <= z1; z += 2) { block(x0, y, z, b); block(x1, y, z, b); }
}

// solid tapering cone of stacked disks; returns top Y
function coneRoof(cx, cz, r, y0, b) {
  let y = y0;
  for (let rr = r; rr >= 0; rr--) { disk(cx, y, cz, rr, b); y++; }
  return y - 1;
}

// steep tall square spire (two courses per width step); returns top Y
function tallSpire(cx, cz, half, y0, b) {
  let y = y0, h = half;
  while (h >= 0) {
    cube(cx - h, y, cz - h, cx + h, y, cz + h, b); y++;
    if (h > 0) { cube(cx - h, y, cz - h, cx + h, y, cz + h, b); y++; }
    h--;
  }
  return y - 1;
}

// hollow square tower with white walls + slate/blue crown
function squareTower(x0, z0, x1, z1, y0, y1, roofY, roofBlock) {
  wallsRect(x0, z0, x1, z1, y0, y1, SNOW);
  merlons(x0, z0, x1, z1, y1 + 1, SNOW);
  // pointed roof rising from just inside the merlons
  const cx = Math.round((x0 + x1) / 2), cz = Math.round((z0 + z1) / 2);
  const half = Math.floor((x1 - x0) / 2);
  tallSpire(cx, cz, half, y1 + 1, roofBlock);
}

// round tower: cylinder shaft + conical blue roof + finial
function roundTower(cx, cz, r, y0, y1, coneBlock) {
  hollowCylinder(cx, cz - 0, cz, r, 1, SNOW); // (placeholder guard, replaced below)
}

// vertical GLASS windows along a north face
function nWindows(x0, x1, z, ybase, htall, step) {
  for (let x = x0; x <= x1; x += step) {
    cube(x, ybase, z, x, ybase + htall - 1, z, GLASS);
  }
}

// gabled slate roof (ridge along X, slopes toward ±Z)
function gableRoof(x0, z0, x1, z1, y0, b) {
  const steps = Math.floor((z1 - z0) / 2);
  for (let i = 0; i <= steps; i++) {
    const zN = z0 + i, zS = z1 - i, y = y0 + i;
    cube(x0 - 1, y, zN, x1 + 1, y, zN, b); // slight eave overhang
    cube(x0 - 1, y, zS, x1 + 1, y, zS, b);
  }
  // fill ridge gap if any
  const zmid = Math.floor((z0 + z1) / 2);
  cube(x0 - 1, y0 + steps, zmid, x1 + 1, y0 + steps, z1 - steps, b);
}

// ---------- site prep: clear the forest over the footprint ----------
cube(-15, 1, -10, 11, 14, 15, AIR);

// ============================================================
//  ROCKY CRAG BASE
// ============================================================
cube(-13, 0, -6, 9, 0, 13, STONE);            // courtyard / platform
cube(-13, -3, -6, 9, -1, -4, STONE);          // front cliff face (crag)
cube(-13, -2, -6, -13, -1, 13, COBBLE);       // west embankment
cube(9, -2, -6, 9, -1, 13, COBBLE);           // east embankment
// broken rocky outcrops at the front foot of the crag
block(-11, 0, -8, STONE); block(-12, 0, -7, COBBLE);
block(8, 0, -8, STONE);  block(9, 0, -7, COBBLE);
block(-2, 0, -9, STONE); block(2, 0, -9, COBBLE);

// approach path from the north into the gate
cube(-1, 0, -13, 1, 0, -7, COBBLE);

// ============================================================
//  GATEHOUSE (front / -Z)  — brick-accented Torbau
// ============================================================
// central gate curtain
wallsRect(-6, -6, 6, -4, 1, 7, SNOW);
cube(-6, 3, -6, 6, 3, -6, BRICK);      // red brick string-course (facade)
cube(-6, 7, -6, 6, 7, -6, BRICK);      // upper brick band
merlons(-6, -6, 6, -4, 8, SNOW);
// gate arch (carved through) + timber
cube(-1, 1, -7, 1, 5, -3, AIR);
cube(-1, 6, -6, 1, 6, -6, BRICK);      // arch lintel
cube(-1, 1, -4, 1, 4, -4, PLANKS);     // gate doors (recessed)
block(0, 5, -4, PLANKS);

// two brick-topped gate towers flanking the gate
squareTower(-8, -7, -5, -3, 1, 12, 13, STONE);
squareTower(5, -7, 8, -3, 1, 12, 13, STONE);
// brick crowns + windows on gate towers
cube(-8, 10, -7, -5, 10, -7, BRICK);
cube(5, 10, -7, 8, 10, -7, BRICK);
nWindows(-7, -6, -7, 3, 2, 1);
nWindows(6, 7, -7, 3, 2, 1);
nWindows(-7, -6, -7, 7, 2, 1);
nWindows(6, 7, -7, 7, 2, 1);

// curtain walls linking gatehouse back to the Palas
cube(-8, 1, -3, -8, 6, 3, SNOW);
cube(8, 1, -3, 8, 6, 3, SNOW);
merlons(-8, -3, -8, 3, 7, SNOW);
merlons(8, -3, 8, 3, 7, SNOW);

// ============================================================
//  PALAS  — the great white residential hall (back / +Z)
// ============================================================
wallsRect(-11, 3, 5, 12, 1, 12, SNOW);
// interior cross-wall for structure/shadow
cube(-3, 1, 4, -3, 11, 11, SNOW);
// tall arched window ranks on the north facade (Z=3)
nWindows(-9, 3, 3, 2, 4, 2);   // ground rank
nWindows(-9, 3, 3, 8, 3, 2);   // upper rank
// side windows
nWindows(4, 11, 5, 3, 4, 3);   // east face uses X as pos? (approx accents)
cube(-11, 3, 6, -11, 6, 10, GLASS); // west face window strip
cube(5, 3, 6, 5, 6, 10, GLASS);     // east face window strip
// decorative brick base course along facade
cube(-11, 1, 3, 5, 1, 3, SNOW);
cube(-11, 2, 3, 5, 2, 3, GLASS);    // (kept white/glass, Bavarian look)
// slate gabled roof
gableRoof(-11, 3, 5, 12, 13, STONE);
// gable-end trim
cube(-11, 13, 3, 5, 15, 3, SNOW);   // north gable wall infill
cube(-11, 13, 12, 5, 15, 12, SNOW); // south gable wall infill

// ============================================================
//  CENTRAL TALL TOWER  — the iconic square tower + blue spire
// ============================================================
wallsRect(-8, 5, -3, 10, 1, 22, SNOW);
// stacked window ranks climbing the tower (north face Z=5)
for (let yy = 4; yy <= 19; yy += 3) nWindows(-7, -4, 5, yy, 2, 1);
// west/east narrow windows
for (let yy = 6; yy <= 18; yy += 4) {
  cube(-8, yy, 6, -8, yy + 1, 6, GLASS);
  cube(-3, yy, 8, -3, yy + 1, 8, GLASS);
}
// brick clock/dial band near the top
cube(-8, 20, 5, -3, 20, 5, BRICK);
// crown of merlons then a soaring blue spire
merlons(-8, 5, -3, 10, 23, SNOW);
const spireTop = tallSpire(-5, 7, 3, 23, ICE);
// golden finial + flagpole + pennant
cube(-5, spireTop + 1, 7, -5, spireTop + 3, 7, OAK_LOG);
block(-4, spireTop + 3, 7, BRICK);
block(-4, spireTop + 2, 7, BRICK);

// ============================================================
//  ROUND STAIR TOWER  — projecting from the Palas facade
// ============================================================
(function () {
  const cx = 2, cz = 3, r = 2;
  hollowCylinder(cx, 1, cz, r, 16, SNOW);
  // windows spiralling up
  for (let yy = 3; yy <= 14; yy += 3) {
    block(cx, yy, cz - r, GLASS);
    block(cx - r, yy + 1, cz, GLASS);
  }
  const top = coneRoof(cx, cz, r + 1, 17, ICE); // flared blue cone
  block(cx, top + 1, cz, OAK_LOG);
  block(cx, top + 2, cz, ICE);
})();

// ============================================================
//  REAR CORNER TURRETS  — round blue-capped bartizans
// ============================================================
[[-10, 12], [4, 12]].forEach(([cx, cz]) => {
  hollowCylinder(cx, 1, cz, 2, 13, SNOW);
  block(cx, 5, cz - 2, GLASS);
  block(cx, 9, cz - 2, GLASS);
  const t = coneRoof(cx, cz, 2, 14, ICE);
  block(cx, t + 1, cz, OAK_LOG);
});

// small front bartizans on the gate-tower outer corners (foreground detail)
[[-8, -7], [8, -7]].forEach(([cx, cz]) => {
  cylinder(cx, 10, cz, 1, 4, SNOW);
  coneRoof(cx, cz, 1, 14, ICE);
});

// ============================================================
//  FOREGROUND FRAMING TREES (north of the crag, for depth)
// ============================================================
function pine(x, z) {
  cube(x, 0, z, x, 5, z, OAK_LOG);
  sphere(x, 6, z, 2, LEAVES);
  disk(x, 4, z, 2, LEAVES);
  block(x, 8, z, LEAVES);
}
pine(-12, -9);
pine(11, -9);
pine(-9, 14);

// low garden hedges flanking the approach path
cube(-3, 0, -10, -2, 1, -8, LEAVES);
cube(2, 0, -10, 3, 1, -8, LEAVES);