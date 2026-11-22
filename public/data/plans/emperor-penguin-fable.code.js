// emperor-penguin-fable — prompt:
// an emperor penguin...

const V = new Map();
const K = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id, p) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  V.set(K(x, y, z), { x, y, z, id, p });
}
const has = (x, y, z) => V.has(K(x, y, z));
// strip hidden interior cells of one part (keeps every visible face, saves budget)
function hollow(p) {
  const s = (x, y, z) => y < 0 || V.has(K(x, y, z));
  const kill = [];
  for (const [k, c] of V) {
    if (c.p !== p) continue;
    if (s(c.x + 1, c.y, c.z) && s(c.x - 1, c.y, c.z) && s(c.x, c.y + 1, c.z) &&
        s(c.x, c.y - 1, c.z) && s(c.x, c.y, c.z + 1) && s(c.x, c.y, c.z - 1)) kill.push(k);
  }
  kill.forEach(k => V.delete(k));
}

// ================= EMPEROR PENGUIN (parent) =================
// Body faces north; head is turned ~50 degrees toward the chick at its feet (north-west),
// so the camera sees the head in three-quarter profile: beak, eye and orange ear patch.
const TH = 50 * Math.PI / 180;
const fx = -Math.sin(TH), fz = -Math.cos(TH), lx = -fz, lz = fx;
function rxAt(y) {
  const t = y / 25;
  const f = t < 0.25 ? 0.62 + 0.38 * Math.sin(t / 0.25 * Math.PI / 2)
                     : 1 - 0.56 * Math.pow((t - 0.25) / 0.75, 1.5);
  return 8.7 * f;
}
function pcol(x, y, z) {
  if (y >= 24) {
    const w = x * fx + z * fz, u = x * lx + z * lz;
    const a = Math.atan2(w, Math.abs(u));
    if (y === 24) return (a > -0.4 && a < 0.9) ? YELLOW : BLACK;
    if (y === 25) return (a > -0.5 && a < 0.7) ? (a < 0.2 ? ORANGE : YELLOW) : BLACK;
    if (y === 26) return (a > -0.6 && a < 0.5) ? ORANGE : BLACK;
    if (y === 27) return (a > -0.6 && a < 0.3) ? ORANGE : BLACK;
    if (y === 28) return (a > -0.5 && a < 0.1) ? ORANGE : BLACK;
    return BLACK;
  }
  const a = Math.atan2(-(z - 1), Math.abs(x));
  if (y >= 22) return a > -0.2 ? YELLOW : BLACK;                       // yellow upper breast
  if (y === 21) return a > 0.05 ? (((x + z) & 1) ? YELLOW : WHITE) : BLACK; // fade into white
  if (y <= 1 && a > 0.05) return LIGHT_GRAY;                           // shadowed belly fold over the feet
  return a > 0.05 ? WHITE : BLACK;
}
// torso (tapered bowling-pin profile)
for (let y = 0; y <= 25; y++) {
  const rx = rxAt(y), rz = rx * 0.82;
  for (let x = -10; x <= 10; x++) for (let z = -8; z <= 10; z++) {
    if ((x / rx) ** 2 + ((z - 1) / rz) ** 2 <= 1) put(x, y, z, pcol(x, y, z), 0);
  }
}
// head
for (let y = 22; y <= 32; y++) for (let x = -7; x <= 7; x++) for (let z = -7; z <= 7; z++) {
  const w = x * fx + z * fz, u = x * lx + z * lz, dy = y - 27;
  if ((u / 4.5) ** 2 + (dy / 4.6) ** 2 + (w / 5.0) ** 2 <= 1) put(x, y, z, pcol(x, y, z), 0);
}
// tail wedge resting on the ice
for (let x = -2; x <= 2; x++) {
  put(x, 2, 7, BLACK, 0); put(x, 2, 8, BLACK, 0);
  for (let z = 6; z <= 9; z++) if (z < 9 || Math.abs(x) < 2) put(x, 1, z, BLACK, 0);
}
for (let x = -1; x <= 1; x++) for (let z = 6; z <= 10; z++) if (z < 10 || x === 0) put(x, 0, z, BLACK, 0);
// west flipper, held against the body
for (let y = 21; y >= 8; y--) {
  const s = (21 - y) / 13;
  const hw = s < 0.5 ? 1.5 + 1.5 * s : 2.25 - 2.5 * (s - 0.5);
  const xs = Math.floor(rxAt(y)) + 1;
  for (let z = Math.round(1.5 - hw); z <= Math.round(1.5 + hw); z++) {
    put(-xs, y, z, BLACK, 0); put(-xs - 1, y, z, BLACK, 0);
  }
}
// east flipper, lifted out for balance (white underside)
for (const o of [-0.5, 0.5]) for (let s = 0; s <= 1.0001; s += 0.01) {
  const hw = s < 0.5 ? 1.5 + 1.5 * s : 2.25 - 2.5 * (s - 0.5);
  const cx = 5.5 + 8.5 * s + 0.791 * o, cy = 21 - 11 * s + 0.611 * o;
  const z0 = Math.round(1.5 - hw), z1 = Math.round(1.5 + hw);
  for (let z = z0; z <= z1; z++) {
    const under = o < 0 && s > 0.12 && s < 0.86 && z > z0;
    put(cx, cy, z, under ? WHITE : BLACK, 0);
  }
}
hollow(0);
// feet
for (const sx of [-1, 1]) {
  for (let x = 2; x <= 6; x++) for (let z = -8; z <= -4; z++) put(sx * x, 0, z, BLACK, 0);
  for (const x of [2, 4, 6]) put(sx * x, 0, -9, BLACK, 0);
  for (let x = 3; x <= 5; x++) { put(sx * x, 1, -5, BLACK, 0); put(sx * x, 1, -4, BLACK, 0); }
}
// beak: glossy dark upper mandible, orange stripe on the lower, gentle droop toward the chick
const beakLine = s => 26.7 - 0.3 * Math.max(0, s - 4.5);
for (let s = 4.4; s <= 10.4; s += 0.2) {
  const px = fx * s, pz = fz * s, py = beakLine(s);
  const r = Math.max(0.75, 1.3 - 0.11 * (s - 4.4));
  for (let x = Math.floor(px - 2); x <= Math.ceil(px + 2); x++)
    for (let y = Math.floor(py - 2); y <= Math.ceil(py + 2); y++)
      for (let z = Math.floor(pz - 2); z <= Math.ceil(pz + 2); z++) {
        if ((x - px) ** 2 + (y - py) ** 2 + (z - pz) ** 2 > r * r) continue;
        const sc = x * fx + z * fz;
        if (sc < 4.2 && has(x, y, z)) continue;
        put(x, y, z, (y >= beakLine(sc) || sc > 8.8) ? OBSIDIAN : ORANGE, 0);
      }
}
// eyes: find the head-surface cell along each eye direction
for (const su of [-1, 1]) {
  const dxx = su * 0.62 * lx + 0.76 * fx, dzz = su * 0.62 * lz + 0.76 * fz, dyy = 0.2;
  let last = null;
  for (let r = 0; r < 7; r += 0.05) {
    const c = [Math.round(dxx * r), Math.round(27 + dyy * r), Math.round(dzz * r)];
    if (has(c[0], c[1], c[2])) last = c;
  }
  if (last) put(last[0], last[1], last[2], IRON, 0);
}

// ================= CHICKS =================
function chick(CX, CZ, p, BY, RY, HY) {
  for (let y = 0; y <= 9; y++) for (let x = -5; x <= 5; x++) for (let z = -5; z <= 5; z++) {
    if ((x / 3.9) ** 2 + ((y - BY) / RY) ** 2 + (z / 3.6) ** 2 <= 1) {
      const a = Math.atan2(-z, Math.abs(x));
      put(CX + x, y, CZ + z, a > -0.3 ? LIGHT_GRAY : GRAY, p);
    }
  }
  for (let dy = -3; dy <= 3; dy++) for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++) {
    if (x * x + dy * dy + z * z <= 9.61) {
      let c = BLACK;
      if (dy >= -1 && dy <= 1 && z <= -1) c = WHITE;          // white face mask
      put(CX + x, HY + dy, CZ + z, c, p);
    }
  }
  hollow(p);
  put(CX - 1, HY + 1, CZ - 2, OBSIDIAN, p); put(CX + 1, HY + 1, CZ - 2, OBSIDIAN, p); // eyes
  put(CX, HY, CZ - 3, BLACK, p); put(CX, HY, CZ - 4, BLACK, p);                       // beak
  for (const sx of [-1, 1]) {
    for (let y = HY - 7; y <= HY - 4; y++) for (let z = -1; z <= 1; z++) put(CX + sx * 4, y, CZ + z, GRAY, p);
    for (let y = HY - 8; y <= HY - 6; y++) for (let z = -1; z <= 0; z++) put(CX + sx * 5, y, CZ + z, GRAY, p);
    put(CX + sx * 1, 0, CZ - 2, BLACK, p); put(CX + sx * 2, 0, CZ - 2, BLACK, p);
    put(CX + sx * 1, 0, CZ - 3, BLACK, p); put(CX + sx * 2, 0, CZ - 3, BLACK, p);
  }
}
chick(-10, -8, 1, 4, 4.6, 11);     // older chick the parent is looking at
chick(12, -5, 2, 3.5, 4.0, 10);    // smaller sibling tucked under the raised flipper

// ================= ICE FLOE BASE =================
const F = new Set();
const disks = [[1, 0, 12.3], [-10, -8, 6.2], [12, -5, 5.6], [3, -15, 5.6], [12, 7, 4.2], [-11, 7, 4.2]];
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  let best = -9;
  for (const [cx, cz, r] of disks) {
    const d = Math.hypot(x - cx, z - cz);
    const ang = Math.atan2(z - cz, x - cx);
    const rr = r + 0.7 * Math.sin(ang * 5 + cx) + 0.4 * Math.sin(ang * 9 + cz);
    best = Math.max(best, rr - d);
  }
  if (best >= 0) {
    F.add(x + ',' + z);
    put(x, -1, z, best < 1.1 && ((x * 7 + z * 13) & 3) !== 0 ? ICE : SNOW, 3);
  }
}
// fishing hole in the foreground
for (let x = -2; x <= 8; x++) for (let z = -20; z <= -10; z++) {
  const d = Math.hypot(x - 3, z + 15);
  if (d <= 2.4) { put(x, -1, z, WATER, 3); put(x, -2, z, BLUE, 3); }
  else if (d <= 3.5) put(x, -1, z, ICE, 3);
}
// a fish left on the ice
const fish = [[6, -12, LIGHT_BLUE], [7, -12, IRON], [8, -12, IRON], [9, -12, IRON], [10, -11, LIGHT_BLUE], [10, -13, LIGHT_BLUE]];
for (const [x, z, id] of fish) {
  put(x, 0, z, id, 4);
  if (!has(x, -1, z)) put(x, -1, z, SNOW, 4);
  F.add(x + ',' + z);
}
// ice shards behind the family (background separation)
function spike(cx, cz, h, r, lean) {
  for (let y = -1; y <= h; y++) {
    const rr = r * (1 - (y + 1) / (h + 1.5));
    const off = Math.round(Math.max(0, y) * lean);
    for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++)
      if (x * x + z * z <= rr * rr) put(cx + x + off, y, cz + z, ICE, 4);
  }
}
spike(12, 7, 11, 2.8, 0.15); spike(-11, 7, 10, 2.7, -0.15);
spike(14, 4, 4, 1.5, 0.2); spike(10, 10, 5, 1.6, 0);
spike(-13, 4, 3, 1.4, -0.2); spike(-9, 10, 4, 1.5, 0);
// snow drifts
function drift(cx, cz, r) {
  for (let x = -5; x <= 5; x++) for (let z = -5; z <= 5; z++) {
    const d = Math.hypot(x, z * 1.3);
    if (!F.has((cx + x) + ',' + (cz + z))) continue;
    if (d <= r && !has(cx + x, 0, cz + z)) put(cx + x, 0, cz + z, SNOW, 5);
    if (d <= r - 1.7 && !has(cx + x, 1, cz + z)) put(cx + x, 1, cz + z, SNOW, 5);
  }
}
drift(-5, 9, 3.6); drift(5, 10, 3.2); drift(-2, -11, 2.4); drift(-15, -6, 2.4); drift(9, 2, 2.2);

// ================= EMIT (solids first, most important parts first, hard budget cap) =================
const cells = [...V.values()].sort((a, b) => a.p - b.p);
const placed = new Set();
let n = 0;
for (const c of cells) {
  if (n >= 3960) break;
  block(c.x, c.y, c.z, c.id);
  placed.add(K(c.x, c.y, c.z));
  n++;
}
// clear trees standing on the floe and in the sight-line north of it (never overlaps solids)
for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
  let y0 = 99, y1 = 7;
  if (F.has(x + ',' + z)) { y0 = 0; if (z < -16) y1 = 8; }
  else if (x >= -15 && x <= 13 && z <= -1) { y0 = z < -16 ? 2 : 1; if (z < -16) y1 = 8; }
  for (let y = y0; y <= y1; y++) if (!placed.has(K(x, y, z))) block(x, y, z, AIR);
}
// leftover stumps in front
[[1, -13], [3, -10], [-1, -10], [-6, -8], [-7, -5], [7, -2], [8, -1]].forEach(([x, z]) => {
  if (!placed.has(K(x, 0, z))) block(x, 0, z, AIR);
});