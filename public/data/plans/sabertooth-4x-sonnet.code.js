// sabertooth-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
const FUR = SAND;        // tawny coat
const SHADE = DIRT;      // darker fur/paws
const STRIPE = COBBLE;   // dark stripes
const CREAM = SNOW;      // belly / fangs
const ROCK = STONE;
const TONGUE = BRICK;

// ---------- ground detail: scattered rocks under the crouch ----------
cube(-7, -1, -14, -5, -1, -12, ROCK);
cube(5, -1, -14, 7, -1, -12, ROCK);
block(-4, 0, -13, ROCK);
block(4, 0, -13, ROCK);

// ================= LEGS =================
// Front-left
cube(-6, 4, -5, -4, 7, -3, FUR);
cube(-6, 1, -6, -4, 4, -4, FUR);
cube(-6, 0, -6, -4, 1, -5, SHADE);
cube(-6, 1, -7, -4, 1, -6, CREAM);
cube(-6, 5, -5, -4, 5, -3, STRIPE);
// Front-right
cube(4, 4, -5, 6, 7, -3, FUR);
cube(4, 1, -6, 6, 4, -4, FUR);
cube(4, 0, -6, 6, 1, -5, SHADE);
cube(4, 1, -7, 6, 1, -6, CREAM);
cube(4, 5, -5, 6, 5, -3, STRIPE);
// Back-left (big haunch, coiled crouch)
cube(-6, 3, 5, -3, 9, 8, FUR);
cube(-6, 1, 7, -4, 3, 9, FUR);
cube(-6, 0, 8, -4, 1, 10, SHADE);
cube(-6, 1, 9, -4, 1, 11, CREAM);
cube(-6, 6, 5, -3, 6, 8, STRIPE);
// Back-right
cube(3, 3, 5, 6, 9, 8, FUR);
cube(4, 1, 7, 6, 3, 9, FUR);
cube(4, 0, 8, 6, 1, 10, SHADE);
cube(4, 1, 9, 6, 1, 11, CREAM);
cube(3, 6, 5, 6, 6, 8, STRIPE);

// ================= TORSO (tapered slices, chest -> waist -> hips) =================
const torsoProfile = [
  // [z, halfW, yBot, yTop]
  [-4, 4, 4, 11],
  [-3, 4, 4, 11],
  [-2, 4, 4, 11],
  [-1, 3, 5, 10],
  [0, 3, 5, 10],
  [1, 3, 5, 10],
  [2, 3, 5, 10],
  [3, 4, 4, 11],
  [4, 4, 4, 12],
  [5, 4, 4, 12],
  [6, 3, 4, 11],
];
for (const [z, hw, yb, yt] of torsoProfile) {
  cube(-hw, yb, z, hw, yt, z, FUR);
  cube(-hw, yb, z, hw, yb, z, CREAM); // pale belly line
}
// stripe rings across torso
for (const z of [-3, 0, 3, 5]) {
  const p = torsoProfile.find(s => s[0] === z);
  cube(-p[1], p[2] + 1, z, p[1], p[2] + 1, z, STRIPE);
  cube(-p[1], p[3] - 1, z, p[1], p[3] - 1, z, STRIPE);
}
// shoulder + hip muscle bulges
cube(-5, 6, -4, 5, 9, -3, FUR);
cube(-5, 6, 5, 5, 10, 6, FUR);

// ================= NECK =================
cube(-3, 6, -6, 3, 11, -5, FUR);
cube(-3, 7, -7, 3, 12, -6, FUR);
cube(-3, 8, -7, 3, 8, -6, STRIPE);

// ================= HEAD =================
// skull
cube(-3, 7, -9, 3, 13, -7, FUR);
cube(-3, 8, -9, 3, 8, -9, STRIPE); // brow stripe
// forehead / muzzle
cube(-2, 6, -11, 2, 10, -9, FUR);
cube(-2, 6, -12, 2, 9, -11, FUR);
block(0, 8, -13, ROCK); // nose

// jaw (open, dramatic)
cube(-2, 3, -11, 2, 5, -9, FUR);
cube(-1, 3, -12, 1, 4, -11, SHADE);
cube(-1, 4, -11, 1, 4, -10, TONGUE); // tongue glimpse

// ears
cube(-3, 13, -8, -2, 14, -7, SHADE);
cube(2, 13, -8, 3, 14, -7, SHADE);
cube(-3, 14, -8, -2, 14, -7, STRIPE);
cube(2, 14, -8, 3, 14, -7, STRIPE);

// eyes
block(-2, 10, -9, ROCK);
block(2, 10, -9, ROCK);

// cheek fur tufts
cube(-4, 5, -9, -3, 7, -8, FUR);
cube(3, 5, -9, 4, 7, -8, FUR);

// ================= SABER FANGS =================
function saber(sign) {
  for (let i = 0; i < 8; i++) {
    const y = 6 - i;
    const z = -11 - Math.floor(i * 0.4);
    const w = i < 6 ? 1 : 0;
    cube(sign * 1 - w, y, z, sign * 1 + w, y, z, CREAM);
  }
}
saber(-1);
saber(1);

// ================= TAIL (curls up and back) =================
for (let i = 0; i < 11; i++) {
  const z = 7 + i;
  const y = 9 + Math.floor(i * 0.7);
  const w = i < 7 ? 1 : 0;
  const col = i % 3 === 2 ? STRIPE : FUR;
  cube(-1 - w, y, z, 1 + w, y + 1, z, col);
}
block(0, 16, 17, CREAM); // tail tip
```
