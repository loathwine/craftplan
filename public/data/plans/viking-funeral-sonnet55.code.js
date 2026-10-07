// viking-funeral-sonnet55 — prompt:
// a burning Viking funeral ship...

const B = {};
function hash(a, b, c) { const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7 + 13.37) * 43758.5453; return s - Math.floor(s); }
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  B[x + ',' + y + ',' + z] = id;
}
function pcube(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++)
        put(x, y, z, typeof id === 'function' ? id(x, y, z) : id);
}
function pline(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    put(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id);
  }
}
function psphere(cx, cy, cz, r, id, skip) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++)
    for (let dy = -R; dy <= R; dy++)
      for (let dz = -R; dz <= R; dz++) {
        if (dx * dx + dy * dy + dz * dz > r * r) continue;
        const x = cx + dx, y = cy + dy, z = cz + dz;
        if (skip && hash(x, y, z) < skip) continue;
        put(x, y, z, typeof id === 'function' ? id(x, y, z) : id);
      }
}

// ---------- CLEAR SITE (free) ----------
for (let x = -21; x <= 21; x++) {
  const zr = Math.floor(12.5 * Math.sqrt(Math.max(0, 1 - (x / 21.5) * (x / 21.5))));
  cube(x, 0, -zr, x, 9, zr, AIR);
}
cube(-20, 0, -19, 21, 10, -12, AIR);

// ---------- SMOKE PLUME (behind, drifting up and east) ----------
const smokeCol = (x, y, z) => { const r = hash(x, y, z + 5); return r < 0.45 ? GRAY : (r < 0.8 ? BLACK : LIGHT_GRAY); };
[[-4, 13, 3, 1.5], [-3, 16, 4, 2], [-1, 20, 5, 2.2], [3, 24, 6, 2.5], [8, 27, 7, 2.7], [13, 30, 8, 2.5]]
  .forEach(([x, y, z, r]) => psphere(x, y, z, r, smokeCol, 0.4));

// ---------- WATER + SHORE ----------
for (let x = -22; x <= 22; x++)
  for (let z = -13; z <= 13; z++) {
    const e20 = (x / 20) * (x / 20) + (z / 11) * (z / 11);
    const e21 = (x / 21.5) * (x / 21.5) + (z / 12.5) * (z / 12.5);
    if (e20 <= 1) put(x, -1, z, WATER);
    else if (e21 <= 1) put(x, -1, z, hash(x, 2, z) < 0.18 ? COBBLE : SAND);
  }

// ---------- HULL ----------
const L = 17;
const tt = x => Math.abs(x) / L;
const Wd = x => 5.4 * (1 - Math.pow(tt(x), 2.2));
const gw = x => 4 + Math.round(3 * Math.pow(tt(x), 3));
const yb = x => Math.floor(2.2 * Math.pow(tt(x), 3));
const hwAt = (x, y) => { const b = yb(x), g = gw(x); return Wd(x) * (0.42 + 0.58 * (y - b) / Math.max(1, g - b)); };
function hullCol(x, y, z) {
  const g = gw(x), b = yb(x), bf = Math.max(0, 1 - Math.abs(x) / 11), r = hash(x, y, z);
  if (r < 0.10 * bf) return LAVA;
  if (r < 0.45 * bf) return BLACK;
  if (r < 0.55 * bf) return RED;
  if (y === g) return PLANKS;
  if (y === g - 1) return BRICK;
  if (y === b) return OAK_LOG;
  return (y % 2 === 0) ? OAK_LOG : BROWN;
}
for (let x = -17; x <= 17; x++) {
  const g = gw(x), b = yb(x);
  for (let y = b; y <= g; y++) {
    const hw = hwAt(x, y), zm = Math.ceil(hw);
    for (let z = -zm; z <= zm; z++) {
      const a = Math.abs(z);
      if (a <= hw + 0.3 && (a > hw - 1.1 || y === b)) put(x, y, z, hullCol(x, y, z));
    }
  }
}
// deck
for (let x = -16; x <= 16; x++) {
  const hw = hwAt(x, 2);
  if (hw < 2.2) continue;
  for (let z = -4; z <= 4; z++)
    if (Math.abs(z) <= hw - 1.1) put(x, 2, z, ((x + z) & 1) ? PLANKS : BROWN);
}
// benches and chests
[-14, -12, 12, 14].forEach(x => {
  const hw = hwAt(x, 3) - 1.1;
  for (let z = -4; z <= 4; z++) if (Math.abs(z) <= hw) put(x, 3, z, PLANKS);
});
pcube(10, 3, 1, 11, 4, 2, BROWN); put(10, 4, 1, GOLD); put(11, 4, 2, GOLD);
pcube(10, 3, -2, 11, 4, -1, BROWN); put(11, 4, -1, GOLD); put(10, 4, -2, GOLD);

// ---------- FUNERAL PYRE ----------
const logCol = (x, y, z) => hash(x, y, z) < 0.35 ? BLACK : OAK_LOG;
const emberCol = (x, y, z) => { const r = hash(x, y, z + 9); return r < 0.3 ? LAVA : (r < 0.7 ? ORANGE : RED); };
for (let x = -9; x <= 4; x++) {
  [-2, 0, 2].forEach(z => put(x, 3, z, logCol(x, 3, z)));
  [-1, 1].forEach(z => put(x, 3, z, emberCol(x, 3, z)));
}
for (let x = -8; x <= 3; x++) {
  if (Math.abs(x) % 2 === 0) { for (let z = -3; z <= 3; z++) put(x, 4, z, logCol(x, 4, z)); }
  else { for (let z = -1; z <= 1; z++) put(x, 4, z, emberCol(x, 4, z)); }
  [-2, 0, 2].forEach(z => put(x, 5, z, logCol(x, 5, z)));
  [-1, 1].forEach(z => put(x, 5, z, emberCol(x, 5, z)));
}
for (let x = -7; x <= 2; x++) {
  if (Math.abs(x) % 2 === 0) { for (let z = -2; z <= 2; z++) put(x, 6, z, logCol(x, 6, z)); }
  else { for (let z = -1; z <= 1; z++) put(x, 6, z, emberCol(x, 6, z)); }
}
pcube(-7, 7, -1, 2, 7, 1, PLANKS);
// the fallen chieftain
pcube(-6, 8, 0, 0, 8, 0, WHITE);
pcube(-4, 9, -1, -2, 9, 1, GOLD); put(-3, 9, 0, RED);
pline(-6, 8, 1, -1, 8, 1, IRON); put(0, 8, 1, GOLD);
put(1, 8, 0, PINK); put(1, 9, 0, IRON); put(2, 8, 0, ORANGE);
pcube(2, 8, -1, 2, 8, -1, GOLD); put(2, 8, 1, GOLD);
put(-7, 8, -1, CYAN); put(-7, 8, 1, RED);

// solid flame tongues
const tongues = [[-8, 2, 7, 5], [-5, 2, 7, 6], [-2, 2, 7, 5], [1, 2, 7, 6], [-1, 2, 7, 8],
  [-7, -2, 7, 3], [-3, -2, 7, 3], [0, -2, 7, 4],
  [-9, 0, 4, 7], [-9, -1, 4, 4], [3, 0, 6, 7], [3, 1, 6, 4], [4, -1, 4, 5]];
tongues.forEach(([x, z, b0, h]) => {
  for (let i = 0; i < h; i++) {
    const r = i / Math.max(1, h - 1);
    put(x, b0 + i, z, r < 0.3 ? RED : (r < 0.7 ? ORANGE : YELLOW));
  }
});

// ---------- MAST, RIGGING, BURNING SAIL ----------
pcube(7, 3, -1, 8, 12, 0, OAK_LOG);
pline(7, 13, 0, 7, 22, 0, OAK_LOG);
pline(7, 22, 0, 16, 7, 0, BROWN);
pline(7, 22, 0, -16, 7, 0, BROWN);
pcube(8, 21, 0, 11, 22, 0, RED); pcube(8, 21, 0, 9, 21, 0, ORANGE);
for (let s = -6; s <= 6; s += 0.5) put(7 + 0.8 * s, 19, -0.6 * s, Math.abs(s) > 5.5 ? GOLD : OAK_LOG);
const sailFires = [];
for (let si = -10; si <= 10; si++) {
  const s = si * 0.5;
  const b = 2.2 * Math.cos(s / 5 * Math.PI / 2);
  const px = 7 + 0.8 * s + 0.6 * b, pz = -0.6 * s + 0.8 * b;
  const ty = 9 + Math.round(hash(si, 3, 5) * 4) + Math.round(2.2 * (1 - Math.abs(s) / 5));
  const stripe = (Math.floor((s + 5) / 2) % 2 === 0) ? RED : WHITE;
  for (let y = 18; y >= ty; y--) {
    if (y > ty + 2 && hash(si, y, 7) < 0.05) continue;
    let c = stripe;
    if (y === ty) c = hash(si, y, 1) < 0.3 ? LAVA : ORANGE;
    else if (y === ty + 1) c = hash(si, y, 2) < 0.55 ? BLACK : ORANGE;
    else if (y === ty + 2 && hash(si, y, 3) < 0.4) c = BLACK;
    put(px, y, pz, c);
  }
  if (si % 4 === 0 && Math.abs(si) <= 8) sailFires.push([px, ty - 1, pz]);
}

// ---------- DRAGON PROW (east) ----------
const dcol = (x, y, z) => hash(x, y, z) < 0.25 ? GOLD : RED;
[[15, 3], [16, 5], [17, 7], [18, 9], [18, 11]].forEach(([px, py], i) => {
  psphere(px, py, 0, 1.5, dcol);
  if (i >= 1) { put(px - 2, py, 0, GOLD); put(px - 2, py + 1, 0, GOLD); }
});
pcube(17, 13, -1, 19, 15, 1, dcol);
pcube(20, 13, -1, 22, 14, 1, RED);
pcube(19, 10, -1, 21, 11, 1, RED);
pcube(18, 15, -1, 21, 15, 1, GOLD);
put(20, 12, 0, ORANGE);
[[20, -1], [20, 1], [22, -1], [22, 1], [21, -1], [21, 1]].forEach(([x, z]) => put(x, 12, z, WHITE));
put(19, 14, -1, NEON_RED); put(19, 14, 1, NEON_RED);
put(22, 14, -1, BLACK); put(22, 14, 1, BLACK);
pline(17, 15, -1, 14, 19, -1, GOLD); pline(17, 15, 1, 14, 19, 1, GOLD);
put(14, 20, -1, IRON); put(14, 20, 1, IRON);
pline(19, 9, 0, 17, 6, 0, BROWN);

// ---------- CURLED TAIL (west) ----------
const tailPts = [[-15, 3, 1.5], [-16, 5, 1.5], [-17, 7, 1.5], [-18, 9, 1.5], [-18, 11, 1.5],
  [-17, 13, 1.3], [-15, 14, 1.2], [-13, 13, 1.0], [-12, 11, 1.0]];
tailPts.forEach(([px, py, r], i) => {
  psphere(px, py, 0, r, i === tailPts.length - 1 ? GOLD : dcol);
  if (i >= 1 && i <= 5) put(px - 2, py, 0, GOLD);
});

// ---------- SHIELDS ----------
const shCols = [RED, YELLOW, BLUE, WHITE, GREEN, ORANGE, BLACK];
[-1, 1].forEach(sg => {
  let k = 0;
  for (let x = -12; x <= 12; x += 3, k++) {
    const g = gw(x), y1 = g - 2, y2 = g - 1;
    const c = shCols[k % shCols.length];
    const zz = (xx, yy) => sg * (Math.floor(hwAt(xx, yy) + 0.3) + 1);
    put(x, y1, zz(x, y1), c); put(x + 1, y1, zz(x + 1, y1), WHITE);
    put(x, y2, zz(x, y2), WHITE); put(x + 1, y2, zz(x + 1, y2), c);
  }
});

// ---------- OARS ----------
[-1, 1].forEach(sg => {
  [-10, -7, -4, 2, 5, 8, 11].forEach(x => {
    const g = gw(x);
    const z0 = sg * (Math.floor(hwAt(x, g) + 0.3) + 1);
    const z1 = z0 + sg * 6;
    pline(x, g, z0, x - 2, -1, z1, PLANKS);
    put(x - 2, -1, z1 + sg, PLANKS); put(x - 3, -1, z1 + sg, PLANKS); put(x - 3, -1, z1, PLANKS);
  });
});

// ---------- FOAM ----------
for (let x = -16; x <= 16; x++) {
  const zt = Math.floor(hwAt(x, yb(x)) + 0.3) + 1;
  [-1, 1].forEach(sg => {
    put(x, -1, sg * zt, hash(x, 1, sg) < 0.7 ? WHITE : LIGHT_BLUE);
    if (hash(x, 4, sg) < 0.35) put(x, -1, sg * (zt + 1), LIGHT_BLUE);
  });
}

// ---------- MOURNERS ON THE SHORE (backs to camera) ----------
function viking(x, z, cloak, mode, helm) {
  pcube(x - 1, -1, z - 1, x + 2, -1, z + 1, GRASS);
  pcube(x, 0, z, x, 1, z, BROWN); pcube(x + 1, 0, z, x + 1, 1, z, BROWN);
  pcube(x, 2, z, x + 1, 3, z, cloak);
  pcube(x, 1, z - 1, x + 1, 3, z - 1, cloak);
  pcube(x - 1, 2, z, x - 1, 3, z, BROWN); pcube(x + 2, 2, z, x + 2, 3, z, BROWN);
  pcube(x, 4, z, x + 1, 4, z, PINK);
  pcube(x, 5, z, x + 1, 5, z, helm || IRON);
  pcube(x, 4, z - 1, x + 1, 4, z - 1, ORANGE);
  pcube(x, 3, z + 1, x + 1, 3, z + 1, ORANGE);
  if (mode === 'spear') {
    pline(x + 3, 0, z, x + 3, 10, z, PLANKS); put(x + 3, 11, z, IRON); put(x + 3, 12, z, IRON);
    pcube(x - 3, 1, z, x - 2, 3, z, RED); put(x - 3, 2, z, YELLOW);
  } else if (mode === 'torch') {
    pline(x + 3, 0, z, x + 3, 6, z, BROWN); put(x + 3, 7, z, FIRE);
    put(x + 2, 4, z, BROWN);
  } else {
    pcube(x - 3, 1, z, x - 2, 3, z, YELLOW); put(x - 2, 2, z, RED);
    pline(x + 3, 1, z, x + 3, 3, z, IRON); put(x + 3, 0, z, GOLD);
  }
}
viking(-15, -15, RED, 'spear');
viking(-11, -16, BLUE, 'torch');
viking(-7, -15, GREEN, 'shield');
viking(6, -16, PURPLE, 'shield');
viking(10, -18, WHITE, 'spear', GOLD);
viking(14, -15, RED, 'torch');
viking(17, -16, BLUE, 'spear');

// ---------- BRAZIERS & RUNE STONES ----------
[[-18, -14], [19, -14]].forEach(([x, z]) => {
  pcube(x - 1, -1, z - 1, x + 1, -1, z + 1, COBBLE);
  pcube(x, 0, z, x, 2, z, COBBLE);
  pcube(x - 1, 3, z - 1, x + 1, 3, z + 1, IRON);
  put(x, 3, z, LAVA); put(x, 4, z, FIRE);
});
pcube(-20, 0, -18, -19, 5, -18, STONE); pcube(-20, 5, -18, -20, 6, -18, STONE);
[[-20, 2], [-20, 3], [-20, 4], [-19, 3]].forEach(([x, y]) => put(x, y, -19, NEON_BLUE));
pcube(20, 0, -18, 21, 4, -18, STONE);
[[21, 1], [21, 2], [21, 3], [20, 2]].forEach(([x, y]) => put(x, y, -19, NEON_BLUE));

// ---------- FIRES (effect cells, ~28) ----------
[[-6, 7, 2], [-3, 7, 2], [0, 7, 2], [2, 7, 2], [-5, 7, -2], [-1, 7, -2], [2, 7, -2], [-7, 8, 0],
  [-5, 13, 2], [1, 13, 2], [-1, 15, 2], [-9, 11, 0], [3, 13, 0], [4, 9, -1],
  [7, 23, 0], [21, 12, 0], [-12, 13, 0]].forEach(([x, y, z]) => put(x, y, z, FIRE));
sailFires.forEach(([x, y, z]) => put(x, y, z, FIRE));

// ---------- FLUSH ----------
for (const k in B) {
  const p = k.split(',');
  block(+p[0], +p[1], +p[2], B[k]);
}