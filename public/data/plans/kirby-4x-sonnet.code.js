// kirby-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
No stray file was created. Here's the Kirby build:

const BODY_X = 0, BODY_Y = 8, BODY_Z = 0;
const R = 8;

function curvedPatch(cx, cy, rx, ry, id, depthOffset) {
  depthOffset = depthOffset || 0;
  for (let dx = -rx; dx <= rx; dx++) {
    for (let dy = -ry; dy <= ry; dy++) {
      if ((dx * dx) / (rx * rx || 1) + (dy * dy) / (ry * ry || 1) <= 1) {
        const x = cx + dx, y = cy + dy;
        const rad2 = R * R - x * x - y * y;
        if (rad2 < 0) continue;
        const z = BODY_Z - Math.sqrt(rad2) - depthOffset;
        block(BODY_X + x, BODY_Y + y, Math.round(z), id);
      }
    }
  }
}

// ---------- BODY ----------
sphere(BODY_X, BODY_Y, BODY_Z, R, BRICK);

// ---------- FEET ----------
sphere(-3, 1, -5, 2, BRICK);
sphere(-3, 0, -6, 2, BRICK);
sphere(3, 1, -5, 2, BRICK);
sphere(3, 0, -6, 2, BRICK);
disk(-3, -1, -5, 2, COBBLE);
disk(3, -1, -5, 2, COBBLE);

// ---------- ARMS ----------
sphere(-10, BODY_Y, 1, 2, BRICK);
sphere(10, BODY_Y, 1, 2, BRICK);
sphere(-11, BODY_Y - 1, 0, 1, BRICK);
sphere(11, BODY_Y - 1, 0, 1, BRICK);

// ---------- FACE (front = -Z, toward camera) ----------
[-3, 3].forEach((ex) => {
  curvedPatch(ex, 2, 2, 3, SNOW, 0);
  curvedPatch(ex, 1, 1, 2, GLASS, 1);
  curvedPatch(ex, 0, 1, 1, STONE, 2);
  curvedPatch(ex - 1, 1, 0, 0, SNOW, 3);
});

curvedPatch(-2, -2, 0, 0, STONE, 1);
curvedPatch(-1, -3, 0, 0, STONE, 1);
curvedPatch(0, -3, 0, 0, STONE, 1);
curvedPatch(1, -3, 0, 0, STONE, 1);
curvedPatch(2, -2, 0, 0, STONE, 1);

// ---------- GROUND STAGE ----------
disk(0, -1, -2, 9, GRASS);
disk(0, -2, -2, 9, DIRT);

// bushes flanking the stage
sphere(-14, 1, 6, 2, LEAVES);
sphere(-15, 0, 8, 2, LEAVES);
sphere(14, 1, 6, 2, LEAVES);
sphere(15, 0, 8, 2, LEAVES);
cylinder(-14, -1, 6, 1, 2, OAK_LOG);
cylinder(14, -1, 6, 1, 2, OAK_LOG);

// ---------- WARP STAR (background right, catches east light) ----------
const starPixels = [
  [0, 3], [0, 2],
  [-1, 1], [0, 1], [1, 1],
  [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0],
  [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
  [-2, -2], [0, -2], [2, -2],
  [-3, -3], [3, -3],
];
const starCx = 14, starCy = 18, starZ = -14;
starPixels.forEach(([dx, dy]) => {
  block(starCx + dx, starCy + dy, starZ, SAND);
  block(starCx + dx, starCy + dy, starZ + 1, SAND);
});
block(starCx - 6, starCy + 4, starZ + 2, SNOW);
block(starCx + 7, starCy - 5, starZ + 2, SNOW);
block(starCx - 8, starCy - 2, starZ + 1, SNOW);
