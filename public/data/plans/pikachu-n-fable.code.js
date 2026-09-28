// pikachu-n-fable — prompt:
// Pikachu...

// Pikachu — sitting, facing north (-Z), lightning tail on the east side

function ellipsoid(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx*dx + dy*dy + dz*dz <= 1) block(x, y, z, id);
      }
}
function inside(x, y, z, cx, cy, cz, rx, ry, rz) {
  const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
  return dx*dx + dy*dy + dz*dz <= 1;
}
// outermost inside z on the north face of an ellipsoid at column (x,y)
function frontZ(x, y, cx, cy, cz, rx, ry, rz) {
  for (let z = Math.floor(cz - rz); z <= cz; z++)
    if (inside(x, y, z, cx, cy, cz, rx, ry, rz)) return z;
  return null;
}
function backZ(x, y, cx, cy, cz, rx, ry, rz) {
  for (let z = Math.ceil(cz + rz); z >= cz; z--)
    if (inside(x, y, z, cx, cy, cz, rx, ry, rz)) return z;
  return null;
}

// clear the footprint (trees / logs in the way)
cube(-13, 0, -9, 16, 31, 9, AIR);

// ---- body ----
const B = [0, 6, 2, 6.5, 6.5, 6];
ellipsoid(...B, YELLOW);
// brown back stripes
for (const sy of [7, 8, 10, 11]) {
  for (let x = -4; x <= 4; x++) {
    const z = backZ(x, sy, ...B);
    if (z !== null) block(x, sy, z, BROWN);
  }
}

// ---- head ----
const H = [0, 15, 0, 7.5, 6.5, 6.5];
ellipsoid(...H, YELLOW);

// eyes (black with white glint)
for (const sx of [-3, 3]) {
  for (let ex = sx - 1; ex <= sx + 1; ex++)
    for (let ey = 15; ey <= 17; ey++) {
      if (Math.abs(ex - sx) === 1 && (ey === 15 || ey === 17)) continue;
      const z = frontZ(ex, ey, ...H);
      if (z !== null) block(ex, ey, z, BLACK);
    }
  const hz = frontZ(sx + (sx > 0 ? -1 : 1), 17, ...H);
  block(sx + (sx > 0 ? -1 : 1), 17, hz, WHITE);
}
// nose
block(0, 14, frontZ(0, 14, ...H), BLACK);
// mouth — wide smile
for (let x = -3; x <= 3; x++) {
  const y = Math.abs(x) === 3 ? 13 : 12;
  block(x, y, frontZ(x, y, ...H), BLACK);
}
// red cheeks
for (const sx of [-6, 6]) {
  for (let cy = 12; cy <= 14; cy++)
    for (let cx = sx - 1; cx <= sx + 1; cx++) {
      if (Math.abs(cx - sx) === 1 && cy !== 13) continue;
      const z = frontZ(cx, cy, ...H);
      if (z !== null) block(cx, cy, z, RED);
      // wrap around the side a bit
      if (z !== null) block(cx + (sx > 0 ? 1 : -1), cy, z + 1, RED);
    }
  // crackling sparks just off the cheeks
  block(sx + (sx > 0 ? 3 : -3), 13, -5, ELECTRIC);
}

// ---- ears ----
for (const s of [-1, 1]) {
  const x0 = 4 * s, y0 = 20, z0 = -1;
  const x1 = 9 * s, y1 = 30, z1 = -3;
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t);
    const z = Math.round(z0 + (z1 - z0) * t);
    const id = t > 0.68 ? BLACK : YELLOW;
    // taper: thicker at base
    if (t < 0.35) { sphere(x, y, z, 1.5, id); }
    else { sphere(x, y, z, 1, id); }
  }
  block(10 * s, 31, -3, ELECTRIC);
}

// ---- arms (front, resting) ----
for (const s of [-1, 1]) {
  cube(3 * s, 5, -6, 5 * s, 7, -2, YELLOW);
  cube(3 * s, 5, -7, 5 * s, 6, -7, YELLOW);
  // finger notches
  block(4 * s, 5, -8, YELLOW);
  block(4 * s, 4, -6, BROWN);
}

// ---- feet ----
for (const s of [-1, 1]) {
  cube(2 * s, 0, -7, 4 * s, 1, 1, YELLOW);
  block(2 * s, 0, -8, YELLOW);
  block(4 * s, 0, -8, YELLOW);
  block(3 * s, 0, -8, YELLOW);
}

// ---- lightning-bolt tail (east side, back) ----
cube(3, 7, 6, 5, 9, 7, BROWN);
cube(5, 9, 6, 8, 11, 7, YELLOW);
cube(6, 11, 6, 7, 13, 7, YELLOW);
cube(7, 13, 6, 11, 15, 7, YELLOW);
cube(9, 15, 6, 10, 18, 7, YELLOW);
cube(10, 18, 6, 15, 21, 7, YELLOW);
cube(12, 21, 6, 14, 25, 7, YELLOW);
cube(11, 25, 6, 15, 26, 7, YELLOW);
block(16, 24, 6, ELECTRIC);

// ---- ground: small scorched patch + stray sparks ----
disk(0, -1, -1, 9, GRASS);
for (const [x, z] of [[-7, -6], [8, -7], [-9, 2], [10, 1]]) {
  block(x, -1, z, COBBLE);
  block(x, 0, z, ELECTRIC);
}