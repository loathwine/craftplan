// reindeer-haiku55 — prompt:
// a reindeer with giant antlers...

// Reindeer with giant antlers. Faces north (-Z), body runs south (+Z).

function hash3(x, y, z) {
  const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return v - Math.floor(v);
}

function furBox(x1, y1, z1, x2, y2, z2, base, accent) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++)
        block(x, y, z, hash3(x, y, z) > 0.82 ? accent : base);
}

function sbox(x1, y1, z1, x2, y2, z2, id, s = 1) {
  const a = x1 * s, b = x2 * s;
  cube(Math.min(a, b), y1, Math.min(z1, z2), Math.max(a, b), y2, Math.max(z1, z2), id);
}

// Thick stroke along a polyline: r=0 is 1-block wide, r=1 is 3-blocks wide.
function stroke(pts, r, id) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0, z0] = pts[i];
    const [x1, y1, z1] = pts[i + 1];
    const n = Math.max(1, Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)) * 2);
    for (let s = 0; s <= n; s++) {
      const t = s / n;
      const x = Math.round(x0 + (x1 - x0) * t);
      const y = Math.round(y0 + (y1 - y0) * t);
      const z = Math.round(z0 + (z1 - z0) * t);
      cube(x - r, y - r, z - r, x + r, y + r, z + r, id);
    }
  }
}

function antler(s) {
  const P = (x, y, z) => [x * s, y, z];
  // main beam: thick at the skull, tapering outward
  stroke([P(2, 18, -9), P(4, 23, -8), P(7, 27, -7)], 1, PLANKS);
  stroke([P(7, 27, -7), P(11, 29, -6), P(14, 27, -5), P(15, 25, -4)], 0, PLANKS);
  // palmate plates
  sbox(6, 24, -8, 11, 27, -7, PLANKS, s);
  sbox(9, 27, -7, 14, 30, -6, PLANKS, s);
  // tines
  stroke([P(4, 23, -8), P(5, 28, -11)], 0, PLANKS);
  stroke([P(7, 27, -7), P(7, 31, -10)], 0, PLANKS);
  stroke([P(11, 29, -6), P(12, 32, -9)], 0, PLANKS);
  stroke([P(14, 27, -5), P(17, 29, -7)], 0, PLANKS);
  stroke([P(3, 20, -9), P(6, 21, -12)], 0, PLANKS);
  // snow dusting on the tine tips
  block(7 * s, 32, -10, SNOW);
  block(12 * s, 33, -9, SNOW);
  block(17 * s, 30, -7, SNOW);
}

function pine(cx, cz, h) {
  cube(cx, 0, cz, cx, h, cz, OAK_LOG);
  for (let y = 2; y <= h - 1; y += 2) {
    const t = (y - 2) / Math.max(1, h - 3);
    const r = Math.max(1, Math.round(4.5 - t * 3.5));
    disk(cx, y, cz, r, LEAVES);
    disk(cx, y + 1, cz, Math.max(1, r - 2), LEAVES);
  }
  block(cx, h + 1, cz, SNOW);
}

function gift(x1, z1, size, hgt, box, rib) {
  const x2 = x1 + size - 1, z2 = z1 + size - 1;
  const mx = x1 + Math.floor(size / 2), mz = z1 + Math.floor(size / 2);
  cube(x1, 0, z1, x2, hgt - 1, z2, box);
  cube(mx, 0, z1, mx, hgt - 1, z2, rib);
  cube(x1, hgt - 1, mz, x2, hgt - 1, mz, rib);
}

// ---- Clear the local clutter in the subject's volume (AIR is free) ----
cube(-16, 0, -15, 16, 32, 11, AIR);

// ---- Snowy stage ----
cube(-12, -1, -11, 12, -1, 10, SNOW);

// ---- Background: pine trees beyond the reindeer (south, +Z) ----
pine(-10, 14, 9);
pine(11, 15, 11);
pine(-18, 11, 7);
pine(18, 12, 8);

// ---- Foreground: gift pile and snow drifts (north, -Z) ----
gift(-10, -10, 3, 2, GREEN, GOLD);
gift(7, -10, 3, 3, RED, GOLD);
cube(-13, 0, -11, -11, 0, -9, SNOW);
cube(11, 0, -11, 13, 0, -9, SNOW);

// ---- Legs: brown, white ankles, black hooves ----
for (const [x0, z0] of [[-3, -1], [2, -1], [-3, 8], [2, 8]]) {
  cube(x0, 2, z0, x0 + 1, 6, z0 + 1, BROWN);
  cube(x0, 1, z0, x0 + 1, 1, z0 + 1, WHITE);
  cube(x0, 0, z0, x0 + 1, 0, z0 + 1, BLACK);
}

// ---- Torso with mottled coat, shoulder hump, white rump ----
furBox(-4, 7, -1, 4, 11, 9, BROWN, OAK_LOG);
furBox(-3, 12, -1, 3, 12, 4, BROWN, OAK_LOG);
cube(-3, 8, 9, 3, 10, 9, WHITE);
block(0, 9, 10, WHITE);

// ---- Neck ----
furBox(-2, 9, -6, 2, 14, -2, BROWN, OAK_LOG);

// ---- Red scarf and golden bell ----
cube(-3, 8, -7, 3, 9, -1, RED);
block(0, 7, -7, GOLD);

// ---- Head ----
furBox(-3, 13, -12, 3, 17, -6, BROWN, OAK_LOG);

// ---- Snout, chin tuft, glowing nose ----
furBox(-2, 12, -15, 2, 14, -12, BROWN, OAK_LOG);
cube(-1, 11, -15, 1, 11, -13, WHITE);
block(0, 13, -16, NEON_RED);

// ---- Eyes ----
block(-2, 16, -12, BLACK);
block(2, 16, -12, BLACK);

// ---- Ears ----
cube(-6, 15, -9, -4, 16, -8, BROWN);
cube(4, 15, -9, 6, 16, -8, BROWN);

// ---- Giant antlers, both sides ----
antler(1);
antler(-1);