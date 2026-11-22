// snow-monkey-opus — prompt:
// a Japanese snow monkey in a hot spring...

// ===== Japanese snow monkey in a hot spring (onsen) =====
const M = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(K(x, y, z), id);
}
function get(x, y, z) { return M.get(K(Math.round(x), Math.round(y), Math.round(z))); }
function h(x, y, z, s) {
  s = s || 0;
  let n = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1274126177) + Math.imul(s, 982451653)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n = n ^ (n >>> 16);
  return (n >>> 0) / 4294967296;
}
function ell(cx, cy, cz, rx, ry, rz, fn, shell, ymin) {
  const ins = (x, y, z) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2 <= 1;
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        if (ymin !== undefined && y < ymin) continue;
        if (!ins(x, y, z)) continue;
        if (shell && ins(x + 1, y, z) && ins(x - 1, y, z) && ins(x, y + 1, z) && ins(x, y - 1, z) && ins(x, y, z + 1) && ins(x, y, z - 1)) continue;
        const id = typeof fn === 'function' ? fn(x, y, z, ins) : fn;
        if (id != null) put(x, y, z, id);
      }
}
function limb(pts, r, fn) {
  for (let s = 0; s < pts.length - 1; s++) {
    const a = pts[s], b = pts[s + 1];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const n = Math.max(1, Math.ceil(d * 1.5));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const rr = r[s] + (r[s + 1] - r[s]) * t;
      ell(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, rr, rr, rr, fn, false, 0);
    }
  }
}
function frontZ(x, y, z0, z1) {
  for (let z = z0; z <= z1; z++) {
    const v = get(x, y, z);
    if (v !== undefined && v !== WATER && v !== AIR && v !== STEAM) return z;
  }
  return null;
}
function fur(x, y, z) {
  const r = h(x, y, z, 1);
  if (y <= 1) return r < 0.55 ? GRAY : (r < 0.8 ? BROWN : LIGHT_GRAY); // wet fur at waterline
  if (r < 0.55) return LIGHT_GRAY;
  if (r < 0.85) return GRAY;
  return BROWN;
}
const handFn = (x, y, z) => (h(x, y, z, 12) < 0.6 ? GRAY : BLACK);

// ===== Hot spring pool =====
const PRX = 10.5, PRZ = 8.5, PCZ = 1;
const inPool = (x, z) => (x / PRX) ** 2 + ((z - PCZ) / PRZ) ** 2 <= 1;
const inRim = (x, z) => (x / (PRX + 2.2)) ** 2 + ((z - PCZ) / (PRZ + 2.2)) ** 2 <= 1;
for (let x = -14; x <= 14; x++)
  for (let z = -11; z <= 13; z++) {
    if (inPool(x, z)) {
      put(x, -1, z, h(x, -1, z, 2) < 0.6 ? STONE : GRAY);
      put(x, 0, z, WATER);
    } else if (inRim(x, z)) {
      put(x, 0, z, h(x, 0, z, 3) < 0.55 ? STONE : COBBLE);
      if (h(x, 1, z, 4) < 0.5) put(x, 1, z, SNOW);
    }
  }

// ===== Snow-capped boulders ringing the pool (front left open for the view) =====
function boulder(bx, cy, bz, r, seed) {
  const ry = r * 0.8, rz = r * (0.85 + h(seed, 0, 0, 5) * 0.3);
  ell(bx, cy, bz, r, ry, rz, (x, y, z, ins) => {
    if (!ins(x, y + 1, z) && y >= cy - 0.5 && h(x, y, z, 6) < 0.85) return SNOW;
    const q = h(x, y, z, 7);
    return q < 0.5 ? STONE : (q < 0.8 ? COBBLE : GRAY);
  }, r > 2, -1);
}
const BL = [[0, 2.2, 1], [25, 2.6, 1.4], [50, 3, 2], [75, 3.4, 2.6], [100, 3.6, 3], [125, 3, 2.2], [150, 2.6, 1.5],
  [175, 2.5, 1.2], [200, 2, 0.8], [225, 1.6, 0.5], [250, 1.3, 0.3], [290, 1.3, 0.3], [315, 1.6, 0.5], [340, 2, 0.8]];
for (const [deg, r, cy] of BL) {
  const a = deg * Math.PI / 180;
  boulder(Math.round(12 * Math.cos(a)), cy, Math.round(PCZ + 10 * Math.sin(a)), r, deg);
}
boulder(-7, 1.5, 13, 2.6, 401);
boulder(7, 1.5, 13, 2.4, 402);

// ===== Dried bamboo fence behind the onsen =====
for (let x = -11; x <= 11; x++) {
  const H = 4 + (h(x, 0, 16, 9) < 0.3 ? 1 : 0);
  for (let y = 0; y <= H; y++) put(x, y, 16, (x & 1) ? PLANKS : SAND);
  if (h(x, 9, 16, 10) < 0.6) put(x, H + 1, 16, SNOW);
  put(x, 1, 15, OAK_LOG); put(x, 3, 15, OAK_LOG);
  if (x % 4 === 0) { put(x, 1, 14, BLACK); put(x, 3, 14, BLACK); } // rope ties
}
for (const px of [-12, 12]) { for (let y = 0; y <= 5; y++) put(px, y, 16, OAK_LOG); put(px, 6, 16, SNOW); }

// ===== Stone lantern (toro) =====
(function lantern(LX, LZ) {
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) { put(LX + dx, 0, LZ + dz, STONE); put(LX + dx, 4, LZ + dz, STONE); }
  for (let y = 1; y <= 3; y++) put(LX, y, LZ, STONE);
  for (let y = 5; y <= 6; y++) {
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) put(LX + dx, y, LZ + dz, STONE);
    put(LX, y, LZ, GLOWSTONE);
  }
  for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) put(LX + dx, 7, LZ + dz, STONE);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) put(LX + dx, 8, LZ + dz, SNOW);
  for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) put(LX + dx, 8, LZ + dz, STONE);
  put(LX, 9, LZ, STONE); put(LX, 10, LZ, SNOW);
})(-16, 8);

// ===== Snowy pines =====
function pine(px, pz, H) {
  for (let y = 0; y <= 2; y++) put(px, y, pz, OAK_LOG);
  const R = y => { if (y > H) return -1; const t = (y - 2) / (H - 2); const tier = ((y - 2) % 3) / 2; return (1 - t) * 3.6 * (1 - tier * 0.3) + 0.4; };
  for (let y = 2; y <= H; y++) {
    const r = R(y), rn = R(y + 1);
    for (let dx = -4; dx <= 4; dx++) for (let dz = -4; dz <= 4; dz++) {
      const d = Math.hypot(dx, dz);
      if (d > r) continue;
      if (y > 2 && d < rn - 1.3) continue; // hidden interior
      const exposed = d > rn - 0.3;
      put(px + dx, y, pz + dz, exposed && h(px + dx, y, pz + dz, 8) < 0.7 ? SNOW : LEAVES);
    }
  }
  put(px, H + 1, pz, SNOW);
}
pine(16, 13, 12);
pine(-17, 15, 10);
pine(19, 1, 8);

// ===== Wooden onsen bucket (foreground) =====
(function bucket(bx, bz) {
  for (let y = 0; y <= 2; y++)
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      if (dx === 0 && dz === 0) { if (y === 0) put(bx, 0, bz, PLANKS); else if (y === 1) put(bx, 1, bz, WATER); continue; }
      put(bx + dx, y, bz + dz, y === 1 ? COPPER : PLANKS);
    }
  put(bx + 1, 3, bz + 1, SNOW);
  put(bx - 1, 3, bz - 1, WHITE); // folded towel
})(-5, -11);

// ===== MAIN SNOW MONKEY =====
// Knees poking out of the water
for (const sx of [-3.5, 3.5]) ell(sx, 0.6, 0.2, 1.7, 1.4, 1.8, fur, false, 0);

// Torso (shell, above water)
const torsoIns = (x, y, z) => (x / 6) ** 2 + ((y - 3) / 6.5) ** 2 + ((z - 5) / 5) ** 2 <= 1;
ell(0, 3, 5, 6, 6.5, 5, (x, y, z) => {
  if (y >= 7 && !torsoIns(x, y + 1, z) && Math.abs(x) >= 2 && h(x, y, z, 13) < 0.6) return SNOW;
  if (z <= 1 && Math.abs(x) <= 3 && y >= 2) return h(x, y, z, 14) < 0.8 ? LIGHT_GRAY : GRAY;
  return fur(x, y, z);
}, true, 0);

// Head
const headIns = (x, y, z) => (x / 5) ** 2 + ((y - 12) / 5) ** 2 + ((z - 3) / 4.5) ** 2 <= 1;
ell(0, 12, 3, 5, 5, 4.5, (x, y, z) => {
  if (y >= 16 && !headIns(x, y + 1, z) && h(x, y, z, 15) < 0.85) return SNOW;
  return fur(x, y, z);
}, true);

// Muzzle
ell(0, 9.5, -0.8, 2.3, 1.8, 1.6, PINK, false);

// Paint the red-pink face oval on the front surface
for (let x = -3; x <= 3; x++)
  for (let y = 8; y <= 14; y++) {
    if ((x / 3.4) ** 2 + ((y - 11) / 3.4) ** 2 > 1) continue;
    const z = frontZ(x, y, -6, 6);
    if (z !== null) put(x, y, z, PINK);
  }
// Eyes, brow shadow, nose, mouth
for (const ex of [-2, 2]) {
  const z = frontZ(ex, 12, -6, 6); if (z !== null) put(ex, 12, z, BLACK);
  const zi = frontZ(ex - Math.sign(ex), 12, -6, 6); if (zi !== null) put(ex - Math.sign(ex), 12, zi, RED);
}
{ const z = frontZ(0, 10, -6, 6); if (z !== null) put(0, 10, z, RED); }
{ const z = frontZ(0, 11, -6, 6); if (z !== null) put(0, 11, z, RED); }
for (let x = -1; x <= 1; x++) { const z = frontZ(x, 8, -6, 6); if (z !== null) put(x, 8, z, BLACK); }

// Fluffy cheek ruffs framing the face
const faceSet = new Set([PINK, RED, BLACK]);
for (const sx of [-3.8, 3.8])
  ell(sx, 9.3, 0.8, 1.8, 2, 1.6, (x, y, z) => (faceSet.has(get(x, y, z)) ? null : fur(x, y, z)), false);

// Ears
for (const sx of [-6, 6]) { put(sx, 12, 3, PINK); put(sx, 13, 3, PINK); put(sx, 12, 4, PINK); }

// Snow pile on top of the head
ell(0, 16.6, 3.3, 2.6, 1.4, 2.3, SNOW, false, 16);

// Left arm draped over the west boulder
limb([[-5, 8, 5], [-8.5, 5.5, 5], [-10.5, 4.2, 2.5]], [1.8, 1.5, 1.3], fur);
ell(-10.8, 4.5, 1.8, 1.2, 0.9, 1.3, handFn, false);
put(-9, 7, 5, SNOW); put(-8, 7, 5, SNOW);

// Right arm holding a yuzu in front of the chest
limb([[5, 8, 5], [7, 4, 2.5], [3, 5, -1]], [1.8, 1.5, 1.3], fur);
ell(1.8, 6.2, -3, 1.3, 1.2, 1.3, YELLOW, false);
put(2, 7, -3, YELLOW); put(2, 8, -3, GREEN);
ell(2.8, 5.4, -1.8, 1.1, 1, 1.1, handFn, false);

// ===== Baby monkey on the front-east rock, looking at the camera =====
const babyFur = (x, y, z) => (h(x, y, z, 16) < 0.7 ? LIGHT_GRAY : GRAY);
ell(8, 3, -5.5, 1.6, 1.7, 1.5, babyFur, false);
ell(8, 5.8, -6, 1.5, 1.5, 1.4, babyFur, false);
{
  const f = (x, y, id) => { const z = frontZ(x, y, -10, -2); if (z !== null) put(x, y, z, id); };
  f(7, 6, BLACK); f(8, 6, PINK); f(9, 6, BLACK);
  f(7, 5, PINK); f(8, 5, RED); f(9, 5, PINK);
  put(8, 8, -6, SNOW);
  put(6, 6, -6, PINK); put(10, 6, -6, PINK); // tiny ears
  ell(9.8, 2.6, -6.6, 0.8, 0.8, 0.8, babyFur, false); // little hand resting on the rock
}

// ===== Floating yuzu in the bath =====
[[-5, -4], [4, -5], [7, -1], [-7, -2], [-2, -6], [8, 4], [-8, 3], [1, -4]].forEach(([x, z], i) => {
  if (get(x, 0, z) === WATER) put(x, 0, z, i % 3 === 0 ? ORANGE : YELLOW);
});

// ===== Steam rising from the water =====
[[-6, -3], [5, -4], [-2, -7], [8, 1], [-8, -1], [3, -7], [6, 7], [-6, 7], [-4, 3], [9, -3], [0, -5], [-9, 4]].forEach(([x, z]) => {
  if (get(x, 0, z) === WATER && get(x, 1, z) === undefined) put(x, 1, z, STEAM);
});

// ===== Snow ground (filled from the pool outward within the budget) =====
let n = 0;
for (const v of M.values()) if (v !== AIR) n++;
const cand = [];
for (let x = -21; x <= 21; x++)
  for (let z = -21; z <= 21; z++) {
    if (x * x + z * z > 441) continue;
    if (get(x, 0, z) !== undefined || get(x, -1, z) !== undefined) continue;
    cand.push([x, z, Math.hypot(x, z - 1)]);
  }
cand.sort((a, b) => a[2] - b[2]);
for (const [x, z] of cand) { if (n >= 3990) break; put(x, -1, z, SNOW); n++; }

// ===== Emit solids first =====
for (const [k, v] of M) {
  const p = k.split(',');
  block(+p[0], +p[1], +p[2], v);
}

// ===== Clear existing trees/grass in the scene (only cells we didn't build) =====
for (let x = -21; x <= 21; x++)
  for (let z = -21; z <= 21; z++) {
    if (x * x + z * z > 441) continue;
    for (let y = 0; y <= 8; y++) if (!M.has(K(x, y, z))) block(x, y, z, AIR);
  }