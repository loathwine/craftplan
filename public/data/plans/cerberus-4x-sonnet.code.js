// cerberus-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===== Cerberus, the three-headed hellhound =====
// Facing NORTH (-Z). Heads cluster at the front, body/tail run south (+Z).

function lerp(a, b, t) { return a + (b - a) * t; }

function tube(x1, y1, z1, x2, y2, z2, r1, r2, steps, id) {
  const dist = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1));
  const n = Math.max(steps, dist);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = Math.round(lerp(x1, x2, t));
    const y = Math.round(lerp(y1, y2, t) + Math.sin(t * Math.PI) * 1.5); // slight arch
    const z = Math.round(lerp(z1, z2, t));
    const r = Math.round(lerp(r1, r2, t));
    sphere(x, y, z, r, id);
  }
}

function leg(x1, x2, z1, z2, clawZ) {
  cube(x1, 0, z1, x2, 5, z2, COBBLE);
  cube(x1, 2, z1, x2, 3, z2, STONE); // knee band highlight
  block(x1, 0, clawZ, SNOW);
  block(x2, 0, clawZ, SNOW);
}

function buildHead(cx, baseY, cz) {
  // skull
  cube(cx - 2, baseY, cz - 1, cx + 2, baseY + 3, cz + 2, COBBLE);
  cube(cx - 1, baseY + 4, cz, cx + 1, baseY + 4, cz + 1, STONE); // skull ridge
  // snout (points north, toward camera)
  cube(cx - 1, baseY, cz - 4, cx + 1, baseY + 1, cz - 2, STONE);
  block(cx, baseY, cz - 4, COBBLE); // nose
  // jaw / teeth
  cube(cx - 1, baseY - 1, cz - 3, cx + 1, baseY - 1, cz - 2, COBBLE); // lower jaw
  block(cx - 1, baseY - 1, cz - 3, SNOW);
  block(cx + 1, baseY - 1, cz - 3, SNOW);
  block(cx, baseY - 1, cz - 3, SNOW);
  block(cx - 1, baseY, cz - 3, SNOW); // upper fang
  block(cx + 1, baseY, cz - 3, SNOW); // upper fang
  block(cx, baseY - 1, cz - 4, BRICK); // tongue peeking out
  // glowing eyes
  block(cx - 1, baseY + 2, cz - 1, BRICK);
  block(cx + 1, baseY + 2, cz - 1, BRICK);
  // ears
  cube(cx - 3, baseY + 3, cz, cx - 2, baseY + 5, cz + 1, COBBLE);
  cube(cx + 2, baseY + 3, cz, cx + 3, baseY + 5, cz + 1, COBBLE);
  block(cx - 3, baseY + 6, cz, COBBLE);
  block(cx + 3, baseY + 6, cz, COBBLE);
  // furry ruff collar where neck meets skull
  hollowCube(cx - 2, baseY - 1, cz + 1, cx + 2, baseY - 1, cz + 3, OAK_LOG);
}

// ---------- LEGS ----------
leg(-3, -2, -2, -1, -3);
leg(2, 3, -2, -1, -3);
leg(-3, -2, 6, 7, 8);
leg(2, 3, 6, 7, 8);

// ---------- TORSO ----------
cube(-4, 5, -2, 4, 11, 7, COBBLE);          // main body, dark fur
cube(-3, 5, -1, 3, 5, 6, STONE);            // belly underside, lighter
cube(-4, 8, -2, -4, 10, 7, STONE);          // left flank shading stripe
cube(4, 8, -2, 4, 10, 7, STONE);            // right flank shading stripe
cube(-2, 5, -3, 2, 7, -2, OAK_LOG);         // chest mane tuft

// spine ridge tufts
for (let z = -1; z <= 6; z += 2) {
  cube(-1, 12, z, 1, 13, z, OAK_LOG);
}

// tail: curls up and back from torso rear, flaming tip
tube(0, 10, 7, 0, 15, 11, 2, 1, 8, COBBLE);
sphere(0, 16, 12, 1, BRICK);
block(1, 17, 12, BRICK);
block(-1, 16, 11, BRICK);
block(0, 18, 12, BRICK);

// ---------- NECKS + HEADS ----------
// collar spike rings at shoulders
function collarSpikes(sx, sz) {
  block(sx - 2, 9, sz, STONE);
  block(sx + 2, 9, sz, STONE);
  block(sx, 9, sz - 2, STONE);
  block(sx - 2, 10, sz, OAK_LOG);
  block(sx + 2, 10, sz, OAK_LOG);
}

// LEFT head
collarSpikes(-3, -2);
tube(-3, 9, -2, -6, 13, -7, 2, 2, 9, COBBLE);
buildHead(-6, 13, -8);

// CENTER head (dominant, tallest/furthest forward)
collarSpikes(0, -2);
tube(0, 9, -2, 0, 15, -8, 2, 2, 10, COBBLE);
buildHead(0, 15, -9);

// RIGHT head
collarSpikes(3, -2);
tube(3, 9, -2, 6, 13, -7, 2, 2, 9, COBBLE);
buildHead(6, 13, -8);

// stray embers around the front paws (hellhound atmosphere)
block(-3, 0, -4, BRICK);
block(3, 0, -4, BRICK);
block(0, 0, -6, BRICK);
```
