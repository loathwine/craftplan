// trex-jeep-4x-haiku — prompt:
// a T-Rex chasing a jeep...

// T-REX CHASING JEEP - Voxel scene

// ===== T-REX (north side, facing south) =====

// Main body - massive muscular torso
cube(-5, 0, -8, 5, 7, 3, STONE);

// Body muscle definition
cube(-4, 2, -7, -3, 6, -1, COBBLE);
cube(3, 2, -7, 4, 6, -1, COBBLE);

// Thick neck
cube(-3, 6, -10, 3, 10, -6, STONE);
cube(-2.5, 7, -11, 2.5, 9, -9, COBBLE);

// Menacing head
sphere(0, 11, -12, 3.5, STONE);
cube(-2, 9, -15, 2, 11, -13, STONE);
cube(-1.5, 8.5, -17, 1.5, 10.5, -15, COBBLE);

// Upper teeth row
for (let x = -2; x <= 2; x++) {
  block(x, 11.5, -17, SNOW);
  block(x, 12, -17, SNOW);
}

// Lower jaw
for (let x = -2; x <= 2; x++) {
  block(x, 8.5, -16, BRICK);
  block(x, 8, -16, SNOW);
}

// Eyes
sphere(-1.2, 12.5, -12, 0.8, GLASS);
sphere(1.2, 12.5, -12, 0.8, GLASS);

// Nostrils carved out
block(-1, 10, -18, AIR);
block(1, 10, -18, AIR);

// Powerful tail curving with motion
for (let i = 0; i < 22; i++) {
  const z = 3 + i;
  const y = 6 - i * 0.25 + Math.sin(i * 0.6) * 1.8;
  const w = Math.max(0.7, 2.2 - i * 0.1);
  cube(-w, y, z, w, y + 1.8, z, STONE);
  if (i % 4 === 0) {
    cube(-w - 0.4, y + 0.8, z, w + 0.4, y + 1, z, COBBLE);
  }
}

// Powerful hind legs - thick pillars
cube(-6.5, -2, -5, -3, 5, 2, STONE);
cube(-7, 1, -3, -6, 4, 0, COBBLE);

cube(3, -2, -5, 6.5, 5, 2, STONE);
cube(6, 1, -3, 7, 4, 0, COBBLE);

// Small ridiculous arms
cube(-5.8, 3, -5, -4.5, 5, -2, COBBLE);
cube(-5.8, 2.5, -5.5, -5.5, 3, -4.5, BRICK);
cube(-5.8, 2.5, -3.5, -5.5, 3, -2.5, BRICK);

cube(4.5, 3, -5, 5.8, 5, -2, COBBLE);
cube(5.5, 2.5, -5.5, 5.8, 3, -4.5, BRICK);
cube(5.5, 2.5, -3.5, 5.8, 3, -2.5, BRICK);

// Jaw hinge detail
cube(-1.5, 7.5, -13, 1.5, 8.5, -11, STONE);

// ===== JEEP (south side, fleeing) =====

// Main chassis
cube(-3.5, 0, 11, 3.5, 2.5, 19, BRICK);

// Body side panels
cube(-3.6, 1, 11, -3.3, 2.3, 15, PLANKS);
cube(3.3, 1, 11, 3.6, 2.3, 15, PLANKS);
cube(-3.6, 1, 15, -3.3, 2.3, 19, PLANKS);
cube(3.3, 1, 15, 3.6, 2.3, 19, PLANKS);

// Cabin - passenger area on top
cube(-2.5, 2.5, 13, 2.5, 4.8, 18, PLANKS);
cube(-2.5, 3.2, 13, -2.2, 4.5, 14, GLASS);
cube(2.2, 3.2, 13, 2.5, 4.5, 14, GLASS);

// Roof
cube(-2.5, 4.8, 13, 2.5, 5, 18, PLANKS);

// Windows
cube(-2.8, 3.2, 15, -2.4, 4.3, 16, GLASS);
cube(2.4, 3.2, 15, 2.8, 4.3, 16, GLASS);

// Rear window
cube(-1.8, 3.3, 17.8, 1.8, 4.2, 18.1, GLASS);

// Bumpers
cube(-3.5, 0.1, 11, 3.5, 1, 11.8, STONE);
cube(-3.5, 0.1, 18.2, 3.5, 1, 19, STONE);

// Headlights
block(-3, 0.7, 11.3, GLASS);
block(3, 0.7, 11.3, GLASS);

// Taillights
block(-3, 0.7, 19, BRICK);
block(3, 0.7, 19, BRICK);

// Grille detail
for (let x = -1.2; x <= 1.2; x += 0.6) {
  block(x, 0.8, 11, STONE);
  block(x, 1.3, 11, STONE);
}

// Wheels - large and dark
cylinder(-4.2, -0.7, 13.5, 1.3, 1.8, COBBLE);
cylinder(4.2, -0.7, 13.5, 1.3, 1.8, COBBLE);
cylinder(-4.2, -0.7, 17, 1.3, 1.8, COBBLE);
cylinder(4.2, -0.7, 17, 1.3, 1.8, COBBLE);

// Wheel rims
hollowCylinder(-4.2, -0.7, 13.5, 1.6, 1.8, STONE);
hollowCylinder(4.2, -0.7, 13.5, 1.6, 1.8, STONE);
hollowCylinder(-4.2, -0.7, 17, 1.6, 1.8, STONE);
hollowCylinder(4.2, -0.7, 17, 1.6, 1.8, STONE);

// Antenna
line(0, 5, 17, 0, 6.5, 17, GLASS);

// Dust trail behind jeep
for (let i = 0; i < 6; i++) {
  disk(-2 + i * 0.8, -0.3, 20 + i * 1.5, 2 + i * 0.3, DIRT);
}

// Panic skid marks on ground
cube(-5, -0.4, 8, -4, -0.1, 10, DIRT);
cube(4, -0.4, 8, 5, -0.1, 10, DIRT);