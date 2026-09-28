// wizard-fireball-haiku — prompt:
// a wizard casting a fireball...

// Wizard casting fireball

// Platform base
cube(-2, -1, -2, 2, -1, 2, STONE);
cube(-3, -2, -3, 3, -2, 3, COBBLE);

// Robe body - main structure
cube(-1, 0, -1, 1, 4, 1, PURPLE);

// Robe skirt - wider base
cube(-2, 1, -2, 2, 4, 2, PURPLE);

// Robe fold details
block(-2, 2, -2, PURPLE);
block(-2, 3, -1, PURPLE);
block(2, 2, 2, PURPLE);
block(2, 3, 1, PURPLE);
block(-1, 2, -2, PURPLE);
block(1, 3, 2, PURPLE);

// Left arm (relaxed down)
cube(-4, 2, -1, -1, 3, 1, PURPLE);
cube(-5, 2, 0, -4, 3, 0, PURPLE);

// Right arm (raised up for casting)
cube(1, 2, -1, 3, 3, 1, PURPLE);
cube(2, 3, -1, 4, 4, 1, PURPLE);
cube(3, 3, -1, 4, 5, 1, PURPLE);

// Shoulder armor
cube(-2, 3, -1, 2, 4, 1, BLUE);
block(-3, 3, 0, BLUE);
block(4, 4, 0, BLUE);

// Neck
cube(-1, 4, 0, 1, 4, 0, YELLOW);

// Head
cube(-1, 5, -1, 1, 6, 1, YELLOW);

// Eyes - glowing magical eyes
block(-1, 5, 0, NEON_BLUE);
block(1, 5, 0, NEON_BLUE);

// Pointy wizard hat - layered cone
block(0, 6, 0, PURPLE);
block(-1, 6, 0, PURPLE);
block(1, 6, 0, PURPLE);
block(0, 6, -1, PURPLE);
block(0, 6, 1, PURPLE);
block(0, 7, 0, PURPLE);
block(-1, 7, 0, PURPLE);
block(1, 7, 0, PURPLE);
block(0, 8, 0, PURPLE);
block(0, 9, 0, PURPLE);

// Hat band - gold trim
cube(-1, 6, -1, 1, 6, 1, GOLD);

// Staff in right hand
line(3, 3, 0, 3, 7, 0, OAK_LOG);
line(4, 3, 0, 4, 5, 0, OAK_LOG);

// Staff head - glowing crystal orb
sphere(3, 7, 0, 1, GLOWSTONE);
block(3, 8, 0, GLOWSTONE);

// Magical belt
cube(-2, 3, -1, 2, 3, 1, GOLD);
block(-1, 3, -2, GOLD);
block(0, 3, -2, GOLD);
block(1, 3, 2, GOLD);

// Ground aura glow
cube(-1, 0, -1, 1, 0, 1, GLOWSTONE);
block(-2, 0, -2, GLOWSTONE);
block(2, 0, 2, GLOWSTONE);

// ========== FIREBALL ==========
// Fireball positioned in front of wizard (toward -Z)
const fbx = 0, fby = 3, fbz = -7;

// Core of fireball - LAVA
sphere(fbx, fby, fbz, 1, LAVA);

// Outer flame effect - FIRE (creates particle effect)
sphere(fbx, fby, fbz, 2, FIRE);

// Expanding aura
block(fbx-2, fby, fbz, ORANGE);
block(fbx+2, fby, fbz, ORANGE);
block(fbx, fby+2, fbz, ORANGE);
block(fbx, fby-2, fbz, ORANGE);

// Surrounding flame blocks
block(fbx-1, fby+1, fbz, FIRE);
block(fbx+1, fby+1, fbz, FIRE);
block(fbx-1, fby-1, fbz, FIRE);
block(fbx+1, fby-1, fbz, FIRE);
block(fbx, fby, fbz-1, FIRE);
block(fbx, fby, fbz+1, FIRE);
block(fbx, fby+1, fbz-1, FIRE);

// Bright glow highlights
block(fbx, fby+2, fbz, GLOWSTONE);
block(fbx+1, fby+1, fbz, NEON_RED);
block(fbx-1, fby+1, fbz, NEON_RED);
block(fbx-2, fby+1, fbz, ORANGE);
block(fbx+2, fby+1, fbz, ORANGE);

// ========== ENERGY BEAM ==========
// Main energy trail from staff to fireball
line(3, 3, 0, fbx, fby, fbz, ORANGE);
line(3, 4, 0, fbx, fby-1, fbz-2, ORANGE);

// Secondary magical trails
line(3, 4, 0, fbx+1, fby+1, fbz-3, NEON_RED);
line(3, 5, 0, fbx-1, fby, fbz-4, NEON_RED);

// Casting point effects
block(2, 3, 0, ORANGE);
block(2, 4, 0, NEON_RED);
block(2, 4, -1, ORANGE);

// Wave effect emanating from fireball
block(fbx-3, fby, fbz, ORANGE);
block(fbx+3, fby, fbz, ORANGE);