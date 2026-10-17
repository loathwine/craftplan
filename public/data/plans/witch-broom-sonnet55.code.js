// witch-broom-sonnet55 — prompt:
// a witch flying on a broomstick...

const OY = -1;
const B = (x, y, z, id) => block(Math.round(x), Math.round(y) + OY, Math.round(z), id);
const C = (x1, y1, z1, x2, y2, z2, id) => cube(x1, y1 + OY, z1, x2, y2 + OY, z2, id);

function rng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(a, b, c) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function disc(cx, y, cz, r, id) {
  const R2 = r * r + 0.3;
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++)
      if ((x - cx) ** 2 + (z - cz) ** 2 <= R2) B(x, y, z, id);
}
function ell(cx, cy, cz, rx, ry, rz, pick) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++)
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1) B(x, y, z, pick(x, y, z));
}
function thick(x1, y1, z1, x2, y2, z2, id, w) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1));
  for (let i = 0; i <= n; i++) {
    const t = n ? i / n : 0;
    const x = Math.round(x1 + (x2 - x1) * t), y = Math.round(y1 + (y2 - y1) * t), z = Math.round(z1 + (z2 - z1) * t);
    C(x, y, z, x + w - 1, y + w - 1, z + w - 1, id);
  }
}

const yc = x => 13 + Math.round((x + 2) * 0.1);

// ---------- MOON (backdrop, behind the witch) ----------
for (let x = -10; x <= 10; x++) {
  for (let y = 12; y <= 32; y++) {
    const dist = Math.hypot(x, y - 22);
    if (dist <= 9) {
      const id = dist > 8 ? LIGHT_GRAY : WHITE;
      B(x, y, 15, id);
      B(x, y, 16, id);
    } else if (dist >= 9.7 && dist <= 10.6) {
      B(x, y, 16, LIGHT_BLUE);
    }
  }
}
const craters = [[-3, 25, 2], [3, 19, 2.5], [2, 27, 1.4], [-5, 19, 1.6], [5, 24, 1.3], [-1, 21, 1.1], [0, 17, 1.2], [-6, 23, 1]];
for (const c of craters) {
  for (let x = -10; x <= 10; x++)
    for (let y = 12; y <= 32; y++)
      if (Math.hypot(x - c[0], y - c[1]) <= c[2] && Math.hypot(x, y - 22) <= 8) B(x, y, 15, LIGHT_GRAY);
}

// ---------- CLOUDS ----------
function cloud(cx, cy, cz, s) {
  const puffs = [[0, 0, 0, 1], [1.4, -0.2, 0.4, 0.8], [-1.5, -0.1, -0.3, 0.85], [0.6, 0.5, -0.8, 0.7], [-0.7, 0.4, 0.9, 0.6]];
  for (const p of puffs) {
    const rx = p[3] * s * 1.5, ry = p[3] * s * 0.7, rz = p[3] * s;
    ell(cx + p[0] * s, cy + p[1] * s, cz + p[2] * s, rx, ry, rz, (x, y, z) => (y < cy - 0.3 * s ? LIGHT_GRAY : WHITE));
  }
}
cloud(-10, 12, 10, 2.5);
cloud(9, 10, 11, 2.6);
cloud(-1, 9, 13, 2.2);

// ---------- BROOM HANDLE ----------
for (let x = -9; x <= 17; x++) {
  const y = yc(x);
  const id = (x % 5 === 0) ? OAK_LOG : PLANKS;
  B(x, y, 0, id); B(x, y + 1, 0, id); B(x, y - 1, 0, id); B(x, y, 1, id); B(x, y, -1, id);
}
ell(18, yc(18), 0, 1.6, 1.6, 1.6, () => GOLD);

// binding rings
for (let dy = -3; dy <= 3; dy++) {
  for (let dz = -3; dz <= 3; dz++) {
    const d = Math.hypot(dy, dz);
    if (d >= 1.3 && d <= 2.2) {
      B(-9, yc(-9) + dy, dz, OAK_LOG);
      B(-10, yc(-10) + dy, dz, BROWN);
    }
    if (d >= 1.3 && d <= 2.0) B(-8, yc(-8) + dy, dz, GOLD);
  }
}

// ---------- BRISTLES ----------
for (let d = 0; d <= 10; d++) {
  const x = -11 - d;
  const r = 1.8 + d * 0.27;
  for (let dy = -5; dy <= 5; dy++) {
    for (let dz = -5; dz <= 5; dz++) {
      const dist = Math.hypot(dy, dz);
      if (dist > r) continue;
      const maxd = 7 + hash(dy, dz, 7) * 4;
      if (d > maxd) continue;
      if (d > 5 && dist > r - 0.8 && hash(x, dy, dz) < 0.35) continue;
      const h = hash(x + 3, dy, dz);
      const id = h < 0.5 ? YELLOW : h < 0.8 ? SAND : h < 0.93 ? ORANGE : BROWN;
      B(x, yc(x) + dy, dz, id);
    }
  }
}
// magic sparks in the bristles
B(-19, yc(-19), 0, ELECTRIC);
B(-16, yc(-16) + 2, 1, ELECTRIC);
B(-17, yc(-17) - 2, -1, ELECTRIC);

// ---------- CAPE ----------
for (let d = 0; d <= 11; d++) {
  const x = -1 - d;
  const top = Math.round(21.5 - 0.12 * d + Math.sin(d * 0.55));
  const bot = Math.round(16.5 + 0.28 * d + Math.sin(d * 0.55 + 0.8));
  if (bot > top) break;
  for (let y = bot; y <= top; y++) {
    const edge = (y === top || y === bot);
    for (let z = -1; z <= 1; z++) B(x, y, z, edge ? MAGENTA : PURPLE);
  }
  if (d % 3 === 1) for (let y = bot + 1; y <= top - 1; y++) B(x, y, -2, PURPLE);
  if (d % 3 === 0) for (let y = bot + 1; y <= top - 1; y++) B(x, y, 2, PURPLE);
  if (d % 2 === 0 && d > 2) { B(x, bot - 1, 0, MAGENTA); B(x, bot - 1, -1, PURPLE); }
}

// ---------- SKIRT ----------
for (let k = 0; k <= 3; k++) {
  const y = 18 - k;
  const xmin = -1 - 2 * k, xmax = 1 + (k >= 2 ? 1 : 0), hz = 2 + (k >= 2 ? 1 : 0);
  for (let x = xmin; x <= xmax; x++)
    for (let z = -hz; z <= hz; z++)
      B(x, y, z, k === 3 ? PURPLE : BLACK);
}
for (const z of [-3, -1, 1, 3]) {
  const len = 3 + Math.floor(hash(z, 3, 3) * 3);
  for (let i = 1; i <= len; i++) B(-7 - i, 15 - (i > 2 ? 1 : 0), z, i === len ? PURPLE : BLACK);
}

// ---------- TORSO ----------
for (let y = 15; y <= 20; y++) {
  const cx = Math.round(-1 + (y - 15) * 0.4);
  const hz = (y <= 16) ? 2 : 1;
  for (let x = cx - 1; x <= cx + 1; x++)
    for (let z = -hz; z <= hz; z++)
      B(x, y, z, y === 17 ? PURPLE : BLACK);
}
disc(1, 21, 0, 2, PURPLE);
B(0, 20, -2, GOLD);

// ---------- LEGS ----------
for (const s of [-1, 1]) {
  const z1 = s < 0 ? -2 : 1, z2 = s < 0 ? -1 : 2;
  const kx = s < 0 ? 3 : 1;
  for (let y = 16; y <= 12; y--) {}
  for (let y = 12; y <= 16; y++) C(kx, y, z1, kx + 1, y, z2, (y % 2 === 0) ? WHITE : PURPLE);
  C(kx, 11, z1, kx + 1, 11, z2, PURPLE);
  C(kx, 8, z1, kx + 3, 9, z2, BLACK);
  C(kx, 10, z1, kx + 1, 10, z2, BLACK);
  if (s < 0) B(kx + 1, 9, -2, GOLD);
}

// ---------- ARMS ----------
thick(0, 19, -2, 4, 16, -2, BLACK, 2);
C(5, 15, -2, 5, 16, -1, PURPLE);
C(6, 15, -1, 7, 15, 0, LIME);
B(8, 15, -1, LIME);
B(6, 14, -1, LIME);
thick(0, 19, 1, 4, 16, 1, BLACK, 2);
C(5, 15, 1, 5, 16, 2, PURPLE);
C(6, 15, 0, 7, 15, 1, LIME);

// ---------- HEAD ----------
for (let x = 0; x <= 6; x++)
  for (let y = 20; y <= 26; y++)
    for (let z = -3; z <= 3; z++)
      if ((x - 3) ** 2 + (y - 23) ** 2 + z * z <= 6.3) B(x, y, z, LIME);
// face
B(3, 24, -2, WHITE);
B(4, 24, -2, BLACK);
B(3, 22, -2, RED);
B(4, 22, -2, RED);
B(5, 22, -1, RED);
C(5, 22, -1, 6, 23, 1, LIME);
C(7, 21, 0, 7, 23, 0, LIME);
B(6, 22, -2, GREEN);
B(5, 21, 0, LIME);
B(5, 20, 0, LIME);
// ear + earring
B(2, 23, -3, LIME);
B(2, 24, -3, LIME);
B(2, 22, -3, GOLD);

// ---------- HAIR ----------
for (let zi = -2; zi <= 2; zi++) {
  const len = 6 + Math.floor(hash(zi, 5, 5) * 5);
  for (let i = 0; i <= len; i++) {
    const x = -i;
    let y = 23 - Math.floor(i / 4) + Math.round(1.2 * Math.sin(i * 0.7 + zi * 1.3));
    y = Math.min(y, 23);
    const id = hash(i, zi, 9) < 0.2 ? RED : ORANGE;
    B(x, y, zi, id);
    B(x, y + 1, zi, id);
  }
}

// ---------- HAT ----------
for (let x = -5; x <= 9; x++) {
  for (let z = -6; z <= 6; z++) {
    const v = (x - 2) ** 2 / 42 + z * z / 33;
    if (v <= 1) {
      const by = x >= 6 ? 24 : (x <= -2 ? 26 : 25);
      B(x, by, z, v > 0.8 ? PURPLE : BLACK);
    }
  }
}
for (let t = 0; t <= 7; t++) {
  const y = 26 + t;
  const r = 3.4 - t * 0.42;
  const cx = Math.round(2 - 0.2 * Math.pow(t, 1.4));
  disc(cx, y, 0, r, t < 2 ? PURPLE : BLACK);
}
// bent tip
B(-2, 34, 0, BLACK); B(-3, 34, 0, BLACK); B(-4, 33, 0, BLACK); B(-5, 32, 0, BLACK); B(-5, 31, 0, GOLD);
// buckle and stars
C(1, 26, -3, 2, 27, -3, GOLD);
B(0, 28, -2, GOLD);
B(2, 29, -2, GOLD);
B(1, 31, -1, GOLD);

// ---------- BLACK CAT ----------
C(10, 16, -1, 12, 18, 1, BLACK);
C(10, 19, -2, 12, 20, 0, BLACK);
B(10, 20, -2, GLOWSTONE);
B(12, 20, -2, GLOWSTONE);
B(11, 19, -2, PINK);
B(10, 21, -1, BLACK);
B(12, 21, -1, BLACK);
B(10, 16, -2, BLACK);
B(12, 16, -2, BLACK);
const tail = [[13, 16], [14, 16], [14, 17], [14, 18], [14, 19], [13, 20], [13, 21], [12, 22]];
for (const t of tail) B(t[0], t[1], 1, BLACK);

// ---------- HANGING LANTERN ----------
B(14, 13, 0, IRON);
C(13, 12, -1, 15, 12, 1, IRON);
C(13, 9, -1, 15, 11, 1, GLASS);
B(14, 10, 0, GLOWSTONE);
C(13, 8, -1, 15, 8, 1, IRON);
for (const px of [13, 15]) for (const pz of [-1, 1]) C(px, 9, pz, px, 11, pz, IRON);

// ---------- MAGIC SPIRAL TRAIL ----------
for (let i = 0; i <= 26; i++) {
  const xr = Math.round(-10 - i * 0.45);
  const ang = i * 0.7;
  const y = yc(xr) + Math.round(6 * Math.cos(ang));
  const z = Math.round(6 * Math.sin(ang));
  const id = i % 5 === 0 ? GLOWSTONE : (i % 2 ? MAGENTA : PURPLE);
  B(xr, y, z, id);
  B(xr, y + 1, z, id);
}

// ---------- BATS ----------
function bat(x, y, z) {
  const pts = [[0, 0], [0, 1], [-1, 0], [1, 0], [-2, 1], [2, 1], [-3, 1], [3, 1], [-3, 2], [3, 2], [-1, 2], [1, 2]];
  for (const p of pts) B(x + p[0], y + p[1], z, BLACK);
  B(x, y + 1, z - 1, RED);
}
bat(-15, 27, -5);
bat(15, 29, -6);
bat(-18, 22, -5);
bat(19, 23, -4);
bat(9, 31, -8);

// ---------- STARS ----------
const SR = rng(2024);
for (let i = 0; i < 46; i++) {
  const x = -21 + Math.floor(SR() * 43);
  const y = 12 + Math.floor(SR() * 20);
  const behind = SR() < 0.75;
  const z = behind ? 7 + Math.floor(SR() * 7) : -12 + Math.floor(SR() * 5);
  const kind = SR();
  if (kind < 0.18) {
    B(x, y, z, YELLOW);
    B(x - 1, y, z, GOLD); B(x + 1, y, z, GOLD); B(x, y - 1, z, GOLD); B(x, y + 1, z, GOLD);
  } else if (kind < 0.26) {
    B(x, y, z, GLOWSTONE);
  } else {
    B(x, y, z, kind < 0.6 ? YELLOW : GOLD);
  }
}