// chimera-4x-haiku — prompt:
// a chimera...

// CHIMERA - Mythical hybrid: Lion head (north/front), Goat body (middle), Serpent tail (south/back)

// ===== LION HEAD (facing north) =====
// Main skull structure
cube(-3, 7, -13, 5, 12, -1, STONE);

// Snout/muzzle projection
cube(-2, 8, -15, 4, 11, -13, STONE);

// Snout tip
cube(-1, 8, -16, 3, 10, -15, BRICK);

// Nostril cavities (AIR)
block(0, 8, -16, AIR);
block(1, 8, -16, AIR);

// Eyes (GLASS for supernatural gleam)
block(-1, 10, -16, GLASS);
block(2, 10, -16, GLASS);

// Eyebrow ridge
cube(-1, 11, -16, 2, 13, -15, STONE);

// Ears - tall and feline
cube(-5, 12, -10, -3, 15, -7, STONE);
cube(6, 12, -10, 8, 15, -7, STONE);

// Inner ear (BRICK detail)
cube(-5, 12, -9, -4, 14, -8, BRICK);
cube(7, 12, -9, 8, 14, -8, BRICK);

// Mane - thick, flowing backward (BRICK for fire-like appearance)
// Upper crown
cube(-3, 13, -9, 5, 16, -1, BRICK);

// Left mane volume
cube(-6, 11, -7, -3, 15, 1, BRICK);

// Right mane volume
cube(6, 11, -7, 9, 15, 1, BRICK);

// Mane layers and depth
cube(-5, 14, -8, -3, 17, 0, BRICK);
cube(6, 14, -8, 8, 17, 0, BRICK);

// Lower jaw/chin
cube(-2, 5, -14, 4, 8, -12, STONE);

// Mouth line cavity
cube(-1, 6, -15, 3, 7, -14, AIR);

// ===== GOAT BODY (middle section) =====
// Neck transition
cube(-1, 5, -1, 4, 10, 3, STONE);

// Main body barrel
cube(-2, 3, 3, 5, 10, 11, STONE);

// Goat beard - hangs from chin
line(-1, 3, 4, -2, 0, 5, STONE);
line(4, 3, 4, 5, 0, 5, STONE);

// Goat horns - curved backward and upward (STONE)
line(-3, 11, 6, -7, 14, 2, STONE);
line(6, 11, 6, 10, 14, 2, STONE);

// Horn spiral ridges (COBBLE)
line(-3, 11, 6, -6, 12, 4, COBBLE);
line(6, 11, 6, 9, 12, 4, COBBLE);

// Front legs (COBBLE - sturdy and solid)
cube(-2, 0, 4, -1, 4, 6, COBBLE);
cube(5, 0, 4, 6, 4, 6, COBBLE);

// Back legs
cube(-2, 0, 9, -1, 4, 11, COBBLE);
cube(5, 0, 9, 6, 4, 11, COBBLE);

// Hooves (STONE)
cube(-2, -2, 4, -1, 0, 6, STONE);
cube(5, -2, 4, 6, 0, 6, STONE);
cube(-2, -2, 9, -1, 0, 11, STONE);
cube(5, -2, 9, 6, 0, 11, STONE);

// ===== SERPENT/DRAGON TAIL (south/back) =====
// Tail root at rear of body
cube(0, 4, 11, 3, 9, 13, BRICK);

// First curve extending south
cube(-1, 2, 13, 4, 7, 15, BRICK);

// Second section - drops lower
cube(-2, 1, 15, 5, 6, 17, BRICK);

// Third section - curves up
cube(-1, 2, 17, 4, 7, 19, BRICK);

// Tail tip - final upward curl
cube(1, 4, 19, 3, 9, 21, BRICK);

// Tail terminus - scales/spikes at very end
cube(1, 6, 21, 3, 12, 22, BRICK);

// Dorsal spikes along tail (BRICK)
block(2, 8, 12, BRICK);
block(2, 8, 14, BRICK);
block(2, 8, 16, BRICK);
block(2, 8, 18, BRICK);
block(2, 10, 20, BRICK);

// Tail ridges (COBBLE)
line(4, 6, 13, 5, 7, 15, COBBLE);
line(5, 5, 15, 6, 6, 17, COBBLE);
line(4, 5, 17, 5, 6, 19, COBBLE);

// ===== WINGS (fearsome element) =====
// Left wing (GLASS - ethereal)
cube(-7, 8, 2, -5, 13, 7, GLASS);
cube(-9, 9, 3, -7, 12, 6, GLASS);

// Right wing
cube(7, 8, 2, 9, 13, 7, GLASS);
cube(10, 9, 3, 12, 12, 6, GLASS);

// Wing support struts (STONE)
line(-5, 8, 4, -2, 9, 6, STONE);
line(6, 8, 4, 3, 9, 6, STONE);

// ===== DECORATIVE DETAILS =====
// Belly underbody scales (COBBLE patches)
cube(-1, 3, 5, 4, 4, 10, COBBLE);

// Mane wisp details
cube(-4, 15, -5, -3, 17, -2, BRICK);
cube(7, 15, -5, 8, 17, -2, BRICK);

// Tail smoke/fire effect (scattered BRICK)
block(0, 10, 22, BRICK);
block(2, 11, 22, BRICK);
block(1, 12, 21, BRICK);