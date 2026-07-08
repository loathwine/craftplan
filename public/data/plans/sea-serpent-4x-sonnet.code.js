// sea-serpent-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Sea Serpent emerging from a lake, head facing north (-Z) =====

// 1. Clear a canvas so trees/terrain don't clutter the scene
cube(-16, -3, -20, 16, 11, 22, AIR);

// ---- Spine control points: z, y (height of body centerline), r (tube radius) ----
const CP = [
  { z: -21, y: 9,  r: 1.0 },  // head/neck top
  { z: -17, y: 5,  r: 1.6 },
  { z: -14, y: 1,  r: 1.9 },
  { z: -11, y: -2, r: 2.1 },  // submerges
  { z: -8,  y: 0,  r: 2.3 },
  { z: -5,  y: 5,  r: 2.3 },  // hump 1 peak
  { z: -2,  y: 2,  r: 2.2 },
  { z: 1,   y: -2, r: 2.1 },  // submerges
  { z: 4,   y: 1,  r: 2.1 },
  { z: 7,   y: 5,  r: 2.0 },  // hump 2 peak
  { z: 10,  y: 2,  r: 1.8 },
  { z: 13,  y: -2, r: 1.6 },  // submerges
  { z: 16,  y: 2,  r: 1.3 },
  { z: 19,  y: 5,  r: 0.9 },  // tail rising
  { z: 21,  y: 3,  r: 0.6 },  // tail tip
];

function interpAt(z) {
  for (let i = 0; i < CP.length - 1; i++) {
    const a = CP[i], b = CP[i + 1];
    if (z >= a.z && z <= b.z) {
      const t = (z - a.z) / (b.z - a.z);
      const st = 0.5 - 0.5 * Math.cos(t * Math.PI);
      return { y: a.y + (b.y - a.y) * st, r: a.r + (b.r - a.r) * st };
    }
  }
  return z < CP[0].z ? { y: CP[0].y, r: CP[0].r } : { y: CP[CP.length - 1].y, r: CP[CP.length - 1].r };
}

function xAt(z) {
  let x = Math.sin((z + 21) * 0.15) * 1.6;
  if (z > 15) x += (z - 15) * 0.2; // tail swishes east
  return x;
}

// 2. Body: overlapping spheres along the spine + underbelly stripe + dorsal spikes
for (let z = -21; z <= 21; z++) {
  const { y, r } = interpAt(z);
  const ry = Math.round(y);
  const rad = Math.max(1, Math.round(r));
  const x = Math.round(xAt(z));

  sphere(x, ry, z, rad, LEAVES);
  block(x, ry - rad, z, DIRT); // darker underbelly

  if (ry > 2 && z > -15) {
    block(x, ry + rad + 1, z, OAK_LOG);
    if (ry > 4) block(x, ry + rad + 2, z, OAK_LOG);
  }
}

// 3. Head detail (north end, z around -19 to -22)
const hx = Math.round(xAt(-21));
sphere(hx, 9, -20, 2, LEAVES);                          // skull
cube(hx - 1, 9, -22, hx + 1, 10, -19, LEAVES);           // upper jaw
cube(hx - 1, 6, -22, hx + 1, 7, -19, LEAVES);            // lower jaw
block(hx - 1, 8, -22, STONE);                            // fang
block(hx + 1, 8, -22, STONE);                            // fang
block(hx, 7, -22, BRICK);                                // tongue/throat glow
block(hx - 1, 10, -20, BRICK);                            // left eye
block(hx + 1, 10, -20, BRICK);                            // right eye
line(hx - 2, 10, -19, hx - 3, 14, -15, OAK_LOG);          // left horn
line(hx + 2, 10, -19, hx + 3, 14, -15, OAK_LOG);          // right horn

// 4. Tail fin (fan of leaves at the south tip)
const tx = Math.round(xAt(21));
for (let h = 0; h < 5; h++) {
  const w = Math.max(0, 2 - Math.floor(h / 2));
  cube(tx - w, 3 + h, 21, tx + w, 3 + h, 22, LEAVES);
}

// 5. Lake — oval body of water, cuts across the serpent at the waterline
for (let x = -14; x <= 14; x++) {
  for (let z = -18; z <= 20; z++) {
    const nx = x / 14, nz = (z - 1) / 19;
    if (nx * nx + nz * nz <= 1) {
      block(x, 0, z, GLASS);
      block(x, -3, z, SAND);
    }
  }
}

// 6. Foam rings where the serpent dips below the surface
const foamZ = [-11, 1, 13];
for (const fz of foamZ) {
  const fx = Math.round(xAt(fz));
  hollowCylinder(fx, 0, fz, 3, 1, SNOW);
}

// 7. Shoreline detail: boulders and reed tufts around the lake edge
const rocks = [[-13, -9], [13, -7], [-11, 15], [11, 16], [-15, 1], [15, 3]];
for (const [rx, rz] of rocks) {
  sphere(rx, 0, rz, 1, STONE);
}
const reeds = [[-12, -12], [12, -5], [-9, 17], [9, 18], [-14, 6], [14, -2]];
for (const [rx, rz] of reeds) {
  line(rx, 0, rz, rx, 2, rz, LEAVES);
}
```
