// pikachu-n-sonnet55 — prompt:
// Pikachu...

const M = new Map();
const put = (x, y, z, id) => {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (Math.abs(x) > 22 || Math.abs(z) > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, id);
};
const lim = 3980;
const putLow = (x, y, z, id) => { if (M.size < lim) put(x, y, z, id); };
const has = (x, y, z) => M.has(x + ',' + y + ',' + z);

function ell(cx, cy, cz, rx, ry, rz, f, low) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) {
          const id = typeof f === 'function' ? f(x, y, z) : f;
          if (id) (low ? putLow : put)(x, y, z, id);
        }
      }
}
function tline(ax, ay, bx, by, cz, R, rz, f) {
  const d = Math.hypot(bx - ax, by - ay);
  const n = Math.ceil(d * 2);
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    ell(ax + (bx - ax) * t, ay + (by - ay) * t, cz, R, R, rz, f);
  }
}

// clear trees / terrain bumps in the footprint
cube(-15, 0, -9, 20, 32, 10, AIR);

// ---------- dimensions ----------
const HX = 0, HY = 16, HZ = -1, HRX = 7, HRY = 5.5, HRZ = 5.5;
const inHead = (x, y, z) => {
  const dx = (x - HX) / HRX, dy = (y - HY) / HRY, dz = (z - HZ) / HRZ;
  return dx * dx + dy * dy + dz * dz <= 1;
};
const front = (x, y) => {
  for (let z = -15; z <= 15; z++) if (inHead(x, y, z)) return z;
  return null;
};

// ---------- feet ----------
for (const s of [-1, 1]) {
  ell(s * 3, 1.5, -3, 2.4, 1.8, 3.3, YELLOW);
  // toe marks
  for (const tx of [-1, 0, 1]) put(s * 3 + tx, 0, -6, BROWN);
}

// ---------- body ----------
ell(0, 7.5, 1, 5.5, 6, 4.5, (x, y, z) => {
  if (z - 1 >= 2.8 && ((y >= 8 && y <= 9) || (y >= 5 && y <= 6))) return BROWN;
  return YELLOW;
});

// ---------- arms ----------
for (const s of [-1, 1]) {
  ell(s * 6.3, 8, -1.5, 1.5, 2.8, 1.7, YELLOW);
  ell(s * 6.0, 5.6, -2.4, 1.1, 1.0, 1.1, YELLOW);
}

// ---------- head ----------
ell(HX, HY, HZ, HRX, HRY, HRZ, YELLOW);

// ---------- ears ----------
for (const s of [-1, 1]) {
  for (let i = 0; i <= 13; i++) {
    const cx = s * (4 + 0.3 * i), cy = 19 + 0.9 * i, cz = 0 + 0.1 * i;
    const rx = 2.1 - 0.1 * i;
    ell(cx, cy, cz, rx, 1.3, 1.3 - 0.02 * i, i >= 10 ? BLACK : YELLOW);
  }
}

// ---------- face ----------
for (const s of [-1, 1]) {
  // eyes: 2 wide x 3 tall
  for (const ax of [3, 4]) for (let y = HY; y <= HY + 2; y++) {
    const x = s * ax, z = front(x, y);
    if (z !== null) { put(x, y, z, BLACK); put(x, y, z + 1, BLACK); }
  }
  // highlights
  const hx = s * 3, hz = front(hx, HY + 2);
  if (hz !== null) put(hx, HY + 2, hz, WHITE);
  const hx2 = s * 3, hz2 = front(hx2, HY + 1);
  if (hz2 !== null && false) put(hx2, HY + 1, hz2, WHITE);
  // cheeks
  const ccx = s * 5.6, ccy = HY - 1.5;
  for (let x = Math.floor(ccx - 3); x <= Math.ceil(ccx + 3); x++)
    for (let y = Math.floor(ccy - 3); y <= Math.ceil(ccy + 3); y++) {
      const d = Math.hypot(x - ccx, y - ccy);
      if (d <= 2.3) {
        const z = front(x, y);
        if (z !== null) {
          put(x, y, z, RED);
          if (d <= 1.4) put(x, y, z - 1, RED);
        }
      }
    }
}
// nose
{ const z = front(0, HY - 1); if (z !== null) put(0, HY - 1, z, BLACK); }
// mouth
for (const [mx, my] of [[-2, HY - 4], [-1, HY - 5], [0, HY - 5], [1, HY - 5], [2, HY - 4]]) {
  const z = front(mx, my);
  if (z !== null) put(mx, my, z, BLACK);
}
{ const z = front(0, HY - 6); if (z !== null) put(0, HY - 6, z, PINK); }

// ---------- tail (lightning bolt, behind & to the east) ----------
const tailCol = (x, y, z) => (y < 8 ? BROWN : YELLOW);
const TZ = 5.6;
tline(0, 4, 7, 10, TZ, 2.0, 1.8, tailCol);
tline(7, 10, 3, 13, TZ, 2.0, 1.8, tailCol);
tline(3, 13, 11, 20, TZ, 2.0, 1.8, YELLOW);
tline(10, 21, 17, 24, TZ, 2.7, 1.8, YELLOW);

// ---------- ground base ----------
for (let x = -13; x <= 17; x++)
  for (let z = -8; z <= 9; z++) {
    const dx = (x - 2) / 14.5, dz = z / 8.8;
    if (dx * dx + dz * dz <= 1) putLow(x, -1, z, GRASS);
  }

// ---------- Poke Ball ----------
{
  const cx = -11, cy = 3, cz = -3, r = 3;
  ell(cx, cy, cz, r, r, r, (x, y, z) => {
    if ((x - cx) ** 2 + (y - cy) ** 2 <= 2 && z < cz - 1.8) return WHITE;
    if (y === cy) return BLACK;
    return y > cy ? RED : WHITE;
  }, true);
  putLow(cx, cy, cz - 4, BLACK);
}

// ---------- trees (depth) ----------
function tree(x, z, h) {
  for (let y = 0; y < h; y++) putLow(x, y, z, OAK_LOG);
  ell(x, h + 1.5, z, 3, 2.6, 3, LEAVES, true);
  ell(x, h + 3.5, z, 1.7, 1.5, 1.7, LEAVES, true);
}
tree(-18, -4, 5);
tree(-17, 9, 6);
tree(17, 13, 5);
tree(-8, 15, 6);

// ---------- ground detail ----------
for (let x = -13; x <= 17; x++)
  for (let z = -8; z <= 9; z++) {
    if (has(x, -1, z) && !has(x, 0, z) && M.get(x + ',-1,' + z) === GRASS) {
      const h = (((x * 73856093) ^ (z * 19349663)) >>> 0) % 31;
      if (h === 0) putLow(x, 0, z, PINK);
      else if (h === 1) putLow(x, 0, z, WHITE);
      else if (h === 2) putLow(x, 0, z, YELLOW);
      else if (h === 3 || h === 4 || h === 5) putLow(x, 0, z, GREEN);
      else if (h === 6) putLow(x, 0, z, STONE);
    }
  }

// ---------- electricity (few cells only) ----------
for (const [x, y, z] of [
  [-9, 14, -4], [9, 14, -4],
  [-10, 19, -1], [10, 19, -1],
  [-10, 31, 0], [10, 31, 0],
  [17, 28, 6], [21, 22, 6],
]) put(x, y, z, ELECTRIC);

// ---------- flush ----------
for (const [k, id] of M) {
  const [x, y, z] = k.split(',').map(Number);
  block(x, y, z, id);
}