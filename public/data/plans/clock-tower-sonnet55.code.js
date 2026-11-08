// clock-tower-sonnet55 — prompt:
// a steampunk clock tower...

const PI = Math.PI, sqrt = Math.sqrt;

function shell(x1, z1, x2, z2, y1, y2, id) {
  cube(x1, y1, z1, x2, y2, z1, id);
  cube(x1, y1, z2, x2, y2, z2, id);
  cube(x1, y1, z1, x1, y2, z2, id);
  cube(x2, y1, z1, x2, y2, z2, id);
}
function hemi(cx, cy, cz, r, id) {
  for (let dx = -r; dx <= r; dx++)
    for (let dy = 0; dy <= r; dy++)
      for (let dz = -r; dz <= r; dz++) {
        const d = sqrt(dx * dx + dy * dy + dz * dz);
        if (d <= r + 0.4 && d > r - 1.1) block(cx + dx, cy + dy, cz + dz, id);
      }
}
function gear(ca, cy, c, r, plane, rim, spoke, hub) {
  const R = r + 1;
  const N = Math.max(8, Math.round(r * 3));
  for (let a = -R; a <= R; a++)
    for (let b = -R; b <= R; b++) {
      const d = sqrt(a * a + b * b);
      let id = null;
      if (d >= r - 0.6 && d <= r + 0.5) id = rim;
      else if (d > r + 0.5 && d <= r + 1.5) {
        const ang = Math.atan2(b, a);
        const k = Math.floor(((ang + PI) / (2 * PI)) * N);
        if (k % 2 === 0) id = rim;
      } else if (d < r - 0.6) {
        if (d <= 1.2) id = hub;
        else if (Math.abs(a) < 0.6 || Math.abs(b) < 0.6 || Math.abs(Math.abs(a) - Math.abs(b)) < 0.6) id = spoke;
      }
      if (id !== null) {
        if (plane === 'z') block(ca + a, cy + b, c, id);
        else block(c, cy + b, ca + a, id);
      }
    }
}

// ---------- clear trees ----------
cube(-11, 0, -11, 11, 12, 9, AIR);
cube(-14, 1, -10, 14, 12, 9, AIR);

// ---------- plaza ----------
for (let x = -12; x <= 12; x++)
  for (let z = -12; z <= 12; z++) {
    const d = sqrt(x * x + z * z);
    if (d > 12.2) continue;
    let id;
    if (d > 11) id = COBBLE;
    else if (d > 9.2 && d <= 10.2) id = COPPER;
    else id = ((x + z) & 1) ? STONE : GRAY;
    block(x, -1, z, id);
  }
cube(-1, -1, -11, 1, -1, -6, RED);

// ---------- base ----------
shell(-5, -5, 5, 5, 0, 4, BRICK);
shell(-5, -5, 5, 5, 0, 0, COBBLE);
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  cube(sx > 0 ? 5 : -6, 0, sz > 0 ? 5 : -6, sx > 0 ? 6 : -5, 4, sz > 0 ? 6 : -5, COBBLE);
}
shell(-5, -5, 5, 5, 2, 2, COBBLE);
cube(-6, 5, -6, 6, 5, 6, COPPER);
shell(-6, -6, 6, 6, 6, 6, IRON);
for (let i = -6; i <= 6; i += 3) {
  block(i, 7, -6, GOLD); block(i, 7, 6, GOLD); block(-6, 7, i, GOLD); block(6, 7, i, GOLD);
}
// door
cube(-1, 0, -5, 1, 3, -5, AIR);
cube(-2, 0, -5, -2, 4, -5, IRON);
cube(2, 0, -5, 2, 4, -5, IRON);
cube(-1, 4, -5, 1, 4, -5, IRON);
cube(-1, -1, -4, 1, -1, -3, RED);
block(0, 4, -3, GLOWSTONE);
// base windows
cube(-4, 3, -5, -3, 3, -5, GLASS);
cube(3, 3, -5, 4, 3, -5, GLASS);
cube(5, 3, -3, 5, 3, -2, GLASS); cube(5, 3, 2, 5, 3, 3, GLASS);
cube(-5, 3, -3, -5, 3, -2, GLASS); cube(-5, 3, 2, -5, 3, 3, GLASS);

// ---------- shaft ----------
shell(-4, -4, 4, 4, 6, 12, BRICK);
shell(-4, -4, 4, 4, 6, 6, COBBLE);
shell(-4, -4, 4, 4, 9, 9, COPPER);
shell(-4, -4, 4, 4, 12, 12, COPPER);
for (const sx of [-1, 1]) for (const sz of [-1, 1]) cube(4 * sx, 6, 4 * sz, 4 * sx, 12, 4 * sz, IRON);
// pendulum window
cube(-1, 7, -4, 1, 11, -4, GLASS);
cube(-2, 7, -4, -2, 11, -4, IRON);
cube(2, 7, -4, 2, 11, -4, IRON);
line(0, 12, -2, 0, 9, -2, IRON);
sphere(0, 8, -2, 1, GOLD);
block(-3, 11, -3, GLOWSTONE);
block(3, 11, -3, GLOWSTONE);
cube(-4, 8, -1, -4, 11, 1, GLASS);

// ---------- corbel + stage ----------
shell(-5, -5, 5, 5, 13, 13, IRON);
cube(-6, 14, -6, 6, 14, 6, COPPER);
for (const sx of [-1, 1]) for (const sz of [-1, 1]) block(6 * sx, 15, 6 * sz, GOLD);
shell(-5, -5, 5, 5, 15, 24, BRICK);
shell(-5, -5, 5, 5, 24, 24, COPPER);
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  cube(5 * sx, 15, 5 * sz, 5 * sx, 24, 5 * sz, IRON);
  block(5 * sx, 24, 5 * sz, GOLD);
}
cube(-6, 25, -6, 6, 25, 6, COPPER);
shell(-6, -6, 6, 6, 25, 25, GOLD);
// eave finials
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  line(6 * sx, 26, 6 * sz, 6 * sx, 28, 6 * sz, IRON);
  block(6 * sx, 29, 6 * sz, GOLD);
}

// ---------- dome ----------
for (let t = 0; t <= 5; t++) {
  const y = 26 + t;
  const r = 6.4 * sqrt(1 - (t / 5.5) * (t / 5.5));
  const inner = t === 5 ? -1 : r - 1.3;
  for (let x = -7; x <= 7; x++)
    for (let z = -7; z <= 7; z++) {
      const d = sqrt(x * x + z * z);
      if (d <= r + 0.3 && d > inner) {
        let id = COPPER;
        const f = Math.atan2(z, x) / (PI / 4);
        const fr = Math.abs(f - Math.round(f));
        if (d * fr * (PI / 4) < 0.6) id = GOLD;
        if (t === 0) id = GOLD;
        block(x, y, z, id);
      }
    }
}
disk(0, 32, 0, 1, GOLD);
block(0, 33, 0, ELECTRIC);
for (const sx of [-1, 1]) {
  line(3 * sx, 31, 3, 3 * sx, 32, 3, IRON);
  block(3 * sx, 33, 3, STEAM);
}

// ---------- clock faces ----------
const CY = 19;
function mapFace(dir, rx, ry, depth) {
  const y = CY + ry;
  if (dir === 'N') return [-rx, y, -6 - depth];
  if (dir === 'S') return [rx, y, 6 + depth];
  if (dir === 'E') return [6 + depth, y, -rx];
  return [-6 - depth, y, rx];
}
function fb(dir, rx, ry, depth, id) {
  const p = mapFace(dir, rx, ry, depth);
  block(p[0], p[1], p[2], id);
}
function drawFace(dir) {
  for (let dx = -5; dx <= 5; dx++)
    for (let dy = -5; dy <= 5; dy++) {
      const d = sqrt(dx * dx + dy * dy);
      if (d <= 4.3) fb(dir, dx, dy, 0, MARBLE);
      else if (d <= 5.3) { fb(dir, dx, dy, 0, GOLD); fb(dir, dx, dy, 1, GOLD); }
    }
  for (let k = 0; k < 12; k++) {
    const a = k * PI / 6;
    const rs = (k % 3 === 0) ? [2.9, 3.3, 3.7] : [3.3, 3.7];
    for (const rr of rs) fb(dir, Math.round(rr * Math.sin(a)), Math.round(rr * Math.cos(a)), 0, BLACK);
  }
  // hands: 10:10
  const p0 = mapFace(dir, 0, 0, 1), p1 = mapFace(dir, -2, 1, 1);
  line(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], BLACK);
  const q0 = mapFace(dir, 0, 0, 2), q1 = mapFace(dir, 3, 2, 2);
  line(q0[0], q0[1], q0[2], q1[0], q1[1], q1[2], BLACK);
  const q2 = mapFace(dir, 1, 1, 2);
  block(q2[0], q2[1], q2[2], BLACK);
  fb(dir, 0, 0, 2, GOLD);
}
['N', 'S', 'E', 'W'].forEach(drawFace);

// ---------- gears ----------
gear(-8, 9, -7, 3, 'z', COPPER, IRON, GOLD);
gear(-13, 12, -7, 2, 'z', IRON, IRON, COPPER);
gear(10, 10, -7, 4, 'z', GOLD, COPPER, IRON);
gear(15, 15, -7, 2, 'z', COPPER, COPPER, GOLD);
line(-8, -1, -7, -8, 9, -7, IRON);
line(-13, -1, -7, -13, 12, -7, IRON);
line(10, -1, -7, 10, 10, -7, IRON);
line(15, -1, -7, 15, 15, -7, IRON);
gear(-1, 9, 5, 2, 'x', GOLD, IRON, COPPER);
gear(4, 9, 5, 2, 'x', COPPER, IRON, GOLD);

// ---------- boilers & pipes ----------
// west boiler
hollowCylinder(-10, 0, 0, 3, 8, COPPER);
disk(-10, 7, 0, 3, COPPER);
hemi(-10, 8, 0, 3, COPPER);
hollowCylinder(-10, 2, 0, 3, 1, GOLD);
hollowCylinder(-10, 6, 0, 3, 1, GOLD);
block(-10, 4, -3, GLASS);
block(-11, 4, -3, GOLD); block(-9, 4, -3, GOLD); block(-10, 5, -3, GOLD); block(-10, 3, -3, GOLD);
line(-10, 12, 0, -10, 16, 0, IRON);
hollowCylinder(-10, 15, 0, 1, 1, COPPER);
block(-10, 17, 0, STEAM);
// east boiler
hollowCylinder(10, 0, 1, 2, 10, IRON);
disk(10, 9, 1, 2, IRON);
hemi(10, 10, 1, 2, IRON);
hollowCylinder(10, 3, 1, 2, 1, COPPER);
hollowCylinder(10, 7, 1, 2, 1, COPPER);
line(10, 13, 1, 10, 17, 1, IRON);
hollowCylinder(10, 16, 1, 1, 1, COPPER);
block(10, 18, 1, STEAM);
// pipes
line(-7, 3, 0, -5, 3, 0, COPPER);
block(-6, 3, 0, IRON);
line(-7, 8, 0, -5, 8, 0, COPPER);
line(8, 3, 1, 5, 3, 1, COPPER);
block(7, 3, 1, IRON);
for (const z of [-2, 2]) {
  line(-5, 6, z, -5, 12, z, COPPER);
  block(-5, 8, z, IRON); block(-5, 11, z, IRON);
}
// rear vent
line(-5, 6, 5, -5, 9, 5, IRON);
hollowCylinder(-5, 8, 5, 1, 1, COPPER);
block(-5, 10, 5, STEAM);

// ---------- tesla coils & lamps ----------
for (const [x, z] of [[-11, -4], [11, -4]]) {
  cube(x - 1, 0, z - 1, x + 1, 0, z + 1, COBBLE);
  line(x, 1, z, x, 6, z, IRON);
  hollowCylinder(x, 2, z, 1, 1, COPPER);
  hollowCylinder(x, 4, z, 1, 1, COPPER);
  sphere(x, 7, z, 1, GOLD);
  block(x, 9, z, ELECTRIC);
}
for (const x of [-3, 3]) {
  line(x, 0, -8, x, 3, -8, IRON);
  block(x, 4, -8, GLOWSTONE);
  block(x, 3, -9, GOLD);
}