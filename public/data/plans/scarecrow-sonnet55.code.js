// scarecrow-sonnet55 — prompt:
// a creepy scarecrow in a pumpkin patch...

let seed = 20241031;
function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
function hash(x, y, z) { const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return h - Math.floor(h); }

// ---------- clear site + ground pad ----------
cube(-17, 0, -13, 17, 14, 13, AIR);
for (let x = -15; x <= 15; x++) for (let z = -11; z <= 11; z++) {
  const e = x * x / 225 + z * z / 121;
  if (e > 1) continue;
  block(x, -1, z, e < 0.55 ? ((((z % 3) + 3) % 3 === 0) ? BROWN : DIRT) : GRASS);
}

// ---------- SCARECROW ----------
// base mound + straw
disk(0, 0, -1, 3, DIRT);
for (let x = -6; x <= 6; x++) for (let z = -7; z <= 5; z++) {
  const d = Math.hypot(x, z + 1);
  if (d > 2.5 && d < 6 && hash(x, 1, z) > 0.82) block(x, 0, z, YELLOW);
}
// pole
cube(0, -4, -1, 0, 15, -1, OAK_LOG);

// legs
function leg(x0, x1, z0, z1, yBot, off) {
  for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) for (let y = yBot; y <= 7; y++) {
    const h = hash(x + off, y, z);
    if (y === yBot && h > 0.5) continue;
    block(x, y, z, h < 0.15 ? GRAY : BROWN);
  }
  for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) {
    if (hash(x * 3, z * 5, off) > 0.35) {
      const len = 1 + Math.floor(hash(x, z, off + 3) * 3);
      for (let k = 1; k <= len; k++) block(x, yBot - k, z, YELLOW);
    }
  }
}
leg(-3, -1, -2, -1, 2, 1);
leg(1, 3, -2, -1, 4, 7);

// belt
cube(-3, 8, -2, 3, 8, 0, BROWN);
block(0, 8, -3, GOLD);
block(0, 7, -3, BROWN); block(1, 6, -3, BROWN);

// torso
for (let x = -3; x <= 3; x++) for (let y = 9; y <= 15; y++) for (let z = -2; z <= 0; z++) {
  const h = hash(x, y, z);
  if (y === 9 && h > 0.65) continue;
  let id = PURPLE;
  if (h < 0.1) id = BROWN; else if (h < 0.15) id = YELLOW;
  block(x, y, z, id);
}
cube(-3, 10, -2, -2, 11, -2, GREEN);
// X stitching
[[-2, 14], [-1, 13], [0, 12], [1, 11], [2, 10], [2, 14], [1, 13], [-1, 11], [-2, 10]].forEach(p => block(p[0], p[1], -2, BLACK));
// straw bursting out of a rip
[[1, 10], [2, 10], [1, 11], [2, 9], [3, 9]].forEach(p => block(p[0], p[1], -3, YELLOW));
block(2, 8, -4, YELLOW); block(1, 9, -4, YELLOW);

// crossbar + sleeves
cube(-10, 14, -1, 10, 14, -1, OAK_LOG);
cube(-9, 13, -2, -4, 14, -1, PURPLE);
cube(4, 13, -2, 9, 14, -1, PURPLE);
for (let x = 4; x <= 9; x++) if (hash(x, 5, 5) < 0.25) { block(x, 13, -2, BROWN); block(-x, 14, -2, BROWN); }
function thickLine(x1, y1, z1, x2, y2, z2, id) {
  line(x1, y1, z1, x2, y2, z2, id);
  line(x1, y1, z1 - 1, x2, y2, z2 - 1, id);
  line(x1, y1 - 1, z1, x2, y2 - 1, z2, id);
}
// raised east arm with clawed hand
thickLine(9, 14, -1, 12, 19, -1, PURPLE);
cube(11, 19, -2, 13, 21, 0, YELLOW);
block(10, 17, -3, BROWN); block(11, 18, -3, YELLOW);
line(12, 21, -1, 11, 26, -1, OAK_LOG);
line(13, 21, -1, 14, 26, -1, OAK_LOG);
line(12, 21, -2, 12, 27, -2, OAK_LOG);
line(13, 21, 0, 15, 25, 0, OAK_LOG);
line(11, 20, -2, 9, 23, -2, OAK_LOG);
// drooping west arm
thickLine(-9, 14, -1, -12, 9, -1, PURPLE);
cube(-13, 5, -2, -11, 8, 0, YELLOW);
line(-12, 5, -1, -12, 1, -1, OAK_LOG);
line(-13, 5, -2, -14, 1, -2, OAK_LOG);
line(-11, 5, 0, -10, 2, 0, OAK_LOG);
line(-12, 5, -2, -11, 1, -3, OAK_LOG);
line(-13, 6, 0, -15, 3, 0, YELLOW);
line(-10, 13, -2, -10, 10, -2, YELLOW);
line(-8, 12, -3, -8, 10, -3, YELLOW);
line(8, 12, -3, 8, 9, -3, YELLOW);

// straw collar
for (let x = -4; x <= 4; x++) for (let z = -5; z <= 3; z++) {
  const d = Math.hypot(x, z + 1);
  if (d >= 3 && d <= 4.4 && hash(x, 15, z) > 0.25) {
    block(x, 15, z, YELLOW);
    if (hash(x, 16, z) > 0.7) block(x, 16, z, YELLOW);
  }
}

// pumpkin head
const HX = 0, HY = 19, HZ = -1, HA = 4.2, HB = 3.6, HC = 4;
for (let dx = -5; dx <= 5; dx++) for (let dy = -4; dy <= 4; dy++) for (let dz = -5; dz <= 5; dz++) {
  const d = (dx / HA) ** 2 + (dy / HB) ** 2 + (dz / HC) ** 2;
  if (d <= 1) block(HX + dx, HY + dy, HZ + dz, ORANGE);
}
block(HX, HY, HZ, GLOWSTONE);
function headGlow(dx, dy, id) {
  const s = 1 - (dx / HA) ** 2 - (dy / HB) ** 2;
  if (s <= 0) return;
  const k = Math.floor(HC * Math.sqrt(s));
  block(HX + dx, HY + dy, HZ - k, id);
  block(HX + dx, HY + dy, HZ - k + 1, id);
}
[[1, 0], [2, 0], [3, 0], [2, 1], [3, 1], [3, 2]].forEach(p => { headGlow(p[0], p[1], LAVA); headGlow(-p[0], p[1], LAVA); });
headGlow(0, -1, BLACK);
[-3, -2, 0, 1, 3].forEach(dx => headGlow(dx, -2, LAVA));
[-2, -1, 0, 2].forEach(dx => headGlow(dx, -3, LAVA));
headGlow(-3, -1, LAVA); headGlow(3, -1, LAVA);

// hat
disk(0, 22, -1, 6, BLACK);
disk(0, 22, -1, 5, BLACK);
block(-6, 21, -1, BLACK); block(-7, 21, -1, BLACK); block(-5, 21, -3, BLACK); block(-6, 21, 1, BLACK);
block(6, 23, -1, BLACK); block(5, 23, -3, BLACK);
cylinder(0, 23, -1, 3, 3, BLACK);
cylinder(0, 26, -1, 2, 3, BLACK);
cylinder(0, 29, -1, 1, 2, BLACK);
block(1, 31, -1, BLACK); block(2, 31, -1, BLACK); block(3, 30, -1, BLACK); block(4, 29, -1, BLACK); block(4, 28, -1, BLACK);
hollowCylinder(0, 23, -1, 3, 1, RED);
block(0, 23, -4, GOLD); block(1, 23, -4, GOLD);
block(2, 25, -3, YELLOW); block(3, 25, -3, YELLOW); block(-2, 27, -3, YELLOW);

// ---------- PUMPKINS ----------
const P = [
  [-10, -6, 3, 1], [10, -8, 3, 1], [14, 1, 3, 1], [-14, 6, 3, 0], [9, 6, 3, 1],
  [-5, -9, 2, 1], [2, -10, 2, 1], [-3, -5, 2, 0], [4, -6, 2, 0], [-8, 0, 2, 0],
  [9, -1, 2, 1], [-14, -3, 2, 1], [-8, 5, 2, 1], [14, -6, 2, 0], [-3, 9, 2, 0],
  [-6, -2, 1.5, 0], [-7, -11, 1.5, 0], [6, -10, 1.5, 0], [-12, -9, 1.5, 0],
  [-5, 2, 1.5, 0], [12, 5, 1.5, 0], [-2, 8, 1.5, 0], [1, 6, 1.5, 0], [13, -12, 1.5, 0],
  [0, -7, 1, 0], [14, -9, 1, 0], [-16, 1, 1, 0], [11, 9, 1, 0]
];
// vines first
const sorted = P.slice().sort((a, b) => a[0] - b[0]);
for (let i = 0; i < sorted.length - 1; i++) {
  const a = sorted[i], b = sorted[i + 1];
  if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 10) continue;
  const mx = Math.round((a[0] + b[0]) / 2), mz = Math.round((a[1] + b[1]) / 2 + (rnd() * 4 - 2));
  line(a[0], 0, a[1], mx, 0, mz, GREEN);
  line(mx, 0, mz, b[0], 0, b[1], GREEN);
  if (rnd() > 0.4) { cube(mx, 0, mz, mx + 1, 0, mz + 1, LIME); block(mx, 1, mz, GREEN); }
}
function pumpkin(cx, cz, r, face) {
  const a = r, b = Math.max(1, r * 0.8), c = r;
  const cy = Math.round(b);
  const R = Math.ceil(r) + 1;
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
    const y = cy + dy;
    if (y < 0) continue;
    const d = (dx / a) ** 2 + (dy / b) ** 2 + (dz / c) ** 2;
    if (d <= 1.1) block(cx + dx, y, cz + dz, ORANGE);
  }
  const top = cy + Math.floor(b * Math.sqrt(1.1));
  block(cx, top + 1, cz, BROWN);
  if (r >= 2) { block(cx, top + 2, cz, BROWN); block(cx + 1, top + 2, cz, GREEN); }
  if (face && r >= 2) {
    block(cx, cy, cz, GLOWSTONE);
    const glow = (dx, ddy) => {
      const s = 1.1 - (dx / a) ** 2 - (ddy / b) ** 2;
      if (s <= 0) return;
      const k = Math.floor(c * Math.sqrt(s));
      block(cx + dx, cy + ddy, cz - k, LAVA);
      block(cx + dx, cy + ddy, cz - k + 1, LAVA);
    };
    const eyes = r >= 3 ? [[1, 1], [2, 1], [2, 2], [-1, 1], [-2, 1], [-2, 2]] : [[1, 1], [-1, 1]];
    const mouth = r >= 3 ? [[-2, 0], [-1, -1], [0, -1], [1, -1], [2, 0]] : [[-1, -1], [0, -1], [1, -1]];
    eyes.concat(mouth).forEach(p => glow(p[0], p[1]));
  }
}
P.forEach(p => pumpkin(p[0], p[1], p[2], p[3]));

// ---------- CROWS ----------
function crow(x, y, z) {
  cube(x, y, z, x + 1, y + 1, z + 2, BLACK);
  cube(x, y + 1, z - 1, x + 1, y + 2, z - 1, BLACK);
  block(x, y + 1, z - 2, YELLOW);
  cube(x, y + 1, z + 3, x + 1, y + 1, z + 4, BLACK);
  block(x, y, z + 4, BLACK);
}
function flyCrow(x, y, z) {
  cube(x, y, z, x + 1, y + 1, z + 2, BLACK);
  cube(x, y, z - 1, x + 1, y + 1, z - 1, BLACK);
  block(x, y, z - 2, YELLOW);
  cube(x, y, z + 3, x + 1, y, z + 4, BLACK);
  line(x - 1, y + 1, z + 1, x - 6, y + 3, z + 1, BLACK);
  line(x - 1, y + 1, z + 2, x - 5, y + 3, z + 2, BLACK);
  line(x - 1, y + 1, z, x - 4, y + 2, z, BLACK);
  line(x + 2, y + 1, z + 1, x + 7, y + 3, z + 1, BLACK);
  line(x + 2, y + 1, z + 2, x + 6, y + 3, z + 2, BLACK);
  line(x + 2, y + 1, z, x + 5, y + 2, z, BLACK);
}
crow(4, 23, -2);
crow(-7, 15, -2);
flyCrow(-11, 28, -4);
flyCrow(9, 32, -3);
flyCrow(-4, 25, 6);

// ---------- LANTERN POST ----------
cube(7, 0, -4, 7, 7, -4, OAK_LOG);
line(7, 7, -4, 5, 7, -4, OAK_LOG);
hollowCube(4, 3, -5, 6, 5, -3, GLASS);
block(5, 6, -4, IRON); block(5, 2, -4, IRON); block(5, 6, -5, IRON);
block(5, 4, -4, FIRE);

// ---------- HAY BALES ----------
function bale(x, y, z, w, d) {
  cube(x, y, z, x + w - 1, y + 1, z + d - 1, YELLOW);
  [x + 1, x + w - 2].forEach(sx => {
    cube(sx, y + 1, z, sx, y + 1, z + d - 1, BROWN);
    cube(sx, y, z, sx, y + 1, z, BROWN);
  });
}
bale(4, 0, 2, 3, 2);
bale(5, 2, 2, 2, 2);
bale(-11, 0, -1, 3, 2);
crow(5, 4, 2);

// ---------- SKELETAL HANDS ----------
function boneHand(x, z) {
  line(x, -1, z, x, 0, z, WHITE);
  cube(x - 1, 0, z, x + 1, 0, z, WHITE);
  line(x - 1, 1, z, x - 2, 4, z, WHITE);
  line(x, 1, z, x, 5, z, WHITE);
  line(x + 1, 1, z, x + 2, 4, z, WHITE);
  line(x + 2, 0, z, x + 3, 2, z, WHITE);
}
boneHand(-1, -7);
boneHand(12, -4);

// ---------- DEAD CORN ----------
for (let i = 0; i < 16; i++) {
  const x = -15 + i * 2 + Math.floor(rnd() * 2);
  const z = (i % 2 ? 9 : 11) + Math.floor(rnd() * 2);
  const h = 7 + Math.floor(rnd() * 5);
  const lean = Math.floor(rnd() * 3) - 1;
  const sx = y => x + Math.round(lean * y / h);
  for (let y = 0; y < h; y++) block(sx(y), y, z, SAND);
  [2, 4].forEach(ly => {
    const bx = sx(ly);
    block(bx + 1, ly, z, BROWN); block(bx + 2, ly - 1, z, BROWN);
    block(bx - 1, ly + 1, z, BROWN); block(bx - 2, ly, z, BROWN);
    block(bx, ly, z + 1, BROWN);
  });
  block(sx(4), 4, z - 1, YELLOW);
  block(sx(h), h, z, YELLOW); block(sx(h), h + 1, z, SAND);
}

// ---------- BROKEN FENCE ----------
function post(x, z, h, lean) {
  for (let y = 0; y < h; y++) block(x + (y > h - 3 ? lean : 0), y, z, OAK_LOG);
}
function rails(px, fixedZ, alongX) {
  for (let i = 0; i < px.length - 1; i++) {
    const a = px[i], b = px[i + 1];
    [1, 3].forEach(y => {
      if (rnd() > 0.3) {
        if (alongX) line(a, y, fixedZ, b, y, fixedZ, PLANKS); else line(fixedZ, y, a, fixedZ, y, b, PLANKS);
      } else {
        if (alongX) { line(a + 1, y, fixedZ, a + 3, y - 1, fixedZ, PLANKS); } else { line(fixedZ, y, a + 1, fixedZ, y - 1, a + 3, PLANKS); }
      }
    });
  }
}
const fx = [-16, -12, -8, -5];
const fx2 = [5, 8, 12, 16];
fx.concat(fx2).forEach(x => post(x, -12, 4 + Math.floor(rnd() * 2), Math.floor(rnd() * 3) - 1));
rails(fx, -12, true); rails(fx2, -12, true);
const fz = [-8, -4, 0, 4, 8];
fz.forEach(z => { post(-16, z, 4 + Math.floor(rnd() * 2), 1); post(16, z, 4 + Math.floor(rnd() * 2), -1); });
rails(fz, -16, false); rails(fz, 16, false);
crow(-16, 5, -8);

// ---------- DEAD TREE ----------
cylinder(-17, -1, 8, 1, 9, OAK_LOG);
function tw(x1, y1, z1, x2, y2, z2) { line(x1, y1, z1, x2, y2, z2, OAK_LOG); line(x1, y1 + 1, z1, x2, y2 + 1, z2, OAK_LOG); }
tw(-17, 8, 8, -20, 15, 7);
tw(-17, 8, 8, -13, 14, 9);
tw(-17, 9, 8, -17, 19, 8);
line(-20, 15, 7, -22, 19, 6, OAK_LOG);
line(-20, 15, 7, -19, 20, 7, OAK_LOG);
line(-13, 14, 9, -10, 18, 9, OAK_LOG);
line(-13, 14, 9, -14, 19, 10, OAK_LOG);
line(-17, 15, 8, -15, 22, 8, OAK_LOG);
line(-17, 13, 8, -21, 11, 9, OAK_LOG);
line(-17, 17, 8, -19, 23, 7, OAK_LOG);
crow(-14, 20, 9);