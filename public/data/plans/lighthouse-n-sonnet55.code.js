// lighthouse-n-sonnet55 — prompt:
// a lighthouse on a stormy night...

// Lighthouse on a stormy night
let s = 90210;
const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
const noise = (x, z) => Math.sin(x * 1.3 + z * 0.7) + Math.cos(x * 0.6 - z * 1.1) * 0.8 + Math.sin((x + z) * 2.1) * 0.3;
const H = (x, z) => {
  const d = Math.hypot(x * 0.85, (z - 2) * (z < 2 ? 1.15 : 0.85));
  return 5.2 - 0.6 * d + 0.7 * noise(x, z);
};
const rr = (y) => Math.round(5.3 - 0.065 * y);
const walls = (x1, z1, x2, z2, y1, y2, id) => {
  cube(x1, y1, z1, x2, y2, z1, id);
  cube(x1, y1, z2, x2, y2, z2, id);
  cube(x1, y1, z1, x1, y2, z2, id);
  cube(x2, y1, z1, x2, y2, z2, id);
};

// ---------- clear site (trees) ----------
cylinder(0, 0, 2, 15, 10, AIR);
cube(-22, 0, -22, 22, 9, -9, AIR);

// ---------- sea ----------
cube(-22, -1, -22, 22, -1, -7, WATER);
for (let i = 0; i < 110; i++) {
  const x = Math.floor(-21 + rnd() * 42), z = Math.floor(-21 + rnd() * 13);
  block(x, 0, z, rnd() < 0.7 ? WATER : WHITE);
}
// sea stacks
sphere(15, -1, -12, 3, STONE);
sphere(-16, -1, -11, 3, STONE);
sphere(11, -1, -19, 2, COBBLE);
sphere(-4, -1, -20, 2, STONE);
sphere(-20, -1, -18, 2, COBBLE);
for (let i = 0; i < 26; i++) {
  const a = rnd() * 6.28;
  const c = [[15, -12], [-16, -11], [11, -19]][i % 3];
  block(Math.round(c[0] + Math.cos(a) * 4), 0, Math.round(c[1] + Math.sin(a) * 4), rnd() < 0.5 ? WHITE : SNOW);
}

// ---------- headland ----------
for (let x = -13; x <= 13; x++) {
  for (let z = -11; z <= 15; z++) {
    const hh = H(x, z);
    if (hh >= 0) {
      const top = Math.floor(hh);
      cube(x, 0, z, x, top, z, STONE);
      if (z > 2 && top <= 2) block(x, top, z, GRASS);
      else block(x, top, z, rnd() < 0.5 ? COBBLE : (rnd() < 0.5 ? GRAY : STONE));
    } else if (hh > -1.4 && z < -3) {
      block(x, -1, z, rnd() < 0.6 ? WHITE : SNOW);
      if (rnd() < 0.3) block(x, 0, z, WHITE);
    }
  }
}
sphere(8, 1, -3, 3, STONE);
sphere(-8, 1, -4, 2.5, COBBLE);
sphere(6, 0, -8, 2, STONE);
sphere(-6, 0, -8, 2, GRAY);
for (let i = 0; i < 10; i++) {
  const x = Math.floor(-9 + rnd() * 18), z = Math.floor(-8 + rnd() * 5);
  cube(x, 1, z, x, 2 + Math.floor(rnd() * 3), z, rnd() < 0.5 ? STONE : COBBLE);
}

// ---------- rain ----------
for (let i = 0; i < 45; i++) {
  const x = Math.floor(-20 + rnd() * 40), y = 12 + Math.floor(rnd() * 16), z = Math.floor(-20 + rnd() * 26);
  if (Math.hypot(x, z) < 7 && y > 10) continue;
  line(x, y, z, x - 1, y - 3, z, ICE);
}

// ---------- storm clouds ----------
const clouds = [[-16, 31, -12], [14, 31, -14], [-6, 32, -20], [0, 31, 11], [17, 30, 4], [-18, 30, 8], [6, 32, -9]];
clouds.forEach(([cx, cy, cz], i) => {
  const c1 = i % 2 ? GRAY : BLACK, c2 = i % 3 ? GRAY : LIGHT_GRAY;
  disk(cx, cy - 1, cz, 3, c1);
  disk(cx, cy, cz, 4, i % 2 ? BLACK : GRAY);
  disk(cx, cy + 1, cz, 3, c2);
  disk(cx + 3, cy, cz + 2, 2, c1);
  disk(cx - 3, cy - 1, cz - 2, 2, BLACK);
});

// ---------- pier ----------
cube(0, 1, -17, 2, 1, -6, PLANKS);
[-6, -9, -12, -15, -17].forEach((z) => {
  cube(-1, -1, z, -1, 2, z, OAK_LOG);
  cube(3, -1, z, 3, 2, z, OAK_LOG);
});
line(-1, 2, -17, -1, 2, -6, OAK_LOG);
line(3, 2, -17, 3, 2, -6, OAK_LOG);
block(-1, 3, -17, GLOWSTONE); block(3, 3, -17, GLOWSTONE);
block(-1, 4, -17, FIRE); block(3, 4, -17, FIRE);
// steps
block(1, 0, -5, COBBLE); block(0, 0, -5, COBBLE);

// ---------- boat ----------
cube(-12, 0, -16, -6, 0, -14, PLANKS);
cube(-13, 1, -17, -5, 1, -13, PLANKS);
cube(-12, 1, -16, -6, 1, -14, AIR);
block(-14, 1, -15, PLANKS); block(-4, 1, -15, PLANKS); block(-15, 2, -15, PLANKS);
line(-9, 1, -15, -9, 10, -15, OAK_LOG);
line(-9, 3, -15, -5, 3, -15, OAK_LOG);
for (let y = 4; y <= 9; y++) cube(-8, y, -15, -8 + (9 - y), y, -15, WHITE);
block(-6, 6, -15, AIR); block(-7, 5, -15, AIR); block(-5, 4, -15, AIR);
block(-8, 10, -15, RED);
block(-13, 2, -15, GLOWSTONE);

// ---------- cottage ----------
walls(-13, 3, -7, 8, 0, 0, COBBLE);
walls(-13, 3, -7, 8, 1, 3, PLANKS);
[[-13, 3], [-7, 3], [-13, 8], [-7, 8]].forEach(([x, z]) => cube(x, 0, z, x, 3, z, OAK_LOG));
cube(-12, 1, 4, -8, 3, 7, AIR);
cube(-10, 1, 3, -10, 2, 3, OAK_LOG);
block(-12, 2, 3, GLOWSTONE); block(-8, 2, 3, GLOWSTONE);
block(-7, 2, 5, GLOWSTONE); block(-13, 2, 6, GLOWSTONE);
cube(-14, 4, 2, -6, 4, 9, BRICK);
cube(-14, 5, 3, -6, 5, 8, BRICK);
cube(-14, 6, 4, -6, 6, 7, BRICK);
cube(-14, 7, 5, -6, 7, 6, RED);
cube(-12, 5, 6, -12, 9, 6, COBBLE);
block(-12, 10, 6, FIRE);
cube(-6, 0, 2, -6, 2, 2, OAK_LOG);
block(-6, 3, 2, GLOWSTONE);
line(-10, 0, 2, -3, 0, -2, COBBLE);

// ---------- tower ----------
for (let y = 0; y <= 24; y++) {
  const band = Math.floor(y / 4) % 2 ? RED : WHITE;
  hollowCylinder(0, y, 0, rr(y), 1, band);
}
// door
cube(0, 2, -5, 0, 3, -5, PLANKS);
cube(-1, 2, -5, -1, 3, -5, OAK_LOG);
cube(1, 2, -5, 1, 3, -5, OAK_LOG);
block(0, 4, -5, OAK_LOG);
block(0, 2, -6, GOLD);
// windows
[8, 13, 18].forEach((y) => {
  block(0, y, -rr(y), GLOWSTONE);
  block(0, y + 1, -rr(y), GLOWSTONE);
});
block(0, 22, -rr(22), GLOWSTONE);
[11, 16].forEach((y) => { block(rr(y), y, 0, GLOWSTONE); block(-rr(y), y, 0, GLOWSTONE); });

// gallery
hollowCylinder(0, 24, 0, 5, 1, BLACK);
disk(0, 25, 0, 6, BLACK);
hollowCylinder(0, 26, 0, 6, 1, IRON);
for (let k = 0; k < 12; k++) {
  const a = k * Math.PI / 6;
  const px = Math.round(Math.cos(a) * 6), pz = Math.round(Math.sin(a) * 6);
  block(px, 27, pz, IRON);
}
// lantern room
hollowCylinder(0, 26, 0, 3, 4, GLASS);
sphere(0, 28, 0, 1, GLOWSTONE);
[[3, 0], [-3, 0], [0, 3], [0, -3], [2, 2], [-2, 2], [2, -2], [-2, -2]].forEach(([x, z]) => cube(x, 26, z, x, 29, z, IRON));
// roof
disk(0, 30, 0, 4, BLACK);
disk(0, 31, 0, 3, RED);
disk(0, 32, 0, 2, BLACK);
block(0, 33, 0, IRON);

// ---------- light beams ----------
const beam = (tx, ty, tz) => {
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const x = Math.round(tx * t), y = Math.round(28 + (ty - 28) * t), z = Math.round(-4 + (tz + 4) * t);
    block(x, y, z, i % 4 === 0 ? GLOWSTONE : YELLOW);
    if (i % 2 === 0) { block(x, y + 1, z, YELLOW); block(x, y - 1, z, YELLOW); }
  }
};
beam(14, 24, -22);
beam(-12, 25, -22);

// ---------- lightning ----------
[[1, 33, 0], [-1, 33, 0], [-15, 29, -11], [13, 29, -13], [-5, 30, -19], [17, 28, 5]].forEach(([x, y, z]) => block(x, y, z, ELECTRIC));