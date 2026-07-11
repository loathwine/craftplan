// gorilla-4x-opus — prompt:
// a silverback gorilla...

block(0,0,0,0,0,0,3); // no-op anchor
// ---- Silverback Gorilla, seated, facing NORTH (-Z) ----
const BODY = COBBLE;   // dark fur
const SILVER = STONE;  // silverback saddle

// helpers ------------------------------------------------
function fillEllip(cx, cy, cz, rx, ry, rz, fn) {
  const x0 = Math.floor(cx - rx), x1 = Math.ceil(cx + rx);
  const y0 = Math.floor(cy - ry), y1 = Math.ceil(cy + ry);
  const z0 = Math.floor(cz - rz), z1 = Math.ceil(cz + rz);
  for (let gx = x0; gx <= x1; gx++)
    for (let gy = y0; gy <= y1; gy++)
      for (let gz = z0; gz <= z1; gz++) {
        const dx = (gx - cx) / rx, dy = (gy - cy) / ry, dz = (gz - cz) / rz;
        if (dx*dx + dy*dy + dz*dz <= 1.05) {
          const id = fn(gx, gy, gz);
          if (id !== null) block(gx, gy, gz, id);
        }
      }
}
function limb(pts, r, id) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const steps = Math.max(1, Math.round(Math.hypot(b[0]-a[0], b[1]-a[1], b[2]-a[2])));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const rr = r[0] + (r[1] - r[0]) * t;
      fillEllip(a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t, rr, rr, rr, () => id);
    }
  }
}
// silver saddle: back & upper surface is silver, front/underside dark
function coat(gx, gy, gz) {
  if (gz >= 5 && gy >= 8) return SILVER;
  return BODY;
}

// clear intruding foliage in the subject volume only ------
cube(-15, -1, -7, 15, 30, 17, AIR);

// rump / haunches (rear, on ground) ----------------------
fillEllip(0, 5, 10, 8, 5, 6, coat);
fillEllip(-6, 3, 8, 4, 4, 4, coat);   // hip
fillEllip(6, 3, 8, 4, 4, 4, coat);

// torso / barrel chest -----------------------------------
fillEllip(0, 11, 4, 8, 6, 6, coat);
fillEllip(0, 13, 3, 7, 5, 5, coat);   // chest bulge forward

// broad shoulders ----------------------------------------
fillEllip(0, 16, 4, 10, 4, 5, coat);

// pectoral / chest muscle definition (dark front) --------
fillEllip(-4, 12, -1, 3, 3, 2, () => BODY);
fillEllip(4, 12, -1, 3, 3, 2, () => BODY);
// carve a sternum groove
line(0, 15, -2, 0, 9, 0, AIR);

// neck ---------------------------------------------------
fillEllip(0, 18, 3, 5, 3, 4, () => BODY);

// head ---------------------------------------------------
fillEllip(0, 21, 1, 5, 5, 5, () => BODY);
// sagittal crest (peaked skull)
cube(-1, 25, -1, 1, 27, 5, BODY);
cube(-1, 27, 1, 1, 27, 4, BODY);
// ears
fillEllip(-5, 21, 2, 1.5, 2, 1.5, () => BODY);
fillEllip(5, 21, 2, 1.5, 2, 1.5, () => BODY);

// muzzle (protrudes forward / north) ---------------------
fillEllip(0, 18, -3, 3.2, 2.6, 3, () => BODY);
fillEllip(0, 17, -4, 2.5, 1.8, 2, () => BODY);

// brow ridge (silver highlight) --------------------------
cube(-4, 22, -3, 4, 23, -2, SILVER);
cube(-4, 23, -2, 4, 24, -1, SILVER);

// deep-set eyes (shadowed sockets) -----------------------
cube(-3, 21, -3, -2, 22, -2, AIR);
cube(2, 21, -3, 3, 22, -2, AIR);

// nostrils + mouth on muzzle -----------------------------
block(-1, 18, -6, AIR);
block(1, 18, -6, AIR);
cube(-2, 16, -5, 2, 16, -4, AIR);

// arms (thick, reaching to knuckles on the ground) -------
function arm(sx) {
  limb([
    [sx*9, 16, 3],   // shoulder
    [sx*11, 11, 0],  // upper arm
    [sx*11, 7, -2],  // elbow
    [sx*10, 3, -2],  // forearm
    [sx*10, 1, -2],  // wrist
  ], [4, 3], BODY);
  // fist
  fillEllip(sx*10, 1, -3, 3.2, 2, 3, () => BODY);
  // knuckle fingers pointing forward
  for (let f = 0; f < 4; f++) {
    const fx = sx*10 - 3 + f * 2;
    cube(fx, 0, -6, fx, 1, -4, BODY);
  }
}
arm(-1);
arm(1);

// legs folded, big feet forward --------------------------
function leg(sx) {
  limb([
    [sx*6, 4, 8],
    [sx*6, 2, 2],
    [sx*5, 1, -2],
  ], [4, 3], BODY);
  // foot / sole
  fillEllip(sx*5, 1, -3, 3, 1.8, 3.5, () => BODY);
  // toes
  for (let t = 0; t < 4; t++) {
    const fx = sx*5 - 2 + t * 1.5;
    block(Math.round(fx), 0, -6, BODY);
  }
}
leg(-1);
leg(1);

// foreground detail: scattered rocks by the knuckles -----
fillEllip(-13, 0, -4, 2, 1.5, 2, () => STONE);
fillEllip(13, 0, -2, 2, 1.5, 2, () => COBBLE);
fillEllip(9, 0, -7, 1.5, 1, 1.5, () => STONE);
block(-9, 0, -7, COBBLE);