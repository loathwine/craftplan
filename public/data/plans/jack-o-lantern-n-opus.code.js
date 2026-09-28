// jack-o-lantern-n-opus — prompt:
// a glowing jack-o'-lantern...

const M = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id) {
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(K(x, y, z), [x, y, z, id]);
}
function get(x, y, z) { const v = M.get(K(x, y, z)); return v ? v[3] : undefined; }
function hsh(x, y, z) {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1442695041)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}
function support(x, z) {
  if (get(x, -1, z) === undefined) put(x, -1, z, DIRT);
  if (get(x, -2, z) === undefined) put(x, -2, z, DIRT);
}
function topY(x, z) {
  for (let y = 24; y >= -2; y--) { const v = get(x, y, z); if (v !== undefined && v !== AIR) return y; }
  return -1;
}

// ---------- generic pumpkin generator ----------
function pumpkin(cx, cy, cz, R, Ry, o) {
  o = o || {};
  const th = o.th || 1.4, ribs = o.ribs || 10, phi = (o.face || 0) * Math.PI / 180;
  const sn = Math.sin(phi), cs = Math.cos(phi), off = Math.atan2(-cs, sn);
  const shape = (dx, dy, dz, sh) => {
    const t = Math.atan2(dz, dx);
    const lobe = Math.abs(Math.cos(ribs * (t - off) / 2));
    const rr = Math.max(0.4, R * (0.9 + 0.1 * Math.pow(lobe, 0.6)) - sh);
    const ry = Math.max(0.4, (dy > 0 ? Ry * 0.92 : Ry) - sh);
    let d = (dx * dx + dz * dz) / (rr * rr) + dy * dy / (ry * ry);
    if (dy > 0) d += 0.35 * Math.exp(-(dx * dx + dz * dz) / (R * R * 0.06));
    return [d, lobe, t];
  };
  const isHole = (dx, dy, dz) => {
    if (!o.faceFn) return false;
    if (dx * sn - dz * cs <= 0) return false;
    return o.faceFn(Math.round(dx * cs + dz * sn), dy);
  };
  for (let x = Math.floor(cx - R - 1); x <= Math.ceil(cx + R + 1); x++)
  for (let y = Math.floor(cy - Ry - 1); y <= Math.ceil(cy + Ry + 1); y++)
  for (let z = Math.floor(cz - R - 1); z <= Math.ceil(cz + R + 1); z++) {
    const dx = x - cx, dy = y - cy, dz = z - cz;
    const s = shape(dx, dy, dz, 0);
    const d = s[0], lobe = s[1], t = s[2];
    if (d > 1) continue;
    const di = shape(dx, dy, dz, th)[0];
    const front = (dx * sn - dz * cs) > 0;
    if (di <= 1) {
      if (o.core) { put(x, y, z, o.core); continue; }
      const dl = shape(dx, dy, dz, th + 1.1)[0];
      if (o.lining && dl > 1 && (!front || dy < -Ry + th + 1.6)) put(x, y, z, o.lining(x, y, z));
      else put(x, y, z, AIR);
      continue;
    }
    const outer = shape(dx, dy, dz - 1, 0)[0] > 1;
    if (isHole(dx, dy, dz)) {
      put(x, y, z, (o.glowFace && !outer) ? GLOWSTONE : AIR);
      continue;
    }
    let id = o.color || ORANGE;
    if (o.groove && lobe < 0.2) id = o.groove;
    if (o.lid && dy >= Ry * 0.5) {
      const rad = Math.sqrt(dx * dx + dz * dz);
      const zig = (Math.floor((t + Math.PI) * 8 / Math.PI) % 2) * 0.9;
      if (Math.abs(rad - (R * 0.36 + zig)) < 0.6) id = BROWN;
    }
    if (o.faceFn && front && !outer && !o.glowFace &&
        (isHole(dx + 1, dy, dz) || isHole(dx - 1, dy, dz) || isHole(dx, dy + 1, dz) || isHole(dx, dy - 1, dz))) id = YELLOW;
    put(x, y, z, id);
  }
}
function smallStem(x, z, tall) {
  const t = topY(x, z);
  put(x, t + 1, z, GREEN);
  if (tall) { put(x, t + 2, z, BROWN); put(x + 1, t + 2, z, BROWN); }
}

// ---------- the big jack-o'-lantern ----------
function bigFace(u, dy) {
  for (const ex of [-4, 4]) {
    if (dy >= 1 && dy <= 4) { const hw = 2.5 - 0.75 * (dy - 1); if (Math.abs(u - ex) <= hw) return true; }
  }
  if (dy === -1 && Math.abs(u) <= 1) return true;
  if (dy === 0 && u === 0) return true;
  const au = Math.abs(u);
  if (au <= 6) {
    const yb = -5 + Math.round(u * u / 24), hgt = au >= 5 ? 2 : 3;
    let lo = yb, hi = yb + hgt - 1;
    if (au === 2) hi--;
    if (au === 0 || au === 4) lo++;
    if (dy >= lo && dy <= hi) return true;
  }
  return false;
}
const PX = 0, PY = 7, PZ = 3;
pumpkin(PX, PY, PZ, 10, 8, {
  face: 12, faceFn: bigFace, groove: COPPER, lid: true,
  lining: (x, y, z) => {
    const r = hsh(x, y, z);
    if (y <= 1) return r < 0.6 ? LAVA : GLOWSTONE;
    return r < 0.5 ? GLOWSTONE : r < 0.75 ? YELLOW : LAVA;
  }
});

// candles inside the lantern
for (let y = 1; y <= 4; y++) put(0, y, 4, WHITE);
for (const [ax, az] of [[1, 4], [-1, 4], [0, 5], [0, 3]]) { put(ax, 1, az, WHITE); put(ax, 2, az, WHITE); }
put(0, 5, 4, FIRE);
for (const sx of [-3, 3]) { put(sx, 1, 6, WHITE); put(sx, 2, 6, WHITE); put(sx, 3, 6, FIRE); }

// stem
{
  let s = topY(0, 3) + 1;
  for (const [sx, sz] of [[0, 3], [1, 3], [0, 4], [1, 4]]) {
    for (let y = topY(sx, sz) + 1; y <= s + 2; y++) put(sx, y, sz, y < s + 2 ? GREEN : BROWN);
  }
  put(1, s + 3, 3, BROWN); put(1, s + 3, 4, BROWN);
  put(2, s + 4, 3, BROWN); put(3, s + 4, 3, BROWN); put(3, s + 5, 2, BROWN);
}

// curling vine across the top with leaves
{
  const pts = [];
  for (let s = 8; s <= 60; s++) {
    const a = s * 0.12 + 1.2, r = 1.5 + s * 0.12;
    const x = Math.round(0.5 + r * Math.cos(a)), z = Math.round(3.5 + r * Math.sin(a));
    pts.push([x, z]);
    put(x, topY(x, z) + 1, z, GREEN);
  }
  for (const idx of [12, 28, 42, 51]) {
    const [lx, lz] = pts[idx];
    for (const [ox, oz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1]]) {
      const x = lx + ox, z = lz + oz;
      put(x, topY(x, z) + 1, z, LEAVES);
    }
  }
}

// ---------- smaller pumpkins ----------
const faceA = (u, dy) => (dy === 1 && Math.abs(u) === 1) || (dy === -1 && Math.abs(u) <= 1);
const faceB = (u, dy) => (dy === 1 && (u === -1 || u === 1 || u === 2 || u === -2) && !(dy === 1 && Math.abs(u) === 2 && false)) && Math.abs(u) === 1 ||
                         (dy === 1 && Math.abs(u) === 1) || (dy === -1 && Math.abs(u) <= 2 && u !== 0) || (dy === 0 && u === 0);
pumpkin(-12, 2, -5, 3, 3, { face: 20, faceFn: faceA, core: GLOWSTONE, glowFace: true, th: 1.2, ribs: 8 });
smallStem(-12, -5, true);
pumpkin(11, 2, -7, 3.5, 3, { face: -20, faceFn: faceB, core: GLOWSTONE, glowFace: true, th: 1.2, ribs: 8 });
smallStem(11, -7, true);
pumpkin(6, 1, -11, 2, 2, { ribs: 6, th: 3 });
smallStem(6, -11, false);
pumpkin(-6, 1, -11, 2, 2, { ribs: 6, th: 3 });
smallStem(-6, -11, false);
pumpkin(15, 1, -2, 2.5, 2, { ribs: 6, th: 3 });
smallStem(15, -2, true);

// ---------- scarecrow with pumpkin head (back right) ----------
{
  const X = 14, Z = 8;
  support(X, Z);
  for (let y = 0; y <= 8; y++) put(X, y, Z, OAK_LOG);
  const shirt = (x, y, z) => ((x + y) % 2 === 0 ? RED : BROWN);
  for (let x = 11; x <= 17; x++) put(x, 7, Z, shirt(x, 7, Z));
  put(10, 7, Z, YELLOW); put(18, 7, Z, YELLOW); put(10, 6, Z, YELLOW); put(18, 6, Z, YELLOW);
  for (let x = 13; x <= 15; x++) for (let y = 4; y <= 7; y++) for (let z = Z; z <= Z + 1; z++)
    put(x, y, z, y === 4 ? BROWN : shirt(x, y, z));
  for (const lx of [13, 15]) { support(lx, Z); put(lx, 0, Z, YELLOW); for (let y = 1; y <= 3; y++) put(lx, y, Z, BLUE); }
  pumpkin(X, 10, Z, 2.2, 2, { faceFn: (u, dy) => (dy === 0 && Math.abs(u) === 1) || (dy === -1 && u === 0), core: GLOWSTONE, glowFace: true, th: 1.1, ribs: 6 });
  for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) if (dx * dx + dz * dz <= 5) put(X + dx, 12, Z + dz, BLACK);
  for (let x = X - 1; x <= X + 1; x++) for (let z = Z - 1; z <= Z + 1; z++) {
    put(x, 13, z, z === Z - 1 ? PURPLE : BLACK);
    put(x, 14, z, BLACK);
  }
  put(X, 15, Z, BLACK); put(X + 1, 16, Z, BLACK);
  // crow on the arm
  put(16, 8, Z, BLACK); put(16, 9, Z, BLACK); put(16, 9, Z - 1, YELLOW); put(16, 8, Z + 1, BLACK);
}

// ---------- hay bales with a candle (front left) ----------
for (let x = -16; x <= -13; x++) for (let z = -12; z <= -10; z++) {
  support(x, z);
  for (let y = 0; y <= 1; y++) put(x, y, z, x === -14 ? BROWN : YELLOW);
}
for (let x = -16; x <= -15; x++) for (let z = -11; z <= -10; z++) put(x, 2, z, YELLOW);
put(-13, 2, -12, WHITE); put(-13, 3, -12, FIRE);

// ---------- dry cornstalks (back left) ----------
for (let i = 0; i < 16; i++) {
  const x = -16 + Math.floor(hsh(i, 1, 7) * 6), z = 8 + Math.floor(hsh(i, 2, 7) * 7);
  if (get(x, 0, z) !== undefined) continue;
  const hgt = 5 + Math.floor(hsh(i, 3, 7) * 3);
  support(x, z);
  for (let y = 0; y < hgt; y++) put(x, y, z, y < hgt - 1 ? SAND : YELLOW);
  put(x, hgt, z, BROWN);
  const s = hsh(i, 4, 7) < 0.5 ? 1 : -1;
  put(x + s, 2, z, YELLOW); put(x - s, 3, z, BROWN); put(x, 4, z + s, YELLOW);
}

// ---------- lamp posts framing the scene ----------
function lampPost(x, z, dir) {
  put(x, -1, z, COBBLE); put(x, -2, z, COBBLE);
  for (let y = 0; y <= 5; y++) put(x, y, z, OAK_LOG);
  put(x + dir, 5, z, PLANKS); put(x + dir * 2, 5, z, PLANKS);
  put(x + dir * 2, 4, z, IRON); put(x + dir * 2, 3, z, GLOWSTONE); put(x + dir * 2, 2, z, IRON);
}
lampPost(-12, -12, 1);
lampPost(12, -12, -1);

// ---------- stone path to the lantern ----------
for (let z = -13; z <= -7; z++) for (let x = -1; x <= 1; x++) {
  if (get(x, -1, z) !== undefined) continue;
  const r = hsh(x, 9, z);
  if (r < 0.2) continue;
  put(x, -1, z, r < 0.6 ? COBBLE : GRAY);
}

// ---------- candles on the ground ----------
function candle(x, z, h) {
  support(x, z);
  for (let y = 0; y < h; y++) put(x, y, z, WHITE);
  put(x, h, z, FIRE);
}
candle(-3, -11, 2); candle(3, -10, 1); candle(-7, -8, 3); candle(4, -13, 2); candle(-5, -13, 1);

// ---------- ground vines linking the patch ----------
{
  const path = [[8, -3], [9, -4], [9, -5], [8, -6], [7, -7], [7, -8], [6, -9]];
  for (const [x, z] of path) { if (get(x, 0, z) === undefined) { support(x, z); put(x, 0, z, GREEN); } }
  for (const [x, z] of [[10, -4], [8, -8]]) { if (get(x, 0, z) === undefined) { support(x, z); put(x, 0, z, LEAVES); } }
  const path2 = [[-8, -2], [-9, -3], [-9, -4]];
  for (const [x, z] of path2) { if (get(x, 0, z) === undefined) { support(x, z); put(x, 0, z, GREEN); } }
}

// ---------- bats ----------
function bat(x, y, z, up) {
  put(x, y, z, BLACK); put(x, y + 1, z, BLACK);
  const wing = up ? [[1, 1], [2, 1], [2, 2], [3, 2], [4, 3], [3, 1]] : [[1, 0], [2, 0], [3, -1], [2, -1], [4, -1], [4, -2]];
  for (const s of [-1, 1]) for (const [wx, wy] of wing) put(x + s * wx, y + wy, z, BLACK);
}
bat(5, 22, 0, true);
bat(-5, 25, 6, false);
bat(9, 28, 8, true);
bat(-12, 26, 19, false);

// ---------- crescent moon behind ----------
for (let x = -16; x <= -4; x++) for (let y = 21; y <= 33; y++) {
  const a = (x + 10) ** 2 + (y - 27) ** 2, b = (x + 7.8) ** 2 + (y - 28.2) ** 2;
  if (a <= 5.2 * 5.2 && b > 4.4 * 4.4) put(x, y, 21, hsh(x, y, 21) < 0.2 ? WHITE : MARBLE);
}

// ---------- fallen autumn leaves (fill remaining budget) ----------
let solid = 0;
for (const v of M.values()) if (v[3] !== AIR) solid++;
const LEAFC = [ORANGE, RED, BROWN, YELLOW];
for (let x = -15; x <= 15 && solid < 3960; x++) for (let z = -13; z <= 14 && solid < 3960; z++) {
  if (get(x, -1, z) !== undefined || get(x, 0, z) !== undefined) continue;
  const r = hsh(x, 5, z);
  if (r >= 0.16) continue;
  const c = LEAFC[Math.floor(hsh(x, 6, z) * 4)];
  put(x, -1, z, c); solid++;
  if (r < 0.025 && solid < 3960) { put(x, 0, z, c); solid++; }
}

// ---------- emit ----------
cube(-16, 1, -13, 16, 9, 14, AIR);
for (const [x, y, z, id] of M.values()) block(x, y, z, id);