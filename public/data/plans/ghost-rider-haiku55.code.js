// ghost-rider-haiku55 — prompt:
// Ghost Rider on his flaming motorcycle...

const H = (x, y, z) => { const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return s - Math.floor(s); };

function wheel(cz) {
  for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) {
    const d = Math.hypot(dx, dy);
    let id = null;
    if (d <= 1.01) id = GOLD;
    else if (d <= 2 && (dx === 0 || dy === 0)) id = IRON;
    else if (d > 2 && d <= 3) id = ORANGE;
    else if (d > 3 && d <= 4) id = BLACK;
    else if (d > 4 && d <= 5 && dy >= 1) id = BLACK;
    if (id) { block(dx, 4 + dy, cz - 1, id); block(dx, 4 + dy, cz, id); }
  }
}

cube(-6, 0, -11, 6, 24, 21, AIR);

for (let x = -22; x <= 22; x++) {
  const h = 3 + Math.floor(H(x, 0, 21) * 7);
  for (let y = 0; y <= h; y++) {
    const r = H(x, y, 21);
    block(x, y, 21, r < 0.03 ? LAVA : r < 0.4 ? COBBLE : STONE);
  }
}

cube(-9, 0, 18, -7, 11, 19, OBSIDIAN);
cube(7, 0, 18, 9, 11, 19, OBSIDIAN);
cube(-9, 12, 18, 9, 13, 19, BRICK);
block(-9, 14, 19, LAVA);
block(9, 14, 19, LAVA);

cube(-14, 0, 12, -12, 12, 13, COBBLE);
cube(-14, 13, 12, -12, 13, 13, LAVA);
cube(12, 0, 12, 14, 6, 13, BRICK);
block(12, 7, 12, COBBLE);
block(14, 7, 13, COBBLE);

cube(-2, -1, 4, 2, -1, 20, BLACK);
for (let x = -4; x <= 4; x++) for (let z = 6; z <= 19; z++) {
  if (H(x, -1, z) > 0.88) block(x, -1, z, ORANGE);
}
line(-14, -1, 8, -7, -1, 5, LAVA);
line(9, -1, 10, 15, -1, 8, LAVA);

for (let z = 4; z <= 20; z++) {
  const t = (z - 4) / 16;
  const cx = 0.6 * Math.sin(z * 0.7);
  const cy = 5 + 0.8 * Math.sin(z * 0.9 + 1);
  const wx = 3.6 * (1 - t) + 1.2;
  const wy = 3.2 * (1 - t) + 1.0;
  for (let x = -5; x <= 5; x++) for (let y = 0; y <= 10; y++) {
    const ex = (x - cx) / wx, ey = (y - cy) / wy;
    const r = ex * ex + ey * ey;
    const n = H(x, y, z);
    if (r <= 1 + (n - 0.5) * 0.4) {
      let id = r < 0.2 ? YELLOW : r < 0.55 ? ORANGE : RED;
      if (n > 0.98 && r < 0.8) id = LAVA;
      block(x, y, z, id);
    }
  }
}

wheel(8);
wheel(-9);

cube(-1, 2, -2, 1, 5, 1, GRAY);
line(-1, 4, 2, -1, 4, 6, BLACK);
line(1, 4, 2, 1, 4, 6, BLACK);
line(0, 3, 2, 0, 3, 6, IRON);
line(2, 2, -2, 2, 2, 6, IRON);
line(-2, 2, -2, -2, 2, 6, IRON);
block(2, 2, 6, LAVA);
block(-2, 2, 6, LAVA);
block(2, 3, 6, FIRE);
block(-2, 3, 6, FIRE);

line(0, 6, -5, 0, 11, -7, BLACK);
cube(-2, 8, -4, 2, 9, -1, RED);
block(-2, 9, -4, ORANGE);
block(2, 9, -4, ORANGE);
line(-1, 9, -4, 1, 9, -4, YELLOW);
cube(-2, 8, 0, 2, 8, 3, BLACK);

cube(-2, 9, 1, 2, 9, 3, BLACK);
line(-2, 9, 0, 2, 9, 0, GOLD);
cube(-2, 10, 1, 2, 14, 3, BLACK);
cube(-3, 13, 1, -3, 14, 2, BLACK);
cube(3, 13, 1, 3, 14, 2, BLACK);
block(-3, 15, 2, IRON);
block(3, 15, 2, IRON);

line(-3, 9, 0, -3, 9, -3, BLACK);
line(-3, 8, -3, -3, 3, -3, BLACK);
cube(-3, 2, -4, -3, 2, -2, BLACK);
block(-4, 2, -3, IRON);
line(3, 9, 0, 3, 9, -3, BLACK);
line(3, 8, -3, 3, 3, -3, BLACK);
cube(3, 2, -4, 3, 2, -2, BLACK);
block(4, 2, -3, IRON);

line(-2, 14, 1, -4, 12, -7, BLACK);
line(2, 14, 1, 4, 12, -7, BLACK);

line(-4, 12, -7, -1, 12, -7, IRON);
line(1, 12, -7, 4, 12, -7, IRON);
block(0, 12, -7, IRON);
block(-4, 12, -7, BLACK);
block(4, 12, -7, BLACK);

line(-1, 4, -9, -1, 12, -7, IRON);
line(1, 4, -9, 1, 12, -7, IRON);
line(0, 11, -8, 0, 11, -10, IRON);
cube(-1, 10, -11, 1, 12, -11, IRON);
block(0, 11, -11, GLOWSTONE);

for (let i = 0; i <= 4; i++) {
  block(-2 + i, 10 + i, 0, i % 2 === 0 ? GOLD : IRON);
  block(2 - i, 10 + i, 0, i % 2 === 1 ? GOLD : IRON);
}

cube(-1, 15, 1, 1, 15, 2, BLACK);
cube(-1, 16, 1, 1, 16, 2, WHITE);
cube(-2, 17, 0, 2, 21, 2, WHITE);
block(-2, 19, 0, BLACK);
block(-1, 20, 0, BLACK);
block(1, 20, 0, BLACK);
block(2, 19, 0, BLACK);
block(-1, 19, 0, NEON_RED);
block(1, 19, 0, NEON_RED);
block(0, 18, 0, BLACK);
block(-1, 17, 0, BLACK);
block(1, 17, 0, BLACK);
block(-2, 17, 0, WHITE);
block(0, 17, 0, WHITE);
block(2, 17, 0, WHITE);

for (let x = -2; x <= 2; x++) for (let z = 0; z <= 2; z++) {
  const h = 1 + Math.floor(H(x, 22, z) * 4);
  for (let k = 0; k < h; k++) {
    const id = k === 0 ? RED : k === h - 1 ? YELLOW : ORANGE;
    block(x, 22 + k, z, id);
  }
}
for (const x of [-3, 3]) for (let z = 0; z <= 2; z++) for (let y = 18; y <= 21; y++) {
  const n = H(x, y, z);
  if (n > 0.35) block(x, y, z, y === 18 ? RED : ORANGE);
}

block(-2, 27, 1, FIRE);
block(2, 26, 0, FIRE);
block(0, 28, 1, FIRE);
block(-1, 26, 2, FIRE);
block(1, 27, 2, FIRE);