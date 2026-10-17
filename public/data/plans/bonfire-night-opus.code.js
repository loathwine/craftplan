// bonfire-night-opus — prompt:
// a Bonfire Night bonfire with fireworks...

// Bonfire Night: a log teepee with a Guy on top, spectators, a toffee stall, a Catherine wheel and fireworks overhead
const M = new Map(), LOW = new Set();
function P(x, y, z, id, low) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  M.set(k, [x, y, z, id]);
  if (low) LOW.add(k); else LOW.delete(k);
}
function C(a, b, c, d, e, f, id) {
  for (let x = Math.min(a, d); x <= Math.max(a, d); x++)
    for (let y = Math.min(b, e); y <= Math.max(b, e); y++)
      for (let z = Math.min(c, f); z <= Math.max(c, f); z++) P(x, y, z, id);
}
function L(a, b, c, d, e, f, id, step) {
  step = step || 1;
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(d - a), Math.abs(e - b), Math.abs(f - c))));
  for (let i = 0; i <= n; i += step) { const t = i / n; P(a + (d - a) * t, b + (e - b) * t, c + (f - c) * t, id); }
}
function R(i) { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function H(x, z) { return R(x * 73.13 + z * 19.71 + 7.7); }

const BX = 0, BZ = 3;
const dist = (x, z) => Math.hypot(x - BX, z - BZ);

// ---------- CLEAR TREES (targeted zone only) ----------
for (let x = -17; x <= 17; x++) for (let z = -18; z <= 17; z++) {
  const d = dist(x, z);
  const inZone = d <= 12.5 + H(x, z) * 1.2 ||
    (Math.abs(x) <= 9 && z >= -18 && z <= -8) ||
    (Math.abs(x) <= 11 && z >= 8 && z <= 17);
  if (!inZone) continue;
  for (let y = 2; y <= 7; y++) P(x, y, z, AIR);
}
const trunks = [[1,-7,0],[4,-3,0],[0,1,0],[-6,-1,0],[-6,1,0],[-7,-5,0],[7,-2,0],[8,-1,0],[8,3,0],[-7,4,0],[-7,5,0],
  [-2,7,0],[-10,8,0],[-7,8,0],[-6,9,0],[-10,3,1],[-11,-2,1],[-12,-3,1],[-12,-7,1],[-1,-10,0],[3,-10,0],[-6,-8,0],
  [-5,-12,1],[1,-13,0],[-5,13,0],[12,-5,1],[-9,15,0],[11,17,0]];
for (const [x, z, y0] of trunks) for (let y = y0; y <= 3; y++) P(x, y, z, AIR);
C(10, 1, 9, 14, 4, 13, AIR);
P(12, 0, 11, AIR);

// ---------- GROUND PAD ----------
for (let x = -12; x <= 12; x++) for (let z = -9; z <= 15; z++) {
  const d = dist(x, z); if (d > 11.5) continue;
  P(x, 0, z, AIR);
  const h = H(x, z);
  let id;
  if (d <= 4.5) id = h < 0.35 ? BLACK : (h < 0.85 ? GRAY : LIGHT_GRAY);
  else if (d <= 8) id = h < 0.6 ? DIRT : (h < 0.8 ? GRAY : BROWN);
  else id = h < 0.4 ? DIRT : GRASS;
  P(x, -1, z, id, d > 9);
}
// embers glowing in the ash
for (let i = 0; i < 7; i++) { const a = i * 0.9 + 3.4; P(BX + 6.5 * Math.cos(a), -1, BZ + 6.5 * Math.sin(a), LAVA); }

// ---------- STONE FIRE RING ----------
for (let i = 0; i < 52; i++) { const a = i * 2 * Math.PI / 52; P(BX + 7.3 * Math.cos(a), 0, BZ + 7.3 * Math.sin(a), R(i + 3) < 0.5 ? COBBLE : STONE); }

// ---------- GLOWING CORE ----------
for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++) {
  const d = Math.hypot(x, z);
  if (d <= 2.3) P(BX + x, 0, BZ + z, LAVA);
  if (d <= 1.5) P(BX + x, 1, BZ + z, LAVA);
}
P(BX, 2, BZ, LAVA);

// ---------- TEEPEE OF LOGS ----------
for (let i = 0; i < 22; i++) {
  const a = i * 2 * Math.PI / 22 + (R(i) - 0.5) * 0.15;
  const r0 = 5.6 + R(i + 50) * 0.6, r1 = 0.7, ty = 10 + Math.floor(R(i + 90) * 3);
  L(BX + r0 * Math.cos(a), 0, BZ + r0 * Math.sin(a), BX + r1 * Math.cos(a), ty, BZ + r1 * Math.sin(a), OAK_LOG);
}
// leaning planks
for (let i = 0; i < 14; i++) {
  const a = (i + 0.5) * 2 * Math.PI / 14 + (R(i + 200) - 0.5) * 0.2;
  L(BX + 6.6 * Math.cos(a), 0, BZ + 6.6 * Math.sin(a), BX + 3.0 * Math.cos(a), 6, BZ + 3.0 * Math.sin(a), R(i + 7) < 0.6 ? PLANKS : BROWN);
}
// interior jumble of sticks
for (let i = 0; i < 24; i++) {
  const a1 = R(i + 300) * 6.283, r1 = R(i + 310) * 3.5, y1 = R(i + 320) * 2;
  const a2 = R(i + 330) * 6.283, r2 = R(i + 340) * 1.5, y2 = 4 + R(i + 350) * 5;
  L(BX + r1 * Math.cos(a1), y1, BZ + r1 * Math.sin(a1), BX + r2 * Math.cos(a2), y2, BZ + r2 * Math.sin(a2), R(i + 360) < 0.5 ? OAK_LOG : BROWN);
}
// pallets leaning on the pile
function pallet(a) {
  const ca = Math.cos(a), sa = Math.sin(a), tx = -sa, tz = ca;
  for (let v = 0; v <= 5; v++) {
    const r = 6.6 - v * 0.45, y = v * 0.8;
    for (let u = -2; u <= 2; u++) {
      if (v % 2 === 1 && u % 2 !== 0) continue;
      P(BX + r * ca + tx * u, y, BZ + r * sa + tz * u, v % 2 === 1 ? BROWN : PLANKS);
    }
  }
}
pallet(4.0); pallet(5.45); pallet(0.6); pallet(2.6);
// stacked logs lying around the base (back and sides)
for (const a of [1.3, 1.9, 3.3, 6.0]) {
  const cx = BX + 6.4 * Math.cos(a), cz = BZ + 6.4 * Math.sin(a), tx = -Math.sin(a), tz = Math.cos(a);
  L(cx - tx * 2, 0, cz - tz * 2, cx + tx * 2, 0, cz + tz * 2, OAK_LOG);
  L(cx - tx * 1, 1, cz - tz * 1, cx + tx * 1, 1, cz + tz * 1, OAK_LOG);
}

// ---------- FLAMES ----------
const rCone = y => 5.8 - 5 * y / 11;
const fireRows = [[1, 8, 0.2], [3, 6, 0.6], [5, 5, 0.1], [7, 4, 0.9], [9, 3, 0.4]];
for (const [y, n, off] of fireRows) {
  const r = rCone(y) - 0.3;
  for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n + off; P(BX + r * Math.cos(a), y, BZ + r * Math.sin(a), FIRE); }
}

// ---------- THE GUY (effigy in a chair on top) ----------
C(-2, 12, 2, 2, 12, 5, PLANKS);
for (const [x, z] of [[-2, 2], [2, 2], [-2, 5], [2, 5]]) C(x, 8, z, x, 11, z, BROWN);
C(-2, 13, 6, 2, 19, 6, PLANKS);
C(-2, 13, 6, -2, 20, 6, BROWN); C(2, 13, 6, 2, 20, 6, BROWN); C(-2, 19, 6, 2, 19, 6, BROWN);
// legs
C(-1, 13, 2, -1, 13, 4, BROWN); C(1, 13, 2, 1, 13, 4, BROWN);
C(-1, 11, 1, -1, 12, 1, BROWN); C(1, 11, 1, 1, 12, 1, BROWN);
P(-1, 10, 1, BLACK); P(1, 10, 1, BLACK); P(-1, 10, 0, BLACK); P(1, 10, 0, BLACK);
// torso, belt, collar ruff
C(-1, 14, 3, 1, 16, 5, RED);
C(-1, 14, 3, 1, 14, 3, BLACK); P(0, 14, 3, GOLD); P(0, 15, 3, GOLD);
C(-1, 14, 5, 1, 16, 5, BLACK);
C(-2, 16, 2, 2, 16, 5, WHITE);
// arms with straw hands
C(-2, 14, 3, -2, 15, 4, RED); C(2, 14, 3, 2, 15, 4, RED);
P(-2, 13, 3, YELLOW); P(2, 13, 3, YELLOW); P(-3, 14, 3, YELLOW); P(3, 14, 3, YELLOW);
// head (mask facing north)
C(-1, 17, 3, 1, 19, 5, WHITE);
C(-1, 17, 5, 1, 19, 5, BLACK);
P(-1, 18, 3, BLACK); P(1, 18, 3, BLACK);
P(-1, 17, 3, BLACK); P(0, 17, 3, BLACK); P(1, 17, 3, BLACK);
P(0, 16, 2, BLACK);
// tall hat
C(-2, 20, 2, 2, 20, 6, BLACK);
C(-1, 21, 3, 1, 23, 5, BLACK);
C(-1, 21, 3, 1, 21, 3, GRAY); P(0, 21, 3, GOLD);
// flames licking the chair
P(-2, 11, 3, FIRE); P(2, 11, 4, FIRE);

// ---------- FIREWORKS ----------
function dirs(n, seed) {
  const out = [];
  for (let k = 0; k < n; k++) {
    const yv = 1 - 2 * (k + 0.5) / n, rr = Math.sqrt(1 - yv * yv), th = k * 2.39996 + seed;
    out.push([rr * Math.cos(th), yv, rr * Math.sin(th)]);
  }
  return out;
}
function peony(cx, cy, cz, r, n, cols, tipA, tipB, seed) {
  const ts = [0.35, 0.6, 0.82, 1.0];
  dirs(n, seed).forEach((d, k) => {
    ts.forEach((t, j) => {
      const id = j === ts.length - 1 ? (k % 2 ? tipA : tipB) : cols[j % cols.length];
      P(cx + d[0] * r * t, cy + d[1] * r * t - 0.12 * r * t * t, cz + d[2] * r * t * 0.8, id);
    });
  });
}
function willow(cx, cy, cz, r, n, seed) {
  dirs(n, seed).forEach((d, k) => {
    if (d[1] < -0.5) return;
    for (let t = 0.3; t <= 1.36; t += 0.15) {
      const tt = Math.min(t, 1.1);
      const id = t > 1.2 ? (k % 3 ? YELLOW : GLOWSTONE) : (t < 0.5 ? YELLOW : GOLD);
      P(cx + d[0] * r * tt, cy + d[1] * r * t - r * 0.75 * t * t + r * 0.25, cz + d[2] * r * tt * 0.8, id);
    }
  });
}
function ringBurst(cx, cy, cz, r) {
  let i = 0;
  for (let a = 0; a < Math.PI * 2; a += 0.2, i++) {
    P(cx + r * Math.cos(a), cy + r * Math.sin(a), cz + Math.sin(a) * 0.8, i % 3 ? YELLOW : GLOWSTONE);
    if (i % 2 === 0) P(cx + r * 0.55 * Math.cos(a + 0.1), cy + r * 0.55 * Math.sin(a + 0.1), cz, ORANGE);
  }
}
function trail(x0, z0, cx, cy, cz) {
  const y0 = 3, n = Math.ceil(cy - y0);
  for (let i = 0; i < n; i += 2) {
    const t = i / n;
    P(x0 + (cx - x0) * t + Math.sin(i * 0.7) * 0.5, y0 + i, z0 + (cz - z0) * t, t > 0.8 ? LIGHT_GRAY : GRAY);
  }
}
peony(-10, 25, 12, 6, 52, [RED, RED, ORANGE], NEON_RED, PINK, 0.3);
peony(10, 26, 9, 6.5, 56, [BLUE, LIGHT_BLUE, CYAN], NEON_BLUE, WHITE, 1.1);
willow(0, 26, 16, 6, 40, 0.7);
peony(-16, 17, 7, 4, 28, [PURPLE, MAGENTA], GLOWSTONE, PINK, 2.0);
peony(17, 16, 13, 4, 28, [GREEN, LIME], GLOWSTONE, LIME, 2.7);
ringBurst(-6, 15, 19, 4.5);
peony(-18, 30, 16, 3, 20, [WHITE, LIGHT_GRAY], GLOWSTONE, WHITE, 0.5);
P(-10, 25, 12, ELECTRIC); P(10, 26, 9, ELECTRIC); P(-6, 15, 19, ELECTRIC); P(-18, 30, 16, ELECTRIC);
trail(-8, 16, -10, 22, 12);
trail(8, 16, 10, 23, 9);
trail(-5, 16, -6, 12, 19);

// mortar tubes behind the fence
for (const tx of [-8, -5, -2, 3, 8]) {
  C(tx - 1, 1, 15, tx + 1, 8, 17, AIR);
  C(tx, -2, 16, tx, 1, 16, GRAY); P(tx, 2, 16, BLACK);
}
// rocket mid-flight to the right of the Guy
C(6, 11, 9, 6, 13, 9, BROWN);
C(6, 14, 9, 6, 16, 9, RED); P(6, 17, 9, WHITE);
P(6, 10, 9, GLOWSTONE); P(6, 8, 9, LIGHT_GRAY); P(7, 6, 10, GRAY); P(7, 4, 11, GRAY);

// ---------- FENCE + FESTOON LIGHTS (behind) ----------
for (let x = -10; x <= 10; x += 4) C(x, -2, 14, x, 2, 14, OAK_LOG);
C(-10, 1, 14, 10, 1, 14, PLANKS);
C(-11, -2, 14, -11, 6, 14, OAK_LOG); C(11, -2, 14, 11, 6, 14, OAK_LOG);
const bulbs = [RED, YELLOW, BLUE, GLOWSTONE, LIME, MAGENTA];
for (let x = -10; x <= 10; x++) P(x, 6 - 2.5 * (1 - (x / 11) * (x / 11)), 14, bulbs[(x + 30) % 6]);

// ---------- SPECTATORS ----------
function person(x, z, fx, fz, o) {
  const wx = -fz, wz = fx, b = o.y0 || 0, kid = !!o.kid;
  const legT = b + (kid ? 0 : 1), torB = legT + 1, torT = torB + (kid ? 0 : 1), headB = torT + 1, headT = headB + 1;
  for (let i = 0; i < 2; i++) {
    const cx = x + wx * i, cz = z + wz * i;
    for (let y = b; y <= legT; y++) P(cx, y, cz, o.pants);
    for (let d = 0; d >= -1; d--) {
      const px = cx + fx * d, pz = cz + fz * d;
      for (let y = torB; y <= torT; y++) P(px, y, pz, o.coat);
      if (o.scarf) P(px, torT, pz, o.scarf);
      for (let y = headB; y <= headT; y++) P(px, y, pz, d === 0 ? o.skin : o.hair);
      P(px, headT, pz, o.hair);
      if (o.hat) P(px, headT + 1, pz, o.hat);
    }
    P(cx, headB, cz, o.skin);
  }
  for (let y = torB; y <= torT; y++) { P(x - wx, y, z - wz, o.coat); P(x + 2 * wx, y, z + 2 * wz, o.coat); }
  if (o.hat && o.pom) P(x, headT + 2, z, o.pom);
  if (o.sparkler) {
    const hx = x + 2 * wx + fx, hz = z + 2 * wz + fz;
    P(hx, torT, hz, o.skin); P(hx, torT + 1, hz, IRON); P(hx + fx, torT + 2, hz + fz, GLOWSTONE);
  }
}
person(-9, 3, 1, 0, { coat: GREEN, pants: BLUE, scarf: RED, hat: RED, pom: WHITE, skin: SAND, hair: BROWN, sparkler: true });
person(-8, 7, 1, 0, { kid: true, coat: YELLOW, pants: BLUE, hat: BLUE, pom: WHITE, skin: SAND, hair: ORANGE, sparkler: true });
person(9, 1, -1, 0, { coat: PURPLE, pants: BLACK, scarf: WHITE, hat: GRAY, skin: SAND, hair: BLACK });
person(10, 6, -1, 0, { coat: RED, pants: GRAY, scarf: YELLOW, hat: GREEN, pom: YELLOW, skin: BROWN, hair: BLACK, sparkler: true });
person(-6, -7, 0, 1, { coat: BLUE, pants: BLACK, scarf: ORANGE, hat: MAGENTA, pom: PINK, skin: SAND, hair: YELLOW, sparkler: true });
person(6, -7, 0, 1, { coat: BROWN, pants: BLUE, scarf: RED, hat: BLACK, skin: SAND, hair: BROWN });
person(-3, -7, 0, 1, { kid: true, coat: PINK, pants: PURPLE, hat: WHITE, pom: RED, skin: SAND, hair: BROWN, sparkler: true });

// ---------- TOFFEE APPLE STALL (front-left) ----------
for (let x = -14; x <= -9; x++) { C(x, 0, -4, x, 1, -4, PLANKS); P(x, 1, -4, (x & 1) ? RED : WHITE); P(x, 2, -4, BROWN); }
for (const [x, z] of [[-14, -4], [-9, -4], [-14, -1], [-9, -1]]) C(x, 0, z, x, 5, z, OAK_LOG);
C(-13, 1, -1, -10, 4, -1, PLANKS);
C(-13, 3, -1, -10, 3, -1, BROWN);
for (let x = -15; x <= -8; x++) {
  for (let z = -5; z <= -1; z++) P(x, 6, z, (x & 1) ? RED : WHITE);
  P(x, 5, -5, (x & 1) ? WHITE : RED);
}
P(-13, 3, -4, RED); P(-13, 4, -4, BROWN);
P(-11, 3, -4, RED); P(-11, 4, -4, BROWN);
P(-12, 3, -4, BROWN); P(-10, 3, -4, WHITE);
P(-11, 5, -2, GLOWSTONE);
person(-12, -3, 0, -1, { coat: WHITE, pants: BLUE, scarf: RED, skin: SAND, hair: GRAY });

// ---------- CATHERINE WHEEL (front-right) ----------
C(12, 0, -5, 12, 6, -5, OAK_LOG);
for (let arm = 0; arm < 2; arm++) {
  const pts = [];
  for (let t = 0; ; t++) {
    const r = 0.6 + t * 0.09; if (r > 3.4) break;
    pts.push([12 + r * Math.cos(t * 0.45 + arm * Math.PI), 6 + r * Math.sin(t * 0.45 + arm * Math.PI)]);
  }
  pts.forEach((p, i) => P(p[0], p[1], -6, i >= pts.length - 3 ? (arm ? GLOWSTONE : NEON_RED) : [ORANGE, YELLOW, RED, YELLOW][Math.floor(i / 3) % 4]));
}
P(12, 6, -6, IRON);
P(12, 6, -7, ELECTRIC);
for (let i = 0; i < 8; i++) { const a = i * 0.8 + 0.3, r = 4.2 + R(i + 700) * 1.4; P(12 + r * Math.cos(a), 6 + r * Math.sin(a), -6, i % 2 ? ORANGE : YELLOW); }

// ---------- PROPS ----------
C(8, 0, 9, 9, 0, 10, YELLOW); P(8, 1, 9, YELLOW); P(9, 1, 10, YELLOW);
P(8, 0, -4, IRON); P(8, 1, -4, WATER);
C(13, -1, 9, 15, 1, 11, PLANKS);
for (const [x, z] of [[13, 9], [15, 9], [13, 11], [15, 11]]) P(x, 1, z, BROWN);
const rk = [[13, 9, RED], [14, 10, BLUE], [15, 11, YELLOW], [13, 11, GREEN], [15, 9, MAGENTA]];
for (const [x, z, c] of rk) { C(x, 2, z, x, 3, z, BROWN); C(x, 4, z, x, 5, z, c); P(x, 6, z, WHITE); }

// ---------- BUDGET GUARD + FLUSH ----------
let solid = 0;
for (const v of M.values()) if (v[3] !== AIR) solid++;
for (const k of LOW) { if (solid <= 3980) break; M.delete(k); solid--; }
for (const [x, y, z, id] of M.values()) block(x, y, z, id);