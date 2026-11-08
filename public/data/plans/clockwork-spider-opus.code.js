// clockwork-spider-opus — prompt:
// a giant clockwork spider...

const M = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, id);
}
function get(x, y, z) { return M.get(x + ',' + y + ',' + z); }

// ---------- targeted foliage clearing (AIR is free) ----------
cube(-11, 1, -14, 11, 13, 21, AIR);
cube(-12, 2, -22, 12, 10, -15, AIR);
function clearSeg(a, b, r) {
  cube(Math.floor(Math.min(a[0], b[0]) - r), Math.max(1, Math.floor(Math.min(a[1], b[1]) - r)), Math.floor(Math.min(a[2], b[2]) - r),
       Math.ceil(Math.max(a[0], b[0]) + r), Math.ceil(Math.max(a[1], b[1]) + r), Math.ceil(Math.max(a[2], b[2]) + r), AIR);
}

// ---------- helpers ----------
function ellShell(cx, cy, cz, rx, ry, rz, colorFn) {
  const inside = (x, y, z) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1;
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        if (!inside(x, y, z)) continue;
        if (inside(x + 1, y, z) && inside(x - 1, y, z) && inside(x, y + 1, z) && inside(x, y - 1, z) &&
            inside(x, y, z + 1) && inside(x, y, z - 1)) continue;
        put(x, y, z, colorFn(x, y, z));
      }
}
function capsule(a, b, r, id) {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const L2 = dx * dx + dy * dy + dz * dz || 1;
  for (let x = Math.floor(Math.min(a[0], b[0]) - r); x <= Math.ceil(Math.max(a[0], b[0]) + r); x++)
    for (let y = Math.floor(Math.min(a[1], b[1]) - r); y <= Math.ceil(Math.max(a[1], b[1]) + r); y++)
      for (let z = Math.floor(Math.min(a[2], b[2]) - r); z <= Math.ceil(Math.max(a[2], b[2]) + r); z++) {
        let t = ((x - a[0]) * dx + (y - a[1]) * dy + (z - a[2]) * dz) / L2;
        t = Math.max(0, Math.min(1, t));
        const px = a[0] + dx * t - x, py = a[1] + dy * t - y, pz = a[2] + dz * t - z;
        if (px * px + py * py + pz * pz <= r * r) put(x, y, z, typeof id === 'function' ? id(t) : id);
      }
}
function seg(a, b, id) {
  const n = Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]))) || 1;
  for (let i = 0; i <= n; i++) { const t = i / n; put(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, id); }
}
function ball(cx, cy, cz, r, id) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++)
        if ((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= r * r) put(x, y, z, id);
}
// gear: plane 'xy' faces north, 'yz' faces east/west, 'xz' lies flat
function gear(cx, cy, cz, r, plane, rim, hub, teeth) {
  const P = (u, v, id) => {
    if (plane === 'xy') put(cx + u, cy + v, cz, id);
    else if (plane === 'yz') put(cx, cy + v, cz + u, id);
    else put(cx + u, cy, cz + v, id);
  };
  const R = Math.ceil(r + 1.5);
  for (let u = -R; u <= R; u++) for (let v = -R; v <= R; v++) {
    const d = Math.sqrt(u * u + v * v);
    const ang = Math.atan2(v, u);
    if (d <= 1.2) P(u, v, hub);
    else if (d > r - 1 && d <= r + 0.4) P(u, v, rim);
    else if (d > r + 0.4 && d <= r + 1.4) {
      const k = (ang / (2 * Math.PI)) * teeth;
      if (((k % 1) + 1) % 1 < 0.45) P(u, v, rim);
    } else if (d < r - 1) {
      if (Math.abs(Math.sin(2 * ang)) < 0.55 / d) P(u, v, rim);
    }
  }
}

// ---------- ABDOMEN ----------
const A = { x: 0, y: 13.5, z: 12.5, rx: 8, ry: 7, rz: 8.5 };
ellShell(A.x, A.y, A.z, A.rx, A.ry, A.rz, (x, y, z) => {
  const ph = Math.hypot(x, y - 16.5);
  if (z < A.z - 4 && ph <= 2.6) return GLASS;
  if (z < A.z - 3 && ph <= 3.7) return GOLD;
  if (x === 0 && y > A.y + 3) return IRON;
  if ((z - 4) % 4 === 0) return GOLD;
  if (y > A.y + 2 && Math.abs(x) >= 2 && Math.abs(x) <= 4 && (z === 10 || z === 14)) return OBSIDIAN;
  if (y < A.y - 4) return BROWN;
  if ((x + y * 3 + z * 5) % 11 === 0) return IRON;
  return COPPER;
});
ball(0, 15.5, 10, 1.6, GLOWSTONE);
gear(0, 16, 7, 1.8, 'xy', GOLD, IRON, 6);
gear(8, 13, 12, 3, 'yz', GOLD, IRON, 10);
gear(-8, 13, 13, 3, 'yz', GOLD, IRON, 10);
gear(8, 9, 16, 1.6, 'yz', IRON, COPPER, 6);
gear(-8, 9, 8, 1.6, 'yz', IRON, COPPER, 6);
capsule([0, 10, 19], [0, 9, 22], 1.0, IRON);
put(0, 9, 22, GOLD);
for (const sx of [-3, 3]) {
  for (let y = 19; y <= 21; y++) for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) put(sx + dx, y, 17 + dz, IRON);
  put(sx, 22, 17, OBSIDIAN);
  block(sx, 23, 17, STEAM);
}

// ---------- WIND-UP KEY ----------
capsule([0, 20, 13], [0, 26, 13], 0.8, IRON);
for (let y = 21; y <= 25; y += 2) for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) put(dx, y, 13 + dz, GOLD);
for (const sx of [-1, 1]) {
  for (let a = 0; a < Math.PI * 2; a += 0.08) {
    const x = sx * 3.8 + Math.cos(a) * 3, y = 28.5 + Math.sin(a) * 3;
    put(x, y, 13, GOLD); put(x, y, 12, GOLD);
  }
}
for (let x = -1; x <= 1; x++) for (let y = 26; y <= 31; y++) for (let z = 12; z <= 13; z++) put(x, y, z, GOLD);
put(0, 28, 11, OBSIDIAN); put(0, 29, 11, OBSIDIAN);

// ---------- PEDICEL ----------
capsule([0, 11, 3], [0, 12, 6], 2.2, OBSIDIAN);
capsule([-2, 10, 3], [-2, 11, 6], 0.6, COPPER);
capsule([2, 10, 3], [2, 11, 6], 0.6, COPPER);

// ---------- CEPHALOTHORAX ----------
const C = { x: 0, y: 10.5, z: -2, rx: 5.8, ry: 4, rz: 6.5 };
ellShell(C.x, C.y, C.z, C.rx, C.ry, C.rz, (x, y, z) => {
  if (y === 10) return GOLD;
  if (y >= 13 && Math.abs(x) <= 1) return OBSIDIAN;
  if ((x * 7 + z * 3 + y) % 9 === 0) return COPPER;
  return IRON;
});
gear(0, 15, -2, 2.5, 'xz', GOLD, COPPER, 8);
put(0, 16, -2, IRON);

// ---------- HEAD ----------
const H = { x: 0, y: 9.5, z: -9, rx: 3.8, ry: 3.3, rz: 3.2 };
ellShell(H.x, H.y, H.z, H.rx, H.ry, H.rz, (x, y, z) => (y >= 12 ? IRON : OBSIDIAN));
function frontZ(x, y) { for (let z = -22; z <= 0; z++) if (get(x, y, z) !== undefined) return z; return -12; }
function eye(x, y, id) { put(x, y, frontZ(x, y) - 1, id); }
for (const [x, y] of [[-2, 9], [-1, 9], [-2, 10], [-1, 10], [1, 9], [2, 9], [1, 10], [2, 10]]) eye(x, y, NEON_RED);
eye(-3, 11, NEON_RED); eye(3, 11, NEON_RED);
eye(-1, 12, NEON_RED); eye(1, 12, NEON_RED);
eye(-3, 8, LAVA); eye(3, 8, LAVA);
for (const x of [-2, -1, 1, 2]) put(x, 11, frontZ(x, 11) - 1, GOLD);

for (const s of [-1, 1]) {
  capsule([s * 1.5, 7, -10.5], [s * 2, 4, -13], 0.9, IRON);
  seg([s * 2, 4, -13], [s * 1.5, 2, -14], GOLD);
  seg([s * 1.5, 2, -14], [s * 0.6, 1, -13.5], GOLD);
  capsule([s * 3, 7.5, -9], [s * 5, 7, -14], 0.7, IRON);
  ball(s * 5, 7, -14, 1, COPPER);
  seg([s * 5, 7, -14], [s * 5, 1, -16], IRON);
  put(s * 5, 0, -16, GOLD);
}
block(-1, 1, -14, ELECTRIC); block(1, 1, -14, ELECTRIC);

// ---------- LEGS ----------
const legs = [];
for (const s of [-1, 1]) {
  legs.push({ s, hip: [4 * s, 9, -6], knee: [9 * s, 20, -13], ank: [13 * s, 9, -19], foot: [14 * s, -2, -21] });
  legs.push({ s, hip: [5.5 * s, 10, -3], knee: [13 * s, 22, -7], ank: [18 * s, 10, -11], foot: [20 * s, -2, -13] });
  legs.push({ s, hip: [5.5 * s, 10, 0], knee: [13 * s, 22, 3], ank: [19 * s, 10, 6], foot: [20 * s, -2, 8] });
  legs.push({ s, hip: [4.5 * s, 10, 3], knee: [11 * s, 21, 11], ank: [16 * s, 9, 17], foot: [18 * s, -2, 21] });
}
legs[0] = { s: -1, hip: [-4, 9, -6], knee: [-10, 23, -10], ank: [-13, 21, -18], foot: [-12, 12, -22], raised: true };

for (const L of legs) { clearSeg(L.hip, L.knee, 2); clearSeg(L.knee, L.ank, 2); clearSeg(L.ank, L.foot, 1); }
for (const L of legs) {
  capsule(L.hip, L.knee, 1.25, t => (t < 0.15 ? OBSIDIAN : (Math.floor(t * 6) % 2 === 1 ? IRON : COPPER)));
  const mid = [(L.hip[0] + L.knee[0]) / 2, (L.hip[1] + L.knee[1]) / 2 - 1.5, (L.hip[2] + L.knee[2]) / 2];
  seg([L.hip[0], L.hip[1] - 2, L.hip[2]], mid, GOLD);
  capsule(L.knee, L.ank, 0.95, t => (t > 0.45 && t < 0.55 ? GOLD : IRON));
  capsule(L.ank, L.foot, 0.6, t => (t > 0.85 ? GOLD : OBSIDIAN));
  ball(L.knee[0], L.knee[1], L.knee[2], 1.7, GOLD);
  put(L.knee[0] + L.s * 2, L.knee[1], L.knee[2], OBSIDIAN);
  ball(L.ank[0], L.ank[1], L.ank[2], 1.2, COPPER);
  ball(L.hip[0], L.hip[1], L.hip[2], 1.5, GOLD);
  if (!L.raised) { put(L.foot[0], L.foot[1] - 1, L.foot[2], OBSIDIAN); put(L.foot[0], L.foot[1] + 1, L.foot[2], GOLD); }
}
seg([-12, 12, -22], [-11, 11, -21], GOLD);
block(-13, 11, -22, ELECTRIC);
block(13, 24, -7, STEAM); block(-13, 24, 3, STEAM);

// ---------- FOREGROUND DEBRIS ----------
gear(7, 0, -17, 1.6, 'xz', COPPER, IRON, 6);
gear(-5, 0, -19, 1.2, 'xz', GOLD, IRON, 5);
gear(10, 1, -12, 1.8, 'yz', IRON, GOLD, 7);
put(9, 0, -12, OBSIDIAN);
for (const [x, z] of [[3, -18], [-2, -16], [5, -14], [-8, -13], [12, -19]]) put(x, 0, z, IRON);
put(3, 1, -18, GOLD);
put(-9, 1, -20, COBBLE); put(-10, 1, -19, GRAY); put(-8, 1, -21, COBBLE); put(-11, 1, -20, GRAY);

// ---------- EMIT ----------
for (const [k, id] of M) { const p = k.split(','); block(+p[0], +p[1], +p[2], id); }