// lava-golem-opus-fb2 — feedback pass 2
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 14; z++) for (let y = 1; y <= 12; y++) block(x, y, z, AIR);

const G = new Map();
const D = new Map();
const FX = [];
const K = (x, y, z) => x + ',' + y + ',' + z;
function inb(x, y, z) { return x >= -22 && x <= 22 && z >= -22 && z <= 22 && y >= -8 && y <= 33; }
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (!inb(x, y, z)) return;
  G.set(K(x, y, z), [x, y, z, id]);
}
function dput(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (!inb(x, y, z)) return;
  D.set(K(x, y, z), [x, y, z, id]);
}
function fire(x, y, z) { FX.push([x, y, z]); }
function hsh(x, y, z) {
  let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n = n ^ (n >>> 16);
  return (n >>> 0) / 4294967296;
}

const HOT = [
  [0, 19, -6, 5.5, 0.8],
  [-5.5, 7.5, -3, 3, 0.45], [5.5, 7.5, -4, 3, 0.45],
  [-14.5, 13.5, -2, 2.8, 0.5], [17, 16, -3, 2.8, 0.5],
  [-15, 2, -5, 3.5, 0.4], [18, 27, -8, 3.5, 0.45],
  [0, 23, -8, 2.5, 0.4]
];
function heatAt(x, y, z) {
  let h = y < 2 ? 0.2 : 0;
  for (const p of HOT) {
    const d = Math.hypot(x - p[0], y - p[1], z - p[2]);
    if (d < p[3]) h += p[4] * (1 - d / p[3]);
  }
  return h;
}

const S = 5;
const seedCache = new Map();
function seedOf(i, j, k) {
  const key = K(i, j, k);
  let s = seedCache.get(key);
  if (!s) {
    s = [(i + 0.15 + 0.7 * hsh(i, j, k)) * S, (j + 0.15 + 0.7 * hsh(j + 7, k, i)) * S, (k + 0.15 + 0.7 * hsh(k - 3, i, j + 11)) * S, hsh(i + 101, j - 57, k + 13)];
    seedCache.set(key, s);
  }
  return s;
}
function rockAt(x, y, z) {
  const ci = Math.floor(x / S), cj = Math.floor(y / S), ck = Math.floor(z / S);
  let d1 = 1e9, d2 = 1e9, c1 = 0;
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
    const s = seedOf(ci + a, cj + b, ck + c);
    const d = Math.hypot(x - s[0], y - s[1], z - s[2]);
    if (d < d1) { d2 = d1; d1 = d; c1 = s[3]; } else if (d < d2) d2 = d;
  }
  const heat = heatAt(x, y, z);
  const e = d2 - d1;
  const h = hsh(x, y, z);
  const w = 0.55 + heat * 0.9;
  if (e < w) {
    const glow = Math.sin(x * 0.31 + z * 0.23) + Math.sin(y * 0.27 - x * 0.19) + Math.sin(z * 0.29 + y * 0.17);
    if (heat > 0.3 || glow > 0.9) return LAVA;
    return h < 0.75 ? RED : ORANGE;
  }
  if (e < w + 0.6 && heat > 0.35) return h < 0.6 ? RED : ORANGE;
  let m;
  if (c1 < 0.45) m = OBSIDIAN; else if (c1 < 0.8) m = BLACK; else if (c1 < 0.94) m = GRAY; else m = COBBLE;
  if (h < 0.08) m = m === GRAY ? BLACK : GRAY;
  return m;
}

const R = 'R';
function ell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++)
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1) put(x, y, z, id || R);
}
function sph(cx, cy, cz, r, id) { ell(cx, cy, cz, r, r, r, id); }
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) put(x, y, z, id || R);
}
function cap(a, b, r1, r2, id) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(L * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t, cz = a[2] + (b[2] - a[2]) * t;
    const r = r1 + (r2 - r1) * t;
    if (r < 0.8) put(cx, cy, cz, id || R); else sph(cx, cy, cz, r, id);
  }
}
function spike(a, b, r1) { cap(a, b, r1, 0.4, OBSIDIAN); }

// Legs: chunky pillars with boulder knees and clawed feet
function leg(sx, dz) {
  const x0 = sx * 5.5;
  ell(x0, 1.5, -3 + dz, 4, 2, 4.5);
  box(Math.round(x0 - 3), 0, -6 + dz, Math.round(x0 + 3), 1, 0 + dz);
  for (const tx of [-3, -1, 1, 3]) {
    const x = Math.round(x0 + tx * 0.9);
    put(x, 0, -8 + dz, R); put(x, 1, -8 + dz, R); put(x, 0, -7 + dz, R);
    put(x, 0, -9 + dz, OBSIDIAN);
  }
  cap([x0, 3, -3 + dz], [x0, 7, -2.5 + dz], 2.6, 2.9);
  sph(x0, 7.5, -3.2 + dz, 3.1);
  cap([x0, 8, -2.5 + dz], [sx * 5, 11, -1], 3.1, 3.5);
}
leg(-1, 0);
leg(1, -1);

// Torso: pelvis, waist, massive barrel chest, hunched back
ell(0, 11.5, -1, 7.5, 2.5, 4.5);
ell(0, 14.5, -1, 5.5, 2.5, 3.8);
ell(0, 19, -1, 9, 5, 5.5);
sph(0, 21, 2.5, 5.5);
sph(-11, 21, -1, 4.2);
sph(11, 21, -1, 4.2);
cap([-4, 23, 0], [-9, 23, -1], 2.6, 3.2);
cap([4, 23, 0], [9, 23, -1], 2.6, 3.2);

// Head: blocky, low-slung, jutting jaw
ell(0, 25, -5, 3.8, 3.2, 3.6);
box(-3, 23, -8, 3, 27, -4);
box(-3, 21, -9, 3, 22, -5);
for (let x = -4; x <= 4; x++) put(x, 26, -9, OBSIDIAN);
for (let x = -3; x <= 3; x++) put(x, 27, -8, OBSIDIAN);
put(0, 25, -9, OBSIDIAN); put(0, 24, -9, OBSIDIAN);
for (const x of [-4, 4]) { put(x, 24, -8, BLACK); put(x, 25, -8, BLACK); }
put(-2, 25, -8, NEON_RED); put(-1, 25, -8, NEON_RED);
put(1, 25, -8, NEON_RED); put(2, 25, -8, NEON_RED);
put(-3, 25, -8, BLACK); put(3, 25, -8, BLACK);
for (let x = -2; x <= 2; x++) put(x, 23, -8, LAVA);
for (let x = -3; x <= 3; x++) put(x, 24, -8, BLACK);
for (const x of [-3, -1, 1, 3]) put(x, 23, -9, OBSIDIAN);
for (const x of [-2, 0, 2]) put(x, 22, -10, OBSIDIAN);
cap([-3, 27, -5], [-5, 29, -4], 1.1, 0.9, OBSIDIAN);
spike([-5, 29, -4], [-6, 32, -7], 0.9);
cap([3, 27, -5], [5, 29, -4], 1.1, 0.9, OBSIDIAN);
spike([5, 29, -4], [6, 32, -7], 0.9);

// Left arm: knuckles planted on the ground
cap([-12, 20, -1], [-14.5, 14, -2], 3.0, 2.6);
sph(-14.5, 13.5, -2, 2.9);
cap([-14.5, 13, -2], [-15, 7, -3.5], 2.7, 3.2);
ell(-15, 4, -3.5, 3.6, 3.2, 3.6);
for (const x of [-17, -15, -13]) { ell(x, 2.2, -6.5, 1.1, 1.6, 1.3); put(x, 1, -8, OBSIDIAN); }
box(-19, 3, -5, -18, 4, -3);

// Right arm: raised clenched fist, smoking
cap([12, 20, -1], [17, 16, -3], 3.0, 2.6);
sph(17, 16, -3, 2.9);
cap([17, 16, -3], [18, 22, -6], 2.7, 3.1);
ell(18, 26, -7, 3.4, 3.6, 3.2);
for (const x of [16, 18, 20]) { ell(x, 28, -9.5, 1.1, 1.3, 1.2); put(x, 30, -9, OBSIDIAN); }
box(14, 24, -9, 14, 26, -7);
put(14, 27, -9, OBSIDIAN);
fire(17, 31, -8); fire(19, 31, -6); fire(18, 31, -10);

// Molten core in chest
for (let dx = -4; dx <= 4; dx++) for (let dy = -4; dy <= 4; dy++) {
  const d = Math.hypot(dx, dy);
  const y = 19 + dy;
  if (d <= 1.2) put(dx, y, -6, GLOWSTONE);
  else if (d <= 2.5) put(dx, y, -6, LAVA);
  else if (d <= 3.6 && hsh(dx, y, 5) < 0.8) put(dx, y, -7, OBSIDIAN);
}
for (let x = -3; x <= 3; x++) { put(x, 18, -7, OBSIDIAN); put(x, 20, -7, OBSIDIAN); }

// Obsidian spikes on shoulders and spine
for (const s of [-1, 1]) {
  spike([s * 11, 24, -1], [s * 13, 29, 0], 1.3);
  spike([s * 9, 24, 1], [s * 9, 28, 3], 1.0);
  spike([s * 13, 22, 1], [s * 16, 25, 3], 1.0);
}
fire(-13, 30, 0); fire(13, 30, 0);
for (const y of [14, 17, 20, 23]) {
  spike([0, y, 4 + (y > 19 ? 3 : 0)], [0, y + 3, 8 + (y > 19 ? 3 : 0)], 1.1);
}
spike([-4, 22, 6], [-5, 25, 9], 0.9);
spike([4, 22, 6], [5, 25, 9], 0.9);

// Glowing fissures down the front of the body
function crack(x1, y1, x2, y2) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = Math.round(x1 + (x2 - x1) * t + 0.5 * Math.sin(i * 1.3));
    const y = Math.round(y1 + (y2 - y1) * t);
    for (let z = -14; z <= 6; z++) {
      const k = K(x, y, z);
      if (G.has(k)) { const c = G.get(k); if (c[3] === R) G.set(k, [x, y, z, LAVA]); break; }
    }
  }
}
crack(-3, 15, -5, 11);
crack(3, 15, 5, 11);
crack(-4, 21, -8, 23);
crack(4, 21, 8, 23);
crack(-6, 8, -5, 3);
crack(5, 8, 6, 3);

// Hollow interior (unseen) to save budget
const nb = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const kill = [];
for (const [k, v] of G) {
  if (v[3] !== R) continue;
  let all = true;
  for (const n of nb) { if (!G.has(K(v[0] + n[0], v[1] + n[1], v[2] + n[2]))) { all = false; break; } }
  if (all) kill.push(k);
}
for (const k of kill) G.delete(k);

// Charred burning trees flanking
function deadTree(x, y0, z, h, br) {
  for (let y = y0; y <= y0 + h; y++) dput(x, y, z, BLACK);
  for (const b of br) {
    const n = Math.max(Math.abs(b[0]), Math.abs(b[1]), Math.abs(b[2]));
    for (let i = 1; i <= n; i++) dput(x + b[0] * i / n, y0 + b[3] + b[1] * i / n, z + b[2] * i / n, i === n ? OBSIDIAN : BLACK);
    fire(Math.round(x + b[0]), y0 + b[3] + b[1] + 1, Math.round(z + b[2]));
  }
}
deadTree(-20, 0, -13, 6, [[-2, 3, -1, 4], [2, 3, 1, 5]]);
deadTree(21, 0, -13, 5, [[1, 2, -1, 3], [-2, 3, 1, 4]]);

// Scorched ground with lava rivers radiating from the golem
function buildGround(Rad) {
  const M = new Map();
  const gp = (x, y, z, id) => {
    if (!inb(x, y, z)) return;
    const k = K(x, y, z);
    if (G.has(k) || D.has(k)) return;
    M.set(k, [x, y, z, id]);
  };
  const cx = 0, cz = -3;
  for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
    const dx = x - cx, dz = z - cz;
    const r = Math.hypot(dx, dz);
    const ang = Math.atan2(dz, dx);
    const edge = Rad + 0.8 * Math.sin(ang * 5 + 1) + 0.5 * Math.sin(ang * 11);
    if (r > edge) continue;
    const h = hsh(x, 0, z);
    let lava = Math.hypot(x + 15, z + 5) < 3.6;
    if (!lava && r > 3 && r < edge - 1.2) {
      for (let k = 0; k < 6; k++) {
        const a = k * 2 * Math.PI / 6 + 0.5 + 0.25 * Math.sin(r * 0.5 + k * 1.7);
        let df = ang - a;
        df = Math.atan2(Math.sin(df), Math.cos(df));
        if (Math.abs(df) * r < 0.5) { lava = true; break; }
      }
    }
    let id;
    if (lava) id = LAVA;
    else if (r < edge - 2 && h < 0.08) id = RED;
    else if (h < 0.35) id = BLACK;
    else if (h < 0.6) id = GRAY;
    else if (h < 0.8) id = COBBLE;
    else if (h < 0.92) id = OBSIDIAN;
    else id = STONE;
    gp(x, 0, z, id);
    if (r > edge - 1.3) { gp(x, -1, z, h < 0.5 ? GRAY : COBBLE); gp(x, -2, z, h < 0.5 ? STONE : GRAY); }
  }
  const boulders = [[-8, -12, 1.4], [9, -13, 1.5], [12, -2, 1.3], [-11, 5, 1.2], [8, 6, 1.2], [-4, -15, 1.1]];
  for (const b of boulders) {
    if (Math.hypot(b[0] - cx, b[1] - cz) > Rad - 1.5) continue;
    for (let x = Math.floor(b[0] - 2); x <= b[0] + 2; x++)
      for (let y = 1; y <= 3; y++)
        for (let z = Math.floor(b[1] - 2); z <= b[1] + 2; z++)
          if ((x - b[0]) ** 2 + (y - 0.6) ** 2 + (z - b[1]) ** 2 <= b[2] * b[2]) gp(x, y, z, rockAt(x, y, z));
  }
  for (const f of [[-7, -11], [9, -10], [3, -13], [-10, 2], [11, 3]]) {
    if (Math.hypot(f[0] - cx, f[1] - cz) < Rad - 2) gp(f[0], 1, f[1], FIRE);
  }
  return M;
}

const used = G.size + D.size + FX.length;
const remaining = 3990 - used;
let GR = new Map();
for (let Rad = 16; Rad >= 4; Rad--) {
  const m = buildGround(Rad);
  if (m.size <= remaining) { GR = m; break; }
}

for (const v of GR.values()) block(v[0], v[1], v[2], v[3]);
for (const v of D.values()) block(v[0], v[1], v[2], v[3]);
for (const v of G.values()) block(v[0], v[1], v[2], v[3] === R ? rockAt(v[0], v[1], v[2]) : v[3]);
for (const f of FX) block(f[0], f[1], f[2], FIRE);