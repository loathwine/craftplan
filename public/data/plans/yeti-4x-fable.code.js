// yeti-4x-fable — prompt:
// a yeti...

const SNOWY = SNOW;

// deterministic pseudo-random for fur/scatter
function hash(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

// ---- clear trees/brush from the build area (AIR is free) ----
cube(-14, 1, -14, 14, 13, 14, AIR);

// ---- snowy ground ----
disk(0, 0, 0, 13, SNOWY);
// ragged drift edge
for (let i = 0; i < 72; i++) {
  const a = i * Math.PI / 36;
  const r = 13 + hash(i, 1, 2) * 3;
  const x = Math.round(Math.cos(a) * r);
  const z = Math.round(Math.sin(a) * r);
  if (Math.abs(x) <= 22 && Math.abs(z) <= 22) {
    if (hash(i, 4, 9) > 0.35) block(x, 0, z, SNOWY);
    if (hash(i, 8, 5) > 0.8) block(x, 1, z, SNOWY);
  }
}

// frozen pond
disk(7, 0, 10, 2, ICE);

// footprint trail stomped into the snow (carved depressions)
cube(2, 0, 8, 3, 0, 9, AIR);
cube(-4, 0, 10, -3, 0, 11, AIR);
cube(2, 0, 12, 3, 0, 13, AIR);
block(-9, 0, 9, AIR);   // baby prints
block(-10, 0, 11, AIR);

// ---- ice stalagmites ----
function spike(cx, cz, h) {
  disk(cx, 0, cz, 2, SNOWY);
  disk(cx, 1, cz, 2, ICE);
  cylinder(cx, 2, cz, 1, h, ICE);
  block(cx, 2 + h, cz, ICE);
}
spike(-12, -7, 5);
spike(-9, -11, 3);
spike(13, 6, 7);
spike(11, 11, 4);
spike(-7, 13, 4);

// ---- snow-capped boulders ----
sphere(-13, 1, -4, 2, COBBLE);
disk(-13, 3, -4, 1, SNOWY);
sphere(15, 0, -6, 2, STONE);
disk(15, 2, -6, 1, SNOWY);

// ---- trampled tree (snapped stump + fallen log) ----
cylinder(11, 1, -9, 1, 2, OAK_LOG);
block(11, 3, -9, OAK_LOG);
line(10, 1, -8, 5, 1, -4, OAK_LOG);
line(9, 2, -7, 7, 2, -6, OAK_LOG);
sphere(4, 2, -3, 2, LEAVES);

// ================= THE YETI =================
// feet (toes to the south, +Z)
cube(-6, 1, -2, -1, 2, 3, SNOWY);
cube(1, 1, -2, 6, 2, 3, SNOWY);
// ice claws on toes
block(-2, 1, 4, ICE); block(-4, 1, 4, ICE); block(-6, 1, 4, ICE);
block(2, 1, 4, ICE);  block(4, 1, 4, ICE);  block(6, 1, 4, ICE);

// legs
cube(-5, 3, -2, -2, 9, 2, SNOWY);
cube(2, 3, -2, 5, 9, 2, SNOWY);

// hips
cube(-6, 10, -2, 6, 11, 2, SNOWY);

// torso
cube(-6, 12, -3, 6, 18, 3, SNOWY);
// gray chest/belly patch
cube(-3, 12, 3, 3, 17, 3, STONE);
// old red claw-scars raked across the chest
line(0, 16, 3, 2, 13, 3, BRICK);
line(-2, 16, 3, 0, 13, 3, BRICK);

// shoulders + hunched back hump
cube(-8, 19, -3, 8, 21, 3, SNOWY);
cube(-4, 22, -3, 4, 22, -1, SNOWY);

// ---- left arm: long, knuckles dragging near the ground ----
cube(-10, 8, -1, -8, 21, 1, SNOWY);
cube(-11, 4, -2, -7, 7, 2, SNOWY);      // huge hand
block(-10, 3, 2, ICE); block(-9, 3, 2, ICE); block(-8, 3, 2, ICE); // claws

// ---- right arm: raised overhead, gripping an uprooted tree ----
cube(8, 19, -1, 10, 27, 1, SNOWY);      // upper arm
cube(8, 26, -1, 10, 30, 1, SNOWY);      // forearm
// the uprooted tree, held horizontal above the head
line(9, 31, -5, 9, 31, 9, OAK_LOG);
sphere(9, 31, -6, 1, DIRT);             // ripped-out root ball
block(8, 32, -6, OAK_LOG);
block(10, 30, -6, OAK_LOG);
sphere(9, 30, 9, 3, LEAVES);            // canopy still attached
disk(9, 33, 9, 2, SNOWY);               // snow still on the canopy
// fist wraps around the trunk (placed after, so it grips it)
cube(8, 30, -2, 11, 32, 2, SNOWY);

// ---- head ----
cube(-3, 22, -3, 3, 28, 3, SNOWY);
cube(-2, 23, 3, 2, 27, 3, STONE);       // gray face
// roaring mouth
cube(-2, 23, 3, 2, 24, 3, BRICK);
block(-2, 23, 3, SNOWY); block(0, 23, 3, SNOWY); block(2, 23, 3, SNOWY); // bottom fangs
block(-1, 24, 3, SNOWY); block(1, 24, 3, SNOWY);                          // top fangs
// angry red eyes under a jutting snow brow
block(-2, 26, 3, BRICK); block(2, 26, 3, BRICK);
cube(-3, 27, 4, 3, 27, 4, SNOWY);
block(0, 25, 4, STONE);                 // nose
// sagittal fur crest
line(0, 29, -3, 0, 29, 2, SNOWY);
block(0, 30, -1, SNOWY); block(0, 30, 0, SNOWY);
// cheek tufts
block(-4, 26, 1, SNOWY); block(4, 26, 1, SNOWY);
block(-4, 24, -2, SNOWY); block(4, 24, -2, SNOWY);

// ---- shaggy fur (asymmetric bumps) ----
for (let x = -6; x <= 6; x++)
  for (let y = 12; y <= 21; y++)
    if (hash(x, y, 91) > 0.72) block(x, y, -4, SNOWY);       // back
for (let z = -3; z <= 3; z++)
  for (let y = 12; y <= 18; y++) {
    if (hash(17, y, z) > 0.72) block(7, y, z, SNOWY);        // right side
    if (hash(-17, y, z) > 0.72) block(-7, y, z, SNOWY);      // left side
  }
for (let y = 3; y <= 8; y++) {
  for (let x = -5; x <= -2; x++) if (hash(x, y, 55) > 0.78) block(x, y, 3, SNOWY);
  for (let x = 2; x <= 5; x++)  if (hash(x, y, 55) > 0.78) block(x, y, 3, SNOWY);
}
for (let x = -8; x <= 8; x++)
  for (let z = -3; z <= 3; z++)
    if (Math.abs(x) > 3 && hash(x, 22, z) > 0.75) block(x, 22, z, SNOWY); // shoulder tufts

// ================= BABY YETI =================
// standing beside the parent, one arm reaching up
cube(-11, 1, 4, -10, 2, 5, SNOWY);   // left leg
cube(-8, 1, 4, -7, 2, 5, SNOWY);     // right leg
cube(-11, 3, 4, -7, 7, 6, SNOWY);    // body
cube(-10, 8, 4, -8, 10, 6, SNOWY);   // head
cube(-10, 8, 6, -8, 10, 6, STONE);   // face
block(-10, 9, 6, BRICK); block(-8, 9, 6, BRICK); // eyes
block(-9, 8, 6, BRICK);                          // little mouth
block(-11, 11, 5, SNOWY); block(-7, 11, 5, SNOWY); // ear tufts
cube(-12, 4, 4, -12, 7, 5, SNOWY);   // left arm down
cube(-6, 6, 4, -6, 10, 5, SNOWY);    // right arm reaching up at parent
block(-9, 8, 4, SNOWY);              // fur tuft on back of head