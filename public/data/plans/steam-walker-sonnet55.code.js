// steam-walker-sonnet55 — prompt:
// a steam-powered walking machine...

const AIR_ = AIR;
const MAXB = 3950;
const G = new Map();
const R = Math.round;
function P(x, y, z, id) {
  x = R(x); y = R(y); z = R(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (!G.has(k) && G.size >= MAXB) return;
  G.set(k, [x, y, z, id]);
}
function B(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) P(x, y, z, id);
}
function hash(a, b, c) {
  let h = Math.imul(a + 101, 374761393) ^ Math.imul(b + 57, 668265263) ^ Math.imul(c + 13, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) % 1000 / 1000;
}
function tube(a, b, r, idf) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(d * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = R(a[0] + (b[0] - a[0]) * t), cy = R(a[1] + (b[1] - a[1]) * t), cz = R(a[2] + (b[2] - a[2]) * t);
    const id = typeof idf === 'function' ? idf(i, t) : idf;
    for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) for (let dz = -r; dz <= r; dz++)
      if (dx * dx + dy * dy + dz * dz <= r * r + 1) P(cx + dx, cy + dy, cz + dz, id);
  }
}
function discXY(cx, cy, z, rmax, id, rmin = -1) {
  const Rr = Math.ceil(rmax);
  for (let dx = -Rr; dx <= Rr; dx++) for (let dy = -Rr; dy <= Rr; dy++) {
    const d = Math.hypot(dx, dy);
    if (d <= rmax && d > rmin) P(cx + dx, cy + dy, z, id);
  }
}
function discYZ(x, cy, cz, rmax, id, rmin = -1) {
  const Rr = Math.ceil(rmax);
  for (let dy = -Rr; dy <= Rr; dy++) for (let dz = -Rr; dz <= Rr; dz++) {
    const d = Math.hypot(dy, dz);
    if (d <= rmax && d > rmin) P(x, cy + dy, cz + dz, id);
  }
}
function sph(cx, cy, cz, r, id, rin = -1, halfUp = false) {
  const Rr = Math.ceil(r);
  for (let dx = -Rr; dx <= Rr; dx++) for (let dy = (halfUp ? 0 : -Rr); dy <= Rr; dy++) for (let dz = -Rr; dz <= Rr; dz++) {
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d <= r && d > rin) P(cx + dx, cy + dy, cz + dz, id);
  }
}
function gearYZ(cx, cy, cz, r, id, hub) {
  for (let dy = -r - 1; dy <= r + 1; dy++) for (let dz = -r - 1; dz <= r + 1; dz++) {
    const d = Math.hypot(dy, dz);
    if (Math.abs(d - r) <= 0.6) P(cx, cy + dy, cz + dz, id);
    else if (d < r && (dy === 0 || dz === 0 || Math.abs(dy) === Math.abs(dz))) P(cx, cy + dy, cz + dz, id);
  }
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4;
    P(cx, cy + R((r + 1.4) * Math.sin(a)), cz + R((r + 1.4) * Math.cos(a)), id);
  }
  P(cx, cy, cz, hub);
}

// ---------- clear the site (trees) ----------
cube(-12, 0, -16, 12, 8, 12, AIR);
cube(-16, 0, -17, -22 + 38, 0, -17, AIR_); // harmless thin strip
const legs = [
  { s: -1, zz: -7, K: [-15, 22, -9], F: [-19, 0, -13], ang: 0.8 },
  { s: 1, zz: -7, K: [15, 24, -10], F: [19, 8, -17], ang: 2.2 },
  { s: -1, zz: 7, K: [-15, 22, 9], F: [-19, 0, 13], ang: 4.0 },
  { s: 1, zz: 7, K: [15, 22, 9], F: [19, 0, 13], ang: 5.3 },
];
for (const L of legs) if (L.F[1] === 0) cube(L.F[0] - 3, 0, L.F[2] - 4, L.F[0] + 3, 7, L.F[2] + 3, AIR);

// ---------- chassis ----------
for (const s of [-1, 1]) {
  B(s * 3, 14, -9, s * 8, 14, 9, PLANKS);
  B(s * 8, 13, -9, s * 8, 13, 15, GRAY);
  B(s * 7, 13, -9, s * 7, 13, 9, GRAY);
}
for (let z = -9; z <= 9; z += 4) B(-8, 13, z, 8, 13, z, GRAY);
B(-6, 14, 10, 6, 14, 15, PLANKS);
B(-6, 13, 10, -6, 13, 15, GRAY); B(6, 13, 10, 6, 13, 15, GRAY);
B(-6, 13, 15, 6, 13, 15, GRAY);
B(-2, 14, -9, 2, 14, 9, GRAY);

// ---------- cowcatcher plow ----------
for (let k = 0; k < 5; k++) {
  const w = 6 - k, z = -10 - k, y0 = 11 + Math.floor(k * 0.5);
  B(-w, y0, z, w, 14, z, IRON);
  B(-w, 14, z, w, 14, z, COPPER);
}
tube([-6, 14, -10], [0, 11, -14], 0, GOLD);
tube([6, 14, -10], [0, 11, -14], 0, GOLD);
for (let x = -4; x <= 4; x += 2) P(x, 13, -11, GOLD);
// headlamps
for (const s of [-1, 1]) {
  sph(s * 6, 17, -10, 1, GOLD);
  P(s * 6, 17, -11, GLOWSTONE);
  tube([s * 6, 15, -10], [s * 6, 16, -10], 0, IRON);
}

// ---------- legs ----------
for (const L of legs) {
  const { s, zz, K, F } = L;
  const ankle = [F[0], F[1] + 2, F[2]];
  const hip = [s * 10, 16, zz];
  // bracket from deck to hip
  tube([s * 7, 16, zz], hip, 1, GRAY);
  tube(hip, K, 1, (i) => (Math.floor(i / 5) % 2 === 0 ? IRON : GRAY));
  // knee
  sph(K[0], K[1], K[2], 2, COPPER);
  discYZ(K[0] + s * 2, K[1], K[2], 1.5, GOLD);
  // shin
  tube(K, ankle, 1, (i) => (Math.floor(i / 5) % 2 === 0 ? IRON : GRAY));
  // ankle + foot
  sph(ankle[0], ankle[1], ankle[2], 1.5, COPPER);
  B(F[0] - 2, F[1] - 1, F[2] - 2, F[0] + 2, F[1], F[2] + 2, GRAY);
  B(F[0] - 1, F[1], F[2] - 1, F[0] + 1, F[1], F[2] + 1, IRON);
  B(F[0] - 2, F[1] - 1, F[2] - 3, F[0] + 2, F[1] - 1, F[2] - 3, BLACK);
  // hip gear + axle
  gearYZ(s * 9, 16, zz, 3, GOLD, COPPER);
  tube([s * 7, 16, zz], [s * 10, 16, zz], 0, GOLD);
  // connecting rod
  const ry = 16 + R(3 * Math.sin(L.ang)), rz = zz + R(3 * Math.cos(L.ang));
  const S = [K[0] + (F[0] - K[0]) * 0.3 + s * 2, K[1] + (ankle[1] - K[1]) * 0.3, K[2] + (F[2] - K[2]) * 0.3];
  tube([s * 10, ry, rz], S, 0, COPPER);
  P(s * 10, ry, rz, GOLD); P(S[0], S[1], S[2], GOLD);
  const mid = [(s * 10 + S[0]) / 2, (ry + S[1]) / 2, (rz + S[2]) / 2];
  P(mid[0], mid[1], mid[2], GOLD);
  // steam hose arching to knee
  const A = [s * 6, 22, zz * 0.7], E = [K[0], K[1] + 2, K[2]];
  const n = 22;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = A[0] + (E[0] - A[0]) * t, y = A[1] + (E[1] - A[1]) * t + 3 * Math.sin(Math.PI * t), z = A[2] + (E[2] - A[2]) * t;
    P(x, y, z, i % 6 === 0 ? GOLD : COPPER);
  }
  P(K[0], K[1] + 5, K[2], STEAM);
}

// ---------- boiler ----------
for (let z = -8; z <= 8; z++) discXY(0, 20, z, 5.2, COPPER, 4.2);
for (const z of [-5, -1, 3, 7]) discXY(0, 20, z, 6.1, IRON, 5.2);
discXY(0, 20, -9, 5.2, COPPER);
discXY(0, 20, -10, 5.2, GOLD, 4.2);
discXY(0, 20, 9, 5.2, IRON);
discXY(0, 20, 10, 2.5, GRAY); // rear hatch
discXY(0, 20, 10, 1.2, GOLD);
// rivets around front
for (let k = 0; k < 14; k++) {
  const a = k * 2 * Math.PI / 14;
  P(R(3.7 * Math.cos(a)), 20 + R(3.7 * Math.sin(a)), -10, GOLD);
}
// furnace porthole
discXY(0, 19, -8, 2.3, ORANGE);
discXY(0, 19, -8, 1.5, LAVA);
discXY(0, 19, -9, 2.3, GLASS);
discXY(0, 19, -10, 3.2, IRON, 2.3);
// gauges
for (const sx of [-1, 1]) {
  const gx = sx * 2.6, gy = 23.4;
  discXY(R(gx), R(gy), -10, 1.9, GOLD, 1.2);
  discXY(R(gx), R(gy), -10, 1.2, WHITE);
  P(R(gx), R(gy), -10, BLACK);
  P(R(gx) + sx, R(gy) + 1, -10, RED);
}

// ---------- steam cylinders on boiler sides ----------
for (const s of [-1, 1]) {
  tube([s * 7, 18, -5], [s * 7, 18, 0], 1, COPPER);
  B(s * 6, 17, -6, s * 8, 19, -6, GOLD);
  B(s * 6, 17, 1, s * 8, 19, 1, GOLD);
  tube([s * 7, 18, -9], [s * 7, 18, -6], 0, IRON);
  B(s * 7, 17, -9, s * 7, 19, -9, GOLD);
  tube([s * 5, 21, -2], [s * 7, 19, -2], 0, COPPER);
  // water barrels on deck
  for (const bz of [4, 9]) {
    B(s * 6 - 1, 15, bz - 1, s * 6 + 1, 16, bz + 1, OAK_LOG);
    B(s * 6 - 1, 15, bz - 1, s * 6 + 1, 15, bz - 1, IRON);
    B(s * 6 - 1, 15, bz + 1, s * 6 + 1, 15, bz + 1, IRON);
  }
}
// deck railings
for (const s of [-1, 1]) {
  for (const z of [-9, -5, -1, 3, 11, 15]) tube([s * 8, 15, z], [s * 8, 16, z], 0, IRON);
  tube([s * 8, 16, -9], [s * 8, 16, 15], 0, IRON);
}

// ---------- cockpit ----------
{
  const cx = 0, cy = 26, cz = -3;
  for (let dx = -5; dx <= 5; dx++) for (let dy = 0; dy <= 5; dy++) for (let dz = -5; dz <= 5; dz++) {
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d > 3.4 && d <= 4.2) {
      const rib = (dx === 0 || dz === 0 || dy === 0);
      P(cx + dx, cy + dy, cz + dz, rib ? IRON : GLASS);
    }
  }
  B(-1, 26, -4, 0, 27, -3, BROWN);
  B(-1, 28, -4, 0, 29, -3, PINK);
  B(-1, 29, -4, 0, 29, -4, YELLOW);
  P(-2, 27, -4, BROWN); P(1, 27, -4, BROWN);
  B(-1, 26, -5, 0, 26, -5, GRAY);
  P(-1, 27, -5, RED); P(0, 27, -5, GREEN);
  // flag
  tube([0, 31, -3], [0, 33, -3], 0, IRON);
  B(1, 32, -3, 3, 33, -3, RED);
}

// ---------- steam dome + valve ----------
sph(0, 25, 4, 2.7, GOLD, -1, true);
tube([0, 28, 4], [0, 30, 4], 0, IRON);
P(0, 30, 4, GOLD);
P(0, 31, 4, STEAM);

// ---------- smokestacks ----------
function stack(cx, cz, top) {
  for (let y = 23; y <= top - 2; y++) {
    const id = (y % 5 === 0) ? GOLD : IRON;
    B(cx - 1, y, cz - 1, cx + 1, y, cz + 1, id);
  }
  for (let y = top - 1; y <= top; y++)
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++)
      if (dx * dx + dz * dz <= 5.3 && !(y === top && dx === 0 && dz === 0)) P(cx + dx, y, cz + dz, BLACK);
  P(cx, top, cz, GRAY);
  P(cx, top + 1, cz, STEAM);
}
stack(-3, 7, 31);
stack(3, 7, 28);
// stack braces
tube([-3, 24, 5], [-1, 26, 3], 0, COPPER);
tube([3, 24, 5], [1, 26, 3], 0, COPPER);
P(-3, 33, 7, STEAM);

// ---------- coal tender ----------
{
  for (let y = 15; y <= 19; y++) {
    B(-5, y, 10, -5, y, 15, PLANKS); B(5, y, 10, 5, y, 15, PLANKS);
    B(-5, y, 10, 5, y, 10, PLANKS); B(-5, y, 15, 5, y, 15, PLANKS);
  }
  for (const x of [-5, 5]) for (const z of [10, 15]) B(x, 15, z, x, 20, z, IRON);
  B(-5, 17, 10, 5, 17, 10, IRON); B(-5, 17, 15, 5, 17, 15, IRON);
  B(-4, 19, 11, 4, 19, 14, BLACK);
  for (let x = -4; x <= 4; x++) for (let z = 11; z <= 14; z++) {
    const h = hash(x, 1, z);
    if (h > 0.55) P(x, 20, z, BLACK);
    if (h > 0.85) P(x, 21, z, BLACK);
    if (h < 0.08) P(x, 20, z, GRAY);
  }
  tube([0, 15, 9], [0, 15, 10], 0, GOLD);
  tube([3, 20, 11], [5, 23, 13], 0, OAK_LOG); // shovel
  P(5, 24, 13, IRON);
  P(-5, 21, 15, GLOWSTONE);
}

// ---------- rails in front ----------
for (let z = -21; z <= -10; z++) {
  P(-2, 0, z, IRON); P(2, 0, z, IRON);
  if (z % 2 === 0) B(-3, -1, z, 3, -1, z, PLANKS);
}

// ---------- props ----------
B(-11, 0, -14, -9, 2, -12, PLANKS);
B(-11, 2, -14, -9, 2, -12, OAK_LOG);
B(-8, 0, -14, -7, 1, -13, PLANKS);
B(-10, 3, -13, -9, 4, -12, PLANKS);
for (const [bx, bz] of [[-5, -15], [-6, -12]]) {
  B(bx - 1, 0, bz - 1, bx + 1, 2, bz + 1, OAK_LOG);
  B(bx - 1, 1, bz - 1, bx + 1, 1, bz + 1, IRON);
  B(bx - 1, 3, bz - 1, bx + 1, 3, bz + 1, PLANKS);
}
// coal pile
for (let x = 8; x <= 13; x++) for (let z = -15; z <= -11; z++) {
  const h = R(3 - Math.hypot(x - 10.5, z + 13) * 1.0 + hash(x, 5, z) * 1.2);
  for (let y = 0; y < h; y++) P(x, y, z, hash(x, y, z) > 0.9 ? GRAY : BLACK);
}
tube([13, 1, -11], [15, 4, -13], 0, OAK_LOG);
P(15, 5, -13, IRON);
// lamp post
tube([-9, 0, -9], [-9, 7, -9], 0, IRON);
tube([-9, 7, -9], [-7, 7, -9], 0, IRON);
B(-7, 5, -9, -7, 6, -9, GLASS);
P(-7, 5, -9, GLOWSTONE);
P(-7, 7, -9, GOLD);
// cobble path
for (let z = -22; z <= -17; z++) for (let x = -3; x <= 3; x++)
  if (hash(x, 9, z) > 0.45) P(x, -1, z, hash(x, 3, z) > 0.5 ? COBBLE : STONE);

// ---------- emit ----------
G.forEach((v) => block(v[0], v[1], v[2], v[3]));