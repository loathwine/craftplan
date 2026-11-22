// icebreaker-haiku55 — prompt:
// a red icebreaker ship smashing through sea ice...

// ---- Sea basin: clear terrain above waterline, lay water surface ----
cube(-11, 1, -17, 11, 16, 11, AIR);
cube(-11, 0, -17, 11, 0, 11, WATER);

// Deterministic hash for variation
const rnd = (x, z) => { const n = Math.sin(x * 127.1 + z * 311.7 + 17.3) * 43758.5453; return n - Math.floor(n); };

// ---- Sea ice floes (kept clear of the hull berth x -4..4, z -6..10) ----
for (let gx = -11; gx < 11; gx += 3) {
  for (let gz = -17; gz < 11; gz += 3) {
    const r = rnd(gx, gz);
    if (r < 0.28) continue;
    const x2 = Math.min(gx + 2, 11), z2 = Math.min(gz + 2, 11);
    if (x2 >= -4 && gx <= 4 && z2 >= -6 && gz <= 10) continue;
    cube(gx, 1, gz, x2, 1, z2, ICE);
    if (r > 0.62) cube(gx, 2, gz, gx + 1, 2, gz + 1, SNOW);
    if (r > 0.85) block(x2, 2, z2, ICE);
  }
}

// Foreground floe with a polar bear
cube(-9, 1, -15, -5, 1, -11, ICE);
cube(-8, 2, -14, -6, 3, -12, WHITE);      // body
cube(-10, 3, -14, -9, 4, -13, WHITE);     // head
block(-10, 4, -14, BLACK);                // eye
block(-11, 3, -13, BLACK);                // nose
block(-6, 2, -14, LIGHT_GRAY);            // shoulder shading

// Seal lying on a small floe to the east
cube(6, 1, -14, 10, 1, -10, ICE);
cube(7, 2, -12, 9, 2, -11, GRAY);
block(9, 2, -12, BLACK);

// Fracture cracks radiating from the bow
line(0, 1, -10, -5, 1, -17, AIR);
line(1, 1, -10, 6, 1, -16, AIR);

// ---- Hull (length along Z, bow pointing north toward camera) ----
const hwOf = z => {
  if (z === -6) return 1;
  if (z === -5) return 2;
  if (z === -4) return 3;
  if (z >= 9) return 3;
  return 4;
};
const topOf = z => (z === -6 ? 1 : 2);

for (let z = -6; z <= 10; z++) {
  const hw = hwOf(z), top = topOf(z);
  for (let x = -hw; x <= hw; x++) {
    for (let y = 0; y <= top; y++) {
      let id;
      if (y <= 1) id = RED;
      else id = Math.abs(x) === hw ? BLACK : LIGHT_GRAY;
      if (y === 1 && Math.abs(x) === hw && z > -6) id = WHITE; // white waterline stripe
      block(x, y, z, id);
    }
  }
}

// Steel-clad icebreaking prow
line(0, 0, -6, 0, 1, -6, IRON);
cube(-1, 0, -5, 1, 1, -5, IRON);
cube(-2, 0, -4, -2, 0, -4, IRON);
cube(2, 0, -4, 2, 0, -4, IRON);

// Ice rubble heaped against the bow
cube(-3, 2, -7, -2, 2, -6, ICE);
cube(2, 2, -7, 3, 2, -6, ICE);

// Broken ice grinding against the hull sides
for (let z = -3; z <= 9; z++) {
  if (rnd(z, 7) > 0.45) block(-5, 1, z, ICE);
  if (rnd(z, 13) > 0.45) block(5, 1, z, ICE);
  if (rnd(z, 21) > 0.8) block(-6, 1, z, SNOW);
  if (rnd(z, 33) > 0.8) block(6, 1, z, SNOW);
}

// Deck rails
for (let z = -3; z <= 9; z += 2) {
  block(-4, 3, z, IRON);
  block(4, 3, z, IRON);
}
line(-4, 4, -3, -4, 4, 9, IRON);
line(4, 4, -3, 4, 4, 9, IRON);

// Lifeboats on davits
cube(-6, 3, 1, -5, 4, 3, ORANGE);
cube(6, 3, 1, 5, 4, 3, ORANGE);
block(-4, 4, 2, IRON);
block(4, 4, 2, IRON);
block(-6, 3, 2, WHITE);
block(6, 3, 2, WHITE);

// ---- Bridge (forward superstructure) ----
cube(-2, 3, -3, 2, 8, -1, WHITE);
cube(-2, 7, -3, 2, 8, -3, GLASS);    // front bridge windows
cube(-2, 9, -3, 2, 9, -1, BLACK);    // roof
block(-2, 3, -3, RED);               // corner accents
block(2, 3, -3, RED);

// Mast, yard and flag
line(0, 10, -2, 0, 15, -2, IRON);
line(-2, 13, -2, 2, 13, -2, IRON);
cube(1, 15, -2, 2, 15, -2, RED);
block(0, 16, -2, NEON_RED);          // masthead light

// ---- Main cabin ----
cube(-3, 3, 0, 3, 6, 6, WHITE);
cube(-2, 4, 0, 2, 5, 0, GLASS);      // front windows
line(-3, 4, 1, -3, 4, 5, GLASS);     // side windows
line(3, 4, 1, 3, 4, 5, GLASS);
cube(-3, 6, 0, 3, 6, 6, LIGHT_GRAY); // roof edge
line(-3, 3, 0, 3, 3, 0, RED);        // red base stripe

// ---- Funnel ----
cylinder(0, 7, 5, 2, 5, RED);
disk(0, 10, 5, 2, WHITE);            // band
disk(0, 12, 5, 2, BLACK);            // soot cap

// ---- Stern crane ----
line(3, 3, 8, 3, 7, 8, IRON);
line(3, 7, 8, -2, 7, 8, IRON);
block(-2, 6, 8, IRON);

// ---- Bow spray and flying ice chunks ----
block(-2, 3, -7, SNOW);
block(2, 3, -7, SNOW);
block(-3, 3, -8, SNOW);
block(3, 3, -8, SNOW);
block(-3, 4, -9, ICE);
cube(2, 5, -10, 3, 5, -10, ICE);
block(-1, 6, -12, ICE);
block(4, 6, -11, SNOW);
block(-4, 5, -10, ICE);