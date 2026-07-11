// pagoda-4x-fable — prompt:
// a Japanese pagoda...

const cx = 0, cz = 4;

// ---------- helpers ----------
function ringAt(hw, y, id) {
  cube(cx - hw, y, cz - hw, cx + hw, y, cz - hw, id);
  cube(cx - hw, y, cz + hw, cx + hw, y, cz + hw, id);
  cube(cx - hw, y, cz - hw, cx - hw, y, cz + hw, id);
  cube(cx + hw, y, cz - hw, cx + hw, y, cz + hw, id);
}

function tier(hw, y0, y1, rows) {
  // white plaster walls
  cube(cx - hw, y0, cz - hw, cx + hw, y1, cz - hw, SNOW);
  cube(cx - hw, y0, cz + hw, cx + hw, y1, cz + hw, SNOW);
  cube(cx - hw, y0, cz - hw, cx - hw, y1, cz + hw, SNOW);
  cube(cx + hw, y0, cz - hw, cx + hw, y1, cz + hw, SNOW);
  // vermillion beam band under the eaves
  ringAt(hw, y1, BRICK);
  // timber corner posts
  for (const sx of [-1, 1]) for (const sz of [-1, 1])
    cube(cx + sx * hw, y0, cz + sz * hw, cx + sx * hw, y1, cz + sz * hw, OAK_LOG);
  // dark window slits on all four faces
  for (let r = 0; r < rows; r++) {
    const y = y0 + 1 + r;
    for (let x = cx - hw + 2; x <= cx + hw - 2; x += 2) {
      block(x, y, cz - hw, AIR);
      block(x, y, cz + hw, AIR);
    }
    for (let z = cz - hw + 2; z <= cz + hw - 2; z += 2) {
      block(cx - hw, y, z, AIR);
      block(cx + hw, y, z, AIR);
    }
  }
}

function roof(hw, y) {
  // wide eave slab + upper step = sloped tiled roof
  cube(cx - hw - 2, y, cz - hw - 2, cx + hw + 2, y, cz + hw + 2, STONE);
  cube(cx - hw, y + 1, cz - hw, cx + hw, y + 1, cz + hw, STONE);
  // upturned red corner tips
  for (const sx of [-1, 1]) for (const sz of [-1, 1])
    block(cx + sx * (hw + 2), y + 1, cz + sz * (hw + 2), BRICK);
}

function lantern(x, z) {
  cube(x, -2, z, x, 0, z, COBBLE);
  block(x, 1, z, GLASS);
  disk(x, 2, z, 1, STONE);
  block(x, 3, z, COBBLE);
}

// ---------- site clearing (targeted, AIR is free) ----------
cube(-9, 1, -5, 9, 30, 13, AIR);      // pagoda volume
cube(-6, 0, -18, 6, 8, -5, AIR);      // approach path + torii corridor
cube(-17, 0, -1, -9, 9, 8, AIR);      // pond garden (west)
cube(11, 0, -2, 19, 7, 6, AIR);       // side shrine (east)

// ---------- stone plinth ----------
cube(-8, -1, -4, 8, 0, 12, STONE);
cube(-8, 0, -4, 8, 0, -4, COBBLE);
cube(-8, 0, 12, 8, 0, 12, COBBLE);
cube(-8, 0, -4, -8, 0, 12, COBBLE);
cube(8, 0, -4, 8, 0, 12, COBBLE);
cube(-5, 0, -1, 5, 0, 9, PLANKS);     // interior wooden floor
cube(-3, -1, -6, 3, -1, -5, COBBLE);  // entrance apron / step

// ---------- five tiers, bottom to top ----------
tier(6, 1, 5, 2);
roof(6, 6);
ringAt(6, 8, BRICK);   // balcony railing
tier(5, 8, 11, 2);
roof(5, 12);
ringAt(5, 14, BRICK);
tier(4, 14, 17, 2);
roof(4, 18);
ringAt(4, 20, BRICK);
tier(3, 20, 22, 1);
roof(3, 23);
ringAt(3, 25, BRICK);
tier(2, 25, 27, 1);
roof(2, 28);

// shinbashira — central heart pillar
cube(cx, 1, cz, cx, 29, cz, OAK_LOG);

// veranda posts holding the great lower eaves
for (const sx of [-1, 1]) for (const sz of [-1, 1])
  cube(cx + sx * 8, 1, cz + sz * 8, cx + sx * 8, 5, cz + sz * 8, OAK_LOG);

// ---------- sorin spire ----------
disk(cx, 30, cz, 2, BRICK);
disk(cx, 31, cz, 1, BRICK);
disk(cx, 32, cz, 1, BRICK);
cube(cx, 30, cz, cx, 32, cz, OAK_LOG);
block(cx, 33, cz, ICE); // jewel

// ---------- front door (north face, toward camera) ----------
cube(-1, 1, -2, 1, 3, -2, AIR);
cube(-2, 1, -2, -2, 4, -2, OAK_LOG);
cube(2, 1, -2, 2, 4, -2, OAK_LOG);
cube(-2, 4, -2, 2, 4, -2, BRICK);

// ---------- cobble approach with sand borders ----------
cube(-1, -2, -18, 1, -1, -6, COBBLE);
cube(-2, -2, -18, -2, -1, -6, SAND);
cube(2, -2, -18, 2, -1, -6, SAND);

// ---------- torii gate ----------
cube(-3, -2, -13, -3, 4, -13, BRICK);
cube(3, -2, -13, 3, 4, -13, BRICK);
cube(-3, 3, -13, 3, 3, -13, BRICK);   // tie beam
cube(-5, 5, -13, 5, 5, -13, BRICK);   // lintel
cube(-5, 6, -13, 5, 6, -13, STONE);   // dark cap

// stone lanterns flanking the path
lantern(-4, -8); lantern(4, -8);
lantern(-4, -15); lantern(4, -15);

// ---------- west garden: pond, rocks, tree ----------
cube(-16, -1, 0, -10, -1, 7, SAND);
cube(-15, -1, 1, -11, -1, 6, GLASS);
block(-12, 0, 2, STONE);
block(-14, 0, 5, STONE);
block(-14, 1, 5, STONE);
cube(-13, 0, 9, -13, 3, 9, OAK_LOG);
sphere(-13, 5, 9, 2, LEAVES);

// ---------- east side shrine ----------
cube(13, -1, 0, 17, -1, 4, COBBLE);
cube(13, 0, 0, 17, 2, 0, PLANKS);
cube(13, 0, 4, 17, 2, 4, PLANKS);
cube(13, 0, 0, 13, 2, 4, PLANKS);
cube(17, 0, 0, 17, 2, 4, PLANKS);
for (const sx of [13, 17]) for (const sz of [0, 4])
  cube(sx, 0, sz, sx, 2, sz, OAK_LOG);
cube(12, 3, -1, 18, 3, 5, BRICK);
cube(13, 4, 0, 17, 4, 4, BRICK);
cube(14, 5, 1, 16, 5, 3, BRICK);
block(15, 6, 2, BRICK);
cube(15, 0, 0, 15, 1, 0, AIR);        // shrine doorway
block(13, 1, 2, AIR);
block(17, 1, 2, AIR);