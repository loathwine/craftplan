// santa-sleigh-4x-opus — prompt:
// Santa's sleigh pulled by reindeer...

const meta = null; // (ignored – plain build script below)

// ---------- SANTA'S SLEIGH PULLED BY REINDEER ----------
// Filmed from the NORTH. Scene is a side-profile "train" running along X:
// sleigh at the WEST (-X), reindeer team leading EAST (+X, into the light).
// Body depth runs in Z; the visible/lit face is the north side (z=-2).

// --- prep: snowy ground + clear the forest canopy in our working strip ---
cube(-22, 1, -8, 22, 22, 8, AIR);            // remove overhead leaves (free)
cube(-22, -2, -7, 22, 0, 7, SNOW);           // snow field
// gentle drifts / texture on the field
for (let i = 0; i < 26; i++) {
  const x = ((i * 11 + 4) % 45) - 22;
  const z = ((i * 7) % 13) - 6;
  block(x, 1, z, SNOW);
}

// =========================================================
// SLEIGH  (x ≈ -21..-5, red BRICK, gold SAND trim, STONE runners)
// =========================================================
// --- runners / skids ---
cube(-19, 1, -2, -9, 1, 1, STONE);           // flat rail
cube(-20, 2, -2, -20, 2, 1, STONE);          // slight back upturn
// front ski-tip curl
cube(-8, 2, -2, -8, 2, 1, STONE);
cube(-7, 3, -2, -7, 3, 1, STONE);
cube(-6, 4, -2, -6, 4, 1, STONE);
cube(-5, 4, -2, -5, 4, 1, STONE);
// support struts runner -> body
block(-17, 2, -2, STONE); block(-17, 2, 1, STONE);
block(-11, 2, -2, STONE); block(-11, 2, 1, STONE);

// --- body tub ---
cube(-18, 2, -2, -9, 3, 1, BRICK);           // solid floor
cube(-10, 2, -2, -9, 6, 1, BRICK);           // front dashboard (rises)
cube(-18, 2, -2, -16, 7, 1, BRICK);          // tall back
// back scroll curl
cube(-19, 7, -2, -19, 8, 1, BRICK);
cube(-20, 8, -2, -20, 8, 1, BRICK);
cube(-21, 7, -2, -21, 8, 1, BRICK);
// open seat side walls (leave top open so Santa shows)
cube(-16, 4, -2, -11, 5, -2, BRICK);         // north side wall
cube(-16, 4, 1, -11, 5, 1, BRICK);           // south side wall
cube(-15, 4, -2, -11, 4, 1, PLANKS);         // seat cushion (tan)

// --- gold trim ---
line(-16, 6, -2, -11, 6, -2, SAND);          // north rim gold
line(-16, 6, 1, -11, 6, 1, SAND);            // south rim gold
line(-10, 7, -2, -9, 7, -2, SAND);           // front top gold
line(-18, 8, -2, -16, 8, -2, SAND);          // back top gold
block(-21, 6, -2, SAND);                     // scroll tip gold
block(-9, 5, -2, SAND);                      // front lantern

// --- Santa in the seat (x ≈ -15..-11) ---
cube(-15, 5, -2, -12, 7, 0, BRICK);          // red coat/torso
cube(-15, 5, -2, -12, 5, 0, STONE);          // black belt
block(-14, 5, -2, SAND);                     // gold buckle
block(-11, 6, -1, BRICK);                    // arm reaching to reins
cube(-15, 8, -2, -12, 9, 0, SNOW);           // white beard + head
block(-13, 8, -2, SAND);                     // face patch
cube(-16, 10, -2, -11, 10, 0, SNOW);         // hat brim
block(-13, 11, -1, BRICK); block(-13, 12, -1, BRICK); // hat cone
block(-13, 13, -1, SNOW);                    // pompom

// --- sack of gifts behind Santa ---
cube(-17, 4, -2, -16, 6, 1, OAK_LOG);        // brown sack
block(-16, 7, -1, OAK_LOG);
block(-16, 7, -2, BRICK);                    // red present
block(-17, 6, 1, ICE);                       // cyan present
block(-16, 6, -2, SAND);                     // gold-wrapped present

// =========================================================
// REINDEER TEAM  (brown OAK_LOG, facing +X into the light)
// =========================================================
function reindeer(x0, rudolph) {
  const zL = -2, zR = 1;
  const backX = x0, frontX = x0 + 4;
  // legs (prancing: back planted, front lifted forward)
  cube(backX, 1, zL, backX, 3, zL, OAK_LOG);
  cube(backX, 1, zR, backX, 3, zR, OAK_LOG);
  cube(frontX, 2, zL, frontX, 3, zL, OAK_LOG);
  cube(frontX, 2, zR, frontX, 3, zR, OAK_LOG);
  block(frontX + 1, 3, zL, OAK_LOG);          // lifted hoof forward
  block(frontX + 1, 3, zR, OAK_LOG);
  block(backX, 1, zL, STONE); block(backX, 1, zR, STONE); // hooves
  // body + higher rump
  cube(x0, 4, zL, x0 + 4, 5, zR, OAK_LOG);
  cube(x0, 4, zL, x0 + 1, 6, zR, OAK_LOG);
  // tail (white)
  cube(x0 - 1, 4, zL, x0 - 1, 5, zR, SNOW);
  // chest / neck rising toward front
  cube(x0 + 4, 4, zL, x0 + 5, 7, zR, OAK_LOG);
  // head + snout
  cube(x0 + 5, 7, zL, x0 + 6, 8, zR, OAK_LOG);
  cube(x0 + 7, 6, zL, x0 + 7, 7, zR, OAK_LOG);
  // ears
  block(x0 + 5, 9, zL, OAK_LOG); block(x0 + 6, 9, zR, OAK_LOG);
  // nose
  cube(x0 + 8, 6, -1, x0 + 8, 6, 0, rudolph ? BRICK : STONE);
  // harness collar + jingle bells (gold)
  cube(x0 + 4, 4, zL, x0 + 4, 5, zL, BRICK);
  block(x0 + 4, 4, zL, SAND);
  // antlers (tall branching silhouette)
  line(x0 + 5, 10, zL, x0 + 5, 13, zL, OAK_LOG);
  block(x0 + 4, 12, zL, OAK_LOG); block(x0 + 3, 13, zL, OAK_LOG);
  block(x0 + 6, 12, zL, OAK_LOG); block(x0 + 7, 13, zL, OAK_LOG);
  line(x0 + 6, 10, zR, x0 + 6, 13, zR, OAK_LOG);
  block(x0 + 5, 12, zR, OAK_LOG); block(x0 + 4, 13, zR, OAK_LOG);
  block(x0 + 7, 12, zR, OAK_LOG);
}

reindeer(-6, false);   // team reindeer 1
reindeer(4, false);    // team reindeer 2
reindeer(14, true);    // RUDOLPH — lead, red nose

// --- reins / traces (brown leather) ---
line(-11, 6, -1, -6, 5, -1, OAK_LOG);        // Santa's hands -> R1
line(2, 6, -1, 4, 5, -1, OAK_LOG);           // R1 -> R2
line(12, 6, -1, 14, 5, -1, OAK_LOG);         // R2 -> Rudolph

// =========================================================
// BACKGROUND & ATMOSPHERE
// =========================================================
// big moon behind the team (silhouettes antlers + scroll)
sphere(2, 25, 7, 5, SNOW);

// snowy conifers in the background (south, +Z) for depth
function conifer(x, z) {
  cube(x, 1, z, x, 4, z, OAK_LOG);
  cube(x - 2, 3, z - 1, x + 2, 3, z + 1, LEAVES);
  cube(x - 1, 4, z - 1, x + 1, 4, z + 1, LEAVES);
  block(x, 5, z, LEAVES);
  cube(x - 2, 4, z - 1, x + 2, 4, z + 1, SNOW); // snow cap
  block(x, 6, z, SNOW);
}
conifer(-18, 6);
conifer(-3, 7);
conifer(20, 6);

// foreground snow drifts (north, near camera) for separation
cube(-14, 1, -6, -10, 2, -5, SNOW); block(-12, 3, -6, SNOW);
cube(6, 1, -7, 10, 2, -6, SNOW); block(8, 3, -6, SNOW);

// stars
for (let i = 0; i < 12; i++) {
  const x = ((i * 17 + 6) % 45) - 22;
  const y = 18 + ((i * 5) % 12);
  block(x, y, 7, SNOW);
}

// falling snow
for (let i = 0; i < 34; i++) {
  const x = ((i * 7 + 3) % 45) - 22;
  const y = 7 + ((i * 13 + 2) % 13);
  const z = ((i * 5) % 9) - 4;
  block(x, y, z, SNOW);
}