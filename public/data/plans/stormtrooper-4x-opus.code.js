// stormtrooper-4x-opus — prompt:
// a Stormtrooper...

cube(-15, 0, -8, 15, 32, 11, AIR);

// ---------- helper ----------
function mirrorLeg(x1, x2) {
  cube(x1, 0, -3, x2, 0, 3, STONE);          // dark sole
  cube(x1, 1, -5, x2, 2, 3, SNOW);           // boot (toe forward -Z)
  cube(x1, 3, -3, x2, 6, 3, SNOW);           // shin plate
  cube(x1, 3, 2, x2, 6, 3, COBBLE);          // back of calf
  cube(x1, 7, -3, x2, 7, 3, STONE);          // knee joint (black)
  cube(x1, 8, -3, x2, 10, 3, SNOW);          // thigh
}
function mirrorArm(x1, x2) {
  cube(x1, 19, -3, x2, 21, 4, SNOW);         // shoulder bell
  cube(x1, 13, -2, x2, 18, 3, SNOW);         // upper arm
  cube(x1, 11, -2, x2, 12, 3, STONE);        // elbow (black)
  cube(x1, 6, -2, x2, 10, 3, SNOW);          // forearm gauntlet
  cube(x1, 4, -3, x2, 5, 3, STONE);          // black glove
}

// ---------- BACKDROP (south / +Z, behind hero) ----------
cube(-14, 0, 9, 14, 25, 10, COBBLE);
for (let x = -14; x <= 14; x += 4) {
  cube(x, 0, 8, x, 24, 8, STONE);            // vertical panel ribs
}
for (let y = 4; y <= 24; y += 6) {
  cube(-14, y, 8, 14, y, 8, STONE);          // horizontal rib
}
cube(-14, 24, 9, 14, 25, 10, STONE);         // dark cornice
cube(-2, 12, 8, 2, 20, 8, SNOW);             // pale insignia panel

// ---------- BASE PAD ----------
disk(0, 0, 0, 9, STONE);
disk(0, 0, 0, 6, COBBLE);

// ================= STORMTROOPER =================

// legs
mirrorLeg(-5, -2);
mirrorLeg(2, 5);

// pelvis / black bodyglove + belt
cube(-6, 11, -3, 6, 12, 4, STONE);           // black shorts
cube(-6, 13, -3, 6, 13, 4, SNOW);            // belt
cube(-3, 13, -4, -1, 13, -4, COBBLE);        // belt boxes (front)
cube(1, 13, -4, 3, 13, -4, COBBLE);
cube(-1, 11, -4, 0, 12, -4, STONE);          // codpiece

// torso
cube(-6, 14, -3, 6, 20, 4, SNOW);            // white chest & back plate
cube(-6, 14, 4, 6, 17, 4, COBBLE);           // back detail
// abdominal segment lines (dark)
cube(-4, 15, -4, 4, 15, -4, STONE);
cube(-4, 17, -4, 4, 17, -4, STONE);
// central chest control box
cube(-2, 18, -4, 2, 20, -4, STONE);
block(-1, 19, -5, COBBLE);
block(1, 19, -5, SNOW);
// shoulder trim
cube(-6, 20, -3, -5, 20, 4, COBBLE);
cube(5, 20, -3, 6, 20, 4, COBBLE);

// arms
mirrorArm(-9, -7);
mirrorArm(7, 9);

// neck
cube(-2, 21, -2, 2, 21, 2, STONE);

// ---------- HELMET ----------
cube(-5, 22, -4, 5, 27, 4, SNOW);            // main dome mass
cube(-4, 28, -3, 4, 28, 3, SNOW);            // top curve
cube(-3, 29, -2, 3, 29, 2, SNOW);            // crown
cube(4, 27, -4, 5, 27, 4, AIR);              // round top corners
cube(-5, 27, -4, -4, 27, 4, AIR);
cube(-4, 22, -3, 4, 22, 3, SNOW);            // jaw
// front face plate (flush, -Z)
cube(-4, 22, -5, 4, 27, -5, SNOW);
cube(-4, 26, -5, 4, 27, -4, SNOW);           // brow ridge

// eye lenses (black, angled brow)
cube(-4, 25, -6, -1, 26, -5, STONE);
cube(1, 25, -6, 4, 26, -5, STONE);
block(-4, 26, -6, STONE);                    // outer brow rise
block(4, 26, -6, STONE);
// nose bridge (white) between eyes
cube(0, 23, -6, 0, 25, -6, SNOW);
// frown mouth vent
cube(-3, 22, -6, 3, 23, -5, STONE);
block(-2, 24, -5, STONE);                    // tusk vents
block(2, 24, -5, STONE);
block(0, 24, -5, STONE);
// cheek "ear" vents (protruding gray)
cube(-6, 23, -3, -6, 25, 1, COBBLE);
cube(6, 23, -3, 6, 25, 1, COBBLE);
block(-6, 24, -4, STONE);
block(6, 24, -4, STONE);
// top brow tab
cube(-1, 28, -5, 1, 28, -4, COBBLE);

// ---------- E-11 BLASTER (held in right hand) ----------
cube(7, 3, -5, 8, 16, -4, STONE);            // barrel/body (vertical, front)
cube(6, 8, -5, 8, 10, -4, COBBLE);           // magazine / scope block
block(8, 6, -6, STONE);                      // fore grip
block(8, 17, -5, COBBLE);                    // muzzle
cube(6, 3, -4, 8, 4, -3, STONE);             // folding stock