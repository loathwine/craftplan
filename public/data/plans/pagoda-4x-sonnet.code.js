// pagoda-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
// ===== clear footprint & approach (AIR is free) =====
cube(-9, -3, -12, 9, 12, 9, AIR);

// ===== platform =====
cube(-7, -2, -7, 7, -1, 7, STONE);

// approach steps (north, toward camera)
cube(-3, -2, -9, 3, -1, -8, STONE);
cube(-2, -3, -11, 2, -2, -10, STONE);

// vermillion entrance gate (torii-style)
cube(-3, -2, -12, -3, 2, -12, BRICK);
cube(3, -2, -12, 3, 2, -12, BRICK);
cube(-3, 1, -12, 3, 1, -12, BRICK);
cube(-4, 3, -12, 4, 3, -12, BRICK);
block(-4, 4, -12, BRICK);
block(4, 4, -12, BRICK);

// flanking stone lanterns
function lantern(x, z) {
  cube(x, -2, z, x, 1, z, STONE);
  block(x, 1, z, GLASS);
  cube(x - 1, 2, z - 1, x + 1, 2, z + 1, STONE);
}
lantern(-5, -9);
lantern(5, -9);

// low courtyard fence
hollowCube(-8, -1, -8, 8, -1, 8, STONE);

// ===== pagoda tiers =====
// shinbashira core (visible through door gap only, mostly hidden inside)
cube(0, 0, 0, 0, 27, 0, OAK_LOG);

function window(hw, y, mat) {
  block(0, y, -hw, mat);
  block(0, y, hw, mat);
  block(-hw, y, 0, mat);
  block(hw, y, 0, mat);
}

function tier(hw, y0, wallMat, eaveHW, eaveY, capHW, capY, isTop) {
  const y1 = y0 + (isTop ? 1 : 2);
  hollowCube(-hw, y0, -hw, hw, y1, hw, wallMat);
  // corner pillars
  cube(-hw, y0, -hw, -hw, y1, -hw, OAK_LOG);
  cube(hw, y0, -hw, hw, y1, -hw, OAK_LOG);
  cube(-hw, y0, hw, -hw, y1, hw, OAK_LOG);
  cube(hw, y0, hw, hw, y1, hw, OAK_LOG);
  // window slits (north gets bigger opening, doubles as door on ground tier)
  window(hw, y0 + 1, AIR);
  // eave + cap roof, square pyramid silhouette
  cube(-eaveHW, eaveY, -eaveHW, eaveHW, eaveY, eaveHW, COBBLE);
  cube(-capHW, capY, -capHW, capHW, capY, capHW, COBBLE);
  // upturned corner flourishes
  block(-eaveHW, eaveY + 1, -eaveHW, STONE);
  block(eaveHW, eaveY + 1, -eaveHW, STONE);
  block(-eaveHW, eaveY + 1, eaveHW, STONE);
  block(eaveHW, eaveY + 1, eaveHW, STONE);
}

tier(6, 0, BRICK, 8, 3, 6, 4, false);
// widen ground-floor door
cube(-1, 0, -6, 1, 1, -6, AIR);

tier(5, 5, PLANKS, 7, 8, 5, 9, false);
tier(4, 10, BRICK, 6, 13, 4, 14, false);
tier(3, 15, PLANKS, 5, 18, 3, 19, false);
tier(2, 20, BRICK, 4, 23, 2, 24, false);
tier(1, 25, PLANKS, 2, 27, 1, 28, true);

// ===== spire (sorin) =====
cylinder(0, 29, 0, 0, 4, OAK_LOG);
hollowSphere(0, 30, 0, 2, STONE);
sphere(0, 32, 0, 1, GLASS);
```
