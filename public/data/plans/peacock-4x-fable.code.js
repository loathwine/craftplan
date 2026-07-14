// peacock-4x-fable — prompt:
// a peacock with its tail fanned out...

const FZ = 6, HUBX = 0, HUBY = 8;
const R = 19, RIN = 2;
const HALF = 95 * Math.PI / 180;
const N = 6;                       // feathers k = -6..6 (13 total)
const STEP = HALF / N;

// --- clear the stage (trees/undergrowth in the footprint) ---
cube(-14, 0, -11, 14, 8, 9, AIR);
cube(-19, 0, 4, -15, 8, 9, AIR);
cube(15, 0, 4, 19, 8, 9, AIR);

// --- garden terrace ---
disk(0, -1, 0, 9, COBBLE);
disk(0, -1, 0, 8, SAND);
disk(0, -1, 0, 3, BRICK);

// --- the fanned train: radial feathers, eyespots, golden fringe ---
for (let x = -19; x <= 19; x++) {
  for (let y = 5; y <= 27; y++) {
    const dx = x - HUBX, dy = y - HUBY;
    const r = Math.hypot(dx, dy);
    if (r < RIN || r > R) continue;
    const a = Math.atan2(dx, dy);          // angle from straight-up
    if (Math.abs(a) > HALF + STEP * 0.4) continue;
    let k = Math.round(a / STEP);
    if (k > N) k = N;
    if (k < -N) k = -N;
    const off = a - k * STEP;
    if (r > 17 && Math.abs(off) > STEP * 0.33) continue;          // scalloped tips
    if (r > 14 && r <= 17 && Math.abs(off) > STEP * 0.42) continue; // feather seams
    const ka = k * STEP;
    const ex = HUBX + 15 * Math.sin(ka), ey = HUBY + 15 * Math.cos(ka);
    const d = Math.hypot(x - ex, y - ey);
    let id = LEAVES;
    if (d < 1.3) id = GLASS;               // eyespot core (blue)
    else if (d < 2.4) id = ICE;            // turquoise ring
    else if (d < 3.4) id = SAND;           // gold ring
    else if (k % 2 === 0) {                // inner small spots on alternate feathers
      const ix = HUBX + 9 * Math.sin(ka), iy = HUBY + 9 * Math.cos(ka);
      const di = Math.hypot(x - ix, y - iy);
      if (di < 1.0) id = GLASS;
      else if (di < 1.9) id = SAND;
    }
    if (id === LEAVES) {
      if (Math.abs(r * Math.sin(off)) < 0.7 && r < 8) id = SAND;  // quill shafts
      else if (r > 18.2) id = SAND;                               // golden fringe
      else if (((x * 31 + y * 17) % 13 + 13) % 13 === 0 && r > 4) id = ICE; // shimmer
    }
    block(x, y, FZ, id);
    block(x, y, FZ + 1, id);
  }
}

// --- tail coverts joining body to the fan hub ---
cube(-2, 5, 3, 2, 9, 7, LEAVES);
cube(-1, 9, 5, 1, 11, 7, LEAVES);

// --- body (royal blue), chest toward camera (-Z) ---
sphere(0, 6, 1, 3, GLASS);
sphere(0, 6, -1, 3, GLASS);
cube(-1, 5, -4, 1, 7, -4, ICE);            // iridescent chest sheen
cube(3, 5, -1, 3, 7, 2, SAND);             // folded wing panels
cube(-3, 5, -1, -3, 7, 2, SAND);

// --- S-curved neck ---
const NECK = [[8, -2], [9, -3], [10, -3], [11, -4], [12, -4], [13, -5], [14, -5]];
for (const p of NECK) cube(-1, p[0], p[1], 1, p[0], p[1], GLASS);

// --- head, eyes, beak, crest ---
sphere(0, 15, -5, 2, GLASS);
block(2, 15, -6, SNOW);
block(-2, 15, -6, SNOW);
block(0, 15, -8, SAND);
block(0, 14, -8, SAND);
block(0, 14, -7, SAND);
block(0, 18, -5, GLASS);
block(0, 19, -5, ICE);
block(-1, 18, -5, GLASS);
block(1, 18, -5, GLASS);
block(-2, 19, -5, ICE);
block(2, 19, -5, ICE);

// --- legs + toes ---
cube(-1, 0, 1, -1, 4, 1, OAK_LOG);
cube(1, 0, 1, 1, 4, 1, OAK_LOG);
block(-1, 0, 0, SAND);
block(1, 0, 0, SAND);
block(-1, 0, 2, SAND);
block(1, 0, 2, SAND);

// --- peahen companion (brown, front-east) ---
sphere(9, 3, -5, 2, PLANKS);
cube(8, 4, -3, 10, 5, -2, OAK_LOG);        // plain raised tail
cube(8, 0, -5, 8, 1, -5, OAK_LOG);
cube(10, 0, -5, 10, 1, -5, OAK_LOG);
block(9, 5, -6, PLANKS);
block(9, 6, -6, PLANKS);
block(9, 7, -7, PLANKS);
sphere(9, 8, -7, 1, PLANKS);
block(9, 8, -9, SAND);
block(9, 10, -7, ICE);

// --- two chicks pecking in front ---
sphere(5, 1, -8, 1, SNOW);
block(5, 2, -9, SNOW);
block(5, 2, -10, SAND);
sphere(2, 1, -10, 1, SNOW);
block(2, 2, -11, SNOW);

// --- a dropped train feather lying on the terrace (west) ---
line(-12, 0, -3, -10, 0, -5, SAND);
disk(-9, 0, -6, 2, LEAVES);
block(-9, 0, -6, GLASS);
block(-8, 0, -6, ICE);
block(-10, 0, -6, ICE);
block(-9, 0, -5, ICE);
block(-9, 0, -7, ICE);

// --- flowers ringing the terrace ---
const FLOWERS = [[11, -3], [-11, -3], [7, -9], [-7, -9], [12, 2], [-12, 2], [4, -11], [-4, -11]];
for (let i = 0; i < FLOWERS.length; i++) {
  const f = FLOWERS[i];
  block(f[0], 0, f[1], LEAVES);
  block(f[0], 1, f[1], i % 2 === 0 ? BRICK : SNOW);
}