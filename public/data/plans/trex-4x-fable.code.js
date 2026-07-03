// trex-4x-fable — prompt:
// a T-Rex...

// T-REX — roaring pose, head high at -Z, dragging tail to +Z
// Palette: LEAVES body, SAND belly/throat, DIRT ridge+markings,
// SNOW teeth/claws/bones, BRICK mouth+eyes.

// --- clear forest canopy out of the silhouette (targeted, AIR is free) ---
cube(-7, 1, -14, 7, 7, 11, AIR);   // body + legs + under-neck corridor
cube(-4, 1, 11, 4, 7, 21, AIR);    // tail corridor

// ---------------- LEGS (slightly staggered stance) ----------------
// left leg forward
cube(-6, -2, 2, -2, 0, 7, LEAVES);           // foot
cylinder(-4, -2, 6, 1, 9, LEAVES);           // shin
sphere(-4, 9, 5, 3, LEAVES);                 // thigh
// right leg back
cube(2, -2, 4, 6, 0, 9, LEAVES);
cylinder(4, -2, 8, 1, 9, LEAVES);
sphere(4, 9, 7, 3, LEAVES);
// toe claws
for (const x of [-6, -4, -2]) { block(x, -1, 1, SNOW); block(x, 0, 1, SNOW); }
for (const x of [2, 4, 6])    { block(x, -1, 3, SNOW); block(x, 0, 3, SNOW); }

// ---------------- TORSO ----------------
sphere(0, 12, 6, 5, LEAVES);    // hindquarters
sphere(0, 13, 1, 5, LEAVES);    // mid torso
sphere(0, 14, -3, 4, LEAVES);   // chest / shoulders

// ---------------- NECK ----------------
sphere(0, 16, -6, 3, LEAVES);
sphere(0, 18, -8, 3, LEAVES);

// belly + throat (lighter underside, pokes below the green)
sphere(0, 9, 4, 3, SAND);
sphere(0, 10, 0, 3, SAND);
sphere(0, 11, -3, 2, SAND);
sphere(0, 15, -6, 2, SAND);

// ---------------- TAIL (curving down, tapering) ----------------
const tail = [[12,10,3],[11,12,3],[10,14,2],[9,16,2],[8,18,2],[7,19,1],[7,20,1],[6,21,1]];
for (const [y, z, r] of tail) sphere(0, y, z, r, LEAVES);

// ---------------- HEAD ----------------
cube(-3, 18, -13, 3, 24, -8, LEAVES);    // skull
cube(-2, 20, -17, 2, 23, -13, LEAVES);   // upper snout
// lower jaw — three stepped segments, wide-open roar
cube(-2, 17, -11, 2, 18, -8, LEAVES);    // hinge
cube(-2, 16, -14, 2, 17, -11, LEAVES);   // mid
cube(-2, 15, -17, 2, 16, -14, LEAVES);   // tip
// mouth interior
cube(-1, 20, -16, 1, 20, -13, BRICK);    // roof of mouth
cube(-1, 17, -13, 1, 17, -11, BRICK);    // tongue back
cube(-1, 16, -16, 1, 16, -14, BRICK);    // tongue front
// upper teeth (hanging from snout rim)
for (const z of [-16, -14]) { block(-2, 19, z, SNOW); block(2, 19, z, SNOW); }
block(-1, 19, -17, SNOW); block(1, 19, -17, SNOW);
// lower teeth (front edge of jaw tip)
block(-1, 17, -17, SNOW); block(1, 17, -17, SNOW);
block(-2, 17, -15, SNOW); block(2, 17, -15, SNOW);
// eyes + brows
block(-3, 22, -12, BRICK); block(3, 22, -12, BRICK);
line(-3, 23, -13, -3, 23, -11, DIRT);
line(3, 23, -13, 3, 23, -11, DIRT);
// nostrils + jaw-muscle bumps
block(-1, 23, -16, DIRT); block(1, 23, -16, DIRT);
block(-4, 21, -10, LEAVES); block(4, 21, -10, LEAVES);
block(-4, 20, -9, LEAVES);  block(4, 20, -9, LEAVES);

// ---------------- TINY ARMS ----------------
line(-4, 13, -5, -6, 11, -6, LEAVES);
line(-6, 11, -6, -6, 9, -8, LEAVES);
block(-6, 8, -8, SNOW);
line(4, 13, -5, 6, 11, -6, LEAVES);
line(6, 11, -6, 6, 9, -8, LEAVES);
block(6, 8, -8, SNOW);

// ---------------- BACK RIDGE (dirt spikes, taller every other) ----------------
const ridge = [[-8,21],[-6,19],[-4,18],[-2,18],[0,18],[2,18],[4,17],[6,17],[8,16],[10,15],[12,14],[14,12],[16,11],[18,10]];
ridge.forEach(([z, y], i) => { block(0, y, z, DIRT); if (i % 2 === 0) block(0, y + 1, z, DIRT); });

// dark hide markings on the flanks
block(-5, 13, 1, DIRT); block(5, 12, 2, DIRT);
block(-5, 11, 5, DIRT); block(5, 14, -2, DIRT);
block(-4, 15, -5, DIRT); block(4, 12, 7, DIRT);
block(-7, 9, 5, DIRT);  block(7, 10, 7, DIRT);

// ---------------- SCENE: picked-clean prey skeleton + boulders ----------------
line(8, 0, -8, 13, 0, -8, SNOW);                      // spine
for (const x of [9, 11, 13]) {                        // rib arches
  block(x, 1, -9, SNOW); block(x, 1, -7, SNOW); block(x, 2, -8, SNOW);
}
cube(14, 0, -9, 15, 1, -8, SNOW);                     // prey skull
sphere(-9, 0, 12, 2, STONE);                          // half-buried boulder
sphere(-13, -1, -4, 2, COBBLE);                       // mossy rock outcrop