// grogu-4x-opus — prompt:
// Grogu (Baby Yoda)...

const meta = {}; // (ignored by sandbox)

// ---- helpers -------------------------------------------------
function ellipsoid(cx, cy, cz, rx, ry, rz, id) {
  for (let x = -rx; x <= rx; x++)
    for (let y = -ry; y <= ry; y++)
      for (let z = -rz; z <= rz; z++) {
        const d = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
        if (d <= 1.0) block(cx + x, cy + y, cz + z, id);
      }
}

// ---- 0. clear the dense hedge around the figure --------------
cube(-18, 0, -5, 18, 22, 9, AIR);
disk(0, -1, 2, 8, GRASS);        // clean footing

// ---- 1. robe (tan cone) --------------------------------------
for (let y = 0; y <= 8; y++) {
  const r = Math.round(6 - (y * (6 - 2.5) / 8));
  disk(0, y, 2, r, PLANKS);
}
// robe fold shadows (front + sides)
for (const ang of [-0.9, -0.45, 0, 0.45, 0.9]) {
  for (let y = 1; y <= 7; y++) {
    const r = 6 - (y * (6 - 2.5) / 8);
    const x = Math.round(Math.sin(ang) * r);
    const z = Math.round(2 - Math.cos(ang) * r);
    block(x, y, z, OAK_LOG);
  }
}
// cream under-tunic showing at chest opening
for (let y = 3; y <= 8; y++) {
  const r = 6 - (y * (6 - 2.5) / 8);
  const z = Math.round(2 - r);
  block(0, y, z, SAND);
  block(0, y, z + 1, SAND);
}

// wide draping sleeves
ellipsoid(-5, 3, 2, 3, 3, 3, PLANKS);
ellipsoid(5, 3, 2, 3, 3, 3, PLANKS);
// sleeve fold detail
block(-6, 2, -1, OAK_LOG); block(-6, 4, -1, OAK_LOG);
block(6, 2, -1, OAK_LOG);  block(6, 4, -1, OAK_LOG);

// raised robe collar standing behind the head (open at front)
for (let a = 0; a < Math.PI * 2; a += 0.25) {
  const x = Math.round(Math.cos(a) * 4);
  const z = Math.round(2 + Math.sin(a) * 4);
  if (z >= 2) {
    block(x, 8, z, PLANKS);
    block(x, 9, z, PLANKS);
    if (z >= 4) block(x, 10, z, PLANKS);
  }
}

// ---- 2. neck + head ------------------------------------------
cylinder(0, 7, 2, 2, 3, LEAVES);
ellipsoid(0, 14, 2, 6, 6, 5, LEAVES);   // big round head

// cheek bulges (chubby)
ellipsoid(-4, 11, -1, 2, 2, 2, LEAVES);
ellipsoid(4, 11, -1, 2, 2, 2, LEAVES);

// ---- 3. the big ears -----------------------------------------
function ear(dir) {
  const len = 11;
  for (let i = 0; i <= len; i++) {
    const t = i / len;
    const x = Math.round(dir * (5 + i));
    const cy = 15 - Math.round(t * 4);
    const cz = 2 + Math.round(t * 2);
    const ry = Math.max(1, Math.round((1 - t) * 4));
    const rz = Math.max(1, Math.round((1 - t) * 3));
    for (let yy = -ry; yy <= ry; yy++)
      for (let zz = -rz; zz <= rz; zz++) {
        if ((yy*yy)/(ry*ry) + (zz*zz)/(rz*rz) <= 1.05)
          block(x, cy + yy, cz + zz, LEAVES);
      }
    // pale inner-ear hint on the front face
    if (i >= 1 && i <= len - 3) block(x, cy, cz - rz, SAND);
  }
}
ear(-1);
ear(1);

// ---- 4. face -------------------------------------------------
// heavy brow ridge
for (let x = -4; x <= 4; x++) {
  block(x, 16, -3, LEAVES);
  block(x, 16, -2, LEAVES);
}
// forehead wrinkles
for (let x = -3; x <= 3; x += 2) block(x, 17, -2, OAK_LOG);

// huge dark eyes
for (const sx of [-3, 3]) {
  ellipsoid(sx, 13, -1, 2, 2, 2, OAK_LOG);
  block(sx + (sx < 0 ? 1 : -1), 14, -3, SNOW); // glint
}

// small nose + nostrils
block(0, 12, -3, LEAVES);
block(-1, 11, -3, OAK_LOG);
block(1, 11, -3, OAK_LOG);
// neutral little mouth
for (let x = -1; x <= 1; x++) block(x, 10, -3, OAK_LOG);

// wispy top hairs
block(-1, 20, 3, LEAVES);
block(1, 20, 2, LEAVES);
block(0, 21, 3, LEAVES);

// ---- 5. hands holding a cup (iconic pose) --------------------
cube(-1, 4, -4, 1, 6, -3, COBBLE);      // the bone-broth cup
block(-2, 4, -5, COBBLE);               // cup handle
ellipsoid(-2, 4, -2, 2, 1, 1, LEAVES);  // left hand
ellipsoid(2, 4, -2, 2, 1, 1, LEAVES);   // right hand

// ---- 6. little feet peeking out ------------------------------
cube(-3, 0, -5, -1, 0, -4, LEAVES);
cube(1, 0, -5, 3, 0, -4, LEAVES);