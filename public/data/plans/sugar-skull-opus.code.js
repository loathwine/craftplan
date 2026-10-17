// sugar-skull-opus — prompt:
// a Day of the Dead sugar skull...

cube(-20, 1, -15, 20, 14, 12, AIR);

const M = new Map();
const P = new Map();
function put(x, y, z, id, map) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  (map || M).set(x + ',' + y + ',' + z, [x, y, z, id]);
}
const ell = (x, y, z, cx, cy, cz, rx, ry, rz) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1;
const sph = (x, y, z, cx, cy, cz, r) => (x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= r * r;
const N6 = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const hash = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };

function shape(x0, x1, y0, y1, z0, z1, ins, col) {
  const front = {};
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++)
    if (ins(x, y, z)) { front[x + ',' + y] = z; break; }
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
    if (!ins(x, y, z)) continue;
    if (!N6.some(([a, b, c]) => !ins(x + a, y + b, z + c))) continue;
    put(x, y, z, col(x, y, z, z <= front[x + ',' + y] + 1));
  }
  return front;
}

// ---------- main sugar skull ----------
const base = (x, y, z) =>
  ell(x, y, z, 0, 17, 2, 10.5, 10, 9) ||
  ell(x, y, z, 0, 10, -0.5, 8, 6, 7) ||
  ell(x, y, z, 0, 4.7, 0, 6, 4, 6);
const carved = (x, y, z) =>
  sph(x, y, z, -4.3, 14, -6.5, 3) || sph(x, y, z, 4.3, 14, -6.5, 3) ||
  sph(x, y, z, -0.8, 9.3, -7, 1.4) || sph(x, y, z, 0.8, 9.3, -7, 1.4) ||
  sph(x, y, z, 0, 10.2, -7, 1.2) || sph(x, y, z, 0, 11.2, -7, 0.9);
const skullIn = (x, y, z) => base(x, y, z) && !carved(x, y, z);

function pat(x, y) {
  const ax = Math.abs(x);
  if (ax <= 4 && y >= 5 && y <= 8) {
    if (y === 6) return BLACK;
    if ((y === 5 || y === 7) && (ax === 1 || ax === 3)) return BLACK;
    return WHITE;
  }
  if (y === 6 && ax === 5) return BLACK;
  const dn = Math.min(Math.hypot(x + 0.8, y - 9.3), Math.hypot(x - 0.8, y - 9.3), Math.hypot(x, y - 11.2));
  if (dn < 2.4) return RED;
  for (const s of [-1, 1]) {
    const dx = x - s * 4.3, dy = y - 14, r = Math.hypot(dx, dy), t = Math.atan2(dy, dx);
    if (r >= 2.6 && r <= 4.5) {
      if (Math.cos(8 * t) > 0) return s < 0 ? (r > 3.6 ? BLUE : CYAN) : (r > 3.6 ? RED : ORANGE);
      return WHITE;
    }
  }
  {
    const dx = x, dy = y - 22.5, r = Math.hypot(dx, dy), t = Math.atan2(dy, dx);
    if (r < 1.2) return YELLOW;
    if (r < 2.1) return ORANGE;
    if (r < 4.1 && Math.cos(6 * t + Math.PI / 6) > -0.15) return r > 3.1 ? PURPLE : MAGENTA;
    if (r >= 4.5 && r <= 5.3 && Math.cos(12 * t) > 0.4) return CYAN;
  }
  for (const s of [-1, 1]) {
    const dx = x - s * 8.3, dy = y - 20.5, r = Math.hypot(dx, dy), t = Math.atan2(dy, dx);
    if (r < 0.9) return YELLOW;
    if (r < 2.4 && Math.cos(5 * t) > 0.1) return s < 0 ? PINK : LIME;
  }
  for (const s of [-1, 1]) {
    const dx = x - s * 6.5, dy = y - 7.5, r = Math.hypot(dx, dy), t = Math.atan2(dy, dx);
    if (r < 0.8) return s < 0 ? LIME : PINK;
    if (r >= 1.3 && r <= 2.1 && Math.cos(4 * t) > 0.3) return s < 0 ? GREEN : MAGENTA;
  }
  {
    const dx = x, dy = y - 2.8, r = Math.hypot(dx, dy), t = Math.atan2(dy, dx);
    if (r < 0.8) return YELLOW;
    if (r < 2.0 && Math.cos(4 * t) > 0) return RED;
  }
  return WHITE;
}

const front = shape(-12, 12, 0, 28, -10, 12, skullIn, (x, y, z, isFront) => {
  for (const [a, b, c] of N6) {
    const nx = x + a, ny = y + b, nz = z + c;
    if (base(nx, ny, nz) && carved(nx, ny, nz)) return BLACK;
  }
  return isFront ? pat(x, y) : WHITE;
});
for (const ex of [-4, 4]) { const fz = front[ex + ',14']; if (fz !== undefined) put(ex, 14, fz, GLOWSTONE); }

// ---------- flower crown ----------
const crownCols = [ORANGE, RED, MAGENTA, ORANGE, YELLOW, RED, ORANGE, MAGENTA, YELLOW, RED, ORANGE];
for (let i = 0; i < 11; i++) {
  const phi = (-80 + i * 16) * Math.PI / 180;
  const cx = 11 * Math.sin(phi), cy = 17 + 10.6 * Math.cos(phi), cz = 1;
  const col = crownCols[i];
  const r = (i % 2 === 0) ? 1.7 : 1.4;
  for (let x = Math.floor(cx - 2); x <= cx + 2; x++)
    for (let y = Math.floor(cy - 2); y <= cy + 2; y++)
      for (let z = Math.floor(cz - 2); z <= cz + 2; z++)
        if (sph(x, y, z, cx, cy, cz, r)) put(x, y, z, hash(x, y, z) < 0.18 && col === ORANGE ? YELLOW : col);
  put(cx, cy, cz - r, col === YELLOW ? ORANGE : (col === RED ? BRICK : YELLOW));
  if (i < 10) {
    const p2 = phi + 8 * Math.PI / 180;
    const lx = 11.3 * Math.sin(p2), ly = 17 + 10.9 * Math.cos(p2);
    put(lx, ly, 0, GREEN); put(lx, ly, 2, LEAVES); put(lx, ly, -1, LEAVES);
  }
}

// ---------- mini sugar skulls ----------
function miniSkull(cx, cz, a, b) {
  const ins = (x, y, z) => ell(x, y, z, cx, 3.3, cz, 2.7, 2.6, 2.4) || ell(x, y, z, cx, 1.6, cz - 0.3, 1.9, 1.2, 1.9);
  shape(cx - 4, cx + 4, 1, 7, cz - 4, cz + 4, ins, (x, y, z, f) => {
    if (!f) return WHITE;
    const dx = x - cx;
    if (y === 3 && Math.abs(dx) === 1) return BLACK;
    if (y === 2 && dx === 0) return BLACK;
    if (y === 1 && Math.abs(dx) <= 1) return BLACK;
    if (y === 5 && dx === 0) return a;
    if ((y === 4 || y === 3) && Math.abs(dx) === 2) return b;
    return WHITE;
  });
  put(cx + 1, 6, cz, a); put(cx + 1, 6, cz - 1, YELLOW); put(cx + 2, 6, cz, a);
}
miniSkull(-12, -6, MAGENTA, CYAN);
miniSkull(12, -6, ORANGE, LIME);
miniSkull(-15, 4, LIME, PURPLE);
miniSkull(15, 4, CYAN, PINK);

// ---------- candles ----------
function candle(x, z, h, col) {
  put(x, 1, z, GOLD);
  for (let y = 2; y <= h + 1; y++) put(x, y, z, col);
  put(x, h + 2, z, FIRE);
}
candle(-15, -10, 4, WHITE); candle(-8, -10, 2, SAND); candle(-5, -11, 1, WHITE);
candle(15, -10, 4, WHITE); candle(8, -10, 2, SAND); candle(5, -11, 1, WHITE);
candle(-16, 8, 7, SAND); candle(16, 8, 7, SAND);
candle(-10, 7, 5, WHITE); candle(10, 7, 5, WHITE);

// ---------- marigold vases ----------
function marigolds(cx, cz) {
  for (let y = 1; y <= 2; y++) for (let x = cx - 1; x <= cx + 1; x++) for (let z = cz - 1; z <= cz + 1; z++)
    if (Math.abs(x - cx) + Math.abs(z - cz) <= 1) put(x, y, z, y === 2 && x === cx && z === cz - 1 ? GOLD : BRICK);
  for (let x = cx - 2; x <= cx + 2; x++) for (let y = 3; y <= 6; y++) for (let z = cz - 2; z <= cz + 2; z++)
    if (sph(x, y, z, cx, 4.3, cz, 1.9)) put(x, y, z, hash(x, y, z) < 0.3 ? YELLOW : ORANGE);
  put(cx, 3, cz - 2, GREEN);
}
marigolds(-16, -2);
marigolds(16, -2);

// ---------- marigold petal path ----------
for (let x = -2; x <= 2; x++) for (let z = -12; z <= -8; z++) {
  const h = hash(x, 1, z);
  if (Math.abs(x) <= 1 || h < 0.5) put(x, 1, z, h < 0.6 ? ORANGE : YELLOW);
}
put(-3, 1, -9, ORANGE); put(3, 1, -10, YELLOW);

// ---------- papel picado banner ----------
for (const px of [-19, 19]) { for (let y = -1; y <= 32; y++) put(px, y, 9, OAK_LOG); }
const sy = x => Math.round(32 - 2.5 * (1 - (x / 19) ** 2));
for (let x = -18; x <= 18; x++) put(x, sy(x), 9, GRAY);
const flagCols = [MAGENTA, CYAN, YELLOW, LIME, ORANGE, PURPLE, PINK, LIGHT_BLUE, RED, GREEN, YELLOW, MAGENTA];
for (let i = 0; i < 12; i++) {
  const x0 = -17 + i * 3, top = Math.min(sy(x0), sy(x0 + 1)) - 1;
  const c = flagCols[i];
  for (let dx = 0; dx <= 1; dx++) for (let dy = 0; dy <= 2; dy++) {
    if (dy === 1 && dx === (i & 1)) continue;
    put(x0 + dx, top - dy, 9, c);
  }
}

// ---------- ofrenda platform skirt ----------
for (let x = -17; x <= 17; x++) { put(x, -1, -12, BROWN); put(x, -2, -12, BROWN); }

// ---------- ofrenda platform (emitted last, front rows first) ----------
for (let z = -12; z <= 9; z++) for (let x = -17; x <= 17; x++) {
  if ((x / 6) ** 2 + ((z - 3) / 5) ** 2 < 1) continue;
  const edge = Math.min(x + 17, 17 - x, z + 12, 9 - z);
  let c = PURPLE;
  if (edge === 0) c = ((x + z) & 1) ? ORANGE : YELLOW;
  else if (edge === 1) c = MAGENTA;
  if (!M.has(x + ',0,' + z)) put(x, 0, z, c, P);
}

// ---------- emit ----------
let count = 0;
const LIMIT = 3990;
for (const [x, y, z, id] of M.values()) { if (count >= LIMIT) break; block(x, y, z, id); count++; }
for (const [x, y, z, id] of P.values()) { if (count >= LIMIT) break; block(x, y, z, id); count++; }