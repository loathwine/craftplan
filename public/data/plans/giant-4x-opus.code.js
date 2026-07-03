// giant-4x-opus — prompt:
// an axe-wielding giant...

// AXE-WIELDING GIANT — facing +Z (toward the viewer), striding through the forest
// Palette: skin=SAND, hair/beard/handle=OAK_LOG, armor/axe=COBBLE, edges=STONE,
//          cloth=PLANKS, belt/eyes/runes=BRICK, tusks=SNOW
const SKIN = SAND, HAIR = OAK_LOG, ARM = COBBLE, EDGE = STONE,
      CLOTH = PLANKS, TRIM = BRICK, TUSK = SNOW;

// ---------------- LEGS ----------------
function leg(x0){
  cube(x0, 0, -2, x0+3, 12, 2, SKIN);        // thigh + calf
  cube(x0, 0, 3, x0+3, 4, 3, SKIN);          // shin front bulge
  cube(x0, 0, 3, x0+3, 1, 6, SKIN);          // foot forward
  block(x0, 0, 6, EDGE); block(x0+3, 0, 6, EDGE); // hard toenails
  cube(x0-1, 6, -3, x0+4, 8, 3, ARM);        // knee guard
  hollowCube(x0-1, 6, -3, x0+4, 8, 3, EDGE);
}
leg(-7);
leg(4);

// ---------------- PELVIS / LOINCLOTH ----------------
cube(-7, 12, -3, 7, 15, 3, SKIN);            // hips
cube(-8, 12, -4, 8, 17, 4, CLOTH);           // loincloth wrap
cube(-2, 10, 3, 2, 15, 4, CLOTH);            // front flap
cube(-8, 16, -4, 8, 17, 4, TRIM);            // belt
cube(-2, 15, 4, 2, 17, 4, ARM);              // buckle

// ---------------- TORSO ----------------
cube(-6, 15, -3, 6, 20, 4, SKIN);            // belly / abs
cube(-8, 20, -4, 8, 24, 4, SKIN);            // broad chest
block(0, 18, 4, HAIR);                        // navel
line(-6, 24, 4, 4, 17, 4, ARM);              // harness strap
line(-6, 17, 4, 4, 24, 4, ARM);              // cross strap (X)
block(-1, 21, 5, TRIM); block(1, 21, 5, TRIM); // strap studs

// ---------------- SHOULDERS + PAULDRONS ----------------
cube(-12, 23, -3, -8, 25, 3, SKIN);          // left shoulder mass
cube( 8, 23, -3, 12, 25, 3, SKIN);           // right shoulder mass
sphere(-10, 25, 0, 3, ARM);  hollowSphere(-10, 25, 0, 3, EDGE);
sphere( 10, 25, 0, 3, ARM);  hollowSphere( 10, 25, 0, 3, EDGE);
line(-10, 27, 0, -10, 30, 0, EDGE);          // pauldron spikes
line( 10, 27, 0,  10, 30, 0, EDGE);

// ---------------- NECK / HEAD ----------------
cube(-2, 24, -2, 2, 26, 2, SKIN);            // neck
cube(-3, 26, -3, 3, 31, 3, SKIN);            // skull
cube(-3, 26, -3, 3, 27, 4, SKIN);            // heavy jaw
// hair
cube(-3, 31, -3, 3, 32, 3, HAIR);            // scalp
cube(-3, 27, -4, 3, 32, -4, HAIR);           // back mane
cube(-4, 29, -3, -4, 32, 3, HAIR);           // side hair
cube( 4, 29, -3,  4, 32, 3, HAIR);
// face
cube(-3, 30, 4, 3, 30, 4, HAIR);             // brow ridge
block(-2, 29, 4, TRIM); block(2, 29, 4, TRIM); // glowing eyes
cube(-2, 27, 4, 2, 27, 4, HAIR);             // mouth
block(0, 27, 4, SKIN); block(0, 28, 4, SKIN);  // nose
block(-1, 26, 4, TUSK); block(1, 26, 4, TUSK); // tusks
cube(-3, 24, 3, 3, 26, 4, HAIR);             // beard under jaw
cube(-2, 22, 3, 2, 24, 4, HAIR);             // beard hangs

// ---------------- LEFT ARM (hanging, clenched fist) ----------------
cube(-12, 12, -2, -9, 23, 2, SKIN);          // upper + forearm
cube(-13, 9, -1, -9, 13, 3, SKIN);           // big fist
cube(-13, 13, -2, -9, 15, 2, ARM);           // bracer
hollowCube(-13, 13, -2, -9, 15, 2, EDGE);

// ---------------- RIGHT ARM (raised, gripping axe) ----------------
cube(9, 20, -2, 12, 25, 2, SKIN);            // upper arm rising
cube(11, 24, -1, 14, 31, 3, SKIN);           // forearm raised
cube(11, 30, 0, 15, 33, 4, SKIN);            // fist near top
cube(12, 24, -1, 14, 26, 3, ARM);            // bracer
hollowCube(12, 24, -1, 14, 26, 3, EDGE);

// ---------------- THE AXE ----------------
cube(13, 16, 1, 14, 33, 2, HAIR);            // long handle
cube(12, 16, 0, 15, 17, 3, ARM);             // pommel
cube(15, 27, 0, 16, 33, 3, ARM);             // blade neck
cube(16, 26, -1, 21, 33, 4, ARM);            // blade body
cube(16, 26, -1, 17, 30, 4, AIR);            // carve crescent notch
cube(16, 32, -1, 17, 33, 4, AIR);            // carve inner top
cube(21, 27, -1, 21, 33, 4, EDGE);           // outer cutting edge
cube(17, 33, -1, 21, 33, 4, EDGE);           // top edge
line(17, 26, 0, 21, 26, 0, EDGE);            // lower edge
block(18, 30, 4, TRIM); block(19, 29, 4, TRIM); block(19, 31, 4, TRIM); // runes

// ---------------- GROUND SCENE (crushed forest) ----------------
sphere(-14, 0, 8, 2, EDGE);                  // boulders
sphere(12, -1, 11, 2, ARM);
sphere(-3, 0, 13, 2, EDGE);
cube(-16, 0, -6, -15, 3, -5, HAIR);          // splintered stumps
cube(9, 0, -8, 10, 2, -7, HAIR);
line(-15, 3, -6, -13, 5, -8, HAIR);          // fallen trunk
block(6, 0, 9, EDGE); block(-9, 0, 11, ARM); block(3, 0, 15, EDGE);
block(15, 0, 8, EDGE); block(-6, 0, 14, ARM); // scattered rubble