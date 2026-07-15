// stonehenge-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Stonehenge =====
// Clear existing trees/foliage from the build footprint and avenue approach
cylinder(0, 0, 0, 18, 10, AIR);
cube(-6, 0, -22, 6, 9, -13, AIR);

// ---- Earthworks: bank, ditch, stone curb (rings) ----
hollowCylinder(0, 0, 0, 19, 1, DIRT);     // raised bank
hollowCylinder(0, -1, 0, 21, 1, AIR);     // ditch outside the bank (free)
hollowCylinder(0, -1, 0, 15, 1, COBBLE);  // stone curb inside the bank

// Causeway: break the rings on the north side so the avenue passes through
cube(-1, -1, -22, 1, 0, -20, AIR); // through the ditch
cube(-1, -1, -20, 1, 0, -18, AIR); // through the bank
cube(-1, -1, -16, 1, 0, -14, AIR); // through the curb

function degToRad(d) { return d * Math.PI / 180; }

// ---- Outer sarsen circle (16 stations, 1 gap = entrance, 2 fallen = ruin) ----
const OUTER_R = 14;
const OUTER_COUNT = 16;
const gapIndex = 0;
const fallenOuter = new Set([6, 11]);
const outerPositions = {};

for (let i = 0; i < OUTER_COUNT; i++) {
  const angle = degToRad(i * (360 / OUTER_COUNT));
  const x = Math.round(OUTER_R * Math.sin(angle));
  const z = Math.round(-OUTER_R * Math.cos(angle));
  if (i === gapIndex) continue; // open entrance facing the camera (north)

  if (fallenOuter.has(i)) {
    // toppled sarsen lying where it fell
    cube(x - 2, 0, z - 1, x + 2, 1, z + 1, STONE);
    continue;
  }
  outerPositions[i] = { x, z };
  cube(x - 1, 0, z - 1, x + 1, 4, z + 1, STONE); // upright, 3x3 footprint, 5 tall
}

// Lintels: only connect adjacent uprights that both still stand
for (let i = 0; i < OUTER_COUNT; i++) {
  const j = (i + 1) % OUTER_COUNT;
  const a = outerPositions[i], b = outerPositions[j];
  if (a && b) {
    line(a.x, 5, a.z, b.x, 5, b.z, STONE);
    line(a.x, 6, a.z, b.x, 6, b.z, STONE);
  }
}

// ---- Inner bluestone circle ----
const BLUE_R = 10;
const BLUE_COUNT = 24;
for (let i = 0; i < BLUE_COUNT; i++) {
  const deg = i * (360 / BLUE_COUNT);
  if (deg < 25 || deg > 335) continue; // leave the entrance open here too
  const angle = degToRad(deg);
  const x = Math.round(BLUE_R * Math.sin(angle));
  const z = Math.round(-BLUE_R * Math.cos(angle));
  cube(x, 0, z, x, 2, z, COBBLE);
}

// ---- Inner horseshoe of trilithons (opens north, toward the camera) ----
function trilithon(cx, cz, h) {
  cube(cx - 3, 0, cz - 1, cx - 2, h - 1, cz + 1, STONE); // left upright
  cube(cx + 2, 0, cz - 1, cx + 3, h - 1, cz + 1, STONE); // right upright
  cube(cx - 3, h, cz - 1, cx + 3, h + 1, cz + 1, STONE); // lintel
}
trilithon(0, 7, 7);   // great trilithon, back of the horseshoe
trilithon(-5, 5, 6);
trilithon(5, 5, 6);
trilithon(-8, 1, 5);  // front pair, flanking the open north side
trilithon(8, 1, 5);

// ---- Altar stone, lying at the foot of the great trilithon ----
cube(-1, 0, 3, 1, 0, 5, STONE);

// ---- Slaughter Stone, fallen flat just inside the entrance ----
cube(-1, 0, -12, 1, 0, -9, STONE);

// ---- Avenue: flanking marker stones leading in from the north ----
for (const z of [-15, -17, -19]) {
  cube(-3, 0, z, -3, 1, z, STONE);
  cube(3, 0, z, 3, 1, z, STONE);
}

// ---- Heel Stone, standing alone outside the circle, leaning slightly ----
for (let layer = 0; layer < 6; layer++) {
  const off = Math.floor(layer / 2);
  cube(2 + off, layer, -20 + off, 3 + off, layer, -19 + off, STONE);
}
```
