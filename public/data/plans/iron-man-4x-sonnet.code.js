// iron-man-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== IRON MAN — heroic stance, right-hand repulsor blast =====

// ----- Landing crater / base -----
cylinder(0, -2, 0, 9, 1, STONE);
cylinder(0, -1, 0, 8, 1, COBBLE);
disk(0, 0, 0, 6, COBBLE);
for (let a = 0; a < 8; a++) {
  const ang = a * Math.PI / 4;
  block(Math.round(Math.cos(ang) * 5), 0, Math.round(Math.sin(ang) * 5), AIR);
  block(Math.round(Math.cos(ang) * 4), 0, Math.round(Math.sin(ang) * 4), AIR);
}
cube(-7, 0, 2, -6, 0, 3, STONE);
cube(6, 0, -4, 7, 0, -3, STONE);
cube(-5, 0, -7, -4, 0, -6, STONE);
cube(5, 0, 5, 6, 0, 6, STONE);
cube(-8, 0, -1, -8, 0, 0, COBBLE);
cube(8, 0, 1, 8, 0, 2, COBBLE);

// ----- LEGS -----
const LX = -3, RX = 3;

function leg(cx) {
  // boot
  cube(cx - 2, 0, -2, cx + 2, 2, 2, STONE);
  cube(cx - 2, 2, -2, cx + 2, 2, 2, COBBLE); // ankle band
  // boot thruster glow (slightly recessed under sole)
  cylinder(cx, -2, 0, 1, 2, GLASS);
  block(cx, -1, -1, ICE);
  block(cx, -1, 1, ICE);
  // shin (red)
  cube(cx - 2, 3, -2, cx + 2, 6, 1, BRICK);
  cube(cx - 2, 3, 2, cx + 2, 6, 2, BRICK);
  // shin gold trim stripe
  cube(cx, 3, -2, cx, 6, -2, SAND);
  // knee joint
  cube(cx - 2, 7, -2, cx + 2, 7, 2, COBBLE);
  sphere(cx, 7, 0, 2, COBBLE);
  // thigh (red, slightly wider)
  cube(cx - 2, 8, -2, cx + 2, 10, 2, BRICK);
  cube(cx - 3, 10, -2, cx + 3, 10, 2, COBBLE); // hip plate
}
leg(LX);
leg(RX);

// hip / groin plate joining legs
cube(-3, 10, -2, 3, 11, 2, COBBLE);
cube(-1, 10, -2, 1, 11, 2, SAND);

// ----- TORSO -----
// waist (narrow)
cube(-4, 12, -2, 4, 13, 2, BRICK);
cube(-4, 12, -2, -4, 13, 2, COBBLE);
cube(4, 12, -2, 4, 13, 2, COBBLE);
// chest (wide, tapers up)
cube(-5, 14, -3, 5, 18, 3, BRICK);
// side plating (silver)
cube(-5, 14, -3, -5, 18, 3, COBBLE);
cube(5, 14, -3, 5, 18, 3, COBBLE);
// abdomen gold centerline
cube(0, 12, -3, 0, 18, -3, SAND);
// pectoral divide lines
cube(-3, 14, 3, -3, 18, 3, COBBLE);
cube(3, 14, 3, 3, 18, 3, COBBLE);
// collar / trapezius plate
cube(-6, 18, -2, 6, 18, 2, COBBLE);
cube(-6, 19, -1, 6, 19, 1, BRICK);

// arc reactor (glowing chest core, front = +Z)
disk(0, 16, 3, 2, GLASS);
block(0, 16, 4, ICE);
hollowCylinder(0, 16, 3, 2, 1, SAND); // gold housing ring (front face)
block(0, 16, 3, GLASS);

// ----- SHOULDERS -----
sphere(-7, 19, 0, 2, COBBLE);
sphere(7, 19, 0, 2, COBBLE);
sphere(-7, 19, 0, 1, BRICK);
sphere(7, 19, 0, 1, BRICK);

// ----- LEFT ARM (relaxed, bent at hip) -----
cube(-9, 16, -1, -7, 18, 1, BRICK);   // upper arm
cube(-10, 13, -1, -8, 15, 1, BRICK);  // forearm angled to hip
cube(-10, 13, -1, -8, 13, 1, COBBLE); // elbow joint band
cube(-10, 11, -1, -8, 12, 1, STONE);  // gauntlet (hand) resting at hip
cube(-10, 11, -1, -9, 11, 1, SAND);   // knuckle trim

// ----- RIGHT ARM (raised, repulsor firing) -----
cube(7, 16, -1, 9, 18, 1, BRICK);     // upper arm (out to shoulder height)
cube(9, 18, -1, 11, 20, 1, BRICK);    // forearm rising
cube(9, 18, -1, 11, 18, 1, COBBLE);   // elbow joint band
cube(10, 21, -1, 12, 22, 1, STONE);   // gauntlet (raised fist)
cube(10, 22, -1, 12, 22, 1, SAND);    // knuckle trim

// repulsor blast from raised palm (front-facing, +Z and upward)
disk(11, 21, 2, 2, GLASS);
block(11, 21, 3, ICE);
sphere(11, 22, 4, 1, GLASS);
sphere(11, 23, 6, 1, ICE);
sphere(11, 24, 8, 1, GLASS);
block(11, 25, 10, ICE);
block(12, 24, 9, GLASS);
block(10, 23, 7, GLASS);

// ----- HEAD / HELMET -----
sphere(0, 21, 0, 3, BRICK);
cube(-2, 20, 2, 2, 22, 3, COBBLE);    // faceplate
cube(-2, 21, 3, -1, 21, 3, GLASS);    // eye slit left
cube(1, 21, 3, 2, 21, 3, GLASS);      // eye slit right
cube(-1, 20, 3, 1, 20, 3, SAND);      // gold mouth grille
cube(-1, 22, -1, 1, 22, 1, SAND);     // gold crown trim
cube(-3, 20, -1, -3, 22, 1, COBBLE);  // left ear fin
cube(3, 20, -1, 3, 22, 1, COBBLE);    // right ear fin
block(0, 23, 0, COBBLE);              // helmet crest tip

// back thruster/wing nubs
cube(-2, 17, -4, -1, 19, -3, COBBLE);
cube(1, 17, -4, 2, 19, -3, COBBLE);
block(-1, 18, -5, ICE);
block(1, 18, -5, ICE);
```
