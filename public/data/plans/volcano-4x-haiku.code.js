// volcano-4x-haiku — prompt:
// an erupting volcano...

const cx = 0;
const cz = 0;

// MAIN CONE STRUCTURE
// Base - wide stone foundation
for (let y = 0; y < 18; y++) {
  const radius = 18 - y * 0.8;
  if (radius > 1) {
    cylinder(cx, y, cz, Math.round(radius), 1, STONE);
  }
}

// Mid cone
for (let y = 18; y < 22; y++) {
  const radius = 6 + (22 - y) * 2;
  cylinder(cx, y, cz, radius, 1, STONE);
}

// Upper cone - darker hot zone
for (let y = 22; y < 25; y++) {
  const radius = 4 - (y - 22) * 0.8;
  if (radius > 0.5) {
    cylinder(cx, y, cz, Math.round(radius), 1, COBBLE);
  }
}

// CRATER - hollow summit
for (let y = 24; y < 28; y++) {
  const r = 4 - (y - 24) * 1.2;
  if (r > 0.5) {
    hollowCylinder(cx, y, cz, Math.round(r), 1, AIR);
  }
}

// Central erupting lava column
sphere(cx, 27, cz, 1.5, BRICK);
cube(cx - 1, 27, cz - 1, cx + 1, 32, cz + 1, BRICK);

// PRIMARY LAVA FLOW - front (north-facing for camera)
for (let i = 0; i < 14; i++) {
  const y = 24 - i;
  const z = -5 - i * 0.9;
  const w = 3 - i * 0.15;
  if (w > 0.5) {
    cube(cx - Math.round(w), y, cz + Math.round(z), cx + Math.round(w), y + 1, cz + Math.round(z) + 1, BRICK);
  }
}

// Front lava edges - cooler glass appearance
for (let i = 0; i < 12; i++) {
  const y = 23 - i;
  const z = -6 - i * 0.8;
  cube(cx - 4, y, cz + Math.round(z), cx - 2, y, cz + Math.round(z) + 1, GLASS);
  cube(cx + 2, y, cz + Math.round(z), cx + 4, y, cz + Math.round(z) + 1, GLASS);
}

// RIGHT SIDE flow
for (let i = 0; i < 12; i++) {
  const y = 22 - i;
  const x = 5 + i * 0.8;
  cube(cx + Math.round(x), y, cz - 1, cx + Math.round(x) + 2, y + 1, cz + 2, BRICK);
}

// LEFT SIDE flow
for (let i = 0; i < 12; i++) {
  const y = 22 - i;
  const x = 5 + i * 0.8;
  cube(cx - Math.round(x) - 2, y, cz - 1, cx - Math.round(x), y + 1, cz + 2, BRICK);
}

// BACK flows - subtle cascades
for (let i = 0; i < 8; i++) {
  const y = 22 - i;
  const z = 5 + i * 0.6;
  cube(cx - 1, y, cz + Math.round(z), cx + 1, y + 1, cz + Math.round(z) + 1, BRICK);
}

// LAVA LAKE at base
cube(cx - 12, -2, cz - 12, cx + 12, -1, cz + 12, GLASS);
cube(cx - 14, -1, cz - 14, cx + 14, 0, cz + 14, BRICK);

// SOLIDIFIED LAVA formations in corners
const rockPositions = [[-11, -11], [11, -11], [-11, 11], [11, 11]];
for (const [rx, rz] of rockPositions) {
  cube(cx + rx - 1, -1, cz + rz - 1, cx + rx + 1, 2, cz + rz + 1, STONE);
}

// FOREGROUND SCATTER - volcanic rocks and debris
cube(-16, 0, -16, -14, 1, -15, COBBLE);
cube(14, 0, -16, 16, 1, -15, COBBLE);
cube(-18, 0, -8, -16, 1, -6, COBBLE);
cube(16, 0, -8, 18, 1, -6, COBBLE);
cube(-15, 0, -4, -13, 1, -2, COBBLE);
cube(13, 0, -4, 15, 1, -2, COBBLE);

// Foreground asymmetrical detail
cube(-20, 0, -10, -18, 2, -8, STONE);
cube(18, 0, -12, 20, 1, -10, STONE);

// Ash/cinder layers on volcano slopes
cube(cx - 8, 23, cz - 3, cx - 6, 24, cz + 2, COBBLE);
cube(cx + 6, 23, cz - 3, cx + 8, 24, cz + 2, COBBLE);
cube(cx - 5, 20, cz - 2, cx + 5, 21, cz + 1, COBBLE);

// Secondary vents on sides
cube(cx - 7, 10, cz - 2, cx - 5, 13, cz + 2, BRICK);
cube(cx + 5, 10, cz - 2, cx + 7, 13, cz + 2, BRICK);