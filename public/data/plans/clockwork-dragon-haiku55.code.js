// clockwork-dragon-haiku55 — prompt:
// a clockwork dragon made of brass gears...

// ===== Clockwork brass dragon on a gear plate =====
// Front faces north (-Z). Brass = GOLD, dark steel = IRON, trim = COPPER.

const BRASS = GOLD;
const CU = COPPER;
const FE = IRON;
const OB = OBSIDIAN;

function put(x, y, z, id) { block(Math.round(x), Math.round(y), Math.round(z), id); }

function line3(a, b, id) {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const n = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz), 1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    put(a[0] + dx * t, a[1] + dy * t, a[2] + dz * t, id);
  }
}

// Hollow box with every face filled (not just edges). pick(x,y,z) -> id, or null to skip.
function shellBox(x1, y1, z1, x2, y2, z2, pick) {
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) for (let z = z1; z <= z2; z++) {
    const edge = x === x1 || x === x2 || y === y1 || y === y2 || z === z1 || z === z2;
    if (!edge) continue;
    const id = pick(x, y, z);
    if (id !== null && id !== undefined) block(x, y, z, id);
  }
}

// Gear in a plane: axis 'z' = faces north/south, 'x' = faces east/west, 'y' = flat on ground.
function gear(axis, cx, cy, cz, r, teeth, depth, bodyId, toothId, axleId) {
  const R = Math.ceil(r + 1);
  for (let u = -R; u <= R; u++) for (let v = -R; v <= R; v++) {
    const d = Math.hypot(u, v);
    const th = Math.atan2(v, u);
    let id = null;
    if (d <= r - 0.5) id = bodyId;
    else if (d <= r + 0.9 && Math.cos(teeth * th) > 0.2) id = toothId || bodyId;
    if (id === null) continue;
    if (axleId !== undefined && d < 0.5) id = axleId;
    for (let k = 0; k < depth; k++) {
      if (axis === 'z') put(cx + u, cy + v, cz + k, id);
      else if (axis === 'x') put(cx + k, cy + v, cz + u, id);
      else put(cx + u, cy + k, cz + v, id);
    }
  }
}

// ---- 1. Clockwork floor plate under the dragon (y = -1) ----
gear('y', 0, -1, 4, 12, 24, 1, FE, BRASS);
for (let u = -13; u <= 13; u++) for (let v = -13; v <= 13; v++) {
  const d = Math.hypot(u, v);
  const th = Math.atan2(v, u);
  if (d >= 6 && d < 7) put(u, -1, 4 + v, BRASS);                                   // brass ring
  if (d >= 1.5 && d < 10 && Math.abs(Math.cos(6 * th)) > 0.97) put(u, -1, 4 + v, BRASS); // spokes
}

// ---- 2. Legs, feet, knee gears ----
for (const z0 of [-2, 8]) {
  const front = z0 === -2;
  cube(-6, 0, z0, -4, 5, z0 + 2, CU);
  cube(4, 0, z0, 6, 5, z0 + 2, CU);
  const fz1 = front ? z0 - 2 : z0 + 2;
  const fz2 = front ? z0 - 1 : z0 + 3;
  cube(-6, 0, fz1, -4, 0, fz2, FE);
  cube(4, 0, fz1, 6, 0, fz2, FE);
  const clawZ = front ? z0 - 3 : z0 + 4;
  for (const x of [-6, -5, -4, 4, 5, 6]) put(x, 0, clawZ, BRASS);
  gear('x', -7, 3, z0 + 1, 2.5, 6, 1, FE, BRASS, BRASS);
  gear('x', 7, 3, z0 + 1, 2.5, 6, 1, FE, BRASS, BRASS);
}

// ---- 3. Torso shell with brass banding ----
shellBox(-4, 6, 0, 4, 12, 11, (x, y, z) => (z % 3 === 0 ? BRASS : CU));
for (let z = 0; z <= 11; z += 2) put(0, 13, z, BRASS);                    // spine
for (const z of [1, 4, 7, 10]) put(0, 14, z, FE);                         // spine spikes
for (const z of [1, 4, 7, 10]) for (const y of [8, 10]) { put(-5, y, z, FE); put(5, y, z, FE); } // rivets
gear('x', 5, 9, 6, 2.5, 6, 1, FE, BRASS, BRASS);                          // hip gears
gear('x', -5, 9, 6, 2.5, 6, 1, FE, BRASS, BRASS);
gear('z', 0, 9, -1, 3.5, 10, 1, FE, BRASS, BRASS);                        // chest gear

// ---- 4. Neck and throat ----
cube(-2, 10, -3, 2, 13, -2, CU);
cube(-2, 10, -7, 2, 12, -4, CU);

// ---- 5. Head ----
shellBox(-3, 13, -7, 3, 18, -3, (x, y, z) =>
  (z === -7 && (x === -3 || x === 3 || y === 18 || y === 13)) ? BRASS : CU);
line3([-3, 18, -8], [3, 18, -8], BRASS);                                  // brow
put(-2, 16, -8, NEON_RED);                                                // eyes
put(2, 16, -8, NEON_RED);
for (const x of [-3, -1, 1, 3]) put(x, 16, -8, OB);                       // eye sockets
put(-2, 17, -8, OB);
put(2, 17, -8, OB);
line3([-2, 18, -4], [-4, 22, -1], BRASS);                                 // horns
line3([2, 18, -4], [4, 22, -1], BRASS);
for (const z of [-6, -5, -4]) put(0, 19, z, FE);                          // crest fins

// ---- 6. Snout, nostrils, jaw, teeth ----
shellBox(-2, 13, -12, 2, 15, -8, (x, y, z) => CU);
put(-1, 14, -12, AIR);                                                    // nostrils
put(1, 14, -12, AIR);
cube(-2, 11, -12, 2, 12, -8, CU);                                         // jaw
for (const x of [-2, 0, 2]) for (const z of [-12, -9]) put(x, 10, z, FE); // teeth
put(-1, 14, -13, STEAM);                                                  // breath puffs
put(1, 14, -13, STEAM);

// ---- 7. Exhaust stacks with steam ----
for (const x of [-2, 2]) {
  cylinder(x, 13, 5, 1, 6, FE);
  put(x, 19, 5, BRASS);
  put(x, 20, 5, STEAM);
}

// ---- 8. Clockwork wings: IRON lattice membrane, brass fingers, gear joints ----
function wing(s) {
  const S = [4, 11, 3], E = [9, 17, 4], W = [16, 20, 5];
  const tips = [[21, 22, 1], [21, 18, 5], [19, 14, 9], [14, 11, 11]];
  const m = (p) => [s * p[0], p[1], p[2]];

  // membrane first, so arms and fingers sit on top of it
  for (let i = 0; i < tips.length - 1; i++) {
    const A = tips[i], B2 = tips[i + 1];
    for (let b = 0; b <= 1.0001; b += 0.05) {
      for (let k = 0; k <= 1.0001; k += 0.05) {
        const q = [A[0] + (B2[0] - A[0]) * b, A[1] + (B2[1] - A[1]) * b, A[2] + (B2[2] - A[2]) * b];
        const p = [W[0] + (q[0] - W[0]) * k, W[1] + (q[1] - W[1]) * k, W[2] + (q[2] - W[2]) * k];
        const kk = Math.round(k * 10), bb = Math.round(b * 10);
        if (kk % 2 === 0 || bb % 2 === 0) put(s * p[0], p[1], p[2], FE);
      }
    }
  }
  line3(m(S), m(E), CU);
  line3(m(E), m(W), CU);
  for (const t of tips) line3(m(W), m(t), BRASS);
  gear('z', s * E[0], E[1], E[2], 2, 6, 1, FE, BRASS);
  gear('z', s * W[0], W[1], W[2], 2, 6, 1, FE, BRASS);
}
wing(-1);
wing(1);

// ---- 9. Tail: segmented, rising and swaying east ----
for (let i = 0; i < 10; i++) {
  const z = 12 + i;
  const xc = Math.round(i * 0.5);
  const yc = Math.round(8 + i * 0.9);
  const w = Math.max(1, Math.round(3 - i * 0.25));
  const h = Math.max(1, Math.round(2.5 - i * 0.2));
  cube(xc - w, yc - h, z, xc + w, yc + h, z, i % 3 === 0 ? BRASS : CU);
  if (i % 3 === 1) gear('z', xc, yc, z, h + 1, 6, 1, FE, BRASS);
  if (i % 2 === 0) put(xc, yc + h + 1, z, BRASS);
}

// ---- 10. Background clock towers (flanking, farther south) ----
function tower(cx) {
  shellBox(cx - 2, 0, 14, cx + 2, 16, 18, (x, y, z) => (y === 16 ? BRASS : CU));
  cube(cx - 1, 17, 15, cx + 1, 18, 17, CU);
  line3([cx, 19, 16], [cx, 22, 16], BRASS);
  gear('z', cx, 11, 14, 3, 12, 1, FE, BRASS, BRASS);                      // clock face
  line3([cx, 11, 13], [cx, 14, 13], OB);                                  // hands
  line3([cx, 11, 13], [cx + 2, 11, 13], OB);
}
tower(-16);
tower(16);

// ---- 11. Foreground free-standing gears ----
gear('z', -9, 3, -4, 3, 8, 1, FE, BRASS, BRASS);
gear('z', 9, 3, -4, 3, 8, 1, FE, BRASS, BRASS);