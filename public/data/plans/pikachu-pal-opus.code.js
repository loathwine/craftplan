// pikachu-pal-opus — prompt:
// Pikachu...

cube(-12, 1, -9, 21, 33, 13, AIR);

// ---- BODY (chubby, pear-shaped) ----
sphere(0, 6, 3, 5, YELLOW);      // lower belly
sphere(0, 10, 3, 6, YELLOW);     // main body
sphere(0, 20, 2, 7, YELLOW);     // big head

// ---- EARS (tall, pointed, black tips) ----
function ear(sign) {
  for (let i = 0; i < 9; i++) {
    let y = 25 + i;
    let cx = sign * (3 + Math.floor(i * 0.5));
    let cz = 2 + Math.floor(i * 0.35);
    let half = i < 4 ? 1 : 0;
    let col = i >= 6 ? BLACK : YELLOW;
    cube(cx - half, y, cz - half, cx + half, y, cz + half, col);
  }
}
ear(-1);
ear(1);

// ---- EYES (black with white shine) ----
cube(-4, 20, -5, -2, 23, -4, BLACK);
cube(2, 20, -5, 4, 23, -4, BLACK);
block(-2, 22, -5, WHITE);
block(2, 22, -5, WHITE);

// ---- NOSE + SMILE ----
block(0, 18, -5, BLACK);
block(-1, 16, -5, BLACK);
block(0, 15, -5, BLACK);
block(1, 16, -5, BLACK);
block(2, 17, -5, BLACK);
block(-2, 17, -5, BLACK);

// ---- RED CHEEKS ----
sphere(-5, 18, -2, 2, RED);
sphere(5, 18, -2, 2, RED);

// ---- ARMS (stubby) ----
sphere(-6, 9, -1, 2, YELLOW);
sphere(6, 9, -1, 2, YELLOW);

// ---- FEET ----
sphere(-3, 2, -3, 2, YELLOW);
sphere(3, 2, -3, 2, YELLOW);
sphere(-3, 2, -3, 1, BROWN);
sphere(3, 2, -3, 1, BROWN);

// ---- LIGHTNING-BOLT TAIL (east side, visible) ----
cube(5, 4, 5, 8, 8, 8, BROWN);       // brown base
cube(7, 8, 5, 14, 11, 8, YELLOW);    // out right
cube(11, 11, 5, 14, 16, 8, YELLOW);  // up
cube(12, 15, 5, 19, 18, 8, YELLOW);  // jag right
cube(16, 18, 5, 19, 23, 8, YELLOW);  // up
cube(15, 22, 5, 21, 26, 8, YELLOW);  // top flare
cube(6, 5, 5, 7, 8, 8, BROWN);       // stem into body

// ---- ELECTRIC SPARKS ----
block(-8, 20, -3, NEON_BLUE);
block(8, 20, -3, NEON_BLUE);
block(-8, 16, -2, NEON_BLUE);
block(8, 16, -2, NEON_BLUE);
block(22, 27, 6, NEON_BLUE);
block(20, 28, 6, NEON_BLUE);
block(21, 24, 7, NEON_BLUE);