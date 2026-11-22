// st-basils-opus — prompt:
// St. Basil's Cathedral in the snow...

const LIMIT = 3990;
const placed = new Map();
let used = 0;
function K(x, y, z) { return x + ',' + y + ',' + z; }
function feature(fn) {
  const m = new Map();
  const P = (x, y, z, id) => {
    x = Math.round(x); y = Math.round(y); z = Math.round(z);
    if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
    m.set(K(x, y, z), [x, y, z, id]);
  };
  fn(P);
  let add = 0;
  for (const k of m.keys()) if (!placed.has(k)) add++;
  if (used + add > LIMIT) return false;
  for (const [k, v] of m) placed.set(k, v);
  used += add;
  return true;
}
function hash(x, y, z) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967296;
}

// ---------- octagon helpers ----------
const DIAG = [0, 1, 3, 4, 5, 7, 8];
function inO(dx, dz, r) {
  if (r < 0) return false;
  const d = DIAG[r];
  return Math.abs(dx) <= r && Math.abs(dz) <= r && Math.abs(dx) + Math.abs(dz) <= d;
}
function inF(dx, dz, r) {
  return r > 0 && Math.abs(dx) <= r + 0.01 && Math.abs(dz) <= r + 0.01 && Math.abs(dx) + Math.abs(dz) <= r * 1.42 + 0.01;
}

// ---------- dome patterns ----------
const ANG = (dx, dz) => (Math.atan2(dz, dx) + Math.PI) / (2 * Math.PI);
const mod2 = v => ((Math.floor(v) % 2) + 2) % 2;
const spiral = (a, b, n, k) => (dx, dz, i) => mod2(ANG(dx, dz) * n + i * k) ? a : b;
const diamonds = (a, b, n) => (dx, dz, i) => { const A = ANG(dx, dz) * n; return mod2(Math.floor(A + i * 0.5) + Math.floor(A - i * 0.5)) ? a : b; };
const zigzag = (a, b, n) => (dx, dz, i) => { const A = ANG(dx, dz) * n; const tri = Math.abs((A % 2) - 1); return mod2(i * 0.75 + tri * 1.6) ? a : b; };
const solidPat = a => () => a;

function onionR(t, R) {
  if (t < 0.35) return R * (0.72 + 0.28 * Math.sin(t / 0.35 * Math.PI / 2));
  const u = (t - 0.35) / 0.65;
  return R * Math.pow(Math.max(0, Math.cos(u * Math.PI / 2)), 1.5);
}
function dome(P, cx, by, cz, R, H, pat, dust) {
  const rs = [];
  for (let i = 0; i < H; i++) rs.push(onionR(i / (H - 1), R));
  rs.push(-5);
  const N = Math.ceil(R) + 1;
  for (let i = 0; i < H; i++) {
    const rr = rs[i], ra = rs[i + 1], t = i / (H - 1);
    for (let dx = -N; dx <= N; dx++) for (let dz = -N; dz <= N; dz++) {
      const d = Math.hypot(dx, dz);
      if (d > rr + 0.35) continue;
      const up = d > ra + 0.35;
      if (!up && d <= rr - 1.15) continue;
      let id = pat(dx, dz, i, t);
      if (dust && up && t > 0.4 && hash(cx + dx, by + i, cz + dz) < 0.45) id = SNOW;
      P(cx + dx, by + i, cz + dz, id);
    }
  }
  return by + H - 1;
}
function cross(P, x, y, z) {
  P(x, y, z, GOLD); P(x, y + 1, z, GOLD); P(x - 1, y + 1, z, GOLD); P(x + 1, y + 1, z, GOLD); P(x, y + 2, z, GOLD);
}

// ---------- layout ----------
const PX0 = -11, PX1 = 11, PZ0 = -9, PZ1 = 13;
const CEN = { x: 0, z: 2, r: 4 };
const BIG = [
  { x: 0, z: -7, r: 3, y0: 0, y1: 12, out: [0, -1], R: 3.3, H: 8, pat: spiral(GREEN, YELLOW, 8, 0.6) },
  { x: -9, z: 2, r: 3, y0: 0, y1: 13, out: [-1, 0], R: 3.4, H: 8, pat: diamonds(BLUE, WHITE, 8) },
  { x: 9, z: 2, r: 3, y0: 0, y1: 11, out: [1, 0], R: 3.2, H: 8, pat: spiral(RED, WHITE, 8, -0.6) },
  { x: 0, z: 11, r: 3, y0: 0, y1: 11, out: [0, 1], R: 3.2, H: 7, pat: zigzag(GREEN, RED, 8) },
];
const SMALL = [
  { x: 6, z: -4, r: 2, pat: zigzag(YELLOW, GREEN, 6) },
  { x: -6, z: -4, r: 2, pat: spiral(LIGHT_BLUE, WHITE, 6, 0.7) },
  { x: 6, z: 8, r: 2, pat: solidPat(GOLD) },
  { x: -6, z: 8, r: 2, pat: diamonds(RED, YELLOW, 6) },
];
const ALL = [CEN, ...BIG, ...SMALL];
const footAny = (x, z) => ALL.some(t => inO(x - t.x, z - t.z, t.r));
const DIRS = [[0, -1], [0, 1], [1, 0], [-1, 0]];

// ---------- plinth / gallery ----------
function plinth(P) {
  for (let x = PX0; x <= PX1; x++) for (let z = PZ0; z <= PZ1; z++) {
    if (footAny(x, z)) continue;
    const edge = x === PX0 || x === PX1 || z === PZ0 || z === PZ1;
    if (edge) {
      const corner = (x === PX0 || x === PX1) && (z === PZ0 || z === PZ1);
      const along = (z === PZ0 || z === PZ1) ? x : z;
      for (let y = 0; y <= 3; y++) {
        if (!corner && (y === 1 || y === 2) && ((along + 30) % 3 === 1)) continue; // arcade openings
        P(x, y, z, y === 3 ? WHITE : BRICK);
      }
    }
    P(x, 4, z, SNOW);
  }
  for (const [x, z] of [[PX0, PZ0], [PX1, PZ0], [PX0, PZ1], [PX1, PZ1]]) {
    P(x, 4, z, WHITE); P(x, 5, z, WHITE); P(x, 6, z, SNOW);
  }
}

// ---------- central tent tower ----------
function central(P) {
  const c = CEN, r = 4;
  for (let y = 4; y <= 15; y++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
    if (!inO(dx, dz, r) || inO(dx, dz, r - 1)) continue;
    const ax = Math.abs(dx), az = Math.abs(dz);
    let id = BRICK;
    if ((ax === 4 && az === 1) || (az === 4 && ax === 1)) id = WHITE;
    if (y === 4 || y === 10 || y === 15) id = WHITE;
    const face = (dx === 0 && az === r) || (dz === 0 && ax === r);
    const dface = (ax === 3 && az === 2) || (ax === 2 && az === 3);
    if (face) {
      if (y === 6 || y === 7) id = BLACK;
      if (y === 8) id = WHITE;
    }
    if (face || dface) {
      if (y === 12 || y === 13) id = BLACK;
      if (y === 14) id = WHITE;
    }
    P(c.x + dx, y, c.z + dz, id);
  }
  // cornice
  for (let dx = -5; dx <= 5; dx++) for (let dz = -5; dz <= 5; dz++)
    if (inO(dx, dz, 5) && !inO(dx, dz, 3)) P(c.x + dx, 16, c.z + dz, WHITE);
  // kokoshnik gables
  for (const [fx, fz] of DIRS) {
    const px = fz !== 0 ? 1 : 0, pz = fx !== 0 ? 1 : 0;
    for (let s = -1; s <= 1; s++) P(c.x + fx * 5 + px * s, 17, c.z + fz * 5 + pz * s, WHITE);
    P(c.x + fx * 5, 18, c.z + fz * 5, WHITE);
  }
  // drum
  for (let y = 17; y <= 19; y++) for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) {
    if (!inO(dx, dz, 3) || inO(dx, dz, 2)) continue;
    const ax = Math.abs(dx), az = Math.abs(dz);
    let id = BRICK;
    if ((ax === 3 && az === 1) || (az === 3 && ax === 1)) id = WHITE;
    if (y === 19) id = WHITE;
    if (y === 18 && ((dx === 0 && az === 3) || (dz === 0 && ax === 3))) id = GLOWSTONE;
    P(c.x + dx, y, c.z + dz, id);
  }
  // tent spire
  const TR = i => 3.4 - 0.4 * i;
  for (let i = 0; i <= 7; i++) {
    const r0 = TR(i), rn = i < 7 ? TR(i + 1) : -1;
    for (let dx = -4; dx <= 4; dx++) for (let dz = -4; dz <= 4; dz++) {
      if (!inF(dx, dz, r0)) continue;
      const up = !inF(dx, dz, rn);
      if (!up && inF(dx, dz, r0 - 1)) continue;
      const ax = Math.abs(dx), az = Math.abs(dz);
      let id = WHITE;
      if (ax === az && ax > 0) id = YELLOW;
      else if ((i + ax + az) % 3 === 0) id = GREEN;
      if (up && hash(c.x + dx, 20 + i, c.z + dz) < 0.18) id = SNOW;
      P(c.x + dx, 20 + i, c.z + dz, id);
    }
  }
  const top = dome(P, c.x, 28, c.z, 1.7, 3, solidPat(GOLD), false);
  cross(P, c.x, top + 1, c.z);
}

// ---------- big octagonal towers ----------
function bigTower(P, t) {
  const r = t.r, dg = DIAG[r];
  for (let y = t.y0; y <= t.y1; y++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
    if (!inO(dx, dz, r) || inO(dx, dz, r - 1)) continue;
    const x = t.x + dx, z = t.z + dz;
    if (y < 4 && x > PX0 && x < PX1 && z > PZ0 && z < PZ1) continue;
    const ax = Math.abs(dx), az = Math.abs(dz);
    let id = BRICK;
    if ((ax === r && az === dg - r) || (az === r && ax === dg - r)) id = WHITE;
    if (y === 3 || y === t.y1 || y === t.y1 - 5) id = WHITE;
    const face = (dx === 0 && az === r) || (dz === 0 && ax === r);
    const outw = dx === t.out[0] * r && dz === t.out[1] * r;
    if (face) {
      if (outw && (y === 1 || y === 2)) id = BLACK;
      if (y === 5 || y === 6) id = BLACK;
      if (y === 7) id = WHITE;
      if (y === t.y1 - 3 || y === t.y1 - 2) id = outw ? GLOWSTONE : BLACK;
      if (y === t.y1 - 1) id = WHITE;
    }
    P(x, y, z, id);
  }
  const yc = t.y1 + 1;
  for (let dx = -r - 1; dx <= r + 1; dx++) for (let dz = -r - 1; dz <= r + 1; dz++)
    if (inO(dx, dz, r + 1) && !inO(dx, dz, r - 1)) P(t.x + dx, yc, t.z + dz, WHITE);
  for (const [fx, fz] of DIRS) {
    const px = fz !== 0 ? 1 : 0, pz = fx !== 0 ? 1 : 0;
    for (let s = -1; s <= 1; s++) P(t.x + fx * (r + 1) + px * s, yc + 1, t.z + fz * (r + 1) + pz * s, WHITE);
    P(t.x + fx * (r + 1), yc + 2, t.z + fz * (r + 1), WHITE);
  }
  const yd = t.y1 + 2, rr = r - 1;
  for (let k = 0; k <= 2; k++) for (let dx = -rr; dx <= rr; dx++) for (let dz = -rr; dz <= rr; dz++) {
    if (!inO(dx, dz, rr) || inO(dx, dz, rr - 1)) continue;
    const ax = Math.abs(dx), az = Math.abs(dz);
    let id = BRICK;
    if ((ax === rr && az === DIAG[rr] - rr) || (az === rr && ax === DIAG[rr] - rr)) id = WHITE;
    if (k === 2) id = WHITE;
    if (k === 1 && ((dx === 0 && az === rr) || (dz === 0 && ax === rr))) id = BLACK;
    P(t.x + dx, yd + k, t.z + dz, id);
  }
  const top = dome(P, t.x, yd + 3, t.z, t.R, t.H, t.pat, true);
  cross(P, t.x, top + 1, t.z);
}

// ---------- small corner towers ----------
function smallTower(P, t) {
  const r = 2;
  for (let y = 4; y <= 9; y++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
    if (!inO(dx, dz, r) || inO(dx, dz, r - 1)) continue;
    const ax = Math.abs(dx), az = Math.abs(dz);
    let id = BRICK;
    if ((ax === 2 && az === 1) || (az === 2 && ax === 1)) id = WHITE;
    if (y === 9) id = WHITE;
    if ((dx === 0 && az === 2) || (dz === 0 && ax === 2)) {
      if (y === 6 || y === 7) id = BLACK;
      if (y === 8) id = WHITE;
    }
    P(t.x + dx, y, t.z + dz, id);
  }
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
    if (inO(dx, dz, r) && !inO(dx, dz, 1)) P(t.x + dx, 10, t.z + dz, SNOW);
    if (inO(dx, dz, 1)) { P(t.x + dx, 10, t.z + dz, BRICK); P(t.x + dx, 11, t.z + dz, WHITE); }
  }
  const top = dome(P, t.x, 12, t.z, 2.4, 6, t.pat, true);
  cross(P, t.x, top + 1, t.z);
}

// ---------- snowy ledges ----------
function centralSnow(P) {
  for (let dx = -5; dx <= 5; dx++) for (let dz = -5; dz <= 5; dz++) {
    if (!inO(dx, dz, 5) || inO(dx, dz, 3)) continue;
    const ax = Math.abs(dx), az = Math.abs(dz);
    if ((ax === 5 && az <= 1) || (az === 5 && ax <= 1)) continue;
    P(CEN.x + dx, 17, CEN.z + dz, SNOW);
  }
}
function bigSnow(P, t) {
  const r = t.r;
  for (let dx = -r - 1; dx <= r + 1; dx++) for (let dz = -r - 1; dz <= r + 1; dz++) {
    if (!inO(dx, dz, r + 1) || inO(dx, dz, r - 1)) continue;
    const ax = Math.abs(dx), az = Math.abs(dz);
    if ((ax === r + 1 && az <= 1) || (az === r + 1 && ax <= 1)) continue;
    P(t.x + dx, t.y1 + 2, t.z + dz, SNOW);
  }
}

// ---------- surroundings ----------
function stairs(P) {
  for (const sx of [-6, 6]) for (let x = sx - 1; x <= sx + 1; x++) for (let k = 0; k <= 3; k++) {
    const z = -10 - k, top = 3 - k;
    for (let y = 0; y <= top; y++) P(x, y, z, y === top ? SNOW : STONE);
  }
}
function plaza(P) {
  for (let x = -16; x <= 16; x++) for (let z = -18; z <= -10; z++) {
    if (footAny(x, z)) continue;
    const ax = Math.abs(x);
    if (z >= -13 && ax >= 5 && ax <= 7) continue;
    let id = SNOW;
    if ((ax >= 5 && ax <= 7 && z < -13) || ax <= 1) id = hash(x, 0, z) < 0.55 ? LIGHT_GRAY : SNOW;
    P(x, 0, z, id);
  }
}
function lamps(P) {
  for (const [x, z] of [[-3, -13], [3, -13], [-10, -12], [10, -12]]) {
    P(x, 1, z, IRON); P(x, 2, z, IRON); P(x, 3, z, IRON); P(x, 4, z, GLOWSTONE); P(x, 5, z, SNOW);
  }
}
function pine(P, x, z, y0, h) {
  P(x, y0, z, OAK_LOG); P(x, y0 + 1, z, OAK_LOG);
  const rs = [];
  for (let y = y0 + 2; y <= y0 + h; y++) {
    const s = (y - y0 - 2) / (h - 2);
    rs.push(2.8 * (1 - s) + (((y - y0) % 3 === 2) ? 0.7 : 0));
  }
  rs.push(-5);
  for (let i = 0; i < rs.length - 1; i++) {
    const y = y0 + 2 + i, r = rs[i], ra = rs[i + 1];
    for (let dx = -4; dx <= 4; dx++) for (let dz = -4; dz <= 4; dz++) {
      const d = Math.hypot(dx, dz);
      if (d > r + 0.3) continue;
      const up = d > ra + 0.3;
      if (!up && d < r - 1.1) continue;
      let id = GREEN;
      if (up && hash(x + dx, y, z + dz) < 0.7) id = SNOW;
      P(x + dx, y, z + dz, id);
    }
  }
}
function monument(P) {
  cube(0, 0, 0, 0, 0, 0, AIR); // no-op safety
  for (let x = -11; x <= -9; x++) for (let z = -17; z <= -15; z++) { P(x, 1, z, MARBLE); P(x, 2, z, MARBLE); P(x, 3, z, SNOW); }
  // Minin standing, arm raised
  P(-10, 3, -16, COPPER); P(-10, 4, -16, COPPER); P(-10, 5, -16, COPPER); P(-10, 6, -16, COPPER);
  P(-11, 5, -16, COPPER); P(-11, 6, -16, COPPER); P(-11, 7, -16, COPPER);
  // Pozharsky seated with shield
  P(-9, 3, -16, COPPER); P(-9, 4, -16, COPPER); P(-9, 3, -17, IRON);
}
function snowRing(P) {
  for (let x = -14; x <= 14; x++) for (let z = -9; z <= 16; z++) {
    if (x >= PX0 && x <= PX1 && z >= PZ0 && z <= PZ1) continue;
    if (footAny(x, z)) continue;
    P(x, 0, z, SNOW);
  }
}

// ---------- assemble (priority order) ----------
feature(plinth);
feature(central);
for (const t of BIG) feature(P => bigTower(P, t));
for (const t of SMALL) feature(P => smallTower(P, t));
feature(centralSnow);
for (const t of BIG) feature(P => bigSnow(P, t));
feature(stairs);
feature(lamps);
feature(plaza);
feature(P => pine(P, -16, -16, 1, 10));
feature(P => pine(P, 15, -16, 1, 11));
feature(monument);
feature(snowRing);
feature(P => pine(P, -17, 6, 0, 10));
feature(P => pine(P, 17, 6, 0, 11));
feature(P => pine(P, -15, 16, 0, 9));
feature(P => pine(P, 15, 16, 0, 10));

// clear trees / rocks from the site and the front view
cube(-18, 1, -20, 18, 9, 17, AIR);

for (const v of placed.values()) block(v[0], v[1], v[2], v[3]);