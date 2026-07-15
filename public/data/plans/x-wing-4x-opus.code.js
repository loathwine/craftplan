// x-wing-4x-opus — prompt:
// an X-wing starfighter...

const meta = {}; // (ignored — this sandbox just wants JS)

// ---- X-WING STARFIGHTER --------------------------------------------------
// Nose points NORTH (-Z) toward the camera; the four S-foils splay into the
// iconic X behind it. Ship flies well above the forest floor.

const C = 18;        // fuselage vertical center
const NOSE = -20;    // nose tip (z)
const BZ0  = -12;    // body front
const BZ1  = 9;      // body rear (engine deck starts)
const SPAN = 15;     // wing length outward
const RISE = 9;      // wing tip vertical offset

// ---------- FUSELAGE ------------------------------------------------------
// Tapered nose cone
for (let z = NOSE; z <= BZ0; z++) {
  const t  = (z - NOSE) / (BZ0 - NOSE);   // 0 at tip -> 1 at body
  const hw = Math.round(t * 1);           // half width  0..1
  const hh = Math.round(t * 1);           // half height 0..1
  cube(-hw, C - hh, z, hw, C + hh, z, SNOW);
}
// Nose tip accent
block(0, C, NOSE, BRICK);
block(0, C, NOSE + 1, BRICK);

// Main body (3 wide x 3 tall)
cube(-1, C - 1, BZ0, 1, C + 1, BZ1, SNOW);
// Dorsal spine + ventral keel greebles
cube(0, C + 2, -8, 0, C + 2, 6, STONE);
cube(0, C - 2, -6, 0, C - 2, 6, STONE);
// Side panel lines
line(-1, C + 1, -6, -1, C + 1, 7, STONE);
line( 1, C + 1, -6,  1, C + 1, 7, STONE);
// Red racing stripes down the flanks
line(-1, C - 1, -4, -1, C - 1, 7, BRICK);
line( 1, C - 1, -4,  1, C - 1, 7, BRICK);

// ---------- COCKPIT / CANOPY ---------------------------------------------
cube(-1, C + 2, -6, 1, C + 2, 2, STONE);   // canopy sill
cube(-1, C + 2, -5, 1, C + 3, 1, GLASS);   // glass bubble
cube(-1, C + 3, -5, 1, C + 3, -5, STONE);  // front windshield frame
cube(-1, C + 3,  1, 1, C + 3, 1, STONE);   // rear frame
block(0, C + 2, -7, SNOW);                 // nose fairing behind canopy front

// ---------- R2 ASTROMECH --------------------------------------------------
cube(-1, C + 2, 3, 1, C + 2, 4, STONE);    // socket
block(0, C + 3, 3, ICE);                   // blue/white dome
block(0, C + 3, 4, ICE);
block(0, C + 4, 3, GLASS);                 // lens

// ---------- CENTRAL REAR ENGINE ------------------------------------------
cube(-1, C - 1, 9, 1, C + 1, 10, STONE);
cube(-1, C - 1, 10, 1, C + 1, 10, ICE);    // exhaust glow

// ---------- WINGS (S-FOILS, four, splayed into X) ------------------------
function wing(sx, sy) {
  let prev = null;
  for (let i = 0; i <= SPAN; i++) {
    const f  = i / SPAN;
    const x  = sx * (2 + i);
    const y  = Math.round(C + sy * f * RISE);
    const zf = Math.round(3 + f * 2);       // leading edge (front)
    const zb = Math.round(15 - f * 1);      // trailing edge (back)
    const lo = prev === null ? y : Math.min(prev, y);
    const hi = prev === null ? y : Math.max(prev, y);
    // main skin + 1 block of thickness toward the hull
    cube(x, lo, zf, x, hi, zb, SNOW);
    cube(x, lo - 1, zf, x, hi - 1, zb, SNOW);
    // grey leading edge
    cube(x, lo, zf, x, hi, zf, STONE);
    // twin red stripes across the chord (X-wing markings)
    const s1 = Math.round(zf + (zb - zf) * 0.30);
    const s2 = Math.round(zf + (zb - zf) * 0.55);
    cube(x, lo, s1, x, hi, s1, BRICK);
    cube(x, lo, s2, x, hi, s2, STONE);
    prev = y;
  }
}
wing( 1,  1);  // upper-right
wing(-1,  1);  // upper-left
wing( 1, -1);  // lower-right
wing(-1, -1);  // lower-left

// ---------- WING-ROOT ENGINE NACELLES (4) --------------------------------
function engine(sx, sy) {
  const cy = C + sy * 2;
  cube(sx * 1, cy - 1, 9,  sx * 3, cy + 1, 16, STONE);  // nacelle
  cube(sx * 1, cy - 1, 9,  sx * 3, cy + 1, 9,  COBBLE); // intake face
  cube(sx * 1, cy - 1, 16, sx * 3, cy + 1, 17, ICE);    // engine glow
}
engine( 1,  1);
engine(-1,  1);
engine( 1, -1);
engine(-1, -1);

// ---------- WINGTIP LASER CANNONS (4, barrels thrust forward) ------------
function cannon(sx, sy) {
  const x = sx * 17;
  const y = Math.round(C + sy * RISE);
  const x0 = Math.min(x, x - sx), x1 = Math.max(x, x - sx);
  const y0 = Math.min(y, y - sy), y1 = Math.max(y, y - sy);
  cube(x0, y0, -8, x1, y1, 18, STONE);   // barrel
  cube(x0, y0, -8, x1, y1, -6, BRICK);   // red muzzle
  cube(x0, y0, 10, x1, y1, 11, COBBLE);  // mid collar
  cube(x0, y0, 17, x1, y1, 18, ICE);     // rear glow
}
cannon( 1,  1);
cannon(-1,  1);
cannon( 1, -1);
cannon(-1, -1);