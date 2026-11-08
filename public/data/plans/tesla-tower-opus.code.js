// tesla-tower-opus — prompt:
// a steampunk Tesla coil tower crackling with lightning...

const R = Math.round, PI = Math.PI;

// clear trees/brush in the footprint
cube(-18, 0, -17, 18, 12, 14, AIR);

function ring(cx, cy, cz, r, id) {
  const m = Math.ceil(r) + 1;
  for (let x = -m; x <= m; x++) for (let z = -m; z <= m; z++) {
    const d = Math.hypot(x, z);
    if (d <= r + 0.5 && d > r - 0.6) block(cx + x, cy, cz + z, id);
  }
}
function gearXY(cx, cy, cz, r, teeth, id, hub) {
  const m = Math.ceil(r) + 2;
  for (let dx = -m; dx <= m; dx++) for (let dy = -m; dy <= m; dy++) {
    const d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
    if (d <= 0.8) block(cx + dx, cy + dy, cz, hub);
    else if (d <= r + 0.3) block(cx + dx, cy + dy, cz, id);
    else if (d <= r + 1.3 && Math.floor((a + PI) / (2 * PI) * teeth * 2) % 2 === 0) block(cx + dx, cy + dy, cz, id);
  }
}
function gauge(cx, cy, cz) {
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++)
    block(cx + dx, cy + dy, cz, (dx || dy) ? GOLD : WHITE);
  block(cx, cy + 1, cz, BLACK);
}

// ---------- PLATFORM ----------
disk(0, -1, 0, 10, COBBLE);
disk(0, 0, 0, 9, STONE);
ring(0, 0, 0, 9, COBBLE);
ring(0, 0, 0, 7.5, OBSIDIAN);
// front path + lamps
cube(-1, -1, -17, 1, -1, -10, COBBLE);
cube(-2, -1, -11, 2, -1, -10, COBBLE);
for (const s of [-1, 1]) {
  const X = 3 * s;
  cube(X, 0, -13, X, 2, -13, IRON);
  block(X, 3, -13, GLOWSTONE);
  block(X, 4, -13, GOLD);
}
// iron fence posts around platform (gap at front)
for (let i = 0; i < 20; i++) {
  const a = i / 20 * 2 * PI, deg = a * 180 / PI;
  if (Math.abs(deg - 270) < 25) continue;
  const x = R(9 * Math.cos(a)), z = R(9 * Math.sin(a));
  block(x, 1, z, IRON);
  block(x, 2, z, i % 2 ? GOLD : COPPER);
}

// ---------- MACHINE HOUSE ----------
for (let y = 1; y <= 7; y++) for (let x = -7; x <= 7; x++) for (let z = -7; z <= 7; z++) {
  const d = Math.hypot(x, z);
  if (d > 6.5 || d <= 5.4) continue;
  const a = Math.atan2(z, x) * 180 / PI, k = R(a / 45);
  const inSector = Math.abs(a - k * 45) < 10 && k !== -2;
  let id = (y === 1 || y === 7) ? COPPER : BRICK;
  if (inSector && y >= 2 && y <= 4) id = GLASS;
  else if (inSector && y === 5) id = BLACK;
  block(x, y, z, id);
}
// rivets on bands
for (let i = 0; i < 24; i++) {
  const a = i / 24 * 2 * PI;
  block(R(6.6 * Math.cos(a)), 4, R(6.6 * Math.sin(a)), IRON);
}
// interior lighting
block(0, 2, -3, GLOWSTONE);
block(0, 6, 0, GLOWSTONE);
block(3, 5, 0, GLOWSTONE); block(-3, 5, 0, GLOWSTONE); block(0, 5, 3, GLOWSTONE);
// door
cube(-1, 1, -7, 1, 3, -4, AIR);
cube(-2, 1, -7, -2, 4, -7, IRON);
cube(2, 1, -7, 2, 4, -7, IRON);
cube(-2, 4, -7, 2, 4, -7, IRON);
block(0, 4, -7, GOLD);
// brass gear above door, gauges either side
gearXY(0, 6, -7, 1.7, 8, GOLD, IRON);
gauge(-5, 6, -5);
gauge(5, 6, -5);
// roof
disk(0, 8, 0, 7, COPPER);
for (let i = 0; i < 28; i++) {
  const a = i / 28 * 2 * PI;
  if (i % 2 === 0) block(R(7 * Math.cos(a)), 8, R(7 * Math.sin(a)), GOLD);
}
disk(0, 9, 0, 5, IRON);

// ---------- LATTICE TOWER ----------
const p = y => 5 - 2 * (y - 9) / 16;
for (let y = 9; y <= 25; y++) {
  const P = p(y);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    block(R(sx * P), y, R(sz * P), IRON);
    if (y <= 14) block(R(sx * P) - sx, y, R(sz * P), IRON);
  }
}
// horizontal frames
for (const y of [13, 17, 21, 25]) {
  const P = R(p(y));
  for (let t = -P; t <= P; t++) {
    block(t, y, -P, IRON); block(t, y, P, IRON);
    block(-P, y, t, IRON); block(P, y, t, IRON);
  }
}
// X-bracing on all four faces
const L = [9, 13, 17, 21, 25];
for (let i = 0; i < L.length - 1; i++) {
  const y0 = L[i], y1 = L[i + 1], A = R(p(y0)), B = R(p(y1));
  line(-A, y0, -A, B, y1, -B, COPPER); line(A, y0, -A, -B, y1, -B, COPPER);
  line(-A, y0, A, B, y1, B, COPPER);   line(A, y0, A, -B, y1, B, COPPER);
  line(-A, y0, -A, -B, y1, B, COPPER); line(-A, y0, A, -B, y1, -B, COPPER);
  line(A, y0, -A, B, y1, B, COPPER);   line(A, y0, A, B, y1, -B, COPPER);
}
// secondary coil core
disk(0, 10, 0, 2, OBSIDIAN);
for (let y = 11; y <= 25; y++) {
  cube(-1, y, -1, 1, y, 1, COPPER);
  if (y % 3 === 1 && y < 25) disk(0, y, 0, 2, GOLD);
}
// catwalk
disk(0, 25, 0, 2, IRON);
for (const sx of [-1, 1]) for (const sz of [-1, 1]) block(3 * sx, 26, 3 * sz, NEON_BLUE);
// insulator
cube(-1, 26, -1, 1, 27, 1, OBSIDIAN);

// ---------- TOROID CROWN ----------
for (let x = -7; x <= 7; x++) for (let z = -7; z <= 7; z++) for (let y = 26; y <= 32; y++) {
  const d = Math.hypot(x, z), q = Math.hypot(d - 4.5, y - 29);
  if (q <= 1.95 && q > 0.95) {
    const band = y === 29 && d > 5;
    block(x, y, z, band ? COPPER : IRON);
  }
}
for (let i = 0; i < 12; i++) {
  const a = i / 12 * 2 * PI;
  block(R(6.5 * Math.cos(a)), 29, R(6.5 * Math.sin(a)), GOLD);
}
sphere(0, 29, 0, 2.4, GOLD);
block(0, 32, 0, IRON);

// ---------- SIDE COILS ----------
for (const s of [-1, 1]) {
  const X = 14 * s, Z = -4;
  cylinder(X, -3, Z, 2, 3, COBBLE);
  cylinder(X, 0, Z, 2, 2, COBBLE);
  disk(X, 2, Z, 2, OBSIDIAN);
  for (let y = 3; y <= 10; y++) {
    block(X, y, Z, COPPER);
    if (y % 2 === 1) disk(X, y, Z, 1, GOLD);
  }
  sphere(X, 12, Z, 1.6, IRON);
  line(5 * s, 2, Z, 12 * s, 2, Z, COPPER);
  block(9 * s, 3, Z, GOLD);
}

// ---------- CHIMNEYS ----------
for (const s of [-1, 1]) {
  const X = 7 * s, Z = 7;
  cube(X - 1, -2, Z - 1, X + 1, -1, Z + 1, COBBLE);
  cylinder(X, 0, Z, 1, 18, BRICK);
  disk(X, 6, Z, 2, COPPER);
  disk(X, 12, Z, 2, COPPER);
  disk(X, 17, Z, 2, IRON);
  block(X, 17, Z, AIR);
}

// ---------- BOILER (west) ----------
cube(-14, -2, 0, -8, -1, 10, COBBLE);
cube(-13, 0, 1, -9, 1, 9, COBBLE);
cube(-12, 0, 1, -10, 0, 1, LAVA);
cube(-12, 1, 1, -10, 1, 1, IRON);
for (let z = 2; z <= 9; z++) for (let x = -14; x <= -8; x++) for (let y = 1; y <= 7; y++) {
  if (Math.hypot(x + 11, y - 4) <= 2.3)
    block(x, y, z, (z === 2 || z === 5 || z === 9) ? COPPER : IRON);
}
gauge(-11, 4, 1);
cube(-11, 6, 4, -11, 9, 4, IRON);
block(-11, 7, 8, GOLD);
line(-9, 5, 3, -5, 5, 3, COPPER);
line(-9, 3, 7, -6, 3, 7, COPPER);

// ---------- PRESSURE TANKS (east) ----------
cube(8, -2, 0, 14, -1, 11, COBBLE);
for (const Z of [3, 8]) {
  sphere(11, 4, Z, 2, IRON);
  cylinder(11, 0, Z, 2, 5, COPPER);
  ring(11, 1, Z, 2, IRON);
  ring(11, 3, Z, 2, IRON);
  block(11, 7, Z, GOLD);
}
line(11, 4, 5, 11, 4, 6, COPPER);
line(9, 3, 3, 5, 3, 3, COPPER);
block(7, 3, 3, GOLD);

// ---------- EFFECTS ----------
// lightning around the crown
const arcs = [-110, -50, 10, 70, 150, 210];
arcs.forEach((deg, i) => {
  const a = deg * PI / 180;
  block(R(8 * Math.cos(a)), i % 2 ? 30 : 29, R(8 * Math.sin(a)), ELECTRIC);
});
block(0, 33, 0, ELECTRIC);
block(14, 14, -4, ELECTRIC);
block(-14, 14, -4, ELECTRIC);
// steam
for (const s of [-1, 1]) {
  const X = 7 * s;
  block(X, 18, 7, STEAM);
  block(X + s, 18, 7, STEAM);
  block(X, 18, 8, STEAM);
}
block(-11, 10, 4, STEAM);
block(-11, 8, 8, STEAM);
block(11, 8, 8, STEAM);