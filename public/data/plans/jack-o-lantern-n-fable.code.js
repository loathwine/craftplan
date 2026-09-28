// jack-o-lantern-n-fable — prompt:
// a glowing jack-o'-lantern...

const RX = 10.5, RZ = 10.5, RY = 7, CY = 7;

// clear the site (trees/leaves) where the pumpkin and props go
cube(-15, 0, -14, 15, 18, 14, AIR);

function inEye(x, y, ex) {
  // upward-pointing triangle eyes
  if (y < 8 || y > 11) return false;
  return Math.abs(x - ex) <= (11 - y) * 0.95 + 0.2;
}
function inNose(x, y) {
  if (y < 6 || y > 8) return false;
  return Math.abs(x) <= (8 - y) * 0.75 + 0.2;
}
function inMouth(x, y) {
  if (Math.abs(x) > 7) return false;
  const lo = 2.6 + (x * x) / 14;      // grin curves upward at the corners
  const hi = 5.4 + (x * x) / 40;
  if (y < lo || y > hi) return false;
  // teeth
  if ((Math.abs(x) === 3 || Math.abs(x) === 4) && y >= hi - 1) return false;   // upper fangs
  if (Math.abs(x) <= 0 && y <= lo + 1) return false;                              // bottom tooth
  return true;
}

for (let x = -11; x <= 11; x++) {
  for (let y = 0; y <= 14; y++) {
    for (let z = -11; z <= 11; z++) {
      const th = Math.atan2(z, x);
      const rib = Math.cos(8 * th);
      const bulge = 1 + 0.06 * rib;
      const d = Math.sqrt((x / RX) ** 2 + ((y - CY) / RY) ** 2 + (z / RZ) ** 2) / bulge;
      if (d > 1) continue;
      if (d > 0.85) {
        // outer skin: carve the face on the north side
        if (z < -2 && (inEye(x, y, -4) || inEye(x, y, 4) || inNose(x, y) || inMouth(x, y))) continue;
        let id = ORANGE;
        if (rib < -0.75) id = BROWN;              // crease lines between lobes
        if (y >= 13 && Math.abs(x) + Math.abs(z) <= 3) id = BROWN; // dark ring around the stem
        block(x, y, z, id);
      } else if (d > 0.52 && d < 0.66) {
        block(x, y, z, GLOWSTONE);               // inner glowing core seen through the face
      }
    }
  }
}

// candle inside
cylinder(0, 1, 0, 1, 3, WHITE);
block(0, 4, 0, FIRE);
block(0, 5, 0, FIRE);
block(0, 6, 0, LAVA);
// extra glow spilling from eyes and mouth
block(-4, 9, -6, GLOWSTONE);
block(4, 9, -6, GLOWSTONE);
block(0, 4, -7, GLOWSTONE);

// stem with a curl and vine
cylinder(0, 14, 1, 1, 3, GREEN);
line(0, 16, 1, 2, 18, 3, GREEN);
line(2, 18, 3, 3, 18, 5, LIME);
block(3, 17, 6, LIME);
// vine crawling down the back
line(1, 14, 3, 4, 9, 9, GREEN);
line(4, 9, 9, 8, 3, 10, GREEN);
line(8, 3, 10, 9, 0, 12, GREEN);
block(5, 8, 10, LIME); block(7, 4, 11, LIME); block(9, 1, 13, LIME);
// leaf on the stem
cube(-3, 15, 1, -1, 15, 3, LIME);
block(-4, 15, 2, GREEN); block(-2, 16, 2, GREEN);

// small pumpkins in the patch (front + sides so the camera sees them)
function miniPumpkin(px, pz, r) {
  sphere(px, r - 1, pz, r, ORANGE);
  for (let a = 0; a < 4; a++) {
    const ax = Math.round(px + Math.cos(a * Math.PI / 2) * r);
    const az = Math.round(pz + Math.sin(a * Math.PI / 2) * r);
    block(ax, r - 1, az, BROWN);
  }
  cube(px, r * 2 - 1, pz, px, r * 2, pz, GREEN);
  block(px + 1, r * 2, pz, LIME);
}
miniPumpkin(-14, -7, 2);
miniPumpkin(14, -5, 2);
miniPumpkin(-11, -12, 1);
miniPumpkin(9, -13, 2);
miniPumpkin(-16, 3, 2);
miniPumpkin(15, 6, 1);
// ground vines linking them
line(-14, 0, -5, -11, 0, -1, GREEN);
line(-11, 0, -12, -9, 0, -9, GREEN);
line(14, 0, -3, 12, 0, 1, GREEN);
line(9, 0, -11, 7, 0, -8, GREEN);
line(-16, 0, 5, -12, 0, 6, GREEN);
line(15, 0, 8, 12, 0, 10, GREEN);

// scattered fallen leaves
for (let i = 0; i < 60; i++) {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  const f = s - Math.floor(s);
  const t = Math.cos(i * 78.233) * 12345.678;
  const g = t - Math.floor(t);
  const lx = Math.round(-18 + f * 36), lz = Math.round(-15 + g * 30);
  if (lx * lx + lz * lz < 130) continue;
  block(lx, 0, lz, [ORANGE, BROWN, YELLOW, RED][i % 4]);
}

// rustic fence behind the patch
for (let x = -16; x <= 16; x += 4) cube(x, 0, 13, x, 2, 13, OAK_LOG);
line(-16, 1, 13, 16, 1, 13, PLANKS);
line(-16, 2, 13, 16, 2, 13, PLANKS);
cube(-17, 0, 13, -17, 3, 13, OAK_LOG); block(-17, 4, 13, FIRE);
cube(17, 0, 13, 17, 3, 13, OAK_LOG); block(17, 4, 13, FIRE);

// torch posts flanking the front
cube(-12, 0, -11, -12, 2, -11, OAK_LOG); block(-12, 3, -11, FIRE);
cube(12, 0, -11, 12, 2, -11, OAK_LOG); block(12, 3, -11, FIRE);

// scarecrow at the back-left
cube(-13, 0, 8, -13, 5, 8, OAK_LOG);
line(-16, 4, 8, -10, 4, 8, OAK_LOG);
cube(-14, 2, 8, -12, 3, 8, BROWN);
cube(-13, 5, 8, -13, 6, 8, YELLOW);
block(-13, 7, 8, BLACK); cube(-14, 7, 8, -12, 7, 8, BLACK);
block(-13, 6, 7, NEON_RED);

// bats in the night sky
function bat(bx, by, bz) {
  block(bx, by, bz, BLACK);
  block(bx - 1, by + 1, bz, BLACK); block(bx + 1, by + 1, bz, BLACK);
  block(bx - 2, by + 1, bz, BLACK); block(bx + 2, by + 1, bz, BLACK);
  block(bx - 3, by, bz, BLACK); block(bx + 3, by, bz, BLACK);
}
bat(-8, 20, -4);
bat(9, 23, -2);
bat(2, 26, 3);
bat(-14, 24, 6);

// crescent moon glow, high and to the east so it silhouettes the bats
hollowSphere(15, 28, 8, 3, GLOWSTONE);
sphere(16, 28, 8, 3, AIR);