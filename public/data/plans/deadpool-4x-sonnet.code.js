// deadpool-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== Clear build footprint of trees/leaves, keep ground (y=-1) intact =====
cube(-7, 0, -7, 7, 20, 6, AIR);

// ================= LEGS =================
// boots
cube(-3, 0, -1, -1, 1, 2, COBBLE);
cube(1, 0, -1, 3, 1, 2, COBBLE);
// boot toes
cube(-3, 0, -2, -1, 0, -1, COBBLE);
cube(1, 0, -2, 3, 0, -1, COBBLE);
// legs (red)
cube(-3, 2, -1, -1, 6, 2, BRICK);
cube(1, 2, -1, 3, 6, 2, BRICK);
// knee straps (black)
cube(-3, 4, -1, -1, 4, 2, COBBLE);
cube(1, 4, -1, 3, 4, 2, COBBLE);
// thigh holster + strap + pistol (left leg)
line(-3, 7, -1, -3, 2, -1, COBBLE);
cube(-4, 2, -2, -3, 4, -1, STONE);

// ================= BELT =================
cube(-3, 7, -1, 3, 7, 2, COBBLE);
block(-2, 7, -2, COBBLE);
block(2, 7, -2, COBBLE);

// ================= TORSO =================
cube(-3, 8, -1, 3, 12, 2, BRICK);
// chest X-harness straps (black), front face
line(-3, 12, -1, 3, 8, -1, COBBLE);
line(3, 12, -1, -3, 8, -1, COBBLE);

// ================= SHOULDERS =================
cube(-4, 12, -1, 4, 12, 2, BRICK);

// ================= LEFT ARM (fist on hip) =================
cube(-4, 8, 0, -3, 12, 1, BRICK);
cube(-4, 7, -1, -3, 8, 0, COBBLE);

// ================= RIGHT ARM (extended, holding katana) =================
cube(3, 11, 0, 4, 12, 1, BRICK);
cube(3, 9, -1, 4, 11, 0, BRICK);
cube(3, 7, -3, 4, 9, -1, BRICK);
cube(3, 6, -4, 4, 7, -3, COBBLE);
// drawn katana blade + guard
block(4, 6, -4, COBBLE);
line(3, 6, -4, 3, 3, -7, STONE);

// ================= HEAD / MASK =================
cube(-2, 13, -1, 2, 16, 2, BRICK);
cube(-1, 17, 0, 1, 17, 1, BRICK);
// eye patches (white)
cube(-2, 14, -1, -1, 15, -1, SNOW);
cube(1, 14, -1, 2, 15, -1, SNOW);
// mask seam / mouth line (black)
line(0, 13, -1, 0, 16, -1, COBBLE);
line(-1, 13, -1, 1, 13, -1, COBBLE);

// ================= BACK: CROSSED SHEATHED KATANAS =================
line(-3, 8, 3, 3, 18, 1, OAK_LOG);
line(3, 8, 3, -3, 18, 1, OAK_LOG);
// pommel caps
block(-3, 19, 1, COBBLE);
block(3, 19, 1, COBBLE);
// exposed blade tips above shoulders
line(-3, 19, 1, -3, 20, 0, STONE);
line(3, 19, 1, 3, 20, 0, STONE);
```

I designed Deadpool as a tall (~20-block) standing figure facing north, built from a cleared footprint of the local forest terrain: red/black suit torso and legs with a black chest-strap X, mask with the signature white eye patches and center seam, an akimbo left fist-on-hip, a right arm extended forward gripping a drawn katana blade, a holstered pistol on the thigh, and two crossed sheathed katanas on his back with blade tips poking above the shoulders for silhouette.
