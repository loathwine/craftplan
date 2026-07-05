// cyclops-4x-fable — prompt:
// a cyclops...

// CYCLOPS — one-eyed giant with raised spiked club, boulder in hand,
// smashed hut, campfire, bones, and fleeing villagers.

const SKIN = PLANKS, SKIN2 = SAND, FUR = DIRT, WOOD = OAK_LOG;

// ---- site prep: clear vegetation only where the scene stands ----
cube(-14, 0, -11, 14, 9, 6, AIR);   // giant's zone
cube(5, 0, 4, 18, 6, 14, AIR);      // hut zone

// ---- rocky pedestal (bridges uneven terrain) ----
cube(-8, -2, -6, 8, -1, 2, STONE);
[[-8,0,-6],[8,0,-6],[-8,0,2],[8,0,2],[-6,0,-7],[6,0,3],[9,-1,-2],[-9,-1,-3]]
  .forEach(p => block(p[0], p[1], p[2], COBBLE));
sphere(-13, -1, -6, 2, COBBLE);     // half-buried boulders
sphere(12, -1, 0, 2, STONE);

// ---- legs (feet at y0 on pedestal) ----
function leg(x1, x2, tx1, tx2) {
  cube(x1, 0, -5, x2, 1, 0, SKIN);          // foot
  cube(x1, 0, 1, x2, 0, 1, SKIN2);          // toes
  block(x1 + 1, 0, 1, AIR);                 // toe gap
  cube(x1, 2, -5, x2, 5, -2, SKIN);         // shin
  cube(x1, 2, -5, x2, 3, -2, FUR);          // fur boot wrap
  cube(tx1, 6, -5, tx2, 9, -1, SKIN);       // thigh
  block(x1 + 1, 5, -1, SKIN2);              // knee
  block(x1 + 2, 5, -1, SKIN2);
}
leg(-6, -3, -7, -3);
leg(3, 6, 3, 7);

// ---- fur loincloth + belt ----
cube(-6, 10, -6, 6, 12, -1, FUR);
cube(-6, 12, -6, 6, 12, -1, WOOD);          // belt
block(0, 12, -1, SKIN2);                    // buckle
[-4, -2, 0, 2, 4].forEach(x => block(x, 9, -1, FUR));   // ragged hem front
[-3, -1, 1, 3].forEach(x => block(x, 9, -6, FUR));      // ragged hem back

// ---- torso ----
cube(-5, 13, -5, 5, 15, -2, SKIN);          // waist
cube(-3, 13, -1, 3, 15, -1, SKIN2);         // pot belly
block(0, 14, -1, FUR);                      // navel
cube(-7, 16, -6, 7, 19, -1, SKIN);          // barrel chest
cube(-6, 16, 0, -1, 18, 0, SKIN);           // pec bulges
cube(1, 16, 0, 6, 18, 0, SKIN);
block(-4, 17, 0, FUR); block(4, 17, 0, FUR);
cube(-8, 20, -5, 8, 21, -2, SKIN);          // shoulders
cube(-4, 22, -5, 4, 22, -2, SKIN);          // traps / neck
cube(-2, 18, -6, 2, 30, -6, WOOD);          // shaggy mane down the back

// ---- right arm: raised, holding spiked club ----
sphere(8, 21, -3, 2, SKIN);
cube(8, 21, -4, 10, 24, -2, SKIN);
cube(9, 24, -4, 11, 25, -2, SKIN);
cube(10, 25, -4, 12, 28, -2, SKIN);
cube(10, 25, -4, 12, 26, -2, COBBLE);       // stone bracer
cube(10, 28, -4, 12, 29, -2, SKIN2);        // fist
cylinder(11, 29, -3, 1, 3, WOOD);           // club shaft
sphere(11, 31, -3, 2, WOOD);                // club head (tops out at y33)
block(14, 31, -3, COBBLE);                  // spikes
block(11, 31, 0, COBBLE);
block(11, 31, -6, COBBLE);

// ---- left arm: lowered, gripping a boulder ----
sphere(-8, 21, -3, 2, SKIN);
cube(-10, 17, -4, -8, 21, -2, SKIN);
cube(-10, 14, -4, -8, 17, -1, SKIN);
cube(-10, 13, -3, -8, 15, 1, SKIN);
sphere(-9, 13, 4, 3, STONE);                // the boulder
[[-9,16,4],[-11,12,4],[-7,14,6],[-11,15,3]].forEach(p => block(p[0], p[1], p[2], COBBLE));
cube(-10, 16, 2, -8, 17, 4, SKIN2);         // palm gripping the top
block(-10, 15, 6, SKIN2);                   // fingers over the front
block(-8, 15, 6, SKIN2);

// ---- head ----
cube(-4, 23, -5, 4, 31, -1, SKIN);          // skull
// mouth: carved recess, red gullet, snaggle teeth
cube(-3, 23, -2, 3, 24, -1, AIR);
cube(-3, 23, -3, 3, 24, -3, BRICK);
[-3, -1, 1, 3].forEach(x => block(x, 24, -2, SNOW));
[-2, 0, 2].forEach(x => block(x, 23, -2, SNOW));
cube(-3, 23, -1, -3, 24, -1, SNOW);         // left tusk
cube(3, 23, -1, 3, 24, -1, SNOW);           // right tusk
// nose
cube(-1, 25, 0, 1, 25, 0, SKIN2);
block(0, 24, 0, SKIN2);
// THE EYE — huge, white ring, blue iris, stone pupil
cube(-2, 26, 0, 2, 29, 0, SNOW);
cube(-1, 27, 0, 1, 28, 0, GLASS);
block(0, 27, 0, STONE);
block(0, 28, 0, STONE);
block(-2, 26, 0, BRICK);                    // bloodshot corner
// heavy angry unibrow
cube(-4, 30, 0, 4, 30, 0, WOOD);
block(0, 29, 0, WOOD);                      // scowl dip over the eye
// ears + earring
block(-5, 26, -3, SKIN); block(-5, 27, -3, SKIN);
block(5, 26, -3, SKIN);  block(5, 27, -3, SKIN);
block(5, 25, -3, SKIN2);
// wild hair
cube(-4, 31, -5, 4, 31, -1, WOOD);
[[-3,32,-4],[-1,32,-2],[1,32,-4],[3,32,-3],[0,32,-5],[2,32,-2]].forEach(p => block(p[0], p[1], p[2], WOOD));
block(-5, 29, -2, WOOD);                    // sideburn tufts
block(5, 29, -4, WOOD);

// ---- smashed hut (the cyclops' handiwork) ----
cube(9, -1, 7, 15, -1, 12, PLANKS);         // floor
cube(9, 0, 7, 9, 2, 12, COBBLE);            // west wall, half down
cube(15, 0, 7, 15, 3, 12, COBBLE);          // east wall with punched hole
block(15, 1, 9, AIR); block(15, 2, 9, AIR); block(15, 1, 10, AIR);
cube(9, 0, 12, 15, 2, 12, COBBLE);          // back wall, broken top
block(11, 2, 12, AIR); block(12, 2, 12, AIR);
cube(9, 0, 7, 15, 1, 7, COBBLE);            // front wall rubble
block(11, 0, 7, AIR); block(12, 0, 7, AIR); // doorway gap
cube(10, 0, 7, 10, 3, 7, WOOD);             // door posts still standing
cube(13, 0, 7, 13, 3, 7, WOOD);
cube(9, 4, 10, 15, 4, 12, PLANKS);          // surviving half of the roof
block(10, 4, 10, AIR); block(13, 4, 10, AIR);
[[7,0,8],[8,0,5],[11,0,5],[14,0,4],[6,0,10],[16,0,6]].forEach(p => block(p[0], p[1], p[2], PLANKS));  // debris

// ---- campfire ----
block(-1, 0, 10, WOOD); block(1, 0, 10, WOOD);
block(0, 0, 9, WOOD);   block(0, 0, 11, WOOD);
block(0, 0, 10, BRICK); block(0, 1, 10, BRICK);

// ---- old victim's bones ----
block(-10, 0, 7, SNOW);                     // skull
line(-9, 0, 7, -5, 0, 8, SNOW);             // spine
[[-8,1,7],[-7,1,8],[-6,1,8],[-8,0,6],[-7,0,9],[-6,0,7]].forEach(p => block(p[0], p[1], p[2], SNOW)); // ribs

// ---- fleeing villagers ----
function villager(x, z, shirt) {
  block(x, 0, z, FUR);                      // legs mid-stride
  block(x + 1, 0, z + 1, FUR);
  cube(x, 1, z, x + 1, 2, z, shirt);        // body
  block(x - 1, 2, z, shirt);                // arms flung up in panic
  block(x + 2, 2, z, shirt);
  block(x - 1, 3, z, SKIN2);
  block(x + 2, 3, z, SKIN2);
  cube(x, 3, z, x + 1, 3, z, SKIN2);        // head
}
villager(6, 4, BRICK);
villager(1, 7, GLASS);
villager(-5, 10, LEAVES);