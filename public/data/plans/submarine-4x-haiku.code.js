// submarine-4x-haiku — prompt:
// a submarine...

const STONE = 3;
const GLASS = 11;
const OAK_LOG = 4;
const COBBLE = 8;
const BRICK = 10;
const AIR = 0;

// Main hull body - elliptical cylinder running along Z axis (front at -Z)
for (let z = -16; z <= 16; z++) {
  for (let y = 0; y <= 4; y++) {
    for (let x = -4; x <= 4; x++) {
      const nx = x / 4.2;
      const ny = (y - 2) / 3.3;
      if (nx * nx + ny * ny <= 1.0) {
        block(x, y, z, STONE);
      }
    }
  }
}

// Hollow out interior crew space
for (let z = -14; z <= 14; z++) {
  for (let y = 1; y <= 3; y++) {
    for (let x = -3; x <= 3; x++) {
      const nx = x / 3.4;
      const ny = (y - 2) / 2.6;
      if (nx * nx + ny * ny <= 0.85) {
        block(x, y, z, AIR);
      }
    }
  }
}

// Front observation dome/viewport facing north
for (let x = -3; x <= 3; x++) {
  for (let y = 0; y <= 4; y++) {
    const d = Math.sqrt(x*x + (y-2)*(y-2));
    if (d <= 3.2 && d >= 1.8) {
      block(x, y, -17, GLASS);
    }
  }
}

// Side portholes along hull
for (let z = -13; z <= 13; z += 3) {
  block(-4, 2, z, GLASS);
  block(4, 2, z, GLASS);
}

// Conning tower (sail) on top center
cube(-2, 4, -3, 2, 7, 5, STONE);
cube(-1, 5, -2, 1, 6, 4, AIR);

// Conning tower observation windows
block(-2, 6, -1, GLASS);
block(2, 6, -1, GLASS);
block(-2, 6, 2, GLASS);
block(2, 6, 2, GLASS);

// Periscope assembly
line(0, 7, 0, 0, 11, 0, OAK_LOG);
block(0, 11, 0, GLASS);
block(0, 12, 0, GLASS);

// Antenna
block(1, 8, -1, OAK_LOG);
block(1, 9, -1, OAK_LOG);

// Rudder - vertical stabilizer at stern
cube(-0.5, 1, 17, 0.5, 4, 18, COBBLE);

// Horizontal diving planes (hydroplanes)
cube(-4, 1, 12, 4, 1, 14, COBBLE);
cube(-4, 3, 12, 4, 3, 14, COBBLE);

// Hull reinforcement bands
for (let z = -9; z <= 9; z += 6) {
  line(-4, 1, z, 4, 1, z, COBBLE);
  line(-4, 3, z, 4, 3, z, COBBLE);
}

// Torpedo tube openings
block(-2, 1, -14, BRICK);
block(-2, 2, -14, BRICK);
block(2, 1, -14, BRICK);
block(2, 2, -14, BRICK);

// Ventilation grates
for (let z = -12; z <= 12; z += 5) {
  block(-5, 2, z, COBBLE);
  block(5, 2, z, COBBLE);
}

// Ballast tank external housings
block(-5, 1, -5, STONE);
block(5, 1, -5, STONE);
block(-5, 1, 5, STONE);
block(5, 1, 5, STONE);

// Propeller shroud detail
for (let x = -3; x <= 3; x++) {
  for (let z = 18; z <= 20; z++) {
    const d = Math.sqrt(x*x);
    if (d <= 2.5) {
      block(x, 2, z, STONE);
    }
  }
}

// Aft fittings
block(0, 3, 17, BRICK);
block(0, 3, 18, BRICK);

// Bilge keel (anti-roll fin)
cube(4, 0, 5, 5, 2, 7, COBBLE);
cube(-5, 0, 5, -4, 2, 7, COBBLE);