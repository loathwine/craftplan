// sabertooth-4x-opus — prompt:
// a sabertooth tiger...

const meta = { name: 'sabertooth', description: 'sabertooth tiger' }

const FUR   = SAND;      // tan fur
const BELLY = PLANKS;    // lighter underside
const DARK  = OAK_LOG;   // stripes
const TOOTH = SNOW;      // sabre fangs / claws
const EYE   = COBBLE;    // eyes / nose
const MOUTH = BRICK;     // inner mouth

// ---- clear forest canopy inside the build volume (not the whole site) ----
cube(-8, 1, -21, 8, 21, 15, AIR);

// ======================= LEGS + PAWS =======================
function leg(x1, x2, z1, z2, top) {
  cube(x1, 0, z1, x2, top, z2, FUR);
}
// front legs (thick, pillar-like)
leg(-3, -1, -8, -4, 8);
leg( 1,  3, -8, -4, 8);
// hind legs
leg(-3, -1, 8, 11, 7);
leg( 1,  3, 8, 11, 7);

// paws (spread out at the ground)
cube(-4, 0, -10, -1, 1, -4, FUR);   // front-left
cube( 1, 0, -10,  4, 1, -4, FUR);   // front-right
cube(-4, 0,  7, -1, 1, 12, FUR);    // hind-left
cube( 1, 0,  7,  4, 1, 12, FUR);    // hind-right

// claws (front, facing north)
for (const x of [-4, -3, -2, -1, 1, 2, 3, 4]) block(x, 0, -11, TOOTH);
for (const x of [-4, -3, -2, -1, 1, 2, 3, 4]) block(x, 0,  6, TOOTH);

// ======================= BODY =======================
// main torso
cube(-3, 7, -6, 3, 13, 8, FUR);
// rounded top ridge
cube(-2, 13, -6, 2, 14, 8, FUR);
// big powerful shoulders (front hump)
cube(-3, 13, -6, 3, 15, 0, FUR);
cube(-2, 15, -5, 2, 16, -1, FUR);
// haunches (hips)
cube(-3, 7, 6, 3, 13, 12, FUR);
cube(-2, 13, 6, 2, 14, 11, FUR);
// belly (lighter underside)
cube(-3, 7, -6, 3, 7, 12, BELLY);
cube(-2, 8, -5, 2, 8, 11, BELLY);
// round lower sides a touch
line(-3, 8, -6, -3, 8, 8, FUR);
line( 3, 8, -6,  3, 8, 8, FUR);

// ======================= NECK =======================
cube(-2, 10, -11, 2, 15, -5, FUR);
cube(-3, 11, -9, 3, 15, -6, FUR);   // ruff / neck fur

// ======================= HEAD =======================
// skull
cube(-3, 9, -16, 3, 15, -11, FUR);
cube(-2, 15, -16, 2, 15, -12, FUR); // rounded crown
// muzzle / snout (projecting forward, lower)
cube(-2, 11, -19, 2, 13, -16, FUR);
// lower jaw
cube(-2, 8, -18, 2, 9, -16, FUR);
// open mouth interior
cube(-2, 10, -17, 2, 10, -16, MOUTH);
block(0, 10, -18, MOUTH);

// nose
cube(-1, 13, -19, 1, 13, -19, EYE);

// eyes (fierce, above the snout, facing north)
block(-2, 14, -16, EYE);
block( 2, 14, -16, EYE);
// dark brow ridge
cube(-2, 15, -16, -1, 15, -16, DARK);
cube( 1, 15, -16,  2, 15, -16, DARK);
// face stripes running back from eyes
line(-2, 14, -15, -2, 14, -12, DARK);
line( 2, 14, -15,  2, 14, -12, DARK);

// ears (triangular, atop the head)
cube(-3, 16, -14, -2, 17, -13, FUR);
block(-3, 18, -13, FUR);
block(-2, 16, -13, MOUTH);          // inner ear
cube( 2, 16, -14,  3, 17, -13, FUR);
block( 3, 18, -13, FUR);
block( 2, 16, -13, MOUTH);

// ======================= SABRE FANGS =======================
// two enormous curved canines sweeping down past the jaw
function fang(x) {
  cube(x, 8, -18, x, 11, -18, TOOTH);  // upper root
  cube(x, 5, -17, x, 8, -17, TOOTH);   // mid
  cube(x, 3, -16, x, 5, -16, TOOTH);   // curved tip
  block(x, 2, -16, TOOTH);
}
fang(-2);
fang( 2);

// whiskers
line(-2, 12, -18, -5, 13, -19, TOOTH);
line(-2, 11, -18, -5, 11, -19, TOOTH);
line( 2, 12, -18,  5, 13, -19, TOOTH);
line( 2, 11, -18,  5, 11, -19, TOOTH);

// ======================= TAIL =======================
// thick tail sweeping back and up off the hindquarters
line(0, 12, 12, 0, 13, 15, FUR);
line(0, 13, 15, 1, 15, 18, FUR);
line(1, 15, 18, 2, 18, 20, FUR);
line(2, 18, 20, 3, 20, 21, FUR);
// thicken tail
for (const [x,y,z] of [[0,12,13],[0,13,14],[0,13,16],[1,14,17],[1,15,19],[2,17,20],[2,19,21]]) {
  block(x, y, z, FUR);
}
// dark tail tip
block(3, 21, 21, DARK);
block(3, 20, 21, DARK);

// ======================= STRIPES =======================
// vertical tiger bands over back and sides
for (const z of [-4, -1, 2, 5, 8, 10]) {
  cube(-3, 12, z, 3, 14, z, DARK);
  block(-3, 10, z, DARK);
  block( 3, 10, z, DARK);
}
// stripes down the shoulder hump
cube(-2, 15, -3, 2, 16, -3, DARK);
cube(-3, 13, -3, -3, 15, -3, DARK);
cube( 3, 13, -3,  3, 15, -3, DARK);
// stripes on the haunch
cube(-3, 11, 10, -3, 13, 10, DARK);
cube( 3, 11, 10,  3, 13, 10, DARK);