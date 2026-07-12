// treasure-chest-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== Treasure chest overflowing with gold =====
// Palette: PLANKS/OAK_LOG = wood body, COBBLE/STONE = iron fittings,
// SAND = gold (coins/bars/overflow), rare BRICK/GLASS/ICE = gem accents.

// ---- 0. Stone plinth so the chest sits flush regardless of terrain ----
cube(-8, -1, -6, 8, -1, 7, STONE);
hollowCube(-8, -1, -6, 8, -1, 7, COBBLE);

// ---- 1. Chest body shell ----
const BX1 = -5, BX2 = 5;   // width
const BZ1 = -3, BZ2 = 4;   // depth (front=-3 faces camera, back=4)
const BY1 = 0, BY2 = 4;    // body height / rim

hollowCube(BX1, BY1, BZ1, BX2, BY2, BZ2, PLANKS);   // wall shell
cube(BX1 + 1, BY1, BZ1 + 1, BX2 - 1, BY1, BZ2 - 1, PLANKS); // floor plug

// corner posts
for (const cx of [BX1, BX2]) {
  for (const cz of [BZ1, BZ2]) {
    cube(cx, BY1, cz, cx, BY2 + 1, cz, OAK_LOG);
  }
}

// iron bands
hollowCube(BX1, 1, BZ1, BX2, 1, BZ2, COBBLE);
hollowCube(BX1, 3, BZ1, BX2, 3, BZ2, COBBLE);

// front lock plate (protrudes slightly toward camera)
cube(-1, 1, BZ1 - 1, 1, 3, BZ1 - 1, STONE);
cube(-1, 1, BZ1 - 1, 1, 1, BZ1 - 1, COBBLE);
block(0, 2, BZ1 - 2, STONE); // keyhole nub

// ---- 2. Lid, propped open backward on stepped diagonal panels ----
const lidSteps = [
  { y0: BY2, y1: BY2 + 1, z0: BZ2, z1: BZ2 + 1 },
  { y0: BY2 + 1, y1: BY2 + 2, z0: BZ2 + 1, z1: BZ2 + 2 },
  { y0: BY2 + 2, y1: BY2 + 3, z0: BZ2 + 2, z1: BZ2 + 3 },
  { y0: BY2 + 3, y1: BY2 + 4, z0: BZ2 + 3, z1: BZ2 + 4 },
];
for (const s of lidSteps) {
  cube(BX1, s.y0, s.z0, BX2, s.y1, s.z1, PLANKS);
  cube(BX1, s.y0, s.z0, BX2, s.y0, s.z0, COBBLE); // trim seam at each step's low edge
}
// lid corner caps + far edge trim
for (const cx of [BX1, BX2]) {
  cube(cx, BY2, BZ2, cx, BY2 + 4, BZ2 + 4, OAK_LOG);
}
cube(BX1, BY2 + 4, BZ2 + 4, BX2, BY2 + 4, BZ2 + 4, OAK_LOG);
hollowCube(BX1, BY2 + 4, BZ2 + 4, BX2, BY2 + 4, BZ2 + 4, COBBLE);

// ---- 3. Gold filling the chest cavity up to the rim ----
cube(BX1 + 1, BY1 + 1, BZ1 + 1, BX2 - 1, BY2, BZ2 - 1, SAND);

// ---- 4. Overflow mound rising above the rim toward the open lid ----
cube(-4, 5, -2, 4, 5, 3, SAND);
cube(-3, 6, -1, 3, 6, 3, SAND);
cube(-2, 7, 0, 2, 7, 3, SAND);
cube(-1, 8, 1, 1, 8, 3, SAND);
block(0, 9, 2, SAND);

// a little "crown" glinting on the peak
cube(-1, 9, 2, 1, 9, 2, SAND);
block(-1, 10, 2, SAND);
block(0, 10, 2, SAND);
block(1, 10, 2, SAND);
block(0, 11, 2, BRICK); // ruby set in the crown

// scattered gems poking out of the mound
block(-2, 6, 1, GLASS);
block(2, 6, 2, ICE);
block(-1, 7, 2, BRICK);
block(1, 5, 0, GLASS);

// ---- 5. Cascade spilling out over the front lip toward the camera ----
cube(-4, 0, -4, 4, 4, -4, SAND);
cube(-5, 0, -5, 5, 3, -5, SAND);
cube(-6, 0, -6, 6, 2, -6, SAND);
cube(-7, 0, -7, 7, 1, -7, SAND);

// gem sparkle on the cascade
block(3, 1, -5, GLASS);
block(-3, 2, -4, ICE);
block(-4, 1, -6, BRICK);

// ---- 6. Scattered spilled coins fanning across the ground ----
function scatterCoins(x1, x2, z1, z2, density) {
  for (let x = x1; x <= x2; x++) {
    for (let z = z1; z <= z2; z++) {
      if (Math.random() < density) {
        const r = Math.random();
        const id = r < 0.85 ? SAND : (r < 0.93 ? GLASS : (r < 0.97 ? BRICK : ICE));
        block(x, 0, z, id);
        if (Math.random() < 0.25) block(x, 1, z, SAND);
      }
    }
  }
}
scatterCoins(-7, 7, -9, -8, 0.35);
scatterCoins(-6, 6, -11, -10, 0.18);
scatterCoins(-8, -6, -3, 3, 0.15);
scatterCoins(6, 8, -3, 3, 0.15);

// ---- 7. A couple of loose gold bar stacks beside the chest ----
function goldBar(x, y, z) {
  cube(x, y, z, x + 1, y, z + 2, SAND);
}
goldBar(-7, 0, -1);
goldBar(-7, 1, -1);
goldBar(6, 0, 0);
goldBar(6, 1, 0);
goldBar(6, 2, 0);
