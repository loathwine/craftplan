// terminator-4x-opus — prompt:
// the Terminator...

// The Terminator — T-800 endoskeleton, massive and battle-worn,
// striding out of a wall of flame with a plasma rifle.

const CX = 0;

// ---- small helpers ----
function metalPost(x, z, y0, y1, r) {
  cylinder(x, y0, z, r, y1 - y0 + 1, STONE);
}
function joint(x, y, z, r) {
  sphere(x, y, z, r, COBBLE);
}
// piston / hydraulic rod
function rod(x1, y1, z1, x2, y2, z2) {
  line(x1, y1, z1, x2, y2, z2, COBBLE);
}
// ribcage-style oval ring in the XZ plane at height y
function ring(y, rx, rz, id) {
  for (let a = 0; a < Math.PI * 2; a += 0.12) {
    const x = CX + Math.round(rx * Math.cos(a));
    const z = Math.round(rz * Math.sin(a));
    block(x, y, z, id);
  }
}

// =========================================================
// GROUND — scorched rubble pad + a shallow blast crater
// =========================================================
disk(0, -1, 0, 12, COBBLE);
disk(0, -1, 0, 9, STONE);
// crater lip debris
for (let a = 0; a < Math.PI * 2; a += 0.5) {
  const x = Math.round(11 * Math.cos(a));
  const z = Math.round(11 * Math.sin(a));
  cube(x, 0, z, x, Math.random() > 0.5 ? 1 : 0, z, STONE);
}
// scattered chunks
const rubble = [[-8, 6], [7, -6], [-10, -3], [9, 5], [-5, 9], [6, 8], [-11, 2], [11, -1]];
for (const [x, z] of rubble) {
  cube(x, 0, z, x + 1, (x + z) % 2 ? 2 : 1, z + 1, (x + z) % 3 ? STONE : COBBLE);
}

// =========================================================
// LEGS — heavy hydraulic endoskeleton legs
// =========================================================
function leg(lx) {
  // foot — pointing forward (-Z)
  cube(lx - 2, 0, -4, lx + 2, 1, 1, STONE);
  cube(lx - 1, 0, -6, lx + 1, 0, -4, COBBLE); // toe plate
  // ankle joint
  joint(lx, 2, 0, 1);
  // shin
  metalPost(lx, 0, 2, 8, 2);
  // shin armor plate (front)
  cube(lx - 2, 3, -3, lx + 2, 8, -2, COBBLE);
  // hydraulic pistons flanking shin
  rod(lx - 3, 2, 1, lx - 3, 8, 1);
  rod(lx + 3, 2, 1, lx + 3, 8, 1);
  // knee
  joint(lx, 9, 0, 2);
  // thigh
  metalPost(lx, 0, 10, 15, 2);
  // thigh piston
  rod(lx - 3, 10, 0, lx - 3, 15, 0);
  rod(lx + 3, 10, 0, lx + 3, 15, 0);
}
leg(-4);
leg(4);

// =========================================================
// PELVIS + HIPS
// =========================================================
cube(-6, 15, -3, 6, 18, 3, STONE);
hollowCube(-6, 15, -3, 6, 18, 3, COBBLE);
joint(-4, 16, 0, 2); // left hip
joint(4, 16, 0, 2);  // right hip
// pelvic hydraulics
rod(0, 15, -3, 0, 18, -3);
rod(-2, 16, -3, 2, 16, -3);

// =========================================================
// SPINE + RIBCAGE (torso)
// =========================================================
// mechanical spine
cube(-1, 18, -1, 1, 26, 1, COBBLE);
for (let y = 18; y <= 26; y += 2) ring(y, 2, 1, STONE); // vertebrae discs

// ribcage — tapering oval rings
for (let y = 18; y <= 25; y++) {
  const t = (y - 18) / 7;
  const rx = 6 - Math.round(t * 2);   // 6 -> 4
  const rz = 4 - Math.round(t * 1.5); // 4 -> 2 (narrower depth)
  ring(y, rx, rz, y % 2 ? COBBLE : STONE);
}
// sternum plate down the front
cube(-1, 18, -4, 1, 25, -4, COBBLE);
cube(-2, 20, -4, 2, 22, -4, STONE); // chest emblem plate
// exposed back plating
cube(-4, 19, 4, 4, 25, 4, STONE);

// =========================================================
// SHOULDERS + NECK
// =========================================================
cube(-9, 25, -2, 9, 27, 2, STONE);      // clavicle bar
joint(-8, 26, 0, 2);                    // left shoulder
joint(8, 26, 0, 2);                     // right shoulder
// pauldron plating
hollowSphere(-8, 27, 0, 3, COBBLE);
hollowSphere(8, 27, 0, 3, COBBLE);
// neck
cube(-1, 27, -1, 1, 29, 1, COBBLE);
cube(-2, 27, -2, 2, 28, 2, STONE);      // neck servo housing

// =========================================================
// ARMS — segmented, one gripping a plasma rifle
// =========================================================
function arm(sx, gun) {
  // upper arm hanging from shoulder
  metalPost(sx, 0, 18, 25, 1);
  cube(sx - 2, 20, -1, sx + 2, 24, 1, COBBLE); // bicep plate
  rod(sx + (sx < 0 ? -2 : 2), 18, 1, sx + (sx < 0 ? -2 : 2), 25, 1);
  // elbow
  joint(sx, 17, 0, 1);
  // forearm
  metalPost(sx, 0, 10, 16, 1);
  cube(sx - 1, 12, -2, sx + 1, 15, -2, COBBLE);
  // wrist + hand
  joint(sx, 9, 0, 1);
  cube(sx - 2, 7, -2, sx + 2, 9, 2, STONE);
  // finger claws
  for (let f = -2; f <= 2; f++) {
    line(sx + f, 7, -2, sx + f, 4, -3, COBBLE);
  }
  if (gun) {
    // plasma rifle barrel projecting forward
    cube(sx - 2, 7, -12, sx + 1, 9, -3, STONE);
    cube(sx - 1, 8, -16, sx, 8, -12, COBBLE); // long barrel
    block(sx - 1, 8, -17, BRICK);              // glowing muzzle
    block(sx, 8, -17, BRICK);
    cube(sx - 2, 5, -6, sx + 1, 6, -4, COBBLE); // magazine/grip
  }
}
arm(-8, false);
arm(8, true);

// =========================================================
// SKULL — chrome death's-head with glowing red eyes
// =========================================================
const HY = 31; // head center height
sphere(CX, HY, 0, 3, STONE);
hollowSphere(CX, HY, 0, 3, COBBLE); // cranial plating seams
// cranial ridge
cube(CX, HY + 3, -1, CX, HY + 3, 1, COBBLE);
// brow ridge
cube(-3, HY + 1, -3, 3, HY + 1, -3, COBBLE);

// eye sockets — carve, then set glowing red
for (const ex of [-1.5, 1.5]) {
  const x = Math.round(ex);
  cube(x, HY, -3, x, HY, -1, AIR);      // socket cavity
  block(x, HY, -3, BRICK);              // glowing eye
  block(x, HY, -4, BRICK);              // eye glow protrudes
}
// nasal cavity
block(CX, HY - 1, -3, AIR);

// mouth — carve slit, add clenched teeth
cube(-2, HY - 2, -3, 2, HY - 2, -3, AIR);
for (let tx = -2; tx <= 2; tx++) {
  block(tx, HY - 2, -3, tx % 2 === 0 ? SNOW : AIR); // gritted teeth
}
// cheekbones / jaw servos
cube(-3, HY - 1, -2, -3, HY - 1, 0, COBBLE);
cube(3, HY - 1, -2, 3, HY - 1, 0, COBBLE);
cube(-2, HY - 3, -2, 2, HY - 3, 2, STONE); // jaw

// =========================================================
// WALL OF FIRE — apocalyptic backdrop (behind, +Z)
// =========================================================
function flame(x, z, h) {
  for (let y = 0; y < h; y++) {
    const w = Math.max(0, Math.round((1 - y / h) * 2)); // taper up
    cube(x - w, y, z, x + w, y, z, BRICK);
  }
  // flickering tips
  block(x, h, z, BRICK);
  if (h > 6) block(x + 1, h - 2, z, BRICK);
}
const fireRow = [-18, -14, -10, -6, 6, 10, 14, 18];
for (let i = 0; i < fireRow.length; i++) {
  const x = fireRow[i];
  const h = 8 + Math.round(5 * Math.abs(Math.sin(x * 0.7)));
  flame(x, 13, h);
  flame(x + 2, 16, Math.max(4, h - 4)); // second staggered row
}
// low fire licking around the feet
for (let x = -10; x <= 10; x += 2) {
  const h = 2 + (Math.abs(x) % 4 === 0 ? 2 : 0);
  cube(x, 0, 9, x, h, 9, BRICK);
}