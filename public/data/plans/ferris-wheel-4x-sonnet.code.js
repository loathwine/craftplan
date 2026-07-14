// ferris-wheel-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Ferris wheel — wheel plane faces the camera (axis runs along Z, into the screen) =====

function ring(cx, cy, z, rOuter, rInner, id) {
  const ro2 = rOuter * rOuter, ri2 = rInner * rInner;
  const R = Math.ceil(rOuter);
  for (let x = -R; x <= R; x++) {
    for (let y = -R; y <= R; y++) {
      const d2 = x * x + y * y;
      if (d2 <= ro2 && d2 >= ri2) block(cx + x, cy + y, z, id);
    }
  }
}

function spoke(cx, cy, z, angleDeg, rInner, rOuter, id) {
  const a = angleDeg * Math.PI / 180;
  const dx = Math.cos(a), dy = Math.sin(a);
  for (let r = rInner; r <= rOuter; r += 0.5) {
    block(Math.round(cx + dx * r), Math.round(cy + dy * r), z, id);
  }
}

function lerp3(p, q, t) {
  return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
}

// ---------- Wheel geometry ----------
const CX = 0, CY = 15, CZ = 4;      // hub center; wheel disc spans z = 3..5
const Z_LAYERS = [3, 4, 5];
const R_OUT = 9, R_IN = 8;                // main structural rim band
const R_DECO_OUT = 5.5, R_DECO_IN = 4.5;  // inner decorative ring
const HUB_R = 2;

for (const z of Z_LAYERS) {
  ring(CX, CY, z, R_OUT, R_IN, 3);           // outer rim, stone
  ring(CX, CY, z, R_DECO_OUT, R_DECO_IN, 8); // inner ring, cobble
  ring(CX, CY, z, HUB_R, 0, 8);              // hub disc, cobble
}
block(CX, CY, CZ, 3); // hub bolt, stone

for (const z of Z_LAYERS) {
  for (let a = 0; a < 360; a += 45) {
    spoke(CX, CY, z, a, HUB_R + 0.2, R_IN - 0.2, 3);
  }
}

// light bulbs studding the front/back faces of the rim
for (let a = 0; a < 360; a += 15) {
  const rad = a * Math.PI / 180;
  const dx = Math.cos(rad), dy = Math.sin(rad);
  const bx = Math.round(CX + dx * 8.5), by = Math.round(CY + dy * 8.5);
  const idx = Math.round(a / 15);
  block(bx, by, 2, idx % 2 === 0 ? 11 : 10); // front bulbs poke toward camera
  block(bx, by, 6, idx % 2 === 0 ? 10 : 11); // back bulbs
}

// ---------- Gondola cabins ----------
const CABIN_COUNT = 20;
for (let i = 0; i < CABIN_COUNT; i++) {
  const a = (360 / CABIN_COUNT) * i;
  const rad = a * Math.PI / 180;
  const dx = Math.cos(rad), dy = Math.sin(rad);
  const ax = Math.round(CX + dx * 9.6), ay = Math.round(CY + dy * 9.6);
  block(Math.round(CX + dx * 9.2), Math.round(CY + dy * 9.2), 4, 3); // arm to rim
  const bodyId = i % 3 === 0 ? 10 : (i % 3 === 1 ? 11 : 7);
  cube(ax - 1, ay - 1, 3, ax + 1, ay + 1, 5, bodyId);
  cube(ax - 1, ay - 1, 3, ax + 1, ay - 1, 5, 11); // glass window band
  block(ax, ay + 2, 4, 7); // little roof cap
}

// ---------- Support tower (behind the wheel) ----------
const apex = [0, 27, 10];
const corners = [
  [-10, -1, 7],   // A front-left
  [10, -1, 7],    // B front-right
  [10, -1, 15],   // D back-right
  [-10, -1, 15],  // C back-left
];

for (const c of corners) {
  line(apex[0], apex[1], apex[2], c[0], c[1], c[2], 4);
}
for (const t of [0.25, 0.5, 0.75]) {
  const pts = corners.map(c => lerp3(apex, c, t).map(Math.round));
  for (let i = 0; i < 4; i++) {
    const p = pts[i], q = pts[(i + 1) % 4];
    line(p[0], p[1], p[2], q[0], q[1], q[2], 8);
  }
}
{
  const A25 = lerp3(apex, corners[0], 0.25).map(Math.round);
  const B25 = lerp3(apex, corners[1], 0.25).map(Math.round);
  const A75 = lerp3(apex, corners[0], 0.75).map(Math.round);
  const B75 = lerp3(apex, corners[1], 0.75).map(Math.round);
  line(A25[0], A25[1], A25[2], B75[0], B75[1], B75[2], 8);
  line(B25[0], B25[1], B25[2], A75[0], A75[1], A75[2], 8);
  const C25 = lerp3(apex, corners[3], 0.25).map(Math.round);
  const D25 = lerp3(apex, corners[2], 0.25).map(Math.round);
  const C75 = lerp3(apex, corners[3], 0.75).map(Math.round);
  const D75 = lerp3(apex, corners[2], 0.75).map(Math.round);
  line(C25[0], C25[1], C25[2], D75[0], D75[1], D75[2], 8);
  line(D25[0], D25[1], D25[2], C75[0], C75[1], C75[2], 8);
}
line(CX, CY, CZ, 0, CY, 10, 3);
line(0, CY, 10, apex[0], apex[1], apex[2], 4);
block(0, apex[1] + 1, apex[2], 4);
block(1, apex[1] + 2, apex[2], 10);
block(1, apex[1] + 1, apex[2], 10);

// ---------- Boarding plaza / platform ----------
cube(-8, -1, -6, 8, -1, 2, 7);
hollowCube(-8, -1, -6, 8, -1, 2, 8);
for (let x = -8; x <= 8; x += 2) {
  block(x, 0, -6, 4);
  block(x, 1, -6, 4);
}
for (const lx of [-7, 7]) {
  line(lx, -1, -5, lx, 3, -5, 4);
  block(lx, 4, -5, 11);
}

// ---------- Ticket booth ----------
hollowCube(12, -1, -1, 16, 3, 3, 10);
cube(13, 0, -1, 15, 2, -1, 11);
cube(12, 4, -1, 16, 4, 3, 7);
block(14, 5, 1, 7);

// ---------- Decorative trees flanking the plaza ----------
function tinyTree(x, z) {
  line(x, -1, z, x, 2, z, 4);
  sphere(x, 3, z, 2, 5);
}
tinyTree(-14, -3);
tinyTree(-16, -1);
tinyTree(18, -4);
```
