// tesla-tower-haiku55 — prompt:
// a steampunk Tesla coil tower crackling with lightning...

// Steampunk Tesla coil tower: copper helix wound around a glass column, brass gear on a
// riveted iron housing, boiler + chimney venting steam, Leyden jars on the left,
// brick factory with chimney in the background. Front faces north (-Z).

// ---------- helpers ----------
function annulusXZ(cx, y, cz, rIn, rOut, id) {
  const R = Math.ceil(rOut);
  for (let dx = -R; dx <= R; dx++)
    for (let dz = -R; dz <= R; dz++) {
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d >= rIn && d <= rOut) block(cx + dx, y, cz + dz, id);
    }
}

function shell3(cx, cy, cz, rIn, rOut, id) {
  const R = Math.ceil(rOut);
  for (let dx = -R; dx <= R; dx++)
    for (let dy = -R; dy <= R; dy++)
      for (let dz = -R; dz <= R; dz++) {
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d >= rIn && d <= rOut) block(cx + dx, cy + dy, cz + dz, id);
      }
}

function drum(cx, y0, cz, r, h, id) {
  for (let y = y0; y < y0 + h; y++) annulusXZ(cx, y, cz, 0, r, id);
}

function helix(cx, cz, y0, y1, R, turns, id) {
  const total = turns * Math.PI * 2;
  for (let t = 0; t <= total; t += 0.1) {
    const y = Math.round(y0 + (y1 - y0) * (t / total));
    block(Math.round(cx + R * Math.cos(t)), y, Math.round(cz + R * Math.sin(t)), id);
  }
}

function perimeter(cx, y, cz, h, id) {
  for (let i = -h; i <= h; i++) {
    block(cx + i, y, cz - h, id);
    block(cx + i, y, cz + h, id);
    block(cx - h, y, cz + i, id);
    block(cx + h, y, cz + i, id);
  }
}

// ---------- site clearing (AIR is free) ----------
cube(-9, 0, -9, 9, 14, 9, AIR);        // clear trees off the plaza
cube(-15, 0, 10, -4, 16, 18, AIR);     // clear trees for the factory

// ---------- plaza ----------
cube(-9, -1, -9, 9, -1, 9, COBBLE);
line(-9, -1, -9, 9, -1, -9, BRICK);
line(-9, -1, 9, 9, -1, 9, BRICK);
line(-9, -1, -9, -9, -1, 9, BRICK);
line(9, -1, -9, 9, -1, 9, BRICK);

// ---------- pedestal + iron deck ----------
cube(-4, 0, -4, 4, 1, 4, STONE);
cube(-5, 2, -5, 5, 2, 5, IRON);
line(-5, 2, -5, 5, 2, -5, GOLD);
line(-5, 2, 5, 5, 2, 5, GOLD);
line(-5, 2, -5, -5, 2, 5, GOLD);
line(5, 2, -5, 5, 2, 5, GOLD);

// ---------- main housing ----------
cube(-3, 3, -3, 3, 6, 3, COPPER);
cube(-2, 4, -2, 2, 6, 2, AIR);
cube(-3, 7, -3, 3, 7, 3, IRON);
for (const x of [-3, 3]) for (const z of [-3, 3]) block(x, 6, z, GOLD);
block(-3, 5, -1, GLASS);
block(-3, 5, 1, GLASS);
block(3, 5, -1, GLASS);
block(3, 5, 1, GLASS);
block(0, 5, 3, GLASS);
block(-1, 6, -3, GLASS);
block(1, 6, -3, GLASS);

// ---------- brass gear on the north face (foreground detail) ----------
for (let dx = -3; dx <= 3; dx++)
  for (let dy = -3; dy <= 3; dy++) {
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d >= 1.5 && d <= 2.4) block(dx, 5 + dy, -4, GOLD);
  }
for (let k = 0; k < 8; k++) {
  const a = (k * Math.PI) / 4;
  block(Math.round(3 * Math.cos(a)), 5 + Math.round(3 * Math.sin(a)), -4, GOLD);
}
block(0, 5, -4, IRON);

// ---------- iron lattice cage around the coil ----------
for (const y of [3, 7, 11, 15, 19]) perimeter(0, y, 0, 4, IRON);
for (const x of [-4, 4]) for (const z of [-4, 4]) line(x, 3, z, x, 19, z, IRON);
for (const y0 of [3, 7, 11, 15]) {
  const y1 = y0 + 4;
  for (const z of [-4, 4]) {
    if (!(z === -4 && y0 === 3)) {
      line(-4, y0, z, 4, y1, z, IRON);
      line(4, y0, z, -4, y1, z, IRON);
    }
  }
  for (const x of [-4, 4]) {
    line(x, y0, -4, x, y1, 4, IRON);
    line(x, y0, 4, x, y1, -4, IRON);
  }
}

// ---------- coil: copper helix, glass column, gold core ----------
helix(0, 0, 8, 24, 3, 5, COPPER);
for (let y = 8; y <= 24; y++)
  for (let x = -2; x <= 2; x++)
    for (let z = -2; z <= 2; z++)
      if (Math.abs(x) === 2 || Math.abs(z) === 2)
        block(x, y, z, y === 8 || y === 24 ? GOLD : GLASS);
line(0, 8, 0, 0, 24, 0, GOLD);

// ---------- toroid crown ----------
annulusXZ(0, 25, 0, 2.5, 5.5, COPPER);
annulusXZ(0, 26, 0, 4.5, 5.0, GOLD);

// ---------- glass top globe ----------
shell3(0, 28, 0, 2.3, 3.0, GLASS);
annulusXZ(0, 28, 0, 2.3, 3.0, GOLD);   // brass equator band
block(0, 28, 0, ELECTRIC);             // arc inside the globe

// ---------- lightning rod spire + crackling arcs ----------
line(0, 31, 0, 0, 32, 0, IRON);
block(0, 33, 0, ELECTRIC);
block(4, 30, -1, ELECTRIC);
block(-4, 27, 1, ELECTRIC);
block(-3, 31, 2, ELECTRIC);
block(3, 33, -2, ELECTRIC);

// ---------- boiler + chimney + steam (east side) ----------
drum(7, 0, 0, 2.2, 6, COPPER);
annulusXZ(7, 2, 0, 1.5, 2.5, IRON);
annulusXZ(7, 4, 0, 1.5, 2.5, IRON);
annulusXZ(7, 6, 0, 0, 2.5, IRON);
line(4, 3, 0, 5, 3, 0, COPPER);        // steam pipe to housing
for (let y = 7; y <= 16; y++) perimeter(7, y, 0, 1, IRON);
perimeter(7, 16, 0, 1, GOLD);
block(7, 11, 0, STEAM);
block(7, 15, 0, STEAM);
block(7, 17, 0, STEAM);

// ---------- Leyden jars (west side) ----------
for (const z of [-4, 0, 4]) {
  for (let y = 0; y <= 4; y++) annulusXZ(-6, y, z, 0.5, 1.5, GLASS);
  for (let y = 0; y <= 5; y++) block(-6, y, z, COPPER);
  annulusXZ(-6, 5, z, 0.5, 1.5, IRON);
}

// ---------- crates in the foreground ----------
cube(-8, 0, 6, -7, 1, 7, PLANKS);
cube(-8, 2, 6, -7, 2, 7, PLANKS);
cube(7, 0, 6, 8, 1, 7, PLANKS);

// ---------- background brick factory (south, +Z) ----------
cube(-14, -1, 11, -5, -1, 17, STONE);  // foundation
cube(-14, 0, 11, -5, 8, 17, BRICK);    // walls + roof
cube(-13, 1, 12, -6, 7, 16, AIR);      // hollow interior
cube(-9, 0, 11, -9, 1, 11, AIR);       // front door
for (const x of [-12, -9, -6])
  for (let y = 3; y <= 5; y++) {
    block(x, y, 11, GLASS);
    block(x, y, 17, GLASS);
  }
for (let x = -14; x <= -5; x += 2) {
  block(x, 9, 11, BRICK);
  block(x, 9, 17, BRICK);
}
line(-14, 8, 11, -5, 8, 11, LIGHT_GRAY);
line(-14, 8, 17, -5, 8, 17, LIGHT_GRAY);
for (let y = 9; y <= 20; y++) perimeter(-9, y, 14, 1, BRICK);
perimeter(-9, 20, 14, 1, IRON);
block(-9, 18, 14, STEAM);
block(-9, 21, 14, STEAM);