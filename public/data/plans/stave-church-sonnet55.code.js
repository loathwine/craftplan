// stave-church-sonnet55 — prompt:
// a Norwegian stave church in the snow...

const LIMIT = 3960;
const M = new Map();
let solid = 0;
function B(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  const o = M.get(k);
  const was = !!o && o[3] !== AIR;
  const is = id !== AIR;
  if (is && !was) { if (solid >= LIMIT) return; solid++; }
  else if (!is && was) solid--;
  M.set(k, [x, y, z, id]);
}
function S(x, y, z, id) {
  const o = M.get(Math.round(x) + ',' + Math.round(y) + ',' + Math.round(z));
  if (o && o[3] !== AIR) return;
  B(x, y, z, id);
}
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) B(x, y, z, id);
}
function rnd(x, z) { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); }
function perim(x1, z1, x2, z2) {
  const a = [];
  for (let x = x1; x <= x2; x++) a.push([x, z1]);
  for (let z = z1 + 1; z <= z2; z++) a.push([x2, z]);
  for (let x = x2 - 1; x >= x1; x--) a.push([x, z2]);
  for (let z = z2 - 1; z > z1; z--) a.push([x1, z]);
  return a;
}
const stave = (x, z) => ((((x + z) % 2) + 2) % 2 === 0 ? OAK_LOG : BROWN);

// clear trees on the site
cube(-16, 1, -15, 16, 9, 21, AIR);

// ---------- floor + plinth ----------
for (let x = -10; x <= 10; x++) for (let z = -9; z <= 9; z++) {
  if (!(Math.abs(x) <= 6 && Math.abs(z) <= 5)) B(x, 0, z, COBBLE);
}
box(-6, 0, -4, 6, 0, 0, PLANKS);
perim(-10, -9, 10, 9).forEach(([x, z]) => B(x, -1, z, STONE));

// ---------- ambulatory (outer gallery) ----------
perim(-10, -9, 10, 9).forEach(([x, z], i) => {
  const corner = Math.abs(x) === 10 && Math.abs(z) === 9;
  const post = corner || i % 3 === 0;
  B(x, 1, z, COBBLE);
  B(x, 2, z, post ? OAK_LOG : BROWN);
  B(x, 3, z, post ? OAK_LOG : BROWN);
  if (post) B(x, 4, z, OAK_LOG);
  B(x, 5, z, OAK_LOG);
  if (z === -9 && (Math.abs(x) === 3 || Math.abs(x) === 6) && !post) B(x, 3, z, GLOWSTONE);
});
// entrance
box(-1, 1, -9, 1, 4, -9, AIR);
for (let y = 1; y <= 4; y++) { B(-2, y, -9, OAK_LOG); B(2, y, -9, OAK_LOG); }
B(0, 4, -8, GLOWSTONE);

// ---------- nave walls ----------
perim(-6, -5, 6, 5).forEach(([x, z]) => {
  const corner = Math.abs(x) === 6 && Math.abs(z) === 5;
  for (let y = 1; y <= 13; y++) {
    let id = corner ? OAK_LOG : stave(x, z);
    if (y === 1) id = COBBLE;
    if (y === 9 || y === 13) id = OAK_LOG;
    B(x, y, z, id);
  }
  if (Math.abs(x) === 6) B(x, 14, z, corner ? OAK_LOG : BROWN);
});
// nave door
box(-1, 1, -5, 1, 3, -5, PLANKS);
B(1, 2, -5, IRON);
for (let y = 1; y <= 4; y++) { B(-2, y, -5, OAK_LOG); B(2, y, -5, OAK_LOG); }
box(-1, 4, -5, 1, 4, -5, OAK_LOG);
B(-3, 3, -5, GLOWSTONE); B(3, 3, -5, GLOWSTONE);
// nave windows
for (const z of [-5, 5]) for (const x of [-4, 0, 4]) { B(x, 11, z, GLOWSTONE); B(x, 12, z, GLOWSTONE); }
for (const x of [-6, 6]) for (const z of [-2, 2]) { B(x, 11, z, GLOWSTONE); B(x, 12, z, GLOWSTONE); }

// ---------- ambulatory roof (stepped, shallow) ----------
for (let k = 0; k <= 2; k++) {
  const y = 6 + k, hx = 11 - 2 * k, hz = 10 - 2 * k, thick = k < 2 ? 2 : 1;
  for (let x = -hx; x <= hx; x++) for (let z = -hz; z <= hz; z++) {
    const m = Math.min(hx - Math.abs(x), hz - Math.abs(z));
    if (m < thick) B(x, y, z, (k < 2 && m === 0) ? BLACK : SNOW);
  }
}

// ---------- nave roof (steep gable, ridge N-S) ----------
for (let x = -7; x <= 7; x++) {
  const ry = 21 - Math.abs(x);
  for (let z = -6; z <= 6; z++) {
    let id = Math.abs(x) >= 5 ? BLACK : SNOW;
    if (Math.abs(z) === 6) id = OAK_LOG;
    B(x, ry, z, id);
  }
}
for (const z of [-5, 5]) for (let x = -6; x <= 6; x++) {
  const top = 20 - Math.abs(x);
  for (let y = 14; y <= top; y++) B(x, y, z, y === 14 ? OAK_LOG : stave(x, z));
}
B(0, 16, -5, GLOWSTONE); B(0, 17, -5, GLOWSTONE);
B(0, 16, 5, GLOWSTONE); B(0, 17, 5, GLOWSTONE);
for (let z = -5; z <= 5; z++) B(0, 22, z, SNOW);

// ---------- central tower ----------
perim(-2, -2, 2, 2).forEach(([x, z]) => {
  const corner = Math.abs(x) === 2 && Math.abs(z) === 2;
  for (let y = 19; y <= 26; y++) B(x, y, z, (corner || y === 22 || y === 26) ? OAK_LOG : stave(x, z));
});
for (const y of [23, 24]) {
  B(-1, y, -2, AIR); B(1, y, -2, AIR); B(-1, y, 2, AIR); B(1, y, 2, AIR);
  B(2, y, -1, AIR); B(2, y, 1, AIR); B(-2, y, -1, AIR); B(-2, y, 1, AIR);
}
B(0, 23, 0, GOLD); B(0, 24, 0, GOLD); B(0, 25, 0, OAK_LOG); B(0, 22, 0, GLOWSTONE);
function sq(r, y, ring, inner) {
  for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) {
    B(x, y, z, Math.max(Math.abs(x), Math.abs(z)) === r ? ring : inner);
  }
}
sq(3, 27, BLACK, BLACK);
sq(2, 28, BLACK, BLACK);
sq(2, 29, SNOW, BLACK);
sq(1, 30, BLACK, BLACK);
sq(1, 31, SNOW, BLACK);
B(0, 32, 0, BLACK); B(0, 33, 0, GOLD);
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  B(sx * 3, 28, sz * 3, OAK_LOG); B(sx * 3, 29, sz * 3, OAK_LOG);
  B(sx * 4, 29, sz * 3, OAK_LOG); B(sx * 3, 29, sz * 4, OAK_LOG);
}

// ---------- dragon heads on nave ridge ends ----------
function dragon(dir) {
  const P = [[0, 0, 1], [1, 0, 1], [2, 0, 2], [3, 0, 2], [4, 0, 2], [4, 0, 3], [4, 0, 4], [4, 0, 5],
             [3, 0, 3], [3, 0, 4], [5, 0, 2], [6, 0, 2]];
  for (const [dy, dx, o] of P) B(dx, 21 + dy, dir * (6 + o), OAK_LOG);
  B(-1, 25, dir * 9, NEON_RED); B(1, 25, dir * 9, NEON_RED);
  B(0, 26, dir * 8, OAK_LOG);
}
dragon(-1); dragon(1);

// ---------- chancel + apse ----------
function chancelWall(x, z) {
  for (let y = 1; y <= 9; y++) B(x, y, z, y === 1 ? COBBLE : (z % 2 === 0 ? OAK_LOG : BROWN));
}
for (let z = 10; z <= 15; z++) { chancelWall(-3, z); chancelWall(3, z); }
for (let x = -3; x <= 3; x++) for (let z = 15; z <= 18; z++) {
  const d = Math.hypot(x, z - 15);
  if (d >= 2.5 && d < 3.5) chancelWall(x, z);
  if (d < 3.5) B(x, 0, z, COBBLE);
}
box(-3, 0, 10, 3, 0, 15, COBBLE);
for (const y of [5, 6]) {
  B(-3, y, 12, GLOWSTONE); B(3, y, 12, GLOWSTONE);
  B(0, y, 18, GLOWSTONE); B(2, y, 17, GLOWSTONE); B(-2, y, 17, GLOWSTONE);
}
for (let x = -4; x <= 4; x++) {
  const ry = 13 - Math.abs(x);
  for (let z = 9; z <= 15; z++) B(x, ry, z, Math.abs(x) >= 3 ? BLACK : SNOW);
}
for (let x = -3; x <= 3; x++) for (let y = 9; y <= 12 - Math.abs(x); y++) B(x, y, 9, stave(x, 9));
for (let x = -4; x <= 4; x++) for (let z = 16; z <= 19; z++) {
  const d = Math.hypot(x, z - 15);
  if (d <= 4.4) B(x, 13 - Math.round(d), z, d >= 3.4 ? BLACK : SNOW);
}
B(0, 14, 15, GOLD); B(0, 15, 15, GOLD); B(-1, 15, 15, GOLD); B(1, 15, 15, GOLD);

// ---------- graveyard gate, wall, path ----------
for (let x = -14; x <= 14; x++) {
  if (Math.abs(x) <= 2) continue;
  B(x, 0, -15, COBBLE); B(x, 1, -15, COBBLE); B(x, 2, -15, SNOW);
}
for (let z = -14; z <= -6; z++) for (const x of [-14, 14]) {
  B(x, 0, z, COBBLE); B(x, 1, z, COBBLE); B(x, 2, z, SNOW);
}
for (const x of [-3, 3]) for (let y = 1; y <= 4; y++) B(x, y, -15, OAK_LOG);
box(-4, 5, -16, 4, 5, -14, BLACK);
box(-3, 6, -15, 3, 6, -15, SNOW);
B(-3, 3, -16, GLOWSTONE); B(3, 3, -16, GLOWSTONE);
for (let z = -18; z <= -10; z++) for (let x = -1; x <= 1; x++) B(x, 0, z, rnd(x, z) < 0.25 ? SNOW : COBBLE);
for (const [gx, gz] of [[-9, -9], [-6, -12], [7, -12], [10, -8], [-11, -6], [12, -11]]) {
  B(gx, 1, gz, STONE); B(gx, 2, gz, STONE); B(gx, 3, gz, SNOW);
}

// ---------- free-standing belfry ----------
for (const [px, pz] of [[14, -7], [16, -7], [14, -5], [16, -5]]) for (let y = 1; y <= 6; y++) B(px, y, pz, OAK_LOG);
perim(14, -7, 16, -5).forEach(([x, z]) => { B(x, 4, z, OAK_LOG); B(x, 6, z, OAK_LOG); });
B(15, 5, -6, GOLD); B(15, 4, -6, GOLD);
box(13, 7, -8, 17, 7, -4, BLACK);
box(14, 8, -7, 16, 8, -5, SNOW);
B(15, 9, -6, BLACK); B(15, 10, -6, GOLD);

// ---------- spruce trees ----------
function tree(cx, cz, n) {
  B(cx, 1, cz, OAK_LOG); B(cx, 2, cz, OAK_LOG);
  for (let i = 0; i < n; i++) {
    const y = 3 + i, r = Math.round(3 * (n - 1 - i) / (n - 1));
    for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
      const d = Math.hypot(dx, dz);
      if (d <= r + 0.3) {
        const outer = r >= 2 && d > r - 1.1;
        B(cx + dx, y, cz + dz, (outer && Math.abs(dx + dz) % 2 === 1) ? SNOW : LEAVES);
      }
    }
  }
  B(cx, 3 + n, cz, SNOW);
}
tree(-14, -9, 7);
tree(-16, 5, 8);
tree(-13, 13, 6);
tree(14, 12, 7);
tree(18, 4, 8);
tree(-8, 19, 7);

// ---------- snow ground + drifts (fills remaining budget) ----------
perim(-11, -10, 11, 10).forEach(([x, z]) => { if (rnd(x + 5, z) < 0.55) S(x, 1, z, SNOW); });
for (let x = -17; x <= 17; x++) for (let z = -15; z <= 21; z++) {
  if (Math.abs(x) <= 10 && Math.abs(z) <= 9) continue;
  if (Math.abs(x) <= 3 && z >= 10 && z <= 18) continue;
  const e = (x / 17) * (x / 17) + ((z - 3) / 18) * ((z - 3) / 18);
  if (e <= 1 + 0.25 * (rnd(x, z) - 0.5)) S(x, 0, z, SNOW);
}

M.forEach(v => block(v[0], v[1], v[2], v[3]));