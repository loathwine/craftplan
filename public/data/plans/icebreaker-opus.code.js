// icebreaker-opus — prompt:
// a red icebreaker ship smashing through sea ice...

const M = new Map();
let L = 0;
function P(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  const e = M.get(k);
  if (e && e[4] < L) return;
  M.set(k, [x, y, z, id, L]);
}
function D(x, y, z) { M.delete(x + ',' + y + ',' + z); }
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) P(x, y, z, id);
}
function shell(x1, y1, z1, x2, y2, z2, id, bottom) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++)
    if (x === x1 || x === x2 || z === z1 || z === z2 || y === y2 || (bottom && y === y1)) P(x, y, z, id);
}
function ln(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) * 2 || 1;
  for (let i = 0; i <= n; i++) { const t = i / n; P(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id); }
}
function h2(x, z, s) { const n = Math.sin(x * 127.1 + z * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); }

// clear the forest over the frozen sea area
cube(-17, 1, -22, 17, 10, 22, AIR);

// ================= SHIP (priority 0) =================
L = 0;
function bowTip(y) { return y < 0 ? -10 : -11 - Math.round(y * 4 / 6); }
function sternZ(y) { return y < 0 ? 17 : 18; }
function hw(z, y) {
  if (y < -1 || y > 6) return -1;
  const bt = bowTip(y), se = sternZ(y);
  if (z < bt || z > se) return -1;
  let h = Math.round(5 * Math.sqrt(Math.min(1, (z - bt) / 10)));
  if (z === se) h -= 1;
  if (y < 0) h -= 1;
  return Math.max(0, h);
}
// raked icebreaker hull, layer by layer
for (let y = -1; y <= 6; y++) {
  const bt = bowTip(y), se = sternZ(y);
  const col = y <= 0 ? BLACK : RED;
  let prev = -1;
  for (let z = bt; z <= se; z++) {
    const h = hw(z, y);
    let lo = prev < 0 ? 0 : Math.min(prev, h);
    if (y > -1) lo = Math.min(lo, hw(z, y - 1) + 1);
    lo = Math.max(0, Math.min(lo, h));
    for (let x = lo; x <= h; x++) { P(x, y, z, col); P(-x, y, z, col); }
    if (z === se) for (let x = -h; x <= h; x++) P(x, y, z, col);
    prev = h;
  }
}
// deck
for (let z = bowTip(6); z <= 18; z++) { const h = hw(z, 6); for (let x = -h + 1; x <= h - 1; x++) P(x, 6, z, GRAY); }
// white boot stripe at the waterline
for (let z = bowTip(1); z <= 18; z++) { const h = hw(z, 1); if (h >= 0) { P(h, 1, z, WHITE); P(-h, 1, z, WHITE); } }
// portholes
for (let z = -6; z <= 16; z += 2) { const h = hw(z, 3); P(h, 3, z, BLACK); P(-h, 3, z, BLACK); }
// anchors in hawse pipes
for (const s of [-1, 1]) { P(3 * s, 4, -11, IRON); P(4 * s, 3, -11, IRON); P(4 * s, 2, -11, IRON); P(4 * s, 2, -12, IRON); P(4 * s, 2, -10, IRON); }
// forecastle bulwark
{
  let prev = -1;
  for (let z = -15; z <= -5; z++) {
    const h = hw(z, 6); let lo = prev < 0 ? 0 : Math.min(prev, h);
    for (let x = lo; x <= h; x++) { P(x, 7, z, RED); P(-x, 7, z, RED); }
    prev = h;
  }
  P(0, 8, -15, RED); P(0, 8, -14, WHITE);
}
// railings
for (let z = -4; z <= 17; z += 2) { const h = hw(z, 6); P(h, 7, z, IRON); P(-h, 7, z, IRON); }

// --- Superstructure ---
shell(-4, 7, -3, 4, 9, 10, WHITE);
for (let x = -3; x <= 3; x += 2) P(x, 8, -3, BLACK);
for (let z = -1; z <= 9; z += 2) { P(4, 8, z, BLACK); P(-4, 8, z, BLACK); }
P(0, 7, -3, GRAY); P(0, 8, -3, GRAY);
shell(-4, 10, -2, 4, 12, 6, WHITE);
for (let x = -3; x <= 3; x += 2) P(x, 11, -2, BLACK);
for (let z = 0; z <= 6; z += 2) { P(4, 11, z, BLACK); P(-4, 11, z, BLACK); }
// bridge with wings
shell(-6, 13, -3, 6, 15, 2, WHITE, true);
for (let x = -5; x <= 5; x++) P(x, 14, -3, OBSIDIAN);
for (let z = -2; z <= 1; z++) { P(6, 14, z, OBSIDIAN); P(-6, 14, z, OBSIDIAN); }
for (let x = -6; x <= 6; x++) P(x, 15, -4, WHITE);
P(-5, 16, -3, GLOWSTONE); P(5, 16, -3, GLOWSTONE);
// mast + radar
ln(0, 16, 0, 0, 25, 0, IRON);
box(-1, 19, -1, 1, 19, 1, GRAY);
ln(-3, 22, 0, 3, 22, 0, BLACK);
ln(-2, 24, 0, 2, 24, 0, IRON);
P(0, 26, 0, NEON_RED);
P(3, 17, 1, WHITE); P(3, 18, 1, WHITE); P(2, 17, 1, WHITE); P(4, 17, 1, WHITE); P(3, 17, 0, WHITE);
// lifeboats on davits
for (const s of [-1, 1]) {
  box(5 * s, 10, 0, 6 * s, 10, 4, ORANGE);
  box(5 * s, 11, 1, 6 * s, 11, 3, ORANGE);
  P(5 * s, 11, -1, IRON); P(5 * s, 11, 5, IRON); P(5 * s, 12, -1, IRON); P(5 * s, 12, 5, IRON);
}
// funnel
shell(-2, 10, 7, 2, 18, 10, RED);
for (let x = -2; x <= 2; x++) for (let z = 7; z <= 10; z++) {
  if (x === -2 || x === 2 || z === 7 || z === 10) { P(x, 15, z, WHITE); P(x, 17, z, BLACK); P(x, 18, z, BLACK); }
}
for (let x = -1; x <= 1; x++) for (let z = 8; z <= 9; z++) D(x, 18, z);
box(-1, 17, 8, 1, 17, 9, BLACK);
P(-1, 18, 8, IRON); P(-1, 19, 8, IRON); P(1, 18, 9, IRON); P(1, 19, 9, IRON);
P(-1, 20, 8, STEAM); P(1, 20, 9, STEAM); P(0, 19, 8, STEAM);
// hangar + helideck aft
box(-4, 7, 11, -4, 8, 17, WHITE); box(4, 7, 11, 4, 8, 17, WHITE);
box(-3, 7, 18, 3, 8, 18, LIGHT_GRAY);
box(-4, 9, 11, 4, 9, 18, GRAY);
for (let x = -4; x <= 4; x++) for (let z = 11; z <= 18; z++) {
  const d = Math.hypot(x, z - 14.5);
  if (d >= 2.6 && d < 3.6) P(x, 9, z, WHITE);
}
for (let z = 13; z <= 16; z++) { P(-1, 9, z, YELLOW); P(1, 9, z, YELLOW); }
P(0, 9, 14, YELLOW); P(0, 9, 15, YELLOW);
// ensign at the stern
ln(0, 10, 18, 0, 16, 18, IRON);
for (let x = 1; x <= 4; x++) for (let y = 13; y <= 15; y++) P(x, y, 18, (x === 2 || y === 14) ? YELLOW : BLUE);
// foredeck: mast, crane lowering a crate, windlass, containers, crew
ln(0, 7, -10, 0, 13, -10, IRON); ln(-1, 12, -10, 1, 12, -10, IRON); P(0, 14, -10, GLOWSTONE);
ln(3, 7, -6, 3, 9, -6, YELLOW); box(2, 10, -7, 4, 11, -5, YELLOW); P(2, 11, -7, BLACK);
ln(3, 12, -6, 7, 14, -10, YELLOW);
ln(7, 13, -10, 7, 6, -10, IRON); box(6, 4, -11, 8, 5, -9, ORANGE);
box(-1, 7, -12, 1, 7, -11, GRAY); P(0, 8, -12, IRON);
box(-3, 7, -8, -2, 8, -6, BLUE); box(-3, 7, -5, -2, 7, -4, ORANGE);
function crew(x, z, c) { P(x, 7, z, BLACK); P(x, 8, z, c); P(x, 9, z, SAND); }
crew(2, -12, ORANGE); crew(-2, -9, ORANGE); crew(1, -7, ORANGE);

// ================= ICE FEATURES (priority 1) =================
L = 1;
function slab(xc, zc, su, sv, a, rise, top) {
  const ca = Math.cos(a * Math.PI / 180), sa = Math.sin(a * Math.PI / 180);
  for (let i = 0; i <= su; i += 0.5) for (let j = 0; j <= sv; j += 0.5) {
    const x = xc + ca * i - sa * j, z = zc + sa * i + ca * j, y = Math.round(rise * i / su);
    P(x, y, z, top || SNOW);
    if (y >= 1) P(x, y - 1, z, ICE);
  }
}
// slabs heaved up by the bow
slab(-8, -13, 4, 3, 0, 3);
slab(8, -10, 4, 3, 180, 3);
slab(2, -19, 4, 3, 90, 3, WHITE);
slab(-6, -17, 3, 2, 30, 2);
slab(5, -16, 3, 2, 140, 2);
// floes shoved onto the channel edges
slab(5, -6, 3, 4, 0, 2);
slab(-5, -2, 3, 4, 180, 2);
slab(-8, 6, 2, 3, 200, 1, WHITE);
slab(6, 12, 2, 2, 20, 1);
// crushed ice heaped against the stem
for (const [x, z, y] of [[-2, -12, 1], [2, -12, 1], [-3, -11, 1], [3, -11, 1], [-1, -13, 1], [1, -13, 1], [-4, -9, 1], [4, -9, 1], [0, -14, 2], [-3, -10, 2], [3, -10, 2], [-5, -8, 1], [5, -7, 1]])
  P(x, y, z, (x + z) % 2 ? WHITE : SNOW);
// pressure ridges
function ridge(x1, z1, x2, z2, s) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(z2 - z1));
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x1 + (x2 - x1) * i / n), z = Math.round(z1 + (z2 - z1) * i / n);
    const r = h2(x, z, s);
    P(x, 1, z, r < 0.5 ? SNOW : WHITE);
    if (r < 0.35) P(x, 2, z, SNOW);
    if (r > 0.8) P(x, 2, z, LIGHT_BLUE);
    if (r < 0.2) P(x + 1, 1, z, ICE);
  }
}
ridge(-15, -21, -9, -15, 1);
ridge(6, -22, 12, -20, 2);
ridge(11, -2, 15, 8, 3);
ridge(-15, 2, -11, 12, 4);
// icebergs in the background
function berg(cx, cz, r0, h, s) {
  for (let y = 1; y <= h; y++) {
    const r = r0 * (1 - Math.pow((y - 1) / h, 1.4)) + 0.4;
    for (let x = Math.floor(-r) - 1; x <= r + 1; x++) for (let z = Math.floor(-r) - 1; z <= r + 1; z++) {
      const d = Math.hypot(x, z) + (h2(cx + x, cz + z, s + y) - 0.5) * 1.2;
      if (d <= r) {
        const edge = d > r - 1.2;
        P(cx + x, y, cz + z, y >= h - 2 ? SNOW : (edge ? (h2(x, y * 7 + z, s) < 0.3 ? LIGHT_BLUE : WHITE) : WHITE));
      }
    }
  }
}
berg(13, 17, 3.6, 10, 5);
berg(-13, 19, 2.6, 6, 9);
berg(13, 10, 1.6, 4, 13);
// polar bear watching the ship, with cub
box(12, 2, -17, 16, 3, -15, WHITE);
P(13, 4, -16, WHITE); P(14, 4, -16, WHITE);
for (const [x, z] of [[12, -17], [12, -15], [16, -17], [16, -15]]) P(x, 1, z, WHITE);
box(10, 3, -17, 11, 4, -15, WHITE);
P(9, 3, -16, WHITE); P(8, 3, -16, BLACK);
P(10, 4, -17, BLACK); P(10, 4, -15, BLACK);
P(11, 5, -17, WHITE); P(11, 5, -15, WHITE);
P(17, 3, -16, WHITE);
box(15, 1, -20, 16, 2, -20, WHITE); P(14, 2, -20, WHITE); P(13, 2, -20, BLACK);

// ================= SEA ICE + CHANNEL (priority 2) =================
L = 2;
for (let z = -22; z <= 22; z++) {
  const edge = 8 + Math.floor(h2(0, z, 3) * 3);
  for (let x = -15; x <= 15; x++) {
    if (hw(z, 0) >= Math.abs(x)) continue;
    const r = h2(x, z, 7);
    const broken = z < -9 && z >= -15 && Math.abs(x) <= 3 + (z + 15);
    const channel = z >= -9 && Math.abs(x) < edge;
    if (broken || channel) {
      if (r < (broken ? 0.3 : 0.12)) P(x, 0, z, r < 0.06 ? SNOW : WHITE);
      else P(x, 0, z, WATER);
    } else {
      P(x, 0, z, r < 0.1 ? WHITE : r < 0.2 ? LIGHT_BLUE : SNOW);
    }
  }
}
// cracks radiating from the bow
function crack(x1, z1, x2, z2, s) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(z2 - z1));
  const steep = Math.abs(z2 - z1) > Math.abs(x2 - x1);
  for (let i = 0; i <= n; i++) {
    const j = (h2(i, s, s) - 0.5) * 2;
    const x = Math.round(x1 + (x2 - x1) * i / n + (steep ? j : 0));
    const z = Math.round(z1 + (z2 - z1) * i / n + (steep ? 0 : j));
    if (Math.abs(x) <= 15) P(x, 0, z, WATER);
  }
}
crack(-5, -16, -15, -22, 1);
crack(-3, -17, -6, -22, 2);
crack(4, -17, 9, -22, 3);
crack(8, -13, 15, -17, 4);
crack(-8, -10, -15, -7, 5);
crack(10, -5, 15, -1, 6);

// ================= DEEP WATER UNDERLAYER (priority 3) =================
L = 3;
for (const e of Array.from(M.values())) if (e[1] === 0 && e[3] === WATER) P(e[0], -1, e[2], BLUE);

// ================= FLUSH (priority order, within budget) =================
const all = Array.from(M.values()).sort((a, b) => a[4] - b[4]);
let n = 0;
for (const e of all) {
  if (n >= 3990) break;
  block(e[0], e[1], e[2], e[3]); n++;
}