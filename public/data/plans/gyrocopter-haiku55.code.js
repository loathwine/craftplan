// gyrocopter-haiku55 — prompt:
// a steampunk gyrocopter...

// ---------- helpers ----------
const EPS = 1e-6;
const diskX = (x, cy, cz, r, id, ri = 0) => {
  const R = Math.ceil(r);
  for (let y = cy - R; y <= cy + R; y++)
    for (let z = cz - R; z <= cz + R; z++) {
      const d = Math.hypot(y - cy, z - cz);
      if (d <= r + EPS && d >= ri - EPS) block(x, y, z, id);
    }
};
const diskY = (cx, y, cz, r, id, ri = 0) => {
  const R = Math.ceil(r);
  for (let x = cx - R; x <= cx + R; x++)
    for (let z = cz - R; z <= cz + R; z++) {
      const d = Math.hypot(x - cx, z - cz);
      if (d <= r + EPS && d >= ri - EPS) block(x, y, z, id);
    }
};
const diskZ = (cx, cy, z, r, id, ri = 0) => {
  const R = Math.ceil(r);
  for (let x = cx - R; x <= cx + R; x++)
    for (let y = cy - R; y <= cy + R; y++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= r + EPS && d >= ri - EPS) block(x, y, z, id);
    }
};

// ---------- 0. clear the build sites (AIR is free) ----------
cube(-8, 0, -10, 8, 18, 12, AIR);     // gyrocopter volume
cube(-16, 0, 13, -10, 24, 19, AIR);   // background clock tower site
cube(9, 0, 11, 14, 20, 16, AIR);      // background chimney site

// ---------- 1. foundations / landing pads ----------
cube(-7, -2, -5, -3, -2, 3, STONE);
cube(-7, -1, -5, -3, -1, 3, COBBLE);
cube(3, -2, -5, 7, -2, 3, STONE);
cube(3, -1, -5, 7, -1, 3, COBBLE);

// cargo: crate stack on the left pad, copper barrel on the right
cube(-7, 0, -5, -5, 1, -3, PLANKS);
hollowCube(-7, 0, -5, -5, 1, -3, IRON);
cube(-7, 2, -5, -5, 3, -3, PLANKS);
hollowCube(-7, 2, -5, -5, 3, -3, IRON);
for (let y = 0; y <= 2; y++) diskY(6, y, -4, 1, COPPER);
diskY(6, 2, -4, 1, IRON);
block(6, 3, -4, GOLD);

// lamp posts on pad corners
line(-7, 0, 3, -7, 2, 3, IRON);
block(-7, 3, 3, GLOWSTONE);
line(7, 0, -5, 7, 2, -5, IRON);
block(7, 3, -5, GLOWSTONE);

// ---------- 2. landing wheels + axle ----------
line(-4, 2, -1, 4, 2, -1, IRON);
for (const x of [-4, 4]) {
  diskX(x, 2, -1, 2.2, BLACK, 1.4);   // rubber tyre
  diskX(x, 2, -1, 1, GOLD);           // brass hub
  block(x, 2, -1, IRON);
}

// ---------- 3. tail boom (built before engine so engine overrides) ----------
for (let z = 3; z <= 9; z++)
  for (let x = -1; x <= 1; x++) {
    block(x, 3, z, COPPER);
    block(x, 4, z, IRON);
  }
for (const z of [4, 6, 8]) {
  block(-1, 3, z, GOLD);
  block(1, 3, z, GOLD);
}

// ---------- 4. boiler (front, faces north) ----------
for (let z = -9; z <= -3; z++) diskZ(0, 4, z, 2.5, COPPER);
diskZ(0, 4, -9, 2.5, IRON, 2);          // front rim
for (const z of [-7, -5]) diskZ(0, 4, z, 2.5, IRON, 2);   // iron bands
diskZ(0, 4, -9, 1, BLACK);              // firebox door
block(0, 4, -9, GLOWSTONE);             // glowing firebox eye
block(-2, 4, -9, GLASS);                // sight ports
block(2, 4, -9, GLASS);
for (let z = -8; z <= -4; z++) block(0, 6, z, GOLD);   // brass ridge
for (const z of [-8, -6, -4]) {
  block(2, 4, z, GOLD);                 // rivets
  block(-2, 4, z, GOLD);
}
block(-3, 5, -6, STEAM);                // boiler side vent

// ---------- 5. smokestack ----------
cube(-1, 7, -7, 1, 11, -5, COPPER);
cube(-1, 9, -7, 1, 9, -5, IRON);
cube(-1, 12, -7, 1, 12, -5, GOLD);
for (let y = 8; y <= 11; y++) block(0, y, -6, AIR);   // hollow chimney
block(0, 12, -6, STEAM);
block(0, 13, -6, STEAM);
block(0, 14, -6, STEAM);

// steam pipe: boiler -> engine (right side)
line(3, 5, -6, 3, 5, 4, COPPER);

// ---------- 6. gondola / cockpit ----------
cube(-2, 2, -2, 2, 2, 2, IRON);         // floor
cube(-2, 3, 2, 2, 4, 2, COPPER);        // back wall
cube(-2, 3, -2, 2, 4, -2, COPPER);      // front wall
cube(-2, 3, -2, -2, 4, 2, COPPER);      // left wall
cube(2, 3, -2, 2, 4, 2, COPPER);        // right wall
cube(-1, 3, -2, 1, 4, -2, GLASS);       // front windscreen
cube(-2, 3, -1, -2, 4, 1, GLASS);       // left window
cube(2, 3, -1, 2, 4, 1, GLASS);         // right window
cube(-2, 5, -2, 2, 5, 2, IRON);         // roof
block(-2, 4, -2, GLOWSTONE);            // corner lamps
block(2, 4, -2, GLOWSTONE);
block(0, 3, 0, BROWN);                  // pilot body / seat
block(0, 4, 0, GOLD);                   // brass diving helmet
block(0, 4, 1, BROWN);                  // backrest
block(-1, 3, -1, IRON);                 // control stick
block(-1, 4, -1, RED);                  // stick knob
block(1, 4, -1, GOLD);                  // dial

// ---------- 7. engine block, pistons, flywheel ----------
cube(-2, 2, 4, 2, 5, 6, IRON);
for (const x of [-1, 1]) {
  block(x, 6, 4, COPPER);
  block(x, 6, 5, GOLD);
  block(x, 6, 6, COPPER);
}
block(0, 6, 5, GOLD);
block(0, 7, 5, COPPER);                 // steam whistle
diskX(-3, 4, 5, 1, IRON);               // flywheel hub
diskX(-3, 4, 5, 2, GOLD, 1.2);          // flywheel rim

// ---------- 8. main mast + gears + stays ----------
line(0, 6, 0, 0, 14, 0, IRON);
diskY(0, 8, 0, 2, GOLD, 1.2);
diskY(0, 12, 0, 2, IRON, 1.2);
block(3, 8, 0, GOLD);
block(-3, 8, 0, GOLD);
block(0, 8, 3, GOLD);
line(0, 12, 0, 2, 6, 1, IRON);
line(0, 12, 0, -2, 6, 1, IRON);

// ---------- 9. rotor (cross of 2-wide planks, iron tips, guard ring) ----------
for (let t = -7; t <= 7; t++) {
  block(t, 15, 0, PLANKS);
  block(t, 15, 1, PLANKS);
  block(0, 15, t, PLANKS);
  block(1, 15, t, PLANKS);
}
for (const [x, z] of [[7, 0], [-7, 0], [0, 7], [0, -7]]) {
  block(x, 15, z, IRON);
  if (x === 0) block(1, 15, z, IRON);
  else block(x, 15, 1, IRON);
}
diskY(0, 15, 0, 1, GOLD);               // rotor hub
diskY(0, 16, 0, 1.5, GOLD);             // hub cap
block(0, 17, 0, IRON);
diskY(0, 15, 0, 7.3, IRON, 6.6);        // rotor guard ring
// tesla crackle on the rotor cap (3 cells only)
block(-1, 17, 0, ELECTRIC);
block(0, 17, 0, ELECTRIC);
block(1, 17, 0, ELECTRIC);

// ---------- 10. tail fin, stabiliser, pusher propeller ----------
for (let y = 5; y <= 9; y++)
  for (let z = 7; z <= 9 - Math.floor((y - 5) / 2); z++)
    block(0, y, z, y >= 7 ? RED : COPPER);
block(0, 9, 7, GOLD);
cube(-3, 5, 8, 3, 5, 8, COPPER);
block(-3, 5, 8, GOLD);
block(3, 5, 8, GOLD);

line(0, 4, 9, 0, 4, 10, IRON);          // prop shaft
diskZ(0, 4, 11, 1, GOLD);               // prop hub
for (let t = -4; t <= 4; t++) {
  block(t, 4, 11, PLANKS);
  block(t, 5, 11, PLANKS);
}
for (let y = 0; y <= 8; y++) {
  block(0, y, 11, PLANKS);
  block(1, y, 11, PLANKS);
}
diskZ(0, 4, 11, 1, GOLD);
diskZ(0, 4, 11, 4.5, IRON, 3.5);        // prop guard ring

// ---------- 11. background: brick clock tower (north-facing clock, south of craft) ----------
cube(-15, -2, 13, -11, -2, 19, STONE);
cube(-15, -1, 13, -11, -1, 19, COBBLE);
cube(-15, 0, 14, -11, 14, 18, BRICK);
for (const y of [3, 6, 9, 12]) {
  block(-13, y, 14, GLASS);
  block(-15, y, 16, GLASS);
  block(-11, y, 16, GLASS);
}
diskZ(-13, 10, 14, 2, GOLD, 1.2);       // clock ring
block(-13, 10, 14, WHITE);
line(-13, 10, 14, -13, 12, 14, BLACK);  // minute hand
line(-13, 10, 14, -11, 10, 14, BLACK);  // hour hand
cube(-15, 15, 14, -11, 15, 18, COPPER);
cube(-14, 16, 15, -12, 16, 17, COPPER);
block(-13, 17, 16, COPPER);
line(-13, 18, 16, -13, 22, 16, GOLD);
block(-13, 23, 16, GLOWSTONE);

// ---------- 12. background: industrial chimney (east) ----------
cube(10, -2, 12, 13, -2, 15, STONE);
cube(10, -1, 12, 13, -1, 15, COBBLE);
cube(11, 0, 13, 12, 12, 14, BRICK);
cube(11, 6, 13, 12, 6, 14, IRON);
cube(11, 13, 13, 12, 13, 14, IRON);
block(11, 14, 13, STEAM);
block(12, 14, 14, STEAM);
block(11, 15, 13, STEAM);