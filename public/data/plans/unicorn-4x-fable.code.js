// unicorn-4x-fable — prompt:
// a unicorn...

// Unicorn rearing on a flower meadow, foal beside, rainbow arching behind
const RB = [BRICK, SAND, LEAVES, GLASS, ICE]; // rainbow stripe palette

function ellipsoid(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.02) block(x, y, z, id);
      }
}

function limb(x1, y1, z1, x2, y2, z2, r1, r2, id) {
  const n = Math.max(2, Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = x1 + (x2 - x1) * t, cy = y1 + (y2 - y1) * t, cz = z1 + (z2 - z1) * t;
    const r = r1 + (r2 - r1) * t;
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
      for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
        for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) {
          const dx = x - cx, dy = y - cy, dz = z - cz;
          if (dx * dx + dy * dy + dz * dz <= r * r + 0.3) block(x, y, z, id);
        }
  }
}

function cloud(cx, cy, cz) {
  ellipsoid(cx, cy, cz, 3.5, 1.4, 2.2, SNOW);
  ellipsoid(cx + 2, cy + 1, cz + 0.5, 2.0, 1.2, 1.6, SNOW);
  ellipsoid(cx - 2.5, cy + 0.5, cz - 0.5, 2.2, 1.1, 1.5, SNOW);
}

// ---- clear trees from the stage (ground kept, restored by meadow) ----
cube(-15, 0, -10, 15, 8, 7, AIR);   // subject + foal footprint
cube(-19, 0, 8, 19, 8, 11, AIR);    // rainbow plane

// ---- meadow ----
disk(0, 0, 0, 13, GRASS);
disk(0, -1, 0, 13, DIRT);
disk(0, -2, 0, 12, DIRT);

// ---- rainbow (half-annulus wall at z=9..10, behind the unicorn) ----
for (let x = -17; x <= 17; x++)
  for (let y = 1; y <= 17; y++) {
    const d = Math.hypot(x, y);
    if (d >= 12 && d < 17) {
      const c = [ICE, GLASS, LEAVES, SAND, BRICK][Math.floor(d - 12)];
      block(x, y, 9, c);
      block(x, y, 10, c);
    }
  }
// clouds hugging the rainbow's feet, plus two drifting overhead
cloud(-16, 2, 9);
cloud(16, 2, 9);
cloud(13, 26, 3);
cloud(-14, 24, 6);

// ---- unicorn: rearing, facing +X ----
// body (diagonal stack of ellipsoids, haunches low, chest high)
ellipsoid(-4, 11, 0, 3.5, 3.5, 3.0, SNOW);   // hindquarters
ellipsoid(-1, 12.5, 0, 4.0, 3.3, 3.0, SNOW); // barrel
ellipsoid(2, 14, 0, 4.5, 3.2, 2.8, SNOW);    // chest/shoulders

// hind legs planted on the meadow
limb(-4, 10, 2, -6, 6, 2, 1.6, 1.2, SNOW);
limb(-6, 6, 2, -6, 2, 2, 1.1, 1.0, SNOW);
cube(-7, 1, 1, -5, 1, 3, SAND);
limb(-4, 10, -2, -6, 6, -2, 1.6, 1.2, SNOW);
limb(-6, 6, -2, -6, 2, -2, 1.1, 1.0, SNOW);
cube(-7, 1, -3, -5, 1, -1, SAND);

// front legs raised, asymmetric — one pawing high, one tucked
limb(3, 13, -2, 6, 12, -2, 1.4, 1.1, SNOW);
limb(6, 12, -2, 8, 14, -2, 1.1, 1.0, SNOW);
cube(8, 14, -3, 9, 14, -1, SAND);
limb(3, 13, 2, 5, 10, 2, 1.4, 1.1, SNOW);
limb(5, 10, 2, 6, 8, 2, 1.1, 1.0, SNOW);
cube(5, 7, 1, 6, 7, 3, SAND);

// neck arching up and forward
ellipsoid(3.5, 16.5, 0, 2.2, 2.5, 1.8, SNOW);
ellipsoid(5, 18.5, 0, 2.0, 2.3, 1.6, SNOW);
ellipsoid(6.5, 20.5, 0, 1.8, 2.0, 1.5, SNOW);

// head + muzzle
ellipsoid(8, 22.5, 0, 2.2, 2.0, 1.7, SNOW);
ellipsoid(10.5, 21.5, 0, 2.0, 1.3, 1.2, SNOW);
// eyes
block(9, 23, 2, GLASS);
block(9, 23, -2, GLASS);
// ears
block(7, 25, 1, SNOW); block(7, 26, 1, SNOW);
block(7, 25, -1, SNOW); block(7, 26, -1, SNOW);

// golden spiral horn
for (let t = 0; t <= 6; t++) {
  block(9 + Math.round(t / 3), 25 + t, 0, SAND);
}
block(8, 25, 0, SAND); // thickened base
block(10, 24, 0, BRICK); // forelock wisp

// rainbow mane cascading along the crest of neck and withers
const crest = [[8, 24], [7, 24], [6, 23], [5, 22], [4, 21], [3, 20], [2, 19], [1, 18], [0, 17], [-1, 16], [-2, 15], [-3, 15], [-4, 14]];
crest.forEach(([x, y], i) => {
  const c = RB[i % 5];
  block(x, y + 1, 0, c);
  block(x, y + 1, i % 2 ? 1 : -1, c);
  if (i >= 2 && i <= 10) block(x, y, i % 2 ? 2 : -2, c); // loose wisps
});

// rainbow tail, wavy, sweeping down toward the ground
const tail = [[-8, 12], [-9, 11], [-10, 10], [-10, 9], [-11, 8], [-11, 7], [-12, 6], [-12, 5], [-12, 4], [-11, 3], [-11, 2]];
tail.forEach(([x, y], i) => {
  const c = RB[i % 5];
  block(x, y, 0, c);
  if (i % 2) block(x, y, 1, c);
  else if (i > 2) block(x, y, -1, c);
});

// ---- foal, standing beside, gazing up at parent ----
ellipsoid(7, 4, -8, 2.7, 1.7, 1.4, SNOW);
[[5, -9], [5, -7], [9, -9], [9, -7]].forEach(([x, z]) => {
  cube(x, 2, z, x, 3, z, SNOW);
  block(x, 1, z, SAND);
});
limb(8.5, 5, -8, 10, 7, -8, 1.3, 1.0, SNOW);
ellipsoid(10.5, 8, -8, 1.5, 1.3, 1.1, SNOW);
block(12, 8, -8, SNOW); block(12, 7, -8, SNOW); // muzzle
block(11, 10, -8, SAND); block(11, 11, -8, SAND); // horn nub
block(9, 9, -8, SNOW); block(9, 10, -8, SNOW);   // ear
block(11, 8, -9, GLASS); block(11, 8, -7, GLASS); // eyes
block(8, 7, -8, RB[0]); block(9, 8, -8, RB[2]);  // mane tuft
block(4, 4, -8, RB[3]); block(4, 3, -8, RB[1]);  // tail

// ---- scattered flowers on the meadow ----
const FLW = [BRICK, SAND, SNOW, ICE];
for (let i = 0; i < 40; i++) {
  const a = i * 2.399963;
  const r = 3 + (i * 137) % 10;
  const x = Math.round(Math.cos(a) * r);
  const z = Math.round(Math.sin(a) * r);
  if (Math.hypot(x, z) > 12) continue;
  if (z > -4 && z < 4 && x > -13 && x < 11) continue;  // under unicorn
  if (z > -10 && z < -5 && x > 3 && x < 12) continue;  // under foal
  block(x, 1, z, FLW[i % 4]);
}