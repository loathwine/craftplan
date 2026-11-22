// woolly-rhino-haiku55 — prompt:
// a woolly rhinoceros...

// Woolly rhinoceros on a snowy Ice Age tundra. Head faces north (-Z), toward the camera.

const hsh = (x, y, z, s) => {
  let n = Math.imul(x + 4096, 374761393) ^ Math.imul(y + 4096, 668265263) ^ Math.imul(z + 4096, 1442695041) ^ Math.imul(s + 1, 2246822519);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
};

// Rhino builder. Local coords: body centre at x=0,z=0, feet at y=0. k scales the whole animal.
function rhino(ox, oz, k, seed) {
  const W = (x, y, z, id) => block(Math.round(ox + x * k), Math.round(y * k), Math.round(oz + z * k), id);
  const Q = (x1, y1, z1, x2, y2, z2, id) => cube(
    Math.round(ox + x1 * k), Math.round(y1 * k), Math.round(oz + z1 * k),
    Math.round(ox + x2 * k), Math.round(y2 * k), Math.round(oz + z2 * k), id);

  // Ellipsoid: solid core plus a ragged wool shell (shell = thickness fraction, p = keep chance)
  const E = (cx, cy, cz, ax, ay, az, id, shell = 0, p = 0) => {
    const X = ox + cx * k, Y = cy * k, Z = oz + cz * k;
    const RX = ax * k, RY = ay * k, RZ = az * k;
    const m = 1 + shell;
    for (let x = Math.floor(X - RX * m) - 1; x <= Math.ceil(X + RX * m) + 1; x++)
      for (let y = Math.floor(Y - RY * m) - 1; y <= Math.ceil(Y + RY * m) + 1; y++)
        for (let z = Math.floor(Z - RZ * m) - 1; z <= Math.ceil(Z + RZ * m) + 1; z++) {
          const d = Math.sqrt(((x - X) / RX) ** 2 + ((y - Y) / RY) ** 2 + ((z - Z) / RZ) ** 2);
          if (d <= 1) block(x, y, z, id);
          else if (shell && d <= m && hsh(x, y, z, seed) < p) block(x, y, z, id);
        }
  };

  // Body: barrel torso, shoulder hump, chest, hindquarters, all under a shaggy coat
  E(0, 8, 0, 4.5, 3.5, 6.5, BROWN, 0.22, 0.55);
  E(0, 10.5, -2.5, 4, 2.2, 3.5, BROWN, 0.3, 0.5);     // shoulder hump
  E(0, 7, -4.5, 3.8, 3.4, 2.6, BROWN, 0.22, 0.5);     // chest
  E(0, 8, 4.5, 4, 3.4, 3, BROWN, 0.22, 0.5);          // hindquarters
  E(0, 4.6, 0.5, 4.2, 1.8, 6.5, BROWN, 0.55, 0.45);   // shaggy belly skirt
  E(0, 11, -5, 2.6, 1.6, 3, BROWN, 0.7, 0.35);        // mane ridge

  // Neck, head, hanging chin beard
  E(0, 8.5, -7, 3, 3, 2.4, BROWN, 0.25, 0.5);
  E(0, 7.5, -9, 3, 2.8, 2.8, BROWN, 0.2, 0.45);
  E(0, 5.4, -9.4, 2, 1.2, 1.8, BROWN, 0.7, 0.4);

  // Legs: column, black hooves, shaggy wool chaps around each leg
  const legs = [[-4, -3, -5, -4], [3, 4, -5, -4], [-4, -3, 3, 4], [3, 4, 3, 4]];
  for (const [x1, x2, z1, z2] of legs) {
    Q(x1, 1, z1, x2, 5, z2, BROWN);
    Q(x1, 0, z1, x2, 0, z2, BLACK);
    for (let x = x1 - 1; x <= x2 + 1; x++)
      for (let z = z1 - 1; z <= z2 + 1; z++)
        for (let y = 1; y <= 3; y++) {
          const inside = x >= x1 && x <= x2 && z >= z1 && z <= z2;
          if (!inside && hsh(x, y, z, seed + 3) < 0.55) W(x, y, z, BROWN);
        }
  }

  // Face: white nose horn, small forehead horn, black eyes and nostrils, ears
  W(0, 9, -12, WHITE); W(0, 10, -12, WHITE); W(0, 10, -13, WHITE); W(0, 11, -13, WHITE); W(0, 11, -14, WHITE);
  W(0, 11, -10, WHITE);
  W(-2, 8, -11, BLACK); W(2, 8, -11, BLACK);
  W(-1, 6, -11, BLACK); W(1, 6, -11, BLACK);
  W(-2, 11, -7, BROWN); W(2, 11, -7, BROWN);

  // Tail with a wool tuft
  W(0, 7, 8, BROWN); W(0, 6, 9, BROWN); W(0, 5, 9, BROWN);
  E(0, 4.5, 9.5, 1.2, 1.2, 1.2, BROWN, 0.8, 0.5);
}

// ---- Stage: clear the site, then lay a snow field ----
cube(-9, 0, -15, 14, 16, 10, AIR);
cube(-9, -1, -15, 14, -1, 10, SNOW);

// Foreground: frozen pond and ice shards
cube(-8, -1, -14, -5, -1, -12, ICE);
block(-7, 0, -13, ICE);
block(-5, 0, -14, ICE);
block(-6, 0, -11, ICE);

// Background: snowy mountain on the horizon (back right), stone with a snow cap
for (let y = 0; y <= 13; y++) {
  const r = 8 - y * 0.5;
  disk(10, y, 14, r, y >= 9 ? SNOW : STONE);
}

// Dead trees with snow-capped branches
const deadTree = (x, z, h) => {
  cube(x, 0, z, x, h, z, OAK_LOG);
  block(x - 1, h - 2, z, OAK_LOG); block(x - 2, h - 1, z, OAK_LOG);
  block(x + 1, h - 3, z, OAK_LOG); block(x + 2, h - 2, z, OAK_LOG);
  block(x - 2, h, z, SNOW); block(x + 2, h - 1, z, SNOW);
};
deadTree(-7, 8, 8);
deadTree(12, -10, 6);

// Boulder with a snow cap, left of the rhino
sphere(-8, 0, -2, 2, STONE);
block(-8, 2, -2, SNOW);

// ---- Characters ----
// Main woolly rhinoceros, centre stage
rhino(0, 0, 1, 1);

// Calf beside the mother, smaller scale
rhino(9, -1, 0.55, 5);