// reindeer-opus — prompt:
// a reindeer with giant antlers...

const pts = (a, b) => { const r = []; for (let i = Math.ceil(a); i <= Math.floor(b); i++) r.push(i); return r; };
function ell(cx, cy, cz, rx, ry, rz, col) {
  for (const x of pts(cx - rx, cx + rx))
    for (const y of pts(cy - ry, cy + ry))
      for (const z of pts(cz - rz, cz + rz)) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
        if (d <= 1) block(x, y, z, typeof col === 'function' ? col(x, y, z) : col);
      }
}
const R = Math.round;

// ---- Clear site (trees/leaves) and lay snow ----
for (let x = -16; x <= 16; x++)
  for (let z = -16; z <= 16; z++)
    if (x * x + z * z <= 16.5 * 16.5) cube(x, 0, z, x, 8, z, AIR);
disk(0, -1, 0, 16, SNOW);
// snow drifts
ell(-10, 0, -3, 3, 1, 2, SNOW);
ell(11, 0, 4, 2.5, 1, 3, SNOW);
ell(-3, 0, 12, 4, 1, 2, SNOW);
ell(6, 0, -13, 2, 1, 1.5, SNOW);

// ---- Snowy pines (background / sides) ----
function pine(px, pz, h) {
  cube(px, 0, pz, px, 2, pz, OAK_LOG);
  for (let y = 3; y <= h; y += 2) {
    const r = 1 + R(3 * (h - y) / h);
    disk(px, y, pz, r, LEAVES);
    if (r > 1) disk(px, y + 1, pz, r - 1, SNOW);
    block(px, y + 1, pz, LEAVES);
  }
  block(px, h + 1, pz, LEAVES);
  block(px, h + 2, pz, SNOW);
}
pine(-13, 9, 12);
pine(13, 10, 13);
pine(-6, 14, 10);
pine(15, -2, 9);
pine(5, 14, 11);

// ---- Lantern post (front-east, catches light) ----
cube(9, 0, -9, 9, 4, -9, IRON);
block(9, 5, -9, GLOWSTONE);
block(9, 6, -9, GOLD);
block(8, 4, -9, IRON);

// ---- Presents ----
function present(x, z, c1, c2) {
  cube(x, 0, z, x + 2, 1, z + 2, c1);
  cube(x + 1, 0, z, x + 1, 1, z + 2, c2);
  cube(x, 1, z + 1, x + 2, 1, z + 1, c2);
  block(x + 1, 2, z + 1, c2);
  block(x, 2, z + 1, c2);
}
present(-9, -10, RED, GOLD);
present(-6, -13, GREEN, WHITE);
present(5, -11, BLUE, WHITE);

// ---- Reindeer ----
// Body
const bodyCol = (x, y, z) => {
  if (y <= 8) return WHITE;
  if (z >= 7 && y <= 12) return WHITE;
  const onBlanket = (y >= 14 || (Math.abs(x) >= 3 && y >= 11)) && z >= -1 && z <= 5;
  if (onBlanket) {
    if (z === -1 || z === 5 || y === 11) return GOLD;
    return GREEN;
  }
  return BROWN;
};
ell(0, 11, 1, 4.5, 3.8, 8, bodyCol);
// Haunches
ell(-2.5, 10, 5.5, 2, 3, 2.5, (x, y, z) => (y <= 8 ? WHITE : BROWN));
ell(2.5, 10, 5.5, 2, 3, 2.5, (x, y, z) => (y <= 8 ? WHITE : BROWN));
// Shoulders
ell(-2.5, 10, -4, 1.8, 2.5, 2, BROWN);
ell(2.5, 10, -4, 1.8, 2.5, 2, BROWN);

// Chest strap
for (let a = 0; a < 360; a += 6) {
  const th = a * Math.PI / 180;
  block(R(4.4 * Math.cos(th)), R(11 + 3.9 * Math.sin(th)), -3, RED);
}
block(-4, 8, -3, GOLD); block(4, 8, -3, GOLD);
block(-5, 11, -3, GOLD); block(5, 11, -3, GOLD);

// Tail
ell(0, 13, 9.5, 1.2, 1.5, 1, WHITE);

// Legs
function leg(x0, z0, back) {
  cube(x0, 0, z0, x0 + 1, 1, z0 + 1, BLACK);
  cube(x0, 2, z0, x0 + 1, 2, z0 + 1, WHITE);
  cube(x0, 3, z0, x0 + 1, 5, z0 + 1, BROWN);
  if (back) {
    cube(x0, 6, z0 + 1, x0 + 1, 9, z0 + 2, BROWN);
    block(x0, 5, z0 + 2, BROWN); block(x0 + 1, 5, z0 + 2, BROWN);
  } else {
    cube(x0, 6, z0, x0 + 1, 9, z0 + 1, BROWN);
  }
}
leg(-3, -5, false);         // front-left planted
leg(-3, 4, true);           // back-left
leg(1, 4, true);            // back-right
// front-right raised, mid-step
cube(1, 6, -5, 2, 9, -4, BROWN);
cube(1, 5, -7, 2, 6, -5, BROWN);
cube(1, 4, -7, 2, 4, -6, WHITE);
cube(1, 3, -7, 2, 3, -6, BLACK);
block(1, 2, -6, BLACK); block(2, 2, -6, BLACK);

// Neck
const N0 = [0, 13, -4], N1 = [0, 19, -10];
for (let i = 0; i <= 8; i++) {
  const t = i / 8;
  ell(0, N0[1] + (N1[1] - N0[1]) * t, N0[2] + (N1[2] - N0[2]) * t, 3.2 - 0.6 * t, 3.2 - 0.6 * t, 3.2 - 0.6 * t, BROWN);
}
// Shaggy white mane/beard under the neck and chest
ell(0, 11.5, -6.5, 3.2, 3, 2, WHITE);
for (let i = 0; i <= 6; i++) {
  const t = i / 6;
  const cy = 13 + 5 * t - 1.6, cz = -4 - 5.5 * t - 1.8;
  ell(0, cy, cz, 2.2 - 0.6 * t, 2.4, 1.4, WHITE);
}
// shaggy tufts hanging lower
block(-1, 9, -8, WHITE); block(0, 8, -8, WHITE); block(1, 9, -8, WHITE);
block(0, 10, -9, WHITE); block(-1, 12, -10, WHITE); block(1, 12, -10, WHITE);

// Head
ell(0, 19.5, -12, 2.4, 2.4, 3, BROWN);
ell(0, 18.3, -15, 1.8, 1.6, 2.2, (x, y, z) => (y <= 17 ? LIGHT_GRAY : BROWN));
// Glowing red nose
cube(-1, 18, -17, 1, 18, -17, NEON_RED);
block(0, 19, -17, NEON_RED);
block(0, 18, -18, NEON_RED);
// Mouth line
block(-1, 17, -16, BLACK); block(0, 17, -17, BLACK); block(1, 17, -16, BLACK);
// Eyes
for (const s of [-1, 1]) {
  block(2 * s, 20, -13, BLACK);
  block(2 * s, 20, -14, BLACK);
  block(2 * s, 21, -14, WHITE);
  block(s, 21, -15, BROWN); // brow
}
// Ears
for (const s of [-1, 1]) {
  block(3 * s, 21, -11, BROWN);
  block(4 * s, 22, -11, BROWN);
  block(4 * s, 22, -12, PINK);
  block(5 * s, 22, -11, BROWN);
}

// Collar with bells
{
  const cy = 16, cz = -7, Rr = 3.4, k = Math.SQRT1_2;
  for (let a = 0; a < 360; a += 8) {
    const th = a * Math.PI / 180;
    block(R(Rr * Math.cos(th)), R(cy + Rr * Math.sin(th) * k), R(cz - Rr * Math.sin(th) * k), RED);
  }
  for (const a of [-90, -45, -135, 0, 180]) {
    const th = a * Math.PI / 180;
    const bx = R((Rr + 0.6) * Math.cos(th)), by = R(cy + Rr * Math.sin(th) * k), bz = R(cz - Rr * Math.sin(th) * k);
    block(bx, by - 1, bz, GOLD);
  }
  block(0, 12, -10, GOLD); block(0, 11, -10, GOLD);
}

// ---- Giant antlers ----
for (const s of [-1, 1]) {
  const P = t => [s * (1.5 + 13.5 * t), 21.5 + 11.3 * Math.sin(t * Math.PI / 2), -11 + 9 * t - 4 * t * t];
  // main beam
  for (let i = 0; i <= 90; i++) {
    const t = i / 90;
    const [x, y, z] = P(t);
    const xi = R(x), yi = Math.min(33, R(y)), zi = R(z);
    block(xi, yi, zi, PLANKS);
    if (t < 0.75) block(xi, yi - 1, zi, PLANKS);
    if (t < 0.4) { block(xi, yi, zi + 1, PLANKS); block(xi, yi - 1, zi + 1, PLANKS); }
    if (t < 0.2) block(xi - s, yi, zi, PLANKS);
  }
  const tine = (t, dx, dy, dz) => {
    const [x, y, z] = P(t);
    const ex = R(x + dx), ey = Math.min(33, R(y + dy)), ez = R(z + dz);
    line(R(x), Math.min(33, R(y)), R(z), ex, ey, ez, SAND);
    block(ex, ey, ez, WHITE);
  };
  // brow "shovel" tine reaching forward over the face
  tine(0.05, -s * 0.5, 1, -5);
  tine(0.07, 0, 1.5, -4.5);
  tine(0.04, -s * 1, 0.5, -4);
  // bez tine
  tine(0.18, s * 1, 4, -4);
  // rear + upward tines
  tine(0.32, s * 1, 5, -2);
  tine(0.36, 0, 4, 4);
  tine(0.5, s * 2, 5, -3);
  // palmate top: fan of lines forming a palm
  for (let t = 0.56; t <= 0.8; t += 0.03) tine(t, s * 1.5, 2.5, -3.5);
  tine(0.62, s * 1, 3, -6);
  tine(0.75, s * 2, 1, -6);
  tine(0.88, s * 1, 0, 4.5);
  tine(0.94, s * 2, 0, -3);
  tine(1.0, s * 3.5, 0, 1);
  // a dusting of snow on the palm
  const [px, py, pz] = P(0.68);
  block(R(px + s), Math.min(33, R(py) + 1), R(pz - 2), SNOW);
  block(R(px + s * 2), 33, R(pz - 3), SNOW);
}