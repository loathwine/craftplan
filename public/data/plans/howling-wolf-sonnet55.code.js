// howling-wolf-sonnet55 — prompt:
// a wolf howling at the moon...

// A wolf howling at the moon
const vox = new Map();
const K = (x, y, z) => ((x + 22) * 45 + (z + 22)) * 42 + (y + 8);
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  vox.set(K(x, y, z), [x, y, z, id]);
}
const hs = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
const add = (p, d, t) => [p[0] + d[0] * t, p[1] + d[1] * t, p[2] + d[2] * t];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; };

// ---- wolf frame: local -z is the wolf's front, rotated to face east-north-east
const TH = 60 * Math.PI / 180, C = Math.cos(TH), S = Math.sin(TH), WX = -1, WZ = -1;
const toWorld = (lx, ly, lz) => [WX + lx * C - lz * S, ly, WZ + lx * S + lz * C];
const toLocal = (x, y, z) => { const dx = x - WX, dz = z - WZ; return [dx * C + dz * S, y, -dx * S + dz * C]; };
function paint(c, R, test, col) {
  const w = toWorld(c[0], c[1], c[2]);
  for (let x = Math.floor(w[0] - R); x <= Math.ceil(w[0] + R); x++)
    for (let y = Math.floor(w[1] - R); y <= Math.ceil(w[1] + R); y++)
      for (let z = Math.floor(w[2] - R); z <= Math.ceil(w[2] + R); z++) {
        const l = toLocal(x, y, z);
        if (test(l)) {
          const id = typeof col === 'function' ? col(l) : col;
          if (id != null) put(x, y, z, id);
        }
      }
}
function ell(c, r, col) {
  const R = Math.max(r[0], r[1], r[2]) + 1.5;
  paint(c, R, l => {
    const a = (l[0] - c[0]) / r[0], b = (l[1] - c[1]) / r[1], d = (l[2] - c[2]) / r[2];
    return a * a + b * b + d * d <= 1;
  }, col);
}
function cap(a, b, r0, r1, col) {
  const ab = sub(b, a), L2 = dot(ab, ab);
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const R = Math.sqrt(L2) / 2 + Math.max(r0, r1) + 1.5;
  paint(mid, R, l => {
    const ap = sub(l, a);
    let t = dot(ap, ab) / L2; t = Math.max(0, Math.min(1, t));
    const q = add(a, ab, t);
    return Math.hypot(l[0] - q[0], l[1] - q[1], l[2] - q[2]) <= r0 + (r1 - r0) * t;
  }, col);
}
const fr = (l, k = 1.7) => hs(Math.floor(l[0] * k), Math.floor(l[1] * k), Math.floor(l[2] * k));

// ---- rock outcrop (ragged, stacked layers)
const MCx = -2, MCz = 0;
const layers = [[0, 13, 9.5], [1, 12, 8.5], [2, 11, 7.5], [3, 10, 0], [4, 9, 0]];
for (const [y, outer, inner] of layers) {
  for (let x = -16; x <= 12; x++) for (let z = -14; z <= 14; z++) {
    const d = Math.hypot(x - MCx, z - MCz), ang = Math.atan2(z - MCz, x - MCx);
    const rr = outer + 1.3 * Math.sin(ang * 3 + y * 1.3) + 0.9 * Math.sin(ang * 5 + 2 + y) + (hs(x, y, z) - 0.5);
    if (d <= rr && d >= inner) {
      const r = hs(x * 1.3, y, z * 1.7);
      let id = r < 0.45 ? STONE : r < 0.75 ? COBBLE : r < 0.9 ? GRAY : LIGHT_GRAY;
      if (y === 4 && d > 6.5 && hs(x, 9, z) < 0.5) id = SNOW;
      else if (y < 4 && d > rr - 1.3 && hs(x, y * 3, z) < 0.22) id = SNOW;
      put(x, y, z, id);
    }
  }
}

// ---- WOLF
// tail (drapes down the rock)
const TP = [[0, 6.4, 4.8], [0, 5.2, 7.6], [0.2, 3.8, 9.4], [0.6, 2.4, 10.6], [1.2, 1.4, 11.4]];
const TR = [1.7, 1.6, 1.4, 1.1, 0.8];
for (let i = 0; i < TP.length - 1; i++) {
  const tip = i >= TP.length - 3;
  cap(TP[i], TP[i + 1], TR[i], TR[i + 1], l => {
    const r = fr(l);
    if (tip) return r < 0.6 ? LIGHT_GRAY : WHITE;
    return r < 0.35 ? BLACK : r < 0.5 ? LIGHT_GRAY : GRAY;
  });
}
// haunches + feet
for (const sx of [-1, 1]) {
  ell([sx * 2.9, 7.2, 3.4], [2.1, 2.7, 3.3], l => {
    const r = fr(l);
    if (l[1] < 6) return r < 0.7 ? LIGHT_GRAY : GRAY;
    return r < 0.2 ? LIGHT_GRAY : r < 0.32 ? BLACK : GRAY;
  });
  cap([sx * 2.8, 5.3, -0.8], [sx * 2.8, 5.3, 3], 1.0, 1.1, l => fr(l) < 0.75 ? LIGHT_GRAY : GRAY);
}
// torso
cap([0, 8.5, 2.5], [0, 13.5, -0.5], 3.6, 3.4, l => {
  const zs = 2.5 - 0.6 * (l[1] - 8.5), r = fr(l);
  if (l[2] > zs + 1.6) return r < 0.5 ? BLACK : GRAY;
  if (l[2] < zs - 2.2) return r < 0.55 ? WHITE : LIGHT_GRAY;
  return r < 0.18 ? LIGHT_GRAY : r < 0.3 ? BLACK : GRAY;
});
ell([0, 13, -0.5], [3.6, 3, 3.6], l => { const r = fr(l); return r < 0.25 ? BLACK : r < 0.45 ? LIGHT_GRAY : GRAY; });
// chest bib
ell([0, 12, -2.4], [2.5, 3.4, 2.3], l => fr(l) < 0.5 ? WHITE : LIGHT_GRAY);
// front legs + paws
for (const sx of [-1, 1]) {
  cap([sx * 2.1, 5.6, -3.4], [sx * 2.1, 12.5, -2.8], 1.2, 1.5, l => {
    const r = fr(l);
    if (l[1] < 10) return r < 0.25 ? GRAY : LIGHT_GRAY;
    return r < 0.25 ? LIGHT_GRAY : GRAY;
  });
  ell([sx * 2.1, 5.2, -4.0], [1.3, 0.9, 1.8], l => fr(l) < 0.7 ? LIGHT_GRAY : WHITE);
  put(...toWorld(sx * 2.1 - 0.5, 5, -5.4), BLACK);
  put(...toWorld(sx * 2.1 + 0.5, 5, -5.4), BLACK);
}
// neck + ruff
cap([0, 13.5, -1.4], [0, 19.8, -3.7], 3.0, 2.2, l => {
  const r = fr(l), zc = -1.4 - (l[1] - 13.5) * 0.36;
  if (l[2] < zc - 1.2) return r < 0.6 ? WHITE : LIGHT_GRAY;
  if (l[2] > zc + 1.4) return r < 0.4 ? BLACK : GRAY;
  return r < 0.3 ? LIGHT_GRAY : GRAY;
});
ell([0, 15.2, -2.2], [3.9, 3.3, 3.5], l => { const r = fr(l, 2.1); return r < 0.45 ? LIGHT_GRAY : r < 0.7 ? GRAY : r < 0.85 ? WHITE : BLACK; });

// ---- head, thrown back, muzzle pointing up at the moon
const H = [0, 21.6, -4.6];
const d = nrm([0, 0.72, -0.69]);
const n = [0, d[2], -d[1]]; // down-forward, perpendicular to muzzle axis
const skullCol = l => { const r = fr(l); return r < 0.2 ? LIGHT_GRAY : r < 0.3 ? BLACK : GRAY; };
cap(add(H, d, -1.2), add(H, d, 1.2), 2.5, 2.4, skullCol);
// upper muzzle
cap(add(H, d, 1.5), add(H, d, 7.0), 1.7, 1.05, l => {
  const s = dot(sub(l, H), n), r = fr(l, 2);
  if (s > 0.7) return r < 0.7 ? LIGHT_GRAY : WHITE;
  return r < 0.25 ? LIGHT_GRAY : GRAY;
});
// lower jaw (open)
const J0 = add(add(H, n, 1.8), d, -0.2);
const d2 = nrm([0, 0.927 * d[1] + 0.375 * n[1], 0.927 * d[2] + 0.375 * n[2]]);
cap(add(J0, d2, 1.0), add(J0, d2, 6.2), 1.3, 0.8, l => fr(l, 2) < 0.7 ? LIGHT_GRAY : WHITE);
// tongue
cap(add(add(J0, d2, 1.5), n, -0.8), add(add(J0, d2, 5.0), n, -1.0), 0.65, 0.45, RED);
// nose
ell(add(H, d, 7.3), [1.15, 1.15, 1.15], BLACK);
// fangs
for (const sx of [-0.8, 0.8]) {
  for (const t of [4.0, 5.5, 6.6]) {
    const rad = 1.7 - 0.118 * (t - 1.5);
    const p = add(add(H, d, t), n, rad + 0.25);
    put(...toWorld(p[0] + sx, p[1], p[2]), WHITE);
  }
  for (const t of [4.0, 5.5]) {
    const p = add(add(J0, d2, t), n, -(1.0 + 0.1));
    put(...toWorld(p[0] + sx * 0.8, p[1], p[2]), WHITE);
  }
}
// cheek ruff
for (const sx of [-1, 1])
  ell([sx * 1.9, ...add(add(H, n, 1.2), d, 0.5).slice(1)], [1.0, 1.3, 1.4], l => fr(l) < 0.6 ? WHITE : LIGHT_GRAY);
// ears (swept back/up)
for (const sx of [-1, 1]) {
  const B = add(H, n, -1.9); B[0] = sx * 1.5;
  const tip = add(add(B, n, -0.7 * 3.2), d, -0.4 * 3.2); tip[0] = sx * 1.9;
  cap(B, tip, 1.1, 0.3, l => fr(l) < 0.25 ? BLACK : GRAY);
}
// closed howling eyes
for (const sx of [-1, 1]) {
  const E = add(add(H, d, 0.9), n, -0.7);
  put(...toWorld(sx * 2.3, E[1], E[2]), BLACK);
  const E2 = add(E, d, 0.9);
  put(...toWorld(sx * 2.2, E2[1], E2[2]), BLACK);
}
// breath vapor
const b1 = toWorld(...add(H, d, 9.2)), b2 = toWorld(...add(H, d, 11.2));
// ---- MOON
const MX = 15, MY = 27, MZ = 0;
const craters = [[-0.4, 0.3, -0.87, 1.5], [0.45, -0.3, -0.84, 1.3], [0.1, 0.65, -0.75, 1.0], [-0.6, -0.3, -0.74, 1.1], [0.7, 0.4, -0.6, 0.9]];
for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) for (let z = -6; z <= 6; z++) {
  const r = Math.hypot(x, y, z);
  if (r > 5.2) continue;
  if (r <= 2.3) { put(MX + x, MY + y, MZ + z, GLOWSTONE); continue; }
  if (r >= 3.2) {
    let id = hs(x, y, z) < 0.18 ? GLOWSTONE : WHITE;
    for (const c of craters) {
      if (Math.hypot(x - c[0] * 5, y - c[1] * 5, z - c[2] * 5) < c[3]) id = LIGHT_GRAY;
    }
    put(MX + x, MY + y, MZ + z, id);
  }
}
// ---- boulders
function boulder(bx, by, bz, rx, ry, rz) {
  for (let x = Math.floor(bx - rx); x <= Math.ceil(bx + rx); x++)
    for (let y = Math.floor(by - ry); y <= Math.ceil(by + ry); y++)
      for (let z = Math.floor(bz - rz); z <= Math.ceil(bz + rz); z++) {
        const a = (x - bx) / rx, b = (y - by) / ry, c = (z - bz) / rz;
        if (a * a + b * b + c * c <= 1) {
          const r = hs(x, y, z);
          let id = r < 0.4 ? STONE : r < 0.7 ? COBBLE : GRAY;
          if (y > by + ry * 0.55 && r > 0.4) id = SNOW;
          if (y >= 0) put(x, y, z, id);
        }
      }
}
boulder(8, 0, -14, 2.5, 2, 2.2);
boulder(-12, 0, -14, 2.4, 1.7, 2.0);
boulder(13, 0, -7, 2, 1.6, 2);
boulder(-16, 0, -5, 2.5, 2.2, 2.2);
boulder(1, 0, -16, 1.8, 1.2, 1.6);
boulder(14, 0, 4, 2.2, 1.8, 2.2);
// ---- pines (silhouettes around the clearing)
function pine(px, pz, h) {
  if (vox.size > 3450) return;
  for (let y = 0; y <= h; y++) put(px, y, pz, OAK_LOG);
  for (let y = 3; y <= h + 3; y++) {
    const t = (y - 3) / h;
    const r = Math.max(0, 3.2 * (1 - t) + (y % 2 ? 0.4 : -0.3));
    for (let dx = -4; dx <= 4; dx++) for (let dz = -4; dz <= 4; dz++) {
      if (dx * dx + dz * dz <= r * r + 0.2) put(px + dx, y, pz + dz, hs(px + dx, y, pz + dz) < 0.22 ? SNOW : LEAVES);
    }
  }
}
pine(-19, 6, 15);
pine(-19, -9, 13);
pine(17, -9, 16);
pine(18, 9, 18);
pine(5, 18, 19);
pine(-9, 19, 15);
// ---- stars
for (let i = 0; i < 40; i++) {
  const x = -21 + Math.floor(hs(i, 1, 2) * 43);
  const y = 13 + Math.floor(hs(i, 3, 4) * 20);
  const z = 12 + Math.floor(hs(i, 5, 6) * 9);
  if (Math.hypot(x - MX, y - MY) < 8) continue;
  if (vox.size > 3900) break;
  put(x, y, z, hs(i, 7, 8) < 0.3 ? GLOWSTONE : WHITE);
}
// ---- emit: clear old trees, then place
cube(-16, 0, -14, 12, 10, 14, AIR);
for (const v of vox.values()) block(v[0], v[1], v[2], v[3]);
block(b1[0], b1[1], b1[2], STEAM);
block(b2[0], b2[1], b2[2], STEAM);