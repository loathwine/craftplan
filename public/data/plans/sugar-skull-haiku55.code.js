// sugar-skull-haiku55 — prompt:
// a Day of the Dead sugar skull...

const inEll = (x, y, z, cx, cy, cz, rx, ry, rz) => {
  const a = (x - cx) / rx, b = (y - cy) / ry, c = (z - cz) / rz;
  return a * a + b * b + c * c <= 1;
};

const skull = (x, y, z) => y >= 5 && (
  inEll(x, y, z, 0, 15.5, 0.3, 6.6, 5.6, 6.3) ||
  inEll(x, y, z, 0, 11.5, -0.5, 6.3, 3.0, 4.5) ||
  inEll(x, y, z, 0, 7.0, -0.8, 4.6, 2.6, 4.3)
);

const inNose = (x, y, z) => z <= -3 && y >= 7.5 && y <= 10.5 && Math.abs(x) <= 0.5 + (y - 7.5) * 0.75;

const skinColor = (x, y, z) => {
  if (z <= -3) {
    if (inNose(x, y, z)) return AIR;
    for (const ex of [-3, 3]) {
      const d = Math.hypot(x - ex, y - 12.3, z + 5);
      if (d <= 2.0) return BLACK;
      if (d <= 2.9) return PINK;
    }
    if (y === 6 && Math.abs(x) <= 3) return BLACK;
    if (y === 5 && Math.abs(x) <= 3) return x % 2 === 0 ? WHITE : BLACK;
    const dy = y - 18, d = Math.hypot(x, dy);
    if (d <= 1.2) return YELLOW;
    if (d <= 3.1 && Math.cos(6 * Math.atan2(dy, x)) > 0.2) return MAGENTA;
    if (y === 16 && Math.abs(x) >= 3 && Math.abs(x) % 2 === 1) return CYAN;
    if (y === 10 && Math.abs(x) === 4) return ORANGE;
    if (y === 8 && Math.abs(x) >= 2 && Math.abs(x) <= 4 && x % 2 === 0) return LIME;
  }
  if (Math.abs(x) >= 5 && y >= 12 && y <= 16 && (x + y) % 2 === 0) return PURPLE;
  return WHITE;
};

for (let y = 5; y <= 22; y++)
  for (let x = -7; x <= 7; x++)
    for (let z = -6; z <= 7; z++) {
      if (skull(x, y, z)) block(x, y, z, skinColor(x, y, z));
      else if (Math.abs(x) <= 6 && z >= -5 && z <= 5 && y <= 21) block(x, y, z, AIR);
    }

for (let x = -9; x <= 9; x++)
  for (let z = -7; z <= 7; z++) {
    block(x, 0, z, COBBLE);
    block(x, 1, z, COBBLE);
  }

for (let x = -7; x <= 7; x++)
  for (let z = -6; z <= 6; z++) {
    block(x, 2, z, PURPLE);
    block(x, 3, z, PURPLE);
    block(x, 4, z, GOLD);
  }

for (let x = -7; x <= 7; x++) {
  block(x, 2, -6, x % 2 === 0 ? YELLOW : ORANGE);
  block(x, 3, -6, Math.abs(x) % 3 === 0 ? LIME : PURPLE);
}

for (const cx of [-5, 5]) {
  for (let y = 5; y <= 8; y++) block(cx, y, -1, WHITE);
  block(cx, 9, -1, FIRE);
}

for (const [mx, mz] of [[-6, -5], [6, -5], [-6, 4], [6, 4]]) {
  sphere(mx, 6, mz, 1.2, ORANGE);
  block(mx, 6, mz, YELLOW);
}

for (const x of [-10, 10]) line(x, 0, 8, x, 22, 8, PLANKS);
line(-10, 22, 8, 10, 22, 8, PLANKS);

const flagCols = [RED, YELLOW, LIME, CYAN, MAGENTA, ORANGE, BLUE, PINK];
let flagIdx = 0;
for (let x = -8; x <= 8; x += 2) {
  const c = flagCols[flagIdx++ % flagCols.length];
  line(x - 1, 21, 8, x + 1, 21, 8, c);
  block(x, 20, 8, c);
}

for (let x = -12; x <= 12; x++)
  for (const z of [-10, -11])
    if (((x + 20) * 7 + (z + 20) * 3) % 5 === 0)
      block(x, 0, z, (x + z) % 2 === 0 ? ORANGE : YELLOW);