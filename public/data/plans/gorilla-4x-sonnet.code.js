// gorilla-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
const COBBLE = 8, STONE = 3, SNOW = 12, LEAVES = 5;

// ===== FEET =====
cube(-5, 0, -2, -2, 1, 2, COBBLE);
cube(2, 0, -2, 5, 1, 2, COBBLE);
cube(-5, 0, -4, -2, 0, -3, COBBLE);
cube(2, 0, -4, 5, 0, -3, COBBLE);
// toe separation
block(-4, 0, -4, 0); block(-2, 0, -4, 0);
block(3, 0, -4, 0); block(5, 0, -4, 0);

// ===== LOWER LEGS =====
cube(-5, 1, -1, -3, 4, 1, COBBLE);
cube(3, 1, -1, 5, 4, 1, COBBLE);

// ===== THIGHS (bent forward) =====
cube(-6, 4, -2, -2, 6, 2, COBBLE);
cube(2, 4, -2, 6, 6, 2, COBBLE);

// ===== HIP / PELVIS =====
cube(-6, 6, -2, 6, 7, 3, COBBLE);

// ===== LOWER BELLY =====
cube(-6, 7, -3, 6, 9, 3, COBBLE);

// ===== MID CHEST (widening, puffed forward) =====
cube(-7, 9, -4, 7, 11, 3, COBBLE);

// ===== UPPER CHEST (widest point) =====
cube(-7, 11, -4, 7, 13, 3, COBBLE);

// ===== SHOULDERS =====
cube(-8, 13, -3, 8, 14, 2, COBBLE);

// ===== SILVERBACK SADDLE (gray patch across back/rump) =====
cube(-6, 6, 1, 6, 11, 3, STONE);
cube(-5, 12, 1, 5, 13, 2, STONE);

// ===== NECK =====
cube(-2, 14, -1, 2, 15, 1, COBBLE);

// ===== HEAD =====
cube(-3, 15, -3, 3, 18, 2, COBBLE);
cube(-1, 18, -1, 1, 19, 1, COBBLE); // sagittal crest
cube(-3, 17, -4, 3, 17, -3, COBBLE); // brow ridge
cube(-2, 15, -4, 2, 16, -3, COBBLE); // muzzle/jaw

// eyes (carved into brow shadow)
block(-2, 16, -4, 0);
block(2, 16, -4, 0);

// open roaring mouth
cube(-1, 15, -4, 1, 15, -4, 0);
block(-2, 15, -4, SNOW);
block(2, 15, -4, SNOW);

// ears
cube(-4, 16, -1, -4, 17, 0, COBBLE);
cube(4, 16, -1, 4, 17, 0, COBBLE);

// ===== LEFT ARM (relaxed, hanging) =====
cube(-9, 9, -3, -8, 13, 1, COBBLE);
cube(-9, 4, -4, -7, 9, -1, COBBLE);
cube(-9, 1, -4, -6, 4, -1, COBBLE);
sphere(-7, 2, -3, 2, COBBLE);
block(-8, 0, -3, COBBLE);
block(-6, 0, -2, COBBLE);

// ===== RIGHT ARM (bent up, mid chest-beat) =====
cube(8, 9, -3, 9, 13, 1, COBBLE);
cube(4, 9, -4, 8, 11, -2, COBBLE);
cube(3, 9, -5, 6, 11, -4, COBBLE);
sphere(4, 10, -5, 2, COBBLE);
block(3, 9, -5, SNOW);
block(6, 11, -5, SNOW);

// ===== FOREGROUND ROCKS =====
cube(6, 0, 3, 9, 1, 6, STONE);
cube(-9, 0, 4, -6, 1, 7, STONE);
block(7, 2, 4, STONE);
block(-8, 2, 5, STONE);

// ===== BACKGROUND BUSHES =====
sphere(9, 2, 6, 2, LEAVES);
sphere(-10, 2, 7, 2, LEAVES);
sphere(10, 1, -2, 1, LEAVES);
```
