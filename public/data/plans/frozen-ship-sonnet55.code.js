// frozen-ship-sonnet55 — prompt:
// a ship trapped in Arctic pack ice...

const dx = -0.65, dz = -0.76, rx = 0.76, rz = -0.65;
const MAP = new Map();
const FLOOR = [];
const CAP = 3950;
let seed = 90210;
function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
function clamp(a, lo, hi) { return Math.max(lo, Math.min(hi, a)); }
function K(x, y, z) { return ((x + 40) * 200 + (y + 20)) * 200 + (z + 40); }
function inb(x, y, z) { return x >= -22 && x <= 22 && z >= -22 && z <= 22 && y >= -8 && y <= 33; }
function P(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (!inb(x, y, z)) return;
  MAP.set(K(x, y, z), [x, y, z, id]);
}
function Fp(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (!inb(x, y, z)) return;
  const k = K(x, y, z);
  if (!MAP.has(k)) MAP.set(k, [x, y, z, id]);
}
function lin(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    P(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id);
  }
}
const Lx = (u, v) => u * dx + v * rx;
const Lz = (u, v) => u * dz + v * rz;
const SH = (u, v) => 1 + Math.round(0.1 * u - 0.09 * v);
function PL(u, v, w, id) { P(Lx(u, v), w + SH(u, v), Lz(u, v), id); }
function hwAt(u) {
  let h;
  if (u > 4) h = 5.4 * (1 - Math.pow(Math.min(1, (u - 4) / 11.5), 1.7));
  else if (u < -8) h = 5.4 * (1 - 0.35 * Math.pow((-8 - u) / 6, 2));
  else h = 5.4;
  return Math.max(h, 0);
}

// ---- clear trees in a circular site (AIR is free) ----
for (let z = -21; z <= 21; z++) {
  const half = Math.floor(Math.sqrt(21.5 * 21.5 - z * z));
  cube(-half, 0, z, half, 9, z, AIR);
}

// ---- HULL ----
for (let x = -18; x <= 18; x++) for (let z = -18; z <= 18; z++) {
  const u = x * dx + z * dz, v = x * rx + z * rz;
  if (u < -14 || u > 15.6) continue;
  const hw = hwAt(u), av = Math.abs(v);
  if (av > hw + 0.4) continue;
  const sh = SH(u, v);
  for (let w = -1; w <= 4; w++) {
    const y = w + sh;
    if (y < -1) continue;
    const flare = 0.72 + 0.28 * clamp((w + 1) / 4, 0, 1);
    const e = hw * flare - av;
    if (e < -0.4) continue;
    const wall = e < 1.0 || u > 12.3 || u < -12.9;
    let id = null;
    if (w === -1) id = OAK_LOG;
    else if (wall) {
      if (w === 0) id = OAK_LOG;
      else if (w === 2) id = ((((Math.floor(u) % 3) + 3) % 3) === 0) ? BLACK : YELLOW;
      else id = BLACK;
    } else if (w === 3) id = PLANKS;
    if (id !== null) P(x, y, z, id);
    if (w === 3 && !wall && !(u < -6.2 && u > -12.9 && av < 3.4) && rnd() < 0.4) P(x, y + 1, z, SNOW);
  }
}

// ---- POOP CABIN ----
for (let x = -18; x <= 18; x++) for (let z = -18; z <= 18; z++) {
  const u = x * dx + z * dz, v = x * rx + z * rz;
  if (u < -12.9 || u > -6.2 || Math.abs(v) > 3.4) continue;
  const av = Math.abs(v), sh = SH(u, v);
  const edge = u < -11.9 || u > -7.2 || av > 2.4;
  if (edge) {
    for (let w = 4; w <= 6; w++) {
      let id = PLANKS;
      const ev = (((Math.floor(u) % 2) + 2) % 2) === 0;
      if (w === 5) {
        if (v > 2.4 && ev) id = GLOWSTONE;
        else if (v < -2.4 && ev) id = GLASS;
        else if (u < -11.9 && av < 2.4 && ev) id = GLASS;
      }
      P(x, w + sh, z, id);
    }
  }
  P(x, 7 + sh, z, BROWN);
  if (rnd() < 0.85) P(x, 8 + sh, z, SNOW);
}
// chimney
for (let w = 8; w <= 10; w++) PL(-9, -1.2, w, BRICK);
PL(-9, -1.2, 11, STEAM);

// ---- SAILS ----
function sail(u0, w1, w2, hl, sh0, tat) {
  for (let w = w1; w <= w2; w++) for (let v = -hl; v <= hl; v += 0.5) {
    if (tat && w <= w1 + 1 && rnd() < 0.3) continue;
    if (rnd() < 0.04) continue;
    const bil = 0.7 * (1 - Math.pow(v / hl, 2));
    const id = rnd() < 0.15 ? LIGHT_GRAY : WHITE;
    P(Lx(u0 + 0.9 + bil, v), w + sh0, Lz(u0 + 0.9 + bil, v), id);
  }
}
function furl(u0, w, hl, sh0) {
  for (let v = -hl + 0.5; v <= hl - 0.5; v += 0.5) P(Lx(u0 + 0.5, v), w - 1 + sh0, Lz(u0 + 0.5, v), WHITE);
}
const masts = [
  { u: 8, top: 25, name: 'fore' },
  { u: 1.5, top: 28, name: 'main' },
  { u: -5, top: 21, name: 'miz' }
];
const sh_fore = SH(8, 0), sh_main = SH(1.5, 0), sh_miz = SH(-5, 0);
sail(1.5, 6, 11, 6, sh_main, true);
sail(1.5, 13, 17, 4.5, sh_main, true);
sail(8, 6, 10, 5, sh_fore, true);
sail(8, 12, 15, 4, sh_fore, true);
sail(-5, 6, 9, 4, sh_miz, true);
furl(1.5, 23, 3.5, sh_main);
furl(8, 21, 3, sh_fore);
furl(-5, 14, 3.5, sh_miz);

// jib
{
  const A = [19, 7.7], B = [9.4, 22], C = [10.2, 7];
  const area = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  const T = area(A, B, C);
  for (let u = 9.6; u <= 19; u += 0.5) for (let w = 7; w <= 22; w += 0.5) {
    const p = [u, w];
    const l1 = area(p, B, C) / T, l2 = area(A, p, C) / T, l3 = area(A, B, p) / T;
    if (l1 >= 0 && l2 >= 0 && l3 >= 0 && rnd() > 0.05) PL(u, 0, w, rnd() < 0.2 ? LIGHT_GRAY : WHITE);
  }
}

// ---- RIGGING ----
for (const m of masts) {
  const sh0 = SH(m.u, 0), mx = Lx(m.u, 0), mz = Lz(m.u, 0);
  for (const side of [-1, 1]) for (const k of [-1.2, 1.2]) {
    const uu = m.u + k, v = side * (hwAt(uu) - 0.2);
    lin(mx, m.top - 9 + sh0, mz, Lx(uu, v), SH(uu, v) + 5, Lz(uu, v), GRAY);
  }
}
function stay(u1, w1, u2, w2) {
  lin(Lx(u1, 0), w1 + SH(u1, 0), Lz(u1, 0), Lx(u2, 0), w2 + SH(u2, 0), Lz(u2, 0), GRAY);
}
stay(1.5, 26, 8, 23);
stay(8, 24, 19.5, 7);
stay(1.5, 25, -5, 20);
// bowsprit + figurehead
lin(Lx(12, 0), 4 + SH(12, 0), Lz(12, 0), Lx(20, 0), 8 + SH(20, 0), Lz(20, 0), OAK_LOG);
PL(15.7, 0, 2, GOLD); PL(15.9, 0, 3, GOLD); PL(16.2, 0, 4, GOLD);

// ---- YARDS ----
function yard(u0, w, hl, sh0, snow) {
  for (let v = -hl; v <= hl; v += 0.5) {
    P(Lx(u0, v), w + sh0, Lz(u0, v), OAK_LOG);
    if (snow && rnd() < 0.6) P(Lx(u0, v), w + sh0 + 1, Lz(u0, v), SNOW);
  }
}
yard(1.5, 12, 6.5, sh_main, true); yard(1.5, 18, 5, sh_main, true);
yard(1.5, 23, 3.5, sh_main, true); yard(1.5, 26, 2.5, sh_main, true);
yard(8, 11, 5.5, sh_fore, true); yard(8, 16, 4.5, sh_fore, true); yard(8, 21, 3, sh_fore, true);
yard(-5, 10, 4.5, sh_miz, true); yard(-5, 14, 3.5, sh_miz, true);

// ---- MASTS ----
for (const m of masts) {
  const sh0 = SH(m.u, 0);
  const mx = Math.round(Lx(m.u, 0)), mz = Math.round(Lz(m.u, 0));
  for (let w = 3; w <= m.top; w++) {
    P(mx, w + sh0, mz, OAK_LOG);
    if (w <= 10 && m.name !== 'miz') {
      P(mx + 1, w + sh0, mz, OAK_LOG); P(mx, w + sh0, mz + 1, OAK_LOG); P(mx + 1, w + sh0, mz + 1, OAK_LOG);
    }
  }
  P(mx, m.top + 1 + sh0, mz, GOLD);
  // crow's nest
  const ny = m.top - 8 + sh0;
  for (let ax = -2; ax <= 2; ax++) for (let az = -2; az <= 2; az++) {
    const d = Math.hypot(ax, az);
    if (d >= 1.4 && d <= 2.3) { P(mx + ax, ny, mz + az, OAK_LOG); if (rnd() < 0.5) P(mx + ax, ny + 1, mz + az, SNOW); }
    else if (d > 0 && d < 1.4) P(mx + ax, ny - 1, mz + az, PLANKS);
  }
}
for (let k = 1; k <= 4; k++) PL(1.5 - k * 0.8, 0, 30, RED);
for (let k = 1; k <= 2; k++) PL(1.5 - k * 0.8, 0, 31, RED);
for (let k = 1; k <= 3; k++) PL(8 - k * 0.8, 0, 27, YELLOW);

// ---- DECK DETAILS ----
for (let u = 3; u <= 5; u += 0.5) for (let v = -1; v <= 1; v += 0.5) PL(u, v, 4, BROWN);
PL(6.3, 0, 4, COBBLE); PL(6.3, 0, 5, IRON);
PL(10.5, 2.2, 4, BROWN); PL(10.5, -2.2, 4, BROWN); PL(10.5, 2.2, 5, BROWN); PL(11.2, -2.2, 4, BROWN);
for (let u = -3.5; u <= 0; u += 0.5) for (const v of [3.0, 3.9]) PL(u, v, 4, PLANKS);
for (let u = -3; u <= -0.5; u += 0.5) PL(u, 3.45, 5, SNOW);
PL(-13.5, 2, 5, GLOWSTONE); PL(-13.5, -2, 5, GLOWSTONE); PL(12.8, 0, 5, GLOWSTONE);
PL(-13.5, 2, 4, OAK_LOG); PL(-13.5, -2, 4, OAK_LOG);
// ramp to ice
{
  const hw = hwAt(3);
  for (const du of [0, 1]) {
    const uu = 3 + du;
    lin(Lx(uu, hw), SH(uu, hw) + 5, Lz(uu, hw), Lx(uu, hw + 7), 0, Lz(uu, hw + 7), PLANKS);
  }
}

// ---- CAMP ON THE ICE ----
function tent(c1, c2, k0, id, alongX) {
  for (let a = c1; a <= c2; a++) for (let o = -2; o <= 2; o++) {
    const top = 2 - Math.abs(o);
    const ends = (a === c1 || a === c2);
    for (let y = (ends ? 0 : top); y <= top; y++) {
      if (alongX) P(a, y, k0 + o, id); else P(k0 + o, y, a, id);
    }
  }
}
tent(7, 11, -15, ORANGE, true);
tent(-12, -8, 17, YELLOW, false);
P(11, 0, -9, FIRE);
for (const [a, b] of [[10, -9], [12, -9], [11, -10], [11, -8]]) P(a, 0, b, COBBLE);
P(8, 0, -8, OAK_LOG); P(14, 0, -8, OAK_LOG); P(11, 0, -6, OAK_LOG);
function person(x, z, coat) { P(x, 0, z, BROWN); P(x, 1, z, coat); P(x, 2, z, coat); P(x, 3, z, PINK); }
person(9, -9, RED); person(13, -9, BLUE); person(11, -7, GREEN); person(6, -8, ORANGE); person(10, -12, PURPLE);
// sled and crates
for (let x = 13; x <= 17; x++) { P(x, 0, -14, PLANKS); P(x, -0, -13, IRON); P(x, 0, -15, IRON); }
P(14, 1, -14, BROWN); P(15, 1, -14, BROWN); P(15, 2, -14, BROWN); P(16, 1, -14, GRAY);
// flag
for (let y = 0; y <= 6; y++) P(17, y, -18, OAK_LOG);
P(18, 6, -18, RED); P(19, 6, -18, RED); P(18, 5, -18, RED); P(19, 5, -18, RED);
// upturned boat
for (let t = -2; t <= 2; t++) {
  for (const zz of [-5, -6]) P(3 + t, 0, zz - 12, PLANKS);
  if (Math.abs(t) <= 1) { P(3 + t, 1, -17.5, BROWN); P(3 + t, 1, -17, BROWN); }
}

// ---- ICEBERGS ----
function berg(cx, cz, r, h, lean) {
  for (let y = 0; y <= h; y++) {
    const rr = r * Math.pow(1 - y / h, 0.7) + 0.4;
    const ox = cx + lean * y, n = Math.ceil(rr) + 1;
    for (let ax = -n; ax <= n; ax++) for (let az = -n; az <= n; az++) {
      const d = Math.hypot(ax, az);
      if (d <= rr && (d > rr - 1.15 || y >= h - 1)) {
        P(ox + ax, y, cz + az, (y > h * 0.75 || rnd() < 0.25) ? SNOW : ICE);
      }
    }
  }
}
berg(-13, 16, 3.6, 14, 0.06);
berg(13, 17, 3, 10, -0.05);
berg(-19, 0, 2.4, 6, 0.05);

// ---- SNOW BANKS HUGGING HULL ----
for (let x = -18; x <= 18; x++) for (let z = -18; z <= 18; z++) {
  const u = x * dx + z * dz, v = x * rx + z * rz;
  if (u < -12 || u > 11) continue;
  const hw = hwAt(u), av = Math.abs(v);
  if (av > hw + 0.5 && av < hw + 2.4) {
    if (rnd() < 0.8) Fp(x, 0, z, rnd() < 0.6 ? SNOW : ICE);
    if (rnd() < 0.35) Fp(x, 1, z, SNOW);
    if (rnd() < 0.1) Fp(x, 2, z, ICE);
  }
}

// ---- PRESSURE RIDGES ----
for (let i = 0; i < 34; i++) {
  const a = rnd() * Math.PI * 2, r = 8 + rnd() * 12;
  const x = r * Math.cos(a), z = r * Math.sin(a);
  const u = x * dx + z * dz, v = x * rx + z * rz;
  if (u > -18 && u < 19 && Math.abs(v) < 8.8) continue;
  if (Math.hypot(x - 11, z + 11) < 7) continue;
  if (Math.hypot(x + 13, z - 16) < 5 || Math.hypot(x - 13, z - 17) < 4.5) continue;
  const ang = rnd() * Math.PI * 2, sx = Math.cos(ang), sz = Math.sin(ang);
  const L = 2 + rnd() * 3.5, h = 1.5 + rnd() * 3.2;
  for (let t = 0; t <= L; t += 0.5) {
    const px = x + sx * t, pz = z + sz * t, py = t * h / L;
    P(px, py, pz, ICE);
    P(px + 1, py, pz, rnd() < 0.5 ? ICE : SNOW);
    if (t > L - 1) P(px, py + 1, pz, SNOW);
  }
}
for (let i = 0; i < 50; i++) {
  const a = rnd() * Math.PI * 2, r = 5 + rnd() * 15;
  const x = r * Math.cos(a), z = r * Math.sin(a);
  const u = x * dx + z * dz, v = x * rx + z * rz;
  if (u > -16 && u < 17 && Math.abs(v) < 8) continue;
  Fp(x, 0, z, rnd() < 0.6 ? SNOW : ICE);
  if (rnd() < 0.3) Fp(x, 1, z, SNOW);
}

// ---- ICE FLOOR (y=-1), irregular edge, dark lead on the port side ----
for (let x = -21; x <= 21; x++) for (let z = -21; z <= 21; z++) {
  const r = Math.hypot(x, z);
  if (r > 21) continue;
  FLOOR.push([r + (rnd() - 0.5) * 5, x, z]);
}
FLOOR.sort((a, b) => a[0] - b[0]);

// ---- FLUSH ----
const mainEntries = Array.from(MAP.values()).slice(0, CAP - 800);
for (const e of mainEntries) block(e[0], e[1], e[2], e[3]);
let total = mainEntries.length;
for (const f of FLOOR) {
  if (total >= CAP) break;
  const x = f[1], z = f[2];
  if (MAP.has(K(x, -1, z))) continue;
  const u = x * dx + z * dz, v = x * rx + z * rz;
  let id;
  const leadV = -14 - 0.02 * u * u;
  if (Math.abs(u) < 14 && Math.abs(v - leadV) < 1.0 + 0.6 * Math.sin(u * 0.7)) id = WATER;
  else {
    const q = rnd();
    id = q < 0.55 ? SNOW : q < 0.85 ? ICE : q < 0.93 ? WHITE : LIGHT_GRAY;
  }
  block(x, -1, z, id);
  total++;
}