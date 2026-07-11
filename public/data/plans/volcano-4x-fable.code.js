// volcano-4x-fable — prompt:
// an erupting volcano...

const CX = 0, CZ = 1, H = 20;
const PI = Math.PI;

function h3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function angDiff(a, b) {
  let d = Math.abs(a - b) % (2 * PI);
  return d > PI ? 2 * PI - d : d;
}
function Rout(y) {
  return 5 + 9.5 * Math.pow(1 - y / H, 1.3);
}
function wobble(a, y) {
  return Math.sin(a * 3 + 1.7) * 1.1 + Math.sin(a * 7 + 0.4) * 0.5 + Math.sin(a * 2 - y * 0.35) * 0.45;
}

// --- clear vegetation over the footprint (AIR is free) ---
for (let x = -19; x <= 19; x++) {
  for (let z = -19; z <= 19; z++) {
    const d = Math.hypot(x - CX, z - CZ);
    if (d <= 17.5) {
      for (let y = 1; y <= 9; y++) block(x, y, z, AIR);
    }
  }
}
// extra clearing for the north lava-pond foreground
for (let x = -12; x <= -2; x++)
  for (let z = -22; z <= -14; z++)
    for (let y = 1; y <= 9; y++) block(x, y, z, AIR);

// --- lava flows down the flanks (painted into the cone shell) ---
// main flow pours north (-Z, toward camera) through a breached rim
const FLOWS = [
  { a: -PI / 2, w: 2.4, top: H },        // main north flow (through breach)
  { a: -PI / 2 - 0.9, w: 1.3, top: H - 4 }, // NW
  { a: -PI / 2 + 0.8, w: 1.4, top: H - 6 }, // NE
  { a: 0.35, w: 1.1, top: H - 3 },       // east
];

// --- the cone ---
for (let y = 0; y <= H; y++) {
  const R = Rout(y);
  const t = y < 3 ? 3.6 : 2.3;
  for (let x = -18; x <= 18; x++) {
    for (let z = -18; z <= 18; z++) {
      const dx = x - CX, dz = z - CZ;
      const d = Math.hypot(dx, dz);
      const a = Math.atan2(dz, dx);
      const Ro = R + wobble(a, y);
      if (d > Ro) continue;
      const craterFloor = (y === H - 2); // filled level = lava lake
      if (!craterFloor && d < Ro - t) continue;
      // breach the north rim so the lake spills toward the camera
      if (y > H - 3 && angDiff(a, -PI / 2) < 0.38) continue;

      let id = 0;
      if (craterFloor && d <= 3.8) {
        id = BRICK; // lava lake
      } else {
        // flowing lava streaks, meandering + widening downslope
        for (const f of FLOWS) {
          if (y > f.top) continue;
          const aa = f.a + (1.5 * Math.sin(y * 0.5 + f.a * 7)) / Math.max(3, d);
          const half = (f.w * (0.6 + (H - y) * 0.03)) / Math.max(2, d);
          if (angDiff(a, aa) < half) { id = BRICK; break; }
        }
        if (!id) {
          // glowing radial fissures on the upper flanks
          if (y > 5 && Math.sin(a * 9 + y * 0.3) > 0.93) id = BRICK;
          else {
            const r = h3(x, y, z);
            if (y < 5 && r < 0.18) id = DIRT;        // scree at the base
            else if (r < 0.3) id = COBBLE;
            else id = STONE;
          }
        }
      }
      block(x, y, z, id);
    }
  }
}

// --- jagged crater rim (skip the breach) ---
for (let a = -PI; a < PI; a += 0.11) {
  if (angDiff(a, -PI / 2) < 0.5) continue;
  const r = Rout(H) + wobble(a, H) - 0.6;
  const x = Math.round(CX + Math.cos(a) * r);
  const z = Math.round(CZ + Math.sin(a) * r);
  const v = h3(x, 91, z);
  if (v < 0.45) block(x, H + 1, z, STONE);
  if (v < 0.15) block(x, H + 2, z, COBBLE);
  if (v > 0.85) block(x, H + 1, z, BRICK); // rim spatter glow
}

// --- eruption column ---
let ctx = CX, ctz = CZ;
for (let y = H - 2; y <= 28; y++) {
  ctx = CX + Math.round(1.3 * Math.sin((y - H) * 0.65));
  ctz = CZ + Math.round(1.1 * Math.sin((y - H) * 0.5 + 2));
  const r = y < 24 ? 1.6 : 1.1;
  for (let dx = -2; dx <= 2; dx++)
    for (let dz = -2; dz <= 2; dz++)
      if (Math.hypot(dx, dz) <= r && h3(ctx + dx, y, ctz + dz) < 0.85)
        block(ctx + dx, y, ctz + dz, BRICK);
}
sphere(ctx, 28, ctz, 2, BRICK); // burst at the column head

// --- lava spray around the vent ---
for (let i = 0; i < 26; i++) {
  const aa = h3(i, 7, 3) * 2 * PI;
  const rr = 2.5 + h3(i, 11, 5) * 3.5;
  const yy = 23 + Math.floor(h3(i, 13, 9) * 6);
  block(Math.round(CX + Math.cos(aa) * rr), yy, Math.round(CZ + Math.sin(aa) * rr), BRICK);
}

// --- ash cloud (drifting east to catch light), fire-lit underneath ---
disk(2, 28, 2, 2, BRICK);
sphere(2, 30, 2, 3, COBBLE);
sphere(-3, 29, 1, 2, STONE);
sphere(6, 29, 3, 2, COBBLE);
sphere(0, 31, 4, 2, STONE);
sphere(5, 31, 1, 2, COBBLE);
sphere(2, 28, -1, 2, COBBLE);
// steam wisps on top
for (let i = 0; i < 8; i++) {
  const x = Math.round(h3(i, 21, 2) * 8 - 2);
  const z = Math.round(h3(i, 23, 4) * 6 - 1);
  block(x, 32 + (i % 2), z, SNOW);
}

// --- lava bombs on ballistic arcs, mostly toward the camera ---
const BOMBS = [
  { a: -1.3, d: 19 }, { a: -2.0, d: 16 }, { a: -0.6, d: 14 },
  { a: -2.5, d: 12 }, { a: -0.15, d: 16 }, { a: -1.57, d: 21 },
];
for (let i = 0; i < BOMBS.length; i++) {
  const b = BOMBS[i];
  for (let t = 0.15; t <= 1.001; t += 0.07) {
    const x = Math.round(CX + Math.cos(b.a) * b.d * t);
    const z = Math.round(CZ + Math.sin(b.a) * b.d * t);
    const y = Math.round(21 + 26 * t - 47 * t * t);
    if (h3(x, y + i * 31, z) < 0.6) block(x, Math.max(0, y), z, BRICK);
  }
  // impact splash
  const lx = Math.round(CX + Math.cos(b.a) * b.d);
  const lz = Math.round(CZ + Math.sin(b.a) * b.d);
  disk(lx, 0, lz, 1, BRICK);
  block(lx, 1, lz, BRICK);
  block(lx + 1, 0, lz - 1, COBBLE);
}

// --- lava ponds where the flows reach the ground ---
function pond(cx, cz, r) {
  for (let x = cx - r - 1; x <= cx + r + 1; x++) {
    for (let z = cz - r - 1; z <= cz + r + 1; z++) {
      if (x < -22 || x > 22 || z < -22 || z > 22) continue;
      const d = Math.hypot(x - cx, z - cz);
      if (d <= r) {
        block(x, -1, z, BRICK);
        block(x, 0, z, AIR);
        block(x, 1, z, AIR);
      } else if (d <= r + 1 && h3(x, 55, z) < 0.25) {
        block(x, 0, z, COBBLE); // scattered rocks at the pond edge
      }
    }
  }
}
pond(0, -15, 3);   // main north flow pools
pond(0, -18, 4);
pond(-12, -8, 2);  // NW flow
pond(11, -10, 2);  // NE flow
pond(14, 7, 2);    // east flow

// --- foreground details (north side, facing camera) ---
// glowing ground cracks radiating from the base
line(-3, -1, -14, -6, -1, -19, BRICK);
line(2, -1, -15, 4, -1, -20, BRICK);
line(6, -1, -12, 9, -1, -16, BRICK);
// volcanic boulders
sphere(-12, 0, -15, 1, COBBLE);
sphere(9, 0, -16, 1, STONE);
sphere(-16, 0, -6, 1, COBBLE);
// burnt tree snags
cube(-14, -1, -12, -14, 2, -12, OAK_LOG);
block(-13, 2, -12, OAK_LOG);
cube(16, -1, -12, 16, 1, -12, OAK_LOG);