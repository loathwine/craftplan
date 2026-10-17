// mummy-opus — prompt:
// a mummy bursting out of its sarcophagus...

// ---- site prep: clear trees/rocks over the tomb area (AIR is free) ----
cube(-17, 1, -22, 17, 12, 11, AIR);

// ---- local block buffer (dedupes, last write wins) ----
const M = new Map();
function put(x, y, z, id) {
  if (id == null) return;
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
function del(x, y, z) { M.delete(x + ',' + y + ',' + z); }
function has(x, y, z) { return M.has(x + ',' + y + ',' + z); }
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++)
        put(x, y, z, typeof id === 'function' ? id(x, y, z) : id);
}
function ln(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = Math.round(x1 + (x2 - x1) * t), y = Math.round(y1 + (y2 - y1) * t), z = Math.round(z1 + (z2 - z1) * t);
    put(x, y, z, typeof id === 'function' ? id(x, y, z) : id);
  }
}
function h(x, y, z) {
  let n = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1440662683)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}
// linen wrappings: diagonal bands of white / gray / tan with grime spots
function wrap(x, y, z) {
  if (h(x, y, z) < 0.05) return BROWN;
  const k = (((y + Math.floor((x - z) / 2)) % 4) + 4) % 4;
  return [WHITE, LIGHT_GRAY, WHITE, SAND][k];
}
function seg(a, b, s) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(d * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const bx = Math.round(a[0] + (b[0] - a[0]) * t - (s - 1) / 2);
    const by = Math.round(a[1] + (b[1] - a[1]) * t - (s - 1) / 2);
    const bz = Math.round(a[2] + (b[2] - a[2]) * t - (s - 1) / 2);
    box(bx, by, bz, bx + s - 1, by + s - 1, bz + s - 1, wrap);
  }
}

// ---- desert sand floor (skip the hidden cavity under the dais) ----
for (let x = -16; x <= 16; x++)
  for (let z = -20; z <= 15; z++) {
    const d = (x * x) / (15.5 * 15.5) + ((z + 2) * (z + 2)) / (17.5 * 17.5);
    if (d > 1) continue;
    if (d > 0.85 && h(x, 0, z) < 0.5) continue;
    if (x >= -6 && x <= 6 && z >= -5 && z <= 8) continue;
    put(x, 0, z, SAND);
  }

// ---- tomb dais: stone step + glossy obsidian top with gold/lapis border ----
box(-9, 1, -8, 9, 1, -6, STONE);
box(-9, 1, 9, 9, 1, 10, STONE);
box(-9, 1, -5, -7, 1, 8, STONE);
box(7, 1, -5, 9, 1, 8, STONE);
box(-7, 2, -6, 7, 2, 9, (x, y, z) =>
  (Math.abs(x) === 7 || z === -6 || z === 9) ? (((x + z) & 1) ? GOLD : BLUE) : OBSIDIAN);

// ---- upright anthropoid sarcophagus, open front facing north ----
const HW = [3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 3, 2];
for (let t = 0; t < HW.length; t++) {
  const y = 3 + t, w = HW[t];
  for (let x = -w; x <= w; x++) put(x, y, 8, (t % 5 === 2) ? BLUE : GOLD);
  for (let x = -(w - 1); x <= w - 1; x++) put(x, y, 7, OBSIDIAN);
  for (let z = 4; z <= 7; z++) {
    const c = z === 4 ? ((t & 1) ? GOLD : BLUE) : (t % 4 === 0 ? BLUE : GOLD);
    put(-w, y, z, c); put(w, y, z, c);
  }
}
box(-3, 3, 4, 3, 3, 7, GOLD);          // foot board
box(-2, 26, 4, 2, 26, 8, GOLD);        // head cap
put(0, 27, 4, GOLD); put(0, 27, 5, BLUE);
// splintered lid remnants still clinging to the rim
[[-1, 2], [-1, 6], [-1, 7], [-1, 12], [-1, 13], [-1, 19], [1, 4], [1, 9], [1, 10], [1, 15], [1, 20], [1, 21]]
  .forEach(([s, t]) => put(s * HW[t], 3 + t, 3, (t & 1) ? GOLD : BLUE));
put(-1, 26, 3, GOLD); put(2, 25, 3, BLUE);

// ---- the mummy, lunging out toward the viewer ----
// front (left) leg stepping onto the dais
seg([-2.5, 10, 0.5], [-2.5, 7, -2], 2);
seg([-2.5, 7, -2], [-2.5, 3.5, -2.5], 2);
box(-3, 3, -4, -2, 3, -3, wrap);
// rear (right) leg still inside the coffin
seg([1.5, 10, 1.5], [1.5, 7.5, 3.5], 2);
seg([1.5, 7.5, 3.5], [1.5, 4.5, 5], 2);
box(1, 4, 4, 2, 4, 6, wrap);
// pelvis + hunched torso leaning forward
box(-3, 9, 0, 2, 10, 2, wrap);
for (let y = 11; y <= 16; y++) {
  const zc = Math.round(1 - (y - 10) * 0.4);
  const x1 = y <= 12 ? -2 : (y <= 14 ? -3 : -4);
  const x2 = y <= 12 ? 1 : (y <= 14 ? 2 : 3);
  box(x1, y, zc - 1, x2, y, zc + 1, wrap);
  if (y >= 14) box(-2, y, zc + 2, 1, y, zc + 2, wrap);
}
// head jutting forward
box(-3, 17, -5, 1, 21, -2, wrap);
del(-3, 21, -5); del(1, 21, -5); del(-3, 21, -2); del(1, 21, -2);
box(-3, 20, -6, 1, 20, -6, wrap);      // heavy brow
put(-2, 19, -5, NEON_RED); put(0, 19, -5, NEON_RED);
put(-1, 19, -5, wrap(-1, 19, -5));
put(-2, 17, -5, BLACK); put(-1, 17, -5, BLACK); put(0, 17, -5, BLACK); put(-1, 18, -5, BLACK);
box(-2, 16, -5, 0, 16, -4, wrap);      // dropped jaw
// arms reaching out
seg([-5.5, 15.5, -1], [-6.5, 15, -5], 2);
seg([-6.5, 15, -5], [-6, 16, -9], 2);
seg([4.5, 15.5, -1], [6, 17, -4], 2);
seg([6, 17, -4], [6, 19.5, -7], 2);
function hand(cx, cy, cz, thumb) {
  box(cx - 1, cy - 1, cz, cx + 1, cy, cz, wrap);
  for (const dx of [-1, 0, 1]) {
    put(cx + dx, cy, cz - 1, LIGHT_GRAY);
    put(cx + dx, cy, cz - 2, dx === 0 ? SAND : LIGHT_GRAY);
    put(cx + dx, cy - 1, cz - 3, BROWN);
  }
  put(cx + thumb * 2, cy - 1, cz - 1, LIGHT_GRAY);
  put(cx + thumb * 2, cy, cz - 2, SAND);
}
hand(-6, 16, -10, 1);
hand(6, 20, -8, -1);
// loose, flapping bandage strips
ln(-7, 14, -6, -7, 11, -7, LIGHT_GRAY); ln(-7, 11, -7, -8, 9, -7, SAND);
ln(-5, 14, -9, -5, 12, -10, WHITE);
ln(7, 16, -4, 7, 13, -3, WHITE); ln(7, 13, -3, 8, 11, -3, SAND);
ln(-3, 9, -1, -4, 6, -3, LIGHT_GRAY); ln(-4, 6, -3, -5, 3, -5, SAND);
ln(1, 21, -3, 3, 22, 0, LIGHT_GRAY); ln(3, 22, 0, 4, 20, 2, SAND);
// wrappings torn taut back into the coffin
ln(-2, 13, 2, -3, 14, 6, WHITE);
ln(1, 12, 2, 2, 11, 6, SAND);
ln(-1, 16, 1, 1, 19, 6, LIGHT_GRAY);
ln(2, 9, 2, 3, 8, 6, WHITE);
ln(-3, 18, -1, -3, 22, 6, WHITE);

// ---- burst-off lid, head half: pharaoh mask, leaning on the west pillar ----
function lidHead(u, v) {
  const a = Math.abs(u);
  if (v === 10 && a > 2) return null;
  if (v === 9 && a > 3) return null;
  if (v === 0 && h(u, 0, 99) < 0.45) return null;
  if (u <= -3 && v <= 1) return null;
  if (v <= 2) return [GOLD, LIGHT_BLUE, RED][v];
  if (v === 3) return a === 0 ? BLUE : GOLD;
  if (a >= 3 || v >= 9) return (v % 2 === 0) ? BLUE : GOLD;
  if (v === 8) return BLUE;
  if (v === 7) return a === 1 ? BLACK : (a === 2 ? WHITE : GOLD);
  if (v === 5) return a <= 1 ? RED : GOLD;
  return GOLD;
}
for (let v = 0; v <= 10; v++)
  for (let u = -4; u <= 4; u++) put(-12 + u, 1 + v, -15 + v, lidHead(u, v));
put(-12, 1 + 6 + 1, -15 + 6, GOLD);             // nose relief
[2, 3, 4].forEach(v => put(-12, 1 + v + 1, -15 + v, v & 1 ? GOLD : BLUE)); // braided beard
put(-12, 1 + 9 + 1, -15 + 9, GOLD); put(-12, 1 + 9 + 2, -15 + 9, RED);   // uraeus cobra

// ---- lid foot half: cracked in two on the east sand ----
function lidFoot(u, v) {
  const a = Math.abs(u);
  if (v === 0 && a > 2) return null;
  if (v === 10 && h(u, 10, 3) < 0.4) return null;
  if (a === 3) return BLUE;
  if (u === 0) return [BLACK, RED, BLUE, WHITE, GREEN][Math.floor(h(0, v, 5) * 5)];
  if (v % 3 === 1) return LIGHT_BLUE;
  return GOLD;
}
for (let v = 0; v <= 10; v++) {
  if (v === 5) continue;
  for (let u = -3; u <= 3; u++) {
    const c = lidFoot(u, v);
    if (!c) continue;
    if (v < 5) put(12 + u, 1, -18 + v, c);
    else {
      const y = 1 + Math.floor((v - 6) / 2);
      put(10 + u, y, -18 + v, c);
      for (let yy = 1; yy < y; yy++) put(10 + u, yy, -18 + v, COBBLE);
    }
  }
}

// ---- flaming papyrus pillars ----
function pillar(cx, cz) {
  box(cx - 2, 1, cz - 2, cx + 2, 1, cz + 2, STONE);
  box(cx - 1, 2, cz - 1, cx + 1, 13, cz + 1, (x, y, z) => {
    if (y === 3 || y === 12) return BLUE;
    if (y === 4 || y === 11) return GOLD;
    if (z === cz - 1 && x === cx && y >= 5 && y <= 10) return [RED, BLACK, BLUE, GREEN, BLACK, RED][y - 5];
    return SAND;
  });
  box(cx - 2, 14, cz - 2, cx + 2, 14, cz + 2, (x, y, z) =>
    (Math.abs(x - cx) === 2 && Math.abs(z - cz) === 2) ? null : (((x + z) & 1) ? GREEN : BLUE));
  box(cx - 2, 15, cz - 2, cx + 2, 15, cz + 2, SAND);
  box(cx - 1, 16, cz - 1, cx + 1, 16, cz + 1, GOLD);
  put(cx, 16, cz, LAVA);
  put(cx, 17, cz, FIRE);
}
pillar(-12, -3);
pillar(12, -3);

// ---- braziers on the dais corners ----
function brazier(x, z) {
  put(x, 3, z, GOLD); put(x, 4, z, GOLD);
  box(x - 1, 5, z - 1, x + 1, 5, z + 1, GOLD);
  put(x, 5, z, LAVA);
  put(x, 6, z, FIRE);
}
brazier(-7, -6);
brazier(7, -6);

// ---- canopic jars, gold hoard, ankh ----
[[-6, 0, GOLD], [-6, 2, BLACK], [6, 0, BROWN], [6, 2, GOLD]].forEach(([x, z, c]) => {
  put(x, 3, z, MARBLE); put(x, 4, z, MARBLE); put(x, 5, z, c);
});
box(-7, 3, 5, -5, 3, 7, GOLD); put(-6, 4, 6, GOLD); put(-7, 4, 6, YELLOW); put(-6, 4, 5, GOLD);
box(5, 3, 6, 7, 3, 7, GOLD); put(6, 4, 7, YELLOW);
put(6, 4, 5, GOLD); put(6, 5, 5, GOLD); put(6, 6, 5, GOLD); put(5, 6, 5, GOLD); put(7, 6, 5, GOLD);
put(5, 7, 5, GOLD); put(7, 7, 5, GOLD); put(6, 8, 5, GOLD);

// ---- unlucky tomb raider's skeleton crawling away ----
box(1, 1, -19, 2, 2, -18, WHITE);
put(1, 2, -19, BLACK); put(2, 2, -19, BLACK);
ln(2, 1, -17, 2, 1, -13, LIGHT_GRAY);
[-16, -15, -14].forEach(z => { put(0, 1, z, WHITE); put(4, 1, z, WHITE); box(1, 2, z, 3, 2, z, WHITE); });
box(1, 1, -12, 3, 1, -12, WHITE);
ln(1, 1, -11, 0, 1, -9, WHITE); ln(3, 1, -11, 4, 1, -9, WHITE);
ln(0, 1, -17, -1, 1, -20, WHITE); ln(4, 1, -17, 5, 1, -20, WHITE);
put(-2, 1, -14, OAK_LOG); put(-2, 2, -14, FIRE);  // dropped torch

// ---- tomb wall with hieroglyph columns ----
box(-15, 0, 12, 15, 11, 12, (x, y, z) => {
  if (y === 11) return (x & 1) ? GOLD : BLUE;
  if (y >= 2 && y <= 9 && (((x % 3) + 3) % 3) === 0) {
    const r = h(x, y, 12);
    if (r < 0.6) return [BLUE, RED, BLACK, GOLD, GREEN, CYAN][Math.floor(r / 0.1)];
  }
  return SAND;
});
box(-16, 12, 11, 16, 12, 12, SAND);

// ---- curse lightning crackling off the coffin ----
put(-6, 24, 3, ELECTRIC); put(6, 22, 3, ELECTRIC); put(0, 29, 6, ELECTRIC);

// ---- lid shards blasted into the air ----
[[-3, 13, -7, GOLD], [3, 11, -8, BLUE], [-8, 18, -3, GOLD], [8, 14, -2, GOLD], [-1, 23, -4, BLUE],
 [2, 8, -10, GOLD], [-5, 9, -11, LIGHT_BLUE], [9, 19, 0, GOLD], [-9, 12, -1, BLUE], [4, 24, -1, GOLD],
 [0, 6, -12, RED], [-6, 21, -7, GOLD], [5, 13, -11, BLUE], [-2, 26, -2, GOLD]]
  .forEach(([x, y, z, c]) => put(x, y, z, c));

// ---- debris scattered on the floor ----
for (let i = 0; i < 28; i++) {
  const x = -11 + Math.floor(h(i, 1, 1) * 23);
  const z = -16 + Math.floor(h(i, 2, 2) * 15);
  let y = 1;
  if (Math.abs(x) <= 7 && z >= -6 && z <= 9) y = 3;
  else if (Math.abs(x) <= 9 && z >= -8 && z <= 10) y = 2;
  if (has(x, y, z) || has(x, y + 1, z)) continue;
  put(x, y, z, [GOLD, BLUE, GOLD, LIGHT_BLUE, SAND][i % 5]);
}

// ---- emit ----
for (const [x, y, z, id] of M.values()) block(x, y, z, id);