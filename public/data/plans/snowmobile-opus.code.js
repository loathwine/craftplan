// snowmobile-opus — prompt:
// a snowmobile jumping over a snowdrift...

// Snowmobile jumping over a wind-sculpted snowdrift
const OUT = new Map();
function P(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  OUT.set(x + ',' + y + ',' + z, id);
}
function rnd(i) { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); }

// ---------------- SNOWFIELD (irregular ellipse) ----------------
const EX = 0, EZ = 2, RX = 18, RZ = 14;
function inField(x, z) {
  const e = ((x - EX) / RX) ** 2 + ((z - EZ) / RZ) ** 2;
  return e + (rnd(x * 31 + z * 7) - 0.5) * 0.12;
}
// clear trees inside the snowfield footprint (AIR is free)
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  if (inField(x, z) > 1) continue;
  for (let y = 0; y <= 9; y++) P(x, y, z, AIR);
}

// ---------------- DRIFT height field ----------------
function crestX(z) { return 1 + 1.6 * Math.sin(z * 0.28) + 0.8 * Math.sin(z * 0.71 + 1); }
function driftH(x, z) {
  const env = 1 - ((z - 3) / 14) ** 2;
  if (env <= 0) return 0;
  const H = 7.2 * env + 0.6 * Math.sin(z * 0.9);
  const s = x - crestX(z);
  let h;
  if (s < 0) h = H * (1 - (s / 13) ** 2);        // long gentle windward slope
  else h = H * (1 - (s / 3.2) ** 1.6);            // steep lee face
  return Math.max(0, Math.floor(h));
}
function rippleH(x, z) {
  let h = 0;
  const a = 1 - ((x - 11) / 6) ** 2 - ((z - 9) / 3.5) ** 2; if (a > 0) h = Math.max(h, Math.floor(a * 2.6));
  const b = 1 - ((x + 15) / 4) ** 2 - ((z + 3) / 6) ** 2; if (b > 0) h = Math.max(h, Math.floor(b * 2.2));
  const c = 1 - ((x - 15) / 4) ** 2 - ((z + 4) / 3) ** 2; if (c > 0) h = Math.max(h, Math.floor(c * 1.8));
  return h;
}

// ---------------- vehicle placement + ruts ----------------
const YAW = 20 * Math.PI / 180, PITCH = 13 * Math.PI / 180;
const dX = Math.cos(YAW), dZ = -Math.sin(YAW);   // travel direction (east, angled toward camera)
const nX = Math.sin(YAW), nZ = Math.cos(YAW);    // vehicle side axis
const C = { x: 0, y: 11, z: 2 };
function rutAt(x, z) {
  const rx = x - C.x, rz = z - C.z;
  const t = rx * dX + rz * dZ;
  const w = rx * nX + rz * nZ;
  if (t > -9) return 0;                                       // ruts end at the takeoff point
  const aw = Math.abs(w);
  if (aw <= 2.4) return (Math.round(t) % 3 === 0) ? 2 : 1;   // track groove with tread prints
  if (aw >= 3.6 && aw <= 4.5) return 1;                      // ski grooves
  return 0;
}

const Hmap = {};
function surfH(x, z) {
  const k = x + ',' + z;
  if (k in Hmap) return Hmap[k];
  const h = Math.max(driftH(x, z), rippleH(x, z));
  Hmap[k] = h;
  return h;
}
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const e = inField(x, z);
  if (e > 1) continue;
  const h = surfH(x, z);
  let nmin = h;
  for (const [ox, oz] of [[1,0],[-1,0],[0,1],[0,-1]]) nmin = Math.min(nmin, inField(x+ox, z+oz) > 1 ? -2 : surfH(x+ox, z+oz));
  const r = rutAt(x, z);
  const top = h - (r ? 1 : 0);
  const bottom = e > 0.82 ? Math.min(top, -1) : Math.min(top, Math.max(0, nmin - 1));
  for (let y = bottom; y <= top; y++) P(x, y, z, SNOW);
  if (r === 2) P(x, top, z, LIGHT_GRAY);
  if (r) { for (let y = top + 1; y <= h; y++) P(x, y, z, AIR); }
}
// cornice overhang on the lee crest + icy glaze at the lee foot
for (let z = -9; z <= 14; z++) {
  const cx = crestX(z), H = driftH(Math.round(cx), z);
  if (H < 3) continue;
  const over = 1 + (rnd(z * 3.3) > 0.4 ? 1 : 0);
  for (let i = 1; i <= over + 1; i++) {
    const x = Math.round(cx + 1.5 + i);
    P(x, H - 1, z, SNOW);
    if (i <= over) P(x, H, z, SNOW);
  }
  if (rnd(z * 9.1) > 0.45) P(Math.round(cx + 4), 1, z, ICE);
}
// kicked-up chunks at the takeoff point
for (let i = 0; i < 14; i++) {
  const t = -9 - rnd(i) * 3, w = (rnd(i + 50) - 0.5) * 6;
  const x = C.x + t * dX + w * nX, z = C.z + t * dZ + w * nZ;
  P(x, surfH(Math.round(x), Math.round(z)) + 1, z, rnd(i + 9) > 0.5 ? SNOW : WHITE);
}

// ---------------- SNOWMOBILE (local model u=forward, v=up, w=side) ----------------
const M = new Map();
function L(u, v, w, id) { M.set(u + ',' + v + ',' + w, id); }
function LS(u, v, w, id) { L(u, v, w, id); L(u, v, -w, id); }
function LB(u1, v1, w1, u2, v2, w2, id) {
  for (let u = u1; u <= u2; u++) for (let v = v1; v <= v2; v++) for (let w = w1; w <= w2; w++) L(u, v, w, id);
}
function LL(a, b, id, th) {
  const n = Math.max(Math.abs(b[0]-a[0]), Math.abs(b[1]-a[1]), Math.abs(b[2]-a[2])) * 2 + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = Math.round(a[0] + (b[0]-a[0]) * t), v = Math.round(a[1] + (b[1]-a[1]) * t), w = Math.round(a[2] + (b[2]-a[2]) * t);
    if (th) { for (let du = 0; du <= 1; du++) for (let dv = 0; dv <= 1; dv++) L(u+du, v+dv, w, id); }
    else L(u, v, w, id);
  }
}
function LSph(cu, cv, cw, r, fn) {
  const R = Math.ceil(r);
  for (let u = -R; u <= R; u++) for (let v = -R; v <= R; v++) for (let w = -R; w <= R; w++)
    if (u*u + v*v + w*w <= r*r) { const id = fn(u, v, w); if (id !== undefined) L(cu+u, cv+v, cw+w, id); }
}

// track
LB(-9, 0, -2, 1, 2, 2, BLACK);
LB(2, 1, -2, 2, 3, 2, BLACK);
LB(3, 2, -2, 3, 3, 2, BLACK);
L(-9, 0, -2, AIR); L(-9, 0, 2, AIR);
for (let u = -8; u <= 0; u += 2) LB(u, -1, -2, u, -1, 2, BLACK);
for (const u of [-7, -4, -1]) LS(u, 1, 2, IRON);
LS(-9, 1, 2, IRON); LS(1, 2, 2, GRAY);
LS(-8, 2, 2, GRAY); LS(-5, 2, 2, GRAY); LS(-2, 2, 2, GRAY);
// tunnel / rear
LB(-11, 3, -3, 2, 3, 3, RED);
LB(-11, 4, -3, -9, 4, 3, RED);
LB(-11, 0, -2, -11, 2, 2, BLACK);
LB(-12, 4, -1, -12, 4, 1, NEON_RED);
LB(-12, 3, -2, -12, 3, 2, IRON);
LB(-11, 5, -3, -9, 5, -3, IRON); LB(-11, 5, 3, -9, 5, 3, IRON); LB(-11, 5, -2, -11, 5, 2, IRON);
for (let u = -6; u <= 1; u++) LS(u, 3, 4, GRAY);
LS(-6, 2, 4, IRON); LS(1, 2, 4, IRON);
LS(-8, 3, 3, BLACK);
// seat
LB(-8, 4, -2, -1, 5, 2, BLACK);
LB(-8, 6, -2, -7, 6, 2, BLACK);
for (let u = -8; u <= -1; u++) LS(u, 4, 3, GRAY);
LB(-6, 6, -1, -2, 6, 1, GRAY);
// hood / cowl
const VT = [9, 9, 9, 8, 8, 8, 7, 7, 7, 6, 6, 5, 5];
const HW = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2];
for (let u = 0; u <= 12; u++) {
  const vb = u >= 11 ? 3 : 2, vt = VT[u], hw = HW[u];
  for (let v = vb; v <= vt; v++) for (let w = -hw; w <= hw; w++) {
    let id = RED;
    if (v === vb) id = BLACK;
    if (Math.abs(w) === hw && v === Math.round(6.5 - u * 0.25)) id = WHITE;
    if (Math.abs(w) === hw && v === Math.round(5.5 - u * 0.25) && u > 1 && u < 10) id = YELLOW;
    if (v === vt && w === 0 && u > 2) id = WHITE;
    if (u === 12 && (v === 4 || v === 5) && Math.abs(w) === 1) id = GLOWSTONE;
    if (u === 12 && v === 4 && w === 0) id = BLACK;
    L(u, v, w, id);
  }
}
for (let u = 3; u <= 7; u++) LS(u, 5, 3, BLACK);
LB(13, 3, -2, 13, 3, 2, IRON); LS(13, 4, 2, IRON);
LS(12, 6, 1, YELLOW);
// windshield
for (const [u, v] of [[3, 9], [2, 10], [1, 10], [1, 11], [0, 10], [0, 11], [0, 12]]) {
  LB(u, v, -2, u, v, 2, GLASS); LS(u, v, 3, BLACK);
}
// handlebars
LB(-1, 10, -3, -1, 10, 3, IRON); L(-1, 9, 0, IRON); L(0, 9, 0, IRON);
LS(-1, 10, 4, BLACK); LS(-1, 10, 5, BLACK); LS(0, 10, 4, RED); LS(0, 11, 4, RED);
// exhaust
L(9, 3, -3, IRON); L(9, 2, -4, IRON);
// skis + front suspension
for (const s of [-4, 4]) {
  const sg = Math.sign(s);
  LB(3, -2, s, 13, -2, s, BLACK);
  L(14, -1, s, BLACK); L(15, 0, s, BLACK); L(15, 1, s, BLACK);
  LB(6, -1, s, 9, -1, s, IRON);
  LL([7, -1, s], [7, 2, s], IRON);
  LL([7, 0, s], [3, 2, sg * 2], IRON);
  LL([7, 2, s], [4, 3, sg * 3], IRON);
  LL([8, 1, s], [6, 4, sg * 4], GOLD);
  L(15, 2, s, IRON); L(14, 2, s, IRON);
}
// rider: standing, knees bent, soaking up the air
for (const s of [-1, 1]) {
  LB(-3, 4, 3 * s, -1, 5, 3 * s, BLACK);
  L(0, 4, 3 * s, BLACK);
  LL([-2, 6, 3 * s], [0, 8, 2 * s], BLACK, true);
  LL([0, 8, 2 * s], [-4, 10, s], BLACK, true);
  LL([-1, 14, 3 * s], [-3, 12, 4 * s], BLUE);
  L(-1, 14, 3 * s, BLUE); L(-2, 13, 4 * s, BLUE); L(-3, 12, 3 * s, BLUE);
  LL([-3, 12, 4 * s], [-1, 10, 4 * s], BLUE);
  L(-2, 11, 4 * s, BLUE); L(-1, 11, 4 * s, BLACK);
}
LB(-5, 9, -2, -3, 10, 2, BLACK);
for (let v = 11; v <= 15; v++) {
  const o = Math.floor((v - 11) / 2);
  LB(-5 + o, v, -2, -2 + o, v, 2, BLUE);
  if (v === 13) { LS(-5 + o, v, 2, YELLOW); LS(-2 + o, v, 2, YELLOW); LB(-5 + o, v, -1, -5 + o, v, 1, YELLOW); }
}
LB(-6, 12, -1, -6, 14, 1, GRAY);
LB(-3, 16, -1, -1, 16, 1, BLUE);
LSph(-1, 18, 0, 2.4, (u, v, w) => {
  if (u >= 1 && v >= -1 && v <= 0 && Math.abs(w) <= 1) return OBSIDIAN;
  if (u >= 2 && v === -2) return BLACK;
  if (w === 0 && v >= 0) return RED;
  return WHITE;
});
L(2, 19, 0, RED); L(1, 20, 0, RED);

// rotate into the world (nose up + yawed toward camera), inverse-sampled so no holes
const cY = Math.cos(YAW), sY = Math.sin(YAW), cP = Math.cos(PITCH), sP = Math.sin(PITCH);
for (let dx = -18; dx <= 18; dx++) for (let dy = -6; dy <= 22; dy++) for (let dz = -14; dz <= 14; dz++) {
  const up = dx * cY - dz * sY;
  const w = dx * sY + dz * cY;
  const u = up * cP + dy * sP;
  const v = -up * sP + dy * cP;
  const id = M.get(Math.round(u) + ',' + Math.round(v) + ',' + Math.round(w));
  if (id === undefined || id === AIR) continue;
  P(C.x + dx, C.y + dy, C.z + dz, id);
}
function toWorld(u, v, w) {
  const up = u * cP - v * sP, vv = u * sP + v * cP;
  return [C.x + up * cY + w * sY, C.y + vv, C.z - up * sY + w * cY];
}

// ---------------- SNOW SPRAY off the track ----------------
for (let i = 0; i < 70; i++) {
  const t = rnd(i * 2.1);
  const u = -12 - t * 8, v = 0.5 - t * 6 + (rnd(i + 300) - 0.5) * (2 + t * 4);
  const w = (rnd(i + 700) - 0.5) * (4 + t * 7);
  const [x, y, z] = toWorld(u, v, w);
  if (y <= surfH(Math.round(x), Math.round(z)) + 0.5) continue;
  P(x, y, z, rnd(i + 900) > 0.35 ? SNOW : WHITE);
}
// powder puffs (STEAM reads as blown snow) + exhaust
const puffs = [[-11, -1, 0], [-12, 0, -2], [-12, -1, 2], [-14, -3, -1], [-15, -2, 3], [-16, -5, 0], [-13, -2, -4], [-17, -4, -3]];
for (const [u, v, w] of puffs) { const [x, y, z] = toWorld(u, v, w); P(x, y, z, STEAM); }
{ const [x, y, z] = toWorld(9, 2, -5); P(x, y, z, STEAM); }
for (const w of [-3, 0, 3]) {
  const x = C.x - 10 * dX + w * nX, z = C.z - 10 * dZ + w * nZ;
  P(x, surfH(Math.round(x), Math.round(z)) + 2, z, STEAM);
}

// ---------------- SNOWY SPRUCES (background) ----------------
function spruce(bx, bz, ht) {
  const g = surfH(bx, bz);
  for (let y = g - 1; y <= g + ht; y++) P(bx, y, bz, OAK_LOG);
  for (let y = g + 2; y <= g + ht + 1; y++) {
    const r = Math.max(0, Math.round((g + ht + 1 - y) * 0.42 + ((y - g) % 2 ? 0.6 : 0)));
    for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) {
      if (x * x + z * z > r * r + 0.6) continue;
      if (x === 0 && z === 0 && y <= g + ht) continue;
      const top = (y - g) % 2 === 1;
      P(bx + x, y, bz + z, top && x * x + z * z >= (r - 1) * (r - 1) ? SNOW : GREEN);
    }
  }
  P(bx, g + ht + 2, bz, SNOW);
}
spruce(-12, 10, 10);
spruce(-6, 13, 7);
spruce(12, 12, 10);
spruce(16, 5, 6);

// ---------------- MARKER STAKES on the drift ----------------
function stake(x, z) {
  const g = surfH(x, z);
  for (let i = 1; i <= 5; i++) P(x, g + i, z, i % 2 ? ORANGE : BLACK);
  P(x, g + 6, z, NEON_RED);
}
stake(Math.round(crestX(-7)) - 1, -7);
stake(Math.round(crestX(11)) - 1, 11);

for (const [k, id] of OUT) { const [x, y, z] = k.split(',').map(Number); block(x, y, z, id); }