// minion-4x-opus — prompt:
// a Minion...

const meta = { name: "minion" };

// ---- helpers ----
// vertical filled disk in the XY plane at fixed z (faces the camera, -Z front)
function vDisk(cx, cy, z, r, id) {
  for (let x = -r; x <= r; x++)
    for (let y = -r; y <= r; y++)
      if (x * x + y * y <= r * r + r) block(cx + x, cy + y, z, id);
}
// vertical ring (annulus) in XY plane
function vRing(cx, cy, z, rOut, rIn, id) {
  for (let x = -rOut; x <= rOut; x++)
    for (let y = -rOut; y <= rOut; y++) {
      const d = x * x + y * y;
      if (d <= rOut * rOut + rOut && d >= rIn * rIn) block(cx + x, cy + y, z, id);
    }
}

const R = 7;

// ================= BODY (yellow capsule) =================
// main cylinder body, feet-region starts above the legs
cylinder(0, 3, 0, R, 17, SAND);          // y = 3..19
// rounded dome head — only upper hemisphere adds new blocks
sphere(0, 19, 0, R, SAND);               // caps the top

// ================= OVERALLS (blue) =================
// lower body fully blue like the dungarees
cylinder(0, 3, 0, R, 6, GLASS);          // y = 3..8

// front bib panel (front = -Z). Body front surface at z ≈ -7
cube(-3, 8, -7, 3, 11, -5, GLASS);       // bib rises above the waist
// straps up to the shoulders
line(-3, 11, -7, -4, 17, -6, GLASS);
line(3, 11, -7, 4, 17, -6, GLASS);
line(-4, 17, -6, -4, 17, -5, GLASS);
line(4, 17, -6, 4, 17, -5, GLASS);
// strap buttons + a little pocket outline (metal)
block(-3, 11, -8, STONE);
block(3, 11, -8, STONE);
hollowCube(-2, 8, -7, 1, 10, -7, STONE); // pocket square on the bib

// ================= LEGS + SHOES =================
// stubby blue legs
cube(-4, 0, -1, -2, 2, 1, GLASS);
cube(2, 0, -1, 4, 2, 1, GLASS);
// black shoes poking forward (toward -Z)
cube(-5, 0, -3, -1, 1, 1, COBBLE);
cube(1, 0, -3, 5, 1, 1, COBBLE);
// shoe soles a touch wider at the toe
cube(-5, 0, -3, -1, 0, -3, STONE);
cube(1, 0, -3, 5, 0, -3, STONE);

// ================= ARMS + GLOVES =================
// left arm (yellow) hanging down the side, ending in a black glove
cube(-9, 10, -1, -7, 13, 1, SAND);
cube(-10, 8, -1, -8, 10, 1, SAND);
sphere(-9, 7, 0, 2, COBBLE);             // glove
// right arm
cube(7, 10, -1, 9, 13, 1, SAND);
cube(8, 8, -1, 10, 10, 1, SAND);
sphere(9, 7, 0, 2, COBBLE);              // glove

// ================= GOGGLE STRAP (black band round the head) =================
hollowCylinder(0, 14, 0, R, 3, STONE);   // y = 14..16 metal/black band

// ================= EYE (single, Stuart-style) =================
// front surface at x=0,y=15 is z = -7; eye protrudes toward the camera
vDisk(0, 15, -7, 4, STONE);              // rim backing on the face
vDisk(0, 15, -8, 4, STONE);             // metal goggle rim depth
vRing(0, 15, -9, 4, 3, STONE);           // rim front edge
vDisk(0, 15, -9, 3, SNOW);               // white of the eye
vDisk(0, 15, -10, 3, SNOW);              // eyeball protrudes
vDisk(0, 15, -10, 1, COBBLE);            // dark pupil (brown-ish)
vDisk(0, 15, -11, 1, COBBLE);
block(1, 16, -11, SNOW);                 // catch-light glint
block(1, 16, -10, SNOW);

// ================= MOUTH (open grin with teeth) =================
// dark cavity
cube(-3, 11, -7, 3, 12, -7, COBBLE);
cube(-2, 10, -7, 2, 10, -7, COBBLE);     // rounded lower lip
// upper teeth
line(-2, 12, -7, 2, 12, -7, SNOW);
// smile corners turning upward
block(-3, 12, -7, COBBLE);
block(3, 12, -7, COBBLE);

// ================= HAIR (sparse black sprigs on top) =================
const sprigs = [
  [-2, 20, 0], [-3, 20, 1], [2, 20, -1], [3, 20, 0],
  [0, 20, -2], [-1, 20, 2], [1, 20, 2],
];
for (const [hx, , hz] of sprigs) {
  block(hx, 26, hz, STONE);
  block(hx, 27, hz, STONE);
  if ((hx + hz) % 2 === 0) block(hx, 28, hz, STONE);
}