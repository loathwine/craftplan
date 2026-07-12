// elephant-4x-opus — prompt:
// an African elephant...

// African elephant — faces NORTH (-Z), body runs back toward +Z.
// Gray body (COBBLE/STONE), white tusks (SNOW), huge fanned ears.

const R = Math.round, F = Math.floor, C = Math.ceil;

function ellipsoid(cx, cy, cz, rx, ry, rz, id) {
  for (let x = F(cx - rx); x <= C(cx + rx); x++)
    for (let y = F(cy - ry); y <= C(cy + ry); y++)
      for (let z = F(cz - rz); z <= C(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) block(x, y, z, id);
      }
}

// deterministic hide texture: mostly COBBLE, occasional STONE fleck
function hide(x, y, z) {
  const h = ((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) >>> 0;
  return (h % 7 === 0) ? STONE : COBBLE;
}
function ellipsoidHide(cx, cy, cz, rx, ry, rz) {
  for (let x = F(cx - rx); x <= C(cx + rx); x++)
    for (let y = F(cy - ry); y <= C(cy + ry); y++)
      for (let z = F(cz - rz); z <= C(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) block(x, y, z, hide(x, y, z));
      }
}

// ---- 0. Clear intruding forest right around the subject ----------------
cube(-10, 0, -12, 10, 25, 14, AIR);

// ---- 1. Legs (thick tapered pillars, padded feet, toenails) ------------
function leg(fx, fz) {
  for (let y = 0; y <= 9; y++) {
    const r = (y >= 8) ? 3 : 2;
    const wide = (y >= 8) ? 3 : 2;
    for (let x = fx - wide; x <= fx + wide; x++)
      for (let z = fz - wide; z <= fz + wide; z++) {
        const dx = x - fx, dz = z - fz;
        if (dx * dx + dz * dz <= r * r) block(x, y, z, hide(x, y, z));
      }
  }
  for (let x = fx - 2; x <= fx + 2; x++)
    for (let z = fz - 2; z <= fz + 2; z++)
      if ((x - fx) ** 2 + (z - fz) ** 2 <= 6) block(x, 0, z, STONE);
  block(fx - 2, 1, fz - 2, SNOW);
  block(fx, 1, fz - 2, SNOW);
  block(fx + 2, 1, fz - 2, SNOW);
}
leg(-4, -1); leg(4, -1); leg(-4, 9); leg(4, 9);

// ---- 2. Body: barrel + high shoulder + rump ----------------------------
ellipsoidHide(0, 13, 4, 6, 5, 7);
ellipsoidHide(0, 15, -1, 5, 4.5, 3.5);
ellipsoidHide(0, 13, 10, 4.5, 4, 3);

// ---- 3. Head, brow, domed forehead, eyes -------------------------------
ellipsoidHide(0, 15, -5, 4.5, 4.5, 4);
ellipsoidHide(0, 12.5, -7, 3.2, 3, 2.5);
ellipsoid(0, 18, -5, 3, 2, 3, hide(0, 18, -5));
block(-3, 15, -8, OAK_LOG); block(3, 15, -8, OAK_LOG);
block(-3, 15, -9, OAK_LOG); block(3, 15, -9, OAK_LOG);

// ---- 4. Huge fanned African ears (flare out + trail back) --------------
function ear(side) {
  for (let y = 9; y <= 21; y++)
    for (let z = -10; z <= 1; z++) {
      const dy = (y - 15) / 6.2, dz = (z + 4.5) / 5.6;
      if (dy * dy + dz * dz <= 1) {
        for (let t = 0; t <= 2; t++) {
          const x = side * (4 + t), zz = z + t;
          block(x, y, zz, hide(x, y, zz));
        }
      }
    }
}
ear(-1); ear(1);

// ---- 5. Trunk: hangs from head-front, curls forward, wrinkled ----------
for (let i = 0; i <= 26; i++) {
  const t = i / 26;
  const y = R(13 - 13 * t);
  const z = R(-8 - 3.2 * Math.sin(t * 2.0));
  const r = Math.max(1, R(2.7 - 1.4 * t));
  sphere(0, y, z, r, hide(0, y, z));
  if (i % 3 === 0) { block(-r, y, z, STONE); block(r, y, z, STONE); }
}
block(0, 0, R(-8 - 3.2 * Math.sin(2.0)), OAK_LOG);

// ---- 6. Tusks: white, sweeping forward and up, tapering to points ------
function tusk(side) {
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const y = R(11 - 4 * t + 2.2 * t * t);
    const z = R(-9 - 3.5 * t);
    const x = R(side * (2.2 + 1.2 * t));
    if (t > 0.85) block(x, y, z, SNOW); else sphere(x, y, z, 1, SNOW);
  }
}
tusk(-1); tusk(1);

// ---- 7. Tail with dark tuft --------------------------------------------
for (let i = 0; i <= 8; i++) {
  const t = i / 8;
  const y = R(15 - 9 * t), z = R(11 + 2 * t);
  block(0, y, z, hide(0, y, z));
  if (i >= 6) { block(0, y, z, OAK_LOG); block(-1, y, z, OAK_LOG); block(1, y, z, OAK_LOG); }
}