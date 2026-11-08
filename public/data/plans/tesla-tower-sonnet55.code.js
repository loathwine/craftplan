// tesla-tower-sonnet55 — prompt:
// a steampunk Tesla coil tower crackling with lightning...

const PI = Math.PI;

function fill(cy, r, id, cx = 0, cz = 0) {
  const R = Math.ceil(r) + 1;
  for (let x = -R; x <= R; x++) for (let z = -R; z <= R; z++) {
    if (Math.sqrt(x * x + z * z) < r + 0.5) block(cx + x, cy, cz + z, id);
  }
}
function ring(cy, r, id, cx = 0, cz = 0) {
  const R = Math.ceil(r) + 1;
  for (let x = -R; x <= R; x++) for (let z = -R; z <= R; z++) {
    const d = Math.sqrt(x * x + z * z);
    if (d >= r - 0.5 && d < r + 0.5) block(cx + x, cy, cz + z, id);
  }
}
function wall(r, y1, y2, fn) {
  const R = Math.ceil(r) + 1;
  for (let y = y1; y <= y2; y++) for (let x = -R; x <= R; x++) for (let z = -R; z <= R; z++) {
    const d = Math.sqrt(x * x + z * z);
    if (d >= r - 0.5 && d < r + 0.5) {
      const id = fn(x, z, y);
      if (id !== null) block(x, y, z, id);
    }
  }
}
function boxWalls(x1, y1, z1, x2, y2, z2, id) {
  for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) for (let z = z1; z <= z2; z++) {
    if (x === x1 || x === x2 || z === z1 || z === z2) block(x, y, z, id);
  }
}
function gearXY(cx, cy, cz, r) {
  for (let dx = -r - 1; dx <= r + 1; dx++) for (let dy = -r - 1; dy <= r + 1; dy++) {
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d >= r - 0.5 && d < r + 0.5) block(cx + dx, cy + dy, cz, GOLD);
  }
  line(cx - r, cy, cz, cx + r, cy, cz, COPPER);
  line(cx, cy - r, cz, cx, cy + r, cz, COPPER);
  for (let k = 0; k < 8; k++) {
    const a = k * PI / 4;
    block(Math.round(cx + (r + 1) * Math.cos(a)), Math.round(cy + (r + 1) * Math.sin(a)), cz, COPPER);
  }
  block(cx, cy, cz, IRON);
  block(cx, cy, cz + 1, IRON);
}
function gearYZ(cx, cy, cz, r) {
  for (let dz = -r - 1; dz <= r + 1; dz++) for (let dy = -r - 1; dy <= r + 1; dy++) {
    const d = Math.sqrt(dz * dz + dy * dy);
    if (d >= r - 0.5 && d < r + 0.5) block(cx, cy + dy, cz + dz, GOLD);
  }
  line(cx, cy, cz - r, cx, cy, cz + r, COPPER);
  line(cx, cy - r, cz, cx, cy + r, cz, COPPER);
  for (let k = 0; k < 8; k++) {
    const a = k * PI / 4;
    block(cx, Math.round(cy + (r + 1) * Math.sin(a)), Math.round(cz + (r + 1) * Math.cos(a)), COPPER);
  }
  block(cx, cy, cz, IRON);
  block(cx - 1, cy, cz, IRON);
}

// ---------- CLEARING (free) ----------
cylinder(0, 0, 0, 11, 12, AIR);
cube(-19, 0, -5, -12, 10, 7, AIR);
cube(11, 0, -2, 20, 12, 7, AIR);
const SATS = [[-12, -7, 11], [12, -7, 13], [-10, 10, 9], [11, 9, 10]];
for (const [sx, sz, h] of SATS) cylinder(sx, 0, sz, 3, h + 8, AIR);

// ---------- FOUNDATION ----------
fill(-1, 9, COBBLE);
fill(0, 7, STONE);
ring(0, 8, COPPER);

// ---------- WORKSHOP ----------
wall(6, 1, 7, (x, z, y) => {
  if (z < 0 && Math.abs(x) <= 1 && y <= 4) return null;
  if (y === 3 || y === 4) {
    const a = Math.atan2(z, x);
    const k = Math.round((a - PI / 8) / (PI / 4));
    if (Math.abs(a - PI / 8 - k * PI / 4) < 0.14) return GLASS;
  }
  if (y === 1) return STONE;
  if (y === 5) return COPPER;
  if (y === 7) return IRON;
  return BRICK;
});
for (let k = 0; k < 8; k++) {
  const a = PI / 8 + k * PI / 4;
  const x = Math.round(4.6 * Math.cos(a)), z = Math.round(4.6 * Math.sin(a));
  block(x, 3, z, GLOWSTONE); block(x, 4, z, GLOWSTONE);
}
// door frame + lava pit
for (let y = 1; y <= 5; y++) { block(-2, y, -6, IRON); block(2, y, -6, IRON); }
for (let x = -2; x <= 2; x++) block(x, 6, -6, GOLD);
cube(-1, 0, -4, 1, 0, -3, LAVA);
// braziers
for (const bx of [-3, 3]) { block(bx, 1, -7, IRON); block(bx, 2, -7, IRON); block(bx, 3, -7, FIRE); }
// pillars
for (let k = 0; k < 8; k++) {
  if (k === 6) continue;
  const a = k * PI / 4;
  const x = Math.round(7 * Math.cos(a)), z = Math.round(7 * Math.sin(a));
  for (let y = 1; y <= 7; y++) block(x, y, z, y % 3 === 0 ? GOLD : IRON);
}
// roof
fill(8, 7, COPPER);
ring(9, 7, IRON);
for (let k = 0; k < 8; k++) {
  const a = PI / 8 + k * PI / 4;
  const x = Math.round(7 * Math.cos(a)), z = Math.round(7 * Math.sin(a));
  block(x, 10, z, IRON); block(x, 11, z, IRON); block(x, 12, z, GOLD);
}

// ---------- TOWER BODY ----------
wall(4, 9, 17, (x, z, y) => {
  if (y === 9 || y === 13 || y === 17) return IRON;
  if (y === 11 || y === 12 || y === 15 || y === 16) {
    const a = Math.atan2(z, x);
    const k = Math.round(a / (PI / 4));
    if (Math.abs(a - k * PI / 4) < 0.16) return GLASS;
  }
  return COPPER;
});
for (let y = 9; y <= 18; y++) block(0, y, 0, IRON);
for (const y of [11, 12, 15, 16]) block(0, y, 0, NEON_BLUE);
// front half balcony at y13
for (let x = -7; x <= 7; x++) for (let z = -7; z <= 0; z++) {
  const d = Math.sqrt(x * x + z * z);
  if (d >= 4.5 && d < 6.5) block(x, 13, z, PLANKS);
}
for (let k = 0; k < 8; k++) {
  const a = k * PI / 4;
  const z = Math.round(6 * Math.sin(a));
  if (z > 0) continue;
  const x = Math.round(6 * Math.cos(a));
  for (let y = 9; y <= 12; y++) block(x, y, z, IRON);
}
// platform
fill(18, 5, PLANKS);
ring(18, 6, IRON);
ring(19, 6, IRON);

// ---------- COIL ----------
for (let y = 19; y <= 28; y++) {
  block(0, y, 0, IRON); block(1, y, 0, IRON); block(-1, y, 0, IRON); block(0, y, 1, IRON); block(0, y, -1, IRON);
}
for (const y of [21, 24]) {
  block(1, y, 0, NEON_BLUE); block(-1, y, 0, NEON_BLUE); block(0, y, 1, NEON_BLUE); block(0, y, -1, NEON_BLUE);
}
for (let s = 0; s < 2; s++) for (let i = 0; i <= 60; i++) {
  const t = i / 60;
  const a = s * PI + t * PI * 6;
  const x = Math.round(3 * Math.cos(a)), z = Math.round(3 * Math.sin(a));
  const y = 20 + Math.round(t * 5);
  block(x, y, z, COPPER); block(x, y + 1, z, COPPER);
}
ring(19, 4, IRON);
ring(26, 4, IRON);
for (let y = 20; y <= 25; y++) {
  block(4, y, 0, IRON); block(-4, y, 0, IRON); block(0, y, 4, IRON); block(0, y, -4, IRON);
}
ring(23, 5, GOLD);

// ---------- TOP LOAD TORUS ----------
for (let x = -8; x <= 8; x++) for (let z = -8; z <= 8; z++) {
  const rr = Math.sqrt(x * x + z * z);
  for (let y = 26; y <= 32; y++) {
    const d = Math.sqrt((rr - 5) * (rr - 5) + (y - 29) * (y - 29));
    if (d <= 2.1 && d > 1.0) block(x, y, z, IRON);
  }
}
for (let k = 0; k < 8; k++) {
  const a = k * PI / 4;
  block(Math.round(7 * Math.cos(a)), 29, Math.round(7 * Math.sin(a)), GOLD);
}
for (let i = 1; i <= 3; i++) {
  block(i, 29, 0, COPPER); block(-i, 29, 0, COPPER); block(0, 29, i, COPPER); block(0, 29, -i, COPPER);
}
for (let y = 29; y <= 31; y++) block(0, y, 0, IRON);
sphere(0, 31, 0, 1, GOLD);
block(0, 33, 0, ELECTRIC);
block(8, 29, 0, ELECTRIC); block(-8, 29, 0, ELECTRIC);
block(0, 29, -8, ELECTRIC); block(0, 29, 8, ELECTRIC);

// ---------- GEARS ----------
gearXY(0, 14, -5, 2);
gearYZ(5, 16, 0, 2);

// ---------- SMOKESTACKS & VENTS ----------
function stack(xa, za) {
  cube(xa, 9, za, xa + 1, 15, za + 1, COPPER);
  cube(xa, 11, za, xa + 1, 11, za + 1, IRON);
  cube(xa, 16, za, xa + 1, 16, za + 1, IRON);
  block(xa, 17, za, STEAM);
  block(xa + 1, 17, za + 1, STEAM);
}
stack(-6, 2);
stack(5, 1);
block(6, 1, -4, IRON); block(6, 2, -4, IRON); block(6, 3, -4, IRON); block(6, 4, -4, STEAM);
block(-6, 1, -4, IRON); block(-6, 2, -4, IRON); block(-6, 3, -4, STEAM);

// ---------- SATELLITE COILS ----------
for (const [sx, sz, h] of SATS) {
  cube(sx - 1, -2, sz - 1, sx + 1, 0, sz + 1, COBBLE);
  cube(sx - 1, 1, sz - 1, sx + 1, 2, sz + 1, BRICK);
  for (let y = 3; y <= h; y++) {
    const id = y % 3 === 0 ? IRON : COPPER;
    block(sx, y, sz, id); block(sx + 1, y, sz, id); block(sx - 1, y, sz, id);
    block(sx, y, sz + 1, id); block(sx, y, sz - 1, id);
  }
  hollowSphere(sx, h + 2, sz, 2, COPPER);
  ring(h + 2, 3, GOLD, sx, sz);
  block(sx, h + 5, sz, IRON);
  block(sx, h + 6, sz, GOLD);
  block(sx, h + 7, sz, ELECTRIC);
  // cable to roof and ground pipe
  line(sx, h + 2, sz, Math.round(sx * 0.45), 9, Math.round(sz * 0.45), IRON);
  line(sx, 0, sz, Math.round(sx * 0.62), 0, Math.round(sz * 0.62), COPPER);
}

// ---------- BOILER TANK (west) ----------
for (let z = -3; z <= 5; z++) {
  const id = (z === -3 || z === 1 || z === 5) ? IRON : COPPER;
  for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) {
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d >= 2 && d < 3) block(-16 + dx, 3 + dy, z, id);
  }
}
for (const z of [-4, 6]) {
  for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) {
    if (Math.sqrt(dx * dx + dy * dy) <= 2.5) block(-16 + dx, 3 + dy, z, IRON);
  }
}
block(-16, 3, -5, GLOWSTONE);
block(-17, 3, -5, GOLD); block(-15, 3, -5, GOLD); block(-16, 4, -5, GOLD); block(-16, 2, -5, GOLD);
for (const z of [-2, 4]) cube(-18, 0, z, -14, 0, z, COBBLE);
for (let y = 6; y <= 10; y++) block(-16, y, 1, y % 2 ? COPPER : IRON);
block(-16, 11, 1, STEAM);

// ---------- COAL HUT (east) ----------
boxWalls(13, 0, 0, 18, 3, 5, BRICK);
cube(15, 0, 0, 16, 2, 0, AIR);
block(14, 2, 0, GLASS); block(17, 2, 0, GLASS);
cube(15, 0, 1, 16, 0, 1, LAVA);
cube(12, 4, -1, 19, 4, 6, PLANKS);
cube(13, 5, 0, 18, 5, 5, COPPER);
cube(14, 6, 1, 17, 6, 4, IRON);
cube(16, 7, 3, 17, 10, 4, BRICK);
block(16, 11, 3, STEAM);

// ---------- LAMP POSTS ----------
for (let k = 0; k < 8; k++) {
  const a = PI / 8 + k * PI / 4;
  const x = Math.round(8 * Math.cos(a)), z = Math.round(8 * Math.sin(a));
  block(x, 1, z, IRON); block(x, 2, z, IRON); block(x, 3, z, GLOWSTONE);
}