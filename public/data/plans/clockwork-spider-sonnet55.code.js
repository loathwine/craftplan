// clockwork-spider-sonnet55 — prompt:
// a giant clockwork spider...

const S = [-1, 1];

function thick(x1, y1, z1, x2, y2, z2, id) {
  const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
  const ax = Math.abs(dx), ay = Math.abs(dy), az = Math.abs(dz);
  const n = Math.max(ax, ay, az);
  for (let i = 0; i <= n; i++) {
    const t = n ? i / n : 0;
    const x = Math.round(x1 + dx * t), y = Math.round(y1 + dy * t), z = Math.round(z1 + dz * t);
    if (ay >= ax && ay >= az) cube(x, y, z, x + 1, y, z + 1, id);
    else if (ax >= az) cube(x, y, z, x, y + 1, z + 1, id);
    else cube(x, y, z, x + 1, y + 1, z, id);
  }
}

function gear(cx, cy, cz, r, plane, id, hubId, N, spokes) {
  const R = Math.ceil(r) + 2;
  for (let u = -R; u <= R; u++) {
    for (let v = -R; v <= R; v++) {
      const d = Math.hypot(u, v);
      const a = Math.atan2(v, u);
      let use = null;
      if (d <= 1.6) use = hubId;
      else if (d <= r && d > r - 1.5) use = id;
      else if (d > r && d <= r + 1.2 && Math.cos(N * a) > 0.2) use = id;
      else if (spokes && d < r - 1 && d > 1.5) {
        const f = a * spokes / (2 * Math.PI);
        const off = Math.abs(f - Math.round(f)) * (2 * Math.PI / spokes) * d;
        if (off < 0.75) use = id;
      }
      if (use === null) continue;
      if (plane === 'xy') block(cx + u, cy + v, cz, use);
      else if (plane === 'xz') block(cx + u, cy, cz + v, use);
      else block(cx, cy + u, cz + v, use);
    }
  }
}

function ringXY(cx, cy, cz, r, id) {
  const n = Math.ceil(2 * Math.PI * r * 1.3);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI;
    block(Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a)), cz, id);
  }
}

// clear a working area (trees) around the spider
cylinder(0, 1, 0, 20, 8, AIR);

// ===== BODY =====
// cephalothorax
hollowSphere(0, 13, -2, 5, COPPER);
ringXY(0, 13, -2, 5.7, IRON);
ringXY(0, 13, -5, 4.7, GOLD);
// waist joint
sphere(0, 14, 3, 2, IRON);
// abdomen
hollowSphere(0, 16, 9, 6, COPPER);
for (const k of [-3, 0, 3]) {
  ringXY(0, 16, 9 + k, Math.sqrt(36 - k * k) + 0.7, k === 0 ? GOLD : IRON);
}
// rivets on thorax
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2;
  block(Math.round(5.9 * Math.cos(a)), Math.round(13 + 5.9 * Math.sin(a)), -2, GOLD);
}

// ===== HEAD =====
hollowSphere(0, 12, -7, 3.5, IRON);
for (const s of S) {
  // big clockwork eyes
  sphere(s * 1.8, 13.6, -9.6, 1.6, GLASS);
  sphere(s * 1.8, 13.6, -9.8, 1, NEON_RED);
  // small eyes
  block(s * 1, 15, -9, NEON_RED);
  block(s * 2.6, 14, -8, GLOWSTONE);
  block(s * 3, 11, -8, GLOWSTONE);
  // chelicerae + fangs
  thick(s * 1.5, 10, -9, s * 1.5, 7, -11, IRON);
  thick(s * 1.5, 7, -11, s * 1, 4, -12, OBSIDIAN);
  block(s * 1, 3, -12, GOLD);
  // pedipalps
  thick(s * 3, 11, -7, s * 4, 8, -12, COPPER);
  sphere(s * 4, 7, -12.5, 1, GOLD);
}
// gold brow plate
cube(-1, 16, -9, 1, 16, -8, GOLD);

// ===== DORSAL MECHANISM =====
gear(0, 21, 1, 6, 'xy', GOLD, OBSIDIAN, 16, 6);
cube(0, 21, -1, 0, 21, 0, NEON_BLUE);
gear(8, 25, 1, 3, 'xy', IRON, GOLD, 8, 4);
gear(-7, 26, 1, 3, 'xy', IRON, GOLD, 8, 4);
// side gears on abdomen
gear(6, 16, 9, 4, 'yz', IRON, GOLD, 10, 4);
gear(-6, 16, 9, 4, 'yz', IRON, GOLD, 10, 4);

// smokestacks
cylinder(3, 20, 11, 1, 5, IRON);
cylinder(-3, 20, 11, 1, 4, IRON);
cube(2, 22, 10, 4, 22, 12, GOLD);
cube(-4, 22, 10, -2, 22, 12, GOLD);
block(3, 25, 11, STEAM);
block(3, 27, 11, STEAM);
block(-3, 24, 11, STEAM);
block(-3, 26, 11, STEAM);

// wind-up key
cube(-1, 22, 10, 0, 27, 11, GOLD);
for (const z of [10, 11]) {
  ringXY(-2.6, 29, z, 2.5, GOLD);
  ringXY(2.6, 29, z, 2.5, GOLD);
}

// ===== LEGS =====
const az = [-4, -1.5, 1.5, 4];
const ax = [4, 3.6, 3.2, 3];
const ay = [13, 14, 15, 15];
const ky = [24, 27, 26, 23];
const kz = [-11, -6, 3, 11];
const my = [10, 11, 10, 9];
const mz = [-15, -7, 6, 14];
const fz = [-17, -8, 7, 15];

for (const s of S) {
  for (let i = 0; i < 4; i++) {
    const A = [s * ax[i], ay[i], az[i]];
    const K = [s * 12, ky[i] + (s > 0 ? 0 : 1), kz[i]];
    const M = [s * 17, my[i], mz[i]];
    const F = [s * 19, 0, fz[i]];
    thick(A[0], A[1], A[2], K[0], K[1], K[2], IRON);
    thick(K[0], K[1], K[2], M[0], M[1], M[2], COPPER);
    thick(M[0], M[1], M[2], F[0], F[1], F[2], IRON);
    sphere(K[0], K[1], K[2], 2, GOLD);
    sphere(M[0], M[1], M[2], 1.5, GOLD);
    // knee gear facing the camera
    gear(K[0], K[1], K[2] - 2, 2.5, 'xy', i % 2 ? IRON : GOLD, OBSIDIAN, 8, 0);
    // foot pad
    cube(F[0] - 1, 0, F[2] - 1, F[0] + 1, 0, F[2] + 1, OBSIDIAN);
    // piston rods on front legs
    if (i < 2) line(K[0], K[1], K[2] - 1.5, M[0], M[1], M[2] - 1.5, GOLD);
  }
}

// ===== PLINTH GEAR =====
gear(0, 0, 0, 12, 'xz', IRON, GOLD, 18, 6);