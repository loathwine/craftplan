// lava-golem-opus — prompt:
// a lava golem...

cube(-21, 1, -16, 22, 9, 11, AIR);

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
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n = n ^ (n >>> 16);
  return (n >>> 0) / 4294967296;
}

// hot spots: knees, elbows, waist, core, raised fist
const HOT = [[-5, 6, -3, 4], [5, 6, -4, 4], [-14, 13, -3, 3.5], [17, 15, -4, 3.5], [0, 12, -1, 6], [0, 19, -6, 5], [17, 25, -8, 4]];
function rock(x, y, z, extra) {
  let heat = extra || 0;
  for (const p of HOT) {
    const d = Math.hypot(x - p[0], y - p[1], z - p[2]);
    if (d < p[3]) heat += 0.22 * (1 - d / p[3]);
  }
  const h = hsh(x, y, z);
  const v = Math.abs(Math.sin(x * 0.7 + y * 0.45 + z * 0.3) + 0.8 * Math.sin(z * 0.9 - y * 0.6 + x * 0.2) + 0.6 * Math.sin(y * 1.1 - x * 0.5 + z * 0.15));
  const t = 0.11 + heat;
  if (v < t) return LAVA;
  if (v < t + 0.12) return h < 0.55 ? ORANGE : RED;
  if (h < 0.4) return OBSIDIAN;
  if (h < 0.66) return BLACK;
  if (h < 0.85) return GRAY;
  return COBBLE;
}
function rbox(x1, y1, z1, x2, y2, z2, heat) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) put(x, y, z, rock(x, y, z, heat));
}
function fbox(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) put(x, y, z, id);
}
function rsph(cx, cy, cz, r, heat, id) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) {
        const d = (x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2;
        if (d <= r * r) put(x, y, z, id !== undefined ? id : rock(x, y, z, heat));
      }
}
function cap(a, b, r1, r2, heat, id) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(L * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t, cz = a[2] + (b[2] - a[2]) * t;
    rsph(cx, cy, cz, r1 + (r2 - r1) * t, heat, id);
    const rx = Math.round(cx), ry = Math.round(cy), rz = Math.round(cz);
    put(rx, ry, rz, id !== undefined ? id : rock(rx, ry, rz, heat));
  }
}

// ---------- FEET ----------
rbox(-8, 1, -6, -3, 2, 2);
rbox(3, 1, -8, 8, 2, 0);
for (const tx of [-8, -6, -4]) { rbox(tx, 1, -7, tx + 1, 2, -7); put(tx, 1, -8, OBSIDIAN); put(tx + 1, 1, -8, OBSIDIAN); }
for (const tx of [3, 5, 7]) { rbox(tx, 1, -9, tx + 1, 2, -9); put(tx, 1, -10, OBSIDIAN); put(tx + 1, 1, -10, OBSIDIAN); }

// ---------- LEGS ----------
rbox(-8, 3, -4, -3, 10, 1);
rbox(3, 3, -5, 8, 10, 0);
rbox(-8, 5, -5, -3, 8, -5);
rbox(3, 5, -6, 8, 8, -6);
rbox(-7, 6, -6, -4, 7, -6);
rbox(4, 6, -7, 7, 7, -7);
rbox(-9, 8, -4, -2, 11, 2);
rbox(2, 8, -5, 9, 11, 1);

// ---------- PELVIS / TORSO ----------
rbox(-8, 10, -4, 8, 12, 2);
rbox(-7, 13, -5, 7, 16, 3);
rbox(-9, 17, -6, 9, 22, 3);
rbox(-8, 18, -7, -4, 21, -7);
rbox(4, 18, -7, 8, 21, -7);
rsph(0, 21, 1, 5.5);
rsph(-11, 21, -1, 3.8);
rsph(11, 21, -1, 3.8);
cap([-4, 23, 0], [-10, 23, -1], 2.5, 3);
cap([4, 23, 0], [10, 23, -1], 2.5, 3);

// ---------- HEAD ----------
rbox(-3, 22, -8, 3, 27, -2);
rbox(-4, 21, -9, 4, 23, -5);
rsph(0, 27, -5, 2.5);
fbox(-4, 26, -9, 4, 26, -9, OBSIDIAN);
fbox(-4, 27, -8, 4, 27, -8, OBSIDIAN);
for (const x of [-4, -3, 3, 4]) { put(x, 24, -9, rock(x, 24, -9)); put(x, 25, -9, rock(x, 25, -9)); }
put(0, 24, -9, OBSIDIAN); put(0, 25, -9, OBSIDIAN);
put(-2, 25, -8, NEON_RED); put(-1, 25, -8, NEON_RED);
put(1, 25, -8, NEON_RED); put(2, 25, -8, NEON_RED);
for (let x = -3; x <= 3; x++) put(x, 22, -9, (x === -2 || x === 0 || x === 2) ? OBSIDIAN : LAVA);
put(-1, 21, -10, OBSIDIAN); put(1, 21, -10, OBSIDIAN);
// horns
cap([-3, 27, -5], [-6, 29, -4], 1.2, 1.0, 0, OBSIDIAN);
cap([-6, 29, -4], [-7, 32, -6], 1.0, 0.5, 0, OBSIDIAN);
cap([3, 27, -5], [6, 29, -4], 1.2, 1.0, 0, OBSIDIAN);
cap([6, 29, -4], [7, 32, -6], 1.0, 0.5, 0, OBSIDIAN);
fire(0, 30, -5);

// ---------- LEFT ARM (hanging, knuckles on ground) ----------
cap([-12, 20, -1], [-14, 13, -3], 3, 2.6);
cap([-14, 13, -3], [-14, 7, -5], 2.6, 2.4);
rbox(-17, 0, -9, -11, 5, -3);
for (const x of [-17, -15, -13]) rbox(x, 1, -10, x + 1, 3, -10);
rbox(-10, 2, -8, -10, 4, -6);
cap([-16, 10, -4], [-19, 11, -3], 0.9, 0.5, 0, OBSIDIAN);
cap([-15, 13, -1], [-17, 13, 3], 1.0, 0.5, 0, OBSIDIAN);

// ---------- RIGHT ARM (raised, flexed fist) ----------
cap([12, 20, -1], [17, 15, -4], 3, 2.6);
cap([17, 15, -4], [17, 23, -8], 2.6, 2.4);
rbox(14, 23, -11, 20, 28, -6, 0.08);
for (const x of [14, 16, 18]) rbox(x, 25, -12, x + 1, 27, -12, 0.08);
cap([19, 15, -3], [22, 14, 0], 1.0, 0.5, 0, OBSIDIAN);
fire(15, 29, -9); fire(17, 29, -8); fire(19, 29, -10);

// ---------- SHOULDER + BACK SPIKES ----------
cap([-11, 24, -1], [-13, 29, 1], 1.2, 0.6, 0, OBSIDIAN);
cap([-9, 24, 1], [-9, 28, 3], 1.0, 0.5, 0, OBSIDIAN);
cap([11, 24, -1], [13, 29, 1], 1.2, 0.6, 0, OBSIDIAN);
cap([9, 24, 1], [9, 28, 3], 1.0, 0.5, 0, OBSIDIAN);
fire(-13, 30, 1); fire(13, 30, 1);
for (const y of [12, 15, 18, 21]) {
  cap([0, y, 3], [0, y + 3, 7], 1.1, 0.5, 0, OBSIDIAN);
  cap([-4, y + 1, 3], [-5, y + 3, 6], 0.9, 0.5, 0, OBSIDIAN);
  cap([4, y + 1, 3], [5, y + 3, 6], 0.9, 0.5, 0, OBSIDIAN);
}

// ---------- MOLTEN CORE ----------
for (let dx = -4; dx <= 4; dx++) for (let dy = -4; dy <= 4; dy++) {
  const d = Math.hypot(dx, dy);
  const y = 19 + dy;
  if (d <= 1.1) put(dx, y, -6, GLOWSTONE);
  else if (d <= 2.3) put(dx, y, -6, LAVA);
  else if (d <= 3.4) put(dx, y, -7, OBSIDIAN);
}

// ---------- SURFACE CRACKS radiating from core ----------
function crack(x1, y1, x2, y2) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = Math.round(x1 + (x2 - x1) * t + 0.5 * Math.sin(i * 1.3));
    const y = Math.round(y1 + (y2 - y1) * t);
    for (let z = -14; z <= 6; z++) {
      const k = K(x, y, z);
      if (G.has(k)) { const c = G.get(k); if (c[3] !== NEON_RED) G.set(k, [x, y, z, LAVA]); break; }
    }
  }
}
crack(-3, 16, -6, 10);
crack(3, 15, 6, 10);
crack(-4, 21, -9, 18);
crack(4, 21, 9, 17);
crack(0, 15, 1, 10);

// ---------- DECOR: lava pool at fist, charred burning trees ----------
for (let x = -20; x <= -8; x++) for (let z = -12; z <= 0; z++) {
  if (Math.hypot(x + 14, z + 6) <= 5 && !G.has(K(x, 0, z))) dput(x, 0, z, LAVA);
}
function deadTree(x, y0, z, h, br) {
  for (let y = y0; y <= y0 + h; y++) dput(x, y, z, BLACK);
  for (const b of br) {
    const n = Math.max(Math.abs(b[0]), Math.abs(b[1]), Math.abs(b[2]));
    for (let i = 1; i <= n; i++) dput(x + b[0] * i / n, y0 + b[3] + b[1] * i / n, z + b[2] * i / n, i === n ? OBSIDIAN : BLACK);
    fire(Math.round(x + b[0]), y0 + b[3] + b[1] + 1, Math.round(z + b[2]));
  }
}
deadTree(-19, 0, -13, 6, [[-2, 3, -1, 4], [3, 3, 1, 5]]);
deadTree(20, 0, -12, 5, [[2, 2, -1, 3], [-2, 3, 1, 4]]);

// ---------- CULL hidden interior ----------
const nb = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const kill = [];
for (const [k, v] of G) {
  let all = true;
  for (const n of nb) { if (!G.has(K(v[0] + n[0], v[1] + n[1], v[2] + n[2]))) { all = false; break; } }
  if (all) kill.push(k);
}
for (const k of kill) G.delete(k);

// ---------- SCORCHED GROUND (sized to remaining budget) ----------
function buildGround(R) {
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
    const edge = R + 0.7 * Math.sin(ang * 5 + 1);
    if (r > edge) continue;
    const h = hsh(x, 0, z);
    let fis = false;
    if (r > 2.5 && r < edge - 1.5) {
      for (let k = 0; k < 7; k++) {
        const a = k * 2 * Math.PI / 7 + 0.3 + 0.2 * Math.sin(r * 0.5 + k * 1.7);
        let df = ang - a;
        df = Math.atan2(Math.sin(df), Math.cos(df));
        if (Math.abs(df) * r < 0.55) { fis = true; break; }
      }
    }
    let id;
    if (fis) id = LAVA;
    else if (h < 0.3) id = BLACK;
    else if (h < 0.55) id = GRAY;
    else if (h < 0.75) id = COBBLE;
    else if (h < 0.9) id = STONE;
    else id = OBSIDIAN;
    gp(x, 0, z, id);
    if (r > edge - 1.3) { gp(x, -1, z, h < 0.5 ? GRAY : COBBLE); gp(x, -2, z, h < 0.5 ? STONE : GRAY); }
  }
  const boulders = [[-8, -11, 1.4], [9, -12, 1.5], [12, -4, 1.3], [-11, 3, 1.2], [7, 5, 1.2], [-4, -14, 1.1], [13, -10, 1.0]];
  for (const b of boulders) {
    if (Math.hypot(b[0] - cx, b[1] - cz) > R - 1.5) continue;
    for (let x = Math.floor(b[0] - 2); x <= b[0] + 2; x++)
      for (let y = 1; y <= 3; y++)
        for (let z = Math.floor(b[1] - 2); z <= b[1] + 2; z++)
          if ((x - b[0]) ** 2 + (y - 0.6) ** 2 + (z - b[1]) ** 2 <= b[2] * b[2]) gp(x, y, z, rock(x, y, z, 0));
  }
  for (const f of [[-6, -10], [8, -9], [11, -7], [-9, 1], [3, -13]]) {
    if (Math.hypot(f[0] - cx, f[1] - cz) < R - 2) gp(f[0], 1, f[1], FIRE);
  }
  return M;
}

const used = G.size + D.size + FX.length;
const remaining = 3990 - used;
let GR = new Map();
for (let R = 14; R >= 4; R--) {
  const m = buildGround(R);
  if (m.size <= remaining) { GR = m; break; }
}

// ---------- EMIT ----------
for (const v of GR.values()) block(v[0], v[1], v[2], v[3]);
for (const v of D.values()) block(v[0], v[1], v[2], v[3]);
for (const v of G.values()) block(v[0], v[1], v[2], v[3]);
for (const f of FX) block(f[0], f[1], f[2], FIRE);