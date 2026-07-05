// werewolf-4x-fable — prompt:
// a werewolf howling at the moon...

// A werewolf howling at the full moon — hulking brown lycan atop a stone crag,
// huge moon overhead, ritual menhirs, bones, and a small pack-mate answering the call.
const FUR = OAK_LOG, DK = DIRT, LT = PLANKS;

function h(a, b) { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); }

// ===== FULL MOON (high, north-east) =====
sphere(14, 26, -8, 7, SNOW);
// crater shading
cube(9, 24, -4, 10, 25, -3, STONE);
cube(13, 30, -3, 14, 30, -2, STONE);
cube(18, 24, -5, 18, 25, -4, STONE);
block(11, 29, -2, STONE);
block(16, 21, -5, STONE);

// ===== ROCKY CRAG =====
disk(0, -1, 0, 7, STONE);
for (let y = 0; y <= 7; y++) {
  const r = Math.max(3, Math.round(6.8 - 0.55 * y));
  disk(Math.round(0.25 * y), y, 0, r, STONE);
}
// cobble mottling on the flanks
for (let a = 0; a < 40; a++) {
  const ang = a * 0.9;
  const y = Math.floor(h(a, 7) * 8);
  const r = 6.8 - 0.55 * y;
  block(Math.round(Math.cos(ang) * r + 0.25 * y), y, Math.round(Math.sin(ang) * r), COBBLE);
}
// mossy rim at the base
for (let i = 0; i < 12; i++) {
  if (h(i, 3) < 0.6) {
    const ang = i * 0.524;
    block(Math.round(Math.cos(ang) * 6.5), 0, Math.round(Math.sin(ang) * 6.5), GRASS);
  }
}

// ===== WEREWOLF (feet on crag top y=8, facing +X, head thrown back) =====
// hips / belly / chest (leaning back, chest thrust up)
sphere(0, 13, 0, 2, FUR);
sphere(1, 15, 0, 2, FUR);
sphere(2, 17, 0, 3, FUR);
sphere(4, 16, 0, 1.7, LT);          // pale chest patch
// neck rising forward-up
sphere(3, 20, 0, 1.5, FUR);
sphere(4, 21, 0, 1.4, FUR);
// head
sphere(5, 22, 0, 2, FUR);

// mirrored parts
for (const s of [-1, 1]) {
  const zc = 2 * s;
  // digitigrade leg: foot + toe claws
  cube(1, 8, zc, 3, 8, zc, FUR);
  block(4, 8, zc, SNOW); block(4, 8, zc + s, SNOW);
  // shin sweeping up and back
  line(2, 9, zc, 0, 12, zc, FUR);
  line(3, 9, zc, 1, 12, zc, FUR);
  // thigh haunch
  sphere(1, 11, zc, 1.6, FUR);
  block(1, 11, zc + 2 * s, DK);
  // shoulder
  sphere(2, 18, 3 * s, 1.4, FUR);
  // arm: shoulder -> elbow -> clawed hand, flexed outward
  line(2, 18, 3 * s, 3, 15, 4 * s, FUR);
  line(2, 17, 3 * s, 3, 14, 4 * s, FUR);
  line(3, 15, 4 * s, 5, 13, 5 * s, FUR);
  line(3, 14, 4 * s, 5, 12, 5 * s, FUR);
  sphere(5, 12, 5 * s, 1.2, FUR);
  block(6, 11, 5 * s, SNOW); block(6, 11, 4 * s, SNOW); block(6, 11, 6 * s, SNOW);
  // pointed ear
  cube(3, 24, s, 3, 25, s, FUR);
  block(3, 26, s, DK);
  // glowing eye
  block(5, 24, s, BRICK);
  // upper snout sides + fang
  line(6, 23, s, 8, 25, s, FUR);
  block(8, 24, s, SNOW);
  // lower jaw sides
  line(6, 21, s, 8, 21, s, FUR);
}

// muzzle ridge angled at the moon
line(6, 23, 0, 9, 26, 0, FUR);
block(9, 27, 0, DK);                 // nose
// open mouth: red interior + tongue, jaw dropped
line(6, 22, 0, 8, 24, 0, BRICK);
block(8, 23, 0, BRICK);
line(6, 21, 0, 9, 22, 0, FUR);

// dark mane down the spine
[[1,21,0],[0,20,0],[-1,19,0],[-1,18,0],[-2,16,0],[-2,15,0],[-1,14,0],
 [0,19,1],[0,19,-1],[-1,17,1],[-1,17,-1]].forEach(p => block(p[0], p[1], p[2], DK));
// scruffy fur tufts
[[5,17,1],[4,19,-2],[2,20,2],[3,14,-2],[1,14,2],[0,16,-2]].forEach(p => block(p[0], p[1], p[2], DK));

// bushy tail hanging behind the crag
sphere(-2, 12, 0, 1.4, FUR);
sphere(-4, 11, 0, 1.4, FUR);
sphere(-5, 9, 0, 1.3, DK);

// ===== SMALL GRAY WOLF answering the howl (sitting, muzzle up) =====
sphere(-11, 1, 10, 1.6, STONE);
sphere(-9, 2, 10, 1.3, STONE);
cube(-9, 0, 9, -9, 1, 9, STONE);
cube(-9, 0, 11, -9, 1, 11, STONE);
line(-9, 3, 10, -8, 3, 10, STONE);
sphere(-8, 4, 10, 1.2, STONE);
line(-7, 5, 10, -6, 6, 10, STONE);
block(-8, 5, 9, STONE); block(-8, 5, 11, STONE);
block(-12, 0, 11, COBBLE); block(-13, 0, 11, COBBLE);

// ===== RITUAL MENHIRS ringing the crag =====
cube(10, 0, 0, 10, 4, 0, STONE);  cube(11, 0, 0, 11, 2, 0, STONE);  block(10, 5, 0, COBBLE);
cube(0, 0, 10, 0, 4, 10, STONE);  cube(1, 0, 10, 1, 2, 10, STONE);  block(0, 5, 10, COBBLE);
cube(-10, 1, -3, -10, 5, -3, STONE); cube(-10, 1, -2, -10, 3, -2, STONE); block(-10, 6, -3, COBBLE);
cube(4, 0, -12, 4, 4, -12, STONE); cube(5, 0, -12, 5, 2, -12, STONE); block(4, 5, -12, COBBLE);

// ===== OLD KILL — bleached bones in front of the crag =====
block(7, 0, 3, SNOW); block(8, 0, 3, SNOW); block(9, 0, 3, SNOW);       // spine
block(7, 1, 2, SNOW); block(7, 1, 4, SNOW);                              // ribs
block(8, 1, 2, SNOW); block(8, 1, 4, SNOW);
block(10, 0, 3, SNOW); block(10, 1, 3, SNOW); block(11, 0, 3, SNOW);    // skull

// ===== SCATTERED BOULDERS =====
sphere(-6, 0, -5, 2, COBBLE);
sphere(6, 0, -4, 1.5, STONE);
sphere(-5, 0, 6, 1.5, COBBLE);