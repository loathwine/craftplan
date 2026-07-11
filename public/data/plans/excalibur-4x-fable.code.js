// excalibur-4x-fable — prompt:
// Excalibur in the stone...

const AIRC = AIR;

// ---- clear vegetation over the build site (targeted, AIR is free) ----
cube(-12, 1, -14, 12, 13, 12, AIRC);
cube(-9, 1, 13, 2, 10, 17, AIRC);          // arch site (south)
cube(-16, 1, -8, -12, 8, -3, AIRC);        // west monolith
cube(12, 1, -7, 15, 8, -2, AIRC);          // east monolith
cube(-15, 1, 7, -12, 7, 10, AIRC);
cube(11, 1, 8, 14, 8, 11, AIRC);

// ---- ancient flagstone plaza (foreground base) ----
disk(0, -1, 1, 10, STONE);
disk(0, 0, 1, 10, COBBLE);
// weathered stone ring inlay
for (let a = 0; a < 32; a++) {
  const ang = a * Math.PI / 16;
  const rx = Math.round(8 * Math.cos(ang));
  const rz = Math.round(8 * Math.sin(ang)) + 1;
  block(rx, 0, rz, STONE);
}
// grass breaking through the old flagstones
[[-6,-3],[5,-5],[-8,3],[7,5],[-3,8],[2,-8],[8,-2],[-7,7],[4,7],[-5,-7]].forEach(p => {
  block(p[0], 0, p[1], GRASS);
});

// ---- the stone: rugged boulder cluster ----
sphere(0, 0, 1, 6, STONE);
sphere(-4, -1, 2, 4, STONE);
sphere(4, 0, -1, 4, STONE);
sphere(2, 1, 4, 3, STONE);
sphere(-2, 0, -3, 3, STONE);
// weathered cobble patches
sphere(-3, 2, -3, 2, COBBLE);
sphere(4, 1, 2, 2, COBBLE);
sphere(0, 4, 3, 2, COBBLE);
block(-5, 2, 0, COBBLE);
block(2, 4, -3, COBBLE);
// moss creeping up the south and shaded sides
sphere(4, 3, 4, 2, LEAVES);
block(-5, 1, 4, LEAVES);
block(-4, 3, 2, LEAVES);
block(5, 2, 0, LEAVES);
block(-1, 5, 3, LEAVES);
block(1, 1, 6, GRASS);
block(-3, 0, 5, GRASS);

// runes carved on the north (camera-facing) face of the stone
const glyphs = [[-4,1],[-4,2],[-3,3],[-2,1],[-2,3],[0,2],[0,3],[2,1],[2,2],[2,3],[3,2],[4,1],[4,3]];
glyphs.forEach(g => {
  block(g[0], g[1], -5, BRICK);
  block(g[0], g[1], -4, BRICK);
});

// magic frost-cracks radiating from where the blade pierces the stone
line(1, 5, 1, 4, 4, 3, ICE);
line(-1, 5, 1, -4, 4, -1, ICE);
line(0, 5, 2, 2, 4, 5, ICE);
line(0, 5, 0, -2, 4, -3, ICE);
block(0, 6, 0, ICE);
block(1, 6, 2, ICE);

// ---- EXCALIBUR (leans slightly east for drama, broad face to camera) ----
function bladeX(y) { return y < 12 ? 0 : (y < 20 ? 1 : 2); }
for (let y = 4; y <= 21; y++) {
  const xc = bladeX(y);
  block(xc - 1, y, 1, SNOW);
  block(xc + 1, y, 1, SNOW);
  block(xc, y, 1, ICE);          // glowing fuller down the blade's center
}
// golden crossguard
cube(-2, 22, 1, 6, 22, 1, SAND);
block(-2, 21, 1, SAND);
block(6, 21, 1, SAND);
cube(1, 23, 1, 3, 23, 1, SAND);
block(2, 22, 0, SAND);           // boss facing the camera
// leather-wrapped grip
block(2, 24, 1, OAK_LOG);
block(2, 25, 1, BRICK);
block(2, 26, 1, OAK_LOG);
block(2, 27, 1, BRICK);
// golden pommel
sphere(2, 28, 1, 1, SAND);
block(2, 29, 1, SAND);

// ---- pilgrim path from the north (camera side) ----
for (let z = -9; z >= -16; z--) {
  const w = (z % 2 === 0) ? 1 : 0;
  for (let x = -1 - w; x <= 1 + w; x++) {
    block(x, 0, z, (x + z) % 2 === 0 ? COBBLE : STONE);
  }
}
// brazier posts flanking the plaza entrance
[[-4, -9], [4, -9]].forEach(p => {
  cube(p[0], 0, p[1], p[0], 2, p[1], COBBLE);
  block(p[0], 3, p[1], BRICK);
  block(p[0], 4, p[1], SAND);
});

// ---- failed knights' swords, abandoned in the courtyard ----
function miniSword(x, z, h, mat) {
  cube(x, 0, z, x, h - 2, z, mat);
  block(x - 1, h - 1, z, PLANKS);
  block(x, h - 1, z, PLANKS);
  block(x + 1, h - 1, z, PLANKS);
  block(x, h, z, OAK_LOG);
}
miniSword(-6, -6, 4, COBBLE);
miniSword(7, -5, 3, STONE);
miniSword(-8, 4, 3, COBBLE);
miniSword(5, 8, 4, STONE);

// ---- ring of standing monoliths (background/foreground separation) ----
function monolith(x, z, h) {
  cube(x, -1, z, x + 1, h, z, STONE);
  block(x, h + 1, z, COBBLE);
  block(x + 1, h - 1, z, COBBLE);
  block(x, Math.floor(h / 2), z - 1, BRICK);   // rune facing north
}
monolith(-14, -5, 5);
monolith(13, -4, 6);
monolith(-13, 8, 4);
monolith(12, 9, 5);
// toppled, broken monolith — time has passed here
cube(7, 0, -8, 10, 0, -7, STONE);
cube(8, 1, -8, 9, 1, -7, COBBLE);
block(11, 0, -8, COBBLE);

// ---- ruined arch in the far south (backdrop behind the stone) ----
cube(-6, -1, 15, -5, 4, 15, STONE);
cube(-1, -1, 15, 0, 4, 15, STONE);
cube(-6, 5, 15, 0, 5, 15, STONE);
block(-6, 6, 15, COBBLE);
block(0, 6, 15, COBBLE);
block(-3, 5, 15, AIRC);          // crumbled gap in the lintel
block(-5, 2, 14, BRICK);
block(-1, 3, 14, BRICK);
// scattered rubble at its feet
block(-3, 0, 13, COBBLE);
block(-4, 0, 14, STONE);
block(1, 0, 14, COBBLE);

// ---- background rocks to seat the scene ----
sphere(9, 0, 6, 3, STONE);
sphere(-9, -1, 7, 3, STONE);
sphere(-8, 0, -6, 2, COBBLE);
block(-8, 2, -6, LEAVES);
block(9, 3, 6, LEAVES);