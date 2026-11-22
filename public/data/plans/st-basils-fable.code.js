// st-basils-fable — prompt:
// St. Basil's Cathedral in the snow...

// St. Basil's Cathedral in the snow — front faces NORTH (-Z)
const M = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id) {
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(K(x, y, z), [x, y, z, id]);
}
const TAU = Math.PI * 2;
const mod2 = (n) => ((n % 2) + 2) % 2;

// ---------- layout ----------
const CX = 0, CZ = 2;                      // central tent tower
const BIG = [                              // four cardinal chapels
  { x: 0,  z: -6, hs: 5, pat: 'spiral',  c1: BLUE,   c2: WHITE,  n: 4, tw: 1,  acc: BLUE },
  { x: 8,  z: 2,  hs: 6, pat: 'checker', c1: RED,    c2: WHITE,  n: 4, tw: 0,  acc: GREEN },
  { x: -8, z: 2,  hs: 5, pat: 'spiral',  c1: GREEN,  c2: YELLOW, n: 4, tw: -1, acc: RED },
  { x: 0,  z: 10, hs: 7, pat: 'ribs',    c1: ORANGE, c2: GREEN,  n: 4, tw: 0,  acc: BLUE },
];
const SMALL = [                            // four diagonal chapels
  { x: 6,  z: -4, hs: 4, pat: 'checker', c1: YELLOW,     c2: GREEN, n: 3, tw: 0,  acc: GREEN },
  { x: -6, z: -4, hs: 5, pat: 'ribs',    c1: RED,        c2: WHITE, n: 3, tw: 0,  acc: RED },
  { x: 6,  z: 8,  hs: 5, pat: 'spiral',  c1: LIGHT_BLUE, c2: WHITE, n: 3, tw: 1,  acc: BLUE },
  { x: -6, z: 8,  hs: 4, pat: 'spiral',  c1: RED,        c2: GREEN, n: 3, tw: -1, acc: GREEN },
];
const BELL = { x: 17, z: 6 };

// lobed (star-like) podium footprint; e = extra margin
function inPod(x, z, e) {
  let dx = x - CX, dz = z - CZ;
  if (dx * dx + dz * dz <= (5.6 + e) * (5.6 + e)) return true;
  for (const c of BIG) { dx = x - c.x; dz = z - c.z; if (dx * dx + dz * dz <= (4.3 + e) * (4.3 + e)) return true; }
  for (const c of SMALL) { dx = x - c.x; dz = z - c.z; if (dx * dx + dz * dz <= (3.3 + e) * (3.3 + e)) return true; }
  return false;
}
const lowSE = (x, z) => x >= 5 && x <= 14 && z >= 5 && z <= 15;   // terrain dips here
const lowN = (x, z) => x >= -3 && x <= 7 && z >= -9 && z <= 2;
const bellD = (x, z) => (x - BELL.x) * (x - BELL.x) + (z - BELL.z) * (z - BELL.z);

// ---------- 1. clear trees from the site (AIR is free) ----------
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const site = inPod(x, z, 4.5) || bellD(x, z) <= 30;
  const front = x >= -19 && x <= 19 && z <= -10;
  const back = x >= -21 && x <= 21 && z >= 18;
  if (!site && !front && !back) continue;
  let y0 = 1;
  if (!site && z <= -17) y0 = 2;           // keep the rocky rise to the north
  if (site && lowSE(x, z)) y0 = 0;
  for (let y = y0; y <= 10; y++) put(x, y, z, AIR);
}

// ---------- 2. snow-covered ground ----------
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  if (inPod(x, z, 0)) continue;
  const pd = x * x + (z + 15) * (z + 15);
  const ragged = ((x * 7 + z * 13) & 3) === 0 ? 0.7 : 0;
  let snowY = null;
  if (inPod(x, z, 3.2 + ragged)) snowY = lowSE(x, z) ? -1 : 0;
  else if (bellD(x, z) <= 17) snowY = 0;
  else if (pd <= 40 && z >= -17) snowY = 0;                 // front plaza
  else if (Math.abs(x) <= 1 && z <= -17 && z >= -20) snowY = 0;   // approach path
  if (snowY === null) continue;
  put(x, snowY, z, SNOW);
  if (snowY === 0) {
    put(x, 1, z, AIR);
    if (lowN(x, z)) put(x, -1, z, SNOW);
  }
}

// ---------- 3. podium / gallery terrace ----------
function hiddenTop(x, z) {
  const dx = x - CX, dz = z - CZ;
  if (dx * dx + dz * dz <= 6.25) return true;
  for (const c of BIG) if (Math.abs(x - c.x) <= 1 && Math.abs(z - c.z) <= 1) return true;
  for (const c of SMALL) if (x === c.x && z === c.z) return true;
  return false;
}
for (let x = -16; x <= 16; x++) for (let z = -14; z <= 18; z++) {
  if (!inPod(x, z, 0)) continue;
  const edge = !inPod(x + 1, z, 0) || !inPod(x - 1, z, 0) || !inPod(x, z + 1, 0) || !inPod(x, z - 1, 0);
  if (!hiddenTop(x, z)) put(x, 2, z, SNOW);                 // snowed-over terrace
  if (edge) {
    put(x, 1, z, ((x + z) & 1) ? WHITE : BRICK);            // arcade rhythm
    put(x, 0, z, BRICK);
    if (lowSE(x, z) || lowN(x, z)) put(x, -1, z, COBBLE);   // foundation where ground dips
  }
}

// ---------- generic lathe: watertight shell of a solid of revolution ----------
function lathe(cx, cz, y0, radii, colorFn) {
  const ins = (dx, i, dz) => {
    if (i < 0) return true;
    if (i >= radii.length) return false;
    return dx * dx + dz * dz <= radii[i] * radii[i];
  };
  for (let i = 0; i < radii.length; i++) for (let dx = -5; dx <= 5; dx++) for (let dz = -5; dz <= 5; dz++) {
    if (!ins(dx, i, dz)) continue;
    if (ins(dx + 1, i, dz) && ins(dx - 1, i, dz) && ins(dx, i, dz + 1) && ins(dx, i, dz - 1) &&
        ins(dx, i + 1, dz) && ins(dx, i - 1, dz)) continue;
    const id = colorFn(dx, i, dz, Math.atan2(dz, dx));
    if (id !== null && id !== undefined) put(cx + dx, y0 + i, cz + dz, id);
  }
}
function domeColor(c, a, j, r) {
  if (r <= 0.6) return GOLD;
  const u = a / TAU + 1;
  let s;
  if (c.pat === 'spiral') s = Math.floor(u * 2 * c.n + j * c.tw * 0.5 + 0.5);   // twisting stripes
  else if (c.pat === 'ribs') s = Math.floor(u * 2 * c.n + 0.5);                  // vertical ribs
  else s = Math.floor(u * 2 * c.n + 0.5) + j;                                    // pineapple studs
  return mod2(s) ? c.c1 : c.c2;
}
function cross(x, y, z) {                                   // arms run east-west, read from the north
  put(x, y, z, GOLD); put(x - 1, y, z, GOLD); put(x + 1, y, z, GOLD); put(x, y + 1, z, GOLD);
}

// ---------- 4. big cardinal chapels with onion domes ----------
const BIG_DOME = [2.5, 3.5, 3.7, 3.7, 3.5, 2.9, 2.3, 1.5, 1.0, 0.5];
for (const c of BIG) {
  const radii = [2.9];
  for (let i = 0; i < c.hs; i++) radii.push(2.5);
  const iCor = radii.length; radii.push(3.2);
  const iKok = radii.length; radii.push(2.9);
  const iDrum = radii.length; radii.push(2.0, 2.0);
  const iDome = radii.length;
  for (const r of BIG_DOME) radii.push(r);
  lathe(c.x, c.z, 3, radii, (dx, i, dz, a) => {
    const face = (dx === 0 || dz === 0);
    if (i >= iDome) return domeColor(c, a, i - iDome, radii[i]);
    if (i >= iDrum) return (i === iDrum) ? (face ? BLACK : WHITE) : c.acc;
    if (i === iKok) return ((dx + dz) & 1) ? WHITE : c.acc;  // kokoshnik gables
    if (i === iCor) return SNOW;                             // snow-laden cornice
    if (i === 0) return (Math.abs(dx) === 2 && Math.abs(dz) === 2) ? WHITE : BRICK;
    if (face && i === 3) return BLACK;
    if (face && i === 4) return GLOWSTONE;                   // warm lit window
    if (face && i === 5) return WHITE;                       // window hood
    if (i === iCor - 1) return WHITE;
    return BRICK;
  });
  cross(c.x, 3 + radii.length, c.z);
}

// ---------- 5. small diagonal chapels ----------
const SMALL_DOME = [2.0, 2.5, 2.5, 2.0, 1.5, 1.0, 0.5];
for (const c of SMALL) {
  const radii = [2.0];
  for (let i = 0; i < c.hs; i++) radii.push(1.5);
  const iCor = radii.length; radii.push(2.0);
  const iKok = radii.length; radii.push(2.0);
  const iDrum = radii.length; radii.push(1.5);
  const iDome = radii.length;
  for (const r of SMALL_DOME) radii.push(r);
  lathe(c.x, c.z, 3, radii, (dx, i, dz, a) => {
    const face = (dx === 0 || dz === 0);
    if (i >= iDome) return domeColor(c, a, i - iDome, radii[i]);
    if (i === iDrum) return face ? BLACK : WHITE;
    if (i === iKok) return face ? c.acc : WHITE;
    if (i === iCor) return SNOW;
    if (i === 0) return BRICK;
    if (face && i === 3) return (dz < 0) ? GLOWSTONE : BLACK;
    if (!face && (i === 1 || i === iCor - 1)) return WHITE;
    return BRICK;
  });
  cross(c.x, 3 + radii.length, c.z);
}

// ---------- 6. central tent-roofed tower ----------
{
  const radii = [];
  for (let i = 0; i < 11; i++) radii.push(3.5);            // y 3..13 shaft
  radii.push(4.2, 4.2, 3.7);                               // y 14..16 kokoshnik tiers
  radii.push(3.2, 3.2);                                    // y 17..18 lantern drum
  radii.push(3.7);                                         // y 19 snowy cornice
  radii.push(3.2, 2.9, 2.5, 2.5, 2.0, 2.0, 1.5, 1.5);      // y 20..27 tent
  radii.push(1.0);                                         // y 28 neck
  radii.push(1.5, 1.5, 1.0, 0.5);                          // y 29..32 gold onion
  lathe(CX, CZ, 3, radii, (dx, i, dz, a) => {
    const face = (dx === 0 || dz === 0);
    const sec = Math.floor((a / TAU + 1) * 8 + 0.5);
    if (i >= 26) return GOLD;
    if (i === 25) return WHITE;
    if (i >= 17) {                                         // striped tent roof
      if (mod2(sec) === 0) return BRICK;
      return (i & 1) ? GREEN : GOLD;
    }
    if (i === 16) return SNOW;
    if (i === 15) return mod2(sec) ? WHITE : BRICK;
    if (i === 14) return face ? GLOWSTONE : (mod2(sec) ? WHITE : BRICK);
    if (i === 13) return mod2(sec) ? GREEN : WHITE;
    if (i === 12) return mod2(sec + 1) ? RED : WHITE;
    if (i === 11) return WHITE;
    if (face && i === 7) return BLACK;
    if (face && i === 8) return GLOWSTONE;
    if (face && i === 9) return WHITE;
    if (Math.abs(dx) === Math.abs(dz)) return WHITE;       // corner pilasters
    if (i === 4) return WHITE;
    return BRICK;
  });
  put(CX - 1, 32, CZ, GOLD); put(CX + 1, 32, CZ, GOLD); put(CX, 33, CZ, GOLD);   // cross
}

// ---------- 7. bell tower (east side) ----------
{
  const radii = [2.9, 2.5, 2.5, 2.5, 2.5, 2.5,             // y 0..5 shaft
                 2.9,                                       // y 6 belt
                 2.5, 2.5, 2.5,                             // y 7..9 open belfry
                 3.2,                                       // y 10 snowy cornice
                 2.9, 2.5, 2.0, 2.0, 1.5, 1.5, 1.0,         // y 11..17 green tent
                 1.5, 1.0, 0.5];                            // y 18..20 gold onion
  lathe(BELL.x, BELL.z, 0, radii, (dx, i, dz, a) => {
    const face = (dx === 0 || dz === 0);
    if (i >= 18) return GOLD;
    if (i >= 11) return ((i & 1) && !face) ? LIME : GREEN;
    if (i === 10) return SNOW;
    if (i >= 7) return face ? null : (i === 9 ? WHITE : BRICK);   // belfry openings
    if (i === 6) return WHITE;
    if (face && i === 3) return GLOWSTONE;
    if (face && i === 4) return WHITE;
    if (i === 0) return COBBLE;
    return BRICK;
  });
  put(BELL.x, 9, BELL.z, IRON); put(BELL.x, 8, BELL.z, GOLD);        // the bell
  put(BELL.x, 7, BELL.z, GOLD); put(BELL.x - 1, 7, BELL.z, GOLD); put(BELL.x + 1, 7, BELL.z, GOLD);
  put(BELL.x, 7, BELL.z - 1, GOLD); put(BELL.x, 7, BELL.z + 1, GOLD);
  cross(BELL.x, radii.length, BELL.z);
}

// ---------- 8. front porch with tent roof + step ----------
{
  for (let x = -1; x <= 1; x++) put(x, 1, -11, STONE);
  for (const px of [-2, 2]) for (const pz of [-12, -10]) {
    for (let y = 1; y <= 4; y++) put(px, y, pz, y === 2 ? BRICK : WHITE);
  }
  for (let x = -3; x <= 3; x++) for (let z = -13; z <= -9; z++) {
    const ex = Math.abs(x), ez = Math.abs(z + 11);
    if (ex === 3 || ez === 2) put(x, 5, z, SNOW);                    // snowy eaves
    else if (ex === 2 || ez === 1) put(x, 6, z, GREEN);
  }
  for (let x = -1; x <= 1; x++) put(x, 7, -11, GREEN);
  put(0, 8, -11, GREEN); put(0, 9, -11, GOLD);
}

// ---------- 9. Kremlin wall backdrop with snow-capped merlons ----------
for (let x = -20; x <= 20; x++) {
  for (let y = -1; y <= 3; y++) put(x, y, 20, BRICK);
  if ((x & 1) === 0) { put(x, 4, 20, BRICK); put(x, 5, 20, SNOW); }
  else put(x, 4, 20, SNOW);
}

// ---------- 10. lamp posts ----------
for (const [lx, lz] of [[-4, -13], [4, -13], [-3, -18], [3, -18], [-11, -7], [11, -7]]) {
  put(lx, 1, lz, BLACK); put(lx, 2, lz, BLACK); put(lx, 3, lz, BLACK);
  put(lx, 4, lz, GLOWSTONE); put(lx, 5, lz, IRON);
}

// ---------- 11. snow-laden pines framing the scene ----------
function pine(x, z, tiers) {
  for (let y = 0; y <= 2; y++) put(x, y, z, OAK_LOG);
  for (let t = 0; t < tiers; t++) {
    const y = 2 + t;
    const r = (t % 2 === 0) ? Math.max(1, 2.3 - t * 0.35) : Math.max(0.5, 1.4 - t * 0.25);
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
      const d2 = dx * dx + dz * dz;
      if (d2 > r * r) continue;
      if (d2 === 0 && t < tiers - 1) { put(x, y, z, OAK_LOG); continue; }
      put(x + dx, y, z + dz, (d2 >= 4 || (t % 2 === 0 && d2 >= 2 && r < 2)) ? SNOW : LEAVES);
    }
  }
  put(x, 2 + tiers, z, SNOW);
}
pine(-16, -12, 6); pine(-13, -19, 5); pine(16, -13, 6); pine(17, -19, 5);

// ---------- 12. snow drifts + a snowman on the plaza ----------
for (const [sx, sz] of [[-3, -12], [3, -12], [-4, -11], [4, -11], [-10, -5], [10, -5], [-10, -4],
                        [-13, 3], [13, 0], [5, -13], [-6, -14], [12, -3]]) {
  put(sx, 1, sz, SNOW);
}
put(-5, 1, -16, SNOW); put(-5, 2, -16, SNOW); put(-5, 3, -16, BLACK); put(-5, 2, -17, ORANGE);

// ---------- emit: solids first (bottom-up), then carving AIR ----------
const all = [...M.values()];
const solids = all.filter(b => b[3] !== AIR).sort((p, q) => p[1] - q[1] || p[2] - q[2] || p[0] - q[0]);
for (const b of solids) block(b[0], b[1], b[2], b[3]);
for (const b of all) if (b[3] === AIR) block(b[0], b[1], b[2], b[3]);