// bonfire-night-sonnet55 — prompt:
// a Bonfire Night bonfire with fireworks...

const rnd = (() => { let s = 20241105; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; })();
const TAU = Math.PI * 2;
const R = Math.round;

// ---------- site prep ----------
cube(-11, 0, -11, 11, 13, 11, AIR);
disk(0, -1, 0, 11, GRASS);
for (let r = 11; r >= 8; r--) disk(0, -1, 0, r, (r % 2) ? GRASS : GRASS);
disk(0, -1, 0, 6, BLACK);
for (let k = 0; k < 40; k++) {
  const a = rnd() * TAU, r = rnd() * 6;
  block(R(r * Math.cos(a)), -1, R(r * Math.sin(a)), GRAY);
}
// worn dirt path to the fire from the north
cube(-1, -1, -11, 1, -1, -7, DIRT);
// cobble ring
for (let a = 0; a < TAU; a += 0.11) {
  block(R(6 * Math.cos(a)), 0, R(6 * Math.sin(a)), COBBLE);
}
for (let a = 0; a < TAU; a += 0.5) {
  block(R(6 * Math.cos(a)), 1, R(6 * Math.sin(a)), (rnd() < 0.5) ? STONE : COBBLE);
}

// ---------- bonfire stack ----------
const W = [4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1];
for (let i = 0; i < W.length; i++) {
  const w = W[i];
  if (i >= 1 && w >= 2) {
    const c = i < 3 ? RED : (i < 6 ? ORANGE : YELLOW);
    cube(-w + 1, i, -w + 1, w - 1, i, w - 1, c);
  }
}
sphere(0, 3, 0, 1, LAVA);
for (let i = 0; i < W.length; i++) {
  const w = W[i];
  if (i % 2 === 0) {
    for (let z = -w; z <= w; z += 2) {
      line(-w - 1, i, z, w + 1, i, z, ((z + i) % 4 === 0) ? PLANKS : OAK_LOG);
    }
  } else {
    for (let x = -w; x <= w; x += 2) {
      line(x, i, -w - 1, x, i, w + 1, ((x + i) % 4 === 0) ? PLANKS : OAK_LOG);
    }
  }
}
// leaning pallets / planks around the base
for (let k = 0; k < 10; k++) {
  const a = k * TAU / 10 + 0.2;
  const x1 = R(6 * Math.cos(a)), z1 = R(6 * Math.sin(a));
  const x2 = R(3.5 * Math.cos(a)), z2 = R(3.5 * Math.sin(a));
  line(x1, 0, z1, x2, 4, z2, (k % 2) ? PLANKS : OAK_LOG);
}
// scattered branches on the ground
for (let k = 0; k < 14; k++) {
  const a = rnd() * TAU, r = 5 + rnd() * 1.5;
  const x = R(r * Math.cos(a)), z = R(r * Math.sin(a));
  line(x, 0, z, x + R(rnd() * 4 - 2), 0, z + R(rnd() * 4 - 2), OAK_LOG);
}

// flame tongues around the top
for (let k = 0; k < 14; k++) {
  const a = k * TAU / 14;
  const rad = 2 + (k % 3 === 0 ? 1 : 0);
  const h = 3 + ((k * 7) % 5);
  for (let j = 0; j <= h; j++) {
    const c = j < h * 0.4 ? RED : (j < h * 0.75 ? ORANGE : YELLOW);
    block(R(rad * Math.cos(a)), 10 + j, R(rad * Math.sin(a)), c);
  }
}
// flames licking the sides
for (let k = 0; k < 14; k++) {
  const a = k * TAU / 14 + 0.2;
  const i = 3 + (k % 5);
  const r = W[i] + 1;
  const x = R(r * Math.cos(a)), z = R(r * Math.sin(a));
  const x2 = R((r + 1) * Math.cos(a)), z2 = R((r + 1) * Math.sin(a));
  block(x, i, z, ORANGE);
  block(x2, i + 1, z2, YELLOW);
  block(x2, i + 2, z2, ORANGE);
}
// FIRE effect cells (~30)
for (const i of [1, 3, 5, 7, 9]) {
  for (const [sx, sz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    block(sx * (W[i] + 1), i, sz * (W[i] + 1), FIRE);
  }
}
for (const [x, y, z] of [[-2, 11, -1], [2, 11, -1], [-2, 11, 1], [2, 11, 1], [0, 11, -2], [0, 11, 2], [-2, 13, 0], [2, 13, 0]]) {
  block(x, y, z, FIRE);
}
// embers at the base
for (let k = 0; k < 24; k++) {
  const a = rnd() * TAU, r = 4 + rnd() * 2.5;
  block(R(r * Math.cos(a)), 0, R(r * Math.sin(a)), rnd() < 0.5 ? ORANGE : RED);
}

// ---------- the Guy on top ----------
line(0, 10, 0, 0, 16, 0, OAK_LOG);
cube(-1, 11, -1, -1, 12, 0, BLUE);
cube(1, 11, -1, 1, 12, 0, BLUE);
cube(-1, 13, -1, 1, 15, 0, RED);
block(0, 14, -2, YELLOW); block(0, 13, -2, YELLOW);
line(-2, 15, 0, -5, 13, 0, YELLOW);
line(2, 15, 0, 5, 17, 0, YELLOW);
block(-5, 12, 0, YELLOW); block(5, 18, 0, YELLOW);
cube(-1, 16, -1, 1, 18, 1, SAND);
block(-1, 17, -2, BLACK); block(1, 17, -2, BLACK);
block(0, 16, -2, RED);
cube(-2, 19, -2, 2, 19, 2, BLACK);
cube(-1, 20, -1, 1, 22, 1, BLACK);
cube(-1, 20, -2, 1, 20, -2, PURPLE);
block(0, 20, -2, GOLD);
// sparks flung from the bonfire
for (let k = 0; k < 18; k++) {
  const x = R(rnd() * 10 - 5), z = R(rnd() * 10 - 5), y = 14 + R(rnd() * 8);
  block(x, y, z, rnd() < 0.5 ? ORANGE : YELLOW);
}

// ---------- safety fence ----------
let idx = 0;
for (let a = 0; a < TAU; a += 0.08) {
  const x = R(8 * Math.cos(a)), z = R(8 * Math.sin(a));
  block(x, 1, z, PLANKS);
  if (idx % 6 === 0) { block(x, 0, z, OAK_LOG); block(x, 2, z, OAK_LOG); }
  idx++;
}

// ---------- hot chocolate stall (east) ----------
cube(8, 0, 3, 11, 1, 3, PLANKS);
cube(8, 2, 3, 11, 2, 3, OAK_LOG);
cube(8, 0, 7, 11, 3, 7, PLANKS);
cube(8, 0, 3, 8, 3, 7, PLANKS);
cube(11, 0, 3, 11, 3, 7, PLANKS);
cube(8, 0, 4, 8, 3, 6, AIR);
cube(11, 0, 4, 11, 3, 6, AIR);
for (const [x, z] of [[8, 3], [11, 3], [8, 7], [11, 7]]) cube(x, 0, z, x, 4, z, OAK_LOG);
for (let x = 8; x <= 11; x++) {
  const c = (x % 2) ? RED : WHITE;
  cube(x, 4, 3, x, 4, 7, c);
  block(x, 3, 2, c);
}
block(9, 3, 5, GLOWSTONE); block(10, 3, 5, GLOWSTONE);
for (let x = 8; x <= 11; x++) block(x, 3, 3, (x % 2) ? BROWN : WHITE);
cube(9, 0, 5, 10, 1, 5, BROWN);
cube(9, 0, 6, 10, 1, 6, BROWN);

// ---------- spectators ----------
function person(x, z, shirt, pants, hat, skin, spark) {
  cube(x, 0, z, x + 1, 1, z + 1, pants);
  cube(x, 2, z, x + 1, 3, z + 1, shirt);
  cube(x, 4, z, x + 1, 5, z + 1, skin);
  cube(x, 6, z, x + 1, 6, z + 1, hat);
  block(x, 7, z, hat);
  block(x + 2, 2, z, shirt);
  if (spark) {
    block(x - 1, 3, z, shirt); block(x - 1, 4, z, shirt);
    block(x - 1, 5, z, GLOWSTONE); block(x - 1, 6, z, YELLOW);
  } else {
    block(x - 1, 2, z, shirt);
  }
}
person(-7, -9, BLUE, GRAY, RED, PINK, true);
person(-5, -10, GREEN, BLUE, YELLOW, SAND, false);
person(3, -9, PURPLE, BLACK, WHITE, BROWN, false);
person(5, -10, ORANGE, BLUE, BLACK, PINK, true);
person(-10, 1, RED, BLACK, CYAN, SAND, false);
person(-10, 4, MAGENTA, GRAY, PINK, BROWN, true);
person(-5, 9, YELLOW, BLUE, GREEN, PINK, true);
person(-2, 10, LIGHT_BLUE, BLACK, ORANGE, SAND, false);
person(3, 9, WHITE, GRAY, RED, BROWN, false);
person(9, 5, WHITE, BLACK, WHITE, SAND, false); // stall vendor
// two kids (smaller)
cube(-3, 0, -10, -3, 0, -10, BLUE); cube(-3, 1, -10, -3, 1, -10, RED);
block(-3, 2, -10, PINK); block(-3, 3, -10, YELLOW); block(-4, 2, -10, GLOWSTONE);
cube(0, 0, -10, 0, 0, -10, GRAY); cube(0, 1, -10, 0, 1, -10, GREEN);
block(0, 2, -10, SAND); block(0, 3, -10, PURPLE); block(1, 2, -10, GLOWSTONE);
// hay bales
cube(-11, 0, -8, -10, 1, -7, YELLOW);
cube(-11, 0, -6, -10, 0, -5, YELLOW);
cube(8, 0, -9, 9, 1, -8, YELLOW);

// ---------- rockets on launch bottles ----------
function rocket(bx, bz, hy, lean) {
  block(bx, 0, bz, GLASS); block(bx, 1, bz, GREEN);
  for (let t = 2; t < hy; t++) {
    const x = R(bx + lean * t);
    if (t % 3 !== 0) block(x, t, bz, (t % 2) ? ORANGE : YELLOW);
    if (t > hy - 5) block(x, t, bz, OAK_LOG);
  }
  const hx = R(bx + lean * hy);
  cube(hx, hy, bz, hx, hy + 2, bz, RED);
  block(hx, hy + 3, bz, WHITE);
  block(hx, hy - 6, bz, GLOWSTONE);
}
rocket(-10, -4, 13, -0.25);
rocket(10, -5, 11, 0.2);
rocket(-9, 8, 10, 0.2);

// ---------- Catherine wheel on a post ----------
cube(-8, 0, -3, -8, 7, -3, OAK_LOG);
const wc = [-8, 9, -4];
for (let a = 0; a < TAU; a += 0.22) {
  const x = R(wc[0] + 3 * Math.cos(a)), y = R(wc[1] + 3 * Math.sin(a));
  block(x, y, wc[2], (R(a / 0.22) % 2) ? RED : YELLOW);
}
for (let k = 0; k < 4; k++) {
  const a = k * TAU / 4 + 0.4;
  line(wc[0], wc[1], wc[2], R(wc[0] + 3 * Math.cos(a)), R(wc[1] + 3 * Math.sin(a)), wc[2], ORANGE);
}
block(wc[0], wc[1], wc[2] - 1, GOLD);
for (let k = 0; k < 14; k++) {
  const a = 0.4 + k * 0.28;
  const r = 4 + k * 0.3;
  block(R(wc[0] + r * Math.cos(a)), R(wc[1] + r * Math.sin(a)), wc[2] - 1, k % 2 ? GLOWSTONE : YELLOW);
}

// ---------- firework bursts ----------
function burst(cx, cy, cz, r, c1, c2, n, willow) {
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < n; k++) {
    const yy = 1 - 2 * (k + 0.5) / n;
    const rr = Math.sqrt(1 - yy * yy);
    const th = k * ga;
    const dx = rr * Math.cos(th), dy = yy, dz = rr * Math.sin(th);
    for (let t = Math.floor(r * 0.35); t <= r; t++) {
      const tip = t >= r - 1;
      if (t % 2 === 0 || tip) {
        block(R(cx + dx * t), R(cy + dy * t), R(cz + dz * t), tip ? c2 : c1);
      }
    }
    if (willow) {
      const tx = R(cx + dx * r), ty = R(cy + dy * r), tz = R(cz + dz * r);
      for (let d = 1; d <= 4; d++) block(tx, ty - d, tz, d % 2 ? GOLD : YELLOW);
    }
  }
  sphere(cx, cy, cz, 1, GLOWSTONE);
}
burst(0, 27, 2, 6, RED, ORANGE, 44, false);
burst(-13, 23, -1, 5, BLUE, CYAN, 36, false);
burst(13, 24, 0, 5, GREEN, LIME, 36, false);
burst(-6, 18, 6, 4, MAGENTA, PURPLE, 28, false);
burst(8, 18, 7, 4, YELLOW, WHITE, 26, true);
burst(-18, 17, 3, 3, PINK, WHITE, 20, false);
burst(18, 16, 4, 3, LIGHT_BLUE, WHITE, 20, false);

// ---------- stray stars in the sky ----------
const sc = [RED, YELLOW, WHITE, CYAN, LIME, MAGENTA, ORANGE, GLOWSTONE];
for (let k = 0; k < 70; k++) {
  const x = R(rnd() * 40 - 20), y = 14 + R(rnd() * 19), z = R(rnd() * 14 - 8);
  block(x, y, z, sc[k % sc.length]);
}
// a few falling glitter trails
for (const [x, z, y] of [[-16, 0, 21], [5, -3, 24], [16, 2, 20], [-3, 4, 14]]) {
  for (let d = 0; d < 5; d++) block(x, y - d, z, d % 2 ? GOLD : YELLOW);
}