// emperor-penguin-sonnet55 — prompt:
// an emperor penguin...

const M = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
function hs(x, y, z) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return n - Math.floor(n);
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// clear site (free)
cube(-17, 1, -17, 17, 9, 17, AIR);

// ---------- BODY ----------
function bodyR(y) {
  const dy = (y - 12) / 11.5;
  if (Math.abs(dy) > 1) return null;
  const s = Math.sqrt(1 - dy * dy);
  const t = clamp((y - 9) / 15, 0, 1);
  const tp = 1 - 0.32 * t;
  return [7.6 * s * tp, 6.4 * s * tp];
}
for (let y = 1; y <= 23; y++) {
  const r = bodyR(y);
  if (!r) continue;
  const rx = r[0], rz = r[1];
  for (let x = -9; x <= 9; x++) {
    for (let z = -8; z <= 10; z++) {
      const nx = x / rx, nz = (z - 1) / rz;
      if (nx * nx + nz * nz > 1) continue;
      const n = hs(x, y, z);
      let id = BLACK;
      const front = nz < -0.15 + (n - 0.5) * 0.2;
      if (front && Math.abs(nx) < 0.78 + (n - 0.5) * 0.15) id = WHITE;
      if (y >= 16 && nz < 0.35) {
        const p = clamp((y - 15.5) / 3.5, 0, 1);
        const n2 = hs(x + 7, y + 3, z - 5);
        const chin = Math.abs(nx) < 0.3 && y >= 20 && nz < 0;
        if (!chin && n2 < p) id = YELLOW;
      }
      if (id === BLACK && n < 0.05) id = GRAY;
      else if (id === WHITE && n < 0.06) id = LIGHT_GRAY;
      put(x, y, z, id);
    }
  }
}

// ---------- HEAD ----------
for (let x = -5; x <= 5; x++) {
  for (let y = 20; y <= 30; y++) {
    for (let z = -6; z <= 5; z++) {
      const nx = x / 4.3, ny = (y - 25) / 4.6, nz = (z + 0.5) / 4.4;
      if (nx * nx + ny * ny + nz * nz > 1) continue;
      let id = BLACK;
      const n = hs(x * 2, y, z * 3);
      if (Math.abs(x) >= 3 && z >= -2 && z <= 2 && y >= 22 && y <= 28 && n > 0.1) {
        id = y >= 25 ? ORANGE : YELLOW;
      } else if (n < 0.04) id = GRAY;
      put(x, y, z, id);
    }
  }
}
// eyes
for (const s of [-1, 1]) {
  put(3 * s, 25, -3, WHITE);
  put(3 * s, 26, -3, WHITE);
}
// beak
cube(-1, 25, -7, 1, 25, -5, BLACK);
put(0, 26, -5, BLACK);
cube(-1, 24, -7, 1, 24, -5, ORANGE);
put(0, 25, -8, BLACK);
put(0, 24, -8, ORANGE);
put(0, 25, -9, BLACK);
put(0, 24, -9, BLACK);
put(0, 23, -9, BLACK);
put(0, 23, -5, PINK);

// ---------- FLIPPERS ----------
for (const s of [-1, 1]) {
  for (let i = 0; i <= 11; i++) {
    const t = i / 11;
    const y = 17 - i;
    const r = bodyR(y);
    const xin = Math.round(r[0]) - 1 + Math.round(2.5 * t);
    const w = Math.round(1.2 + 2.0 * Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.1)));
    const zc = 1 + Math.round(t);
    for (let dz = -w; dz <= w; dz++) {
      for (let dx = 0; dx <= 1; dx++) {
        const n = hs(s * (xin + dx), y, zc + dz);
        put(s * (xin + dx), y, zc + dz, n < 0.08 ? GRAY : BLACK);
      }
    }
  }
}

// ---------- FEET & TAIL ----------
for (const s of [-1, 1]) {
  const a = s > 0 ? 2 : -5, b = s > 0 ? 5 : -2;
  cube(a, 1, -7, b, 1, -3, BLACK);
  cube(a + (s > 0 ? 1 : 1), 2, -4, b - 1, 2, -3, BLACK);
  // toes
  put(a, 1, -8, BLACK);
  put(a + 2, 1, -8, BLACK);
  put(a + 1, 1, -8, BLACK);
  put(a, 1, -9, GRAY);
  put(a + 2, 1, -9, GRAY);
}
cube(-2, 1, 3, 2, 1, 10, BLACK);
cube(-1, 2, 4, 1, 2, 8, BLACK);
cube(-1, 1, 11, 1, 1, 11, GRAY);

// ---------- CHICK ----------
for (let x = 3; x <= 11; x++) {
  for (let y = 1; y <= 8; y++) {
    for (let z = -9; z <= -3; z++) {
      const nx = (x - 7) / 2.6, ny = (y - 4.5) / 3.6, nz = (z + 6) / 2.6;
      if (nx * nx + ny * ny + nz * nz > 1) continue;
      let id = LIGHT_GRAY;
      if (nz < -0.2 && Math.abs(nx) < 0.7) id = WHITE;
      if (hs(x, y, z) < 0.1) id = id === WHITE ? LIGHT_GRAY : WHITE;
      put(x, y, z, id);
    }
  }
}
for (let x = 4; x <= 10; x++) {
  for (let y = 7; y <= 12; y++) {
    for (let z = -10; z <= -3; z++) {
      const nx = (x - 7) / 2.3, ny = (y - 9.5) / 2.3, nz = (z + 6.3) / 2.3;
      if (nx * nx + ny * ny + nz * nz > 1) continue;
      let id;
      if (z > -6 || y >= 10) id = BLACK;
      else id = WHITE;
      put(x, y, z, id);
    }
  }
}
put(6, 9, -8, BLACK);
put(8, 9, -8, BLACK);
put(7, 9, -9, BLACK);
put(7, 8, -9, ORANGE);
cube(4, 3, -7, 4, 5, -5, GRAY);
cube(10, 3, -7, 10, 5, -5, GRAY);
put(6, 1, -8, BLACK); put(8, 1, -8, BLACK);
put(6, 1, -9, BLACK); put(8, 1, -9, BLACK);

// ---------- ICE FLOE ----------
function lim(x, z) {
  const a = Math.atan2(z, x);
  return 13 + 1.8 * Math.sin(3 * a + 1) + 1.0 * Math.sin(5 * a + 2);
}
for (let x = -17; x <= 17; x++) {
  for (let z = -17; z <= 17; z++) {
    const r = Math.hypot(x, z);
    const L = lim(x, z);
    if (r > L) continue;
    const n = hs(x, 0, z);
    let id = SNOW;
    if (r > L - 1.3 || n < 0.07) id = ICE;
    put(x, 0, z, id);
    if (r <= L - 2) put(x, -1, z, n < 0.5 ? ICE : SNOW);
  }
}
// snow humps around the edge
for (let x = -16; x <= 16; x++) {
  for (let z = -16; z <= 16; z++) {
    const r = Math.hypot(x, z);
    const L = lim(x, z);
    if (r < 8 || r > L - 1.5) continue;
    if (Math.hypot(x - 7, z + 6) < 5.5) continue;
    if (hs(x, 5, z) < 0.18) {
      put(x, 1, z, SNOW);
      if (hs(x, 9, z) < 0.3) put(x, 2, z, SNOW);
    }
  }
}

// ---------- ICE SPIRES (background) ----------
function spire(cx, cz, h, r) {
  for (let y = 1; y <= h; y++) {
    const rad = r * (1 - (y - 1) / h) + 0.3;
    const R = Math.ceil(rad);
    for (let dx = -R; dx <= R; dx++) {
      for (let dz = -R; dz <= R; dz++) {
        if (Math.hypot(dx, dz) <= rad) {
          const n = hs(cx + dx, y, cz + dz);
          const id = (y > h * 0.8 || n < 0.2) ? SNOW : ICE;
          put(cx + dx, y, cz + dz, id);
        }
      }
    }
  }
}
spire(-12, 12, 17, 3);
spire(-7, 15, 12, 2.5);
spire(10, 14, 19, 3);
spire(15, 9, 9, 2);
spire(2, 17, 14, 2.5);
spire(-16, 5, 8, 2);

// ---------- EMIT ----------
let count = 0;
for (const v of M.values()) {
  if (count >= 3990) break;
  block(v[0], v[1], v[2], v[3]);
  count++;
}