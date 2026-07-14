// loch-ness-4x-fable — prompt:
// the Loch Ness Monster...

const L = LEAVES, W = GLASS, F = SNOW, K = OAK_LOG;
const RX = 19, RZ = 17, CZ = 2;

function inLoch(x, z) {
  const dx = x / RX, dz = (z - CZ) / RZ;
  return dx * dx + dz * dz;
}

// ---- carve the loch: clear vegetation over the water + a sightline corridor to the north shore ----
cube(-19, 1, -15, 19, 9, 19, AIR);
cube(-14, 1, -22, 12, 12, -15, AIR);

// ---- water surface + sandy shore ring ----
for (let x = -RX - 3; x <= RX + 3; x++) {
  for (let z = CZ - RZ - 3; z <= CZ + RZ + 3; z++) {
    if (x < -22 || x > 22 || z < -22 || z > 22) continue;
    const d = inLoch(x, z);
    if (d <= 1) block(x, 0, z, W);
    else if (d <= 1.15) { block(x, 0, z, SAND); block(x, -1, z, SAND); }
  }
}

// ---- foam helper: broken ring of white water at the surface ----
function foam(fx, fz, r0, r1) {
  for (let x = Math.floor(fx - r1); x <= Math.ceil(fx + r1); x++) {
    for (let z = Math.floor(fz - r1); z <= Math.ceil(fz + r1); z++) {
      const d = Math.sqrt((x - fx) * (x - fx) + (z - fz) * (z - fz));
      if (d >= r0 && d <= r1 && ((x * 31 + z * 17) & 3) !== 0 && inLoch(x, z) <= 1) {
        block(x, 0, z, F);
      }
    }
  }
}

// ---- hump: dome of green breaking the surface, with an oak ridge crest ----
function hump(hx, hz, r, h) {
  for (let y = -1; y <= h; y++) {
    const t = (y + 1) / (h + 1);
    const ry = r * Math.sqrt(Math.max(0, 1 - t * t));
    if (ry >= 0.7) disk(hx, y, hz, ry, L);
  }
  block(hx, h, hz, L);
  for (let dz = -Math.round(r * 0.6); dz <= Math.round(r * 0.6); dz += 2) {
    const yTop = Math.round((h + 1) * Math.sqrt(Math.max(0, 1 - (dz * dz) / (r * r))) - 1);
    block(hx, yTop + 1, hz + dz, K);
    if (dz === 0) block(hx, yTop + 2, hz + dz, K);
  }
  foam(hx, hz, r + 0.8, r + 2.2);
}

// ---- body: three serpentine humps receding south, biggest in front ----
hump(1, 3, 6.2, 5);
hump(-1, 10, 5, 4);
hump(1, 15, 3, 2);

// ---- chest mass where the neck enters the water ----
sphere(0, -1, -2, 3.8, L);
sphere(0, -1, 0, 3.5, L);
foam(0, -2.5, 4.4, 6.2);

// ---- neck: swan curve rising forward toward the camera, tapering as it climbs ----
const N = 16;
for (let i = 0; i <= N; i++) {
  const t = i / N;
  const nx = 2 * t * t;
  const ny = -2 + 24 * t;
  const nz = -3 - 8 * t * t;
  const r = 3.1 - 1.6 * t;
  sphere(Math.round(nx), Math.round(ny), Math.round(nz), r, L);
  // pale throat stripe on the camera-facing side
  if (i >= 2 && i <= 13) {
    block(Math.round(nx), Math.round(ny - r * 0.25), Math.round(nz - r * 0.95), SAND);
  }
  // dorsal fins down the back of the neck
  if (i >= 3 && i % 2 === 1) {
    block(Math.round(nx), Math.round(ny + r * 0.5), Math.round(nz + r * 0.9), K);
  }
}

// ---- head: plesiosaur skull with open jaw, facing north ----
cube(0, 21, -14, 4, 25, -9, L);        // skull
cube(1, 23, -18, 3, 24, -14, L);       // upper snout (overbite)
cube(1, 21, -17, 3, 21, -14, L);       // lower jaw
cube(1, 22, -15, 3, 22, -14, BRICK);   // red mouth interior
block(1, 22, -17, F);                  // fangs
block(3, 22, -17, F);
// nostrils on snout tip
block(1, 24, -18, STONE);
block(3, 24, -18, STONE);
// brow ridge + eyes proud of the face
cube(0, 26, -14, 4, 26, -13, L);
block(0, 25, -15, F); block(1, 25, -15, STONE);
block(4, 25, -15, F); block(3, 25, -15, STONE);
// little horns
block(1, 27, -12, K);
block(3, 27, -12, K);
// soften skull corners
block(0, 25, -9, AIR); block(4, 25, -9, AIR);
block(0, 21, -9, AIR); block(4, 21, -9, AIR);
block(0, 26, -13, AIR); block(4, 26, -13, AIR);

// ---- flippers slapping the surface ----
cube(-7, 0, 0, -5, 0, 3, L);
block(-8, 1, 1, L); block(-8, 1, 2, L); block(-9, 1, 2, L);
foam(-8.5, 1.5, 1.5, 3);
cube(6, 0, 4, 8, 0, 6, L);
foam(7.5, 5, 2, 3.2);

// ---- tail arch + fluke breaking the water behind the last hump ----
sphere(2, 0, 17, 1.5, L);
sphere(3, 1, 18, 1.2, L);
block(3, 2, 18, L);
block(3, 3, 18, L); block(3, 3, 19, K); block(3, 4, 18, K);
foam(2.5, 18, 2, 3.4);

// ---- bow wake: V of white water spreading toward the viewer ----
line(-3, 0, -8, -8, 0, -13, F);
line(3, 0, -8, 8, 0, -13, F);
foam(0, -6, 3.8, 4.6);

// ---- tiny rowboat with a lone witness, dwarfed by the monster ----
cube(-12, 0, -11, -10, 0, -7, PLANKS);
cube(-12, 1, -11, -10, 1, -11, K);
cube(-12, 1, -7, -10, 1, -7, K);
block(-12, 1, -10, K); block(-12, 1, -9, K); block(-12, 1, -8, K);
block(-10, 1, -10, K); block(-10, 1, -9, K); block(-10, 1, -8, K);
block(-11, 1, -9, BRICK); block(-11, 2, -9, BRICK);  // red-jacketed watcher
block(-11, 3, -9, SAND);                             // head
line(-10, 2, -9, -7, 5, -8, K);                      // fishing rod raised at the beast
foam(-11, -6, 1, 2.2);

// ---- gulls wheeling over the loch ----
block(11, 19, -8, F); block(12, 20, -8, F); block(13, 19, -8, F);
block(16, 16, -3, F); block(17, 17, -3, F); block(18, 16, -3, F);