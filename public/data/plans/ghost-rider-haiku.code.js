// ghost-rider-haiku — prompt:
// Ghost Rider on his flaming motorcycle...

// Ghost Rider on Flaming Motorcycle

const mX = 0, mZ = 6;
const groundY = -5;

// MOTORCYCLE WHEELS
const fwheel_cx = mX - 5, fwheel_cz = mZ + 10;
const rwheel_cx = mX + 5, rwheel_cz = mZ - 8;

for (let dx = -4; dx <= 4; dx++) {
  for (let dz = -4; dz <= 4; dz++) {
    const dist = Math.sqrt(dx*dx + dz*dz);
    if (dist >= 2.8 && dist <= 4.2) {
      block(fwheel_cx + dx, groundY, fwheel_cz + dz, BLACK);
      block(fwheel_cx + dx, groundY - 1, fwheel_cz + dz, GRAY);
      block(rwheel_cx + dx, groundY, rwheel_cz + dz, BLACK);
      block(rwheel_cx + dx, groundY - 1, rwheel_cz + dz, GRAY);
    }
    if (dist <= 1.5) {
      block(fwheel_cx + dx, groundY, fwheel_cz + dz, IRON);
      block(rwheel_cx + dx, groundY, rwheel_cz + dz, IRON);
    }
  }
}

// FRAME - Front suspension forks
cube(fwheel_cx - 1, groundY + 2, fwheel_cz - 1, fwheel_cx + 1, groundY + 6, fwheel_cz + 1, IRON);
cube(fwheel_cx - 2, groundY + 6, fwheel_cz - 1, fwheel_cx + 2, groundY + 7, fwheel_cz + 2, IRON);

// Handlebar grips
cube(fwheel_cx - 4, groundY + 7, fwheel_cz - 1, fwheel_cx - 3, groundY + 11, fwheel_cz, GRAY);
cube(fwheel_cx + 3, groundY + 7, fwheel_cz - 1, fwheel_cx + 4, groundY + 11, fwheel_cz, GRAY);
cube(fwheel_cx - 4, groundY + 10, fwheel_cz - 2, fwheel_cx + 4, groundY + 11, fwheel_cz - 1, IRON);

// Main frame backbone
cube(fwheel_cx, groundY + 6, fwheel_cz - 2, mX, groundY + 8, mZ + 8, IRON);
cube(mX - 1, groundY + 7, mZ - 1, mX + 1, groundY + 10, mZ + 5, IRON);
cube(mX - 3, groundY + 7, mZ + 3, mX + 3, groundY + 8, mZ + 7, IRON);
cube(mX + 1, groundY + 7, mZ + 6, rwheel_cx, groundY + 8, rwheel_cz - 1, IRON);

// Rear suspension
cube(rwheel_cx - 1, groundY + 2, rwheel_cz - 1, rwheel_cx + 1, groundY + 7, rwheel_cz + 1, IRON);

// Engine block
cube(mX - 3, groundY + 8, mZ - 1, mX + 3, groundY + 11, mZ + 3, IRON);
cube(mX - 2, groundY + 9, mZ, mX + 2, groundY + 10, mZ + 2, GOLD);
block(mX, groundY + 11, mZ + 1, LAVA);
block(mX - 1, groundY + 11, mZ + 1, LAVA);
block(mX + 1, groundY + 11, mZ + 1, LAVA);

// Exhaust pipes - dual
line(mX + 3, groundY + 9, mZ - 1, mX + 8, groundY + 4, mZ - 4, IRON);
line(mX + 3, groundY + 8, mZ + 1, mX + 9, groundY + 3, mZ + 3, IRON);
cube(mX + 8, groundY + 3, mZ - 4, mX + 9, groundY + 5, mZ - 2, ORANGE);
cube(mX + 9, groundY + 2, mZ + 3, mX + 10, groundY + 4, mZ + 5, ORANGE);

// Seat
cube(mX - 2, groundY + 10, mZ + 2, mX + 2, groundY + 11, mZ + 5, BLACK);
cube(mX - 2, groundY + 11, mZ + 3, mX + 2, groundY + 12, mZ + 4, BROWN);

// Seat back
cube(mX - 3, groundY + 11, mZ + 5, mX + 3, groundY + 13, mZ + 6, BLACK);

// GHOST RIDER
const rX = 0, rZ = 4, riderBaseY = groundY + 12;

// Pelvis
cube(rX - 2, riderBaseY, rZ - 1, rX + 2, riderBaseY + 3, rZ + 2, GRAY);
cube(rX - 2, riderBaseY + 1, rZ - 1, rX + 2, riderBaseY + 2, rZ + 2, WHITE);

// Spine & rib cage
cube(rX - 1, riderBaseY + 3, rZ, rX + 1, riderBaseY + 9, rZ + 1, WHITE);
for (let y = riderBaseY + 3; y < riderBaseY + 8; y += 2) {
  cube(rX - 2, y, rZ - 1, rX + 2, y + 1, rZ + 2, GRAY);
}

// Left shoulder/arm
cube(rX - 4, riderBaseY + 8, rZ - 1, rX - 2, riderBaseY + 11, rZ + 2, BLACK);
line(rX - 4, riderBaseY + 9, rZ, rX - 6, riderBaseY + 11, rZ - 1, GRAY);
line(rX - 6, riderBaseY + 11, rZ - 1, rX - 7, riderBaseY + 13, rZ - 2, GRAY);

// Right shoulder/arm
cube(rX + 2, riderBaseY + 8, rZ - 1, rX + 4, riderBaseY + 11, rZ + 2, BLACK);
line(rX + 4, riderBaseY + 9, rZ, rX + 6, riderBaseY + 11, rZ - 1, GRAY);
line(rX + 6, riderBaseY + 11, rZ - 1, rX + 7, riderBaseY + 13, rZ - 2, GRAY);

// Arms gripping handlebars
line(rX - 7, riderBaseY + 13, rZ - 2, fwheel_cx - 4, groundY + 10, fwheel_cz, GRAY);
line(rX + 7, riderBaseY + 13, rZ - 2, fwheel_cx + 4, groundY + 10, fwheel_cz, GRAY);

// Neck
cube(rX - 1, riderBaseY + 9, rZ, rX + 1, riderBaseY + 11, rZ + 1, GRAY);

// FLAMING SKULL HEAD
const skullY = riderBaseY + 11;

// Main skull structure
cube(rX - 2, skullY, rZ - 1, rX + 2, skullY + 4, rZ + 2, WHITE);
cube(rX - 2, skullY + 4, rZ - 1, rX + 2, skullY + 5, rZ + 2, GRAY);

// Eye sockets - glowing red
cube(rX - 2, skullY + 1, rZ - 1, rX - 1, skullY + 3, rZ, NEON_RED);
cube(rX + 1, skullY + 1, rZ - 1, rX + 2, skullY + 3, rZ, NEON_RED);
block(rX - 1, skullY + 1, rZ - 1, NEON_RED);
block(rX, skullY + 1, rZ - 1, NEON_RED);
block(rX + 1, skullY + 2, rZ - 1, NEON_RED);

// Nasal cavity
for (let x = rX - 1; x <= rX + 1; x++) {
  block(x, skullY + 1, rZ - 1, AIR);
}

// Jaw
cube(rX - 2, skullY - 1, rZ - 1, rX + 2, skullY, rZ + 2, GRAY);

// Leather jacket - studded
cube(rX - 3, riderBaseY + 5, rZ - 2, rX + 3, riderBaseY + 9, rZ + 3, BLACK);
for (let x = rX - 3; x <= rX + 3; x += 2) {
  block(x, riderBaseY + 6, rZ - 2, GRAY);
  block(x, riderBaseY + 8, rZ - 2, GRAY);
  block(x, riderBaseY + 6, rZ + 3, GRAY);
  block(x, riderBaseY + 8, rZ + 3, GRAY);
}

// Chain harness
line(rX - 2, riderBaseY + 6, rZ - 2, rX + 2, riderBaseY + 6, rZ - 2, IRON);
line(rX - 2, riderBaseY + 7, rZ - 2, rX + 2, riderBaseY + 7, rZ - 2, IRON);
line(rX - 3, riderBaseY + 5, rZ + 1, rX + 3, riderBaseY + 5, rZ + 1, IRON);

// FLAMING AURA - distributed fire effects
// Around front wheel
block(fwheel_cx - 6, groundY + 2, fwheel_cz + 9, FIRE);
block(fwheel_cx - 5, groundY + 3, fwheel_cz + 11, FIRE);
block(fwheel_cx - 4, groundY + 2, fwheel_cz + 12, FIRE);

// Around rear wheel
block(rwheel_cx + 6, groundY + 2, rwheel_cz - 9, FIRE);
block(rwheel_cx + 5, groundY + 3, rwheel_cz - 11, FIRE);
block(rwheel_cx + 4, groundY + 2, rwheel_cz - 12, FIRE);

// Around engine
block(mX - 4, groundY + 11, mZ, FIRE);
block(mX + 4, groundY + 11, mZ + 2, FIRE);
block(mX, groundY + 12, mZ + 4, FIRE);

// Around rider legs/seat
block(rX - 3, riderBaseY - 1, rZ - 1, FIRE);
block(rX + 3, riderBaseY - 1, rZ + 2, FIRE);
block(rX, riderBaseY, rZ - 2, FIRE);

// Around torso
block(rX - 4, riderBaseY + 6, rZ - 2, FIRE);
block(rX + 4, riderBaseY + 6, rZ + 2, FIRE);
block(rX - 3, riderBaseY + 8, rZ - 3, FIRE);
block(rX + 3, riderBaseY + 8, rZ - 3, FIRE);

// Skull inferno
block(rX - 3, skullY + 1, rZ - 2, FIRE);
block(rX + 3, skullY + 1, rZ - 2, FIRE);
block(rX, skullY + 5, rZ - 1, FIRE);
block(rX - 2, skullY + 5, rZ + 1, FIRE);
block(rX + 2, skullY + 5, rZ + 1, FIRE);
block(rX - 1, skullY + 6, rZ, FIRE);
block(rX + 1, skullY + 6, rZ, FIRE);

// Orange glow rings
cube(mX - 5, groundY + 1, mZ - 3, mX - 4, groundY + 3, mZ + 8, ORANGE);
cube(mX + 4, groundY + 1, mZ - 7, mX + 5, groundY + 3, mZ + 4, ORANGE);
cube(rX - 4, riderBaseY + 4, rZ - 3, rX + 4, riderBaseY + 5, rZ + 3, ORANGE);

// Glowing accent lights
block(mX, groundY + 13, mZ + 6, GLOWSTONE);
block(rX - 1, riderBaseY + 16, rZ, GLOWSTONE);
block(rX + 1, riderBaseY + 16, rZ, GLOWSTONE);