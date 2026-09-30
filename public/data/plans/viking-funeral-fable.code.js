// viking-funeral-fable — prompt:
// a burning Viking funeral ship...

const L = 18;
const zo = x => Math.round(-x * 0.18);           // bow (east) angles toward the camera
const hw = x => { const t = x / (L + 1); return Math.max(1, Math.round(4.6 * Math.sqrt(Math.max(0, 1 - t*t*t*t)))); };
const deckY = x => 2 + Math.round(3 * Math.pow(Math.abs(x) / L, 3));

// ---------- fjord basin: oval of water, sand shoreline, trees cleared ----------
for (let x = -22; x <= 22; x++) {
  const zr = Math.round(12 * Math.sqrt(Math.max(0, 1 - (x / 22.5) ** 2)));
  cube(x, -1, -zr, x, 9, zr, AIR);
  cube(x, -1, -zr, x, -1, zr, WATER);
  block(x, -1, -zr - 1, SAND); block(x, -1, zr + 1, SAND);
  block(x, 0, -zr - 1, AIR);   block(x, 0, zr + 1, AIR);
  if (Math.abs(x) > 19) { cube(x, -1, -zr, x, -1, zr, SAND); }
}

// ---------- hull ----------
const strake = y => (y === -1 || y === 1 || y >= 3) ? OAK_LOG : (y === 0 ? BROWN : PLANKS);
for (let x = -L; x <= L; x++) {
  const w = hw(x), z0 = zo(x), dy = deckY(x);
  if (Math.abs(x) < 15) block(x, -2, z0, OAK_LOG);              // keel
  cube(x, -1, z0 - w + 1, x, -1, z0 + w - 1, PLANKS);           // bottom
  for (let y = -1; y <= dy; y++) {
    const wy = y === -1 ? w - 1 : (y === 0 ? w : w);
    block(x, y, z0 - wy, strake(y));
    block(x, y, z0 + wy, strake(y));
  }
  cube(x, 1, z0 - w + 1, x, 1, z0 + w - 1, PLANKS);             // deck
  // rowing benches & oar ports
  if (x % 3 === 0 && Math.abs(x) < 15) {
    block(x, 2, z0 - w + 1, OAK_LOG); block(x, 2, z0 + w - 1, OAK_LOG);
  }
  // shields hanging on the gunwale
  if (x % 2 === 0 && Math.abs(x) <= 14) {
    const cols = [RED, WHITE, YELLOW, BLUE, RED, BLACK];
    const c = cols[((x + 14) / 2) % cols.length];
    block(x, dy, z0 - w - 1, c); block(x, dy, z0 + w + 1, c);
    block(x, dy, z0 - w, IRON);
  }
  // oars trailing into the water
  if (x % 4 === 2 && Math.abs(x) < 14) {
    line(x, 1, z0 - w - 1, x + 1, -1, z0 - w - 5, OAK_LOG);
    line(x, 1, z0 + w + 1, x + 1, -1, z0 + w + 5, OAK_LOG);
  }
}

// ---------- bow: dragon head (east, angled north) ----------
{
  const z0 = zo(L), y0 = deckY(L);
  line(L, y0, z0, L + 3, y0 + 4, z0 - 1, OAK_LOG);
  line(L + 1, y0, z0, L + 3, y0 + 3, z0 - 1, OAK_LOG);
  cube(L + 3, y0 + 4, z0 - 2, L + 5, y0 + 6, z0, OAK_LOG);        // head
  cube(L + 5, y0 + 4, z0 - 2, L + 7, y0 + 4, z0, OAK_LOG);        // lower jaw
  cube(L + 5, y0 + 6, z0 - 2, L + 7, y0 + 6, z0, OAK_LOG);        // upper jaw
  block(L + 7, y0 + 5, z0 - 1, FIRE);                              // fire 1
  block(L + 4, y0 + 6, z0 - 3, NEON_RED); block(L + 4, y0 + 6, z0 + 1, NEON_RED);
  block(L + 3, y0 + 7, z0 - 1, GOLD); block(L + 2, y0 + 7, z0 - 1, GOLD);   // crest
}
// ---------- stern: curled tail ----------
{
  const z0 = zo(-L), y0 = deckY(-L);
  line(-L, y0, z0, -L - 3, y0 + 4, z0 + 1, OAK_LOG);
  line(-L - 1, y0, z0, -L - 3, y0 + 3, z0 + 1, OAK_LOG);
  line(-L - 3, y0 + 4, z0 + 1, -L - 1, y0 + 6, z0 + 1, OAK_LOG);
  block(-L - 1, y0 + 6, z0 + 1, GOLD);
  block(-L - 2, y0 + 1, z0 - 2, OAK_LOG); line(-L - 2, y0 + 1, z0 - 2, -L - 3, -1, z0 - 4, OAK_LOG); // steering oar
}

// ---------- mast, yard, burning sail ----------
line(0, 1, 0, 0, 20, 0, OAK_LOG);
line(-8, 17, 1, 8, 17, 1, OAK_LOG);
for (let x = -7; x <= 7; x++) {
  const col = (Math.floor((x + 7) / 2) % 2 === 0) ? RED : WHITE;
  const sag = Math.abs(x) > 5 ? 1 : 0;
  cube(x, 6 + sag, 1, x, 16, 1, col);
}
// charred holes and burnt rim
cube(3, 12, 1, 6, 15, 1, AIR); cube(2, 11, 1, 3, 12, 1, BLACK); cube(6, 11, 1, 7, 12, 1, BLACK);
cube(2, 15, 1, 2, 16, 1, BLACK); cube(7, 15, 1, 7, 16, 1, BLACK);
cube(-6, 7, 1, -4, 9, 1, AIR); block(-3, 8, 1, BLACK); block(-7, 9, 1, BLACK); block(-5, 10, 1, BLACK);
cube(-2, 13, 1, -1, 14, 1, AIR); block(-3, 13, 1, BLACK); block(0, 14, 1, BLACK);
block(4, 16, 0, FIRE); block(6, 13, 0, FIRE); block(-5, 9, 0, FIRE); block(-1, 14, 0, FIRE); block(1, 17, 0, FIRE); // fire 6
block(0, 21, 0, FIRE);                                                                                          // fire 7
// rigging
line(0, 20, 0, L + 1, deckY(L) + 1, zo(L), OAK_LOG);
line(0, 20, 0, -L - 1, deckY(-L) + 1, zo(-L), OAK_LOG);

// ---------- funeral pyre with the fallen jarl ----------
cube(3, 2, -2, 9, 2, 2, OAK_LOG);
cube(4, 3, -1, 8, 3, 1, OAK_LOG);
block(5, 3, 0, LAVA); block(7, 3, 0, LAVA); block(6, 2, -1, LAVA);  // glowing core
cube(4, 4, -1, 8, 4, 1, PLANKS);                                   // bier
line(4, 5, 0, 7, 5, 0, IRON);                                      // mail-clad body
block(8, 5, 0, SAND); block(8, 6, 0, IRON);                         // head + helm
block(8, 5, -1, BROWN);                                            // beard
line(4, 6, 0, 7, 6, 0, GOLD);                                      // sword on chest
block(3, 5, 0, BROWN);                                             // boots
block(3, 5, -1, RED); block(3, 5, 1, RED);                         // shroud edges
const pyreFire = [[3,3,-2],[9,3,-2],[3,3,2],[9,3,2],[6,3,-2],[6,3,2],[4,5,-2],[8,5,2],[5,7,0],[7,7,0],[3,4,0],[9,4,0]];
for (const [x, y, z] of pyreFire) block(x, y, z, FIRE);            // fire 19
// spreading deck fire toward the stern
const deckFire = [[-3,2,-2],[-6,2,1],[-9,3,-1],[-12,3,1],[-15,4,0],[11,2,-2],[14,3,1]];
for (const [x, y, z] of deckFire) block(x, y, z, FIRE);            // fire 26
cube(-8, 1, -1, -6, 1, 1, BLACK); cube(-13, 1, 0, -11, 1, 2, BLACK);  // charred deck

// ---------- north shore: mourners with torches, pier, runestone ----------
function viking(x, z, tunic, torch) {
  block(x, 0, z, BROWN); block(x, 1, z, tunic); block(x, 2, z, SAND);
  block(x, 3, z, IRON); block(x, 2, z - 1, BROWN);
  block(x + 1, 1, z, tunic);
  if (torch) { line(x + 1, 2, z - 1, x + 1, 3, z - 1, OAK_LOG); block(x + 1, 4, z - 1, FIRE); }
}
viking(-9, -15, RED, true);     // fire 27
viking(-5, -16, BLUE, false);
viking(-2, -15, GRAY, true);    // fire 28
viking(2, -16, GREEN, false);
viking(6, -15, BLACK, true);    // fire 29
viking(10, -16, BROWN, false);
// woman with raised horn
block(13, 0, -15, BLUE); block(13, 1, -15, BLUE); block(13, 2, -15, SAND); block(13, 3, -15, YELLOW); block(14, 2, -15, GOLD);
// pier at west shore
cube(-17, 0, -13, -15, 0, -6, PLANKS);
for (const z of [-13, -9, -6]) { line(-17, -1, z, -17, 0, z, OAK_LOG); line(-15, -1, z, -15, 0, z, OAK_LOG); }
block(-18, 1, -13, OAK_LOG); block(-18, 2, -13, GLOWSTONE);   // lantern post
// runestone
cube(-13, 0, -16, -12, 4, -15, STONE); block(-12, 5, -16, STONE); block(-13, 5, -15, STONE);
block(-13, 2, -17, GRAY); block(-12, 3, -17, GRAY); block(-13, 1, -17, GRAY);
// a few beached rocks + the launch groove
block(16, 0, -11, COBBLE); block(18, 0, -10, STONE); block(-4, 0, -14, COBBLE); block(9, 0, -13, COBBLE);
// burning arrows arcing in from the shore
line(-2, 3, -14, -1, 8, -8, OAK_LOG); block(-1, 8, -8, FIRE);   // fire 30
line(6, 3, -14, 5, 9, -7, OAK_LOG); block(5, 9, -7, FIRE);      // fire 31