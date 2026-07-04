// yoda-4x-fable — prompt:
// Yoda...

// Yoda on Dagobah — robed figure with raised green lightsaber, gnarled swamp tree,
// mud hut, swamp pool, campfire.

// -- clear vegetation from build zones (terrain kept) --
cube(-11, 1, -9, 11, 16, 7, AIR);      // statue zone
cube(-20, 1, 3, -8, 10, 15, AIR);      // gnarled tree zone
cube(6, 1, 6, 18, 8, 17, AIR);         // hut zone
cube(1, 1, -16, 19, 8, -6, AIR);       // pool + dead tree zone

function ell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.round(cx - rx); x <= Math.round(cx + rx); x++)
    for (let y = Math.round(cy - ry); y <= Math.round(cy + ry); y++)
      for (let z = Math.round(cz - rz); z <= Math.round(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) block(x, y, z, id);
      }
}

// ============ YODA ============
// Robe: tapered mound, tan with woven texture and dark front opening
for (let y = 0; y <= 12; y++) {
  const r = 7.0 - 0.34 * y;
  const rz = r * 0.88;
  for (let x = Math.round(-r); x <= Math.round(r); x++)
    for (let z = Math.round(-rz); z <= Math.round(rz); z++) {
      if ((x / r) * (x / r) + (z / rz) * (z / rz) <= 1) {
        let id = PLANKS;
        if (((x * 7 + z * 13 + y * 5) % 11 + 11) % 11 === 0) id = SAND;
        if (Math.abs(x) <= 1 && z <= -(rz - 1.8)) id = OAK_LOG; // robe opening
        block(x, y, z, id);
      }
    }
}
// ragged hem
for (let a = 0; a < 24; a++) {
  if (a % 3 === 1) continue;
  const t = a / 24 * Math.PI * 2;
  block(Math.round(Math.cos(t) * 7.6), 0, Math.round(Math.sin(t) * 6.6), PLANKS);
}
// collar ring + hood bump behind head
for (let a = 0; a < 28; a++) {
  const t = a / 28 * Math.PI * 2;
  const x = Math.round(Math.cos(t) * 4.2), z = Math.round(Math.sin(t) * 3.8);
  block(x, 12, z, SAND);
  if (a % 2 === 0) block(x, 13, z, SAND);
}
ell(0, 14.5, 2.8, 3.4, 2.6, 3.0, PLANKS);   // hood draped behind
cylinder(0, 12, 0, 2, 3, LEAVES);           // neck

// Head: big green ellipsoid
ell(0, 17.5, 0, 5, 4.2, 4.3, LEAVES);

// Face (front = -Z)
block(-2, 17, -4, STONE); block(-3, 17, -4, SAND);   // left eye
block(2, 17, -4, STONE);  block(3, 17, -4, SAND);    // right eye
block(0, 16, -5, LEAVES); block(0, 15, -5, LEAVES);  // snub nose
block(-1, 15, -3, OAK_LOG); block(0, 15, -3, OAK_LOG); block(1, 15, -3, OAK_LOG); // mouth

// Ears: long tapered cones, tilted up
for (let i = 0; i <= 8; i++) {
  const t = i / 8;
  const x = 4 + t * 9;
  const y = 17.5 + t * 3;
  const r = 2.4 * (1 - t) + 0.5;
  ell(x, y, 0.3, r * 0.9, r * 0.75, r, LEAVES);
  ell(-x, y, 0.3, r * 0.9, r * 0.75, r, LEAVES);
}

// Wispy white hair
block(-2, 21, 0, SNOW); block(-1, 21, 1, SNOW); block(1, 21, 1, SNOW);
block(2, 21, 0, SNOW); block(0, 21, -1, SNOW); block(-2, 21, 2, SNOW);
block(5, 19, 0, SNOW); block(-5, 19, 0, SNOW); block(4, 21, 0, SNOW); block(-4, 21, 0, SNOW);

// Right arm raised, thrusting lightsaber up-forward
ell(4, 11.5, -1.5, 1.8, 1.6, 1.8, PLANKS);
ell(6, 12.5, -2.5, 1.6, 1.5, 1.6, PLANKS);
ell(8, 13.5, -3.5, 1.4, 1.4, 1.4, PLANKS);
ell(9, 14.5, -4, 1.2, 1.2, 1.2, LEAVES);            // hand
block(9, 15, -4, COBBLE); block(9, 16, -4, COBBLE); // hilt
for (let y = 17; y <= 29; y++) block(9, y, -4, LEAVES); // green blade
for (let y = 18; y <= 28; y++) block(9, y, -3, LEAVES);
block(9, 30, -4, LEAVES);

// Left arm down, gripping gnarled cane
ell(-4, 11, -1, 1.8, 1.6, 1.8, PLANKS);
ell(-5.5, 9, -2, 1.5, 1.5, 1.5, PLANKS);
ell(-6, 7.5, -2, 1.1, 1.0, 1.1, LEAVES);            // hand
line(-7, 0, -3, -6, 4, -3, OAK_LOG);
line(-6, 4, -3, -6, 8, -3, OAK_LOG);
block(-6, 8, -2, OAK_LOG);                          // cane knob

// ============ GNARLED SWAMP TREE ============
for (let y = -1; y <= 9; y++) {
  const cx = -14 + Math.round((y + 1) * 0.3);
  const r = y < 1 ? 2.6 : Math.max(1.2, 2.2 - y * 0.09);
  for (let dx = -3; dx <= 3; dx++)
    for (let dz = -3; dz <= 3; dz++)
      if (dx * dx + dz * dz <= r * r) block(cx + dx, y, 9 + dz, OAK_LOG);
}
// root flare
line(-14, 0, 9, -18, -1, 13, OAK_LOG);
line(-14, 0, 9, -11, -1, 12, OAK_LOG);
line(-14, 0, 9, -17, -1, 5, OAK_LOG);
line(-13, 0, 8, -10, -1, 6, OAK_LOG);
// crooked branches
line(-12, 8, 9, -8, 11, 7, OAK_LOG);
line(-15, 8, 9, -18, 11, 11, OAK_LOG);
// heavy layered canopy
disk(-13, 9, 9, 8, LEAVES);
disk(-12, 10, 8, 7, LEAVES);
disk(-13, 11, 9, 6, LEAVES);
disk(-12, 12, 8, 4, LEAVES);
disk(-13, 13, 9, 2, LEAVES);
// hanging vines
cube(-18, 5, 12, -18, 9, 12, LEAVES);
cube(-7, 6, 6, -7, 9, 6, LEAVES);
cube(-10, 4, 13, -10, 9, 13, LEAVES);
cube(-16, 6, 3, -16, 9, 3, LEAVES);
cube(-19, 5, 7, -19, 8, 7, LEAVES);

// ============ MUD HUT ============
hollowSphere(13, 0, 12, 5, DIRT);
cube(12, 0, 7, 14, 2, 8, AIR);                 // doorway facing the pool
cube(8, 1, 11, 8, 2, 12, GLASS);               // glowing window
cube(15, 4, 14, 15, 7, 14, COBBLE);            // chimney
block(15, 9, 14, SNOW); block(16, 10, 14, SNOW); block(16, 12, 13, SNOW); // smoke
block(11, 0, 7, COBBLE); block(15, 0, 8, COBBLE); block(9, 0, 15, COBBLE); // base stones

// stepping stones hut -> Yoda
block(11, -2, 11, COBBLE); block(9, -1, 9, COBBLE);
block(7, -1, 8, COBBLE); block(5, -1, 6, COBBLE);

// ============ SWAMP POOL ============
disk(6, 0, -11, 4, AIR);  disk(6, -1, -11, 4, GLASS);
disk(9, 0, -9, 3, AIR);   disk(9, -1, -9, 3, GLASS);
disk(4, 0, -14, 2, AIR);  disk(4, -1, -14, 2, GLASS);
// reeds
cube(3, 0, -8, 3, 2, -8, LEAVES); cube(10, 0, -13, 10, 2, -13, LEAVES);
cube(7, 0, -15, 7, 1, -15, LEAVES); cube(11, 0, -8, 11, 2, -8, LEAVES);
// half-sunken mossy log
line(2, 0, -13, 10, 0, -10, OAK_LOG);
block(5, 1, -12, LEAVES); block(8, 1, -11, LEAVES);

// dead twisted tree by the pool
line(14, 0, -14, 15, 4, -15, OAK_LOG);
line(15, 4, -15, 14, 8, -14, OAK_LOG);
line(14, 6, -14, 11, 9, -13, OAK_LOG);
line(15, 7, -15, 18, 10, -16, OAK_LOG);
line(14, 8, -14, 13, 11, -15, OAK_LOG);

// ============ CAMPFIRE & BOULDERS ============
block(-1, 0, -8, OAK_LOG); block(1, 0, -8, OAK_LOG);
block(0, 0, -7, OAK_LOG); block(0, 0, -9, OAK_LOG);
block(0, 0, -8, BRICK); block(0, 1, -8, BRICK);
ell(-9, 0, -7, 2, 1.4, 1.7, COBBLE);
ell(12, 0, 2, 1.6, 1.2, 1.4, STONE);
ell(-8, -1, 14, 1.8, 1.3, 1.5, STONE);