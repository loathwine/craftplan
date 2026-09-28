// dragon-hoard-opus-fb2 — feedback pass 2
const M = new Map();
const R = Math.round;
let PRI = 3;
function key(x, y, z) { return x + ',' + y + ',' + z; }
function put(x, y, z, id) {
  x = R(x); y = R(y); z = R(z);
  if (Math.abs(x) > 22 || Math.abs(z) > 22 || y < -8 || y > 33) return;
  M.set(key(x, y, z), [x, y, z, id, PRI]);
}
function putE(x, y, z, id) {
  if (!M.has(key(R(x), R(y), R(z)))) put(x, y, z, id);
}
function hsh(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function pline(a, b, id) {
  const n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]), 1) * 2;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    put(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, id);
  }
}
function tri(a, b, c, idf) {
  const e = Math.max(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), Math.hypot(c[0] - a[0], c[1] - a[1], c[2] - a[2]), Math.hypot(c[0] - b[0], c[1] - b[1], c[2] - b[2]));
  const n = Math.ceil(e * 2.4) + 2;
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
    const u = i / n, v = j / n, w = 1 - u - v;
    const x = a[0] * w + b[0] * u + c[0] * v, y = a[1] * w + b[1] * u + c[1] * v, z = a[2] * w + b[2] * u + c[2] * v;
    putE(x, y, z, idf(R(x), R(y), R(z)));
  }
}
function ellip(cx, cy, cz, rx, ry, rz, colorFn) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) put(x, y, z, colorFn(x, y, z, dx, dy, dz));
      }
}
const scale = (x, y, z) => hsh(x, y, z) < 0.18 ? BRICK : RED;

cylinder(0, 1, 1, 19, 10, AIR);
cube(-22, 1, -22, 22, 9, -12, AIR);

function mound(x, z, cx, cz, rx, rz, h) {
  const d2 = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
  return d2 >= 1 ? 0 : h * Math.pow(1 - d2, 1.1);
}
function H(x, z) {
  let h = Math.max(
    mound(x, z, 0, 2, 17, 14, 8),
    mound(x, z, -0.5, -9, 6, 4.5, 4.8),
    mound(x, z, -13, -6, 5, 5, 3.5),
    mound(x, z, 13, 9, 4.5, 4.5, 3),
    mound(x, z, -12, 10, 5, 5, 3.5)
  );
  if (h > 0.3) h += 0.6 * Math.sin(x * 0.71 + z * 0.33) * Math.sin(z * 0.57 - x * 0.21) + (hsh(R(x), 7, R(z)) - 0.5) * 0.6;
  return h;
}
const GEMS = [RED, BLUE, LIME, MAGENTA, CYAN, WHITE, BLUE, RED];
PRI = 1;
for (let x = -20; x <= 20; x++) for (let z = -17; z <= 19; z++) {
  const h = H(x, z);
  if (h < 0.45) {
    const near = Math.max(mound(x, z, 0, 2, 20, 17, 1), mound(x, z, -0.5, -9, 9, 7.5, 1), mound(x, z, -13, -6, 8, 8, 1));
    if (near > 0 && hsh(x, 1, z) < 0.3) {
      PRI = 0;
      put(x, 0, z, hsh(x, 2, z) < 0.6 ? GOLD : YELLOW);
      putE(x, -1, z, GOLD);
      PRI = 1;
    }
    continue;
  }
  const tp = R(h);
  for (let y = -2; y <= tp; y++) {
    const r = hsh(x, y, z);
    let id = r < 0.34 ? YELLOW : (r < 0.38 ? ORANGE : GOLD);
    if (y === tp) {
      const r2 = hsh(z, y, x);
      if (r2 < (z < -4 ? 0.028 : 0.012)) id = GLOWSTONE;
      else if (r2 > 0.955) id = GEMS[Math.floor(hsh(y, z, x) * GEMS.length)];
    }
    put(x, y, z, id);
  }
}
PRI = 3;
const top = (x, z) => { const h = H(R(x), R(z)); return h < 0.45 ? -1 : R(h); };

const spine = [
  [-3.2, -5.0, 2.0, 0.2],
  [-2.9, -2.6, 2.5, 0.9],
  [-2.0, 0.4, 3.3, 0.9],
  [-2.2, 3.8, 3.8, 0.4],
  [-1.0, 7.2, 3.7, 0],
  [1.6, 10.0, 3.3, 0],
  [5.2, 11.4, 2.7, 0],
  [8.8, 10.0, 2.3, 0],
  [11.2, 6.4, 2.0, 0],
  [12.0, 2.0, 1.7, 0],
  [11.4, -2.6, 1.45, 0],
  [10.0, -6.6, 1.2, 0],
  [9.4, -10.2, 0.95, 0],
  [11.2, -13.0, 0.75, 0],
  [14.0, -14.2, 0.6, 0],
].map(([x, z, r, lift]) => [x, Math.max(H(x, z), 0) + r * 0.72 + lift, z, r]);

function cr(p0, p1, p2, p3, t, i) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1[i] + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3);
}
const samples = [];
for (let k = 0; k < spine.length - 1; k++) {
  const p0 = spine[Math.max(0, k - 1)], p1 = spine[k], p2 = spine[k + 1], p3 = spine[Math.min(spine.length - 1, k + 2)];
  for (let t = 0; t < 1; t += 0.12) samples.push([0, 1, 2, 3].map(i => cr(p0, p1, p2, p3, t, i)));
}
samples.push(spine[spine.length - 1].slice());
let s = 0;
for (let i = 0; i < samples.length; i++) {
  if (i) s += Math.hypot(samples[i][0] - samples[i - 1][0], samples[i][1] - samples[i - 1][1], samples[i][2] - samples[i - 1][2]);
  samples[i].push(s);
}
const SQ = 0.82;
for (const [cx, cy, cz, r, sa] of samples) {
  const ri = Math.ceil(r);
  for (let x = Math.floor(cx - ri); x <= Math.ceil(cx + ri); x++)
    for (let y = Math.floor(cy - ri); y <= Math.ceil(cy + ri); y++)
      for (let z = Math.floor(cz - ri); z <= Math.ceil(cz + ri); z++) {
        const dx = x - cx, dy = (y - cy) / SQ, dz = z - cz;
        if (dx * dx + dy * dy + dz * dz > r * r) continue;
        const rel = (y - cy) / (r * SQ);
        let id;
        if (rel < -0.3) id = (Math.floor(sa * 0.8) % 2) ? ORANGE : YELLOW;
        else if (rel < -0.1) id = ORANGE;
        else id = scale(x, y, z);
        put(x, y, z, id);
      }
}
let nextSpike = 1.0;
for (const [cx, cy, cz, r, sa] of samples) {
  if (sa < nextSpike) continue;
  nextSpike = sa + (r > 2 ? 1.6 : 1.25);
  const base = cy + r * SQ;
  const h = Math.max(1, R(r * 0.75));
  for (let k = 0; k < h; k++) put(cx, base + k, cz + k * 0.3, k === h - 1 ? OBSIDIAN : (k === 0 ? BRICK : BLACK));
  if (r > 2.5) { put(cx - 1, base - 0.3, cz, BRICK); put(cx + 1, base - 0.3, cz, BRICK); }
}
(function spade() {
  const P = spine[spine.length - 1], Q = spine[spine.length - 2];
  let dx = P[0] - Q[0], dz = P[2] - Q[2];
  const l = Math.hypot(dx, dz); dx /= l; dz /= l;
  const px = -dz, pz = dx;
  const ws = [1.6, 1.9, 1.2, 0.5];
  for (let k = 0; k < ws.length; k++) {
    const cx = P[0] + dx * (k + 0.6), cz = P[2] + dz * (k + 0.6);
    for (let j = -ws[k]; j <= ws[k] + 0.01; j += 0.5)
      put(cx + px * j, P[1], cz + pz * j, Math.abs(j) > ws[k] - 0.6 ? OBSIDIAN : BLACK);
  }
})();

// HEAD — enlarged, resting chin-down on the hoard, facing north(-east)
const S = 1.35;
const HD = [0.6, -0.8], HRt = [0.8, 0.6];
const Cx = -3, Cz = -6.6, Cy = Math.max(H(Cx, Cz), 0) + 2.3 * S;
const Wl = (f, sd, y) => [Cx + (f * HD[0] + sd * HRt[0]) * S, Cy + y * S, Cz + (f * HD[1] + sd * HRt[1]) * S];
const headMin = new Map();
for (let x = Math.floor(Cx - 14); x <= Cx + 14; x++)
  for (let z = Math.floor(Cz - 14); z <= Cz + 14; z++)
    for (let y = Math.floor(Cy - 7); y <= Cy + 7; y++) {
      const dx = (x - Cx) / S, dy = (y - Cy) / S, dz = (z - Cz) / S;
      const f = dx * HD[0] + dz * HD[1], sd = dx * HRt[0] + dz * HRt[1], as = Math.abs(sd);
      const fb = f < 0 ? 3.0 : 2.8;
      const inSkull = (f / fb) ** 2 + (sd / 2.6) ** 2 + (dy / 2.4) ** 2 <= 1;
      let id = null;
      if (f >= 1 && f <= 7.2) {
        const t = (f - 1) / 6.2, yc = -0.2 - 2.0 * t;
        const tp = yc + 1.5 - 0.5 * t, bt = yc - 1.4 + 0.45 * t, sw = 2.1 - 0.75 * t;
        const mid = (tp + bt) / 2, hh = (tp - bt) / 2;
        if ((sd / sw) ** 2 + ((dy - mid) / hh) ** 2 <= 1) {
          const m = dy - (yc - 0.2);
          if (Math.abs(m) < 0.4 && as > sw * 0.3) id = (as > sw * 0.55 && R(f * S) % 2 === 0 && t < 0.85) ? WHITE : BLACK;
          else if (m < 0) id = dy < bt + 0.6 ? YELLOW : (hsh(x, y, z) < 0.3 ? ORANGE : RED);
          else if (t > 0.84 && dy > tp - 0.9 && as > 0.35 && as < 1.2) id = BLACK;
          else id = hsh(x, y, z) < 0.12 ? BRICK : RED;
        }
      }
      if (inSkull) {
        if (!id) id = dy < -1.3 ? ORANGE : scale(x, y, z);
        if (f > 0.5 && f < 2.3 && dy >= 0.4 && dy < 1.1 && as > 1.55) id = BLACK; // closed eyelids
      }
      if (!id) continue;
      put(x, y, z, id);
      const k = x + ',' + z, cur = headMin.get(k);
      if (!cur || y < cur[2]) headMin.set(k, [x, z, y]);
    }
for (const sd of [-1, 1]) {
  pline(Wl(2.6, sd * 1.8, 1.6), Wl(-0.2, sd * 2.3, 2.1), ORANGE);                // brow ridge
  pline(Wl(1.2, sd * 2.4, 0.3), Wl(-0.4, sd * 2.5, 0.5), YELLOW);                // lower lid line
  pline(Wl(-1.2, sd * 1.5, 1.8), Wl(-4.0, sd * 2.4, 3.2), LIGHT_GRAY);           // horns
  pline(Wl(-1.0, sd * 1.2, 1.2), Wl(-3.8, sd * 2.2, 2.6), LIGHT_GRAY);
  pline(Wl(-4.0, sd * 2.4, 3.2), Wl(-6.4, sd * 2.8, 4.2), WHITE);
  put(...Wl(-7.0, sd * 2.8, 4.7), WHITE);
  pline(Wl(-0.2, sd * 2.3, -0.6), Wl(-2.8, sd * 3.6, -0.2), BLACK);              // cheek spikes
  pline(Wl(0.8, sd * 2.2, -1.2), Wl(-1.4, sd * 3.3, -1.5), OBSIDIAN);
  put(...Wl(2.6, sd * 1.9, -1.4), WHITE); put(...Wl(4.8, sd * 1.7, -2.1), WHITE); // fangs
  put(...Wl(6.6, sd * 0.8, -0.5), GRAY);                                         // nostril rim
}
for (let k = 0; k < 3; k++) { put(...Wl(-1.2 - k * 1.3, 0, 2.6), BLACK); put(...Wl(-1.2 - k * 1.3, 0, 3.3 - k * 0.3), OBSIDIAN); }
PRI = 1;
for (const [x, z, ymin] of headMin.values()) {
  const t0 = Math.max(top(x, z), -1);
  if (ymin - t0 > 8) continue;
  for (let y = t0 + 1; y < ymin; y++) putE(x, y, z, hsh(x, y, z) < 0.35 ? YELLOW : GOLD);
}
// coins spilling around the chin + a warm glow lighting the face
for (let k = 0; k < 14; k++) {
  const a = hsh(k, 3, 9) * Math.PI * 2, rr = 1 + hsh(k, 4, 9) * 3;
  const p = Wl(7.5 + Math.cos(a) * rr * 0.6, Math.sin(a) * rr, 0);
  putE(p[0], top(p[0], p[2]) + 1, p[2], k % 3 ? GOLD : YELLOW);
}
PRI = 2;
{ const g1 = Wl(8.6, 1.6, 0); put(g1[0], top(g1[0], g1[2]) + 1, g1[2], GLOWSTONE);
  const g2 = Wl(8.2, -2.4, 0); put(g2[0], top(g2[0], g2[2]) + 1, g2[2], GLOWSTONE); }
PRI = 3;

function limb(pts, rads, id) {
  for (let k = 0; k < pts.length - 1; k++) {
    const a = pts[k], b = pts[k + 1];
    const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * 3);
    for (let i = 0; i <= n; i++) {
      const t = i / n, r = rads[k] + (rads[k + 1] - rads[k]) * t;
      ellip(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, r, r,
        (x, y, z) => hsh(x, y, z) < 0.2 ? BRICK : id);
    }
  }
}
function paw(x, z) {
  const y = Math.max(H(x, z), 0) + 0.9;
  ellip(x, y, z, 1.6, 1.0, 1.8, scale);
  for (const o of [-1, 0, 1]) { put(x + o, R(y) - 1, z - 2, WHITE); put(x + o, R(y), z - 2, LIGHT_GRAY); }
  return [x, y, z];
}
const g = (x, z, lift) => [x, Math.max(H(x, z), 0) + lift, z];
limb([[-5.0, spine[2][1] - 1.0, 0.2], g(-7.6, -3.6, 1.8), paw(-7.6, -9.0)], [2.0, 1.5, 1.2], RED);
limb([[1.0, spine[2][1] - 1.0, 0.0], g(4.0, -3.0, 1.8), paw(5.2, -7.2)], [2.0, 1.5, 1.2], RED);
(function hind() {
  const hip = [4.4, Math.max(H(4.4, 7.6), 0) + 2.2, 7.6];
  ellip(hip[0], hip[1], hip[2], 2.6, 2.4, 3.0, scale);
  limb([hip, g(6.6, 5.4, 1.6), paw(7.2, 2.6)], [2.0, 1.4, 1.1], RED);
})();

// WINGS — folded low along the body, draped toward the ground like a blanket
const MEM = (x, y, z) => { const r = hsh(x, y, z); return r < 0.1 ? RED : (r < 0.2 ? YELLOW : ORANGE); };
function wing(sd, A, Wr, tips, L) {
  const pts = [...tips, L];
  tri(A, Wr, L, MEM);
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i], q = pts[i + 1];
    const m = [0, 1, 2].map(k => (p[k] + q[k]) / 2 * 0.8 + Wr[k] * 0.2);
    tri(Wr, p, m, MEM); tri(Wr, m, q, MEM);
  }
  pline(A, Wr, RED);
  pline([A[0], A[1] - 0.8, A[2]], [Wr[0], Wr[1] - 0.8, Wr[2]], BRICK);
  pline([A[0], A[1] + 0.6, A[2] - 0.6], [Wr[0], Wr[1] + 0.4, Wr[2] - 0.5], RED);
  for (const t of tips) { pline(Wr, t, BLACK); put(t[0], t[1], t[2], LIGHT_GRAY); }
  put(Wr[0], Wr[1] + 1, Wr[2], WHITE);
  put(Wr[0] + sd * 0.6, Wr[1] + 1.6, Wr[2] - 0.6, WHITE);
}
const gy = (x, z) => [x, Math.max(H(x, z), 0) + 1.2, z];
wing(-1, [-4.8, spine[2][1] + 1.2, 1.2], [-11.8, spine[2][1] + 2.6, 2.2],
  [gy(-18.2, -1.0), gy(-17.8, 6.0), gy(-13.8, 12.5)], [-4.6, spine[4][1] + 0.4, 8.6]);
wing(1, [1.2, spine[2][1] + 1.4, 1.2], [7.0, spine[2][1] + 3.4, 2.4],
  [[11.0, 5.6, 5.6], [8.6, 7.4, 11.2], [3.4, 9.2, 12.6]], [3.0, spine[5][1] + 2.2, 7.4]);

// Zzz — glowing so they read at night, rising from the snout toward the west
function Zl(xa, yb, zc, sz, id) {
  const tp = yb + sz - 1;
  for (let i = 0; i < sz; i++) { put(xa + i, tp, zc, id); put(xa + i, yb, zc, id); put(xa + i, tp - i, zc, id); }
}
PRI = 4;
Zl(-5, 13, -10, 3, GLOWSTONE);
Zl(-10, 17, -11, 4, GLOWSTONE);
Zl(-17, 22, -12, 5, GLOWSTONE);

PRI = 2;
(function crown(cx, cz) {
  const b = top(cx, cz) + 1;
  for (let a = 0; a < 16; a++) {
    const x = cx + 1.6 * Math.cos(a * Math.PI / 8), z = cz + 1.6 * Math.sin(a * Math.PI / 8);
    put(x, b, z, GOLD);
    if (a % 4 === 0) { put(x, b + 1, z, GOLD); put(x, b + 2, z, YELLOW); }
    if (a % 4 === 2) put(x, b, z, a % 8 === 2 ? RED : BLUE);
  }
})(-13, -6);
function sword(x, z, lean) {
  const b = Math.max(top(x, z), -1);
  for (let k = 0; k < 4; k++) put(x + lean * k * 0.25, b + 1 + k, z, IRON);
  const gy2 = b + 5, gx = x + lean;
  put(gx - 1, gy2, z, GOLD); put(gx, gy2, z, GOLD); put(gx + 1, gy2, z, GOLD);
  put(gx, gy2 + 1, z, BROWN); put(gx, gy2 + 2, z, BROWN); put(gx, gy2 + 3, z, RED);
}
sword(-14, -1, 1); sword(14, 4, -1); sword(-8, -15, 0); sword(-11, 13, 1);
function goblet(x, z) {
  const b = Math.max(top(x, z), -1);
  put(x, b + 1, z, GOLD); put(x, b + 2, z, GOLD);
  put(x - 1, b + 3, z, GOLD); put(x + 1, b + 3, z, GOLD); put(x, b + 3, z - 1, GOLD); put(x, b + 3, z + 1, GOLD);
  put(x, b + 3, z, RED);
}
goblet(-3, -16); goblet(13, -9); goblet(-9, 5); goblet(15, -1);
(function chest(x0, z0) {
  const b = 0;
  for (let x = x0 - 1; x <= x0 + 4; x++) for (let z = z0 - 2; z <= z0 + 3; z++) putE(x, -1, z, GOLD);
  for (let x = x0; x <= x0 + 3; x++) for (let z = z0; z <= z0 + 2; z++) for (let y = b; y <= b + 1; y++)
    if (x === x0 || x === x0 + 3 || z === z0 || z === z0 + 2 || y === b) put(x, y, z, BROWN);
  for (let x = x0 + 1; x <= x0 + 2; x++) { put(x, b + 1, z0 + 1, GOLD); put(x, b + 2, z0 + 1, x === x0 + 1 ? GOLD : YELLOW); }
  for (let x = x0; x <= x0 + 3; x++) { put(x, b + 2, z0 + 3, BROWN); put(x, b + 3, z0 + 3, BROWN); }
  put(x0, b + 1, z0, GOLD); put(x0 + 3, b + 1, z0, GOLD); put(x0 + 1, b + 1, z0, IRON); put(x0 + 2, b + 3, z0 + 3, GOLD);
  for (let k = 0; k < 4; k++) put(x0 + 1 + k * 0.4, 0, z0 - 1 - k * 0.6, k % 2 ? YELLOW : GOLD);
})(3, -20);
(function shield(cx, cy, cz) {
  for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) {
    const d = Math.hypot(x, y);
    if (d > 2.3) continue;
    put(cx + x, cy + y, cz + (y > 0 ? 1 : 0), d > 1.6 ? GOLD : (d < 0.5 ? IRON : BLUE));
  }
})(17, 2, -5);
(function bones(x, z) {
  put(x, 0, z, WHITE); put(x, 1, z, WHITE); put(x + 1, 0, z, BLACK);
  put(x - 1, 0, z + 1, IRON); put(x - 1, 1, z + 1, IRON); put(x - 2, 0, z + 1, IRON);
  pline([x + 1, 0, z + 1], [x + 3, 0, z + 2], WHITE); pline([x, 0, z + 2], [x + 1, 0, z + 4], WHITE);
  pline([x + 2, 0, z - 1], [x + 5, 0, z - 2], IRON); put(x + 1, 0, z - 1, GOLD);
})(-15, -14);
for (const [bx, bz] of [[-17, -11], [18, -11], [-16, 13], [16, 14]]) {
  for (let y = -1; y <= 2; y++) put(bx, y, bz, y <= 0 ? COBBLE : STONE);
  put(bx, 3, bz, GOLD); put(bx - 1, 3, bz, GOLD); put(bx + 1, 3, bz, GOLD); put(bx, 3, bz - 1, GOLD); put(bx, 3, bz + 1, GOLD);
  put(bx, 4, bz, FIRE);
}
PRI = 3;

const out = [];
const nb = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, -1]];
for (const v of M.values()) {
  const [x, y, z, id] = v;
  if (id === AIR) continue;
  if (id === FIRE) { out.push(v); continue; }
  let exposed = false;
  for (const [a, b, c] of nb) {
    const n = M.get(key(x + a, y + b, z + c));
    if (!n || n[3] === AIR || n[3] === FIRE) { exposed = true; break; }
  }
  if (!exposed && y > 0) { const n = M.get(key(x, y - 1, z)); if (!n || n[3] === AIR || n[3] === FIRE) exposed = true; }
  if (exposed) out.push(v);
}
if (out.length > 3990) { out.sort((p, q) => q[4] - p[4]); out.length = 3990; }
out.sort((p, q) => p[1] - q[1]);
for (const [x, y, z, id] of out) block(x, y, z, id);