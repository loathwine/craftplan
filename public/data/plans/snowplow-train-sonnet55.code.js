// snowplow-train-sonnet55 — prompt:
// a steam train with a snowplow...

// Steam locomotive with snowplow, tender and passenger car; train runs along Z, plow facing north
const blk = (x, y, z, id) => block(Math.round(x), Math.round(y), Math.round(z), id);
const hash = (a, b) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };

// ---------- clear corridor ----------
cube(-10, 0, -22, 10, 16, 22, AIR);

// ---------- track bed ----------
cube(-5, 0, -22, 5, 0, 22, SNOW);
for (let z = -22; z <= 22; z++) {
  if (z % 2 === 0) cube(-4, 0, z, 4, 0, z, PLANKS);
  else cube(-2, 0, z, 2, 0, z, GRAY);
}
cube(3, 1, -22, 3, 1, 22, IRON);
cube(-3, 1, -22, -3, 1, 22, IRON);

// ---------- helpers ----------
function ring(z, cy, id, outer2, inner2) {
  for (let dx = -4; dx <= 4; dx++) for (let dy = -4; dy <= 4; dy++) {
    const d2 = dx * dx + dy * dy;
    if (d2 <= outer2 && d2 > inner2) blk(dx, cy + dy, z, id);
  }
}
function wheel(x, cz, cy, r2, rim, hub) {
  for (let dz = -3; dz <= 3; dz++) for (let dy = -3; dy <= 3; dy++) {
    const d2 = dz * dz + dy * dy;
    if (d2 <= r2) blk(x, cy + dy, cz + dz, d2 <= 1 ? hub : rim);
  }
}

// ---------- SNOWPLOW ----------
const pw = [0, 0, 1, 2, 3, 4];
for (let t = 0; t <= 5; t++) {
  const z = -22 + t, w = pw[t], top = 1 + t;
  for (let x = -w; x <= w; x++) {
    for (let y = 1; y <= top; y++) {
      let id = RED;
      if (y === 1) id = IRON;
      else if (y === top) id = YELLOW;
      else if (Math.abs(x) === w) id = ORANGE;
      blk(x, y, z, id);
    }
  }
}
// plow struts
cube(-4, 2, -17, -4, 2, -16, IRON);
cube(4, 2, -17, 4, 2, -16, IRON);

// ---------- LOCOMOTIVE ----------
// frame
cube(-2, 3, -16, 2, 5, 2, GRAY);
// smokebox
ring(-15, 7, GRAY, 10.5, 0);
ring(-14, 7, GRAY, 10.5, 4.5);
for (let dx = -4; dx <= 4; dx++) for (let dy = -4; dy <= 4; dy++) {
  const d2 = dx * dx + dy * dy;
  if (d2 <= 10.5) blk(dx, 7 + dy, -16, d2 <= 4.5 ? IRON : (d2 <= 6.5 ? GOLD : GRAY));
}
blk(0, 7, -17, GOLD);
// boiler
for (let z = -13; z <= -6; z++) {
  ring(z, 7, (z === -12 || z === -9 || z === -7) ? COPPER : BLACK, 10.5, 4.5);
}
// chimney
cylinder(0, 10, -14, 1, 5, BLACK);
cylinder(0, 15, -14, 2, 1, BLACK);
cylinder(0, 15, -14, 1, 1, AIR);
blk(0, 16, -14, STEAM);
// domes
sphere(0, 10, -11, 1.6, COPPER);
sphere(0, 10, -8, 1.4, GOLD);
blk(0, 12, -11, GOLD);
blk(0, 12, -8, GOLD);
blk(0, 13, -11, STEAM);
// bell + whistle
blk(0, 11, -6, GOLD);
line(-2, 11, -6, -2, 13, -6, GOLD);
// headlamp
cube(-1, 11, -17, 1, 12, -16, BLACK);
blk(0, 10, -17, BLACK);
blk(0, 11, -17, GLOWSTONE);
blk(0, 12, -17, GLOWSTONE);
// running boards + handrails
for (const s of [-1, 1]) {
  cube(s * 4, 7, -16, s * 4, 7, -6, BLACK);
  line(s * 4, 8, -15, s * 4, 8, -7, IRON);
  blk(s * 4, 8, -15, IRON); blk(s * 4, 8, -7, IRON);
  line(s * 3, 9, -15, s * 3, 9, -8, IRON);
  blk(s * 3, 8, -15, IRON); blk(s * 3, 8, -8, IRON);
  // cylinders
  cube(s * 4, 3, -16, s * 5, 5, -13, IRON);
  blk(s * 5, 4, -16, GOLD);
  cube(s * 3, 5, -16, s * 3, 5, -13, IRON);
  blk(s * 5, 5, -15, STEAM);
}

// ---------- CAB ----------
cube(-3, 6, -5, 3, 6, 1, BLACK);
cube(-3, 7, -5, -3, 12, 1, GREEN);
cube(3, 7, -5, 3, 12, 1, GREEN);
cube(-3, 7, -5, 3, 12, -5, GREEN);
cube(-3, 7, 1, 3, 12, 1, GREEN);
cube(-1, 7, 1, 1, 11, 1, AIR);
for (const s of [-3, 3]) cube(s, 9, -3, s, 11, -1, GLASS);
cube(-4, 13, -6, 4, 13, 2, BLACK);
cube(-3, 14, -5, 3, 14, 1, SNOW);
blk(-2, 10, -2, GLOWSTONE); blk(2, 10, -2, GLOWSTONE);
// brass trim
for (const s of [-3, 3]) { cube(s, 12, -5, s, 12, 1, GOLD); }
blk(-4, 12, -5, GLOWSTONE); blk(4, 12, -5, GLOWSTONE);

// ---------- TENDER ----------
cube(-2, 3, 3, 2, 5, 11, GRAY);
cube(-3, 6, 3, 3, 6, 11, BLACK);
cube(-3, 7, 3, -3, 9, 11, BLACK);
cube(3, 7, 3, 3, 9, 11, BLACK);
cube(-3, 7, 3, 3, 10, 3, BLACK);
cube(-3, 7, 11, 3, 9, 11, BLACK);
cube(-2, 7, 4, 2, 8, 10, OBSIDIAN);
cube(-1, 9, 5, 1, 9, 9, OBSIDIAN);
blk(0, 10, 6, SNOW); blk(1, 10, 8, SNOW); blk(-1, 9, 8, SNOW); blk(1, 9, 6, SNOW); blk(-2, 8, 5, SNOW); blk(2, 8, 9, SNOW);
for (const s of [-3, 3]) cube(s, 8, 5, s, 8, 9, GOLD);
cube(-3, 10, 3, 3, 10, 3, GOLD);
line(0, 4, 1, 0, 4, 3, IRON);

// ---------- PASSENGER CAR ----------
cube(-2, 3, 13, 2, 5, 21, GRAY);
cube(-3, 6, 13, 3, 6, 21, BLACK);
cube(-3, 7, 13, -3, 12, 21, BLUE);
cube(3, 7, 13, 3, 12, 21, BLUE);
cube(-2, 7, 13, 2, 12, 13, BLUE);
cube(-2, 7, 21, 2, 12, 21, BLUE);
for (const s of [-3, 3]) {
  cube(s, 8, 13, s, 8, 21, YELLOW);
  for (const z of [14, 15, 19, 20]) cube(s, 9, z, s, 10, z, GLASS);
  cube(s, 7, 16, s, 11, 17, BROWN);
  cube(s, 12, 13, s, 12, 21, LIGHT_BLUE);
  blk(s > 0 ? 2 : -2, 10, 14, GLOWSTONE);
  blk(s > 0 ? 2 : -2, 10, 19, GLOWSTONE);
}
cube(-3, 13, 12, 3, 13, 22, BLACK);
cube(-2, 14, 13, 2, 14, 21, SNOW);
cube(-3, 14, 12, -3, 14, 22, SNOW);
cube(3, 14, 12, 3, 14, 22, SNOW);
// rear platform
cube(-2, 6, 22, 2, 6, 22, BLACK);
for (const s of [-2, 2]) { cube(s, 7, 22, s, 8, 22, IRON); blk(s, 9, 22, NEON_RED); }
// coupling
line(0, 4, 11, 0, 4, 13, IRON);
blk(0, 5, 12, GOLD);

// ---------- WHEELS ----------
for (const s of [-3, 3]) {
  for (const z of [-11, -7, -3]) wheel(s, z, 4, 6.5, RED, IRON);
  wheel(s, -15, 3, 3.5, GRAY, IRON);
  for (const z of [5, 9]) wheel(s, z, 4, 6.5, GRAY, IRON);
  for (const z of [15, 19]) wheel(s, z, 4, 6.5, GRAY, IRON);
}
// coupling rods
line(4, 4, -11, 4, 4, -3, IRON);
line(-4, 4, -11, -4, 4, -3, IRON);
line(4, 5, -13, 4, 4, -11, IRON);
line(-4, 5, -13, -4, 4, -11, IRON);

// ---------- SNOW BANKS ----------
for (let z = -22; z <= 22; z++) {
  for (const s of [-1, 1]) {
    for (let k = 0; k <= 2; k++) {
      const x = s * (6 + k);
      const h = hash(x, z);
      const hgt = Math.floor(h * 1.6 + (z < -10 ? 1.0 : 0.0) - k * 0.6);
      if (hgt >= 0) cube(x, 0, z, x, hgt, z, SNOW);
    }
  }
}
// thrown snow spray from plow
for (const s of [-1, 1]) {
  for (const z0 of [-20, -18, -15]) {
    for (let i = 0; i <= 8; i++) {
      const x = s * (4.5 + i * 0.7 + (z0 + 20) * 0.1);
      const y = 2 + i * 1.2 - i * i * 0.15;
      blk(x, y, z0, SNOW);
      if (i % 2 === 0) blk(x, y + 1, z0 - 1, SNOW);
    }
  }
  sphere(s * 9, 1, -19, 1.6, SNOW);
  sphere(s * 8, 1, -14, 1.3, SNOW);
}

// ---------- SCENERY ----------
function spruce(x, z) {
  cube(x, 0, z, x, 3, z, OAK_LOG);
  disk(x, 3, z, 3, LEAVES);
  disk(x, 4, z, 2, LEAVES);
  disk(x, 5, z, 2, LEAVES);
  disk(x, 6, z, 1, LEAVES);
  disk(x, 7, z, 1, LEAVES);
  blk(x, 8, z, SNOW);
  disk(x, 5, z, 1, SNOW);
}
spruce(-13, -11);
spruce(14, -6);
spruce(-13, 10);

// telegraph poles + wire
for (const z of [-12, 2, 16]) {
  cube(11, 0, z, 11, 11, z, OAK_LOG);
  cube(10, 10, z, 12, 10, z, PLANKS);
}
line(11, 11, -12, 11, 11, 16, IRON);

// signal post with red lamp
cube(-8, 1, -14, -8, 9, -14, IRON);
cube(-9, 9, -14, -7, 10, -14, BLACK);
blk(-8, 10, -15, NEON_RED);