// dragon-hoard-opus — prompt:
// a dragon sleeping on a pile of gold...

// ===== A red dragon asleep on a hoard of gold, amid ruined marble columns =====
const M = new Map();
const R = Math.round;
let PRI = 3;
function key(x, y, z) { return x + ',' + y + ',' + z; }
function put(x, y, z, id) {
  x = R(x); y = R(y); z = R(z);
  if (Math.abs(x) > 22 || Math.abs(z) > 22 || y < -8 || y > 33) return;
  M.set(key(x, y, z), [x, y, z, id, PRI]);
}
function putE(x, y, z, id) { // only if empty
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
function tri(a, b, c, id) { // thin membrane, never overwrites
  const n = 40;
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
    const u = i / n, v = j / n, w = 1 - u - v;
    putE(a[0] * w + b[0] * u + c[0] * v, a[1] * w + b[1] * u + c[1] * v, a[2] * w + b[2] * u + c[2] * v, id);
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

// ---------- clear trees from the lair and the camera's (north) sightline ----------
cylinder(0, 1, 1, 17, 9, AIR);
cube(-22, 1, -22, 22, 9, -12, AIR);

// ---------- the hoard: heightfield of gold ----------
function mound(x, z, cx, cz, rx, rz, h) {
  const d2 = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
  return d2 >= 1 ? 0 : h * Math.pow(1 - d2, 1.1);
}
function H(x, z) {
  let h = Math.max(
    mound(x, z, 0, 1.5, 14, 12.5, 6.5),
    mound(x, z, -10.5, 9, 5.5, 5, 3.6),
    mound(x, z, 9.5, -6.5, 4.5, 4, 2.6),
    mound(x, z, 11, 9.5, 4, 4.5, 2.4)
  );
  if (h > 0.3) h += 0.7 * Math.sin(x * 0.71 + z * 0.33) * Math.sin(z * 0.57 - x * 0.21) + (hsh(R(x), 7, R(z)) - 0.5) * 0.6;
  return h;
}
const GEMS = [RED, BLUE, LIME, MAGENTA, CYAN, IRON, RED, BLUE];
for (let x = -18; x <= 18; x++) for (let z = -14; z <= 16; z++) {
  const h = H(x, z);
  if (h < 0.45) {
    // stray coins spilled onto the floor
    const near = Math.max(mound(x, z, 0, 1.5, 17, 15.5, 1), mound(x, z, -10.5, 9, 8, 7, 1), mound(x, z, 9.5, -6.5, 7, 6, 1));
    PRI = 0;
    if (near > 0 && hsh(x, 1, z) < 0.3) put(x, 0, z, hsh(x, 2, z) < 0.8 ? GOLD : YELLOW);
    continue;
  }
  PRI = 1;
  const tp = R(h);
  for (let y = 0; y <= tp; y++) {
    const r = hsh(x, y, z);
    let id = r < 0.14 ? YELLOW : GOLD;
    if (y === tp && r > 0.975) id = GEMS[Math.floor(hsh(z, y, x) * GEMS.length)];
    put(x, y, z, id);
  }
}
PRI = 3;
const top = (x, z) => { const h = H(R(x), R(z)); return h < 0.45 ? -1 : R(h); };

// ---------- dragon body: one spline tube from neck to tail tip ----------
// [x, z, radius, lift]  (y is auto-placed resting on the gold)
const spine = [
  [-4.8, -7.8, 1.9, 1.6],
  [-5.6, -5.2, 2.1, 1.9],
  [-4.6, -2.6, 2.5, 1.6],
  [-2.4, -0.4, 3.1, 0.9],
  [0, 2.2, 3.9, 0],
  [0.6, 5.2, 4.1, 0],
  [0.6, 8.2, 3.7, 0],
  [2.2, 11.0, 2.9, 0],
  [5.6, 12.2, 2.3, 0],
  [9.0, 10.2, 1.9, 0],
  [11.2, 6.0, 1.55, 0],
  [11.6, 1.0, 1.3, 0],
  [10.2, -4.0, 1.05, 0],
  [7.2, -8.0, 0.85, 0],
  [3.8, -10.4, 0.65, 0],
  [0.8, -11.4, 0.5, 0],
].map(([x, z, r, lift]) => [x, Math.max(H(x, z), 0) + r * 0.78 + lift, z, r]);

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
const SQ = 0.82; // sleeping bulk slumps: squash vertically
for (const [cx, cy, cz, r, sa] of samples) {
  const ri = Math.ceil(r);
  for (let x = Math.floor(cx - ri); x <= Math.ceil(cx + ri); x++)
    for (let y = Math.floor(cy - ri); y <= Math.ceil(cy + ri); y++)
      for (let z = Math.floor(cz - ri); z <= Math.ceil(cz + ri); z++) {
        const dx = x - cx, dy = (y - cy) / SQ, dz = z - cz;
        if (dx * dx + dy * dy + dz * dz > r * r) continue;
        const rel = (y - cy) / (r * SQ);
        let id;
        if (rel < -0.3) id = (Math.floor(sa * 0.8) % 2) ? ORANGE : YELLOW;   // belly plates
        else if (rel < -0.1) id = ORANGE;
        else id = hsh(x, y, z) < 0.2 ? BRICK : RED;                        // scales
        put(x, y, z, id);
      }
}
// dorsal spikes
let nextSpike = 1.2;
for (const [cx, cy, cz, r, sa] of samples) {
  if (sa < nextSpike) continue;
  nextSpike = sa + (r > 2 ? 1.7 : 1.3);
  const base = cy + r * SQ;
  const h = Math.max(1, R(r * 0.75));
  for (let k = 0; k < h; k++) put(cx, base + k, cz + k * 0.35, k === h - 1 ? OBSIDIAN : (k === 0 ? BRICK : BLACK));
  if (r > 2.5) { put(cx, base, cz + 1, BRICK); put(cx, base, cz - 1, BRICK); }
}
// spade tail tip
const tip = spine[spine.length - 1];
put(tip[0] - 1, tip[1], tip[2], OBSIDIAN); put(tip[0] - 2, tip[1], tip[2], BLACK);
put(tip[0] - 1, tip[1], tip[2] - 1, OBSIDIAN); put(tip[0] - 1, tip[1], tip[2] + 1, OBSIDIAN);
put(tip[0] - 1, tip[1] + 1, tip[2], BLACK);

// ---------- head: chin resting on the gold, facing north ----------
const hx = -4.9, hz = -9.6;
const hy = Math.max(H(hx, hz), 0) + 2.3;
const eyeY = R(hy + 0.4);
ellip(hx, hy, hz, 2.5, 2.2, 2.6, (x, y, z, dx) =>
  (y === eyeY && Math.abs(dx) > 0.5 && z >= R(hz) - 1 && z <= R(hz)) ? BLACK :   // closed eyes
  (hsh(x, y, z) < 0.18 ? BRICK : RED));
// heavy brow ridges over the shut eyes
for (const sd of [-1, 1]) pline([hx + sd * 2.0, eyeY + 1, hz - 1.6], [hx + sd * 1.9, eyeY + 1.3, hz + 0.8], BRICK);
// snout + jaw
const mouthY = R(hy - 1.0);
for (let t = 0; t <= 1; t += 0.08) {
  const cx = hx + 0.7 * t, cz = hz - 1.5 - 4.6 * t, cy = hy - 0.3 - 0.6 * t, r = 1.95 - 0.5 * t;
  ellip(cx, cy, cz, r * 1.05, r * 0.85, r, (x, y, z) => {
    if (y === mouthY) return (z % 2 === 0 && Math.abs(x - cx) > r * 0.6 && t < 0.9) ? WHITE : BLACK; // mouth crease + teeth
    if (y < mouthY) return hsh(x, y, z) < 0.3 ? ORANGE : RED;                                 // lower jaw
    return hsh(x, y, z) < 0.15 ? BRICK : RED;
  });
}
// nostrils
const nz = R(hz - 7.4), ny = R(hy - 0.2);
put(hx - 0.2, ny, nz + 1, BLACK); put(hx + 1.6, ny, nz + 1, BLACK);
// fangs over the lower lip
put(hx - 0.6, mouthY - 1, hz - 6.3, WHITE); put(hx + 1.9, mouthY - 1, hz - 6.1, WHITE);
// swept-back ivory horns + cheek frills
for (const sd of [-1, 1]) {
  const a = [hx + sd * 1.4, hy + 1.6, hz + 1.0], b = [hx + sd * 2.4, hy + 3.2, hz + 3.6], c = [hx + sd * 2.9, hy + 4.4, hz + 6.4];
  pline(a, b, LIGHT_GRAY); pline([a[0] + sd * 0.8, a[1], a[2]], [b[0], b[1] - 0.8, b[2]], LIGHT_GRAY);
  pline(b, c, WHITE);
  pline([hx + sd * 2.4, hy - 0.6, hz + 0.8], [hx + sd * 3.4, hy - 0.2, hz + 2.6], OBSIDIAN);
  pline([hx + sd * 2.2, hy + 0.6, hz + 1.8], [hx + sd * 3.0, hy + 1.4, hz + 3.4], BLACK);
}

// ---------- legs ----------
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
  ellip(x, y, z, 1.5, 0.9, 1.6, () => RED);
  for (const o of [-1, 0, 1]) { put(x + o, R(y) - 1, z - 2, WHITE); put(x + o, R(y), z - 2, LIGHT_GRAY); }
  return [x, y, z];
}
const g = (x, z, lift) => [x, Math.max(H(x, z), 0) + lift, z];
// front legs, tucked forward
limb([[-4.2, 7.6, -1.2], g(-6.8, -1.6, 1.4), paw(-7.6, -5.8)], [1.8, 1.4, 1.2], RED);
limb([[2.6, 7.8, -0.8], g(5.4, -1.2, 1.4), paw(4.8, -5.4)], [1.8, 1.4, 1.2], RED);
// hind legs: big haunches, folded
for (const sd of [-1, 1]) {
  const hip = [sd * 3.6, spine[6][1] - 0.4, 7.4];
  ellip(hip[0], hip[1], hip[2], 2.8, 2.6, 3.1, (x, y, z) => hsh(x, y, z) < 0.2 ? BRICK : RED);
  const knee = g(sd * 5.8, 4.4, 1.6);
  limb([hip, knee, paw(sd * 6.2, 1.6)], [2.2, 1.4, 1.1], RED);
}

// ---------- folded wings (east one a little raised) ----------
function wing(sd, root, wrist, tipP, low) {
  const mid = [(tipP[0] + low[0]) / 2, (tipP[1] + low[1]) / 2 - 0.5, (tipP[2] + low[2]) / 2];
  tri(root, wrist, low, BRICK);
  tri(wrist, tipP, mid, BRICK);
  tri(wrist, mid, low, BRICK);
  pline(root, wrist, OBSIDIAN); pline([root[0], root[1] - 0.8, root[2]], [wrist[0], wrist[1] - 0.8, wrist[2]], RED);
  pline(wrist, tipP, BLACK); pline(wrist, mid, BLACK); pline(wrist, low, BLACK);
  put(wrist[0], wrist[1] + 1, wrist[2] - 1, WHITE); put(wrist[0] + sd * 0.4, wrist[1] + 1, wrist[2] - 2, WHITE);
}
wing(1, [2.2, 11.6, 0.6], [7.0, 17.6, 3.2], [8.6, 10.2, 13.4], [4.8, 9.4, 9.2]);
wing(-1, [-2.2, 11.4, 0.8], [-6.2, 15.6, 4.6], [-7.8, 9.0, 13.6], [-4.9, 9.2, 9.6]);

// ---------- treasure ----------
function hollowBox(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++)
    if (x === x1 || x === x2 || z === z1 || z === z2 || y === y1) put(x, y, z, id);
}
// crown inside the curl of the tail
(function crown(cx, cz) {
  const b = top(cx, cz) + 1;
  for (let a = 0; a < 16; a++) {
    const x = cx + 1.6 * Math.cos(a * Math.PI / 8), z = cz + 1.6 * Math.sin(a * Math.PI / 8);
    put(x, b, z, GOLD);
    if (a % 4 === 0) put(x, b + 1, z, GOLD);
    if (a % 4 === 2) put(x, b, z, a % 8 === 2 ? RED : BLUE);
  }
})(1.5, -7.2);
// swords plunged into the hoard
function sword(x, z, lean) {
  const b = Math.max(top(x, z), -1);
  for (let k = 0; k < 4; k++) put(x + lean * k * 0.25, b + 1 + k, z, IRON);
  const gy = b + 5, gx = x + lean;
  put(gx - 1, gy, z, GOLD); put(gx, gy, z, GOLD); put(gx + 1, gy, z, GOLD);
  put(gx, gy + 1, z, BROWN); put(gx, gy + 2, z, BROWN); put(gx, gy + 3, z, GOLD);
}
sword(-10, 1, 0); sword(-7, 11, 1); sword(12, 9, -1); sword(-12, -6, 1);
// goblets
function goblet(x, z) {
  const b = Math.max(top(x, z), -1);
  put(x, b + 1, z, GOLD); put(x, b + 2, z, GOLD);
  put(x - 1, b + 3, z, GOLD); put(x + 1, b + 3, z, GOLD); put(x, b + 3, z - 1, GOLD); put(x, b + 3, z + 1, GOLD);
  put(x, b + 3, z, RED);
}
goblet(-9, -3); goblet(8, -3); goblet(-4, 12);
// glowing gems among the coins
for (const [x, z, id] of [[-8, 4, NEON_BLUE], [6, -12, NEON_RED], [-2, -12, NEON_BLUE], [9, 3, NEON_RED], [-12, 8, NEON_BLUE], [3, 12, GLOWSTONE]])
  put(x, top(x, z) + 1, z, id);
// open treasure chest, front-left, spilling gold
(function chest(x0, z0) {
  const b = Math.max(top(x0, z0), -1) + 1;
  hollowBox(x0, b, z0, x0 + 3, b + 1, z0 + 2, BROWN);
  for (let x = x0 + 1; x <= x0 + 2; x++) put(x, b + 1, z0 + 1, GOLD);
  put(x0 + 1, b + 2, z0 + 1, GOLD); put(x0 + 2, b + 2, z0 + 1, YELLOW);
  for (let x = x0; x <= x0 + 3; x++) { put(x, b + 2, z0 + 3, BROWN); put(x, b + 3, z0 + 3, BROWN); } // lid flung open
  put(x0, b, z0, GOLD); put(x0 + 3, b, z0, GOLD); put(x0 + 1, b + 1, z0, GOLD); // corners + latch
  for (let k = 0; k < 4; k++) put(x0 + 1 + k * 0.4, 0, z0 - 1 - k, GOLD);
})(-12, -12);
// round shield leaning in the foreground, facing the camera
(function shield(cx, cy, cz) {
  for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) {
    const d = Math.hypot(x, y);
    if (d > 2.3) continue;
    put(cx + x, cy + y, cz + (y > 0 ? 1 : 0), d > 1.6 ? GOLD : (d < 0.5 ? IRON : BLUE));
  }
})(8, 2, -14);
// the knight who came before
(function bones(x, z) {
  put(x, 0, z, WHITE); put(x, 1, z, WHITE); put(x + 1, 0, z, BLACK);                   // skull
  put(x - 1, 0, z + 1, IRON); put(x - 1, 1, z + 1, IRON); put(x - 2, 0, z + 1, IRON);  // dented helm
  pline([x + 1, 0, z + 1], [x + 3, 0, z + 2], WHITE); pline([x, 0, z + 2], [x + 1, 0, z + 4], WHITE);
  pline([x + 3, 0, z - 1], [x + 6, 0, z - 1], IRON); put(x + 2, 0, z - 1, GOLD);         // dropped sword
})(-16, -8);

// ---------- braziers flanking the hoard ----------
for (const [bx, bz] of [[-15, -3], [15, -3]]) {
  for (let y = 0; y <= 2; y++) put(bx, y, bz, y === 0 ? COBBLE : STONE);
  put(bx, 3, bz, GOLD); put(bx - 1, 3, bz, GOLD); put(bx + 1, 3, bz, GOLD); put(bx, 3, bz - 1, GOLD); put(bx, 3, bz + 1, GOLD);
  put(bx, 4, bz, FIRE);
}

// ---------- ruined marble temple behind ----------
function column(x, z, h, broken) {
  for (let y = -2; y <= h; y++)
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
      const d = Math.hypot(dx, dz);
      const plinth = y <= 0 || (!broken && y >= h - 1);
      if (plinth ? true : d <= 2.25) {
        if (broken && y > h - 3 && hsh(x + dx, y, z + dz) < 0.5 + (y - h + 3) * 0.2) continue;
        PRI = dz > 0 ? 0.5 : 1;
        put(x + dx, y, z + dz, (dx === 0 || dz === 0) && y > 0 && y % 3 === 0 && !plinth ? WHITE : MARBLE);
      }
    }
  PRI = 3;
}
column(-14, 15, 13, false);
column(-6, 17, 9, true);
column(7, 16, 15, false);
column(14, 14, 15, false);
// cracked lintel spanning the two tall eastern columns
PRI = 1;
for (let t = 0; t <= 1; t += 0.05) {
  const x = 7 + 7 * t, z = 16 - 2 * t;
  for (let y = 16; y <= 17; y++) for (let w = -1; w <= 1; w++) if (!(t > 0.4 && t < 0.5 && y === 17)) put(x, y, z + w, MARBLE);
}
// fallen drum of the broken column
for (let x = -9; x <= -3; x++) for (let y = 0; y <= 2; y++) for (let dz = -1; dz <= 1; dz++)
  if (Math.hypot(y - 1, dz) <= 1.3) put(x, y, 20 + dz, MARBLE);
PRI = 3;

// ---------- emit only visible (exposed) voxels ----------
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
// stay within budget: drop lowest-priority voxels first (stray coins, column backs)
if (out.length > 3990) { out.sort((p, q) => q[4] - p[4]); out.length = 3990; }
out.sort((p, q) => p[1] - q[1]);
for (const [x, y, z, id] of out) block(x, y, z, id);