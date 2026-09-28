// dragon-hoard-sonnet-fb1 — feedback pass 1
function lerp(a, b, t) { return a + (b - a) * t; }

// ---------- GOLD MOUND ----------
const moundCX = 0, moundCZ = 3;
const moundLayers = [
  { y: 0, r: 9 }, { y: 1, r: 8 }, { y: 2, r: 7 }, { y: 3, r: 6 },
  { y: 4, r: 5 }, { y: 5, r: 4 }, { y: 6, r: 3 }, { y: 7, r: 2 }, { y: 8, r: 1 },
];
for (const L of moundLayers) disk(moundCX, L.y, moundCZ, L.r, GOLD);

const glints = [
  [-5, 2, -1], [4, 2, -2], [-3, 3, 1], [6, 3, 2], [-6, 1, 5], [5, 1, 8],
  [2, 4, 0], [-2, 5, 2], [3, 5, 3], [-4, 4, 6], [7, 2, 4], [-7, 0, 2],
  [0, 6, 4], [-1, 6, 1], [1, 7, 2], [-8, 0, 3], [8, 0, 1],
];
for (const [x, y, z] of glints) block(x, y, z, YELLOW);
const copperGlints = [[-4, 2, -3], [4, 1, -1], [-6, 2, 4], [6, 1, 6], [1, 3, -3], [-2, 1, 7]];
for (const [x, y, z] of copperGlints) block(x, y, z, COPPER);

const gems = [
  [-5, 3, 0, RED], [5, 2, -1, BLUE], [-3, 1, -4, LIME], [3, 1, -4, MAGENTA],
  [-6, 3, 3, LIME], [6, 4, 3, RED], [-2, 2, 6, BLUE], [2, 6, 3, MAGENTA],
  [-1, 8, 3, RED],
];
for (const [x, y, z, id] of gems) block(x, y, z, id);

block(-4, 4, 2, GLOWSTONE);
block(4, 3, 5, GLOWSTONE);

const spill = [
  [-8, 0, -5], [-9, 0, -4], [-7, 0, -6], [8, 0, -4], [9, 0, -5], [7, 0, -6],
  [-10, 0, -2], [10, 0, -2], [0, 0, -8], [-2, 0, -7], [2, 0, -7],
];
for (const [x, y, z] of spill) block(x, y, z, GOLD);

cube(-9, 0, -3, -6, 1, -1, BROWN);
hollowCube(-9, 0, -3, -6, 1, -1, GOLD);
cube(-9, 2, -3, -6, 2, -2, BROWN);
block(-9, 1, -3, IRON);
block(-6, 1, -3, IRON);
block(-8, 2, -2, IRON);
const chestSpill = [[-8, 2, -2], [-7, 2, -1], [-8, 3, -2], [-7, 1, 0]];
for (const [x, y, z] of chestSpill) block(x, y, z, GOLD);

// ---------- DRAGON BODY ----------
// Bright LIME as the dominant, night-visible scale color; GREEN reserved
// for shadow/underside and dorsal shading so the silhouette actually reads.
const BODY = LIME;
const SHADE = GREEN;
const HORN = WHITE;

const spine = [
  { p: [0, 3, -7], r: 1.7 },   // head base
  { p: [0, 4, -5], r: 2.1 },   // neck
  { p: [0, 5, -3], r: 2.5 },
  { p: [0, 6, -1], r: 2.9 },   // shoulders
  { p: [0, 7, 1], r: 3.2 },    // widest torso
  { p: [2, 7.5, 3], r: 2.9 },
  { p: [4, 7.5, 5], r: 2.4 },
  { p: [6, 7, 6.5], r: 1.8 },  // haunch
  { p: [7.5, 5.8, 6.5], r: 1.2 },
  { p: [8.5, 4.5, 5], r: 0.8 }, // tail base, curling down
  { p: [8, 3, 3], r: 0.6 },
  { p: [6, 2, 1], r: 0.5 },     // tail sweeping toward the front
  { p: [3.5, 1.3, -0.5], r: 0.35 }, // tail tip, resting on the hoard, visible from front/east
];

const spineHumps = [];
for (let i = 0; i < spine.length - 1; i++) {
  const A = spine[i], B = spine[i + 1];
  const dist = Math.hypot(B.p[0] - A.p[0], B.p[1] - A.p[1], B.p[2] - A.p[2]);
  const steps = Math.max(2, Math.ceil(dist));
  for (let s = (i === 0 ? 0 : 1); s <= steps; s++) {
    const t = s / steps;
    const x = Math.round(lerp(A.p[0], B.p[0], t));
    const y = Math.round(lerp(A.p[1], B.p[1], t));
    const z = Math.round(lerp(A.p[2], B.p[2], t));
    const r = lerp(A.r, B.r, t);
    sphere(x, y, z, r, BODY);
    sphere(x, Math.max(0, y - r * 0.6), z, Math.max(0.5, r * 0.6), SHADE); // shaded underside
    spineHumps.push([x, y, z, r]);
  }
}

// sparse tapered dorsal ridge (was a wall of solid black cubes — now single
// contrasting spikes so the spine reads as a ridge, not a black smear)
for (let i = 0; i < spineHumps.length; i += 2) {
  const [x, y, z, r] = spineHumps[i];
  const h = Math.max(1, Math.round(r * 0.6));
  const top = Math.round(y + r);
  for (let k = 0; k < h; k++) block(x, top + k, z, SHADE);
  block(x, top + h, z, HORN); // pale spike tip catches light
}

// ---------- HEAD ----------
cube(-1, 1, -9, 1, 3, -7, BODY);       // snout, pushed forward, facing -Z
cube(-1, 1, -10, 1, 1, -9, BODY);      // nose tip, flat and low
block(-1, 1, -10, BLACK); block(1, 1, -10, BLACK); // nostrils
block(0, 2, -10, FIRE);                // sleepy smoke wisp

// brow ridges
block(-1, 4, -8, SHADE); block(1, 4, -8, SHADE);
block(-1, 4, -7, SHADE); block(1, 4, -7, SHADE);
// closed eye slits (shaded, not pure black, so they don't vanish into the body)
block(-1, 3, -8, BLACK); block(1, 3, -8, BLACK);

// ivory horns — bright and readable against the dark night sky
line(-1, 4, -8, -3, 8, -4, HORN);
line(1, 4, -8, 3, 8, -4, HORN);
line(-1, 4, -8, -2, 9, -5, HORN);
line(1, 4, -8, 2, 9, -5, HORN);
block(-3, 9, -4, LIGHT_GRAY); block(3, 9, -4, LIGHT_GRAY); // horn tips catch moonlight

// small jaw undercut
cube(-1, 0, -8, 1, 0, -7, SHADE);

// ---------- FRONT LEGS (tucked under chin, resting on the hoard) ----------
cube(-3, 0, -5, -2, 2, -4, BODY);
block(-3, 0, -4, IRON); block(-2, 0, -4, IRON); block(-3, 0, -3, IRON); // claws
cube(2, 0, -5, 3, 2, -4, BODY);
block(2, 0, -4, IRON); block(3, 0, -4, IRON); block(3, 0, -3, IRON);

// ---------- BACK LEGS (near haunch, visible from the side) ----------
cube(4, 0, 5, 5, 2, 6, BODY);
block(4, 0, 7, IRON); block(5, 0, 7, IRON); block(4, 0, 6, IRON);
cube(-4, 0, 4, -3, 2, 5, BODY);
block(-4, 0, 6, IRON); block(-3, 0, 6, IRON);

// ---------- FOLDED WINGS ----------
// Wide fan of membrane slabs stacked up from the shoulder, narrowing toward
// the tip, with a dark bone strut along the leading edge — replaces the
// old 1-block-thick slivers that vanished into the silhouette.
function foldedWing(sign) {
  const shoulderX = sign * 3, shoulderZ = -1;
  for (let i = 0; i < 8; i++) {
    const y = 6 + i;
    const reach = Math.round(1 + i * 0.4);
    const zSpan = Math.max(0, Math.round(5 - i * 0.6));
    const x0 = shoulderX + sign * reach;
    cube(Math.min(x0, shoulderX), y, shoulderZ, Math.max(x0, shoulderX), y, shoulderZ + zSpan, PURPLE);
    if (i % 2 === 0) block(x0, y, shoulderZ + zSpan, BLACK); // wing-finger accent
  }
  line(shoulderX, 6, shoulderZ, shoulderX + sign * 4, 13, shoulderZ, BLACK); // leading bone strut
  block(shoulderX + sign * 4, 13, shoulderZ, HORN); // claw tip catches light
}
foldedWing(-1);
foldedWing(1);

// ---------- underfoot / hoard interaction ----------
const underfoot = [[-4, 0, -3], [4, 0, -3], [-4, 0, 5], [5, 0, 6], [3, 0, -1]];
for (const [x, y, z] of underfoot) block(x, y, z, GOLD);