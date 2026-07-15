// neuschwanstein-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// ===== Neuschwanstein Castle =====
// Front (best-lit) side faces NORTH (-Z). Depth runs toward +Z.

const WALL  = 12; // SNOW  - cream/white limestone walls
const TRIM  = 3;  // STONE - grey stone trim, roofs, arches
const DARK  = 8;  // COBBLE- darker grey accents, path, base
const WOOD  = 4;  // OAK_LOG - timber accents, posts
const GLASS_ = 11; // GLASS - window panes
const FLAG  = 10; // BRICK - red flag / accent
const HEDGE = 5;  // LEAVES - garden hedges

// ---- helpers ----
function ringY(x1, z1, x2, z2, y, id) {
  line(x1, y, z1, x2, y, z1, id);
  line(x1, y, z2, x2, y, z2, id);
  line(x1, y, z1, x1, y, z2, id);
  line(x2, y, z1, x2, y, z2, id);
}

function cone(cx, cz, y0, h, r0, id) {
  for (let i = 0; i < h; i++) {
    const r = Math.round(r0 * (1 - i / h));
    if (r <= 0) block(cx, y0 + i, cz, id);
    else disk(cx, y0 + i, cz, r, id);
  }
  block(cx, y0 + h, cz, id);
}

function gableRoof(x1, x2, z1, z2, y0, h, id) {
  for (let i = 0; i < h; i++) {
    const nx1 = x1 + i, nx2 = x2 - i;
    if (nx1 > nx2) break;
    cube(nx1, y0 + i, z1, nx2, y0 + i, z2, id);
  }
}

function crenellate(x1, z1, x2, z2, y, id) {
  for (let x = x1; x <= x2; x += 2) { block(x, y, z1, id); block(x, y, z2, id); }
  for (let z = z1; z <= z2; z += 2) { block(x1, y, z, id); block(x2, y, z, id); }
}

// ===== 0. Clear trees within footprint =====
cube(-15, -1, -16, 15, 14, 11, 0);

// ===== 1. Curtain walls (courtyard perimeter) =====
cube(-13, 0, -12, 13, 6, -12, WALL);   // north (front) wall
cube(-13, 0, 10, 13, 6, 10, WALL);     // south wall
cube(-13, 0, -12, -13, 6, 10, WALL);   // west wall
cube(13, 0, -12, 13, 6, 10, WALL);     // east wall

// base course (darker stone plinth)
ringY(-13, -12, 13, 10, 0, DARK);

// crenellations on top of walls
crenellate(-13, -12, 13, 10, 7, TRIM);

// gate arch cut through front wall
cube(-1, 0, -12, 1, 3, -12, 0);
block(-1, 4, -12, TRIM); block(0, 4, -12, TRIM); block(1, 4, -12, TRIM);

// windows on curtain walls
for (let x = -11; x <= 11; x += 4) {
  if (x >= -2 && x <= 2) continue; // skip near gate
  block(x, 2, -12, GLASS_); block(x, 3, -12, GLASS_); block(x, 4, -12, TRIM);
  block(x, 2, 10, GLASS_); block(x, 3, 10, GLASS_); block(x, 4, 10, TRIM);
}
for (let z = -10; z <= 8; z += 4) {
  block(-13, 2, z, GLASS_); block(-13, 3, z, GLASS_); block(-13, 4, z, TRIM);
  block(13, 2, z, GLASS_); block(13, 3, z, GLASS_); block(13, 4, z, TRIM);
}

// ===== 2. Corner turrets (round, conical roof) =====
const corners = [[-13, -12], [13, -12], [-13, 10], [13, 10]];
for (const [cx, cz] of corners) {
  hollowCylinder(cx, 0, cz, 2, 11, WALL);
  disk(cx, 0, cz, 2, DARK);
  disk(cx, 10, cz, 2, TRIM);
  for (let y = 2; y <= 8; y += 3) {
    block(cx + 2, y, cz, GLASS_);
    block(cx - 2, y, cz, GLASS_);
  }
  cone(cx, cz, 11, 6, 3, TRIM);
}

// ===== 3. Gatehouse towers flanking entrance =====
function gateTower(cx) {
  hollowCube(cx - 1, 0, -15, cx + 1, 12, -12, WALL);
  disk(cx, 0, -13, 1, DARK);
  crenellate(cx - 1, -15, cx + 1, -12, 13, TRIM);
  for (let y = 2; y <= 9; y += 3) block(cx, y, -15, GLASS_);
  cone(cx, -13, 13, 6, 2, TRIM);
}
gateTower(-3);
gateTower(3);

// ===== 4. Central keep (main hall) =====
const KX1 = -3, KX2 = 3, KZ1 = 1, KZ2 = 7;
hollowCube(KX1, 0, KZ1, KX2, 18, KZ2, WALL);
ringY(KX1, KZ1, KX2, KZ2, 0, DARK);
ringY(KX1, KZ1, KX2, KZ2, 6, TRIM);
ringY(KX1, KZ1, KX2, KZ2, 12, TRIM);
for (let x = KX1 + 1; x <= KX2 - 1; x++) {
  for (let y = 3; y <= 15; y += 5) {
    block(x, y, KZ1, GLASS_);
    block(x, y + 1, KZ1, GLASS_);
    block(x, y + 2, KZ1, TRIM);
  }
}
cone(0, 4, 18, 11, 4, TRIM);
for (const dx of [KX1, KX2]) {
  for (const dz of [KZ1, KZ2]) {
    hollowCylinder(dx, 14, dz, 1, 5, WALL);
    cone(dx, dz, 19, 4, 1, TRIM);
  }
}

// ===== 5. Secondary tall signature tower (asymmetric, tallest element) =====
const TX1 = -10, TX2 = -6, TZ1 = 1, TZ2 = 5;
hollowCube(TX1, 0, TZ1, TX2, 23, TZ2, WALL);
ringY(TX1, TZ1, TX2, TZ2, 0, DARK);
ringY(TX1, TZ1, TX2, TZ2, 8, TRIM);
ringY(TX1, TZ1, TX2, TZ2, 16, TRIM);
for (let y = 3; y <= 19; y += 4) {
  block(TX1 + 2, y, TZ1, GLASS_);
  block(TX1 + 2, y + 1, TZ1, GLASS_);
  block(TX1 + 2, y + 2, TZ1, TRIM);
}
cone(-8, 3, 23, 9, 3, TRIM);
line(-8, 32, 3, -8, 34, 3, WOOD);
block(-8, 35, 3, FLAG);
block(-7, 35, 3, FLAG);

// ===== 6. East wing (chapel-like, lower, gabled) =====
const WX1 = 6, WX2 = 10, WZ1 = 1, WZ2 = 5;
hollowCube(WX1, 0, WZ1, WX2, 10, WZ2, WALL);
ringY(WX1, WZ1, WX2, WZ2, 0, DARK);
for (let z = WZ1 + 1; z <= WZ2 - 1; z++) {
  block(WX1, 3, z, GLASS_); block(WX1, 4, z, GLASS_); block(WX1, 5, z, TRIM);
}
gableRoof(WX1 - 1, WX2 + 1, WZ1 - 1, WZ2 + 1, 11, 5, TRIM);

// ===== 7. Buttress connecting keep to east wing =====
cube(3, 0, 3, 6, 4, 4, WALL);
ringY(3, 3, 6, 4, 0, DARK);

// ===== 8. Courtyard details =====
cylinder(0, 0, -4, 2, 1, DARK);
block(0, 1, -4, GLASS_);
block(0, 2, -4, WOOD);

cube(-1, 0, -16, 1, 0, -13, DARK);
line(-3, 1, -14, -3, 3, -14, WOOD);
block(-3, 4, -14, FLAG);
line(3, 1, -14, 3, 3, -14, WOOD);
block(3, 4, -14, FLAG);

cube(-2, 1, -16, -2, 1, -13, HEDGE);
cube(2, 1, -16, 2, 1, -13, HEDGE);
