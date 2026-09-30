// rocket-launch-sonnet — prompt:
// a rocket launching into space...

function taperedCylinder(cx, y0, cz, r0, r1, h, id) {
  for (let i = 0; i <= h; i++) {
    const t = h === 0 ? 0 : i / h;
    const r = r0 + (r1 - r0) * t;
    if (r > 0.35) disk(cx, y0 + i, cz, r, id);
    else block(cx, y0 + i, cz, id);
  }
}

// ===== LAUNCH PAD =====
disk(0, 0, 0, 10, STONE);
disk(0, 0, 0, 6, BLACK);
hollowCylinder(0, 0, 0, 10, 1, COBBLE);
disk(0, 0, 0, 3, LIGHT_GRAY);

// scorch streaks radiating out
for (let a = 0; a < 8; a++) {
  const ang = a * Math.PI / 4;
  const ex = Math.round(Math.cos(ang) * 8);
  const ez = Math.round(Math.sin(ang) * 8);
  line(0, 0, 0, ex, 0, ez, BLACK);
}

// crawler rail tracks leading south
line(-3, 0, 10, -3, 0, 22, IRON);
line(3, 0, 10, 3, 0, 22, IRON);
for (let z = 10; z <= 22; z += 2) {
  line(-3, 0, z, 3, 0, z, GRAY);
}

// ===== ENGINE / EXHAUST =====
cylinder(0, 1, 0, 3.5, 3, GRAY);
cylinder(0, 1, 0, 3.5, 1, BLACK);

// nozzles
const nozzlePos = [[1.6, 1.6], [1.6, -1.6], [-1.6, 1.6], [-1.6, -1.6]];
for (const [nx, nz] of nozzlePos) {
  cylinder(Math.round(nx), -1, Math.round(nz), 0.8, 2, BLACK);
  block(Math.round(nx), -2, Math.round(nz), IRON);
}

// bright plasma core + flame licks
disk(0, 0, 0, 2.5, LAVA);
disk(0, -1, 0, 2, ORANGE);
const flameLicks = [
  [2, 0, 0], [-2, 0, 0], [0, 0, 2], [0, 0, -2],
  [2, -1, 2], [-2, -1, -2], [2, -1, -2], [-2, -1, 2],
  [3, 0, 1], [-3, 0, -1], [1, -1, 3], [-1, -1, -3],
  [0, 1, 3], [0, 1, -3], [3, 1, 0], [-3, 1, 0]
];
for (const [fx, fy, fz] of flameLicks) block(fx, fy, fz, ORANGE);
for (const [fx, fy, fz] of flameLicks) block(fx, fy + 1, fz, YELLOW);

// FIRE effect cells (sparingly) around base
const fireCells = [
  [1, 1, 1], [-1, 1, 1], [1, 1, -1], [-1, 1, -1],
  [2, 0, -1], [-2, 0, 1], [1, 0, 2], [-1, 0, -2],
  [0, 1, 1], [0, 1, -1], [1, 2, 0], [-1, 2, 0],
  [2, 2, 2], [-2, 2, -2], [0, 2, 0], [2, 1, -2],
  [-2, 1, 2], [0, 0, 3], [0, 0, -3], [3, 0, 0]
];
for (const [x, y, z] of fireCells) block(x, y, z, FIRE);

// ===== ROCKET BODY =====
cylinder(0, 4, 0, 3, 18, WHITE);
cylinder(0, 10, 0, 3, 1, ORANGE);
cylinder(0, 16, 0, 3, 1, BLACK);

// flag/logo stripe on north (viewer-facing) side
cube(-1, 12, -3, 1, 15, -3, BLUE);
cube(-1, 13, -3, 1, 14, -3, WHITE);

// ladder on +X face
line(3, 4, 0, 3, 26, 0, IRON);

// small round windows scattered up the body (front face)
const bodyWindows = [[0, 6, -3], [0, 9, -3], [0, 13, -3], [0, 19, -3]];
for (const [wx, wy, wz] of bodyWindows) block(wx, wy, wz, LIGHT_BLUE);

// ===== FINS =====
for (let h = 0; h <= 5; h++) {
  const len = Math.round(4 - h * 0.7);
  const y = 1 + h;
  if (len >= 1) {
    cube(3, y, -1, 3 + len, y, 1, RED);        // +X fin
    cube(-3 - len, y, -1, -3, y, 1, RED);      // -X fin
    cube(-1, y, 3, 1, y, 3 + len, RED);        // +Z fin
    cube(-1, y, -3 - len, 1, y, -3, RED);      // -Z fin (front, most visible)
  }
}
// fin tip accents
block(7, 1, 0, WHITE);
block(-7, 1, 0, WHITE);
block(0, 1, 7, WHITE);
block(0, 1, -7, WHITE);

// ===== TAPER / SHOULDER =====
taperedCylinder(0, 22, 0, 3, 1.3, 5, WHITE);
cylinder(0, 22, 0, 3.1, 1, ORANGE);

// ===== CAPSULE =====
cylinder(0, 27, 0, 1.3, 3, WHITE);
cylinder(0, 29, 0, 1.3, 1, RED);
const capWindows = [[1, 28, 0], [-1, 28, 0], [0, 28, 1], [0, 28, -1]];
for (const [wx, wy, wz] of capWindows) block(wx, wy, wz, LIGHT_BLUE);

// ===== NOSE CONE =====
taperedCylinder(0, 30, 0, 1.3, 0, 3, RED);
block(0, 33, 0, ORANGE);

// ===== SUPPORT GANTRY TOWER (west side) =====
const cx1 = -10, cx2 = -14, cz1 = -1, cz2 = 1;
line(cx1, 0, cz1, cx1, 26, cz1, IRON);
line(cx1, 0, cz2, cx1, 26, cz2, IRON);
line(cx2, 0, cz1, cx2, 26, cz1, IRON);
line(cx2, 0, cz2, cx2, 26, cz2, IRON);

for (let y = 0; y <= 24; y += 4) {
  line(cx1, y, cz1, cx1, y, cz2, IRON);
  line(cx2, y, cz1, cx2, y, cz2, IRON);
  line(cx1, y, cz1, cx2, y, cz1, IRON);
  line(cx1, y, cz2, cx2, y, cz2, IRON);
}
for (let y = 0; y <= 20; y += 4) {
  line(cx1, y, cz1, cx2, y + 4, cz2, IRON);
  line(cx1, y, cz2, cx2, y + 4, cz1, IRON);
}
// base platform
cube(cx2, 0, cz1, cx1, 0, cz2, COBBLE);

// walkway arm to capsule
cube(-10, 27, -1, -4, 27, 1, PLANKS);
line(-10, 28, -1, -4, 28, -1, IRON);
line(-10, 28, 1, -4, 28, 1, IRON);
line(-10, 27, -1, -10, 28, -1, IRON);
line(-10, 27, 1, -10, 28, 1, IRON);

// blinking beacon light on tower top
block(-12, 26, 0, NEON_RED);
block(-12, 27, 0, NEON_RED);

// ===== SMOKE PLUME (billowing at base) =====
const smokeSpheres = [
  [6, 1, 3, 3, WHITE],
  [9, 0, 6, 3, LIGHT_GRAY],
  [4, 0, 8, 2, WHITE],
  [-4, 1, 5, 3, LIGHT_GRAY],
  [7, 2, -4, 2, WHITE],
  [3, 0, -7, 3, LIGHT_GRAY],
  [10, 1, 1, 2, WHITE],
  [-2, 0, -8, 2, LIGHT_GRAY],
  [-6, 0, 8, 2, WHITE],
  [12, 0, -2, 2, LIGHT_GRAY]
];
for (const [sx, sy, sz, sr, sid] of smokeSpheres) sphere(sx, sy, sz, sr, sid);

// rising wisps trailing higher
sphere(-6, 9, 6, 2, LIGHT_GRAY);
sphere(8, 13, -4, 1, WHITE);
sphere(5, 16, 5, 1, LIGHT_GRAY);

// distant background clouds
sphere(16, 20, 10, 2, WHITE);
sphere(-16, 22, -10, 2, WHITE);
sphere(18, 24, -6, 1, LIGHT_GRAY);