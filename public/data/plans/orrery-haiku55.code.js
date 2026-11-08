// orrery-haiku55 — prompt:
// a giant brass orrery of the solar system...

// Brass orrery of the solar system: gold armillary sun, tilted orbital rails,
// planets with moons, asteroid belt, support arms, clockwork gears, steam engine, telescope.

const CY = 18;             // sun height
const KY = 0.75, KZ = 0.66; // orbital plane tilt, face-on to the north

const M = new Map();
function put(x, y, z, id) {
  const X = Math.round(x), Y = Math.round(y), Z = Math.round(z);
  if (X < -22 || X > 22 || Z < -22 || Z > 22 || Y < -8 || Y > 33) return;
  M.set(X + ',' + Y + ',' + Z, [X, Y, Z, id]);
}
const pick = (id, dx, dy, dz) => (typeof id === 'function' ? id(dx, dy, dz) : id);

function disc(cx, y, cz, rIn, rOut, id) {
  const R = Math.ceil(rOut);
  for (let dx = -R; dx <= R; dx++)
    for (let dz = -R; dz <= R; dz++) {
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d <= rOut + 0.001 && d > rIn) put(cx + dx, y, cz + dz, pick(id, dx, 0, dz));
    }
}

function ball(cx, cy, cz, r, id, minD = -1) {
  const R = Math.ceil(r) + 1;
  for (let dx = -R; dx <= R; dx++)
    for (let dy = -R; dy <= R; dy++)
      for (let dz = -R; dz <= R; dz++) {
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d <= r + 0.3 && d > minD) put(cx + dx, cy + dy, cz + dz, pick(id, dx, dy, dz));
      }
}

function lineP(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) * 2) || 1;
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    put(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, z1 + (z2 - z1) * f, id);
  }
}

// point on a circle lying in the tilted orbital plane
function inPlane(cx, cy, cz, rr, t) {
  return [cx + rr * Math.cos(t), cy + KY * rr * Math.sin(t), cz + KZ * rr * Math.sin(t)];
}
function ringPath(cx, cy, cz, rr, id, density = 2.5) {
  const n = Math.ceil(2 * Math.PI * rr * density);
  for (let i = 0; i < n; i++) {
    const p = inPlane(cx, cy, cz, rr, (2 * Math.PI * i) / n);
    put(p[0], p[1], p[2], id);
  }
}
const pos = (R, t) => inPlane(0, CY, 0, R, t).map(v => Math.round(v));
const rnd = i => { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

// 1. Clear scrub around the site (AIR is free)
for (let y = 0; y <= 9; y++)
  for (let x = -9; x <= 9; x++)
    for (let z = -9; z <= 9; z++)
      if (x * x + z * z <= 81) put(x, y, z, AIR);

// 2. Foundation and stepped plinth
disc(0, -1, 0, -1, 8.5, STONE);
disc(0, 0, 0, -1, 7.5, OAK_LOG);
disc(0, 0, 0, 7.5, 8.5, MARBLE);
disc(0, 1, 0, -1, 6.5, PLANKS);
disc(0, 1, 0, 6.5, 7.5, GOLD);
disc(0, 2, 0, -1, 5.5, BROWN);
disc(0, 2, 0, 5.5, 6.5, GOLD);

// lamp posts around the plinth
for (let k = 0; k < 8; k++) {
  const a = (k * Math.PI) / 4;
  const x = Math.round(6 * Math.cos(a)), z = Math.round(6 * Math.sin(a));
  for (let y = 3; y <= 6; y++) put(x, y, z, GOLD);
  put(x, 7, z, GLOWSTONE);
}

// 3. Central column and sun with armillary cage
for (let y = 3; y <= 11; y++)
  for (let dx = -1; dx <= 1; dx++)
    for (let dz = -1; dz <= 1; dz++) put(dx, y, dz, GOLD);
disc(0, 3, 0, -1, 2.5, COPPER);
disc(0, 11, 0, -1, 2.2, COPPER);
for (let y = 12; y <= 13; y++) put(0, y, 0, GOLD);

ball(0, CY, 0, 2.5, GLOWSTONE);
ball(0, CY, 0, 4.5, GOLD, 3.5);

// armillary rings around the sun: equator plus two meridians
for (let i = 0; i < 72; i++) {
  const t = (2 * Math.PI * i) / 72, c = 5.8;
  put(c * Math.cos(t), CY, c * Math.sin(t), GOLD);
  put(c * Math.cos(t), CY + c * Math.sin(t), 0, GOLD);
  put(0, CY + c * Math.sin(t), c * Math.cos(t), GOLD);
}

// 4. Axis through the sun and two support posts on the outer rail
lineP(5, CY, 0, 20, CY, 0, GOLD);
lineP(-5, CY, 0, -19, CY, 0, GOLD);
const ex = Math.round(19.5), wx = Math.round(-19.5);
for (const x of [ex, wx]) {
  for (let y = 0; y <= 17; y++) put(x, y, 0, GOLD);
  disc(x, -1, 0, -1, 1.5, STONE);
}

// 5. Orbital rails (two blocks thick)
[7, 9.5, 12, 14.5, 17, 19.5].forEach(R => {
  ringPath(0, CY, 0, R - 0.5, GOLD);
  ringPath(0, CY, 0, R + 0.5, GOLD);
});

// 6. Asteroid belt between Mars and Jupiter
for (let i = 0; i < 90; i++) {
  const R = 15.75 + (rnd(i) - 0.5) * 1.4;
  const t = rnd(i + 300) * 2 * Math.PI;
  const p = inPlane(0, CY, 0, R, t);
  const id = rnd(i + 700) < 0.5 ? COBBLE : STONE;
  put(p[0], p[1], p[2], id);
  if (rnd(i + 900) > 0.6) put(p[0] + 1, p[1], p[2], id);
}

// 7. Planets, moons, rings
// Mercury
{
  const [x, y, z] = pos(7, 0.35);
  ball(x, y, z, 1, GRAY);
}
// Venus
{
  const [x, y, z] = pos(9.5, 1.9);
  ball(x, y, z, 1.8, (dx, dy, dz) => (Math.abs(dx * 7 + dy * 13 + dz * 5) % 9 === 0 ? ORANGE : YELLOW));
}
// Earth with moon
{
  const [x, y, z] = pos(12, 3.6);
  ball(x, y, z, 2, (dx, dy, dz) => (Math.sin(dx * 1.3) + Math.cos(dy * 1.7 + dz * 0.9) > 0.9 ? GREEN : BLUE));
  const m = inPlane(x, y, z, 4, 1.0).map(v => Math.round(v));
  put(m[0], m[1], m[2], LIGHT_GRAY);
}
// Mars
{
  const [x, y, z] = pos(14.5, 2.6);
  ball(x, y, z, 1.5, (dx, dy, dz) => ((Math.abs(dx) + Math.abs(dz)) % 3 === 0 ? BROWN : RED));
}
// Jupiter with bands, great spot and four moons
{
  const [x, y, z] = pos(17, 4.2);
  ball(x, y, z, 3.2, (dx, dy, dz) => {
    if (dy === -1 && dx >= 0 && dx <= 1 && dz < 0) return RED;
    return Math.abs(dy) % 2 === 0 ? ORANGE : BROWN;
  });
  [0.3, 1.9, 3.5, 5.1].forEach(t => {
    const m = inPlane(x, y, z, 5.5, t).map(v => Math.round(v));
    put(m[0], m[1], m[2], LIGHT_GRAY);
  });
}
// Saturn with sand ring
{
  const [x, y, z] = pos(19.5, 2.2);
  ball(x, y, z, 2.4, (dx, dy, dz) => (dy === 0 ? SAND : YELLOW));
  for (let rr = 3.8; rr <= 5.6; rr += 0.6) ringPath(x, y, z, rr, SAND, 3);
}
// Uranus
{
  const [x, y, z] = pos(19.5, 0.9);
  ball(x, y, z, 1.6, (dx, dy, dz) => (dy === 0 ? CYAN : LIGHT_BLUE));
}

// 8. Comet with ice head and white tail
ball(-15, 26, -5, 1, ICE);
lineP(-15, 26, -5, -21, 31, -9, WHITE);

// 9. Clockwork gears behind the orrery
function gear(cx, cy, z, R, teeth) {
  for (let dx = -R - 1; dx <= R + 1; dx++)
    for (let dy = -R - 1; dy <= R + 1; dy++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d >= R - 1 && d <= R) put(cx + dx, cy + dy, z, GOLD);
    }
  for (let k = 0; k < teeth; k++) {
    const a = (2 * Math.PI * k) / teeth;
    put(cx + Math.round((R + 1.2) * Math.cos(a)), cy + Math.round((R + 1.2) * Math.sin(a)), z, GOLD);
  }
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++)
      if (dx * dx + dy * dy <= 1) put(cx + dx, cy + dy, z, COPPER);
  for (let k = 0; k < 3; k++) {
    const a = (k * 2 * Math.PI) / 3 + 0.3;
    lineP(cx, cy, z, cx + (R - 1) * Math.cos(a), cy + (R - 1) * Math.sin(a), z, COPPER);
  }
}
gear(-16, 8, 15, 4, 12);
lineP(-16, 0, 15, -16, 7, 15, COBBLE);
gear(-9, 4, 15, 3, 8);
lineP(-9, 0, 15, -9, 2, 15, COBBLE);

// 10. Steam engine at back right
disc(13, -1, 13, -1, 2.5, STONE);
for (let y = 0; y <= 4; y++) disc(13, y, 13, -1, 2.5, (y === 1 || y === 3) ? GOLD : COPPER);
disc(13, 5, 13, -1, 2.8, GOLD);
for (let y = 6; y <= 10; y++) disc(13, y, 13, -1, 1, COPPER);
put(13, 11, 13, STEAM);
put(13, 11, 12, STEAM);
gear(18, 4, 13, 3, 10);
lineP(18, 0, 13, 18, 2, 13, COBBLE);

// 11. Brass telescope at front right
lineP(8, 0, -10, 10, 5, -8, IRON);
lineP(12, 0, -10, 10, 5, -8, IRON);
lineP(10, 0, -5, 10, 5, -8, IRON);
lineP(10, 5, -8, 14, 9, -12, GOLD);
lineP(10, 6, -8, 14, 10, -12, GOLD);
put(14, 9, -13, GLASS);
put(14, 10, -13, GLASS);

// 12. Cobblestone path from the front of the plinth
for (let x = -1; x <= 1; x++)
  for (let z = -14; z <= -9; z++) put(x, -1, z, COBBLE);

// Flush everything (later writes at a cell overwrite earlier ones)
for (const [x, y, z, id] of M.values()) block(x, y, z, id);