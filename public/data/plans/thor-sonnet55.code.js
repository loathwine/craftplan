// thor-sonnet55 — prompt:
// Thor summoning lightning...

let seed = 11;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const R = Math.round;

// ---- clear trees from the stage
cylinder(0, 2, 0, 10, 14, AIR);

// ---- rocky mountaintop
function pdisk(y, r, ids) {
  for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) {
    if (x * x + z * z <= r * r + 1) block(x, y, z, pick(ids));
  }
}
pdisk(-1, 10, [STONE, COBBLE, GRAY]);
pdisk(0, 8, [STONE, COBBLE, STONE, LIGHT_GRAY]);
pdisk(1, 6, [OBSIDIAN, GRAY, STONE, OBSIDIAN]);

// jagged rock spires around the rim
for (let i = 0; i < 16; i++) {
  const a = (i / 16) * Math.PI * 2 + rnd() * 0.3;
  const r = 8 + rnd() * 3;
  const x = R(Math.cos(a) * r), z = R(Math.sin(a) * r);
  const h = 2 + Math.floor(rnd() * 4) + (z > 2 ? 2 : 0);
  cube(x, 0, z, x + 1, 1, z + 1, STONE);
  for (let k = 2; k <= h; k++) block(x + (k % 2), k, z, pick([STONE, COBBLE, GRAY]));
}

// rune ring + gold studs
for (let d = 0; d < 360; d += 7) {
  const t = d * Math.PI / 180;
  block(R(Math.cos(t) * 5.3), 1, R(Math.sin(t) * 5.3), (d / 7) % 2 ? NEON_BLUE : CYAN);
}
for (let d = 0; d < 360; d += 30) {
  const t = d * Math.PI / 180;
  block(R(Math.cos(t) * 7.2), 0, R(Math.sin(t) * 7.2), GOLD);
}

// ---- THOR (faces -Z)
// boots + legs
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -3 : 1, x2 = s < 0 ? -1 : 3;
  cube(x1, 2, -2, x2, 3, 1, BROWN);
  cube(x1, 4, -1, x2, 5, 1, IRON);
  cube(x1, 6, -1, x2, 7, 1, GRAY);
  cube(x1, 4, -2, x2, 4, -2, GOLD);
  cube(x1, 3, -2, x2, 3, -2, BLACK);
}
// belt
cube(-4, 8, -2, 4, 8, 2, BROWN);
cube(-1, 8, -3, 1, 8, -3, GOLD);
// torso
hollowCube(-4, 9, -2, 4, 15, 2, GRAY);
cube(-3, 10, -3, 3, 14, -3, BLACK);
cube(-3, 12, -3, -2, 13, -3, IRON);
cube(2, 12, -3, 3, 13, -3, IRON);
cube(-1, 12, -3, 1, 13, -3, GRAY);
block(0, 12, -3, GOLD); block(0, 13, -3, GOLD);
cube(-3, 10, -3, 3, 10, -3, IRON);
cube(-4, 15, -2, 4, 15, 2, BLACK);
for (let x = -3; x <= 3; x += 2) block(x, 11, -4, IRON);
// pauldrons
sphere(-6, 15, 0, 2.4, IRON);
sphere(6, 15, 0, 2.4, IRON);
// neck + head
cube(-1, 16, -1, 1, 16, 1, SAND);
cube(-2, 17, -2, 2, 21, 2, SAND);
// hair
cube(-3, 22, -3, 3, 23, 3, YELLOW);
cube(-3, 18, -2, -3, 22, 2, YELLOW);
cube(3, 18, -2, 3, 22, 2, YELLOW);
cube(-3, 14, 2, 3, 21, 3, YELLOW);
cube(-2, 22, -3, 2, 22, -3, YELLOW);
block(-1, 21, -3, YELLOW); block(1, 21, -3, YELLOW);
// face
block(-1, 19, -3, NEON_BLUE); block(1, 19, -3, NEON_BLUE);
cube(-2, 20, -3, -1, 20, -3, ORANGE); cube(1, 20, -3, 2, 20, -3, ORANGE);
block(0, 18, -3, SAND); block(0, 19, -3, SAND);
cube(-2, 17, -3, 2, 17, -3, YELLOW);
cube(-1, 16, -3, 1, 16, -3, YELLOW);
cube(-2, 18, -3, -2, 18, -3, YELLOW); cube(2, 18, -3, 2, 18, -3, YELLOW);
block(0, 18, -4, SAND);
// left arm (west): hangs, fist crackling
cube(-7, 11, -1, -6, 14, 1, GRAY);
cube(-8, 8, -2, -7, 11, 0, IRON);
cube(-8, 6, -3, -7, 7, -1, SAND);
cube(-8, 8, -2, -7, 8, 0, GOLD);
// right arm raised: shoulder -> hammer
cube(7, 15, -1, 8, 19, 1, GRAY);
cube(7, 19, -1, 8, 21, 1, IRON);
cube(7, 22, -1, 9, 23, 1, SAND);
// cape
for (let y = 3; y <= 15; y++) {
  const t = 15 - y;
  const zEnd = 3 + (t > 5 ? 1 : 0) + (t > 9 ? 1 : 0);
  const xl = -(5 + (t > 7 ? 1 : 0));
  const xr = 5 + Math.floor(t / 2);
  for (let z = 3; z <= zEnd; z++) {
    if (y <= 4 && (z + y) % 2) continue;
    cube(xl, y, z, xr, y, z, RED);
  }
}
cube(-5, 15, 2, 5, 15, 2, RED);
cube(-5, 14, 2, 5, 14, 2, RED);
block(-3, 14, -3, GOLD); block(3, 14, -3, GOLD);
cube(-3, 15, -3, 3, 15, -3, RED);

// ---- MJOLNIR
line(8, 17, 0, 8, 24, 0, BROWN);
block(8, 20, -1, GOLD); block(8, 18, -1, GOLD);
cube(5, 24, -2, 11, 27, 2, IRON);
cube(4, 24, -2, 4, 27, 2, GRAY);
cube(12, 24, -2, 12, 27, 2, GRAY);
cube(3, 25, -1, 3, 26, 1, BLACK);
cube(13, 25, -1, 13, 26, 1, BLACK);
cube(5, 24, -3, 11, 24, -3, GOLD);
cube(5, 27, -3, 11, 27, -3, GOLD);
cube(7, 25, -3, 9, 26, -3, OBSIDIAN);
block(8, 25, -4, GOLD);
cube(6, 28, -1, 10, 28, 1, GRAY);

// ---- STORM
function cloud(cx, cy, cz, rx, ry, rz) {
  for (let dx = -rx; dx <= rx; dx++) for (let dy = -ry; dy <= ry; dy++) for (let dz = -rz; dz <= rz; dz++) {
    const d = (dx / rx) ** 2 + (dy / ry) ** 2 + (dz / rz) ** 2;
    const y = cy + dy;
    if (d > 1 || d < 0.55 || y > 33) continue;
    const n = rnd();
    const id = dy < 0 ? (n < 0.55 ? BLACK : GRAY) : (n < 0.5 ? GRAY : n < 0.8 ? LIGHT_GRAY : BLACK);
    block(cx + dx, y, cz + dz, id);
  }
}
cloud(-14, 31, 2, 6, 2, 5);
cloud(-4, 31, 6, 6, 2, 5);
cloud(6, 31, 2, 6, 2, 5);
cloud(16, 31, 0, 6, 2, 5);
for (let i = 0; i < 8; i++) {
  const x = R(-20 + rnd() * 40), z = R(-6 + rnd() * 14);
  sphere(x, 31 + R(rnd() * 2), z, 2, pick([GRAY, BLACK, LIGHT_GRAY]));
}

// ---- LIGHTNING
function jag(pts, id) {
  for (let i = 0; i < pts.length - 1; i++) line(...pts[i], ...pts[i + 1], id);
}
jag([[8, 28, -1], [10, 30, -1], [7, 31, -1], [9, 33, -1]], NEON_BLUE);
jag([[8, 28, 0], [9, 30, 0], [6, 32, 0]], GLOWSTONE);
jag([[10, 30, -1], [14, 30, -2], [15, 27, -2], [18, 25, -2]], NEON_BLUE);
jag([[7, 31, -1], [3, 30, -2], [1, 28, -2]], NEON_BLUE);
jag([[-13, 33, -8], [-15, 28, -8], [-12, 22, -8], [-14, 15, -8], [-12, 8, -8], [-14, 1, -8]], NEON_BLUE);
jag([[17, 33, -7], [15, 27, -7], [18, 20, -7], [16, 12, -7], [18, 5, -7], [16, 1, -7]], NEON_BLUE);
disk(-14, 0, -8, 2, BLACK);
disk(16, 0, -7, 2, BLACK);
block(-13, 1, -8, FIRE); block(-15, 1, -7, FIRE); block(17, 1, -7, FIRE); block(15, 1, -6, FIRE);
// electric
block(5, 29, -1, ELECTRIC); block(11, 29, -1, ELECTRIC); block(8, 29, -2, ELECTRIC);
block(-8, 8, -3, ELECTRIC);
block(-14, 2, -8, ELECTRIC); block(16, 2, -7, ELECTRIC);
block(12, 32, -3, ELECTRIC); block(-5, 30, -3, ELECTRIC);