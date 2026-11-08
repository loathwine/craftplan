// pocket-watch-opus — prompt:
// a giant open pocket watch with ticking gears...

const S = new Map();
function P(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  S.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
const X0 = 4, Y0 = 14;
function W(sx, sy, z, id) { P(X0 - sx, Y0 + sy, z, id); }

cube(-22, 1, -22, 22, 8, 12, AIR);

function gearCells(r, teeth, spokes, phase) {
  const out = [];
  const R = Math.ceil(r + 1.3);
  for (let a = -R; a <= R; a++) for (let b = -R; b <= R; b++) {
    const d = Math.hypot(a, b), ang = Math.atan2(b, a);
    let t = null;
    if (d <= 1.3) t = 'hub';
    else if (d <= r && (r < 2.8 || d >= r - 1.4)) t = 'rim';
    else if (d > r && d <= r + 1.15) {
      let f = ((ang + phase) * teeth / (2 * Math.PI)) % 1; if (f < 0) f += 1;
      if (f < 0.5) t = 'rim';
    } else if (d < r - 1.4 && spokes > 0) {
      for (let k = 0; k < spokes; k++) {
        const dl = ang - (phase + k * 2 * Math.PI / spokes);
        if (d * Math.abs(Math.sin(dl)) < 0.6 && Math.cos(dl) > 0) t = 'rim';
      }
    }
    if (t) out.push([a, b, t]);
  }
  return out;
}
function gearDial(gx, gy, z, r, teeth, spokes, phase, id, hub) {
  for (const [a, b, t] of gearCells(r, teeth, spokes, phase)) W(gx + a, gy + b, z, t === 'hub' ? hub : id);
}
function gearXY(cx, cy, zs, r, teeth, spokes, phase, id, hub) {
  for (const z of zs) for (const [a, b, t] of gearCells(r, teeth, spokes, phase)) P(cx + a, cy + b, z, t === 'hub' ? hub : id);
}
function gearFlat(cx, y, cz, r, teeth, spokes, phase, id, hub) {
  for (const [a, b, t] of gearCells(r, teeth, spokes, phase)) P(cx + a, y, cz + b, t === 'hub' ? hub : id);
}

for (let sx = -13; sx <= 13; sx++) for (let sy = -13; sy <= 13; sy++) {
  const d = Math.hypot(sx, sy);
  if (d > 12.5) continue;
  W(sx, sy, 4, GOLD);
  if (d >= 11.5) for (let z = -1; z <= 3; z++) W(sx, sy, z, GOLD);
  if (d >= 10) W(sx, sy, -1, GOLD);
  if (d >= 9.6) W(sx, sy, -2, GOLD);
  if (d >= 10.8 && d <= 11.8) W(sx, sy, -3, GOLD);
  if (d <= 10.5 && sy <= 1) W(sx, sy, 3, IRON);
  if (d <= 10.2) {
    if (d < 6.6 && sy < 0.5) { }
    else if (d < 7.3) W(sx, sy, 0, GOLD);
    else W(sx, sy, 0, MARBLE);
    if (d < 6.6 && sy >= 0.5) {
      W(sx, sy, 0, MARBLE);
      if (Math.hypot(sx, sy - 2.8) <= 2.6 && sy >= 3) W(sx, sy, 0, BLUE);
    }
  }
}
W(1, 4, 0, GOLD); W(1, 5, 0, GOLD); W(2, 4, 0, GOLD);
W(-1, 4, 0, GLOWSTONE);

gearDial(-1, -3, 2, 4.2, 12, 4, 0.2, COPPER, GOLD);
gearDial(4, -2, 1, 2.4, 8, 0, 0.3, GOLD, IRON);
gearDial(-5, -2, 1, 2.4, 8, 0, 0.0, IRON, GOLD);
gearDial(2, -6, 1, 1.8, 6, 0, 0.5, GOLD, COPPER);
W(-1, -3, 1, NEON_RED); W(4, -2, 0, NEON_RED); W(-5, -2, 0, NEON_RED); W(2, -6, 0, NEON_RED);
W(0, 0, 0, GOLD); W(0, 0, 1, IRON); W(0, 0, 2, IRON);

for (let h = 0; h < 12; h++) {
  const th = h * Math.PI / 6, s = Math.sin(th), c = Math.cos(th);
  if (h % 3 === 0) { W(8.2 * s, 8.2 * c, -1, BLACK); W(9.2 * s, 9.2 * c, -1, BLACK); }
  else W(8.8 * s, 8.8 * c, -1, BLACK);
}

function hand(deg, L, tail, id, wide) {
  const th = deg * Math.PI / 180, s = Math.sin(th), c = Math.cos(th);
  for (let t = -tail; t <= L; t += 0.25) {
    W(t * s, t * c, -1, id);
    if (wide && t >= 1 && t <= L * 0.7) {
      W(t * s + 0.45 * c, t * c - 0.45 * s, -1, id);
      W(t * s - 0.45 * c, t * c + 0.45 * s, -1, id);
    }
  }
}
hand(305, 5.2, 0, BLUE, true);
hand(60, 7.8, 0, BLUE, true);
hand(198, 9, 2.5, RED, false);
W(0, 0, -2, GOLD);

P(X0, 27, 1, IRON); P(X0 - 1, 27, 1, IRON); P(X0 + 1, 27, 1, IRON); P(X0, 27, 0, IRON); P(X0, 27, 2, IRON);
for (let y = 28; y <= 29; y++) for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) {
  const d = Math.hypot(a, b);
  if (d <= 2.3) P(X0 + a, y, 1 + b, GOLD);
  else if (d <= 3 && (a === 0 || b === 0)) P(X0 + a, y, 1 + b, GOLD);
}
for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (Math.abs(a) + Math.abs(b) <= 1) P(X0 + a, 30, 1 + b, GOLD);
for (let x = -4; x <= 4; x++) for (let y = 29; y <= 33; y++) {
  const d = Math.hypot(x, y - 30);
  if (d >= 2.4 && d <= 3.4) P(X0 + x, y, 1, GOLD);
}

const HX = -9, HZ = -2;
for (let y = 8; y <= 20; y++) P(HX, y, HZ, GOLD);
for (const y of [9, 14, 19]) { P(HX + 1, y, HZ, GOLD); P(HX, y, HZ - 1, GOLD); }
const LTH = 126 * Math.PI / 180, LC = Math.cos(LTH), LS = Math.sin(LTH), LR = 11;
const path = [];
let prev = null;
for (let u = 0; u <= 2 * LR + 0.01; u += 0.1) {
  const x = Math.round(HX + u * LC), z = Math.round(HZ - u * LS);
  if (prev && prev.x === x && prev.z === z) continue;
  if (prev && prev.x !== x && prev.z !== z) path.push({ x: x, z: prev.z, u: u });
  path.push({ x: x, z: z, u: u });
  prev = { x: x, z: z };
}
for (const cell of path) {
  for (let v = -LR; v <= LR; v++) {
    const du = cell.u - LR, r = Math.hypot(du, v);
    if (r > LR) continue;
    let id = GOLD;
    const phi = Math.atan2(v, du);
    if (r >= 8.4 && r <= 9.3) id = COPPER;
    else if (r >= 2.2 && r <= 7.6) {
      for (let k = 0; k < 12; k++) {
        const dl = phi - k * Math.PI / 6;
        const len = k % 2 ? 5.5 : 7.6;
        if (r <= len && r * Math.abs(Math.sin(dl)) < 0.55 && Math.cos(dl) > 0) id = COPPER;
      }
    } else if (r < 1.2) id = NEON_RED;
    P(cell.x, Y0 + v, cell.z, id);
  }
}

gearXY(-7, 24, [7, 8], 7, 14, 6, 0.1, COPPER, GOLD);
gearXY(16, 21, [6, 7], 5, 11, 5, 0.25, IRON, COPPER);
gearXY(11, 29, [7], 3, 8, 0, 0.0, GOLD, IRON);

const CP = [[4, 33, 1], [8, 32, 0], [12, 29, -2], [16, 24, -4], [18.5, 17, -6], [19, 10, -8], [18, 4, -10], [16, 1, -12],
  [12, 1, -14], [8, 1, -14], [6, 1, -12], [7, 1, -10], [10, 1, -9], [12, 1, -10]];
function cr(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
for (let i = 0; i < CP.length - 1; i++) {
  const p0 = CP[Math.max(0, i - 1)], p1 = CP[i], p2 = CP[i + 1], p3 = CP[Math.min(CP.length - 1, i + 2)];
  for (let t = 0; t <= 1; t += 0.05) {
    const x = cr(p0[0], p1[0], p2[0], p3[0], t), y = cr(p0[1], p1[1], p2[1], p3[1], t), z = cr(p0[2], p1[2], p2[2], p3[2], t);
    P(x, Math.max(1, y), z, GOLD);
  }
}
P(13, 1, -11, GOLD); P(13, 1, -10, GOLD); P(13, 1, -9, GOLD); P(14, 1, -10, COPPER);

gearFlat(-5, 1, -12, 2.6, 8, 0, 0.2, IRON, GOLD);
gearFlat(0, 1, -17, 3.4, 10, 3, 0.0, GOLD, COPPER);
gearFlat(-6, 1, -6, 1.8, 6, 0, 0.0, COPPER, IRON);
P(8, 1, -5, IRON); P(1, 1, -8, IRON); P(5, 1, -10, IRON); P(-1, 1, -11, GOLD);

for (let sx = -8; sx <= 8; sx++) {
  const ly = Y0 - Math.floor(Math.sqrt(156.25 - sx * sx));
  for (let y = 1; y < ly; y++) for (let z = -2; z <= 4; z++) P(X0 - sx, y, z, BROWN);
  P(X0 - sx, 1, -3, GOLD);
}

let solid = 0;
for (const v of S.values()) if (v[3] !== AIR) solid++;
const PCX = 5, PCZ = -6;
let pr = 16;
for (; pr > 0; pr--) {
  let n = 0;
  for (let a = -pr; a <= pr; a++) for (let b = -pr; b <= pr; b++)
    if (Math.hypot(a, b) <= pr + 0.3 && !S.has((PCX + a) + ',0,' + (PCZ + b))) n++;
  if (solid + n <= 3990) break;
}
for (let a = -pr; a <= pr; a++) for (let b = -pr; b <= pr; b++) {
  const d = Math.hypot(a, b);
  if (d > pr + 0.3) continue;
  const k = (PCX + a) + ',0,' + (PCZ + b);
  if (!S.has(k)) P(PCX + a, 0, PCZ + b, d > pr - 0.8 ? GOLD : RED);
}

for (const [x, y, z, id] of S.values()) block(x, y, z, id);