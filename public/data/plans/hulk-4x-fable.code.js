// hulk-4x-fable — prompt:
// the Incredible Hulk...

const P = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  P.set(x + ',' + y + ',' + z, { x, y, z, id });
}
function box(a, b, c, d, e, f, id) {
  for (let x = Math.min(a, d); x <= Math.max(a, d); x++)
    for (let y = Math.min(b, e); y <= Math.max(b, e); y++)
      for (let z = Math.min(c, f); z <= Math.max(c, f); z++) put(x, y, z, id);
}
function ell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.02) put(x, y, z, id);
      }
}
function ball(cx, cy, cz, r, id) { ell(cx, cy, cz, r, r, r, id); }
function limb(x1, y1, z1, x2, y2, z2, r1, r2, id) {
  const n = Math.max(2, Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) * 1.6));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    ball(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, r1 + (r2 - r1) * t, id);
  }
}
function h2(x, z) { return (((x * 73856093) ^ (z * 19349663)) >>> 0) % 1000; }

// ---- clear trees that intersect the body / smash crater ----
const TREES = [[1,-7],[4,-3],[7,-2],[8,-1],[0,1],[-2,7],[-7,4],[12,11],[-6,-1],[-6,1],[-7,8],[-6,9],[-10,8]];
for (const [tx, tz] of TREES) {
  box(tx - 3, 1, tz - 3, tx + 3, 7, tz + 3, AIR);   // canopy
  box(tx, -1, tz, tx, 3, tz, AIR);                  // trunk
}

// ---- HULK: mid ground-smash. Right fist buried in a crater (east/front),
// ---- left fist raised to the sky. Faces +Z.

// legs — wide power stance
limb(-4.5, 11, 0,  -7, 5, 2.5,  3.0, 2.5, LEAVES);   // left thigh (planted forward)
limb(-7, 5, 2.5,  -7.5, 1, 3.5, 2.4, 1.9, LEAVES);   // left calf
ball(-7.2, 4, 3, 2.2, LEAVES);                       // calf muscle
box(-9, -1, 1, -6, 1, 6, LEAVES);                    // left foot
limb(4.5, 11, -0.5,  7, 6, -4,  3.0, 2.5, LEAVES);   // right thigh (lunging back)
limb(7, 6, -4,  8, 1, -6,  2.4, 1.9, LEAVES);        // right calf
ball(7.5, 4, -5, 2.1, LEAVES);
box(6, -1, -9, 9, 1, -4, LEAVES);                    // right foot

// torso — massive taper, leaning into the punch
ell(0, 10.5, 0, 4.8, 2.6, 3.0, LEAVES);              // pelvis
ell(0, 12.5, 0, 4.5, 3.5, 3.0, LEAVES);              // waist / abs
ell(0, 15.5, 0.5, 5.5, 3.5, 3.2, LEAVES);            // mid torso
ell(0, 19, 1, 6.5, 3.5, 3.5, LEAVES);                // chest
ell(0, 17.5, -1.5, 6.0, 3.0, 2.5, LEAVES);           // back / lats
ell(0, 22.5, 0.5, 4.8, 2.0, 2.8, LEAVES);            // traps
ell(-3.2, 19.5, 3, 2.8, 2.2, 2.0, LEAVES);           // left pec
ell(3.2, 19.5, 3, 2.8, 2.2, 2.0, LEAVES);            // right pec
ball(-7.5, 21.5, 1, 3.1, LEAVES);                    // left deltoid
ball(7.5, 21.5, 1, 3.1, LEAVES);                     // right deltoid

// right arm — driving down into the ground
limb(7.5, 21, 1.5,  9.5, 12, 4,  2.7, 2.4, LEAVES);  // upper arm
limb(9.5, 12, 4,  11, 4.5, 7,  2.4, 2.2, LEAVES);    // forearm
ball(10.5, 8, 5.5, 2.6, LEAVES);                     // forearm bulge
ball(11.5, 2, 8, 3.0, LEAVES);                       // fist in crater

// left arm — raised roar fist
limb(-8.5, 21, 0.5,  -11, 25.5, -1,  2.7, 2.5, LEAVES);
ball(-10.5, 23.5, -0.5, 2.8, LEAVES);                // bicep
limb(-11, 25.5, -1,  -10.2, 29, 0,  2.4, 2.1, LEAVES);
ball(-10, 30.5, 0.2, 2.5, LEAVES);                   // sky fist (tops out at y33)

// head — small on the huge frame, snarling toward the smash
ell(0, 25.5, 2.5, 2.6, 2.8, 2.4, LEAVES);
ell(0, 23.2, 3.2, 2.3, 1.5, 2.3, LEAVES);            // heavy jaw
ell(0, 27.6, 1.5, 2.9, 1.5, 2.5, OAK_LOG);           // dark shaggy hair cap

// ---- recolor passes (free: overrides existing blocks) ----
// torn purple(blue) pants, jagged hem above the knees
for (const b of Array.from(P.values())) {
  if (b.id !== LEAVES || b.y > 12) continue;
  if (b.x >= 8 && b.z >= 4) continue;                // keep the smashing fist green
  const hem = 5 + h2(b.x, b.z) % 4;                  // ragged hem y5..8
  if (b.y >= hem && Math.abs(b.x) <= 9 && b.z >= -7 && b.z <= 7) put(b.x, b.y, b.z, GLASS);
}
// muscle shadow lines (darker green) + hair down the back of the head
for (const b of Array.from(P.values())) {
  if (b.id !== LEAVES) continue;
  const ax = Math.abs(b.x);
  if (b.x === 0 && b.z >= 2 && b.y >= 13 && b.y <= 21) put(b.x, b.y, b.z, GRASS);  // sternum + ab split
  else if (b.y === 16 && ax <= 5 && b.z >= 2) put(b.x, b.y, b.z, GRASS);           // under-pec crease
  else if (b.y === 14 && ax <= 3 && b.z >= 2) put(b.x, b.y, b.z, GRASS);           // ab row
  else if (b.x === 0 && b.z <= -1 && b.y >= 13 && b.y <= 21) put(b.x, b.y, b.z, GRASS); // spine groove
  else if (b.y >= 25 && b.y <= 28 && b.z <= 1 && ax <= 3) put(b.x, b.y, b.z, OAK_LOG);  // hair, back of head
}

// face — heavy brow, white eyes, roaring mouth
box(-2, 27, 4, 2, 27, 5, OAK_LOG);                   // jutting angry brow
put(0, 26, 5, OAK_LOG);                              // scowl bridge
put(-1, 26, 4, SNOW); put(1, 26, 4, SNOW);           // eyes shadowed under brow
put(0, 25, 5, LEAVES);                               // nose
box(-1, 24, 4, 1, 24, 4, SNOW);                      // bared upper teeth
box(-1, 23, 3, 1, 23, 3, OAK_LOG);                   // dark mouth interior
box(-1, 23, 4, 1, 23, 5, AIR);                       // open roar

// ---- impact crater under the right fist ----
const FX = 11, FZ = 8;
for (let x = FX - 6; x <= FX + 6; x++) for (let z = FZ - 6; z <= FZ + 6; z++) {
  const d = Math.hypot(x - FX, z - FZ);
  if (d <= 4.2) {                                    // dug-out pit (2-3 deep)
    put(x, -1, z, AIR); put(x, -2, z, AIR);
    if (d <= 2.8) put(x, -3, z, AIR);
    if (d <= 1.6) put(x, -4, z, AIR);
  } else if (d <= 5.7) {                             // upheaved rim
    const h = h2(x, z) % 3;
    for (let y = -1; y <= h - 1; y++) put(x, y, z, (x + z) % 2 ? COBBLE : DIRT);
    if (h === 2 && (x + z) % 3 === 0) put(x, 2, z, STONE);
  }
}
// radiating cracks
for (let i = 0; i < 8; i++) {
  const a = i * Math.PI / 4 + 0.35 * ((i % 3) - 1);
  const len = 5 + (i * 5) % 4;
  for (let r = 4.5; r <= 4.5 + len; r += 0.6) {
    const x = FX + Math.cos(a) * r, z = FZ + Math.sin(a) * r;
    put(x, -1, z, AIR); put(x, -2, z, AIR);
    if (h2(Math.round(x), Math.round(z)) % 3 === 0) put(x, -3, z, AIR);
  }
}
// thrown rubble + suspended debris (frozen mid-explosion)
ball(17, -1, 12, 1.6, STONE);
ball(6, -1, 13, 1.3, COBBLE);
ball(15, 0, 3, 1.2, STONE);
const DEBRIS = [[14,2,11,STONE],[8,3,12,DIRT],[13,4,5,STONE],[9,5,11,COBBLE],[15,3,7,DIRT],[12,6,10,STONE],[7,2,10,DIRT],[14,4,13,GRASS],[10,3,14,DIRT],[16,2,9,COBBLE]];
for (const [x, y, z, id] of DEBRIS) put(x, y, z, id);
// a knocked-over tree by the crater
box(15, -1, 4, 19, -1, 5, OAK_LOG);
ball(20, 0, 5, 1.6, LEAVES);

// ---- emit ----
for (const b of P.values()) block(b.x, b.y, b.z, b.id);