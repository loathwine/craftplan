// grim-reaper-sonnet55 — prompt:
// the Grim Reaper with his scythe...

const V = new Map();
let PRI = 0;
const key = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  if (id === AIR) { V.delete(key(x, y, z)); return; }
  V.set(key(x, y, z), [x, y, z, id, PRI]);
}
const has = (x, y, z) => V.has(key(Math.round(x), Math.round(y), Math.round(z)));
function hs(x, y, z) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}
function sph(cx, cy, cz, r, id, fn) {
  const R = Math.ceil(r);
  for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) for (let z = -R; z <= R; z++) {
    if (x * x + y * y + z * z <= r * r) {
      const X = Math.round(cx + x), Y = Math.round(cy + y), Z = Math.round(cz + z);
      put(X, Y, Z, fn ? fn(X, Y, Z) : id);
    }
  }
}
function tline(x1, y1, z1, x2, y2, z2, r, id, fn) {
  const d = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
  const n = Math.ceil(d * 2);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    sph(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, r, id, fn);
  }
}
function frontZ(x, y) {
  for (let z = -14; z <= 14; z++) if (has(x, y, z)) return z;
  return 0;
}
const robeCol = (x, y, z) => {
  const h = hs(x, y, z);
  if (h < 0.04) return GRAY;
  if (Math.floor(Math.atan2(z, x) * 9 + 50) % 3 === 0) return OBSIDIAN;
  return BLACK;
};

// ---------- site clearing (trees / leaves) ----------
cube(-14, 1, -13, 15, 8, 6, AIR);
cube(-5, 1, 7, 18, 8, 9, AIR);

// ---------- ground: haunted mound ----------
PRI = 0;
for (let x = -15; x <= 15; x++) for (let z = -14; z <= 14; z++) {
  const d = Math.hypot(x, z);
  const lim = 12.5 + 1.5 * Math.sin(Math.atan2(z, x) * 3) + hs(x, 0, z) * 1.2;
  if (d <= lim) {
    const h = hs(x, 1, z);
    put(x, 0, z, h < 0.5 ? GRASS : h < 0.82 ? DIRT : h < 0.93 ? COBBLE : GRAY);
  }
}
// summoning circle
for (let a = 0; a < 360; a += 2) {
  const r = a * Math.PI / 180;
  if (Math.floor(a / 15) % 2 === 0) put(Math.cos(r) * 10, 0, Math.sin(r) * 10, PURPLE);
  put(Math.cos(r) * 8.6, 0, Math.sin(r) * 8.6, MAGENTA);
}
for (let k = 0; k < 8; k++) {
  const r = k * Math.PI / 4;
  for (let s = 3; s <= 8; s++) put(Math.cos(r) * s * 1.05, 0, Math.sin(r) * s * 1.05, hs(k, s, 3) < 0.6 ? PURPLE : OBSIDIAN);
}

// ---------- moon backdrop ----------
for (let x = -9; x <= 9; x++) for (let y = -9; y <= 9; y++) {
  const d = Math.hypot(x, y);
  if (d <= 8.6) {
    const cr = Math.hypot(x - 3, y - 2) < 2 || Math.hypot(x + 3, y + 3) < 1.6 || Math.hypot(x + 2, y - 4) < 1.2;
    const c = cr ? LIGHT_GRAY : (d > 7.4 ? MARBLE : WHITE);
    put(x - 2, y + 22, 19, c);
  }
}

// ---------- dead tree ----------
cube(14, 1, 6, 15, 7, 7, OAK_LOG);
cube(14, 8, 6, 14, 12, 6, OAK_LOG);
cube(13, 1, 6, 13, 2, 6, OAK_LOG); cube(16, 1, 7, 16, 1, 7, OAK_LOG); cube(15, 1, 8, 15, 2, 8, OAK_LOG);
[[14, 9, 6, 19, 14, 4], [14, 10, 6, 10, 15, 9], [14, 7, 6, 19, 9, 9], [14, 11, 6, 15, 17, 6],
 [19, 14, 4, 21, 17, 3], [10, 15, 9, 8, 19, 10], [15, 17, 6, 12, 20, 5], [17, 11, 7, 20, 12, 10]].forEach(a => {
  tline(a[0], a[1], a[2], a[3], a[4], a[5], 0.7, OAK_LOG);
});

// ---------- graveyard ----------
PRI = 1;
function stone(x, z, h, w, c) {
  cube(x - w, 1, z, x + w, h, z + 1, c);
  put(x - w, h, z, AIR); put(x + w, h, z, AIR); put(x - w, h, z + 1, AIR); put(x + w, h, z + 1, AIR);
  put(x, h - 1, z - 1, GRAY); put(x, h - 2, z - 1, GRAY); put(x - 1, h - 2, z - 1, GRAY);
  cube(x - w - 1, 1, z - 1, x + w + 1, 1, z + 2, COBBLE);
  put(x, h + 1, z, c);
}
function cross(x, z, h, c) {
  cube(x, 1, z, x, h, z + 1, c);
  cube(x - 1, h - 2, z, x + 1, h - 2, z + 1, c);
  cube(x - 2, 1, z - 1, x + 2, 1, z + 2, COBBLE);
}
stone(-9, -9, 5, 1, STONE);
stone(-14, -7, 4, 1, GRAY);
cross(-13, -3, 6, STONE);
stone(11, -9, 4, 1, STONE);
cross(14, -4, 5, COBBLE);
stone(5, -12, 3, 1, GRAY);
stone(-4, -12, 3, 1, STONE);
cross(-12, 3, 5, GRAY);
stone(13, 2, 4, 1, STONE);
cube(-10, 1, -7, -8, 1, -5, DIRT);
cube(10, 1, -7, 12, 1, -5, DIRT);
[[-7, -10], [6, -9], [-11, -6], [12, -7], [-3, -9]].forEach(([x, z]) => { put(x, 1, z, WHITE); put(x, 2, z, FIRE); });
function skull(x, z) {
  cube(x, 1, z, x + 1, 2, z + 1, WHITE);
  put(x, 2, z, BLACK); put(x + 1, 2, z, BLACK);
}
skull(-5, -6); skull(4, -7); skull(-11, 0); skull(9, -3); skull(-1, -8);
for (let i = 0; i < 14; i++) {
  const x = Math.round((hs(i, 1, 1) - 0.5) * 24), z = Math.round(-12 + hs(i, 2, 2) * 18);
  if (Math.hypot(x, z) > 9.5 && Math.hypot(x, z) < 13) put(x, 1, z, hs(i, 3, 3) < 0.5 ? WHITE : LIGHT_GRAY);
}
for (let x = -14; x <= -6; x += 2) { cube(x, 1, -13, x, 3, -13, IRON); put(x, 4, -13, IRON); }
line(-14, 2, -13, -6, 2, -13, IRON);

// ---------- robe ----------
PRI = 2;
const prof = [0, 8.8, 8.2, 7.6, 7.1, 6.7, 6.3, 6.0, 5.7, 5.4, 5.2, 5.2, 5.4, 5.8, 6.2, 5.6, 4.6, 3.8];
for (let y = 1; y <= 17; y++) {
  const rx = prof[y];
  const rz = y >= 13 ? rx * 0.8 : rx * 0.72;
  const R = Math.ceil(rx);
  for (let ix = -R; ix <= R; ix++) for (let iz = -R; iz <= R; iz++) {
    const d = (ix / rx) ** 2 + (iz / rz) ** 2;
    if (d > 1) continue;
    const d2 = (ix / (rx - 1.4)) ** 2 + (iz / (rz - 1.4)) ** 2;
    const solid = y <= 1 || y >= 14;
    if (!solid && d2 <= 1) continue;
    if (y <= 4 && d > 0.55 && hs(ix, y, iz) < (5 - y) * 0.075) continue;
    let c = robeCol(ix, y, iz);
    if (y === 1 && d > 0.7 && hs(ix, 9, iz) < 0.65) c = PURPLE;
    put(ix, y, iz, c);
  }
}
for (let i = 0; i < 40; i++) {
  const a = hs(i, 3, 4) * Math.PI * 2, r = 8.5 + hs(i, 5, 6) * 2.4;
  put(Math.cos(a) * r, 1, Math.sin(a) * r * 0.85, hs(i, 7, 8) < 0.5 ? BLACK : OBSIDIAN);
}
// flowing tattered streamers
const strands = [
  [-6, 11, 1, -14, 9, 7], [-6, 7, 2, -15, 5, 6], [-5.5, 13, 2, -12, 14, 8],
  [-6.5, 4, 0, -15, 3, 2], [6, 8, 2, 13, 5, 7],
];
strands.forEach(([x1, y1, z1, x2, y2, z2], i) => {
  const n = 28;
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const x = x1 + (x2 - x1) * t, z = z1 + (z2 - z1) * t;
    const y = y1 + (y2 - y1) * t + 1.6 * Math.sin(t * 6 + i);
    const wd = t < 0.6 ? 2 : 1;
    for (let w = 0; w < wd; w++) put(x, Math.max(1, y + w), z, t > 0.75 ? OBSIDIAN : BLACK);
  }
});

// belt + skull buckle
for (let ix = -8; ix <= 8; ix++) for (let iz = -8; iz <= 8; iz++) {
  const rx = prof[8] + 0.7, rz = prof[8] * 0.72 + 0.7;
  const d = (ix / rx) ** 2 + (iz / rz) ** 2;
  const d2 = (ix / (rx - 1.1)) ** 2 + (iz / (rz - 1.1)) ** 2;
  if (d <= 1 && d2 > 1) put(ix, 8, iz, BROWN);
}
const bz = frontZ(0, 8) - 1;
cube(-1, 7, bz, 1, 9, bz, WHITE);
put(-1, 9, bz, BLACK); put(1, 9, bz, BLACK); put(0, 8, bz, BLACK);
put(-1, 7, bz, BLACK); put(1, 7, bz, BLACK);
for (let y = 3; y <= 7; y++) put(2, y, frontZ(2, y) - 1, BROWN);
for (let y = 4; y <= 7; y++) put(3, y, frontZ(3, y) - 1, BROWN);
put(2, 2, frontZ(2, 3) - 1, GOLD);

// exposed ribcage in the V-neck
[[10, 0], [11, 1], [12, 1], [13, 2], [14, 2]].forEach(([y, hw]) => {
  for (let x = -hw; x <= hw; x++) {
    const z = frontZ(x, y);
    put(x, y, z, (y % 2 === 0 || x === 0) ? WHITE : BLACK);
    put(x, y, z + 1, BLACK);
  }
});

// ---------- head ----------
sph(0, 21, -0.5, 5, BLACK, (x, y, z) => hs(x, y, z) < 0.1 ? OBSIDIAN : BLACK);
for (let k = 0; k <= 5; k++) sph(0, 25.5 + k * 0.7, k * 1.0, 2.6 - k * 0.38, BLACK, (x, y, z) => hs(x, y, z) < 0.12 ? OBSIDIAN : BLACK);
// hood opening
sph(0, 21.3, -4.7, 3.9, AIR);
// skull
sph(0, 21, -1.2, 3.3, WHITE, (x, y, z) => hs(x, y, z) < 0.14 ? LIGHT_GRAY : WHITE);
cube(-2, 17, -3, 2, 18, -1, WHITE);
[[-2, 22], [-1, 22], [1, 22], [2, 22], [-2, 23], [-1, 23], [1, 23], [2, 23]].forEach(([x, y]) => {
  const z = frontZ(x, y);
  put(x, y, z, AIR);
  put(x, y, z + 1, BLACK);
  put(x, y, z + 2, BLACK);
});
[[-1, 22], [-2, 23], [1, 22], [2, 23]].forEach(([x, y]) => put(x, y, frontZ(x, y), NEON_BLUE));
[19, 20].forEach(y => { const z = frontZ(0, y); put(0, y, z, AIR); put(0, y, z + 1, BLACK); });
[-3, 3].forEach(x => { const z = frontZ(x, 20); put(x, 20, z, BLACK); put(x, 21, z, GRAY); });
for (let x = -2; x <= 2; x++) { put(x, 18, -3, x % 2 === 0 ? WHITE : BLACK); put(x, 17, -3, LIGHT_GRAY); }
cube(-1, 16, -3, 1, 16, -2, WHITE);

// ---------- arms ----------
tline(5, 14, -0.5, 8, 10.5, 0.5, 1.8, BLACK, robeCol);
tline(8, 10.5, 0.5, 9, 10, -0.8, 1.6, BLACK, robeCol);
sph(9.5, 7.5, 0.5, 1.9, BLACK, robeCol);
tline(-5, 14, -0.5, -8, 11.5, -3, 1.8, BLACK, robeCol);
tline(-8, 11.5, -3, -9, 11, -5.5, 1.7, BLACK, robeCol);
sph(-9.2, 8.3, -5.5, 1.9, BLACK, robeCol);
sph(-9, 11, -5.8, 2.0, PURPLE, (x, y, z) => (y === 12 || y === 10) ? PURPLE : robeCol(x, y, z));

// ---------- scythe ----------
for (let y = 0; y <= 27; y++) put(9, y, -2, y % 6 === 3 ? OAK_LOG : OBSIDIAN);
put(9, -1, -2, IRON);
put(9, 0, -2, IRON); put(9, 1, -2, GOLD);
cube(8, 27, -3, 10, 28, -1, GOLD);
cube(8, 18, -3, 10, 18, -1, GOLD);
cube(8, 5, -3, 10, 5, -1, GOLD);
for (let i = 0; i <= 120; i++) {
  const t = i / 120;
  const xe = Math.round(9 - 16 * t);
  const ye = Math.round(29.5 + 1.6 * Math.sin(Math.PI * t) - 7.5 * t * t);
  const w = Math.max(2, Math.round(3.2 * Math.pow(1 - t, 0.8) + 1));
  for (let k = 0; k < w; k++) {
    const c = k === 0 ? MARBLE : (k === w - 1 && w > 2 ? GRAY : IRON);
    put(xe, ye + k, -3, c);
    put(xe, ye + k, -2, c);
  }
}
cube(9, 29, -3, 11, 30, -2, GOLD);
put(11, 31, -3, GOLD); put(10, 31, -2, GOLD);
put(-7, 22, -3, MARBLE); put(-7, 22, -2, MARBLE); put(-7, 21, -3, MARBLE);

// right fist
cube(8, 9, -3, 10, 11, -2, WHITE);
for (let x = 8; x <= 10; x++) put(x, 10, -3, x === 9 ? LIGHT_GRAY : WHITE);
put(8, 9, -3, LIGHT_GRAY); put(10, 11, -3, LIGHT_GRAY);
put(11, 11, -3, WHITE); put(11, 10, -3, WHITE);
// left skeletal hand, palm up
cube(-10, 11, -8, -8, 11, -6, WHITE);
for (let x = -10; x <= -8; x++) {
  line(x, 11, -9, x, 11, -11, x % 2 ? LIGHT_GRAY : WHITE);
  put(x, 12, -12, WHITE);
}
put(-7, 11, -8, WHITE); put(-6, 11, -9, WHITE); put(-6, 12, -10, WHITE);
put(-11, 11, -7, WHITE); put(-11, 11, -6, LIGHT_GRAY);
// soul orb
for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) for (let z = -4; z <= 4; z++) {
  const d = Math.sqrt(x * x + y * y + z * z);
  const X = -9 + x, Y = 15 + y, Z = -8 + z;
  if (d <= 1.0) put(X, Y, Z, NEON_BLUE);
  else if (d <= 1.9) put(X, Y, Z, LIGHT_BLUE);
  else if (d <= 2.6) put(X, Y, Z, GLASS);
}
put(-9, 19, -8, CYAN); put(-9, 20, -8, LIGHT_BLUE); put(-8, 21, -8, CYAN); put(-9, 22, -9, LIGHT_BLUE);

// ---------- spectral wisps ----------
[[-13, 7, -8], [13, 15, -8], [-3, 30, -6], [6, 5, -9], [-14, 12, -3], [3, 26, -9], [12, 21, -5]].forEach(([x, y, z]) => {
  put(x, y, z, NEON_BLUE); put(x, y + 1, z, LIGHT_BLUE); put(x + 1, y, z, CYAN);
});

// ---------- emit (thin low-priority scenery if over budget) ----------
let arr = Array.from(V.values());
const CAP = 3950;
if (arr.length > CAP) {
  arr.sort((a, b) => (a[4] - b[4]) || (hs(a[0], a[1], a[2]) - hs(b[0], b[1], b[2])));
  arr = arr.slice(arr.length - CAP);
}
for (const [x, y, z, id] of arr) block(x, y, z, id);