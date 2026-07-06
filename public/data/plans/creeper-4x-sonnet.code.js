// creeper-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ==== Ground: scorch crater ====
disk(0, -1, 0, 9, STONE);
disk(0, -1, 0, 6, COBBLE);
hollowCylinder(0, -1, 0, 9, 1, STONE);

// a couple of charred stumps nearby
line(7, -1, 7, 7, 2, 7, STONE);
line(-8, -1, 5, -8, 1, 5, STONE);

// ==== Legs (4, back-right raised for a mid-stride pose) ====
cube(-5, 0, -3, -1, 5, -1, LEAVES); // front-left
cube(1, 0, -3, 5, 5, -1, LEAVES);   // front-right
cube(-5, 0, 1, -1, 5, 3, LEAVES);   // back-left
cube(1, 1, 1, 5, 5, 3, LEAVES);     // back-right (raised 1)

// dark "feet" accents
cube(-5, 0, -3, -1, 0, -1, STONE);
cube(1, 0, -3, 5, 0, -1, STONE);
cube(-5, 0, 1, -1, 0, 3, STONE);
cube(1, 1, 1, 5, 1, 3, STONE);

// ==== Body ====
cube(-5, 6, -3, 5, 19, 3, LEAVES);

// belt seam detail
hollowCube(-5, 12, -3, 5, 12, 3, STONE);
hollowCube(-5, 6, -3, 5, 6, 3, STONE);

// subtle body panel lines (vertical edge seams)
line(-5, 6, -3, -5, 19, -3, STONE);
line(5, 6, -3, 5, 19, -3, STONE);
line(-5, 6, 3, -5, 19, 3, STONE);
line(5, 6, 3, 5, 19, 3, STONE);

// ==== Head ====
cube(-5, 20, -3, 5, 29, 3, LEAVES);
hollowCube(-5, 20, -3, 5, 20, 3, STONE); // jaw seam

// ==== Face (front, z = -3) ====
// eyes (3 rows tall)
cube(-4, 25, -3, -3, 27, -3, STONE);
cube(3, 25, -3, 4, 27, -3, STONE);

// nose bridge
cube(-1, 24, -3, 1, 24, -3, STONE);

// mouth
cube(-2, 22, -3, 2, 23, -3, STONE);
cube(-1, 21, -3, 1, 21, -3, STONE);

// ==== Pre-explosion spark flashes ====
sphere(7, 25, 0, 1, SNOW);
sphere(-7, 22, 2, 1, SNOW);
sphere(0, 31, -1, 1, SNOW);
sphere(-6, 15, -5, 1, SNOW);
sphere(6, 10, 5, 1, SNOW);
```
