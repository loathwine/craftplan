// hockey-player-fable — prompt:
// an ice hockey player taking a slapshot...

// Ice hockey player winding up for a slapshot: Tre Kronor colours, rink, goal + goalie.
// Authored in "design" coords and mirrored in X so the shooter is right-handed,
// chest opened toward the north-east (camera/light side), shooting west at the goal.
const FX = -1;
const V = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function putW(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  V.set(K(x, y, z), [x, y, z, id]);
}
function put(x, y, z, id) { putW(FX * x, y, z, id); }
function getW(x, y, z) { const v = V.get(K(x, y, z)); return v ? v[3] : undefined; }

// ---------- vector helpers ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.sqrt(dot(a, a));
const nrm = (a) => mul(a, 1 / (len(a) || 1));
const lerp = (a, b, t) => add(a, mul(sub(b, a), t));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = (c, ...args) => (typeof c === 'function' ? c(...args) : c);
function hash(x, z) {
  let h = (x * 374761393 + z * 668265263) | 0;
  h = Math.imul(h ^ (h >> 13), 1274126177);
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

// ---------- shape primitives (design coords) ----------
function capsule(a, b, ra, rb, col) {
  const R = Math.max(ra, rb) + 1;
  const ab = sub(b, a), L2 = dot(ab, ab) || 1;
  for (let x = Math.floor(Math.min(a[0], b[0]) - R); x <= Math.ceil(Math.max(a[0], b[0]) + R); x++)
    for (let y = Math.floor(Math.min(a[1], b[1]) - R); y <= Math.ceil(Math.max(a[1], b[1]) + R); y++)
      for (let z = Math.floor(Math.min(a[2], b[2]) - R); z <= Math.ceil(Math.max(a[2], b[2]) + R); z++) {
        const p = [x, y, z];
        const t = clamp(dot(sub(p, a), ab) / L2, 0, 1);
        const d = len(sub(p, add(a, mul(ab, t))));
        if (d <= ra + (rb - ra) * t) put(x, y, z, pick(col, t, x, y, z));
      }
}
function ellipsoid(c, rx, ry, rz, col) {
  for (let x = Math.floor(c[0] - rx); x <= Math.ceil(c[0] + rx); x++)
    for (let y = Math.floor(c[1] - ry); y <= Math.ceil(c[1] + ry); y++)
      for (let z = Math.floor(c[2] - rz); z <= Math.ceil(c[2] + rz); z++) {
        const e = ((x - c[0]) / rx) ** 2 + ((y - c[1]) / ry) ** 2 + ((z - c[2]) / rz) ** 2;
        if (e <= 1) put(x, y, z, pick(col, x - c[0], y - c[1], z - c[2]));
      }
}
// bone with an elliptical cross-section whose "side" axis twists from sA to sB
function ebone(a, b, sA, sB, ruA, ruB, rwA, rwB, col) {
  const ab = sub(b, a), L = len(ab), ax = mul(ab, 1 / L);
  const R = Math.max(ruA, ruB, rwA, rwB) + 1;
  for (let x = Math.floor(Math.min(a[0], b[0]) - R); x <= Math.ceil(Math.max(a[0], b[0]) + R); x++)
    for (let y = Math.floor(Math.min(a[1], b[1]) - R); y <= Math.ceil(Math.max(a[1], b[1]) + R); y++)
      for (let z = Math.floor(Math.min(a[2], b[2]) - R); z <= Math.ceil(Math.max(a[2], b[2]) + R); z++) {
        const rel = sub([x, y, z], a);
        const h = dot(rel, ax), t = h / L, tc = clamp(t, 0, 1);
        let s = nrm(lerp(sA, sB, tc));
        s = nrm(sub(s, mul(ax, dot(s, ax))));
        const w = cross(ax, s);
        const u = dot(rel, s), v = dot(rel, w);
        const ru = ruA + (ruB - ruA) * tc, rw = rwA + (rwB - rwA) * tc;
        let e = (u / ru) ** 2 + (v / rw) ** 2;
        const over = t < 0 ? -h : t > 1 ? h - L : 0;
        if (over > 0) e += (over / (Math.min(ru, rw) * 0.8)) ** 2;
        if (e <= 1) put(x, y, z, pick(col, tc, u, v, x, y, z));
      }
}
function seg(a, b, col) {
  const n = Math.ceil(len(sub(b, a)) * 4);
  for (let i = 0; i <= n; i++) { const p = lerp(a, b, i / n); put(p[0], p[1], p[2], col); }
}
function box(x1, y1, z1, x2, y2, z2, col) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, pick(col, x, y, z));
}
// paint the first existing voxel met along Z at world (x,y); dir=+1 scans from the north (front)
function paintZ(x, y, dir, id) {
  for (let i = 0; i <= 44; i++) {
    const z = dir > 0 ? -22 + i : 22 - i;
    if (V.has(K(x, y, z))) { V.set(K(x, y, z), [x, y, z, id]); return; }
  }
}

// =====================================================================
// RINK
// =====================================================================
const inRink = (x, z) => (Math.abs(x) / 21.5) ** 4 + (Math.abs(z + 1) / 11.5) ** 4 <= 1;
const isEdge = (x, z) => inRink(x, z) && !(inRink(x + 1, z) && inRink(x - 1, z) && inRink(x, z + 1) && inRink(x, z - 1));
const nearRink = (x, z, r) => {
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (inRink(x + dx, z + dz)) return true;
  return false;
};
const GOALX = 17, GOALZ = -1;          // goal line / goal centre (design coords)
const CIRC = [1, -2], CIRC_R = 7;       // face-off circle the shooter stands in

for (let x = -22; x <= 22; x++)
  for (let z = -22; z <= 22; z++) {
    if (!inRink(x, z)) continue;
    let id = hash(x, z) < 0.1 ? SNOW : MARBLE;              // scuffed patches on polished ice
    const dc = Math.hypot(x - CIRC[0], z - CIRC[1]);
    if (Math.abs(dc - CIRC_R) <= 0.5 || dc <= 1.1) id = RED; // face-off circle + dot
    if ((x === CIRC[0] - 2 || x === CIRC[0] + 2) && Math.abs(Math.abs(z - CIRC[1]) - 8.5) <= 1) id = RED; // hash marks
    if (x === -14 || x === -13) id = BLUE;                  // blue line
    const dg = Math.hypot(x - GOALX, z - GOALZ);
    if (x < GOALX && dg <= 5.5) id = dg > 4.5 ? RED : LIGHT_BLUE; // crease
    if (x === GOALX) id = RED;                              // goal line
    put(x, 0, z, id);
    if (isEdge(x, z)) put(x, -1, z, SNOW);                  // skirt so the sheet never floats
  }

// shovelled snowbank around the open (north) side of the pond
for (let x = -22; x <= 22; x++)
  for (let z = -22; z <= 22; z++) {
    if (inRink(x, z) || z >= -7 || !nearRink(x, z, 2)) continue;
    putW(x, 0, z, SNOW);
    if (!nearRink(x, z, 1) && hash(x + 91, z - 37) < 0.22) putW(x, 1, z, SNOW);
  }

// boards around the back and ends, glass along the back
const ADS = [BLUE, RED, GREEN, ORANGE, CYAN, PURPLE];
for (let x = -22; x <= 22; x++)
  for (let z = -22; z <= 22; z++) {
    if (!isEdge(x, z) || z < -7) continue;
    put(x, 1, z, YELLOW);
    put(x, 2, z, WHITE);
    put(x, 3, z, RED);
    if (z >= 7) {
      const post = ((x % 6) + 6) % 6 === 0;
      put(x, 4, z, post ? IRON : GLASS);
      put(x, 5, z, post ? IRON : GLASS);
      const a = (x + 22) % 6;
      if (a === 2 || a === 3) put(x, 2, z, ADS[Math.floor((x + 22) / 6) % ADS.length]); // sponsor panels
    }
  }

// floodlight masts at the back corners
for (const sx of [-1, 1]) {
  const lx = 19 * sx, lz = 12;
  for (let y = -1; y <= 17; y++) putW(lx, y, lz, IRON);
  for (let dx = -1; dx <= 1; dx++) {
    putW(lx + dx, 18, lz, GRAY); putW(lx + dx, 19, lz, GRAY);
    putW(lx + dx, 18, lz - 1, GLOWSTONE); putW(lx + dx, 19, lz - 1, GLOWSTONE);
  }
  putW(lx - sx, 17, lz, IRON); putW(lx + sx, 17, lz, IRON);
}

// =====================================================================
// GOAL (design +X end) with checkered net
// =====================================================================
{
  const z1 = GOALZ - 6, z2 = GOALZ + 6;
  const backX = (y) => (y >= 6 ? GOALX + 2 : GOALX + 3);
  for (let y = 1; y <= 9; y++) { put(GOALX, y, z1, RED); put(GOALX, y, z2, RED); }
  for (let z = z1; z <= z2; z++) { put(GOALX, 9, z, RED); put(GOALX + 2, 9, z, RED); put(GOALX + 3, 1, z, RED); }
  for (const z of [z1, z2]) {
    for (let x = GOALX; x <= GOALX + 3; x++) put(x, 1, z, RED);
    for (let x = GOALX; x <= GOALX + 2; x++) put(x, 9, z, RED);
    for (let y = 2; y <= 8; y++)
      for (let x = GOALX + 1; x <= backX(y); x++) if ((x + y) % 2 === 0 || x === backX(y)) put(x, y, z, WHITE);
  }
  for (let z = z1 + 1; z <= z2 - 1; z++) {
    for (let y = 2; y <= 8; y++) if ((z + y) % 2 === 0) put(backX(y), y, z, WHITE);
    if (z % 2 === 0) put(GOALX + 1, 9, z, WHITE);
  }
  // water bottle on top of the net
  put(GOALX + 1, 10, GOALZ + 3, WHITE); put(GOALX + 1, 11, GOALZ + 3, LIME);
}

// =====================================================================
// GOALIE in the crease, squared up to the shooter
// =====================================================================
{
  const gx = GOALX - 3, gz = GOALZ;
  for (const z0 of [gz - 3, gz + 1]) {                    // leg pads
    box(gx - 1, 1, z0, gx, 4, z0 + 1, (x, y) => (y === 3 ? RED : WHITE));
    box(gx - 2, 1, z0, gx - 2, 1, z0 + 1, WHITE);
    put(gx - 3, 1, z0, BLACK);                            // skate toe
  }
  box(gx, 5, gz - 3, gx + 1, 5, gz + 2, BLACK);           // pants
  box(gx - 1, 6, gz - 3, gx + 1, 8, gz + 2, (x, y) => (y === 7 ? WHITE : RED)); // chest
  box(gx - 1, 7, gz - 1, gx - 1, 7, gz, RED);             // crest on the white band
  box(gx - 1, 7, gz + 3, gx, 8, gz + 3, RED);             // catcher arm
  box(gx - 2, 8, gz + 3, gx - 1, 10, gz + 4, BROWN);      // catching glove up
  box(gx - 1, 6, gz - 4, gx, 7, gz - 4, RED);             // blocker arm
  box(gx - 2, 5, gz - 5, gx - 2, 7, gz - 4, WHITE);       // blocker
  box(gx - 1, 9, gz - 1, gx + 1, 11, gz, (x, y) => (y === 11 ? RED : WHITE)); // mask
  put(gx - 1, 10, gz - 1, BLACK); put(gx - 1, 10, gz, BLACK);                 // cage
  seg([gx - 3, 6, gz - 5], [gx - 3, 2, gz - 3], PLANKS);  // goalie stick
  box(gx - 3, 1, gz - 3, gx - 3, 1, gz, PLANKS);
  box(gx - 3, 2, gz - 3, gx - 3, 2, gz - 2, PLANKS);
}

// =====================================================================
// THE SHOOTER
// =====================================================================
// skeleton (design coords: faces north/-Z, backswing toward -X, target +X)
const hipL = [-2.7, 14.5, 1], hipR = [2.7, 14.5, 1];
const kneeL = [-6, 8.6, -2.2], kneeR = [6.5, 8.6, -3];
const ankL = [-7, 4, 1], ankR = [7, 4, 0];
const pelvis = [0, 15, 1], neck = [0, 23.5, -3];
const sideHip = [1, 0, 0], sideSh = nrm([0.93, 0, -0.36]);   // shoulders coiled into the backswing
const shR = add(neck, mul(sideSh, 5.6)), shL = add(neck, mul(sideSh, -5.6));
const headC = [0, 28, -5];
const RH = [-1, 16, -7];                                       // top hand (butt of the stick)
const sdir = nrm([-9, 8.5, 3]);
const LH = add(RH, mul(sdir, 12));                             // lower hand up the shaft
const HEEL = add(RH, mul(sdir, 18));
const BUTT = add(RH, mul(sdir, -1.6));
const elbR = [5.4, 17.3, -7.6], elbL = [-10, 19.8, -0.2];

// pants
ellipsoid([0, 14.3, 1], 5.4, 3.2, 3.6, BLUE);
capsule(hipL, lerp(hipL, kneeL, 0.9), 3.0, 2.6, (t) => (t > 0.86 ? YELLOW : BLUE));
capsule(hipR, lerp(hipR, kneeR, 0.9), 3.0, 2.6, (t) => (t > 0.86 ? YELLOW : BLUE));
// shin pads / socks with a blue hoop
const sock = (t) => (t > 0.34 && t < 0.66 ? BLUE : YELLOW);
capsule(kneeL, ankL, 2.3, 1.8, sock);
capsule(kneeR, ankR, 2.3, 1.8, sock);
// skates
for (const a of [ankL, ankR]) {
  const ax = a[0], az = a[2];
  box(ax - 1, 2, az - 3, ax + 1, 3, az + 1, BLACK);
  box(ax - 1, 4, az - 1, ax + 1, 4, az + 1, BLACK);
  box(ax, 1, az - 4, ax, 1, az + 2, IRON);                      // steel
  put(ax, 2, az - 4, WHITE);                                    // toe cap
  put(ax, 3, az - 2, WHITE); put(ax, 4, az - 2, WHITE); put(ax, 3, az - 3, WHITE); // laces / tongue
}

// jersey
const jersey = (t) => (t > 0.07 && t < 0.2 ? BLUE : YELLOW);  // blue hem stripe
ebone(pelvis, neck, sideHip, sideSh, 4.7, 5.9, 3.4, 3.7, jersey);
capsule([0, 24.6, -3.4], [0, 25.6, -4], 2.0, 1.9, SAND);      // neck

// Tre Kronor: three crowns on the chest (front = north)
for (const [x, y] of [[-3, 21], [-2, 21], [-3, 22], [-2, 22], [2, 21], [3, 21], [2, 22], [3, 22], [-1, 19], [0, 19], [1, 19], [0, 20]]) paintZ(x, y, 1, BLUE);
// number 21 on the back (read from the south)
{
  const G2 = ['###', '..#', '###', '#..', '###'], G1 = ['.#.', '##.', '.#.', '.#.', '###'];
  const draw = (g, x0) => g.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') paintZ(x0 + c, 23 - r, -1, BLUE); }));
  draw(G2, -3); draw(G1, 1);
}

// head: helmet, face, eyes
ellipsoid(headC, 3.35, 3.35, 3.35, (dx, dy, dz) => {
  const skin = (dy <= 0 && dz <= -2) || (dy <= -1 && dz <= -1) || dy <= -3;
  if (skin) return SAND;
  if (dx === 0 && dy >= 1) return YELLOW;     // helmet stripe
  return BLUE;
});
paintZ(-1, 28, 1, BLACK); paintZ(1, 28, 1, BLACK);       // eyes locked on the puck
put(-3, 27, -5, WHITE); put(3, 27, -5, WHITE);           // ear guards

// shoulder pads (blue yoke on top)
for (const s of [shL, shR]) ellipsoid([s[0], s[1] + 0.2, s[2]], 2.9, 2.7, 2.9, (dx, dy) => (dy >= 0.3 ? BLUE : YELLOW));

// arms
const sleeve = (t) => (t > 0.3 && t < 0.62 ? BLUE : YELLOW);
capsule(shR, elbR, 2.1, 1.9, YELLOW);
capsule(elbR, RH, 2.0, 1.7, sleeve);
capsule(shL, elbL, 2.1, 1.9, YELLOW);
capsule(elbL, LH, 2.0, 1.7, sleeve);

// stick: red shaft, white tape knob, taped blade cocked high over the back shoulder
seg(BUTT, HEEL, RED);
put(BUTT[0], BUTT[1], BUTT[2], WHITE);
for (let i = 0; i <= 5; i++) {
  const bx = HEEL[0] - 0.35 * i, by = HEEL[1] + i, bz = HEEL[2];
  put(bx, by, bz, i === 0 ? RED : WHITE);
  if (i >= 1) put(bx - 1, by, bz, i === 5 ? BLACK : WHITE);
}

// gloves (placed last so they wrap the shaft)
const glove = (dx, dy) => (Math.abs(dy) < 0.6 ? YELLOW : BLUE);
ellipsoid(RH, 2.2, 2.2, 2.2, glove);
ellipsoid(LH, 2.2, 2.2, 2.2, glove);

// pucks: the one about to be hammered, plus a few strays from practice
box(3, 1, -10, 4, 1, -9, OBSIDIAN);
for (const [px, pz] of [[-4, -10], [-8, -8], [-11, -10], [10, 6], [-17, 2]]) put(px, 1, pz, OBSIDIAN);
// snow shaved up by the back skate digging in
for (const [sx, sy, sz] of [[-9, 1, 2], [-10, 1, 3], [-9, 1, 4], [-10, 1, 1], [-11, 1, 2], [-10, 2, 2], [-8, 1, 4]]) put(sx, sy, sz, SNOW);

// =====================================================================
// EMIT
// =====================================================================
// 1) clear trees over the rink, its snowbank, the masts and a viewing apron to the north
for (let x = -22; x <= 22; x++)
  for (let z = -22; z <= 22; z++) {
    const apron = z < -1 && Math.abs(x) <= 16 && !inRink(x, z);
    const mast = Math.abs(Math.abs(x) - 19) <= 2 && z >= 10 && z <= 13;
    if (!(nearRink(x, z, 2) || apron || mast)) continue;
    let y0 = null;
    for (let y = 1; y <= 10; y++) {
      const free = y <= 9 && !V.has(K(x, y, z));
      if (free && y0 === null) y0 = y;
      if (!free && y0 !== null) { cube(x, y0, z, x, y - 1, z, AIR); y0 = null; }
    }
  }

// 2) solids: skip fully buried voxels (never visible), keep a hard safety margin on the budget
const opaque = (id) => id !== undefined && id !== GLASS;
let out = [];
for (const v of V.values()) {
  const x = v[0], y = v[1], z = v[2];
  if (opaque(getW(x + 1, y, z)) && opaque(getW(x - 1, y, z)) && opaque(getW(x, y + 1, z)) &&
      opaque(getW(x, y - 1, z)) && opaque(getW(x, y, z + 1)) && opaque(getW(x, y, z - 1))) continue;
  out.push(v);
}
const CAP = 3980;
for (const drop of [
  (v) => v[1] === -1 && v[3] === SNOW,
  (v) => v[3] === SNOW && !inRink(v[0], v[2]) && v[1] <= 1,
  (v) => v[3] === GLASS,
]) {
  if (out.length <= CAP) break;
  let excess = out.length - CAP;
  out = out.filter((v) => !(excess > 0 && drop(v) && excess--));
}
for (const v of out) block(v[0], v[1], v[2], v[3]);