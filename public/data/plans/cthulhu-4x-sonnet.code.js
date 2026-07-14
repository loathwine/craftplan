// cthulhu-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
function lerp(a, b, t) { return a + (b - a) * t; }

function limb(x1, y1, z1, x2, y2, z2, radius, id) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    sphere(Math.round(lerp(x1, x2, t)), Math.round(lerp(y1, y2, t)), Math.round(lerp(z1, z2, t)), radius, id);
  }
}

function membrane(p0, p1, p2, id) {
  const steps = 15;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const ax = lerp(p0[0], p1[0], t), ay = lerp(p0[1], p1[1], t), az = lerp(p0[2], p1[2], t);
    const bx = lerp(p0[0], p2[0], t), by = lerp(p0[1], p2[1], t), bz = lerp(p0[2], p2[2], t);
    const sub = Math.max(1, Math.round(steps * t));
    for (let u = 0; u <= sub; u++) {
      const uu = u / sub;
      block(Math.round(lerp(ax, bx, uu)), Math.round(lerp(ay, by, uu)), Math.round(lerp(az, bz, uu)), id);
    }
  }
}

function claw(hx, hy, hz, dx, dy, dz, len, id) {
  line(hx, hy, hz, hx + dx * len, hy + dy * len, hz + dz * len, id);
  block(hx + dx * len, hy + dy * len, hz + dz * len, SNOW);
}

// ---- crater / muddy shore around the rising beast ----
for (let a = 0; a < 32; a++) {
  const ang = (a / 32) * Math.PI * 2;
  const rx = Math.round(Math.cos(ang) * 13);
  const rz = 4 + Math.round(Math.sin(ang) * 13);
  block(rx, -1, rz, AIR);
  block(rx, -2, rz, AIR);
  block(Math.round(Math.cos(ang) * 15), -2, 4 + Math.round(Math.sin(ang) * 15), SAND);
}

// ---- pedestal / rocky mound ----
disk(0, -2, 4, 10, COBBLE);
disk(0, -1, 4, 9, STONE);
disk(0, 0, 4, 6, STONE);
cube(-9, -2, -2, -6, -1, 0, COBBLE);
cube(6, -2, 9, 9, -1, 11, COBBLE);
cube(-3, -2, 11, 0, -1, 13, STONE);

// ---- legs / haunches (crouched, clawed feet forward toward -Z) ----
[-1, 1].forEach(sign => {
  const hip = [sign * 4, 4, 6];
  const knee = [sign * 6, 2, 0];
  const foot = [sign * 5, 0, -4];
  limb(hip[0], hip[1], hip[2], knee[0], knee[1], knee[2], 3, LEAVES);
  limb(knee[0], knee[1], knee[2], foot[0], foot[1], foot[2], 2, LEAVES);
  cube(foot[0] - 2, -1, foot[2] - 1, foot[0] + 2, 0, foot[2] + 2, LEAVES);
  claw(foot[0] - 2, 0, foot[2] - 1, 0, 0, -1, 3, STONE);
  claw(foot[0], 0, foot[2] - 1, 0, 0, -1, 4, STONE);
  claw(foot[0] + 2, 0, foot[2] - 1, 0, 0, -1, 3, STONE);
});

// ---- torso (organic pot-belly taper) ----
for (let y = 4; y <= 16; y++) {
  const t = (y - 4) / 12;
  const r = Math.round(4.5 + 2.5 * Math.sin(Math.PI * t));
  disk(0, y, 5, r, LEAVES);
}
disk(0, 17, 5, 4, LEAVES);
disk(0, 18, 4, 3, LEAVES);

// belly ridges (asymmetric texture)
line(-2, 6, -1, -2, 15, 2, DIRT);
line(1, 7, -1, 1, 14, 2, DIRT);
line(-3, 9, 0, -3, 13, 2, DIRT);

// ---- back spikes / dorsal ridge ----
for (let y = 6; y <= 19; y += 2) {
  const h = 2 + Math.round(Math.sin((y - 6) / 13 * Math.PI) * 2);
  cube(-1, y, 10, 1, y, 10, LEAVES);
  cube(0, y + 1, 10, 0, y + h, 10, COBBLE);
}

// ---- head ----
sphere(0, 21, 3, 4, LEAVES);
hollowSphere(0, 21, 3, 5, AIR); // carve nothing outside skull silhouette (no-op safeguard removed below)
sphere(0, 21, 3, 4, LEAVES);

// horn crown
for (let i = -1; i <= 1; i++) {
  line(i * 2, 24, 2, i * 2 + (i === 0 ? 0 : i), 27, 0, COBBLE);
}

// glowing eyes
cube(-2, 21, -1, -1, 22, -1, GLASS);
cube(1, 21, -1, 2, 22, -1, GLASS);

// ---- tentacled face (8 drooping/curling tentacles) ----
for (let i = 0; i < 8; i++) {
  const ang = (i / 8) * Math.PI * 2;
  const ox = Math.round(Math.cos(ang) * 3);
  const oy = 19 + (i % 2);
  let x = ox, y = oy, z = -1;
  const dx = Math.cos(ang) * 0.4;
  for (let s = 0; s < 9; s++) {
    block(Math.round(x), Math.round(y), Math.round(z), LEAVES);
    x += dx;
    y -= s < 5 ? 1 : 0.4;
    z -= 1 - s * 0.08;
  }
  block(Math.round(x), Math.round(y), Math.round(z), STONE);
}
// two long grasping tentacles reaching to the ground
[-1, 1].forEach(sign => {
  let x = sign * 3, y = 19, z = -1;
  for (let s = 0; s < 20; s++) {
    block(Math.round(x), Math.round(y), Math.round(z), LEAVES);
    x += sign * 0.5 + Math.sin(s * 0.5) * 0.5;
    y -= 0.9;
    z -= 0.3;
  }
});

// ---- arms (thick, reaching down/forward, clawed hands) ----
[-1, 1].forEach(sign => {
  const shoulder = [sign * 6, 15, 6];
  const elbow = [sign * 9, 10, 1];
  const hand = [sign * 7, 5, -3];
  limb(shoulder[0], shoulder[1], shoulder[2], elbow[0], elbow[1], elbow[2], 2, LEAVES);
  limb(elbow[0], elbow[1], elbow[2], hand[0], hand[1], hand[2], 2, LEAVES);
  claw(hand[0] - 1, hand[1] - 1, hand[2], -1, -1, -1, 3, STONE);
  claw(hand[0], hand[1] - 1, hand[2], 0, -1, -1, 4, STONE);
  claw(hand[0] + 1, hand[1] - 1, hand[2], 1, -1, -1, 3, STONE);
});

// ---- wings (bat-like, ribs + membrane) ----
[-1, 1].forEach(sign => {
  const shoulder = [sign * 5, 18, 4];
  const tipA = [sign * 20, 26, -3];
  const tipB = [sign * 22, 18, 3];
  const tipC = [sign * 17, 9, 8];

  line(shoulder[0], shoulder[1], shoulder[2], tipA[0], tipA[1], tipA[2], OAK_LOG);
  line(shoulder[0], shoulder[1], shoulder[2], tipB[0], tipB[1], tipB[2], OAK_LOG);
  line(shoulder[0], shoulder[1], shoulder[2], tipC[0], tipC[1], tipC[2], OAK_LOG);

  membrane(shoulder, tipA, tipB, STONE);
  membrane(shoulder, tipB, tipC, STONE);

  // scalloped trailing notches (free — AIR carve)
  block(tipB[0], tipB[1] - 1, tipB[2] + 1, AIR);
  block(sign * 19, 13, 6, AIR);
});

// ---- small foreground rubble for scale ----
cube(-14, -2, -6, -12, -1, -4, STONE);
cube(11, -2, 10, 13, -1, 12, COBBLE);
block(-13, 0, -5, LEAVES);
block(12, 0, 11, LEAVES);
```
