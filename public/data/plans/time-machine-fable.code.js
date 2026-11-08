// time-machine-fable — prompt:
// H.G. Wells' time machine...

// H.G. Wells' time machine — brass sled, red velvet chair, great spinning dish, in a Victorian laboratory.
// Front (console + chair facing) toward -Z / north; dish behind to the south.

// --- clear trees in footprint ---
cube(-13, 1, -13, 13, 10, 13, AIR);

// --- laboratory floor: checkered marble circle with stone sub-floor ---
for (let x = -13; x <= 13; x++) {
  for (let z = -13; z <= 13; z++) {
    const d = x * x + z * z;
    if (d <= 144) {
      block(x, -1, z, STONE);
      block(x, 0, z, ((x + z) & 1) ? MARBLE : BLACK);
    } else if (d <= 169) {
      block(x, -1, z, STONE);
      block(x, 0, z, GRAY);
    }
  }
}
// brass inlay ring around the machine
for (let a = 0; a < 360; a += 4) {
  const r = 7.5;
  block(Math.round(Math.cos(a * Math.PI / 180) * r), 0, Math.round(Math.sin(a * Math.PI / 180) * r), GOLD);
}

// --- back wall (south) with arched window and cornice ---
cube(-9, 1, 10, 9, 11, 11, BRICK);
cube(-10, 12, 10, 10, 12, 11, STONE);
cube(-10, 1, 10, -9, 12, 11, STONE);   // pilasters
cube(9, 1, 10, 10, 12, 11, STONE);
cube(-9, 1, 10, 9, 1, 11, STONE);      // skirting
// window: tall arched, glass
cube(-3, 3, 10, 3, 8, 11, GLASS);
cube(-2, 9, 10, 2, 9, 11, GLASS);
cube(-1, 10, 10, 1, 10, 11, GLASS);
line(0, 3, 10, 0, 9, 10, IRON);        // mullion
line(-3, 6, 10, 3, 6, 10, IRON);       // transom
// moon glow outside window
cube(-2, 4, 12, 2, 8, 12, GLOWSTONE);
// wall clock above window
cube(-2, 11, 9, 2, 11, 9, WHITE);
block(0, 11, 9, BLACK);
block(-1, 11, 9, IRON);
block(2, 11, 9, IRON);
// wall sconces
for (const x of [-6, 6]) {
  block(x, 6, 9, IRON);
  block(x, 7, 9, GLOWSTONE);
  block(x, 8, 9, FIRE);
}

// --- bookshelf (east side, against wall) ---
cube(5, 1, 9, 8, 7, 9, BROWN);
const bookCols = [RED, GREEN, BLUE, PURPLE, ORANGE, BROWN, CYAN, YELLOW];
for (let y = 2; y <= 6; y += 2) {
  for (let x = 5; x <= 8; x++) block(x, y, 8, bookCols[(x * 3 + y) % bookCols.length]);
}

// --- grandfather clock (west side) ---
cube(-9, 1, 8, -8, 8, 9, BROWN);
block(-9, 7, 7, WHITE); block(-8, 7, 7, WHITE);
block(-9, 6, 7, GOLD); block(-8, 6, 7, GOLD);
block(-9, 4, 7, GOLD); // pendulum
block(-9, 9, 8, GOLD); block(-8, 9, 8, GOLD);
block(-9, 10, 8, GOLD);

// --- gas lamp posts ---
for (const [x, z] of [[-10, -8], [10, -8], [-10, 5], [10, 5]]) {
  cube(x, 1, z, x, 2, z, STONE);
  line(x, 3, z, x, 6, z, IRON);
  block(x, 7, z, GLOWSTONE);
  block(x, 8, z, IRON);
}

// --- workbench with instruments (west) ---
cube(-9, 1, -3, -9, 1, 0, BROWN);
cube(-6, 1, -3, -6, 1, 0, BROWN);
cube(-9, 2, -3, -6, 2, 0, PLANKS);
block(-8, 3, -2, GLASS); block(-8, 4, -2, ICE);
block(-7, 3, -1, GLASS); block(-7, 4, -1, GLASS); block(-7, 5, -1, ICE);
block(-9, 3, 0, WHITE); block(-9, 4, 0, FIRE);
block(-6, 3, -3, COPPER); block(-6, 4, -3, COPPER); // small gear stack
block(-8, 3, 0, IRON);
// draughting table (east) with blueprints
cube(6, 1, -2, 6, 1, 1, BROWN);
cube(9, 1, -2, 9, 1, 1, BROWN);
cube(6, 2, -2, 9, 2, 1, PLANKS);
cube(7, 3, -1, 8, 3, 0, LIGHT_BLUE);
block(6, 3, 1, WHITE); block(6, 4, 1, FIRE);
block(9, 3, -2, COPPER);

// ===================== THE TIME MACHINE =====================
// runners (brass sled skids)
for (const x of [-4, 4]) {
  line(x, 1, -5, x, 1, 5, GOLD);
  block(x, 2, -6, GOLD); block(x, 3, -6, COPPER); block(x, 4, -5, COPPER);
  block(x, 2, 6, GOLD); block(x, 3, 6, COPPER);
}
line(-4, 1, -5, 4, 1, -5, GOLD);
line(-4, 1, 5, 4, 1, 5, GOLD);
// deck
cube(-3, 1, -4, 3, 1, 4, PLANKS);
for (let z = -4; z <= 4; z++) { block(-3, 1, z, COPPER); block(3, 1, z, COPPER); }
// railing posts and rails
for (const x of [-3, 3]) {
  for (const z of [-4, 0, 4]) { block(x, 2, z, GOLD); block(x, 3, z, GOLD); }
  for (let z = -4; z <= 4; z++) block(x, 3, z, GOLD);
}
// ornate scroll-work finials on front corners
block(-3, 4, -4, COPPER); block(3, 4, -4, COPPER);
block(-4, 4, -4, GOLD); block(4, 4, -4, GOLD);

// red velvet chair, facing north
cube(-1, 2, 1, 1, 2, 2, RED);
cube(-1, 3, 3, 1, 5, 3, RED);
cube(-1, 6, 3, 1, 6, 3, GOLD);
block(0, 7, 3, GOLD);
for (const x of [-2, 2]) {
  block(x, 2, 1, BROWN); block(x, 2, 2, BROWN);
  block(x, 3, 1, GOLD); block(x, 3, 2, GOLD);
  block(x, 3, 3, GOLD); block(x, 4, 3, GOLD);
}
block(-2, 2, 3, BROWN); block(2, 2, 3, BROWN);

// control console in front of the chair
cube(-2, 2, -3, 2, 3, -3, COPPER);
cube(-2, 4, -3, 2, 4, -3, GOLD);
cube(-2, 2, -2, 2, 2, -2, COPPER);
block(-1, 4, -2, GLASS);        // date dial
block(0, 4, -2, WHITE);
block(1, 4, -2, GLASS);
block(0, 5, -3, NEON_BLUE);     // glowing indicator
block(-2, 5, -3, IRON); block(2, 5, -3, IRON);
// the crystal lever
block(1, 5, -2, IRON);
block(1, 6, -2, IRON);
block(1, 7, -3, ICE);
// brass plaque on console front
block(0, 3, -4, GOLD);

// ---- the great dish behind the chair ----
function dishFace(cx, cy, cz, r) {
  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > r + 0.5) continue;
      let id = COPPER;
      if (d > r - 1) id = GOLD;
      else {
        const a = Math.atan2(dy, dx);
        if (Math.abs(Math.sin(a * 4)) < 0.22 && d > 1.8) id = BLACK;
        else if (Math.abs(Math.sin(a * 4)) < 0.22) id = BLACK;
      }
      if (d <= 1.6) id = ICE;
      if (dx === 0 && dy === 0) id = NEON_BLUE;
      block(cx + dx, cy + dy, cz, id);
    }
  }
}
function dishBack(cx, cy, cz, r) {
  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > r + 0.5) continue;
      block(cx + dx, cy + dy, cz, d > r - 1.5 ? GOLD : GRAY);
    }
  }
}
dishFace(0, 7, 5, 6);
dishBack(0, 7, 6, 7);
// mounting post and axle housing
line(0, 2, 5, 0, 5, 5, IRON);
cube(-1, 2, 5, 1, 2, 6, COPPER);
block(0, 7, 4, GOLD); // hub cap toward viewer
// small secondary gears on the dish hub spine
for (const y of [11, 12]) block(0, y, 6, GOLD);
block(0, 13, 6, COPPER);
block(0, 14, 6, GOLD);
// temporal energy crackling at the rim
for (let i = 0; i < 6; i++) {
  const a = (i / 6) * Math.PI * 2 + 0.3;
  block(Math.round(Math.cos(a) * 6.5), 7 + Math.round(Math.sin(a) * 6.5), 4, ELECTRIC);
}

// --- a few brass steam pipes rising from the rear with a wisp of vapor ---
for (const x of [-3, 3]) {
  line(x, 2, 6, x, 5, 6, COPPER);
  block(x, 6, 6, GOLD);
  block(x, 7, 6, STEAM);
}

// --- scattered tools and a toppled stool for life ---
block(-5, 1, -7, BROWN); block(-5, 2, -7, BROWN); block(-4, 1, -8, BROWN);
block(5, 1, -7, IRON); block(6, 1, -8, COPPER);
block(-7, 1, 4, PLANKS); block(-6, 1, 4, PLANKS);