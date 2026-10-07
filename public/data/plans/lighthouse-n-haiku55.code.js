// lighthouse-n-haiku55 — prompt:
// a lighthouse on a stormy night...

let seed = 90210;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const rockMix = () => { const r = rnd(); return r < 0.45 ? STONE : r < 0.75 ? COBBLE : r < 0.9 ? GRAY : BLACK; };

function ring(cx, y, cz, rIn, rOut, id) {
  for (let x = Math.floor(cx - rOut); x <= Math.ceil(cx + rOut); x++)
    for (let z = Math.floor(cz - rOut); z <= Math.ceil(cz + rOut); z++) {
      const d = Math.hypot(x - cx, z - cz);
      if (d <= rIn || d > rOut) continue;
      const b = typeof id === 'function' ? id(x, z) : id;
      if (b != null) block(x, y, z, b);
    }
}
const disc = (cx, y, cz, r, id) => ring(cx, y, cz, -1, r, id);
function blob(cx, cy, cz, r, idFn) {
  for (let x = cx - r; x <= cx + r; x++)
    for (let y = cy - r; y <= cy + r; y++)
      for (let z = cz - r; z <= cz + r; z++)
        if (Math.hypot(x - cx, y - cy, z - cz) <= r) block(x, y, z, idFn());
}

cube(-13, 0, -8, 10, 30, 8, AIR);
cube(-13, 0, 9, 13, 14, 16, AIR);

cube(-13, -2, 9, 13, -1, 16, WATER);
cube(-13, -1, 8, 13, 0, 8, COBBLE);

disc(0, -2, 0, 6, rockMix);
disc(0, -1, 0, 5.5, rockMix);
disc(0, 0, 0, 5, rockMix);

for (let y = 1; y <= 20; y++) ring(0, y, 0, 2, 3, Math.floor((y - 1) / 3) % 2 ? WHITE : RED);
ring(0, 20, 0, 3, 4, COBBLE);
disc(0, 21, 0, 4, IRON);
ring(0, 22, 0, 3.4, 4.1, (x, z) => ((x + z) % 2 === 0 ? IRON : null));

for (let y = 22; y <= 25; y++) {
  ring(0, y, 0, 1.5, 2.6, GLASS);
  block(2, y, 0, IRON); block(-2, y, 0, IRON); block(0, y, 2, IRON); block(0, y, -2, IRON);
}
for (let y = 22; y <= 24; y++) disc(0, y, 0, 1, GLOWSTONE);
disc(0, 26, 0, 3, BLACK);
disc(0, 27, 0, 2, BLACK);
disc(0, 28, 0, 1, BLACK);
block(0, 29, 0, GOLD);

cube(-1, 1, -3, 1, 3, -2, AIR);
for (const y of [8, 9, 15, 16]) {
  block(3, y, 0, GLASS); block(-3, y, 0, GLASS); block(0, y, 3, GLASS); block(0, y, -3, GLASS);
}
block(0, 8, 0, GLOWSTONE); block(0, 15, 0, GLOWSTONE);
line(-2, 0, -4, -2, 2, -4, IRON); block(-2, 3, -4, GLOWSTONE);
line(2, 0, -4, 2, 2, -4, IRON); block(2, 3, -4, GLOWSTONE);

cube(-12, 0, -4, -7, 3, 1, BRICK);
cube(-11, 1, -3, -8, 3, 0, AIR);
block(-10, 1, -4, AIR); block(-10, 2, -4, AIR);
block(-7, 2, -2, GLASS); block(-12, 2, -2, GLASS); block(-8, 2, -4, GLASS);
block(-9, 2, -2, GLOWSTONE);
cube(-13, 4, -5, -6, 4, 2, PLANKS);
cube(-12, 5, -4, -7, 5, 1, PLANKS);
cube(-11, 6, -3, -8, 6, 0, PLANKS);
cube(-9, 5, 1, -9, 7, 1, BRICK);

line(-15, 0, -9, -15, 6, -9, OAK_LOG);
line(-15, 5, -9, -18, 7, -9, OAK_LOG);
line(-15, 4, -9, -12, 6, -9, OAK_LOG);

blob(-16, 0, 18, 4, rockMix);
blob(16, 0, 18, 4, rockMix);

for (let i = 0; i < 60; i++) {
  const x = Math.round(-20 + rnd() * 40);
  const z = Math.round(-12 + rnd() * 18);
  if (Math.hypot(x, z) < 7 || (x > -15 && x < -4 && z > -6 && z < 4)) continue;
  blob(x, 0, z, 1 + Math.floor(rnd() * 2), rockMix);
}

for (let x = -13; x <= 13; x++)
  for (let z = 9; z <= 16; z++) {
    const h = Math.sin(x * 0.55 + z * 0.25) + 0.6 * Math.sin(z * 1.3 - x * 0.2);
    if (h > 1.1) block(x, 0, z, WATER);
  }

cube(6, -1, 10, 10, -1, 12, PLANKS);
cube(6, 0, 10, 10, 0, 10, PLANKS);
cube(6, 0, 12, 10, 0, 12, PLANKS);
cube(6, 0, 10, 6, 0, 12, PLANKS);
cube(10, 0, 10, 10, 0, 12, PLANKS);
cube(7, 0, 11, 9, 0, 11, AIR);
line(8, 0, 11, 8, 7, 11, OAK_LOG);
cube(9, 3, 11, 11, 6, 11, WHITE);
block(11, 6, 11, AIR); block(10, 3, 11, AIR);

block(-2, 30, -3, ELECTRIC);
block(0, 31, -4, ELECTRIC);
block(1, 32, -5, ELECTRIC);