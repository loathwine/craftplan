// gorilla-4x-fable — prompt:
// a silverback gorilla...

const rnd = (x, y, z) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

// palettes
const dark = (x, y, z) => (rnd(x, y, z) < 0.22 ? COBBLE : STONE);
const rock = (x, y, z) => (rnd(x, y, z) < 0.5 ? COBBLE : STONE);
// silver saddle: blends from dark fur to snow toward the top of the blob
const silverTop = (bias) => (x, y, z, d2, dy) => {
  const p = (dy - bias) * 2.5;
  return rnd(x + 31, y, z) < p ? SNOW : dark(x, y, z);
};

function blob(cx, cy, cz, rx, ry, rz, pick) {
  for (let x = Math.round(cx - rx); x <= Math.round(cx + rx); x++)
    for (let y = Math.round(cy - ry); y <= Math.round(cy + ry); y++)
      for (let z = Math.round(cz - rz); z <= Math.round(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 <= 1) block(x, y, z, pick(x, y, z, d2, dy));
      }
}

function limb(p0, p1, p2, r0, r1, pick) {
  const N = 14;
  for (let i = 0; i <= N; i++) {
    const t = i / N, u = 1 - t;
    const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
    const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
    const z = u * u * p0[2] + 2 * u * t * p1[2] + t * t * p2[2];
    const r = r0 + (r1 - r0) * t;
    blob(x, y, z, r, r, r, pick);
  }
}

function fern(x, z) {
  block(x, 0, z, LEAVES);
  block(x, 1, z, LEAVES);
  block(x + 1, 0, z, LEAVES);
  block(x, 0, z + 1, LEAVES);
}

// ---- clear jungle out of the subject volume (targeted, trees only) ----
cube(-13, 1, -16, 13, 21, 13, AIR);
cube(-20, 1, -16, -14, 10, 2, AIR);   // west wing (baby gorilla sits here)
cube(14, 1, -16, 20, 10, 2, AIR);     // east wing

// ---- trampled earth under the knuckles ----
cube(-10, -1, -13, -6, 0, -9, DIRT);
cube(7, -1, -11, 11, 0, -7, DIRT);

// ================= SILVERBACK — knuckle-walking, facing NORTH =================

// torso barrel with silver saddle on top
blob(0, 9.5, 3, 6.5, 5.5, 6.5, silverTop(0.15));
// rump, heavily silvered
blob(0, 8, 9, 5, 4.5, 3.5, silverTop(0.0));

// crouched hind legs
blob(-4, 6, 8, 2.6, 3.2, 3, dark);
blob(4, 6, 8, 2.6, 3.2, 3, dark);
cube(-5, 1, 7, -3, 3, 9, STONE);
cube(3, 1, 7, 5, 3, 9, STONE);
// hind feet, toes forward
cube(-6, 0, 6, -3, 1, 10, STONE);
cube(3, 0, 6, 6, 1, 10, STONE);
for (let x = -6; x <= -3; x++) block(x, 0, 5, COBBLE);
for (let x = 3; x <= 6; x++) block(x, 0, 5, COBBLE);

// massive dark shoulder hump (drawn after torso so the saddle starts behind it)
blob(1, 12.5, -2, 7.5, 4.5, 4, dark);
// pectoral mass on the chest
blob(1, 8, -3, 4, 3, 2.5, (x, y, z) => (rnd(x, y, z) < 0.4 ? COBBLE : STONE));

// arms: fists planted forward, mid-stride asymmetry (right arm trails)
limb([-8, 3, -10], [-9.5, 9, -7], [-6, 12, -2], 2.2, 2.9, dark);
limb([9, 3, -8], [10, 9, -5], [7, 12, -1], 2.2, 2.9, dark);
blob(-8, 1.8, -11, 2.7, 2.0, 2.5, dark);
blob(9, 1.8, -9, 2.7, 2.0, 2.5, dark);

// ---- head (set low and forward, no neck) ----
blob(1, 13, -4, 3.5, 3, 3, dark);          // neck wedge into the hump
blob(1, 15.5, -6, 3.2, 3.2, 3.4, dark);    // skull

// sagittal crest
cube(0, 19, -8, 2, 19, -4, STONE);
cube(1, 20, -7, 1, 20, -5, COBBLE);

// flat leathery face plate
for (let x = -2; x <= 4; x++)
  for (let y = 13; y <= 17; y++) {
    const dx = (x - 1) / 3.4, dy = (y - 15.5) / 3.4;
    if (dx * dx + dy * dy <= 0.95) { block(x, y, -9, COBBLE); block(x, y, -8, COBBLE); }
  }
// heavy brow ridge overhanging the eyes
cube(-2, 16, -10, 4, 16, -10, STONE);
// eyes (dark, shadowed under the brow)
block(-1, 15, -9, OAK_LOG);
block(3, 15, -9, OAK_LOG);
// ears
block(-3, 16, -6, COBBLE);
block(5, 16, -6, COBBLE);

// muzzle
cube(-1, 10, -12, 3, 14, -8, STONE);
// nostril dents
block(0, 13, -12, AIR);
block(2, 13, -12, AIR);
// roaring mouth: carve cavity, red interior, white canines
cube(-1, 11, -12, 3, 12, -11, AIR);
cube(-1, 11, -10, 3, 12, -10, BRICK);
block(-1, 12, -11, SNOW);
block(3, 12, -11, SNOW);
block(0, 11, -11, SNOW);
block(2, 11, -11, SNOW);

// ================= BABY GORILLA (west, watching, one arm waving) =================
blob(-15, 2.5, -3, 2.6, 2.6, 2.4, dark);
blob(-15, 5.8, -4, 2.0, 1.9, 2.0, dark);
cube(-16, 5, -6, -14, 6, -6, COBBLE);      // face plate
block(-16, 6, -6, OAK_LOG);                 // eyes
block(-14, 6, -6, OAK_LOG);
block(-15, 5, -7, COBBLE);                  // little muzzle
block(-17, 6, -4, COBBLE);                  // ears
block(-13, 6, -4, COBBLE);
cube(-18, 0, -4, -17, 4, -3, STONE);        // grounded arm
cube(-13, 4, -4, -12, 7, -3, STONE);        // raised waving arm
cube(-17, 0, -6, -16, 1, -5, STONE);        // feet
cube(-14, 0, -6, -13, 1, -5, STONE);

// ================= JUNGLE SCENERY =================
// snapped tree the silverback pushed over (east side)
cube(14, 0, 3, 15, 2, 4, OAK_LOG);
block(14, 3, 3, OAK_LOG);
line(15, 0, 4, 21, 0, 10, OAK_LOG);
line(15, 1, 4, 20, 1, 9, OAK_LOG);
blob(20, 1, 11, 2.5, 2, 2.5, (x, y, z) => (rnd(x, y, z) < 0.85 ? LEAVES : OAK_LOG));

// scattered boulders
blob(-13, 0.5, 4, 2.4, 1.8, 2, rock);
blob(14, 0.5, -6, 2, 1.5, 1.8, rock);
blob(-11, 0.5, -14, 1.6, 1.2, 1.4, rock);

// ferns / undergrowth
fern(-12, 10);
fern(9, 12);
fern(-17, -8);
fern(16, 0);
fern(-9, -15);
fern(11, -12);
fern(6, -14);