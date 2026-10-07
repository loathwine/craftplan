// rocket-launch-sonnet55 — prompt:
// a rocket launching into space...

const CAP = 3950;
const W = new Map();
const airCols = [];
const K = (x, y, z) => (x + 40) * 100000 + (y + 40) * 300 + (z + 40);
function inb(x, y, z) { return x >= -22 && x <= 22 && z >= -22 && z <= 22 && y >= -8 && y <= 33; }
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (!inb(x, y, z)) return;
  W.set(K(x, y, z), [x, y, z, id]);
}
function soft(x, y, z, id) {
  if (W.size >= CAP) return;
  if (!inb(x, y, z)) return;
  const k = K(x, y, z);
  if (!W.has(k)) W.set(k, [x, y, z, id]);
}
function clearCol(x, z, y1, y2) { airCols.push([x, z, y1, y2]); }
function clearBox(x1, z1, x2, z2, y1, y2) {
  for (let x = x1; x <= x2; x++) for (let z = z1; z <= z2; z++) clearCol(x, z, y1, y2);
}
function ring(cx, cz, y, r, id, solid) {
  const R = Math.ceil(r + 1);
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
    const d = Math.hypot(dx, dz);
    if (d <= r + 0.4 && (solid || d > r - 0.9)) put(cx + dx, y, cz + dz, id);
  }
}
function shell(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) {
    if (x === x1 || x === x2 || y === y1 || y === y2 || z === z1 || z === z2) put(x, y, z, id);
  }
}
function ln(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) || 1;
  for (let i = 0; i <= n; i++) put(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, z1 + (z2 - z1) * i / n, id);
}
function ball(cx, cy, cz, r, id, hollow) {
  const R = Math.ceil(r + 1);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d <= r + 0.3 && (!hollow || d > r - 1.0)) put(cx + dx, cy + dy, cz + dz, id);
  }
}

// ---------- site clearing (trees / bumps) ----------
for (let x = -12; x <= 12; x++) for (let z = -12; z <= 12; z++) {
  if (Math.hypot(x, z) <= 12.3) clearCol(x, z, 0, 9);
}
clearBox(-16, -3, -10, 3, 0, 9);     // gantry
clearBox(6, -19, 16, -11, 0, 9);     // bunker
clearBox(10, -1, 18, 13, 0, 9);      // tanks

// ---------- launch pad ----------
for (let x = -10; x <= 10; x++) for (let z = -10; z <= 10; z++) {
  const r = Math.hypot(x, z);
  if (r > 10.3) continue;
  let c;
  if (r < 4.8) c = BLACK;
  else if (r < 7) c = GRAY;
  else if (r < 9) c = LIGHT_GRAY;
  else {
    const sect = Math.floor((Math.atan2(z, x) + Math.PI) / (Math.PI / 12));
    c = sect % 2 ? YELLOW : BLACK;
  }
  put(x, 0, z, c);
}
// scorched grass
for (let x = -13; x <= 13; x++) for (let z = -11; z <= 13; z++) {
  const r = Math.hypot(x, z);
  if (r > 10.5 && r < 13.5 && x > -10 && ((x * 73856093) ^ (z * 19349663)) >>> 0 % 5 === 0) put(x, -1, z, BLACK);
}
// lamp posts
for (const [px, pz] of [[8, -8], [-8, -8], [8, 8], [-8, 8]]) {
  for (let y = 0; y <= 5; y++) put(px, y, pz, IRON);
  put(px, 6, pz, GLOWSTONE);
  put(px + (px > 0 ? -1 : 1), 6, pz, IRON);
}

// ---------- gantry tower ----------
const TX1 = -15, TX2 = -11, TZ1 = -2, TZ2 = 2, TH = 31;
for (let x = TX1; x <= TX2; x++) for (let z = TZ1; z <= TZ2; z++) { put(x, -1, z, STONE); put(x, 0, z, GRAY); }
for (let y0 = 0; y0 < 30; y0 += 5) {
  const y1 = y0 + 5;
  for (const z of [TZ1, TZ2]) {
    ln(TX1, y0, z, TX2, y1, z, IRON);
    ln(TX2, y0, z, TX1, y1, z, IRON);
  }
  for (const x of [TX1, TX2]) {
    ln(x, y0, TZ1, x, y1, TZ2, IRON);
    ln(x, y0, TZ2, x, y1, TZ1, IRON);
  }
}
for (let y = 5; y <= 30; y += 5) {
  for (let x = TX1; x <= TX2; x++) { put(x, y, TZ1, GRAY); put(x, y, TZ2, GRAY); }
  for (let z = TZ1; z <= TZ2; z++) { put(TX1, y, z, GRAY); put(TX2, y, z, GRAY); }
}
for (const y of [10, 20, 30]) {
  for (let x = TX1 + 1; x < TX2; x++) for (let z = TZ1 + 1; z < TZ2; z++) put(x, y, z, LIGHT_GRAY);
}
for (let y = 0; y <= TH; y++) {
  const c = (y % 6 < 3) ? RED : WHITE;
  put(TX1, y, TZ1, c); put(TX2, y, TZ1, c); put(TX1, y, TZ2, c); put(TX2, y, TZ2, c);
}
for (const [bx, bz] of [[TX1, TZ1], [TX2, TZ1], [TX1, TZ2], [TX2, TZ2]]) put(bx, 32, bz, NEON_RED);
ln(-13, 32, 0, -13, 33, 0, IRON);
put(-13, 33, 0, GLOWSTONE);
// crew access arm (retracted, one block short of the capsule)
for (let x = -12; x <= -8; x++) {
  for (let z = -1; z <= 1; z++) put(x, 27, z, GRAY);
  put(x, 28, -1, IRON); put(x, 28, 1, IRON);
}
shell(-7, 27, -1, -5, 30, 1, WHITE);
put(-6, 29, -1, LIGHT_BLUE); put(-7, 29, -1, LIGHT_BLUE);
put(-5, 28, 0, BLACK); put(-5, 29, 0, BLACK);
put(-6, 31, 0, RED);
// lower stub arm and ground pipe
for (let x = -10; x <= -8; x++) for (let z = -1; z <= 1; z++) put(x, 21, z, GRAY);
ln(-10, 1, 0, -6, 1, 0, IRON);
ln(-10, 1, 1, -6, 1, 1, ORANGE);

// ---------- exhaust plumes ----------
function plume(cx, yTop, yBot, r0, grow) {
  for (let y = yTop; y >= yBot; y--) {
    const rp = r0 + (yTop - y) * grow;
    const lim = rp + 0.4;
    const R = Math.ceil(lim);
    for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
      const d = Math.hypot(dx, dz);
      if (d > lim) continue;
      const f = d / lim;
      let c;
      if (f < 0.3) c = GLOWSTONE;
      else if (f < 0.62) c = YELLOW;
      else if (f < 0.88) c = ORANGE;
      else c = (y <= 5 ? RED : ORANGE);
      put(cx + dx, y, dz, c);
    }
  }
}
plume(0, 10, 1, 1.2, 0.45);
plume(-5, 10, 2, 0.9, 0.25);
plume(5, 10, 2, 0.9, 0.25);

// ---------- rocket ----------
// main engine
ring(0, 0, 12, 3, BLACK, true);
ring(0, 0, 11, 2, COPPER, true);
ring(0, 0, 10, 2.5, COPPER, false);
// booster engines
for (const sx of [-5, 5]) {
  ring(sx, 0, 12, 1.2, BLACK, true);
  ring(sx, 0, 11, 1, COPPER, true);
}
// core body
function bodyCol(y) {
  if (y <= 14) return BLACK;
  if (y <= 19) return WHITE;
  if (y === 20) return RED;
  if (y === 21) return BLACK;
  if (y <= 26) return WHITE;
  return RED;
}
for (let y = 13; y <= 27; y++) ring(0, 0, y, 3, bodyCol(y), false);
// emblem, windows, stripes
for (let x = -1; x <= 1; x++) for (let y = 16; y <= 18; y++) put(x, y, -3, BLUE);
put(0, 17, -3, GOLD);
for (let x = -1; x <= 1; x++) {
  put(x, 24, -3, LIGHT_BLUE);
  put(x, 25, -3, IRON);
  put(x, 23, -3, IRON);
}
for (let y = 22; y <= 26; y++) { put(-2, y, -2, BLACK); put(2, y, -2, BLACK); }
for (let y = 15; y <= 19; y++) { put(-3, y, 0, LIGHT_GRAY); put(3, y, 0, LIGHT_GRAY); }
// nose cone
const nr = [3, 2.7, 2.3, 1.8, 1.2, 0.5];
for (let i = 0; i < nr.length; i++) ring(0, 0, 28 + i, nr[i], i === 0 ? BLACK : RED, i >= 2);
put(0, 33, 0, IRON);
// side boosters
for (const sx of [-5, 5]) {
  for (let y = 13; y <= 21; y++) {
    const c = y <= 14 ? BLACK : (y <= 18 ? WHITE : (y === 19 ? RED : WHITE));
    ring(sx, 0, y, 1.2, c, false);
  }
  ring(sx, 0, 22, 1.0, RED, true);
  put(sx, 23, 0, RED);
  put(sx, 24, 0, IRON);
  put(sx, 17, -2, BLACK);
}
// diagonal fins
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  for (let dy = 0; dy <= 7; dy++) {
    const y = 13 + dy;
    const len = 6 - Math.floor(dy * 0.8);
    for (let k = 2; k < 2 + len; k++) {
      const tip = k === 2 + len - 1;
      put(sx * k, y, sz * k, tip ? BLACK : RED);
      put(sx * (k + 1), y, sz * k, RED);
    }
  }
}

// ---------- control bunker ----------
const bx1 = 7, bx2 = 15, bz1 = -18, bz2 = -12;
for (let x = bx1; x <= bx2; x++) for (let z = bz1; z <= bz2; z++) put(x, -1, z, STONE);
shell(bx1, 0, bz1, bx2, 3, bz2, LIGHT_GRAY);
for (let x = bx1; x <= bx2; x++) { put(x, 4, bz1, GRAY); put(x, 4, bz2, GRAY); }
for (let z = bz1; z <= bz2; z++) { put(bx1, 4, z, GRAY); put(bx2, 4, z, GRAY); }
for (const x of [8, 9, 13, 14]) put(x, 2, bz1, GLASS);
for (const x of [10, 11]) { put(x, 1, bz1, BLACK); put(x, 2, bz1, BLACK); put(x, 3, bz1, NEON_BLUE); }
for (const z of [-16, -14]) { put(bx1, 2, z, GLASS); put(bx2, 2, z, GLASS); }
ln(12, 5, -15, 12, 9, -15, IRON);
ring(12, -15, 9, 2, LIGHT_GRAY, true);
ring(12, -15, 10, 2.5, LIGHT_GRAY, false);
ln(12, 10, -15, 12, 12, -15, IRON);
put(12, 13, -15, NEON_RED);
ln(8, 5, -13, 8, 8, -13, IRON);
put(8, 9, -13, GLOWSTONE);

// ---------- fuel tanks ----------
ball(14, 4, 3, 3, WHITE, true);
ring(14, 3, 4, 3, RED, false);
for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) for (let y = 0; y <= 2; y++) put(14 + dx, y, 3 + dz, IRON);
ball(15, 3, 10, 2.5, WHITE, true);
ring(15, 10, 3, 2.5, BLUE, false);
ln(11, 1, 3, 7, 1, 1, IRON);
ln(11, 2, 3, 7, 2, 1, ORANGE);
ln(14, 1, 6, 15, 1, 8, IRON);

// ---------- moon and stars ----------
ball(14, 27, 17, 4, MARBLE, true);
for (const [dx, dy] of [[-1, 1], [2, -1], [0, -2], [-2, -1], [1, 2]]) {
  const dz = Math.sqrt(Math.max(0, 16 - dx * dx - dy * dy));
  put(14 + dx, 27 + dy, 17 - dz, GRAY);
}
for (const [sx, sy, sz] of [[-18, 30, 12], [-9, 33, 18], [3, 32, 20], [20, 31, 6], [-20, 27, -8], [18, 33, -12], [-4, 33, -14], [8, 30, 21], [-16, 33, 0]]) {
  put(sx, sy, sz, GLOWSTONE);
}

// ---------- fire around the blast ring ----------
for (let i = 0; i < 12; i++) {
  const a = i * Math.PI / 6;
  put(6 * Math.cos(a), 1, 6 * Math.sin(a), FIRE);
}
for (let i = 0; i < 8; i++) {
  const a = i * Math.PI / 4 + Math.PI / 8;
  put(6.4 * Math.cos(a), 2, 6.4 * Math.sin(a), FIRE);
}

// ---------- smoke (soft: never overwrites, fills to budget) ----------
function puff(cx, cy, cz, r, id) {
  const R = Math.ceil(r + 1);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d > r + 0.2) continue;
    const x = Math.round(cx + dx), y = Math.round(cy + dy), z = Math.round(cz + dz);
    if (y < 1) continue;
    if (Math.hypot(x, z) > 10.8) continue;
    soft(x, y, z, id);
  }
}
for (let i = 0; i < 10; i++) {
  const a = i * Math.PI * 2 / 10 + 0.3;
  const r = 6.5 + (i % 3) * 1.0;
  const pr = 2.4 + (i % 3) * 0.3;
  const cy = 1.5 + (i % 2);
  puff(r * Math.cos(a), cy, r * Math.sin(a), pr, i % 2 ? WHITE : LIGHT_GRAY);
}
for (let i = 0; i < 8; i++) {
  const a = i * Math.PI / 4 + 0.5;
  const r = 6 + (i % 2) * 0.8;
  puff(r * Math.cos(a), 3 + (i % 4), r * Math.sin(a), 1.8, i % 2 ? LIGHT_GRAY : WHITE);
}

// ---------- emit ----------
for (const [x, z, y1, y2] of airCols) cube(x, y1, z, x, y2, z, AIR);
for (const v of W.values()) block(v[0], v[1], v[2], v[3]);