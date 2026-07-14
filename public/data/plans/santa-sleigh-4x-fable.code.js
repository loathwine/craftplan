// santa-sleigh-4x-fable — prompt:
// Santa's sleigh pulled by reindeer...

const AIRB = AIR;

// ---------- helpers ----------
function reindeer(cx, y, zf, lead, gait) {
  // body 3x3x6, facing -Z (north, toward camera)
  cube(cx - 1, y, zf, cx + 1, y + 2, zf + 5, OAK_LOG);
  // round the rump
  block(cx - 1, y + 2, zf + 5, AIRB);
  block(cx + 1, y + 2, zf + 5, AIRB);
  // white chest patch (camera-facing)
  cube(cx - 1, y, zf, cx + 1, y + 1, zf, SNOW);
  // neck rising forward
  cube(cx, y + 2, zf - 1, cx, y + 4, zf, OAK_LOG);
  // head
  cube(cx - 1, y + 4, zf - 2, cx + 1, y + 5, zf, OAK_LOG);
  // eyes on the north face
  block(cx - 1, y + 5, zf - 2, SNOW);
  block(cx + 1, y + 5, zf - 2, SNOW);
  // snout + nose
  block(cx, y + 4, zf - 3, OAK_LOG);
  if (lead) {
    block(cx, y + 4, zf - 4, BRICK); // Rudolph's red nose
  } else {
    block(cx, y + 3, zf - 3, STONE); // dark muzzle shadow
  }
  // antlers (tan planks)
  line(cx - 1, y + 6, zf - 1, cx - 2, y + 8, zf - 1, PLANKS);
  line(cx + 1, y + 6, zf - 1, cx + 2, y + 8, zf - 1, PLANKS);
  block(cx - 2, y + 9, zf - 2, PLANKS);
  block(cx + 2, y + 9, zf - 2, PLANKS);
  block(cx - 3, y + 8, zf, PLANKS);
  block(cx + 3, y + 8, zf, PLANKS);
  if (lead) { // bigger rack for Rudolph
    block(cx - 3, y + 9, zf - 1, PLANKS);
    block(cx + 3, y + 9, zf - 1, PLANKS);
  }
  // galloping legs, alternating gait per reindeer
  if (!gait) {
    line(cx - 1, y - 1, zf + 1, cx - 1, y - 3, zf - 1, OAK_LOG);
    line(cx + 1, y - 1, zf + 1, cx + 1, y - 3, zf - 1, OAK_LOG);
    line(cx - 1, y - 1, zf + 4, cx - 1, y - 3, zf + 6, OAK_LOG);
    line(cx + 1, y - 1, zf + 4, cx + 1, y - 3, zf + 6, OAK_LOG);
    block(cx - 1, y - 3, zf - 1, STONE);
    block(cx + 1, y - 3, zf - 1, STONE);
    block(cx - 1, y - 3, zf + 6, STONE);
    block(cx + 1, y - 3, zf + 6, STONE);
  } else {
    line(cx - 1, y - 1, zf + 1, cx - 1, y - 2, zf, OAK_LOG);
    line(cx + 1, y - 1, zf + 1, cx + 1, y - 2, zf, OAK_LOG);
    line(cx - 1, y - 1, zf + 4, cx - 1, y - 2, zf + 3, OAK_LOG);
    line(cx + 1, y - 1, zf + 4, cx + 1, y - 2, zf + 3, OAK_LOG);
    block(cx - 1, y - 2, zf, STONE);
    block(cx + 1, y - 2, zf, STONE);
    block(cx - 1, y - 2, zf + 3, STONE);
    block(cx + 1, y - 2, zf + 3, STONE);
  }
  // tail
  block(cx, y + 2, zf + 6, SNOW);
  // red harness strap over the back + gold bells
  cube(cx - 1, y + 2, zf + 2, cx + 1, y + 2, zf + 2, BRICK);
  block(cx - 2, y + 1, zf + 2, SAND);
  block(cx + 2, y + 1, zf + 2, SAND);
}

// ---------- the team (flying, ascending toward camera) ----------
const team = [
  [-3, 8, 3, 0], [3, 8, 3, 1],
  [-3, 10, -3, 1], [3, 10, -3, 0],
  [-3, 12, -9, 0], [3, 12, -9, 1],
  [-3, 14, -15, 1], [3, 14, -15, 0],
];
for (const [cx, y, zf, g] of team) reindeer(cx, y, zf, false, g);
// Rudolph out front, center, highest
reindeer(0, 15, -18, true, 0);

// ---------- the sleigh (z 9..18, hull red, gold runners) ----------
// runners
line(-3, 6, 9, -3, 6, 18, SAND);
line(3, 6, 9, 3, 6, 18, SAND);
line(-3, 6, 9, -3, 9, 6, SAND);
line(3, 6, 9, 3, 9, 6, SAND);
block(-3, 10, 7, SAND);
block(3, 10, 7, SAND);
block(-3, 7, 19, SAND);
block(3, 7, 19, SAND);
// struts
for (const sz of [10, 13, 17]) {
  block(-3, 7, sz, BRICK);
  block(3, 7, sz, BRICK);
}
// hull
cube(-3, 8, 9, 3, 8, 18, BRICK);                 // floor
cube(-3, 9, 9, -3, 10, 18, BRICK);               // left wall
cube(3, 9, 9, 3, 10, 18, BRICK);                 // right wall
cube(-3, 11, 14, -3, 11, 18, BRICK);             // rear rise L
cube(3, 11, 14, 3, 11, 18, BRICK);               // rear rise R
cube(-3, 9, 18, 3, 12, 18, BRICK);               // tall back
cube(-3, 9, 9, 3, 10, 9, BRICK);                 // dash
cube(-3, 11, 8, 3, 11, 8, BRICK);                // front swoop
cube(-3, 12, 7, 3, 12, 7, SAND);                 // gold curl tip
// gold trim
cube(-3, 11, 9, -3, 11, 13, SAND);
cube(3, 11, 9, 3, 11, 13, SAND);
cube(-3, 12, 14, -3, 12, 18, SAND);
cube(3, 12, 14, 3, 12, 18, SAND);
cube(-3, 13, 18, 3, 13, 18, SAND);
// seat
cube(-2, 9, 13, 2, 10, 14, PLANKS);

// ---------- Santa ----------
cube(-1, 9, 11, 1, 9, 11, STONE);      // boots
cube(-1, 10, 11, 1, 10, 12, BRICK);    // legs
cube(-1, 11, 13, 1, 13, 14, BRICK);    // torso
cube(-1, 11, 13, 1, 11, 14, SNOW);     // white coat hem
cube(-1, 12, 13, 1, 12, 13, STONE);    // belt
line(-2, 13, 13, -2, 11, 10, BRICK);   // arms holding reins
line(2, 13, 13, 2, 11, 10, BRICK);
block(-2, 11, 10, SNOW);               // mittens
block(2, 11, 10, SNOW);
cube(-1, 14, 13, 1, 15, 14, PLANKS);   // face
cube(-1, 14, 12, 1, 14, 12, SNOW);     // beard
block(0, 13, 12, SNOW);
cube(-1, 16, 13, 1, 16, 14, SNOW);     // hat brim
cube(0, 17, 13, 0, 17, 14, BRICK);     // hat
block(0, 18, 15, SNOW);                // pompom trailing back

// ---------- sack of presents ----------
cube(-2, 9, 15, -1, 10, 16, LEAVES);
block(-2, 11, 15, SAND);
cube(1, 9, 15, 2, 10, 16, GLASS);
block(1, 11, 16, BRICK);
cube(-1, 9, 17, 0, 10, 17, BRICK);
sphere(0, 11, 16, 1, PLANKS);          // bulging sack

// ---------- reins (red), hand -> each rank -> Rudolph ----------
line(-2, 11, 9, -3, 11, 5, BRICK);
line(-3, 11, 5, -3, 13, -1, BRICK);
line(-3, 13, -1, -3, 15, -7, BRICK);
line(-3, 15, -7, -3, 17, -13, BRICK);
line(-3, 17, -13, -1, 18, -16, BRICK);
line(2, 11, 9, 3, 11, 5, BRICK);
line(3, 11, 5, 3, 13, -1, BRICK);
line(3, 13, -1, 3, 15, -7, BRICK);
line(3, 15, -7, 3, 17, -13, BRICK);
line(3, 17, -13, 1, 18, -16, BRICK);

// ---------- magic sparkle trail off the runners ----------
const sparks = [
  [0, 7, 19, ICE], [1, 6, 20, SNOW], [-1, 5, 20, ICE], [0, 4, 21, ICE],
  [1, 3, 21, SNOW], [-1, 2, 22, ICE], [0, 1, 22, SNOW],
  [-4, 4, 6, ICE], [4, 5, 5, SNOW], [-5, 6, 0, ICE], [5, 7, -2, SNOW],
  [-4, 8, -6, ICE], [4, 9, -8, ICE], [-5, 10, -12, SNOW], [5, 11, -13, ICE],
  [-2, 12, -17, ICE], [2, 13, -19, SNOW], [0, 12, -21, ICE],
];
for (const [sx, sy, sz, sb] of sparks) block(sx, sy, sz, sb);

// ---------- moon backdrop (high south-east) ----------
sphere(17, 26, 8, 5, SNOW);

// ---------- snowy ground scene below ----------
disk(0, -1, 14, 8, SNOW);
disk(0, 0, 14, 6, SNOW);

// snowman watching the sky
sphere(7, 1, 12, 2, SNOW);
sphere(7, 4, 12, 1, SNOW);
sphere(7, 6, 12, 1, SNOW);
block(7, 6, 11, BRICK);                // carrot-ish nose
block(7, 4, 11, STONE);                // button
line(5, 4, 12, 4, 6, 12, OAK_LOG);     // twig arms
line(9, 4, 12, 10, 6, 12, OAK_LOG);

// dropped present on the snow
cube(-4, 1, 16, -2, 2, 18, BRICK);
cube(-3, 1, 16, -3, 2, 18, SAND);
cube(-4, 1, 17, -2, 2, 17, SAND);
block(-3, 3, 17, SAND);

// candy cane stuck in the drift
for (let cy = 1; cy <= 6; cy++) block(5, cy, 16, cy % 2 ? BRICK : SNOW);
block(5, 7, 16, BRICK);
block(4, 7, 16, SNOW);
block(3, 7, 16, BRICK);
block(3, 6, 16, SNOW);

// snow-dusted spruce
cube(-11, 0, 8, -11, 2, 8, OAK_LOG);
disk(-11, 2, 8, 3, LEAVES);
disk(-11, 3, 8, 2, LEAVES);
disk(-11, 4, 8, 2, LEAVES);
disk(-11, 5, 8, 1, LEAVES);
disk(-11, 6, 8, 1, LEAVES);
block(-11, 7, 8, LEAVES);
block(-11, 8, 8, SNOW);
block(-14, 3, 8, SNOW);
block(-11, 3, 11, SNOW);
block(-11, 3, 5, SNOW);
block(-8, 3, 8, SNOW);
block(-13, 5, 8, SNOW);
block(-11, 5, 10, SNOW);