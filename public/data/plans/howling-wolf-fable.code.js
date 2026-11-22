// howling-wolf-fable — prompt:
// a wolf howling at the moon...

const V = new Map();
let PR = 5;
const K = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  V.set(K(x, y, z), [x, y, z, id, PR]);
}
function rnd(x, y, z) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- layout ----------
const T = 6;                 // crag plateau top
const OX = 1, OZ = 1;        // alpha wolf seat (world)
const YAW = 40;              // faces north, turned toward the east
const A = YAW * Math.PI / 180;
const FX = Math.sin(A), FZ = -Math.cos(A), RX = Math.cos(A), RZ = Math.sin(A);

// ---------- the crag: ramp rising from the south-west to an overhanging prow ----------
function rockH(x, z) {
  const dx = x - OX, dz = z - OZ;
  const F = dx * FX + dz * FZ, R = dx * RX + dz * RZ;
  let p;
  if (F > 8.5 || F < -21) return -99;
  if (F > 5) p = 1 - Math.pow((F - 5) / 3.5, 3);
  else if (F >= -10) p = 1;
  else { const t = (F + 21) / 11; p = t * t * (3 - 2 * t); }
  const halfW = F > 1 ? 9.5 - (F - 1) * 1.0 : F > -10 ? 9.5 : 9.5 - (-10 - F) * 0.35;
  const e = halfW - Math.abs(R) + (rnd(x, 0, z) - 0.5) * 1.2;
  if (e < 0) return -99;
  const s = Math.min(1, (e + 0.5) / 1.8);
  const val = p * Math.pow(s, 0.6);
  let h = -1.5 + (T + 1.5) * val;
  if (F < -10) h += (rnd(x, 1, z) - 0.5) * 1.1;
  return clamp(Math.round(h), -2, T);
}
const HM = new Map();
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const h = rockH(x, z);
  if (h > -99) HM.set(x + ',' + z, h);
}
const gh = (x, z) => (HM.has(x + ',' + z) ? HM.get(x + ',' + z) : -99);
const NB = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1], [2, 0], [-2, 0], [0, 2], [0, -2]];

PR = 8;
// clear the old trees standing on / hugging the crag
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const h = gh(x, z);
  let near = h > -99;
  if (!near) for (const n of NB) if (gh(x + n[0], z + n[1]) > -99) { near = true; break; }
  if (!near) continue;
  for (let y = Math.max(h + 1, 1); y <= 8; y++) put(x, y, z, AIR);
}
// rock shell with snow cap
for (const [k, h] of HM) {
  const xz = k.split(',').map(Number), x = xz[0], z = xz[1];
  const mn = Math.max(-3, Math.min(gh(x + 1, z), gh(x - 1, z), gh(x, z + 1), gh(x, z - 1)));
  const y0 = Math.max(-2, Math.min(h, mn + 1));
  for (let y = y0; y <= h; y++) {
    const r = rnd(x, y, z);
    let id = r < 0.28 ? COBBLE : STONE;
    if (y === h && h - mn <= 1 && rnd(x, 7, z) < 0.86) id = SNOW;
    else if (y === h && r < 0.35) id = SNOW;
    put(x, y, z, id);
  }
}
// overhanging prow under the wolf's paws
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const dx = x - OX, dz = z - OZ;
  const F = dx * FX + dz * FZ, R = dx * RX + dz * RZ;
  if (F < 4 || F > 10.2) continue;
  if (Math.abs(R) > (10.2 - F) * 0.62 + 0.4) continue;
  put(x, T, z, rnd(x, 7, z) < 0.8 ? SNOW : STONE);
  if (F < 9.2) put(x, T - 1, z, rnd(x, 3, z) < 0.3 ? COBBLE : STONE);
  if (F < 8.2 && Math.abs(R) < 2.5) put(x, T - 2, z, STONE);
  if (F < 7.4 && Math.abs(R) < 1.8) put(x, T - 3, z, COBBLE);
  for (let y = T + 1; y <= 8; y++) put(x, y, z, AIR);
}
// paw prints climbing the snowy ramp
for (let i = 0; i < 9; i++) {
  const F = -19.5 + i * 1.25, R = (i % 2 ? 0.9 : -0.9) + 1.5;
  const x = Math.round(OX + F * FX + R * RX), z = Math.round(OZ + F * FZ + R * RZ);
  const h = gh(x, z);
  if (h > -99) put(x, h, z, GRAY);
}

// ---------- wolf builder (sitting, head thrown back, howling) ----------
function wolf(ox, oy, oz, yaw, s) {
  const a = yaw * Math.PI / 180;
  const fx = Math.sin(a), fz = -Math.cos(a), rx = Math.cos(a), rz = Math.sin(a);
  const W = new Map();
  const P = (F, U, R) => [ox + s * (F * fx + R * rx), oy + s * U, oz + s * (F * fz + R * rz)];
  function each(A0, B0, ra, rb, fn) {
    const p = P(A0[0], A0[1], A0[2]), q = P(B0[0], B0[1], B0[2]);
    ra = Math.max(ra * s, 0.62); rb = Math.max(rb * s, 0.62);
    const m = Math.max(ra, rb) + 1;
    const d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
    const L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2] || 1e-9;
    for (let x = Math.floor(Math.min(p[0], q[0]) - m); x <= Math.ceil(Math.max(p[0], q[0]) + m); x++)
      for (let y = Math.max(oy, Math.floor(Math.min(p[1], q[1]) - m)); y <= Math.ceil(Math.max(p[1], q[1]) + m); y++)
        for (let z = Math.floor(Math.min(p[2], q[2]) - m); z <= Math.ceil(Math.max(p[2], q[2]) + m); z++) {
          const t = clamp(((x - p[0]) * d[0] + (y - p[1]) * d[1] + (z - p[2]) * d[2]) / L2, 0, 1);
          const r = ra + (rb - ra) * t;
          const ex = x - p[0] - d[0] * t, ey = y - p[1] - d[1] * t, ez = z - p[2] - d[2] * t;
          if (ex * ex + ey * ey + ez * ez <= r * r) fn(x, y, z);
        }
  }
  const cap = (A0, B0, ra, rb, id) => each(A0, B0, ra, rb, (x, y, z) => { W.set(K(x, y, z), [x, y, z, id]); });
  const ball = (A0, r, id) => cap(A0, A0, r, r, id);
  const paint = (A0, B0, ra, rb, id) => each(A0, B0, ra, rb, (x, y, z) => { const k = K(x, y, z); if (W.has(k)) W.get(k)[3] = id; });
  const G = GRAY, LG = LIGHT_GRAY;

  // bushy tail curled round the left flank (body overrides its root)
  const tl = [[-6, 1.6, -0.5], [-7.7, 1.4, -2.6], [-6.9, 1.25, -4.7], [-4.4, 1.1, -5.4], [-2.6, 1.0, -5.2]];
  cap(tl[0], tl[1], 1.5, 1.7, G);
  cap(tl[1], tl[2], 1.7, 1.6, G);
  cap(tl[2], tl[3], 1.6, 1.25, G);
  cap(tl[3], tl[4], 1.25, 0.8, BLACK);
  paint([-7.9, 2.6, -2.8], [-6.6, 2.4, -4.9], 1.0, 1.0, BLACK);

  // haunches + hind feet
  for (const sd of [-1, 1]) {
    ball([-4, 2.9, 1.7 * sd], 3.0, G);
    ball([-2.4, 2.3, 2.7 * sd], 2.3, G);
    cap([-2.4, 0.7, 3.3 * sd], [0.4, 0.55, 3.5 * sd], 1.2, 1.0, LG);
    cap([0.6, 0.5, 3.5 * sd], [1.3, 0.45, 3.5 * sd], 1.0, 0.9, WHITE);
  }
  // torso, chest, shoulders
  cap([-3.5, 3.6, 0], [1.5, 9, 0], 3.3, 3.1, G);
  ball([2, 8.6, 0], 3.2, G);
  for (const sd of [-1, 1]) ball([1.8, 8, 1.6 * sd], 2.3, G);
  // neck ruff
  cap([1.8, 10.2, 0], [3.6, 14.6, 0], 2.9, 2.2, G);
  // dark saddle + nape
  paint([-5.7, 5.5, 0], [-0.7, 11, 0], 2.1, 2.1, BLACK);
  paint([-0.4, 11.4, 0], [1.5, 15.0, 0], 1.6, 1.3, BLACK);
  // pale belly, throat and chest blaze
  paint([-1.3, 1.5, 0], [3.7, 7, 0], 2.0, 2.0, LG);
  paint([4.2, 6.5, 0], [5.3, 13.5, 0], 2.0, 1.8, LG);
  paint([4.9, 7.5, 0], [5.9, 13.5, 0], 1.3, 1.2, WHITE);
  // front legs
  for (const sd of [-1, 1]) {
    cap([2.6, 7, 1.7 * sd], [3.1, 3.5, 1.7 * sd], 1.5, 1.2, G);
    cap([3.1, 3.5, 1.7 * sd], [3.3, 0.9, 1.7 * sd], 1.2, 1.0, LG);
    cap([3.4, 0.5, 1.7 * sd], [4.4, 0.4, 1.7 * sd], 1.1, 1.0, WHITE);
  }
  // head thrown back, muzzle to the sky
  const C = [3.8, 15.5, 0];
  ball(C, 2.4, G);
  paint([5.1, 15.3, 0], [5.1, 15.3, 0], 1.8, 1.8, LG);
  for (const sd of [-1, 1]) {
    cap([2.4, 16.7, 1.4 * sd], [0.6, 18.0, 1.9 * sd], 0.9, 0.5, G);
    paint([0.6, 18.0, 1.9 * sd], [0.6, 18.0, 1.9 * sd], 0.9, 0.9, BLACK);
  }
  cap([5.33, 16.35, 0], [8.2, 18.5, 0], 0.95, 0.62, LG);       // lower jaw
  cap([6.3, 18.0, 0], [7.5, 19.0, 0], 0.55, 0.5, PINK);        // tongue
  cap([4.29, 16.95, 0], [6.2, 21.05, 0], 1.35, 0.92, G);       // upper muzzle
  paint([6.55, 21.7, 0], [6.55, 21.7, 0], 1.0, 1.0, BLACK);    // nose
  // eyes: march sideways out of the skull to its surface
  for (const sd of [-1, 1]) {
    let last = null;
    for (let r = 0; r < 4; r += 0.2) {
      const p = P(3.5, 16.7, r * sd).map(Math.round), k = K(p[0], p[1], p[2]);
      if (W.has(k)) last = k; else if (last) break;
    }
    if (last) W.get(last)[3] = GLOWSTONE;
  }
  for (const v of W.values()) put(v[0], v[1], v[2], v[3]);
  // frosty breath rising from the howl
  for (const b of [[7.9, 20.9, 0], [8.8, 22.3, 0]]) {
    const p = P(b[0], b[1], b[2]).map(Math.round);
    if (!W.has(K(p[0], p[1], p[2]))) put(p[0], p[1], p[2], STEAM);
  }
}

// ---------- full moon, far south behind the wolf ----------
{
  const mx = 5, my = 25, mz = 19;
  const craters = [[-3.2, 2.2, 2.1], [2.6, -3.2, 1.7], [3.4, 3.6, 1.3], [-2.2, -4.3, 1.2], [0.3, 0.4, 1.0], [-5.6, -1.2, 0.9]];
  const face = (dx, dy) => {
    for (const c of craters) if ((dx - c[0]) * (dx - c[0]) + (dy - c[1]) * (dy - c[1]) <= c[2] * c[2]) return LIGHT_GRAY;
    const r = rnd(dx, dy, 5);
    return r < 0.2 ? GLOWSTONE : r < 0.6 ? WHITE : MARBLE;
  };
  for (let dx = -8; dx <= 8; dx++) for (let dy = -8; dy <= 8; dy++) {
    const d2 = dx * dx + dy * dy;
    PR = 7;
    if (d2 <= 8.3 * 8.3) put(mx + dx, my + dy, mz, face(dx, dy));
    if (d2 <= 6.4 * 6.4) put(mx + dx, my + dy, mz - 1, face(dx, dy));
    PR = 2;
    if (d2 <= 7.3 * 7.3) put(mx + dx, my + dy, mz + 1, rnd(dx, dy, 9) < 0.25 ? LIGHT_GRAY : WHITE);
  }
  // stars
  PR = 5;
  const stars = [[-20, 30, 21], [-16, 24, 22], [-12, 32, 20], [-9, 21, 22], [-18, 18, 21], [-13, 27, 22], [15, 31, 21], [19, 26, 22],
                 [21, 32, 20], [17, 20, 22], [14, 23, 21], [21, 16, 21], [-21, 13, 22], [-6, 33, 21], [15, 15, 22], [-15, 15, 20]];
  for (const s of stars) put(s[0], s[1], s[2], GLOWSTONE);
  // thin cloud wisps drifting past the moon
  PR = 3;
  const wisp = (x1, x2, y, z) => {
    for (let x = x1; x <= x2; x++) {
      put(x, y, z, rnd(x, y, z) < 0.5 ? WHITE : LIGHT_GRAY);
      if (x > x1 + 1 && x < x2 - 1 && rnd(x, y, 2) < 0.6) put(x, y + 1, z, WHITE);
    }
  };
  wisp(-14, -4, 19, 17);
  wisp(-10, -5, 18, 17);
  wisp(11, 20, 28, 17);
  wisp(14, 18, 27, 17);
}

// ---------- snow-dusted pines ----------
function pine(x, z, base, tiers) {
  for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++)
    if (dx * dx + dz * dz <= 10 && gh(x + dx, z + dz) === -99)
      for (let y = Math.max(1, base); y <= 8; y++) put(x + dx, y, z + dz, AIR);
  let y = base;
  put(x, y++, z, OAK_LOG); put(x, y++, z, OAK_LOG);
  const ring = (r, yy, snowy) => {
    for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
      const d2 = dx * dx + dz * dz;
      if (d2 > r * r) continue;
      if (dx === 0 && dz === 0) { put(x, yy, z, OAK_LOG); continue; }
      const edge = d2 > (r - 1) * (r - 1);
      const q = rnd(x + dx, yy, z + dz);
      put(x + dx, yy, z + dz, snowy && edge && q < 0.55 ? SNOW : (q > 0.75 ? LEAVES : GREEN));
    }
  };
  for (const r of tiers) {
    ring(r, y, false); y++;
    ring(r, y, true); y++;
    if (r > 1) { ring(r - 1, y, true); y++; }
  }
  put(x, y, z, GREEN); put(x, y + 1, z, SNOW);
}
PR = 4.5; pine(-16, -7, -1, [3, 2, 2, 1]);
PR = 4.4; pine(18, 4, -1, [3, 3, 2, 1]);
PR = 4.3; pine(16, 14, -1, [3, 2, 1]);
PR = 4.2; pine(-20, 3, -1, [2, 2, 1]);
PR = 4.1; pine(-7, -17, 0, [2, 1]);

// ---------- second wolf answering from a snowy clearing below ----------
PR = 6;
{
  const cx = 16, cz = -6;
  for (let dx = -7; dx <= 7; dx++) for (let dz = -7; dz <= 7; dz++) {
    const d2 = dx * dx + dz * dz;
    if (d2 > 46) continue;
    for (let y = 1; y <= 8; y++) put(cx + dx, y, cz + dz, AIR);
    if (d2 <= 30 + rnd(dx, 0, dz) * 8) put(cx + dx, 0, cz + dz, SNOW);
  }
  wolf(15.5, 1, -7, -28, 0.68);
}

// ---------- the alpha on the crag ----------
PR = 9;
wolf(OX, T + 1, OZ, YAW, 1.1);

// ---------- emit: solids first (priority-capped to budget), then free AIR ----------
const all = [...V.values()];
const solids = all.filter(v => v[3] !== AIR);
solids.sort((p, q) => q[4] - p[4]);
const keep = solids.slice(0, 3960);
for (const v of keep) block(v[0], v[1], v[2], v[3]);
for (const v of all) if (v[3] === AIR) block(v[0], v[1], v[2], v[3]);