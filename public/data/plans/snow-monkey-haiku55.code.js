// snow-monkey-haiku55 — prompt:
// a Japanese snow monkey in a hot spring...

// Japanese snow monkey soaking in a snowy hot spring. Front = north (-Z).

const hsh = (x, y, z) => { const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return n - Math.floor(n); };
const inEll = (cx, cy, cz, rx, ry, rz, x, y, z) =>
  ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1;
function ell(cx, cy, cz, rx, ry, rz, pick) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++)
        if (inEll(cx, cy, cz, rx, ry, rz, x, y, z)) {
          const id = typeof pick === 'function' ? pick(x, y, z) : pick;
          if (id !== null && id !== undefined) block(x, y, z, id);
        }
}
const fur = (x, y, z) => (hsh(x, y, z) > 0.72 ? GRAY : BROWN);

// 1. Clear site clutter (AIR is free)
cube(-10, 0, -8, 10, 14, 8, AIR);
cube(-14, 0, 9, 14, 16, 20, AIR);

// 2. Snowy ground with sparse drifts
cube(-9, -2, -7, 9, -2, 7, DIRT);
cube(-9, -1, -7, 9, -1, 7, SNOW);
for (let x = -9; x <= 9; x++)
  for (let z = -7; z <= 7; z++)
    if (hsh(x, 0, z) > 0.93) block(x, 0, z, SNOW);

// 3. Hot spring basin: stone floor, water, cobble/stone rim with snow
cube(-6, -2, -3, 6, -2, 4, STONE);
cube(-6, -1, -3, 6, 0, 4, WATER);
const rimBlock = (x, y, z) => block(x, y, z, hsh(x, y, z) > 0.5 ? COBBLE : STONE);
for (let x = -7; x <= 7; x++)
  for (let y = 0; y <= 1; y++) { rimBlock(x, y, -4); rimBlock(x, y, 5); }
for (let z = -4; z <= 5; z++)
  for (let y = 0; y <= 1; y++) { rimBlock(-7, y, z); rimBlock(7, y, z); }
for (let x = -7; x <= 7; x++) {
  if (hsh(x, 2, -4) > 0.45) block(x, 2, -4, SNOW);
  if (hsh(x, 2, 5) > 0.45) block(x, 2, 5, SNOW);
}
for (let z = -4; z <= 5; z++) {
  if (hsh(-7, 2, z) > 0.45) block(-7, 2, z, SNOW);
  if (hsh(7, 2, z) > 0.45) block(7, 2, z, SNOW);
}

// Floating towel on the water
block(5, 0, -2, WHITE);
block(5, 0, -1, WHITE);

// 4. Boulders around the pool
const rock = (cx, cz, r) => ell(cx, 0.3, cz, r, r * 0.8, r, (x, y, z) =>
  (y >= 1 && hsh(x, y, z) > 0.4 ? SNOW : hsh(x, y, z) > 0.5 ? COBBLE : STONE));
rock(-10, -5, 1.8); rock(11, -2, 1.6); rock(-11, 1, 1.6); rock(11, 4, 1.8);
rock(-4, -7, 1.3); rock(3, -7, 1.5); rock(-9, 5, 1.4); rock(10, 7, 1.5); rock(-12, -2, 1.3);

// 5. Japanese stone lantern (toro) on the back-right corner
cube(6, 0, -8, 8, 0, -6, STONE);
block(7, 1, -7, COBBLE);
cube(6, 2, -8, 8, 2, -6, COBBLE);
block(7, 2, -7, GLOWSTONE);
cube(5, 3, -9, 9, 3, -5, STONE);
cube(5, 4, -9, 9, 4, -5, SNOW);

// 6. Steam rising off the water (few cells, per effect budget)
[[-4, 1, -1], [4, 1, -1], [-3, 1, 3], [3, 1, 3], [-5, 1, 1], [5, 1, 1]]
  .forEach(([x, y, z]) => block(x, y, z, STEAM));

// 7. Wooden fence behind the pool
[-8, -4, 0, 4, 8].forEach(x => { for (let y = 0; y <= 3; y++) block(x, y, 7, OAK_LOG); });
for (let x = -8; x <= 8; x++) { block(x, 1, 7, PLANKS); block(x, 2, 7, PLANKS); }

// 8. Snow-laden cedars in the background
function tree(cx, cz, H, R) {
  for (let y = 0; y <= H; y++) block(cx, y, cz, OAK_LOG);
  const seen = new Set();
  const cells = [];
  for (let k = 0; k < 7; k++) {
    const y = H - 2 + k;
    const rr = Math.max(0.5, R * (1 - k / 7) + 0.4);
    for (let dx = -4; dx <= 4; dx++)
      for (let dz = -4; dz <= 4; dz++)
        if (dx * dx + dz * dz <= rr * rr) {
          const x = cx + dx, z = cz + dz, key = x + ',' + y + ',' + z;
          if (!seen.has(key)) { seen.add(key); cells.push([x, y, z]); }
        }
  }
  for (const [x, y, z] of cells) {
    const top = !seen.has(x + ',' + (y + 1) + ',' + z);
    block(x, y, z, top && hsh(x, y, z) > 0.2 ? SNOW : LEAVES);
  }
}
tree(-14, 10, 5, 2.8); tree(-10, 9, 5, 3); tree(-4, 10, 6, 3);
tree(2, 9, 5, 3.2); tree(7, 10, 6, 3); tree(12, 9, 5, 2.8);

// 9. Snowy mountain backdrop (stone, snow cap on the peaks)
for (let x = -12; x <= 12; x++)
  for (let z = 12; z <= 18; z++) {
    const h = Math.round(10 - Math.hypot(x / 1.3, (z - 15) / 1.0));
    for (let y = -1; y <= h; y++) {
      let id = STONE;
      if (y === h) id = h >= 6 ? SNOW : GRASS;
      else if (y === h - 1 && h >= 6 && hsh(x, y, z) > 0.5) id = SNOW;
      block(x, y, z, id);
    }
  }

// 10. The monkey, submerged to the chest, facing north
const torsoPick = (x, y, z) => (y >= 5 && Math.abs(x) <= 1 && hsh(x, y, z) > 0.5 ? SNOW : fur(x, y, z));
ell(0, 2.5, 1, 2.4, 2.5, 2.2, torsoPick);                                  // torso
ell(0, 4.6, -0.6, 1.6, 1.3, 1.5, fur);                                     // neck
ell(0, 6.2, -0.5, 2.4, 2.3, 2.3, (x, y, z) => (y >= 8 ? SNOW : fur(x, y, z))); // head + snow cap
ell(-2.5, 6.8, -0.3, 0.9, 1.2, 1.0, fur);                                  // ears
ell(2.5, 6.8, -0.3, 0.9, 1.2, 1.0, fur);
ell(-2.6, 2.3, 0.4, 0.9, 2.0, 0.9, fur);                                   // arms
ell(2.6, 2.3, 0.4, 0.9, 2.0, 0.9, fur);
ell(-2.0, 1.2, -1.4, 0.8, 0.6, 0.8, fur);                                  // hands
ell(2.0, 1.2, -1.4, 0.8, 0.6, 0.8, fur);
ell(0, 0.6, 2.0, 2.5, 0.9, 1.8, fur);                                      // lap at waterline

// Face: pink muzzle on the front layer (z = -2), black nose and eyes
for (let x = -2; x <= 2; x++)
  for (let y = 4; y <= 8; y++) {
    const inMuzzle = (x / 1.9) ** 2 + ((y - 5.8) / 1.8) ** 2 <= 1;
    if (inMuzzle && inEll(0, 6.2, -0.5, 2.4, 2.3, 2.3, x, y, -2)) block(x, y, -2, PINK);
  }
block(0, 5, -2, BLACK);   // nose
block(-1, 7, -2, BLACK);  // left eye
block(1, 7, -2, BLACK);   // right eye

// 11. Front-of-pool rocks and a few snow patches for foreground depth
rock(-5, -6, 0.9);
rock(6, 6, 0.9);
for (let x = -8; x <= 8; x++) if (hsh(x, 0, 6) > 0.6) block(x, 0, 6, SNOW);