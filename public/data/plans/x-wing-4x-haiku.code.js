// x-wing-4x-haiku — prompt:
// an X-wing starfighter...

// X-Wing Starfighter

// ===== FUSELAGE =====

// Nose cone (pointed tip)
cube(-1, 2, -15, 1, 4, -13, COBBLE);

// Cockpit dome (front canopy)
sphere(0, 4, -11, 2, GLASS);
cube(-2, 2, -11, 2, 5, -9, COBBLE);

// Forward fuselage (tapered body)
cube(-3, 1, -9, 3, 4, -4, STONE);
cube(-2, 1, -9, 2, 4, -2, GLASS);

// Main fuselage body
cube(-3, 0, -4, 3, 4, 4, COBBLE);
line(-3, 2, -2, 3, 2, 4, STONE);
line(3, 2, -2, -3, 2, 4, STONE);

// Engine mounting section
cube(-3, -1, 4, 3, 4, 8, STONE);

// Engine nozzles (rear)
cube(-2, 0, 8, 2, 3, 11, STONE);
block(-2, 1, 11, GLASS);
block(2, 1, 11, GLASS);
block(0, 1, 11, GLASS);

// ===== S-FOIL WINGS (4-arm X-configuration) =====

const w_inner = 5, w_outer = 17;
const w_up = 8, w_down = -2;
const w_z1 = -1, w_z2 = 5;

// *** UPPER-RIGHT WING ***
cube(w_inner, w_up, w_z1, w_outer, w_up + 2, w_z2, COBBLE);
cube(w_inner + 1, w_up + 1, w_z1 + 1, w_outer - 1, w_up + 2, w_z2 - 1, STONE);

// Wing root detail
cube(w_inner, w_up - 1, w_z1, w_inner + 3, w_up, w_z2, STONE);

// Wing ribbing
for (let z = w_z1 + 1; z < w_z2; z += 1) {
  for (let x = w_inner + 2; x < w_outer; x += 3) {
    block(x, w_up + 2, z, STONE);
  }
}

// Wing tip pod
cube(w_outer - 1, w_up, w_z1 + 1, w_outer + 2, w_up + 1, w_z2 - 1, STONE);
block(w_outer + 2, w_up, 2, GLASS);

// Laser cannon mount
block(w_outer + 2, w_up + 1, w_z1, BRICK);
block(w_outer + 2, w_up + 1, w_z2, BRICK);

// *** UPPER-LEFT WING (mirrored) ***
cube(-w_outer, w_up, w_z1, -w_inner, w_up + 2, w_z2, COBBLE);
cube(-w_outer + 1, w_up + 1, w_z1 + 1, -w_inner - 1, w_up + 2, w_z2 - 1, STONE);

cube(-w_inner - 3, w_up - 1, w_z1, -w_inner, w_up, w_z2, STONE);

for (let z = w_z1 + 1; z < w_z2; z += 1) {
  for (let x = -w_outer + 2; x <= -w_inner - 2; x += 3) {
    block(x, w_up + 2, z, STONE);
  }
}

cube(-w_outer - 2, w_up, w_z1 + 1, -w_outer + 1, w_up + 1, w_z2 - 1, STONE);
block(-w_outer - 2, w_up, 2, GLASS);

block(-w_outer - 2, w_up + 1, w_z1, BRICK);
block(-w_outer - 2, w_up + 1, w_z2, BRICK);

// *** LOWER-RIGHT WING ***
cube(w_inner, w_down, w_z1, w_outer, w_down + 2, w_z2, COBBLE);
cube(w_inner + 1, w_down + 1, w_z1 + 1, w_outer - 1, w_down + 2, w_z2 - 1, STONE);

cube(w_inner, w_down, w_z1, w_inner + 3, w_down + 1, w_z2, STONE);

for (let z = w_z1 + 1; z < w_z2; z += 1) {
  for (let x = w_inner + 2; x < w_outer; x += 3) {
    block(x, w_down + 2, z, STONE);
  }
}

cube(w_outer - 1, w_down, w_z1 + 1, w_outer + 2, w_down + 1, w_z2 - 1, STONE);
block(w_outer + 2, w_down, 2, GLASS);

block(w_outer + 2, w_down + 1, w_z1, BRICK);
block(w_outer + 2, w_down + 1, w_z2, BRICK);

// *** LOWER-LEFT WING (mirrored) ***
cube(-w_outer, w_down, w_z1, -w_inner, w_down + 2, w_z2, COBBLE);
cube(-w_outer + 1, w_down + 1, w_z1 + 1, -w_inner - 1, w_down + 2, w_z2 - 1, STONE);

cube(-w_inner - 3, w_down, w_z1, -w_inner, w_down + 1, w_z2, STONE);

for (let z = w_z1 + 1; z < w_z2; z += 1) {
  for (let x = -w_outer + 2; x <= -w_inner - 2; x += 3) {
    block(x, w_down + 2, z, STONE);
  }
}

cube(-w_outer - 2, w_down, w_z1 + 1, -w_outer + 1, w_down + 1, w_z2 - 1, STONE);
block(-w_outer - 2, w_down, 2, GLASS);

block(-w_outer - 2, w_down + 1, w_z1, BRICK);
block(-w_outer - 2, w_down + 1, w_z2, BRICK);

// ===== ADDITIONAL DETAILS =====

// Fuselage viewport stripe
cube(-2, 3, -6, 2, 3, 2, GLASS);

// Sensor nodes
block(0, 5, -4, GLASS);
block(0, 5, 0, GLASS);
block(0, 5, 4, GLASS);

// Landing struts (4-point)
for (let z = -2; z <= 4; z += 3) {
  block(-2, -2, z, STONE);
  block(2, -2, z, STONE);
}

// Wing undercarriage panels
cube(w_inner + 1, w_up - 1, w_z1, w_outer - 2, w_up, w_z2, STONE);
cube(-w_outer + 2, w_up - 1, w_z1, -w_inner - 1, w_up, w_z2, STONE);
cube(w_inner + 1, w_down + 1, w_z1, w_outer - 2, w_down + 2, w_z2, STONE);
cube(-w_outer + 2, w_down + 1, w_z1, -w_inner - 1, w_down + 2, w_z2, STONE);

// Engine detail rings
cube(-1, 2, 7, 1, 3, 7, STONE);
cube(-1, 1, 9, 1, 2, 9, STONE);