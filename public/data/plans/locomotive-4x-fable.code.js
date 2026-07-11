// locomotive-4x-fable — prompt:
// a steam locomotive...

// STEAM LOCOMOTIVE — facing north (-Z), with track, tender, water tower, platform & signal

// ---- helpers ----
function boilerSlice(z, cy, r, id) {
  for (let dx = -r; dx <= r; dx++)
    for (let dy = -r; dy <= r; dy++)
      if (dx * dx + dy * dy <= r * r + 0.6) block(dx, cy + dy, z, id);
}
function wheel(x, cy, cz, r, faceId, rimId) {
  for (let dy = -r; dy <= r; dy++)
    for (let dz = -r; dz <= r; dz++) {
      const d = dy * dy + dz * dz;
      if (d <= r * r + 0.6) block(x, cy + dy, cz + dz, d >= (r - 1) * (r - 1) ? rimId : faceId);
    }
  block(x, cy, cz, SAND); // brass hub
}

// ---- clear vegetation in the corridor (AIR is free) ----
cube(-10, 1, -22, 10, 12, 18, AIR);   // loco + track corridor
cube(9, 1, -10, 17, 14, -2, AIR);     // water-tower site
cube(-10, 1, -3, -5, 9, 15, AIR);     // platform site

// ---- track: ballast, ties, rails ----
cube(-5, -1, -20, 5, 0, 18, COBBLE);
for (let z = -20; z <= 18; z += 2) cube(-5, 1, z, 5, 1, z, OAK_LOG);
for (let z = -20; z <= 18; z++) { block(-4, 2, z, STONE); block(4, 2, z, STONE); }

// ---- chassis frame ----
cube(-2, 4, -14, 2, 5, 9, STONE);

// ---- boiler (center y=9, r=3), smokebox front, bands ----
for (let z = -14; z <= 1; z++) {
  let id = STONE;
  if (z <= -12) id = COBBLE;                       // smokebox
  if (z === -11 || z === -6 || z === -1) id = BRICK; // red boiler bands
  boilerSlice(z, 9, 3, id);
}
// smokebox front cap + door + white number plate
boilerSlice(-15, 9, 3, COBBLE);
for (let dx = -1; dx <= 1; dx++)
  for (let dy = -1; dy <= 1; dy++)
    if (dx * dx + dy * dy <= 2) block(dx, 9 + dy, -15, STONE);
block(0, 9, -15, SNOW);

// running boards
line(4, 6, -14, 4, 6, 1, PLANKS);
line(-4, 6, -14, -4, 6, 1, PLANKS);

// headlamp on smokebox front
block(0, 12, -15, SAND);
block(0, 12, -16, GLASS);

// ---- cowcatcher / pilot + red buffer beam ----
for (let i = 0; i <= 3; i++) {
  const hw = 4 - i;
  cube(-hw, 2, -16 - i, hw, Math.max(2, 5 - i), -16 - i, COBBLE);
}
cube(-4, 5, -16, 4, 5, -16, BRICK);

// ---- wheels ----
wheel(4, 6, -6, 3, BRICK, STONE);   wheel(-4, 6, -6, 3, BRICK, STONE);  // drivers
wheel(4, 6, 0, 3, BRICK, STONE);    wheel(-4, 6, 0, 3, BRICK, STONE);
wheel(4, 6, 6, 3, BRICK, STONE);    wheel(-4, 6, 6, 3, BRICK, STONE);
wheel(4, 5, -10, 2, STONE, COBBLE); wheel(-4, 5, -10, 2, STONE, COBBLE); // pilot truck

// side rods (outside wheel faces) + crank pins
line(5, 5, -6, 5, 5, 6, COBBLE);
line(-5, 5, -6, -5, 5, 6, COBBLE);

// steam cylinders + piston rods
cube(3, 3, -14, 5, 5, -12, COBBLE);
cube(-5, 3, -14, -3, 5, -12, COBBLE);
line(4, 4, -11, 5, 5, -6, STONE);
line(-4, 4, -11, -5, 5, -6, STONE);
// steam wisps at the cylinders
block(5, 3, -14, SNOW); block(6, 4, -15, SNOW);
block(-5, 3, -14, SNOW); block(-6, 4, -15, SNOW);

// ---- chimney, domes, whistle ----
cylinder(0, 12, -12, 1, 4, STONE);
disk(0, 16, -12, 2, STONE);
cylinder(0, 12, -7, 1, 2, SAND); block(0, 14, -7, SAND);  // steam dome
cylinder(0, 12, -3, 1, 2, SAND); block(0, 14, -3, SAND);  // sand dome
block(1, 13, -5, SAND);                                    // whistle

// smoke plume drifting up and back toward the east light
sphere(0, 18, -12, 1, SNOW);
sphere(1, 20, -11, 2, SNOW);
sphere(2, 23, -9, 2, SNOW);
sphere(3, 26, -6, 2, SNOW);
sphere(4, 29, -2, 2, SNOW);

// ---- cab (red with glass windows, plank roof) ----
cube(-4, 5, 2, 4, 5, 8, STONE);            // floor
cube(-4, 6, 2, 4, 13, 2, BRICK);           // front wall
cube(4, 6, 2, 4, 13, 8, BRICK);            // east wall
cube(-4, 6, 2, -4, 13, 8, BRICK);          // west wall
cube(-4, 6, 8, 4, 9, 8, BRICK);            // low rear wall
// front spectacle windows
cube(-3, 10, 2, -2, 12, 2, GLASS);
cube(2, 10, 2, 3, 12, 2, GLASS);
// side windows + crew doorways
cube(4, 9, 3, 4, 12, 5, GLASS);
cube(-4, 9, 3, -4, 12, 5, GLASS);
cube(4, 6, 7, 4, 10, 7, AIR);
cube(-4, 6, 7, -4, 10, 7, AIR);
// number plates on cab sides
block(4, 8, 4, SAND); block(-4, 8, 4, SAND);
// roof with overhang + ridge
cube(-5, 14, 1, 5, 14, 9, PLANKS);
cube(-3, 15, 2, 3, 15, 8, PLANKS);

// ---- tender ----
block(0, 5, 9, STONE); // coupling
cube(-4, 4, 10, 4, 5, 17, STONE);
cube(-4, 6, 10, 4, 10, 10, BRICK);
cube(-4, 6, 17, 4, 10, 17, BRICK);
cube(4, 6, 10, 4, 10, 17, BRICK);
cube(-4, 6, 10, -4, 10, 17, BRICK);
// coal heap
cube(-3, 9, 11, 3, 9, 16, OAK_LOG);
cube(-2, 10, 12, 2, 10, 15, OAK_LOG);
cube(-1, 11, 13, 1, 11, 14, OAK_LOG);
wheel(4, 5, 12, 2, STONE, COBBLE); wheel(-4, 5, 12, 2, STONE, COBBLE);
wheel(4, 5, 15, 2, STONE, COBBLE); wheel(-4, 5, 15, 2, STONE, COBBLE);

// ---- water tower (east of track) ----
cube(11, -1, -8, 11, 6, -8, OAK_LOG);
cube(15, -1, -8, 15, 6, -8, OAK_LOG);
cube(11, -1, -4, 11, 6, -4, OAK_LOG);
cube(15, -1, -4, 15, 6, -4, OAK_LOG);
cylinder(13, 7, -6, 3, 6, PLANKS);
hollowCylinder(13, 7, -6, 3, 1, OAK_LOG);
hollowCylinder(13, 12, -6, 3, 1, OAK_LOG);
disk(13, 12, -6, 2, ICE);                  // water surface
line(10, 9, -6, 7, 8, -6, OAK_LOG);        // filler spout
block(7, 7, -6, ICE);                      // drip

// ---- station platform (west of track) ----
cube(-9, 0, -2, -6, 1, 14, COBBLE);
cube(-9, 2, -2, -6, 2, 14, PLANKS);
// lamp posts
cube(-8, 3, 0, -8, 6, 0, OAK_LOG);  block(-8, 7, 0, SNOW);
cube(-8, 3, 12, -8, 6, 12, OAK_LOG); block(-8, 7, 12, SNOW);
// bench
cube(-8, 3, 5, -8, 3, 7, PLANKS);
cube(-9, 4, 5, -9, 4, 7, PLANKS);

// ---- semaphore signal ahead of the loco ----
cube(8, 1, -18, 8, 9, -18, STONE);
cube(5, 8, -18, 8, 8, -18, BRICK);
block(5, 7, -18, GLASS);