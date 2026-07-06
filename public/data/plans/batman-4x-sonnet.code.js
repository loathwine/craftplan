// batman-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// BATMAN — dark knight perched on a rooftop, cape spread against a full moon.
// Front faces +Z (chest emblem side). Back/cape faces -Z. Platform sits at y=0.

// ---------- Rooftop platform ----------
cube(-6, 0, -6, 6, 0, 6, STONE);              // rooftop slab
const corners = [[-6,-6],[6,-6],[-6,6],[6,6]];
for (const [cx, cz] of corners) {
  cube(cx - (cx>0?1:0), 1, cz - (cz>0?1:0), cx + (cx>0?0:1), 3, cz + (cz>0?0:1), COBBLE);
  block(cx, 4, cz, STONE); // merlon cap
}
cube(4, 1, -5, 5, 4, -4, BRICK);   // chimney
cube(4, 5, -5, 5, 5, -4, COBBLE);  // chimney cap

for (let x = -6; x <= 6; x++) { block(x, 1, -6, COBBLE); block(x, 1, 6, COBBLE); }
for (let z = -6; z <= 6; z++) { block(-6, 1, z, COBBLE); block(6, 1, z, COBBLE); }

// ---------- Legs / boots ----------
cube(-3, 1, -2, -1, 2, 2, COBBLE);
cube(1, 1, -2, 3, 2, 2, COBBLE);
cube(-2, 3, -1, -1, 8, 1, STONE);
cube(1, 3, -1, 2, 8, 1, STONE);

// ---------- Belt ----------
cube(-3, 9, -2, 3, 9, 2, COBBLE);
block(0, 9, 3, SAND);

// ---------- Torso ----------
cube(-3, 10, -2, 3, 15, 2, STONE);

// chest bat emblem
cube(-2, 11, 3, 2, 14, 3, SAND);
block(0, 13, 4, COBBLE);
block(-1, 13, 4, COBBLE);
block(1, 13, 4, COBBLE);
block(-2, 12, 4, COBBLE);
block(2, 12, 4, COBBLE);
block(0, 12, 4, COBBLE);
block(0, 11, 4, COBBLE);

// ---------- Arms ----------
cube(-7, 13, -1, -4, 15, 1, STONE);
cube(4, 13, -1, 7, 15, 1, STONE);
cube(-8, 12, -1, -7, 13, 1, COBBLE);
cube(7, 12, -1, 8, 13, 1, COBBLE);

// ---------- Cape (layered trapezoid, flares wide+deep toward the bottom) ----------
cube(-3, 15, -2, 3, 16, -1, STONE);
cube(-5, 12, -4, 5, 14, -1, STONE);
cube(-8, 8, -6, 8, 11, -2, STONE);
cube(-9, 4, -8, 9, 7, -3, STONE);

// scalloped bottom hem
for (let x = -9; x <= 9; x++) {
  if (Math.abs(x) % 3 === 0) {
    block(x, 4, -3, AIR);
    block(x, 4, -4, AIR);
  }
}
// taper wingtip corners
for (let i = 0; i < 4; i++) {
  cube(9 - i, 7 - i, -8 + i, 9, 7 - i, -3, AIR);
  cube(-9, 7 - i, -8 + i, -9 + i, 7 - i, -3, AIR);
}
// rib lines from collar to wingtips
line(0, 16, -2, 0, 5, -7, COBBLE);
line(0, 16, -2, 8, 6, -3, COBBLE);
line(0, 16, -2, -8, 6, -3, COBBLE);
line(0, 16, -2, 6, 5, -6, COBBLE);
line(0, 16, -2, -6, 5, -6, COBBLE);

// ---------- Head / cowl ----------
cube(-2, 17, -2, 2, 20, 2, STONE);
block(-1, 19, 2, SNOW);
block(1, 19, 2, SNOW);
block(-1, 21, 0, STONE); block(-1, 22, 0, STONE); block(-1, 23, 0, STONE);
block(1, 21, 0, STONE);  block(1, 22, 0, STONE);  block(1, 23, 0, STONE);

// grapple line
line(7, 14, 1, 7, 1, 1, OAK_LOG);

// ---------- Gargoyle sentries ----------
function gargoyle(gx, gz, facing) {
  cube(gx, 1, gz, gx, 2, gz, STONE);
  block(gx, 3, gz, STONE);
  block(gx, 3, gz + facing, COBBLE);
  block(gx - 1, 2, gz, COBBLE);
  block(gx + 1, 2, gz, COBBLE);
}
gargoyle(-5, 5, 1);
gargoyle(5, 5, 1);
gargoyle(-5, -5, -1);
gargoyle(5, -5, -1);

// ---------- Distant city skyline silhouette ----------
const skyline = [[-16, 8], [-11, 12], [-4, 6], [3, 14], [9, 9], [14, 11]];
for (const [bx, bh] of skyline) {
  cube(bx, 1, -20, bx + 1, bh, -19, STONE);
  for (let wy = 3; wy < bh; wy += 3) block(bx, wy, -19, AIR);
}

// ---------- Full moon backdrop ----------
hollowSphere(0, 28, -20, 4, SNOW);

// bats against the moon
function tinyBat(bx, by, bz) {
  block(bx, by, bz, COBBLE);
  block(bx - 1, by, bz, COBBLE);
  block(bx + 1, by, bz, COBBLE);
}
tinyBat(-6, 30, -19);
tinyBat(4, 32, -18);
tinyBat(9, 29, -19);
tinyBat(-10, 26, -18);
```
