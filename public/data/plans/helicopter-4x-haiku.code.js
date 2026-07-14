// helicopter-4x-haiku — prompt:
// an attack helicopter...

// Attack Helicopter

// ===== MAIN FUSELAGE =====
cube(-2.8, 0.3, 10, 2.8, 3.5, 14, STONE);
cube(-2.6, 0.5, 5, 2.6, 4, 10, STONE);
cube(-2.2, 1, 0, 2.2, 4, 5, STONE);
cube(-1.5, 1.5, -5, 1.5, 3.5, 0, STONE);
cube(-1, 2, -6, 1, 3, -5, STONE);

// Fuselage taper detail
cube(-2.4, 2, 5, 2.4, 3.8, 7, COBBLE);
cube(-2.2, 2.5, 7.5, 2.2, 3.6, 9.5, COBBLE);

// ===== COCKPIT & WINDOWS =====
cube(-0.95, 2.5, -5, 0.95, 3.8, -3, GLASS);
cube(-1.8, 2, -2, -1.3, 3.5, 1, GLASS);
cube(1.3, 2, -2, 1.8, 3.5, 1, GLASS);
cube(-1.2, 3.2, -3, 1.2, 4, -1, GLASS);
cube(-0.8, 1.5, -2.5, 0.8, 2.5, -0.5, STONE);

// Cockpit frame detail
cube(-1, 2.3, -4.5, 1, 2.5, -2.5, COBBLE);

// ===== MAIN ROTOR =====
cylinder(0, 3.5, 0, 0.8, 1, STONE);
cylinder(0, 4.4, 0, 1.8, 0.6, COBBLE);

// Main blades
cube(-0.5, 4.2, -11, 0.5, 4.8, 11, OAK_LOG);
cube(-11, 4.2, -0.5, 11, 4.8, 0.5, OAK_LOG);

// Blade root reinforcement
cube(-1.2, 4, -1.2, 1.2, 4.2, 1.2, COBBLE);

// Blade tips
cube(-11.2, 4.3, -0.3, -10.8, 4.7, 0.3, COBBLE);
cube(10.8, 4.3, -0.3, 11.2, 4.7, 0.3, COBBLE);
cube(-0.3, 4.3, -11.2, 0.3, 4.7, -10.8, COBBLE);
cube(-0.3, 4.3, 10.8, 0.3, 4.7, 11.2, COBBLE);

// Rotor struts
line(-2, 3.8, -1, -0.5, 4.2, -0.5, STONE);
line(2, 3.8, -1, 0.5, 4.2, -0.5, STONE);
line(-1, 3.8, -2, -0.5, 4.2, -1.5, STONE);
line(1, 3.8, -2, 0.5, 4.2, -1.5, STONE);

// ===== LANDING GEAR =====
line(-4.2, -1, 1, -4.2, -1, 12, OAK_LOG);
line(4.2, -1, 1, 4.2, -1, 12, OAK_LOG);

cube(-4.2, -0.5, 1, 4.2, 0.2, 1.5, STONE);
cube(-4.2, -0.5, 4, 4.2, 0.2, 4.5, STONE);
cube(-4.2, -0.5, 8, 4.2, 0.2, 8.5, STONE);
cube(-4.2, -0.5, 11, 4.2, 0.2, 11.5, STONE);

// Vertical struts
line(-4.2, 0, 2, -3.2, 1.2, 2, STONE);
line(4.2, 0, 2, 3.2, 1.2, 2, STONE);
line(-4.2, 0, 5.5, -3.2, 1.2, 5.5, STONE);
line(4.2, 0, 5.5, 3.2, 1.2, 5.5, STONE);
line(-4.2, 0, 9, -3.2, 1.2, 9, STONE);
line(4.2, 0, 9, 3.2, 1.2, 9, STONE);

// ===== WEAPON PODS =====
cube(-3.2, 0.7, 2, -2.2, 2, 5.5, BRICK);
cube(2.2, 0.7, 2, 3.2, 2, 5.5, BRICK);
cube(-3.2, 0.4, 1.8, -2.2, 0.8, 2.2, STONE);
cube(2.2, 0.4, 1.8, 3.2, 0.8, 2.2, STONE);

// Gun hardpoints
block(-2.5, 1.5, -3, COBBLE);
block(2.5, 1.5, -3, COBBLE);
block(-2.5, 1, -3.5, COBBLE);
block(2.5, 1, -3.5, COBBLE);

// ===== TAIL BOOM =====
cube(-0.8, 1.2, 13, 0.8, 3, 16, STONE);
line(-1.5, 2.2, 14, 1.5, 2.2, 14, STONE);

// ===== TAIL ROTOR =====
cylinder(0, 3.5, 16, 2.5, 0.5, COBBLE);
cube(-2.8, 0.8, 15.8, 2.8, 1.2, 16.2, OAK_LOG);
cube(-0.3, 0.5, 15.5, 0.3, 6, 16.5, OAK_LOG);

// ===== TAIL SURFACES =====
cube(-1.5, 2.2, 14.5, 1.5, 2.8, 15, STONE);
cube(-0.3, 2.8, 15, 0.3, 5, 15.8, STONE);

// ===== ENGINES & EXHAUST =====
cube(-2.5, 3.5, 7, -1.8, 4.2, 8.5, BRICK);
cube(1.8, 3.5, 7, 2.5, 4.2, 8.5, BRICK);
cube(-1.2, 2, 12, 1.2, 3, 13.2, BRICK);
cube(-0.8, 2.2, 12.5, 0.8, 2.8, 12.8, COBBLE);

// ===== FUSELAGE PANELS & DETAIL =====
line(-1.8, 2.5, 2, -1.8, 2.5, 10, COBBLE);
line(1.8, 2.5, 2, 1.8, 2.5, 10, COBBLE);
line(-2.2, 3.2, 2, -2.2, 3.2, 10, COBBLE);
line(2.2, 3.2, 2, 2.2, 3.2, 10, COBBLE);

cube(-1.8, 0.5, 5.5, 1.8, 1.5, 6.5, COBBLE);
cube(-2.8, 1.5, 6, -2.6, 3.2, 10, COBBLE);
cube(2.6, 1.5, 6, 2.8, 3.2, 10, COBBLE);

// Underbelly detail
cube(-2, 0.2, 4, 2, 0.5, 9, COBBLE);

// ===== ANTENNA & SENSORS =====
line(0, 4.8, 0, 0, 6.5, 0, COBBLE);
sphere(0, 2.2, -6.5, 0.6, GLASS);

// Targeting sensor mounts
block(0, 2.8, -4, COBBLE);
block(-1, 2.2, -2, COBBLE);
block(1, 2.2, -2, COBBLE);

// ===== REINFORCEMENT ELEMENTS =====
cube(-0.6, 1, 2, 0.6, 2, 3, STONE);
cube(-2, 0.2, 2.5, 2, 0.4, 3.5, COBBLE);

// Rotor hub damping ring
cylinder(0, 4.5, 0, 2.2, 0.15, COBBLE);

// ===== SIDE VENTS & INTAKES =====
cube(-2.7, 1.5, 4, -2.4, 2.5, 5, COBBLE);
cube(2.4, 1.5, 4, 2.7, 2.5, 5, COBBLE);

// Structural cross-bracing
line(-2.5, 1.5, 7.5, 2.5, 1.5, 7.5, STONE);
line(-3, 0.8, 9, 3, 0.8, 9, STONE);