// submarine-4x-fable — prompt:
// a submarine...

const CY = 3;
const RMAX = 4.2;
function radiusAt(x) {
  if (x > 10) { const t = (18 - x) / 8; return t <= 0 ? 0 : RMAX * Math.sqrt(t); }
  if (x < -11) { const t = (x + 19) / 8; return t <= 0 ? 0 : RMAX * Math.pow(t, 0.55); }
  return RMAX;
}

// Clear trees over the water/hull footprint, plus a tall column for the sail and masts
cube(-22, 1, -12, 22, 11, 12, AIR);
cube(-7, 12, -4, 6, 22, 4, AIR);

// Ocean surface (skip cells the hull will occupy)
for (let x = -22; x <= 22; x++) {
  for (let z = -12; z <= 12; z++) {
    const e = (x / 22.5) * (x / 22.5) + (z / 12.5) * (z / 12.5);
    if (e > 1) continue;
    if (x >= -19 && x <= 18) {
      const r = radiusAt(x);
      const s = r * r - 4;
      if (s > 0 && Math.abs(z) <= Math.sqrt(s)) continue;
    }
    block(x, 1, z, GLASS);
  }
}

// Hull: cigar body, bow east. COBBLE below water, BRICK boot stripe at the waterline, STONE above
for (let x = -18; x <= 17; x++) {
  const r = radiusAt(x);
  if (r <= 0.4) continue;
  for (let dy = -Math.floor(r); dy <= Math.ceil(r); dy++) {
    const s = r * r - dy * dy;
    if (s < 0) continue;
    const hw = Math.floor(Math.sqrt(s));
    const wy = CY + dy;
    if (wy < -2) continue;
    let id = STONE;
    if (wy < 2) id = COBBLE;
    else if (wy === 2) id = BRICK;
    for (let z = -hw; z <= hw; z++) block(x, wy, z, id);
  }
}

// Walkway deck along the spine
for (let x = -13; x <= 13; x++) {
  for (let z = -1; z <= 1; z++) block(x, 7, z, PLANKS);
}

// Portholes on the north (camera) side
for (let x = -10; x <= 8; x += 3) block(x, 4, -4, GLASS);

// Sail (conning tower) with faired base
cube(-6, 7, -2, 4, 8, 2, COBBLE);
cube(-5, 9, -1, 2, 15, 1, COBBLE);
cube(3, 9, -1, 3, 12, 1, COBBLE);
cube(4, 9, -1, 4, 10, 1, COBBLE);
cube(-6, 9, -1, -6, 11, 1, COBBLE);
cube(-5, 15, -1, 2, 15, 1, STONE);

// Bridge windows wrapping the top front of the sail
line(-4, 14, -1, 1, 14, -1, GLASS);
block(2, 14, -1, GLASS);
block(2, 14, 0, GLASS);
block(2, 14, 1, GLASS);

// Sail dive planes
cube(-3, 11, -5, 0, 11, 5, STONE);

// White hull marking on sail face
block(-4, 10, -1, SNOW);
block(-3, 10, -1, SNOW);

// Masts: periscope with radar dome, attack scope, flag
line(-3, 16, 0, -3, 20, 0, STONE);
block(-3, 21, 0, SNOW);
line(0, 16, 0, 0, 18, 0, STONE);
line(1, 16, 0, 1, 19, 0, OAK_LOG);
cube(2, 17, 0, 4, 18, 0, BRICK);

// Stern: rudder above and below, horizontal stern planes
cube(-18, 7, 0, -14, 8, 0, STONE);
cube(-18, 9, 0, -16, 10, 0, STONE);
cube(-18, -1, 0, -15, 0, 0, STONE);
cube(-18, 3, -6, -14, 3, 6, STONE);

// Propeller: shaft, hub, four twisted bronze blades breaking the surface
line(-19, 3, 0, -20, 3, 0, STONE);
block(-21, 3, 0, STONE);
block(-21, 4, 0, BRICK); block(-21, 5, 0, BRICK); block(-21, 6, 1, BRICK);
block(-21, 2, 0, BRICK); block(-21, 1, 0, BRICK); block(-21, 0, -1, BRICK);
block(-21, 3, -1, BRICK); block(-21, 3, -2, BRICK); block(-21, 2, -3, BRICK);
block(-21, 3, 1, BRICK); block(-21, 3, 2, BRICK); block(-21, 4, 3, BRICK);

// Deck fittings: hatches and a forward deck gun
block(-10, 8, 0, COBBLE);
block(8, 8, 0, COBBLE);
block(10, 8, 0, COBBLE);
block(10, 9, 0, STONE);
line(11, 9, 0, 14, 9, 0, STONE);

// Foam along the waterline (alternating), bow V-wake, stern prop wash
for (let x = -14; x <= 15; x++) {
  if ((x & 1) === 0) continue;
  const r = radiusAt(x);
  const s = r * r - 4;
  if (s <= 0) continue;
  const hw = Math.floor(Math.sqrt(s));
  block(x, 1, -(hw + 1), SNOW);
  block(x, 1, hw + 1, SNOW);
}
block(18, 1, 0, SNOW);
block(17, 1, -1, SNOW);
block(17, 1, 1, SNOW);
line(16, 1, -2, 8, 1, -7, SNOW);
line(16, 1, 2, 8, 1, 7, SNOW);
line(7, 1, -8, 0, 1, -10, SNOW);
line(7, 1, 8, 0, 1, 10, SNOW);
[[-20, 0], [-21, -1], [-21, 1], [-22, -2], [-22, 0], [-22, 2], [-19, -2], [-19, 2]].forEach(function (p) {
  block(p[0], 1, p[1], SNOW);
});

// Channel buoy in the foreground (north side)
line(14, 1, -8, 14, 3, -8, OAK_LOG);
block(14, 4, -8, BRICK);
block(13, 1, -8, SNOW);
block(15, 1, -8, SNOW);
block(14, 1, -9, SNOW);
block(14, 1, -7, SNOW);

// A second sub's periscope peeking up in the background (south side)
block(-12, 1, 8, STONE);
block(-12, 2, 8, STONE);
block(-12, 3, 8, STONE);
block(-12, 4, 8, STONE);
block(-12, 4, 7, STONE);
block(-11, 1, 8, SNOW);
block(-13, 1, 8, SNOW);
block(-12, 1, 9, SNOW);
block(-12, 1, 7, SNOW);

// Gulls
block(9, 12, -6, SNOW);
block(10, 11, -6, SNOW);
block(11, 12, -6, SNOW);
block(0, 14, -8, SNOW);
block(1, 13, -8, SNOW);
block(2, 14, -8, SNOW);