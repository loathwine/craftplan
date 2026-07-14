// trex-jeep-4x-fable — prompt:
// a T-Rex chasing a jeep...

const G = LEAVES; // t-rex hide

// ---- clear a chase corridor through the trees (AIR is free) ----
cube(-22, 0, -2, 22, 8, 10, AIR);

// ---- dirt road along the chase, with tire tracks ----
cube(-22, 0, -1, 22, 0, 6, DIRT);
line(-9, 0, 0, 22, 0, 0, SAND);   // tire tracks trailing behind the jeep
line(-9, 0, 5, 22, 0, 5, SAND);

// t-rex footprints stamped into the road
function print(px, pz) {
  cube(px, 0, pz, px + 1, 0, pz + 1, STONE);      // heel
  const toes = [[-1,-1],[-2,-1],[-1,2],[-2,2],[-2,0],[-3,0],[-2,1],[-3,1]];
  for (const [dx, dz] of toes) block(px + dx, 0, pz + dz, STONE);
}
print(16, 1);
print(20, 4);

// ---- dust clouds (placed first so the characters overwrite overlaps) ----
sphere(-7, 1, 1, 1.4, SNOW);
sphere(-5, 2, 4, 1.8, SNOW);
sphere(-3, 2, 2, 2.2, SNOW);
sphere(0, 2, 5, 1.8, SNOW);
sphere(2, 1, 0, 1.4, SNOW);
sphere(11, 1, 0, 1.4, SNOW);
sphere(16, 1, 7, 1.5, SNOW);
sphere(19, 2, 7, 2, SNOW);
sphere(21, 1, 4, 1.5, SNOW);

// ---- the fleeing jeep (racing west / -X) ----
// wheels
cube(-16, 1, 0, -15, 2, 0, COBBLE);
cube(-11, 1, 0, -10, 2, 0, COBBLE);
cube(-16, 1, 5, -15, 2, 5, COBBLE);
cube(-11, 1, 5, -10, 2, 5, COBBLE);
// chassis + red body tub
cube(-16, 2, 1, -10, 2, 4, COBBLE);
cube(-17, 3, 1, -9, 4, 4, BRICK);
cube(-13, 4, 2, -10, 4, 3, AIR);            // open cab
cube(-18, 3, 1, -18, 3, 4, COBBLE);         // front bumper
block(-17, 4, 1, SNOW);                     // headlights
block(-17, 4, 4, SNOW);
cube(-17, 3, 2, -17, 3, 3, COBBLE);         // grille
cube(-14, 5, 1, -14, 6, 4, GLASS);          // windshield
block(-13, 5, 2, STONE);                    // steering wheel
// roll bar
block(-10, 5, 1, OAK_LOG);
block(-10, 5, 4, OAK_LOG);
cube(-10, 6, 1, -10, 6, 4, OAK_LOG);
// driver + panicking passenger
cube(-12, 4, 2, -12, 5, 2, PLANKS);
block(-12, 6, 2, SAND);
cube(-11, 4, 3, -11, 5, 3, PLANKS);
block(-11, 6, 3, SAND);
block(-11, 6, 4, SAND);                     // arm thrown up
// spare tire + antenna
cube(-8, 3, 2, -8, 4, 3, COBBLE);
block(-9, 5, 1, STONE);
block(-9, 6, 1, STONE);

// ---- the T-REX (lunging west, jaws over the jeep's tail) ----
// legs — north leg mid-stride forward, south leg pushing off behind
cube(8, 6, 0, 11, 10, 2, G);                // front thigh
cube(7, 3, 0, 9, 6, 2, G);                  // front shin
cube(5, 1, 0, 9, 2, 2, G);                  // front foot
block(4, 1, 0, SNOW); block(4, 1, 1, SNOW); block(4, 1, 2, SNOW); block(3, 1, 1, SNOW); // claws
cube(10, 6, 4, 13, 10, 6, G);               // back thigh
cube(12, 3, 4, 14, 6, 6, G);                // back shin
cube(14, 1, 4, 18, 2, 6, G);                // trailing foot
block(13, 1, 4, SNOW); block(13, 1, 5, SNOW); block(13, 1, 6, SNOW); block(12, 1, 5, SNOW);

// body mass
sphere(11, 10, 3, 4, G);                    // hips
sphere(7, 10, 3, 3.5, G);                   // torso
sphere(4, 11, 3, 3, G);                     // chest
cube(0, 12, 2, 3, 15, 4, G);                // neck
cube(6, 7, 2, 13, 7, 4, SAND);              // pale belly
cube(6, 8, 2, 13, 8, 4, SAND);

// tail whipping up behind
sphere(14, 10, 3, 3, G);
sphere(17, 11, 3, 2.4, G);
sphere(19, 12, 3, 1.8, G);
sphere(21, 13, 3, 1.3, G);
block(22, 14, 3, G);

// tiny arms
block(1, 10, 1, G); block(1, 9, 1, G); block(0, 9, 1, SNOW);
block(1, 10, 5, G); block(1, 9, 5, G); block(0, 9, 5, SNOW);

// head — skull, snout, roaring open jaw
cube(-4, 14, 1, 1, 17, 5, G);               // skull
cube(-8, 14, 2, -5, 16, 4, G);              // snout / upper jaw
block(-8, 16, 2, OAK_LOG);                  // nostrils
block(-8, 16, 4, OAK_LOG);
cube(-4, 13, 2, 0, 13, 4, BRICK);           // red roof of mouth
cube(-1, 13, 1, 0, 13, 1, G);               // cheeks
cube(-1, 13, 5, 0, 13, 5, G);
// lower jaw dropped wide
cube(-1, 9, 1, 0, 12, 5, G);                // hinge
cube(-6, 8, 2, -1, 9, 4, G);                // jaw
cube(-8, 7, 2, -6, 8, 4, G);                // jaw tip
cube(-5, 9, 3, -1, 9, 3, BRICK);            // tongue
// teeth
for (let tx = -8; tx <= -4; tx += 2) { block(tx, 13, 2, SNOW); block(tx, 13, 4, SNOW); }
block(-2, 13, 2, SNOW); block(-2, 13, 4, SNOW);
block(-5, 10, 2, SNOW); block(-5, 10, 4, SNOW);
block(-3, 10, 2, SNOW); block(-3, 10, 4, SNOW);
block(-8, 9, 2, SNOW);  block(-8, 9, 4, SNOW);
// eyes + angry brow (north face is the camera side; mirrored south)
block(-2, 16, 1, BRICK); block(-1, 16, 1, SNOW);
block(-2, 16, 5, BRICK); block(-1, 16, 5, SNOW);
block(-3, 17, 1, OAK_LOG); block(-2, 17, 1, OAK_LOG); block(-1, 17, 1, OAK_LOG);
block(-3, 17, 5, OAK_LOG); block(-2, 17, 5, OAK_LOG); block(-1, 17, 5, OAK_LOG);

// spine ridge
const ridge = [[5,14],[7,14],[9,15],[11,15],[13,14],[15,14],[17,14],[19,14],[21,15]];
for (const [rx, ry] of ridge) block(rx, ry, 3, OAK_LOG);

// ---- scenery: smashed tree in the t-rex's wake, boulders, brush ----
cube(19, 1, 9, 19, 3, 9, OAK_LOG);          // snapped stump
block(19, 4, 9, OAK_LOG);
line(18, 1, 9, 13, 1, 8, OAK_LOG);          // fallen trunk
sphere(12, 1, 8, 1.7, LEAVES);              // its canopy
sphere(-21, 1, -2, 1.6, STONE);             // boulders
sphere(10, 1, 10, 1.8, STONE);
sphere(-9, 2, 9, 2, LEAVES);                // roadside brush
sphere(3, 1, 10, 1.7, LEAVES);

// ---- circling birds fleeing the commotion ----
line(-16, 27, 5, -13, 25, 5, STONE);
line(-13, 25, 5, -10, 27, 5, STONE);
line(-2, 29, 8, 0, 28, 8, STONE);
line(0, 28, 8, 2, 29, 8, STONE);