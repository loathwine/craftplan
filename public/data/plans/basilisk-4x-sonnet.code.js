// basilisk-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== Basilisk: coiled serpent rearing to strike, north-facing =====

const spine = [];

// Tail coil (resting pile), spiraling inward while rising slightly
const coilCenterX = 1, coilCenterZ = 9;
const coilTurns = 2.1;
const coilSteps = 64;
let lastCoil = null;
for (let i = 0; i <= coilSteps; i++) {
  const t = i / coilSteps;
  const angle = t * coilTurns * Math.PI * 2;
  const rad = 11 - t * 7.5;           // 11 -> 3.5
  const x = coilCenterX + Math.cos(angle) * rad;
  const z = coilCenterZ + Math.sin(angle) * rad * 0.82;
  const y = t * 2.5;
  const r = 3.3 - t * 1.1;            // 3.3 -> 2.2
  const pt = { x, y, z, r };
  spine.push(pt);
  lastCoil = pt;
}

// Neck: cubic bezier rising from coil end up and forward (north) to the head
const P0 = { x: lastCoil.x, y: lastCoil.y, z: lastCoil.z };
const P1 = { x: P0.x - 1.5, y: P0.y + 6,  z: P0.z - 5 };
const P2 = { x: -2,         y: P0.y + 12, z: -8 };
const P3 = { x: -1,         y: 17,        z: -9 }; // head center

function bezier(t, a, b, c, d) {
  const mt = 1 - t;
  return mt*mt*mt*a + 3*mt*mt*t*b + 3*mt*t*t*c + t*t*t*d;
}

const neckSteps = 46;
for (let i = 1; i <= neckSteps; i++) {
  const t = i / neckSteps;
  const x = bezier(t, P0.x, P1.x, P2.x, P3.x);
  const y = bezier(t, P0.y, P1.y, P2.y, P3.y);
  const z = bezier(t, P0.z, P1.z, P2.z, P3.z);
  let r;
  if (t < 0.55) r = lastCoil.r + (1.5 - lastCoil.r) * (t / 0.55);
  else r = 1.5 + (2.9 - 1.5) * ((t - 0.55) / 0.45);
  spine.push({ x, y, z, r });
}

const headX = P3.x, headY = P3.y, headZ = P3.z;

// ---- Pass 1: main body tube ----
for (let i = 0; i < spine.length; i++) {
  const p = spine[i];
  sphere(Math.round(p.x), Math.round(p.y), Math.round(p.z), Math.max(1, Math.round(p.r)), LEAVES);
}

// ---- Pass 2: armored scale bands (raised rings) ----
for (let i = 0; i < spine.length; i += 5) {
  const p = spine[i];
  sphere(Math.round(p.x), Math.round(p.y), Math.round(p.z), Math.max(1, Math.round(p.r * 0.42)), COBBLE);
}

// ---- Pass 3: pale belly stripe along the underside ----
for (let i = 0; i < spine.length; i += 2) {
  const p = spine[i];
  const by = Math.round(p.y - p.r * 0.7);
  sphere(Math.round(p.x), by, Math.round(p.z), Math.max(1, Math.round(p.r * 0.45)), SAND);
}

// ---- Pass 4: dorsal spikes along the spine ridge ----
for (let i = 0; i < spine.length; i += 4) {
  const p = spine[i];
  const sx = Math.round(p.x), sz = Math.round(p.z);
  const topY = Math.round(p.y + p.r);
  block(sx, topY + 1, sz, COBBLE);
  block(sx, topY + 2, sz, COBBLE);
}

// ===================== HEAD =====================

sphere(headX, headY, headZ, 3, LEAVES);
sphere(headX, headY + 1, headZ - 3, 2, LEAVES);
sphere(headX, headY, headZ - 5, 1, LEAVES);

cube(headX - 3, headY + 2, headZ - 2, headX + 3, headY + 3, headZ + 2, COBBLE);

sphere(headX, headY - 3, headZ - 3, 2, LEAVES);
cube(headX - 2, headY - 4, headZ - 6, headX + 2, headY - 3, headZ - 3, LEAVES);

sphere(headX, headY - 1, headZ - 4, 2, AIR);
cube(headX - 2, headY - 3, headZ - 6, headX + 2, headY - 1, headZ - 4, AIR);

line(headX - 1, headY, headZ - 5, headX - 1, headY - 4, headZ - 6, SNOW);
line(headX + 1, headY, headZ - 5, headX + 1, headY - 4, headZ - 6, SNOW);
block(headX - 1, headY - 5, headZ - 6, SNOW);
block(headX + 1, headY - 5, headZ - 6, SNOW);

line(headX, headY - 3, headZ - 5, headX, headY - 3, headZ - 9, BRICK);
line(headX, headY - 3, headZ - 9, headX - 1, headY - 3, headZ - 11, BRICK);
line(headX, headY - 3, headZ - 9, headX + 1, headY - 3, headZ - 11, BRICK);

sphere(headX - 2, headY + 1, headZ - 3, 1, BRICK);
sphere(headX + 2, headY + 1, headZ - 3, 1, BRICK);

block(headX - 1, headY, headZ - 6, STONE);
block(headX + 1, headY, headZ - 6, STONE);

// Cobra-style hood fan behind the head
for (let dx = -6; dx <= 6; dx++) {
  const h = Math.max(0, Math.round(5 * (1 - (dx / 6) * (dx / 6))));
  if (h > 0) {
    cube(headX + dx, headY - 3, headZ + 1, headX + dx, headY - 3 + h, headZ + 1, LEAVES);
    block(headX + dx, headY - 2 + h, headZ + 1, COBBLE);
  }
}
for (let dx = -5; dx <= 5; dx++) {
  const h = Math.max(0, Math.round(4 * (1 - (dx / 5) * (dx / 5))));
  if (h > 0) {
    cube(headX + dx, headY - 3, headZ + 2, headX + dx, headY - 3 + h, headZ + 2, LEAVES);
  }
}

// ===================== RUINED CHAMBER DRESSING =====================

function brokenPillar(px, pz, h) {
  cylinder(px, -1, pz, 1, h, COBBLE);
  const topY = h - 2;
  block(px, topY, pz, STONE);
  block(px + 1, topY - 1, pz, COBBLE);
  block(px - 1, topY - 1, pz, STONE);
  for (let k = 0; k < 5; k++) {
    const rx = px + (k % 3) - 1;
    const rz = pz + Math.floor(k / 3) - 1;
    block(rx, -1, rz, COBBLE);
  }
}

brokenPillar(-18, -3, 9);
brokenPillar(17, -2, 11);
brokenPillar(-16, 15, 14);
brokenPillar(15, 17, 7);

// Cracked ground radiating from the coil base (AIR carve, free)
for (let i = 0; i < 10; i++) {
  const ang = (i / 10) * Math.PI * 2;
  const cx = coilCenterX + Math.round(Math.cos(ang) * 13);
  const cz = coilCenterZ + Math.round(Math.sin(ang) * 11);
  line(coilCenterX, 0, coilCenterZ, cx, 0, cz, AIR);
  line(coilCenterX, -1, coilCenterZ, cx, -1, cz, AIR);
}
