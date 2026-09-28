// pikachu-n-opus — prompt:
// Pikachu...

cylinder(0, 0, 0, 14, 15, AIR);

const M = new Map();
const put = (x, y, z, id) => { M.set(x + ',' + y + ',' + z, id); };
const H = (i) => { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
const ell = (cx, cy, cz, rx, ry, rz) => (x, y, z) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1;

function shape(pred, x1, y1, z1, x2, y2, z2, idFn) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) {
    if (!pred(x, y, z)) continue;
    if (pred(x + 1, y, z) && pred(x - 1, y, z) && pred(x, y + 1, z) && pred(x, y - 1, z) && pred(x, y, z + 1) && pred(x, y, z - 1)) continue;
    const id = idFn(x, y, z);
    if (id != null) put(x, y, z, id);
  }
}
function pcube(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function pdisk(cx, y, cz, r, idFn) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++)
      if ((x - cx) ** 2 + (z - cz) ** 2 <= r * r) put(x, y, z, typeof idFn === 'function' ? idFn(x, z) : idFn);
}
function stroke(a, b, ra, rb, id, zScale) {
  const zs = zScale || 1;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(L / 0.3));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const c = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const r = ra + (rb - ra) * t, rz = Math.max(0.6, r * zs);
    for (let x = Math.floor(c[0] - r); x <= Math.ceil(c[0] + r); x++)
      for (let y = Math.floor(c[1] - r); y <= Math.ceil(c[1] + r); y++)
        for (let z = Math.floor(c[2] - rz); z <= Math.ceil(c[2] + rz); z++)
          if (((x - c[0]) / r) ** 2 + ((y - c[1]) / r) ** 2 + ((z - c[2]) / rz) ** 2 <= 1) put(x, y, z, id);
  }
}
function flat(a, b, ra, rb, z1, z2, id) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.ceil(L / 0.3));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t;
    const r = ra + (rb - ra) * t;
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
      for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) for (let z = z1; z <= z2; z++) put(x, y, z, id);
  }
}

// ---------- Ground plaza ----------
pdisk(0, -1, 0, 14.3, GRASS);

// stepping-stone path from the north
for (let z = -14; z <= -7; z += 2) {
  const x = Math.round(Math.sin(z * 0.6) * 1.5);
  put(x, -1, z, STONE); put(x - 1, -1, z, COBBLE); put(x, -1, z + 1, COBBLE);
}

// ---------- Pikachu ----------
const headIn = ell(0, 15.5, 0, 7.5, 6, 6);
const body1 = ell(0, 6, 1.5, 5, 5.6, 4.5);
const body2 = ell(0, 4, 1.2, 5.6, 4, 4.8);
const bodyIn = (x, y, z) => body1(x, y, z) || body2(x, y, z);
const pikaIn = (x, y, z) => headIn(x, y, z) || bodyIn(x, y, z);
shape(pikaIn, -9, 0, -8, 9, 23, 8, () => YELLOW);

// feet
for (const s of [-1, 1]) shape(ell(2.8 * s, 0.6, -2.2, 1.8, 1.1, 2.6), -6, 0, -6, 6, 2, 2, () => YELLOW);

// arms: left resting on belly, right raised charging a thunderbolt
stroke([-3.5, 9, 0], [-4.2, 7, -4.3], 1.35, 1.2, YELLOW);
stroke([3.5, 9.5, 0], [8.5, 13, -2.5], 1.35, 1.3, YELLOW);
put(9, 14, -3, YELLOW); put(8, 14, -3, YELLOW);

// ears (flat, black tips)
for (const s of [-1, 1]) {
  const a = [3.5 * s, 20, 0.5], b = [9.5 * s, 30, 1.5];
  const n = 45;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const c = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const r = t < 0.35 ? 1.5 + t * 1.3 : (1 - (t - 0.35) / 0.65) * 1.95 + 0.45;
    const rz = Math.max(0.6, r * 0.55);
    const id = t > 0.7 ? BLACK : YELLOW;
    for (let x = Math.floor(c[0] - r); x <= Math.ceil(c[0] + r); x++)
      for (let y = Math.floor(c[1] - r); y <= Math.ceil(c[1] + r); y++)
        for (let z = Math.floor(c[2] - rz); z <= Math.ceil(c[2] + rz); z++)
          if (((x - c[0]) / r) ** 2 + ((y - c[1]) / r) ** 2 + ((z - c[2]) / rz) ** 2 <= 1) put(x, y, z, id);
  }
}

// lightning-bolt tail (flat, facing north, rising to the east)
const tp = [[1, 3], [5, 5], [3.5, 8.5], [9, 11], [7, 13.5], [14, 21]];
const tr = [0.8, 1.0, 1.2, 1.5, 1.8, 2.8];
for (let i = 0; i < tp.length - 1; i++) flat(tp[i], tp[i + 1], tr[i], tr[i + 1], 6, 7, i === 0 ? BROWN : YELLOW);
put(0, 3, 5, BROWN); put(1, 3, 5, BROWN);

// brown back stripes
const backPaint = (x, y, id) => { for (let z = 9; z >= -2; z--) if (bodyIn(x, y, z)) { if (!headIn(x, y, z)) put(x, y, z, id); return; } };
for (const y of [6, 7]) for (let x = -3; x <= 3; x++) backPaint(x, y, BROWN);
for (const y of [9, 10]) for (let x = -2; x <= 2; x++) backPaint(x, y, BROWN);

// face
const paint = (x, y, id) => { for (let z = -8; z <= 6; z++) if (headIn(x, y, z)) { put(x, y, z, id); return; } };
for (const ex of [-4, -3, 3, 4]) for (let y = 15; y <= 17; y++) paint(ex, y, BLACK);
paint(4, 17, WHITE); paint(-3, 17, WHITE);
paint(0, 14, BLACK);
paint(0, 13, BLACK); paint(-1, 12, BLACK); paint(1, 12, BLACK); paint(-2, 13, BLACK); paint(2, 13, BLACK);
paint(0, 12, PINK);
for (const s of [-1, 1]) for (const [cx, cy] of [[3, 12], [4, 11], [4, 12], [4, 13], [5, 12], [5, 13], [5, 11]]) paint(cx * s, cy, RED);

// ---------- Poké Ball (foreground west) ----------
{
  const cx = -10, cy = 2, cz = -7;
  shape(ell(cx, cy, cz, 2.5, 2.5, 2.5), cx - 3, 0, cz - 3, cx + 3, 5, cz + 3, (x, y) => y > cy ? RED : (y < cy ? WHITE : BLACK));
  put(cx, cy + 1, cz - 2, BLACK); put(cx, cy - 1, cz - 2, BLACK);
  put(cx, cy, cz - 3, WHITE);
}

// ---------- Ketchup bottle (Pikachu's favorite) ----------
pcube(-6, 0, -6, -5, 2, -5, RED);
pcube(-6, 1, -6, -5, 1, -6, WHITE);
pcube(-6, 3, -6, -5, 3, -5, WHITE);
put(-6, 4, -6, RED);

// ---------- Thunderstruck rocks (foreground east) ----------
pdisk(11, -1, -6, 3.6, (x, z) => H(x * 17 + z * 5) < 0.5 ? BLACK : GRAY);
stroke([11, 0, -6], [11, 1, -6], 2, 1.6, STONE);
stroke([13, 0, -3.5], [13, 0.5, -3.5], 1.4, 1.1, COBBLE);
stroke([9, 0, -8.5], [9, 0, -8.5], 1.1, 1.1, STONE);
put(11, 3, -6, COBBLE);

// ---------- Berry tree (background west) ----------
pcube(-11, 0, 7, -11, 7, 7, OAK_LOG);
put(-12, 0, 7, OAK_LOG); put(-10, 0, 7, OAK_LOG); put(-11, 0, 8, OAK_LOG); put(-11, 0, 6, OAK_LOG);
shape(ell(-11, 9.5, 7, 4.2, 3.4, 4.2), -16, 5, 2, -6, 14, 12, (x, y, z) => {
  const h = H(x * 7 + y * 13 + z * 31);
  return h < 0.05 ? RED : (h < 0.08 ? BLUE : LEAVES);
});
put(-9, 0, 5, BLUE); put(-13, 0, 9, BLUE); put(-12, 0, 4, PINK); put(-8, 0, 8, PINK);

// ---------- Wooden sign ----------
pcube(-13, 0, -3, -13, 2, -3, OAK_LOG);
pcube(-14, 2, -3, -12, 3, -3, PLANKS);
put(-13, 3, -4, YELLOW);

// ---------- Flowers and tufts ----------
const flowerCols = [YELLOW, WHITE, PINK, RED, LIGHT_BLUE, MAGENTA];
for (let i = 0; i < 70; i++) {
  const ang = H(i) * Math.PI * 2, rad = 4 + H(i + 100) * 9.3;
  const x = Math.round(Math.cos(ang) * rad), z = Math.round(Math.sin(ang) * rad);
  if (Math.abs(x) <= 7 && z >= -6 && z <= 9) continue;
  if (Math.hypot(x + 10, z + 7) < 4) continue;
  if (Math.hypot(x - 11, z + 6) < 4.8) continue;
  if (Math.hypot(x + 11, z - 7) < 2) continue;
  if (Math.abs(x) <= 2 && z < -6) continue;
  if (x >= -7 && x <= -4 && z >= -7 && z <= -4) continue;
  if (x >= -14 && x <= -12 && z >= -4 && z <= -2) continue;
  if (x >= 0 && x <= 17 && z >= 5 && z <= 8) continue;
  const k = M.get(x + ',0,' + z);
  if (k !== undefined) continue;
  const h = H(i + 200);
  put(x, 0, z, h < 0.2 ? LEAVES : flowerCols[Math.floor(H(i + 300) * flowerCols.length)]);
}

// ---------- Electricity ----------
for (const p of [[6, 12, -5], [-6, 12, -5], [9, 16, -3], [10, 12, -5], [16, 24, 7], [11, 4, -6], [-9, 19, -2]]) put(p[0], p[1], p[2], ELECTRIC);

// ---------- Emit ----------
for (const [k, id] of M) {
  const p = k.split(',').map(Number);
  block(p[0], p[1], p[2], id);
}