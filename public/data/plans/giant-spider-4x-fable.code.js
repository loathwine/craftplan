// giant-spider-4x-fable — prompt:
// a giant spider...

const AIRv = AIR;

// ---- clear brush in front of the face / under the fangs ----
cube(-4, 1, 3, 4, 6, 9, AIR);

// =========================================================
// GIANT SPIDER — body faces +Z, web strung behind it (-Z)
// =========================================================

// ---- abdomen (big bulb, back) ----
sphere(0, 9, -10, 7, OAK_LOG);

// mottled chitin blobs on the abdomen surface
sphere(5, 13, -13, 1, COBBLE);
sphere(-5, 13, -13, 1, COBBLE);
sphere(6, 11, -8, 1, COBBLE);
sphere(-6, 11, -8, 1, COBBLE);
sphere(0, 15, -14, 1, COBBLE);
sphere(4, 14, -6, 1, COBBLE);
sphere(-4, 14, -6, 1, COBBLE);
sphere(6, 10, -14, 1, COBBLE);
sphere(-6, 10, -14, 1, COBBLE);

// red chevron war-markings painted on the abdomen's top surface
function abY(dx, dz) {
  const d = 49 - dx * dx - dz * dz;
  return d < 0 ? 2 : 9 + Math.floor(Math.sqrt(d));
}
for (let s = 0; s < 3; s++) {
  const zBase = -4 + s * 3; // dz of chevron tip
  for (let dx = -3; dx <= 3; dx++) {
    const dz = zBase + Math.abs(dx);
    if (dx * dx + dz * dz <= 45) block(dx, abY(dx, dz), -10 + dz, BRICK);
  }
}
// central stripe
for (let dz = -6; dz <= 4; dz++) block(0, abY(0, dz), -10 + dz, BRICK);

// bristle hairs
line(4, 14, -13, 6, 16, -14, STONE);
line(-4, 14, -13, -6, 16, -14, STONE);
line(3, 15, -7, 4, 17, -6, STONE);
line(-3, 15, -7, -4, 17, -6, STONE);

// spinnerets + silk strand up to the web
sphere(0, 8, -17, 1, STONE);
line(0, 9, -18, 0, 15, -19, SNOW);

// ---- cephalothorax ----
sphere(0, 8, -1, 4, OAK_LOG);
sphere(0, 10, -1, 2, STONE); // gray carapace crown

// ---- head ----
cube(-2, 5, 3, 2, 9, 6, OAK_LOG);
block(-2, 9, 6, AIR); block(2, 9, 6, AIR);   // round the corners
block(-2, 5, 6, AIR); block(2, 5, 6, AIR);
line(-2, 9, 5, 2, 9, 5, STONE);              // brow ridge

// eight-ish glowing red eyes on the face
block(-1, 8, 6, BRICK); block(1, 8, 6, BRICK);   // main pair
block(-2, 7, 6, BRICK); block(2, 7, 6, BRICK);   // side pair
block(-1, 6, 6, BRICK); block(1, 6, 6, BRICK);   // lower pair

// chelicerae + white fangs + venom drip
cube(-1, 3, 5, -1, 4, 6, OAK_LOG);
cube(1, 3, 5, 1, 4, 6, OAK_LOG);
block(-1, 2, 6, SNOW); block(1, 2, 6, SNOW);
block(-1, 1, 6, SNOW); block(1, 1, 6, SNOW);
block(-1, 0, 6, LEAVES); block(1, 0, 6, LEAVES);

// pedipalps
line(2, 5, 5, 5, 3, 8, OAK_LOG);
line(5, 3, 8, 6, 1, 10, OAK_LOG);
line(-2, 5, 5, -5, 3, 8, OAK_LOG);
line(-5, 3, 8, -6, 1, 10, OAK_LOG);

// ---- eight legs, knees arched above the body ----
const LEGS = [
  { sh: [4, 9, 1],  kn: [11, 16, 7],   ft: [17, 0, 12] },
  { sh: [4, 9, 0],  kn: [13, 16, 2],   ft: [20, 0, 4] },
  { sh: [4, 9, -2], kn: [13, 16, -6],  ft: [20, 0, -10] },
  { sh: [4, 9, -3], kn: [10, 15, -11], ft: [16, 0, -17] },
];
for (const m of [1, -1]) {
  for (const L of LEGS) {
    const [sx, sy, sz] = L.sh, [kx, ky, kz] = L.kn, [fx, fy, fz] = L.ft;
    sphere(sx * m, sy, sz, 1, STONE); // coxa joint
    // femur (thick: 3 strands)
    line(sx * m, sy, sz, kx * m, ky, kz, OAK_LOG);
    line(sx * m, sy + 1, sz, kx * m, ky + 1, kz, OAK_LOG);
    const hx = Math.round((sx + kx) / 2), hy = Math.round((sy + ky) / 2), hz = Math.round((sz + kz) / 2);
    line(sx * m, sy - 1, sz, hx * m, hy, hz, OAK_LOG);
    sphere(kx * m, ky, kz, 1, STONE); // knee joint
    // tibia, tapering
    line(kx * m, ky, kz, fx * m, fy, fz, OAK_LOG);
    const tx = Math.round((kx + fx) / 2), ty = Math.round((ky + fy) / 2), tz = Math.round((kz + fz) / 2);
    line(kx * m, ky + 1, kz, tx * m, ty + 1, tz, OAK_LOG);
    // foot planted into the ground + claw
    cube(fx * m, -1, fz, fx * m, 0, fz, STONE);
    block(fx * m + m, -1, fz, STONE);
  }
}

// =========================================================
// GIANT ORB WEB behind the spider, strung between two posts
// =========================================================
cube(12, -1, -19, 12, 24, -19, OAK_LOG);
cube(-12, -1, -19, -12, 24, -19, OAK_LOG);
line(12, 20, -19, 14, 22, -19, OAK_LOG);
line(-12, 20, -19, -14, 22, -19, OAK_LOG);
sphere(12, 26, -19, 2, LEAVES);
sphere(-12, 26, -19, 2, LEAVES);

const cy = 16, cz = -19;
const pts = [[10, 0], [7, 7], [0, 10], [-7, 7], [-10, 0], [-7, -7], [0, -10], [7, -7]];
for (const [px, py] of pts) line(0, cy, cz, px, cy + py, cz, SNOW);
for (const r of [0.5, 0.85]) {
  for (let i = 0; i < 8; i++) {
    const a = pts[i], b = pts[(i + 1) % 8];
    line(Math.round(a[0] * r), cy + Math.round(a[1] * r), cz,
         Math.round(b[0] * r), cy + Math.round(b[1] * r), cz, SNOW);
  }
}
// anchor strands to posts and ground
line(10, 16, -19, 12, 16, -19, SNOW);
line(-10, 16, -19, -12, 16, -19, SNOW);
line(7, 23, -19, 12, 24, -19, SNOW);
line(-7, 23, -19, -12, 24, -19, SNOW);
line(7, 9, -19, 12, 5, -19, SNOW);
line(-7, 9, -19, -12, 5, -19, SNOW);
line(0, 6, -19, 0, 1, -19, SNOW);

// cocoon-wrapped victim dangling from the web
line(4, 16, -19, 4, 13, -18, SNOW);
block(4, 13, -18, SNOW);
sphere(4, 11, -18, 2, SNOW);
block(3, 8, -18, STONE); block(5, 8, -18, STONE); // boots poking out

// =========================================================
// LAIR DRESSING
// =========================================================

// fresh mummified prey on the ground, head still free
sphere(10, 1, 7, 2, SNOW);
sphere(10, 1, 10, 2, SNOW);
cube(9, 0, 8, 11, 2, 9, SNOW);
block(10, 1, 4, SAND); // face

// old bones nearby
sphere(7, 0, 12, 1, SNOW);
block(5, 0, 11, SNOW);
block(6, 0, 10, SNOW);
line(5, 0, 14, 8, 0, 14, SNOW);

// egg sac cluster by the abdomen, silk-tied to mother
sphere(-10, 1, -13, 2, SNOW);
sphere(-13, 0, -10, 1, SNOW);
sphere(-8, 1, -15, 1, SNOW);
line(-10, 3, -13, -6, 8, -12, SNOW);

// hatched spiderlings scuttling around
function bug(x, y, z) {
  sphere(x, y + 1, z, 1, OAK_LOG);
  block(x, y + 1, z + 2, STONE);   // head
  block(x, y + 1, z - 2, OAK_LOG); // abdomen stub
  for (const m of [1, -1]) {
    line(x + m, y + 2, z - 1, x + 3 * m, y, z - 2, OAK_LOG);
    line(x + m, y + 2, z, x + 3 * m, y, z + 1, OAK_LOG);
    line(x + m, y + 2, z + 1, x + 3 * m, y, z + 2, OAK_LOG);
  }
}
bug(-9, 0, 7);
bug(12, 0, 14);
bug(15, 1, -4);