// ghost-ship-sonnet55 — prompt:
// a ghost pirate ship...

const rnd = (x, y, z) => { const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return s - Math.floor(s); };

// ---- clear trees from the ship footprint ----
cube(-11, 0, -21, 11, 8, 20, AIR);

// ---- hull geometry (bow toward -Z / camera, stern +Z) ----
const B = 7;
const beam = z => {
  if (z < -3) { const d = Math.min(1, (-3 - z) / 14); return B * (1 - Math.pow(d, 1.6)); }
  if (z > 5) return B - (z - 5) * 0.17;
  return B;
};
const OFF = [5, 4, 3, 2, 1, 0];
const hwy = (z, y) => Math.max(0, Math.round(beam(z)) - OFF[Math.max(0, Math.min(5, y))]);
const topY = z => z >= 8 ? 9 : z <= -16 ? 10 : z <= -13 ? 9 : z <= -9 ? 8 : 6;

function hullBlock(x, y, z, top) {
  const r = rnd(x, y, z);
  if (y === top) return ((x + z) & 3) === 0 ? LIGHT_BLUE : (r < 0.5 ? LIGHT_GRAY : GRAY);
  if (y === 5) return (z & 1) === 0 ? LIGHT_BLUE : BROWN;
  if (y <= 1) return r < 0.3 ? GREEN : (r < 0.75 ? BLACK : GRAY);
  if (r > 0.95) return null;
  return r < 0.5 ? BROWN : (r < 0.78 ? OAK_LOG : GRAY);
}

for (let z = -17; z <= 17; z++) {
  const top = topY(z);
  for (let y = 0; y <= top; y++) {
    const hi = hwy(z, y);
    const lo = y === 0 ? 0 : Math.max(hwy(z, y - 1), hi - 1);
    for (let x = lo; x <= hi; x++) {
      for (const s of (x === 0 ? [1] : [1, -1])) {
        const id = hullBlock(x * s, y, z, top);
        if (id) block(x * s, y, z, id);
      }
    }
  }
}

// stern transom with glowing windows
for (let y = 1; y <= 9; y++) {
  const hi = hwy(17, y);
  const lo = y >= 6 ? hi : Math.max(hwy(17, y - 1), hi - 1);
  for (let x = -(lo - 1); x <= lo - 1; x++) {
    let id = hullBlock(x, y, 17, 9);
    if (y === 7 && x % 2 === 0 && Math.abs(x) <= 4) id = x === 0 ? NEON_BLUE : LIGHT_BLUE;
    if (id) block(x, y, 17, id);
  }
}

// ---- decks ----
const HZ = [-6, 4];
const inHatch = (x, z) => Math.abs(x) <= 1 && HZ.some(h => z >= h && z <= h + 2);
for (let z = -16; z <= 16; z++) {
  const h = hwy(z, 5) - 2;
  for (let x = -h; x <= h; x++) {
    if (inHatch(x, z)) continue;
    const r = rnd(x, 5, z);
    if (r > 0.97) continue;
    block(x, 5, z, r < 0.5 ? PLANKS : (r < 0.8 ? BROWN : GRAY));
  }
}
for (let z = -16; z <= -9; z++) { // forecastle deck
  const h = hwy(z, 8) - 1;
  for (let x = -h; x <= h; x++) block(x, 8, z, rnd(x, 8, z) < 0.6 ? PLANKS : BROWN);
}
for (let z = 8; z <= 16; z++) { // quarterdeck
  const h = hwy(z, 9) - 1;
  for (let x = -h; x <= h; x++) block(x, 9, z, rnd(x, 9, z) < 0.6 ? PLANKS : BROWN);
}
// bulkheads with doors
for (let y = 6; y <= 7; y++) {
  const h = hwy(-9, y) - 1;
  for (let x = -h; x <= h; x++) { if (Math.abs(x) <= 1) continue; block(x, y, -9, rnd(x, y, -9) < 0.5 ? BROWN : GRAY); }
}
for (let y = 6; y <= 8; y++) {
  const h = hwy(8, y) - 1;
  for (let x = -h; x <= h; x++) { if (Math.abs(x) <= 1 && y <= 7) continue; block(x, y, 8, rnd(x, y, 8) < 0.5 ? BROWN : GRAY); }
}
// stairs
for (const s of [1, -1]) {
  for (let x = 3; x <= 5; x++) {
    block(x * s, 6, -6, PLANKS);
    cube(x * s, 6, -7, x * s, 7, -7, PLANKS);
    cube(x * s, 6, -8, x * s, 8, -8, PLANKS);
    block(x * s, 6, 5, PLANKS);
    cube(x * s, 6, 6, x * s, 7, 6, PLANKS);
    cube(x * s, 6, 7, x * s, 8, 7, PLANKS);
  }
}
// hatch coamings + glowing holds
for (const h of HZ) for (let x = -2; x <= 2; x++) for (let z = h - 1; z <= h + 3; z++)
  if (Math.abs(x) === 2 || z === h - 1 || z === h + 3) block(x, 6, z, BLACK);
block(0, 1, -5, NEON_BLUE);
cube(-1, 1, 4, 1, 1, 6, GOLD);
block(0, 2, 5, GLOWSTONE);

// ---- gun ports ----
for (const z of [-6, -1, 4, 11, 15]) {
  const h3 = hwy(z, 3), l3 = Math.max(hwy(z, 2), h3 - 1);
  for (const s of [1, -1]) {
    for (let x = l3; x <= h3; x++) block(x * s, 3, z, AIR);
    block(h3 * s, 3, z, IRON);
    block(hwy(z, 4) * s, 4, z, NEON_BLUE);
  }
}

// ---- masts, yards, sails ----
cube(0, 6, -8, 0, 30, -8, OAK_LOG);
cube(0, 6, 2, 0, 32, 2, OAK_LOG);
cube(0, 10, 9, 0, 25, 9, OAK_LOG);
block(0, 31, -8, GLOWSTONE);
block(0, 33, 2, GLOWSTONE);
block(0, 26, 9, GLOWSTONE);

const SK = { 15: '.#####.', 14: '#######', 13: '#@@#@@#', 12: '###.###', 11: '.#.#.#.' };
const emblem = (x, y) => {
  const row = SK[y];
  if (row && x >= -3 && x <= 3) { const c = row[x + 3]; if (c === '#') return BLACK; if (c === '@') return NEON_BLUE; }
  if (y >= 9 && y <= 16) { const k = Math.abs(Math.round((y - 12.5) * 1.2)); if (Math.abs(x) === k) return GRAY; }
  return null;
};

function sail(zm, y0, y1, wBot, wTop, bulge, emb) {
  const n = y1 - y0;
  for (let y = y0; y <= y1; y++) {
    const t = n === 0 ? 0 : (y - y0) / n;
    const hw = Math.round(wBot + (wTop - wBot) * t);
    for (let x = -hw; x <= hw; x++) {
      const u = x / (hw + 0.5);
      const bil = Math.round(bulge * (1 - u * u) * (0.6 + 0.4 * Math.sin(Math.PI * (y - y0 + 1) / (n + 2))));
      if (emb) { const e = emb(x, y); if (e) { block(x, y, zm - bil, e); continue; } }
      const r = rnd(x, y, zm);
      if (r < 0.07) continue;
      const edge = y - y0;
      if (edge < 2 && r < 0.35 - edge * 0.15) continue;
      if (Math.abs(x) >= hw && r < 0.4) continue;
      block(x, y, zm - bil, r < 0.5 ? LIGHT_GRAY : (r < 0.85 ? WHITE : LIGHT_BLUE));
    }
  }
}
const yard = (zm, y, half) => {
  for (let x = -half; x <= half; x++) block(x, y, zm - 1, Math.abs(x) > half - 2 ? LIGHT_GRAY : OAK_LOG);
};

// mainmast
sail(2, 8, 17, 10, 9, 2, null);   yard(2, 18, 11);
sail(2, 19, 25, 8, 6, 2, null);   yard(2, 26, 9);
sail(2, 27, 29, 5, 4, 1, null);   yard(2, 30, 6);
// foremast (skull & crossbones)
sail(-8, 9, 16, 8, 7, 2, emblem); yard(-8, 17, 9);
sail(-8, 18, 23, 7, 5, 2, null);  yard(-8, 24, 8);
sail(-8, 25, 27, 5, 4, 1, null);  yard(-8, 28, 6);
// mizzen
sail(9, 12, 16, 6, 5, 1, null);   yard(9, 17, 7);
sail(9, 18, 22, 5, 4, 1, null);   yard(9, 23, 6);
// ghost lanterns on yard ends
block(9, 25, 1, GLOWSTONE); block(-9, 25, 1, GLOWSTONE);

// ---- bow: stem, bowsprit, figurehead ----
line(0, 10, -17, 0, 14, -22, OAK_LOG);
cube(0, 6, -18, 0, 9, -18, BROWN);
cube(0, 6, -19, 0, 8, -19, WHITE);
block(1, 8, -19, ICE); block(-1, 8, -19, ICE);
block(0, 9, -19, WHITE);
block(0, 9, -20, NEON_BLUE);
block(1, 9, -19, LIGHT_BLUE); block(-1, 9, -19, LIGHT_BLUE);
block(1, 10, -19, LIGHT_BLUE); block(-1, 10, -19, LIGHT_BLUE);
block(0, 5, -19, ICE); block(0, 4, -20, ICE); block(0, 3, -20, ICE);
for (const s of [1, -1]) { // bow lanterns
  cube(2 * s, 10, -14, 2 * s, 11, -14, BROWN);
  block(2 * s, 12, -14, GLOWSTONE);
  block(2 * s, 13, -14, FIRE);
}

// ---- stern cabin, wheel, lanterns ----
for (let x = -4; x <= 4; x++) for (let y = 10; y <= 13; y++) {
  const win = (y === 11 || y === 12) && ((x >= -3 && x <= -2) || (x >= 2 && x <= 3));
  if (x === 0 && y <= 11) continue;
  block(x, y, 13, win ? GLASS : (rnd(x, y, 13) < 0.4 ? GRAY : BROWN));
}
cube(-4, 10, 16, 4, 13, 16, BROWN);
cube(-4, 10, 14, -4, 13, 15, BROWN);
cube(4, 10, 14, 4, 13, 15, BROWN);
cube(-4, 14, 12, 4, 14, 16, GRAY);
cube(-3, 15, 13, 3, 15, 16, LIGHT_GRAY);
cube(-1, 16, 14, 1, 16, 15, GRAY);
block(0, 12, 15, GLOWSTONE);
block(-3, 12, 15, NEON_BLUE); block(3, 12, 15, NEON_BLUE);
for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
  const d = dx * dx + dy * dy;
  if (d >= 4 && d <= 5) block(dx, 13 + dy, 11, BROWN);
  else if (d <= 1) block(dx, 13 + dy, 11, d === 0 ? IRON : OAK_LOG);
}
block(0, 10, 11, BROWN);
for (const s of [1, -1]) {
  cube(5 * s, 10, 15, 5 * s, 12, 15, BROWN);
  block(5 * s, 13, 15, GLOWSTONE);
  block(5 * s, 14, 15, FIRE);
}

// ---- rigging ----
function shrouds(zm, yTop, hy) {
  for (const s of [1, -1]) for (const off of [2, 4]) {
    const zr = zm + off;
    line(s, yTop, zm, s * hwy(zr, hy), hy + 1, zr, GRAY);
  }
}
shrouds(2, 24, 6);
shrouds(-8, 22, 6);
shrouds(9, 21, 9);
line(0, 29, -8, 0, 15, -22, GRAY);
line(0, 31, 2, 0, 29, -8, GRAY);
line(0, 24, 9, 0, 30, 2, GRAY);
line(0, 25, 9, 0, 16, 15, GRAY);

// ---- tattered pennants ----
function pennant(zm, y, len, id) {
  for (let i = 1; i <= len; i++) {
    if (i > len - 2 && rnd(i, y, zm) < 0.4) continue;
    block(i, y, zm, id);
    if (i <= len - 2) block(i, y - 1, zm, id);
  }
}
pennant(2, 32, 7, BLACK);
pennant(-8, 30, 5, GRAY);
pennant(9, 25, 4, GRAY);

// ---- deck props ----
for (const [bx, bz] of [[-5, -3], [-5, -2], [-4, -3], [5, 3], [5, 4], [4, 3]]) {
  cube(bx, 6, bz, bx, 7, bz, BROWN);
  block(bx, 8, bz, OAK_LOG);
}
cube(-5, 6, 3, -4, 6, 3, BROWN);
block(-5, 7, 3, GOLD); block(-4, 7, 3, GOLD);
cube(-5, 6, -6, -4, 6, -6, BROWN);
block(-4, 7, -6, GOLD);
for (const z of [-4, 3]) for (const s of [1, -1]) {
  block(7 * s, 7, z, BROWN);
  block(7 * s, 8, z, GLOWSTONE);
}
// anchor on the east bow
{
  const az = -5, ax = hwy(az, 6) + 1;
  cube(ax, 1, az, ax, 6, az, IRON);
  cube(ax, 5, az - 1, ax, 5, az + 1, IRON);
  block(ax - 1, 1, az, IRON); block(ax + 1, 1, az, IRON);
  block(ax - 2, 2, az, IRON); block(ax + 2, 2, az, IRON);
}

// ---- ghostly crew ----
function ghost(x, y, z, neon) {
  cube(x, y, z, x, y + 1, z, ICE);
  cube(x, y + 2, z, x, y + 3, z, LIGHT_GRAY);
  block(x - 1, y + 3, z, ICE); block(x + 1, y + 3, z, ICE);
  block(x, y + 4, z, neon ? NEON_BLUE : WHITE);
}
ghost(-4, 6, -1, true);
ghost(4, 6, -3, false);
ghost(-3, 6, 0, false);
ghost(4, 6, 1, true);
ghost(1, 9, -11, false);
ghost(-3, 10, 10, true);
// the captain
{
  const x = 3, y = 10, z = 10;
  cube(x, y, z, x, y + 1, z, BLACK);
  cube(x, y + 2, z, x, y + 3, z, BLUE);
  block(x - 1, y + 3, z, BLUE); block(x + 1, y + 3, z, BLUE);
  block(x, y + 4, z, WHITE);
  block(x, y + 4, z - 1, NEON_RED);
  cube(x - 1, y + 5, z - 1, x + 1, y + 5, z + 1, BLACK);
  block(x, y + 6, z, BLACK);
  line(x + 2, y + 2, z - 1, x + 2, y + 6, z - 1, IRON);
  block(x + 2, y + 3, z, BLUE);
}

// ---- ghostly sea ----
for (let z = -19; z <= 19; z++) for (let x = -10; x <= 10; x++) {
  const e = (x / 10.5) ** 2 + (z / 19.8) ** 2;
  if (e > 1 - 0.25 * rnd(x, 3, z)) continue;
  if (z >= -17 && z <= 17 && Math.abs(x) <= hwy(z, 0)) continue;
  block(x, 0, z, WATER);
  if (rnd(x, 9, z) < 0.12) block(x, 1, z, ICE);
}

// ---- drifting spectral mist ----
for (let i = 0; i < 48; i++) {
  const a = rnd(i, 1, 7) * 6.283;
  const rr = 11 + rnd(i, 2, 3) * 5;
  const x = Math.round(Math.cos(a) * rr);
  const z = Math.round(Math.sin(a) * Math.min(20, rr * 1.4));
  if (Math.abs(x) < 4 && z < -16) continue;
  const y = 1 + Math.floor(rnd(i, 4, 9) * 12);
  cube(x, y, z, x + 1, y, z + (rnd(i, 5, 1) > 0.5 ? 1 : 0), ICE);
}