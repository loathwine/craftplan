// unicorn-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Rearing unicorn, facing north (-Z) =====
const WHITE = SNOW;
const HORNC = ICE;
const HOOF = STONE;
const EYE = STONE;
const RAINBOW = [BRICK, GLASS, ICE, LEAVES, SNOW];

function ellipsoidBand(cx, cy, cz, rx, ry, rz, id) {
  const CX = Math.round(cx), CY = Math.round(cy), CZ = Math.round(cz);
  const RX = Math.ceil(rx), RY = Math.ceil(ry), RZ = Math.ceil(rz);
  for (let x = -RX; x <= RX; x++) {
    for (let y = -RY; y <= RY; y++) {
      for (let z = -RZ; z <= RZ; z++) {
        if ((x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz) <= 1) {
          block(CX+x, CY+y, CZ+z, id);
        }
      }
    }
  }
}

function tubeChain(points, radii, id, stepsPerSeg) {
  for (let s = 0; s < points.length - 1; s++) {
    const p0 = points[s], p1 = points[s+1];
    const r0 = radii[s], r1 = radii[s+1];
    for (let i = 0; i <= stepsPerSeg; i++) {
      if (s > 0 && i === 0) continue;
      const t = i / stepsPerSeg;
      const x = p0[0] + (p1[0]-p0[0]) * t;
      const y = p0[1] + (p1[1]-p0[1]) * t;
      const z = p0[2] + (p1[2]-p0[2]) * t;
      const r = r0 + (r1-r0) * t;
      const rr = Math.max(1, Math.round(r));
      sphere(Math.round(x), Math.round(y), Math.round(z), rr, id);
    }
  }
}

// ---------- HIND LEGS (planted, weight-bearing) ----------
tubeChain(
  [[-2.5,0,8.5],[-2.7,3,9],[-2.5,6,7.5],[-1.5,9,6]],
  [1.0,1.1,1.3,1.8], WHITE, 5);
sphere(-3, 0, 9, 1, HOOF);

tubeChain(
  [[2.5,0,8.5],[2.7,3,9],[2.5,6,7.5],[1.5,9,6]],
  [1.0,1.1,1.3,1.8], WHITE, 5);
sphere(3, 0, 9, 1, HOOF);

// ---------- FRONT LEGS (raised, kicking forward, mid-rear) ----------
tubeChain(
  [[-2,15,-1],[-3,12,-4],[-3,10,-6],[-2.5,9,-7.5]],
  [1.6,1.3,1.0,0.9], WHITE, 5);
sphere(-3, 9, -8, 1, HOOF);

tubeChain(
  [[2,15,-1],[3,12,-4],[3,10,-6],[2.5,9,-7.5]],
  [1.6,1.3,1.0,0.9], WHITE, 5);
sphere(3, 9, -8, 1, HOOF);

// ---------- TORSO (overlapping ellipsoids, hip -> chest, tilted up-forward) ----------
ellipsoidBand(0, 9.5, 7, 2.6, 2.6, 3.0, WHITE);
ellipsoidBand(0, 11, 4, 2.9, 2.8, 3.2, WHITE);
ellipsoidBand(0, 12.5, 1, 3.0, 2.8, 3.0, WHITE);
ellipsoidBand(0, 14, -1, 2.4, 2.3, 2.6, WHITE);

// ---------- NECK ----------
tubeChain(
  [[0,15,-1.5],[0,17.5,-3],[0,20,-4],[0,22.5,-5]],
  [2.2,1.9,1.6,1.4], WHITE, 6);

// ---------- HEAD ----------
ellipsoidBand(0, 24, -6, 1.7, 1.6, 2.1, WHITE);
tubeChain([[0,23.3,-6.2],[0,22.6,-7.6],[0,22.4,-9]], [1.0,0.8,0.6], WHITE, 4);
// ears
tubeChain([[-0.9,25.3,-5.6],[-1.1,27,-6]], [0.6,0.2], WHITE, 3);
tubeChain([[0.9,25.3,-5.6],[1.1,27,-6]], [0.6,0.2], WHITE, 3);
// eyes
block(-1.1|0, 24, -7, EYE);
block(1, 24, -7, EYE);
// muzzle nostrils/mouth accent
block(0, 22.3, -9, HOOF);

// ---------- HORN (spiraling) ----------
(function horn() {
  const base = [0, 26.2, -6.4];
  const tip = [0.2, 31.5, -9.5];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = base[0] + (tip[0]-base[0]) * t + Math.sin(t * Math.PI * 5) * 0.35 * (1-t);
    const y = base[1] + (tip[1]-base[1]) * t;
    const z = base[2] + (tip[2]-base[2]) * t + Math.cos(t * Math.PI * 5) * 0.35 * (1-t);
    const r = Math.max(1, Math.round(1.0 - t * 0.85));
    sphere(Math.round(x), Math.round(y), Math.round(z), r, HORNC);
  }
  // sparkle around tip
  block(1, 32, -9, GLASS);
  block(-1, 32, -10, ICE);
  block(1, 33, -10, GLASS);
})();

// ---------- MANE (rainbow strands flowing along neck/back) ----------
(function mane() {
  const spine = [
    [0,25.5,-5.2],[0,23,-4],[0,20.5,-2.5],[0,18,-0.5],
    [0,15.5,2],[0,13,4.5],[0,10.5,6.5],[0,9.3,7.8]
  ];
  const strandOffsets = [-1.4,-0.7,0,0.7,1.4];
  for (let si = 0; si < strandOffsets.length; si++) {
    const off = strandOffsets[si];
    const color = RAINBOW[si % RAINBOW.length];
    const pts = spine.map((p, idx) => {
      const wave = Math.sin(idx * 0.9 + si) * 0.5;
      return [p[0] + off + wave, p[1] + Math.abs(off) * -0.3, p[2] + wave * 0.6];
    });
    const radii = pts.map(() => 1);
    tubeChain(pts, radii, color, 3);
  }
})();

// ---------- TAIL (rainbow flowing strands, curling behind) ----------
(function tail() {
  const dock = [0, 9.5, 9];
  const curve = [
    dock,
    [0, 11, 11.5],
    [0.5, 12.5, 14],
    [0.5, 11, 16],
    [0, 8.5, 17.5]
  ];
  const strandOffsets = [-1.2,-0.5,0.2,0.9];
  for (let si = 0; si < strandOffsets.length; si++) {
    const off = strandOffsets[si];
    const color = RAINBOW[(si + 2) % RAINBOW.length];
    const pts = curve.map((p, idx) => {
      const wave = Math.sin(idx * 1.1 + si * 1.7) * 0.6;
      return [p[0] + off + wave, p[1] + wave * 0.4, p[2] + off * 0.3];
    });
    const radii = [1.4, 1.2, 1.0, 0.8, 0.6];
    tubeChain(pts, radii, color, 4);
  }
})();
```
