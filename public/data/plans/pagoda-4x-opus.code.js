// pagoda-4x-opus — prompt:
// a Japanese pagoda...

const meta = null;

const CX = 0, CZ = 0;

// ---- helpers ----
function walls(x0, y0, z0, x1, y1, z1, mat) {
  cube(x0, y0, z0, x1, y1, z0, mat);
  cube(x0, y0, z1, x1, y1, z1, mat);
  cube(x0, y0, z0, x0, y1, z1, mat);
  cube(x1, y0, z0, x1, y1, z1, mat);
}
function ring(x0, y, z0, x1, z1, mat) {
  cube(x0, y, z0, x1, y, z0, mat);
  cube(x0, y, z1, x1, y, z1, mat);
  cube(x0, y, z0, x0, y, z1, mat);
  cube(x1, y, z0, x1, y, z1, mat);
}

// clear the build column of forest/leaves that fill this site (AIR is free)
cube(-11, 1, -11, 11, 27, 11, AIR);

// ---- stone base / platform ----
cube(-10, -1, -10, 10, 0, 10, STONE);
// sink a foundation to catch uneven terrain
cube(-9, -3, -9, 9, -2, 9, COBBLE);
// decorative outer plinth edge
ring(-10, 0, -10, 10, 10, COBBLE);
// front (north) stone staircase leading up to the entrance
for (let s = 0; s < 3; s++) {
  cube(-3, -s, -13 + s, 3, -s, -11 + s, STONE);
}

// ---- tiers ----
// each: bodyHalf, body height, roofHalf, roof height
const tiers = [
  { bh: 7, h: 4, rh: 9, rH: 3 },
  { bh: 6, h: 4, rh: 8, rH: 3 },
  { bh: 5, h: 3, rh: 7, rH: 2 },
  { bh: 4, h: 3, rh: 6, rH: 2 },
  { bh: 3, h: 3, rh: 5, rH: 2 },
];

function pagodaRoof(yTop, half, hh) {
  // wide flat eave (solid overhang, underside visible)
  cube(CX - half, yTop, CZ - half, CX + half, yTop, CZ + half, STONE);
  // brick trim along the eave lip (red accent)
  ring(CX - half, yTop, CZ - half, CX + half, CZ + half, BRICK);
  // stepped pyramid of tiled rings receding + rising to the ridge
  for (let k = 1; k <= hh; k++) {
    let hw = half - 1 - k;
    if (hw < 0) hw = 0;
    ring(CX - hw, yTop + k, CZ - hw, CX + hw, CZ + hw, STONE);
    if (hw <= 0) block(CX, yTop + k, CZ, STONE);
  }
  // upturned corner eaves (the signature curl)
  const corners = [[-half, -half], [half, -half], [-half, half], [half, half]];
  for (const [dx, dz] of corners) {
    block(CX + dx, yTop + 1, CZ + dz, STONE);
    block(CX + dx, yTop + 2, CZ + dz, BRICK);
    const ox = dx > 0 ? dx + 1 : dx - 1;
    const oz = dz > 0 ? dz + 1 : dz - 1;
    block(CX + ox, yTop + 1, CZ + oz, STONE);
    block(CX + ox, yTop + 2, CZ + oz, STONE);
  }
}

let y = 1;
for (let t = 0; t < tiers.length; t++) {
  const T = tiers[t];
  const half = T.bh;
  const yTop = y + T.h;

  // wooden plank walls
  walls(CX - half, y, CZ - half, CX + half, y + T.h - 1, CZ + half, PLANKS);
  // corner posts (dark oak)
  const cs = [[-half, -half], [half, -half], [-half, half], [half, half]];
  for (const [dx, dz] of cs) {
    cube(CX + dx, y, CZ + dz, CX + dx, y + T.h - 1, CZ + dz, OAK_LOG);
  }
  // top beam course
  ring(CX - half, y + T.h - 1, CZ - half, CX + half, CZ + half, OAK_LOG);

  // windows / openings
  const wy0 = y + 1, wy1 = y + T.h - 2;
  if (wy1 >= wy0) {
    // side & back glass shoji windows
    cube(CX + half, wy0, CZ - half + 2, CX + half, wy1, CZ + half - 2, GLASS);
    cube(CX - half, wy0, CZ - half + 2, CX - half, wy1, CZ + half - 2, GLASS);
    cube(CX - half + 2, wy0, CZ + half, CX + half - 2, wy1, CZ + half, GLASS);
    if (t === 0) {
      // ground floor front: an entrance doorway with brick frame
      cube(CX - 2, y, CZ - half, CX + 2, y + T.h - 1, CZ - half, BRICK);
      cube(CX - 1, y, CZ - half, CX + 1, y + T.h - 2, CZ - half, AIR);
    } else {
      cube(CX - half + 2, wy0, CZ - half, CX + half - 2, wy1, CZ - half, GLASS);
    }
  }

  // balcony railing (brick) sitting on this tier's roof eave
  ring(CX - half - 1, yTop, CZ - half - 1, CX + half + 1, CZ + half + 1, BRICK);

  // the tiled roof over this tier
  pagodaRoof(yTop, T.rh, T.rH);

  y = yTop + 1;
}

// ---- sorin (finial spire) on the crown ----
const fy = y; // just above top roof
cube(CX, fy, CZ, CX, fy + 7, CZ, STONE);   // central mast
// stacked rings of the sorin
for (let r = 0; r < 4; r++) {
  const ry = fy + 1 + r * 2;
  ring(CX - 1, ry, CZ - 1, CX + 1, CZ + 1, BRICK);
}
// water-flame jewel at the very top
block(CX, fy + 8, CZ, ICE);
block(CX, fy + 9, CZ, GLASS);

// ---- foreground: two stone lanterns flanking the stair ----
function lantern(lx, lz) {
  cube(lx, 0, lz, lx, 2, lz, OAK_LOG); // post
  cube(lx - 1, 3, lz - 1, lx + 1, 3, lz + 1, STONE); // base plate
  block(lx, 4, lz, GLASS); // the light
  cube(lx - 1, 5, lz - 1, lx + 1, 5, lz + 1, STONE); // cap
  block(lx, 6, lz, BRICK); // finial
}
lantern(-6, -12);
lantern(6, -12);

// a couple of foreground foliage accents for depth
block(-9, 1, -13, LEAVES);
block(-8, 1, -13, LEAVES);
block(9, 1, -13, LEAVES);
block(8, 1, -13, LEAVES);