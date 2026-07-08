// pirate-ship-4x-haiku — prompt:
// pirate-ship...

// PIRATE SHIP - Black Pearl

// HULL STRUCTURE
cube(-7, 0, -12, -7, 4, 12, PLANKS);
cube(7, 0, -12, 7, 4, 12, PLANKS);
cube(-7, -1, -12, 7, -1, 12, PLANKS);

// Internal reinforcement
cube(-5, 1, -10, 5, 4, 10, PLANKS);

// MAIN DECK
cube(-6, 5, -12, 6, 5, 12, PLANKS);

// RAILINGS
line(-7, 6, -12, -7, 6, 12, OAK_LOG);
line(7, 6, -12, 7, 6, 12, OAK_LOG);
line(-7, 6, -12, 7, 6, -12, OAK_LOG);
line(-7, 6, 12, 7, 6, 12, OAK_LOG);
line(-6, 6, -12, -6, 6, 12, OAK_LOG);
line(6, 6, -12, 6, 6, 12, OAK_LOG);

// BOW CASTLE (FRONT)
cube(-5, 6, -12, 5, 7, -10, PLANKS);
cube(-4, 7, -12, 4, 8, -11, PLANKS);
block(-4, 8, -12, BRICK);
block(0, 8, -12, BRICK);
block(4, 8, -12, BRICK);

// STERN CASTLE (BACK)
cube(-5, 6, 10, 5, 8, 12, PLANKS);
cube(-4, 8, 11, 4, 9, 12, PLANKS);

// CAPTAIN'S CABIN
cube(-4, 8, 10, 4, 11, 12, PLANKS);
block(-3, 9, 10, GLASS);
block(-1, 9, 10, GLASS);
block(1, 9, 10, GLASS);
block(3, 9, 10, GLASS);
block(-3, 10, 10, GLASS);
block(-1, 10, 10, GLASS);
block(1, 10, 10, GLASS);
block(3, 10, 10, GLASS);
cube(-5, 11, 10, 5, 11, 12, BRICK);

// MASTS
for (let y = 5; y <= 20; y++) block(0, y, -8, OAK_LOG);
for (let y = 5; y <= 22; y++) block(0, y, 0, OAK_LOG);
for (let y = 5; y <= 18; y++) block(0, y, 8, OAK_LOG);

// MAST BASES
cube(-1, 5, -8, 1, 5, -8, OAK_LOG);
cube(-1, 5, 0, 1, 5, 0, OAK_LOG);
cube(-1, 5, 8, 1, 5, 8, OAK_LOG);

// YARDS (HORIZONTAL BEAMS)
line(-5, 17, -8, 5, 17, -8, OAK_LOG);
line(-4, 14, -8, 4, 14, -8, OAK_LOG);
line(-6, 19, 0, 6, 19, 0, OAK_LOG);
line(-6, 15, 0, 6, 15, 0, OAK_LOG);
line(-5, 11, 0, 5, 11, 0, OAK_LOG);
line(-4, 16, 8, 4, 16, 8, OAK_LOG);
line(-3, 13, 8, 3, 13, 8, OAK_LOG);

// SAILS
cube(-5, 15, -8, -4, 18, -7, PLANKS);
cube(4, 15, -8, 5, 18, -7, PLANKS);
cube(-6, 16, 0, -5, 19, 1, PLANKS);
cube(5, 16, 0, 6, 19, 1, PLANKS);
cube(-5, 12, 0, -4, 15, 1, PLANKS);
cube(4, 12, 0, 5, 15, 1, PLANKS);
cube(-4, 15, 8, -3, 17, 9, PLANKS);
cube(3, 15, 8, 4, 17, 9, PLANKS);

// CANNONS (PORT/LEFT)
cube(-8, 4, -8, -8, 5, -6, BRICK);
cube(-8, 4, -1, -8, 5, 1, BRICK);
cube(-8, 4, 6, -8, 5, 8, BRICK);

// CANNONS (STARBOARD/RIGHT)
cube(8, 4, -8, 8, 5, -6, BRICK);
cube(8, 4, -1, 8, 5, 1, BRICK);
cube(8, 4, 6, 8, 5, 8, BRICK);

// CANNON WHEELS
cylinder(-8, 3, -7, 1, 1, COBBLE);
cylinder(-8, 3, 0, 1, 1, COBBLE);
cylinder(-8, 3, 7, 1, 1, COBBLE);
cylinder(8, 3, -7, 1, 1, COBBLE);
cylinder(8, 3, 0, 1, 1, COBBLE);
cylinder(8, 3, 7, 1, 1, COBBLE);

// SHIP'S WHEEL
cube(-1, 6, 11, 0, 6, 12, COBBLE);
line(-2, 7, 11, 2, 7, 11, OAK_LOG);
line(-1, 6, 11, -1, 8, 11, OAK_LOG);
line(0, 6, 11, 0, 8, 11, OAK_LOG);
block(-2, 7, 11, OAK_LOG);
block(2, 7, 11, OAK_LOG);
block(-1, 6, 11, OAK_LOG);
block(0, 6, 11, OAK_LOG);

// BARRELS
cylinder(-4, 6, 3, 1, 1, COBBLE);
cylinder(4, 6, 3, 1, 1, COBBLE);
cylinder(-3, 6, -5, 1, 1, COBBLE);
cylinder(3, 6, -5, 1, 1, COBBLE);
cylinder(0, 6, -11, 1, 1, COBBLE);
cylinder(-5, 6, 8, 1, 1, COBBLE);
cylinder(5, 6, 8, 1, 1, COBBLE);

// RIGGING/ROPE LINES
line(-5, 17, -8, -7, 6, -12, OAK_LOG);
line(5, 17, -8, 7, 6, -12, OAK_LOG);
line(-6, 19, 0, -8, 6, -8, OAK_LOG);
line(6, 19, 0, 8, 6, -8, OAK_LOG);
line(-6, 19, 0, -8, 6, 8, OAK_LOG);
line(6, 19, 0, 8, 6, 8, OAK_LOG);

// BOWSPRIT
line(0, 5, -12, 0, 2, -19, OAK_LOG);
line(-1, 5, -12, -1, 2, -19, OAK_LOG);
line(1, 5, -12, 1, 2, -19, OAK_LOG);

// ANCHOR
line(-8, 5, -12, -10, 1, -15, COBBLE);
cube(-11, 0, -16, -9, 2, -14, COBBLE);

// CROW'S NESTS
hollowSphere(0, 17, -8, 2, PLANKS);
hollowSphere(0, 19, 0, 2, PLANKS);
hollowSphere(0, 15, 8, 2, PLANKS);

// FLAGS
cube(1, 21, -1, 2, 22, 1, OAK_LOG);
cube(2, 20, -2, 5, 23, 2, BRICK);
cube(5, 9, 11, 6, 10, 12, OAK_LOG);
cube(6, 8, 10, 8, 11, 12, BRICK);

// CARGO CRATES
cube(-5, 6, -6, -4, 7, -5, COBBLE);
cube(4, 6, -6, 5, 7, -5, COBBLE);
cube(-2, 6, 5, 2, 7, 6, COBBLE);

// HULL REINFORCEMENT DETAILS
for (let z = -12; z <= 12; z += 4) {
  block(-5, 2, z, OAK_LOG);
  block(5, 2, z, OAK_LOG);
}

// FIGUREHEAD
cube(-2, 4, -12, 2, 6, -12, BRICK);
block(-1, 7, -12, BRICK);
block(1, 7, -12, BRICK);

// ROPE COILS
cylinder(-6, 6, 2, 0.5, 1, OAK_LOG);
cylinder(6, 6, 2, 0.5, 1, OAK_LOG);

// MAST BRACES
line(-2, 5, -8, -2, 6, -6, COBBLE);
line(2, 5, -8, 2, 6, -6, COBBLE);
line(-2, 5, 0, -2, 6, 2, COBBLE);
line(2, 5, 0, 2, 6, 2, COBBLE);
line(-2, 5, 8, -2, 6, 10, COBBLE);
line(2, 5, 8, 2, 6, 10, COBBLE);

// HULL PLANKING
for (let y = 1; y <= 3; y++) {
  block(-5, y, -9, PLANKS);
  block(-5, y, -3, PLANKS);
  block(-5, y, 3, PLANKS);
  block(-5, y, 9, PLANKS);
  block(5, y, -9, PLANKS);
  block(5, y, -3, PLANKS);
  block(5, y, 3, PLANKS);
  block(5, y, 9, PLANKS);
}

// SMALL BOATS ON DAVITS
cube(-7, 9, 7, -5, 10, 9, PLANKS);
cube(5, 9, 7, 7, 10, 9, PLANKS);

// ADDITIONAL BARRELS STORAGE
cylinder(-1, 6, -12, 1, 1, COBBLE);
cylinder(1, 6, -12, 1, 1, COBBLE);

// CABIN DOOR
cube(-1, 8, 12, 1, 10, 12, BRICK);