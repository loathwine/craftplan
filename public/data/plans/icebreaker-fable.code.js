// icebreaker-fable — prompt:
// a red icebreaker ship smashing through sea ice...

const S = Math.SQRT1_2, CX = -2, CZ = 2, W = 5.25;
const M = new Map();
let PRI = 1;
const K = (x, y, z) => (x + 32) + (z + 32) * 64 + (y + 16) * 4096;
const SEE = new Set([ICE, WATER, GLASS, AIR, STEAM]);
function put(x, y, z, id, tag) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (Math.abs(x) > 22 || Math.abs(z) > 22 || y < -8 || y > 33) return;
  M.set(K(x, y, z), { x: x, y: y, z: z, id: id, tag: tag || '', pri: PRI });
}
const get = (x, y, z) => M.get(K(x, y, z));
const rnd = (x, z, s) => { const v = Math.sin(x * 127.1 + z * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
// ship-local frame: u along the keel (bow = +u, heading north-east), v across the beam
const U = (x, z) => ((x - CX) - (z - CZ)) * S;
const V = (x, z) => ((x - CX) + (z - CZ)) * S;
const PX = (u, v) => CX + (u + v) * S, PZ = (u, v) => CZ + (v - u) * S;
const P = (u, v, y, id) => put(PX(u, v), y, PZ(u, v), id);

// ---------- hull shape ----------
const tipAt = y => 20 - Math.max(0, 7 - y) * 1.1;          // raked icebreaking stem
const aftAt = y => -18 + Math.max(0, 4 - y) * 0.6;         // stern counter
function halfW(u, y) {
  const tip = tipAt(y), aft = aftAt(y);
  if (u > tip || u < aft) return -1;
  let w = W;
  if (u > 5) w = W * (1 - Math.pow((u - 5) / (tip - 5), 1.9));
  else if (u < -12) { const t = (-12 - u) / (-12 - aft); w = W * Math.sqrt(1 - 0.75 * t * t); }
  if (y <= 0) w -= 0.7;
  return Math.max(w, 0.45);
}
const deckY = u => (u >= 7 ? 7 : 5);
function hullId(u, v, y, A) {
  const av = Math.abs(v), w = halfW(u, y);
  if (w < 0 || av > w) return 0;
  const dk = deckY(u);
  if (y > dk + 1) return 0;
  const rim = (w - av < 0.75) || u > tipAt(y) - 0.9 || u < aftAt(y) + 0.8;
  const s = u - 0.5 * y;
  const stripe = (s >= 8.2 && s < 10.3) || (s >= 11.2 && s < 12.65);
  if (y === dk + 1) return (u >= 7 && rim) ? (stripe ? WHITE : RED) : 0;   // forecastle bulwark
  if (y <= 0) return BLACK;                                                 // boot topping
  if (y === dk && !rim) {
    if (u < -7.5) {                                                         // helipad
      const hr = Math.hypot(u + 12.3, v);
      if (hr >= 3.2 && hr < 4.3) return YELLOW;
      if (hr < 4.3) return GREEN;
    }
    return GRAY;
  }
  if (stripe) return WHITE;                                                 // diagonal hull stripes
  if (rim && (y === 4 || y === 5) && u > 8.7 && u < 10.15) return BLACK;    // anchor pocket
  if (y === 3 && u > -11 && u < 4.5 && (Math.floor((A + 200) / 2) % 3 === 0)) return GLOWSTONE; // lit portholes
  return RED;
}
function ssId(u, v, y, A, B) {
  const av = Math.abs(v);
  const ia = Math.floor((A + 200) / 2), ib = Math.floor((B + 200) / 2);
  // funnel
  if (y >= 12 && y <= 17 && u >= -4.3 && u <= -0.7 && av <= 1.75) return y >= 16 ? BLACK : (y === 14 ? RED : YELLOW);
  // bridge with overhanging wings, wrap-around windows
  if (y >= 12 && y <= 14 && u >= 2 && u <= 7.3 && av <= 5.9) return y === 13 ? BLACK : WHITE;
  // deckhouse between bridge and funnel
  if (y >= 12 && y <= 13 && u >= -0.7 && u < 2 && av <= 2.5) return (y === 13 && ib % 2 === 0) ? BLACK : WHITE;
  // level 2
  if (y >= 9 && y <= 11 && u >= -5 && u <= 6.4 && av <= 3.8) {
    const side = av > 3.05, inner = !side && u > -4.25 && u < 5.65;
    if (y === 11 && inner) return LIGHT_GRAY;
    if (y === 10 && (side ? (ia % 3 !== 0) : (ib % 3 !== 0))) return BLACK;
    return WHITE;
  }
  // lifeboats on the boat deck
  if (y === 9 && u >= -4.6 && u <= -0.2 && av > 3.8 && av <= 5.3) return ORANGE;
  if (y === 10 && u >= -3.9 && u <= -0.9 && av > 3.8 && av <= 4.6) return ORANGE;
  // level 1 (full beam)
  if (y >= 6 && y <= 8 && u >= -7 && u <= 6.4 && av <= W) {
    const side = av > W - 0.75, inner = !side && u > -6.25 && u < 5.65;
    if (y === 8 && inner) return LIGHT_GRAY;
    if (y === 7 && (side ? (ia % 2 === 0) : (ib % 2 === 0))) return BLACK;
    return WHITE;
  }
  return 0;
}

// ---------- ice field ----------
function inField(x, z) {
  if (Math.abs(x) > 22 || Math.abs(z) > 22) return false;
  if (z <= 3) return true;
  const n = Math.pow(Math.abs(x) / 21, 3) + Math.pow(Math.abs(z) / 21, 3);
  return n <= 1 + 0.07 * Math.sin(x * 0.8 + z * 0.5);
}
function isWater(x, z) {
  if (!inField(x, z)) return false;
  const u = U(x, z), av = Math.abs(V(x, z));
  const t0 = tipAt(0), a0 = aftAt(0);
  if (u < a0) return av <= 5.6 + 0.8 * Math.sin(u * 0.9) + (rnd(x, z, 9) < 0.3 ? 0.7 : 0);   // wake channel
  if (u <= t0) return av <= halfW(u, 0) + 1.7 + (rnd(x, z, 9) < 0.25 ? 0.7 : 0);            // lead along the hull
  if (u <= t0 + 4.5) return av <= 3.4 - (u - t0) * 0.6;                                      // crushed zone at the stem
  return false;
}
const underHull = (x, z) => { const w = halfW(U(x, z), -1); return w >= 0 && Math.abs(V(x, z)) <= w; };

for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  if (!inField(x, z) || underHull(x, z)) continue;
  const u = U(x, z);
  PRI = 1;
  if (isWater(x, z)) {
    put(x, -2, z, BLUE);
    const r = rnd(x, z, 1), aft = u < aftAt(0);
    if (r < (aft ? 0.30 : 0.16)) {                              // drifting floes
      put(x, -1, z, (Math.floor(r * 100) % 2) ? SNOW : ICE);
      put(x, 0, z, r < 0.07 ? ICE : AIR);
    } else { put(x, -1, z, WATER); put(x, 0, z, AIR); }
    continue;
  }
  put(x, 0, z, SNOW);
  const nearW = isWater(x + 1, z) || isWater(x - 1, z) || isWater(x, z + 1) || isWater(x, z - 1);
  const edge = !inField(x + 1, z) || !inField(x - 1, z) || !inField(x, z + 1) || !inField(x, z - 1);
  PRI = 2;
  if (nearW) {                                                  // rubble piled on the channel edge
    const r = rnd(x, z, 2);
    if (r < 0.34) put(x, 1, z, ICE); else if (r < 0.5) put(x, 1, z, SNOW);
  } else if (edge && x > 2 && z > 2) put(x, -1, z, SNOW);       // skirt where terrain drops away
  else if (rnd(x, z, 3) < 0.022) put(x, 1, z, SNOW);            // snow drifts
}

// ---------- cracks racing out from the bow ----------
function crack(u0, v0, deg, len, wob) {
  const a = deg * Math.PI / 180;
  for (let i = 0; i <= len; i += 0.5) {
    const k = Math.sin(i * 0.9 + deg) * wob;
    const u = u0 + Math.cos(a) * i - Math.sin(a) * k, v = v0 + Math.sin(a) * i + Math.cos(a) * k;
    const x = Math.round(PX(u, v)), z = Math.round(PZ(u, v));
    if (!inField(x, z) || underHull(x, z)) continue;
    const c = get(x, 0, z);
    if (!c || c.id !== SNOW) continue;
    put(x, 0, z, WATER); put(x, -1, z, BLUE);
    if (get(x, 1, z)) M.delete(K(x, 1, z));
  }
}
PRI = 1;
crack(15.5, 0, -6, 13, 0.8);
crack(15, -1.5, -42, 12, 0.9);
crack(15, 1.5, 38, 11, 0.9);
crack(13, -3, -78, 10, 0.7);
crack(13, 3, 74, 9, 0.7);
crack(4, -6.8, -95, 6, 0.8);
crack(-7, -6.8, -72, 7, 0.7);
crack(0, 6.8, 100, 6, 0.8);

// ---------- upthrust ice slabs around the bow ----------
PRI = 2;
function slab(u0, v0, du, dv, len, ht, ou, ov, rise) {
  for (let s = 0; s <= len; s += 0.5) for (let t = 0; t <= ht; t += 0.5) {
    const u = u0 + du * s + ou * t, v = v0 + dv * s + ov * t;
    const y = 1 + rise * t - Math.abs(s - len / 2) * 0.35;
    if (y < 0.5) continue;
    P(u, v, y, t > ht - 0.9 ? SNOW : ICE);
  }
}
slab(9.5, -4.6, 1, 0.45, 4.5, 3.6, 0, -0.5, 0.9);
slab(14.5, -2.6, 0.8, 0.5, 3.5, 3.2, 0.3, -0.5, 0.95);
slab(17.2, -1.6, 0, 1, 3.2, 3.4, 0.55, 0, 0.9);
slab(9.5, 4.6, 1, -0.45, 4, 3.0, 0, 0.5, 0.9);
slab(14.5, 2.8, 0.8, -0.5, 3, 2.6, 0.3, 0.5, 0.95);
slab(5, -6.4, 1, 0, 3, 2.0, 0, -0.6, 0.8);
slab(4.5, 6.4, 1, 0, 2.5, 1.8, 0, 0.6, 0.8);
// loose broken blocks scattered near the bow
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const u = U(x, z), av = Math.abs(V(x, z));
  if (u < 7 || u > 21 || av > 8.5 || !inField(x, z)) continue;
  const c = get(x, 0, z);
  if (!c || c.id !== SNOW || get(x, 1, z)) continue;
  const r = rnd(x, z, 5);
  if (r < 0.2) put(x, 1, z, ICE); else if (r < 0.3) put(x, 1, z, SNOW);
}

// ---------- pressure ridge + hummocks ----------
for (let i = 0; i <= 14; i++) {
  const x = Math.round(-21 + i * 0.8), z = Math.round(-9 - i * 0.6 + Math.sin(i * 0.8) * 1.2);
  if (!inField(x, z)) continue;
  const h = 1 + (rnd(x, z, 6) < 0.45 ? 1 : 0);
  for (let y = 1; y <= h; y++) put(x, y, z, (y === h && h > 1) ? ICE : SNOW);
  if (rnd(x, z, 7) < 0.5 && inField(x + 1, z)) put(x + 1, 1, z, ICE);
}
function berg(cx, cz, r, h, s) {
  for (let x = Math.floor(cx - r); x <= cx + r; x++) for (let z = Math.floor(cz - r); z <= cz + r; z++) {
    if (!inField(x, z)) continue;
    const d = Math.hypot(x - cx, (z - cz) * 1.15) / r;
    if (d > 1) continue;
    const top = Math.round(h * (1 - Math.pow(d, 1.4)) + rnd(x, z, s) * 1.3);
    for (let y = 1; y <= top; y++) put(x, y, z, y === top ? SNOW : (d < 0.45 ? SNOW : ICE));
  }
}
berg(-18, -17, 2.6, 3, 13);
berg(15, 9, 3.4, 4.5, 11);
berg(19, 2, 2, 2.2, 12);

// ---------- the ship (inverse-mapped so the diagonal hull has no holes) ----------
PRI = 0;
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const u = U(x, z), v = V(x, z);
  if (u < -19 || u > 21 || Math.abs(v) > 6.2) continue;
  const A = (x - z) - (CX - CZ), B = (x + z) - (CX + CZ);
  for (let y = -1; y <= 17; y++) {
    let id = ssId(u, v, y, A, B), tag = 'ss';
    if (!id) { id = hullId(u, v, y, A); tag = 'hull'; }
    if (id) put(x, y, z, id, tag);
  }
}

// ---------- deck gear ----------
// main radar mast on the bridge roof
for (let y = 15; y <= 21; y++) put(1, y, -1, IRON);
for (let x = -1; x <= 3; x++) put(x, 19, -1, IRON);
for (let x = 0; x <= 2; x++) put(x, 17, -1, IRON);
put(1, 17, -2, IRON); put(1, 17, 0, IRON);
put(-1, 20, -1, IRON); put(3, 20, -1, IRON);
put(1, 22, -1, NEON_RED);
// radome + small sat dome
for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++)
  if (dx * dx + dy * dy + dz * dz <= 2) put(-1 + dx, 16 + dy, -4 + dz, WHITE);
put(3, 15, 1, WHITE); put(3, 16, 1, WHITE); put(4, 15, 2, IRON);
// searchlights + port/starboard nav lights
put(0, 15, -6, GLOWSTONE); put(6, 15, 0, GLOWSTONE);
put(-2, 15, -6, NEON_RED); put(6, 15, 2, LIME);
// funnel exhaust
put(-4, 18, 4, STEAM); put(-3, 18, 3, STEAM);
// foremast
for (let y = 8; y <= 13; y++) put(6, y, -6, IRON);
put(5, 12, -6, IRON); put(7, 12, -6, IRON); put(6, 14, -6, GLOWSTONE);
// windlass, deck cargo, jackstaff
put(7, 8, -8, IRON); put(8, 8, -7, IRON); put(8, 8, -9, GRAY); put(9, 8, -8, GRAY);
put(3, 8, -5, BLUE); put(4, 8, -5, BLUE); put(3, 9, -5, BLUE); put(4, 9, -5, BLUE);
put(5, 8, -3, GREEN); put(5, 8, -2, GREEN); put(4, 8, -2, ORANGE);
for (let y = 8; y <= 10; y++) put(11, y, -11, IRON);
// crane swung out over the ice, lowering a crate
for (let y = 9; y <= 13; y++) put(-8, y, 4, YELLOW);
for (let x = -15; x <= -7; x++) put(x, 13, 4, YELLOW);
put(-9, 14, 4, YELLOW); put(-8, 14, 4, YELLOW);
for (let y = 5; y <= 12; y++) put(-15, y, 4, IRON);
for (let x = -16; x <= -15; x++) for (let z = 4; z <= 5; z++) for (let y = 3; y <= 4; y++) put(x, y, z, PLANKS);
// helicopter on the pad
for (let x = -11; x <= -10; x++) for (let z = 10; z <= 11; z++) for (let y = 6; y <= 7; y++) put(x, y, z, BLUE);
put(-10, 7, 10, BLACK); put(-10, 7, 11, BLACK);
put(-12, 7, 11, BLUE); put(-13, 7, 11, BLUE); put(-14, 7, 11, BLUE); put(-14, 8, 11, NEON_RED);
put(-11, 8, 10, IRON);
for (let x = -14; x <= -8; x++) put(x, 9, 10, IRON);
for (let z = 7; z <= 13; z++) put(-11, 9, z, IRON);
// ice spray where the stem bites
P(13.5, -4.6, 3, STEAM); P(13.5, 4.6, 3, STEAM); P(18.5, 0, 3, STEAM); P(16.5, -3.4, 4, STEAM);

// ---------- penguins watching the show ----------
function penguin(x, z, dx, dz) {
  put(x, 0, z, SNOW); put(x + dx, 0, z + dz, SNOW);
  put(x, 1, z, BLACK); put(x, 2, z, BLACK);
  put(x + dx, 1, z + dz, WHITE); put(x + dx, 2, z + dz, ORANGE);
}
penguin(-10, -7, 1, 0); penguin(-12, -9, 1, 0); penguin(-8, -11, 0, -1);
penguin(-13, -5, 1, 0); penguin(-6, -14, 1, 0); penguin(-9, -14, 0, -1);
penguin(19, -4, 0, -1);

// ---------- emit: skip fully enclosed cells, ship first, then ice, then extras, then AIR ----------
const solid = (x, y, z) => { const c = get(x, y, z); return !!c && !SEE.has(c.id); };
const cells = Array.from(M.values());
let count = 0;
for (let p = 0; p <= 2; p++) for (const c of cells) {
  if (c.pri !== p || c.id === AIR) continue;
  const x = c.x, y = c.y, z = c.z;
  if (!SEE.has(c.id) &&
      solid(x + 1, y, z) && solid(x - 1, y, z) && solid(x, y, z + 1) && solid(x, y, z - 1) &&
      solid(x, y + 1, z) && (solid(x, y - 1, z) || (c.tag === 'hull' && y === -1))) continue;
  if (count >= 3990) continue;
  block(x, y, z, c.id); count++;
}
for (const c of cells) if (c.id === AIR) block(c.x, c.y, c.z, AIR);
// clear the forest standing on the ice sheet
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  if (!inField(x, z)) continue;
  for (let y = 1; y <= 8; y++) if (!get(x, y, z)) block(x, y, z, AIR);
}