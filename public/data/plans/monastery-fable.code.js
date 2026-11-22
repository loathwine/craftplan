// monastery-fable — prompt:
// a Tibetan monastery on a snowy peak...

// Tibetan monastery on a snowy peak — white lower palace, red upper palace, gilded roofs,
// cliff-hugging tower, hillside houses, great stair, gate, chorten, prayer flags.
// Self-budgeting: builds at decreasing detail levels until it fits under the block budget.

function rnd(x, z, s) { const v = Math.sin(x * 12.9898 + z * 78.233 + (s || 0) * 37.719) * 43758.5453; return v - Math.floor(v); }
function inb(x, y, z) { return x >= -22 && x <= 22 && z >= -22 && z <= 22 && y >= -8 && y <= 33; }
const key = (x, y, z) => x + ',' + y + ',' + z;
const P = 12; // plateau surface level
function rectD(x, z) { const dx = Math.max(-8 - x, 0, x - 8), dz = Math.max(-2 - z, 0, z - 8); return Math.hypot(dx, dz); }
const isStair = (x, z) => Math.abs(x) <= 2 && z <= -5 && z >= -16;
const ground = (x, z) => (x > 4 && z > 4) ? -2 : -1;
function ring(x1, z1, x2, z2, cb) {
  for (let x = x1; x <= x2; x++) for (let z = z1; z <= z2; z++) if (x === x1 || x === x2 || z === z1 || z === z2) cb(x, z);
}
function isWin(x, z, x1, z1, x2, z2) {
  const onX = (x === x1 || x === x2), onZ = (z === z1 || z === z2);
  if (onX && onZ) return false;
  return onZ ? ((x - x1) % 2 === 1) : ((z - z1) % 2 === 1);
}

function build(lv) {
  const M = new Map(), A = new Set(), hCache = new Map();
  const JIT = lv >= 3 ? 0 : 1;
  const CRAG = lv < 2, SHOULDER = lv < 0;

  function put(x, y, z, id) { if (inb(x, y, z)) M.set(key(x, y, z), [x, y, z, id]); }
  function air(x, y, z) { if (inb(x, y, z)) A.add(key(x, y, z)); }
  function box(x1, y1, z1, x2, y2, z2, id) {
    for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) put(x, y, z, id);
  }
  const lit = (x, y, z, p) => rnd(x * 3 + y * 5, z * 7 - y, 5) < p ? GLOWSTONE : BLACK;

  // ---------------- MOUNTAIN HEIGHTMAP ----------------
  function H(x, z) {
    const k = x + ',' + z;
    if (hCache.has(k)) return hCache.get(k);
    let h = null;
    const d = rectD(x, z);
    if (d <= 2) h = P;
    else {
      const a = Math.atan2(z - 3, x);
      const nb = Math.max(0, -Math.sin(a));
      const dm = 9.3 + 1.5 * Math.sin(3 * a + 1) + 1.0 * Math.sin(5 * a + 2.3) + 3.0 * nb * nb;
      const t = (d - 2) / (dm - 2);
      if (t < 1) {
        const f = Math.floor(-1 + 13 * Math.pow(1 - t, 1.35) + (rnd(x, z, 1) - 0.5) * JIT);
        if (f >= 0) h = Math.min(P - 1, f);
      }
      if (CRAG) {
        // true summit crag rising behind the monastery (south-east)
        let c = 23 - 3.2 * Math.hypot(x - 11, z - 14) + (rnd(x, z, 2) - 0.5) * 1.2;
        if (SHOULDER) c = Math.max(c, 18 - 3.0 * Math.hypot(x - 15, z - 10) + (rnd(x, z, 6) - 0.5) * 1.2);
        const hc = Math.floor(c);
        if (hc >= 1 && (h === null || hc > h)) h = hc;
      }
    }
    if (isStair(x, z)) h = Math.abs(x) === 2 ? 17 + z : 16 + z;
    hCache.set(k, h);
    return h;
  }
  const Hg = (x, z) => {
    if (x < -22 || x > 22 || z < -22 || z > 22) return ground(x, z);
    const h = H(x, z);
    return h === null ? ground(x, z) : h;
  };

  // mountain shell: snow ledges over stone cliffs, great stair up the north face
  for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
    const h = H(x, z);
    if (h === null) continue;
    for (let y = Math.max(h + 1, 1); y <= 8; y++) air(x, y, z); // trees poking through the slope
    if (x >= -7 && x <= 7 && z >= -1 && z <= 7) continue;       // hidden under the palace
    const lo = Math.min(h, Math.min(Hg(x - 1, z), Hg(x + 1, z), Hg(x, z - 1), Hg(x, z + 1)) + 1);
    const st = isStair(x, z), par = st && Math.abs(x) === 2;
    for (let y = lo; y <= h; y++) {
      let id;
      if (y === h) {
        if (par) id = BRICK;
        else if (st) id = LIGHT_GRAY;
        else if (h === P && Math.abs(x) <= 2 && z < -2) id = LIGHT_GRAY;
        else id = (h < 9 && rnd(x, z, 3) < 0.08) ? STONE : SNOW;
      } else if (par) id = WHITE;
      else { const r = rnd(x + y * 7, z - y * 3, 4); id = r < 0.2 ? COBBLE : r < 0.36 ? GRAY : STONE; }
      put(x, y, z, id);
    }
  }

  // clear the forest from the approach (gate, path, chorten)
  for (let x = -5; x <= 17; x++) for (let z = -22; z <= -13; z++) for (let y = (x < -1 ? 2 : 1); y <= 8; y++) air(x, y, z);
  air(8, 0, -20); air(14, 0, -22);

  // ---------------- TIER 1 : white lower palace ----------------
  ring(-8, -2, 8, 8, (x, z) => {
    for (let y = 13; y <= 18; y++) {
      if (x === -8 && z >= 2 && z <= 6) continue;            // hidden by west tower
      if (x === 8 && z >= 0 && z <= 6 && y <= 16) continue;  // hidden by east wing
      let id = WHITE;
      if (y === 18) id = BROWN;
      else if ((y === 14 || y === 16) && isWin(x, z, -8, -2, 8, 8)) id = lit(x, y, z, 0.07);
      put(x, y, z, id);
    }
  });
  for (let x = -7; x <= 7; x++) for (let z = -1; z <= 7; z++) if (!(x >= -5 && x <= 5 && z >= 0 && z <= 6)) put(x, 18, z, SNOW);
  [[-8, -2], [8, -2], [-8, 8], [8, 8]].forEach(([x, z]) => { put(x, 19, z, GOLD); put(x, 20, z, GOLD); });
  // main door + golden portico
  box(-2, 13, -2, 2, 15, -2, RED);
  box(-1, 13, -2, 1, 15, -2, BROWN);
  put(0, 13, -2, BLACK); put(0, 14, -2, BLACK); put(0, 15, -2, GOLD);
  box(-2, 16, -2, 2, 16, -2, GOLD);
  box(-3, 13, -4, -3, 15, -4, RED); box(3, 13, -4, 3, 15, -4, RED);
  box(-3, 16, -4, 3, 16, -3, GOLD);
  box(-2, 17, -3, 2, 17, -3, RED);
  // prayer wheels along the front wall
  [-7, -5, 5, 7].forEach(x => put(x, 13, -3, COPPER));
  // butter-lamp braziers + incense burner in the forecourt
  put(-5, 13, -4, COBBLE); put(-5, 14, -4, FIRE);
  put(5, 13, -4, COBBLE); put(5, 14, -4, FIRE);
  put(8, 13, -4, WHITE); put(8, 14, -4, WHITE); put(8, 15, -4, STEAM);

  // ---------------- TIER 2 : red palace ----------------
  ring(-5, 0, 5, 6, (x, z) => {
    for (let y = 19; y <= 24; y++) {
      let id = RED;
      if (y === 24) id = ((x + z) & 1) === 0 ? GOLD : BROWN;
      else if (y === 23) id = BROWN;
      else if ((y === 20 || y === 22) && isWin(x, z, -5, 0, 5, 6)) id = lit(x, y, z, 0.2);
      put(x, y, z, id);
    }
  });
  for (let x = -4; x <= 4; x++) for (let z = 1; z <= 5; z++) if (!(x >= -3 && x <= 3 && z >= 2 && z <= 4)) put(x, 24, z, SNOW);
  [[-5, 0], [5, 0], [-5, 6], [5, 6]].forEach(([x, z]) => { put(x, 25, z, GOLD); put(x, 26, z, GOLD); });
  // giant thangka hanging on the facade
  box(-1, 19, -1, 1, 19, -1, ORANGE);
  box(-1, 20, -1, 1, 22, -1, YELLOW);
  put(0, 20, -1, RED); put(0, 21, -1, BLUE); put(0, 22, -1, RED);
  box(-1, 23, -1, 1, 23, -1, GOLD);

  // ---------------- TIER 3 : golden-roof pavilion ----------------
  ring(-3, 2, 3, 4, (x, z) => {
    const corner = Math.abs(x) === 3 && z !== 3;
    put(x, 25, z, YELLOW);
    let id = RED;
    if (!corner) {
      if (z === 2) id = x === 0 ? BLACK : (Math.abs(x) === 2 ? GLOWSTONE : RED);
      else if (z === 4) id = (Math.abs(x) % 2 === 0) ? BLACK : RED;
      else id = BLACK;
    }
    put(x, 26, z, id);
    put(x, 27, z, BROWN);
  });
  for (let x = -4; x <= 4; x++) for (let z = 1; z <= 5; z++) if (!(x >= -2 && x <= 2 && z === 3)) put(x, 28, z, GOLD);
  [[-4, 1], [4, 1], [-4, 5], [4, 5]].forEach(([x, z]) => put(x, 29, z, GOLD));
  box(-3, 29, 2, 3, 29, 4, GOLD);
  box(-2, 30, 3, 2, 30, 3, GOLD);
  put(-2, 31, 3, GOLD); put(2, 31, 3, GOLD);
  box(0, 31, 3, 0, 33, 3, GOLD);

  // ---------------- WEST TOWER (rises straight from the cliff) ----------------
  ring(-13, 2, -9, 6, (x, z) => {
    for (let y = Hg(x, z) + 1; y <= 22; y++) {
      if (x === -9 && z > 2 && z < 6 && y <= 18) continue;
      const centre = (x === -11) || (z === 4 && x === -13);
      let id = WHITE;
      if (y === 22) id = ((x + z) & 1) === 0 ? GOLD : BROWN;
      else if (y === 19) id = BROWN;
      else if (y >= 20) id = (centre && y === 21) ? (z === 6 ? BLACK : GLOWSTONE) : RED;
      else if (centre && (y === 16 || y === 14 || y === 11 || y === 8)) id = BLACK;
      put(x, y, z, id);
    }
  });
  ring(-14, 1, -8, 7, (x, z) => put(x, 23, z, GOLD));
  ring(-13, 2, -9, 6, (x, z) => put(x, 24, z, GOLD));
  box(-12, 25, 3, -10, 25, 5, GOLD);
  put(-11, 26, 4, GOLD); put(-11, 27, 4, GOLD);

  // ---------------- EAST WING ----------------
  if (lv < 3) {
    ring(9, 0, 12, 6, (x, z) => {
      if (x === 9 && z > 0 && z < 6) return;
      for (let y = Hg(x, z) + 1; y <= 16; y++) {
        let id = WHITE;
        if (y === 16) id = BROWN;
        else if ((y === 14 || y === 11) && isWin(x, z, 9, 0, 12, 6)) id = BLACK;
        put(x, y, z, id);
      }
    });
    box(9, 16, 1, 11, 16, 5, SNOW);
  }

  // ---------------- HILLSIDE HOUSES ----------------
  function house(x1, z1, x2, z2, top, wall, frieze) {
    ring(x1, z1, x2, z2, (x, z) => {
      for (let y = Hg(x, z) + 1; y <= top; y++) {
        let id = wall;
        if (y === top) id = frieze;
        else if ((y === top - 2 || y === top - 4) && isWin(x, z, x1, z1, x2, z2)) id = lit(x, y, z, 0.15);
        put(x, y, z, id);
      }
    });
    for (let x = x1 + 1; x < x2; x++) for (let z = z1 + 1; z < z2; z++) put(x, top, z, SNOW);
  }
  if (lv < 3) house(-10, -9, -5, -6, 11, RED, GOLD);     // small red shrine
  if (lv < 2) house(4, -11, 8, -8, 9, WHITE, BROWN);     // monks' quarters by the stair
  if (lv < 1) house(12, -6, 16, -3, 9, WHITE, BROWN);    // east slope
  if (lv < 0) house(-17, -3, -14, 0, 8, WHITE, BROWN);   // west slope

  // ---------------- GATE + PATH ----------------
  box(-1, 0, -22, 1, 0, -17, LIGHT_GRAY);
  box(-3, 0, -18, -3, 3, -18, RED); box(3, 0, -18, 3, 3, -18, RED);
  box(-4, 4, -18, 4, 4, -18, BROWN);
  box(-4, 5, -19, 4, 5, -17, GOLD);
  box(-3, 6, -18, 3, 6, -18, GOLD);
  put(0, 7, -18, GOLD);
  put(-4, 0, -17, COBBLE); put(-4, 1, -17, FIRE);
  put(4, 0, -17, COBBLE); put(4, 1, -17, FIRE);

  // ---------------- CHORTEN (stupa) ----------------
  function chorten(cx, cy, cz) {
    ring(cx - 3, cz - 3, cx + 3, cz + 3, (x, z) => put(x, cy, z, LIGHT_GRAY));
    ring(cx - 2, cz - 2, cx + 2, cz + 2, (x, z) => put(x, cy + 1, z, WHITE));
    box(cx - 1, cy + 2, cz - 1, cx + 1, cy + 2, cz + 1, WHITE);
    for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) for (let dz = -2; dz <= 2; dz++) {
      const q = dx * dx + dy * dy + dz * dz;
      if (q <= 4.5 && q > 0) put(cx + dx, cy + 4 + dy, cz + dz, WHITE);
    }
    put(cx, cy + 4, cz - 2, GOLD);
    put(cx, cy + 7, cz, RED);
    box(cx, cy + 8, cz, cx, cy + 10, cz, GOLD);
  }
  chorten(11, 0, -18);
  // juniper-incense burner beside the stair foot
  put(6, 0, -15, WHITE); put(6, 1, -15, WHITE); put(6, 2, -15, STEAM);

  // ---------------- PRAYER FLAGS ----------------
  const FL = [BLUE, WHITE, RED, GREEN, YELLOW];
  function flags(x1, y1, z1, x2, y2, z2, sag) {
    const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1, z2 - z1) * 3);
    let last = '', i = 0;
    for (let s = 0; s <= n; s++) {
      const t = s / n;
      const x = Math.round(x1 + (x2 - x1) * t);
      const y = Math.round(y1 + (y2 - y1) * t - sag * Math.sin(Math.PI * t));
      const z = Math.round(z1 + (z2 - z1) * t);
      const k = key(x, y, z);
      if (k === last) continue;
      last = k;
      if (!M.has(k)) put(x, y, z, FL[i++ % 5]);
    }
  }
  function pole(x, z, y1, y2) { for (let y = y1; y <= y2; y++) put(x, y, z, OAK_LOG); put(x, y2 + 1, z, GOLD); }
  if (lv < 3) {
    pole(-13, -15, 1, 10);
    pole(-20, -4, 0, 9);
    flags(5, 27, 0, 11, 11, -18, 2);       // red palace -> chorten
    flags(-5, 27, 0, -13, 11, -15, 2);     // red palace -> north-west pole
    flags(-11, 28, 4, -20, 10, -4, 2);     // tower -> west pole
    flags(4, 6, -18, 10, 10, -18, 1);      // gate -> chorten
    if (CRAG) {
      const ct = Hg(11, 14);
      pole(11, 14, ct + 1, ct + 2);
      flags(5, 27, 6, 11, ct + 3, 14, 2);  // red palace -> summit
    }
  }

  return { M, A };
}

let out = null;
for (let lv = -1; lv <= 3; lv++) {
  out = build(lv);
  if (out.M.size <= 3950) break;
}
out.M.forEach(v => block(v[0], v[1], v[2], v[3]));
out.A.forEach(k => {
  if (!out.M.has(k)) { const p = k.split(',').map(Number); block(p[0], p[1], p[2], AIR); }
});