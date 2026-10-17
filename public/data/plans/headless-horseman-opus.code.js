// headless-horseman-opus — prompt:
// the Headless Horseman holding a flaming pumpkin...

const K = 1.15;
const TH = 15 * Math.PI / 180;
const CO = Math.cos(TH), SI = Math.sin(TH);
const H = new Map();
const M = new Map();
let T = H;

function key(x, y, z) { return x + ',' + y + ',' + z; }
function setIn(map, x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  map.set(key(x, y, z), [x, y, z, id]);
}
function put(x, y, z, id) { setIn(T, x, y, z, id); }
function has(x, y, z) { return T.has(key(Math.round(x), Math.round(y), Math.round(z))); }
function idAt(x, y, z) { const v = T.get(key(x, y, z)); return v ? v[3] : -1; }
function hh(a, b, c) { const h = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return h - Math.floor(h); }
function box(x1, y1, z1, x2, y2, z2, id) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) put(x, y, z, id);
}
function ell(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
        if (d <= 1.0) put(x, y, z, id);
      }
}
function ball(cx, cy, cz, r, id) {
  if (r < 0.6) { put(cx, cy, cz, id); return; }
  const r2 = r * r + 0.3;
  for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++)
    for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++)
      for (let z = Math.floor(cz - r - 1); z <= Math.ceil(cz + r + 1); z++)
        if ((x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= r2) put(x, y, z, id);
}
function seg(a, b, r1, r2, id) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.ceil(d * 2.5));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    ball(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, r1 + (r2 - r1) * t, id);
  }
}
function path(pts, r1, r2, id) {
  const n = pts.length - 1;
  for (let i = 0; i < n; i++) seg(pts[i], pts[i + 1], r1 + (r2 - r1) * i / n, r1 + (r2 - r1) * (i + 1) / n, id);
}

// ================= SITE CLEARING =================
cube(-14, 1, -16, 14, 9, 16, AIR);
cube(-12, 2, -22, 12, 9, -17, AIR);
cube(-22, 1, 0, -15, 9, 14, AIR);
cube(15, 1, -16, 18, 9, 14, AIR);

// ================= SCENE (world coords) =================
T = M;
const stubs = [[1,-7],[4,-3],[12,11],[1,-13],[-1,-10],[3,-10],[-6,-8],[-7,-5],[7,-2],[-6,-1],[8,-1],[-6,1],[0,1],[8,3],[-7,4],[-7,5],[-2,7],[-10,8],[-7,8],[-6,9],[-5,13],[-9,15]];
for (const [x, z] of stubs) { put(x, 0, z, AIR); put(x, -1, z, GRASS); }

// Sleepy Hollow dirt road, running along the horse's line of travel
const roadKeys = [];
for (let z = -16; z <= 16; z++) {
  const cx = -0.268 * z + 0.8 * Math.sin(z * 0.3);
  const hw = 2.2 + hh(z, 7, 1) * 1.0;
  for (let x = Math.floor(cx - hw - 1); x <= Math.ceil(cx + hw + 1); x++) {
    const d = Math.abs(x - cx);
    if (d > hw + 0.5) continue;
    if (d > hw - 0.5 && hh(x, z, 3) > 0.5) continue;
    const r = hh(x, z, 9);
    const id = r < 0.6 ? DIRT : r < 0.78 ? BROWN : r < 0.9 ? COBBLE : STONE;
    put(x, -1, z, id); roadKeys.push(key(x, -1, z));
    put(x, 0, z, AIR);
  }
}

// Gravestones
function grave(x, z, type, id) {
  box(x - 1, -1, z, x + 1, -1, z, COBBLE);
  if (type === 'round') { box(x - 1, 0, z, x + 1, 2, z, id); put(x, 3, z, id); }
  else if (type === 'cross') { box(x, 0, z, x, 4, z, id); put(x - 1, 3, z, id); put(x + 1, 3, z, id); }
  else { box(x - 1, 0, z, x + 1, 1, z, id); put(x - 1, 2, z, id); put(x, 2, z, id); }
  box(x - 1, 0, z + 1, x + 1, 0, z + 2, DIRT);
  if (hh(x, z, 5) > 0.5) put(x + 1, 0, z + 2, LEAVES);
}
grave(-9, -8, 'round', STONE);
grave(-12, -2, 'cross', COBBLE);
grave(-8, 3, 'slab', GRAY);
grave(-10, 10, 'round', MARBLE);
grave(10, -9, 'round', STONE);
grave(13, -3, 'slab', GRAY);
grave(8, 4, 'cross', STONE);
grave(12, 9, 'round', COBBLE);
grave(6, 13, 'slab', STONE);

// Ground jack-o'-lanterns
function jol(x, z) {
  box(x - 1, 0, z - 1, x + 1, 1, z + 1, ORANGE);
  T.delete(key(x - 1, 1, z + 1)); T.delete(key(x + 1, 1, z + 1));
  put(x - 1, 1, z - 1, GLOWSTONE); put(x + 1, 1, z - 1, GLOWSTONE); put(x, 0, z - 1, GLOWSTONE);
  put(x, 2, z, GREEN);
}
jol(-5, -12); jol(9, -13); jol(-14, 2); jol(14, 4);

// Wrought-iron cemetery fence on the east side
for (let z = -15; z <= 13; z++) {
  put(17, 1, z, IRON); put(17, 3, z, IRON);
  if ((z + 15) % 7 === 0) { box(17, -1, z, 17, 4, z, COBBLE); put(17, 5, z, STONE); }
  else if ((z & 1) === 0) { box(17, -1, z, 17, 3, z, IRON); put(17, 4, z, IRON); }
}

// Dead gnarled tree
path([[-17, -1, 6], [-17, 5, 6.5], [-16, 10, 7], [-16.5, 14, 7]], 1.8, 0.9, OAK_LOG);
const branches = [
  [[-16, 10, 7], [-13, 14, 8], [-10, 17, 9], [-7, 18, 9]],
  [[-16.5, 12, 7], [-19, 16, 6], [-21, 20, 7], [-20, 23, 7]],
  [[-16.5, 14, 7], [-16, 19, 8], [-14, 23, 9], [-13, 26, 9]],
  [[-16, 8, 7], [-12, 10, 9], [-10, 10, 11]],
  [[-17, 13, 6.5], [-18, 18, 4], [-17, 21, 2]],
];
for (const b of branches) path(b, 0.9, 0.45, OAK_LOG);
const twigs = [
  [[-10, 17, 9], [-9, 20, 10]], [[-7, 18, 9], [-5, 20, 9]], [[-21, 20, 7], [-22, 22, 8]],
  [[-14, 23, 9], [-11, 24, 10]], [[-16, 19, 8], [-18, 23, 9]], [[-12, 10, 9], [-11, 12, 8]],
  [[-18, 18, 4], [-20, 19, 3]], [[-13, 26, 9], [-12, 28, 10]],
];
for (const t of twigs) path(t, 0.4, 0.4, BROWN);
for (const r of [[[-17, 0, 6], [-20, -1, 7]], [[-17, 0, 6], [-15, -1, 4]], [[-17, 0, 6], [-18, -1, 3]]]) path(r, 0.7, 0.5, OAK_LOG);
// Crows perched on the branches
for (const [x, y, z] of [[-7, 19, 9], [-13, 27, 9], [-20, 24, 7]]) {
  put(x, y, z, BLACK); put(x, y, z + 1, BLACK); put(x, y + 1, z, BLACK); put(x, y + 1, z - 1, GRAY);
}

// Full moon behind everything
const craters = [[-12, 26, 1.3], [-8, 22, 1.6], [-11, 21, 0.9], [-7, 28, 1.1], [-13, 23, 0.8]];
for (let x = -17; x <= -3; x++)
  for (let y = 17; y <= 32; y++) {
    if (Math.hypot(x + 10, y - 24) > 6.5) continue;
    let id = WHITE;
    for (const [cx, cy, r] of craters) if (Math.hypot(x - cx, y - cy) <= r) id = LIGHT_GRAY;
    put(x, y, 21, id);
  }

// Autumn leaf litter
for (let i = 0; i < 30; i++) {
  const x = Math.round(hh(i, 1, 2) * 28 - 14), z = Math.round(hh(i, 4, 5) * 30 - 15);
  if (Math.abs(x + 0.268 * z) < 5) continue;
  if (M.has(key(x, -1, z)) || M.has(key(x, 0, z))) continue;
  put(x, -1, z, hh(i, 6, 6) > 0.7 ? ORANGE : BROWN);
}

// Burning hoofprints behind the galloping horse
put(-5, -1, 15, LAVA); put(-3, -1, 16, LAVA); put(-4, -1, 12, LAVA);
put(-5, 0, 15, FIRE); put(-3, 0, 16, FIRE);

// ================= HORSEMAN (local coords, later scaled + rotated) =================
T = H;
// Horse body
ell(0, 7.5, 2, 2.6, 2.8, 6.2, BLACK);
ell(0, 7.8, -3, 2.7, 3.0, 2.8, BLACK);
ell(0, 8.2, 6.2, 2.9, 3.0, 3.0, BLACK);
seg([0, 9.5, -4], [0, 15, -8.5], 2.3, 1.6, BLACK);

// Saddle blanket (purple + gold trim) and chest strap
for (const v of [...H.values()]) {
  const [x, y, z] = v;
  if (z >= -1 && z <= 3 && y >= 7) {
    if (!has(x + 1, y, z) || !has(x - 1, y, z) || !has(x, y + 1, z)) v[3] = (y === 7) ? GOLD : PURPLE;
  } else if (y === 8 && z <= -3 && (!has(x, y, z - 1) || !has(x + 1, y, z) || !has(x - 1, y, z))) {
    v[3] = BROWN;
  }
}
for (let z = -12; z <= 0; z++) if (has(0, 8, z)) { put(0, 8, z, GOLD); break; }

// Head
seg([0, 16.2, -9], [0, 13.2, -13.5], 1.6, 1.3, BLACK);
ball(0, 14.5, -10.5, 1.8, BLACK);
ell(0, 12.8, -14.2, 1.3, 1.3, 1.2, OBSIDIAN);
// Bridle
for (const v of H.values()) {
  const [x, y, z, id] = v;
  if (id !== BLACK) continue;
  if (z === -12 && y >= 12 && y <= 15) v[3] = BROWN;
  if (z === -9 && y >= 15) v[3] = BROWN;
}
put(2, 15, -10, NEON_RED); put(-2, 15, -10, NEON_RED);
put(2, 13, -13, IRON); put(-2, 13, -13, IRON);
put(1, 18, -9, BLACK); put(1, 19, -9, BLACK); put(-1, 18, -9, BLACK); put(-1, 19, -9, BLACK);
put(0, 18, -10, OBSIDIAN); put(0, 17, -11, OBSIDIAN);

// Mane streaming back
for (let t = 0; t <= 1.001; t += 0.07) {
  const r = 2.3 - 0.7 * t;
  const ay = 9.5 + 5.5 * t, az = -4 - 4.5 * t;
  const my = ay + 0.63 * (r + 0.7), mz = az + 0.77 * (r + 0.7);
  put(0, my, mz, OBSIDIAN);
  put(0, my - 0.3, mz + 1, OBSIDIAN);
  if (hh(t * 10, 1, 2) > 0.5) put(hh(t, 3, 3) > 0.5 ? 1 : -1, my - 0.8, mz + 0.6, OBSIDIAN);
}

// Legs (gallop)
function hoof(x, y, z) { put(x, y, z, IRON); put(x + 1, y, z, IRON); put(x - 1, y, z, IRON); put(x, y, z + 1, IRON); put(x, y, z - 1, IRON); }
seg([2, 7, -3], [2, 3.5, -4.5], 1.4, 1.0, BLACK); seg([2, 3.5, -4.5], [2, 1, -5], 0.9, 0.9, BLACK); hoof(2, 0, -5);
seg([-2, 7, -3], [-2, 5, -7], 1.4, 1.0, BLACK); seg([-2, 5, -7], [-2, 2.6, -6], 0.9, 0.9, BLACK); hoof(-2, 2, -6);
seg([-2, 8, 6.5], [-2, 3.5, 8.5], 1.7, 1.0, BLACK); seg([-2, 3.5, 8.5], [-2, 1, 7], 0.9, 0.9, BLACK); hoof(-2, 0, 7);
seg([2, 8, 6.5], [2, 4, 9.5], 1.7, 1.0, BLACK); seg([2, 4, 9.5], [2, 1.8, 12], 0.9, 0.9, BLACK); hoof(2, 1, 12);

// Tail streaming behind
path([[0, 10, 8.5], [0, 10.5, 11], [0, 9.5, 13.5], [0, 8, 15.5], [0, 6.5, 16.5]], 1.3, 0.6, OBSIDIAN);
put(1, 7, 16, OBSIDIAN); put(-1, 8, 15, OBSIDIAN); put(0, 5, 17, OBSIDIAN); put(1, 9, 14, OBSIDIAN);

// Saddle
for (let x = -1; x <= 1; x++) put(x, 11, -1, BROWN);
put(0, 12, -1, BROWN);

// Rider legs
for (const s of [-1, 1]) {
  seg([s * 1.5, 11.5, 1], [s * 3, 9.5, -1.5], 1.1, 1.0, GRAY);
  seg([s * 3, 9.5, -1.5], [s * 3, 6.2, 0], 0.95, 0.9, BLACK);
  put(s * 3, 6, -1, BLACK); put(s * 3, 9, -2, BROWN);
  put(s * 3, 5, 0, IRON); put(s * 3, 5, -1, IRON);
}

// Torso: black coat, grey waistcoat, gold buttons, white cravat
for (let y = 11; y <= 18; y++) {
  const z0 = Math.round(-(y - 11) * 0.15);
  const hw = y >= 16 ? 3 : 2;
  for (let x = -hw; x <= hw; x++)
    for (let z = z0; z <= z0 + 2; z++) {
      if (y === 18 && Math.abs(x) === 3) continue;
      if (y === 16 && Math.abs(x) === 3 && z === z0 + 2) continue;
      let id = BLACK;
      if (y === 12) id = BROWN;
      if (z === z0 && Math.abs(x) <= 1) {
        if (y >= 13 && y <= 15) id = GRAY;
        if (y === 12) id = (x === 0) ? GOLD : BROWN;
        if (y >= 16) id = WHITE;
        if (x === 0 && (y === 13 || y === 15)) id = GOLD;
      }
      put(x, y, z, id);
    }
}
// Collar around the empty neck
for (let x = -2; x <= 2; x++)
  for (let z = -1; z <= 1; z++) {
    if (Math.abs(x) === 2 || z === 1) put(x, 19, z, BLACK);
    else if (z === -1) put(x, 19, z, WHITE);
    else put(x, 19, z, RED);
  }
put(0, 20, 0, RED);
for (let x = -2; x <= 2; x++) { put(x, 20, 1, BLACK); put(x, 21, 1, BLACK); }
put(-2, 20, 0, BLACK); put(2, 20, 0, BLACK);
// Coat tails over the rump
seg([-1.2, 11, 2.5], [-1.6, 9.3, 5.5], 0.9, 0.7, BLACK);
seg([1.2, 11, 2.5], [1.6, 9.3, 5.5], 0.9, 0.7, BLACK);

// Left arm holding the reins
path([[-3, 17.5, 0], [-4.2, 14.5, -1.5], [-2.6, 13, -3.5]], 1.1, 0.85, BLACK);
put(-3, 13, -3, WHITE);
ball(-2.2, 13, -4.2, 0.8, BROWN);
path([[-2, 13, -4.5], [-3, 14, -7.5], [-2, 13.5, -12]], 0.3, 0.3, BROWN);
path([[-1.5, 13.5, -4.5], [3, 14.5, -7.5], [2, 13.5, -12]], 0.3, 0.3, BROWN);

// Scabbard on the left hip
path([[-4, 10.5, 0.5], [-4, 7, 5]], 0.3, 0.3, BROWN);
put(-4, 11, 0, GOLD); put(-4, 12, -1, BLACK); put(-4, 13, -1, GOLD);

// Right arm raised high with the pumpkin
path([[3, 17.5, 0], [5, 19.5, -2], [6.2, 20.5, -4]], 1.1, 0.85, BLACK);
put(6, 20, -3, WHITE); put(5, 20, -3, WHITE);
ball(6.5, 20.8, -4.4, 0.8, BROWN);

// The flaming jack-o'-lantern
ell(7, 24, -5, 3.2, 3.05, 3.2, ORANGE);
const face = [[-2,1],[-1,1],[-2,2],[2,1],[1,1],[2,2],[0,0],[-2,-1],[-1,-1],[1,-1],[2,-1],[-1,-2],[0,-2],[1,-2]];
for (const [dx, dy] of face) {
  const x = 7 + dx, y = 24 + dy;
  for (let z = -10; z <= -2; z++) if (idAt(x, y, z) === ORANGE) { put(x, y, z, GLOWSTONE); break; }
}
put(7, 28, -5, GREEN);
for (const [x, y, z] of [[5,27,-5],[9,27,-5],[7,27,-7],[7,27,-3],[6,28,-6],[8,28,-4],[7,29,-5],[7,25,-1]]) put(x, y, z, FIRE);

// Billowing cape (black, red lining)
const capeCells = [];
for (let si = 0; si <= 40; si++) {
  const s = si / 40;
  const zc = 2 + s * 13;
  const halfW = 2.8 + s * 4.5;
  for (let ui = -20; ui <= 20; ui++) {
    const u = ui / 20;
    if (s > 0.82 && hh(ui, si, 1) > 0.6) continue;
    const x = u * halfW;
    const y = 18.3 - s * 4.5 + 2.2 * Math.sin(s * Math.PI) - 2.5 * u * u * (0.3 + s) + 0.7 * Math.sin(s * 9 + u * 2);
    const rx = Math.round(x), ry = Math.round(y), rz = Math.round(zc);
    if (has(rx, ry, rz) && idAt(rx, ry, rz) !== BLACK) continue;
    put(rx, ry, rz, BLACK);
    if (s > 0.1) capeCells.push([rx, ry, rz]);
  }
}
for (const [x, y, z] of capeCells) if (!has(x, y - 1, z)) put(x, y - 1, z, RED);

// ================= SCALE + ROTATE HORSEMAN INTO WORLD =================
for (let tx = -22; tx <= 22; tx++)
  for (let tz = -22; tz <= 22; tz++) {
    const sx = Math.round((tx * CO + tz * SI) / K);
    const sz = Math.round((-tx * SI + tz * CO) / K);
    for (let ty = -1; ty <= 33; ty++) {
      const sy = Math.round(ty / K);
      const v = H.get(key(sx, sy, sz));
      if (v) setIn(M, tx, ty, tz, v[3]);
    }
  }

// ================= BUDGET GUARD + EMIT =================
let solid = 0;
for (const v of M.values()) if (v[3] !== AIR) solid++;
while (solid > 3990 && roadKeys.length) {
  const k = roadKeys.pop();
  const v = M.get(k);
  if (v && v[3] !== AIR) { M.delete(k); solid--; }
}
for (const v of M.values()) block(v[0], v[1], v[2], v[3]);