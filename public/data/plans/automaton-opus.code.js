// automaton-opus — prompt:
// a steampunk automaton robot...

const CZ = 3;
const M = new Map();
function P(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
function C(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) P(x, y, z, id);
}
function S(cx, cy, cz, r, id) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++)
    if (dx * dx + dy * dy + dz * dz <= r * r) P(cx + dx, cy + dy, cz + dz, id);
}
function L(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1));
  if (n === 0) { P(x1, y1, z1, id); return; }
  for (let i = 0; i <= n; i++) { const t = i / n; P(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id); }
}
function CYL(cx, cy, cz, r, h, id) {
  const R = Math.ceil(r);
  for (let y = cy; y < cy + h; y++) for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++)
    if (dx * dx + dz * dz <= r * r + 0.3) P(cx + dx, y, cz + dz, id);
}
function rod(x1, y1, z1, x2, y2, z2, r, id) {
  const n = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1)) * 2) + 1;
  const R = Math.ceil(r);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = Math.round(x1 + (x2 - x1) * t), y = Math.round(y1 + (y2 - y1) * t), z = Math.round(z1 + (z2 - z1) * t);
    for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++)
      if (dx * dx + dy * dy + dz * dz <= r * r + 0.3) P(x + dx, y + dy, z + dz, id);
  }
}
function ringXY(cx, cy, z, r1, r2, id) {
  const R = Math.ceil(r2);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) {
    const d2 = dx * dx + dy * dy;
    if (d2 >= r1 * r1 && d2 <= r2 * r2) P(cx + dx, cy + dy, z, id);
  }
}
function gear(axis, cx, cy, cz, R, teeth, id, hub, spokes) {
  const G = (u, v, b) => {
    if (axis === 'z') P(cx + u, cy + v, cz, b);
    else if (axis === 'x') P(cx, cy + v, cz + u, b);
    else P(cx + u, cy, cz + v, b);
  };
  const n = Math.ceil(R + 2);
  for (let u = -n; u <= n; u++) for (let v = -n; v <= n; v++) {
    const d = Math.hypot(u, v);
    if (d <= R + 0.3 && d >= R - 1.2) G(u, v, id);
    else if (d > R + 0.3 && d <= R + 1.4) {
      const a = Math.atan2(v, u);
      const t = Math.floor((a + Math.PI) / (2 * Math.PI) * teeth * 2);
      if (t % 2 === 0) G(u, v, id);
    }
  }
  for (let s = 0; s < spokes; s++) {
    const a = s * 2 * Math.PI / spokes + 0.3;
    for (let r = 1; r <= R - 1; r += 0.5) G(Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r), id);
  }
  for (let u = -1; u <= 1; u++) for (let v = -1; v <= 1; v++) if (u * u + v * v <= 1) G(u, v, hub);
}

// ================= SITE PREP (AIR is free) =================
cube(-16, 1, -12, 16, 8, 13, AIR);
cube(-12, 2, -22, 12, 8, -13, AIR);
cube(-22, 1, 8, -17, 8, 14, AIR);
cube(-21, 1, -12, -17, 8, 4, AIR);
[[1,-1,-7],[12,-1,11],[1,0,-13],[8,0,-20],[-1,0,-10],[3,0,-10],[-6,0,-8],[-7,0,-5],[7,0,-2],[8,0,-1],
 [-15,0,0],[-15,0,2],[15,0,3],[-10,0,8],[-7,0,8],[-6,0,9],[-5,0,13],[-19,0,-7],[-20,0,-1],[-19,0,8]].forEach(([x, y, z]) => {
  block(x, y, z, GRASS);
  for (let yy = y + 1; yy <= 1; yy++) block(x, yy, z, AIR);
});
[[1,1,-13],[8,1,-20],[-10,1,-16],[-10,1,-13],[0,1,-20]].forEach(([x, y, z]) => block(x, y, z, AIR));

// ================= PEDESTAL: giant cog plinth =================
CYL(0, -1, CZ, 8, 2, COBBLE);
for (let dx = -10; dx <= 10; dx++) for (let dz = -10; dz <= 10; dz++) {
  const d = Math.hypot(dx, dz);
  if (d > 8.4 && d <= 9.6) {
    const a = Math.atan2(dz, dx);
    const t = Math.floor((a + Math.PI) / (2 * Math.PI) * 32);
    if (t % 2 === 0) { P(dx, -1, CZ + dz, COBBLE); P(dx, 0, CZ + dz, COBBLE); }
  }
  if (d >= 6.3 && d <= 7.3) P(dx, 0, CZ + dz, COPPER);
}
for (let s = 0; s < 8; s++) {
  const a = s * Math.PI / 4 + Math.PI / 8;
  for (let r = 2.5; r <= 6; r += 0.5) P(Math.round(Math.cos(a) * r), 0, CZ + Math.round(Math.sin(a) * r), IRON);
}

// ================= LEGS =================
for (const s of [-1, 1]) {
  const lx = 3 * s, ox = lx + 2 * s;
  // boots
  C(lx - 2, 1, -1, lx + 2, 2, 6, IRON);
  C(lx - 2, 1, -2, lx + 2, 1, -2, GOLD);
  P(lx - 1, 2, -1, GOLD); P(lx + 1, 2, -1, GOLD);
  C(lx - 1, 1, 7, lx + 1, 1, 7, OBSIDIAN);
  // ankle cuff + shin
  C(lx - 1, 3, 2, lx + 1, 3, 4, GOLD);
  C(lx - 1, 4, 2, lx + 1, 7, 4, COPPER);
  C(lx - 1, 4, 1, lx + 1, 7, 1, IRON);
  P(lx, 5, 1, GOLD);
  // thigh
  C(lx - 1, 9, 2, lx + 1, 12, 4, IRON);
  C(lx - 1, 11, 1, lx + 1, 11, 1, COPPER);
  // knee
  S(lx, 8, 3, 1.5, GOLD);
  P(lx, 8, 1, GOLD); P(lx - 1, 8, 1, COPPER); P(lx + 1, 8, 1, COPPER);
  // outer hydraulic piston
  L(ox, 3, 3, ox, 7, 3, IRON);
  C(ox, 8, 2, ox, 8, 4, GOLD);
  C(ox, 9, 2, ox, 12, 4, COPPER);
}

// ================= PELVIS =================
C(-5, 13, 0, 5, 14, 6, IRON);
C(-5, 13, -1, 5, 14, -1, BROWN);
C(-1, 13, -2, 1, 14, -2, GOLD);
P(0, 13, -2, OBSIDIAN);
gear('x', -6, 12, 3, 2, 8, GOLD, OBSIDIAN, 0);
gear('x', 6, 12, 3, 2, 8, GOLD, OBSIDIAN, 0);

// ================= BOILER TORSO =================
for (let y = 15; y <= 24; y++) for (let dx = -6; dx <= 6; dx++) for (let dz = -6; dz <= 6; dz++) {
  const d = Math.hypot(dx, dz);
  if (d > 5.3) continue;
  const shell = d > 4.2;
  if (shell || y === 15 || y === 24) {
    const band = shell && (y === 15 || y === 19 || y === 24);
    P(dx, y, CZ + dz, band ? GOLD : COPPER);
  }
}
for (let k = 0; k < 12; k++) {
  const a = k * Math.PI / 6;
  const x = Math.round(5 * Math.cos(a)), z = CZ + Math.round(5 * Math.sin(a));
  P(x, 17, z, GOLD); P(x, 22, z, GOLD);
}
// flat chest plate
C(-3, 15, -2, 3, 24, -2, COPPER);
for (const y of [15, 19, 24]) C(-3, y, -2, 3, y, -2, GOLD);
// furnace door
C(-1, 16, -2, 1, 17, -2, LAVA);
L(-2, 15, -3, 2, 15, -3, OBSIDIAN);
L(-2, 18, -3, 2, 18, -3, OBSIDIAN);
L(-2, 15, -3, -2, 18, -3, OBSIDIAN);
L(2, 15, -3, 2, 18, -3, OBSIDIAN);
P(-1, 16, -3, IRON); P(-1, 17, -3, IRON); P(1, 16, -3, IRON); P(1, 17, -3, IRON);
P(-3, 16, -3, GOLD); P(-3, 17, -3, GOLD);
// pressure gauge clock
C(-1, 20, -3, 1, 22, -3, WHITE);
ringXY(0, 21, -3, 1.8, 2.6, GOLD);
P(0, 21, -3, OBSIDIAN); P(0, 22, -3, BLACK); P(1, 21, -3, BLACK); P(-1, 20, -3, RED);
// studs down the plate edges
for (const y of [16, 18, 20, 22, 24]) { P(-3, y, -3, GOLD); P(3, y, -3, GOLD); }

// ================= SMOKESTACKS (back) =================
for (const sx of [-3, 3]) {
  CYL(sx, 14, 9, 1, 15, OBSIDIAN);
  P(sx, 14, 7, IRON); P(sx, 14, 8, IRON);
  P(sx, 18, 8, IRON); P(sx, 23, 8, IRON);
  for (const y of [19, 24]) CYL(sx, y, 9, 1, 1, GOLD);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
    if (dx === 0 && dz === 0) continue;
    P(sx + dx, 29, 9 + dz, GOLD);
    P(sx + dx, 30, 9 + dz, GOLD);
  }
}
// wind-up key
L(0, 20, 9, 0, 20, 11, IRON);
P(0, 20, 8, GOLD);
ringXY(-3, 20, 12, 1.2, 2.3, GOLD);
ringXY(3, 20, 12, 1.2, 2.3, GOLD);
C(-1, 20, 12, 1, 20, 12, GOLD);

// ================= SHOULDERS & ARMS =================
S(-7, 23, CZ, 2.5, GOLD);
S(7, 23, CZ, 2.5, GOLD);
for (const sx of [-7, 7]) { P(sx, 26, 4, IRON); P(sx, 24, 0, COPPER); P(sx + (sx > 0 ? 2 : -2), 23, 1, COPPER); }

// LEFT arm: holds a hanging lantern forward
C(-8, 17, 2, -6, 21, 4, IRON);
L(-9, 21, 3, -9, 17, 3, COPPER);
C(-8, 15, -3, -6, 17, 1, COPPER);
C(-8, 15, -3, -6, 17, -3, GOLD);
S(-7, 16, 3, 1.5, GOLD);
C(-8, 14, -6, -6, 16, -4, IRON);
C(-8, 16, -7, -6, 16, -7, GOLD);
P(-8, 13, -5, GOLD); P(-6, 13, -5, GOLD);
L(-7, 13, -5, -7, 11, -5, BLACK);
C(-8, 10, -6, -6, 10, -4, GOLD);
C(-8, 7, -6, -6, 9, -4, GLASS);
for (const [px, pz] of [[-8, -6], [-6, -6], [-8, -4], [-6, -4]]) L(px, 7, pz, px, 9, pz, BLACK);
P(-7, 8, -5, GLOWSTONE);
C(-8, 6, -6, -6, 6, -4, GOLD);
P(-7, 5, -5, GOLD);

// RIGHT arm: raised, brandishing a giant wrench
rod(8, 21, 3, 12, 17, 3, 1.5, IRON);
rod(12, 17, 3, 13, 24, 1, 1.5, COPPER);
S(12, 17, 3, 1.6, GOLD);
C(12, 24, 0, 14, 24, 2, GOLD);
C(12, 25, 0, 14, 27, 2, IRON);
C(12, 26, -1, 14, 26, -1, GOLD);
C(13, 28, 1, 13, 30, 1, IRON);
C(11, 31, 0, 15, 31, 2, IRON);
C(11, 32, 0, 11, 33, 2, IRON);
C(15, 32, 0, 15, 33, 2, IRON);
P(13, 29, 0, GOLD);

// ================= NECK & HEAD =================
C(-2, 25, 1, 2, 25, 5, GOLD);
C(-1, 25, 2, 1, 25, 4, IRON);
C(-3, 26, 0, 3, 30, 6, COPPER);
C(-3, 26, -1, 3, 30, -1, IRON);
C(-3, 30, -2, 3, 30, -2, COPPER);
for (const gx of [-2, 2]) {
  C(gx - 1, 27, -2, gx + 1, 29, -2, GOLD);
  P(gx, 28, -2, NEON_BLUE);
}
P(0, 28, -2, OBSIDIAN);
// telescoping monocle
C(1, 27, -3, 3, 29, -3, COPPER);
P(2, 28, -3, NEON_BLUE);
P(1, 28, -4, GOLD); P(3, 28, -4, GOLD); P(2, 27, -4, GOLD); P(2, 29, -4, GOLD);
// mouth grille
for (let x = -2; x <= 2; x++) P(x, 26, -2, (x % 2 === 0) ? OBSIDIAN : IRON);
P(-3, 26, -2, GOLD); P(3, 26, -2, GOLD);
// ear gears
gear('x', -4, 28, 3, 2, 8, GOLD, OBSIDIAN, 0);
gear('x', 4, 28, 3, 2, 8, GOLD, OBSIDIAN, 0);
// glass brain dome with glowing gear
for (let dx = -3; dx <= 3; dx++) for (let dy = 1; dy <= 3; dy++) for (let dz = -3; dz <= 3; dz++) {
  const d = Math.hypot(dx, dy, dz);
  if (d <= 3.3 && d > 2.2) P(dx, 30 + dy, 3 + dz, dy === 1 ? GOLD : GLASS);
}
P(0, 31, 3, GLOWSTONE);
P(1, 31, 3, GOLD); P(-1, 31, 3, GOLD); P(0, 31, 2, GOLD); P(0, 31, 4, GOLD);
P(0, 32, 3, GOLD);

// ================= BACKGROUND: TESLA COIL (east) =================
C(13, 0, 7, 15, 0, 9, OBSIDIAN);
CYL(14, 1, 8, 1, 8, COPPER);
for (const y of [2, 4, 6]) C(13, y, 7, 15, y, 9, IRON);
S(14, 10, 8, 1.5, IRON);
L(12, 0, 8, 9, 0, 6, OBSIDIAN);
// crates & barrel
C(16, 0, 1, 17, 1, 2, PLANKS);
P(16, 2, 2, PLANKS);
CYL(17, 0, 5, 1, 2, OAK_LOG);
P(17, 1, 5, IRON);

// ================= BACKGROUND: GEAR MONUMENT (west) =================
C(-15, 0, 9, -11, 0, 11, COBBLE);
L(-13, 1, 10, -13, 4, 10, IRON);
gear('z', -13, 8, 10, 4, 10, COPPER, GOLD, 5);
L(-19, 0, 11, -19, 1, 11, IRON);
gear('z', -19, 4, 11, 2, 6, GOLD, IRON, 0);

// ================= GAS LAMPS =================
for (const lx of [-12, 12]) {
  P(lx, 0, -10, COBBLE);
  L(lx, 1, -10, lx, 4, -10, OBSIDIAN);
  C(lx - 1, 5, -11, lx + 1, 5, -9, GOLD);
  P(lx, 6, -10, GLOWSTONE);
  P(lx - 1, 6, -10, GLASS); P(lx + 1, 6, -10, GLASS); P(lx, 6, -11, GLASS); P(lx, 6, -9, GLASS);
  C(lx - 1, 7, -11, lx + 1, 7, -9, OBSIDIAN);
  P(lx, 8, -10, GOLD);
}

// ================= CLOCKWORK SPIDER COMPANION =================
const SX = -12, SZ = -3;
S(SX, 3, SZ, 1.5, COPPER);
S(SX, 3, SZ + 3, 2.2, GOLD);
C(SX - 1, 2, SZ - 3, SX + 1, 3, SZ - 2, IRON);
P(SX - 1, 3, SZ - 3, NEON_RED); P(SX + 1, 3, SZ - 3, NEON_RED);
P(SX - 1, 2, SZ - 4, GOLD); P(SX + 1, 2, SZ - 4, GOLD);
for (const sd of [-1, 1]) for (const o of [-1.5, -0.5, 0.5, 1.5]) {
  const az = SZ + Math.round(o * 0.7), kz = SZ + Math.round(o * 1.6), fz = SZ + Math.round(o * 2.6);
  L(SX + sd, 3, az, SX + sd * 3, 5, kz, IRON);
  L(SX + sd * 3, 5, kz, SX + sd * 5, 0, fz, IRON);
  P(SX + sd * 3, 5, kz, GOLD);
}
P(SX, 6, SZ + 3, IRON);
C(SX - 1, 7, SZ + 3, SX + 1, 7, SZ + 3, GOLD);
P(SX - 1, 8, SZ + 3, GOLD); P(SX + 1, 8, SZ + 3, GOLD);

// ================= EFFECTS =================
for (const sx of [-3, 3]) { P(sx, 30, 9, STEAM); P(sx, 31, 9, STEAM); }
P(-7, 27, 4, STEAM); P(7, 27, 4, STEAM);
P(14, 13, 8, ELECTRIC); P(16, 11, 8, ELECTRIC); P(12, 11, 9, ELECTRIC);

// ================= FLUSH =================
for (const [x, y, z, id] of M.values()) block(x, y, z, id);