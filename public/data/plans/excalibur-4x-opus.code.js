// excalibur-4x-opus — prompt:
// Excalibur in the stone...

const meta = null; // (ignored)

// ============================================================
// "EXCALIBUR IN THE STONE"
// Front faces NORTH (-Z). Sword point-down, hilt raised.
// ============================================================

// ---------- 1. CLEAR THE FOREST CANOPY (existing leaves fill y0..8) ----------
// Carve a clearing so the monument is visible; surrounding forest frames it.
cube(-10, 0, -9, 10, 9, 8, AIR);
// open a sight-lane straight to the camera (north)
cube(-4, 0, -20, 4, 9, -9, AIR);

// ---------- helpers ----------
function moss(x, y, z) { block(x, y, z, LEAVES); }
function rock(cx, cy, cz, r) {
  sphere(cx, cy, cz, r, COBBLE);
  // a couple of gray highlights + moss on the sunlit north face
  block(cx, cy + r, cz, STONE);
  moss(cx - 1, cy + r - 1, cz - 1);
  moss(cx + 1, cy + r - 1, cz);
}

// ============================================================
// 2. THE STONE (a cracked boulder / anvil the blade is driven into)
// ============================================================
// stepped organic mound
cube(-6, -1, -5, 6, -1, 6, STONE);   // buried footing
cube(-6,  0, -4, 6,  0, 5, STONE);
cube(-5,  1, -3, 5,  1, 4, COBBLE);
cube(-5,  2, -3, 5,  2, 4, STONE);
cube(-4,  3, -2, 4,  3, 3, COBBLE);
cube(-4,  4, -2, 4,  4, 3, STONE);
cube(-3,  5, -1, 3,  5, 2, COBBLE);  // split top platform

// knock the corners off for an organic boulder silhouette
const corners = [[-6,-4],[6,-4],[-6,5],[6,5]];
for (const [cx, cz] of corners) {
  block(cx, 0, cz, AIR);
  block(cx, -1, cz, AIR);
}
for (const [cx, cz] of [[-5,-3],[5,-3],[-5,4],[5,4]]) {
  block(cx, 2, cz, AIR); block(cx, 1, cz, AIR);
}
block(-4,4,-2,AIR); block(4,4,-2,AIR); block(-4,4,3,AIR); block(4,4,3,AIR);

// veins of moss + weathering on the boulder
for (let x = -5; x <= 5; x++) {
  for (let z = -3; z <= 4; z++) {
    if (((x * 7 + z * 3) % 5) === 0) moss(x, 1, z);
    if (((x + z * 2) % 4) === 0) block(x, 3, z, STONE);
  }
}
// dark cracks radiating from where the blade split the stone
line(0, 5, 1, -3, 3, -1, AIR);
line(0, 5, 1,  3, 3,  3, AIR);
line(0, 5, 1, -2, 2,  4, AIR);
line(0, 5, 1,  2, 4, -1, AIR);
// raised lips of stone hugging the blade (freshly cloven)
cube(-2, 6, 0, 2, 6, 1, COBBLE);
block(-2,7,0,STONE); block(2,7,0,STONE); block(-2,7,1,STONE); block(2,7,1,STONE);

// ============================================================
// 3. THE BLADE (embedded point-down, wide face toward camera)
// ============================================================
const bBot = 4;    // buried tip depth
const bTop = 16;   // meets the crossguard
for (let y = bBot; y <= bTop; y++) {
  const half = (y >= 8) ? 2 : 1;               // taper where it enters the stone
  for (let x = -half; x <= half; x++) {
    let id;
    if (Math.abs(x) === 2)      id = SNOW;      // bright bevelled edges
    else if (x === 0)           id = STONE;     // central fuller
    else                        id = COBBLE;    // steel body
    block(x, y, 0, id);
    block(x, y, 1, id);
  }
}
// glowing runes inset down the fuller (magic)
for (const y of [10, 12, 14]) block(0, y, 0, ICE);
// a faint aura of frost motes around the emerging blade
for (const [x, y, z] of [[-4,11,-1],[4,13,-1],[-3,14,2],[3,10,2],[0,15,-2]])
  block(x, y, z, ICE);

// ============================================================
// 4. CROSSGUARD (golden, ornate up-curled ends, red gem)
// ============================================================
cube(-6, 16, 0, 6, 16, 1, SAND);
cube(-5, 17, 0, 5, 17, 1, SAND);
// flared, up-turned tips
for (const s of [-1, 1]) {
  block(6 * s, 17, 0, SAND); block(6 * s, 17, 1, SAND);
  block(7 * s, 17, 0, SAND);
  block(7 * s, 18, 0, SAND); block(7 * s, 18, 1, SAND);
  block(7 * s, 19, 0, SAND); // curl tip
  block(6 * s, 15, 0, SAND); // small down-lobe
}
// central boss + jewel facing the camera
block(0, 16, -1, BRICK);
block(0, 17, -1, BRICK);
block(1, 16, -1, SAND); block(-1, 16, -1, SAND);

// ============================================================
// 5. GRIP (leather-wrapped over wood)
// ============================================================
for (let y = 18; y <= 22; y++) {
  const id = (y % 2 === 0) ? OAK_LOG : BRICK;  // alternating wrap bands
  cube(-1, y, 0, 1, y, 1, id);
}

// ============================================================
// 6. POMMEL (golden knob with a blue gem)
// ============================================================
sphere(0, 24, 0, 2, SAND);
block(0, 24, -2, ICE);      // set gem, camera-facing
block(0, 26, 0, SAND);      // top nub
block(0, 23, 0, OAK_LOG);   // grip-to-pommel collar
block(0, 23, 1, OAK_LOG);

// ============================================================
// 7. FOREGROUND (rocks, bushes, a fallen shield) — nearest camera
// ============================================================
rock(6, 0, -4, 2);
rock(-6, 0, -5, 2);
rock(8, 0, -1, 1);
rock(-8, 0, 0, 2);
rock(7, 0, 3, 1);
rock(-5, -1, 6, 1);

// leafy tufts scattered on the clearing floor
for (const [x, z] of [[4,-6],[-4,-6],[3,5],[-3,6],[7,-3],[-7,-2],[5,4]])
  moss(x, 0, z);

// a weathered round shield leaning against the boulder (north face)
(function shield() {
  const cx = -7, cy = 3, z = -5, r = 2.6;
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= r) {
        let id = PLANKS;
        if (d > r - 1) id = OAK_LOG;                 // wooden rim
        if (Math.abs(dx) <= 0 || Math.abs(dy) <= 0) id = (d > r - 1) ? OAK_LOG : BRICK; // painted cross
        block(cx + dx, cy + dy, z, id);
      }
    }
  }
  block(cx, cy, z - 1, SAND); // central boss
})();

// ============================================================
// 8. BACKGROUND (twin mossy monoliths for depth) — behind, +Z
// ============================================================
(function monolith(cx) {
  cube(cx - 1, 0, 9, cx + 1, 8, 10, STONE);
  cube(cx - 1, 9, 9, cx + 1, 9, 10, COBBLE);
  // moss + weather
  for (let y = 0; y <= 9; y++) {
    if ((y + cx) % 3 === 0) moss(cx - 1, y, 9);
    if ((y * 2 + cx) % 4 === 0) block(cx + 1, y, 9, COBBLE);
  }
  moss(cx, 10, 9); moss(cx - 1, 10, 10); moss(cx + 1, 10, 9);
  block(cx, 9, 8, LEAVES);
})(-11);
(function monolith(cx) {
  cube(cx - 1, 0, 9, cx + 1, 7, 10, STONE);
  cube(cx - 1, 8, 9, cx + 1, 8, 10, COBBLE);
  for (let y = 0; y <= 8; y++) {
    if ((y + cx) % 3 === 0) moss(cx + 1, y, 10);
    if ((y * 3 + cx) % 4 === 0) block(cx - 1, y, 9, COBBLE);
  }
  moss(cx, 9, 9); moss(cx + 1, 9, 10);
})(11);

// a low broken plinth between the monoliths (distant ruin)
cube(-2, 0, 11, 2, 1, 12, COBBLE);
moss(0, 2, 11); moss(-2, 1, 12); moss(2, 1, 11);