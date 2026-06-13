// wizard-tower — prompt:
// A tall, slender wizard's spire - the TOWER is the entire subject, NOT a hill or mound. CRITICAL PROPORTIONS: a thin cylindrical tower exactly 4-5 blocks in diameter and AT LEAST 28 blocks tall - heigh...

const meta_ignore = null;

// ---------- helpers ----------
function wtex(x, y, z) {
  // weathered masonry: banded STONE/COBBLE with ~25% deterministic flips
  let b = ((y & 1) === 0) ? STONE : COBBLE;
  if (((x * 7 + z * 5 + y * 3) & 3) === 0) b = (b === STONE) ? COBBLE : STONE;
  return b;
}
function obsTex(x, y, z) {
  // observatory wall: timber mullions on the 8 compass dirs, GLASS between
  const isPost = (x === 0 || z === 0 || Math.abs(x) === Math.abs(z));
  return isPost ? OAK_LOG : GLASS;
}
function ringFn(cy, r, fn) {
  const R = Math.ceil(r) + 1;
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d >= r - 0.5 && d <= r + 0.5) block(dx, cy, dz, fn(dx, cy, dz));
  }
}
function fillDiskFn(cy, r, fn) {
  const R = Math.ceil(r) + 1;
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
    if (Math.sqrt(dx * dx + dz * dz) <= r + 0.5) block(dx, cy, dz, fn(dx, cy, dz));
  }
}
function fillDisk(cy, r, id) { fillDiskFn(cy, r, () => id); }
function glassWin(dx, dz, y0, y1) { for (let y = y0; y <= y1; y++) block(dx, y, dz, GLASS); }
function band(baseY, amp, k) {
  // crooked timber band hugging the r=2 wall, height wobbles around the ring
  const r = 2, R = 3;
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d >= r - 0.5 && d <= r + 0.5) {
      const ang = Math.atan2(dz, dx);
      const y = baseY + Math.round(amp * Math.sin(ang * k));
      block(dx, y, dz, OAK_LOG);
    }
  }
}

// ---------- 1. clear a small clearing in the forest (lonely needle) ----------
for (let y = 1; y <= 12; y++) fillDisk(y, 5, AIR);

// ---------- 2. foundation + tiny ground plinth (6-7 footprint) ----------
for (let y = -6; y <= 0; y++) fillDiskFn(y, 2, wtex);
ringFn(0, 3, wtex); // single-step base flare = ~7-block footprint at ground

// ---------- 3. the slender shaft (thin needle, r=2 -> diameter 5) ----------
for (let y = 1; y <= 23; y++) ringFn(y, 2, wtex);

// ---------- 4. crooked OAK_LOG beams banding the masonry ----------
band(8, 1, 2);
band(15, 1, 3);
band(21, 1, 2);

// ---------- 5. four vertical timber corner posts (half-timbered look) ----------
for (let y = 0; y <= 23; y++) {
  block(2, y, 2, OAK_LOG); block(-2, y, 2, OAK_LOG);
  block(2, y, -2, OAK_LOG); block(-2, y, -2, OAK_LOG);
}

// ---------- 6. corbels under the observatory floor ----------
block(3, 23, 0, OAK_LOG); block(-3, 23, 0, OAK_LOG); block(0, 23, 3, OAK_LOG);

// ---------- 7. irregular glowing GLASS windows up the shaft ----------
glassWin(0, -2, 5, 6);
glassWin(2, 0, 8, 8);
glassWin(-2, 0, 10, 11);
glassWin(0, 2, 13, 13);
glassWin(-2, -1, 15, 15);
glassWin(0, -2, 16, 17);
glassWin(2, 1, 19, 19);
glassWin(2, 0, 22, 22);
glassWin(-2, 0, 22, 22);

// ---------- 8. arched entrance at the base (front, -Z) + lantern path ----------
block(0, 1, -2, AIR); block(0, 2, -2, AIR);
block(0, 3, -2, OAK_LOG);                       // lintel
block(0, 0, -3, PLANKS); block(0, 0, -4, PLANKS); // threshold path
block(-1, 1, -4, OAK_LOG); block(-1, 2, -4, GLASS); // lantern post
block(1, 1, -4, OAK_LOG); block(1, 2, -4, GLASS);   // lantern post

// ---------- 9. balcony 1 — front (-Z), floor y=11 ----------
block(0, 12, -2, AIR); block(0, 13, -2, AIR);   // doorway
block(0, 14, -2, OAK_LOG);                       // lintel
block(0, 11, -2, PLANKS);                        // sill
for (let x = -1; x <= 1; x++) { block(x, 11, -3, PLANKS); block(x, 11, -4, PLANKS); }
block(0, 10, -3, OAK_LOG); block(0, 10, -4, OAK_LOG);   // brackets
block(1, 10, -4, OAK_LOG); block(-1, 10, -4, OAK_LOG);
block(-1, 12, -4, OAK_LOG); block(0, 12, -4, OAK_LOG); block(1, 12, -4, OAK_LOG); // rail
block(-1, 12, -3, OAK_LOG); block(1, 12, -3, OAK_LOG);
block(1, 9, -4, GLASS);                          // hanging lantern

// ---------- 10. balcony 2 — right (+X), floor y=18 ----------
block(2, 19, 0, AIR); block(2, 20, 0, AIR);      // doorway
block(2, 21, 0, OAK_LOG);                        // lintel
block(2, 18, 0, PLANKS);                         // sill
for (let z = -1; z <= 1; z++) { block(3, 18, z, PLANKS); block(4, 18, z, PLANKS); }
block(3, 17, 0, OAK_LOG); block(4, 17, 0, OAK_LOG);   // brackets
block(4, 17, -1, OAK_LOG); block(4, 17, 1, OAK_LOG);
block(4, 20, -1, OAK_LOG); block(4, 20, 0, OAK_LOG); block(4, 20, 1, OAK_LOG); // rail
block(3, 20, -1, OAK_LOG); block(3, 20, 1, OAK_LOG);

// ---------- 11. observatory chamber (widens slightly to r=3) ----------
fillDisk(24, 3, PLANKS);          // floor / sill ledge
ringFn(25, 3, obsTex);            // ring of GLASS windows + timber mullions
ringFn(26, 3, obsTex);
ringFn(27, 3, wtex);              // stone lintel / eave course

// ---------- 12. tall pointed BRICK cone roof (wizard's hat) ----------
fillDisk(28, 4, BRICK);           // overhanging eave
fillDisk(29, 3, BRICK);
fillDisk(30, 2, BRICK);
fillDisk(31, 1, BRICK);

// ---------- 13. single GLASS orb finial ----------
sphere(0, 32, 0, 1, GLASS);

// ---------- 14. red banner hanging from the observatory front ----------
for (let y = 20; y <= 23; y++) block(0, y, -3, BRICK);