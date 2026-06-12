// ruined-cathedral-fable — prompt:
// A MASSIVE ruined gothic cathedral, half-collapsed and overgrown. TOWERING central spire still standing against the sky, broken at the top in a jagged silhouette. Long nave with partially collapsed roo...

// ===== RUINED GOTHIC CATHEDRAL =====
// Viewer at -Z. Towering broken central spire x[-3..3] z[-17..-11] (jagged crown to y33),
// flanking towers x +-[7..11] z[-16..-12] (west standing, east collapsed),
// long nave x[-8..8] z[-11..20] with torn roof, bare rib vaults, flying buttresses,
// ivy, glass glints, debris field.

function h(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function mat(x, y, z) { return h(x, y, z) < 0.45 ? COBBLE : STONE; }
function mason(x, y, z) { block(x, y, z, mat(x, y, z)); }
function banded(x, y, z) { block(x, y, z, y % 6 === 0 ? BRICK : mat(x, y, z)); }

function rubblePile(cx, cz, r) {
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
    const d = Math.sqrt(dx * dx + dz * dz);
    const x = cx + dx, z = cz + dz;
    if (d > r + (h(x, 40, z) - 0.5)) continue;
    const m = h(x, 41, z);
    block(x, 1, z, m < 0.45 ? COBBLE : m < 0.8 ? STONE : BRICK);
    if (d < r - 1) mason(x, 2, z);
    if (d < r - 2) block(x, 3, z, COBBLE);
    if (h(x, 43, z) < 0.15) block(x, d < r - 1 ? 3 : 2, z, LEAVES);
  }
}

function ivy(x, z, hh, ax) {
  for (let y = 1; y <= hh; y++) {
    if (h(x, y, z) < 0.78) block(x, y, z, LEAVES);
    if (h(x, y + 50, z) < 0.3) {
      const o = h(x, y + 60, z) < 0.5 ? 1 : -1;
      if (ax === 0) block(x + o, y, z, LEAVES);
      else block(x, y, z + o, LEAVES);
    }
  }
}

// ---- paved plinth + overgrown weathered floor ----
for (let x = -13; x <= 13; x++) for (let z = -21; z <= 22; z++) {
  mason(x, -1, z);
  const r = h(x, 99, z);
  if (r < 0.08) continue;
  if (r < 0.2) { block(x, 0, z, GRASS); continue; }
  mason(x, 0, z);
}
for (let x = -7; x <= 7; x++) mason(x, -1, -22);

// ---- carve interiors + forecourt airspace (clears trees / stray ledge) ----
cube(-7, 1, -10, 7, 11, 19, AIR);
cube(-2, 1, -16, 2, 25, -12, AIR);
cube(-10, 1, -15, -8, 17, -13, AIR);
cube(8, 1, -15, 10, 11, -13, AIR);
cube(-13, 1, -21, 13, 6, -18, AIR);

// ---- crumbled boundary wall on plinth edge ----
for (let z = -21; z <= 22; z++) for (const sx of [-13, 13]) {
  if (h(sx, 1, z) < 0.55) mason(sx, 1, z);
  if (h(sx, 2, z) < 0.18) mason(sx, 2, z);
}
for (let x = -13; x <= 13; x++) {
  if (h(x, 1, 22) < 0.55) mason(x, 1, 22);
  if (h(x, 2, 22) < 0.18) mason(x, 2, 22);
}

// ---- nave walls: intact front, collapsing toward the rear; piers survive ----
const PIER = { 8: 1, 12: 1, 16: 1, 20: 1 };
function naveWall(wx, isEast) {
  for (let z = -11; z <= 20; z++) {
    let top;
    if (z <= 4 || PIER[z]) top = 13;
    else {
      top = Math.round(12 - ((z - 4) / 16) * 9 + (h(wx, 7, z) - 0.5) * 3);
      if (top < 2) top = 2;
    }
    if (isEast && z >= 9 && z <= 13 && !PIER[z]) top = 1 + Math.floor(h(wx, 8, z) * 2);
    for (let y = 1; y <= top; y++) {
      if (top < 13 && y >= top - 1 && h(wx, y, z) < 0.2) continue;
      banded(wx, y, z);
    }
    if (top < 12 && h(wx, 9, z) < 0.3) block(wx, top + 1, z, LEAVES);
  }
}
naveWall(-8, false);
naveWall(8, true);
for (let z = -10; z <= 4; z++) for (let y = 1; y <= 12; y++) { mason(-7, y, z); mason(7, y, z); }

// ---- arched nave windows: oak frames, surviving glass panes ----
const WIN = [[-9, -8], [-5, -4], [-1, 0], [3, 4]];
function naveWindows(wx, glaze) {
  const inner = wx > 0 ? wx - 1 : wx + 1;
  for (let i = 0; i < WIN.length; i++) {
    const z1 = WIN[i][0], z2 = WIN[i][1];
    for (let z = z1; z <= z2; z++) for (let y = 3; y <= 8; y++) {
      block(wx, y, z, AIR); block(inner, y, z, AIR);
    }
    block(wx, 9, z1, AIR); block(wx, 9, z2, AIR);
    for (let y = 2; y <= 9; y++) { block(wx, y, z1 - 1, OAK_LOG); block(wx, y, z2 + 1, OAK_LOG); }
    block(wx, 2, z1, OAK_LOG); block(wx, 2, z2, OAK_LOG);
    block(wx, 10, z1, OAK_LOG); block(wx, 10, z2, OAK_LOG);
    const g = glaze[i];
    if (g > 0) for (let z = z1; z <= z2; z++)
      for (let y = 3; y <= (g === 2 ? 8 : 5); y++)
        if (h(wx, y * 3, z) < 0.82) block(wx, y, z, GLASS);
  }
}
naveWindows(-8, [2, 0, 1, 0]);
naveWindows(8, [0, 1, 0, 2]);

// ---- facade walls between spire and towers, with gables and lancets ----
for (const s of [1, -1]) {
  for (let x = 4; x <= 8; x++) {
    for (let y = 1; y <= 13; y++) banded(s * x, y, -11);
    const gt = 13 + Math.floor((8 - x) * 0.75);
    for (let y = 14; y <= gt; y++) mason(s * x, y, -11);
  }
  block(s * 6, 4, -11, AIR); block(s * 6, 5, -11, AIR); block(s * 6, 6, -11, AIR);
  block(s * 6, 3, -11, OAK_LOG); block(s * 6, 7, -11, OAK_LOG);
  block(s * 6, 5, -11, GLASS);
}

// ---- ruined rear wall: stubs of the great east window ----
const REART = [1, 1, 2, 2, 3, 9, 8, 7];
for (let x = -7; x <= 7; x++) {
  const top = REART[Math.abs(x)] + Math.floor(h(x, 21, 20) * 2);
  for (let y = 1; y <= top; y++) mason(x, y, 20);
}
mason(4, 10, 20); mason(5, 10, 20); mason(-4, 11, 20); mason(-5, 10, 20);
block(5, 11, 20, LEAVES); block(-4, 12, 20, LEAVES);

// ---- central spire ----
function spirePerim(fn) {
  for (let x = -3; x <= 3; x++) for (let z = -17; z <= -11; z++) {
    if (x > -3 && x < 3 && z > -17 && z < -11) continue;
    fn(x, z);
  }
}
spirePerim(function (x, z) {
  for (let y = 1; y <= 26; y++) banded(x, y, z);
});
for (let y = 1; y <= 25; y++) { mason(-2, y, -16); mason(2, y, -16); mason(-2, y, -12); mason(2, y, -12); }
// jagged broken crown against the sky
spirePerim(function (x, z) {
  let extra = Math.floor(h(x, 1, z) * h(x, 1, z) * 8);
  if ((x === -3 || x === 3) && (z === -17 || z === -11)) extra += 3;
  if (x === -3 && z === -17) extra = 7;
  for (let y = 27; y <= 26 + extra && y <= 33; y++) banded(x, y, z);
});
// entrance arch
cube(-1, 1, -17, 1, 4, -17, AIR); block(0, 5, -17, AIR);
for (let y = 1; y <= 5; y++) { block(-2, y, -17, OAK_LOG); block(2, y, -17, OAK_LOG); }
block(-1, 5, -17, OAK_LOG); block(1, 5, -17, OAK_LOG); block(0, 6, -17, OAK_LOG);
// rear door into the nave
cube(-1, 1, -11, 1, 4, -11, AIR); block(0, 5, -11, AIR);
// triple lancet over the door
for (let y = 9; y <= 14; y++) block(0, y, -17, AIR);
for (let y = 9; y <= 12; y++) { block(-2, y, -17, AIR); block(2, y, -17, AIR); }
for (let y = 9; y <= 13; y++) { block(-1, y, -17, OAK_LOG); block(1, y, -17, OAK_LOG); }
block(0, 8, -17, OAK_LOG); block(-2, 8, -17, OAK_LOG); block(2, 8, -17, OAK_LOG);
block(0, 9, -17, GLASS); block(0, 10, -17, GLASS); block(-2, 9, -17, GLASS); block(2, 10, -17, GLASS);
// broken rose window
cube(-1, 17, -17, 1, 19, -17, AIR);
for (let y = 17; y <= 19; y++) { block(-2, y, -17, OAK_LOG); block(2, y, -17, OAK_LOG); }
for (let x = -1; x <= 1; x++) { block(x, 16, -17, OAK_LOG); block(x, 20, -17, OAK_LOG); }
block(-1, 17, -17, GLASS); block(0, 18, -17, GLASS); block(1, 17, -17, GLASS); block(0, 19, -17, GLASS);
// side lancets
for (let y = 9; y <= 13; y++) { block(-3, y, -14, AIR); block(3, y, -14, AIR); }
block(-3, 8, -14, OAK_LOG); block(3, 8, -14, OAK_LOG);
block(-3, 14, -14, OAK_LOG); block(3, 14, -14, OAK_LOG);
block(-3, 9, -14, GLASS); block(3, 9, -14, GLASS); block(-3, 10, -14, GLASS);
// belfry openings
cube(-1, 22, -17, 1, 24, -17, AIR);
cube(-1, 22, -11, 1, 24, -11, AIR);
cube(-3, 22, -15, -3, 24, -13, AIR);
cube(3, 22, -15, 3, 24, -13, AIR);
// stepped piers flanking the entrance
for (let y = 1; y <= 9; y++) { mason(-4, y, -18); mason(4, y, -18); }
for (let y = 1; y <= 12; y++) { mason(-4, y, -17); mason(4, y, -17); }

// ---- west tower (still standing) ----
for (let x = -11; x <= -7; x++) for (let z = -16; z <= -12; z++) {
  if (x > -11 && x < -7 && z > -16 && z < -12) continue;
  for (let y = 1; y <= 18; y++) {
    if (y >= 17 && h(x, y, z) < 0.12) continue;
    banded(x, y, z);
  }
}
const MERL = [[-11, -16], [-11, -14], [-11, -12], [-9, -16], [-9, -12], [-7, -16], [-7, -14], [-7, -12]];
for (let i = 0; i < MERL.length; i++) {
  mason(MERL[i][0], 19, MERL[i][1]);
  if (h(MERL[i][0], 19, MERL[i][1]) < 0.5) mason(MERL[i][0], 20, MERL[i][1]);
}
block(-9, 4, -16, AIR); block(-9, 5, -16, AIR); block(-9, 6, -16, AIR);
block(-9, 3, -16, OAK_LOG); block(-9, 7, -16, OAK_LOG); block(-9, 5, -16, GLASS);
block(-9, 10, -16, AIR); block(-9, 11, -16, AIR); block(-9, 12, -16, AIR);
block(-9, 9, -16, OAK_LOG); block(-9, 13, -16, OAK_LOG); block(-9, 11, -16, GLASS);
block(-11, 8, -14, AIR); block(-11, 9, -14, AIR);

// ---- east tower (collapsed on its outer side) ----
for (let x = 7; x <= 11; x++) for (let z = -16; z <= -12; z++) {
  if (x > 7 && x < 11 && z > -16 && z < -12) continue;
  let top = 11 + Math.round((h(x, 3, z) - 0.5) * 4);
  if (x >= 10 || z === -12) top = 4 + Math.floor(h(x, 5, z) * 3);
  for (let y = 1; y <= top; y++) {
    if (y >= top - 1 && h(x, y, z) < 0.25) continue;
    banded(x, y, z);
  }
  if (h(x, 77, z) < 0.35) block(x, top + 1, z, LEAVES);
}
block(9, 4, -16, AIR); block(9, 5, -16, AIR); block(9, 6, -16, AIR);
block(9, 3, -16, OAK_LOG); block(9, 7, -16, OAK_LOG);
rubblePile(13, -10, 3);
rubblePile(12, -14, 2);

// ---- brick roof over the front half, torn open toward the rear ----
function roofY(x) { return 13 + Math.floor((8 - Math.abs(x)) * 0.75); }
for (let z = -10; z <= 4; z++) for (let x = -8; x <= 8; x++) {
  const y = roofY(x);
  if (h(x, y, z) < 0.05 + (z + 10) * 0.025) continue;
  const m = h(x, 55, z);
  block(x, y, z, m < 0.75 ? BRICK : m < 0.9 ? STONE : COBBLE);
}
// exposed rafters where the roof fell away
line(-8, 13, 5, 0, 19, 5, OAK_LOG);
line(8, 13, 6, 0, 19, 6, OAK_LOG);
line(-8, 13, 7, -3, 17, 7, OAK_LOG);

// ---- bare rib vaults open to the sky ----
function rib(z, mode) {
  for (let x = -8; x <= 8; x++) {
    if (mode === 1 && Math.abs(x) < 3) continue;
    if (mode === 2 && Math.abs(x) < 6) continue;
    const y = 13 + Math.floor((1 - (x / 8) * (x / 8)) * 6);
    mason(x, y, z);
    if (Math.abs(x) >= 6) mason(x, y - 1, z);
  }
}
rib(8, 0); rib(12, 1); rib(16, 2); rib(20, 0);

// ---- flying buttresses ----
const BUTTZ = [-8, -3, 2, 8, 12, 16, 20];
const BROKEN = { '1,2': 1, '-1,12': 1, '1,16': 1 };
for (const s of [1, -1]) for (let i = 0; i < BUTTZ.length; i++) {
  const z = BUTTZ[i];
  const broken = BROKEN[s + ',' + z];
  for (let y = 1; y <= (broken ? 5 : 10); y++) mason(s * 9, y, z);
  if (!broken) {
    for (let y = 1; y <= 9; y++) mason(s * 11, y, z);
    mason(s * 11, 10, z);
    mason(s * 10, 9, z); mason(s * 10, 10, z);
    mason(s * 9, 11, z); mason(s * 9, 12, z);
    block(s * 11, 11, z, COBBLE);
  } else {
    for (let y = 1; y <= 4; y++) mason(s * 11, y, z);
    rubblePile(s * 10, z + 1, 1);
  }
}

// ---- interior arcade: standing columns, broken stumps, one toppled ----
const COLZ = [-7, -3, 1, 5, 9, 13, 17];
for (const s of [1, -1]) for (let i = 0; i < COLZ.length; i++) {
  const z = COLZ[i], x = s * 4;
  if (z <= 1) {
    for (let y = 1; y <= 11; y++) mason(x, y, z);
    block(x - 1, 11, z, STONE); block(x + 1, 11, z, STONE);
    block(x, 11, z - 1, STONE); block(x, 11, z + 1, STONE);
    block(x, 12, z, STONE);
  } else if (s === 1 && z === 13) {
    mason(x, 1, z); mason(x, 2, z);
    block(5, 1, 13, STONE); block(6, 1, 13, COBBLE);
    block(6, 1, 14, STONE); block(7, 1, 14, COBBLE);
    block(7, 2, 14, STONE);
  } else {
    const bh = 2 + Math.floor(h(x, 13, z) * 5);
    for (let y = 1; y <= bh; y++) mason(x, y, z);
    if (h(x, 14, z) < 0.4) block(x, bh + 1, z, LEAVES);
    block(x + s, 1, z + 1, COBBLE);
  }
}
line(-4, 12, -7, -4, 12, 1, OAK_LOG);
line(4, 12, -7, 4, 12, 1, OAK_LOG);

// ---- ruined altar ----
for (let x = -3; x <= 3; x++) for (let z = 17; z <= 19; z++) if (h(x, 30, z) < 0.85) mason(x, 1, z);
block(0, 2, 18, STONE); block(1, 2, 18, STONE); block(0, 3, 18, COBBLE);

// ---- collapse debris ----
rubblePile(-3, 8, 2); rubblePile(2, 11, 2); rubblePile(-1, 16, 3);
rubblePile(4, 18, 1); rubblePile(-5, 13, 1); rubblePile(10, 11, 2);
for (let i = 0; i < 40; i++) {
  const x = Math.floor(h(i, 1, 7) * 13) - 6;
  const z = 5 + Math.floor(h(i, 2, 9) * 15);
  if (h(i, 3, 11) < 0.7) block(x, 1, z, h(i, 4, 13) < 0.5 ? COBBLE : BRICK);
}
for (let i = 0; i < 14; i++) {
  const x = -10 + Math.floor(h(i, 5, 3) * 21);
  const z = -20 + Math.floor(h(i, 6, 3) * 3);
  if (h(i, 7, 3) < 0.6) block(x, 1, z, COBBLE);
}

// ---- ivy creeping up the walls ----
ivy(-9, -6, 9, 1); ivy(-9, 0, 11, 1); ivy(-9, 5, 8, 1); ivy(-9, 10, 6, 1); ivy(-9, 14, 5, 1); ivy(-9, 18, 4, 1);
ivy(9, -5, 10, 1); ivy(9, 4, 7, 1); ivy(9, 15, 4, 1); ivy(9, 19, 3, 1);
ivy(-3, -18, 13, 0); ivy(2, -18, 9, 0);
ivy(-4, -14, 11, 1); ivy(4, -16, 8, 1);
ivy(-12, -14, 9, 1); ivy(-9, -17, 7, 0);
ivy(8, -17, 6, 0); ivy(12, -14, 5, 1);
ivy(-7, 8, 6, 1); ivy(7, 16, 5, 1);
ivy(-2, 19, 4, 0); ivy(5, 19, 5, 0);

// ---- churchyard: leaning headstones + ruined cloister arch ----
for (const z of [3, 7, 10, 14, 18]) {
  block(-12, 1, z, STONE);
  if (h(12, 1, z) < 0.7) block(-12, 2, z, COBBLE);
}
for (let y = 1; y <= 6; y++) mason(12, y, -19);
for (let y = 1; y <= 3; y++) mason(16, y, -19);
mason(12, 7, -19); mason(13, 7, -19); mason(14, 8, -19);
block(13, 8, -19, LEAVES); block(15, 1, -19, COBBLE); block(14, 1, -19, COBBLE);