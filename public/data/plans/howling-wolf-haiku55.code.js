// howling-wolf-haiku55 — prompt:
// a wolf howling at the moon...

// Wolf howling at the moon. The wolf faces north (-Z) with its muzzle raised toward the moon at (0, 26, -15).

const rnd = (x, y, z) => {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
};

function ell(cx, cy, cz, rx, ry, rz, pick) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
  for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
    const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
    if (dx * dx + dy * dy + dz * dz <= 1) {
      block(x, y, z, typeof pick === 'function' ? pick(x, y, z) : pick);
    }
  }
}

// ---- Night sky: sparse stars (placed first so clouds and moon override) ----
const MOON_X = 0, MOON_Y = 26, MOON_Z = -15, MOON_R = 4.5;
for (let x = -20; x <= 20; x++)
for (let y = 20; y <= 32; y++)
for (let z = -20; z <= -1; z++) {
  if (Math.hypot(x - MOON_X, y - MOON_Y, z - MOON_Z) < MOON_R + 3) continue;
  if (rnd(x, y, z) > 0.992) block(x, y, z, WHITE);
}

// ---- Clouds drifting past the moon ----
ell(-14, 18, -6, 4, 1.5, 2.5, WHITE);
ell(-11, 17, -6, 2.5, 1, 2, LIGHT_GRAY);
ell(13, 22, -2, 5, 1.5, 3, WHITE);
ell(10, 12, -16, 4, 1.2, 2.5, LIGHT_GRAY);

// ---- Moon: marble disc with cratered face, north of the wolf and high up ----
ell(MOON_X, MOON_Y, MOON_Z, MOON_R, MOON_R, MOON_R, (x, y, z) => {
  const c1 = Math.hypot(x - (MOON_X - 1.5), y - (MOON_Y + 1), z - (MOON_Z - 3.5));
  const c2 = Math.hypot(x - (MOON_X + 2), y - (MOON_Y - 2), z - (MOON_Z - 3));
  if (c1 < 1.4 || c2 < 1.0) return LIGHT_GRAY;
  if (rnd(x, y, z) > 0.9) return LIGHT_GRAY;
  return MARBLE;
});

// ---- Background: snowy ridges to the south (behind the wolf) ----
ell(-9, 0, 18, 8, 6, 4, (x, y, z) => (y >= 4 ? SNOW : (rnd(x, y, z) > 0.8 ? COBBLE : STONE)));
ell(9, -1, 19, 7, 4, 3, (x, y, z) => (y >= 3 ? SNOW : STONE));

// ---- Foreground: rock outcrop the wolf stands on (top surface y = 3) ----
ell(0, -1, 3, 6, 4, 6, (x, y, z) => {
  if (y === 3) return rnd(x, y, z) > 0.5 ? COBBLE : STONE;
  return rnd(x, y, z) > 0.85 ? COBBLE : STONE;
});

// Front boulders on the ground
ell(-5, 0, -6, 2, 1.5, 2, STONE);
ell(5, 0, -5, 1.5, 1, 1.5, COBBLE);
ell(-7, 0, -3, 1, 1, 1, COBBLE);

// ---- Wolf (faces -Z). Paws rest on the rock at y = 4 ----

// Paws and legs
cube(-2, 4, -1, -1, 4, 0, BLACK);
cube(1, 4, -1, 2, 4, 0, BLACK);
cube(-2, 4, 6, -1, 4, 7, BLACK);
cube(1, 4, 6, 2, 4, 7, BLACK);
cube(-2, 5, -1, -1, 8, 0, GRAY);
cube(1, 5, -1, 2, 8, 0, GRAY);
cube(-2, 5, 6, -1, 8, 7, GRAY);
cube(1, 5, 6, 2, 8, 7, GRAY);

// Torso, belly, dark saddle
cube(-2, 9, 0, 2, 12, 7, GRAY);
cube(-1, 9, 1, 1, 9, 6, LIGHT_GRAY);
cube(-1, 12, 2, 1, 12, 5, BLACK);

// Neck, then chest fluff and mane ruff on top of it
cube(-1, 11, -3, 1, 15, 0, GRAY);
cube(-1, 11, -1, 1, 12, -1, LIGHT_GRAY);
cube(-2, 12, -3, -2, 13, -1, BLACK);
cube(2, 12, -3, 2, 13, -1, BLACK);

// Head, cheek, eyes
cube(-2, 14, -5, 1, 17, -2, GRAY);
cube(-1, 14, -5, 0, 14, -5, LIGHT_GRAY);
cube(-1, 16, -5, 0, 16, -5, YELLOW);

// Muzzle raised toward the moon, open jaw, nose
cube(-1, 16, -8, 0, 17, -6, LIGHT_GRAY);
cube(-1, 18, -10, 0, 19, -8, LIGHT_GRAY);
cube(-1, 15, -7, 0, 15, -6, WHITE);
cube(-1, 19, -11, 0, 19, -11, BLACK);

// Ears
cube(-2, 18, -4, -2, 19, -3, GRAY);
cube(1, 18, -4, 1, 19, -3, GRAY);
block(-2, 19, -4, BLACK);
block(1, 19, -4, BLACK);

// Bushy tail curling up from the back, black tip
line(0, 11, 8, 0, 13, 10, GRAY);
cube(0, 14, 10, 0, 14, 11, GRAY);
cube(0, 14, 12, 0, 15, 12, BLACK);