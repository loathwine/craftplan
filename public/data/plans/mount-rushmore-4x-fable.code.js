// mount-rushmore-4x-fable — prompt:
// Mount Rushmore...

// Mount Rushmore — four presidents carved into a granite ridge, faces north (-Z)
// Layout: talus rubble slope at the base, sheer cliff wall, heads emerging from
// the rock at y11-24, snow-dusted summit ridge behind, pines below for scale.

let placed = 0;
const CAP = 3980;
function put(x, y, z, id) {
  if (placed >= CAP) return;
  block(x, y, z, id);
  placed++;
}
function hs(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 269.5 + z * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function rock(x, y, z) {
  return hs(x, y, z) < 0.18 ? COBBLE : STONE;
}
function ridgeH(x, z) {
  const base = z <= 4 ? 22 + (z - 2) : 24 - (z - 4) * 2.2;
  const r = 2 * Math.sin(x * 0.35 + 1) + 2 * hs(x, 0, z);
  const taper = 1 - 0.35 * (x / 22) * (x / 22);
  return Math.max(3, Math.round((base + r) * taper));
}

const HEADS = [
  { cx: -16, top: 24, f: -2, s: 'washington' },
  { cx: -6,  top: 23, f: -2, s: 'jefferson' },
  { cx: 4,   top: 22, f: -1, s: 'roosevelt' },   // recessed, like the real one
  { cx: 14,  top: 23, f: -2, s: 'lincoln' },
];
function headAt(x) {
  for (const H of HEADS) if (Math.abs(x - H.cx) <= 3) return H;
  return null;
}

// --- cliff wall behind the heads (z=1) ---
for (let x = -22; x <= 22; x++) {
  const wt = ridgeH(x, 2);
  const H = headAt(x);
  for (let y = 10; y <= wt; y++) {
    if (H && y >= H.top - 11 && y <= H.top) continue; // head occupies this span
    put(x, y, 1, y >= 26 && y >= wt - 1 ? SNOW : rock(x, y, 1));
  }
}

// --- the four heads ---
for (const H of HEADS) {
  const cx = H.cx, top = H.top, f = H.f;
  const eyeY = top - 4, mouthY = top - 9, chin = top - 11;

  // skull mass
  for (let x = cx - 3; x <= cx + 3; x++)
    for (let y = chin; y <= top; y++) {
      if (y === top && Math.abs(x - cx) === 3) continue; // rounded crown
      for (let z = f; z <= 0; z++) {
        const hair = y >= top - 1 || (y >= top - 3 && Math.abs(x - cx) === 3);
        put(x, y, z, hair ? COBBLE : rock(x, y, z));
      }
    }
  // crown cap
  for (let x = cx - 2; x <= cx + 2; x++)
    for (let z = f + 1; z <= 0; z++) put(x, top + 1, z, COBBLE);
  // brow ledge shading the eyes
  for (let x = cx - 3; x <= cx + 3; x++) put(x, eyeY + 1, f - 1, STONE);
  // carved eye sockets
  for (const dx of [-2, -1, 1, 2]) block(cx + dx, eyeY, f, AIR);
  // nose: bridge, base, protruding tip
  put(cx, eyeY - 1, f - 1, STONE);
  for (let x = cx - 1; x <= cx + 1; x++) {
    put(x, eyeY - 2, f - 1, STONE);
    put(x, eyeY - 3, f - 1, STONE);
    put(x, eyeY - 3, f - 2, STONE);
  }
  // mouth & per-president character
  if (H.s === 'roosevelt') {
    for (let x = cx - 2; x <= cx + 2; x++) put(x, mouthY, f - 1, COBBLE); // mustache
    put(cx, eyeY, f - 1, COBBLE);                                        // spectacle bridge
    for (const dx of [-2, -1, 1, 2]) put(cx + dx, eyeY - 1, f - 1, COBBLE); // rims
  } else {
    for (let x = cx - 1; x <= cx + 1; x++) block(x, mouthY, f, AIR);
  }
  if (H.s === 'lincoln')
    for (let x = cx - 2; x <= cx + 2; x++)
      for (let y = chin; y <= chin + 1; y++) put(x, y, f - 1, COBBLE); // beard
  if (H.s === 'jefferson')
    for (let x = cx - 1; x <= cx + 1; x++) put(x, top + 2, 0, COBBLE); // fuller hair
  if (H.s === 'washington') {
    put(cx - 3, top - 2, f - 1, COBBLE); // side hair rolls
    put(cx + 3, top - 2, f - 1, COBBLE);
  }
  // neck merging down into the cliff
  for (let x = cx - 2; x <= cx + 2; x++)
    for (let y = 8; y < chin; y++)
      for (let z = f; z <= 0; z++) put(x, y, z, rock(x, y, z));
}

// --- talus / rubble slope below the faces ---
for (let y = -2; y <= 9; y++) {
  const zf = Math.max(-6, Math.round(0.6 * Math.max(y, 0) - 6.2));
  const deep = y >= 6 ? 1 : 0;
  for (let x = -22; x <= 22; x++) {
    if (y <= 5 && Math.abs(x) > 17 && hs(x, y, 5) < (Math.abs(x) - 17) * 0.15) continue;
    for (let z = zf; z <= zf + deep; z++)
      put(x, y, z, hs(x, y, z) < 0.3 ? COBBLE : STONE);
  }
}

// --- mountain mass behind the cliff (exposed-surface shell) ---
for (let z = 2; z <= 11; z++)
  for (let x = -22; x <= 22; x++) {
    const h = ridgeH(x, z);
    const nL = x === -22 ? 0 : ridgeH(x - 1, z);
    const nR = x === 22 ? 0 : ridgeH(x + 1, z);
    const nF = z === 2 ? h : ridgeH(x, z - 1);
    const nB = z === 11 ? 2 : ridgeH(x, z + 1);
    let bottom = Math.min(h, Math.min(nL, nR, nF, nB) + 1);
    bottom = Math.max(bottom, h - 14, 2);
    for (let y = bottom; y <= h; y++) {
      let id = rock(x, y, z);
      if (y >= 26 && y >= h - 1) id = SNOW;                 // summit dusting
      else if (y === h && h <= 9 && z >= 9) id = GRASS;     // green lower back slopes
      put(x, y, z, id);
    }
  }

// --- pines and boulders at the base for scale ---
const PINES = [[-20, -8], [-12, -7], [-2, -9], [7, -8], [12, -11], [18, -8]];
for (const P of PINES) {
  const tx = P[0], tz = P[1];
  for (let y = -1; y <= 2; y++) put(tx, y, tz, OAK_LOG);
  const CANOPY = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
  for (const C of CANOPY) {
    put(tx + C[0], 3, tz + C[1], LEAVES);
    put(tx + C[0], 4, tz + C[1], LEAVES);
  }
  put(tx, 5, tz, LEAVES);
}
const BOULDERS = [[-9, -9], [1, -11], [16, -9], [-17, -10]];
for (const B of BOULDERS) {
  put(B[0], -1, B[1], COBBLE);
  put(B[0], 0, B[1], COBBLE);
  put(B[0] + 1, -1, B[1], COBBLE);
  put(B[0], -1, B[1] + 1, STONE);
}