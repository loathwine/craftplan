// jungle-temple-opus — prompt:
// a jungle temple with a waterfall...

const M = new Map();
function S(x, y, z, id, p, soft) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (soft && M.has(k)) return;
  M.set(k, [x, y, z, id, p || 1]);
}
function getId(x, y, z) { const e = M.get(x + ',' + y + ',' + z); return e ? e[3] : undefined; }
function hh(x, y, z) {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}
function stoneAt(x, y, z, top) {
  const r = hh(x, y, z);
  if (top) { if (r < 0.22) return GREEN; if (r < 0.3) return LIME; if (r < 0.5) return COBBLE; if (r < 0.56) return GRAY; return STONE; }
  if (r < 0.1) return GREEN; if (r < 0.28) return COBBLE; if (r < 0.36) return GRAY; if (r < 0.4) return LIGHT_GRAY; return STONE;
}
function rockAt(x, y, z) {
  const r = hh(x, y + 200, z);
  if (r < 0.5) return STONE; if (r < 0.68) return COBBLE; if (r < 0.8) return GRAY; if (r < 0.92) return GREEN; return LIGHT_GRAY;
}
function lineS(x1, y1, z1, x2, y2, z2, id, p) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) { const t = i / n; S(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id, p); }
}

// ---------- clear jungle out of the temple footprint and the camera corridor ----------
cube(-12, 1, -11, 12, 9, 18, AIR);
cube(-8, 1, -22, 22, 9, -12, AIR);
cube(10, 1, -12, 22, 9, 1, AIR);

// ---------- stepped pyramid (hollow shells) ----------
const T = [
  [-11, -5, 11, 17, -1, 1],
  [-9, -3, 9, 15, 2, 4],
  [-7, -1, 7, 13, 5, 7],
  [-5, 1, 5, 11, 8, 10],
];
function tier(t, inner) {
  const [x1, z1, x2, z2, y1, y2] = t;
  for (let x = x1; x <= x2; x++) for (let z = z1; z <= z2; z++) {
    const edge = x === x1 || x === x2 || z === z1 || z === z2;
    if (edge) {
      for (let y = y1; y < y2; y++) {
        let id = stoneAt(x, y, z, false);
        const along = (z === z1 || z === z2) ? x : z;
        if (y === y1 + 1 && ((along % 3) + 3) % 3 === 0) id = GRAY;
        S(x, y, z, id, 1);
      }
    }
    const inIn = inner && x >= inner[0] && x <= inner[2] && z >= inner[1] && z <= inner[3];
    if (!inIn) S(x, y2, z, edge ? (hh(x, y2, z) < 0.6 ? COBBLE : STONE) : stoneAt(x, y2, z, true), 1);
  }
}
T.forEach((t, i) => tier(t, T[i + 1] || null));
function hidden(x, y, z) {
  for (const t of T) if (x > t[0] && x < t[2] && z > t[1] && z < t[3] && y >= t[4] && y <= t[5]) return true;
  return false;
}

// ---------- grand staircase (north face) with balustrades ----------
for (let i = 0; i <= 10; i++) {
  const y = i, z = -10 + i;
  for (let x = -2; x <= 2; x++) {
    const r = hh(x, y + 7, z);
    S(x, y, z, r < 0.18 ? GREEN : r < 0.45 ? COBBLE : STONE, 1);
    S(x, y - 1, z, STONE, 1);
    S(x, y + 1, z, AIR); S(x, y + 2, z, AIR);
  }
  for (const bx of [-3, 3]) {
    for (let by = -1; by <= y + 1; by++) {
      if (hidden(bx, by, z)) continue;
      S(bx, by, z, by === y + 1 ? COBBLE : stoneAt(bx, by, z, false), 1);
    }
  }
}

// ---------- feathered-serpent heads at the stair base ----------
for (const s of [-1, 1]) {
  const xa = 3 * s, xb = 4 * s;
  for (const x of [xa, xb]) {
    for (let z = -12; z <= -11; z++) for (let y = -1; y <= 2; y++) S(x, y, z, hh(x, y, z) < 0.35 ? GREEN : STONE, 1);
    S(x, 1, -13, COBBLE, 1);
    S(x, 0, -13, x === xa ? WHITE : AIR, 1);
    S(x, -1, -13, COBBLE, 1);
    S(x, 3, -11, GREEN, 1);
  }
  S(xb, 2, -12, NEON_RED, 1);
}

// ---------- summit shrine ----------
for (let x = -4; x <= 4; x++) for (let z = 2; z <= 10; z++) {
  const edge = x === -4 || x === 4 || z === 2 || z === 10;
  if (edge) for (let y = 11; y <= 14; y++) S(x, y, z, stoneAt(x, y, z, false), 1);
}
for (let x = -1; x <= 1; x++) for (let y = 11; y <= 13; y++) S(x, y, 2, AIR);
for (let y = 11; y <= 13; y++) { S(-2, y, 1, COBBLE, 1); S(2, y, 1, COBBLE, 1); }
for (let x = -2; x <= 2; x++) S(x, 14, 1, GOLD, 1);
// golden idol lit by lamps inside
S(0, 11, 7, COBBLE, 1); S(0, 12, 7, GOLD, 1); S(0, 13, 7, GOLD, 1); S(-1, 12, 7, GOLD, 1); S(1, 12, 7, GOLD, 1);
S(-3, 11, 9, GLOWSTONE, 1); S(3, 11, 9, GLOWSTONE, 1);
// stepped roof
for (let x = -5; x <= 5; x++) for (let z = 1; z <= 11; z++) {
  const edge = x === -5 || x === 5 || z === 1 || z === 11;
  S(x, 15, z, edge ? COBBLE : stoneAt(x, 15, z, true), 1);
}
for (let x = -3; x <= 3; x++) for (let z = 3; z <= 9; z++) S(x, 16, z, stoneAt(x, 16, z, true), 1);
for (let x = -2; x <= 2; x++) for (let z = 4; z <= 8; z++) S(x, 17, z, stoneAt(x, 17, z, true), 1);
// lattice roof comb
for (let x = -3; x <= 3; x++) for (let y = 18; y <= 21; y++) {
  if (y > 18 && y < 21 && Math.abs(x) < 3 && (x + y) % 2 === 0) continue;
  S(x, y, 6, stoneAt(x, y, 6, false), 1);
}
S(0, 22, 6, GOLD, 1); S(-3, 22, 6, COBBLE, 1); S(3, 22, 6, COBBLE, 1);

// ---------- braziers ----------
for (const s of [-1, 1]) {
  S(11 * s, 2, -5, COBBLE, 1); S(11 * s, 3, -5, FIRE, 1);
  S(9 * s, 5, -3, COBBLE, 1); S(9 * s, 6, -3, FIRE, 1);
  S(4 * s, 11, 1, COBBLE, 1); S(4 * s, 12, 1, FIRE, 1);
}

// ---------- raised causeway, steles, ruins ----------
for (let z = -22; z <= -11; z++) for (let x = -2; x <= 2; x++) {
  const r = hh(x, 40, z);
  S(x, 0, z, r < 0.12 ? GREEN : r < 0.2 ? GRASS : r < 0.55 ? COBBLE : STONE, 2);
}
for (let z = -22; z <= -14; z++) for (const x of [-3, 3]) if (hh(x, 41, z) < 0.35) S(x, 0, z, COBBLE, 5);
for (const sx of [-5, 5]) for (const sz of [-14, -19]) {
  for (let y = -1; y <= 3; y++) S(sx, y, sz, stoneAt(sx, y, sz, false), 2);
  S(sx, 4, sz, COBBLE, 2);
  S(sx, 5, sz, FIRE, 2);
}
lineS(-7, 0, -18, -6, 0, -14, COBBLE, 5);
S(-7, 1, -18, GREEN, 5);
for (let x = 6; x <= 9; x++) {
  const h = 1 + Math.floor(hh(x, 42, -13) * 2);
  for (let y = 0; y < h; y++) S(x, y, -13, stoneAt(x, y, -13, false), 5);
}

// ---------- cliff with waterfall (east) ----------
const CX = 17.5, CZ = 9, RX = 5.2, RZ = 7.2, L = 15;
const HM = new Map(), CH = new Set();
const ck = (x, z) => x + ',' + z;
for (let x = 11; x <= 22; x++) for (let z = 0; z <= 18; z++) {
  const e = ((x - CX) / RX) ** 2 + ((z - CZ) / RZ) ** 2;
  if (e + (hh(x, 90, z) - 0.5) * 0.3 > 1) continue;
  const d = Math.sqrt(Math.min(1, e));
  const front = 4 * Math.max(0, 1 - (z - 1) / 9);
  HM.set(ck(x, z), 12 + Math.round(5 * (1 - d) + front + (hh(x, 91, z) - 0.5) * 2.5));
}
function computeFront() {
  const f = new Map();
  for (const k of HM.keys()) { const [x, z] = k.split(',').map(Number); if (!f.has(x) || z < f.get(x)) f.set(x, z); }
  return f;
}
let frontZ = computeFront();
let zmin = 99;
for (let x = 16; x <= 18; x++) {
  const z0 = frontZ.get(x); if (z0 === undefined) continue;
  zmin = Math.min(zmin, z0);
  for (let z = z0; z <= z0 + 5; z++) { HM.set(ck(x, z), L); CH.add(ck(x, z)); }
  const bk = ck(x, z0 + 6);
  HM.set(bk, Math.max(HM.get(bk) || 0, L + 2));
}
for (const x of [15, 19]) for (let z = zmin; z <= zmin + 6; z++) {
  const k = ck(x, z); if (CH.has(k)) continue;
  HM.set(k, Math.max(HM.get(k) || 0, L + 1 + (hh(x, 92, z) < 0.5 ? 1 : 0)));
}
frontZ = computeFront();
const NB = [[1, 0], [-1, 0], [0, 1], [0, -1]];
for (const [k, H] of HM) {
  const [x, z] = k.split(',').map(Number);
  let minN = Infinity, adjC = false;
  for (const [dx, dz] of NB) {
    const kk = ck(x + dx, z + dz);
    const n = HM.has(kk) ? HM.get(kk) : -2;
    if (n < minN) minN = n;
    if (CH.has(kk)) adjC = true;
  }
  const isC = CH.has(k);
  let bottom = Math.min(minN + 1, H);
  if (isC || adjC) bottom = Math.min(bottom, L - 1);
  bottom = Math.max(bottom, -1);
  for (let y = bottom; y <= H; y++) {
    let id;
    if (y === H) {
      if (isC) id = WATER;
      else { const r = hh(x, 93, z); id = r < 0.62 ? GRASS : r < 0.85 ? GREEN : LIME; }
    } else if (y === H - 1 && !isC) id = hh(x, y, z) < 0.5 ? GREEN : DIRT;
    else id = rockAt(x, y, z);
    S(x, y, z, id, 2);
  }
  if (!isC) {
    const r = hh(x, 95, z);
    if (r < 0.2) S(x, H + 1, z, LEAVES, 4, true);
    if (r < 0.06) S(x, H + 2, z, LEAVES, 4, true);
  }
}

// ---------- plunge pool ----------
const PX = 16.5, PZ = -4.5, PRX = 4.6, PRZ = 5.6;
const pd = (x, z) => Math.sqrt(((x - PX) / PRX) ** 2 + ((z - PZ) / PRZ) ** 2);
const inPool = (x, z) => pd(x, z) <= 1 && !HM.has(ck(x, z));
for (let x = 10; x <= 22; x++) for (let z = -12; z <= 3; z++) {
  if (HM.has(ck(x, z))) continue;
  const d = pd(x, z);
  if (d <= 1) {
    S(x, 0, z, AIR); S(x, 1, z, AIR);
    S(x, -1, z, WATER, 2);
    if (d < 0.62) { S(x, -2, z, WATER, 2); S(x, -3, z, SAND, 2); }
    else S(x, -2, z, hh(x, 80, z) < 0.3 ? COBBLE : SAND, 2);
  } else if (d <= 1.28) {
    const r = hh(x, 81, z);
    const id = r < 0.25 ? GREEN : r < 0.55 ? COBBLE : STONE;
    S(x, -1, z, id, 2, true); S(x, 0, z, id, 2, true);
    if (r < 0.18) S(x, 1, z, r < 0.08 ? LEAVES : STONE, 5, true);
  }
}
for (const [x, z] of [[13, -6], [14, -8], [19, -8], [19, -3]]) if (inPool(x, z)) S(x, -1, z, LIME, 5);

// ---------- waterfall sheet ----------
for (let x = 16; x <= 18; x++) {
  const z0 = frontZ.get(x); if (z0 === undefined) continue;
  for (let z = z0 - 2; z >= -2; z--) if (!inPool(x, z)) { S(x, -1, z, WATER, 2); S(x, 0, z, AIR); S(x, -2, z, SAND, 2, true); }
}
for (let x = 16; x <= 18; x++) {
  const z0 = frontZ.get(x); if (z0 === undefined) continue;
  S(x, -2, z0 - 1, SAND, 2, true);
  for (let y = -1; y <= L; y++) S(x, y, z0 - 1, WATER, 1);
  if (x === 17) for (let y = 0; y <= L - 3; y++) S(x, y, z0 - 2, WATER, 2);
}
// foam at the base
{
  const zf = frontZ.get(17) !== undefined ? frontZ.get(17) : 2;
  for (let x = 15; x <= 19; x++) for (let z = zf - 2; z >= zf - 4; z--) {
    if (getId(x, -1, z) === WATER && hh(x, 85, z) < 0.35) S(x, -1, z, WHITE, 2);
    if (hh(x, 86, z) < 0.12 && getId(x, 0, z) !== WATER) S(x, 0, z, WHITE, 5);
  }
}
// small side spring + stream
{
  const x = 20, z0 = frontZ.get(x);
  if (z0 !== undefined) {
    const top = Math.min(9, HM.get(ck(x, z0)) - 4);
    for (let z = z0 - 1; z >= -3; z--) { if (inPool(x, z)) break; S(x, -1, z, WATER, 2); S(x, 0, z, AIR); S(x, -2, z, SAND, 2, true); }
    for (let y = -1; y <= top; y++) S(x, y, z0 - 1, WATER, 2);
  }
}
// vines down the cliff face
for (const [x, z0] of frontZ) {
  if (x >= 15 && x <= 20) continue;
  if (hh(x, 97, z0) > 0.55) continue;
  const H = HM.get(ck(x, z0));
  const len = 3 + Math.floor(hh(x, 98, z0) * 5);
  for (let j = 0; j < len; j++) S(x, H - j, z0 - 1, j % 3 === 2 ? LEAVES : GREEN, 5, true);
}

// ---------- jungle trees ----------
function canopy(cx, cy, cz, r) {
  const layers = [[-1, r - 1], [0, r], [1, r - 1], [2, Math.max(1, r - 2.5)]];
  for (const [dy, rr] of layers) {
    for (let px = Math.floor(cx - rr - 1); px <= Math.ceil(cx + rr + 1); px++)
      for (let pz = Math.floor(cz - rr - 1); pz <= Math.ceil(cz + rr + 1); pz++) {
        if (Math.hypot(px - cx, pz - cz) > rr + 0.35) continue;
        if (hh(px, cy + dy, pz) < 0.12) continue;
        S(px, cy + dy, pz, LEAVES, 4, true);
      }
  }
  for (let k = 0; k < 6; k++) {
    const a = k * 1.05 + hh(Math.round(cx), k, Math.round(cz)) * 0.8;
    const px = Math.round(cx + Math.cos(a) * (r - 0.5)), pz = Math.round(cz + Math.sin(a) * (r - 0.5));
    const len = 2 + Math.floor(hh(px, 99, pz) * 3);
    for (let j = 1; j <= len; j++) S(px, cy - 1 - j, pz, j % 2 ? GREEN : LEAVES, 5, true);
  }
}
function leafBlob(cx, cy, cz, r) {
  for (let dy = 0; dy <= 1; dy++) {
    const rr = dy ? r - 0.8 : r;
    for (let px = Math.floor(cx - rr - 1); px <= Math.ceil(cx + rr + 1); px++)
      for (let pz = Math.floor(cz - rr - 1); pz <= Math.ceil(cz + rr + 1); pz++)
        if (Math.hypot(px - cx, pz - cz) <= rr + 0.3) S(px, cy + dy, pz, LEAVES, 4, true);
  }
}
function jtree(x, by, z, h, big, r) {
  const w = big ? 1 : 0;
  for (let y = by - 1; y <= by + h; y++)
    for (let dx = 0; dx <= w; dx++) for (let dz = 0; dz <= w; dz++) S(x + dx, y, z + dz, OAK_LOG, 3);
  const roots = big ? [[-1, 0], [2, 1], [0, -1], [1, 2], [-1, 1], [2, 0]] : [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [rx, rz] of roots) {
    S(x + rx, by, z + rz, OAK_LOG, 3);
    if (big && hh(x + rx, by, z + rz) < 0.5) S(x + rx, by + 1, z + rz, OAK_LOG, 3);
  }
  const cx = x + w / 2, cz = z + w / 2, top = by + h;
  if (big) {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let b = 0; b < 4; b++) {
      if (hh(x, b, z) < 0.25) continue;
      const [dx, dz] = dirs[b];
      const sy = top - 3 - (b % 2);
      const ex = cx + dx * 4, ez = cz + dz * 4, ey = sy + 2;
      lineS(cx + dx, sy, cz + dz, ex, ey, ez, OAK_LOG, 3);
      leafBlob(ex, ey + 1, ez, 2);
    }
  }
  canopy(cx, top, cz, r);
}
jtree(-17, 0, 3, 13, true, 4);
jtree(-7, 1, 19, 13, false, 3.5);
jtree(8, 0, 20, 12, false, 3.5);
if (HM.has(ck(20, 12))) jtree(20, HM.get(ck(20, 12)) + 1, 12, 4, false, 2.5);
if (HM.has(ck(14, 9))) jtree(14, HM.get(ck(14, 9)) + 1, 9, 5, false, 2.5);

// ---------- overgrowth on the pyramid ----------
T.forEach((t, ti) => {
  const [x1, z1, x2, z2, y1, y2] = t;
  const hang = (x, z) => {
    if (hh(x, 60 + ti, z) > 0.25) return;
    const len = 1 + Math.floor(hh(x, 61, z) * (y2 - y1 + 1));
    for (let j = 0; j < len; j++) S(x, y2 - j, z, j % 2 ? LEAVES : GREEN, 5, true);
  };
  for (let x = x1; x <= x2; x++) if (Math.abs(x) > 3) hang(x, z1 - 1);
  for (let z = z1; z <= z2; z++) { hang(x1 - 1, z); hang(x2 + 1, z); }
  if (ti === 3) return;
  const inner = T[ti + 1];
  for (let x = x1 + 1; x < x2; x++) for (let z = z1 + 1; z < z2; z++) {
    if (x >= inner[0] && x <= inner[2] && z >= inner[1] && z <= inner[3]) continue;
    if (Math.abs(x) <= 3 && z <= 1) continue;
    if (hh(x, 77, z) < 0.07) S(x, y2 + 1, z, LEAVES, 5, true);
  }
});
for (const x of [-5, -3, 3, 5]) if (hh(x, 70, 0) < 0.7) {
  const len = 2 + Math.floor(hh(x, 71, 0) * 3);
  for (let j = 0; j < len; j++) S(x, 14 - j, 0, j % 2 ? LEAVES : GREEN, 5, true);
}
for (let z = 1; z <= 11; z++) for (const x of [-6, 6]) if (hh(x, 72, z) < 0.25) {
  const len = 2 + Math.floor(hh(x, 73, z) * 3);
  for (let j = 0; j < len; j++) S(x, 14 - j, z, j % 2 ? LEAVES : GREEN, 5, true);
}

// ---------- emit within budget ----------
const LIMIT = 3980;
const entries = [...M.values()];
const solidIdx = [];
entries.forEach((e, i) => { if (e[3] !== AIR) solidIdx.push(i); });
const drop = new Set();
if (solidIdx.length > LIMIT) {
  solidIdx.sort((a, b) => (entries[b][4] - entries[a][4]) || (b - a));
  for (let i = 0; i < solidIdx.length - LIMIT; i++) drop.add(solidIdx[i]);
}
entries.forEach((e, i) => { if (!drop.has(i)) block(e[0], e[1], e[2], e[3]); });