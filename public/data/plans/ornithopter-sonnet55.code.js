// ornithopter-sonnet55 — prompt:
// Da Vinci's flying machine...

// Da Vinci's flying machine: a wooden ornithopter on a stone dais, with Leonardo beside it
const P = 5;
const yb = z => 5 + (Math.abs(z) >= 6 ? 1 : 0) + (Math.abs(z) >= 8 ? 1 : 0);
const hw = z => Math.round(2.7 * Math.sqrt(Math.max(0, 1 - Math.pow(z / 9.5, 2))));

// clear trees / terrain bumps in the stage area
cylinder(0, 0, 0, 17, 9, AIR);

// ---------- DAIS ----------
disk(0, -1, 0, 16, COBBLE);
for (let x = -11; x <= 11; x++) {
  for (let z = -11; z <= 11; z++) {
    const d = Math.hypot(x, z);
    if (d > 11) continue;
    if (d <= 8.5) block(x, 0, z, ((x + z) & 1) ? LIGHT_GRAY : MARBLE);
    else if (d <= 9.3) block(x, 0, z, COPPER);
    else block(x, 0, z, STONE);
  }
}
for (let k = 0; k < 24; k++) {
  const a = k * Math.PI / 12;
  const x = Math.round(15 * Math.cos(a)), z = Math.round(15 * Math.sin(a));
  cube(x, 0, z, x, 1, z, STONE);
  block(x, 2, z, LIGHT_GRAY);
}

// ---------- TRESTLES ----------
for (const z of [-3, 3]) {
  for (const s of [-1, 1]) {
    cube(s * 2, 1, z, s * 2, 3, z, OAK_LOG);
    line(s * 2, 1, z, 0, 3, z, OAK_LOG);
  }
  cube(-2, 3, z, 2, 3, z, PLANKS);
  cube(-2, 2, z, 2, 2, z, PLANKS);
}
cube(-2, 1, -3, -2, 1, 3, PLANKS);
cube(2, 1, -3, 2, 1, 3, PLANKS);

// ---------- HULL ----------
for (let z = -9; z <= 8; z++) {
  const w = hw(z), y = yb(z);
  const rib = (((z % 3) + 3) % 3) === 0;
  cube(-w, y, z, w, y, z, PLANKS);
  if (w >= 2) cube(-(w - 1), y - 1, z, w - 1, y - 1, z, PLANKS);
  block(0, y - 1, z, OAK_LOG);
  for (const s of [-1, 1]) {
    cube(s * w, y + 1, z, s * w, y + 1, z, rib ? OAK_LOG : PLANKS);
    block(s * w, y + 2, z, (rib && w >= 2) ? GOLD : OAK_LOG);
  }
  if (rib) cube(-w, y + 1, z, w, y + 1, z, OAK_LOG);
}
// stern post & prow
cube(0, 7, 8, 0, 10, 8, OAK_LOG);
line(0, 7, -9, 0, 10, -13, OAK_LOG);
block(0, 10, -13, GOLD);
block(0, 11, -13, GOLD);

// ---------- PILOT (prone) ----------
cube(-1, P + 1, -2, 1, P + 2, 2, BLUE);
cube(-1, P + 1, -5, 1, P + 3, -3, PINK);
block(-1, P + 3, -5, BLACK);
block(1, P + 3, -5, BLACK);
block(0, P + 1, -5, RED);
cube(-1, P + 4, -5, 1, P + 4, -3, RED);
cube(-1, P + 4, -6, 1, P + 4, -6, RED);
block(0, P + 5, -4, RED);
cube(-2, P + 3, -3, -2, P + 3, -3, BROWN);
cube(2, P + 3, -3, 2, P + 3, -3, BROWN);
for (const s of [-1, 1]) {
  cube(s * 2, P + 1, -3, s * 2, P + 2, -1, BLUE);
  block(s * 2, P + 2, -4, PINK);
  for (let z = 3; z <= 7; z++) block(s * 1, yb(z) + 1, z, BROWN);
  block(s * 1, yb(8) + 1, 8, BLACK);
}

// ---------- WINGS ----------
const leadZ = t => Math.round(-4 + 3 * t);
const chordF = t => Math.round(10 - 6 * t);
const wingY = (H, x) => 8 + Math.round(H * Math.pow((x - 3) / 17, 1.4));

for (const sx of [1, -1]) {
  const H = sx === 1 ? 12 : 11;
  for (let x = 3; x <= 20; x++) {
    const t = (x - 3) / 17;
    const lz = leadZ(t);
    const rib = ((x - 3) % 3) === 0;
    const tz = lz + chordF(t) + (rib ? 1 : -1);
    const yA = wingY(H, x);
    const yB = x < 20 ? wingY(H, x + 1) : yA;
    for (let z = lz; z <= tz; z++) {
      const dy = Math.floor(0.6 * (z - lz));
      let lo = yA + dy;
      const hi = Math.max(lo, yB + dy - 1);
      let id = WHITE;
      if (z === lz) { id = OAK_LOG; lo -= 1; }
      else if (rib) id = OAK_LOG;
      else if (z === tz) id = BROWN;
      cube(sx * x, lo, z, sx * x, hi, z, id);
    }
  }
  // wing root posts
  cube(sx * 3, P + 1, -4, sx * 3, 8, -4, OAK_LOG);
  cube(sx * 3, 7, 0, sx * 3, 9, 0, OAK_LOG);
  cube(sx * 3, 7, 4, sx * 3, 11, 4, OAK_LOG);
  // wing tip pennant
  const tipY = wingY(H, 20);
  const lz20 = leadZ(1);
  cube(sx * 20, tipY + 1, lz20, sx * 20, tipY + 5, lz20, OAK_LOG);
  block(sx * 20, tipY + 6, lz20, GOLD);
  cube(sx * 16, tipY + 5, lz20, sx * 19, tipY + 5, lz20, RED);
  cube(sx * 17, tipY + 4, lz20, sx * 19, tipY + 4, lz20, RED);
  cube(sx * 18, tipY + 3, lz20, sx * 19, tipY + 3, lz20, RED);
  // wires: hull -> under spar, apex -> over spar
  for (const x of [9, 14, 19]) {
    const lz = leadZ((x - 3) / 17);
    line(sx * 2, 7, -5, sx * x, wingY(H, x) - 2, lz, GRAY);
    line(0, 19, 2, sx * x, wingY(H, x) + 1, lz, GRAY);
  }
  // crank rods from small gears to the wing
  line(sx * 6, 14, 0, sx * 6, wingY(H, 6) + 1, 0, OAK_LOG);
}

// ---------- A-FRAME MAST + GEARS ----------
for (const z of [2, 3]) {
  line(3, 7, z, 0, 18, z, OAK_LOG);
  line(-3, 7, z, 0, 18, z, OAK_LOG);
}
cube(-2, 11, 2, 2, 11, 3, PLANKS);
block(0, 19, 2, GOLD);
block(0, 18, 3, GOLD);

function gear(cx, cy, z, r) {
  for (let dx = -r - 2; dx <= r + 2; dx++) {
    for (let dy = -r - 2; dy <= r + 2; dy++) {
      const d = Math.hypot(dx, dy);
      if (d <= 1.3) block(cx + dx, cy + dy, z, GOLD);
      else if (d >= r - 0.7 && d <= r + 0.5) block(cx + dx, cy + dy, z, COPPER);
      else if (d < r - 0.7 && (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))) block(cx + dx, cy + dy, z, IRON);
    }
  }
  for (let k = 0; k < 12; k++) {
    const a = k * Math.PI / 6;
    block(Math.round(cx + (r + 1.2) * Math.cos(a)), Math.round(cy + (r + 1.2) * Math.sin(a)), z, IRON);
  }
}
gear(0, 12, 0, 3);
gear(6, 14, 0, 2);
gear(-6, 14, 0, 2);
line(0, 12, 0, 0, 12, 2, GOLD);
line(0, 14, 0, 0, 14, 2, OAK_LOG);

// ---------- TAIL ----------
line(0, 9, 8, 0, 11, 15, OAK_LOG);
for (let z = 9; z <= 15; z++) {
  const h = Math.round(0.7 * (z - 8) + 1);
  const y = 9 + Math.floor((z - 8) * 0.3);
  for (let x = -h; x <= h; x++) {
    const edge = (Math.abs(x) === h || z === 15 || x === 0 || x % 2 === 0 && z % 2 === 0);
    block(x, y, z, edge ? OAK_LOG : WHITE);
  }
  cube(0, y + 1, z, 0, y + 1 + Math.floor((z - 8) * 0.6) + 1, z, RED);
}
line(0, 19, 2, 0, 14, 15, GRAY);   // backstay
line(0, 19, 2, 0, 11, -13, GRAY);  // forestay

// ---------- EASEL WITH VITRUVIAN SKETCH ----------
cube(-14, 3, -8, -6, 11, -8, OAK_LOG);
cube(-13, 4, -9, -7, 10, -9, SAND);
for (let dx = -4; dx <= 4; dx++) {
  for (let dy = -4; dy <= 4; dy++) {
    const d = Math.hypot(dx, dy);
    if (d >= 2.5 && d <= 3.4) block(-10 + dx, 7 + dy, -10, BLACK);
  }
}
line(-12, 5, -10, -8, 5, -10, BLACK);
line(-12, 9, -10, -8, 9, -10, BLACK);
line(-12, 5, -10, -12, 9, -10, BLACK);
line(-8, 5, -10, -8, 9, -10, BLACK);
line(-12, 7, -10, -8, 7, -10, BROWN);
line(-10, 5, -10, -10, 9, -10, BROWN);
block(-10, 9, -10, PINK);
line(-13, 3, -8, -13, 0, -10, OAK_LOG);
line(-7, 3, -8, -7, 0, -10, OAK_LOG);
line(-10, 3, -8, -10, 0, -5, OAK_LOG);

// ---------- AERIAL SCREW MODEL ----------
cube(10, 0, -7, 12, 1, -5, STONE);
cube(11, 2, -6, 11, 10, -6, OAK_LOG);
for (let yy = 2; yy <= 10; yy++) {
  const a = (yy - 2) * 0.7;
  for (let rr = 1; rr <= 3; rr++) {
    block(11 + Math.round(rr * Math.cos(a)), yy, -6 + Math.round(rr * Math.sin(a)), WHITE);
    block(11 + Math.round(rr * Math.cos(a + Math.PI)), yy, -6 + Math.round(rr * Math.sin(a + Math.PI)), SAND);
  }
}
block(11, 11, -6, GOLD);

// ---------- LEONARDO ----------
const cx = 5, fz = -8;
cube(cx - 1, 1, fz - 1, cx + 1, 6, fz + 1, RED);
cube(cx - 2, 5, fz - 1, cx + 2, 6, fz + 1, RED);
cube(cx - 1, 7, fz - 1, cx + 1, 9, fz + 1, PINK);
block(cx - 1, 9, fz - 1, BLACK);
block(cx + 1, 9, fz - 1, BLACK);
cube(cx - 1, 7, fz - 1, cx + 1, 7, fz - 1, WHITE);
cube(cx - 1, 5, fz - 2, cx + 1, 6, fz - 2, WHITE);
block(cx, 4, fz - 2, WHITE);
cube(cx - 2, 8, fz - 1, cx - 2, 9, fz + 1, WHITE);
cube(cx + 2, 8, fz - 1, cx + 2, 9, fz + 1, WHITE);
cube(cx - 1, 7, fz + 1, cx + 1, 9, fz + 1, WHITE);
cube(cx - 2, 10, fz - 1, cx + 2, 10, fz + 1, RED);
cube(cx - 1, 11, fz - 1, cx + 1, 11, fz + 1, RED);
cube(cx + 3, 4, fz - 1, cx + 3, 5, fz, RED);
block(cx + 3, 6, fz - 1, SAND);
block(cx + 3, 6, fz - 2, SAND);
cube(cx - 3, 5, fz, cx - 3, 6, fz, RED);
block(cx - 3, 7, fz, PINK);
cube(cx - 1, 0, fz, cx + 1, 0, fz, BROWN);

// ---------- PROPS ----------
cylinder(9, 0, 8, 1, 3, OAK_LOG);
cylinder(11, 0, 5, 1, 3, OAK_LOG);
cube(9, 3, 8, 9, 3, 8, BROWN);
cube(-11, 0, 6, -10, 1, 7, PLANKS);
cube(-8, 0, 10, -7, 1, 11, PLANKS);
block(-10, 2, 6, OAK_LOG);
for (const lx of [-10, 10]) {
  const lzz = lx < 0 ? -3 : 3;
  cube(lx, 1, lzz, lx, 5, lzz, OAK_LOG);
  block(lx, 6, lzz, GLOWSTONE);
  block(lx, 7, lzz, IRON);
}