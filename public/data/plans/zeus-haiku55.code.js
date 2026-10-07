// zeus-haiku55 — prompt:
// Zeus throwing a lightning bolt...

const rnd = (x, y, z) => {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const ell = (cx, cy, cz, rx, ry, rz, pick) => {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
  for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
    const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
    if (dx * dx + dy * dy + dz * dz > 1) continue;
    const id = pick(x, y, z);
    if (id !== null && id !== undefined) block(x, y, z, id);
  }
};

const cap = (ax, ay, az, bx, by, bz, r, id) => {
  const dx = bx - ax, dy = by - ay, dz = bz - az;
  const L = dx * dx + dy * dy + dz * dz || 1;
  for (let x = Math.floor(Math.min(ax, bx) - r); x <= Math.ceil(Math.max(ax, bx) + r); x++)
  for (let y = Math.floor(Math.min(ay, by) - r); y <= Math.ceil(Math.max(ay, by) + r); y++)
  for (let z = Math.floor(Math.min(az, bz) - r); z <= Math.ceil(Math.max(az, bz) + r); z++) {
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy + (z - az) * dz) / L));
    const px = x - (ax + t * dx), py = y - (ay + t * dy), pz = z - (az + t * dz);
    if (px * px + py * py + pz * pz <= r * r) block(x, y, z, id);
  }
};

const cloudPick = (x, y, z) => (y < 6 || y > 9 ? null : y === 6 ? LIGHT_GRAY : WHITE);

ell(-7, 28, 9, 8, 2.5, 3.5, () => GRAY);
ell(7, 30, 10, 7, 2.5, 3.5, () => GRAY);
ell(0, 27, 12, 9, 2, 3, () => GRAY);

const radii = [9, 9, 8, 7, 6, 5];
radii.forEach((r, y) => {
  for (let x = -r; x <= r; x++)
  for (let z = -r; z <= r; z++)
    if (x * x + z * z <= r * r + 0.5) block(x, y, z, rnd(x, y, z) < 0.22 ? COBBLE : STONE);
});

ell(0, 7.5, 0, 9, 2.2, 7, cloudPick);
ell(-5, 7.5, 3, 3, 2.5, 3, cloudPick);
ell(5, 7.5, -3, 3, 2.5, 3, cloudPick);
ell(0, 8.5, -5, 3, 2, 3, cloudPick);

cube(-2, 10, -2, -1, 10, -1, BROWN);
cube(1, 10, -2, 2, 10, -1, BROWN);
cube(-2, 11, -2, 2, 14, 1, MARBLE);
cube(-2, 11, -2, 2, 11, -2, GOLD);
for (let y = 12; y <= 13; y++) {
  block(-1, y, -2, LIGHT_GRAY);
  block(1, y, -2, LIGHT_GRAY);
}
cube(-2, 14, -2, 2, 14, -2, GOLD);

cube(-4, 11, 2, 4, 17, 2, BLUE);
cube(-3, 15, -2, 3, 17, 1, MARBLE);
cube(-2, 16, -3, -1, 16, -3, MARBLE);
cube(1, 16, -3, 2, 16, -3, MARBLE);
cap(-3, 17, -3, 2, 14, -3, 0.6, BLUE);
cube(-4, 18, -1, 4, 18, 0, MARBLE);
cube(-1, 19, -1, 1, 19, 0, MARBLE);
cube(-2, 20, -2, 2, 22, 1, MARBLE);

block(-1, 21, -2, BLACK);
block(1, 21, -2, BLACK);
block(-1, 22, -2, LIGHT_GRAY);
block(1, 22, -2, LIGHT_GRAY);
block(0, 21, -3, MARBLE);
cube(-1, 19, -3, 1, 19, -3, WHITE);
block(0, 18, -3, WHITE);
block(-2, 22, -3, WHITE);
block(2, 22, -3, WHITE);

cube(-2, 23, -2, 2, 23, 1, WHITE);
block(-3, 22, -1, WHITE);
block(-3, 21, -1, WHITE);
block(3, 22, 0, WHITE);
block(3, 21, 0, WHITE);

cube(-2, 24, -2, 2, 24, 1, GREEN);
block(-3, 24, -2, GREEN);
block(3, 24, -2, GREEN);

cap(-4, 17, 0, -5, 14, -1, 0.9, MARBLE);
cap(-5, 14, -1, -6, 13, -2, 0.9, MARBLE);
cap(-6, 11, -2, -6, 23, -2, 0.35, GOLD);
block(-6, 24, -2, GOLD);

cap(4, 18, 0, 6, 21, 0, 0.9, MARBLE);
cap(6, 21, 0, 7, 25, -1, 0.9, MARBLE);
ell(7, 26, -1, 1.2, 1.2, 1.2, () => MARBLE);

cap(8, 27, -1, 10, 28, -2, 0.6, GLOWSTONE);
cap(10, 28, -2, 8, 29, -1, 0.6, GLOWSTONE);
cap(8, 29, -1, 11, 30, -2, 0.6, GLOWSTONE);
cap(11, 30, -2, 10, 31, -1, 0.6, GLOWSTONE);
cap(10, 31, -1, 13, 32, -2, 0.6, GLOWSTONE);
cap(11, 30, -2, 14, 29, 0, 0.5, GLOWSTONE);
block(10, 28, -2, ELECTRIC);
block(11, 30, -2, ELECTRIC);
block(13, 32, -2, ELECTRIC);
block(14, 29, 0, ELECTRIC);

const pillar = (x, h) => {
  cube(x - 1, 0, -8, x + 1, 0, -6, MARBLE);
  for (let y = 1; y <= h; y++) block(x, y, -7, MARBLE);
  cube(x - 1, h + 1, -8, x + 1, h + 1, -6, GOLD);
};
pillar(-11, 6);
pillar(11, 4);
block(12, 1, -5, COBBLE);
block(13, 0, -6, COBBLE);
block(10, 1, -5, COBBLE);