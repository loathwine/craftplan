// stonehenge-4x-opus — prompt:
// Stonehenge...

// ===== STONEHENGE =====
// Camera looks from NORTH (-Z). Horseshoe of trilithons opens toward the
// viewer; the great (tallest) trilithon closes the ring at the south.

const R = 13;                 // outer sarsen circle radius
function h3(x, y, z) {         // deterministic hash noise for weathering
  let s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function stoneAt(x, y, z) {    // weathered gray: mostly STONE, some COBBLE
  const n = h3(x, y, z);
  if (n < 0.22) return COBBLE;
  return STONE;
}
function fillStone(x0, y0, z0, x1, y1, z1) {
  for (let x = x0; x <= x1; x++)
    for (let y = y0; y <= y1; y++)
      for (let z = z0; z <= z1; z++)
        block(x, y, z, stoneAt(x, y, z));
}
// erode a few random top-corner blocks off an upright for an aged look
function erodeTop(x0, z0, x1, z1, yTop) {
  for (let x = x0; x <= x1; x++)
    for (let z = z0; z <= z1; z++)
      if (h3(x, yTop, z) < 0.30) block(x, yTop, z, AIR);
}

// ---------- 1. CLEAR the wooded site (trees/leaves) over the monument ----------
for (let y = 0; y <= 13; y++)
  for (let x = -20; x <= 20; x++)
    for (let z = -20; z <= 20; z++)
      if (x * x + z * z <= 19 * 19) block(x, y, z, AIR);

// ---------- 2. GROUND: flat chalk-grass plaza + raised henge bank ----------
for (let x = -18; x <= 18; x++)
  for (let z = -18; z <= 18; z++) {
    const d = Math.sqrt(x * x + z * z);
    if (d <= 17) {
      block(x, -2, z, DIRT);
      block(x, -1, z, GRASS);           // level the terrain
    }
    // chalky worn ground inside the circle
    if (d <= 11 && h3(x, 0, z) < 0.10) block(x, 0, z, SNOW);
    if (d <= 15 && d >= 9 && h3(x, 5, z) < 0.05) block(x, 0, z, COBBLE);
    // raised earth bank (ring), broken by a northern entrance causeway
    if (d >= 15 && d <= 17) {
      const entrance = (z < 0 && Math.abs(x) < 3);
      if (!entrance) {
        block(x, -2, z, DIRT);
        block(x, -1, z, DIRT);
        block(x, 0, z, GRASS);
        if (d >= 15.5 && d <= 16.5) block(x, 1, z, GRASS);
      }
    }
  }

// ---------- 3. OUTER SARSEN CIRCLE: uprights + continuous lintel ring ----------
const N = 24;
for (let i = 0; i < N; i++) {
  const th = (i / N) * Math.PI * 2;
  const bx = Math.round(Math.cos(th) * R);
  const bz = Math.round(Math.sin(th) * R);
  const entrance = (bz < -11 && Math.abs(bx) < 4); // northern gap
  if (entrance) continue;
  // slight height variation for a weathered, uneven skyline
  const h = 6 + (h3(bx, 0, bz) < 0.25 ? -1 : 0);
  fillStone(bx - 1, 0, bz - 1, bx, h, bz);
  erodeTop(bx - 1, bz - 1, bx, bz, h);
  // a couple of stones have toppled — leave a fallen slab beside them instead
  if (h3(bx, 9, bz) < 0.10) {
    fillStone(bx - 2, 0, bz + 1, bx, 0, bz + 2);
  }
}
// continuous lintel ring resting on the uprights (y7..8), broken at the entrance
for (let x = -R - 2; x <= R + 2; x++)
  for (let z = -R - 2; z <= R + 2; z++) {
    const d = Math.sqrt(x * x + z * z);
    const entrance = (z < -11 && Math.abs(x) < 4);
    if (d >= 12.0 && d <= 14.2 && !entrance) {
      block(x, 7, z, stoneAt(x, 7, z));
      block(x, 8, z, stoneAt(x, 8, z));
    }
  }

// ---------- 4. INNER BLUESTONE CIRCLE (smaller, weathered, some missing) ----------
const NB = 20, RB = 9;
for (let i = 0; i < NB; i++) {
  const th = (i / NB) * Math.PI * 2;
  const bx = Math.round(Math.cos(th) * RB);
  const bz = Math.round(Math.sin(th) * RB);
  if (h3(bx, 3, bz) < 0.30) continue;      // many bluestones lost to time
  const h = 2 + (h3(bx, 1, bz) < 0.5 ? 1 : 0);
  fillStone(bx, 0, bz, bx, h, bz);
}

// ---------- 5. TRILITHON HORSESHOE (opens NORTH toward camera) ----------
function trilithon(uprights, lintel) {
  for (const u of uprights) {
    fillStone(u[0], 0, u[1], u[2], u[3], u[4]);
    erodeTop(u[0], u[1], u[2], u[4], u[3]);
  }
  fillStone(lintel[0], lintel[1], lintel[2], lintel[3], lintel[4], lintel[5]);
}
// Great Trilithon — south end, tallest
trilithon(
  [[-3, 7, -3, 9, 8], [2, 7, 3, 9, 8]],
  [-3, 10, 7, 3, 11, 8]
);
// SW & SE (span Z, face inward), height 9
trilithon([[-8, 2, -7, 8, 3], [-8, 5, -7, 8, 6]], [-8, 9, 2, -7, 10, 6]);
trilithon([[7, 2, 8, 8, 3], [7, 5, 8, 8, 6]], [7, 9, 2, 8, 10, 6]);
// NW & NE flanks (shortest), height 8 — frame the opening
trilithon([[-9, -3, -8, 7, -2], [-9, 0, -8, 7, 1]], [-9, 8, -3, -8, 9, 1]);
trilithon([[8, -3, 9, 7, -2], [8, 0, 9, 7, 1]], [8, 8, -3, 9, 9, 1]);

// ---------- 6. ALTAR STONE (recumbent slab at the heart of the horseshoe) ----------
fillStone(-1, 0, 3, 1, 1, 6);

// ---------- 7. FALLEN & LEANING STONES (asymmetry, weathering, foreground) ----------
// a great fallen lintel lying on the ground inside the circle
fillStone(-6, 0, -6, -2, 1, -5);
// a leaning collapsed upright
fillStone(11, 0, -6, 12, 0, -5);
fillStone(12, 1, -6, 13, 2, -5);
fillStone(13, 3, -6, 14, 3, -5);
// scattered rubble
fillStone(-11, 0, 6, -10, 0, 7);
fillStone(5, 0, 12, 6, 1, 12);
fillStone(-12, 0, -2, -12, 0, -1);

// ---------- 8. HEEL STONE — the lone outlier north of the entrance ----------
// aligned with the causeway, standing apart in the foreground (toward camera)
fillStone(0, 0, -16, 1, 6, -15);
fillStone(0, 7, -15, 1, 7, -15);         // slight lean toward the ring
block(1, 5, -16, STONE);

// ---------- 9. MOSS of ages: sparse LEAVES clinging to stone bases ----------
for (let x = -14; x <= 14; x++)
  for (let z = -14; z <= 14; z++)
    if (h3(x, 2, z) < 0.03 && (x * x + z * z) <= 15 * 15)
      block(x, 0, z, LEAVES);