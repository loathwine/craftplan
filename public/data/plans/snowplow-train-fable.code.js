// snowplow-train-fable — prompt:
// a steam train with a snowplow...

const H = (x, z) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
const L = z => z + 1; // loco-local z -> world z
const P = (x, y, z, id) => block(x, y, L(z), id);
const cubeL = (x1, y1, z1, x2, y2, z2, id) => cube(x1, y1, L(z1), x2, y2, L(z2), id);

// ---------- 1. clear the rail corridor (trees, stone ledge) ----------
cube(-9, 1, -22, 9, 10, 22, AIR);

// ---------- 2. ground: fill hollows, ballast bed, sleepers, rails ----------
cube(-2, -1, -8, 8, -1, 1, STONE);
cube(5, -1, 5, 9, -1, 14, STONE);
for (let z = -22; z <= 22; z++) {
  for (let x = -5; x <= 5; x++) {
    const ax = Math.abs(x);
    let id = COBBLE;
    if (ax === 5) id = SNOW;
    else if (((z % 2) + 2) % 2 === 0) id = OAK_LOG;
    else if (H(x, z) < 0.3) id = SNOW;
    block(x, 0, z, id);
  }
  block(-3, 1, z, IRON);
  block(3, 1, z, IRON);
}

// ---------- 3. snow banks thrown up along both sides ----------
for (let z = -22; z <= 22; z++) {
  for (const s of [-1, 1]) {
    const h1 = H(s * 7, z), h2 = H(s * 8, z);
    const boost = (z >= -19 && z <= -12) ? 1 : 0;
    cube(s * 6, 0, z, s * 6, 1 + boost, z, SNOW);
    cube(s * 7, 0, z, s * 7, (h1 > 0.4 ? 2 : 1) + boost * 2, z, SNOW);
    cube(s * 8, 0, z, s * 8, (h2 > 0.6 ? 1 : 0) + boost, z, SNOW);
  }
}

// ---------- 4. deep uncleared snow ahead of the plow ----------
for (let z = -22; z <= -14; z++) {
  for (let x = -5; x <= 5; x++) {
    const front = Math.min(-20 + Math.abs(x), -13);
    if (z < front) {
      const top = 2 + ((H(x + 3, z + 7) > 0.5 && z < front - 1) ? 1 : 0);
      cube(x, 1, z, x, top, z, SNOW);
    }
  }
}

// ---------- 5. the wedge snowplow ----------
const zaOf = y => (y <= 3 ? -20 : y <= 5 ? -19 : y <= 7 ? -18 : -19);
cube(-6, 2, -13, 6, 7, -13, RED);
for (let y = 2; y <= 8; y++) {
  const za = zaOf(y);
  for (let x = -6; x <= 6; x++) {
    const ax = Math.abs(x);
    const z0 = Math.min(za + ax, -13);
    if (y === 8) {
      block(x, y, z0, YELLOW);
      for (let z = z0 + 1; z <= -13; z++) block(x, y, z, GRAY);
      continue;
    }
    let id = RED;
    if (y === 2) id = IRON;
    else if (ax === 0) id = IRON;
    else if (ax === 6) id = (y % 2 ? YELLOW : BLACK);
    block(x, y, z0, id);
    if (z0 < -13) block(x, y, z0 + 1, (ax === 6 || y === 2) ? id : RED);
  }
}
// plow work lamps + snow curling over the wings
block(-4, 9, -14, GLOWSTONE);
block(4, 9, -14, GLOWSTONE);
block(-6, 9, -13, SNOW); block(6, 9, -13, SNOW); block(-5, 9, -14, SNOW); block(6, 9, -14, SNOW);

// ---------- 6. locomotive ----------
// frame plates
for (const s of [-1, 1]) cubeL(s * 2, 5, -12, s * 2, 6, 9, BLACK);
// front beam + deck behind plow
cubeL(-4, 5, -13, 4, 6, -13, RED);
cubeL(-1, 7, -13, 1, 7, -13, GRAY);
// running boards
for (let z = -13; z <= 3; z++) {
  for (const s of [-1, 1]) {
    P(s * 4, 7, z, RED);
    P(s * 3, 7, z, GRAY);
    P(s * 2, 7, z, GRAY);
  }
}
// boiler
function ring(zl, id, solid) {
  for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) {
    const d = dx * dx + dy * dy;
    if (d <= 10 && (solid || d > 4)) P(dx, 10 + dy, zl, id);
  }
}
for (let z = -12; z <= 3; z++) {
  const smoke = z <= -9;
  const band = (z === -8 || z === -6 || z === -2 || z === 2);
  ring(z, smoke ? BLACK : (band ? GOLD : GREEN), z === -12);
}
// smokebox door
for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
  const d = dx * dx + dy * dy;
  if (d <= 4) P(dx, 10 + dy, -13, d === 0 ? GOLD : d === 4 ? IRON : GRAY);
}
// headlamp
P(0, 14, -12, GOLD); P(0, 15, -12, GOLD); P(0, 14, -13, GLOWSTONE);
// diamond smokestack
const cz = -10;
for (let y = 14; y <= 16; y++) {
  P(0, y, cz, BLACK); P(1, y, cz, BLACK); P(-1, y, cz, BLACK); P(0, y, cz - 1, BLACK); P(0, y, cz + 1, BLACK);
}
for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
  const d = dx * dx + dz * dz;
  if (d <= 4) P(dx, 17, cz + dz, BLACK);
  if (d <= 4 && d >= 1) P(dx, 18, cz + dz, COPPER);
}
P(0, 18, cz, STEAM); P(0, 19, cz, STEAM); P(0, 20, cz, STEAM); P(0, 21, cz + 1, STEAM);
// bell
P(0, 14, -7, GOLD);
// steam dome
for (let y = 14; y <= 15; y++) { P(0, y, -4, GOLD); P(1, y, -4, GOLD); P(-1, y, -4, GOLD); P(0, y, -5, GOLD); P(0, y, -3, GOLD); }
P(0, 16, -4, GOLD);
// sand dome
P(0, 14, 0, GREEN); P(1, 14, 0, GREEN); P(-1, 14, 0, GREEN); P(0, 14, -1, GREEN); P(0, 14, 1, GREEN); P(0, 15, 0, GOLD);
// whistle
P(0, 14, 2, GOLD); P(0, 15, 2, GOLD); P(0, 16, 2, STEAM);
// copper feed pipes
for (let z = -8; z <= 3; z++) { P(3, 8, z, COPPER); P(-3, 8, z, COPPER); }

// wheels
function wheel(x, cy, czl, r) {
  for (let dy = -r; dy <= r; dy++) for (let dz = -r; dz <= r; dz++) {
    const d = dy * dy + dz * dz;
    if (r === 2) { if (d <= 5) P(x, cy + dy, czl + dz, d === 0 ? GOLD : d >= 4 ? IRON : RED); }
    else P(x, cy + dy, czl + dz, d === 0 ? RED : IRON);
  }
}
for (const s of [-1, 1]) {
  wheel(s * 3, 4, -3, 2); wheel(s * 3, 4, 2, 2); wheel(s * 3, 4, 7, 2);
  wheel(s * 3, 3, -10, 1); wheel(s * 3, 3, -7, 1);
  // cylinders
  cubeL(s * 4, 4, -10, s * 4, 6, -7, BLACK);
  cubeL(s * 4, 4, -10, s * 4, 6, -10, COPPER);
  P(s * 5, 5, -10, STEAM);
  // rods
  cubeL(s * 4, 3, -3, s * 4, 3, 7, IRON);
  line(s * 4, 5, L(-6), s * 4, 3, L(2), IRON);
  P(s * 4, 5, -6, GOLD);
}

// cab
for (const s of [-1, 1]) {
  cubeL(s * 4, 7, 4, s * 4, 15, 9, RED);
  cubeL(s * 4, 10, 4, s * 4, 10, 9, GOLD);
  cubeL(s * 4, 12, 6, s * 4, 14, 8, GLASS);
}
cubeL(-3, 7, 4, 3, 15, 4, RED);
cubeL(2, 13, 4, 3, 14, 4, GLASS);
cubeL(-3, 13, 4, -2, 14, 4, GLASS);
cubeL(-3, 7, 9, 3, 10, 9, RED);
cubeL(-3, 7, 5, 3, 7, 8, PLANKS);
// backhead with firebox door + gauges
cubeL(-2, 8, 5, 2, 12, 5, BLACK);
P(0, 9, 5, LAVA); P(-1, 11, 5, GOLD); P(1, 11, 5, GOLD); P(0, 12, 5, COPPER);
P(0, 15, 7, GLOWSTONE);
// roof, snow-capped
cubeL(-5, 16, 3, 5, 16, 10, BLACK);
cubeL(-3, 17, 3, 3, 17, 10, BLACK);
cubeL(-2, 18, 4, 2, 18, 9, SNOW);
cubeL(4, 17, 3, 4, 17, 10, SNOW);
cubeL(-4, 17, 3, -4, 17, 10, SNOW);
// engineer at the east window
P(3, 8, 7, BLUE); P(3, 9, 7, BLUE); P(3, 10, 7, BLUE); P(3, 11, 7, RED); P(3, 12, 7, SAND); P(3, 13, 7, BLUE);

// coupling + fall plate
P(0, 5, 10, IRON);
cubeL(-2, 7, 10, 2, 7, 10, GRAY);

// ---------- 7. tender ----------
cubeL(-3, 5, 11, 3, 5, 21, BLACK);
cubeL(-3, 5, 21, 3, 5, 21, RED);
for (const s of [-1, 1]) {
  cubeL(s * 2, 3, 11, s * 2, 4, 21, BLACK);
  wheel(s * 3, 3, 12, 1); wheel(s * 3, 3, 16, 1); wheel(s * 3, 3, 20, 1);
  cubeL(s * 3, 6, 11, s * 3, 10, 21, GREEN);
  cubeL(s * 3, 10, 11, s * 3, 10, 21, GOLD);
  cubeL(s * 3, 7, 13, s * 3, 7, 19, GOLD);
}
cubeL(-2, 6, 11, 2, 8, 11, GREEN);
cubeL(-2, 6, 21, 2, 10, 21, GREEN);
cubeL(-2, 10, 21, 2, 10, 21, GOLD);
P(-2, 7, 21, NEON_RED); P(2, 7, 21, NEON_RED);
// coal load
cubeL(-2, 9, 12, 2, 9, 18, BLACK);
cubeL(-2, 9, 19, 2, 9, 20, GRAY);
P(0, 10, 20, IRON);
for (let z = 12; z <= 18; z++) for (let x = -2; x <= 2; x++) {
  const h = H(x * 3 + 1, z * 5);
  if (h > 0.35) P(x, 10, z, h > 0.7 ? OBSIDIAN : BLACK);
  if (Math.abs(x) <= 1 && z >= 14 && z <= 17 && h > 0.5) P(x, 11, z, h > 0.8 ? OBSIDIAN : BLACK);
}
P(-2, 10, 19, SNOW); P(-1, 10, 19, SNOW); P(2, 10, 20, SNOW);

// ---------- 8. trackside details ----------
// semaphore signal (east)
cube(8, 1, 0, 8, 12, 0, GRAY);
block(8, 13, 0, IRON);
block(7, 11, 0, RED); block(6, 11, 0, RED); block(5, 11, 0, WHITE);
block(8, 12, -1, GLOWSTONE);
// telegraph pole (west)
cube(-8, 1, 14, -8, 12, 14, OAK_LOG);
cube(-10, 11, 14, -6, 11, 14, PLANKS);
block(-10, 12, 14, WHITE); block(-6, 12, 14, WHITE); block(-8, 13, 14, SNOW);
// snowman watching the train (east, facing north)
cube(7, 2, 16, 9, 3, 18, SNOW);
block(8, 4, 17, SNOW); block(7, 4, 17, SNOW); block(9, 4, 17, SNOW); block(8, 4, 16, SNOW); block(8, 4, 18, SNOW);
block(8, 5, 17, SNOW); block(8, 5, 16, RED);
block(7, 5, 17, OAK_LOG); block(9, 5, 17, OAK_LOG);
block(8, 6, 17, SNOW); block(8, 6, 16, ORANGE);
block(8, 7, 17, BLACK); block(8, 8, 17, BLACK);

// ---------- 9. snow spray flung off the plow wings ----------
const spray = [[7,4,-16],[7,6,-15],[8,5,-15],[8,7,-14],[9,6,-13],[9,8,-13],[10,7,-12],[10,9,-11],[11,8,-10],[11,6,-11],
  [12,7,-9],[12,9,-8],[13,6,-8],[13,8,-6],[14,5,-6],[14,7,-5],[9,4,-12],[10,5,-10],[11,4,-8],[12,5,-7],
  [8,9,-12],[9,10,-10],[15,6,-4],[8,3,-14],[10,3,-9]];
spray.forEach((p, i) => {
  block(p[0], p[1], p[2], SNOW);
  if (i % 3 !== 0) block(-p[0], p[1], p[2], SNOW);
});