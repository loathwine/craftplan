// lava-golem-sonnet55 — prompt:
// a lava golem...

cube(-19, 0, -14, 19, 8, 9, AIR);

const placed = new Map();
function put(x, y, z, id, pri) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  pri = pri || 0;
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  const e = placed.get(k);
  if (e && e.pri > pri) return;
  placed.set(k, { x, y, z, id, pri });
}
function h(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function skin(x, y, z) {
  const v = Math.sin(x * 0.85 + y * 0.45 + 1) * Math.cos(z * 0.8 + y * 0.65);
  if (Math.abs(v) < 0.06) return LAVA;
  const r = h(x, y, z);
  if (r < 0.38) return BLACK;
  if (r < 0.5) return OBSIDIAN;
  if (r < 0.7) return GRAY;
  if (r < 0.88) return COBBLE;
  if (r < 0.94) return STONE;
  return BRICK;
}
function dark(x, y, z) {
  const r = h(x + 3, y, z - 2);
  if (r < 0.6) return BLACK;
  if (r < 0.85) return OBSIDIAN;
  return GRAY;
}
function ellip(cx, cy, cz, rx, ry, rz, fn, hollow, pri) {
  for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++)
    for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++)
      for (let z = Math.floor(cz - rz - 1); z <= Math.ceil(cz + rz + 1); z++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
        if (d > 1) continue;
        if (hollow !== false) {
          const d2 = ((x - cx) / (rx - 1)) ** 2 + ((y - cy) / (ry - 1)) ** 2 + ((z - cz) / (rz - 1)) ** 2;
          if (d2 < 1) continue;
        }
        put(x, y, z, fn(x, y, z), pri);
      }
}
function shellBox(x1, y1, z1, x2, y2, z2, fn, pri) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++) {
        if (x === x1 || x === x2 || y === y1 || y === y2 || z === z1 || z === z2) put(x, y, z, fn(x, y, z), pri);
      }
}
function tube(x1, y1, z1, x2, y2, z2, r, fn, pri) {
  const lx = x2 - x1, ly = y2 - y1, lz = z2 - z1;
  const L2 = lx * lx + ly * ly + lz * lz;
  for (let x = Math.floor(Math.min(x1, x2) - r - 1); x <= Math.ceil(Math.max(x1, x2) + r + 1); x++)
    for (let y = Math.floor(Math.min(y1, y2) - r - 1); y <= Math.ceil(Math.max(y1, y2) + r + 1); y++)
      for (let z = Math.floor(Math.min(z1, z2) - r - 1); z <= Math.ceil(Math.max(z1, z2) + r + 1); z++) {
        let t = ((x - x1) * lx + (y - y1) * ly + (z - z1) * lz) / L2;
        t = Math.max(0, Math.min(1, t));
        const dx = x - (x1 + t * lx), dy = y - (y1 + t * ly), dz = z - (z1 + t * lz);
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d <= r && d > r - 1.3) put(x, y, z, fn(x, y, z), pri);
      }
}
function seg(x1, y1, z1, x2, y2, z2, id, thick, pri) {
  const n = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1))) * 2 + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t, z = z1 + (z2 - z1) * t;
    put(x, y, z, id, pri);
    if (thick) { put(x + 1, y, z, id, pri); put(x, y, z + 1, id, pri); put(x + 1, y, z + 1, id, pri); }
  }
}
function spike(bx, by, bz, dx, dy, dz, len, id, tip) {
  const m = Math.hypot(dx, dy, dz);
  dx /= m; dy /= m; dz /= m;
  for (let i = 0; i <= len; i++) {
    const x = bx + dx * i, y = by + dy * i, z = bz + dz * i;
    put(x, y, z, i === len ? tip : id, 1);
    if (i < len * 0.5) { put(x + 1, y, z, id, 1); put(x, y, z + 1, id, 1); put(x + 1, y, z + 1, id, 1); }
  }
}
function fz(E, x, y) {
  const s = 1 - ((x - E.cx) / E.rx) ** 2 - ((y - E.cy) / E.ry) ** 2;
  return s > 0 ? E.cz - E.rz * Math.sqrt(s) : null;
}
function onFace(E, x, y, id, off, pri) {
  const z = fz(E, x, y);
  if (z === null) return;
  put(x, y, Math.ceil(z) - (off || 0), id, pri);
}
function ridgeRow(E, y, fn, pri) {
  for (let x = Math.floor(E.cx - E.rx); x <= Math.ceil(E.cx + E.rx); x++) {
    const z = fz(E, x, y);
    if (z !== null) put(x, y, Math.ceil(z) - 1, fn(x, y, 0), pri);
  }
}

// ---------- body parts ----------
const T = { cx: 0, cy: 19.5, cz: 0, rx: 9.5, ry: 6.5, rz: 6.5 };
const P = { cx: 0, cy: 12.5, cz: 0, rx: 8, ry: 3.5, rz: 5 };
const H = { cx: 0, cy: 28.5, cz: -1, rx: 4, ry: 3.5, rz: 4 };

ellip(T.cx, T.cy, T.cz, T.rx, T.ry, T.rz, skin);
ellip(P.cx, P.cy, P.cz, P.rx, P.ry, P.rz, skin);

// legs + feet
for (const s of [1, -1]) {
  ellip(s * 5.5, 7, 0, 3.5, 5.5, 3.5, skin);
  ellip(s * 5.5, 6.5, -3.5, 2.4, 2.4, 1.5, dark, false, 1);
  shellBox(Math.min(s * 2, s * 9), 0, -5, Math.max(s * 2, s * 9), 2, 3, skin);
  for (const t of [2, 5, 8]) {
    const bx = s > 0 ? t : -(t + 1);
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) {
      put(bx + a, b, -7 + c, c === 0 && b === 1 ? OBSIDIAN : skin(bx + a, b, -7 + c), 0);
    }
  }
}

// shoulders
for (const s of [1, -1]) ellip(s * 11.5, 24, 0, 4.5, 4, 4.5, skin);

// left arm (hanging)
tube(-12.5, 22, -0.5, -13.5, 13, -1.5, 3.3, skin);
tube(-13.5, 13, -1.5, -13.5, 7, -3, 3.7, skin);
const FL = { cx: -13.5, cy: 4, cz: -3.5, rx: 4.2, ry: 4.2, rz: 4.2 };
ellip(FL.cx, FL.cy, FL.cz, FL.rx, FL.ry, FL.rz, skin);
for (const x of [-16, -14, -12, -10]) {
  onFace(FL, x, 5, BLACK, 1, 1);
  onFace(FL, x, 6, OBSIDIAN, 1, 1);
}

// right arm (raised fist)
tube(12.5, 22, -0.5, 14.5, 14, -1, 3.3, skin);
tube(14.5, 14, -1, 13.5, 19.5, -8, 3.4, skin);
const FR = { cx: 13, cy: 21, cz: -10.5, rx: 4.2, ry: 4.2, rz: 4.2 };
ellip(FR.cx, FR.cy, FR.cz, FR.rx, FR.ry, FR.rz, skin);
for (const x of [10, 12, 14, 16]) {
  onFace(FR, x, 22, LAVA, 1, 1);
  onFace(FR, x, 20, dark(x, 20, 0), 1, 1);
}

// head
ellip(H.cx, H.cy, H.cz, H.rx, H.ry, H.rz, skin);

// ---------- chest details ----------
ellip(0, 19, -5, 2.6, 2.6, 2.6, () => LAVA, false, 2);
put(0, 19, -7, GLOWSTONE, 3);
put(0, 20, -7, GLOWSTONE, 3);
put(0, 18, -7, GLOWSTONE, 3);
for (let dx = -5; dx <= 5; dx++) for (let dy = -5; dy <= 5; dy++) {
  const r = Math.hypot(dx, dy);
  if (r >= 3.3 && r < 4.3) {
    const z = fz(T, dx, 19 + dy);
    if (z !== null) put(dx, 19 + dy, Math.ceil(z) - 1, dark(dx, 19 + dy, 0), 1);
  }
}
for (const y of [24, 22, 16, 14]) ridgeRow(T, y, dark, 1);
ridgeRow(P, 11, dark, 1);
ridgeRow(P, 13, dark, 1);

// ---------- face ----------
for (const s of [1, -1]) {
  onFace(H, s * 1, 29, NEON_RED, 0, 3);
  onFace(H, s * 2, 29, GLOWSTONE, 0, 3);
  onFace(H, s * 3, 29, NEON_RED, 0, 3);
  onFace(H, s * 1, 30, OBSIDIAN, 1, 2);
  onFace(H, s * 2, 30, OBSIDIAN, 1, 2);
  onFace(H, s * 3, 31, OBSIDIAN, 1, 2);
}
onFace(H, 0, 28, BLACK, 1, 2);
onFace(H, 0, 29, BLACK, 1, 2);
for (let x = -3; x <= 3; x++) {
  onFace(H, x, 26, LAVA, 0, 2);
  if (x % 2 !== 0) onFace(H, x, 27, GRAY, 1, 2);
}
onFace(H, -2, 25, ORANGE, 0, 2);
onFace(H, 1, 25, ORANGE, 0, 2);

// horns
for (const s of [1, -1]) {
  seg(s * 3, 30, -1, s * 5, 32, -1, OBSIDIAN, true, 1);
  seg(s * 5, 32, -1, s * 7, 33, -1, OBSIDIAN, false, 1);
  put(s * 7, 33, -1, ORANGE, 2);
}
put(0, 33, -1, FIRE, 3);
put(-2, 33, 0, FIRE, 3);
put(2, 33, 0, FIRE, 3);

// shoulder spikes (left side bigger — asymmetry)
for (const s of [1, -1]) {
  const big = s === -1 ? 1 : 0;
  spike(s * 9, 26.5, -2, 0.2 * s, 0.9, -0.1, 4 + big, dark(0, 0, 0) === GRAY ? BLACK : OBSIDIAN, LAVA);
  spike(s * 12, 27, 0, 0.5 * s, 0.8, 0, 5 + big, OBSIDIAN, LAVA);
  spike(s * 14, 25.5, 1, 0.9 * s, 0.5, 0.2, 5, BLACK, ORANGE);
  spike(s * 11, 27, 3, 0.3 * s, 0.9, 0.5, 4, OBSIDIAN, LAVA);
}
for (const s of [1, -1]) {
  put(s * 12, 31, 0, FIRE, 3);
  put(s * 15, 29, 1, FIRE, 3);
}
put(-12, 32, -1, FIRE, 3);
for (const p of [[11, 26, -10], [14, 26, -11], [13, 26, -9], [15, 25, -9]]) put(p[0], p[1], p[2], FIRE, 3);

// back spikes
for (const yy of [15, 18, 21, 24]) {
  spike(0, yy, 6, 0, 0.3, 1, 3, OBSIDIAN, LAVA);
  spike(-4, yy + 1, 5, -0.3, 0.4, 1, 3, BLACK, ORANGE);
  spike(4, yy + 1, 5, 0.3, 0.4, 1, 3, BLACK, ORANGE);
}

// chest/torso fire vents
put(-6, 26, -2, FIRE, 3);
put(6, 26, -2, FIRE, 3);
put(0, 27, 3, FIRE, 3);

// ---------- rubble ----------
const rubble = [[-17, 0, -10, 1.8], [-7, 0, -13, 2.2], [9, 0, -13, 1.8], [17, 0, -6, 2.2], [-20, 0, 3, 1.6], [19, 0, 5, 1.7], [0, 0, -12, 1.4], [-11, 0, -12, 1.3]];
for (const r of rubble) ellip(r[0], r[1], r[2], r[3], r[3] * 0.8, r[3], skin, false, 0);
put(-7, 2, -13, FIRE, 3);
put(17, 2, -6, FIRE, 3);

// ---------- scorched ground ----------
for (let x = -15; x <= 15; x++)
  for (let z = -11; z <= 9; z++) {
    const e = (x / 15) ** 2 + ((z + 1) / 10.5) ** 2;
    if (e >= 1) continue;
    const r = h(x * 1.3, 0, z * 1.7);
    if (r <= 0.5) continue;
    put(x, -1, z, r > 0.9 ? LAVA : (r > 0.7 ? BLACK : COBBLE), -1);
  }

// ---------- flush with budget cap ----------
const cells = Array.from(placed.values());
cells.sort((a, b) => b.pri - a.pri);
const final = cells.slice(0, 3980);
for (const c of final) block(c.x, c.y, c.z, c.id);