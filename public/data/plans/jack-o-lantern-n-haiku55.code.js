// jack-o-lantern-n-haiku55 — prompt:
// a glowing jack-o'-lantern...

const inTri = (px, py, a, b, c) => {
  const sgn = (p1, p2, p3) => (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
  const p = [px, py];
  const d1 = sgn(p, a, b), d2 = sgn(p, b, c), d3 = sgn(p, c, a);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
};

const inBody = (x, y, z) => {
  const s = 1 - 0.05 * Math.pow(Math.abs(Math.cos(4 * Math.atan2(z, x))), 8);
  const ny = (y - 7) / 7.2;
  return (x * x + z * z) / 81 + ny * ny <= s * s;
};

const faceAt = (x, y) => {
  const dy = y - 7;
  const ax = Math.abs(x);
  if (inTri(x, dy, [-6, 1.5], [-2.5, 1.5], [-4.25, 5.5])) return true;
  if (inTri(x, dy, [2.5, 1.5], [6, 1.5], [4.25, 5.5])) return true;
  if (dy === -1 && ax <= 1) return true;
  if (dy === 0 && x === 0) return true;
  if (dy === -3 && ax <= 5) return true;
  if (dy === -4 && ax <= 4) return true;
  if (dy === -5 && ax <= 4 && ax % 2 === 0) return true;
  return false;
};

const gourd = (cx, cz) => {
  for (let x = -3; x <= 3; x++)
    for (let y = 0; y <= 3; y++)
      for (let z = -3; z <= 3; z++)
        if ((x * x + z * z) / 5.3 + ((y - 1) ** 2) / 4.84 <= 1) block(cx + x, y, cz + z, ORANGE);
  block(cx, 4, cz, OAK_LOG);
};

for (let x = -13; x <= 13; x++)
  for (let z = -13; z <= 13; z++) {
    const d = x * x + z * z;
    if (d <= 169) block(x, -1, z, GRASS);
    if (d >= 144 && d <= 169) {
      block(x, 0, z, COBBLE);
      block(x, 1, z, COBBLE);
    }
  }

for (let x = -9; x <= 9; x++)
  for (let y = 0; y <= 14; y++)
    for (let z = -9; z <= 9; z++) {
      if (!inBody(x, y, z)) continue;
      const glow = z <= 0 && faceAt(x, y) && (!inBody(x, y, z - 1) || !inBody(x, y, z - 2));
      block(x, y, z, glow ? GLOWSTONE : ORANGE);
    }

block(0, 13, 0, OAK_LOG);
block(0, 14, 0, OAK_LOG);
block(0, 15, 0, OAK_LOG);
block(1, 16, 0, OAK_LOG);
block(1, 14, 0, LEAVES);
block(-1, 14, 1, LEAVES);
block(2, 13, 0, LEAVES);
block(-2, 13, -1, LEAVES);
block(0, 15, -1, LEAVES);

for (const px of [-10, 10]) {
  for (let y = 0; y <= 2; y++) block(px, y, -8, OAK_LOG);
  block(px, 3, -8, GLOWSTONE);
}

gourd(-10, -3);
gourd(11, 3);
gourd(-5, 10);
gourd(5, -10);

line(-14, 0, 14, -14, 11, 14, OAK_LOG);
line(-14, 6, 14, -11, 9, 14, OAK_LOG);
line(-14, 8, 14, -18, 11, 14, OAK_LOG);
line(-14, 11, 14, -13, 14, 14, OAK_LOG);
line(-18, 11, 14, -19, 13, 14, OAK_LOG);

const litter = [ORANGE, RED, YELLOW, BROWN];
for (let i = 0; i < 24; i++) {
  const a = i * 2.4;
  const r = 15 + (i % 4);
  block(Math.round(Math.cos(a) * r), 0, Math.round(Math.sin(a) * r), litter[i % 4]);
}