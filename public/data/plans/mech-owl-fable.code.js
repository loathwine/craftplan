// mech-owl-fable — prompt:
// a giant mechanical owl...

// Giant mechanical owl, perched on an iron pipe, facing north (-Z)

function ellipsoidShell(cx, cy, cz, rx, ry, rz, id, inner) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        const d = dx * dx + dy * dy + dz * dz;
        if (d <= 1 && d >= inner) block(x, y, z, id);
      }
}
function ringXY(cx, cy, cz, r, id) {
  for (let a = 0; a < 360; a += 4) {
    const t = a * Math.PI / 180;
    block(Math.round(cx + Math.cos(t) * r), Math.round(cy + Math.sin(t) * r), cz, id);
  }
}
function ringZY(cx, cy, cz, r, id) {
  for (let a = 0; a < 360; a += 4) {
    const t = a * Math.PI / 180;
    block(cx, Math.round(cy + Math.sin(t) * r), Math.round(cz + Math.cos(t) * r), id);
  }
}
function gearXY(cx, cy, cz, r, id) {
  ringXY(cx, cy, cz, r, id);
  for (let a = 0; a < 360; a += 45) {
    const t = a * Math.PI / 180;
    block(Math.round(cx + Math.cos(t) * (r + 1)), Math.round(cy + Math.sin(t) * (r + 1)), cz, id);
  }
}

// Clear trees around the subject
cube(-14, 0, -10, 14, 12, 10, AIR);

// --- Pedestal / machinery base ---
disk(0, 0, 1, 8, COBBLE);
disk(0, 1, 1, 6, STONE);
hollowCube(-5, 1, -4, 5, 2, 6, IRON);
cube(-4, 2, -3, 4, 2, 5, GRAY);
// pipes on base
line(-8, 1, -3, -8, 4, -3, COPPER); line(8, 1, -3, 8, 4, -3, COPPER);
line(-8, 1, 5, -8, 3, 5, COPPER); line(8, 1, 5, 8, 3, 5, COPPER);
// perch: thick iron bar east-west
for (let x = -13; x <= 13; x++) {
  block(x, 4, 1, IRON); block(x, 3, 1, IRON); block(x, 4, 0, IRON); block(x, 4, 2, IRON);
  block(x, 5, 1, IRON);
  if (x % 4 === 0) { block(x, 5, 0, COPPER); block(x, 5, 2, COPPER); block(x, 3, 0, COPPER); block(x, 3, 2, COPPER); }
}
cube(-13, 1, 0, -12, 3, 2, IRON); cube(12, 1, 0, 13, 3, 2, IRON);
block(-13, 6, 1, GLOWSTONE); block(13, 6, 1, GLOWSTONE);

// --- Talons gripping the perch ---
for (const sx of [-3, 3]) {
  cube(sx - 1, 5, 0, sx + 1, 6, 2, GOLD);
  for (const tz of [-1, 0, 2, 3]) { block(sx - 1, 5, tz === -1 ? -1 : tz, GOLD); block(sx + 1, 5, tz === -1 ? -1 : tz, GOLD); }
  block(sx, 4, -1, GOLD); block(sx, 3, -1, GOLD); block(sx, 4, 3, GOLD); block(sx, 3, 3, GOLD);
  block(sx - 1, 4, -1, GOLD); block(sx + 1, 4, -1, GOLD); block(sx - 1, 4, 3, GOLD); block(sx + 1, 4, 3, GOLD);
}

// --- Body (iron shell, copper belly plating) ---
ellipsoidShell(0, 12, 2, 6.2, 7.2, 5.2, IRON, 0.72);
// copper belly front plates
for (let y = 6; y <= 17; y++)
  for (let x = -5; x <= 5; x++)
    for (let z = -4; z <= -1; z++) {
      const dx = x / 6.2, dy = (y - 12) / 7.2, dz = (z - 2) / 5.2;
      const d = dx * dx + dy * dy + dz * dz;
      if (d <= 1 && d >= 0.72 && ((y + Math.abs(x)) % 3 === 0)) block(x, y, z, COPPER);
    }
// exposed chest gear
cube(-2, 9, -3, 2, 14, -2, AIR);
cube(-2, 9, -1, 2, 14, -1, BLACK);
gearXY(0, 11.5, -2, 2, GOLD);
block(0, 12, -2, GOLD); block(0, 11, -2, GOLD);
block(0, 12, -1, NEON_BLUE); block(0, 11, -1, NEON_BLUE);
// rivet bands around body
for (let a = 0; a < 360; a += 20) {
  const t = a * Math.PI / 180;
  block(Math.round(Math.cos(t) * 6.3), 12, Math.round(2 + Math.sin(t) * 5.3), GOLD);
  block(Math.round(Math.cos(t) * 5.6), 16, Math.round(2 + Math.sin(t) * 4.6), GOLD);
}

// --- Wings (folded, plated, feather-stepped) ---
for (const s of [-1, 1]) {
  for (let y = 7; y <= 17; y++) {
    const w = y > 14 ? 3 : (y > 10 ? 4 : 3);
    for (let z = -2; z <= 6; z++) {
      const xo = 7 + (y > 14 ? 17 - y : 0);
      const id = ((z + y) % 2 === 0) ? IRON : COPPER;
      block(s * xo, y, z, id);
      if (y < 14) block(s * (xo - 1), y, z, GRAY);
    }
  }
  // feather tips stepped down
  for (let i = 0; i < 5; i++) {
    const z = -1 + i * 2;
    for (let y = 6 - i; y <= 6; y++) { block(s * 7, y, z, COPPER); block(s * 7, y, z + 1, COPPER); }
    block(s * 7, 5 - i, z, GOLD);
  }
  // shoulder gear
  gearXY(s * 8, 17, 2, 2, GOLD);
  block(s * 8, 17, 2, OBSIDIAN);
  // wing hinge piston
  line(s * 8, 17, 2, s * 9, 13, 5, IRON);
}

// --- Tail feathers ---
for (let i = -2; i <= 2; i++) {
  line(i * 2, 8, 6, i * 3, 4, 10, IRON);
  block(i * 3, 3, 10, COPPER);
}

// --- Neck collar ---
ringXY(0, 19, 1, 4, GOLD);
ringXY(0, 19, 2, 4, GOLD);

// --- Head ---
ellipsoidShell(0, 24, 1, 5.5, 5, 5, IRON, 0.7);
// facial disc (flat front plate)
for (let x = -5; x <= 5; x++)
  for (let y = 19; y <= 29; y++) {
    const dx = x / 5.5, dy = (y - 24) / 5;
    if (dx * dx + dy * dy <= 0.95) block(x, y, -4, LIGHT_GRAY);
    if (dx * dx + dy * dy <= 0.95 && dx * dx + dy * dy >= 0.7) block(x, y, -4, COPPER);
  }
// eyes: gold gear rims, glowing blue iris, black pupils
for (const ex of [-2.5, 2.5]) {
  const cx = Math.round(ex);
  cube(cx - 2, 23, -5, cx + 2, 27, -4, AIR);
  cube(cx - 2, 23, -4, cx + 2, 27, -4, BLACK);
  gearXY(cx, 25, -4, 2, GOLD);
  gearXY(cx, 25, -5, 2, GOLD);
  cube(cx - 1, 24, -4, cx + 1, 26, -4, NEON_BLUE);
  block(cx, 25, -4, OBSIDIAN);
  block(cx, 25, -5, OBSIDIAN);
}
// brow ridge
line(-5, 28, -4, -1, 29, -4, OBSIDIAN); line(1, 29, -4, 5, 28, -4, OBSIDIAN);
// beak
cube(-1, 22, -5, 1, 23, -5, GOLD);
block(0, 22, -6, GOLD); block(0, 21, -6, GOLD); block(0, 21, -5, GOLD);
block(0, 20, -5, GOLD);
// ear tufts: antenna cones
for (const s of [-1, 1]) {
  line(s * 4, 28, 1, s * 6, 32, 1, COPPER);
  line(s * 3, 28, 1, s * 5, 32, 1, IRON);
  block(s * 6, 33, 1, GLOWSTONE);
  block(s * 5, 32, 2, COPPER); block(s * 5, 32, 0, COPPER);
}
// back of head vents
cube(-1, 22, 5, 1, 24, 6, GRAY);
block(0, 23, 6, STEAM);

// --- Back boiler, smokestacks, steam ---
cylinder(0, 14, 7, 1, 6, COPPER);
hollowCylinder(-3, 15, 6, 1, 7, IRON);
hollowCylinder(3, 15, 6, 1, 7, IRON);
block(-3, 23, 6, STEAM); block(3, 23, 6, STEAM);
block(0, 21, 7, STEAM);
ringZY(-3, 18, 6, 2, GOLD); ringZY(3, 18, 6, 2, GOLD);
// piping from boiler to wings
line(-1, 15, 7, -8, 12, 6, COPPER);
line(1, 15, 7, 8, 12, 6, COPPER);
// furnace glow in the belly (seen from below/back)
block(0, 7, 4, LAVA); block(0, 7, 5, LAVA);
block(-1, 7, 5, LAVA); block(1, 7, 5, LAVA);

// --- Small scattered gears on the ground ---
gearXY(-9, 1, -6, 2, GOLD);
gearXY(10, 1, 7, 1, COPPER);
ringZY(11, 2, -5, 2, IRON);
cube(-11, 1, 6, -10, 1, 8, IRON);
block(-10, 2, 7, STEAM);