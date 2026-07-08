// pirate-ship-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
I'll output the pirate ship build directly as JavaScript.

```js
const deckY = 3;
const seaY = -1;

const hullSegments = [
  { z1: -17, z2: -15, hw: 1, keel: -2 },
  { z1: -15, z2: -12, hw: 3, keel: -3 },
  { z1: -12, z2: -8,  hw: 4, keel: -4 },
  { z1: -8,  z2: 4,   hw: 5, keel: -5 },
  { z1: 4,   z2: 8,   hw: 4, keel: -4 },
  { z1: 8,   z2: 12,  hw: 3, keel: -3 },
  { z1: 12,  z2: 15,  hw: 3, keel: -2 },
];

function hwAt(z) {
  for (const s of hullSegments) if (z >= s.z1 && z <= s.z2) return s;
  return hullSegments[hullSegments.length - 1];
}

// --- sea (placed first so the hull overwrites it where they overlap) ---
cube(-9, seaY, -18, 9, seaY, 16, GLASS);
block(0, seaY, -18, SNOW);
block(-1, seaY, -17, SNOW);
block(1, seaY, -19 + 1, ICE);

// --- hull shell ---
for (const s of hullSegments) {
  const { z1, z2, hw, keel } = s;
  cube(-hw, keel, z1, -hw, deckY - 1, z2, PLANKS);
  cube(hw, keel, z1, hw, deckY - 1, z2, PLANKS);
  cube(-hw, keel, z1, hw, keel, z2, COBBLE);
  cube(-hw, deckY, z1, hw, deckY, z2, PLANKS);
  cube(-hw, keel, z1, hw, deckY - 1, z1, PLANKS);
}
const last = hullSegments[hullSegments.length - 1];
cube(-last.hw, last.keel, last.z2, last.hw, deckY - 1, last.z2, PLANKS);

// rib accents
for (let z = -16; z <= 14; z += 3) {
  const s = hwAt(z);
  line(-s.hw, s.keel, z, -s.hw, deckY - 1, z, OAK_LOG);
  line(s.hw, s.keel, z, s.hw, deckY - 1, z, OAK_LOG);
}

// gun-port window notches (free AIR)
for (let z = -6; z <= 6; z += 3) {
  const s = hwAt(z);
  block(s.hw, 1, z, AIR);
  block(-s.hw, 1, z, AIR);
}

// --- bulwark / railing ---
for (const s of hullSegments) {
  cube(-s.hw, deckY + 1, s.z1, -s.hw, deckY + 2, s.z2, PLANKS);
  cube(s.hw, deckY + 1, s.z1, s.hw, deckY + 2, s.z2, PLANKS);
}
for (let z = -16; z <= 14; z += 2) {
  const s = hwAt(z);
  block(-s.hw, deckY + 3, z, OAK_LOG);
  block(s.hw, deckY + 3, z, OAK_LOG);
}
cube(-1, deckY + 1, -17, 1, deckY + 2, -17, PLANKS);
cube(-3, deckY + 1, 15, 3, deckY + 2, 15, PLANKS);

// --- cannons ---
for (let z = -11; z <= 7; z += 3) {
  const s = hwAt(z);
  if (s.hw >= 4) {
    line(s.hw - 1, 1, z, s.hw + 2, 1, z, STONE);
    line(-s.hw - 2, 1, z, -s.hw + 1, 1, z, STONE);
  }
}

// --- sterncastle (aft cabin) ---
const scX1 = -3, scX2 = 3, scZ1 = 10, scZ2 = 15, scY1 = deckY + 1, scY2 = deckY + 7;
cube(scX1, scY1, scZ1, scX2, scY2, scZ1, PLANKS);
cube(scX1, scY1, scZ1, scX1, scY2, scZ2, PLANKS);
cube(scX2, scY1, scZ1, scX2, scY2, scZ2, PLANKS);
cube(scX1, scY1, scZ2, scX2, scY2, scZ2, PLANKS);
cube(scX1, scY2, scZ1, scX2, scY2, scZ2, BRICK);
for (let z = 11; z <= 14; z += 2) {
  block(scX1, scY1 + 1, z, AIR);
  block(scX2, scY1 + 1, z, AIR);
}
block(0, scY1, scZ1, AIR);
block(0, scY1 + 1, scZ1, AIR);

// ship's wheel
block(0, deckY + 1, 13, OAK_LOG);
hollowCylinder(0, deckY + 2, 13, 1, 1, OAK_LOG);

// --- masts, yards, sails ---
const masts = [
  { z: -10, height: 16 },
  { z: -1, height: 22 },
  { z: 8, height: 16 },
];
for (const m of masts) {
  cylinder(0, deckY, m.z, 1, m.height, OAK_LOG);
  const topY = deckY + m.height;
  disk(0, topY - 2, m.z, 2, PLANKS);
  hollowCylinder(0, topY - 1, m.z, 2, 1, OAK_LOG);
}

function addSail(mastZ, y1, y2, width) {
  cube(-width, y1, mastZ, -2, y2, mastZ, SNOW);
  cube(2, y1, mastZ, width, y2, mastZ, SNOW);
}
function addYard(mastZ, y, width) {
  line(-width, y, mastZ, width, y, mastZ, OAK_LOG);
}
function rig(mastZ, y, width, hw) {
  line(-width, y, mastZ, -hw, deckY, mastZ - 2, OAK_LOG);
  line(width, y, mastZ, hw, deckY, mastZ + 2, OAK_LOG);
}

addYard(-10, deckY + 8, 4);
addSail(-10, deckY + 4, deckY + 8, 4);
addYard(-10, deckY + 13, 3);
addSail(-10, deckY + 10, deckY + 13, 3);
rig(-10, deckY + 8, 4, 4);

addYard(-1, deckY + 10, 5);
addSail(-1, deckY + 5, deckY + 10, 5);
addYard(-1, deckY + 16, 4);
addSail(-1, deckY + 12, deckY + 16, 4);
addYard(-1, deckY + 20, 3);
addSail(-1, deckY + 18, deckY + 20, 3);
rig(-1, deckY + 10, 5, 5);

addYard(8, deckY + 8, 4);
addSail(8, deckY + 4, deckY + 8, 4);
addYard(8, deckY + 13, 3);
addSail(8, deckY + 10, deckY + 13, 3);
rig(8, deckY + 8, 4, 3);

// flag atop main mast
const mainTop = deckY + 22;
line(0, mainTop, -1, 0, mainTop + 3, -1, OAK_LOG);
cube(0, mainTop + 2, -1, 2, mainTop + 3, -1, BRICK);

// --- bowsprit & figurehead ---
line(0, deckY + 1, -17, 0, deckY + 3, -21, OAK_LOG);
sphere(0, deckY + 3, -21, 1, STONE);

// --- anchor ---
line(2, deckY, -16, 2, -6, -16, STONE);
sphere(2, -6, -16, 1, STONE);

// --- pier / dock on the east side ---
const pierZ = 0;
const pierHw = hwAt(pierZ).hw;
cube(pierHw + 1, seaY, pierZ - 1, 16, seaY, pierZ + 1, PLANKS);
for (let x = pierHw + 2; x <= 16; x += 3) {
  line(x, seaY - 1, pierZ, x, -4, pierZ, OAK_LOG);
}
line(pierHw, deckY, pierZ, pierHw + 3, seaY + 1, pierZ, PLANKS);

// crates, barrel, treasure chest on the pier
cube(14, seaY + 1, -1, 15, seaY + 2, 0, PLANKS);
cylinder(13, seaY + 1, 1, 1, 1, OAK_LOG);
cube(16, seaY + 1, -1, 17, seaY + 1, 0, OAK_LOG);
block(16, seaY + 2, -1, BRICK);
block(17, seaY + 2, -1, BRICK);
```

I designed a galleon-style pirate ship: shell-built hull (bow tip pointed north at z=-17 toward camera, tapering to a transom stern at z=15), three masts with yards, sails, and rigging, a red-roofed aft sterncastle with windows, side cannons poking through gun-port notches, a bowsprit with figurehead, an anchor chain, and a small pier with crates/barrels/a chest on the east side to catch extra light. A GLASS sea plane was placed first so the hull correctly overwrites it at the waterline, leaving open water visible around the ship.
