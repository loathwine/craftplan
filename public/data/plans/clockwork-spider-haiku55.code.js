// clockwork-spider-haiku55 — prompt:
// a giant clockwork spider...

const G = {};
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  if (typeof id === 'function') id = id(x, y, z);
  G[x + ',' + y + ',' + z] = id;
}
function ell(cx, cy, cz, rx, ry, rz, id, thick) {
  const t = thick || 0;
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
  for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
    const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
    if (d > 1) continue;
    if (t > 0 && rx - t > 0 && ry - t > 0 && rz - t > 0) {
      const di = ((x - cx) / (rx - t)) ** 2 + ((y - cy) / (ry - t)) ** 2 + ((z - cz) / (rz - t)) ** 2;
      if (di <= 1) continue;
    }
    put(x, y, z, id);
  }
}
function sph(cx, cy, cz, r, id) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++)
  for (let dy = -R; dy <= R; dy++)
  for (let dz = -R; dz <= R; dz++)
    if (dx * dx + dy * dy + dz * dz <= r * r + 0.01)
      put(Math.round(cx) + dx, Math.round(cy) + dy, Math.round(cz) + dz, id);
}
function seg(a, b, r, id) {
  const L = Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2);
  const n = Math.max(2, Math.ceil(L * 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    sph(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r, id);
  }
}
function gear(c, R, rim, axis) {
  for (let u = -R - 1; u <= R + 1; u++)
  for (let v = -R - 1; v <= R + 1; v++) {
    const d = Math.sqrt(u * u + v * v);
    let col = null;
    if (d <= 1.2) col = GOLD;
    else if (d <= R && d >= R - 1.3) col = rim;
    else if (d > R && d <= R + 1 && Math.abs(Math.round(Math.atan2(v, u) * R)) % 2 === 0) col = rim;
    else if (d < R - 1.3 && (u === 0 || v === 0)) col = IRON;
    if (col === null) continue;
    if (axis === 'x') put(c[0], c[1] + v, c[2] + u, col);
    else if (axis === 'z') put(c[0] + u, c[1] + v, c[2], col);
    else put(c[0] + u, c[1], c[2] + v, col);
  }
}
function leg(s, zA, hx, fz, kneeY) {
  const hip = [s * hx, 9, zA];
  const knee = [s * 9.5, kneeY, (zA + fz) / 2 - 1];
  const ankle = [s * 13, 4, fz];
  const foot = [s * 15, 0, fz];
  seg(hip, knee, 1, IRON);
  seg(knee, ankle, 1, COPPER);
  seg(ankle, foot, 0.8, IRON);
  sph(knee[0], knee[1], knee[2], 1.5, GOLD);
  sph(ankle[0], ankle[1], ankle[2], 1, GOLD);
  put(s * 16, 0, fz, COPPER);
  put(s * 16, 0, fz - 1, COPPER);
}

// ---- BODY (front = north, -Z) ----
// abdomen (rear, +Z): copper bands + gold rivets
ell(0, 9, 7, 5, 5, 6, (x, y, z) => Math.abs(z - 7) % 3 === 0 ? COPPER : ((x + 2 * y + z) % 7 === 0 ? GOLD : IRON), 2);
// cephalothorax (front): riveted iron plating
ell(0, 9, -4, 4.5, 4, 4, (x, y, z) => Math.abs(x) >= 3 ? COPPER : ((x + 2 * y + 3 * z) % 6 === 0 ? GOLD : IRON), 2);
// waist joint
ell(0, 9, 1, 2, 2, 1.5, COPPER);

// ---- HEAD DETAIL ----
for (const s of [-1, 1]) {
  put(s * 2, 10, -7, NEON_RED);
  put(s * 1, 11, -7, NEON_RED);
  put(s * 3, 9, -6, NEON_RED);
  put(s * 3, 11, -5, NEON_RED);
  seg([s * 1.5, 7, -6], [s * 1, 3, -9], 0.7, IRON);
  put(s * 1, 3, -9, OBSIDIAN);
}

// ---- CLOCKWORK GEARS ----
gear([6, 9, 7], 3, COPPER, 'x');
gear([-6, 9, 7], 3, COPPER, 'x');
put(5, 9, 7, IRON); put(-5, 9, 7, IRON);
gear([6, 10, -4], 2, GOLD, 'x');
gear([-6, 10, -4], 2, GOLD, 'x');
put(4, 10, -4, IRON); put(5, 10, -4, IRON);
put(-4, 10, -4, IRON); put(-5, 10, -4, IRON);

// ---- DORSAL SPIKES + STEAM STACK ----
for (let z = 3; z <= 11; z += 2) {
  const t = 9 + Math.round(5 * Math.sqrt(Math.max(0, 1 - ((z - 7) / 6) ** 2)));
  put(0, t + 1, z, COPPER);
  put(0, t + 2, z, z === 7 ? GOLD : COPPER);
}
for (let y = 14; y <= 18; y++) put(0, y, 8, COPPER);
put(0, 19, 8, STEAM); put(1, 19, 8, STEAM); put(-1, 19, 8, STEAM); put(0, 19, 9, STEAM);

// ---- LEGS (4 pairs) ----
for (const s of [-1, 1]) {
  leg(s, -5, 4.5, -13, 15);
  leg(s, -2, 4.5, -8, 15);
  leg(s, 0, 3, -1, 14);
  leg(s, 2, 3, 6, 14);
}

// ---- FOREGROUND: loose cogs on the ground ----
gear([-9, 0, -15], 3, COPPER, 'y');
gear([8, 0, -17], 4, IRON, 'y');
gear([-2, 0, -19], 2, COPPER, 'y');

// ---- BACKGROUND: clock tower (behind, south-west) ----
for (let y = 0; y <= 26; y++)
for (let x = -16; x <= -12; x++)
for (let z = 14; z <= 18; z++) {
  const edge = x === -16 || x === -12 || z === 14 || z === 18;
  if (!edge && y % 6 !== 0) continue;
  put(x, y, z, y % 6 === 0 ? COPPER : COBBLE);
}
put(-14, 8, 14, GLASS);
put(-14, 14, 14, GLASS);
for (let k = 0; k < 3; k++)
for (let x = -16 + k; x <= -12 - k; x++)
for (let z = 14 + k; z <= 18 - k; z++)
  put(x, 27 + k, z, k === 0 ? COPPER : IRON);
put(-14, 30, 16, GOLD);
put(-14, 31, 16, GOLD);

// clock face on the north wall
const CX = -14, CY = 22;
for (let dx = -3; dx <= 3; dx++)
for (let dy = -3; dy <= 3; dy++) {
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d >= 2 && d <= 2.6) put(CX + dx, CY + dy, 13, IRON);
  else if (d < 2) put(CX + dx, CY + dy, 13, MARBLE);
}
put(CX, CY, 13, GOLD);
put(CX, CY + 1, 13, BLACK);
put(CX, CY + 2, 13, BLACK);
put(CX + 1, CY, 13, BLACK);
put(CX + 2, CY, 13, BLACK);

// ---- FLUSH (budget-guarded) ----
let solid = 0;
for (const k in G) {
  if (solid >= 3950) break;
  solid++;
  const p = k.split(',');
  block(+p[0], +p[1], +p[2], G[k]);
}