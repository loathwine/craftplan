// lighthouse-4x-fable — prompt:
// a lighthouse on a cliff...

function hash(x, z) {
  const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

// ---- cliff shape: sheer headland (north) + grassy hill (south) ----
function cliffTop(x, z) {
  const dxT = x, dzT = z - 4;
  if (Math.sqrt(dxT * dxT + dzT * dzT) < 4.6) return 9;      // flat pad for the lighthouse
  if (x >= 4 && x <= 10 && z >= 10 && z <= 16) return 8;     // flat pad for keeper's cottage
  let t = -99;
  // promontory: squarish superellipse, sheer walls
  const px = x / 6.5, pz = (z - 4) / 6.5;
  const pr = Math.pow(px * px * px * px + pz * pz * pz * pz, 0.25);
  if (pr < 1) t = Math.max(t, 9 - Math.max(0, pr - 0.75) * 14);
  // hill rolling away to the south
  const hx = (x - 2) / 11, hz = (z - 14) / 8;
  const hr = Math.sqrt(hx * hx + hz * hz);
  if (hr < 1) t = Math.max(t, 8.5 - 7.5 * Math.pow(Math.max(0, hr - 0.25) / 0.75, 1.4));
  if (t <= -50) return -99;
  t += (hash(x, z) - 0.5) * 1.8;
  return Math.max(1, Math.round(t));
}
function topAt(x, z) { const t = cliffTop(x, z); return t <= -50 ? null : t; }

// ---- terrain pass: sea, beach, cliff (with hidden-interior hollowing) ----
for (let x = -18; x <= 18; x++) {
  const sz = -9 - Math.floor(hash(x, 99) * 3); // jagged shoreline
  for (let z = -22; z <= 20; z++) {
    const t = topAt(x, z);
    if (t !== null) {
      for (let y = t + 1; y <= 12; y++) block(x, y, z, AIR); // clear trees over cliff
      let mn = t;
      const nb = [topAt(x + 1, z), topAt(x - 1, z), topAt(x, z + 1), topAt(x, z - 1)];
      for (const n of nb) mn = Math.min(mn, n === null ? -2 : n);
      const lo = Math.max(-3, Math.min(t - 2, mn + 1)); // fill only exposed depth
      for (let y = lo; y <= t; y++) {
        let m;
        if (y === t) m = t >= 6 ? GRASS : (hash(x * 3, z * 7) < 0.5 ? STONE : COBBLE);
        else if (y === t - 1) m = t >= 6 ? DIRT : STONE;
        else m = hash(x * 5 + y, z * 3 + y) < 0.22 ? COBBLE : STONE;
        block(x, y, z, m);
      }
      if (t >= 6 && hash(x * 13, z * 17) > 0.97) block(x, t + 1, z, STONE); // boulders
      continue;
    }
    if (z <= sz) { // open sea
      for (let y = 0; y <= 9; y++) block(x, y, z, AIR);
      const foam = (z === sz && hash(x, z * 5) < 0.45) || hash(x * 7, z * 11) < 0.035;
      block(x, -1, z, foam ? SNOW : GLASS);
    } else if (z <= sz + 3) { // beach
      for (let y = 0; y <= 9; y++) block(x, y, z, AIR);
      block(x, -1, z, SAND);
      if (hash(x * 9, z) < 0.06) block(x, 0, z, STONE);
    } else if (z <= 1 && x >= -13 && x <= 13) {
      for (let y = 1; y <= 9; y++) block(x, y, z, AIR); // clear view corridor
    }
  }
}

// ---- sea rocks + foam rings ----
sphere(-11, -1, -15, 2, STONE);
sphere(-9, -1, -14, 1, COBBLE);
sphere(10, -1, -13, 2, STONE);
block(10, 2, -13, COBBLE);
sphere(3, -2, -19, 2, COBBLE);
const isl = [[-11, -15], [10, -13], [3, -19]];
for (const [cx, cz] of isl) {
  for (let a = 0; a < 14; a++) {
    const fx = Math.round(cx + 3 * Math.cos(a / 14 * 6.283));
    const fz = Math.round(cz + 3 * Math.sin(a / 14 * 6.283));
    if (fz >= -22 && Math.abs(fx) <= 18 && hash(fx * 3, fz * 5) < 0.6) block(fx, -1, fz, SNOW);
  }
}

// ---- wooden pier + buoy ----
cube(-15, 0, -17, -13, 0, -8, PLANKS);
cube(-15, -2, -17, -15, -1, -17, OAK_LOG);
cube(-13, -2, -17, -13, -1, -17, OAK_LOG);
cube(-15, -2, -12, -15, -1, -12, OAK_LOG);
cube(-13, -2, -12, -13, -1, -12, OAK_LOG);
block(-14, 1, -16, OAK_LOG); // barrel at pier end
block(7, -1, -20, BRICK); block(7, 0, -20, BRICK); // red buoy

// ---- lighthouse tower (center 0,4), red/white banded ----
cylinder(0, 10, 4, 4, 1, COBBLE); // flared base
for (let y = 11; y <= 24; y++) {
  const r = y <= 16 ? 3 : 2;
  const band = Math.floor((y - 11) / 3) % 2;
  hollowCylinder(0, y, 4, r, 1, band === 0 ? SNOW : BRICK);
}
// door on the north face
block(-1, 11, 1, OAK_LOG); block(1, 11, 1, OAK_LOG);
block(-1, 12, 1, OAK_LOG); block(1, 12, 1, OAK_LOG);
block(0, 13, 1, OAK_LOG);
block(0, 11, 1, AIR); block(0, 12, 1, AIR);
block(0, 10, 0, COBBLE); // doorstep
// windows climbing the shaft
block(0, 15, 1, GLASS); block(0, 18, 2, GLASS); block(0, 21, 2, GLASS);
// gallery deck + railing
disk(0, 25, 4, 4, COBBLE);
hollowCylinder(0, 26, 4, 4, 1, OAK_LOG);
// lantern room with glowing core
hollowCylinder(0, 26, 4, 2, 3, GLASS);
block(0, 26, 4, SNOW); block(0, 27, 4, ICE); block(0, 28, 4, SNOW);
// conical roof
disk(0, 29, 4, 3, BRICK);
disk(0, 30, 4, 2, BRICK);
disk(0, 31, 4, 1, BRICK);
block(0, 32, 4, BRICK);
block(0, 33, 4, COBBLE);
// beacon beams sweeping over the sea
line(0, 27, 2, -13, 30, -17, ICE);
line(0, 27, 2, 12, 30, -16, ICE);

// ---- keeper's cottage on the hill pad ----
cube(4, 8, 10, 10, 8, 16, PLANKS);          // floor
cube(4, 9, 10, 10, 11, 10, PLANKS);         // north wall
cube(4, 9, 16, 10, 11, 16, PLANKS);         // south wall
cube(4, 9, 11, 4, 11, 15, PLANKS);          // west wall
cube(10, 9, 11, 10, 11, 15, PLANKS);        // east wall
cube(4, 9, 10, 4, 11, 10, OAK_LOG);         // corner posts
cube(10, 9, 10, 10, 11, 10, OAK_LOG);
cube(4, 9, 16, 4, 11, 16, OAK_LOG);
cube(10, 9, 16, 10, 11, 16, OAK_LOG);
cube(5, 9, 11, 9, 11, 15, AIR);             // hollow interior
block(6, 9, 10, OAK_LOG); block(8, 9, 10, OAK_LOG); block(7, 11, 10, OAK_LOG);
block(7, 9, 10, AIR); block(7, 10, 10, AIR); // door faces the lighthouse/sea
block(5, 10, 10, GLASS); block(9, 10, 10, GLASS);
block(4, 10, 13, GLASS); block(10, 10, 13, GLASS);
// stepped slate roof
cube(3, 12, 9, 11, 12, 17, COBBLE);
cube(5, 13, 11, 9, 13, 15, COBBLE);
cube(6, 14, 12, 8, 14, 14, COBBLE);
block(7, 15, 13, COBBLE);
// chimney + smoke
cube(9, 13, 15, 9, 16, 15, BRICK);
block(9, 18, 15, SNOW); block(10, 19, 15, SNOW);

// ---- cobble path from tower to cottage ----
const pathPts = [[1, 7], [2, 8], [3, 9], [4, 9], [5, 10], [6, 10]];
for (const [px2, pz2] of pathPts) {
  const pt = topAt(px2, pz2);
  if (pt !== null) block(px2, pt, pz2, COBBLE);
}

// ---- gulls over the water ----
function gull(x, y, z) {
  block(x, y, z, SNOW);
  block(x - 1, y + 1, z, SNOW);
  block(x + 1, y + 1, z, SNOW);
}
gull(-7, 14, -12);
gull(6, 12, -16);
gull(-2, 16, -20);