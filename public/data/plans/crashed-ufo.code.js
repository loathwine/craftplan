// crashed-ufo — prompt:
// A crashed flying saucer UFO, half-buried in its impact crater. SHAPE IS CRITICAL - the saucer is a WIDE THIN LENS, NOT a dome: total diameter 36-40 blocks, total hull thickness at most 7 blocks (width...

// ===== CRASHED FLYING SAUCER — wide thin tilted lens in an impact crater =====
const D2R = Math.PI / 180;

// saucer center (shifted +X/+Z so the trailing crater has room behind the buried edge)
const CX = 2, CZ = 1;
const R  = 19;            // outer radius -> diameter 39 (in 36-40 range)
const BASE = 3;           // world-Y of the rim mid-plane at center
const TILT = 0.24;        // tan(theta) ~13 deg ; low edge -X, high edge +X
const tilt = (wx) => Math.round(wx * TILT);

// ---- height map so detail (ribs, cockpit) seats on the real hull top ----
const top = new Map();
const key = (x, z) => x + "," + z;
function setTop(x, z, y){ const k = key(x, z); if (!top.has(k) || y > top.get(k)) top.set(k, y); }
function hull(wx, wy, wz, r){
  // concentric 2-wide bands -> STONE / COBBLE metal paneling
  const id = (Math.floor(r / 2) % 2 === 0) ? STONE : COBBLE;
  block(wx, wy, wz, id);
  setTop(wx, wz, wy);
}

// ============================================================
// 1. CLEAR the forest canopy the saucer crashed through
//    (targeted to the saucer's own airspace, not the whole map)
// ============================================================
for (let y = 1; y <= 12; y++) disk(CX, y, CZ, R + 1, AIR);

// ============================================================
// 2. DIG the crater: bowl under the buried edge + trailing gouge
// ============================================================
const CCx = -10, CCz = 0, CR = 13;
function craterFloor(wx, wz){
  const dx = wx - CCx, dz = wz - CCz, d = Math.hypot(dx, dz);
  let f = null;
  if (d <= CR) f = Math.round(-5 + (d * d) / (CR * CR) * 5);     // paraboloid bowl
  if (wx < CCx && Math.abs(dz) <= 4){                            // skid gouge, trails -X
    const tf = Math.round(-3 + Math.abs(dz) * 0.6);
    f = (f === null) ? tf : Math.min(f, tf);
  }
  return f;
}
for (let wx = -22; wx <= 4; wx++)
  for (let wz = -15; wz <= 15; wz++){
    const f = craterFloor(wx, wz);
    if (f !== null && f <= 1) cube(wx, f, wz, wx, 1, wz, AIR);    // open the pit (AIR is free)
  }

// ============================================================
// 3. THE SAUCER — stacked horizontal disks, sheared into a tilt
//    union forms a solid lens: thick(7) at center, thin(1) at rim
// ============================================================
// [localY, radius]  bottom -> top  (shallow taper below, shrinking disks above)
const DISKS = [
  [-3,  6],
  [-2, 11],
  [-1, 15],
  [ 0, 19],   // <-- widest point (rim)
  [ 1, 15],
  [ 2, 10],
  [ 3,  5],
];
for (const [ly, rad] of DISKS){
  for (let dx = -rad; dx <= rad; dx++)
    for (let dz = -rad; dz <= rad; dz++){
      const r = Math.hypot(dx, dz);
      if (r > rad + 0.5) continue;
      const wx = CX + dx, wz = CZ + dz;
      hull(wx, BASE + ly + tilt(wx), wz, r);
    }
}

// ---- protruding rim LIP: thicken the equator edge into a 3-tall overhanging ring
for (let dx = -R; dx <= R; dx++)
  for (let dz = -R; dz <= R; dz++){
    const r = Math.hypot(dx, dz);
    if (r > R + 0.5 || r < R - 3) continue;
    const wx = CX + dx, wz = CZ + dz, b = BASE + tilt(wx);
    for (let ly = -1; ly <= 1; ly++) hull(wx, b + ly, wz, r);
  }

// ---- raised radial ribs (structural paneling) on the top surface
for (let i = 0; i < 16; i++){
  const a = i * 22.5 * D2R, ca = Math.cos(a), sa = Math.sin(a);
  for (let rr = 4; rr <= 18; rr++){
    const wx = Math.round(CX + ca * rr), wz = Math.round(CZ + sa * rr), k = key(wx, wz);
    if (top.has(k)) block(wx, top.get(k) + 1, wz, STONE);
  }
}
// ---- concentric seam rings
for (const ringR of [10, 14, 17]){
  for (let a = 0; a < 360; a += 4){
    const wx = Math.round(CX + Math.cos(a * D2R) * ringR);
    const wz = Math.round(CZ + Math.sin(a * D2R) * ringR), k = key(wx, wz);
    if (top.has(k)) block(wx, top.get(k) + 1, wz, COBBLE);
  }
}

// ============================================================
// 4. COCKPIT — one small GLASS dome, dead center on top
// ============================================================
const ctop = top.get(key(CX, CZ)) ?? (BASE + 3);
// stone collar/deck the dome sits on
for (let dx = -4; dx <= 4; dx++)
  for (let dz = -4; dz <= 4; dz++){
    const r = Math.hypot(dx, dz);
    if (r > 4.5 || r < 2.5) continue;
    hull(CX + dx, ctop + 1, CZ + dz, r);
  }
const domeR = 3, domeBase = ctop + 1;
for (let dx = -domeR; dx <= domeR; dx++)
  for (let dz = -domeR; dz <= domeR; dz++)
    for (let dy = 0; dy <= domeR; dy++)
      if (Math.hypot(dx, dy, dz) <= domeR + 0.4)
        block(CX + dx, domeBase + dy, CZ + dz, GLASS);

// ============================================================
// 5. PORTHOLES — single GLASS row around the rim lip
// ============================================================
for (let i = 0; i < 28; i++){
  const a = i * (360 / 28) * D2R;
  const dx = Math.round(Math.cos(a) * (R - 1)), dz = Math.round(Math.sin(a) * (R - 1));
  const wx = CX + dx, wz = CZ + dz;
  if (top.has(key(wx, wz))) block(wx, BASE + tilt(wx), wz, GLASS);
}

// ============================================================
// 6. EJECTA — thrown-up DIRT & STONE rimming the crater (understated)
// ============================================================
for (let deg = 95; deg <= 265; deg += 5){
  const a = deg * D2R;
  for (const dd of [13.5, 15]){
    const wx = Math.round(CCx + Math.cos(a) * dd), wz = Math.round(CCz + Math.sin(a) * dd);
    if (Math.abs(wx) > 22 || Math.abs(wz) > 22) continue;
    if (craterFloor(wx, wz) !== null) continue;          // don't pile inside the pit
    const h = (dd < 14 ? 2 : 1) - (deg % 15 === 0 ? 0 : 1);
    for (let y = 0; y <= Math.max(0, h); y++)
      block(wx, y, wz, ((deg + Math.round(dd)) % 2 === 0) ? DIRT : STONE);
  }
}

// ============================================================
// 7. FALLEN TREES + knocked-off hull debris
// ============================================================
line(-21, 0, -7, -16, 0, -3, OAK_LOG);     // blown down beyond the buried nose
line(-20, 1,  4, -15, 0,  7, OAK_LOG);
line( 16, 0,  8,  21, 0,  4, OAK_LOG);      // lying on the ground under the lifted edge
line(-13, 0, -11, -9, 0, -13, OAK_LOG);
// scattered hull plates torn off in the crash
cube(-14, -3, 1, -13, -3, 2, COBBLE);
cube(-7,  -2, -2, -6, -2, -1, STONE);
block(-11, -4, 0, STONE);
block(-5,  0, 9, COBBLE);