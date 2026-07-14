// ferris-wheel-4x-fable — prompt:
// a Ferris wheel...

const placed = new Set();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  const k = x + ',' + y + ',' + z;
  if (placed.has(k)) return;
  placed.add(k);
  block(x, y, z, id);
}
function seg(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) {
    put(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, z1 + (z2 - z1) * i / n, id);
  }
}

// ---- site clearing (targeted: wheel volume + plaza/path) ----
cube(-17, 0, -6, 17, 31, 6, AIR);      // wheel + supports corridor
cube(-15, 0, -16, 8, 10, -4, AIR);     // plaza, booth, path approach

const CX = 0, CY = 17, R = 13;

// ---- wheel rims (double ring, front z=-1 / back z=+1) ----
for (let a = 0; a < Math.PI * 2; a += 0.01) {
  const px = CX + R * Math.cos(a), py = CY + R * Math.sin(a);
  put(px, py, -1, COBBLE);
  put(px, py, 1, COBBLE);
}
// cross-ties + carnival light bulbs every 15 degrees
for (let i = 0; i < 24; i++) {
  const a = i * Math.PI / 12;
  put(CX + R * Math.cos(a), CY + R * Math.sin(a), 0, COBBLE);
  put(CX + (R + 1) * Math.cos(a), CY + (R + 1) * Math.sin(a), 0, SNOW);
}

// ---- spokes (12, both planes) + inner decorative ring ----
for (let i = 0; i < 12; i++) {
  const a = -Math.PI / 2 + i * Math.PI / 6;
  const px = CX + R * Math.cos(a), py = CY + R * Math.sin(a);
  seg(CX, CY, -1, px, py, -1, STONE);
  seg(CX, CY, 1, px, py, 1, STONE);
  // mid-spoke light
  put(CX + R * 0.5 * Math.cos(a), CY + R * 0.5 * Math.sin(a), -1, SNOW);
}
for (let a = 0; a < Math.PI * 2; a += 0.03) {
  put(CX + 4 * Math.cos(a), CY + 4 * Math.sin(a), -1, PLANKS);
  put(CX + 4 * Math.cos(a), CY + 4 * Math.sin(a), 1, PLANKS);
}

// ---- hub + axle ----
for (let x = -1; x <= 1; x++)
  for (let y = CY - 1; y <= CY + 1; y++)
    for (let z = -2; z <= 2; z++) put(x, y, z, STONE);
put(0, CY, -3, SNOW); // hub cap facing camera

// ---- gondolas (12, color cycle) ----
const CABIN = [BRICK, ICE, SNOW, GLASS];
for (let i = 0; i < 12; i++) {
  const a = -Math.PI / 2 + i * Math.PI / 6;
  const px = Math.round(CX + R * Math.cos(a));
  const py = Math.round(CY + R * Math.sin(a));
  const col = CABIN[i % 4];
  // hanger arm
  for (let z = -1; z <= 1; z++) put(px, py - 1, z, STONE);
  // roof
  for (let x = px - 1; x <= px + 1; x++)
    for (let z = -1; z <= 1; z++) put(x, py - 2, z, col);
  // walls: planks corners, glass mid-edges (window band)
  for (let x = px - 1; x <= px + 1; x++)
    for (let z = -1; z <= 1; z++) {
      if (x === px && z === 0) continue;
      const mid = (x === px || z === 0);
      put(x, py - 3, z, mid ? GLASS : PLANKS);
    }
  // floor
  for (let x = px - 1; x <= px + 1; x++)
    for (let z = -1; z <= 1; z++) put(x, py - 4, z, PLANKS);
}

// ---- A-frame supports (planes z=-2 and z=+2) ----
for (const zc of [-2, 2]) {
  seg(9, -1, zc, 1, CY, zc, STONE);
  seg(-9, -1, zc, -1, CY, zc, STONE);
  seg(-5, 8, zc, 5, 8, zc, BRICK);          // horizontal brace
  seg(-3, 12, zc, 3, 12, zc, BRICK);        // upper brace
}
seg(5, 8, -2, 5, 8, 2, STONE);              // depth ties between planes
seg(-5, 8, -2, -5, 8, 2, STONE);
// foundation pads
for (const fx of [-9, 9])
  for (const fz of [-2, 2])
    for (let x = fx - 1; x <= fx + 1; x++)
      for (let z = fz - 1; z <= fz + 1; z++)
        for (let y = -2; y <= -1; y++) put(x, y, z, COBBLE);

// ---- loading platform + foundation ----
for (let x = -7; x <= 7; x++)
  for (let z = -4; z <= 4; z++) {
    const edge = (Math.abs(x) === 7 || Math.abs(z) === 4);
    put(x, 0, z, edge ? COBBLE : PLANKS);
    put(x, -1, z, COBBLE);
  }
// fence around platform, gap at north center for entry
for (let x = -7; x <= 7; x++)
  for (const z of [-4, 4]) {
    if (z === -4 && Math.abs(x) <= 2) continue;
    put(x, 1, z, x % 3 === 0 ? OAK_LOG : PLANKS);
  }
for (let z = -3; z <= 3; z++)
  for (const x of [-7, 7]) put(x, 1, z, z % 3 === 0 ? OAK_LOG : PLANKS);

// ---- entry path north toward camera ----
for (let z = -16; z <= -5; z++)
  for (let x = -1; x <= 1; x++) put(x, 0, z, COBBLE);
// hedges flanking the path
for (let z = -15; z <= -6; z++) {
  put(-3, 0, z, LEAVES);
  put(3, 0, z, LEAVES);
}

// ---- ticket booth (west of path, window facing north) ----
for (let x = -13; x <= -9; x++)
  for (let z = -9; z <= -5; z++) put(x, 0, z, PLANKS);      // floor
for (let y = 1; y <= 3; y++)
  for (let x = -13; x <= -9; x++)
    for (let z = -9; z <= -5; z++) {
      const perim = (x === -13 || x === -9 || z === -9 || z === -5);
      if (!perim) continue;
      put(x, y, z, PLANKS);
    }
// north-facing serving window
cube(-12, 2, -9, -10, 2, -9, AIR);
for (let x = -12; x <= -10; x++) put(x, 2, -9, GLASS);
// east door opening toward path
cube(-9, 1, -7, -9, 2, -7, AIR);
// striped awning roof
for (let x = -14; x <= -8; x++)
  for (let z = -10; z <= -4; z++) put(x, 4, z, (x + z) % 2 === 0 ? BRICK : SNOW);
for (let x = -12; x <= -10; x++)
  for (let z = -8; z <= -6; z++) put(x, 5, z, BRICK);
put(-11, 6, -7, SNOW);

// ---- lamp posts ----
for (const [lx, lz] of [[5, -6], [-5, -6], [5, -15], [-5, -15], [8, 5], [-8, 5]]) {
  for (let y = 1; y <= 3; y++) put(lx, y, lz, OAK_LOG);
  put(lx, 4, lz, SNOW);
}

// ---- flag on top of the wheel ----
seg(0, 31, 0, 0, 32, 0, OAK_LOG);
seg(1, 32, 0, 3, 32, 0, BRICK);
seg(1, 31, 0, 2, 31, 0, BRICK);