// sydney-opera-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Sydney Opera House =====
// Front (podium steps + shell fan) faces north (-Z) toward camera.

// --- Clear existing trees/canopies inside the footprint so nothing pokes through ---
cube(-18, 1, -7, 18, 11, 12, AIR);

// ===== Podium (Bennelong Point plaza) =====
cube(-18, 0, -7, 18, 0, 12, STONE);     // broad lower tier
cube(-15, 1, -5, 15, 1, 10, COBBLE);    // upper tier
// grand entrance steps on the north side
cube(-12, -1, -9, 12, -1, -8, STONE);
cube(-9, -1, -10, 9, -1, -10, STONE);

// low glazed curtain wall along the harbour-facing (north) edge — the real
// building's glass walls peeking out beneath the concrete shells
cube(-15, 2, -5, 15, 4, -5, GLASS);
cube(-15, 2, -5, -15, 4, 9, GLASS);
cube(15, 2, -5, 15, 4, 9, GLASS);

// a few podium-level colonnade posts for scale along the front edge
for (let x = -14; x <= 14; x += 4) {
  cube(x, 2, -5, x, 5, -5, COBBLE);
}

// ===== Shell builder =====
// Tapering "sail" fin: wide/deep at the base, narrowing to a point at the
// top, leaning back toward +Z as it rises (like the real shells' curve).
function buildShell(cx, z0, baseWidth, depthBase, height, leanZ, baseY, block) {
  for (let y = 0; y <= height; y++) {
    const t = y / height;
    const curve = Math.pow(Math.cos((t * Math.PI) / 2), 0.8);
    const w = Math.max(baseWidth * curve, 0.6);
    const d = Math.max(depthBase * Math.pow(Math.cos((t * Math.PI) / 2), 0.55), 0.8);
    const zc = z0 + leanZ * t * t; // accelerating lean near the tip
    const x1 = Math.round(cx - w / 2);
    const x2 = Math.round(cx + w / 2);
    const z1 = Math.round(zc - d / 2);
    const z2 = Math.round(zc + d / 2);
    cube(x1, baseY + y, z1, x2, baseY + y, z2, block);
  }
}

const baseY = 2;

// ---- Group A: Concert Hall shells (front, prominent, fanned heights) ----
buildShell(-16, -2, 8, 4, 14, 3, baseY, SNOW);
buildShell(-11, -2, 9, 5, 19, 4, baseY, SNOW);
buildShell(-6, -2, 10, 5, 24, 5, baseY, SNOW);
buildShell(-1, -2, 9, 5, 19, 4, baseY, SNOW);
buildShell(4, -2, 8, 4, 14, 3, baseY, SNOW);

// ---- Group B: Opera Theatre shells (set back and to the side, smaller) ----
buildShell(10, 7, 6, 3, 12, 2, baseY, SNOW);
buildShell(14, 7, 7, 4, 16, 3, baseY, SNOW);
buildShell(18, 7, 6, 3, 12, 2, baseY, SNOW);

// ===== Detail: window ribs under the tallest shells (dark mullions) =====
for (let x = -16; x <= 4; x += 5) {
  cube(x - 1, baseY, -3, x + 1, baseY + 2, -3, GLASS);
}
for (let x = 10; x <= 18; x += 4) {
  cube(x - 1, baseY, 5, x + 1, baseY + 2, 5, GLASS);
}

// ===== Small forecourt greenery for scale/context (kept minimal) =====
function tree(x, z) {
  cube(x, 0, z, x, 3, z, OAK_LOG);
  sphere(x, 5, z, 2, LEAVES);
}
tree(-19, 10);
tree(17, 10);
tree(-19, -6);
```
