// viking-winter-fable — prompt:
// a Viking warrior in a snowstorm...

const M = new Map();
let solid = 0;
function P(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (!M.has(k)) solid++;
  M.set(k, id);
}
function I(id, x, y, z) { return typeof id === 'function' ? id(x, y, z) : id; }
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) P(x, y, z, I(id, x, y, z));
}
function ring(x1, y, z1, x2, z2, id) {
  for (let x = x1; x <= x2; x++)
    for (let z = z1; z <= z2; z++)
      if (x === x1 || x === x2 || z === z1 || z === z2) P(x, y, z, I(id, x, y, z));
}
function shell(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++)
    for (let y = y1; y <= y2; y++)
      for (let z = z1; z <= z2; z++)
        if (x === x1 || x === x2 || y === y1 || y === y2 || z === z1 || z === z2) P(x, y, z, I(id, x, y, z));
}
function h(x, y, z) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return n - Math.floor(n);
}
let seed = 90210;
function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }

const mail = (x, y, z) => ((x + y + z) & 1) ? IRON : LIGHT_GRAY;
const fur = (x, y, z) => { const v = h(x, y, z); return v < 0.3 ? LIGHT_GRAY : v < 0.42 ? WHITE : GRAY; };
const rocky = (x, y, z) => h(x, y, z) < 0.3 ? COBBLE : STONE;

// ---------- SNOW FIELD ----------
for (let x = -13; x <= 13; x++)
  for (let z = -13; z <= 13; z++) {
    const r = Math.hypot(x, z);
    if (r <= 12 + (h(x, 0, z) - 0.5)) P(x, 0, z, SNOW);
    if (r >= 10.5 && r <= 12.5 && x >= 5 && z >= 5) P(x, -1, z, SNOW);
    if (r <= 11 && Math.sin(x * 0.5 + 1) * Math.cos(z * 0.45 - 0.5) > 0.72) P(x, 1, z, SNOW);
  }

// ---------- CAPE (billowing toward +X / +Z in the wind) ----------
box(-8, 21, 4, 8, 21, 4, RED);
for (let y = 20; y >= 2; y--) {
  const t = (20 - y) / 18;
  const xa = -8 + Math.round(3 * t), xb = 8 + Math.round(9 * t);
  let pz = null;
  for (let x = xa; x <= xb; x++) {
    const u = (x - xa) / (xb - xa);
    const z = 4 + Math.round(t * (1 + 4 * u) + 1.3 * t * Math.sin(x * 0.6 + y * 0.45));
    if (y === 2 && h(x, y, 7) < 0.4) { pz = z; continue; }
    const id = y <= 3 ? GOLD : RED;
    P(x, y, z, id);
    if (pz !== null && Math.abs(z - pz) > 1)
      for (let zz = Math.min(z, pz) + 1; zz < Math.max(z, pz); zz++) P(x, y, zz, id);
    pz = z;
  }
}

// ---------- LEGS ----------
function leg(x1, zf) {
  box(x1, 1, zf, x1 + 3, 3, zf + 3, OAK_LOG);
  box(x1, 1, zf - 1, x1 + 3, 2, zf - 1, OAK_LOG);
  ring(x1 - 1, 4, zf - 1, x1 + 4, zf + 4, fur);
  box(x1, 4, zf, x1 + 3, 4, zf + 3, OAK_LOG);
  box(x1, 5, zf, x1 + 3, 11, zf + 3, (x, y, z) => (y <= 8 && ((x + y) & 1)) ? PLANKS : BROWN);
  box(x1 + 1, 8, zf - 1, x1 + 2, 9, zf - 1, IRON);
}
leg(-5, -2);
leg(2, -3);

// ---------- TUNIC SKIRT + BELT ----------
ring(-6, 10, -4, 6, 2, YELLOW);
ring(-6, 11, -4, 6, 2, BLUE);
ring(-6, 12, -4, 6, 2, BROWN);
box(-5, 12, -3, 5, 12, 1, BROWN);
box(-1, 11, -5, 1, 13, -5, GOLD);
P(0, 12, -5, BROWN);
// pouch + seax knife on belt
box(-5, 9, -5, -4, 11, -5, OAK_LOG);
P(-4, 11, -5, GOLD);
box(4, 8, -5, 4, 11, -5, GRAY);
P(4, 12, -5, GOLD);

// ---------- TORSO (chainmail) ----------
for (let y = 13; y <= 21; y++) {
  if (y >= 17) ring(-7, y, -3, 7, 2, mail);
  else ring(-6, y, -3, 6, 2, mail);
}
box(-6, 17, -2, 6, 17, 1, mail);
// baldric strap across chest
for (let i = 0; i <= 8; i++) {
  const sx = 5 - Math.round(i * 10 / 8);
  P(sx, 21 - i, -3, BROWN); P(sx + 1, 21 - i, -3, BROWN);
}
P(1, 17, -4, GOLD);

// ---------- FUR MANTLE ----------
ring(-10, 21, -4, 10, 3, fur);
box(-10, 22, -4, 10, 22, 3, fur);
for (let x = -10; x <= 10; x++)
  for (let z = -4; z <= 3; z++) {
    const edge = x === -10 || x === 10 || z === -4 || z === 3;
    if (edge && h(x, 20, z) > 0.5 && Math.abs(x) > 3) P(x, 20, z, fur(x, 20, z));
    if (Math.abs(x) >= 5 && Math.abs(x) <= 9 && h(x, 23, z) > 0.55) P(x, 23, z, h(x, 5, z) > 0.5 ? SNOW : fur(x, 23, z));
  }
// cloak brooches
P(-6, 21, -5, GOLD); P(6, 21, -5, GOLD);

// ---------- LEFT ARM (+X) holding shield ----------
box(8, 14, -2, 10, 20, 1, (x, y, z) => y >= 17 ? mail(x, y, z) : SAND);
box(8, 16, -2, 10, 16, 1, GOLD);
box(8, 13, -6, 10, 15, -3, (x, y, z) => (z === -5 || z === -4) ? BROWN : SAND);

// ---------- ROUND SHIELD ----------
(function () {
  const cx = 10, cy = 14;
  for (let dx = -6; dx <= 6; dx++)
    for (let dy = -6; dy <= 6; dy++) {
      const r = Math.hypot(dx, dy);
      if (r > 6.3) continue;
      let id;
      if (r > 5.2) id = IRON;
      else if (r <= 1.6) id = GOLD;
      else id = ((dx >= 0) !== (dy >= 0)) ? YELLOW : BLUE;
      P(cx + dx, cy + dy, -8, id);
      if (r <= 5) P(cx + dx, cy + dy, -7, PLANKS);
    }
  P(cx, cy, -9, GOLD);
  for (let a = 0; a < 8; a++) {
    const ang = a * Math.PI / 4 + Math.PI / 8;
    P(cx + Math.round(4.2 * Math.cos(ang)), cy + Math.round(4.2 * Math.sin(ang)), -9, IRON);
  }
  box(cx - 1, cy + 7, -8, cx + 1, cy + 7, -7, SNOW);
  P(cx - 3, cy + 6, -8, SNOW); P(cx + 3, cy + 6, -8, SNOW);
  // arrows stuck in the shield
  line(cx + 3, cy + 2, -9, cx + 4, cy + 3, -12, PLANKS);
  P(cx + 4, cy + 3, -12, RED);
  P(cx + 3, cy + 2, -9, PLANKS); P(cx + 3, cy + 2, -10, PLANKS); P(cx + 4, cy + 3, -11, PLANKS);
  P(cx - 3, cy - 3, -9, PLANKS); P(cx - 3, cy - 3, -10, PLANKS); P(cx - 4, cy - 2, -11, PLANKS); P(cx - 4, cy - 2, -12, RED);
})();

// ---------- RIGHT ARM (-X) raised with axe ----------
box(-11, 19, -2, -8, 21, 0, mail);
box(-13, 19, -3, -11, 21, -1, mail);
box(-13, 22, -3, -11, 22, -1, SAND);
box(-13, 23, -4, -11, 24, -2, (x, y, z) => (x === -12 && z === -4) ? GOLD : BROWN);
box(-13, 25, -6, -11, 27, -4, SAND);
// haft
box(-12, 17, -5, -12, 33, -5, OAK_LOG);
P(-12, 17, -5, IRON); P(-12, 22, -5, COPPER); P(-12, 29, -5, COPPER);
// bearded axe head
const blade = [[-13, 30, 32], [-14, 30, 32], [-15, 29, 33], [-16, 28, 33], [-17, 27, 33], [-18, 28, 32]];
for (const [bx, y1, y2] of blade) box(bx, y1, -5, bx, y2, -5, bx === -13 ? GRAY : IRON);
box(-11, 30, -5, -11, 32, -5, GRAY);
P(-15, 31, -5, NEON_BLUE); P(-16, 30, -5, NEON_BLUE); P(-16, 32, -5, NEON_BLUE);
P(-17, 26, -5, ICE); P(-18, 27, -5, ICE);

// ---------- HEAD ----------
shell(-3, 22, -4, 3, 28, 2, (x, y, z) => (z >= 1 || (Math.abs(x) === 3 && z >= -1)) ? ORANGE : SAND);
box(-3, 21, 3, 3, 25, 3, ORANGE);
box(-2, 19, 4, 2, 22, 4, ORANGE);
// face
P(-2, 25, -4, NEON_BLUE); P(2, 25, -4, NEON_BLUE);
P(-3, 24, -4, ORANGE); P(3, 24, -4, ORANGE);
box(0, 24, -5, 0, 26, -5, IRON);
// beard + moustache
box(-3, 22, -5, 3, 23, -5, ORANGE);
box(-3, 20, -5, 3, 21, -4, ORANGE);
box(-2, 18, -5, 2, 19, -4, ORANGE);
box(-1, 17, -5, 1, 17, -4, ORANGE);
for (const s of [-1, 1]) {
  P(s, 16, -5, GOLD); P(s, 16, -4, GOLD);
  P(s, 15, -5, ORANGE); P(s, 14, -5, ORANGE);
  // side braids
  box(s * 5, 18, -5, s * 5, 22, -5, ORANGE);
  P(s * 5, 17, -5, GOLD); P(s * 5, 16, -5, ORANGE);
  // cheek guards
  box(s * 4, 23, -4, s * 4, 25, -2, IRON);
}
// frost in the beard
P(-2, 19, -6, SNOW); P(2, 21, -6, SNOW); P(0, 18, -6, SNOW);

// ---------- HELMET ----------
for (let y = 26; y <= 28; y++) ring(-4, y, -5, 4, 3, y === 26 ? GOLD : IRON);
P(-2, 27, -5, GOLD); P(2, 27, -5, GOLD);
const domeR = { 29: 4.6, 30: 3.5, 31: 2.2 };
for (let y = 29; y <= 31; y++)
  for (let x = -4; x <= 4; x++)
    for (let z = -5; z <= 3; z++)
      if (Math.hypot(x, z + 1) <= domeR[y]) P(x, y, z, x === 0 ? GOLD : IRON);
P(0, 32, -1, GOLD);
P(3, 31, -1, SNOW); P(-3, 31, 0, SNOW); P(-1, 31, 2, SNOW); P(2, 30, 2, SNOW); P(-3, 30, -3, SNOW);
// horns
for (const s of [-1, 1]) {
  box(s * 5, 27, -2, s * 5, 28, -1, GOLD);
  box(s * 6, 27, -2, s * 6, 28, -1, MARBLE);
  box(s * 7, 28, -2, s * 7, 29, -1, MARBLE);
  box(s * 8, 29, -2, s * 8, 30, -1, MARBLE);
  box(s * 9, 30, -1, s * 9, 32, -1, MARBLE);
  P(s * 8, 33, -1, MARBLE);
}

// ---------- RUNE STONE (behind, -X side) ----------
box(-12, 1, 6, -9, 9, 7, rocky);
box(-11, 10, 6, -10, 10, 7, STONE);
for (let y = 3; y <= 8; y++) P((y & 1) ? -11 : -10, y, 6, NEON_BLUE);
P(-12, 10, 6, SNOW); P(-12, 10, 7, SNOW); P(-9, 10, 6, SNOW); P(-9, 10, 7, SNOW);
box(-11, 11, 6, -10, 11, 7, SNOW);
box(-13, 1, 5, -8, 1, 5, SNOW);

// ---------- ROCKS ----------
function rock(cx, cz, r) {
  for (let x = -3; x <= 3; x++)
    for (let y = 0; y <= 3; y++)
      for (let z = -3; z <= 3; z++) {
        const d = Math.hypot(x, y * 1.3, z);
        if (d <= r) P(cx + x, 1 + y, cz + z, (d > r - 1.1 && y >= 1 && h(cx + x, y, cz + z) > 0.35) || Math.hypot(x, (y + 1) * 1.3, z) > r ? SNOW : rocky(cx + x, y, cz + z));
      }
}
rock(8, -11, 2.4);
rock(-4, -12, 1.7);
rock(13, -3, 2.3);
rock(-12, -5, 1.9);

// ---------- CAMPFIRE (front, -X side) ----------
P(-9, 1, -10, OAK_LOG); P(-7, 1, -10, OAK_LOG); P(-8, 1, -11, OAK_LOG); P(-8, 1, -9, OAK_LOG);
P(-9, 1, -11, COBBLE); P(-7, 1, -11, COBBLE); P(-9, 1, -9, COBBLE); P(-7, 1, -9, COBBLE);
P(-8, 1, -10, LAVA);
P(-8, 2, -10, FIRE);
P(-8, 3, -10, FIRE);

// ---------- SWORD PLANTED IN THE SNOW ----------
box(3, 1, -11, 3, 5, -11, IRON);
box(2, 6, -11, 4, 6, -11, GOLD);
P(3, 7, -11, BROWN); P(3, 8, -11, GOLD);

// ---------- ICE SPIKES ----------
const spikes = [[12, -11, 5], [13, -10, 3], [11, -10, 2], [13, -8, 4], [-13, 0, 6], [-14, 1, 4], [-12, -1, 3], [-13, 2, 2], [6, 11, 5], [7, 12, 3], [-3, 12, 4], [-4, 11, 2]];
for (const [sx, sz, sh] of spikes) box(sx, 1, sz, sx, sh, sz, ICE);

// ---------- SNOWSTORM (wind-driven flakes + streaks, blowing toward +X) ----------
const CAP = 3940;
for (let i = 0; i < 900 && solid < CAP; i++) {
  const x = Math.floor(rnd() * 45) - 22;
  const y = Math.floor(rnd() * 32) + 2;
  const z = Math.floor(rnd() * 45) - 22;
  const a = rnd(), b = rnd(), c = rnd();
  if (Math.abs(x) <= 13 && z <= -4 && z >= -14 && y >= 8) continue; // keep the warrior's front readable
  if (z < -14 && Math.abs(x) <= 12 && a > 0.3) continue;
  if (Math.abs(x) <= 12 && z >= -4 && z <= 11 && y <= 33 && a > 0.45) continue;
  if (M.has(x + ',' + y + ',' + z)) continue;
  const id = b < 0.15 ? ICE : (b < 0.55 ? SNOW : WHITE);
  P(x, y, z, id);
  if (c < 0.3 && solid < CAP) {
    if (!M.has((x + 1) + ',' + y + ',' + z)) P(x + 1, y, z, id);
    if (c < 0.12 && y > 2 && !M.has((x + 2) + ',' + (y - 1) + ',' + z)) P(x + 2, y - 1, z, id);
  }
}

// ---------- EMIT SOLIDS ----------
for (const [k, id] of M) {
  const p = k.split(',');
  block(+p[0], +p[1], +p[2], id);
}

// ---------- CLEAR TREES AROUND THE WARRIOR (AIR is free; skips our own blocks) ----------
for (let x = -14; x <= 14; x++)
  for (let z = -14; z <= 14; z++) {
    if (Math.hypot(x, z) > 14.5) continue;
    for (let y = 1; y <= 8; y++)
      if (!M.has(x + ',' + y + ',' + z)) block(x, y, z, AIR);
  }
for (let x = -10; x <= 10; x++)
  for (let z = -22; z <= -15; z++)
    for (let y = 2; y <= 8; y++)
      if (!M.has(x + ',' + y + ',' + z)) block(x, y, z, AIR);