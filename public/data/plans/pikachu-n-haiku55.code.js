// pikachu-n-haiku55 — prompt:
// Pikachu...

const Y0 = 1;
const HEAD = { cx: 0, cy: 14, cz: 0, rx: 5, ry: 4.5, rz: 4 };

function fill(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx) - 1; x <= Math.ceil(cx + rx) + 1; x++)
    for (let y = Math.floor(cy - ry) - 1; y <= Math.ceil(cy + ry) + 1; y++)
      for (let z = Math.floor(cz - rz) - 1; z <= Math.ceil(cz + rz) + 1; z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) block(x, y + Y0, z, id);
      }
}

function limb(a, b, r, id) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.ceil(len * 4);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    fill(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, r, r, id);
  }
}

function frontZ(x, y) {
  const dx = (x - HEAD.cx) / HEAD.rx, dy = (y - HEAD.cy) / HEAD.ry;
  const k = 1 - dx * dx - dy * dy;
  return k < 0 ? null : Math.ceil(HEAD.cz - HEAD.rz * Math.sqrt(k));
}

function paintFront(cx, cy, r, id) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
      if ((x - cx) * (x - cx) + (y - cy) * (y - cy) > r * r) continue;
      const z = frontZ(x, y);
      if (z !== null) block(x, y + Y0, z, id);
    }
}

cube(-9, 1, -8, 9, 30, 8, AIR);

for (let x = -9; x <= 9; x++)
  for (let z = -9; z <= 9; z++) {
    const d = Math.hypot(x, z);
    if (d <= 8.2) block(x, 0, z, d > 7 ? STONE : COBBLE);
  }

fill(0, 5.5, 1, 3.5, 4.5, 3, YELLOW);
fill(HEAD.cx, HEAD.cy, HEAD.cz, HEAD.rx, HEAD.ry, HEAD.rz, YELLOW);

for (const s of [-1, 1]) fill(s * 2.3, 1, -0.5, 1.6, 1.1, 2, YELLOW);

for (const s of [-1, 1]) limb([s * 3, 6, 0.5], [s * 5.5, 4.5, -1.5], 0.9, YELLOW);

for (const s of [-1, 1]) {
  limb([s * 2.5, 17, 0], [s * 4.2, 25, 0], 0.9, YELLOW);
  limb([s * 3.8, 22.2, 0], [s * 4.2, 25, 0], 0.95, BLACK);
}

limb([4.5, 2, 1], [7, 4.5, 1.5], 1.1, BROWN);
const tail = [[7, 4.5, 1.5], [6, 7, 1.5], [10, 9.5, 1.5], [8.5, 12, 1.5], [12, 14.5, 1.5], [10.5, 17.5, 1.5]];
for (let i = 0; i < tail.length - 1; i++) limb(tail[i], tail[i + 1], 1.0, YELLOW);

for (const s of [-1, 1]) {
  paintFront(s * 2.5, 13.5, 1.1, BLACK);
  paintFront(s * 3.5, 11.5, 1.5, RED);
}
paintFront(-1, 10, 0.3, BLACK);
paintFront(0, 11, 0.3, BLACK);
paintFront(1, 10, 0.3, BLACK);
paintFront(0, 12.5, 0.5, BLACK);

for (const [x, y, z] of [[14, 17, 2], [13, 21, 2], [7, 17, 3], [15, 12, 2], [-6, 21, 3]]) block(x, y + Y0, z, ELECTRIC);

for (let x = 3; x <= 7; x++)
  for (let y = 0; y <= 5; y++)
    for (let z = -7; z <= -3; z++) {
      if (Math.hypot(x - 5, y - 2.5, z + 5) > 1.75) continue;
      block(x, y, z, y >= 3 ? RED : y === 2 ? BLACK : WHITE);
    }