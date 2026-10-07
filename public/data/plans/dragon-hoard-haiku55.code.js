// dragon-hoard-haiku55 — prompt:
// a dragon sleeping on a pile of gold...

const M = new Map();
const put = (x, y, z, id) => M.set(x + '|' + y + '|' + z, [x, y, z, id]);
const has = (x, y, z) => M.has(x + '|' + y + '|' + z);
const hash = (x, y, z, s) => { const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + s * 19.19) * 43758.5453; return v - Math.floor(v); };
const ell = (cx, cy, cz, rx, ry, rz, id) => {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
  for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
    const a = (x - cx) / rx, b = (y - cy) / ry, c = (z - cz) / rz;
    if (a * a + b * b + c * c <= 1) put(x, y, z, id);
  }
};
const chain = (pts, id) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay, az, ar] = pts[i], [bx, by, bz, br] = pts[i + 1];
    for (let s = 0; s <= 10; s++) {
      const t = s / 10, r = ar + (br - ar) * t;
      ell(ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t, r, r, r, id);
    }
  }
};

cube(-12, 0, -18, 12, 12, 13, AIR);

for (let x = -12; x <= 12; x++) for (let y = 0; y <= 8; y++) for (let z = -9; z <= 12; z++) {
  const a = x / 12, b = y / 8, c = (z - 2) / 10;
  if (a * a + b * b + c * c <= 1) put(x, y, z, hash(x, y, z, 1) < 0.14 ? YELLOW : GOLD);
}

const gems = [CYAN, BLUE, GREEN, PINK];
[...M.values()].forEach(([x, y, z, id]) => {
  if ((id === GOLD || id === YELLOW) && !has(x, y + 1, z) && hash(x, y, z, 2) < 0.03)
    put(x, y, z, gems[Math.floor(hash(x, y, z, 3) * gems.length)]);
});

for (let x = -14; x <= 14; x++) for (let z = -12; z <= 15; z++) {
  const a = x / 12, c = (z - 2) / 10, d = a * a + c * c;
  if (d > 1 && d < 1.8 && hash(x, 0, z, 4) < 0.1) put(x, 0, z, hash(x, 0, z, 5) < 0.5 ? GOLD : YELLOW);
}

ell(0, 9, 2, 4.5, 3.5, 5.5, RED);
ell(0, 8.5, -3, 4, 3.5, 2.5, RED);
ell(0, 7.5, 6.5, 5, 4, 3.5, RED);
ell(-3.2, 1.2, 9.5, 1.4, 1.2, 2, RED);
ell(3.2, 1.2, 9.5, 1.4, 1.2, 2, RED);
ell(-2.5, 3, -7.5, 1.3, 2.2, 1.8, RED);
ell(2.5, 3, -7.5, 1.3, 2.2, 1.8, RED);
ell(-2.5, 1.1, -9.2, 1.5, 1.1, 1.9, RED);
ell(2.5, 1.1, -9.2, 1.5, 1.1, 1.9, RED);

chain([[0, 8, -5, 2.6], [0, 6.2, -8, 2.2], [0, 4.6, -10, 2], [0, 2.8, -12.5, 2.6]], RED);
ell(0, 2.8, -12.5, 3.2, 2.6, 3, RED);
ell(0, 2.4, -15.5, 2, 1.8, 2, RED);

chain([[0, 7, 9, 2.6], [1.5, 5, 10.5, 2.3], [4, 3.4, 11.5, 2.1], [7, 2.2, 10.5, 1.9],
       [9.5, 1.3, 7.5, 1.6], [10.5, 1.2, 3.5, 1.4], [9.5, 1.0, 0.5, 1.2]], RED);

ell(-6.2, 8.5, 2, 1.6, 3, 6, PURPLE);
ell(6.2, 8.5, 2, 1.6, 3, 6, PURPLE);
for (let z = -2; z <= 7; z++) { put(-6, 11, z, OBSIDIAN); put(6, 11, z, OBSIDIAN); }

for (const s of [-1, 1]) {
  put(2 * s, 6, -11, OBSIDIAN);
  put(3 * s, 7, -10, OBSIDIAN);
  put(3 * s, 8, -9, OBSIDIAN);
  put(s, 3, -15, BLACK);
  put(2 * s, 3, -14, BLACK);
  put(s, 2, -17, BLACK);
  for (let i = 1; i <= 4; i++) put(s * i, 0, -11, OBSIDIAN);
  for (let i = 2; i <= 4; i++) put(s * i, 0, 11, OBSIDIAN);
}
for (let x = -1; x <= 1; x++) put(x, 1, -16, BLACK);
put(0, 4, -18, FIRE);

for (let z = -7; z <= 12; z += 2) {
  let top = -1;
  for (let y = 0; y <= 14; y++) {
    const e = M.get('0|' + y + '|' + z);
    if (e && e[3] === RED) top = y;
  }
  if (top > 0 && !has(0, top + 1, z)) put(0, top + 1, z, OBSIDIAN);
}

[...M.values()].forEach(e => {
  if (e[3] === RED && hash(e[0], e[1], e[2], 6) < 0.06) e[3] = ORANGE;
});

for (const [x, y, z, id] of M.values()) block(x, y, z, id);