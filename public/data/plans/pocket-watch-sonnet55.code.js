// pocket-watch-sonnet55 — prompt:
// a giant open pocket watch with ticking gears...

cube(-22, 1, -12, 22, 10, 8, AIR);

const M = new Map();
const CAP = 3950;
const TAU = Math.PI * 2;
const P = (x, y, z, id) => {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
};

const CX = 0, CY = 16;
// screen-right is -X (camera looks south), so clock angles use -sin
const pol = (deg, r) => {
  const a = deg * Math.PI / 180;
  return [CX - r * Math.sin(a), CY + r * Math.cos(a)];
};

function cells(r, n, ph, o) {
  o = o || {};
  const rin = o.rin !== undefined ? o.rin : r * 0.7;
  const sp = o.sp !== undefined ? o.sp : 4;
  const hr = o.hr !== undefined ? o.hr : 1.3;
  const tl = o.tl !== undefined ? o.tl : 1.2;
  const solid = !!o.solid;
  const R = Math.ceil(r + tl) + 1, out = [];
  for (let u = -R; u <= R; u++) for (let v = -R; v <= R; v++) {
    const d = Math.hypot(u, v), a = Math.atan2(v, u);
    let s = false, h = false;
    if (d <= hr) { s = true; h = true; }
    else if (d <= r) {
      if (solid || d >= rin) s = true;
      else for (let k = 0; k < sp; k++) {
        const df = a - (ph + k * TAU / sp);
        if (Math.cos(df) > 0 && Math.abs(Math.sin(df)) * d <= 0.8) { s = true; break; }
      }
    } else if (tl > 0 && d <= r + tl) {
      if (Math.cos(n * (a - ph)) > 0.1) s = true;
    }
    if (s) out.push([u, v, h]);
  }
  return out;
}
function putXY(cs, cx, cy, z1, z2, id, hid) {
  for (const [u, v, h] of cs) for (let z = z1; z <= z2; z++) P(cx + u, cy + v, z, h ? hid : id);
}
function putXZ(cs, cx, cz, y1, y2, id, hid) {
  for (const [u, v, h] of cs) for (let y = y1; y <= y2; y++) P(cx + u, y, cz + v, h ? hid : id);
}
function mesh(A, B) {
  const th = Math.atan2(B.y - A.y, B.x - A.x);
  const uA = A.n * (th - A.ph) / TAU;
  return th + Math.PI - TAU * (uA + 0.5) / B.n;
}
function ln2(x1, y1, x2, y2, z, id) {
  const n = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 1.5) + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    P(x, y, z, id); P(x + 1, y, z, id);
  }
}

// ---------- BACK PLATE (sunburst) ----------
for (let x = -14; x <= 14; x++) for (let y = 2; y <= 30; y++) {
  const d = Math.hypot(x - CX, y - CY);
  if (d <= 12.4) {
    const ang = Math.atan2(y - CY, x - CX);
    const sec = Math.floor((ang + Math.PI) / (Math.PI / 18));
    P(x, y, 3, sec % 2 ? BLACK : GRAY);
  }
}

// ---------- CASE WALL, BEZEL, CHAPTER RING ----------
for (let x = -15; x <= 15; x++) for (let y = 1; y <= 31; y++) {
  const d = Math.hypot(x - CX, y - CY);
  if (d >= 12.4 && d <= 13.5) {
    for (let z = -1; z <= 4; z++) P(x, y, z, z === 1 ? COPPER : GOLD);
  }
  if (d >= 12.3 && d <= 13.5) P(x, y, -2, d < 12.8 ? COPPER : GOLD);
  if (d >= 13.0 && d <= 13.5) P(x, y, -3, GOLD);
  if (d >= 10.6 && d < 12.4) P(x, y, -1, MARBLE);
}

// ---------- GEAR TRAIN ----------
const gs = {
  G1: { x: -3, y: 20, r: 4.5, n: 14, ph: 0.2, id: GOLD, hid: IRON, o: { sp: 5 } },
  G2: { x: 5, y: 21, r: 2.6, n: 8, id: COPPER, hid: GOLD, o: { sp: 3, hr: 1, rin: 1.8 } },
  G3: { x: 7, y: 15, r: 2.7, n: 8, id: IRON, hid: GOLD, o: { sp: 3, hr: 1, rin: 1.9 } },
  G4: { x: -7, y: 14, r: 2.4, n: 8, id: GOLD, hid: COPPER, o: { sp: 3, hr: 1, rin: 1.7 } },
  G5: { x: -4, y: 10, r: 2.8, n: 9, id: IRON, hid: GOLD, o: { sp: 3, hr: 1, rin: 2 } },
  G6: { x: 1, y: 25, r: 1.6, n: 5, id: GOLD, hid: IRON, o: { solid: true, hr: 0.6 } },
  ESC: { x: 0, y: 13, r: 1.3, n: 10, ph: 0, id: IRON, hid: GOLD, o: { solid: true, hr: 0.6, tl: 1.2 } }
};
gs.G2.ph = mesh(gs.G1, gs.G2);
gs.G3.ph = mesh(gs.G2, gs.G3);
gs.G6.ph = mesh(gs.G2, gs.G6);
gs.G4.ph = mesh(gs.G1, gs.G4);
gs.G5.ph = mesh(gs.G4, gs.G5);
for (const k in gs) {
  const g = gs[k];
  putXY(cells(g.r, g.n, g.ph, g.o), g.x, g.y, 1, 2, g.id, g.hid);
}

// balance wheel + hairspring
const BX = 4, BY = 10;
putXY(cells(3.6, 0, 0.3, { tl: 0, sp: 3, hr: 1.2, rin: 2.8 }), BX, BY, 0, 1, IRON, GOLD);
for (let k = 0; k < 4; k++) {
  const a = k * Math.PI / 2 + 0.5;
  P(BX + 3.4 * Math.cos(a), BY + 3.4 * Math.sin(a), 0, COPPER);
  P(BX + 3.4 * Math.cos(a), BY + 3.4 * Math.sin(a), 1, COPPER);
}
for (let a = 0; a < 22; a += 0.12) {
  const r = 0.9 + a * 0.085;
  P(BX + r * Math.cos(a), BY + r * Math.sin(a), 2, IRON);
}

// bridges and jewels
ln2(-3, 20, 5, 21, 0, COPPER);
ln2(5, 21, 7, 15, 0, COPPER);
ln2(-3, 20, -7, 14, 0, COPPER);
ln2(-7, 14, -4, 10, 0, COPPER);
ln2(0, 13, 4, 10, -1, COPPER);
for (const k in gs) { P(gs[k].x, gs[k].y, -1, RED); P(gs[k].x, gs[k].y, 0, GOLD); }
P(BX, BY, -1, GLOWSTONE);
P(CX + 0, CY + 0, 0, GLOWSTONE);
for (const [sx, sy] of [[-1, 24], [9, 18], [-9, 18], [-8, 8], [8, 8], [-1, 6]]) {
  P(sx, sy, -1, IRON); P(sx, sy, 0, IRON);
}

// ---------- DIAL MARKERS ----------
for (let m = 0; m < 60; m++) {
  if (m % 5 === 0) continue;
  const [x, y] = pol(m * 6, 11.1);
  P(x, y, -2, BLACK);
}
for (let h = 0; h < 12; h++) {
  const [x, y] = pol(h * 30, 11.4);
  const fx = Math.floor(x), fy = Math.floor(y);
  const id = h === 0 ? RED : BLACK;
  P(fx, fy, -2, id); P(fx + 1, fy, -2, id); P(fx, fy + 1, -2, id); P(fx + 1, fy + 1, -2, id);
  if (h % 3 === 0) { const [ix, iy] = pol(h * 30, 10.5); P(ix, iy, -2, id); }
}

// ---------- HANDS (10:10) ----------
function spade(cx, cy, r, z, id) {
  for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++)
    if (Math.hypot(x, y) <= r) P(cx + x, cy + y, z, id);
}
function hand(deg, len, id, z) {
  for (let s = -3; s <= len; s += 0.35) {
    const [x, y] = pol(deg, s);
    P(x, y, z, id);
    if (s < len * 0.55 && s > -3) { P(x + 1, y, z, id); P(x, y + 1, z, id); }
  }
  const [sx, sy] = pol(deg, len * 0.72);
  spade(Math.round(sx), Math.round(sy), 1.5, z, id);
}
hand(300, 6.5, BLUE, -3);
hand(60, 10, BLUE, -4);
for (let s = -3; s <= 9; s += 0.4) { const [x, y] = pol(200, s); P(x, y, -5, RED); }
for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) for (let z = -6; z <= -3; z++)
  if (Math.hypot(x, y, (z + 4.5) * 1.1) <= 2.1) P(CX + x, CY + y, z, z === -6 ? RED : GOLD);

// ---------- CROWN & BOW ----------
for (let x = -2; x <= 2; x++) for (let z = -1; z <= 3; z++)
  if (x * x + (z - 1) * (z - 1) <= 5) P(x, 30, z, (Math.abs(x + z) % 2) ? IRON : GOLD);
for (let x = -4; x <= 4; x++) for (let y = 29; y <= 34; y++) {
  const o = (x / 3.2) ** 2 + ((y - 32) / 1.9) ** 2;
  const i = (x / 1.8) ** 2 + ((y - 32) / 0.9) ** 2;
  if (o <= 1 && i > 1) for (let z = 0; z <= 2; z++) P(x, y, z, GOLD);
}

// ---------- PEDESTAL ----------
function ell(y, rx, rz, fn) {
  for (let x = -rx - 1; x <= rx + 1; x++) for (let z = -8; z <= 9; z++) {
    const q = (x / rx) ** 2 + ((z - 1) / rz) ** 2;
    if (q <= 1) P(x, y, z, fn(q, x, z));
  }
}
ell(-1, 9, 6.5, () => OBSIDIAN);
ell(0, 8, 5.5, (q) => q > 0.8 ? GOLD : MARBLE);
ell(1, 7, 4.5, () => OBSIDIAN);
ell(2, 6, 3.5, (q) => q > 0.7 ? GOLD : RED);
cube(7, 3, -1, 8, 5, 3, GOLD);
cube(-8, 3, -1, -7, 5, 3, GOLD);

// ---------- OPEN LID (hinged, swung back) ----------
const LX = 7, LY = 18;
for (let x = -22; x <= 22; x++) for (let y = 2; y <= 33; y++) {
  const dl = Math.hypot(x - LX, y - LY), dw = Math.hypot(x - CX, y - CY);
  if (dl <= 13.5 && dw > 13.7) {
    const ring = Math.floor(dl / 1.5);
    P(x, y, 5, dl > 12.2 ? GOLD : (ring % 2 ? COPPER : GOLD));
    if (dl > 12.2) { P(x, y, 4, GOLD); P(x, y, 6, GOLD); }
  }
}
for (let y = 9; y <= 23; y++) {
  const id = (Math.floor(y / 3) % 2) ? COPPER : GOLD;
  for (let x = 13; x <= 14; x++) for (let z = 4; z <= 5; z++) P(x, y, z, id);
}
for (let y = 0; y <= 10; y++) P(18, y, 5, IRON);

// ---------- CHAIN & FOB ----------
let prev = null, idx = 0;
for (let t = 0; t <= 1.0001; t += 0.015) {
  const a = (1 - t) * (1 - t), b = 2 * t * (1 - t), c = t * t;
  const x = a * 3 + b * 22 + c * 18;
  const y = a * 32 + b * 33 + c * 4;
  const z = a * 1 + b * -3 + c * -7;
  const cur = [Math.round(x), Math.round(y), Math.round(z)];
  if (prev) {
    const n = Math.max(Math.abs(cur[0] - prev[0]), Math.abs(cur[1] - prev[1]), Math.abs(cur[2] - prev[2]), 1);
    for (let i = 1; i <= n; i++) {
      const f = i / n;
      P(prev[0] + (cur[0] - prev[0]) * f, prev[1] + (cur[1] - prev[1]) * f, prev[2] + (cur[2] - prev[2]) * f, idx % 2 ? IRON : GOLD);
    }
  }
  if (idx % 2) P(cur[0], cur[1], cur[2] + 1, GOLD);
  else P(cur[0] + 1, cur[1], cur[2], IRON);
  prev = cur; idx++;
}
for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) {
  const d = Math.hypot(x, y);
  if (d <= 2.2) for (let z = -7; z <= -6; z++) P(18 + x, 2 + y, z, d < 1 ? RED : (d > 1.6 ? COPPER : GOLD));
}

// ---------- GEAR TOWER (west) ----------
const TW = { x: -15, z: -4 };
for (let y = 0; y <= 12; y++) P(TW.x, y, TW.z, IRON);
[[0, 1, 4.5, 14, IRON, GOLD], [3, 4, 3.5, 11, GOLD, IRON], [6, 7, 2.5, 8, COPPER, GOLD], [9, 10, 1.8, 6, GOLD, IRON]]
  .forEach(([y1, y2, r, n, id, hid], i) => {
    putXZ(cells(r, n, i * 0.7, { sp: 4, hr: 1, rin: r * 0.65 }), TW.x, TW.z, y1, y2, id, hid);
  });
P(TW.x, 11, TW.z, GLOWSTONE); P(TW.x, 12, TW.z, RED);

// ---------- LOOSE GEARS ON THE GROUND ----------
putXZ(cells(3, 9, 0.4, { sp: 3, hr: 1, rin: 2 }), -5, -10, 0, 0, COPPER, GOLD);
putXZ(cells(2, 6, 1.2, { sp: 3, hr: 0.6, rin: 1.2 }), 1, -10, 0, 0, GOLD, IRON);
putXZ(cells(3, 9, 0.9, { sp: 4, hr: 1, rin: 2 }), 9, -11, 0, 0, IRON, GOLD);
putXZ(cells(1.5, 5, 0.2, { solid: true, hr: 0.5 }), 14, -10, 0, 0, GOLD, IRON);

// ---------- EMIT ----------
let cnt = 0;
for (const v of M.values()) {
  if (cnt++ >= CAP) break;
  block(v[0], v[1], v[2], v[3]);
}