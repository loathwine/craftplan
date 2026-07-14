// christ-redeemer-4x-fable — prompt:
// Christ the Redeemer...

const S = SNOW, ST = STONE, CB = COBBLE, GR = GRASS, LV = LEAVES, LOG = OAK_LOG;

// deterministic hash for rocky noise
function h(x, y, z) {
  let n = (x * 73856093) ^ (y * 19349669) ^ (z * 83492791);
  n = (n ^ (n >> 13)) * 1274126177;
  return (n ^ (n >> 16)) >>> 0;
}

// clear tree canopy over the build site (AIR is free)
cube(-13, 2, -13, 13, 12, 15, AIR);

// ===== Corcovado mountain: layered rocky dome, centered slightly south =====
const CX = 0, CZ = 2;
for (let y = -2; y <= 5; y++) {
  const baseR = 11.5 - (y + 2) * 0.95;
  for (let x = -13; x <= 13; x++) {
    for (let z = -11; z <= 15; z++) {
      const dx = x - CX, dz = z - CZ;
      const d = Math.sqrt(dx * dx + dz * dz);
      const r = baseR + ((h(x, 0, z) % 100) / 100) * 1.6 - 0.8; // vertical ridges
      if (d <= r) {
        let id = ST;
        const rnd = h(x, y, z) % 10;
        if (y >= 1 && d > r - 1.4) id = (rnd < 3) ? CB : ST;      // rocky upper skin
        if (y <= 0 && d > r - 1.8) id = (rnd < 5) ? GR : ST;      // green lower skirt
        block(x, y, z, id);
      }
    }
  }
}

// vegetation clumps hugging the slopes
const clumps = [[9, 1, 7], [-9, 1, 7], [8, 0, -2], [-8, 0, -3], [4, 2, 11], [-5, 2, 10], [10, 0, 9]];
for (const [x, y, z] of clumps) {
  block(x, y, z, LOG);
  sphere(x, y + 2, z, 2, LV);
}

// ===== pedestal base fill + pedestal =====
cube(-3, 3, -2, 3, 5, 4, ST);            // solid core so pedestal corners never float
cube(-3, 6, -2, 3, 10, 4, ST);
for (const x of [-3, 3]) for (const z of [-2, 4]) line(x, 6, z, x, 10, z, CB); // corner columns
cube(-4, 10, -3, 4, 10, 5, S);           // pale cap slab / statue base rim
// chapel door on the north face
cube(-1, 6, -2, 1, 8, -2, AIR);
cube(-1, 6, -1, 1, 8, -1, LOG);

// ===== viewing platform on the north side =====
cube(-6, 3, -7, 6, 4, -3, ST);
cube(-6, 5, -7, 6, 5, -3, CB);
for (let x = -6; x <= 6; x += 2) block(x, 6, -7, CB);        // fence posts
line(-6, 7, -7, 6, 7, -7, ST);                                // north railing
line(-6, 7, -7, -6, 7, -3, ST);
line(6, 7, -7, 6, 7, -3, ST);

// stair descending north from the platform
for (let i = 0; i < 6; i++) {
  const y = 4 - i, z = -8 - i;
  cube(-2, Math.max(y - 2, -2), z, 2, y, z, CB);
}

// floodlight poles flanking the platform (SAND = warm light)
for (const sx of [-7, 7]) {
  cube(sx, -1, -6, sx, 5, -6, CB);
  block(sx, 6, -6, SAND);
}

// ===== the statue — pale soapstone (SNOW), facing north (-Z) =====
// robe hem
cube(-3, 11, -1, 3, 12, 2, S);
for (const x of [-3, -1, 1, 3]) { block(x, 11, -2, S); block(x, 12, -2, S); } // hem folds, front
for (const x of [-2, 0, 2]) block(x, 11, 3, S);                               // hem folds, back
// lower robe
cube(-2, 13, -1, 2, 16, 2, S);
// mid robe (slims toward the back)
cube(-2, 17, -1, 2, 20, 1, S);
// vertical drapery fluting on the front face
for (const x of [-2, 0, 2]) for (let y = 13; y <= 19; y++) block(x, y, -2, S);
// chest with protruding sacred heart
cube(-3, 21, -1, 3, 22, 1, S);
block(0, 21, -2, S);
// shoulders
cube(-5, 23, -1, 5, 24, 1, S);
// hanging sleeves below the arms
cube(-6, 21, -1, -5, 23, 0, S);
cube(5, 21, -1, 6, 23, 0, S);
// arms: level inner span, slight droop outward, flat open hands
cube(-11, 24, -1, -6, 25, 0, S);
cube(6, 24, -1, 11, 25, 0, S);
cube(-14, 23, -1, -12, 24, 0, S);
cube(12, 23, -1, 14, 24, 0, S);
cube(-16, 23, -2, -15, 23, 1, S);
cube(15, 23, -2, 16, 23, 1, S);
// neck
cube(-1, 25, -1, 1, 25, 0, S);
// head, shifted one block north — the characteristic bowed gaze
cube(-1, 26, -2, 1, 29, 0, S);
// hair: cap and back of head in darker stone
cube(-1, 30, -2, 1, 30, 0, ST);
cube(-1, 27, 0, 1, 29, 0, ST);
// face details on the north face
block(-1, 28, -2, ST);
block(1, 28, -2, ST);
block(0, 27, -3, S);                 // nose
line(-1, 26, -2, 1, 26, -2, ST);     // beard