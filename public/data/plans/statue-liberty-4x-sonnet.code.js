// statue-liberty-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
That's fine to leave — it's outside the project directory and unused. Here's the build code:

```js
// ===== Statue of Liberty =====
// Front (face) toward -Z (north, toward camera). Slight lean toward +X for light.

// ---- Clear a clean column so the statue rises free of village clutter ----
cylinder(0, -4, -1, 7, 39, AIR);

// ================= PEDESTAL (Fort Wood style, stepped) =================
// Buried foundation
cube(-7, -4, -7, 7, -3, 6, STONE);
// Tier 1 - broad base
cube(-6, -2, -6, 6, -1, 6, STONE);
// corner chamfer accents
block(-6, -1, -6, COBBLE); block(6, -1, -6, COBBLE);
block(-6, -1, 6, COBBLE);  block(6, -1, 6, COBBLE);

// Tier 2 - brick colonnade walls
cube(-5, 0, -5, 5, 3, 5, BRICK);
// pilaster strips (stone accents) on the north (front) face
for (let x = -5; x <= 5; x += 2) line(x, 0, -5, x, 3, -5, STONE);
// entrance archway (north face)
cube(-1, 0, -5, 1, 2, -5, AIR);
cube(-1, 0, -4, 1, 2, -4, AIR);
// windows on the other faces
for (const z of [-3, 0, 3]) { cube(5, 1, z, 5, 2, z, AIR); cube(-5, 1, z, -5, 2, z, AIR); }
for (const x of [-3, 0, 3]) { cube(x, 1, 5, x, 2, 5, AIR); }
// cornice
cube(-5, 4, -5, 5, 4, 5, STONE);
hollowCube(-5, 4, -5, 5, 4, 5, COBBLE);

// Tier 3 - upper terrace with railing
cube(-4, 5, -4, 4, 6, 4, STONE);
hollowCube(-4, 7, -4, 4, 7, 4, COBBLE); // railing
// corner lamp posts on terrace
for (const [lx, lz] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) {
  line(lx, 7, lz, lx, 10, lz, OAK_LOG);
  block(lx, 11, lz, SAND);
  block(lx, 12, lz, BRICK);
}

// Statue plinth
cube(-3, 8, -3, 3, 9, 3, STONE);
hollowCube(-3, 9, -3, 3, 9, 3, COBBLE);

// Entrance stairway on north face
for (let i = 0; i < 5; i++) {
  const w = 4 - Math.floor(i / 2);
  cube(-w, -4 + i, -8 - i, w, -4 + i, -8 - i, STONE);
}

// ================= STATUE BODY =================
const CX = 0, CZ = -1; // statue center, shifted slightly north (toward camera)

// Robe: tapering torso from wide hem to shoulders
const robeBottomY = 10, robeTopY = 23;
const rBottom = 3.4, rTop = 1.7;
for (let y = robeBottomY; y <= robeTopY; y++) {
  const t = (y - robeBottomY) / (robeTopY - robeBottomY);
  const r = rBottom + (rTop - rBottom) * t;
  disk(CX, y, CZ, Math.round(r), LEAVES);
}
// drapery fold lines (subtle vertical shading)
for (let a = 0; a < 8; a++) {
  const ang = a * (Math.PI * 2 / 8);
  const fx = Math.round(CX + Math.cos(ang) * 3);
  const fz = Math.round(CZ + Math.sin(ang) * 3);
  line(fx, robeBottomY, fz, Math.round(CX + Math.cos(ang) * 1.8), robeTopY, Math.round(CZ + Math.sin(ang) * 1.8), COBBLE);
}
// hem flare at the very bottom
disk(CX, robeBottomY - 1, CZ, 4, LEAVES);

// Shoulders
disk(CX, 24, CZ, 3, LEAVES);
disk(CX, 25, CZ, 2, LEAVES);
// Neck
disk(CX, 26, CZ, 1, LEAVES);
// Head
sphere(CX, 28, CZ, 2, LEAVES);
// simple facial definition (facing -Z)
block(CX - 1, 28, CZ - 2, STONE);
block(CX + 1, 28, CZ - 2, STONE);
block(CX, 27, CZ - 2, STONE);

// Crown with 7 spikes radiating up/out from the head
for (let i = 0; i < 7; i++) {
  const ang = i * (Math.PI * 2 / 7);
  const dx = Math.round(Math.cos(ang) * 2.5);
  const dz = Math.round(Math.sin(ang) * 2.0);
  line(CX, 29, CZ, CX + dx, 33, CZ + dz, LEAVES);
  block(CX + dx, 33, CZ + dz, SAND);
}
disk(CX, 29, CZ, 2, LEAVES); // crown band

// ---- helper: draw a limb as a chain of spheres ----
function limb(x1, y1, z1, x2, y2, z2, r, id, steps) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x1 + (x2 - x1) * t);
    const y = Math.round(y1 + (y2 - y1) * t);
    const z = Math.round(z1 + (z2 - z1) * t);
    sphere(x, y, z, r, id);
  }
}

// Right arm raised, holding the torch (+X side)
limb(CX + 2, 24, CZ, CX + 4, 27, CZ - 1, 1, LEAVES, 6);
limb(CX + 4, 27, CZ - 1, CX + 5, 30, CZ - 1, 1, LEAVES, 6);
line(CX + 5, 30, CZ - 1, CX + 5, 32, CZ - 1, LEAVES); // forearm to hand
sphere(CX + 5, 32, CZ - 1, 1, LEAVES); // fist
// Torch
line(CX + 5, 32, CZ - 1, CX + 5, 33, CZ - 1, SAND);
sphere(CX + 5, 33, CZ - 1, 1, SAND); // torch cup
block(CX + 4, 33, CZ - 1, BRICK);
block(CX + 6, 33, CZ - 1, BRICK);
block(CX + 5, 33, CZ - 2, BRICK);
block(CX + 5, 33, CZ, BRICK);

// Left arm, bent, cradling the tablet against the body (-X side)
limb(CX - 2, 23, CZ, CX - 3, 20, CZ + 1, 1, LEAVES, 6);
limb(CX - 3, 20, CZ + 1, CX - 3, 18, CZ + 2, 1, LEAVES, 5);
// Tablet (law book), angled against the body
cube(-5, 15, 1, -2, 20, 2, PLANKS);
hollowCube(-5, 15, 1, -2, 20, 2, STONE);
line(-4, 17, 1, -3, 17, 1, STONE); // inscription line
line(-4, 18, 1, -3, 18, 1, STONE);

// Feet / robe base peeking out at the hem
cube(-2, 9, -3, 2, 9, 0, LEAVES);
block(-1, 9, -3, STONE); block(1, 9, -3, STONE); // sandal toes

// Small plaza flourish at the front approach
disk(0, -4, -10, 3, SAND);
```
