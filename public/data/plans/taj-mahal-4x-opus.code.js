// taj-mahal-4x-opus — prompt:
// the Taj Mahal...

const meta = {}; // (ignored — sandbox harness expects plain JS below)

// ---- Taj Mahal ----------------------------------------------------------
// White marble mausoleum: raised twin-tier plinth, chamfered (octagonal)
// main block with tall pishtaq arch-frames, central onion dome + drum,
// four corner chattris, four corner minarets, a reflecting pool and
// flanking cypress trees in the foreground (north). Front faces -Z.

const M = SNOW;   // white marble
const T = ICE;    // pale cyan finial / trim accents
const P = GLASS;  // reflecting pool (blue)

// ---------- octagon helpers ----------
const HALF = 8, DIAG = 13;             // square half-width, corner-chamfer diagonal
function inOct(x, z) {
  return Math.abs(x) <= HALF && Math.abs(z) <= HALF && (Math.abs(x) + Math.abs(z)) <= DIAG;
}

// ---------- 1. PLINTH (two tiers) ----------
cube(-14, 0, -12, 14, 0, 12, M);       // lower terrace top
cube(-14, -1, -12, 14, -1, 12, M);     // lower terrace face (1 down, hides step)
cube(-12, 1, -10, 12, 1, 10, M);       // upper terrace

// ---------- 2. MAIN BLOCK (hollow octagonal walls y=2..11) ----------
for (let y = 2; y <= 11; y++) {
  for (let x = -HALF; x <= HALF; x++) {
    for (let z = -HALF; z <= HALF; z++) {
      if (!inOct(x, z)) continue;
      const boundary = !(inOct(x - 1, z) && inOct(x + 1, z) && inOct(x, z - 1) && inOct(x, z + 1));
      if (boundary) block(x, y, z, M);
    }
  }
}
// solid roof slab
for (let x = -HALF; x <= HALF; x++)
  for (let z = -HALF; z <= HALF; z++)
    if (inOct(x, z)) block(x, 11, z, M);

// vertical corner accents (marble pilasters on the four chamfers)
for (const [sx, sz] of [[1,1],[1,-1],[-1,1],[-1,-1]]) {
  for (let y = 2; y <= 11; y++) block(sx * 5, y, sz * 8, M), block(sx * 8, y, sz * 5, M);
}

// ---------- 3. PISHTAQ FRAMES (proud arch panels) ----------
// front panel (tallest), z = -9
for (let x = -5; x <= 5; x++)
  for (let y = 2; y <= 13; y++) block(x, y, -9, M);
block(0, 14, -9, T);                                   // finial dot
// side panels, x = -9 / x = 9
for (let z = -5; z <= 5; z++)
  for (let y = 2; y <= 11; y++) { block(-9, y, z, M); block(9, y, z, M); }
// back panel, z = 9
for (let x = -5; x <= 5; x++)
  for (let y = 2; y <= 11; y++) block(x, y, 9, M);

// ---------- 4. CARVE POINTED ARCHES (AIR is free) ----------
function pointTop(a) { return 7 + (3 - Math.abs(a)); }   // apex 10 at center
// front (-Z)
for (let x = -3; x <= 3; x++)
  for (let y = 2; y <= pointTop(x); y++)
    for (let z = -9; z <= -5; z++) block(x, y, z, AIR);
// back (+Z)
for (let x = -3; x <= 3; x++)
  for (let y = 2; y <= pointTop(x); y++)
    for (let z = 5; z <= 9; z++) block(x, y, z, AIR);
// left (-X)
for (let z = -3; z <= 3; z++)
  for (let y = 2; y <= pointTop(z); y++)
    for (let x = -9; x <= -5; x++) block(x, y, z, AIR);
// right (+X)
for (let z = -3; z <= 3; z++)
  for (let y = 2; y <= pointTop(z); y++)
    for (let x = 5; x <= 9; x++) block(x, y, z, AIR);

// small blind arches flanking each pishtaq (surface detail on front)
for (const cx of [-6, 6]) {
  for (let y = 3; y <= 6; y++) block(cx, y, -8, AIR);
  block(cx, 7, -8, AIR);
}

// ---------- 5. DRUM + ONION DOME + FINIAL ----------
// drum ring (hollow) y=11..14
for (let y = 11; y <= 14; y++)
  for (let x = -6; x <= 6; x++)
    for (let z = -6; z <= 6; z++) {
      const d = Math.sqrt(x * x + z * z);
      if (d <= 6 && d > 5) block(x, y, z, M);
    }

// solid onion dome, radius profile per layer
const domeR = { 15: 4, 16: 5, 17: 6, 18: 6, 19: 5, 20: 4, 21: 3, 22: 2, 23: 2, 24: 1, 25: 1 };
for (const yStr in domeR) {
  const y = +yStr, r = domeR[yStr];
  disk(0, y, 0, r, M);
}
// neck accent ring
for (let x = -6; x <= 6; x++)
  for (let z = -6; z <= 6; z++) {
    const d = Math.sqrt(x * x + z * z);
    if (d <= 6 && d > 5) block(x, 15, z, T);
  }
// finial spire
cylinder(0, 26, 0, 0, 4, M);   // thin mast y=26..29
block(0, 30, 0, T);            // crowning tip

// ---------- 6. CHATTRIS (four small domed kiosks on the roof) ----------
for (const [cx, cz] of [[-5,-5],[5,-5],[-5,5],[5,5]]) {
  // four little pillars
  for (const [dx, dz] of [[-1,-1],[1,-1],[-1,1],[1,1]])
    for (let y = 12; y <= 14; y++) block(cx + dx, y, cz + dz, M);
  disk(cx, 15, cz, 2, M);       // canopy base
  disk(cx, 16, cz, 1, M);       // small dome
  block(cx, 17, cz, T);         // tip
}

// ---------- 7. MINARETS (four corner towers) ----------
function minaret(cx, cz) {
  for (let y = 2; y <= 21; y++) cylinder(cx, y, cz, 1, 1, M);   // shaft
  disk(cx, 8, cz, 2, M);        // lower balcony
  disk(cx, 14, cz, 2, M);       // upper balcony
  disk(cx, 22, cz, 2, M);       // crown balcony
  disk(cx, 23, cz, 1, M);       // little dome
  block(cx, 24, cz, T);         // tip
}
minaret(-12, -10);
minaret(12, -10);
minaret(-12, 10);
minaret(12, 10);

// ---------- 8. FOREGROUND: reflecting pool + cypress trees (north) ----------
// clear any terrain/trees in the pool zone, then lay water
for (let x = -3; x <= 3; x++)
  for (let z = -21; z <= -15; z++)
    for (let y = 1; y <= 8; y++) block(x, y, z, AIR);
for (let x = -3; x <= 3; x++)
  for (let z = -21; z <= -15; z++) block(x, 0, z, P);
// marble kerb around the pool
for (let z = -22; z <= -14; z++) { block(-4, 0, z, M); block(4, 0, z, M); }
for (let x = -4; x <= 4; x++) { block(x, 0, -22, M); block(x, 0, -14, M); }

// flanking cypress trees
function cypress(cx, cz) {
  for (let y = 0; y <= 6; y++) block(cx, y, cz, OAK_LOG);
  for (let y = 2; y <= 7; y++) {
    const r = y >= 6 ? 0 : (y >= 4 ? 1 : 1);
    for (let dx = -r; dx <= r; dx++)
      for (let dz = -r; dz <= r; dz++)
        if (Math.abs(dx) + Math.abs(dz) <= r + 1) block(cx + dx, y, cz + dz, LEAVES);
  }
  block(cx, 8, cz, LEAVES);
}
cypress(-8, -18);
cypress(8, -18);
cypress(-11, -16);
cypress(11, -16);