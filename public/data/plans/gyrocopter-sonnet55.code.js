// gyrocopter-sonnet55 — prompt:
// a steampunk gyrocopter...

const PI = Math.PI, R = Math.round, H = Math.hypot;

// ---------- helpers ----------
function zCyl(cx, cy, z1, z2, r, id, rmin) {
  const n = Math.ceil(r);
  for (let z = z1; z <= z2; z++)
    for (let dx = -n; dx <= n; dx++)
      for (let dy = -n; dy <= n; dy++) {
        const d2 = dx * dx + dy * dy;
        if (d2 <= r * r && (rmin === undefined || d2 >= rmin * rmin)) block(cx + dx, cy + dy, z, id);
      }
}
function ringXY(cx, cy, z, r, id) {
  const n = Math.ceil(2 * PI * r * 2);
  for (let i = 0; i < n; i++) { const a = i / n * 2 * PI; block(R(cx + r * Math.cos(a)), R(cy + r * Math.sin(a)), z, id); }
}
function yRing(cx, y, cz, r, id) {
  const n = Math.ceil(2 * PI * r * 2);
  for (let i = 0; i < n; i++) { const a = i / n * 2 * PI; block(R(cx + r * Math.cos(a)), y, R(cz + r * Math.sin(a)), id); }
}
function gearXY(cx, cy, z, Rr, teeth, c1, c2, c3) {
  const n = Math.ceil(Rr) + 1;
  for (let dx = -n; dx <= n; dx++) for (let dy = -n; dy <= n; dy++) {
    const d = H(dx, dy), a = Math.atan2(dy, dx);
    if (d <= 1.2) block(cx + dx, cy + dy, z, c3);
    else if (d >= Rr - 1.2 && d <= Rr - 0.1) block(cx + dx, cy + dy, z, c1);
    else if (d > Rr - 0.1 && d <= Rr + 1.1 && Math.cos(teeth * a) > 0.2) block(cx + dx, cy + dy, z, c1);
    else if (d < Rr - 1.2 && Math.abs(Math.sin(3 * a)) * d < 0.9) block(cx + dx, cy + dy, z, c2);
  }
}
function gearXZ(cx, y, cz, Rr, teeth, c1, c2, c3) {
  const n = Math.ceil(Rr) + 1;
  for (let dx = -n; dx <= n; dx++) for (let dz = -n; dz <= n; dz++) {
    const d = H(dx, dz), a = Math.atan2(dz, dx);
    if (d <= 1.2) block(cx + dx, y, cz + dz, c3);
    else if (d >= Rr - 1.2 && d <= Rr - 0.1) block(cx + dx, y, cz + dz, c1);
    else if (d > Rr - 0.1 && d <= Rr + 1.1 && Math.cos(teeth * a) > 0.2) block(cx + dx, y, cz + dz, c1);
    else if (d < Rr - 1.2 && Math.abs(Math.sin(3 * a)) * d < 0.9) block(cx + dx, y, cz + dz, c2);
  }
}
function wheel(x0, cy, cz, r, th) {
  for (let t = 0; t < th; t++) {
    const x = x0 + t;
    const n = Math.ceil(2 * PI * r * 2);
    for (let i = 0; i < n; i++) {
      const a = i / n * 2 * PI;
      block(x, R(cy + r * Math.sin(a)), R(cz + r * Math.cos(a)), BLACK);
      block(x, R(cy + (r - 1) * Math.sin(a)), R(cz + (r - 1) * Math.cos(a)), IRON);
    }
    for (let k = 0; k < 4; k++) {
      const a = k * PI / 4;
      for (let rr = -(r - 1); rr <= r - 1; rr++) block(x, R(cy + rr * Math.sin(a)), R(cz + rr * Math.cos(a)), IRON);
    }
    block(x, cy, cz, GOLD);
  }
}
function lamp(x, z) {
  line(x, 1, z, x, 8, z, IRON);
  block(x, 9, z, GLOWSTONE);
  block(x, 10, z, GOLD); block(x - 1, 9, z, GOLD); block(x + 1, 9, z, GOLD);
  block(x, 9, z - 1, GOLD); block(x, 9, z + 1, GOLD);
  block(x, 8, z, GOLD);
}

// ---------- clear trees ----------
cube(-13, 0, -17, 13, 9, 13, AIR);
cube(-8, 0, 14, 8, 14, 22, AIR);
cube(-22, 0, 0, -12, 10, 13, AIR);
cube(12, 0, 3, 21, 17, 13, AIR);

// ---------- landing pad ----------
for (let x = -9; x <= 9; x++) for (let z = -9; z <= 9; z++) {
  const d = H(x, z);
  if (d > 9.3) continue;
  let id;
  if (d >= 8.2) id = IRON; else if (d >= 6.5) id = COBBLE; else id = ((x + z) & 1) ? STONE : LIGHT_GRAY;
  block(x, 0, z, id);
}
disk(0, -1, 0, 5, STONE);

// ---------- hull ----------
function prof(z) {
  if (z < -6) { const t = (z + 10) / 4; const s = Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t))); return [Math.max(1, 3.2 * s), Math.max(1, 3 * s)]; }
  if (z <= 3) return [3.2, 3];
  const u = (z - 3) / 3; return [3.2 - 1.4 * u, 3 - u];
}
for (let z = -10; z <= 6; z++) {
  const [a, b] = prof(z);
  for (let x = -4; x <= 4; x++) for (let y = 3; y <= 10; y++) {
    const nx = x / a, ny = (y - 6.5) / b, d = nx * nx + ny * ny;
    if (d <= 1) {
      let id = y < 6.5 ? PLANKS : COPPER;
      if (d > 0.55 && ((z % 4) + 4) % 4 === 0) id = GOLD;
      if (x === 0 && y <= 4) id = BROWN;
      block(x, y, z, id);
    }
  }
}
// cockpit
cube(-1, 8, -7, 1, 11, -3, AIR);
for (let z = -7; z <= -3; z++) { block(2, 8, z, GOLD); block(-2, 8, z, GOLD); }
cube(-1, 8, -7, 1, 9, -7, BLACK);
block(-1, 9, -7, GOLD); block(1, 9, -7, GOLD); block(0, 9, -7, NEON_BLUE);
cube(-1, 7, -6, 1, 7, -3, BLACK);
cube(-1, 8, -3, 1, 10, -3, BLACK);
// pilot
cube(-1, 8, -5, 1, 9, -4, BROWN);
block(-1, 8, -6, BROWN); block(1, 8, -6, BROWN);
line(0, 8, -6, 0, 9, -6, GOLD);
cube(-1, 10, -6, 1, 11, -4, PINK);
cube(-1, 12, -6, 1, 12, -4, BROWN);
cube(-2, 12, -4, 2, 12, -4, BROWN);
block(-1, 11, -7, LIGHT_BLUE); block(1, 11, -7, LIGHT_BLUE);
block(-1, 12, -7, GOLD); block(1, 12, -7, GOLD);
line(1, 9, -3, 4, 11, 3, RED); line(2, 10, -3, 5, 12, 2, RED); line(1, 10, -3, 3, 12, 1, RED);
// windscreen
cube(-2, 8, -8, 2, 11, -8, GLASS);
line(-2, 8, -8, -2, 11, -8, GOLD); line(2, 8, -8, 2, 11, -8, GOLD);
line(-2, 11, -8, 2, 11, -8, GOLD); line(0, 8, -8, 0, 11, -8, GOLD);
for (const s of [-1, 1]) {
  cube(2 * s, 9, -7, 2 * s, 11, -5, GLASS);
  line(2 * s, 11, -8, 2 * s, 11, -5, GOLD);
}
// portholes + lanterns
for (const s of [-1, 1]) {
  block(3 * s, 6, -3, GLASS); block(3 * s, 7, -3, GLASS);
  block(3 * s, 5, -3, GOLD);
  line(3 * s, 8, -6, 4 * s, 8, -6, GOLD);
  block(4 * s, 8, -6, GLOWSTONE); block(4 * s, 9, -6, GOLD); block(4 * s, 7, -6, GOLD);
  block(4 * s, 8, -7, GOLD); block(4 * s, 8, -5, GOLD);
}
// furnaces on flanks
for (const s of [-1, 1]) {
  cube(3 * s, 5, 0, 4 * s, 7, 3, IRON);
  cube(4 * s, 5, 1, 4 * s, 6, 2, LAVA);
  block(4 * s, 7, 1, GOLD); block(4 * s, 7, 2, GOLD);
  line(3 * s, 8, 3, 3 * s, 8, 13, COPPER);
  block(3 * s, 7, 3, COPPER);
}
for (const z of [6, 10]) for (const s of [-1, 1]) { line(2 * s, 8, z, 3 * s, 8, z, IRON); }
block(3, 7, 14, STEAM); block(-3, 7, 14, STEAM);
block(3, 8, 14, IRON); block(-3, 8, 14, IRON);

// ---------- boiler ----------
zCyl(0, 12, 2, 9, 2.6, COPPER);
sphere(0, 12, 2, 2, COPPER);
for (const z of [3, 6, 9]) zCyl(0, 12, z, z, 2.6, GOLD, 1.9);
zCyl(0, 12, 10, 10, 2.8, IRON);
zCyl(0, 12, 11, 11, 1.8, IRON);
block(0, 12, 12, GOLD);
for (const z of [7, 10]) cube(-1, 9, z, 1, 9, z, IRON);
// steam dome + valve
sphere(0, 15, 3, 2, GOLD);
line(0, 17, 3, 0, 19, 3, IRON); block(0, 20, 3, GOLD);
// stack
cylinder(0, 14, 6, 1, 6, IRON);
cylinder(0, 19, 6, 2, 1, GOLD);
block(0, 20, 6, STEAM); block(0, 22, 6, STEAM);
// whistle
line(-2, 14, 8, -2, 16, 8, GOLD); block(-2, 17, 8, STEAM);
// gauges
cube(3, 11, 4, 3, 13, 6, GOLD); block(3, 12, 5, WHITE); block(3, 13, 5, RED); block(2, 12, 5, IRON);
cube(-3, 10, 5, -3, 13, 5, GLASS); line(-3, 10, 5, -3, 13, 5, GOLD); block(-3, 9, 5, GOLD); block(-2, 12, 5, IRON);
line(3, 10, 3, 3, 10, 9, COPPER); line(-3, 10, 3, -3, 10, 9, COPPER);
block(2, 10, 3, IRON); block(-2, 10, 3, IRON);
line(0, 16, 1, 0, 17, 0, COPPER);

// ---------- rotor mast ----------
const zm = (y) => R(-1 + (y - 9) * 0.125);
for (let y = 8; y <= 25; y++) { block(0, y, zm(y), IRON); block(0, y, zm(y) - 1, IRON); }
for (const y of [12, 16, 20, 23]) cube(-1, y, zm(y) - 1, 1, y, zm(y), GOLD);
line(3, 8, -3, 0, 24, 1, IRON); line(-3, 8, -3, 0, 24, 1, IRON);
line(3, 8, 0, 0, 24, 1, IRON); line(-3, 8, 0, 0, 24, 1, IRON);
gearXZ(0, 17, zm(17), 3, 10, GOLD, COPPER, IRON);
gearXZ(0, 21, zm(21), 2, 8, IRON, IRON, GOLD);
// hub + blades
cylinder(0, 25, 1, 1, 4, GOLD);
block(0, 29, 1, IRON); line(0, 29, 1, 0, 32, 1, IRON); cube(1, 31, 1, 3, 32, 1, RED);
for (const s of [-1, 1]) {
  for (let i = 1; i <= 20; i++) {
    const x = s * i, y = 26 + Math.floor((i - 3) / 8 < 0 ? 0 : (i - 3) / 8);
    if (i >= 19) { cube(x, y, 0, x, y, 1, COPPER); continue; }
    if (i === 8 || i === 14) { cube(x, y, 0, x, y, i < 12 ? 2 : 1, GOLD); continue; }
    block(x, y, 0, IRON);
    block(x, y, 1, PLANKS);
    if (i < 12) block(x, y, 2, PLANKS);
  }
  block(s * 20, 27, 1, GLOWSTONE);
  block(s * 11, 26, 1, PLANKS); block(s * 19, 27, 0, IRON);
}

// ---------- tail truss ----------
function tc(z) { const u = (z - 6) / 11; const w = R(1.8 - 0.6 * u), h = 2 - 0.8 * u; return { xl: -w, xr: w, yb: R(7 - h), yt: R(7 + h) }; }
for (let z = 6; z <= 17; z++) { const c = tc(z); block(c.xl, c.yb, z, IRON); block(c.xr, c.yb, z, IRON); block(c.xl, c.yt, z, IRON); block(c.xr, c.yt, z, IRON); }
for (const z of [7, 10, 13, 16]) {
  const c = tc(z);
  line(c.xl, c.yb, z, c.xr, c.yb, z, GOLD); line(c.xl, c.yt, z, c.xr, c.yt, z, GOLD);
  line(c.xl, c.yb, z, c.xl, c.yt, z, GOLD); line(c.xr, c.yb, z, c.xr, c.yt, z, GOLD);
  line(c.xl, c.yb, z, c.xr, c.yt, z, IRON); line(c.xr, c.yb, z, c.xl, c.yt, z, IRON);
}
for (const z0 of [6, 9, 12, 15]) {
  const a = tc(z0), b = tc(z0 + 3);
  line(a.xl, a.yb, z0, b.xl, b.yt, z0 + 3, GOLD); line(a.xr, a.yt, z0, b.xr, b.yb, z0 + 3, GOLD);
}
// engine
cube(-1, 6, 12, 1, 7, 14, IRON);
for (const sx of [-1, 1]) { cube(sx, 8, 12, sx, 10, 13, COPPER); block(sx, 11, 12, GOLD); block(sx, 11, 13, GOLD); line(sx, 8, 12, sx, 8, 15, IRON); }
line(0, 7, 14, 0, 7, 18, IRON);
// rudder
for (let z = 11; z <= 17; z++) {
  const top = 9 + R((z - 10) * 1.2);
  for (let y = 9; y <= top; y++) {
    let id = (z >= 14 && z <= 15) ? WHITE : RED;
    if (z === 11 || y === top) id = COPPER;
    block(0, y, z, id);
  }
}
block(0, 18, 17, GOLD);
// stabilizer
cube(-6, 9, 14, 6, 9, 16, PLANKS);
cube(-6, 9, 14, -6, 9, 16, COPPER); cube(6, 9, 14, 6, 9, 16, COPPER);
line(6, 9, 15, 1, 7, 15, IRON); line(-6, 9, 15, -1, 7, 15, IRON);
// skid
line(0, 5, 11, 0, 2, 16, IRON); block(0, 1, 16, GOLD); block(0, 1, 17, GOLD);

// ---------- pusher prop ----------
sphere(0, 7, 19, 1, GOLD);
for (let k = 0; k < 4; k++) {
  const ang = (25 + 90 * k) * PI / 180;
  for (let r = 1.5; r <= 5; r += 0.5) {
    const px = R(r * Math.cos(ang)), py = R(7 + r * Math.sin(ang));
    const id = r > 4.2 ? COPPER : PLANKS;
    block(px, py, 19, id); block(px, py, 20, id);
    if (r < 4) { const nx = R(px - Math.sin(ang)), ny = R(py + Math.cos(ang)); block(nx, ny, 19, id); block(nx, ny, 20, id); }
  }
}
ringXY(0, 7, 21, 6, IRON);
ringXY(0, 7, 21, 6.1, GOLD);
line(6, 7, 21, 1, 7, 16, IRON); line(-6, 7, 21, -1, 7, 16, IRON);
line(0, 13, 21, 0, 8, 16, IRON); line(0, 1, 21, 0, 6, 16, IRON);

// ---------- wheels ----------
wheel(6, 4, 2, 3, 2);
wheel(-7, 4, 2, 3, 2);
for (const s of [-1, 1]) {
  line(2 * s, 5, -1, 6 * s, 4, 2, IRON);
  line(2 * s, 5, 5, 6 * s, 4, 2, IRON);
  line(3 * s, 6, 2, 6 * s, 5, 2, GOLD);
  line(5 * s, 4, 2, 8 * s, 4, 2, GOLD);
}
wheel(0, 3, -9, 2, 1);
line(1, 5, -9, 1, 3, -9, IRON); line(-1, 5, -9, -1, 3, -9, IRON);

// ---------- front gear train ----------
line(0, 8, -9, 0, 8, -12, GOLD);
gearXY(0, 8, -12, 4, 12, GOLD, COPPER, GLOWSTONE);
gearXY(6, 11, -12, 2.5, 9, IRON, IRON, GOLD);
line(6, 11, -12, 3, 9, -8, IRON);
gearXY(-6, 5, -12, 2.5, 9, COPPER, IRON, GOLD);
line(-6, 5, -12, -3, 6, -8, IRON);

// ---------- foreground yards ----------
cube(-13, 0, -11, -9, 0, -6, COBBLE);
cube(-13, 1, -11, -12, 2, -10, PLANKS); cube(-13, 3, -11, -13, 3, -11, PLANKS);
line(-13, 1, -11, -12, 2, -11, IRON); line(-13, 2, -11, -12, 1, -11, IRON);
cylinder(-10, 1, -10, 1, 3, BROWN);
for (const y of [1, 3]) { block(-11, y, -10, IRON); block(-9, y, -10, IRON); block(-10, y, -11, IRON); block(-10, y, -9, IRON); }
cylinder(-11, 1, -8, 1, 2, BROWN);
sphere(-12, 0, -7, 2, BLACK);
line(-10, 1, -6, -10, 2, -6, IRON); disk(-10, 3, -6, 1, IRON); block(-10, 4, -6, FIRE);
lamp(-13, -6);

cube(9, 0, -11, 13, 0, -6, COBBLE);
cylinder(11, 1, -8, 1, 2, IRON);
cylinder(11, 3, -8, 1, 2, COPPER);
line(11, 5, -8, 11, 6, -8, COPPER);
disk(11, 7, -8, 2, GOLD); sphere(11, 8, -8, 1, IRON);
block(11, 10, -8, ELECTRIC); block(13, 8, -8, ELECTRIC); block(9, 8, -8, ELECTRIC);
cube(9, 1, -10, 9, 1, -10, IRON); cube(8, 2, -10, 10, 2, -10, IRON); block(7, 2, -10, IRON);
lamp(13, -6);

// ---------- hangar (background left) ----------
cube(-21, 0, 2, -13, 7, 2, BRICK); cube(-21, 0, 11, -13, 7, 11, BRICK);
cube(-21, 0, 3, -21, 7, 10, BRICK); cube(-13, 0, 3, -13, 7, 10, BRICK);
cube(-21, 0, 2, -13, 0, 2, COBBLE);
cube(-19, 0, 2, -15, 3, 2, BLACK);
line(-19, 4, 2, -15, 4, 2, GOLD); line(-19, 0, 2, -19, 4, 2, GOLD); line(-15, 0, 2, -15, 4, 2, GOLD); line(-17, 0, 2, -17, 3, 2, GOLD);
cube(-21, 5, 2, -20, 6, 2, GLASS); cube(-14, 5, 2, -13, 6, 2, GLASS);
gearXY(-17, 6, 1, 2.5, 9, GOLD, COPPER, IRON);
cube(-22, 8, 1, -12, 8, 12, COPPER);
cube(-20, 9, 3, -14, 9, 10, COPPER);
cube(-18, 10, 4, -16, 10, 9, IRON);
cylinder(-14, 9, 10, 1, 7, BRICK);
block(-14, 16, 10, STEAM); block(-14, 18, 10, STEAM);

// ---------- water tower (background right) ----------
for (const [gx, gz, tx, tz] of [[13, 5, 14, 6], [19, 5, 18, 6], [13, 11, 14, 10], [19, 11, 18, 10]]) line(gx, 0, gz, tx, 8, tz, IRON);
line(14, 4, 6, 18, 4, 6, GOLD); line(14, 4, 10, 18, 4, 10, GOLD); line(14, 4, 6, 14, 4, 10, GOLD); line(18, 4, 6, 18, 4, 10, GOLD);
disk(16, 8, 8, 3, PLANKS);
for (let y = 9; y <= 13; y++) yRing(16, y, 8, 3, (y === 9 || y === 12) ? IRON : PLANKS);
disk(16, 14, 8, 4, COPPER); disk(16, 15, 8, 3, COPPER); disk(16, 16, 8, 2, COPPER); disk(16, 17, 8, 1, COPPER);
block(16, 18, 8, GOLD);
line(16, 9, 5, 16, 9, 3, COPPER); line(16, 9, 3, 16, 5, 3, COPPER); block(16, 4, 3, GOLD);

// ---------- balloon (far background) ----------
const bx = -14, by = 20, bz = 17;
for (let dx = -4; dx <= 4; dx++) for (let dy = -5; dy <= 5; dy++) for (let dz = -4; dz <= 4; dz++) {
  const e = (dx * dx + dz * dz) / 16 + dy * dy / 25;
  if (e <= 1 && e > 0.62) {
    const a = Math.atan2(dz, dx);
    let id = (Math.floor((a + PI) / (PI / 4)) % 2) ? RED : WHITE;
    if (dy === 0) id = GOLD;
    block(bx + dx, by + dy, bz + dz, id);
  }
}
block(bx, by + 5, bz, GOLD);
cube(-15, 10, 16, -13, 11, 18, PLANKS);
for (const [ax, az, cx, cz] of [[-16, 15, -15, 16], [-12, 15, -13, 16], [-16, 19, -15, 18], [-12, 19, -13, 18]]) line(ax, 16, az, cx, 11, cz, IRON);
block(-14, 12, 17, IRON); block(-14, 13, 17, FIRE);