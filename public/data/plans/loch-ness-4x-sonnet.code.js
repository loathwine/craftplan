// loch-ness-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
Good, no stray file was created. Here's the build:

```js
function lerp(a, b, t) { return a + (b - a) * t; }
function round(n) { return Math.round(n); }

// ---- Lake surface ----
disk(0, -1, 2, 18, GLASS);
hollowCylinder(2, -1, 6, 3, 1, SNOW);
hollowCylinder(2, -1, 6, 5, 1, SNOW);
hollowCylinder(-5, -1, 9, 3, 1, SNOW);
hollowCylinder(4, -1, 18, 3, 1, SNOW);

// ---- Distant background rocks for depth ----
sphere(-16, 1, -6, 3, STONE);
sphere(16, 0, -4, 3, STONE);
sphere(-14, 0, 18, 2, STONE);
sphere(15, 0, 19, 2, STONE);

// ---- Neck path (S-curve rising from water to head, facing north) ----
function neckPoint(t) {
  const y = -1 + 12 * Math.pow(t, 0.72);
  const z = lerp(10, -9, t);
  const x = 1.8 * Math.sin(t * Math.PI * 0.55) + 1.2 * t;
  return [x, y, z];
}
function neckRadius(t) {
  if (t > 0.88) return lerp(1.3, 0.9, (t - 0.88) / 0.12); // head/jaw taper
  return lerp(2.3, 1.3, t / 0.88);
}
const NECK_STEPS = 40;
for (let i = 0; i <= NECK_STEPS; i++) {
  const t = i / NECK_STEPS;
  const [x, y, z] = neckPoint(t);
  const r = neckRadius(t);
  sphere(round(x), round(y), round(z), Math.max(1, Math.round(r)), LEAVES);
}

// spine ridge spikes along neck
for (let i = 2; i <= NECK_STEPS - 4; i += 2) {
  const t = i / NECK_STEPS;
  const [x, y, z] = neckPoint(t);
  const r = neckRadius(t);
  block(round(x), round(y + r + 1), round(z), STONE);
}

// ---- Head ----
const headT = 1.0;
const [hx, hy, hz] = neckPoint(headT);
sphere(round(hx), round(hy), round(hz), 2, LEAVES);
// snout extending north
sphere(round(hx) - 1, round(hy) - 1, round(hz) - 2, 1, LEAVES);
sphere(round(hx) - 1, round(hy) - 1, round(hz) - 3, 1, LEAVES);
// jaw underside hint
block(round(hx) - 1, round(hy) - 2, round(hz) - 2, LEAVES);
block(round(hx) - 1, round(hy) - 2, round(hz) - 3, LEAVES);
// horn nubs
block(round(hx) - 1, round(hy) + 2, round(hz), STONE);
block(round(hx) + 1, round(hy) + 2, round(hz), STONE);
block(round(hx) - 1, round(hy) + 3, round(hz), STONE);
block(round(hx) + 1, round(hy) + 3, round(hz), STONE);
// eyes
block(round(hx) - 2, round(hy) + 1, round(hz) - 1, STONE);
block(round(hx) + 0, round(hy) + 1, round(hz) - 1, STONE);
block(round(hx) - 2, round(hy) + 1, round(hz) - 2, STONE);
block(round(hx) + 0, round(hy) + 1, round(hz) - 2, STONE);

// ---- Body humps trailing behind (south), mostly submerged ----
const humps = [
  { c: [-5, 1, 9], r: 3 },
  { c: [-1, 1.5, 14], r: 3.5 },
  { c: [4, 1, 18], r: 3 },
];
for (const h of humps) {
  sphere(h.c[0], h.c[1], h.c[2], h.r, LEAVES);
  // scute texture patches
  block(h.c[0] - 1, h.c[1] + h.r, h.c[2], STONE);
  block(h.c[0] + 1, h.c[1] + h.r - 1, h.c[2] + 1, STONE);
  block(h.c[0], h.c[1] + h.r - 1, h.c[2] - 1, STONE);
}

// connector tube: neck base -> hump1 -> hump2 -> hump3 (submerged spine)
function tubeBetween(p0, p1, r0, r1, steps, id) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = round(lerp(p0[0], p1[0], t));
    const y = round(lerp(p0[1], p1[1], t));
    const z = round(lerp(p0[2], p1[2], t));
    const r = Math.max(1, Math.round(lerp(r0, r1, t)));
    sphere(x, y, z, r, id);
  }
}
tubeBetween(neckPoint(0), humps[0].c, 2.2, 2.6, 8, LEAVES);
tubeBetween(humps[0].c, humps[1].c, 2.6, 3.0, 8, LEAVES);
tubeBetween(humps[1].c, humps[2].c, 3.0, 2.6, 8, LEAVES);

// ---- Tail flipper curling out of the water past the last hump ----
const tailBase = [8, 0, 20];
tubeBetween(humps[2].c, tailBase, 2.4, 1.4, 6, LEAVES);
block(9, 0, 21, LEAVES);
block(10, 0, 22, LEAVES);
block(10, 1, 21, LEAVES);
block(11, 0, 21, LEAVES);
block(9, 1, 20, LEAVES);

// ---- Foam / splash flecks around emergence points ----
block(2, -1, 5, SNOW);
block(1, -1, 4, SNOW);
block(-6, -1, 7, SNOW);
block(-4, -1, 6, SNOW);
block(5, -1, 16, SNOW);
block(3, -1, 15, SNOW);
```
