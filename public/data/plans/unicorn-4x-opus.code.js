// unicorn-4x-opus — prompt:
// a unicorn...

// ==== A UNICORN — front (face + horn) toward NORTH (-Z), body running south (+Z) ====
// Palette: SNOW body, SAND golden horn, rainbow mane/tail, ICE/GLASS sparkle magic.

// -- clear the immediate build volume of forest leaves (local clear, not the whole site) --
cube(-7, 1, -13, 7, 24, 11, AIR);
cube(-20, 20, 12, 20, 30, 15, AIR); // clear space for the rainbow arc behind

const SNOWY = SNOW;

// ---------- LEGS ----------
const legXs = [-2, 2];
const legZs = [-2, 6];              // front pair (north) / back pair (south)
for (const lz of legZs) {
  for (const lx of legXs) {
    cylinder(lx, 0, lz, 1, 7, SNOWY);   // leg, base at ground y=0
    cylinder(lx, 0, lz, 1, 1, STONE);   // dark hoof
    // knee/muscle shaping
    block(lx + (lx > 0 ? -1 : 1), 4, lz, SNOWY);
  }
}

// ---------- TORSO (barrel of overlapping spheres) ----------
for (let z = -4; z <= 6; z += 1) {
  const r = (z >= -2 && z <= 4) ? 3 : 2;    // fuller mid-belly, tapered ends
  sphere(0, 9, z, r, SNOWY);
}
// chest fill toward the front & rump rounding
sphere(0, 9, -5, 2, SNOWY);
sphere(0, 10, 7, 2, SNOWY);
// belly underside connecting the legs
cube(-2, 6, -2, 2, 7, 6, SNOWY);

// ---------- NECK (rises up & forward toward north) ----------
cube(-2, 11, -5, 2, 14, -2, SNOWY);   // lower neck off the chest
cube(-2, 13, -7, 1, 16, -4, SNOWY);   // upper neck, leaning forward (-Z)

// ---------- HEAD + MUZZLE ----------
cube(-2, 14, -9, 1, 17, -6, SNOWY);   // skull
cube(-1, 13, -11, 1, 15, -9, SNOWY);  // muzzle poking north
block(-1, 13, -11, SNOWY);
// nostrils + eyes (dark)
block(-1, 13, -12, STONE);
block(1, 13, -12, STONE);
block(-2, 16, -8, STONE);
block(1, 16, -8, STONE);
// ears
for (const ex of [-2, 1]) { block(ex, 17, -6, SNOWY); block(ex, 18, -6, SNOWY); }

// ---------- GOLDEN SPIRAL HORN ----------
for (let i = 0; i < 8; i++) {
  const y = 17 + i;
  const z = -8 - Math.round(i * 0.45);          // leans forward, north
  const x = i % 2 === 0 ? 0 : (i % 4 === 1 ? 1 : -1); // slight spiral wobble
  block(x, y, z, SAND);
  if (i < 3) block(0, y, z, SAND);              // thicker base
}
block(0, 25, -12, ICE);                          // glowing magic tip

// ---------- RAINBOW MANE (cascading down neck, east side catches light) ----------
function maneBand(y1, y2, z1, z2, id) { cube(2, y1, z1, 3, y2, z2, id); }
maneBand(16, 17, -7, -4, BRICK);   // red crest
maneBand(14, 15, -6, -3, SAND);    // orange
maneBand(12, 13, -5, -2, LEAVES);  // green
maneBand(10, 11, -4, -1, ICE);     // cyan
maneBand(8, 9, -3, 0, GLASS);      // blue tail of mane
// crest along the very top ridge of the neck
line(0, 17, -5, 0, 14, -1, BRICK);
// forelock tuft between the ears over the forehead
block(-1, 18, -7, BRICK);
block(0, 18, -7, SAND);
block(0, 17, -8, SAND);

// ---------- RAINBOW TAIL (flowing off the rump, sweeping down & back +Z) ----------
cube(-1, 11, 7, 1, 12, 8, SNOWY);        // dock
cube(-1, 9, 8, 1, 12, 9, BRICK);
cube(-1, 6, 8, 1, 9, 10, SAND);
cube(-1, 4, 9, 1, 7, 10, LEAVES);
cube(-1, 2, 9, 1, 5, 11, ICE);
cube(-1, 0, 10, 1, 3, 11, GLASS);
block(0, 0, 11, GLASS);

// ---------- RAINBOW ARC in the background (behind the unicorn, arcing overhead) ----------
const bands = [[18, BRICK], [17, SAND], [16, LEAVES], [15, ICE], [14, GLASS]];
for (const [R, id] of bands) {
  for (let a = 0; a <= 180; a += 3) {
    const rad = a * Math.PI / 180;
    const x = Math.round(R * Math.cos(rad));
    const y = 3 + Math.round(R * Math.sin(rad));
    if (y < 1) continue;
    block(x, y, 13, id);
    block(x, y, 14, id);   // 2-thick for visibility
  }
}

// ---------- CLOUD PUFFS at the feet of the rainbow ----------
sphere(-17, 3, 13, 2, SNOWY);
sphere(-15, 2, 14, 2, SNOWY);
sphere(17, 3, 13, 2, SNOWY);
sphere(15, 2, 14, 2, SNOWY);

// ---------- FLOATING MAGIC SPARKLES ----------
const sparkles = [
  [-4, 20, -9], [3, 22, -7], [-6, 14, -6], [5, 16, -4],
  [-3, 24, -10], [4, 12, 2], [-5, 10, 5], [6, 19, 0],
  [2, 26, -11], [-2, 27, -8], [0, 29, -6]
];
for (let i = 0; i < sparkles.length; i++) {
  const [sx, sy, sz] = sparkles[i];
  block(sx, sy, sz, i % 2 === 0 ? ICE : GLASS);
}