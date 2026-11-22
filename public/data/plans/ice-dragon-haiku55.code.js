// ice-dragon-haiku55 — prompt:
// an ice dragon...

function ell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) block(x, y, z, id);
      }
}

// Sparse scale pattern on the outer shell of an ellipsoid
function scales(cx, cy, cz, rx, ry, rz, id, mod) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        const d = dx * dx + dy * dy + dz * dz;
        if (d <= 1 && d > 0.55 && (((x * 3 + y * 5 + z * 7) % mod) + mod) % mod === 0) block(x, y, z, id);
      }
}

// Filled triangle, sampled and deduplicated
function tri(A, B, C, id) {
  const seen = new Set();
  const N = 48;
  for (let i = 0; i <= N; i++)
    for (let j = 0; j <= N - i; j++) {
      const u = i / N, v = j / N, w = 1 - u - v;
      const x = Math.round(A[0] * u + B[0] * v + C[0] * w);
      const y = Math.round(A[1] * u + B[1] * v + C[1] * w);
      const z = Math.round(A[2] * u + B[2] * v + C[2] * w);
      const k = x + ',' + y + ',' + z;
      if (!seen.has(k)) { seen.add(k); block(x, y, z, id); }
    }
}

// Tapered tube made of ellipsoids along a segment
function seg(a, b, r0, r1, id, steps) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, r = r0 + (r1 - r0) * t;
    ell(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, r, r, id);
  }
}

// Tapered ice spire rising from the frozen ground
function spire(cx, cz, h, r) {
  for (let y = -2; y <= h; y++) {
    const rr = Math.max(0.6, r * (1 - y / h));
    for (let x = Math.floor(cx - rr); x <= Math.ceil(cx + rr); x++)
      for (let z = Math.floor(cz - rr); z <= Math.ceil(cz + rr); z++)
        if ((x - cx) * (x - cx) + (z - cz) * (z - cz) <= rr * rr) block(x, y, z, ICE);
  }
}

// One wing: ice membrane between snow bones, mirrored by side s (-1 west, 1 east)
function wing(s) {
  const S = [3 * s, 9, -1], E = [9 * s, 14, -2], T = [19 * s, 12, 1];
  const F = [15 * s, 6, 4], B = [3 * s, 5, 3];
  tri(S, E, T, ICE);
  tri(S, T, F, ICE);
  tri(S, F, B, ICE);
  line(S[0], S[1], S[2], E[0], E[1], E[2], SNOW);
  line(E[0], E[1], E[2], T[0], T[1], T[2], SNOW);
  line(S[0], S[1], S[2], F[0], F[1], F[2], SNOW);
  line(E[0], E[1], E[2], F[0], F[1], F[2], SNOW);
  line(T[0], T[1], T[2], F[0], F[1], F[2], SNOW);
  block(T[0], T[1] + 1, T[2], ICE);
}

// Frozen ground pad under the dragon (top layer of the grass at y=-1)
ell(0, -1, 2, 9, 0.5, 13, SNOW);
for (let x = -9; x <= 9; x++)
  for (let z = -11; z <= 15; z++) {
    const dx = x / 9, dz = (z - 2) / 13;
    if (dx * dx + dz * dz <= 1 && (((x * 31 + z * 17) % 13) + 13) % 13 === 0) block(x, -1, z, ICE);
  }

// Background: frozen spires framing the scene
spire(-17, -16, 12, 2);
spire(16, -17, 9, 1.6);
spire(-15, 13, 7, 1.4);
spire(18, 13, 10, 1.8);

// Floating ice shards (foreground/background depth)
[[-9, 7, -6], [10, 9, -9], [-11, 13, 5], [12, 3, -11], [-13, 2, -3], [9, 16, 6],
 [-7, 18, -5], [7, 4, 13], [-14, 9, 11], [15, 2, -8], [-4, 19, 9], [5, 21, -3]]
  .forEach(([x, y, z]) => line(x, y, z, x, y + 2, z, ICE));

// Wings (drawn before body so roots are hidden inside the torso)
wing(-1);
wing(1);

// Torso
ell(0, 7, 3, 4, 3.5, 7, LIGHT_BLUE);
scales(0, 7, 3, 4, 3.5, 7, ICE, 4);
ell(0, 7, -3, 3.5, 3.5, 3.5, LIGHT_BLUE);
ell(0, 4.6, 3, 3.3, 1.7, 6.4, WHITE);

// Snow dusting on the back
for (let z = -1; z <= 9; z++)
  for (let x = -2; x <= 2; x++) {
    const q = 1 - (x / 4) * (x / 4) - ((z - 3) / 7) * ((z - 3) / 7);
    if (q > 0) block(x, Math.floor(7 + 3.5 * Math.sqrt(q)), z, SNOW);
  }

// Dorsal spines along the spine
for (let z = -2; z <= 10; z++) {
  const q = 1 - ((z - 3) / 7) * ((z - 3) / 7);
  const top = Math.floor(7 + 3.5 * Math.sqrt(Math.max(0, q)));
  block(0, top + 1, z, ICE);
  if (z % 2 === 0) block(0, top + 2, z, ICE);
}

// Neck and head
seg([0, 8, -3], [0, 12, -9], 2.6, 2.0, LIGHT_BLUE, 10);
ell(0, 13, -12, 3, 2.6, 3.6, LIGHT_BLUE);
ell(0, 12.4, -16.5, 2.1, 1.9, 3.1, LIGHT_BLUE);
ell(0, 10.4, -15.5, 1.6, 0.9, 3.4, WHITE);
cube(-1, 11, -19, 1, 11, -16, BLACK);
for (let x = -1; x <= 1; x++) {
  block(x, 11, -19, SNOW);
  block(x, 10, -18, SNOW);
}

// Horns, brows, cheek spikes
line(1, 15, -10, 3, 19, -7, ICE);
line(-1, 15, -10, -3, 19, -7, ICE);
block(3, 12, -13, ICE);
block(-3, 12, -13, ICE);
for (const s of [-1, 1]) {
  block(2 * s, 13, -14, NEON_BLUE);
  block(2 * s, 14, -14, ICE);
}

// Tail: S-curve coiling south, tapering to a blade
for (let i = 0; i <= 30; i++) {
  const t = i / 30;
  const cx = 2.5 * Math.sin(t * 4.5), cy = 6.5 - 4 * t, cz = 8 + 13 * t, r = 2.8 - 2.0 * t;
  ell(cx, cy, cz, r, r, r, LIGHT_BLUE);
  if (i % 6 === 3) block(Math.round(cx), Math.round(cy + r) + 1, Math.round(cz), ICE);
}
ell(-2.4, 2.5, 20.5, 2.4, 0.6, 1.4, ICE);

// Legs with snow paws and ice claws
for (const s of [-1, 1])
  for (const z of [-1, 7]) {
    const x = 3 * s;
    cube(x - 1, 0, z - 1, x + 1, 6, z + 1, LIGHT_BLUE);
    cube(x - 1, 0, z - 2, x + 1, 0, z + 1, SNOW);
    for (let k = -1; k <= 1; k++) block(x + k, 0, z - 3, ICE);
  }