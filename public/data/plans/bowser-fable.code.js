// bowser-fable — prompt:
// Bowser...

const seen = new Set();
let count = 0;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  const k = x + ',' + y + ',' + z;
  if (seen.has(k)) return;
  seen.add(k);
  if (id !== AIR) count++;
  block(x, y, z, id);
}
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function ell(cx, cy, cz, rx, ry, rz, id, pred, shellOnly) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        const d = dx * dx + dy * dy + dz * dz;
        if (d > 1) continue;
        if (shellOnly) {
          const ex = (x - cx) / (rx - 1.2), ey = (y - cy) / (ry - 1.2), ez = (z - cz) / (rz - 1.2);
          if (ex * ex + ey * ey + ez * ez <= 1) continue;
        }
        if (pred && !pred(x, y, z, d)) continue;
        put(x, y, z, id);
      }
}
function ball(cx, cy, cz, r, id) { ell(cx, cy, cz, r, r, r, id); }
function tube(x1, y1, z1, x2, y2, z2, r, id) {
  const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1, z2 - z1)) + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    ball(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, r, id);
  }
}
function spike(x, y, z, dx, dy, dz, len) {
  for (let i = 0; i < len; i++) put(x + dx * i, y + dy * i, z + dz * i, i < len - 1 ? IRON : WHITE);
  put(x + dx, y + dy, z + dz + 1, IRON); put(x + dx, y + dy, z + dz - 1, IRON);
  put(x + dx + 1, y + dy, z + dz, IRON); put(x + dx - 1, y + dy, z + dz, IRON);
}

// Clear trees around the build (not the whole site)
for (let x = -14; x <= 14; x++) for (let y = 0; y <= 10; y++) for (let z = -13; z <= 16; z++) {
  const k = x + ',' + y + ',' + z; seen.add(k); block(x, y, z, AIR);
}

// Ground: cracked obsidian/stone plaza with lava ring
for (let x = -13; x <= 13; x++) for (let z = -13; z <= 16; z++) {
  const d = Math.hypot(x, z - 2);
  if (d > 13.5) continue;
  if (d > 11.5) { put(x, -1, z, LAVA); continue; }
  const h = ((x * 73856093) ^ (z * 19349663)) >>> 0;
  put(x, -1, z, (h % 7 === 0) ? OBSIDIAN : (h % 3 === 0) ? COBBLE : STONE);
}

// Legs + feet
for (const sx of [-1, 1]) {
  const lx = sx * 4.5;
  ell(lx, 4, 2, 3, 5, 3, GREEN);
  box(lx - 3, 0, -3, lx + 3, 2, 4, GREEN);
  box(lx - 2, 0, -3, lx + 2, 1, -1, GREEN);
  for (const cx of [lx - 2, lx, lx + 2]) { put(cx, 0, -4, WHITE); put(cx, 0, -5, WHITE); put(cx, 1, -4, WHITE); }
  box(lx - 3, 6, -1, lx + 3, 7, 5, GREEN);
}

// Belly (yellow, front) and shell (green, back)
ell(0, 11, 1, 6.5, 6.5, 4.5, YELLOW, (x, y, z) => z <= 3);
// belly plate lines
for (let y = 6; y <= 15; y += 2) ell(0, 11, 1, 6.7, 6.7, 4.7, ORANGE, (x, yy, z, d) => yy === y && z < 0 && d > 0.8);
ell(0, 12, 6, 8, 7.5, 6.5, GREEN, (x, y, z) => z >= 3);
// white rim of the shell
ell(0, 12, 6, 8.3, 7.8, 6.8, WHITE, (x, y, z, d) => (z === 3 || z === 4) && d > 0.72);
// shell spikes
spike(0, 19, 6, 0, 1, 0, 4);
spike(-5, 17.5, 6, -0.5, 1, 0, 3); spike(5, 17.5, 6, 0.5, 1, 0, 3);
spike(-3, 15, 11, 0, 0.6, 1, 3); spike(3, 15, 11, 0, 0.6, 1, 3);
spike(0, 12, 12, 0, 0, 1, 4);
spike(-5, 10, 11, -0.4, 0, 1, 3); spike(5, 10, 11, 0.4, 0, 1, 3);
spike(0, 7, 11, 0, -0.5, 1, 3);

// Tail
tube(0, 7, 11, 1, 4, 16, 2, GREEN);
tube(1, 4, 16, 3, 3, 19, 1.3, GREEN);
put(0, 10, 12, WHITE); put(1, 8, 15, WHITE); put(2, 6, 17, WHITE); put(3, 5, 19, WHITE);

// Neck + spiked collar
ell(0, 16, 0, 2.5, 2.5, 2.5, GREEN);
for (let a = 0; a < 16; a++) {
  const ang = a / 16 * Math.PI * 2;
  put(Math.round(Math.cos(ang) * 3.5), 16, Math.round(Math.sin(ang) * 3.5), BLACK);
  if (a % 4 === 0) { put(Math.round(Math.cos(ang) * 4.5), 16, Math.round(Math.sin(ang) * 4.5), IRON); put(Math.round(Math.cos(ang) * 5.5), 16, Math.round(Math.sin(ang) * 5.5), WHITE); }
}

// Head
ell(0, 21, -1, 5.5, 4.5, 5.5, GREEN);
// muzzle / snout (yellow)
box(-3, 17, -9, 3, 20, -4, YELLOW);
box(-4, 18, -8, 4, 20, -4, YELLOW);
// open mouth
box(-3, 17, -9, 3, 18, -5, RED);
box(-2, 17, -8, 2, 18, -5, BLACK);
// teeth
for (let x = -3; x <= 3; x += 2) { put(x, 19, -9, WHITE); put(x, 19, -8, WHITE); }
for (let x = -2; x <= 2; x += 2) put(x, 16, -9, WHITE);
// lower jaw
box(-3, 16, -9, 3, 16, -4, YELLOW);
box(-4, 15, -8, 4, 16, -3, GREEN);
// nostrils
put(-2, 21, -8, BLACK); put(2, 21, -8, BLACK);
box(-4, 21, -8, 4, 21, -5, GREEN);
// eyes
for (const s of [-1, 1]) {
  box(s * 2, 22, -7, s * 3, 23, -7, WHITE);
  box(s * 2, 22, -6, s * 3, 23, -6, WHITE);
  put(s * 2, 22, -7, NEON_RED);
  put(s * 2, 22, -8, NEON_RED);
  // angry brows
  put(s * 1, 24, -7, RED); put(s * 2, 24, -7, RED); put(s * 3, 25, -7, RED); put(s * 4, 25, -6, RED);
  put(s * 1, 24, -6, RED); put(s * 2, 24, -6, RED); put(s * 3, 25, -6, RED);
  // horns
  const hx = s * 4;
  box(hx - 1, 23, -2, hx + 1, 24, 0, IRON);
  put(hx, 25, -1, IRON); put(hx + s, 25, -1, IRON);
  put(hx + s, 26, -1, IRON); put(hx + s * 2, 26, -1, WHITE);
  put(hx + s * 2, 27, -1, WHITE); put(hx + s * 3, 27, -1, WHITE);
}
// red mane
box(-2, 25, -3, 2, 26, 2, RED);
box(-1, 27, -2, 1, 27, 3, RED);
put(0, 28, -1, RED); put(1, 28, 1, RED); put(-1, 28, 2, RED); put(0, 29, 0, RED); put(-2, 28, 0, RED);
put(2, 27, -3, RED); put(-2, 27, 3, RED); put(1, 29, 2, RED);
// hair down the back of the neck
box(-1, 21, 3, 1, 24, 4, RED); box(0, 18, 4, 0, 20, 5, RED); put(-1, 19, 5, RED); put(1, 17, 5, RED);

// Arms (angled forward, fists with spiked cuffs)
for (const s of [-1, 1]) {
  tube(s * 7, 15, 2, s * 11, 12, -1, 2.2, GREEN);
  tube(s * 11, 12, -1, s * 10, 8, -6, 2, GREEN);
  // cuff
  for (let a = 0; a < 12; a++) {
    const ang = a / 12 * Math.PI * 2;
    const cx = s * 10.5 + Math.cos(ang) * 3, cz = -3.5 + Math.sin(ang) * 3;
    put(cx, 10, cz, BLACK); put(cx, 9, cz, BLACK);
    if (a % 3 === 0) put(s * 10.5 + Math.cos(ang) * 4, 10, -3.5 + Math.sin(ang) * 4, IRON);
  }
  // fist
  ball(s * 10, 7, -7, 2.7, GREEN);
  put(s * 9, 7, -10, WHITE); put(s * 11, 7, -10, WHITE); put(s * 10, 6, -10, WHITE);
  put(s * 9, 7, -11, WHITE); put(s * 11, 7, -11, WHITE);
  // upper arm shoulder band
  box(s * 6, 15, 0, s * 8, 17, 3, GREEN);
}

// Fire breath
const breath = [[0, 18, -10], [0, 18.5, -11], [0, 19, -13], [1, 19, -14], [-1, 19.5, -15], [0, 20, -17]];
for (const [x, y, z] of breath) put(x, y, z, FIRE);
ball(0, 20, -16, 2.2, ORANGE);
ball(0, 20, -16, 1.2, LAVA);
put(1, 21, -18, FIRE); put(-1, 20, -18, FIRE); put(0, 22, -17, FIRE);

// Background: two obsidian pillars with lava caps (Bowser's castle vibe)
for (const px of [-14, 14]) {
  for (let y = 0; y <= 13; y++) {
    for (let x = px - 1; x <= px + 1; x++) for (let z = 12; z <= 14; z++) {
      const edge = (x === px - 1 || x === px + 1) && (z === 12 || z === 14);
      put(x, y, z, edge ? OBSIDIAN : (y % 4 === 0 ? BRICK : STONE));
    }
  }
  box(px - 2, 14, 11, px + 2, 14, 15, OBSIDIAN);
  box(px - 1, 15, 12, px + 1, 15, 14, LAVA);
  put(px, 16, 13, FIRE);
}

// small lava cracks on the plaza
for (const [x, z] of [[-8, -6], [-9, -5], [7, 9], [8, 10], [9, 10], [-6, 12], [-7, 13], [10, -7]]) put(x, -1, z, LAVA);