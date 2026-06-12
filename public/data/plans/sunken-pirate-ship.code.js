// sunken-pirate-ship — prompt:
// A wrecked pirate galleon half-buried in a sandy beach, listing hard to one side. DIG the hull INTO the ground: carve a shallow tidal basin around the wreck with AIR below ground level and line it with...

// Wrecked pirate galleon — heeled 30° to starboard (+Z buried, -Z exposed)
// Order matters: put() is first-write-wins, AIR carving happens before all solids.

const HEEL = Math.PI / 6, CH = Math.cos(HEEL), SH = Math.sin(HEEL);
const CAP = 8950;
const placed = new Set();
let solids = 0;

function rnd(a, b) { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); }

function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  if (solids >= CAP) return;
  const k = x + ',' + y + ',' + z;
  if (placed.has(k)) return;
  placed.add(k); solids++;
  block(x, y, z, id);
}
function lineP(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) put(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, z1 + (z2 - z1) * i / n, id);
}
function sphereP(cx, cy, cz, r, id) {
  for (let x = Math.floor(cx - r); x <= cx + r; x++)
    for (let y = Math.floor(cy - r); y <= cy + r; y++)
      for (let z = Math.floor(cz - r); z <= cz + r; z++) {
        const dx = x - cx, dy = y - cy, dz = z - cz;
        if (dx * dx + dy * dy + dz * dz <= r * r + 0.4) put(x, y, z, id);
      }
}
function cylP(cx, cy, cz, r, h, id) {
  for (let y = cy; y < cy + h; y++)
    for (let x = cx - r; x <= cx + r; x++)
      for (let z = cz - r; z <= cz + r; z++)
        if ((x - cx) * (x - cx) + (z - cz) * (z - cz) <= r * r + 0.3) put(x, y, z, id);
}

// ---------- tidal basin ----------
const BCX = -2, BCZ = 1, BRX = 20, BRZ = 14;
function basinD2(x, z) { const dx = (x - BCX) / BRX, dz = (z - BCZ) / BRZ; return dx * dx + dz * dz; }
function floorY(x, z) { const d2 = basinD2(x, z); return d2 >= 1 ? -1 : Math.round(-1 - 5 * (1 - d2)); }

// carve the depression (AIR is free)
for (let x = -22; x <= 18; x++) for (let z = -13; z <= 15; z++) {
  const d2 = basinD2(x, z);
  if (d2 < 1) cube(x, floorY(x, z) + 1, z, x, 9, z, AIR);
  else if (d2 < 1.2) cube(x, 2, z, x, 9, z, AIR); // trim overhanging canopy at the rim
}
cube(14, 1, -6, 22, 14, 14, AIR);  // clear trees around the raised stern
cube(8, 1, 8, 18, 9, 16, AIR);     // clear trees in the south mound zone

// ---------- tidal pools (placed first so sand lining flows around them) ----------
const POOLS = [[-11, -6, 3], [-2, -9, 2], [6, -6, 2], [12, -3, 2], [-14, -5, 2]];
for (const p of POOLS) {
  for (let x = p[0] - p[2]; x <= p[0] + p[2]; x++)
    for (let z = p[1] - p[2]; z <= p[1] + p[2]; z++) {
      const dx = x - p[0], dz = z - p[1];
      if (dx * dx + dz * dz <= p[2] * p[2] + 0.3 && basinD2(x, z) < 0.95) put(x, floorY(x, z), z, GLASS);
    }
}

// ---------- sand lining of the basin ----------
for (let x = -22; x <= 18; x++) for (let z = -13; z <= 15; z++) {
  const d2 = basinD2(x, z);
  if (d2 >= 1) continue;
  const fl = floorY(x, z);
  put(x, fl, z, SAND); put(x, fl - 1, z, SAND);
  if (d2 < 0.45) put(x, fl - 2, z, SAND);
}

// ---------- ship parameters ----------
const BOW = -20, STERN = 19, LEN = STERN - BOW, ZC = 1, H = 7;
function kY(x) { return -5 + 8 * (x - BOW) / LEN; }
function halfW(x) {
  const t = (x - BOW) / LEN;
  if (t < 0.30) return 5.8 * Math.pow(t / 0.30, 0.65);
  if (t > 0.86) return 5.8 * (1 - 0.30 * (t - 0.86) / 0.14);
  return 5.8;
}
function wAt(x, v) { return halfW(x) * (0.32 + 0.68 * Math.sqrt(Math.max(0, v) / H)); }
function shipY(x, u, v) { return kY(x) + v * CH - u * SH; }
function shipZ(u, v) { return ZC + u * CH + v * SH; }
function inBreach(x, v) {
  const ex = (x + 2) / 6.5, ev = (v - 3.6) / 2.6, d = ex * ex + ev * ev;
  if (d < 1) return true;
  if (d < 1.4 && rnd(x * 1.7, v * 3.1) > 0.55) return true;
  return false;
}

// ---------- windows first (glass survives the plank fill) ----------
for (const u of [-3, -1.5, 0, 1.5, 3]) put(STERN, shipY(STERN, u, H + 2), shipZ(u, H + 2), GLASS);
for (const u of [-2, 0, 2]) put(STERN, shipY(STERN, u, H + 3.5), shipZ(u, H + 3.5), GLASS);
for (const x of [13, 15, 17]) {
  const wi = wAt(x, H) - 1;
  put(x, shipY(x, -wi, H + 2), shipZ(-wi, H + 2), GLASS);
  put(x, shipY(x, wi, H + 2), shipZ(wi, H + 2), GLASS);
}

// ---------- ribs (exposed in the breach) and wales ----------
for (const rx of [-7, -4, -1, 2]) for (let v = 0; v <= H; v += 0.3) {
  const u = -wAt(rx, v);
  put(rx, shipY(rx, u, v), shipZ(u, v), OAK_LOG);
}
for (let x = BOW + 2; x <= STERN; x++) for (const v of [2.4, 4.8]) {
  for (const s of [-1, 1]) {
    if (s < 0 && inBreach(x, v)) continue;
    const u = s * wAt(x, v);
    put(x, shipY(x, u, v), shipZ(u, v), OAK_LOG);
  }
}

// ---------- hull skin ----------
for (let x = BOW; x <= STERN; x++) {
  for (let v = 0; v <= H; v += 0.3) {
    const wv = wAt(x, v);
    for (const s of [-1, 1]) {
      if (s < 0 && inBreach(x, v)) continue;
      put(x, shipY(x, s * wv, v), shipZ(s * wv, v), PLANKS);
    }
    if (v <= 5 && wv > 1.5 && !inBreach(x, v)) put(x, shipY(x, -(wv - 1), v), shipZ(-(wv - 1), v), PLANKS);
  }
  const w0 = wAt(x, 0);
  for (let u = -w0; u <= w0; u += 0.4) put(x, shipY(x, u, 0), shipZ(u, 0), PLANKS);
  put(x, shipY(x, 0, -1), shipZ(0, -1), OAK_LOG); // keel
}

// ---------- deck (heeled plane, holed and gashed) ----------
function deckHole(x, u) {
  if (x >= 6 && x <= 8 && Math.abs(u) < 1.6) return true; // open hatch
  if (x > -9 && x < 4 && Math.abs(u - (-2 + (x + 9) * 0.55)) < 1.0 && rnd(x * 2.3, u) < 0.7) return true; // mast gash
  return rnd(x * 1.3, u * 2.1) < 0.12;
}
for (let x = BOW; x <= STERN; x++) {
  const wH = wAt(x, H);
  for (let u = -wH; u <= wH; u += 0.4) {
    if (deckHole(x, u)) continue;
    put(x, shipY(x, u, H), shipZ(u, H), PLANKS);
  }
}

// ---------- skeleton draped over the high rail (before the rail fills in) ----------
{
  const x = -11, u = -wAt(x, H);
  const ry = shipY(x, u, H + 1), rz = shipZ(u, H + 1);
  put(x, ry, rz, SNOW); put(x, ry + 1, rz, SNOW);
  put(x, ry - 1, rz - 1, SNOW); put(x, ry - 2, rz - 1, SNOW);
  put(x + 1, ry - 1, rz - 1, SNOW);
  put(x, ry - 1, rz + 1, SNOW); put(x + 1, ry - 1, rz + 2, SNOW);
}

// ---------- broken railing ----------
for (let x = BOW + 3; x <= STERN; x++) {
  for (const s of [-1, 1]) {
    const u = s * wAt(x, H);
    if (x % 4 === 0) put(x, shipY(x, u, H + 1), shipZ(u, H + 1), OAK_LOG);
    else if (rnd(x, s * 9) < 0.55) put(x, shipY(x, u, H + 1), shipZ(u, H + 1), PLANKS);
  }
}

// ---------- forecastle (mostly swallowed by the bow drift) ----------
for (let x = BOW + 1; x <= BOW + 6; x++) {
  const wi = Math.max(1, wAt(x, H) - 0.8);
  for (let v = H + 1; v <= H + 2; v += 0.5) {
    put(x, shipY(x, -wi, v), shipZ(-wi, v), PLANKS);
    put(x, shipY(x, wi, v), shipZ(wi, v), PLANKS);
  }
  for (let u = -wi; u <= wi; u += 0.5) put(x, shipY(x, u, H + 2.6), shipZ(u, H + 2.6), PLANKS);
}

// ---------- sterncastle ----------
for (let x = 12; x <= STERN; x++) {
  const wi = wAt(x, H) - 1;
  for (let v = H + 1; v <= H + 3.6; v += 0.4) {
    for (const s of [-1, 1]) {
      if (rnd(x * 5, s * v) < 0.08) continue;
      put(x, shipY(x, s * wi, v), shipZ(s * wi, v), PLANKS);
    }
  }
  for (let u = -wi; u <= wi; u += 0.4) {
    if (rnd(x * 7, u * 3) < 0.12) continue;
    put(x, shipY(x, u, H + 4), shipZ(u, H + 4), PLANKS);
  }
}
{ // front bulkhead with doorway
  const x = 12, wi = wAt(12, H) - 1;
  for (let u = -wi; u <= wi; u += 0.4) for (let v = H + 1; v <= H + 3.4; v += 0.4) {
    if (Math.abs(u) < 1 && v < H + 2.6) continue;
    put(x, shipY(x, u, v), shipZ(u, v), PLANKS);
  }
}
{ // transom — the tall silhouetted stern face
  const x = STERN;
  for (let v = 0; v <= H + 4.4; v += 0.4) {
    const wv = v <= H ? wAt(x, v) : wAt(x, H) - 0.5;
    for (let u = -wv; u <= wv; u += 0.4) put(x, shipY(x, u, v), shipZ(u, v), PLANKS);
  }
  for (let u = -3; u <= 3; u += 0.7) if (rnd(u * 9, 3) < 0.55) put(x, shipY(x, u, H + 5), shipZ(u, H + 5), PLANKS); // broken crest
}
for (let x = 12; x <= STERN; x++) {
  const wi = wAt(x, H) - 1;
  for (const s of [-1, 1]) if (rnd(x, s * 4) < 0.5) put(x, shipY(x, s * wi, H + 5), shipZ(s * wi, H + 5), OAK_LOG);
}
put(STERN, shipY(STERN, 0, H + 5), shipZ(0, H + 5), OAK_LOG); // lantern post
put(STERN, shipY(STERN, 0, H + 6), shipZ(0, H + 6), ICE);     // stern lantern

// ---------- masts ----------
// broken foremast: stump + fallen section lying across the heeled deck and over the buried rail
lineP(-9, 4, 5, -9, 7, 6, OAK_LOG);
put(-8, 7, 6, OAK_LOG);
lineP(-8, 7, 5, 4, 4, 9, OAK_LOG);
lineP(4, 4, 9, 11, 1, 13, OAK_LOG);
lineP(-4, 6, 7, 2, 5, 11, OAK_LOG); // snapped yard tangled across it
put(-2, 6, 8, SNOW); put(-1, 5, 9, SNOW); put(0, 5, 10, SNOW); put(-3, 6, 7, SNOW); put(1, 4, 10, SNOW);

// standing mainmast, tilted with the heel
lineP(5, 5, 4, 8, 20, 13, OAK_LOG);
lineP(5, 5, 5, 7, 13, 9, OAK_LOG);
put(7, 16, 10, PLANKS); put(8, 16, 10, PLANKS); put(7, 16, 11, PLANKS); // fighting top
lineP(-1, 13, 8, 13, 11, 8, OAK_LOG);  // lower yard, sagging
lineP(1, 18, 11, 13, 16, 11, OAK_LOG); // upper yard

// tattered SNOW sail shreds hanging from the yards
for (let i = 0; i <= 14; i++) {
  const sx = -1 + i;
  if (rnd(sx, 91) < 0.3) continue;
  const ty = Math.round(13 - 2 * i / 14) - 1;
  const len = 1 + Math.floor(rnd(sx, 92) * 5);
  for (let j = 0; j < len; j++) {
    if (rnd(sx, j * 13) < 0.15) continue;
    put(sx, ty - j, 8 + Math.floor(j / 3), SNOW);
  }
}
for (let i = 0; i <= 12; i++) {
  const sx = 1 + i;
  if (rnd(sx, 81) < 0.35) continue;
  const ty = Math.round(18 - 2 * i / 12) - 1;
  const len = 1 + Math.floor(rnd(sx, 82) * 4);
  for (let j = 0; j < len; j++) {
    if (rnd(sx, j * 17) < 0.15) continue;
    put(sx, ty - j, 11 + Math.floor(j / 3), SNOW);
  }
}
put(8, 21, 13, SNOW); put(8, 21, 14, SNOW); put(8, 20, 15, SNOW); // pennant

// bowsprit stub poking from the sand, rudder behind the transom
lineP(-20, 1, 4, -22, 4, 3, OAK_LOG);
lineP(20, 0, 2, 20, 6, 4, OAK_LOG);

// ---------- treasure spilling from the breach ----------
for (let cx = 4; cx <= 5; cx++) for (let cy = -4; cy <= -3; cy++) for (let cz = -3; cz <= -2; cz++) put(cx, cy, cz, PLANKS); // chest
put(4, -2, -3, BRICK); put(5, -2, -2, BRICK);
sphereP(-2, -3, -3, 3.2, SAND);
sphereP(-6, -4, -4, 2.4, SAND);
sphereP(2, -4, -5, 2.4, SAND);
sphereP(-2, -1.5, -1, 2.0, SAND);
sphereP(0, -3, -2, 2.6, SAND);
function gemAt(x, z) {
  for (let y = 2; y >= -8; y--) {
    if (placed.has(x + ',' + y + ',' + z)) { put(x, y + 1, z, BRICK); return; }
  }
}
const GEMS = [[-3, -2], [-1, -3], [-5, -4], [0, -5], [2, -4], [-7, -4], [-2, -5], [1, -3], [-4, -2], [3, -6], [-6, -6], [-1, -6], [4, -4], [-8, -5]];
for (const g of GEMS) gemAt(g[0], g[1]);

// ---------- debris field ----------
function wreckage(x1, z1, x2, z2) {
  const fl = floorY(Math.round((x1 + x2) / 2), Math.round((z1 + z2) / 2)) + 1;
  lineP(x1, fl, z1, x2, fl, z2, PLANKS);
}
wreckage(-14, -5, -11, -4); wreckage(-9, -8, -6, -9); wreckage(4, -8, 7, -7);
wreckage(9, -5, 12, -4); wreckage(-17, -1, -15, 2); wreckage(1, -11, 3, -10);
{ const f = floorY(-5, -6); lineP(-5, f, -6, -5, f + 3, -6, PLANKS); }
{ const f = floorY(10, -7); lineP(10, f, -7, 10, f + 2, -7, OAK_LOG); }
function barrel(x, z) { cylP(x, floorY(x, z) + 1, z, 1, 2, OAK_LOG); }
barrel(-13, -7); barrel(6, -9); barrel(13, -6);
cylP(10, 6, 8, 1, 2, OAK_LOG); // barrel wedged against the low rail on deck

// second skeleton sprawled on the beach near a pool
{
  const f = floorY(-4, -7) + 1;
  put(-6, f, -7, SNOW); lineP(-5, f, -7, -3, f, -7, SNOW);
  put(-5, f, -8, SNOW); put(-4, f, -6, SNOW); lineP(-2, f, -8, -1, f, -8, SNOW); put(-2, f, -6, SNOW);
}

// wrack line of seaweed on the north slope
for (let x = -16; x <= 12; x++) {
  if (rnd(x, 4) < 0.5) continue;
  const dxn = (x - BCX) / BRX, s = 0.55 - dxn * dxn;
  if (s < 0.02) continue;
  const z = Math.round(BCZ - BRZ * Math.sqrt(s));
  put(x, floorY(x, z) + 1, z, LEAVES);
}

// boulders propping the raised stern
sphereP(17, -1, 0, 2.2, STONE);
sphereP(14, -2, -2, 1.7, COBBLE);
sphereP(20, 0, 5, 1.5, STONE);

// ---------- sand swallowing the buried (south) side ----------
for (let x = BOW; x <= STERN; x++) {
  const t = (x - BOW) / LEN;
  const cover = Math.max(1.2, H * (1 - 0.8 * t));
  const colTop = {};
  let zMax = -99, yEdge = 0;
  for (let v = 0; v <= cover; v += 0.25) {
    const zz = Math.round(shipZ(wAt(x, v), v));
    const yy = Math.floor(shipY(x, wAt(x, v), v));
    if (colTop[zz] === undefined || yy > colTop[zz]) colTop[zz] = yy;
    if (zz > zMax) { zMax = zz; yEdge = yy; }
  }
  for (let u = 0; u <= wAt(x, 0); u += 0.4) { // trace hull bottom too
    const zz = Math.round(shipZ(u, 0));
    const yy = Math.floor(shipY(x, u, 0));
    if (colTop[zz] === undefined || yy > colTop[zz]) colTop[zz] = yy;
  }
  // sandbank cradle under the keel
  const zN = Math.round(shipZ(-wAt(x, 0), 0)), zK = Math.round(shipZ(0, 0));
  const keelY = Math.floor(shipY(x, 0, 0));
  for (let z = zN; z <= zK; z++) for (let y = floorY(x, z); y < keelY; y++) put(x, y, z, SAND);
  // climbing drift over the south flank, tapering out to the beach
  const spread = 5 + Math.floor(rnd(x, 77) * 4);
  for (let z = zK + 1; z <= zMax + spread; z++) {
    let top;
    if (colTop[z] !== undefined) top = colTop[z];
    else if (z > zMax) top = yEdge - Math.round((z - zMax) * 0.9) - Math.floor(rnd(x, z) * 2);
    else continue;
    for (let y = floorY(x, z); y <= top; y++) put(x, y, z, SAND);
  }
}

// big drifts burying the bow
sphereP(-18, -2, 2, 5.5, SAND);
sphereP(-14, -1, 5, 4, SAND);
sphereP(-20, 0, 6, 3.5, SAND);
sphereP(-16, 1, 2, 3, SAND);
sphereP(-19, -1, -2, 3, SAND);

// thin sand drift blown across the low side of the deck
for (let x = -4; x <= 15; x++) {
  if (rnd(x, 55) < 0.45) continue;
  const u = wAt(x, H) - 1.3;
  put(x, shipY(x, u, H) + 1, shipZ(u, H), SAND);
  if (rnd(x, 56) < 0.4) put(x, shipY(x, u - 1.2, H) + 1, shipZ(u - 1.2, H), SAND);
}

// driftwood logs on the berm
lineP(-19, 0, -9, -14, 0, -11, OAK_LOG);
lineP(16, 0, -12, 19, 0, -9, OAK_LOG);

// dunes on the basin rim
sphereP(-20, 0, -12, 2.2, SAND);
sphereP(-7, 0, -13, 2.5, SAND);
sphereP(5, 0, -14, 2, SAND);
sphereP(18, -1, -7, 2.5, SAND);
sphereP(-21, 0, 8, 2.2, SAND);
sphereP(12, 0, 15, 2.5, SAND);

// beach berm ring around the carved basin (last — soaks up remaining budget)
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const d2 = basinD2(x, z);
  if (d2 <= 1 || d2 > 1.55) continue;
  if (rnd(x, z) < 0.12) continue;
  put(x, -1, z, SAND); put(x, 0, z, SAND);
  if (rnd(x + 9, z) < 0.3) put(x, 1, z, SAND);
}