// pikachu-4x-opus — prompt:
// Pikachu...

ellipsoid = function(cx, cy, cz, rx, ry, rz, id) {
  const ax = Math.ceil(rx), ay = Math.ceil(ry), az = Math.ceil(rz);
  for (let x = -ax; x <= ax; x++)
    for (let y = -ay; y <= ay; y++)
      for (let z = -az; z <= az; z++) {
        const d = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
        if (d <= 1.0) block(cx + x, cy + y, cz + z, id);
      }
};

// ---------- clear a little airspace so stray forest leaves don't clip ----------
for (let x = -9; x <= 9; x++)
  for (let z = -9; z <= 9; z++)
    for (let y = 9; y <= 33; y++) {
      if (Math.abs(x) > 7 || z > 7) block(x, y, z, AIR);
    }

// ---------- BODY (chunky yellow pear) ----------
ellipsoid(0, 8, 1, 6, 6.5, 5.5, SAND);
// belly slightly puffed toward viewer
ellipsoid(0, 7, -1, 5, 5.5, 4, SAND);

// ---------- HEAD (big round, merged into body) ----------
ellipsoid(0, 17, -0.5, 6, 5.5, 5.5, SAND);

// brown back stripes (Pikachu's two short nape stripes)
cube(-4, 13, 4, 3, 13, 5, OAK_LOG);
cube(-3, 15, 4, 2, 15, 5, OAK_LOG);

// ---------- EARS (long, yellow with black tips) ----------
function ear(sx) {
  const steps = 15;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(sx * (2.5 + t * 5.5));
    const y = Math.round(20 + t * 11);
    const z = Math.round(1 + t * 1.5);
    const r = 2.0 - t * 0.8;
    const id = t > 0.66 ? COBBLE : SAND;
    ellipsoid(x, y, z, r, 1.3, r, id);
  }
}
ear(-1);
ear(1);

// ---------- ARMS (little stubby) ----------
ellipsoid(-6, 7, -2, 2.2, 2.6, 2.2, SAND);
ellipsoid(6, 7, -2, 2.2, 2.6, 2.2, SAND);

// ---------- FEET ----------
ellipsoid(-3, 1, -3, 2.6, 1.6, 3.2, SAND);
ellipsoid(3, 1, -3, 2.6, 1.6, 3.2, SAND);
// foundation in case ground dips
cube(-4, -2, -4, 4, -1, 3, SAND);

// ---------- TAIL (lightning bolt, brown base) ----------
cube(5, 3, 3, 7, 6, 6, OAK_LOG);       // brown base
cube(6, 6, 4, 9, 10, 6, SAND);
cube(8, 9, 4, 12, 13, 6, SAND);
cube(10, 12, 4, 12, 17, 6, SAND);
cube(11, 16, 4, 15, 20, 6, SAND);
cube(13, 19, 4, 15, 24, 6, SAND);
cube(14, 23, 4, 16, 27, 6, SAND);

// ================= FACE (front is -Z) =================
// red cheeks
ellipsoid(-5, 15, -4, 2.2, 2.2, 1.2, BRICK);
ellipsoid(5, 15, -4, 2.2, 2.2, 1.2, BRICK);

// eyes (black with white shine)
ellipsoid(-3, 19, -5, 1.6, 2.0, 1.4, COBBLE);
ellipsoid(3, 19, -5, 1.6, 2.0, 1.4, COBBLE);
block(-3, 20, -6, SNOW);
block(-2, 20, -6, SNOW);
block(3, 20, -6, SNOW);
block(4, 20, -6, SNOW);

// nose
block(0, 17, -6, COBBLE);

// smiley open mouth
line(-2, 15, -6, 2, 15, -6, COBBLE);
block(-2, 16, -6, COBBLE);
block(2, 16, -6, COBBLE);
block(-1, 14, -6, COBBLE);
block(0, 14, -6, COBBLE);
block(1, 14, -6, COBBLE);
// little red tongue
block(0, 15, -6, BRICK);