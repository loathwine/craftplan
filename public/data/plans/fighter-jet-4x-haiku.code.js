// fighter-jet-4x-haiku — prompt:
// a fighter jet...

// Fighter Jet - Modern Combat Aircraft

// NOSE CONE - Sharp pointed aerodynamic front
cube(-1, 1, -12, 1, 2, -11, 3);
cube(-1, 1, -11, 1, 3, -9, 3);
cube(-1, 1, -9, 1, 4, -7, 3);

// COCKPIT - Pilot's section with glass canopy
cube(-1, 1, -7, 1, 4, -4, 3);
// Glass canopy - rounded windscreen
cube(-1, 4, -7, 1, 5, -5, 11);
cube(-1, 3, -8, 1, 4, -6, 11);

// FUSELAGE - Main body (widest section)
cube(-2, 0, -4, 2, 4, 5, 3);

// Fuselage underbelly detail - lighter color strip
for (let z = -4; z <= 5; z++) {
  block(-2, 0, z, 8);
  block(2, 0, z, 8);
}

// REAR FUSELAGE - Tapers to tail
cube(-2, 0, 5, 2, 3, 6, 3);
cube(-1, 0, 6, 1, 2, 7, 3);
cube(-0, 1, 7, 0, 2, 8, 3);

// WINGS - Large swept-back design
// Left wing - multi-layer for depth
for (let z = -2; z <= 4; z++) {
  const wingLength = 7 + Math.floor((z + 2) * 0.4);
  // Main wing surface
  cube(-wingLength - 1, 1, z, -2, 1, z, 3);
  // Wing thickness (top)
  if (z >= 0) {
    cube(-wingLength - 1, 2, z, -3, 2, z, 3);
  }
}

// Right wing - mirrored
for (let z = -2; z <= 4; z++) {
  const wingLength = 7 + Math.floor((z + 2) * 0.4);
  cube(2, 1, z, wingLength + 1, 1, z, 3);
  if (z >= 0) {
    cube(3, 2, z, wingLength + 1, 2, z, 3);
  }
}

// Wing tip air-to-air missiles (BRICK accents)
cube(-9, 2, 0, -8, 3, 2, 10);
cube(8, 2, 0, 9, 3, 2, 10);

// TAIL FINS
// Vertical stabilizer - single large dorsal fin
cube(-1, 2, 6, 1, 5, 7, 3);

// Horizontal stabilizers (canards) - rear wings
cube(-3, 2, 6, 3, 2, 7, 3);

// ENGINE SECTION - Two side-mounted turbofans
// Left engine intake with detail
cube(-3, 0, 1, -2, 2, 3, 10);
cube(-3, 1, 2, -2, 2, 2, 3);

// Right engine intake
cube(2, 0, 1, 3, 2, 3, 10);
cube(2, 1, 2, 3, 2, 2, 3);

// Engine exhaust nozzles at rear
cube(-1, 0, 8, 1, 2, 9, 10);
block(-1, 0, 9, 10);
block(0, 0, 9, 10);
block(1, 0, 9, 10);

// LANDING GEAR - Retractable gear wells
// Nose gear
block(0, -1, -3, 2);

// Main landing gear ports (left and right)
block(-1, -1, 2, 2);
block(1, -1, 2, 2);

// FUSELAGE PANEL DETAILS - Running lights and panel lines
// Left fuselage stripe
line(-2, 2, -3, -2, 2, 6, 8);

// Right fuselage stripe
line(2, 2, -3, 2, 2, 6, 8);

// Cockpit window frame detail
block(-1, 5, -6, 8);
block(1, 5, -6, 8);

// Mid-fuselage detail stripe (red)
for (let z = -2; z <= 2; z++) {
  block(0, 0, z, 10);
}

// Wing root fillets - smooth transition (GLASS for visual interest)
for (let z = -1; z <= 2; z++) {
  cube(-2, 2, z, -2, 2, z, 11);
  cube(2, 2, z, 2, 2, z, 11);
}

// Engine bay detail - darker shading
cube(-3, 0, 2, -3, 1, 3, 8);
cube(3, 0, 2, 3, 1, 3, 8);

// Tail section detail
cube(-0, 1, 8, 0, 2, 9, 8);

// Additional wing detail - flaps/control surfaces
for (let z = 3; z <= 4; z++) {
  cube(-9, 0, z, -8, 1, z, 10);
  cube(8, 0, z, 9, 1, z, 10);
}