// sugar-skull-sonnet55 — prompt:
// a Day of the Dead sugar skull...

const oy = 2;
cylinder(0, 1, 0, 13, 10, AIR);

// ---------- altar base ----------
for (let x = -13; x <= 13; x++) for (let z = -13; z <= 13; z++) {
  const r = Math.hypot(x, z), th = Math.atan2(z, x);
  if (r <= 12.3 && r >= 6.5) {
    let id = PURPLE;
    if (r >= 10.4) id = (((Math.round(th * 10 / (2 * Math.PI)) % 2) + 2) % 2) ? YELLOW : ORANGE;
    else if (r >= 9.6) id = BLACK;
    block(x, 0, z, id);
    if (r >= 11.4 && ((x + z) % 3 === 0)) block(x, 1, z, ORANGE);
  }
  if (r <= 9.4 && r >= 5.5) {
    const seg = ((Math.round(th * 12 / (2 * Math.PI)) % 2) + 2) % 2;
    block(x, 1, z, r >= 7.6 ? (seg ? MAGENTA : PINK) : WHITE);
  }
}

// ---------- skull ----------
function solid(x, y, z) {
  const a = x / 10.2, b = (y - 16) / 9.5, c = (z - 1) / 9.5;
  if (a * a + b * b + c * c <= 1) return true;
  if (y >= 0 && y <= 11) {
    const w = 5.6 + y * 0.28;
    if (Math.pow(Math.abs(x) / w, 2.6) + Math.pow(Math.abs(z + 1) / 6.1, 2.6) <= 1) return true;
  }
  return false;
}
const X0 = -12, X1 = 12, Y0 = -1, Y1 = 28, Z0 = -11, Z1 = 12;
const NY = Y1 - Y0 + 1, NZ = Z1 - Z0 + 1;
const grid = new Uint8Array((X1 - X0 + 1) * NY * NZ);
const gi = (x, y, z) => ((x - X0) * NY + (y - Y0)) * NZ + (z - Z0);
for (let x = X0; x <= X1; x++) for (let y = Y0; y <= Y1; y++) for (let z = Z0; z <= Z1; z++)
  if (y >= 0 && solid(x, y, z)) grid[gi(x, y, z)] = 1;
const S = (x, y, z) => (y < 0 ? true : (x < X0 || x > X1 || y > Y1 || z < Z0 || z > Z1) ? false : grid[gi(x, y, z)] === 1);

const dotPal = [PINK, YELLOW, LIGHT_BLUE, ORANGE, LIME];
const par = (j) => (((j % 2) + 2) % 2);
const noseRows = { 10: [0], 9: [-1, 0, 1], 8: [-2, -1, 0, 1, 2], 7: [-2, -1, 1, 2] };

function paint(x, y) {
  for (const s of [-1, 1]) {
    const dx = x - s * 4.6, dy = y - 15, r = Math.hypot(dx, dy);
    if (r <= 4.6) {
      if (r <= 2.4) return r <= 0.9 ? 'glow' : 'carve';
      const th = Math.atan2(dy, dx), pr = 3.4 + Math.cos(8 * th);
      if (r <= pr) return par(Math.round(th * 8 / (2 * Math.PI))) ? MAGENTA : ORANGE;
      return CYAN;
    }
  }
  if (noseRows[y] && noseRows[y].includes(x)) return 'carve';
  if (y <= 7) {
    const yy = Math.round(4.0 + 0.05 * x * x);
    if (Math.abs(x) <= 7 && y === yy) return BLACK;
    if ([-5, -3, -1, 1, 3, 5].includes(x) && y >= yy - 2 && y <= yy + 2 && y >= 1) return BLACK;
    if (y <= 1) return par(x) ? PINK : LIGHT_BLUE;
  }
  for (const s of [-1, 1]) {
    const dx = x - s * 5.8, dy = y - 8.4, r = Math.hypot(dx, dy);
    if (r <= 2.6) {
      const th = Math.atan2(dy, dx);
      const t = (((r * 0.8 - th / (2 * Math.PI)) % 1) + 1) % 1;
      return t < 0.45 ? PURPLE : PINK;
    }
  }
  {
    const dx = x, dy = y - 21.5, r = Math.hypot(dx, dy);
    if (r <= 3.9) {
      if (r <= 1.2) return YELLOW;
      const th = Math.atan2(dy, dx), pr = 2.7 + 1.2 * Math.cos(6 * th);
      if (r <= pr) return par(Math.round(th * 6 / (2 * Math.PI))) ? RED : ORANGE;
      return LIME;
    }
  }
  if (y >= 17 || (y >= 8 && y <= 13)) {
    const row = y / 3;
    if (y % 3 === 0 && ((((x + row) % 3) + 3) % 3) === 0) return dotPal[(((x + row * 2) % 5) + 5) % 5];
  }
  return null;
}

for (let x = X0; x <= X1; x++) for (let y = 0; y <= Y1; y++) {
  let zf = null;
  for (let z = Z0; z <= Z1; z++) if (S(x, y, z)) { zf = z; break; }
  if (zf === null) continue;
  const pt = paint(x, y);
  for (let z = Z0; z <= Z1; z++) {
    if (!S(x, y, z)) continue;
    const surf = !S(x + 1, y, z) || !S(x - 1, y, z) || !S(x, y + 1, z) || !S(x, y - 1, z) || !S(x, y, z + 1) || !S(x, y, z - 1);
    const depth = z - zf;
    if (!(surf || depth <= 1)) continue;
    let id = ((x * 7 + y * 13 + z * 5) % 9 === 0) ? MARBLE : WHITE;
    if (depth === 0 && pt !== null && typeof pt === 'number') id = pt;
    if (typeof pt === 'string' && depth <= 1) {
      if (depth < 1) continue;
      id = pt === 'glow' ? GLOWSTONE : BLACK;
    }
    block(x, y + oy, z, id);
  }
}

// ---------- 3D marigold crown ----------
function marigold(cx, cy, cz, r, petal, inner) {
  sphere(cx, cy, cz, r, petal);
  const ri = Math.ceil(r);
  for (let dx = -ri; dx <= ri; dx++) for (let dy = -ri; dy <= ri; dy++) for (let dz = -ri; dz <= ri; dz++) {
    const d = Math.hypot(dx, dy, dz);
    if (d > r - 0.6 && d <= r + 0.5 && dz <= -r * 0.5 && dx * dx + dy * dy <= r * r * 0.35) block(cx + dx, cy + dy, cz + dz, inner);
    else if (d > r * 0.55 && d <= r * 0.9 && ((dx + dy + dz) & 1) === 0 && dz < 0) block(cx + dx, cy + dy, cz + dz, petal === ORANGE ? RED : PURPLE);
  }
}
const pt3 = (a, e, k) => {
  const A = a * Math.PI / 180, E = e * Math.PI / 180;
  return [Math.round(10.2 * k * Math.cos(E) * Math.sin(A)), Math.round(2 + 16 + 9.5 * k * Math.sin(E)), Math.round(1 - 9.5 * k * Math.cos(E) * Math.cos(A))];
};
const crown = [
  [0, 78, 2.5, ORANGE, YELLOW], [-38, 68, 2.2, MAGENTA, YELLOW], [38, 68, 2.2, MAGENTA, YELLOW],
  [-75, 55, 2.2, ORANGE, YELLOW], [75, 55, 2.2, ORANGE, YELLOW], [-105, 38, 1.8, PINK, YELLOW], [105, 38, 1.8, PINK, YELLOW],
  [180, 70, 2.2, ORANGE, YELLOW],
];
for (const [a, e, r, p, i] of crown) {
  const [x, y, z] = pt3(a, e, 1.08);
  marigold(x, y, z, r, p, i);
}
for (const [a, e] of [[-20, 78], [20, 78], [-55, 62], [55, 62], [-90, 46], [90, 46], [0, 62]]) {
  const [x, y, z] = pt3(a, e, 1.1);
  sphere(x, y, z, 1.3, GREEN);
}

// ---------- candles + petals ----------
for (const s of [-1, 1]) {
  cube(s * 7, 2, -6, s * 7, 5, -6, WHITE); block(s * 7, 6, -6, FIRE);
  cube(s * 8, 2, -2, s * 8, 3, -2, PINK); block(s * 8, 4, -2, FIRE);
  cube(s * 9, 2, 2, s * 9, 3, 2, LIGHT_BLUE);
}
for (let i = 0; i < 14; i++) {
  const a = (-160 + i * 24.6) * Math.PI / 180;
  const x = Math.round(10.8 * Math.sin(a)), z = Math.round(-10.8 * Math.cos(a));
  if (Math.abs(x) < 2 && z < -9) continue;
  const c = i % 2 ? ORANGE : YELLOW;
  block(x, 2, z, YELLOW);
  block(x + 1, 1, z, c); block(x - 1, 1, z, c); block(x, 1, z + 1, c); block(x, 1, z - 1, c);
}