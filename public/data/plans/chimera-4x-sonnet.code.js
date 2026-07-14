// chimera-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== CHIMERA — lion body, goat head, serpent tail, wings =====
// Front (face/chest) points NORTH (-Z). Feet at y=0.

function box(x1, y1, z1, x2, y2, z2, id) {
  cube(Math.min(x1, x2), Math.min(y1, y2), Math.min(z1, z2),
       Math.max(x1, x2), Math.max(y1, y2), Math.max(z1, z2), id);
}
function R(v) { return Math.round(v); }

const FUR   = SAND;     // golden lion fur
const MANE  = OAK_LOG;  // dark shaggy mane / bone struts
const GOAT  = PLANKS;   // goat-head fur (tonal contrast)
const HORN  = COBBLE;   // horns / hooves / claws
const SCALE = LEAVES;   // serpent scales
const DARK  = STONE;    // eyes-brow, teeth, membrane
const RED   = BRICK;    // mouth, tongue, flame
const WHITE = SNOW;     // eyes, fangs

// ---------------- LEGS ----------------
function leg(x, z) {
  cylinder(x, 0, z, 1, 6, FUR);          // leg column
  sphere(x, 1, z, 1, FUR);               // paw mass
  block(x - 1, 0, z - 2, HORN);
  block(x,     0, z - 2, HORN);
  block(x + 1, 0, z - 2, HORN);          // claws, forward-facing (north)
}
leg(-3, -3);
leg(3, -3);
leg(-3, 5);
leg(3, 5);

// ---------------- TORSO ----------------
box(-3, 6, -4, 3, 10, 6, FUR);          // core barrel
sphere(0, 8, -5, 4, FUR);               // chest bulge (front)
sphere(0, 8, 6, 4, FUR);                // haunch bulge (rear)
box(-2, 5, -3, 2, 6, 5, FUR);           // underbelly fill
box(-3, 9, -2, 3, 10, 3, MANE);         // dorsal ridge shading along spine

// mane shell around neck/shoulders
hollowSphere(0, 11, -5, 3, MANE);
sphere(0, 9, -6, 2, MANE);

// ---------------- LION HEAD (front, north) ----------------
box(-2, 9, -9, 2, 12, -6, FUR);         // skull
box(-1, 9, -11, 1, 10, -9, FUR);        // snout
block(0, 10, -11, DARK);
block(0, 9, -11, DARK);                 // nose
box(-1, 8, -10, 1, 9, -9, RED);         // jaw / mouth
block(-1, 9, -9, WHITE);
block(1, 9, -9, WHITE);                 // fangs
block(-2, 11, -8, WHITE);
block(2, 11, -8, WHITE);                // eyes
block(-2, 12, -8, DARK);
block(2, 12, -8, DARK);                 // brows
box(-2, 12, -7, -1, 13, -6, FUR);
box(1, 12, -7, 2, 13, -6, FUR);         // ears
line(-2, 9, -10, -6, 9, -12, WHITE);
line(2, 9, -10, 6, 9, -12, WHITE);      // whiskers
block(0, 8, -12, RED);
block(0, 8, -13, RED);                  // breath / ember trail forward

// ---------------- GOAT HEAD (rising from shoulders) ----------------
cylinder(0, 10, -1, 1, 4, GOAT);        // neck
box(-1, 14, -3, 1, 16, -1, GOAT);       // skull
box(-1, 13, -4, 1, 14, -2, GOAT);       // snout
block(0, 13, -4, DARK);                 // nose
block(-1, 15, -3, WHITE);
block(1, 15, -3, WHITE);                // eyes
box(-2, 16, -2, -1, 16, -1, GOAT);
box(1, 16, -2, 2, 16, -1, GOAT);        // ears
block(0, 12, -3, MANE);                 // beard tuft

function horn(sign) {
  let x = sign * 1, y = 16, z = -3;
  for (let i = 0; i < 9; i++) {
    x += sign * 0.35;
    y += 0.55;
    z += 0.35;
    block(R(x), R(y), R(z), HORN);
  }
  sphere(R(x), R(y), R(z), 1, HORN);
}
horn(-1);
horn(1);

// ---------------- SERPENT TAIL (rears up from haunches) ----------------
let tipX = 0, tipY = 9, tipZ = 6;
for (let i = 0; i < 20; i++) {
  const t = i / 19;
  const px = Math.sin(t * 3) * 3;
  const py = 9 + t * 10 - t * t * 3;
  const pz = 6 + t * 6;
  const r = Math.max(1, R(3 - t * 2.3));
  sphere(R(px), R(py), R(pz), r, SCALE);
  tipX = px; tipY = py; tipZ = pz;
}
sphere(R(tipX), R(tipY) + 1, R(tipZ), 2, SCALE);      // snake head
block(R(tipX) - 1, R(tipY) + 2, R(tipZ) - 1, WHITE);
block(R(tipX) + 1, R(tipY) + 2, R(tipZ) - 1, WHITE);  // eyes
block(R(tipX), R(tipY), R(tipZ) - 2, RED);            // tongue/fang tip

// ---------------- WINGS (bat-like, spread up and back) ----------------
function wing(sign) {
  box(sign * 3, 11, -1, sign * 7, 12, 2, DARK);
  box(sign * 6, 13, -1, sign * 11, 14, 3, DARK);
  box(sign * 9, 15, 0, sign * 14, 16, 4, DARK);
  line(sign * 3, 11, 0, sign * 14, 16, 4, MANE);
  line(sign * 3, 11, 0, sign * 11, 14, 3, MANE);
  line(sign * 3, 11, 0, sign * 7, 12, -1, MANE);
  line(sign * 3, 11, 0, sign * 3, 17, 2, MANE);
}
wing(-1);
wing(1);

// ---------------- GROUND DETAIL ----------------
disk(-3, -1, -3, 2, HORN);
disk(3, -1, -3, 2, HORN);
disk(-3, -1, 5, 2, HORN);
disk(3, -1, 5, 2, HORN);
```
