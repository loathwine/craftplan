// lava-golem-fable — prompt:
// a lava golem...

// ===== LAVA GOLEM — a hulking magma brute rising from a cracked volcanic crater =====
// Faces NORTH (-Z). Camera looks south. Body depth runs toward +Z.

// ---------- helpers ----------
function rnd(x, y, z) { // deterministic hash → [0,1)
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = (h ^ (h >>> 13)) * 1103515245 | 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
// Cracked rock: mostly OBSIDIAN/BLACK with LAVA veins showing through
function crackFill(x1, y1, z1, x2, y2, z2, lavaChance) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) {
    const r = rnd(x, y, z);
    let id = OBSIDIAN;
    if (r < lavaChance) id = LAVA;
    else if (r < lavaChance + 0.15) id = BLACK;
    else if (r < lavaChance + 0.30) id = STONE;
    block(x, y, z, id);
  }
}
// Cracked shell of a sphere (surface only, magma peeking through)
function crackSphere(cx, cy, cz, r, lavaChance) {
  for (let x = cx - r; x <= cx + r; x++) for (let y = cy - r; y <= cy + r; y++) for (let z = cz - r; z <= cz + r; z++) {
    const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2);
    if (d > r + 0.4) continue;
    const rr = rnd(x, y, z);
    let id;
    if (d < r - 1.2) id = LAVA;                       // molten core
    else if (rr < lavaChance) id = LAVA;
    else if (rr < lavaChance + 0.18) id = BLACK;
    else if (rr < lavaChance + 0.32) id = STONE;
    else id = OBSIDIAN;
    block(x, y, z, id);
  }
}

// ---------- crater / ground ----------
// Dig a shallow crater, ring of scorched rock, lava pool in the bottom
for (let x = -14; x <= 14; x++) for (let z = -12; z <= 14; z++) {
  const d = Math.sqrt((x / 14) ** 2 + ((z - 1) / 13) ** 2);
  if (d > 1.0) continue;
  // clear anything above ground (trees) inside crater
  for (let y = 0; y <= 8; y++) block(x, y, z, AIR);
  if (d < 0.55) {
    block(x, -1, z, AIR); block(x, -2, z, AIR);
    block(x, -3, z, rnd(x, 0, z) < 0.7 ? LAVA : OBSIDIAN);
  } else if (d < 0.75) {
    block(x, -1, z, AIR);
    block(x, -2, z, rnd(x, 1, z) < 0.35 ? LAVA : BLACK);
  } else {
    block(x, -1, z, rnd(x, 2, z) < 0.6 ? BLACK : COBBLE);
  }
}
// Broken rim boulders around the crater
const rimRocks = [[-13, -8], [-9, -12], [-3, -13], [5, -12], [11, -10], [14, -3], [14, 6], [11, 12], [4, 14], [-4, 14], [-10, 12], [-14, 5], [-15, -2]];
for (const [rx, rz] of rimRocks) {
  const h = 1 + Math.floor(rnd(rx, 9, rz) * 2);
  crackFill(rx - 1, -1, rz - 1, rx + 1, -1 + h, rz + 1, 0.05);
  block(rx, h, rz, rnd(rx, 3, rz) < 0.5 ? STONE : OBSIDIAN);
}
// Lava rivulets running out of the crater
line(6, -1, -9, 12, -1, -15, LAVA);
line(-7, -1, 9, -14, -1, 14, LAVA);
line(9, -2, 4, 15, -2, 9, LAVA);

// ---------- feet (sunk in the lava pool, slightly staggered) ----------
// Left foot (west, +X is east; golem's left is east from its POV facing -Z)
crackFill(3, -2, -6, 8, 0, -1, 0.12);   // left foot forward
crackFill(-9, -2, -3, -4, 0, 2, 0.12);  // right foot back
// toe claws
for (const tx of [3, 5, 7]) { block(tx, 0, -7, OBSIDIAN); block(tx, 1, -7, BLACK); }
for (const tx of [-9, -7, -5]) { block(tx, 0, -4, OBSIDIAN); block(tx, 1, -4, BLACK); }

// ---------- legs (thick, angular, magma between boulder plates) ----------
// left leg (east) — shin then thigh
crackFill(3, 1, -5, 7, 5, -1, 0.10);
crackFill(2, 6, -4, 7, 10, 1, 0.14);
// right leg (west)
crackFill(-8, 1, -2, -4, 5, 2, 0.10);
crackFill(-8, 6, -2, -3, 10, 3, 0.14);
// knee plates jutting out
cube(3, 5, -6, 7, 6, -6, OBSIDIAN);
cube(-8, 5, -3, -4, 6, -3, OBSIDIAN);
// molten joint gaps (visible lava in knee seams)
cube(3, 6, -5, 6, 6, -5, LAVA);
cube(-7, 6, -2, -4, 6, -2, LAVA);

// ---------- pelvis / torso ----------
crackFill(-7, 10, -3, 6, 13, 3, 0.10);           // hips
crackFill(-8, 14, -4, 7, 20, 4, 0.12);           // chest mass
crackFill(-9, 18, -4, 8, 22, 4, 0.10);           // upper chest / shoulders wide
// magma core exposed on chest (facing north / -Z)
cube(-3, 15, -5, 2, 19, -5, LAVA);
cube(-2, 16, -5, 1, 18, -5, LAVA);
// cracks radiating from core across chest front
line(-4, 20, -5, -8, 18, -5, LAVA);
line(3, 20, -5, 7, 18, -5, LAVA);
line(-3, 14, -5, -6, 11, -4, LAVA);
line(2, 14, -5, 5, 11, -4, LAVA);
// thick armour plates over shoulders (jagged obsidian)
cube(-11, 20, -3, -8, 23, 3, OBSIDIAN);
cube(8, 20, -3, 11, 23, 3, OBSIDIAN);
cube(-12, 22, -2, -9, 24, 2, BLACK);
cube(9, 22, -2, 12, 24, 2, BLACK);
// spiky back ridge (obsidian shards along spine, toward +Z)
for (let i = 0; i < 6; i++) {
  const y = 12 + i * 2;
  const h = 2 + (i % 2);
  cube(-1, y, 5, 0, y + h, 5 + (i % 2), OBSIDIAN);
  block(-1, y + h + 1, 5, BLACK);
}

// ---------- arms (massive, hanging forward-ish, knuckles dragging) ----------
// Left arm (east): upper arm down and out, forearm angled forward to -Z
crackFill(10, 14, -2, 14, 21, 2, 0.12);          // upper arm
crackFill(11, 6, -6, 16, 14, -1, 0.12);          // forearm reaching forward/down
// fist
crackFill(11, 2, -9, 17, 7, -4, 0.14);
// lava seeping between knuckles
for (const kx of [12, 14, 16]) { block(kx, 7, -9, LAVA); block(kx, 6, -10, OBSIDIAN); block(kx, 5, -10, BLACK); }
// Right arm (west): raised, fist about to slam
crackFill(-14, 15, -2, -10, 22, 2, 0.12);        // upper arm angled out
crackFill(-17, 20, -5, -12, 26, 0, 0.12);        // forearm raised up
crackFill(-19, 25, -6, -13, 30, -1, 0.14);       // raised fist
for (const kx of [-18, -16, -14]) { block(kx, 31, -4, OBSIDIAN); block(kx, 30, -7, LAVA); }
// lava dripping from raised fist
line(-16, 24, -6, -16, 21, -6, LAVA);
block(-16, 20, -6, ORANGE);
// elbow lava seams
cube(11, 14, -3, 14, 14, -1, LAVA);
cube(-14, 22, -3, -12, 22, -1, LAVA);
// shoulder spikes
block(-10, 25, 0, OBSIDIAN); block(-11, 26, 0, BLACK);
block(10, 25, 0, OBSIDIAN); block(11, 26, 0, BLACK);

// ---------- head (sunk low between shoulders, brutish) ----------
crackFill(-4, 22, -4, 3, 27, 2, 0.10);
// brow ridge overhanging
cube(-5, 26, -5, 4, 27, -5, OBSIDIAN);
cube(-5, 27, -4, 4, 27, -3, BLACK);
// jaw jutting north
cube(-4, 22, -5, 3, 23, -5, OBSIDIAN);
cube(-3, 22, -6, 2, 22, -6, BLACK);
// mouth: glowing lava interior with obsidian teeth
cube(-3, 24, -5, 2, 24, -5, LAVA);
for (const tx of [-3, -1, 1]) block(tx, 23, -5, OBSIDIAN);
for (const tx of [-2, 0, 2]) block(tx, 25, -5, OBSIDIAN);
// eyes — deep sockets, blazing
block(-3, 25, -5, NEON_RED); block(-2, 25, -5, NEON_RED);
block(1, 25, -5, NEON_RED);  block(2, 25, -5, NEON_RED);
block(-3, 25, -4, LAVA); block(2, 25, -4, LAVA);
// horns / crown of obsidian shards
for (const [hx, hz, h] of [[-4, 0, 3], [-2, 1, 4], [0, 1, 5], [2, 1, 4], [4, 0, 3]]) {
  cube(hx, 28, hz, hx, 27 + h, hz, OBSIDIAN);
  block(hx, 28 + h, hz, BLACK);
}
// fire venting from head crown + shoulders + raised fist
block(0, 33, 1, FIRE);
block(-2, 32, 1, FIRE);
block(2, 32, 1, FIRE);
block(-10, 25, 0, FIRE);
block(10, 25, 0, FIRE);
block(-16, 32, -4, FIRE);
// fire in the mouth and chest core
block(0, 24, -6, FIRE);
block(-1, 17, -6, FIRE);

// ---------- environment: smoke, embers, burning stumps ----------
// lava pool surface fire/embers
for (const [fx, fz] of [[-3, 4], [4, 6], [-8, -6], [8, 8], [0, 9]]) block(fx, -2, fz, FIRE);
// burnt tree stumps around rim
for (const [sx, sz] of [[-12, -10], [10, -13], [13, 10], [-13, 9]]) {
  cube(sx, 0, sz, sx, 2, sz, BLACK);
  block(sx, 3, sz, OBSIDIAN);
  block(sx + 1, 0, sz, FIRE);
}
// scattered obsidian shards / debris in foreground (north side, toward camera)
for (let i = 0; i < 18; i++) {
  const sx = Math.round(-12 + rnd(i, 7, 1) * 24);
  const sz = Math.round(-15 + rnd(i, 8, 2) * 6);
  const id = rnd(i, 9, 3) < 0.5 ? OBSIDIAN : (rnd(i, 10, 4) < 0.5 ? BLACK : LAVA);
  block(sx, 0, sz, id);
  if (rnd(i, 11, 5) < 0.4) block(sx, 1, sz, OBSIDIAN);
}