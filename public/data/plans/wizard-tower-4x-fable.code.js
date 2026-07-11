// wizard-tower-4x-fable — prompt:
// a wizard's tower...

const CX = 0, CZ = 4; // tower center, pushed slightly south so the front yard faces the camera

// ---- clear trees from the footprint and approach (AIR is free) ----
cube(-11, 1, -6, 15, 13, 14, AIR);   // tower + annex + turret site
cube(-4, 1, -16, 4, 10, -6, AIR);    // front path corridor
cube(-14, 1, -12, -5, 9, -3, AIR);   // stone-circle glade (front-left)
cube(4, 1, -5, 14, 9, 0, AIR);       // herb-garden plot (front-right)

// ---- foundation + plaza ----
disk(CX, -1, CZ, 8, STONE);
disk(CX, 0, CZ, 7, COBBLE);

// ---- main tower: three tapering drums ----
hollowCylinder(CX, 0, CZ, 6, 9, STONE);      // y0-8
hollowCylinder(CX, 0, CZ, 6, 2, COBBLE);     // rough base course
disk(CX, 8, CZ, 6, COBBLE);                  // first ledge
hollowCylinder(CX, 9, CZ, 5, 8, STONE);      // y9-16
hollowCylinder(CX, 9, CZ, 5, 1, OAK_LOG);    // timber trim ring
disk(CX, 16, CZ, 5, COBBLE);                 // second ledge
hollowCylinder(CX, 17, CZ, 4, 6, STONE);     // y17-22
hollowCylinder(CX, 17, CZ, 4, 1, OAK_LOG);   // timber trim ring

// ---- windows (glass slabs punched through the wall thickness) ----
cube(-1, 5, CZ - 6, 1, 6, CZ - 5, GLASS);        // north, above door
cube(5, 3, CZ - 1, 6, 6, CZ + 1, GLASS);         // east
cube(-6, 3, CZ - 1, -5, 6, CZ + 1, GLASS);       // west
cube(-1, 11, CZ - 5, 1, 13, CZ - 4, GLASS);      // north mid
cube(4, 12, CZ - 1, 5, 14, CZ + 1, GLASS);       // east mid
cube(-5, 12, CZ - 1, -4, 14, CZ + 1, GLASS);     // west mid
cube(-1, 18, CZ - 4, 1, 20, CZ - 3, GLASS);      // north upper

// ---- front door (north face) ----
cube(-1, 1, CZ - 7, 1, 3, CZ - 5, AIR);          // carve entry
cube(-1, 1, CZ - 5, 1, 3, CZ - 5, PLANKS);       // recessed wooden door
cube(-2, 1, CZ - 6, -2, 4, CZ - 6, OAK_LOG);     // frame left
cube(2, 1, CZ - 6, 2, 4, CZ - 6, OAK_LOG);       // frame right
cube(-2, 4, CZ - 6, 2, 4, CZ - 6, OAK_LOG);      // lintel
cube(-2, 0, CZ - 9, 2, 0, CZ - 7, COBBLE);       // stoop

// ---- corner buttresses ----
function buttress(sx, sz) {
  cube(CX + 5 * sx, 0, CZ + 5 * sz, CX + 5 * sx, 4, CZ + 5 * sz, COBBLE);
  cube(CX + 6 * sx, 0, CZ + 6 * sz, CX + 6 * sx, 2, CZ + 6 * sz, COBBLE);
  block(CX + 5 * sx, 5, CZ + 5 * sz, STONE);
}
buttress(1, 1); buttress(1, -1); buttress(-1, 1); buttress(-1, -1);

// ---- balcony with parapet ----
disk(CX, 22, CZ, 7, COBBLE);
hollowCylinder(CX, 23, CZ, 7, 1, COBBLE);
cube(CX - 1, 23, CZ - 8, CX + 1, 23, CZ - 6, AIR);   // crenel gaps
cube(CX - 1, 23, CZ + 6, CX + 1, 23, CZ + 8, AIR);
cube(CX - 8, 23, CZ - 1, CX - 6, 23, CZ + 1, AIR);
cube(CX + 6, 23, CZ - 1, CX + 8, 23, CZ + 1, AIR);

// ---- observatory room with glass band ----
hollowCylinder(CX, 23, CZ, 4, 5, STONE);             // y23-27
hollowCylinder(CX, 25, CZ, 4, 2, GLASS);             // wraparound window band
cube(-1, 23, CZ - 4, 1, 25, CZ - 3, AIR);            // balcony doorway (north)

// ---- witch-hat roof (red brick cone with icy tip) ----
disk(CX, 28, CZ, 6, BRICK);
disk(CX, 29, CZ, 5, BRICK);
disk(CX, 30, CZ, 4, BRICK);
disk(CX, 31, CZ, 3, BRICK);
disk(CX, 32, CZ, 2, BRICK);
disk(CX, 33, CZ, 1, ICE);                            // glowing tip

// ---- attached front-left turret ----
hollowCylinder(-7, 0, -1, 3, 11, STONE);
hollowCylinder(-7, 0, -1, 3, 2, COBBLE);
cube(-8, 4, -4, -6, 6, -3, GLASS);                   // north window
cube(-8, 8, -4, -6, 9, -3, GLASS);                   // upper window
disk(-7, 11, -1, 4, BRICK);
disk(-7, 12, -1, 3, BRICK);
disk(-7, 13, -1, 2, BRICK);
disk(-7, 14, -1, 1, BRICK);
block(-7, 15, -1, ICE);
cube(-6, 13, 0, -4, 13, 2, PLANKS);                  // little bridge to the tower
line(-6, 14, 0, -4, 14, 2, OAK_LOG);                 // rail

// ---- annex cottage (wizard's study, east side) ----
cube(6, 0, 1, 13, 4, 1, PLANKS);                     // north wall
cube(6, 0, 8, 13, 4, 8, PLANKS);                     // south wall
cube(13, 0, 2, 13, 4, 7, PLANKS);                    // east wall
cube(6, 0, 2, 6, 4, 7, PLANKS);                      // west wall (meets tower)
cube(6, 0, 1, 6, 4, 1, OAK_LOG); cube(13, 0, 1, 13, 4, 1, OAK_LOG);
cube(6, 0, 8, 6, 4, 8, OAK_LOG); cube(13, 0, 8, 13, 4, 8, OAK_LOG);
cube(8, 2, 1, 9, 3, 1, GLASS);                       // north windows
cube(11, 2, 1, 12, 3, 1, GLASS);
cube(5, 5, 0, 14, 5, 9, BRICK);                      // stepped gable roof
cube(5, 6, 1, 14, 6, 8, BRICK);
cube(5, 7, 2, 14, 7, 7, BRICK);
cube(5, 8, 3, 14, 8, 6, BRICK);
cube(5, 9, 4, 14, 9, 5, BRICK);
cube(11, 4, 6, 12, 10, 7, COBBLE);                   // chimney
block(11, 11, 6, SNOW); block(12, 12, 7, SNOW); block(12, 13, 7, SNOW); // smoke

// ---- herb garden in front of the annex ----
cube(6, 1, -4, 13, 1, -4, LEAVES);                   // hedge
cube(6, 1, -3, 6, 1, -1, LEAVES);
cube(13, 1, -3, 13, 1, -1, LEAVES);
cube(7, 0, -3, 12, 0, -1, DIRT);                     // beds
cube(7, 1, -3, 7, 1, -1, LEAVES);
cube(9, 1, -3, 9, 1, -1, LEAVES);
cube(11, 1, -3, 11, 1, -1, LEAVES);
cube(8, 0, -3, 8, 0, -1, SAND);                      // sandy walking row
cube(10, 0, -3, 10, 0, -1, SAND);

// ---- cobble path from the north with glowing lamps ----
cube(-1, -1, -16, 1, 0, -4, COBBLE);
cube(2, -1, -5, 5, 0, -4, COBBLE);                   // spur to the garden
function lamp(x, z) {
  cube(x, 0, z, x, 2, z, OAK_LOG);
  block(x, 3, z, ICE);
  block(x, 4, z, SNOW);
}
lamp(-3, -7); lamp(3, -7); lamp(-3, -13); lamp(3, -13);

// ---- standing-stone circle with a crystal (front-left glade) ----
function monolith(x, z, h) {
  cube(x, 0, z, x, h, z, STONE);
  block(x, h + 1, z, COBBLE);
}
monolith(-11, -12, 3); monolith(-7, -9, 2); monolith(-8, -5, 3);
monolith(-13, -5, 2); monolith(-14, -9, 3);
cube(-11, 0, -8, -11, 1, -8, STONE);                 // altar plinth
cube(-11, 2, -8, -11, 4, -8, ICE);                   // crystal
block(-12, 3, -8, ICE); block(-10, 3, -8, ICE);
block(-11, 3, -9, ICE); block(-11, 3, -7, ICE);

// ---- floating islands + spiraling magic motes ----
cube(-14, 16, -1, -12, 17, 1, DIRT);
cube(-14, 18, -1, -12, 18, 1, GRASS);
block(-13, 15, 0, STONE);
cube(-13, 19, 0, -13, 20, 0, ICE);
cube(12, 19, -2, 13, 19, -1, DIRT);
cube(12, 20, -2, 13, 20, -1, GRASS);
block(12, 21, -2, ICE);
for (let i = 0; i < 10; i++) {
  const a = i * 0.75;
  const mx = CX + Math.round(8 * Math.sin(a));
  const mz = CZ - Math.round(8 * Math.cos(a));
  block(mx, 6 + i * 2, mz, ICE);
}

// ---- ivy creeping up the base ----
cube(5, 1, 1, 5, 3, 1, LEAVES);
block(4, 4, 0, LEAVES); block(5, 4, 2, LEAVES);
cube(-6, 1, 6, -6, 4, 6, LEAVES);
block(-5, 5, 7, LEAVES);