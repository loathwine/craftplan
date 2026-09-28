// dragon-hoard-sonnet — prompt:
// a dragon sleeping on a pile of gold...

// ===== A dragon sleeping on a pile of gold =====
// Mound centered at (0, y, 3), dragon coils on top, head resting toward the viewer (north/-Z).

function lerp(a, b, t) { return a + (b - a) * t; }

// ---------- GOLD PILE ----------
const moundCX = 0, moundCZ = 3;
const moundLayers = [
  { y: 0, r: 9 }, { y: 1, r: 8 }, { y: 2, r: 7 }, { y: 3, r: 6 },
  { y: 4, r: 5 }, { y: 5, r: 4 }, { y: 6, r: 3 }, { y: 7, r: 2 }, { y: 8, r: 1 },
];
for (const L of moundLayers) disk(moundCX, L.y, moundCZ, L.r, GOLD);

// Coin sparkle variation: a scatter of yellow/copper flecks on the upper crust
const glints = [
  [-5, 2, -1], [4, 2, -2], [-3, 3, 1], [6, 3, 2], [-6, 1, 5], [5, 1, 8],
  [2, 4, 0], [-2, 5, 2], [3, 5, 3], [-4, 4, 6], [7, 2, 4], [-7, 0, 2],
  [0, 6, 4], [-1, 6, 1], [1, 7, 2],
];
for (const [x, y, z] of glints) block(x, y, z, YELLOW);
const copperGlints = [[-4, 2, -3], [4, 1, -1], [-6, 2, 4], [6, 1, 6], [1, 3, -3], [-2, 1, 7]];
for (const [x, y, z] of copperGlints) block(x, y, z, COPPER);

// A few gems poking out of the hoard
const gems = [
  [-5, 3, 0, RED], [5, 2, -1, BLUE], [-3, 1, -4, LIME], [3, 1, -4, MAGENTA],
  [-6, 3, 3, LIME], [6, 4, 3, RED], [-2, 2, 6, BLUE], [2, 6, 3, MAGENTA],
];
for (const [x, y, z, id] of gems) block(x, y, z, id);

// A couple of buried glowstone coins for a faint magical shimmer (sparingly)
block(-4, 4, 2, GLOWSTONE);
block(4, 3, 5, GLOWSTONE);

// Loose overflow coins spilling down the front slope onto the ground
const spill = [
  [-8, 0, -5], [-9, 0, -4], [-7, 0, -6], [8, 0, -4], [9, 0, -5], [7, 0, -6],
  [-10, 0, -2], [10, 0, -2], [0, 0, -8], [-2, 0, -7], [2, 0, -7],
];
for (const [x, y, z] of spill) block(x, y, z, GOLD);

// Small open treasure chest at the base, front-left
cube(-9, 0, -3, -6, 1, -1, BROWN);
hollowCube(-9, 0, -3, -6, 1, -1, GOLD);
cube(-9, 2, -3, -6, 2, -2, BROWN); // half-open lid, tilted back
block(-9, 1, -3, IRON);
block(-6, 1, -3, IRON);
block(-8, 2, -2, IRON); // lock
const chestSpill = [[-8, 2, -2], [-7, 2, -1], [-8, 3, -2], [-7, 1, 0]];
for (const [x, y, z] of chestSpill) block(x, y, z, GOLD);

// ---------- DRAGON ----------
// Spine keyframes: head (front, low) -> up over the mound -> tail curling to the east side.
const spine = [
  { p: [0, 2, -6], r: 1.6 },   // head/neck base
  { p: [0, 3, -4], r: 2.0 },
  { p: [0, 4, -2], r: 2.4 },
  { p: [0, 5, 0], r: 2.7 },    // shoulders
  { p: [0, 6, 2], r: 2.8 },    // widest torso
  { p: [1, 6.5, 4], r: 2.5 },
  { p: [3, 6.5, 6], r: 2.1 },
  { p: [5, 6, 7], r: 1.7 },
  { p: [6.5, 5, 6.5], r: 1.3 },
  { p: [7.5, 3.5, 5], r: 0.9 },
  { p: [7.5, 2, 3], r: 0.6 },
  { p: [6.5, 1, 1.5], r: 0.4 }, // tail tip, curled back toward the front
];

const spineHumps = []; // remember points for spike ridge
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
    sphere(x, y, z, r, GREEN);
    sphere(x, Math.max(0, y - r * 0.55), z, Math.max(0.5, r * 0.55), LIME); // pale belly underside
    spineHumps.push([x, y, z, r]);
  }
}

// Spine ridge spikes, decreasing toward the tail
for (let i = 0; i < spineHumps.length; i += 2) {
  const [x, y, z, r] = spineHumps[i];
  const h = Math.max(1, Math.round(r * 0.8));
  cube(x, Math.round(y + r), z, x, Math.round(y + r) + h, z, BLACK);
}

// Head details
cube(-1, 1, -8, 1, 2, -6, GREEN);      // snout
cube(-1, 1, -9, 1, 1, -8, GREEN);      // nose tip, slightly lower/flatter
block(-1, 3, -6, BLACK); block(1, 3, -6, BLACK); // closed eye slits
block(-1, 3, -7, BLACK); block(1, 3, -7, BLACK);
line(-1, 4, -6, -2, 6, -3, OBSIDIAN);   // left horn
line(1, 4, -6, 2, 6, -3, OBSIDIAN);     // right horn
line(-1, 4, -6, -2, 7, -3, OBSIDIAN);
line(1, 4, -6, 2, 7, -3, OBSIDIAN);
block(0, 2, -9, FIRE);                  // gentle sleepy smoke wisp from the nostrils

// Front paws, tucked just under the chin
cube(-3, 0, -5, -2, 1, -4, GREEN); block(-3, 1, -5, BLACK); block(-2, 1, -5, BLACK);
cube(2, 0, -5, 3, 1, -4, GREEN);  block(2, 1, -5, BLACK);  block(3, 1, -5, BLACK);

// Hind paw peeking from under the coiled body
cube(-3, 4, 3, -2, 5, 4, GREEN); block(-3, 5, 4, BLACK);
cube(4, 5, 7, 5, 6, 8, GREEN);   block(4, 6, 8, BLACK);

// Tail tip spike
block(6, 1, 1, BLACK);
block(7, 1, 2, BLACK);

// Folded wings draped along both flanks of the torso (bat-membrane humps + bone ridges)
function foldedWing(sign) {
  const baseX = sign * 4;
  for (let i = 0; i < 6; i++) {
    const y0 = 4 + i;
    const zLen = 5 - i;
    if (zLen < 0) continue;
    cube(baseX, y0, -1, baseX, y0, zLen, GREEN);
  }
  line(baseX, 9, -1, baseX + sign * 2, 5, -1, BLACK); // wing claw/bone poking above the back
  line(baseX, 4, -1, baseX, 9, -1, BLACK);
}
foldedWing(-1);
foldedWing(1);

// A little scattered gold underfoot around the wing/paw area for cohesion
const underfoot = [[-4, 0, -3], [4, 0, -3], [-4, 0, 2], [5, 0, 3]];
for (const [x, y, z] of underfoot) block(x, y, z, GOLD);