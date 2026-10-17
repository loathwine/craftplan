// graveyard-zombie-sonnet55 — prompt:
// a zombie rising from a graveyard...

cube(-20, 0, -19, 20, 9, 17, AIR);

const H = (x, y, z) => { const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + 1.7) * 43758.5453; return n - Math.floor(n); };
const W = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  W.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
function free(x, y, z) { return !W.has(Math.round(x) + ',' + Math.round(y) + ',' + Math.round(z)); }
function fill(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++)
        put(x, y, z, typeof id === 'function' ? id(x, y, z) : id);
}
function tl(x1, y1, z1, x2, y2, z2, r, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = Math.round(x1 + (x2 - x1) * t), cy = Math.round(y1 + (y2 - y1) * t), cz = Math.round(z1 + (z2 - z1) * t);
    fill(cx - r, cy - r, cz - r, cx + r, cy + r, cz + r, id);
  }
}

const skin = (x, y, z) => { const h = H(x, y, z); return h < 0.14 ? LIME : (h > 0.95 ? LIGHT_GRAY : GREEN); };
const sleeve = (x, y, z) => { const h = H(x, y, z); return h < 0.15 ? GREEN : (h < 0.22 ? BROWN : CYAN); };
const stoneFn = (x, y, z) => { const h = H(x, y, z); return h < 0.25 ? COBBLE : (h < 0.32 ? GREEN : (h > 0.9 ? LIGHT_GRAY : STONE)); };
const shirt = (x, y, z) => {
  const h = H(x, y, z);
  if (y <= 3) return h < 0.35 ? BROWN : BLUE;
  if (h < 0.13) return GREEN;
  if (y <= 7 && h < 0.25) return BROWN;
  return CYAN;
};

// ---------- grave mound ----------
function mound(cy, r) {
  for (let dx = -r - 2; dx <= r + 2; dx++)
    for (let dz = -r - 2; dz <= r + 2; dz++) {
      const rr = r + (H(dx, cy, dz) - 0.5) * 1.8;
      if (dx * dx + dz * dz <= rr * rr) {
        const h = H(dx + 9, cy, dz + 3);
        put(dx, cy, dz, h < 0.18 ? BROWN : (h < 0.26 ? COBBLE : DIRT));
      }
    }
}
mound(-1, 8); mound(0, 7); mound(1, 5); mound(2, 3);

// ---------- dirt at clawing hand ----------
for (let dx = -4; dx <= 4; dx++)
  for (let dz = -5; dz <= 3; dz++) {
    if (dx * dx + dz * dz <= 17) {
      const h = H(dx + 40, 2, dz + 8);
      if (h < 0.75) put(10 + dx, 0, -13 + dz, h < 0.2 ? BROWN : DIRT);
      if (h < 0.22) put(10 + dx, 1, -13 + dz, DIRT);
    }
  }

// ---------- ZOMBIE TORSO ----------
const sShift = y => -Math.floor((y - 1) / 4);
const xh = y => (y <= 4 ? 3 : (y <= 8 ? 4 : 5));
for (let y = 1; y <= 11; y++) {
  const s = sShift(y), xs = xh(y);
  for (let x = -xs; x <= xs; x++)
    for (let z = -2 + s; z <= 2 + s; z++) {
      const edge = (x === -xs || x === xs || z === -2 + s || z === 2 + s);
      if (edge || y === 11) put(x, y, z, shirt(x, y, z));
    }
}
// torn open chest with ribs
for (let y = 5; y <= 8; y++)
  for (let x = -2; x <= 2; x++) {
    put(x, y, -3, (y % 2 === 1 || x === 0) ? LIGHT_GRAY : (H(x, y, 5) < 0.35 ? RED : BLACK));
    put(x, y, -2, H(x, y, 9) < 0.4 ? RED : BLACK);
  }
put(-3, 6, -3, GREEN); put(3, 7, -3, GREEN); put(3, 6, -3, BLACK);

// ---------- HEAD ----------
for (let x = -3; x <= 3; x++)
  for (let y = 12; y <= 18; y++)
    for (let z = -6; z <= -1; z++) {
      const edge = (x === -3 || x === 3 || y === 12 || y === 18 || z === -6 || z === -1);
      if (!edge) continue;
      const h = H(x, y, z);
      put(x, y, z, h < 0.12 ? LIME : GREEN);
    }
// face
for (let x = -3; x <= -1; x++) put(x, 17, -6, BLACK);
for (let x = 1; x <= 3; x++) put(x, 17, -6, BLACK);
put(-2, 16, -6, NEON_RED); put(-1, 16, -6, NEON_RED);
put(1, 16, -6, NEON_RED); put(2, 16, -6, NEON_RED);
put(-3, 16, -6, BLACK); put(3, 16, -6, BLACK);
put(-2, 15, -6, BLACK); put(-1, 15, -6, BLACK); put(1, 15, -6, BLACK); put(2, 15, -6, BLACK);
put(0, 15, -7, GREEN); put(0, 14, -7, GREEN); put(0, 14, -6, LIME);
const teeth = [WHITE, BLACK, WHITE, BLACK, WHITE];
for (let i = 0; i < 5; i++) { put(i - 2, 13, -6, teeth[i]); put(i - 2, 12, -6, BLACK); }
put(0, 12, -6, RED); put(-3, 13, -6, BLACK); put(3, 13, -6, BLACK);
// rotting hair, exposed skull
for (let x = -3; x <= 3; x++)
  for (let z = -6; z <= -1; z++)
    if (H(x, 19, z) < 0.3) put(x, 19, z, BROWN);
fill(1, 18, -4, 3, 18, -2, LIGHT_GRAY);
fill(3, 15, -4, 3, 17, -3, LIGHT_GRAY);
put(3, 16, -3, BLACK); put(-3, 14, -5, BLACK); put(-3, 14, -4, BLACK);
// ears
put(-4, 15, -3, GREEN); put(-4, 14, -3, GREEN); put(4, 15, -3, LIME);

// ---------- RAISED ARM (viewer left) ----------
tl(-6, 9, -3, -9, 12, -5, 1, sleeve);
tl(-9, 13, -5, -8, 19, -8, 1, skin);
fill(-10, 21, -9, -6, 22, -8, skin);
const fingers = [
  [-10, 23, -9, -12, 27, -9], [-9, 23, -9, -10, 28, -9], [-8, 23, -9, -8, 29, -9],
  [-7, 23, -9, -6, 28, -9], [-6, 23, -9, -4, 26, -9], [-6, 21, -9, -4, 22, -11]
];
for (const f of fingers) {
  tl(f[0], f[1], f[2], f[3], f[4], f[5], 0, skin);
  put(f[3], f[4], f[5], LIGHT_GRAY);
}
put(-9, 16, -9, LIGHT_GRAY); put(-8, 17, -9, LIGHT_GRAY);

// ---------- CLAWING ARM (viewer right) ----------
tl(6, 9, -3, 9, 6, -5, 1, sleeve);
tl(9, 5, -5, 10, 2, -10, 1, skin);
fill(9, 0, -13, 11, 1, -11, skin);
const claws = [[9, 1, -13, 8, 0, -16], [10, 1, -13, 10, 0, -17], [11, 1, -13, 12, 0, -16], [9, 0, -12, 7, 0, -13]];
for (const f of claws) {
  tl(f[0], f[1], f[2], f[3], f[4], f[5], 0, skin);
  put(f[3], f[4], f[5], LIGHT_GRAY);
}

// ---------- broken coffin shards ----------
tl(-6, 2, 3, -8, 8, 4, 0, PLANKS); tl(-7, 2, 3, -9, 7, 4, 0, PLANKS);
tl(-5, 2, 4, -5, 6, 6, 0, OAK_LOG);
tl(6, 2, 3, 8, 7, 4, 0, PLANKS); tl(7, 2, 3, 9, 6, 4, 0, OAK_LOG);
tl(-8, 1, -4, -11, 5, -6, 0, PLANKS); tl(-8, 2, -4, -11, 6, -6, 0, PLANKS);
tl(7, 1, -2, 9, 4, -1, 0, OAK_LOG);

// ---------- scatter: dug-up earth ----------
for (let dx = -14; dx <= 14; dx++)
  for (let dz = -14; dz <= 14; dz++) {
    const d2 = dx * dx + dz * dz;
    if (d2 > 64 && d2 <= 169) {
      const h = H(dx + 3, 5, dz - 7);
      if (h < 0.4 && free(dx, -1, dz)) put(dx, -1, dz, h < 0.12 ? BROWN : DIRT);
      if (H(dx, 7, dz) < 0.05 && free(dx, 0, dz)) put(dx, 0, dz, COBBLE);
    }
  }

// ---------- tombstones ----------
function tomb(x, z, h, kind, w) {
  w = w === undefined ? 1 : w;
  if (kind === 'cross') {
    const id = H(x, 0, z) < 0.5 ? OAK_LOG : STONE;
    fill(x, -1, z, x, h, z, id);
    fill(x - 2, h - 2, z, x + 2, h - 2, z, id);
    if (id === STONE) put(x, h - 3, z, COBBLE);
  } else {
    for (let dx = -w; dx <= w; dx++) {
      let ch = h;
      if (kind === 'broken') ch = h - Math.floor(H(x + dx, 1, z) * 3) - (dx === w ? 1 : 0);
      for (let y = -1; y <= ch - 1; y++) {
        if (kind === 'round' && y === h - 1 && Math.abs(dx) === w) continue;
        const hh = H(x + dx, y, z);
        let id = GRAY;
        if (hh < 0.2) id = COBBLE; else if (hh > 0.85) id = LIGHT_GRAY;
        if (y <= 1 && hh > 0.5 && hh < 0.7) id = GREEN;
        put(x + dx, y, z, id);
        put(x + dx, y, z + 1, id === GREEN ? STONE : id);
      }
    }
    if (kind !== 'broken' && h >= 5) {
      put(x, h - 2, z, BLACK); put(x - 1, h - 3, z, BLACK); put(x, h - 3, z, BLACK); put(x + 1, h - 3, z, BLACK); put(x, h - 4, z, BLACK);
    }
  }
  fill(x - w, 0, z + 2, x + w, 0, z + 4, H(x, 3, z) < 0.5 ? DIRT : BROWN);
  put(x, 1, z + 3, BROWN);
  put(x + w + 2, 0, z - 1, H(x, 9, z) < 0.5 ? PURPLE : WHITE);
}
tomb(-12, -13, 6, 'cross');
tomb(4, -14, 5, 'round');
tomb(-5, -15, 4, 'broken');
tomb(-17, -14, 5, 'round');
tomb(16, -13, 6, 'cross');
tomb(19, -11, 4, 'broken');
tomb(-19, -5, 5, 'round');
tomb(15, -5, 5, 'round');
tomb(-14, 1, 6, 'cross');
tomb(18, 3, 6, 'cross');
tomb(14, 6, 4, 'broken');
tomb(-9, 10, 5, 'round');
tomb(-3, 13, 6, 'cross');
tomb(2, 10, 4, 'broken');
tomb(-17, 2, 4, 'broken');
tomb(8, -17, 5, 'round', 2);
// crows
put(-19, 5, -5, BLACK); put(-18, 5, -5, BLACK); put(-18, 6, -5, BLACK);
put(15, 5, -5, BLACK); put(14, 5, -5, BLACK); put(14, 6, -5, BLACK);

// candles
put(1, 0, -15, FIRE); put(-14, 0, -10, FIRE); put(12, 0, 3, FIRE);

// ---------- fence ----------
function fenceX(z, x1, x2, g0, g1) {
  for (let x = x1; x <= x2; x++) {
    if (x >= g0 && x <= g1) continue;
    put(x, 1, z, IRON); put(x, 3, z, IRON);
    if (x % 2 === 0 && H(x, 2, z) > 0.1) { fill(x, 0, z, x, 3, z, IRON); put(x, 4, z, IRON); }
  }
}
function fenceZ(x, z1, z2) {
  for (let z = z1; z <= z2; z++) {
    put(x, 1, z, IRON); put(x, 3, z, IRON);
    if (z % 2 === 0 && H(x, 2, z) > 0.1) { fill(x, 0, z, x, 3, z, IRON); put(x, 4, z, IRON); }
  }
}
fenceX(-17, -20, 20, -5, 5);
fenceZ(-20, -16, -6);
fenceZ(20, -16, -6);

// ---------- gate pillars ----------
for (const px of [-7, 6]) {
  fill(px, 0, -18, px + 1, 7, -17, stoneFn);
  fill(px - 1, 8, -19, px + 2, 8, -16, COBBLE);
  put(px, 9, -17, GLOWSTONE);
  put(px, 10, -17, FIRE);
}

// ---------- path ----------
for (let z = -18; z <= -9; z++)
  for (let x = -1; x <= 1; x++)
    if (H(x, 4, z) > 0.2 && free(x, -1, z)) put(x, -1, z, H(x, 8, z) < 0.5 ? COBBLE : GRAY);

// ---------- mausoleum ----------
const mx = 11;
for (let x = mx - 6; x <= mx + 6; x++)
  for (let y = 0; y <= 8; y++)
    for (let z = 12; z <= 17; z++) {
      const edge = (x === mx - 6 || x === mx + 6 || z === 12 || z === 17 || y === 8);
      if (edge) put(x, y, z, stoneFn(x, y, z));
    }
for (let x = mx - 7; x <= mx + 7; x++)
  for (let z = 10; z <= 18; z++)
    if (x === mx - 7 || x === mx + 7 || z === 10 || z === 18 || z === 11) put(x, 9, z, STONE);
fill(mx - 5, 10, 12, mx + 5, 10, 17, STONE);
fill(mx - 3, 11, 13, mx + 3, 11, 16, STONE);
fill(mx - 1, 12, 14, mx + 1, 12, 15, STONE);
fill(mx, 13, 15, mx, 16, 15, IRON); fill(mx - 1, 15, 15, mx + 1, 15, 15, IRON);
for (const cx of [mx - 6, mx - 3, mx + 3, mx + 6]) fill(cx, 0, 11, cx, 8, 11, MARBLE);
fill(mx - 4, 0, 10, mx + 4, 0, 10, COBBLE);
fill(mx - 1, 0, 12, mx + 1, 5, 12, AIR);
fill(mx - 1, 0, 13, mx + 1, 5, 13, OBSIDIAN);
fill(mx - 1, 0, 12, mx - 1, 4, 12, IRON); fill(mx + 1, 0, 12, mx + 1, 4, 12, IRON);
put(mx, 6, 11, WHITE); put(mx, 7, 11, LIGHT_GRAY);
for (const wx of [mx - 5, mx + 5]) fill(wx, 4, 12, wx, 6, 12, GLOWSTONE);
// braziers
for (const bx of [3, 19]) {
  fill(bx, 0, 9, bx, 2, 9, IRON);
  fill(bx - 1, 3, 8, bx + 1, 3, 10, IRON);
  put(bx, 4, 9, FIRE);
}

// ---------- dead tree ----------
fill(-18, 0, 8, -17, 5, 9, OAK_LOG);
fill(-18, 6, 8, -18, 11, 8, OAK_LOG);
tl(-18, 10, 8, -21, 13, 6, 0, OAK_LOG); tl(-21, 13, 6, -22, 16, 5, 0, OAK_LOG);
tl(-18, 10, 8, -14, 15, 10, 0, OAK_LOG); tl(-14, 15, 10, -12, 19, 9, 0, OAK_LOG);
tl(-15, 13, 9, -13, 12, 13, 0, OAK_LOG);
tl(-18, 8, 9, -21, 10, 12, 0, OAK_LOG);
tl(-18, 11, 8, -17, 16, 7, 0, OAK_LOG);
put(-12, 20, 9, BLACK); put(-13, 20, 9, BLACK); put(-11, 21, 9, BLACK);

// ---------- stone cross monument ----------
fill(-15, -1, 12, -11, 0, 16, stoneFn);
fill(-14, 1, 13, -12, 1, 15, STONE);
fill(-13, 2, 14, -12, 9, 15, stoneFn);
fill(-16, 7, 14, -9, 8, 15, stoneFn);
fill(-13, 10, 14, -12, 11, 15, stoneFn);

// ---------- other hands rising ----------
function rhand(x, z, hg, lean) {
  for (let dx = -2; dx <= 3; dx++)
    for (let dz = -1; dz <= 2; dz++)
      if (H(x + dx, 3, z + dz) < 0.6 && free(x + dx, 0, z + dz)) put(x + dx, 0, z + dz, H(x + dx, 1, z + dz) < 0.3 ? BROWN : DIRT);
  const tx = x + lean;
  for (let y = 0; y < hg; y++) {
    const px = x + Math.round(lean * y / hg);
    fill(px, y, z, px + 1, y, z + 1, skin);
  }
  fill(tx - 1, hg, z, tx + 1, hg, z + 1, skin);
  put(tx - 1, hg + 1, z, GREEN); put(tx - 1, hg + 2, z, LIGHT_GRAY);
  put(tx, hg + 1, z, GREEN); put(tx, hg + 2, z, GREEN); put(tx, hg + 3, z, LIGHT_GRAY);
  put(tx + 1, hg + 1, z, GREEN); put(tx + 1, hg + 2, z, LIGHT_GRAY);
  put(tx + 2, hg, z, LIME);
}
rhand(-5, -10, 3, -1);
rhand(3, -9, 2, 1);
rhand(-16, -8, 3, 0);
rhand(13, 1, 3, 1);
rhand(7, 7, 2, 0);
rhand(-8, 6, 3, -1);

// ---------- skulls and bones ----------
function skull(x, z) {
  fill(x, 0, z + 1, x + 1, 1, z + 1, WHITE);
  fill(x, 0, z, x + 1, 0, z, WHITE);
  put(x, 1, z, BLACK); put(x + 1, 1, z, BLACK);
}
skull(-2, -10); skull(-11, -4); skull(13, -7); skull(8, 5);
tl(4, 0, -10, 7, 0, -11, 0, LIGHT_GRAY);
tl(-9, 0, -8, -7, 0, -9, 0, LIGHT_GRAY);
tl(0, 0, -13, -2, 0, -12, 0, LIGHT_GRAY);

// ---------- grass tufts ----------
for (let x = -19; x <= 19; x++)
  for (let z = -16; z <= 9; z++)
    if (H(x, 11, z) < 0.03 && free(x, 0, z) && free(x, -1, z)) put(x, 0, z, LIME);

// ---------- emit (trim lowest-priority extras at budget) ----------
let cnt = 0;
for (const [k, v] of W) {
  const id = v[3];
  if (id === AIR) { block(v[0], v[1], v[2], AIR); continue; }
  if (cnt >= 3990) continue;
  cnt++;
  block(v[0], v[1], v[2], id);
}