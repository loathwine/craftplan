// rocket-launch-haiku55 — prompt:
// a rocket launching into space...

cube(-6, 0, -6, 6, 7, 6, AIR);
cube(-4, 7, -4, 4, 33, 4, AIR);

cube(-5, 0, -5, 5, 0, 5, COBBLE);
hollowCube(-5, 0, -5, 5, 0, 5, IRON);
cube(-2, 0, -2, 2, 0, 2, GRAY);
[[-5, -5], [5, -5], [-5, 5], [5, 5]].forEach(([x, z]) => block(x, 1, z, GLOWSTONE));

for (let y = 1; y <= 6; y++) {
  const r = 1 + (6 - y) * 0.6;
  disk(0, y, 0, r, ORANGE);
  disk(0, y, 0, r * 0.5, YELLOW);
}
[[0, 1, 0], [1, 1, 0], [-1, 1, 0], [0, 1, 1], [0, 1, -1]].forEach(([x, y, z]) => block(x, y, z, FIRE));

disk(0, 7, 0, 2, IRON);

for (let y = 8; y <= 22; y++) {
  disk(0, y, 0, 3, y >= 13 && y <= 14 ? BLUE : WHITE);
}
cube(-1, 16, -3, 1, 19, -3, GLASS);

for (let y = 23; y <= 30; y++) {
  disk(0, y, 0, 3 * (31 - y) / 8, RED);
}
line(0, 31, 0, 0, 32, 0, IRON);
block(0, 33, 0, NEON_RED);

cube(4, 8, -1, 5, 11, 1, RED);
cube(-5, 8, -1, -4, 11, 1, RED);
cube(-1, 8, 4, 1, 11, 5, RED);
cube(-1, 8, -5, 1, 11, -4, RED);

hollowCube(6, 0, -1, 8, 22, 1, IRON);
cube(6, 6, -1, 8, 6, 1, IRON);
cube(6, 14, -1, 8, 14, 1, IRON);
cube(6, 20, -1, 8, 20, 1, IRON);
line(4, 14, 0, 6, 14, 0, IRON);
line(4, 20, 0, 6, 20, 0, IRON);
block(7, 23, 0, NEON_RED);

sphere(-8, 1, -4, 2, LIGHT_GRAY);
sphere(-10, 1, 1, 2, LIGHT_GRAY);
sphere(-6, 2, -9, 2, WHITE);
sphere(9, 2, -6, 2, LIGHT_GRAY);
sphere(-5, 3, -3, 1, LIGHT_GRAY);
sphere(4, 4, -4, 1, LIGHT_GRAY);
sphere(-2, 5, -6, 1, WHITE);

sphere(-6, 9, 13, 3, WHITE);
sphere(5, 7, 14, 3, WHITE);
sphere(13, 9, 12, 2, WHITE);

sphere(-13, 25, 17, 3, LIGHT_GRAY);
block(-13, 25, 14, GRAY);

[[-18, 31, 10], [15, 32, 12], [-6, 33, 18], [10, 29, 20], [20, 31, -10], [-16, 28, -12], [4, 33, -14]]
  .forEach(([x, y, z]) => block(x, y, z, GLOWSTONE));