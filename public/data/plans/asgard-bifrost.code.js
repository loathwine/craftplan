// asgard-bifrost — prompt:
// A rainbow BIFROST BRIDGE leading up to the golden palace of Asgard. The RAINBOW BRIDGE is the HERO of the scene and MUST be unmistakably multicolored - this is the whole point. THE BRIDGE: a wide flat...

// ===================== BIFROST BRIDGE → ASGARD =====================
// HERO: a wide rainbow causeway sweeping up from the low foreground
// (-Z, low Y) to the golden-and-white palace at the far end (+Z, high Y).

const Z0 = -21, Z1 = 13;          // bridge runs the length of +Z
const LEN = Z1 - Z0;              // 34 long — dominates the scene
const Y0 = 0,  Y1 = 16;           // climbs low-front → high palace gate
const ARC = 3;                    // gentle upward bow of the arc

function deckY(z){
  const t = (z - Z0) / LEN;
  return Math.round(Y0 + (Y1 - Y0) * t + ARC * Math.sin(Math.PI * t));
}

// rainbow row colors across the 7-wide deck (x = -3..3), each row continuous
const STRIPE = [BRICK, SAND, LEAVES, ICE, GLASS, SNOW, BRICK];

// ---------- deck body, rainbow stripes, railings (full length) ----------
for (let z = Z0; z <= Z1; z++){
  const y = deckY(z);
  // keep the rainbow unobstructed: clear any tree canopy above the deck
  cube(-6, y + 1, z, 6, y + 8, z, AIR);
  // cobble bridge body beneath the deck (9 wide, 3 thick) + central keel
  cube(-4, y - 3, z, 4, y - 1, z, COBBLE);
  cube(-1, y - 4, z, 1, y - 4, z, COBBLE);
  // THE RAINBOW: one solid color per lengthwise row, the entire length
  for (let x = -3; x <= 3; x++) block(x, y, z, STRIPE[x + 3]);
  // low cobble railings on both edges (curb + rail)
  block(-4, y, z, COBBLE); block(-4, y + 1, z, COBBLE);
  block( 4, y, z, COBBLE); block( 4, y + 1, z, COBBLE);
}

// railing posts every few blocks for rhythm
for (let z = Z0; z <= Z1; z += 4){
  const y = deckY(z);
  block(-4, y + 2, z, COBBLE);
  block( 4, y + 2, z, COBBLE);
}

// ---------- cobble pillars: the bridge arcs over open air ----------
const pierZ = [-15, -10, -5, 0, 5, 10];
for (const z of pierZ){
  const top = deckY(z) - 5;                         // just under the body
  if (top < 0) continue;                            // front end rests on ground
  cube(-3, -2, z - 1, 3, top, z + 1, COBBLE);       // pier shaft (7 wide, 3 deep)
  cube(-4, -2, z - 1, 4, -1, z + 1, COBBLE);        // wider footing
  block(-4, top, z, COBBLE); block(4, top, z, COBBLE); // shoulder corbels
}

// foreground entrance: two golden-capped posts at the bridge mouth
{
  const y = deckY(Z0);
  cube(-4, y + 1, Z0, -4, y + 3, Z0, COBBLE);
  cube( 4, y + 1, Z0,  4, y + 3, Z0, COBBLE);
  block(-4, y + 4, Z0, SAND);
  block( 4, y + 4, Z0, SAND);
}

// ===================== ASGARD — the palace crowning the far end =====================
const PY  = 16;     // palace platform top (== deckY(Z1))
const PCZ = 17;     // palace center Z

// courtyard floor
cube(-9, PY, 14, 9, PY, 21, SNOW);

// floating foundation, tapering down (Asgard rides the sky)
for (let i = 1; i <= 8; i++){
  const y  = PY - i;
  const hx = Math.max(2, 9 - i);
  const hz = Math.max(1, 4 - ((i - 1) >> 1));
  cube(-hx, y, PCZ - hz, hx, y, PCZ + hz, COBBLE);
}

// ---------- gatehouse with arched opening for the bridge ----------
cube(-6, PY, 14, 6, PY + 7, 15, SNOW);            // gate wall
cube(-3, PY + 1, 13, 3, PY + 4, 16, AIR);         // arch opening
cube(-2, PY + 5, 13, 2, PY + 5, 16, AIR);         // arch shoulders
cube(-1, PY + 6, 13, 1, PY + 6, 16, AIR);         // arch crown
cube(-6, PY + 7, 14, 6, PY + 7, 15, SAND);        // golden cornice
for (let x = -6; x <= 6; x += 2) block(x, PY + 8, 14, COBBLE); // merlons

// ---------- curtain walls linking the towers (white + golden merlons) ----------
function wallX(x1, x2, z, yTop){
  cube(x1, PY, z, x2, yTop, z, SNOW);
  for (let x = x1; x <= x2; x += 2) block(x, yTop + 1, z, SAND);
}
function wallZ(z1, z2, x, yTop){
  cube(x, PY, z1, x, yTop, z2, SNOW);
  for (let z = z1; z <= z2; z += 2) block(x, yTop + 1, z, SAND);
}
wallX(-7, 7, 21, PY + 3);   // back
wallZ(14, 21, -8, PY + 3);  // left
wallZ(14, 21,  8, PY + 3);  // right

// ---------- round SNOW towers with pointed golden SAND spires ----------
function spire(cx, baseY, cz, baseR, topY){
  const hh = topY - baseY;
  for (let i = 0; i <= hh; i++) disk(cx, baseY + i, cz, baseR * (1 - i / hh), SAND);
  block(cx, topY, cz, SAND);                        // sharp tip
}
function tower(cx, cz, r, h){
  cylinder(cx, PY, cz, r, h, SNOW);                 // white shaft
  cylinder(cx, PY, cz, r, 2, COBBLE);               // stone base course
  hollowCylinder(cx, PY + h - 2, cz, r, 1, SAND);   // golden band
  hollowCylinder(cx, PY + h - 1, cz, r, 1, COBBLE); // crenellation
  spire(cx, PY + h, cz, r, PY + h + r + 2);          // pointed golden roof
  const my = PY + (h >> 1);                          // dark window slits
  block(cx, my, cz - r, AIR); block(cx, my + 1, cz - r, AIR);
  block(cx - r, my, cz, AIR); block(cx + r, my, cz, AIR);
}

tower( 0, 18, 3, 11);   // central keep (tallest)
tower(-6, 14, 2,  7);   // gate tower L
tower( 6, 14, 2,  7);   // gate tower R
tower(-7, 20, 2,  9);   // rear tower L
tower( 7, 20, 2,  9);   // rear tower R
tower(-8, 17, 2, 10);   // side tower L (taller — asymmetry)
tower( 8, 17, 2,  6);   // side tower R (shorter)