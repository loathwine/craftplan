// mjolnir-4x-fable — prompt:
// Thor's hammer Mjölnir...

// Mjölnir — Thor's hammer resting on a shattered rock outcrop, struck by lightning.
// Camera is NORTH (-Z): big rune-inlaid face of the head faces front.

// ---- site prep: clear trees/canopy over the footprint (AIR is free) ----
cube(-14, 1, -12, 14, 12, 14, AIR);
const stumps = [[1,-7],[4,-3],[12,11],[0,1],[7,-2],[8,-1],[-6,-8],[-1,-10],[3,-10],
                [-6,-1],[-6,1],[8,3],[-7,4],[-7,5],[-2,7],[-10,8],[-7,8],[-6,9],[-5,13]];
for (const [sx, sz] of stumps) cube(sx, -1, sz, sx, 0, sz, AIR);

// terrain dips at the front — pack stone under the rim
cube(0, -2, -7, 6, -1, -3, STONE);
cube(-2, -2, -6, -1, -1, -2, STONE);

// ---- rock outcrop pedestal (two offset disk stacks -> elongated crag) ----
const rs = [8, 7, 6, 5, 4, 3];
for (let y = 0; y < rs.length; y++) {
  disk(-4, y, 2, rs[y], STONE);
  disk(4, y, 2, rs[y], STONE);
}
// weathered cobble patches + half-buried boulders for texture
disk(-6, 3, 4, 3, COBBLE);
disk(5, 2, -2, 3, COBBLE);
disk(0, 4, 6, 3, COBBLE);
disk(-2, 1, -4, 2, COBBLE);
sphere(-10, 0, 6, 2, COBBLE);
sphere(9, 0, -4, 2, STONE);

// ---- hammer head (broad face toward -Z / camera) ----
cube(-7, 5, -2, 7, 13, 6, STONE);          // core block
cube(-9, 4, -3, -8, 14, 7, STONE);         // west flared striking cap
cube(8, 4, -3, 9, 14, 7, STONE);           // east flared striking cap
// bevel the striking faces: carve the rim ring off each outer face
line(-9, 4, -3, -9, 4, 7, AIR);  line(-9, 14, -3, -9, 14, 7, AIR);
line(-9, 5, -3, -9, 13, -3, AIR); line(-9, 5, 7, -9, 13, 7, AIR);
line(9, 4, -3, 9, 4, 7, AIR);    line(9, 14, -3, 9, 14, 7, AIR);
line(9, 5, -3, 9, 13, -3, AIR);  line(9, 5, 7, 9, 13, 7, AIR);

// cobble edge trim + forged banding
line(-7, 13, -2, 7, 13, -2, COBBLE); line(-7, 13, 6, 7, 13, 6, COBBLE);
line(-7, 5, -2, 7, 5, -2, COBBLE);   line(-7, 5, 6, 7, 5, 6, COBBLE);
line(-7, 5, -2, -7, 13, -2, COBBLE); line(7, 5, -2, 7, 13, -2, COBBLE);
line(-8, 4, -3, -8, 14, -3, COBBLE); line(8, 4, -3, 8, 14, -3, COBBLE);
line(-4, 13, -2, -4, 13, 6, COBBLE);
line(0, 13, -2, 0, 13, 6, COBBLE);
line(4, 13, -2, 4, 13, 6, COBBLE);

// front-face emblem: ice diamond with snow core, flanked by runes
line(0, 12, -2, -3, 9, -2, ICE); line(-3, 9, -2, 0, 6, -2, ICE);
line(0, 6, -2, 3, 9, -2, ICE);   line(3, 9, -2, 0, 12, -2, ICE);
block(0, 9, -2, SNOW); block(-1, 9, -2, SNOW); block(1, 9, -2, SNOW);
block(0, 10, -2, SNOW); block(0, 8, -2, SNOW);
line(-5, 7, -2, -5, 12, -2, SNOW);  // west rune (fehu-like)
block(-4, 11, -2, SNOW); block(-4, 9, -2, SNOW);
line(5, 7, -2, 5, 12, -2, SNOW);    // east rune (algiz-like)
block(4, 11, -2, SNOW); block(6, 11, -2, SNOW);

// ---- handle rising from the head ----
cube(-1, 14, 1, 0, 25, 2, OAK_LOG);
cube(-2, 14, 0, 1, 14, 3, COBBLE);          // forged collar at the neck
cube(-1, 15, 1, 0, 16, 2, PLANKS);          // leather grip wraps
cube(-1, 18, 1, 0, 19, 2, PLANKS);
cube(-1, 21, 1, 0, 22, 2, PLANKS);
cube(-2, 26, 0, 1, 26, 3, COBBLE);          // pommel flange
cube(-1, 27, 1, 0, 27, 2, STONE);
cube(-1, 28, 1, 0, 28, 2, SNOW);            // white-hot cap where the bolt lands
// hanging leather strap loop on the east side (catches the light)
line(1, 25, 1, 3, 23, 1, PLANKS);
line(3, 23, 1, 3, 20, 1, PLANKS);
line(3, 20, 1, 1, 18, 1, PLANKS);

// ---- lightning ----
// bolt 1: strikes the pommel
line(-6, 33, 8, -4, 31, 5, ICE);
line(-4, 31, 5, -6, 29, 4, ICE);
line(-6, 29, 4, -2, 28, 2, ICE);
line(-2, 28, 2, -1, 28, 1, ICE);
line(-4, 31, 5, -8, 30, 7, ICE);            // fork
block(0, 29, 1, ICE);
// bolt 2: rakes the east striking face
line(13, 33, -6, 10, 30, -3, ICE);
line(10, 30, -3, 12, 27, -1, ICE);
line(12, 27, -1, 9, 21, 0, ICE);
line(9, 21, 0, 8, 15, 2, ICE);
line(12, 27, -1, 15, 25, -3, ICE);          // fork
block(8, 15, 1, SNOW); block(9, 15, 2, SNOW); block(8, 15, 3, SNOW);
// bolt 3: background ground strike to the west for depth
line(-14, 33, 10, -12, 28, 9, ICE);
line(-12, 28, 9, -14, 23, 10, ICE);
line(-14, 23, 10, -12, 16, 10, ICE);
line(-12, 16, 10, -13, 8, 10, ICE);
line(-13, 8, 10, -12, 1, 10, ICE);
block(-12, 0, 10, SNOW); block(-13, 0, 10, SNOW); block(-12, 0, 11, SNOW);
// stray sparks
block(3, 26, -1, ICE); block(-4, 22, 2, ICE); block(11, 18, 1, ICE);
block(-2, 30, 3, ICE); block(5, 24, 3, ICE);

// ---- impact damage: glowing ground cracks (carve, then ice at the bottom) ----
line(-2, -1, -8, -5, -1, -14, AIR); line(-2, -2, -8, -5, -2, -14, ICE);
line(3, -1, -8, 7, -1, -13, AIR);   line(3, -2, -8, 7, -2, -13, ICE);
line(12, -1, 5, 17, -1, 7, AIR);    line(12, -2, 5, 17, -2, 7, ICE);
line(-13, -1, -1, -17, -1, -3, AIR); line(-13, -2, -1, -17, -2, -3, ICE);
line(6, -1, 11, 9, -1, 15, AIR);    line(6, -2, 11, 9, -2, 15, ICE);

// ---- scattered rubble ring ----
cube(-15, -1, 2, -14, 0, 3, COBBLE);
cube(14, -1, 4, 15, 0, 5, STONE);
cube(-11, -1, -8, -10, 0, -7, COBBLE);
cube(8, -2, -8, 9, 0, -7, STONE);
cube(4, -2, -10, 4, 0, -10, COBBLE);
cube(-3, -2, -9, -2, 0, -9, COBBLE);
block(0, 0, -11, STONE);
cube(12, -1, -5, 12, 0, -4, COBBLE);
cube(-13, -1, 8, -13, 0, 8, STONE);
cube(3, -1, 13, 4, 0, 13, COBBLE);
cube(-4, -1, 14, -4, 0, 14, STONE);
cube(13, -1, 12, 13, 0, 12, COBBLE);
block(16, 0, 0, COBBLE);