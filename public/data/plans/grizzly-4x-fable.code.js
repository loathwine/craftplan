// grizzly-4x-fable — prompt:
// a grizzly bear standing on its hind legs...

const map = new Map();
const put = (x, y, z, id) => {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  map.set(x + ',' + y + ',' + z, id);
};
const h = (x, y, z) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
};
function ell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.0) put(x, y, z, id);
      }
}
function sph(cx, cy, cz, r, id) { ell(cx, cy, cz, r, r, r, id); }
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) put(x, y, z, id);
}

// ---- ground scene ----
// half-buried boulders (west side)
sph(-10, 0, -2, 2.2, STONE);
sph(-12, 0, 1, 1.6, COBBLE);
sph(-8, -1, 2, 1.4, COBBLE);
// fallen log with leaf tuft (east foreground)
box(7, 0, -5, 13, 1, -4, OAK_LOG);
put(10, 2, -4, OAK_LOG);
sph(14, 1, -4, 1.8, LEAVES);
// flat rock with a salmon on it, right in front of the bear
box(-3, -1, -8, 1, -1, -5, STONE);
put(-2, 0, -6, BRICK); put(-1, 0, -6, BRICK); put(0, 0, -6, BRICK); put(1, 0, -6, BRICK);
put(2, 0, -7, BRICK); put(2, 0, -5, BRICK);
put(-3, 0, -6, SAND);
// paw-print track leading in from the north
const prints = [[-2, -9], [0, -9], [2, -12], [4, -12], [-1, -15], [1, -15], [3, -18], [5, -18]];
for (const [px, pz] of prints) put(px, 0, pz, DIRT);

// ---- hind legs & feet ----
box(2, 0, -2, 6, 1, 4, OAK_LOG);       // east foot
box(-6, 0, -2, -2, 1, 4, OAK_LOG);     // west foot
for (const fx of [3, 4, 5]) { put(fx, 0, -3, SNOW); put(-fx, 0, -3, SNOW); } // toe claws
ell(4, 2, 2, 2.4, 2, 3, OAK_LOG);      // ankles
ell(-4, 2, 2, 2.4, 2, 3, OAK_LOG);
ell(4, 6, 3.5, 2.9, 5, 3.4, OAK_LOG);  // thighs
ell(-4, 6, 3.5, 2.9, 5, 3.4, OAK_LOG);

// ---- body ----
ell(0, 10, 4, 6.8, 4.6, 5, OAK_LOG);       // pelvis / rump
ell(0, 15, 2.5, 6.4, 5.6, 4.8, OAK_LOG);   // torso, chest at z=-2
ell(0, 20.5, 4.5, 4.6, 2.8, 3.4, OAK_LOG); // shoulder hump
ell(0, 21, 1.5, 3.2, 2.6, 3.4, OAK_LOG);   // neck
ell(0, 11.5, 9.5, 1.6, 1.4, 1.6, OAK_LOG); // stub tail

// ---- raised forelegs (bezier capsules), slight asymmetry ----
function arm(side) {
  const S = [side * 5.5, 18.5, 2.5];
  const E = [side * 9.5, side < 0 ? 21 : 20.5, 1];
  const P = [side * 10, side < 0 ? 25.5 : 24.2, -0.5];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, u = 1 - t;
    const bx = u * u * S[0] + 2 * u * t * E[0] + t * t * P[0];
    const by = u * u * S[1] + 2 * u * t * E[1] + t * t * P[1];
    const bz = u * u * S[2] + 2 * u * t * E[2] + t * t * P[2];
    sph(bx, by, bz, 2.6 - 0.5 * t, OAK_LOG);
  }
  const px = Math.round(P[0]), py = Math.round(P[1]);
  sph(px, py, -0.5, 2.3, OAK_LOG); // forepaw
  for (const dx of [-1, 0, 1]) {   // claws, front-top edge
    put(px + dx, py + 1, -2, SNOW);
    put(px + dx, py + 2, -2, SNOW);
  }
  put(px, py, -3, PLANKS);         // paw pad
}
arm(-1);
arm(1);

// ---- head ----
ell(0, 24, 1, 3.6, 3.2, 3.6, OAK_LOG);
// brow ridge
for (let x = -2; x <= 2; x++) put(x, 26, -1, OAK_LOG);
// lower jaw, dropped open (roaring)
box(-1, 20, -5, 1, 21, -2, PLANKS);
// muzzle
ell(0, 23, -3, 2.2, 2.2, 2.6, PLANKS);
// upper lip so teeth have something to hang from
for (let x = -1; x <= 1; x++) put(x, 24, -5, PLANKS);
// carve open mouth
for (let x = -1; x <= 1; x++) for (let y = 22; y <= 23; y++) for (let z = -6; z <= -2; z++) put(x, y, z, AIR);
// red throat + tongue
for (let x = -1; x <= 1; x++) { put(x, 22, -2, BRICK); put(x, 23, -2, BRICK); put(x, 22, -3, BRICK); put(x, 22, -4, BRICK); }
// fangs
put(-1, 23, -5, SNOW); put(1, 23, -5, SNOW);
put(-1, 22, -5, SNOW); put(1, 22, -5, SNOW);
// nose
put(-1, 25, -5, STONE); put(0, 25, -5, STONE); put(1, 25, -5, STONE);
// eyes
put(-2, 25, -2, STONE); put(2, 25, -2, STONE);
// ears with tan inner faces
sph(-2.5, 27, 1.5, 1.6, OAK_LOG);
sph(2.5, 27, 1.5, 1.6, OAK_LOG);
put(-2, 27, 0, PLANKS); put(-3, 27, 0, PLANKS);
put(2, 27, 0, PLANKS); put(3, 27, 0, PLANKS);

// ---- fur texture pass: chest patch, grizzled silver back, mottled fur ----
for (const [k, id] of map) {
  if (id !== OAK_LOG) continue;
  const [x, y, z] = k.split(',').map(Number);
  const n = h(x, y, z);
  if (z <= -1 && y >= 11 && y <= 18 && Math.abs(x) <= 3) map.set(k, DIRT);        // dark chest
  else if (y >= 18 && z >= 1 && n < 0.20) map.set(k, PLANKS);                     // silver-tipped hump
  else if (n < 0.10) map.set(k, DIRT);                                            // fur mottling
}

// ---- emit: clear tree canopies around the bear first, then the build ----
cube(-13, 1, -8, 13, 8, 10, AIR);
for (const [k, id] of map) {
  const [x, y, z] = k.split(',').map(Number);
  block(x, y, z, id);
}