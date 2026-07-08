// giant-spider-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
function lerp(a, b, t) { return a + (b - a) * t; }

// Rounded limb made of overlapping spheres walked along a segment.
function capsule(x1, y1, z1, x2, y2, z2, r, id) {
  const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const steps = Math.max(2, Math.ceil(dist / Math.max(r, 1)) + 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = Math.round(lerp(x1, x2, t));
    const py = Math.round(lerp(y1, y2, t));
    const pz = Math.round(lerp(z1, z2, t));
    sphere(px, py, pz, r, id);
  }
}

const BODY = STONE;
const JOINT = COBBLE;
const EYE = BRICK;
const FANG = COBBLE;
const FANG_TIP = BRICK;
const MARK = COBBLE;
const WEB = SNOW;

// ===== BODY =====
// Abdomen (rear, south, +Z) — the big bulbous back half.
sphere(0, 9, 4, 6, BODY);
// Cephalothorax (front, north, -Z) — smaller head/thorax segment.
sphere(0, 9, -5, 4, BODY);
// Slight waist cinch so the two segments read distinctly.
sphere(0, 8, -1, 3, BODY);

// Abdomen markings — a dorsal stripe + symmetric spots.
cube(-1, 14, 0, 1, 14, 8, MARK);
sphere(-3, 12, 2, 1, MARK);
sphere(3, 12, 2, 1, MARK);
sphere(-4, 10, 5, 1, MARK);
sphere(4, 10, 5, 1, MARK);
sphere(-2, 11, 8, 1, MARK);
sphere(2, 11, 8, 1, MARK);

// Bristles / hairs jutting off the abdomen and thorax.
const bristlePts = [
  [-5, 10, 1], [5, 10, 1], [-5, 9, 6], [5, 9, 6],
  [0, 14, 8], [-3, 13, -1], [3, 13, -1], [0, 6, 6],
  [-3, 6, -6], [3, 6, -6], [0, 13, -8],
];
for (const [bx, by, bz] of bristlePts) {
  const ny = by + (by >= 9 ? 2 : -2);
  const nz = bz + (bz < 0 ? -2 : bz > 5 ? 2 : 0);
  line(bx, by, bz, bx, ny, bz + (nz - bz), MARK);
}

// ===== EYES (front of cephalothorax, facing north) =====
const eyeRowLow = [[-2, 8, -8], [-1, 8, -9], [1, 8, -9], [2, 8, -8]];
const eyeRowHigh = [[-1, 10, -8], [1, 10, -8], [0, 11, -8]];
for (const [ex, ey, ez] of eyeRowLow) block(ex, ey, ez, EYE);
for (const [ex, ey, ez] of eyeRowHigh) block(ex, ey, ez, EYE);

// ===== FANGS (chelicerae) — hang down from the front =====
capsule(-1, 8, -8, -1, 4, -10, 1, FANG);
capsule(1, 8, -8, 1, 4, -10, 1, FANG);
sphere(-1, 3, -10, 1, FANG_TIP);
sphere(1, 3, -10, 1, FANG_TIP);

// ===== PEDIPALPS — short front feelers either side of the fangs =====
capsule(-3, 9, -7, -6, 3, -12, 1, BODY);
capsule(3, 9, -7, 6, 3, -12, 1, BODY);

// ===== LEGS =====
// 4 pairs, front pair splays toward camera (north) for foreground depth,
// rear pair trails south into the background.
const legCfg = [
  { zHip: -4, xKnee: 15, zKnee: -9, xFoot: 20, zFoot: -15 },  // front (foreground)
  { zHip: -1, xKnee: 14, zKnee: -4, xFoot: 19, zFoot: -8 },   // front-mid
  { zHip: 2, xKnee: 14, zKnee: 5, xFoot: 19, zFoot: 9 },      // back-mid
  { zHip: 5, xKnee: 15, zKnee: 11, xFoot: 20, zFoot: 17 },    // back (background)
];

for (const side of [-1, 1]) {
  for (const cfg of legCfg) {
    const xHip = side * 5, yHip = 8, zHip = cfg.zHip;
    const xKnee = side * cfg.xKnee, yKnee = 4, zKnee = cfg.zKnee;
    const xFoot = side * cfg.xFoot, yFoot = 0, zFoot = cfg.zFoot;

    capsule(xHip, yHip, zHip, xKnee, yKnee, zKnee, 2, BODY);
    sphere(xKnee, yKnee, zKnee, 2, JOINT);
    capsule(xKnee, yKnee, zKnee, xFoot, yFoot, zFoot, 1, BODY);
    sphere(xFoot, yFoot, zFoot, 1, JOINT);
    block(xFoot, yFoot - 1, zFoot, JOINT);
  }
}

// ===== GROUND WEB DECORATION =====
disk(0, -1, 3, 10, WEB);
disk(0, -1, 3, 6, AIR);
for (let a = 0; a < 8; a++) {
  const ang = (a / 8) * Math.PI * 2;
  const ex = Math.round(Math.cos(ang) * 14);
  const ez = Math.round(3 + Math.sin(ang) * 14);
  line(0, -1, 3, ex, -1, ez, WEB);
}

sphere(-14, 1, 3, 2, WEB);
sphere(13, 1, 8, 2, WEB);
```
