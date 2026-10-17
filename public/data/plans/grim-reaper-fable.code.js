// grim-reaper-fable — prompt:
// the Grim Reaper with his scythe...

// ===== THE GRIM REAPER =====
// Faces NORTH (-Z). Body center at x=0, z=2.
const CX = 0, CZ = 2;

// --- clear the trees in front and around the figure ---
cube(-9, 0, -14, 9, 9, 9, AIR);
cube(-16, 1, -4, -10, 8, 6, AIR);
cube(9, 1, -9, 16, 8, 6, AIR);

// --- cursed ground: dark soil, cobble, puddles ---
for (let x = -14; x <= 14; x++) for (let z = -12; z <= 12; z++) {
  const d = Math.hypot(x, z - 2);
  if (d < 13) {
    const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
    const r = n - Math.floor(n);
    let id = DIRT;
    if (r < 0.18) id = COBBLE;
    else if (r < 0.3) id = GRAY;
    else if (r < 0.36) id = STONE;
    else if (r < 0.40 && d > 7) id = WATER;
    block(x, -1, z, id);
    block(x, 0, z, AIR);
    if (d > 11 && r > 0.7) block(x, -1, z, GRASS);
  }
}

// --- robe: tapering hollow shell with ragged hem ---
function robeRadius(y) {
  // wide flowing hem -> waist -> shoulders
  if (y <= 2) return 7 - y * 0.5;
  if (y <= 9) return 6 - (y - 2) * 0.35;
  if (y <= 14) return 3.6 - (y - 9) * 0.1;
  return 3.4;
}
for (let y = 0; y <= 16; y++) {
  const r = robeRadius(y);
  for (let a = 0; a < 360; a += 4) {
    const rad = a * Math.PI / 180;
    // slight asymmetry: wind pushes robe east/south
    const sway = (y > 4 ? 0 : (y === 0 ? 1 : 0.5)) * (Math.cos(rad - 0.7) > 0 ? 1 : 0);
    const x = Math.round(CX + Math.cos(rad) * (r + sway));
    const z = Math.round(CZ + Math.sin(rad) * (r + sway * 0.6));
    const n = Math.sin(a * 1.7 + y * 3.1) ;
    // ragged hem: skip some cells near the bottom
    if (y <= 1 && n > 0.45) continue;
    block(x, y, z, BLACK);
  }
}
// tattered strips hanging below the hem (into foundation level)
for (let a = 0; a < 360; a += 23) {
  const rad = a * Math.PI / 180;
  const x = Math.round(CX + Math.cos(rad) * 7.6);
  const z = Math.round(CZ + Math.sin(rad) * 7.6);
  block(x, 0, z, BLACK);
  if (a % 46 === 0) block(x, -1, z, BLACK);
}
// a few folds: vertical ridges on the robe
for (const a of [20, 80, 140, 200, 250, 310]) {
  const rad = a * Math.PI / 180;
  for (let y = 2; y <= 12; y++) {
    const r = robeRadius(y) + 1;
    block(Math.round(CX + Math.cos(rad) * r), y, Math.round(CZ + Math.sin(rad) * r), BLACK);
  }
}
// inner darkness so you can't see through gaps
cylinder(CX, 1, CZ, 4, 15, BLACK);

// --- shoulders / chest ---
cube(CX - 5, 15, CZ - 3, CX + 5, 17, CZ + 3, BLACK);
cube(CX - 4, 18, CZ - 2, CX + 4, 18, CZ + 2, BLACK);
// rope belt
for (let a = 0; a < 360; a += 5) {
  const rad = a * Math.PI / 180;
  block(Math.round(CX + Math.cos(rad) * 3.6), 10, Math.round(CZ + Math.sin(rad) * 3.6), BROWN);
}
line(CX - 1, 9, CZ - 4, CX - 1, 5, CZ - 4, BROWN);
line(CX, 9, CZ - 4, CX, 6, CZ - 4, BROWN);
// pale ribcage glimpse where the robe parts
cube(CX - 1, 12, CZ - 4, CX + 1, 14, CZ - 4, AIR);
cube(CX - 1, 12, CZ - 3, CX + 1, 14, CZ - 3, WHITE);
block(CX, 13, CZ - 3, BLACK);

// --- hood ---
hollowSphere(CX, 22, CZ, 5, BLACK);
sphere(CX, 22, CZ + 1, 3, BLACK);           // fill back
cube(CX - 5, 19, CZ - 5, CX + 5, 20, CZ + 5, AIR);  // trim below
cube(CX - 4, 19, CZ - 1, CX + 4, 19, CZ + 4, BLACK); // neck shroud
// hood peak pointing back
line(CX, 26, CZ + 1, CX + 1, 28, CZ + 5, BLACK);
line(CX, 27, CZ + 2, CX + 1, 27, CZ + 5, BLACK);
// open the hood toward the viewer (north)
cube(CX - 3, 19, CZ - 6, CX + 3, 24, CZ - 2, AIR);
cube(CX - 2, 25, CZ - 6, CX + 2, 25, CZ - 3, AIR);
// hood lip overhang
cube(CX - 4, 25, CZ - 4, CX + 4, 25, CZ - 3, BLACK);
cube(CX - 3, 26, CZ - 3, CX + 3, 26, CZ - 2, BLACK);
line(CX - 4, 24, CZ - 4, CX - 5, 20, CZ - 2, BLACK);
line(CX + 4, 24, CZ - 4, CX + 5, 20, CZ - 2, BLACK);
line(CX - 4, 23, CZ - 4, CX - 4, 20, CZ - 3, BLACK);
line(CX + 4, 23, CZ - 4, CX + 4, 20, CZ - 3, BLACK);
// shadowed interior
sphere(CX, 22, CZ + 1, 3, BLACK);

// --- skull inside the hood ---
cube(CX - 2, 20, CZ - 3, CX + 2, 23, CZ, WHITE);
cube(CX - 1, 19, CZ - 3, CX + 1, 19, CZ - 1, WHITE);   // jaw
block(CX - 2, 24, CZ - 2, WHITE); block(CX + 2, 24, CZ - 2, WHITE);
cube(CX - 1, 24, CZ - 3, CX + 1, 24, CZ - 1, WHITE);
// eye sockets + glow
block(CX - 1, 22, CZ - 3, AIR); block(CX + 1, 22, CZ - 3, AIR);
block(CX - 1, 22, CZ - 2, NEON_RED); block(CX + 1, 22, CZ - 2, NEON_RED);
// nasal cavity and teeth
block(CX, 21, CZ - 3, BLACK);
for (let x = -1; x <= 1; x++) block(CX + x, 19, CZ - 3, x === 0 ? BLACK : LIGHT_GRAY);
block(CX - 1, 20, CZ - 3, LIGHT_GRAY); block(CX + 1, 20, CZ - 3, LIGHT_GRAY);

// --- right arm (east) raised, gripping the scythe shaft ---
line(CX + 5, 16, CZ - 1, CX + 9, 13, CZ - 4, BLACK);
line(CX + 5, 17, CZ - 1, CX + 9, 14, CZ - 4, BLACK);
line(CX + 6, 17, CZ - 2, CX + 9, 15, CZ - 5, BLACK);
line(CX + 9, 13, CZ - 4, CX + 11, 18, CZ - 6, BLACK);
line(CX + 10, 13, CZ - 4, CX + 12, 18, CZ - 6, BLACK);
// sleeve cuff
hollowCube(CX + 10, 18, CZ - 8, CX + 13, 19, CZ - 5, BLACK);
// skeletal right hand on shaft
cube(CX + 11, 20, CZ - 7, CX + 12, 21, CZ - 6, WHITE);
block(CX + 11, 22, CZ - 7, WHITE); block(CX + 13, 21, CZ - 7, WHITE);

// --- left arm (west) lowered, beckoning forward ---
line(CX - 5, 16, CZ - 1, CX - 8, 11, CZ - 4, BLACK);
line(CX - 5, 17, CZ - 1, CX - 8, 12, CZ - 4, BLACK);
line(CX - 6, 17, CZ - 2, CX - 9, 12, CZ - 5, BLACK);
line(CX - 8, 11, CZ - 4, CX - 7, 10, CZ - 9, BLACK);
line(CX - 9, 12, CZ - 4, CX - 8, 11, CZ - 9, BLACK);
hollowCube(CX - 10, 9, CZ - 11, CX - 6, 12, CZ - 9, BLACK);
// bony beckoning hand
cube(CX - 9, 10, CZ - 12, CX - 7, 10, CZ - 11, WHITE);
block(CX - 9, 10, CZ - 13, WHITE); block(CX - 8, 10, CZ - 14, WHITE);
block(CX - 7, 10, CZ - 13, WHITE); block(CX - 8, 11, CZ - 14, WHITE);
block(CX - 6, 10, CZ - 12, WHITE); block(CX - 10, 11, CZ - 12, WHITE);

// --- the scythe ---
// shaft: tall, leaning slightly toward the camera
const SX = CX + 12, SZ = CZ - 7;
for (let y = -1; y <= 29; y++) {
  const dz = Math.round((y - 14) * -0.06);
  block(SX, y, SZ + dz, OAK_LOG);
  if (y % 7 === 3) block(SX, y, SZ + dz - 1, BROWN); // wraps
}
// iron ferrule at the top, and butt cap
cube(SX - 1, 28, SZ - 2, SX + 1, 30, SZ, IRON);
block(SX, -1, SZ + 1, IRON);
// blade: broad curved crescent sweeping west over the head
function bladeY(t) { return 30 - 12 * t * t; }
function bladeX(t) { return SX - 1 - t * 17; }
for (let i = 0; i <= 60; i++) {
  const t = i / 60;
  const x = Math.round(bladeX(t));
  const yTop = bladeY(t);
  const thick = Math.max(1, Math.round(4 * (1 - t) + 0.5));
  for (let k = 0; k < thick; k++) {
    const y = Math.round(yTop - k);
    block(x, y, SZ - 2, IRON);
    if (k === thick - 1 && t < 0.9) block(x, y - 1, SZ - 2, LIGHT_GRAY); // honed edge
  }
  if (t < 0.5) block(x, Math.round(yTop), SZ - 1, IRON); // spine thickness
}
// blade tip
block(Math.round(bladeX(1)), Math.round(bladeY(1)), SZ - 2, IRON);
block(Math.round(bladeX(1)) - 1, Math.round(bladeY(1)) - 1, SZ - 2, LIGHT_GRAY);
// blood on the tip
block(Math.round(bladeX(0.85)), Math.round(bladeY(0.85)) - 2, SZ - 2, RED);

// --- graveyard: tombstones, cross, dead tree, bones ---
function tombstone(x, z, h, rounded) {
  cube(x - 1, -1, z, x + 1, h, z, STONE);
  if (rounded) { block(x - 1, h + 1, z, COBBLE); block(x, h + 1, z, STONE); block(x + 1, h + 1, z, COBBLE); block(x, h + 2, z, STONE); }
  block(x, Math.floor(h / 2), z - 1, LIGHT_GRAY);
  if (h > 2) block(x, Math.floor(h / 2) + 1, z - 1, LIGHT_GRAY);
  cube(x - 1, -1, z - 1, x + 1, -1, z + 1, DIRT);
}
tombstone(-14, -4, 2, true);
tombstone(-11, -9, 3, true);
tombstone(-16, 4, 3, false);
tombstone(13, 0, 2, true);
tombstone(16, -6, 3, false);
tombstone(10, 8, 2, true);
tombstone(-12, 10, 3, true);
tombstone(17, 10, 2, false);
// leaning tombstone
line(14, 0, -10, 16, 3, -10, STONE); line(13, 0, -10, 15, 3, -10, STONE);
// stone cross
cube(-18, -1, -12, -18, 5, -12, COBBLE);
cube(-20, 3, -12, -16, 3, -12, COBBLE);
// open grave in front, with dirt mound
cube(-4, -4, -13, -1, -1, -9, AIR);
hollowCube(-5, -4, -14, 0, -2, -8, DIRT);
cube(-6, -1, -14, -5, 0, -8, DIRT);
block(-5, 1, -12, DIRT); block(-5, 1, -10, DIRT);
line(-7, 1, -9, -7, -1, -11, PLANKS); // shovel-ish
block(-7, 2, -9, IRON);
// bones in the grave
block(-3, -4, -12, WHITE); block(-2, -4, -12, WHITE); block(-3, -4, -10, WHITE);
// dead tree on the east side
cube(17, -1, -3, 18, 9, -2, OAK_LOG);
line(18, 9, -2, 21, 14, -4, OAK_LOG);
line(17, 10, -3, 14, 15, -6, OAK_LOG);
line(18, 8, -2, 20, 12, 1, OAK_LOG);
line(17, 11, -3, 16, 15, 0, OAK_LOG);
line(21, 14, -4, 22, 17, -3, OAK_LOG);
line(14, 15, -6, 12, 18, -7, OAK_LOG);
line(20, 12, 1, 22, 14, 3, OAK_LOG);
// raven on branch
block(21, 15, -4, BLACK); block(21, 16, -4, BLACK); block(21, 16, -5, BLACK); block(21, 16, -6, ORANGE);
// second raven on the blade
block(Math.round(bladeX(0.3)), Math.round(bladeY(0.3)) + 1, SZ - 2, BLACK);
block(Math.round(bladeX(0.3)), Math.round(bladeY(0.3)) + 2, SZ - 2, BLACK);
block(Math.round(bladeX(0.3)) - 1, Math.round(bladeY(0.3)) + 2, SZ - 2, BLACK);
// skull pile on the west
sphere(-13, 0, 0, 1, WHITE);
block(-11, 0, 1, WHITE); block(-14, 0, 2, WHITE); block(-12, 1, 0, WHITE);
block(-13, 0, -1, BLACK); block(-11, 0, 0, BLACK);
// fallen iron fence
for (let x = -9; x <= 9; x += 2) { block(x, 0, 11, IRON); block(x, 1, 11, IRON); }
cube(-9, 2, 11, 9, 2, 11, IRON);
line(10, 0, 11, 13, 0, 12, IRON);

// --- lanterns and souls ---
function lantern(x, z, h) {
  cube(x, -1, z, x, h, z, OAK_LOG);
  block(x, h + 1, z, IRON);
  block(x, h, z - 1, IRON); block(x, h - 2, z - 1, IRON);
  block(x, h - 1, z - 1, FIRE);
}
lantern(-15, -8, 5);
lantern(15, 5, 5);
// drifting souls near the beckoning hand
block(-10, 13, -15, GLOWSTONE); block(-12, 15, -13, GLOWSTONE);
block(-13, 11, -16, GLOWSTONE);
// green witch-fire creeping from under the hem
for (const [x, z] of [[-6, -5], [5, -6], [7, 4], [-7, 5], [0, -7]]) {
  block(CX + x, 0, CZ + z, LIME);
  block(CX + x, 1, CZ + z, FIRE);
}
// low mist ring (translucent ice-pale on dark ground)
for (let a = 0; a < 360; a += 9) {
  const rad = a * Math.PI / 180;
  const r = 9.5 + Math.sin(a * 0.3) * 1.5;
  const x = Math.round(CX + Math.cos(rad) * r), z = Math.round(CZ + Math.sin(rad) * r);
  block(x, 0, z, LIGHT_GRAY);
  if (a % 27 === 0) block(x, 1, z, LIGHT_GRAY);
}