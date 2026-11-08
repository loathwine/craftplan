// mech-owl-haiku55 — prompt:
// a giant mechanical owl...

// ---------- helpers ----------
function ell(cx, cy, cz, rx, ry, rz, id, k) {
  // k = shell thickness as a fraction of radius (1 = solid)
  const inner = (1 - k) * (1 - k);
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
        if (d <= 1 && d >= inner) block(x, y, z, id);
      }
}
function ellPlate(cx, cy, z, rx, ry, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) block(x, y, z, id);
}
function disc(cx, cy, z, r, id, ring) {
  const R = Math.ceil(r);
  for (let x = cx - R; x <= cx + R; x++)
    for (let y = cy - R; y <= cy + R; y++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= r && (!ring || d > r - 1)) block(x, y, z, id);
    }
}

// ---------- clear the site (owl footprint + wingspan) ----------
cube(-12, 0, -8, 12, 32, 8, AIR);

// ---------- pedestal: stone plinth, cobble top, gold trim, corner lamps ----------
cube(-9, -2, -6, 9, -2, 6, STONE);
cube(-9, -1, -6, 9, -1, 6, COBBLE);
hollowCube(-9, -1, -6, 9, -1, 6, GOLD);
for (const [px, pz] of [[-8, -5], [8, -5], [-8, 5], [8, 5]]) {
  line(px, 0, pz, px, 1, pz, IRON);
  block(px, 2, pz, GLOWSTONE);
}

// ---------- legs and talons ----------
for (const s of [-1, 1]) {
  cube(s * 3 - 1, 0, -1, s * 3 + 1, 4, 1, IRON);     // legs
  cube(s * 3 - 1, 0, -3, s * 3 + 1, 0, -2, IRON);    // ankle plates
  for (const t of [-1, 0, 1]) line(s * 3 + t, 0, -6, s * 3 + t, 0, -4, GOLD); // talons
}

// ---------- fan tail (behind body, +Z) ----------
for (let z = 4; z <= 9; z++) {
  const w = 2 + (z - 4);
  for (let x = -w; x <= w; x++)
    for (let y = 4; y <= 10; y++)
      block(x, y, z, (x + y + z) % 2 ? COPPER : GOLD);
  block(0, 4, z, IRON);
  for (let y = 4; y <= 10; y++) block(0, y, z, IRON); // central rib
}

// ---------- body: hollow iron egg shell ----------
ell(0, 11, 0, 6, 9, 5, IRON, 0.25);

// ---------- chest: copper breast plate with glowing gear ----------
ellPlate(0, 12, -6, 3, 4, COPPER);
disc(0, 12, -7, 2.5, IRON, true);
block(0, 12, -7, GLOWSTONE);
block(0, 15, -7, IRON);
block(0, 9, -7, IRON);
block(-3, 12, -7, IRON);
block(3, 12, -7, IRON);

// ---------- wings: folded plates of alternating iron / copper / gold feathers ----------
const FEATHERS = [IRON, COPPER, GOLD];
for (const s of [-1, 1]) {
  for (let y = 9; y <= 20; y++) {
    const outer = y <= 12 ? 12 : (y <= 16 ? 11 : 9);
    for (let x = 7; x <= outer; x++)
      for (let z = -3; z <= 3; z++)
        block(s * x, y, z, FEATHERS[(x + y) % 3]);
  }
  // hanging primary feathers at the wing tips
  for (let x = 8; x <= 12; x++)
    for (let z = -2; z <= 2; z += 2) block(s * x, 8, z, GOLD);
  // shoulder joint
  block(s * 7, 20, 0, GOLD);
}

// ---------- head: solid iron ellipsoid ----------
ell(0, 23, -1, 6, 5, 5, IRON, 1);

// ---------- facial disc (flattened light-gray blob on the front) ----------
ell(0, 22, -5, 5, 4, 2, LIGHT_GRAY, 1);

// ---------- eyes: gold rims, iron lenses, glowing blue cores ----------
for (const ex of [-3, 3]) {
  disc(ex, 23, -7, 2.5, GOLD, true);
  disc(ex, 23, -7, 1.5, IRON, false);
  for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]])
    block(ex + dx, 23 + dy, -7, NEON_BLUE);
  block(ex, 23, -8, NEON_BLUE);
}

// ---------- beak ----------
cube(-1, 20, -8, 1, 21, -7, GOLD);
line(0, 18, -7, 0, 19, -7, GOLD);

// ---------- ear tufts and antenna ----------
cube(-4, 27, -1, -3, 30, -1, COPPER);
block(-4, 31, -1, COPPER);
cube(3, 27, -1, 4, 30, -1, COPPER);
block(4, 31, -1, COPPER);
line(0, 28, -1, 0, 31, -1, IRON);
block(0, 32, -1, NEON_RED);

// ---------- shoulder exhaust pipes with steam ----------
for (const s of [-1, 1]) {
  line(s * 5, 14, 2, s * 5, 19, 2, IRON);
  block(s * 5, 20, 2, STEAM);
}