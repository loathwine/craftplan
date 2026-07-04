// grogu-4x-fable — prompt:
// Grogu (Baby Yoda)...

// Grogu (Baby Yoda) in his hover pram — force-lifting rocks, with frogs,
// a campfire, mushrooms and mossy Jedi ruins behind.

// --- helpers ---------------------------------------------------------------
function edisk(cy, rx, rz, id) {
  for (let x = -Math.ceil(rx); x <= Math.ceil(rx); x++)
    for (let z = -Math.ceil(rz); z <= Math.ceil(rz); z++)
      if ((x * x) / (rx * rx) + (z * z) / (rz * rz) <= 1.08) block(x, cy, z, id);
}
function ering(cy, r, id, th, zmin) {
  const R = Math.ceil(r);
  for (let x = -R; x <= R; x++)
    for (let z = -R; z <= R; z++) {
      if (zmin !== undefined && z < zmin) continue;
      const d = Math.hypot(x, z);
      if (d <= r + 0.3 && d >= r - th) {
        let b = id;
        if (id === STONE && (x * 3 + z * 5 + cy * 7) % 13 === 0) b = COBBLE;
        block(x, cy, z, b);
      }
    }
}

// --- clear trees / brush from the build footprint --------------------------
cube(-13, 1, -11, 13, 9, 11, AIR);
cube(-8, 10, -8, 8, 12, 8, AIR);

// --- hover pram (egg pod, floating 1 block above ground) -------------------
edisk(2, 4.5, 4.5, STONE);          // bottom cap
edisk(3, 6, 6, STONE);              // lower hull
ering(4, 7.5, STONE, 2);
edisk(4, 6, 6, PLANKS);             // blanket lining the interior
ering(5, 8.5, STONE, 2);
ering(6, 9, STONE, 2);
ering(7, 9, STONE, 2);
ering(8, 8.5, COBBLE, 2);           // trim band
ering(9, 8, STONE, 2);
ering(10, 7.5, COBBLE, 1.8, -3);    // rim, dipped open at the front
for (let k = 0; k < 8; k++) {       // rivet lights on the band
  const a = (k * Math.PI) / 4;
  block(Math.round(8.3 * Math.cos(a)), 8, Math.round(8.3 * Math.sin(a)), SNOW);
}

// --- robe (tan with brown trim) --------------------------------------------
const robe = [[5,5,4.5],[6,5,4.5],[7,5,4.5],[8,5,4.5],[9,5,4.5],[10,5,4.5],[11,4.5,4],[12,4.5,4]];
for (const [y, rx, rz] of robe) {
  edisk(y, rx, rz, PLANKS);
  block(0, y, -Math.floor(rz), OAK_LOG);   // front placket stripe
}
edisk(13, 4.5, 4, OAK_LOG);                // collar
block(-1, 12, -4, OAK_LOG);                // necklace strap
block(1, 12, -4, OAK_LOG);
block(0, 12, -4, SNOW);                    // mudhorn pendant

// --- head (big, green, wrinkly-round) ---------------------------------------
const head = [[14,5,4],[15,6,5],[16,6.5,5],[17,6.5,5],[18,6,5],[19,5.5,4.5],[20,4.5,4],[21,3.5,3],[22,2,1.5]];
for (const [y, rx, rz] of head) edisk(y, rx, rz, LEAVES);

// --- ears (long, tapering, drooping tips) -----------------------------------
for (const s of [-1, 1]) {
  for (let ax = 6; ax <= 13; ax++) {
    let ylo, yhi, zlo, zhi;
    if (ax <= 7)      { ylo = 17; yhi = 18; zlo = -2; zhi = 2; }
    else if (ax <= 9) { ylo = 17; yhi = 18; zlo = -2; zhi = 1; }
    else if (ax <= 10){ ylo = 16; yhi = 17; zlo = -1; zhi = 1; }
    else if (ax <= 11){ ylo = 16; yhi = 17; zlo = -1; zhi = 0; }
    else if (ax <= 12){ ylo = 16; yhi = 16; zlo = -1; zhi = 0; }
    else              { ylo = 15; yhi = 16; zlo = 0;  zhi = 0; }
    for (let y = ylo; y <= yhi; y++)
      for (let z = zlo; z <= zhi; z++) block(s * ax, y, z, LEAVES);
  }
  for (let ax = 6; ax <= 9; ax++) block(s * ax, 17, -2, DIRT); // inner-ear shading
}

// --- face -------------------------------------------------------------------
cube(-4, 16, -5, -2, 17, -4, COBBLE);  // left eye (big + dark, backed into head)
cube(2, 16, -5, 4, 17, -4, COBBLE);    // right eye
block(-3, 17, -5, SNOW);               // glints
block(3, 17, -5, SNOW);
line(-1, 14, -4, 1, 14, -4, COBBLE);   // mouth
block(0, 23, 0, SNOW);                 // wispy white hairs
block(-1, 23, 1, SNOW);
block(2, 23, 0, SNOW);

// --- arms -------------------------------------------------------------------
// right arm raised, using the Force
line(4, 12, 0, 7, 14, -3, OAK_LOG);
line(5, 12, -1, 7, 13, -3, OAK_LOG);
block(8, 14, -3, OAK_LOG);
block(8, 15, -3, LEAVES);
block(9, 15, -3, LEAVES);
block(8, 15, -4, LEAVES);
// left arm gripping the pram rim
line(-4, 12, -1, -5, 11, -4, OAK_LOG);
line(-4, 12, 0, -5, 12, -3, OAK_LOG);
block(-5, 11, -5, LEAVES);
block(-5, 10, -5, LEAVES);
block(-4, 10, -5, LEAVES);
block(-5, 10, -6, LEAVES);             // fingers over the edge

// --- force-lifted rocks spiralling up toward the raised hand ----------------
sphere(10, 15, -6, 1, STONE);
block(12, 17, -8, COBBLE);
block(13, 17, -8, STONE);
block(12, 18, -8, COBBLE);
sphere(9, 19, -4, 1, COBBLE);
block(11, 21, -6, STONE);
block(11, 21, -5, STONE);
block(13, 20, -10, COBBLE);
block(10, 23, -7, STONE);

// --- campfire (front-right) --------------------------------------------------
disk(11, 0, -10, 2, DIRT);
for (let k = 0; k < 8; k++) {
  const a = (k * Math.PI) / 4;
  block(11 + Math.round(2 * Math.cos(a)), 1, -10 + Math.round(2 * Math.sin(a)), COBBLE);
}
block(10, 1, -10, OAK_LOG);
block(12, 1, -10, OAK_LOG);
block(11, 1, -9, OAK_LOG);
block(11, 1, -11, OAK_LOG);
block(11, 2, -10, BRICK);
block(10, 2, -10, BRICK);
block(12, 2, -10, BRICK);
block(11, 2, -9, BRICK);
block(11, 2, -11, BRICK);
block(11, 3, -10, BRICK);
block(11, 4, -10, BRICK);

// --- frogs (snack, currently safe) ------------------------------------------
cube(-11, 0, -10, -8, 0, -9, GRASS);
cube(-10, 1, -10, -9, 2, -9, LEAVES);
block(-11, 1, -10, LEAVES);
block(-8, 1, -10, LEAVES);
block(-10, 3, -10, SNOW);
block(-9, 3, -10, SNOW);
cube(6, -1, 18, 7, -1, 19, DIRT);
cube(6, 0, 18, 7, 1, 19, LEAVES);
block(6, 2, 18, SNOW);
block(7, 2, 18, SNOW);

// --- mushrooms ----------------------------------------------------------------
block(-12, 0, -4, DIRT);
block(-12, 1, -4, PLANKS);
disk(-12, 2, -4, 1, BRICK);
block(-12, 3, -4, BRICK);
block(14, 1, -2, PLANKS);
disk(14, 2, -2, 1, BRICK);
block(14, 3, -2, BRICK);
cube(-13, -1, 6, -13, 0, 6, DIRT);
block(-13, 1, 6, PLANKS);
disk(-13, 2, 6, 1, BRICK);
block(-13, 3, 6, BRICK);

// --- stepping stones out front -----------------------------------------------
block(0, 0, -10, STONE);
block(-2, 0, -11, COBBLE);
block(2, 0, -11, STONE);

// --- mossy Jedi ruins behind ---------------------------------------------------
cube(-10, -1, 10, -9, 5, 11, COBBLE);      // broken pillar
block(-10, 6, 10, COBBLE);
block(-10, 6, 11, LEAVES);
block(-9, 6, 11, LEAVES);
cube(-5, -1, 12, -4, 7, 13, STONE);        // tall pillar
block(-5, 8, 12, STONE);
block(-4, 8, 13, LEAVES);
block(-5, 8, 13, LEAVES);
cube(9, -1, 11, 10, 4, 12, COBBLE);        // stub pillar
block(9, 5, 11, LEAVES);
block(10, 5, 12, LEAVES);
cube(3, -1, 13, 6, -1, 14, DIRT);          // fallen column segment
cube(3, 0, 13, 6, 1, 14, STONE);
block(4, 2, 13, LEAVES);
block(5, 2, 14, LEAVES);
// ruined archway
cube(-2, -1, 16, -1, 5, 17, COBBLE);
cube(4, -1, 16, 5, 5, 17, COBBLE);
cube(-2, 6, 16, 5, 6, 17, STONE);
block(1, 7, 16, STONE);
block(2, 7, 16, STONE);
block(0, 7, 17, LEAVES);
block(3, 7, 16, LEAVES);
block(-2, 7, 17, LEAVES);
// crumbling wall stubs
cube(8, -1, 15, 13, 1, 16, COBBLE);
block(9, 2, 15, COBBLE);
block(12, 2, 16, COBBLE);
block(10, 2, 16, LEAVES);
cube(-13, -1, 15, -11, 1, 16, COBBLE);
block(-12, 2, 15, COBBLE);
block(-13, 2, 16, LEAVES);