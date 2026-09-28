// thor-opus — sandbox error: Unexpected token '}'
// --- extracted code ---
const H = (a, b, c) => { const h = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return h - Math.floor(h); };
const M = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function set(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(K(x, y, z), [x, y, z, id]);
}
function setIfEmpty(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (!M.has(K(x, y, z))) set(x, y, z, id);
}
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) set(x, y, z, id);
}
function ln(x1, y1, z1, x2, y2, z2, id, emptyOnly) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  const f = emptyOnly ? setIfEmpty : set;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    f(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id);
  }
}

// ---- clear trees so the scene reads cleanly from the north ----
cube(-22, 1, -22, 22, 12, 3, AIR);
cube(-17, 1, 4, 17, 12, 14, AIR);

// ---- storm clouds (backdrop + flanking, front-facing shells) ----
function cloud(cx, cy, cz, rx, ry, rz, seed) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = x - cx, dy = y - cy, dz = z - cz;
        const wob = (H(x, y + seed, z) - 0.5) * 0.25;
        const n = (dx / rx) ** 2 + (dy / ry) ** 2 + (dz / rz) ** 2 + wob;
        if (n > 1 || n < 0.55) continue;
        if (dz > rz * 0.35) continue;
        const r = H(x + seed, y, z);
        const id = dy < -ry * 0.25 ? (r < 0.3 ? BLACK : GRAY) : (r < 0.25 ? GRAY : LIGHT_GRAY);
        set(x, y, z, id);
      }
}
cloud(-17, 31, 11, 6, 2.6, 4, 1);
cloud(-9, 32, 13, 6, 2.2, 4, 2);
cloud(-1, 31.5, 15, 5.5, 2.4, 3.5, 3);
cloud(9, 32, 11, 6.5, 2.4, 4, 4);
cloud(18, 31, 9, 5.5, 2.6, 4, 5);
cloud(19, 32.5, -8, 4.5, 1.8, 3, 6);
cloud(-18, 32.5, -6, 4.5, 1.8, 3, 7);
// glowing cloud bellies where the bolts are born
[[-17, 29, 9], [-16, 29, 10], [9, 30, 8], [10, 30, 9], [18, 29, 7], [-1, 29, 13], [18, 31, -9], [-18, 31, -7]]
  .forEach(p => set(p[0], p[1], p[2], NEON_BLUE));

// ---- lightning bolts ----
function bolt(a, b, seed, jit, branchChance) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(3, Math.round(d / 4));
  let prev = a;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    let p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    if (i < n) p = [p[0] + (H(seed, i, 1) - 0.5) * jit, p[1] + (H(seed, i, 2) - 0.5) * jit * 0.6, p[2] + (H(seed, i, 3) - 0.5) * jit];
    p = p.map(Math.round);
    ln(prev[0], prev[1], prev[2], p[0], p[1], p[2], NEON_BLUE);
    if (i < n && H(seed, i, 5) < branchChance) {
      const bl = 3 + Math.floor(H(seed, i, 6) * 3);
      const bx = p[0] + Math.round((H(seed, i, 7) - 0.5) * 2 * bl);
      const bz = p[2] + Math.round((H(seed, i, 8) - 0.5) * 2 * bl);
      const by = p[1] - bl;
      ln(p[0], p[1], p[2], bx, by, bz, LIGHT_BLUE, true);
      setIfEmpty(bx, by - 1, bz, ELECTRIC);
    }
    if (i < n) setIfEmpty(p[0], p[1], p[2] - 1, ELECTRIC);
    prev = p;
  }
}
const Y0 = 3; // Thor's feet
// sky bolts converging on Mjolnir
bolt([-17, 29, 9], [7, Y0 + 28, -1], 11, 5, 0.5);
bolt([18, 29, 7], [11, Y0 + 28, -1], 12, 5, 0.5);
bolt([18, 31, -9], [11, Y0 + 29, -2], 13, 3, 0.3);
bolt([-18, 31, -7], [7, Y0 + 29, -2], 14, 5, 0.4);
bolt([9, 30, 8], [9, Y0 + 29, 0], 15, 3, 0.3);
// bolts hurled down to the ground
bolt([11, Y0 + 26, -2], [18, 1, -13], 21, 5, 0.5);
bolt([-15, Y0 + 11, -3], [-19, 1, -12], 22, 4, 0.4);
bolt([-1, 29, 13], [-14, 1, 12], 23, 5, 0.4);

// ---- scorched impact craters ----
function impact(cx, cz, seed) {
  for (let x = cx - 3; x <= cx + 3; x++) for (let z = cz - 3; z <= cz + 3; z++) {
    const d = Math.hypot(x - cx, z - cz);
    if (d > 3 + H(x, seed, z) * 0.8) continue;
    set(x, 0, z, d < 1.5 ? OBSIDIAN : (H(x, z, seed) < 0.5 ? BLACK : COBBLE));
  }
  set(cx, 0, cz, LAVA);
  set(cx, 1, cz, ELECTRIC);
  [[1, 0], [-1, 1], [0, -2], [2, 2], [-2, -1]].forEach(([dx, dz]) => set(cx + dx, 1, cz + dz, FIRE));
  [[2, 2, 0], [-3, 1, 2], [1, 3, -2], [-1, 2, -3]].forEach(([dx, dy, dz]) => set(cx + dx, dy, cz + dz, COBBLE));
}
impact(18, -13, 1);
impact(-19, -12, 2);
impact(-14, 12, 3);

// ---- the crag Thor stands on ----
const TOP = Y0 - 1;
const HM = {};
for (let x = -12; x <= 12; x++) for (let z = -10; z <= 10; z++) {
  const d = Math.hypot(x / 12, z / 10);
  if (d > 1) continue;
  let h = Math.round(TOP + 0.6 - Math.pow(d, 1.5) * 4.2 + (H(x, 0, z) - 0.5) * 1.8);
  if (d < 0.32) h = TOP;
  h = Math.max(-1, Math.min(TOP, h));
  HM[x + ',' + z] = h;
}
for (const key in HM) {
  const [x, z] = key.split(',').map(Number);
  const h = HM[key];
  let lo = h - 1;
  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dz]) => {
    const nh = HM[(x + dx) + ',' + (z + dz)];
    lo = Math.min(lo, nh === undefined ? -1 : nh);
  });
  lo = Math.max(lo, -2);
  for (let y = lo; y <= h; y++) {
    const r = H(x, y, z);
    const id = y === h ? (r < 0.55 ? STONE : r < 0.85 ? COBBLE : GRAY) : (r < 0.5 ? COBBLE : STONE);
    set(x, y, z, id);
  }
}
// jagged boulders around the rim
[[-10, -5, 2], [9, -7, 2], [11, 3, 2], [-11, 4, 1.6], [-4, -9, 1.5], [4, 9, 1.8], [-7, 8, 1.6]].forEach(([bx, bz, r], i) => {
  for (let x = -3; x <= 3; x++) for (let y = 0; y <= 3; y++) for (let z = -3; z <= 3; z++) {
    if (x * x + (y * 1.3) ** 2 + z * z > r * r + H(x + i, y, z) * 1.5) continue;
    set(bx + x, y, bz + z, H(x, y + i, z) < 0.5 ? COBBLE : STONE);
  }
});
// charged cracks radiating from his feet
[[[0, -3], [-4, -6], [-7, -8]], [[2, -3], [5, -5], [9, -4]], [[-3, 0], [-8, 1]]].forEach(path => {
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
    for (let s = 0; s <= n; s++) {
      const x = Math.round(a[0] + (b[0] - a[0]) * s / n), z = Math.round(a[1] + (b[1] - a[1]) * s / n);
      for (let y = TOP; y >= -2; y--) if (M.has(K(x, y, z))) { set(x, y, z, NEON_BLUE); break; }
    }
  }
});
// runestones flanking the front
function runestone(x, z, h) {
  box(x - 1, -1, z, x + 2, 0, z + 1, COBBLE);
  box(x, -1, z, x + 1, TOP + h, z, GRAY);
  set(x, TOP + h + 1, z, GRAY);
  for (let y = 1; y <= TOP + h; y += 2) set(x + ((y >> 1) & 1), y, z - 1, NEON_BLUE);
}
runestone(-8, -7, 4);
runestone(7, -7, 3);

// ---- THOR ----
const T = (x, y, z, id) => set(x, y + Y0, z, id);
const TB = (x1, y1, z1, x2, y2, z2, id) => box(x1, y1 + Y0, z1, x2, y2 + Y0, z2, id);
function limb(a, b, id, t) {
  const n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]), 1);
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const x = Math.round(a[0] + (b[0] - a[0]) * s), y = Math.round(a[1] + (b[1] - a[1]) * s), z = Math.round(a[2] + (b[2] - a[2]) * s);
    TB(x, y, z, x + t - 1, y + t - 1, z + t - 1, typeof id === 'function' ? id(s) : id);
  }
}

// cape — behind him, billowing west in the storm wind
let prevZ = {};
for (let ry = 16; ry >= 0; ry--) {
  const t = (16 - ry) / 16;
  const zc = 3 + Math.round(t * t * 7);
  const shift = -Math.round(t * t * 6);
  const xl = -5 - Math.round(t * 3) + shift, xr = 5 + Math.round(t * 1.5) + shift;
  const cur = {};
  for (let x = xl; x <= xr; x++) {
    const z = zc + Math.round(Math.sin(x * 0.7 + ry * 0.5) * t * 1.2);
    cur[x] = z;
    const pz = prevZ[x] !== undefined ? prevZ[x] : z;
    const edge = ry === 0 || x === xl || x === xr;
    for (let zz = Math.min(z, pz); zz <= Math.max(z, pz); zz++) T(x, ry, zz, edge && ry < 3 ? BRICK : RED);
  }
  prevZ = cur;
}

// boots
TB(-4, 0, -2, -2, 3, 1, BROWN);
TB(2, 0, -2, 4, 3, 1, BROWN);
TB(-4, 3, -2, -2, 3, 1, GRAY);
TB(2, 3, -2, 4, 3, 1, GRAY);
T(-3, 0, -3, BROWN); T(3, 0, -3, BROWN);
// legs
TB(-4, 4, -1, -2, 7, 1, BLACK);
TB(2, 4, -1, 4, 7, 1, BLACK);
TB(-4, 5, -2, -2, 6, -2, GRAY);
TB(2, 5, -2, 4, 6, -2, GRAY);
// tunic skirt
TB(-4, 7, -2, 4, 8, 2, BLACK);
TB(-3, 6, -2, -1, 6, -2, BLACK); TB(1, 6, -2, 3, 6, -2, BLACK);
// belt
TB(-4, 8, -2, 4, 8, 2, BROWN);
TB(-1, 8, -3, 1, 8, -3, GOLD);
// torso
TB(-4, 9, -2, 4, 16, 2, BLACK);
TB(-3, 10, -3, 3, 16, -3, BLACK);
// the classic chest discs
[[-3, 14], [2, 14], [-3, 11], [2, 11]].forEach(([x, y]) => TB(x, y, -4, x + 1, y + 1, -4, IRON));
TB(-1, 13, -4, 1, 13, -4, GRAY);
TB(-1, 10, -3, 1, 10, -3, GRAY);
// pauldrons
TB(5, 14, -2, 6, 16, 2, IRON); TB(5, 17, -1, 6, 17, 1, IRON);
TB(-6, 14, -2, -5, 16, 2, IRON); TB(-6, 17, -1, -5, 17, 1, IRON);
TB(-4, 17, -1, 4, 17, 2, BLACK);
// cape clasps
T(-4, 16, -3, GOLD); T(4, 16, -3, GOLD);
// neck
TB(-1, 17, -1, 1, 17, 1, SAND);

// raised right arm with Mjolnir
limb([5, 14, -1], [7, 18, -1], SAND, 3);
limb([8, 19, -1], [9, 22, -1], s => (s < 0.8 ? IRON : SAND), 2);
TB(8, 23, -2, 10, 24, 0, SAND);
T(9, 25, -1, BROWN); T(9, 26, -1, BROWN);
T(9, 22, -2, BROWN); T(9, 21, -2, BROWN);
// hammer head
TB(7, 27, -2, 11, 29, 0, IRON);
TB(7, 27, -2, 7, 29, 0, GRAY);
TB(11, 27, -2, 11, 29, 0, GRAY);
TB(8, 28, -3, 10, 28, -3, GRAY);
T(9, 28, -3, NEON_BLUE);
// crackle around the hammer
[[6, 28, -1], [12, 28, -1], [9, 30, -1], [8, 30, -2], [10, 30, 0], [6, 29, -3], [12, 27, -3], [9, 27, -4]]
  .forEach(([x, y, z]) => { if (!M.has(K(x, y + Y0, z))) T(x, y, z, ELECTRIC); });

// left arm thrust out, palm crackling
limb([-7, 13, -1], [-9, 11, -2], SAND, 3);
limb([-10, 10, -2], [-12, 9, -3], s => (s < 0.8 ? IRON : SAND), 2);
TB(-14, 8, -3, -13, 10, -2, SAND);
T(-15, 10, -3, SAND); T(-15, 8, -3, SAND); T(-14, 11, -2, SAND);
[[-16, 9, -3], [-16, 10, -2], [-15, 11, -4], [-15, 7, -3], [-17, 8, -4]].forEach(([x, y, z]) => T(x, y, z, ELECTRIC));

// head
TB(-2, 18, -2, 2, 22, 2, SAND);
// long golden hair
TB(-3, 18, 0, -3, 22, 2, YELLOW);
TB(3, 18, 0, 3, 22, 2, YELLOW);
TB(-3, 13, 3, 3, 22, 3, YELLOW);
TB(-2, 12, 3, 2, 12, 3, YELLOW);
TB(-2, 23, -1, 2, 23, 2, YELLOW);
// beard
TB(-2, 17, -3, 2, 19, -3, YELLOW);
TB(-1, 16, -3, 1, 16, -3, YELLOW);
TB(-2, 17, -2, 2, 18, -2, YELLOW);
T(0, 19, -3, BLACK);
T(-1, 20, -3, YELLOW); T(1, 20, -3, YELLOW);
T(0, 20, -3, SAND);
// eyes blazing with lightning
T(-1, 21, -3, NEON_BLUE); T(1, 21, -3, NEON_BLUE);
T(-2, 21, -3, SAND); T(2, 21, -3, SAND); T(0, 21, -3, SAND);
TB(-2, 22, -3, 2, 22, -3, YELLOW);
// winged helmet
TB(-3, 22, -2, 3, 23, -2, IRON);
TB(-3, 23, -1, 3, 23, 1, IRON);
TB(-2, 24, -2, 2, 24, 1, IRON);
TB(-1, 25, -1, 1, 25, 0, IRON);
T(0, 23, -3, GOLD);
[-1, 1].forEach(sx => {
  [[4, 23, 0], [4, 24, 0], [5, 24, 1], [5, 25, 1], [5, 26, 2], [6, 26, 2], [6, 27, 3], [4, 24, 1], [4, 25, 1], [5, 25, 2], [4, 23, 1]]
    .forEach(([x, y, z]) => T(sx * x, y, z, WHITE));
  T(sx * 3, 23, 0, IRON);
});

// flush
for (const [x, y, z, id] of M.values()) block(x, y, z, id);
})();

// --- raw stdout ---
/*
(() => {
const H = (a, b, c) => { const h = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return h - Math.floor(h); };
const M = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function set(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(K(x, y, z), [x, y, z, id]);
}
function setIfEmpty(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (!M.has(K(x, y, z))) set(x, y, z, id);
}
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) set(x, y, z, id);
}
function ln(x1, y1, z1, x2, y2, z2, id, emptyOnly) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  const f = emptyOnly ? setIfEmpty : set;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    f(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id);
  }
}

// ---- clear trees so the scene reads cleanly from the north ----
cube(-22, 1, -22, 22, 12, 3, AIR);
cube(-17, 1, 4, 17, 12, 14, AIR);

// ---- storm clouds (backdrop + flanking, front-facing shells) ----
function cloud(cx, cy, cz, rx, ry, rz, seed) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = x - cx, dy = y - cy, dz = z - cz;
        const wob = (H(x, y + seed, z) - 0.5) * 0.25;
        const n = (dx / rx) ** 2 + (dy / ry) ** 2 + (dz / rz) ** 2 + wob;
        if (n > 1 || n < 0.55) continue;
        if (dz > rz * 0.35) continue;
        const r = H(x + seed, y, z);
        const id = dy < -ry * 0.25 ? (r < 0.3 ? BLACK : GRAY) : (r < 0.25 ? GRAY : LIGHT_GRAY);
        set(x, y, z, id);
      }
}
cloud(-17, 31, 11, 6, 2.6, 4, 1);
cloud(-9, 32, 13, 6, 2.2, 4, 2);
cloud(-1, 31.5, 15, 5.5, 2.4, 3.5, 3);
cloud(9, 32, 11, 6.5, 2.4, 4, 4);
cloud(18, 31, 9, 5.5, 2.6, 4, 5);
cloud(19, 32.5, -8, 4.5, 1.8, 3, 6);
cloud(-18, 32.5, -6, 4.5, 1.8, 3, 7);
// glowing cloud bellies where the bolts are born
[[-17, 29, 9], [-16, 29, 10], [9, 30, 8], [10, 30, 9], [18, 29, 7], [-1, 29, 13], [18, 31, -9], [-18, 31, -7]]
  .forEach(p => set(p[0], p[1], p[2], NEON_BLUE));

// ---- lightning bolts ----
function bolt(a, b, seed, jit, branchChance) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(3, Math.round(d / 4));
  let prev = a;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    let p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    if (i < n) p = [p[0] + (H(seed, i, 1) - 0.5) * jit, p[1] + (H(seed, i, 2) - 0.5) * jit * 0.6, p[2] + (H(seed, i, 3) - 0.5) * jit];
    p = p.map(Math.round);
    ln(prev[0], prev[1], prev[2], p[0], p[1], p[2], NEON_BLUE);
    if (i < n && H(seed, i, 5) < branchChance) {
      const bl = 3 + Math.floor(H(seed, i, 6) * 3);
      const bx = p[0] + Math.round((H(seed, i, 7) - 0.5) * 2 * bl);
      const bz = p[2] + Math.round((H(seed, i, 8) - 0.5) * 2 * bl);
      const by = p[1] - bl;
      ln(p[0], p[1], p[2], bx, by, bz, LIGHT_BLUE, true);
      setIfEmpty(bx, by - 1, bz, ELECTRIC);
    }
    if (i < n) setIfEmpty(p[0], p[1], p[2] - 1, ELECTRIC);
    prev = p;
  }
}
const Y0 = 3; // Thor's feet
// sky bolts converging on Mjolnir
bolt([-17, 29, 9], [7, Y0 + 28, -1], 11, 5, 0.5);
bolt([18, 29, 7], [11, Y0 + 28, -1], 12, 5, 0.5);
bolt([18, 31, -9], [11, Y0 + 29, -2], 13, 3, 0.3);
bolt([-18, 31, -7], [7, Y0 + 29, -2], 14, 5, 0.4);
bolt([9, 30, 8], [9, Y0 + 29, 0], 15, 3, 0.3);
// bolts hurled down to the ground
bolt([11, Y0 + 26, -2], [18, 1, -13], 21, 5, 0.5);
bolt([-15, Y0 + 11, -3], [-19, 1, -12], 22, 4, 0.4);
bolt([-1, 29, 13], [-14, 1, 12], 23, 5, 0.4);

// ---- scorched impact craters ----
function impact(cx, cz, seed) {
  for (let x = cx - 3; x <= cx + 3; x++) for (let z = cz - 3; z <= cz + 3; z++) {
    const d = Math.hypot(x - cx, z - cz);
    if (d > 3 + H(x, seed, z) * 0.8) continue;
    set(x, 0, z, d < 1.5 ? OBSIDIAN : (H(x, z, seed) < 0.5 ? BLACK : COBBLE));
  }
  set(cx, 0, cz, LAVA);
  set(cx, 1, cz, ELECTRIC);
  [[1, 0], [-1, 1], [0, -2], [2, 2], [-2, -1]].forEach(([dx, dz]) => set(cx + dx, 1, cz + dz, FIRE));
  [[2, 2, 0], [-3, 1, 2], [1, 3, -2], [-1, 2, -3]].forEach(([dx, dy, dz]) => set(cx + dx, dy, cz + dz, COBBLE));
}
impact(18, -13, 1);
impact(-19, -12, 2);
impact(-14, 12, 3);

// ---- the crag Thor stands on ----
const TOP = Y0 - 1;
const HM = {};
for (let x = -12; x <= 12; x++) for (let z = -10; z <= 10; z++) {
  const d = Math.hypot(x / 12, z / 10);
  if (d > 1) continue;
  let h = Math.round(TOP + 0.6 - Math.pow(d, 1.5) * 4.2 + (H(x, 0, z) - 0.5) * 1.8);
  if (d < 0.32) h = TOP;
  h = Math.max(-1, Math.min(TOP, h));
  HM[x + ',' + z] = h;
}
for (const key in HM) {
  const [x, z] = key.split(',').map(Number);
  const h = HM[key];
  let lo = h - 1;
  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dz]) => {
    const nh = HM[(x + dx) + ',' + (z + dz)];
    lo = Math.min(lo, nh === undefined ? -1 : nh);
  });
  lo = Math.max(lo, -2);
  for (let y = lo; y <= h; y++) {
    const r = H(x, y, z);
    const id = y === h ? (r < 0.55 ? STONE : r < 0.85 ? COBBLE : GRAY) : (r < 0.5 ? COBBLE : STONE);
    set(x, y, z, id);
  }
}
// jagged boulders around the rim
[[-10, -5, 2], [9, -7, 2], [11, 3, 2], [-11, 4, 1.6], [-4, -9, 1.5], [4, 9, 1.8], [-7, 8, 1.6]].forEach(([bx, bz, r], i) => {
  for (let x = -3; x <= 3; x++) for (let y = 0; y <= 3; y++) for (let z = -3; z <= 3; z++) {
    if (x * x + (y * 1.3) ** 2 + z * z > r * r + H(x + i, y, z) * 1.5) continue;
    set(bx + x, y, bz + z, H(x, y + i, z) < 0.5 ? COBBLE : STONE);
  }
});
// charged cracks radiating from his feet
[[[0, -3], [-4, -6], [-7, -8]], [[2, -3], [5, -5], [9, -4]], [[-3, 0], [-8, 1]]].forEach(path => {
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
    for (let s = 0; s <= n; s++) {
      const x = Math.round(a[0] + (b[0] - a[0]) * s / n), z = Math.round(a[1] + (b[1] - a[1]) * s / n);
      for (let y = TOP; y >= -2; y--) if (M.has(K(x, y, z))) { set(x, y, z, NEON_BLUE); break; }
    }
  }
});
// runestones flanking the front
function runestone(x, z, h) {
  box(x - 1, -1, z, x + 2, 0, z + 1, COBBLE);
  box(x, -1, z, x + 1, TOP + h, z, GRAY);
  set(x, TOP + h + 1, z, GRAY);
  for (let y = 1; y <= TOP + h; y += 2) set(x + ((y >> 1) & 1), y, z - 1, NEON_BLUE);
}
runestone(-8, -7, 4);
runestone(7, -7, 3);

// ---- THOR ----
const T = (x, y, z, id) => set(x, y + Y0, z, id);
const TB = (x1, y1, z1, x2, y2, z2, id) => box(x1, y1 + Y0, z1, x2, y2 + Y0, z2, id);
function limb(a, b, id, t) {
  const n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]), 1);
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const x = Math.round(a[0] + (b[0] - a[0]) * s), y = Math.round(a[1] + (b[1] - a[1]) * s), z = Math.round(a[2] + (b[2] - a[2]) * s);
    TB(x, y, z, x + t - 1, y + t - 1, z + t - 1, typeof id === 'function' ? id(s) : id);
  }
}

// cape — behind him, billowing west in the storm wind
let prevZ = {};
for (let ry = 16; ry >= 0; ry--) {
  const t = (16 - ry) / 16;
  const zc = 3 + Math.round(t * t * 7);
  const shift = -Math.round(t * t * 6);
  const xl = -5 - Math.round(t * 3) + shift, xr = 5 + Math.round(t * 1.5) + shift;
  const cur = {};
  for (let x = xl; x <= xr; x++) {
    const z = zc + Math.round(Math.sin(x * 0.7 + ry * 0.5) * t * 1.2);
    cur[x] = z;
    const pz = prevZ[x] !== undefined ? prevZ[x] : z;
    const edge = ry === 0 || x === xl || x === xr;
    for (let zz = Math.min(z, pz); zz <= Math.max(z, pz); zz++) T(x, ry, zz, edge && ry < 3 ? BRICK : RED);
  }
  prevZ = cur;
}

// boots
TB(-4, 0, -2, -2, 3, 1, BROWN);
TB(2, 0, -2, 4, 3, 1, BROWN);
TB(-4, 3, -2, -2, 3, 1, GRAY);
TB(2, 3, -2, 4, 3, 1, GRAY);
T(-3, 0, -3, BROWN); T(3, 0, -3, BROWN);
// legs
TB(-4, 4, -1, -2, 7, 1, BLACK);
TB(2, 4, -1, 4, 7, 1, BLACK);
TB(-4, 5, -2, -2, 6, -2, GRAY);
TB(2, 5, -2, 4, 6, -2, GRAY);
// tunic skirt
TB(-4, 7, -2, 4, 8, 2, BLACK);
TB(-3, 6, -2, -1, 6, -2, BLACK); TB(1, 6, -2, 3, 6, -2, BLACK);
// belt
TB(-4, 8, -2, 4, 8, 2, BROWN);
TB(-1, 8, -3, 1, 8, -3, GOLD);
// torso
TB(-4, 9, -2, 4, 16, 2, BLACK);
TB(-3, 10, -3, 3, 16, -3, BLACK);
// the classic chest discs
[[-3, 14], [2, 14], [-3, 11], [2, 11]].forEach(([x, y]) => TB(x, y, -4, x + 1, y + 1, -4, IRON));
TB(-1, 13, -4, 1, 13, -4, GRAY);
TB(-1, 10, -3, 1, 10, -3, GRAY);
// pauldrons
TB(5, 14, -2, 6, 16, 2, IRON); TB(5, 17, -1, 6, 17, 1, IRON);
TB(-6, 14, -2, -5, 16, 2, IRON); TB(-6, 17, -1, -5, 17, 1, IRON);
TB(-4, 17, -1, 4, 17, 2, BLACK);
// cape clasps
T(-4, 16, -3, GOLD); T(4, 16, -3, GOLD);
// neck
TB(-1, 17, -1, 1, 17, 1, SAND);

// raised right arm with Mjolnir
limb([5, 14, -1], [7, 18, -1], SAND, 3);
limb([8, 19, -1], [9, 22, -1], s => (s < 0.8 ? IRON : SAND), 2);
TB(8, 23, -2, 10, 24, 0, SAND);
T(9, 25, -1, BROWN); T(9, 26, -1, BROWN);
T(9, 22, -2, BROWN); T(9, 21, -2, BROWN);
// hammer head
TB(7, 27, -2, 11, 29, 0, IRON);
TB(7, 27, -2, 7, 29, 0, GRAY);
TB(11, 27, -2, 11, 29, 0, GRAY);
TB(8, 28, -3, 10, 28, -3, GRAY);
T(9, 28, -3, NEON_BLUE);
// crackle around the hammer
[[6, 28, -1], [12, 28, -1], [9, 30, -1], [8, 30, -2], [10, 30, 0], [6, 29, -3], [12, 27, -3], [9, 27, -4]]
  .forEach(([x, y, z]) => { if (!M.has(K(x, y + Y0, z))) T(x, y, z, ELECTRIC); });

// left arm thrust out, palm crackling
limb([-7, 13, -1], [-9, 11, -2], SAND, 3);
limb([-10, 10, -2], [-12, 9, -3], s => (s < 0.8 ? IRON : SAND), 2);
TB(-14, 8, -3, -13, 10, -2, SAND);
T(-15, 10, -3, SAND); T(-15, 8, -3, SAND); T(-14, 11, -2, SAND);
[[-16, 9, -3], [-16, 10, -2], [-15, 11, -4], [-15, 7, -3], [-17, 8, -4]].forEach(([x, y, z]) => T(x, y, z, ELECTRIC));

// head
TB(-2, 18, -2, 2, 22, 2, SAND);
// long golden hair
TB(-3, 18, 0, -3, 22, 2, YELLOW);
TB(3, 18, 0, 3, 22, 2, YELLOW);
TB(-3, 13, 3, 3, 22, 3, YELLOW);
TB(-2, 12, 3, 2, 12, 3, YELLOW);
TB(-2, 23, -1, 2, 23, 2, YELLOW);
// beard
TB(-2, 17, -3, 2, 19, -3, YELLOW);
TB(-1, 16, -3, 1, 16, -3, YELLOW);
TB(-2, 17, -2, 2, 18, -2, YELLOW);
T(0, 19, -3, BLACK);
T(-1, 20, -3, YELLOW); T(1, 20, -3, YELLOW);
T(0, 20, -3, SAND);
// eyes blazing with lightning
T(-1, 21, -3, NEON_BLUE); T(1, 21, -3, NEON_BLUE);
T(-2, 21, -3, SAND); T(2, 21, -3, SAND); T(0, 21, -3, SAND);
TB(-2, 22, -3, 2, 22, -3, YELLOW);
// winged helmet
TB(-3, 22, -2, 3, 23, -2, IRON);
TB(-3, 23, -1, 3, 23, 1, IRON);
TB(-2, 24, -2, 2, 24, 1, IRON);
TB(-1, 25, -1, 1, 25, 0, IRON);
T(0, 23, -3, GOLD);
[-1, 1].forEach(sx => {
  [[4, 23, 0], [4, 24, 0], [5, 24, 1], [5, 25, 1], [5, 26, 2], [6, 26, 2], [6, 27, 3], [4, 24, 1], [4, 25, 1], [5, 25, 2], [4, 23, 1]]
    .forEach(([x, y, z]) => T(sx * x, y, z, WHITE));
  T(sx * 3, 23, 0, IRON);
});

// flush
for (const [x, y, z, id] of M.values()) block(x, y, z, id);
})();
*/
