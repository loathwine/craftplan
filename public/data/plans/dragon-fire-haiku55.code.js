// dragon-fire-haiku55 — prompt:
// a dragon breathing fire...

const lerp = (a, b, t) => a + (b - a) * t;
const bodyCol = (x, y, z) => y <= 12 ? YELLOW : ((x + 2 * y + 3 * z) % 7 === 0 ? ORANGE : RED);

function ell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const a = (x - cx) / rx, b = (y - cy) / ry, c = (z - cz) / rz;
        if (a * a + b * b + c * c <= 1) block(x, y, z, typeof id === 'function' ? id(x, y, z) : id);
      }
}

function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) block(x, y, z, id);
}

function bone(a, b, id) {
  const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])) * 2;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    block(Math.round(lerp(a[0], b[0], t)), Math.round(lerp(a[1], b[1], t)), Math.round(lerp(a[2], b[2], t)), id);
  }
}

function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const WING = [[4, 18], [9, 23.5], [16, 25], [21, 19], [20, 13.5], [15, 8.5], [5, 11]];
for (const s of [-1, 1]) {
  for (let x = 5; x <= 21; x++)
    for (let y = 8; y <= 26; y++) {
      if (!inPoly(x, y, WING)) continue;
      for (const z of [-2, -3]) block(s * x, y, z, (x + y) % 6 === 0 ? ORANGE : RED);
    }
  const P = (x, y, z = -3) => [s * x, y, z];
  const bones = [
    [[4, 18], [9, 23.5]], [[9, 23.5], [16, 25]], [[16, 25], [21, 19]],
    [[16, 25], [20, 13.5]], [[16, 25], [15, 8.5]],
    [[9, 23.5], [13, 15]], [[12, 24], [17, 17]], [[14, 22], [18, 14]]
  ];
  for (const [a, b] of bones) bone(P(...a), P(...b), BLACK);
}

ell(0, 15, 9, 3.6, 3.6, 3.4, bodyCol);
ell(0, 15.5, 1, 4.6, 4.0, 5.5, bodyCol);
ell(0, 16, -6, 4.6, 4.2, 3.2, bodyCol);

for (let i = 0; i <= 5; i++) {
  const t = i / 5;
  ell(0, lerp(17, 20.5, t), lerp(-9, -14.5, t), 2.6, 2.6, 2.2, bodyCol);
}
for (let i = 1; i <= 4; i++) {
  const t = i / 5;
  block(0, Math.round(lerp(17, 20.5, t) + 2.7), Math.round(lerp(-9, -14.5, t)), BLACK);
}

ell(0, 21.5, -17.5, 3.2, 2.8, 3.6, bodyCol);
ell(0, 21, -20, 2.0, 1.8, 1.8, bodyCol);

for (const s of [-1, 1]) {
  block(3 * s, 21, -17, GLOWSTONE);
  block(3 * s, 22, -18, BLACK);
  block(3 * s, 22, -16, BLACK);
  bone([s * 2, 23, -15], [s * 3, 27, -12], BLACK);
  bone([s * 2, 23, -16], [s * 3, 25, -19], BLACK);
}
block(-1, 20, -21, WHITE);
block(1, 20, -21, WHITE);

for (const z of [-8, -6, -4]) block(0, 21, z, BLACK);
for (const z of [-2, 0, 2, 4]) block(0, 20, z, BLACK);
for (const z of [7, 9]) block(0, 19, z, BLACK);

for (let i = 0; i <= 9; i++) {
  const t = i / 9;
  const cz = lerp(10, 20, t), cy = lerp(15, 11, t), r = 2.6 * (1 - t) + 0.8;
  ell(0, cy, cz, r, r, 1.6, bodyCol);
  if (i % 2 === 1) block(0, Math.round(cy + r + 0.8), Math.round(cz), BLACK);
}
for (let x = -2; x <= 2; x++)
  for (let y = 9; y <= 13; y++)
    if (Math.abs(x) + Math.abs(y - 11) <= 2) block(x, y, 21, RED);
block(0, 11, 21, BLACK);

for (const s of [-1, 1]) {
  ell(3.6 * s, 12, -6, 1.3, 2.4, 1.4, bodyCol);
  box(3 * s, 9, -8, 4 * s, 9, -5, BLACK);
  ell(4.2 * s, 12.5, 8, 1.8, 2.6, 2.0, bodyCol);
  box(3 * s, 9, 7, 5 * s, 9, 9, BLACK);
}

const M = [-3, 19.5, -20], E = [-14, 6, -12];
const seen = new Set();
for (let k = 1; k <= 14; k++) {
  const t = k / 14;
  const x = Math.round(lerp(M[0], E[0], t));
  const z = Math.round(lerp(M[2], E[2], t));
  const y = Math.round(lerp(M[1], E[1], t) + Math.sin(Math.PI * t) * 1.5);
  const key = x + ',' + y + ',' + z;
  if (seen.has(key)) continue;
  seen.add(key);
  block(x, y, z, FIRE);
  if (k % 4 === 2) block(x - 1, y, z, FIRE);
}
block(-2, 19, -21, LAVA);

box(-19, 0, -17, -11, 0, -9, COBBLE);
for (let x = -19; x <= -11; x++)
  for (let z = -17; z <= -9; z++) {
    if (!(x === -19 || x === -11 || z === -17 || z === -9)) continue;
    const h = 2 + (((x + 2 * z) % 3) + 3) % 3;
    for (let y = 1; y <= h; y++) {
      if ((x * 3 + z + y * 5) % 11 === 0) continue;
      block(x, y, z, (x + z + y) % 4 === 0 ? STONE : COBBLE);
    }
  }
for (let x = -19; x <= -17; x++)
  for (let z = -17; z <= -15; z++)
    for (let y = 1; y <= 7; y++) {
      if (x === -18 && z === -16) continue;
      block(x, y, z, STONE);
    }
for (let x = -19; x <= -17; x++)
  for (let z = -17; z <= -15; z++)
    if ((x + z) % 2 === 0 && (x * z) % 3 !== 0) block(x, 8, z, STONE);
for (let x = -18; x <= -12; x++)
  for (let z = -15; z <= -11; z++)
    if ((x * x + 3 * z) % 7 === 0) block(x, 1, z, BLACK);

block(-18, 9, -16, FIRE);
block(-16, 5, -12, FIRE);
block(-12, 5, -15, FIRE);