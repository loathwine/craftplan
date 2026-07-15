// wendigo-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// A wendigo: gaunt, antlered horror looming out of the treeline, facing north (-Z).

// ---------- LEGS (digitigrade, bent like a starved stag) ----------
function leg(sign) {
  const hipX = sign * 3;
  // thigh leans back
  cube(hipX - sign * 2, 8, 1, hipX, 11, 3, STONE);
  // shin bends forward to the hoof
  cube(hipX - sign * 2, 0, -2, hipX, 8, 0, STONE);
  // hoof
  cube(hipX - sign * 2, 0, -3, hipX, 1, -2, COBBLE);
  // exposed shin bone (thin, in front of shin mass)
  line(hipX - sign, 1, -1, hipX - sign, 7, 1, STONE);
}
leg(-1);
leg(1);

// ---------- PELVIS / HIP SPURS ----------
cube(-4, 11, 0, 4, 13, 2, STONE);
cube(-5, 11, 0, -4, 12, 1, STONE); // hip bone spur, left
cube(4, 11, 0, 5, 12, 1, STONE);   // hip bone spur, right

// ---------- WAIST / RIBCAGE ----------
cube(-2, 13, 0, 2, 15, 2, STONE);                 // narrow starved waist
hollowCube(-3, 15, -1, 3, 19, 2, STONE);           // ribcage wireframe
line(0, 15, -1, 0, 19, -1, STONE);                // sternum
line(0, 11, 2, 0, 19, 2, STONE);                  // lower spine (back)

// individual curved ribs
for (const y of [16, 17, 18]) {
  line(-3, y, 0, -1, y, -1, STONE);
  line(1, y, -1, 3, y, 0, STONE);
}

// ---------- SHOULDERS ----------
cube(-4, 18, 0, 4, 19, 2, STONE);
cube(-5, 19, 1, -4, 20, 2, STONE); // shoulder blade spur, left
cube(4, 19, 1, 5, 20, 2, STONE);   // shoulder blade spur, right

// tattered fur/cloak remnants clinging to back and shoulders
const tatters = [
  [-3, 17, 2], [3, 16, 2], [-2, 14, 2], [2, 13, 1], [-4, 19, 1],
  [4, 18, 1], [-1, 12, 2], [1, 20, 2], [-3, 20, 1], [3, 14, 2],
];
for (const [x, y, z] of tatters) block(x, y, z, COBBLE);

// ---------- ARMS (long, dangling past the knees, clawing forward) ----------
function arm(sign) {
  const sx = sign * 4;
  cube(sx - 1, 10, -1, sx + 1, 18, 1, STONE);  // upper arm
  cube(sx - 1, 2, -3, sx + 1, 10, -1, STONE);  // forearm reaching forward
  // clawed fingers splaying toward the viewer
  line(sx - 1, 2, -3, sx - 2, 0, -5, STONE);
  line(sx, 2, -3, sx, 0, -6, STONE);
  line(sx + 1, 2, -3, sx + 2, 0, -5, STONE);
}
arm(-1);
arm(1);

// ---------- NECK ----------
cube(-1, 19, 0, 1, 21, 2, STONE);
cube(-1, 21, -1, 1, 23, 1, STONE);
cube(-1, 23, -2, 1, 25, 0, STONE);

// ---------- SKULL ----------
sphere(0, 26, -1, 2, STONE);               // cranium
cube(-1, 25, -5, 1, 26, -1, STONE);        // elongated snout
cube(-1, 24, -5, 1, 24, -2, STONE);        // lower jaw
line(-1, 24, -5, -1, 25, -5, COBBLE);      // jaw shadow line
line(1, 24, -5, 1, 25, -5, COBBLE);
block(-1, 26, -3, GLASS);                  // glowing eye, left
block(1, 26, -3, GLASS);                   // glowing eye, right
block(0, 25, -6, STONE);                   // nose tip

// ---------- ANTLERS (asymmetric, gnarled) ----------
// left antler - smaller, twisted
line(-1, 28, -1, -5, 33, -4, OAK_LOG);
line(-3, 30, -2, -6, 32, -7, OAK_LOG);
line(-4, 31, -3, -2, 33, -6, OAK_LOG);

// right antler - larger, more branched
line(1, 28, -1, 6, 33, -3, OAK_LOG);
line(3, 30, -2, 7, 33, -6, OAK_LOG);
line(4, 29, -1, 8, 31, -4, OAK_LOG);
line(5, 31, -2, 3, 33, -9, OAK_LOG);
line(6, 32, -3, 9, 33, -2, OAK_LOG);

// ---------- CLEARING / GROUND DETAIL ----------
disk(0, -1, -1, 6, SNOW); // frost dusting the ground beneath it

// scattered bones around the base
line(-7, 0, 4, -9, 0, 6, STONE);
line(6, 0, 3, 9, 0, 1, STONE);
cube(2, 0, 6, 3, 0, 6, STONE);
sphere(5, 0, -6, 1, STONE);
sphere(-6, 0, -5, 1, STONE);
line(-2, 0, 7, 1, 0, 8, STONE);

// dead bare trees flanking the scene, off to the sides
function deadTree(x, z, h) {
  cylinder(x, 0, z, 1, h, OAK_LOG);
  line(x, h, z, x - 2, h + 2, z - 1, OAK_LOG);
  line(x, h, z, x + 2, h + 1, z + 1, OAK_LOG);
  line(x, h - 1, z, x + 1, h + 2, z - 2, OAK_LOG);
}
deadTree(-15, -9, 6);
deadTree(16, 7, 5);
```
