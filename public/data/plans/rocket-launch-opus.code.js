// rocket-launch-opus — prompt:
// a rocket launching into space...

// ===== Rocket launching into space =====
const CZ = 2;

function inR(dx, dz, r) { return dx * dx + dz * dz <= (r + 0.3) * (r + 0.3); }
function solid(y, r, id) {
  const R = Math.ceil(r) + 1;
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++)
    if (inR(dx, dz, r)) block(dx, y, CZ + dz, id);
}
function shell(y, r, id, pred) {
  const R = Math.ceil(r) + 1;
  for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) {
    if (!inR(dx, dz, r)) continue;
    let edge = false;
    for (let ex = -1; ex <= 1; ex++) for (let ez = -1; ez <= 1; ez++)
      if (!inR(dx + ex, dz + ez, r)) edge = true;
    if (edge && (!pred || pred(dx, dz))) block(dx, y, CZ + dz, id);
  }
}

// ---- clear trees around the pad + sightline road ----
cube(-20, 0, -16, 20, 9, 16, AIR);
cube(-3, 0, -22, 3, 8, -17, AIR);

// ---- launch pad ----
disk(0, -1, CZ, 10, LIGHT_GRAY);
shell(-1, 10, YELLOW);
shell(-1, 10, BLACK, (dx, dz) => Math.floor((Math.atan2(dz, dx) + Math.PI) / (Math.PI / 10)) % 2 === 0);
// access road toward camera
cube(-2, -1, -22, 2, -1, -9, GRAY);
for (let z = -22; z <= -9; z += 3) block(0, -1, z, YELLOW);
cube(-2, -1, 13, 2, -1, 22, GRAY);

// ---- exhaust smoke clouds (billowing out along the ground) ----
hollowSphere(-8, 1, 2, 3.5, WHITE);
hollowSphere(-13, 1, 4, 3, LIGHT_GRAY);
hollowSphere(-17, 0, 1, 2.5, WHITE);
hollowSphere(-11, 4, 6, 2.5, WHITE);
hollowSphere(0, 1, 10, 3.5, LIGHT_GRAY);
hollowSphere(0, 5, 11, 3, WHITE);
hollowSphere(7, 1, 8, 3, WHITE);
hollowSphere(12, 1, 9, 2.5, LIGHT_GRAY);
hollowSphere(-4, 0, -4, 2.5, LIGHT_GRAY);
hollowSphere(5, 0, -4, 2, WHITE);

// ---- launch mount ----
cube(-5, 0, -3, -4, 1, -2, GRAY);
cube(4, 0, -3, 5, 1, -2, GRAY);
cube(-5, 0, 6, -4, 1, 7, GRAY);
cube(4, 0, 6, 5, 1, 7, GRAY);
cube(-5, 2, -3, 5, 2, 7, GRAY);
line(-5, 2, -3, 5, 2, -3, BLACK);
shell(2, 4, BLACK); // scorch ring
solid(2, 3, AIR);   // flame hole
// released hold-down clamps
block(3, 3, CZ - 3, IRON); block(-3, 3, CZ - 3, IRON);
block(3, 3, CZ + 3, IRON); block(-3, 3, CZ + 3, IRON);
block(4, 3, CZ - 4, IRON); block(-4, 3, CZ - 4, IRON);

// ---- exhaust plume (widening downward) ----
const plume = [[5, 1], [4, 1.5], [3, 2], [2, 2.5], [1, 3], [0, 3.5]];
for (const [y, r] of plume) {
  solid(y, r, ORANGE);
  if (r - 1 >= 0) solid(y, r - 1, YELLOW);
  solid(y, Math.max(0, r - 2), GLOWSTONE);
  if (y <= 2) shell(y, r, LAVA, (dx, dz) => Math.abs(dx * 7 + dz * 13 + y) % 3 === 0);
}

// ---- rocket ----
// engine bells
const bells = [[0, 0], [2, 0], [-2, 0], [0, 2], [0, -2]];
for (const [ex, ez] of bells) {
  block(ex, 7, CZ + ez, IRON);
  block(ex, 6, CZ + ez, BLACK);
  block(ex + 1, 6, CZ + ez, GRAY); block(ex - 1, 6, CZ + ez, GRAY);
  block(ex, 6, CZ + ez + 1, GRAY); block(ex, 6, CZ + ez - 1, GRAY);
}
// heat shield
solid(8, 3, GRAY);
// first stage
for (let y = 9; y <= 19; y++) shell(y, 3, WHITE);
for (let y = 9; y <= 11; y++) shell(y, 3, BLACK, (dx, dz) => (dx >= 0) === (dz < 0));
for (let y = 16; y <= 18; y++) shell(y, 3, BLACK, (dx, dz) => (dx >= 0) !== (dz < 0));
shell(19, 3, LIGHT_GRAY);
// flag on the north face
block(-1, 15, CZ - 3, BLUE); block(0, 15, CZ - 3, RED); block(1, 15, CZ - 3, RED);
block(-1, 14, CZ - 3, BLUE); block(0, 14, CZ - 3, WHITE); block(1, 14, CZ - 3, WHITE);
block(-1, 13, CZ - 3, RED); block(0, 13, CZ - 3, RED); block(1, 13, CZ - 3, RED);
block(-1, 12, CZ - 3, WHITE); block(0, 12, CZ - 3, WHITE); block(1, 12, CZ - 3, WHITE);
// interstage
shell(20, 3, BLACK);
shell(21, 3, GRAY);
solid(20, 2, GRAY);
// second stage
for (let y = 22; y <= 26; y++) shell(y, 3, WHITE);
shell(22, 3, BLACK, (dx, dz) => (dx >= 0) === (dz < 0));
shell(26, 3, BLACK);
// shoulder + capsule
solid(27, 3, LIGHT_GRAY);
solid(28, 2, IRON);
solid(29, 1.5, IRON);
solid(30, 1, IRON);
block(0, 31, CZ, IRON);
block(0, 28, CZ - 2, NEON_BLUE); // capsule window
// launch escape tower
line(0, 32, CZ, 0, 33, CZ, RED);
block(1, 31, CZ, RED); block(-1, 31, CZ, RED);
// fins (swept, 4 sides)
const finBot = [7, 6, 5], finTop = [14, 11, 8];
for (const [sx, sz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
  for (let k = 1; k <= 3; k++) {
    const d = 3 + k;
    for (let y = finBot[k - 1]; y <= finTop[k - 1]; y++) block(sx * d, y, CZ + sz * d, RED);
  }
}

// ---- flames licking out (open-air FIRE cells) ----
block(2, 5, CZ, FIRE); block(-2, 5, CZ, FIRE); block(0, 5, CZ - 2, FIRE); block(0, 5, CZ + 2, FIRE);
block(3, 3, CZ, FIRE); block(-3, 3, CZ, FIRE); block(0, 3, CZ - 3, FIRE); block(0, 3, CZ + 3, FIRE);
block(-4, 0, 1, FIRE); block(-4, 0, 3, FIRE); block(4, 0, 1, FIRE); block(4, 0, 3, FIRE);
block(-7, 0, -2, FIRE); block(7, 0, -2, FIRE);
block(-2, 3, CZ - 3, FIRE); block(2, 3, CZ + 3, FIRE);

// ---- launch umbilical tower (east) ----
cube(8, 0, -2, 14, 0, 5, GRAY);
for (const [x, z] of [[9, 0], [12, 0], [9, 3], [12, 3]]) line(x, 1, z, x, 30, z, RED);
for (let y = 4; y <= 28; y += 4) {
  line(9, y, 0, 12, y, 0, RED); line(9, y, 3, 12, y, 3, RED);
  line(9, y, 0, 9, y, 3, RED); line(12, y, 0, 12, y, 3, RED);
}
for (let y = 0; y < 28; y += 4) {
  if ((y / 4) % 2) { line(9, y, 0, 12, y + 4, 0, IRON); line(9, y, 0, 9, y + 4, 3, IRON); }
  else { line(12, y, 0, 9, y + 4, 0, IRON); line(9, y, 3, 9, y + 4, 0, IRON); }
}
cube(8, 31, -1, 13, 31, 4, GRAY);
// hammerhead crane
line(6, 32, 1, 18, 32, 1, RED);
cube(16, 31, 0, 17, 31, 2, GRAY);
line(7, 29, 1, 7, 31, 1, IRON);
block(10, 33, 1, NEON_RED);
block(18, 33, 1, NEON_RED);
// elevator cab
cube(10, 12, 1, 11, 13, 2, YELLOW);
// retracted swing arms (swung north, away from the rocket)
for (const y of [16, 25]) {
  cube(9, y, -6, 10, y, -1, GRAY);
  line(9, y + 1, -6, 9, y + 1, -1, YELLOW);
  line(10, y + 1, -6, 10, y + 1, -1, YELLOW);
  cube(9, y + 1, -7, 10, y + 2, -7, WHITE);
}
line(10, 15, -4, 10, 11, -4, BLACK); // dangling umbilical
line(9, 24, -5, 9, 21, -5, BLACK);
// tower lights
block(9, 10, -1, GLOWSTONE);
block(9, 20, -1, GLOWSTONE);

// ---- fuel tanks + pipes ----
sphere(-15, 4, 12, 3, WHITE);
for (const [x, z] of [[-17, 10], [-13, 10], [-17, 14], [-13, 14]]) line(x, -1, z, x, 2, z, GRAY);
line(-12, 0, 11, -5, 0, 7, GRAY);
line(-15, 7, 12, -15, 8, 12, IRON);
sphere(16, 4, 14, 2.5, IRON);
for (const [x, z] of [[14, 12], [18, 12], [14, 16], [18, 16]]) line(x, -1, z, x, 2, z, GRAY);
line(14, 0, 13, 12, 0, 5, GRAY);

// ---- lightning masts ----
line(-13, -1, -6, -13, 24, -6, IRON);
block(-13, 25, -6, NEON_RED);
line(-14, 0, -6, -13, 6, -6, IRON);
line(-12, 0, -6, -13, 6, -6, IRON);
line(6, -1, 15, 6, 22, 15, IRON);
block(6, 23, 15, NEON_RED);

// ---- observation bunker (front-left) ----
cube(-19, -1, -12, -14, 2, -8, GRAY);
cube(-20, 3, -13, -13, 3, -7, LIGHT_GRAY);
line(-18, 2, -12, -15, 2, -12, GLASS);
block(-16, 2, -11, GLOWSTONE);
line(-16, 4, -10, -16, 7, -10, IRON);
block(-16, 8, -10, NEON_BLUE);