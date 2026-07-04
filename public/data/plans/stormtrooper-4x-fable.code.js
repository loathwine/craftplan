// stormtrooper-4x-fable — prompt:
// a Stormtrooper...

// STORMTROOPER — 32-block-tall figure on an Imperial landing pad,
// blaster raised and firing, mouse droid + banner for scene depth.
// Palette: SNOW = white armor, STONE = black undersuit/visor, COBBLE = gray trim.

// mirrored helper (right side given, left side auto)
const M = (x1, y1, z1, x2, y2, z2, id) => {
  cube(x1, y1, z1, x2, y2, z2, id);
  cube(-x2, y1, z1, -x1, y2, z2, id);
};

// ---- clear build volume (trees/logs intersecting the figure) ----
cube(-11, 0, -8, 11, 33, 8, AIR);

// ---- landing pad ----
disk(0, -1, 0, 10, COBBLE);
disk(0, 0, 0, 8, STONE);
// corner beacons
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  cube(sx * 7, 0, sz * 7, sx * 7, 2, sz * 7, COBBLE);
  block(sx * 7, 3, sz * 7, ICE);
}
// scattered debris
block(5, 1, -6, COBBLE); block(-6, 1, -3, COBBLE); block(-5, 1, 6, COBBLE);

// ---- boots & legs (facing +Z) ----
M(1, 1, -2, 5, 3, 3, SNOW);            // boots
M(1, 1, 4, 5, 2, 4, SNOW);             // toe caps
M(1, 4, -2, 4, 14, 2, SNOW);           // legs
M(1, 9, -2, 4, 9, -2, STONE);          // black behind knees
M(1, 9, 3, 4, 11, 3, SNOW);            // knee plates
cube(-4, 10, 3, -1, 10, 3, COBBLE);    // ribbed sniper-plate stripe (one knee)

// ---- pelvis & belt ----
cube(-4, 15, -2, 4, 15, 2, STONE);     // black undersuit at hips
cube(-4, 16, -2, 4, 18, 2, SNOW);      // pelvis / abdomen
cube(-5, 19, -3, 5, 19, 3, STONE);     // belt
cube(-4, 19, 4, -3, 19, 4, SNOW);      // ammo pouches
cube(-1, 19, 4, 0, 19, 4, SNOW);
cube(2, 19, 4, 3, 19, 4, SNOW);
cube(-1, 19, -4, 1, 19, -4, COBBLE);   // thermal detonator (back)

// ---- torso ----
cube(-5, 20, -3, 5, 25, 3, SNOW);      // chest + back plates
M(5, 20, -1, 5, 22, 1, STONE);         // black undersuit at sides
cube(0, 20, -3, 0, 24, -3, STONE);     // spine seam

// ---- shoulders & arms ----
M(5, 23, -2, 8, 25, 2, SNOW);          // shoulder pads
M(5, 26, -1, 7, 26, 1, SNOW);          // pad caps
// left arm hangs
cube(-8, 18, -1, -6, 22, 1, SNOW);
cube(-8, 17, -1, -6, 17, 1, STONE);    // elbow joint
cube(-8, 12, -1, -6, 16, 1, SNOW);     // forearm
cube(-8, 10, -1, -6, 11, 1, STONE);    // glove
// right arm raised forward, gripping blaster
cube(6, 19, -1, 8, 23, 1, SNOW);       // upper arm
cube(6, 17, -1, 8, 18, 1, STONE);      // elbow
cube(6, 17, 2, 8, 18, 5, SNOW);        // forearm (forward)
cube(6, 17, 6, 8, 19, 7, STONE);       // glove around grip

// ---- helmet ----
cube(-2, 26, -2, 2, 26, 2, STONE);     // black neck/under-helmet
cube(-4, 27, -3, 4, 28, 4, SNOW);      // flared jaw, chin juts forward
cube(-1, 28, 4, 1, 28, 4, STONE);      // vocoder grille
block(0, 27, 4, STONE);
cube(2, 27, 4, 3, 27, 4, COBBLE);      // cheek aerators
cube(-3, 27, 4, -2, 27, 4, COBBLE);
cube(-4, 29, -3, 4, 30, 3, SNOW);      // visor level
cube(-4, 30, 3, 4, 30, 3, STONE);      // visor band
cube(4, 30, 1, 4, 30, 2, STONE);       // band wraps sides
cube(-4, 30, 1, -4, 30, 2, STONE);
cube(3, 29, 3, 4, 29, 3, STONE);       // frowning outer corners
cube(-4, 29, 3, -3, 29, 3, STONE);
M(5, 28, -1, 5, 30, 0, COBBLE);        // ear caps
cube(-3, 31, -3, 3, 31, 3, SNOW);      // dome
cube(-2, 31, 3, 2, 31, 3, COBBLE);     // gray brow trim
cube(-2, 32, -2, 2, 32, 2, SNOW);
cube(-1, 33, -1, 1, 33, 1, SNOW);

// ---- E-11 blaster (held in right hand, firing +Z) ----
line(7, 18, 4, 7, 18, 15, STONE);      // barrel
cube(7, 19, 4, 7, 19, 8, COBBLE);      // folded stock rail
cube(7, 20, 5, 7, 20, 6, STONE);       // scope
block(7, 19, 11, COBBLE);              // barrel vents
block(7, 19, 13, COBBLE);
block(7, 16, 6, STONE);                // pistol grip
block(6, 18, 8, STONE);                // side magazine
// red bolts downrange
cube(7, 18, 17, 7, 18, 18, BRICK);
cube(7, 18, 20, 7, 18, 21, BRICK);

// ---- mouse droid scooting past ----
cube(-9, 0, 4, -7, 1, 6, STONE);
block(-8, 2, 5, COBBLE);

// ---- Imperial banner behind ----
cube(0, 1, -7, 0, 16, -7, COBBLE);     // pole
cube(-3, 15, -7, 3, 15, -7, COBBLE);   // crossbar
cube(-3, 8, -7, 3, 14, -7, STONE);     // gray banner cloth
cube(-2, 10, -7, 2, 12, -7, SNOW);     // cog emblem
block(0, 11, -7, STONE);