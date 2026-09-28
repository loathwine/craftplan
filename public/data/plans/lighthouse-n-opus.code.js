// lighthouse-n-opus — prompt:
// a lighthouse on a stormy night...

const LX = -2, LZ = 5;
const CX = 0, CZ = 4;
const ZC = -15;
let used = 0;
const LIMIT = 3985;

function inb(x, y, z) { return x >= -22 && x <= 22 && z >= -22 && z <= 22 && y >= -8 && y <= 33; }
function put(x, y, z, b) {
  if (!inb(x, y, z)) return;
  if (b === AIR) { block(x, y, z, AIR); return; }
  if (used >= LIMIT) return;
  used++;
  block(x, y, z, b);
}
function air(x1, y1, z1, x2, y2, z2) {
  x1 = Math.max(-22, x1); y1 = Math.max(-8, y1); z1 = Math.max(-22, z1);
  x2 = Math.min(22, x2); y2 = Math.min(33, y2); z2 = Math.min(22, z2);
  if (x1 > x2 || y1 > y2 || z1 > z2) return;
  cube(x1, y1, z1, x2, y2, z2, AIR);
}
function lineP(x1, y1, z1, x2, y2, z2, b) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    put(Math.round(x1 + (x2 - x1) * i / n), Math.round(y1 + (y2 - y1) * i / n), Math.round(z1 + (z2 - z1) * i / n), b);
  }
}
function hash(x, z) { const h = Math.sin(x * 127.1 + z * 311.7 + 17.3) * 43758.5453; return h - Math.floor(h); }
function hash3(x, y, z) { const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return h - Math.floor(h); }

// ---------- CLIFF HEIGHTFIELD ----------
function cliffRaw(x, z) {
  const dx = x - CX, dz = z - CZ;
  const d = Math.sqrt(dx * dx + dz * dz);
  const a = Math.atan2(dz, dx);
  const r = 11 + 1.2 * Math.sin(a * 3 + 1) + 0.8 * Math.sin(a * 5 + 2);
  const p = r - 4;
  if (d <= p) return 6;
  return Math.round(6 - (d - p) * 1.9 + (hash(x, z) - 0.5) * 1.6);
}
function inCottagePad(x, z) { return x >= 3 && x <= 11 && z >= 2 && z <= 9; }
const HC = {};
function cliffH(x, z) {
  const k = x + ',' + z;
  if (k in HC) return HC[k];
  let h = cliffRaw(x, z);
  if (inCottagePad(x, z) || (x - LX) * (x - LX) + (z - LZ) * (z - LZ) <= 36) h = Math.max(h, 6);
  h = Math.min(h, 6);
  HC[k] = h;
  return h;
}
function rockMat(x, y, z, isTop, h) {
  const r = hash3(x, y, z);
  if (isTop) {
    if (h >= 6) return r < 0.78 ? GRASS : (r < 0.9 ? DIRT : COBBLE);
    if (h >= 2) return r < 0.4 ? GRASS : (r < 0.75 ? STONE : COBBLE);
  }
  if (y <= 0) return r < 0.4 ? COBBLE : (r < 0.75 ? GRAY : STONE);
  return r < 0.5 ? STONE : (r < 0.75 ? COBBLE : (r < 0.9 ? GRAY : LIGHT_GRAY));
}
function shoreZ(x) { return 6 + Math.round(2.5 * Math.sin(x * 0.28 + 0.5)); }

const waterCells = [];
for (let x = -22; x <= 22; x++) {
  for (let z = -22; z <= 22; z++) {
    const h = cliffH(x, z);
    if (h >= -1) {
      let mn = h;
      for (const [ax, az] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + ax, nz = z + az;
        const nh = (nx < -22 || nx > 22 || nz < -22 || nz > 22) ? -2 : Math.max(-2, cliffH(nx, nz));
        if (nh < mn) mn = nh;
      }
      const y0 = Math.max(-1, Math.min(mn + 1, h));
      air(x, h + 1, z, x, 12, z);
      for (let y = y0; y <= h; y++) put(x, y, z, rockMat(x, y, z, y === h, h));
    } else {
      const sz = shoreZ(x);
      if (z <= sz) {
        air(x, 0, z, x, 10, z);
        put(x, -1, z, WATER);
        waterCells.push([x, z]);
      } else if (z <= sz + 2) {
        air(x, 0, z, x, 8, z);
        put(x, -1, z, SAND);
      }
    }
  }
}

// ---------- WAVES + FOAM ----------
for (const [x, z] of waterCells) {
  let near = false;
  for (const [ax, az] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + ax, nz = z + az;
    if (nx >= -22 && nx <= 22 && nz >= -22 && nz <= 22 && cliffH(nx, nz) >= -1) near = true;
  }
  const hs = hash(x * 3 + 1, z * 7 + 2);
  if (near) { if (hs > 0.3) put(x, 0, z, WHITE); continue; }
  const w = Math.sin(x * 0.32 + z * 0.8 + Math.sin(x * 0.17 + z * 0.05) * 2.2);
  if (w > 0.9) {
    put(x, 0, z, hs > 0.5 ? WHITE : WATER);
    if (w > 0.985 && hs > 0.7) put(x, 1, z, WHITE);
  }
}

// ---------- LIGHTHOUSE ----------
function ring(cx, y, cz, rOut, rIn, fn) {
  const R = Math.ceil(rOut);
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d <= rOut && d > rIn) {
      const b = fn(dx, dz, d);
      if (b !== null && b !== undefined) put(cx + dx, y, cz + dz, b);
    }
  }
}
// plinth
ring(LX, 7, LZ, 5.3, 2.8, (dx, dz) => hash3(dx, 7, dz) < 0.6 ? COBBLE : STONE);
ring(LX, 8, LZ, 4.9, 2.8, (dx, dz) => hash3(dx, 8, dz) < 0.8 ? STONE : LIGHT_GRAY);
// striped tower
const towerR = y => 4.3 - (y - 9) * 0.095;
for (let y = 9; y <= 24; y++) {
  const r = towerR(y);
  const band = Math.floor((y - 9) / 3) % 2 === 0 ? WHITE : RED;
  ring(LX, y, LZ, r, r - 1.3, () => band);
}
// door + lit windows
put(LX, 9, LZ - 4, BROWN); put(LX, 10, LZ - 4, BROWN);
put(LX, 11, LZ - 4, GRAY);
for (const y of [13, 14, 19, 20]) put(LX, y, LZ - Math.floor(towerR(y)), GLOWSTONE);
for (const y of [16, 17]) put(LX + Math.floor(towerR(y)), y, LZ, GLOWSTONE);
for (const y of [16, 17]) put(LX - Math.floor(towerR(y)), y, LZ, GLOWSTONE);
// door torches
put(LX - 1, 10, LZ - 5, IRON); put(LX - 1, 11, LZ - 5, FIRE);
put(LX + 1, 10, LZ - 5, IRON); put(LX + 1, 11, LZ - 5, FIRE);
// corbel + gallery + railing
ring(LX, 24, LZ, 3.9, 2.9, () => GRAY);
ring(LX, 25, LZ, 4.6, -1, (dx, dz) => (dx * dx + dz * dz > 12) ? BLACK : GRAY);
ring(LX, 26, LZ, 4.6, 3.7, (dx, dz) => ((dx + dz) % 2 === 0) ? IRON : null);
ring(LX, 27, LZ, 4.6, 3.7, () => IRON);
// lantern room
for (let y = 26; y <= 28; y++) ring(LX, y, LZ, 2.3, 1.3, (dx, dz) => Math.abs(dx) === Math.abs(dz) ? IRON : GLASS);
put(LX, 26, LZ, GOLD);
put(LX, 27, LZ, GLOWSTONE);
put(LX + 1, 27, LZ, GLOWSTONE); put(LX - 1, 27, LZ, GLOWSTONE);
put(LX, 27, LZ + 1, GLOWSTONE); put(LX, 27, LZ - 1, GLOWSTONE);
put(LX, 28, LZ, GLOWSTONE);
// roof
ring(LX, 29, LZ, 2.9, -1, () => RED);
ring(LX, 30, LZ, 2.0, -1, () => RED);
ring(LX, 31, LZ, 1.0, -1, () => RED);
put(LX, 32, LZ, GOLD);
put(LX, 33, LZ, ELECTRIC);

// ---------- KEEPER'S COTTAGE ----------
const c1x = 4, c2x = 10, c1z = 3, c2z = 8;
function wallMat(x, y, z) {
  const corner = (x === c1x || x === c2x) && (z === c1z || z === c2z);
  return corner ? OAK_LOG : WHITE;
}
for (let y = 7; y <= 10; y++) {
  for (let x = c1x; x <= c2x; x++) { put(x, y, c1z, wallMat(x, y, c1z)); put(x, y, c2z, wallMat(x, y, c2z)); }
  for (let z = c1z + 1; z <= c2z - 1; z++) { put(c1x, y, z, wallMat(c1x, y, z)); put(c2x, y, z, wallMat(c2x, y, z)); }
}
put(7, 7, c1z, BROWN); put(7, 8, c1z, BROWN);
put(5, 8, c1z, GLOWSTONE); put(9, 8, c1z, GLOWSTONE);
put(c2x, 8, 5, GLOWSTONE); put(c2x, 8, 6, GLOWSTONE);
put(7, 9, c1z - 1, GRAY); put(6, 9, c1z - 1, GRAY); put(8, 9, c1z - 1, GRAY);
for (let k = 0; k <= 3; k++) {
  const y = 10 + k;
  for (let x = 3; x <= 11; x++) { put(x, y, 2 + k, GRAY); put(x, y, 9 - k, GRAY); }
}
for (const gx of [c1x, c2x]) {
  for (let z = 4; z <= 7; z++) put(gx, 11, z, WHITE);
  put(gx, 12, 5, WHITE); put(gx, 12, 6, WHITE);
}
for (let y = 11; y <= 15; y++) put(9, y, 7, COBBLE);
put(9, 16, 7, FIRE);

// ---------- PATH, STAIRS, DOCK ----------
for (let x = LX; x <= 4; x++) {
  const z = -1, h = cliffH(x, z);
  if (h >= 4) put(x, h, z, hash3(x, 1, z) < 0.5 ? GRAY : COBBLE);
}
for (const x of [3, 4]) { const h = cliffH(x, -2); if (h >= 4) put(x, h, -2, GRAY); }
for (let i = 1; i <= 6; i++) {
  const z = -2 - i, y = 6 - i;
  for (const x of [3, 4]) {
    put(x, y, z, PLANKS);
    air(x, y + 1, z, x, y + 4, z);
    if (i % 2 === 0) {
      const base = Math.max(-1, cliffH(x, z) + 1);
      for (let yy = y - 1; yy >= base; yy--) put(x, yy, z, OAK_LOG);
    }
  }
}
for (let z = -9; z >= -15; z--) { put(3, 0, z, PLANKS); put(4, 0, z, PLANKS); }
for (const z of [-9, -12, -15]) for (const x of [2, 5]) for (let y = -1; y <= 1; y++) put(x, y, z, OAK_LOG);
// keeper signaling the ship with a raised lantern
put(4, 1, -14, BLUE); put(4, 2, -14, YELLOW); put(4, 3, -14, SAND); put(4, 4, -14, YELLOW);
put(5, 3, -14, YELLOW); put(5, 4, -14, GLOWSTONE);
// moored rowboat
for (let x = 7; x <= 9; x++) { put(x, 0, -12, BROWN); put(x, 0, -11, BROWN); }
put(6, 0, -12, BROWN); put(10, 0, -11, BROWN); put(8, 1, -12, PLANKS);
lineP(6, 1, -12, 5, 1, -12, BROWN);

// ---------- SHIP IN THE STORM ----------
const SX0 = -17, SX1 = -6;
function hullInfo(x) {
  const u = (x - SX0) / (SX1 - SX0);
  const hw = u < 0.6 ? 2 : Math.max(0, Math.round(2 * Math.sqrt(Math.max(0, 1 - ((u - 0.6) / 0.4) ** 2))));
  return { hw, yo: Math.round(u * 2) };
}
for (let x = SX0; x <= SX1; x++) {
  const { hw, yo } = hullInfo(x);
  if (-2 + yo >= -1) put(x, -2 + yo, ZC, BROWN);
  for (let dz = -hw; dz <= hw; dz++) {
    const z = ZC + dz, edge = Math.abs(dz) === hw;
    if (Math.abs(dz) < hw || hw === 0) put(x, -1 + yo, z, BROWN);
    put(x, yo, z, edge ? BROWN : PLANKS);
    if (edge || x === SX0) put(x, 1 + yo, z, BROWN);
  }
}
// sterncastle
for (let x = SX0; x <= SX0 + 2; x++) {
  for (let dz = -1; dz <= 1; dz++) put(x, 1, ZC + dz, PLANKS);
  put(x, 2, ZC - 2, BROWN); put(x, 2, ZC + 2, BROWN);
}
for (let dz = -2; dz <= 2; dz++) put(SX0, 2, ZC + dz, BROWN);
put(SX0, 3, ZC, GLOWSTONE);
put(-14, 0, ZC - 2, GLOWSTONE); put(-10, 1, ZC - 2, GLOWSTONE);
// masts
for (let y = 2; y <= 16; y++) put(-12, y, ZC, OAK_LOG);
for (let y = 3; y <= 13; y++) put(-8, y, ZC, OAK_LOG);
lineP(-16, 3, ZC, -13, 3, ZC, OAK_LOG);
lineP(-16, 12, ZC, -12, 15, ZC, OAK_LOG);
lineP(-11, 4, ZC, -9, 4, ZC, OAK_LOG);
function sail(xa, xb, yb, ytA, ytB) {
  for (let x = xa; x <= xb; x++) {
    const f = (x - xa) / Math.max(1, xb - xa);
    const yt = Math.round(ytA + (ytB - ytA) * f);
    for (let y = yb; y <= yt; y++) {
      const s = Math.sin(Math.PI * (y - yb + 0.5) / (yt - yb + 1)) * Math.sin(Math.PI * (x - xa + 0.5) / (xb - xa + 1));
      const z = ZC - Math.round(s * 1.6);
      const hh = hash3(x, y, z);
      if (hh > 0.93) continue;
      put(x, y, z, hh < 0.12 ? LIGHT_GRAY : WHITE);
    }
  }
}
sail(-16, -13, 4, 11, 14);
sail(-11, -9, 5, 10, 12);
// jib + bowsprit + rigging
for (let x = -7; x <= -6; x++) {
  const yt = x === -7 ? 10 : 7;
  for (let y = 4; y <= yt; y++) put(x, y, ZC - (y > 5 && y < yt ? 1 : 0), WHITE);
}
lineP(-6, 3, ZC, -3, 4, ZC, OAK_LOG);
lineP(-8, 13, ZC, -3, 5, ZC, BLACK);
lineP(-12, 16, ZC, -17, 3, ZC, BLACK);
put(-13, 16, ZC, RED); put(-14, 16, ZC, RED); put(-15, 15, ZC, RED);
// foam + spray around hull
for (let x = SX0 - 1; x <= SX1 + 2; x++) {
  for (const dz of [-3, 3]) if (hash(x, dz + 40) > 0.4) put(x, 0, ZC + dz, WHITE);
}
put(-5, 0, ZC - 1, WHITE); put(-5, 0, ZC + 1, WHITE); put(-4, 0, ZC, WHITE);
put(-5, 1, ZC - 2, WHITE); put(-4, 2, ZC - 1, WHITE); put(-18, 0, ZC, WHITE); put(-18, 0, ZC - 1, WHITE);

// ---------- SEA ROCKS ----------
const rocks = [[-20, -7], [18, -19], [8, -20], [-3, -20], [20, -2], [-8, -10]];
for (const [rx, rz] of rocks) {
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
    if (hash(rx + dx, rz + dz) > 0.3 || (dx === 0 && dz === 0)) put(rx + dx, -1, rz + dz, hash3(rx + dx, 5, rz + dz) < 0.5 ? STONE : GRAY);
  }
  put(rx, 0, rz, COBBLE);
  if (hash(rx, rz) > 0.4) put(rx, 1, rz, GRAY);
  for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
    if (Math.max(Math.abs(dx), Math.abs(dz)) === 2 && hash(rx + dx * 3, rz + dz * 5) > 0.55) put(rx + dx, 0, rz + dz, WHITE);
  }
}

// ---------- LIGHT BEAMS ----------
function beam(dx, dy, dz, t0) {
  const n = Math.hypot(dx, dy, dz); dx /= n; dy /= n; dz /= n;
  let px = -dz, pz = dx; const pl = Math.hypot(px, pz); px /= pl; pz /= pl;
  const seen = new Set();
  for (let t = t0; t <= 40; t += 0.5) {
    const w = 0.3 + t * 0.065;
    const bx = LX + dx * t, by = 27 + dy * t, bz = LZ + dz * t;
    if (bx < -22 || bx > 22 || bz < -22 || bz > 22 || by < 0) break;
    for (let a = -w; a <= w + 1e-6; a += 0.7) for (let b = -w * 0.6; b <= w * 0.6 + 1e-6; b += 0.7) {
      const x = Math.round(bx + px * a), y = Math.round(by + b), z = Math.round(bz + pz * a);
      const k = x + ',' + y + ',' + z;
      if (seen.has(k)) continue; seen.add(k);
      if (hash3(x, y, z) < 0.15 + (t / 30) * 0.45) continue;
      put(x, y, z, ICE);
    }
  }
}
beam(-0.4, -0.18, -1, 5.5);
beam(1, -0.05, -0.35, 5.5);

// ---------- LIGHTNING ----------
const bolt = [[17, 31, -8], [15, 27, -9], [17, 23, -11], [14, 18, -11], [16, 13, -13], [13, 8, -13], [15, 4, -14], [14, 0, -15]];
for (let i = 0; i < bolt.length - 1; i++) lineP(...bolt[i], ...bolt[i + 1], NEON_BLUE);
lineP(14, 18, -11, 10, 14, -10, NEON_BLUE);
lineP(10, 14, -10, 9, 10, -11, NEON_BLUE);
lineP(16, 13, -13, 19, 9, -12, NEON_BLUE);
put(16, 28, -8, ELECTRIC); put(15, 19, -12, ELECTRIC); put(13, 1, -14, ELECTRIC); put(10, 13, -11, ELECTRIC);
for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
  const d = Math.abs(dx) + Math.abs(dz);
  if (d >= 1 && d <= 3 && hash(dx + 70, dz + 70) > 0.35) put(14 + dx, 0, -15 + dz, WHITE);
}
put(-14, 28, -3, ELECTRIC); put(-18, 27, 0, ELECTRIC);

// ---------- STORM CLOUDS (budget permitting) ----------
function cloud(cx, cy, cz, rx, ry, rz) {
  for (let x = cx - rx; x <= cx + rx; x++) for (let y = cy - 2; y <= cy + 2; y++) for (let z = cz - rz; z <= cz + rz; z++) {
    const n = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 + (hash3(x, y, z) - 0.5) * 0.4;
    if (n > 1) continue;
    const hh = hash3(x + 1, y, z);
    put(x, y, z, hh < 0.5 ? GRAY : (hh < 0.82 ? BLACK : LIGHT_GRAY));
  }
}
cloud(16, 31, -8, 6, 1.6, 3.5);
cloud(-15, 31, -2, 7, 1.6, 3.5);