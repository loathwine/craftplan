// headless-horseman-haiku55 — prompt:
// the Headless Horseman holding a flaming pumpkin...

cube(-14, 0, -5, 8, 12, 4, AIR);

// Horse: black, facing west, seen in profile from the north
cube(-7, 5, -2, 4, 8, 1, BLACK);
cube(-9, 7, -1, -8, 11, 0, BLACK);
cube(-11, 10, -1, -9, 11, 0, BLACK);
cube(-12, 9, -1, -11, 10, 0, BLACK);
block(-10, 11, -1, NEON_RED);
block(-10, 12, -1, BLACK);
block(-10, 12, 0, BLACK);
line(-9, 12, 0, -7, 11, 0, BLACK);
for (let x of [-6, 3]) {
  for (let z of [-2, 1]) cube(x, 0, z, x, 4, z, BLACK);
}
line(5, 7, 0, 7, 6, 0, BLACK);
line(7, 5, 0, 8, 2, 0, BLACK);

// Saddle and headless rider
cube(-2, 9, -2, 0, 9, 1, BROWN);
cube(-2, 10, -2, 0, 10, 1, BLACK);
cube(-2, 6, -3, -1, 10, -3, BLACK);
cube(-2, 5, -3, -1, 5, -3, BLACK);
block(-1, 4, -3, IRON);
cube(-2, 6, 2, -1, 10, 2, BLACK);
cube(-2, 5, 2, -1, 5, 2, BLACK);
block(-1, 4, 2, IRON);
cube(-2, 11, -2, 0, 15, 1, BLACK);
cube(1, 10, -2, 1, 14, 1, BLACK);
cube(-1, 13, -4, -1, 14, -3, BLACK);
cube(-1, 13, 2, -1, 14, 2, BLACK);
line(-1, 13, 2, -9, 11, 0, BROWN);
block(-1, 16, -1, RED);
block(-1, 16, 0, RED);

// Flaming jack-o'-lantern held out to the north
const PX = -1, PY = 13, PZ = -7, PR = 2.5;
for (let dx = -3; dx <= 3; dx++) {
  for (let dy = -3; dy <= 3; dy++) {
    for (let dz = -3; dz <= 3; dz++) {
      if (dx * dx + dy * dy + dz * dz > PR * PR) continue;
      let id = ORANGE;
      if (dz === -2 && dy === 1 && Math.abs(dx) === 1) id = LAVA;
      if (dz === -2 && dy === -1 && Math.abs(dx) <= 1) id = LAVA;
      block(PX + dx, PY + dy, PZ + dz, id);
    }
  }
}
block(PX, PY + 3, PZ, OAK_LOG);
block(PX, 17, PZ, FIRE);
block(PX - 1, 17, PZ, FIRE);
block(PX + 1, 17, PZ, FIRE);
block(PX, 17, PZ - 1, FIRE);
block(PX, 17, PZ + 1, FIRE);
block(PX, 18, PZ, FIRE);

// Ghostly trail streaming behind the horse
for (let x = 7; x <= 14; x++) {
  for (let y = 3; y <= 11; y++) {
    for (let z = -3; z <= 2; z++) {
      const h = Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453) % 1;
      if (h < 0.05) block(x, y, z, GLASS);
    }
  }
}

// Graveyard behind the horse
for (let x of [-16, -8, 2, 10]) {
  cube(x, 0, 8, x + 1, 2, 8, STONE);
  block(x, 3, 8, STONE);
}
line(-18, 0, 7, -18, 9, 7, OAK_LOG);
line(-18, 6, 7, -15, 10, 7, OAK_LOG);
line(-18, 7, 7, -21, 9, 7, OAK_LOG);
line(-15, 10, 7, -14, 12, 7, OAK_LOG);
line(13, 0, 6, 13, 8, 6, OAK_LOG);
line(13, 6, 6, 11, 9, 6, OAK_LOG);
line(13, 7, 6, 15, 10, 6, OAK_LOG);

// Small jack-o'-lanterns on the ground
for (const [cx, cz] of [[-12, -5], [10, -3]]) {
  sphere(cx, 1, cz, 1, ORANGE);
  block(cx, 1, cz - 1, LAVA);
}