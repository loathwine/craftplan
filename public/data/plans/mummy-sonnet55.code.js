// mummy-sonnet55 — prompt:
// a mummy bursting out of its sarcophagus...

cube(-12, 0, -11, 12, 9, 11, AIR);

const M = new Map();
const K = (x, y, z) => ((x + 40) * 100 + (y + 20)) * 100 + (z + 40);
const hs = (x, y, z) => {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) % 1000;
};
const put = (x, y, z, id) => {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(K(x, y, z), [x, y, z, id]);
};
const has = (x, y, z) => M.has(K(x, y, z));
const col = (id, x, y, z) => (typeof id === 'function' ? id(x, y, z) : id);
const box = (x1, y1, z1, x2, y2, z2, id) => {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) put(x, y, z, col(id, x, y, z));
};
const blob = (cx, cy, cz, rx, ry, rz, id) => {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const a = (x - cx) / rx, b = (y - cy) / ry, c = (z - cz) / rz;
        if (a * a + b * b + c * c <= 1) put(x, y, z, col(id, x, y, z));
      }
};
const limb = (a, b, r0, r1, id) => {
  const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * 2) + 1;
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0, r = r0 + (r1 - r0) * t;
    blob(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, r, r, id);
  }
};
const ln = (a, b, id) => {
  const n = Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]))) + 1;
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0;
    put(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, id);
  }
};
const frontZ = (x, y) => { for (let z = -22; z <= 22; z++) if (has(x, y, z)) return z; return 0; };
const wrap = (x, y, z) => {
  const h = hs(x, y, z);
  if (h < 25) return BROWN;
  if (h < 40) return GRAY;
  const i = (((x + 2 * y - z) % 8) + 8) % 8;
  return i < 2 ? LIGHT_GRAY : i < 6 ? WHITE : SAND;
};
const strip = (a, b, ease, w) => {
  const n = Math.ceil(Math.abs(b[1] - a[1]) + Math.hypot(b[0] - a[0], b[2] - a[2])) + 2;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = a[0] + (b[0] - a[0]) * t, z = a[2] + (b[2] - a[2]) * t;
    const y = a[1] + (b[1] - a[1]) * Math.pow(t, ease);
    const c = i % 3 === 0 ? LIGHT_GRAY : WHITE;
    put(x, y, z, c);
    if (w > 1) put(x + 1, y, z, c);
  }
};

// plinth
box(-7, 0, -9, 7, 0, 8, (x, y, z) => (Math.abs(x) === 7 || z === -9 || z === 8) ? ((x + z) % 2 ? BLUE : GOLD) : SAND);
box(-5, 1, -7, 5, 1, 7, (x, y, z) => ((x + z) % 2 ? STONE : COBBLE));

// upright sarcophagus
const wd = y => y <= 5 ? 5 : y <= 11 ? 6 : y <= 15 ? 7 : y <= 20 ? 9 : y <= 22 ? 7 : y <= 26 ? 5 : y === 27 ? 4 : 3;
const band = y => (y % 6 === 0 ? GOLD : BLUE);
for (let y = 2; y <= 28; y++) {
  const w = wd(y), wp = y > 2 ? wd(y - 1) : w;
  const lo = Math.min(w, wp), hi = Math.max(w, wp);
  for (let x = -w; x <= w; x++) {
    const ax = Math.abs(x);
    put(x, y, 6, ax === w ? band(y) : SAND);
    let c;
    if (ax === w) c = band(y);
    else if (ax === w - 1) c = BLUE;
    else c = (((x % 3) + 3) % 3 === 0 && y % 2 === 0 && hs(x, y, 5) < 650) ? GOLD : BLACK;
    put(x, y, 5, c);
  }
  for (const s of [-1, 1]) {
    const zf = y < 6 ? -2 : y < 23 ? -2 + hs(y, s, 77) % 6 : 1 + hs(y, s, 91) % 3;
    for (let x = lo - 1; x <= hi; x++)
      for (let z = zf; z <= 6; z++)
        put(s * x, y, z, z === zf ? GOLD : (hs(x * s, y, z) < 60 ? SAND : band(y)));
  }
}
box(-2, 29, 3, 2, 29, 6, GOLD);
box(-1, 30, 5, 1, 30, 6, GOLD);
put(0, 31, 6, RED);

// the mummy
blob(-2.5, 3, 0.2, 1.8, 1.3, 2.6, wrap);
blob(2.5, 3, -4.5, 1.8, 1.3, 2.6, wrap);
limb([-2.5, 3.5, 1.8], [-2.5, 7.5, 1.6], 1.7, 1.9, wrap);
limb([-2.4, 7.5, 1.6], [-2, 12, 0.8], 2.1, 2.4, wrap);
limb([2.5, 3.5, -3.2], [2.6, 7.5, -2], 1.7, 1.9, wrap);
limb([2.5, 7.5, -2], [2.2, 12, 0.2], 2.1, 2.4, wrap);
blob(0, 12, 0.4, 4.2, 2.6, 3.2, wrap);
for (let i = 0; i <= 10; i++) {
  const t = i / 10;
  blob(0, 13 + 5 * t, -2.6 * t, 3.8 + 1.5 * t, 1.3, 3 + 0.4 * t, wrap);
}
blob(0, 17.5, -2.6, 5.4, 2.8, 3.4, wrap);
blob(-5.8, 18, -3, 2.4, 2.3, 2.4, wrap);
blob(5.8, 18, -3, 2.4, 2.3, 2.4, wrap);
limb([0, 19.5, -3], [0, 21.5, -4.2], 1.9, 1.9, wrap);
blob(0, 24, -5, 3.1, 3.6, 3.3, wrap);
blob(0, 21.2, -4.8, 2.2, 1.2, 2.2, wrap);
// right arm thrust at the viewer
limb([5.8, 18, -3], [7.6, 17.2, -8.3], 2.0, 1.7, wrap);
limb([7.6, 17.2, -8.3], [5.2, 18.6, -13.2], 1.7, 1.4, wrap);
limb([6.3, 17.7, -11], [5.6, 18.2, -12.3], 1.9, 1.9, GOLD);
blob(5.0, 18.7, -14.3, 1.3, 1.1, 1.5, BROWN);
for (const t of [[2.8, 19.3, -17.8], [4.4, 20.4, -18], [6.2, 20.2, -17.6], [7.4, 18.6, -16.8]]) {
  ln([5, 18.7, -14.5], t, BROWN);
  put(t[0], t[1], t[2], BLACK);
}
// left arm clawing upward
limb([-5.8, 18.2, -3], [-8.8, 20.5, -6.2], 2.0, 1.7, wrap);
limb([-8.8, 20.5, -6.2], [-7.4, 25, -9.5], 1.7, 1.4, wrap);
limb([-8, 23.6, -8.9], [-7.7, 24.5, -9.3], 1.9, 1.9, GOLD);
blob(-7.3, 25.8, -10, 1.4, 1.5, 1.3, BROWN);
for (const t of [[-9.5, 28.5, -11.5], [-7.5, 29, -12.5], [-5.5, 28.2, -11.8], [-10.2, 27, -12.8]]) {
  ln([-7.3, 26.5, -10.3], t, BROWN);
  put(t[0], t[1], t[2], BLACK);
}
// face
for (const sx of [-1, 1]) {
  for (const dx of [1, 2]) for (const dy of [0, 1]) {
    const x = sx * dx, y = 24 + dy, z = frontZ(x, y);
    put(x, y, z, BLACK); put(x, y, z + 1, BLACK);
  }
  const gz = frontZ(sx * 2, 24);
  put(sx * 2, 24, gz, NEON_RED);
}
for (let x = -1; x <= 1; x++) put(x, 22, frontZ(x, 22), BLACK);
put(0, 21, frontZ(0, 21), BLACK);
put(0, 23, frontZ(0, 23) - 1, BROWN);
for (let x = -2; x <= 2; x++) put(x, 26, frontZ(x, 26), x % 2 ? GRAY : LIGHT_GRAY);
// chest amulet
for (let x = -1; x <= 1; x++) for (let y = 15; y <= 17; y++) put(x, y, frontZ(x, y) - 1, GOLD);
put(0, 16, frontZ(0, 16) - 1, NEON_BLUE);
// trailing bandages
strip([-8, 19, -6], [-7, 2, -5], 1.2, 1);
strip([7.5, 16, -8], [6, 2, -6], 1.3, 1);
strip([-3, 10, -3], [-4, 2, -5], 1.1, 1);
strip([5, 18, -14], [9, 0, -15], 2.2, 2);
strip([-7, 24, -10], [-11, 0, -13], 2.4, 1);
strip([3, 26, -4], [7, 13, -3], 1.5, 1);
strip([2, 6, -3], [4, 2, -9], 1.1, 1);

// shattered lid debris
const slab = (x1, z1, x2, z2, slope, face) => {
  const cx = (x1 + x2) / 2;
  for (let x = x1; x <= x2; x++) for (let z = z1; z <= z2; z++) {
    if ((x === x1 || x === x2 || z === z1) && hs(x, z, 3) < 250) continue;
    const top = 2 + Math.floor((z - z1) * slope);
    for (let y = 2; y <= top; y++) put(x, y, z, y === top ? face(x - cx, z - z1) : SAND);
  }
};
slab(-5, -7, -1, -3, 0.6, (dx, dz) =>
  dz === 2 && Math.abs(dx) === 1 ? BLACK : dz === 4 && Math.abs(dx) <= 1 ? RED : Math.abs(dx) === 2 ? BLUE : GOLD);
slab(2, -7, 5, -4, 0.7, (dx, dz) => ((dx + dz) % 2 ? BLUE : GOLD));
for (let x = -7; x <= 7; x++) for (let z = -9; z <= -3; z++) {
  if (hs(x, z, 9) < 90) {
    const y = (Math.abs(x) <= 5 && z >= -7) ? 2 : 1;
    if (!has(x, y, z)) put(x, y, z, hs(x, z, 4) % 2 ? COBBLE : SAND);
  }
}
for (const [x, z] of [[-6, -5], [6, -6], [0, -6], [5, -2], [-4, -2]]) if (!has(x, 2, z)) put(x, 2, z, GOLD);

// braziers
for (const x of [-6, 6]) {
  box(x, 1, -9, x, 3, -9, COBBLE);
  box(x - 1, 4, -10, x + 1, 4, -8, GOLD);
  put(x, 4, -9, LAVA);
  put(x, 5, -9, FIRE);
  put(x, 6, -9, FIRE);
}
// canopic jars
for (const [x, z] of [[-3, -8], [3, -8]]) {
  for (let y = 1; y <= 3; y++) for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) put(x + dx, y, z + dz, y === 2 ? BLUE : SAND);
  for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) put(x + dx, 4, z + dz, GOLD);
  put(x, 5, z, BLACK); put(x, 5, z - 1, BLACK); put(x, 6, z, BLACK); put(x - 1, 6, z, BLACK); put(x + 1, 6, z, BLACK);
}
// flanking obelisks
const obelisk = (ox, oz) => {
  box(ox - 2, -1, oz - 2, ox + 2, 0, oz + 2, STONE);
  box(ox - 1, 1, oz - 1, ox + 1, 17, oz + 1, (x, y) => (y % 6 === 1 ? GOLD : SAND));
  box(ox - 1, 18, oz - 1, ox + 1, 18, oz + 1, GOLD);
  put(ox, 19, oz, GOLD); put(ox, 20, oz, GOLD);
  for (let y = 3; y <= 16; y++) if (y % 6 !== 1) for (let dx = -1; dx <= 1; dx++)
    if (hs(dx + ox * 3, y, 5) < 420) put(ox + dx, y, oz - 1, BLACK);
};
obelisk(-14, 0);
obelisk(14, 2);
// sun disc halo behind the case
for (let x = -10; x <= 10; x++) for (let y = 12; y <= 33; y++) {
  const d = Math.hypot(x, y - 23);
  if (d <= 9.6 && d >= 7.6) put(x, y, 9, GOLD);
  else if (d < 7.6) put(x, y, 10, ORANGE);
}
box(-1, 0, 11, 1, 14, 12, SAND);

// drop fully buried blocks (invisible) to save budget
const dead = [];
for (const [k, v] of M) {
  const x = v[0], y = v[1], z = v[2];
  if (has(x + 1, y, z) && has(x - 1, y, z) && has(x, y + 1, z) && has(x, y - 1, z) && has(x, y, z + 1) && has(x, y, z - 1)) dead.push(k);
}
for (const k of dead) M.delete(k);

// sand around the plinth, filled up to budget
let cnt = M.size;
let room = 3900 - cnt;
const pts = [];
for (let x = -13; x <= 13; x++) for (let z = -13; z <= 13; z++) {
  const d = Math.hypot(x, z - 0.5);
  if (d <= 12.5) pts.push([d, x, z]);
}
pts.sort((a, b) => a[0] - b[0]);
for (const p of pts) {
  if (room <= 0) break;
  const x = p[1], z = p[2];
  if (!has(x, -1, z)) { put(x, -1, z, hs(x, z, 6) < 60 ? LIGHT_GRAY : SAND); room--; }
}

let n = 0;
for (const v of M.values()) {
  if (n >= 3990) break;
  n++;
  block(v[0], v[1], v[2], v[3]);
}