// alien-cow-4x-opus — prompt:
// a UFO abducting a cow...

const meta = null; // (ignored)
// ---- "A UFO abducting a cow" ----------------------------------------
// Filmed from the NORTH (-Z is front/best-lit). Cow faces north.

const SAUCER_X = 0, SAUCER_Y = 24, SAUCER_Z = 4;   // saucer center
const BEAM_X = SAUCER_X, BEAM_Z = SAUCER_Z;         // tractor beam axis

// ---------- helper: circle outline (ring) at a Y level ----------
function ring(cx, cy, cz, r, id) {
  const steps = Math.max(12, Math.floor(r * 8));
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const x = Math.round(cx + Math.cos(a) * r);
    const z = Math.round(cz + Math.sin(a) * r);
    block(x, cy, z, id);
  }
}

// ==================================================================
// 1. THE FLYING SAUCER  (stacked disks -> lens shape + glass dome)
// ==================================================================
// underside (cone tapering down to the beam emitter)
disk(SAUCER_X, SAUCER_Y - 3, SAUCER_Z, 2, ICE);     // glowing emitter
disk(SAUCER_X, SAUCER_Y - 2, SAUCER_Z, 5, STONE);
disk(SAUCER_X, SAUCER_Y - 1, SAUCER_Z, 8, STONE);
// widest rim
disk(SAUCER_X, SAUCER_Y,     SAUCER_Z, 10, COBBLE);
// topside tapering up
disk(SAUCER_X, SAUCER_Y + 1, SAUCER_Z, 8, COBBLE);
disk(SAUCER_X, SAUCER_Y + 2, SAUCER_Z, 5, COBBLE);

// rim running-lights (alternating red / cyan) around widest edge
{
  const steps = 40;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const x = Math.round(SAUCER_X + Math.cos(a) * 10.4);
    const z = Math.round(SAUCER_Z + Math.sin(a) * 10.4);
    block(x, SAUCER_Y, z, i % 2 === 0 ? BRICK : ICE);
  }
}

// porthole windows ringing the topside
ring(SAUCER_X, SAUCER_Y + 1, SAUCER_Z, 8, GLASS);

// glass cockpit dome
hollowSphere(SAUCER_X, SAUCER_Y + 2, SAUCER_Z, 4, GLASS);
hollowSphere(SAUCER_X, SAUCER_Y + 2, SAUCER_Z, 3, GLASS);
// a little pilot silhouette inside the dome
block(SAUCER_X, SAUCER_Y + 3, SAUCER_Z, STONE);
block(SAUCER_X, SAUCER_Y + 4, SAUCER_Z, LEAVES);   // green alien head
block(SAUCER_X - 1, SAUCER_Y + 4, SAUCER_Z, LEAVES);
block(SAUCER_X + 1, SAUCER_Y + 4, SAUCER_Z, LEAVES);

// antenna beacon on very top
block(SAUCER_X, SAUCER_Y + 6, SAUCER_Z, OAK_LOG);
block(SAUCER_X, SAUCER_Y + 7, SAUCER_Z, BRICK);

// ==================================================================
// 2. TRACTOR BEAM  (cone of ICE rings, hollow so the cow shows)
// ==================================================================
{
  const yTop = SAUCER_Y - 4;   // just under the emitter
  const yBot = 0;              // ground
  const rTop = 2, rBot = 8;
  for (let y = yBot; y <= yTop; y++) {
    const t = (y - yBot) / (yTop - yBot);      // 0 at ground, 1 at ship
    const r = rBot + (rTop - rBot) * t;
    // outer glowing shell
    ring(BEAM_X, y, BEAM_Z, r, ICE);
    // faint inner swirl every few layers for volume
    if (y % 3 === 0) ring(BEAM_X, y, BEAM_Z, Math.max(1, r - 2), GLASS);
  }
  // bright pool of light where the beam hits the ground
  disk(BEAM_X, 0, BEAM_Z, 8, ICE);
  disk(BEAM_X, 0, BEAM_Z, 5, GLASS);
}

// ==================================================================
// 3. THE COW  (floating, tilted, being sucked up) — faces NORTH -Z
// ==================================================================
const CX = 0, CY = 9, CZ = 5;   // cow center, mid-beam

// body (white with dirt spots)
cube(CX - 2, CY, CZ - 2, CX + 1, CY + 2, CZ + 3, SNOW);
// dark cow spots
block(CX - 1, CY + 2, CZ - 1, DIRT);
block(CX, CY + 2, CZ + 1, DIRT);
block(CX + 1, CY + 1, CZ + 2, DIRT);
block(CX - 2, CY + 1, CZ + 2, DIRT);
block(CX, CY, CZ, DIRT);

// head at the north (front) end, tipped forward
cube(CX - 1, CY - 1, CZ - 4, CX + 1, CY + 1, CZ - 3, SNOW);
// snout
block(CX, CY - 1, CZ - 4, DIRT);
block(CX - 1, CY - 1, CZ - 4, DIRT);
// eyes (facing north)
block(CX - 1, CY + 1, CZ - 4, STONE);
block(CX + 1, CY + 1, CZ - 4, STONE);
// horns
block(CX - 1, CY + 2, CZ - 3, SNOW);
block(CX + 1, CY + 2, CZ - 3, SNOW);
// ears
block(CX - 2, CY, CZ - 3, SNOW);
block(CX + 2, CY, CZ - 3, SNOW);

// four legs dangling/flailing downward (brown)
line(CX - 2, CY - 1, CZ - 1, CX - 3, CY - 3, CZ - 1, OAK_LOG);
line(CX + 1, CY - 1, CZ - 1, CX + 2, CY - 3, CZ - 2, OAK_LOG);
line(CX - 2, CY - 1, CZ + 2, CX - 2, CY - 4, CZ + 3, OAK_LOG);
line(CX + 1, CY - 1, CZ + 2, CX + 3, CY - 3, CZ + 2, OAK_LOG);

// swishing tail off the south end
line(CX, CY + 1, CZ + 3, CX, CY + 3, CZ + 5, OAK_LOG);
block(CX, CY + 3, CZ + 5, LEAVES);

// ==================================================================
// 4. THE FARM below  (foreground/background: barn, fence, trees)
// ==================================================================

// --- little dust cloud / disturbed dirt where the cow was lifted ---
disk(BEAM_X, 1, BEAM_Z, 4, DIRT);
block(BEAM_X - 3, 1, BEAM_Z + 1, DIRT);
block(BEAM_X + 3, 1, BEAM_Z - 1, DIRT);

// --- rustic fence (front of scene, west + east of the beam) ---
function fencePost(x, z) {
  block(x, 1, z, OAK_LOG);
  block(x, 2, z, OAK_LOG);
}
for (let x = -18; x <= -10; x += 2) fencePost(x, -6);
for (let x = 10; x <= 18; x += 2) fencePost(x, -6);
// top rails
line(-18, 2, -6, -10, 2, -6, PLANKS);
line(10, 2, -6, 18, 2, -6, PLANKS);
line(-18, 1, -6, -10, 1, -6, PLANKS);
line(10, 1, -6, 18, 1, -6, PLANKS);

// --- red barn in the background (south-west), roof toward camera ---
(function barn() {
  const bx = -15, bz = 14, by = 1;
  // walls
  hollowCube(bx, by, bz, bx + 7, by + 5, bz + 6, BRICK);
  // fill a solid gable front (north face)
  cube(bx, by, bz, bx + 7, by + 5, bz, BRICK);
  // big barn door
  cube(bx + 2, by, bz, bx + 5, by + 3, bz, OAK_LOG);
  cube(bx + 3, by, bz, bx + 4, by + 2, bz, PLANKS);
  // pitched plank roof
  for (let i = 0; i <= 4; i++) {
    cube(bx - 1 + i, by + 5 + i, bz - 1, bx - 1 + i, by + 5 + i, bz + 7, PLANKS);
    cube(bx + 8 - i, by + 5 + i, bz - 1, bx + 8 - i, by + 5 + i, bz + 7, PLANKS);
  }
  cube(bx + 3, by + 9, bz - 1, bx + 4, by + 9, bz + 7, PLANKS);
  // hay bales beside the barn
  cube(bx + 9, by, bz + 2, bx + 10, by + 1, bz + 3, SAND);
  cube(bx + 9, by, bz + 4, bx + 10, by + 1, bz + 5, SAND);
})();

// --- a couple of trees framing the field ---
function tree(x, z) {
  cube(x, 1, z, x, 5, z, OAK_LOG);
  sphere(x, 6, z, 3, LEAVES);
  block(x, 7, z, LEAVES);
}
tree(16, 12);
tree(-19, -2);
tree(19, -12);

// --- scattered grass tufts / bushes for ground texture ---
for (const [gx, gz] of [[-8, -12], [7, -14], [-12, 8], [11, 6], [-6, 18], [13, 18]]) {
  block(gx, 1, gz, LEAVES);
  block(gx, 2, gz, LEAVES);
}

// --- second, distant cow still safe in the pasture (background) ---
(function calf() {
  const x = 12, y = 1, z = 16;
  cube(x, y, z, x + 2, y + 1, z + 3, SNOW);
  block(x + 1, y + 1, z + 1, DIRT);
  cube(x, y, z - 1, x + 1, y + 1, z - 1, SNOW); // head
  block(x, y + 1, z - 1, STONE);                // eye
  for (const [lx, lz] of [[x, z], [x + 2, z], [x, z + 3], [x + 2, z + 3]])
    block(lx, y - 1, lz, OAK_LOG); // legs (dig slightly)
})();