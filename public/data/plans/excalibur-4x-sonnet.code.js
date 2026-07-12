// excalibur-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===================================================================
// EXCALIBUR IN THE STONE
// Ancient plinth -> shattered boulder -> blade -> ornate hilt -> pommel
// Front (viewer-facing) side is -Z (north). Sword axis: X=0, Z=4.
// ===================================================================

const CX = 0, CZ = 4;

// -------------------------------------------------------------
// 1. ANCIENT STONE PLINTH (stepped dais the boulder rests on)
// -------------------------------------------------------------
disk(CX, -5, CZ, 9, COBBLE);
disk(CX, -4, CZ, 8, STONE);
disk(CX, -3, CZ, 6, COBBLE);
disk(CX, -2, CZ, 5, STONE);

// crumbled rim notches on the plinth steps
const rimNotch = [
  [-8, -5, 2], [7, -5, -2], [-6, -4, 9], [6, -4, 10],
  [-5, -3, -3], [5, -3, 11], [0, -5, 12], [-2, -4, -4]
];
for (const [nx, ny, nz] of rimNotch) sphere(CX + nx, ny, CZ + nz, 2, AIR);

// scattered rubble stones around the plinth
const rubble = [
  [-9, -2, -1], [9, -2, 1], [-8, -2, 8], [8, -2, 9],
  [-6, -2, -4], [6, -2, 12], [-10, -2, 5], [10, -2, 4],
  [0, -2, -6], [-3, -2, 12]
];
for (const [rx, ry, rz] of rubble) sphere(CX + rx, ry, CZ + rz, 1, COBBLE);

// tufts of moss/weeds around the base
const weeds = [
  [-7, -1, 1], [7, -1, 2], [-5, -1, 10], [5, -1, 11], [0, -1, -5],
  [-9, -1, 6], [9, -1, 7], [3, -1, 12], [-3, -1, -3]
];
for (const [wx, wy, wz] of weeds) block(CX + wx, wy, CZ + wz, LEAVES);

// -------------------------------------------------------------
// 2. THE SHATTERED BOULDER (Excalibur's anvil)
// -------------------------------------------------------------
sphere(CX, -2, CZ, 6, STONE);
// flatten the crown so the blade has a level surface to pierce
cube(CX - 8, 3, CZ - 8, CX + 8, 10, CZ + 8, AIR);

// jagged silhouette notches so it doesn't read as a perfect sphere
const boulderNotch = [
  [-6, -1, 3], [6, -1, 3], [0, -1, -2], [0, 0, 10],
  [-5, 0, -1], [5, 0, 9], [-4, 1, -2], [4, 1, 9]
];
for (const [bx, by, bz] of boulderNotch) sphere(CX + bx, by, CZ + bz, 2, AIR);

// irregular stone/cobble protrusions for surface texture
const protrusions = [
  [-4, 1, 0, 2], [4, 0, 1, 2], [-5, -1, 7, 2], [5, -1, 8, 2],
  [-2, 2, -2, 1], [2, 2, -2, 1], [0, -1, 9, 2]
];
for (const [px, py, pz, pr] of protrusions) sphere(CX + px, py, CZ + pz, pr, COBBLE);

// moss patches on the north (camera-facing) hemisphere
const moss = [
  [-3, 1, -1], [3, 1, -1], [-4, 0, 0], [4, 0, 0], [-2, 2, -2],
  [2, 2, -2], [-5, 0, 2], [5, 0, 2], [0, 2, -1], [-3, -1, -1],
  [3, -1, -1], [-1, 2, 0], [1, 2, 0]
];
for (const [mx, my, mz] of moss) block(CX + mx, my, CZ + mz, LEAVES);

// deep cracks radiating across the flattened crown (impact fractures)
const cracks = [
  [-6, 1], [6, -1], [-5, 6], [5, 7], [0, -3], [0, 10], [-4, -2], [4, 9]
];
for (const [cx2, cz2] of cracks) line(CX, 2, CZ, CX + cx2, 2, CZ + cz2, AIR);

// the fissure the blade actually stands in
cube(CX - 2, 1, CZ - 1, CX + 2, 2, CZ + 5, AIR);

// -------------------------------------------------------------
// 3. THE BLADE (rises straight from the fissure)
// -------------------------------------------------------------
const BLADE_BASE = 2, BLADE_TOP = 14;
cube(CX - 1, BLADE_BASE, CZ, CX + 1, BLADE_TOP, CZ + 1, STONE);
// distal taper just before the guard
cube(CX - 1, BLADE_TOP - 1, CZ, CX + 1, BLADE_TOP - 1, CZ, STONE);

// gilded edge trim on both sides of the blade
line(CX - 1, BLADE_BASE, CZ, CX - 1, BLADE_TOP, CZ, COBBLE);
line(CX + 1, BLADE_BASE, CZ, CX + 1, BLADE_TOP, CZ, COBBLE);

// fuller (central groove) on the front face, catching the light
line(CX, BLADE_BASE + 1, CZ, CX, BLADE_TOP - 2, CZ, AIR);

// -------------------------------------------------------------
// 4. ORNATE CROSSGUARD (winged, gilded)
// -------------------------------------------------------------
const GUARD_Y = 15;
cube(CX - 4, GUARD_Y, CZ - 1, CX + 4, GUARD_Y, CZ + 1, SAND);
// upswept wingtips
line(CX + 4, GUARD_Y, CZ, CX + 6, GUARD_Y + 2, CZ - 1, SAND);
line(CX - 4, GUARD_Y, CZ, CX - 6, GUARD_Y + 2, CZ - 1, SAND);
// central gem, facing the viewer
block(CX, GUARD_Y, CZ - 2, GLASS);
block(CX - 2, GUARD_Y, CZ - 2, GLASS);
block(CX + 2, GUARD_Y, CZ - 2, GLASS);

// -------------------------------------------------------------
// 5. GRIP (wrapped leather look, alternating bands)
// -------------------------------------------------------------
for (let y = GUARD_Y + 1; y <= GUARD_Y + 4; y++) {
  const wrap = (y - GUARD_Y) % 2 === 0 ? OAK_LOG : PLANKS;
  cylinder(CX, y, CZ, 1, 1, wrap);
}

// -------------------------------------------------------------
// 6. POMMEL (gilded orb with crowning gem)
// -------------------------------------------------------------
const POMMEL_Y = GUARD_Y + 5;
sphere(CX, POMMEL_Y, CZ, 2, SAND);
block(CX, POMMEL_Y + 2, CZ, GLASS);

// -------------------------------------------------------------
// 7. MAGIC LIGHT MOTES rising off the blade
// -------------------------------------------------------------
const motes = [
  [-2, 6, 2], [2, 8, 3], [-3, 11, 1], [3, 13, 2], [0, 17, 4], [-1, 19, 0]
];
for (const [mx, my, mz] of motes) block(CX + mx, my, CZ + mz, GLASS);

// -------------------------------------------------------------
// 8. FLANKING RUINS (broken pillars, background depth)
// -------------------------------------------------------------
// tall standing pillar, left-back
cube(CX - 10, -2, CZ + 9, CX - 8, 6, CZ + 11, STONE);
line(CX - 10, -2, CZ + 9, CX - 10, 6, CZ + 9, COBBLE);
line(CX - 8, -2, CZ + 11, CX - 8, 6, CZ + 11, COBBLE);
for (let y = 0; y <= 5; y += 2) block(CX - 10, y, CZ + 10, LEAVES);

// broken stump pillar, right-back, with fallen cap block
cube(CX + 8, -2, CZ + 9, CX + 10, 2, CZ + 11, STONE);
block(CX + 11, -1, CZ + 12, STONE);
block(CX + 12, -1, CZ + 13, COBBLE);
for (let y = -1; y <= 1; y++) block(CX + 8, y, CZ + 10, LEAVES);

// -------------------------------------------------------------
// 9. GROUND FLOWERS around the plinth for warmth/scale
// -------------------------------------------------------------
const flowers = [
  [-7, -1, -2], [7, -1, -3], [-8, -1, 12], [8, -1, 13], [0, -1, 13]
];
for (const [fx, fy, fz] of flowers) block(CX + fx, fy, CZ + fz, LEAVES);
```
