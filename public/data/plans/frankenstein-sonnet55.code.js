// frankenstein-sonnet55 — prompt:
// Frankenstein's monster coming to life in the lab...

// Frankenstein's monster coming to life in the lab
const M = new Map();
function P(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
function C(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) P(x, y, z, id);
}
function L(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) P(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, z1 + (z2 - z1) * i / n, id);
}
function arc(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    if (i % 2) continue;
    P(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n + ((i >> 1) & 1), z1 + (z2 - z1) * i / n, id);
  }
}
function Cyl(cx, cy, cz, r, h, id) {
  for (let y = 0; y < h; y++)
    for (let dx = -r; dx <= r; dx++)
      for (let dz = -r; dz <= r; dz++)
        if (dx * dx + dz * dz <= r * r + 0.5) P(cx + dx, cy + y, cz + dz, id);
}
function Sph(cx, cy, cz, r, id) {
  for (let dx = -r; dx <= r; dx++)
    for (let dy = -r; dy <= r; dy++)
      for (let dz = -r; dz <= r; dz++)
        if (dx * dx + dy * dy + dz * dz <= r * r + 0.5) P(cx + dx, cy + dy, cz + dz, id);
}
function Ell(cx, cy, cz, rx, ry, rz, id) {
  for (let dx = -Math.ceil(rx); dx <= Math.ceil(rx); dx++)
    for (let dy = -Math.ceil(ry); dy <= Math.ceil(ry); dy++)
      for (let dz = -Math.ceil(rz); dz <= Math.ceil(rz); dz++)
        if ((dx / rx) ** 2 + (dy / ry) ** 2 + (dz / rz) ** 2 <= 1) P(cx + dx, cy + dy, cz + dz, id);
}
function Ring(cx, cy, cz, r, id) {
  for (let dx = -r - 1; dx <= r + 1; dx++)
    for (let dz = -r - 1; dz <= r + 1; dz++) {
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d <= r + 0.4 && d > r - 0.9) P(cx + dx, cy, cz + dz, id);
    }
}
const H = (a, b, c) => Math.abs((a * 73856093) ^ (b * 19349663) ^ (c * 83492791)) % 97;

// ---- clear the site (AIR is free) ----
cube(-14, 0, -10, 14, 17, 9, AIR);
cube(-3, 0, -15, 3, 6, -10, AIR);

// ---- floor: checkered flagstones ----
for (let x = -13; x <= 13; x++)
  for (let z = -9; z <= 8; z++) P(x, -1, z, ((x + z) & 1) ? COBBLE : STONE);

// ---- obsidian dais with copper inlay ----
C(-7, 0, -7, 7, 0, 5, OBSIDIAN);
L(-7, 0, -7, 7, 0, -7, COPPER); L(-7, 0, 5, 7, 0, 5, COPPER);
L(-7, 0, -7, -7, 0, 5, COPPER); L(7, 0, -7, 7, 0, 5, COPPER);

// ---- operating table ----
C(-4, 3, -8, 4, 3, 4, IRON);
for (const tx of [-4, 3]) for (const tz of [-8, 3]) C(tx, 1, tz, tx + 1, 2, tz + 1, IRON);
C(-4, 1, -3, 4, 1, -3, IRON); // crossbar

// ================= THE MONSTER =================
// legs (stretched forward toward the camera), pelvis
C(-3, 4, -5, -1, 6, 1, GRAY); C(1, 4, -5, 3, 6, 1, GRAY); C(0, 4, -1, 0, 6, 1, GRAY);
C(-3, 4, 0, 3, 6, 3, GRAY);
// boots
C(-3, 4, -8, -1, 6, -6, BLACK); C(1, 4, -8, 3, 6, -6, BLACK);
C(-3, 7, -8, -1, 7, -8, BLACK); C(1, 7, -8, 3, 7, -8, BLACK);
// leather straps over the legs
C(-4, 7, -3, 4, 7, -3, BROWN); C(-4, 4, -3, -4, 6, -3, BROWN); C(4, 4, -3, 4, 6, -3, BROWN);
// torso: black jacket, grey shirt, skin at the neck, belt
C(-4, 7, 1, 4, 13, 3, BLACK);
C(-1, 8, 1, 1, 11, 1, LIGHT_GRAY);
C(-1, 12, 1, 1, 13, 1, LIME);
C(-4, 7, 1, 4, 7, 1, BROWN); P(0, 7, 1, GOLD);
P(-2, 10, 1, IRON); P(2, 10, 1, IRON); P(-2, 8, 1, IRON); P(2, 8, 1, IRON);
L(-4, 12, 1, -2, 9, 1, GRAY); // stitched seam
// shoulders
C(-6, 11, 1, -5, 13, 3, BLACK); C(5, 11, 1, 5, 12, 3, BLACK);
// left arm: bent, fist raised toward the ring
C(-9, 10, 1, -5, 12, 3, BLACK);
C(-9, 13, 1, -7, 16, 3, BLACK);
C(-9, 17, 1, -7, 17, 3, WHITE);
C(-9, 18, 1, -7, 20, 3, LIME);
P(-6, 20, 2, LIME); P(-6, 19, 2, LIME);
// right arm: reaching toward the viewer
C(5, 9, -5, 7, 11, 3, BLACK);
C(5, 9, -5, 7, 11, -5, WHITE);
C(5, 9, -8, 7, 11, -6, LIME);
C(5, 9, -9, 7, 10, -9, LIME); P(5, 11, -9, LIME); P(7, 11, -9, LIME);
P(4, 12, -8, LIME); // thumb
// neck + head
C(-1, 14, 1, 1, 14, 3, LIME);
C(-3, 15, 0, 3, 21, 4, LIME);
C(-3, 20, -1, 3, 20, -1, GREEN);       // heavy brow
C(-3, 17, 0, -3, 19, 0, GREEN); C(3, 17, 0, 3, 19, 0, GREEN); // cheek shadows
P(0, 18, -1, GREEN); P(0, 17, -1, GREEN); // nose
// eyes: just flickering open
P(-2, 19, 0, GLOWSTONE); P(-1, 19, 0, BLACK); P(1, 19, 0, BLACK); P(2, 19, 0, GLOWSTONE);
// crooked stitched mouth
C(-2, 16, 0, 2, 16, 0, BLACK);
P(-2, 15, 0, GRAY); P(0, 15, 0, GRAY); P(2, 15, 0, GRAY);
P(-1, 17, 0, GRAY); P(1, 17, 0, GRAY);
// forehead scar
C(-2, 21, 0, 2, 21, 0, BLACK);
for (const sx of [-2, 0, 2]) P(sx, 21, -1, GRAY);
// flat-top hair
C(-3, 22, 0, 3, 23, 4, BLACK);
C(-3, 21, 0, -3, 21, 4, BLACK); C(3, 21, 0, 3, 21, 4, BLACK);
P(-2, 21, 0, BLACK);
// neck bolts
L(-4, 17, 2, -6, 17, 2, IRON); L(4, 17, 2, 6, 17, 2, IRON);
for (const s of [-1, 1]) {
  P(s * 6, 16, 2, IRON); P(s * 6, 18, 2, IRON); P(s * 6, 17, 1, IRON); P(s * 6, 17, 3, IRON);
  P(s * 6, 17, 2, GOLD);
}

// ================= ELECTRICAL APPARATUS =================
function coil(cx, cz) {
  Cyl(cx, 0, cz, 2, 3, COPPER);
  Cyl(cx, 3, cz, 1, 9, IRON);
  for (const y of [4, 6, 8, 10]) Cyl(cx, y, cz, 2, 1, COPPER);
  Sph(cx, 14, cz, 2, IRON);
  P(cx, 17, cz, IRON);
  P(cx, 18, cz, ELECTRIC);
}
coil(-10, -3); coil(10, -3);
// cables coil -> table
L(-8, 7, -3, -5, 5, -3, BLACK); L(-5, 5, -3, -4, 4, -3, BLACK);
L(8, 7, -3, 5, 5, -3, BLACK); L(5, 5, -3, 4, 4, -3, BLACK);

// halo ring + lightning tower
Ring(0, 26, 2, 5, COPPER);
P(0, 25, 2, ELECTRIC); P(-3, 25, 2, ELECTRIC); P(3, 25, 2, ELECTRIC);
L(-4, 26, 2, -4, 24, 2, GOLD); L(4, 26, 2, 4, 24, 2, GOLD);
L(0, 26, 3, 0, 26, 7, COPPER);
C(-4, 13, 7, 4, 17, 8, COBBLE);
C(-2, 18, 7, 2, 26, 8, COBBLE);
for (let y = 14; y <= 26; y += 4) C(-4, y, 7, 4, y, 7, STONE);
L(0, 27, 8, 0, 29, 8, IRON); P(0, 30, 8, GOLD); P(0, 31, 8, ELECTRIC);
// arcs
arc(-6, 19, 2, -8, 15, -2, NEON_BLUE); arc(6, 19, 2, 8, 15, -2, NEON_BLUE);
arc(-8, 21, 2, -4, 26, 2, NEON_BLUE);
P(-8, 22, 2, ELECTRIC);
arc(0, 25, 3, 0, 22, 4, NEON_BLUE);

// ================= DOCTOR (arms up, "It's alive!") =================
C(-10, 0, -8, -10, 3, -7, BLACK); C(-8, 0, -8, -8, 3, -7, BLACK);
C(-11, 4, -8, -7, 7, -6, WHITE);
P(-9, 5, -8, BLACK); P(-9, 7, -8, BLACK); P(-9, 6, -8, RED);
C(-10, 8, -8, -8, 10, -6, PINK);
P(-10, 9, -8, BLACK); P(-8, 9, -8, BLACK); P(-9, 8, -8, BLACK);
C(-10, 11, -8, -8, 11, -6, LIGHT_GRAY);
for (const [hx, hy] of [[-11, 11], [-7, 11], [-10, 12], [-8, 12], [-9, 13], [-11, 12], [-7, 12]]) P(hx, hy, -7, LIGHT_GRAY);
for (const ax of [-12, -6]) {
  C(ax, 6, -7, ax, 11, -6, WHITE);
  C(ax, 12, -7, ax, 13, -6, PINK);
}

// ================= IGOR + GENERATOR =================
C(8, 0, 0, 8, 1, 1, GRAY); C(10, 0, 0, 10, 1, 1, GRAY);
C(8, 2, 0, 10, 5, 2, BROWN); C(8, 5, 2, 10, 6, 3, BROWN);
C(8, 6, -1, 10, 8, 1, PINK);
P(8, 7, -1, BLACK); P(10, 7, -1, BLACK); P(10, 8, -1, BLACK); P(9, 6, -1, BLACK); P(9, 7, -2, PINK);
C(8, 9, 0, 10, 9, 1, BLACK); P(9, 10, 0, BLACK);
C(7, 2, 0, 7, 5, 1, BROWN); C(11, 2, 0, 11, 6, 1, BROWN); P(11, 7, 1, PINK);
C(8, 0, 4, 12, 5, 6, COPPER);
C(8, 6, 5, 12, 6, 6, IRON);
Cyl(9, 7, 5, 1, 3, IRON);
P(9, 4, 3, GLOWSTONE); P(9, 3, 3, BLACK); C(8, 2, 3, 10, 2, 3, BLACK);
L(11, 4, 3, 11, 8, 2, IRON); P(11, 9, 2, RED);
L(10, 0, 3, 10, 0, 0, BLACK); L(9, 0, 3, 7, 1, 0, BLACK);

// ================= WALLS =================
function wallId(x, y, z) { const h = H(x, y, z); return h % 6 === 0 ? STONE : (h % 13 === 0 ? BRICK : COBBLE); }
for (let x = -13; x <= 13; x++) for (let y = 0; y <= 12; y++) P(x, y, 8, wallId(x, y, 8));
for (const s of [-1, 1]) for (let z = -8; z <= 7; z++) for (let y = 0; y <= 11; y++) P(s * 13, y, z, wallId(s * 13, y, z));
for (let x = -12; x <= 12; x += 2) P(x, 13, 8, STONE);
for (const s of [-1, 1]) L(s * 13, 12, -8, s * 13, 12, 7, OAK_LOG);
// back windows
for (const s of [-1, 1]) {
  const wx = s * 7;
  C(wx - 1, 4, 8, wx + 1, 9, 8, GLASS); C(wx - 1, 10, 8, wx + 1, 10, 8, GLASS); P(wx, 11, 8, GLASS);
  L(wx - 2, 3, 8, wx - 2, 10, 8, IRON); L(wx + 2, 3, 8, wx + 2, 10, 8, IRON);
  C(wx - 2, 3, 8, wx + 2, 3, 8, IRON); L(wx, 4, 8, wx, 10, 8, IRON);
  // side windows
  C(s * 13, 4, -5, s * 13, 8, -3, GLASS); L(s * 13, 4, -4, s * 13, 8, -4, IRON);
  C(s * 13, 4, 3, s * 13, 8, 5, GLASS); L(s * 13, 4, 4, s * 13, 8, 4, IRON);
}

// ================= SHELVES, BENCH, TORCHES =================
const BOOKS = [RED, BLUE, GREEN, YELLOW, PURPLE, ORANGE, BROWN, CYAN];
function shelf(x1, x2) {
  C(x1, 1, 7, x2, 10, 7, PLANKS);
  for (const ry of [2, 5, 8]) for (let x = x1; x <= x2; x++) for (let y = ry; y <= ry + 1; y++)
    if (H(x, y, 3) % 5 !== 0) P(x, y, 7, BOOKS[H(x, y, 9) % 8]);
}
shelf(-12, -9); shelf(9, 12);
P(10, 10, 6, WHITE); P(-10, 10, 6, WHITE); // skulls on top
// alchemy bench
C(-12, 0, 2, -11, 1, 6, PLANKS); C(-12, 2, 2, -11, 2, 6, OAK_LOG);
Sph(-11, 4, 3, 1, GLASS); P(-11, 4, 3, LIME); P(-11, 6, 3, GLASS); P(-11, 7, 3, GLASS);
Sph(-11, 4, 5, 1, GLASS); P(-11, 4, 5, NEON_BLUE); P(-11, 6, 5, GLASS);
// wall torches
for (const s of [-1, 1]) for (const z of [-8, 0, 5]) {
  P(s * 12, 8, z, IRON); P(s * 12, 9, z, FIRE);
}

// ================= FRONT PILLARS + RAFTERS =================
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -13 : 12;
  for (let y = 0; y <= 15; y++) C(x1, y, -9, x1 + 1, y, -8, y % 4 === 3 ? STONE : COBBLE);
  C(x1, 16, -9, x1 + 1, 16, -8, IRON);
  P(s * 12, 17, -8, FIRE);
}
for (const s of [-1, 1]) for (const z of [-6, 2, 7]) {
  L(s * 13, 12, z, s * 8, 12, z, OAK_LOG);
  L(s * 8, 12, z, s * 12, 8, z, OAK_LOG);
}

// ================= PROPS / FOREGROUND =================
Cyl(-5, 0, -8, 1, 2, OAK_LOG); Cyl(5, 0, -8, 1, 2, OAK_LOG);
P(-5, 1, -9, IRON); P(5, 1, -9, IRON);
C(-1, -1, -14, 1, -1, -10, COBBLE);
for (const [tx, tz] of [[-9, -13], [7, -12], [-16, -6]]) {
  C(tx, 0, tz, tx + 1, 2, tz, STONE); P(tx, 3, tz, STONE);
}
// storm clouds
Ell(-9, 32, 6, 5, 1.4, 3, GRAY);
Ell(9, 32, 5, 4, 1.3, 2.5, GRAY);

// ---- flush (dedupe, cap at budget) ----
let n = 0;
for (const v of M.values()) {
  if (n >= 3990) break;
  block(v[0], v[1], v[2], v[3]);
  n++;
}