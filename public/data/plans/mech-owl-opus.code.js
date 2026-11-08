// mech-owl-opus — prompt:
// a giant mechanical owl...

function S(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  V.set(k, id);
  if (OPTMODE) OPT.push(k);
}
const V = new Map();
const OPT = [];
let OPTMODE = false;
const md = (a, n) => ((a % n) + n) % n;
function has(x, y, z) { return V.has(Math.round(x) + ',' + Math.round(y) + ',' + Math.round(z)); }
function inE(e, x, y, z, s) {
  const a = (x - e.cx) / e.rx, b = (y - e.cy) / e.ry, c = (z - e.cz) / e.rz;
  return a * a + b * b + c * c <= (s || 1);
}
function shell(e, col, skip) {
  for (let x = Math.floor(e.cx - e.rx) - 1; x <= Math.ceil(e.cx + e.rx) + 1; x++)
    for (let y = Math.floor(e.cy - e.ry) - 1; y <= Math.ceil(e.cy + e.ry) + 1; y++)
      for (let z = Math.floor(e.cz - e.rz) - 1; z <= Math.ceil(e.cz + e.rz) + 1; z++) {
        if (!inE(e, x, y, z)) continue;
        if (skip && skip(x, y, z)) continue;
        if (inE(e, x + 1, y, z) && inE(e, x - 1, y, z) && inE(e, x, y + 1, z) &&
            inE(e, x, y - 1, z) && inE(e, x, y, z + 1) && inE(e, x, y, z - 1)) continue;
        S(x, y, z, col(x, y, z));
      }
}
function L3(a, b, c, d, e, f, id) {
  const n = Math.max(Math.abs(d - a), Math.abs(e - b), Math.abs(f - c)) || 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    S(a + (d - a) * t, b + (e - b) * t, c + (f - c) * t, typeof id === 'function' ? id(i, n) : id);
  }
}
function gearXY(cx, cy, z, r, teeth, ringCol, spokeCol, hubCol, toothCol, ringW) {
  const R = Math.ceil(r) + 2;
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) {
    const d = Math.hypot(dx, dy);
    if (d > r + 0.3) continue;
    let c = null;
    if (d <= Math.max(0.8, r * 0.25)) c = hubCol;
    else if (d >= r - ringW) c = ringCol;
    else {
      const th = Math.atan2(dy, dx);
      for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3;
        if (Math.cos(th - a) > 0 && Math.abs(d * Math.sin(th - a)) < 0.6) c = spokeCol;
      }
    }
    if (c !== null) S(cx + dx, cy + dy, z, c);
  }
  for (let k = 0; k < teeth; k++) {
    const a = (k + 0.5) * 2 * Math.PI / teeth;
    for (let rr = r + 0.6; rr <= r + 1.5; rr += 0.5) S(cx + rr * Math.cos(a), cy + rr * Math.sin(a), z, toothCol);
  }
}

// ---------- site prep: clear trees in front of and around the owl ----------
cube(-16, 1, -22, 22, 9, 14, AIR);
[[1,-7],[4,-3],[1,-13],[18,-13],[-1,-10],[3,-10],[17,-11],[-6,-8],[-7,-5],[7,-2],[-6,-1],[8,-1],
 [-15,0],[-6,1],[0,1],[-15,2],[8,3],[15,3],[-7,4],[-7,5],[-2,7],[-10,8],[-7,8],[-6,9],[18,9],
 [12,11],[-5,13],[8,-20],[22,-15]].forEach(([x, z]) => block(x, 0, z, AIR));

// ---------- clockwork gear platform ----------
for (let x = -11; x <= 11; x++) for (let z = -8; z <= 14; z++) {
  const d = Math.hypot(x, z - 3);
  if (d <= 10 && d > 7.2) S(x, -1, z, COBBLE);
  if (d <= 8.2) {
    let c = GRAY;
    if (d > 7.2) c = GOLD;
    else if (d <= 2) c = OBSIDIAN;
    else if (Math.abs(x) <= 0.5 || Math.abs(z - 3) <= 0.5 || Math.abs(Math.abs(x) - Math.abs(z - 3)) <= 0.5) c = IRON;
    else if (md(x + z, 2) === 0) c = LIGHT_GRAY;
    S(x, 0, z, c);
  }
}
for (let k = 0; k < 18; k++) {
  const a = (k + 0.5) * 2 * Math.PI / 18;
  for (const r of [8.9, 9.6]) S(r * Math.cos(a), 0, 3 + r * Math.sin(a), COPPER);
}
for (const s of [-1, 1]) {
  for (let y = 1; y <= 3; y++) S(s * 6, y, -2, IRON);
  S(s * 6, 4, -2, GLOWSTONE);
  S(s * 6, 5, -2, OBSIDIAN);
}

// ---------- body & head ----------
const B = { cx: 0, cy: 12, cz: 4, rx: 7.5, ry: 10.5, rz: 6.5 };
const H = { cx: 0, cy: 25, cz: 3, rx: 8, ry: 7, rz: 7 };
shell(B, (x, y, z) => {
  if (z <= 0 && y >= 4) {
    const row = Math.floor(y / 2);
    if (md(y, 2) === 0 && md(x + row, 2) === 0) return GOLD;
    return IRON;
  }
  if (md(y, 4) === 1 && md(x + z, 2) === 0) return IRON;
  if (y <= 4) return BROWN;
  return COPPER;
}, (x, y, z) => inE(H, x, y, z, 0.85));
shell(H, (x, y, z) => {
  if (y >= 30 && md(x, 2) === 0) return GOLD;
  if (md(y, 3) === 0 && md(x + z, 2) === 0) return IRON;
  return COPPER;
}, (x, y, z) => inE(B, x, y, z, 0.85));

// ---------- facial disc ----------
function surfZ(x, y) {
  const t = 1 - (x / H.rx) ** 2 - ((y - H.cy) / H.ry) ** 2;
  return t <= 0 ? null : H.cz - H.rz * Math.sqrt(t);
}
for (let x = -9; x <= 9; x++) for (let y = 18; y <= 32; y++) {
  let d = Math.min(Math.hypot(x + 4, y - 26), Math.hypot(x - 4, y - 26));
  if (Math.abs(x) <= 2 && y >= 20 && y <= 27) d = Math.min(d, 3);
  if (d > 5.3) continue;
  const sz = surfZ(x, y); if (sz === null) continue;
  const z0 = Math.round(sz);
  const c = d > 4.4 ? BROWN : MARBLE;
  S(x, y, z0 - 1, c); S(x, y, z0, c);
}
for (const s of [-1, 1]) for (let k = 0; k <= 6; k++) {
  const x = s * (1 + k), y = 29 + Math.floor(k / 2);
  const sz = surfZ(x, y); if (sz === null) continue;
  const z0 = Math.round(sz);
  S(x, y, z0 - 2, OBSIDIAN); S(x, y, z0 - 1, OBSIDIAN);
}
// lens eyes
for (const ex of [-4, 4]) {
  const ey = 26;
  for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) {
    const d = Math.hypot(dx, dy);
    if (d > 3.25) continue;
    const x = ex + dx, y = ey + dy;
    if (d > 2.5) {
      S(x, y, -6, (dx === 0 || dy === 0) ? IRON : GOLD);
      S(x, y, -5, GOLD);
    } else if (d <= 1.01) S(x, y, -5, BLACK);
    else S(x, y, -5, LAVA);
    for (let z = -4; z <= 2; z++) { if (has(x, y, z)) break; S(x, y, z, d > 2.5 ? IRON : BLACK); }
  }
}
// hooked beak
[[0,26,-6],[0,25,-6],[-1,24,-6],[0,24,-6],[1,24,-6],[0,24,-7],[-1,23,-6],[0,23,-6],[1,23,-6],
 [0,23,-7],[0,23,-8],[0,22,-6],[0,22,-7],[0,22,-8],[0,21,-7],[0,21,-8]].forEach(([x, y, z]) => {
  S(x, y, z, GOLD);
  for (let zz = z + 1; zz <= 1; zz++) { if (has(x, y, zz)) break; S(x, y, zz, GOLD); }
});
S(0, 20, -8, OBSIDIAN); S(0, 20, -7, OBSIDIAN);

// ---------- ear tufts ----------
for (const s of [-1, 1]) {
  [[29,3,7,1,5],[30,4,7,1,4],[31,5,8,1,4],[32,6,8,2,3],[33,7,8,2,3]].forEach(([y, x0, x1, z0, z1]) => {
    for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++)
      S(s * x, y, z, z === z0 ? GOLD : (x === x1 ? OBSIDIAN : COPPER));
  });
}

// ---------- chest clock dial ----------
for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) {
  const d = Math.hypot(dx, dy);
  if (d > 3.25) continue;
  const x = dx, y = 13 + dy;
  let c = MARBLE;
  if (d > 2.5) c = GOLD;
  else if (d === 0) c = OBSIDIAN;
  else if (d === 2 && (dx === 0 || dy === 0)) c = BLACK;
  S(x, y, -3, c);
  for (let z = -2; z <= 1; z++) { if (has(x, y, z)) break; S(x, y, z, IRON); }
}
S(0, 14, -4, BLACK); S(0, 15, -4, BLACK);
S(1, 12, -4, BLACK); S(2, 11, -4, BLACK);

// ---------- legs & talons ----------
for (const s of [-1, 1]) {
  const f = s * 3;
  for (const x of [s * 2, s * 3]) for (const z of [1, 2]) for (let y = 1; y <= 4; y++)
    S(x, y, z, y === 3 ? OBSIDIAN : IRON);
  for (const x of [f - 1, f, f + 1]) {
    S(x, 1, 0, IRON); S(x, 1, -1, IRON); S(x, 1, -2, OBSIDIAN);
  }
  S(f, 1, 3, IRON); S(f, 1, 4, OBSIDIAN);
}

// ---------- folded left wing ----------
const W = { cx: -5, cy: 12, cz: 5.5, rx: 4, ry: 9.5, rz: 7.5 };
shell(W, (x, y, z) => {
  if (y >= 17) return md(x + y + z, 2) === 0 ? GOLD : COPPER;
  if (y >= 9) return md(z, 3) === 0 ? BROWN : COPPER;
  return md(z, 2) === 0 ? IRON : LIGHT_GRAY;
}, (x, y, z) => x > -6 || inE(B, x, y, z, 0.95));
for (const z of [8, 10, 12]) L3(-7, 4, z, -6, 1, z + 2, IRON);

// ---------- spread right wing ----------
const P = [[6, 18], [13, 26], [19, 30], [22, 33]];
function boneY(x) {
  for (let i = 0; i < P.length - 1; i++) {
    const [x0, y0] = P[i], [x1, y1] = P[i + 1];
    if (x <= x1) return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
  }
  return P[P.length - 1][1];
}
for (let x = 6; x <= 22; x++) {
  const top = Math.round(boneY(x)) - 1;
  const len = 4 + (x - 8) * 1.15 + (md(x, 2) === 0 ? 1.5 : 0);
  const bot = Math.max(3, Math.round(top - len));
  for (let y = bot; y <= top; y++) {
    const d = top - y;
    let c = d <= 1 ? GOLD : d <= 5 ? COPPER : (md(x, 2) === 0 ? IRON : LIGHT_GRAY);
    if (d > 5 && y === bot) c = OBSIDIAN;
    S(x, y, 6, c); S(x, y, 7, c);
  }
}
for (let i = 0; i < P.length - 1; i++) {
  const [x0, y0] = P[i], [x1, y1] = P[i + 1];
  L3(x0, y0, 5, x1, y1, 5, GRAY);
  L3(x0, y0, 4, x1, y1, 4, IRON);
  L3(x0, y0 - 1, 4, x1, y1 - 1, 4, IRON);
}
gearXY(7, 18, 3, 2.6, 8, GOLD, GOLD, OBSIDIAN, GOLD, 1);
gearXY(13, 25, 3, 1.6, 6, COPPER, COPPER, OBSIDIAN, COPPER, 1);
S(19, 29, 3, GOLD); S(19, 30, 3, OBSIDIAN); S(20, 29, 3, GOLD); S(18, 29, 3, GOLD);
L3(7, 12, 4, 12, 23, 4, (i, n) => i < n / 2 ? COPPER : IRON);
S(7, 12, 3, OBSIDIAN);

// ---------- tail fan ----------
for (let i = -3; i <= 3; i++) {
  const c = md(i, 2) === 0 ? IRON : COPPER;
  L3(i, 6, 9, i * 1.6, 1, 16, c);
  L3(i, 7, 9, i * 1.6, 2, 16, c);
}

// ---------- exhaust stacks on the back ----------
for (const s of [-1, 1]) {
  for (let y = 9; y <= 27; y++) S(s * 3, y, 10, md(y, 4) === 0 ? IRON : COPPER);
  for (const y of [9, 16, 24]) S(s * 3, y, 9, IRON);
  S(s * 3, 28, 10, OBSIDIAN);
}

// ---------- background clockwork (droppable if over budget) ----------
for (let y = -1; y <= 6; y++) S(-15, y, 13, IRON);
OPTMODE = true;
for (let x = -9; x <= 9; x++) for (let z = -6; z <= 12; z++) {
  if (Math.hypot(x, z - 3) <= 7.2) S(x, -1, z, COBBLE);
}
gearXY(-10, 17, 13, 3, 8, GOLD, GOLD, OBSIDIAN, GOLD, 1);
gearXY(-15, 7, 13, 6, 12, BROWN, COPPER, GOLD, BROWN, 1.4);
OPTMODE = false;
gearXY(-15, 7, 12, 6, 12, COPPER, IRON, GOLD, COPPER, 1.4);

// ---------- budget guard ----------
let oi = 0;
while (V.size > 3940 && oi < OPT.length) { V.delete(OPT[oi]); oi++; }

// ---------- emit ----------
for (const [k, id] of V) {
  const [x, y, z] = k.split(',').map(Number);
  block(x, y, z, id);
}
block(-9, 33, 2, ELECTRIC);
block(9, 33, 2, ELECTRIC);
block(13, 25, 2, ELECTRIC);
block(-3, 29, 10, STEAM);
block(3, 29, 10, STEAM);