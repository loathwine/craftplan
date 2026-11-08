// airship-sonnet55 — prompt:
// a steampunk airship...

const r = Math.round;
const CY = 23, RX = 17, RY = 8, RZ = 7;

// ---------- BALLOON ENVELOPE ----------
for (let x = -RX; x <= RX; x++) {
  for (let y = CY - RY; y <= CY + RY; y++) {
    for (let z = -RZ; z <= RZ; z++) {
      const v = (x / RX) ** 2 + ((y - CY) / RY) ** 2 + (z / RZ) ** 2;
      if (v > 1) continue;
      const v2 = (x / (RX - 1)) ** 2 + ((y - CY) / (RY - 1)) ** 2 + (z / (RZ - 1)) ** 2;
      if (v2 <= 1) continue;
      let id;
      if (Math.abs(x) >= 15) id = COPPER;
      else if (y === CY) id = IRON;
      else if (Math.abs(y - CY) === 4) id = COPPER;
      else if (x % 8 === 0) id = ((y + z) % 4 === 0) ? GOLD : IRON;
      else id = (Math.floor((x + RX) / 4) % 2 === 0) ? SAND : BRICK;
      block(x, y, z, id);
    }
  }
}
// top valve
cylinder(0, 32, 0, 1, 1, GOLD);
block(0, 33, 0, GOLD);

// ---------- TAIL FINS ----------
const tops = [29, 31, 32, 32, 31, 29];
const spans = [7, 6, 5, 4, 3, 2];
for (let k = 0; k < 6; k++) {
  const x = -14 - k;
  cube(x, 24, 0, x, tops[k], 0, COPPER);
  cube(x, 46 - tops[k], 0, x, 22, 0, COPPER);
  block(x, tops[k], 0, GOLD);
  block(x, 46 - tops[k], 0, GOLD);
  cube(x, 23, -spans[k], x, 23, spans[k], COPPER);
  block(x, 23, -spans[k], GOLD);
  block(x, 23, spans[k], GOLD);
}

// ---------- GEARS ON ENVELOPE ----------
function gear(cx, cy, cz, R, teeth) {
  for (let dx = -R - 2; dx <= R + 2; dx++) {
    for (let dy = -R - 2; dy <= R + 2; dy++) {
      const d = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx);
      const tooth = Math.cos(ang * teeth) > 0.2;
      const outer = R + (tooth ? 1.3 : 0.3);
      if (d <= 0.5) block(cx + dx, cy + dy, cz, GLOWSTONE);
      else if (d <= 1.6) block(cx + dx, cy + dy, cz, GOLD);
      else if (d <= outer && d >= R - 1.0) block(cx + dx, cy + dy, cz, tooth && d > R + 0.4 ? GOLD : IRON);
      else if (d < R - 1.0 && (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))) block(cx + dx, cy + dy, cz, COPPER);
    }
  }
}
gear(-3, 23, -7, 4, 12);
gear(4, 26, -7, 3, 9);

// ---------- HULL ----------
function hw(x) {
  return x <= 0
    ? r(5 * Math.sqrt(Math.max(0, 1 - (x / 15) ** 2)))
    : r(5 * (1 - Math.pow(x / 15.5, 1.8)));
}
function ybot(x) {
  return x <= 0 ? 4 + r(2.5 * (x / 15) ** 2) : 4 + r(3.5 * (x / 15) ** 2);
}
for (let x = -14; x <= 15; x++) {
  const H = hw(x), yb = ybot(x);
  for (let y = yb; y <= 9; y++) {
    const w = Math.max(0, H - Math.floor((9 - y) / 2));
    for (let z = -w; z <= w; z++) {
      if (y === yb) {
        block(x, y, z, z === 0 ? IRON : OAK_LOG);
      } else if (y === 9) {
        block(x, y, z, Math.abs(z) === w ? GOLD : PLANKS);
      } else if (Math.abs(z) === w) {
        let id;
        if (x % 5 === 0) id = IRON;
        else if (y === 7 && x % 3 === 0) id = (x % 6 === 0) ? GLOWSTONE : GLASS;
        else id = (y % 2 === 0) ? OAK_LOG : BROWN;
        block(x, y, z, id);
      } else if (x === -14) {
        block(x, y, z, PLANKS);
      }
    }
  }
  if (x >= -10 && x <= 12) block(x, yb - 1, 0, IRON);
}

// ---------- RAILS & LAMPS ----------
for (let x = -13; x <= 14; x++) {
  const H = hw(x);
  for (const s of [-1, 1]) {
    block(x, 11, s * H, COPPER);
    if (x % 2 === 0) block(x, 10, s * H, GOLD);
  }
}
cube(-14, 11, -2, -14, 11, 2, COPPER);
for (const x of [-6, 6, 12]) {
  for (const s of [-1, 1]) block(x, 12, s * hw(x), GLOWSTONE);
}

// ---------- WHEELHOUSE ----------
cube(-12, 10, -3, -7, 12, -3, BROWN);
cube(-12, 10, 3, -7, 12, 3, BROWN);
cube(-12, 10, -3, -12, 12, 3, BROWN);
cube(-7, 10, -3, -7, 12, 3, BROWN);
for (const [cx, cz] of [[-12, -3], [-12, 3], [-7, -3], [-7, 3]]) cube(cx, 10, cz, cx, 12, cz, OAK_LOG);
cube(-11, 11, -3, -8, 12, -3, GLASS);
cube(-9, 11, -3, -9, 12, -3, GOLD);
cube(-11, 11, 3, -8, 12, 3, GLASS);
cube(-12, 11, -2, -12, 12, 2, GLASS);
cube(-7, 10, 0, -7, 11, 0, AIR);
cube(-13, 13, -4, -6, 13, 4, COPPER);
line(-13, 13, -4, -6, 13, -4, GOLD);
line(-13, 13, 4, -6, 13, 4, GOLD);
line(-13, 13, -4, -13, 13, 4, GOLD);
line(-6, 13, -4, -6, 13, 4, GOLD);
cube(-11, 14, -2, -8, 14, 2, COPPER);
line(-9, 14, 0, -9, 15, 0, GOLD);

// ---------- BOILER ----------
for (let x = -4; x <= 4; x++) {
  const m = (x === -3 || x === 0 || x === 3) ? IRON : COPPER;
  cube(x, 11, -1, x, 11, 1, m);
  block(x, 10, 0, m);
  block(x, 12, 0, m);
}
block(0, 13, 0, GOLD);
block(-5, 11, 0, GOLD);
block(5, 11, 0, GOLD);
block(1, 13, 0, IRON);

function pipe(x, z, y0, y1) {
  for (let y = y0; y <= y1; y++) block(x, y, z, (y - y0) % 3 === 2 ? IRON : COPPER);
  block(x, y1, z, GOLD);
  block(x, y1 + 1, z, STEAM);
}
for (const x of [-1, 2]) {
  line(x, 12, 0, x, 12, -7, COPPER);
  pipe(x, -7, 12, 13);
}
// bow exhaust pipe
line(10, 7, -3, 10, 7, -5, COPPER);
pipe(10, -5, 7, 13);
// wheelhouse exhaust
pipe(-12, -3, 14, 14);
pipe(-12, 3, 14, 14);

// ---------- PROPELLERS ----------
function prop(cx, cy, cz, R, toZ) {
  line(cx, cy, cz, cx, cy, toZ, IRON);
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4, L = (k % 2 === 0) ? R : R - 1;
    const ex = r(cx + L * Math.cos(a)), ey = r(cy + L * Math.sin(a));
    line(cx, cy, cz, ex, ey, cz, (k % 2 === 0) ? IRON : COPPER);
    if (k % 2 === 0) block(ex, ey, cz, GOLD);
  }
  for (let t = 0; t < 24; t++) {
    const a = t * Math.PI / 12;
    block(r(cx + (R + 0.7) * Math.cos(a)), r(cy + (R + 0.7) * Math.sin(a)), cz, COPPER);
  }
  sphere(cx, cy, cz, 1, GOLD);
  block(cx, cy, cz - 2, GOLD);
}
prop(-5, 5, -8, 3, -3);
prop(5, 5, -8, 3, -2);
prop(-5, 5, 8, 3, 3);
prop(5, 5, 8, 3, 2);
// stern propeller (edge-on)
line(-14, 7, 0, -15, 7, 0, IRON);
line(-15, 4, 0, -15, 10, 0, IRON);
line(-15, 7, -3, -15, 7, 3, COPPER);
sphere(-15, 7, 0, 1, GOLD);

// ---------- CANNONS ----------
for (const x of [7, 11]) {
  const H = hw(x);
  for (const s of [-1, 1]) {
    line(x, 10, s * 1, x, 10, s * (H + 3), BLACK);
    block(x, 10, s * (H + 3), IRON);
    block(x, 10, s * (H + 1), IRON);
  }
}

// ---------- DECK CARGO ----------
cylinder(7, 10, 2, 1, 2, OAK_LOG);
disk(7, 11, 2, 1, IRON);
cylinder(9, 10, -2, 1, 2, OAK_LOG);
disk(9, 11, -2, 1, IRON);
cube(10, 10, 1, 11, 11, 2, PLANKS);
block(10, 11, 1, IRON);
block(11, 11, 2, IRON);
cube(-5, 10, 2, -4, 10, 3, PLANKS);

// ---------- BOWSPRIT & FLAG ----------
line(14, 9, 0, 20, 12, 0, COPPER);
line(14, 8, 0, 18, 10, 0, COPPER);
line(20, 12, 0, 20, 17, 0, IRON);
cube(17, 15, 0, 19, 16, 0, RED);
block(18, 15, 0, GOLD);
block(20, 18, 0, GOLD);
block(20, 11, 0, GLOWSTONE);

// ---------- ANCHOR ----------
line(13, 9, -1, 13, 9, -3, IRON);
line(13, 9, -3, 13, 2, -3, IRON);
line(12, 8, -3, 14, 8, -3, IRON);
line(13, 2, -3, 11, 3, -3, IRON);
line(11, 3, -3, 10, 5, -3, IRON);
line(13, 2, -3, 15, 3, -3, IRON);
line(15, 3, -3, 16, 5, -3, IRON);
block(10, 5, -3, GOLD);
block(16, 5, -3, GOLD);

// ---------- ROPE LADDER ----------
for (const x of [-11, -9]) {
  line(x, 11, -4, x, 10, -6, BROWN);
  line(x, 10, -6, x, 1, -6, BROWN);
}
for (let y = 2; y <= 10; y += 2) block(-10, y, -6, OAK_LOG);

// ---------- RIGGING ----------
function bottomY(x, z) {
  const v = 1 - (x / RX) ** 2 - (z / RZ) ** 2;
  return v <= 0 ? CY : CY - RY * Math.sqrt(v);
}
for (const x of [-5, 0, 4, 7, 10, 13]) {
  for (const s of [-1, 1]) {
    const H = hw(x);
    const zt = s * Math.min(5, Math.floor(RZ * Math.sqrt(Math.max(0, 1 - (x / RX) ** 2)) * 0.85));
    const yt = r(bottomY(x, zt)) + 1;
    line(x, 11, s * H, x, yt, zt, BROWN);
  }
}
// bow and stern cables
line(14, 10, 0, 16, 20, 0, BROWN);
line(-13, 13, 0, -13, 19, 0, BROWN);