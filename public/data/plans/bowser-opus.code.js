// bowser-opus — prompt:
// Bowser...

const M = new Map();
const key = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(key(x, y, z), [x, y, z, id]);
}
function get(x, y, z) { const v = M.get(key(x, y, z)); return v ? v[3] : null; }
function del(x, y, z) { M.delete(key(x, y, z)); }
function H(x, y, z) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function norm(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

function ell(cx, cy, cz, rx, ry, rz, f) {
  for (let x = Math.ceil(cx - rx); x <= Math.floor(cx + rx); x++)
    for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++)
      for (let z = Math.ceil(cz - rz); z <= Math.floor(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) {
          const id = typeof f === 'function' ? f(x, y, z, dx, dy, dz) : f;
          if (id != null) put(x, y, z, id);
        }
      }
}
function ball(x, y, z, r, f) {
  if (r < 0.8) {
    const id = typeof f === 'function' ? f(Math.round(x), Math.round(y), Math.round(z), 0, 0, 0) : f;
    if (id != null) put(x, y, z, id);
    return;
  }
  ell(x, y, z, r, r, r, f);
}
function tube(pts, r0, r1, f) {
  let L = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); seg.push(l); L += l;
  }
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], l = seg[i - 1];
    const n = Math.max(1, Math.ceil(l / 0.35));
    for (let k = 0; k <= n; k++) {
      const t = k / n, g = (acc + l * t) / L, r = r0 + (r1 - r0) * g;
      ball(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, f);
    }
    acc += l;
  }
}
function cuff(c, ax, R, hl, id, nS, sid, sl, phase, skip) {
  ax = norm(ax);
  const ext = Math.ceil(R + hl + 1);
  for (let x = Math.floor(c[0] - ext); x <= Math.ceil(c[0] + ext); x++)
    for (let y = Math.floor(c[1] - ext); y <= Math.ceil(c[1] + ext); y++)
      for (let z = Math.floor(c[2] - ext); z <= Math.ceil(c[2] + ext); z++) {
        const p = [x - c[0], y - c[1], z - c[2]];
        const a = dot(p, ax);
        if (Math.abs(a) > hl) continue;
        const rad = Math.hypot(p[0] - ax[0] * a, p[1] - ax[1] * a, p[2] - ax[2] * a);
        if (rad >= R - 0.8 && rad <= R + 0.5) put(x, y, z, id);
      }
  const u = norm(cross(ax, Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
  const v = cross(ax, u);
  for (let i = 0; i < nS; i++) {
    const ang = 2 * Math.PI * i / nS + (phase || 0);
    const d = [u[0] * Math.cos(ang) + v[0] * Math.sin(ang), u[1] * Math.cos(ang) + v[1] * Math.sin(ang), u[2] * Math.cos(ang) + v[2] * Math.sin(ang)];
    if (skip && skip(d)) continue;
    tube([[c[0] + d[0] * R, c[1] + d[1] * R, c[2] + d[2] * R], [c[0] + d[0] * (R + sl), c[1] + d[1] * (R + sl), c[2] + d[2] * (R + sl)]], 0.9, 0.4, sid);
  }
}
function frontZ(x, y) {
  for (let z = -16; z <= 8; z++) { const id = get(x, y, z); if (id != null && id !== FIRE) return z; }
  return null;
}
function paint(x, y, id) { const z = frontZ(x, y); if (z != null) put(x, y, z, id); }

const SK = YELLOW;

// ---------- LEGS + FEET ----------
for (const s of [-1, 1]) {
  ell(s * 4.8, 5.5, 1.5, 3.1, 3.6, 3.6, SK);
  ell(s * 5, 2, -1.5, 2.9, 1.7, 4, SK);
}
for (const s of [-1, 1]) {
  for (const dx of [-2, 0, 2]) {
    const x = s * 5 + dx;
    const z2 = frontZ(x, 2);
    if (z2 != null) { put(x, 2, z2 - 1, WHITE); put(x, 1, z2 - 1, WHITE); put(x, 1, z2 - 2, WHITE); }
  }
}

// ---------- TAIL ----------
tube([[0, 6, 5], [0, 4, 10], [1.5, 2.5, 14], [4, 2, 17], [7, 2.5, 18.5]], 2.6, 0.6, SK);
tube([[0, 6, 10], [0, 8, 11]], 0.9, 0.4, WHITE);
tube([[1.5, 4, 14], [1.5, 5.6, 15]], 0.9, 0.4, WHITE);
tube([[4, 3, 17], [4, 4.4, 17.8]], 0.8, 0.4, WHITE);

// ---------- TORSO with segmented belly ----------
ell(0, 10.5, 1.5, 6.5, 7, 5.5, (x, y, z, dx, dy, dz) => {
  if (dz < -0.45 && Math.abs(dx) < 0.7 && dy < 0.85) return (y % 3 === 0) ? ORANGE : SAND;
  return SK;
});

// ---------- SHELL ----------
const SC = [0, 11, 5.2], SR = [7.8, 8.6, 5.2];
ell(SC[0], SC[1], SC[2], SR[0], SR[1], SR[2], (x, y, z) => {
  if (z < 4) return null;
  if (z === 4) return WHITE;
  return GREEN;
});

// ---------- SPIKED COLLAR ----------
cuff([0, 16.8, 1], [0, 1, 0], 4.9, 1.0, BLACK, 8, IRON, 1.8, Math.PI / 8, d => d[2] < -0.6);

// ---------- ARMS ----------
// raised arm (east)
tube([[6, 14.5, 0.5], [9.8, 13.5, -1.5], [10.5, 17.5, -4]], 2.3, 1.7, SK);
ball(10.5, 19, -4.5, 1.9, SK);
for (const dx of [-1, 0, 1]) tube([[10.5 + dx, 20.3, -5], [10.5 + dx * 1.4, 22.4, -5.7]], 0.7, 0.5, WHITE);
tube([[9, 18.5, -5.6], [8.2, 19.8, -6.7]], 0.7, 0.5, WHITE);
cuff([10.3, 16.2, -3.4], [0.7, 4, -2.5], 2.2, 0.7, BLACK, 4, IRON, 1.6, Math.PI / 4);
// lowered arm (west), claws forward
tube([[-6, 14.5, 0.5], [-9.8, 11.5, -1], [-9.8, 10, -5]], 2.3, 1.7, SK);
ball(-9.8, 9.6, -6.8, 1.9, SK);
for (const dx of [-1, 0, 1]) tube([[-9.8 + dx, 9.2, -8.4], [-9.8 + dx * 1.3, 8.2, -9.9]], 0.7, 0.5, WHITE);
tube([[-8.2, 10.6, -7.8], [-7.4, 11.4, -9]], 0.7, 0.5, WHITE);
cuff([-9.8, 10.4, -4], [0, -1.5, -4], 2.2, 0.7, BLACK, 4, IRON, 1.6, Math.PI / 4);

// ---------- HEAD ----------
ell(0, 22, -1.5, 4.8, 4.3, 4.5, SK);                       // cranium
ell(0, 25, 0.5, 4.4, 2.3, 4.2, (x, y, z) => z > -3 ? (H(x, y, z) < 0.3 ? RED : ORANGE) : null); // hair cap
ell(0, 20, -6, 3.8, 2.3, 3.8, SAND);                       // snout
ell(0, 21, -8.5, 2.6, 1.6, 1.6, SAND);                     // nose bump
ell(0, 16.5, -5, 3.8, 1.6, 3.8, SAND);                     // lower jaw

// open mouth
const cav = new Set();
for (let x = -4; x <= 4; x++) for (let y = 16; y <= 19; y++) for (let z = -11; z <= -3; z++) {
  const dx = x / 3.1, dy = (y - 17.5) / 1.2, dz = (z + 6.8) / 3.4;
  if (dx * dx + dy * dy + dz * dz <= 1) { del(x, y, z); cav.add(key(x, y, z)); }
}
for (const k of cav) {
  const [x, y, z] = k.split(',').map(Number);
  for (const [a, b, c] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1]]) {
    const nx = x + a, ny = y + b, nz = z + c;
    if (cav.has(key(nx, ny, nz))) continue;
    if (get(nx, ny, nz) != null) put(nx, ny, nz, c === 1 ? BLACK : RED);
  }
}
put(0, 17, -3, LAVA); put(0, 18, -3, LAVA);
// teeth
for (const x of [-2, 2]) { const z = frontZ(x, 19); if (z != null) { put(x, 18, z, WHITE); put(x, 17, z, WHITE); } }
{ const z = frontZ(0, 19); if (z != null) put(0, 18, z, WHITE); }
for (const x of [-3, 3]) { const z = frontZ(x, 16); if (z != null) put(x, 17, z, WHITE); }

// eyes, brows, nostrils
for (const s of [-1, 1]) {
  paint(s * 2, 23, NEON_RED); paint(s * 2, 22, NEON_RED);
  paint(s * 3, 23, WHITE); paint(s * 3, 22, WHITE);
  for (const [bx, by] of [[1, 24], [2, 24], [3, 25], [4, 25]]) {
    const z = frontZ(s * bx, by);
    if (z != null) put(s * bx, by, z - 1, RED);
  }
  paint(s * 1, 21, BLACK);
}

// horns
for (const s of [-1, 1]) {
  tube([[s * 3.3, 24.2, -2], [s * 5, 26.2, -1.8], [s * 6, 28.3, -1.2], [s * 6.2, 30.4, -0.3]], 1.3, 0.45, WHITE);
}

// hair tufts sweeping back + mane over shell
for (let i = -2; i <= 2; i++) {
  tube([[i * 1.5, 26, 0.5], [i * 2.2, 28.5, 3], [i * 2.8, 29 - Math.abs(i) * 0.8, 6.5]], 1.4, 0.5, (i & 1) ? RED : ORANGE);
}
for (const s of [-1, 1]) tube([[s * 2.5, 24, 3], [s * 3.2, 21, 6], [s * 3, 18.5, 8.5]], 1.5, 0.6, ORANGE);
tube([[0, 24, 3.5], [0, 21, 7], [0, 18, 9.5]], 1.5, 0.6, RED);

// ---------- SHELL SPIKES ----------
const spk = [[-30, -50], [-30, 0], [-30, 50], [5, -70], [5, -25], [5, 25], [5, 70], [40, -45], [40, 0], [40, 45],
  [-5, -100], [-5, 100], [30, -95], [30, 95], [55, -60], [55, 60]];
for (const [e, a] of spk) {
  const E = e * Math.PI / 180, A = a * Math.PI / 180;
  const px = SC[0] + SR[0] * Math.cos(E) * Math.sin(A);
  const py = SC[1] + SR[1] * Math.sin(E);
  const pz = SC[2] + SR[2] * Math.cos(E) * Math.cos(A);
  const n = norm([(px - SC[0]) / (SR[0] * SR[0]), (py - SC[1]) / (SR[1] * SR[1]), (pz - SC[2]) / (SR[2] * SR[2])]);
  ball(px, py, pz, 1.5, SAND);
  tube([[px, py, pz], [px + n[0] * 3.4, py + n[1] * 3.4, pz + n[2] * 3.4]], 1.2, 0.4, WHITE);
}

// ---------- FIRE BRAZIERS ----------
for (const s of [-1, 1]) {
  const px = s * 13, pz = -8;
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) put(px + dx, 0, pz + dz, OBSIDIAN);
  for (let y = -1; y <= 7; y++) put(px, y, pz, y % 3 === 0 ? OBSIDIAN : STONE);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) put(px + dx, 8, pz + dz, (dx || dz) ? IRON : LAVA);
  put(px, 9, pz, FIRE); put(px, 10, pz, FIRE);
}

// ---------- FIRE BREATH ----------
const f0 = [0, 17.5, -11], f1 = [1, 13, -21];
for (let t = 0; t <= 11; t++) {
  const g = t / 11;
  const x = f0[0] + (f1[0] - f0[0]) * g, y = f0[1] + (f1[1] - f0[1]) * g, z = f0[2] + (f1[2] - f0[2]) * g;
  const cells = [[x, y, z]];
  if (t > 4 && t % 2 === 0) cells.push([x - 1, y, z], [x + 1, y - (H(t, 2, 3) < 0.5 ? 1 : 0), z]);
  for (const c of cells) {
    if (get(Math.round(c[0]), Math.round(c[1]), Math.round(c[2])) == null) put(c[0], c[1], c[2], FIRE);
  }
}

// ---------- CULL HIDDEN INTERIOR ----------
const solid = id => id != null && id !== FIRE && id !== AIR;
const out = [];
for (const v of M.values()) {
  const [x, y, z, id] = v;
  if (id === FIRE) { out.push(v); continue; }
  if (solid(get(x + 1, y, z)) && solid(get(x - 1, y, z)) && solid(get(x, y + 1, z)) &&
      solid(get(x, y - 1, z)) && solid(get(x, y, z + 1)) && solid(get(x, y, z - 1))) continue;
  out.push(v);
}
const bodyCount = out.filter(v => v[3] !== FIRE).length;

// ---------- PLATFORM (sized to fit budget) ----------
const under = new Set();
for (const v of out) if (v[1] === 1 && v[3] !== FIRE) under.add(v[0] + ',' + v[2]);
const cracks = [-2.3, -1.75, -1.05, -0.35, 2.6, 1.3];
function plat(r) {
  const cells = [];
  for (let x = -Math.ceil(r); x <= Math.ceil(r); x++)
    for (let z = 1 - Math.ceil(r); z <= 1 + Math.ceil(r); z++) {
      const d = Math.hypot(x, z - 1);
      if (d > r) continue;
      let id;
      if (d > r - 1.2) id = OBSIDIAN;
      else {
        const ang = Math.atan2(z - 1, x);
        let lava = false;
        for (const ca of cracks) {
          let df = Math.abs(ang - ca); if (df > Math.PI) df = 2 * Math.PI - df;
          const wig = (H(x, 7, z) - 0.5) * 0.5;
          if (df * d < 0.55 + wig && d > r - 5.5 && d < r - 1.2) lava = true;
        }
        const h = H(x, 0, z);
        id = lava ? LAVA : (h < 0.5 ? COBBLE : h < 0.85 ? STONE : GRAY);
      }
      if (!under.has(x + ',' + z)) cells.push([x, 0, z, id]);
      if (d > r - 1.2) cells.push([x, -1, z, OBSIDIAN]);
    }
  return cells;
}
let platform = [];
for (let r = 13; r >= 5; r -= 0.5) {
  const p = plat(r);
  if (bodyCount + p.length <= 3990) { platform = p; break; }
}

// ---------- CLEAR TREES AROUND THE SITE ----------
for (let x = -15; x <= 15; x++)
  for (let z = -16; z <= 12; z++)
    for (let y = 1; y <= 7; y++)
      if (!M.has(key(x, y, z))) block(x, y, z, AIR);

// ---------- EMIT ----------
for (const [x, y, z, id] of platform) block(x, y, z, id);
const solids = out.filter(v => v[3] !== FIRE).sort((a, b) => a[1] - b[1]);
let n = 0;
for (const [x, y, z, id] of solids) { if (n >= 3995 - platform.length) break; block(x, y, z, id); n++; }
for (const [x, y, z, id] of out) if (id === FIRE) block(x, y, z, id);