// mammoth-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Woolly Mammoth =====
// Front (face/trunk) points toward -Z (north, camera side).
// Body runs from shoulders near z=0 back to rump near z=10.

const FUR = 2;      // DIRT - shaggy brown coat
const FUR_DK = 4;   // OAK_LOG - darker fur shading (legs, mane ridge)
const TUSK = 12;    // SNOW - ivory tusks
const HOOF = 8;     // COBBLE - feet/hooves
const EYE = 3;      // STONE - eye

function chain(points, id) {
  // points: [x,y,z,r] — draws overlapping filled spheres to form a smooth
  // tapered tube (used for trunk, tusks, tail)
  for (const [x, y, z, r] of points) {
    sphere(x, y, z, r, id);
  }
}

// ---------- LEGS ----------
const legR = 1.6;
const legH = 6;
const legPositions = [
  [-4, 0], [4, 0],   // front legs (near head, z small)
  [-4, 8], [4, 8],   // back legs
];
for (const [x, z] of legPositions) {
  cylinder(x, 0, z, legR, legH, FUR_DK);
  sphere(x, legH, z, legR + 0.3, FUR_DK); // rounded foot
  disk(x, 0, z, legR + 0.4, HOOF);        // hoof
}

// ---------- BODY (tapered, humped barrel via overlapping spheres) ----------
const bodySegments = [
  [0, 8.0, -1, 3.6],
  [0, 9.3, 1, 4.3],    // shoulder hump peak
  [0, 9.6, 3, 4.6],
  [0, 9.2, 5, 4.5],
  [0, 8.6, 7, 4.1],
  [0, 7.8, 9, 3.4],
  [0, 7.0, 10.5, 2.4], // rump taper
];
for (const [x, y, z, r] of bodySegments) {
  sphere(x, y, z, r, FUR);
}
// darker fur mane ridge along the spine
for (let z = -1; z <= 9; z++) {
  const seg = bodySegments.find(s => Math.abs(s[2] - z) <= 1.5) || bodySegments[0];
  block(0, Math.round(seg[1] + seg[3] - 0.5), z, FUR_DK);
}
// shaggy belly fringe (long hair hanging under the body)
for (let z = 0; z <= 9; z += 1) {
  line(-3, 1, z, -3, 2, z, FUR_DK);
  line(3, 1, z, 3, 2, z, FUR_DK);
}

// ---------- HEAD ----------
sphere(0, 8.2, -4.5, 3.0, FUR);
sphere(0, 7.0, -6.2, 1.9, FUR); // lower jaw/muzzle mass, leads into trunk
sphere(0, 10.6, -4.2, 1.3, FUR_DK); // forehead fur tuft

// ears (flat rounded slabs on either side of the head)
for (const side of [-1, 1]) {
  const ex = side * 4.6;
  hollowCube(ex, 8, -5, ex + side, 10, -3, FUR_DK);
  cube(ex, 8, -5, ex, 10, -3, FUR_DK);
}

// eyes
block(-2.6, 8.6, -5.0, EYE);
block(2.6, 8.6, -5.0, EYE);

// ---------- TRUNK (curves down and slightly forward from the head) ----------
chain([
  [0, 7.8, -6.5, 1.5],
  [0, 6.5, -7.2, 1.4],
  [0, 5.2, -7.7, 1.3],
  [0, 3.9, -8.0, 1.15],
  [0, 2.6, -8.1, 1.0],
  [0, 1.4, -8.0, 0.9],
  [0, 0.3, -7.6, 0.85], // trunk tip curls slightly back up
], FUR);

// ---------- TUSKS (curve outward, forward, and up from the mouth) ----------
for (const side of [-1, 1]) {
  chain([
    [side * 1.6, 6.3, -5.6, 0.7],
    [side * 2.3, 6.6, -6.6, 0.6],
    [side * 2.9, 7.2, -7.4, 0.5],
    [side * 3.2, 8.0, -7.9, 0.45],
    [side * 3.1, 8.7, -8.1, 0.4],
  ], TUSK);
}

// ---------- TAIL ----------
chain([
  [0, 6.8, 11.5, 0.7],
  [0, 5.6, 12.3, 0.55],
  [0, 4.4, 12.8, 0.45],
], FUR_DK);
sphere(0, 3.6, 13.0, 0.6, FUR_DK); // tail tuft
```
