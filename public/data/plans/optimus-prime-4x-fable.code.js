// optimus-prime-4x-fable — prompt:
// Optimus Prime...

const h = (x, z) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };

// --- clear trees around the statue and trailer site (AIR is free) ---
cube(-14, 1, -16, 14, 14, 8, AIR);
cube(-6, 1, 8, 6, 12, 22, AIR);

// --- battle plaza: cracked stone road ---
for (let x = -9; x <= 9; x++) {
  for (let z = -12; z <= 7; z++) {
    const r = h(x, z);
    if (r > 0.96 && (Math.abs(x) > 6 || z < -8)) { block(x, 0, z, AIR); continue; }
    block(x, 0, z, r < 0.14 ? COBBLE : (r < 0.19 ? DIRT : STONE));
  }
}

// --- ruined brick wall (background damage, west-front) ---
const hgt = [3, 5, 2, 4, 2, 3];
for (let i = 0; i < hgt.length; i++) {
  const x = -9 + i;
  cube(x, 1, -12, x, hgt[i], -12, BRICK);
  if (h(x, 99) > 0.5) block(x, hgt[i] + 1, -12, COBBLE);
}
block(-7, 2, -12, AIR);
block(-6, 2, -12, AIR);

// --- blast crater ---
sphere(7, 0, -10, 2, AIR);
block(7, -1, -10, BRICK);
block(6, -2, -10, BRICK);
block(5, 1, -10, COBBLE); block(9, 1, -10, COBBLE);
block(7, 1, -12, COBBLE); block(7, 1, -8, COBBLE);
block(8, 1, -12, STONE); block(5, 1, -8, COBBLE);

// ================= OPTIMUS PRIME =================
// --- boots (cobble, stone toes) ---
cube(-7, 1, -5, -3, 3, 0, COBBLE);
cube(3, 1, -5, 7, 3, 0, COBBLE);
cube(-7, 1, -8, -3, 2, -6, STONE);
cube(3, 1, -8, 7, 2, -6, STONE);

// --- shins (blue) with silver front ridges ---
cube(-6, 4, -4, -3, 10, -1, GLASS);
cube(3, 4, -4, 6, 10, -1, GLASS);
cube(-5, 4, -5, -4, 9, -5, STONE);
cube(4, 4, -5, 5, 9, -5, STONE);

// --- knee pads ---
cube(-6, 10, -5, -3, 11, -1, COBBLE);
cube(3, 10, -5, 6, 11, -1, COBBLE);

// --- thighs (silver) ---
cube(-5, 11, -3, -3, 14, -1, STONE);
cube(3, 11, -3, 5, 14, -1, STONE);
block(-4, 12, -4, SNOW); block(4, 12, -4, SNOW);

// --- pelvis / waist ---
cube(-5, 14, -3, 5, 16, 0, COBBLE);
cube(-1, 14, -4, 1, 16, -3, BRICK);
block(-4, 15, -3, SAND); block(4, 15, -3, SAND);

// --- abdomen (silver band) with red emblem ---
cube(-4, 17, -2, 4, 18, 0, COBBLE);
block(0, 18, -2, BRICK); block(-1, 17, -2, BRICK); block(1, 17, -2, BRICK);

// --- chest (red) ---
cube(-6, 19, -3, 6, 25, 0, BRICK);
cube(-6, 19, -3, 6, 19, -3, STONE);            // bumper
cube(-3, 20, -3, 3, 20, -3, SNOW);             // grille
block(-5, 20, -3, SAND); block(5, 20, -3, SAND); // headlights
cube(-5, 21, -3, -1, 24, -3, ICE);             // windshield L
cube(1, 21, -3, 5, 24, -3, ICE);               // windshield R
cube(-4, 20, 1, 4, 24, 1, COBBLE);             // backpack

// --- shoulders (red, stone trim) + smokestacks ---
cube(-10, 23, -4, -7, 26, 1, BRICK);
cube(7, 23, -4, 10, 26, 1, BRICK);
cube(-10, 26, -4, -7, 26, 1, STONE);
cube(7, 26, -4, 10, 26, 1, STONE);
cube(-9, 27, 1, -9, 31, 1, COBBLE);
cube(9, 27, 1, 9, 31, 1, COBBLE);
block(-9, 32, 1, STONE); block(9, 32, 1, STONE);

// --- left arm: aims ion blaster forward ---
cube(-10, 17, -2, -8, 22, 0, BRICK);           // upper arm
cube(-10, 16, -4, -8, 17, -2, COBBLE);         // elbow
cube(-10, 14, -8, -8, 16, -2, BRICK);          // forearm forward
cube(-10, 14, -11, -8, 16, -9, GLASS);         // fist
cube(-10, 14, -15, -8, 16, -11, COBBLE);       // gun body
cube(-9, 17, -14, -9, 17, -12, STONE);         // scope
cube(-9, 15, -20, -9, 15, -15, STONE);         // barrel
block(-9, 15, -21, COBBLE);                    // muzzle
block(-9, 16, -20, SAND);                      // muzzle flash hint

// --- right arm: raised fist ---
cube(8, 26, -3, 10, 28, -1, BRICK);
cube(8, 29, -3, 10, 30, -1, BRICK);
cube(8, 30, -3, 10, 30, -1, COBBLE);           // wrist
cube(8, 31, -3, 10, 33, -1, GLASS);            // fist

// --- head ---
cube(-1, 26, -2, 1, 26, 0, STONE);             // neck
cube(-3, 27, -3, 3, 32, 1, GLASS);             // helmet
cube(-2, 27, -3, 2, 29, -3, SNOW);             // faceplate
block(-1, 30, -3, ICE); block(1, 30, -3, ICE); // eyes
block(0, 30, -3, SNOW);
cube(-2, 31, -3, 2, 31, -3, STONE);            // brow
cube(0, 33, -2, 0, 33, 1, STONE);              // crest ridge
block(0, 32, -4, STONE);                       // crest front
cube(-4, 29, -2, -4, 32, -1, GLASS);           // ear fin L
cube(4, 29, -2, 4, 32, -1, GLASS);             // ear fin R

// ================= TRAILER (parked behind) =================
cube(-4, 1, 9, 4, 1, 21, STONE);               // floor
cube(-4, 2, 9, -4, 8, 21, SNOW);               // left side
cube(4, 2, 9, 4, 8, 21, SNOW);                 // right side
cube(-4, 2, 9, 4, 8, 9, SNOW);                 // front
cube(-4, 2, 21, 4, 8, 21, SNOW);               // rear doors
cube(-4, 9, 9, 4, 9, 21, SNOW);                // roof
cube(-4, 4, 10, -4, 4, 20, BRICK);             // red stripe L
cube(-4, 5, 10, -4, 5, 20, GLASS);             // blue stripe L
cube(4, 4, 10, 4, 4, 20, BRICK);               // red stripe R
cube(4, 5, 10, 4, 5, 20, GLASS);               // blue stripe R
line(0, 2, 21, 0, 8, 21, STONE);               // door seam
for (const zx of [10, 14, 18]) {               // wheels
  cube(-5, 0, zx, -5, 1, zx + 1, STONE);
  cube(5, 0, zx, 5, 1, zx + 1, STONE);
}
for (const sx of [-4, 4]) {                    // autobot mark (red diamond)
  block(sx, 7, 14, BRICK);
  block(sx, 6, 13, BRICK); block(sx, 6, 15, BRICK);
  block(sx, 8, 14, BRICK);
}

// --- scattered rubble on the plaza ---
for (let x = -9; x <= 9; x++) {
  for (let z = -12; z <= 7; z++) {
    const r = h(x * 3 + 1, z * 5 + 2);
    if (r > 0.93 && (z < -9 || Math.abs(x) >= 8)) {
      block(x, 1, z, r > 0.97 ? BRICK : COBBLE);
    }
  }
}
block(-3, 1, -10, COBBLE); block(2, 1, -11, BRICK);
block(9, 1, 3, COBBLE); block(-9, 1, 5, COBBLE);