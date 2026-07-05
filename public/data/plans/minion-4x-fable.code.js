// minion-4x-fable — prompt:
// a Minion...

const zf = (r, dx) => Math.floor(Math.sqrt(Math.max(0, r * r - dx * dx)));

// clear tree canopies overlapping the two figures and the banana pile
cube(-14, 0, -9, 6, 10, 9, AIR);
cube(2, 0, -2, 17, 9, 12, AIR);
cube(-3, 0, 9, 5, 4, 15, AIR);

function ring(cx, y, cz, r, id) {
  for (let i = 0; i < 64; i++) {
    const a = i * Math.PI / 32;
    block(cx + Math.round(r * Math.cos(a)), y, cz + Math.round(r * Math.sin(a)), id);
  }
}

// goggle plate that follows the body curvature (rowR gives body radius per row)
function goggle(cx, cz, ex, ey, rowR) {
  for (let gy = -2; gy <= 2; gy++) {
    for (let gx = -2; gx <= 2; gx++) {
      const x = ex + gx, y = ey + gy;
      const dx = Math.abs(x - cx);
      const z = cz + zf(rowR(y), dx) + 1;
      block(x, y, z, (Math.abs(gx) === 2 || Math.abs(gy) === 2) ? COBBLE : SNOW);
    }
  }
  block(ex, ey, cz + zf(rowR(ey), Math.abs(ex - cx)) + 1, OAK_LOG); // pupil
}

// ============ KEVIN — tall two-eyed minion, one arm waving ============
const KX = -5, KZ = 0;
const kRow = y => (y <= 17 ? 6 : [6, 6, 5, 4, 3, 1][y - 18]);

// legs + boots
cube(KX - 3, -1, KZ - 1, KX - 2, 2, KZ, GLASS);
cube(KX + 2, -1, KZ - 1, KX + 3, 2, KZ, GLASS);
cube(KX - 3, -1, KZ + 1, KX - 2, 0, KZ + 3, STONE);
cube(KX + 2, -1, KZ + 1, KX + 3, 0, KZ + 3, STONE);

// body: blue overalls bottom, yellow torso, rounded dome head
cylinder(KX, 3, KZ, 6, 5, GLASS);
cylinder(KX, 8, KZ, 6, 10, SAND);
const kDome = [6, 6, 5, 4, 3, 1];
for (let i = 0; i < kDome.length; i++) disk(KX, 18 + i, KZ, kDome[i], SAND);

// goggle strap around the head
ring(KX, 16, KZ, 6, STONE);

// overalls bib + shoulder straps (front and back), buttons, logo
for (let dx = -2; dx <= 2; dx++)
  for (let y = 8; y <= 10; y++)
    block(KX + dx, y, KZ + zf(6, Math.abs(dx)), GLASS);
for (const s of [-2, 2]) {
  for (let y = 13; y <= 14; y++) {
    block(KX + s, y, KZ + zf(6, 2), GLASS);
    block(KX + s, y, KZ - zf(6, 2), GLASS);
  }
  block(KX + s, 10, KZ + zf(6, 2) + 1, STONE); // button
}
block(KX, 9, KZ + zf(6, 0) + 1, STONE); // Gru logo dot

// grinning mouth with teeth
for (let dx = -2; dx <= 2; dx++) {
  block(KX + dx, 11, KZ + zf(6, Math.abs(dx)), STONE);
  block(KX + dx, 12, KZ + zf(6, Math.abs(dx)), STONE);
}
for (let dx = -1; dx <= 1; dx++) block(KX + dx, 12, KZ + zf(6, Math.abs(dx)), SNOW);
block(KX - 3, 12, KZ + zf(6, 3), STONE);
block(KX + 3, 12, KZ + zf(6, 3), STONE);

// two goggles + bridge
goggle(KX, KZ, KX - 3, 16, kRow);
goggle(KX, KZ, KX + 3, 16, kRow);
block(KX, 16, KZ + zf(6, 0) + 1, COBBLE);

// left arm hanging, right arm raised waving, black gloves
cube(KX - 8, 7, KZ - 1, KX - 7, 13, KZ, SAND);
cube(KX - 8, 5, KZ - 1, KX - 7, 6, KZ, STONE);
cube(KX + 6, 12, KZ - 1, KX + 7, 13, KZ, SAND);
cube(KX + 7, 14, KZ - 1, KX + 8, 15, KZ, SAND);
cube(KX + 8, 16, KZ - 1, KX + 9, 17, KZ, SAND);
cube(KX + 8, 18, KZ - 1, KX + 9, 19, KZ, STONE);

// sprigs of hair
block(KX, 24, KZ, OAK_LOG); block(KX, 25, KZ, OAK_LOG);
block(KX - 1, 24, KZ, OAK_LOG); block(KX - 2, 25, KZ, OAK_LOG);
block(KX, 24, KZ + 1, OAK_LOG); block(KX + 1, 25, KZ + 1, OAK_LOG);

// ============ BOB — short one-eyed minion holding a banana up ============
const BX = 8, BZ = 5;
const bRow = y => (y <= 11 ? 4 : (y === 12 ? 3 : 2));

// legs + boots (ground dips to y=-2 here, so root them in)
cube(BX - 2, -2, BZ - 1, BX - 1, 1, BZ, GLASS);
cube(BX + 1, -2, BZ - 1, BX + 2, 1, BZ, GLASS);
cube(BX - 2, -2, BZ + 1, BX - 1, -1, BZ + 2, STONE);
cube(BX + 1, -2, BZ + 1, BX + 2, -1, BZ + 2, STONE);

// body
cylinder(BX, 2, BZ, 4, 4, GLASS);
cylinder(BX, 6, BZ, 4, 5, SAND);
disk(BX, 11, BZ, 4, SAND);
disk(BX, 12, BZ, 3, SAND);
disk(BX, 13, BZ, 2, SAND);
disk(BX, 14, BZ, 1, SAND);

// strap + single big goggle
ring(BX, 10, BZ, 4, STONE);
goggle(BX, BZ, BX, 10, bRow);

// overall straps
for (const s of [-2, 2])
  for (let y = 6; y <= 7; y++)
    block(BX + s, y, BZ + zf(4, 2), GLASS);

// little smile with one tooth
block(BX - 1, 7, BZ + zf(4, 1), STONE);
block(BX + 1, 7, BZ + zf(4, 1), STONE);
block(BX, 7, BZ + zf(4, 0), SNOW);

// left arm down, right arm raised with glove
cube(BX - 6, 3, BZ - 1, BX - 5, 8, BZ, SAND);
cube(BX - 6, 1, BZ - 1, BX - 5, 2, BZ, STONE);
cube(BX + 5, 8, BZ - 1, BX + 5, 9, BZ, SAND);
cube(BX + 6, 10, BZ - 1, BX + 6, 11, BZ, SAND);
cube(BX + 5, 12, BZ - 1, BX + 6, 13, BZ, STONE);

// banana held aloft (2 thick, log tips)
for (const [x, y] of [[11, 15], [12, 14], [13, 14], [14, 14], [15, 15]]) {
  block(x, y, BZ - 1, SAND); block(x, y, BZ, SAND);
}
block(10, 16, BZ - 1, OAK_LOG); block(10, 16, BZ, OAK_LOG);
block(16, 16, BZ - 1, OAK_LOG); block(16, 16, BZ, OAK_LOG);

// hair
block(BX, 15, BZ, OAK_LOG); block(BX, 16, BZ, OAK_LOG); block(BX + 1, 16, BZ, OAK_LOG);

// ============ banana pile on the grass between them ============
for (const x of [0, 1, 2]) block(x, 0, 12, SAND);
block(-1, 1, 12, OAK_LOG); block(3, 1, 12, OAK_LOG);
for (const x of [2, 3, 4]) block(x, 0, 14, SAND);
block(1, 1, 14, OAK_LOG); block(5, 1, 14, OAK_LOG);