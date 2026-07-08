// spongebob-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ================= SpongeBob SquarePants =================

// ---- Legs & shoes ----
cylinder(-2, 1, 0, 1, 3, SAND);
cube(-3, 3, -1, -1, 3, 1, SNOW);
sphere(-2, 0, -1, 2, COBBLE);
cube(-3, 0, -2, -1, 1, 0, COBBLE);

cylinder(2, 1, 0, 1, 3, SAND);
cube(1, 3, -1, 3, 3, 1, SNOW);
sphere(2, 0, -1, 2, COBBLE);
cube(1, 0, -2, 3, 1, 0, COBBLE);

// ---- Main torso/head cuboid ----
const BX1 = -5, BX2 = 5, BZ1 = -3, BZ2 = 3;

// pants band (brown shorts)
cube(BX1, 4, BZ1, BX2, 6, BZ2, PLANKS);
for (let x = BX1; x <= BX2; x += 2) {
  for (let z = BZ1; z <= BZ2; z++) block(x, 5, z, COBBLE);
}

// shirt / body main block
cube(BX1, 7, BZ1, BX2, 16, BZ2, SAND);

// collar (white band)
cube(BX1, 7, BZ1, BX2, 7, BZ2, SNOW);

// tie (red), popped slightly forward of collar
cube(-1, 5, BZ1 - 1, 1, 7, BZ1 - 1, BRICK);
block(0, 4, BZ1 - 1, BRICK);

// sponge holes: pits carved into the surface (front + both sides)
const frontHoles = [
  [-4, 8, BZ1], [-3, 15, BZ1], [4, 8, BZ1], [3, 7, BZ1],
  [-2, 8, BZ1], [2, 15, BZ1], [-4, 12, BZ1], [4, 13, BZ1],
  [-1, 16, BZ1], [1, 8, BZ1], [-4, 15, BZ1], [3, 12, BZ1]
];
for (const [x, y, z] of frontHoles) block(x, y, z, AIR);
const sideHoles = [
  [BX1, 9, -1], [BX1, 12, 1], [BX1, 14, -2], [BX1, 8, 2],
  [BX2, 9, -1], [BX2, 12, 1], [BX2, 14, -2], [BX2, 8, 2]
];
for (const [x, y, z] of sideHoles) block(x, y, z, AIR);

// ---- Face ----
// eyes: white bulge, blue iris, black pupil (popping forward of the face)
sphere(-2, 14, BZ1 - 2, 2, SNOW);
sphere(2, 14, BZ1 - 2, 2, SNOW);
sphere(-2, 14, BZ1 - 3, 1, GLASS);
sphere(2, 14, BZ1 - 3, 1, GLASS);
block(-2, 14, BZ1 - 4, COBBLE);
block(2, 14, BZ1 - 4, COBBLE);
line(-4, 16, BZ1 - 1, -1, 16, BZ1 - 1, COBBLE);
line(1, 16, BZ1 - 1, 4, 16, BZ1 - 1, COBBLE);

// nose
sphere(0, 12, BZ1 - 2, 1, SAND);

// mouth: recessed cavity revealed by carving the front layer
for (let x = -3; x <= 3; x++) {
  for (let y = 9; y <= 10; y++) {
    block(x, y, BZ1 - 1, BRICK); // cavity color, one layer behind face
    block(x, y, BZ1, AIR);       // open the front to reveal it
  }
}
// buck teeth sticking down from the upper lip
cube(-1, 10, BZ1, 0, 10, BZ1, SNOW);
cube(1, 10, BZ1, 2, 10, BZ1, SNOW);
// grin corners curling up
block(-4, 10, BZ1, AIR);
block(4, 10, BZ1, AIR);
block(-4, 10, BZ1 - 1, BRICK);
block(4, 10, BZ1 - 1, BRICK);

// ---- Arms ----
line(BX2, 10, 0, BX2 + 3, 10, 0, SAND);
line(BX2 + 3, 10, 0, BX2 + 3, 7, 0, SAND);
sphere(BX2 + 3, 6, 0, 1, SNOW);

line(BX1, 10, 0, BX1 - 3, 10, 0, SAND);
line(BX1 - 3, 10, 0, BX1 - 3, 7, 0, SAND);
sphere(BX1 - 3, 6, 0, 1, SNOW);

// ================= Pineapple House (background) =================
const HX = 13, HY = 0, HZ = 7;

sphere(HX, HY + 5, HZ, 5, SAND);
// ridge texture around the pineapple body
for (let i = 0; i < 10; i++) {
  const ang = (i / 10) * Math.PI * 2;
  const dx = Math.round(Math.cos(ang) * 4);
  const dz = Math.round(Math.sin(ang) * 4);
  line(HX + dx, HY + 2, HZ + dz, HX + dx, HY + 9, HZ + dz, OAK_LOG);
}
// door on the north (viewer-facing) side
cube(HX - 1, HY + 1, HZ - 5, HX + 1, HY + 3, HZ - 5, BRICK);
block(HX, HY + 3, HZ - 5, BRICK);
// round-ish window above the door
cube(HX - 1, HY + 5, HZ - 5, HX + 1, HY + 6, HZ - 5, GLASS);
block(HX, HY + 4, HZ - 5, GLASS);
block(HX, HY + 7, HZ - 5, GLASS);
// leafy crown, layered for a spiky fan look
sphere(HX, HY + 11, HZ, 3, LEAVES);
sphere(HX, HY + 13, HZ, 2, LEAVES);
line(HX, HY + 9, HZ, HX, HY + 15, HZ, LEAVES);
line(HX - 3, HY + 10, HZ, HX - 5, HY + 13, HZ, LEAVES);
line(HX + 3, HY + 10, HZ, HX + 5, HY + 13, HZ, LEAVES);
line(HX, HY + 10, HZ - 3, HX, HY + 13, HZ - 5, LEAVES);
line(HX, HY + 10, HZ + 3, HX, HY + 13, HZ + 5, LEAVES);

// ================= Bikini Bottom set-dressing =================
// coral clusters
sphere(-9, 1, 5, 2, BRICK);
sphere(-8, 2, 6, 1, BRICK);
sphere(9, 1, -1, 1, BRICK);
sphere(10, 2, 0, 2, BRICK);
// seaweed
line(-10, 1, 3, -10, 5, 3, LEAVES);
line(-11, 1, 4, -11, 4, 5, LEAVES);
line(7, 1, -3, 7, 5, -3, LEAVES);

// Gary the snail (small, off to the side)
const GX = -11, GY = 0, GZ = 0;
sphere(GX, GY + 2, GZ, 2, SNOW);
line(GX + 1, GY + 2, GZ, GX + 3, GY + 2, GZ - 1, BRICK);
line(GX + 3, GY + 2, GZ - 1, GX + 3, GY + 1, GZ - 2, BRICK);
block(GX + 2, GY + 1, GZ - 2, BRICK);
sphere(GX - 2, GY + 1, GZ, 1, SAND);
line(GX - 2, GY + 2, GZ, GX - 2, GY + 3, GZ, OAK_LOG);
line(GX - 1, GY + 2, GZ, GX - 1, GY + 3, GZ, OAK_LOG);
block(GX - 2, GY + 4, GZ, SNOW);
block(GX - 1, GY + 4, GZ, SNOW);
```
