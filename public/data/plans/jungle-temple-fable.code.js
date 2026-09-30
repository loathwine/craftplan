// jungle-temple-fable — prompt:
// a jungle temple with a waterfall...

const rndState = { s: 12345 };
function rnd() { rndState.s = (rndState.s * 1103515245 + 12345) % 2147483648; return rndState.s / 2147483648; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }
function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }

// clear jungle canopy over the temple footprint and forecourt
cube(-11, 0, -13, 11, 8, 18, AIR);

// ---------- terraced pyramid ----------
function tier(x1, z1, x2, z2, y0, h, inset) {
  const yt = y0 + h - 1;
  cube(x1, y0, z1, x2, yt, z1, STONE);
  cube(x1, y0, z2, x2, yt, z2, STONE);
  cube(x1, y0, z1, x1, yt, z2, STONE);
  cube(x2, y0, z1, x2, yt, z2, STONE);
  cube(x1, yt, z1, x2, yt, z1 + inset - 1, COBBLE);
  cube(x1, yt, z2 - inset + 1, x2, yt, z2, COBBLE);
  cube(x1, yt, z1, x1 + inset - 1, yt, z2, COBBLE);
  cube(x2 - inset + 1, yt, z1, x2, yt, z2, COBBLE);
  // cornice lip
  cube(x1 - 1, yt, z1 - 1, x2 + 1, yt, z1 - 1, COBBLE);
  cube(x1 - 1, yt, z1 - 1, x1 - 1, yt, z2 + 1, COBBLE);
  cube(x2 + 1, yt, z1 - 1, x2 + 1, yt, z2 + 1, COBBLE);
  cube(x1 - 1, yt, z2 + 1, x2 + 1, yt, z2 + 1, COBBLE);
  // weathering on north + west/east faces
  for (let x = x1; x <= x2; x++) for (let y = y0; y < yt; y++) {
    if (rnd() < 0.28) block(x, y, z1, pick([GREEN, LIME, COBBLE, LEAVES, COBBLE]));
  }
  for (let z = z1; z <= z2; z++) for (let y = y0; y < yt; y++) {
    if (rnd() < 0.22) block(x1, y, z, pick([GREEN, COBBLE, LEAVES]));
    if (rnd() < 0.22) block(x2, y, z, pick([GREEN, COBBLE, LEAVES]));
  }
  // moss on the top ring
  for (let x = x1; x <= x2; x++) for (let z = z1; z <= z2; z++) {
    const onRing = (x < x1 + inset || x > x2 - inset || z < z1 + inset || z > z2 - inset);
    if (onRing && rnd() < 0.12) block(x, yt, z, pick([GREEN, LIME, GRASS]));
  }
}
tier(-10, 0, 10, 18, 0, 4, 3);
tier(-7, 3, 7, 15, 4, 4, 3);
tier(-4, 6, 4, 12, 8, 4, 9);

// dark niches carved in the faces
cube(-7, 1, 0, -7, 2, 0, BLACK);
cube(8, 1, 0, 8, 2, 0, BLACK);
cube(-5, 5, 3, -5, 6, 3, BLACK);
cube(-9, 1, 0, -9, 1, 0, GOLD);
cube(9, 1, 0, 9, 1, 0, GOLD);

// ---------- grand staircase (north face, 45 degrees) ----------
for (let k = 0; k <= 11; k++) {
  const z = -4 + k;
  cube(-2, 0, z, 2, k, z, STONE);
  cube(-3, Math.max(0, k - 1), z, -3, k + 1, z, COBBLE);
  cube(3, Math.max(0, k - 1), z, 3, k + 1, z, COBBLE);
  if (k % 3 === 1) { block(-3, k + 1, z, GREEN); }
  if (k % 4 === 2) { block(ri(-2, 2), k, z, COBBLE); }
}

// serpent guardian west of stair base
cube(-7, 0, -5, -5, 1, -2, STONE);
cube(-6, 2, -5, -6, 3, -5, STONE);
block(-6, 3, -6, COBBLE);
block(-7, 3, -6, NEON_RED);
block(-5, 3, -6, NEON_RED);
cube(-7, 0, -1, -5, 0, 2, COBBLE);

// ---------- shrine on the summit ----------
cube(-3, 12, 7, -3, 15, 7, STONE);
cube(3, 12, 7, 3, 15, 7, STONE);
cube(-3, 12, 11, -3, 15, 11, STONE);
cube(3, 12, 11, 3, 15, 11, STONE);
cube(-4, 16, 6, 4, 16, 12, COBBLE);
cube(-3, 17, 7, 3, 17, 11, STONE);
cube(-2, 18, 8, 2, 18, 10, COBBLE);
cube(-1, 19, 9, 1, 19, 9, STONE);
block(0, 20, 9, GOLD);
cube(-4, 16, 6, 4, 16, 6, GREEN);
block(-4, 16, 6, COBBLE); block(4, 16, 6, COBBLE); block(0, 16, 6, GOLD);
// gold idol
cube(-1, 12, 9, 1, 12, 10, COBBLE);
cube(-1, 13, 9, 1, 15, 10, GOLD);
block(-1, 15, 8, NEON_RED);
block(1, 15, 8, NEON_RED);
block(0, 14, 8, GOLD);
// braziers
const braziers = [[-4, 12, 6], [4, 12, 6], [-4, 12, 12], [4, 12, 12], [-9, 0, -7], [3, 1, -11]];
for (const [bx, by, bz] of braziers) { block(bx, by, bz, COBBLE); block(bx, by + 1, bz, FIRE); }

// ---------- waterfall system ----------
// summit spring channel (east)
cube(2, 12, 8, 4, 12, 8, COBBLE);
cube(2, 12, 10, 4, 12, 10, COBBLE);
cube(2, 12, 9, 5, 12, 9, WATER);
// fall to tier 2 top
cube(5, 8, 9, 5, 11, 9, WATER);
// tier 2 channel running north
cube(4, 8, 3, 4, 8, 5, COBBLE);
cube(7, 8, 3, 7, 8, 9, COBBLE);
cube(5, 8, 3, 6, 8, 9, WATER);
// fall over tier 2 face
cube(5, 4, 2, 6, 7, 2, WATER);
cube(4, 4, 2, 4, 4, 2, COBBLE);
cube(7, 4, 2, 7, 4, 2, COBBLE);
// tier 1 channel
cube(4, 4, 0, 4, 4, 1, COBBLE);
cube(7, 4, 0, 7, 4, 1, COBBLE);
cube(5, 4, 0, 6, 4, 2, WATER);
// big fall into the pool
cube(5, 0, -1, 6, 3, -1, WATER);
cube(4, 0, -1, 4, 3, -1, LEAVES);
cube(7, 0, -1, 7, 3, -1, LEAVES);
// plunge pool
cube(3, -3, -9, 11, -3, -2, STONE);
cube(2, -2, -10, 12, 0, -1, COBBLE);
cube(3, -2, -9, 11, -1, -2, WATER);
cube(3, 0, -9, 11, 0, -2, AIR);
cube(5, 0, -1, 6, 0, -1, WATER);
cube(5, -1, -3, 6, -1, -2, WHITE);
cube(4, -1, -2, 4, -1, -2, LIGHT_BLUE);
cube(7, -1, -2, 7, -1, -2, LIGHT_BLUE);
cube(4, -1, -4, 7, -1, -4, LIGHT_BLUE);
// mossy rim stones + lily pads
for (let i = 0; i < 12; i++) {
  const x = ri(2, 12), z = pick([-10, -1]);
  block(x, 0, z, pick([GREEN, GRASS, LEAVES]));
}
for (let i = 0; i < 6; i++) block(ri(4, 10), -1, ri(-8, -5), LIME);
// outflow stream from pool toward north-east
line(12, -1, -6, 18, -1, -12, WATER);
line(13, -1, -6, 19, -1, -12, WATER);

// ---------- vines hanging over the terraces ----------
function vines(x1, x2, z, yTop, n) {
  for (let i = 0; i < n; i++) {
    const x = ri(x1, x2), len = ri(1, 4);
    cube(x, yTop - len, z, x, yTop, z, LEAVES);
  }
}
vines(-10, 3, -1, 3, 9);
vines(8, 10, -1, 3, 2);
vines(-7, 3, 2, 7, 6);
vines(-4, 4, 5, 11, 4);
for (let i = 0; i < 6; i++) { const z = ri(0, 18), len = ri(1, 4); cube(-11, 3 - len, z, -11, 3, z, LEAVES); }
for (let i = 0; i < 6; i++) { const z = ri(0, 18), len = ri(1, 4); cube(11, 3 - len, z, 11, 3, z, LEAVES); }
// roof creeper on the shrine
cube(-4, 17, 6, -4, 17, 8, LEAVES);
cube(4, 17, 10, 4, 17, 12, LEAVES);
block(-4, 16, 13, LEAVES); block(3, 16, 13, LEAVES);

// ---------- forecourt path + ruins ----------
cube(-2, -1, -14, 2, -1, -5, COBBLE);
for (let i = 0; i < 14; i++) block(ri(-2, 2), -1, ri(-14, -5), pick([GRASS, SAND, GREEN, STONE]));
cylinder(-12, 0, -6, 1, 5, STONE);
block(-12, 5, -6, COBBLE);
cylinder(-9, 0, -11, 1, 2, COBBLE);
line(-10, 0, -8, -16, 0, -12, COBBLE);
line(-10, 1, -8, -13, 1, -10, STONE);
cube(-15, 0, -5, -14, 0, -4, COBBLE);
block(-15, 1, -5, GREEN);
cylinder(14, 0, 4, 1, 4, STONE);
cube(13, 0, 2, 15, 0, 2, COBBLE);

// ---------- jungle trees ----------
function jungleTree(x, z, h, r) {
  cube(x, -1, z, x, h, z, OAK_LOG);
  cube(x + 1, -1, z, x + 1, 1, z, OAK_LOG);
  cube(x - 1, -1, z, x - 1, 0, z, OAK_LOG);
  cube(x, -1, z + 1, x, 1, z + 1, OAK_LOG);
  sphere(x, h + 1, z, r, LEAVES);
  sphere(x + ri(-2, 2), h + 2, z + ri(-2, 2), r - 1, LEAVES);
  cube(x + ri(-r, r), h - 1, z + ri(-r, r), x, h + 1, z, LEAVES);
  for (let i = 0; i < 5; i++) {
    const vx = x + ri(-r, r), vz = z + ri(-r, r), len = ri(2, 5);
    cube(vx, h - r - len, vz, vx, h - r + 1, vz, LEAVES);
  }
  block(x, h + r + 2, z, LEAVES);
}
jungleTree(-17, -9, 11, 4);
jungleTree(15, -8, 13, 4);
jungleTree(-16, 10, 9, 3);
jungleTree(18, 13, 12, 3);
jungleTree(-19, 1, 14, 4);
jungleTree(19, -1, 10, 3);

// ground cover flowers / ferns around the forecourt
for (let i = 0; i < 40; i++) {
  const x = ri(-20, 20), z = ri(-16, -2);
  if (x >= -3 && x <= 12 && z >= -14) continue;
  block(x, 0, z, pick([LEAVES, LEAVES, LIME, GREEN, YELLOW, PINK]));
}