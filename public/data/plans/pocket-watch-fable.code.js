// pocket-watch-fable — prompt:
// a giant open pocket watch with ticking gears...

const seen = new Set();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (seen.has(k)) return;
  seen.add(k);
  block(x, y, z, id);
}
// vertical disk in the XY plane at depth z, optional inner radius
function vdisk(cx, cy, z, r, id, rin = 0, skip = null) {
  const R = Math.ceil(r);
  for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) {
    const d = Math.sqrt(x * x + y * y);
    if (d <= r + 0.3 && d >= rin) {
      if (skip && skip(x, y, d)) continue;
      put(cx + x, cy + y, z, id);
    }
  }
}
// vertical gear with teeth, spokes and a hub
function gear(cx, cy, z, r, teeth, id, hub) {
  const skip = r >= 4 ? (x, y, d) => {
    if (d < 2.4 || d > r - 1.6) return false;
    const a = Math.atan2(y, x);
    return Math.abs(Math.sin(2 * a)) > 0.45;
  } : null;
  vdisk(cx, cy, z, r, id, 0, skip);
  for (let i = 0; i < teeth; i++) {
    const a = i / teeth * Math.PI * 2;
    put(cx + Math.cos(a) * (r + 1), cy + Math.sin(a) * (r + 1), z, id);
    if (r >= 4) put(cx + Math.cos(a) * (r + 1.8), cy + Math.sin(a) * (r + 1.8), z, id);
  }
  put(cx, cy, z, hub || OBSIDIAN);
}
// flat gear lying on the ground (XZ plane)
function flatGear(cx, y, cz, r, teeth, id) {
  disk(cx, y, cz, r, id);
  for (let i = 0; i < teeth; i++) {
    const a = i / teeth * Math.PI * 2;
    put(cx + Math.cos(a) * (r + 1), y, cz + Math.sin(a) * (r + 1), id);
  }
  put(cx, y, cz, OBSIDIAN);
}

// ---- site clearing (trees inside / in front of the build) ----
cube(-22, 0, -12, 8, 8, 7, AIR);
cube(0, 0, 2, 20, 8, 20, AIR);

const CX = -8, CY = 16, CZ = 2, R = 12;

// ---- pedestal ----
cube(-16, -2, -1, 0, 3, 5, OBSIDIAN);
line(-16, 3, -1, 0, 3, -1, GOLD); line(-16, 3, 5, 0, 3, 5, GOLD);
line(-16, 3, -1, -16, 3, 5, GOLD); line(0, 3, -1, 0, 3, 5, GOLD);
cube(-18, -2, -3, 2, -1, 7, STONE);
cube(-18, 0, -3, 2, 0, 7, LIGHT_GRAY);
// lid support pillar
cube(10, -2, 10, 13, 3, 12, OBSIDIAN);
cube(9, -1, 9, 14, 0, 13, LIGHT_GRAY);

// ---- case ----
for (let z = 1; z <= 3; z++) vdisk(CX, CY, z, R, GOLD, R - 2);
vdisk(CX, CY, 0, R - 0.5, GOLD, R - 1.5);          // front bezel lip
vdisk(CX, CY, 4, R, GOLD, R - 1);                   // back rim
vdisk(CX, CY, 4, R - 1, COPPER);                    // back plate
// decorative engraving ring on case front bezel
for (let i = 0; i < 24; i++) {
  const a = i / 24 * Math.PI * 2;
  put(CX + Math.cos(a) * (R - 1), CY + Math.sin(a) * (R - 1), 0, i % 2 ? COPPER : GOLD);
}

// ---- skeleton dial (ring) ----
vdisk(CX, CY, 1, 10, MARBLE, 8);
vdisk(CX, CY, 1, 8.2, OBSIDIAN, 7.6);              // chapter ring edge
// hour markers
for (let i = 0; i < 12; i++) {
  const a = i / 12 * Math.PI * 2;
  if (i % 3 === 0) {
    for (let d = 8.4; d <= 10; d += 0.8) put(CX + Math.cos(a) * d, CY + Math.sin(a) * d, 0, BLACK);
  } else {
    put(CX + Math.cos(a) * 9, CY + Math.sin(a) * 9, 0, BLACK);
  }
}
// minute ticks between markers
for (let i = 0; i < 60; i++) {
  if (i % 5 === 0) continue;
  const a = i / 60 * Math.PI * 2;
  put(CX + Math.cos(a) * 9.8, CY + Math.sin(a) * 9.8, 0, GRAY);
}

// ---- movement (behind the open dial) ----
gear(CX, CY, 3, 6, 14, IRON, OBSIDIAN);
gear(CX - 7, CY + 4, 3, 3, 8, COPPER);
gear(CX + 6, CY - 3, 3, 3.5, 9, COPPER);
gear(CX + 5, CY + 5, 2, 3, 8, GOLD, NEON_RED);
gear(CX - 4, CY - 5, 2, 2.5, 8, COPPER, NEON_RED);
gear(CX + 4, CY - 4, 2, 2, 6, IRON);
gear(CX - 2, CY + 6, 2, 1.5, 5, GOLD);
// balance wheel
vdisk(CX - 5, CY + 1, 2, 3.2, GOLD, 2.2);
line(CX - 8, CY + 1, 2, CX - 2, CY + 1, 2, GOLD);
put(CX - 5, CY + 1, 2, NEON_RED);
// bridges
line(CX - 5, CY + 1, 2, CX + 5, CY + 5, 2, OBSIDIAN);
line(CX - 4, CY - 5, 2, CX + 4, CY - 4, 2, OBSIDIAN);
line(CX, CY, 2, CX - 2, CY + 6, 2, OBSIDIAN);
put(CX, CY, 2, GLOWSTONE);

// ---- hands (in front of the dial) ----
vdisk(CX, CY, 0, 1.5, BLACK);
function hand(dx, dy, len, w) {
  for (let t = 0; t <= len; t += 0.5) {
    put(CX + dx * t, CY + dy * t, 0, BLACK);
    if (t > 1 && t < len - 1.5 && w) put(CX + dx * t - dy, CY + dy * t + dx, 0, BLACK);
  }
  put(CX + dx * (len + 1), CY + dy * (len + 1), 0, OBSIDIAN);
}
const s60 = Math.sin(Math.PI / 3), c60 = 0.5;
hand(s60, c60, 6, true);     // hour hand -> 10 o'clock
hand(-s60, c60, 9, true);    // minute hand -> 2 o'clock
hand(0, -1, 7, false);       // thin seconds hand -> 6 o'clock
put(CX, CY, 0, NEON_RED);

// ---- crown & bow ----
cylinder(CX, CY + R, CZ, 2, 2, GOLD);
for (let i = 0; i < 10; i++) {
  const a = i / 10 * Math.PI * 2;
  put(CX + Math.cos(a) * 2.4, CY + R + 1, CZ + Math.sin(a) * 2.4, COPPER);
}
cylinder(CX, CY + R + 2, CZ, 1, 1, COPPER);
vdisk(CX, 31, CZ, 2.3, GOLD, 1.2);

// ---- chain draping west to the ground ----
for (let i = 0; i <= 70; i++) {
  const t = i / 70;
  const x = CX - 2 - 12.5 * t;
  const y = 31 - 32 * Math.pow(t, 1.35);
  const z = CZ - 3 * t;
  put(x, y, z, (i % 4 === 3) ? IRON : GOLD);
}
for (let i = 0; i < 10; i++) {
  const a = i / 10 * Math.PI * 2;
  put(-21 + Math.cos(a) * 1.5, 0, -1 + Math.sin(a) * 1.5, i % 3 === 2 ? IRON : GOLD);
}

// ---- open lid (hinged on the east edge, swung 50° toward +X/+Z) ----
const HX = CX + R, HY = CY, HZ = CZ;
const ang = 50 * Math.PI / 180;
const vx = Math.cos(ang), vz = Math.sin(ang);
const nx = -vz, nz = vx;                     // normal pointing toward the watch body (inner side)
const LCX = HX + vx * R, LCZ = HZ + vz * R;
function lidLayer(off, pick) {
  for (let s = -R; s <= R; s += 0.5) for (let y = -R; y <= R; y++) {
    const d = Math.sqrt(s * s + y * y);
    if (d > R + 0.3) continue;
    const id = pick(s, y, d);
    if (id == null) continue;
    put(LCX + vx * s + nx * off, HY + y, LCZ + vz * s + nz * off, id);
  }
}
// outer shell (two sub-layers for solidity)
lidLayer(-1, () => GOLD);
lidLayer(-0.5, () => GOLD);
// inner engraved face
lidLayer(0, (s, y, d) => {
  if (d > R - 1.5) return GOLD;
  if (d > 5 && d <= 6) return COPPER;
  if (d > 2 && d <= 3) return BLACK;
  if (d <= 1) return GLOWSTONE;
  const a = Math.atan2(y, s);
  if (d > 6.5 && d < 9.5 && Math.abs(Math.sin(2 * a)) < 0.12) return COPPER;
  if (d > 7 && d < 8 && Math.abs(Math.cos(2 * a)) < 0.1) return BLACK;
  return MARBLE;
});
// hinge knuckles
for (let y = HY - 5; y <= HY + 5; y += 2) cube(HX - 1, y, HZ - 1, HX + 1, y, HZ + 1, COPPER);
line(HX, HY - 6, HZ, HX, HY + 6, HZ, IRON);

// ---- foreground: spilled gears on the ground ----
flatGear(-14, 0, -9, 3, 10, COPPER);
flatGear(3, 0, -8, 2, 7, IRON);
flatGear(-3, 0, -13, 4, 12, GOLD);
put(-3, 0, -13, NEON_RED);
flatGear(16, 0, 4, 2.5, 8, COPPER);
// one gear leaning against the pedestal
gear(-19, 3, 3, 3, 9, IRON);
line(-19, 0, 2, -19, 2, 2, IRON);