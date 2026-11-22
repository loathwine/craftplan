// frost-phoenix-fable — prompt:
// a frost phoenix...

const M = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
function rnd(x, y, z) { const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return n - Math.floor(n); }
function ell(cx, cy, cz, rx, ry, rz, fn) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
        if (d <= 1) put(x, y, z, typeof fn === 'function' ? fn(x, y, z) : fn);
      }
}
function ln(x0, y0, z0, x1, y1, z1, fn) {
  const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0))) || 1;
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    put(x0 + (x1 - x0) * s, y0 + (y1 - y0) * s, z0 + (z1 - z0) * s, typeof fn === 'function' ? fn(s) : fn);
  }
}
function bez(P, s) {
  const a = (1 - s) ** 3, b = 3 * (1 - s) ** 2 * s, c = 3 * (1 - s) * s * s, d = s ** 3;
  return [0, 1, 2].map(i => a * P[0][i] + b * P[1][i] + c * P[2][i] + d * P[3][i]);
}
// tapered ice crystal: octagonal cross-section, dark blue root -> pale tip
function crystal(x0, y0, z0, x1, y1, z1, r0, r1, hollow) {
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0, n = Math.ceil(Math.hypot(dx, dy, dz) * 2);
  for (let i = 0; i <= n; i++) {
    const s = i / n, r = r0 + (r1 - r0) * s;
    const cx = Math.round(x0 + dx * s), cy = Math.round(y0 + dy * s), cz = Math.round(z0 + dz * s), R = Math.ceil(r);
    for (let a = -R; a <= R; a++) for (let b = -R; b <= R; b++) {
      const A = Math.abs(a), B = Math.abs(b);
      if (Math.max(A, B) > r || A + B > r * 1.4) continue;
      if (hollow && s > 0.08 && s < 0.9 && Math.max(A, B) < r - 1 && A + B < r * 1.4 - 1.5) continue;
      const q = rnd(cx + a, cy, cz + b);
      let col;
      if (s > 0.86) col = WHITE;
      else if (q < 0.1) col = ICE;
      else { const v = s + (q - 0.5) * 0.4; col = v < 0.28 ? BLUE : v < 0.6 ? CYAN : LIGHT_BLUE; }
      put(cx + a, cy, cz + b, col);
    }
  }
}

// ---------- scattered ice shards (short in front, taller behind) ----------
const shards = [
  [-10, -9, -1, -1, 4], [9, -11, 1, -1, 3], [-13, 2, -2, 0, 6], [13, -3, 2, 0, 5],
  [-8, 12, -1, 2, 7], [9, 13, 1, 1, 8], [4, -13, 0, -1, 3], [-4, -12, -1, -1, 2],
  [14, 9, 2, 1, 6], [-14, 9, -2, 1, 5], [-11, -3, -1, 0, 3], [11, 4, 1, 0, 4]
];
for (const [x, z, tx, tz, h] of shards) {
  crystal(x, -1, z, x + tx, h, z + tz, 1.4, 0.3, false);
  crystal(x + (tx >= 0 ? -1 : 1), -1, z + 1, x + (tx >= 0 ? -2 : 2), h * 0.5, z + 2, 1, 0.3, false);
}

// ---------- ice spire perch ----------
crystal(0, -1, 1, 0, 11, 1, 3.7, 2.2, true);
crystal(-3, -1, -1, -7, 8, -3, 2.1, 0.4, false);
crystal(3, -1, 0, 8, 6, -2, 2.0, 0.4, false);
crystal(2, -1, 4, 5, 9, 6, 2.0, 0.4, false);
crystal(-3, -1, 4, -6, 7, 7, 1.9, 0.4, false);
crystal(0, -1, -3, 1, 5, -6, 1.7, 0.4, false);
crystal(-1, 3, 2, -4, 10, 3, 1.5, 0.4, false);
crystal(2, 4, 0, 4, 9, -1, 1.3, 0.4, false);
// snow cap on the perch
for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) if (Math.abs(a) + Math.abs(b) <= 3) put(a, 11, 1 + b, SNOW);

// ---------- tail: long streaming plumes with glowing eye-spots ----------
function tailFeather(P, spot, side) {
  const N = 90;
  for (let i = 0; i <= N; i++) {
    const s = i / N, p = bez(P, s);
    const x = Math.round(p[0]), y = Math.round(p[1]), z = Math.round(p[2]);
    const col = s < 0.33 ? LIGHT_BLUE : s < 0.68 ? CYAN : BLUE;
    put(x + side, y, z, col);
    put(x, y - 1, z, col);
    if (s > 0.45) put(x - side, y, z, s > 0.8 ? CYAN : LIGHT_BLUE);
    put(x, y, z, WHITE);
    if (i % 9 === 4 && s > 0.2 && s < 0.9) { put(x + side * 2, y - 1, z, ICE); put(x - side, y + 1, z, ICE); }
  }
  const sx = spot[0], sy = spot[1], sz = spot[2];
  for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
    const d = Math.hypot(dx, dy);
    if (d > 2.3) continue;
    const col = d < 0.5 ? NEON_BLUE : d < 1.5 ? WHITE : d < 2.1 ? CYAN : BLUE;
    put(sx + dx, sy + dy, sz, col);
    if (d < 1.5) put(sx + dx, sy + dy, sz + 1, BLUE);
  }
  put(sx, sy - 3, sz, BLUE); put(sx, sy - 4, sz, ICE);
}
for (const sd of [-1, 1]) {
  tailFeather([[sd, 13, 4], [sd * 2, 10, 8], [sd * 7, 9, 10], [sd * 6, 5, 9]], [sd * 6, 4, 9], sd);
  tailFeather([[sd, 13, 4], [sd * 4, 11, 7], [sd * 12, 12, 8], [sd * 11, 8, 7]], [sd * 11, 6, 7], sd);
  tailFeather([[sd, 13, 4], [sd * 5, 12, 6], [sd * 16, 14, 6], [sd * 15, 10, 5]], [sd * 15, 8, 5], sd);
}
tailFeather([[0, 13, 4], [0, 13, 9], [0, 9, 14], [0, 6, 17]], [0, 5, 18], 1);
// tail coverts
ell(0, 14.5, 4, 2.6, 2.4, 2.2, (x, y, z) => rnd(x, y, z) < 0.3 ? LIGHT_BLUE : CYAN);

// ---------- body ----------
ell(0, 13, 1, 2, 1.2, 2, LIGHT_BLUE);
ell(0, 18, 1, 3.6, 5.2, 3.6, (x, y, z) => {
  if (z <= -1) {
    if (y >= 16) return (y % 2 === 0 && ((x + y / 2) & 1)) ? LIGHT_BLUE : WHITE;
    return y >= 14 ? LIGHT_BLUE : CYAN;
  }
  const q = rnd(x, y, z);
  if (y < 15) return CYAN;
  return q < 0.22 ? CYAN : q > 0.9 ? WHITE : LIGHT_BLUE;
});
// thigh fluff
for (const sd of [-1, 1]) ell(sd * 2, 14.5, 0, 1.6, 1.8, 1.6, (x, y, z) => y < 14 ? LIGHT_BLUE : WHITE);
// frozen heart on the chest
put(0, 19, -3, NEON_BLUE); put(0, 20, -3, ICE); put(0, 18, -3, ICE); put(-1, 19, -3, ICE); put(1, 19, -3, ICE);
put(-1, 20, -2, CYAN); put(1, 20, -2, CYAN); put(-1, 18, -2, CYAN); put(1, 18, -2, CYAN);

// ---------- wings: raised V, fanned feathers, white coverts -> deep blue tips ----------
function wing(side) {
  const NF = 13, STEPS = 300;
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const bx = 3 + 13 * t, by = 21 + 9 * Math.sin(t * Math.PI / 2);
    const fk = Math.min(NF - 1, Math.floor(t * NF)), fr = t * NF - fk, tc = (fk + 0.5) / NF;
    const phi = (-100 + 140 * t) * Math.PI / 180;
    const L = (4.5 + 7.5 * Math.sin(Math.PI * Math.pow(tc, 0.85))) * (1 - 0.22 * Math.abs(fr - 0.5) * 2);
    const zb = 2 - 4 * t * t;
    for (let s = 0; s <= L; s += 0.5) {
      const u = s / L;
      const x = Math.round(bx + Math.cos(phi) * s), y = Math.round(by + Math.sin(phi) * s);
      const z = Math.round(zb - 1.2 * u * u);
      const band = u + (fk % 2 ? 0.07 : 0);
      let col = band < 0.3 ? WHITE : band < 0.52 ? LIGHT_BLUE : band < 0.78 ? CYAN : BLUE;
      if (fr < 0.18 && u > 0.32) col = (col === LIGHT_BLUE) ? CYAN : BLUE;
      if (u > 0.9 && Math.abs(fr - 0.5) < 0.22) col = (fk % 3 === 1) ? NEON_BLUE : ICE;
      put(side * x, y, z, col);
      if (u < 0.34) {
        put(side * x, y, z - 1, rnd(x, y, z) < 0.25 ? SNOW : WHITE);
        put(side * x, y, z + 1, LIGHT_BLUE);
      }
      if (s === 0) { put(side * x, y + 1, z, MARBLE); put(side * x, y + 1, z - 1, MARBLE); }
    }
  }
}
wing(1); wing(-1);

// ---------- neck (S-curve) ----------
const NP = [[0, 22, 0.5], [0, 25, 2.6], [0, 27, 1.2], [0, 28, -1.5]];
for (let i = 0; i <= 14; i++) {
  const p = bez(NP, i / 14), r = 1.9 - 0.4 * (i / 14);
  ell(p[0], p[1], p[2], r, r, r, (x, y, z) => z <= p[2] - 0.3 ? WHITE : (rnd(x, y, z) < 0.3 ? CYAN : LIGHT_BLUE));
}
// feather ruff at the neck base
for (let a = 0; a < 16; a++) {
  const an = a / 16 * Math.PI * 2, ca = Math.cos(an), sa = Math.sin(an);
  put(ca * 3, 22, 0.5 + sa * 3, CYAN);
  if (a % 2 === 0) { put(ca * 3.6, 21, 0.5 + sa * 3.6, BLUE); put(ca * 2.6, 23, 0.5 + sa * 2.6, LIGHT_BLUE); }
}

// ---------- head ----------
ell(0, 28.5, -2, 2.5, 2.3, 2.7, (x, y, z) => (y >= 30 || z >= 0) ? LIGHT_BLUE : WHITE);
put(-1, 29, -4, NEON_BLUE); put(1, 29, -4, NEON_BLUE);
put(-2, 29, -3, BLUE); put(2, 29, -3, BLUE); put(-2, 30, -3, BLUE); put(2, 30, -3, BLUE);
put(-1, 30, -4, BLUE); put(1, 30, -4, BLUE);
// hooked beak
put(-1, 28, -5, GOLD); put(0, 28, -5, GOLD); put(1, 28, -5, GOLD); put(0, 27, -5, GOLD);
put(0, 28, -6, GOLD); put(0, 27, -6, GOLD); put(0, 27, -7, GOLD); put(0, 26, -7, GOLD);
// crest plumes swept back
function plume(x0, y0, z0, x1, y1, z1) {
  ln(x0, y0, z0, x1, y1, z1, s => s < 0.4 ? LIGHT_BLUE : s < 0.85 ? CYAN : NEON_BLUE);
}
plume(0, 31, -2, 0, 33, 3);
for (const sd of [-1, 1]) {
  plume(sd, 31, -1, sd * 3, 33, 2);
  plume(sd * 2, 30, 0, sd * 5, 32, 4);
  plume(sd * 2, 29, 0, sd * 4, 30, 4);
}

// ---------- legs + talons gripping the spire ----------
for (const sd of [-1, 1]) {
  put(sd * 2, 13, 0, GOLD); put(sd * 2, 12, 0, GOLD); put(sd * 2, 12, -1, GOLD);
  put(sd, 12, -1, GOLD); put(sd * 3, 12, 0, GOLD);
  put(sd * 2, 11, -1, GOLD); put(sd, 11, -2, GOLD); put(sd * 3, 11, 0, GOLD);
  put(sd * 2, 10, -1, OBSIDIAN); put(sd, 10, -2, OBSIDIAN);
}

// ---------- cold mist + frost breath (sparse) ----------
const mist = [[-5, 1, -4], [5, 1, -3], [-6, 1, 6], [6, 1, 7], [0, 1, -8], [-9, 1, 0], [9, 1, 1], [0, 26, -9]];
for (const m of mist) if (!M.has(m[0] + ',' + m[1] + ',' + m[2])) put(m[0], m[1], m[2], STEAM);

// ---------- frozen ground: snow field with a giant frost snowflake (budget-aware) ----------
const flake = new Map();
function fl(x0, z0, x1, z1, id) {
  const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(z1 - z0))) || 1;
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    flake.set(Math.round(x0 + (x1 - x0) * s) + ',' + Math.round(z0 + (z1 - z0) * s), id);
  }
}
for (let k = 0; k < 6; k++) {
  const a = (k * 60 + 30) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  for (const br of [[8, 3], [11, 2.2]]) for (const sg of [-1, 1]) {
    const b = a + sg * Math.PI / 3;
    fl(ca * br[0], sa * br[0], ca * br[0] + Math.cos(b) * br[1], sa * br[0] + Math.sin(b) * br[1], LIGHT_BLUE);
  }
  fl(ca * 5, sa * 5, ca * 13, sa * 13, CYAN);
}
const G = [];
for (let x = -17; x <= 17; x++) for (let z = -17; z <= 17; z++) {
  const d = Math.hypot(x, z);
  if (d > 16.5) continue;
  if (d <= 9 || flake.has(x + ',' + z) || rnd(x, 0, z) > (d - 9) / 7.5) G.push([d, x, z]);
}
G.sort((p, q) => p[0] - q[0]);
const BUDGET = 3900;
for (const g of G) {
  if (M.size >= BUDGET) break;
  if (M.has(g[1] + ',0,' + g[2])) continue;
  put(g[1], 0, g[2], flake.get(g[1] + ',' + g[2]) || SNOW);
}

// ---------- emit solids ----------
for (const v of M.values()) block(v[0], v[1], v[2], v[3]);

// ---------- clear trees around the phoenix (AIR only where nothing was built) ----------
for (let x = -17; x <= 17; x++) for (let z = -17; z <= 17; z++) {
  if (x * x + z * z > 17 * 17) continue;
  for (let y = 1; y <= 10; y++) if (!M.has(x + ',' + y + ',' + z)) block(x, y, z, AIR);
}