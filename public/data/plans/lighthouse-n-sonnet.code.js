// lighthouse-n-sonnet — prompt:
// a lighthouse on a stormy night...

// ============================================================
// A LIGHTHOUSE ON A STORMY NIGHT
// Layout: rocky sea-cliff foreground (north, toward camera),
// tall striped lighthouse as centerpiece, keeper's cottage
// tucked beside it, storm clouds + lightning strike overhead.
// ============================================================

const TX = 0, TZ = 6;      // lighthouse tower center (front faces -Z / north)
const SEA_Y = -1;          // sea surface level

function jitter(n) { return (Math.random() * 2 - 1) * n; }

// ---------- 1. ROCKY SEA CLIFF ISLAND ----------
for (let y = -2; y <= 1; y++) {
  const r = 6 - (y + 2) * 0.4;
  disk(TX, y, TZ, Math.round(r), y < 0 ? STONE : COBBLE);
}

for (let x = -11; x <= 11; x++) {
  for (let z = -9; z <= 15; z++) {
    const dx = x - TX, dz = z - TZ;
    const dist = Math.sqrt(dx * dx + dz * dz) + jitter(1.4);
    if (dist > 6 && dist < 11.5) {
      const northFactor = Math.max(0, (z - (TZ - 9)) / 15);
      const topY = Math.round(-1 + northFactor * 2 + jitter(0.6));
      if (topY >= -3) {
        cube(x, -3, z, x, topY, z, Math.random() < 0.75 ? STONE : COBBLE);
        if (Math.random() < 0.12) block(x, topY + 1, z, GRASS);
        if (Math.random() < 0.05) block(x, topY + 1, z, DIRT);
      }
    }
  }
}

const skerries = [[13, -10], [-14, -8], [9, -13], [-9, -14]];
for (const [sx, sz] of skerries) {
  const h = 1 + Math.floor(Math.random() * 2);
  sphere(sx, SEA_Y + h, sz, 1 + Math.floor(Math.random() * 2), STONE);
  if (Math.random() < 0.6) block(sx, SEA_Y + h + 1, sz, SNOW);
}

// ---------- 2. STORMY SEA / WAVES / FOAM ----------
for (let x = -16; x <= 16; x++) {
  for (let z = -18; z <= 4; z++) {
    const dx = x - TX, dz = z - TZ;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 9.5) {
      block(x, SEA_Y, z, WATER);
      if (Math.random() < 0.10) block(x, SEA_Y + 1, z, WATER);
      if (Math.random() < 0.05) block(x, SEA_Y + 1, z, WHITE);
    }
  }
}
for (let x = -12; x <= 12; x++) {
  for (let z = -10; z <= -6; z++) {
    const dx = x - TX, dz = z - TZ;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 8.5 && dist < 10.5 && Math.random() < 0.35) {
      block(x, SEA_Y + 1, z, WHITE);
    }
  }
}

// ---------- 3. LIGHTHOUSE TOWER ----------
const BASE_Y = 1;
const TOP_Y = 22;

hollowCylinder(TX, BASE_Y - 1, TZ, 4, 1, STONE);
disk(TX, BASE_Y - 1, TZ, 4, COBBLE);

let bandY = BASE_Y;
let colorToggle = true;
while (bandY <= TOP_Y) {
  const h = Math.min(3, TOP_Y - bandY + 1);
  hollowCylinder(TX, bandY, TZ, 3, h, colorToggle ? WHITE : RED);
  bandY += 3;
  colorToggle = !colorToggle;
}

block(TX, BASE_Y, TZ + 3, AIR);
block(TX, BASE_Y + 1, TZ + 3, AIR);
block(TX, BASE_Y + 1, TZ + 3, GLASS);
for (let wy = BASE_Y + 4; wy < TOP_Y - 2; wy += 5) {
  block(TX + 3, wy, TZ, AIR);
  block(TX + 3, wy, TZ, GLASS);
  block(TX - 3, wy, TZ, AIR);
  block(TX - 3, wy, TZ, GLASS);
  block(TX, wy, TZ - 3, AIR);
  block(TX, wy, TZ - 3, GLASS);
}

disk(TX, TOP_Y + 1, TZ, 4, IRON);
hollowCylinder(TX, TOP_Y + 2, TZ, 4, 1, IRON);

hollowCylinder(TX, TOP_Y + 2, TZ, 3, 3, GLASS);
sphere(TX, TOP_Y + 3, TZ, 1, GLOWSTONE);
hollowCylinder(TX, TOP_Y + 2, TZ, 3, 1, IRON);

hollowCylinder(TX, TOP_Y + 5, TZ, 3, 1, RED);
hollowCylinder(TX, TOP_Y + 6, TZ, 2, 1, RED);
hollowCylinder(TX, TOP_Y + 7, TZ, 1, 1, RED);
block(TX, TOP_Y + 8, TZ, GOLD);

// ---------- 4. KEEPER'S COTTAGE ----------
const CX = -8, CZ = 10;
cube(CX - 2, BASE_Y - 1, CZ - 2, CX + 2, BASE_Y - 1, CZ + 2, STONE);
cube(CX - 2, BASE_Y, CZ - 2, CX + 2, BASE_Y + 3, CZ + 2, COBBLE);
cube(CX - 1, BASE_Y, CZ - 1, CX + 1, BASE_Y + 2, CZ + 1, AIR);
block(CX, BASE_Y, CZ - 2, AIR);
block(CX, BASE_Y + 1, CZ - 2, AIR);
block(CX - 2, BASE_Y + 1, CZ, AIR); block(CX - 2, BASE_Y + 1, CZ, GLASS);
block(CX + 2, BASE_Y + 1, CZ, AIR); block(CX + 2, BASE_Y + 1, CZ, GLASS);
block(CX, BASE_Y + 1, CZ - 2, GLOWSTONE);
for (let i = 0; i <= 2; i++) {
  cube(CX - 2 + i, BASE_Y + 4 + i, CZ - 2, CX + 2 - i, BASE_Y + 4 + i, CZ + 2, BROWN);
}
cube(CX + 1, BASE_Y + 4, CZ + 1, CX + 1, BASE_Y + 8, CZ + 1, BRICK);
block(CX + 1, BASE_Y + 9, CZ + 1, FIRE);

// ---------- 5. STORM CLOUDS ----------
function stormCloud(cx, cy, cz, rx, rz, thickness, color) {
  for (let x = cx - rx; x <= cx + rx; x++) {
    for (let z = cz - rz; z <= cz + rz; z++) {
      const dx = (x - cx) / rx, dz = (z - cz) / rz;
      if (dx * dx + dz * dz <= 1 && Math.random() < 0.9) {
        cube(x, cy, z, x, cy + thickness, z, color);
      }
    }
  }
}
stormCloud(6, 28, -12, 8, 6, 2, GRAY);
stormCloud(-10, 30, -14, 7, 5, 2, LIGHT_GRAY);
stormCloud(14, 27, -6, 6, 5, 2, GRAY);
stormCloud(-4, 31, -18, 9, 6, 2, BLACK);
stormCloud(2, 24, 14, 6, 5, 2, GRAY);

// ---------- 6. LIGHTNING BOLT ----------
function zigzagBolt(x0, y0, z0, x1, y1, z1, id) {
  let x = x0, y = y0, z = z0;
  const steps = Math.abs(y1 - y0);
  for (let i = 0; i < steps; i++) {
    y--;
    x += Math.round(jitter(1.2));
    block(x, y, z, id);
    if (Math.random() < 0.4) block(x + 1, y, z, id);
  }
}
zigzagBolt(11, 27, -9, 9, SEA_Y + 1, -9, ELECTRIC);
sphere(9, SEA_Y + 1, -9, 2, NEON_BLUE);
block(9, SEA_Y + 2, -9, NEON_BLUE);

// ---------- 7. SEAGULLS RIDING THE STORM ----------
const gulls = [[-3, 20, -8], [3, 21, -10], [-6, 19, -6]];
for (const [gx, gy, gz] of gulls) {
  block(gx, gy, gz, BLACK);
  block(gx - 1, gy, gz, BLACK);
  block(gx + 1, gy, gz, BLACK);
}