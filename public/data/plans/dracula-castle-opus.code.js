// dracula-castle-opus — prompt:
// Dracula's castle on a cliff...

// Dracula's castle on a sheer cliff, front facing north (-Z)
const T = 8;          // cliff plateau top
const B = T + 1;      // castle ground level

function hsh(a, b, c) {
  const s = Math.sin(a * 127.1 + b * 311.7 + (c || 0) * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hsh(xi, yi), b = hsh(xi + 1, yi), c = hsh(xi, yi + 1), d = hsh(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function stoneMix(x, y, z) {
  const h = hsh(x, y, z);
  return h < 0.5 ? GRAY : h < 0.8 ? STONE : h < 0.93 ? COBBLE : LIGHT_GRAY;
}

// ---------- clear the forest in front so the cliff reads ----------
cube(-16, 1, -22, 16, 9, -7, AIR);

// ---------- the cliff (exposed shell only) ----------
const CX = 0, CZ = 3.5, AX = 11.5, AZ = 9.5;
function inside(x, y, z) {
  if (y < 0) return true;
  if (y > T) return false;
  const dx = (x - CX) / AX, dz = (z - CZ) / AZ;
  const ang = Math.atan2(dz, dx);
  const r = Math.pow(Math.pow(Math.abs(dx), 4) + Math.pow(Math.abs(dz), 4), 0.25);
  const flare = 1 + (T - y) * 0.01;
  const n = 1 + 0.2 * (vnoise(ang * 3.2 + 7, y * 0.4) - 0.5);
  if (r < flare * n) return true;
  // rocky spur jutting north under the east tower
  const sx = x - 10.5, sz = z + 6.5;
  if (sx * sx + sz * sz < 3.2 * 3.2 * (1 + (T - y) * 0.03)) return true;
  // lower ledge on the west face
  const lx = x + 9, lz = z + 6;
  if (y <= T - 4 && lx * lx + lz * lz < 2.8 * 2.8 * (1 + (T - 4 - y) * 0.05)) return true;
  return false;
}
for (let x = -22; x <= 22; x++)
  for (let z = -22; z <= 22; z++)
    for (let y = 0; y <= T; y++) {
      if (!inside(x, y, z)) continue;
      if (y === T && x > -5 && x < 5 && z > 3 && z < 10) continue; // hidden under the keep
      const up = inside(x, y + 1, z);
      const exposed = !up || !inside(x + 1, y, z) || !inside(x - 1, y, z) ||
                      !inside(x, y, z + 1) || !inside(x, y, z - 1);
      if (!exposed) continue;
      let id;
      if (!up) {
        const h = hsh(x, y, z);
        id = y === T ? (h < 0.45 ? COBBLE : h < 0.75 ? DIRT : GRASS) : (h < 0.5 ? GRASS : DIRT);
      } else {
        const h = hsh(x, y * 3, z);
        id = h < 0.08 ? BLACK : (y % 4 === 1 ? GRAY : h < 0.6 ? STONE : h < 0.85 ? GRAY : COBBLE);
      }
      block(x, y, z, id);
    }

// stair path climbing the east face, with torches
for (let i = 0; i <= T; i++) {
  const y = i, z = -1 + Math.round(i * 1.4);
  let ex = 0;
  for (let x = 22; x >= 0; x--) if (inside(x, y, z)) { ex = x; break; }
  block(ex + 1, y, z, COBBLE);
  block(ex + 1, y, z + 1, COBBLE);
  if (i === 3 || i === 7) block(ex + 2, y + 1, z, FIRE);
  else if (i % 2 === 0) block(ex + 2, y + 1, z, IRON);
}

// ---------- helpers ----------
function ring(cx, y, cz, r, id) {
  const ri = Math.ceil(r);
  for (let dx = -ri; dx <= ri; dx++)
    for (let dz = -ri; dz <= ri; dz++) {
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d >= r - 0.75 && d <= r + 0.25)
        block(cx + dx, y, cz + dz, id === 'mix' ? stoneMix(cx + dx, y, cz + dz) : id);
    }
}
function cone(cx, y0, cz, r, h, tip) {
  for (let i = 0; i < h; i++) {
    const rr = r * (1 - i / h);
    const id = i % 3 === 2 ? BLACK : OBSIDIAN;
    if (rr < 0.6) block(cx, y0 + i, cz, id);
    else { ring(cx, y0 + i, cz, rr, id); if (rr < 1.6) block(cx, y0 + i, cz, id); }
  }
  block(cx, y0 + h, cz, tip);
  block(cx, y0 + h + 1, cz, tip);
}
function tower(cx, cz, r, y0, h, roofH, windows) {
  for (let y = y0; y < y0 + h; y++) ring(cx, y, cz, r, 'mix');
  ring(cx, y0 + h - 1, cz, r + 1, GRAY);           // corbelled machicolation
  cone(cx, y0 + h, cz, r + 1.3, roofH, IRON);
  const fz = cz - Math.round(r);
  for (const wy of windows || []) {
    const id = wy % 2 ? GLOWSTONE : BLACK;
    block(cx, wy, fz, id);
    block(cx, wy + 1, fz, id);
  }
}
function wall(x1, z1, x2, z2, y0, h, crenel) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(z2 - z1));
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x1 + (x2 - x1) * i / n), z = Math.round(z1 + (z2 - z1) * i / n);
    for (let y = y0; y < y0 + h; y++) block(x, y, z, stoneMix(x, y, z));
    if (crenel && i % 2 === 0) block(x, y0 + h, z, STONE);
  }
}

// ---------- curtain walls ----------
wall(-8, -3, 8, -3, B, 5, true);
wall(8, -3, 9, -4, B, 5, false);
wall(-8, -3, -8, 11, B, 4, true);
wall(8, -3, 8, 11, B, 4, true);
wall(-8, 11, 8, 11, B, 4, true);

// spur tower hanging over the cliff edge, and the west corner tower
tower(10, -6, 2, B - 2, 11, 6, [B + 3, B + 6]);
tower(-8, -2, 2, B, 9, 6, [B + 4]);

// ---------- gatehouse ----------
wall(-2, -3, 2, -3, B, 8, false);
for (let x = -2; x <= 2; x += 2) block(x, B + 8, -3, STONE);
tower(-3, -4, 1.5, B, 9, 5, [B + 5]);
tower(3, -4, 1.5, B, 9, 5, [B + 5]);
cube(-1, B, -3, 1, B + 2, -3, AIR);
block(0, B + 3, -3, AIR);
// half-raised portcullis
cube(-1, B + 2, -2, 1, B + 3, -2, IRON);
block(-1, B + 1, -2, IRON); block(0, B + 1, -2, IRON); block(1, B + 1, -2, IRON);
// braziers
block(-5, B, -4, COBBLE); block(5, B, -4, COBBLE);
block(-5, B + 1, -4, FIRE); block(5, B + 1, -4, FIRE);
// banners on the front wall
for (const bx of [-6, 6]) {
  for (let y = B + 1; y <= B + 4; y++) block(bx, y, -4, RED);
  block(bx, B + 1, -4, BLACK);
  block(bx, B + 3, -4, BLACK);
}

// ---------- the great keep ----------
const KX = 5, KZ0 = 3, KZ1 = 10, KH = 10;
for (let y = B; y < B + KH; y++) {
  for (let x = -KX; x <= KX; x++) { block(x, y, KZ0, stoneMix(x, y, KZ0)); block(x, y, KZ1, stoneMix(x, y, KZ1)); }
  for (let z = KZ0 + 1; z < KZ1; z++) { block(-KX, y, z, stoneMix(-KX, y, z)); block(KX, y, z, stoneMix(KX, y, z)); }
}
for (let x = -KX - 1; x <= KX + 1; x++) block(x, B + 5, KZ0 - 1, LIGHT_GRAY); // string course
// steep gable roof running north-south
for (let k = 0; k <= 6; k++) {
  const y = B + KH + k;
  const id = k % 2 ? BLACK : OBSIDIAN;
  for (let z = KZ0 - 1; z <= KZ1 + 1; z++) {
    block(-KX - 1 + k, y, z, id);
    block(KX + 1 - k, y, z, id);
  }
  for (let x = -KX + k; x <= KX - k; x++) {
    block(x, y, KZ0, stoneMix(x, y, KZ0));
    block(x, y, KZ1, stoneMix(x, y, KZ1));
  }
}
for (let z = KZ0 - 1; z <= KZ1 + 1; z += 2) block(0, B + KH + 6, z, IRON); // ridge cresting
// blood-red rose window on the north gable
for (let dx = -2; dx <= 2; dx++)
  for (let dy = -2; dy <= 2; dy++) {
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d <= 2.3)
      block(dx, B + KH + 2 + dy, KZ0,
        d < 0.8 ? GOLD : (Math.abs(dx) === Math.abs(dy) || dx === 0 || dy === 0) ? BLACK : NEON_RED);
  }
// lancet windows
for (const wx of [-2, 2]) {
  for (let y = B + 6; y <= B + 9; y++) block(wx, y, KZ0, y === B + 9 ? BLACK : wx > 0 ? GLOWSTONE : BLACK);
}
for (const wz of [5, 7]) {
  for (let y = B + 6; y <= B + 8; y++) {
    block(-KX, y, wz, wz === 7 ? GLOWSTONE : BLACK);
    block(KX, y, wz, wz === 5 ? NEON_RED : BLACK);
  }
}
// tall red banners
for (const bx of [-4, 4]) {
  for (let y = B + 3; y <= B + 8; y++) block(bx, y, KZ0 - 1, RED);
  block(bx, B + 2, KZ0 - 1, BLACK);
  block(bx, B + 9, KZ0 - 1, GOLD);
}
// buttresses
for (const bz of [5, 8]) for (const s of [-1, 1]) {
  for (let y = B; y <= B + 6; y++) block(s * (KX + 1), y, bz, COBBLE);
  block(s * (KX + 1), B + 7, bz, OBSIDIAN);
}
// grand door
cube(-1, B, KZ0, 1, B + 2, KZ0, AIR);
block(0, B + 3, KZ0, AIR);
cube(-1, B, KZ0 + 1, 1, B + 2, KZ0 + 1, BROWN);
block(0, B + 3, KZ0 + 1, BROWN);

// ---------- Dracula's tower: tallest spire ----------
tower(6, 9, 2, B, 17, 6, [B + 5, B + 8]);
for (let x = 5; x <= 7; x++) block(x, B + 12, 6, COBBLE);   // balcony
block(5, B + 13, 6, IRON); block(7, B + 13, 6, IRON);
block(6, B + 13, 7, NEON_RED); block(6, B + 14, 7, NEON_RED); // glowing doorway

// slender corbelled turret on the keep's NW corner
ring(-5, B + KH - 2, 3, 1.5, GRAY);
for (let y = B + KH - 1; y < B + KH + 5; y++) ring(-5, y, 3, 1.5, 'mix');
block(-5, B + KH + 2, 2, GLOWSTONE);
cone(-5, B + KH + 5, 3, 2.3, 5, IRON);

// small west tower behind the keep
tower(-6, 10, 1.5, B, 11, 5, [B + 7]);

// courtyard lanterns
block(-6, B, 0, COBBLE); block(-6, B + 1, 0, GLOWSTONE);
block(6, B, 0, COBBLE); block(6, B + 1, 0, GLOWSTONE);

// ---------- bats ----------
const bats = [[-14, 24, -6], [-9, 29, -3], [2, 31, -1], [13, 27, -1], [16, 21, -9], [-16, 18, 1], [-3, 25, -8], [11, 31, 4], [-12, 28, 7]];
for (const [x, y, z] of bats) {
  block(x, y, z, BLACK);
  block(x - 1, y + 1, z, BLACK); block(x + 1, y + 1, z, BLACK);
  block(x - 2, y, z, BLACK); block(x + 2, y, z, BLACK);
}

// ---------- graveyard + dead trees at the cliff foot ----------
const graves = [[-9, -14], [-6, -15], [-3, -13], [-11, -11], [-7, -11], [4, -15], [7, -13]];
for (const [x, z] of graves) {
  block(x, 0, z, GRAY); block(x, 1, z, GRAY);
  if ((x + z) % 2 === 0) { block(x - 1, 1, z, GRAY); block(x + 1, 1, z, GRAY); block(x, 2, z, GRAY); }
  block(x, 0, z - 1, DIRT);
}
function deadTree(x, z, h) {
  for (let y = 0; y < h; y++) block(x, y, z, y < 3 ? OAK_LOG : BROWN);
  line(x, h - 2, z, x - 3, h + 1, z - 1, BROWN);
  line(x, h - 3, z, x + 3, h, z + 1, BROWN);
  line(x, h - 1, z, x + 1, h + 3, z - 2, BLACK);
  line(x - 2, h, z - 1, x - 3, h + 3, z - 1, BLACK);
}
deadTree(-15, -15, 7);
deadTree(14, -17, 6);
deadTree(-1, -18, 5);