// pacman-4x-fable — prompt:
// Pac-Man chased by a ghost...

// Pac-Man chased by a ghost — classic maze corridor chase scene
// Layout: chase runs west (-X). Pellets ahead, Pac-Man mid, red ghost close behind.

// --- clear trees/terrain from the corridor and branch stubs (AIR is free) ---
cube(-22, 1, -9, 22, 9, 9, AIR);
cube(-6, 1, -13, 6, 9, -9, AIR);
cube(-6, 1, 9, 6, 9, 13, AIR);

// --- maze floor: stone lane with cobble edge lines and a support skirt ---
cube(-22, 0, -6, 22, 0, 6, STONE);
cube(-22, 0, -6, 22, 0, -6, COBBLE);
cube(-22, 0, 6, 22, 0, 6, COBBLE);
line(-22, -1, -6, 22, -1, -6, STONE);
line(-22, -1, 6, 22, -1, 6, STONE);

// --- blue maze walls flanking the corridor, with junction stubs + corner posts ---
cube(-22, 1, -8, 22, 2, -7, GLASS);
cube(-22, 1, 7, 22, 2, 8, GLASS);
cube(-4, 1, -12, -3, 2, -9, GLASS);   // branch stub, north side
cube(3, 1, 9, 4, 2, 12, GLASS);       // branch stub, south side
cube(-22, 1, 7, -22, 3, 8, COBBLE);
cube(-22, 1, -8, -22, 3, -7, COBBLE);
cube(22, 1, 7, 22, 3, 8, COBBLE);
cube(22, 1, -8, 22, 3, -7, COBBLE);

// --- GHOST (Blinky, red) floating behind Pac-Man, leaning into the chase ---
cylinder(9, 3, 0, 5.5, 8, BRICK);                 // body y3..10
for (let dy = 1; dy <= 5; dy++) {                 // dome, leaning forward (-X)
  const r = Math.sqrt(5.5 * 5.5 - dy * dy);
  const cx = 9 - (dy >= 3 ? 1 : 0);
  disk(cx, 10 + dy, 0, r, BRICK);
}
// wavy skirt: alternate hanging teeth and carved notches around the rim
for (let k = 0; k < 8; k++) {
  const a = k * Math.PI / 4 + Math.PI / 8;
  const tx = Math.round(9 + 4.3 * Math.cos(a));
  const tz = Math.round(4.3 * Math.sin(a));
  if (k % 2 === 0) cube(tx - 1, 2, tz - 1, tx, 2, tz, BRICK);
  else cube(tx - 1, 3, tz - 1, tx, 3, tz, AIR);
}
// big white eyes on the front face, blue pupils locked onto Pac-Man
cube(3, 8, 1, 4, 11, 3, SNOW);
cube(3, 8, -3, 4, 11, -1, SNOW);
cube(2, 8, 2, 2, 9, 3, GLASS);
cube(2, 8, -3, 2, 9, -2, GLASS);

// --- PAC-MAN: yellow sphere, wedge mouth carved open toward the pellets ---
sphere(-9, 9, 0, 6.5, SAND);
for (let d = 0; d <= 7; d++) {
  const h = Math.round(d * 0.85);
  cube(-9 - d, 9 - h, -7, -9 - d, 9 + h, 7, AIR);
}
// eyes above the mouth on both flanks
cube(-12, 12, 5, -11, 13, 6, STONE);
cube(-12, 12, -6, -11, 13, -5, STONE);

// --- pellets ahead: one about to be chomped, one big power pellet ---
sphere(-16, 9, 0, 1, SNOW);
sphere(-20, 9, 0, 2, SNOW);

// --- bonus cherry on the lane floor ---
sphere(1, 1, 3, 1, BRICK);
sphere(3, 1, 4, 1, BRICK);
line(1, 2, 3, 2, 5, 3, OAK_LOG);
line(3, 2, 4, 2, 5, 3, OAK_LOG);
block(2, 6, 3, LEAVES);
block(1, 6, 4, LEAVES);

// --- speed dashes trailing the ghost ---
line(16, 6, 4, 19, 6, 4, SNOW);
line(17, 9, -4, 20, 9, -4, SNOW);
line(16, 12, 0, 19, 12, 0, SNOW);