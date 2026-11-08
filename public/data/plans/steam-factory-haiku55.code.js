// steam-factory-haiku55 — prompt:
// a Victorian factory with smoking chimneys...

// ===== Victorian factory with smoking chimneys =====
// Front = north (-Z). Main hall in the middle, clock tower and water tower on the left,
// boiler house and warehouse on the right, twin tall chimneys behind the hall.

function ring(x1, x2, y, z1, z2, id) {
  cube(x1, y, z1, x2, y, z1, id);
  cube(x1, y, z2, x2, y, z2, id);
  cube(x1, y, z1 + 1, x1, y, z2 - 1, id);
  cube(x2, y, z1 + 1, x2, y, z2 - 1, id);
}

function wheelZ(cx, cy, cz, r, id) {
  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= r && d > r - 1) block(cx + dx, cy + dy, cz, id);
    }
  }
  for (let i = -r + 1; i <= r - 1; i++) {
    block(cx + i, cy, cz, id);
    block(cx, cy + i, cz, id);
  }
}

// shaft (3x3 brick), optional 5x5 stone collars, 5x5 stone cap, steam from the cap
function chimney(cx, cz, top, collarYs) {
  cube(cx - 1, -1, cz - 1, cx + 1, top - 1, cz + 1, BRICK);
  for (const y of collarYs) cube(cx - 2, y, cz - 2, cx + 2, y, cz + 2, STONE);
  cube(cx - 2, top, cz - 2, cx + 2, top, cz + 2, STONE);
  block(cx, top, cz, STEAM);
  block(cx, top + 1, cz, STEAM);
}

// ---------- 1. CLEAR VOLUMES (AIR is free) ----------
cube(-12, 0, -1, 6, 24, 9, AIR);      // main hall
cube(7, 0, -6, 12, 9, -2, AIR);       // boiler house
cube(15, 0, 0, 21, 12, 8, AIR);       // warehouse
cube(-19, 0, -4, -15, 26, 0, AIR);    // clock tower zone
cube(-21, 0, 4, -17, 16, 8, AIR);     // water tower zone
cube(-10, 0, 11, 4, 30, 15, AIR);     // back chimney zone

// ---------- 2. FOUNDATIONS ----------
cube(-12, -1, -1, 6, -1, 9, COBBLE);   // hall
cube(7, -1, -6, 12, -1, -2, COBBLE);   // boiler house
cube(15, -1, 0, 21, -1, 8, COBBLE);    // warehouse
cube(-19, -1, -4, -15, -1, 0, COBBLE); // clock tower
cube(-21, -1, 4, -17, -1, 8, COBBLE);  // water tower pad

// ---------- 3. MAIN HALL (x -12..6, z -1..9) ----------
cube(-12, 0, -1, 6, 0, -1, STONE);     // north plinth
cube(-12, 0, 9, 6, 0, 9, STONE);       // south plinth
cube(-12, 1, -1, 6, 8, -1, BRICK);     // north wall
cube(-12, 1, 9, 6, 8, 9, BRICK);       // south wall
cube(-12, 1, 0, -12, 8, 8, BRICK);     // west wall
cube(6, 1, 0, 6, 8, 8, BRICK);         // east wall

const hallWindowX = [-10, -6, -3, 2];
for (const wx of hallWindowX) {
  cube(wx, 3, -1, wx + 1, 7, -1, GLASS);   // north windows
  cube(wx, 3, 9, wx + 1, 7, 9, GLASS);     // south windows
}
cube(-12, 3, 2, -12, 7, 3, GLASS);         // west window
cube(6, 3, 4, 6, 7, 5, GLASS);             // east window
block(-6, 5, -1, GLOWSTONE);               // warm lamp in window
block(2, 5, 9, GLOWSTONE);                 // warm lamp in window
cube(-1, 1, -1, 0, 3, -1, AIR);            // main gate
cube(-1, 4, -1, 0, 4, -1, STONE);          // gate lintel

// Roof: flat deck, sawtooth clerestory, parapets, vents
cube(-12, 9, -1, 6, 9, 9, GRAY);
line(-12, 10, -1, 6, 10, -1, STONE);
line(-12, 10, 9, 6, 10, 9, STONE);
for (let x = -12; x <= 6; x++) {
  const h = 12 - ((x + 12) % 4);
  if (h >= 10) cube(x, 10, -1, x, h, 1, GRAY);
}
cube(-9, 10, 4, -9, 12, 4, COBBLE);
cube(-1, 10, 4, -1, 12, 4, COBBLE);
cube(4, 10, 4, 4, 12, 4, COBBLE);
block(-9, 13, 4, STEAM);
block(4, 13, 4, STEAM);

// Interior machinery seen through the windows
cube(-9, 0, 5, -5, 0, 7, IRON);            // engine bed
cylinder(-7, 1, 6, 1, 6, IRON);            // upright steam cylinder
wheelZ(-2, 4, 3, 3, IRON);                 // flywheel
cylinder(3, 1, 5, 2, 5, COPPER);           // copper boiler

// ---------- 4. CLOCK TOWER (x -18..-16, z -3..-1) ----------
cube(-18, 0, -3, -16, 20, -1, BRICK);      // shaft
cube(-19, 10, -4, -15, 10, 0, STONE);      // belt course
cube(-19, 21, -4, -15, 21, 0, STONE);      // belfry floor
cube(-19, 22, -4, -19, 24, -4, STONE);     // corner posts
cube(-15, 22, -4, -15, 24, -4, STONE);
cube(-19, 22, 0, -19, 24, 0, STONE);
cube(-15, 22, 0, -15, 24, 0, STONE);
block(-17, 23, -2, GOLD);                  // bell
cube(-19, 25, -4, -15, 25, 0, COPPER);     // roof
cube(-18, 26, -3, -16, 26, -1, COPPER);
block(-17, 27, -2, COPPER);
block(-17, 28, -2, GOLD);                  // spire
// clock face on the north side
cube(-18, 15, -4, -16, 17, -4, WHITE);
cube(-19, 18, -4, -15, 18, -4, COPPER);
cube(-19, 14, -4, -15, 14, -4, COPPER);
line(-17, 16, -5, -17, 18, -5, BLACK);     // hour hand
line(-17, 16, -5, -15, 16, -5, BLACK);     // minute hand

// ---------- 5. WATER TOWER (centre -19,7) ----------
cube(-20, -1, 6, -20, 9, 6, OAK_LOG);
cube(-18, -1, 6, -18, 9, 6, OAK_LOG);
cube(-20, -1, 8, -20, 9, 8, OAK_LOG);
cube(-18, -1, 8, -18, 9, 8, OAK_LOG);
hollowCylinder(-19, 10, 7, 2, 5, PLANKS);
cylinder(-19, 10, 7, 1, 4, WATER);
disk(-19, 15, 7, 2, COPPER);

// ---------- 6. BOILER HOUSE (x 7..12, z -6..-2) ----------
cube(7, 1, -6, 12, 6, -6, BRICK);          // north wall
cube(7, 1, -2, 12, 6, -2, BRICK);          // south wall
cube(7, 1, -5, 7, 6, -3, BRICK);           // west wall
cube(12, 1, -5, 12, 6, -3, BRICK);         // east wall
cube(7, 7, -6, 12, 7, -2, GRAY);           // roof
cube(9, 1, -6, 10, 3, -6, AIR);            // boiler door
block(12, 3, -4, GLASS);                   // east window
block(8, 1, -4, FIRE);                     // furnace
block(8, 1, -3, FIRE);
chimney(10, -4, 14, []);                   // boiler chimney through roof

// ---------- 7. WAREHOUSE (x 15..21, z 0..8) ----------
cube(15, 1, 0, 21, 6, 0, BRICK);           // north wall
cube(15, 1, 8, 21, 6, 8, BRICK);           // south wall
cube(15, 1, 1, 15, 6, 7, BRICK);           // west wall
cube(21, 1, 1, 21, 6, 7, BRICK);           // east wall
cube(15, 7, 0, 21, 7, 8, GRAY);            // roof deck
cube(16, 8, 3, 20, 8, 5, GLASS);           // monitor glazing
cube(16, 3, 0, 16, 5, 0, GLASS);           // north windows
cube(20, 3, 0, 20, 5, 0, GLASS);
cube(16, 3, 8, 16, 5, 8, GLASS);           // south windows
cube(20, 3, 8, 20, 5, 8, GLASS);
cube(17, 1, 0, 19, 3, 0, AIR);             // loading door

// ---------- 8. TALL CHIMNEYS BEHIND THE HALL ----------
chimney(-9, 13, 26, [9, 18]);
chimney(2, 13, 22, [8, 16]);

// ---------- 9. YARD (foreground) ----------
line(-20, 0, -9, 20, 0, -9, IRON);         // rail track
// gas lamp posts
for (const [lx, lz] of [[-14, -6], [3, -6], [18, -6]]) {
  line(lx, 0, lz, lx, 4, lz, IRON);
  block(lx, 5, lz, GLOWSTONE);
}
// jib crane
cube(-6, 0, -3, -6, 8, -3, IRON);
line(-6, 8, -3, -1, 8, -3, IRON);
line(-2, 5, -3, -2, 7, -3, IRON);
// crates and barrels
cube(-13, 0, -6, -12, 1, -5, PLANKS);
cube(-7, 0, -7, -6, 1, -6, PLANKS);
cube(-4, 0, -5, -3, 0, -5, PLANKS);
cylinder(-11, 0, -8, 1, 2, OAK_LOG);
cylinder(-9, 0, -8, 1, 2, OAK_LOG);
cylinder(0, 0, -6, 1, 2, OAK_LOG);