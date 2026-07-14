// golden-gate-4x-fable — prompt:
// the Golden Gate Bridge...

// Golden Gate Bridge — profile view from the north, span running east-west.
// Deck along X, towers straddling it in Z, water strait below, fog and a sailboat.

// --- Clear the corridor (trees/brush) where the bridge and strait go ---
cube(-22, 0, -12, 22, 13, 12, AIR);

// --- Water: the strait ---
cube(-18, -1, -10, 18, -1, 10, GLASS);

// --- Headlands (rocky cliffs at both ends) ---
function headland(s) {
  for (let y = -1; y <= 9; y++) {
    const inner = 19 + Math.floor((y + 1) / 3); // terraces: 19,20,21,22
    const x1 = s * inner, x2 = s * 22;
    cube(Math.min(x1, x2), y, -6, Math.max(x1, x2), y, 6, STONE);
  }
  // grass on the terrace tops
  cube(s * 19, 1, -6, s * 19, 1, 6, GRASS);
  cube(s * 20, 4, -6, s * 20, 4, 6, GRASS);
  cube(s * 21, 7, -6, s * 21, 7, 6, GRASS);
  // scrub bushes
  block(s * 19, 2, -3, LEAVES);
  block(s * 20, 5, 4, LEAVES);
  block(s * 21, 8, 0, LEAVES);
}
headland(1);
headland(-1);

// --- Towers (International Orange = BRICK) ---
function tower(cx) { // legs at x = cx..cx+1
  // concrete pier in the water
  cube(cx - 1, -2, -4, cx + 2, 0, 4, COBBLE);
  // two legs straddling the deck (north & south)
  cube(cx, 1, -3, cx + 1, 30, -2, BRICK);
  cube(cx, 1, 2, cx + 1, 30, 3, BRICK);
  // portal cross-braces between the legs
  for (const by of [15, 21, 27]) {
    cube(cx, by, -2, cx + 1, by + 1, 2, BRICK);
    // horizontal rib on the camera-facing (north) face
    cube(cx - 1, by + 1, -3, cx + 2, by + 1, -2, BRICK);
  }
  // saddle cap + beacon
  cube(cx, 31, -3, cx + 1, 32, 3, BRICK);
  block(cx, 33, 0, SNOW);
  block(cx + 1, 33, 0, SNOW);
}
tower(-13);
tower(12);

// --- Anchorages on the headlands ---
cube(20, 6, -2, 22, 12, 2, COBBLE);
cube(-22, 6, -2, -20, 12, 2, COBBLE);

// --- Deck ---
cube(-22, 10, -2, 22, 10, -2, BRICK);   // north edge girder
cube(-22, 10, 2, 22, 10, 2, BRICK);     // south edge girder
cube(-22, 10, -1, 22, 10, 1, STONE);    // roadway
cube(-22, 11, -2, 22, 11, -2, BRICK);   // north railing
cube(-22, 11, 2, 22, 11, 2, BRICK);     // south railing
cube(-22, 9, -2, 22, 9, -2, BRICK);     // under-deck truss edges
cube(-22, 9, 2, 22, 9, 2, BRICK);
// lane dashes
for (let x = -21; x <= 21; x += 4) block(x, 10, 0, SNOW);
// traffic
const cars = [
  [-18, -1, ICE], [-6, -1, SNOW], [5, -1, COBBLE], [15, -1, GLASS],
  [-10, 1, COBBLE], [0, 1, SNOW], [9, 1, ICE]
];
for (const [x, z, id] of cars) { block(x, 11, z, id); block(x + 1, 11, z, id); }

// --- Main suspension cables (catenary) ---
function cy(x) {
  const a = Math.abs(x);
  if (a <= 12) return 14 + 17 * (a / 12) * (a / 12); // main span sag
  if (a <= 13) return 31;                            // over the saddle
  return 31 - 2.375 * (a - 13);                      // side spans to anchorage
}
for (let x = -21; x < 21; x++) {
  const y0 = Math.round(cy(x)), y1 = Math.round(cy(x + 1));
  line(x, y0, -2, x + 1, y1, -2, BRICK);
  line(x, y0, 2, x + 1, y1, 2, BRICK);
}

// --- Vertical suspender cables ---
for (let x = -20; x <= 20; x += 3) {
  const a = Math.abs(x);
  if (a >= 12 && a <= 13) continue; // inside a tower
  const top = Math.round(cy(x)) - 1;
  if (top < 12) continue;
  line(x, 12, -2, x, top, -2, BRICK);
  line(x, 12, 2, x, top, 2, BRICK);
}

// --- Sailboat passing under the bridge (north side, in view) ---
cube(5, 0, -8, 9, 0, -6, PLANKS);
block(4, 0, -7, PLANKS);   // bow
block(10, 0, -7, PLANKS);  // stern
block(8, 1, -7, PLANKS);   // cabin
line(6, 1, -7, 6, 5, -7, OAK_LOG); // mast
cube(3, 2, -7, 5, 2, -7, SNOW);    // sail (faces the camera)
cube(4, 3, -7, 5, 3, -7, SNOW);
block(5, 4, -7, SNOW);

// --- Fog banks rolling in behind the bridge (classic SF) ---
sphere(-9, 5, 8, 2, SNOW);
sphere(3, 4, 9, 2, SNOW);
sphere(-4, 5, 8, 1, SNOW);
sphere(8, 4, 8, 1, SNOW);

// --- Whitecaps around the tower piers ---
block(-15, -1, 5, SNOW);
block(-10, -1, -5, SNOW);
block(-15, -1, -5, SNOW);
block(11, -1, 5, SNOW);
block(15, -1, -5, SNOW);
block(10, -1, -6, SNOW);
block(0, -1, -9, SNOW);
block(-3, -1, 6, SNOW);