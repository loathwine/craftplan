// cerberus-4x-opus — prompt:
// Cerberus, the three-headed dog...

const meta = null; // (ignore) — plain build script below

// ============ CERBERUS, THE THREE-HEADED DOG ============
// Camera looks SOUTH from the north, so all three heads face -Z (north).
// Dark hell-hound: COBBLE/STONE body, BRICK for glowing eyes & throat-fire,
// SNOW fangs, a studded collar with chains, an underworld gate behind.

// ---- helpers ----------------------------------------------------------
function tube(x1, y1, z1, x2, y2, z2, r, id) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x1 + (x2 - x1) * t);
    const y = Math.round(y1 + (y2 - y1) * t);
    const z = Math.round(z1 + (z2 - z1) * t);
    sphere(x, y, z, r, id);
  }
}

function leg(fx, fz, h) {
  // upper leg
  cube(fx, 0, fz, fx + 1, h, fz + 1, COBBLE);
  // shading on the inner face
  cube(fx, 1, fz, fx, h - 1, fz, STONE);
  // paw
  cube(fx - 1, 0, fz - 1, fx + 2, 0, fz + 2, STONE);
  // claws jutting north (-Z), the lit/front side
  block(fx, 0, fz - 2, SNOW);
  block(fx + 1, 0, fz - 2, SNOW);
}

// A snarling head. (nx,ny,nz) = nose tip (front, -Z). Extends toward +Z.
function head(nx, ny, nz, big) {
  const s = big ? 1 : 0;
  // ---- skull ----
  sphere(nx, ny + 1, nz + 5 + s, 3 + s, COBBLE);
  cube(nx - 2 - s, ny, nz + 3, nx + 2 + s, ny + 3 + s, nz + 7 + s, COBBLE);
  // ---- muzzle / snout ----
  cube(nx - 1, ny, nz + 1, nx + 1, ny + 2, nz + 4, COBBLE);
  cube(nx - 1, ny, nz, nx + 1, ny + 1, nz + 1, COBBLE);
  block(nx, ny + 2, nz, STONE);           // wet nose
  // ---- lower jaw (open, snarling) ----
  cube(nx - 1, ny - 2, nz, nx + 1, ny - 1, nz + 4, COBBLE);
  // ---- throat fire ----
  cube(nx - 1, ny - 1, nz + 1, nx + 1, ny - 1, nz + 4, BRICK);
  cube(nx - 1, ny, nz + 2, nx + 1, ny + 1, nz + 4, BRICK);
  // ---- fangs ----
  block(nx - 1, ny, nz + 1, SNOW);
  block(nx + 1, ny, nz + 1, SNOW);
  block(nx - 1, ny - 1, nz + 1, SNOW);
  block(nx + 1, ny - 1, nz + 1, SNOW);
  // ---- eyes (burning) + heavy brow ----
  block(nx - 2 - s, ny + 3 + s, nz + 2, BRICK);
  block(nx + 2 + s, ny + 3 + s, nz + 2, BRICK);
  block(nx - 2 - s, ny + 4 + s, nz + 2, STONE);
  block(nx + 2 + s, ny + 4 + s, nz + 2, STONE);
  block(nx, ny + 4 + s, nz + 2, STONE);
  // ---- pointed ears ----
  line(nx - 2 - s, ny + 4 + s, nz + 5, nx - 3 - s, ny + 7 + s, nz + 6, COBBLE);
  line(nx + 2 + s, ny + 4 + s, nz + 5, nx + 3 + s, ny + 7 + s, nz + 6, COBBLE);
  block(nx - 3 - s, ny + 7 + s, nz + 6, STONE);
  block(nx + 3 + s, ny + 7 + s, nz + 6, STONE);
}

// ---- TORSO ------------------------------------------------------------
cube(-6, 6, -2, 6, 14, 13, COBBLE);          // core body
cube(-5, 6, -1, 5, 7, 12, STONE);            // lighter underbelly
// rounded flanks / muscle
sphere(-4, 11, 1, 3, COBBLE);  sphere(4, 11, 1, 3, COBBLE);   // shoulders
sphere(-4, 9, 11, 3, COBBLE);  sphere(4, 9, 11, 3, COBBLE);   // haunches
sphere(0, 13, 5, 4, COBBLE);                                   // back hump

// ---- LEGS -------------------------------------------------------------
leg(-6, 0, 7);   // front-left
leg(4, 0, 7);    // front-right
leg(-6, 10, 8);  // rear-left
leg(4, 10, 8);   // rear-right

// ---- SPINE RIDGE of stone spikes --------------------------------------
for (let z = 0; z <= 12; z += 2) {
  block(0, 15, z, STONE);
  if (z % 4 === 0) block(0, 16, z, STONE);
}

// ---- NECKS ------------------------------------------------------------
tube(-3, 10, -1, -6, 12, -4, 2, COBBLE);   // to left head
tube(3, 10, -1, 6, 12, -4, 2, COBBLE);     // to right head
tube(0, 11, -2, 0, 15, -6, 2, COBBLE);     // to center head

// ---- HEADS (all facing north / -Z) ------------------------------------
head(-6, 12, -9, false);   // left head
head(6, 12, -9, false);    // right head
head(0, 15, -12, true);    // center head (larger)

// ---- STUDDED COLLAR + DANGLING CHAINS ---------------------------------
// band of stone across the base of the three necks
for (let x = -8; x <= 8; x++) {
  block(x, 9, -2, STONE);
  if (x % 2 === 0) block(x, 10, -2, STONE);   // studs
}
for (let x = -6; x <= 6; x += 3) block(x, 10, -3, BRICK); // glowing studs
// hanging chains
tube(-6, 8, -3, -7, 4, -3, 0, STONE);
tube(6, 8, -3, 7, 4, -3, 0, STONE);
tube(0, 8, -3, 0, 3, -4, 0, STONE);

// ---- TAIL (curling up, south) -----------------------------------------
tube(0, 10, 13, 0, 12, 17, 2, COBBLE);
tube(0, 12, 17, 2, 16, 19, 1, COBBLE);
block(3, 17, 19, STONE);

// ---- FOREGROUND: bones, rocks & hellfire on the lit north side --------
function flame(x, z, h) {
  for (let i = 0; i < h; i++) block(x, i, z, BRICK);
  block(x, h, z, BRICK);
}
flame(-10, -15, 2);
flame(9, -14, 3);
flame(-4, -17, 1);
flame(12, -10, 2);
// scattered rocks
sphere(-12, 0, -12, 2, STONE);
sphere(11, 0, -16, 2, COBBLE);
sphere(-2, 0, -19, 1, STONE);
sphere(14, 1, -6, 2, STONE);
// gnawed bones (foreground)
line(-8, 0, -18, -5, 0, -18, SNOW);
block(-8, 1, -18, SNOW); block(-5, 1, -18, SNOW);
line(7, 0, -19, 10, 0, -19, SNOW);
block(7, 1, -19, SNOW); block(10, 1, -19, SNOW);

// ---- BACKGROUND: the gate of the underworld (south, behind) -----------
cube(-12, 0, 17, -10, 16, 18, COBBLE);       // left pillar
cube(10, 0, 17, 12, 16, 18, COBBLE);         // right pillar
cube(-12, 16, 17, 12, 18, 18, COBBLE);       // lintel
// arch fill suggestion + torch glow on the gate
block(-11, 17, 16, BRICK); block(11, 17, 16, BRICK);
for (let y = 2; y <= 14; y += 3) { block(-11, y, 16, BRICK); block(11, y, 16, BRICK); }