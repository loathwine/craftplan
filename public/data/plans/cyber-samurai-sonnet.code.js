// cyber-samurai-sonnet — prompt:
// a cyberpunk samurai with a neon katana...

// ===== FOUNDATION: circular neon platform =====
disk(0, -1, 2, 6, NEON_BLUE);
disk(0, -1, 2, 5, BLACK);
disk(0, -1, 2, 4, STONE);
// etched circuit lines in the floor
line(0, -1, 2, 0, -1, -3, NEON_BLUE);
line(0, -1, 2, 0, -1, 7, NEON_BLUE);
line(0, -1, 2, 5, -1, 2, NEON_BLUE);
line(0, -1, 2, -5, -1, 2, NEON_BLUE);
line(-4, -1, -2, -1, -1, 2, NEON_RED);
line(4, -1, -2, 1, -1, 2, NEON_RED);

// ===== FLANKING LAMP PILLARS + HOLO PANELS =====
for (const side of [-1, 1]) {
  const px = side * 11;
  line(px, -1, 1, px, 15, 1, IRON);
  sphere(px, 16, 1, 1, NEON_BLUE);
  cube(px, 10, 0, px, 13, 3, GLASS);
  line(px, 10, 0, px, 13, 0, NEON_BLUE);
  line(px, 10, 3, px, 13, 3, NEON_BLUE);
  line(px, 10, 0, px, 10, 3, NEON_BLUE);
  line(px, 13, 0, px, 13, 3, NEON_BLUE);
  block(px, 14, 1, NEON_RED);
}

// ===== LEGS =====
for (const side of [-1, 1]) {
  const x1 = side === -1 ? -3 : 1;
  const x2 = side === -1 ? -1 : 3;
  // boots
  cube(x1, 0, 0, x2, 1, 2, BLACK);
  line(x1, 1, 0, x2, 1, 0, GOLD);
  // greaves
  cube(x1, 2, 0, x2, 6, 2, IRON);
  const midx = side === -1 ? -2 : 2;
  line(midx, 2, 0, midx, 6, 0, NEON_BLUE);
  // rivets
  block(x1, 3, 0, GOLD);
  block(x2, 3, 0, GOLD);
  block(x1, 5, 0, GOLD);
  block(x2, 5, 0, GOLD);
}
// inner bodysuit strip between legs
cube(0, 0, 0, 0, 7, 1, BLACK);

// ===== WAIST / KUSAZURI (flared skirt) =====
cube(-4, 6, -1, 4, 7, 3, BLACK);
line(-4, 7, -1, 4, 7, -1, GOLD);
line(-4, 6, 3, 4, 6, 3, GOLD);
line(-4, 6, -1, -4, 7, 3, NEON_BLUE);
line(4, 6, -1, 4, 7, 3, NEON_BLUE);

// ===== TORSO =====
cube(-3, 8, 0, 3, 13, 3, IRON);
line(-2, 8, 0, -2, 13, 0, NEON_BLUE);
line(0, 8, 0, 0, 13, 0, NEON_BLUE);
line(2, 8, 0, 2, 13, 0, NEON_BLUE);
line(-3, 10, 0, 3, 10, 0, NEON_BLUE);
sphere(0, 10, -1, 1, NEON_BLUE);
block(0, 10, -2, NEON_BLUE);
// corner rivets
block(-3, 9, 0, GOLD);
block(3, 9, 0, GOLD);
block(-3, 12, 0, GOLD);
block(3, 12, 0, GOLD);
// collar
cube(-3, 13, 0, 3, 13, 3, GOLD);

// side power conduits up the back to the banner
line(-2, 8, 3, -2, 20, 4, NEON_RED);
line(2, 8, 3, 2, 20, 4, NEON_BLUE);

// ===== PAULDRONS (samurai shoulder armor) =====
cube(-6, 12, -1, -3, 14, 3, IRON);
cube(3, 12, -1, 6, 14, 3, IRON);
line(-6, 14, -1, -7, 17, -2, GOLD);
line(-6, 14, 3, -7, 17, 4, GOLD);
line(6, 14, -1, 7, 17, -2, GOLD);
line(6, 14, 3, 7, 17, 4, GOLD);
line(-6, 12, -1, -6, 14, -1, NEON_BLUE);
line(6, 12, -1, 6, 14, -1, NEON_BLUE);

// ===== LEFT ARM (down, resting on sheathed wakizashi) =====
cube(-5, 9, 1, -4, 12, 2, IRON);
cube(-5, 5, 1, -4, 9, 2, IRON);
cube(-5, 4, 1, -4, 5, 2, BLACK);
cube(-7, 6, 0, -4, 7, 2, BLACK);
line(-7, 7, 0, -4, 7, 0, GOLD);
block(-7, 6, 1, GOLD);

// ===== NECK / HEAD / FACE =====
cube(-1, 14, 1, 1, 15, 2, IRON);
cube(-2, 15, 0, 2, 18, 3, BLACK);
block(-1, 16, 0, NEON_RED);
block(1, 16, 0, NEON_RED);
line(-2, 15, 0, 2, 15, 0, GOLD);
line(-2, 17, 0, 2, 17, 0, GOLD);

// ===== KABUTO HELMET =====
sphere(0, 19, 2, 3, IRON);
disk(0, 17, 2, 4, GOLD);
line(-4, 17, 2, -4, 17, -1, GOLD);
line(4, 17, 2, 4, 17, -1, GOLD);
// crescent horns (kuwagata)
line(-3, 20, 2, -6, 26, -1, GOLD);
line(-3, 20, 3, -6, 26, 0, GOLD);
line(3, 20, 2, 6, 26, -1, GOLD);
line(3, 20, 3, 6, 26, 0, GOLD);
// central maedate crest, glowing
line(0, 20, 1, 0, 25, -3, NEON_BLUE);
block(0, 25, -3, NEON_BLUE);

// ===== RIGHT ARM (raised, wielding katana) =====
line(4, 13, 1, 6, 17, -1, IRON);
line(5, 13, 1, 7, 17, -1, IRON);
line(6, 17, -1, 8, 20, -4, IRON);
line(7, 17, -1, 9, 20, -4, IRON);
block(8, 20, -4, BLACK);
block(9, 20, -4, BLACK);
block(9, 21, -4, BLACK);

// ===== NEON KATANA =====
line(8, 20, -4, 9, 21, -5, BLACK);
block(9, 21, -5, GOLD);
block(10, 21, -5, GOLD);
line(9, 21, -5, 13, 27, -11, NEON_BLUE);
line(10, 21, -5, 14, 27, -11, NEON_BLUE);
block(13, 27, -11, WHITE);
block(14, 27, -11, WHITE);

// energized blade sparks (kept sparse per effect-density rules)
block(13, 28, -11, ELECTRIC);
block(14, 28, -10, ELECTRIC);
block(12, 27, -12, ELECTRIC);
block(0, 26, -4, ELECTRIC);
block(-6, 27, 0, ELECTRIC);

// ===== BACK BANNER (sashimono) =====
line(0, 14, 4, 0, 27, 4, IRON);
cube(-1, 20, 5, 1, 27, 5, PURPLE);
line(-1, 20, 5, 1, 20, 5, NEON_BLUE);
line(-1, 27, 5, 1, 27, 5, NEON_BLUE);
line(-1, 20, 5, -1, 27, 5, NEON_BLUE);
line(1, 20, 5, 1, 27, 5, NEON_BLUE);
line(0, 20, 5, 0, 27, 5, NEON_RED);

// ===== FLOATING COMPANION DRONE =====
sphere(-9, 18, -3, 1, IRON);
block(-9, 18, -4, NEON_RED);
line(-9, 17, -3, -9, 16, -3, NEON_BLUE);