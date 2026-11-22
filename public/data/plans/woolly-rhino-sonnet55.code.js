// woolly-rhino-sonnet55 — prompt:
// a woolly rhinoceros...

cube(-17, 0, -18, 13, 16, 15, AIR);
cube(-22, 0, 13, 22, 9, 22, AIR);

const S = new Map(), M = new Map();
const inb = (x, y, z) => x >= -22 && x <= 22 && z >= -22 && z <= 22 && y >= -8 && y <= 33;
const key = (x, y, z) => x + ',' + y + ',' + z;
function put(map, x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (!inb(x, y, z)) return;
  map.set(key(x, y, z), [x, y, z, id]);
}
const P = (x, y, z, id) => put(M, x, y, z, id);
const has = (x, y, z) => M.has(key(Math.round(x), Math.round(y), Math.round(z)));
const hh = (a, b, c) => { const s = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return s - Math.floor(s); };

const fur = (x, y, z) => {
  const r = hh(x, y, z);
  return r < 0.5 ? BROWN : r < 0.78 ? OAK_LOG : r < 0.93 ? DIRT : PLANKS;
};
const snowFn = () => SNOW;

function ell(map, cx, cy, cz, rx, ry, rz, fn, minY) {
  rx = Math.max(rx, 0.6); ry = Math.max(ry, 0.6); rz = Math.max(rz, 0.6);
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      if (y < minY) continue;
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
        if (d <= 1) put(map, x, y, z, fn(x, y, z));
      }
    }
}

function rhino(ox, oz, s) {
  const E = (cx, cy, cz, rx, ry, rz, fn) => ell(M, ox + cx * s, cy * s, oz + cz * s, rx * s, ry * s, rz * s, fn || fur, -99);
  const B = (x1, y1, z1, x2, y2, z2, fn) => {
    const f = fn || fur;
    const xa = Math.round(ox + Math.min(x1, x2) * s), xb = Math.max(xa, Math.round(ox + Math.max(x1, x2) * s));
    const ya = Math.round(Math.min(y1, y2) * s), yb = Math.max(ya, Math.round(Math.max(y1, y2) * s));
    const za = Math.round(oz + Math.min(z1, z2) * s), zb = Math.max(za, Math.round(oz + Math.max(z1, z2) * s));
    for (let x = xa; x <= xb; x++) for (let y = ya; y <= yb; y++) for (let z = za; z <= zb; z++) P(x, y, z, f(x, y, z));
  };

  // Torso
  E(0, 7, 4, 4.6, 3.9, 7.6);
  E(0, 5.2, 4, 4.2, 2.7, 6.5);
  E(0, 10, -0.5, 3.5, 3.4, 3.6); // shoulder hump
  E(0, 7.3, -3.2, 3.4, 3.4, 3);  // neck
  E(0, 7.3, 9.2, 4.1, 3.5, 3);   // rump
  E(0, 5, -6.8, 2.9, 2.8, 4.2);  // head
  E(0, 4.3, -10.8, 2.4, 2.1, 2.2); // snout

  // Legs and feet
  for (const sx of [-1, 1]) {
    for (const [za, zb] of [[-2, 0], [8, 10]]) {
      B(sx > 0 ? 2 : -4, 0, za, sx > 0 ? 4 : -2, 5, zb);
      const fx1 = sx > 0 ? 1 : -5, fx2 = sx > 0 ? 5 : -1;
      B(fx1, 0, za - 1, fx2, 0, zb + 1, () => GRAY);
      for (let lx = fx1; lx <= fx2; lx++) {
        if ((lx + 10) % 2 === 0) B(lx, 0, za - 1, lx, 0, za - 1, () => BLACK);
      }
    }
  }

  // Horns
  const hornCol = (t, i) => t < 0.1 ? OAK_LOG : t > 0.85 ? WHITE : (i % 5 === 0 ? PLANKS : SAND);
  const N1 = 22;
  for (let i = 0; i <= N1; i++) {
    const t = i / N1;
    const cy = 6.3 + 7.6 * t - 1.0 * t * t;
    const cz = -11.3 - 5.2 * t + 2.2 * t * t;
    const r = Math.max(0.5, 2.1 * (1 - t) + 0.35);
    const c = hornCol(t, i);
    E(0, cy, cz, r * 0.8, r, r, () => c);
  }
  const N2 = 12;
  for (let i = 0; i <= N2; i++) {
    const t = i / N2;
    const cy = 7.5 + 4.8 * t;
    const cz = -8.4 - 1.4 * t + 0.6 * t * t;
    const r = 1.5 * (1 - t) + 0.3;
    const c = hornCol(t, i);
    E(0, cy, cz, r * 0.85, r, r, () => c);
  }

  // Ears
  B(-3, 9, -5, -2, 11, -4);
  B(2, 9, -5, 3, 11, -4);
  B(-2, 9, -5, -2, 10, -5, () => PINK);
  B(2, 9, -5, 2, 10, -5, () => PINK);

  // Tail
  for (let i = 0; i <= 5; i++) P(ox, (9.4 - 0.9 * i) * s, oz + Math.round((12 + 0.35 * i) * s), fur(i, 1, 2));
  E(0, 4.2, 14, 0.9, 1.2, 0.9, () => OAK_LOG);

  // Belly fringe skirt
  const rx0 = Math.floor(ox - 6 * s), rx1 = Math.ceil(ox + 6 * s);
  const rz0 = Math.floor(oz - 4 * s), rz1 = Math.ceil(oz + 12 * s);
  for (let x = rx0; x <= rx1; x++) for (let z = rz0; z <= rz1; z++) {
    const lx = (x - ox) / s;
    if (Math.abs(lx) < 1.2) continue;
    if (has(x, 0, z)) continue;
    let ylow = null;
    for (let y = 1; y <= Math.ceil(12 * s); y++) if (has(x, y, z)) { ylow = y; break; }
    if (ylow === null || ylow <= 1) continue;
    const h = hh(x, 7, z);
    if (h > 0.88) continue;
    const len = 1 + Math.floor(h * 2.5 * s);
    const target = Math.max(1, ylow - len);
    for (let y = ylow - 1; y >= target; y--) P(x, y, z, fur(x, y, z));
  }

  // Shaggy side tufts
  const snap = Array.from(M.values());
  for (const [x, y, z] of snap) {
    if (x < rx0 - 1 || x > rx1 + 1 || z < oz - 4 * s || z > rz1) continue;
    if (y < Math.round(4 * s)) continue;
    if (hh(x, y, z + 3) < 0.13) {
      if (!has(x + 1, y, z)) P(x + 1, y, z, fur(x + 1, y, z));
      else if (!has(x - 1, y, z)) P(x - 1, y, z, fur(x - 1, y, z));
    }
  }

  // Mane ridge and snow dusting on top
  for (let z = Math.round(oz - 3 * s); z <= Math.round(oz + 12 * s); z++) {
    for (let x = Math.round(ox - 1); x <= Math.round(ox + 1); x++) {
      let top = null;
      for (let y = Math.ceil(16 * s); y >= 0; y--) if (has(x, y, z)) { top = y; break; }
      if (top === null || top < Math.round(8 * s)) continue;
      const h = hh(x, top, z);
      if (s >= 0.8 && Math.abs(x - ox) <= 1 && h < 0.75) {
        P(x, top + 1, z, OAK_LOG);
        if (h < 0.3) P(x, top + 2, z, BROWN);
      }
    }
  }
  for (let x = rx0; x <= rx1; x++) for (let z = Math.round(oz - 4 * s); z <= rz1; z++) {
    let top = null;
    for (let y = Math.ceil(16 * s); y >= 0; y--) if (has(x, y, z)) { top = y; break; }
    if (top === null || top < Math.round(7 * s)) continue;
    if (hh(x, 3, z) < 0.38) P(x, top, z, SNOW);
  }

  // Face details
  const scanX = (y, z, dir) => {
    for (let k = Math.round(7 * s); k >= 0; k--) { const x = Math.round(ox + dir * k); if (has(x, y, z)) return x; }
    return null;
  };
  const yE = Math.round(5.9 * s), zE = oz + Math.round(-8.8 * s);
  for (const dir of [-1, 1]) {
    const x = scanX(yE, zE, dir);
    if (x !== null) {
      P(x, yE, zE, BLACK);
      if (s >= 0.8) { P(x, yE + 1, zE, DIRT); P(x, yE + 1, zE - 1, OAK_LOG); }
    }
  }
  const yN = Math.round(4.7 * s);
  for (const dir of [-1, 1]) {
    const x = Math.round(ox + dir * 1.3 * s);
    for (let k = Math.round(-14 * s); k <= 0; k++) {
      const z = oz + k;
      if (has(x, yN, z)) { P(x, yN, z, BLACK); break; }
    }
  }
  const yM = Math.round(3.2 * s);
  for (let lx = -1.5; lx <= 1.5; lx += 1) {
    const x = Math.round(ox + lx * s);
    for (let k = Math.round(-14 * s); k <= 0; k++) {
      const z = oz + k;
      if (has(x, yM, z)) { P(x, yM, z, BLACK); break; }
    }
  }
  // Chin beard
  if (s >= 0.8) {
    for (let x = ox - 2; x <= ox + 2; x++) for (let z = oz - 9; z <= oz - 5; z++) {
      if (hh(x, 11, z) < 0.5 && has(x, 3, z) && !has(x, 2, z)) P(x, 2, z, OAK_LOG);
    }
  }
}

// ---------- Scene (separate layer, lowest priority) ----------
// Snow ground
for (let x = -16; x <= 14; x++) for (let z = -13; z <= 15; z++) {
  const d = ((x + 1) / 15) ** 2 + ((z - 1.5) / 13) ** 2;
  if (d < 0.85 + 0.3 * (hh(x, 2, z) - 0.5)) put(S, x, -1, z, SNOW);
  if (d < 0.6 && hh(x, 5, z) > 0.88) put(S, x, 0, z, SNOW);
}
// Frozen pond
for (let x = 7; x <= 15; x++) for (let z = -11; z <= -5; z++) {
  const d = ((x - 11) / 3.6) ** 2 + ((z + 8) / 2.6) ** 2;
  if (d <= 1) put(S, x, -1, z, hh(x, 1, z) < 0.7 ? ICE : GLASS);
}
// Snow mounds
const mounds = [[-5, -12, 3.5, 2.6, 2.5], [9, -14, 3, 2.2, 2.3], [-14, -6, 2.5, 2.3, 2.5], [12, 6, 2.5, 2.2, 2.5], [-6, 12, 3, 2.4, 2]];
for (const [cx, cz, rx, ry, rz] of mounds) ell(S, cx, -1, cz, rx, ry, rz, snowFn, 0);
// Boulders with snow caps
const rockFn = (x, y, z) => y >= 2 ? SNOW : (hh(x, y, z) < 0.6 ? STONE : hh(x, y, z) < 0.85 ? COBBLE : LIGHT_GRAY);
for (const [cx, cz, rx, ry, rz] of [[-13, -12, 2.2, 2.4, 2], [13, -4, 2.3, 2.4, 2], [-3, -16, 1.6, 2.2, 1.5], [6, -17, 1.8, 2.3, 1.6]])
  ell(S, cx, 0, cz, rx, ry, rz, rockFn, 0);
// Ice spikes
function spike(cx, cz, h) {
  for (let y = 0; y <= h; y++) {
    const r = 1.4 * (1 - y / h);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++)
      if (Math.hypot(dx, dz) <= r + 0.2) put(S, cx + dx, y, cz + dz, ICE);
  }
}
for (const [cx, cz, h] of [[-16, -14, 7], [-18, -12, 5], [16, -14, 8], [18, -11, 5], [15, 9, 6], [-17, 8, 6]]) spike(cx, cz, h);
// Spruces
function spruce(cx, cz, h) {
  for (let y = 0; y <= 3; y++) put(S, cx, y, cz, OAK_LOG);
  for (let y = 2; y <= h; y++) {
    const r = (y % 2 === 0) ? 2.8 * (h - y + 1) / (h - 1) : 1.6 * (h - y + 1) / (h - 1);
    for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++)
      if (Math.hypot(dx, dz) <= r) put(S, cx + dx, y, cz + dz, hh(cx + dx, y, cz + dz) < 0.3 ? SNOW : LEAVES);
  }
}
spruce(-18, -2, 9); spruce(17, -3, 8); spruce(-16, 15, 10);
// Background mountains
function peak(cx, cz, r, h) {
  for (let y = -1; y <= h; y++) {
    const ry = r * (1 - (y + 1) / (h + 1)) + 0.6;
    for (let x = Math.floor(cx - ry - 1); x <= Math.ceil(cx + ry + 1); x++)
      for (let z = Math.floor(cz - ry - 1); z <= Math.ceil(cz + ry + 1); z++) {
        const d = Math.hypot(x - cx, z - cz) * (0.88 + 0.24 * hh(x, y, z));
        if (d <= ry) put(S, x, y, z, y > h * 0.5 + (hh(x, 4, z) * 3 - 1.5) ? SNOW : (hh(x, y, z) < 0.7 ? STONE : COBBLE));
      }
  }
}
peak(-12, 18, 4, 13); peak(4, 19, 4, 16); peak(15, 17, 4, 11);

// ---------- Rhinos ----------
rhino(-9, 1, 0.5); // calf
rhino(1, 1, 1);    // adult

// ---------- Emit ----------
const out = [];
for (const v of M.values()) out.push(v);
const budget = 3990;
if (out.length < budget) {
  const rest = [];
  for (const [k, v] of S) if (!M.has(k)) rest.push(v);
  rest.sort((a, b) => a[1] - b[1]);
  for (const v of rest) { if (out.length >= budget) break; out.push(v); }
}
for (const [x, y, z, id] of out) block(x, y, z, id);