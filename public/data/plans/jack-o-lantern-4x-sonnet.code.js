// jack-o-lantern-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Main jack-o'-lantern pumpkin =====
const y0Main = 6, AMain = 8, BMain = 7, pMain = 0.4;
function Rmain(y) {
  const t = (y - y0Main) / BMain;
  const val = 1 - t * t;
  if (val <= 0) return 0;
  return Math.round(AMain * Math.pow(val, pMain));
}

// Body (flattened ellipsoid = pumpkin silhouette, flat-ish top/bottom)
for (let y = 0; y <= 12; y++) {
  const r = Rmain(y);
  if (r > 0) disk(0, y, 0, r, BRICK);
}

// Vertical ridge grooves (skip the front arc reserved for the face)
for (let deg = 0; deg < 360; deg += 24) {
  if (deg >= 200 && deg <= 340) continue;
  const rad = deg * Math.PI / 180;
  for (let y = 1; y < 12; y++) {
    const r = Rmain(y);
    if (r < 3) continue;
    const x = Math.round(r * Math.cos(rad));
    const z = Math.round(r * Math.sin(rad));
    block(x, y, z, AIR);
  }
}

// Carve a face feature: cuts 2 blocks of AIR into the shell then 1 block
// of SAND behind it, so the opening reads as a warm glow from inside.
function carveFace(dx, dy) {
  const y = y0Main + dy;
  const r = Rmain(y);
  if (Math.abs(dx) > r) return;
  const zf = -Math.round(Math.sqrt(Math.max(0, r * r - dx * dx)));
  block(dx, y, zf, AIR);
  block(dx, y, zf + 1, AIR);
  block(dx, y, zf + 2, SAND);
}

// Left eye (triangle, apex up)
carveFace(-3, 3);
for (let dx = -4; dx <= -2; dx++) carveFace(dx, 2);
for (let dx = -5; dx <= -1; dx++) carveFace(dx, 1);
// Right eye (mirrored)
carveFace(3, 3);
for (let dx = 2; dx <= 4; dx++) carveFace(dx, 2);
for (let dx = 1; dx <= 5; dx++) carveFace(dx, 1);
// Nose (small triangle)
carveFace(0, 1);
for (let dx = -1; dx <= 1; dx++) carveFace(dx, 0);
// Mouth: zigzag teeth — even columns are shallow "teeth", odd columns are
// deep gaps between them
for (let dx = -5; dx <= 5; dx++) {
  const isTooth = dx % 2 === 0;
  const bottom = isTooth ? -2 : -4;
  for (let dy = -2; dy >= bottom; dy--) carveFace(dx, dy);
}
carveFace(-6, -1);
carveFace(6, -1);

// Warm light spilling onto the ground in front of the face
block(-2, 0, -9, SAND);
block(0, 0, -9, SAND);
block(2, 0, -9, SAND);

// Stem, slightly bent, with a couple of curling vines
block(0, 13, 0, OAK_LOG);
block(0, 14, 0, OAK_LOG);
block(1, 15, 0, OAK_LOG);
block(1, 16, 0, OAK_LOG);
block(1, 17, 0, LEAVES);
block(2, 16, 0, LEAVES);
block(0, 17, -1, LEAVES);
line(1, 16, 0, 3, 11, -3, LEAVES);
line(1, 15, 0, -3, 10, 2, LEAVES);

// ===== Smaller companion jack-o'-lanterns (pumpkin-patch feel) =====
function buildSmallPumpkin(cx, cz, y0, A, B) {
  function R(y) {
    const t = (y - y0) / B;
    const val = 1 - t * t;
    if (val <= 0) return 0;
    return Math.round(A * Math.pow(val, 0.4));
  }
  const H = Math.floor(B);
  for (let y = y0 - H; y <= y0 + H; y++) {
    const r = R(y);
    if (r > 0) disk(cx, y, cz, r, BRICK);
  }
  function carve(dx, dy) {
    const y = y0 + dy;
    const r = R(y);
    if (Math.abs(dx) > r) return;
    const zf = cz - Math.round(Math.sqrt(Math.max(0, r * r - dx * dx)));
    block(cx + dx, y, zf, AIR);
    block(cx + dx, y, zf + 1, SAND);
  }
  carve(-1, 1); carve(-2, 0); carve(1, 1); carve(2, 0);
  for (let dx = -2; dx <= 2; dx++) carve(dx, -1);
  block(cx, y0 + H + 1, cz, OAK_LOG);
  block(cx, y0 + H + 2, cz, LEAVES);
}

buildSmallPumpkin(-12, -6, 3, 4, 3);
buildSmallPumpkin(9, -5, 2, 3, 2);

// Vines trailing along the ground connecting the patch
line(0, 0, 7, -10, 0, -4, LEAVES);
line(0, 0, 7, 8, 0, -4, LEAVES);

// Scattered ground clutter
const clutter = [
  [-6, 0, 3], [-4, 0, 5], [5, 0, 4], [7, 0, 2],
  [-14, 0, -4], [-11, 0, -9], [11, 0, -3], [12, 0, -7],
  [-2, 0, 8], [3, 0, 9]
];
for (const [x, y, z] of clutter) block(x, y, z, LEAVES);
```
