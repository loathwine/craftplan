// sonic-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ---- clear a local footprint so trees/leaves don't poke through ----
cube(-11, 0, -8, 11, 23, 16, AIR);

// ================= SHOES =================
function shoe(sx) {
  const x1 = sx < 0 ? sx - 3 : sx;
  const x2 = sx < 0 ? sx : sx + 3;
  cube(x1, 0, -3, x2, 1, 2, BRICK);       // red shoe
  cube(x1, 2, -3, x2, 2, 2, SNOW);        // white cuff
  block(Math.round((x1 + x2) / 2), 1, -4, SAND); // gold buckle
}
shoe(-5);
shoe(2);

// ================= TORSO (blue, tapered egg) =================
cube(-3, 3, -2, 3, 3, 4, GLASS);
cube(-4, 4, -3, 4, 4, 4, GLASS);
cube(-4, 5, -3, 4, 5, 5, GLASS);
cube(-4, 6, -3, 4, 6, 5, GLASS);
cube(-4, 7, -3, 4, 7, 4, GLASS);
cube(-3, 8, -2, 3, 8, 4, GLASS);
cube(-3, 9, -2, 3, 9, 3, GLASS);
cube(-2, 10, -2, 2, 10, 3, GLASS);

// cream belly patch overlay on front face
cube(-2, 4, -3, 2, 4, -3, SAND);
cube(-2, 5, -3, 2, 5, -3, SAND);
cube(-2, 6, -3, 2, 6, -3, SAND);
cube(-2, 7, -3, 2, 7, -3, SAND);
cube(-2, 8, -2, 2, 8, -2, SAND);

// ================= ARMS + GLOVES =================
function arm(sx) {
  const x1 = sx < 0 ? sx - 1 : sx;
  const x2 = sx < 0 ? sx : sx + 1;
  cube(x1, 4, 0, x2, 9, 2, GLASS);
  cube(x1 - (sx < 0 ? 1 : 0), 3, 0, x2 + (sx < 0 ? 0 : 1), 4, 2, SNOW);
}
arm(-6);
arm(5);

// small tail nub at the back
cube(-1, 4, 5, 1, 5, 7, GLASS);
block(0, 4, 8, GLASS);

// ================= HEAD =================
cube(-2, 10, -2, 2, 10, 2, GLASS);
cube(-3, 11, -3, 3, 11, 3, GLASS);
cube(-4, 12, -3, 4, 12, 4, GLASS);
cube(-4, 13, -3, 4, 13, 4, GLASS);
cube(-4, 14, -3, 4, 14, 3, GLASS);
cube(-3, 15, -3, 3, 15, 3, GLASS);
cube(-2, 16, -2, 2, 16, 2, GLASS);
cube(-1, 17, -1, 1, 17, 1, GLASS);

// ears
cube(-5, 15, 0, -4, 15, 2, GLASS);
cube(-5, 16, 0, -4, 16, 1, GLASS);
block(-4, 17, 1, GLASS);
cube(4, 15, 0, 5, 15, 2, GLASS);
cube(4, 16, 0, 5, 16, 1, GLASS);
block(4, 17, 1, GLASS);

// muzzle (tan) + nose
cube(-2, 10, -5, 2, 12, -3, SAND);
block(0, 12, -6, STONE);

// eyes: white sclera + dark pupil
cube(-3, 13, -4, -1, 15, -4, SNOW);
cube(1, 13, -4, 3, 15, -4, SNOW);
block(-2, 13, -5, STONE);
block(2, 13, -5, STONE);

// ================= QUILLS (classic 3-spike sweep) =================
cube(-2, 16, 2, 2, 17, 5, GLASS);
cube(-1, 17, 5, 1, 18, 9, GLASS);
cube(-1, 18, 9, 1, 19, 13, GLASS);
block(0, 19, 14, GLASS);

cube(-5, 13, 2, -2, 14, 5, GLASS);
cube(-7, 13, 5, -4, 14, 8, GLASS);
cube(-9, 13, 8, -6, 14, 11, GLASS);
block(-10, 13, 12, GLASS);

cube(2, 13, 2, 5, 14, 5, GLASS);
cube(4, 13, 5, 7, 14, 8, GLASS);
cube(6, 13, 8, 9, 14, 11, GLASS);
block(10, 13, 12, GLASS);

// ================= floating gold rings (Sonic flavor) =================
hollowCylinder(-9, 3, -6, 2, 1, SAND);
hollowCylinder(9, 5, -5, 2, 1, SAND);
```
