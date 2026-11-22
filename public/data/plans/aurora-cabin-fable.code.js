// aurora-cabin-fable — prompt:
// a log cabin under the northern lights...

// Log cabin under the northern lights
const M = new Map();
const LIMIT = 3985;
const K = (x, y, z) => x + '|' + y + '|' + z;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = K(x, y, z);
  if (!M.has(k) && M.size >= LIMIT) return;
  M.set(k, [x, y, z, id]);
}
function del(x, y, z) { M.delete(K(x, y, z)); }
function has(x, y, z) { return M.has(K(x, y, z)); }
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function rnd(a, b, c) {
  const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7 + 1.3) * 43758.5453;
  return n - Math.floor(n);
}

// ---------- snowy yard ----------
for (let x = -10; x <= 10; x++) for (let z = -9; z <= 10; z++) {
  if (x >= -6 && x <= 6 && z >= 0 && z <= 6) continue;
  put(x, -1, z, SNOW);
  if ((Math.abs(x) >= 9 || z >= 9) && rnd(x, 5, z) < 0.3) put(x, 0, z, SNOW);
}
box(1, -1, -17, 7, -1, -10, SNOW);

// frozen pond with a fishing hole
for (let x = 3; x <= 10; x++) for (let z = -9; z <= -3; z++) {
  const d = (x - 7) * (x - 7) / 7.84 + (z + 6) * (z + 6) / 5.76;
  if (d <= 1) { put(x, -1, z, ICE); del(x, 0, z); }
}
put(6, -1, -6, WATER);

// winding stone path
for (let z = -5; z >= -17; z--) {
  const px = Math.round(1.5 - 1.5 * Math.cos((z + 5) * Math.PI / 12));
  for (let w = 0; w < 2; w++) {
    if (rnd(px + w, 2, z) > 0.15) put(px + w, -1, z, rnd(px + w, 8, z) < 0.65 ? COBBLE : STONE);
  }
}

// ---------- cabin ----------
const X0 = -7, X1 = 7, Z0 = -1, Z1 = 7;
for (let x = X0; x <= X1; x++) for (let z = Z0; z <= Z1; z++) {
  const edge = x === X0 || x === X1 || z === Z0 || z === Z1;
  if (edge) {
    put(x, -1, z, COBBLE); put(x, 0, z, COBBLE);
    for (let y = 1; y <= 5; y++) put(x, y, z, OAK_LOG);
  } else put(x, 0, z, PLANKS);
}
// interlocking corner log ends
for (let y = 1; y <= 5; y++) {
  if (y % 2 === 1) {
    for (const zc of [Z0, Z1]) { put(X0 - 1, y, zc, OAK_LOG); put(X1 + 1, y, zc, OAK_LOG); }
  } else {
    for (const xc of [X0, X1]) { put(xc, y, Z0 - 1, OAK_LOG); put(xc, y, Z1 + 1, OAK_LOG); }
  }
}
// gables
const roofY = z => 10 - Math.abs(z - 3);
for (let z = 0; z <= 6; z++) for (let y = 6; y < roofY(z); y++) {
  put(X0, y, z, y === 6 ? OAK_LOG : PLANKS);
  put(X1, y, z, y === 6 ? OAK_LOG : PLANKS);
}
// roof: dark shingles under a blanket of snow
for (let x = -8; x <= 8; x++) for (let z = -2; z <= 8; z++) {
  const ry = roofY(z);
  put(x, ry, z, BROWN);
  const eave = z === -2 || z === 8;
  if (!(eave && rnd(x, 9, z) < 0.35)) put(x, ry + 1, z, SNOW);
}
// icicles on the front eave
for (let x = -8; x <= 8; x++) {
  if (Math.abs(x) <= 3 || Math.abs(x) === 7) continue;
  if (rnd(x, 4, 1) < 0.45) { put(x, 4, -2, ICE); if (rnd(x, 4, 2) < 0.3) put(x, 3, -2, ICE); }
}
// front door + frame
put(0, 1, -1, RED); put(0, 2, -1, RED); put(0, 3, -1, PLANKS);
for (let y = 1; y <= 3; y++) { put(-1, y, -1, PLANKS); put(1, y, -1, PLANKS); }
// front windows, glowing warm, red shutters, sills
for (const wx of [-5, -4, 4, 5]) {
  for (let y = 2; y <= 3; y++) { put(wx, y, -1, GLASS); put(wx, y, 0, GLOWSTONE); }
  put(wx, 1, -2, PLANKS);
}
for (const sx of [-6, -3, 3, 6]) for (let y = 2; y <= 3; y++) put(sx, y, -1, RED);
// west window + attic window
for (let z = 3; z <= 4; z++) for (let y = 2; y <= 3; y++) { put(-7, y, z, GLASS); put(-6, y, z, GLOWSTONE); }
put(-7, 7, 3, GLASS); put(-6, 7, 3, GLOWSTONE);
// back windows
for (const wx of [-4, -3, 3, 4]) for (let y = 2; y <= 3; y++) { put(wx, y, 7, GLASS); put(wx, y, 6, GLOWSTONE); }

// ---------- porch ----------
box(-3, 0, -4, 3, 0, -2, PLANKS);
for (let y = 1; y <= 4; y++) { put(-3, y, -4, OAK_LOG); put(3, y, -4, OAK_LOG); }
box(-2, 5, -4, 2, 5, -4, PLANKS); put(0, 6, -4, PLANKS);
put(-2, 4, -4, GLOWSTONE); put(2, 4, -4, GLOWSTONE);
put(-3, 1, -3, PLANKS); put(-3, 1, -2, PLANKS); put(3, 1, -3, PLANKS); put(3, 1, -2, PLANKS);
put(-2, 1, -4, PLANKS); put(2, 1, -4, PLANKS);
for (let x = -3; x <= 3; x++) {
  const py = 7 - Math.ceil(Math.abs(x) / 2);
  for (let z = -5; z <= -1 && roofY(z) < py; z++) { put(x, py, z, BROWN); put(x, py + 1, z, SNOW); }
}

// ---------- stone chimney ----------
for (let y = -1; y <= 13; y++) {
  const zA = y <= 5 ? 1 : 2, zB = y <= 5 ? 5 : 4;
  for (let x = 8; x <= 9; x++) for (let z = zA; z <= zB; z++) put(x, y, z, rnd(x, y, z) < 0.3 ? STONE : COBBLE);
}
put(9, 6, 1, SNOW); put(9, 6, 5, SNOW);
put(8, 14, 3, STEAM); put(9, 14, 3, STEAM);

// ---------- woodpile ----------
box(-9, 0, 1, -9, 1, 5, OAK_LOG);
box(-10, 0, 2, -10, 0, 4, OAK_LOG);
for (let z = 1; z <= 5; z++) if (rnd(z, 3, 3) < 0.7) put(-9, 2, z, SNOW);

// ---------- campfire + log benches ----------
put(-6, -1, -6, BLACK);
put(-7, 0, -6, COBBLE); put(-5, 0, -6, COBBLE); put(-6, 0, -7, COBBLE); put(-6, 0, -5, COBBLE);
put(-6, 0, -6, FIRE);
box(-9, 0, -7, -9, 0, -5, OAK_LOG);
box(-7, 0, -9, -5, 0, -9, OAK_LOG);

// ---------- snowman ----------
put(3, 0, -7, SNOW); put(2, 0, -7, SNOW); put(4, 0, -7, SNOW); put(3, 0, -8, SNOW); put(3, 0, -6, SNOW);
put(3, 1, -7, SNOW); put(3, 2, -7, SNOW); put(3, 3, -7, BLACK);
put(3, 2, -8, ORANGE); put(2, 1, -7, BROWN); put(4, 1, -7, BROWN);

// ---------- lantern posts ----------
put(0, 0, -9, OAK_LOG); put(0, 1, -9, OAK_LOG); put(0, 2, -9, GLOWSTONE);
put(5, 0, -14, OAK_LOG); put(5, 1, -14, OAK_LOG); put(5, 2, -14, GLOWSTONE);

// ---------- moose in the foreground ----------
for (const z of [-14, -13]) for (let y = 1; y <= 2; y++) { put(-8, y, z, BROWN); put(-5, y, z, BROWN); }
box(-8, 3, -14, -5, 4, -13, BROWN);
box(-5, 5, -14, -5, 5, -13, BROWN);
box(-4, 4, -14, -3, 5, -13, BROWN);
box(-2, 4, -14, -2, 4, -13, BROWN);
put(-3, 5, -14, BLACK);
for (const az of [-15, -12]) {
  put(-4, 6, az, SAND);
  for (let x = -5; x <= -3; x++) put(x, 7, az, SAND);
  put(-5, 8, az, SAND); put(-3, 8, az, SAND);
}

// ---------- snowy pines ----------
function pine(cx, by, cz, radii, trunkH) {
  const cells = [];
  const top = by + trunkH + radii.length;
  for (let y = by - 1; y < top; y++) put(cx, y, cz, OAK_LOG);
  radii.forEach((r, i) => {
    const y = by + trunkH + i, R = Math.ceil(r);
    for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
      if (dx === 0 && dz === 0) continue;
      if (dx * dx + dz * dz <= r * r + 0.01) { put(cx + dx, y, cz + dz, GREEN); cells.push([cx + dx, y, cz + dz]); }
    }
  });
  put(cx, top, cz, GREEN);
  put(cx, top + 1, cz, SNOW);
  for (const [x, y, z] of cells) if (!has(x, y + 1, z) && rnd(x, y, z) < 0.55) put(x, y, z, SNOW);
}
const BIG = [3.3, 2.4, 2.9, 2.0, 2.4, 1.5, 1.9, 1.0, 1.0];
const MID = [2.9, 2.0, 2.4, 1.5, 1.9, 1.0, 1.0];
const SMALL = [2.4, 1.5, 1.9, 1.0, 1.0];
pine(-12, 0, 7, BIG, 3);
pine(13, 0, 3, BIG, 3);
pine(-3, 0, 13, BIG, 5);
pine(-13, 1, -6, MID, 2);
pine(10, 1, -10, SMALL, 2);

// ---------- aurora borealis ----------
let neon = 0;
function ribbon(id, xa, xb, z0, za, zf, zp, y0, ya, yf, yp, hmin, hmax, thick) {
  for (let x = xa; x <= xb; x++) {
    if (rnd(x, id, 3) < 0.1) continue;
    const z = Math.round(z0 + za * Math.sin(x * zf + zp));
    const base = Math.round(y0 + ya * Math.sin(x * yf + yp));
    const wave = 0.5 + 0.5 * Math.sin(x * 0.8 + id * 1.7);
    const h = Math.max(3, Math.round(hmin + (hmax - hmin) * (0.55 * wave + 0.45 * rnd(x, id, 7))));
    for (let i = 0; i < h; i++) {
      const t = i / (h - 1);
      const r = rnd(x, id * 13 + i, 5);
      let c, glow = false;
      if (t < 0.3) c = LIME;
      else if (t < 0.55) c = r < 0.7 ? LIME : GREEN;
      else if (t < 0.75) { c = CYAN; if (r < 0.12 && neon < 24) { glow = true; neon++; } }
      else if (t < 0.9) c = r < 0.5 ? LIGHT_BLUE : PURPLE;
      else c = r < 0.6 ? MAGENTA : PURPLE;
      put(x, base + i, z, glow ? NEON_BLUE : c);
      if (thick && t < 0.75) put(x, base + i, z + 1, c);
    }
    if (rnd(x, id, 11) < 0.4) put(x, base + h, z, ICE);
    if (rnd(x, id, 12) < 0.3) put(x, base - 1, z, ICE);
  }
}
ribbon(1, -22, 22, 7, 4, 0.21, 0.5, 18, 1.5, 0.3, 1.0, 5, 10, true);
ribbon(2, -22, 22, 13, 4, 0.17, 2.2, 21, 2, 0.24, 3.0, 6, 10, true);
ribbon(3, -22, 22, 19, 3, 0.2, 4.0, 24, 1.5, 0.35, 0.3, 4, 7, false);
ribbon(4, -22, 2, 2, 3, 0.26, 1.2, 25, 1.5, 0.3, 2.0, 3, 6, false);
ribbon(5, 0, 22, 21, 1, 0.3, 0, 18, 1, 0.4, 0, 4, 8, false);

// ---------- emit: solids first, then clear trees from the site ----------
for (const [x, y, z, id] of M.values()) block(x, y, z, id);
const clears = [
  [-10, 0, -9, 10, 7, 10],
  [1, 0, -17, 7, 7, -10],
  [-9, 1, -17, 0, 8, -10],
  [8, 1, -17, 10, 7, -10],
];
for (const [x1, y1, z1, x2, y2, z2] of clears)
  for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) {
    let s = null;
    for (let x = x1; x <= x2 + 1; x++) {
      const free = x <= x2 && !M.has(K(x, y, z));
      if (free && s === null) s = x;
      if (!free && s !== null) { cube(s, y, z, x - 1, y, z, AIR); s = null; }
    }
  }