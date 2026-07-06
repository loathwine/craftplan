// pikachu-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== helpers =====
function taperColumn(cx, cz, y0, y1, r0, r1, id, blackTipLayers, blackId) {
  const n = y1 - y0;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const r = r0 + (r1 - r0) * t;
    const ri = Math.max(0, Math.round(r));
    const y = y0 + i;
    const useId = (blackTipLayers && (n - i) < blackTipLayers) ? blackId : id;
    cube(cx - ri, y, cz - ri, cx + ri, y, cz + ri, useId);
  }
}

function thickLine(x1, y1, z1, x2, y2, z2, r, id) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x1 + (x2 - x1) * t);
    const y = Math.round(y1 + (y2 - y1) * t);
    const z = Math.round(z1 + (z2 - z1) * t);
    cube(x - r, y - r, z - r, x + r, y + r, z + r, id);
  }
}

function faceCircle(cx, cy, z, r, id) {
  const r2 = r * r + 0.5;
  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      if (dx * dx + dy * dy <= r2) block(cx + dx, cy + dy, z, id);
    }
  }
}

function bolt(x, y, id) {
  block(x, y, -4, id);
  block(x - 1, y - 1, -4, id);
  block(x - 1, y - 2, -4, id);
  block(x, y - 2, -4, id);
  block(x, y - 3, -4, id);
  block(x + 1, y - 4, -4, id);
  block(x + 1, y - 5, -4, id);
}

// ===== pedestal =====
disk(0, 0, 0, 9, STONE);
hollowCylinder(0, 0, 0, 9, 1, COBBLE);

// ===== feet =====
cube(-5, 0, 0, -1, 2, 4, SAND);
cube(1, 0, 0, 5, 2, 4, SAND);
block(-5, 1, 4, COBBLE);
block(-2, 1, 4, COBBLE);
block(2, 1, 4, COBBLE);
block(5, 1, 4, COBBLE);

// ===== body =====
sphere(0, 9, -1, 6, SAND);

// cream belly patch
cube(-3, 5, 5, 3, 10, 6, PLANKS);

// back marking stripe
cube(-2, 7, -7, 2, 11, -7, OAK_LOG);

// ===== arms =====
cube(-9, 7, -3, -7, 10, 0, SAND);
cube(7, 7, -3, 9, 10, 0, SAND);
block(-9, 7, -2, COBBLE);
block(-9, 8, -2, COBBLE);
block(9, 7, -2, COBBLE);
block(9, 8, -2, COBBLE);

// ===== head =====
sphere(0, 19, -1, 5, SAND);

// flat face plate (guarantees non-floating facial detail)
cube(-4, 15, 4, 4, 22, 5, SAND);

// eyes (black w/ white glint)
faceCircle(-2, 20, 6, 1, COBBLE);
faceCircle(2, 20, 6, 1, COBBLE);
block(-2, 21, 7, SNOW);
block(2, 21, 7, SNOW);

// nose
block(0, 18, 7, COBBLE);

// mouth (small w-shape smile)
block(-1, 16, 6, COBBLE);
block(0, 15, 6, COBBLE);
block(1, 16, 6, COBBLE);

// cheeks (red circles)
faceCircle(-3, 17, 6, 1, BRICK);
faceCircle(3, 17, 6, 1, BRICK);

// eyebrows
block(-3, 22, 6, COBBLE);
block(-2, 22, 6, COBBLE);
block(2, 22, 6, COBBLE);
block(3, 22, 6, COBBLE);

// ===== ears (tapered, black tips) =====
taperColumn(-3, -2, 22, 33, 2, 0, SAND, 3, COBBLE);
taperColumn(3, -2, 22, 33, 2, 0, SAND, 3, COBBLE);

// ===== tail (brown base -> yellow zigzag -> flat tip) =====
thickLine(3, 6, -6, 6, 7, -9, 1, OAK_LOG);
thickLine(6, 7, -9, 9, 10, -12, 1, SAND);
thickLine(9, 10, -12, 6, 13, -14, 1, SAND);
thickLine(6, 13, -14, 10, 17, -16, 1, SAND);
cube(8, 16, -18, 12, 19, -16, SAND);
cube(7, 11, -13, 9, 12, -12, OAK_LOG);

// ===== floating electric sparks near ears =====
bolt(-8, 32, SAND);
bolt(8, 32, SAND);
bolt(-6, 27, COBBLE);
bolt(6, 27, COBBLE);
```
