// xenomorph-4x-opus — prompt:
// the Alien xenomorph...

// ===== Alien Xenomorph — lunging, biomechanical, facing NORTH (-Z) =====
const BODY = COBBLE, DETAIL = STONE, TOOTH = SNOW, SLIME = ICE;

function orb(x, y, z, r, id) {
  sphere(Math.round(x), Math.round(y), Math.round(z), Math.max(1, Math.round(r)), id);
}
function limb(x1, y1, z1, x2, y2, z2, r, id) {
  const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1, z2 - z1)) * 2;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    orb(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t, r, id);
  }
}
function chain(pts, id) {
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    orb(p.x || 0, p.y, p.z, p.r, id);
    if (i > 0) {
      const q = pts[i - 1];
      limb(q.x || 0, q.y, q.z, p.x || 0, p.y, p.z, Math.min(p.r, q.r), id);
    }
  }
}

// --- resin floor patch under the beast (dark grounding shadow) ---
disk(0, 0, 4, 5, DETAIL);
disk(0, 0, 4, 4, DETAIL);

// --- LEGS (digitigrade, splayed clawed feet) ---
for (const s of [1, -1]) {
  const X = 3 * s;
  limb(X, 9, 7, X + 0.5 * s, 4, 1, 2.0, BODY);      // thigh -> knee (forward)
  limb(X + 0.5 * s, 4, 1, X + 0.6 * s, 1, 4, 1.6, BODY); // shin -> ankle (back)
  limb(X + 0.6 * s, 1, 4, X + 0.6 * s, 0, -1, 1.4, BODY); // foot -> toes (forward)
  const fx = Math.round(X + 0.6 * s);
  for (const dx of [-1, 0, 1]) line(fx, 0, -1, fx + dx, 0, -3, TOOTH); // toe claws
}

// --- PELVIS -> TORSO (arched, hunched forward) ---
chain([
  { x: 0, y: 9, z: 7.5, r: 2.9 },
  { x: 0, y: 11, z: 6.8, r: 3.0 },
  { x: 0, y: 13, z: 6.0, r: 3.2 },
  { x: 0, y: 15, z: 5.2, r: 3.2 }, // shoulders
], BODY);

// biomech rib bands across the chest front
for (const y of [10, 12, 14]) {
  for (let x = -2; x <= 2; x++) block(x, y, 3, DETAIL);
}

// --- NECK -> ELONGATED SKULL DOME (curving down toward viewer, slight east tilt) ---
chain([
  { x: 0, y: 15, z: 5, r: 2.6 },
  { x: 0.5, y: 16, z: 3, r: 3.4 },
  { x: 0.5, y: 16, z: 1, r: 3.7 }, // crown, widest
  { x: 0.7, y: 15, z: -1, r: 3.4 },
  { x: 0.8, y: 15, z: -3, r: 2.9 },
  { x: 1.0, y: 14, z: -5, r: 2.4 },
  { x: 1.0, y: 14, z: -7, r: 1.9 },
  { x: 1.0, y: 13, z: -9, r: 1.5 },
], BODY);
limb(1, 13, -9, 1, 13, -11, 1.2, BODY); // upper lip forward

// glistening ridge along the top of the dome
for (const seg of [[0, 16, 2], [1, 15, -1], [1, 14, -4], [1, 13, -8]]) {
  block(seg[0], seg[1] + Math.round(3), seg[2], SLIME);
}

// lower jaw
chain([
  { x: 0.8, y: 12, z: -3, r: 1.9 },
  { x: 1.0, y: 12, z: -6, r: 1.6 },
  { x: 1.0, y: 12, z: -9, r: 1.3 },
  { x: 1.0, y: 12, z: -11, r: 1.0 },
], BODY);

// --- SNARLING TEETH (jagged silver grin) ---
for (let z = -11; z <= -6; z++) {
  for (let x = -1; x <= 2; x++) {
    block(x, 13, z, TOOTH);
    if ((x + z) % 2 === 0) block(x, 14, z, TOOTH); // upper fangs
    else block(x, 12, z, TOOTH);                    // lower fangs
  }
}

// --- INNER PHARYNGEAL JAW (the second mouth lunging out) ---
limb(0.5, 13, -9, 0.5, 13, -13, 1, BODY);
for (const t of [[0, 13, -13], [1, 13, -13], [0, 14, -13], [1, 12, -13], [0, 13, -14]]) {
  block(t[0], t[1], t[2], TOOTH);
}

// --- DROOL / slime strands ---
for (const dz of [-7, -9, -12]) line(0, 12, dz, 0, 9, dz, SLIME);

// --- SPINDLY ARMS with splayed talons reaching at the viewer ---
for (const s of [1, -1]) {
  const X = 3 * s;
  limb(X, 14, 5, X + 3 * s, 10, 1, 1.3, BODY);     // upper arm
  limb(X + 3 * s, 10, 1, X + 2 * s, 5, -4, 1.1, BODY); // forearm
  const hx = Math.round(X + 2 * s);
  for (const dx of [-1, 0, 1, 2]) line(hx, 5, -4, hx + dx * s, 3, -7, TOOTH); // talons
}

// --- DORSAL BACK TUBES (4 swept-back biomech pipes) ---
const tubes = [
  [1.5, 15, 5, 1.5, 20, 10], [3, 14, 6, 4, 19, 11],
  [-1.5, 15, 5, -1.5, 20, 10], [-3, 14, 6, -4, 19, 11],
];
for (const t of tubes) {
  limb(t[0], t[1], t[2], t[3], t[4], t[5], 1.1, DETAIL);
  orb(t[3], t[4], t[5], 1.3, DETAIL);
}

// --- LONG SEGMENTED TAIL, arcing up and back, spiked, bladed tip ---
const tail = [
  { x: 0, y: 9, z: 8, r: 2.2 },
  { x: 0, y: 10, z: 11, r: 2.0 },
  { x: 1, y: 12, z: 14, r: 1.7 },
  { x: 1, y: 15, z: 17, r: 1.4 },
  { x: 0, y: 17, z: 19, r: 1.1 },
  { x: -0.5, y: 18, z: 21, r: 0.9 },
];
chain(tail, BODY);
for (let i = 1; i < tail.length; i++) {
  const p = tail[i];
  const bx = Math.round(p.x), by = Math.round(p.y + p.r), bz = Math.round(p.z);
  line(bx, by, bz, bx, by + 2, bz + 1, DETAIL); // dorsal spike
}
limb(-0.5, 18, 21, -1, 16, 22, 0.9, TOOTH); // scythe blade
block(-1, 17, 22, TOOTH); block(0, 18, 22, TOOTH); block(-1, 18, 21, TOOTH);

// --- HIVE RESIN TENDRILS framing the background (south) ---
const tendrils = [
  [-9, 0, 16, -11, 11, 20], [9, 0, 16, 12, 12, 20],
  [-4, 0, 20, -6, 13, 22], [5, 0, 19, 7, 13, 22], [0, 0, 21, 0, 15, 22],
];
for (const t of tendrils) limb(t[0], t[1], t[2], t[3], t[4], t[5], 1.3, DETAIL);
limb(-11, 11, 20, -6, 13, 22, 0.9, DETAIL);
limb(12, 12, 20, 7, 13, 22, 0.9, DETAIL);

// --- OVOMORPH EGG, foreground east, cracked open with inner glow ---
const ex = 13, ez = -3;
for (let y = 0; y <= 6; y++) {
  const dy = y - 3;
  let r = Math.sqrt(Math.max(0, 9 - dy * dy * 0.9));
  if (y >= 5) r *= 0.7;
  disk(ex, y, ez, Math.max(1, Math.round(r)), BODY);
}
cube(ex - 1, 3, ez - 1, ex + 1, 6, ez + 1, AIR); // hollow core opening
cube(ex - 2, 6, ez, ex + 2, 6, ez, AIR);         // petal split (X)
cube(ex, 6, ez - 2, ex, 6, ez + 2, AIR);         // petal split (Z)
orb(ex, 3, ez, 1, SLIME);                        // egg glow

// --- scattered glowing resin pods (foreground texture) ---
for (const p of [[8, -2], [-8, 1], [10, -6], [-6, 3], [6, 6]]) {
  orb(p[0], 1, p[1], 1, DETAIL);
  block(p[0], 2, p[1], SLIME);
}