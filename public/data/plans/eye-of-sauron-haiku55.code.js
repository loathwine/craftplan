// eye-of-sauron-haiku55 — prompt:
// the Eye of Sauron on the tower of Barad-dur...

const hw = (y) => Math.round(6 - (y - 5) * 0.2);

function ring(y, h, id) {
  cube(-h, y, -h, h, y, -h, id);
  cube(-h, y, h, h, y, h, id);
  cube(-h, y, -h, -h, y, h, id);
  cube(h, y, -h, h, y, h, id);
}

function buttress(y, h, id) {
  for (const sx of [-1, 1]) for (const sz of [-1, 1])
    for (const dx of [0, -sx]) for (const dz of [0, -sz])
      block(sx * h + dx, y, sz * h + dz, id);
}

cube(-10, 1, -10, 10, 12, 10, AIR);
cube(-7, 13, -7, 7, 33, 7, AIR);

cube(-10, -1, -10, 10, -1, 10, STONE);
cube(-10, 0, -10, 10, 0, 10, COBBLE);
cube(-6, 0, 7, -4, 0, 8, LAVA);
cube(4, 0, -8, 6, 0, -7, LAVA);

for (let y = 1; y <= 3; y++) ring(y, 9, COBBLE);
for (let i = -9; i <= 9; i += 2) {
  block(i, 4, -9, COBBLE);
  block(i, 4, 9, COBBLE);
  block(-9, 4, i, COBBLE);
  block(9, 4, i, COBBLE);
}
cube(-1, 1, -9, 1, 3, -9, AIR);

for (const sx of [-8, 8]) for (const sz of [-8, 8]) {
  cube(sx - 1, 1, sz - 1, sx + 1, 8, sz + 1, COBBLE);
  for (const dx of [-1, 1]) for (const dz of [-1, 1]) block(sx + dx, 9, sz + dz, COBBLE);
}

cube(-6, 1, -6, 6, 3, 6, OBSIDIAN);
cube(-7, 4, -7, 7, 4, 7, GRAY);

for (let y = 5; y <= 26; y++) {
  const h = hw(y);
  ring(y, h, OBSIDIAN);
  buttress(y, h, OBSIDIAN);
  if (y === 12 || y === 19) ring(y, h, GRAY);
}

for (const y of [9, 16, 23]) {
  const h = hw(y);
  for (const dy of [0, 1]) {
    block(0, y + dy, -h, GLOWSTONE);
    block(-h, y + dy, 0, AIR);
    block(h, y + dy, 0, AIR);
    block(0, y + dy, h, AIR);
  }
}

cube(-2, 27, -2, 2, 27, 2, OBSIDIAN);
for (const sx of [-2, 2]) {
  cube(sx, 28, 2, sx, 29, 2, OBSIDIAN);
  block(sx, 30, 2, GRAY);
}

for (let y = 25; y <= 33; y++) for (let x = -7; x <= 7; x++) for (const z of [-3, -2]) {
  const dy = y - 29;
  const rim = (x * x) / 36 + (dy * dy) / 12.25 <= 1;
  if (!rim) continue;
  const iris = (x * x) / 17.64 + (dy * dy) / 6.76 <= 1;
  if (x === 0 && Math.abs(dy) <= 2) block(x, y, z, BLACK);
  else block(x, y, z, iris ? LAVA : IRON);
}
block(-3, 33, -3, FIRE);
block(0, 33, -3, FIRE);
block(3, 33, -3, FIRE);