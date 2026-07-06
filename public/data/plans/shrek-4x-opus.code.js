// shrek-4x-opus — prompt:
// Shrek...

const meta = undefined;
// —— SHREK the ogre, standing in his swamp ——
const GREEN = LEAVES;   // ogre skin
const BROWN = OAK_LOG;  // vest / wood
const TAN   = PLANKS;   // peasant shirt & pants
const WHITE = SNOW;     // eye whites
const DARK  = STONE;    // pupils / accents
const RED   = BRICK;    // mushroom caps

// ---------- SWAMP GROUND ----------
disk(0, -2, 0, 14, DIRT);
disk(0, -1, 0, 14, GRASS);
disk(0, -1, 2, 6, DIRT);   // muddy patch under him

// ================= SHREK =================

// ---- FEET (bare green, splayed toes) ----
cube(-5, 0, -2, -1, 1, 4, GREEN);   // left foot
cube( 1, 0, -2,  5, 1, 4, GREEN);   // right foot
// toe grooves
[-4,-2,2,4].forEach(x => block(x, 1, 4, AIR));

// ---- LEGS (tan pants) ----
cube(-5, 2, -2, -1, 6, 2, TAN);
cube( 1, 2, -2,  5, 6, 2, TAN);

// ---- TORSO (barrel body) ----
cube(-6, 6, -3, 6, 16, 3, TAN);      // shirt base
cube(-5, 7,  3, 5, 13, 4, TAN);      // belly bump forward
// vest (brown) wrapping sides / back / front panels
cube(-6, 7, -3, -4, 15, 3, BROWN);   // left side
cube( 4, 7, -3,  6, 15, 3, BROWN);   // right side
cube(-6, 7, -3,  6, 15, -3, BROWN);  // back
cube(-6, 7,  3, -2, 15, 3, BROWN);   // front-left panel
cube( 2, 7,  3,  6, 15, 3, BROWN);   // front-right panel
// belt + buckle
cube(-6, 6, -3, 6, 6, 3, BROWN);
block(0, 6, 4, DARK);

// ---- ARMS ----
cube(-9, 11, -2, -7, 15, 2, TAN);    // left upper sleeve
cube(-9, 6,  -2, -7, 10, 2, GREEN);  // left forearm/hand
cube( 7, 11, -2,  9, 15, 2, TAN);    // right upper sleeve
cube( 7, 6,  -2,  9, 10, 2, GREEN);  // right forearm/hand
// knuckle bumps
block(-8, 6, 3, GREEN); block(8, 6, 3, GREEN);

// ---- NECK ----
cube(-3, 16, -2, 3, 17, 2, GREEN);

// ---- HEAD (rounded green block) ----
cube(-6, 17, -4, 6, 27, 4, GREEN);
// trim top corners for roundness
cube(-6, 26, -4, -5, 27, -3, AIR);
cube( 5, 26, -4,  6, 27, -3, AIR);
cube(-6, 26,  3, -5, 27,  4, AIR);
cube( 5, 26,  3,  6, 27,  4, AIR);
block(-6, 27, -4, AIR); block(6, 27, -4, AIR);
block(-6, 27, 4, AIR);  block(6, 27, 4, AIR);

// heavy brow ridge
cube(-5, 24, 4, 5, 24, 4, GREEN);
cube(-5, 25, 5, 5, 25, 5, GREEN);
cube(-5, 24, 5, 5, 24, 5, GREEN);

// ---- EYES ----
cube(-4, 22, 4, -2, 23, 5, WHITE);   // left white
cube( 2, 22, 4,  4, 23, 5, WHITE);   // right white
block(-3, 22, 5, DARK);              // left pupil
block( 3, 22, 5, DARK);              // right pupil

// ---- NOSE (bulbous) ----
cube(-1, 20, 4, 1, 22, 5, GREEN);
cube(-1, 21, 5, 1, 21, 5, GREEN);
block(0, 21, 6, GREEN);              // tip
block(-1, 20, 5, DARK); block(1, 20, 5, DARK); // nostrils

// ---- MOUTH (wide grin) ----
cube(-3, 18, 4, 3, 18, 4, BROWN);
block(-4, 19, 4, BROWN); block(4, 19, 4, BROWN);  // upturned corners
block(-4, 18, 4, BROWN); block(4, 18, 4, BROWN);

// ---- TRUMPET EARS ----
function ear(sx) {
  block(sx*7, 22, -1, GREEN); block(sx*7, 23, -1, GREEN); block(sx*7, 24, -1, GREEN);
  block(sx*7, 22,  1, GREEN); block(sx*7, 23,  1, GREEN); block(sx*7, 24,  1, GREEN);
  block(sx*7, 22,  0, GREEN); block(sx*7, 23,  0, GREEN); block(sx*7, 24,  0, GREEN);
  cube(sx*8, 22, -2, sx*8, 24, 2, GREEN);       // mid
  cube(sx*9, 21, -2, sx*9, 25, 2, GREEN);       // flared tip
  cube(sx*9, 22, -1, sx*9, 24, 1, AIR);         // trumpet hole
}
ear(-1);  // left
ear( 1);  // right

// ================= SWAMP PROPS =================

// ---- "Beware Ogre" signpost ----
cube(12, 0, 8, 12, 5, 8, BROWN);        // post
cube( 9, 4, 8, 14, 6, 8, TAN);          // board
// scrawled lettering
[[10,5],[11,5],[13,5],[10,4],[12,4],[13,4]].forEach(([x,y]) => block(x, y, 8, DARK));

// ---- mushrooms ----
cube(-11, 0, 6, -11, 2, 6, TAN);   sphere(-11, 3, 6, 2, RED);
block(10, 0, -6, TAN);             sphere(10, 2, -6, 2, RED);
cube(-9, 0, -7, -9, 1, -7, TAN);   sphere(-9, 2, -7, 1, RED);

// ---- reeds / cattails ----
[[-8,7],[8,9],[-13,2],[13,3]].forEach(([x,z]) => {
  line(x, 0, z, x, 4, z, GREEN);
  block(x, 5, z, BROWN);   // cattail head
});

// ---- a couple of lily pads on the mud ----
disk(-6, 0, 9, 2, GREEN);
disk(7, 0, 10, 2, GREEN);