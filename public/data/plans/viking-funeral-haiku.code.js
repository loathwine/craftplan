// viking-funeral-haiku — prompt:
// a burning Viking funeral ship...

const AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, OAK_LOG = 4, LEAVES = 5, SAND = 6, PLANKS = 7, COBBLE = 8, BRICK = 10, GLASS = 11, SNOW = 12, ICE = 13;
const WHITE = 20, LIGHT_GRAY = 21, GRAY = 22, BLACK = 23, RED = 24, ORANGE = 25, YELLOW = 26, LIME = 27, GREEN = 28, CYAN = 29, LIGHT_BLUE = 30, BLUE = 31, PURPLE = 32, MAGENTA = 33, PINK = 34, BROWN = 35;
const GOLD = 36, IRON = 37, COPPER = 38, OBSIDIAN = 39, MARBLE = 40, WATER = 41, LAVA = 42, GLOWSTONE = 43, NEON_RED = 44, NEON_BLUE = 45, FIRE = 46, ELECTRIC = 47;

// Keel and central plank
for (let z = -18; z <= 18; z++) {
  cube(-1, 0, z, 1, 2, z, PLANKS);
}

// Hull sides - port (left) and starboard (right)
for (let z = -18; z <= 18; z++) {
  // Port side curve
  cube(-10, 1, z, -5, 5, z, BROWN);
  cube(-10, 0, z, -10, 1, z, OAK_LOG);
  
  // Starboard curve
  cube(5, 1, z, 10, 5, z, BROWN);
  cube(10, 0, z, 10, 1, z, OAK_LOG);
  
  // Ribs
  if (z % 3 === 0) {
    cube(-4, 1, z, 4, 4, z, OAK_LOG);
  }
}

// Deck - solid platform
cube(-9, 5, -18, 9, 6, 18, PLANKS);

// DRAGON HEAD BOW - facing north (-Z)
// Curved prow structure
cube(-4, 6, -22, 4, 9, -18, BROWN);
// Dragon head
sphere(0, 10, -22, 3.5, GOLD);
// Carved eye sockets
block(-1.5, 11, -23, NEON_RED);
block(1.5, 11, -23, NEON_RED);
// Snout
cube(-2, 7, -23, 2, 9, -23, BROWN);
cube(-1, 6, -24, 1, 8, -24, GOLD);

// STERN CASTLE
cube(-8, 6, 14, 8, 8, 18, PLANKS);
cube(-8, 8, 16, 8, 10, 18, BROWN);

// MAST - tall central mast
cube(-0.5, 6, -2, 0.5, 22, 2, OAK_LOG);
// Rigging
line(-6, 18, -2, 6, 18, 2, GRAY);
line(-8, 15, -2, 8, 15, 2, GRAY);

// SHIELDS - port side
for (let z = -14; z <= 14; z += 5) {
  disk(-10, 4, z, 1.5, RED);
  block(-10, 4, z, GOLD);
}

// SHIELDS - starboard side
for (let z = -14; z <= 14; z += 5) {
  disk(10, 4, z, 1.5, RED);
  block(10, 4, z, GOLD);
}

// OARS
line(-11, 3.5, -8, -13, 3.5, -8, OAK_LOG);
line(11, 3.5, -8, 13, 3.5, -8, OAK_LOG);
line(-11, 3.5, 8, -13, 3.5, 8, OAK_LOG);
line(11, 3.5, 8, 13, 3.5, 8, OAK_LOG);

// BURIAL CHAMBER - central
cube(-4, 2, -3, 4, 6, 3, MARBLE);
cube(-3, 3, -2, 3, 5, 2, WHITE);  // Shroud

// WARRIOR figure atop shroud
cube(-0.5, 6, -1, 0.5, 9, 0.5, OBSIDIAN);  // Armor
block(0, 10, 0, GOLD);  // Helm
line(-2, 8, -0.5, 2, 8, -0.5, IRON);  // Sword across
block(-3, 7, -1, GOLD);  // Shield
block(3, 7, 0, IRON);  // Axe

// TREASURE - golden items scattered on deck
cube(-6, 6, -5, -5, 7, -4, GOLD);
cube(5, 6, -6, 6, 7, -5, GOLD);
cube(-8, 6, 6, -7, 7, 7, GOLD);
cube(7, 6, 5, 8, 7, 6, GOLD);

// WOODEN BRACING
line(-9, 5, -15, 9, 5, -15, OAK_LOG);
line(-9, 5, -5, 9, 5, -5, OAK_LOG);
line(-9, 5, 5, 9, 5, 5, OAK_LOG);
line(-9, 5, 15, 9, 5, 15, OAK_LOG);

// FIRE AND FLAMES - burning ship
// Central fire cluster
block(0, 7, 0, FIRE);
block(1, 8, 1, FIRE);
block(-1, 8, -1, FIRE);
block(0, 9, 0, FIRE);

// Bow fire
block(-1, 9, -18, FIRE);
block(1, 10, -17, FIRE);
block(0, 11, -16, FIRE);

// Stern fire
block(-2, 9, 16, FIRE);
block(2, 10, 17, FIRE);
block(0, 8, 15, FIRE);

// Port side fire
block(-6, 8, -10, FIRE);
block(-7, 9, -5, FIRE);
block(-8, 7, 5, FIRE);

// Starboard side fire
block(6, 8, -10, FIRE);
block(7, 9, -5, FIRE);
block(8, 7, 5, FIRE);

// Burning wood - orange sections
cube(-4, 6, -8, -2, 7, -6, ORANGE);
cube(2, 6, -8, 4, 7, -6, ORANGE);
cube(-5, 7, 0, -3, 8, 2, LAVA);
cube(3, 7, 0, 5, 8, 2, LAVA);
cube(-7, 6, 8, -5, 7, 10, ORANGE);
cube(5, 6, 8, 7, 7, 10, ORANGE);

// Charred deck planks
for (let z = -12; z <= 12; z += 4) {
  block(-8, 6, z, BLACK);
  block(8, 6, z, BLACK);
  block(-4, 6, z, GRAY);
  block(4, 6, z, GRAY);
}

// Hull breach - charring and damage
cube(-9, 3, -12, -8, 4, -10, GRAY);
cube(-9, 2, -12, -8, 3, -10, BLACK);
cube(8, 3, 8, 9, 4, 10, GRAY);

// Carved dragon motif on bow
cube(-6, 7, -20, -3, 9, -18, BROWN);
block(-5, 8, -19, GOLD);
block(-4, 8, -19, GOLD);

// Stern decorative tower
cube(-6, 9, 16, 6, 11, 16, PLANKS);
block(0, 12, 16, GOLD);