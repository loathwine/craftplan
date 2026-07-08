// sea-serpent-4x-opus — prompt:
// a sea serpent...

const meta = undefined;

// ---- palette ----
const BODY = LEAVES;   // green scales
const BELLY = SNOW;    // pale underside
const SPINE = STONE;   // grey ribs / horns
const FIN = ICE;       // aquatic fin membrane
const WATER = GLASS;   // sea surface
const TEETH = SNOW;
const MOUTH = BRICK;
const EYE = SNOW;
const PUPIL = OAK_LOG;

const lerp = (a, b, t) => a + (b - a) * t;
const R = Math.round;
const clampY = y => Math.max(-8, Math.min(33, y));

// ============================================================
// 1. THE SEA  — a broad surface the serpent weaves through
// ============================================================
// single opaque layer at foot-level, sitting on the grass below
cube(-13, -1, -18, 13, -1, 20, WATER);
// a couple of darker/rippled patches for depth variation
cube(-9, -1, -2, -2, -1, 6, ICE);
cube(3, -1, 8, 10, -1, 14, ICE);

// ============================================================
// 2. SERPENT CENTERLINE  (head at -Z / NORTH, tail toward +Z)
//    [x, y, z, radius]
// ============================================================
const cp = [
  [1, 9, -20, 1.1],   // snout tip
  [1, 10, -18, 2.2],  // upper snout
  [1, 11, -16, 3.0],  // skull
  [0, 9, -14, 2.9],   // reared neck
  [-1, 6, -12, 2.8],  // neck curve
  [0, 3, -10, 2.8],   // diving toward water
  [1, 0, -8, 2.8],    // enters the sea
  [3, 4, -5, 2.7],    // hump 1 rising
  [3, 6, -3, 2.6],    // hump 1 crest
  [1, 0, 0, 2.6],     // dip 1 (submerged)
  [-2, 4, 3, 2.5],    // hump 2 rising
  [-3, 6, 5, 2.4],    // hump 2 crest
  [-1, 0, 8, 2.2],    // dip 2
  [2, 3, 11, 1.9],    // hump 3
  [1, 0, 14, 1.4],    // dip 3
  [-1, 2, 17, 0.9],   // tail rising
  [-3, 3, 20, 0.5],   // tail tip
];

// densify into a smooth path
const path = [];
for (let i = 0; i < cp.length - 1; i++) {
  const [x0, y0, z0, r0] = cp[i];
  const [x1, y1, z1, r1] = cp[i + 1];
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const steps = Math.max(1, Math.ceil(dist * 2));
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    path.push([
      lerp(x0, x1, t),
      lerp(y0, y1, t),
      lerp(z0, z1, t),
      lerp(r0, r1, t),
    ]);
  }
}

// ============================================================
// 3. BODY TUBE  + pale belly on the arches
// ============================================================
for (let i = 0; i < path.length; i++) {
  const [x, y, z, r] = path[i];
  sphere(R(x), clampY(R(y)), R(z), r, BODY);
  // belly stripe only where the coil rises out of the water (visible)
  if (y > 2.2) {
    block(R(x), clampY(R(y - r)), R(z), BELLY);
    block(R(x) - 1, clampY(R(y - r + 0.5)), R(z), BELLY);
  }
}

// ============================================================
// 4. DORSAL SAIL / CREST  (ICE web with STONE rib caps)
//    skip the very head points (i>=6)
// ============================================================
for (let i = 6; i < path.length; i++) {
  const [x, y, z, r] = path[i];
  const base = R(y + r);
  // sail peaks over the mid-humps, shrinks to the tail
  const frac = 1 - (i - 6) / (path.length - 6);
  const sail = Math.max(1, R(1 + r * 0.9 * (0.4 + 0.6 * frac)));
  for (let h = 1; h < sail; h++) {
    block(R(x), clampY(base + h), R(z), FIN);
  }
  // rib cap swept slightly backward (+Z)
  if (i % 2 === 0) {
    block(R(x), clampY(base + sail), R(z), SPINE);
    block(R(x), clampY(base + sail), R(z) + 1, SPINE);
  }
}

// ============================================================
// 5. HEAD DETAIL
// ============================================================
// upper snout taper
sphere(1, 10, -18, 2.0, BODY);
sphere(1, 10, -20, 1.2, BODY);
// lower jaw (juts forward, leaves an open maw around y=8)
sphere(1, 7, -16, 1.8, BODY);
sphere(1, 7, -18, 1.3, BODY);
sphere(1, 7, -20, 0.9, BODY);

// mouth interior (red) between the jaws
cube(0, 8, -19, 2, 8, -15, MOUTH);

// teeth — upper row hanging down, lower row pointing up
for (const zz of [-19, -18, -17, -16]) {
  block(0, 8, zz, TEETH);   // upper fang
  block(2, 9, zz, TEETH);
}
for (const zz of [-19, -18, -17]) {
  block(1, 7, zz, TEETH);   // lower fang
}

// eyes on the north face, glaring forward
for (const ex of [-1, 3]) {
  block(ex, 12, -18, EYE);
  block(ex, 12, -18 - 1, PUPIL);   // pupil at very front
  block(ex, 13, -18, BRICK);       // angry brow ridge
}

// horns / frill spikes off the back of the skull, swept up & back
line(-1, 13, -15, -2, 16, -12, SPINE);
line(3, 13, -15, 4, 16, -12, SPINE);
line(1, 14, -14, 1, 17, -11, SPINE);
// small ear-frills
block(-2, 13, -14, FIN);
block(4, 13, -14, FIN);

// nostrils
block(0, 11, -20, MOUTH);
block(2, 11, -20, MOUTH);

// ============================================================
// 6. PECTORAL FINS  (where the neck slides into the sea)
// ============================================================
function pecFin(bx, by, bz, dir) {
  for (let r = 1; r <= 4; r++) {
    for (let za = 0; za <= r; za++) {
      block(bx + dir * r, clampY(by - Math.floor(r / 2)), bz + za, FIN);
    }
    block(bx + dir * r, clampY(by - Math.floor(r / 2)), bz, SPINE); // leading rib
  }
}
pecFin(2, 3, -6, 1);    // east fin (catches light)
pecFin(0, 3, -6, -1);   // west fin

// a second pair of smaller fins mid-body at hump 2
pecFin(-2, 4, 4, -1);
pecFin(-4, 4, 4, 1);

// ============================================================
// 7. TAIL FLUKE  — a fanned fin at the tip
// ============================================================
for (let w = -3; w <= 3; w++) {
  const h = 3 - Math.floor(Math.abs(w) / 1.5);
  for (let hh = 0; hh <= h; hh++) {
    block(-3 + w, clampY(3 + hh), 20, FIN);
  }
  block(-3 + w, clampY(3 + h), 20, SPINE);
}

// ============================================================
// 8. FOAM / SPLASH where the body pierces the surface
// ============================================================
function foam(cx, cz) {
  for (const [ox, oz] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[2,1],[-2,-1],[1,2],[-1,-2]]) {
    block(cx + ox, 0, cz + oz, SNOW);
  }
}
foam(1, -8);   // entry point
foam(1, 0);    // dip 1
foam(-1, 8);   // dip 2
foam(1, 14);   // dip 3