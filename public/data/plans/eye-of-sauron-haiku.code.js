// eye-of-sauron-haiku — prompt:
// the Eye of Sauron on the tower of Barad-dur...

// Barad-dûr: The Dark Tower with the Eye of Sauron

// ===== TOWER BASE (y=0-6) =====
cube(-11, 0, -11, 11, 6, 11, OBSIDIAN);
cube(-9, 1, -9, 9, 5, 9, AIR);

// Structural rings at base
cube(-11, 4, -11, 11, 6, -10, IRON);
cube(-11, 4, 10, 11, 6, 11, IRON);
cube(-11, 4, -11, -10, 6, 11, IRON);
cube(10, 4, -11, 11, 6, 11, IRON);

// ===== MIDDLE TOWER (y=6-14) =====
cube(-7, 6, -7, 7, 14, 7, OBSIDIAN);
cube(-5, 7, -5, 5, 13, 5, AIR);

// Buttress bands
cube(-7, 10, -7, 7, 12, -6, IRON);
cube(-7, 10, 6, 7, 12, 7, IRON);
cube(-7, 10, -7, -6, 12, 7, IRON);
cube(6, 10, -7, 7, 12, 7, IRON);

// ===== UPPER TOWER (y=14-24) =====
cube(-4, 14, -4, 4, 24, 4, OBSIDIAN);
cube(-2, 16, -2, 2, 23, 2, AIR);

// Top ring
cube(-4, 22, -4, 4, 24, 4, OBSIDIAN);

// ===== EYE PLATFORM (y=24-26) =====
cube(-9, 24, -9, 9, 25, 9, OBSIDIAN);

// ===== EYE SOCKET FRAME =====
cube(-8, 26, -8, 8, 31, 8, OBSIDIAN);
cube(-7, 27, -7, 7, 30, 7, AIR);

// ===== THE EYE ITSELF (y=26-28) =====
// Iris - large glowing red circle
for (let x = -5; x <= 5; x++) {
  for (let z = -5; z <= 5; z++) {
    const dist = Math.hypot(x, z);
    
    // Main iris
    if (dist <= 4.5) {
      block(x, 27, z, NEON_RED);
      if (dist <= 3) {
        block(x, 26, z, NEON_RED);
        block(x, 28, z, NEON_RED);
      }
    }
  }
}

// Iris rim - metallic outline
for (let x = -6; x <= 6; x++) {
  for (let z = -6; z <= 6; z++) {
    const dist = Math.hypot(x, z);
    if (dist >= 4.7 && dist <= 5.2) {
      block(x, 27, z, IRON);
    }
  }
}

// Pupil - dark obsidian center
for (let x = -2; x <= 2; x++) {
  for (let z = -2; z <= 2; z++) {
    const dist = Math.hypot(x, z);
    if (dist <= 2) {
      block(x, 27, z, OBSIDIAN);
      block(x, 26, z, OBSIDIAN);
      block(x, 28, z, OBSIDIAN);
    }
  }
}

// Eye gleam - bright highlights on pupil
block(1, 28, -1, GLOWSTONE);
block(-1, 28, 1, GLOWSTONE);

// Eye lids - iron bands
cube(-7, 30, -7, 7, 31, -6, IRON);
cube(-7, 30, 6, 7, 31, 7, IRON);
cube(-7, 27, -7, -6, 30, 7, OBSIDIAN);
cube(6, 27, -7, 7, 30, 7, OBSIDIAN);

// Fiery corner accents - menacing glow
block(-6, 27, -6, FIRE);
block(6, 27, -6, FIRE);
block(-6, 27, 6, FIRE);
block(6, 27, 6, FIRE);

// Crown - peaked roof structure above eye
cube(-7, 31, -7, 7, 32, -6, OBSIDIAN);
cube(-7, 31, 6, 7, 32, 7, OBSIDIAN);
cube(-7, 31, -7, -6, 32, 7, OBSIDIAN);
cube(6, 31, -7, 7, 32, 7, OBSIDIAN);

// Final spire point
block(0, 32, 0, OBSIDIAN);
block(0, 33, 0, OBSIDIAN);