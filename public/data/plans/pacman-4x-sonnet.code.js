// pacman-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===== Pac-Man chased by a Ghost =====
// Layout: corridor runs along Z. Pac-Man (fleeing, mouth open) sits north
// (closer to camera, more negative Z). The Ghost (chasing) sits south
// (further from camera, more positive Z), on the same X line, so the
// chase reads clearly when filmed from the north looking south.

// ---- 0. Clear a footprint above ground so trees don't poke through ----
cube(-15, 1, -19, 15, 16, 15, AIR);

// ---- 1. Ground dressing: corridor + maze walls + dots ----
const CORR_X1 = -4, CORR_X2 = 4;
const CORR_Z1 = -18, CORR_Z2 = 13;

// stone walkway
cube(CORR_X1, 0, CORR_Z1, CORR_X2, 0, CORR_Z2, STONE);

// cobble maze walls flanking the corridor, with gaps for a "maze" feel
function buildSideWalls(xInner, xOuter) {
  const zSegs = [[-18, -15], [-13, -9], [-7, -3], [1, 5], [7, 13]];
  for (const [z1, z2] of zSegs) {
    cube(xInner, 0, z1, xOuter, 2, z2, COBBLE);
  }
}
buildSideWalls(-7, -5);
buildSideWalls(5, 7);

// outer background wall pillars for depth
const outerZ = [[-18, -15], [-9, -6], [0, 3], [8, 13]];
for (const [z1, z2] of outerZ) {
  cube(-11, 0, z1, -10, 3, z2, COBBLE);
  cube(10, 0, z1, 11, 3, z2, COBBLE);
}
// pillar caps (brick accents, landmark corners)
for (const z of [-18, -15, -9, -6, 0, 3, 8, 13]) {
  block(-11, 4, z, BRICK);
  block(-10, 4, z, BRICK);
  block(10, 4, z, BRICK);
  block(11, 4, z, BRICK);
}

// power pellets (big glowing dots) near the ghost's end of the corridor
disk(0, 1, 10, 1, SNOW);
disk(0, 1, -15, 1, SNOW);

// trail of eaten/uneaten dots along the corridor: sparse near Pac-Man
// (he already ate them), dense further back near the Ghost
for (let z = CORR_Z1 + 2; z <= CORR_Z2 - 2; z += 2) {
  const nearPac = Math.abs(z - (-8)) < 5; // gap right around Pac-Man
  if (nearPac) continue;
  block(0, 1, z, SNOW);
}

// ---- 2. PAC-MAN ----
const PAC_X = 0, PAC_Y = 5, PAC_Z = -9, PAC_R = 5;

sphere(PAC_X, PAC_Y, PAC_Z, PAC_R, SAND);

// carve the classic wedge mouth: opens toward +X (screen-right), full
// depth on the camera-facing (north) hemisphere so it reads as an open
// mouth cavity when viewed from the north.
for (let x = PAC_X - PAC_R; x <= PAC_X + PAC_R; x++) {
  for (let y = PAC_Y - PAC_R; y <= PAC_Y + PAC_R; y++) {
    for (let z = PAC_Z - PAC_R; z <= PAC_Z; z++) {
      const dx = x - PAC_X, dy = y - PAC_Y, dz = z - PAC_Z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > PAC_R) continue;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (angle > -32 && angle < 32) {
        block(x, y, z, AIR);
      }
    }
  }
}
// dark back wall of the mouth cavity (at the sphere's equator plane)
for (let x = PAC_X - PAC_R; x <= PAC_X + PAC_R; x++) {
  for (let y = PAC_Y - PAC_R; y <= PAC_Y + PAC_R; y++) {
    const dx = x - PAC_X, dy = y - PAC_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > PAC_R) continue;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle > -32 && angle < 32) {
      block(x, y, PAC_Z, STONE);
    }
  }
}

// eye: white sclera + dark pupil, upper-left of face
sphere(PAC_X - 2, PAC_Y + 3, PAC_Z - 3, 1, SNOW);
block(PAC_X - 2, PAC_Y + 3, PAC_Z - 4, STONE);
block(PAC_X - 1, PAC_Y + 3, PAC_Z - 4, STONE);

// little "poof" dust puffs behind Pac-Man (south side, since he's fleeing
// north) to sell the running motion
sphere(PAC_X - 3, 2, PAC_Z + 4, 1, SNOW);
sphere(PAC_X + 3, 1, PAC_Z + 5, 1, SNOW);
sphere(PAC_X, 1, PAC_Z + 6, 1, SNOW);

// ---- 3. GHOST ----
const GH_X = 0, GH_Z = 6;
const GH_X1 = GH_X - 4, GH_X2 = GH_X + 4;
const GH_Z1 = GH_Z - 3, GH_Z2 = GH_Z + 3;
const GH_TOP = 8;

// rounded dome + rectangular body (capsule silhouette)
cube(GH_X1, 0, GH_Z1, GH_X2, GH_TOP, GH_Z2, BRICK);
sphere(GH_X, GH_TOP, GH_Z, 4.5, BRICK);

// scalloped wavy skirt at the bottom: carve notches between "legs"
for (let x = GH_X1; x <= GH_X2; x++) {
  const rel = x - GH_X1; // 0..8
  if (rel % 2 === 1) {
    cube(x, 0, GH_Z1, x, 1, GH_Z2, AIR);
  }
}

// big cartoon eyes on the north (camera-facing) side, looking down-forward
// toward Pac-Man
sphere(GH_X - 2, GH_TOP - 1, GH_Z1, 1.4, SNOW);
sphere(GH_X + 2, GH_TOP - 1, GH_Z1, 1.4, SNOW);
block(GH_X - 2, GH_TOP - 2, GH_Z1 - 1, STONE);
block(GH_X - 2, GH_TOP - 2, GH_Z1, STONE);
block(GH_X + 2, GH_TOP - 2, GH_Z1 - 1, STONE);
block(GH_X + 2, GH_TOP - 2, GH_Z1, STONE);

// small frown/mouth squiggle for menace
line(GH_X - 2, GH_TOP - 4, GH_Z1 - 1, GH_X - 1, GH_TOP - 5, GH_Z1 - 1, STONE);
line(GH_X - 1, GH_TOP - 5, GH_Z1 - 1, GH_X + 1, GH_TOP - 4, GH_Z1 - 1, STONE);
line(GH_X + 1, GH_TOP - 4, GH_Z1 - 1, GH_X + 2, GH_TOP - 5, GH_Z1 - 1, STONE);

// speed/zoom lines trailing behind the ghost (south side) to show it's
// mid-chase
for (let i = 0; i < 5; i++) {
  const zz = GH_Z2 + 2 + i * 2;
  line(GH_X - 5 + i, 3, zz, GH_X - 6 + i, 3, zz + 2, COBBLE);
  line(GH_X + 5 - i, 5, zz, GH_X + 6 - i, 5, zz + 2, COBBLE);
}
```
