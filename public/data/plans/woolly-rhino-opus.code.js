// woolly-rhino-opus — prompt:
// a woolly rhinoceros...

const M = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(K(x, y, z), [x, y, z, id]);
}
function hash(x, y, z, s) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1440662683) ^ Math.imul((s | 0) + 7, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
const N6 = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];

// ---------- site: snowy steppe ellipse ----------
const GX = 2, GZ = -1, GRX = 19, GRZ = 20.5;
const ground = [];
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  const e = ((x - GX) / GRX) ** 2 + ((z - GZ) / GRZ) ** 2;
  if (e <= 1) {
    ground.push([x, z, e]);
    for (let y = 0; y <= 12; y++) put(x, y, z, AIR);
  } else if (z <= -12) {
    for (let y = 1; y <= 12; y++) put(x, y, z, AIR); // keep camera foreground open
  }
}

// ---------- rocks ----------
function boulder(cx, cy, cz, r, seed) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.ceil(cy + r); y++)
      for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) {
        const d = ((x - cx) / r) ** 2 + ((y - cy) / (r * 0.8)) ** 2 + ((z - cz) / r) ** 2;
        if (d <= 1) {
          const h = hash(x, y, z, seed);
          const top = ((x - cx) / r) ** 2 + ((y + 1 - cy) / (r * 0.8)) ** 2 + ((z - cz) / r) ** 2 > 1;
          put(x, y, z, top && h < 0.6 ? SNOW : h < 0.5 ? COBBLE : h < 0.85 ? STONE : GRAY);
        }
      }
}
boulder(-14, 0.5, -9, 2.2, 11);
boulder(-12, 0, -6, 1.3, 12);
boulder(17, 0, -14, 1.5, 13);
boulder(-15, 0, 9, 1.8, 14);

// ---------- rhino builder ----------
function rhino(ox, oz, s, seed, adult) {
  const S = new Map();
  const set = (x, y, z, m) => { if (y >= 0) S.set(K(x, y, z), m); };
  const ell = (cx, cy, cz, rx, ry, rz, m) => {
    const X = ox + cx * s, Y = cy * s, Z = oz + cz * s;
    const RX = Math.max(rx * s, 0.9), RY = Math.max(ry * s, 0.9), RZ = Math.max(rz * s, 0.9);
    for (let x = Math.floor(X - RX); x <= Math.ceil(X + RX); x++)
      for (let y = Math.floor(Y - RY); y <= Math.ceil(Y + RY); y++)
        for (let z = Math.floor(Z - RZ); z <= Math.ceil(Z + RZ); z++)
          if (((x - X) / RX) ** 2 + ((y - Y) / RY) ** 2 + ((z - Z) / RZ) ** 2 <= 1) set(x, y, z, m);
  };
  const leg = (cx, cz, r, h) => {
    const X = ox + cx * s, Z = oz + cz * s, top = Math.round(h * s), footTop = adult ? 1 : 0;
    for (let y = 0; y <= top; y++) {
      const R = (r + (y > top * 0.55 ? 0.6 : 0)) * s;
      for (let x = Math.floor(X - R - 1); x <= Math.ceil(X + R + 1); x++)
        for (let z = Math.floor(Z - R - 1); z <= Math.ceil(Z + R + 1); z++)
          if ((x - X) ** 2 + (z - Z) ** 2 <= R * R + 0.35) set(x, y, z, y <= footTop ? 'foot' : 'leg');
    }
  };
  const horn = (bx, by, bz, dy, dz, r0, n, tipR) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const y = by + dy * t, z = bz + dz * Math.sin(t * Math.PI / 2);
      const r = r0 * (1 - t) + tipR * t;
      ell(bx, y, z, r, r, r, t < 0.3 ? 'hornD' : t < 0.8 ? 'horn' : 'hornT');
    }
  };

  // body masses (front faces -Z)
  ell(0, 10, 1, 6, 5.5, 10, 'fur');       // barrel
  ell(0, 13.5, -4, 5, 4, 5.5, 'fur');     // shoulder hump
  ell(0, 10.5, 7, 5.5, 5, 5, 'fur');      // rump
  ell(0, 9.5, -8, 4.5, 4.6, 3.5, 'fur');  // neck
  ell(0, 7, -13, 3, 3.5, 4.5, 'head');    // low-slung head
  ell(0, 5.5, -16, 2.4, 2.4, 2.6, 'skin');// snout
  // legs (walking stride)
  leg(-3.5, -6, 2, 8); leg(3.5, -4, 2, 8); leg(-3.5, 8, 2, 8); leg(3.5, 6, 2, 8);
  // horns
  horn(0, 8.3, -16.3, 8.5, -4.5, 1.9, 26, 0.35);
  horn(0, 10, -12.3, 3.5, -1.2, 1.2, 10, 0.3);

  const col = (m, h) => {
    switch (m) {
      case 'fur': return h < 0.13 ? OAK_LOG : h < 0.23 ? BRICK : BROWN;
      case 'head': return h < 0.35 ? OAK_LOG : h < 0.45 ? GRAY : BROWN;
      case 'skin': return h < 0.7 ? GRAY : OAK_LOG;
      case 'leg': return h < 0.5 ? OAK_LOG : BROWN;
      case 'foot': return h < 0.75 ? BLACK : GRAY;
      case 'hornD': return GRAY;
      case 'horn': return h < 0.8 ? LIGHT_GRAY : GRAY;
      default: return WHITE;
    }
  };

  // emit only exposed shell + shaggy tufts + frost
  for (const [k, m] of S) {
    const [x, y, z] = k.split(',').map(Number);
    let open = false;
    for (const d of N6) if (!S.has(K(x + d[0], y + d[1], z + d[2]))) { open = true; break; }
    if (!open) continue;
    const h = hash(x, y, z, seed);
    let id = col(m, h);
    if ((m === 'fur' || m === 'head') && !S.has(K(x, y + 1, z)) && y > 9.5 * s && hash(x, y, z, seed + 5) < 0.3) id = SNOW;
    put(x, y, z, id);
    if (m === 'fur' && Math.abs(x - ox) >= 2 && y > 3 && hash(x, y, z, seed + 9) < (adult ? 0.11 : 0.06)) {
      const tx = x + Math.sign(x - ox);
      if (!S.has(K(tx, y, z)) && !S.has(K(tx, y - 1, z))) put(tx, y - 1, z, hash(x, y, z, seed + 2) < 0.5 ? OAK_LOG : BROWN);
    }
  }

  // hanging wool fringe from flanks, belly and throat
  const colMin = new Map();
  for (const [k, m] of S) {
    const [x, y, z] = k.split(',').map(Number);
    const ck = x + ',' + z, c = colMin.get(ck);
    if (!c || y < c.y) colMin.set(ck, { x, y, z, m });
  }
  for (const c of colMin.values()) {
    if (c.m !== 'fur' || c.y < 2) continue;
    const L = adult ? 1 + Math.floor(hash(c.x, 0, c.z, seed + 3) * 3) : Math.floor(hash(c.x, 0, c.z, seed + 3) * 2);
    for (let i = 1; i <= L; i++) {
      const y = c.y - i;
      if (y < 1) break;
      put(c.x, y, c.z, hash(c.x, y, c.z, seed + 4) < 0.5 ? OAK_LOG : BROWN);
    }
  }

  // eyes (+ heavy brow)
  const ey = Math.round(8.2 * s), ez = Math.round(oz - 11.5 * s);
  for (const dir of [-1, 1]) {
    for (let i = Math.ceil(8 * s); i >= 0; i--) {
      const x = ox + dir * i;
      if (S.has(K(x, ey, ez))) {
        put(x, ey, ez, BLACK);
        if (adult) { put(x, ey + 1, ez, OAK_LOG); put(x, ey + 1, ez - 1, OAK_LOG); }
        break;
      }
    }
  }
  // nostrils, mouth, frosty breath
  const front = (x, y) => {
    for (let z = Math.floor(oz - 22 * s); z <= oz; z++) if (S.has(K(x, y, z)) && S.get(K(x, y, z)) !== 'hornD') return z;
    return null;
  };
  if (adult) {
    const ny = Math.round(5.5 * s);
    for (const dx of [-1, 1]) {
      const z = front(ox + dx, ny);
      if (z !== null) {
        put(ox + dx, ny, z, BLACK);
        put(ox + dx * 2, ny - 2, z - 2, STEAM);
      }
    }
    const my = Math.round(3.8 * s);
    for (const dx of [-1, 0, 1]) {
      const z = front(ox + dx, my);
      if (z !== null) put(ox + dx, my, z, dx === 0 ? BLACK : GRAY);
    }
  } else {
    const z = front(ox, Math.round(5.5 * s));
    if (z !== null) put(ox, Math.round(5.5 * s), z, BLACK);
  }
  // small ears
  const topY = (x, z) => { for (let y = 30; y >= 0; y--) if (S.has(K(x, y, z))) return y; return null; };
  for (const dir of [-1, 1]) {
    const x = ox + dir * Math.round(2.3 * s), z = Math.round(oz - 9.5 * s);
    const ty = topY(x, z);
    if (ty !== null) {
      put(x, ty + 1, z, OAK_LOG);
      if (adult) { put(x, ty + 2, z, BROWN); put(x, ty + 1, z + 1, BROWN); }
    }
  }
  // shaggy dorsal crest over the hump
  if (adult) {
    for (let lz = -10; lz <= 4; lz++) {
      const z = Math.round(oz + lz * s);
      for (const dx of [-1, 0, 1]) {
        const ty = topY(ox + dx, z);
        if (ty === null) continue;
        const h = hash(ox + dx, ty, z, seed + 21);
        if (h < (dx === 0 ? 0.7 : 0.35)) {
          put(ox + dx, ty + 1, z, h < 0.25 ? BRICK : OAK_LOG);
          if (dx === 0 && lz < -1 && h < 0.3) put(ox, ty + 2, z, OAK_LOG);
        }
      }
    }
  }
  // tail
  const t0 = [ox, 12 * s, oz + 12 * s], t1 = [ox + (adult ? 1 : 0), 7.5 * s, oz + 14.2 * s];
  const n = adult ? 8 : 4;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    put(t0[0] + (t1[0] - t0[0]) * t, t0[1] + (t1[1] - t0[1]) * t, t0[2] + (t1[2] - t0[2]) * t, t > 0.7 ? BLACK : OAK_LOG);
  }
  if (adult) { put(t1[0], t1[1] - 1, t1[2], BLACK); put(t1[0], t1[1] - 2, t1[2], OAK_LOG); }
}

// mother (center-west) and calf trotting at her east shoulder
rhino(-3, -2, 1, 101, true);
rhino(11, -4, 0.5, 202, false);

// ---------- ground fill with budget ----------
const BUDGET = 3985;
let count = 0;
for (const v of M.values()) if (v[3] !== AIR) count++;
ground.sort((a, b) => a[2] - b[2]);
for (const [x, z] of ground) {
  if (count >= BUDGET) break;
  const n = Math.sin(x * 0.45 + z * 0.15) + Math.cos(z * 0.38 - x * 0.22) + (hash(x, 0, z, 77) - 0.5) * 0.6;
  let id = SNOW;
  if (((x + 11) / 3.6) ** 2 + ((z + 14) / 2.3) ** 2 <= 1) id = ICE;
  else if (n > 1.3) id = GRASS;
  else if (hash(x, 1, z, 78) < 0.05) id = WHITE;
  put(x, -1, z, id);
  count++;
  if (id === GRASS && count < BUDGET && hash(x, 2, z, 79) < 0.28 && !M.has(K(x, 0, z)) || (id === GRASS && M.has(K(x, 0, z)) && M.get(K(x, 0, z))[3] === AIR && hash(x, 2, z, 79) < 0.28 && count < BUDGET)) {
    put(x, 0, z, hash(x, 3, z, 80) < 0.6 ? SAND : YELLOW);
    count++;
  }
}

// trail of hoofprints pressed into the snow behind the mother
for (let k = 0; k < 4; k++) {
  const z = 14 + k * 2;
  for (const [x, zz] of [[-6, z], [-7, z], [0, z + 1], [-1, z + 1]]) {
    if (M.has(K(x, -1, zz))) put(x, -1, zz, DIRT);
  }
}
// calf's smaller prints
for (let k = 0; k < 3; k++) {
  const z = 5 + k * 2;
  for (const [x, zz] of [[10, z], [12, z + 1]]) {
    if (M.has(K(x, -1, zz))) put(x, -1, zz, DIRT);
  }
}

for (const [x, y, z, id] of M.values()) block(x, y, z, id);