// venom-4x-opus — prompt:
// Venom...

const BODY = COBBLE;
const DARK  = STONE;
const WHITE = SNOW;
const RED   = BRICK;

// ---- targeted clear of the figure volume (we override anyway; keep ground at y<=0) ----
cube(-14, 1, -4, 14, 33, 12, AIR);

// ============================================================
// LEGS  (planted, muscular)  facing north (-Z front)
// ============================================================
// feet (stepped slightly forward)
cube(-6, -1, 2, -2, 1, 9, BODY);
cube( 2, -1, 2,  6, 1, 9, BODY);
// shins
cube(-5, 1, 3, -2, 5, 8, BODY);
cube( 2, 1, 3,  5, 5, 8, BODY);
// thighs
cube(-6, 5, 3, -1, 9, 9, BODY);
cube( 1, 5, 3,  6, 9, 9, BODY);
// knee / shin shadow veins
line(-4,1,3,-4,5,3, DARK);
line( 3,1,3, 3,5,3, DARK);

// ============================================================
// TORSO  (broad hulking chest)
// ============================================================
cube(-7, 9, 2, 7, 11, 9, BODY);      // hips
cube(-8, 11, 1, 8, 17, 9, BODY);     // chest
cube(-4, 17, 3, 4, 19, 8, BODY);     // upper chest -> neck base
// pec / ab shadow grooves
line(0,11,1,0,17,1, DARK);           // sternum
line(-6,12,1,-6,16,1, DARK);
line( 6,12,1, 6,16,1, DARK);
line(-4,11,1,-4,13,1, DARK);
line( 4,11,1, 4,13,1, DARK);

// neck
cube(-3, 17, 3, 3, 19, 7, BODY);

// ---- white spider emblem on chest (front z=1) ----
line(0, 17, 1, 0, 11, 1, WHITE);     // spine of the spider
line(-1, 16, 1, -5, 17, 1, WHITE);   // upper legs
line( 1, 16, 1,  5, 17, 1, WHITE);
line(-1, 15, 1, -5, 15, 1, WHITE);
line( 1, 15, 1,  5, 15, 1, WHITE);
line(-1, 14, 1, -5, 13, 1, WHITE);   // lower legs
line( 1, 14, 1,  5, 13, 1, WHITE);
line(-1, 13, 1, -4, 11, 1, WHITE);
line( 1, 13, 1,  4, 11, 1, WHITE);

// ============================================================
// ARMS  (massive, clawed fists)
// ============================================================
function arm(sx){                    // sx = +1 right, -1 left
  const o = sx > 0 ? 8 : -11;        // outer x start
  const i = sx > 0 ? 11 : -8;        // inner x end
  const x1 = Math.min(o, i), x2 = Math.max(o, i);
  cube(x1, 15, 3, x2, 18, 8, BODY);          // shoulder / deltoid
  const ux1 = sx > 0 ? 9 : -11, ux2 = sx > 0 ? 11 : -9;
  cube(Math.min(ux1,ux2), 9, 4, Math.max(ux1,ux2), 15, 8, BODY);  // upper arm
  const fx1 = sx > 0 ? 9 : -12, fx2 = sx > 0 ? 12 : -9;
  cube(Math.min(fx1,fx2), 4, 4, Math.max(fx1,fx2), 9, 9, BODY);   // forearm
  cube(Math.min(fx1,fx2), 2, 4, Math.max(fx1,fx2), 4, 9, BODY);   // fist
  // vein
  const vx = sx > 0 ? 10 : -10;
  line(vx, 5, 4, vx, 14, 4, DARK);
  // claws
  for (let x = Math.min(fx1,fx2); x <= Math.max(fx1,fx2); x++) {
    block(x, 3, 10, WHITE);
  }
}
arm(1);
arm(-1);

// ============================================================
// HEAD  (huge, elongated symbiote skull)
// ============================================================
cube(-6, 19, 0, 6, 30, 7, BODY);
// hollow the back to save blocks
cube(-4, 22, 3, 4, 28, 6, AIR);
// round the top corners
cube(-6, 29, 0, -5, 30, 7, AIR);
cube( 5, 29, 0,  6, 30, 7, AIR);
cube(-6, 19, 0, -6, 20, 7, AIR);
cube( 6, 19, 0,  6, 20, 7, AIR);

// ---- angry brow: heavy central dark wedge dividing the eyes ----
cube(-1, 25, 0, 1, 30, 3, BODY);
line(-2, 29, 0, 2, 29, 0, BODY);

// ---- EYES: big slanted white almonds (inner tip low = furious) ----
// right eye
cube(1, 24, 0, 2, 25, 2, WHITE);
cube(2, 25, 0, 4, 27, 2, WHITE);
cube(3, 26, 0, 6, 28, 2, WHITE);
// left eye (mirror)
cube(-2, 24, 0, -1, 25, 2, WHITE);
cube(-4, 25, 0, -2, 27, 2, WHITE);
cube(-6, 26, 0, -3, 28, 2, WHITE);

// ============================================================
// MOUTH  (gaping maw, jagged teeth, lolling tongue)
// ============================================================
// carve the open cavity
cube(-5, 20, 0, 5, 23, 5, AIR);
// dark inner mouth back wall
cube(-5, 20, 5, 5, 23, 5, DARK);

// top fangs (hang down, alternating length)
for (let x = -5; x <= 5; x++) {
  const bottomY = (Math.abs(x) % 2 === 0) ? 21 : 22;
  cube(x, bottomY, 0, x, 24, 1, WHITE);
}
// bottom fangs (point up)
for (let x = -5; x <= 5; x++) {
  const topY = (Math.abs(x) % 2 === 1) ? 21 : 20;
  cube(x, 19, 0, x, topY, 1, WHITE);
}

// ---- long red tongue: out over the lip, drooping down the front ----
cube(-1, 21, 3, 1, 22, 4, RED);   // root inside mouth
cube(-1, 20, 0, 1, 22, 2, RED);   // across the teeth
cube(-1, 18, -2, 1, 20, 0, RED);  // spilling over the lip
cube(-1, 14, -2, 1, 18, -1, RED); // dangling down the chin
cube(-1, 12, -3, 1, 14, -2, RED); // curling tip forward
block(0, 11, -3, RED);

// drool strings
line(-3, 20, 0, -3, 17, -1, ICE);
line( 3, 20, 0,  3, 16, -1, ICE);

// ============================================================
// SYMBIOTE TENDRILS  (writhing up off the shoulders & skull)
// ============================================================
line(-6, 29, 5, -9, 33, 3, BODY);
line(-9, 33, 3, -7, 32, 1, BODY);
line( 6, 29, 5,  9, 33, 4, BODY);
line( 9, 33, 4,  7, 32, 2, BODY);
line( 0, 30, 6,  0, 33, 8, BODY);
line( 0, 33, 8,  2, 32, 9, BODY);
line(-8, 18, 4, -11, 24, 5, BODY);
line( 8, 18, 4,  11, 23, 5, BODY);
// tendril tips catching light
block(-7, 32, 1, DARK);
block( 7, 32, 2, DARK);
block(-11, 24, 5, DARK);
block( 11, 23, 5, DARK);