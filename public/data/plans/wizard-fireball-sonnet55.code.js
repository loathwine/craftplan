// wizard-fireball-sonnet55 — prompt:
// a wizard casting a fireball...

let s = 20241;
function rnd() { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }
function b(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (Math.abs(x) > 22 || Math.abs(z) > 22 || y < -8 || y > 33) return;
  block(x, y, z, id);
}
function thickLine(x1, y1, z1, x2, y2, z2, r, id) {
  const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
  const n = Math.max(1, Math.ceil(d * 1.2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    sphere(Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t), Math.round(z1 + (z2 - z1) * t), r, id);
  }
}
function ring(cx, cz0, r, id) {
  const n = Math.ceil(r * 9);
  for (let i = 0; i < n; i++) {
    const a = 2 * Math.PI * i / n;
    b(cx + r * Math.cos(a), 0, cz0 + r * Math.sin(a), id);
  }
}
function platform(cx, cz0, r) {
  for (let x = -Math.ceil(r); x <= Math.ceil(r); x++) {
    for (let z = -Math.ceil(r); z <= Math.ceil(r); z++) {
      if (x * x + z * z <= r * r) {
        b(cx + x, -1, cz0 + z, COBBLE);
        b(cx + x, 0, cz0 + z, rnd() < 0.3 ? COBBLE : STONE);
      }
    }
  }
}

const cz = 3;
const F = { x: 10, y: 22, z: -14 };
const R = (y) => 5 - (y - 1) * (2 / 14);

// ---------- site prep ----------
cylinder(0, 0, cz, 9.5, 10, AIR);
cylinder(10, 0, -13, 9, 10, AIR);
platform(0, cz, 8.5);
platform(10, -13, 8);

// ---------- magic circle under the fireball ----------
ring(10, -13, 7, ORANGE);
ring(10, -13, 6.5, ORANGE);
ring(10, -13, 4.2, YELLOW);
ring(10, -13, 2.4, RED);
const hex = [];
for (let k = 0; k < 6; k++) {
  const a = Math.PI / 2 + k * Math.PI / 3;
  hex.push([Math.round(10 + 6 * Math.cos(a)), Math.round(-13 + 6 * Math.sin(a))]);
}
for (let k = 0; k < 6; k++) {
  const p = hex[k], q = hex[(k + 2) % 6];
  line(p[0], 0, p[1], q[0], 0, q[1], RED);
}
for (let k = 0; k < 6; k++) b(hex[k][0], 0, hex[k][1], LAVA);
disk(10, 0, -13, 1, LAVA);
for (let k = 0; k < 6; k += 2) b(hex[k][0], 1, hex[k][1], FIRE);
// scorch rubble
for (let i = 0; i < 14; i++) {
  const a = rnd() * 6.28, r = 7.8 * Math.sqrt(rnd());
  b(10 + r * Math.cos(a), 1, -13 + r * Math.sin(a), pick([COBBLE, OBSIDIAN, GRAY]));
}
// golden ring around the wizard
ring(0, cz, 7.2, GOLD);
ring(0, cz, 6.2, BLUE);

// ---------- wizard robe ----------
for (let y = 1; y <= 15; y++) cylinder(0, y, cz, R(y), 1, BLUE);
hollowCylinder(0, 1, cz, 5.4, 1, GOLD);
hollowCylinder(0, 2, cz, 5.2, 1, LIGHT_BLUE);
hollowCylinder(0, 9, cz, R(9) + 0.5, 1, GOLD);
hollowCylinder(0, 15, cz, 3.4, 1, GOLD);
// front strip + stars
const surf = (x, y) => cz - Math.floor(Math.sqrt(Math.max(0, R(y) * R(y) - x * x)));
for (let y = 2; y <= 14; y++) if (y !== 9) block(0, y, surf(0, y), GOLD);
for (const [x, y] of [[-3, 5], [2, 3], [3, 7], [-2, 11], [2, 12], [-3, 13], [-2, 3], [3, 11]]) {
  block(x, y, surf(x, y), YELLOW);
}
block(0, 9, surf(0, 9) - 1, YELLOW);
cube(1, 3, surf(1, 5) - 1, 2, 8, surf(1, 5) - 1, RED); // hanging sash
block(1, 2, surf(1, 4) - 1, GOLD); block(2, 2, surf(1, 4) - 1, GOLD);
// shoulders
cube(-4, 14, cz - 2, 4, 15, cz + 2, BLUE);
// boots
cube(-3, 1, cz - 7, -1, 1, cz - 5, BROWN);
cube(-3, 2, cz - 6, -1, 2, cz - 5, BROWN);
cube(1, 1, cz - 8, 3, 1, cz - 6, BROWN);
cube(1, 2, cz - 7, 3, 2, cz - 6, BROWN);

// ---------- head ----------
cylinder(0, 16, cz, 1.8, 2, SAND);
sphere(0, 19, cz, 2.7, SAND);
block(-1, 19, cz - 2, NEON_BLUE);
block(1, 19, cz - 2, NEON_BLUE);
block(0, 19, cz - 3, PINK);
cube(-2, 20, cz - 2, -1, 20, cz - 1, WHITE);
cube(1, 20, cz - 2, 2, 20, cz - 1, WHITE);
cube(-2, 18, cz - 3, 2, 18, cz - 2, WHITE); // moustache
block(-3, 17, cz - 2, WHITE); block(3, 17, cz - 2, WHITE);
for (const [y, hw, zf] of [[17, 2, 3], [16, 2, 4], [15, 2, 4], [14, 1, 4], [13, 1, 4], [12, 0, 4]]) {
  cube(-hw, y, cz - zf, hw, y, cz - 2, WHITE);
}
block(0, 11, cz - 4, WHITE);
// hair
cube(-3, 17, cz - 1, -3, 20, cz + 1, WHITE);
cube(3, 17, cz - 1, 3, 20, cz + 1, WHITE);
cube(-2, 17, cz + 2, 2, 20, cz + 3, WHITE);

// ---------- hat ----------
disk(0, 21, cz, 5.6, BLUE);
disk(0, 21, cz, 4.2, BLUE);
const hatC = (i) => (i > 5 ? (i - 5) * (i - 5) * 0.12 : 0);
const hatR = (i) => 3.6 - i * 0.3;
for (let i = 0; i <= 10; i++) cylinder(hatC(i), 22 + i, cz, hatR(i), 1, BLUE);
hollowCylinder(0, 22, cz, 3.9, 1, GOLD);
block(0, 22, cz - 4, YELLOW);
for (const [x, i] of [[-1, 3], [1, 5], [0, 7], [-1, 8]]) {
  const r = hatR(i), cx = Math.round(hatC(i));
  const dz = Math.floor(Math.sqrt(Math.max(0, r * r - (x - cx) * (x - cx))));
  block(x, 22 + i, cz - dz, YELLOW);
}
hollowCylinder(0, 21, cz, 5.8, 1, GOLD);

// ---------- left arm + staff ----------
thickLine(-4, 15, cz, -6, 14, 2, 1.6, BLUE);
thickLine(-6, 14, 2, -7, 12, 2, 1.6, BLUE);
sphere(-7, 12, 2, 1.2, SAND);
for (let y = 1; y <= 27; y++) b(-8, y, 2, OAK_LOG);
for (let y = 1; y <= 27; y += 6) { b(-8, y, 1, BROWN); b(-8, y, 3, BROWN); }
hollowCylinder(-8, 26, 2, 1.6, 1, GOLD);
for (const [dx, dz] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) {
  b(-8 + dx, 27, 2 + dz, GOLD);
  b(-8 + dx, 28, 2 + dz, GOLD);
  b(-8 + dx, 29, 2 + dz, GOLD);
}
sphere(-8, 29, 2, 1.5, NEON_BLUE);
hollowSphere(-8, 29, 2, 2.5, GLASS);
b(-8, 32, 2, ELECTRIC); b(-11, 29, 2, ELECTRIC); b(-5, 30, 2, ELECTRIC); b(-8, 29, -1, ELECTRIC);

// ---------- cat familiar ----------
cube(-6, 1, -1, -5, 3, 0, BLACK);
cube(-6, 4, -2, -5, 5, -1, BLACK);
b(-6, 6, -1, BLACK); b(-5, 6, -1, BLACK);
b(-6, 5, -2, LIME); b(-5, 5, -2, LIME);
line(-5, 1, 1, -4, 1, 2, BLACK);
line(-4, 1, 2, -3, 2, 2, BLACK);
line(-3, 2, 2, -3, 4, 2, BLACK);

// ---------- pillars with braziers ----------
cylinder(-6, 1, 8, 1.7, 1, MARBLE);
cylinder(-6, 2, 8, 1, 9, MARBLE);
hollowCylinder(-6, 11, 8, 2, 1, IRON);
cube(-7, 11, 7, -5, 11, 9, IRON);
b(-6, 12, 8, FIRE); b(-6, 13, 8, FIRE);
cylinder(6, 1, 8, 1.7, 1, MARBLE);
cylinder(6, 2, 8, 1, 6, MARBLE);
cube(5, 8, 7, 7, 8, 8, MARBLE);
b(6, 9, 8, MARBLE);
for (let i = 0; i < 8; i++) b(6 + Math.round((rnd() - 0.5) * 6), 1, 8 + Math.round((rnd() - 0.2) * 4), pick([COBBLE, MARBLE, STONE]));

// ---------- fireball ----------
for (let x = -7; x <= 7; x++) for (let y = -7; y <= 7; y++) for (let z = -7; z <= 7; z++) {
  const d = Math.sqrt(x * x + y * y + z * z);
  const bump = 5.2 + (rnd() - 0.5) * 1.3;
  if (d > bump) continue;
  let id;
  if (d <= 1.8) id = GLOWSTONE;
  else if (d <= 3.2) id = YELLOW;
  else if (d <= 4.2) id = rnd() < 0.5 ? ORANGE : RED;
  else id = rnd() < 0.5 ? LAVA : ORANGE;
  b(F.x + x, F.y + y, F.z + z, id);
}
// flame tendrils
for (let k = 0; k < 14; k++) {
  let dx = (rnd() - 0.5) * 1.6, dy = rnd() * 0.9 + 0.1, dz = rnd() * 0.9;
  const m = Math.sqrt(dx * dx + dy * dy + dz * dz);
  dx /= m; dy /= m; dz /= m;
  const len = 3 + rnd() * 2;
  const p = (t) => [F.x + dx * t, F.y + dy * t, F.z + dz * t];
  const a = p(4.6), c = p(5 + len * 0.5), e = p(5 + len);
  line(a[0], a[1], a[2], c[0], c[1], c[2], LAVA);
  line(c[0], c[1], c[2], e[0], e[1], e[2], ORANGE);
  b(e[0], e[1], e[2], FIRE);
}
// floating embers
for (let i = 0; i < 26; i++) {
  const a = rnd() * 6.28, el = (rnd() - 0.3) * 1.6, r = 7 + rnd() * 3.5;
  const x = F.x + r * Math.cos(a) * Math.cos(el), y = F.y + r * Math.sin(el), z = F.z + r * Math.sin(a) * Math.cos(el);
  if (y < 2 || y > 33) continue;
  b(x, y, z, pick([ORANGE, YELLOW, RED, ORANGE]));
}
// sparks between hand and ball
for (const [x, y, z] of [[8, 19, -10], [9, 20, -11], [7, 20, -11], [6, 19, -10]]) b(x, y, z, YELLOW);

// ---------- casting arm + hand (placed after the ball) ----------
thickLine(4, 15, cz, 6, 15, -2, 1.6, BLUE);
thickLine(6, 15, -2, 7, 16, -6, 1.6, BLUE);
sphere(7, 16, -6, 2, GOLD);
sphere(7, 16, -8, 1.3, SAND);
for (const [x, y] of [[5, 17], [6, 18], [7, 18], [8, 18], [9, 17]]) b(x, y, -9, SAND);
b(9, 16, -8, SAND); b(10, 16, -8, SAND);
b(7, 19, -9, FIRE); b(5, 18, -9, FIRE); b(9, 18, -9, FIRE);