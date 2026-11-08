// time-machine-sonnet55 — prompt:
// H.G. Wells' time machine...

// H.G. Wells' Time Machine: a Victorian sled with a clock-ring halo, set on a clockface dais
const hyp = Math.hypot;
const R = Math.round;
const D2R = Math.PI / 180;

// ---------- clear site ----------
cube(-19, 0, -15, 19, 12, 15, AIR);
cube(-12, 13, -8, 12, 28, 14, AIR);

// ---------- dais ----------
for (let x = -14; x <= 14; x++) for (let z = -14; z <= 14; z++) {
  const d = hyp(x, z);
  if (d > 13.4) continue;
  block(x, -2, z, d < 12.5 ? COBBLE : STONE);
  block(x, -1, z, COBBLE);
  if (d <= 12.5) {
    let id;
    if (d > 11.4) id = COBBLE;
    else if (d > 9.6 && d <= 10.4) id = GRAY;
    else if (d > 4.2 && d <= 4.9) id = GRAY;
    else id = ((x + z) & 1) ? STONE : LIGHT_GRAY;
    block(x, 0, z, id);
  }
}
for (let i = 0; i < 12; i++) {
  const a = i * 30 * D2R;
  block(R(10 * Math.sin(a)), 0, R(-10 * Math.cos(a)), GOLD);
  block(R(4.5 * Math.sin(a)), 0, R(-4.5 * Math.cos(a)), BRICK);
}

// ---------- machine: sled ----------
for (const sx of [-5, 4]) {
  cube(sx, 1, -8, sx + 1, 1, 8, IRON);
  cube(sx, 1, -9, sx + 1, 1, -9, IRON);
  cube(sx, 2, -10, sx + 1, 3, -10, IRON);
  cube(sx, 4, -9, sx + 1, 4, -9, IRON);
  cube(sx, 5, -9, sx + 1, 5, -9, GOLD);
}
for (const z of [-6, -2, 2, 6]) cube(-3, 1, z, 3, 1, z, COPPER);
cube(-5, 2, -7, 5, 2, 7, PLANKS);
line(-5, 2, -7, 5, 2, -7, GOLD);
line(-5, 2, 7, 5, 2, 7, GOLD);
line(-5, 2, -7, -5, 2, 7, GOLD);
line(5, 2, -7, 5, 2, 7, GOLD);
for (let z = -5; z <= 5; z += 2) { block(-5, 3, z, GOLD); block(5, 3, z, GOLD); }

// side quartz-rod railings
for (const sx of [-5, 5]) {
  for (const z of [-6, -3, 0, 3]) line(sx, 3, z, sx, 4, z, GLASS);
  line(sx, 5, -6, sx, 5, 3, COPPER);
}

// ---------- seat + traveller ----------
cube(-1, 3, 0, 1, 3, 2, IRON);
cube(-2, 4, -1, 2, 4, 2, BROWN);
cube(-2, 5, 2, 2, 8, 2, BROWN);
block(-2, 8, 2, AIR); block(2, 8, 2, AIR);
for (const x of [-1, 1]) {
  block(x, 6, 2, GOLD); block(x, 8, 2, GOLD);
}
// legs
for (const x of [-1, 1]) {
  cube(x, 5, -2, x, 5, 0, BLACK);
  cube(x, 3, -2, x, 4, -2, BLACK);
  block(x, 3, -3, BROWN);
  block(x, 4, -3, BROWN);
}
// torso
cube(-1, 5, 0, 1, 8, 1, GRAY);
line(0, 5, 0, 0, 7, 0, YELLOW);
block(0, 8, 0, RED);
// arms reaching levers
for (const x of [-2, 2]) {
  cube(x, 7, 0, x, 8, 0, GRAY);
  block(x, 6, -1, GRAY);
  block(x, 6, 0, GRAY);
  block(x, 6, -2, PINK);
}
// head + hat
cube(-1, 9, 0, 1, 10, 1, PINK);
block(-1, 10, 0, BLACK); block(1, 10, 0, BLACK);
block(-1, 9, 0, BROWN); block(1, 9, 0, BROWN);
cube(-2, 11, -1, 2, 11, 2, BLACK);
cube(-1, 12, 0, 1, 12, 1, RED);
cube(-1, 13, 0, 1, 14, 1, BLACK);

// ---------- control panel ----------
cube(-3, 3, -4, 3, 6, -4, COPPER);
cube(-3, 6, -4, 3, 6, -4, GOLD);
cube(-3, 3, -4, -3, 6, -4, GOLD);
cube(3, 3, -4, 3, 6, -4, GOLD);
for (let x = -2; x <= 2; x++) for (let y = 3; y <= 6; y++) {
  const d = hyp(x, y - 4.5);
  if (d <= 2.2) block(x, y, -5, d > 1.8 ? BLACK : WHITE);
}
line(0, 4, -6, 1, 5, -6, RED);
block(0, 4, -6, GOLD);
block(-3, 4, -5, NEON_BLUE); block(-3, 5, -5, GOLD);
block(3, 4, -5, NEON_RED); block(3, 5, -5, GOLD);
// levers
for (const x of [-2, 2]) {
  line(x, 3, -2, x, 7, -3, IRON);
  block(x, 8, -3, MARBLE);
}
// front quartz rods with electric tips
for (const x of [-4, 4]) {
  line(x, 3, -4, x, 8, -4, IRON);
  block(x, 9, -4, GOLD);
  line(x, 10, -4, x, 13, -4, GLASS);
  block(x, 14, -4, ELECTRIC);
}

// ---------- the great clock ring ----------
const RCY = 16;
for (let x = -11; x <= 11; x++) for (let y = RCY - 11; y <= RCY + 11; y++) {
  const d = hyp(x, y - RCY);
  if (d >= 8 && d <= 9.5) { block(x, y, 4, GOLD); block(x, y, 5, COPPER); }
  if (d >= 9 && d <= 9.5) block(x, y, 3, IRON);
  if (d >= 5.5 && d < 6.4) { block(x, y, 4, IRON); block(x, y, 5, COPPER); }
  if (d < 5.5) block(x, y, 5, ICE);
}
for (let k = 0; k < 8; k++) {
  const a = k * 45 * D2R;
  for (let r = 1.5; r <= 5.5; r += 0.5) block(R(r * Math.cos(a)), R(RCY + r * Math.sin(a)), 4, IRON);
}
sphere(0, RCY, 4, 1.8, GOLD);
block(0, RCY, 3, GLOWSTONE);
block(0, RCY, 2, GOLD);
line(0, RCY, 2, 5, 21, 2, IRON);   // minute hand
line(0, RCY, 2, -3, 19, 2, GOLD);  // hour hand
line(0, RCY, 2, -1, 14, 2, IRON);  // tail
block(5, 21, 2, NEON_BLUE);
for (let i = 0; i < 12; i++) {
  const a = i * 30 * D2R;
  const x = R(8.75 * Math.sin(a)), y = R(RCY + 8.75 * Math.cos(a));
  block(x, y, 3, MARBLE);
  if (i % 3 === 0) block(x, y, 2, NEON_BLUE);
}
// ring mounts
for (const s of [-1, 1]) {
  line(s * 5, 3, 4, s * 6, 9, 4, COPPER);
  line(s * 5, 3, 5, s * 6, 9, 5, COPPER);
  line(s * 4, 3, 5, s * 5, 6, 5, COPPER);
}
cube(-1, 3, 4, 1, 6, 5, IRON);
cube(-2, 3, 3, 2, 3, 6, GOLD);
// ring electrics
block(-10, RCY, 4, ELECTRIC);
block(10, RCY, 4, ELECTRIC);
block(0, 26, 4, ELECTRIC);
// steam vents
for (const x of [-3, 3]) {
  line(x, 3, 6, x, 6, 6, COPPER);
  block(x, 7, 6, STEAM);
}
block(0, 3, 7, STEAM);

// ---------- time vortex behind ring ----------
let cnt = 0;
for (let k = 0; k < 3; k++) for (let t = 0; t < 15; t += 0.1) {
  const r = 0.6 * t + 1;
  const a = t * 0.5 + k * 2.094;
  const x = R(r * Math.cos(a)), y = R(RCY + r * Math.sin(a));
  const id = r < 3 ? WHITE : r < 5 ? LIGHT_BLUE : r < 7 ? CYAN : r < 8.5 ? BLUE : PURPLE;
  cnt++;
  block(x, y, 8, (cnt % 45 === 0) ? NEON_BLUE : id);
  if (r > 3) block(x + 1, y, 8, id);
  if (r > 5) block(x, y + 1, 9, id);
}

// ---------- hourglass (past/future) ----------
const hx = -16, hz = 0;
disk(hx, -1, hz, 4.5, COBBLE);
cylinder(hx, 0, hz, 3.6, 2, OAK_LOG);
cylinder(hx, 15, hz, 3.6, 2, OAK_LOG);
for (let y = 2; y <= 14; y++) {
  const r = 0.7 + 2.4 * Math.abs(y - 8) / 6;
  for (let dx = -4; dx <= 4; dx++) for (let dz = -4; dz <= 4; dz++) {
    const d = hyp(dx, dz);
    if (d <= r + 0.5 && d > r - 0.7) block(hx + dx, y, hz + dz, GLASS);
    else if (d <= r - 0.7) {
      if (y <= 5 && y <= 2 + 3.5 * (1 - d / 3)) block(hx + dx, y, hz + dz, SAND);
      if (y >= 9 && y <= 12) block(hx + dx, y, hz + dz, SAND);
    }
  }
}
for (let y = 6; y <= 10; y++) block(hx, y, hz, SAND);
for (const a of [90, 210, 330]) {
  const px = hx + R(3.9 * Math.cos(a * D2R)), pz = hz + R(3.9 * Math.sin(a * D2R));
  line(px, 2, pz, px, 14, pz, OAK_LOG);
  block(px, 15, pz, GOLD);
}
block(hx, 17, hz, GOLD);
block(hx, 18, hz, GOLD);

// ---------- grandfather clock ----------
cube(13, -1, -2, 19, -1, 5, COBBLE);
cube(14, 0, 0, 18, 2, 3, PLANKS);
cube(15, 3, 0, 17, 10, 3, OAK_LOG);
cube(16, 4, 1, 16, 9, 2, AIR);
cube(16, 4, 0, 16, 9, 0, GLASS);
line(16, 9, 1, 16, 5, 1, GOLD);
block(16, 4, 1, GOLD);
cube(14, 11, 0, 18, 16, 3, OAK_LOG);
for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
  if (hyp(dx, dy) <= 2.4) block(16 + dx, 13 + dy, 0, WHITE);
}
block(16, 15, 0, BLACK); block(16, 11, 0, BLACK); block(14, 13, 0, BLACK); block(18, 13, 0, BLACK);
line(16, 13, -1, 16, 15, -1, BLACK);
line(16, 13, -1, 15, 12, -1, BLACK);
cube(13, 17, -1, 19, 17, 4, PLANKS);
cube(14, 18, 1, 18, 18, 2, PLANKS);
cube(15, 19, 1, 17, 19, 2, PLANKS);
block(16, 20, 1, GOLD);

// ---------- lamp posts ----------
function lamp(x, z) {
  cube(x - 1, 0, z - 1, x + 1, 0, z + 1, IRON);
  line(x, 1, z, x, 8, z, IRON);
  cube(x - 1, 9, z - 1, x + 1, 11, z + 1, GLASS);
  cube(x, 9, z, x, 10, z, GLOWSTONE);
  cube(x - 1, 12, z - 1, x + 1, 12, z + 1, IRON);
  block(x, 13, z, IRON);
  block(x, 14, z, GOLD);
}
lamp(-8, -9);
lamp(8, -9);

// ---------- gears ----------
function gearXY(cx, cy, cz, r, id) {
  const m = Math.ceil(r + 2);
  for (let dx = -m; dx <= m; dx++) for (let dy = -m; dy <= m; dy++) {
    const d = hyp(dx, dy);
    const ang = Math.atan2(dy, dx);
    const outer = r + (Math.cos(ang * 8) > 0.3 ? 0.9 : 0);
    if (d <= outer && (d >= r * 0.65 || d <= 1.2 || Math.abs(dx) < 0.6 || Math.abs(dy) < 0.6)) {
      block(cx + dx, cy + dy, cz, id);
    }
  }
  block(cx, cy, cz - 1, GOLD);
}
gearXY(-9, 4, -4, 3.5, COPPER);
gearXY(9, 3, -6, 2.5, GOLD);
function gearFlat(cx, cz, r, id) {
  const m = Math.ceil(r + 2);
  for (let dx = -m; dx <= m; dx++) for (let dz = -m; dz <= m; dz++) {
    const d = hyp(dx, dz);
    const ang = Math.atan2(dz, dx);
    const outer = r + (Math.cos(ang * 10) > 0.3 ? 0.9 : 0);
    if (d <= outer && (d >= r * 0.6 || d <= 1.2 || Math.abs(dx) < 0.6 || Math.abs(dz) < 0.6)) {
      block(cx + dx, 1, cz + dz, id);
    }
  }
  block(cx, 2, cz, GOLD);
}
gearFlat(0, -11, 3, COPPER);
gearFlat(-3, -12, 1, IRON);

// ---------- floating time motes ----------
let s = 12345;
const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
const motes = [CYAN, LIGHT_BLUE, WHITE, NEON_BLUE, GLOWSTONE, ICE];
for (let i = 0; i < 70; i++) {
  const x = R(-18 + rnd() * 36), y = R(5 + rnd() * 22), z = R(-13 + rnd() * 25);
  const id = motes[Math.floor(rnd() * motes.length)];
  if (hyp(x, y - 16, z - 4) < 11) continue;
  if (Math.abs(x) > 11 && y < 22) continue;
  block(x, y, z, id);
}