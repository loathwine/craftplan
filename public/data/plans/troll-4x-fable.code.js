// troll-4x-fable — prompt:
// a troll under a bridge...

// A TROLL UNDER A BRIDGE
// Stone arch bridge spans a river (river flows N-S along Z, bridge runs E-W along X).
// A huge mossy-green troll crouches in the water on the south side, one hand
// gripping the parapet, the other resting on a spiked club. Three billy goats
// gruff are crossing the deck. Bone pile + campfire mark his lair on the bank.

// ---------- SITE CLEARING (targeted, AIR is free) ----------
cube(-22, 1, -7, 22, 16, 7, AIR);      // bridge corridor: trunks + canopy
cube(-4, -3, -22, 4, 9, 22, AIR);      // river channel cut
cube(-7, 1, -22, 7, 12, 22, AIR);      // river banks above ground
cube(-10, 1, 4, 10, 16, 17, AIR);      // troll zone above ground

// ---------- RIVER ----------
cube(-4, -3, -22, 4, -3, 22, SAND);    // riverbed
cube(-4, -2, -22, 4, -2, 22, GLASS);   // water surface
cube(-5, -1, -22, -5, -1, 22, SAND);   // west bank lip
cube(5, -1, -22, 5, -1, 22, SAND);     // east bank lip

// stepping stones north of the bridge
for (const [sx, sz] of [[0, -9], [-2, -12], [1, -15], [-1, -18]]) {
  cube(sx, -2, sz, sx, -1, sz, STONE);
}

// reeds along the banks
for (const [rx, rz] of [[5, -13], [5, 9], [5, 18], [-5, -19], [-5, -9], [-5, 15]]) {
  cube(rx, 0, rz, rx, 1, rz, OAK_LOG);
  block(rx, 2, rz, LEAVES);
}

// ---------- BRIDGE ----------
// abutments flanking the arch
cube(5, -3, -3, 9, 7, 3, COBBLE);
cube(-9, -3, -3, -5, 7, 3, COBBLE);
// stone quoins on outer corners
for (const zq of [-3, 3]) {
  line(9, -1, zq, 9, 7, zq, STONE);
  line(-9, -1, zq, -9, 7, zq, STONE);
}
// arch spandrel (curved opening) + stone voussoir ring on both faces
for (const [ax, y0] of [[4, 3], [3, 5], [2, 6], [1, 7]]) {
  cube(ax, y0, -3, ax, 7, 3, COBBLE);
  cube(-ax, y0, -3, -ax, 7, 3, COBBLE);
  for (const zf of [-3, 3]) {
    block(ax, y0, zf, STONE);
    block(-ax, y0, zf, STONE);
  }
}
// hanging keystones
for (const zf of [-3, 3]) { block(0, 7, zf, STONE); block(0, 6, zf, STONE); }

// deck: cobble edges, plank walkway
cube(-14, 8, -3, 14, 8, -3, COBBLE);
cube(-14, 8, 3, 14, 8, 3, COBBLE);
cube(-14, 8, -2, 14, 8, 2, PLANKS);
// slender support piers under the approaches
cube(12, 0, -2, 12, 7, 2, COBBLE);
cube(-12, 0, -2, -12, 7, 2, COBBLE);
// parapets + crenellations
cube(-14, 9, -3, 14, 9, -3, COBBLE);
cube(-14, 9, 3, 14, 9, 3, COBBLE);
for (let px = -14; px <= 14; px += 2) {
  block(px, 10, -3, COBBLE);
  block(px, 10, 3, COBBLE);
}
// end posts with stone caps
for (const ex of [-14, 14]) for (const ez of [-3, 3]) {
  cube(ex, 9, ez, ex, 11, ez, COBBLE);
  block(ex, 12, ez, STONE);
}
// lantern posts (warm brick lamps)
for (const lx of [-10, 10]) for (const lz of [-3, 3]) {
  cube(lx, 10, lz, lx, 12, lz, OAK_LOG);
  block(lx, 13, lz, BRICK);
}
// stepped stone approach ramps down to grade
for (let i = 1; i <= 7; i++) {
  const y = 8 - i;
  cube(14 + i, y, -3, 14 + i, y, 3, COBBLE);
  block(14 + i, y - 1, -3, COBBLE);
  block(14 + i, y - 1, 3, COBBLE);
  cube(-14 - i, y, -3, -14 - i, y, 3, COBBLE);
  block(-14 - i, y - 1, -3, COBBLE);
  block(-14 - i, y - 1, 3, COBBLE);
}
// vines trailing off the deck faces
for (const vx of [-8, -6, 6, 8]) cube(vx, 5, 4, vx, 7, 4, LEAVES);
for (const vx of [-7, 7]) cube(vx, 5, -4, vx, 6, -4, LEAVES);
// moss patches at the waterline and on the stonework
for (const [mx, my, mz] of [[6, -1, 3], [8, 1, 3], [5, 2, 3], [-6, 0, 3], [-8, -1, 3], [-7, 2, 3], [6, 0, -3], [-7, 1, -3]]) {
  block(mx, my, mz, LEAVES);
}

// ---------- THE TROLL (built after bridge so his grip overrides stone) ----------
const SKIN = LEAVES;
// crouched body in the water, tucked half under the arch
sphere(0, 1, 6, 4, SKIN);        // belly
sphere(0, 5, 6, 3, SKIN);        // chest
sphere(3, 6, 5, 2, SKIN);        // right shoulder
sphere(-3, 6, 5, 2, SKIN);       // left shoulder
sphere(0, 9, 7, 3, SKIN);        // head, looming above the parapet

// face (front is +Z / south)
cube(-2, 7, 9, 2, 8, 10, SKIN);          // heavy jaw
cube(-2, 11, 8, 2, 11, 9, SKIN);         // brow ridge
block(-1, 10, 9, BRICK);                 // glowing red eyes
block(1, 10, 9, BRICK);
cube(0, 9, 10, 0, 10, 10, SKIN);         // hooked nose
block(0, 9, 11, SKIN);
block(0, 8, 11, SKIN);
cube(-1, 7, 10, 1, 7, 10, AIR);          // open mouth
cube(-2, 7, 10, -2, 8, 10, SNOW);        // tusks
cube(2, 7, 10, 2, 8, 10, SNOW);
// pointy ears
block(4, 10, 7, SKIN); block(4, 11, 7, SKIN); block(5, 11, 7, SKIN);
block(-4, 10, 7, SKIN); block(-4, 11, 7, SKIN); block(-5, 11, 7, SKIN);
// scraggly hair + back ridge
cube(-2, 11, 5, 2, 12, 7, DIRT);
block(0, 13, 6, DIRT); block(-1, 13, 7, DIRT);
block(0, 9, 4, DIRT); block(0, 7, 3, DIRT); block(0, 5, 3, DIRT);

// right arm reaching up, hand gripping the south parapet
sphere(4, 6, 5, 1.4, SKIN);
sphere(5, 7, 4, 1.4, SKIN);
sphere(6, 8, 4, 1.3, SKIN);
sphere(6, 9, 3, 1.5, SKIN);              // hand crushing over the wall
cube(5, 10, 2, 7, 10, 2, SKIN);          // fingers curling over
cube(5, 9, 2, 7, 9, 2, SKIN);
block(4, 9, 3, SKIN);                    // thumb

// left arm hanging down to the bank, holding the club
sphere(-4, 6, 5, 1.4, SKIN);
sphere(-5, 4, 7, 1.4, SKIN);
sphere(-6, 2, 8, 1.4, SKIN);
sphere(-7, 0, 10, 1.6, SKIN);            // fist
// spiked wooden club resting on the ground
line(-7, 1, 10, -11, 1, 14, OAK_LOG);
line(-7, 0, 10, -11, 0, 14, OAK_LOG);
sphere(-12, 1, 15, 2, OAK_LOG);
block(-13, 3, 16, STONE); block(-11, 3, 17, STONE);
block(-14, 1, 15, STONE); block(-12, 3, 13, STONE);

// knees breaking the water, big splayed feet
sphere(3, 2, 11, 2, SKIN);
sphere(-3, 2, 11, 2, SKIN);
cube(1, -2, 12, 3, 0, 15, SKIN);
cube(-3, -2, 12, -1, 0, 15, SKIN);
// snow toenails
block(1, -1, 16, SNOW); block(3, -1, 16, SNOW);
block(-1, -1, 16, SNOW); block(-3, -1, 16, SNOW);

// dirt loincloth + warts
cube(-3, 0, 9, 3, 1, 10, DIRT);
block(2, 3, 9, DIRT); block(-3, 4, 8, DIRT); block(1, 12, 8, DIRT);

// ---------- THREE BILLY GOATS GRUFF, crossing the deck ----------
// big goat (front, nearest the arch)
block(-8, 9, -1, SNOW); block(-8, 9, 1, SNOW);
block(-5, 9, -1, SNOW); block(-5, 9, 1, SNOW);
cube(-8, 10, -1, -4, 11, 1, SNOW);
cube(-3, 11, 0, -3, 12, 0, SNOW);
block(-2, 11, 0, SNOW);                  // snout
block(-3, 13, 0, OAK_LOG); block(-4, 13, 0, OAK_LOG);  // horns
block(-3, 10, 0, SNOW);                  // beard
block(-9, 11, 0, SNOW);                  // tail
// middle goat
block(-12, 9, 0, SNOW); block(-10, 9, 0, SNOW);
cube(-12, 10, -1, -10, 10, 0, SNOW);
block(-10, 11, 0, SNOW);
block(-9, 11, 0, SNOW); block(-9, 12, 0, OAK_LOG);
// little goat trailing behind
cube(-15, 9, 0, -14, 9, 0, SNOW);
block(-13, 9, 0, SNOW); block(-13, 10, 0, SNOW);
block(-13, 11, 0, OAK_LOG);

// ---------- TROLL'S LAIR, southeast bank ----------
// bone pile + skull
block(8, -1, 8, SNOW); block(9, -1, 9, SNOW); block(8, -1, 10, SNOW);
block(10, -1, 11, SNOW); block(7, -1, 9, SNOW); block(9, 0, 9, SNOW);
cube(9, -1, 7, 10, 0, 8, SNOW);          // skull
// campfire with crossed logs
disk(8, -1, 12, 2, COBBLE);
line(7, 0, 11, 9, 0, 13, OAK_LOG);
line(7, 0, 13, 9, 0, 11, OAK_LOG);
block(8, 1, 12, BRICK); block(8, 2, 12, BRICK); block(9, 1, 12, BRICK);