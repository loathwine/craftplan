// r2d2-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Site prep: clear vegetation above ground in build footprint (AIR is free) =====
cylinder(0, 0, 0, 6, 13, AIR);

// ===== Circular plaza / display pad =====
disk(0, -1, 0, 7, STONE);
disk(0, -1, 0, 6, COBBLE);
hollowCylinder(0, -1, 0, 7, 1, BRICK);

// ===== LEGS =====
// Left leg (main, upper + shin taper)
cylinder(-3, 2, 0, 1, 3, STONE);
cylinder(-3, 0, 0, 1, 2, COBBLE);
cube(-4, 0, -1, -2, 1, 1, COBBLE); // foot tread
line(-3, 1, -1, -3, 1, 1, STONE);  // ankle greeble

// Right leg (mirror)
cylinder(3, 2, 0, 1, 3, STONE);
cylinder(3, 0, 0, 1, 2, COBBLE);
cube(2, 0, -1, 4, 1, 1, COBBLE);
line(3, 1, -1, 3, 1, 1, STONE);

// Retracted center (third) leg, tucked at the back
cylinder(0, 3, 2, 1, 2, STONE);
cube(-1, 4, 1, 1, 5, 2, STONE); // housing bump where it retracts into body

// Flared "skirt" ring where legs meet the body
hollowCylinder(0, 4, 0, 5, 1, COBBLE);
hollowCylinder(0, 4, 0, 4, 1, STONE);

// ===== MAIN BODY =====
cylinder(0, 5, 0, 4, 10, SNOW);

// Horizontal accent bands
hollowCylinder(0, 6, 0, 4, 1, COBBLE);
hollowCylinder(0, 9, 0, 4, 1, GLASS);
hollowCylinder(0, 12, 0, 4, 1, COBBLE);
hollowCylinder(0, 14, 0, 4, 1, GLASS);

// Vertical blue accent panels
cube(-1, 6, -4, 1, 13, -4, GLASS);   // front center stripe
cube(-4, 6, -1, -4, 13, 1, GLASS);   // west side stripe
cube(4, 6, -1, 4, 13, 1, GLASS);     // east side stripe
cube(-1, 6, 4, 1, 13, 4, GLASS);     // back stripe

// Front greeble vents (either side of front stripe)
line(-3, 6, -3, -3, 9, -3, COBBLE);
line(3, 6, -3, 3, 9, -3, COBBLE);
line(-2, 10, -3, -2, 11, -3, STONE);
line(2, 10, -3, 2, 11, -3, STONE);

// Small door/panel details
cube(-3, 7, -3, -2, 8, -3, PLANKS);
cube(2, 7, -3, 3, 8, -3, PLANKS);
cube(-3, 11, -3, -2, 11, -3, PLANKS);
cube(2, 11, -3, 3, 11, -3, PLANKS);

// ===== HEAD DOME =====
sphere(0, 15, 0, 4, SNOW);

// Head accent ring near the base of the dome
hollowSphere(0, 15, 0, 4, GLASS);
sphere(0, 15, 0, 3, SNOW); // restore interior so ring is only a thin shell hint
hollowCylinder(0, 15, 0, 4, 1, GLASS);

// Radar eye (front sensor, forward and slightly up)
cube(-1, 15, -4, 1, 17, -3, COBBLE);
block(0, 16, -4, GLASS);
block(0, 16, -3, STONE);

// Side head vents flanking the eye
cube(-3, 15, -2, -2, 16, -1, COBBLE);
cube(2, 15, -2, 3, 16, -1, COBBLE);
cube(-3, 17, -2, -2, 17, -1, STONE);
cube(2, 17, -2, 3, 17, -1, STONE);

// Small holoprojector / periscope on top-front of dome
cylinder(0, 19, -1, 1, 2, COBBLE);
block(0, 21, -1, STONE);

// Rear head vent slats
line(-2, 16, 3, 2, 16, 3, COBBLE);
line(-2, 17, 3, 2, 17, 3, COBBLE);
```
