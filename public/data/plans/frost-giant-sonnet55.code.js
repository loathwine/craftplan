// frost-giant-sonnet55 — prompt:
// a frost giant wielding an ice axe...

const LIM = 3980;
const M = new Map();
let PR = 0;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, [x, y, z, id, PR]);
}
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function shell(x1, y1, z1, x2, y2, z2, id) {
  box(x1, y1, z1, x2, y1, z2, id); box(x1, y2, z1, x2, y2, z2, id);
  box(x1, y1, z1, x1, y2, z2, id); box(x2, y1, z1, x2, y2, z2, id);
  box(x1, y1, z1, x2, y2, z1, id); box(x1, y1, z2, x2, y2, z2, id);
}
function ring(x1, y1, z1, x2, y2, z2, id) {
  box(x1, y1, z1, x2, y2, z1, id); box(x1, y1, z2, x2, y2, z2, id);
  box(x1, y1, z1, x1, y2, z2, id); box(x2, y1, z1, x2, y2, z2, id);
}
function ball(cx, cy, cz, r, id, hollow) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 <= r * r && (!hollow || d2 > (r - 1) * (r - 1))) put(cx + dx, cy + dy, cz + dz, id);
  }
}
function capsule(a, b, r, id, fn) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(L * 2));
  const R = Math.ceil(r);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t, cz = a[2] + (b[2] - a[2]) * t;
    for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
      if (dx * dx + dy * dy + dz * dz <= r * r) {
        const x = Math.round(cx + dx), y = Math.round(cy + dy), z = Math.round(cz + dz);
        put(x, y, z, fn ? fn(x, y, z) : id);
      }
    }
  }
}

// ---------- BOOTS + LEGS ----------
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -6 : 1, x2 = s < 0 ? -1 : 6;
  shell(x1, 1, -5, x2, 5, 2, SNOW);
  box(x1, 1, -5, x2, 1, 2, GRAY);
  box(x1, 5, -5, x2, 5, 2, WHITE);
  ring(x1, 3, -5, x2, 3, 2, BROWN);
  box(x1 + 1, 2, -6, x2 - 1, 3, -6, SNOW);
  const lx1 = s < 0 ? -5 : 1, lx2 = s < 0 ? -1 : 5;
  shell(lx1, 6, -3, lx2, 8, 2, BROWN);
  shell(lx1, 9, -3, lx2, 12, 2, LIGHT_BLUE);
  ring(lx1 - 1, 9, -4, lx2 + 1, 9, 3, SNOW);
}
// ---------- PELVIS / KILT ----------
box(-6, 13, -3, 6, 13, 3, GRAY);
box(-6, 14, -4, 6, 14, 4, BROWN);
box(-5, 9, -4, 5, 12, -4, GRAY);
box(-6, 9, -3, -6, 12, 3, GRAY); box(6, 9, -3, 6, 12, 3, GRAY);
PR = 1;
box(-5, 9, -4, 5, 9, -4, SNOW);
for (let x = -5; x <= 5; x += 2) put(x, 8, -4, SNOW);
for (let x = -6; x <= 6; x += 3) box(x, 10, -4, x, 12, -4, BROWN);
put(0, 12, -5, GOLD); put(-1, 11, -5, GOLD); put(0, 11, -5, GOLD); put(1, 11, -5, GOLD); put(0, 10, -5, GOLD);
box(-2, 13, -5, 2, 15, -5, IRON); box(-1, 14, -5, 1, 14, -5, GOLD);
PR = 0;
// ---------- TORSO ----------
shell(-5, 15, -3, 5, 18, 3, LIGHT_BLUE);
shell(-7, 19, -4, 7, 25, 4, LIGHT_BLUE);
box(-8, 26, -5, 8, 26, 4, SNOW);
PR = 1;
box(-3, 16, -4, -1, 17, -4, LIGHT_BLUE); box(1, 16, -4, 3, 17, -4, LIGHT_BLUE);
box(-3, 18, -4, -1, 18, -4, LIGHT_BLUE); box(1, 18, -4, 3, 18, -4, LIGHT_BLUE);
box(-6, 21, -5, -1, 24, -5, IRON); box(1, 21, -5, 6, 24, -5, IRON);
box(0, 19, -5, 0, 25, -5, GOLD);
box(-6, 20, -5, -2, 20, -5, BROWN); box(2, 20, -5, 6, 20, -5, BROWN);
put(0, 22, -5, NEON_BLUE); put(0, 22, -6, ICE);
put(-1, 22, -5, GOLD); put(1, 22, -5, GOLD); put(0, 21, -5, GOLD); put(0, 23, -5, GOLD);
for (const x of [-5, -3, 3, 5]) for (const y of [22, 24]) put(x, y, -6, ICE);
box(-7, 25, -5, 7, 25, -5, SNOW);
for (let x = -7; x <= 7; x += 2) put(x, 24, -5, SNOW);
ring(-5, 27, -6, 5, 27, 4, SNOW);
for (let x = -5; x <= 5; x += 2) put(x, 26, -6, SNOW);
PR = 0;
// ---------- PAULDRONS ----------
for (const s of [-1, 1]) {
  ball(s * 9, 25, 0, 3, IRON, true);
  PR = 1;
  ring(s * 9 - 2, 28, -2, s * 9 + 2, 28, 2, SNOW);
  capsule([s * 8, 28, -1], [s * 8, 31, -1], 0.5, ICE);
  capsule([s * 10, 28, 1], [s * 10, 30, 1], 0.5, ICE);
  capsule([s * 9, 28, -2], [s * 10, 31, -3], 0.5, ICE);
  capsule([s * 12, 26, 0], [s * 15, 27, 0], 0.5, ICE);
  PR = 0;
}
// ---------- HEAD ----------
shell(-4, 27, -5, 4, 32, 3, LIGHT_BLUE);
box(-5, 32, -6, 5, 32, 4, IRON);
ring(-5, 31, -6, 5, 31, 4, IRON);
box(-3, 30, -5, -2, 30, -5, NEON_BLUE); box(2, 30, -5, 3, 30, -5, NEON_BLUE);
box(-1, 29, -6, 1, 29, -6, LIGHT_BLUE); put(0, 30, -6, LIGHT_BLUE); put(0, 29, -7, LIGHT_BLUE);
box(-3, 28, -5, 3, 28, -5, BLACK);
box(-4, 28, -6, -2, 28, -6, SNOW); box(2, 28, -6, 4, 28, -6, SNOW);
put(-4, 29, -5, BLUE); put(4, 29, -5, BLUE); put(-3, 29, -5, BLUE); put(3, 29, -5, BLUE);
put(-4, 30, -5, BLUE); put(4, 30, -5, BLUE);
box(-5, 28, -2, -5, 29, 0, LIGHT_BLUE); box(5, 28, -2, 5, 29, 0, LIGHT_BLUE);
put(-6, 29, -1, LIGHT_BLUE); put(6, 29, -1, LIGHT_BLUE);
const beard = { 27: [-4, 4], 26: [-4, 4], 25: [-3, 3], 24: [-3, 3], 23: [-2, 2] };
for (const y in beard) for (let x = beard[y][0]; x <= beard[y][1]; x++) put(x, +y, -6, (x + +y) % 2 ? WHITE : SNOW);
for (let y = 24; y <= 26; y++) for (let x = -2; x <= 2; x++) put(x, y, -7, (x + y) % 2 ? SNOW : WHITE);
for (let x = -2; x <= 2; x += 2) { put(x, 22, -6, ICE); put(x, 22, -7, ICE); }
put(0, 21, -6, ICE); put(0, 21, -7, ICE); put(-1, 23, -7, SNOW); put(1, 23, -7, SNOW); put(0, 20, -6, ICE);
box(-4, 24, -6, -4, 25, -6, SNOW);
PR = 1;
const per = [];
for (let x = -5; x <= 5; x++) per.push([x, -6]);
for (let z = -5; z <= 3; z++) per.push([5, z]);
for (let x = 5; x >= -5; x--) per.push([x, 4]);
for (let z = 3; z >= -5; z--) per.push([-5, z]);
per.forEach((p, i) => { if (i % 2 === 0) put(p[0], 33, p[1], ICE); });
for (const s of [-1, 1]) {
  capsule([s * 5, 30, -1], [s * 8, 30, -1], 1.1, MARBLE);
  capsule([s * 8, 30, -1], [s * 10, 33, -1], 1.1, MARBLE);
  put(s * 10, 33, -1, ICE);
}
PR = 0;
// ---------- LEFT ARM + SHIELD ----------
capsule([-11, 23, 0], [-13, 18, -1], 2.3, LIGHT_BLUE);
capsule([-13, 18, -1], [-12, 19, -6], 1.9, LIGHT_BLUE, (x, y, z) => (z <= -4 ? IRON : LIGHT_BLUE));
{
  const cx = -13, cy = 19;
  for (let dx = -5; dx <= 5; dx++) for (let dy = -5; dy <= 5; dy++) {
    const d = Math.hypot(dx, dy);
    if (d <= 4.6) put(cx + dx, cy + dy, -7, d > 3.6 ? IRON : BLUE);
    if (d <= 4.6 && d > 3.6) put(cx + dx, cy + dy, -8, IRON);
  }
  PR = 1;
  ball(cx, cy, -9, 1.5, ICE);
  put(cx, cy, -10, NEON_BLUE);
  for (let i = -3; i <= 3; i++) {
    put(cx + i, cy, -8, WHITE); put(cx, cy + i, -8, WHITE);
    if (Math.abs(i) <= 2) { put(cx + i, cy + i, -8, WHITE); put(cx + i, cy - i, -8, WHITE); }
  }
  for (let a = 0; a < 8; a++) put(cx + Math.round(4.1 * Math.cos(a * Math.PI / 4)), cy + Math.round(4.1 * Math.sin(a * Math.PI / 4)), -9, GOLD);
  PR = 0;
}
// ---------- RIGHT ARM ----------
capsule([11, 23, 0], [14.5, 18, 0], 2.3, LIGHT_BLUE);
capsule([14.5, 18, 0], [14.5, 22, -2.5], 2.0, LIGHT_BLUE, (x, y, z) => ((y === 19 || y === 20) ? IRON : LIGHT_BLUE));
// ---------- ICE AXE ----------
box(14, 12, -3, 15, 32, -2, OAK_LOG);
box(14, 14, -3, 15, 16, -2, BROWN);
box(14, 17, -3, 15, 17, -2, GOLD);
box(14, 18, -3, 15, 19, -2, BROWN);
box(13, 21, -4, 16, 24, -1, LIGHT_BLUE);
box(13, 24, -4, 16, 24, -1, WHITE);
for (let x = 13; x <= 16; x++) put(x, 23, -4, BLUE);
box(14, 11, -3, 15, 11, -2, IRON);
box(14, 10, -3, 15, 10, -2, ICE); put(14, 9, -3, ICE);
box(13, 25, -4, 16, 26, -1, IRON);
box(13, 30, -4, 16, 32, -1, IRON);
box(14, 33, -3, 15, 33, -2, ICE);
box(16, 24, -4, 16, 33, -1, IRON);
for (let y = 24; y <= 33; y++) {
  const d = Math.abs(y - 28.5);
  const w = Math.round(1.5 + d * 0.95);
  for (let i = 0; i < w; i++) {
    const x = 17 + i;
    if (i < 2) box(x, y, -4, x, y, -1, ICE);
    else if (i < w - 1) box(x, y, -3, x, y, -2, ICE);
    else put(x, y, -3, WHITE);
  }
}
put(17, 28, -4, NEON_BLUE); put(17, 29, -4, NEON_BLUE); put(18, 28, -4, CYAN); put(18, 29, -4, CYAN);
const pick = [[13, 27, 29], [12, 28, 30], [11, 29, 30], [10, 30, 31], [9, 31, 31]];
for (const p of pick) box(p[0], p[1], -3, p[0], p[2], -2, ICE);
box(13, 28, -4, 13, 28, -1, WHITE);
// ---------- GROUND ----------
PR = 2;
const c0 = M.size;
const cells = [];
for (let x = -11; x <= 11; x++) for (let z = -11; z <= 11; z++) {
  const d = Math.hypot(x, z);
  if (d <= 10.5) cells.push([d, x, 0, z]);
  if (d <= 7.5) cells.push([d + 0.001, x, -1, z]);
}
cells.sort((a, b) => a[0] - b[0]);
let room = LIM - c0 - 90;
for (const c of cells) {
  if (room <= 0) break;
  const k = c[1] + ',' + c[2] + ',' + c[3];
  if (!M.has(k)) { put(c[1], c[2], c[3], (Math.abs(c[1] * 7 + c[3] * 13) % 11 === 0) ? ICE : SNOW); room--; }
}
PR = 3;
const shards = [[-10, -5, 6], [-11, 2, 4], [9, -8, 7], [10, 5, 4], [-6, -9, 4], [4, -9, 5], [-8, 7, 6], [7, 8, 3], [12, -3, 3]];
for (const sh of shards) {
  const x = sh[0], z = sh[1], h = sh[2];
  for (let k = 0; k < h; k++) {
    put(x, 1 + k, z, ICE);
    if (k < h / 2) { put(x + 1, 1 + k, z, ICE); put(x, 1 + k, z + 1, ICE); }
  }
}
// ---------- EMIT ----------
cube(-14, 0, -10, 14, 9, 9, AIR);
const vh = (x, y, z) => (((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) >>> 0) % 100;
const all = Array.from(M.values()).sort((a, b) => a[4] - b[4]).slice(0, LIM);
for (const e of all) {
  let b = e[3];
  if (b === LIGHT_BLUE) { const h = vh(e[0], e[1], e[2]); if (h < 6) b = WHITE; else if (h < 12) b = BLUE; }
  block(e[0], e[1], e[2], b);
}