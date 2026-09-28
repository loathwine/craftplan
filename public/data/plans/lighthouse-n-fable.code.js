// lighthouse-n-fable — prompt:
// a lighthouse on a stormy night...

// Lighthouse on a stormy night — rocky headland, tall tapered tower, lantern room,
// keeper's cottage, wrecked boat, crashing waves, lightning in the sky.

// ---------- helpers ----------
function ring(cx, cy, cz, r, id) {
  for (let a = 0; a < 360; a += 4) {
    const x = Math.round(cx + Math.cos(a * Math.PI / 180) * r);
    const z = Math.round(cz + Math.sin(a * Math.PI / 180) * r);
    block(x, cy, z, id);
  }
}
function rnd(seed) { const s = Math.sin(seed * 12.9898) * 43758.5453; return s - Math.floor(s); }

// ---------- clear tree canopy over the site (tower footprint only) ----------
cube(-6, 1, -6, 6, 9, 6, AIR);
cube(-16, 1, -14, -7, 8, -6, AIR);   // keeper cottage area
cube(6, 1, 6, 16, 8, 14, AIR);       // shore / boat area

// ---------- rocky headland ----------
const TX = 0, TZ = 0;          // tower centre
for (let x = -8; x <= 8; x++) {
  for (let z = -8; z <= 8; z++) {
    const d = Math.sqrt(x * x + z * z);
    if (d > 8.5) continue;
    const h = Math.round(2.6 - d * 0.25 + rnd(x * 31 + z * 17) * 0.9);
    const top = Math.max(0, h);
    const id = (rnd(x * 7 + z * 13) > 0.6) ? COBBLE : STONE;
    cube(x, -1, z, x, top, z, id);
    if (rnd(x * 3 + z * 5) > 0.75 && top > 0) block(x, top + 1, z, GRAY);
  }
}
// craggy outcrops on the north face (toward camera)
sphere(-6, 1, -7, 2, STONE);
sphere(5, 1, -8, 2, COBBLE);
sphere(9, 0, -4, 2, STONE);

// ---------- stormy sea (south + east of the rock) ----------
cube(-22, -2, 9, 22, -1, 22, WATER);
cube(9, -2, -22, 22, -1, 8, WATER);
// wave crests and foam
for (let i = 0; i < 40; i++) {
  const x = Math.round(-22 + rnd(i * 2) * 44);
  const z = Math.round(9 + rnd(i * 3 + 1) * 13);
  block(x, 0, z, WATER);
  if (rnd(i * 5) > 0.5) block(x, 0, z + 1, WHITE);
}
for (let i = 0; i < 25; i++) {
  const x = Math.round(9 + rnd(i * 7 + 2) * 13);
  const z = Math.round(-22 + rnd(i * 11 + 3) * 30);
  block(x, 0, z, WATER);
  if (rnd(i * 13) > 0.5) block(x + 1, 0, z, WHITE);
}
// spray where waves hit the rock
for (let i = 0; i < 18; i++) {
  const a = rnd(i * 9) * Math.PI * 2;
  const r = 8 + rnd(i * 4) * 2;
  const x = Math.round(Math.cos(a) * r), z = Math.round(Math.sin(a) * r);
  if (z > 4 || x > 6) { block(x, 1, z, WHITE); if (rnd(i) > 0.5) block(x, 2, z, WHITE); }
}

// ---------- lighthouse tower (tapered, red/white bands) ----------
const baseY = 3;
const H = 24;
for (let y = 0; y < H; y++) {
  const r = 4.2 - y * 0.075;        // taper 4.2 -> ~2.4
  const band = Math.floor(y / 4) % 2 === 0 ? WHITE : RED;
  const yy = baseY + y;
  // shell only
  for (let x = -5; x <= 5; x++) for (let z = -5; z <= 5; z++) {
    const d = Math.sqrt(x * x + z * z);
    if (d <= r + 0.5 && d > r - 0.6) block(x, yy, z, band);
  }
}
// hollow interior (spiral stair)
for (let y = 0; y < H; y++) {
  const a = y * 0.7;
  const x = Math.round(Math.cos(a) * 1.6), z = Math.round(Math.sin(a) * 1.6);
  block(x, baseY + y, z, PLANKS);
}
// plinth
cylinder(0, baseY - 1, 0, 5, 1, COBBLE);
ring(0, baseY, 0, 5, LIGHT_GRAY);
// door on north side
cube(0, baseY, -4, 0, baseY + 2, -4, AIR);
block(0, baseY, -5, PLANKS); block(0, baseY + 1, -5, PLANKS);
cube(-1, baseY + 3, -5, 1, baseY + 3, -4, LIGHT_GRAY);
block(0, baseY + 2, -6, GLOWSTONE);        // door lamp
// windows (north-facing, small, glowing warm)
for (const y of [baseY + 6, baseY + 12, baseY + 18]) {
  const r = 4.2 - (y - baseY) * 0.075;
  const z = -Math.round(r);
  block(0, y, z, GLOWSTONE);
  block(0, y + 1, z, GLASS);
}
// gallery / balcony
const galY = baseY + H;
cylinder(0, galY, 0, 4, 1, LIGHT_GRAY);
ring(0, galY + 1, 0, 4, IRON);
ring(0, galY + 2, 0, 4, IRON);
for (let a = 0; a < 360; a += 30) {
  const x = Math.round(Math.cos(a * Math.PI / 180) * 4), z = Math.round(Math.sin(a * Math.PI / 180) * 4);
  block(x, galY + 1, z, BLACK); block(x, galY + 2, z, BLACK);
}
// lantern room
const lanY = galY + 1;
cylinder(0, lanY, 0, 2, 1, BLACK);
for (let y = lanY + 1; y <= lanY + 3; y++) {
  ring(0, y, 0, 2, GLASS);
  block(2, y, 0, BLACK); block(-2, y, 0, BLACK); block(0, y, 2, BLACK); block(0, y, -2, BLACK);
}
// the light itself — bright, with a beam toward the north-east
sphere(0, lanY + 2, 0, 1, GLOWSTONE);
block(0, lanY + 2, 0, NEON_BLUE);
// beam
for (let i = 1; i <= 14; i++) {
  const x = Math.round(i * 0.55), z = -i, y = lanY + 2 - Math.round(i * 0.12);
  if (i % 2 === 0) block(x, y, z, GLOWSTONE); else block(x, y, z, GLASS);
}
// roof / cupola
cylinder(0, lanY + 4, 0, 3, 1, RED);
cylinder(0, lanY + 5, 0, 2, 1, RED);
cylinder(0, lanY + 6, 0, 1, 1, RED);
block(0, lanY + 7, 0, IRON);
block(0, lanY + 8, 0, IRON);   // lightning rod
block(0, lanY + 9, 0, ELECTRIC);

// ---------- keeper's cottage (west) ----------
const cx = -12, cz = -9, cy = 1;
cube(cx - 3, cy - 1, cz - 3, cx + 3, cy - 1, cz + 3, COBBLE);
cube(cx - 3, cy, cz - 3, cx + 3, cy + 3, cz + 3, WHITE);
cube(cx - 2, cy, cz - 2, cx + 2, cy + 3, cz + 2, AIR);
// stone corners
for (const dx of [-3, 3]) for (const dz of [-3, 3]) cube(cx + dx, cy, cz + dz, cx + dx, cy + 3, cz + dz, COBBLE);
// pitched roof (gable runs E-W)
for (let i = 0; i < 4; i++) {
  cube(cx - 4 + i, cy + 4 + i, cz - 4 + i, cx + 4 - i, cy + 4 + i, cz + 4 - i, i === 3 ? BLACK : GRAY);
}
// door + windows north side
cube(cx, cy, cz - 3, cx, cy + 1, cz - 3, AIR); block(cx, cy, cz - 3, PLANKS);
block(cx - 2, cy + 1, cz - 3, GLOWSTONE); block(cx + 2, cy + 1, cz - 3, GLOWSTONE);
block(cx - 3, cy + 1, cz, GLOWSTONE); block(cx + 3, cy + 1, cz, GLOWSTONE);
// chimney with smoke
cube(cx + 2, cy + 4, cz + 2, cx + 2, cy + 8, cz + 2, BRICK);
block(cx + 2, cy + 9, cz + 2, FIRE);
// path from cottage to tower
for (let i = 0; i <= 8; i++) {
  const x = Math.round(cx + 3 + i * (-(cx + 3) - 4) / 8), z = Math.round(cz + i * (-cz) / 8);
  block(x, 1, z, COBBLE);
}
// fence around cottage garden
for (let x = cx - 5; x <= cx + 5; x++) { if (x % 2 === 0) { block(x, cy, cz - 5, OAK_LOG); block(x, cy, cz + 5, OAK_LOG); } }
for (let z = cz - 5; z <= cz + 5; z++) { if (z % 2 === 0) { block(cx - 5, cy, z, OAK_LOG); block(cx + 5, cy, z, OAK_LOG); } }

// ---------- boathouse + wrecked boat (east shore) ----------
// stone jetty
cube(6, 0, 8, 8, 0, 16, COBBLE);
for (let z = 8; z <= 16; z += 2) { block(6, 1, z, OAK_LOG); block(8, 1, z, OAK_LOG); }
block(8, 2, 16, GLOWSTONE);
// wreck listing in the water
const bx = 14, bz = 6;
cube(bx - 4, 0, bz - 1, bx + 4, 0, bz + 1, PLANKS);
line(bx - 5, 1, bz, bx + 5, 1, bz, PLANKS);
cube(bx - 4, 1, bz - 2, bx + 3, 1, bz - 2, PLANKS);
cube(bx - 4, 1, bz + 2, bx + 3, 1, bz + 2, PLANKS);
cube(bx - 3, 2, bz - 2, bx + 1, 2, bz - 2, BROWN);
cube(bx - 3, 2, bz + 2, bx + 1, 2, bz + 2, BROWN);
cube(bx - 1, 1, bz - 1, bx + 1, 1, bz + 1, AIR);
block(bx + 5, 2, bz, PLANKS); block(bx - 5, 2, bz, PLANKS);   // prow / stern
cube(bx, 2, bz, bx, 9, bz, OAK_LOG);                          // broken mast
line(bx, 9, bz, bx + 3, 6, bz + 1, OAK_LOG);                   // snapped top
// torn sail
for (let y = 3; y <= 7; y++) for (let dz = 0; dz <= 3 - Math.floor((y - 3) / 2); dz++) block(bx, y, bz - 1 - dz, LIGHT_GRAY);
// debris
block(bx + 6, 0, bz + 3, PLANKS); block(bx + 7, 0, bz + 5, OAK_LOG); block(bx - 6, 0, bz + 4, PLANKS);

// ---------- rocks / sea stacks in the water ----------
sphere(16, 0, 14, 2, STONE); cube(16, 2, 14, 16, 3, 14, STONE);
sphere(-14, 0, 15, 2, COBBLE);
sphere(19, 1, -12, 2, STONE); cube(19, 3, -12, 19, 4, -12, GRAY);
sphere(-8, 0, 18, 1, STONE);

// ---------- storm: lightning + rain streaks + dark clouds ----------
// lightning bolt striking the sea to the NE (in view)
const lx = 15, lz = -15;
let ly = 33, px = lx, pz = lz;
while (ly > 0) {
  const nx = px + (rnd(ly * 3) > 0.5 ? 1 : -1) * (rnd(ly * 7) > 0.6 ? 1 : 0);
  const nz = pz + (rnd(ly * 5) > 0.5 ? 1 : -1) * (rnd(ly * 11) > 0.6 ? 1 : 0);
  line(px, ly, pz, nx, ly - 2, nz, ELECTRIC);
  px = nx; pz = nz; ly -= 2;
}
block(px, 1, pz, ELECTRIC);
// second, fainter bolt over the west
let ly2 = 33, px2 = -18, pz2 = -6;
while (ly2 > 20) {
  const nx = px2 + (rnd(ly2 * 13) > 0.5 ? 1 : 0);
  const nz = pz2 - (rnd(ly2 * 17) > 0.5 ? 1 : 0);
  line(px2, ly2, pz2, nx, ly2 - 3, nz, ELECTRIC);
  px2 = nx; pz2 = nz; ly2 -= 3;
}
// low cloud bank (dark gray, ragged) hanging high above
for (let i = 0; i < 12; i++) {
  const x = Math.round(-20 + rnd(i * 19) * 40);
  const z = Math.round(-6 + rnd(i * 23) * 16);
  const r = 2 + Math.round(rnd(i * 29) * 2);
  if (Math.abs(x) < 6 && Math.abs(z) < 6) continue;   // keep clear of lantern
  sphere(x, 31, z, r, GRAY);
  sphere(x + 1, 32, z, r - 1, BLACK);
}
// cloud lit from below by the flash
sphere(lx - 2, 30, lz + 2, 3, LIGHT_GRAY);

// ---------- scattered driftwood + rain-slick highlights on the rock ----------
for (let i = 0; i < 10; i++) {
  const a = rnd(i * 41) * Math.PI * 2, r = 6 + rnd(i * 43) * 2;
  const x = Math.round(Math.cos(a) * r), z = Math.round(Math.sin(a) * r);
  block(x, 2, z, i % 3 === 0 ? OAK_LOG : GRAY);
}