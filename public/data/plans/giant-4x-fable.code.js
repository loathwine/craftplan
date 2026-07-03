// giant-4x-fable — prompt:
// an axe-wielding giant...

const AXE_STONE = STONE;

// ---- clear vegetation around the giant (keep ground) ----
cube(-13, 1, -8, 13, 13, 9, AIR);
cube(10, 1, -18, 20, 9, -9, AIR);

// ---- foundations under feet ----
cube(-7, -1, -6, -3, -1, 0, COBBLE);
cube(2, -1, -2, 6, -1, 4, COBBLE);

// ---- boots (left forward, right back = striding stance) ----
cube(-7, 0, -6, -3, 2, 0, COBBLE);
cube(2, 0, -2, 6, 2, 4, COBBLE);

// ---- legs (bare skin with leather wraps) ----
cube(-6, 3, -5, -3, 8, -1, SAND);
cube(2, 3, -1, 5, 8, 3, SAND);
cube(-6, 5, -5, -3, 5, -1, OAK_LOG);
cube(2, 6, -1, 5, 6, 3, OAK_LOG);

// ---- kilt with ragged hem ----
cube(-7, 9, -5, 7, 11, 4, LEAVES);
cube(-6, 12, -4, 6, 14, 3, LEAVES);
for (let x = -7; x <= 7; x += 2) {
  block(x, 8, -5, LEAVES);
  if (x + 1 <= 7) block(x + 1, 8, 4, LEAVES);
}

// ---- belt, buckle, skull trophy ----
cube(-6, 15, -4, 6, 15, 3, OAK_LOG);
cube(-1, 15, -5, 1, 15, -5, AXE_STONE);
block(0, 15, -5, SNOW);
cube(3, 13, -5, 4, 14, -5, SNOW);

// ---- torso ----
cube(-5, 16, -4, 5, 18, 3, SAND);          // waist
cube(-7, 19, -4, 7, 23, 3, SAND);          // chest
cube(-5, 20, -5, -1, 21, -5, SAND);        // left pec
cube(1, 20, -5, 5, 21, -5, SAND);          // right pec
// leather strap across chest (over shoulder to hip)
const strap = [[6,23],[5,22],[4,21],[3,20],[2,19],[1,18],[0,17],[-1,16]];
for (const [sx, sy] of strap) {
  block(sx, sy, -5, OAK_LOG);
  block(sx - 1, sy, -5, OAK_LOG);
}
// old battle scar
line(-5, 22, -4, -2, 19, -4, BRICK);

// ---- shoulders ----
cube(-11, 22, -3, -6, 24, 2, COBBLE);      // spiked pauldron (left)
block(-10, 25, -1, AXE_STONE);
block(-8, 25, 0, AXE_STONE);
cube(6, 22, -3, 10, 24, 2, SAND);          // bare shoulder (right)

// ---- left arm: hangs, dragging an uprooted tree ----
cube(-10, 14, -3, -8, 21, 0, SAND);
cube(-10, 16, -3, -8, 18, 0, OAK_LOG);     // bracer
cube(-10, 11, -3, -7, 13, 0, SAND);        // fist
line(-9, 12, -1, -17, 2, -1, OAK_LOG);     // dragged trunk
line(-9, 12, 0, -17, 2, 0, OAK_LOG);
line(-9, 11, -1, -17, 1, -1, OAK_LOG);
block(-8, 14, -1, OAK_LOG);                // torn roots by the fist
block(-9, 14, 0, OAK_LOG);
block(-8, 13, 0, OAK_LOG);
sphere(-17, 3, -1, 2, LEAVES);             // crown drags on the ground

// ---- right arm: raised, gripping the axe ----
cube(8, 24, -2, 10, 26, 0, SAND);          // upper arm
cube(9, 26, -2, 11, 29, 0, SAND);          // fist
cube(10, 20, -1, 10, 33, -1, OAK_LOG);     // haft
block(10, 19, -1, PLANKS);                 // haft knob

// ---- axe head: double-bit, snow-bright edges ----
cube(9, 31, -2, 11, 33, 0, COBBLE);        // hub
const bladeRows = [[33, 1, 3], [32, 2, 5], [31, 2, 6], [30, 3, 6]];
for (const [by, a, b] of bladeRows) {
  for (const s of [-1, 1]) {
    for (let o = a; o <= b; o++) {
      const bz = -1 + s * o;
      for (let bx = 9; bx <= 11; bx++) {
        block(bx, by, bz, o === b ? SNOW : AXE_STONE);
      }
    }
  }
}

// ---- head ----
cube(-3, 24, -4, 3, 29, 2, SAND);          // skull
cube(-3, 24, 3, 3, 29, 3, BRICK);          // hair down the back
block(-4, 26, -1, SAND);                   // ears
block(4, 26, -1, SAND);
// red beard + roaring mouth
cube(-3, 24, -5, 3, 26, -5, BRICK);
cube(-1, 25, -5, 1, 25, -5, AXE_STONE);
cube(-2, 21, -5, 2, 23, -5, BRICK);
cube(-1, 19, -5, 1, 20, -5, BRICK);
block(0, 18, -5, BRICK);
block(0, 26, -5, SAND);                    // nose splits the mustache
// eyes under a heavy brow
block(-2, 27, -4, SNOW);
block(-1, 27, -4, AXE_STONE);
block(2, 27, -4, SNOW);
block(1, 27, -4, AXE_STONE);
cube(-3, 28, -5, -1, 28, -5, OAK_LOG);
cube(1, 28, -5, 3, 28, -5, OAK_LOG);
// horned helmet
cube(-4, 29, -5, 4, 30, 3, COBBLE);
cube(-3, 31, -4, 3, 31, 2, COBBLE);
block(0, 28, -6, COBBLE);                  // nose guard
block(-5, 30, -1, OAK_LOG);
block(-6, 31, -1, OAK_LOG);
block(-6, 32, -1, OAK_LOG);
block(-7, 33, -1, SNOW);
block(5, 30, -1, OAK_LOG);
block(6, 31, -1, OAK_LOG);
block(6, 32, -1, OAK_LOG);
block(7, 33, -1, SNOW);

// ---- round shield slung on the back ----
for (let dx = -4; dx <= 4; dx++) {
  for (let dy = -4; dy <= 4; dy++) {
    const d2 = dx * dx + dy * dy;
    if (d2 <= 18) block(dx, 20 + dy, 4, d2 >= 13 ? COBBLE : PLANKS);
    if (d2 <= 2) block(dx, 20 + dy, 5, AXE_STONE);
  }
}

// ---- smashed hut the giant just visited ----
cube(12, 1, -16, 18, 3, -16, PLANKS);
cube(12, 1, -11, 18, 3, -11, PLANKS);
cube(12, 1, -15, 12, 3, -12, PLANKS);
cube(18, 1, -15, 18, 3, -12, PLANKS);
cube(14, 1, -11, 15, 2, -11, AIR);         // doorway
cube(16, 1, -12, 18, 3, -11, AIR);         // caved-in corner
cube(11, 4, -17, 19, 4, -14, OAK_LOG);     // half the roof survives
block(12, 4, -13, OAK_LOG);
block(15, 4, -13, OAK_LOG);
block(17, 4, -12, OAK_LOG);
// smouldering fire in the breach + scattered plank debris
block(17, 1, -11, BRICK);
block(17, 2, -11, BRICK);
block(16, 1, -12, BRICK);
block(18, 1, -12, BRICK);
block(19, 1, -10, PLANKS);
block(20, 1, -11, PLANKS);
block(17, 1, -9, PLANKS);
block(15, 1, -8, PLANKS);
block(19, 2, -10, PLANKS);

// ---- boulders and rubble around the feet ----
sphere(-11, 1, 5, 2, AXE_STONE);
sphere(12, 1, 3, 2, COBBLE);
block(8, 1, 7, COBBLE);
block(-8, 1, -7, AXE_STONE);
block(7, 1, -6, AXE_STONE);
block(-4, 1, 8, COBBLE);