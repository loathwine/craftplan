// reindeer-fable — prompt:
// a reindeer with giant antlers...

// NOTE: sandbox test-run was blocked by permissions, so this code is hand-verified only (not executed).
// Reindeer with giant antlers — prancing in a snowy clearing, facing north (angled slightly east).
const TH = 22 * Math.PI / 180, CS = Math.cos(TH), SN = Math.sin(TH);
const OX = -1, OZ = 3;
const LIMIT = 3960;
const M = new Map();
const key = (x, y, z) => x + ',' + y + ',' + z;
function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(key(x, y, z), [x, y, z, id]);
}
function has(x, y, z) { const e = M.get(key(x, y, z)); return !!e && e[3] !== AIR; }
// deer-local (lateral, up, back) -> world, and inverse. Forward is local -Z.
function W(lx, ly, lz) { return [OX + lx * CS - lz * SN, ly, OZ + lx * SN + lz * CS]; }
function L(wx, wy, wz) { const dx = wx - OX, dz = wz - OZ; return [dx * CS + dz * SN, wy, -dx * SN + dz * CS]; }
function hsh(x, z) { const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return n - Math.floor(n); }
function solidCount() { let n = 0; for (const e of M.values()) if (e[3] !== AIR) n++; return n; }
// add an optional scene element only if it keeps us inside the block budget
function optional(fn) {
  const snap = new Map();
  for (const [k, e] of M) snap.set(k, e.slice());
  fn();
  if (solidCount() > LIMIT) { M.clear(); for (const [k, e] of snap) M.set(k, e); }
}

// ellipsoid in deer-local space
function ell(cx, cy, cz, rx, ry, rz, id, pick) {
  const c = W(cx, cy, cz), R = Math.max(rx, rz) + 1;
  for (let x = Math.floor(c[0] - R); x <= Math.ceil(c[0] + R); x++)
    for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++)
      for (let z = Math.floor(c[2] - R); z <= Math.ceil(c[2] + R); z++) {
        const l = L(x, y, z);
        const a = (l[0] - cx) / rx, b = (l[1] - cy) / ry, d = (l[2] - cz) / rz;
        if (a * a + b * b + d * d > 1) continue;
        const col = pick ? pick(l[0], l[1], l[2]) : id;
        if (col != null) put(x, y, z, col);
      }
}
// tapered capsule between two deer-local points
function limb(a, b, r1, r2, id, opt) {
  const A = W(a[0], a[1], a[2]), B = W(b[0], b[1], b[2]);
  const d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
  const len2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2] || 1e-6;
  const R = Math.max(r1, r2) + 1;
  const flat = !!(opt && opt.flat), pick = opt && opt.pick;
  const plot = (x, y, z) => {
    let col = id;
    if (pick) { const l = L(x, y, z); col = pick(l[0], l[1], l[2]); }
    if (col != null) put(x, y, z, col);
  };
  for (let x = Math.floor(Math.min(A[0], B[0]) - R); x <= Math.ceil(Math.max(A[0], B[0]) + R); x++)
    for (let y = Math.floor(Math.min(A[1], B[1]) - R); y <= Math.ceil(Math.max(A[1], B[1]) + R); y++)
      for (let z = Math.floor(Math.min(A[2], B[2]) - R); z <= Math.ceil(Math.max(A[2], B[2]) + R); z++) {
        let t = ((x - A[0]) * d[0] + (y - A[1]) * d[1] + (z - A[2]) * d[2]) / len2;
        if (flat && (t < 0 || t > 1)) continue;
        t = Math.max(0, Math.min(1, t));
        const px = A[0] + d[0] * t - x, py = A[1] + d[1] * t - y, pz = A[2] + d[2] * t - z;
        const r = r1 + (r2 - r1) * t;
        if (px * px + py * py + pz * pz <= r * r) plot(x, y, z);
      }
  if (!flat) {
    const n = Math.ceil(Math.sqrt(len2) / 0.3);
    for (let i = 0; i <= n; i++) {
      plot(Math.round(A[0] + d[0] * i / n), Math.round(A[1] + d[1] * i / n), Math.round(A[2] + d[2] * i / n));
    }
  }
}
function chain(pts, radii, id, opt) {
  for (let i = 0; i < pts.length - 1; i++) limb(pts[i], pts[i + 1], radii[i], radii[i + 1], id, opt);
}
// march from a local point along a local direction until a solid cell is hit; recolor it
function stamp(p, dir, id) {
  let lx = p[0], ly = p[1], lz = p[2];
  for (let i = 0; i < 160; i++) {
    const w = W(lx, ly, lz), x = Math.round(w[0]), y = Math.round(w[1]), z = Math.round(w[2]);
    if (has(x, y, z)) { put(x, y, z, id); return; }
    lx += dir[0] * 0.25; ly += dir[1] * 0.25; lz += dir[2] * 0.25;
  }
}
// hang a block directly beneath whatever solid sits at/near a local point
function hang(p, id, cord) {
  const w = W(p[0], p[1], p[2]), x = Math.round(w[0]), z = Math.round(w[2]);
  let y = Math.round(w[1]) + 2, n = 0;
  while (!has(x, y, z) && n < 6) { y--; n++; }
  if (!has(x, y, z)) return;
  while (has(x, y, z)) y--;
  if (cord) { put(x, y, z, cord); y--; }
  put(x, y, z, id);
}
function wBox(x1, y1, z1, x2, y2, z2, id) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) put(x, y, z, id);
}
// soft snow mound sitting on the snow sheet; never overwrites the deer
function drift(cx, cz, rx, ry, rz) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++)
      for (let y = 1; y <= Math.ceil(ry); y++) {
        const a = (x - cx) / rx, b = (y - 0.4) / ry, d = (z - cz) / rz;
        if (a * a + b * b + d * d <= 1 && !has(x, y, z)) put(x, y, z, SNOW);
      }
}

// ---------- 1. clear the trees out of the clearing (targeted ellipse, not the whole site) ----------
for (let x = -13; x <= 13; x++)
  for (let z = -22; z <= 19; z++) {
    const a = (x + 0.5) / 12.5, b = (z + 2) / 20.5;
    if (a * a + b * b > 1) continue;
    // keep the low rock ledge at the north edge
    for (let y = (z <= -17 ? 2 : 1); y <= 8; y++) put(x, y, z, AIR);
  }

// ---------- 2. the reindeer ----------
const bodyPick = (lx, ly, lz) => (ly < 9.4 ? PLANKS : BROWN);
// barrel, deep chest, rump
ell(0, 12, 2.5, 4.3, 4.1, 9.5, BROWN, bodyPick);
ell(0, 12.5, -4.5, 4.6, 4.8, 4.5, BROWN, bodyPick);
ell(0, 12.5, 9, 4.4, 4.4, 4.2, BROWN, bodyPick);
// darker withers
ell(0, 16.2, -3.5, 2.6, 1.6, 3.2, OAK_LOG);
// white rump patch and stubby tail
ell(0, 13.2, 12.5, 2.9, 3.0, 1.5, WHITE);
ell(0, 15.0, 13.8, 1.3, 1.8, 1.4, WHITE);

// neck
limb([0, 14.5, -6.5], [0, 20, -10.5], 3.4, 2.5, BROWN);
// shaggy white chest bib + throat mane
ell(0, 12, -7.6, 3.5, 3.3, 2.7, WHITE);
limb([0, 10.2, -8.0], [0, 17, -11], 2.7, 1.8, WHITE);
ell(0, 8.6, -8.4, 1.6, 1.6, 1.4, WHITE);

// head + muzzle (pale tip, white chin)
ell(0, 21.5, -12, 2.9, 2.8, 3.4, BROWN);
limb([0, 21, -14], [0, 20, -18], 2.0, 1.6, BROWN, {
  pick: (lx, ly, lz) => (ly < 19.4 ? WHITE : lz < -16.4 ? PLANKS : BROWN),
});
// glowing red nose
ell(0, 20.3, -19.5, 1.4, 1.3, 1.3, NEON_RED);

// red collar with a big gold bell
limb([0, 18.06, -9.09], [0, 19.03, -9.79], 3.35, 3.2, RED, { flat: true });
ell(0, 15.7, -13.3, 1.3, 1.3, 1.3, GOLD);
limb([0, 17.2, -12.4], [0, 16.6, -12.9], 0.5, 0.5, GOLD);

// ears
for (const s of [-1, 1]) {
  limb([s * 2.3, 22.4, -9.6], [s * 5.9, 23.0, -8.2], 1.05, 0.7, BROWN);
}

// legs — hind pair and right foreleg planted, left foreleg raised (prancing)
const sock = (lx, ly, lz) => (ly < 3.6 ? WHITE : ly < 6.2 ? OAK_LOG : BROWN);
function hoof(lx, lz) { ell(lx, 1.6, lz, 1.5, 1.15, 1.8, BLACK); }
// front right (planted)
limb([3, 10, -4.5], [3, 6, -4.2], 1.8, 1.25, BROWN);
limb([3, 6, -4.2], [3, 2.6, -4.2], 1.2, 1.1, BROWN, { pick: sock });
hoof(3, -4.5);
// front left (raised, knee forward)
limb([-3, 10, -4.5], [-3.1, 7.6, -8.2], 1.8, 1.25, BROWN);
limb([-3.1, 7.6, -8.2], [-3.1, 4.3, -6.6], 1.2, 1.05, OAK_LOG);
ell(-3.1, 3.4, -6.3, 1.4, 1.15, 1.6, BLACK);
ell(-3.1, 4.6, -6.6, 1.3, 0.6, 1.3, WHITE);
// hind legs with heavy haunches
for (const s of [-1, 1]) {
  limb([s * 3, 11.5, 9], [s * 3.1, 6.8, 11], 2.4, 1.4, BROWN);
  limb([s * 3.1, 6.8, 11], [s * 3.1, 2.6, 9.8], 1.2, 1.1, BROWN, { pick: sock });
  hoof(s * 3.1, 9.5);
}

// festive saddle blanket: red field, gold trim, green stripe
ell(0, 12.2, 2.5, 5.0, 4.9, 9.5, RED, (lx, ly, lz) => {
  if (ly < 11.6 || lz < 0.5 || lz > 6.5) return null;
  if (lz < 1.4 || lz > 5.6 || ly < 12.6) return GOLD;
  if (Math.abs(lz - 3.5) < 0.55) return GREEN;
  return RED;
});

// hollow the hidden interior so the budget goes to visible detail
{
  const rm = [];
  for (const e of M.values()) {
    if (e[3] === AIR) continue;
    const x = e[0], y = e[1], z = e[2];
    if (has(x + 1, y, z) && has(x - 1, y, z) && has(x, y + 1, z) && has(x, y - 1, z) && has(x, y, z + 1) && has(x, y, z - 1)) rm.push(e);
  }
  for (const e of rm) e[3] = AIR;
}

// glossy dark eyes (front + side) and pink inner ears
for (const s of [-1, 1]) {
  stamp([s * 2.3, 22, -22], [0, 0, 1], OBSIDIAN);
  stamp([s * 2.3, 23, -22], [0, 0, 1], OBSIDIAN);
  stamp([s * 7, 22.6, -13.2], [-s, 0, 0], OBSIDIAN);
  stamp([s * 4.2, 22.8, -20], [0, 0, 1], PINK);
}

// ---------- 3. giant antlers ----------
const antlerPick = (lx, ly, lz) => (ly < 25.4 ? PLANKS : SAND);
const AO = { pick: antlerPick };
for (const s of [-1, 1]) {
  const B0 = [s * 1.3, 23.6, -10.6], B1 = [s * 4.5, 25.8, -9.2], B2 = [s * 9.5, 26.8, -7.8];
  const B3 = [s * 14.5, 28.2, -7.2], B4 = [s * 18.5, 30.8, -8], B5 = [s * 20, 33, -9.5];
  // burr at the skull
  ell(s * 1.5, 23.9, -10.6, 1.5, 1.2, 1.5, PLANKS);
  // main beam sweeping out and up
  chain([B0, B1, B2, B3, B4, B5], [1.45, 1.35, 1.25, 1.1, 0.95, 0.8], SAND, AO);
  // upright tines
  chain([B1, [s * 4.0, 29.5, -8.2], [s * 5.4, 32.6, -9.2]], [1.0, 0.85, 0.7], SAND, AO);
  chain([B2, [s * 9.0, 30.5, -8.6], [s * 10.4, 33, -10]], [1.0, 0.85, 0.7], SAND, AO);
  chain([B3, [s * 14.0, 31.4, -8.0], [s * 15.2, 33, -9.2]], [0.95, 0.8, 0.7], SAND, AO);
  // spurs off the upright tines
  limb([s * 4.0, 29.5, -8.2], [s * 2.2, 31.6, -7.4], 0.8, 0.7, SAND, AO);
  limb([s * 9.0, 30.5, -8.6], [s * 7.2, 32.4, -7.6], 0.8, 0.7, SAND, AO);
  // rear tine for depth
  chain([B2, [s * 10.2, 27.6, -4.4], [s * 11.4, 29.8, -2.6]], [0.95, 0.85, 0.7], SAND, AO);
  limb([s * 10.2, 27.6, -4.4], [s * 12.6, 27.4, -2.8], 0.8, 0.7, SAND, AO);
  // palmate crown at the tip
  limb(B4, [s * 20.6, 31.2, -6.0], 0.9, 0.7, SAND, AO);
  limb(B4, [s * 17.0, 33, -7.4], 0.9, 0.7, SAND, AO);
  limb(B4, [s * 20.2, 29.6, -9.6], 0.85, 0.7, SAND, AO);
  // brow tine ("shovel") reaching forward over the face
  chain([[s * 2.0, 24.2, -11.2], [s * 2.7, 25.3, -14.5], [s * 3.3, 27.0, -17.0]], [1.0, 0.9, 0.85], SAND, AO);
  limb([s * 3.3, 27.0, -17.0], [s * 2.2, 29.6, -18.0], 0.85, 0.7, SAND, AO);
  limb([s * 3.3, 27.0, -17.0], [s * 4.9, 28.8, -18.4], 0.85, 0.7, SAND, AO);
  limb([s * 3.3, 27.0, -17.0], [s * 3.8, 26.4, -19.4], 0.85, 0.7, SAND, AO);
  // bez tine, forward and out
  chain([B1, [s * 6.6, 26.2, -12.4], [s * 8.6, 28.0, -15.0]], [0.95, 0.85, 0.8], SAND, AO);
  limb([s * 8.6, 28.0, -15.0], [s * 8.0, 30.6, -15.8], 0.8, 0.7, SAND, AO);
  limb([s * 8.6, 28.0, -15.0], [s * 10.8, 29.2, -16.2], 0.8, 0.7, SAND, AO);
}
// fairy lights and baubles strung under the beams (sparingly)
{
  const glow = [NEON_RED, GLOWSTONE, NEON_BLUE];
  const bauble = [RED, GOLD, BLUE];
  let gi = 0;
  for (const s of [-1, 1]) {
    hang([s * 7.0, 26.3, -8.5], glow[gi++ % 3]);
    hang([s * 12.0, 27.5, -7.5], glow[gi++ % 3]);
    hang([s * 16.6, 29.5, -7.6], glow[gi++ % 3]);
    hang([s * 8.6, 28.0, -15.0], glow[gi++ % 3]);
    hang([s * 5.2, 26.0, -10.4], bauble[gi % 3], IRON);
    hang([s * 10.6, 27.0, -7.7], bauble[(gi + 1) % 3], IRON);
    hang([s * 14.6, 28.2, -7.2], bauble[(gi + 2) % 3], IRON);
    hang([s * 10.2, 27.6, -4.4], bauble[(gi + 1) % 3], IRON);
    gi++;
  }
}
// frosty breath
{
  const a = W(0.9, 19.4, -21.3), b = W(-0.9, 19.4, -21.3);
  put(a[0], a[1], a[2], STEAM);
  put(b[0], b[1], b[2], STEAM);
}

// ---------- 4. snowy clearing ----------
// fill the two shallow dips so the snow sheet has something to rest on
wBox(-2, -1, -8, 6, -1, 1, SNOW);
wBox(5, -1, 5, 12, -1, 14, SNOW);
for (let x = -15; x <= 13; x++)
  for (let z = -15; z <= 20; z++) {
    const a = (x + 1) / 12.5, b = (z - 2.5) / 15.5;
    if (a * a + b * b > 1 + (hsh(x, z) - 0.5) * 0.22) continue;
    if (!has(x, 0, z)) put(x, 0, z, SNOW);
  }

// gifts left in the snow
function gift(x1, y1, z1, x2, y2, z2, col, rib) {
  wBox(x1, y1, z1, x2, y2, z2, col);
  const mx = Math.round((x1 + x2) / 2), mz = Math.round((z1 + z2) / 2);
  wBox(mx, y1, z1, mx, y2, z2, rib);
  wBox(x1, y1, mz, x2, y2, mz, rib);
  put(mx, y2 + 1, mz, rib);
  put(mx - 1, y2 + 1, mz, rib);
  put(mx + 1, y2 + 1, mz, rib);
}
optional(() => {
  drift(9, -7, 3.2, 1.7, 2.6);
  drift(-11, 6, 2.4, 1.6, 3.0);
  drift(7, 13, 2.8, 1.5, 2.4);
  drift(-4, -12, 2.6, 1.3, 2.0);
  drift(3, 4, 2.0, 1.2, 2.4);
});
optional(() => {
  gift(-10, 1, -8, -8, 3, -6, RED, GOLD);
  gift(-7, 1, -11, -5, 2, -9, GREEN, RED);
  gift(-12, 1, -4, -10, 2, -2, BLUE, WHITE);
});
optional(() => {
  gift(8, 1, 3, 10, 3, 5, PURPLE, GOLD);
  gift(10, 1, -1, 12, 2, 1, WHITE, RED);
});
// a lantern on a post beside the gifts
optional(() => {
  wBox(-12, 1, -9, -12, 4, -9, OAK_LOG);
  put(-12, 5, -9, GLOWSTONE);
  put(-12, 6, -9, IRON);
});

// snowy pines framing the clearing (beside / behind, never in front of the deer)
function pine(cx, cz, base, h, R, star) {
  for (let y = -1; y <= base + 2; y++) put(cx, y, cz, OAK_LOG);
  const y0 = base + 2, n = h - 2;
  for (let k = 0; k <= n; k++) {
    const y = y0 + k, wide = k % 2 === 0;
    const r = Math.max(R * (1 - k / (n + 1)) + (wide ? 0.6 : -0.3), 0.4);
    const rAbove = R * (1 - (k + 1) / (n + 1)) - 0.3;
    const rr = Math.ceil(r);
    for (let dx = -rr; dx <= rr; dx++)
      for (let dz = -rr; dz <= rr; dz++) {
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d > r) continue;
        const snowy = wide && d > rAbove + 0.3 && hsh(cx + dx * 3 + y, cz + dz * 5 - y) < 0.62;
        put(cx + dx, y, cz + dz, snowy ? SNOW : LEAVES);
      }
  }
  put(cx, y0 + n + 1, cz, star ? GOLD : SNOW);
  if (star) put(cx, y0 + n + 2, cz, GLOWSTONE);
}
optional(() => pine(-17, 13, 0, 14, 4.2, true));
optional(() => pine(17, 14, 0, 12, 3.8, false));
optional(() => pine(-17, -11, 0, 8, 2.8, false));
optional(() => pine(18, -9, 1, 9, 3.0, false));
optional(() => pine(-19, 2, 0, 10, 2.6, false));
optional(() => pine(12, 19, 0, 9, 2.6, false));
optional(() => pine(-9, 20, 1, 9, 2.6, false));
optional(() => pine(20, 4, 1, 8, 2.4, false));
optional(() => pine(3, 21, 1, 7, 2.2, false));
optional(() => pine(-20, -19, 1, 7, 2.2, false));
optional(() => pine(20, -19, 1, 7, 2.2, false));

// ---------- emit ----------
for (const e of M.values()) if (e[3] === AIR) block(e[0], e[1], e[2], AIR);
for (const e of M.values()) if (e[3] !== AIR) block(e[0], e[1], e[2], e[3]);