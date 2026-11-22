// st-basils-sonnet55 — prompt:
// St. Basil's Cathedral in the snow...

// St. Basil's Cathedral in the snow — front faces NORTH (-Z)
const LIMIT = 3980;
const M = new Map();
let count = 0;
const TAU = Math.PI * 2;

function put(x, y, z, id) {
  if (id == null) return;
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (id === AIR) {
    if (M.has(k)) { M.delete(k); count--; }
    block(x, y, z, AIR);
    return;
  }
  if (!M.has(k)) { if (count >= LIMIT) return; count++; }
  M.set(k, id);
  block(x, y, z, id);
}
function hs(x, y, z) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function bin(ang, N) { return ((ang / TAU) * N + N * 2) % 1; }
function cubeP(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function ring(cx, y, cz, r, cf, th) {
  th = th || 1;
  const R = Math.ceil(r + th + 1);
  const lo = r - 0.5, hi = r - 0.5 + th;
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d >= lo && d < hi) {
      const id = (typeof cf === 'function') ? cf(dx, dz, Math.atan2(dz, dx), d) : cf;
      put(cx + dx, y, cz + dz, id);
    }
  }
}
function shell(cx, y0, cz, radii, cf) {
  const n = radii.length;
  let prev = radii[0];
  for (let i = 0; i < n; i++) {
    const r = radii[i], y = y0 + i, k = n > 1 ? i / (n - 1) : 0;
    if (r < 1.3) {
      put(cx, y, cz, cf(0, 0, 0, i, k));
      if (r >= 0.9) {
        put(cx + 1, y, cz, cf(1, 0, 0, i, k)); put(cx - 1, y, cz, cf(-1, 0, Math.PI, i, k));
        put(cx, y, cz + 1, cf(0, 1, 1.57, i, k)); put(cx, y, cz - 1, cf(0, -1, -1.57, i, k));
      }
    } else {
      const th = Math.max(1, prev - r + 0.6);
      ring(cx, y, cz, r, (dx, dz, ang) => cf(dx, dz, ang, i, k), th);
    }
    prev = r;
  }
}
function onion(rb, H) {
  const a = [];
  for (let i = 0; i <= H; i++) {
    const t = i / H;
    a.push(t < 0.4 ? rb * (1 + 0.3 * Math.sin(t / 0.4 * Math.PI / 2))
      : rb * 1.3 * Math.pow(Math.max(0, Math.cos((t - 0.4) / 0.6 * Math.PI / 2)), 0.75));
  }
  return a;
}
const spiral = (c1, c2, K, sp) => (dx, dz, ang, i) => (Math.floor((ang / TAU + 1) * K + i * sp) % 2 === 0 ? c1 : c2);
const dia = (c1, c2, K) => (dx, dz, ang, i) => ((Math.floor((ang / TAU + 1) * K) + Math.floor(i / 2)) % 2 === 0 ? c1 : c2);
const solid = (c) => () => c;
const snowy = (base, p, k0, k1) => (dx, dz, ang, i, k) => {
  if (k > 0.88) return GOLD;
  if (k >= k0 && k <= k1 && hs(dx, i, dz) < p) return SNOW;
  return base(dx, dz, ang, i, k);
};
function cross(cx, y, cz, h) {
  for (let j = 0; j < h; j++) put(cx, y + j, cz, GOLD);
  put(cx - 1, y + h - 2, cz, GOLD); put(cx + 1, y + h - 2, cz, GOLD);
}

// ---- clear trees from the footprint (above ground only)
cube(-16, 1, -16, 19, 9, 16, AIR);

// ---- CENTRAL TENT TOWER
for (let y = -1; y <= 9; y++) {
  ring(0, y, 0, 4.6, (dx, dz, ang) => {
    const a = bin(ang, 8);
    if (a < 0.14 || a > 0.86) return WHITE;
    if (Math.abs(a - 0.5) < 0.2) {
      if (y === 4 || y === 5) return dz < 0 ? GLOWSTONE : BLACK;
      if (y === 6) return WHITE;
      if (y === 8) return BLACK;
      if (y === 9) return WHITE;
    }
    return hs(dx, y, dz) < 0.1 ? BROWN : BRICK;
  });
}
ring(0, 10, 0, 5.6, WHITE);
{
  const radii = [];
  for (let i = 0; i < 14; i++) radii.push(4.5 * Math.pow(1 - i / 14, 0.9));
  const ribs = (dx, dz, ang) => { const a = bin(ang, 8); return (a < 0.12 || a > 0.88) ? WHITE : RED; };
  shell(0, 11, 0, radii, snowy(ribs, 0.12, 0, 0.85));
}
ring(0, 25, 0, 1.5, GOLD);
shell(0, 26, 0, onion(1.6, 3), solid(GOLD));
cross(0, 30, 0, 4);

// ---- BELL TOWER
const bx = 15, bz = -12;
function sqRing(x1, z1, x2, z2, y, cf) {
  for (let x = x1; x <= x2; x++) for (let z = z1; z <= z2; z++)
    if (x === x1 || x === x2 || z === z1 || z === z2) put(x, y, z, typeof cf === 'function' ? cf(x, z) : cf);
}
for (let y = -1; y <= 9; y++) {
  sqRing(bx - 2, bz - 2, bx + 2, bz + 2, y, (x, z) => {
    const corner = (x === bx - 2 || x === bx + 2) && (z === bz - 2 || z === bz + 2);
    if (corner || y === 9) return WHITE;
    const mid = (x === bx && (z === bz - 2 || z === bz + 2)) || (z === bz && (x === bx - 2 || x === bx + 2));
    if ((y === 6 || y === 7) && mid) return (z === bz - 2 && y === 6) ? GLOWSTONE : BLACK;
    return hs(x, y, z) < 0.1 ? BROWN : BRICK;
  });
}
cubeP(bx - 2, 10, bz - 2, bx + 2, 10, bz + 2, WHITE);
for (const sx of [-2, 2]) for (const sz of [-2, 2]) cubeP(bx + sx, 11, bz + sz, bx + sx, 13, bz + sz, WHITE);
sqRing(bx - 2, bz - 2, bx + 2, bz + 2, 14, WHITE);
cubeP(bx - 1, 13, bz, bx + 1, 13, bz, IRON);
put(bx, 12, bz, GOLD);
sqRing(bx - 3, bz - 3, bx + 3, bz + 3, 15, WHITE);
{
  const sizes = [2, 1, 1, 0, 0];
  sizes.forEach((s, i) => {
    const y = 16 + i;
    if (s === 0) put(bx, y, bz, GREEN);
    else sqRing(bx - s, bz - s, bx + s, bz + s, y, (x, z) => hs(x, y, z) < 0.25 ? SNOW : GREEN);
  });
  put(bx, 21, bz, GOLD);
  cubeP(bx, 22, bz, bx, 23, bz, GOLD);
  cross(bx, 24, bz, 3);
}

// ---- CARDINAL CHAPELS
function chapel(cx, cz, r, top, up, domeCf) {
  const N = 8, ww = r < 3 ? 0.3 : 0.18;
  for (let y = -1; y <= top; y++) {
    ring(cx, y, cz, r, (dx, dz, ang) => {
      const a = bin(ang, N);
      if (a < 0.14 || a > 0.86) return WHITE;
      if (Math.abs(a - 0.5) < ww) {
        if (y === top - 2 || y === top - 1) return dz < 0 ? GLOWSTONE : BLACK;
        if (y === top) return WHITE;
      }
      return hs(cx + dx, y, cz + dz) < 0.1 ? BROWN : BRICK;
    });
  }
  ring(cx, top + 1, cz, r + 1, WHITE);
  for (let j = 0; j < up; j++) {
    ring(cx, top + 2 + j, cz, r - 0.5, (dx, dz, ang) => {
      const a = bin(ang, N);
      if (j === 0 && Math.abs(a - 0.5) < ww + 0.05) return BLACK;
      return WHITE;
    });
  }
  ring(cx, top + 2 + up, cz, r - 0.5, GOLD);
  const rb = r * 0.93, H = Math.round(rb * 2.2), y0 = top + 3 + up;
  shell(cx, y0, cz, onion(rb, H), domeCf);
  cross(cx, y0 + H + 1, cz, r > 3 ? 4 : 3);
}
chapel(0, -11, 3.5, 4, 2, snowy(spiral(GREEN, YELLOW, 6, 0.5), 0.14, 0.25, 0.65));
chapel(11, 0, 3.5, 5, 2, snowy(spiral(RED, WHITE, 7, 0.45), 0.14, 0.25, 0.65));
chapel(0, 11, 3.5, 4, 2, snowy(dia(BLUE, GOLD, 8), 0.14, 0.25, 0.65));
chapel(-11, 0, 3.5, 6, 2, snowy(spiral(YELLOW, GREEN, 8, 0.35), 0.14, 0.25, 0.65));

// ---- ENTRANCE (north chapel)
put(0, 0, -14, PLANKS); put(0, 1, -14, PLANKS);
for (const sx of [-1, 1]) for (let y = 0; y <= 2; y++) put(sx, y, -14, WHITE);
put(0, 2, -14, GOLD);
cubeP(-1, -1, -16, 1, -1, -15, WHITE);
cubeP(-1, 0, -15, 1, 0, -15, WHITE);
for (const sx of [-3, 3]) { cubeP(sx, 0, -15, sx, 1, -15, IRON); put(sx, 2, -15, GLOWSTONE); }

// ---- DIAGONAL CHAPELS
chapel(-7, -7, 2.5, 2, 1, snowy(solid(GOLD), 0.14, 0.25, 0.65));
chapel(7, -7, 2.5, 2, 1, snowy(spiral(BLUE, WHITE, 5, 0.5), 0.14, 0.25, 0.65));
chapel(-7, 7, 2.5, 2, 1, snowy(spiral(GREEN, YELLOW, 5, 0.5), 0.14, 0.25, 0.65));
chapel(7, 7, 2.5, 2, 1, snowy(spiral(RED, GOLD, 5, 0.5), 0.14, 0.25, 0.65));

// ---- CONNECTING GALLERIES
for (const s of [-1, 1]) {
  for (const x of [-1, 1]) {
    cubeP(x, -1, s * 5, x, 1, s * 8, BRICK);
    cubeP(s * 5, -1, x, s * 8, 1, x, BRICK);
  }
  cubeP(-1, 2, s * 5, 1, 2, s * 8, SNOW);
  cubeP(s * 5, 2, -1, s * 8, 2, 1, SNOW);
  for (const t of [-1, 1]) {
    cubeP(4 * s, -1, 4 * t, 5 * s, 1, 5 * t, BRICK);
    cubeP(4 * s, 2, 4 * t, 5 * s, 2, 5 * t, SNOW);
  }
}

// ---- SNOW LEDGES ON CORNICES
ring(0, 11, 0, 5.6, (dx, dz) => hs(dx, 11, dz) < 0.75 ? SNOW : null);
const chapels = [[0, -11, 3.5, 4], [11, 0, 3.5, 5], [0, 11, 3.5, 4], [-11, 0, 3.5, 6],
  [-7, -7, 2.5, 2], [7, -7, 2.5, 2], [-7, 7, 2.5, 2], [7, 7, 2.5, 2]];
for (const [cx, cz, r, top] of chapels)
  ring(cx, top + 2, cz, r + 1, (dx, dz) => hs(cx + dx, top, cz + dz) < 0.7 ? SNOW : null);
sqRing(bx - 3, bz - 3, bx + 3, bz + 3, 16, (x, z) => hs(x, 16, z) < 0.7 ? SNOW : null);

// ---- SNOW DRIFTS AT THE BASE
for (const [cx, cz, r] of chapels)
  ring(cx, 0, cz, r + 2.5, (dx, dz) => hs(cx + dx, 0, cz + dz) < 0.6 ? SNOW : null);

// ---- SNOWY FIRS
function fir(x, z, h) {
  put(x, 0, z, OAK_LOG); put(x, 1, z, OAK_LOG);
  for (let k = 0; k < h; k++) {
    const r = 2.3 * (1 - k / h) + 0.3;
    ring(x, 2 + k, z, r, (dx, dz) => hs(x + dx, k, z + dz) < 0.3 ? SNOW : LEAVES, 1.3);
    put(x, 2 + k, z, LEAVES);
  }
  put(x, 2 + h, z, SNOW);
}
fir(-6, -16, 7);
fir(6, -17, 7);
fir(-14, -14, 7);
fir(18, 2, 7);