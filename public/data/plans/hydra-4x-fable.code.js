// hydra-4x-fable — prompt:
// a three-headed hydra...

const placed = new Set();
let solids = 0;
const CAP = 3995;

function put(x, y, z, id) {
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  const k = x + ',' + y + ',' + z;
  if (placed.has(k)) return;
  if (id !== AIR) { if (solids >= CAP) return; solids++; }
  placed.add(k);
  block(x, y, z, id);
}

function ball(cx, cy, cz, r, id) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) {
        const dx = x - cx, dy = y - cy, dz = z - cz;
        if (dx * dx + dy * dy + dz * dz <= r * r + 0.1) put(x, y, z, id);
      }
}

function dsk(cx, cy, cz, r, id) {
  for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
    for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) {
      const dx = x - cx, dz = z - cz;
      if (dx * dx + dz * dz <= r * r + 0.1) put(x, cy, z, id);
    }
}

function bez(a, b, c, t) {
  const u = 1 - t;
  return [
    u * u * a[0] + 2 * u * t * b[0] + t * t * c[0],
    u * u * a[1] + 2 * u * t * b[1] + t * t * c[1],
    u * u * a[2] + 2 * u * t * b[2] + t * t * c[2]
  ];
}

// ---- clear trees out of the silhouette zones (AIR is free) ----
cube(-18, 1, -11, 18, 10, 4, AIR);   // neck/head backdrop
cube(-9, 1, 4, 21, 10, 20, AIR);     // body + tail zone
cube(-6, 1, -19, 6, 6, -11, AIR);    // fire breath lane
cube(-10, 1, -18, -2, 4, -11, AIR);  // pool patch
cube(5, 1, -16, 12, 4, -8, AIR);     // bones patch

// ---- heads (details placed before fills so they win dedupe) ----
function head(hx, hy, hz, fx, fz, big) {
  const rx = -fz, rz = fx;
  const sr = big ? 3.0 : 2.6;
  // eyes (red, glowing)
  for (const s of [-1, 1]) {
    put(hx + fx * 1.6 + rx * s * 1.9, hy + 0.7, hz + fz * 1.6 + rz * s * 1.9, BRICK);
    put(hx + fx * 2.1 + rx * s * 1.5, hy + 0.9, hz + fz * 2.1 + rz * s * 1.5, BRICK);
  }
  // mouth glow band between jaws
  for (let d = 1.2; d <= 4.4; d += 0.6) {
    for (let k = -1; k <= 1; k++) {
      put(hx + fx * d + rx * k, hy - 1.9, hz + fz * d + rz * k, BRICK);
      if (big) put(hx + fx * d + rx * k, hy - 2.7, hz + fz * d + rz * k, BRICK);
    }
  }
  // fangs
  for (const s of [-1, 1]) {
    put(hx + fx * 3.8 + rx * s * 0.9, hy - 1.2, hz + fz * 3.8 + rz * s * 0.9, SNOW);
    put(hx + fx * 2.6 + rx * s * 1.1, hy - 1.1, hz + fz * 2.6 + rz * s * 1.1, SNOW);
    put(hx + fx * 3.4 + rx * s * 0.7, hy - (big ? 3.4 : 2.8), hz + fz * 3.4 + rz * s * 0.7, SNOW);
    put(hx + fx * 2.2 + rx * s * 0.8, hy - (big ? 3.3 : 2.7), hz + fz * 2.2 + rz * s * 0.8, SNOW);
  }
  // skull + upper snout
  ball(hx, hy, hz, sr, LEAVES);
  ball(hx + fx * 2.2, hy - 0.4, hz + fz * 2.2, 1.9, LEAVES);
  ball(hx + fx * 3.8, hy - 0.8, hz + fz * 3.8, 1.4, LEAVES);
  // lower jaw, hanging open
  const jy = big ? -3.6 : -3.0;
  ball(hx + fx * 1.6, hy + jy + 0.6, hz + fz * 1.6, 1.3, LEAVES);
  ball(hx + fx * 3.2, hy + jy, hz + fz * 3.2, 1.0, LEAVES);
  // swept-back horns
  for (const s of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      put(hx - fx * (1.2 + i * 0.7) + rx * s * (1.4 + i * 0.25),
          hy + 1.8 + i * 0.9,
          hz - fz * (1.2 + i * 0.7) + rz * s * (1.4 + i * 0.25),
          i < 2 ? OAK_LOG : SNOW);
    }
  }
}

head(-13.5, 19.6, -5.9, -0.45, -0.89, false); // left head, snarling outward
head(0, 26.5, -4, 0, -1, true);               // tall center head, breathing fire
head(14.4, 22.6, -1.9, 0.4, -0.92, false);    // right head

// tongue lolling from left head
put(-15.8, 17.2, -10.4, BRICK);
put(-16.2, 16.6, -11.1, BRICK);
put(-16.5, 15.8, -11.8, BRICK);

// ---- necks: bezier tubes with planks throat scutes + dorsal spikes ----
function neck(p0, p1, p2, r0, r1) {
  const pts = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const p = bez(p0, p1, p2, t);
    pts.push([p[0], p[1], p[2], r0 + (r1 - r0) * t]);
  }
  for (let i = 3; i <= 19; i++) {
    const q = pts[i];
    ball(q[0], q[1] - q[3] * 0.25, q[2] - q[3] * 0.8, 0.9, PLANKS);
  }
  for (const q of pts) ball(q[0], q[1], q[2], q[3], LEAVES);
  for (let i = 4; i <= 17; i += 3) {
    const q = pts[i];
    put(q[0], q[1] + q[3], q[2] + q[3] * 0.55, OAK_LOG);
    put(q[0], q[1] + q[3] + 1, q[2] + q[3] * 0.75, SNOW);
  }
}

neck([-3, 6, 8], [-11, 12, 3], [-13, 19, -5], 2.7, 1.6);
neck([0, 7, 8], [1, 18, 5], [0, 26, -3], 2.9, 1.8);
neck([3, 6, 8], [11, 13, 4], [14, 22, -1], 2.7, 1.6);

// ---- body: planks belly first, then scaled bulk ----
ball(0, 4, 5.8, 2.6, PLANKS);
ball(0, 2.2, 7.5, 3.0, PLANKS);
ball(0, 1.8, 10.5, 3.0, PLANKS);
ball(0, 1.8, 13, 2.4, PLANKS);
ball(0, 5.5, 8.5, 4.7, LEAVES);
ball(0, 4.8, 12, 4.4, LEAVES);
ball(0, 4, 14.5, 3.4, LEAVES);

// dorsal spine ridge
for (const [z, top] of [[6, 9.5], [8, 10.1], [10, 9.9], [12, 9.1], [14, 8.1]]) {
  put(0, top + 0.5, z, OAK_LOG);
  put(0, top + 1.5, z, OAK_LOG);
  put(0, top + 2.5, z, SNOW);
}

// ---- tail: tapering chain curling east ----
const tp = [[2.5, 3.5, 13], [7, 2, 16.5], [12, 1.5, 18.5], [16, 2, 16], [18.5, 3, 12], [19.5, 4.5, 9]];
let seg = 0;
const segTotal = (tp.length - 1) * 6;
for (let i = 0; i < tp.length - 1; i++) {
  for (let j = 0; j < 6; j++) {
    const t = j / 6;
    const x = tp[i][0] + (tp[i + 1][0] - tp[i][0]) * t;
    const y = tp[i][1] + (tp[i + 1][1] - tp[i][1]) * t;
    const z = tp[i][2] + (tp[i + 1][2] - tp[i][2]) * t;
    const r = 2.2 - 1.5 * (seg / segTotal);
    ball(x, y, z, r, LEAVES);
    if (seg % 5 === 2) put(x, y + r + 0.5, z, SNOW);
    seg++;
  }
}
put(19.5, 5.5, 8.5, SNOW);
put(19.5, 6.5, 8, SNOW);

// ---- legs ----
function frontLeg(x) {
  ball(x, 2.6, 5.5, 1.9, LEAVES);
  ball(x, 1.0, 4.8, 1.6, LEAVES);
  ball(x, 0.2, 4.0, 1.6, LEAVES);
  for (const k of [-1, 0, 1]) {
    put(x + k, 0, 2.2, SNOW);
    put(x + k, 0, 2.9, SNOW);
  }
}
frontLeg(-4.5);
frontLeg(4.5);

function haunch(x) {
  ball(x, 3.2, 12.5, 2.9, LEAVES);
  ball(x * 1.18, 0.6, 10.5, 1.7, LEAVES);
  for (const k of [-1, 0, 1]) put(x * 1.18 + k, 0, 8.6, SNOW);
}
haunch(-5.5);
haunch(5.5);

// ---- fire breath from center head, arcing to the ground ----
const f0 = [0, 24.2, -7.5], f1 = [0, 15, -14.5], f2 = [0, 2.5, -15.5];
for (let i = 0; i <= 16; i++) {
  const t = i / 16;
  const p = bez(f0, f1, f2, t);
  const r = 0.8 + 1.4 * t;
  ball(p[0], p[1], p[2], r, (i % 3 === 2) ? SAND : BRICK);
  if (i % 2 === 0) put(p[0] + ((i % 4 === 0) ? 1 : -1) * (r * 0.6 + 0.8), p[1] + 0.6, p[2], SAND);
}
// impact blaze + scorch ring
ball(0, 1, -15.5, 2.4, BRICK);
ball(-2.6, 0.8, -14, 1.2, SAND);
ball(2.6, 0.8, -15.2, 1.3, SAND);
put(0, 4, -15.5, SAND);
put(-1, 3.6, -16, SAND);
dsk(0, 0, -15.5, 4.4, COBBLE);

// ---- swamp scenery: victim's bones, boulders, murky pools ----
for (const rib of [[-11, 1.8], [-12.7, 2.2], [-14.3, 1.8]]) {
  for (let a = 0; a <= Math.PI; a += 0.3) {
    put(8.5 + rib[1] * Math.cos(a), 0.3 + rib[1] * Math.sin(a), rib[0], SNOW);
  }
}
line(8, 0, -10, 9, 0, -15, SNOW);
ball(8.5, 0.8, -9, 1.1, SNOW);

ball(-15, 0, 2, 1.8, COBBLE);
ball(-13, 0.3, -9, 1.3, COBBLE);
ball(17, 0, 3, 1.6, COBBLE);

dsk(-8.5, 0, -4, 3.8, GLASS);
dsk(11, 0, -6.5, 3.2, GLASS);
dsk(-5, 0, -14, 2.8, GLASS);