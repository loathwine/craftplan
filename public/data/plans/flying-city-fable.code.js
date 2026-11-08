// flying-city-fable — prompt:
// a steampunk flying city...

const D = 12; // deck height
const rad = a => a * Math.PI / 180;

// ---------- HULL (tapered iron/wood keel) ----------
const hull = [[7,1,IRON],[8,3,BROWN],[9,5,IRON],[10,7,BROWN],[11,9,IRON]];
for (const [y, r, id] of hull) disk(0, y, 0, r, id);
disk(0, D, 0, 11, PLANKS);
hollowCylinder(0, D, 0, 11, 1, COPPER);          // copper rim
hollowCylinder(0, 10, 0, 7, 1, GOLD);            // brass belt line
// rivet bands + railing
for (let a = 0; a < 360; a += 15) {
  const x = Math.round(11 * Math.cos(rad(a))), z = Math.round(11 * Math.sin(rad(a)));
  block(x, D + 1, z, IRON);
  block(x, D + 2, z, a % 60 === 0 ? GLOWSTONE : GOLD);
  const x9 = Math.round(9 * Math.cos(rad(a))), z9 = Math.round(9 * Math.sin(rad(a)));
  block(x9, 11, z9, GOLD);
}
// underside vents
for (const [x, z] of [[-4,0],[4,0],[0,-4],[0,4]]) { block(x, 8, z, COPPER); block(x, 7, z, STEAM); }

// ---------- PROPULSION ----------
// central keel shaft + 4-blade propeller
cube(0, 4, 0, 0, 6, 0, IRON);
line(-4, 5, 0, 4, 5, 0, COPPER); line(0, 5, -4, 0, 5, 4, COPPER);
block(0, 5, 0, GOLD);
// rear pusher propeller (XY plane, facing south)
function propZ(cx, cy, cz, r, id) {
  line(cx - r, cy, cz, cx + r, cy, cz, id);
  line(cx, cy - r, cz, cx, cy + r, cz, id);
  block(cx, cy, cz, GOLD);
}
cube(0, 10, 10, 0, 10, 12, IRON);
hollowCylinder(0, 9, 11, 1, 3, COPPER); // nacelle
propZ(0, 10, 13, 4, IRON);
// big brass gear on the prow (XY plane, faces camera)
function gearZ(cx, cy, cz, r, id) {
  for (let a = 0; a < 360; a += 10) {
    const x = Math.round(r * Math.cos(rad(a))), y = Math.round(r * Math.sin(rad(a)));
    block(cx + x, cy + y, cz, id);
    if (a % 45 === 0) block(cx + Math.round((r + 1) * Math.cos(rad(a))), cy + Math.round((r + 1) * Math.sin(rad(a))), cz, id);
  }
  line(cx - r + 1, cy, cz, cx + r - 1, cy, cz, id);
  line(cx, cy - r + 1, cz, cx, cy + r - 1, cz, id);
  block(cx, cy, cz, IRON);
}
cube(0, 9, -9, 0, 9, -11, IRON);
gearZ(0, 9, -12, 3, GOLD);
// side gears (YZ plane) on the hull flanks
function gearX(cx, cy, cz, r, id) {
  for (let a = 0; a < 360; a += 10) {
    const z = Math.round(r * Math.cos(rad(a))), y = Math.round(r * Math.sin(rad(a)));
    block(cx, cy + y, cz + z, id);
    if (a % 45 === 0) block(cx, cy + Math.round((r + 1) * Math.sin(rad(a))), cz + Math.round((r + 1) * Math.cos(rad(a))), id);
  }
  line(cx, cy, cz - r + 1, cx, cy, cz + r - 1, id);
  block(cx, cy, cz, IRON);
}
line(10, 10, -2, 13, 10, -2, IRON); gearX(13, 10, -2, 2, COPPER);
line(-10, 10, 3, -13, 10, 3, IRON); gearX(-13, 10, 3, 2, COPPER);

// ---------- CLOCKTOWER (center, face north) ----------
cube(-2, D + 1, -2, 2, D + 10, 2, BRICK);
// corner pilasters
for (const [x, z] of [[-2,-2],[2,-2],[-2,2],[2,2]]) cube(x, D + 1, z, x, D + 10, z, STONE);
// windows on 3 sides
for (const y of [D + 3, D + 6]) {
  block(0, y, -2, GLASS); block(0, y + 1, -2, GLASS);
  block(-2, y, 0, GLASS); block(2, y, 0, GLASS);
}
// door
block(0, D + 1, -2, AIR); block(0, D + 2, -2, AIR); block(0, D + 1, -3, GOLD); block(0, D + 1, -3, AIR);
// clock face on north side (protrudes at z=-3)
for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
  if (dx * dx + dy * dy <= 5) block(dx, D + 9 + dy, -3, WHITE);
}
block(0, D + 9, -3, BLACK); block(0, D + 10, -3, BLACK); block(0, D + 11, -3, BLACK); block(1, D + 9, -3, BLACK);
for (const [dx, dy] of [[0,2],[2,0],[-2,0],[0,-2]]) block(dx, D + 9 + dy, -3, GOLD);
// copper stepped roof + spire
cube(-3, D + 11, -3, 3, D + 11, 3, COPPER);
cube(-2, D + 12, -2, 2, D + 12, 2, COPPER);
cube(-1, D + 13, -1, 1, D + 13, 1, COPPER);
block(0, D + 14, 0, GOLD); block(0, D + 15, 0, GOLD); block(0, D + 16, 0, GLOWSTONE);
// weather vane arm
line(-2, D + 15, 0, 2, D + 15, 0, IRON);

// ---------- WEST HOUSE (brick, wooden roof) ----------
cube(-9, D + 1, -7, -5, D + 4, -3, BRICK);
for (const [x, z] of [[-9,-7],[-5,-7],[-9,-3],[-5,-3]]) cube(x, D + 1, z, x, D + 4, z, OAK_LOG);
block(-7, D + 2, -7, GLASS); block(-7, D + 3, -7, GLASS); block(-6, D + 2, -7, GLASS);
block(-8, D + 2, -7, AIR); block(-8, D + 1, -7, AIR);
block(-9, D + 2, -5, GLASS); block(-5, D + 2, -5, GLASS);
cube(-10, D + 5, -8, -4, D + 5, -2, PLANKS);
cube(-9, D + 6, -7, -5, D + 6, -3, PLANKS);
cube(-8, D + 7, -6, -6, D + 7, -4, PLANKS);
block(-7, D + 8, -5, OAK_LOG);
// chimney with steam
cube(-5, D + 5, -4, -5, D + 8, -4, COBBLE); block(-5, D + 9, -4, STEAM);
// porch lamp
block(-8, D + 3, -8, IRON); block(-8, D + 4, -8, GLOWSTONE);

// ---------- EAST OBSERVATORY (stone, copper dome) ----------
cylinder(7, D + 1, -4, 3, 5, STONE);
hollowCylinder(7, D + 1, -4, 3, 1, COBBLE);
hollowCylinder(7, D + 4, -4, 3, 1, COBBLE);
for (const a of [90, 180, 270]) { // windows (not the south side)
  const x = 7 + Math.round(3 * Math.cos(rad(a))), z = -4 + Math.round(3 * Math.sin(rad(a)));
  block(x, D + 2, z, GLASS); block(x, D + 3, z, GLASS);
}
block(7, D + 1, -7, AIR); block(7, D + 2, -7, AIR);
hollowSphere(7, D + 6, -4, 3, COPPER);
cube(4, D + 4, -8, 10, D + 5, 0, AIR); // trim the sphere's lower half back to a dome
hollowCylinder(7, D + 6, -4, 3, 1, COPPER);
// telescope poking north
line(7, D + 7, -6, 7, D + 9, -10, IRON);
block(7, D + 9, -10, GOLD); block(7, D + 10, -11, GOLD);
block(7, D + 9, -4, GLOWSTONE);

// ---------- REAR FACTORY (cobble, boilers, stacks) ----------
cube(-5, D + 1, 3, 5, D + 5, 9, COBBLE);
cube(-5, D + 6, 3, 5, D + 6, 9, IRON);
hollowCube(-5, D + 1, 3, 5, D + 5, 9, BRICK);
cube(-4, D + 2, 3, 4, D + 4, 3, STONE); // north face panel
for (const x of [-3, -1, 1, 3]) { block(x, D + 3, 3, GLASS); block(x, D + 2, 3, GLASS); }
for (const z of [5, 7]) { block(-5, D + 3, z, GLASS); block(5, D + 3, z, GLASS); }
block(0, D + 1, 3, AIR); block(0, D + 2, 3, AIR); block(0, D + 3, 3, AIR);
// cargo doors glow from the furnace inside
block(0, D + 2, 4, LAVA); block(-1, D + 1, 4, LAVA); block(1, D + 1, 4, LAVA);
// boiler drum on the roof
for (let x = -4; x <= 4; x++) hollowCylinder(x, D + 7, 7, 0, 1, COPPER);
cube(-4, D + 7, 6, 4, D + 8, 8, COPPER);
cube(-3, D + 9, 7, 3, D + 9, 7, COPPER);
block(-5, D + 7, 7, GOLD); block(5, D + 7, 7, GOLD);
// gauges and piping
line(-4, D + 6, 4, -4, D + 6, 6, IRON); line(4, D + 6, 4, 4, D + 6, 6, IRON);
block(-4, D + 7, 4, NEON_RED); block(4, D + 7, 4, NEON_BLUE);
// twin smokestacks
for (const x of [-3, 3]) {
  hollowCylinder(x, D + 7, 5, 1, 9, BRICK);
  hollowCylinder(x, D + 15, 5, 1, 1, IRON);
  block(x, D + 16, 5, STEAM); block(x, D + 17, 5, STEAM);
}
// walkway and valve wheel
cube(-5, D + 7, 9, 5, D + 7, 9, IRON);
gearZ(0, D + 10, 10, 2, GOLD);

// ---------- SOUTHWEST WORKSHOP (iron crate, tesla coil) ----------
hollowCube(-10, D + 1, 3, -7, D + 4, 7, IRON);
cube(-10, D + 1, 3, -7, D + 1, 7, PLANKS);
block(-10, D + 2, 5, GLASS); block(-8, D + 2, 3, GLASS); block(-9, D + 2, 3, AIR); block(-9, D + 1, 3, AIR);
cube(-9, D + 5, 5, -9, D + 8, 5, COPPER);
hollowCylinder(-9, D + 9, 5, 1, 1, GOLD);
block(-9, D + 10, 5, ELECTRIC); block(-9, D + 12, 5, ELECTRIC); block(-8, D + 11, 4, ELECTRIC);

// ---------- SOUTHEAST CRANE + CARGO ----------
cube(8, D + 1, 4, 8, D + 9, 4, IRON);
cube(9, D + 1, 4, 9, D + 9, 4, IRON);
line(8, D + 9, 4, 8, D + 9, -2, IRON);
block(8, D + 8, -2, IRON); block(8, D + 7, -2, IRON);
cube(7, D + 5, -3, 9, D + 6, -1, OAK_LOG);   // suspended crate
block(8, D + 3, 7, COPPER); block(8, D + 2, 7, COPPER); // winch drum
cube(6, D + 1, 7, 7, D + 2, 8, PLANKS);
cube(10, D + 1, 1, 11, D + 1, 2, OAK_LOG);

// ---------- STREET DETAILS ----------
// cobbled path from clocktower to prow
cube(-1, D, -3, 1, D, -10, COBBLE);
// gas lamps
for (const [x, z] of [[-3,-5],[3,-5],[-3,-9],[3,-9],[-11,0],[11,0]]) {
  cube(x, D + 1, z, x, D + 3, z, IRON); block(x, D + 4, z, GLOWSTONE);
}
// brazier at the bow
cube(-1, D + 1, -9, 1, D + 1, -9, IRON); block(0, D + 2, -9, FIRE);
// planter boxes with trees
for (const [x, z] of [[-11,5],[11,5]]) {
  hollowCube(x - 1, D + 1, z - 1, x + 1, D + 1, z + 1, BROWN);
  cube(x, D + 1, z, x, D + 4, z, OAK_LOG);
  sphere(x, D + 5, z, 2, LEAVES);
}

// ---------- TWIN LIFT BALLOONS ----------
function balloon(cx, cy, cz) {
  hollowSphere(cx, cy, cz, 5, BROWN);
  hollowCylinder(cx, cy, cz, 5, 1, RED);
  hollowCylinder(cx, cy + 3, cz, 4, 1, RED);
  hollowCylinder(cx, cy - 3, cz, 4, 1, RED);
  // gondola fin + burner
  cube(cx, cy - 6, cz, cx, cy - 6, cz, IRON);
  block(cx, cy - 5, cz, GOLD);
  line(cx, cy - 7, cz, cx, cy - 8, cz, IRON);
  block(cx, cy - 6, cz, FIRE);
  // rigging to deck
  for (const [dx, dz] of [[-3,-3],[3,-3],[-3,3],[3,3]]) {
    line(cx + dx, cy - 4, cz + dz, cx + dx * 2, D + 1, cz + dz * 2 + 0, IRON);
  }
  // tail fin
  cube(cx, cy, cz + 5, cx, cy + 2, cz + 7, RED);
  block(cx, cy - 1, cz + 7, RED);
}
balloon(-13, 27, 0);
balloon(13, 27, 0);
// cross-cable between balloons
line(-8, 27, 0, 8, 27, 0, IRON);
block(0, 27, 0, GOLD);

// ---------- ANCHOR CHAIN TO THE GROUND ----------
line(0, 7, -2, 5, -1, -12, IRON);
cube(4, -1, -13, 6, -1, -11, IRON);
block(5, 0, -12, GOLD); block(5, -1, -12, IRON);
block(3, 0, -12, IRON); block(7, 0, -12, IRON);