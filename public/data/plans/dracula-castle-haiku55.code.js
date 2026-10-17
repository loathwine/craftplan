// dracula-castle-haiku55 — prompt:
// Dracula's castle on a cliff...

const CAP = 3900;
let used = 0;
const put = (x, y, z, id) => {
  if (id !== AIR) {
    if (used >= CAP) return;
    used++;
  }
  block(x, y, z, id);
};
const box = (x1, y1, z1, x2, y2, z2, id) => {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
};
const hash = (a, b) => {
  const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return s - Math.floor(s);
};
const rock = (x, y, z) => {
  const h = hash(x * 1.7 + y * 0.31, z * 2.13 - y * 0.7);
  return h < 0.18 ? COBBLE : h > 0.93 ? GRAY : STONE;
};
const shell = (x1, z1, x2, z2, y1, y2) => {
  for (let x = x1; x <= x2; x++)
    for (let z = z1; z <= z2; z++)
      if (x === x1 || x === x2 || z === z1 || z === z2)
        for (let y = y1; y <= y2; y++) put(x, y, z, rock(x, y, z));
};
const roof = (cx, cz, y, r) => {
  for (let k = 0; k <= r; k++)
    box(cx - r + k, y + k, cz - r + k, cx + r - k, y + k, cz + r - k, OBSIDIAN);
};
const tower = (cx, cz, top) => {
  box(cx - 1, 8, cz - 1, cx + 1, top, cz + 1, COBBLE);
  box(cx, 16, cz - 1, cx, 18, cz - 1, AIR);
  roof(cx, cz, top + 1, 2);
  put(cx, top + 4, cz, GOLD);
};
const bat = (x, y, z) => {
  put(x, y, z, BLACK);
  put(x - 1, y + 1, z, BLACK);
  put(x + 1, y + 1, z, BLACK);
  put(x - 2, y + 2, z, BLACK);
  put(x + 2, y + 2, z, BLACK);
};

const TOP = 10;
for (let x = -8; x <= 8; x++)
  for (let z = 0; z <= 8; z++) {
    const jag = x === -8 || x === 8 || z === 8;
    const h = jag ? TOP - Math.floor(hash(x, z) * 4) : TOP;
    for (let y = 0; y < h; y++) put(x, y, z, rock(x, y, z));
    put(x, h, z, COBBLE);
  }

box(-2, 0, 0, 2, 2, 3, AIR);
put(0, 0, 1, LAVA);
put(-1, 0, 2, LAVA);
put(1, 2, 1, GLOWSTONE);
put(-1, 2, 2, GLOWSTONE);

shell(-7, 1, 7, 7, 11, 14);
for (let x = -7; x <= 7; x++)
  for (let z = 1; z <= 7; z++)
    if ((x === -7 || x === 7 || z === 1 || z === 7) && (x + z) % 2 === 0) put(x, 15, z, STONE);
box(-1, 11, 1, 1, 13, 1, AIR);
put(0, 13, 1, GLOWSTONE);
for (const x of [-5, 5]) box(x, 11, 0, x, 13, 0, RED);

tower(-7, 1, 24);
tower(7, 1, 24);
tower(-7, 7, 18);
tower(7, 7, 18);

shell(-3, 3, 3, 6, 11, 28);
box(-2, 18, 4, 2, 18, 5, STONE);
box(-2, 24, 4, 2, 24, 5, STONE);
box(-3, 29, 3, 3, 29, 6, OBSIDIAN);
box(0, 11, 3, 0, 13, 3, AIR);
for (const y of [15, 21]) for (const x of [-2, 0, 2]) box(x, y, 3, x, y + 2, 3, AIR);
put(0, 16, 4, NEON_RED);
put(0, 22, 4, NEON_RED);
for (let x = -3; x <= 3; x++)
  for (let z = 3; z <= 6; z++)
    if ((x === -3 || x === 3 || z === 3 || z === 6) && (x + z) % 2 === 0) put(x, 30, z, STONE);
box(-1, 30, 3, 1, 30, 5, OBSIDIAN);
box(0, 31, 3, 0, 31, 5, OBSIDIAN);
box(-1, 31, 4, 1, 31, 4, OBSIDIAN);
put(0, 32, 4, OBSIDIAN);
put(0, 33, 4, GOLD);

for (const x1 of [-6, 4]) {
  box(x1, 11, 3, x1 + 2, 15, 5, COBBLE);
  roof(x1 + 1, 4, 16, 1);
}

bat(-13, 24, -6);
bat(12, 27, -4);
bat(-9, 31, -2);
bat(15, 21, 3);
bat(-17, 17, 2);