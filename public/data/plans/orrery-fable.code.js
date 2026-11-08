// orrery-fable — prompt:
// a giant brass orrery of the solar system...

// Giant brass orrery of the solar system
// Camera from north (-Z). Sun at center, Mercury..Neptune on arms at increasing radii/heights.

// ---- helpers ----
function ring(cx, cy, cz, r, id) {
  const steps = Math.max(24, Math.round(r * 8));
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    block(Math.round(cx + Math.cos(a) * r), cy, Math.round(cz + Math.sin(a) * r), id);
  }
}
function ringThick(cx, cy, cz, r, id) { ring(cx, cy, cz, r, id); ring(cx, cy, cz, r - 0.6, id); }
function arm(cx, cy, cz, ang, len, id) {
  const ex = cx + Math.cos(ang) * len, ez = cz + Math.sin(ang) * len;
  line(Math.round(cx), cy, Math.round(cz), Math.round(ex), cy, Math.round(ez), id);
  return [Math.round(ex), Math.round(ez)];
}
function post(x, y1, z, h, id) { line(x, y1, z, x, y1 + h, z, id); }
function fillet(x, y, z, id) {
  block(x + 1, y, z, id); block(x - 1, y, z, id); block(x, y, z + 1, id); block(x, y, z - 1, id);
}

// ---- site clearing (only where the pedestal + low orbits sit) ----
cube(-14, 0, -14, 14, 6, 14, AIR);
// clear a bit more around tall tree clumps that overlap the mechanism
cube(-22, 1, -22, 22, 9, -16, AIR);
cube(-22, 1, 16, 22, 9, 22, AIR);

// ---- pedestal: tiered circular base ----
disk(0, -1, 0, 13, OBSIDIAN);
disk(0, 0, 0, 12, OBSIDIAN);
ring(0, 0, 0, 12, GOLD);
disk(0, 1, 0, 10, OBSIDIAN);
ring(0, 1, 0, 10, COPPER);
disk(0, 2, 0, 8, OBSIDIAN);
ring(0, 2, 0, 8, GOLD);
// inlaid zodiac ring on top tier: alternating gold/copper studs
for (let i = 0; i < 24; i++) {
  const a = (i / 24) * Math.PI * 2;
  block(Math.round(Math.cos(a) * 6.5), 3, Math.round(Math.sin(a) * 6.5), i % 2 ? GOLD : COPPER);
}
// four clawed feet beyond base
for (const [fx, fz] of [[-12, -12], [12, -12], [-12, 12], [12, 12]]) {
  cube(fx - 1, -1, fz - 1, fx + 1, 0, fz + 1, COPPER);
  block(fx, 1, fz, GOLD);
}

// ---- central column / drive housing ----
hollowCylinder(0, 3, 0, 3, 3, COPPER);
cylinder(0, 3, 0, 2, 3, OBSIDIAN);
ring(0, 6, 0, 3, GOLD);
// gear ring details on the housing
for (let i = 0; i < 16; i++) {
  const a = (i / 16) * Math.PI * 2;
  block(Math.round(Math.cos(a) * 4), 4, Math.round(Math.sin(a) * 4), GOLD);
}
// big visible gear wheel at the front (north side) of the housing
const gy = 4, gz = -6;
for (let r of [3, 2]) ring(0, gy, gz, r, GOLD);
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2;
  block(Math.round(Math.cos(a) * 4), gy, Math.round(gz + Math.sin(a) * 4), COPPER);
}
block(0, gy, gz, IRON);
line(0, gy, gz, 0, gy, -3, IRON);
// crank handle on the east side
line(4, 5, 0, 7, 5, 0, IRON);
block(7, 5, 0, GOLD); block(7, 6, 0, GOLD); block(7, 7, 0, GOLD);
block(7, 7, -1, COPPER);

// ---- central axis up to the sun ----
cylinder(0, 7, 0, 1, 6, GOLD);
line(0, 7, 0, 0, 13, 0, IRON);
ring(0, 9, 0, 2, COPPER);
ring(0, 12, 0, 2, COPPER);

// ---- the Sun ----
const SY = 17;
sphere(0, SY, 0, 4, GOLD);
hollowSphere(0, SY, 0, 3, LAVA);
sphere(0, SY, 0, 2, GLOWSTONE);
// solar rays
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2 + 0.2;
  const dx = Math.cos(a), dz = Math.sin(a);
  line(Math.round(dx * 4), SY, Math.round(dz * 4), Math.round(dx * 6), SY, Math.round(dz * 6), GOLD);
}
line(0, SY + 4, 0, 0, SY + 6, 0, GOLD);
block(0, SY + 7, 0, GLOWSTONE);
// fire wisps around the sun
block(5, SY + 2, -2, FIRE); block(-5, SY + 2, 2, FIRE); block(2, SY + 5, -4, FIRE); block(-3, SY + 5, 3, FIRE);

// ---- orbital rings (brass hoops, stacked, increasing radius) ----
// each: radius, height, planet angle (radians, 0=+X), planet block, planet radius, moons
const planets = [
  { r: 6,  y: 12, a: -1.9, id: LIGHT_GRAY, pr: 0, name: 'mercury' },
  { r: 9,  y: 11, a: -0.8, id: ORANGE,     pr: 1, name: 'venus' },
  { r: 12, y: 10, a: -1.3, id: BLUE,       pr: 1, name: 'earth', moon: WHITE },
  { r: 15, y: 9,  a: -2.6, id: RED,        pr: 1, name: 'mars' },
  { r: 18, y: 8,  a: -0.35, id: BROWN,     pr: 2, name: 'jupiter', moons: 3 },
  { r: 21, y: 7,  a: -2.1, id: YELLOW,     pr: 2, name: 'saturn', rings: true },
];
for (const p of planets) {
  ringThick(0, p.y, 0, p.r, p.r > 12 ? COPPER : GOLD);
  // sleeve on the central axis + arm out to the planet
  ring(0, p.y, 0, 2, IRON);
  const [px, pz] = arm(0, p.y, 0, p.a, p.r, GOLD);
  // joint on the hoop, post up to the planet
  block(px, p.y, pz, IRON);
  const h = 2 + p.pr;
  post(px, p.y + 1, pz, h - 1, IRON);
  const py = p.y + h + p.pr;
  if (p.pr === 0) {
    block(px, py, pz, p.id);
    block(px, py - 1, pz, COPPER);
  } else {
    sphere(px, py, pz, p.pr, p.id);
    if (p.name === 'earth') {
      // continents
      block(px + 1, py, pz, GREEN); block(px, py + 1, pz, GREEN); block(px - 1, py, pz - 1, GREEN);
      // moon on small arm
      line(px, py, pz, px + 2, py + 1, pz - 2, IRON);
      block(px + 3, py + 1, pz - 3, WHITE);
    }
    if (p.name === 'jupiter') {
      // bands + great red spot
      ring(px, py, pz, 2, ORANGE);
      block(px, py, pz - 2, RED);
      block(px - 1, py, pz - 2, RED);
      // galilean moons on short arms
      const ma = [0.3, 1.8, 3.6];
      for (let i = 0; i < ma.length; i++) {
        const mx = px + Math.round(Math.cos(ma[i]) * (3 + i)), mz = pz + Math.round(Math.sin(ma[i]) * (3 + i));
        line(px, py, pz, mx, py, mz, IRON);
        block(mx, py, mz, i === 1 ? LIGHT_GRAY : WHITE);
      }
    }
    if (p.name === 'saturn') {
      // equatorial bands
      ring(px, py, pz, 2, SAND);
      // rings (tilted-ish: two flat hoops)
      ring(px, py, pz, 4, GOLD);
      ring(px, py, pz, 5, COPPER);
      ring(px, py + 1, pz, 3, GOLD);
    }
    if (p.name === 'mars') {
      block(px, py + 1, pz, WHITE); // polar cap
      block(px + 1, py, pz - 1, ORANGE);
    }
    if (p.name === 'venus') {
      block(px, py + 1, pz, YELLOW);
    }
  }
}

// ---- Uranus & Neptune: hang on outer decorative support arc above (budget-light) ----
const outer = [
  { ang: -0.6, y: 24, id: CYAN, r: 1 },
  { ang: -2.4, y: 26, id: BLUE, r: 1 },
];
for (const o of outer) {
  const ox = Math.round(Math.cos(o.ang) * 19), oz = Math.round(Math.sin(o.ang) * 19);
  // curved brass support arc from the sun mast up and out
  line(0, SY + 3, 0, Math.round(ox * 0.5), o.y + 3, Math.round(oz * 0.5), COPPER);
  line(Math.round(ox * 0.5), o.y + 3, Math.round(oz * 0.5), ox, o.y + 3, oz, COPPER);
  post(ox, o.y + 1, oz, 2, IRON);
  sphere(ox, o.y, oz, o.r, o.id);
  if (o.id === CYAN) ring(ox, o.y, oz, 3, IRON); // Uranus thin ring
}

// ---- four pillars supporting the outermost hoop (gives structure and lattice) ----
for (const a of [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75]) {
  const x = Math.round(Math.cos(a) * 21), z = Math.round(Math.sin(a) * 21);
  cube(x - 1, -2, z - 1, x + 1, 0, z + 1, OBSIDIAN);
  post(x, 1, z, 5, COPPER);
  block(x, 7, z, GOLD);
  // brace back to pedestal rim
  const bx = Math.round(Math.cos(a) * 12), bz = Math.round(Math.sin(a) * 12);
  line(x, 1, z, bx, 3, bz, IRON);
}

// ---- small engraved plaque at the front ----
cube(-3, 1, -11, 3, 3, -11, COPPER);
cube(-2, 2, -11, 2, 2, -11, GOLD);
block(0, 3, -11, OBSIDIAN);

// ---- steam vents from the drive housing ----
block(-3, 7, 1, STEAM);
block(3, 7, -1, STEAM);