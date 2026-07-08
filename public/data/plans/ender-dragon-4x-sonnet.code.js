// ender-dragon-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ================= THE ENDER DRAGON =================

function lerp(a, b, t) { return a + (b - a) * t; }
function lerp3(p, q, t) { return [lerp(p[0], q[0], t), lerp(p[1], q[1], t), lerp(p[2], q[2], t)]; }
function rnd(n) { return Math.round(n); }

function spike(x, y, z, height, id) {
  for (let h = 0; h < height; h++) {
    const w = Math.max(0, Math.floor((height - h) / 2) - 1);
    if (w <= 0) block(x, y + h, z, id);
    else cube(x - w, y + h, z - w, x + w, y + h, z + w, id);
  }
}

function membraneFan(shoulder, tipA, tipB, id, steps) {
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const pa = lerp3(shoulder, tipA, t);
    const pb = lerp3(shoulder, tipB, t);
    line(rnd(pa[0]), rnd(pa[1]), rnd(pa[2]), rnd(pb[0]), rnd(pb[1]), rnd(pb[2]), id);
  }
}

function leg(x, z, topY, id) {
  cylinder(x, 0, z, 1, topY, id);
  // clawed foot
  block(x, 0, z - 1, id); block(x, 0, z + 1, id);
  block(x - 1, 0, z, id); block(x + 1, 0, z, id);
  block(x, 0, z, id);
}

function endCrystalPillar(px, pz, h) {
  cylinder(px, 0, pz, 1, h, COBBLE);
  cube(px - 1, h, pz - 1, px + 1, h, pz + 1, COBBLE);
  sphere(px, h + 2, pz, 1, GLASS);
  block(px, h + 3, pz, GLASS);
  line(px - 1, h, pz - 1, px - 1, h + 2, pz - 1, OAK_LOG);
  line(px + 1, h, pz - 1, px + 1, h + 2, pz - 1, OAK_LOG);
  line(px - 1, h, pz + 1, px - 1, h + 2, pz + 1, OAK_LOG);
  line(px + 1, h, pz + 1, px + 1, h + 2, pz + 1, OAK_LOG);
}

// ---------- Spine: tail -> body -> neck (front is NORTH / -Z) ----------
const spine = [
  [0, 5, 21, 0.6],   // tail tip
  [0, 4, 18, 1.0],
  [0, 4, 15, 1.4],
  [0, 4, 12, 1.9],
  [0, 5, 9, 2.4],    // hindquarters hump
  [0, 6, 6, 2.9],
  [0, 7, 3, 3.1],    // tallest central hump
  [0, 7, 0, 2.9],
  [0, 7, -3, 2.4],   // shoulders / neck base
  [0, 8, -5, 1.9],
  [1, 10, -7, 1.6],
  [1, 12, -9, 1.3],
  [0, 13, -11, 1.1],
  [0, 14, -13, 1.0], // neck top, meets skull
];

for (let i = 0; i < spine.length; i++) {
  const [x, y, z, r] = spine[i];
  sphere(x, y, z, Math.max(1, rnd(r)), (i % 3 === 0) ? COBBLE : STONE);
  if (i < spine.length - 1) {
    const [x2, y2, z2, r2] = spine[i + 1];
    const steps = 4;
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const px = lerp(x, x2, t), py = lerp(y, y2, t), pz = lerp(z, z2, t);
      const pr = lerp(r, r2, t);
      const bid = ((rnd(px) + rnd(py) + rnd(pz)) % 5 === 0) ? COBBLE : STONE;
      sphere(rnd(px), rnd(py), rnd(pz), Math.max(1, rnd(pr)), bid);
    }
  }
  // dorsal spike ridge
  if (i >= 1) {
    const h = Math.max(2, rnd(r * 1.4));
    spike(x, y + rnd(r), z, h, (i % 2 === 0) ? STONE : COBBLE);
  }
}

// tail blade fin at the very tip
cube(-2, 5, 20, 2, 5, 22, STONE);
cube(-1, 4, 21, 1, 6, 21, STONE);

// ---------- Head ----------
cube(-2, 13, -15, 2, 17, -12, STONE);          // back skull
cube(-1, 13, -19, 1, 15, -15, STONE);          // snout
cube(-1, 13, -19, 1, 13, -15, AIR);            // mouth gap
cube(-1, 11, -19, 1, 12, -15, COBBLE);         // lower jaw
cube(-1, 12, -18, 1, 12, -17, BRICK);          // mouth interior
for (let tx = -1; tx <= 1; tx++) {
  block(tx, 13, -16, SNOW); // upper teeth
  block(tx, 12, -16, SNOW); // lower teeth
}
block(0, 12, -19, SNOW);   // tip fang
spike(-2, 17, -14, 4, STONE); // left horn
spike(2, 17, -14, 4, STONE);  // right horn
spike(0, 17, -13, 3, COBBLE); // center brow horn
block(-2, 15, -15, GLASS); block(-2, 15, -14, GLASS); // left eye
block(2, 15, -15, GLASS); block(2, 15, -14, GLASS);   // right eye

// ---------- Legs ----------
leg(-3, -1, 5, COBBLE); // front left
leg(3, -1, 5, COBBLE);  // front right
leg(-3, 6, 4, COBBLE);  // back left
leg(3, 6, 4, COBBLE);   // back right

// ---------- Wings ----------
for (const sign of [1, -1]) {
  const shoulder = [sign * 2, 7, -2];
  const tipA = [sign * 9, 10, -5];
  const tipB = [sign * 15, 12, -2];
  const tipC = [sign * 19, 9, 3];
  const tipD = [sign * 15, 5, 7];

  line(shoulder[0], shoulder[1], shoulder[2], tipA[0], tipA[1], tipA[2], OAK_LOG);
  line(shoulder[0], shoulder[1], shoulder[2], tipB[0], tipB[1], tipB[2], OAK_LOG);
  line(shoulder[0], shoulder[1], shoulder[2], tipC[0], tipC[1], tipC[2], OAK_LOG);
  line(shoulder[0], shoulder[1], shoulder[2], tipD[0], tipD[1], tipD[2], OAK_LOG);

  membraneFan(shoulder, tipA, tipB, STONE, 18);
  membraneFan(shoulder, tipB, tipC, STONE, 18);
  membraneFan(shoulder, tipC, tipD, COBBLE, 14);

  // wing claw hooks at leading-edge tips
  spike(tipA[0], tipA[1], tipA[2], 2, STONE);
  spike(tipB[0], tipB[1], tipB[2], 2, STONE);

  // shoulder joint bump
  sphere(shoulder[0], shoulder[1], shoulder[2], 1, COBBLE);

  // battle-worn tears in the membrane
  sphere(rnd(lerp(tipB[0], tipC[0], 0.5)), rnd(lerp(tipB[1], tipC[1], 0.5)) , rnd(lerp(tipB[2], tipC[2], 0.5)), 1, AIR);
  sphere(rnd(lerp(shoulder[0], tipC[0], 0.7)), rnd(lerp(shoulder[1], tipC[1], 0.7)), rnd(lerp(shoulder[2], tipC[2], 0.7)), 1, AIR);
}

// ---------- End crystal pillars flanking the dragon ----------
endCrystalPillar(-14, -4, 6);
endCrystalPillar(14, 10, 6);
```
