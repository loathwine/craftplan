// groot-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
function lerp(a, b, t) { return a + (b - a) * t; }

function limb(x1, z1, y1, x2, z2, y2, r1, r2, id) {
  const steps = Math.max(1, Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = Math.round(lerp(y1, y2, t));
    const cx = Math.round(lerp(x1, x2, t));
    const cz = Math.round(lerp(z1, z2, t));
    const r = Math.max(0, Math.round(lerp(r1, r2, t)));
    disk(cx, y, cz, r, id);
  }
}

function profile(cx, cz, y0, radii, id) {
  for (let i = 0; i < radii.length; i++) {
    disk(cx, y0 + i, cz, radii[i], id);
  }
}

function leafTuft(x, y, z, r) { sphere(x, y, z, r, LEAVES); }

const BARK = OAK_LOG;

disk(0, 0, 3, 4, BARK);
disk(0, -1, 3, 3, BARK);

const rootTips = [
  [-9, -3], [-11, 2], [-8, 7], [-3, 9],
  [3, 9], [8, 7], [11, 2], [9, -3],
];
for (const [dx, dz] of rootTips) {
  const z2 = 3 + dz;
  line(0, 0, 3, dx, 0, z2, BARK);
  line(0, -1, 3, Math.round(dx * 0.4), -1, 3 + Math.round(dz * 0.4), BARK);
  block(dx, 0, z2, BARK);
}
cube(-4, 0, 1, -3, 1, 5, BARK);
cube(3, 0, 1, 4, 1, 5, BARK);

limb(-2.6, 3, 0, -1.6, 3, 9, 2.2, 1.3, BARK);
limb(2.6, 3, 0, 1.6, 3, 9, 2.2, 1.3, BARK);

disk(0, 9, 3, 3.3, BARK);
disk(0, 10, 3, 3.0, BARK);

limb(0, 3, 10, 0, 3, 19, 3.0, 2.3, BARK);

line(-2, 10, 3, -2, 19, 3, PLANKS);
line(2, 10, 3, 2, 19, 3, PLANKS);
line(0, 10, 4, 0, 18, 5, PLANKS);

sphere(1, 14, 0, 1, AIR);
sphere(-2, 12, 1, 1, AIR);
sphere(0, 17, 0, 1, AIR);

disk(0, 19, 3, 3.8, BARK);
disk(0, 20, 3, 3.6, BARK);
disk(0, 21, 2, 1.7, BARK);
disk(0, 22, 2, 1.5, BARK);

profile(0, 2, 22, [1.8, 2.3, 2.6, 2.7, 2.6, 2.2, 1.6, 0.9], BARK);

line(-2, 26, -1, 2, 26, -1, BARK);
line(-1, 25, -1, -1, 25, 0, AIR);
line(1, 25, -1, 1, 25, 0, AIR);
line(-1, 23, -1, 1, 23, -1, AIR);
block(0, 24, -1, BARK);

leafTuft(0, 29, 2, 2);
leafTuft(2, 28, 3, 1);
leafTuft(-2, 28, 1, 1);
leafTuft(0, 30, 2, 1);

function buildArm(sign) {
  limb(4 * sign, 3, 20, 10 * sign, 0, 27, 1.5, 0.7, BARK);
  const bx = 10 * sign, by = 27, bz = 0;
  const fingers = [
    [12 * sign, 29, -1],
    [13 * sign, 28, 1],
    [11 * sign, 30, 0],
    [9 * sign, 29, -2],
  ];
  for (const [fx, fy, fz] of fingers) {
    line(bx, by, bz, fx, fy, fz, BARK);
    leafTuft(fx, fy, fz, 1);
  }
}
buildArm(1);
buildArm(-1);

function twigSprout(x1, y1, z1, x2, y2, z2) {
  line(x1, y1, z1, x2, y2, z2, BARK);
  leafTuft(x2, y2, z2, 1);
}
twigSprout(3, 20, 5, 6, 22, 7);
twigSprout(-3, 20, 5, -5, 23, 8);
twigSprout(0, 20, 6, 1, 24, 9);
twigSprout(2, 12, 5, 4, 13, 6);
twigSprout(-2, 15, 5, -4, 16, 7);
