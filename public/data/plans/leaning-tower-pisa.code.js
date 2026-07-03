// leaning-tower-pisa — prompt:
// The Leaning Tower of Pisa. TWO CRITICAL FEATURES: (1) it must clearly LEAN - tilt the whole tower so the top is offset 5-6 blocks sideways from the base, an obvious dramatic lean. (2) It must show 8 S...

// ===== The Leaning Tower of Pisa =====
// Slender white-marble tower: 8 stacked tiers, open arcaded galleries,
// dramatically leaning +6 blocks toward +X (sideways to the -Z viewer).

const TOP  = 29;
const LEAN = 6;                              // top sideways offset (blocks)
const lx = (y) => Math.round(LEAN * y / TOP); // tower centre-X at height y

// ---------- ground: grass lawn ----------
disk(0, 0, 0, 16, GRASS);

// clear surrounding trees/foliage so the tower reads clean against the sky
cube(-16, 1, -16, 16, 18, 16, AIR);

// ---------- marble piazza paving ----------
disk(0, 0, 0, 10, SNOW);
hollowCylinder(0, 0, 0, 10, 1, COBBLE);
hollowCylinder(0, 0, 0,  7, 1, STONE);
hollowCylinder(0, 0, 0,  4, 1, COBBLE);
for (let k = 0; k < 8; k++) {
  const a = k * Math.PI / 4;
  line(0, 0, 0, Math.round(10 * Math.cos(a)), 0, Math.round(10 * Math.sin(a)),
       (k % 2) ? STONE : COBBLE);
}
// low bollards ringing the plaza
for (let k = 0; k < 12; k++) {
  const a = k * Math.PI / 6;
  const x = Math.round(11 * Math.cos(a)), z = Math.round(11 * Math.sin(a));
  cube(x, 1, z, x, 2, z, COBBLE);
  block(x, 3, z, SNOW);
}

// ---------- foundation under the tower ----------
for (let y = -3; y <= -1; y++) disk(lx(0), y, 0, 4, STONE);

// ---------- helper: a ring of open colonnade piers ----------
function piers(yb, h, rIn, rOut, n, phase, id) {
  for (let dy = 0; dy < h; dy++) {
    const y = yb + dy, cx = lx(y);
    for (let i = 0; i < n; i++) {
      const a = phase + i * 2 * Math.PI / n;
      for (let r = rIn; r <= rOut; r++) {
        block(cx + Math.round(r * Math.cos(a)), y, Math.round(r * Math.sin(a)), id);
      }
    }
  }
}

// ---------- TIER 1: solid base (y0..5) ----------
for (let y = 0; y <= 5; y++) disk(lx(y), y, 0, 3, SNOW);
// blind-arcade engaged pilasters
for (let y = 1; y <= 4; y++) {
  const cx = lx(y);
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    block(cx + Math.round(3 * Math.cos(a)), y, Math.round(3 * Math.sin(a)), STONE);
  }
}
hollowCylinder(lx(0), 0, 0, 3, 1, COBBLE);   // plinth trim
hollowCylinder(lx(5), 5, 0, 3, 1, COBBLE);   // string course
// arched doorway facing the viewer (-Z)
cube(lx(2) - 1, 1, -3, lx(2) + 1, 2, 0, AIR);

// ---------- TIERS 2..7: six open arcade galleries ----------
const galY = [6, 9, 12, 15, 18, 21];
for (const by of galY) {
  piers(by, 2, 2, 3, 8, Math.PI / 8, STONE);  // open ring of columns, arch at front
  const yf = by + 2;                          // solid floor ring above
  disk(lx(yf), yf, 0, 3, SNOW);
  hollowCylinder(lx(yf), yf, 0, 3, 1, COBBLE); // projecting cornice band
}

// ---------- central newel + spiral stair (seen through the arches) ----------
for (let y = 6; y <= 24; y++) block(lx(y), y, 0, STONE);
for (let y = 6; y <= 24; y++) {
  const th = y * 0.9, cx = lx(y);
  block(cx + Math.round(1.7 * Math.cos(th)), y, Math.round(1.7 * Math.sin(th)), SNOW);
}

// ---------- TIER 8: narrower bell chamber (y24..29) ----------
piers(24, 3, 1, 2, 6, 0, STONE);             // taller, slimmer colonnade
block(lx(25), 25, 0, COBBLE);                // the bell
block(lx(26), 26, 0, COBBLE);
disk(lx(27), 27, 0, 2, SNOW);                // chamber roof
hollowCylinder(lx(27), 27, 0, 2, 1, COBBLE);
disk(lx(28), 28, 0, 1, SNOW);                // little cupola
block(lx(29), 29, 0, SNOW);
block(lx(30), 30, 0, COBBLE);                // finial
block(lx(31), 31, 0, COBBLE);