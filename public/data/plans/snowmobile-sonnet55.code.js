// snowmobile-sonnet55 — prompt:
// a snowmobile jumping over a snowdrift...

let _s = 987654321;
const rnd = () => { _s = (_s * 1664525 + 1013904223) % 4294967296; return _s / 4294967296; };

// ---------- clear site (trees) ----------
cube(-19, 0, -17, 19, 12, 9, AIR);

// ---------- ground ----------
for (let x = -19; x <= 19; x++) for (let z = -11; z <= 9; z++) {
  const e = Math.pow(x / 19, 2) + Math.pow((z + 1) / 10.5, 2);
  if (e <= 1 + 0.12 * Math.sin(x * 1.3 + z * 0.9)) block(x, 0, z, SNOW);
  else if (e <= 1.5 && rnd() < 0.35) block(x, -1, z, SNOW);
}

// ---------- the snowdrift ----------
const driftH = (x, z) => {
  const xs = x < 2 ? 1 - Math.pow(Math.abs(x - 2) / 9.5, 1.7) : 1 - Math.pow((x - 2) / 6.5, 1.5);
  if (xs <= 0) return 0;
  const zs = 1 - Math.pow(Math.abs(z - 0.5) / 7.5, 2);
  if (zs <= 0) return 0;
  return Math.max(0, Math.round(7.5 * xs * zs + 0.7 * Math.sin(x * 0.9 + z * 0.55) * xs * zs));
};
for (let x = -8; x <= 9; x++) for (let z = -7; z <= 8; z++) {
  const h = driftH(x, z);
  if (h > 0) {
    cube(x, 1, z, x, h, z, SNOW);
    if (h >= 3 && rnd() < 0.09) block(x, h, z, ICE);
  }
}
// leeward cornice curl
for (let z = -3; z <= 4; z++) {
  const c = 7 - Math.abs(z - 0.5) * 0.8;
  block(4, Math.round(c), z, SNOW); block(5, Math.round(c) - 1, z, SNOW);
}

// small landing mounds
for (let x = 11; x <= 18; x++) for (let z = -6; z <= 3; z++) {
  const h = Math.round(2.4 * Math.max(0, 1 - Math.pow((x - 14) / 4, 2)) * Math.max(0, 1 - Math.pow((z + 1.5) / 4.5, 2)));
  if (h > 0) cube(x, 1, z, x, h, z, SNOW);
}

// ---------- kicker ramp ----------
const rampH = (x, z) => {
  if (x < -17 || x > -9) return 0;
  const t = (x + 17) / 8;
  const zs = Math.max(0, 1 - Math.pow(z / 4.6, 4));
  return Math.round(4.2 * Math.pow(t, 1.5) * zs);
};
for (let x = -17; x <= -9; x++) for (let z = -4; z <= 4; z++) {
  const h = rampH(x, z);
  if (h > 0) cube(x, 1, z, x, h, z, SNOW);
}
// ski + track ruts leading to the lip
for (let x = -22; x <= -9; x++) {
  for (const z of [-3, 0, 3]) {
    const h = x >= -17 ? rampH(x, z) : 0;
    if (h > 0 || x < -17) block(x, Math.max(0, h), z, ICE);
  }
}

// ---------- trail markers ----------
for (const [px, pz] of [[-19, -6], [-13, -7], [-3, -9], [6, -9], [13, -8]]) {
  cube(px, 0, pz, px, 4, pz, OAK_LOG);
  block(px + 1, 4, pz, ORANGE); block(px + 1, 3, pz, ORANGE); block(px, 5, pz, SNOW);
}

// ---------- rocks ----------
function rock(cx, cz, r) {
  for (let dx = -r; dx <= r; dx++) for (let dy = -1; dy <= r; dy++) for (let dz = -r; dz <= r; dz++) {
    const d = Math.sqrt(dx * dx + dy * dy * 1.3 + dz * dz);
    if (d <= r) block(cx + dx, 1 + dy, cz + dz, (dy >= r - 1 || (dy >= 1 && rnd() < 0.3)) ? SNOW : (rnd() < 0.5 ? STONE : GRAY));
  }
}
rock(-15, -9, 2); rock(11, -9, 2); rock(-5, -11, 1); rock(17, 4, 2);

// ---------- snowman spectator ----------
{
  const sx = 15, sz = -5;
  sphere(sx, 2, sz, 2, SNOW); sphere(sx, 5, sz, 1, SNOW); sphere(sx, 7, sz, 1, SNOW);
  block(sx - 1, 8, sz - 1, BLACK); block(sx + 1, 8, sz - 1, BLACK); block(sx, 7, sz - 2, ORANGE);
  block(sx, 5, sz - 1, BLACK); block(sx, 4, sz - 1, BLACK);
  for (const [a, b] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) block(sx + a, 6, sz + b, RED);
  block(sx + 2, 5, sz - 2, RED); block(sx + 2, 4, sz - 2, RED);
  cube(sx - 2, 9, sz - 2, sx + 2, 9, sz + 2, BLACK); cube(sx - 1, 10, sz - 1, sx + 1, 12, sz + 1, BLACK);
  line(sx + 2, 5, sz, sx + 5, 8, sz, OAK_LOG); line(sx - 2, 5, sz, sx - 4, 4, sz, OAK_LOG);
}

// ---------- pines ----------
function pine(x, z, R, T) {
  cube(x, -1, z, x, 2, z, OAK_LOG);
  for (let i = 0; i < T; i++) {
    const r = R - i, yb = 2 + 2 * i;
    if (r < 0) break;
    disk(x, yb, z, r, LEAVES);
    if (r - 1 >= 0) disk(x, yb + 1, z, r - 1, SNOW);
  }
  block(x, 2 + 2 * T, z, SNOW);
}
pine(-17, 4, 4, 5); pine(19, 3, 3, 4); pine(-11, 12, 4, 5); pine(-3, 14, 3, 4);
pine(7, 12, 4, 5); pine(14, 11, 3, 4); pine(-20, 11, 3, 4);

// ---------- mountains ----------
function peak(cx, cz, R, Hh) {
  for (let k = 0; k < Hh; k++) {
    const rk = R * (1 - k / Hh);
    for (let x = cx - R - 2; x <= cx + R + 2; x++) for (let z = cz - R - 2; z <= cz; z++) {
      const d = Math.sqrt((x - cx) * (x - cx) + (z - cz) * (z - cz)) + Math.sin(x * 0.7 + k * 0.5) * 0.6;
      if (d <= rk && (d > rk - 1.4 || rk < 1.6)) {
        block(x, k, z, k > Hh * 0.55 ? SNOW : ((x + z + k) % 3 === 0 ? COBBLE : STONE));
      }
    }
  }
}
peak(-9, 21, 10, 15); peak(12, 21, 7, 11);

// ---------- snowmobile (local model, rotated 12 degrees nose-up) ----------
const L = [];
const B = (u1, v1, w1, u2, v2, w2, id) => L.push([0, u1, v1, w1, u2, v2, w2, id]);
const SP = (u, v, w, r, id) => L.push([1, u, v, w, r, id]);
const LN = (u1, v1, w1, u2, v2, w2, id) => {
  const n = Math.max(Math.abs(u2 - u1), Math.abs(v2 - v1), Math.abs(w2 - w1), 1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = Math.round(u1 + (u2 - u1) * t), v = Math.round(v1 + (v2 - v1) * t), w = Math.round(w1 + (w2 - w1) * t);
    B(u, v, w, u, v, w, id);
  }
};
// track
B(-7, 0, -1, -1, 2, 1, BLACK); B(-8, 1, -1, -8, 1, 1, BLACK);
for (let u = -7; u <= -1; u += 2) B(u, 0, -1, u, 0, 1, GRAY);
B(-6, 1, -2, -1, 1, -2, IRON); B(-6, 1, 2, -1, 1, 2, IRON);
// tunnel
B(-8, 3, -2, -1, 3, 2, RED); B(-7, 2, -2, -1, 2, -2, RED); B(-7, 2, 2, -1, 2, 2, RED);
// seat
B(-7, 4, -1, -2, 4, 1, BLACK); B(-7, 5, -1, -7, 5, 1, BLACK);
// rear rack + taillights + exhaust
B(-9, 4, -1, -8, 4, 1, GRAY); B(-9, 3, -1, -9, 3, -1, NEON_RED); B(-9, 3, 1, -9, 3, 1, NEON_RED);
B(-9, 2, 1, -9, 2, 2, IRON);
// belly, skid plate
B(0, 2, -2, 7, 3, 2, RED); B(1, 1, -1, 6, 1, 1, GRAY);
// white side stripe
B(-7, 2, -2, 7, 2, -2, WHITE); B(-7, 2, 2, 7, 2, 2, WHITE);
// hood
B(1, 4, -2, 4, 4, 2, RED); B(5, 4, -1, 7, 4, 1, RED); B(1, 5, -1, 4, 5, 1, RED); B(8, 3, -1, 8, 4, 1, RED);
B(1, 5, 0, 4, 5, 0, WHITE); B(5, 4, 0, 7, 4, 0, WHITE);
B(3, 4, -2, 3, 4, -2, BLACK); B(3, 4, 2, 3, 4, 2, BLACK); B(2, 4, -2, 2, 4, -2, BLACK); B(2, 4, 2, 2, 4, 2, BLACK);
B(8, 4, -1, 8, 4, -1, GLOWSTONE); B(8, 4, 1, 8, 4, 1, GLOWSTONE); B(8, 3, 0, 8, 3, 0, IRON);
B(-1, 4, -1, 0, 4, 1, RED);
// windshield
for (let w = -1; w <= 1; w++) { B(3, 6, w, 3, 6, w, GLASS); B(2, 6, w, 2, 7, w, GLASS); B(1, 7, w, 1, 8, w, GLASS); B(0, 8, w, 0, 8, w, GLASS); }
LN(3, 6, -2, 1, 8, -2, BLACK); LN(3, 6, 2, 1, 8, 2, BLACK); B(1, 9, -1, 1, 9, 1, BLACK);
// handlebars
B(0, 4, 0, 0, 6, 0, IRON); B(0, 6, -3, 0, 6, 3, BLACK);
B(1, 6, -3, 1, 7, -3, ORANGE); B(1, 6, 3, 1, 7, 3, ORANGE);
// skis
for (const s of [-3, 3]) {
  B(2, 0, s, 9, 0, s, BLACK); B(10, 1, s, 10, 1, s, BLACK); B(11, 2, s, 11, 2, s, BLACK);
  B(4, 1, s, 6, 1, s, GRAY); B(4, 2, s, 6, 2, s, IRON);
  B(6, 1, s, 6, 2, s > 0 ? 2 : -2, GRAY);
}
// rider: legs
for (const s of [-1, 1]) {
  B(-4, 5, s, -2, 5, s, BLUE); B(-2, 6, s, -1, 6, s, BLUE);
  B(-1, 6, s * 2, -1, 6, s * 2, BLUE); B(-1, 5, s * 2, -1, 5, s * 2, BLUE);
  B(-1, 4, s * 2, 0, 4, s * 2, BLACK);
}
// torso, pack, shoulders
B(-5, 5, -1, -4, 6, 1, BLUE); B(-4, 7, -1, -3, 7, 1, BLUE); B(-3, 8, -2, -2, 9, 2, BLUE);
B(-5, 7, -1, -5, 8, 1, BROWN); B(-6, 7, 0, -6, 7, 0, BROWN);
B(-3, 10, -1, -2, 10, 1, ORANGE);
// arms
for (const s of [-1, 1]) {
  B(-3, 8, 3 * s, -3, 8, 3 * s, BLUE); LN(-3, 8, 3 * s, -1, 7, 3 * s, BLUE); B(-1, 6, 3 * s, 0, 6, 3 * s, BLACK);
}
// head / helmet
SP(-1, 12, 0, 2, YELLOW);
B(0, 12, -1, 0, 13, 1, BLACK); B(1, 12, 0, 1, 12, 0, BLACK);
B(-2, 14, 0, 0, 14, 0, WHITE); B(-3, 13, 0, -3, 13, 0, WHITE);
// scarf streaming back
LN(-3, 10, 0, -9, 12, 2, ORANGE); LN(-3, 10, 0, -8, 11, -1, ORANGE); B(-9, 13, 2, -9, 13, 2, ORANGE);

// rasterize local model
const LM = new Map();
const key = (u, v, w) => (u + 30) * 10000 + (v + 30) * 100 + (w + 30);
for (const it of L) {
  if (it[0] === 0) {
    for (let u = Math.min(it[1], it[4]); u <= Math.max(it[1], it[4]); u++)
      for (let v = Math.min(it[2], it[5]); v <= Math.max(it[2], it[5]); v++)
        for (let w = Math.min(it[3], it[6]); w <= Math.max(it[3], it[6]); w++) LM.set(key(u, v, w), it[7]);
  } else {
    const cu = it[1], cv = it[2], cw = it[3], r = it[4], id = it[5];
    for (let u = -r; u <= r; u++) for (let v = -r; v <= r; v++) for (let w = -r; w <= r; w++)
      if (u * u + v * v + w * w <= r * r + 1) LM.set(key(cu + u, cv + v, cw + w), id);
  }
}
const TH = 12 * Math.PI / 180, cs = Math.cos(TH), sn = Math.sin(TH);
const CX = 1, CY = 11, CZ = 0;
for (let x = CX - 24; x <= CX + 16; x++) for (let y = CY - 4; y <= CY + 20; y++) for (let z = CZ - 4; z <= CZ + 4; z++) {
  const dx = x - CX, dy = y - CY;
  const u = Math.round(dx * cs + dy * sn), v = Math.round(-dx * sn + dy * cs), w = z - CZ;
  const id = LM.get(key(u, v, w));
  if (id !== undefined) block(x, y, z, id);
}
const tw = (u, v, w) => [Math.round(CX + u * cs - v * sn), Math.round(CY + u * sn + v * cs), CZ + w];
// exhaust steam
for (const q of [[-11, 3, 1], [-13, 5, 2], [-12, 1, 0]]) { const p = tw(q[0], q[1], q[2]); block(p[0], p[1], p[2], STEAM); }

// ---------- flying snow spray ----------
for (let i = 0; i < 40; i++) {
  const x = Math.round(-12 + rnd() * 5), y = Math.round(5 + rnd() * 6), z = Math.round(-4 + rnd() * 8);
  block(x, y, z, rnd() < 0.8 ? SNOW : ICE);
}
for (let i = 0; i < 32; i++) {
  const t = rnd();
  block(Math.round(-9 - t * 8), Math.round(9 - t * 3 + rnd() * 3 - 1), Math.round((rnd() - 0.5) * 6), rnd() < 0.85 ? SNOW : ICE);
}
for (let i = 0; i < 20; i++) {
  block(Math.round(-1 + rnd() * 6), Math.round(8 + rnd() * 2), Math.round(-4 + rnd() * 8), SNOW);
}