// headless-horseman-sonnet55 — prompt:
// the Headless Horseman holding a flaming pumpkin...

const R = Math.round;
function blob(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.0) block(x, y, z, id);
      }
}
function tube(pts, r, id) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const n = Math.max(1, Math.ceil(d / (r * 0.8)));
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      blob(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, r, r, id);
    }
  }
}
const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ================= SCENERY =================
// dirt road
cube(-3, -1, -18, 3, -1, 18, DIRT);
for (let z = -16; z <= 16; z += 4) { block(-3, -1, z, COBBLE); block(3, -1, z + 2, COBBLE); }
// fallen leaves
for (let i = 0; i < 55; i++) {
  const x = R(-18 + 36 * rnd(i)), z = R(-16 + 32 * rnd(i + 100));
  block(x, 0, z, i % 3 === 0 ? RED : ORANGE);
}
// jack-o-lanterns
function jack(x, z) {
  cube(x, 0, z, x + 2, 2, z + 2, ORANGE);
  block(x + 1, 3, z + 1, GREEN);
  block(x, 2, z, GLOWSTONE); block(x + 2, 2, z, GLOWSTONE);
  block(x, 0, z, GLOWSTONE); block(x + 1, 0, z, GLOWSTONE); block(x + 2, 0, z, GLOWSTONE);
}
jack(-11, -11); jack(8, -13); jack(-15, -3);
// gravestones
function grave(x, z, h, cross) {
  if (cross) {
    cube(x + 1, 0, z, x + 1, h, z, LIGHT_GRAY);
    cube(x, h - 1, z, x + 2, h - 1, z, LIGHT_GRAY);
  } else {
    cube(x, 0, z, x + 2, h, z + 1, GRAY);
    cube(x + 1, h + 1, z, x + 1, h + 1, z + 1, GRAY);
    block(x + 1, h - 1, z - 1, DIRT);
  }
  cube(x, 0, z + 2, x + 2, 0, z + 4, DIRT);
}
grave(-14, -8, 3, false); grave(-19, -3, 4, true); grave(14, -9, 3, false); grave(18, -4, 4, true); grave(-18, 2, 2, false);
// moon
hollowSphere(-11, 27, 17, 4, MARBLE);
block(-12, 28, 13, LIGHT_GRAY); block(-10, 26, 13, LIGHT_GRAY); block(-9, 29, 14, LIGHT_GRAY); block(-13, 25, 14, LIGHT_GRAY);
// dead tree
cube(-19, 0, 8, -17, 3, 10, OAK_LOG);
cube(-18, 4, 8, -17, 13, 9, OAK_LOG);
line(-17, 12, 9, -14, 18, 11, OAK_LOG); line(-14, 18, 11, -12, 22, 13, OAK_LOG);
line(-18, 13, 9, -21, 19, 6, OAK_LOG); line(-21, 19, 6, -22, 24, 4, OAK_LOG);
line(-15, 15, 10, -16, 22, 9, OAK_LOG); line(-16, 22, 9, -14, 26, 10, OAK_LOG);
line(-14, 18, 11, -16, 20, 14, OAK_LOG);

// ================= HORSE =================
// legs
for (const x of [-2, 1]) { // x..x+1
  // rear legs
  cube(x, 2, 7, x + 1, 8, 8, BLACK);
  cube(x, 0, 7, x + 1, 1, 8, GRAY);
}
cube(-2, 2, -2, -1, 8, -1, BLACK); cube(-2, 0, -2, -1, 1, -1, GRAY);
// raised front right leg
cube(1, 6, -2, 2, 8, -1, BLACK);
cube(1, 5, -5, 2, 6, -2, BLACK);
cube(1, 3, -5, 2, 4, -4, BLACK);
cube(1, 2, -6, 2, 2, -4, GRAY);
// body
cube(-2, 9, -2, 2, 13, 8, BLACK);
cube(-1, 8, -1, 1, 8, 7, BLACK);
blob(0, 11, -2, 3, 3, 2.5, BLACK);
blob(0, 11, 7, 3, 3, 3, BLACK);
blob(-2, 9, 7, 1.8, 2.6, 2.4, BLACK); blob(2, 9, 7, 1.8, 2.6, 2.4, BLACK);
// highlights on haunch
block(-3, 11, 7, OBSIDIAN); block(3, 11, 7, OBSIDIAN); block(0, 14, 7, OBSIDIAN); block(0, 13, 3, OBSIDIAN);
// neck + head
tube([[0, 12, -2.5], [0, 15, -3.8], [0, 18, -5.3]], 2.1, BLACK);
tube([[0, 19, -7], [0, 18, -8.5], [0, 17, -10]], 1.8, BLACK);
blob(0, 16, -12, 1.5, 1.3, 1.5, GRAY);
blob(0, 15, -11, 1.2, 1, 1.5, BLACK);
block(-1, 16, -14, FIRE); block(1, 16, -14, FIRE);
block(-1, 16, -13, RED); block(1, 16, -13, RED);
block(-1, 19, -9, NEON_RED); block(1, 19, -9, NEON_RED);
cube(-1, 21, -6, -1, 23, -6, BLACK); cube(1, 21, -6, 1, 23, -6, BLACK);
block(0, 22, -8, GRAY); block(0, 21, -9, GRAY);
// mane
for (let i = 0; i <= 10; i++) {
  const t = i / 10, cy = 12 + 6 * t, cz = -2.5 - 2.8 * t;
  block(0, R(cy + 2.3), R(cz + 1.3), GRAY);
  block(0, R(cy + 3), R(cz + 1.8), GRAY);
}
// tail
line(0, 12, 9, 0, 11, 12, GRAY); line(0, 11, 12, 0, 7, 13, GRAY); line(0, 7, 13, 0, 3, 12, GRAY);
line(1, 10, 12, 1, 6, 13, GRAY); line(-1, 10, 12, -1, 5, 13, GRAY);
// blanket + saddle
cube(-3, 10, 0, -3, 13, 4, RED); cube(3, 10, 0, 3, 13, 4, RED);
cube(-3, 10, 0, -3, 10, 4, GOLD); cube(3, 10, 0, 3, 10, 4, GOLD);
cube(-2, 13, -1, 2, 13, 5, RED);
cube(-2, 14, 0, 2, 14, 4, BROWN);
cube(-1, 15, 0, 1, 15, 0, BROWN);
cube(-2, 15, 4, 2, 15, 5, BROWN);
block(0, 11, -5, GOLD);
line(-3, 9, -3, 3, 9, -3, GOLD);

// ================= CAPE =================
for (let s = 0; s <= 11; s++) {
  const z = 5 + s;
  const ytop = R(23 + 0.25 * s + 1.3 * Math.sin(s * 0.9));
  const ybot = ytop - R(6 - 0.25 * s);
  const w = R(2.5 + 0.4 * s);
  cube(-w, ybot, z, w, ytop, z, PURPLE);
  cube(-w, ybot, z, w, ybot, z, RED);
  block(-w, ytop, z, GOLD); block(w, ytop, z, GOLD);
}

// ================= RIDER =================
// legs
for (const sx of [1, -1]) {
  const xa = sx > 0 ? 3 : -4, xb = sx > 0 ? 4 : -3;
  cube(xa, 13, -1, xb, 15, 3, BLACK);
  cube(xa, 9, -1, xb, 12, 0, BROWN);
  cube(xa, 9, -2, xb, 10, 0, BROWN);
  cube(xa, 8, -2, xb, 8, 0, IRON);
}
cube(-2, 15, 1, 2, 15, 3, BLACK);
// torso
cube(-3, 16, 0, 3, 23, 4, BLACK);
cube(-3, 16, -1, 3, 16, -1, BROWN); block(0, 16, -1, GOLD);
line(-3, 22, -1, 3, 17, -1, BROWN);
for (const y of [17, 19, 21]) { block(-1, y, -1, GOLD); block(1, y, -1, GOLD); }
line(-2, 23, -1, 2, 23, -1, GOLD);
block(-2, 21, -1, GOLD);
cube(-3, 18, 0, -3, 18, 0, RED);
// shoulders + epaulettes
blob(4, 22, 2, 2, 2, 2, BLACK); blob(-4, 22, 2, 2, 2, 2, BLACK);
cube(4, 24, 1, 5, 24, 3, GOLD); cube(-5, 24, 1, -4, 24, 3, GOLD);
// headless neck stump
hollowCylinder(0, 24, 2, 2, 3, BLACK);
hollowCylinder(0, 26, 2, 2, 1, GOLD);
cylinder(0, 24, 2, 1, 1, RED);
block(0, 25, 2, NEON_RED);
// left arm with reins
tube([[-4, 22, 2], [-6, 20.5, 1], [-6, 18.5, -1], [-4.5, 18, -3]], 1.5, BLACK);
blob(-3.5, 18, -4, 1.5, 1.3, 1.5, BROWN);
line(-3, 18, -5, -2, 17, -10, BROWN);
line(-4, 17, -5, -3, 15, -8, BROWN);
// sword
block(-5, 18, 2, GOLD); block(-5, 17, 2, GOLD); block(-6, 17, 2, GOLD); block(-4, 17, 2, GOLD);
line(-5, 16, 2, -7, 10, 9, IRON);
// right arm raised
tube([[4, 22, 2], [6, 22.5, 2], [8, 22.7, 1.2], [9.5, 23.5, 0], [10.5, 24.5, -0.7]], 1.5, BLACK);
blob(9.5, 23.5, 0, 1.8, 1.8, 1.8, GOLD);

// ================= FLAMING PUMPKIN =================
const PX = 11, PY = 28, PZ = -1;
for (let dx = -4; dx <= 4; dx++)
  for (let dy = -3; dy <= 3; dy++)
    for (let dz = -4; dz <= 4; dz++) {
      const v = (dx / 3.3) ** 2 + (dy / 2.8) ** 2 + (dz / 3.3) ** 2;
      if (v <= 1) block(PX + dx, PY + dy, PZ + dz, ORANGE);
    }
// carved face on the north side
const face = [[-2, 1], [-1, 1], [-2, 2], [2, 1], [1, 1], [2, 2], [0, 0],
  [-2, -1], [-1, -2], [-1, -1], [0, -1], [1, -1], [1, -2], [2, -1]];
for (const [dx, dy] of face) {
  const q = 1 - (dx / 3.3) ** 2 - (dy / 2.8) ** 2;
  if (q <= 0) continue;
  const zs = PZ - R(3.3 * Math.sqrt(q));
  block(PX + dx, PY + dy, zs, GLOWSTONE);
}
// stem
cube(PX, 31, PZ, PX, 32, PZ, BROWN); block(PX + 1, 32, PZ, GREEN);
// gloved hand cradling the pumpkin
blob(PX, 25, PZ, 1.6, 1.2, 1.6, BROWN);
for (const [x, z] of [[9, -2], [9, 0], [13, -2], [13, 0], [11, -3], [11, 1]]) block(x, 26, z, BROWN);
// flames
const flames = [[7, 29, -1], [15, 29, -1], [11, 29, -5], [11, 29, 3], [8, 31, -4], [14, 31, -4],
  [8, 31, 2], [14, 31, 2], [10, 32, -1], [12, 32, -1], [11, 33, -2], [11, 33, 0],
  [9, 25, -4], [13, 25, -4], [7, 27, -3], [15, 27, 1]];
for (const [x, y, z] of flames) block(x, y, z, FIRE);