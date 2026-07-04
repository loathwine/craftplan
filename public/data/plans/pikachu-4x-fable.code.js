// pikachu-4x-fable — prompt:
// Pikachu...

// Pikachu — sitting, facing south (+Z), with lightning-bolt tail, brown back
// stripes, red cheeks, black-tipped ears and floating electric sparks.

// Clear trees/leaves from the build footprint (AIR is free)
cube(-14, 0, -14, 14, 9, 14, AIR);

// --- helpers -------------------------------------------------------------
function ell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.05) block(x, y, z, id);
      }
}

// Head sphere params (shared by face-painting helper)
const HX = 0, HY = 17.5, HZ = 1, HR = 6;
function faceZ(x, y) {
  const d = HR * HR - (x - HX) * (x - HX) - (y - HY) * (y - HY);
  if (d < 0) return null;
  return Math.round(HZ + Math.sqrt(d));
}
function faceBlock(x, y, id) {
  const z = faceZ(x, y);
  if (z !== null) block(x, y, z, id);
}

// --- body & head ---------------------------------------------------------
ell(0, 7, 0, 7, 8, 6.5, SAND);      // pear-shaped sitting body
ell(HX, HY, HZ, HR, HR, HR, SAND);  // head

// --- brown back stripes (wrap the curved back) ---------------------------
function backZ(x, y) {
  const t = 1 - (x / 7) * (x / 7) - ((y - 7) / 8) * ((y - 7) / 8);
  if (t < 0.02) return null;
  return Math.round(-6.5 * Math.sqrt(t));
}
for (let x = -5; x <= 5; x++)
  for (const y of [8, 9, 11, 12]) {
    const z = backZ(x, y);
    if (z !== null) { block(x, y, z, OAK_LOG); block(x, y, z + 1, OAK_LOG); }
  }

// --- lightning-bolt tail (flat panel behind, brown at the base) ----------
cube(1, 4, -7, 2, 6, -4, OAK_LOG);       // brown base, melds into the back
cube(2, 6, -7, 5, 8, -6, SAND);
cube(4, 8, -7, 6, 10, -6, SAND);
cube(3, 10, -7, 6, 12, -6, SAND);        // jog left
cube(5, 12, -7, 9, 14, -6, SAND);
cube(8, 14, -7, 10, 16, -6, SAND);
cube(6, 16, -7, 12, 20, -6, SAND);       // big top blade
cube(6, 16, -7, 7, 17, -6, AIR);         // notch in the blade corner

// --- ears (tapering, black tips) ------------------------------------------
for (let i = 0; i <= 5; i++) {
  const t = i / 5;
  const r = 2.1 - 1.1 * t;
  const id = t >= 0.65 ? STONE : SAND;
  ell(-2.5 - 4.5 * t, 22 + 9 * t, 1 - 2 * t, r, r, r, id); // left ear
  ell( 2.5 + 4.5 * t, 22 + 9 * t, 1 - 2 * t, r, r, r, id); // right ear
}

// --- stubby arms & forward feet -------------------------------------------
ell(-4, 8.5, 5, 1.6, 1.6, 2.2, SAND);
ell( 4, 8.5, 5, 1.6, 1.6, 2.2, SAND);
ell(-2.5, 1, 5.5, 2, 1.4, 2.9, SAND);
ell( 2.5, 1, 5.5, 2, 1.4, 2.9, SAND);

// --- face -----------------------------------------------------------------
// eyes (black with white glint)
for (let y = 19; y <= 20; y++) {
  faceBlock(-3, y, STONE); faceBlock(-2, y, STONE);
  faceBlock(2, y, STONE);  faceBlock(3, y, STONE);
}
faceBlock(-2, 20, SNOW);
faceBlock(3, 20, SNOW);
// nose
faceBlock(0, 18, STONE);
// smile
faceBlock(-2, 16, STONE); faceBlock(-1, 15, STONE);
faceBlock(0, 15, STONE);  faceBlock(1, 15, STONE); faceBlock(2, 16, STONE);
// red cheeks
for (let dx = -2; dx <= 2; dx++)
  for (let dy = -2; dy <= 2; dy++)
    if (dx * dx + dy * dy <= 3.2) {
      faceBlock(-4 + dx, 16 + dy, BRICK);
      faceBlock(4 + dx, 16 + dy, BRICK);
    }

// --- electric sparks (floating ice zigzags by the cheeks) ------------------
block(-10, 17, 3, ICE); block(-9, 16, 3, ICE);
block(-10, 15, 3, ICE); block(-9, 14, 3, ICE);
block(10, 18, 3, ICE);  block(9, 17, 3, ICE);
block(10, 16, 3, ICE);  block(9, 15, 3, ICE);