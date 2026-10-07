// bowser-sonnet55 — prompt:
// Bowser...

const M = new Map(); let cnt = 0; const SOFT = 3700, HARD = 3995;
function put(x, y, z, id, hard) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z; const had = M.get(k);
  if (id === AIR) { if (had && had[3] !== AIR) cnt--; M.set(k, [x, y, z, AIR]); return; }
  if (!had || had[3] === AIR) { if (cnt >= (hard ? HARD : SOFT)) return; cnt++; }
  M.set(k, [x, y, z, id]);
}
function box(x1, y1, z1, x2, y2, z2, id, hard) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id, hard);
}
function ell(cx, cy, cz, rx, ry, rz, fn, th, hard) {
  const f = typeof fn === 'function' ? fn : () => fn;
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz > 1) continue;
        if (th) {
          const ix = (x - cx) / (rx - th), iy = (y - cy) / (ry - th), iz = (z - cz) / (rz - th);
          if (ix * ix + iy * iy + iz * iz < 1) continue;
        }
        const id = f(x, y, z, x - cx, y - cy, z - cz);
        if (id != null) put(x, y, z, id, hard);
      }
}
function ball(cx, cy, cz, r, id, hard) {
  const q = (r + 0.4) * (r + 0.4), e = Math.ceil(r + 1);
  for (let x = Math.floor(cx) - e; x <= Math.ceil(cx) + e; x++)
    for (let y = Math.floor(cy) - e; y <= Math.ceil(cy) + e; y++)
      for (let z = Math.floor(cz) - e; z <= Math.ceil(cz) + e; z++) {
        const d = (x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2;
        if (d <= q) put(x, y, z, id, hard);
      }
}
function tube(pts, r0, r1, id, hard) {
  let total = 0; const L = [];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
    L.push(l); total += l;
  }
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const n = Math.ceil(L[i - 1] * 2);
    for (let s = 0; s <= n; s++) {
      const t = s / n, u = (acc + L[i - 1] * t) / total;
      ball(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t,
           pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t,
           pts[i - 1][2] + (pts[i][2] - pts[i - 1][2]) * t,
           r0 + (r1 - r0) * u, id, hard);
    }
    acc += L[i - 1];
  }
}
function spike(px, py, pz, dx, dy, dz, len, r, id, hard) {
  const m = Math.hypot(dx, dy, dz); dx /= m; dy /= m; dz /= m;
  for (let i = 0; i < len; i++)
    ball(px + dx * i, py + dy * i, pz + dz * i, Math.max(0.2, r * (1 - i / len)), id, hard);
}

// ---- clear site ----
for (let x = -13; x <= 13; x++) for (let z = -21; z <= 13; z++) for (let y = 0; y <= 10; y++) put(x, y, z, AIR);

// ---- legs & feet ----
for (const s of [-1, 1]) {
  box(s * 3, 3, -3, s * 6, 7, 1, ORANGE);
  box(s * 3, 0, -6, s * 6, 2, 1, ORANGE);
  box(s * 3, 2, -6, s * 6, 2, -6, YELLOW);
  for (let i = 3; i <= 6; i++) { put(s * i, 0, -7, WHITE, true); put(s * i, 1, -7, WHITE, true); }
  put(s * 3, 2, -7, WHITE, true); put(s * 6, 2, -7, WHITE, true);
  box(s * 3, 5, -4, s * 6, 5, -4, YELLOW, true);
}

// ---- torso ----
ell(0, 11, 0, 8, 7, 5.5, (x, y, z, dx, dy, dz) => {
  if (dz > 3.5) return null;
  if (dz < -3.6 && Math.abs(dx) <= 5.6 && dy > -6 && dy < 4.5) return (((y % 3) + 3) % 3 === 0) ? ORANGE : YELLOW;
  return ORANGE;
}, 1.5);
box(-3, 16, -6, 3, 18, -2, ORANGE);

// ---- head ----
ell(0, 22.5, -5.5, 5.5, 5, 5, ORANGE, 1.4);
box(-3, 20, -11, 3, 22, -8, YELLOW);
box(-2, 23, -10, 2, 23, -9, YELLOW);
box(-3, 16, -10, 3, 17, -7, ORANGE);
box(-4, 18, -9, -4, 19, -7, ORANGE); box(4, 18, -9, 4, 19, -7, ORANGE);
box(-3, 18, -12, 3, 19, -8, AIR);
box(-3, 18, -7, 3, 19, -7, RED, true);
box(-2, 17, -9, 2, 17, -7, PINK, true);
put(-1, 22, -11, BLACK, true); put(1, 22, -11, BLACK, true);
for (const x of [-3, -1, 1, 3]) put(x, 19, -11, WHITE, true);
for (const x of [-2, 0, 2]) put(x, 18, -10, WHITE, true);
for (const s of [-1, 1]) { put(s * 2, 18, -11, WHITE, true); put(s * 2, 19, -11, WHITE, true); put(s * 2, 17, -11, WHITE, true); }
for (const s of [-1, 1]) {
  box(s * 2, 24, -10, s * 3, 25, -10, WHITE, true);
  put(s * 2, 24, -11, NEON_RED, true); put(s * 2, 25, -11, NEON_RED, true);
  put(s * 3, 25, -11, WHITE, true);
  box(s * 1, 26, -10, s * 2, 26, -9, RED, true);
  box(s * 3, 27, -10, s * 4, 27, -9, RED, true);
  box(s * 4, 26, -9, s * 4, 26, -8, RED, true);
  put(s * 3, 26, -10, BLACK, true);
}

// ---- arms ----
for (const s of [-1, 1]) {
  ball(s * 8.5, 14.5, -1.5, 2.6, ORANGE);
  tube([[s * 9.5, 14, -2], [s * 10, 10.5, -4.5], [s * 8.5, 12.5, -9]], 1.9, 1.7, ORANGE);
  ball(s * 8.2, 13.5, -9.8, 2.3, ORANGE);
  for (const o of [-1, 0, 1]) spike(s * 8.2 + o * 1.4, 13.5 + (o === 0 ? 0.6 : 0), -11.5, 0, -0.1, -1, 3, 0.6, WHITE, true);
  ell(s * 9.4, 11.6, -6.5, 2.7, 2.7, 2.7, BLACK, 1);
  spike(s * 11.6, 12.2, -6.5, s, 0.4, 0, 3, 0.9, WHITE, true);
  spike(s * 9.8, 14, -6.5, s * 0.4, 1, 0, 3, 0.9, WHITE, true);
  spike(s * 10.5, 12, -8.5, s * 0.6, 0.2, -1, 3, 0.9, WHITE, true);
  spike(s * 10.5, 12, -4.5, s * 0.6, 0.2, 1, 3, 0.9, WHITE, true);
}

// ---- shell ----
const SC = [0, 13, 5], SR = [9.5, 9.5, 6.5];
ell(SC[0], SC[1], SC[2], SR[0], SR[1], SR[2], (x, y, z) => {
  if (z < 1) return null;
  if (z <= 2) return YELLOW;
  return ((Math.floor(x / 3) + Math.floor(y / 3) + Math.floor(z / 3)) & 1) ? LIME : GREEN;
}, 1.3);
for (const n of [[0, 1, 0.15], [0.55, 0.85, 0.3], [-0.55, 0.85, 0.3], [0.95, 0.4, 0.2], [-0.95, 0.4, 0.2], [0.98, -0.1, 0.25], [-0.98, -0.1, 0.25], [0, 0.55, 0.9], [0.6, 0.4, 0.8], [-0.6, 0.4, 0.8]]) {
  const m = Math.hypot(n[0], n[1], n[2]), nx = n[0] / m, ny = n[1] / m, nz = n[2] / m;
  spike(SC[0] + SR[0] * nx * 0.92, SC[1] + SR[1] * ny * 0.92, SC[2] + SR[2] * nz * 0.92, nx, ny, nz, 5, 1.5, WHITE, true);
}

// ---- spiked collar ----
for (let x = -9; x <= 9; x++) for (let z = -8; z <= 2; z++) for (let y = 15; y <= 16; y++) {
  const v = (x / 7.2) ** 2 + ((z + 0.5) / 5.9) ** 2;
  if (v >= 0.7 && v <= 1.25) put(x, y, z, BLACK, true);
}
for (let k = 0; k <= 8; k += 2) {
  const a = Math.PI + k * Math.PI / 8, c = Math.cos(a), sn = Math.sin(a);
  spike(7.2 * c * 1.05, 16, -0.5 + 5.9 * sn * 1.05, c, 0.3, sn, 3, 1.0, WHITE, true);
}

// ---- horns & hair ----
for (const s of [-1, 1]) {
  tube([[s * 4.5, 25, -4], [s * 7, 26.5, -4.5], [s * 8.2, 29, -5], [s * 7, 32, -6.4]], 2.0, 0.5, WHITE, true);
  for (const h of [[2.5, 26.5, -4.5, 0.3, 1, 0.4, 6, 1.5], [4.5, 25.5, -2.5, 0.7, 0.8, 0.5, 5, 1.4], [3, 25, -0.5, 0.4, 0.5, 1, 6, 1.5], [5, 19, -6, 1, -0.4, -0.2, 4, 1.3], [4.5, 17.5, -7, 0.6, -1, -0.4, 4, 1.3]])
    spike(s * h[0], h[1], h[2], s * h[3], h[4], h[5], h[6], h[7], RED, true);
}
spike(0, 27, -5, 0, 1, 0.5, 7, 1.7, RED, true);
spike(0, 25, -1, 0, 0.5, 1, 7, 1.6, RED, true);
spike(0, 17, -8, 0, -1, -0.3, 4, 1.2, RED, true);

// ---- fire breath ----
for (const p of [[0, 19, -13], [0, 19, -14], [1, 19, -15], [-1, 19, -15], [0, 20, -16], [2, 20, -17], [-2, 18, -17], [0, 19, -18], [1, 21, -19], [-1, 19, -20], [3, 19, -19]]) put(p[0], p[1], p[2], FIRE, true);

// ---- castle floor with lava ring ----
for (let x = -10; x <= 10; x++) for (let z = -10; z <= 10; z++) {
  const r = Math.hypot(x, z);
  if (r <= 8.5) put(x, -1, z, ((x + z) & 1) ? BLACK : GRAY);
  else if (r <= 9.6) put(x, -1, z, LAVA);
}

// ---- emit ----
for (const v of M.values()) block(v[0], v[1], v[2], v[3]);