// viking-longship-4x-haiku — prompt:
// a Viking longship...

// Viking Longship - Draken (Dragon Ship)
// Prow faces NORTH (-Z), stern at SOUTH (+Z)

// === KEEL & MAIN HULL STRUCTURE ===
// Heavy timber keel - foundation
cube(-3, -2, -20, 3, -1, 12, OAK_LOG);

// Hull ribs (structural frames) every 3 blocks
for (let z = -20; z <= 12; z += 3) {
  cube(-4, -1, z, -4, 3, z, OAK_LOG);
  cube(4, -1, z, 4, 3, z, OAK_LOG);
}

// === HULL PLANKING - EXTERIOR ===
for (let z = -20; z <= 12; z++) {
  // Port (left) side planks
  for (let y = 0; y <= 2; y++) {
    block(-4, y, z, PLANKS);
    block(-3, y, z, PLANKS);
  }
  // Starboard (right) side planks
  for (let y = 0; y <= 2; y++) {
    block(4, y, z, PLANKS);
    block(3, y, z, PLANKS);
  }
}

// Hull floor - strong boarding
cube(-3, -1, -20, 3, -1, 12, PLANKS);

// === PROW (DRAGON HEAD) - NORTH FACING ===
// Base bulkhead
cube(-2, 1, -20, 2, 3, -18, OAK_LOG);

// Dragon head tower - tapered upward
cube(-2, 3, -20, 2, 4, -19, OAK_LOG);
cube(-1, 4, -20, 1, 5, -19, OAK_LOG);

// Dragon snout - carved point facing camera
cube(-1, 5, -21, 1, 6, -21, BRICK);
block(0, 6, -21, BRICK);
block(0, 7, -22, BRICK);

// Dragon scales - carved details flanking snout
for (let y = 2; y <= 5; y++) {
  const scale_offset = Math.floor((y - 2) * 0.6);
  block(-2 - scale_offset, y, -20 + scale_offset, BRICK);
  block(2 + scale_offset, y, -20 + scale_offset, BRICK);
}

// Dragon eye cavities
block(-1, 5, -20, AIR);
block(1, 5, -20, AIR);

// === STERN CASTLE ===
// Stern platform
cube(-3, 1, 9, 3, 1, 12, OAK_LOG);

// Raised stern walls
cube(-3, 2, 10, -3, 4, 12, PLANKS);
cube(3, 2, 10, 3, 4, 12, PLANKS);

// Stern tower back
cube(-2, 2, 11, 2, 5, 12, OAK_LOG);

// High corner posts (castle towers)
cube(-3, 2, 12, -3, 6, 12, OAK_LOG);
cube(3, 2, 12, 3, 6, 12, OAK_LOG);

// === ROWING BENCHES ===
// Long benches for rowers
for (let z = -16; z <= 8; z += 2) {
  cube(-2, 1, z, 2, 1, z, OAK_LOG);
  for (let x = -2; x <= 2; x++) {
    block(x, 2, z, PLANKS);
  }
}

// === SHIELD RACKS - WARRIOR SHIELDS ===
// Port (left) side shields - iconic viking detail
for (let z = -15; z <= 9; z += 2) {
  block(-5, 1, z, BRICK);
  block(-5, 2, z, BRICK);
  block(-5, 3, z, BRICK);
}

// Starboard (right) side shields
for (let z = -15; z <= 9; z += 2) {
  block(5, 1, z, BRICK);
  block(5, 2, z, BRICK);
  block(5, 3, z, BRICK);
}

// === MAST AND RIGGING ===
// Mast base/step
cube(-1, 1, 0, 1, 1, 0, COBBLE);

// Main mast pole
line(0, 2, 0, 0, 9, 0, OAK_LOG);

// Mast crossbeams
line(-3, 4, 0, 3, 4, 0, OAK_LOG);
line(-2, 6, 0, 2, 6, 0, OAK_LOG);

// === DECK DETAILS ===
// Weathered deck boards
for (let z = -18; z <= 10; z += 3) {
  block(-2, 2, z, COBBLE);
  block(2, 2, z, COBBLE);
}

// Hull ornaments - carved patterns
for (let z = -14; z <= 8; z += 3) {
  block(-4, 3, z, COBBLE);
  block(4, 3, z, COBBLE);
}

// === CREW FIGURES FOR SCALE ===
// Bow lookout/navigator
cube(-1, 3, -14, 0, 5, -14, BRICK);
block(0, 2, -15, STONE);

// Stern helmsman
cube(0, 3, 10, 1, 5, 10, BRICK);
block(1, 2, 11, STONE);

// Port side warriors
cube(-2, 3, -8, -1, 5, -8, BRICK);
cube(-2, 3, -2, -1, 5, -2, BRICK);
cube(-2, 3, 4, -1, 5, 4, BRICK);

// Starboard side warriors
cube(2, 3, -8, 1, 5, -8, BRICK);
cube(2, 3, -2, 1, 5, -2, BRICK);
cube(2, 3, 4, 1, 5, 4, BRICK);

// === INTERNAL REINFORCEMENTS ===
// Cross-bracing inside hull for strength
for (let z = -16; z <= 8; z += 4) {
  line(-2, 1, z, 2, 1, z, OAK_LOG);
  line(-3, 2, z, 3, 2, z, PLANKS);
}

// Bilge area - lowest interior
cube(-2, -1, 0, 2, -1, 0, STONE);

// === CARVED PROW DETAILS ===
// Prow sides - flared design
cube(-3, 1, -19, -3, 2, -17, PLANKS);
cube(3, 1, -19, 3, 2, -17, PLANKS);

// Prow ornamental bands
for (let y = 3; y <= 5; y++) {
  block(-2, y, -21, BRICK);
  block(2, y, -21, BRICK);
}

// === STERN DECK DETAILS ===
// Stern railing
line(-3, 5, 12, 3, 5, 12, OAK_LOG);
line(-3, 4, 12, 3, 4, 12, PLANKS);

// Steering platform
cube(-1, 3, 11, 1, 3, 11, OAK_LOG);

// === HULL VARIATION & PATINA ===
// Weathered sections
block(-3, 1, -10, COBBLE);
block(3, 1, -10, COBBLE);
block(-3, 1, 2, COBBLE);
block(3, 1, 2, COBBLE);

// Dark timber accents
block(-4, 2, -6, STONE);
block(4, 2, -6, STONE);
block(-4, 2, 6, STONE);
block(4, 2, 6, STONE);