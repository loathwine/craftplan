// moose-sonnet55 — prompt:
// a moose...

cube(-11, 0, -17, 11, 10, 16, AIR);

const M = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, id);
}
function putNew(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (M.has(x + ',' + y + ',' + z)) return;
  put(x, y, z, id);
}
function h(x, y, z) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  let n = Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(z, 83492791);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return ((n >>> 0) % 1000) / 1000;
}
function ell(cx, cy, cz, rx, ry, rz, idf, ymin) {
  if (ymin === undefined) ymin = -99;
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      if (y < ymin) continue;
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) put(x, y, z, typeof idf === 'function' ? idf(x, y, z) : idf);
      }
    }
}
function ln(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    put(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, z1 + (z2 - z1) * f, id);
  }
}
function tube(x1, y1, z1, x2, y2, z2, r1, r2, id) {
  const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1, z2 - z1) * 2);
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const r = r1 + (r2 - r1) * f;
    ell(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, z1 + (z2 - z1) * f, r, r, r, id);
  }
}

const furTop = (x, y, z) => { const r = h(x, y, z); return r < 0.2 ? BLACK : r < 0.45 ? OAK_LOG : BROWN; };
const furSide = (x, y, z) => { const r = h(x, y, z); return r < 0.15 ? OAK_LOG : BROWN; };
const belly = (x, y, z) => { const r = h(x, y, z); return r < 0.4 ? GRAY : BROWN; };
const fur = (topY) => (x, y, z) => (y >= topY ? furTop(x, y, z) : furSide(x, y, z));

// ---------- BODY ----------
for (let z = -2; z <= 14; z++) {
  const t = 15.5 + 2.2 * Math.exp(-Math.pow((z - 2.5) / 3.2, 2)) - 0.25 * Math.max(0, z - 9);
  const b = 9 + (z < 2 ? (2 - z) * 0.8 : 0) + (z > 10 ? (z - 10) * 0.7 : 0);
  const d = Math.abs(z - 6);
  const wx = d > 4.5 ? 3.7 * Math.sqrt(Math.max(0, 1 - Math.pow((d - 4.5) / 4, 2))) : 3.7;
  const cy = (t + b) / 2, hy = (t - b) / 2 + 0.5;
  for (let x = -5; x <= 5; x++)
    for (let y = Math.floor(b - 1); y <= Math.ceil(t + 1); y++) {
      const e = Math.pow(x / (wx + 0.4), 2) + Math.pow((y - cy) / hy, 2);
      if (e <= 1) {
        let id;
        if (y >= t - 1) id = furTop(x, y, z);
        else if (y <= b + 0.8) id = belly(x, y, z);
        else id = furSide(x, y, z);
        put(x, y, z, id);
      }
    }
}

// ---------- LEGS ----------
function leg(xc, zTop, zFoot) {
  for (let y = 0; y <= 10; y++) {
    const tt = (10 - y) / 10;
    const z0 = Math.round(zTop + (zFoot - zTop) * tt);
    for (let dx = 0; dx < 2; dx++)
      for (let dz = 0; dz < 2; dz++) {
        const x = xc + dx, z = z0 + dz;
        let id;
        if (y === 0) id = BLACK;
        else if (y <= 6) id = h(x, y, z) < 0.3 ? GRAY : LIGHT_GRAY;
        else id = h(x, y, z) < 0.2 ? OAK_LOG : BROWN;
        put(x, y, z, id);
      }
  }
}
leg(-3, 1, -1);
leg(2, 1, 1);
leg(-3, 11, 11);
leg(2, 11, 13);
// knees / hocks
put(-3, 5, -2, GRAY); put(-2, 5, -2, GRAY);
put(2, 5, 0, GRAY); put(3, 5, 0, GRAY);
put(-3, 5, 12, GRAY); put(-2, 5, 12, GRAY);
put(2, 5, 15, GRAY); put(3, 5, 15, GRAY);
// shoulders & thighs
for (const s of [-1, 1]) {
  ell(s * 2.7, 10.5, 1.5, 2.0, 3, 2.6, furSide);
  ell(s * 2.8, 11, 11.5, 2.1, 3.6, 3.2, furSide);
}

// ---------- NECK ----------
ell(0, 15.5, 0, 2.8, 3, 2.5, fur(16.5));
ell(0, 15, -2.5, 2.5, 2.8, 2.4, fur(16));
ell(0, 14.2, -4.5, 2.2, 2.5, 2.2, fur(15.3));

// ---------- HEAD ----------
ell(0, 13.8, -6.5, 2.3, 2.4, 2.5, furSide);
ell(0, 12.8, -9.5, 1.8, 2.0, 3, furSide);
ell(0, 12.5, -12, 1.9, 1.8, 1.5, furSide);
ell(0, 11.2, -9.5, 1.2, 1.2, 2.8, (x, y, z) => (h(x, y, z) < 0.5 ? GRAY : BROWN));
// bell / dewlap
ell(0, 10.8, -5, 0.9, 2.3, 0.9, BLACK);
put(0, 8, -5, BLACK);
// nose, nostrils, eyes
cube(-1, 11, -13, 1, 12, -13, BLACK);
put(-1, 12, -13, BLACK); put(1, 12, -13, BLACK);
put(-1, 11, -13, GRAY); put(1, 11, -13, GRAY);
for (const s of [-1, 1]) {
  put(s * 2, 14, -7, BLACK);
  put(s * 2, 15, -7, OAK_LOG);
  put(s * 2, 14, -8, OAK_LOG);
  // ears
  ell(s * 3.8, 17, -5, 1, 1.9, 0.9, BROWN);
  put(s * 3.8, 17, -5.9, LIGHT_GRAY);
  put(s * 3.8, 18, -5.9, LIGHT_GRAY);
  put(s * 3.8, 16, -5.9, PINK);
}
// tail
put(0, 13, 15, BROWN); put(0, 12, 15, BROWN); put(0, 13, 16, OAK_LOG);
// belly fringe
for (let x = -2; x <= 2; x++)
  for (let z = 3; z <= 11; z++) if (h(x, 8, z) > 0.8) put(x, 8, z, BROWN);

// ---------- ANTLERS ----------
function hdp(x) { return 1.2 + 3.2 * Math.sin(Math.PI * (x - 4) / 10); }
function antler(s, extra) {
  const P = (x, y, z, id) => put(s * x, y, z, id);
  const zc = -7.5;
  const py = (x, z) => Math.round(20 + (x - 5) * 0.4 + (z - zc) * 0.45);
  ell(s * 2.3, 16.8, -6, 1.5, 1.5, 1.5, PLANKS);
  tube(s * 3, 18, -6.2, s * 5.2, 19.6, -7.2, 1.5, 1.1, PLANKS);
  for (let x = 5; x <= 13; x++) {
    const hv = hdp(x);
    for (let z = Math.ceil(zc - hv); z <= Math.floor(zc + hv); z++) {
      const y = py(x, z);
      const id = h(x * s, y, z) < 0.25 ? PLANKS : SAND;
      P(x, y, z, id); P(x, y + 1, z, id);
      if (x <= 8) P(x, y - 1, z, id);
    }
  }
  const fronts = extra ? [6, 8, 10, 11, 12, 13] : [6, 8, 10, 12];
  for (const xi of fronts) {
    const zf = Math.ceil(zc - hdp(xi));
    const yf = py(xi, zf);
    ln(s * xi, yf, zf, s * xi, yf + 2, zf - (extra && xi === 11 ? 4 : 3), PLANKS);
    ln(s * xi, yf + 1, zf, s * xi, yf + 3, zf - 2, SAND);
  }
  for (const xi of (extra ? [7, 9, 11] : [7, 10])) {
    const zb = Math.floor(zc + hdp(xi));
    const yb = py(xi, zb);
    ln(s * xi, yb + 1, zb, s * xi, yb + 3, zb + 2, PLANKS);
  }
  for (const z of [-9, -7, -6]) {
    const yb = py(13, z);
    ln(s * 13, yb + 1, z, s * 13, yb + (extra ? 5 : 4), z, PLANKS);
  }
  put(s * 14, py(13, -8) + 2, -8, PLANKS);
  tube(s * 2.5, 17.5, -7.5, s * 3.5, 19, -11.5, 1.1, 0.9, PLANKS);
  ln(s * 3.5, 19, -11.5, s * 3.5, 21, -13, SAND);
}
antler(1, true);
antler(-1, false);

// ---------- CALF ----------
const calfFur = (x, y, z) => { const r = h(x, y, z); return r < 0.25 ? PLANKS : r < 0.45 ? OAK_LOG : BROWN; };
for (const [x, z] of [[-10, 3], [-8, 2], [-10, 7], [-8, 7]])
  for (let y = 0; y <= 5; y++) put(x, y, z, y === 0 ? BLACK : y <= 3 ? GRAY : calfFur(x, y, z));
ell(-9, 7.2, 5.2, 2.0, 2.1, 3.6, calfFur);
ell(-9, 8.5, 1.2, 1.2, 1.7, 1.5, calfFur);
ell(-9, 8.8, -0.8, 1.4, 1.3, 1.6, calfFur);
ell(-9, 8.2, -2.6, 1, 1, 1.5, calfFur);
put(-9, 8, -4, BLACK); put(-9, 9, -4, BLACK);
put(-10, 9, -1, BLACK); put(-8, 9, -1, BLACK);
ell(-10.8, 10, -0.2, 0.9, 1.3, 0.5, BROWN);
ell(-7.2, 10, -0.2, 0.9, 1.3, 0.5, BROWN);
put(-9, 8, 9, BROWN);

// ---------- POND ----------
const pcx = -8, pcz = -12;
for (let x = pcx - 7; x <= pcx + 7; x++)
  for (let z = pcz - 6; z <= pcz + 6; z++) {
    const e = Math.pow((x - pcx) / 5.2, 2) + Math.pow((z - pcz) / 4.4, 2);
    const r = h(x, 3, z);
    if (e <= 1) {
      put(x, -2, z, DIRT);
      put(x, -1, z, (e < 0.6 && r > 0.93) ? LIME : WATER);
    } else if (e <= 1.45) {
      if (r < 0.55) put(x, -1, z, SAND);
      else if (r < 0.7) put(x, -1, z, COBBLE);
      if (r > 0.75 && r < 0.9) {
        const hh = 3 + Math.floor(h(x, 9, z) * 3);
        for (let y = 0; y < hh; y++) put(x, y, z, GREEN);
        put(x, hh, z, BROWN);
      }
    }
  }
put(1, -1, -7, GRASS); put(4, -1, -3, GRASS);

// ---------- ROCKS, LOG, MUSHROOMS ----------
const rockId = (x, y, z) => { const r = h(x, y, z); return r < 0.4 ? STONE : r < 0.7 ? COBBLE : GRAY; };
ell(8, 0, -9, 2.4, 1.8, 2, rockId, 0);
ell(10, 0, -6, 1.5, 1.2, 1.4, rockId, 0);
ell(6, 0, -12, 1.2, 0.9, 1.1, rockId, 0);
put(8, 2, -9, SNOW); put(9, 2, -9, SNOW);
for (let x = 7; x <= 11; x++) {
  put(x, 0, 5, OAK_LOG); put(x, 0, 6, OAK_LOG); put(x, 1, 5, OAK_LOG); put(x, 1, 6, OAK_LOG);
  if (h(x, 1, 5) > 0.4) put(x, 2, 5, LEAVES);
}
put(7, 0, 5, PLANKS); put(7, 1, 5, PLANKS); put(7, 0, 6, PLANKS); put(7, 1, 6, PLANKS);
for (const [x, z] of [[8, 7], [6, 8], [-6, 3], [-7, -2]]) { put(x, 0, z, WHITE); put(x, 1, z, RED); }

// ---------- SPRUCE BACKDROP ----------
function spruce(x, z, ht) {
  for (let y = 0; y < ht; y++) put(x, y, z, OAK_LOG);
  for (let y = 3; y <= ht + 1; y++) {
    const f = (ht + 1 - y) / (ht - 2);
    let r = 0.5 + 3.6 * f;
    if (y % 2 === 0) r *= 0.6;
    const ri = Math.ceil(r);
    for (let dx = -ri; dx <= ri; dx++)
      for (let dz = -ri; dz <= ri; dz++)
        if (dx * dx + dz * dz <= r * r)
          put(x + dx, y, z + dz, y >= ht ? SNOW : (h(x + dx, y, z + dz) < 0.25 ? GREEN : LEAVES));
  }
}
spruce(-7, 19, 17);
spruce(5, 20, 19);
spruce(12, 18, 15);

// ---------- GRASS TUFTS & FLOWERS ----------
for (let x = -11; x <= 11; x++)
  for (let z = -16; z <= 15; z++) {
    const r = h(x, 5, z);
    if (r < 0.05) { putNew(x, 0, z, r < 0.025 ? LIME : GREEN); if (r < 0.012) putNew(x, 1, z, GREEN); }
    else if (r > 0.992) putNew(x, 0, z, r > 0.996 ? YELLOW : MAGENTA);
  }

// ---------- EMIT ----------
let n = 0;
for (const [k, id] of M) {
  if (n >= 3990) break;
  const p = k.split(',');
  block(+p[0], +p[1], +p[2], id);
  n++;
}