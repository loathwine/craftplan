// thor-opus — prompt:
// Thor summoning lightning...

cube(-16, 1, -22, 16, 10, 12, AIR);

const M = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(K(x, y, z), [x, y, z, id]);
}
function putIfEmpty(x, y, z, id) {
  if (!M.has(K(Math.round(x), Math.round(y), Math.round(z)))) put(x, y, z, id);
}
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function h3(x, y, z) {
  let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}
function seg(a, b, id) {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]))));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    put(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, id);
  }
}
const sparks = [];
const fires = [];

// ---------------- Rocky outcrop plinth ----------------
const P = new Map();
for (let x = -12; x <= 12; x++) for (let z = -10; z <= 13; z++) {
  const r = Math.sqrt(x * x + (z - 1) * (z - 1) * 1.1) + (h3(x, 7, z) - 0.5) * 1.8;
  let top;
  if (r < 5.5 || (Math.abs(x) <= 5 && z >= -4 && z <= 3)) top = 1;
  else if (r < 7.8) top = h3(x, 3, z) > 0.85 ? 1 : 0;
  else if (r < 10.5) top = h3(x, 5, z) > 0.9 ? 0 : -1;
  else continue;
  for (let y = -3; y <= top; y++) P.set(K(x, y, z), [x, y, z, top, r]);
}
for (const [k, c] of P) {
  const [x, y, z, top, r] = c;
  const up = P.has(K(x, y + 1, z));
  const exposed = !up || !P.has(K(x + 1, y, z)) || !P.has(K(x - 1, y, z)) || !P.has(K(x, y, z + 1)) || !P.has(K(x, y, z - 1));
  if (!exposed || y < -2) continue;
  const h = h3(x, y, z);
  let id;
  if (!up) {
    if (r < 5.5) id = h < 0.18 ? OBSIDIAN : h < 0.45 ? COBBLE : STONE;
    else id = h < 0.1 ? OBSIDIAN : h < 0.45 ? GRAY : h < 0.8 ? STONE : COBBLE;
  } else id = h < 0.5 ? COBBLE : h < 0.85 ? STONE : GRAY;
  put(x, y, z, id);
}
// glowing rune ring inlaid in the summit
for (let i = 0; i < 12; i++) {
  const a = i / 12 * Math.PI * 2;
  put(Math.round(Math.cos(a) * 4.2), 1, 1 + Math.round(Math.sin(a) * 3.8), i % 2 ? NEON_BLUE : OBSIDIAN);
}

// ---------------- Standing stones ----------------
const stones = [[-13, -5, 5], [-15, 5, 7], [-8, 12, 5], [7, 12, 7], [14, 4, 6], [12, -6, 4]];
for (const [sx, sz, sh] of stones) {
  for (let x = sx; x <= sx + 1; x++) for (let z = sz; z <= sz + 1; z++) {
    const top = -1 + sh - (h3(x, 1, z) > 0.6 ? 1 : 0);
    for (let y = -2; y <= top; y++) {
      const h = h3(x, y, z);
      put(x, y, z, y < 1 && h < 0.2 ? LEAVES : h < 0.3 ? COBBLE : h < 0.4 ? GRAY : STONE);
    }
  }
  put(sx, Math.floor(sh / 2), sz, NEON_BLUE);
  put(sx + 1, Math.floor(sh / 2) + 1, sz, NEON_BLUE);
}
// toppled stone
box(-18, -1, -9, -15, 0, -8, COBBLE); put(-16, 0, -9, LEAVES); put(-15, 0, -8, NEON_BLUE);

// ---------------- Lightning craters ----------------
function crater(cx, cy, cz) {
  for (let x = -4; x <= 4; x++) for (let z = -4; z <= 4; z++) {
    const d = Math.sqrt(x * x + z * z) + (h3(cx + x, 9, cz + z) - 0.5);
    if (d < 2.2) { cube(cx + x, cy, cz + z, cx + x, cy + 1, cz + z, AIR); put(cx + x, cy - 1, cz + z, OBSIDIAN); }
    else if (d < 3.6) put(cx + x, cy, cz + z, h3(x, cz, z) < 0.5 ? BLACK : OBSIDIAN);
    else if (d < 4.3 && h3(x, 2, z) < 0.5) put(cx + x, cy, cz + z, GRAY);
  }
  put(cx, cy - 1, cz, LAVA); put(cx + 1, cy - 1, cz, LAVA);
  put(cx, cy - 2, cz, LAVA);
  sparks.push([cx - 1, cy, cz], [cx + 1, cy + 1, cz - 1]);
  put(cx + 3, cy + 1, cz - 2, COBBLE); put(cx - 3, cy + 1, cz + 1, STONE); put(cx + 2, cy + 1, cz + 3, GRAY);
  fires.push([cx - 1, cy, cz + 1], [cx + 2, cy + 1, cz - 1], [cx - 3, cy + 1, cz - 2]);
}
crater(-9, 0, -12);
crater(11, 0, -13);

// ---------------- THOR ----------------
const F = 2;
// legs & boots
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -4 : 2, x2 = s < 0 ? -2 : 4;
  box(x1, F, -1, x2, F + 8, 1, GRAY);
  box(x1, F, -2, x2, F + 2, 1, BLACK);
  box(x1, F, -3, x2, F, -3, BLACK);             // toe caps
  box(x1, F + 1, -2, x2, F + 1, -2, BROWN);      // lace strap
  box(x1, F + 3, -2, x2, F + 5, -2, BLACK);      // greave
  box(x1, F + 3, -2, x2, F + 3, 1, IRON);        // boot cuff
  box(x1, F + 6, -2, x2, F + 6, -2, GRAY);
  put(x1 + 1, F + 6, -2, IRON);                  // knee guard
}
box(-4, F + 7, -1, 4, F + 8, 1, GRAY);           // hips
// armored tassets
box(-4, F + 6, -2, -1, F + 8, -2, BLACK); box(1, F + 6, -2, 4, F + 8, -2, BLACK);
box(-4, F + 6, 2, 4, F + 8, 2, BLACK);
put(-3, F + 7, -2, IRON); put(3, F + 7, -2, IRON);
// belt
box(-4, F + 9, -2, 4, F + 9, 2, BROWN);
box(-1, F + 9, -3, 1, F + 9, -3, GOLD);
put(-4, F + 8, -3, BROWN);                        // pouch
// torso
box(-4, F + 10, -2, 4, F + 17, 2, BLACK);
box(-3, F + 11, -3, 3, F + 16, -3, GRAY);         // chest plate
box(0, F + 11, -3, 0, F + 16, -3, BLACK);         // seam
for (const [x1, x2] of [[-3, -2], [2, 3]]) for (const y1 of [F + 11, F + 14]) box(x1, y1, -3, x2, y1 + 1, -3, IRON);
put(-1, F + 13, -3, IRON); put(1, F + 13, -3, IRON);
box(-5, F + 13, -2, -5, F + 14, 2, BLACK); box(5, F + 13, -2, 5, F + 14, 2, BLACK);
// pauldrons
box(-6, F + 15, -2, -4, F + 17, 2, IRON); box(-5, F + 18, -1, -4, F + 18, 1, IRON);
box(4, F + 15, -2, 6, F + 17, 2, IRON); box(4, F + 18, -1, 6, F + 18, 1, IRON);
box(-6, F + 15, -2, -6, F + 15, 2, GRAY); box(6, F + 15, -2, 6, F + 15, 2, GRAY);
put(-4, F + 16, -3, GOLD); put(4, F + 16, -3, GOLD);   // cape clasps

// left arm hangs, fist clenched and crackling
box(-7, F + 11, -1, -6, F + 14, 0, SAND);
box(-8, F + 7, -1, -7, F + 10, 0, BLACK);
box(-8, F + 10, -1, -7, F + 10, 0, IRON);
box(-8, F + 7, -2, -7, F + 7, -2, IRON);
box(-9, F + 5, -2, -7, F + 6, 0, SAND);
put(-8, F + 6, -3, SAND);
// right arm raised skyward
box(5, F + 19, -1, 6, F + 22, 0, SAND);
box(5, F + 20, -2, 6, F + 21, -2, SAND);           // bicep
box(5, F + 23, -1, 6, F + 25, 0, BLACK);           // bracer
box(5, F + 23, -2, 6, F + 23, -2, IRON);
box(5, F + 25, -2, 6, F + 25, -2, IRON);
box(5, F + 26, -2, 7, F + 27, 0, SAND);            // fist
put(7, F + 26, -3, SAND);
// Mjolnir
put(6, F + 28, -1, BROWN);
put(7, F + 24, -1, BROWN); put(7, F + 23, -2, BROWN); put(7, F + 22, -2, BROWN); // wrist strap
box(3, F + 29, -2, 9, F + 31, 0, GRAY);
box(3, F + 29, -2, 3, F + 31, 0, IRON); box(9, F + 29, -2, 9, F + 31, 0, IRON);
box(4, F + 29, -2, 4, F + 31, -2, IRON); box(8, F + 29, -2, 8, F + 31, -2, IRON);
put(5, F + 30, -2, LIGHT_GRAY); put(7, F + 30, -2, LIGHT_GRAY);
put(6, F + 29, -2, LIGHT_GRAY); put(6, F + 31, -2, LIGHT_GRAY);
put(6, F + 30, -2, NEON_BLUE);

// head
box(-2, F + 18, -2, 2, F + 22, 2, SAND);
put(-1, F + 20, -2, NEON_BLUE); put(1, F + 20, -2, NEON_BLUE);   // lightning eyes
box(-2, F + 21, -3, -1, F + 21, -3, YELLOW); box(1, F + 21, -3, 2, F + 21, -3, YELLOW);
put(0, F + 19, -3, SAND);                                        // nose
box(-2, F + 18, -3, 2, F + 18, -3, YELLOW);                     // moustache
put(0, F + 18, -3, BLACK);                                       // roaring mouth
box(-2, F + 16, -3, 2, F + 17, -3, YELLOW);                     // beard
put(0, F + 17, -3, BLACK);
box(-1, F + 15, -4, 1, F + 16, -4, YELLOW);                     // beard jut
put(-2, F + 16, -3, ORANGE); put(1, F + 15, -4, ORANGE); put(2, F + 17, -3, ORANGE);
for (const s of [-1, 1]) {
  box(3 * s, F + 16, -1, 3 * s, F + 22, 3, YELLOW);             // hair sides
  box(3 * s, F + 17, -2, 3 * s, F + 20, -2, YELLOW);            // sideburns
}
box(-3, F + 17, 3, 3, F + 22, 3, YELLOW);                       // hair back
box(-2, F + 14, 4, 3, F + 20, 4, YELLOW);                       // wind-blown locks
box(0, F + 13, 5, 3, F + 17, 5, YELLOW);
put(4, F + 16, 5, YELLOW); put(4, F + 15, 6, YELLOW); put(-1, F + 15, 4, ORANGE);
// winged helmet
box(-3, F + 22, -3, 3, F + 23, 3, IRON);
box(-2, F + 24, -2, 2, F + 24, 2, IRON);
put(0, F + 25, 0, IRON);
box(-3, F + 22, -3, 3, F + 22, -3, GRAY);
put(0, F + 21, -3, IRON);                                        // nasal guard
const wing = [[4, 0, 0], [4, 1, 0], [4, 1, 1], [4, 2, 1], [5, 2, 1], [5, 3, 2], [5, 2, 2], [5, 4, 3], [5, 3, 3], [6, 5, 4], [6, 4, 4], [6, 6, 5], [6, 5, 5], [5, 1, 2], [5, 2, 3]];
for (const s of [-1, 1]) wing.forEach(([dx, dy, dz], i) => put(dx * s, F + 22 + dy, dz, i > 10 ? LIGHT_GRAY : WHITE));

// billowing cape
const capeTop = F + 16, capeBot = F + 1;
const capeZ = (x, y) => {
  const t = (capeTop - y) / (capeTop - capeBot);
  return 3 + Math.round(t * t * 6 + Math.sin(x * 0.7 + y * 0.4) * t * 1.3);
};
for (let y = capeTop; y >= capeBot; y--) {
  const t = (capeTop - y) / (capeTop - capeBot);
  const w = 4 + Math.round(t * 3), sx = Math.round(t * 4);
  for (let x = -w + sx; x <= w + sx; x++) {
    if (y === capeBot && h3(x, y, 1) < 0.4) continue;           // tattered hem
    const z = capeZ(x, y), za = y < capeTop ? capeZ(x, y + 1) : z;
    for (let zz = Math.min(z, za); zz <= Math.max(z, za); zz++) putIfEmpty(x, y, zz, RED);
  }
}

// ---------------- Lightning ----------------
function bolt(a, b, n, jit, seed, branchP) {
  let s = seed >>> 0;
  const r = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const pts = [a];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    pts.push([a[0] + (b[0] - a[0]) * t + (r() - 0.5) * 2 * jit, a[1] + (b[1] - a[1]) * t + (r() - 0.5) * jit * 0.5, a[2] + (b[2] - a[2]) * t + (r() - 0.5) * 2 * jit]);
  }
  pts.push(b);
  for (let i = 0; i < pts.length - 1; i++) seg(pts[i], pts[i + 1], NEON_BLUE);
  for (let i = 1; i < pts.length - 1; i++) {
    if (r() < branchP) {
      const p = pts[i];
      const q = [p[0] + (r() - 0.5) * 9, p[1] - 2 - r() * 4, p[2] + (r() - 0.5) * 7];
      const m = [(p[0] + q[0]) / 2 + (r() - 0.5) * 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2 + (r() - 0.5) * 2];
      seg(p, m, NEON_BLUE); seg(m, q, NEON_BLUE);
      sparks.push([q[0], q[1] - 1, q[2]]);
    }
    if (i % 3 === 0) sparks.push([pts[i][0], pts[i][1], pts[i][2] - 1]);
  }
}
// bolts converging on Mjolnir
bolt([-11, 27, 2], [2, 32, -1], 6, 1.6, 11, 0.35);
bolt([-12, 28, 4], [2, 33, -1], 5, 1.4, 29, 0.2);
bolt([13, 27, 3], [10, 32, -1], 4, 1.3, 47, 0.3);
bolt([16, 28, 6], [10, 31, -1], 5, 1.5, 83, 0.25);
bolt([1, 26, 11], [6, 33, 1], 4, 1.2, 101, 0.3);
// bolts striking the ground
bolt([-14, 26, 0], [-9, 1, -12], 9, 2.0, 137, 0.35);
bolt([15, 26, 1], [11, 1, -13], 9, 2.0, 173, 0.35);
bolt([-18, 27, 8], [-15, 7, 5], 5, 1.5, 211, 0.3);
// arc from the clenched fist down to the earth
bolt([-9, F + 4, -1], [-11, 1, -4], 3, 1, 239, 0);

// ---------------- Effects ----------------
for (const [x, y, z] of fires) putIfEmpty(x, y, z, FIRE);
const hammerSparks = [[2, 32, -1], [10, 32, -1], [6, 32, -3], [4, 30, -3], [8, 30, -3], [6, 33, 1], [1, 30, 0], [11, 30, 0]];
for (const p of hammerSparks) sparks.push(p);
sparks.push([-10, F + 5, -2], [-8, F + 3, -3], [-5, F + 20, -3], [5, F + 20, -3]);
// electric vortex spiraling up around Thor
for (let i = 0; i < 10; i++) {
  const a = i * 0.9, rr = 9 - i * 0.3;
  sparks.push([Math.cos(a) * rr, 4 + i * 2.4, 1 + Math.sin(a) * rr]);
}
for (const [x, y, z] of sparks) putIfEmpty(x, y, z, ELECTRIC);

// ---------------- Cull hidden interior blocks ----------------
const TRANS = new Set([FIRE, ELECTRIC, GLASS, ICE, WATER, AIR]);
const solidAt = (x, y, z) => { const c = M.get(K(x, y, z)); return c && !TRANS.has(c[3]); };
const hidden = [];
for (const [k, [x, y, z, id]] of M) {
  if (!TRANS.has(id) && solidAt(x + 1, y, z) && solidAt(x - 1, y, z) && solidAt(x, y + 1, z) &&
      solidAt(x, y - 1, z) && solidAt(x, y, z + 1) && solidAt(x, y, z - 1)) hidden.push(k);
}
for (const k of hidden) M.delete(k);

// ---------------- Storm clouds (scaled to fit budget) ----------------
const PUFFS = [
  // west thunderhead
  [-15, 29, 3, 6, 2.5, 5], [-10, 31, 5, 5, 2, 4], [-19, 30, 9, 4, 2.5, 4], [-13, 27, 0, 4, 1.5, 3],
  // east thunderhead
  [16, 29, 4, 6, 2.5, 5], [13, 31, 8, 5, 2, 4], [19, 30, -1, 3.5, 2, 4], [15, 27, 1, 4, 1.5, 3],
  // storm wall behind Thor
  [0, 28, 15, 9, 3, 4], [-6, 31, 17, 6, 2, 4], [6, 31, 16, 6, 2, 4], [0, 32, 13, 5, 1.5, 3],
];
function buildClouds(sc) {
  const C = new Map();
  for (const [cx, cy, cz, rx0, ry0, rz0] of PUFFS) {
    const rx = rx0 * sc, ry = ry0 * sc, rz = rz0 * sc;
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
      for (let y = Math.floor(cy - ry); y <= Math.min(33, Math.ceil(cy + ry)); y++)
        for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
          if (x < -22 || x > 22 || z < -22 || z > 22) continue;
          const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
          if (d + (h3(x, y, z) - 0.5) * 0.3 <= 1) C.set(K(x, y, z), [x, y, z]);
        }
  }
  const out = [];
  for (const [k, [x, y, z]] of C) {
    if (M.has(k)) continue;
    const below = !C.has(K(x, y - 1, z));
    const exposed = below || !C.has(K(x, y + 1, z)) || !C.has(K(x + 1, y, z)) || !C.has(K(x - 1, y, z)) || !C.has(K(x, y, z + 1)) || !C.has(K(x, y, z - 1));
    if (!exposed) continue;
    const h = h3(x, y, z);
    out.push([x, y, z, below ? (h < 0.3 ? BLACK : GRAY) : y >= 32 ? (h < 0.4 ? WHITE : LIGHT_GRAY) : (h < 0.35 ? GRAY : LIGHT_GRAY)]);
  }
  return out;
}
for (const sc of [1, 0.92, 0.85, 0.78, 0.7, 0.62, 0.55, 0.45]) {
  const out = buildClouds(sc);
  if (M.size + out.length <= 3980 || sc === 0.45) {
    for (const [x, y, z, id] of out) {
      if (M.size >= 3980) break;
      put(x, y, z, id);
    }
    break;
  }
}

for (const [k, [x, y, z, id]] of M) block(x, y, z, id);