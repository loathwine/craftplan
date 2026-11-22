// frozen-ship-haiku55 — prompt:
// a ship trapped in Arctic pack ice...

// Ship trapped in Arctic pack ice. Broadside faces north (-Z), bow points east (+X).
const h2 = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };

// 1. Clear the working area (trees, grass above ground)
cube(-17, 1, -11, 17, 26, 11, AIR);
cube(-20, 1, 11, 20, 26, 13, AIR);

// 2. Pack ice: blue ICE underlayer, SNOW surface
cube(-16, -1, -10, 16, -1, 10, ICE);
cube(-16, 0, -10, 16, 0, 10, SNOW);

// Open lead in the foreground-west, and loose floes on the surface
cube(-16, 0, -10, -12, 0, -9, WATER);
[[-14,-6],[-3,-9],[3,8],[-8,8],[15,6],[-15,2],[-1,-9]].forEach(([x, z]) => cube(x, 1, z, x + 1, 1, z + 1, ICE));

// Wind-blown snow drifts in the foreground and background
for (let x = -16; x <= 16; x++) for (let z = -10; z <= 10; z++) {
  if (Math.abs(z) >= 7 && h2(x, z) > 0.92) block(x, 1, z, SNOW);
}

// 3. Pressure ridges piled against both broadsides
function ridge(zs, dir, xa, xb) {
  for (let x = xa; x <= xb; x++) for (let k = 0; k < 3; k++) {
    const z = zs + dir * k;
    const base = [1.2, 3.0, 2.2][k];
    const top = Math.max(0, Math.round(base + (h2(x, z) - 0.5) * 2.2));
    for (let y = 1; y <= top; y++) block(x, y, z, y === top ? SNOW : ICE);
  }
}
ridge(-4, -1, -13, 12); // north (camera side)
ridge(4, 1, -13, 12);   // south (behind)

// Ice crushing the bow
for (let x = 13; x <= 15; x++) for (let z = -3; z <= 3; z++) {
  const top = Math.round(3.2 - (x - 13) * 1.1 + (h2(x, z) - 0.5) * 2);
  for (let y = 1; y <= top; y++) block(x, y, z, y === top ? SNOW : ICE);
}
// Ice pressing on the stern
for (let x = -14; x <= -13; x++) for (let z = -3; z <= 3; z++) {
  const top = Math.round(2.6 + (h2(x, z) - 0.5) * 2);
  for (let y = 1; y <= top; y++) block(x, y, z, y === top ? SNOW : ICE);
}

// Background ice hills, south of the floe
for (let x = -18; x <= 18; x++) for (let z = 11; z <= 12; z++) {
  const top = Math.round(5 + 2.2 * Math.sin(x * 0.37) + 1.2 * Math.cos(z * 1.7) + (h2(x, z) - 0.5) * 2);
  for (let y = 0; y <= top; y++) block(x, y, z, y === top ? SNOW : ICE);
}

// 4. Hull (black, sits on the ice at y=0)
cube(-10, 0, -3, 9, 4, 3, BLACK);
cube(-11, 0, -2, -11, 4, 2, BLACK);
for (let x = 10; x <= 12; x++) {
  const hw = 2 - (x - 10);
  if (hw >= 0) cube(x, 0, -hw, x, 4, hw, BLACK);
}
// Deck
cube(-10, 5, -3, 9, 5, 3, PLANKS);
cube(-11, 5, -2, -11, 5, 2, PLANKS);
for (let x = 10; x <= 12; x++) {
  const hw = 2 - (x - 10);
  if (hw >= 0) cube(x, 5, -hw, x, 5, hw, PLANKS);
}
// Red waterline stripe, iron rails, lit portholes
line(-10, 2, -3, 9, 2, -3, RED);
line(-10, 6, -3, 9, 6, -3, IRON);
line(-10, 6, 3, 9, 6, 3, IRON);
[-8, -5, -2, 1, 4, 7].forEach(x => block(x, 3, -3, GLOWSTONE));
// Snow dusting on deck
for (let x = -10; x <= 9; x++) for (let z = -2; z <= 2; z++) {
  if (h2(x + 7, z + 3) > 0.86) block(x, 6, z, SNOW);
}

// 5. Mast and rigging (placed before funnel so the funnel overrides the stay)
line(-8, 6, 0, -8, 22, 0, IRON);
line(-8, 21, 0, 10, 6, 0, IRON);
line(-8, 21, 0, -11, 5, 0, IRON);
cube(-9, 18, -1, -7, 18, 1, PLANKS);
hollowCube(-9, 19, -1, -7, 20, 1, IRON);
block(-7, 22, 0, RED);
block(-6, 22, 0, RED);

// 6. Cabin with lit windows, and wheelhouse
cube(-6, 6, -2, 3, 9, 2, PLANKS);
cube(-5, 7, -1, 2, 8, 1, AIR);
cube(-6, 9, -2, 3, 9, 2, BLACK);
cube(-4, 7, -2, -3, 8, -2, GLASS);
cube(-1, 7, -2, 0, 8, -2, GLASS);
cube(2, 7, -2, 2, 8, -2, GLASS);
block(-4, 7, 0, GLOWSTONE);
block(1, 7, 0, GLOWSTONE);
cube(-3, 10, -1, -1, 11, 1, PLANKS);
cube(-3, 12, -1, -1, 12, 1, BLACK);
cube(-2, 10, -1, -2, 11, -1, GLASS);

// 7. Steam funnel (drawn after the stays so it overrides them)
cube(5, 6, -1, 7, 13, 1, BLACK);
cube(5, 10, -1, 7, 10, 1, RED);
cube(5, 14, -1, 7, 14, 1, IRON);
block(6, 15, 0, STEAM);
block(6, 15, -1, STEAM);

// Deck cargo
cube(-9, 6, 1, -8, 6, 2, OAK_LOG);
block(-9, 7, 1, OAK_LOG);
block(9, 6, -2, BROWN);
block(9, 6, -1, BROWN);
block(9, 7, -2, BROWN);

// 8. Expedition camp on the ice: tent and fire
for (let x = -10; x <= -8; x++) {
  block(x, 1, -9, ORANGE);
  block(x, 1, -8, ORANGE);
  block(x, 2, -8, ORANGE);
  block(x, 1, -7, ORANGE);
}
block(-7, 1, -8, FIRE);

// 9. Foreground polar bear, profile facing east (head at +X)
[[6, -9], [6, -7], [10, -9], [10, -7]].forEach(([x, z]) => block(x, 1, z, WHITE));
cube(6, 2, -9, 10, 3, -7, WHITE);
cube(11, 2, -9, 12, 4, -7, WHITE);
block(5, 3, -8, WHITE);           // tail
block(11, 5, -9, WHITE);          // ears
block(11, 5, -7, WHITE);
block(12, 4, -9, BLACK);          // eye
block(13, 3, -8, BLACK);          // nose