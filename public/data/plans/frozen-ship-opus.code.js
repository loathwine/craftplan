// frozen-ship-opus — prompt:
// a ship trapped in Arctic pack ice...

// A three-masted expedition barque frozen into Arctic pack ice. Its broadside faces north toward the camera and the bow points east (+X).
const P = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (Math.abs(x) > 22 || Math.abs(z) > 22 || y < -8 || y > 33) return;
  P.set(x + ',' + y + ',' + z, id);
}
function rnd(x, y, z) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return h - Math.floor(h);
}
function pline(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) * 1.5 + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    put(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, typeof id === 'function' ? id(t) : id);
  }
}
function vn(x, z, s) {
  const xi = Math.floor(x / s), zi = Math.floor(z / s);
  const fx = x / s - xi, fz = z / s - zi;
  const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
  const a = rnd(xi, 0, zi), b = rnd(xi + 1, 0, zi), c = rnd(xi, 0, zi + 1), d = rnd(xi + 1, 0, zi + 1);
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
}

// ---------- remove the forest canopy (stumps stay outside the ice field) ----------
cube(-22, 1, -22, 22, 9, 22, AIR);

// ---------- hull geometry ----------
const BOW = 16, STERN = -15;
function halfBeam(x) {
  if (x > BOW || x < STERN) return -1;
  if (x > 3) return 4.6 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 3) / 13.6, 2)));
  if (x < -8) return 4.6 * (1 - 0.33 * Math.pow((-8 - x) / 7, 2));
  return 4.6;
}
function vfac(y) { return y <= 4 ? 0.8 + 0.2 * (y + 1) / 5 : 1 - 0.02 * (y - 4); }
function deckY(x) { return x <= -10 ? 8 : x >= 12 ? 7 : 6; }
function inHull(x, y, z) {
  if (y < -1 || y > deckY(x)) return false;
  const hb = halfBeam(x);
  if (hb < 0) return false;
  return Math.abs(z) <= hb * vfac(y) + 0.45;
}

// ---------- pack-ice sheet ----------
function leadZ(x) { return -18.5 + Math.sin(x * 0.28) * 1.6 + x * 0.08; }
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const se = Math.pow(Math.pow(Math.abs(x) / 22.5, 4) + Math.pow(Math.abs(z + 3) / 19.5, 4), 0.25);
  const edge = 1 + (vn(x + 7, z + 3, 3) - 0.5) * 0.12;
  if (se > edge) {
    if (se < edge + 0.12 && rnd(x, 4, z) < 0.35) { put(x, 0, z, AIR); put(x, -1, z, SNOW); }
    continue;
  }
  put(x, 0, z, AIR);
  if (inHull(x, -1, z)) continue;
  // open lead of black water in the foreground
  if (x > -9 && Math.abs(z - leadZ(x)) < (x > 6 ? 1.3 : 0.8)) {
    put(x, -1, z, WATER); put(x, -2, z, OBSIDIAN); continue;
  }
  const n = vn(x + 40, z + 40, 5);
  let id = n > 0.62 ? WHITE : n < 0.32 ? MARBLE : SNOW;
  if (Math.abs(n - 0.5) < 0.03) id = LIGHT_BLUE;
  else if (rnd(x, 1, z) < 0.04) id = LIGHT_GRAY;
  put(x, -1, z, id);
  if (vn(x, z, 3.2) > 0.8 && rnd(x, 2, z) < 0.5) put(x, 0, z, SNOW);
}
[[0, 0], [9, 0], [14, 1], [19, 0], [-5, 0]].forEach(([x, dz]) => {
  const z = Math.round(leadZ(x)) + dz;
  put(x, -1, z, WHITE); put(x + 1, -1, z, LIGHT_BLUE);
});

// ---------- hull ----------
for (let x = STERN; x <= BOW; x++) {
  const dy = deckY(x);
  for (let y = -1; y <= dy; y++) for (let z = -6; z <= 6; z++) {
    if (!inHull(x, y, z)) continue;
    const shell = !inHull(x + 1, y, z) || !inHull(x - 1, y, z) || !inHull(x, y, z + 1) || !inHull(x, y, z - 1);
    if (y === dy) {
      put(x, y, z, shell ? BROWN : (vn(x, z + 9, 2.5) > 0.55 || rnd(x, y, z) < 0.15 ? SNOW : PLANKS));
      continue;
    }
    if (!shell) continue;
    let id = y <= 3 ? BLACK : y === 4 ? WHITE : BROWN;
    const r = rnd(x, y, z);
    if (y <= 0 && r < 0.35) id = WHITE;           // rime at the ice line
    else if (y <= 3 && r < 0.07) id = LIGHT_GRAY;  // frost streaks
    put(x, y, z, id);
  }
  // bulwark rail, snow-capped
  for (let z = -6; z <= 6; z++) {
    if (!inHull(x, dy, z)) continue;
    if (!inHull(x, dy, z - 1) || !inHull(x, dy, z + 1) || !inHull(x + 1, dy, z) || !inHull(x - 1, dy, z))
      put(x, dy + 1, z, rnd(x, 9, z) < 0.35 ? SNOW : OAK_LOG);
  }
}
// stem, figurehead, bowsprit with icicles
pline(16, 0, 0, 17, 8, 0, OAK_LOG);
put(17, 6, 0, GOLD);
pline(17, 8, 0, 22, 11, 0, OAK_LOG);
for (let x = 18; x <= 21; x++) if (rnd(x, 3, 3) < 0.6) put(x, Math.round(8 + (x - 17) * 0.6) - 1, 0, ICE);
function northFace(x, y) { for (let z = -7; z <= 0; z++) if (inHull(x, y, z)) return z; return null; }
// warm lit portholes on the camera side
[[-13, 6], [-11, 6], [-4, 3], [-1, 3], [8, 3], [11, 3]].forEach(([x, y]) => {
  const z = northFace(x, y); if (z !== null) put(x, y, z, GLOWSTONE);
});
// gilded name board on the stern quarter
for (let x = -14; x <= -10; x++) { const z = northFace(x, 4); if (z !== null) put(x, 4, z, GOLD); }

// ---------- deck furniture ----------
for (let x = -7; x <= -3; x++) for (let z = -2; z <= 2; z++) for (let y = 7; y <= 8; y++)
  if (x === -7 || x === -3 || Math.abs(z) === 2) put(x, y, z, (y === 8 && x === -5) ? GLOWSTONE : PLANKS);
for (let x = -8; x <= -2; x++) for (let z = -3; z <= 3; z++) put(x, 9, z, SNOW);
for (let y = 10; y <= 13; y++) for (let x = -6; x <= -5; x++) for (let z = -1; z <= 0; z++) put(x, y, z, y === 12 ? RED : BLACK);
block(-6, 14, -1, STEAM); block(-5, 14, 0, STEAM);
// poop cabin + wheel
for (let x = -15; x <= -12; x++) for (let z = -2; z <= 2; z++) { put(x, 9, z, BROWN); put(x, 10, z, BROWN); put(x, 11, z, SNOW); }
put(-12, 10, -1, GLOWSTONE);
put(-10, 9, 0, OAK_LOG); put(-10, 10, 0, BROWN);
put(-10, 10, -1, GOLD); put(-10, 10, 1, GOLD); put(-10, 11, 0, GOLD); put(-10, 9, -1, GOLD); put(-10, 9, 1, GOLD);
put(-15, 12, -2, OAK_LOG); put(-15, 13, -2, GLOWSTONE);
// hatch, barrels, capstan, bell
for (let x = 4; x <= 6; x++) for (let z = -1; z <= 1; z++) put(x, 7, z, BROWN);
put(5, 8, 0, SNOW);
[[-1, -3], [3, 2], [7, -2], [-8, 3]].forEach(([x, z]) => { put(x, 7, z, OAK_LOG); put(x, 8, z, SNOW); });
put(13, 8, -1, PLANKS); put(14, 8, -1, PLANKS); put(13, 8, 0, PLANKS); put(14, 8, 0, PLANKS);
put(10, 9, 0, GOLD);

// ---------- masts, yards, sails ----------
const BR = 32 * Math.PI / 180; // yards braced round
function yard(mx, y, L) {
  const dx = Math.sin(BR) * L, dz = Math.cos(BR) * L;
  pline(mx - dx, y, -dz, mx + dx, y, dz, BROWN);
  const L2 = L - 1, ex = Math.sin(BR) * L2, ez = Math.cos(BR) * L2;
  pline(mx - ex, y - 1, -ez, mx + ex, y - 1, ez, t => (rnd(mx, y, Math.floor(t * 9)) < 0.3 ? SNOW : WHITE));
  for (let i = -L2; i <= L2; i += 2)
    if (rnd(mx, y, i) < 0.5) put(mx + Math.sin(BR) * i, y - 2, Math.cos(BR) * i, ICE);
}
function mast(mx, base, top, yards, topY) {
  pline(mx, base, 0, mx, top, 0, OAK_LOG);
  put(mx, top + 1, 0, GOLD);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) put(mx + dx, topY, dz, PLANKS);
  put(mx - 1, topY + 1, -1, SNOW); put(mx + 1, topY + 1, 1, SNOW);
  yards.forEach(([y, L]) => yard(mx, y, L));
  const hb = Math.floor(halfBeam(mx) * vfac(deckY(mx))) + 0.4;
  [-1, 1].forEach(s => {
    pline(mx - 2, deckY(mx) + 1, s * hb, mx, topY - 1, s, LIGHT_GRAY);
    pline(mx + 1, deckY(mx) + 1, s * hb, mx, topY - 1, s, LIGHT_GRAY);
  });
}
mast(9, 7, 27, [[11, 7], [16, 6], [21, 5], [25, 3]], 17);
mast(0, 7, 31, [[12, 8], [23, 5], [28, 4]], 19);
for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) if (dx || dz) put(dx, 26, dz, BROWN); // crow's nest
// main topsail yard: sail hanging loose, frozen stiff and torn
pline(-Math.sin(BR) * 7, 18, -Math.cos(BR) * 7, Math.sin(BR) * 7, 18, Math.cos(BR) * 7, BROWN);
for (let i = -6.5; i <= 6.5; i += 0.5) {
  const bottom = 13 + Math.floor(rnd(Math.round(i * 3), 1, 7) * 3) + (Math.abs(i) > 4.5 ? 1 : 0);
  for (let y = 17; y >= bottom; y--) {
    const r = rnd(Math.round(i * 2), y, 3);
    if (r < 0.08) continue;
    put(Math.sin(BR) * i, y, Math.cos(BR) * i + (17 - y) * 0.15, r < 0.2 ? ICE : r < 0.3 ? LIGHT_GRAY : WHITE);
  }
}
// mizzen: gaff rig, furled spanker, tattered ensign
pline(-8, 7, 0, -8, 24, 0, OAK_LOG);
put(-8, 25, 0, GOLD);
pline(-8, 12, 0, -16, 12, 0, BROWN);
pline(-9, 13, 0, -15, 13, 0, WHITE);
pline(-8, 19, 0, -15, 22, 0, BROWN);
[-1, 1].forEach(s => pline(-9, 9, s * 3.6, -8, 18, 0, LIGHT_GRAY));
[[-16, 22], [-17, 22], [-16, 21], [-17, 21], [-18, 22]].forEach(([x, y], i) => put(x, y, 0, i === 2 ? WHITE : RED));
// frosted stays + furled jib
pline(9, 26, 0, 22, 11, 0, LIGHT_GRAY);
pline(9, 17, 0, 17, 8, 0, LIGHT_GRAY);
pline(0, 30, 0, 9, 24, 0, LIGHT_GRAY);
pline(0, 19, 0, 9, 13, 0, LIGHT_GRAY);
pline(-8, 23, 0, 0, 21, 0, LIGHT_GRAY);
pline(-8, 24, 0, -15, 12, 0, LIGHT_GRAY);
pline(12, 22, 0, 19, 11, 0, WHITE);

// ---------- expedition camp on the ice (north-west foreground) ----------
for (let x = -19; x <= -15; x++) for (let h = 0; h <= 2; h++) {
  put(x, h, -13 - (2 - h), ORANGE);
  put(x, h, -13 + (2 - h), ORANGE);
}
put(-19, 0, -13, BROWN); put(-15, 0, -13, BLACK); put(-15, 1, -13, ORANGE); put(-19, 1, -13, ORANGE);
put(-19, 3, -13, OAK_LOG); put(-15, 3, -13, OAK_LOG);
[[-12, -12], [-11, -11], [-13, -11], [-12, -10]].forEach(([x, z]) => put(x, 0, z, COBBLE));
put(-12, 0, -11, OAK_LOG);
block(-12, 1, -11, FIRE);
function sailor(x, z, coat) { put(x, 0, z, BLACK); put(x, 1, z, coat); put(x, 2, z, SAND); put(x, 3, z, coat === RED ? BLACK : BROWN); }
sailor(-10, -12, BLUE);
sailor(-14, -10, RED);
sailor(-11, -9, BROWN);
// lifeboat on a sledge, crew hauling it away from the ship
for (let x = 1; x <= 7; x++) {
  const w = (x === 1 || x === 7) ? 0 : 1;
  put(x, 0, -12, OAK_LOG);
  for (let z = -12 - w; z <= -12 + w; z++) {
    put(x, 1, z, w && z !== -12 ? WHITE : BROWN);
    if (Math.abs(z + 12) === w) put(x, 2, z, BROWN);
  }
}
put(4, 2, -12, PLANKS); put(4, 3, -12, OAK_LOG); put(3, 2, -12, SNOW);
pline(1, 1, -12, -3, 1, -13, LIGHT_GRAY);
sailor(-3, -13, GREEN);
sailor(-5, -14, BLUE);
for (let x = -21; x <= -20; x++) for (let z = -10; z <= -9; z++) { put(x, 0, z, PLANKS); put(x, 1, z, PLANKS); }
put(-21, 2, -10, SNOW); put(-18, 0, -9, BROWN);
put(-8, 0, -15, OAK_LOG); put(-8, 1, -15, OAK_LOG); put(-8, 2, -15, GLOWSTONE);
[[-6, -11], [-7, -9], [-5, -9]].forEach(([x, z], i) => {
  const c = i === 1 ? GRAY : LIGHT_GRAY; put(x, 0, z, c); put(x + 1, 0, z, c); put(x + 1, 1, z, BLACK);
});

// ---------- polar bear peering into the lead ----------
{
  const bz = Math.round(leadZ(14)) + 3;
  const W = WHITE;
  [[11, bz - 1], [11, bz + 1], [14, bz - 1], [14, bz + 1]].forEach(([x, z]) => put(x, 0, z, W));
  for (let x = 10; x <= 15; x++) for (let y = 1; y <= 2; y++) for (let z = bz - 1; z <= bz + 1; z++) put(x, y, z, W);
  for (let x = 12; x <= 14; x++) for (let z = bz - 1; z <= bz + 1; z++) put(x, 3, z, W);
  put(9, 2, bz, W);
  for (let x = 16; x <= 17; x++) for (let y = 2; y <= 3; y++) for (let z = bz - 2; z <= bz; z++) put(x, y, z, W);
  put(16, 1, bz - 1, W);
  put(17, 2, bz - 3, W); put(17, 3, bz - 3, W); put(17, 2, bz - 4, BLACK); // snout + nose
  put(16, 3, bz - 3, BLACK); put(18, 3, bz - 2, BLACK);                     // eyes
  put(17, 4, bz - 2, W); put(16, 4, bz, W);                                 // ears
}
put(19, -1, Math.round(leadZ(19)) + 4, WATER); put(19, -2, Math.round(leadZ(19)) + 4, OBSIDIAN);

// ---------- pressure ridges crushing the hull ----------
const RUB = [WHITE, SNOW, LIGHT_BLUE, MARBLE, ICE, WHITE];
function rubble(x, z, h) {
  for (let y = -1; y <= h; y++) {
    if (inHull(x, y, z)) continue;
    const r = rnd(x, y, z);
    put(x, y, z, y === h && r < 0.5 ? SNOW : RUB[Math.floor(r * RUB.length)]);
  }
}
function slab(cx, cy, cz, a, b, phi, tilt, idTop) {
  const ux = Math.cos(phi), uz = Math.sin(phi);
  const vx = -Math.sin(phi) * Math.cos(tilt), vy = Math.sin(tilt), vz = Math.cos(phi) * Math.cos(tilt);
  for (let u = -a / 2; u <= a / 2; u += 0.5) for (let v = 0; v <= b; v += 0.5) {
    const x = cx + u * ux + v * vx, y = cy + v * vy, z = cz + u * uz + v * vz;
    const rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
    if (ry < -1 || inHull(rx, ry, rz)) continue;
    const edge = v > b - 0.6 || Math.abs(u) > a / 2 - 0.4;
    put(x, y, z, edge ? LIGHT_BLUE : (rnd(rx, ry, rz) < 0.3 ? MARBLE : idTop));
  }
}
for (let x = STERN - 2; x <= BOW + 2; x++) {
  const hb = Math.max(0, halfBeam(x));
  const zn = -Math.round(hb * 0.85) - 1;
  for (let k = 0; k < 3; k++) {
    const h = Math.floor(rnd(x, 5, k) * (3 - k)) - (k === 2 ? 1 : 0);
    if (h >= 0) rubble(x, zn - k, h);
  }
  const zs = Math.round(hb * 0.85) + 1;
  for (let k = 0; k < 2; k++) {
    const h = Math.floor(1 + rnd(x, 6, k) * (4 - k)) + (Math.abs(x) < 8 ? 1 : 0);
    rubble(x, zs + k, h);
  }
}
// upended floes nipping the hull
slab(4, -1, -7.5, 4, 5, 0, 1.15, WHITE);
slab(-9, -1, -7, 3, 4, 0.1, 1.25, SNOW);
slab(11, -1, -6.5, 3, 4, -0.4, 1.2, WHITE);
slab(-2, -1, 8.5, 5, 9, Math.PI, 1.05, WHITE);
slab(8, -1, 8, 4, 8, Math.PI + 0.3, 1.2, SNOW);
slab(-12, -1, 7.5, 4, 5, Math.PI - 0.2, 1.3, WHITE);
// ridges running off across the field
for (let t = 0; t <= 1; t += 0.05) {
  const x = Math.round(17 + t * 5), z = Math.round(-4 - t * 10);
  rubble(x, z, Math.floor(rnd(Math.round(t * 20), 1, 1) * 3));
  rubble(x + 1, z, Math.floor(rnd(Math.round(t * 20), 2, 1) * 2));
}
for (let t = 0; t <= 1; t += 0.06) {
  rubble(Math.round(-17 - t * 5), Math.round(2 + t * 9), Math.floor(rnd(Math.round(t * 20), 3, 1) * 3));
}
slab(-20, -1, 4, 3, 3, 0.8, 1.0, WHITE);

// anchor hanging at the bow (after the ridges, so the rubble doesn't overwrite it)
{
  const z = northFace(13, 4) - 1;
  pline(13, 7, z, 13, 2, z, IRON);
  put(12, 2, z, IRON); put(14, 2, z, IRON); put(12, 3, z, IRON); put(14, 3, z, IRON);
  put(12, 6, z, OAK_LOG); put(14, 6, z, OAK_LOG);
}

// ---------- icebergs in the background (south) ----------
function berg(cx, cz, rx, rz, peak) {
  const hgt = (x, z) => {
    const d = Math.pow((x - cx) / rx, 2) + Math.pow((z - cz) / rz, 2);
    if (d > 1) return -2;
    return Math.round(peak * Math.pow(1 - d, 0.45) * (0.75 + 0.35 * vn(x * 1.3, z * 1.3, 2.5)));
  };
  for (let x = cx - rx; x <= cx + rx; x++) for (let z = cz - rz; z <= cz + rz; z++) {
    const h = hgt(x, z); if (h < 0) continue;
    const low = Math.min(hgt(x - 1, z), hgt(x + 1, z), hgt(x, z - 1), hgt(x, z + 1));
    for (let y = Math.max(-1, low); y <= h; y++) {
      const band = vn(x * 3, y * 2, 2);
      put(x, y, z, y === h ? SNOW : band > 0.7 ? LIGHT_BLUE : band < 0.2 ? MARBLE : WHITE);
    }
  }
}
berg(15, 18, 5, 3, 13);
berg(-17, 18, 4, 3, 7);

// ---------- flush ----------
P.forEach((id, k) => { const c = k.split(',').map(Number); block(c[0], c[1], c[2], id); });