// stave-church-haiku55 — prompt:
// a Norwegian stave church in the snow...

// Norwegian stave church in the snow. Origin = feet on the floor line.
// Front (portal, dragon gables) faces north (-Z).

const ringCube = (a, y, id) => {
  cube(-a, y, -a, a, y, -a, id);
  cube(-a, y, a, a, y, a, id);
  cube(-a, y, -a + 1, -a, y, a - 1, id);
  cube(a, y, -a + 1, a, y, a - 1, id);
};

const spruce = (cx, cz, h) => {
  line(cx, 0, cz, cx, h, cz, OAK_LOG);
  for (let y = 3; y <= h; y++) {
    const r = Math.min(3, Math.floor((h + 1 - y) / 2));
    if (r <= 0) block(cx, y, cz, LEAVES);
    else disk(cx, y, cz, r, LEAVES);
  }
};

// Dragon-head gable finial. s = -1 north (front), +1 south (back)
const dragon = (s) => {
  const z = (d) => s * (4 + d);
  const zr = (a, b) => [Math.min(z(a), z(b)), Math.max(z(a), z(b))];
  line(0, 13, z(0), 0, 14, z(0), OAK_LOG);   // neck
  block(0, 15, z(0), OAK_LOG);               // join neck to head
  const [h1, h2] = zr(1, 2);
  cube(-1, 15, h1, 1, 15, h2, OAK_LOG);      // head
  const [s1, s2] = zr(2, 3);
  cube(0, 16, s1, 0, 16, s2, OAK_LOG);       // snout
  block(0, 16, z(1), GOLD);                  // crest
  block(-1, 15, z(1), NEON_RED);             // eyes
  block(1, 15, z(1), NEON_RED);
};

// 1. Clear old trees / terrain clutter inside the footprint
cube(-7, 1, -10, 7, 9, 10, AIR);

// 2. Snowy ground, cobble path, a couple of drifts
cube(-12, -1, -12, 12, -1, 12, SNOW);
cube(-1, -1, -12, 1, -1, -10, COBBLE);
cube(8, 0, -10, 10, 0, -8, SNOW);
cube(-10, 0, 3, -8, 0, 5, SNOW);

// 3. Stone foundations + timber floors
cube(-7, -1, -7, 7, 0, 7, COBBLE);
cube(-2, -1, -9, 2, 0, -7, COBBLE);
cube(-3, -1, 7, 3, 0, 10, COBBLE);
cube(-6, 1, -6, 6, 1, 6, PLANKS);
cube(-2, 1, -9, 2, 1, -7, PLANKS);
cube(-2, 1, 7, 2, 1, 10, PLANKS);

// 4. Svalgang: outer colonnade, beam row, eave, sloped gallery roof, snow
for (let t = -6; t <= 6; t++) {
  const post = t % 3 === 0 || Math.abs(t) === 6;
  for (const [x, z] of [[t, -6], [t, 6], [-6, t], [6, t]]) {
    if (post) line(x, 2, z, x, 3, z, OAK_LOG);
    block(x, 4, z, BROWN);
  }
}
ringCube(6, 5, OAK_LOG);
ringCube(5, 6, BLACK);
ringCube(6, 6, SNOW);
ringCube(5, 7, SNOW);

// 5. Nave: stave-post walls, solid cap, steep gable roof, snow on top
for (let y = 2; y <= 6; y++) ringCube(4, y, BROWN);
for (let y = 2; y <= 6; y++) {
  for (let t = -4; t <= 4; t += 2) {
    block(t, y, -4, OAK_LOG);
    block(t, y, 4, OAK_LOG);
    block(-4, y, t, OAK_LOG);
    block(4, y, t, OAK_LOG);
  }
}
cube(-4, 7, -4, 4, 7, 4, BROWN);
for (let k = 0; k <= 4; k++) cube(-(4 - k), 8 + k, -4, 4 - k, 8 + k, 4, BLACK);
for (let x = -4; x <= 4; x++) {
  const y = 13 - Math.abs(x);
  cube(x, y, -4, x, y, 4, SNOW);
}

// 6. Central lantern tower with stepped spire
for (let y = 8; y <= 18; y++) {
  ringCube(2, y, BROWN);
  for (const [x, z] of [[2, 2], [2, -2], [-2, 2], [-2, -2]]) block(x, y, z, OAK_LOG);
}
cube(-1, 13, -1, 1, 17, 1, AIR);
line(0, 14, -2, 0, 15, -2, AIR);
line(0, 14, 2, 0, 15, 2, AIR);
line(-2, 14, 0, -2, 15, 0, AIR);
line(2, 14, 0, 2, 15, 0, AIR);
block(0, 14, 0, GLOWSTONE);

ringCube(3, 19, BLACK);                    // eave
cube(-2, 20, -2, 2, 20, 2, BLACK);
cube(-1, 21, -1, 1, 21, 1, BLACK);
block(0, 22, 0, BLACK);
ringCube(3, 20, SNOW);
ringCube(2, 21, SNOW);
ringCube(1, 22, SNOW);
line(0, 23, 0, 0, 26, 0, OAK_LOG);         // spire
line(0, 27, 0, 0, 30, 0, GOLD);            // cross
block(-1, 28, 0, GOLD);
block(1, 28, 0, GOLD);

// 7. Nave interior, portals, windows, lamp
cube(-3, 2, -3, 3, 6, 3, AIR);
cube(-1, 2, -4, 1, 3, -4, AIR);            // nave portal
line(0, 2, -6, 0, 3, -6, AIR);             // gallery portal
cube(4, 3, 0, 4, 4, 0, AIR);
cube(-4, 3, 0, -4, 4, 0, AIR);
cube(2, 3, 4, 2, 4, 4, AIR);
cube(-2, 3, 4, -2, 4, 4, AIR);
cube(2, 3, -4, 2, 4, -4, AIR);
cube(-2, 3, -4, -2, 4, -4, AIR);
block(0, 5, 0, GLOWSTONE);

// 8. North porch with gable, lantern and dragon finial
for (const x of [-2, 2]) for (const z of [-9, -7]) line(x, 2, z, x, 4, z, OAK_LOG);
for (let k = 0; k <= 2; k++) cube(-2 + k, 5 + k, -9, 2 - k, 5 + k, -7, BLACK);
for (let x = -2; x <= 2; x++) {
  const y = 8 - Math.abs(x);
  cube(x, y, -9, x, y, -7, SNOW);
}
block(0, 4, -8, GLOWSTONE);
block(0, 8, -9, OAK_LOG);
block(0, 9, -9, OAK_LOG);
block(0, 9, -10, OAK_LOG);
block(0, 10, -10, OAK_LOG);
block(0, 10, -11, OAK_LOG);
block(-1, 10, -11, NEON_RED);
block(1, 10, -11, NEON_RED);

// 9. South chancel (apse) with its own gable
cube(-2, 2, 7, 2, 5, 10, BROWN);
cube(-1, 2, 8, 1, 4, 9, AIR);
for (const y of [2, 3, 4, 5]) {
  for (const [x, z] of [[2, 7], [-2, 7], [2, 10], [-2, 10]]) block(x, y, z, OAK_LOG);
}
line(2, 3, 8, 2, 4, 8, AIR);
line(-2, 3, 8, -2, 4, 8, AIR);
for (let k = 0; k <= 2; k++) cube(-2 + k, 6 + k, 7, 2 - k, 6 + k, 10, BLACK);
for (let x = -2; x <= 2; x++) {
  const y = 9 - Math.abs(x);
  cube(x, y, 7, x, y, 10, SNOW);
}

// 10. Dragon finials on both nave gables
dragon(-1);
dragon(1);

// 11. Background and framing spruces
spruce(-15, -12, 11);
spruce(15, 9, 9);
spruce(-15, 9, 12);