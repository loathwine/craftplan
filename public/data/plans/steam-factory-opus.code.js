// steam-factory-opus — prompt:
// a Victorian factory with smoking chimneys...

function walls(x1, y1, z1, x2, y2, z2, id) {
  cube(x1, y1, z1, x2, y2, z1, id);
  cube(x1, y1, z2, x2, y2, z2, id);
  if (z2 - z1 > 1) {
    cube(x1, y1, z1 + 1, x1, y2, z2 - 1, id);
    cube(x2, y1, z1 + 1, x2, y2, z2 - 1, id);
  }
}
function ring(x1, y, z1, x2, z2, id) { walls(x1, y, z1, x2, y, z2, id); }

// ---------- clear trees from site + camera sightline ----------
cube(-21, 1, -10, 21, 10, 17, AIR);
cube(-16, 1, -22, 16, 9, -11, AIR);

// ---------- MAIN HALL (x -15..7, z 0..12) ----------
walls(-15, -1, 0, 7, 9, 12, BRICK);
walls(-15, -1, 0, 7, 0, 12, STONE);

function winZ(c, z) {
  cube(c - 1, 2, z, c + 1, 6, z, GLASS);
  cube(c - 1, 4, z, c + 1, 4, z, BLACK);
  block(c, 7, z, GLASS);
  block(c - 1, 7, z, STONE); block(c + 1, 7, z, STONE); block(c, 8, z, STONE);
}
function winX(c, x) {
  cube(x, 2, c - 1, x, 6, c + 1, GLASS);
  cube(x, 4, c - 1, x, 4, c + 1, BLACK);
  block(x, 7, c, GLASS);
  block(x, 7, c - 1, STONE); block(x, 7, c + 1, STONE); block(x, 8, c, STONE);
}
for (const c of [-13, -9, 1, 5]) {
  winZ(c, 0);
  cube(c - 1, 1, -1, c + 1, 1, -1, LIGHT_GRAY);
  block(c, 5, 1, GLOWSTONE);
  winZ(c, 12);
}
winX(2, -15); winX(10, -15);
winX(3, 7); winX(6, 7); winX(9, 7);

// pilasters
for (const x of [-15, -11, -7, -1, 3, 7]) {
  cube(x, 1, -1, x, 8, -1, BRICK);
  cube(x, -1, -1, x, 0, -1, STONE);
}
// cornice
cube(-16, 9, -1, 8, 9, -1, STONE);

// slate gable roof along X
for (let i = 0; i <= 6; i++) {
  const y = 10 + i;
  cube(-16, y, -1 + i, 8, y, -1 + i, GRAY);
  cube(-16, y, 13 - i, 8, y, 13 - i, GRAY);
  cube(-15, y, i, -15, y, 12 - i, BRICK);
  cube(7, y, i, 7, y, 12 - i, BRICK);
}
cube(-16, 17, 6, 8, 17, 6, BLACK);
block(-15, 13, 6, GLASS); block(7, 13, 6, GLASS);
block(-15, 12, 6, STONE); block(-15, 14, 6, STONE); block(7, 12, 6, STONE); block(7, 14, 6, STONE);
// north-light skylights
for (let i = 2; i <= 4; i++) {
  const y = 10 + i, z = -1 + i;
  for (const s of [[-14, -12], [-10, -8], [0, 2], [4, 6]]) cube(s[0], y, z, s[1], y, z, GLASS);
}
// iron ridge finials
for (const x of [-16, -12, -8, 0, 4, 8]) block(x, 18, 6, IRON);

// chimney C (slim, through the roof)
walls(1, 9, 9, 3, 25, 11, BRICK);
ring(1, 18, 9, 3, 11, BLACK);
ring(0, 23, 8, 4, 12, STONE);
ring(1, 25, 9, 3, 11, BLACK);
block(2, 26, 10, STEAM);

// ---------- CLOCK TOWER (x -6..-2, z -3..1) ----------
walls(-6, -1, -3, -2, 20, 1, BRICK);
walls(-6, -1, -3, -2, 0, 1, STONE);
for (let y = 1; y <= 20; y += 2) { block(-6, y, -3, STONE); block(-2, y, -3, STONE); }
// entrance
cube(-5, 1, -3, -3, 3, -3, AIR); block(-4, 4, -3, AIR);
cube(-5, 1, -2, -3, 3, -2, BROWN); block(-4, 4, -2, GLASS);
block(-5, 4, -3, STONE); block(-3, 4, -3, STONE); block(-4, 5, -3, STONE);
cube(-5, 0, -4, -3, 0, -4, STONE);
// tower window
cube(-4, 7, -3, -4, 9, -3, GLASS); block(-4, 6, -4, LIGHT_GRAY); block(-4, 8, -2, GLOWSTONE);
block(-6, 12, -2, GLASS); block(-6, 13, -2, GLASS); block(-2, 12, -2, GLASS); block(-2, 13, -2, GLASS);
// string course
cube(-7, 11, -4, -1, 11, -4, STONE);
cube(-7, 11, -3, -7, 11, -1, STONE);
cube(-1, 11, -3, -1, 11, -1, STONE);
// north clock
cube(-5, 13, -4, -3, 13, -4, GOLD); cube(-5, 17, -4, -3, 17, -4, GOLD);
cube(-6, 14, -4, -6, 16, -4, GOLD); cube(-2, 14, -4, -2, 16, -4, GOLD);
cube(-5, 14, -4, -3, 16, -4, WHITE);
block(-4, 15, -4, BLACK); block(-4, 16, -4, BLACK); block(-3, 15, -4, BLACK);
// east clock
cube(-1, 13, -2, -1, 13, 0, GOLD); cube(-1, 17, -2, -1, 17, 0, GOLD);
cube(-1, 14, -3, -1, 16, -3, GOLD); cube(-1, 14, 1, -1, 16, 1, GOLD);
cube(-1, 14, -2, -1, 16, 0, WHITE);
block(-1, 15, -1, BLACK); block(-1, 16, -1, BLACK); block(-1, 15, 0, BLACK);
// belfry
cube(-5, 18, -3, -3, 19, -3, AIR);
cube(-6, 18, -2, -6, 19, 0, AIR);
cube(-2, 18, -2, -2, 19, 0, AIR);
block(-4, 19, -1, GOLD); block(-4, 18, -1, GOLD);
// cornice + copper spire
ring(-7, 21, -4, -1, 2, STONE);
cube(-6, 22, -3, -2, 22, 1, COPPER);
cube(-5, 23, -2, -3, 24, 0, COPPER);
block(-4, 25, -1, COPPER); block(-4, 26, -1, COPPER);
block(-4, 27, -1, GOLD); block(-4, 28, -1, IRON);
for (const p of [[-7, -4], [-1, -4], [-7, 2], [-1, 2]]) { block(p[0], 22, p[1], STONE); block(p[0], 23, p[1], GOLD); }

// ---------- BOILER HOUSE (x 10..20, z 1..11) ----------
walls(10, -1, 1, 20, 6, 11, BRICK);
walls(10, -1, 1, 20, 0, 11, STONE);
for (let y = 1; y <= 6; y += 2) { block(10, y, 1, STONE); block(20, y, 1, STONE); }
for (let i = 0; i <= 5; i++) {
  const y = 7 + i;
  cube(9 + i, y, 0, 9 + i, y, 12, GRAY);
  cube(21 - i, y, 0, 21 - i, y, 12, GRAY);
  cube(10 + i, y, 1, 20 - i, y, 1, BRICK);
  cube(10 + i, y, 11, 20 - i, y, 11, BRICK);
}
cube(15, 13, 0, 15, 13, 12, BLACK);
// pediment oculus
block(15, 9, 1, GLASS);
block(14, 9, 1, STONE); block(16, 9, 1, STONE); block(15, 8, 1, STONE); block(15, 10, 1, STONE);
// furnace doorway
cube(14, 1, 1, 16, 4, 1, AIR); block(15, 5, 1, AIR);
block(14, 5, 1, STONE); block(16, 5, 1, STONE); block(15, 6, 1, STONE);
cube(13, 1, 4, 17, 4, 4, BLACK);
cube(14, 1, 4, 16, 2, 4, LAVA);
block(14, 1, 3, FIRE); block(16, 1, 3, FIRE);
// windows
cube(11, 2, 1, 12, 4, 1, GLASS); cube(18, 2, 1, 19, 4, 1, GLASS);
cube(11, 5, 1, 12, 5, 1, STONE); cube(18, 5, 1, 19, 5, 1, STONE);
cube(11, 1, 0, 12, 1, 0, LIGHT_GRAY); cube(18, 1, 0, 19, 1, 0, LIGHT_GRAY);
cube(20, 2, 3, 20, 4, 4, GLASS); cube(20, 2, 7, 20, 4, 8, GLASS);
// copper steam pipes to the main hall
line(8, 5, 1, 9, 5, 1, COPPER); line(8, 5, 11, 9, 5, 11, COPPER);
block(8, 6, 1, GOLD);
// roof vents
cube(12, 11, 6, 12, 13, 6, IRON); block(12, 14, 6, STEAM);
cube(18, 11, 8, 18, 13, 8, IRON); block(18, 14, 8, STEAM);

// ---------- GREAT CHIMNEYS ----------
function chimney(x1, z1, top) {
  walls(x1 - 1, -1, z1 - 1, x1 + 4, 3, z1 + 4, STONE);
  ring(x1, 3, z1, x1 + 3, z1 + 3, STONE);
  walls(x1, 4, z1, x1 + 3, top, z1 + 3, BRICK);
  ring(x1, 12, z1, x1 + 3, z1 + 3, BLACK);
  ring(x1, 20, z1, x1 + 3, z1 + 3, BLACK);
  ring(x1 - 1, top - 3, z1 - 1, x1 + 4, z1 + 4, STONE);
  ring(x1 - 1, top - 2, z1 - 1, x1 + 4, z1 + 4, BRICK);
  ring(x1, top, z1, x1 + 3, z1 + 3, BLACK);
  for (let dx = 1; dx <= 2; dx++) for (let dz = 1; dz <= 2; dz++) block(x1 + dx, top + 1, z1 + dz, STEAM);
  block(x1 + 1, top + 2, z1 + 2, STEAM);
}
chimney(-20, 5, 31);
chimney(15, 14, 27);

// ---------- YARD: path, railway, gas lamps ----------
cube(-5, 0, -11, -3, 0, -4, COBBLE);
block(-4, 0, -4, STONE);
for (let x = -20; x <= 21; x += 2) cube(x, 0, -7, x, 0, -5, PLANKS);
cube(-21, 1, -7, 21, 1, -7, IRON);
cube(-21, 1, -5, 21, 1, -5, IRON);

function lamp(x, z) {
  cube(x, 0, z, x, 3, z, BLACK);
  block(x, 4, z, GLOWSTONE);
  block(x, 5, z, BLACK);
}
lamp(-8, -3); lamp(0, -3); lamp(-14, -3); lamp(9, -2);

// coal wagon
for (const x of [8, 12]) { block(x, 2, -7, BLACK); block(x, 2, -5, BLACK); }
cube(7, 3, -8, 13, 3, -4, BROWN);
ring(7, 4, -8, 13, -4, BROWN);
cube(8, 4, -7, 12, 4, -5, BLACK);
cube(9, 5, -6, 11, 5, -6, BLACK);
block(14, 3, -6, IRON);

// steam locomotive
for (const x of [16, 18, 20]) { block(x, 2, -7, RED); block(x, 2, -5, RED); }
cube(15, 3, -7, 21, 3, -5, BLACK);
cube(18, 4, -7, 21, 5, -5, GREEN);
cube(21, 4, -7, 21, 5, -5, BLACK);
cube(19, 4, -7, 19, 5, -5, GOLD);
walls(15, 4, -7, 17, 6, -5, GREEN);
block(16, 5, -7, AIR); block(16, 5, -5, AIR);
block(16, 4, -6, LAVA);
cube(15, 7, -7, 17, 7, -5, BLACK);
cube(20, 6, -6, 20, 7, -6, BLACK);
block(19, 6, -6, GOLD);
block(20, 8, -6, STEAM);
block(22, 5, -6, GLOWSTONE);
block(22, 2, -6, RED);