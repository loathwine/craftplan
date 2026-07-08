// minion-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// Ground pedestal
disk(0, -1, 0, 6, STONE);

// Body: yellow capsule (cylinder + domed top)
cylinder(0, 1, 0, 5, 14, SAND);
sphere(0, 14, 0, 5, SAND);

// Overalls (blue), waist to chest
cylinder(0, 1, 0, 5, 7, GLASS);
hollowCylinder(0, 7, 0, 5, 1, STONE); // waistband trim

// Overall straps crossing to shoulders (front, facing north/-Z)
line(-4, 7, -2, -2, 11, -4, GLASS);
line(4, 7, -2, 2, 11, -4, GLASS);
block(-2, 11, -4, COBBLE); // strap button
block(2, 11, -4, COBBLE);  // strap button

// Chest pocket
hollowCube(-2, 3, -6, 2, 5, -5, COBBLE);
cube(-1, 3, -5, 1, 4, -5, GLASS);

// Arms
cube(-9, 7, -2, -5, 9, 0, SAND);
cube(5, 7, -2, 9, 9, 0, SAND);
// Gloves
sphere(-9, 8, -1, 2, COBBLE);
sphere(9, 8, -1, 2, COBBLE);

// Banana prop in right hand
line(8, 9, -1, 11, 11, -3, SAND);
block(8, 9, -1, OAK_LOG);
block(11, 11, -3, OAK_LOG);

// Feet
cube(-4, 0, -3, -2, 1, 0, COBBLE);
cube(2, 0, -3, 4, 1, 0, COBBLE);

// Goggle strap band around head
hollowCylinder(0, 15, 0, 5, 2, STONE);

// Goggle housing + single big eye (protrudes north, -Z, toward camera)
sphere(0, 15, -5, 3, COBBLE);
sphere(0, 15, -6, 2, SNOW);
sphere(0, 15, -7, 1, OAK_LOG);
block(0, 15, -8, COBBLE);

// Mouth (small grin)
line(-2, 12, -7, 2, 12, -7, COBBLE);
block(-2, 11, -7, COBBLE);
block(2, 11, -7, COBBLE);

// Hair tufts on top
line(-1, 19, 0, -2, 21, -1, OAK_LOG);
line(0, 19, 0, 0, 22, 0, OAK_LOG);
line(1, 19, 0, 2, 21, -1, OAK_LOG);
```
