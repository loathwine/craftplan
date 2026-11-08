// airship-haiku55 — prompt:
// a steampunk airship...

// ===== STEAMPUNK AIRSHIP =====
// Main airship: long axis east-west, nose east (+X), gondola on the north-facing side.
// Smaller airship drifts in the background to the south (+Z).

const MAIN = { cx: 0, cy: 24, cz: 0, A: 14, R0: 7 };
const SMALL = { cx: 12, cy: 28, cz: 14, A: 8, R0: 4 };

function envR(e, x) {
  const t = (x - e.cx) / e.A;
  const v = 1 - t * t;
  return v <= 0 ? 0 : e.R0 * Math.sqrt(v);
}

// Hollow ellipsoid envelope: canvas bands along X, optional rope netting, brass rivets on the equator.
function envelope(e, bandW, rope) {
  const x0 = e.cx - e.A + 1;
  const x1 = e.cx + e.A - 1;
  for (let x = x0; x <= x1; x++) {
    const r = envR(e, x);
    if (r < 0.5) continue;
    const inner = Math.max(0, r - 1.3);
    const band = Math.floor((x - x0) / bandW) % 2 === 0 ? SAND : BROWN;
    const lim = Math.ceil(r) + 1;
    for (let dy = -lim; dy <= lim; dy++) {
      for (let dz = -lim; dz <= lim; dz++) {
        const d2 = dy * dy + dz * dz;
        if (d2 > r * r + 0.5 || d2 <= inner * inner) continue;
        let id = band;
        if (rope && ((dy + dz) % 4 === 0 || (dy - dz) % 4 === 0)) id = PLANKS;
        if (dy === 0 && Math.abs(dz) >= r - 1 && x % 2 === 0) id = GOLD;
        block(x, e.cy + dy, e.cz + dz, id);
      }
    }
  }
}

// ---------- envelopes ----------
envelope(MAIN, 3, true);
envelope(SMALL, 2, false);

// ---------- tail fins (red) ----------
for (let x = -15; x <= -12; x++) {
  const top = Math.round(30 - (x + 15) * 1.5);
  for (let y = 22; y <= top; y++) block(x, y, 0, RED);
}
for (let x = -15; x <= -13; x++) {
  const w = Math.round(5 - (x + 15) * 1.5);
  for (let z = -w; z <= w; z++) block(x, 24, z, RED);
}

// ---------- keel catwalk under the envelope ----------
cube(-12, 15, -1, 12, 15, 1, PLANKS);
line(-12, 16, -1, 12, 16, -1, COPPER);
line(-12, 16, 1, 12, 16, 1, COPPER);

// ---------- gondola hull ----------
cube(-6, 9, -2, 6, 13, 2, PLANKS);
cube(-5, 10, -1, 5, 12, 1, AIR);

// copper corner posts and edge trim
for (const x of [-6, 6]) for (const z of [-2, 2]) line(x, 9, z, x, 13, z, COPPER);
line(-6, 9, -2, 6, 9, -2, COPPER);
line(-6, 9, 2, 6, 9, 2, COPPER);
line(-6, 13, -2, 6, 13, -2, COPPER);
line(-6, 13, 2, 6, 13, 2, COPPER);
line(-6, 13, -2, -6, 13, 2, COPPER);
line(6, 13, -2, 6, 13, 2, COPPER);

// windows with iron mullions and gold sill on both long faces
for (const z of [-2, 2]) {
  for (let x = -5; x <= 5; x++) {
    const glass = (x + 5) % 2 === 0;
    line(x, 10, z, x, 11, z, glass ? GLASS : IRON);
    block(x, 12, z, GOLD);
  }
}

// interior: crates, engine block, helm
cube(-4, 10, 0, -3, 11, 0, PLANKS);
cube(1, 10, -1, 3, 11, 1, COPPER);
block(5, 10, 0, GOLD);
line(5, 11, 0, 5, 12, 0, IRON);

// deck rails
line(-6, 14, -2, 6, 14, -2, IRON);
line(-6, 14, 2, 6, 14, 2, IRON);
line(-6, 14, -2, -6, 14, 2, IRON);
line(6, 14, -2, 6, 14, 2, IRON);

// ---------- roof machinery ----------
cube(-5, 14, -1, -3, 15, 1, COPPER); // boiler (port)
cube(3, 14, -1, 5, 15, 1, COPPER);   // boiler (starboard)
block(-4, 16, 0, STEAM);             // vents
block(4, 16, 0, STEAM);

// pilot cabin with glass front
cube(-1, 14, -1, 1, 16, 1, COPPER);
for (let x = -1; x <= 1; x++) block(x, 15, -1, GLASS);

// ---------- suspension struts (envelope to gondola) ----------
for (const x of [-6, -2, 2, 6]) {
  const yb = Math.round(MAIN.cy - envR(MAIN, x));
  line(x, 14, 0, x, yb, 0, IRON);
}

// ---------- belly cannon and hanging ballast ----------
block(0, 8, -2, IRON);
line(0, 8, -3, 0, 8, -5, IRON);
block(0, 8, -6, GOLD);
sphere(-3, 7, 0, 1, SAND);
sphere(4, 7, 1, 1, SAND);

// ---------- side propellers ----------
line(-8, 11, 0, -6, 11, 0, IRON);
line(6, 11, 0, 8, 11, 0, IRON);
for (const px of [-8, 8]) {
  block(px, 11, 0, GOLD);
  line(px, 7, 0, px, 15, 0, IRON);
  block(px, 7, 0, GOLD);
  block(px, 15, 0, GOLD);
}

// ---------- top flag and pole ----------
line(0, 32, 0, 0, 33, 0, IRON);
cube(1, 32, 0, 3, 33, 0, RED);

// ---------- mooring mast (ground to gondola) ----------
cube(-2, 0, -2, 2, 0, 2, COBBLE);
for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) line(x, 1, z, x, 8, z, IRON);
for (const y of [3, 6]) {
  line(-1, y, -1, 1, y, -1, IRON);
  line(-1, y, 1, 1, y, 1, IRON);
  line(-1, y, -1, -1, y, 1, IRON);
  line(1, y, -1, 1, y, 1, IRON);
}

// ---------- ground foreground props ----------
cylinder(-7, 0, -5, 1, 2, COPPER);
cube(3, 0, -6, 4, 1, -5, PLANKS);
cube(3, 2, -6, 4, 3, -5, PLANKS);
line(5, 0, 3, 5, 4, 3, IRON);
block(5, 5, 3, GLOWSTONE);

// ---------- background airship (south, smaller) ----------
cube(10, 20, 13, 14, 21, 15, PLANKS);
for (let x = 10; x <= 14; x++) block(x, 20, 13, GLASS);
line(11, 22, 14, 11, 24, 14, IRON);
line(13, 22, 14, 13, 24, 14, IRON);
cube(3, 27, 14, 4, 29, 14, RED);