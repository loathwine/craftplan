// phoenix-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ============================================================
// A PHOENIX RISING FROM FLAMES
// Origin (0,0,0) = ground at player's feet. Phoenix faces +Z.
// Wings spread along X. Flames ring the ground; tail plunges
// back into the fire along -Z.
// ============================================================

function taperTongue(cx, cz, y0, height, r0, id, wobbleAmp, wobbleFreq, phase) {
  for (let i = 0; i < height; i++) {
    const t = i / height;
    const r = Math.round(r0 * (1 - t));
    const y = y0 + i;
    const ox = Math.round(Math.sin(i * wobbleFreq + phase) * wobbleAmp * (1 - t * 0.3));
    const oz = Math.round(Math.cos(i * wobbleFreq * 0.8 + phase) * wobbleAmp * (1 - t * 0.3));
    if (r <= 0) {
      block(cx + ox, y, cz + oz, id);
    } else {
      disk(cx + ox, y, cz + oz, r, id);
    }
  }
}

// ---------------- GROUND: scorched earth ----------------
disk(0, -1, 0, 10, 8);   // cobble scorch ring
disk(0, -1, 0, 6, 3);    // stone ash core
disk(0, 0, 0, 3, 3);     // ash bed phoenix stands on

// ---------------- FLAME RING (outer tongues) ----------------
for (let a = 0; a < 16; a++) {
  const ang = (a / 16) * Math.PI * 2;
  const rad = 6 + (a % 3);
  const x = Math.round(Math.cos(ang) * rad);
  const z = Math.round(Math.sin(ang) * rad);
  const h = 5 + (a % 4) * 2;
  taperTongue(x, z, 0, h, 2 + (a % 2), 10, 1, 0.8, a);
}
// inner brighter yellow tongues
for (let a = 0; a < 10; a++) {
  const ang = (a / 10) * Math.PI * 2 + 0.3;
  const rad = 3 + (a % 2);
  const x = Math.round(Math.cos(ang) * rad);
  const z = Math.round(Math.sin(ang) * rad);
  const h = 4 + (a % 3) * 2;
  taperTongue(x, z, 0, h, 1 + (a % 2), 6, 1, 1.1, a * 2);
}

// ---------------- LEGS & TALONS ----------------
line(-2, 5, 0, -2, 10, -1, 8);
line(2, 5, 0, 2, 10, -1, 8);
block(-2, 10, -1, 8); block(-3, 10, -1, 8); block(-1, 10, -2, 8);
block(2, 10, -1, 8); block(3, 10, -1, 8); block(1, 10, -2, 8);
// ember glow where feet meet fire
block(-2, 5, 0, 6); block(2, 5, 0, 6);

// ---------------- SPINE FLAME (fire wreathing the body) ----------------
for (let i = 0; i < 6; i++) {
  const z = -1 - Math.round(i * 0.4);
  taperTongue(0, z, 10 + i, 6, 1, i % 2 === 0 ? 10 : 6, 1, 1.3, i);
}

// ---------------- TORSO ----------------
sphere(0, 14, 0, 4, 10);      // main body, brick-red plumage
sphere(0, 13, 3, 3, 6);       // golden chest patch (front, +Z)
cylinder(0, 17, 1, 1, 4, 10);  // neck

// ---------------- HEAD ----------------
sphere(0, 21, 2, 2, 10);
sphere(0, 21, 3, 1, 6);        // golden face mask
cube(-1, 20, 4, 1, 21, 4, 8);  // beak base
block(0, 20, 5, 8);            // beak tip
block(-1, 21, 3, 6);           // eye
block(1, 21, 3, 6);            // eye

// crest feathers streaming back off the head
function crestSpike(dx, extra, color) {
  line(dx, 22, 1, dx * 2, 27 + extra, -2 - extra, color);
}
crestSpike(0, 3, 10);
crestSpike(1, 1, 6);
crestSpike(-1, 1, 6);
crestSpike(2, -1, 10);
crestSpike(-2, -1, 10);

// ---------------- SUNBURST (fire halo behind head/back) ----------------
for (let a = 0; a < 12; a++) {
  const ang = (a / 12) * Math.PI * 2;
  const len = 6 + (a % 3) * 2;
  const ex = Math.round(Math.sin(ang) * len);
  const ey = 18 + Math.round(Math.cos(ang) * len * 0.6);
  const ez = -4 - Math.round(Math.abs(Math.cos(ang)) * len * 0.5);
  line(0, 18, -2, ex, ey, ez, a % 2 === 0 ? 10 : 6);
}

// ---------------- WINGS ----------------
function buildWing(sign) {
  const shoulderX = sign * 3, shoulderY = 17, shoulderZ = 0;
  const numFeathers = 9;
  for (let f = 0; f < numFeathers; f++) {
    const t = f / (numFeathers - 1);
    const length = 17 - Math.round(t * 5);
    const tipX = shoulderX + sign * length;
    const tipY = shoulderY + 4 - Math.round(t * 10);
    const tipZ = shoulderZ - Math.round(t * 3) + 1;
    const color = (f % 3 === 0) ? 6 : 10;
    const rootY = shoulderY - Math.round(t * 2);
    line(shoulderX, rootY, shoulderZ, tipX, tipY, tipZ, color);
    line(shoulderX, rootY - 1, shoulderZ, tipX, tipY - 1, tipZ, color);
    if (f < 4) {
      block(tipX + sign, tipY, tipZ, 12); // bright feather-tip highlight
    }
  }
  sphere(shoulderX, shoulderY, shoulderZ, 3, 10); // wing covert mass
}
buildWing(1);
buildWing(-1);

// ---------------- TAIL (streaming down into the fire) ----------------
for (let i = 0; i < 7; i++) {
  const spread = i - 3;
  const startX = Math.round(spread * 1.2);
  const startY = 13;
  const startZ = -2;
  const length = 12 + Math.abs(spread) * 2;
  const endX = startX + Math.round(spread * 1.5);
  const endY = 1;
  const endZ = startZ - Math.round(length * 0.6);
  const color = (i % 2 === 0) ? 10 : 6;
  line(startX, startY, startZ, endX, endY, endZ, color);
  line(startX, startY - 1, startZ, endX, endY, endZ - 1, color);
}

// ---------------- FLOATING EMBERS ----------------
for (let i = 0; i < 30; i++) {
  const ang = i * 2.4;
  const rad = 4 + (i % 6);
  const x = Math.round(Math.cos(ang) * rad);
  const z = Math.round(Math.sin(ang) * rad);
  const y = 2 + (i % 10) + Math.round(Math.sin(i) * 2);
  block(x, y, z, i % 3 === 0 ? 6 : 10);
}
```
