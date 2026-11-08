// time-machine-haiku55 — prompt:
// H.G. Wells' time machine...

// H.G. Wells' Time Machine: brass-and-crystal machine on a checkered stage,
// Victorian street behind, clock tower at the back. Front = north (-Z).

// ---------- helpers ----------
function diskXY(cx, cy, z, r, id) {
  const R = Math.ceil(r);
  for (let dx = -R; dx <= R; dx++)
    for (let dy = -R; dy <= R; dy++)
      if (Math.sqrt(dx * dx + dy * dy) <= r) block(cx + dx, cy + dy, z, id);
}

function lamp(x, z) {
  line(x, 0, z, x, 2, z, GOLD);
  block(x, 3, z, GLOWSTONE);
}

function house(x1, x2, h) {
  const z1 = 9, z2 = 11;
  cube(x1, 0, z1, x2, h - 1, z2, BRICK);   // brick walls
  cube(x1, h, z1, x2, h, z2, BLACK);       // slate roof
  for (let x = x1 + 1; x <= x2 - 1; x += 2)
    for (let y = 2; y <= h - 3; y += 3) {  // tall paired windows on street face
      block(x, y, z1, GLASS);
      block(x, y + 1, z1, GLASS);
    }
  block(x1 + 1, h + 1, z2, COBBLE);        // chimney
}

// ---------- 1. clear our build zone (AIR is free) ----------
cube(-21, 0, -6, 21, 30, 14, AIR);

// ---------- 2. stage: checkered floor, brass rim, lamp posts ----------
for (let x = -6; x <= 6; x++)
  for (let z = -4; z <= 4; z++)
    block(x, -1, z, (x + z) & 1 ? BLACK : MARBLE);

cube(-6, 0, -4, 6, 0, -4, GOLD);
cube(-6, 0, 4, 6, 0, 4, GOLD);
cube(-6, 0, -3, -6, 0, 3, GOLD);
cube(6, 0, -3, 6, 0, 3, GOLD);
lamp(-5, -3);
lamp(5, -3);

// Victorian lab table (left) with brass globe
cube(-5, 2, 1, -4, 2, 3, PLANKS);
line(-5, 0, 1, -5, 1, 1, OAK_LOG);
line(-4, 0, 1, -4, 1, 1, OAK_LOG);
line(-5, 0, 3, -5, 1, 3, OAK_LOG);
line(-4, 0, 3, -4, 1, 3, OAK_LOG);
hollowSphere(-5, 4, 2, 1.5, GOLD);

// Lab table (right) with stacked books
cube(4, 2, 1, 5, 2, 3, PLANKS);
line(4, 0, 1, 4, 1, 1, OAK_LOG);
line(5, 0, 1, 5, 1, 1, OAK_LOG);
line(4, 0, 3, 4, 1, 3, OAK_LOG);
line(5, 0, 3, 5, 1, 3, OAK_LOG);
cube(4, 3, 1, 5, 3, 1, RED);
cube(4, 3, 2, 5, 3, 2, YELLOW);
cube(4, 4, 1, 4, 4, 1, BLUE);

// ---------- 3. THE TIME MACHINE ----------
// brass runners and cross-bars
cube(-3, 0, -3, -3, 0, 3, GOLD);
cube(3, 0, -3, 3, 0, 3, GOLD);
cube(-2, 0, -3, 2, 0, -3, GOLD);
cube(-2, 0, 3, 2, 0, 3, GOLD);

// deck: steel plate with brass edge and ivory inlay
cube(-3, 1, -3, 3, 1, 3, IRON);
cube(-3, 1, -3, 3, 1, -3, GOLD);
cube(-3, 1, 3, 3, 1, 3, GOLD);
cube(-3, 1, -3, -3, 1, 3, GOLD);
cube(3, 1, -3, 3, 1, 3, GOLD);
cube(-2, 1, -2, 2, 1, 2, MARBLE);

// two saddle seats, riders face north, backrests to the south
cube(-2, 2, -1, -1, 2, 1, BROWN);
cube(1, 2, -1, 2, 2, 1, BROWN);
cube(-2, 2, 2, -1, 4, 2, BROWN);
cube(1, 2, 2, 2, 4, 2, BROWN);

// crystal spine between the riders
line(0, 2, 0, 0, 5, 0, GLASS);

// ivory levers flanking the seats, brass knobs
line(-2, 2, -2, -2, 4, -2, MARBLE);
block(-2, 5, -2, GOLD);
line(2, 2, -2, 2, 4, -2, MARBLE);
block(2, 5, -2, GOLD);

// control column feeding the front dial
line(0, 2, -2, 0, 4, -2, IRON);

// corner posts, top frame, glass canopy and side panes
line(-3, 2, -3, -3, 6, -3, GOLD);
line(3, 2, -3, 3, 6, -3, GOLD);
line(-3, 2, 3, -3, 6, 3, GOLD);
line(3, 2, 3, 3, 6, 3, GOLD);
cube(-3, 6, -3, 3, 6, -3, GOLD);
cube(-3, 6, 3, 3, 6, 3, GOLD);
cube(-3, 6, -3, -3, 6, 3, GOLD);
cube(3, 6, -3, 3, 6, 3, GOLD);
cube(-2, 6, -2, 2, 6, 2, GLASS);
cube(-3, 2, -2, -3, 5, 2, GLASS);
cube(3, 2, -2, 3, 5, 2, GLASS);

// the dial on the front face (north)
diskXY(0, 4, -3, 2.6, GOLD);
diskXY(0, 4, -3, 1.8, MARBLE);
line(0, 4, -3, 0, 5, -3, IRON);
line(0, 4, -3, 1, 4, -3, IRON);
block(0, 4, -3, BLACK);

// temporal crackle above the canopy
block(0, 7, 0, ELECTRIC);
block(-2, 7, -2, ELECTRIC);
block(2, 7, 2, ELECTRIC);
block(2, 7, -2, ELECTRIC);
block(-2, 7, 2, ELECTRIC);

// ---------- 4. cobbled street ----------
cube(-21, -1, 5, 21, -1, 8, COBBLE);
lamp(-12, 6);
lamp(12, 6);
lamp(-19, 6);
lamp(19, 6);

// ---------- 5. Victorian row houses ----------
house(-20, -16, 10);
house(-15, -12, 14);
house(-11, -8, 9);
house(8, 11, 9);
house(12, 15, 13);
house(16, 20, 11);
block(13, 15, 11, STEAM);   // smoke from the tall house's chimney

// ---------- 6. clock tower behind the machine ----------
cube(-4, 0, 9, 4, 20, 12, BRICK);
cube(-5, 21, 8, 5, 21, 13, COBBLE);     // cornice
cube(-3, 22, 9, 3, 23, 12, GRAY);       // spire, stepped
cube(-2, 24, 10, 2, 26, 11, GRAY);
cube(-1, 27, 10, 1, 29, 11, GOLD);
block(0, 30, 10, GOLD);

for (const y of [3, 6, 9, 12])          // tower windows
  for (const x of [-2, 2]) {
    block(x, y, 9, GLASS);
    block(x, y + 1, 9, GLASS);
  }

// clock face on the front of the tower
diskXY(0, 16, 8, 3.2, GOLD);
diskXY(0, 16, 8, 2.3, MARBLE);
line(0, 16, 8, 0, 18, 8, IRON);
line(0, 16, 8, 2, 16, 8, IRON);
block(0, 16, 8, BLACK);