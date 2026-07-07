// hydra-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===== Three-Headed Hydra =====
// Faces NORTH (-Z): necks/heads sweep toward -Z, body/tail trail toward +Z.

function lerp(a, b, t) { return a + (b - a) * t; }
function bez(p0, p1, p2, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    z: mt * mt * p0.z + 2 * mt * t * p1.z + t * t * p2.z,
  };
}
function tube(p0, p1, p2, r0, r1, steps, blockId) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = bez(p0, p1, p2, t);
    const r = lerp(r0, r1, t);
    sphere(Math.round(p.x), Math.round(p.y), Math.round(p.z), Math.round(r), blockId);
  }
}

const SKIN = LEAVES;   // scaly green body
const BELLY = SAND;    // pale underside
const HORN = STONE;    // horns/claws/spikes
const EYE = GLASS;     // glowing eyes
const MOUTH = BRICK;   // mouth interior / tongue
const TOOTH = SNOW;    // teeth

// ---------- BODY (spine chain, thick torso tapering into a tail) ----------
const spine = [
  [0, 3, -2, 3.5],
  [0, 4, 1, 4.5],
  [0, 5, 4, 5.0],   // shoulder hump, widest point
  [0, 4, 7, 4.5],
  [0, 3, 10, 3.5],
  [0, 2, 13, 2.6],
  [1, 2, 16, 1.9],
  [2, 1, 19, 1.2],  // tail curls slightly east
];
for (const [x, y, z, r] of spine) {
  sphere(x, y, z, r, SKIN);
}
// pale belly strip along the underside
cube(-2, -1, -1, 2, 0, 15, BELLY);

// dorsal spikes along the back
const spikeZ = [-1, 1, 3, 5, 7, 9, 11, 13];
for (const z of spikeZ) {
  const seg = spine.find(s => Math.abs(s[2] - z) <= 2) || spine[2];
  const topY = Math.round(seg[1] + seg[3]);
  block(0, topY, z, HORN);
  block(0, topY + 1, z, HORN);
}

// ---------- LEGS (4, clawed feet) ----------
const legs = [
  [-4, 0], [4, 0],   // front legs
  [-4, 9], [4, 9],   // rear legs
];
for (const [lx, lz] of legs) {
  cylinder(lx, -2, lz, 1.6, 6, SKIN);
  // clawed foot
  cube(lx - 1, -2, lz - 1, lx + 1, -2, lz + 1, HORN);
  block(lx - 1, -2, lz - 2, HORN);
  block(lx, -2, lz - 2, HORN);
  block(lx + 1, -2, lz - 2, HORN);
}

// ---------- NECKS + HEADS (three heads) ----------
function buildHead(cx, cy, cz, dirX) {
  // dirX: -1 left head splays outward-left, 0 center, 1 right head splays outward-right
  // skull
  sphere(cx, cy, cz, 2.2, SKIN);
  // snout pushing north (-Z) and slightly toward dirX
  sphere(cx + dirX, cy - 0, cz - 2, 1.6, SKIN);
  sphere(cx + dirX, cy - 0, cz - 3, 1.1, SKIN);
  // lower jaw, dropped open
  sphere(cx + dirX, cy - 2, cz - 2, 1.3, SKIN);
  sphere(cx + dirX, cy - 2, cz - 3, 1.0, SKIN);
  // carve mouth gap
  cube(cx + dirX - 1, cy - 1, cz - 4, cx + dirX + 1, cy - 1, cz - 2, AIR);
  // mouth interior
  cube(cx + dirX - 1, cy - 2, cz - 4, cx + dirX + 1, cy - 1, cz - 2, MOUTH);
  // tongue
  line(cx + dirX, cy - 2, cz - 2, cx + dirX, cy - 2, cz - 4, MOUTH);
  // teeth, upper and lower rim
  block(cx + dirX - 1, cy - 1, cz - 4, TOOTH);
  block(cx + dirX + 1, cy - 1, cz - 4, TOOTH);
  block(cx + dirX - 1, cy - 2, cz - 4, TOOTH);
  block(cx + dirX + 1, cy - 2, cz - 4, TOOTH);
  block(cx + dirX, cy - 1, cz - 4, TOOTH);
  // horns
  line(cx - 1, cy + 1, cz, cx - 1, cy + 4, cz - 1, HORN);
  line(cx + 1, cy + 1, cz, cx + 1, cy + 4, cz - 1, HORN);
  // eyes, glowing, facing north
  block(cx - 1, cy, cz - 2, EYE);
  block(cx + 1, cy, cz - 2, EYE);
}

// center neck — tallest, straightest
tube({ x: 0, y: 5, z: -2 }, { x: 0, y: 12, z: -7 }, { x: 0, y: 16, z: -10 }, 2.3, 1.4, 10, SKIN);
buildHead(0, 17, -12, 0);

// left neck — curves outward to -X
tube({ x: -2, y: 4, z: -1 }, { x: -6, y: 10, z: -5 }, { x: -9, y: 13, z: -8 }, 2.1, 1.3, 10, SKIN);
buildHead(-9, 14, -10, -1);

// right neck — curves outward to +X
tube({ x: 2, y: 4, z: -1 }, { x: 6, y: 10, z: -5 }, { x: 9, y: 13, z: -8 }, 2.1, 1.3, 10, SKIN);
buildHead(9, 14, -10, 1);

// ---------- ground scatter for scale/story ----------
sphere(-8, -1, 12, 1, HORN);
sphere(7, -1, 13, 1.2, HORN);
block(-6, -1, 14, HORN);
block(6, -1, 15, HORN);
```
