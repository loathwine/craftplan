// ghost-rider-sonnet — prompt:
// Ghost Rider on his flaming motorcycle...

function wheel(cy, cz, rOuter, rimR, x1, x2, tireId, rimId, spokeId) {
  const R = Math.ceil(rOuter);
  for (let x = x1; x <= x2; x++) {
    for (let dy = -R; dy <= R; dy++) {
      for (let dz = -R; dz <= R; dz++) {
        const d2 = dy * dy + dz * dz;
        if (d2 > rOuter * rOuter) continue;
        const y = cy + dy, z = cz + dz;
        if (d2 >= (rOuter - 1.2) * (rOuter - 1.2)) {
          block(x, y, z, tireId);
        } else if (d2 <= rimR * rimR) {
          block(x, y, z, rimId);
        } else {
          const ang = Math.atan2(dz, dy) * 180 / Math.PI;
          const a = ((ang % 60) + 60) % 60;
          if (a < 9 || a > 51) block(x, y, z, spokeId);
        }
      }
    }
  }
}

function fender(cy, cz, rOuter, x1, x2, id) {
  const R = Math.ceil(rOuter) + 2;
  for (let x = x1; x <= x2; x++) {
    for (let dy = 0; dy <= R; dy++) {
      for (let dz = -R; dz <= R; dz++) {
        const d2 = dy * dy + dz * dz;
        if (d2 >= rOuter * rOuter && d2 <= (rOuter + 1.1) * (rOuter + 1.1) && dy > rOuter * 0.2) {
          block(x, cy + dy, cz + dz, id);
        }
      }
    }
  }
}

// --- Wheels ---
wheel(3, -9, 3, 1, -1, 1, BLACK, IRON, GRAY);
wheel(4, 7, 4, 1.3, -1, 1, BLACK, IRON, GRAY);
fender(3, -9, 3, -1, 1, IRON);
fender(4, 7, 4, -1, 1, IRON);

// --- Frame / fork / handlebar ---
line(0, 3, -9, 0, 9, -8, IRON);
cube(-2, 9, -8, 2, 9, -8, IRON);
block(-2, 9, -8, BLACK);
block(2, 9, -8, BLACK);
line(0, 9, -8, 0, 7, 2, IRON);
line(0, 6, 1, 0, 4, 7, IRON);

// gas tank
sphere(0, 7, -4, 2, BLACK);
block(-2, 6, -5, ORANGE); block(-2, 7, -5, ORANGE); block(-2, 7, -4, ORANGE); block(-2, 8, -4, ORANGE);
block(2, 6, -5, ORANGE);  block(2, 7, -5, ORANGE);  block(2, 7, -4, ORANGE);  block(2, 8, -4, ORANGE);

// engine
cube(-1, 3, -4, 1, 6, 0, BLACK);
cube(-1, 4, -3, 1, 5, -1, IRON);

// exhaust pipes
cube(-2, 3, -3, -2, 4, 5, IRON);
cube(2, 3, -3, 2, 4, 5, IRON);
block(-2, 4, 5, FIRE);
block(2, 4, 5, FIRE);

// seat + sissy bar
cube(-1, 7, 0, 1, 7, 3, BLACK);
line(0, 7, 6, 0, 11, 6, IRON);

// headlight
sphere(0, 7, -10, 1, GLOWSTONE);

// --- Rider ---
cube(-1, 8, 0, 1, 12, 2, BLACK);
cube(-1, 12, 0, 1, 13, 1, BLACK);
line(-1, 11, 1, -2, 9, -8, BLACK);
line(1, 11, 1, 2, 9, -8, BLACK);
block(-2, 9, -8, WHITE);
block(2, 9, -8, WHITE);
line(0, 13, 1, 0, 15, 0, WHITE);

// chain across chest
line(-1, 12, 0, 1, 9, 2, GRAY);

// skull
sphere(0, 16, -1, 2, WHITE);
cube(-1, 14, -2, 1, 15, -1, WHITE);
block(-1, 16, -3, NEON_RED);
block(1, 16, -3, NEON_RED);

// flaming crown
block(0, 19, -1, FIRE);
block(-1, 18, -1, FIRE);
block(1, 18, -1, FIRE);
block(0, 18, -2, FIRE);
block(0, 18, 0, FIRE);
block(-1, 19, -2, FIRE);
block(1, 19, 0, FIRE);
block(0, 20, -1, FIRE);

// flapping duster coat
for (let zz = 3; zz <= 9; zz++) {
  const w = Math.max(0, 2 - Math.floor((zz - 3) / 3));
  const y = 7 + Math.floor((zz - 3) / 2);
  cube(-w - 1, y, zz, w + 1, y + 1, zz, BLACK);
}

// wheel-fire
block(0, 1, -9, FIRE);
block(-2, 3, -9, FIRE);
block(2, 3, -9, FIRE);
block(0, 1, 7, FIRE);

// ground scorch trail
for (let zz = 9; zz <= 14; zz++) {
  const r = Math.max(1, 3 - Math.floor((zz - 9) / 2));
  disk(0, 0, zz, r, BLACK);
}
block(0, 1, 9, FIRE);
block(-1, 1, 10, FIRE);
block(1, 1, 11, FIRE);
block(0, 1, 12, FIRE);
block(-1, 1, 13, FIRE);