// sydney-opera-4x-fable — prompt:
// the Sydney Opera House...

// Sydney Opera House — white sail shells on a granite podium, Sydney Harbour in front (north), botanic gardens kept behind
const SHELL_Y = 3;

// ---- site clearing (AIR is free) ----
cube(-22, 0, -22, 22, 12, -13, AIR);   // harbour basin + trees over it
cube(-20, 0, -12, 20, 12, -9, AIR);    // quay strip
cube(-19, 0, -9, 19, 20, 13, AIR);     // podium + sail volume

// ---- harbour water ----
cube(-21, 0, -22, 21, 0, -13, GLASS);

// ---- quay + monumental forecourt steps ----
cube(-18, 0, -12, 18, 0, -10, COBBLE);
cube(-14, 1, -10, 8, 1, -10, PLANKS);          // broad step up to the podium
for (let x = -16; x <= 16; x += 4) block(x, 1, -12, OAK_LOG); // bollards on the quay edge

// ---- podium (granite base) ----
cube(-17, 0, -9, 17, 1, -9, COBBLE);   // north face
cube(-17, 0, 12, 17, 1, 12, COBBLE);   // south face
cube(-17, 0, -8, -17, 1, 11, COBBLE);  // west face
cube(17, 0, -8, 17, 1, 11, COBBLE);    // east face
cube(-17, 2, -9, 17, 2, -9, COBBLE);   // top border ring
cube(-17, 2, 12, 17, 2, 12, COBBLE);
cube(-17, 2, -8, -17, 2, 11, COBBLE);
cube(17, 2, -8, 17, 2, 11, COBBLE);
cube(-16, 2, -8, 16, 2, 11, PLANKS);   // paved deck
cube(18, 0, -2, 19, 0, 6, COBBLE);     // east landing steps

// ---- sail shells ----
// Each sail = squashed spherical shell, upper half, cut by a leaning plane so the
// ridge tips forward. dir=+1 mouth faces east, dir=-1 mirrored (back sail).
function sail(cx, cz, r, hz, dir, mat) {
  const slope = 0.35, zs = r / hz;
  for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++)
    for (let z = Math.floor(cz - hz - 1); z <= Math.ceil(cz + hz + 1); z++)
      for (let y = SHELL_Y; y <= Math.ceil(SHELL_Y + r + 1); y++) {
        const dx = (x - cx) * dir, dy = y - SHELL_Y, dz = (z - cz) * zs;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > r + 0.1 || d < r - 1.25) continue;
        if (dx > slope * dy + 0.2) continue;
        block(x, y, z, mat);
      }
}
// Glass curtain wall filling a sail's open mouth
function mouthGlass(cx, cz, r, hz, dir) {
  const slope = 0.35, zs = r / hz;
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let z = Math.floor(cz - hz); z <= Math.ceil(cz + hz); z++)
      for (let y = SHELL_Y; y <= Math.ceil(SHELL_Y + r); y++) {
        const dx = (x - cx) * dir, dy = y - SHELL_Y, dz = (z - cz) * zs;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > r - 1.1) continue;
        if (Math.abs(dx - slope * dy) > 0.6) continue;
        block(x, y, z, GLASS);
      }
}

// Concert Hall group (larger, northern row) — three ascending sails + opposing back sail
sail(-9, -2.5, 8, 5, 1, SNOW);
sail(-4, -2.5, 10.5, 5, 1, SNOW);
sail(2, -2.5, 13, 5, 1, SNOW);
sail(10, -2.5, 6.5, 4.5, -1, SNOW);
mouthGlass(2, -2.5, 13, 5, 1);
mouthGlass(10, -2.5, 6.5, 4.5, -1);

// Opera Theatre group (smaller, southern row, staggered west)
sail(-11, 7, 6, 4.5, 1, SNOW);
sail(-7, 7, 8, 4.5, 1, SNOW);
sail(-2, 7, 10, 4.5, 1, SNOW);
sail(6, 7, 5, 4, -1, SNOW);
mouthGlass(-2, 7, 10, 4.5, 1);
mouthGlass(6, 7, 5, 4, -1);

// Bennelong restaurant — small lone shell, SE corner of podium
sail(13, 8, 4, 3, 1, SNOW);

// ---- Harbour Bridge silhouette, background west over the water ----
cube(-22, 0, -21, -21, 5, -19, COBBLE);
cube(-6, 0, -21, -5, 5, -19, COBBLE);
cube(-21, 3, -20, -6, 3, -19, STONE);
for (let x = -21; x <= -6; x++) {
  const t = (x + 13.5) / 7.5;
  const ya = Math.round(10 - 6 * t * t);
  block(x, ya, -20, STONE);
  block(x, ya, -19, STONE);
  if (ya > 5 && x % 3 === 0) line(x, 4, -20, x, ya - 1, -20, STONE);
}

// ---- sailboats on the harbour ----
cube(-2, 1, -19, 2, 1, -17, PLANKS);
block(3, 1, -18, PLANKS);
block(-3, 1, -18, PLANKS);
line(0, 2, -18, 0, 8, -18, OAK_LOG);
for (let y = 3; y <= 7; y++) line(1, y, -18, 1 + (7 - y), y, -18, SNOW);

cube(12, 1, -20, 14, 1, -18, PLANKS);
line(13, 2, -19, 13, 6, -19, OAK_LOG);
for (let y = 3; y <= 5; y++) line(14, y, -19, 14 + (5 - y), y, -19, SNOW);

// ---- gulls over the water ----
block(-8, 9, -16, SNOW);
block(-5, 10, -15, SNOW);
block(7, 8, -16, SNOW);