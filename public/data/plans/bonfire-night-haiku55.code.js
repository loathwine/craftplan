// bonfire-night-haiku55 — prompt:
// a Bonfire Night bonfire with fireworks...

cube(-9,0,-9,9,8,9,AIR);
cube(-7,-1,-7,7,-1,7,COBBLE);
cube(-5,-1,-5,5,-1,5,STONE);

const h3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };

const RADII = [6, 6, 5, 5, 4, 4, 4, 3, 3, 2, 2, 2];
RADII.forEach((r, y) => {
  for (let x = -r; x <= r; x++)
    for (let z = -r; z <= r; z++) {
      if (x * x + z * z > r * r + 1) continue;
      const v = h3(x, y, z);
      let id = v < 0.6 ? OAK_LOG : PLANKS;
      if (y <= 3 && v > 0.94) id = GLOWSTONE;
      block(x, y, z, id);
    }
});
cube(-1,12,-1,1,12,1,OAK_LOG);

for (let a = 0; a < 8; a++) {
  const t = a * Math.PI / 4 + 0.2;
  for (let r = 5; r <= 8; r++) block(Math.round(Math.cos(t) * r), 0, Math.round(Math.sin(t) * r), OAK_LOG);
}

for (let i = -2; i <= 2; i++) {
  block(i, 13, -2, FIRE);
  block(i, 13, 2, FIRE);
  if (i > -2 && i < 2) {
    block(-2, 13, i, FIRE);
    block(2, 13, i, FIRE);
  }
}

cube(-1,13,-1,1,14,1,BLUE);
cube(-1,15,-1,1,17,1,BROWN);
cube(-2,15,0,-2,16,0,BROWN);
cube(2,15,0,2,16,0,BROWN);
cube(-1,18,-1,1,20,1,WHITE);
cube(-1,18,-1,1,18,-1,BLACK);
block(-1,19,-1,BLACK);
block(1,19,-1,BLACK);
cube(-2,21,-2,2,21,2,BLACK);
cube(-1,22,-1,1,23,1,BLACK);

const burst = (cx, cy, cz, r, col, acc) => {
  hollowSphere(cx, cy, cz, r, col);
  block(cx, cy, cz, GLOWSTONE);
  for (let dx = -r - 2; dx <= r + 2; dx++)
    for (let dy = -r - 2; dy <= r + 2; dy++)
      for (let dz = -r - 2; dz <= r + 2; dz++) {
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > r + 0.5 && d <= r + 2.2 && h3(cx + dx, cy + dy, cz + dz) > 0.82)
          block(cx + dx, cy + dy, cz + dz, acc);
      }
};
const trail = (x, y1, z, y2) => line(x, y1, z, x, y2, z, WHITE);

trail(-11, 12, -3, 21);
burst(-11, 26, -3, 4, RED, YELLOW);
trail(10, 12, -2, 22);
burst(10, 27, -2, 4, GREEN, WHITE);
trail(0, 12, -8, 20);
burst(0, 26, -8, 5, YELLOW, ORANGE);
trail(-5, 4, 8, 20);
burst(-5, 25, 8, 4, MAGENTA, PINK);
trail(16, 12, 6, 18);
burst(16, 22, 6, 3, ORANGE, YELLOW);
trail(-17, 12, 4, 18);
burst(-17, 22, 4, 3, CYAN, LIGHT_BLUE);
trail(4, 12, 12, 24);
burst(4, 28, 12, 3, PURPLE, MAGENTA);
trail(13, 12, -13, 16);
burst(13, 20, -13, 3, GOLD, WHITE);

cube(-6,0,7,2,0,9,PLANKS);
for (const x of [-5, -3, -1, 1]) cube(x,1,8,x,3,8,IRON);