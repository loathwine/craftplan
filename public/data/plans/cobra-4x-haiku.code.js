// cobra-4x-haiku — prompt:
// a king cobra ready to strike...

// King cobra in striking posture
// Hood expanded, head raised and forward-facing, coiled body

// REAR COILS - body foundation
cube(-7, 0, 16, 7, 2, 22, STONE);
cube(-6, 1, 12, 6, 4, 18, STONE);
cube(-5, 2, 8, 5, 5, 14, STONE);

// MID BODY - tapering toward neck
cube(-4, 3, 5, 4, 6, 10, STONE);
cube(-3, 4, 3, 3, 6, 7, STONE);

// NECK - connecting to head
cylinder(0, 5.5, 1.5, 2.2, 2, STONE);

// HEAD - detailed and pointing forward (-Z)
cube(-2.5, 5, -2, 2.5, 9, 2, STONE);
cube(-2, 6, -5, 2, 10, -1, STONE);
cube(-1.2, 7.5, -8, 1.2, 9.5, -3, STONE);
cube(-0.5, 8.5, -10, 0.5, 9.5, -6, STONE);

// HEAD DEFINITION - jaw structure
cube(-2.3, 5.5, -3, -1.5, 7, 0, COBBLE);
cube(1.5, 5.5, -3, 2.3, 7, 0, COBBLE);

// EYES - alert striking position
block(-1.4, 8.5, -3, GLASS);
block(1.4, 8.5, -3, GLASS);

// VENTRAL MARKINGS - lighter belly
sphere(0, 6, 3, 5, BRICK);
disk(0, 6.5, 3, 4.5, BRICK);

// EXPANDED HOOD - primary striking feature
sphere(0, 9.5, 2, 8.5, STONE);
hollowSphere(0, 8.5, 1, 9.5, COBBLE);

// HOOD UNDERSIDE - ventral pattern
hollowSphere(0, 6.5, 2.5, 7.5, BRICK);

// HOOD LATERAL FLARE - spread sides
cylinder(-8.5, 7.5, 1, 2.5, 3, STONE);
cylinder(8.5, 7.5, 1, 2.5, 3, STONE);

// HOOD FRONT EDGE - scalloped detail
for (let x = -7; x <= 7; x += 2.5) {
  block(x, 10, 0, COBBLE);
}

// SCALE RIDGES on hood - layered detail
disk(0, 11, 1.5, 6.5, COBBLE);
disk(0, 10, 2, 7.5, COBBLE);
disk(0, 9, 2.5, 8, COBBLE);

// BODY DORSAL RIDGE - raised spine
line(-1, 7, 12, 1, 8, 12, COBBLE);
line(-1, 6, 8, 1, 7, 8, COBBLE);
line(-1, 5, 4, 1, 6, 4, COBBLE);