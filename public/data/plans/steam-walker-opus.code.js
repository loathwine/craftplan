// steam-walker-opus — prompt:
// a steam-powered walking machine...

// ===== Steam-powered walking machine =====
// Clear the trees near the walker. AIR does not count against the block budget.
cube(-17, 1, -15, 17, 9, 17, AIR);

const M = new Map();
let solid = 0;
const LIMIT = 3960;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (!M.has(k)) { if (solid >= LIMIT) return; solid++; }
  M.set(k, id);
}
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function ball(cx, cy, cz, r, id) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++)
    if (dx * dx + dy * dy + dz * dz <= r * r) put(cx + dx, cy + dy, cz + dz, id);
}
function seg(a, b, w, id) {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * 2));
  const lo = -Math.floor((w - 1) / 2), hi = lo + w - 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const px = Math.round(a[0] + (b[0] - a[0]) * t);
    const py = Math.round(a[1] + (b[1] - a[1]) * t);
    const pz = Math.round(a[2] + (b[2] - a[2]) * t);
    for (let ox = lo; ox <= hi; ox++) for (let oy = lo; oy <= hi; oy++) for (let oz = lo; oz <= hi; oz++)
      put(px + ox, py + oy, pz + oz, id);
  }
}
function ringZ(cx, cy, z, rIn, rOut, id) {
  const R = Math.ceil(rOut);
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) {
    const d = Math.hypot(dx, dy);
    if (d <= rOut && d > rIn) put(cx + dx, cy + dy, z, id);
  }
}
function ringX(x, cy, cz, rIn, rOut, id) {
  const R = Math.ceil(rOut);
  for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) {
    const d = Math.hypot(dy, dz);
    if (d <= rOut && d > rIn) put(x, cy + dy, cz + dz, id);
  }
}

const BY = 17; // boiler axis height

// ---------- BOILER BODY (horizontal copper cylinder along Z) ----------
for (let z = -5; z <= 9; z++) ringZ(0, BY, z, 4.3, 5.5, COPPER);
for (const z of [-4, 0, 4, 8]) {
  ringZ(0, BY, z, 5.4, 6.3, GOLD);
  for (let k = 0; k < 12; k++) {
    const a = k * Math.PI / 6;
    put(Math.round(6.3 * Math.cos(a)), BY + Math.round(6.3 * Math.sin(a)), z, IRON);
  }
}
// End caps
ringZ(0, BY, -6, -1, 5.5, IRON);
ringZ(0, BY, -6, 4.6, 5.6, GOLD);
ringZ(0, BY, 10, -1, 5.5, IRON);
ringZ(0, BY, 10, 4.6, 5.6, GOLD);

// Side pipes + valve wheels
for (const s of [-1, 1]) {
  seg([s * 6, 19, -5], [s * 6, 19, 9], 1, COPPER);
  for (const z of [-5, 9]) put(s * 6, 19, z, GOLD);
  put(s * 7, 19, 1, GOLD); put(s * 7, 20, 1, GOLD); put(s * 7, 18, 1, GOLD);
  put(s * 7, 19, 0, GOLD); put(s * 7, 19, 2, GOLD); put(s * 8, 19, 1, BLACK);
  seg([s * 5, 14, -5], [s * 5, 14, 9], 1, IRON);
}

// ---------- CHASSIS + HIPS ----------
box(-5, 11, -5, 5, 11, 9, IRON);
box(-5, 10, -3, 5, 10, -3, BLACK);
box(-5, 10, 7, 5, 10, 7, BLACK);
for (const s of [-1, 1]) for (const hz of [-3, 7]) {
  box(s * 5, 11, hz - 2, s * 6, 14, hz + 2, IRON);
  // Hip gear: a vertical disk facing outward
  ringX(s * 7, 13, hz, -1, 3, COPPER);
  ringX(s * 7, 13, hz, -1, 1.2, GOLD);
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4;
    put(s * 7, 13 + Math.round(3.8 * Math.sin(a)), hz + Math.round(3.8 * Math.cos(a)), COPPER);
  }
  put(s * 7, 15, hz, BLACK); put(s * 7, 11, hz, BLACK);
  put(s * 7, 13, hz + 2, BLACK); put(s * 7, 13, hz - 2, BLACK);
  put(s * 8, 13, hz, GOLD); // axle
}

// ---------- LEGS ----------
const legs = [
  { s: -1, hz: -3, k: [-13, 18, -8], a: [-15, 6, -12], lift: true },
  { s: 1, hz: -3, k: [13, 17, -6], a: [15, 2, -9] },
  { s: -1, hz: 7, k: [-13, 17, 9], a: [-15, 2, 13] },
  { s: 1, hz: 7, k: [14, 16, 11], a: [16, 2, 15] },
];
for (const L of legs) {
  const h = [L.s * 9, 13, L.hz];
  const k = L.k, a = L.a;
  // Thigh
  seg(h, k, 2, IRON);
  seg([h[0], h[1] + 2, h[2]], [k[0], k[1] + 2, k[2]], 1, COPPER);
  // Shin + copper front guard
  seg(k, a, 2, IRON);
  seg([k[0], k[1], k[2] - 1], [a[0], a[1] + 1, a[2] - 1], 1, COPPER);
  // Hydraulic piston from the boiler top to the knee
  const P = [L.s * 5, 20, L.hz];
  const K2 = [k[0], k[1] + 2, k[2]];
  const Mid = [P[0] + (K2[0] - P[0]) * 0.55, P[1] + (K2[1] - P[1]) * 0.55, P[2] + (K2[2] - P[2]) * 0.55];
  seg(P, Mid, 2, COPPER);
  seg(Mid, K2, 1, GOLD);
  put(P[0], P[1], P[2], GOLD);
  // Knee joint
  ball(k[0], k[1], k[2], 1.8, GOLD);
  put(k[0] + L.s * 2, k[1], k[2], BLACK);
  put(k[0] + L.s, k[1] + 3, k[2], STEAM);
  // Ankle
  ball(a[0], a[1], a[2], 1.2, IRON);
  // Foot
  const py = a[1] - 2;
  for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) {
    const e = (dx / 2.6) ** 2 + (dz / 2.6) ** 2;
    if (e <= 1) put(a[0] + dx, py, a[2] + dz, BLACK);
    if ((dx / 1.8) ** 2 + (dz / 1.8) ** 2 <= 1) put(a[0] + dx, py + 1, a[2] + dz, IRON);
  }
  for (const t of [-2, 0, 2]) {
    if (L.lift) {
      put(a[0] + t, py - 1, a[2] - 3, BLACK);
      put(a[0] + t, py - 2, a[2] - 4, GOLD);
    } else {
      put(a[0] + t, py, a[2] - 3, BLACK);
      put(a[0] + t, py, a[2] - 4, GOLD);
    }
  }
  put(a[0], py, a[2] + 3, BLACK);
  put(a[0] + L.s * 3, py, a[2], BLACK);
  if (!L.lift) box(a[0] - 1, -3, a[2] - 1, a[0] + 1, -1, a[2] + 1, IRON);
}
// Dust/steam where the planted front foot hit the ground
put(18, 1, -10, STEAM);
put(12, 1, -8, STEAM);

// ---------- FACE (front cap, facing north) ----------
for (const s of [-1, 1]) {
  const x1 = s < 0 ? -4 : 1, x2 = s < 0 ? -1 : 4;
  for (let x = x1; x <= x2; x++) for (let y = 18; y <= 21; y++) {
    const edge = x === x1 || x === x2 || y === 18 || y === 21;
    put(x, y, -7, edge ? GOLD : GLOWSTONE);
  }
  // Angled brows
  seg([s * 5, 22, -8], [s * 1, 21, -8], 1, BLACK);
}
// Valve nose
put(0, 17, -7, GOLD); put(0, 17, -8, GOLD); put(0, 16, -7, IRON);
// Furnace mouth
box(-2, 13, -6, 2, 14, -6, LAVA);
for (let x = -3; x <= 3; x++) for (let y = 12; y <= 15; y++) {
  if (x === -3 || x === 3 || y === 12 || y === 15) put(x, y, -7, GOLD);
}
for (const x of [-1, 1]) { put(x, 13, -7, BLACK); put(x, 14, -7, BLACK); }
// Chin ram
box(-3, 10, -6, 3, 10, -6, IRON);
box(-2, 9, -7, 2, 9, -7, IRON);
box(-1, 8, -8, 1, 8, -8, GOLD);
// Chassis headlamps
for (const s of [-1, 1]) { put(s * 5, 11, -6, GLOWSTONE); put(s * 5, 12, -6, GOLD); put(s * 5, 10, -6, BLACK); }

// ---------- STEAM DOME + WHISTLE ----------
ball(0, 22, -4, 1.6, GOLD);
put(0, 24, -4, GOLD); put(0, 25, -4, IRON);
put(0, 26, -4, STEAM);

// ---------- SMOKESTACKS ----------
for (const st of [{ x: -2, top: 31 }, { x: 2, top: 28 }]) {
  const z0 = -1;
  for (let y = 20; y < st.top; y++) for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++)
    put(st.x + dx, y, z0 + dz, BLACK);
  const ring = (y, id) => {
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
      const m = Math.max(Math.abs(dx), Math.abs(dz));
      if (m === 2 && !(Math.abs(dx) === 2 && Math.abs(dz) === 2)) put(st.x + dx, y, z0 + dz, id);
    }
  };
  ring(24, GOLD);
  ring(st.top - 3, GOLD);
  ring(st.top - 1, BLACK);
  ring(st.top, BLACK);
  put(st.x, st.top, z0, STEAM);
  put(st.x, st.top + 1, z0 + 1, STEAM);
}

// ---------- PILOT CAB ----------
box(-4, 21, 2, -4, 21, 9, IRON);
box(4, 21, 2, 4, 21, 9, IRON);
box(-4, 22, 2, 4, 22, 9, PLANKS);
for (let x = -4; x <= 4; x++) for (let z = 2; z <= 9; z++) for (let y = 23; y <= 26; y++) {
  const onX = x === -4 || x === 4, onZ = z === 2 || z === 9;
  if (!onX && !onZ) continue;
  let id = BROWN;
  if (onX && onZ) id = OAK_LOG;
  else if (y === 24 || y === 25) {
    if (z === 2 && Math.abs(x) <= 2) id = GLASS;
    if (z === 9 && Math.abs(x) <= 1) id = GLASS;
    if (onX && z >= 4 && z <= 7) id = GLASS;
  } else if (y === 26) id = GOLD;
  put(x, y, z, id);
}
// Roof
box(-5, 27, 1, 5, 27, 10, BLACK);
box(-3, 28, 1, 3, 28, 10, BLACK);
box(-1, 29, 1, 1, 29, 10, BLACK);
box(0, 29, 1, 0, 29, 10, GOLD);
// Pilot + controls
put(0, 23, 5, BROWN); put(0, 24, 5, RED); put(0, 25, 5, SAND);
put(0, 26, 5, BLACK); put(0, 25, 4, GOLD);
put(-1, 23, 3, IRON); put(-1, 24, 3, GOLD);
put(1, 23, 3, IRON); put(1, 24, 3, RED);
put(-3, 25, 3, GLOWSTONE);

// ---------- REAR FLYWHEEL ----------
ringZ(0, 16, 11, 3.4, 4.5, GOLD);
for (let k = 0; k < 6; k++) {
  const a = k * Math.PI / 3;
  seg([0, 16, 11], [Math.round(3.4 * Math.cos(a)), 16 + Math.round(3.4 * Math.sin(a)), 11], 1, IRON);
}
put(0, 16, 11, COPPER); put(0, 16, 12, COPPER);
// Rear exhausts
for (const s of [-1, 1]) {
  seg([s * 3, 13, 10], [s * 4, 12, 13], 1, COPPER);
  put(s * 4, 12, 14, GOLD);
  put(s * 4, 12, 15, STEAM);
}

// ---------- HANGING COAL CRATE ----------
for (let y = 7; y <= 10; y++) { put(-2, y, 2, IRON); put(2, y, 2, IRON); }
for (let x = -2; x <= 2; x++) for (let y = 4; y <= 6; y++) for (let z = 1; z <= 3; z++) {
  const edgeX = x === -2 || x === 2, edgeY = y === 4 || y === 6, edgeZ = z === 1 || z === 3;
  const n = (edgeX ? 1 : 0) + (edgeY ? 1 : 0) + (edgeZ ? 1 : 0);
  if (n >= 2) put(x, y, z, OAK_LOG);
  else if (y === 6) put(x, y, z, BLACK);
  else if (n === 1) put(x, y, z, PLANKS);
}
put(0, 7, 2, BLACK); put(-1, 7, 2, BLACK);

// ---------- RUINED STONE WALL (the lifted foot steps toward it) ----------
const hts = [2, 3, 2, 1, 2, 3, 3, 2, 1, 0, 1, 2, 2];
for (let i = 0; i < hts.length; i++) {
  const x = -21 + i;
  for (let y = 0; y <= hts[i]; y++) put(x, y, -18, (i + y) % 3 === 0 ? STONE : COBBLE);
  if (hts[i] >= 2 && i % 2 === 0) put(x, hts[i] + 1, -18, LEAVES);
}
put(-12, 0, -17, COBBLE); put(-13, 0, -16, STONE); put(-10, 0, -17, COBBLE);

// ---------- FLUSH ----------
for (const [key, id] of M) {
  const [x, y, z] = key.split(',').map(Number);
  block(x, y, z, id);
}