// troll-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Troll Under a Bridge =====

// --- clear tree canopy above ground across the build footprint ---
cube(-13, 1, -13, 13, 15, 20, AIR);

// --- carve ravine bed (open gorge under the bridge) ---
cube(-6, -7, -9, 6, 0, 17, AIR);
// abutment footprints (only under bridge width)
cube(-11, -1, -3, -7, 7, 3, AIR);
cube(7, -1, -3, 11, 7, 3, AIR);
// retaining wall columns (thin, full ravine length)
cube(-7, -6, -9, -7, 0, 17, AIR);
cube(7, -6, -9, 7, 0, 17, AIR);

// ---------------- RAVINE BED ----------------
cube(-6, -6, -9, 6, -6, 17, STONE);           // floor
cube(-3, -5, -9, 3, -5, 17, GLASS);           // creek water
cube(-6, -5, -9, -4, -5, 17, SAND);           // gravel bank west
cube(4, -5, -9, 6, -5, 17, SAND);             // gravel bank east

// retaining walls between ravine and banks
cube(-7, -6, -9, -7, 0, 17, STONE);
cube(7, -6, -9, 7, 0, 17, STONE);
// end caps (lip of the gorge, near + far)
cube(-7, -6, -9, 7, 0, -9, STONE);
cube(-7, -6, 17, 7, 0, 17, STONE);

// scattered boulders for texture
block(-5, -5, -6, STONE); block(5, -5, 8, STONE); block(-4, -5, 12, STONE);
block(4, -5, -4, STONE); block(-6, -5, 2, STONE);

// ---------------- BRIDGE ABUTMENTS ----------------
cube(-11, -1, -3, -7, 7, 3, STONE);
cube(7, -1, -3, 11, 7, 3, STONE);
// foundation toes going into the bank
cube(-12, -1, -2, -11, 3, 2, COBBLE);
cube(11, -1, -2, 12, 3, 2, COBBLE);

// ---------------- STONE ARCH ----------------
// underside curve: y = sqrt(R^2 - x^2), fill up to deck bottom (y=7)
for (let x = -6; x <= 6; x++) {
  const outerY = Math.sqrt(49 - x * x);
  const topSolid = Math.ceil(outerY);
  cube(x, topSolid, -3, x, 7, 3, STONE);
}
// keystone accent at crown
cube(-1, 6, -3, 1, 7, 3, COBBLE);

// moss on the underside of the arch / abutment faces
block(-5, 2, -3, LEAVES); block(-3, 4, -3, LEAVES); block(0, 5, -3, LEAVES);
block(3, 4, -3, LEAVES); block(5, 2, -3, LEAVES);
block(-6, 0, -3, LEAVES); block(6, 0, -3, LEAVES);
block(-5, 2, 3, LEAVES); block(5, 2, 3, LEAVES);

// ---------------- DECK ----------------
cube(-11, 8, -3, 11, 9, 3, COBBLE);
cube(-11, 9, -3, 11, 9, 3, PLANKS); // road surface on top

// parapets
cube(-11, 10, -3, 11, 11, -3, STONE);
cube(-11, 10, 3, 11, 11, 3, STONE);
// crenellations
for (let x = -11; x <= 11; x += 2) {
  block(x, 12, -3, STONE);
  block(x, 12, 3, STONE);
}
// rail posts
for (let x = -10; x <= 10; x += 4) {
  cube(x, 10, -3, x, 12, -3, OAK_LOG);
  cube(x, 10, 3, x, 12, 3, OAK_LOG);
}

// ---------------- TROLL (facing north, -Z) ----------------
// stone perch in the creek
cube(-2, -5, -1, 2, -5, 1, STONE);

// legs
cube(-2, -4, 0, -1, -2, 1, DIRT);
cube(1, -4, 0, 2, -2, 1, DIRT);
// feet / toes
cube(-2, -4, -1, -1, -4, -1, DIRT);
cube(1, -4, -1, 2, -4, -1, DIRT);

// hips
cube(-2, -1, 0, 2, -1, 2, DIRT);
// loincloth
cube(-2, -1, -1, 2, -1, 1, BRICK);

// torso / belly (hunched, bulging)
cube(-2, 0, 0, 2, 3, 3, DIRT);
cube(-1, 3, 1, 1, 3, 2, DIRT); // upper chest taper

// shoulders
cube(-3, 3, 1, 3, 4, 3, DIRT);

// arms hanging long, dragging near ground
cube(-4, -3, 1, -3, 3, 2, DIRT);
cube(3, -3, 1, 4, 3, 2, DIRT);
// big knuckled fists
cube(-5, -4, 1, -3, -3, 2, DIRT);
cube(3, -4, 1, 5, -3, 2, DIRT);

// head, pushed forward/down (hunched toward viewer)
cube(-2, 4, -1, 2, 6, 2, DIRT);
// brow ridge
cube(-2, 6, -1, 2, 6, 0, STONE);
// horns
cube(-1, 7, 0, -1, 8, 0, STONE);
cube(1, 7, 0, 1, 8, 0, STONE);
// eyes
block(-1, 5, -2, SNOW);
block(1, 5, -2, SNOW);
// tusks
block(-1, 4, -2, STONE);
block(1, 4, -2, STONE);

// warts / rocky hide patches
block(-2, 2, 0, STONE); block(2, 1, 2, STONE); block(-3, 4, 2, STONE);
block(3, 4, 2, STONE); block(-1, 1, 3, STONE); block(1, 0, 0, STONE);
block(-4, 0, 1, STONE); block(4, 0, 1, STONE);

// club leaning against right fist
line(5, -4, 1, 5, 3, -2, OAK_LOG);
cube(4, 3, -3, 6, 4, -1, STONE);

// bone pile at troll's feet
block(-3, -5, 2, SNOW); block(-2, -5, 3, SNOW); block(3, -5, 3, SNOW);

// ---------------- FAR-BANK TREES ----------------
cube(-9, 0, 14, -9, 2, 14, OAK_LOG);
sphere(-9, 4, 14, 2, LEAVES);
cube(9, 0, 14, 9, 2, 14, OAK_LOG);
sphere(9, 4, 14, 2, LEAVES);
```
