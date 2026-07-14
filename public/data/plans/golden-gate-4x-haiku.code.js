// golden-gate-4x-haiku — prompt:
// the Golden Gate Bridge...

// GOLDEN GATE BRIDGE - Detailed Voxel Model
// Iconic red suspension bridge with detailed towers, cables, and deck

const RED = 10;     // BRICK - tower (International Orange)
const CABLE = 11;   // GLASS - cables (translucent detail)
const DECK_GRAY = 8; // COBBLE - roadway
const STEEL = 3;    // STONE - structural detail
const ACCENT = 7;   // PLANKS - deck markings

// Tower positions
const LT = -12;     // Left tower X
const RT = 12;      // Right tower X
const TZ = 0;       // Tower Z center
const TH = 28;      // Tower height
const DH = 10;      // Deck height

// === LEFT SUSPENSION TOWER ===
// Main tower shaft (structural core)
cube(LT - 2, 0, TZ - 1, LT + 1, TH, TZ + 1, RED);

// Tower base - foundation spread
cube(LT - 4, -2, TZ - 3, LT + 3, 2, TZ + 3, STEEL);

// Tower cap - distinctive top
cube(LT - 3, TH - 1, TZ - 2, LT + 2, TH + 3, TZ + 2, RED);

// Tower side buttress (adds depth/detail)
cube(LT - 3, 6, TZ - 2, LT - 2, TH - 4, TZ + 2, RED);

// === RIGHT SUSPENSION TOWER (mirror) ===
cube(RT - 1, 0, TZ - 1, RT + 2, TH, TZ + 1, RED);
cube(RT - 3, -2, TZ - 3, RT + 4, 2, TZ + 3, STEEL);
cube(RT - 2, TH - 1, TZ - 2, RT + 3, TH + 3, TZ + 2, RED);
cube(RT + 2, 6, TZ - 2, RT + 3, TH - 4, TZ + 2, RED);

// === MAIN DECK ===
// Primary roadway (thick for visibility)
cube(-11, DH, -10, 11, DH + 2, 10, DECK_GRAY);

// Deck lanes/markings (adds visual detail)
for (let z = -9; z <= 8; z += 4) {
  cube(-11, DH + 2, z, 11, DH + 2, z + 1, ACCENT);
}

// Deck railing structure (both sides)
for (let z = -10; z <= 10; z += 1) {
  block(-12, DH + 1, z, STEEL);
  block(12, DH + 1, z, STEEL);
}

// === MAIN SUSPENSION CABLES ===
// Left pair of main cables (anchor to tower top → deck anchor)
line(LT - 2, TH - 1, -10, -11, DH + 2, -10, CABLE);
line(LT - 2, TH - 1, 10, -11, DH + 2, 10, CABLE);

// Right pair (mirror)
line(RT + 2, TH - 1, -10, 11, DH + 2, -10, CABLE);
line(RT + 2, TH - 1, 10, 11, DH + 2, 10, CABLE);

// === VERTICAL SUSPENDER CABLES ===
// Cables hanging from main cables to support the deck
for (let z = -9; z <= 9; z += 2) {
  for (let x = -10; x <= 10; x += 3) {
    // Height varies - higher toward middle (sag in cables)
    let suspenderHeight = DH + 2 + Math.floor(Math.abs(x - 0) / 11 * 7);
    line(x, DH + 2, z, x, suspenderHeight, z, CABLE);
  }
}

// === TOWER INTERNAL STRUCTURE ===
// Lattice bracing for realistic appearance
for (let y = 8; y < TH - 6; y += 6) {
  // Left tower bracing
  cube(LT - 1, y, TZ - 1, LT, y + 2, TZ + 1, STEEL);
  cube(LT + 1, y, TZ - 1, LT, y + 2, TZ + 1, STEEL);
  
  // Right tower bracing
  cube(RT, y, TZ - 1, RT + 1, y + 2, TZ + 1, STEEL);
  cube(RT - 1, y, TZ - 1, RT + 1, y + 2, TZ + 1, STEEL);
}

// === APPROACH STRUCTURES / ANCHORAGES ===
// Left side anchorage (massive cable anchor block)
cube(LT - 5, 2, TZ - 2, LT - 3, 8, TZ + 2, DECK_GRAY);
cube(LT - 6, 1, TZ - 3, LT - 2, 5, TZ + 3, STEEL);

// Right side anchorage (mirror)
cube(RT + 3, 2, TZ - 2, RT + 5, 8, TZ + 2, DECK_GRAY);
cube(RT + 2, 1, TZ - 3, RT + 6, 5, TZ + 3, STEEL);

// === ADDITIONAL TOWER DETAIL ===
// Mid-tower expansion bands (structural rings)
for (let y = 12; y < TH - 8; y += 8) {
  cube(LT - 3, y, TZ - 1, LT + 2, y + 1, TZ + 1, STEEL);
  cube(RT - 2, y, TZ - 1, RT + 3, y + 1, TZ + 1, STEEL);
}

// === CROSS-CABLES (Secondary support) ===
// Diagonal bracing cables between towers
line(LT, 20, TZ - 1, RT, 20, TZ + 1, CABLE);
line(LT, 15, TZ + 1, RT, 15, TZ - 1, CABLE);