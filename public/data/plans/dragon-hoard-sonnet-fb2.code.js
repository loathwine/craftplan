// dragon-hoard-sonnet-fb2 — feedback pass 2
function lerp(a, b, t) { return a + (b - a) * t; }

// ---------- Gold hoard: broad, LOW pile so the dragon dominates the silhouette ----------
const moundCX = 0, moundCZ = 2;
const moundLayers = [
  { y: 0, r: 9 }, { y: 1, r: 7 }, { y: 2, r: 5 }, { y: 3, r: 3 }, { y: 4, r: 1 },
];
for (const L of moundLayers) disk(moundCX, L.y, moundCZ, L.r, GOLD);

const glints = [
  [-5, 1, -3], [4, 1, -3], [-3, 2, -1], [6, 1, 3], [-6, 1, 4], [5, 0, 8],
  [2, 3, 1], [-2, 3, 2], [3, 2, 6], [-4, 2, 7], [7, 1, 6], [-7, 0, 1],
  [0, 4, 2], [-1, 3, -2], [1, 2, 8], [-8, 0, 2], [8, 0, 0],
];
for (const [x, y, z] of glints) block(x, y, z, YELLOW);
const copperGlints = [[-4, 1, -4], [4, 0, -2], [-6, 1, 3], [6, 0, 7], [1, 2, -3], [-2, 0, 8]];
for (const [x, y, z] of copperGlints) block(x, y, z, COPPER);

const gems = [
  [-5, 2, -2, RED], [5, 1, -2, BLUE], [-3, 0, -5, LIME], [3, 0, -5, MAGENTA],
  [-6, 2, 2, LIME], [6, 3, 2, RED], [-2, 1, 6, BLUE], [-8, 1, 1, MAGENTA],
];
for (const [x, y, z, id] of gems) block(x, y, z, id);

block(-6, 2, -1, GLOWSTONE);
block(6, 2, 4, GLOWSTONE);

const spill = [
  [-8, 0, -6], [-9, 0, -5], [-7, 0, -7], [9, 0, -3], [10, 0, -4], [8, 0, -5],
  [-10, 0, -2], [10, 0, 2], [0, 0, -9], [-2, 0, -8], [2, 0, -8],
];
for (const [x, y, z] of spill) block(x, y, z, GOLD);

cube(-10, 0, -2, -7, 1, 0, BROWN);
hollowCube(-10, 0, -2, -7, 1, 0, GOLD);
cube(-10, 2, -2, -7, 2, -1, BROWN);
block(-10, 1, -2, IRON); block(-7, 1, -2, IRON); block(-9, 2, -1, IRON);
const chestSpill = [[-9, 2, -1], [-8, 2, 0], [-9, 3, -1], [-8, 1, 1]];
for (const [x, y, z] of chestSpill) block(x, y, z, GOLD);

// ---------- Dragon: high-contrast dark scales against the gold + green ----------
const BODY = BLACK;
const GLOSS = OBSIDIAN;  // spine ridge / wing bones, catches moonlight
const BELLY = GRAY;      // underside, catches warm bounce off gold
const HORN = WHITE;
const MEMBRANE = PURPLE;

const spine = [
  { p: [0, 3, -9], r: 2.1 },    // skull, pushed toward camera (north)
  { p: [0, 4, -6], r: 2.4 },    // neck
  { p: [0, 5.5, -3], r: 2.8 },  // lower neck / shoulder
  { p: [0, 7, 0], r: 3.3 },     // shoulder hump, widest
  { p: [1, 7.3, 3], r: 3.0 },   // mid torso
  { p: [3, 6.7, 5.5], r: 2.3 }, // haunch
  { p: [5, 5.5, 6.5], r: 1.5 }, // hip
  { p: [7, 4, 6], r: 1.0 },     // tail base, curling out to the east side
  { p: [8.5, 2.8, 3.5], r: 0.7 },
  { p: [7.5, 1.8, 0.5], r: 0.5 },
  { p: [5.5, 1.2, -2], r: 0.35 }, // tail tip resting on the gold, visible to the east of the body
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
    sphere(x, Math.max(0, y - r * 0.55), z, Math.max(0.5, r * 0.55), BELLY); // warm underside
    spineHumps.push([x, y, z, r]);
  }
}

for (let i = 0; i < spineHumps.length; i += 2) {
  const [x, y, z, r] = spineHumps[i];
  const h = Math.max(1, Math.round(r * 0.55));
  const top = Math.round(y + r);
  for (let k = 0; k < h; k++) block(x, top + k, z, GLOSS);
  block(x, top + h, z, HORN); // pale spike tip catches moonlight
}

// --- Head detail: large enough to read clearly from the front ---
cube(-2, 2, -12, 2, 5, -9, BODY);       // skull block, big and forward-facing
cube(-1, 1, -13, 1, 2, -11, BODY);      // snout, low and flat, pointed at camera
block(-1, 1, -13, BLACK); block(1, 1, -13, BLACK); // nostrils
block(0, 2, -13, FIRE);                 // sleepy smoke wisp from the nose

block(-2, 4, -10, GLOSS); block(2, 4, -10, GLOSS); // brow ridges
block(-1, 3, -10, BLACK); block(1, 3, -10, BLACK);  // closed eye slits
block(-1, 3, -11, BLACK); block(1, 3, -11, BLACK);

line(-2, 4, -10, -4, 8, -6, HORN);
line(2, 4, -10, 4, 8, -6, HORN);
line(-2, 4, -10, -3, 9, -7, HORN);
line(2, 4, -10, 3, 9, -7, HORN);
block(-4, 9, -6, LIGHT_GRAY); block(4, 9, -6, LIGHT_GRAY); // horn tips

cube(-2, 0, -11, 2, 0, -9, BELLY); // jaw underside

// --- Legs, visible poking from under the curled body ---
cube(-4, 0, -4, -3, 3, -2, BODY);
block(-4, 0, -2, IRON); block(-3, 0, -2, IRON); block(-4, 0, -1, IRON);
cube(3, 0, -4, 4, 3, -2, BODY);
block(3, 0, -2, IRON); block(4, 0, -2, IRON); block(4, 0, -1, IRON);

cube(4, 0, 5, 6, 3, 7, BODY);
block(4, 0, 8, IRON); block(5, 0, 8, IRON); block(6, 0, 8, IRON);
cube(-5, 0, 4, -3, 3, 6, BODY);
block(-5, 0, 7, IRON); block(-4, 0, 7, IRON); block(-3, 0, 7, IRON);

// --- Wings: folded fan draped along the back, reads clearly in profile ---
function wingFan(sign) {
  const baseX = sign * 3, baseY = 6.5, baseZ = -1;
  const ribs = [
    { dx: 1, dy: 3, dz: 1 },
    { dx: 2.2, dy: 4.5, dz: 2.5 },
    { dx: 3.2, dy: 5, dz: 4.5 },
    { dx: 3.6, dy: 4.3, dz: 6.5 },
    { dx: 3, dy: 3, dz: 8.5 },
  ];
  const ribPoints = ribs.map(r => {
    const ex = baseX + sign * r.dx, ey = baseY + r.dy, ez = baseZ + r.dz;
    const steps = Math.max(2, Math.round(Math.hypot(r.dx, r.dy, r.dz)));
    const pts = [];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      pts.push([Math.round(lerp(baseX, ex, t)), Math.round(lerp(baseY, ey, t)), Math.round(lerp(baseZ, ez, t))]);
    }
    return pts;
  });
  for (const pts of ribPoints) for (const [x, y, z] of pts) block(x, y, z, GLOSS);
  for (let i = 0; i < ribPoints.length - 1; i++) {
    const A = ribPoints[i], B = ribPoints[i + 1];
    const n = Math.min(A.length, B.length);
    for (let k = 1; k < n; k++) {
      const [ax, ay, az] = A[k], [bx, by, bz] = B[k];
      line(ax, ay, az, bx, by, bz, MEMBRANE);
    }
  }
  const tip = ribPoints[ribPoints.length - 1][ribPoints[ribPoints.length - 1].length - 1];
  block(tip[0], tip[1], tip[2], HORN);
}
wingFan(-1);
wingFan(1);

const underfoot = [[-4, 0, -3], [4, 0, -3], [-4, 0, 6], [5, 0, 7], [3, 0, -1]];
for (const [x, y, z] of underfoot) block(x, y, z, GOLD);