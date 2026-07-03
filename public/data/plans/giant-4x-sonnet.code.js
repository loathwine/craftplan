// giant-4x-sonnet — sandbox error: none (recovered from stream-json transport)
// --- extracted code ---
```javascript
function m(x1,y1,z1, x2,y2,z2, id) {
  cube(x1,y1,z1, x2,y2,z2, id);
  cube(-x2,y1,z1, -x1,y2,z2, id);
}

// === BOOTS (Y -1 to 2) ===
m(1,-1,-3, 5,2,3, OAK_LOG);
m(1,-1,-3, 5,-1,3, COBBLE);
m(2,-1,-4, 4,0,-4, STONE);

// === CALVES (Y 2-7) ===
m(1,2,-2, 5,7,2, COBBLE);
m(2,2,-3, 4,6,-3, STONE);

// === KNEES (Y 7-9) ===
m(1,7,-3, 5,9,3, STONE);

// === THIGHS (Y 9-13) ===
m(1,9,-2, 5,13,2, COBBLE);
m(2,10,-3, 4,12,-3, STONE);
cube(-1,2,-2, 1,12,2, COBBLE);

// === BELT (Y 13-15) ===
cube(-6,13,-3, 6,15,3, OAK_LOG);
cube(-1,13,-4, 1,15,-4, STONE);

// === TORSO (Y 15-23) ===
cube(-6,15,-3, 6,23,3, COBBLE);
cube(-5,17,-4, -1,22,-4, STONE);
cube(1,17,-4, 5,22,-4, STONE);
m(6,15,-2, 7,22,2, STONE);
cube(-1,15,4, 1,23,4, STONE);

// === PAULDRONS (Y 21-25) ===
m(6,21,-3, 9,25,3, STONE);
m(7,24,-2, 8,26,2, COBBLE);

// === NECK + GORGET (Y 23-26) ===
cube(-2,23,-2, 2,26,2, COBBLE);
cube(-3,23,-3, 3,25,3, STONE);

// === HEAD (Y 26-32) ===
cube(-4,26,-4, 4,32,4, COBBLE);

// Helmet – wider stone cap
cube(-5,30,-4, 5,32,4, STONE);
cube(-5,30,-5, 5,32,-4, STONE);

// Left horn sweeping up
line(-5,31,0, -9,33,0, STONE);
block(-10,33,0, COBBLE);
block(-9,33,-1, COBBLE);
block(-9,33,1, COBBLE);

// Ears
m(4,27,-1, 5,30,1, COBBLE);

// === FACE ===
cube(-3,29,-4, -1,30,-4, AIR);
cube(-3,29,-3, -1,30,-3, GLASS);
cube(1,29,-4, 3,30,-4, AIR);
cube(1,29,-3, 3,30,-3, GLASS);

cube(-1,27,-5, 1,28,-5, COBBLE);

cube(-3,26,-4, 3,27,-4, AIR);
block(-2,27,-5, STONE);
block(2,27,-5, STONE);
block(-1,26,-5, STONE);
block(0,26,-5, STONE);
block(1,26,-5, STONE);

// Beard + amulet pendant
cube(-3,19,-5, 3,25,-5, OAK_LOG);
cube(-2,17,-5, 2,19,-5, OAK_LOG);
cube(-1,20,-5, 1,22,-5, BRICK);

// === LEFT ARM (down, ready) ===
cube(-9,13,-2, -7,23,2, COBBLE);
cube(-10,14,-1, -10,21,1, STONE);
cube(-10,11,-2, -7,13,2, STONE);
cube(-10,4,-2, -8,11,2, COBBLE);
cube(-11,4,-2, -8,6,2, STONE);
cube(-10,2,-2, -8,4,2, OAK_LOG);
cube(-11,2,-1, -10,4,1, COBBLE);

// === RIGHT ARM (raised, gripping axe) ===
cube(7,13,-2, 9,23,2, COBBLE);
cube(10,14,-1, 10,21,1, STONE);
cube(7,21,-3, 10,23,3, STONE);
cube(7,23,-2, 9,30,2, COBBLE);
cube(7,23,-3, 9,25,3, STONE);
cube(7,30,-2, 9,32,2, OAK_LOG);

// === AXE HANDLE ===
cube(8,11,-1, 9,33,1, OAK_LOG);
cube(8,16,-2, 9,17,2, STONE);
cube(8,23,-2, 9,24,2, STONE);
cube(8,9,-2, 10,12,2, STONE);

// === AXE BLADE (Y 29-33) ===
cube(9,29,-2, 18,33,2, STONE);
cube(8,31,-1, 18,33,1, STONE);
cube(7,32,-1, 18,33,1, STONE);
cube(6,30,-1, 9,32,1, COBBLE);

// Blade face etching
cube(9,30,-3, 17,32,-3, COBBLE);
for (let i = 0; i < 5; i++) {
  block(10 + i*2, 31, -3, STONE);
}
block(11,32,-3, GLASS);
block(14,32,-3, GLASS);

// Gleaming snow edges
line(7,33,-2, 18,33,-2, SNOW);
line(7,33,2,  18,33,2,  SNOW);
line(7,32,-2, 7,33,-2, SNOW);
line(7,32,2,  7,33,2,  SNOW);
line(18,29,-2, 18,33,-2, SNOW);
line(18,29,2,  18,33,2,  SNOW);
line(9,29,-3, 17,29,-3, SNOW);
line(9,29,3,  17,29,3,  SNOW);

// === GROUND RUBBLE ===
block(-7,-1,-5, COBBLE);
block(7,-1,-5,  COBBLE);
block(-8,-1,-3, COBBLE);
block(8,-1,-3,  COBBLE);
block(0,-1,-6,  STONE);
block(-5,-1,-6, COBBLE);
block(5,-1,-6,  COBBLE);
block(-3,-1,-7, STONE);
block(3,-1,-7,  STONE);
```

// --- raw stdout ---
/*
*/
