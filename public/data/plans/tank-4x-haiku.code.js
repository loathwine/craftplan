// tank-4x-haiku — prompt:
// a battle tank...

// BATTLE TANK - Heavy armored assault vehicle
// Gun barrel facing north (-Z) toward camera; body extends south (+Z)

// Main hull armor box - central fighting compartment
cube(-4, 2, 0, 4, 6, 12, 8); // COBBLE main hull

// Hull side reinforcement plates
cube(-5, 2, 1, -4, 6, 11, 8); // Left armor
cube(4, 2, 1, 5, 6, 11, 8);   // Right armor

// Front glacis plate (sloped upper frontal armor)
cube(-4, 6, -2, 4, 7, 0, 8);

// Rear engine deck section
cube(-3, 6, 10, 3, 7, 12, 10); // BRICK rear armor

// ===== TURRET =====
// Main cylindrical gun turret
cylinder(0, 7, 5, 3.2, 5, 8); // COBBLE turret

// Turret cupola (commander's observation post)
cylinder(0, 12, 5, 2.2, 2, 8);

// Turret roof hatch
disk(0, 12, 5, 1.8, 10); // BRICK

// ===== PRIMARY CANNON =====
// Long main gun barrel pointing forward (-Z)
cylinder(0, 8.5, -12, 1.2, 14, 8); // COBBLE barrel
sphere(0, 8.5, -12, 1.5, 8);       // Muzzle brake

// Barrel support cradle
hollowCube(-0.8, 7.5, -2, 0.8, 8.5, 2, 8);

// ===== SECONDARY GUN =====
// Coaxial machine gun next to cannon
cylinder(1.2, 8, -10, 0.35, 11, 3); // STONE

// ===== VISION SYSTEMS =====
// Turret periscope/sight
cube(-0.8, 9, 5.5, 0.8, 10, 5.5, 11); // GLASS

// Turret side vision blocks
cube(-3, 8, 4, -2.5, 9, 4, 11); // GLASS left sight
cube(2.5, 8, 4, 3, 9, 4, 11);   // GLASS right sight

// Hull driver viewports
cube(-0.8, 4, 1, 0.8, 5, 1, 11); // GLASS front driver view
cube(-2, 3, 2, -1.2, 4, 2, 11);  // GLASS co-driver left
cube(1.2, 3, 2, 2, 4, 2, 11);    // GLASS gunner right

// Top cupola optics
block(0, 13, 5, 11);

// ===== LEFT TRACK SYSTEM =====
// Drive sprockets and wheels
cylinder(-5, 1.5, 2, 1.3, 1, 3);
cylinder(-5, 1.5, 6, 1.3, 1, 3);
cylinder(-5, 1.5, 10, 1.3, 1, 3);

// Idler wheels (front and rear)
cylinder(-5, 1.5, -1, 1.1, 1, 3);

// Track armor skirt
cube(-6, 2, 0, -5, 4, 12, 8);

// Track link details
for (let z = 0; z <= 11; z += 3) {
  line(-5, 2.2, z, -5, 2.2, z+2, 10);
}

// ===== RIGHT TRACK SYSTEM =====
cylinder(5, 1.5, 2, 1.3, 1, 3);
cylinder(5, 1.5, 6, 1.3, 1, 3);
cylinder(5, 1.5, 10, 1.3, 1, 3);
cylinder(5, 1.5, -1, 1.1, 1, 3);

// Right track armor skirt
cube(5, 2, 0, 6, 4, 12, 8);

// Right track links
for (let z = 0; z <= 11; z += 3) {
  line(5, 2.2, z, 5, 2.2, z+2, 10);
}

// ===== ARMOR DETAILS & PLATING =====
// Hull bottom reinforced belly armor
cube(-4, 1, 0, 4, 1, 12, 8);

// Turret spaced armor boxes on sides
cube(-4, 8, 4, -3, 10, 6, 10); // BRICK left
cube(3, 8, 4, 4, 10, 6, 10);   // BRICK right

// Side hull panel lines and details
for (let z = 2; z <= 10; z += 2.5) {
  block(-5, 4, z, 10);
  block(5, 4, z, 10);
}

// Reinforced front plate lines
for (let x = -3; x <= 3; x += 2) {
  block(x, 6.5, 0, 10);
}

// ===== ENGINE & EXHAUST =====
// Engine compartment louvers (rear vents)
for (let x = -2; x <= 2; x += 2) {
  cube(x-0.4, 6.5, 11.5, x+0.4, 7, 11.5, 10);
}

// Exhaust outlet
line(-0.5, 3, 13, 0.5, 3, 13, 3); // STONE

// ===== SMOKE GRENADE LAUNCHERS =====
// Port side (left)
cube(-4, 7, 11, -3.2, 8, 12, 10);

// Starboard side (right)
cube(3.2, 7, 11, 4, 8, 12, 10);

// ===== ANTENNA & COMMUNICATIONS =====
line(0, 13, 5, 0, 15, 5, 10);  // Radio antenna mast

// Periscope guard ring
hollowCube(-1, 9, 4.5, 1, 11, 5.5, 8);

// ===== MINOR DETAILS =====
// Hull top deck plating
cube(-3, 7, 2, 3, 7.2, 9, 7); // PLANKS

// Tow lugs/hooks
block(-5, 3, 2, 10);
block(5, 3, 2, 10);

// Hull side markings (identification)
for (let z = 4; z <= 8; z += 2) {
  block(-6, 5, z, 10);
  block(6, 5, z, 10);
}

// Front hull number plate
cube(-1.5, 5.5, -1.5, 1.5, 6.5, -1.5, 10);

// Slat armor on hull sides
for (let z = 2; z <= 10; z += 3) {
  cube(-6, 3, z, -5.5, 4, z+1.5, 10);
  cube(5.5, 3, z, 6, 4, z+1.5, 10);
}

// Mudguards above tracks
cube(-6, 5, 0, -5, 5.8, 12, 8);
cube(5, 5, 0, 6, 5.8, 12, 8);

// Barrel support turret ring (reinforcement)
cylinder(0, 6.8, 5, 3.5, 0.3, 8);

// Final battle-worn detail - tool rack on hull rear
block(-2, 7.2, 11, 7);
block(2, 7.2, 11, 7);
block(0, 7.2, 11.5, 7);