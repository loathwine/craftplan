// woolly-rhino-fable — prompt:
// a woolly rhinoceros...

// ===== Woolly rhinoceros — mother and calf in a frosty forest clearing =====
// Head faces NORTH (-Z), angled ~14° toward the east. Bodies are hollow shells.

function hash3(a, b, c) {
  const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function E(u, v, w, cu, cv, cw, ru, rv, rw) {
  const a = (u - cu) / ru, b = (v - cv) / rv, c = (w - cw) / rw;
  return a * a + b * b + c * c;
}
function segDist(pu, pv, pw, a, b) {
  const du = b[0] - a[0], dv = b[1] - a[1], dw = b[2] - a[2];
  const L = du * du + dv * dv + dw * dw;
  let t = ((pu - a[0]) * du + (pv - a[1]) * dv + (pw - a[2]) * dw) / L;
  t = Math.max(0, Math.min(1, t));
  const x = pu - a[0] - du * t, y = pv - a[1] - dv * t, z = pw - a[2] - dw * t;
  return [Math.sqrt(x * x + y * y + z * z), t];
}

const BUDGET = 3950;
const NF = 1000; // flag: never frost this block
const ops = new Map();
function okey(x, y, z) { return (x + 30) + (y + 10) * 64 + (z + 30) * 4096; }
function put(x, y, z, id) { // first writer wins, stays inside limits and budget
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return false;
  const k = okey(x, y, z);
  if (ops.has(k) || ops.size >= BUDGET) return false;
  ops.set(k, [x, y, z, id]);
  return true;
}

// leg anchors in body space: [u, w, isFront]  (staggered = mid-stride)
const LEGS = [[-4.0, 6.5, true], [4.0, 3.5, true], [-4.2, -12.5, false], [4.2, -9.5, false]];

// Body space: u = right, v = up, w = forward (toward the nose). Returns block id or 0.
function sample(u, v, w, n1, n2, n3, s, o) {
  const au = Math.abs(u);
  const minR = 0.78 / s;

  // --- great flattened front horn, sweeping forward then back ---
  if (w > 13 && v > 8.5) {
    let best = 1e9, bt = 0;
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const hv = 9.2 + 10.5 * o.horn * t;
      const hw = 18.6 + 2.2 * o.horn * Math.sin(0.85 * Math.PI * t);
      const d = Math.sqrt(u * u + (v - hv) * (v - hv) + (w - hw) * (w - hw)) - Math.max(minR, 1.8 - 1.3 * t);
      if (d < best) { best = d; bt = t; }
    }
    if (best < 0) return (Math.floor(bt * 11) % 3 === 0) ? PLANKS : SAND; // growth bands
    // --- second, smaller horn between the eyes ---
    if (o.horn2) {
      const r2 = segDist(u, v, w, [0, 11, 15.2], [0, 15.4, 16.1]);
      if (r2[0] < Math.max(minR, 1.35 - 0.6 * r2[1])) return r2[1] < 0.25 ? PLANKS : SAND;
    }
  }
  // --- ears ---
  if (v > 12 && w > 8 && w < 14) {
    const e = segDist(au, v, w, [2.8, 12.8, 11.3], [4.3, 16.3, 10.5]);
    if (e[0] < Math.max(0.72 / s, 1.05 - 0.3 * e[1])) return OAK_LOG + NF;
  }
  // --- short tail with dark tuft ---
  if (w < -15) {
    const tl = segDist(u, v, w, [0, 12.5, -16.2], [0, 6.5, -18.4]);
    if (tl[0] < Math.max(0.72 / s, tl[1] > 0.72 ? 1.25 : 0.85)) return tl[1] > 0.72 ? OAK_LOG : BROWN;
  }
  // --- legs: stout columns, grey hooves, dark shins, shoulder / thigh muscle ---
  for (let i = 0; i < LEGS.length; i++) {
    const lu = LEGS[i][0], lw = LEGS[i][1];
    if (v < 9) {
      const d = Math.sqrt((u - lu) * (u - lu) + (w - lw) * (w - lw));
      const r = 2.2 + (v < 1.5 ? 0.5 : 0) + (v > 5 ? (v - 5) * 0.3 : 0);
      if (d < r) {
        if (v < 1.5) return (w - lw > 0.9) ? LIGHT_GRAY : GRAY;
        if (v < 2.6 + 1.6 * n1) return OAK_LOG;
        return n3 < 0.2 ? OAK_LOG : BROWN;
      }
    }
    const bulge = LEGS[i][2]
      ? E(u, v, w, lu * 1.05, 8.5, lw, 2.9, 4.6, 3.5)
      : E(u, v, w, lu * 1.05, 7.8, lw, 3.0, 4.8, 4.0);
    if (bulge < 1) return n3 < 0.16 ? OAK_LOG : (n3 > 0.85 ? DIRT : BROWN);
  }
  // --- long low head + broad snout ---
  const inHead = E(u, v, w, 0, 8, 14.5, 3.6, 3.8, 5) < 1;
  const inSnout = E(u, v, w, 0, 6.8, 18, 3, 3, 3.5) < 1;
  if (inHead || inSnout) {
    const de = Math.sqrt((au - 3.3) * (au - 3.3) + (v - 9.2) * (v - 9.2) + (w - 15.8) * (w - 15.8));
    if (de * s < 0.8) return BLACK; // eye
    if (o.nostril) {
      const dn = Math.sqrt((au - 1.3) * (au - 1.3) + (v - 7.2) * (v - 7.2) + (w - 20.9) * (w - 20.9));
      if (dn < 0.78) return BLACK;
    }
    if (inSnout && w > 17.3 && Math.abs(v - 5.3) < 0.5 / s) return OAK_LOG; // mouth line
    if (inSnout && w > 19.5) return n3 > 0.5 ? DIRT : BROWN;               // paler muzzle
    return n3 < 0.12 ? OAK_LOG : (n3 > 0.88 ? DIRT : BROWN);
  }
  // --- torso, deep chest, shoulder hump, rump, neck — ragged hanging wool ---
  const sh = o.shag;
  const rvT = v < 9.5 ? 5.2 + 1.9 * n1 * sh : 6;
  const rvC = v < 9 ? 4.9 + 1.6 * n1 * sh : 5.5;
  const rvH = v > 13.5 ? 5.2 + 1.5 * n2 : 5.5;
  const rvN = v < 10.5 ? 5.0 + 1.9 * n1 * sh : 5.2;
  const inTorso = E(u, v, w, 0, 9.5, -4, 6.5, rvT, 11.5) < 1;
  const inChest = E(u, v, w, 0, 9, 5, 5.6, rvC, 5.5) < 1;
  const inHump = E(u, v, w, 0, 13.5, 4, 5.5, rvH, 6.5) < 1;
  const inRump = E(u, v, w, 0, 10.2, -11, 6.2, 6, 6) < 1;
  const inNeck = E(u, v, w, 0, 10.5, 10, 4.8, rvN, 5) < 1;
  if (inTorso || inChest || inHump || inRump || inNeck) {
    if (v > 16.2 && inHump) return n3 < 0.62 ? OAK_LOG : BROWN;   // dark mane on the hump
    if (v > 14.6 && au < 2.2) return n3 < 0.5 ? OAK_LOG : BROWN;  // dorsal stripe
    if (v < 5.2) return n3 > 0.5 ? DIRT : BROWN;                  // paler belly fringe
    return n3 < 0.15 ? OAK_LOG : (n3 > 0.87 ? DIRT : BROWN);
  }
  return 0;
}

// Voxelise one animal (inverse-mapped so rotation leaves no holes), keep only the shell.
function rhino(P, o) {
  const s = P.s, st = Math.sin(P.th), ct = Math.cos(P.th);
  const solid = new Map();
  const R = Math.ceil(24 * s) + 2, H = Math.ceil(23 * s) + 2;
  const key = (x, y, z) => (x + 60) + (y + 10) * 128 + (z + 60) * 16384;
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
    const w = (dx * st - dz * ct) / s, u = (dx * ct + dz * st) / s;
    const n1 = hash3(dx + P.ox, dz + P.oz, 1.7), n2 = hash3(dx + P.ox, dz + P.oz, 6.3);
    for (let dy = 0; dy <= H; dy++) {
      const id = sample(u, (dy + 0.5) / s, w, n1, n2, hash3(dx, dy, dz), s, o);
      if (id) solid.set(key(dx, dy, dz), [dx, dy, dz, id]);
    }
  }
  const out = [];
  for (const c of solid.values()) {
    const x = c[0], y = c[1], z = c[2];
    let id = c[3];
    const up = solid.has(key(x, y + 1, z));
    if (up && solid.has(key(x, y - 1, z)) && solid.has(key(x + 1, y, z)) && solid.has(key(x - 1, y, z)) &&
        solid.has(key(x, y, z + 1)) && solid.has(key(x, y, z - 1))) continue; // hollow interior
    if (id >= NF) id -= NF;
    else if (!up && (id === BROWN || id === OAK_LOG || id === DIRT) &&
             (y + 0.5) / s > 12.6 && hash3(x, z, y + 3.1) < o.frost) id = SNOW; // frost on the back
    out.push([P.ox + x, y, P.oz + z, id]);
  }
  return out;
}
function toWorld(P, u, w) {
  const st = Math.sin(P.th), ct = Math.cos(P.th);
  return [Math.round(P.ox + P.s * (w * st + u * ct)), Math.round(P.oz + P.s * (-w * ct + u * st))];
}
function toLocal(P, x, z) {
  const dx = x - P.ox, dz = z - P.oz, st = Math.sin(P.th), ct = Math.cos(P.th);
  return [(dx * ct + dz * st) / P.s, (dx * st - dz * ct) / P.s];
}

// ---------- placement ----------
const M = { ox: -3, oz: 0, s: 1, th: 14 * Math.PI / 180 };     // mother
const C = { ox: 14, oz: 4, s: 0.5, th: -14 * Math.PI / 180 };  // calf, leaning in toward her shoulder

function inClearing(x, z) {
  const m = toLocal(M, x, z);
  const a = m[0] / 10.5, b = (m[1] - 1) / 24;
  if (a * a * a * a + b * b * b * b < 1) return true;
  const c = (x - 15) / 8.5, d = (z - 3.5) / 14.5;
  return c * c + d * d < 1;
}
function footDist(P, x, z) {
  const l = toLocal(P, x, z);
  let best = 1e9;
  for (let i = 0; i < LEGS.length; i++) best = Math.min(best, Math.hypot(l[0] - LEGS[i][0], l[1] - LEGS[i][1]) * P.s);
  return best;
}

// 1) Open a clearing in the forest (canopy tops out at y=8). AIR is free.
const ground = [];
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  if (!inClearing(x, z)) continue;
  cube(x, 0, z, x, 9, z, AIR);
  const g = Math.sin(x * 0.45 + 1) * Math.cos(z * 0.38) + Math.sin((x + z) * 0.21) + (hash3(x, z, 2.2) - 0.5) * 0.7;
  const tuft = hash3(x, z, 8.8) < 0.04;
  const foot = footDist(M, x, z) < 2.9;
  ground.push([foot ? 10 : (tuft ? 9 : g), x, z, tuft]);
}

// 2) The animals (mother always; calf if the budget allows).
const mother = rhino(M, { horn: 1, horn2: true, nostril: true, shag: 1, frost: 0.28 });
for (let i = 0; i < mother.length; i++) put(mother[i][0], mother[i][1], mother[i][2], mother[i][3]);
const calf = rhino(C, { horn: 0.3, horn2: false, nostril: false, shag: 0.4, frost: 0.2 });
const hasCalf = ops.size + calf.length <= BUDGET - 190;
if (hasCalf) for (let i = 0; i < calf.length; i++) put(calf[i][0], calf[i][1], calf[i][2], calf[i][3]);

// 3) Breath clouds in the cold air.
let bp = toWorld(M, -1.3, 22.6); put(bp[0], 7, bp[1], STEAM);
bp = toWorld(M, 1.3, 22.6); put(bp[0], 7, bp[1], STEAM);
if (hasCalf) { bp = toWorld(C, 0, 23.6); put(bp[0], 3, bp[1], STEAM); }

// 4) Frozen puddle by her left shoulder + frost-capped boulders.
const ice = [[-9, -15], [-8, -15], [-10, -14], [-9, -14], [-8, -14], [-7, -14], [-9, -13], [-8, -13], [-7, -13], [-8, -12]];
for (let i = 0; i < ice.length; i++) put(ice[i][0], -1, ice[i][1], ICE);
function boulder(cx, cz, r) {
  for (let x = -r; x <= r; x++) for (let y = 0; y <= r; y++) for (let z = -r; z <= r; z++) {
    if (x * x + y * y * 1.6 + z * z > r * r + 0.6) continue;
    const top = x * x + (y + 1) * (y + 1) * 1.6 + z * z > r * r + 0.6;
    put(cx + x, y, cz + z, top && hash3(x + cx, z + cz, 3) < 0.55 ? SNOW : (hash3(x, y, z + cx) < 0.4 ? COBBLE : STONE));
  }
}
boulder(9, -13, 2);
boulder(-12, -6, 1);
boulder(8, 15, 1);

// 5) Trampled snow + dead steppe-grass tufts, most important cells first, until the budget is spent.
ground.sort((a, b) => b[0] - a[0]);
const snowCap = Math.floor(ground.length * 0.8);
for (let i = 0; i < ground.length && i < snowCap; i++) {
  if (ops.size >= BUDGET - 2) break;
  const x = ground[i][1], z = ground[i][2];
  put(x, -1, z, SNOW);
  if (ground[i][3]) {
    put(x, 0, z, PLANKS);
    if (hash3(x, z, 4.4) < 0.4) put(x, 1, z, SAND);
  }
}

// 6) Emit everything (after the AIR so nothing gets erased).
for (const c of ops.values()) block(c[0], c[1], c[2], c[3]);