// big-ben-4x-fable — prompt:
// Big Ben...

// Big Ben — Elizabeth Tower with a wing of the Palace of Westminster,
// a forecourt, Victorian lamps, and a red double-decker bus.
// Camera is NORTH (-Z): tower in front, palace receding south behind it.

// ---------- site clearing (trees in the footprint / sightline) ----------
cube(-6, 0, -15, 6, 33, -2, AIR);      // tower volume
cube(-8, 0, -5, 8, 16, 17, AIR);       // palace volume
cube(-9, 1, -22, 9, 12, -13, AIR);     // forecourt sightline
cube(-17, 1, -21, -6, 9, -15, AIR);    // bus spot

// ---------- Elizabeth Tower ----------
// foundation + stepped stone plinth (11x11)
cube(-5, -2, -13, 5, -1, -3, STONE);
cube(-5, 0, -13, 5, 1, -3, STONE);

// shaft y2..18 (7x7, warm limestone = PLANKS, stone quoins)
cube(-3, 2, -11, 3, 18, -11, PLANKS);
cube(-3, 2, -5, 3, 18, -5, PLANKS);
cube(-3, 2, -10, -3, 18, -6, PLANKS);
cube(3, 2, -10, 3, 18, -6, PLANKS);
for (const [x, z] of [[-3, -11], [3, -11], [-3, -5], [3, -5]])
  cube(x, 2, z, x, 18, z, STONE);

// paired lancet window strips up every face, stone transoms every 4
for (const x of [-1, 1]) {
  cube(x, 4, -11, x, 17, -11, GLASS);
  cube(x, 4, -5, x, 17, -5, GLASS);
}
for (const z of [-9, -7]) {
  cube(-3, 4, z, -3, 17, z, GLASS);
  cube(3, 4, z, 3, 17, z, GLASS);
}
for (const y of [7, 11, 15]) {
  for (const x of [-1, 1]) { block(x, y, -11, STONE); block(x, y, -5, STONE); }
  for (const z of [-9, -7]) { block(-3, y, z, STONE); block(3, y, z, STONE); }
}

// corbelled cornice under the clock stage
cube(-4, 19, -12, 4, 19, -4, STONE);

// clock stage y20..26 (9x9, wider than the shaft like the real thing)
cube(-4, 20, -12, 4, 26, -12, PLANKS);
cube(-4, 20, -4, 4, 26, -4, PLANKS);
cube(-4, 20, -11, -4, 26, -5, PLANKS);
cube(4, 20, -11, 4, 26, -5, PLANKS);
// gold (sand) bands above and below the dials
cube(-4, 20, -12, 4, 20, -12, SAND); cube(-4, 26, -12, 4, 26, -12, SAND);
cube(-4, 20, -4, 4, 20, -4, SAND);   cube(-4, 26, -4, 4, 26, -4, SAND);
cube(-4, 20, -11, -4, 20, -5, SAND); cube(-4, 26, -11, -4, 26, -5, SAND);
cube(4, 20, -11, 4, 20, -5, SAND);   cube(4, 26, -11, 4, 26, -5, SAND);
for (const [x, z] of [[-4, -12], [4, -12], [-4, -4], [4, -4]])
  cube(x, 20, z, x, 26, z, STONE);

// clock dial: dark ring, white face, hands set to ~10:08
function clockFace(cx, cy, cz, axis) {
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const d = dx * dx + dy * dy;
      if (d > 12) continue;
      const id = d <= 6 ? SNOW : OAK_LOG;
      if (axis === 'x') block(cx + dx, cy + dy, cz, id);
      else block(cx, cy + dy, cz + dx, id);
    }
  }
  const put = (dx, dy) => axis === 'x'
    ? block(cx + dx, cy + dy, cz, OAK_LOG)
    : block(cx, cy + dy, cz + dx, OAK_LOG);
  put(0, 0); put(0, 1); put(0, 2);   // minute hand up
  put(-1, 1); put(-2, 1);            // hour hand toward 10
}
clockFace(0, 23, -12, 'x');   // north — the money shot
clockFace(0, 23, -4, 'x');    // south
clockFace(-4, 23, -8, 'z');   // west
clockFace(4, 23, -8, 'z');    // east

// upper cornice + corner pinnacles
cube(-4, 27, -12, 4, 27, -4, STONE);
for (const [x, z] of [[-4, -12], [4, -12], [-4, -4], [4, -4]]) block(x, 28, z, STONE);

// belfry y28..29 (5x5, louvred openings for the Great Bell)
cube(-2, 28, -10, 2, 29, -10, PLANKS);
cube(-2, 28, -6, 2, 29, -6, PLANKS);
cube(-2, 28, -9, -2, 29, -7, PLANKS);
cube(2, 28, -9, 2, 29, -7, PLANKS);
cube(0, 28, -10, 0, 29, -10, GLASS); cube(0, 28, -6, 0, 29, -6, GLASS);
cube(-2, 28, -8, -2, 29, -8, GLASS); cube(2, 28, -8, 2, 29, -8, GLASS);

// cast-iron spire, gilded finial
cube(-2, 30, -10, 2, 30, -6, COBBLE);
cube(-1, 31, -9, 1, 31, -7, COBBLE);
block(0, 32, -8, COBBLE);
block(0, 33, -8, SAND);

// entrance portal on the north plinth face
cube(-2, 0, -13, -2, 3, -13, STONE);
cube(2, 0, -13, 2, 3, -13, STONE);
cube(-2, 4, -13, 2, 4, -13, STONE);
cube(-1, 0, -13, 1, 2, -13, OAK_LOG);
block(0, 3, -13, OAK_LOG);

// ---------- Palace of Westminster wing (runs south behind the tower) ----------
cube(-7, -2, -4, 7, -1, -4, STONE);
cube(-7, -2, 16, 7, -1, 16, STONE);
cube(-7, -2, -3, -7, -1, 15, STONE);
cube(7, -2, -3, 7, -1, 15, STONE);
// walls
cube(-7, 0, -4, 7, 7, -4, PLANKS);
cube(-7, 0, 16, 7, 7, 16, PLANKS);
cube(-7, 0, -3, -7, 7, 15, PLANKS);
cube(7, 0, -3, 7, 7, 15, PLANKS);
// stone plinth course
cube(-7, 0, -3, -7, 0, 15, STONE);
cube(7, 0, -3, 7, 0, 15, STONE);
cube(-7, 0, 16, 7, 0, 16, STONE);
// roof + parapet + crenellations
cube(-6, 8, -3, 6, 8, 15, STONE);
cube(-7, 8, -4, 7, 8, -4, STONE);
cube(-7, 8, 16, 7, 8, 16, STONE);
cube(-7, 8, -3, -7, 8, 15, STONE);
cube(7, 8, -3, 7, 8, 15, STONE);
for (let x = -7; x <= 7; x += 2) { block(x, 9, -4, STONE); block(x, 9, 16, STONE); }
for (let z = -2; z <= 14; z += 2) { block(-7, 9, z, STONE); block(7, 9, z, STONE); }
// gothic lancets down both long facades, stone hoods above
for (let z = -1; z <= 14; z += 3) {
  cube(-7, 2, z, -7, 5, z, GLASS); block(-7, 6, z, STONE);
  cube(7, 2, z, 7, 5, z, GLASS);  block(7, 6, z, STONE);
}
for (const x of [-6, -4, 4, 6]) cube(x, 2, 16, x, 5, 16, GLASS);
// corner turrets with stone caps
for (const [x1, z1] of [[-7, -4], [6, -4], [-7, 15], [6, 15]]) {
  cube(x1, 0, z1, x1 + 1, 10, z1 + 1, PLANKS);
  cube(x1, 11, z1, x1 + 1, 11, z1 + 1, STONE);
}

// central lantern tower — offset east so it silhouettes beside Big Ben
cube(1, 0, 11, 5, 13, 11, PLANKS);
cube(1, 0, 15, 5, 13, 15, PLANKS);
cube(1, 0, 12, 1, 13, 14, PLANKS);
cube(5, 0, 12, 5, 13, 14, PLANKS);
for (const [x, z] of [[1, 11], [5, 11], [1, 15], [5, 15]]) cube(x, 0, z, x, 13, z, STONE);
for (const x of [2, 4]) cube(x, 10, 11, x, 12, 11, GLASS);
cube(3, 9, 11, 3, 12, 11, GLASS);
cube(1, 14, 11, 5, 14, 15, STONE);
cube(2, 15, 12, 4, 15, 14, COBBLE);
block(3, 16, 13, COBBLE);
block(3, 17, 13, SAND);

// ---------- forecourt ----------
cube(-2, 0, -22, 2, 0, -14, COBBLE);   // cobbled approach to the portal
for (const x of [-5, 5]) {              // Victorian lamp posts
  cube(x, -1, -17, x, 2, -17, OAK_LOG);
  block(x, 3, -17, GLASS);
  block(x, 4, -17, SAND);
}

// red double-decker bus rolling past, front-left of the tower
cube(-16, 0, -20, -8, 0, -16, COBBLE);                 // road pad
for (const [wx, wz] of [[-14, -19], [-14, -17], [-10, -19], [-10, -17]])
  block(wx, 1, wz, COBBLE);                            // wheels
cube(-15, 2, -19, -9, 5, -17, BRICK);                  // body
cube(-14, 3, -19, -10, 3, -19, GLASS);                 // lower windows (north side)
cube(-14, 5, -19, -10, 5, -19, GLASS);                 // upper deck windows
cube(-14, 3, -17, -10, 3, -17, GLASS);
cube(-14, 5, -17, -10, 5, -17, GLASS);
block(-9, 3, -18, GLASS); block(-9, 5, -18, GLASS);    // windscreens
cube(-15, 6, -19, -9, 6, -17, SNOW);                   // roof