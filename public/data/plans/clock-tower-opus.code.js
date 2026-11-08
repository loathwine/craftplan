// clock-tower-opus — prompt:
// a steampunk clock tower...

const M = new Map();
function P(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  M.delete(k);
  M.set(k, [x, y, z, id]);
}
function L(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) { const t = i / n; P(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id); }
}
function C(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) P(x, y, z, id);
}
function ring(h, y, idf) {
  for (let x = -h; x <= h; x++) for (let z = -h; z <= h; z++)
    if (Math.max(Math.abs(x), Math.abs(z)) === h) P(x, y, z, typeof idf === 'function' ? idf(x, y, z) : idf);
}
function hs(x, y, z) {
  let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177); n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}
// face mapper: p = wall plane distance, u = horizontal, d = outward offset
function F(face, p, u, y, d, id) {
  const q = p + d;
  if (face === 'N') P(u, y, -q, id);
  else if (face === 'S') P(-u, y, q, id);
  else if (face === 'E') P(q, y, -u, id);
  else P(-q, y, u, id);
}
function gear(put, r, teeth, id, hubId, spokes) {
  const R = Math.ceil(r + 1.5);
  for (let a = -R; a <= R; a++) for (let b = -R; b <= R; b++) {
    const d = Math.hypot(a, b), ang = Math.atan2(b, a);
    if (d <= 1.2) put(a, b, hubId);
    else if (d > r - 0.8 && d <= r + 0.5) put(a, b, id);
    else if (d > r + 0.5 && d <= r + 1.5 && Math.cos(ang * teeth) > 0.2) put(a, b, id);
    else if (spokes && d <= r - 0.8 && (a === 0 || b === 0)) put(a, b, id);
  }
}

// ---- clear trees in the footprint (AIR is free) ----
cylinder(0, 1, 0, 12, 7, AIR);
cube(-16, 1, -10, -7, 11, 7, AIR);
cube(8, 1, -12, 12, 11, -6, AIR);

// ---- plaza ----
for (let x = -10; x <= 10; x++) for (let z = -10; z <= 10; z++) {
  const d = Math.hypot(x, z);
  if (d > 10.5) continue;
  let id;
  if (d > 9.5) { id = STONE; P(x, -1, z, STONE); }
  else if (Math.abs(x) <= 1 && z < -6) id = LIGHT_GRAY;
  else if (Math.abs(d - 8.3) < 0.5) id = COPPER;
  else id = ((x + z) & 1) ? COBBLE : STONE;
  P(x, 0, z, id);
}

// ---- plinth + shaft ----
ring(6, 1, COBBLE); ring(6, 2, STONE);
for (let y = 1; y <= 12; y++) ring(5, y, (x, yy, z) => {
  if (Math.abs(x) === 5 && Math.abs(z) === 5) return (yy % 2) ? LIGHT_GRAY : GRAY;
  if (yy === 7) return IRON;
  return hs(x, yy, z) < 0.13 ? BROWN : BRICK;
});
for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (let y = 3; y <= 12; y++) {
  const id = y === 12 ? COPPER : GRAY;
  P(6 * sx, y, 6 * sz, id); P(6 * sx, y, 5 * sz, id); P(5 * sx, y, 6 * sz, id);
}
ring(6, 13, OBSIDIAN); ring(7, 13, COPPER);

// ---- front door ----
for (let x = -1; x <= 1; x++) for (let y = 1; y <= 2; y++) P(x, y, -6, AIR);
for (let x = -1; x <= 1; x++) for (let y = 1; y <= 3; y++) P(x, y, -5, BROWN);
P(0, 4, -5, BROWN); P(1, 2, -5, GOLD);
for (let y = 1; y <= 4; y++) { P(-2, y, -6, GOLD); P(2, y, -6, GOLD); }
P(-1, 4, -6, GOLD); P(1, 4, -6, GOLD); P(0, 5, -6, GOLD);

// ---- portholes ----
function porthole(face, cy) {
  for (let u = -2; u <= 2; u++) for (let v = -2; v <= 2; v++) {
    const r = Math.hypot(u, v);
    if (r <= 1.5) F(face, 5, u, cy + v, 0, GLASS);
    else if (r <= 2.3) F(face, 5, u, cy + v, 1, COPPER);
  }
  F(face, 5, 0, cy, -1, GLOWSTONE);
}
porthole('N', 9); porthole('S', 9); porthole('W', 9);

// ---- front pipes ----
for (const sx of [-1, 1]) {
  for (let y = 3; y <= 12; y++) P(4 * sx, y, -6, (y === 5 || y === 9) ? IRON : COPPER);
  P(4 * sx, 6, -7, RED);
}
P(4, 10, -7, WHITE);

// ---- clock stage ----
for (let y = 14; y <= 24; y++) ring(6, y, (y === 14 || y === 24) ? OBSIDIAN : GRAY);
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  for (let y = 14; y <= 24; y++) P(7 * sx, y, 7 * sz, y === 19 ? GOLD : COPPER);
}
function clock(face, cy) {
  for (let u = -6; u <= 6; u++) for (let v = -6; v <= 6; v++) {
    const r = Math.hypot(u, v);
    if (r <= 4.5) F(face, 6, u, cy + v, 1, WHITE);
    else if (r <= 5.5) F(face, 6, u, cy + v, 1, GOLD);
  }
  for (let k = 0; k < 12; k++) {
    const a = k * Math.PI / 6;
    F(face, 6, Math.round(Math.sin(a) * 3.7), cy + Math.round(Math.cos(a) * 3.7), 1, k % 3 === 0 ? BLACK : GRAY);
  }
  for (let v = 1; v <= 3; v++) F(face, 6, 0, cy + v, 1, BLACK);
  F(face, 6, 1, cy, 1, BLACK); F(face, 6, 2, cy, 1, BLACK);
  F(face, 6, 0, cy, 1, GOLD); F(face, 6, 0, cy, 2, GOLD);
}
['N', 'S', 'E', 'W'].forEach(f => clock(f, 19));

// ---- cornice + belfry ----
for (let x = -7; x <= 7; x++) for (let z = -7; z <= 7; z++)
  P(x, 25, z, Math.max(Math.abs(x), Math.abs(z)) === 7 ? COPPER : OBSIDIAN);
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  P(7 * sx, 26, 7 * sz, GOLD);
  for (let y = 26; y <= 27; y++) { P(6 * sx, y, 6 * sz, BRICK); P(5 * sx, y, 6 * sz, BRICK); P(6 * sx, y, 5 * sz, BRICK); }
}
for (let y = 26; y <= 27; y++) { P(0, y, 6, IRON); P(0, y, -6, IRON); P(6, y, 0, IRON); P(-6, y, 0, IRON); }
ring(6, 28, BRICK);
for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++) P(x, 26, z, GOLD);
P(1, 27, 0, GOLD); P(-1, 27, 0, GOLD); P(0, 27, 1, GOLD); P(0, 27, -1, GOLD); P(0, 27, 0, GOLD);
P(0, 28, 0, GOLD);
for (let y = 29; y <= 31; y++) P(0, y, 0, IRON);
// steam vents on cornice
P(7, 26, 0, COPPER); P(-7, 26, 0, COPPER);
P(7, 27, 0, STEAM); P(-7, 27, 0, STEAM);

// ---- roof ----
const layers = [[29, 7], [30, 5], [31, 3], [32, 1]];
for (let i = 0; i < layers.length; i++) {
  const [y, h] = layers[i];
  const inner = i + 1 < layers.length ? layers[i + 1][1] : -1;
  for (let x = -h; x <= h; x++) for (let z = -h; z <= h; z++) {
    const m = Math.max(Math.abs(x), Math.abs(z));
    if (m <= inner) continue;
    let id = Math.abs(x) === Math.abs(z) ? GOLD : COPPER;
    if (y === 29 && m === 7) id = IRON;
    if (y === 32) id = GOLD;
    P(x, y, z, id);
  }
}
for (const sx of [-1, 1]) for (const sz of [-1, 1]) P(7 * sx, 30, 7 * sz, GOLD);
P(0, 33, 0, ELECTRIC);

// ---- east gears ----
gear((a, b, id) => P(7, 7 + b, -1 + a, id), 4, 10, COPPER, GOLD, true);
gear((a, b, id) => P(7, 4 + b, 6 + a, id), 2, 6, IRON, COPPER, false);
P(6, 7, -1, IRON);

// ---- boiler house (west) ----
for (let y = 1; y <= 5; y++) for (let x = -14; x <= -8; x++) for (let z = -3; z <= 5; z++) {
  if (!(x === -14 || x === -8 || z === -3 || z === 5)) continue;
  const corner = (x === -14 || x === -8) && (z === -3 || z === 5);
  P(x, y, z, corner || y === 5 ? OAK_LOG : (hs(x, y, z) < 0.15 ? BROWN : BRICK));
}
for (let k = 0; k <= 4; k++) for (let x = -15; x <= -7; x++) { P(x, 6 + k, -4 + k, BROWN); P(x, 6 + k, 6 - k, BROWN); }
for (let x = -15; x <= -7; x++) P(x, 11, 1, COPPER);
for (let k = 0; k <= 4; k++) for (let z = -3 + k; z <= 5 - k; z++) { P(-14, 6 + k, z, PLANKS); P(-8, 6 + k, z, PLANKS); }
// house smokestack
for (let y = 6; y <= 16; y++) {
  const id = y === 16 ? COPPER : BRICK;
  P(-13, y, 2, id); P(-11, y, 2, id); P(-12, y, 1, id); P(-12, y, 3, id);
}
P(-12, 16, 2, STEAM); P(-12, 17, 2, STEAM);

// boiler
for (let x = -15; x <= -9; x++) for (let dy = -2; dy <= 2; dy++) for (let dz = -2; dz <= 2; dz++)
  if (dy * dy + dz * dz <= 4.84) P(x, 3 + dy, -7 + dz, (x === -14 || x === -12 || x === -10) ? COPPER : IRON);
P(-16, 3, -7, GOLD); P(-16, 2, -7, COPPER); P(-16, 4, -7, COPPER); P(-16, 3, -8, COPPER); P(-16, 3, -6, COPPER);
P(-8, 2, -7, LAVA); P(-8, 3, -7, OBSIDIAN); P(-8, 2, -8, OBSIDIAN); P(-8, 2, -6, OBSIDIAN); P(-8, 1, -7, OBSIDIAN);
P(-12, 4, -10, WHITE);
P(-14, 6, -7, IRON); P(-14, 7, -7, RED);
for (let y = 6; y <= 10; y++) P(-12, y, -7, IRON);
P(-12, 11, -7, COPPER); P(-12, 12, -7, STEAM);
// steam pipe into the tower
P(-10, 6, -7, COPPER);
L(-9, 6, -7, -7, 6, -7, COPPER);
P(-7, 6, -6, COPPER);
P(-8, 7, -8, STEAM);

// ---- tesla coil (northeast foreground) ----
C(9, 1, -10, 11, 1, -8, OBSIDIAN);
for (let y = 2; y <= 7; y++) P(10, y, -9, COPPER);
for (const y of [3, 5]) { P(9, y, -9, IRON); P(11, y, -9, IRON); P(10, y, -10, IRON); P(10, y, -8, IRON); }
for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++)
  if (dx * dx + dy * dy + dz * dz <= 2.25) P(10 + dx, 9 + dy, -9 + dz, IRON);
P(10, 11, -9, ELECTRIC); P(12, 9, -9, ELECTRIC); P(8, 10, -10, ELECTRIC);

// ---- lampposts flanking the path ----
for (const sx of [-1, 1]) {
  for (let y = 1; y <= 4; y++) P(3 * sx, y, -9, BLACK);
  P(3 * sx, 5, -9, GLOWSTONE); P(3 * sx, 6, -9, BLACK);
}

// ---- moored airship (southeast, behind) ----
const AX = 15, AY = 27, AZ = 12;
function inside(x, y, z) {
  return ((x - AX) / 6.4) ** 2 + ((y - AY) / 3.4) ** 2 + ((z - AZ) / 3.4) ** 2 <= 1;
}
for (let x = 8; x <= 22; x++) for (let y = 23; y <= 31; y++) for (let z = 8; z <= 16; z++) {
  if (!inside(x, y, z)) continue;
  if (inside(x + 1, y, z) && inside(x - 1, y, z) && inside(x, y + 1, z) && inside(x, y - 1, z) && inside(x, y, z + 1) && inside(x, y, z - 1)) continue;
  let id = ((x - AX) % 3 === 0) ? BROWN : SAND;
  if (x <= 10) id = COPPER;
  P(x, y, z, id);
}
// tail fins
for (const [x, y] of [[19, 30], [20, 30], [21, 30], [22, 30], [20, 31], [21, 31], [22, 31], [21, 32], [22, 32]]) {
  P(x, y, 12, COPPER); P(x, 2 * AY - y, 12, COPPER);
}
for (let x = 19; x <= 22; x++) { P(x, 27, 8, COPPER); P(x, 27, 16, COPPER); }
P(21, 27, 7, COPPER); P(22, 27, 7, COPPER); P(21, 27, 17, COPPER); P(22, 27, 17, COPPER);
// gondola
C(11, 20, 11, 18, 20, 13, PLANKS);
for (let x = 11; x <= 18; x++) { P(x, 21, 11, BROWN); P(x, 21, 13, BROWN); }
P(11, 21, 12, BROWN); P(18, 21, 12, BROWN);
P(13, 21, 11, GLOWSTONE); P(16, 21, 11, GLOWSTONE);
P(10, 21, 12, GOLD); P(10, 20, 12, GOLD);
for (const x of [12, 17]) for (const z of [11, 13])
  for (let y = 22; y <= 25; y++) if (!inside(x, y, z)) P(x, y, z, BLACK);
// propeller
P(19, 21, 12, IRON);
for (const [y, z] of [[22, 12], [23, 12], [20, 12], [19, 12], [21, 11], [21, 10], [21, 13], [21, 14]]) P(19, y, z, IRON);
P(20, 21, 12, STEAM);
// mooring line to the tower
L(10, 21, 12, 8, 25, 8, BLACK);

// ---- emit ----
let solid = 0;
for (const v of M.values()) {
  if (v[3] !== AIR) { if (solid >= 3990) continue; solid++; }
  block(v[0], v[1], v[2], v[3]);
}