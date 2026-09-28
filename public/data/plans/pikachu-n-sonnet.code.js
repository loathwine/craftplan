// pikachu-n-sonnet — prompt:
// Pikachu...

// ===== Pedestal =====
disk(0, -1, 3, 11, MARBLE);
disk(0, -1, 3, 11, STONE); // will be overridden below to leave rim
cylinder(0, -2, 3, 11, 1, STONE);
hollowCylinder(0, -1, 3, 11, 1, BRICK);
disk(0, -1, 3, 10, MARBLE);

// ===== Helpers =====
function layer(y, r, zc, id) { disk(0, y, zc, r, id); }

// ===== Torso =====
const torsoZC = 3;
const torso = { 1:3, 2:4, 3:5, 4:5, 5:5, 6:4, 7:4, 8:3, 9:2 };
for (const y in torso) layer(Number(y), torso[y], torsoZC, YELLOW);

// ===== Neck / Head =====
const headZC = 2;
const head = { 10:2, 11:3, 12:4, 13:5, 14:5, 15:5, 16:4, 17:3, 18:2 };
for (const y in head) layer(Number(y), head[y], headZC, YELLOW);

// ===== Ears (left leans back naturally, right bent tip = character) =====
for (let y = 18; y <= 27; y++) {
  const t = y - 18;
  const hw = Math.max(1, 3 - Math.floor(t / 3));
  const black = y >= 24;
  // left ear (tilts outward, straight)
  const lx = -5 - Math.floor(t * 0.35);
  cube(lx - hw, y, headZC - 1, lx + hw, y, headZC + 1, black ? BLACK : YELLOW);
  // right ear (bent tip near top)
  let rx = 5 + Math.floor(t * 0.35);
  if (y >= 25) rx -= (y - 24) * 2; // bend inward at the tip
  cube(rx - hw, y, headZC - 1, rx + hw, y, headZC + 1, black ? BLACK : YELLOW);
}

// ===== Face =====
sphere(-4, 12, -1, 2, RED);   // left cheek
sphere(4, 12, -1, 2, RED);    // right cheek
sphere(-2, 15, -3, 1, BLACK); // left eye
sphere(2, 15, -3, 1, BLACK);  // right eye
block(-2, 16, -4, WHITE);     // eye shine
block(2, 16, -4, WHITE);
block(0, 13, -3, BLACK);      // nose
line(-1, 12, -2, 1, 12, -2, BLACK); // mouth

// ===== Arms (right arm raised in a wave, left arm resting) =====
cube(5, 5, 1, 7, 7, 3, YELLOW);       // left arm (viewer's left is +X... keep as body-relative)
cube(-8, 9, 1, -6, 12, 3, YELLOW);    // right arm raised
cube(-8, 12, 1, -6, 13, 2, BLACK);    // little paw tip

// ===== Legs / Feet =====
cube(-4, 0, -2, -1, 1, 2, YELLOW);
cube(1, 0, -2, 4, 1, 2, YELLOW);
cube(-4, 0, 1, -1, 0, 2, BROWN);
cube(1, 0, 1, 4, 0, 2, BROWN);

// ===== Tail (lightning-bolt shape) =====
cube(1, 3, 7, 4, 6, 10, BROWN);        // brown base patch
cube(3, 6, 9, 7, 9, 12, YELLOW);
cube(2, 9, 10, 5, 11, 10, YELLOW);     // zigzag notch
cube(4, 11, 11, 9, 15, 14, YELLOW);
cube(7, 15, 13, 8, 17, 14, YELLOW);    // tip point
block(8, 17, 14, ELECTRIC);            // spark at tail tip

// ===== Electric ambiance (sparse, per cheeks) =====
block(-6, 13, -1, ELECTRIC);
block(6, 13, -1, ELECTRIC);
block(0, 20, 2, ELECTRIC);

// ===== Foreground prop: Pokéball =====
const pbX = -9, pbY = 1, pbZ = -6;
hollowSphere(pbX, pbY, pbZ, 2, RED);
cube(pbX - 2, pbY, pbZ - 2, pbX + 2, pbY, pbZ + 2, RED);
cube(pbX - 2, pbY - 1, pbZ - 2, pbX + 2, pbY - 1, pbZ + 2, WHITE);
cube(pbX - 2, pbY - 2, pbZ - 2, pbX + 2, pbY - 2, pbZ + 2, WHITE);
disk(pbX, pbY, pbZ, 2, BLACK);
sphere(pbX, pbY, pbZ, 1, WHITE);
block(pbX, pbY, pbZ, IRON);