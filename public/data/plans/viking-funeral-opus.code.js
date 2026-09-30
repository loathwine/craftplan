// viking-funeral-opus — prompt:
// a burning Viking funeral ship...

// ===== A burning Viking funeral ship on a still fjord at night =====
const L = 17;
function gunY(x) { return 3 + Math.round(3 * Math.pow(Math.abs(x) / L, 2.5)); }
function keelY(x) { return -2 + Math.round(2 * Math.pow(Math.abs(x) / L, 3)); }
function beam(x) { return 4.6 * Math.sqrt(Math.max(0, 1 - (x / 18.2) * (x / 18.2))); }
function inHull(x, y, z) {
  if (x < -L || x > L) return false;
  const k = keelY(x), g = gunY(x);
  if (y < k || y > g) return false;
  const f = Math.pow((y - k + 1) / (g - k + 1), 0.55);
  return Math.abs(z) <= beam(x) * f;
}
function isShell(x, y, z) {
  return inHull(x, y, z) && (!inHull(x + 1, y, z) || !inHull(x - 1, y, z) ||
    !inHull(x, y, z + 1) || !inHull(x, y, z - 1) || !inHull(x, y - 1, z));
}
function H(x, y, z) {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1103515245);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}

// ===== clear trees from the shore / sightline (forest stays as backdrop) =====
cube(-22, 1, -22, 22, 12, 9, AIR);
cube(-13, 1, 10, -3, 8, 11, AIR);
cube(-5, 1, 10, 1, 8, 10, AIR);
cube(15, 1, 10, 21, 8, 11, AIR);

// ===== fjord pool + beach =====
const RX = 21.5, RZ = 9.8;
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const s = Math.sqrt((x / RX) * (x / RX) + (z / RZ) * (z / RZ));
  const h = H(x, 11, z);
  if (s <= 1) {
    block(x, 0, z, AIR);
    if (!inHull(x, -1, z)) {
      block(x, -2, z, s > 0.86 ? SAND : (h < 0.15 ? COBBLE : DIRT));
      block(x, -1, z, WATER);
    }
  } else if (z <= 9 && s <= (z < 0 ? 1.35 : 1.12)) {
    block(x, 0, z, AIR);
    block(x, -1, z, SAND);
    if (s < 1.08 && h < 0.2) {
      block(x, 0, z, h < 0.1 ? GREEN : LIME);
      if (h < 0.05) block(x, 1, z, LIME);
    } else if (s > 1.12 && h > 0.965) {
      block(x, 0, z, h > 0.985 ? STONE : COBBLE);
    }
  }
}

// ===== clinker-built hull =====
for (let x = -L; x <= L; x++) {
  const k = keelY(x), g = gunY(x);
  for (let y = k; y <= g; y++) for (let z = -5; z <= 5; z++) {
    if (!inHull(x, y, z)) continue;
    const hh = H(x, y, z);
    if (isShell(x, y, z)) {
      let c;
      if (y === g) c = Math.abs(x) >= 15 ? GOLD : OAK_LOG;
      else if (y <= -1) c = BLACK;
      else c = ((y - k) % 2 === 0) ? BROWN : OAK_LOG;
      if (x < -9 && y < g && hh < 0.35) c = BLACK;
      else if (x >= -11 && x <= 0 && y >= g - 1 && hh < 0.15) c = BLACK;
      if (x <= -12 && x >= -16 && y >= 1 && y < g && hh > 0.94) c = LAVA;
      block(x, y, z, c);
    } else if (y === 0) {
      block(x, 0, z, (x < -10 && hh < 0.3) ? BLACK : PLANKS);
    }
  }
}

// ===== shield row along the north gunwale =====
const shieldCols = [[RED, WHITE], [YELLOW, BLACK], [BLUE, WHITE], [WHITE, RED], [GREEN, YELLOW]];
let si = 0;
for (let sx = -13; sx <= 14; sx += 3) {
  const g = gunY(sx), zz = -Math.floor(beam(sx)) - 1;
  const [a, b] = shieldCols[si++ % shieldCols.length];
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
    let c = (dx === 0 && dy === 0) ? IRON : ((dx !== 0 && dy !== 0) ? b : a);
    if (sx <= -7 && H(sx + dx, g + dy, zz) < (sx <= -10 ? 0.55 : 0.25)) c = BLACK;
    block(sx + dx, g + dy, zz, c);
  }
}

// ===== funeral pyre (log crib with glowing embers) =====
for (let y = 1; y <= 5; y++) for (let x = -11; x <= -1; x++) for (let z = -2; z <= 2; z++) {
  if (isShell(x, y, z)) continue;
  const alongX = (y % 2 === 1);
  const log = alongX ? (z % 2 === 0) : ((x + 11) % 2 === 0);
  const h = H(x, y, z + 40);
  let c;
  if (log) c = h < 0.22 ? BLACK : OAK_LOG;
  else c = h < 0.4 ? LAVA : h < 0.6 ? ORANGE : h < 0.8 ? BLACK : RED;
  block(x, y, z, c);
}
cube(-10, 6, -1, -2, 6, 1, PLANKS);
cube(-9, 7, -1, -2, 7, 1, BROWN);
block(-9, 7, -1, WHITE); block(-2, 7, -1, WHITE); block(-9, 7, 1, WHITE); block(-2, 7, 1, WHITE);

// the fallen chieftain
block(-9, 8, 0, BLACK);
cube(-8, 8, 0, -7, 8, 0, BLUE);
cube(-6, 8, 0, -4, 8, 0, RED);
cube(-6, 8, -1, -5, 8, -1, RED); cube(-6, 8, 1, -5, 8, 1, RED);
block(-4, 8, -1, SAND); block(-4, 8, 1, SAND);
block(-3, 8, 0, SAND);
block(-2, 8, 0, IRON);
block(-3, 9, 0, ORANGE);
// sword laid on his chest
cube(-9, 9, 0, -6, 9, 0, IRON);
cube(-5, 9, -1, -5, 9, 1, GOLD);
block(-4, 9, 0, BROWN);

// ===== mast, yard, pennant =====
cube(2, 0, 0, 2, 23, 0, OAK_LOG);
block(2, 24, 0, GOLD);
cube(-6, 21, -1, 10, 21, -1, OAK_LOG);
cube(3, 23, 0, 6, 23, 0, RED); block(7, 23, 0, YELLOW);
cube(3, 22, 0, 4, 22, 0, RED); block(5, 22, 0, YELLOW);

// ===== striped sail, billowing and burning from the lower corner =====
function sb(x, y) {
  if (x < -5 || x > 9 || y < 10 || y > 20) return 0;
  return Math.round(1.6 * Math.sin(Math.PI * (x + 6) / 16) * Math.sin(Math.PI * (y - 9) / 12));
}
let sailFire = 0;
for (let x = -5; x <= 9; x++) for (let y = 10; y <= 20; y++) {
  const b = sb(x, y), z0 = -1 - b;
  const bmin = Math.min(sb(x + 1, y), sb(x - 1, y), sb(x, y + 1), sb(x, y - 1));
  const zEnd = Math.max(z0, -1 - bmin);
  const dx = x + 6, dy = y - 9, d = Math.sqrt(dx * dx + dy * dy), ang = Math.atan2(dy, dx);
  const r1 = 5.4 + 1.1 * Math.sin(ang * 5 + 1.3) + 0.8 * H(x, y, 7);
  const da = Math.hypot(x - 6, y - 16);
  if (d < r1 || da < 0.5) {
    if (da >= 0.5 && d >= r1 - 1.4 && sailFire < 5 && H(x, y, 3) < 0.55) { block(x, y, z0, FIRE); sailFire++; }
    continue;
  }
  let c = (Math.floor((x + 5) / 3) % 2 === 0) ? RED : WHITE;
  if (d < r1 + 0.9) c = LAVA;
  else if (d < r1 + 1.9 || da < 1.6) c = BLACK;
  else if (d < r1 + 2.8 && H(x, y, 5) < 0.6) c = BROWN;
  for (let z = z0; z <= zEnd; z++) block(x, y, z, c);
}
// flaming arrow that struck the sail
block(6, 16, -1 - sb(6, 16), FIRE);
block(5, 15, -3, BROWN); block(3, 14, -4, BROWN); block(2, 13, -5, WHITE);

// ===== rigging =====
line(2, 22, 0, 16, 7, 0, BROWN);
line(2, 22, 0, -16, 7, 0, BROWN);
line(2, 20, 0, 0, 4, 4, BROWN);
line(2, 20, 0, 4, 4, 4, BROWN);
line(9, 10, -1, 12, 5, -3, BROWN);

// ===== dragon-head prow (faces east) =====
const stem = [[18,2],[18,3],[18,4],[18,5],[18,6],[18,7],[19,7],[19,8],[19,9],[20,9],[20,10],[20,11],[20,12],[20,13],[19,13],[19,14]];
for (const [x, y] of stem) block(x, y, 0, BROWN);
for (const [x, y] of [[17,7],[18,9],[19,11],[18,14]]) block(x, y, 0, GOLD);
cube(18, 15, -1, 20, 17, 1, GOLD);
cube(21, 16, -1, 22, 16, 1, GOLD);
cube(21, 17, -1, 21, 17, 1, GOLD);
block(22, 17, 0, GOLD);
cube(20, 14, -1, 22, 14, 1, GOLD);
block(22, 15, -1, WHITE); block(22, 15, 1, WHITE);
block(21, 15, 0, RED);
block(20, 16, -1, NEON_RED); block(20, 16, 1, NEON_RED);
block(20, 17, -1, OBSIDIAN); block(20, 17, 1, OBSIDIAN);
line(18, 18, -1, 16, 20, -1, OBSIDIAN);
line(18, 18, 1, 16, 20, 1, OBSIDIAN);
block(19, 18, 0, GOLD);
block(17, 16, 0, OBSIDIAN); block(17, 15, 0, OBSIDIAN);

// ===== curled stern post (scorched) =====
const tail = [[-18,2],[-18,3],[-18,4],[-18,5],[-18,6],[-18,7],[-19,7],[-19,8],[-19,9],[-20,9],[-20,10],[-20,11],[-20,12],[-19,13],[-18,14],[-17,14],[-16,13],[-16,12],[-17,11],[-18,12]];
tail.forEach(([x, y], i) => {
  const c = i >= tail.length - 2 ? GOLD : (y < 10 && H(x, y, 9) < 0.5 ? BLACK : BROWN);
  block(x, y, 0, c);
});

// ===== grave goods =====
cube(5, 1, -2, 7, 3, -1, BROWN);
cube(5, 2, -2, 7, 2, -2, IRON);
cube(5, 4, -2, 7, 4, -1, GOLD);
block(6, 5, -2, GOLD); block(6, 5, -1, GOLD); block(7, 5, -1, GOLD);
for (const x of [9, 10, 11]) { cube(x, 1, -1, x, 8, -1, OAK_LOG); block(x, 9, -1, IRON); }
// raven banner
cube(13, 1, 1, 13, 11, 1, OAK_LOG);
block(13, 12, 1, GOLD);
cube(14, 11, 1, 17, 11, 1, WHITE);
cube(14, 10, 1, 17, 10, 1, WHITE);
cube(14, 9, 1, 16, 9, 1, WHITE);
cube(14, 8, 1, 15, 8, 1, WHITE);
block(15, 10, 1, BLACK); block(16, 10, 1, BLACK); block(15, 9, 1, BLACK); block(17, 11, 1, BLACK);
block(14, 7, 1, RED);

// ===== flames (limited count) =====
for (const x of [-10, -7, -4, -1]) block(x, 6, -2, FIRE);
for (const x of [-9, -5]) block(x, 6, 2, FIRE);
block(-11, 6, 0, FIRE); block(-1, 6, 0, FIRE);
block(-9, 8, -1, FIRE); block(-8, 8, 1, FIRE); block(-2, 8, 1, FIRE);
block(-13, 1, -1, FIRE); block(-15, 2, 0, FIRE); block(-12, 5, -3, FIRE); block(-17, 7, 0, FIRE);
block(-8, 4, 4, FIRE); block(-4, 4, -4, FIRE);

// burning debris drifting on the water
block(-14, 0, -7, BLACK); block(-14, 1, -7, FIRE);
block(-19, 0, -2, BROWN); block(-19, 1, -2, FIRE);

// ===== mourners on the shore (seen from behind, facing the ship) =====
function person(px, pz, o) {
  if (o.kneel) {
    cube(px, 0, pz, px + 1, 0, pz, o.legs || BROWN);
    cube(px, 0, pz - 1, px + 1, 0, pz - 1, BLACK);
    cube(px, 1, pz, px + 1, 2, pz, o.tunic);
    block(px - 1, 1, pz, o.tunic); block(px + 2, 1, pz, o.tunic);
    cube(px, 3, pz, px + 1, 3, pz, o.hair);
    if (o.cloak) cube(px, 1, pz - 1, px + 1, 2, pz - 1, o.cloak);
    return;
  }
  cube(px, 0, pz, px + 1, 0, pz, BLACK);
  cube(px, 1, pz, px + 1, 1, pz, o.legs || BROWN);
  cube(px, 2, pz, px + 1, 3, pz, o.tunic);
  block(px - 1, 2, pz, o.tunic); block(px - 1, 3, pz, o.tunic);
  if (!o.torch && !o.staff) { block(px + 2, 2, pz, o.tunic); block(px + 2, 3, pz, o.tunic); }
  cube(px, 4, pz, px + 1, 4, pz, o.hair);
  if (o.helmet) cube(px, 5, pz, px + 1, 5, pz, IRON);
  if (o.cloak) cube(px, 1, pz - 1, px + 1, 3, pz - 1, o.cloak);
  if (o.torch) {
    block(px + 2, 3, pz, o.tunic); block(px + 2, 4, pz, o.tunic);
    block(px + 2, 5, pz, OAK_LOG); block(px + 2, 6, pz, FIRE);
  }
  if (o.staff) { cube(px + 2, 0, pz, px + 2, 6, pz, OAK_LOG); block(px + 2, 7, pz, GOLD); }
  if (o.archer) {
    block(px - 1, 3, pz + 1, o.tunic);
    cube(px - 1, 2, pz + 2, px - 1, 5, pz + 2, BROWN);
  }
}
person(-9, -12, { tunic: GREEN, cloak: BROWN, hair: ORANGE, archer: true });
person(-4, -12, { tunic: BLUE, cloak: RED, hair: YELLOW, helmet: true, torch: true });
person(5, -12, { tunic: WHITE, cloak: GRAY, hair: GRAY, staff: true });
person(11, -11, { tunic: RED, cloak: BLACK, hair: BROWN, helmet: true, torch: true });
person(15, -9, { tunic: PURPLE, cloak: BLUE, hair: YELLOW, kneel: true });

// the fire arrow in flight
block(-8, 8, -10, WHITE); block(-7, 9, -9, BROWN); block(-6, 10, -8, FIRE);

// ===== rune stones =====
cube(-16, 0, -11, -15, 3, -11, STONE);
block(-16, 4, -11, STONE);
block(-16, 2, -11, RED); block(-15, 1, -11, RED); block(-15, 3, -11, RED);
cube(18, 0, -7, 18, 4, -7, GRAY);
cube(19, 0, -7, 19, 2, -7, GRAY);
block(18, 2, -7, RED); block(18, 3, -7, RED);