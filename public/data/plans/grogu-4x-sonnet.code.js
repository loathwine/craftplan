// grogu-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
const CX = 0, CZ = -2;

// ============ helpers ============
function lowerHemisphere(cx, cy, cz, r, id) {
  for (let x = -r; x <= r; x++)
    for (let y = -r; y <= 0; y++)
      for (let z = -r; z <= r; z++)
        if (x * x + y * y + z * z <= r * r) block(cx + x, cy + y, cz + z, id);
}
function upperShell(cx, cy, cz, r, id) {
  for (let x = -r; x <= r; x++)
    for (let y = 0; y <= r; y++)
      for (let z = -r; z <= r; z++) {
        const d2 = x * x + y * y + z * z;
        if (d2 <= r * r && d2 >= (r - 1) * (r - 1)) block(cx + x, cy + y, cz + z, id);
      }
}
function buildEar(sign) {
  const steps = 9;
  for (let i = 0; i < steps; i++) {
    const f = i / (steps - 1);
    const ex = Math.round(sign * (4 + f * 6));
    const ey = Math.round(16 + f * 9);
    const ez = Math.round(CZ - 1 + f * f * 3);
    const r = Math.max(1, Math.round(2.3 - f * 1.8));
    sphere(ex, ey, ez, r, LEAVES);
  }
}

// ============ ground clearing / rug ============
disk(CX, -1, CZ, 6, DIRT);
hollowCylinder(CX, -1, CZ, 6, 1, SAND);

// ============ robe (tapered cone body) ============
const robeTopY = 7;
for (let y = 0; y <= robeTopY; y++) {
  const t = y / robeTopY;
  const r = Math.max(2, Math.round(5 - t * 3));
  disk(CX, y, CZ, r, PLANKS);
}
hollowCylinder(CX, 0, CZ, 5, 1, OAK_LOG); // hem trim
for (let y = 2; y <= robeTopY; y += 2) {
  const t = y / robeTopY;
  const r = Math.max(2, Math.round(5 - t * 3));
  hollowCylinder(CX, y, CZ, r, 1, OAK_LOG); // fold bands
}

// hood/collar connecting robe to head
cylinder(CX, 8, CZ, 3, 1, OAK_LOG);
disk(CX, 8, CZ, 3, PLANKS);

// ============ tiny feet peeking out front ============
cube(-2, 0, CZ - 5, -1, 0, CZ - 4, LEAVES);
cube(1, 0, CZ - 5, 2, 0, CZ - 4, LEAVES);

// ============ arms + clasped hands holding the silver ball ============
cube(-6, 5, CZ - 1, -4, 6, CZ + 1, PLANKS);
sphere(-6, 5, CZ, 1, LEAVES);
cube(4, 5, CZ - 1, 6, 6, CZ + 1, PLANKS);
sphere(6, 5, CZ, 1, LEAVES);
sphere(0, 6, CZ - 5, 1, LEAVES); // clasped hands
sphere(0, 7, CZ - 6, 1, STONE);  // little silver orb toy

// ============ head ============
const headY = 14, headR = 5;
sphere(CX, headY, CZ, headR, LEAVES);

// eyes (big, dark, front-facing toward -Z)
sphere(-2, 13, CZ - 6, 1, STONE);
sphere(2, 13, CZ - 6, 1, STONE);
block(-2, 13, CZ - 7, COBBLE);
block(2, 13, CZ - 7, COBBLE);

// nose bump + mouth
sphere(0, 12, CZ - 7, 1, LEAVES);
line(-1, 10, CZ - 7, 1, 10, CZ - 7, STONE);

// a few wispy white hairs on top of head
block(0, 20, CZ, SNOW);
block(-1, 19, CZ - 1, SNOW);
block(1, 19, CZ + 1, SNOW);

// ============ big pointed ears ============
buildEar(1);
buildEar(-1);

// ============ small frog friend on the ground ============
sphere(-5, 0, CZ - 7, 1, LEAVES);
block(-6, 1, CZ - 7, SNOW);
block(-4, 1, CZ - 7, SNOW);
block(-6, 1, CZ - 7, STONE);
block(-4, 1, CZ - 7, STONE);

// ============ floating hover-pram (background detail) ============
const PX = 13, PY = 3, PZ = 1;
lowerHemisphere(PX, PY, PZ, 3, STONE);
upperShell(PX, PY, PZ, 3, GLASS);
hollowCylinder(PX, PY, PZ, 3, 1, OAK_LOG);
line(PX - 1, PY - 4, PZ, PX - 1, PY - 1, PZ, STONE);
line(PX + 1, PY - 4, PZ, PX + 1, PY - 1, PZ, STONE);
disk(PX, PY - 4, PZ, 1, STONE);
```
