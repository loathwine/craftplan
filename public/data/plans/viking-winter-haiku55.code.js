// viking-winter-haiku55 — prompt:
// a Viking warrior in a snowstorm...

// Viking warrior in a snowstorm. Faces north (-Z). Shield arm on the west (-X), axe arm on the east (+X).

// ---------- clear the site (AIR is free) ----------
cube(-7, 0, -5, 7, 21, 5, AIR);

// ---------- snowy ground ----------
cube(-12, -1, -9, 12, -1, 9, SNOW);
cube(-11, 0, 2, -9, 0, 4, SNOW);
cube(3, 0, -4, 5, 0, -3, SNOW);
cube(-3, 0, -6, 0, 0, -6, SNOW);

// ---------- background mountain with snow cap (behind subject, south) ----------
const MX = 0, MZ = 13, MR = 8;
for (let y = -2; y <= 13; y++) {
  const r = MR * (1 - (y + 2) / 16);
  for (let x = MX - MR; x <= MX + MR; x++) {
    for (let z = MZ - MR; z <= MZ + MR; z++) {
      const dx = x - MX, dz = z - MZ;
      if (dx * dx + dz * dz <= r * r + 0.5) {
        const rock = ((((x * 31 + y * 17 + z * 7) % 5) + 5) % 5 === 0) ? COBBLE : STONE;
        block(x, y, z, y >= 9 ? SNOW : rock);
      }
    }
  }
}

// ---------- snowy pine trees with snow on the boughs ----------
function pine(cx, cz, h) {
  for (let y = 0; y < h; y++) block(cx, y, cz, OAK_LOG);
  const rad = (y) => {
    if (y < 2 || y > h) return -1;
    if (y === h) return 0;
    return [3, 3, 2, 2, 1, 1][Math.min(y - 2, 5)];
  };
  for (let y = 2; y <= h; y++) {
    const r = rad(y);
    const ra = rad(y + 1);
    const raSq = ra < 0 ? -1 : ra * ra;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        const d2 = dx * dx + dz * dz;
        if (d2 > r * r + 0.5) continue;
        block(cx + dx, y, cz + dz, LEAVES);
        if (d2 > raSq + 0.5) block(cx + dx, y + 1, cz + dz, SNOW);
      }
    }
  }
}
pine(-10, 5, 9);
pine(-9, -6, 7);
pine(10, 6, 10);
pine(11, -5, 8);

// ---------- campfire (left-front) ----------
line(-7, 0, -2, -5, 0, -2, OAK_LOG);
[[-8, -2], [-4, -2], [-6, -4], [-6, 0], [-8, -3], [-4, -3], [-8, -1], [-4, -1]]
  .forEach(([x, z]) => block(x, 0, z, COBBLE));
block(-7, 1, -2, FIRE);
block(-6, 1, -2, FIRE);
block(-5, 1, -2, FIRE);

// ---------- rune stone (right-back) ----------
cube(7, 0, 3, 9, 6, 4, STONE);
cube(7, 7, 3, 9, 7, 4, SNOW);
line(8, 1, 3, 8, 5, 3, LIGHT_BLUE);
line(7, 3, 3, 9, 3, 3, LIGHT_BLUE);
block(7, 5, 3, LIGHT_BLUE);
block(9, 1, 3, LIGHT_BLUE);

// ---------- cloak, fur and wind-blown tail (behind body, z = +2) ----------
cube(-3, 6, 2, 3, 12, 2, LIGHT_GRAY);
cube(4, 8, 2, 5, 10, 2, LIGHT_GRAY);
cube(6, 9, 2, 7, 10, 2, LIGHT_GRAY);
block(5, 11, 2, WHITE);
block(7, 8, 2, WHITE);
block(6, 6, 2, WHITE);

// ---------- legs and boots ----------
cube(-2, 0, -1, -1, 1, 1, BLACK);
cube(1, 0, -1, 2, 1, 1, BLACK);
cube(-2, 2, -1, -1, 6, 1, BROWN);
cube(1, 2, -1, 2, 6, 1, BROWN);
cube(-2, 3, -2, -1, 3, -2, LIGHT_GRAY);
cube(-2, 5, -2, -1, 5, -2, LIGHT_GRAY);
cube(1, 3, -2, 2, 3, -2, LIGHT_GRAY);
cube(1, 5, -2, 2, 5, -2, LIGHT_GRAY);

// ---------- belt, hips and sword at the hip ----------
cube(-2, 7, -1, 2, 7, 1, BROWN);
block(0, 7, -2, GOLD);
line(-3, 1, 0, -3, 5, 0, IRON);
block(-3, 6, 0, GOLD);

// ---------- chainmail torso and blue tunic front ----------
cube(-2, 8, -1, 2, 11, 1, IRON);
cube(-1, 8, -2, 1, 11, -2, BLUE);
line(-1, 11, -2, 1, 11, -2, GOLD);
block(1, 9, -2, GOLD);
cube(-2, 12, -1, 2, 12, 1, IRON);

// ---------- arms, pauldrons, shoulder snow ----------
cube(-4, 7, -1, -3, 10, 0, BLUE);
cube(3, 7, -1, 4, 10, 0, BLUE);
cube(-4, 11, -1, -3, 12, 1, IRON);
cube(3, 11, -1, 4, 12, 1, IRON);
cube(-4, 13, -1, -3, 13, 1, SNOW);
cube(3, 13, -1, 4, 13, 1, SNOW);
block(4, 8, -2, SAND);

// ---------- neck, face, hair and beard ----------
cube(-1, 13, -1, 1, 13, 1, SAND);
cube(-2, 14, -1, 2, 17, 1, SAND);
cube(-3, 13, 0, -3, 15, 1, YELLOW);
cube(3, 13, 0, 3, 15, 1, YELLOW);
cube(-2, 13, 2, 2, 17, 2, YELLOW);
cube(-2, 14, -2, 2, 14, -2, ORANGE);
cube(-1, 13, -2, 1, 13, -2, ORANGE);
cube(-1, 15, -2, -1, 15, -2, ORANGE);
cube(1, 15, -2, 1, 15, -2, ORANGE);
block(-1, 16, -1, BLACK);
block(1, 16, -1, BLACK);
cube(0, 14, -2, 0, 16, -2, IRON);

// ---------- helmet with cheek guards, dome and snow cap ----------
cube(-3, 17, -2, 3, 17, -2, IRON);
cube(-3, 18, -2, 3, 18, 2, IRON);
cube(-3, 16, -2, -3, 17, 1, IRON);
cube(3, 16, -2, 3, 17, 1, IRON);
cube(-2, 19, -1, 2, 19, 1, IRON);
cube(-1, 20, -1, 1, 20, 1, SNOW);

// ---------- curved copper horns (double thickness) ----------
[[4, 18, 0], [5, 18, 0], [5, 19, 0], [6, 19, 0], [6, 20, 0], [6, 21, 0], [6, 22, 0], [7, 22, 0]]
  .forEach(([x, y, z]) => {
    block(x, y, z, COPPER);
    block(-x, y, z, COPPER);
    block(x, y, z + 1, COPPER);
    block(-x, y, z + 1, COPPER);
  });

// ---------- great axe planted on the east side ----------
line(5, 0, -2, 5, 17, -2, OAK_LOG);
block(5, 12, -2, GOLD);
block(5, 18, -2, IRON);
cube(6, 13, -2, 8, 13, -2, IRON);
cube(6, 14, -2, 9, 14, -2, IRON);
cube(6, 15, -2, 9, 15, -2, IRON);
cube(6, 16, -2, 8, 16, -2, IRON);
cube(6, 17, -2, 7, 17, -2, IRON);
block(7, 15, -2, GOLD);
cube(6, 18, -2, 7, 18, -2, SNOW);

// ---------- round shield on the west arm (front plane z = -2) ----------
const SX = -4, SY = 9, SZ = -2;
for (let dx = -4; dx <= 4; dx++) {
  for (let dy = -4; dy <= 4; dy++) {
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > 4.2) continue;
    let id;
    if (d > 3.2) id = IRON;
    else if (d <= 0.9) id = IRON;
    else if (dx === 0 || dy === 0) id = YELLOW;
    else id = RED;
    block(SX + dx, SY + dy, SZ, id);
  }
}
cube(-5, 14, -2, -3, 14, -2, SNOW);