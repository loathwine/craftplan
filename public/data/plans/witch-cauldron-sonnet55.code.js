// witch-cauldron-sonnet55 — prompt:
// a witch brewing a glowing potion in her cauldron...

// ---------- helpers ----------
const M = new Map();
function set(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (Math.abs(x) > 22 || Math.abs(z) > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
const has = (x, y, z) => M.has(x + ',' + y + ',' + z);
const hash = (a, b, c) => { const h = Math.sin(a * 127.1 + b * 311.7 + (c || 0) * 74.7) * 43758.5453; return h - Math.floor(h); };
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) set(x, y, z, id);
}
function ring(cx, y, cz, r, t, id) {
  for (let x = Math.floor(cx - r) - 1; x <= Math.ceil(cx + r) + 1; x++)
    for (let z = Math.floor(cz - r) - 1; z <= Math.ceil(cz + r) + 1; z++) {
      const d = Math.hypot(x - cx, z - cz);
      if (d <= r && d > r - t) {
        const v = typeof id === 'function' ? id(x, z) : id;
        if (v != null) set(x, y, z, v);
      }
    }
}
const disc = (cx, y, cz, r, id) => ring(cx, y, cz, r, r + 1, id);
function ball(cx, cy, cz, r, id) {
  if (r < 0.5) { set(cx, cy, cz, id); return; }
  for (let x = Math.floor(cx - r) - 1; x <= Math.ceil(cx + r) + 1; x++)
    for (let y = Math.floor(cy - r) - 1; y <= Math.ceil(cy + r) + 1; y++)
      for (let z = Math.floor(cz - r) - 1; z <= Math.ceil(cz + r) + 1; z++)
        if ((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= r * r + 0.2) set(x, y, z, id);
}
function tline(x1, y1, z1, x2, y2, z2, r, id) {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    ball(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, r, id);
  }
}
function ballFront(cx, cy, cz, r, x, y) {
  for (let z = Math.floor(cz - r) - 1; z <= cz; z++)
    if ((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= r * r + 0.2) return z;
  return cz;
}

// ---------- clear the site ----------
cube(-15, 0, -13, 17, 12, 10, AIR);
cube(-22, 0, 3, -9, 16, 15, AIR);
cube(0, 0, 10, 12, 26, 17, AIR);

// ---------- scene constants ----------
const CX = -4, CZ = -4;   // cauldron
const WX = 10, WZ = -1;   // witch

// ---------- ground (clearing) ----------
for (let dx = -15; dx <= 15; dx++) for (let dz = -10; dz <= 10; dz++) {
  const n = (dx / 15) ** 2 + (dz / 10) ** 2;
  if (n > 1) continue;
  const x = 2 + dx, z = -1 + dz;
  if (n > 0.8 && hash(x, z, 1) > 0.55) continue;
  const d = Math.hypot(x - CX, z - CZ);
  let id = GRASS;
  if (d < 5.8) id = hash(x, z, 2) > 0.5 ? DIRT : COBBLE;
  else if (hash(x, z, 3) < 0.07) id = DIRT;
  set(x, -1, z, id);
}

// ---------- magic circle + pentagram on the ground ----------
ring(CX, -1, CZ, 8.9, 1.2, PURPLE);
const pent = [];
for (let k = 0; k < 5; k++) {
  const a = (-90 + 72 * k) * Math.PI / 180;
  pent.push([CX + 8.6 * Math.cos(a), CZ + 8.6 * Math.sin(a)]);
}
for (let k = 0; k < 5; k++) {
  const p = pent[k], q = pent[(k + 2) % 5];
  tline(p[0], -1, p[1], q[0], -1, q[1], 0, MAGENTA);
}

// ---------- hearth under the cauldron ----------
tline(CX - 3, 0, CZ, CX + 3, 0, CZ, 0, OAK_LOG);
tline(CX, 0, CZ - 3, CX, 0, CZ + 3, 0, OAK_LOG);
set(CX - 1, 0, CZ - 1, LAVA); set(CX + 1, 0, CZ + 1, LAVA);
set(CX + 1, 0, CZ - 1, LAVA); set(CX - 1, 0, CZ + 1, LAVA);
for (let k = 0; k < 10; k++) {
  const a = k * Math.PI / 5 + 0.3;
  const sx = CX + 4.6 * Math.cos(a), sz = CZ + 4.6 * Math.sin(a);
  set(sx, 0, sz, hash(k, 4, 4) > 0.5 ? COBBLE : STONE);
  if (hash(k, 5, 5) > 0.55) set(sx, 1, sz, COBBLE);
}
// ---------- cauldron ----------
[[CX + 2, CZ + 2], [CX - 3, CZ + 2], [CX + 2, CZ - 3], [CX - 3, CZ - 3]].forEach(([lx, lz]) => box(lx, 0, lz, lx + 1, 1, lz + 1, IRON));
set(CX, 1, CZ, FIRE); set(CX - 1, 1, CZ, FIRE); set(CX + 1, 1, CZ, FIRE);
set(CX, 1, CZ - 1, FIRE); set(CX, 1, CZ + 1, FIRE);
for (let y = 2; y <= 8; y++) {
  const r = Math.sqrt(5.5 * 5.5 - (y - 6) * (y - 6));
  if (y === 2) disc(CX, y, CZ, r, OBSIDIAN);
  else ring(CX, y, CZ, r, 1.5, y === 3 ? IRON : OBSIDIAN);
}
// rim + glowing potion surface
ring(CX, 9, CZ, 5.7, 1.6, IRON);
disc(CX, 9, CZ, 4.1, (x, z) => (hash(x, z, 6) < 0.3 ? GLOWSTONE : LIME));
// bubbles on the surface
[[2, 10, 1, LIME], [-1, 10, -2, GLOWSTONE], [-2, 10, 2, LIME], [1, 10, -1, LIME], [3, 10, 0, GLOWSTONE]].forEach(([dx, y, dz, id]) => set(CX + dx, y, CZ + dz, id));
// handles
[-6, 6].forEach(s => { box(CX + s, 8, CZ, CX + s, 9, CZ, IRON); set(CX + s, 7, CZ, IRON); });
// skull emblem
const SZ = CZ - 6;
for (let dx = -1; dx <= 1; dx++) set(CX + dx, 7, SZ, WHITE);
for (let dx = -2; dx <= 2; dx++) { set(CX + dx, 6, SZ, WHITE); set(CX + dx, 5, SZ, WHITE); }
set(CX - 1, 6, SZ, BLACK); set(CX + 1, 6, SZ, BLACK); set(CX, 5, SZ, BLACK);
set(CX - 1, 4, SZ, WHITE); set(CX, 4, SZ, BLACK); set(CX + 1, 4, SZ, WHITE);
// potion drips down the side
box(CX + 3, 6, CZ - 5, CX + 3, 8, CZ - 5, LIME);
box(CX - 3, 7, CZ - 5, CX - 3, 8, CZ - 5, LIME);
set(CX + 3, 5, CZ - 5, GLOWSTONE);

// floating magic above the cauldron
[[1, 12, -1, 1, LIME], [-2, 14, 1, 1, GLOWSTONE], [2, 16, 0, 0, LIME], [-1, 18, -1, 0, GLOWSTONE],
 [3, 13, 2, 0, LIME], [-4, 12, -2, 0, LIME], [0, 21, 1, 0, LIME], [-3, 17, 2, 0, LIME], [2, 20, -2, 0, GLOWSTONE]]
  .forEach(([dx, y, dz, r, id]) => ball(CX + dx, y, CZ + dz, r, id));
set(CX + 1, 13, CZ, ELECTRIC); set(CX - 2, 16, CZ - 1, ELECTRIC);
set(CX + 2, 19, CZ + 1, ELECTRIC); set(CX - 3, 11, CZ + 1, ELECTRIC);

// ---------- the witch ----------
const rp = [4.1, 3.9, 3.6, 3.3, 3.1, 2.9, 2.7, 2.5, 2.3, 2.4, 2.7, 2.9, 2.9, 2.6, 2.1];
rp.forEach((r, y) => disc(WX, y, WZ, r, PURPLE));
ring(WX, 0, WZ, 4.1, 1.1, MAGENTA);
ring(WX, 1, WZ, 3.9, 0.9, BLUE);
ring(WX, 8, WZ, 2.3, 1.2, BROWN);
set(WX, 8, WZ - 3, GOLD); set(WX, 8, WZ - 2, GOLD);
box(WX + 2, 6, WZ - 2, WX + 3, 7, WZ - 2, BROWN);
// robe stars
[[-2, 4], [1, 6], [2, 3], [-1, 2], [0, 11], [-2, 12], [1, 10], [2, 5], [-1, 5]].forEach(([dx, y]) => {
  let zf = WZ;
  for (let z = WZ - 6; z <= WZ; z++) if (Math.hypot(dx, z - WZ) <= rp[y]) { zf = z; break; }
  set(WX + dx, y, zf, YELLOW);
});
// boots
[-2, -1, 1, 2].forEach(dx => set(WX + dx, 0, WZ - 5, BLACK));
set(WX - 2, 1, WZ - 5, BLACK); set(WX + 2, 1, WZ - 5, BLACK);
// collar + neck
ring(WX, 14, WZ, 2.1, 1.0, MAGENTA);
disc(WX, 14, WZ, 1.3, GREEN);
// hair
box(WX - 3, 9, WZ - 1, WX - 3, 17, WZ + 1, ORANGE);
box(WX + 3, 9, WZ - 1, WX + 3, 17, WZ + 1, ORANGE);
box(WX - 2, 11, WZ + 2, WX + 2, 18, WZ + 2, ORANGE);
set(WX - 3, 8, WZ, ORANGE); set(WX + 3, 8, WZ, ORANGE); set(WX - 4, 10, WZ, ORANGE); set(WX + 4, 10, WZ, ORANGE);
set(WX - 3, 7, WZ, ORANGE); set(WX + 4, 9, WZ + 1, ORANGE);
// head
ball(WX, 17, WZ, 2.8, GREEN);
set(WX - 1, 17, WZ - 2, YELLOW); set(WX + 1, 17, WZ - 2, YELLOW);
set(WX - 1, 18, WZ - 2, BLACK); set(WX + 1, 18, WZ - 2, BLACK);
set(WX - 2, 18, WZ - 1, BLACK); set(WX + 2, 18, WZ - 1, BLACK);
set(WX, 16, WZ - 3, GREEN); set(WX, 16, WZ - 4, GREEN); set(WX, 15, WZ - 4, GREEN); set(WX, 15, WZ - 5, GREEN);
set(WX + 2, 16, WZ - 1, BROWN);
[-1, 0, 1].forEach(dx => set(WX + dx, 15, WZ - 1, RED));
set(WX - 2, 16, WZ - 1, BLACK); set(WX + 2, 15, WZ - 1, BLACK);
set(WX - 3, 17, WZ, GREEN); set(WX + 3, 17, WZ, GREEN);
set(WX - 4, 18, WZ, GREEN); set(WX + 4, 18, WZ, GREEN);
set(WX, 14, WZ - 2, GREEN);
// hat
ring(WX, 19, WZ, 5.5, 6.5, BLACK);
ring(WX, 20, WZ, 5.5, 1.0, (x, z) => (x > WX + 3 || x < WX - 3 ? BLACK : null));
for (let y = 20; y <= 31; y++) {
  const t = (y - 20) / 11;
  const r = 4 * (1 - t) + 0.5;
  const hx = WX + 6 * t * t, hz = WZ + 4 * t * t;
  const col = (y <= 21) ? MAGENTA : BLACK;
  if (r < 2.4) disc(hx, y, hz, Math.max(r, 0.9), col);
  else ring(hx, y, hz, r, 1.4, col);
}
box(WX - 1, 20, WZ - 5, WX + 1, 21, WZ - 5, GOLD);
// right arm (viewer's left) stirring
tline(0 + 7, 13, -1, 7, 11, -3, 1, PURPLE);
tline(7, 11, -3, 6, 13, -3.5, 1, PURPLE);
// wooden spoon
tline(7, 16, -3, -3, 9, -4, 0, OAK_LOG);
ball(-3, 9, -4, 1, PLANKS);
ball(6, 13.5, -3.5, 1.2, MAGENTA);
box(5, 14, -4, 5, 15, -3, GREEN);
// left arm holding a vial
tline(13, 12.5, -1, 14, 10.5, -2.5, 1, PURPLE);
tline(14, 10.5, -2.5, 13, 12, -3.5, 1, PURPLE);
ball(13, 12, -3, 1.1, MAGENTA);
box(12, 13, -4, 14, 13, -4, GREEN);
for (let x = 12; x <= 14; x++) for (let y = 14; y <= 17; y++) for (let z = -5; z <= -3; z++) {
  const inner = (x === 13 && z === -4 && y >= 15 && y <= 16);
  set(x, y, z, inner ? (y === 15 ? GLOWSTONE : LIME) : GLASS);
}
set(13, 18, -4, BROWN);

// ---------- cottage ----------
const X1 = -19, X2 = -12, Z1 = 6, Z2 = 12;
for (let y = -1; y <= 5; y++) for (let x = X1; x <= X2; x++) for (let z = Z1; z <= Z2; z++) {
  if (x === X1 || x === X2 || z === Z1 || z === Z2) set(x, y, z, y <= 1 ? COBBLE : PLANKS);
}
[[X1, Z1], [X1, Z2], [X2, Z1], [X2, Z2]].forEach(([x, z]) => box(x, -1, z, x, 5, z, OAK_LOG));
box(-16, 0, Z1, -15, 2, Z1, BROWN); set(-15, 1, Z1 - 1, GOLD);
box(-17, 0, Z1 - 1, -14, 0, Z1 - 1, COBBLE);
box(-18, 2, Z1, -17, 3, Z1, GLOWSTONE);
box(-14, 2, Z1, -13, 3, Z1, GLOWSTONE);
box(X2, 2, 8, X2, 3, 9, GLOWSTONE);
box(-14, 4, Z1 - 1, -13, 4, Z1 - 1, OAK_LOG);
for (let z = Z1 - 1; z <= Z2 + 1; z++) {
  const dz = z - 9;
  const top = 10 - Math.abs(dz);
  for (let x = X1 - 1; x <= X2 + 1; x++) {
    set(x, top, z, hash(x, z, 7) < 0.1 ? GREEN : BRICK);
    set(x, top - 1, z, BRICK);
  }
}
for (let dz = -2; dz <= 2; dz++) for (let y = 6; y <= 10 - Math.abs(dz) - 2; y++) { set(X1, y, 9 + dz, PLANKS); set(X2, y, 9 + dz, PLANKS); }
box(-14, 8, 10, -13, 14, 11, COBBLE);
set(-13, 16, 10, LIGHT_GRAY); set(-12, 18, 10, WHITE); set(-12, 20, 11, LIGHT_GRAY);
// barrel by the cottage
for (let y = 0; y <= 3; y++) disc(-10, y, 7, 1.7, PLANKS);
ring(-10, 1, 7, 1.7, 0.7, IRON); ring(-10, 3, 7, 1.7, 0.7, IRON);
// mushrooms
function mush(x, z, h) {
  box(x, 0, z, x, h - 1, z, WHITE);
  disc(x, h, z, 2, RED); disc(x, h + 1, z, 1, RED);
  set(x - 1, h, z + 1, WHITE); set(x + 1, h, z - 1, WHITE); set(x, h + 1, z, WHITE);
}
mush(-12, 3, 2); mush(-9, 1, 3); mush(-14, 4, 1);

// ---------- black cat ----------
(function (x, z) {
  box(x - 1, 0, z, x + 1, 3, z + 2, BLACK);
  box(x - 1, 0, z - 1, x + 1, 2, z - 1, BLACK);
  box(x - 1, 4, z - 1, x + 1, 6, z + 1, BLACK);
  set(x - 1, 7, z, BLACK); set(x + 1, 7, z, BLACK);
  set(x - 1, 5, z - 1, YELLOW); set(x + 1, 5, z - 1, YELLOW);
  set(x, 4, z - 1, PINK);
  set(x - 1, 0, z - 1, WHITE); set(x + 1, 0, z - 1, WHITE);
  set(x, 1, z - 1, WHITE); set(x, 2, z - 1, WHITE);
  [[2, 0, 2], [3, 0, 2], [3, 1, 2], [3, 2, 2], [3, 3, 2], [2, 4, 2], [2, 5, 2]].forEach(([dx, y, dz]) => set(x + dx, y, z + dz, BLACK));
})(7, -9);

// ---------- broom ----------
for (let y = 0; y <= 4; y++) disc(13, y, 5, 2.5 - 0.25 * y, SAND);
disc(13, 5, 5, 1.2, BROWN);
tline(13, 6, 5, 16, 22, 7, 0, OAK_LOG);

// ---------- pumpkins ----------
function pump(px, py, pz, r) {
  ball(px, py, pz, r, ORANGE);
  set(px, py + Math.floor(r) + 1, pz, GREEN);
  [[-1, 1], [1, 1], [-1, -1], [0, -1], [1, -1]].forEach(([dx, dy]) => set(px + dx, py + dy, ballFront(px, py, pz, r, px + dx, py + dy), GLOWSTONE));
}
pump(-13, 1, -1, 2.2); pump(-11, 0, 0.5, 1.6); pump(12, 1, -7, 1.8);

// ---------- spellbooks ----------
box(15, 0, -4, 17, 0, -3, RED);
box(15, 1, -4, 16, 1, -3, BLUE);
box(15, 2, -4, 16, 2, -3, BROWN);
set(15, 3, -4, GOLD);

// ---------- toad ----------
box(-9, 0, -2, -8, 1, -1, GREEN);
set(-9, 2, -2, YELLOW); set(-8, 2, -2, YELLOW);

// ---------- rocks ----------
ball(-12, 0, -9, 1.4, GRAY); ball(14, 0, -3, 1.3, STONE); ball(-7, 0, 6, 1.5, COBBLE);

// ---------- candles on the pentagram ----------
pent.forEach(([px, pz]) => { box(px, 0, pz, px, 1, pz, WHITE); set(px, 2, pz, FIRE); });

// ---------- dead tree with a lantern ----------
const TP = [[5, -1, 13], [6, 6, 13], [5, 12, 12], [6, 18, 13], [5, 24, 13]];
const TR = [1.4, 1.2, 1.0, 0.8];
for (let i = 0; i < 4; i++) tline(TP[i][0], TP[i][1], TP[i][2], TP[i + 1][0], TP[i + 1][1], TP[i + 1][2], TR[i], OAK_LOG);
tline(6, 10, 13, -1, 14, 12, 0, OAK_LOG);
tline(5, 13, 12, 11, 17, 13, 0, OAK_LOG);
tline(6, 18, 13, 11, 23, 13, 0, OAK_LOG);
tline(6, 20, 13, 0, 24, 13, 0, OAK_LOG);
tline(5, 24, 13, 3, 29, 13, 0, OAK_LOG);
tline(4, 0, 13, 1, -1, 14, 0, OAK_LOG); tline(7, 0, 13, 10, -1, 14, 0, OAK_LOG);
set(-1, 13, 12, IRON); box(-1, 10, 12, -1, 12, 12, GLOWSTONE);
// crows
function crow(x, y, z) { set(x, y, z, BLACK); set(x + 1, y, z, BLACK); set(x + 2, y, z, BLACK); set(x, y + 1, z, BLACK); set(x - 1, y + 1, z, ORANGE); }
crow(10, 18, 13); crow(8, 24, 13);

// ---------- moon + bats ----------
for (let dx = -4; dx <= 4; dx++) for (let dy = -4; dy <= 4; dy++) if (dx * dx + dy * dy <= 17)
  set(13 + dx, 27 + dy, 21, (dx + 2) ** 2 + (dy - 1) ** 2 <= 2 || (dx - 2) ** 2 + (dy + 2) ** 2 <= 1 ? LIGHT_GRAY : WHITE);
function bat(x, y, z) {
  set(x, y, z, BLACK); set(x, y + 1, z, BLACK);
  tline(x - 4, y + 1, z, x - 1, y, z, 0, BLACK); tline(x + 4, y + 1, z, x + 1, y, z, 0, BLACK);
  set(x - 2, y - 1, z, BLACK); set(x + 2, y - 1, z, BLACK);
}
bat(11, 28, 19); bat(16, 23, 18); bat(2, 27, 16); bat(-8, 22, 8);

// ---------- grass tufts and flowers ----------
for (let i = 0; i < 110; i++) {
  const x = Math.round(2 + 15 * (2 * hash(i, 1, 9) - 1)), z = Math.round(-1 + 10 * (2 * hash(i, 2, 9) - 1));
  if (((x - 2) / 15) ** 2 + ((z + 1) / 10) ** 2 > 0.9) continue;
  if (Math.hypot(x - CX, z - CZ) < 6.5) continue;
  if (has(x, 0, z) || has(x, 1, z)) continue;
  const h = hash(i, 3, 9);
  const id = h < 0.5 ? LEAVES : h < 0.65 ? RED : h < 0.78 ? YELLOW : h < 0.9 ? MAGENTA : WHITE;
  set(x, 0, z, id);
}

// ---------- flush ----------
const out = [...M.values()];
for (const [x, y, z, id] of out.slice(0, 3990)) block(x, y, z, id);