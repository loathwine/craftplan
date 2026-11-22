// moose-haiku55 — prompt:
// a moose...

// ---- Clear the site (AIR is free) ----
cube(-6, 0, -12, 6, 12, 8, AIR);

// ---- Ground: grass slab under the moose, midground and foreground ----
cube(-12, -1, -20, 12, -1, 8, GRASS);

// ---- Helpers ----
function ell(cx, cy, cz, rx, ry, rz, pick) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
  for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
    const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
    if (dx * dx + dy * dy + dz * dz <= 1) {
      const id = typeof pick === 'function' ? pick(x, y, z) : pick;
      if (id) block(x, y, z, id);
    }
  }
}

function pine(px, pz, h) {
  cube(px - 1, -1, pz - 1, px + 1, -1, pz + 1, GRASS);
  for (let y = 0; y <= h - 4; y++) block(px, y, pz, OAK_LOG);
  for (let y = 3; y <= h; y++) {
    const r = Math.round((h - y) * 0.45);
    for (let dx = -r; dx <= r; dx++)
    for (let dz = -r; dz <= r; dz++)
      if (dx * dx + dz * dz <= r * r + r) block(px + dx, y, pz + dz, LEAVES);
  }
}

// ---- Background: conifers behind the moose (south, +Z) ----
pine(-14, 13, 14);
pine(12, 15, 12);
pine(2, 17, 12);

// ---- Foreground: fallen log, rocks, flowers (north, -Z) ----
line(-7, 0, -18, 3, 0, -18, OAK_LOG);
cube(-10, 0, -16, -8, 1, -15, COBBLE);
cube(7, 0, -17, 9, 0, -16, STONE);
block(5, 0, -19, COBBLE);
block(6, 0, -19, STONE);
[
  [-8, -12, YELLOW], [9, -10, RED], [-10, -5, YELLOW], [10, -2, PINK],
  [-7, 3, RED], [8, 5, YELLOW], [-9, 10, YELLOW], [11, -14, RED],
  [-3, -16, YELLOW], [3, -15, PINK]
].forEach(([fx, fz, id]) => block(fx, 0, fz, id));

// ---- Moose, facing north ----

// Legs: pale lower legs, brown upper legs, black hooves
for (const [lx, lz] of [[-3, -4], [2, -4], [-3, 4], [2, 4]]) {
  cube(lx, 1, lz, lx + 1, 2, lz + 1, OAK_LOG);
  cube(lx, 3, lz, lx + 1, 8, lz + 1, BROWN);
  cube(lx, 0, lz, lx + 1, 0, lz + 1, BLACK);
}

// Body: darker belly band plus speckled fur texture
ell(0, 9, 1, 4.2, 3.2, 5.5, (x, y, z) => {
  if (y <= 7) return OAK_LOG;
  if ((x * 7 + y * 13 + z * 5) % 11 === 0) return OAK_LOG;
  return BROWN;
});

// Shoulder hump, chest mass, rump
ell(0, 12.5, -1, 3, 2, 3.2, BROWN);
ell(0, 8.5, -3, 3, 2.6, 2, BROWN);
ell(0, 8, 5, 3, 2.6, 1.8, BROWN);

// Neck with dark crest
ell(0, 10, -6, 2.6, 2.8, 2.6, BROWN);
ell(0, 12.5, -6, 2.3, 0.9, 2.3, OAK_LOG);

// Dewlap (bell) hanging under the throat
cube(-1, 5, -9, 1, 7, -8, OAK_LOG);

// Skull
cube(-2, 10, -13, 2, 13, -9, BROWN);

// Bulbous muzzle and black nose
ell(0, 9, -15, 2.2, 2.2, 2.2, OAK_LOG);
cube(-1, 8, -18, 1, 9, -17, BLACK);

// Eyes
block(-1, 12, -13, BLACK);
block(1, 12, -13, BLACK);

// Flat ears
cube(-5, 12, -11, -3, 13, -10, BROWN);
cube(3, 12, -11, 5, 13, -10, BROWN);

// Palmated antlers
for (const s of [-1, 1]) {
  line(2 * s, 14, -11, 5 * s, 15, -11, PLANKS);
  cube(Math.min(6 * s, 9 * s), 15, -12, Math.max(6 * s, 9 * s), 18, -11, PLANKS);
  block(4 * s, 16, -12, PLANKS);
  block(7 * s, 19, -12, PLANKS);
  block(9 * s, 19, -12, PLANKS);
  block(8 * s, 15, -13, PLANKS);
}

// Short tail
cube(0, 8, 7, 0, 9, 7, BROWN);