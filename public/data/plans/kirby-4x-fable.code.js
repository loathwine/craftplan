// kirby-4x-fable — prompt:
// Kirby...

// Kirby standing on a Warp Star, waving — one arm raised, holding a Star Rod
// Clear the forest vegetation in the build footprint (trees only, ground kept)
cube(-16, 1, -16, 16, 9, 16, AIR);
// Remove tree-stump bases at ground level (trunk cells at y=0 from local geometry)
const stumps = [[1,-13],[-1,-10],[3,-10],[-6,-8],[7,-2],[8,-1],[-15,0],[0,1],[-6,-1],[8,3],[15,3],[-15,2],[-10,8],[-7,8],[-6,9],[-2,7],[-7,4],[-7,5],[-5,13],[-9,15],[-16,15],[-7,-5]];
for (const [x, z] of stumps) block(x, 0, z, AIR);
// Trunks that reach y=-1: clear and patch with grass
for (const [x, z] of [[1,-7],[4,-3],[12,11]]) {
  block(x, 0, z, AIR);
  block(x, -1, z, GRASS);
}

// ---- Warp Star (flat 5-pointed yellow star, one point facing front/+Z) ----
function starPts(cx, cz, R, r, rot) {
  const p = [];
  for (let i = 0; i < 10; i++) {
    const a = rot + i * Math.PI / 5;
    const rad = (i % 2 === 0) ? R : r;
    p.push([cx + rad * Math.cos(a), cz + rad * Math.sin(a)]);
  }
  return p;
}
function inPoly(x, z, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], zi = pts[i][1], xj = pts[j][0], zj = pts[j][1];
    if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
const warp = starPts(0, 0, 12.4, 5.2, Math.PI / 2);
for (let x = -13; x <= 13; x++)
  for (let z = -13; z <= 13; z++)
    if (inPoly(x, z, warp))
      for (let y = -2; y <= 1; y++) block(x, y, z, SAND); // thick slab: seats into terrain dips

// ---- Body: the pink puffball (BRICK = pink) ----
const CY = 12, R = 8;
sphere(0, CY, 0, R, BRICK);

// ---- Feet (dark, OAK_LOG reads as Kirby's maroon shoes), toes forward +Z ----
function ellipsoid(cx, cy, cz, rx, ry, rz, id) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.05) block(x, y, z, id);
      }
}
ellipsoid(-4.5, 3.5, 5, 2.6, 2.5, 4.2, OAK_LOG);
ellipsoid(4.5, 3.5, 5, 2.6, 2.5, 4.2, OAK_LOG);

// ---- Arms: left down (holds rod), right raised waving ----
sphere(-8, 10, 2, 3, BRICK);
sphere(8, 17, 1, 3, BRICK);
sphere(10, 19, 1, 2, BRICK); // wave tip

// ---- Face (on +Z side). Surface-following helper ----
function faceZ(x, y) {
  const dy = y - CY;
  const s = R * R - x * x - dy * dy;
  return s < 0 ? -999 : Math.floor(Math.sqrt(s));
}
// Eyes: tall ovals — white shine on top, dark middle, blue bottom
const eyeRows = [[17, SNOW], [16, STONE], [15, STONE], [14, GLASS], [13, GLASS]];
for (const sx of [-1, 1])
  for (const [y, id] of eyeRows)
    for (const ax of [3, 4]) {
      const x = sx * ax, z = faceZ(x, y);
      if (z > -900) { block(x, y, z, id); block(x, y, z + 1, id); }
    }
// Cheek blush bumps (proud brick ovals)
for (const sx of [-1, 1])
  for (const y of [10, 11]) {
    const x = sx * 6, z = faceZ(x, y);
    if (z > -900) block(x, y, z + 1, BRICK);
  }
// Open happy mouth — carved 3 deep so the shadowed red interior shows
const mouthRows = [[11, 1], [10, 2], [9, 2], [8, 1]];
for (const [y, hw] of mouthRows)
  for (let x = -hw; x <= hw; x++) {
    const z = faceZ(x, y);
    if (z > -900) { block(x, y, z + 1, AIR); block(x, y, z, AIR); block(x, y, z - 1, AIR); }
  }

// ---- Star Rod in the left hand ----
line(-10, 6, 4, -10, 12, 4, OAK_LOG);
const rs = [[-10,13,4],[-10,14,4],[-10,15,4],[-11,14,4],[-9,14,4],[-10,14,3],[-10,14,5],[-11,13,4],[-9,13,4]];
for (const [x, y, z] of rs) block(x, y, z, SAND);

// ---- Floating sparkle stars around Kirby ----
function sparkle(x, y, z) {
  block(x, y, z, SAND);
  block(x + 1, y, z, SAND); block(x - 1, y, z, SAND);
  block(x, y + 1, z, SAND); block(x, y - 1, z, SAND);
}
sparkle(-13, 17, -7);
sparkle(12, 22, -6);
sparkle(8, 25, 7);
sparkle(-9, 24, -10);