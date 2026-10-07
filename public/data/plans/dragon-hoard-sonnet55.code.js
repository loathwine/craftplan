// dragon-hoard-sonnet55 — prompt:
// a dragon sleeping on a pile of gold...

const M = new Map();
const put = (x, y, z, id) => {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
};
const has = (x, y, z) => M.has(Math.round(x) + ',' + Math.round(y) + ',' + Math.round(z));
const h = (x, y, z) => { const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return s - Math.floor(s); };
const topY = (x, z) => { for (let y = 16; y >= -1; y--) if (has(x, y, z)) return y; return null; };

function ell(cx, cy, cz, rx, ry, rz, fn, inner = 0, ymin = -8) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.max(ymin, Math.floor(cy - ry)); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
        if (d <= 1 && d >= inner) put(x, y, z, fn(x, y, z, cx, cy, cz));
      }
}
function ln(a, b, id) {
  const n = Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2])) * 1.6) + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    put(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, id);
  }
}
function tube(pts, rs, fn, inner = 0) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const dist = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const steps = Math.ceil(dist * 2);
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const r = rs[i] + (rs[i + 1] - rs[i]) * t;
      ell(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, r, r, fn, inner);
    }
  }
}

const GEMS = [RED, CYAN, MAGENTA, LIGHT_BLUE, LIME];
const goldFn = (x, y, z) => {
  const r = h(x, y, z);
  if (r < 0.66) return GOLD;
  if (r < 0.84) return YELLOW;
  if (r < 0.88) return COPPER;
  if (r < 0.93) return ORANGE;
  return GEMS[Math.floor(h(z, x, y) * GEMS.length)];
};
const scaleFn = (x, y, z) => {
  const k = (((x + 2 * y + 3 * z) % 4) + 4) % 4;
  const r = h(x, y, z);
  if (r < 0.05) return ORANGE;
  return k === 0 ? BRICK : RED;
};
const darkFn = () => BRICK;
const legFn = (x, y, z, cx, cy) => (y < cy - 0.9 && h(x, y, z) < 0.5 ? ORANGE : scaleFn(x, y, z));

// ---------- clear site (trees) ----------
cube(-13, 0, -14, 14, 10, 11, AIR);
cube(-4, 11, -3, 9, 15, 9, AIR);

// ---------- gold hoard ----------
ell(0, -1, 2, 13, 5, 9, goldFn, 0.62, -1);
const lumps = [
  [8, -8, 4.5, 3.5, 4.5], [-3, -7, 4, 2.5, 3], [13, 3, 3, 2.5, 3.5], [-13, 7, 3, 2.5, 3],
  [6, 10, 4, 2.5, 3], [-6, 10, 4, 2.5, 3], [-9, -5, 3, 2.5, 3], [12, -3, 3, 2.5, 3],
];
for (const [x, z, rx, ry, rz] of lumps) ell(x, -1, z, rx, ry, rz, goldFn, 0.5, -1);

// scattered coins on the cave floor
for (let x = -14; x <= 14; x++) for (let z = -14; z <= -6; z++) {
  if (h(x, 5, z) < 0.16 && !has(x, -1, z)) put(x, -1, z, h(z, x, 1) < 0.7 ? GOLD : YELLOW);
}

// chest
cube(-3, 0, -9, 1, 1, -7, BROWN);
cube(-3, 2, -6, 1, 4, -6, BROWN);
for (const x of [-3, 1]) { cube(x, 0, -9, x, 1, -9, OAK_LOG); cube(x, 2, -6, x, 4, -6, OAK_LOG); }
cube(-3, 4, -6, 1, 4, -6, GOLD);
put(-1, 1, -10, GOLD); put(-1, 0, -10, GOLD);
ell(-1, 2, -8, 2.6, 1.9, 1.6, goldFn, 0, 2);
// crown on the heap
for (let i = 0; i < 12; i++) {
  const a = i / 12 * Math.PI * 2, x = -1 + Math.cos(a) * 1.5, z = -8 + Math.sin(a) * 1.2;
  put(x, 4, z, GOLD);
  if (i % 2 === 0) { put(x, 5, z, GOLD); if (i % 4 === 0) put(x, 6, z, RED); }
}
// sword buried in the east hoard
cube(14, 2, 1, 14, 8, 1, IRON);
cube(13, 9, 1, 15, 9, 1, GOLD);
cube(14, 10, 1, 14, 11, 1, BROWN);
put(14, 12, 1, RED);

// treasure scatter
for (let i = 0; i < 80; i++) {
  const x = Math.round(-12 + 24 * h(i, 1, 2)), z = Math.round(-6 + 17 * h(i, 2, 3));
  const t = topY(x, z);
  if (t === null || t > 4) continue;
  const r = h(i, 3, 4);
  if (r < 0.45) { put(x, t + 1, z, GOLD); if (r < 0.2) put(x, t + 2, z, YELLOW); }
  else if (r < 0.75) put(x, t + 1, z, GEMS[i % GEMS.length]);
  else { const c = [CYAN, MAGENTA, LIGHT_BLUE][i % 3]; for (let k = 1; k <= 3; k++) put(x, t + k, z, c); }
}

// ---------- dragon ----------
// torso
ell(0, 6, 3, 7.5, 4.5, 5, scaleFn, 0.6);

// wings (folded, draped over the flank)
function wing(W, tips, S, memb) {
  const poly = [...tips, S];
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i], b = poly[i + 1];
    const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * 1.5);
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      ln(W, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], memb(k + i));
    }
  }
  for (const t of tips) ln(W, t, BRICK);
  ln(S, W, BRICK);
  put(W[0], W[1] + 1, W[2], WHITE);
  put(W[0], W[1] + 2, W[2], WHITE);
}
const membFn = (k) => (k % 5 === 0 ? MAGENTA : PURPLE);
wing([-2, 14, 5], [[-8, 3, 8], [-4, 3, 9], [0, 3, 9], [3, 3, 8]], [6, 9, 6], membFn);
wing([2, 13, 1], [[-3, 4, -2], [-1, 3, -4], [1, 3, -4], [2, 4, -3]], [6, 9, 0], membFn);

// haunch + hind foot
ell(-5.5, 5, -0.5, 3.6, 3.6, 3.3, scaleFn, 0.5);
ell(-6.5, 1.4, -4.5, 2, 1.3, 3, scaleFn);
for (const x of [-8, -7, -6, -5]) { put(x, 1, -8, WHITE); put(x, 0, -8, WHITE); }

// neck
tube([[5, 6, 2], [7.5, 6.5, -0.5], [8.5, 5.5, -3.5], [8, 4.5, -6]], [3.4, 3.2, 3, 2.8], legFn);
// head
ell(8, 4, -8, 3.3, 2.8, 3.8, scaleFn);
ell(8, 3.4, -11.7, 2.2, 1.6, 2.8, scaleFn);
ell(8, 2, -10.5, 2.3, 1, 3.3, darkFn);
ell(6, 6.3, -9.3, 1.5, 0.9, 1.6, darkFn);
ell(10, 6.3, -9.3, 1.5, 0.9, 1.6, darkFn);
// closed eyes
for (const [x, y, z] of [[6, 5, -10], [5, 5, -9], [10, 5, -10], [11, 5, -9]]) put(x, y, z, BLACK);
// nostrils + sleepy smoke
put(7, 4, -13, BLACK); put(9, 4, -13, BLACK);
put(7, 4, -14, FIRE); put(9, 4, -14, FIRE);
// fangs
for (const [x, y, z] of [[6, 2, -12], [7, 2, -13], [9, 2, -13], [10, 2, -12], [7, 1, -13], [9, 1, -13]]) put(x, y, z, WHITE);
// horns
tube([[5.5, 6.5, -6], [4, 8.5, -4], [3, 10.5, -1]], [1.5, 1, 0.5], () => MARBLE);
tube([[10.5, 6.5, -6], [12, 8.5, -4], [13, 10.5, -1]], [1.5, 1, 0.5], () => MARBLE);
put(3, 11, -1, GOLD); put(13, 11, -1, GOLD);
// cheek spikes
ln([4.5, 3.5, -8], [2, 3, -7], MARBLE); ln([11.5, 3.5, -8], [14, 3, -7], MARBLE);

// forelegs + paws
tube([[3.7, 5.5, 0], [3.2, 3.5, -3.5], [3.2, 2.5, -7]], [2.2, 1.9, 1.7], legFn);
ell(3.2, 1.5, -9.5, 1.9, 1.3, 2.6, scaleFn);
tube([[10.5, 4.5, -1], [12.8, 3.2, -4], [12.8, 2.5, -7]], [2.2, 1.9, 1.7], legFn);
ell(12.8, 1.5, -9.5, 1.9, 1.3, 2.6, scaleFn);
for (const x of [2, 3, 4, 12, 13, 14]) { put(x, 1, -12, WHITE); put(x, 0, -12, WHITE); }

// tail curled around the front of the hoard
const tailPts = [[-7, 5, 3], [-10, 3.5, 2], [-12, 2, -1], [-12.5, 1.2, -4.5], [-10.5, 0.6, -8], [-7, 0.2, -10.5], [-3, 0, -11.5], [0, 0, -11]];
const tailR = [3.2, 3, 2.6, 2.2, 1.8, 1.5, 1.1, 0.8];
tube(tailPts, tailR, scaleFn, 0);
// spade tail tip
ell(2, 0.5, -11, 2, 0.7, 1.6, () => ORANGE);
ell(2.5, 0.5, -11, 1, 0.7, 1, () => RED);
// tail spines
for (let i = 1; i < tailPts.length - 1; i++) {
  const [x, y, z] = tailPts[i];
  const r = tailR[i];
  put(x, y + r, z, BLACK);
  if (i < 5) put(x, y + r + 1, z, BLACK);
}

// dorsal spines along the back and neck
for (let x = -7; x <= 7; x += 2) {
  const t = topY(x, 3);
  if (t === null) continue;
  const len = 1 + Math.round(2 * (1 - Math.abs(x) / 8));
  for (let k = 1; k <= len; k++) put(x, t + k, 3, BLACK);
}
for (const [x, y, z] of [[7.5, 9.5, -0.5], [8.2, 8.5, -3], [8, 7.5, -5.5]]) { put(x, y + 1, z, BLACK); put(x, y + 2, z, BLACK); }

// ---------- lair ----------
// brazier pillars
for (const [px, pz] of [[-16, -4], [16, -5]]) {
  ell(px, 4, pz, 1.7, 5.5, 1.7, (x, y, z) => (h(x, y, z) < 0.5 ? STONE : COBBLE), 0.4, -1);
  ell(px, 10, pz, 2.6, 1, 2.6, () => IRON, 0.3);
  put(px, 11, pz, FIRE); put(px, 12, pz, FIRE);
  ell(px, 10, pz, 1.3, 0.5, 1.3, () => ORANGE);
}
// rocky back wall, framing the dragon
for (let x = -16; x <= 16; x++) {
  const H = Math.round(6 + 8 * Math.pow(Math.abs(x) / 16, 1.5) + 3 * h(x, 1, 1));
  for (let y = -1; y <= H; y++) put(x, y, 14, h(x, y, 2) < 0.55 ? STONE : COBBLE);
}

// ---------- emit (budget-capped) ----------
let n = 0;
for (const [x, y, z, id] of M.values()) {
  if (n >= 3990) break;
  block(x, y, z, id);
  n++;
}