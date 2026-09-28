// wizard-fireball-sonnet — prompt:
// a wizard casting a fireball...

// ===== Stone dais / ground platform =====
disk(0, -1, 7, 5, MARBLE);
disk(0, 0, 7, 4, STONE);
hollowCylinder(0, -1, 7, 5, 1, COBBLE);

// crack lines radiating in the marble
line(-4, 0, 7, -2, 0, 7, GRAY);
line(4, 0, 7, 2, 0, 7, GRAY);
line(0, 0, 3, 0, 0, 5, GRAY);
line(0, 0, 11, 0, 0, 9, GRAY);

// four rune pillars around the dais, glowing tops
const pillarSpots = [[-4, 5], [4, 5], [-4, 9], [4, 9]];
for (const [px, pz] of pillarSpots) {
  cube(px, 0, pz, px, 2, pz, STONE);
  block(px, 3, pz, NEON_BLUE);
}

// ===== Wizard boots =====
cube(-2, 0, 7, -1, 0, 8, BLACK);
cube(1, 0, 7, 2, 0, 8, BLACK);

// ===== Wizard robe (flared cone, tapering upward) =====
disk(0, 0, 7, 3, PURPLE);
disk(0, 1, 7, 3, PURPLE);
hollowCylinder(0, 0, 7, 3, 1, GOLD); // hem trim
disk(0, 2, 7, 3, PURPLE);
disk(0, 3, 7, 2, PURPLE);
disk(0, 4, 7, 2, PURPLE);
disk(0, 5, 7, 2, MAGENTA); // chest/shoulder band, slightly lighter
hollowCylinder(0, 5, 7, 2, 1, GOLD); // shoulder trim
disk(0, 6, 7, 1, MAGENTA); // neck/collar

// belt / sash
hollowCylinder(0, 2, 7, 3, 1, GOLD);
block(0, 2, 5, GOLD); // belt buckle at front

// ===== Head =====
sphere(0, 7, 7, 1, SAND);
block(-1, 7, 6, NEON_BLUE); // left eye (glowing, magical wizard)
block(1, 7, 6, NEON_BLUE); // right eye
block(0, 6, 6, SAND); // nose bridge

// beard, flowing down from chin
cube(-1, 4, 6, 1, 6, 6, WHITE);
cube(-1, 3, 5, 1, 5, 6, WHITE);
line(-1, 3, 6, -1, 2, 5, WHITE);
line(1, 3, 6, 1, 2, 5, WHITE);
block(0, 2, 5, WHITE);

// mustache accent
line(-1, 6, 6, 1, 6, 6, WHITE);

// ===== Wizard hat =====
disk(0, 8, 7, 2, PURPLE);
hollowCylinder(0, 8, 7, 2, 1, GOLD); // brim trim
disk(0, 9, 7, 1, PURPLE);
block(0, 10, 7, PURPLE);
block(0, 11, 7, PURPLE);
block(0, 12, 7, GOLD); // star tip
block(0, 13, 7, NEON_BLUE); // glowing tip gem

// ===== Arms raised, casting toward the fireball =====
line(-2, 6, 6, -1, 5, -2, PURPLE);
cube(-2, 6, 6, -2, 6, 6, PURPLE); // shoulder pad
block(-1, 5, -2, SAND); // left hand
block(-2, 5, -1, SAND); // knuckle detail

line(2, 6, 6, 1, 5, -2, PURPLE);
cube(2, 6, 6, 2, 6, 6, PURPLE); // shoulder pad
block(1, 5, -2, SAND); // right hand
block(2, 5, -1, SAND); // knuckle detail

// sleeve cuffs (gold trim at wrists)
block(-1, 5, -1, GOLD);
block(1, 5, -1, GOLD);

// ===== Energy stream from hands into the fireball =====
line(-1, 5, -2, 0, 5, -4, FIRE);
line(1, 5, -2, 0, 5, -4, FIRE);
line(-1, 5, -2, 0, 6, -3, ELECTRIC);
line(1, 5, -2, 0, 6, -3, ELECTRIC);

// ===== The fireball itself =====
sphere(0, 5, -4, 3, ORANGE);
sphere(0, 5, -4, 2, GOLD);
sphere(0, 5, -4, 1, NEON_RED);
hollowSphere(0, 5, -4, 4, FIRE); // roiling flame shell in open air

// scattered embers/sparks kicked off the fireball
block(-4, 6, -5, NEON_RED);
block(4, 6, -5, NEON_RED);
block(-3, 3, -6, NEON_RED);
block(3, 3, -6, NEON_RED);
block(0, 8, -4, FIRE);
block(-3, 7, -2, FIRE);
block(3, 7, -2, FIRE);
block(0, 2, -4, FIRE);
block(-4, 5, -2, ELECTRIC);
block(4, 5, -2, ELECTRIC);

// ===== Scorched ground beneath the fireball's path =====
disk(0, 0, -4, 4, BLACK);
disk(0, 0, -4, 5, STONE);
disk(0, 0, -4, 3, BLACK);
line(-2, 0, -6, 2, 0, -2, GRAY); // crack pattern
line(2, 0, -6, -2, 0, -2, GRAY);
block(-1, 0, -4, LAVA);
block(1, 0, -3, LAVA);
block(0, 0, -5, LAVA);
block(2, 0, -5, LAVA);
block(-2, 0, -3, LAVA);

// wisps of smoke/fire rising off the scorched earth
block(-2, 1, -5, FIRE);
block(2, 1, -3, FIRE);
block(0, 1, -6, FIRE);
block(-3, 1, -3, FIRE);
block(3, 1, -5, FIRE);

// ===== Leaning staff prop beside the wizard, planted on the dais =====
line(3, 0, 7, 3, 6, 7, OAK_LOG);
line(3, 6, 7, 3, 7, 6, OAK_LOG); // slight curve at top
sphere(3, 8, 6, 1, NEON_BLUE);
block(3, 9, 6, NEON_BLUE);
hollowSphere(3, 8, 6, 2, ELECTRIC); // faint crackling energy around the orb

// ===== Floating open spellbook to the wizard's left =====
cube(-4, 5, 6, -3, 5, 8, BRICK);
cube(-4, 5, 6, -4, 5, 8, GOLD);
block(-3, 6, 7, GLOWSTONE); // glowing rune hovering above the pages
hollowSphere(-3, 6, 7, 1, FIRE);