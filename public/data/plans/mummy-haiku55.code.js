// mummy-haiku55 — prompt:
// a mummy bursting out of its sarcophagus...

cube(-11, 0, -2, 11, 20, 22, AIR);
cube(-11, -1, -2, 11, -1, 22, SAND);

const hash = (x, z) => {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
for (let x = -11; x <= 11; x++) {
  for (let z = -2; z <= 22; z++) {
    const rim = Math.abs(x) >= 7 || z <= 0 || z >= 19;
    const h = hash(x, z);
    if (rim && h > 0.85) block(x, 0, z, SAND);
    if (rim && h > 0.97) block(x, 1, z, SAND);
  }
}

const PY = 16;
for (let k = 0; k <= 5; k++) {
  const r = 6 - k;
  for (let x = -r; x <= r; x++) {
    for (let z = PY - r; z <= PY + r; z++) {
      const edge = Math.abs(x) === r || Math.abs(z - PY) === r;
      block(x, k, z, edge ? BROWN : SAND);
    }
  }
}
block(0, 6, PY, GOLD);

for (const ox of [-10, 9]) {
  cube(ox, 0, 15, ox + 1, 15, 16, SAND);
  cube(ox, 16, 15, ox + 1, 16, 16, GOLD);
}

for (const px of [-8, 7]) {
  cube(px, 0, 2, px + 1, 9, 3, SAND);
  cube(px, 2, 2, px + 1, 2, 3, BLUE);
  cube(px, 6, 2, px + 1, 6, 3, BLUE);
  cube(px - 1, 10, 1, px + 2, 10, 4, GOLD);
  block(px, 11, 2, FIRE);
}

cube(-4, 0, 2, 4, 5, 8, GOLD);
cube(-3, 2, 3, 3, 5, 7, AIR);
for (let z = 2; z <= 8; z++) {
  if (z % 2 === 1) {
    for (const y of [2, 3]) {
      block(-4, y, z, BLUE);
      block(4, y, z, BLUE);
    }
  }
}
for (let x = -4; x <= 4; x++) {
  block(x, 0, 2, BROWN);
  block(x, 1, 2, BLUE);
  block(x, 3, 2, BLUE);
}
block(0, 2, 2, BLUE);
block(-4, 5, 8, AIR);
block(4, 5, 2, AIR);
block(4, 4, 8, AIR);

const lidTop = { 5: 5, 6: 4, 7: 3, 8: 2 };
for (let x = 5; x <= 8; x++) {
  for (let z = 3; z <= 8; z++) {
    for (let y = 0; y <= lidTop[x]; y++) {
      block(x, y, z, y === lidTop[x] && z % 2 === 1 ? BLUE : GOLD);
    }
  }
}

function wrapped(x1, y1, z1, x2, y2, z2) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      for (let z = z1; z <= z2; z++) {
        block(x, y, z, y % 2 === 0 ? WHITE : SAND);
      }
    }
  }
}

cube(-2, 2, 4, 2, 4, 6, SAND);
wrapped(-2, 5, 2, 2, 8, 4);
wrapped(-2, 9, 1, 2, 10, 3);
wrapped(-2, 11, 0, 2, 15, 3);
wrapped(-4, 7, -3, -3, 8, 2);
wrapped(3, 7, -3, 4, 8, 2);
wrapped(-4, 7, -5, -3, 8, -4);
wrapped(3, 7, -5, 4, 8, -4);

for (let x = -2; x <= 2; x++) block(x, 8, 2, GOLD);
block(0, 8, 2, BLUE);

for (let y = 11; y <= 15; y++) {
  for (let z = 0; z <= 3; z++) {
    block(-2, y, z, BLUE);
    block(2, y, z, BLUE);
  }
}
for (let x = -2; x <= 2; x++) block(x, 15, 0, GOLD);
block(0, 16, 0, GOLD);

block(-1, 13, 0, GLOWSTONE);
block(1, 13, 0, GLOWSTONE);
for (let x = -1; x <= 1; x++) block(x, 12, 0, BROWN);
block(0, 13, 0, BROWN);

line(5, 8, 1, 5, 4, 1, WHITE);
line(-5, 8, 1, -5, 5, 1, WHITE);

cube(-6, 0, 5, -5, 0, 6, GOLD);
block(7, 0, 12, BLUE);