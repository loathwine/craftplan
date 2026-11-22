// aurora-cabin-opus — prompt:
// a log cabin under the northern lights...

// ---------- helpers: collect everything first, then place within budget ----------
const MAXB = 3990;
const M = new Map(), A = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function inb(x, y, z) { return x >= -22 && x <= 22 && z >= -22 && z <= 22 && y >= -8 && y <= 33; }
function P(x, y, z, id) { x = Math.round(x); y = Math.round(y); z = Math.round(z); if (!inb(x, y, z)) return; M.set(K(x, y, z), [x, y, z, id]); }
function B(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) P(x, y, z, id);
}
function L(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) { const t = i / n; P(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id); }
}
function H(a, b, c) { const s = Math.sin(a * 127.1 + b * 311.7 + (c || 0) * 74.7) * 43758.5453; return s - Math.floor(s); }
function SP(cx, cy, cz, r, id) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++)
    if (dx * dx + dy * dy + dz * dz <= r * r + 0.3) P(cx + dx, cy + dy, cz + dz, id);
}

// ---------- clear the old oak trees out of the yard (AIR is free) ----------
cube(-14, 0, -17, 14, 10, 14, AIR);

// ---------- snowy ground ----------
for (let x = -13; x <= 13; x++) for (let z = -16; z <= 12; z++) {
  const e = (x / 13) * (x / 13) + ((z + 2) / 14) * ((z + 2) / 14);
  if (e > 1) continue;
  if (x >= -7 && x <= 7 && z >= -10 && z <= 9) continue;
  P(x, -1, z, SNOW);
}

// ---------- LOG CABIN ----------
const X0 = -6, X1 = 6, Z0 = -4, Z1 = 8;
// stone footing
for (let y = -1; y <= 0; y++) {
  for (let x = X0; x <= X1; x++) { P(x, y, Z0, COBBLE); P(x, y, Z1, COBBLE); }
  for (let z = Z0; z <= Z1; z++) { P(X0, y, z, COBBLE); P(X1, y, z, COBBLE); }
}
// log courses with crossed corner ends
for (let y = 1; y <= 6; y++) {
  const id = (y % 2) ? OAK_LOG : BROWN;
  for (let x = X0; x <= X1; x++) { P(x, y, Z0, id); P(x, y, Z1, id); }
  for (let z = Z0; z <= Z1; z++) { P(X0, y, z, id); P(X1, y, z, id); }
  if (y % 2) { P(X0 - 1, y, Z0, OAK_LOG); P(X1 + 1, y, Z0, OAK_LOG); P(X0 - 1, y, Z1, OAK_LOG); P(X1 + 1, y, Z1, OAK_LOG); }
  else { P(X0, y, Z0 - 1, OAK_LOG); P(X1, y, Z0 - 1, OAK_LOG); P(X0, y, Z1 + 1, OAK_LOG); P(X1, y, Z1 + 1, OAK_LOG); }
}
// top plates
for (let z = Z0; z <= Z1; z++) { P(X0, 7, z, OAK_LOG); P(X1, 7, z, OAK_LOG); }
// gables (front faces north)
const roofY = dx => 14 - Math.abs(dx);
for (const z of [Z0, Z1]) {
  for (let dx = -5; dx <= 5; dx++)
    for (let y = 7; y <= roofY(dx) - 1; y++)
      P(dx, y, z, y === 7 ? OAK_LOG : ((dx & 1) ? PLANKS : BROWN));
}
// front gable window, glowing attic
B(-2, 8, Z0, 2, 11, Z0, WHITE);
B(-1, 9, Z0, 1, 10, Z0, GLASS);
P(0, 9, Z0 + 1, GLOWSTONE);
// roof: shingles + snow, porch overhang to z=-9
for (let dx = -8; dx <= 8; dx++) {
  const ry = roofY(dx);
  for (let z = -9; z <= 11; z++) {
    P(dx, ry, z, BROWN);
    P(dx, ry + 1, z, SNOW);
  }
  P(dx, ry - 1, -9, OAK_LOG);   // front barge board
  P(dx, ry - 1, 11, OAK_LOG);   // rear barge board
}
// icicles along both eaves
for (let z = -9; z <= 11; z++) for (const s of [-1, 1]) {
  const h = H(z, s, 3);
  if (h < 0.45) P(8 * s, 5, z, ICE);
  if (h < 0.18) P(8 * s, 4, z, ICE);
}
// front door, red, with casing
B(0, 1, Z0, 0, 3, Z0, RED);
B(-1, 1, Z0, -1, 3, Z0, PLANKS); B(1, 1, Z0, 1, 3, Z0, PLANKS);
B(-1, 4, Z0, 1, 4, Z0, PLANKS);
// wreath over door
for (const [dx, dy] of [[-1, 5], [1, 5], [-1, 6], [1, 6], [-1, 7], [0, 7], [1, 7]]) P(dx, dy, Z0 - 1, GREEN);
P(0, 5, Z0 - 1, RED);
// front windows with red shutters + white trim, warm glow inside
for (const s of [-1, 1]) {
  const a = 3 * s, b = 4 * s;
  B(a, 2, Z0, b, 4, Z0, GLASS);
  B(2 * s, 2, Z0 - 1, 2 * s, 4, Z0 - 1, RED);
  B(5 * s, 2, Z0 - 1, 5 * s, 4, Z0 - 1, RED);
  B(a, 1, Z0 - 1, b, 1, Z0 - 1, WHITE);
  B(2 * s, 5, Z0 - 1, 5 * s, 5, Z0 - 1, WHITE);
  P(3 * s, 3, Z0 + 2, GLOWSTONE);
}
// side windows
for (const s of [-1, 1]) {
  const xw = 6 * s;
  B(xw, 2, -1, xw, 4, 0, GLASS);
  B(7 * s, 2, -2, 7 * s, 4, -2, RED);
  B(7 * s, 2, 1, 7 * s, 4, 1, RED);
  B(7 * s, 1, -1, 7 * s, 1, 0, WHITE);
}
P(4, 3, 0, GLOWSTONE);

// porch
B(-6, 0, -9, 6, 0, -5, PLANKS);
for (const s of [-1, 1]) {
  B(6 * s, 1, -9, 6 * s, 7, -9, OAK_LOG);
  P(5 * s, 6, -9, OAK_LOG);                    // knee brace
  for (const x of [2 * s, 4 * s]) P(x, 1, -9, BROWN);
  B(2 * s, 2, -9, 6 * s, 2, -9, BROWN);        // front rail
  P(6 * s, 1, -7, BROWN);
  B(6 * s, 2, -8, 6 * s, 2, -5, BROWN);        // side rail
}
B(-5, 7, -9, 5, 7, -9, OAK_LOG);               // tie beam
B(0, 8, -9, 0, 13, -9, OAK_LOG);               // king post
L(-1, 8, -9, -3, 10, -9, OAK_LOG);
L(1, 8, -9, 3, 10, -9, OAK_LOG);
P(0, 6, -9, IRON); P(0, 5, -9, GLOWSTONE);     // hanging lantern
// rocking chair + barrel
P(-4, 1, -7, BROWN); B(-4, 2, -6, -4, 3, -6, BROWN); P(-5, 1, -7, BROWN);
B(4, 1, -6, 4, 2, -6, OAK_LOG); P(4, 3, -6, PLANKS);

// stone chimney on the east side, smoke on top
B(7, 0, 2, 9, 2, 5, COBBLE);
for (let y = 3; y <= 13; y++) for (let x = 7; x <= 8; x++) for (let z = 3; z <= 4; z++)
  P(x, y, z, H(x + y, z, 5) < 0.35 ? STONE : COBBLE);
B(6, 14, 2, 9, 14, 5, STONE);
B(7, 14, 3, 8, 14, 4, OBSIDIAN);
P(7, 15, 3, STEAM); P(8, 15, 4, STEAM);
P(6, 15, 2, SNOW); P(9, 15, 5, SNOW); P(9, 15, 2, SNOW);

// woodpile under the west eave
for (let x = -9; x <= -8; x++) for (let z = 3; z <= 7; z++) for (let y = 0; y <= 3; y++)
  P(x, y, z, H(x, y, z) < 0.3 ? PLANKS : OAK_LOG);
for (let z = 3; z <= 7; z++) P(-9, 4, z, SNOW);
// chopping stump with axe
P(-9, 0, -5, OAK_LOG); P(-9, 1, -5, IRON); P(-9, 2, -6, BROWN); P(-9, 3, -6, BROWN);

// stone-stepped path + lamp post
P(0, -1, -11, LIGHT_GRAY); P(-1, -1, -13, LIGHT_GRAY); P(0, -1, -15, LIGHT_GRAY); P(1, -1, -12, GRAY);
B(2, 0, -12, 2, 3, -12, BLACK); P(2, 4, -12, GLOWSTONE); P(2, 5, -12, BLACK); P(2, 6, -12, SNOW);

// campfire with log benches (front-west)
{
  const cx = -8, cz = -13;
  for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
    const m = Math.max(Math.abs(dx), Math.abs(dz));
    if (m === 2 && !(Math.abs(dx) === 2 && Math.abs(dz) === 2)) P(cx + dx, 0, cz + dz, H(dx, dz, 9) < 0.5 ? COBBLE : STONE);
  }
  P(cx, 0, cz, OAK_LOG); P(cx + 1, 0, cz, OAK_LOG); P(cx - 1, 0, cz, OAK_LOG); P(cx, 0, cz + 1, OAK_LOG); P(cx, 0, cz - 1, OAK_LOG);
  P(cx + 1, 0, cz + 1, LAVA);
  P(cx, 1, cz, FIRE); P(cx + 1, 1, cz, FIRE);
  B(cx - 2, 0, cz - 4, cx + 2, 0, cz - 4, OAK_LOG);
  B(cx - 4, 0, cz - 2, cx - 4, 0, cz + 2, OAK_LOG);
}

// frozen pond (front-east)
for (let x = 6; x <= 14; x++) for (let z = -17; z <= -11; z++) {
  const e = ((x - 10) / 3.4) ** 2 + ((z + 14) / 2.4) ** 2;
  if (e <= 1) P(x, -1, z, ICE);
}

// snowman
{
  const sx = 11, sz = -7;
  SP(sx, 1, sz, 2, SNOW);
  SP(sx, 4, sz, 1.5, SNOW);
  SP(sx, 7, sz, 1.45, SNOW);
  for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) P(sx + dx, 5, sz + dz, RED);
  P(sx - 1, 7, sz - 1, BLACK); P(sx + 1, 7, sz - 1, BLACK);
  P(sx, 7, sz - 2, ORANGE);
  P(sx, 4, sz - 1, BLACK); P(sx, 1, sz - 2, BLACK);
  B(sx - 1, 9, sz - 1, sx + 1, 9, sz + 1, BLACK);
  for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) P(sx + dx, 10, sz + dz, BLACK);
  P(sx, 11, sz, BLACK);
  L(sx + 2, 4, sz, sx + 4, 6, sz, BROWN);
  L(sx - 2, 4, sz, sx - 4, 6, sz, BROWN);
}

// ---------- snowy spruces ----------
function spruce(x, z, base, h, R) {
  for (let y = base; y < base + h - 3; y++) P(x, y, z, OAK_LOG);
  const f0 = base + 2, top = base + h, n = top - f0;
  const rad = y => {
    if (y >= top) return 0.4;
    const t = (y - f0) / n, ph = (y - f0) % 3;
    return Math.max(0.6, R * (1 - t) + 0.5 - ph * 0.6);
  };
  for (let y = f0; y <= top; y++) {
    const r = rad(y), rn = y < top ? rad(y + 1) : 0, ri = Math.ceil(r);
    for (let dx = -ri; dx <= ri; dx++) for (let dz = -ri; dz <= ri; dz++) {
      const d2 = dx * dx + dz * dz;
      if (d2 > r * r + 0.2) continue;
      if (r > 2 && d2 < (r - 1.4) * (r - 1.4)) continue;
      const exposed = d2 > rn * rn + 0.2;
      const hh = H(x + dx, y, z + dz);
      let id = hh < 0.12 ? LEAVES : GREEN;
      if (exposed && hh < 0.8) id = SNOW;
      P(x + dx, y, z + dz, id);
    }
  }
  P(x, top + 1, z, SNOW);
}
spruce(-18, -3, 0, 15, 3.6);
spruce(-16, 9, 0, 18, 4);
spruce(-4, 15, 0, 19, 3.8);
spruce(7, 15, 0, 17, 3.8);
spruce(17, 4, 0, 16, 3.8);
spruce(16, -12, 0, 12, 3);

// ---------- NORTHERN LIGHTS: folded curtains behind the cabin ----------
function ribbon(seed, zf, y0f, hf, pal) {
  for (let x = -22; x <= 22; x++) {
    if (H(x, seed, 1) < 0.08) continue;
    const za = Math.round(zf(x)), zb = Math.round(zf(x + 1));
    const y0 = Math.round(y0f(x));
    const hh = Math.max(3, Math.round(hf(x) + (H(x, seed, 2) - 0.5) * 4));
    for (let z = Math.min(za, zb); z <= Math.max(za, zb); z++) {
      for (let y = y0; y < y0 + hh && y <= 33; y++) {
        const t = (y - y0) / hh;
        if (t > 0.55 && H(x * 3 + z, y, seed) < (t - 0.55) * 1.7) continue;
        const k = K(x, y, z);
        if (M.has(k)) continue;
        A.set(k, [x, y, z, pal(t, H(x, y, z + seed * 7)), t + H(x, y, seed) * 0.3]);
      }
    }
  }
}
ribbon(11,
  x => 16 + 3 * Math.sin(x * 0.15 + 0.4) + 1.2 * Math.sin(x * 0.37 + 1.1),
  x => 18.5 + 2.5 * Math.sin(x * 0.13 + 0.8),
  x => 8 + 2 * Math.sin(x * 0.27),
  (t, r) => t < 0.13 ? (r < 0.22 ? NEON_BLUE : LIME)
    : t < 0.45 ? (r < 0.6 ? LIME : GREEN)
    : t < 0.7 ? (r < 0.55 ? GREEN : CYAN)
    : (r < 0.55 ? PURPLE : MAGENTA));
ribbon(23,
  x => 20.5 + 1.5 * Math.sin(x * 0.21 + 2.2),
  x => 27 + 1.5 * Math.sin(x * 0.1 + 2),
  x => 6 + 1.5 * Math.sin(x * 0.33 + 1),
  (t, r) => t < 0.15 ? (r < 0.15 ? NEON_BLUE : CYAN)
    : t < 0.5 ? (r < 0.5 ? LIME : CYAN)
    : t < 0.75 ? (r < 0.5 ? LIGHT_BLUE : PURPLE)
    : (r < 0.5 ? MAGENTA : PINK));

// ---------- flush: AIR first, then solids, then aurora up to budget ----------
let n = 0;
for (const v of M.values()) if (v[3] === AIR) block(v[0], v[1], v[2], AIR);
for (const v of M.values()) {
  if (v[3] === AIR) continue;
  if (n >= MAXB) break;
  block(v[0], v[1], v[2], v[3]); n++;
}
const sky = [...A.values()].sort((a, b) => a[4] - b[4]);
for (const a of sky) {
  if (n >= MAXB) break;
  block(a[0], a[1], a[2], a[3]); n++;
}