// dragon-fire-opus — prompt:
// a dragon breathing fire...

const V = new Map();
const key = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id, pr) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  V.set(key(x, y, z), { id: id, pr: pr || 1 });
}
function putIfEmpty(x, y, z, id, pr) {
  if (!V.has(key(Math.round(x), Math.round(y), Math.round(z)))) put(x, y, z, id, pr);
}
function del(x, y, z) { V.delete(key(Math.round(x), Math.round(y), Math.round(z))); }
function hash(x, y, z) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967296;
}
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vlen = (a) => Math.sqrt(dot(a, a));
const vnorm = (a) => { const l = vlen(a) || 1; return mul(a, 1 / l); };
const vcross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const UP = [0, 1, 0];

function tube(pts, colorFn, pr) {
  const samples = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const d = sub(b.p, a.p), L = vlen(d), n = Math.max(1, Math.ceil(L / 0.4));
    const T = vnorm(d);
    let D = sub(UP, mul(T, dot(T, UP)));
    D = vlen(D) < 0.1 ? [0, 0, 1] : vnorm(D);
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      samples.push({ c: add(a.p, mul(d, t)), r: a.r + (b.r - a.r) * t, T: T, D: D });
    }
  }
  const best = new Map();
  for (const s of samples) {
    const Rr = Math.ceil(s.r + 1);
    const cx = Math.round(s.c[0]), cy = Math.round(s.c[1]), cz = Math.round(s.c[2]);
    for (let x = cx - Rr; x <= cx + Rr; x++)
      for (let y = cy - Rr; y <= cy + Rr; y++)
        for (let z = cz - Rr; z <= cz + Rr; z++) {
          const o = [x - s.c[0], y - s.c[1], z - s.c[2]];
          const sc = vlen(o) / s.r;
          if (sc > 1) continue;
          const k = key(x, y, z), cur = best.get(k);
          if (!cur || sc < cur.sc) best.set(k, { x: x, y: y, z: z, sc: sc, s: s, o: o });
        }
  }
  for (const v of best.values()) {
    const id = colorFn(v);
    if (id !== null) put(v.x, v.y, v.z, id, pr);
  }
}
function line3(a, b, id, pr) {
  const d = sub(b, a), n = Math.max(1, Math.ceil(vlen(d) / 0.3));
  for (let i = 0; i <= n; i++) { const p = add(a, mul(d, i / n)); put(p[0], p[1], p[2], id, pr); }
}
const SP = (x, y, z, r) => ({ p: [x, y, z], r: r });

function scaleColor(v) {
  const dd = dot(v.o, v.s.D);
  if (dd < -0.4 * v.s.r) return (Math.floor((v.y + v.z) / 2) & 1) ? YELLOW : ORANGE;
  if (dd > 0.8 * v.s.r) return BRICK;
  return hash(v.x, v.y, v.z) < 0.14 ? BRICK : RED;
}
const limbColor = (v) => (hash(v.x, v.y, v.z) < 0.18 ? BRICK : RED);

// ===== 0. Clear trees from the stage =====
cube(-22, 2, -22, 22, 9, 12, AIR);
cube(-22, 1, -16, 22, 1, 12, AIR);

// ===== 1. Rocky plateau =====
function moundH(x, z) {
  const d2 = (x / 11) * (x / 11) + ((z - 4) / 12) * ((z - 4) / 12);
  if (d2 >= 1) return -99;
  const h = -2 + 7 * Math.sqrt(1 - d2) + (hash(x, 7, z) - 0.5) * 1.8;
  return Math.min(3, Math.floor(h));
}
for (let x = -11; x <= 11; x++)
  for (let z = -8; z <= 16; z++) {
    const h = moundH(x, z);
    for (let y = 0; y <= h; y++) {
      const r = hash(x, y, z);
      put(x, y, z, r < 0.55 ? STONE : r < 0.85 ? COBBLE : GRAY, 3);
    }
  }
function rockUnder(fx, fz) {
  for (let dx = -1; dx <= 1; dx++)
    for (let dz = -1; dz <= 1; dz++) {
      const x = Math.round(fx) + dx, z = Math.round(fz) + dz;
      for (let y = Math.max(0, moundH(x, z) + 1); y <= 3; y++) put(x, y, z, COBBLE, 3);
    }
}

// ===== 2. Dragon body =====
const spine = [
  SP(-1.8, 22, -6.2, 1.9),
  SP(-1.2, 20.5, -4.8, 2.0),
  SP(-0.5, 18, -3.3, 2.2),
  SP(0, 15.5, -1.8, 2.5),
  SP(0, 13.2, 0, 3.0),
  SP(0, 11.5, 2.5, 3.6),
  SP(1, 10.3, 6, 4.0),
  SP(2, 9.6, 10, 3.6),
  SP(3, 8, 13, 2.8),
  SP(5, 6, 16, 2.2),
  SP(8, 3.5, 18, 1.7),
  SP(12, 1.8, 18.5, 1.3),
  SP(15, 1.2, 16, 1.0),
  SP(17, 1.2, 12.5, 0.8),
  SP(17.5, 1.8, 9.5, 0.6),
];
tube(spine, scaleColor, 1);

(function () {
  let acc = 0;
  for (let i = 0; i < spine.length - 2; i++) {
    const a = spine[i], b = spine[i + 1], d = sub(b.p, a.p), L = vlen(d), T = vnorm(d);
    const D = vnorm(sub(UP, mul(T, dot(T, UP))));
    for (let s = 0; s < L; s += 0.25) {
      acc += 0.25;
      if (acc < 1.6) continue;
      acc = 0;
      const t = s / L, c = add(a.p, mul(d, t)), r = a.r + (b.r - a.r) * t;
      const base = add(c, mul(D, r - 0.4));
      const tip = add(add(c, mul(D, r + 0.9 + 0.4 * r)), mul(T, 0.8));
      line3(base, tip, OBSIDIAN, 1);
    }
  }
})();
[[0, 1], [1, 2], [2, 2], [3, 1], [4, 0]].forEach(([k, w]) => {
  for (let dy = -w; dy <= w; dy++) put(17.5, 2 + dy, 8.5 - k, OBSIDIAN, 1);
});

// ===== 3. Legs =====
function claws(foot, dir) {
  const side = vnorm(vcross(dir, UP));
  for (const s of [-1, 0, 1]) {
    const b = add(foot, mul(side, s));
    line3(b, add(add(b, mul(dir, 1.8)), [0, -0.4, 0]), WHITE, 1);
  }
}
tube([SP(3, 10.5, 2, 1.9), SP(4.5, 7.5, 0, 1.5), SP(4.5, 5.3, -1.5, 1.2), SP(4.5, 4.4, -2.5, 1.1)], limbColor, 1);
claws([4.5, 4, -3.2], [0, 0, -1]);
rockUnder(4.5, -2.5);
tube([SP(-3, 11, 1.5, 1.9), SP(-5.5, 9.8, -1, 1.5), SP(-6, 11, -3.5, 1.2), SP(-6.5, 12, -4.5, 1.0)], limbColor, 1);
line3([-7.2, 12.2, -5], [-8, 13.2, -6.6], WHITE, 1);
line3([-6.5, 12.6, -5.2], [-6.7, 13.8, -6.8], WHITE, 1);
line3([-5.8, 12.2, -5], [-5.2, 13.2, -6.6], WHITE, 1);
for (const sx of [-1, 1]) {
  tube([SP(sx * 3.8, 9.2, 10, 2.5), SP(sx * 5, 7, 7.5, 1.9), SP(sx * 5.3, 5.5, 11, 1.3), SP(sx * 5.3, 4.4, 9.5, 1.1)], limbColor, 1);
  claws([sx * 5.3, 4, 8.8], [0, 0, -1]);
  rockUnder(sx * 5.3, 9.5);
}

// ===== 4. Wings =====
function membrane(A, B, C, depth, id, holes) {
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const w = i / N;
    const edge = add(B, mul(sub(C, B), w));
    const lim = 1 - depth * Math.sin(Math.PI * w);
    for (let j = 0; j <= N; j++) {
      const s = j / N;
      if (s > lim) break;
      const p = add(A, mul(sub(edge, A), s));
      const x = Math.round(p[0]), y = Math.round(p[1]), z = Math.round(p[2]);
      if (holes && s > 0.55 && hash(x, y, z) < 0.05) continue;
      putIfEmpty(x, y, z, id, 2);
    }
  }
}
function wing(S, E, W, tips, hip) {
  tube([SP(S[0], S[1], S[2], 1.3), SP(E[0], E[1], E[2], 1.0), SP(W[0], W[1], W[2], 0.8)], limbColor, 1);
  for (const t of tips) line3(W, t, RED, 1);
  line3(W, add(W, [0, 1.8, -0.8]), WHITE, 1);
  for (const t of tips) put(t[0], t[1], t[2], WHITE, 1);
  membrane(W, tips[0], tips[1], 0.22, BRICK, true);
  membrane(W, tips[1], tips[2], 0.2, BRICK, true);
  membrane(W, tips[2], tips[3], 0.18, BRICK, true);
  membrane(tips[3], W, E, 0, BRICK, false);
  membrane(tips[3], E, S, 0, BRICK, false);
  membrane(S, tips[3], hip, 0.15, BRICK, false);
}
wing([3, 13.5, 4], [8, 18, 6], [12, 24, 7],
  [[19, 30, 9], [22, 23, 11], [21, 16, 12], [16, 11, 11]], [3, 11, 10]);
wing([-3, 13.5, 4], [-8, 19, 5.5], [-12.5, 25, 7],
  [[-18, 31, 8], [-22, 25, 10], [-21, 17, 12], [-15, 11.5, 12]], [-3, 11, 10]);

// ===== 5. Head =====
const H = [-2.5, 22.5, -7.8];
const F = vnorm([-0.45, -0.6, -0.66]);
const U = vnorm(sub(UP, mul(F, dot(F, UP))));
const Rt = vnorm(vcross(F, U));
const at = (f, u, r) => add(H, add(mul(F, f), add(mul(U, u), mul(Rt, r))));
function headColor(v) {
  if (dot(v.o, U) < -0.55 * v.s.r) return ORANGE;
  return hash(v.x, v.y, v.z) < 0.12 ? BRICK : RED;
}
tube([{ p: at(-0.8, 0.3, 0), r: 2.5 }, { p: at(1.5, 0.3, 0), r: 2.3 }], headColor, 1);
tube([{ p: at(1.5, 0.3, 0), r: 2.1 }, { p: at(4, 0.1, 0), r: 1.7 }, { p: at(6.5, 0, 0), r: 1.3 }], headColor, 1);
const J = at(0.3, -1.4, 0);
const Dj = vnorm(sub(F, mul(U, 0.6)));
const jawAt = (s, u, r) => add(add(J, mul(Dj, s)), add(mul(U, u), mul(Rt, r)));
tube([{ p: J, r: 1.4 }, { p: jawAt(3, 0, 0), r: 1.1 }, { p: jawAt(5.5, 0, 0), r: 0.85 }],
  (v) => (dot(v.o, U) < -0.3 * v.s.r ? ORANGE : RED), 1);
line3(at(1.5, -1.7, 0), at(4.5, -2.4, 0), LAVA, 1);
for (let f = 2.5; f <= 6.2; f += 0.9)
  for (const s of [-1, 1]) put(...at(f, -1.45, s * (1.3 - f * 0.06)), WHITE, 1);
for (let sj = 2.2; sj <= 5.2; sj += 1)
  for (const s of [-1, 1]) put(...jawAt(sj, 1.0, s * 0.75), WHITE, 1);
for (const s of [-1, 1]) {
  put(...at(2.0, 1.2, s * 1.9), GLOWSTONE, 1);
  put(...at(2.6, 1.1, s * 1.8), GLOWSTONE, 1);
  line3(at(1.0, 2.2, s * 1.9), at(3.2, 1.9, s * 1.6), OBSIDIAN, 1);
  put(...at(6.3, 1.2, s * 0.7), BLACK, 1);
  tube([{ p: at(-0.8, 2.0, s * 1.3), r: 0.9 }, { p: at(-4.2, 4.2, s * 2.4), r: 0.7 }], () => LIGHT_GRAY, 1);
  line3(at(-4.2, 4.2, s * 2.4), at(-5.6, 6.6, s * 2.8), WHITE, 1);
  line3(at(-0.5, -0.8, s * 2.1), at(-3.4, -0.6, s * 3.3), OBSIDIAN, 1);
  line3(at(0.5, -1.8, s * 1.6), at(-2.2, -2.6, s * 2.8), OBSIDIAN, 1);
}

// ===== 6. Burning cottage =====
for (let x = -20; x <= -13; x++)
  for (let z = -19; z <= -14; z++)
    for (let y = 0; y <= 1; y++) put(x, y, z, hash(x, y, z) < 0.3 ? STONE : COBBLE, 3);
for (let y = 2; y <= 5; y++) {
  for (let x = -20; x <= -13; x++) { put(x, y, -19, PLANKS, 3); put(x, y, -14, PLANKS, 3); }
  for (let z = -19; z <= -14; z++) { put(-20, y, z, PLANKS, 3); put(-13, y, z, PLANKS, 3); }
}
for (const x of [-20, -13]) for (const z of [-19, -14]) for (let y = 2; y <= 5; y++) put(x, y, z, OAK_LOG, 3);
for (let x = -20; x <= -13; x++) { put(x, 5, -19, OAK_LOG, 3); put(x, 5, -14, OAK_LOG, 3); }
del(-18, 2, -19); del(-18, 3, -19);
for (const x of [-15, -14]) { del(x, 3, -19); del(x, 4, -19); }
del(-20, 3, -17); del(-20, 4, -17); del(-20, 3, -16); del(-20, 4, -16);
[[-18, 2, -18], [-17, 2, -17], [-15, 2, -18], [-14, 3, -18], [-15, 3, -17], [-19, 2, -16], [-19, 3, -17]]
  .forEach((p) => put(p[0], p[1], p[2], LAVA, 3));
for (let k = 0; k < 2; k++)
  for (let z = -18 + k; z <= -15 - k; z++) { put(-20, 6 + k, z, PLANKS, 3); put(-13, 6 + k, z, PLANKS, 3); }
const roofFire = [];
for (let k = 0; k <= 3; k++)
  for (let x = -21; x <= -12; x++)
    for (const z of [-20 + k, -19 + k, -13 - k, -14 - k]) {
      const y = 6 + k, r = hash(x, y, z);
      const north = z < -16;
      if (x > -21 && x < -12 && r < (north ? 0.2 : 0.08)) { roofFire.push([x, y, z]); continue; }
      put(x, y, z, r < (north ? 0.45 : 0.22) ? BLACK : BRICK, 3);
    }
for (let y = 6; y <= 10; y++) put(-14, y, -16, COBBLE, 3);

// ===== 7. Fire breath =====
const M = at(6.2, -2.3, 0);
const B1 = add(M, mul(F, 7));
const TGT = [-15, 8.5, -18];
const bez = (t) => add(add(mul(M, (1 - t) * (1 - t)), mul(B1, 2 * t * (1 - t))), mul(TGT, t * t));
const flameR = (t) => 0.7 + 2.0 * Math.pow(t, 0.8);
const flame = [];
for (let t = 0; t <= 1.0001; t += 0.02) {
  const c = bez(t);
  const wob = [Math.sin(t * 17) * 0.5 * t, Math.cos(t * 13) * 0.4 * t, Math.sin(t * 11 + 1) * 0.5 * t];
  flame.push({ c: add(c, wob), r: flameR(t) * (1 + 0.18 * Math.sin(t * 26)), t: t });
}
(function () {
  const best = new Map();
  for (const s of flame) {
    const Rr = Math.ceil(s.r + 1);
    const cx = Math.round(s.c[0]), cy = Math.round(s.c[1]), cz = Math.round(s.c[2]);
    for (let x = cx - Rr; x <= cx + Rr; x++)
      for (let y = cy - Rr; y <= cy + Rr; y++)
        for (let z = cz - Rr; z <= cz + Rr; z++) {
          const sc = vlen([x - s.c[0], y - s.c[1], z - s.c[2]]) / s.r;
          if (sc > 1) continue;
          const k = key(x, y, z), cur = best.get(k);
          if (!cur || sc < cur.sc) best.set(k, { x: x, y: y, z: z, sc: sc, t: s.t });
        }
  }
  for (const v of best.values()) {
    const h = hash(v.x, v.y, v.z);
    let id;
    if (v.sc < 0.35) id = v.t < 0.45 ? GLOWSTONE : LAVA;
    else if (v.sc < 0.7) id = h < 0.6 ? LAVA : YELLOW;
    else {
      if (h < 0.33) continue;
      id = h < 0.68 ? ORANGE : h < 0.86 ? YELLOW : RED;
    }
    put(v.x, v.y, v.z, id, 1);
  }
})();
[[-17, 8, -18, 1.4], [-13, 7, -18, 1.2], [-19, 7, -17, 1.0]].forEach(([x, y, z, r]) => {
  for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) for (let dz = -2; dz <= 2; dz++)
    if (dx * dx + dy * dy + dz * dz <= r * r && hash(x + dx, y + dy, z + dz) < 0.7)
      put(x + dx, y + dy, z + dz, hash(dz, dx, dy) < 0.5 ? LAVA : ORANGE, 1);
});

// ===== 8. Knight with raised shield =====
const kx = -7, kz = -18;
put(kx, 2, kz - 1, IRON, 2); put(kx, 3, kz - 1, IRON, 2);
put(kx, 1, kz + 1, IRON, 2); put(kx, 2, kz + 1, IRON, 2); put(kx, 3, kz + 1, IRON, 2);
for (let y = 4; y <= 6; y++) for (let z = kz - 1; z <= kz + 1; z++) put(kx, y, z, IRON, 2);
put(kx, 4, kz, RED, 2); put(kx, 5, kz, RED, 2);
put(kx, 7, kz, IRON, 2); put(kx + 1, 7, kz, BLACK, 2);
put(kx, 8, kz, RED, 2); put(kx - 1, 8, kz, RED, 2);
for (let y = 4; y <= 7; y++) for (let z = kz - 2; z <= kz; z++)
  put(kx + 2, y, z, (y === 5 || y === 6) && z === kz - 1 ? RED : GOLD, 2);
put(kx + 1, 5, kz - 1, IRON, 2);
put(kx, 6, kz + 2, IRON, 2);
line3([kx, 7, kz + 2], [kx, 11, kz + 2], IRON, 2);
line3([kx, 7, kz + 1], [kx, 7, kz + 3], GOLD, 2);

// ===== 9. Charred burning tree =====
const tx = -11, tz = -9;
for (let y = 1; y <= 6; y++) put(tx, y, tz, y < 3 ? OAK_LOG : BLACK, 3);
line3([tx, 4, tz], [tx - 2, 6, tz - 1], BLACK, 3);
line3([tx, 5, tz], [tx + 2, 7, tz + 1], BLACK, 3);
line3([tx, 6, tz], [tx, 8, tz - 1], BLACK, 3);

// ===== 10. Hoard, chest, bones =====
for (let x = -9; x <= 9; x++)
  for (let z = -6; z <= 14; z++) {
    if (moundH(x, z) !== 3) continue;
    const h = hash(x, 11, z);
    if (h < 0.2) putIfEmpty(x, 4, z, GOLD, 4);
    if (h < 0.05) putIfEmpty(x, 5, z, GOLD, 4);
  }
for (const x of [-3, -2]) { put(x, 4, -3, BROWN, 4); put(x, 5, -3, BROWN, 4); }
put(-3, 5, -4, GOLD, 4);
[[5, 3], [4, 4], [5, 5], [6, 6], [-7, 6], [-8, 4], [-8, 5], [-8, 7]].forEach(([x, z]) => {
  const h = moundH(x, z);
  if (h >= 0) putIfEmpty(x, h + 1, z, WHITE, 4);
});

for (let x = -19; x <= -8; x++)
  for (let z = -22; z <= -10; z++) {
    if (x >= -20 && x <= -13 && z >= -19 && z <= -14) continue;
    const h = hash(x, 3, z);
    if (h < 0.18) putIfEmpty(x, 0, z, h < 0.06 ? LAVA : BLACK, 5);
  }

// ===== 11. FIRE effect cells =====
const fires = [];
for (const t of [0.3, 0.45, 0.6, 0.72, 0.84, 0.96]) {
  const c = bez(t);
  fires.push([c[0], c[1] + flameR(t) + 0.8, c[2]]);
}
for (const s of [-1, 1]) fires.push(at(6.5, 2.4, s * 0.8));
roofFire.slice(0, 8).forEach((p) => fires.push(p));
fires.push([-14, 11, -16]);
fires.push([tx - 2, 7, tz - 1], [tx + 2, 8, tz + 1], [tx, 9, tz - 1]);
fires.push([-17, 1, -21], [-10, 1, -15], [-9, 1, -13]);

// ===== Emit: cull hidden interior, highest priority first =====
const seeThrough = new Set([GLASS, ICE, WATER, LEAVES]);
function opaqueAt(x, y, z) {
  if (y < 0) return true;
  const v = V.get(key(x, y, z));
  return !!v && !seeThrough.has(v.id);
}
const out = [];
for (const [k, v] of V) {
  const c = k.split(',').map(Number);
  const x = c[0], y = c[1], z = c[2];
  if (opaqueAt(x + 1, y, z) && opaqueAt(x - 1, y, z) && opaqueAt(x, y + 1, z) &&
      opaqueAt(x, y - 1, z) && opaqueAt(x, y, z + 1) && opaqueAt(x, y, z - 1)) continue;
  out.push([x, y, z, v.id, v.pr]);
}
out.sort((a, b) => a[4] - b[4]);
const LIMIT = 3960;
for (let i = 0; i < out.length && i < LIMIT; i++) block(out[i][0], out[i][1], out[i][2], out[i][3]);
let nf = 0;
for (const f of fires) {
  if (nf >= 36) break;
  const x = Math.round(f[0]), y = Math.round(f[1]), z = Math.round(f[2]);
  if (V.has(key(x, y, z))) continue;
  block(x, y, z, FIRE); nf++;
}