// spider-man-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===================================================================
// SPIDER-MAN — rooftop leap, web-swing pose, NYC skyline backdrop
// ===================================================================

// ---------- helper: simple skyscraper with punched-out windows ----------
function tower(x1, z1, w, d, yBase, yTop, mainId, winId) {
  const x2 = x1 + w - 1;
  const z2 = z1 + d - 1;
  cube(x1, yBase, z1, x2, yTop, z2, mainId);
  // windows on the two faces that face the viewer/hero (south & west)
  for (let y = yBase + 2; y <= yTop - 2; y += 2) {
    for (let x = x1 + 1; x < x2; x += 2) {
      block(x, y, z1, winId);
    }
    for (let z = z1 + 1; z < z2; z += 2) {
      block(x1, y, z, winId);
    }
  }
  // roof cap trim
  hollowCube(x1, yTop + 1, z1, x2, yTop + 1, z2, STONE);
}

// ---------- background skyline (city Spidey just launched from) ----------
tower(-16, 9, 4, 4, -4, 14, BRICK, GLASS);
tower(12, 10, 4, 4, -4, 17, BRICK, GLASS);
tower(-3, 13, 4, 4, -4, 20, STONE, GLASS);
tower(-21, 14, 3, 3, -4, 10, BRICK, GLASS);
tower(16, 15, 3, 3, -4, 11, STONE, GLASS);

// water tower on tower C roof — classic NYC skyline prop
cylinder(-1, 21, 14, 2, 3, PLANKS);
cube(-2, 20, 13, 0, 20, 15, OAK_LOG);
disk(-1, 24, 14, 2, PLANKS);

// fire escape on tower A (west face)
for (let y = -2; y <= 12; y += 3) {
  cube(-16, y, 9, -16, y, 12, OAK_LOG);
}
line(-16, -2, 9, -16, 12, 9, OAK_LOG);

// hanging web strands strung between buildings (city atmosphere)
line(-13, 12, 10, -3, 15, 13, SNOW);
line(1, 14, 15, 12, 12, 12, SNOW);

// ---------- rooftop platform Spider-Man is launching from ----------
cube(-6, -4, -7, 6, 0, 2, BRICK);
hollowCube(-6, 0, -7, 6, 0, 2, COBBLE);           // ledge trim
cube(-1, 1, 0, 1, 3, 1, STONE);                    // AC / vent unit
cube(-1, 3, 0, 1, 3, 1, COBBLE);
line(4, 1, -6, 4, 4, -6, OAK_LOG);                 // rooftop antenna pole
block(4, 5, -6, GLASS);

// street lamp at rooftop edge, cheap iconic detail
line(-5, 1, -6, -5, 5, -6, OAK_LOG);
block(-5, 6, -6, SNOW);

// ===================================================================
// SPIDER-MAN FIGURE  (facing -Z, mid-lunge leap toward the viewer)
// ===================================================================

// ---- feet ----
cube(-3, 1, 0, -1, 2, 2, BRICK);      // left (back) foot, planted
cube(-3, 1, 0, -1, 1, 2, COBBLE);     // sole
cube(1, 1, -3, 3, 2, -1, BRICK);      // right (front) foot, stepped forward
cube(1, 1, -3, 3, 1, -1, COBBLE);     // sole

// ---- left leg (back leg, straight, weight bearing) ----
cube(-3, 2, 0, -1, 6, 1, BRICK);      // shin
cube(-3, 6, 0, -1, 7, 1, COBBLE);     // knee band
cube(-4, 7, -1, -1, 10, 1, BRICK);    // thigh
cube(-3, 2, 0, -3, 10, 0, GLASS);     // outer blue stripe

// ---- right leg (front leg, bent knee, lunging) ----
cube(1, 2, -3, 3, 4, -2, BRICK);      // lower shin
cube(1, 4, -4, 3, 5, -2, COBBLE);     // knee cap
cube(1, 6, -2, 4, 9, 0, BRICK);       // thigh sweeping back up to hip
cube(3, 2, -3, 3, 5, -2, GLASS);      // outer blue stripe (shin)
cube(4, 6, -2, 4, 9, 0, GLASS);       // outer blue stripe (thigh)

// ---- hips / pelvis ----
cube(-4, 10, -1, 4, 11, 1, BRICK);
cube(-4, 10, -1, -4, 11, 1, GLASS);
cube(4, 10, -1, 4, 11, 1, GLASS);

// ---- torso ----
cube(-4, 12, -2, 4, 14, 0, BRICK);    // abdomen
cube(-5, 14, -2, 5, 17, 0, BRICK);    // chest / shoulders
cube(-5, 14, -2, -5, 17, 0, GLASS);   // side stripe
cube(5, 14, -2, 5, 17, 0, GLASS);     // side stripe
cube(-4, 12, -2, -4, 14, 0, GLASS);
cube(4, 12, -2, 4, 14, 0, GLASS);

// spider emblem, chest front face
line(0, 13, -2, 0, 17, -2, COBBLE);       // body spine
line(0, 15, -2, -3, 17, -2, COBBLE);      // legs
line(0, 15, -2, 3, 17, -2, COBBLE);
line(0, 15, -2, -4, 15, -2, COBBLE);
line(0, 15, -2, 4, 15, -2, COBBLE);
line(0, 15, -2, -3, 13, -2, COBBLE);
line(0, 15, -2, 3, 13, -2, COBBLE);
line(0, 14, -2, -2, 12, -2, COBBLE);
line(0, 14, -2, 2, 12, -2, COBBLE);

// web-line texture across the suit (classic Spidey webbing)
for (let y = 2; y <= 20; y += 3) {
  line(-6, y, -1, 6, y, -1, COBBLE);
}
line(-3, 2, 1, -1, 17, -1, COBBLE);
line(1, 2, -3, 4, 17, -1, COBBLE);

// ---- left arm (relaxed, fist at hip) ----
cube(-6, 16, -1, -5, 17, 0, BRICK);   // shoulder
cube(-6, 12, -1, -5, 16, 0, BRICK);   // upper arm
cube(-6, 9, -1, -5, 12, 1, BRICK);    // forearm
cube(-6, 8, -1, -5, 9, 1, COBBLE);    // fist
cube(-6, 9, -1, -6, 17, -1, GLASS);   // stripe

// ---- right arm (thrust up/forward, mid web-shoot) ----
cube(5, 16, -2, 6, 17, -1, BRICK);    // shoulder
cube(5, 17, -2, 6, 19, -1, BRICK);    // upper arm
cube(5, 19, -4, 7, 21, -2, BRICK);    // forearm reaching forward/up
cube(6, 21, -6, 8, 22, -4, COBBLE);   // palm / fist shooting web
cube(7, 19, -3, 7, 21, -3, GLASS);    // stripe

// web strand shooting out from hand, arcing back to the launch tower
line(7, 22, -5, -3, 19, 2, SNOW);
line(-3, 19, 2, -14, 15, 9, SNOW);

// ---- neck + head ----
cube(-1, 17, -1, 1, 18, 0, BRICK);
cube(-2, 18, -2, 2, 21, 0, BRICK);           // mask
cube(-2, 19, -2, -1, 20, -2, SNOW);          // left eye lens
cube(1, 19, -2, 2, 20, -2, SNOW);            // right eye lens
line(-2, 19, -2, -3, 18, -2, COBBLE);        // eye web-lines
line(-1, 20, -2, -2, 21, -2, COBBLE);
line(2, 19, -2, 3, 18, -2, COBBLE);
line(1, 20, -2, 2, 21, -2, COBBLE);
cube(-2, 21, -1, 2, 21, 0, COBBLE);          // mask crown trim
```
