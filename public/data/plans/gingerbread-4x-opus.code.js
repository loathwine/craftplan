// gingerbread-4x-opus — prompt:
// a gingerbread house...

const meta = null; // (ignored — this is a build script)

// ============================================================
//  GINGERBREAD HOUSE  — cozy candy cottage, front faces NORTH (-Z)
// ============================================================

// ---------- deterministic pseudo-scatter ----------
function h(x, z) { return ((x * 73856093) ^ (z * 19349663)) & 0xffff; }

// ---------- roof height profile (gabled, ridge along Z) ----------
const RIDGE_Y = 11, EAVE_Y = 6, HALF = 8;
function roofY(xx) {
  const t = Math.abs(xx) / HALF;
  return Math.round(RIDGE_Y - t * (RIDGE_Y - EAVE_Y));
}

// ============================================================
//  0. CLEAR the forest that stands where the cottage goes
// ============================================================
cube(-13, 1, -11, 13, 14, 12, AIR);

// ============================================================
//  1. SNOWY YARD
// ============================================================
disk(0, 0, 0, 12, SNOW);
disk(0, 0, 0, 10, SNOW);
// a little rolling snow so it isn't a flat pancake
for (let x = -12; x <= 12; x++) {
  for (let z = -10; z <= 11; z++) {
    if (x * x + z * z <= 132 && (h(x, z) % 11 === 0)) block(x, 1, z, SNOW);
  }
}

// ============================================================
//  2. COTTAGE SHELL  (gingerbread = OAK_LOG)
//     footprint x[-6..6]  z[-5..6]   walls y1..6
// ============================================================
// floor
cube(-6, 0, -5, 6, 0, 6, PLANKS);
// four walls (shell)
for (let y = 1; y <= 6; y++) {
  line(-6, y, -5, 6, y, -5, OAK_LOG);   // front (north)
  line(-6, y, 6, 6, y, 6, OAK_LOG);     // back  (south)
  line(-6, y, -5, -6, y, 6, OAK_LOG);   // west
  line(6, y, -5, 6, y, 6, OAK_LOG);     // east
}
// gingerbread corner-posts, iced
for (const [cx, cz] of [[-6, -5], [6, -5], [-6, 6], [6, 6]]) {
  for (let y = 1; y <= 6; y++) block(cx, y, cz, (y % 2 ? BRICK : PLANKS));
}

// ============================================================
//  3. GABLES  (fill triangle between wall-top y6 and roof)
// ============================================================
for (const gz of [-5, 6]) {
  for (let xx = -6; xx <= 6; xx++) {
    const top = roofY(xx) - 1;
    for (let y = 6; y <= top; y++) block(xx, y, gz, OAK_LOG);
  }
}
// round attic window in the FRONT gable (candy glass + icing frame)
hollowCube(-2, 7, -5, 2, 9, -5, SNOW);
cube(-1, 8, -5, 1, 8, -5, GLASS);
block(0, 8, -5, ICE);

// ============================================================
//  4. ROOF  (2-thick gingerbread slab with icing)
// ============================================================
for (let z = -7; z <= 8; z++) {
  for (let xx = -HALF; xx <= HALF; xx++) {
    const y = roofY(xx);
    block(xx, y, z, OAK_LOG);
    block(xx, y - 1, z, OAK_LOG);        // close the stair-gaps
    // icing on the eave rows + ridge, plus piped snow dabs
    if (Math.abs(xx) >= HALF - 1 || xx === 0) block(xx, y + 1, z, SNOW);
    else if (h(xx, z) % 5 === 0) block(xx, y + 1, z, SNOW);
  }
}
// ridge candy line (gumdrops) + scalloped eave icing along front/back edge
for (let z = -7; z <= 8; z += 1) block(0, RIDGE_Y + 1, z, (z % 2 ? BRICK : ICE));
for (const ez of [-7, 8]) {
  for (let xx = -HALF; xx <= HALF; xx++) block(xx, roofY(xx) + 1, ez, SNOW);
}
// icicles dripping from the front eave
for (let xx = -HALF; xx <= HALF; xx += 2) {
  const y = roofY(xx);
  block(xx, y - 2, -7, SNOW);
  if (h(xx, 7) % 2 === 0) block(xx, y - 3, -7, SNOW);
}

// ============================================================
//  5. WINDOWS  (candy-glass, iced frames + shutters)
// ============================================================
function window(x0, x1, z, side) {
  // frame
  hollowCube(x0 - 1, 2, z, x1 + 1, 5, z, SNOW);
  cube(x0, 3, z, x1, 4, z, GLASS);
  // window box with berries under the sill
  line(x0 - 1, 2, z, x1 + 1, 2, z, OAK_LOG);
  block(x0, 2, z, BRICK); block(x1, 2, z, BRICK);
  // cross muntin
  block(Math.round((x0 + x1) / 2), 3, z, SNOW);
}
window(-4, -3, -5);   // front-left
window(3, 4, -5);     // front-right
// side windows
hollowCube(-6, 2, 0, -6, 5, 1, SNOW); cube(-6, 3, 0, -6, 4, 1, GLASS);
hollowCube(6, 2, 0, 6, 5, 1, SNOW);   cube(6, 3, 0, 6, 4, 1, GLASS);

// ============================================================
//  6. DOOR + WREATH + CANDY-CANE PORCH
// ============================================================
// doorway (red candy door, arched, iced frame)
cube(-1, 1, -5, 1, 4, -5, BRICK);
block(0, 5, -5, BRICK);
hollowCube(-2, 1, -5, 2, 5, -5, SNOW);
block(0, 3, -5, SNOW);          // door knob / icing detail
block(-1, 1, -5, PLANKS); block(1, 1, -5, PLANKS);
// wreath above the door, stood proud of the wall (z=-6)
for (let a = 0; a < 8; a++) {
  const ang = a / 8 * Math.PI * 2;
  const wx = Math.round(0 + 1.4 * Math.cos(ang));
  const wy = Math.round(9 + 1.4 * Math.sin(ang));
  block(wx, wy, -6, LEAVES);
  if (a % 2 === 0) block(wx, wy, -6, BRICK); // berries
}
block(0, 9, -6, LEAVES);
// two candy canes flanking the door
function candyCane(x, z, h0, len) {
  for (let y = 0; y < len; y++) block(x, h0 + y, z, (y % 2 ? BRICK : SNOW));
  block(x, h0 + len, z, SNOW);
  const dir = x < 0 ? 1 : -1;
  block(x + dir, h0 + len, z, BRICK);
  block(x + dir, h0 + len - 1, z, SNOW);
}
candyCane(-3, -6, 1, 5);
candyCane(3, -6, 1, 5);
// gingerbread front step / porch path
for (let z = -6; z >= -10; z--) {
  const w = z >= -7 ? 1 : 0;
  for (let x = -1 - w; x <= 1 + w; x++) block(x, 1, z, ((x + z) % 2 === 0 ? BRICK : PLANKS));
}

// ============================================================
//  7. CHIMNEY (back-east) with icing + rising snow "smoke"
// ============================================================
cube(3, 6, 3, 4, 9, 4, BRICK);
cube(3, 6, 3, 4, 9, 4, BRICK);
hollowCube(3, 9, 3, 4, 9, 4, SNOW);   // iced cap
block(3, 6, 3, PLANKS);
for (let s = 0; s < 5; s++) block(3 + (s % 2), 10 + s, 4, SNOW); // smoke puffs

// ============================================================
//  8. PEPPERMINT SWIRLS + GUMDROP STUDS on the walls
// ============================================================
for (const [px, pz] of [[-6, 3], [6, 4], [-6, -2], [6, -1]]) {
  block(px, 4, pz, SNOW); // outer disc
  // stud it slightly proud
}
// gumdrops dotted along the wall base
for (let x = -6; x <= 6; x += 2) {
  block(x, 1, -5, (h(x, 0) % 3 === 0 ? ICE : BRICK));
}

// ============================================================
//  9. SNOW-FROSTED EVERGREENS in the yard
// ============================================================
function snowyTree(cx, cz, th) {
  cube(cx, 1, cz, cx, th, cz, OAK_LOG);
  for (let i = 0; i < 3; i++) {
    const r = 3 - i;
    const y = th + i * 2;
    disk(cx, y, cz, r, LEAVES);
    disk(cx, y + 1, cz, Math.max(1, r - 1), LEAVES);
    // snow dusting on each tier
    for (let x = -r; x <= r; x++)
      for (let z = -r; z <= r; z++)
        if (x * x + z * z <= r * r && (h(cx + x, cz + z) % 2 === 0))
          block(cx + x, y + 1, cz + z, SNOW);
  }
  block(cx, th + 7, cz, SNOW);      // snowy crown
  block(cx, th + 6, cz, ICE);       // tree-topper star
}
snowyTree(-10, -6, 3);
snowyTree(10, 8, 3);
snowyTree(-11, 8, 2);

// ============================================================
// 10. SNOWMAN out front (west of the path)
// ============================================================
(function snowman(cx, cz) {
  sphere(cx, 2, cz, 2, SNOW);
  sphere(cx, 5, cz, 1, SNOW);
  block(cx, 7, cz, OAK_LOG);        // top hat brim/base
  block(cx, 8, cz, BRICK);          // hat
  block(cx - 1, 6, cz - 1, STONE);  // eyes
  block(cx + 1, 6, cz - 1, STONE);
  block(cx, 5, cz - 2, BRICK);      // carrot nose
  block(cx, 4, cz - 2, BRICK); block(cx, 3, cz - 2, STONE); // buttons
  block(cx - 3, 4, cz, OAK_LOG); block(cx + 3, 4, cz, OAK_LOG); // arms
})(-8, -8);

// ============================================================
// 11. CANDY-CANE FENCE ringing the yard
// ============================================================
for (let a = 0; a < 28; a++) {
  const ang = a / 28 * Math.PI * 2;
  const fx = Math.round(11 * Math.cos(ang));
  const fz = Math.round(10.5 * Math.sin(ang));
  if (fz < -6 && Math.abs(fx) < 3) continue; // leave a gap for the path
  block(fx, 2, fz, (a % 2 ? BRICK : SNOW));
  block(fx, 1, fz, SNOW);
}