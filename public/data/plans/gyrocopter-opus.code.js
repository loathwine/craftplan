// gyrocopter-opus — prompt:
// a steampunk gyrocopter...

const D2R = Math.PI / 180;
const P = new Map();
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  P.set(x + ',' + y + ',' + z, [x, y, z, id]);
}
function lineP(x1, y1, z1, x2, y2, z2, id) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= n; i++) { const t = i / n; put(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, id); }
}
function boxP(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) put(x, y, z, id);
}
function diskXY(cx, cy, z, r, id) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) if (dx * dx + dy * dy <= r * r) put(cx + dx, cy + dy, z, id);
}
function diskXZ(cx, y, cz, r, id) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) if (dx * dx + dz * dz <= r * r) put(cx + dx, y, cz + dz, id);
}

// ---------- site clearing: central viewing lane + build corridor ----------
cube(-8, 2, -22, 8, 10, 22, AIR);
cube(-13, 2, -15, 13, 10, 22, AIR);
const LOGS = [[1,-1,-7,1,1,-7],[4,-1,-3,4,1,-3],[12,-1,11,12,0,11],[14,-1,18,14,1,18],[8,0,-20,8,2,-20],[1,0,-13,1,2,-13],[-1,0,-10,-1,1,-10],[3,0,-10,3,2,-10],[-6,0,-8,-6,2,-8],[-7,0,-5,-7,2,-5],[7,0,-2,7,1,-2],[-6,0,-1,-6,2,-1],[8,0,-1,8,1,-1],[-6,0,1,-6,2,1],[0,0,1,0,1,1],[8,0,3,8,2,3],[-7,0,4,-7,2,5],[-2,0,7,-2,1,7],[-10,0,8,-10,2,8],[-7,0,8,-7,1,8],[-6,0,9,-6,1,9],[-5,0,13,-5,2,13],[-9,0,15,-9,1,15],[11,0,17,11,2,17],[12,0,20,12,1,20],[5,0,21,5,1,21],[0,1,-20,0,2,-20],[-10,1,-13,-10,2,-13],[-5,1,-12,-5,2,-12],[12,1,-12,12,3,-12],[-12,1,-7,-12,2,-7],[12,1,-5,12,2,-5],[-12,1,-3,-12,2,-3],[-11,1,-2,-11,2,-2],[-10,1,3,-10,2,3],[-8,1,18,-8,2,18],[-10,1,20,-9,2,20],[-7,1,21,-7,2,21],[-6,2,-20,-6,4,-20],[-10,1,-16,-10,3,-16]];
for (const [x1, y1, z1, x2, y2, z2] of LOGS) {
  for (let x = x1; x <= x2; x++) for (let z = z1; z <= z2; z++) {
    if (!(Math.abs(x) <= 8 || (Math.abs(x) <= 13 && z >= -15))) continue;
    for (let y = y1; y <= y2; y++) block(x, y, z, AIR);
  }
}

// ---------- HULL: riveted copper ellipsoid, iron belly, brass bands ----------
const HY = 12, HZ = -2;
function ell(x, y, z, a, b, c) { const u = x / a, v = (y - HY) / b, w = (z - HZ) / c; return u * u + v * v + w * w; }
for (let x = -6; x <= 6; x++) for (let y = 7; y <= 17; y++) for (let z = -12; z <= 8; z++) {
  if (ell(x, y, z, 5.3, 4.3, 9.3) > 1) continue;
  if (ell(x, y, z, 4.1, 3.1, 8.1) <= 1) continue;
  const inCock = z >= -8 && z <= -2 && Math.abs(x) <= 3;
  if (inCock && y >= 15) continue;
  let id = y <= 9 ? IRON : COPPER;
  if (z === -8 || z === -4 || z === 0 || z === 4) id = GOLD;
  if (inCock && y === 14) id = GOLD;
  if (id === COPPER && ((x * 7 + y * 13 + z * 5) % 11 + 11) % 11 === 0) id = GOLD;
  put(x, y, z, id);
}
// cockpit floor + seat
for (let z = -7; z <= -2; z++) for (let x = -2; x <= 2; x++) put(x, 13, z, PLANKS);
put(0, 14, -3, OAK_LOG);

// nose collar + headlamp
diskXY(0, 12, -11, 2.2, GOLD);
diskXY(0, 12, -12, 1.5, GOLD);
put(0, 12, -12, GLOWSTONE);

// glowing portholes
for (const z of [-6, -2, 2]) {
  const xs = 5.3 * Math.sqrt(Math.max(0, 1 - ((z - HZ) / 9.3) ** 2));
  const px = Math.floor(xs);
  for (const s of [-1, 1]) {
    const X = s * px;
    put(X, 12, z, GLOWSTONE);
    put(X, 13, z, GOLD); put(X, 11, z, GOLD); put(X, 12, z - 1, GOLD); put(X, 12, z + 1, GOLD);
  }
}

// ---------- GLASS CANOPY with brass ribs ----------
for (let x = -3; x <= 3; x++) for (let y = 15; y <= 19; y++) for (let z = -9; z <= -4; z++) {
  const d = Math.hypot(x, y - 15, z + 5);
  if (d > 3.7 || d < 2.7) continue;
  put(x, y, z, (y === 15 || x === -2 || x === 2) ? GOLD : GLASS);
}

// ---------- PILOT: leather jacket, cap, goggles up, red scarf ----------
put(0, 14, -4, BROWN); put(0, 15, -4, BROWN);
put(0, 16, -4, SAND);
put(0, 17, -4, BROWN); put(0, 17, -3, BROWN);
put(0, 17, -5, GOLD);
put(-1, 15, -4, BROWN); put(1, 15, -4, BROWN);
put(-1, 15, -5, SAND); put(1, 15, -5, SAND);
put(-1, 14, -6, GOLD); put(1, 14, -6, GOLD); put(-1, 15, -6, BLACK); put(1, 15, -6, BLACK);
put(0, 15, -3, RED); put(-1, 15, -3, RED); put(-1, 16, -2, RED); put(-2, 16, -2, RED); put(-2, 17, -1, RED);

// ---------- ROTOR MAST, gear, A-frame struts ----------
for (let y = 16; y <= 25; y++) { put(0, y, 0, IRON); put(1, y, 0, IRON); put(-1, y, 0, IRON); put(0, y, 1, IRON); put(0, y, -1, IRON); }
diskXZ(0, 16, 0, 1.5, GOLD);
diskXZ(0, 21, 0, 2.1, GOLD);
for (const [dx, dz] of [[3,0],[-3,0],[0,3],[0,-3],[2,2],[-2,2],[2,-2],[-2,-2]]) put(dx, 21, dz, GOLD);
put(0, 21, 0, OBSIDIAN);
lineP(-3, 15, -1, 0, 24, 0, IRON);
lineP(3, 15, -1, 0, 24, 0, IRON);
lineP(0, 18, 4, 0, 24, 1, IRON);

// ---------- MAIN ROTOR (4 wooden blades, brass ribs + tips, droop) ----------
for (const deg of [15, 105, 195, 285]) {
  const a = deg * D2R, c = Math.cos(a), s = Math.sin(a);
  for (let t = 2.5; t <= 20.5; t += 0.25) {
    for (const w of [-1, -0.5, 0, 0.5, 1]) {
      if (t > 17 && Math.abs(w) > 0.5) continue;
      const x = c * t - s * w, z = s * t + c * w;
      const y = 26 - (t > 13 ? 1 : 0);
      let id = Math.abs(w) === 1 ? BROWN : PLANKS;
      if (Math.abs(t - Math.round(t / 5) * 5) < 0.13) id = COPPER;
      if (t >= 18.5) id = GOLD;
      put(x, y, z, id);
    }
  }
}
diskXZ(0, 26, 0, 2.2, GOLD);
diskXZ(0, 27, 0, 1.2, COPPER);
put(0, 28, 0, GOLD); put(0, 29, 0, GOLD);

// ---------- BOILER (black iron, copper bands, brass caps) ----------
for (let z = 3; z <= 9; z++) for (let x = -4; x <= 4; x++) for (let y = 11; y <= 19; y++) {
  const r = Math.hypot(x, y - 15);
  if (r > 3.4) continue;
  const cap = (z === 3 || z === 9);
  if (!cap && r < 2.4) continue;
  let id = OBSIDIAN;
  if (z === 5 || z === 7) id = COPPER;
  if (cap) id = r < 1.2 ? GOLD : COPPER;
  put(x, y, z, id);
}
// pressure gauges on front cap
for (const s of [-2, 2]) {
  put(s, 17, 2, WHITE);
  put(s, 18, 2, GOLD); put(s - 1, 17, 2, GOLD); put(s + 1, 17, 2, GOLD);
}
// smokestacks
for (const s of [-2, 2]) {
  for (let y = 17; y <= 21; y++) {
    const id = y === 19 ? COPPER : OBSIDIAN;
    put(s, y, 6, id); put(s + 1, y, 6, id); put(s - 1, y, 6, id); put(s, y, 5, id); put(s, y, 7, id);
  }
  diskXZ(s, 22, 6, 1.5, GOLD);
  put(s, 22, 6, OBSIDIAN);
  put(s, 23, 6, STEAM);
}
// steam whistles
for (let y = 18; y <= 20; y++) put(-1, y, 8, GOLD);
for (let y = 18; y <= 21; y++) put(0, y, 8, GOLD);
for (let y = 18; y <= 19; y++) put(1, y, 8, GOLD);
put(0, 22, 8, STEAM);
// pistons + flywheels
for (const s of [-1, 1]) {
  const X = s * 4;
  boxP(X, 12, 3, X, 14, 4, COPPER);
  put(X, 15, 3, STEAM);
  put(X, 13, 5, IRON); put(X, 13, 6, IRON);
  for (let dy = -2; dy <= 2; dy++) for (let dz = -2; dz <= 2; dz++) {
    const r = Math.hypot(dy, dz);
    if (r > 2.3) continue;
    let id = r >= 1.5 ? GOLD : (dy === 0 || dz === 0 ? IRON : AIR);
    if (r < 0.5) id = COPPER;
    if (id !== AIR) put(X, 14 + dy, 7 + dz, id);
  }
}

// ---------- PUSHER PROP + DUCT RING ----------
put(0, 15, 10, IRON);
for (const deg of [45, 135, 225, 315]) {
  const a = deg * D2R, c = Math.cos(a), s = Math.sin(a);
  for (let t = 1.5; t <= 7; t += 0.25) for (const w of [-0.6, 0, 0.6]) {
    put(c * t - s * w, 15 + s * t + c * w, 11, t >= 6 ? GOLD : (Math.abs(w) > 0.5 ? BROWN : PLANKS));
  }
}
diskXY(0, 15, 11, 1.2, GOLD);
put(0, 15, 12, GOLD); put(0, 15, 13, COPPER);
for (let x = -9; x <= 9; x++) for (let y = 6; y <= 24; y++) {
  const r = Math.hypot(x, y - 15);
  if (r >= 7.6 && r < 8.6) { put(x, y, 11, COPPER); put(x, y, 12, COPPER); }
}
lineP(1, 15, 12, 7, 15, 12, IRON);
lineP(-1, 15, 12, -7, 15, 12, IRON);
lineP(0, 16, 12, 0, 22, 12, IRON);
lineP(0, 14, 12, 0, 8, 12, IRON);

// ---------- TAIL BOOM + EMPENNAGE ----------
lineP(0, 10, 4, 0, 8, 20, COPPER);
lineP(0, 9, 4, 0, 7, 20, IRON);
for (let x = -6; x <= 6; x++) for (let z = 18; z <= 21; z++) {
  if (Math.abs(x) >= 4 && z < 19) continue;
  const lead = z === 18 || (Math.abs(x) >= 4 && z === 19);
  put(x, 7, z, lead ? GOLD : COPPER);
}
for (const s of [-1, 1]) {
  for (let y = 4; y <= 11; y++) {
    const zmin = 18 + Math.max(0, y - 8) + (y < 5 ? 1 : 0);
    for (let z = zmin; z <= 21; z++) {
      const border = y === 4 || y === 11 || z === zmin;
      put(s * 6, y, z, border ? GOLD : RED);
    }
  }
}
for (let y = 9; y <= 13; y++) {
  const zmin = 17 + (y - 9);
  for (let z = zmin; z <= 21; z++) put(0, y, z, z === zmin ? GOLD : BROWN);
}

// ---------- STUB WINGS + ENGINE PODS with tractor props ----------
for (const s of [-1, 1]) {
  for (let ax = 4; ax <= 8; ax++) for (let z = -2; z <= 1; z++) put(s * ax, 10, z, z === -2 ? GOLD : COPPER);
  const PX = s * 10;
  for (let z = -3; z <= 3; z++) for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
    if (dx * dx + dy * dy > 4.84) continue;
    let id = COPPER;
    if (z === 0 || z === -3) id = GOLD;
    if (z === 3) id = OBSIDIAN;
    put(PX + dx, 10 + dy, z, id);
  }
  put(PX, 10, -4, GOLD); put(PX, 10, -5, GOLD);
  for (const deg of [20, 140, 260]) {
    const a = (deg + (s > 0 ? 0 : 40)) * D2R, c = Math.cos(a), sn = Math.sin(a);
    for (let t = 1; t <= 3.6; t += 0.25) for (const w of [-0.4, 0.4]) {
      put(PX + c * t - sn * w, 10 + sn * t + c * w, -4, t >= 3 ? GOLD : PLANKS);
    }
  }
  put(PX, 10, 4, STEAM);
  lineP(s * 3, 14, 1, s * 8, 11, 0, COPPER);
}

// ---------- LANDING GEAR ----------
for (const s of [-1, 1]) {
  lineP(s * 2, 9, -3, s * 3, 5, -3, IRON);
  lineP(s * 2, 9, 0, s * 3, 5, -3, IRON);
  for (let dy = -2; dy <= 2; dy++) for (let dz = -2; dz <= 2; dz++) {
    const r = Math.hypot(dy, dz);
    if (r > 2.1) continue;
    put(s * 4, 5 + dy, -3 + dz, r < 0.5 ? GOLD : (r < 1.2 ? IRON : BLACK));
  }
}
lineP(0, 9, -8, 0, 6, -8, IRON);
put(-1, 5, -8, IRON); put(1, 5, -8, IRON); put(-1, 4, -8, IRON); put(1, 4, -8, IRON);
put(0, 4, -8, GOLD); put(0, 5, -8, BLACK); put(0, 3, -8, BLACK); put(0, 4, -9, BLACK); put(0, 4, -7, BLACK);

// ---------- DANGLING CARGO CRATE ----------
for (let y = 5; y <= 7; y++) { put(-1, y, 1, BROWN); put(1, y, 1, BROWN); }
for (let x = -1; x <= 1; x++) for (let y = 2; y <= 4; y++) for (let z = 0; z <= 2; z++) {
  const edges = (x !== 0 ? 1 : 0) + (y !== 3 ? 1 : 0) + (z !== 1 ? 1 : 0);
  put(x, y, z, edges >= 2 ? OAK_LOG : PLANKS);
}

// ---------- LANDING PAD with compass rose ----------
for (let x = -9; x <= 9; x++) for (let z = -9; z <= 9; z++) {
  const r = Math.hypot(x, z);
  if (r > 8.4) continue;
  let id = PLANKS;
  if (r > 7.4) id = (x === 0 || z === 0) ? GOLD : BRICK;
  else if (r < 1.6) id = GOLD;
  else if (r >= 3.5 && r < 4.5) id = COPPER;
  else if (x === 0 || z === 0) id = IRON;
  else if (Math.abs(x) === Math.abs(z)) id = BROWN;
  put(x, 0, z, id);
  if (r > 6.4) { put(x, -1, z, COBBLE); put(x, -2, z, COBBLE); }
}
// steam vents in the pad
for (const s of [-3, 3]) { put(s, 0, 4, IRON); put(s, 1, 4, STEAM); }
// brazier lamps
for (const [lx, lz] of [[-5, -6], [5, -6], [-5, 6], [5, 6]]) {
  for (let y = 1; y <= 3; y++) put(lx, y, lz, OBSIDIAN);
  put(lx, 4, lz, GOLD); put(lx + 1, 4, lz, GOLD); put(lx - 1, 4, lz, GOLD); put(lx, 4, lz + 1, GOLD); put(lx, 4, lz - 1, GOLD);
  put(lx, 5, lz, FIRE);
}
// mechanic waving at the camera, wrench in hand
put(-3, 1, -7, BROWN); put(-3, 2, -7, BLUE); put(-3, 3, -7, SAND);
put(-3, 4, -7, BLACK); put(-3, 5, -7, BLACK); put(-3, 4, -8, GOLD);
put(-4, 2, -7, BLUE); put(-4, 3, -7, BLUE); put(-4, 4, -7, SAND);
put(-2, 2, -7, BLUE); put(-2, 1, -7, IRON); put(-2, 1, -8, IRON);
// barrels
for (const [dx, dz] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]) { put(6 + dx, 1, 1 + dz, IRON); put(6 + dx, 2, 1 + dz, BROWN); }
put(5, 1, 3, BROWN); put(5, 2, 3, BROWN);
// crates + coal
boxP(-7, 1, 0, -6, 2, 1, PLANKS);
put(-6, 3, 1, OAK_LOG);
put(-6, 1, 3, BLACK); put(-5, 1, 3, BLACK); put(-6, 1, 4, BLACK); put(-6, 2, 3, BLACK);

// ---------- WINDSOCK ----------
lineP(9, 0, -9, 9, 9, -9, IRON);
put(9, 10, -9, GOLD);
const plus = [[0,0],[1,0],[-1,0],[0,1],[0,-1]];
for (const [dy, dz] of plus) { put(10, 9 + dy, -9 + dz, ORANGE); put(11, 9 + dy, -9 + dz, WHITE); put(12, 9 + dy, -9 + dz, ORANGE); }
put(13, 9, -9, WHITE); put(14, 8, -9, ORANGE);

// ---------- MOORING TOWER (background left) + tether ----------
for (const [tx, tz] of [[-12, 14], [-10, 14], [-12, 16], [-10, 16]]) lineP(tx, -1, tz, tx, 17, tz, IRON);
for (let y0 = 0; y0 <= 14; y0 += 4) {
  lineP(-12, y0, 14, -10, y0 + 2, 14, COPPER); lineP(-10, y0 + 2, 14, -12, y0 + 4, 14, COPPER);
  lineP(-12, y0, 16, -10, y0 + 2, 16, COPPER); lineP(-10, y0 + 2, 16, -12, y0 + 4, 16, COPPER);
  lineP(-12, y0, 14, -12, y0 + 2, 16, COPPER); lineP(-10, y0, 16, -10, y0 + 2, 14, COPPER);
}
boxP(-13, 18, 13, -9, 18, 17, PLANKS);
for (let x = -13; x <= -9; x++) for (let z = 13; z <= 17; z++) {
  if ((x === -13 || x === -9 || z === 13 || z === 17) && (x + z) % 2 === 0) put(x, 19, z, GOLD);
}
put(-11, 19, 15, GLOWSTONE); put(-11, 20, 15, GOLD);
lineP(-10, 17, 16, -6, 11, 19, BROWN);

// ---------- flush ----------
for (const [x, y, z, id] of P.values()) block(x, y, z, id);