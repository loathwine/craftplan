// thor-opus-fb1 — feedback pass 1
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
function seg(a, b, fn) {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]))));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    fn(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
  }
}
function thick(a, b, r, id) {
  const len = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2]));
  const n = Math.ceil(len * 2) + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = Math.round(a[0] + (b[0] - a[0]) * t), cy = Math.round(a[1] + (b[1] - a[1]) * t), cz = Math.round(a[2] + (b[2] - a[2]) * t);
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) for (let oz = -1; oz <= 1; oz++)
      if (ox * ox + oy * oy + oz * oz <= r * r) put(cx + ox, cy + oy, cz + oz, id);
  }
}
const sparks = [];
const fires = [];

// ---------------- scorched stone dais ----------------
const P = new Map();
for (let x = -12; x <= 12; x++) for (let z = -11; z <= 12; z++) {
  const r = Math.sqrt(x * x + (z - 1) * (z - 1) * 1.1) + (h3(x, 7, z) - 0.5) * 1.6;
  let top;
  if (r < 6) top = 0;
  else if (r < 9) top = -1;
  else if (r < 10.5) { if (h3(x, 5, z) > 0.5) top = -1; else continue; }
  else continue;
  for (let y = -3; y <= top; y++) P.set(K(x, y, z), [x, y, z, r]);
}
for (const [k, c] of P) {
  const [x, y, z, r] = c;
  const up = P.has(K(x, y + 1, z));
  const exposed = !up || !P.has(K(x + 1, y, z)) || !P.has(K(x - 1, y, z)) || !P.has(K(x, y, z + 1)) || !P.has(K(x, y, z - 1));
  if (!exposed || y < -2) continue;
  const h = h3(x, y, z);
  let id;
  if (!up) {
    if (r < 6) id = h < 0.15 ? OBSIDIAN : h < 0.5 ? STONE : COBBLE;
    else id = h < 0.12 ? BLACK : h < 0.2 ? GRASS : h < 0.5 ? GRAY : h < 0.8 ? STONE : COBBLE;
  } else id = h < 0.5 ? COBBLE : h < 0.85 ? STONE : GRAY;
  put(x, y, z, id);
}
for (let i = 0; i < 14; i++) {
  const a = i / 14 * Math.PI * 2;
  put(Math.round(Math.cos(a) * 4.4), 0, 1 + Math.round(Math.sin(a) * 4), i % 4 === 0 ? NEON_BLUE : OBSIDIAN);
}

// ---------------- standing stones ----------------
const stones = [[-13, -4, 5], [-14, 6, 6], [-7, 12, 5], [7, 12, 6], [14, 5, 5], [13, -5, 4]];
for (const [sx, sz, sh] of stones) {
  for (let x = sx; x <= sx + 1; x++) for (let z = sz; z <= sz + 1; z++) {
    const top = -1 + sh - (h3(x, 1, z) > 0.6 ? 1 : 0);
    for (let y = -2; y <= top; y++) {
      const h = h3(x, y, z);
      put(x, y, z, y < 1 && h < 0.2 ? LEAVES : h < 0.3 ? COBBLE : h < 0.4 ? GRAY : STONE);
    }
  }
  put(sx, Math.floor(sh / 2), sz, NEON_BLUE);
}

// ---------------- fire braziers lighting Thor from the front ----------------
for (const s of [-1, 1]) {
  const bx = 9 * s, bz = -6;
  box(bx - 1, -1, bz - 1, bx + 1, 0, bz + 1, COBBLE);
  box(bx, 1, bz, bx, 3, bz, STONE);
  put(bx, 2, bz - 1, GOLD);
  box(bx - 1, 4, bz - 1, bx + 1, 4, bz + 1, IRON);
  put(bx, 4, bz, LAVA);
  for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) put(bx + dx, 5, bz + dz, GOLD);
  fires.push([bx, 5, bz]);
}

// ---------------- strike craters ----------------
function crater(cx, cy, cz) {
  for (let x = -4; x <= 4; x++) for (let z = -4; z <= 4; z++) {
    const d = Math.sqrt(x * x + z * z) + (h3(cx + x, 9, cz + z) - 0.5);
    if (d < 2.2) { cube(cx + x, cy, cz + z, cx + x, cy + 1, cz + z, AIR); put(cx + x, cy - 1, cz + z, OBSIDIAN); }
    else if (d < 3.6) put(cx + x, cy, cz + z, h3(x, cz, z) < 0.5 ? BLACK : OBSIDIAN);
    else if (d < 4.3 && h3(x, 2, z) < 0.5) put(cx + x, cy, cz + z, GRAY);
  }
  put(cx, cy - 1, cz, LAVA); put(cx + 1, cy - 1, cz, LAVA); put(cx, cy - 2, cz, LAVA);
  put(cx + 3, cy + 1, cz - 2, COBBLE); put(cx - 3, cy + 1, cz + 1, STONE); put(cx + 2, cy + 1, cz + 3, GRAY);
  sparks.push([cx - 1, cy, cz]);
  fires.push([cx - 1, cy, cz + 1], [cx + 2, cy + 1, cz - 1]);
}
crater(-13, 0, -8);
crater(12, 0, -11);

// ---------------- THOR ----------------
const F = 1;
// legs in a wide heroic stance
for (const s of [-1, 1]) {
  for (let y = F; y <= F + 7; y++) {
    const t = (y - F) / 7;
    const cx = s * Math.round(5 - 2 * t);
    for (let x = cx - 1; x <= cx + 1; x++) {
      if (y <= F + 3) {
        const zf = y === F ? -3 : -2;
        for (let z = zf; z <= 1; z++) put(x, y, z, y === F + 3 ? IRON : GRAY);
      } else {
        for (let z = -1; z <= 1; z++) put(x, y, z, BLUE);
        if (y === F + 5) put(x, y, -2, IRON);                 // knee guard
      }
    }
    if (y === F + 1 || y === F + 2) put(cx, y, -3, BROWN);    // boot laces
  }
}
box(-4, 8, -2, 4, 9, 2, BLUE);                                // pelvis
box(-2, 6, -3, 2, 9, -3, BROWN);                              // leather front flap
put(-2, 7, -3, IRON); put(2, 7, -3, IRON);
box(-5, 10, -3, 5, 10, 3, BROWN);                             // belt
box(-1, 10, -4, 1, 10, -4, GOLD);                             // buckle
put(-3, 10, -4, IRON); put(3, 10, -4, IRON);
box(-4, 11, -2, 4, 12, 2, BLUE);                              // waist
box(-5, 13, -2, 5, 17, 2, BLUE);                              // chest
box(-4, 11, -3, 4, 17, -3, BLUE);                             // tunic plate
box(0, 11, -3, 0, 15, -3, BLACK);                             // seam
box(-4, 11, -3, -4, 17, -3, IRON); box(4, 11, -3, 4, 17, -3, IRON);
box(-3, 17, -3, 3, 17, -3, IRON);                             // collar
for (const [cx, cy] of [[-2, 15], [2, 15], [-2, 12], [2, 12]]) {  // the iconic chest discs
  put(cx, cy, -4, WHITE);
  put(cx - 1, cy, -4, IRON); put(cx + 1, cy, -4, IRON); put(cx, cy - 1, -4, IRON); put(cx, cy + 1, -4, IRON);
}
for (const s of [-1, 1]) {                                    // pauldrons
  box(5 * s, 16, -2, 7 * s, 18, 2, IRON);
  box(5 * s, 19, -1, 6 * s, 19, 1, IRON);
  box(5 * s, 16, -2, 7 * s, 16, -2, GRAY);
  put(6 * s, 17, -3, LIGHT_GRAY);
}
box(-1, 18, -1, 1, 18, 1, SAND);                              // neck
box(-2, 19, -2, 2, 22, 2, SAND);                              // head
// face
put(-1, 21, -2, NEON_BLUE); put(1, 21, -2, NEON_BLUE);       // lightning-lit eyes
box(-2, 22, -3, -1, 22, -3, YELLOW); box(1, 22, -3, 2, 22, -3, YELLOW);  // brows
put(0, 22, -3, IRON);                                         // nasal guard
put(0, 21, -3, SAND); put(0, 20, -3, SAND);                   // nose
put(-2, 20, -3, YELLOW); put(2, 20, -3, YELLOW);
box(-2, 19, -3, 2, 19, -3, YELLOW);                           // moustache
box(-2, 16, -3, 2, 18, -3, YELLOW);                           // beard
put(0, 19, -3, BLACK); put(0, 18, -3, BLACK); put(-1, 18, -3, BLACK); put(1, 18, -3, BLACK); // roaring mouth
box(-1, 16, -4, 1, 17, -4, YELLOW);                           // beard jut
put(0, 15, -4, YELLOW); put(0, 14, -4, SAND);                 // braid
for (const s of [-1, 1]) box(3 * s, 17, -2, 3 * s, 21, 0, YELLOW);  // beard sides
// hair, blown back and east
function hair(x, y, z) { put(x, y, z, h3(x, y, z) < 0.15 ? SAND : YELLOW); }
for (const s of [-1, 1]) for (let y = 18; y <= 22; y++) for (let z = 0; z <= 3; z++) hair(3 * s, y, z);
for (let x = -3; x <= 3; x++) for (let y = 16; y <= 23; y++) hair(x, y, 3);
for (let x = -2; x <= 3; x++) for (let y = 13; y <= 22; y++) hair(x, y, 4);
for (let x = 0; x <= 4; x++) for (let y = 12; y <= 18; y++) hair(x, y, 5);
for (let x = 2; x <= 5; x++) for (let y = 13; y <= 16; y++) hair(x, y, 6);
// winged helmet
box(-3, 23, -3, 3, 24, 3, IRON);
box(-2, 25, -2, 2, 25, 2, IRON);
box(-1, 26, -1, 1, 26, 1, IRON);
box(-3, 23, -3, 3, 23, -3, LIGHT_GRAY);
put(-3, 22, -2, IRON); put(3, 22, -2, IRON); put(-3, 21, -2, IRON); put(3, 21, -2, IRON);
const tips = [[5, 30, 1], [6, 29, 2], [6, 28, 4], [6, 26, 5], [5, 24, 5]];
for (const s of [-1, 1]) {
  box(4 * s, 23, -1, 4 * s, 25, 1, WHITE);
  for (const [tx, ty, tz] of tips) {
    seg([4 * s, 24, 0], [tx * s, ty, tz], (x, y, z) => put(x, y, z, WHITE));
    seg([4 * s, 23, 1], [tx * s, ty - 1, tz], (x, y, z) => put(x, y, z, WHITE));
    put(tx * s, ty, tz, LIGHT_GRAY);
  }
}
// east arm thrust skyward holding Mjolnir
thick([6.5, 17, 0], [9, 21, -0.5], 1.2, SAND);
thick([9, 21, -0.5], [11, 24.5, -1], 1.2, GRAY);
thick([10.6, 23.8, -1], [11, 24.5, -1], 1.2, IRON);
thick([9, 21, -0.5], [9.4, 21.6, -0.6], 1.2, IRON);
box(10, 25, -2, 12, 26, 0, SAND);                             // fist
box(10, 26, -3, 12, 26, -3, SAND);                            // knuckles
put(12, 24, -2, BROWN); put(12, 23, -2, BROWN);               // wrist thong
put(11, 27, -1, BROWN);                                       // handle
box(8, 28, -2, 14, 30, 0, IRON);                              // hammer head
box(9, 28, -2, 9, 30, 0, GRAY); box(13, 28, -2, 13, 30, 0, GRAY);
put(10, 29, -2, LIGHT_GRAY); put(12, 29, -2, LIGHT_GRAY);
put(11, 28, -2, LIGHT_GRAY); put(11, 30, -2, LIGHT_GRAY);
put(11, 29, -2, NEON_BLUE);                                   // charged rune
// west arm reaching down, crackling open hand
thick([-6.5, 17, 0], [-9, 13.5, -1], 1.2, SAND);
thick([-9, 13.5, -1], [-11, 10, -2], 1.2, GRAY);
thick([-10.6, 10.6, -2], [-11, 10, -2], 1.2, IRON);
box(-12, 8, -3, -11, 9, -2, SAND);
put(-13, 8, -3, SAND); put(-12, 7, -3, SAND); put(-11, 7, -4, SAND); put(-13, 9, -2, SAND);

// ---------------- billowing red cape ----------------
const capeTop = 18, capeBot = 1;
const capeW = y => 6 + Math.round(((capeTop - y) / (capeTop - capeBot)) * 4);
const capeS = y => Math.round(((capeTop - y) / (capeTop - capeBot)) * 3);
function capeZ(x, y) {
  const t = (capeTop - y) / (capeTop - capeBot);
  let z = 3 + Math.round(t * t * 6 + Math.sin(x * 0.7 + y * 0.4) * t * 1.3);
  if (Math.abs(x - capeS(y)) >= capeW(y) - 1) z -= 1 + (t > 0.5 ? 1 : 0);
  return z;
}
for (let y = capeTop; y >= capeBot; y--) {
  const w = capeW(y), sx = capeS(y);
  for (let x = -w + sx; x <= w + sx; x++) {
    if (y === capeBot && h3(x, y, 1) < 0.4) continue;
    const z = capeZ(x, y);
    const aboveIn = y < capeTop && Math.abs(x - capeS(y + 1)) <= capeW(y + 1);
    const za = aboveIn ? capeZ(x, y + 1) : z;
    for (let zz = Math.min(z, za); zz <= Math.max(z, za); zz++) putIfEmpty(x, y, zz, RED);
  }
}
for (const s of [-1, 1]) box(4 * s, 18, 3, 7 * s, 19, 3, RED);

// ---------------- lightning ----------------
let bc = 0;
function bput(x, y, z, main) {
  bc++;
  putIfEmpty(x, y, z, bc % (main ? 3 : 4) === 0 ? NEON_BLUE : main ? WHITE : LIGHT_BLUE);
}
function bolt(a, b, n, jit, seed, branchP) {
  let s = seed >>> 0;
  const r = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const pts = [a];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    pts.push([a[0] + (b[0] - a[0]) * t + (r() - 0.5) * 2 * jit, a[1] + (b[1] - a[1]) * t + (r() - 0.5) * jit * 0.5, a[2] + (b[2] - a[2]) * t + (r() - 0.5) * 2 * jit]);
  }
  pts.push(b);
  for (let i = 0; i < pts.length - 1; i++) seg(pts[i], pts[i + 1], (x, y, z) => bput(x, y, z, true));
  for (let i = 1; i < pts.length - 1; i++) {
    if (r() < branchP) {
      const p = pts[i];
      const q = [p[0] + (r() - 0.5) * 7, p[1] - 2 - r() * 3, p[2] + (r() - 0.5) * 5];
      const m = [(p[0] + q[0]) / 2 + (r() - 0.5) * 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2 + (r() - 0.5) * 2];
      seg(p, m, (x, y, z) => bput(x, y, z, false));
      seg(m, q, (x, y, z) => bput(x, y, z, false));
      sparks.push([q[0], q[1] - 1, q[2]]);
    }
  }
}
// bolts from the storm converging on Mjolnir
bolt([-15, 32, 6], [8, 31, -1], 6, 1.3, 11, 0.3);
bolt([20, 32, 5], [14, 31, -1], 4, 1.1, 47, 0.3);
bolt([5, 33, 9], [11, 31, -1], 4, 1.0, 101, 0.2);
// side ground strikes framing him (behind his plane, not in front)
bolt([-18, 29, 9], [-17, 0, 5], 8, 1.5, 211, 0.3);
bolt([18, 29, 9], [17, 0, 5], 8, 1.5, 173, 0.3);
// arc from his open hand into the crater
bolt([-12, 7, -3], [-13, 1, -8], 3, 0.8, 239, 0);
for (const [sx, sz] of [[-17, 5], [17, 5]]) {
  for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++)
    if (x * x + z * z <= 5) put(sx + x, -1, sz + z, h3(x, sz, z) < 0.5 ? BLACK : OBSIDIAN);
  sparks.push([sx + 1, 0, sz - 1], [sx - 1, 0, sz + 1]);
}
fires.push([16, 7, 4], [18, 7, 5], [19, 7, 5], [-17, 6, 3], [-16, 6, 1]);   // trees set ablaze

for (const [x, y, z] of fires) putIfEmpty(x, y, z, FIRE);
sparks.push([11, 31, -3], [7, 29, -1], [15, 29, -1], [8, 31, 1], [14, 31, 1], [11, 32, 0], [11, 27, -3]);
sparks.push([12, 22, -2], [7, 20, -3]);
sparks.push([-13, 8, -4], [-11, 7, -5], [-13, 10, -3]);
for (let i = 0; i < 6; i++) {
  const a = i * 1.1 + 0.4, rr = 8;
  sparks.push([Math.cos(a) * rr, 5 + i * 3.5, 1 + Math.sin(a) * rr]);
}
for (const [x, y, z] of sparks) putIfEmpty(x, y, z, ELECTRIC);

// ---------------- remove fully hidden blocks ----------------
const TRANS = new Set([FIRE, ELECTRIC, GLASS, ICE, WATER, AIR]);
const solidAt = (x, y, z) => { const c = M.get(K(x, y, z)); return c && !TRANS.has(c[3]); };
const hidden = [];
for (const [k, [x, y, z, id]] of M) {
  if (!TRANS.has(id) && solidAt(x + 1, y, z) && solidAt(x - 1, y, z) && solidAt(x, y + 1, z) &&
      solidAt(x, y - 1, z) && solidAt(x, y, z + 1) && solidAt(x, y, z - 1)) hidden.push(k);
}
for (const k of hidden) M.delete(k);

// ---------------- storm clouds ----------------
const PUFFS = [
  [-16, 31, 6, 6, 2, 5], [-11, 32, 9, 5, 1.5, 4], [-20, 30, 10, 3, 2.5, 4],
  [19, 31, 8, 5, 2, 5], [14, 32, 11, 5, 1.5, 4], [21, 30, 2, 2, 2, 3],
  [0, 30, 16, 10, 3, 4], [-7, 32, 15, 6, 1.5, 4], [7, 32, 14, 6, 1.5, 4], [0, 33, 11, 5, 1, 3],
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