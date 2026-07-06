// trex-4x-opus — prompt:
// trex...

const meta = null; // (ignored by sandbox)

// ============================================================
//  T-REX  —  roaring tyrannosaur, facing north (-Z)
//  green scaly hide, pale belly, bony back ridge, jaws agape
// ============================================================
const SKIN  = LEAVES;   // green hide
const BELLY = SAND;     // pale underside
const TEETH = SNOW;     // white teeth / claws
const CLAW  = SNOW;
const EYE   = BRICK;    // menacing red eye
const SPIKE = STONE;    // bony back ridge / osteoderms
const DARK  = OAK_LOG;  // nostrils / accents
const ROCK  = COBBLE;

const R = (v) => Math.round(v);
const lerp = (a, b, t) => a + (b - a) * t;

// ---- clear the sculpture volume of existing forest canopy ----
cube(-8, 0, -16, 8, 22, 22, AIR);

// ------------------------------------------------------------
//  SPINE  (centerline x=0)   points: [z, y, radius]
//  tail(+Z, low)  ->  hips  ->  body  ->  neck  ->  head(-Z, high)
// ------------------------------------------------------------
const spine = [
  [21,  2, 1.0],   // tail tip
  [18,  3, 1.7],
  [15,  4, 2.4],
  [12,  5, 3.2],
  [ 9,  7, 4.0],   // hips
  [ 5,  9, 4.5],   // belly / body
  [ 1, 10, 4.6],   // chest / shoulders
  [-2, 12, 3.7],   // neck base
  [-5, 14, 2.9],   // neck
  [-7, 16, 2.7],   // head root
];

// interpolate body cross-section for a given z (z decreasing)
function bodyAt(z) {
  for (let i = 0; i < spine.length - 1; i++) {
    const z0 = spine[i][0], z1 = spine[i + 1][0];
    if (z <= z0 && z >= z1) {
      const t = (z0 - z) / (z0 - z1);
      return { y: lerp(spine[i][1], spine[i + 1][1], t),
               r: lerp(spine[i][2], spine[i + 1][2], t) };
    }
  }
  return null;
}

// ---- build the fleshy body tube ----
for (let i = 0; i < spine.length - 1; i++) {
  const [z0, y0, r0] = spine[i];
  const [z1, y1, r1] = spine[i + 1];
  const steps = 7;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    sphere(0, R(lerp(y0, y1, t)), R(lerp(z0, z1, t)),
           Math.max(1, R(lerp(r0, r1, t))), SKIN);
  }
}

// ---- pale underbelly + throat ----
for (let z = -6; z <= 13; z++) {
  const b = bodyAt(z);
  if (!b) continue;
  const yb = R(b.y - b.r);
  for (let x = -1; x <= 1; x++) {
    block(x, yb, z, BELLY);
    block(x, yb + 1, z, BELLY);
  }
}

// ---- bony ridge / spikes down the back & tail ----
for (let z = -3; z <= 20; z++) {
  const b = bodyAt(z);
  if (!b) continue;
  const top = R(b.y + b.r);
  const h = z > 6 ? 2 : 1;             // taller crest over hips/back
  for (let k = 0; k < h; k++) block(0, top + k, z, SPIKE);
}

// ------------------------------------------------------------
//  HIND LEGS  (powerful, digitigrade)
// ------------------------------------------------------------
function leg(sx) {
  // thigh — blends into hip, thick
  for (let s = 0; s <= 6; s++) {
    const t = s / 6;
    sphere(sx, R(lerp(9, 4, t)), R(lerp(9, 8, t)),
           Math.max(2, R(lerp(3.5, 2.0, t))), SKIN);
  }
  // shin — angles forward toward ankle
  for (let s = 0; s <= 6; s++) {
    const t = s / 6;
    sphere(sx, R(lerp(4, 0, t)), R(lerp(8, 6, t)),
           Math.max(1, R(lerp(2.0, 1.3, t))), SKIN);
  }
  // foot
  cube(sx - 1, 0, 5, sx + 1, 1, 7, SKIN);
  // three forward toes (-Z) with claws + one rear toe
  for (const tx of [-1, 0, 1]) {
    line(sx + tx, 0, 5, sx + tx, 0, 4, SKIN);
    block(sx + tx, 0, 3, CLAW);
  }
  block(sx, 0, 8, SKIN);   // rear dew-toe
  block(sx, 0, 9, CLAW);
}
leg(-4);
leg(4);

// ------------------------------------------------------------
//  TINY ARMS  (iconic two-clawed forelimbs)
// ------------------------------------------------------------
function arm(sx) {
  line(sx, 11, -1, sx, 9, -2, SKIN);   // upper arm
  line(sx, 9, -2, sx, 8, -3, SKIN);    // forearm
  block(sx, 7, -4, CLAW);              // claw 1
  block(sx, 8, -4, CLAW);              // claw 2
}
arm(-4);
arm(4);

// ------------------------------------------------------------
//  HEAD  —  massive skull, agape jaws, teeth, red eyes
// ------------------------------------------------------------
// cranium block (connects to neck root)
cube(-3, 15, -11, 3, 19, -7, SKIN);
// brow ridges
cube(-4, 18, -11, -3, 19, -9, SKIN);
cube( 3, 18, -11,  4, 19, -9, SKIN);

// upper jaw / snout, tapering forward with a downward tooth row
for (let z = -11; z >= -16; z--) {
  const t = (-11 - z) / 5;
  const w = Math.max(1, R(lerp(3, 2, t)));
  const yTop = R(lerp(19, 17, t));
  const yBot = 16;
  cube(-w, yBot, z, w, yTop, z, SKIN);
  block(-w, yBot - 1, z, TEETH);       // fangs
  block( w, yBot - 1, z, TEETH);
  if (t > 0.4) block(0, yBot - 1, z, TEETH);
}
cube(-1, 16, -17, 1, 18, -17, SKIN);   // snout tip
block(-1, 17, -16, DARK);              // nostrils
block( 1, 17, -16, DARK);

// lower jaw (dropped, roaring) with an upward tooth row
for (let z = -10; z >= -15; z--) {
  const t = (-10 - z) / 5;
  const w = Math.max(1, R(lerp(3, 2, t)));
  cube(-w, 12, z, w, 13, z, SKIN);
  block(-w, 14, z, TEETH);
  block( w, 14, z, TEETH);
}
cube(-2, 12, -10, 2, 14, -8, SKIN);    // chin / jaw hinge

// eyes — set on the brow
block(-4, 18, -10, EYE);
block( 4, 18, -10, EYE);

// ------------------------------------------------------------
//  SCENE  —  foreground / background separation
// ------------------------------------------------------------
// scattered boulders
sphere(-9, 0, 2, 2, ROCK);
sphere(8, 1, 12, 2, ROCK);
sphere(-6, 0, 16, 1, ROCK);
sphere(7, 0, -6, 1, ROCK);

// a bare dead snag (background right)
cube(11, 0, -9, 11, 6, -9, OAK_LOG);
block(11, 6, -10, OAK_LOG);
block(12, 4, -9, OAK_LOG);
block(10, 5, -9, OAK_LOG);

// prey rib-cage carcass bleaching near the feet (left)
for (const z of [13, 14, 15, 16]) {
  block(-7, 0, z, TEETH);
  block(-7, 1, z, TEETH);
  block(-5, 0, z, TEETH);
  block(-5, 1, z, TEETH);
  block(-6, 2, z, TEETH);           // spine of carcass
}
line(-7, 0, 12, -5, 0, 12, TEETH);  // skull end

// low foliage tufts for grounding
sphere(-8, 0, -3, 1, SKIN);
sphere(9, 0, 4, 1, SKIN);
sphere(-9, 0, 9, 1, SKIN);