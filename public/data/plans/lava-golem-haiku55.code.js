// lava-golem-haiku55 — prompt:
// a lava golem...

const rnd = (x, y, z) => { const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return n - Math.floor(n); };
const crack = (x, y, z) => Math.abs(Math.sin(x * 0.8 + z * 1.1 + Math.cos(y * 0.5))) < 0.04 || Math.abs(Math.sin(z * 0.9 - x * 0.6 + y * 0.7)) < 0.035;
const rock = (x, y, z) => { const r = rnd(x, y, z); return r < 0.45 ? COBBLE : r < 0.8 ? STONE : OBSIDIAN; };
const skin = (x, y, z) => (crack(x, y, z) ? LAVA : rock(x, y, z));
const solid = id => () => id;
const fill = (x1, y1, z1, x2, y2, z2, pick) => {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++) {
        const b = pick(x, y, z);
        if (b != null) block(x, y, z, b);
      }
};
const ball = (cx, cy, cz, r, pick) => {
  const R = Math.ceil(r);
  for (let x = cx - R; x <= cx + R; x++)
    for (let y = cy - R; y <= cy + R; y++)
      for (let z = cz - R; z <= cz + R; z++) {
        const d = Math.hypot(x - cx, y - cy, z - cz);
        if (d > r) continue;
        const b = pick(x, y, z, d);
        if (b != null) block(x, y, z, b);
      }
};

for (let x = -15; x <= 15; x++) fill(x, 0, 7, x, 2 + Math.floor(rnd(x, 0, 7) * 4), 8, rock);
fill(-14, 0, 8, -12, 11, 9, rock);
fill(12, 0, 8, 14, 9, 9, rock);

fill(-7, 0, -9, 7, 0, -6, (x, y, z) => (Math.abs(x) === 7 || z === -9 || z === -6 ? OBSIDIAN : LAVA));
for (let i = 0; i < 10; i++) {
  const x = Math.round(rnd(i, 7, 1) * 16) - 8;
  block(x, 0, -5, rock(x, 0, -5));
}

fill(-5, 0, -3, -3, 6, 1, skin);
fill(3, 0, -3, 5, 6, 1, skin);
fill(-6, 0, -4, -2, 1, 1, skin);
fill(2, 0, -4, 6, 1, 1, skin);
ball(-4, 5, -2, 1.8, skin);
ball(4, 5, -2, 1.8, skin);

fill(-5, 7, -3, 5, 9, 2, skin);
fill(-5, 7, -4, -3, 9, -4, solid(OBSIDIAN));
fill(3, 7, -4, 5, 9, -4, solid(OBSIDIAN));

fill(-6, 10, -3, 6, 18, 2, skin);
fill(-6, 10, -4, 6, 10, -4, solid(OBSIDIAN));
block(0, 10, -4, GOLD);
fill(-5, 15, -4, -3, 17, -4, solid(OBSIDIAN));
fill(3, 15, -4, 5, 17, -4, solid(OBSIDIAN));

ball(0, 13, -3, 3.6, (x, y, z, d) => (z <= -3 ? (d > 2.7 ? OBSIDIAN : LAVA) : null));
block(0, 13, -5, GLOWSTONE);

fill(-10, 5, -2, -7, 16, 1, skin);
fill(7, 5, -2, 10, 16, 1, skin);
ball(-7, 17, 0, 2.8, skin);
ball(7, 17, 0, 2.8, skin);
line(-8, 20, 0, -9, 23, -1, OBSIDIAN);
line(-7, 20, 1, -7, 23, 1, OBSIDIAN);
line(8, 20, 0, 9, 23, -1, OBSIDIAN);
line(7, 20, 1, 7, 23, 1, OBSIDIAN);
ball(-8.5, 3, -0.5, 2.6, skin);
ball(8.5, 3, -0.5, 2.6, skin);

fill(-4, 19, -3, 4, 24, 2, skin);
ball(-4.5, 21, 0, 1.5, skin);
ball(4.5, 21, 0, 1.5, skin);
fill(-4, 23, -4, -1, 23, -4, solid(OBSIDIAN));
fill(1, 23, -4, 4, 23, -4, solid(OBSIDIAN));
fill(-3, 21, -4, -2, 22, -4, solid(NEON_RED));
fill(2, 21, -4, 3, 22, -4, solid(NEON_RED));
fill(-2, 19, -4, 2, 19, -4, solid(LAVA));
block(-2, 20, -4, OBSIDIAN);
block(0, 20, -4, OBSIDIAN);
block(2, 20, -4, OBSIDIAN);

line(-3, 25, 0, -5, 29, -1, OBSIDIAN);
line(-3, 25, 1, -5, 29, 0, OBSIDIAN);
ball(-5, 29, -1, 1.2, solid(OBSIDIAN));
line(3, 25, 0, 5, 29, -1, OBSIDIAN);
line(3, 25, 1, 5, 29, 0, OBSIDIAN);
ball(5, 29, -1, 1.2, solid(OBSIDIAN));
block(-5, 31, -1, FIRE);
block(5, 31, -1, FIRE);