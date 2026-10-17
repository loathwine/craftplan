// ghost-ship-opus — prompt:
// a ghost pirate ship...

for (let x = -22; x <= 22; x++) {
  for (let z = -22; z <= 15; z++) {
    const e = (x * x) / (23 * 23) + ((z - 2) * (z - 2)) / (13 * 13);
    if (e <= 1 || z <= -9) cube(x, 1, z, x, 10, z, AIR);
  }
}

const ZC = 2;
function hash(x, y, z) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  h ^= h >>> 16;
  return ((h >>> 0) % 1000) / 1000;
}

// ---------- hull shape ----------
function hwX(x) {
  if (x < -19 || x > 20) return -1;
  if (x <= 7) return x < -15 ? 4 + (x + 19) * 0.25 : 5;
  const t = (x - 7) / 13;
  return 5 * Math.sqrt(Math.max(0, 1 - t * t));
}
function ybX(x) {
  if (x > 9) return 1 + (x - 9) * 0.55;
  if (x < -14) return 1 + (-14 - x) * 0.5;
  return 1;
}
function topX(x) { return x <= -11 ? 11 : x >= 13 ? 10 : 8; }
function deckY(x) { return x <= -11 ? 10 : x >= 13 ? 9 : 7; }
function inside(x, y, z) {
  if (y > topX(x)) return false;
  const b = hwX(x);
  if (b < 0) return false;
  const yb = ybX(x);
  if (y < yb - 0.01) return false;
  const t = Math.min(1, (y - yb + 1) / 5);
  return Math.abs(z - ZC) <= b * (0.3 + 0.7 * Math.sqrt(t)) + 0.3;
}
function northEdge(x, y) { for (let z = ZC - 7; z <= ZC; z++) if (inside(x, y, z)) return z; return ZC; }
function southEdge(x, y) { for (let z = ZC + 7; z >= ZC; z--) if (inside(x, y, z)) return z; return ZC; }

// ---------- spectral sea ----------
for (let x = -22; x <= 22; x++) {
  for (let z = -9; z <= 13; z++) {
    const e = (x * x) / (22.5 * 22.5) + ((z - ZC) * (z - ZC)) / (11.5 * 11.5);
    if (e > 1 || inside(x, 1, z)) continue;
    const h = hash(x, 0, z);
    const w = Math.sin(x * 0.55 + z * 0.35) + 0.6 * Math.sin(z * 0.8 - x * 0.25);
    const nearHull = inside(x + 1, 1, z) || inside(x - 1, 1, z) || inside(x, 1, z + 1) || inside(x, 1, z - 1);
    block(x, 0, z, h < 0.12 ? ICE : w > 0.7 ? LIGHT_BLUE : BLUE);
    if (nearHull) block(x, 1, z, h < 0.7 ? WHITE : ICE);
    else if (w > 1.25 && e < 0.92) block(x, 1, z, h < 0.35 ? WHITE : LIGHT_BLUE);
  }
}

// ---------- hull shell + decks ----------
const breach = (x, y, z) => x >= -3 && x <= -1 && y >= 3 && y <= 5 && z < ZC;
for (let x = -19; x <= 20; x++) {
  for (let y = 1; y <= 11; y++) {
    for (let z = ZC - 7; z <= ZC + 7; z++) {
      if (!inside(x, y, z)) continue;
      const side = !inside(x, y, z - 1) || !inside(x, y, z + 1);
      const shell = side || !inside(x - 1, y, z) || !inside(x + 1, y, z) || !inside(x, y - 1, z);
      const h = hash(x, y, z);
      if (shell) {
        if (breach(x, y, z) && side) continue;
        if (side && y >= 3 && y <= 5 && h < 0.04 && x > -17) continue;
        let m;
        if (y === topX(x)) m = OAK_LOG;
        else if (x === -19) {
          if (y === 10 || y === 6) m = GOLD;
          else if (y === 8 && Math.abs(z - ZC) <= 2 && (z - ZC) % 2 === 0) m = NEON_BLUE;
          else m = h < 0.6 ? BROWN : BLACK;
        }
        else if (x === -11 && z === ZC && y >= 8 && y <= 9) continue;
        else if (side && y === 9 && x <= -12 && x >= -18 && x % 3 === 0) m = NEON_BLUE;
        else if (y === 6) m = OBSIDIAN;
        else if (y <= 3) m = h < 0.6 ? BLACK : h < 0.85 ? GRAY : OBSIDIAN;
        else m = h < 0.45 ? BROWN : h < 0.75 ? GRAY : h < 0.9 ? BLACK : h < 0.95 ? LIGHT_GRAY : ICE;
        block(x, y, z, m);
      } else if (y === deckY(x)) {
        if (h > 0.95 && Math.abs(x) > 2 && Math.abs(z - ZC) > 1) continue;
        block(x, y, z, h < 0.45 ? GRAY : h < 0.8 ? BROWN : PLANKS);
      }
    }
  }
}
block(-2, 2, ZC - 2, NEON_BLUE);

// ---------- gunports + cannons ----------
for (const gx of [-8, -4, 4, 8]) {
  const zn = northEdge(gx, 5), zs = southEdge(gx, 5);
  block(gx, 5, zn, BLACK); block(gx, 5, zn - 1, IRON); block(gx, 6, zn - 1, BROWN);
  block(gx, 5, zs, BLACK); block(gx, 5, zs + 1, IRON); block(gx, 6, zs + 1, BROWN);
}

// ---------- anchor ----------
{
  const az = northEdge(15, 7) - 1;
  line(15, 4, az, 15, 7, az, IRON);
  line(14, 7, az, 16, 7, az, IRON);
  block(14, 4, az, IRON); block(16, 4, az, IRON);
  block(13, 5, az, IRON); block(17, 5, az, IRON);
}

// ---------- stern lanterns ----------
for (const dz of [-3, 3]) {
  block(-19, 12, ZC + dz, NEON_BLUE);
  block(-19, 13, ZC + dz, BLACK);
}

// ---------- deck clutter: barrels + treasure chest ----------
for (const [bx, bz] of [[-9, 5], [-8, 6], [7, 5], [-10, 6]]) {
  block(bx, 8, bz, BROWN); block(bx, 9, bz, bx % 2 ? OAK_LOG : BROWN);
}
cube(-18, 11, ZC + 2, -17, 11, ZC + 3, BROWN);
cube(-18, 12, ZC + 2, -17, 12, ZC + 3, GOLD);
block(-17, 11, ZC + 2, GOLD);

// ---------- skull figurehead + bowsprit ----------
cube(20, 7, ZC - 1, 21, 9, ZC + 1, WHITE);
block(21, 8, ZC - 1, NEON_BLUE); block(21, 8, ZC + 1, NEON_BLUE);
block(21, 7, ZC, BLACK);
block(20, 6, ZC, WHITE);
line(19, 10, ZC, 22, 13, ZC, OAK_LOG);

// ---------- rigging ----------
function shrouds(mx, ay, tx, ty) {
  line(mx, ay, ZC, tx, ty, northEdge(tx, ty), GRAY);
  line(mx, ay, ZC, tx, ty, southEdge(tx, ty), GRAY);
}
shrouds(0, 22, -4, 8);
shrouds(0, 22, 3, 8);
shrouds(10, 20, 7, 8);
shrouds(-14, 24, -12, 11);
line(0, 29, ZC, 10, 26, ZC, GRAY);
line(0, 29, ZC, -14, 28, ZC, GRAY);
line(-14, 29, ZC, -19, 12, ZC, GRAY);
line(10, 28, ZC, 22, 13, ZC, GRAY);

// ---------- masts ----------
line(0, 8, ZC, 0, 33, ZC, OAK_LOG);
line(10, 8, ZC, 10, 28, ZC, OAK_LOG);
line(-14, 11, ZC, -14, 29, ZC, OAK_LOG);

// ---------- tattered ghost sails ----------
function sail(x1, x2, y1, y2, maxB) {
  const W = x2 - x1, H = y2 - y1;
  line(x1 - 1, y2 + 1, ZC - 1, x2 + 1, y2 + 1, ZC - 1, OAK_LOG);
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      const u = (x - x1) / W, v = (y2 - y) / H;
      const h = hash(x, y, x1 * 7 + y1);
      if (y === y1 && h < 0.45) continue;
      if (y === y1 + 1 && h < 0.18) continue;
      if (h > 0.93) continue;
      if ((x - x1 === Math.floor(W * 0.3) || x - x1 === Math.floor(W * 0.7) + 1) && v > 0.55 && h < 0.7) continue;
      const bulge = Math.round(maxB * Math.sin(Math.PI * u) * Math.sin(Math.PI * (0.1 + 0.8 * v)));
      block(x, y, ZC - 1 - bulge, h < 0.5 ? LIGHT_GRAY : h < 0.8 ? WHITE : h < 0.88 ? ICE : GRAY);
    }
  }
}
sail(-5, 5, 16, 22, 2);
sail(-4, 4, 25, 28, 1);
sail(7, 13, 14, 19, 2);
sail(8, 12, 21, 24, 1);
sail(-16, -12, 19, 23, 1);
sail(-15, -13, 25, 27, 1);

// jib
for (let x = 14; x <= 20; x++) {
  const top = Math.floor(28 - (x - 10) * 15 / 12) - 1;
  const bot = 11 + Math.floor((x - 14) * 0.4);
  for (let y = bot; y <= top; y++) {
    const h = hash(x, y, 99);
    if (h > 0.9 || (y === bot && h < 0.4)) continue;
    block(x, y, ZC, h < 0.55 ? LIGHT_GRAY : h < 0.82 ? WHITE : ICE);
  }
}

// crow's nest + lookout
disk(0, 23, ZC, 2, BROWN);
for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
  if (Math.round(Math.sqrt(dx * dx + dz * dz)) === 2) block(dx, 24, ZC + dz, BROWN);
}
block(1, 24, ZC + 1, LIGHT_GRAY);
block(1, 25, ZC + 1, WHITE);

// Jolly Roger
const flag = ["BBWWWBB", "BBNWNBB", "BBWWWBB", "BWBWBW."];
for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
  const ch = flag[r][c];
  if (ch === ".") continue;
  const fz = ZC - (c >= 4 ? 1 : 0);
  block(1 + c, 33 - r, fz, ch === "B" ? BLACK : ch === "W" ? WHITE : NEON_RED);
}

// St. Elmo's fire + yard lanterns
block(10, 29, ZC, ELECTRIC);
block(-14, 30, ZC, ELECTRIC);
block(22, 14, ZC, ELECTRIC);
block(-6, 22, ZC - 1, NEON_BLUE);
block(6, 22, ZC - 1, NEON_BLUE);

// ---------- skeleton crew ----------
function skeleton(x, z, variant, hat) {
  const y = 8;
  block(x - 1, y, z, WHITE); block(x + 1, y, z, WHITE);
  cube(x - 1, y + 1, z, x + 1, y + 1, z, WHITE);
  block(x, y + 2, z, LIGHT_GRAY);
  cube(x - 1, y + 3, z, x + 1, y + 4, z, WHITE);
  block(x, y + 3, z, GRAY);
  block(x - 2, y + 4, z, WHITE); block(x - 2, y + 3, z, WHITE);
  if (variant === 1) {
    block(x + 2, y + 4, z, WHITE); block(x + 3, y + 5, z, WHITE);
    block(x + 3, y + 6, z, GOLD);
    line(x + 4, y + 6, z, x + 5, y + 7, z, IRON);
  } else if (variant === 2) {
    block(x + 2, y + 4, z, WHITE); block(x + 2, y + 5, z, WHITE);
    block(x + 2, y + 6, z, BROWN);
    block(x + 2, y + 7, z, GREEN);
  } else {
    block(x + 2, y + 4, z, WHITE); block(x + 2, y + 3, z, WHITE);
  }
  cube(x - 1, y + 5, z, x + 1, y + 6, z + 1, WHITE);
  block(x, y + 5, z, BLACK);
  block(x - 1, y + 6, z, NEON_BLUE); block(x + 1, y + 6, z, NEON_BLUE);
  if (hat === "bandana") { cube(x - 1, y + 7, z, x + 1, y + 7, z + 1, RED); block(x + 2, y + 7, z + 1, RED); }
  else if (hat === "tricorn") { cube(x - 2, y + 7, z - 1, x + 2, y + 7, z + 2, BLACK); block(x, y + 7, z - 1, GOLD); }
}
skeleton(-8, ZC - 2, 1, "bandana");
skeleton(3, ZC - 2, 2, "tricorn");
skeleton(5, ZC + 2, 0, "bandana");

// ---------- ghost pirates ----------
function ghost(x, y, z, hat) {
  block(x, y, z, ICE);
  cube(x - 1, y + 1, z, x + 1, y + 1, z + 1, ICE);
  cube(x - 1, y + 2, z, x + 1, y + 3, z + 1, ICE);
  block(x - 2, y + 3, z, ICE); block(x + 2, y + 3, z, ICE); block(x + 2, y + 2, z - 1, ICE);
  cube(x - 1, y + 4, z, x + 1, y + 5, z + 1, WHITE);
  block(x - 1, y + 5, z, NEON_BLUE); block(x + 1, y + 5, z, NEON_BLUE);
  block(x, y + 4, z, GRAY);
  if (hat) cube(x - 1, y + 6, z, x + 1, y + 6, z + 1, BLACK);
}
ghost(16, 10, ZC - 2, true);
ghost(-5, 8, ZC + 1, false);

// ---------- ghost captain at the helm ----------
{
  const CZ = ZC - 3;
  const wx = -15, wy = 13;
  for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
    if (dy || dz) block(wx, wy + dy, CZ + dz, BROWN);
  }
  block(wx, wy, CZ, GOLD);
  block(wx, wy + 2, CZ, OAK_LOG); block(wx, wy - 2, CZ, OAK_LOG);
  block(wx, wy, CZ + 2, OAK_LOG); block(wx, wy, CZ - 2, OAK_LOG);
  block(-16, 11, CZ, ICE);
  cube(-17, 12, CZ - 1, -16, 12, CZ + 1, ICE);
  cube(-17, 13, CZ - 1, -16, 14, CZ + 1, LIGHT_BLUE);
  line(-16, 13, CZ, -16, 14, CZ, GOLD);
  block(-16, 14, CZ - 2, GOLD); block(-16, 14, CZ + 2, GOLD);
  block(-16, 13, CZ - 2, ICE); block(-16, 13, CZ + 2, ICE);
  cube(-17, 15, CZ - 1, -16, 16, CZ + 1, WHITE);
  block(-16, 16, CZ - 1, NEON_BLUE); block(-16, 16, CZ + 1, NEON_BLUE);
  block(-16, 15, CZ, GRAY); block(-15, 15, CZ, LIGHT_GRAY);
  cube(-18, 17, CZ - 1, -15, 17, CZ + 1, BLACK);
  block(-17, 17, CZ - 2, BLACK); block(-16, 17, CZ + 2, BLACK);
  block(-18, 18, CZ - 1, BLACK); block(-18, 18, CZ + 1, BLACK); block(-15, 18, CZ, BLACK);
  cube(-17, 18, CZ - 1, -16, 18, CZ + 1, BLACK);
  block(-15, 17, CZ, WHITE);
  block(-14, 17, CZ, GOLD);
}

// ---------- spectral wisps trailing the stern ----------
for (let x = -22; x <= -20; x++) for (let y = 3; y <= 10; y++) for (let z = ZC - 3; z <= ZC + 3; z++) {
  const h = hash(x, y, z + 50);
  if (h < 0.12 + (x + 22) * 0.04) block(x, y, z, h < 0.07 ? WHITE : ICE);
}