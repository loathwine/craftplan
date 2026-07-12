// treasure-chest-4x-opus — prompt:
// a treasure chest overflowing with gold...

// ===== Treasure chest overflowing with gold =====
// Front faces NORTH (-Z), toward the camera. Gold = SAND.
const R = 11, FZ = -7, BZ = 7, FLOOR = 0, RIM = 8;

// deterministic pseudo-random
function h(a, b, c) { let n = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return n - Math.floor(n); }
// surface gold: mostly gold, occasional gems (ruby/sapphire/diamond)
function goldTop(x, z, s) { let r = h(x, s, z); if (r < 0.045) return BRICK; if (r < 0.085) return GLASS; if (r < 0.115) return ICE; return SAND; }

// --- clear the build column out of the forest canopy (AIR is free) ---
cube(-13, 0, -13, 13, 18, 10, AIR);

// --- chest body (built as panels, hollow inside) ---
cube(-R, FLOOR, FZ, R, FLOOR, BZ, PLANKS);            // floor
cube(-R, 1, FZ, R, RIM, FZ, PLANKS);                  // front wall
cube(-R, 1, BZ, R, RIM, BZ, PLANKS);                  // back wall
cube(-R, 1, FZ + 1, -R, RIM, BZ - 1, PLANKS);         // left wall
cube(R, 1, FZ + 1, R, RIM, BZ - 1, PLANKS);           // right wall

// vertical wood plank grain on front (subtle stripes)
for (let x = -R + 2; x <= R - 2; x += 3) cube(x, 1, FZ, x, RIM, FZ, OAK_LOG);

// protruding corner trims
function trim(x, z) { cube(x, 0, z, x, RIM, z, OAK_LOG); }
trim(-R, FZ - 1); trim(R, FZ - 1); trim(-R, BZ + 1); trim(R, BZ + 1);

// iron bands wrapping the chest (protruding, COBBLE)
function band(y) {
  cube(-R, y, FZ - 1, R, y, FZ - 1, COBBLE);
  cube(-R, y, BZ + 1, R, y, BZ + 1, COBBLE);
  cube(-R - 1, y, FZ, -R - 1, y, BZ, COBBLE);
  cube(R + 1, y, FZ, R + 1, y, BZ, COBBLE);
}
band(1); band(6);

// lock plate + keyhole on front center
cube(-2, 3, FZ - 1, 2, 6, FZ - 1, COBBLE);
cube(-2, 3, FZ - 2, 2, 5, FZ - 2, COBBLE);
block(0, 5, FZ - 2, SAND);      // gold lock knob
block(0, 4, FZ - 2, OAK_LOG);   // keyhole

// --- open lid, hinged at back-top, leaning back ---
const lidRows = [];
for (let i = 0; i <= 9; i++) {
  let y = RIM + i;
  let z = BZ + Math.round(i * 0.55);
  lidRows.push([y, z]);
  cube(-R, y, z, R, y, z + 1, PLANKS);
}
// lid ribs + iron edge
for (const [y, z] of lidRows) {
  for (const xr of [-R, -6, 0, 6, R]) { block(xr, y, z, OAK_LOG); block(xr, y, z + 1, OAK_LOG); }
}
const topRow = lidRows[lidRows.length - 1];
cube(-R, topRow[0], topRow[1] + 1, R, topRow[0], topRow[1] + 1, COBBLE);
// inner underside of lid catches light -> a couple gold glints
for (let x = -8; x <= 8; x += 4) block(x, RIM + 3, BZ + 2, SAND);

// --- gold filling the chest (top layers) ---
cube(-R + 1, RIM - 2, FZ + 1, R - 1, RIM, BZ - 1, SAND);

// mounded gold heaping above the rim
for (let x = -R + 1; x <= R - 1; x++) {
  for (let z = FZ + 1; z <= BZ - 1; z++) {
    let dx = x / 10, dz = z / 6, rr = Math.sqrt(dx * dx + dz * dz);
    let mh = RIM + Math.round(3.2 * (1 - rr) + (h(x, 2, z) - 0.5));
    for (let y = RIM + 1; y <= mh; y++) block(x, y, z, y === mh ? goldTop(x, z, 4) : SAND);
  }
}

// small jeweled crown resting on the pile crest
const cy = RIM + 3;
for (let a = 0; a < 8; a++) {
  let ang = a / 8 * Math.PI * 2;
  let cx = Math.round(Math.cos(ang) * 2), cz = Math.round(Math.sin(ang) * 2);
  block(cx, cy, cz, SAND);
  block(cx, cy + 1, cz, a % 2 ? BRICK : SAND);
}
block(0, cy + 1, 0, BRICK);

// --- gold cresting over the front lip ---
for (let x = -8; x <= 8; x++) {
  let tX = 1 - Math.abs(x) / 10;
  let crest = RIM + Math.round(1.6 * tX + (h(x, 1, 1) - 0.3));
  for (let y = RIM - 1; y <= crest; y++) {
    block(x, y, FZ, y === crest ? goldTop(x, FZ, 2) : SAND);
    block(x, y, FZ - 1, y === crest ? goldTop(x, FZ - 1, 2) : SAND);
  }
}

// --- cascade of gold clinging down the front face ---
for (let x = -7; x <= 7; x++) {
  let tX = 1 - Math.abs(x) / 9;
  let top = Math.round(RIM * (0.5 + 0.5 * tX)) + (h(x, 9, 9) > 0.6 ? 1 : 0);
  for (let y = 0; y <= top; y++) block(x, y, FZ - 1, y === top ? goldTop(x, FZ - 1, 3) : SAND);
}

// --- spilled gold pile pooling in front of the chest ---
for (let x = -R - 1; x <= R + 1; x++) {
  for (let d = 1; d <= 6; d++) {
    let z = FZ - d;
    let tX = Math.max(0, 1 - Math.abs(x) / (R + 2));
    let tZ = Math.max(0, 1 - (d - 1) / 6);
    let base = 5.2 * tZ * (0.45 + 0.55 * tX);
    let ph = Math.round(base + (h(x, d, 7) - 0.5) * 1.4);
    if (ph < 0) continue;
    for (let y = 0; y <= ph; y++) block(x, y, z, y === ph ? goldTop(x, z, d) : SAND);
  }
}

// --- foreground detail: stacked gold ingots to the sides ---
function ingot(x, y, z) { cube(x, y, z, x + 2, y, z + 1, SAND); }
ingot(-17, 0, -10); ingot(-16, 0, -8); ingot(-16, 1, -9);
ingot(15, 0, -9); ingot(15, 0, -7); ingot(16, 1, -8);
block(-16, 1, -10, BRICK); block(16, 2, -8, GLASS);

// --- loose coins & gems scattered around ---
for (let i = 0; i < 46; i++) {
  let a = h(i, 5, 1) * Math.PI * 2, rad = 9 + h(i, 6, 2) * 11;
  let x = Math.round(Math.cos(a) * rad), z = Math.round(-3 + Math.sin(a) * rad * 0.6);
  if (x < -21 || x > 21 || z < -21 || z > 9) continue;
  if (x > -13 && x < 13 && z > -14 && z < 8) continue; // keep clear of the pile
  let r = h(i, 7, 3);
  block(x, 0, z, r < 0.1 ? BRICK : r < 0.16 ? GLASS : SAND);
  if (h(i, 8, 4) > 0.8) block(x, 1, z, SAND); // occasional 2-stack
}