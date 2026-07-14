// alien-cow-4x-haiku — prompt:
// a UFO abducting a cow...

// UFO Abducting a Cow

const COW_X = 0, COW_Y = 1, COW_Z = 3;
const UFO_X = 0, UFO_Y = 16, UFO_Z = -2;

// === COW ===
// Main brown body
cube(COW_X - 2, COW_Y + 1, COW_Z, COW_X + 2, COW_Y + 3, COW_Z + 3, DIRT);

// Neck
cube(COW_X - 1, COW_Y + 2, COW_Z - 1, COW_X + 1, COW_Y + 4, COW_Z, DIRT);

// Head
cube(COW_X - 1, COW_Y + 2, COW_Z - 3, COW_X + 1, COW_Y + 4, COW_Z - 1, DIRT);

// Snout - tan
cube(COW_X - 1, COW_Y + 2, COW_Z - 4, COW_X + 1, COW_Y + 3, COW_Z - 3, PLANKS);

// Eyes - black
block(COW_X - 1, COW_Y + 3, COW_Z - 3, COBBLE);
block(COW_X + 1, COW_Y + 3, COW_Z - 3, COBBLE);

// Horns
line(COW_X - 1, COW_Y + 5, COW_Z - 3, COW_X - 2, COW_Y + 6, COW_Z - 4, STONE);
line(COW_X + 1, COW_Y + 5, COW_Z - 3, COW_X + 2, COW_Y + 6, COW_Z - 4, STONE);

// Ears
block(COW_X - 2, COW_Y + 4, COW_Z - 2, DIRT);
block(COW_X + 2, COW_Y + 4, COW_Z - 2, DIRT);

// Front legs
cube(COW_X - 2, COW_Y - 1, COW_Z, COW_X - 1, COW_Y + 1, COW_Z + 1, DIRT);
cube(COW_X + 1, COW_Y - 1, COW_Z, COW_X + 2, COW_Y + 1, COW_Z + 1, DIRT);

// Back legs
cube(COW_X - 2, COW_Y - 1, COW_Z + 2, COW_X - 1, COW_Y + 1, COW_Z + 3, DIRT);
cube(COW_X + 1, COW_Y - 1, COW_Z + 2, COW_X + 2, COW_Y + 1, COW_Z + 3, DIRT);

// Hooves
block(COW_X - 2, COW_Y - 1, COW_Z, STONE);
block(COW_X - 1, COW_Y - 1, COW_Z, STONE);
block(COW_X + 1, COW_Y - 1, COW_Z, STONE);
block(COW_X + 2, COW_Y - 1, COW_Z, STONE);
block(COW_X - 2, COW_Y - 1, COW_Z + 3, STONE);
block(COW_X - 1, COW_Y - 1, COW_Z + 3, STONE);
block(COW_X + 1, COW_Y - 1, COW_Z + 3, STONE);
block(COW_X + 2, COW_Y - 1, COW_Z + 3, STONE);

// Tail
line(COW_X + 3, COW_Y + 2, COW_Z + 3, COW_X + 4, COW_Y + 1, COW_Z + 4, OAK_LOG);
block(COW_X + 4, COW_Y + 1, COW_Z + 4, LEAVES);

// Udder
cube(COW_X - 1, COW_Y, COW_Z + 2, COW_X + 1, COW_Y + 1, COW_Z + 3, PLANKS);

// Spots
block(COW_X - 2, COW_Y + 1, COW_Z + 1, COBBLE);
block(COW_X + 2, COW_Y + 2, COW_Z + 2, COBBLE);
block(COW_X, COW_Y + 2, COW_Z + 3, COBBLE);

// === ABDUCTION BEAM ===
for (let y = COW_Y + 5; y < UFO_Y; y++) {
  if (y % 3 === 0) {
    cube(COW_X - 1, y, COW_Z, COW_X + 1, y, COW_Z + 1, GLASS);
  } else if (y % 3 === 1) {
    cube(COW_X - 1, y, COW_Z, COW_X + 1, y, COW_Z + 1, ICE);
  } else {
    cube(COW_X - 1, y, COW_Z, COW_X + 1, y, COW_Z + 1, GLASS);
  }
  if (y % 2 === 0) {
    block(COW_X - 2, y, COW_Z, ICE);
    block(COW_X + 2, y, COW_Z + 1, ICE);
  }
}

// === UFO ===
// Main saucer
hollowCylinder(UFO_X, UFO_Y, UFO_Z, 7, 1, STONE);
disk(UFO_X, UFO_Y - 1, UFO_Z, 7, COBBLE);

// Outer lights
for (let angle = 0; angle < 360; angle += 45) {
  const rad = angle * Math.PI / 180;
  const x = Math.round(UFO_X + Math.cos(rad) * 5);
  const z = Math.round(UFO_Z + Math.sin(rad) * 5);
  block(x, UFO_Y - 1, z, BRICK);
  block(x, UFO_Y, z, BRICK);
}

// Inner lights
for (let angle = 0; angle < 360; angle += 60) {
  const rad = angle * Math.PI / 180;
  const x = Math.round(UFO_X + Math.cos(rad) * 3);
  const z = Math.round(UFO_Z + Math.sin(rad) * 3);
  block(x, UFO_Y - 1, z, GLASS);
}

// Central dome
cylinder(UFO_X, UFO_Y + 1, UFO_Z, 2, 3, STONE);
cube(UFO_X - 1, UFO_Y + 2, UFO_Z - 1, UFO_X + 1, UFO_Y + 4, UFO_Z + 1, GLASS);

// Top dome
sphere(UFO_X, UFO_Y + 5, UFO_Z, 3, GLASS);

// Landing pods
cube(UFO_X - 6, UFO_Y - 2, UFO_Z - 6, UFO_X - 5, UFO_Y - 1, UFO_Z - 5, COBBLE);
cube(UFO_X + 5, UFO_Y - 2, UFO_Z - 6, UFO_X + 6, UFO_Y - 1, UFO_Z - 5, COBBLE);
cube(UFO_X - 6, UFO_Y - 2, UFO_Z + 5, UFO_X - 5, UFO_Y - 1, UFO_Z + 6, COBBLE);
cube(UFO_X + 5, UFO_Y - 2, UFO_Z + 5, UFO_X + 6, UFO_Y - 1, UFO_Z + 6, COBBLE);

// Antenna
line(UFO_X, UFO_Y + 8, UFO_Z, UFO_X, UFO_Y + 10, UFO_Z, BRICK);
block(UFO_X, UFO_Y + 10, UFO_Z, BRICK);

// Antenna rings
block(UFO_X - 1, UFO_Y + 9, UFO_Z, GLASS);
block(UFO_X + 1, UFO_Y + 9, UFO_Z, GLASS);
block(UFO_X, UFO_Y + 9, UFO_Z - 1, GLASS);
block(UFO_X, UFO_Y + 9, UFO_Z + 1, GLASS);