// steam-factory-fable — prompt:
// a Victorian factory with smoking chimneys...

// Victorian factory — front faces north (-Z)
const G = 0; // ground level (feet)

// clear trees / shrubs over the site
cube(-20, 0, -6, 21, 12, 16, AIR);

// cobble yard foundation
cube(-20, -1, -6, 21, -1, 16, COBBLE);
cube(-19, -2, -5, 20, -2, 15, STONE);

// ---------- MAIN HALL ----------
const hx1 = -14, hx2 = 10, hz1 = -2, hz2 = 12, hy = 10;
hollowCube(hx1, 0, hz1, hx2, hy, hz2, BRICK);
cube(hx1, 0, hz1, hx2, hy, hz1, BRICK); // make front solid first
// stone plinth and cornice
cube(hx1, 0, hz1, hx2, 0, hz1, STONE);
cube(hx1, 0, hz2, hx2, 0, hz2, STONE);
cube(hx1, 0, hz1, hx1, 0, hz2, STONE);
cube(hx2, 0, hz1, hx2, 0, hz2, STONE);
cube(hx1 - 1, hy, hz1 - 1, hx2 + 1, hy, hz2 + 1, LIGHT_GRAY);
cube(hx1 - 1, hy + 1, hz1 - 1, hx2 + 1, hy + 1, hz2 + 1, LIGHT_GRAY);
cube(hx1, hy + 1, hz1, hx2, hy + 1, hz2, AIR);
// brick band
cube(hx1, 5, hz1, hx2, 5, hz1, COBBLE);
cube(hx1, 5, hz2, hx2, 5, hz2, COBBLE);

// tall arched windows on front (north) and back
for (let x = hx1 + 2; x <= hx2 - 2; x += 4) {
  for (const z of [hz1, hz2]) {
    cube(x, 2, z, x + 1, 7, z, GLASS);
    block(x, 8, z, LIGHT_GRAY); block(x + 1, 8, z, LIGHT_GRAY);
    block(x - 1, 7, z, LIGHT_GRAY); block(x + 2, 7, z, LIGHT_GRAY);
    block(x, 1, z, STONE); block(x + 1, 1, z, STONE);
    block(x, 4, z, IRON); block(x + 1, 4, z, IRON); // mullion
  }
}
// side windows
for (let z = hz1 + 2; z <= hz2 - 2; z += 3) {
  for (const x of [hx1, hx2]) {
    cube(x, 2, z, x, 6, z, GLASS);
    block(x, 7, z, LIGHT_GRAY);
  }
}
// grand entrance door (front, east-ish)
cube(-3, 1, hz1, 0, 5, hz1, AIR);
cube(-3, 1, hz1, 0, 1, hz1, PLANKS);
cube(-4, 1, hz1, -4, 6, hz1, STONE);
cube(1, 1, hz1, 1, 6, hz1, STONE);
cube(-4, 6, hz1, 1, 6, hz1, STONE);
cube(-3, 7, hz1, 0, 7, hz1, STONE);
block(-2, 8, hz1, STONE); block(-1, 8, hz1, STONE);
cube(-3, 2, hz1, 0, 4, hz1, BROWN);
block(-2, 5, hz1, GLASS); block(-1, 5, hz1, GLASS);
cube(-3, 1, hz1 + 1, 0, 5, hz1 + 1, AIR);
block(-4, 7, hz1 - 1, GLOWSTONE); block(1, 7, hz1 - 1, GLOWSTONE);
// steps
cube(-4, 0, hz1 - 2, 1, 0, hz1 - 1, STONE);
cube(-5, -1, hz1 - 3, 2, -1, hz1 - 1, STONE);

// sawtooth roof (4 teeth across z)
for (let t = 0; t < 4; t++) {
  const z0 = hz1 + 1 + t * 3.5;
  const za = Math.round(z0), zb = Math.round(z0 + 3);
  for (let i = 0; i <= 2; i++) {
    const z = za + i;
    if (z > hz2 - 1) break;
    cube(hx1, hy + 1, z, hx2, hy + 1 + i, z, GRAY);
  }
  // vertical glazed face of the tooth (faces north)
  if (zb <= hz2) {
    cube(hx1 + 1, hy + 1, zb, hx2 - 1, hy + 3, zb, GLASS);
    block(hx1, hy + 3, zb, GRAY); block(hx2, hy + 3, zb, GRAY);
    cube(hx1, hy + 1, zb, hx1, hy + 3, zb, GRAY);
    cube(hx2, hy + 1, zb, hx2, hy + 3, zb, GRAY);
  }
}
// roof-top sign + clock tower on front corner
cube(5, hy + 2, hz1 + 1, 9, hy + 2, hz1 + 1, IRON);
cube(4, hy + 1, hz1 - 1, 8, hy + 9, hz1 + 3, BRICK);
cube(5, hy + 2, hz1, 7, hy + 8, hz1 + 2, AIR);
cube(4, hy + 1, hz1 - 1, 8, hy + 9, hz1 + 3, BRICK);
cube(3, hy + 10, hz1 - 2, 9, hy + 10, hz1 + 4, LIGHT_GRAY);
cube(4, hy + 11, hz1 - 1, 8, hy + 11, hz1 + 3, GRAY);
cube(5, hy + 12, hz1, 7, hy + 12, hz1 + 2, GRAY);
block(6, hy + 13, hz1 + 1, GRAY); block(6, hy + 14, hz1 + 1, GRAY);
block(6, hy + 15, hz1 + 1, GOLD);
// clock face north
cube(5, hy + 5, hz1 - 1, 7, hy + 7, hz1 - 1, WHITE);
block(6, hy + 6, hz1 - 1, BLACK);
block(6, hy + 7, hz1 - 1, BLACK);
block(7, hy + 6, hz1 - 1, BLACK);
cube(5, hy + 2, hz1 - 1, 7, hy + 3, hz1 - 1, GLASS);

// interior floor + machinery glimpse
cube(hx1 + 1, 0, hz1 + 1, hx2 - 1, 0, hz2 - 1, PLANKS);
for (let x = hx1 + 3; x < hx2 - 3; x += 5) {
  cube(x, 1, 5, x + 2, 2, 7, IRON);
  block(x + 1, 3, 6, COPPER);
}

// ---------- BOILER HOUSE (east annex) ----------
hollowCube(11, 0, 1, 19, 6, 11, BRICK);
cube(11, 0, 1, 19, 0, 11, STONE);
cube(10, 7, 0, 20, 7, 12, GRAY);
cube(11, 8, 2, 19, 8, 10, GRAY);
cube(12, 9, 3, 18, 9, 9, GRAY);
cube(13, 10, 4, 17, 10, 8, GRAY);
cube(11, 1, 1, 19, 5, 1, BRICK);
for (let x = 13; x <= 17; x += 2) {
  cube(x, 2, 1, x, 4, 1, GLASS);
  cube(x, 2, 11, x, 4, 11, GLASS);
}
cube(19, 1, 5, 19, 3, 6, AIR); // side door
// furnace glow inside
cube(13, 1, 5, 17, 2, 7, IRON);
cube(14, 1, 5, 16, 1, 5, LAVA);
block(15, 2, 4, FIRE);
// boiler house vent pipes
cube(12, 11, 5, 12, 13, 5, IRON); block(12, 14, 5, STEAM);
cube(18, 11, 7, 18, 13, 7, IRON); block(18, 14, 7, STEAM);
// pipe linking annex to main hall
cube(10, 8, 6, 11, 8, 6, COPPER);
cube(10, 8, 9, 11, 8, 9, COPPER);

// ---------- CHIMNEYS ----------
function chimney(cx, cz, h, r) {
  cube(cx - r - 1, 0, cz - r - 1, cx + r + 1, 2, cz + r + 1, STONE);
  hollowCylinder(cx, 3, cz, r, h - 3, BRICK);
  // taper band and crown
  cube(cx - r, h - 4, cz - r, cx + r, h - 4, cz + r, COBBLE);
  hollowCylinder(cx, h, cz, r + 1, 2, LIGHT_GRAY);
  cube(cx - 1, h + 2, cz - 1, cx + 1, h + 2, cz + 1, AIR);
  // iron bands
  for (let y = 8; y < h - 4; y += 6) hollowCylinder(cx, y, cz, r, 1, IRON);
  // lightning rod
  cube(cx, h + 2, cz, cx, h + 4, cz, IRON);
  // smoke
  block(cx, h + 2, cz, STEAM);
  block(cx + 1, h + 3, cz, STEAM);
  block(cx - 1, h + 3, cz + 1, STEAM);
}
chimney(-17, 8, 31, 2);
chimney(14, 14, 27, 2);
// smaller third stack on main hall
cube(-12, hy + 1, 9, -11, hy + 8, 10, BRICK);
cube(-13, hy + 9, 8, -10, hy + 9, 11, LIGHT_GRAY);
block(-12, hy + 10, 9, STEAM); block(-11, hy + 10, 10, STEAM);

// ---------- WATER TOWER (west) ----------
for (const [dx, dz] of [[-21, -3], [-18, -3], [-21, 0], [-18, 0]]) {
  cube(dx, 0, dz, dx, 8, dz, IRON);
}
cube(-21, 4, -3, -18, 4, 0, IRON);
cube(-21, 9, -3, -18, 9, 0, PLANKS);
hollowCylinder(-19, 9, -1, 3, 5, IRON);
cube(-21, 13, -3, -18, 13, 0, WATER);
disk(-19, 14, -1, 3, GRAY);
block(-19, 15, -1, GRAY);
cube(-19, 0, -1, -19, 8, -1, COPPER); // feed pipe

// ---------- YARD DETAILS ----------
// iron fence along the front (north edge)
for (let x = -20; x <= 21; x++) {
  if (x >= -6 && x <= 3) continue; // gate gap
  block(x, 0, -6, IRON);
  if (x % 4 === 0) { block(x, 1, -6, IRON); block(x, 2, -6, BRICK); }
  else block(x, 1, -6, BLACK);
}
// gate posts and arch
cube(-7, 0, -6, -7, 4, -6, BRICK);
cube(4, 0, -6, 4, 4, -6, BRICK);
cube(-7, 5, -6, 4, 5, -6, IRON);
block(-7, 5, -6, GLOWSTONE); block(4, 5, -6, GLOWSTONE);
cube(-6, 4, -6, 3, 4, -6, BLACK);
// path from gate to door
cube(-4, -1, -6, 1, -1, -3, LIGHT_GRAY);

// coal heaps
sphere(-10, 0, -4, 2, BLACK);
sphere(-13, 0, 0, 1, BLACK);
cube(-15, -1, -5, -8, -1, -3, GRAY);

// mine carts on rails
for (let z = -5; z <= 15; z++) { block(-6, -1, z, IRON); block(-4, -1, z, IRON); }
// cart 1
cube(-6, 0, 2, -4, 1, 4, GRAY); cube(-5, 1, 3, -5, 1, 3, BLACK); cube(-6, 2, 2, -4, 2, 4, BLACK);
cube(-6, 0, 3, -4, 0, 3, AIR);
// cart 2
cube(-6, 0, -1, -4, 1, 0, GRAY); block(-5, 2, -1, BLACK); block(-5, 2, 0, BLACK);

// crates and barrels in the yard
cube(13, 0, -4, 14, 1, -3, PLANKS);
cube(15, 0, -4, 15, 0, -4, PLANKS);
cube(16, 0, -2, 16, 1, -2, BROWN);
cube(18, 0, -4, 18, 1, -4, BROWN);
block(17, 0, -1, BROWN);
cube(13, 0, -1, 15, 1, 0, PLANKS); // long crate
// crane / hoist on east wall
cube(21, 0, 3, 21, 9, 3, IRON);
cube(21, 9, -2, 21, 9, 8, IRON);
block(21, 8, -2, IRON); line(21, 8, -2, 21, 2, -2, BLACK);
block(21, 1, -2, PLANKS);

// street lamps
for (const [lx, lz] of [[-10, -5], [9, -5], [-18, 14], [8, 15]]) {
  cube(lx, 0, lz, lx, 3, lz, BLACK);
  block(lx, 4, lz, GLOWSTONE);
}

// gutters / rain pipes on main hall corners
for (const [gx, gz] of [[hx1 - 1, hz1], [hx2 + 1, hz1], [hx1 - 1, hz2], [hx2 + 1, hz2]]) {
  cube(gx, 0, gz, gx, hy - 1, gz, IRON);
}

// puddles / soot staining on the ground
cube(-2, -1, 8, 2, -1, 9, WATER);
cube(hx1 - 2, -1, 13, hx2 + 2, -1, 14, GRAY);