// sabertooth-4x-fable — prompt:
// a sabertooth tiger...

// Sabertooth tiger (Smilodon) roaring from a rock outcrop, facing north (-Z)
// Palette: SAND fur, PLANKS light underside, OAK_LOG stripes, SNOW sabers/chest, BRICK mouth

// -- clear vegetation from the build footprint --
cube(-8, 0, -22, 8, 9, 15, AIR);
cube(7, 0, -10, 14, 8, 6, AIR);

const FUR = SAND, DK = OAK_LOG, LT = PLANKS;

function h(x, z) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// elliptical body cross-section: light belly, optional stripe ring on upper shell
function slice(z, cy, rx, ry, stripe) {
  const xr = Math.ceil(rx), ylo = Math.floor(cy - ry), yhi = Math.ceil(cy + ry);
  for (let x = -xr; x <= xr; x++) {
    for (let y = ylo; y <= yhi; y++) {
      const dx = x / (rx + 0.4), dy = (y - cy) / (ry + 0.4), d = dx * dx + dy * dy;
      if (d <= 1) {
        let id = FUR;
        if (y < cy - ry + 1.7) id = LT;
        if (stripe && d > 0.5 && y > cy - 1) id = DK;
        block(x, y, z, id);
      }
    }
  }
}

// -- rock outcrop under the forequarters --
for (let x = -7; x <= 7; x++) {
  for (let z = -15; z <= -4; z++) {
    const d = Math.max(Math.abs(x) / 7.5, Math.abs(z + 9.5) / 6.2), n = h(x, z);
    if (d + n * 0.25 < 1) block(x, 0, z, n > 0.6 ? COBBLE : STONE);
    if (d + n * 0.3 < 0.85) block(x, 1, z, n > 0.5 ? STONE : COBBLE);
    if (d < 0.72 - n * 0.2) block(x, 2, z, STONE);
  }
}
// solid pads under the front paws
cube(-5, 0, -14, -1, 2, -11, STONE);
cube(1, 0, -10, 5, 2, -7, STONE);

// -- body: deep chest and high shoulders sloping to low hindquarters --
const striped = { "-5": 1, "-2": 1, "1": 1, "4": 1, "7": 1, "10": 1 };
for (let z = -9; z <= 12; z++) {
  const t = (z + 9) / 21;
  slice(z, 11 - 2 * t, 5 - 2 * t, 5.5 - 2 * t, !!striped[String(z)]);
}
// shoulder hump
cube(-2, 17, -9, 2, 17, -4, FUR);
cube(-1, 18, -8, 1, 18, -6, FUR);

// haunches: thigh slabs with a curved dark stripe
for (let y = 5; y <= 11; y++) {
  for (let z = 6; z <= 12; z++) {
    const dy = (y - 8.2) / 3.6, dz = (z - 9) / 3.6, d = dy * dy + dz * dz;
    if (d <= 1) {
      const id = (d > 0.55 && y > 7) ? DK : FUR;
      block(-4, y, z, id);
      block(4, y, z, id);
    }
  }
}

// -- thick neck rising to the head --
slice(-10, 11.5, 4.2, 4.6, false);
slice(-11, 11.8, 3.6, 4.0, false);
slice(-12, 12.0, 3.2, 3.6, true);
slice(-13, 12.2, 3.0, 3.2, false);

// white chest bib between the forelegs
cube(-2, 6, -11, 2, 10, -9, LT);
cube(-1, 7, -11, 1, 9, -11, SNOW);

// -- head --
cube(-3, 11, -18, 3, 17, -12, FUR);        // skull
cube(-2, 18, -17, 2, 18, -13, FUR);        // rounded crown
for (const s of [-4, 4]) {                 // jaw-muscle cheeks with light ruff
  cube(s, 13, -17, s, 15, -13, FUR);
  cube(s, 12, -17, s, 12, -13, LT);
}
block(-5, 13, -15, LT); block(5, 13, -15, LT);
block(-5, 12, -14, LT); block(5, 12, -14, LT);
// small round ears
cube(-3, 18, -14, -2, 19, -13, FUR);
cube(2, 18, -14, 3, 19, -13, FUR);
block(-2, 18, -14, DK); block(2, 18, -14, DK);
// muzzle: light lips, tan bridge, dark nose
cube(-2, 14, -22, 2, 14, -19, FUR);
cube(-2, 12, -22, 2, 13, -19, LT);
cube(-1, 14, -22, 1, 14, -22, DK);
// open mouth: red palate, dropped jaw, tongue
cube(-1, 11, -21, 1, 11, -18, BRICK);
cube(-1, 8, -22, 1, 9, -16, LT);
for (let z = -21; z <= -17; z++) block(0, 9, z, BRICK);
block(-1, 9, -22, SNOW); block(1, 9, -22, SNOW);   // lower canines
cube(-1, 10, -16, 1, 10, -14, LT);                 // jaw hinge / chin
// brow ledge and eyes
cube(-3, 16, -19, 3, 16, -19, DK);
block(-3, 15, -18, SNOW); block(-2, 15, -18, STONE);
block(3, 15, -18, SNOW); block(2, 15, -18, STONE);
block(-3, 14, -18, DK); block(3, 14, -18, DK);     // tear lines
// forehead markings
block(0, 18, -16, DK); block(0, 18, -14, DK);
block(-2, 18, -15, DK); block(2, 18, -15, DK);
// -- the sabers: long white canines curving back --
for (const s of [-2, 2]) {
  block(s, 11, -22, SNOW);
  cube(s, 9, -21, s, 11, -21, SNOW);
  cube(s, 6, -20, s, 8, -20, SNOW);
  cube(s, 4, -19, s, 5, -19, SNOW);
}

// -- forelegs: left planted forward on the rock lip, right braced back --
cube(-4, 3, -13, -2, 7, -11, FUR);
cube(2, 3, -9, 4, 7, -7, FUR);
cube(-5, 5, -13, -5, 7, -12, FUR);   // shoulder/forearm bulges
cube(5, 5, -9, 5, 7, -8, FUR);
cube(-5, 3, -14, -1, 3, -11, LT);    // paws
cube(-4, 3, -15, -2, 3, -15, SNOW);  // toes
cube(1, 3, -10, 5, 3, -7, LT);
cube(2, 3, -11, 4, 3, -11, SNOW);

// -- hind legs: diagonal gait (right hind forward, left hind back) --
cube(-4, 1, 10, -3, 5, 11, FUR);
cube(-4, 4, 12, -3, 6, 12, FUR);     // hock
cube(3, 1, 8, 4, 5, 9, FUR);
cube(3, 4, 10, 4, 6, 10, FUR);
cube(-4, 0, 7, -2, 1, 10, LT);       // paws
cube(-4, 0, 6, -2, 0, 6, SNOW);
cube(2, 0, 5, 4, 1, 8, LT);
cube(2, 0, 4, 4, 0, 4, SNOW);

// bobtail with dark tip, flicked up
cube(-1, 10, 13, 0, 11, 14, FUR);
cube(-1, 12, 14, 0, 12, 14, DK);

// -- prey remains east of the rock: bison skull and ribcage --
cube(8, 0, -7, 12, 2, -4, SNOW);
cube(9, 0, -9, 11, 1, -8, SNOW);
block(9, 2, -7, STONE); block(11, 2, -7, STONE);
block(7, 2, -6, SNOW); block(7, 3, -5, SNOW);
block(13, 2, -6, SNOW); block(13, 3, -5, SNOW);
line(10, 0, -2, 10, 0, 5, SNOW);
for (const zr of [-1, 1, 3]) {
  const arc = [[8, 0], [8, 1], [9, 2], [10, 2], [11, 2], [12, 1], [12, 0]];
  for (const p of arc) block(p[0], p[1], zr, SNOW);
}
cube(9, 0, 5, 11, 1, 6, SNOW);

// -- ice-age ground dressing: boulders and snow patches --
sphere(-9, 0, 3, 2, STONE);
sphere(12, 0, 9, 2, COBBLE);
block(-8, 0, -2, COBBLE); block(6, 1, -3, COBBLE);
disk(-9, 0, 10, 3, SNOW);
disk(7, 0, 12, 2, SNOW);
disk(-11, 0, -14, 2, SNOW);
disk(13, 0, 13, 2, SNOW);
disk(-6, 0, 16, 2, SNOW);