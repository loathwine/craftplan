// howling-wolf-opus — prompt:
// a wolf howling at the moon...

const M = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
function get(x, y, z) { const v = M.get(x + ',' + y + ',' + z); return v ? v[3] : null; }
function h(x, y, z) { const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return n - Math.floor(n); }

function styleCol(style, x, y, z, ny) {
  const r = h(x, y, z);
  if (typeof style === 'number') return style;
  if (style === 'fur') {
    if (ny < -0.35) return r < 0.25 ? WHITE : LIGHT_GRAY;
    if (ny > 0.55) return r < 0.3 ? BLACK : GRAY;
    return r < 0.15 ? LIGHT_GRAY : GRAY;
  }
  if (style === 'light') return r < 0.3 ? WHITE : LIGHT_GRAY;
  if (style === 'rock') return r < 0.28 ? COBBLE : (r < 0.36 ? GRAY : STONE);
  return style;
}
function ell(cx, cy, cz, rx, ry, rz, style) {
  rx = Math.max(rx, 0.6); ry = Math.max(ry, 0.6); rz = Math.max(rz, 0.6);
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) put(x, y, z, styleCol(style, x, y, z, dy));
      }
}
function cap(ax, ay, az, bx, by, bz, r1, r2, style) {
  r1 = Math.max(r1, 0.55); r2 = Math.max(r2, 0.55);
  const R = Math.max(r1, r2);
  const vx = bx - ax, vy = by - ay, vz = bz - az, L2 = vx * vx + vy * vy + vz * vz || 1;
  for (let x = Math.floor(Math.min(ax, bx) - R); x <= Math.ceil(Math.max(ax, bx) + R); x++)
    for (let y = Math.floor(Math.min(ay, by) - R); y <= Math.ceil(Math.max(ay, by) + R); y++)
      for (let z = Math.floor(Math.min(az, bz) - R); z <= Math.ceil(Math.max(az, bz) + R); z++) {
        let t = ((x - ax) * vx + (y - ay) * vy + (z - az) * vz) / L2;
        t = Math.max(0, Math.min(1, t));
        const px = ax + vx * t, py = ay + vy * t, pz = az + vz * t;
        const d = Math.hypot(x - px, y - py, z - pz), rr = r1 + (r2 - r1) * t;
        if (d <= rr) put(x, y, z, styleCol(style, x, y, z, (y - py) / rr));
      }
}

// ---------- clear trees in the footprint (ground stays) ----------
cube(-16, 1, -20, 18, 9, 16, AIR);

// ---------- rocky outcrop ----------
function rockLayer(y, cx, cz, rx, rz, top) {
  for (let x = Math.floor(cx - rx - 2); x <= Math.ceil(cx + rx + 2); x++)
    for (let z = Math.floor(cz - rz - 2); z <= Math.ceil(cz + rz + 2); z++) {
      const n = h(Math.round(x / 2), y >> 1, Math.round(z / 2)) * 0.22 - 0.08;
      const dx = (x - cx) / rx, dz = (z - cz) / rz, d = Math.sqrt(dx * dx + dz * dz);
      if (d > 1 + n) continue;
      const inner = Math.sqrt(((x - cx) / (rx - 2.2)) ** 2 + ((z - cz) / (rz - 2.2)) ** 2);
      if (!top && inner < 0.95) continue;
      put(x, y, z, styleCol('rock', x, y, z, 0));
    }
}
for (let y = -3; y <= 6; y++) {
  const k = 6 - y;
  rockLayer(y, 0, 3.5, 8.5 + k * 0.55, 9.5 + k * 0.5, y === 6);
}
for (let y = -2; y <= 2; y++) {
  const k = 2 - y;
  rockLayer(y, 9, -5, 4 + k * 0.5, 3.6 + k * 0.5, y === 2);
}
ell(-7, 0, -6, 2.6, 2.2, 2.4, 'rock');
ell(-3, -1, -8, 2.2, 1.8, 2.0, 'rock');
ell(4, -1, -9, 1.8, 1.5, 1.8, 'rock');
ell(-10, -1, 0, 2.0, 2.0, 2.4, 'rock');
for (const v of M.values()) {
  const [x, y, z, id] = v;
  if ((id === STONE || id === COBBLE || id === GRAY) && get(x, y + 1, z) === null) {
    const r = h(x * 3, y, z * 3);
    if (y <= 1 && r < 0.45) v[3] = r < 0.2 ? LEAVES : GRASS;
    else if (r < 0.18) v[3] = GRASS;
  }
}

// ---------- wolf builder ----------
function wolf(ox, oy, oz, s, yawDeg) {
  const a = yawDeg * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
  const T = (x, y, z) => [ox + (x * c - z * sn) * s, oy + y * s, oz + (x * sn + z * c) * s];
  const E = (x, y, z, rx, ry, rz, st) => { const p = T(x, y, z); ell(p[0], p[1], p[2], rx * s, ry * s, rz * s, st); };
  const C = (a1, b1, r1, r2, st) => { const p = T(a1[0], a1[1], a1[2]), q = T(b1[0], b1[1], b1[2]); cap(p[0], p[1], p[2], q[0], q[1], q[2], r1 * s, r2 * s, st); };
  const B = (x, y, z, id) => { const p = T(x, y, z); put(p[0], p[1], p[2], id); };

  C([0, 3, 7.5], [1.5, 1.5, 9.5], 1.4, 1.7, 'fur');
  C([1.5, 1.5, 9.5], [4, 0.9, 9.6], 1.7, 1.5, 'fur');
  C([4, 0.9, 9.6], [5.6, 0.8, 7.2], 1.5, 1.0, 'fur');
  C([5.6, 0.8, 7.2], [6.0, 0.8, 6.0], 1.0, 0.6, 'light');
  E(0, 3.6, 5, 3.0, 3.2, 3.0, 'fur');
  for (const sx of [-1, 1]) {
    E(sx * 2.6, 2.7, 4, 2.3, 2.8, 3.2, 'fur');
    C([sx * 3, 0.4, 3], [sx * 3, 0.4, -0.6], 1.0, 0.9, 'light');
  }
  C([0, 4, 4], [0, 10, -0.5], 3.2, 3.0, 'fur');
  E(0, 5, 0.6, 2.2, 2.0, 2.0, 'light');
  for (const sx of [-1, 1]) {
    E(sx * 1.9, 9, -1, 1.6, 2.6, 1.8, 'fur');
    C([sx * 1.5, 8.5, -2.2], [sx * 1.5, 0.6, -2.8], 1.15, 0.9, 'fur');
    E(sx * 1.5, 0.4, -3.6, 1.1, 0.7, 1.4, 'light');
    B(sx * 1.5, 0, -4.6, BLACK);
  }
  E(0, 9.4, -2.1, 2.8, 3.6, 2.2, 'light');
  C([0, 10, -0.5], [0, 15, -2], 2.7, 2.1, 'fur');
  C([0, 10, -2.4], [0, 14.6, -3.5], 1.9, 1.5, 'light');
  E(0, 16.3, -2.3, 2.3, 2.2, 2.4, 'fur');
  for (const sx of [-1, 1]) E(sx * 1.5, 15.6, -3.2, 1.2, 1.2, 1.2, 'light');
  C([0, 16.9, -3.6], [0, 20.5, -5.8], 1.4, 0.8, 'fur');
  C([0, 15.1, -3.9], [0, 17.5, -6.3], 0.95, 0.6, 'light');
  B(0, 17.1, -4.9, PINK); B(0, 16.3, -4.6, RED); B(0, 17.8, -5.4, PINK);
  B(0, 21.0, -6.1, BLACK); B(0, 20.4, -6.3, BLACK);
  for (const sx of [-1, 1]) {
    C([sx * 1.3, 17.8, -1.2], [sx * 1.6, 20.3, 0.4], 0.9, 0.35, 'fur');
    B(sx * 1.6, 20.4, 0.5, BLACK);
    B(sx * 1.25, 17.6, -4.1, BLACK);
  }
}
wolf(0, 7, 1, 1.15, 25);
wolf(9, 3, -4.5, 0.5, 40);

// ---------- full moon behind the howling head ----------
const MX = -2, MY = 24, MZ = 21, MR = 8.5;
const craters = [[-5, 26, 2], [1, 21, 1.6], [-1, 28.5, 1.2], [2.5, 26, 1.1], [-6, 20.5, 1.3], [-2, 23.5, 0.9]];
for (let x = MX - 10; x <= MX + 10; x++)
  for (let y = MY - 10; y <= MY + 10; y++) {
    const d = Math.hypot(x - MX, y - MY);
    if (d <= MR) {
      let id = h(x, y, 5) < 0.15 ? SNOW : WHITE;
      for (const cr of craters) if (Math.hypot(x - cr[0], y - cr[1]) <= cr[2]) id = LIGHT_GRAY;
      put(x, y, MZ, id);
      if (d > MR - 1.2) put(x, y, MZ + 1, LIGHT_GRAY);
    } else if (d <= MR + 0.9 && h(x, y, 9) < 0.3) {
      put(x, y, MZ, GLOWSTONE);
    }
  }
cap(-14, 18, 18, -4, 18, 18, 0.6, 0.6, LIGHT_GRAY);
cap(-9, 19, 18, -6, 19, 18, 0.5, 0.5, WHITE);
cap(5, 28, 18, 14, 28, 18, 0.55, 0.55, LIGHT_GRAY);
cap(8, 29, 18, 11, 29, 18, 0.5, 0.5, WHITE);
for (const p of [[12, 32], [16, 26], [-16, 31], [-19, 24], [9, 21], [19, 30], [-12, 27], [3, 33]]) put(p[0], p[1], 22, GLOWSTONE);

// ---------- dead tree on the west, branches clawing toward the moon ----------
cap(-13, 0, 7, -12, 8, 7, 1.2, 0.8, OAK_LOG);
cap(-12, 8, 7, -11, 14, 6, 0.8, 0.6, OAK_LOG);
const br = [
  [-12, 9, 7, -8, 13, 5], [-8, 13, 5, -5, 16, 4], [-5, 16, 4, -4, 19, 4], [-5, 16, 4, -2, 17, 5],
  [-12, 11, 7, -16, 15, 8], [-16, 15, 8, -18, 19, 8], [-16, 15, 8, -19, 16, 9],
  [-11, 14, 6, -9, 19, 6], [-9, 19, 6, -6, 22, 5], [-9, 19, 6, -10, 23, 7],
  [-11, 14, 6, -13, 19, 5], [-13, 19, 5, -15, 22, 5], [-8, 13, 5, -7, 11, 3],
];
for (const b of br) cap(b[0], b[1], b[2], b[3], b[4], b[5], 0.5, 0.5, BROWN);
ell(-13, -0.5, 7, 2.2, 0.8, 2.2, OAK_LOG);

// ---------- pines framing the east side ----------
function pine(x, y0, z, H) {
  for (let y = y0; y < y0 + H; y++) put(x, y, z, OAK_LOG);
  for (let y = y0 + 3; y <= y0 + H + 1; y++) {
    const t = (y0 + H + 1 - y);
    const r = t * 0.25 + ((y - y0) % 3 === 0 ? 0.9 : 0.1);
    const R = Math.ceil(r);
    for (let dx = -R; dx <= R; dx++)
      for (let dz = -R; dz <= R; dz++)
        if (dx * dx + dz * dz <= r * r) put(x + dx, y, z + dz, h(x + dx, y, z + dz) < 0.4 ? GREEN : LEAVES);
  }
}
pine(16, 0, 12, 14);
pine(13, 0, 18, 17);

// ---------- emit (safety cap on solid count) ----------
let solid = 0;
for (const v of M.values()) {
  if (v[3] !== AIR) { if (solid >= 3990) break; solid++; }
  block(v[0], v[1], v[2], v[3]);
}