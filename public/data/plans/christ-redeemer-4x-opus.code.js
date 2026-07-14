// christ-redeemer-4x-opus — prompt:
// Christ the Redeemer...

const WHITE = SNOW, GREY = STONE, DARK = COBBLE;

// ============================================================
// CHRIST THE REDEEMER — facing NORTH (-Z), arms spread E/W (X)
// ============================================================

// ---------- Corcovado summit rock (irregular mound) ----------
for (let x = -12; x <= 12; x++) {
  for (let z = -8; z <= 9; z++) {
    const d = Math.hypot(x * 0.85, (z - 0.5) * 0.8);
    const h = Math.round(2 - d * 0.33);
    if (h >= -2) cube(x, -3, z, x, h, z, d > 6.5 ? GREY : DARK);
  }
}

// ---------- Pedestal / chapel base ----------
cube(-7, -3, -5, 7, 0, 7, GREY);     // embedded foundation
cube(-6, 0, -3, 6, 6, 6, DARK);      // pedestal shaft
cube(-7, 6, -4, 7, 7, 7, GREY);      // cornice cap
// pilasters on the front face
for (const px of [-5, -2, 2, 5]) cube(px, 0, -3, px, 6, -3, GREY);
// chapel doorway carved into the front
cube(-1, 1, -4, 1, 4, -2, AIR);
block(0, 5, -3, GREY);               // lintel keystone

// ---------- Robe body (stacked, tapering cross-sections) ----------
function hwAt(y) {
  if (y <= 13) return 5 - (y - 8) * (5 - 3) / 5;   // flared hem -> waist
  return 3 + (y - 13) * (4 - 3) / 7;               // waist -> shoulders
}
for (let y = 8; y <= 20; y++) {
  const hw = Math.round(hwAt(y));
  cube(-hw, y, -2, hw, y, 2, WHITE);
}
// robe fold grooves on the lit front face
for (const fx of [-3, -1, 1, 3]) line(fx, 8, -2, fx, 19, -2, GREY);
// waist sash
cube(-4, 13, -2, 4, 13, -2, GREY);
// robe hem shadow
cube(-5, 8, -2, 5, 8, -2, GREY);

// ---------- Outstretched arms (shoulder x=4 -> fingertip x=21) ----------
for (let x = 4; x <= 21; x++) {
  const t = (x - 4) / (21 - 4);
  const topY = Math.round(20 - t * 2);   // 20 -> 18 (slight downward slope)
  const botY = Math.round(17 - t * 1);   // 17 -> 16
  const dz = 2 - Math.round(t * 1);      // depth half 2 -> 1
  cube(x, botY, -dz, x, topY, dz, WHITE);      // east arm
  cube(-x, botY, -dz, -x, topY, dz, WHITE);    // west arm
}
// hands / palms at the tips
cube(20, 15, -1, 21, 18, 1, WHITE);
cube(-21, 15, -1, -20, 18, 1, WHITE);
// sleeve seam highlight along top of each arm
line(5, 20, 0, 20, 18, 0, GREY);
line(-5, 20, 0, -20, 18, 0, GREY);

// ---------- Drapery hanging between arms and body ----------
for (let x = 4; x <= 13; x++) {
  const t = (x - 4) / 9;
  const hangTo = 11 + Math.round(t * 5);   // longest near the body
  cube(x, hangTo, 0, x, 16, 2, WHITE);
  cube(-x, hangTo, 0, -x, 16, 2, WHITE);
  // drape edge shadow
  block(x, hangTo, 0, GREY);
  block(-x, hangTo, 0, GREY);
}

// ---------- Chest + collar ----------
cube(-3, 17, -2, 3, 20, 1, WHITE);       // broad chest
line(-2, 20, -2, 0, 21, -2, GREY);       // collar (left)
line(2, 20, -2, 0, 21, -2, GREY);        // collar (right)
// faint robe-fold relief on the chest
block(0, 18, -2, GREY);
block(0, 16, -2, GREY);

// ---------- Neck & head ----------
cube(-1, 21, -1, 1, 21, 1, WHITE);       // neck
sphere(0, 24, 0, 2, WHITE);              // head
// hair / crown shading on top and back
cube(-2, 25, -1, 2, 26, 2, GREY);
cube(-2, 22, 1, 2, 25, 2, GREY);
// calm face features on the north (front) side
block(-1, 24, -2, GREY);                 // left eye
block(1, 24, -2, GREY);                  // right eye
block(0, 23, -2, GREY);                  // beard / chin shadow

// ---------- Viewing terrace in front (north) ----------
cube(-8, 0, -8, 8, 0, -6, GREY);
for (let x = -8; x <= 8; x += 2) block(x, 1, -8, DARK);   // low parapet