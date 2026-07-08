// pokeball-4x-opus — prompt:
// a giant Poké Ball...

const CX = 0, CY = 15, CZ = 0, R = 13;
const Rin = R - 1.2, Rout = R + 0.3;

// ---- Poké Ball shell (top red, bottom white, dark equator band,
//      protruding white front button with dark ring + center press) ----
function classify(x, y, z) {
  const px = x - CX, py = y - CY, pz = z - CZ;
  const d = Math.hypot(px, py, pz);
  const lat = Math.hypot(px, py);          // offset from front/back axis

  // front button (faces NORTH / -Z, the camera side), protrudes outward
  if (pz < 0 && lat <= 5.4) {
    if (d >= Rin && d <= R + 1.35) {
      if (lat <= 1.4) return STONE;        // center press stud
      if (lat <= 3.7) return SNOW;         // white button face
      if (lat <= 5.4) return COBBLE;       // dark ring
    }
    return -1;
  }

  // main body
  if (d >= Rin && d <= Rout) {
    if (Math.abs(py) <= 1.7) return COBBLE;      // equator band (dark)
    return py > 0 ? BRICK : SNOW;                // top red / bottom white
  }
  return -1;
}

for (let x = CX - R - 2; x <= CX + R + 2; x++)
  for (let y = CY - R - 2; y <= CY + R + 2; y++)
    for (let z = CZ - R - 2; z <= CZ + R + 2; z++) {
      const b = classify(x, y, z);
      if (b !== -1) block(x, y, z, b);
    }

// ---- side latch buttons on the band (east + west) ----
sphere(R - 1, CY, 0, 2, STONE);
sphere(-(R - 1), CY, 0, 2, STONE);
sphere(R - 1, CY, 0, 1, COBBLE);
sphere(-(R - 1), CY, 0, 1, COBBLE);

// ---- display pedestal so the giant ball is presented, not floating ----
cylinder(0, -3, 0, 7, 2, COBBLE);   // wide base
cylinder(0, -1, 0, 5, 3, STONE);    // neck up to ball
disk(0, 2, 0, 4, STONE);            // cradle lip under the ball

// ---- decorative gem studs around the pedestal rim ----
block(5, 1, 0, ICE);
block(-5, 1, 0, ICE);
block(0, 1, 5, ICE);
block(0, 1, -5, ICE);
block(4, 1, 4, GLASS);
block(-4, 1, 4, GLASS);
block(4, 1, -4, GLASS);
block(-4, 1, -4, GLASS);