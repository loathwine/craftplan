// snowplow-train-haiku55 — prompt:
// a steam train with a snowplow...

// Steam locomotive with a snowplow, running head-on toward the camera (front = -Z).
// Track runs along Z on x = -3 / +3. Plow at the nose, boiler behind, tender and coach at the rear.

// Clear the corridor for the train (AIR is free)
cube(-7, 0, -16, 7, 20, 22, AIR);

// Ballast, sleepers, rails
cube(-4, 0, -16, 4, 0, 22, COBBLE);
for (let z = -16; z <= 22; z += 2) cube(-4, 1, z, 4, 1, z, OAK_LOG);
line(-3, 2, -16, -3, 2, 22, IRON);
line(3, 2, -16, 3, 2, 22, IRON);

// Snow bank the plow is pushing, tapering away from the nose
for (let z = -22; z <= -14; z++) {
  const h = Math.min(3, Math.max(1, -14 - z));
  cube(-5, 0, z, 5, h - 1, z, SNOW);
}
// Side drifts
cube(-10, 0, -20, -7, 1, -12, SNOW);
cube(7, 0, -20, 10, 1, -12, SNOW);

// Snowy pine trees (LEAVES core, SNOW outer ring)
function pine(cx, cz) {
  for (let y = 0; y <= 2; y++) block(cx, y, cz, OAK_LOG);
  const tiers = [[3, 3], [4, 3], [5, 2], [6, 1]];
  for (const [y, r] of tiers) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        const d2 = dx * dx + dz * dz;
        if (d2 > r * r + 0.5) continue;
        block(cx + dx, y, cz + dz, d2 > (r - 1) * (r - 1) + 0.5 ? SNOW : LEAVES);
      }
    }
  }
  block(cx, 7, cz, SNOW);
}
pine(-11, -4);
pine(-12, 7);
pine(11, -5);
pine(12, 8);

// Trackside signal posts
for (const sx of [-6, 6]) line(sx, 0, -10, sx, 5, -10, IRON);
block(-6, 6, -10, NEON_RED);
block(6, 6, -10, LIME);

// Running gear: chassis, driving wheels, axles, side rods
cube(-2, 3, -8, 2, 4, 8, BLACK);
function wheel(x, yc, zc, r, id) {
  for (let y = -r; y <= r; y++) {
    for (let z = -r; z <= r; z++) {
      if (y * y + z * z <= r * r + 0.5) block(x, yc + y, zc + z, id);
    }
  }
}
const DRIVER_Z = [-4, 0, 4];
for (const z of DRIVER_Z) {
  line(-3, 5, z, 3, 5, z, IRON);
  for (const x of [-3, 3]) {
    wheel(x, 5, z, 2, RED);
    block(x, 5, z, IRON);
  }
}
line(-4, 6, -4, -4, 6, 4, IRON);
line(4, 6, -4, 4, 6, 4, IRON);

// Snowplow: yellow wedge, nose at z=-13, blade face at z=-10
for (let z = -13; z <= -10; z++) {
  const d = z + 13;
  const hw = [0, 1, 2, 4][d];
  const top = 4 + d;
  for (let x = -hw; x <= hw; x++) {
    for (let y = 3; y <= top; y++) block(x, y, z, YELLOW);
  }
}
cube(-4, 3, -10, -4, 7, -10, BLACK);
cube(4, 3, -10, 4, 7, -10, BLACK);
line(-4, 5, -10, 4, 5, -10, IRON);
line(-3, 3, -11, 3, 3, -11, BLACK);

// Snow spray thrown off the plow
block(-5, 7, -11, SNOW);
block(-6, 8, -12, SNOW);
block(-4, 9, -11, SNOW);
block(5, 7, -11, SNOW);
block(6, 8, -12, SNOW);
block(4, 9, -11, SNOW);

// Boiler: horizontal cylinder along Z (circle in XY plane)
function hcyl(cx, cy, z1, z2, r, id) {
  for (let z = z1; z <= z2; z++) {
    for (let x = -r; x <= r; x++) {
      for (let y = -r; y <= r; y++) {
        if (x * x + y * y <= r * r + 0.5) block(cx + x, cy + y, z, id);
      }
    }
  }
}
hcyl(0, 8, -9, 6, 3, BLACK);

// Smokebox door with checker pattern and dogging wheel
for (let x = -3; x <= 3; x++) {
  for (let y = -3; y <= 3; y++) {
    if (x * x + y * y <= 9.5) block(x, 8 + y, -9, (x + y) % 2 === 0 ? IRON : GRAY);
  }
}
block(0, 8, -9, GOLD);

// Headlamp on top of smokebox, bell behind it
block(0, 12, -9, GLOWSTONE);
block(0, 12, -6, GOLD);

// Chimney with flared top and steam plume
cylinder(0, 11, -3, 1, 3, BLACK);
cylinder(0, 14, -3, 2, 1, IRON);
block(0, 15, -3, STEAM);
block(0, 16, -3, STEAM);

// Steam dome and its vent
cylinder(0, 11, 1, 1, 2, IRON);
block(0, 13, 1, STEAM);

// Cab behind the boiler, with glass sides and snowy roof
cube(-3, 4, 7, 3, 13, 11, BLACK);
cube(-3, 14, 7, 3, 14, 11, BLACK);
cube(-3, 15, 7, 3, 15, 11, SNOW);
cube(-3, 8, 8, -3, 10, 10, GLASS);
cube(3, 8, 8, 3, 10, 10, GLASS);
cube(-3, 9, 7, 3, 9, 7, GOLD);

// Tender with gold stripe and coal heap
cube(-3, 4, 12, 3, 8, 16, BLACK);
cube(-3, 6, 12, 3, 6, 16, GOLD);
cube(-2, 9, 12, 2, 9, 16, GRAY);
block(0, 4, 17, IRON);

// Passenger coach at the rear of the train
cube(-3, 4, 18, 3, 11, 22, RED);
cube(-3, 8, 18, 3, 8, 22, GOLD);
cube(-3, 12, 18, 3, 12, 22, BLACK);
cube(-3, 13, 18, 3, 13, 22, SNOW);
for (const z of [19, 21]) {
  cube(-3, 9, z, -3, 10, z, GLASS);
  cube(3, 9, z, 3, 10, z, GLASS);
}