// ghost-rider-opus — prompt:
// Ghost Rider on his flaming motorcycle...

// Ghost Rider on his Hell Cycle, driving down a burning highway past a graveyard.
// The bike is angled 40° toward the north-east so the camera sees both the front and the left side.
const A = 40 * Math.PI / 180, S = Math.sin(A), C = Math.cos(A);
const K = 1.2, OX = 1, OZ = -1;
const M = new Map();
function put(x, y, z, id) {
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, id);
}
function isEmpty(x, y, z) { const k = M.get(x + ',' + y + ',' + z); return k === undefined || k === AIR; }
function W(u, v, y) { return [OX + K * (u * S + v * C), K * y, OZ + K * (-u * C + v * S)]; }
function L(x, y, z) { const dx = x - OX, dz = z - OZ; return [(dx * S - dz * C) / K, (dx * C + dz * S) / K, y / K]; }
function P(u, v, y, id) { const w = W(u, v, y); put(Math.round(w[0]), Math.round(w[1]), Math.round(w[2]), id); }
function FIREAT(u, v, y) { const w = W(u, v, y); const x = Math.round(w[0]), yy = Math.round(w[1]), z = Math.round(w[2]); if (isEmpty(x, yy, z)) put(x, yy, z, FIRE); }
function val(id, a, b, c) { return typeof id === 'function' ? id(a, b, c) : id; }

function wcone(a, b, r1, r2, id) {
  const r = Math.max(r1, r2);
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2], bb = bx * bx + by * by + bz * bz || 1e-9;
  for (let x = Math.floor(Math.min(a[0], b[0]) - r); x <= Math.ceil(Math.max(a[0], b[0]) + r); x++)
    for (let y = Math.floor(Math.min(a[1], b[1]) - r); y <= Math.ceil(Math.max(a[1], b[1]) + r); y++)
      for (let z = Math.floor(Math.min(a[2], b[2]) - r); z <= Math.ceil(Math.max(a[2], b[2]) + r); z++) {
        const px = x - a[0], py = y - a[1], pz = z - a[2];
        const t = Math.max(0, Math.min(1, (px * bx + py * by + pz * bz) / bb));
        const qx = px - bx * t, qy = py - by * t, qz = pz - bz * t;
        const rr = r1 + (r2 - r1) * t;
        if (qx * qx + qy * qy + qz * qz <= rr * rr) { const id2 = val(id, t); if (id2 != null) put(x, y, z, id2); }
      }
}
function wcap(a, b, r, id) { wcone(a, b, r, r, id); }
function cap(a, b, r, id) { wcone(W(a[0], a[1], a[2]), W(b[0], b[1], b[2]), r * K, r * K, id); }
function cone(a, b, r1, r2, id) { wcone(W(a[0], a[1], a[2]), W(b[0], b[1], b[2]), r1 * K, r2 * K, id); }

function scan(u1, u2, v1, v2, y1, y2, fn) {
  const cs = [W(u1, v1, 0), W(u1, v2, 0), W(u2, v1, 0), W(u2, v2, 0)];
  const xa = Math.floor(Math.min(cs[0][0], cs[1][0], cs[2][0], cs[3][0])) - 1, xb = Math.ceil(Math.max(cs[0][0], cs[1][0], cs[2][0], cs[3][0])) + 1;
  const za = Math.floor(Math.min(cs[0][2], cs[1][2], cs[2][2], cs[3][2])) - 1, zb = Math.ceil(Math.max(cs[0][2], cs[1][2], cs[2][2], cs[3][2])) + 1;
  const ya = Math.floor(y1 * K) - 1, yb = Math.ceil(y2 * K) + 1;
  for (let x = xa; x <= xb; x++) for (let z = za; z <= zb; z++) for (let y = ya; y <= yb; y++) {
    const q = L(x, y, z), u = q[0], v = q[1], yl = q[2];
    if (u < u1 || u > u2 || v < v1 || v > v2 || yl < y1 || yl > y2) continue;
    const id = fn(u, v, yl);
    if (id != null) put(x, y, z, id);
  }
}
function ell(cu, cv, cy, ru, rv, ry, id) {
  scan(cu - ru, cu + ru, cv - rv, cv + rv, cy - ry, cy + ry, (u, v, y) => {
    const q = ((u - cu) / ru) ** 2 + ((v - cv) / rv) ** 2 + ((y - cy) / ry) ** 2;
    return q > 1 ? null : val(id, u - cu, v - cv, y - cy);
  });
}
function box(u1, u2, v1, v2, y1, y2, id) { scan(u1, u2, v1, v2, y1, y2, (u, v, y) => val(id, u, v, y)); }
function arc(uc, yc, r1, r2, a1, a2, vw, id) {
  scan(uc - r2, uc + r2, -vw, vw, yc - r2, yc + r2, (u, v, y) => {
    const du = u - uc, dy = y - yc, r = Math.hypot(du, dy);
    if (r < r1 || r > r2) return null;
    const a = Math.atan2(dy, du) * 180 / Math.PI;
    return (a >= a1 && a <= a2) ? val(id, a, r) : null;
  });
}
const hash = (x, z) => (((x * 73856093) ^ (z * 19349663)) >>> 0) % 100;

// ---------------- SITE: clear the brush and lay down the highway ----------------
const treeSpots = [W(-4, 13, 0), W(-17, 7, 0)];
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const q = L(x, 0, z), u = q[0], v = q[1];
  const d = Math.hypot(x - OX, z - OZ);
  const nearTree = treeSpots.some(t => Math.hypot(x - t[0], z - t[2]) < 5);
  const onRoad = v >= -6.5 && v <= 3.5;
  if (d <= 15 || (v >= -7.5 && v <= 12.5) || nearTree) for (let y = onRoad ? 0 : 1; y <= 8; y++) put(x, y, z, AIR);
  if (onRoad) {
    let id = hash(x, z) < 22 ? BLACK : GRAY;
    if (v < -5.9 || v > 2.9) id = LIGHT_GRAY;
    if (v > -1.95 && v < -1.15 && (Math.floor((u + 100) / 2.5) % 2) === 0) id = YELLOW;
    if (u < -11.5 && Math.abs(v) < 1.7) id = hash(x, z) < 50 ? BLACK : OBSIDIAN;
    if (u < -12.5 && Math.abs(v) < 0.7) id = LAVA;
    put(x, -1, z, id);
  } else if (v > 3.5 && v < 5.5) put(x, -1, z, COBBLE);
}

// guard rail on the far shoulder
for (let u = -30; u <= 24; u += 3.5) cap([u, 5, -0.8], [u, 5, 1.4], 0.5, OAK_LOG);
cap([-30, 5, 1.5], [24, 5, 1.5], 0.55, IRON);
cap([-30, 5, 0.6], [24, 5, 0.6], 0.5, GRAY);

// graveyard behind the rail
const graves = [[-9, 9], [-5, 11], [-1, 8.5], [3, 10.5], [7, 8.5], [10, 11.5], [-13, 10.5]];
graves.forEach((g, i) => {
  const gu = g[0], gv = g[1];
  const h = 1.8 + (i % 3) * 0.5, lean = (i % 2 ? 0.2 : -0.25);
  box(gu - 0.45, gu + 0.45, gv - 0.9, gv + 0.9, -0.8, h, (u, v, y) => (y > h - 0.5 && Math.abs(v - gv) > 0.5) ? null : (i % 2 ? STONE : COBBLE));
  if (i % 3 === 0) {
    cap([gu, gv, h], [gu + lean, gv, h + 1.8], 0.45, STONE);
    cap([gu + lean * 0.6, gv - 0.9, h + 1.1], [gu + lean * 0.6, gv + 0.9, h + 1.1], 0.45, STONE);
  }
});

// dead, twisted trees
function deadTree(x, z, h, s) {
  wcone([x, -1, z], [x + s, h, z + 0.5], 1.3, 0.7, OAK_LOG);
  wcap([x + s * 0.5, h * 0.5, z], [x + s * 0.5 + 4, h * 0.5 + 3.5, z - 1.5], 0.6, OAK_LOG);
  wcap([x + s * 0.5 + 4, h * 0.5 + 3.5, z - 1.5], [x + s * 0.5 + 5, h * 0.5 + 5.5, z - 1], 0.5, OAK_LOG);
  wcap([x + s * 0.8, h * 0.75, z + 0.3], [x - 3, h + 2, z + 2], 0.55, OAK_LOG);
  wcap([x - 3, h + 2, z + 2], [x - 4, h + 4, z + 1], 0.5, OAK_LOG);
  wcap([x + s, h, z + 0.5], [x + s + 1, h + 4, z + 2.5], 0.5, OAK_LOG);
  wcap([x + s, h, z + 0.5], [x + s + 3, h + 2, z + 1], 0.5, BROWN);
}
deadTree(Math.round(treeSpots[0][0]), Math.round(treeSpots[0][2]), 11, 1);
deadTree(Math.round(treeSpots[1][0]), Math.round(treeSpots[1][2]), 9, -1);

// ---------------- THE HELL CYCLE (local: +u forward, +v rider's right, y up) ----------------
const RW = -9, FW = 12, WY = 5;
function wheel(uc, halfW) {
  scan(uc - 5.4, uc + 5.4, -1.5, 1.5, WY - 5.4, WY + 5.4, (u, v, y) => {
    const du = u - uc, dy = y - WY, r = Math.hypot(du, dy), av = Math.abs(v);
    if (r <= 5.3 && r > 4.2 && av <= halfW) return BLACK;
    if (r <= 4.2 && r > 3.3 && av <= 0.7) return LAVA;
    if (r <= 1.3 && av <= 1.4) return IRON;
    if (r < 3.3 && av <= 0.45) {
      const k = (((Math.atan2(dy, du) / (Math.PI / 4)) % 1) + 1) % 1;
      if (k < 0.2 || k > 0.8) return IRON;
    }
    return null;
  });
}
wheel(RW, 1.35);
wheel(FW, 1.0);

// fenders + gold pinstripe + tail lights
arc(RW, WY, 5.6, 6.5, 35, 172, 1.5, OBSIDIAN);
arc(RW, WY, 6.1, 6.5, 75, 135, 1.5, GOLD);
arc(FW, WY, 5.6, 6.3, 15, 120, 1.25, OBSIDIAN);
P(-15.4, -0.6, 6.7, NEON_RED); P(-15.4, 0.6, 6.7, NEON_RED);

// frame
cap([8.2, 0, 11.8], [7.3, 0, 15], 0.9, OBSIDIAN);
cap([7.5, 0, 13.5], [-3, 0, 10.5], 0.75, OBSIDIAN);
for (const s of [-1, 1]) {
  cap([-3, s, 10.2], [RW, s, WY], 0.55, OBSIDIAN);
  cap([3, s * 0.8, 2.5], [-5, s * 0.8, 2.5], 0.55, OBSIDIAN);
  cap([-5, s, 2.5], [RW, s, WY], 0.55, OBSIDIAN);
}
cap([7.8, 0, 12.5], [3, 0, 2.5], 0.75, OBSIDIAN);
cap([-3, 0, 10], [-4.5, 0, 3], 0.6, OBSIDIAN);

// raked chopper fork, ape-hanger bars, pegs
for (const s of [-1, 1]) {
  cap([FW, s * 1.5, WY], [7.3, s * 1.5, 14.5], 0.55, IRON);
  cap([FW, s * 1.5, WY], [10.7, s * 1.5, 8.5], 0.8, OBSIDIAN);
  cap([7.3, s * 1.2, 14.8], [7, s * 1.6, 16.6], 0.5, IRON);
  cap([7, s * 1.6, 16.6], [6, s * 4.4, 17.2], 0.5, IRON);
  cap([6, s * 4.4, 17.2], [5.6, s * 5.8, 17], 0.6, BLACK);
  cap([3, s * 1.4, 4], [3, s * 3.2, 4], 0.45, IRON);
}
cap([7.6, -2.1, 14.4], [7.6, 2.1, 14.4], 0.6, IRON);
cap([8.8, -2.1, 11.5], [8.8, 2.1, 11.5], 0.55, IRON);

// headlight
ell(9.5, 0, 12.8, 1.0, 1.4, 1.4, IRON);
ell(10.1, 0, 12.8, 0.7, 1.0, 1.0, GLOWSTONE);

// V-twin engine with cooling fins
ell(0.8, 0, 4.4, 3.0, 1.6, 2.0, GRAY);
cap([0.5, 0, 5.5], [-1.6, 0, 9], 1.35, t => (Math.floor(t * 8) % 2 === 0) ? LIGHT_GRAY : null);
cap([0.5, 0, 5.5], [-1.6, 0, 9], 1.0, IRON);
cap([1.6, 0, 5.5], [4.0, 0, 9.4], 1.35, t => (Math.floor(t * 8) % 2 === 0) ? LIGHT_GRAY : null);
cap([1.6, 0, 5.5], [4.0, 0, 9.4], 1.0, IRON);
ell(-1, -1.7, 4.2, 1.9, 0.6, 1.5, IRON);
ell(1.4, -1.9, 7.4, 0.8, 0.6, 1.2, GOLD);
P(1.4, -2.4, 7.4, BLACK);

// exhaust: two pipes on the camera side, one on the far side
cap([3.6, -1.4, 7.5], [3.4, -2.4, 3.8], 0.5, IRON);
cap([3.4, -2.4, 3.8], [-14, -2.4, 4.6], 0.55, IRON);
cap([-0.8, -1.4, 8.2], [-1.2, -2.6, 6.6], 0.5, IRON);
cap([-1.2, -2.6, 6.6], [-14, -2.6, 7.4], 0.55, IRON);
cap([3.4, 2.4, 3.8], [-14, 2.4, 5], 0.55, IRON);
cone([-12.5, -2.5, 4.6], [-15.2, -2.5, 4.8], 0.6, 0.9, IRON);
cone([-12.5, -2.6, 7.4], [-15.2, -2.6, 7.7], 0.6, 0.9, IRON);
cone([-12.5, 2.4, 5], [-15.2, 2.4, 5.2], 0.6, 0.9, IRON);

// fuel tank with flame livery
ell(4.3, 0, 13.4, 3.3, 1.9, 1.5, (du, dv, dy) => {
  if (Math.abs(dv) > 1.15) {
    const e = -0.2 + 0.6 * Math.sin(du * 2.3 + 1);
    if (dy < e - 0.7) return RED;
    if (dy < e) return ORANGE;
  }
  return OBSIDIAN;
});
P(4.6, 0, 15.1, IRON);

// seat + sissy bar
box(-5.2, -0.2, -1.6, 1.6, 10.4, 11.2, BLACK);
for (const s of [-1, 1]) cap([-5.5, s * 1.3, 10.6], [-6.8, s * 1.3, 15.5], 0.45, IRON);
cap([-6.8, -1.3, 15.5], [-6.8, 1.3, 15.5], 0.5, IRON);

// ---------------- GHOST RIDER ----------------
ell(-2.5, 0, 12, 2.0, 2.1, 1.3, BLACK);
const ucAt = y => -2.5 + (y - 12) / 7 * 3;
scan(-5, 3, -3.6, 3.6, 12, 19, (u, v, y) => {
  const t = (y - 12) / 7, uc = ucAt(y), hw = 2.0 + t * 1.3, hd = 1.4 + 0.25 * t;
  const du = u - uc;
  if ((du / hd) ** 2 + (v / hw) ** 2 > 1.05) return null;
  if (du > hd - 0.7 && Math.abs(v) < 0.45 && y < 17.5) return IRON;
  if (y < 12.9) return BROWN;
  return BLACK;
});
P(ucAt(12.5) + 1.5, 0, 12.5, GOLD);
// chain wrapped across the chest
cap([ucAt(18.2) + 1.4, 2.8, 18.2], [ucAt(12.8) + 1.5, -2.2, 12.8], 0.6, t => (Math.floor(t * 9) % 2 ? IRON : GRAY));
cap([ucAt(12.8) + 1.5, -2.2, 12.8], [ucAt(12.8) - 1.4, -2.3, 13.2], 0.55, t => (Math.floor(t * 4) % 2 ? IRON : GRAY));

for (const s of [-1, 1]) {
  // spiked shoulder pads
  ell(0.3, s * 3.0, 18.3, 1.3, 1.2, 0.9, OBSIDIAN);
  cone([0.4, s * 3.0, 18.8], [0.1, s * 3.6, 20.8], 0.55, 0.25, IRON);
  cone([-0.9, s * 3.1, 18.7], [-2.0, s * 3.8, 20.3], 0.55, 0.25, IRON);
  // arms gripping the ape-hangers
  cap([0.5, s * 3.1, 17.6], [3, s * 4.4, 15.4], 0.95, BLACK);
  cap([3, s * 4.4, 15.4], [5.6, s * 5.2, 16.7], 0.85, BLACK);
  P(3.1, s * 4.9, 15.2, IRON);
  ell(5.8, s * 5.2, 17, 0.9, 0.9, 0.9, OBSIDIAN);
  cap([4.6, s * 5.3, 16.4], [4.6, s * 5.3, 16.4], 0.6, IRON);
  // legs + boots on pegs
  cap([-2, s * 1.6, 12], [3.2, s * 2.4, 12.4], 1.05, BLACK);
  cap([3.2, s * 2.4, 12.4], [3.6, s * 2.6, 5.6], 0.95, BLACK);
  ell(3.3, s * 2.5, 12.6, 0.9, 1.0, 0.9, OBSIDIAN);
  ell(4.1, s * 2.6, 4.7, 1.6, 0.9, 1.1, OBSIDIAN);
  P(4.1, s * 3.5, 5.3, IRON);
}

// neck vertebrae
cap([0.6, 0, 18.6], [1.6, 0, 20.2], 0.6, t => (Math.floor(t * 3) % 2 ? LIGHT_GRAY : WHITE));

// glowing flame crown behind the skull
ell(1.3, 0, 23.3, 2.1, 2.0, 1.2, LAVA);

// the flaming skull, facing forward
const SK = [2.2, 0, 21.8], SR = [2.3, 2.1, 2.4];
scan(SK[0] - 2.5, SK[0] + 2.5, -2.3, 2.3, SK[2] - 3.2, SK[2] + 2.5, (u, v, y) => {
  const du = u - SK[0], dv = v, dy = y - SK[2], av = Math.abs(dv);
  const inCran = (du / SR[0]) ** 2 + (dv / SR[1]) ** 2 + (dy / SR[2]) ** 2 <= 1;
  const inJaw = du > -0.6 && du < 1.9 && dy > -3.0 && dy < -1.3 && av <= 1.45 - (-dy - 1.3) * 0.25;
  if (!inCran && !inJaw) return null;
  if (du > 0.7) {
    if (av > 0.3 && av < 1.8 && dy > -0.55 && dy < 1.0) return (av > 0.6 && av < 1.4 && dy > -0.45 && dy < 0.35) ? NEON_RED : BLACK;
    if (av < 0.5 && dy > -1.45 && dy < -0.6) return BLACK;
    if (dy <= -1.45 && du > 1.0) {
      if (dy > -2.05 && dy < -1.6) return (Math.floor(dv * 1.2 + 20) % 2) ? WHITE : BLACK;
      return (Math.floor(dv * 1.2 + 20) % 2) ? BLACK : WHITE;
    }
  }
  if (inJaw && !inCran) return LIGHT_GRAY;
  return av > 1.55 && dy < -0.2 ? LIGHT_GRAY : WHITE;
});

// flame hair swept back by speed
const spikes = [
  [0, 1.6, -3.4, 0, 27.0, 1.1],
  [1.1, 1.4, -2.8, 1.9, 26.3, 0.95],
  [-1.1, 1.4, -2.8, -1.9, 26.5, 0.95],
  [0.7, 2.2, -0.9, 0.9, 27.2, 0.8],
  [-0.7, 2.2, -0.9, -1.0, 27.0, 0.8],
  [1.9, 0.8, -4.0, 3.0, 24.6, 0.8],
  [-1.9, 0.8, -4.0, -3.0, 24.9, 0.8],
  [0, 0.2, -5.6, 0.4, 23.8, 0.9],
];
const flameCol = t => t < 0.4 ? LAVA : t < 0.75 ? ORANGE : YELLOW;
for (const sp of spikes) cone([sp[1], sp[0], 23.4], [sp[2], sp[3], sp[4]], sp[5], 0.3, flameCol);

// whip-chain trailing back from the left shoulder
for (let i = 0; i <= 29; i++) {
  const t = i / 29;
  const u = -0.5 - 13 * t, v = -3.4 - 2.6 * t - 1.3 * Math.sin(t * Math.PI * 2.2), y = 18.2 + 4.5 * Math.sin(t * Math.PI * 0.85) - 3 * t;
  P(u, v, y, i % 2 ? IRON : GRAY);
}

// ---------------- FIRE (only into open air) ----------------
for (const sp of spikes) FIREAT(sp[2] - 0.4, sp[3], Math.min(sp[4] + 0.3, 27.4));
FIREAT(2.6, 0, 25.2); FIREAT(3.4, 0.9, 24.6);
for (const a of [95, 120, 145, 170]) FIREAT(RW + 7.2 * Math.cos(a * Math.PI / 180), 0, WY + 7.2 * Math.sin(a * Math.PI / 180));
for (const a of [135, 160]) FIREAT(FW + 6.5 * Math.cos(a * Math.PI / 180), 0, WY + 6.5 * Math.sin(a * Math.PI / 180));
FIREAT(-16.3, -2.5, 4.8); FIREAT(-16.3, -2.6, 7.7); FIREAT(-16.3, 2.4, 5.2);
for (const u of [-16, -18, -20, -23, -26, -29]) FIREAT(u, 0, 0.1);
FIREAT(-13.8, -8.4, 11.5);

// emit solids first, then the free AIR clearing
for (const [k, id] of M) if (id !== AIR) { const p = k.split(','); block(+p[0], +p[1], +p[2], id); }
for (const [k, id] of M) if (id === AIR) { const p = k.split(','); block(+p[0], +p[1], +p[2], id); }