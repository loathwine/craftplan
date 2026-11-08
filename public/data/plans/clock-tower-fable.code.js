// clock-tower-fable — prompt:
// a steampunk clock tower...

// Steampunk clock tower — front (clock face) toward north / -Z
const H = 24;            // shaft height
const R = 3;             // half-width of shaft (7x7)

// clear foliage in the footprint
cube(-9, 0, -9, 9, 9, 9, AIR);

// ---------- foundation & plinth ----------
cube(-7, -3, -7, 7, -1, 7, STONE);
cube(-6, 0, -6, 6, 0, 6, COBBLE);
cube(-5, 1, -5, 5, 1, 5, COBBLE);
// steps to the north
cube(-2, 0, -8, 2, 0, -7, COBBLE);
cube(-2, 1, -6, 2, 1, -6, COBBLE);
// corner bollards
for (const [x, z] of [[-6,-6],[6,-6],[-6,6],[6,6]]) {
  cube(x, 1, z, x, 2, z, IRON);
  block(x, 3, z, COPPER);
}

// ---------- shaft ----------
hollowCube(-R, 2, -R, R, H, R, BRICK);
// corner pilasters of iron
for (const [x, z] of [[-R,-R],[R,-R],[-R,R],[R,R]]) {
  line(x, 2, z, x, H, z, IRON);
}
// copper banding every 5 levels
for (let y = 6; y < H; y += 5) {
  hollowCube(-R-1, y, -R-1, R+1, y, R+1, COPPER);
}
// doorway north
cube(-1, 2, -R, 1, 4, -R, AIR);
block(-1, 4, -R, COPPER); block(1, 4, -R, COPPER); block(0, 5, -R, COPPER);
// arched windows (east, west, south) with glass
for (let y = 8; y < H - 4; y += 6) {
  for (const side of [-1, 1]) {
    cube(side*R, y, -1, side*R, y+2, 1, GLASS);
    block(side*R, y+3, 0, GLASS);
    block(side*R, y+3, -1, COPPER); block(side*R, y+3, 1, COPPER);
  }
  cube(-1, y, R, 1, y+2, R, GLASS);
  block(0, y+3, R, GLASS);
}
// north slit windows below the face
for (let y = 7; y < 15; y += 3) {
  block(0, y, -R, GLASS);
  block(0, y+1, -R, GLASS);
}

// ---------- clock face (north) ----------
const FY = 19;
cube(-4, FY-4, -4, 4, FY+4, -4, IRON);      // bezel plate
disk(0, FY, -4, 3, MARBLE);                 // disk at y? disk is horizontal; build face manually
function faceDisk(cy, z, r, id) {
  for (let x = -r; x <= r; x++) for (let y = -r; y <= r; y++)
    if (x*x + y*y <= r*r + 0.5) block(x, cy + y, z, id);
}
cube(-4, FY-4, -4, 4, FY+4, -4, IRON);
faceDisk(FY, -4, 3, MARBLE);
faceDisk(FY, -5, 3, MARBLE);
// rim
for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) {
  const d = x*x + y*y;
  if (d > 9.5 && d <= 17) block(x, FY + y, -5, GOLD);
}
// hour markers
block(0, FY+3, -6, BLACK); block(0, FY-3, -6, BLACK);
block(3, FY, -6, BLACK); block(-3, FY, -6, BLACK);
// hands (10:10)
line(0, FY, -6, -2, FY+2, -6, BLACK);       // hour hand
line(0, FY, -6, 2, FY+3, -6, BLACK);        // minute hand
block(0, FY, -6, GOLD);
// gold ornaments at bezel corners
for (const [x, y] of [[-4,FY-4],[4,FY-4],[-4,FY+4],[4,FY+4]]) {
  block(x, y, -5, GOLD);
}
// smaller side clock faces (east/west) in copper
for (const side of [-1, 1]) {
  for (let z = -2; z <= 2; z++) for (let y = -2; y <= 2; y++)
    if (z*z + y*y <= 4.5) block(side*4, FY + y, z, MARBLE);
  block(side*5, FY, 0, BLACK); block(side*5, FY+1, 0, BLACK);
  block(side*5, FY, 1, BLACK);
}

// ---------- exposed gearworks (south side, above windows) ----------
function gear(cx, cy, cz, r, id, axisX) {
  // ring in the X-Y plane at z=cz (or Y-Z plane at x=cx when axisX)
  for (let a = -r-1; a <= r+1; a++) for (let b = -r-1; b <= r+1; b++) {
    const d = a*a + b*b;
    const tooth = ((a + b) % 2 === 0) && d > r*r && d <= (r+1)*(r+1);
    const ring = d > (r-1.2)*(r-1.2) && d <= r*r;
    const hub = d <= 1.5;
    if (tooth || ring || hub) {
      if (axisX) block(cx, cy + b, cz + a, id); else block(cx + a, cy + b, cz, id);
    }
  }
}
gear(-1, 14, R+1, 3, COPPER, false);
gear(3, 12, R+1, 2, GOLD, false);
gear(2, 17, R+1, 2, IRON, false);
// west side gears
gear(-R-1, 10, 0, 2, COPPER, true);
gear(-R-1, 14, 2, 2, IRON, true);

// ---------- belfry / upper cabin ----------
const BY = H + 1;
cube(-4, BY, -4, 4, BY, 4, IRON);             // floor plate
hollowCube(-4, BY+1, -4, 4, BY+4, 4, COPPER); // cabin walls
// open arches in cabin
for (let i = -2; i <= 2; i += 2) {
  cube(i, BY+1, -4, i, BY+3, -4, AIR);
  cube(i, BY+1, 4, i, BY+3, 4, AIR);
  cube(-4, BY+1, i, -4, BY+3, i, AIR);
  cube(4, BY+1, i, 4, BY+3, i, AIR);
}
// bell
cube(-1, BY+2, -1, 1, BY+3, 1, GOLD);
block(0, BY+1, 0, GOLD);
// roof: stepped copper dome with brass cap
cube(-5, BY+5, -5, 5, BY+5, 5, COPPER);
cube(-4, BY+6, -4, 4, BY+6, 4, COPPER);
cube(-3, BY+7, -3, 3, BY+7, 3, COPPER);
cube(-2, BY+8, -2, 2, BY+8, 2, COPPER);
// cap spire (within Y <= 33)
cube(-1, BY+9, -1, 1, BY+9, 1, GOLD);
block(0, BY+10, 0, GOLD); // y = 35? BY = 25 -> 35 exceeds; clamp below
// correct: ensure spire within limits
// (BY+8 = 33) -> skip blocks above 33
// corner finials on roof base
for (const [x, z] of [[-5,-5],[5,-5],[-5,5],[5,5]]) {
  block(x, BY+6, z, GOLD);
}
// lamps under the eaves
for (const [x, z] of [[-4,-5],[4,-5],[-5,-4],[-5,4],[5,-4],[5,4],[-4,5],[4,5]]) {
  block(x, BY+4, z, GLOWSTONE);
}

// ---------- boiler house (east annex) ----------
cube(6, 1, -4, 13, 1, 4, COBBLE);
hollowCube(6, 2, -4, 13, 6, 4, BRICK);
cube(6, 2, -4, 6, 6, 4, AIR);                 // open toward tower
cube(6, 2, -4, 6, 6, 4, BRICK);
cube(6, 3, -1, 6, 5, 1, AIR);                 // connecting door
// pitched plank roof
for (let i = 0; i < 4; i++) {
  cube(6, 7 + i, -4 + i, 13, 7 + i, 4 - i, PLANKS);
}
line(6, 11, 0, 13, 11, 0, IRON);
// windows
for (const z of [-4, 4]) { block(8, 4, z, GLASS); block(11, 4, z, GLASS); }
block(13, 4, -1, GLASS); block(13, 4, 1, GLASS);
// boiler inside
cylinder(10, 2, 0, 1, 1, IRON);
cube(8, 2, -1, 12, 4, 1, IRON);
block(8, 3, -2, LAVA); block(9, 3, -2, LAVA);  // firebox glow
// twin smokestacks on the annex roof
for (const x of [8, 12]) {
  cylinder(x, 8, 2, 1, 7, IRON);
  hollowCylinder(x, 15, 2, 1, 1, COPPER);
  block(x, 16, 2, STEAM);
}
// pipework from boiler house up the tower's east face
line(5, 5, 0, 5, 21, 0, COPPER);
line(5, 5, 2, 5, 16, 2, COPPER);
line(5, 5, -2, 5, 11, -2, COPPER);
for (let y = 7; y <= 21; y += 4) block(5, y, 0, IRON);   // flanges
line(4, 21, 0, 4, 21, 2, COPPER); block(4, 22, 2, STEAM);
block(5, 17, 2, IRON); block(5, 17, 3, STEAM);
block(5, 12, -2, IRON); block(5, 12, -3, STEAM);
// pressure gauges on the annex
block(7, 5, -5, GOLD); block(12, 5, -5, GOLD);

// ---------- west side: water tank on stilts + crane ----------
for (const [x, z] of [[-9,-3],[-13,-3],[-9,3],[-13,3]]) line(x, 1, z, x, 7, z, IRON);
cube(-9, 2, -3, -13, 2, 3, IRON);
cube(-9, 5, -3, -13, 5, 3, IRON);
hollowCylinder(-11, 8, 0, 3, 4, COPPER);
cube(-11, 8, 0, -11, 11, 0, AIR);
disk(-11, 11, 0, 3, WATER);
disk(-11, 8, 0, 3, IRON);
hollowCylinder(-11, 12, 0, 3, 1, IRON);
block(-11, 12, 0, STEAM);
// pipe from tank into tower west wall
line(-8, 9, 0, -4, 9, 0, COPPER);
block(-6, 9, 0, IRON);
// stair ladder from ground to tank
for (let y = 1; y <= 7; y++) block(-9, y, -4, IRON);

// ---------- south: flying buttress / gantry & second stack ----------
hollowCube(-2, 2, 5, 2, 9, 8, IRON);
cube(-1, 3, 5, 1, 8, 7, AIR);
cube(-2, 2, 5, 2, 2, 8, COBBLE);
cylinder(0, 9, 7, 1, 10, IRON);
hollowCylinder(0, 19, 7, 1, 1, COPPER);
block(0, 20, 7, STEAM);
// diagonal brace
line(-2, 9, 5, -2, 12, 3, IRON);
line(2, 9, 5, 2, 12, 3, IRON);

// ---------- balcony around the clock (north) ----------
cube(-5, 13, -6, 5, 13, -4, PLANKS);
for (let x = -5; x <= 5; x += 2) block(x, 14, -6, IRON);
line(-5, 15, -6, 5, 15, -6, COPPER);
line(-5, 14, -5, -5, 15, -5, COPPER);
line(5, 14, -5, 5, 15, -5, COPPER);
// lamps on balcony rail
block(-5, 16, -6, GLOWSTONE); block(5, 16, -6, GLOWSTONE);

// ---------- ground details ----------
// lamp posts flanking the stairs
for (const x of [-4, 4]) {
  line(x, 1, -8, x, 4, -8, IRON);
  block(x, 5, -8, GLOWSTONE);
}
// cobble path north
cube(-1, -1, -9, 1, -1, -16, COBBLE);
cube(-2, -1, -16, 2, -1, -16, COBBLE);
// stray crates and barrels
cube(7, 1, -7, 8, 2, -6, PLANKS);
block(9, 1, -7, OAK_LOG); block(9, 2, -7, OAK_LOG);
block(-7, 1, 6, OAK_LOG); block(-7, 2, 6, OAK_LOG);
// small electric arc from a Tesla coil on the roof's east corner
line(5, BY+6, 5, 5, BY+8, 5, IRON);
block(5, BY+9, 5, ELECTRIC);
// dial glow at night
block(0, FY, -7, GLOWSTONE);