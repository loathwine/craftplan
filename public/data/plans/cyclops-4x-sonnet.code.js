// cyclops-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ==== A CYCLOPS ====
// Facing north (-Z) toward camera. Body depth runs from chest (z=-4, front)
// back to spine (z=3, rear). Right arm (viewer's right, +X) raised overhead
// gripping a club; left arm hangs in a clenched fist.

// ---- FEET ----
cube(-5, 0, -5, -2, 1, 1, DIRT);   // left foot
cube(2, 0, -5, 5, 1, 1, DIRT);     // right foot
line(-5, 1, -5, -2, 1, -5, STONE); // left toenails
line(2, 1, -5, 5, 1, -5, STONE);   // right toenails
block(-4, 0, -5, AIR); block(-3, 0, -5, AIR); // toe gaps (free)
block(3, 0, -5, AIR); block(4, 0, -5, AIR);

// ---- LEGS ----
cube(-5, 1, -3, -2, 9, 0, DIRT);
cube(2, 1, -3, 5, 9, 0, DIRT);
line(-5, 5, -3, -2, 5, -3, COBBLE); // knee scar band
line(2, 5, -3, 5, 5, -3, COBBLE);
line(-5, 5, 0, -2, 5, 0, COBBLE);
line(2, 5, 0, 5, 5, 0, COBBLE);

// ---- HIPS / LOINCLOTH ----
cube(-6, 9, -3, 6, 11, 3, DIRT);
cube(-6, 9, -3, 6, 10, 3, BRICK);   // loincloth wrap
line(-6, 10, -4, 6, 10, -4, BRICK); // cloth hem lip at front

// ---- TORSO ----
cube(-5, 11, -3, 5, 12, 3, DIRT);           // waist
cube(-6, 12, -3, 6, 16, 3, DIRT);           // midsection
cube(-6, 16, -4, 6, 18, 3, DIRT);           // chest (bulges forward)
cube(-8, 18, -3, 8, 19, 3, DIRT);           // shoulders
line(-5, 15, -4, 5, 15, -4, COBBLE);        // ab ridge
line(-5, 13, -4, 5, 13, -4, COBBLE);        // ab ridge
block(0, 13, -4, COBBLE);                   // navel
line(-6, 17, -3, -6, 12, 3, COBBLE);        // side scar (left flank)

// ---- NECK ----
cube(-2, 19, -2, 2, 20, 1, DIRT);

// ---- LEFT ARM (hanging fist) ----
cube(-9, 10, -2, -7, 18, 1, DIRT);
cube(-10, 8, -2, -7, 10, 1, DIRT);   // clenched fist
line(-10, 9, -1, -7, 9, -1, COBBLE); // knuckle line

// ---- RIGHT ARM (raised, holding club) ----
cube(7, 17, -1, 9, 21, 1, DIRT);     // upper arm
cube(7, 21, -3, 9, 25, -1, DIRT);    // forearm reaching up/forward
cube(6, 25, -4, 10, 27, -2, DIRT);   // gripping hand

// ---- CLUB ----
cylinder(8, 27, -3, 1, 4, OAK_LOG);          // handle
cube(6, 30, -5, 10, 32, -1, OAK_LOG);        // club head block
block(5, 31, -3, STONE); block(11, 31, -3, STONE);  // side spikes
block(8, 33, -3, STONE); block(8, 30, -6, STONE);   // top/front spikes
block(8, 30, 0, STONE); block(6, 29, -5, STONE);
block(10, 29, -1, STONE);

// ---- HEAD ----
sphere(0, 25, -1, 4, DIRT);
cube(-4, 26, -4, 4, 27, -3, COBBLE);   // heavy brow ridge
sphere(0, 25, -4, 2, AIR);             // carve eye socket
sphere(0, 25, -5, 2, SNOW);            // eyeball white
sphere(0, 25, -6, 1, STONE);           // pupil, forward-most point
line(-2, 21, -4, 2, 21, -4, COBBLE);   // grim mouth slit
block(-1, 21, -5, STONE); block(1, 21, -5, STONE); // fangs
sphere(0, 29, 0, 2, LEAVES);           // matted moss/hair on scalp back
block(-4, 24, -1, STONE); block(4, 24, -1, STONE); // small horn stubs (sides)
block(-4, 25, -1, STONE); block(4, 25, -1, STONE);

// ---- SCENE DETAIL: broken cage the cyclops smashed out of ----
line(-14, 1, 4, -14, 7, 4, OAK_LOG);
line(-11, 1, 5, -11, 4, 5, OAK_LOG);   // snapped short post
line(-14, 1, 7, -8, 1, 7, PLANKS);     // fallen cage floor plank
block(-13, 2, 7, PLANKS); block(-12, 2, 7, PLANKS);
line(10, 1, 4, 10, 6, 4, OAK_LOG);
line(13, 1, 5, 13, 3, 5, OAK_LOG);     // snapped short post

// ---- SCENE DETAIL: scattered boulders ----
sphere(-9, 1, 2, 1, COBBLE);
sphere(9, 1, 3, 1, COBBLE);
sphere(-7, 1, 5, 1, STONE);
sphere(6, 1, 6, 1, STONE);
```
